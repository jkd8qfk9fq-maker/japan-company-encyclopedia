"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { verifyPrediction, type PredictionData } from "@/lib/predictions";
import { predictionsStore } from "@/lib/storage/stores";
import { loadPredictions } from "./load";
import { VerificationBlock } from "./prediction-panel";

/**
 * The reader's own checks, at the head of the digest (JCE-083): predictions whose filing has now been read
 * into the entry are shown with the printed figures they are checked against; predictions still waiting name
 * the company they wait on. Nothing renders for a reader who has predicted nothing — the digest below is the
 * same for everyone. Predictions live in this browser only.
 */
export function DigestVerifications() {
  const predictions = useLocalStore(predictionsStore);
  const [data, setData] = useState<PredictionData | null>(null);

  useEffect(() => {
    loadPredictions().then(setData, () => setData(null));
  }, []);

  if (predictions.length === 0 || !data) return null;

  const checked: { key: string; companyId: string }[] = [];
  const waiting: { companyId: string; name: string }[] = [];
  const seenWaiting = new Set<string>();
  for (const p of predictions) {
    const company = data[p.companyId];
    if (!company) continue;
    const v = verifyPrediction(p, company);
    if (v.status === "verified") checked.push({ key: `${p.companyId}-${p.metric}-${p.baselinePeriodEnd}`, companyId: p.companyId });
    else if (v.status === "pending" && !seenWaiting.has(p.companyId)) {
      seenWaiting.add(p.companyId);
      waiting.push({ companyId: p.companyId, name: company.name });
    }
  }
  if (checked.length === 0 && waiting.length === 0) return null;

  const byKey = new Map(predictions.map((p) => [`${p.companyId}-${p.metric}-${p.baselinePeriodEnd}`, p]));

  return (
    <section aria-label="あなたの予測の照合" className="mt-10">
      <h2 className="font-serif text-[1.375rem] font-semibold">
        あなたの予測の照合
        <span className="figures ml-3 text-sm font-normal text-muted-foreground">{checked.length} 件</span>
      </h2>
      {checked.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {checked.map(({ key, companyId }) => {
            const p = byKey.get(key)!;
            return <VerificationBlock key={key} prediction={p} data={data[companyId]!} companyName={data[companyId]!.name} />;
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">照合できる開示は、まだありません。</p>
      )}
      {waiting.length > 0 && (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          開示を待っている予測：
          {waiting.map((w, i) => (
            <span key={w.companyId}>
              {i > 0 && "、"}
              <Link href={`/companies/${w.companyId}#prediction`} className="underline underline-offset-2 hover:text-foreground">
                {w.name}
              </Link>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
