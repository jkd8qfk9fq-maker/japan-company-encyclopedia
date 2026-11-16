# 株式会社杉村倉庫 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社杉村倉庫 |
| 証券コード | 9307 |
| docID（データを取り出した文書） | `S100YEZX` |
| 原本 docID | `S100YEZX` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEZX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社杉村倉庫 / 9307 / docID S100YEZX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sugimura-warehouse: 10 件の数値を有報XBRLと照合
有報: 株式会社杉村倉庫 有価証券報告書－第163期(2025/04/01－2026/03/31) (docID S100YEZX)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sugimura-warehouse: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記は、潜在株式調整後1株当たり当期純利益について希薄化効果を有する潜在株式が存在しないため第161期以降記載していない旨の表示事項のみであり、financialNotesには入れず本warningsに記録した。
- businessModel: セグメント別の外部顧客への営業収益は千円単位では合計が印字の合計と一致するが、百万円への切捨てでは部分合計（9,581＋1,342＋318＝11,241百万円）が印字の営業収益11,242百万円と1百万円異なる。印字どおりに記載し、ここに記録した。
- businessModel: MD&Aに記載されたその他の事業の内訳（ゴルフ練習場と売電事業の各収入額）は、セグメント注記のその他の事業の外部顧客への営業収益と単純合計が一致しないため、本文には内訳の金額を書かず、セグメント注記の金額のみを用いた。
- businessModel: 主要な顧客である富士フイルムロジスティックス株式会社は非上場であり百科事典の対象候補にもないため、関連企業としてはリンクせず、顧客として本文に社名のみを記載した。富士フイルムホールディングスは別法人であり代替リンクはしていない。
- businessModel: 中期経営計画の数値目標は利益指標を含むため、本文・戦略には数値目標を書かず、存在のみを本warningsに記録した。MD&Aの利益項目の金額・理由は本文に書いていない。
- businessStructure: 旧スキーマのためsuppliersキーは付けず、運送の一部を連結子会社の杉村運輸株式会社へ委託している事実はbusinessStructureの本文に記載した。
- businessStructure: 主要な顧客の富士フイルムロジスティックス株式会社（物流事業）は非上場で百科事典の対象候補にないため関連企業リンクはせず、businessModelの顧客の記述に社名のみを記載した。
- businessStructure: その他の関係会社の野村プロパティーズ株式会社は当社株式の46.15％を保有し、当社が同社の受託貨物の保管業務を行う関係にあるが、非上場で百科事典の対象候補にないためリンクせず本warningsに記録した。親会社の野村ホールディングスはrelatedCompaniesでリンクしている。
- businessStructure: 連結子会社の杉村運輸株式会社と杉村興産株式会社は自社の子会社であるため関連企業リンクの対象外とした。
- history: 沿革の記載のうち、本店・営業所の移転や倉庫の増設、上海事務所の開設（1994年）と廃止（2015年）、梅田営業所の廃止（1996年）などは主要な転機に絞るため落とし、本warningsに記録した。
- history: 資本金の金額は沿革・本文のいずれにも書いていない。月単位のキーは付けていない。
- history: Wikipediaの記事は存在したが、沿革は有報の記載のみに基づき作成し、Wikipediaの情報は用いていない。
- industry: 主たる業界はtransportationとした。報告セグメントの物流事業（倉庫業者の営む貨物保管・荷役荷捌と貨物自動車運送）は外部顧客への営業収益9,581百万円で全体の大半を占める。
- industry: 不動産事業は土地・家屋・駐車場等の賃貸を行う独立した報告セグメントとして外部顧客への営業収益1,342百万円が開示されているため、real-estateを2つ目に付けた。中央倉庫と同じ事情であり、閉じた分類に適合するためtaxonomyGapsは付けなかった。
- industry: その他の事業（ゴルフ練習場・売電事業、外部顧客への営業収益318百万円）は規模が小さく、適合する区分もないため副次分類は付けなかった。
- relatedCompanies: 株式会社住友倉庫は大株主の状況に1.0％の保有が記載されるのみで、取引・提携の記載がないためリンクしなかった。
- relatedCompanies: 株式会社りそな銀行は大株主（4.6％）として記載されるが、候補のりそなホールディングスとは別法人であり、取引・提携の記載もないためリンクしなかった。
- relatedCompanies: 野村プロパティーズ株式会社はその他の関係会社（当社株式の46.15％を保有、当社は同社の受託貨物の保管業務を行う）だが、非上場で百科事典の対象候補にないためリンクせず記録のみとした。親会社の野村ホールディングスで代替はしていない（同社は親会社として別途リンク）。
- relatedCompanies: 主要な顧客の富士フイルムロジスティックス株式会社は非上場で対象候補になく、富士フイルムホールディングスへの代替リンクも行わなかった。
- relatedCompanies: 機械抽出候補のking、zero、land、portはいずれも一般語・部分文字列の一致（ワーキンググループ、残存価額ゼロ、ポートアイランド営業所等）であり、関連企業ではないためリンクしなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
