# 西松屋チェーン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社西松屋チェーン |
| 証券コード | 7545 |
| docID（データを取り出した文書） | `S100Y3CW` |
| 原本 docID | `S100Y3CW` |
| 提出日（原本） | 2026-05-13 |
| 決算期 | 2026-02-20 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y3CW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社西松屋チェーン / 7545 / docID S100Y3CW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nishimatsuya-chain: 2 件の数値を有報XBRLと照合
有報: 株式会社西松屋チェーン 有価証券報告書－第70期(2025/02/21－2026/02/20) (docID S100Y3CW)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
nishimatsuya-chain: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは比較行がありませんでしたが、当期が連結財務諸表の作成初年度で前期の連結財務諸表が存在しないためであり、訂正や組替えを示すものではありません。
- businessModel: 中期目標の経常利益230億円は、本文に書けない利益の区分のため strategy.disclosed には入れていません。売上高2,700億円の目標のみ記載しました。
- businessModel: 台湾子会社は2026年度から出店を開始する予定で、当期の売上高への寄与は有報に記載されていません。
- businessStructure: 単一セグメントのため、children は【関連情報】に代わる販売の実績（商品別）の区分と金額を使いました。
- businessStructure: 商品別の売上高は MD&A の販売の実績の表の印字どおりです（子供衣料62,845百万円、育児・服飾雑貨112,650百万円、ベビー衣料・マタニティ用品17,792百万円、その他77百万円、合計193,365百万円）。
- history: 沿革の2004年4月の行は、年月のみ印字され事象文が欠けているため使いませんでした。2011年9月の行は沖縄県への出店と47都道府県のチェーン店網の完成として使いました。
- history: 商品開発本部三宮事務所の開設の行は、対応する年月が印字されていないため使いませんでした。
- history: 出店地域の拡大の細部（1990年の郡部への初出店、1993年の中国地区、1998年の九州地区、1999年の中部地区への出店など）は、15件に絞るため省きました。
- history: 設立時の資本金の金額は本文に書けないため記載していません。
- industry: 単一セグメントのベビー・子供の生活関連用品の販売事業が売上高の大半を占めるため、retail を主たる業界としました。
- relatedCompanies: mizuho-financial-group は主要取引銀行であるみずほ銀行との取引関係が理由のため結びませんでした（銀行ルール）。
- relatedCompanies: dai-ichi-life-holdings（第一生命ホールディングス）と t-and-d-holdings は保険業務に係る取引関係のみのため結びませんでした。
- relatedCompanies: palemo-holdings は将来的な協働を見据えた取引関係の構築・強化が保有目的で、現在の取引の印字がないため結びませんでした。
- relatedCompanies: matsuya・land・en・ray・seki・space・jinushi・s-t は「西松屋」「ランド」「エン」などの語の断片一致のみのため結びませんでした。nissin・trust はコードリストにないため結びませんでした。
- relatedCompanies: 大株主の友好エステート、大村禎史、大村浩一、ハリマ共和物産、GOLDMAN SACHS INTERNATIONAL、信託銀行は、非上場・個人・信託口・海外のため、事業会社としての大株主としては結びませんでした。ハリマ共和物産は物流の取引先として supplier で結んでいます。
- relatedCompanies: 連結子会社の台灣西松屋股份有限公司は非上場のため候補になく、結んでいません。
- relatedCompanies: 大株主の状況の住友不動産の所有株式数（1,420.7千株）と特定投資株式の株式数（1,183,200株）が異なるため、株式数は記載していません。
- terms: 新たに提案する用語はありません。プライベートブランドやドミナント出店などは本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
