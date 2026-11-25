# 島根銀行 — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社島根銀行 |
| 証券コード | 7150 |
| docID（データを取り出した文書） | `S100YHPP` |
| 原本 docID | `S100YHPP` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHPP.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E5%B3%B6%E6%A0%B9%E9%8A%80%E8%A1%8C

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 株式会社島根銀行 / 7150 / docID S100YHPP |
| edinet | completed | 1 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-shimane-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社島根銀行 有価証券報告書－第176期(2025/04/01－2026/03/31) (docID S100YHPP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-shimane-bank: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 正式名称「株式会社　島根銀行」が EDINET の提出者名「株式会社島根銀行」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の数値目標（コア業務純益・当期純利益・自己資本比率の目標値）は、投資指標の目標値にあたるため本文・perspectivesに書かなかった。
- businessModel: 第176期の期末配当は2026年6月24日開催予定の定時株主総会の決議事項と印字されている。配当政策（資本政策）のためwarningsに記録し、needsReviewには入れなかった。
- businessModel: 前期有報との重複年度は全て一致しており、修正再表示はない。変則決算・決算期変更・会計基準の変更もないためfinancialNotesは空とした。
- businessModel: Wikipediaは第二地方銀行という位置づけと「しまぎん」の愛称の補足にだけ使い、数値は使っていない。
- businessStructure: 事業の並び順はセグメント情報の外部顧客に対する経常収益（2026年3月期）の大きい順とした。
- businessStructure: 「その他」は報告セグメントに含まれない区分であり、持分法適用関連会社が営むため外部顧客に対する経常収益は0百万円と印字されている旨を本文に明記した。
- history: 沿革は日付の印字がある行だけを使い、現在の事業・体制に関わる出来事を中心に選んだ。資本金額は書いていない。
- industry: 銀行業とリース業はいずれも金融サービスであり、主業界はfinanceのみとした。提出者業種も「銀行業」。
- relatedCompanies: sbi-shinsei-bank: 関連当事者注記に貸付債権の譲受の取引が印字されるが、2026年3月26日付で「その他の関係会社の子会社」ではなくなった旨が注記されており、期末日現在の関係の区分が定まらないため結ばなかった。
- relatedCompanies: sbi-sumishin-net-bank: 沿革に住宅ローン等の媒介業務の開始が印字されるが、コードリストにない（上場していない）ため結ばなかった。
- relatedCompanies: en: ambiguousな機械抽出で、一般語への部分一致のため結ばなかった。
- relatedCompanies: core: ambiguousな機械抽出で、「コア業務純益」への部分一致のため結ばなかった。
- relatedCompanies: base-4481: 「対ドルベース」など一般語への部分一致のため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」への部分一致のため結ばなかった。
- relatedCompanies: king: 「バンキング」等への部分一致のため結ばなかった。
- relatedCompanies: vision: 「キャリアビジョン」への部分一致のため結ばなかった。
- relatedCompanies: career: 「キャリアサポート」など一般語への部分一致のため結ばなかった。
- relatedCompanies: suzuki-6785: ambiguousな機械抽出で、役員の人名への部分一致のため結ばなかった。
- relatedCompanies: rent: 「リカレント」への部分一致のため結ばなかった。
- relatedCompanies: s-t: 「八幡東栄エステート」という別会社名への部分一致のため結ばなかった。
- relatedCompanies: alsok: 「ALSOK山陰」という同社の子会社名への部分一致で、当行との関係の印字がないため結ばなかった。
- relatedCompanies: kubota: 「山陰クボタ水道用材」という別会社名への部分一致のため結ばなかった。
- relatedCompanies: rhythm: 「リズム」という一般語への部分一致のため結ばなかった。
- relatedCompanies: heiwa: ambiguousな機械抽出で、地名等への部分一致のため結ばなかった。
- relatedCompanies: seki: ambiguousな機械抽出で、一般語への部分一致のため結ばなかった。
- relatedCompanies: zero: ambiguousな機械抽出で、数値表記への部分一致のため結ばなかった。
- relatedCompanies: nissin: ambiguousな機械抽出で、コードリストになく、当行との関係の印字がないため結ばなかった。
- relatedCompanies: 株式会社西京銀行と株式会社シノケングループは【大株主の状況】に載る事業会社だが、related-candidates.jsonに含まれないため結ばなかった。株式会社日本カストディ銀行（信託口・信託E口）は信託口の保有のため結ばなかった。
- terms: 助言のみ。用語としては「経常収益」「自己資本比率」「地方銀行」「フェイス・トゥ・フェイス」などが候補だが、本工程ではデータを持たない。

## 要確認（status に反映）

- businessModel: 当行には議決権のないA種優先株式とB種優先株式が発行されています。2026年3月31日現在、A種優先株式940千株とB種優先株式1,520千株を、その他の関係会社であるSBI地銀ホールディングス株式会社が保有しています。B種優先株式は、中国総合信用株式会社（1,300千株）、株式会社西京銀行（500千株）、株式会社シノケングループ（500千株）、株式会社トマト銀行（300千株）、松江土建株式会社（200千株）、山陰ケーブルビジョン株式会社（200千株）、八幡東栄エステート株式会社（200千株）も保有しています。また、2019年11月29日には、SBI地域銀行価値創造ファンド（委託会社：SBIアセットマネジメント株式会社）に対する第三者割当増資を実施しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
