# 登録パイプライン

企業1社を登録するまでの11工程と、各工程の担当。1社ずつ手作業で調べる方式を置き換えるもので、
**機械にできることは機械が1度だけやる**（§31: 同じ情報を二度調べない）のが設計の芯である。

| # | 工程 | 担当 | 成果物 |
|---|---|---|---|
| 1 | identity | `scripts/pipeline/run-mechanical.mjs` | EDINET の日次インデックスから提出者・証券コード・docID を確定 |
| 2 | edinet | 同上 | `evidence/<id>/` の証拠パックと `draft-entry.json`（5年×6指標） |
| 3 | businessStructure | エージェント | `pipeline/results/<id>-businessStructure.json` |
| 4 | history | エージェント | 同上 |
| 5 | businessModel | エージェント | 同上 |
| 6 | industry | エージェント | 同上 |
| 7 | relatedCompanies | エージェント | 同上 |
| 8 | terms | エージェント（助言のみ） | 同上 |
| 9 | sourceValidation | `scripts/pipeline/finalize.mjs` | 出典と docID の照合、数値の再照合 |
| 10 | qualityControl | 同上 | スキーマ＋整合性ルール |
| 11 | registration | 同上 `--register` | エントリー・index・改訂記録・リサーチログ |

3〜8 は2つのグループに分けて実行する（`AGENT_STAGE_GROUPS`）。
グループ1 = businessStructure, history。グループ2 = businessModel, industry, relatedCompanies, terms。
**エージェントは常に1つずつ動かす。** このプロジェクトでは並列実行がセッションのレート制限で
毎回止められており、エージェントを安くしても解決しなかった。

工程9〜11 は組み上げたエントリーを `pipeline/staging/` に置いて**そこで**検査する。
`src/data/companies/` に入るのは全ての検査を通ったあとだけで、登録中に失敗した場合は
書いたファイルを全て元に戻す。git 操作はしない（§29）。コミットは人が行う。

状態は `pipeline/state/<id>.json`。`node scripts/pipeline/company-state.mjs` で一覧、
`… <id>` で1社分と次のエージェント作業が出る。成果物から状態を復元する `syncAgentStages` が
あるので、エージェント側は状態ファイルを触らなくてよい。

### 数千社規模で回すとき — `queue.mjs` / `advance.mjs`

1社ずつ`evidence-pack.mjs`・`merge-fragments.mjs`・`check-prose-figures.mjs`・`finalize.mjs`を
手で叩く代わりに、この2つを使う（2026-10-01追加。個別コマンドによる手順は変わらず残っている
——これは利用者が増えただけで、仕組みを置き換えたものではない）。

```
node scripts/pipeline/queue.mjs status                       # 全体の進捗
node scripts/pipeline/queue.mjs next group1 --limit N         # 次に group1 (businessStructure,
                                                                # history) が必要な会社を N件
node scripts/pipeline/queue.mjs next group2 --limit N          # 次に group2 が必要な会社
node scripts/pipeline/queue.mjs next finalize --limit N        # 両グループ完了・登録待ちの会社

node scripts/pipeline/advance.mjs <company-id>                 # 1社分の定型処理（下記）
node scripts/pipeline/advance.mjs <company-id> --register       # 上記＋gateが通れば登録まで
```

`advance.mjs`がやること、1社について：証拠パックが無い／docIDが`pipeline/state`の記録と
違えば`evidence-pack.mjs`→`draft-entry.mjs`で再構築する（識別情報の再取得はしない。窓は
`identity.submitted`の前後21日——`run-mechanical.mjs`が最初に解決するときと同じ窓なので、
同じdocIDが再現される）→`syncAgentStages`で成果物を状態に反映→次に必要なのが
`group1`/`group2`ならそれを表示して`pipeline/reserved.tsv`に追加するだけで止まる
（**実際のプロンプト執筆・Agent派遣はこのスクリプトの仕事ではなく、その手前で止めて
報告するだけ**。この先は`docs/pipeline.md`の「エージェントへの作業要領」をそのまま渡して
Agentに書かせる）→両グループ完了済みなら`finalize.mjs`（`--register`時は`--register`付き）を
呼んでそのまま終わる。

**失敗した会社でバッチを止めない。** どの段階で失敗しても例外を捕まえて
`setStage(..., "failed", 理由)`を呼び、**常にexit code 0で終わる**——ループ側はこの会社を
飛ばして次に進めばよい。3回連続failedで`needs-review`に自動的に昇格する既存の仕組み
（`company-state.mjs`）はそのまま効く。`pipeline/reserved.tsv`に載っている会社・
`registration`が`needs-review`の会社（delisted企業の永久除外など）は`queue.mjs`の一覧にも
`advance.mjs`の処理対象にも入らない。

**`finalize`の判定は`pipeline/state`の`registration`工程を見ない。** `figures-only`登録済みの
会社は全員すでに`registration: completed`になっている（数値のみの登録そのものがこの工程を
満たすため）。「まだ昇格していないか」を知る唯一の方法はエントリー本体の`status.state`を見る
ことで、`readyForStage("finalize")`・`advance.mjs`はどちらもそうしている。この区別を間違えると
figures-onlyの会社が永遠に`finalize`候補として出てこなくなる（実装中に一度この間違いをして、
`queue.mjs next finalize`が常に0件になる形で見つかった）。

### 訂正有価証券報告書（docTypeCode 130）の扱い

訂正有報は**差分ではなく全文の再提出**で、最新のものが前のものを置き換える。EDINET には
会社単位の検索がなく日次索引しかないので、訂正は「どの原本を直すか」を指す `parentDocID`
から**逆引き**する（原本を探す21日窓は原本の発見専用で、訂正の発見には使わない）。

- **索引** `pipeline/amendments-index.json`（git管理外・再生成可能）: `parentDocID → 訂正の列`
  （提出日時の古い順）と、取り込み済みの最終日 `checkedThrough`。`amendmentsOf(index, 原本)` は
  `parentDocID` が訂正を指す鎖もたどる（実データには鎖が無いが、コードは原本の鎖を前提にしない）。
  日次索引のキャッシュから `checkedThrough` より後の日だけを足す。当日（UTC）は未完なので入れない。
- **有効文書** `effectiveDocID`: 訂正が無ければ原本。あれば**最新の訂正**。ただし最新の訂正に
  このパックが読む情報（原本にある 沿革／事業の内容／主要な経営指標等の推移／表紙の会社名、
  かつ5年表を抽出できること）が欠けていれば**採用しない**（`status: "incomplete"`、原本のまま、
  `needs-attention` 扱い）。古い訂正に黙って戻ることもしない。
- **パックは有効文書から作る。** `summary.filing` が記録の文書、`summary.amendments` が鎖と
  原本比較（5系列×決算期、集合として比較）、`summary.filing.originalDocID` が原本。
- **`identity`**: `docID` は従来どおり「登録データを取り出した文書」（finalize が出典URLに
  `identity.docID` を含むことを検査する）。原本は `originalDocID`、鎖は `amendments`
  `{originalDocID, effectiveDocID, amendmentDocIDs, status, blockedBy, checkedThrough}`、
  最後の確認は `amendmentCheck {at, result, effectiveDocID}`。`identity.corrections` の意味は
  不変（「identity を決めた時点で窓に見えていた訂正のスナップショット」）で、`intake.mjs` と
  `run-mechanical.mjs` の両方が同じ `windowCorrections(summary)` で埋める。
  研究ログの「訂正報告書」欄は `correctionsCell` が索引から書く——訂正があるのに「なし」とは書かない。
- **財務の比較**: 登録値と有効文書を5系列（売上・利益・純利益・総資産・純資産）で比べる。
  同一なら財務も出典も Revision も書き換えず、確認結果だけ `amendmentCheck` に残す。
  異なれば財務を取り直し、引用する出典（`id` は不変、url/title/publishedAt/accessedAt）を有効文書に
  合わせ、Revision を書く。
- **本文は自動で書き換えない。** 公開済みの会社は 沿革／事業内容／セグメント／関係会社／株主
  ＋解説が拠る節（`PROSE_ELEMENTS`）を原本と有効文書で比べ、差があれば `needs-attention`
  にするだけ（`--flag-text`）。

```
node scripts/pipeline/amendment-audit.mjs              # 全社を報告のみで監査 → pipeline/amendment-audit.{json,tsv}
node scripts/pipeline/amendment-audit.mjs <id> …       # 指定した会社だけ
node scripts/pipeline/amendment-audit.mjs --refresh    # 週次: checkedThrough より後の日だけ取得し、追跡中の会社の新しい訂正を報告
node scripts/pipeline/apply-amendment.mjs <id>         # 1社分のドライラン（既定は何も書かない）
node scripts/pipeline/apply-amendment.mjs <id> --apply [--flag-text]
```

`apply-amendment` は登録値が**原本とも**食い違うときは拒否する（古い抽出器が原因で、訂正とは
別の問題）。財務を変えるときだけ `verify-financials` を通し、どの場合も `validate-file` と
`data-integrity` を通す。失敗したら元に戻す。監査の `action` は人への推奨であって、
パイプラインが自動で実行するものではない。

---

## 大量登録スキーム（上場企業 universe → published）

3,000 社以上を同じ品質基準で継続的に登録するための、既存の部品の**つなぎ方**。新しい状態ファイルも
スキーマも作っていない。1社＝1 job で、job の位置は既存のファイル（`universe.tsv`、`pipeline/state`、
エントリーの `status.state`、`reserved.tsv`、`intake-failures.tsv`）から**導出**する（`scripts/pipeline/jobs.mjs`）。

```
universe.tsv ──discover──▶ queued ──intake──▶ intake ──register-figures──▶ figures-only
                                                                               │ claim → advance → agent(group1, group2)
                                                                               ▼
                                                    research ──▶ registration-ready ──finalize──▶ published
任意の段階 ──▶ needs-attention（人が見る）   失敗 ──▶ retryable（3回まで）──▶ needs-review ／ 永久除外 ──▶ failed
```

| job stage | 何でできているか | 次に誰が何をするか |
|---|---|---|
| queued | universe に行があり id が空 | `intake.mjs` |
| intake | identity + edinet 完了、エントリー無し | `register-figures.mjs`（数値のみ登録） |
| figures-only | エントリー `status.state = figures-only`、エージェント工程0 | `queue.mjs claim group1` → `advance.mjs` |
| research | エージェント工程が一部完了 | 同上（group2） |
| registration-ready | 6工程すべて完了、まだ figures-only | `advance.mjs <id> --register` |
| published | エントリー `published` | — |
| needs-attention | エントリーが needs-attention、工程が needs-review、**訂正で登録値や本文が変わる**、決算期の変更・変則決算、訂正の不完全 | 人 |
| failed | 非上場・外国会社（XBRL が無い） | 永久除外 |

`reserved`（作業中）と `retryable`（失敗が3回未満）は stage ではなく旗。editorial の共通デザインは会社ごとの
工程ではなく共有テンプレート、スキーマ＋整合性の検査は `finalize.mjs` の中（sourceValidation / qualityControl）。

### どの script が何をするか

| 役割 | 担当 |
|---|---|
| queue の管理・見える化 | `queue.mjs`（`status` / `jobs` / `plan`（dry-run）/ `check` / `next` / `claim`） |
| 予約（二重取得の防止） | `company-state.mjs` の `reserve` / `release` / `claim`。**排他**（`pipeline/.lock` の mkdir ロック。取れた呼び出しだけが true）。`claim` は「次の N 社を選ぶ」と「予約する」を1つのロック内で行う |
| universe の作成 | `discover.mjs`（既定は**昨日まで**。当日の索引は未完で、キャッシュされると以後ずっと完全に見える） |
| EDINET 取得・証拠パック | `intake.mjs`（id 割当・パック・draft）／`advance.mjs`（再構築）／`pack.mjs`（欠落・別 filing・古い抽出器を一括判定） |
| figures-only の作成 | `register-figures.mjs`（バッチ、全件 verify-financials、`--ids` で指定可、予約してから処理） |
| research | `data-research` Agent（group1: businessStructure, history／group2: businessModel, industry, relatedCompanies, terms）。**1つずつ** |
| quality | `data-quality` の役（登録前に `verify-financials` / `check-prose-figures` と有報の照合。数値は直さず判定のみ） |
| registration | `finalize.mjs`（`advance.mjs --register` 経由） |
| verification | `verify-financials.mjs`（財務）、`check-prose-figures.mjs`（本文の金額）、`validate-file` + `data-integrity`（schema・整合性） |
| published / needs-attention の分岐 | `merge-fragments.mjs`：エージェントの `needsReview`、決算期の変更・変則決算があれば needs-attention。無ければ published |
| 訂正有報 | 上の節。intake / register-figures は有効文書から作る。**登録済みの会社の訂正は `amendment-audit.mjs --refresh`（週次）→ `apply-amendment.mjs`**。大量登録とは別 |

### 通常ケースは自動、例外は止めて人へ

| 例外 | 検出する場所 | 結果 |
|---|---|---|
| EDINET 文書が無い・XBRL が無い（外国会社） | `intake.mjs` の失敗記録 | failed / retryable |
| 必須の財務（売上・純利益）が取れない | `evidence-pack.mjs` が例外、`verify-financials` | intake 失敗 / 登録見送り |
| 財務の矛盾 | `verify-financials`、`check-prose-figures` | 登録しない |
| 関係が事実として不明・出典が不足・捏造の疑い | エージェントの `needsReview`、`integrity.ts`（出典の存在） | needs-attention／登録しない |
| 分類（業界・関係の種類）が足りない | エージェントの `taxonomyGaps` | **status は変えない**。研究ログと `pipeline/taxonomy-gaps.tsv` に記録 |
| 上場状態の疑義（非上場・該当なし） | `register-figures.mjs` | failed（永久除外） |
| 訂正で本文・財務が変わる／訂正が不完全 | `amendment-audit.mjs`、`pack.amendments.status` | needs-attention（本文は自動で書き換えない） |
| 決算期の変更（5年表の期末日が実際と違う） | `evidence-pack.mjs` `fiscalYearChange` | **登録しない**（needs-review） |
| 変則決算（12か月でない期） | `evidence-pack.mjs` `irregularPeriods` | 登録しない／公開せず needs-attention |
| schema 不整合・重複 | `validate-file`、`queue.mjs check`（証券コードの重複ほか） | 登録しない／check が exit 1 |

推測で埋めない。上のどれにも当たらないときだけ、人の指示なしに次の工程へ進む。

### 回し方

```
node scripts/pipeline/queue.mjs check                       # 先に整合性。error があれば始めない
node scripts/pipeline/queue.mjs plan                        # dry-run。対象数・要取得の有報・needs-attention 候補・再試行候補
node scripts/pipeline/discover.mjs                          # 新しい提出を universe に足す（昨日まで。キャッシュ済みの日は無料）
node scripts/pipeline/intake.mjs --dry-run --limit 50       # 何を取るか／有報が未取得の件数
node scripts/pipeline/intake.mjs --limit 50                 # id 割当・証拠パック。1社ごとに universe へ書き戻す
node scripts/pipeline/register-figures.mjs --limit 50       # 数値のみ登録の検査（書かない）
node scripts/pipeline/register-figures.mjs --limit 50 --register
node scripts/pipeline/queue.mjs claim group1 --limit 3 --owner me    # 取得＋予約。他のワーカーと重ならない
node scripts/pipeline/advance.mjs <id>                      # need: group1|group2 を表示 → Agent → もう一度 advance …
node scripts/pipeline/advance.mjs <id> --register           # ゲートを通れば登録
node scripts/pipeline/amendment-audit.mjs --refresh         # 登録の前に。索引を最新にする
```

### 途中で止まったとき

どの script も、完了した工程を二度やらない。再開 = **同じコマンドをもう一度**。

| 止まった場所 | 再開 |
|---|---|
| intake の途中 | 1社ごとに universe へ id を書き戻し、**証券コードを持つ state がある会社は取らない**（以前は終了時にまとめて書き、途中で止まると同じ会社に2つ目の id が付いた）。予約 `_code-<コード>` は `finally` で外れる |
| register-figures の途中 | 全件を検査してから一括で書き、失敗なら全部戻す。予約は `exit` で外れる |
| agent の途中 | 成果物（`pipeline/results/`）から `syncAgentStages` が状態を復元。`advance` をもう一度 |
| 工程が `running` のまま | `queue.mjs check` が警告し、再開コマンドを出す（`company-state.mjs <id> <stage> pending`） |
| 古いロック | 30 秒を過ぎた `pipeline/.lock` は引き継ぐ |
| 抽出器を直した後 | `EXTRACTOR_VERSION`（`evidence-pack.mjs`）を上げる。**未登録・未昇格の会社のパックは `pack.mjs` が自動で作り直す** |

並列度: エージェントは**常に1つずつ**（セッションのレート制限）。intake は逐次（1プロセスあたり最小 150ms 間隔の
スロットル、失敗は 0.5s→30s の指数バックオフ＋ジッタ、`Retry-After` を尊重、4xx は即失敗）。
1社の失敗は `setStage(failed)` に記録され、バッチは止まらない。3回で needs-review。

### 母集団の現在性（2026-10-04 追加、10-09 改訂）

universe は EDINET のスナップショットで、その日以降に出た有報を知らない。20社パイロットで Zenken が前年の
第49期のまま作られかけたのは、`discover.mjs` の窓の最終日（その日のうちに読んだ日次索引は未完了のまま
キャッシュされる）に第50期が出ていたため。

- `discover.mjs` は `--to` を指定されても**昨日まで**に切り詰める。
- `queue.mjs check` は、universe の窓が3日より古いと `universe-window-stale` の警告を出す（直す: `discover.mjs`）。
- **未昇格**（エントリー無し／figures-only）の会社は、`advance.mjs` が最初に、証拠パックの有報より新しい 120 が
  日次索引にないか見て、あれば**自動で新しい有報に乗り換える**（旧フラグメントとステージングは
  `pipeline/analysis/superseded/<id>-<旧docID>/` に退避、パックを作り直し、agent 工程は最初から）。読者に見える
  ものは、その後の昇格が書き換えるまで変わらないので安全。**境界**: 別の理由で止まっている会社
  （`registration` が needs-review）には触らない。昇格済み（published / needs-attention）は自動では更新せず、
  `queue.mjs check` が `entry-built-on-old-filing` として列挙する（人が決める）。
- 読み取り専用の確認: `pipeline/analysis/universe-staleness/scan.mjs`（universe・state・エントリーのどれが古いか）。

### 日次索引キャッシュの完全性（2026-10-09 追加）

日次索引（`%TEMP%/edinet-cache/index/<日>.json`）は universe の唯一の材料で、新しい有報の検出（`newerFiling`）が
読む唯一のもの。誤って持っていても、正しく持っているのと見分けがつかない。2026-10-09 に分かったこと:

- **確定前の索引が「完了」として残っていた。** EDINET の応答の `metadata.processDateTime` は EDINET 側の
  バッチが答えを作った時刻で、**その日のうちに作られた答えは、その後に出た書類を含まない**。2026-10-02 は
  11:57 に作られた 144 件で、確定後は 244 件だった（10-01 は 23:58、10-04 も当日）。以後の読み取りはすべて
  これを完全として扱っていた。
- **%TEMP% から消えていた。** 10-08 に約340日分、10-09 にさらに約460日分（更新から約1週間たったファイルが
  すべて）。コードに索引を消す処理はなく、Windows の記憶域センサー（一時ファイルの自動削除）が有効で、消えた
  ファイルの更新日時の切れ目がその挙動と一致するので、これが原因とみてよい。
- **日次索引だけは %TEMP% の外に置く。** `indexDir()`（`edinet.mjs`）は Windows では
  `%LOCALAPPDATA%japan-company-encyclopediaedinet-index` を既定にする（`RESEARCH_CACHE` を明示したときはその下の
  `index/`、`RESEARCH_INDEX_CACHE` で任意の場所）。証拠パックと書類のキャッシュは %TEMP% のまま — 消えても
  `advance.mjs` が作り直す。

直したこと（`scripts/research/edinet.mjs`）:

- `documentsOn` は、状態が 200、日付が一致、件数が `results` と一致、**`processDateTime` が当日より後**、の
  すべてを満たす答えだけをキャッシュに書く。書くときは一時ファイルに書いてから置き換える。確定前の答えは
  使えるが保存しない。キャッシュ済みでも確定前・読めないものは取り直す。**取得に失敗したら既存のファイルは
  そのまま**（消さない。確定前のものは使い、読めないものはエラー）。
- `auditIndexCache(from, to)` が欠落・破損・確定前の日を数える。`ensureIndexCache(from, to)` がそれを取り直す。
- `advance.mjs` は新しい有報を探す前に、その会社の有報提出日から昨日までを `ensureIndexCache` で確かめる。
  取り直せない日が残れば `FAIL: cache` で止まり、状態は変えない（「新しい有報は無い」と推測しない）。
- `queue.mjs check` は universe の窓に対して `index-cache-gap`（欠落／破損／確定前に取得）を警告する。
  `discover.mjs` を走らせれば取り直される。

### 訂正有報の分類（2026-10-09 追加）

証拠パックは、訂正有報ごとに原本とのXBRLを突き合わせ、`summary.amendments.records[]` に分類を持つ
（`classifyAmendment`、brief.md の「訂正有価証券報告書」と warnings にも出る）:

| 分類 | 意味 | 扱い |
|---|---|---|
| `record-only` | 5系列・従業員数・財務諸表の数値・エントリーが引用する本文が原本と同一。違うのは表紙や役員報酬など | 記録のみ。「訂正の中身を確認できない」を理由に needsReview にしない |
| `text-change` | 数値は同一だが、エントリーが引用する節（沿革・事業の内容・大株主…）の本文が違う | 本文は有効文書から書く。登録済みエントリーなら `amendment-audit` が needs-attention を勧める |
| `financial-change` | 5系列・従業員数、または財務諸表／主要な経営指標等の数値が違う | 数値は有効文書のもの。原本の数値が文章に混ざっていないか確認 |

`financial-change` の判定は財務諸表（`jppfs_cor`／`jpigp_cor`）と主要な経営指標等の数値。役員報酬や保有株式数など
その外の開示数値は `otherNumericChanged` に並べるだけで、分類を変えない。

### 財務の注記 `financials[].note`（2026-10-09 追加）

5年表は機械的に作られ、agent は表に直接書けない。年の読み方を読者に伝える注記は、**`businessModel` 工程の
fragment の `data.financialNotes`**（`data.businessModel.financialNotes` に入れても同じに扱う）に `[{ "fiscalYear": "2023年3月期", "note": "…" }]` で書く。
`merge-fragments` が `financials[].note` に反映する（表にない年度は needsReview、同じ年度は先のものを採用）。

書くのは、読者が数字の連続性を読み違えそうなときだけ: 会計基準の変更、過年度の訂正・修正再表示、収益認識基準
などの適用前後、12か月でない期、決算期の変更、訂正有報で数値が変わったとき。**有報が説明している事実だけを書き、
原因を推測しない。** 用語リンク（`[[term:…]]`）は使えない。`check-prose-figures` が金額を検査する。
`draft-entry.json` の `_注記の候補` が、パックから機械的に分かる事実（会計基準の変更、前期有報との差、
変則決算、決算期の変更、数値が変わる訂正）を並べる。書くかどうかは agent が決める。

### 有報提出後の変更（2026-10-09 追加）

有報を出したあと、商号変更や公開買付があっても、パイプラインはそれを知らなかった（パイロットの4社は品質確認で
初めて分かった）。`scripts/pipeline/post-filing.mjs` は日次索引だけから**候補の書類**を探す:

- 商号変更 — 同じ提出者（EDINETコード）の、有報より後の書類の提出者名が違う。
- 公開買付 — 意見表明報告書・公開買付届出書・同報告書（と訂正・撤回）で、その会社が提出者か対象。
- 提出の停止 — 有報の決算期末から14か月以上たつのに次の有報がない。年1回出す会社なら次は決算期末から約3か月で出るので、
  上場廃止の EDINET 上の現れ方（aeon-delight は最後が2025年2月期）。「止まった」と言うだけで理由は言わない。

見つかった未昇格の会社は `advance.mjs` が `registration` を needs-review にして止まる。人が内容を見て問題なければ
`advance.mjs <id> --ack-post-filing`（確認した書類を `identity.postFilingAcknowledged` に記録し、止めを外す）。
昇格済みの会社は `queue.mjs check` の `post-filing-event` に出る。エントリーは書き換えない。

見えないもの: **上場廃止そのもの**（取引所の情報で、人が確認する。上の「提出の停止」はその手がかり）、**臨時報告書**（提出事由は内閣府令の号で、議決権行使結果だけで過半、残りも多くの会社に出るので
目印にならない）、**株式併合**、有報後に出る
最初の書類までの商号変更（その会社がまだ何も出していない間は見えない）。

### 登録の中断からの復旧（2026-10-10 追加）

`finalize.mjs --register` は、エントリー・改訂記録・リサーチログ（新規なら index.ts の1行）を書き、整合性テストと型チェックを通したあとで、最後に後処理（`registeredAt`、`registration: completed`、taxonomyGaps、ステージング削除）をする。
書いたあと後処理の前でプロセスが止まる（PC のスリープ中にテストが走った ahresty がそうなった）と、エントリーは published なのに
`registration` が `running` のまま残る。この状態では `advance.mjs` は「済み」と答え、`finalize.mjs --register` は既存エントリーの
上書きを拒むので、通常のコマンドでは終えられない。

```
node scripts/pipeline/recover-registration.mjs <company-id> [--dry-run]
```

対象は `registration` が `running` の会社だけ。次を**すべて**確かめ、1つでも外れれば何も変えずに終了コード1で止まる:

- エントリーがあり、解説付き（published / needs-attention）で、id が合う。
- 現在のエントリーが、既存のフラグメントから作り直したエントリーと**完全に一致**する（`updatedAt` だけは登録した日なので除く）。
- その日付の改訂記録がちょうど1件、リサーチログがあり、index.ts に載っている。
- ステージングファイルが残っていれば、エントリーと同一。
- 整合性テストと型チェックが通る（中断前に通ったかどうかは分からないので、もう一度走らせる）。

通れば、`finalize.mjs` と**同じ関数**（`registration-tail.mjs` の `finishRegistration`）で後処理だけをする。エントリー・改訂記録・
リサーチログ・財務データは書かない。taxonomyGaps は「その会社の行を置き換える」ので重複しない。`completed` の会社に
もう一度実行しても何もしない（終了コード0）。`--dry-run` は確認だけで、何も変えず、テストも走らせない。

### 上場廃止会社の扱い（仕様判断を待つ記録）

過去に上場していた会社をどう登録するか、登録済みエントリーの関連会社リンクが上場廃止済みの会社を指して
いるのをどうするかは、**今は決めていない**（コードも変えない）。会社マスターに「上場／上場廃止」の区別
そのものがないため、これは別の仕様判断。該当: ftgroup（登録保留）、aeon-mall、aeon-delight、welcia-holdings、
nihon-chouzai、c-i-medical、sfp-holdings（登録済みのリンク先）。

### 既存の約 3,700 社（figures-only）は別の job

この仕組みは**新しく登録する会社**のためのもの。既存の登録を一括で直す作業は混ぜない:

- `employee-backfill` — 従業員数（`jpcrp_cor:NumberOfEmployees`）を既存エントリーに足す。EDINET の文書の再取得、
  `verify-financials`、会社ごとの Revision、`pipeline/state` の更新が要る。
- 決算期の変更・変則決算の見直し — 既登録の figures-only のうち数 % に、5年表の早い列の期末日が
  実際と違うものがある。同じ再取得で検出できる。
- 訂正の適用 — `apply-amendment.mjs` を1社ずつ。

いずれも `register-figures` / `advance` の対象外（エントリーが既にある会社は `intake` にも `register-figures` にも入らない）。

---

## エージェントへの作業要領

この節は、工程3〜8 を担当するエージェントにそのまま渡すためのもの。
**この要領に書かれていることは、依頼文より優先する。**

### 証拠

証拠パックが `evidence/<company-id>/` にある（`RESEARCH_CACHE` 配下）。`brief.md` が要約で、
最初に読むべきもの。`sections.json` に有報の全文が節ごとに入っているので、`brief.md` で
足りないときはそこを検索する。`draft-entry.json` は identity と5年分の財務で、機械的に
取得・照合済み。

**同じ情報を二度調べない（§31）。** 必要なものはほぼ確実にパックの中にある。EDINET を
取り直さない。パックに無くてどうしても要る事実があるときだけ web を見て、`warnings` にそう書く。

### 成果物の形

`pipeline/results/<company-id>-<stage>.json` に、工程ごとに1ファイル。

```json
{
  "companyId": "...",
  "agent": "<stage>-agent",
  "status": "completed",
  "data": { "…この工程が担当するフィールドだけ…" },
  "sources": [{ "id": "yuho-2026", "title": "…", "publisher": "…", "url": "https://…", "publishedAt": "YYYY-MM-DD", "accessedAt": "YYYY-MM-DD" }],
  "warnings": ["判断の記録・省いたものとその理由"],
  "needsReview": ["人が見る必要があるものだけ"],
  "taxonomyGaps": [{ "kind": "relationship | industry", "subject": "誰の何か", "actual": "実際の関係・暫定にした分類", "proposed": "欲しい値", "reason": "なぜ現在の分類で言い表せないか" }]
}
```

**`needsReview` と `taxonomyGaps` は別のもの。**

- `needsReview`: **何かが間違っているかもしれず、人が見る必要がある**もの（期間が12か月でない、上場が続いているか分からない、
  数値が有報と食い違う、出典が曖昧）。空でないと企業全体が `needs-attention` になる。判断の記録は `warnings` に書く。
- `taxonomyGaps`: **データは正しいが、閉じた分類（`INDUSTRY_IDS` / `RELATIONSHIP_KINDS`）では言い表せない**もの
  （有報が「親会社」と書く相手を表す値が無い、人材サービスの業界が無い）。会社を止める理由ではなく、分類を決めるための記録。
  **status は変わらない。** 研究ログ（`docs/research/<id>.md`）と `pipeline/taxonomy-gaps.tsv` に残る。
  `kind` は `relationship` か `industry`。旧規約の `needsReview` の「TAXONOMY: …」も同じ扱いで読まれる。
- 取り違えない。分類が足りないことを `needsReview` に書かない。逆に、**事実が不明・食い違うことを `taxonomyGaps` に書かない**
  （親会社を `business-partner` として結ぶ、関係を創作する、は誤りで品質問題）。

`sources` は `src/lib/content/schemas.ts` の `sourceSchema` と**完全に一致**させる。
`strictObject` なので、`id, title, publisher, url, publishedAt?, accessedAt` 以外の
キーがあると検証で落ちる。**`kind` というキーは存在しない。**

### 担当フィールド（これ以外を書くと組み立て時に捨てられる）

| 工程 | `data` に書けるキー |
|---|---|
| businessStructure | `businesses`, `name`, `shortNameEn`, `listings` |
| businessModel | `businessModel`, `description` |
| history | `history` |
| industry | `industries` |
| relatedCompanies | `relatedCompanies` |
| terms | なし（助言のみ。`requiredTermIds` と `proposedTerms` を書くと、捨てた旨の警告が出る。それが想定どおり） |

型は `src/types/company.ts`。既に登録済みの企業（`src/data/companies/suzuki.json` など）が
文体の見本。

`officialName`・`nameEn`・`code`・`financials` は機械工程が `draft-entry.json` に入れているので、
エージェントは書かない（書いても担当外として捨てられる）。

**`listings` の `market` は、有報が市場区分を印字しているときだけ書く。** 表紙の
「上場金融商品取引所名」が「福岡証券取引所」のように取引所名だけのときは `market` を省く
（安川電機・富士電機がこの形）。他社のエントリーから区分を写すのは捏造にあたる。
取引所は tse / nse / fse / sse。

**`sourceIds` を忘れない。** `businesses[]`（`children[]` も）・`businessModel`・`history[]`・
`relatedCompanies[]`・`financials[]` はすべて `sourceIds: string[]` を**必須**で持つ
（`schemas.ts` の `sourced`）。中身は `sources` 配列に書いた出典の `id`。1つも無いと
整合性ルールが「出典が1つもありません」で落とす。事実を述べる項目には必ず出典が要る、
という原則がそのまま型になっている。

**`businessModel.flow` は5段階ちょうど、この順。** `company` → `offering` → `customer` →
`revenue` → `profit`。1つずつで、増やすことも減らすことも並べ替えることもできない
（`integrity.ts` がこの並びを文字列として照合している）。

**`description`（一文の説明）は90文字以内で、句点は1つ。** 読者が3秒でその会社を掴むための
一文で、2文に割ると落ちる。

### リンク記法

`[[kind:id|表示する言葉]]`。**ラベルは必須**で、`[[term:segment]]` は検証で落ちる。
`kind` は term / company / industry / feature。リンク先が存在しないと落ちるので、
**提案中の用語にはリンクしない。**

リンクとして描画されるのは RichText を通すフィールドだけで、それ以外に書くと読者に
`[[term:segment|セグメント]]` がそのまま見える（整合性ルールが拒否する）：

| 書ける | 書けない |
|---|---|
| `description`（一文の説明） | `relatedCompanies[].description`（カード全体がリンクの内側） |
| `businesses[].description`（`children[]` も同じ） | `products` / `customers` / `revenueSources` |
| `businessModel.description` | `businessModel.flow[].title` |
| `businessModel.flow[].description` | `financials[].note` |
| `history[].description` / `.significance` | `name` などの識別情報 |

### 守ること

1. **捏造しない。** 有報に書かれていないことは書かない。書けないときは省いて `warnings` に理由を書く。
   宣言された欠落は、もっともらしい作り話より常に良い。
   **政策保有株式の表では、株式数と貸借対照表計上額を必ず読むこと。** ヤマハ発動機はスズキ・
   本田技研工業・SUBARU・キヤノン・三井物産など9社の株式を**各100株・計上額0百万円**だけ持ち、
   保有目的を「株主に対する情報提供方法等の情報収集のため」と書いている。これは取引関係ではなく
   IRの参考で、掲載済み企業名で全文検索すると本物の資本関係と見分けがつかない。逆に、有報が
   「当社と同社との間に取引関係はありません」と自ら明記していることもある（SCREENの社外取締役の
   前職について）。
2. **投資サービスではない。** 株価・PER・PBR・ROE・ROA・EPS・配当利回り・目標株価・買い推奨・
   売り推奨・自己資本利益率・時価総額・配当性向・1株当たり は使わない。
3. **やさしい日本語**（です・ます）。その会社を全く知らない読者に向けて書く。
4. 金額は有報の印字どおりの単位で、年度を添えて書く。
5. **決算期は3月期だと思い込まない。** ラベルは表紙の事業年度（DEIの当事業年度終了日）から取り、
   「YYYY年M月期」の形で書く。ヤマハ発動機は12月期、レーザーテックは6月期、ニトリHDは2月期。
   本文のほぼ全ての文にこのラベルが出るので、間違えると全体に広がる。
   `check-prose-figures.mjs` が本文の決算期ラベルを財務の5年分と有報の本文に突き合わせる。
6. `src/data/` に書き込まない。git を触らない。自分の成果物ファイル以外を作らない・変えない。
7. **`sources[].accessedAt` は UTC の今日（`date -u +%F`）。** 整合性ルールは「未来の日付」を UTC で
   判定する。日本時間の朝（0〜9時）に日本の日付を書くと UTC ではまだ前日で、登録ゲートが
   「accessedAt が未来の日付です」で落ちる（パイロット1社目で実際に起きた）。

### 業界の選び方

`industryId` は `src/types/company.ts` の `INDUSTRY_IDS` の閉じた集合から選ぶ。
`primary: true` はちょうど1つ。

**掲載済みエントリーに既にある慣例に揃える。** 新しい基準を思いつく前に、似た会社が
どう分類されているかを読むこと。判断の分かれ目になりやすいのは `semiconductors` で、
慣例はこうなっている：

- **半導体そのものをつくる会社**（ルネサス、ソシオネクスト、ローム）と**半導体製造装置を
  つくる会社**（東京エレクトロン、アドバンテスト、ディスコ）は当然 `semiconductors`。
- **半導体をつくらなくても、半導体向けの部材・部品・装置を事業として開示していれば
  `semiconductors` を2つ目に付ける。** AGC と信越化学工業は `chemicals` を主に、
  キヤノンとニコンは `electronics` を主にして、それぞれ `semiconductors` を併記している。
- 逆に、有報が半導体を**市場環境やリスクの文脈でしか書いていない**会社には付けない。
  TDK と村田製作所は `electronics` のみ。

金額が独立して開示されていない事業に業界を足さない。売上の半分を占めていても、有報が
その区分で金額を分けていなければ、読者はページ上でそれを確かめられない。

**この金額の条件は報告セグメントの単位で満たせばよい。** セグメントの中の1製品の金額が
分からないことは、その製品がセグメントの主要な製品として名指しされ、業績の増減の理由として
使われているなら妨げにならない（ヤマハ発動機のロボティクスは半導体製造後工程装置を主要製品に
挙げ、セグメントの売上高1,114億78百万円は開示されているが、装置単独の金額はない）。
ただし「読者がページ上で確かめられるのはセグメントの金額まで」と `warnings` に書くこと。

### 事業の並び順

有報が「報告セグメントに含まれない」（「レポーティングセグメントに含まれない」等の言い回しも同じ）と
書いている区分は、売上高がいくらであっても最後に置く。それ以外は外部顧客に対する売上高の大きい順。

**どの列で並べるかを間違えないこと。** 並び順を決めるのはセグメント注記の
「外部顧客への売上高／売上収益」の行だけで、セグメント間取引を含む「計」の行ではなく、
経営者による分析（MD&A）の段落の順でもない。アイシンでは、MD&Aが引く内部取引込みの基準だと
アセアン・インド（613,417百万円）が中国（598,917百万円）を上回るが、外部顧客基準では逆になる。
MD&Aの順序は最初に目に入るので、そのまま写してしまいやすい。

**セグメント利益の順は並び順に関係しない。** ただし売上の順と食い違うことが多く、
アイシンは利益で2番目のアセアン・インドが売上では4番目である。説明文では、
どちらの順位を引いているのかが読者に分かるように書く。

**決めるのは有報の位置づけで、名前ではない。** 「その他」という名前だから最後、ではない。
有報が報告セグメントの1つとして扱っている「その他」は、他の報告セグメントと同じ資格なので
売上高の順に置く。有報自身が「報告セグメントに含まれない」と書いているものだけが最後に行く。
掲載済みエントリーでも「その他」系51ノードのうち7つは売上高順のまま末尾にない。それは誤りではない。

**金額が印字されていないセグメント**は最後に置く。非継続事業に分類された等の理由で、
【事業の内容】には報告セグメントとして挙がっているのに売上・利益の表のどこにも出てこないことがある
（オムロンの電子部品事業）。この場合は最後に置き、**金額が印字されていない旨を明記する**こと。
ゼロだと読ませてはいけない。これは「報告セグメントに含まれない」の規則とは別なので、
どちらの理由で最後に置いたかを `warnings` に書く。

**複数セグメントの会社でも `children` を使ってよい。** 有報が各セグメントの下に区分を名指ししていれば
（富士電機の「分野」、横河電機がMD&Aで「サブセグメント」と呼ぶ区分）、印字されている順に並べる。
ただし**金額が独立して開示されていない区分に金額を書かない**。増減の方向や理由だけを書き、
「読者がページ上で確かめられるのは報告セグメントの金額まで」と `warnings` に記すこと。

**単一セグメントの会社**（「電子部品事業の単一セグメント」など）では報告セグメントが1つしかない。
そのときは【関連情報】の「製品及びサービスごとの情報」の製品区分を `children` に使ってよく、
親の `businesses` はその単一セグメント1ノードになる。製品区分の「その他」は上の原則どおり、
ただの製品区分なので売上高の順に置く（名前を理由に最後にはしない）。

### 沿革の日付が崩れている表

有報の沿革は本来「年月／沿革」の2列で、平坦化したテキストでも各事象の直前に年月が印字される。
ただし一部の会社では、**年月のセルがまとまって先に印字され、そのあとに事象文が連続する**崩れ方をする。
**「〃」は年月のセル1つとして数える。** 富士電機の崩れた箇所は「〃」で始まり、数えないと
事象6件に対して日付5件となって「壊れている」と判定され、実在する5件を落とすところだった。
数えれば6対6で、しかも3番目の事象が本文に「（４月１日）」と印字して3番目の日付と一致する。

**この数の規則が当てはまるのは、年月のセルが2つ以上続けて印字され、その間に事象の文が
挟まっていない場合だけ。** 年月1つのあとに文が2つ続くのは、1行の概要欄に2文入っているだけで、
壊れていない。どちらの文もその年月のものとして扱う（SCREENの2006年11月がこの形で、
次の行は通常の1年月1文に戻っている）。

2つ以上続いている場合は、次で切り分ける。

- **年月の数と事象文の数が違う → 壊れている。** 位置で対応づけてはいけない。
  他の箇所（事業の内容・注記・経営者による分析・別の沿革行の括弧書き）で日付が裏付けられる行だけを使う。
  京セラの2013年10月〜2026年4月のブロックは年月22件に対し事象24件で、位置で対応づけると
  「Kyocera Industrial Tools, Inc. の株式譲渡」が2026年4月になるが、同じ有報の注記13と
  経営者による分析はどちらも2026年1月と印字している。
- **数が一致している → 使える。** 平坦化は各グループ内の行順を保つので、i番目の年月はi番目の事象のもの。
  これは表の構造そのもので、推測ではない。`warnings` に「対応づけを復元した」と書く。
  数が一致していても、行順以外の裏付け（「2回目」のような本文中の順序表記、以降の行が使っている社名、
  表紙の記載など）があるブロックのほうが確度は高い。行順だけが根拠のときは、`warnings` にそう書く。

裏付けの取れない行は、年を推測して書くのではなく落とす。落としたものは `warnings` に列挙する。

### 表を読むときの注意

**まず数を数える。** 値の個数がヘッダーの項目数と同じなら、この節の心配は要らない。
ヤマハ発動機やレーザーテックのように「（うち米国）」と括弧が残る形で印字される有報もあり、
その場合は内数が目で見て分かる。**値の個数がヘッダーより多いときだけ**、下を読むこと。

**内数の列が行の中に挟まる。** 【関連情報】の地域ごとの情報は、ヘッダーが
「日本／北米／欧州／アジア／オセアニア／その他／合　計」と並んでいても、数値の並びには
北米の直後に「内、米国」の**内数**が入っていることがある（ヘッダーの2行目に印字されるため、
平坦化したテキストでは末尾に見える）。素直に足すと合計に合わない。内数列かどうかは、
その値が直前の地域の値以下に収まるかで判定できる。三菱自動車の当期・前期とも、3番目の数値が
北米の内数の米国だった。

**合計とわずかにずれるのは有報自身の丸め。** 各セルが百万円に丸められ、合計は丸める前の値の
和を丸めたものなので、横計は合計と数百万円以下ずれることがある（三菱自動車で3、SCREENで3、
レーザーテックで4）。3ずれているから抽出を間違えた、ではない。抽出の誤りではないので、
「合わないから使わない」ではなく、印字されている合計をそのまま引用する。

迷ったら、照合できる数値だけを引用して `warnings` に書く。
### 終わったら

```
export RESEARCH_CACHE=…/edinet-cache   # 証拠パックの場所。両方のスクリプトに必要
node scripts/pipeline/merge-fragments.mjs <company-id>
node scripts/pipeline/check-prose-figures.mjs <company-id> --fragments
```

**`RESEARCH_CACHE` を明示的に設定していないと、証拠パックはOSの一時フォルダに置かれ、
セッションの再起動やOSの一時ファイル整理で消える。** 数値のみで登録済み（`figures-only`）
だが解説（businessStructure〜terms）がまだの企業を後日再開するとき、パックが消えていて
`evidence/<id>/` が無ければ、**`run-mechanical.mjs` は使わない**——`src/data/companies/`
に既にエントリーがあるため「既存」として identity を `skipped` にするだけで、パックを
作り直さない。代わりに次を直接叩く。

```
node scripts/research/evidence-pack.mjs <id> <証券コード>   # pipeline/state/<id>.json の
                                                              # identity.note に記録した
                                                              # docID と一致することを確認する
node scripts/research/draft-entry.mjs <id>
```

`evidence-pack.mjs` は既定で2026-06-01〜06-30の窓を検索する。それより後の有報を対象にした
企業は `--from`/`--to` を `identity.note` の提出日に合わせること。窓を合わせれば、過去の
日次インデックスは変わらないので同じ docID が確実に再現される——出力の `docID` が
`pipeline/state/<id>.json` の記録と一致することを必ず確認してから先に進む。

1つめ：**「この工程は「」**（かぎ括弧まで含めて）で grep して、担当外のフィールドを書いた警告が
出ていないことを確認する。アセンブラの文面は `この工程は「X」を書けません` なので、かぎ括弧まで
入れれば自分が `warnings` に書いた文と衝突しない。「書けません」や「この工程は」だけで探すと、
助言工程の説明文などに当たってしまう。出たら直す。
`--write` は付けない（登録は `finalize.mjs` の仕事）。

2つめ：本文に書いた金額が全て有報の印字に辿れることを確認する。印字どおりの表記か、
百万円に換算した値のどちらかがパックの原文にあれば通る。落ちたときは、消して逃げる前に
「その数字が有報のどこにあるか」を答えられるか確かめること。答えられるなら報告に書く。

**千円額**（「資本金1,000千円」など。沿革や関係会社の状況に出る）と**単位のない円額**は、
百万円に換算できないので、有報の印字と完全に同じ表記でなければ落ちる。落としたくなければ
有報の書き方をそのまま写すこと。

**有報が印字しているとおりの表記で書けば、億円額もそのまま通る。** 検査はまず表記の逐語一致を
見て、合わなければ百万円に換算して探す。だから「428億円」と有報が印字しているなら「428億円」と
書けばよい。

落ちるのは、**有報の印字と違う書き方に直したとき**。レーザーテックの前期受注高を
「1,052億26百万円」と百万円を継ぎ足した形に書き換えると、有報にその表記はなく、換算値
105,226 を百万円単位で載せた表もないので落ちる。同じ文の当期受注高が通ってしまうのは、
品目別の表にたまたま237,504があるからで、半端に見えるのはそのため。
同じ罠は1つの文の中にも現れる。富士電機の海外売上高は「3,447億71百万円」としか印字されておらず、
`344,771百万円` と書き直すと落ちる。一方その隣の国内売上高は【関連情報】に `882,823` があるので
通ってしまう。**同じ文の片方だけが通る**ので、有報の印字どおりに書くのが唯一安全な書き方になる。

書き換えたくなったら、金額をあきらめて印字されている増減率を使うのが正解。

**`brief.md` の中にしかない数値は使えない。** 検査が読むのはパックの `*.txt` と `sections.json` だけで、
`brief.md` は含まれない。前期有報との比較で出てくる前期の数値（修正再表示チェックが拾ったもの）が
これに当たる。本文では数値を出さずに変化を言葉で説明するか、`warnings` に書く（`warnings` は
検査の対象外）。

残る穴は1つ、**丸い数字**（1,000百万円 → "1000"）で、ほぼ必ず偶然どこかに一致する。
通ったからといって確認済みではない項目が残る、ということ。

**兆・億の金額は小数第1位までの要約表記が使える。**「186.1兆円」のように、大きな金額を
1桁の小数で丸めて書いてよい（日本郵政のゆうちょ銀行・かんぽ生命の総資産級の金額で実例あり）。
検査は小数点を含めて1つの単位グループとして読み、186,100,000百万円として換算照合する
（2026-09-30以前は単位グループが整数しか受け付けず、小数点の直後の1桁だけを「1兆円」と
切り出して、たまたまパック中のどこかに"1000000"があれば通ってしまっていた。誤った値のまま
黙って通っていたバグで、`scripts/pipeline/check-prose-figures.mjs`側で修正済み）。

### 資本関係の種類（2026-10-02 追加）

`relationship` には取引関係のほかに、有報の【関係会社の状況】が使う4区分がある。**相手が「この会社の」何であるか**で選ぶ
（`supplier` と同じ向き）:

| 値 | 意味 | 有報の区分 |
|---|---|---|
| `parent` | 相手はこの会社の親会社 | 親会社 |
| `subsidiary` | 相手はこの会社の子会社 | 連結子会社・非連結子会社 |
| `affiliate` | 相手はこの会社の関連会社 | 持分法適用関連会社 |
| `other-affiliated-company` | 相手はこの会社の「その他の関係会社」 | その他の関係会社 |

- **`business-partner` を、これらの代用にしない。** 資本関係と取引関係は別の軸で、子会社が親会社から仕入れていても
  関係は `subsidiary`（取引は `description` に書く）。本当に取引・提携だけの関係のときは従来どおり `business-partner`。
- **大株主**は、今は関係の種類にしていない。`business-partner` に当てはめず、`taxonomyGaps` に書く（`kind: relationship`）。
- **経営統合・株式交換**は関係ではなく出来事。`history` に書く。
- **相手が未登録でも、それだけでは何も止まらない。** 結べない相手は `warnings` に書き、**架空の企業を作らない・
  非上場企業・海外企業・個人・資産管理会社を登録対象に加えない**（登録対象は上場会社）。分類が足りないことと同じく、
  `needsReview` には書かない。
- **業界**は `machinery`（機械）と `human-resources`（人材サービス）が加わった。それ以外で当てはまる区分が無いときは、
  最も近い値を暫定で選び、`taxonomyGaps`（`kind: industry`）に書く。環境・宿泊・理美容・印刷・楽器・外食は、
  根拠がまだ弱いので足していない（記録だけ溜める）。

### 同じ回に登録する企業どうしは結べない

**取引の向きが印字されていないときは `business-partner`（取引関係）を使う。** 政策保有株式の表は
「主に制御事業における取引等の効果」のように目的だけを書いて止まることが多い。これを `supplier` や
`customer` に押し込むと売り手と買い手を創作することになり、相手が鉄道会社や化学会社のときに
`same-industry` と書くのは端的に誤り。向きが印字されている場合だけ `supplier` / `customer` を使う
（「調達先として」なら supplier、名指しされた事業の買い手にしかなり得ないなら customer）。

**銀行・保険会社は、資金調達や保険取引を理由とする保有であれば結ばない。** どの製造業の有報にも
「資金調達の円滑化のため」「損害保険商品で取引があるため」という保有が並んでおり、全部結ぶと
どのページの関連企業欄も同じ4社（三菱UFJ・みずほ・三井住友・東京海上）で埋まって読者の役に立たない。
資本業務提携や事業上の協業など、金融取引を超える関係が印字されている場合だけ結ぶ。

`relatedCompanies[].companyId` は `src/data/companies/` に既にあるidでなければならないので、
同じバッチで登録する企業を互いに結ぶことはできない。電子部品メーカーを3社まとめて登録すると、
読者がいちばん見たい横のつながりがちょうど抜ける。**登録後に人の手で相互リンクを足す**前提で、
結べなかった相手を `warnings` に書き残すこと。

**掲載企業の一覧は、`relatedCompanies` を書く直前に読み直すこと。** 数値のみの一括登録が
並行して走っているため、1つの仕事の途中で `src/data/companies/` が増える。実際に、あるジョブが
オムロンを書いている間にJMDC（オムロンの54.3%子会社で、データソリューション事業そのもの）が
登録され、最初に作った一覧のままでは**その会社の最重要の関係を落とすところだった**。
件数は動くので、この文書にも依頼文にも数を書かない。

**社名の照合は全角・半角を揃えてから行う。** EDINETの表紙は英数字を全角で格納するため、
掲載済みエントリーは「ＡＤＥＫＡ」「ＪＭＤＣ」、有報の本文は「㈱ADEKA」「JMDC」と印字される。
そのまま `indexOf` で探すと1件も当たらず、**当たらなかったことにも気づけない**。
`String.prototype.normalize("NFKC")` を両側にかけ、「株式会社」「㈱」を落としてから比べること。

**同じバッチかどうかを問わず、結べなかった相手は全部書き残す。** 実際に多いのは未登録の相手で、
ヤマハ発動機とヤマハ株式会社（1955年に分離独立、2.98%を被保有、ブランドを共同運営）のように
有報が関係を詳しく印字しているのに結べない例がある。有報が保有目的や取引内容を具体的に
書いている相手（「販売先として」「部品購買のビジネスパートナー」など）は、その印字をそのまま
引いて `warnings` に残すこと。登録後に結び直す価値が高い。
