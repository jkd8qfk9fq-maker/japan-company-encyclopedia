# オービック — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オービック |
| 証券コード | 4684 |
| docID（データを取り出した文書） | `S100YGBS` |
| 原本 docID | `S100YGBS` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGBS.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%BC%E3%83%93%E3%83%83%E3%82%AF

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オービック / 4684 / docID S100YGBS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
obic: 10 件の数値を有報XBRLと照合
有報: 株式会社オービック 有価証券報告書－第59期(2025/04/01－2026/03/31) (docID S100YGBS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
obic: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年4月21日の取締役会決議で自己株式の取得と消却を決議し、2026年5月29日に一部の消却を実施済みです。日常の資本政策のため、確認事項には入れていません。
- businessModel: 「独立系のシステムインテグレーター」という補足は Wikipedia の記事冒頭に基づき、自分の言葉で短く書きました。
- businessStructure: 業務用パッケージソフト事業は持分法適用関連会社で行っているため報告セグメントには含まれておらず、最後尾に置きました。売上高は開示されていないため金額は書きませんでした。
- businessStructure: 商品群ごとの売上高は開示されていないため、children には金額を書きませんでした。
- businessStructure: セグメント間の内部売上高は事業の金額には使わず、外部顧客への売上高で統一しました。
- history: 沿革の表は年月と事象が対になって印字されており、対応づけに問題はありませんでした。
- history: 創業時の資本金額は本文の財務数値の規則のため記載していません。
- industry: 企業情報システムのシステムインテグレーションとシステムサポートを主な事業とするため、it を主たる業界としました。
- relatedCompanies: ポート：一般語・部分一致の誤マッチのため結びませんでした。
- relatedCompanies: エン：ambiguous で、一般語の誤マッチのため結びませんでした。
- relatedCompanies: セキ：ambiguous で、「セキュリティ」の部分一致の誤マッチのため結びませんでした。
- relatedCompanies: イノベーション：一般語の誤マッチのため結びませんでした。
- relatedCompanies: ベース：一般語の誤マッチのため結びませんでした。
- relatedCompanies: コア：ambiguous で、一般語の誤マッチのため結びませんでした。
- relatedCompanies: キング：一般語の誤マッチのため結びませんでした。
- relatedCompanies: 船場：ambiguous で、「南船場」の地名の部分一致の誤マッチのため結びませんでした。
- relatedCompanies: キャリア：一般語の誤マッチのため結びませんでした。
- relatedCompanies: フリー：一般語の誤マッチのため結びませんでした。
- relatedCompanies: レント：一般語の誤マッチのため結びませんでした。
- relatedCompanies: トラスト：コードリストにない（上場でない）ため結びませんでした。
- relatedCompanies: 連結子会社の株式会社オービックオフィスオートメーションは非上場のため、関連企業には結びませんでした。
- relatedCompanies: 大株主の株式会社ＭＮホールディングスは役員の資産管理会社で非上場のため、関連企業には結びませんでした。
- terms: 用語候補： OBIC7シリーズ（統合業務ソフトウェア）、統合基幹業務システム、ワンストップ・ソリューション・サービス、クラウドセンター、SSAE18、SOC1 Type2報告書、SOC2 Type2報告書、情報セキュリティマネジメントシステム（ISMS）認証——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: 2024年10月1日付で普通株式1株につき5株の割合の株式分割を実施済みです。有報の連結経営指標等の株式数に係る数値は、同分割が2022年3月期の期首に行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
