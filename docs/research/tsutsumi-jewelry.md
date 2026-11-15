# ツツミ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ツツミ |
| 証券コード | 7937 |
| docID（データを取り出した文書） | `S100Y7SI` |
| 原本 docID | `S100Y7SI` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y7SI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ツツミ / 7937 / docID S100Y7SI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tsutsumi-jewelry: 10 件の数値を有報XBRLと照合
有報: 株式会社ツツミ 有価証券報告書－第53期(2025/04/01－2026/03/31) (docID S100Y7SI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
tsutsumi-jewelry: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは空とした。変則決算・決算期変更はなく（summaryのirregularPeriods・fiscalYearChangeとも空）、前期有報との修正再表示チェックは全系列一致し、会計方針の変更や表示方法の変更の印字もなく、重要な後発事象は「該当事項はありません」と印字されているためである。
- businessModel: 金額はすべて有報に百万円単位で印字された金額をそのまま用いた（千円額の切り捨て換算は行っていない）。売上高の増加理由としてMD&Aは地金相場の高騰など原材料価格の上昇と来店客数・販売数量の増加を挙げているが、本文では増減率と品目別金額の記載にとどめた。
- businessModel: 経営方針の節が重視する指標の名称には本文で使えない財務用語が含まれるため、disclosedの要約にはその名称を転記していない。社是と商品・店舗の方針のみを要約した。
- businessModel: 発行済株式総数は5年表で2022年3月期の20,080千株から2023年3月期の15,630千株へ減少しているが、当期有報にその理由の印字はなく、株式数に関する指標は本文で使っていないため、financialNotesにもneedsReviewにも入れていない。
- businessModel: suppliersキーは本ツリーのスキーマに無いため businessModel には書かず、原材料の買付けを自社で行う事実は businessModel.description と perspectives に記した。
- businessStructure: 単一事業のため、子事業はセグメント関連情報の製品及びサービスごとの情報（外部顧客への売上高）の区分を用い、金額の大きい順に並べた。関連情報の「その他」区分は外部顧客への売上高が「－」（該当なし）のため子事業にしておらず、売上控除等△186百万円も品目ではないため子事業にしていない。3品目の合計35,411百万円から売上控除等を差し引いた35,225百万円が売上高と一致する。
- businessStructure: 店舗数はMD&Aの印字（2026年3月期に既存店16店舗のリニューアルと6店舗の退店を実施し、当事業年度末現在の店舗数は145店舗）を用いた。【主要な設備の状況】の地域別店舗数とは関東の店舗数が異なる点は needsReview に記録した。
- businessStructure: 非連結子会社の有限会社大分ツツミ貴金属は【事業の内容】に宝飾品製造業として当社の製造部門の委託加工を行う旨が印字されている。一方で【関係会社の状況】は「該当事項はありません」と印字されているため、関係会社としての区分は本文に書かず、事業の説明の中でのみ委託加工の事実を記した。
- history: 沿革は年月と事項が対になった通常の表で印字されており、全15行を転記した。沿革に資本金額の印字はない。
- industry: 事業は宝飾品の製造と販売で、直営店での小売が中心のため retail を主業種とした。閉じた分類に宝飾品・ジュエリーの区分が無いため taxonomyGaps に記録した。製造を行う点は businessStructure と businessModel に記載しており、機械や電機などの既存区分は実態と合わないため追加していない。
- relatedCompanies: 候補 trust（株式会社トラスト）は【大株主の状況】の日本マスタートラスト信託銀行株式会社（信託口）への部分一致で、信託口名義であり、listingもコードリストにないためリンクしていない。
- relatedCompanies: 候補 zero（株式会社ゼロ）は減損の注記の「正味売却価額をゼロとして評価」という一般語への一致で ambiguous のためリンクしていない。
- relatedCompanies: 候補 aeon-mall（イオンモール株式会社）は売掛金の相手先別内訳にイオンモール㈱と印字がある相手だが、listingがコードリストにないため、検証できる相手としてリンクせず、売掛金の相手先として名前が挙がる事実のみここに記録する。
- relatedCompanies: 候補 corona（株式会社コロナ）は【事業等のリスク】の感染症の記述（新型コロナウイルスのような感染症）への一致で、当該会社への言及ではないためリンクしていない。
- relatedCompanies: 候補 king（株式会社キング）は【沿革】の株式会社キングスター宝飾（1988年に吸収合併）への部分一致で、上場している株式会社キングとは別法人のためリンクしていない。
- relatedCompanies: 候補 land（株式会社ランド）はハウスブランド名「Pure Planets」「Blessed Rain」への部分一致のためリンクしていない。
- relatedCompanies: 候補 seki（セキ株式会社）は情報セキュリティ等の一般語への部分一致で ambiguous のためリンクしていない。
- relatedCompanies: 大株主は個人、公益財団法人堤征二記念奨学財団、信託銀行の信託口、海外ファンド等で、上場している事業会社に当たる株主はいない。特定投資株式は「該当事項はありません」と印字されている。非連結子会社の有限会社大分ツツミ貴金属は自社の子会社でありリンク対象ではない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として2件を提案した。いずれも有報本文に現れる当社の事業を理解するうえで有用な語である。

## 要確認（status に反映）

- businessStructure: 店舗数について有報内に食い違いがあります。【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】は2026年3月31日現在の店舗数を145店舗とし、地方別では関東地方88店舗と印字していますが、【主要な設備の状況】の営業設備（販売業務）は関東94店舗と印字しており、地域別の合計は151店舗になります。本登録はMD&Aの145店舗（関東88店舗）の印字に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 株式会社ツツミの宝飾品（ジュエリー）の製造・販売 → 提案: 宝飾品（jewelry）。同社は宝飾品を自社で製造し直営店販売と卸売を行う単一事業で、売上は小売中心だが、閉じた業界分類には宝飾品・ジュエリーを表す区分が無い。最も近い retail を暫定の主業種とした。
