# 丸大食品 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 丸大食品株式会社 |
| 証券コード | 2288 |
| docID（データを取り出した文書） | `S100YD4W` |
| 原本 docID | `S100YD4W` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD4W.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 丸大食品株式会社 / 2288 / docID S100YD4W（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 30 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
marudai-food: 10 件の数値を有報XBRLと照合
有報: 丸大食品株式会社 有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YD4W)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
marudai-food: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、物流費などの費用を差し引いた残りが利益になります。2026年3月期のは9,…）
- 確認: [other-profit-wording] perspectives.industryPosition.analysis.basis: 売上高と当期純利益以外の利益に触れていないか確認する（…報】に本邦の外部顧客への売上高が連結損益計算書の売上高の90％を超えると印字…）

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象は、2026年2月24日の取締役会で決議した自己株式の取得を当連結会計年度末後の2026年5月31日までの期間に実施したことのみで、通常の資本政策であるため、needsReviewには入れず本記録にとどめた。重要な契約等は該当事項なし。
- businessModel: 中期経営計画の目標のうち売上高（2029年3月期2,550億円）だけをstrategy.disclosedに引用し、営業利益・営業利益率・ROEの目標は文章の規則により書かなかった。
- businessModel: 前期有報との修正再表示チェックは全行一致しており、数値の不整合はない。経営指標の注記2（役員向け株式交付信託の株式を自己株式に含める取扱い）は1株当たり情報のみに係るため、financialNotesには入れなかった。
- businessStructure: 事業の並びはセグメント情報の外部顧客への売上高の大きい順（加工食品事業160,500百万円、食肉事業77,763百万円、その他132百万円）とし、報告セグメントに含まれない「その他」は最後に置いた。加工食品事業の部門別金額はセグメント情報の収益分解（調理加工食品86,000百万円、ハム・ソーセージ74,499百万円）による。
- businessStructure: 当連結会計年度より、加工食品事業のうち調理加工食品部門の一部がハム・ソーセージ部門へ集計変更されており、部門別金額は変更後の区分による（businessModelのfinancialNotesにも記録）。
- businessStructure: 主要な設備のうち提出会社の工場はいずれも加工食品事業の製造設備として印字されている。営業部は加工食品事業・食肉事業の両セグメントにまたがる表示のため、特定の事業には結びつけなかった。国内子会社の戸田フーズ・安曇野食品工房・トーラクは加工食品事業、ミートサプライは食肉事業の設備として印字されている。
- history: 沿革は年月と事象が一体で印字されており、崩れた表ではないため、印字どおりに対応づけた。
- history: 工場開設・支店開設や移転の行（1963年東京支店開設、1964年高槻工場開設、1965年本社移転、1969年関東工場開設、1970年唐津工場開設、1971年新潟工場開設、1976年広島工場開設、1978年東京支店移転・松阪第二工場開設、1981年岩手工場開設、1989年静岡工場開設、1994年横須賀工場開設、2004年東京支店移転）と、連結子会社同士の合併再編の行（2009年の丸大ミート・丸大フードの再編2件）は、会社の姿を変える節目ではないため省いた。資本金の金額は書いていない。
- history: 登記上の設立年月日は合併会社（旧丸大食品商事株式会社）の1950年2月8日だが、沿革と注記のとおり事実上の存続会社は1958年設立の旧丸大食品株式会社であるため、沿革は1958年の項目にその旨を明記した。
- industry: 主たる業界は、両報告セグメント（加工食品事業・食肉事業）とも食品であることからfoodとした。
- industry: 「その他」の保険代行事業等は金額が小さく報告セグメントでもないため、2つ目の業界は付けなかった。
- relatedCompanies: 関連企業の判定は特定投資株式の保有目的の記載に基づく。目的には全銘柄に共通する末尾の定型文があるが、各銘柄の冒頭に取引の内容（加工食品等の取引／原材料等の仕入取引／資材等の仕入取引、相手本人か同社連結子会社か）が個別に印字されているため、その記載がある相手を結んだ。加工食品等の取引については取引の向きが印字されていないため、customerではなくbusiness-partnerとした。仕入取引の向きが印字されている相手本人はsupplier、取引の相手が同社の連結子会社である場合はbusiness-partnerとし、その旨を説明に書いた。貸借対照表計上額は書いていない。
- relatedCompanies: kanematsu: 大株主（4.88％、2026年3月31日現在）でもあるが、特定投資株式の目的に原材料等の仕入取引が印字されているためsupplierとし、大株主である事実は説明に併記した（rengoも同様にsupplierとし、1.26％の保有を併記）。
- relatedCompanies: maruyoshi-center: 特定投資株式として1,000株を保有し加工食品等の取引の目的が印字されるが、保有が小規模（1,000株・貸借対照表計上額1百万円）で情報収集的な位置づけと判断し、結ばなかった。
- relatedCompanies: cosmos-pharmaceutical: 特定投資株式として400株を保有し加工食品等の取引の目的が印字されるが、保有が小規模（400株）のため結ばなかった。
- relatedCompanies: olympic-group: listingが（コードリストにない）候補。特定投資株式として5,500株を保有し、同社連結子会社との加工食品等の取引が印字されているが、候補の取扱い上結べない。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有先だが、保有目的は同社連結子会社との金融取引であり、金融グループであるため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式の保有先だが、保有目的は同社連結子会社との金融取引であり、信託銀行グループであるため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 金融取引の目的で保有していたが、当事業年度に全株売却しており、金融グループでもあるため結ばなかった。
- relatedCompanies: resona-holdings: 金融取引の目的で保有していたが、当事業年度に全株売却しており、金融グループでもあるため結ばなかった。
- relatedCompanies: kyoto-financial-group: 金融取引の目的で保有していたが、当事業年度に全株売却しており、金融グループでもあるため結ばなかった。
- relatedCompanies: mebuki-financial-group: 金融取引の目的で保有していたが、当事業年度に全株売却しており、金融グループでもあるため結ばなかった。
- relatedCompanies: hirogin-holdings: 金融取引の目的で保有していたが、当事業年度に全株売却しており、金融グループでもあるため結ばなかった。
- relatedCompanies: chugin-financial-group: 金融取引の目的で保有していたが、当事業年度に全株売却しており、金融グループでもあるため結ばなかった。
- relatedCompanies: yamaguchi-financial-group: 金融取引の目的で保有していたが、当事業年度に全株売却しており、金融グループでもあるため結ばなかった。
- relatedCompanies: the-chiba-bank: 金融取引の目的で保有していたが、当事業年度に全株売却しており、銀行であるため結ばなかった。
- relatedCompanies: the-san-in-godo-bank: 金融取引の目的で保有していたが、当事業年度に全株売却しており、銀行であるため結ばなかった。
- relatedCompanies: sumitomo-corporation: 同社連結子会社との原材料等の仕入取引の目的で保有していたが、当事業年度に全株売却しており、現在の保有がないため結ばなかった。
- relatedCompanies: sapporo-holdings: 同社連結子会社との製品の仕入取引の目的で保有していたが、当事業年度に全株売却しており、現在の保有がないため結ばなかった。
- relatedCompanies: en: ambiguousの候補。「エン」は従業員エンゲージメント等の一般語・断片への一致で、エン株式会社への言及はない。
- relatedCompanies: base-4481: 「ベース」は「時価ベースの自己資本比率」等の語への一致で、ベース株式会社への言及はない。
- relatedCompanies: core: 「コア」はサステナビリティ等の記述における一般語への一致で、株式会社コアへの言及はない。
- relatedCompanies: seki: 「セキ」は「セキュリティ」の断片への一致で、セキ株式会社への言及はない。
- relatedCompanies: career: 「キャリア」は複線型キャリアを想定した専門職制度設計等の一般語への一致で、株式会社キャリアへの言及はない。
- relatedCompanies: freee: 「フリー」は「フリー・キャッシュ・フロー」の語への一致で、フリー株式会社への言及はない。
- relatedCompanies: port: 「ポート」は「サポート」「レポート」等の断片への一致で、ポート株式会社への言及はない。
- relatedCompanies: land: 「ランド」は「ブランド豚肉」の断片への一致で、株式会社ランドへの言及はない。
- relatedCompanies: zero: ambiguousの候補。「ゼロ」は糖質ゼロ等の商品表現への一致で、株式会社ゼロへの言及はない。
- relatedCompanies: arata: 「あらた」は「あらためて」の断片への一致で、株式会社あらたへの言及はない。
- relatedCompanies: slogan: 「スローガン」は自社のスローガン「変革」の節への一致で、スローガン株式会社への言及はない。
- relatedCompanies: 候補にない相手: イオン株式会社は特定投資株式の最大の保有先（3,194,159株、同社連結子会社との加工食品等の取引）だが候補に含まれていないため結べなかった。株式会社ファミリーマートは主要な顧客として開示されている（2026年3月期の加工食品事業における売上高24,104百万円）が、候補に含まれていない。大株主の丸大共栄会（8.08％、2026年3月31日現在）は候補にない。連結子会社23社はいずれも未上場で候補になく、持分法適用関連会社のBetagro MF Deli Co., Ltd.（タイ、議決権20.0％）も候補にない。
- terms: 登録候補（助言のみ）: 燻製屋（発売30周年を迎えたハム・ソーセージの主力シリーズ）、フィッシュソーセージ（魚肉ソーセージ）、サラダチキン（調理加工食品の商品）、鶏ムネ肉プラズマローゲン（大学や研究機関と共同研究する脳機能サポート素材）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
