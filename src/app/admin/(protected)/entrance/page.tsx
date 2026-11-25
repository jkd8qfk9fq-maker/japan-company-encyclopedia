import {
  ENTRANCE_STATUS_LABEL,
  ENTRANCE_STATUSES,
  MAX_ENTRANCE_MEMO_LENGTH,
  loadEntranceView,
  type EntranceEntry,
} from "@/lib/admin/entrance-form";
import { updateEntranceEntry } from "../actions";

export const metadata = { title: "入口フォーム" };

/**
 * The applications to the free one-company analysis trial, and the operator's handling of each.
 * The answers live in a git-ignored local state file (they hold contact emails; JCE-115): on the
 * production server there is no file, and this page says so instead of showing an empty funnel.
 * Saving a status or memo is a local-dev write, guarded in the action like the content editor.
 */
export default function AdminEntrance() {
  const view = loadEntranceView();

  if (!view.available) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold">入口フォーム</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          申込の記録がありません。この画面は、回答を同期したマシン（<code className="text-xs">.data/entrance-form.json</code> がある場所）でローカルに{" "}
          <code className="text-xs">npm run dev</code> を起動したときに表示されます。本番のサーバーには記録がありません（回答には連絡先メールが含まれるため、記録はローカルにだけ置きます）。
          同期は <code className="text-xs">npm run admin:sync-entrance-form</code> で、毎朝の新規回答チェックと同じ Google フォームの読み取り結果を取り込みます。
        </p>
      </div>
    );
  }

  const stats = [
    { label: "累計回答数", value: view.summary.total },
    { label: "未対応", value: view.summary.pending },
    { label: "β案内希望", value: view.summary.betaInterest },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">入口フォーム</h1>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
        無料の1社分析体験への申込です。体験の提供とβの案内は手動運用なので、対応したらステータスを更新してください。
        {view.syncedAt && <> 最終同期：<span className="figures">{view.syncedAt.slice(0, 16).replace("T", " ")} UTC</span></>}
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-border p-5">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="figures mt-1 text-3xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      {view.entries.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">申込はまだありません。</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {view.entries.map((entry) => (
            <EntranceRow key={entry.responseId} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  );
}

function EntranceRow({ entry }: { entry: EntranceEntry }) {
  return (
    <li className="rounded-md border border-border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">{entry.company}</h2>
        <p className="figures text-xs text-muted-foreground">{entry.submittedAt.slice(0, 16).replace("T", " ")} UTC</p>
      </div>
      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <span>
          β案内：<span className={entry.betaInterest ? "font-semibold" : "text-muted-foreground"}>{entry.betaInterest ? "希望する" : "今はしない"}</span>
        </span>
        <span>
          状態：<span className="font-semibold">{ENTRANCE_STATUS_LABEL[entry.status]}</span>
        </span>
        <span className="text-muted-foreground">{entry.email}</span>
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <form action={updateEntranceEntry} className="rounded-md border border-border p-4">
          <input type="hidden" name="id" value={entry.responseId} />
          <label className="block text-sm font-semibold">
            ステータス
            <select name="status" defaultValue={entry.status} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-2 text-sm font-normal">
              {ENTRANCE_STATUSES.map((s) => (
                <option key={s} value={s}>{ENTRANCE_STATUS_LABEL[s]}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="mt-3 h-11 rounded-md border border-border px-4 text-sm hover:border-foreground">ステータスを更新</button>
        </form>

        <form action={updateEntranceEntry} className="rounded-md border border-border p-4">
          <input type="hidden" name="id" value={entry.responseId} />
          <label className="block text-sm font-semibold">
            メモ
            <textarea
              name="memo"
              defaultValue={entry.memo}
              maxLength={MAX_ENTRANCE_MEMO_LENGTH}
              rows={3}
              placeholder="案内を送った日、体験で扱った決算、返信の内容など"
              className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm leading-6 font-normal"
            />
          </label>
          <button type="submit" className="mt-2 h-11 rounded-md border border-border px-4 text-sm hover:border-foreground">メモを保存</button>
        </form>
      </div>
    </li>
  );
}
