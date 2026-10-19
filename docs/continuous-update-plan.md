# 自動検知・継続更新 実装計画（2026-10-18）

**更新（2026-10-18、JCE-022）: 検知の実行者は GitHub Actions に一本化した（決定1）。Postgres の台帳・cron・管理画面の段階1〜4は作っていない（検知は `refresh-financials` で足りており、新規登録のキューはローカルのファイル。`docs/auto-registration.md`）。必要になったときの設計としてこの文書を残す。**

**状態（作成時）: 計画と調査のみ。コード・設定・データは変更していない。** 基は `docs/continuous-update-proposal.md`（2026-10-13）、
`docs/continuous-update-review.md`（R1〜R20）、`docs/continuous-update-decisions.md`。その後の決定（JCE-018〜021）と実装
（`refresh-financials`、Actions の検知、`sync-listing`、公開ライン、下書きコンソール）を反映した。
**登録済みの会社データの登録・公開は、この計画では行わない**（第1波の登録は運営者の確認待ちのまま）。

## 0. 提案書（10-13）から変わったこと

| 変化 | 影響 |
|---|---|
| JCE-018: 毎日 07:00 JST の **GitHub Actions が検知専用**で動いている（`refresh-financials.yml`、権限 `contents: read`、秘密は `EDINET_API_KEY` のみ、`src/data` の指紋検査、`tests/refresh-workflow.test.ts` が性質を固定） | 提案書の「Vercel Cron のルートが検知する」は、**検知の実行者が2つになる**。EDINET の呼び出しと鍵が2か所に増える。**実行者は1つに決める**（第7節 決定1） |
| `refresh-financials` が「登録済みの会社に新しい年度を加える」を実装済み（`--tier all` で figures-only も対象） | レビュー R10（更新の実行器が無い）の ②（figures-only の年次更新）は**大部分が解決**。published／needs-attention の本文の更新（③）は引き続き人と agent の作業 |
| `ensureIndexCache` が失敗理由（`reasons`）を返し、夜間バッチを待てる（JCE-020） | 台帳の `last_error` / 日の状態の語彙はこれを**そのまま使う**（新しい分類を作らない） |
| `sync-listing`（EDINET コードリスト → `pipeline/listing.tsv`） | 上場状況の情報源が1つ増えた。取得は手動（`--file`）が運営者の決定。JPX は未調査 |
| `/admin/drafts`、`release.ts`、`CompanyView` | 管理画面の作り方（Server Component、`requireAdmin`、強制動的、読み取り専用）の実例が増えた |
| 本番の保存先は `DATABASE_URL`（Postgres）のみ。`vercel.json`・route handler は**まだ 0 件** | 最初の route handler になる。**実装前に `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` を読む**（AGENTS.md） |

## 1. 再利用・不足・変更の一覧

### 1.1 再利用する（変更しない）

| 機能 | 場所 | 使う場面 |
|---|---|---|
| 日次索引の検証と確定判定 | `edinet.mjs` `indexProblem`（`processDateTime` が翌日以降＝確定） | 日の状態（final / partial / failed）の唯一の規則 |
| 欠落・破損・確定前の日の取り直し、理由の分類、夜間バッチ待ち | `auditIndexCache` / `ensureIndexCache` / `classifyIndexFailure` / `scrubSecrets` | 走査の取得層。失敗理由は `reasons` の語彙をそのまま保存 |
| 訂正の逆引き（`parentDocID`）、`checkedThrough` | `amendments.mjs` `amendmentRows` / `addAmendments` / `amendmentsOf` | 訂正→原本の対応。台帳の `parent_doc_id` の元 |
| 訂正の分類（record-only / text-change / financial-change） | `amendments.mjs` `classifyAmendment`、`amendment-audit.mjs` `auditAction` | 訂正 job の処理。**推奨を作るだけ** |
| 新しい年度を `financials` に加える計画・ゲート・report | `refresh-financials.mjs` `newestFilings` / `planFinancialsRefresh` / `refreshOne` / `buildReport` / `exitCodeFor` | 新規有報 job の処理（登録済みの会社）。dry-run が「更新候補」そのもの |
| 識別情報の変更（商号変更・公開買付・提出の停止） | `post-filing.mjs` `scanPostFilingEvents` | `identity-change` job。確認済みの記録は `advance.mjs --ack-post-filing` |
| 重複・予約・排他、再開 | `company-state.mjs`（`withLock`、`reserve`、`claim`）、`advance.mjs`、`queue.mjs check` | 処理側（B）の二重処理の防止 |
| 中断した登録の復旧 | `registration-tail.mjs` `recoverRegistration`、`recover-registration.mjs --dry-run` | 状態が `running` で止まった会社の判断表 |
| 検証 | `verify-financials.mjs`、`check-prose-figures.mjs`、`finalize.mjs` のゲート、`tests/data-integrity` | 公開前の検査。**弱めない** |
| 上場状況の台帳と差分 | `sync-listing.mjs`（`reconcile`、`diffLedgers`）、`pipeline/listing.tsv` | 上場状況 job の入力（EDINET 側） |
| 保存先の型（Postgres と開発用ファイルの2実装、未設定の本番は閉じる） | `src/lib/reports/*`、`db/migrations/`、`scripts/migrate.mjs` | 監視状態の保存方式をそのまま踏襲 |
| 管理画面の認証と作り方 | `src/app/admin/(protected)/`、`requireAdmin` | `/admin/monitoring` |
| 検知専用 workflow とその固定テスト | `.github/workflows/refresh-financials.yml`、`tests/refresh-workflow.test.ts` | 実行者（第7節 決定1 の推奨案） |

### 1.2 不足している

| 不足 | レビュー | 備考 |
|---|---|---|
| 台帳（日ごとの状態、書類1件ごとの記録と `disposition`）と、そこから導く監視位置 `confirmedThrough` | R4 | 今は「キャッシュの有無」と `amendments-index.checkedThrough` だけ。日の**判断の記録**が無い |
| 書類の変更（`docInfoEditStatus`）、取下げ（`withdrawalStatus`）の検知。確定後の直近7日の再確認 | R1〜R3 | `scripts/` のどこも読んでいない（レビューで確認済み） |
| job の保存と貸し出し（lease）、再試行回数、失敗理由、結果への参照 | R5, R8 | `company-state.mjs` は**会社単位の工程**の状態で、書類単位の job ではない |
| 手元のキャッシュからの種付け（`seed`） | R6 | 730日分は手元にある |
| 実行履歴（`watch_runs`）、停止の検知、health | R14, R15, R18 | route handler が 0 件。通知の仕組みなし |
| `/admin/monitoring` | — | |
| 新規有報 job の「実行前ゲート」（登録済みの出典の docID と検知した docID が違うこと） | R9 | `refresh-financials` は entry から決めるので満たす。**未登録の会社・本文の更新**には別に要る |
| 上場状況の第2の情報源（JPX）の取得方法と条件 | 決定 #6 | 下記 第5節 |
| `DayIndexStore`（保存先を差し込める形） | R11 | `documentsOn` はファイルキャッシュと `process.env` に結びつく |
| Postgres 実装を試すテスト（契約テスト） | R20 | 今は SQL を試すテストが無い |

### 1.3 変更が必要になるファイル

| 段階 | 新規 | 既存の変更 |
|---|---|---|
| 1 | `scripts/pipeline/watch-core.mjs`（純関数）、`watch-store-file.mjs`、`watch.mjs`（CLI）、`tests/watch-*.test.ts` | `scripts/research/edinet.mjs`（`DayIndexStore` の切り出し。**ファイル実装の挙動は不変**）、`package.json`（`content:watch`）、`docs/pipeline.md`、`.gitignore`（台帳の置き場） |
| 2 | `db/migrations/0003-edinet-watch.sql`、`src/lib/watch/*`（Postgres 実装）、`src/app/api/health/edinet-watch/route.ts`、`tests/watch-contract.test.ts` | `.github/workflows/`（検知 workflow に台帳への書き込み。権限は `contents: read` のまま）、`tests/refresh-workflow.test.ts`（新しい性質を固定）、`.env.example` |
| 3 | `src/app/admin/(protected)/monitoring/page.tsx`、`tests/monitoring-*.test.ts` | 管理画面の入口（リンク1つ） |
| 4 | `scripts/pipeline/watch-sync.mjs`、`tests/watch-sync.test.ts` | `refresh-financials.mjs`（job の入出力の薄い口。判断は変えない） |
| 5 | `scripts/pipeline/sync-jpx.mjs`、`tests/sync-jpx.test.ts`、`docs/source-terms.md`（JPX の節） | — |

`src/data/**`（会社データ）と `companySchema` は**どの段階でも変更しない**。

## 2. 設計の要点（要件との対応）

### 2.1 台帳と監視位置

- **日の状態**: `final`（`indexProblem` が null）／`partial`（確定前）／`failed`（取得失敗。理由は `classifyIndexFailure` の語彙）。
- **書類**: 日次索引の1行ごとに、`docID`・`parentDocID`・`docTypeCode`・`secCode`・`edinetCode`・提出者名・提出日時・`withdrawalStatus`・`docInfoEditStatus`・`row_hash` を記録。**同じ docID は1行**（重複処理の防止）。再掲で `row_hash` が変われば `doc-edited` を記録（R1）。
- **disposition（R4）**: 全書類に必ず付く。`job:<kind>` か `ignored:<理由>`。無視してよい書類種別を一覧にして固定（大量保有報告書、臨時報告書、自己株券買付状況報告書など。**理由は台帳に残る**）。判断の無い書類が1件でもあれば位置は進まない。
- **`confirmedThrough`**: 起点から連続して `final` で、その日の全書類に disposition があり、job が作られた最後の日。**台帳への書き込みと同じトランザクションでしか進まない**。「前回どこまで」を別に持たない（台帳が真実）。
- **走査**: `confirmedThrough` の翌日〜昨日の未確認日＋直近7日の再確認（R3）。1回の日数に上限。確定前の日は `partial` で保存し、書類は検知として記録するが位置は進めない。取得できない日は位置を止め、失敗理由と回数を出し続ける（B-2。「隔離して先へ進む」は採らない）。
- **導出可能性**: 台帳は日次索引のキャッシュ＋コードから**作り直せる**（`seed`）。ファイル実装では台帳を消しても復旧できる。

### 2.2 job（処理の単位）と再試行・重複防止・中断復旧

- `unique(doc_id, kind[, row_hash])`。kind: `new-filing` / `amendment` / `identity-change` / `doc-edited` / `listing-change`（第5節。別の台帳）。
- 状態: `queued → running → proposed → applied`、`failed`、`needs-review`、`ignored`。**`done` という語は使わない**（「公開した」と誤読されるため。`proposed` は候補ができた、`applied` は人が手元で適用した、が意味）。
- 貸し出し: `running` にするとき `locked_until = now + 30分`。期限切れの `running` は次回に `queued` へ戻る。実行全体に排他（Postgres は `pg_try_advisory_lock`、ファイルは既存の `withLock`）。取れなければ即終了（R5）。
- 再試行: 失敗で `attempts + 1`、**3回で `needs-review`**（`company-state.setStage` と同じ規則）。再実行は同じ job を取り直すだけで、新しい job は作らない。
- B の判断表（R8）: 未着手 → `advance`／`refresh-financials` の dry-run／状態が `running` で中断 → **先に `recover-registration --dry-run`**、条件を満たすときだけ復旧／`completed` → 何もしない。「job 1件につき改訂記録は最大1件」を `result_ref` で守る。
- 再登録のゲート（R9）: 実行前に、登録済みの出典の docID と検知した docID が違うことを確かめる。

### 2.3 情報源の分離

| | 財務 | 上場状況 |
|---|---|---|
| 情報源 | EDINET の有報・訂正有報（日次索引、XBRL） | EDINET コードリスト（`sync-listing`、手動 `--file`）＋ JPX（未調査）。**EDINET の日次索引は上場状況の根拠にしない** |
| 台帳 | `edinet_days` / `edinet_filings` / `watch_jobs` | **別の台帳**（`listing_snapshots` / `listing_changes`）。財務の位置を進めも止めもしない |
| 頻度 | 毎日 | 月次または手動。コードリストは更新が毎日だが取得は手動（運営者の決定） |
| 出力 | 更新候補（`proposed`） | **差分の報告のみ**。常に `needs-review`。推測で上場・上場廃止を確定しない（不変条件1） |
| 反映 | 人が手元で適用・commit | 人が確認し、表示方針を決めてから（現在、上場廃止会社の扱いは仕様判断待ち。`docs/pipeline.md`） |

### 2.4 自動処理は候補まで、公開は人

- 自動（Actions／cron）が書くのは**台帳（DB／ファイル）だけ**。`src/data`・`pipeline/state` は書かない。権限は `contents: read`、`src/data` の指紋検査、コミットなし（JCE-018 の性質を維持し、テストで固定）。
- 候補 = `refresh-financials` の dry-run の report（`would-update`、差分、保留理由）、訂正の `auditAction` の推奨、識別情報の変更の候補。**候補を適用できるのは手元の `--apply` だけ**で、`verify-financials`・スキーマ・integrity suite を通ったときだけ書く（既存）。公開は人の commit（JCE-016、不変条件9）。
- 人の承認の形: ①管理画面で候補を確認（読み取り専用）②手元で適用 → `content:diff` → commit。DB の job は適用後に `applied`（Revision の id を `result_ref` に）と記録される。**サーバー側に「公開する」ボタンは作らない。** PR 経路や自動適用は別の決定（JCE-016 の変更）で、この計画の範囲外。

### 2.5 見える化（監視履歴・失敗理由・再実行）

- `watch_runs`: 開始・終了・成否・走査日数・新規書類数・エラー（`scrubSecrets` 済み）・`next_due_at`。
- `edinet_days`: 状態・取得試行回数・最終失敗理由の種別（not final／key missing／key refused／rate limit／server／network／EDINET message）。
- `watch_jobs`: 状態・試行回数・最終失敗理由・`locked_until`・`result_ref`。手動の再実行は `watch.mjs retry <job>`（`needs-review` から `queued` へ。理由を記録）。
- `/admin/monitoring`（段階3）、`/api/health/edinet-watch`（段階2。公開。`ok`／503 とコードのみ）、CLI `watch.mjs status`（段階1。同じ内容を端末に）。

### 2.6 既存の不変条件・JCE-016・データ形式との整合

| 項目 | 確認 |
|---|---|
| 不変条件1・2（捏造しない／出典） | 候補は EDINET の印字から作る既存の経路のみ。上場状況は推測しない。保留・失敗は理由つきで記録 |
| 不変条件3（一次資料） | 財務は EDINET。上場状況の JPX は「取引所の公表」で一次資料だが、利用条件を確認するまで取り込まない |
| 不変条件4（証券会社ではない） | 追加する表示なし。管理画面のみ |
| 不変条件5・9／JCE-016 | 本番は内容を書かない。台帳はコンテンツではなく運用状態。管理画面は読み取り専用。PR 経路は含まない |
| 不変条件6（kebab-case） | ファイル名・経路・id は kebab-case。DB の列は既存どおり snake_case |
| 不変条件7（localStorage） | 使わない |
| 不変条件8（Server Component） | 監視ページは Server Component、health は route handler。`"use client"` なし |
| 既存データ形式 | `companySchema`・Revision の形・`pipeline/state` の形は変えない。台帳は別の置き場（`.data/watch/` または DB） |
| 鍵の扱い | 本番サーバーに EDINET の鍵を置かない構成を推奨（決定1）。ログ・報告は `scrubSecrets` を通す |
| EDINET の利用規約（B-6） | 規約 WZEK0030: API の機械的利用は可、回数の上限の記載なし、負荷への配慮と「おそれ」での停止あり。今の頻度（1日1回＋夜間待ち、150ms 間隔）を超えない。**自動実行の了解は運営者が確認**（JCE-018 の未了事項のまま） |

## 3. 段階別の実装計画

### 段階0: 決定と設計の確定（コードなし）

- 決定を `docs/decisions.md`（JCE-022〜）に記録: 第7節の決定1〜6。
- 提案書を改訂（R1〜R9 の反映、`done`→`proposed`/`applied`、実行者の確定、JCE-018 との整合）。
- **完了条件**: 決定が記録され、運営者が提案書の改訂版を承認。 **失敗時**: 決まらなければ段階1だけ進める（ローカルで完結する）。

### 段階1: ファイル実装（台帳・検知の核・CLI）

- 内容: `watch-core.mjs`（純関数: 走査計画、`disposition`、`row_hash`、`confirmedThrough` の導出、job の生成、lease）、ファイルの `WatchStore`、`watch.mjs scan|status|seed|jobs|retry|recheck`、`DayIndexStore` の切り出し。時計と取得は注入。
- 検証: 実データで **差分テスト** — 台帳から導いた「会社ごとの最新有報」が `refresh-financials.newestFilings` と一致、訂正の対応が `pipeline/amendments-index.json` と一致、種付けを2回して台帳が変わらない。
- **完了条件**: 第4節の段階1のテストがすべて合格、`content:check` 合格、`src/data` のバイトが不変、`seed` でキャッシュから台帳を再構築でき、`scan` が最新まで進む。
- **失敗時の復旧**: 台帳は派生物。壊れたら削除して `seed`。`DayIndexStore` の変更で既存の `index-cache` テスト（30件）が落ちたら、その変更だけを戻す（ファイル実装は元の関数を呼ぶだけの薄い層にしてあるため、戻しは1ファイル）。

### 段階2: Postgres・定期実行・health

- 内容: `0003` migration（`edinet_days`・`edinet_filings`・`watch_jobs`・`watch_runs`、`doc_id`/`kind` の一意制約、CHECK 制約）、`WATCH_DATABASE_URL`（読者の報告と別の DB ロール。B-4）、`PostgresWatchStore`、**契約テスト**（ファイル実装と Postgres 実装に同じテストを流す。CI の Postgres サービスと手元の Docker。`TEST_DATABASE_URL` が無いと Postgres のテストは「未実施」と表示し、**未実施のまま本番に出さない**＝B-5）、検知 workflow の拡張（既存の dry-run に台帳への書き込みを追加。権限・指紋検査は不変）、`/api/health/edinet-watch`（Next の route handler の文書を先に読む）。
- 本番へ入る順序: ①migration を適用 ②workflow を「台帳に書く」へ（まず手動実行） ③1週間の並走で日の状態・件数を `refresh-financials` の結果と突き合わせ ④health を外部の稼働監視に登録。
- **完了条件**: 契約テストが両実装で合格、workflow の固定テスト（権限・鍵・コミットなし・指紋検査）合格、3日連続で台帳が `final` のまま `confirmedThrough` が進み、故意に API を失敗させた日で位置が止まって翌日回収されることを実機で確認。
- **失敗時の復旧**: `WATCH_DATABASE_URL` を外せば台帳への書き込みだけが止まり、検知（JCE-018）は従来どおり動く（本番は閉じる側に倒れる）。DB の内容は派生物で、手元のキャッシュから `seed` で作り直せる。migration は追加のみ（`drop table` で元に戻る）。health が 503 のまま戻らなければ、外部監視を止めて原因を `watch_runs` で見る。

### 段階3: 管理画面

- 内容: `/admin/monitoring`（Server Component、`requireAdmin`、強制動的、`noindex`、読み取り専用）: 最終成功時刻、次回予定、停止・連続失敗の警告、新規書類の件数（期間別）、job の状態別件数、訂正の処理状況（原本との対応と分類）、`needs-review` の一覧、失敗理由と試行回数、直近の実行履歴。
- **完了条件**: 認証なしで 404／ログインへ、停止状態の台帳で警告が出る、本番ビルドで公開ページに監視データが出ない（JCE-019 の走査と同じ方法）、`content:check` 合格。
- **失敗時の復旧**: 読み取り専用なので、ページを外しても検知は影響を受けない（リンクを外し、ページを削除）。

### 段階4: 処理側（B）の接続

- 内容: `watch-sync.mjs`（手元）。job を取り（トークンつき API または、ファイルのときは直接）、判断表に沿って既存コマンドを呼ぶ: 登録済みの会社の新規有報 → `refresh-financials`（dry-run → `proposed`、適用は `watch-sync apply <job>` が `--apply` を呼び、**commit はしない**）／published・needs-attention の本文 → `needs-review`（再調査の依頼）／未登録の会社 → 既存の `advance`／`register-figures` の対象として一覧に出すだけ／訂正 → `auditCompany` → `proposed`／識別情報の変更 → `post-filing` → `needs-review`／`running` で止まった登録 → `recover-registration --dry-run`。
- **完了条件**: 8つの必須テスト（第4節）合格、実データのリハーサル（`--rehearse` 相当）で `proposed` ができ、`apply` で Revision が1件だけできる、`apply` を2回押しても Revision が増えない、検証を故意に失敗させて `src/data` が不変で job が `needs-review`。
- **失敗時の復旧**: 適用前なら job を `queued` に戻して再実行。適用で途中停止した会社は `recover-registration`、または `refresh-financials` が自分で元に戻す（既存）。

### 段階5: JPX 連携（上場状況）

- **まず調査（実装の前）**: 2026-10-18 に確認できたこと — JPX の「東証上場銘柄一覧」は月次の Excel（毎月第3営業日の午前9時以降に前月末分）、「新規上場／市場区分の変更／上場廃止」の公表ページがある（検索結果による）。**このセッションからの自動取得は 403 で拒否された**（`/markets/statistics-equities/misc/01.html` と `/listing/stocks/delisted/index.html`）。利用条件のページは見つからなかった。→ 利用条件、取得形式、機械取得の可否は**運営者がブラウザで確認**する（`docs/source-terms.md` に記録する）。
- 実装（条件の確認後）: `sync-jpx.mjs`。入力はファイル（`--file`、Excel は CSV に保存したもの。新しい依存は足さない）。前回との差分（追加・消滅・市場区分の変更）を `listing_changes` に記録し、**常に `needs-review`**。`sync-listing` の EDINET 側の差分と突き合わせ、食い違いを別に出す。
- **完了条件**: 条件の確認結果が記録されている。差分の純関数のテスト合格。実データで、既知の上場廃止会社（`post-filing/events.tsv` の「提出の停止＋公開買付」92社）が差分に現れ、**登録済みの会社データは1バイトも変わらない**。
- **失敗時の復旧**: 台帳（`pipeline/listing.tsv` と同様）は派生物。取り込みに失敗したファイルは拒否され、前回の台帳が残る（`sync-listing` と同じ規則）。条件が合わなければ取り込みを止め、EDINET コードリストのみで運用する。

## 4. テスト計画

提案書の必須8項目を維持し、レビューの指摘（R1〜R9）を足す。流儀は既存どおり（vitest、一時ディレクトリ、時計と取得の注入）。

| 段階 | テスト |
|---|---|
| 1 | ①同じ日の索引を2回流しても書類1行・job1件（再実行で二重登録しない）②訂正（130）から `parentDocID` で原本を引く。原本が古くても job ができる ③取得失敗の日で位置が進まず、次回に回収される ④確定前の日の書類は検知されるが位置は進まず、確定後に進む ⑤`row_hash` が変わった再掲で `doc-edited` が1件できる（R1）⑥取下げ（120/130 で `withdrawalStatus ≠ 0`）は最新の有報の候補にならない（R2）⑦確定後の直近7日の再確認で変化を拾う（R3）⑧全書類に disposition が付き、付かない書類があると位置が止まる（R4）⑨`seed` が冪等 ⑩台帳から導いた最新有報＝`newestFilings`（差分テスト）⑪台帳・ログ・報告に鍵が出ない ⑫lease の期限切れで `queued` に戻り、1回だけ完了 ⑬3回失敗で `needs-review` |
| 2 | 契約テスト（ファイル実装と Postgres 実装に同じ ①〜⑬）、advisory lock（2つ同時に走らせて1つが即終了）、health の 503（`next_due_at` 超過・DB 不達で「不明＝異常」）、workflow の固定（権限・鍵・コミットなし・指紋検査）、migration の追加のみ |
| 3 | 監視ページが未認証で閉じる、停止・連続失敗の警告、読み取り専用（書き込み経路が無い）、公開ビルドに監視データが出ない |
| 4 | 検証失敗で `src/data` が1バイトも変わらず job が `needs-review`、`apply` の二重実行で Revision が1件、`running` で止まった会社は `recover-registration --dry-run` を先に試す、登録済みの出典の docID と同じなら何もしない（R9）、`proposed` のままでは公開データに現れない |
| 5 | 差分の純関数、壊れた・短い・5%超変動のファイルは拒否、登録済みの会社データが不変 |

各段階の完了時に `npm run content:check`（tsc・eslint・integrity）と全テストを実行し、結果を報告する。

## 5. 実施順序と分割

1. 段階0（決定）→ 2. 段階1（ファイル実装。**ローカルで完結、本番に何も出ない**）→ 3. 段階2（Postgres・定期実行）→ 4. 段階3（管理画面）→ 5. 段階4（B の接続）。段階5（JPX）は**調査だけ先に**運営者が進められ、段階1〜2と独立。
各段階は単独でコミット可能な大きさにし、前の段階が完了条件を満たすまで次に進まない。

## 6. 主なリスク

| リスク | 対策 |
|---|---|
| EDINET の呼び出し元が2つになり、鍵・負荷が増える | 実行者を1つに（決定1） |
| 台帳が壊れる／食い違う | 派生物として作り直せる（`seed`）。差分テストで `refresh-financials` と照合し続ける |
| 確定判定が観測から導いた規則でしかない（EDINET の仕様ではない） | `indexProblem` の1か所に集め、直近7日の再確認を併用（R3） |
| 夜間バッチ（0:00〜0:06 JST）と衝突 | 既存の待機（`--wait-final`）を使い、定期実行は 07:00 JST のまま |
| 上場状況の誤表示 | 推測しない。差分は常に `needs-review`。JPX は条件確認まで取り込まない |
| 通知が止まる側に依存する | 外部の稼働監視が health を見に行く（デッドマンスイッチ）。送り先は運営者の決定 |

## 7. 運営者に決めてほしいこと

1. **検知の実行者**: 推奨は **GitHub Actions（現行）を唯一の検知元とし、Vercel はデータを読むだけ（health と管理画面）**。本番サーバーに EDINET の鍵を置かず（R16）、Hobby の cron 制限・鍵の二重管理を避けられる。提案書の「Vercel Cron のルート」は採らない案。Vercel Cron を選ぶなら、Actions の検知を止めて一本化する。
2. **台帳の保存先**: 既存の `DATABASE_URL` と同じ Postgres（別ロール）か、別の DB か。無料枠の範囲か。Actions から書くための接続方式（直接 or トークンつき API）。
3. **EDINET の自動実行の了解**: 規約を読んだ限り API は可で回数の上限は無い。今の頻度のまま続けてよいか。
4. **JPX**: 利用規約・取得形式・機械取得の可否をブラウザで確認し、手動の `--file` 取り込みでよいか。
5. **通知**: 外部の稼働監視サービスの選定と送り先。
6. **承認の記録**: 適用後に job を `applied` にする記録（Revision の id）だけで足りるか、承認者名なども残すか。

## 8. この計画が前提にしている未確認事項

- 本番の置き場所が Vercel であること（`vercel.json` は無い。提案書の前提）。
- Vercel Cron のプラン別の制限、Postgres の提供元と費用。
- JPX の利用条件、Excel の列構成（このセッションからは 403 で取得できなかった）。
- 夜間バッチの時刻が今後も同じであること（観測から導いた規則）。
