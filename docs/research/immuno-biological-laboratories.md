# 免疫生物研究所 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社免疫生物研究所 |
| 証券コード | 4570 |
| docID（データを取り出した文書） | `S100YLCK` |
| 原本 docID | `S100YLCK` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLCK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社免疫生物研究所 / 4570 / docID S100YLCK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
immuno-biological-laboratories: 10 件の数値を有報XBRLと照合
有報: 株式会社免疫生物研究所 有価証券報告書－第44期(2025/04/01－2026/03/31) (docID S100YLCK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
immuno-biological-laboratories: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの「財務諸表の組替え」の警告を確認した。経営指標等の注記には組替えに該当する記載はなく、前期有報との照合（修正再表示チェック）でも全系列で差異がなかったため、financialNotesには記載せず、表示方法の注記（潜在株式が存在しないこと、損失計上年度の指標の非表示、従業員数の臨時従業員の外書き）はいずれも表示上の事項としてwarningsのみとした。
- businessModel: 指標注記に株式分割・株式併合、決算期変更、変則期間、会計基準の変更の記載はないため、financialNotesは空とした。
- businessModel: MD&Aの印字する営業利益・経常利益などの金額と増減理由、セグメント利益、キャッシュ・フローの金額、研究開発費の金額は規則により本文に記載していない。売上高の増減率と理由、親会社株主に帰属する当期純利益の増減率のみ記載した。
- businessModel: 経営方針の目標とする経営指標のうち投資指標にあたるものは記載していない。
- businessModel: 主要な販売先のImmuno-Biological Laboratories, Inc.は関連企業候補に含まれていないため、関連企業としては結ばず、顧客段の記述にとどめた。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（抗体関連事業1,002,307千円、化粧品関連事業2,679千円）。千円額を百万円に切り捨てて記載した（切り捨て後の合計1,004百万円は印字の合計1,004百万円と一致）。
- businessStructure: 抗体関連事業の子区分の金額は収益認識注記の分解情報の印字（診断試薬サービス867,659千円、検査サービス31,841千円、ＴＧカイコサービス102,806千円）を百万円に切り捨てた。切り捨て後の小計1,000百万円は抗体関連事業の印字1,002百万円と2百万円異なるが、印字どおり記載した。
- businessStructure: 設備はすべて抗体関連事業に帰属する印字のため、子区分には結びつけていない。
- businessStructure: 連結子会社は株式会社ネオシルク化粧品（議決権100％、化粧品関連事業）と株式会社AI Bio（議決権49％、抗体関連事業）の2社で、関係会社の状況の印字どおり連結子会社として記載した。AI Bioは2021年2月に合弁会社として設立され、2023年3月に子会社化された。
- businessStructure: suppliersキーはこのツリーの旧スキーマにないため省略した。個別に印字された仕入先はない。
- history: 沿革の全19件を登録した。設立時の資本金の金額は規則により記載していない。
- history: 2021年11月のスカイライト・バイオテック吸収合併と2021年2月のAI Bio設立は、沿革の印字順どおり年ごとにまとめた。
- industry: 主たる業界はpharmaceuticalsとした。売上高の大半を占める抗体関連事業は、研究用試薬、体外診断用医薬品とその原料、医薬シーズの開発を中核とするためである。
- industry: 化粧品関連事業は独立した報告セグメントだが、2026年3月期の外部顧客への売上高は2百万円で全体のごく一部にとどまるため、化粧品に相当する業界値は付けていない（化粧品にあたる値も分類表にない）。
- industry: foodは付けていない。食品企業はLipoSEARCH®の利用先として印字される顧客の一部にとどまるためである。
- relatedCompanies: sysmex: 主要な顧客ごとの情報に販売先として印字され、重要な契約等にも業務提携契約が印字されているためcustomerとして結んだ。
- relatedCompanies: nippi: 売買取引基本契約と共同研究の両方が印字されているが、取引の向きが単独では定まらないためbusiness-partnerとして結んだ。
- relatedCompanies: phoenixbio: 業務提携契約書が重要な契約等に印字されているためbusiness-partnerとして結んだ。
- relatedCompanies: trans-genic-group: 大株主の状況に事業会社として印字されているためmajor-shareholderとして結んだ。
- relatedCompanies: the-towa-bank: 大株主の状況に載る銀行で、資金調達・金融取引の文脈のみのため結ばなかった。
- relatedCompanies: en: 「エン」という語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: seki: 「セキュリティ」等の語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: corona: 「新型コロナウイルス感染症」という語の部分一致のみのため結ばなかった。
- relatedCompanies: kohsoku: 「高速液体クロマトグラフィー」という語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: land: 「ブランド」という語の部分一致のみのため結ばなかった。
- relatedCompanies: port: 「サポート」という語の部分一致のみのため結ばなかった。
- relatedCompanies: ray: 「フレイル」等の語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: rix: 「マトリックス」等の語の部分一致のみのため結ばなかった。
- relatedCompanies: core: 「コア技術」という一般語の一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: innovation: 「イノベーション」という一般語の一致のみのため結ばなかった。
- relatedCompanies: ishin: 「三重大学」の「重」の字を含む大学名の部分一致のみで、イシン株式会社について述べる印字はないため結ばなかった。
- relatedCompanies: rion: 「ニッピブル」という製品名の部分一致のみで、リオン株式会社について述べる印字はないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手（いずれもwarningsへの記録のみ）: 主要な販売先のImmuno-Biological Laboratories, Inc.、OEM契約先の303 Pharma Srl、独占的実施許諾先のSML Biopharm Co., Ltd.、共同開発先の学校法人埼玉医科大学・国立大学法人徳島大学、特許実施契約先の国立大学法人三重大学、抗HIV抗体開発の株式会社CURED。
- relatedCompanies: 特定投資株式は該当事項なしのため、政策保有株式を根拠とするリンクはない。自社の連結子会社2社は結んでいない。
- terms: 助言のみ。用語としては『ELISA』『抗体』『遺伝子組換えカイコ』『リポタンパク質プロファイリング』『体外診断用医薬品』『医薬シーズ』『ヒト型コラーゲン』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
