# 京阪ホールディングス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 京阪ホールディングス株式会社 |
| 証券コード | 9045 |
| docID（データを取り出した文書） | `S100YCVR` |
| 原本 docID | `S100YCVR` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCVR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 京阪ホールディングス株式会社 / 9045 / docID S100YCVR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 49 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
keihan-holdings: 10 件の数値を有報XBRLと照合
有報: 京阪ホールディングス株式会社 有価証券報告書－第104期(2025/04/01－2026/03/31) (docID S100YCVR)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
keihan-holdings: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…新規出店などの成長投資を進めながら、利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象は、2026年5月21日の取締役会の包括決議に基づく第41回無担保普通社債の発行のみであり、資金調達に関する事項のため本文・needsReviewには入れず、ここに記録する。
- businessModel: 中期経営計画・長期経営戦略の数値目標（営業利益やROEなどの目標値）は、規則により本文に書いていない。戦略は定性的にのみ記した。
- businessModel: 前期有報との修正再表示チェックは全項目一致（差異なし）のため、組替えに関する注記は不要と判断した。会計基準の遡及適用（税効果）は financialNotes に記録した。
- businessStructure: 事業の並び順は、セグメント情報の2026年3月期「外部顧客への営業収益」の大きい順（不動産業131,121百万円、運輸業95,173百万円、流通業57,048百万円、レジャー・サービス業43,922百万円、その他の事業5,090百万円）。「その他の事業」は報告セグメントであり、金額の小さい順位どおり最後に置いた。
- businessStructure: 子区分（不動産事業・建設事業、鉄道事業・バス事業、ホテル事業・レジャー事業）は外部顧客への営業収益が独立して開示されていないため、金額は書いていない。
- history: 沿革の後半の表は年月セルと事象文が分かれて印字される崩れた表になっている。年月の数（9）と事象の数（9）が同じため行順に対応づけた（2016年 持株会社体制への移行、2016年 京阪淀ロジスティクスヤード開業、2017年 ゼロ・コーポレーション株式取得、2017年 ホテル京阪淀屋橋開業、2017年 プレミアムカー・ライナー運転開始、2018年 ホテル京阪京都八条口等開業、2019年 THE THOUSAND KYOTO開業、2019年 GOOD NATURE STATION開業、2022年 プライム市場移行）。採用したのはこのうち持株会社化と2施設の開業、プライム市場移行である。
- history: 創業時の資本金（７百万円）は金額のため書いていない。沿革のうち、路線の開通・延長や小型の子会社取得などの細かな行は省いた（省略した主なもの: 宇治線・京津線・交野線・石山坂本線の継承、くずはモール開業、京阪モール開業、ホテル京阪札幌・浅草の開業、京都センチュリーホテル取得、ビオ・マーケット取得など）。
- industry: 主たる業界は、報告セグメントの外部顧客への営業収益が最大の不動産業（2026年3月期131,121百万円）に基づき real-estate とした。運輸業（95,173百万円）、流通業（57,048百万円）、レジャー・サービス業（43,922百万円）はそれぞれ独立して開示される報告セグメントのため、transportation、retail、entertainment を2つ目以降に付けた。「その他の事業」（GOOD NATURE STATIONの運営等、5,090百万円）には業界を付けていない。
- relatedCompanies: 結んだのは京福電気鉄道1社のみ。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: land: 「ランド」は「TOWERLAND」などの施設名や一般語の一致のみで、株式会社ランドへの言及ではない。
- relatedCompanies: kohsoku: 「高速」は高速バスや、持分法適用関連会社である中之島高速鉄道株式会社（未上場）の名称の一部などの一致で、株式会社高速への言及ではない。
- relatedCompanies: en: 「エン」はエンターテイメント等の一般語の一致のみ。
- relatedCompanies: base-4481: 「ベース」は一般語の一致のみで、株式会社ベースへの言及はない。
- relatedCompanies: seki: 「セキ」は語の断片一致のみで、株式会社セキへの言及はない。
- relatedCompanies: vision: 「ビジョン」は経営ビジョン等の一般語の一致のみ。
- relatedCompanies: zero: 有報の「ゼロ」は連結子会社の株式会社ゼロ・コーポレーション（未上場）の名称であり、候補の株式会社ゼロ（9028）とは別の会社である。
- relatedCompanies: nissin: 証券コードがコードリストになく、「日新」は一般語の一致のみ。
- relatedCompanies: port: 「ポート」はユニバーサルシティポート等の場所の名称の一致のみ。
- relatedCompanies: arata: 「あらた」は「あらためて」等の語の断片一致のみ。
- relatedCompanies: i-ll: 「アイル」は語の断片一致のみ。
- relatedCompanies: nidec: 「ニデック」は「ニデック京都タワー」という施設の総称の注記に現れるのみで、取引・提携・資本関係の記載はない。
- relatedCompanies: career: 「キャリア」は一般語の一致のみ。
- relatedCompanies: kddi: 特定投資株式の保有目的に「通信関連取引における関係円滑化のため」とあるのみで、相手固有の取引内容の記載がないため結ばない。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式とみなし保有株式（退職給付信託）に載るが、保有目的は安定的な資金調達等であり、金融機関との資金調達関係のため結ばない。
- relatedCompanies: space: 「スペース」はイベントスペース等の一般語の一致のみ。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式とみなし保有株式（退職給付信託）に載るが、金融機関との資金調達関係のため結ばない。
- relatedCompanies: asahi-broadcasting-group-holdings: 特定投資株式の保有目的に「地域活性化・沿線情報の発信を目的とした戦略的な関係維持・強化のため」とあるのみで、相手固有の取引の記載がないため結ばない。
- relatedCompanies: asahi-kogyosha: 特定投資株式の保有目的が「鉄道事業及び不動産事業における長期的な関係維持・強化のため」という複数銘柄共通の定型句のみのため結ばない。
- relatedCompanies: garden: 「ガーデン」は庭園等の一般語の一致のみ。
- relatedCompanies: hankyu-hanshin-holdings: 特定投資株式の保有目的は同業他社に共通する定型句の範囲であり、大株主の注記の退職給付信託口の名称に現れるのも信託口の名称にすぎない。相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: hazama-ando: 特定投資株式の保有目的が複数銘柄共通の定型句のみのため結ばない。
- relatedCompanies: kinden: 特定投資株式の保有目的が複数銘柄共通の定型句のみのため結ばない。
- relatedCompanies: kintetsu-group-holdings: 特定投資株式の保有目的が同業他社に共通する定型句の範囲であり、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: kuze: 設備の状況などの記載に現れるのみで、取引・提携・資本関係の記述はない。
- relatedCompanies: kyosan-electric-manufacturing: 特定投資株式の保有目的は「信号保安装置をはじめとする鉄道事業における長期的な関係維持・強化のため」と、製品分野を添えた定型句の範囲であり、相手固有の取引内容の記載がないため結ばない（この判断は覆しうるよう明記する）。
- relatedCompanies: kyoto-financial-group: 特定投資株式に載る金融機関で、保有目的は安定的な資金調達等のため結ばない。
- relatedCompanies: mizuho-financial-group: みなし保有株式（退職給付信託）に載る金融機関のため結ばない。
- relatedCompanies: nabtesco: 特定投資株式の保有目的は製品分野を添えた定型句の範囲であり、相手固有の取引内容の記載がないため結ばない。
- relatedCompanies: nishi-nippon-railroad: 特定投資株式の保有目的が同業他社向けの定型句の範囲であり、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: nishimatsu-construction: 特定投資株式の保有目的が共通の定型句のみのため結ばない。
- relatedCompanies: obayashi: 特定投資株式の保有目的が複数銘柄共通の定型句のみのため結ばない。
- relatedCompanies: omron: 特定投資株式の保有目的は「駅務機器をはじめとする鉄道事業における長期的な関係維持・強化のため」と、製品分野を添えた定型句の範囲であり、相手固有の取引内容の記載がないため結ばない（この判断は覆しうるよう明記する）。
- relatedCompanies: ray: 「レイ」は語の断片一致のみ。
- relatedCompanies: rent: 「レント」は賃貸等の一般語に含まれる断片一致のみ。
- relatedCompanies: resona-holdings: 特定投資株式に載る金融機関で、保有目的は安定的な資金調達等のため結ばない。
- relatedCompanies: rix: 社名への言及はなく、語の断片一致のみ。
- relatedCompanies: shin-nippon-air-technologies: 特定投資株式の保有目的が共通の定型句のみのため結ばない。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式に載る金融機関で、保有目的は安定的な資金調達等のため結ばない。
- relatedCompanies: t-and-d-holdings: 特定投資株式に載る保険会社で、保有目的は安定的な資金調達等の定型句のため結ばない。
- relatedCompanies: tekken: 特定投資株式の保有目的が共通の定型句のみのため結ばない。
- relatedCompanies: the-hyakujushi-bank: 特定投資株式に載る金融機関で、保有目的は安定的な資金調達等のため結ばない。
- relatedCompanies: the-kyoto-hotel: 特定投資株式の保有目的は「ホテル事業及び不動産事業における京都地域での関係維持・強化のため」という定型句の範囲であり、相手固有の取引の記載がないため結ばない。
- relatedCompanies: the-royal-hotel: 特定投資株式の保有目的（不動産開発等の事業連携、中之島地域の活性化）も保有株式の表の範囲にとどまり、相手固有の取引・提携の具体的な記載がないため結ばない。
- relatedCompanies: the-shiga-bank: 特定投資株式に載る金融機関で、保有目的は安定的な資金調達等のため結ばない。
- relatedCompanies: toyo-denki-seizo: 特定投資株式の保有目的は「鉄道車両をはじめとする鉄道事業における長期的な関係維持・強化のため」と、製品分野を添えた定型句の範囲であり、相手固有の取引内容の記載がないため結ばない（この判断は覆しうるよう明記する）。
- relatedCompanies: 候補外の関係会社: 中之島高速鉄道株式会社は【関係会社の状況】の持分法適用関連会社（議決権の所有割合33.5％）だが未上場で候補にないため結んでいない。PANNARAI DEVELOPMENT CO., LTD.（タイ、持分法適用関連会社40.0％）も候補にない。
- relatedCompanies: 大株主の状況（2026年3月31日現在）に載るのは信託銀行・銀行・保険会社等のみで、事業会社の大株主はいない。株式会社三井住友銀行（1.35％）は金融機関のため major-shareholder として結んでいない。
- terms: 登録候補（助言のみ）: BIOSTYLE（人々の暮らしの価値を高めると同時に社会課題の解決に資する商品・サービス・事業を創出する、京阪グループの取組。同社は「京阪版SDGs」と位置づけている）、プレミアムカー（京阪線の座席指定の特別車両）、e-kenetカード（京阪グループのクレジットカード）、沿線再耕（長期経営戦略の主軸戦略の一つで、沿線の価値を改めて耕すように高める取組）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
