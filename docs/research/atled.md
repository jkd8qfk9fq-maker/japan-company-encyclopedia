# エイトレッド — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エイトレッド |
| 証券コード | 3969 |
| docID（データを取り出した文書） | `S100YE46` |
| 原本 docID | `S100YE46` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE46.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エイトレッド / 3969 / docID S100YE46（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
atled: 10 件の数値を有報XBRLと照合
有報: 株式会社エイトレッド 有価証券報告書－第19期(2025/04/01－2026/03/31) (docID S100YE46)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
atled: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本有報は未修正です（summary.json の amendments は status none、訂正docIDなし、DEIの訂正フラグはすべて false、checkedThrough 2026-11-12）。前期有報との修正再表示照合は全6系列・重複4行すべて差異ゼロでした。
- businessModel: 主要な経営指標等の推移の注記（連結財務諸表を作成していないこと、関連会社が存在しないこと、潜在株式に希薄化効果がないこと、株価の市場表記の切替え）は表示事項のため、financialNotes には入れずここに記録します。会計基準の変更・表示方法の変更・株式分割の注記はありませんでした。
- businessModel: 重要な後発事象は「該当事項はありません」でした。
- businessModel: 経営方針の「重要な経営指標としている売上高の拡大」は売上高自体の目標であり投資指標ではないため strategy に含めましたが、数値目標は印字されていないため書いていません。配当方針の数値は書いていません。
- businessModel: 段階利益の金額と理由、キャッシュ・フローの金額、設備投資の予定金額は本文に書いていません。受注実績は会社が記載を省略しています。
- businessModel: Wikipedia は記事が見つからず（found: false）、使用していません。
- businessStructure: 単一セグメント（ワークフロー事業）のため、子区分は会社の製品・サービス区分（パッケージソフト／クラウドサービス）により、金額の大きい順に並べました。金額は経営成績等の分析に印字された製品・サービス区分別の売上高です。
- businessStructure: パッケージソフトの製品別内訳（1億85百万円＋10億49百万円）は、区分合計の印字12億35百万円と1百万円ずれますが、会社の億単位の印字どおりに記載しました。
- businessStructure: 販売実績（千円）の区分合計（1,235,079千円＋1,667,685千円）は売上高合計2,902,765千円と1千円ずれますが、印字の合計をそのまま用いました。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。仕入先の個別名は【事業の内容】に印字されていません（販売はSIer等のパートナー企業経由が中心で、売上の約90％を販売パートナー経由と会社は述べています）。
- businessStructure: 設備は本社及び事務所（東京都渋谷区）のみで、単一セグメントのため事業への対応づけは行っていません。帳簿価額は書いていません。
- history: 設立時及び増資時の資本金の金額は沿革に印字されていますが、規則により金額は書いていません。
- history: 2017年のクラウドアプリケーションプラットフォーム「ATLED Work Platform」の販売開始は、現在の【事業の内容】に製品として記載がないため落としました。
- history: 2022年4月の東京証券取引所の市場区分見直しによるスタンダード市場への移行は、市場再分類のため落としました（現在の上場市場は表紙印字のスタンダード市場を businessStructure に記録）。
- history: Wikipedia は記事が見つからず（found: false）、補足に使用していません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる事業はワークフローソフトウエアの開発・販売というITサービスであり、it を primary としました。通信事業者でもメディア事業者でもないため、telecommunications・media は付けていません。DEIの別記事業は CTE でした。
- relatedCompanies: port: 「サポート」等の部分文字列のみのため結びませんでした。
- relatedCompanies: hikari-tsushin: 【大株主の状況】に株式会社光通信が2026年3月31日現在で1.00％を保有すると印字されますが、取引・提携の記載がなく投資目的の保有と判断し結びませんでした。同じく大株主の光通信KK投資事業有限責任組合は別法人（投資事業有限責任組合）です。
- relatedCompanies: innovation: 印字は富士フイルムビジネスイノベーション株式会社で、別法人のため結びませんでした。
- relatedCompanies: base-4481: 「ノウハウ等をベースに」という一般語の部分一致のみのため結びませんでした。
- relatedCompanies: frontier: 印字はアクロフロンティアで、別法人のため結びませんでした。
- relatedCompanies: scsk: 【大株主の状況】に2026年3月31日現在で8.01％を保有する大株主として印字され、沿革にも2007年の資本参加が印字されますが、候補の listing が「コードリストにない」ため結びませんでした。
- relatedCompanies: secure: 「セキュアな環境」という一般語の部分一致のみのため結びませんでした。
- relatedCompanies: 候補にないため結ばず記録します: 株式会社ソフトクリエイト（親会社を同じくする兄弟会社で、プラチナパートナーとして販売取引・業務委託取引があり、関連当事者情報に印字されます）、株式会社エートゥジェイと株式会社visumo（兄弟会社で販売取引等が関連当事者情報に印字されます）、ダイワボウ情報システム株式会社（主要な顧客ごとの情報に印字される主要な顧客です）。
- relatedCompanies: 株式の保有状況は「保有株式が存在しないため、記載すべき事項はありません」と印字されており、保有株式を根拠とするリンクはありません。
- terms: 助言のみの工程です。用語候補: 「ワークフロー」（企業の様々な業務にかかる稟議・申請から承認・決裁に至るまでの事務フローを電子化し、業務プロセスの効率化・自動化や内部統制の強化を図る仕組み・製品の総称）、「ファーストDX」（ワークフローシステムを、企業が取り組むべき最初のDXかつ最も重要なツールと位置づける当社の考え方）。いずれも本文で使った語で、有報の用語解説・経営方針に基づきます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
