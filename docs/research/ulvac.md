# アルバック — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　アルバック |
| 証券コード | 6728 |
| docID（データを取り出した文書） | `S100Z3KY` |
| 原本 docID | `S100Z3KY` |
| 提出日（原本） | 2026-09-25 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3KY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　アルバック / 6728 / docID S100Z3KY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ulvac: 10 件の数値を有報XBRLと照合
有報: 株式会社　アルバック 有価証券報告書－第122期(2025/07/01－2026/06/30) (docID S100Z3KY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ulvac: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社アルバック」が EDINET の提出者名「株式会社　アルバック」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…究開発費などの費用を差し引いた残りが利益になります。2026年６月期のは17…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と親会社株主に帰属する当期純利益だけを用いた。受注高・受注残高・研究開発費・セグメント利益・経常利益・営業利益の金額は書いていない（中長期経営計画の数値目標も、営業利益とROEを含むため文章にしていない）。
- businessModel: brief.md の注意（財務諸表の組替えの記載）について: 本文で確認できる組替えは、セグメント情報の地域ごとの情報で「中国」を独立掲記した表示方法の変更に伴う前年度数値の組替えであり、財務諸表の修正再表示ではない。前期有報との重複年度の数値は全て一致している（修正再表示チェックで差異なし）ため、basis の注記は付けていない。
- businessModel: 売上高の増減率7.1％は経営成績等の分析の印字どおり。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順（真空機器事業210,759百万円、真空応用事業58,370百万円、いずれも2026年6月期）。
- businessStructure: 各事業の子区分は【事業の内容】の主要製品の区分どおりとし、金額は経営成績等の分析に印字された2026年6月期の品目別販売高（真空機器事業の内訳と真空応用事業の内訳は、それぞれセグメントの外部顧客への売上高と一致）。
- businessStructure: 当社グループは当社、子会社34社、関連会社９社で構成（【事業の内容】冒頭の印字どおり）。
- businessStructure: 愛発科電子材料（蘇州）有限公司は2026年６月25日付で全出資持分を譲渡し連結の範囲から除外された（【関係会社の状況】注７）。期中の出来事のため沿革にも記載した。
- history: 沿革表の一部は年月と事象文が分離して印字されている崩れた表だが、年月と事象の数が一致する区間は行順で対応づけた（2012年９月〜2016年12月、2018年10月〜2019年１月、2021年２月〜2026年６月の各区間）。本成果物では、その区間のうち裏付けの明確な主要事項だけを採った。
- history: 資本金の増資や工場・営業所の新設など、多数の細目から主要な出来事だけを選んだ。
- industry: 主分類はsemiconductors。最大の報告セグメントである真空機器事業の中核が半導体製造装置であり、品目別販売高でも半導体及び電子部品製造装置（88,328百万円）が最大の区分である。製造装置の会社は主に半導体とする慣例に従った。
- industry: 副分類にelectronicsを付けた。ディスプレイ・エネルギー関連製造装置（63,711百万円）と電子部品向け装置が独立した品目区分として開示されているため。
- industry: machineryは付けなかった。一般産業用装置（22,179百万円）は真空機器事業の中の一品目区分にとどまり、会社の開示上の重心は半導体・電子・ディスプレイ向け装置にあるため。
- relatedCompanies: showa-shinku（昭和真空）: 【関係会社の状況】に持分法適用関連会社として印字され、正式名称が一致し、取引の記述もあるため結んだ。
- relatedCompanies: aida-engineering: 沿革に子会社REJの全株式を同社へ譲渡した記載があるが、過去の一回限りの株式譲渡であり、継続的な取引・提携・資本関係の記述がないため結ばない（出来事として沿革に記載）。
- relatedCompanies: chino: 沿革にアルバック理工（現・アドバンス理工）の全株式を同社へ譲渡した記載があるが、過去の一回限りの株式譲渡であり、継続的な関係の記述がないため結ばない。
- relatedCompanies: fujitsu: 沿革の相手は同社の子会社である富士通ヴィエルエスアイ株式会社で、設備事業の譲受という過去の一回限りの取引であり、富士通株式会社との継続的な関係の記述がないため結ばない。
- relatedCompanies: mizuho-financial-group: 特定投資株式として「資金調達などの財務面の安定化」のため保有する金融機関であり、資金調達を理由とする関係は結ばないため結ばない。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式として「資金調達などの財務面の安定化」のため保有する金融機関であり、資金調達を理由とする関係は結ばないため結ばない。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式として「資金調達などの財務面の安定化」のため保有する金融機関であり、資金調達を理由とする関係は結ばないため結ばない。
- relatedCompanies: aeon: 出現箇所は「イオン注入装置」など装置名の一部であり、イオン株式会社への言及ではないため結ばない。
- relatedCompanies: tenma: 出現箇所は持分法適用関連会社「愛発科天馬電機（靖江）有限公司」の社名の一部であり、天馬株式会社ではない。候補の listing もコードリストにないため結ばない。
- relatedCompanies: ray: 出現箇所は製品名などの一般名詞の一部であり、株式会社レイへの言及ではないため結ばない（ambiguous の候補でもある）。
- relatedCompanies: port: 出現箇所は「カスタマーサポート」など一般名詞の一部であり、ポート株式会社への言及ではないため結ばない。
- relatedCompanies: innovation: 出現箇所は重要課題（マテリアリティ）の文言の一部であり、株式会社イノベーションへの言及ではないため結ばない。
- relatedCompanies: core: 出現箇所は「真空技術をコアとした」などの一般名詞であり、株式会社コアへの言及ではないため結ばない。
- relatedCompanies: zero: 出現箇所は温室効果ガス排出量「実質ゼロ」などの文言であり、株式会社ゼロへの言及ではないため結ばない。
- relatedCompanies: ishin: 出現箇所はリスクの文言の一部であり、イシン株式会社への言及ではないため結ばない。
- relatedCompanies: seki: 出現箇所は一般名詞の一部であり、セキ株式会社への言及ではないため結ばない。
- relatedCompanies: career: 出現箇所は「キャリア採用」などの人事の文言であり、株式会社キャリアへの言及ではないため結ばない。
- relatedCompanies: base-4481: 出現箇所は「営業利益ベース」などの一般名詞であり、ベース株式会社への言及ではないため結ばない。
- relatedCompanies: rikei: 出現箇所は一般名詞の一部であり、株式会社理経への言及ではないため結ばない。
- relatedCompanies: applied-technology: 出現箇所は「応用技術の開発」という一般名詞であり、応用技術株式会社への言及ではないため結ばない。
- relatedCompanies: freee: 出現箇所は「フリー・キャッシュ・フロー」の語であり、フリー株式会社への言及ではないため結ばない。
- relatedCompanies: space: 出現箇所は「工場スペース」という一般名詞であり、株式会社スペースへの言及ではないため結ばない。
- relatedCompanies: tear: 出現箇所は「マイスティア」の社名の一部であり、株式会社ティアへの言及ではないため結ばない。
- relatedCompanies: the-lead: 出現箇所は「リードタイム」という一般名詞であり、株式会社リードへの言及ではないため結ばない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言扱い（登録は別工程）。スパッタリング・CVD・エッチング・マスクブランクス・リークテストは、この会社の事業を理解するうえで中心的な語として選んだ。

## 要確認（status に反映）

- businessStructure: 重要な後発事象: 連結子会社Pure Surface Technology,Ltd.は、2026年８月24日に会社分割（新設分割）を完了し、フラットパネルディスプレイのターゲット事業を新設会社UFOMAT Korea, Ltd.に承継しました。本登録の記載は2026年６月30日時点のグループ体制に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
