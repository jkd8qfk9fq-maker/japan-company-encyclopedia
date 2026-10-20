# 継続取得・更新パイプライン — 現状調査と設計（2026-10-19）

**状態: 調査と設計のみ。コード・データ・設定は変更していない。** 依頼（3層の分離、企業マスタ、財務の自動更新、詳細データの差分更新、
Actions と DB）に対して、既存の仕組みを先に棚卸しし、足りない部分だけを足す計画にした。実装は運営者の確認後に、数社で検証してから広げる。

---

## 1. 現在のデータ構造と登録・更新方法

### 1.1 保存先と件数

| 何 | どこ | 備考 |
|---|---|---|
| 企業エントリー（公開内容の正本） | `src/data/companies/<id>.json`（`companySchema`、`src/types/company.ts`） | **3,892社**: 公開 196、要確認 78、数値のみ 3,618 |
| 改訂記録 | `src/data/revisions/<日付>-company-<id>-<種類>.json`（`Revision`） | 4,159件。変更の前後・理由・日時 |
| リサーチログ | `docs/research/<id>.md` | 登録時に機械生成（判断の記録・警告） |
| 上場区分の台帳 | `pipeline/listing.tsv`（EDINET コードリストから `sync-listing.mjs`） | 証券コード・EDINET コード・名称・業種・上場区分・決算日 |
| 母集団 | `pipeline/universe.tsv`（`discover.mjs`） | 3,992行。日次索引から作る候補一覧 |
| 処理状態 | `pipeline/state/<id>.json`（git 管理外） | 工程ごとの状態、identity（docID・提出日・期末・訂正） |
| 下書き・確認待ち | `pipeline/results/`（フラグメント）、`pipeline/staging/`、`pipeline/autopilot/`（キュー・確認シート） | git 管理外・手元だけ |
| EDINET のキャッシュ | 日次索引（`%LOCALAPPDATA%`）、証拠パック（`%TEMP%/edinet-cache/evidence/<id>`） | 手元だけ |

### 1.2 エントリーの形（既存）

| 区分 | フィールド | 誰が書くか |
|---|---|---|
| 識別 | `id`, `code`（証券コード）, `name`, `officialName`, `nameEn`, `shortNameEn`, `listings` | 機械（`draft-entry`）。`name` 等の表示名は group1 |
| 財務（5年） | `financials[]`: `fiscalYear`, `periodEnd`, `revenue`, `profit`(+ラベル), `netIncome`, `totalAssets`, `netAssets`, `employees`, `accountingStandard`, `revenueBasis`/`netIncomeBasis`（連結・単体の注記）, `note`, `sourceIds` | 機械（XBRL → `verify-financials` で照合） |
| 詳細 | `description`, `businesses[]`, `businessModel`, `history[]`, `relatedCompanies[]`, `industries` | LLM（autopilot の group1・group2）＋人の承認（`approve`） |
| メタ | `sources[]`（`id`, `title`, `publisher`, `url`, `publishedAt`, `accessedAt`）、各項目の `sourceIds`、`status`（published / needs-attention / figures-only）、`updatedAt` | 機械 |

**無いもの**: EDINET コード・法人番号（エントリーにも state にも無い。台帳に EDINET コードだけある）、項目ごとの `as_of`・該当箇所・承認者、社名変更・上場廃止の履歴。

### 1.3 登録・更新の方法（既存）

| 経路 | 仕組み | 自動の範囲 |
|---|---|---|
| 新しい会社（数値のみ） | `discover` → `intake` → `register-figures`（`docs/pipeline.md`「大量登録スキーム」） | 一括で可。人が commit |
| 解説つきへの昇格 | autopilot（`enqueue` → `run` → 確認シート → `approve`）。`docs/auto-registration.md` | モデルは本文2回。登録は人の `approve` |
| 新しい年度の財務 | `refresh-financials`（検知は Actions が毎日、適用は人が `--apply`） | 検知のみ自動 |
| 訂正有報 | `amendment-audit --refresh`（週次・手動）→ `apply-amendment`（1社ずつ） | 推奨まで |
| 誤りの修正 | ローカルの管理画面エディタ（Revision を書く） | 人 |
| 公開 | commit → push → Cloudflare が `npm run build:static` で再ビルド（公開の企業だけ） | push 以降は自動 |

---

## 2. 既存の EDINET 連携と自動化

| 機能 | 実装 | 依頼の項目 |
|---|---|---|
| 日次索引の取得・確定判定・欠落の自動回復、夜間バッチ待ち、失敗理由 | `edinet.mjs`（`documentsOn`, `indexProblem`, `ensureIndexCache`, `classifyIndexFailure`, `scrubSecrets`） | 資料取得 |
| 書類（XBRL CSV・PDF）の取得 | `edinet.mjs`（`downloadDocument`, `readCsvRows`） | 資料取得 |
| XBRL から5年分の財務・ラベル・会計基準・連結/単体・変則決算・決算期変更 | `evidence-pack.mjs`（`detectIrregularPeriods`, `detectFiscalYearChange`, 連結が無い会社の単体行）、`draft-entry.mjs` | 抽出・単位・連結区分 |
| 財務の照合（タグと値） | `verify-financials.mjs` | 検証 |
| 本文中の金額の照合 | `check-prose-figures.mjs` | 検証 |
| 訂正有報の逆引き・分類（記録のみ／本文／数値） | `amendments.mjs`（`classifyAmendment`, `diffTextBlocks`, `financialsDifferences`）、`amendment-audit.mjs`、`apply-amendment.mjs` | 訂正資料 |
| 新しい年度の追加（既存の行は消さない、修正再表示・決算期変更・会計基準混在は保留） | `refresh-financials.mjs`（`planFinancialsRefresh`, `--rehearse`） | 差分比較・保存・**既存データを消さない** |
| 有報提出後の変更（商号変更・公開買付・提出停止） | `post-filing.mjs` | 社名変更・上場廃止の追跡（候補） |
| 上場区分・業種・新規上場の差分 | `sync-listing.mjs`（`diffLedgers`, `reconcile`） | 企業マスタ |
| 整合性・重複・予約・中断復旧 | `queue.mjs check`, `company-state.mjs`, `recover-registration.mjs` | 重複防止・復旧 |
| LLM の下書き＋検査＋確認シート＋承認 | autopilot（`autopilot*.mjs`, `prose-policy.mjs`, `ai-executor.mjs`） | 詳細データ＋人の承認 |
| 定期実行 | `.github/workflows/refresh-financials.yml`（毎日 07:00 JST、検知のみ、`contents: read`） | 定期取得・手動実行・ドライラン |
| 公開 | Cloudflare（`wrangler.jsonc`, `npm run build:static`） | 公開 |

---

## 3. 再利用できるものと、足りないもの

### 再利用（作り直さない）

上の表のすべて。特に、財務の「取得 → 抽出 → 検証 → 差分 → 保存」は `refresh-financials` がすでに一通り持ち、**取得に失敗しても既存データを消さない**（失敗は FAIL、修正再表示は HOLD、書くのは検証を通ったときだけ）。詳細データの「LLM の下書き → 機械の検査 → 人の承認」は autopilot が持つ。

### 足りないもの

| 依頼 | 足りないもの |
|---|---|
| 1. 3層 | 項目単位のメタ（該当箇所・`as_of`・承認者・承認日時）。今は出典が会社単位の一覧で、項目からは `sourceIds` で参照するだけ。承認は会社単位の状態と Revision（承認者なし） |
| 1. 詳細データの項目 | **成長戦略・競争優位性・業界内での位置づけ**の欄がスキーマに無い |
| 2. 企業マスタ | 法人番号（コードリストにはあるが読んでいない）。EDINET コードを主キーにした対応表。社名・上場区分の**履歴**（今は前回との差分の報告だけ） |
| 3. 財務 | 適用が手動（Actions は検知のみ）。数値のみの 3,618 社は既定で対象外（`--tier all` で対象になる）。実行履歴が 30 日の artifact だけ。訂正の監査が週次・手動 |
| 4. 詳細の差分更新 | **新旧の有報の本文を比べ、変わった項目だけ書き直す仕組みが無い**（今は「古い有報に基づく」と警告するだけ。autopilot の書き直しは group 単位で全面） |
| 5. Actions | 適用（書き込み）を Actions で行う経路（PR）が無い。実行履歴をリポジトリに残す仕組みが無い |

---

## 4. 推奨するデータ構造と処理フロー

### 4.1 3層は「ファイルを分ける」のではなく「書いてよい者を分ける」

エントリーを3つのファイルに分けると、スキーマ・リポジトリ層・管理画面のエディタ・公開ライン・テストのすべてを作り直すことになり、既存サイトを壊す危険が大きい。代わりに、**今のエントリーのまま、フィールドごとに「誰が書いてよいか」を決めてテストで固定する**。

| 層 | フィールド | 書いてよい者 | 公開の条件 |
|---|---|---|---|
| ① 事実 | `code`, `officialName`, `nameEn`, `listings`, `financials[]`（＋新しく `edinetCode`, `corporateNumber`） | 機械だけ（検証を通ったとき）。人の修正は管理画面＋Revision | 検証に通ること |
| ② 詳細 | `description`, `businesses`, `businessModel`, `history`, `relatedCompanies`, `industries`（＋将来の `strategy` 等） | LLM の下書き → 人の `approve`。機械は書かない | 人の承認 |
| ③ メタ | `sources[]`, `sourceIds`, `status`, `updatedAt`, Revision | 機械（①②の書き込みと同時に） | — |

**下書き（draft）は `src/data` に入らない**（`pipeline/results`・`staging`・確認シートにだけある）。だから「`src/data` にある＝承認済み」が成り立ち、承認状態を全項目に持たせなくても区別できる。承認者と承認日時は **Revision** に足す。

### 4.2 メタデータの追加（すべて任意フィールド。既存の 3,892 件はそのまま有効）

| 追加先 | フィールド | 意味 | 依頼の名前 |
|---|---|---|---|
| `Source` | `docId?` | EDINET の書類 ID（URL から読み取れるが明示する） | 出典書類ID |
|  | `asOf?` | その書類が対象とする時点（有報なら期末日） | `as_of` |
|  | （既存）`url`, `accessedAt`, `publishedAt` | 出典 URL、取得日、書類の日付 | 出典URL・`retrieved_at` |
| `Sourced`（各項目） | `locator?` | 該当箇所（例「【事業の内容】」「【関係会社の状況】」「連結財務諸表 注記」） | 該当箇所 |
| `FinancialRecord` | （既存）`periodEnd`, `revenueBasis`, `accountingStandard` | 対象時点・連結/単体・会計基準 | `as_of`・連結区分 |
| `Revision` | `approvedBy?`, `approvedAt?`, `reviewHash?`, `fields?` | 承認者・承認日時・確認シートのハッシュ・変更した項目 | 承認者・承認日時 |
| エントリー | （既存）`updatedAt` | 最後に変わった日 | `updated_at` |

`approval_status`（draft / approved）は、上のとおり保存場所で表す（draft＝パイプライン、approved＝`src/data`）。項目ごとに持たせる必要が出たら、そのとき `Sourced` に足す（今は勧めない。全項目に状態を持たせると、管理画面と検査の作り直しになる）。

### 4.3 企業マスタ

`pipeline/listing.tsv` をマスタに育てる（新しい台帳は作らない）。

- **主キーを EDINET コード**にし、列に `証券コード`, `法人番号`（コードリストの「提出者法人番号」。今は読み捨て）, `エントリー id`（掲載済みなら）を足す。証券コードは変わりうるので主キーにしない。
- **履歴**: 同期のたびに `diffLedgers` の結果（社名変更・上場区分の変化・業種変化・追加・消滅）を `pipeline/listing-history.tsv` に追記する（日付・EDINET コード・種類・前・後）。
- **重複防止**: `queue.mjs check` に「同じ EDINET コード・同じ法人番号のエントリーが2つ」を加える（今は証券コードだけ）。
- **マスタと公開の分離**: すでに分かれている（マスタ＝台帳、登録＝数値のみのエントリー、公開＝`published` だけ）。約4,000社のうち 3,892 社は数値のみで登録済みで、残りは新規上場など約100社。
- 取得は運営者の決定どおり手動（`--file`）。コードリストの機械取得は利用条件の解釈が確定するまで保留（JCE-021）。

### 4.4 財務: 取得 → 抽出 → 検証 → 差分 → 保存 → 公開

```
 [Actions 毎日] 日次索引 → 新しい有報・訂正の検知（refresh-financials のドライラン、amendment-audit --refresh）
       │  報告（artifact）＋ 実行記録（pipeline/runs/<日付>.json）
       ▼
 [適用] refresh-financials --apply（検証を通った年度だけ追加。既存の行は消さない。修正再表示・決算期変更は保留）
       │  方式A（今）: 手元で人が実行 → 差分を見て commit
       │  方式B（決定が要る）: Actions が適用してプルリクエストを作る → 人がマージ
       ▼
 [公開] main への push → Cloudflare が再ビルド
```

- **訂正**: `amendment-audit --refresh` を同じワークフローで毎日（今は週次・手動）。数値が変わる訂正は自動で書き換えず保留（今の規則のまま）。
- **単位・連結区分**: 抽出（`evidence-pack`）がすでに扱う（円単位、連結が無い会社だけ単体、`revenueBasis` に注記）。
- **数値のみの 3,618 社**も年次更新の対象にする（`--tier all`）。件数が多いので、まずドライランで所要時間と件数を測る。
- **方式B は JCE-016（本番から PR を作らない）の変更**にあたる（Actions は本番サーバーではないが、自動で書き込む経路になる）。決定してから作る。

### 4.5 詳細データの差分更新

```
 新しい有報を検知（登録済みの解説つき企業）
   → 新旧の証拠パックの節を比べる（新規: diff-filings.mjs。既存の diffTextBlocks を流用）
   → 節 → 項目の対応表で「書き直しが要る項目」を決める
        【事業の内容】・セグメント情報 → businessStructure / businessModel
        【沿革】                       → history
        【関係会社の状況】・株式の保有状況 → relatedCompanies
        【経営方針・経営環境及び対処すべき課題】 → （将来の strategy）
   → 変化が小さい項目は書き直さない（下書きの「基準時点」だけ新しい有報に更新するかは別に決める）
   → 変化が大きい項目だけ、変更前の文章と新旧の節の差分を添えて LLM に下書きさせる（autopilot の段階単位の書き直し）
   → 確認シートに「変更前 → 変更後」と根拠の節を並べる → 人の承認 → Revision（承認者・前後）
```

- 費用: 全面書き直し（約 $2.3/社）に対し、変わった段階だけなら概ね半分以下の見込み。差分が小さい会社はモデルを呼ばない。
- 最初の検証対象: `queue.mjs check` が「より新しい有報があるのに古い有報で書かれている」と示している **a-one-seimitsu・zero**（どちらも要確認）。

### 4.6 依頼にある新しい詳細項目について

成長戦略・競争優位性・業界内での位置づけは、スキーマに無く、**意見や評価になりやすい**（不変条件1・4）。入れるなら「会社が有報で述べていること」として、`as_of` と該当箇所（例: 【経営方針、経営環境及び対処すべき課題等】）を必須にする。表示の仕方も含めて、別の決定にする（最初の段階では作らない）。

---

## 5. 段階的な実装計画（各段階を数社で検証してから次へ）

| 段階 | 内容 | 主な変更ファイル | 検証（パイロット） | 完了条件 |
|---|---|---|---|---|
| 0 | 決定の記録、フィールドの持ち主をテストで固定 | `docs/decisions.md`、`tests/field-ownership.test.ts`（新） | — | 機械の経路が②を書けないことがテストで固定される |
| 1 | 企業マスタ: EDINET コード主キー、法人番号、エントリー id、履歴 | `scripts/pipeline/sync-listing.mjs`、`pipeline/listing.tsv`、`pipeline/listing-history.tsv`（新）、`scripts/pipeline/jobs.mjs`（重複検査）、`tests/sync-listing.test.ts` | 手元のコードリスト（2026-10-16）で同期し、3,892 社が EDINET コードに一意に対応することを確認 | 重複 0、対応できない会社の一覧が出る |
| 2 | メタデータ（任意フィールド） | `src/types/source.ts`、`src/types/company.ts`、`src/types/revision.ts`、`src/lib/content/schemas.ts`、`src/lib/content/integrity.ts`、`scripts/pipeline/finalize.mjs`・`refresh-financials.mjs`・`autopilot.mjs`（書き込み）、`scripts/research/draft-entry.mjs` | 3社を新規登録・1社の財務更新で、出典に `docId`/`asOf`、項目に `locator`、Revision に承認者が入る | 既存 3,892 件が無変更で通る。全テスト合格 |
| 3 | 財務の自動更新の運用化 | `.github/workflows/refresh-financials.yml`（訂正の監査を追加、実行記録）、`scripts/pipeline/refresh-financials.mjs`（`pipeline/runs/` への記録、`--tier all` の分割実行）、（方式B を選んだ場合）新しいワークフロー | 新しい有報がある5社で `--rehearse` → `--apply` → 差分確認 | ドライランで件数・所要時間が分かる。失敗時に既存データが残る |
| 4 | 詳細データの差分更新 | `scripts/pipeline/diff-filings.mjs`（新）、`scripts/pipeline/autopilot*.mjs`（段階単位の更新モード、確認シートの前後表示）、`docs/agent-brief.md`（更新時の指示） | a-one-seimitsu・zero の2社 | 変わった項目だけ下書きされ、前後と根拠がシートに出る。差分が小さい項目はモデルを呼ばない |
| 5 | 拡大と DB の検討 | — | 数十社 → 全体 | 下の移行条件に当たったら Supabase 等を設計 |

### Supabase などへの移行を検討する条件

- 承認待ちが常に数十社以上あり、複数人で承認する。
- 項目単位の承認状態・コメント・担当者を管理する必要が出る。
- 実行履歴を長期に検索・集計する必要が出る（今は JSON と artifact）。
- それまでは JSON（リポジトリ）＋ Actions ＋ Cloudflare のまま。DB を入れると、本番が書き込む構成（JCE-016 の変更）になる。

---

## 6. 運営者に決めてほしいこと（2026-10-19 に決定: JCE-024）

決定: 1 は方式B（検証して PR、マージは人）、2 は対象にする、3 は作る（会社の説明と編集部の分析を分け、出典と時点を必須）、
4 は当面 YUGENQ（承認者は id・名前・種類の構造で、個人単位にも広げられる）、5 は今の表示を維持して CLAUDE.md を直す。
以下は決定前の問いとして残す。

1. **財務の適用を Actions に任せるか**（方式B: 自動でプルリクエスト。JCE-016 の変更、`contents: write` の権限）。今のまま（方式A: 手元で適用）でもよい。
2. **数値のみの 3,618 社も毎年更新するか**（公開されていないが、昇格の材料になる。実行時間と EDINET への負荷が増える）。
3. **成長戦略・競争優位性・業界内での位置づけ**を新しい項目として作るか（作るなら「会社が述べていること」として出典・時点を必須に）。
4. **承認者の名前**（Revision に残す。YUGENQ でよいか、個人名は残さないか）。
5. **公開ページの財務表**: 今の表は経常利益（等）・総資産・純資産・従業員数も表示している。CLAUDE.md の不変条件4は「売上高と純利益だけ」と書いている。どちらに合わせるか（今回の依頼は総資産も事実データとして扱う前提）。

---

## 7. 実装状況（2026-10-19）

| 段階 | 状況 | 主な成果物 |
|---|---|---|
| 0 | 済 | JCE-024、`scripts/pipeline/ownership.mjs`（`assertMachineWrite`）、`tests/field-ownership.test.ts`、CLAUDE.md 不変条件4 |
| 1 | 済 | `sync-listing.mjs`（法人番号・エントリー id・履歴 `pipeline/listing-history.tsv`・重複検査）、`pipeline/listing.tsv` の列追加 |
| 2 | 済 | `Source.docId/asOf`、`Sourced.locator`、`Revision.approval`、`perspectives`（表示: 戦略と強み）、`src/data/approvers.json` |
| 3 | 済（GitHub 側の設定が残る） | `.github/workflows/refresh-financials.yml`（detect / propose）、`pipeline/runs/` |
| 4 | 済（パイロット: a-one-seimitsu は keep でモデル呼び出しなし。zero は businessModel だけ書き直して確認シートまで。承認は運営者。登録の経路はリポジトリの複製で approve まで確認） | `diff-filings.mjs`、`start-update.mjs`、`update-scope.mjs`、`advance/finalize --update`、`autopilot update`、確認シートの前後表示、`tests/explanation-update.test.ts` |

| 追補（2026-10-19） | 済 | AI の代理承認の区別（JCE-025、3社に訂正の改訂記録）、旧い期の数字・日付を書いた工程の検出（`diff-filings.mjs` の figures）、更新の再計画、訂正有報の毎日監査（Actions、`--from-entries`、報告のみ）、`find-locators.mjs`（読み取りのみ） |

決めたこと（4.5 の実装で）: 書き直さない工程は公開版から書き戻す（最初の成果物ではなく。管理画面の訂正を消さないため）。
その部分の金額は旧有報で照合済みとして照合しない（出力に明記）。数値は更新しない（先に refresh-financials）。terms は助言なので引き継ぐ。
