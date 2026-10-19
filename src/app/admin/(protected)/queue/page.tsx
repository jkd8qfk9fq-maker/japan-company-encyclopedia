import Link from "next/link";
import { loadQueueView, NEXT_ACTION, STATUS_LABEL } from "@/lib/admin/autopilot-queue";

export const metadata = { title: "登録キュー" };

/**
 * The registration autopilot's queue, read-only. The autopilot (scripts/pipeline/autopilot.mjs) runs on the machine
 * that holds the evidence; this page shows its records where that machine's `npm run dev` runs. On the production
 * server there are none, and it says so. Approving a company is a command, not a button: registering writes
 * src/data, and production writes no content (JCE-016).
 */
export default function AdminQueue() {
  const view = loadQueueView();

  if (!view.available) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold">登録キュー</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          登録キューの記録がありません。この画面は、登録を実行するマシン（<code className="text-xs">pipeline/autopilot/</code> がある場所）でローカルに <code className="text-xs">npm run dev</code> を起動したときに表示されます。本番のサーバーには記録がありません（本番はコンテンツも作業の記録も持ちません）。
        </p>
      </div>
    );
  }

  const tally = view.records.reduce<Record<string, number>>((t, r) => ((t[r.status] = (t[r.status] ?? 0) + 1), t), {});
  const spent = view.records.reduce((s, r) => s + (r.cost?.usd ?? 0), 0);
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">登録キュー</h1>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
        登録の自動化（autopilot）の記録です。モデルを使うのは本文の2か所だけで、数値・重複・状態・検査・確認シートは機械が作ります。登録は、確認シートを読んだうえでのコマンドです。
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
        {(["ready", "ready-with-flags", "held", "paused", "registered"] as const).map((s) => (
          <div key={s}><dt className="text-xs text-muted-foreground">{STATUS_LABEL[s]}</dt><dd className="figures text-2xl font-semibold">{tally[s] ?? 0}</dd></div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-muted-foreground">
        モデルの概算費用の合計 ${spent.toFixed(2)} ／ content:check {view.lastCheck ? `${view.lastCheck.at.slice(0, 16).replace("T", " ")}（${view.lastCheck.ok ? "合格" : "不合格"}）` : "未実施"}
      </p>

      <h2 className="mt-8 text-lg font-semibold">あなたが確認するもの</h2>
      {view.attention.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">ありません。</p>
      ) : (
        <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
          {view.attention.map((r) => (
            <li key={r.id} className="py-3">
              <p>
                <Link href={`/admin/queue/${r.id}`} className="font-medium hover:underline">{r.id}</Link>
                <span className="ml-2 rounded border border-border px-2 py-0.5 text-xs">{STATUS_LABEL[r.status]}</span>
              </p>
              {r.holds.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{r.holds.map((h) => h.reason).join(" ／ ").slice(0, 280)}</p>}
              {r.pause && <p className="mt-1 text-xs text-muted-foreground">{r.pause.kind}{r.pause.hint ? `: ${r.pause.hint}` : ""}</p>}
              <p className="mt-1 text-xs">→ {NEXT_ACTION[r.status]}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-semibold">すべて</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
              <th scope="col" className="py-2 pr-4 font-semibold">企業</th>
              <th scope="col" className="py-2 pr-4 font-semibold">状態</th>
              <th scope="col" className="py-2 pr-4 font-semibold">工程</th>
              <th scope="col" className="py-2 pr-4 font-semibold">モデル</th>
              <th scope="col" className="py-2 font-semibold">更新</th>
            </tr>
          </thead>
          <tbody>
            {view.records.map((r) => (
              <tr key={r.id} className="border-b border-border align-top">
                <td className="py-2 pr-4"><Link href={`/admin/queue/${r.id}`} className="font-mono text-xs hover:underline">{r.id}</Link></td>
                <td className="py-2 pr-4">{STATUS_LABEL[r.status]}</td>
                <td className="py-2 pr-4 text-xs text-muted-foreground">{r.step}</td>
                <td className="figures py-2 pr-4 text-xs">{r.cost.calls} 回・${r.cost.usd.toFixed(2)}</td>
                <td className="figures py-2 text-xs">{r.updatedAt.slice(0, 16).replace("T", " ")}</td>
              </tr>
            ))}
            {view.records.length === 0 && <tr><td colSpan={5} className="py-4 text-muted-foreground">まだ処理した企業がありません。</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-lg font-semibold">最近の出来事</h2>
      <ul className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
        {view.history.slice(0, 25).map((e, i) => (
          <li key={`${e.at}-${i}`}>{e.at.slice(5, 16).replace("T", " ")} {e.id} {e.type}{typeof e.reason === "string" ? ` — ${e.reason.slice(0, 80)}` : typeof e.message === "string" ? ` — ${e.message.slice(0, 80)}` : ""}</li>
        ))}
      </ul>
    </div>
  );
}
