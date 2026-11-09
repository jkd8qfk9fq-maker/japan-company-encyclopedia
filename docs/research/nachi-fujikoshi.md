# 不二越 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社不二越 |
| 証券コード | 6474 |
| docID（データを取り出した文書） | `S100XMRN` |
| 原本 docID | `S100XMRN` |
| 提出日（原本） | 2026-02-24 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XMRN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社不二越 / 6474 / docID S100XMRN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 34 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nachi-fujikoshi: 10 件の数値を有報XBRLと照合
有報: 株式会社不二越 有価証券報告書－第143期(2024/12/01－2025/11/30) (docID S100XMRN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nachi-fujikoshi: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの注意事項（本文に財務諸表の組替えの記載がある）について: 前期有報との修正再表示チェックでは6系列すべてが一致し、パック内で確認できる会計基準の変更は、連結経営指標等の注記にある収益認識基準の第140期（2022年11月期）期首からの適用のみだったため、組替えの記載そのものはfinancialNotesには入れず、ここに記録した。収益認識基準の適用はfinancialNotesに記載した。
- businessModel: 2025年11月期の当期純利益の増加率（56.7%増）と売上高の減少理由はMD&Aの印字どおりに書いた。営業利益・経常利益などの金額や増減率は書いていない。
- businessModel: 目標とする経営指標のうち営業利益率10%は、利益水準の目標のためstrategyには書かなかった（海外売上高比率60%のみ記載）。
- businessModel: Wikipediaの記事（証券コードで同一性を確認済み）は補足として確認したが、有報にない数値・順位は使わず、商標「NACHI」は有報内の子会社名等からも明らかなため、出典には加えなかった。
- businessStructure: 報告セグメントは製品別の3区分（部品・機械工具・その他）で、並び順はセグメント情報の外部顧客への売上高（2025年11月期）の大きい順とした: 部品147,255百万円 → 機械工具73,407百万円 → その他15,240百万円。
- businessStructure: 「その他の事業」は報告セグメントの一つであり、特殊鋼の製造・販売と運送・情報処理関連のサービスからなる（セグメント情報の概要の印字どおり）。
- businessStructure: 提出会社の主要事業所（富山・東富山・滑川）は、セグメント欄に複数区分が連記されているため、拠点と事業は結びつけなかった。
- businessStructure: セグメント利益（営業利益ベース）は書いていない。
- history: 【沿革】は年月と事象が一体となった表で崩れていないため、印字どおりに年単位で採用した。月は書いていない。
- history: 省いた主な行: 1931年ドリルの製造販売開始、1962年事業部制の採用、1967年ドイツ販売会社の設立、1970年工作機械・油圧機器部門の発足、1979年シンガポール工具製造会社の設立、1987年台湾合弁ベアリング製造会社の設立、1988年韓国合弁油圧機器製造会社の設立、1989年フィリピン工具製造会社と米国ロボット販売会社の設立、1999年タイのベアリング製造会社の設立、2000年国内販売会社の統合再編、2003年チェコのベアリング製造会社の設立、2005年米国工具製造会社の設立、2007年常盤産業の子会社化、2009年ナチツールエンジニアリングの設立、2012年中国とインドの製造会社の設立、2014年メキシコのベアリング製造会社の設立、2015年タイの鍛造・旋削部品製造会社の設立、2023年監査等委員会設置会社への移行。
- industry: 東証の業種区分は機械であり、ベアリング・油圧機器・工具・工作機械・ロボットの製造販売が事業の中心のため、主たる業界をmachineryとした。
- industry: automotiveは付けなかった: 自動車分野は主要な需要先だが、自動車そのものの製造事業ではなく、報告セグメントも製品別区分のため。
- industry: semiconductorsは付けなかった: 半導体製造装置向けの部材・装置を事業として開示していないため。
- relatedCompanies: okaya-and-coはbusiness-partnerとした: 保有目的に「製品の販売先および原材料等の仕入先」と両方向が印字されているため、単一方向のcustomer/supplierは主張しなかった。主要な顧客である事実と、同社が不二越株式2.20%を保有する大株主である事実は説明文に併記した。
- relatedCompanies: daido-steelはbusiness-partnerとした: 保有目的に「製品の販売先および原材料等の仕入先」と両方向が印字されているため。
- relatedCompanies: sumitomo-realty-and-developmentはbusiness-partnerとした: 保有目的に「不動産取引における、安定的な取引関係の維持・強化」と、不動産取引の関係が印字されているため（向きは印字されていない）。
- relatedCompanies: meidenshaはcustomerとした: 保有株数は2,000株と少ないが、保有目的が相手固有の「製品の販売先として」と印字されており、計上額も11百万円と情報収集目的の名義（100株・計上額0百万円）とは異なるため。
- relatedCompanies: nanyo・nichidenは候補がambiguousだが、特定投資株式の表に正式な銘柄として社名・株数・保有目的が印字されており、同一性と関係性の両方に根拠があるため結んだ。
- relatedCompanies: career: 「キャリア」は人材のキャリア等の一般語の一致のみで、株式会社キャリアへの言及はないため結ばなかった。
- relatedCompanies: natori: 「なとり」は「とり組み」の部分一致のみで、株式会社なとりへの言及はないため結ばなかった。
- relatedCompanies: port: 「ポート」は「レポート」等の部分一致のみで、ポート株式会社への言及はないため結ばなかった。
- relatedCompanies: en: 「エン」は連結子会社ナチツールエンジニアリング等の名称の部分一致のみで、エン株式会社への言及はないため結ばなかった（ambiguous）。
- relatedCompanies: vision: 「ビジョン」は自社の長期ビジョンの語の一致のみで、株式会社ビジョンへの言及はないため結ばなかった。
- relatedCompanies: seki: 「セキ」は「セキュリティ」の部分一致のみで、セキ株式会社への言及はないため結ばなかった（ambiguous）。
- relatedCompanies: base-4481: 「ベース」は「営業利益ベース」の語の一致のみで、ベース株式会社への言及はないため結ばなかった。
- relatedCompanies: okabe: 「岡部」は社外取締役の氏名（岡部洋氏）の一致のみで、岡部株式会社への言及はないため結ばなかった（ambiguous）。
- relatedCompanies: zero: 「ゼロ」は「災害ゼロ」の語の一致のみで、株式会社ゼロへの言及はないため結ばなかった（ambiguous）。
- relatedCompanies: aska: 「スカ」は加工法「エアスカイビングシステム」の部分一致のみで、アスカ株式会社への言及はないため結ばなかった。
- relatedCompanies: core: 「コア」は「コアメンバー」の語の一致のみで、株式会社コアへの言及はないため結ばなかった（ambiguous）。
- relatedCompanies: corona: 「コロナ」は「新型コロナウイルス感染症」の語の一致のみで、株式会社コロナへの言及はないため結ばなかった。
- relatedCompanies: kohsoku: 「高速」は「高速化」の語の一致のみで、株式会社高速への言及はないため結ばなかった（ambiguous）。
- relatedCompanies: space: 「スペース」は「省スペース化」の語の一致のみで、株式会社スペースへの言及はないため結ばなかった。
- relatedCompanies: daihen: 特定投資株式として保有していたが当事業年度に全株を売却し、現在は保有しておらず（前事業年度119,000株）、現在の取引関係の印字もないため結ばなかった。
- relatedCompanies: unisol-holdings: 特定投資株式の銘柄名は旧社名「フルサト・マルカホールディングス」で、当事業年度に全株を売却し、現在は保有しておらず（前事業年度598,240株）、現在の取引関係の印字もないため結ばなかった。
- relatedCompanies: nabtesco: 当事業年度に全株を売却し、現在は保有しておらず（前事業年度5,000株）、現在の取引関係の印字もないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 当事業年度に全株を売却したうえ（前事業年度191,200株）、金融取引が理由のため結ばなかった。
- relatedCompanies: hokuhoku-financial-group: 当事業年度に全株を売却したうえ（前事業年度164,800株）、金融取引が理由のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group: 当事業年度に全株を売却したうえ（前事業年度42,800株）、金融取引が理由のため結ばなかった。
- relatedCompanies: mizuho-financial-group: 保有目的が「安定的な金融取引関係の維持・強化」であり、資金調達・金融取引が理由のため結ばなかった。
- relatedCompanies: the-first-bank-of-toyama: 保有目的が「安定的な金融取引関係の維持・強化」であり、金融取引が理由のため結ばなかった（332,666株）。
- relatedCompanies: the-bank-of-toyama: 保有目的が「安定的な金融取引関係の維持・強化」であり、金融取引が理由のため結ばなかった（2,000株）。
- relatedCompanies: ms-and-ad-insurance-group-holdings: 保有目的が「安定的な保険取引関係の維持・強化」であり、保険取引が理由のため結ばなかった。
- relatedCompanies: sompo-holdings: 保有目的が「安定的な保険取引関係の維持・強化」であり、保険取引が理由のため結ばなかった。
- relatedCompanies: hino-motors-7205: 特定投資株式に「製品の販売先として」51,000株の保有が印字されているが、候補のlistingが「（コードリストにない）」のため結べなかった。
- relatedCompanies: nippon-koshuha-steel: 特定投資株式に「原材料等の仕入先として」10,000株の保有が印字されているが、候補のlistingが「（コードリストにない）」のため結べなかった。
- relatedCompanies: 候補にない相手の記録: ＴＨＫ株式会社（「製品の販売先および原材料等の仕入先」144,700株）、株式会社ＳＵＢＡＲＵ（「製品の販売先」302,000株）、ＮＯＫ株式会社（「原材料等の仕入先」168,700株）、株式会社ＮａＩＴＯ（「製品の販売先」1,433,900株）は、いずれも特定投資株式に取引が印字されているが関連企業候補リストにないため結べなかった。
- relatedCompanies: 候補にない相手の記録: 連結子会社51社と持分法適用関連会社2社（宝佳那智（青島）機器人応用有限公司、大成NACHI油圧工業株式会社）はすべて非上場で候補にない。大株主のうち事業会社は岡谷鋼機株式会社（2.20%、business-partnerとして結んだ）と株式会社北陸銀行（2.63%、銀行であり候補にもない）のみで、ほかは信託銀行・相互保険会社・持株会である。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
