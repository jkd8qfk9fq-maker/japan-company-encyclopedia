# 北川鉄工所 — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社北川鉄工所 |
| 証券コード | 6317 |
| docID（データを取り出した文書） | `S100YHUP` |
| 原本 docID | `S100YHUP` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHUP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社北川鉄工所 / 6317 / docID S100YHUP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kitagawa: 10 件の数値を有報XBRLと照合
有報: 株式会社北川鉄工所 有価証券報告書－第116期(2025/04/01－2026/03/31) (docID S100YHUP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kitagawa: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックでは全系列で差異ゼロでした。本文に財務諸表の組替えへの言及がある旨のブートストラップ注意がありましたが、主要な経営指標等の注記は希薄化に関する注１のみで、組替えの理由が印字された指標の変更は確認できなかったため、financialNotesには記載せず、ここに検証結果を記録しました。
- businessModel: 中期経営計画2027の指標・目標は将来の目標値であり実績ではないため本文には転記せず、戦略は定性的に要約しました。
- businessModel: 当期の親会社株主に帰属する当期純利益の増加要因として有報が述べる固定資産売却に伴う計上については、禁止語に触れるため本文には転記せず、金額と前期比のみを記載しました。
- businessModel: 株式会社ケーブル・ジョイは2025年10月１日に株式会社ちゅピCOMを存続会社とする吸収合併により消滅し、株式会社AileLinXは2026年３月27日に清算結了して連結の範囲から除外されました。いずれも期中の変動で期末の体制に反映されているため、沿革・事業構造側の記述とし、needsReviewにはしていません。
- businessModel: セグメント別の外部顧客への売上高の合計（57,975百万円）と「その他」（440百万円）の合計は連結売上高58,415百万円と一致します。MD&Aのセグメント別売上高も同じ数値であり、内部売上高を含む数値は用いていません。
- businessStructure: KITAGAWA (THAILAND) CO.,LTD.は2025年３月12日開催の取締役会で解散が決議され清算手続中であり、期末時点の連結子会社として事業構造に含めています（needsReviewに記録）。
- businessStructure: 各事業の子区分は【事業の内容】の製品区分に基づき、金額はセグメント注記の外部売上高のみを用いました。製品別の金額は印字されていないため子区分には金額を記載していません。
- history: 沿革の各行には資本金の金額を転記していません（有報の関係会社の状況に印字される子会社の資本金も含みます）。
- history: 株式会社AileLinXの設立（2018年）と清算結了（2026年３月）は、ドローン開発の子会社であり期末の事業構造に残らないため、沿革の行には含めていません。
- industry: 主たる業界は、工作機器・産業機械の製造販売と鋳造による金属素形材が事業の中核であるため machinery としました。閉じた分類に合う値があるため分類の不足はありません。
- industry: 半導体関連事業は報告セグメントの一つとして開示されているため、semiconductors を副業種として付けました。
- relatedCompanies: ひろぎんホールディングスとみずほフィナンシャルグループは、特定投資株式の保有目的がグループ会社の銀行（株式会社広島銀行、株式会社みずほ銀行等）との資金借入などの金融取引に関するものであり、持株会社自体との具体的な取引・提携の記載がないためリンクしていません（銀行本体と上場持株会社は別の法人であるため）。
- relatedCompanies: 西川ゴム工業は、地元企業としてタイ・メキシコの現地情報の共有等を行う旨の個別の記載はありますが、具体的な取引・提携の内容が印字されていないためリンクしていません。
- relatedCompanies: 北川精機とリョービは、地元企業として地域の社会活動に対する相談等を行う旨の記載のみで、具体的な取引関係の記載がないためリンクしていません。
- relatedCompanies: 候補のサンテック（sanyo-engineering-and-construction）は自社のセグメント名「キタガワ　サン　テック　カンパニー」の部分一致であり、エン、ベース、コア、コタ、キャリア、イノベーション、川辺、ビジョン、アスカ、ゼロ、ランド、パス、ポート、セキ、リードはいずれも一般語・部分一致であり、取引・提携・資本関係の記載がないためリンクしていません。DMG森精機は本文に取引関係を述べる記載が確認できなかったためリンクしていません。トラストはコードリストにない相手です。
- relatedCompanies: 自社グループの連結子会社９社と持分法適用関連会社２社（KITAGAWA EUROPE LTD.、KITAGAWA-NORTHTECH INC.）は関連企業リンクの対象外とし、事業構造に記載しました。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の【事業の内容】および【沿革】の記載に基づきます。

## 要確認（status に反映）

- businessStructure: [object Object]

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
