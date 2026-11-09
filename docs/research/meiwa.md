# 明和産業 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 明和産業株式会社 |
| 証券コード | 8103 |
| docID（データを取り出した文書） | `S100YF48` |
| 原本 docID | `S100YF48` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF48.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E6%98%8E%E5%92%8C%E7%94%A3%E6%A5%AD

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 明和産業株式会社 / 8103 / docID S100YF48（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
meiwa: 10 件の数値を有報XBRLと照合
有報: 明和産業株式会社 有価証券報告書－第107期(2025/04/01－2026/03/31) (docID S100YF48)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
meiwa: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画「PI2028」の定量目標の数値は、本文の規則により strategy には書きませんでした。
- businessModel: 本文に財務諸表の組替えの記載がありますが、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotes は書きませんでした。
- businessModel: 2026年2月19日取締役会決議の自己株式の取得及び消却は、重要な後発事象として有報に記載されていますが、提出後の資本政策のため warnings のみに記録し、needsReview には入れていません。
- businessModel: Wikipedia の「三菱グループの商社である」という記述は、有報の沿革にある旧三菱商事の解散に伴う設立の記載と整合するため、description の補足に使いました。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: 「その他」の区分は報告セグメントに含まれない事業セグメントで、売上高の金額が印字されていないため、事業には含めませんでした。
- history: 沿革は15件に絞りました。駐在員事務所の設置や支店・営業所の移転、子会社の設立の一部は省きました。
- history: 1975年9月の東京証券取引所市場第一部への昇格の行に印字された資本金の金額は、本文の規則により書きませんでした。
- industry: 主たる業界は、化学品や石油製品などを扱う商社であることと、東証の業種分類が卸売業であることから trading としました。
- industry: 化学品を扱う事業が売上高の大半を占めるため chemicals を2つ目に付けました。
- relatedCompanies: 三菱商事株式会社の当社に対する議決権所有割合は、前連結会計年度の24.5％から当連結会計年度は14.2％となりました。
- relatedCompanies: ベース株式会社：「ベースオイル」の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 株式会社トラスト：コードリストにないため結ばない。
- relatedCompanies: エン株式会社：「エンジニアリングプラスチック」の断片一致のみのため結ばない。
- relatedCompanies: 株式会社大和：「大和証券」の断片一致のみのため結ばない。
- relatedCompanies: 株式会社平和：断片一致のみのため結ばない。
- relatedCompanies: いであ株式会社・株式会社イノベーション・ポート株式会社・セキ株式会社：断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: AGC株式会社：第一事業及び第三事業におけるクロール・アルカリ製品、ウレタン原料及び無機薬品等の仕入先で、2026年3月31日現在4.21％の大株主でもあるが、related-candidates.jsonにないため結ばない。
- relatedCompanies: 株式会社SHOEI：第三事業におけるFPR原料等の販売先だが、related-candidates.jsonにないため結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社・株式会社日本カストディ銀行：信託銀行のため結ばない。
- relatedCompanies: 三菱UFJモルガン・スタンレー証券株式会社・大和証券株式会社・JPモルガン証券株式会社・フィリップ証券株式会社：金融機関のため結ばない。
- relatedCompanies: 連結子会社12社（十全株式会社、株式会社武田商事、株式会社アケア、明和産業（上海）有限公司、東京グラスロン株式会社、ソーケン株式会社、Meiwa Vietnam CO., Ltd.、株式会社タカロク、Meiwa（Thailand）Co.,Ltd.、Thai Meiwa Trading Co.,Ltd.ほか）：すべて非上場または海外法人のため結ばない。
- relatedCompanies: 持分法適用関連会社3社（株式会社鈴裕化学、クミ化成株式会社、P.T.Pakarti Riken Indonesia）：すべて非上場または海外法人のため結ばない。
- terms: 新たに提案する用語はありません。レアアースや難燃剤、ベースオイルなどの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
