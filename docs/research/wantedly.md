# ウォンテッドリー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ウォンテッドリー株式会社 |
| 証券コード | 3991 |
| docID（データを取り出した文書） | `S100X6HU` |
| 原本 docID | `S100X6HU` |
| 提出日（原本） | 2025-11-25 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X6HU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ウォンテッドリー株式会社 / 3991 / docID S100X6HU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wantedly: 10 件の数値を有報XBRLと照合
有報: ウォンテッドリー株式会社 有価証券報告書－第15期(2024/09/01－2025/08/31) (docID S100X6HU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
wantedly: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記2（第14期・第15期に希薄化効果を有する潜在株式がないため希薄化後の1株当たり数値を記載していないこと）は投資指標に関する表示上の事項のため、financialNotes には書いていません。
- businessModel: 前期有報との修正再表示チェックは全系列で差異なしでした。株式分割・株式併合の印字はありません。
- businessModel: 2024年10月に取締役会で決議した本社移転は当期中の事項であり、後発事象は連結・個別とも該当事項なしと印字されています。移転に伴う補償金の受取額などの金額は本文に書いていません。
- businessModel: 配当は資本政策の手続きのため、本文には金額を書いていません。経営方針の目標指標は定性的に要約し、数値の目標は書いていません。
- businessStructure: 単一セグメント（ビジネスSNS事業）のため、製品及びサービスごとの情報は単一区分の外部顧客への営業収益が連結営業収益の90％超であるとして記載が省略されており、children には金額を書いていません。主要な顧客ごとの情報も該当事項なしと印字されています。
- businessStructure: 主要な設備は本社（東京都港区）のみで、単一セグメントのため事業との対応は本社設備として一体です。帳簿価額は書いていません。在外子会社に主要な設備はありません。
- businessStructure: 連結子会社は Wantedly Singapore Pte. Ltd.（シンガポール、議決権の所有割合100.0％、ビジネスSNS事業）1社です。自社の子会社のため relatedCompanies には結んでいません。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先名の印字はありません。
- history: 本社移転の行（2012年3月 恵比寿へ移転、2013年11月 白金台三丁目へ移転、2015年6月 白金台五丁目へ移転）は歴史の項目から省き、ここに列挙しました。
- history: 資本金の金額は歴史に書いていません。沿革表の年月と事象は対応して印字されており、崩れた表ではありません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は human-resources（人材サービス）としました。単一セグメントのビジネスSNS事業の収益の中心は、企業向けのサブスクリプション型「採用」サービスであり、採用支援が事業の中核です。インターネット上のプラットフォーム（ビジネスSNS）を通じてサービスを提供する事業形態であるため、it を副たる業界としました。タイミー（timee）の分類（human-resources 主・it 副）と同じ考え方です。
- industry: Engagement Suite は従業員の定着・活躍支援であり、人材サービスに含まれるものとして分けていません。閉じた分類に当てはまるため、暫定分類や taxonomyGaps はありません。DEIの別記事業は CTE です。
- relatedCompanies: vision: 「ビジョン」という一般語の一致のみで、株式会社ビジョンそのものへの言及ではありません。
- relatedCompanies: seki: 「セキュリティ」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: career: 「キャリア」という一般語の一致のみで、株式会社キャリアそのものへの言及ではありません。
- relatedCompanies: en: 「エンゲージメント」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: innovation: 「イノベーション」という一般語の一致のみです。
- relatedCompanies: port: 「サポート」等の部分文字列の一致のみです。
- relatedCompanies: garden: 地名・建物名「恵比寿ガーデンプレイスタワー」の部分一致のみです。
- relatedCompanies: lec: 「フレックスタイム」等の部分文字列の一致のみです。
- relatedCompanies: nissin: 候補の listing が「コードリストにない」もので、日付等の部分一致のみです。
- relatedCompanies: ray: 建物名等の部分一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: tear: 英単語の部分一致のみです。
- relatedCompanies: rhythm: 「アルゴリズム」等の部分文字列の一致のみです。
- relatedCompanies: 候補にないため記録します: 大株主のアーキタイプグループ株式会社（2025年8月31日現在1.29％）は候補にありません。代表取締役の仲暁子氏（同68.20％）は個人のため対象外です。特定投資株式及びみなし保有株式は該当事項なしと印字されており、保有株式を根拠とするリンクはありません。
- terms: 助言のみ: 用語候補として ビジネスSNS、会社訪問アプリ、サブスクリプション、ダイレクト・リクルーティング（スカウト）、採用管理システム（ATS）、エンゲージメント、社内報、福利厚生 などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
