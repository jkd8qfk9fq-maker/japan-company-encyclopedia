# ＶＡＬＵＥＮＥＸ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＶＡＬＵＥＮＥＸ株式会社 |
| 証券コード | 4422 |
| docID（データを取り出した文書） | `S100Z9YZ` |
| 原本 docID | `S100Z9YZ` |
| 提出日（原本） | 2026-10-27 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z9YZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＶＡＬＵＥＮＥＸ株式会社 / 4422 / docID S100Z9YZ（S100WX4G から新しい有報に更新。旧成果物は pipeline/analysis/superseded/valuenex-japan-S100WX4G/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z9YZ） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
valuenex-japan: 10 件の数値を有報XBRLと照合
有報: ＶＡＬＵＥＮＥＸ株式会社 有価証券報告書－第20期(2025/08/01－2026/07/31) (docID S100Z9YZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
valuenex-japan: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「VALUENEX株式会社」が EDINET の提出者名「ＶＡＬＵＥＮＥＸ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記１～４（潜在株式調整後１株当たり当期純利益・自己資本利益率・株価収益率の未記載理由、従業員数の数え方）は表示事項のため、financialNotes には入れず、ここに記録します。注記５の株式分割は financialNotes（2022年7月期）と needsReview に記録しています。
- businessModel: 経営上の目標の達成状況を判断するための客観的な指標として売上高と経常利益が挙げられていますが、利益に関する指標であるため本文や perspectives には数値・目標を書いていません。
- businessModel: サービス別の金額はセグメント注記【関連情報】の外部顧客への売上高（千円）を百万円に切り捨てたもので、合計は890百万円となり、印字の合計891百万円と切り捨ての差があります（千円単位では一致）。
- businessModel: 受注高・受注残高の金額、キャッシュ・フローの金額、設備の帳簿価額は書いていません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」でした。株式の保有状況も「該当事項はありません」で、政策保有株式はありません。
- businessModel: 修正再表示の照合は前期有報と重複する全年度で差異がなく、組替えの注記もないため、financialNotes への追加はありません。
- businessStructure: 当社グループはアルゴリズム事業の単一セグメントであり、サービス別の内訳はセグメント注記【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）によります。サービス別の金額を百万円に切り捨てた合計は890百万円で、印字の合計891百万円とは切り捨ての差があります（千円単位では891,126千円と一致）。
- businessStructure: 本社（東京都文京区）は単一セグメントの全社設備のため、特定のサービスには結びつけていません。帳簿価額は書いていません。
- businessStructure: 連結子会社VALUENEX, Inc.（米国、100％出資）は自社の子会社であり、関連企業には含めていません。
- businessStructure: この工程のスキーマには suppliers キーがないため、仕入先に関する記載はしていません（個別の仕入先は印字されていません）。
- history: 本店移転（2008年、2009年、2013年）、2014年のダッシュボード機能追加、2017年のユーザインターフェース2.0の提供開始、2024年のVALUENEX Radar Fusion β版テスター募集開始は、事業の転機ではないため沿革には含めていません。
- history: 沿革の年月は年だけを登録し、資本金の金額は書いていません。
- industry: 主たる事業は自社開発のアルゴリズムによるビッグデータ解析ツールの提供とコンサルティングであるため、it を主たる業界としました。顧客の業界（化学、電気、自動車、機械、エネルギー等）は顧客側の属性であり、当社グループの事業として開示されたものではないため付けていません。
- relatedCompanies: rhythm：「アルゴリズム」という一般的な語の一部としての一致のみで、取引・提携・資本関係の記載がないため結んでいません。
- relatedCompanies: port：「レポート販売」等の一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: base-4481：「データベース」等の一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: en：「検索エンジン」への言及のみで、結んでいません。
- relatedCompanies: land：「VALUENEXブランド」等の一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: lec：「フレックス制度」等の一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: kohsoku：「高速で収集」等の一般的な語の一部としての一致のみで、結んでいません。
- relatedCompanies: suzuki-6785：取締役の個人名（鈴木氏）との一致のみで、結んでいません。
- relatedCompanies: insight：「インサイト（示唆）」という一般的な語としての一致のみで、結んでいません。
- relatedCompanies: 連結子会社VALUENEX, Inc.（米国、100％出資）は自社の子会社であり、関連企業には含めていません。特定投資株式の保有は「該当事項なし」とされており、政策保有株式による関連付けはありません。
- terms: 助言のみ。【事業の内容】の用語解説にアルゴリズム、ビッグデータ、ASP、概念検索の定義が印字されていますが、既存の用語集で足りるため、用語の追加提案はありません。

## 要確認（status に反映）

- businessModel: 2026年２月１日付で普通株式１株につき３株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第16期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2026年２月１日付で普通株式１株につき３株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第16期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
