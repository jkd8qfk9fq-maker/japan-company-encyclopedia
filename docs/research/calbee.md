# カルビー — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | カルビー株式会社 |
| 証券コード | 2229 |
| docID（データを取り出した文書） | `S100YEHI` |
| 原本 docID | `S100YEHI` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEHI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | カルビー株式会社 / 2229 / docID S100YEHI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 35 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
calbee: 10 件の数値を有報XBRLと照合
有報: カルビー株式会社 有価証券報告書－第77期(2025/04/01－2026/03/31) (docID S100YEHI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
calbee: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…流、販売などの費用を差し引いた残りが利益になります。2026年3月期のは17…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務数値は売上高と親会社株主に帰属する当期純利益だけを書き、営業利益・経常利益の金額や増減率は規則により書いていない。純利益の減少理由（前期の税制優遇適用の反動）も書いていない。
- businessModel: 修正再表示チェックは前期有報との重複年度が全項目一致で、financialNotes は空にした。
- businessModel: 2026年3月期からの変更（中華圏のリベート等控除前売上高の計上方法の変更）は、リベート等控除後の売上高に変更はなく表示方法の変更にとどまるため、financialNotes には書かなかった。
- businessModel: 従業員数について、当期から従来は含めていなかった無期転換社員1,481名を従業員数に含めている（経営指標等の注記）。売上高・純利益の系列には影響しないため、financialNotes には書かず、ここに記録する。
- businessModel: PepsiCo, Inc.との資本提携は【関係会社の状況】の「その他の関係会社」に基づき flow の company 段に書いた。PepsiCo, Inc.は関連企業候補にないため relatedCompanies には結んでいない（relatedCompanies の warnings に記録）。
- businessModel: 成長戦略の定量目標（自己資本比率の目途など）は規則により perspectives に書いていない。
- businessModel: Wikipedia（カルビー）の冒頭は本社所在地と事業の説明で有報と重なるため、補足には使わなかった。
- businessStructure: 報告セグメントは「食品製造販売事業」のみ（単一セグメント）のため、事業は同事業を主とし、報告セグメントに含まれない「その他」（物流事業など）を最後に置いた。
- businessStructure: 単一セグメントのため、【関連情報】の製品及びサービスごとの区分（スナック菓子・その他食品）を children とした。金額はリベート等控除前の印字どおりで、控除後の合計340,151百万円とは差がある旨を本文に明記した。
- businessStructure: シリアル食品は【事業の内容】で独立した区分として説明されるが、【関連情報】の製品区分ではスナック菓子に含まれるため、独立した child にはせずスナック菓子の説明に含めた。
- history: 沿革表は一部が崩れており、1975年（２月鹿児島工場操業開始・９月下妻工場操業開始とポテトチップス発売）と2025年（１月・８月）は年月セルと事象文の数が一致したため行順で対応づけた。
- history: 2025年の対応づけ（１月＝せとうち広島工場の操業開始、８月＝Hodo, Inc.の子会社化）は、【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の印字でも裏付けられる。
- history: 工場の操業開始、海外子会社の設立・統合などの行は、会社の転機となるものを中心に選んで落とした（宇都宮工場ほか各工場の開設、Calbee Tanawat・Calbee Four Seas・PT. Calbee-Wings Food・Haitai-Calbee等の設立、Seabrook Crisps・Warnock Food Productsの子会社化、Calbee Ireland・Calbee New Zealandの設立など）。
- history: 1949年の設立時の資本金額は規則により書いていない。
- industry: 主たる事業はスナック菓子・シリアル食品の製造販売（食品製造販売事業が唯一の報告セグメント）であり、food を主たる業界とした。
- industry: 物流事業は報告セグメントに含まれない「その他」に含まれ、金額も小さいため、transportation は付けなかった。
- industry: 閉じた分類に合う値があるため taxonomyGaps は付けていない。
- relatedCompanies: PepsiCo, Inc.: 【関係会社の状況】の「その他の関係会社」で、100％子会社Frito-Lay Global Investments B.V.を通じて当社株式の22.01％を保有する資本提携先（2026年3月31日現在。当社はPepsiCo, Inc.の持分法適用関連会社）。候補にないため結ばなかった。なお、ジャパンフリトレー株式会社はPepsiCo, Inc.の子会社だったが、2009年7月に当社が全株式を取得した連結子会社である。
- relatedCompanies: 鳥越製粉だけを結んだ。【大株主の状況】に載る事業会社であり、かつ【株式の保有状況】に相手固有の取引（原材料の調達取引）が印字されているためである。
- relatedCompanies: aeon: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型句（「当社は製品の営業取引を行っており、営業活動の円滑化・関係の維持強化による企業価値向上を目的とし保有しております」）のみで、相手固有の取引の記述がないため結ばなかった。
- relatedCompanies: arcs: aeon と同じく、保有目的が全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: cosmos-pharmaceutical: aeon と同じく、保有目的が全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: maruyoshi-center: aeon と同じく、保有目的が全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: matsukiyococokara-and-co: aeon と同じく、保有目的が全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: retail-partners: aeon と同じく、保有目的が全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: seven-and-i-holdings: aeon と同じく、保有目的が全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: yamanaka: aeon と同じく、保有目的が全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: trial-holdings: 純投資目的で保有する投資株式の1銘柄として注記されるのみで（2024年3月期に純投資目的へ変更）、事業上の関係の記述がないため結ばなかった。
- relatedCompanies: riken-vitamin: 当事業年度中に株式を売却し、期末時点では保有していない（特定投資株式の表の株式数は「-」）ため結ばなかった。
- relatedCompanies: valor-holdings: riken-vitamin と同じく、期末時点では保有していないため結ばなかった。
- relatedCompanies: daiwa: 「大和」は自己株式の取得の相手方である大和証券株式会社への言及で、株式会社大和への言及はないため結ばなかった。
- relatedCompanies: nac: 「ナック」は「スナック菓子」の一部への一致で、株式会社ナックへの言及はない。
- relatedCompanies: core: ambiguous の候補。「コア」は「国内コア事業」などの一般語への一致で、株式会社コアへの言及はない。
- relatedCompanies: career: 「キャリア」は「キャリア自律」などの一般語への一致で、株式会社キャリアへの言及はない。
- relatedCompanies: en: ambiguous の候補。「エン」は一般語・略語への一致で、エン株式会社への言及はない。
- relatedCompanies: land: 「ランド」は「アイルランド」「ニュージーランド」などの地名の一部への一致で、株式会社ランドへの言及はない。
- relatedCompanies: innovation: 「イノベーション」は一般語への一致で、株式会社イノベーションへの言及はない。
- relatedCompanies: port: 「ポート」は「事業ポートフォリオ」の一部への一致で、ポート株式会社への言及はない。
- relatedCompanies: base-4481: 「ベース」は「植物性タンパク質をベースとした」などの一般語への一致で、ベース株式会社への言及はない。
- relatedCompanies: seki: ambiguous の候補。「セキ」は一般語の一部への一致で、セキ株式会社への言及はない。
- relatedCompanies: suzuki-6785: 「鈴木」は取締役の氏名（鈴木貴子）への一致で、株式会社鈴木への言及はない。
- relatedCompanies: zero: ambiguous の候補。「ゼロ」は「排出量の実質ゼロ」の一部への一致で、株式会社ゼロへの言及はない。
- relatedCompanies: rent: 「レント」は「タレントマネジメント」の一部への一致で、株式会社レントへの言及はない。
- relatedCompanies: the-lead: 「リード」は「リードする人財」などの一般語への一致で、株式会社リードへの言及はない。
- relatedCompanies: vision: 「ビジョン」は「人財ビジョン」などの一般語への一致で、株式会社ビジョンへの言及はない。
- relatedCompanies: king: 「キング」は「スナッキングカンパニー」の一部への一致で、株式会社キングへの言及はない。
- relatedCompanies: tear: 「ティア」は一般語への一致で、株式会社ティアへの言及はない。
- relatedCompanies: freee: 「フリー」は「フリー・キャッシュ・フロー」の一部への一致で、フリー株式会社への言及はない。
- relatedCompanies: i-ll: 「アイル」は「アイルランド」の一部への一致で、株式会社アイルへの言及はない。
- relatedCompanies: kohsoku: ambiguous の候補。「高速」は「情報流通の高速化」の一部への一致で、株式会社高速への言及はない。
- relatedCompanies: ray: 「レイ」は「バレイショ」の一部への一致で、株式会社レイへの言及はない。
- relatedCompanies: trust: 「トラスト」は日本マスタートラスト信託銀行株式会社（信託口）への一致で、株式会社トラストへの言及はなく、listing もコードリストにないため結ばなかった。
- terms: 登録候補（助言のみ）: スナッキング（会社が「世界のSNACKING COMPANY」を掲げ、新たな食の習慣として提唱する概念）、フルグラ（当社のシリアル食品のブランド）、リベート等控除（販売促進費などの控除。売上高の表示に関わる）、食と健康事業（豆腐・大豆加工食品などの新規領域の事業）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
