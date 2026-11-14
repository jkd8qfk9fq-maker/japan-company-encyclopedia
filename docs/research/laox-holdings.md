# ラオックスホールディングス — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ラオックスホールディングス株式会社 |
| 証券コード | 8202 |
| docID（データを取り出した文書） | `S100XVC0` |
| 原本 docID | `S100XUR2` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XVC0／有効文書 S100XVC0（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVC0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ラオックスホールディングス株式会社 / 8202 / docID S100XUR2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
laox-holdings: 10 件の数値を有報XBRLと照合
有報: ラオックスホールディングス株式会社 訂正有価証券報告書－第50期(2025/01/01－2025/12/31) (docID S100XVC0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第50期(2025/01/01－2025/12/31)、docID S100XVC0）を有効文書としてこのパックを作った。原本は docID S100XUR2。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはIndependentAuditorsReportNonConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
laox-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100XVC0、2026年４月２日提出）です。原本（S100XUR2）との差異はdifferenceCount 0で、財務の数値も本文も同一であり、異なるのは個別の監査報告書に関するテキストブロックのみ（record-only）であることを確認したため、needsReviewにはせず、ここに検証結果を記録しました。情報源は訂正有報のものとしています。
- businessModel: 証拠パックの注意（財務諸表の組替えの記載）については、パック内の本文・注記に該当する記載を確認できず、前期有報との修正再表示チェックも全行一致しているため、組替えに関するfinancialNotesの追加記録は行わなかった。経営指標の注に印字された収益認識基準の適用については、2022年12月期のfinancialNotesに記録した。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されているため、needsReviewには記録していない。
- businessStructure: 報告セグメントの外部顧客への売上高で事業を並べ替えた（ギフトソリューション34,540百万円／リテール20,841百万円／アセット・サービス1,913百万円／トレーディング241百万円）。セグメント利益・損失は本文に記載していない。
- businessStructure: 当期にBarddy株式会社を新たに設立し、株式会社銀座鈴屋の全株式を取得して連結の範囲に含めた。期末現在の体制に反映済みのためneedsReviewにはせず、ギフトソリューション事業の説明に記載した。連結子会社であった上海爍港郵輪科技有限公司は清算結了により当期から連結の範囲から除外されている。
- businessStructure: トレーディング事業について、セグメントの概要は「PB商品等の輸出入を通じた貿易事業、グローバルEC等」と印字する一方、MD&Aは中国での日本料理店「くろぎ」の飲食事業を中心に推進していると述べるため、両方を子事業として記載した。
- history: 創立時の資本金の額は、沿革に印字されているが金額情報のため沿革の記述には含めていない。
- history: 2022年は市場移行（４月）と持株会社体制への移行（10月）の２件を分けて記載した。
- industry: 最大の報告セグメントであるギフトソリューション事業とリテール事業はいずれも商品の販売事業であり、閉じた分類に retail が実在するため主分類とした。分類ギャップには当たらない。
- industry: トレーディング事業はPB商品等の輸出入を通じた貿易事業であり trading が実在するため副分類とした。アセット・サービス事業は不動産関連だが外部顧客への売上高が小さく、副分類には加えなかった。
- relatedCompanies: 株式会社エスクリ（証券コード2196）：MD&Aに、連結子会社のシャディ株式会社が株式会社エスクリとの協業を通じてブライダル領域における販路拡大に取り組んだ旨が記載され、特定投資株式としても「新たな業務提携に伴う株式の取得」として当期に780,000株を取得し、ギフトソリューション事業におけるサービス強化や顧客基盤拡大、営業協力等によるシナジー創出を目的に保有する旨が印字されている。しかし同社は関連企業候補データに含まれず百科事典のエントリーファイルも存在しないため、関連企業として結ぶことができず不リンクとした。提携の事実はここに記録する。
- relatedCompanies: 蘇寧易購集団股份有限公司、蘇寧国際集団股份有限公司、GRANDA MAGIC LIMITEDは、その他の関係会社として議決権の30.39％を被所有する関係にあるが、いずれも中国・ケイマン諸島の会社で百科事典の掲載候補に含まれないため不リンクとした。GRANDA MAGIC LIMITEDは発行済株式の30.39％を所有する筆頭株主でもある。
- relatedCompanies: 日本観光免税株式会社は、2009年に業務資本提携を締結した相手であり発行済株式の6.01％を所有する大株主だが、非上場で候補データに含まれないため不リンクとした。
- relatedCompanies: シャディ株式会社、株式会社バーニーズジャパン、ラオックス・グローバルリテーリング株式会社等のグループ会社は、自社の連結子会社であるため関連企業リンクの対象外とした。楽購仕（山東）越境電子商務有限公司は自社の関連会社であるため対象外とした。
- relatedCompanies: career、land、en、como、zero、base-4481、lec、rent、s-t、the-lead、yamato、cota、nissin、chuco、corona、daiwa、king、members、seki は、本文中の一般語・部分一致（例：careerは「キャリア形成」、enは「井門エンタープライズ」の部分一致）であり、相手企業についての取引・提携・資本関係の記載がないため不リンクとした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
