# 虹技 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 虹技株式会社 |
| 証券コード | 5603 |
| docID（データを取り出した文書） | `S100YJMF` |
| 原本 docID | `S100YJMF` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJMF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 虹技株式会社 / 5603 / docID S100YJMF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kogi: 10 件の数値を有報XBRLと照合
有報: 虹技株式会社 有価証券報告書－第121期(2025/04/01－2026/03/31) (docID S100YJMF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kogi: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記: 本文の売上高・セグメント別売上高・当期純利益は、MD&Aに印字された億円・百万円の表記（売上高256億8千8百万円、Casting Field 227億6千7百万円、Environment Field・環境エンジニアリング 20億5千6百万円、Environment Field・機能材料 8億3千5百万円、その他 2千8百万円、親会社株主に帰属する当期純利益 4億7千万円）をそのまま使った。セグメント注記の百万円値（22,767・2,056・835・28）の合計は25,686百万円で、印字の連結売上高25,688百万円と2百万円差があるが、有報の丸めによるもので、印字の合計を引用した。
- businessModel: 受注高・受注残高の金額、セグメント利益の金額、経営指標としての比率（売上高経常利益率、総資産経常利益率、自己資本比率）の数値は本文に書いていない。2030年度のCO2排出量削減の中期目標も、数値目標として戦略の本文には書かず、計画の重点課題の記述にとどめた。
- businessModel: financialNotes: 経営指標等の注記3に、第120期（2025年3月期）に株式会社小口合金鋳造所の取得に係る暫定的な会計処理が確定し、第119期（2024年3月期）の指標に反映されている旨が印字されているため、2024年3月期の注記として付けた。前期有報との修正再表示チェックは全系列で差異がなかった（前期有報の時点で確定後の数値が印字されているため）。
- businessModel: 本ツリーのスキーマには suppliers のキーがないため、businessModel に suppliers は書いていない。
- businessStructure: 本ツリーのスキーマには suppliers のキーがないため、businessModel に suppliers は書いていない。仕入先について、原材料は銑鉄、スクラップ、ニッケル等の合金鉄と事業等のリスクに印字されているが、個別の仕入先名の開示はない。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順（Casting Field、Environment Field・環境エンジニアリング、Environment Field・機能材料、その他）とした。その他は有報が報告セグメントに含まれない区分としており、最後に置いた。
- businessStructure: 主要な生産拠点は姫路東工場・姫路西工場（兵庫県姫路市）で、Casting Field の鋳物生産設備を置いている（主要な設備の状況）。
- businessStructure: Wikipedia「虹技」は証券コードで同一性を確認したが、冒頭文は本社所在地と鋳物メーカーであることの確認にとどまり、有報の事実と重なるため出典としては使っていない。
- history: 沿革表の末尾は年月と事象文が分かれて印字される崩れた表で、2013年12月・2016年6月・2018年1月の3つの年月と、虹技ソリューション株式会社の清算結了、南通虹岡鋳鋼有限公司の設立、虹技ロール株式会社等4社の清算結了の3つの事象文が数が一致するため、行順で対応づけた。このうち南通虹岡鋳鋼有限公司の設立（2016年）のみを採用し、清算結了の2行は採用しなかった。
- history: 落とした行: 1919年合名会社神戸鋳鉄所の設立、1933年三浦鋳造所の吸収合併、1937年東京出張所の開設・播磨工場（現・姫路西工場）の建設、1959年ロール工場の完成、1961年姫路東工場の建設、1963年名古屋営業所の開設・溶銑直鋳鋳型の製造開始、1966年一般機械鋳物・上下水道鉄蓋等の開始、1968年デンスバー製造工場の完成、1970年北九州営業所の開設、1972年送風機の製造・販売開始、1975年株式会社神鉄エンジニアリング（現・虹技サービス株式会社）の設立、1979年トランスベクターの販売開始、1980年ボルテックスクーラーの販売開始、1982年KCメタルファイバーの製造・販売開始、1989年から1992年にかけての子会社設立群、2000年虹技ファウンドリー株式会社の設立、2007年虹技ソリューション株式会社の設立、2013年東京証券取引所市場第一部への上場、2024年姫路オフィスの開設（拠点・製品・子会社の細目として割愛）。
- history: 創業時・子会社設立時の資本金の金額は沿革には書いていない。
- industry: 主たる業界は、最大セグメントの Casting Field（外部顧客への売上高227億6千7百万円、売上構成89％）が鉄鋼圧延用ロールや各種鋳物の製造・販売であることから、機械に近い値として machinery を暫定とした（分類の不足は taxonomyGaps に記録）。Environment Field・環境エンジニアリングと機能材料は規模が小さく、環境装置・建設工事・摩擦材が混在するため、2つ目の業界は付けなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有目的は資金調達を通じた関係維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: iyogin-holdings: 特定投資株式の保有目的は資金調達を通じた関係維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的は資金調達を通じた関係維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: resona-holdings: 特定投資株式の保有目的は資金調達を通じた関係維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式の保有目的は資金調達を通じた関係維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: chugin-financial-group: 特定投資株式の保有目的は資金調達を通じた関係維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: yamaguchi-financial-group: 特定投資株式の保有目的は資金調達を通じた関係維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: hirogin-holdings: 特定投資株式の保有目的は資金調達を通じた関係維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: dai-ichi-life-holdings: 特定投資株式の保有目的は保険取引を通じた関係維持であり、保険取引が理由のため結ばなかった。
- relatedCompanies: nippon-steel: 第120期（2025年3月期）に保有目的を純投資目的に変更した銘柄であり、特定投資株式ではなくなったため結ばなかった。なお、同社株式の2025年10月1日付の株式分割（1株につき5株）は保有先の分割であり、当社の分割ではない。
- relatedCompanies: mizuho-financial-group: 第120期（2025年3月期）に保有目的を純投資目的に変更した銘柄であり、金融取引が理由のため結ばなかった。
- relatedCompanies: mory-industries: 第120期（2025年3月期）に保有目的を純投資目的に変更した銘柄であり、特定投資株式ではなくなったため結ばなかった。
- relatedCompanies: hyoki-kaiun: 特定投資株式として前期末に15,000株を保有していたが、当事業年度に全て売却し、期末の保有はゼロのため結ばなかった。
- relatedCompanies: the-hanshin-diesel-works: 特定投資株式の保有目的は「同じ地域社会に存続する企業として良好な関係を構築する」ことで、具体的な取引の印字がないため結ばなかった。
- relatedCompanies: nippon-carbon: 特定投資株式の保有目的は関連業種企業としての協力関係で、具体的な取引の印字がないため結ばなかった。
- relatedCompanies: en: 候補の一致は「Environment Field」の一部で ambiguous であり、エン株式会社への言及ではないため結ばなかった。
- relatedCompanies: base-4481: 候補の一致は「連結ベース」の一部であり、ベース株式会社への言及ではないため結ばなかった。
- relatedCompanies: cota: 候補の一致は「インコタームズ」の一部で ambiguous であり、コタ株式会社への言及ではないため結ばなかった。
- relatedCompanies: ishin: 候補の一致は気候変動リスクの文章の一部であり、イシン株式会社への言及ではないため結ばなかった。
- relatedCompanies: corona: 候補の一致は「新型コロナウイルス」の一部であり、株式会社コロナへの言及ではないため結ばなかった。
- relatedCompanies: kel: 候補の一致は原材料名「ニッケル」の一部で ambiguous であり、ケル株式会社への言及ではないため結ばなかった。
- relatedCompanies: seki: 候補の一致は「セキュリティ」の一部で ambiguous であり、セキ株式会社への言及ではないため結ばなかった。
- relatedCompanies: the-lead: 候補の一致は「開発リードタイム」の一部であり、株式会社リードへの言及ではないため結ばなかった。
- terms: 助言: 用語「デンスバー」は、連続鋳造で作られる鋳鉄棒で、当社が1967年から製造・販売する主力製品の一つと沿革・事業の内容に印字されています。
- terms: 助言: 用語「トランスベクター」は、当社が販売する環境・省エネ商品で、Environment Field・環境エンジニアリングの製品として経営成績の分析に印字されています。
- terms: 助言: 用語「KCメタルファイバー」は、当社の金属短繊維で、Environment Field・機能材料の摩擦材や耐火材に使われていると経営成績の分析に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 虹技のCasting Field（鋳物・ロール事業） → 提案: 鋳造・素形材（金属鋳物・ロール）。主力事業は鉄鋼圧延用ロール、鋳型、自動車用金型鋳物、デンスバー等の鋳物製品の製造・販売であり、閉じた分類に鋳造・素形材の値がないため、機械関連の machinery を暫定の主たる業界とした。
