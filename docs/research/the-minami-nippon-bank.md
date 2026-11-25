# 南日本銀行 — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社南日本銀行 |
| 証券コード | 8554 |
| docID（データを取り出した文書） | `S100YMAO` |
| 原本 docID | `S100YGBN` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YMAO／有効文書 S100YMAO（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YMAO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 株式会社南日本銀行 / 8554 / docID S100YGBN |
| edinet | completed | 1 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 32 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
the-minami-nippon-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社南日本銀行 訂正有価証券報告書－第118期(2025/04/01－2026/03/31) (docID S100YMAO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第118期(2025/04/01－2026/03/31)、docID S100YMAO）を有効文書としてこのパックを作った。原本は docID S100YGBN。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（MajorShareholdersTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
すべて一致しました。
the-minami-nippon-bank: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社　 南日本銀行」が EDINET の提出者名「株式会社南日本銀行」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YMAO、2026-06-26提出）。原本（docID S100YGBN）との差異は分類 text-change で、財務数値（経営指標）は同一であり、変更は大株主の状況の本文のみ。本文・出典は訂正報告書に基づく。
- businessModel: サービス別の外部顧客に対する経常収益の単純合計は17,140百万円で、連結経常収益17,141百万円と1百万円異なる。有報の印字どおりに記載した（丸めの差）。
- businessModel: 調達に関する記述が有報にないため、suppliers は書かなかった。
- businessModel: 第2次中期経営計画の目標数値は、目標値のため本文・perspectives に書かなかった。
- businessStructure: 報告セグメントは銀行業のみ。その他事業は報告セグメントに含まれず金額が独立して開示されていないため、事業別の金額は書かなかった。
- businessStructure: サービス別の外部顧客に対する経常収益の単純合計は17,140百万円で、連結経常収益17,141百万円と1百万円異なる。有報の印字どおりに記載した（丸めの差）。
- businessStructure: 表紙に市場区分の印字がないため、listings の market は書かなかった（上場先は福岡証券取引所）。
- history: 沿革の資本金額（設立時の資本金、優先株式の発行額）は本文の規則により金額を書かず、事象だけを記載した。
- industry: 報告セグメントは銀行業のみで、グループの事業は銀行業務を中心とする金融サービスであるため、産業は finance のみとした。その他事業（リース・ファンド運営・現金輸送警備）は金額が独立して開示されていないため、産業を足さなかった。
- relatedCompanies: 有効文書（訂正有価証券報告書）は原本と大株主の状況の本文が異なるが、関連企業の候補・関係性の根拠に変わりはなかった。
- relatedCompanies: ふくおかフィナンシャルグループ（fukuoka-financial-group）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: じもとホールディングス（jimoto-holdings）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: ヒューリック（hulic）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: みずほフィナンシャルグループ（mizuho-financial-group）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: アクシーズ（axyz）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: 第一交通産業（daiichi-koutsu-sangyo）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: 大和証券グループ本社（daiwa-securities-group）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: 野村ホールディングス（nomura-holdings）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: サンケイ化学（sankei-chemical）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: スターゼン（starzen）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: 三井住友トラストグループ（sumitomo-mitsui-trust-group）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: 宮崎銀行（the-miyazaki-bank）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: トマト銀行（tomato-bank）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: ヤマックス（yamax）: 特定投資株式として保有が印字されるだけで、保有目的は定型文のみで取引・提携の印字がないため結ばなかった。
- relatedCompanies: コーアツ工業（koatsu-kogyo）: 特定投資株式として印字されるが、EDINETコードリストに証券コードがなく上場区分を確認できないため結ばなかった。
- relatedCompanies: パス（path）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: エン（en）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: コア（core）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: ベース（base-4481）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: ポート（port）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: レント（rent）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: キャリア（career）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: コロナ（corona）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: クルーズ（crooz）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: キング（king）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: エステー（s-t）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: セキ（seki）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: リード（the-lead）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: ウィル（will）: 一般語の部分一致であり、社名の一致ではないため対象外とした。
- relatedCompanies: 大株主の状況に載る株式会社みずほ銀行・株式会社福岡銀行・株式会社宮崎太陽銀行・株式会社鹿児島銀行・株式会社西日本シティ銀行・南国殖産株式会社は、候補リストになく、大株主であること自体は取引・提携の根拠にならないため結ばなかった。
- relatedCompanies: 連結子会社2社（なんぎんリース株式会社・株式会社なんぎんキャピタル）と持分法適用関連会社1社（南九州サービス株式会社）は自社の関係会社であり、関連企業リンクの対象外（事業構造に記載）。
- terms: 助言: 用語「WIN-WINネット業務」は、新販路開拓支援業務の呼称。取引先の本業支援や経営改善支援に取り組む同行の取り組みを指す。
- terms: 助言: 用語「なんぎんファン」は、第2次中期経営計画のパートナーシップ戦略で掲げる表現。人材育成とDXを通じてつくり出す、顧客や地域とのつながりを指す。
- terms: 助言: 用語「第2次中期経営計画『Speed & Challenge～変革から成長へ～』」は、2026年4月にスタートした成長フェーズの中期経営計画の名称。第1次中期経営計画は変革フェーズと位置付けられていた。
- terms: 助言: 用語「“つながり”の強さで、地域の輝く未来をつくる」は、同行グループのパーパス（存在意義として掲げる文言）。コーポレートメッセージは「話せるところ　頼れるところ」。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
