# リケンテクノス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リケンテクノス株式会社 |
| 証券コード | 4220 |
| docID（データを取り出した文書） | `S100Y9PN` |
| 原本 docID | `S100Y9PN` |
| 提出日（原本） | 2026-06-10 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y9PN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リケンテクノス株式会社 / 4220 / docID S100Y9PN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
riken-technos: 10 件の数値を有報XBRLと照合
有報: リケンテクノス株式会社 有価証券報告書－第97期(2025/04/01－2026/03/31) (docID S100Y9PN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
riken-technos: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全系列で一致しており、変則決算や会計基準の変更もないため、financialNotes は空にしました。
- businessModel: 中期経営計画には「稼ぐ力」の伸長などの方針が印字されていますが、利益の金額や投資の語にあたる目標は本文の規則のため書いていません。
- businessModel: 強み（competitiveAdvantage）は、会社自身の説明として切り分けられる印字が経営方針に見当たらないため省きました。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順です。「その他」は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: 製品ごとの金額は開示されていないため、子供区分には金額を書いていません。
- businessStructure: 「その他」の外部顧客への売上高は、セグメント情報に34,682千円と千円単位で印字されていますが、本文に金額として記載すると照合できないため、説明には金額を書いていません。
- businessStructure: 主要な設備の状況では、埼玉工場・三重工場が複数セグメントにまたがって印字されているため、拠点と事業の対応は結びつけていません。
- history: 沿革表は年月と事象が対応して印字されており、主な出来事を選んで収録しました。
- history: 1951年の設立のくだりには資本金の金額が印字されていますが、本文の規則のため金額は書いていません。
- industry: 主たる業界は、全セグメントに共通する合成樹脂加工の事業に基づき、閉じた分類の chemicals（化学）を選びました。
- relatedCompanies: 信越化学工業（shin-etsu-chemical）: 大株主でもありますが、特定投資株式に原材料等の仕入先と取引の向きが印字されているため supplier としました。
- relatedCompanies: 三井物産・三菱商事・丸紅: 大株主の状況に載る事業会社であり、特定投資株式にも海外事業におけるパートナーと印字されているため major-shareholder とし、説明に協業の事実を書きました。
- relatedCompanies: 株式会社ADEKA: 特定投資株式に原材料等の仕入先として印字がありますが、related-candidates.json の候補に含まれないため結びませんでした。
- relatedCompanies: JMACS株式会社: 特定投資株式に製品の販売先として印字がありますが、related-candidates.json の候補に含まれないため結びませんでした。
- relatedCompanies: みずほフィナンシャルグループ（mizuho-financial-group）: 主要金融機関として取引の円滑化を図るための保有であり、資金調達に関わる金融機関のため結びませんでした。
- relatedCompanies: りそなホールディングス（resona-holdings）: 主要金融機関として取引の円滑化を図るための保有であり、資金調達に関わる金融機関のため結びませんでした。
- relatedCompanies: 三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）: 主要金融機関として取引の円滑化を図るための保有であり、資金調達に関わる金融機関のため結びませんでした。
- relatedCompanies: 横浜フィナンシャルグループ（yokohama-financial-group）: 主要金融機関として取引の円滑化を図るための保有であり、資金調達に関わる金融機関のため結びませんでした。
- relatedCompanies: SOMPOホールディングス（sompo-holdings）: 当社グループ全体での損害保険の契約先であり、保険取引の円滑化が保有の理由のため結びませんでした。
- relatedCompanies: インフロニア・ホールディングス（infroneer-holdings）: 当事業年度に全株式を売却済みで、現在は株式を保有しておらず、取引関係の印字もないため結びませんでした。
- relatedCompanies: 理研ビタミン（riken-vitamin）: 当事業年度に全株式を売却済みで、現在は株式を保有しておらず、取引関係の印字もないため結びませんでした。
- relatedCompanies: 三井化学（mitsui-chemicals）: 沿革に2012年の三井化学ファブロ株式会社（当時の同社子会社）の全株式取得が印字されるのみで、現在の取引関係の印字がないため結びませんでした。
- relatedCompanies: 岡部（okabe）: 沿革の「岡部工場」は当社の工場の名称であり、岡部株式会社との関係の印字がないため結びませんでした。
- relatedCompanies: エン（en）・ポート（port）・ビジョン（vision）・キャリア（career）・ベース（base-4481）・コア（core）・高速（kohsoku）・ランド（land）・レック（lec）・セキ（seki）・リコー（ricoh）: 「エンゲージメント」「ポートフォリオ」「長期ビジョン」「営業利益ベース」「高速包装機」「IPランドスケープ」「リコール」など一般語や製品名の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: トラスト（trust）: 印字は日本マスタートラスト信託銀行（信託口）で別法人であり、コードリストにもないため結びませんでした。
- terms: 用語候補: コンパウンド（樹脂に添加剤などを配合した成形材料）、エラストマーコンパウンド（弾性を持つ樹脂のコンパウンド）、RIKEBIO（バイオマス原料を使用している製品のシリーズ）、ものづくり統括本部（2025年度に新設された、技術・製造・品質管理・購買を一体とする組織）。いずれも助言のみで、用語の登録は行いません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
