# アリアケジャパン — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アリアケジャパン株式会社 |
| 証券コード | 2815 |
| docID（データを取り出した文書） | `S100YDGM` |
| 原本 docID | `S100YDGM` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDGM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アリアケジャパン株式会社 / 2815 / docID S100YDGM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ariake-japan: 10 件の数値を有報XBRLと照合
有報: アリアケジャパン株式会社 有価証券報告書－第48期(2025/04/01－2026/03/31) (docID S100YDGM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ariake-japan: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象は自己株式の取得の決議（2026年5月13日取締役会決議）のみであり、資本政策であってグループ構造の変更を伴わないため、needsReview には入れず warnings に留めた。
- businessModel: 中期経営計画の目標（ROE・DOE等の比率や設備投資の金額）は投資の語・比率・対象外の金額のため本文に転記せず、方針の要約のみとした。経営理念の「株式価値の最大化」の文言も転記していない。
- businessModel: 地域別の売上高はMD&Aの百万円単位の印字（日本48,456百万円・アジア10,039百万円・欧州8,461百万円）を用いた。セグメント注記の地域ごとの情報は千円単位の印字で、日本・欧州・中国・アジア（中国を除く）の区分であり、MD&Aのアジアは中国とアジア（中国を除く）の合計である。
- businessModel: 単体の売上高・当期純利益（経営方針の節に印字）は連結の数値ではないため本文に使っていない。
- businessModel: ARIAKE U.S.A., Inc.は当社へ製品を供給する「予定」と印字されているため、供給済みとは書いていない。
- businessStructure: 単一セグメント（天然調味料事業）のため、子事業はMD&Aの販売実績の製品・商品区分（液体天然調味料・粉体天然調味料・液体スープ・その他）によった。販売実績の金額は千円単位の印字のみのため、子事業の説明には金額を書いていない。
- businessStructure: 海外子会社は青島有明食品有限公司（中国）・台湾有明食品股份有限公司・F.P. Natural Ingredients S.A.S.（フランス）・Ariake Europe N.V.（ベルギー）・PT.Ariake Europe Indonesia・ARIAKE U.S.A., Inc. と孫会社Henningsen Nederland B.V.（オランダ）の7社で、いずれも天然調味料の製造販売であり、独立した事業にはしていない。国内連結子会社の株式会社エー・シー・シーはコンビニエンスストア経営で、本社社屋の一部を当社から賃借している（金額が独立開示されていないため子事業にしていない）。
- history: 沿革表は年月と事象文が分かれて崩れた印字のため、年月と事象の数が一致する範囲で行順に対応づけた。1998年6月（本店移転・九州第2工場建設）と2000年11月（R&Dセンター建設）、および2016年3月（インドネシア子会社設立）・2019年3月（ARIAKE U.S.A.株式譲渡）・2021年11月（日照有明食品有限公司設立）・2022年4月（プライム市場移行）・2024年7月（ARIAKE U.S.A., Inc.設立）の対応づけは行順による。インドネシア子会社の設立が2016年3月であることは【経営方針、経営環境及び対処すべき課題等】の印字でも裏付けられる。
- history: 資本金の増資のみの行（1981年・1985年・1990年・1991年・1995年・1996年・1998年）と1993年のスイス・フラン建転換社債の発行は、金額を本文に書けないため行ごと省いた。創業行の資本金額も省いた。工場建設の総工費（九州第2工場・2007年の新工場）も金額は省いた。
- history: 本店移転のみの行（1980年・1981年・1983年）、1992年の九州第4工場建設、1996年の工場用地取得、2003年のパックセンター建設、2012年の第2パックセンター建設、2006年の株式会社ディア．スープ設立は、主要な変遷に絞るため省いた。
- industry: 売上は天然調味料の製造販売がほぼすべてであり、主たる業界は food とした。閉じた分類に調味料専業の区分はないが、食品製造そのものであるため taxonomyGaps には記録していない。
- relatedCompanies: mitsui-and-co（三井物産）: 販売実績が最も大きい相手先は同社の子会社である三井物産流通グループ株式会社（総販売実績の9.2％）であり、三井物産株式会社自体との取引の印字はないため結ばなかった。販売の事実は industryPosition に記載した。
- relatedCompanies: ジャパンフードビジネス株式会社: 【関係会社の状況】の「その他の関係会社」で、当社株式の33.66％（議決権の所有割合では33.70％）を保有する筆頭株主だが、非上場で関連候補（related-candidates.json）にないため結ばなかった。
- relatedCompanies: ezaki-glico（江崎グリコ）・house-foods-group（ハウス食品グループ本社）・seven-and-i-holdings（セブン＆アイ・ホールディングス）・toridoll-holdings（トリドールホールディングス）・hiday-hidaka（ハイデイ日高）・jb-eleven（JBイレブン）・marutai（マルタイ）・ringer-hut（リンガーハット）・warabeya-nichiyo-holdings（わらべや日洋ホールディングス）・yakiniku-sakai-holdings（焼肉坂井ホールディングス）・chikaranomoto-holdings（力の源ホールディングス）・toho（トーホー）: 特定投資株式の保有目的が全銘柄共通の「企業間取引の強化」という定型文のみで、個別の取引・提携の印字がないため結ばなかった（koa の先例）。kourakuen（幸楽苑）は印字が「幸楽苑ホールディングス」であり候補の登録名とも一致しない。
- relatedCompanies: nomura-holdings（野村ホールディングス）: 金融機関であり、特定投資株式の保有目的も上記と同一の定型文のみのため結ばなかった。
- relatedCompanies: trust（トラスト）: 印字は日本マスタートラスト信託銀行株式会社（信託口）であり信託口のため結ばない。候補の listing もコードリストにない。
- relatedCompanies: base-4481（ベース）・en（エン、ambiguous）・innovation（イノベーション）・career（キャリア）・core（コア、ambiguous）・arata（あらた）・land（ランド）・port（ポート）・vision（ビジョン）・seki（セキ、ambiguous）・ishin（イシン）・alpha / alpha-4760（アルファ、大量保有報告書のグローバル・アルファ・キャピタル・マネージメントの部分一致）: いずれも一般語・部分一致であり、当該企業についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: グループの連結子会社8社・非連結子会社1社・孫会社は関連企業として結ばない（グループ会社であるため）。
- terms: 用語の助言なし。「天然調味料」「畜産エキス」は事業の一般的な呼称であり、新規の用語登録は提案しない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
