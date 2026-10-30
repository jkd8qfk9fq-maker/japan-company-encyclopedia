# 企業登録の自動化（autopilot）— 運用手順

数値のみで登録済みの企業を、解説つきの**登録候補（確認シート）**にするまでを自動で進める。
**登録（`src/data` への書き込み）は、運営者が確認シートを読んだ後の `approve` だけ。公開は、その後の運営者のコミット。**
決定: `docs/decisions.md` JCE-022。実装: `scripts/pipeline/autopilot*.mjs`。モデルへの指示の正本: `docs/agent-brief.md`。
運営者の判断待ち: `docs/autopilot-decisions.md`（公式サイト出典／上場廃止会社へのリンク／既存258社の文章）。

## 1. 何を自動で、何を人が

| 工程 | 誰が | 備考 |
|---|---|---|
| 候補の管理（キュー、重複、状態、再試行、復旧） | **プログラム** | `pipeline/autopilot/`（git 管理外・手元だけ） |
| 事前確認（エントリー・重複コード・上場区分・保留・予約） | プログラム | 不可なら、モデルを呼ぶ前に止める |
| EDINET の取得、XBRL の財務、証拠パック、新しい有報への乗り換え | プログラム | 既存の `advance.mjs` |
| 関連企業の候補（有報の本文に社名がある掲載済み企業、上場区分つき） | プログラム | `evidence/<id>/related-candidates.json` |
| 事業構造・沿革（group1）／ビジネスモデル・業界・関連企業（group2） | **モデル**（2回） | `claude -p` の data-research エージェント。これ以外にモデルは使わない |
| 数値・出典・スキーマ・整合性・文章の規則の検査 | プログラム | `verify-financials` / `check-prose-figures` / `finalize.mjs` / `check-policy.mjs` |
| 不備の修復 | モデル（不備の行だけ。最大2回） | 全体の書き直しはしない |
| needsReview・taxonomyGaps の分類 | エージェントが書き、プログラムが状態に反映 | needsReview があれば登録後は要確認。taxonomyGaps は状態を変えない |
| 確認シートの作成 | プログラム | 一文・出典・投資用語・関連企業の根拠・確認事項・検査結果・ハッシュ |
| **確認と承認** | **運営者** | `approve --confirm --hash` |
| コミット・公開 | 運営者 | JCE-016。autopilot は git に触れない |

企業の公式サイトからの情報収集は行わず、**出典は EDINET の有報だけ**（2026-10-18 の運営者の決定。EDINET 以外のホストは、利用条件を確認して `pipeline/source-allowlist.txt` に載せるまで `finalize` が拒否する）。上場区分が「上場」でない相手（コードリストにない）は関連企業に結ばない（同じ決定）。

## 2. 初回設定（一度だけ）

### 2.1 この PC（登録を実行する場所）

| 項目 | 設定場所 | 状態（2026-10-18） | 手順 |
|---|---|---|---|
| Node 24 と依存 | — | あり | `npm ci` |
| `claude` CLI（ログイン済み） | — | あり（2.1.301）。無ければ `--executor work-orders` で AI の作業が注文書になる | `claude` を起動してログイン |
| `EDINET_API_KEY` | `.env.local` | **あり**（32文字）。今日の取得で使用済み | EDINET のアカウントで発行。`.env.example` を参照 |
| `SITE_URL` | `.env.local` | あり | `http://localhost:3000` |
| `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET` | `.env.local` | **未設定**（`/admin` は閉じたまま） | `npm run admin:hash-password` が出す2行を `.env.local` に貼る。秘密は32文字以上。コミットしない |
| `DATABASE_URL`（Postgres） | `.env.local`／本番の環境変数 | 未設定。**autopilot には不要**（記録はローカルのファイル）。読者の報告フォーム用 | 不要なら何もしない |
| 上場区分の台帳 `pipeline/listing.tsv` | リポジトリ | あり（2026-10-16 のコードリスト） | 更新: EDINET のコードリストを手で保存し `node scripts/pipeline/sync-listing.mjs --file <保存したファイル> --write` |

### 2.2 GitHub（EDINET の定期検知。新規登録とは別の経路）

| 項目 | 状態 | 手順 |
|---|---|---|
| リポジトリ | あり（`origin` = https://github.com/jkd8qfk9fq-maker/japan-company-encyclopedia 、**非公開**）。最初の公開版は push 済み | 以降の変更は、内容を確認したうえで commit・push（個人情報を含めた履歴は push しない。履歴を書き換えたクローンから push する） |
| Actions の secret `EDINET_API_KEY` | **未確認**（secret の有無はこの PC から確認できない。設定済みとは扱わない） | リポジトリの Settings → Secrets and variables → Actions → New repository secret。名前 `EDINET_API_KEY`、値は `.env.local` と同じキー（または専用に発行したキー） |
| 動作確認 | 未実施 | Actions → refresh-financials → Run workflow（入力 `rehearse` に登録済みの会社 id を入れると、書き込みなしで実データの更新経路を確かめる）。成功なら job summary に結果が出る。失敗時の理由はキーを含まない形で出る |
| プルリクエストの作成を許可 | **未設定の可能性** | Settings → Actions → General → Workflow permissions → 「Allow GitHub Actions to create and approve pull requests」をオン（ワークフローは承認もマージもしない。作るだけ） |
| 権限・性質 | テストで固定 | 2つのジョブ。`detect` は読むだけ（`contents: read`、`src/data` の指紋検査）。`propose` は見つかったときだけ、検証を通った更新を `auto/financials-…` ブランチに適用し、整合性テスト・型検査・変更パスの制限を通してからプルリクエストを作る（`contents: write`・`pull-requests: write`）。main への push・マージ・承認はしない。定期実行はこのワークフローだけ（`tests/refresh-workflow.test.ts`、`tests/single-detector.test.ts`、JCE-024） |

### 2.3 サイトのプレビュー（GitHub Pages。リンクを得る）

`.github/workflows/pages.yml` が、main への push のたびに**公開ページだけ**を静的に書き出して GitHub Pages に載せる（管理画面・誤りの報告フォーム・オフライン機能は含まれない。本番の全機能は Vercel などのサーバー実行）。
URL: `https://jkd8qfk9fq-maker.github.io/japan-company-encyclopedia/`

運営者の操作（一度だけ）: ① リポジトリを**公開**にする（Settings → General → Danger Zone → Change visibility。非公開のまま使うには有料プランが要る）② Settings → Pages → Build and deployment → Source を **GitHub Actions** にする ③ Actions タブで `pages` を実行（push でも自動）。
書き出しの確認（手元）: `PAGES_EXPORT=1 SITE_URL=https://jkd8qfk9fq-maker.github.io NEXT_PUBLIC_BASE_PATH=/japan-company-encyclopedia npx next build --webpack`（管理画面と報告フォームを除いた複製で。ワークフローと同じ手順）。

### 2.4 初回の確認（このリポジトリで実施済み）

```
npm run content:autopilot -- check              # 整合性テスト・型検査・lint（合格）
node scripts/verify-admin-queue.mjs             # /admin/queue の認証と画面（本番ビルドに対して。25項目、全て OK）
```

## 3. 速い流れ（2026-10-30 から。JCE-030）

```
npm run content:autopilot -- enqueue --file pipeline/autopilot/batch-NN.txt
npm run content:autopilot -- run --ids <…> --allow-web --total-budget 130   # 有報＋Wikipedia（補足）で執筆
npm run content:autopilot -- approve-ready --include-flagged               # 確認シートが出た会社をまとめて登録
npm run content:publish                                                     # 1回検査して公開（push まで）
```

- 有報（EDINET）に書かれていることは、そのまま信用する。Wikipedia は有報に無い補足（旧社名・ブランド・製品名・経緯）だけ。数値は有報だけ。文は写さない。
- `approve-ready` は、各社の検査（スキーマ・出典・本文の金額・文章の規則）は1社ずつ行い、リポジトリ全体の検査は省く。全体の検査は `content:publish` で1回。
- `content:publish` は、GitHub に別のセッションが入れた変更を先に取り込み（同じファイルを両方で変えていたら止まる）、型検査と全テストを1回だけ実行して、公開用クローンへコピー・commit・push する。ローカルの静的ビルドはしない（Cloudflare が build し、失敗すれば前の公開版が残る）。

## 3a. 通常運用（以前の手順）

```
npm run content:autopilot -- suggest --limit 10 [--sector 建設業]   # 候補（数値のみ・上場・未キュー）。売上の大きい順
npm run content:autopilot -- enqueue <id|証券コード> …                # キューに入れる
npm run content:autopilot -- run [--limit N] [--budget 3] [--total-budget 15]
npm run content:autopilot -- status                                   # あなたが確認するものの一覧
```

- `run` は何度でも安全に呼べる。終わった工程はやり直さず、確認待ち・保留・登録済みの会社は触らない。始める前に `queue.mjs check`（エラーがあれば止まる）を実行する。
- 1社あたりモデル2回・約8分・約 $2.2（実測）。`--budget`（1回の上限）と `--total-budget`（この実行の合計の上限）で費用を抑える。
- **実行中は `src/data`・`scripts`・`.claude` を編集しない**（モデルの書き込みと区別できず、その会社が保留になる）。ドキュメントやテストの編集は問題ない。
- 5社登録するごとに `check`（`status` が促す）。コミットの前に `npm run content:diff`。
- 登録済み企業の財務の更新は別の経路（Actions が毎日プルリクエストを作る。手元では `npm run content:refresh-financials`）。Actions の `refresh-report` を `status --refresh-report <ファイル>` で一覧に並べられる。

### 3.1 解説の更新（登録済みの会社に新しい有報が出たとき）

```
npm run content:refresh-financials -- <id> --apply          # 先に数値（事実）を更新する（Actions のプルリクエストでもよい）
npm run content:autopilot -- update <id> --plan             # 何を書き直すかだけを見る（何も変えない）
npm run content:autopilot -- update <id>                    # 準備する（変わった工程だけを書き直す）
npm run content:autopilot -- run --ids <id>                 # 書き直し → 検査 → 確認シート
npm run content:autopilot -- review <id>                    # 「0. 更新前と後」を読む
npm run content:autopilot -- approve <id> --confirm --hash <hash>
```

- 新旧の有報の節（事業の内容・沿革・経営方針・関係会社 ほか）を、数字と日付を除いて比べる（`diff-filings.mjs`）。工程ごとのしきい値を超えた工程を書き直す（理由「text」）。
- もう一つの信号: **公開中の文章が旧い期の数字や日付（「2025年6月期」「2025年6月30日」「2025年6月末」）を書いている工程**も書き直す（理由「figures」。文言が同じでも数字が古くなる）。沿革は出来事に日付があるので、`significance`（今の状況を述べる行）だけを数える。
- どちらにも当たらなければ「keep」で、モデルを呼ばない。
- 更新の途中（確認待ち・保留）で `update <id>` をもう一度実行すると、**計画を立て直す**。新しく書き直す工程が加わり、すでに書き直した工程はそのまま使う。
- 書き直さない工程は、**公開中の内容をそのまま**残す（管理画面での訂正も含む）。その部分の文章の規則の不備は数えず、確認シートに件数だけ出す（既存エントリーの課題として別に扱う）。
- 数値（財務）は更新しない。新しい有報の年度が財務に無ければ `not-refreshed` で止まる。先に財務を更新する。
- 承認すると、改訂記録 `<日付>-company-<id>-updated.json`（変わった項目の前後と承認者）を書き、リサーチログに「更新」の節を足す。コミットは人。

## 4. 確認シートの確認

入口: `status` の一覧、`review <id>`、または管理画面 `/admin/queue`（`npm run dev` を起動し、`/admin/login` でログイン。手元でだけ記録が見える。本番サーバーには記録がない）。

シートの各節で見ること:

| 節 | 見ること |
|---|---|
| 1. 一文の説明 | その会社が何をしているか、一読で分かるか。短い一文か。投資の勧誘に読めないか |
| 2. 一次資料の出典 | EDINET の有報であること（EDINET 以外は、許可リストにあるホストだけ通る） |
| 3. 投資用語・財務の禁止語 | 「検出なし」であること。検出があるなら登録しない（機械が止めているはずなので、通常は出ない） |
| 4. 関連企業 | 相手の「上場／掲載の状態」。説明が、有報がその相手について述べる取引・提携・資本関係になっているか。「確認事項」の欄に出たものを読む |
| 5. 要確認と分類の不足 | needsReview（あれば登録後は要確認になる。完了したか不明な予定事項など）。taxonomyGaps は状態を変えない。機械が人の確認を求めたもの |
| 6. 自動検査の結果 | 数値照合・出典・スキーマ・文章の規則がすべて通っていること |
| 7. 登録するには | ハッシュと `approve` のコマンド |

判定: `ready`（確認事項なし）／`ready-with-flags`（人が決める事項あり。**登録後の区分は、needsReview があれば「要確認」、なければ「公開」**）。

## 5. 承認（登録）

```
npm run content:autopilot -- approve <id> --confirm --hash <シートのハッシュ>
```

- `--confirm` は「一文・出典・投資用語を読んだ」の意思表示。`--hash` はシートに書いてある値で、**読んだ内容と登録する内容が同じ**であることの確認（内容が変わっていれば拒否）。
- **正式な承認は、運営者が自分の端末で実行したものだけ。** AI エージェント（Claude Code。`CLAUDECODE=1` の環境）が `approve` を実行すると、改訂記録の承認者は `claude-code`（kind: agent）、`onBehalfOf` に運営者、`basis` に根拠が入り、**AI の代理承認**として記録される（JCE-025）。代理承認は正式な承認ではない。あとから運営者がシートを読んで正式に承認する手順は残課題。
- 拒否される場合: 状態が確認待ちでない／すでに登録済み／すでに解説つきのエントリーがある／文章の規則に不備がある。理由が表示される。
- 実行されること: 既存の `advance.mjs <id> --register`（`finalize.mjs`）。エントリー・`index.ts`・改訂記録（`<日付>-company-<id>-described`）・リサーチログを書き、統合テストと型検査を通らなければ**全ファイルを元に戻す**。`taxonomyGaps` は `pipeline/taxonomy-gaps.tsv` に追記される。
- そのあと: `npm run content:diff` で差分を確認 → `npm run content:autopilot -- check` → **コミットと push は運営者**（autopilot は git に触れない）。公開されるのは「公開」の企業だけ（JCE-018 の公開ライン）。
- 登録しない場合: `discard <id>`（キューから外す。成果物は残る）。書き直す場合: `redo <id> group1|group2`。

## 6. エラー時の復旧

| 起きること | 扱い | 操作 |
|---|---|---|
| 事前確認で不可（数値のみでない／同じ証券コードが2件／上場区分が「上場」でない／保留中／別の作業が予約中） | モデルを呼ばずに `held` | 原因を直して `retry <id>`、または `discard` |
| モデルの上限・ログイン切れ | `paused`。**会社の試行は消費しない**。キュー全体が止まる | 解けたら同じ `run`（`status` に解除の時刻が出る）。ログイン切れは `claude` で再ログイン |
| モデルの失敗（ネットワーク・タイムアウト・予算超過・成果物なし） | 試行を消費。1つの group につき2回まで。超えたら `held`（`ai-failed`） | 原因（`status`／`/admin/queue` の失敗の記録）を見て `retry`。内容が悪いなら `redo <id> group1\|group2` |
| 検査に不備（金額が有報にない、文章の規則、関連企業の同一性） | 不備の行だけをモデルに渡して修復（最大2回）。直らなければ `held`（`gate-failed`、不備の内容つき） | 不備を読み、`pipeline/results/<id>-*.json` を直接直すか `redo`。直したら `retry` |
| 有報提出後の変更の候補（商号変更・公開買付など） | `held`（`parked`） | 内容を確認 → `ack <id>` → `retry <id>` |
| EDINET／キャッシュの一時的な失敗 | 待って最大3回。超えたら `held` | 時間をおいて `retry` |
| モデルが `pipeline/results` 以外に書いた／実行中に人が編集した | `held`（`forbidden-write`、変わったファイルを表示） | `git diff` で確認 → 問題なければ `retry` |
| プロセスの中断（シェルを閉じた、セッション上限） | 次の `run` で続き。終わった group は呼ばない。二重起動は排他（`pipeline/autopilot/.run.lock`） | 同じ `run`。ロックが残った場合は pid が生きていなければ自動で引き継ぐ |
| 想定外の例外 | その会社だけ `held`（`internal-error`）。他は続ける | `status` の理由を見る |
| 登録が失敗した | `held`（`register-failed`）。**ファイルは元に戻っている**（finalize の仕様） | 原因を直して `retry` → シートを読み直し → `approve` |
| 承認の後に内容が変わった | ハッシュが一致せず拒否 | `retry` して新しいシートを読み直す |
| 二重登録 | `approve` が拒否（登録済み／解説つき）。改訂記録が既にあれば `finalize` が拒否 | — |
| 登録が途中で止まった（`finalize` の途中でプロセスが死んだ） | `docs/pipeline.md`「登録の中断からの復旧」 | `node scripts/pipeline/recover-registration.mjs <id> --dry-run` |

履歴は `history [<id>] [--tail N]`（`pipeline/autopilot/history.jsonl`）。**既知のテスト失敗は現在なし**（全テスト合格が基準）。`check` が落ちたら新しい失敗として扱い、直近の変更を疑う。

## 7. 管理画面 `/admin/queue` の確認

- 手順: `.env.local` に `ADMIN_*` を設定 → `npm run dev` → `/admin/login` → 「登録キュー」。一覧は「あなたが確認するもの」が上、詳細に確認シート全文と登録コマンドが出る。承認のボタンはない。
- 認証・画面の自動確認: `SITE_URL=http://localhost:3000 npm run build` のあと `node scripts/verify-admin-queue.mjs`。使い捨ての秘密で本番ビルドを起動し、ログインの守り（Cookie なし・別の秘密・改ざん）、全社の一覧と詳細、404、承認ボタンがないこと、公開ページにキューのデータがないことを確かめる（`.env.local` は読まない・変えない・何も書かない）。
- 本番サーバー: 記録がないため「登録キューの記録がありません」と出る（空のキューとは区別）。

## 8. 守っていること

| 条件 | どう守るか |
|---|---|
| 捏造しない・出典 | 本文の金額は有報の印字に照合。関連企業は、社名が有報の本文にあること＋上場区分＋取引・提携・資本関係の説明を検査 |
| 投資サービスではない | 投資指標の語を検査。本文の財務数値は売上高と当期純利益だけ（営業利益・経常利益・特別利益などは不可） |
| 本番は書かない（9／JCE-016） | autopilot は手元だけ。管理画面は読み取り専用。Actions とサイトは登録できない（テストで固定） |
| 公開は運営者の承認 | `approve` は `--confirm` とシートのハッシュが要る。公開はコミット |
| 秘密を出さない | EDINET の鍵は子プロセスに `--env-file` で渡すだけ。モデルには鍵を渡さない。出力は `scrubSecrets` を通す |
| 既存の形式 | `companySchema`・Revision・`pipeline/state` は変えていない。登録は既存の `advance.mjs --register` |
| 一括登録とは分離 | 少数ずつ確認しながら進める道具。数千社の数値のみ登録は `docs/pipeline.md` の大量登録スキーム |
| EDINET の検知元は一つ | GitHub Actions の `refresh-financials`（毎日 07:00 JST）。autopilot は定期実行しない（`tests/single-detector.test.ts`） |

## 9. AI の利用量

- 1社あたりモデル呼び出しは通常2回（group1、group2）。実測: 積水ハウス $2.20、キリン $2.30、約8分。修復が入っても最大4回。手作業で作った会社のキュー取り込みはモデル 0 回。
- 抑える工夫: 事前確認で不可の会社には呼ばない／数値・重複・状態・検査・シートはプログラム／規則は `docs/agent-brief.md` に一度だけ（プロンプトは短い）／関連企業の候補を機械が抽出／不備はその行だけ修復／終わった group は再実行しない／1回・合計の費用の上限／web ツールは既定で許可しない／モデルは sonnet。
- トークン数は測っていない（費用のみ記録: 履歴の `model` イベントと `/admin/queue`）。

## 10. 既知の制約

- 文章の規則は**新しい登録**にだけ適用する。登録済みの解説つき258社は規則より前に書かれており、全社が何かの規則に当たる（`node scripts/pipeline/audit-policy.mjs`）。対応は運営者の判断（`docs/autopilot-decisions.md` 判断3）。
- 関連企業の「関係性」は、機械は社名・上場区分・説明の長さまでしか検証しない。取引・提携の中身が有報の記載どおりかは、確認シートで人が読む。
- 同じ回に登録する企業どうしは結べない（`docs/pipeline.md`）。登録後に相互リンクを足す。
- Postgres の台帳・cron・JPX 連携は作っていない（`docs/continuous-update-plan.md`）。JPX の利用条件は未確認。
