# ナカノフドー建設 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ナカノフドー建設 |
| 証券コード | 1827 |
| docID（データを取り出した文書） | `S100YHMT` |
| 原本 docID | `S100YHMT` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHMT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ナカノフドー建設 / 1827 / docID S100YHMT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nakano: 10 件の数値を有報XBRLと照合
有報: 株式会社ナカノフドー建設 有価証券報告書－第84期(2025/04/01－2026/03/31) (docID S100YHMT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nakano: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画「中計86」の数値目標のうち、営業利益・純利益の目標は本文ルールのため記載せず、売上高と海外事業比率の目標のみを記載しました。
- businessModel: 前期有報との修正再表示チェックは重複する8行すべてが一致しました。表示方法の変更による前連結会計年度の組替えは特別利益・特別損失の表示区分のみで、financialNotes に記録しました。
- businessModel: 個別の完成工事高（建築70,193百万円・土木2,462百万円）は提出会社単体の数値のため、事業の金額には用いていません。
- businessStructure: 報告セグメントは事業×地域の4区分（建設事業・不動産事業 × 日本・東南アジア）で、並び順はセグメント情報の外部顧客への売上高の大きい順としました。「その他の事業」は報告セグメントに含まれないため最後尾に置きました。
- businessStructure: セグメント利益は本文ルールのため記載していません。
- businessStructure: 不動産事業（東南アジア）の外部顧客への売上高は4百万円と印字どおりに記載しました。
- history: 沿革は有報の印字の順に、主要な出来事を選んで記載しました。支店・営業所の改組などの細目は省略しました。
- industry: 主たる業界は、連結売上高の約99％を占める建設事業から construction としました。
- industry: 不動産事業（日本・東南アジア合計1,368百万円、連結売上高の約1％）は売上構成がごく小さいため real-estate は付けませんでした。
- relatedCompanies: エン（en）・ビジョン（vision）・キャリア（career）・ポート（port）・ベース（base-4481）・コア（core）・パス（path）: 一般語・部分一致の誤マッチ（ワークエンゲージメント、長期ビジョン、建設キャリアアップシステム、サポート、営業利益ベース、サクラクレパス等）のため不採用としました。
- relatedCompanies: NGK（ngk）・エスペック（espec）・丸井グループ（marui-group）・日東紡績（nitto-boseki）・オークマ（okuma）・ヱスビー食品（s-and-b-foods）・住友電気工業（sumitomo-electric-industries）・スズケン（suzuken）・タダノ（tadano）・横河電機（yokogawa-electric）・アシックス（asics）・富士フイルムホールディングス（fujifilm-holdings）・花王（kao）・マックス（max）・なとり（natori）・日本ピグメントホールディングス（nippon-pigment-holdings）・小田急電鉄（odakyu-electric-railway）・王子ホールディングス（oji-holdings）・ピックルスホールディングス（pickles-holdings）・ライト工業（raito-kogyo）・セブン＆アイ・ホールディングス（seven-and-i-holdings）・信越化学工業（shin-etsu-chemical）・資生堂（shiseido）・テルモ（terumo）: 特定投資株式の保有目的が「建設事業において取引実績があり、今後も取引案件が見込まれるため保有する」などの定型句のみで、その相手についての具体的な取引・提携の印字がないため不採用としました。
- relatedCompanies: 三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group）・みずほフィナンシャルグループ（mizuho-financial-group）・野村ホールディングス（nomura-holdings）・SOMPOホールディングス（sompo-holdings）・東京海上ホールディングス（tokio-marine-holdings）・福島銀行（the-fukushima-bank）・京葉銀行（the-keiyo-bank）: 金融機関で、資金調達・保険取引の文脈にのみ現れるため不採用としました。
- relatedCompanies: ミヨシ油脂（miyoshi-oil-and-fat）: 次期繰越工事の発注者（KMS新工場建設工事）として工事名に現れますが、継続的な取引・提携を述べる印字はなく、個別の工事1件のみのため不採用としました。
- relatedCompanies: ブリヂストン（bridgestone）: 完成工事の発注者（下関工場第5工場新築工事）として現れるのみで、継続的な取引・提携の印字がないため不採用としました。
- relatedCompanies: 住友理工（sumitomo-riko）: 工事名の発注者として現れるのみで、候補の listing もコードリストにないため不採用としました。
- relatedCompanies: 関係会社の状況に載る連結子会社15社・持分法適用関連会社3社・その他の関係会社（関東興業株式会社）はいずれも非上場で、有価証券報告書を提出している会社はなく、関連企業候補に含まれないため結んでいません。
- terms: 用語候補： 中計86（同社の中期経営計画（2026年3月期～2028年3月期）の名称で、基本方針は「国内建設事業のさらなる収益性改善」と「海外建設事業の拡大」）、未成工事支出金（建設業で、施工中の工事に要した費用を資産として計上する科目）、完成工事未収入金（完成・引渡し済みの工事のうち未収の請負代金）、PFI事業（民間資金や経営能力を活用して公共施設等の整備・運営を行う事業）——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
