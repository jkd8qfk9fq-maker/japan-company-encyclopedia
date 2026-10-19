import Link from "next/link";
import { notFound } from "next/navigation";
import { loadRun, NEXT_ACTION, STATUS_LABEL } from "@/lib/admin/autopilot-queue";

export const metadata = { title: "登録キュー: 企業" };

/** One company in the registration queue: where it is, why, how many attempts, and the sheet the operator confirms. */
export default async function AdminQueueCompany({ params }: PageProps<"/admin/queue/[company-id]">) {
  const id = (await params)["company-id"];
  const run = loadRun(id);
  if (!run) notFound();
  const { record, sheet, events } = run;
  const hash = record.review?.hash;

  return (
    <div>
      <p className="text-sm"><Link href="/admin/queue" className="link-ink">← 登録キュー</Link></p>
      <h1 className="mt-3 font-serif text-3xl font-semibold">{record.id}</h1>
      <p className="mt-2 text-sm">
        状態: <strong>{STATUS_LABEL[record.status]}</strong>（工程: {record.step}）
        {NEXT_ACTION[record.status] && <> ／ 次: {NEXT_ACTION[record.status]}</>}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        試行: {Object.entries(record.attempts).filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`).join("、") || "なし"} ／ モデル {record.cost.calls} 回・概算 ${record.cost.usd.toFixed(2)}
      </p>

      {record.holds.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">保留の理由</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{record.holds.map((h, i) => <li key={i}><span className="font-mono text-xs">{h.kind}</span> — {h.reason}</li>)}</ul>
        </section>
      )}

      {record.errors.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">失敗の記録（{record.errors.length} 件）</h2>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">{record.errors.slice(-10).map((e, i) => <li key={i}>{e.at.slice(5, 16).replace("T", " ")} {e.step} [{e.kind}] {e.message.slice(0, 200)}</li>)}</ul>
        </section>
      )}

      {sheet ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">確認シート</h2>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md border border-border p-4 text-xs leading-6">{sheet}</pre>
          {hash && record.status !== "registered" && (
            <p className="mt-3 text-sm">
              登録するには、ローカルで <code className="text-xs">node scripts/pipeline/autopilot.mjs approve {record.id} --confirm --hash {hash}</code>
            </p>
          )}
        </section>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">確認シートはまだありません（状態が確認待ちになると作られます）。</p>
      )}

      <section className="mt-6">
        <h2 className="text-lg font-semibold">履歴</h2>
        <ul className="mt-2 space-y-1 font-mono text-xs text-muted-foreground">{events.map((e, i) => <li key={`${e.at}-${i}`}>{e.at.slice(5, 16).replace("T", " ")} {e.type}</li>)}</ul>
      </section>
    </div>
  );
}
