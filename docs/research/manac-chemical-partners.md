# マナック・ケミカル・パートナーズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社マナック・ケミカル・パートナーズ |
| 証券コード | 4360 |
| docID（データを取り出した文書） | `S100YGOW` |
| 原本 docID | `S100YGOW` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGOW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社マナック・ケミカル・パートナーズ / 4360 / docID S100YGOW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
manac-chemical-partners: 10 件の数値を有報XBRLと照合
有報: 株式会社マナック・ケミカル・パートナーズ 有価証券報告書－第5期(2025/04/01－2026/03/31) (docID S100YGOW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
manac-chemical-partners: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は主要な経営指標等の注記３（第１期の連結財務諸表がマナック株式会社の連結財務諸表の引継ぎで、第２四半期連結累計期間を含む）のみを採用した。注記１・２は潜在株式の不存在と損失年度の指標非表示という表示事項のため warnings にとどめた。
- businessModel: 抽出器の「財務諸表の組替え」警告について: 抽出済みの各節テキストに組替えの注記は見当たらず、前期有報との照合でも６系列×４行すべて差異がなかったため、経営指標等に影響しない表示上の取扱いと判断し、financialNote にはせず warnings に記録した。
- businessModel: 中期計画の目標指標（自己資本利益率）は投資指標のため、数値は本文・perspectives のいずれにも書かなかった。
- businessModel: MD&A の段階利益・キャッシュ・フロー・設備の帳簿価額の金額は書かなかった。セグメント利益も書いていない。
- businessStructure: セグメントの並びは、セグメント注記の外部顧客への売上高の大きい順（ファインケミカル5,032百万円、難燃剤4,545百万円、ヘルスサポート1,415百万円）とした。３セグメントの単純合計は10,992百万円で、印字の合計10,993百万円とは１百万円の丸め差異があるため、合計は印字どおりとした。
- businessStructure: 【主要な設備の状況】の福山工場はファインケミカル・難燃剤・ヘルスサポートの３事業が連記された行のため、特定の事業には結びつけなかった。技術開発センターはファインケミカル事業、郷分事業所はヘルスサポート事業の行だが、設備の帳簿価額は書かない。
- businessStructure: suppliers キーはこのツリーの旧スキーマにないため省略した。仕入の事実は、東ソー株式会社から子会社が主要原材料を購入している旨を relatedCompanies の東ソーの説明に書いた。
- businessStructure: 非連結子会社のエムシーサービス株式会社は、マナック株式会社に倉庫賃貸業務等の役務を提供している（【事業の内容】）。
- history: 【沿革】の表は年月セルと事象文が分かれて崩れて印字されているが、年月は８件（2021年５月・６月・10月、2022年４月、2023年６月、2024年３月、2025年９月、2026年３月）、事象文も８件で数が一致するため、行順に対応づけた。成果物では年だけを記載した。
- history: 資本金の額は沿革に書かない規則のため、設立時の資本関係の金額は記載していない。
- history: Wikipedia（記事「マナック」）は中核子会社マナック株式会社の記事で、冒頭文に有報にない補足として使える事実が乏しかったため使用しなかった。
- industry: 主たる業界は、全セグメントが化学品の製造・販売であるため chemicals とした。
- industry: ファインケミカル事業は医薬品とその中間体を扱うが、医薬品そのものの製造・販売ではなく化学品・中間体の供給であるため pharmaceuticals は付けなかった。半導体分野向けの中間体も扱うが、半導体そのものや製造装置の事業ではないため semiconductors は付けなかった。
- relatedCompanies: tosoh: 【関係会社の状況】の区分（その他の関係会社）どおりに結んだ。特定投資株式としての保有目的は全銘柄共通の定型句だが、個別の概要（主要原材料の購入等の営業上の取引）が印字されている。
- relatedCompanies: dks: 主要な顧客ごとの情報で難燃剤事業の主要顧客として印字され、特定投資株式の概要にも難燃剤事業の製品販売等の取引が個別に記載されているため customer とした。金額は書いていない。
- relatedCompanies: fuso-pharmaceutical-industries / sugai-chemical-industry / hodogaya-chemical: 保有目的は定型句だが、業務提携等の概要に事業名を特定した製品販売等の営業上の取引が個別に記載されているため business-partner とした（取引の向きは印字されていない）。
- relatedCompanies: hirogin-holdings: 銀行（同行）との取引関係の維持が理由で、個別の営業上の取引の概要の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 銀行との取引関係の維持が理由で、個別の概要の記載がないため結ばなかった。
- relatedCompanies: toyo-securities: 証券会社との取引関係のみで、個別の営業上の取引の概要の記載がないため結ばなかった。
- relatedCompanies: k-and-amp-o-energy-group: 保有目的は全銘柄共通の定型句のみで、個別の取引概要の記載がないため結ばなかった。
- relatedCompanies: air-water: 当期に新規取得した1,250株で、個別の取引概要の記載がないため結ばなかった。
- relatedCompanies: aseed-holdings: 200株・貸借対照表計上額０百万円と情報収集規模で、個別の取引概要の記載がないため結ばなかった。
- relatedCompanies: nac: 連結子会社「マナック」の部分一致のため結ばなかった。
- relatedCompanies: port: 「サポート」等の一般語の部分一致のため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」という一般語の一致のため結ばなかった。
- relatedCompanies: career: 「キャリア形成」という一般語の一致のため結ばなかった。
- relatedCompanies: innovation: 研究拠点名「湘南イノベーション研究所」の部分一致のため結ばなかった。
- relatedCompanies: seki: ambiguous で、「セキュリティ」等の一般語の部分一致のため結ばなかった。
- relatedCompanies: core: ambiguous で、「コア技術」という一般語の部分一致のため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」の部分一致のため結ばなかった。
- relatedCompanies: rent: 「タレントマネジメント」の部分一致のため結ばなかった。
- relatedCompanies: applied-technology: 「応用技術開発」という一般語の一致のため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 中尾薬品株式会社はヘルスサポート事業の主要な顧客（売上高の10％以上）だが、related-candidates.json にないため関連企業には結ばず、事業の顧客として businessStructure に名前のみ記載した。自社の連結子会社（マナック株式会社、錦海化学株式会社、マナック（上海）貿易有限公司）は結ばない。
- terms: 助言: 「臭素化合物」は臭素を含む化合物の総称で、同社グループの中核製品群です。「難燃剤」はプラスチックなどに混ぜて燃えにくくする添加剤です。「ファインケミカル」は医薬品中間体や機能性材料など、特殊用途向けの高付加価値な化学品を指します。「単独株式移転」は、既存の会社が株式移転によって新たに設立する持株会社の完全子会社になる組織再編の手法です（いずれも有報の文脈どおり）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
