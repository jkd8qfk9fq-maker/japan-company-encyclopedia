# ヘリオス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ヘリオス |
| 証券コード | 4593 |
| docID（データを取り出した文書） | `S100XTBP` |
| 原本 docID | `S100XTBP` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTBP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ヘリオス / 4593 / docID S100XTBP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
healios: 10 件の数値を有報XBRLと照合
有報: 株式会社ヘリオス 有価証券報告書－第15期(2025/01/01－2025/12/31) (docID S100XTBP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
healios: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて有報の百万円印字のとおりに記載した（売上収益104百万円、親会社の所有者に帰属する当期損失2,217百万円、前期の当期損失4,235百万円）。
- businessModel: MD&Aの印字する営業損失・税引前当期損失などの金額と理由、研究開発費・販売費及び一般管理費の金額、キャッシュ・フローの金額は規則により本文に記載していない。本文の財務数値は売上収益と当期損失のみとした。
- businessModel: 経営指標の注記（1. IFRSにより連結財務諸表を作成、2. 基本的1株当たり当期損失のため株価収益率は記載していない、3. 従業員数は就業人員、4. 百万円未満を四捨五入）は表示上の事項のためfinancialNotesには入れず、warningsのみとした。IFRSの適用開始は2020年1月で、5年表の範囲外である。
- businessModel: 重要な後発事象は、2026年1月29日の執行役会で決議した第三者割当による新株式及び第27回新株予約権の発行（2026年2月13日に払込完了）のみで、資本政策の手続きのためwarningsのみとし、needsReviewには入れていない。
- businessModel: wikipedia.jsonは該当記事なし（found: false）のため使用していない。
- businessStructure: 報告セグメントは医薬品事業のみの単一セグメントのため、事業は1つとし、【事業の内容】の区分（体性幹細胞再生医薬品分野、iPSC再生医薬品分野、培養上清）を子区分とした。子区分には金額が独立して開示されていないため、金額は記載せず、その旨を各子区分の説明に明記した。
- businessStructure: 売上収益の内訳は注記「23．売上収益」の印字どおり、契約一時金及びマイルストン収入27百万円、その他77百万円（2025年12月期）。子区分ごとの内訳ではないため事業の説明では合計104百万円のみを用いた。
- businessStructure: 設備（神戸研究所・本社）は単一セグメントで事業別の記載がないため、特定の子区分には結びつけていない。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。製造は自社の神戸の細胞加工製造用施設等で行い、個別の仕入先の印字はない。
- history: 沿革のうち、2012年12月の東京事務所開設、2014年9月と2020年10月の本店移転は事務所・本店の移転のみの事項として省いた。
- history: 年月は沿革の印字順に年単位で記載し、月はキーとしては書いていない（本文中の月表記も避けた）。資本金の金額は沿革に印字されていない。
- industry: 主たる業界はpharmaceuticalsとした。報告セグメントは医薬品事業のみの単一セグメントで、体性幹細胞再生医薬品とiPSC再生医薬品のいずれも医薬品の研究開発であるためである。
- industry: 連結子会社を通じたバイオ領域への投資活動（Saiseiファンド）があるが、報告セグメントではなく独立した金額開示もないため、finance等の第2の業界は付けていない。
- relatedCompanies: sumitomo-pharma: 主要な顧客ごとの情報に2025年12月期の販売先として印字されているためcustomerとして結んだ。共同開発と合弁（サイレジェン）の経緯も印字されている。
- relatedCompanies: d-western-therapeutics-institute: 2017年にBBG250を含有する眼科手術補助剤に係る事業を譲渡した相手だが、当社の有報では沿革の記載のみで、現在の取引・提携・契約関係を述べる印字がないため結ばなかった（過去1回限りの取引は結ばない）。
- relatedCompanies: nikon: 2017年2月に業務・資本提携を締結したが、2025年10月をもって解消した旨が印字されているため、現在の関係としては結ばなかった。
- relatedCompanies: nissin: コードリストにない相手でambiguous、新株予約権の文脈の部分一致のみのため結ばなかった。
- relatedCompanies: step: 収益認識の「5ステップアプローチ」という語の部分一致のみのため結ばなかった。
- relatedCompanies: innovation: 「神戸医療イノベーションセンター」という施設名の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481: 「データベース」という語の部分一致のみのため結ばなかった。
- relatedCompanies: freee: 「リスクフリーレート」という語の部分一致のみのため結ばなかった。
- relatedCompanies: rent: 「タレントマネジメント」という語の部分一致のみのため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス感染症」という語の部分一致のみのため結ばなかった。
- relatedCompanies: en: ambiguousで、「メモリアル・ハーマン」等の語の部分一致のみのため結ばなかった。
- relatedCompanies: organo: 「オルガノイド」という語の部分一致のみのため結ばなかった。
- relatedCompanies: vision: 経営ビジョンの「ビジョン」という語の一致のみのため結ばなかった。
- relatedCompanies: arata: 「あらたに」という語の部分一致のみのため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手（いずれもwarningsへの記録のみ）: アルフレッサ株式会社（業務提携基本契約・社債買取契約・培養上清の取引基本合意書が印字されている）、株式会社RACTHERA（住友ファーマから再生・細胞医薬事業を承継し、共同開発契約等の相手方で、大株主の状況にも1.30％（2025年12月31日現在）で載るが非上場）、Astellas Institute for Regenerative Medicine（ライセンス契約の相手方で前期の主要な顧客）、一般社団法人AND medical group（共同研究契約・培養上清供給契約の相手方で当期の最大の主要な顧客）。
- relatedCompanies: 特定投資株式は該当事項なしのため、政策保有株式を根拠とするリンクはない。大株主の状況は個人と証券会社・信託口座が中心で、事業会社の大株主は株式会社RACTHERA（非上場）のみである。連結子会社7社と持分法適用共同支配企業の株式会社サイレジェンは自社の関係会社であり、関連企業としては結ばない。
- terms: 助言のみ。用語としては『体性幹細胞』『iPS細胞』『HLCM051（MultiStem）』『eNK®細胞』『ユニバーサルドナーセル（UDC）』『培養上清』『条件及び期限付承認』『希少疾病用再生医療等製品』『急性呼吸窮迫症候群（ARDS）』『網膜色素上皮細胞（RPE細胞）』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 【事業等のリスク】の「継続企業の前提に関する重要事象等」に、継続企業の前提に重要な疑義を生じさせるような事象又は状況が存在している旨が記載されています（当社グループは、対応策として第三者割当による新株式及び第27回新株予約権の発行を決議し払込が完了しているほか、継続的な収益源の確保やコスト削減等を図ることから、継続企業の前提に関する重要な不確実性はないと判断しています）。継続企業の前提に関する記載の取扱いには人の確認が必要です。
- businessStructure: 【事業等のリスク】の「継続企業の前提に関する重要事象等」に、継続企業の前提に重要な疑義を生じさせるような事象又は状況が存在している旨が記載されています（当社グループは、対応策として第三者割当による新株式及び第27回新株予約権の発行を決議し払込が完了しているほか、継続的な収益源の確保やコスト削減等を図ることから、継続企業の前提に関する重要な不確実性はないと判断しています）。継続企業の前提に関する記載の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
