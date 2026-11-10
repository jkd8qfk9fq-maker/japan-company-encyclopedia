# エスリード — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | エスリード株式会社 |
| 証券コード | 8877 |
| docID（データを取り出した文書） | `S100YHNU` |
| 原本 docID | `S100YHNU` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHNU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | エスリード株式会社 / 8877 / docID S100YHNU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
eslead: 10 件の数値を有報XBRLと照合
有報: エスリード株式会社 有価証券報告書－第34期(2025/04/01－2026/03/31) (docID S100YHNU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
eslead: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空です。変則決算・決算期の変更・会計基準の変更はなく、前期有報との修正再表示チェックも全行一致したため、記載すべき注記はありません。
- businessModel: strategy の「開発価値循環型事業」の文言は、経営者による財政状態等の分析の記載によります。
- businessModel: 親会社である森トラスト株式会社は非上場のため関連企業として結ぶことはできず、役割を businessModel の flow と industryPosition に記録しています。親会社との取引として、2026年3月期に不動産の売却がありますが、金額は本文の財務数値の規則により記載していません。
- businessModel: 株式会社ＭＡプラットフォームは、親会社の会長が議決権の100％を保有する会社で、2026年3月期に不動産の売却取引がありますが、非上場で候補データにないため結ばず、ここに記録します。
- businessStructure: 当社グループは当社及び子会社12社により構成されています。
- businessStructure: その他事業の各事業には個別の売上高が印字されていないため、金額はセグメント単位でのみ記載しています。
- businessStructure: 親会社である森トラスト株式会社及び株式会社森トラスト・ホールディングスは非上場のため、関連企業として結ぶことはできません。親会社の役割は businessModel 及び industryPosition に記録しています。
- history: 沿革表で年月と事象文が分かれて印字された2か所（2018年11月と2019年1月、2023年4月と2025年2月）は、年月と事象の数が一致するため行順で対応づけました。
- history: 設立時の資本金額は沿革に印字されていないため記載していません。
- industry: 主たる事業は不動産販売事業で、2026年3月期の外部顧客への売上高86,594百万円が連結売上高の4分の3近くを占めるため、主たる業界を real-estate としました。
- relatedCompanies: 株式会社ジャックスは、保有目的が「マンション分譲事業における顧客ローン提携等を行っている取引先」と銘柄個別に印字されているため、業務提携先として結びました。
- relatedCompanies: 株式会社オリックス、トモニホールディングス株式会社、株式会社三井住友フィナンシャルグループ、株式会社三菱ＵＦＪフィナンシャル・グループ、株式会社りそなホールディングスは、特定投資株式の表に個別の保有目的が印字されていますが、内容は用地仕入代金の借入（資金調達）と顧客ローン提携の併記であり、金融機関の資金調達を理由とするため結びませんでした。
- relatedCompanies: 株式会社南都銀行は、J-クレジット寄付型私募債に関する記載のみで、資金調達に関する取引のため結びませんでした。
- relatedCompanies: 株式会社滋賀銀行は、綜電株式会社の太陽光発電所取得に伴うグリーンローン契約に関する記載のみで、資金調達に関する取引のため結びませんでした。
- relatedCompanies: 株式会社ラウンドワンは、ラウンドワン三宮駅前店の取得に関する記載のみで、取引・提携の印字がないため結びませんでした。
- relatedCompanies: 「リード」は「エスリード」の部分一致による誤抽出で、当社との取引・提携の印字がないため結びませんでした。
- relatedCompanies: 株式会社トラスト（3347）は、親会社である森トラスト株式会社の名称の部分一致によるもので、別法人であるため結びませんでした。
- relatedCompanies: 「エン」「ベース」「ポート」「セキ」「ゼロ」「キャリア」「コロナ」「フリー」「レイ」「リオン」は、一般語・部分一致による誤抽出のため結びませんでした。
- relatedCompanies: 「鈴木」は役員・従業員の個人名による誤抽出のため結びませんでした。
- relatedCompanies: 親会社である森トラスト株式会社及び株式会社森トラスト・ホールディングスは非上場のため結ぶことはできません。森トラスト株式会社は議決権の53.9％を所有する親会社で、2012年2月23日に資本業務提携契約を締結し、2026年3月期に不動産の売却取引があります。役割は businessModel と industryPosition に記録しています。
- relatedCompanies: 連結子会社12社はすべて非上場のため結ぶことはできません。
- relatedCompanies: 株式会社ＭＡプラットフォームは、親会社の会長が議決権の100％を保有する会社で、不動産の売却取引がありますが、非上場で候補データにないため結びませんでした。
- terms: 助言: 用語「開発価値循環型事業」は、開発・売却による収益とグループ会社による保有・運用管理を通じた安定した収益を組み合わせる事業モデルを指す同社の用語で、事業説明の前提になるため、用語集への追加候補と考える。
- terms: 助言: 用語「真の総合不動産会社」は、2022年5月に標榜した同社の目指す姿で、経営戦略の説明の前提になるため、用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
