# ユーザーローカル — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ユーザーローカル |
| 証券コード | 3984 |
| docID（データを取り出した文書） | `S100Z2OT` |
| 原本 docID | `S100Z2OT` |
| 提出日（原本） | 2026-09-16 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z2OT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ユーザーローカル / 3984 / docID S100Z2OT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
user-local: 10 件の数値を有報XBRLと照合
有報: 株式会社ユーザーローカル 有価証券報告書－第21期(2025/07/01－2026/06/30) (docID S100Z2OT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
user-local: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標の注記1〜4（連結財務諸表を作成していないこと、関連会社がないこと、従業員数の数え方、株価の市場表示）はいずれも表示上の事項のため、financialNotes には書いていません。会計基準の変更・修正再表示・株式分割の印字はありません（前期有報との照合は全6系列で差異なし）。
- businessModel: 自己株式の取得と配当は資本政策の手続きのため、本文には金額を書いていません。
- businessModel: 経営方針は定性的に要約し、数値の目標は書いていません。
- businessStructure: 単一セグメント（データクラウド事業）のため、製品・サービスごとの外部顧客への売上高は有報で記載が省略されており（単一区分が売上高の90％超）、children には金額を書いていません。
- businessStructure: 収益認識関係の注記にある直接販売・代理店経由販売の区分は販売方法の区分であり、製品別の内訳ではないため、children の金額には使っていません。
- businessStructure: 主要な設備は本社（東京都港区）のみで、単一セグメントのため事業との対応は本社設備として一体です。帳簿価額は書いていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先名の印字はありません。
- history: 沿革表は2015年５月・2016年11月の年月セルが事象文と分かれて印字される崩れた表です。年月セル2件と事象文2件（「Media Insight」リリース、東京都港区への本社移転）で数が一致したため、行順で対応づけました（2015年＝Media Insight リリース、2016年＝港区への本社移転）。
- history: 本社移転（2011年 渋谷区、2013年 目黒区、2016年 港区、2021年 品川区、2025年 港区）は歴史の項目から省き、ここに列挙しました。
- history: 資本金の金額は歴史に書いていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、単一セグメントのデータクラウド事業（ビッグデータ・AIを活用したSaaS型プラットフォームサービス）がITサービスに直接当たるため it としました。
- industry: Media Insight はメディア向けの解析サービスですが、単一セグメントの一部であり、同社自身がメディア事業を行うものではないため、media は付けていません。DEIの別記事業はCTEです。閉じた分類に直接当たるため、暫定分類やtaxonomyGapsはありません。
- relatedCompanies: port: 「サポート」の部分文字列の一致のみで、ポート株式会社そのものへの言及ではありません。
- relatedCompanies: en: 「AIエンジニア」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: rhythm: 「アルゴリズム」等の部分文字列の一致のみです。
- relatedCompanies: land: 「ブランド」の部分文字列の一致のみです。
- relatedCompanies: insight: 自社製品名「User Insight」の一部の一致であり、株式会社インサイトそのものへの言及ではありません。
- relatedCompanies: path: 「キャリアパス」の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: trust: 印字は日本マスタートラスト信託銀行株式会社（信託口）であり純投資の信託口です。また候補自体が現在のコードリストにありません。
- relatedCompanies: base-4481: 「データベース」の部分文字列の一致のみです。
- relatedCompanies: canon-marketing-japan: 売掛金の相手先別内訳に金額とともに載るのみで、取引関係を述べる印字ではないため、結んでいません。
- relatedCompanies: career: 「キャリアパス」の部分文字列の一致のみです。
- relatedCompanies: freee: 「リスクフリー・レート」の部分文字列の一致のみです。
- relatedCompanies: itsumo: 「いつも」という一般語の一致のみです。
- relatedCompanies: kao: 売掛金の相手先別内訳に載るのみで、取引関係を述べる印字ではないため、結んでいません。
- relatedCompanies: scroll: 「スクロール到達度」という一般語の一致のみです。
- relatedCompanies: secure: 「セキュアな環境」という一般語の一致のみです。
- relatedCompanies: shiseido: 印字されているのは資生堂ジャパン株式会社であり、株式会社資生堂とは別の法人です。また売掛金の内訳表のみの掲載です。
- relatedCompanies: vision: 「ビジョン」という一般語の一致のみです。
- relatedCompanies: will: 「コンピュータウィルス」の部分文字列の一致のみです。
- relatedCompanies: 候補にないため結んでいないもの: 売掛金の相手先別内訳に載る株式会社ヒューマネージ、福泉株式会社、資生堂ジャパン株式会社は候補にありません。大株主の株式会社キーバリュー（2026年6月30日現在1.27％）も候補になく、取引の印字もありません。沿革で2013年にシステム提供を開始したヤフー株式会社とニフティ株式会社は候補にありません。当社には子会社・関連会社はありません。
- terms: 助言のみ: 用語候補として ビッグデータ、人工知能（AI）、SaaS、生成AI、ヒートマップ、チャットボット、LLM（大規模言語モデル）、クチコミ分析、Web接客 などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
