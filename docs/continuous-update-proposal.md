# 新規データの自動検知・継続更新 — 現状調査と提案（2026-10-13）

> **技術レビュー済み（2026-10-13）**: `docs/continuous-update-review.md`。書類の変更・取下げの検知、全書類への判断（`disposition`）、同時実行の抑止、**登録済みの会社を更新する実行器が無いこと**など、実装前に直す点がある。決めること（推奨案つき）は `docs/continuous-update-decisions.md`。

**状態: 提案。コードは追加していない。** 先に既存コードを調べ、実現できる範囲と、人が決めることを分けた。

## 1. 調査で分かったこと

### 1.1 そのまま使えるもの（すべて `scripts/` の既存コード）

| 既にあるもの | どこ | 今回の役割 |
|---|---|---|
| EDINET 日次索引の取得・検証・確定判定 | `scripts/research/edinet.mjs` の `documentsOn` / `indexProblem` / `auditIndexCache` / `ensureIndexCache` | 「その日の索引は確定しているか」の判定（`processDateTime` が翌日以降）、欠落・破損・確定前の日の再取得 |
| 訂正有報の逆引き索引 | `scripts/research/amendments.mjs`（`parentDocID` → 訂正の列、`checkedThrough`、`refreshFromEdinet`） | 訂正と原本の関係を保つ |
| 訂正と原本の差分の分類 | `classifyAmendment`（record-only / text-change / financial-change） | 「既存の財務との差分を確認」 |
| 登録済み会社への影響の推奨 | `scripts/pipeline/amendment-audit.mjs`（`auditAction`、`--refresh`） | 訂正で何をするか |
| 有報後の変更の候補（商号変更・公開買付・提出の停止） | `scripts/pipeline/post-filing.mjs` | 識別情報の変更の検知 |
| 新しい有報への乗り換え、重複・不整合の検査、予約 | `advance.mjs`、`queue.mjs check`、`company-state.mjs` | 冪等な処理、二重処理の防止 |
| 登録の中断からの復旧 | `recover-registration.mjs` | 途中停止後の安全な再開 |
| 本番の保存先の型（Postgres と、開発用のファイルの2実装） | `src/lib/reports/`（`getReportRepository`）、`db/migrations/`、`pg` | 監視状態の保存方式をそのまま踏襲できる |
| 管理画面（ログイン済み・本番は読み取り専用） | `src/app/admin/(protected)/` | 運用監視ページの置き場 |

### 1.2 制約（設計を決める事実）

1. **本番はコンテンツを書き込まない。** 公開コンテンツは git 上の JSON で、変更は人がレビューして commit する（CLAUDE.md 不変条件9、JCE-016）。サーバーが自動で「登録」して公開する構成は、この決定の変更になる。
2. **本文（事業構造・沿革・関連企業）は、モデルの agent が書いている。** サーバーの定期ジョブでは動かせない。機械で完結できるのは、数値（figures-only）、訂正の差分、識別情報の変更の検知まで。
3. **パイプラインの状態は手元のファイル**（`pipeline/state`・`results`・`staging` は git 管理外）で、本番からは見えない。
4. **本番の定期実行の仕組みは未設定。** `vercel.json`・GitHub Actions はない。調べた範囲では、Vercel Cron は Hobby プランが1日1回まで、Pro は1分間隔まで、認証は `CRON_SECRET`（[参考](https://skills.sh/vercel/vercel-plugin/cron-jobs)）。プランの確認は人が行う。
5. **EDINET の API キーは本番に設定されていない（`.env.example` にも項目がない）。** 本番の関数のファイルシステムは消える（レポートの保存先を Postgres にしたのと同じ理由）。したがって監視状態は Postgres に置く。
6. **EDINET の日次索引は、書類が出た日の翌日 0:00〜0:05（日本時間）に確定する**（今回のキャッシュで確認した `processDateTime`）。当日の索引は途中経過で、後から書類が増える。

## 2. 提案する構成（3層。新しい基盤は入れない）

```text
 [A 検知] 本番 cron → /api/cron/edinet-watch      …軽い。Postgres に台帳を書くだけ
     │  job（新規有報／訂正／識別情報の候補）
     ▼
 [B 処理] 手元（または後から GitHub Actions）の watch-sync  …重い。XBRL取得・抽出・照合・差分
     │  検証に通ったものだけ staging / 提案（PR）、通らなければ needs-review
     ▼
 [C 公開] 今までどおり人がレビューして commit  …JCE-016 の PR 経路ができるまで変更しない
```

A は本番で独立して動く（PC を起動し続けない）。B は既存のパイプラインを使う。C は変えない。**「検証に失敗したデータを自動公開しない」は、C を変えないことで保証される。**

### 2.1 保存方式（Postgres、`db/migrations/0003-edinet-watch.sql`）

| テーブル | 主なカラム | 役割 |
|---|---|---|
| `edinet_days` | `date` PK、`status`（final / partial / failed）、`doc_count`、`process_datetime`、`attempts`、`last_error`、`fetched_at` | 日ごとの確認台帳。`status` は `indexProblem` と同じ規則で決める |
| `edinet_filings` | `doc_id` PK、`parent_doc_id`、`doc_type_code`、`sec_code`、`edinet_code`、`filer_name`、`submit_datetime`、`period_end`、`doc_description`、`first_seen_at` | 検知した書類。同じ書類は1行（重複処理の防止）。訂正は `parent_doc_id` で原本につながる |
| `watch_jobs` | `id`、`doc_id`、`kind`（new-filing / amendment / identity-change）、`status`（queued / running / done / failed / needs-review）、`attempts`、`locked_until`、`last_error`、`result_ref`、`created_at`、`updated_at`。**`unique(doc_id, kind)`** | 処理の単位。冪等性は一意制約で持つ |
| `watch_runs` | `id`、`started_at`、`finished_at`、`ok`、`days_scanned`、`docs_new`、`error`、`next_due_at` | 実行履歴。最終成功時刻・次回予定・停止の検知に使う |

開発用には `src/lib/reports/` と同じく、ファイル実装（`.data/`）を用意する。

### 2.2 検知アルゴリズム（A）

1. **監視位置は「最終日」の1点ではなく、台帳から導く。** `confirmedThrough` ＝ 起点から連続して `final` で、かつその日の全書類が `edinet_filings` と job の判断（処理する／対象外）まで記録済みの最後の日。台帳に書いたあとでしか進めない（1トランザクション）。
2. 各回は、`confirmedThrough` の翌日から昨日までの未確認日と、直近3日（重なり。途中経過だった日の取り直し）を走査する。1回の上限は日数で区切る（関数の実行時間に収める）。残りは次回に回る。
3. 日ごとに `documentsOn`（既存の検証）で取得する。確定前なら `partial` で保存し、**書類は検知として記録してよいが監視位置は進めない**。取得に失敗した日は `failed`、既存の台帳行は消さない。
4. 書類を `edinet_filings` に upsert する。初めて見た書類だけ job を作る（`unique(doc_id, kind)` で重複しない）:
   - 有報（120）: `new-filing`。同じ会社の登録済みの出典より新しければ、後段で乗り換えの対象になる。
   - 訂正（130）: `amendment`。`parent_doc_id` で原本を保つ。**会社が登録済みかどうかに関係なく全件**を見るので、原本が古くても見落とさない。
   - 商号変更・公開買付: 既存の `post-filing` と同じ規則で `identity-change`。
5. `watch_runs` に実行結果と `next_due_at` を書く。

### 2.3 処理（B）と復旧方針

- B は job を取る: `update … set status='running', locked_until=now()+interval '30 min' where id=? and status='queued'`（`returning` が空なら他が取った）。期限切れの `running` は `queued` に戻す（中断からの再開）。
- 失敗は `attempts` を増やし、3回で `needs-review`（既存の `setStage` と同じ規則）。
- B の中身は既存のコマンドをそのまま呼ぶ: 新規有報 → `advance.mjs`（未昇格は自動で乗り換え、図表のみの登録は `register-figures`）、訂正 → `classifyAmendment`、登録の中断 → `recover-registration.mjs`。
- **検証（`verify-financials`・`check-prose-figures`・`data-integrity`、財務値・対象期間・連結・単位・出典の照合）に失敗したものは `src/data` に入らず、job は `needs-review`**（`finalize.mjs` は先に git 管理外の staging を書いてから検証する。レビュー R13）。 昇格済みの会社の古い有報、訂正で数値が変わる場合も、**自動では書き換えず** `needs-review`（今の `queue check` の規則と同じ）。
- API 障害後: 次回の走査が未確認日を拾い直す（`failed` と `partial` は `final` になるまで残る）。

### 2.4 運用監視（管理画面 `/admin/monitoring`）

既存の管理画面の中に読み取り専用のページを1つ足し、`watch_runs`・`edinet_days`・`watch_jobs` から次を出す。最終監視成功時刻、次回予定、新規書類の検知件数（期間別）、job の状態別件数（未処理／処理中／完了／失敗）、訂正書類の処理状況（原本との対応と分類）、最終データ更新日時、API エラーと再試行回数、手動確認が必要な案件（`needs-review` の一覧）。

**停止の検知**: `now() > next_due_at + 猶予` なら「監視停止」、連続失敗が N 回なら「連続失敗」を、管理画面の上部に出す。加えて `/api/health/edinet-watch`（停止中なら 503）を用意する。既存の外部の稼働監視サービスがあればそこから定期的に見に行ける。**メール・チャットへの通知は、送り先の選定が必要なので人の判断**（コードは入れない）。

## 3. 情報源の分離

| 対象 | 情報源 | 頻度 | 検知の方法 | 公開の条件 |
|---|---|---|---|---|
| 財務（売上高・純利益・5年表） | EDINET 有報・訂正有報 | 毎日（上の cron） | 日次索引、`parent_doc_id`、`classifyAmendment` | 検証に全部通ってから。今は人が commit |
| 上場状況 | **JPX**（上場会社一覧、上場廃止・新規上場の公表）。EDINET には「上場」の状態そのものは出ない | 別 job・月次または公表のたび（API の有無を未確認。調査が必要） | 前回の一覧との差分（追加・消滅） | **推測で確定しない。** 差分は `needs-review`、人が確認してから反映 |
| 事業内容・沿革・関連企業 | 有報本文（年1回）、臨時報告書、会社の公式ページ | 有報の提出ごと。臨時報告書は号が多すぎて目印にならない（`post-filing.mjs` の注記） | 新しい有報の検知 → 「再調査が必要」の job | **モデルの agent と品質確認が要る。** 自動公開しない |
| 商号変更・公開買付 | EDINET（提出者名、公開買付関連書類）。上場廃止は JPX | 毎日（財務の cron と同じ走査） | `post-filing.mjs` の規則 | needs-review |

## 4. 段階的な実装案（小さい順）

1. **台帳と検知の核**（ファイル実装＋純関数＋CLI。ローカルで動く）: `watch` の純関数（走査計画、監視位置の導出、job の生成）、`scripts/pipeline/watch.mjs`、テスト。既存の `documentsOn` を差し込み式の保存先（`DayIndexStore`）に分けるのが唯一の既存コードの変更で、ファイル実装は今の挙動のまま。
2. **Postgres 実装・cron ルート・管理画面**: `0003` の migration、`/api/cron/edinet-watch`（`CRON_SECRET` 検証）、`vercel.json`、`/admin/monitoring`、`/api/health/edinet-watch`。
3. **B の接続**: job を取って既存コマンドを呼ぶ `watch-sync.mjs`。
4. **JPX 監視**（別 job）と、PR 作成による公開経路（JCE-016）。

## 5. 必須テストの対応（既存の流儀: vitest、一時ディレクトリ、注入）

| 要件 | テスト |
|---|---|
| 新規書類を一度だけ登録 | 同じ日の索引を2回流し、`edinet_filings` が1行・job が1件 |
| 同じ監視の再実行で二重登録しない | 2回走査して台帳・job が変わらない（一意制約） |
| 訂正から原本を追跡 | 130 の行から `parent_doc_id` で原本を引く。原本が古くても job ができる |
| API 障害後に未処理期間を回収 | 途中の日で `fetch` を失敗させ、監視位置が進まないこと、次回に回収されること |
| 処理途中の停止から再開 | `running` で `locked_until` を過ぎた job が `queued` に戻り、1回だけ完了する |
| 監視対象期間をまたぐ書類 | 確定前の日の書類は検知されるが位置が進まず、翌日に確定してから進む |
| 検証失敗で公開データを上書きしない | 検証を失敗させ、`src/data` が1バイトも変わらず job が needs-review になる |
| 停止の検知 | `next_due_at` を過ぎた状態で `/api/health/edinet-watch` が 503、管理画面に停止が出る |

## 6. 人が決めること

1. **サーバーが「登録」までしてよいか。** 今の決定（不変条件9、JCE-016）は人がレビューして commit する。提案は、サーバーは検知と記録まで、公開は変えない。変えるなら decisions に記録する。
2. **定期実行の場所とプラン**（Vercel Cron の Hobby は1日1回、Pro は1分間隔。ほかの選択肢もある）。提案は、Hobby なら毎日 1:30（日本時間）に1回で足りる（有報の検知の遅れは最大1日）。Pro なら平日 9〜20 時に1時間ごと（途中経過の検知）と、毎日 1:30 の確定走査。
3. **本番の環境変数**: `EDINET_API_KEY`、`CRON_SECRET`。
4. **通知の送り先**（メール・チャット・稼働監視）。
5. **B をどこで動かすか**（手元の PC、GitHub Actions、他）。GitHub に出す場合は、トークンの発行も人が行う。
6. **JPX の情報源**（提供形式、利用条件、頻度）の確認。
