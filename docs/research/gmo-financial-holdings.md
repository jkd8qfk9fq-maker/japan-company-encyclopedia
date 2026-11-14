# GMOフィナンシャルホールディングス — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＧＭＯフィナンシャルホールディングス株式会社 |
| 証券コード | 7177 |
| docID（データを取り出した文書） | `S100YHX6` |
| 原本 docID | `S100XSFM` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100YHX6／有効文書 S100YHX6（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHX6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＧＭＯフィナンシャルホールディングス株式会社 / 7177 / docID S100XSFM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gmo-financial-holdings: 10 件の数値を有報XBRLと照合
有報: ＧＭＯフィナンシャルホールディングス株式会社 訂正有価証券報告書－第15期(2025/01/01－2025/12/31) (docID S100YHX6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第15期(2025/01/01－2025/12/31)、docID S100YHX6）を有効文書としてこのパックを作った。原本は docID S100XSFM。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（OverviewOfAffiliatedEntitiesTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
gmo-financial-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「GMOフィナンシャルホールディングス株式会社」が EDINET の提出者名「ＧＭＯフィナンシャルホールディングス株式会社」と違います
- 確認: [other-profit-wording] businessModel.revenueSources[0]: 売上高と当期純利益以外の利益に触れていないか確認する（…トレーディング損益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YHX6、2026年6月24日提出）であり、原本（S100XSFM）との差異は関係会社の状況の本文（OverviewOfAffiliatedEntitiesTextBlock）のみで、数値の差異は0件であることを確認した。登録数値はすべて有効文書の印字どおりであり、この検証は警告にのみ記録した。出典は訂正有報を指す。
- businessModel: 重要な後発事象として印字された第3回新株予約権の発行（2026年2月4日取締役会決議、ストック・オプション）は資本政策に関する事項のため、needsReview ではなく警告に記録した。
- businessModel: 当期中に連結の範囲が変わった事項（GMOヘルスケア株式会社等のグループ内吸収合併による除外、GMO One Account株式会社等の新規設立による追加）は、2025年12月31日時点の構成（連結子会社16社）に反映済みのため、沿革・警告に記録し、needsReview には入れなかった。
- businessModel: セグメントの外部顧客への営業収益の合計（49,517百万円）と連結営業収益（49,518百万円）の1百万円の差は、印字どおり記載した。
- businessModel: businessModel に suppliers は記載しなかった。金融商品取引業を中核とする当社グループについて、有報に仕入先に当たる個別の事実の印字がないためである。
- businessModel: 金額は有報の百万円印字をそのまま記載した（換算・四捨五入はしていない）。
- businessModel: check-policy の確認事項として、revenueSources の「トレーディング損益」が利益関連語に触れたが、これは有報の損益計算書に印字された収益区分そのものの名称（2025年12月期36,059百万円）であり、原文どおりの記載として維持した（miyaji-engineering-group の先例と同様の判断）。
- businessStructure: セグメントの外部顧客への営業収益の合計は49,517百万円で、連結営業収益49,518百万円とは1百万円の差がある。印字どおり記載した。
- businessStructure: MD&Aのセグメント別営業収益（その他2,729百万円）は内部振替を含む数値のため使わず、セグメント注記の外部顧客への営業収益を用いた。
- businessStructure: 連結子会社（GMOクリック証券株式会社、GMOコイン株式会社等）の単体損益数値は事業構造の子要素には記載しなかった。
- history: 沿革に印字された子会社の資本金額は、禁止される財務金額に当たるため沿革には記載しなかった。
- history: 当社の完全子会社化以前のGMOクリック証券株式会社の沿革（2005年設立等）は、当社自身の沿革ではないため対象としなかった。
- industry: 証券・FX事業と暗号資産交換事業を中核とする金融持株会社であるため、主産業は finance とした。
- relatedCompanies: CME Group Inc.は特定投資株式として40,000株を保有し、その目的は当社子会社が同社の金融取引所で取引を行う際の法人会員資格の維持と印字されているが、米国法人であり百科事典の登録対象にないため未リンクとした。事実はここに記録する。
- relatedCompanies: GMOあおぞらネット銀行株式会社は、沿革に2016年7月のインターネット銀行の共同運営に関する資本提携が印字されているが、非上場で関連候補に含まれないため未リンクとした。事実はここに記録する。
- relatedCompanies: 当社の連結子会社（GMOクリック証券株式会社、GMOコイン株式会社、GMO外貨株式会社等）は当社グループ自身の会社のため、関連企業には含めなかった。
- relatedCompanies: 関連候補のうち、カバー（カバー取引の語）、高島（代表者の姓）、セキ・キング・ランド・ポート・ベース・リード・レック等は通常の語句との一致による誤検出であり、有報に取引・提携・資本関係の記述がないため未リンクとした。
- terms: 助言: 用語「店頭FX」は、顧客と金融商品取引業者が相対で外国為替証拠金取引を行う取引形態であり、当社の収益の柱であるため、用語集への追加を提案します。
- terms: 助言: 用語「CFD（差金決済取引）」は、原資産の受渡しを行わず売買の差金のみを決済する取引であり、当社が注力する商品であるため、用語集への追加を提案します。
- terms: 助言: 用語「ステーキング」は、暗号資産を保有・預託することでネットワーク運営に貢献し報酬を得る仕組みであり、当社のストック型商品の名称に使われているため、用語集への追加を提案します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
