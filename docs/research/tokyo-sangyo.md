# 東京産業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東京産業株式会社 |
| 証券コード | 8070 |
| docID（データを取り出した文書） | `S100YEID` |
| 原本 docID | `S100YEID` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEID.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東京産業株式会社 / 8070 / docID S100YEID（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-sangyo: 10 件の数値を有報XBRLと照合
有報: 東京産業株式会社 有価証券報告書－第116期(2025/04/01－2026/03/31) (docID S100YEID)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tokyo-sangyo: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 連結経営指標等の注記5のとおり、第112期（2022年3月期）及び第113期（2023年3月期）の数値は、各期の承認数値について誤謬の訂正による修正再表示を反映した数値です。前期有報との照合（全6系列・4行）では差異がなく、修正再表示は前期時点で反映済みでした。本登録は当期有報の数値により、financialNotesに記録しました。
- businessModel: 株式会社トーエネックとの静岡県函南町の太陽光発電事業に関する訴訟は、当連結会計年度に当社が和解金を支払うことで和解が成立し、その影響は当期の業績に反映されています。訴訟の相手方であり継続的な取引・提携関係ではないため、関連企業には含めていません。和解金額と損失の科目名は転記していません。
- businessModel: 重要な契約等に記載されたコミットメントライン契約及びタームローン契約は、財務上の特約が付された資金調達の契約であり、資金調達のみの関係として本文には記載しませんでした。
- businessModel: 中期経営計画の経営指標の計画値（売上高・ROE・DOE等）は投資の語・目標数値のため転記せず、戦略は定性的に要約しました。
- businessModel: Wikipediaの記事「東京産業」の冒頭は三菱グループに属する機械総合商事会社である旨のみで、有報の記載を超える補足がないため、出典に追加しませんでした。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（環境・化学・機械事業、電力事業、生活産業事業）としました。
- businessStructure: 各事業の子区分は金額が独立して開示されていないため、金額を記載せず、その旨を明記しました。
- businessStructure: TOKYO SANGYO (THAILAND) CO.,LTD.は議決権の所有割合が49.0％ですが、実質的に支配しているため連結子会社とされている旨が関係会社の状況に注記されています。登録する事業構造に変更はありません。
- businessStructure: セグメント間の内部売上高又は振替高はゼロであり、MD&Aのセグメント別売上高は外部顧客への売上高と一致します。
- history: 沿革の資本金額は記載しませんでした（1994年の公募増資などの資本に関する行は、金額・株数の記録のみのため選択から外しました）。
- history: 支店・出張所の開設や投資単位の変更などの細目は選択から外し、主な変遷のみを記載しました。
- industry: 主たる業界はtrading（機械専門商社、東京証券取引所の卸売業）としました。
- industry: 電力事業は発電所向け機器の販売・保守であり電力の供給事業ではないため、energyは付けませんでした。太陽光発電事業は環境・化学・機械事業の一部で金額が独立開示されていないため、energyは付けませんでした。
- industry: 機械設備を取り扱いますが製造は行っていないため、machineryは付けませんでした。
- relatedCompanies: 三菱商事（mitsubishi-corporation）: 沿革における1947年の起源としての記載のみで、当期の取引・資本関係の印字がないため結びませんでした。起源は沿革に記録しました。
- relatedCompanies: 株式会社三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group）: 特定投資株式の保有目的が「主要金融機関として」の資金調達関係のみのため結びませんでした。
- relatedCompanies: 株式会社山梨中央銀行（the-yamanashi-chuo-bank）: 保有目的が「金融上の取引があり」の資金調達関係のみのため結びませんでした。
- relatedCompanies: ピーエス・コンストラクション（ps-construction）: 当事業年度に保有株式が全て売却され株式数がゼロとなったため結びませんでした。
- relatedCompanies: 株式会社ADEKA、DIC株式会社、東京電力ホールディングス株式会社: 特定投資株式の保有目的に個別の取引の記載がありますが、関連企業候補（related-candidates.json）に含まれていないため結びませんでした。取引の事実はここに記録します。
- relatedCompanies: 光通信（hikari-tsushin）: 大株主の印字は「光通信ＫＫ投資事業有限責任組合」という投資事業有限責任組合であり、同社そのものではないため結びませんでした。
- relatedCompanies: 株式会社トーエネック（toenec）: 太陽光発電事業に関する訴訟の相手方であり、当期に和解が成立しました。継続的な取引・提携関係の印字がないため結びませんでした。
- relatedCompanies: トラスト（trust）: 日本マスタートラスト信託銀行（信託口）等の信託口の印字であり、コードリストにもないため結びませんでした。
- relatedCompanies: イノベーション（innovation）: 連結子会社である社会環境イノベーション株式会社の社名の一部であり、当社グループの会社であるため結びませんでした。
- relatedCompanies: フジ（fuji-8278）: 印字は株式会社フジタであり、別の会社で曖昧なため結びませんでした。
- relatedCompanies: 大和（daiwa）: 印字は前身の大和機械株式会社であり、曖昧なため結びませんでした。
- relatedCompanies: ゼロ（zero）、ベース（base-4481）、セキ（seki）、ポート（port）、コロナ（corona）、ランド（land）、ビジョン（vision）、ウィル（will）、レント（rent）: 一般語・部分一致による候補であり、取引・提携・資本関係の印字がないため結びませんでした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: DOE（純資産配当率）やROEは投資の語のため、用語の助言には含めませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
