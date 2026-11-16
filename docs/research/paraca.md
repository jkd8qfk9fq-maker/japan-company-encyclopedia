# パラカ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | パラカ株式会社 |
| 証券コード | 4809 |
| docID（データを取り出した文書） | `S100XB3E` |
| 原本 docID | `S100XB3E` |
| 提出日（原本） | 2025-12-19 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XB3E.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | パラカ株式会社 / 4809 / docID S100XB3E（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
paraca: 10 件の数値を有報XBRLと照合
有報: パラカ株式会社 有価証券報告書－第29期(2024/10/01－2025/09/30) (docID S100XB3E)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
paraca: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて有報の百万円印字をそのまま引用した。形態別販売実績の合計17,629百万円と売上高17,630百万円の1百万円の差は有報の丸めによるもので、印字どおりとした。
- businessModel: 当作業ツリーのスキーマに仕入先（suppliers）の項目がないため、businessModelには仕入先を記載していない。駐車場機器メーカーである日本信号株式会社との関係は関連企業に記録した。
- businessModel: 重視する経営指標のうち「売上総利益額及び売上総利益率」の目標値は定められていないため、数値は書いていない。
- businessModel: 重視する経営指標の正式な名称の１つは「売上総利益額及び売上総利益率」であるが、禁止語を含むため strategy.disclosed では「駐車場の収益性を端的に表す指標」と言い換え、正式名称は本警告に記録した。
- businessStructure: 単一セグメントであり、報告セグメントは存在しない。事業の子供区分は【事業の内容】の運営形態別の分類（賃借駐車場・保有駐車場・その他）とし、金額は経営者による分析における駐車場形態ごとの販売実績の印字を用いた。
- businessStructure: 形態別販売実績の合計は17,629百万円で、売上高17,630百万円と1百万円異なる。有報の印字をそのまま引用したもので、丸めによる差である。
- history: 設立時の資本金の金額は沿革に書かない規則のため落とした。
- history: 営業所・支店の開設、本社移転等の行は、事業の転機となるものに絞って落とした。
- industry: 主たる業界は、売上高の全額を占める時間貸駐車場の開拓・運営管理事業に基づき、土地の賃借・保有と施設運営に最も近い real-estate を暫定とし、taxonomyGaps に記録した。
- relatedCompanies: sbi-holdings（SBIホールディングス）は【大株主の状況】に所有割合3.85％で載るが、金融持株会社による投資保有であり、【関係会社の状況】の区分にも当たらず、取引関係の記載もないため結ばなかった。
- relatedCompanies: corona（コロナ）は「新型コロナウイルス感染症」の文言への一致のみで、株式会社コロナへの言及ではないため結ばなかった。
- relatedCompanies: king（キング）は「コインパーキング」の文言中の部分一致のみのため結ばなかった。
- relatedCompanies: port（ポート）は「ポートフォリオ」の文言中の部分一致のみのため結ばなかった。
- relatedCompanies: ray（レイ）は「レイアウト」の文言中の部分一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: ishin（イシン）は文言中の部分一致のみで、イシン株式会社への言及ではないため結ばなかった。
- relatedCompanies: taya（田谷）は「世田谷区」の地名との部分一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: trust（トラスト）は「日本マスタートラスト信託銀行株式会社（信託口）」の名称の一部への一致で、株式会社トラストへの言及ではなく、コードリストにもないため結ばなかった。信託銀行の信託口は結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社（信託口）及び株式会社日本カストディ銀行（信託口）は信託口であり結ばなかった。
- terms: 用語の助言は行いませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] パラカ株式会社の主たる業界（時間貸駐車場の開拓・運営管理。2025年9月期売上高17,630百万円の全額が駐車場の開拓及び運営管理に関連する単一事業） → 提案: サービス業（駐車場運営）。時間貸駐車場の運営管理は東証の業種区分ではサービス業にあたる役務の提供だが、閉じた分類（INDUSTRY_IDS）にサービス業・駐車場運営の区分が無い。土地の賃借・保有と施設の運営が事業の基盤であるため、最も近い real-estate を暫定の主分類とした。
