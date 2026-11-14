"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import type { DiscoverCard } from "@/lib/discover";
import { discoveredStore } from "@/lib/storage/stores";
import { loadDiscoverFeed } from "./discover-data";

/** マイ企業図鑑 (JCE-046): the reader's met companies, grouped by industry, with how much of each is still unmet. */
export function DiscoverCollection() {
  const [cards, setCards] = useState<DiscoverCard[] | null>(null);
  const [failed, setFailed] = useState(false);
  const discovered = useLocalStore(discoveredStore);

  useEffect(() => {
    loadDiscoverFeed().then(setCards, () => setFailed(true));
  }, []);

  const groups = useMemo(() => {
    if (!cards) return [];
    const met = new Set(discovered);
    const byIndustry = new Map<string, { id: string; name: string; total: number; met: DiscoverCard[] }>();
    for (const c of cards) {
      const g = byIndustry.get(c.industry.id) ?? { id: c.industry.id, name: c.industry.name, total: 0, met: [] };
      g.total++;
      if (met.has(c.id)) g.met.push(c);
      byIndustry.set(c.industry.id, g);
    }
    // Industries the reader has started first, then the rest by size: the collection shows progress, then what is left.
    return [...byIndustry.values()].sort((a, b) => Number(b.met.length > 0) - Number(a.met.length > 0) || b.total - a.total);
  }, [cards, discovered]);

  if (failed) return <p className="text-sm text-muted-foreground">図鑑を読み込めませんでした。通信状態を確かめて、もう一度開いてください。</p>;
  if (!cards) return <p className="text-sm text-muted-foreground">読み込んでいます…</p>;

  const metCount = groups.reduce((sum, g) => sum + g.met.length, 0);
  const started = groups.filter((g) => g.met.length > 0).length;

  return (
    <div>
      <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">出会った会社</dt>
          <dd className="mt-1 font-serif text-[2rem] leading-none font-semibold">
            <span className="figures">{metCount}</span>
            <span className="ml-1 text-sm text-muted-foreground">/ {cards.length}社</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-muted-foreground">足を踏み入れた業界</dt>
          <dd className="mt-1 font-serif text-[2rem] leading-none font-semibold">
            <span className="figures">{started}</span>
            <span className="ml-1 text-sm text-muted-foreground">/ {groups.length}業界</span>
          </dd>
        </div>
      </dl>

      {metCount === 0 && (
        <p className="mt-8 text-sm">
          まだ記録がありません。
          <Link href="/discover" className="ml-1 font-semibold underline underline-offset-4">
            DISCOVER で会社に出会う
          </Link>
        </p>
      )}

      <ul className="mt-8 space-y-6">
        {groups.map((g) => (
          <li key={g.id}>
            <div className="flex items-baseline justify-between gap-3">
              <Link href={`/industries/${g.id}`} className="font-semibold hover:underline">
                {g.name}
              </Link>
              <span className="figures text-xs text-muted-foreground">
                {g.met.length} / {g.total}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
              <div className="h-full rounded-full bg-foreground" style={{ width: `${(g.met.length / g.total) * 100}%` }} />
            </div>
            {g.met.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.met.map((c) => (
                  <li key={c.id}>
                    <Link href={`/companies/${c.id}`} className="inline-flex min-h-8 items-center rounded-full border border-border bg-card px-3 text-xs hover:border-foreground">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
