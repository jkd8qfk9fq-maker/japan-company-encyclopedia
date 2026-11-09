# 日油 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日油株式会社 |
| 証券コード | 4403 |
| docID（データを取り出した文書） | `S100YO71` |
| 原本 docID | `S100YI3F` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YO71／有効文書 S100YO71（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YO71.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日油株式会社 / 4403 / docID S100YI3F（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 38 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nof: 10 件の数値を有報XBRLと照合
有報: 日油株式会社 訂正有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YO71)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第103期(2025/04/01－2026/03/31)、docID S100YO71）を有効文書としてこのパックを作った。原本は docID S100YI3F。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはAuditorsResponseKAMConsolidatedTextBlock・DescriptionIncludingReasonKAMConsolidatedTextBlock・IndependentAuditorsReportConsolidatedTextBlock・IndependentAuditorsReportNonConsolidatedTextBlock・KeyAuditMattersConsolidatedTextBlock・KeyAuditMattersNonConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nof: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造、販売などの費用を差し引いた残りが利益になります。2026年3月期のは40…）

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書（S100YO71）は record-only 分類で、原本（S100YI3F）との差異は監査上の主要な検討事項・監査報告書の節のみであり、財務数値・本文は同一。パックの指示どおり needsReview には入れず、出典は有効文書の値で記録した。
- businessModel: パックの「財務諸表の組替え」警告を調査した。抽出本文（sections.txt 全文）に組替え・再表示・遡及適用の注記は見当たらず、修正再表示チェックは前期有報と重複する全系列・全行が一致しているため、基盤の変更はないと判断し financialNotes は空にした。
- businessModel: 2024年4月1日付の株式分割（1株→3株）は1株当たり指標のみに影響するため financialNotes には入れず、ここに記録する（経営指標等の注記3）。
- businessModel: 重要な後発事象は、2026年5月11日の取締役会で決議した自己株式の取得（上限1,700,000株・5,000,000,000円、取得期間2026年5月12日～6月30日、市場買付け）のみ。日常的な資本政策であり、2026年3月31日現在の登録内容に影響しないため warnings に記録し、needsReview には入れなかった。
- businessModel: 重要な契約等は化薬事業の技術導入契約（英国・ドイツ・米国・ノルウェーの相手先）であり、相手先はいずれも関連企業候補にない外国企業ため、関連企業には結んでいない。
- businessModel: Wikipedia（日油）は旧商号・日産コンツェルン由来などの補足があるが、旧社名（日本油脂）は有報の沿革に印字されており、補足として使う必要がないため使用しなかった。記載内容はすべて有報に基づく。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期: 機能化学品145,751百万円、化薬61,675百万円、医薬・医療・健康49,931百万円、その他608百万円）の大きい順とした。「その他」は有報が報告セグメントに含まれないと明記する区分のため最後に置いた。セグメント利益は規則により記載していない。
- businessStructure: 機能化学品事業の children は【事業の内容】の製品区分（一般の機能化学品と特殊防錆処理剤）に基づく。金額は区分ごとに独立して開示されていないため、金額は書かず、その旨を各 children の説明に明記した。
- history: 沿革表はすべての行に年月が印字されており、崩れた表ではないため、行順の対応づけは不要だった。冒頭の叙述部分（1921年発足、1937年改称、1949年分離独立）も【沿革】に含まれるため history に採用した。資本金の金額は規則により記載していない。
- history: 1988年の決算期日変更は沿革上の歴史的事実として記録した。現在の5年間の数値に影響する決算期変更・変則決算はなく、パックの fiscalYearChange は null、irregularPeriods は空である。
- industry: 主たる業界は chemicals: 3つの報告セグメント（機能化学品・医薬・医療・健康・化薬）はいずれも化学製品の製造販売であり、最大の機能化学品事業が売上高の過半を占める。
- industry: pharmaceuticals は付けなかった。医薬・医療・健康事業は医薬品そのものではなく、食用加工油脂・食品機能材、健康関連製品、生体適合性素材、DDS医薬用製剤原料などの素材供給である。food も、食用加工油脂が同セグメントの一部にとどまり独立した食品事業として開示されていないため付けなかった。
- relatedCompanies: 結んだ関連企業は16社。良品計画は【関連情報】の主要な顧客開示（2026年3月期29,475百万円・11.4％）で取引の向きが印字されているため customer とした。カーリット・KHネオケム・東洋製罐グループホールディングスは保有目的に「原材料等の調達先」と向きが印字されているため supplier とした。その他の13社は、特定投資株式の保有目的に事業セグメント名つきで「取引先」と相手固有の記載があり実株数を保有するが、取引の向きは印字されていないため business-partner とした。計上額は規則により記載していない。
- relatedCompanies: en: 社名の一致ではなく「エンゲージメント」等の一般語の断片的一致。有報に同社についての取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: innovation: 「オープンイノベーション」の一般語としての一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「購入金額ベース」等の一般語の断片的一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: career: 「キャリアに関する対話」等の一般語の断片的一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: step: 収益認識の「5ステップアプローチ」の一般語としての一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: core: 「エンゲージメントスコア」等の文脈の断片的一致（ambiguous）で、同社についての記載はないため結ばなかった。
- relatedCompanies: oxide: 自社製品名「エチレンオキサイド」の断片的一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: the-lead: 「リードできる人材」等の一般語の断片的一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: land: 「相手先ブランド」の断片的一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: zero: 「休業災害発生件数ゼロ」等の一般語の断片的一致（ambiguous）で、同社についての記載はないため結ばなかった。
- relatedCompanies: vision: 自社の「NOF VISION 2030」の名称の一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: cover: 「CSRアンケート調査のカバー率」の一般語としての一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: freee: 「PFASフリー」の一般語としての一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: ishin: 「インターナル・カーボンプライシング」の断片的一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: ray: 「ディスプレイ材料事業部」等の断片的一致（ambiguous）で、同社についての記載はないため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」等の断片的一致（ambiguous）で、同社についての記載はないため結ばなかった。
- relatedCompanies: corona: リスクの記載における「新型コロナウイルス」の一般語としての一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: king: 「ワーキンググループ」の断片的一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: tein: 自社製品の成分名「ルテイン」の断片的一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: daikin-industries: 特定投資株式の表で当事業年度の株式数が「－」であり、2026年3月31日現在は保有していない（前期216,500株）。現在の関係の記載がないため結ばなかった。
- relatedCompanies: lion: 同上。当事業年度の株式数は「－」（前期523,072株）で、現在の関係の記載がないため結ばなかった。
- relatedCompanies: nippon-shokubai: 同上。当事業年度の株式数は「－」（前期289,600株）で、現在の関係の記載がないため結ばなかった。
- relatedCompanies: kotobuki-spirits: 同上。当事業年度の株式数は「－」（前期180,000株）で、現在の関係の記載がないため結ばなかった。
- relatedCompanies: kaneka: 同上。当事業年度の株式数は「－」（前期59,519株）で、現在の関係の記載がないため結ばなかった。
- relatedCompanies: nihon-parkerizing: 同上。当事業年度の株式数は「－」（前期105,000株）で、現在の関係の記載がないため結ばなかった。
- relatedCompanies: hosoya-pyro-engineering: 同上。当事業年度の株式数は「－」（前期100,000株）で、現在の関係の記載がないため結ばなかった。
- relatedCompanies: hisamitsu-pharmaceutical: 候補の listing が「コードリストにない」うえ、当事業年度の株式数も「－」（前期18,830株）で、現在の関係の記載がないため結ばなかった。
- relatedCompanies: iyogin-holdings: 特定投資株式の保有目的が「当社における資金借入先」であり、資金調達が理由のため規則により結ばなかった。
- relatedCompanies: sompo-holdings: 保有目的が「資金借入先であるとともに総合的な保険サービスの提供元」であり、資金調達・保険取引が理由のため規則により結ばなかった。
- relatedCompanies: mizuho-financial-group: みなし保有株式（退職給付信託設定）であり、保有目的は資金借入先・金融サービスの提供元。当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: tokyo-tatemono: 保有目的が「有益な情報を継続的に提供頂くこと」であり、取引関係の記載ではないため結ばなかった。
- relatedCompanies: matsumoto-yushi-seiyaku: 保有目的は機能化学品事業における取引先と印字されるが、保有株式数が440株と僅少であり、取引関係の実質を確認できないため結ばなかった。
- relatedCompanies: nichiryo-baking: 保有目的は医薬・医療・健康事業における取引先と印字されるが、保有株式数が3,030株と僅少であり、取引関係の実質を確認できないため結ばなかった。
- relatedCompanies: kobe-steel: 沿革における2007年の神鋼タセト株式会社の全保有株式の譲渡という過去1回限りの取引のみで、現在の関係の記載がないため結ばなかった。
- relatedCompanies: marubeni: 沿革における1995年のインドネシア合弁会社設立の相手方としての記載のみで、現在の取引・資本関係の記載がないため結ばなかった（候補としても ambiguous）。
- relatedCompanies: trust: 候補の listing が「コードリストにない」うえ、一致は大株主表の日本マスタートラスト信託銀行（信託口）であり、信託口の純投資のため結ばなかった。
- relatedCompanies: 大株主の状況（2026年3月31日現在）には事業会社が載っていない（日本マスタートラスト信託銀行・日本カストディ銀行の信託口、明治安田生命保険相互会社、従業員持株会、外国機関投資家のみ）ため、major-shareholder の結び付けは行わなかった。【関係会社の状況】の子会社・関連会社はすべて候補にない非上場会社である。
- terms: 登録候補（助言のみ）: MPCポリマー（2-メタクリロイルオキシエチルホスホリルコリンを用いた生体適合性素材。医療機器や化粧品などに使う）、DDS（ドラッグ・デリバリー・システム。薬物を体内の目的の場所へ届ける技術で、同社は活性化PEGや機能性脂質などの製剤原料を供給）、特殊防錆処理剤（金属表面に被膜を作り錆を防ぐ処理剤）、化粧品ODM（相手先ブランドによる化粧品の設計・製造を受託する事業形態）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
