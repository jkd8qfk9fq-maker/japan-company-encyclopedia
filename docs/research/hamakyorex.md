# ハマキョウレックス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ハマキョウレックス |
| 証券コード | 9037 |
| docID（データを取り出した文書） | `S100YBXW` |
| 原本 docID | `S100YBXW` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBXW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ハマキョウレックス / 9037 / docID S100YBXW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hamakyorex: 10 件の数値を有報XBRLと照合
有報: 株式会社ハマキョウレックス 有価証券報告書－第55期(2025/04/01－2026/03/31) (docID S100YBXW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hamakyorex: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 変則決算・決算期の変更・会計基準の変更はありません。financialNotes は空です。2024年10月1日付の株式分割（普通株式1株につき4株）は financialNotes の対象ではないため記載していません。
- businessStructure: 事業の並び順は、【セグメント情報】の外部顧客への営業収益の大きい順です。
- businessStructure: 当企業グループは当社及び子会社43社で構成されています（【事業の内容】）。
- history: 沿革の表で年月が2つ続けて印字され事象文と分かれている箇所は、年月と事象の数が同じため行順で対応づけました。2016年11月を藤栄運輸の株式取得、2017年4月を千代田運輸の株式取得としました。
- history: 沿革は主な出来事を選びました。2015年から2023年の一部の子会社取得（千葉三港運輸、HMKロジサービス、シティーライン、栄進急送、マルコ物流、大一運送、中神運送、山里物流サービス、京阪久宝HD）は省略しました。
- industry: 主たる業界は運輸としました。報告セグメントは物流センター事業と貨物自動車運送事業で、売上の大半を占めるのは物流センター事業です。
- relatedCompanies: レック（7874）：「スーパーレックス」の部分一致による誤マッチで、有報にレック株式会社との取引・提携・資本関係の記載はありません。
- relatedCompanies: ポート（7047）：「バンスポート」の部分一致による誤マッチです。
- relatedCompanies: 丸運（9067）：「石丸運輸」の部分一致による誤マッチです。
- relatedCompanies: ゼット（8135）：「サカイアゼットロジ」の部分一致による誤マッチです。
- relatedCompanies: ベース（4481）：「営業利益ベース」の語句の一致で、会社との関係はありません。
- relatedCompanies: ラストワンマイル（9252）：「ラストワンマイル物流」は事業の説明で、株式会社ラストワンマイルとの取引・提携の記載はありません。
- relatedCompanies: トラスト（3347）：日本マスタートラスト信託銀行は【大株主の状況】に載る信託銀行で、純投資のため結びません。
- relatedCompanies: コア（2359）：「物流センター事業をコアとする」の語句の一致で、会社との関係はありません。
- relatedCompanies: 伊藤忠商事（8001）：1993年に合弁でスーパーレックスを設立した記載はありますが、現在の取引・提携・資本関係の記載はなく、過去1回限りの提携のため結びません。
- relatedCompanies: ぴあ（4337）：「とぴあ浜松農業協同組合」の部分一致による誤マッチです。
- relatedCompanies: しずおかフィナンシャルグループ（5831）：特定投資株式の表に載るのみで、保有目的は金融・資金取引及び事業運営上の関係強化という定型的な記載のため、銀行・金融機関として結びません。
- relatedCompanies: 連結子会社および非連結子会社（計43社）は非上場のため結んでいません。
- terms: 用語の助言はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
