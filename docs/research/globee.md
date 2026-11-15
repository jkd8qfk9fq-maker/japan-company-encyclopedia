# Globee — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｇｌｏｂｅｅ |
| 証券コード | 5575 |
| docID（データを取り出した文書） | `S100YYMC` |
| 原本 docID | `S100YYMC` |
| 提出日（原本） | 2026-08-25 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYMC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｇｌｏｂｅｅ / 5575 / docID S100YYMC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
globee: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｇｌｏｂｅｅ 有価証券報告書－第12期(2025/06/01－2026/05/31) (docID S100YYMC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
globee: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Globee」が EDINET の提出者名「株式会社Ｇｌｏｂｅｅ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aに印字された営業利益・経常利益の金額と増減率は、本文に書いていません（本文の財務数値は売上高と当期純利益だけです）。
- businessModel: 経営指標として重視するユーザー数・有料会員数・導入法人数・対応タイトル数の推移表は、経営目標の達成状況を判断するための指標の開示であり、数値目標そのものは本文やperspectivesに書いていません。
- businessModel: 主要な販売先として印字されたApple Inc.（売上高の56.4％）、SBペイメントサービス株式会社（同23.0％）、Google LLC（同9.6％）は、アプリの配信・決済のプラットフォーム事業者であり、関連企業としては結んでいません（relatedCompanies の warnings 参照）。金額は販売先の内訳としてMD&Aに印字されたものですが、関連企業の説明には書いていません。
- businessModel: 2026年5月期に自己株式の取得を行っています（資本政策のため warnings のみとし、金額は書いていません）。
- businessModel: 主要な経営指標等の推移の注記のうち、第８期の誤謬の訂正に関する注記は financialNotes に着地させました。その他の注記（上場前の株価関係指標・株主総利回りの省略、従業員数の定義、配当を実施していないことなど）は表示事項として warnings のみとしました。
- businessModel: 証拠パックの修正再表示チェックは前期有報との全項目一致（差異なし）でした。訂正有報はなく（amendments status は none）、組替えの記載もないため、誤謬の訂正の事実だけを financialNotes と warnings に記録しました。
- businessModel: Wikipedia は企業一覧ページのみが見つかり、会社の事実を補う情報がなかったため使用していません。
- businessStructure: 当社は教育サービス事業の単一セグメントです。サービス内の区分（abceed、abceed for school、ABCEED ENGLISH）は金額が独立して開示されていないため、各区分に金額を書かず、その旨を明記しました。売上高に占めるサブスクリプション売上の比率（2026年5月期の各四半期で95％以上）と、一般ユーザー（個人）と法人の内訳（個人が約9割）は印字されています。
- businessStructure: 主要な設備は本社（東京都港区）のみで、単一セグメントの全社共通のため、特定のサービスに結びつけませんでした。帳簿価額は書いていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。一般ユーザー向けの利用料はプラットフォーム事業者及び決済代行業者を通じて回収されることが【事業の内容】に印字されていますが、個別の事業者名は同箇所には印字されていません。
- history: 沿革のうち、2017年のPremiumプランのリリースとアプリ版教材の単体販売、2018年のUnlimitedプランのリリース、2020年のニュース機能・TOEIC L&R TESTオンライン模試・abceed webのリリース、2021年の英検コースと教科書プランのリリース、2022年の多読コースとEssentialプランのリリース、2023年の映画・ドラマ機能のリリース、2024年の光村図書出版株式会社との業務提携とライブ講義のアーカイブ動画機能のリリースは、機能・プラン単位の細かな追加のため落としました（本文の事業説明には含めています）。
- history: 資本金の金額は沿革・本文に書いていません。
- industry: 主たる業界は教育サービス事業（AI英語教材「abceed」の提供）ですが、閉じた分類に教育の区分がないため、スマートフォンアプリとウェブで提供する学習プラットフォームという事業形態から最も近い it を暫定としました。DEIの別記事業はCTEです。このツリーのゲートに合わせ、業界行は industryId キーで記録しています。
- relatedCompanies: core（コア）: 「予測スコア」などの一般語の部分一致のみで、相手についての記述がないため結んでいません。
- relatedCompanies: en（エン）: 「ABCEED ENGLISH」や「エンタテインメント」などの部分一致のみで、ambiguous のため結んでいません。
- relatedCompanies: port（ポート）: 「サポート」の部分一致のみのため結んでいません。
- relatedCompanies: seki（セキ）: 「セキュリティ」の部分一致のみで、ambiguous のため結んでいません。
- relatedCompanies: king（キング）: 「スピーキング」の部分一致のみのため結んでいません。
- relatedCompanies: lec（レック）: 「フレックスタイム制度」の部分一致のみのため結んでいません。
- relatedCompanies: seed（シード）: 自社サービス名「abceed」の部分一致のみのため結んでいません。
- relatedCompanies: vision（ビジョン）: 「ビジョンを掲げており」という一般語の一致のみのため結んでいません。
- relatedCompanies: base-4481（ベース）: 「問題データベース」の部分一致のみのため結んでいません。
- relatedCompanies: corona（コロナ）: 新型コロナウイルスの影響に関する記述の文脈のみのため結んでいません。
- relatedCompanies: freee（フリー）: 「連続記録フリーズ機能」の部分一致のみのため結んでいません。
- relatedCompanies: nissin（日新）: 候補リストにない（コードリストにない）うえ、一致自体も曖昧なため結んでいません。
- relatedCompanies: no-1（No.1）: 「次世代のNo.1英語教育カンパニーを目指す」という表記の一致のみのため結んでいません。
- relatedCompanies: tein（テイン）: 「エンタテインメント」の部分一致のみのため結んでいません。
- relatedCompanies: 候補にない相手（記録のみ）: 株式会社三省堂は2020年5月に学校市場の展開に関する業務提携を行い、光村図書出版株式会社とは2024年1月に中学校英語教科書への対応で業務提携を行っていますが、いずれも未上場で候補にないため結んでいません。
- relatedCompanies: 候補にない相手（記録のみ）: 主要な販売先として印字されたApple Inc.、Google LLCはアプリ配信のプラットフォーム事業者、SBペイメントサービス株式会社は決済代行業者であり、いずれも候補にないため結んでいません。コンテンツのライセンス提供元として印字された出版社・映像事業者も、個別の取引関係の記載はライセンスの範囲にとどまり、候補にないため結んでいません。
- relatedCompanies: 【大株主の状況】の上位は創業者個人、信託銀行の信託口、証券会社等であり、事業会社で結べる相手はいませんでした。当社は関係会社がなく、純投資目的以外の投資株式は非上場株式1銘柄のみで、特定投資株式に上場会社は含まれていません。
- terms: 用語の助言のみです。対象となりうる用語は「abceed（AI英語教材）」「AIレコメンド（学習データに基づき最適な問題を提示する機能）」「予測スコア（TOEIC公開テストのスコア予測）」「シャドーイング」「ディクテーション」「サブスクリプション」「オーガニックユーザー獲得率」「反転学習」などですが、有報の本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] globeeの主たる業界（教育サービス事業） → 提案: 教育サービス（AI英語学習プラットフォーム）。事業はAI英語教材「abceed」の提供による教育サービスが全体を占めますが、閉じた分類に教育の区分がなく、スマートフォンアプリとウェブで提供する学習プラットフォームという事業形態から最も近い it を暫定としました。
