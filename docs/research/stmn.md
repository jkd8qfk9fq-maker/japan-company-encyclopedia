# スタメン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社スタメン |
| 証券コード | 4019 |
| docID（データを取り出した文書） | `S100XTWU` |
| 原本 docID | `S100XTWU` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTWU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社スタメン / 4019 / docID S100XTWU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
stmn: 8 件の数値を有報XBRLと照合
有報: 株式会社スタメン 有価証券報告書－第10期(2025/01/01－2025/12/31) (docID S100XTWU)
前期有報との比較: 18 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
stmn: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標の注記3は2022年12月期と同一年の注記のため、全文をここに記録します（financialNotes には同一年で最初の注記1のみが残ります）: 「「収益認識に関する会計基準」（企業会計基準第29号　2020年３月31日）等を第７期の期首から適用しており、第７期以降に係る主要な経営指標等については、当該会計基準等を適用した後の指標等となっております。」
- businessModel: 経営指標の注記2（従業員数は就業人員であり、臨時雇用者数は年間平均人員であること）は表示上の事項のため、financialNotes には書いていません。株式分割の印字はありません。前期有報との修正再表示の照合は全6系列で差異なしでした。
- businessModel: 抽出された本文に重要な後発事象の記載はなく、提出後の構造的な事象は確認できませんでした。重要な契約等は「該当事項はありません」です。
- businessModel: 経営方針が重視する経営指標（売上高、営業利益）や年間経常収益の目標などの数値目標は、本文や perspectives には書かず、定性的に要約しています。MD&Aの段階利益の金額や理由、キャッシュ・フローの金額、配当などの資本政策の金額は書いていません。
- businessStructure: 連結子会社は株式会社STAGE（人材紹介事業）と株式会社スタジアム（コミュニティエンゲージメント事業）の2社、非連結子会社は株式会社Hypernovaの1社です。株式会社STAGEの人材紹介事業は【事業の内容】のサービス区分には含まれず、独立した金額の開示もないため、独立した事業にはしていません。
- businessStructure: 設備は、提出会社の名古屋オフィス・東京オフィスと株式会社スタジアムの本社で、いずれも単一セグメントに属し、事業との対応は印字されていません。帳簿価額は書いていません。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略しています。新規顧客の獲得は自社の営業活動のほか、パートナー（業界特化型コンサル企業、採用サービスの営業代理店、金融機関、芸能事務所など）からの顧客紹介があり、成約時は月額利用料等の一部を販売手数料として継続的に支払うことが【事業の内容】に印字されています（個別のパートナー名は印字されていません）。
- history: 沿革表は年月と事象が一体で印字されており、対応づけの問題はありません。金額のある項目は書いていません。
- history: 沿革のうち次の項目は項目にしていません: 2016年の「TUNAG」開発開始、2017年の東京支社設立・本社移転、2017年の第三者割当増資（資本金額に触れるため）、2018年の大阪支社設立・東京支社移転、2019年の「TUNAG」グローバル版の提供開始、2021年の関東拠点の鎌倉支社への移転、2022年の本社移転、2023年の株式会社 QualityStart の設立と鎌倉支社の東京支社への拡大移転、2024年の株式会社 Hypernova への商号変更。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、単一セグメントのエンゲージメントプラットフォーム事業（SaaS型のプラットフォームサービスの提供）がITサービスに直接当たるため it としました。
- industry: 「TUNAG」は人事領域向けのソフトウェアですが、同社は人材サービスそのものではなくソフトウェアを提供する会社であるため、human-resources は付けていません。「FANTS」はコミュニティ運営者向けのプラットフォームであり、同社自身がメディア事業を行うものではないため、media は付けていません。DEIの別記事業はCTEです。閉じた分類に直接当たるため、暫定分類やtaxonomyGapsはありません。
- relatedCompanies: en: 「エンゲージメント」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: seki: 「セキュリティ」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: port: 「レポート」「サポート」等の部分文字列の一致のみです。
- relatedCompanies: lec: 「フレックス制度」等の部分文字列の一致のみです。
- relatedCompanies: step: 「ステップ」という一般語の一致のみです。
- relatedCompanies: land: 「ブランド」等の部分文字列の一致のみです。
- relatedCompanies: rent: 「タレント」等の部分文字列の一致のみです。
- relatedCompanies: vision: 「グループビジョン」等の一般語の一致のみです。
- relatedCompanies: base-4481: 「データベース」等の部分文字列の一致のみです。
- relatedCompanies: cover: 「カバーする」という一般表現の一致のみです。
- relatedCompanies: cyberbuzz: 経営方針で市場規模の出典として引用されているだけで、取引・提携・資本関係の記載はありません。
- relatedCompanies: imura-and-co: 「タイムライン」等の部分文字列の一致のみです。
- relatedCompanies: king: 「ランキング」等の部分文字列の一致のみです。
- relatedCompanies: 候補にないため記録します: 大株主は個人、創業者関係の資産管理会社、証券会社、信託銀行のみで、候補にある事業会社との取引・提携・資本関係の印字はありません。特定投資株式は保有していません（株式の保有状況は「該当事項はありません」）。自社の子会社（株式会社STAGE、株式会社スタジアム、株式会社Hypernova）は結んでいません。
- terms: 助言のみ: 用語候補として エンゲージメント、SaaS、サブスクリプション、カスタマーサクセス、社内制度、エンゲージメントサーベイ、MRR（月額経常収益）、ARR（年間経常収益）、HR Tech、オンラインサロン などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
