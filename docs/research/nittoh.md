# 株式会社ニットー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ニットー |
| 証券コード | 1738 |
| docID（データを取り出した文書） | `S100YC8S` |
| 原本 docID | `S100YC8S` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC8S.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ニットー / 1738 / docID S100YC8S（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 0 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nittoh: 10 件の数値を有報XBRLと照合
有報: 株式会社ニットー 有価証券報告書－第53期(2025/04/01－2026/03/31) (docID S100YC8S)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nittoh: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社　ニットー(定款上の商号　株式会社 NITTOH)」が EDINET の提出者名「株式会社ニットー」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円印字を百万円に切り捨てて記載した（切り捨ての方針）。セグメント外部売上高の切り捨て後の合計（11,087百万円）は印字の連結売上高（11,088百万円）と１百万円異なるが、印字どおり記載し、差異は切り捨てによるものである。
- businessModel: 当期純利益の前期比18.0％減少は、前期に固定資産の売却による利益を計上した反動である旨がMD&Aに記載されている。本文の利益の流れには金額のみを記載した。
- businessModel: 経営上の目標として売上高前期対比率10％以上などの数値目標が開示されているが、利益率や純資産利益率などの指標を含むため、本文及び戦略には記載しなかった。
- businessModel: 受注工事高や繰越工事高の金額は本文に記載しなかった。
- businessModel: セグメント情報の主要な顧客ごとの情報では、連結売上高の10％以上を占める相手先はないとされている。
- industry: 建設工事、住宅等サービス、ビルメンテナンスの３事業はいずれも建設物の工事・維持管理に関わるため、産業は construction を主産業とした。
- relatedCompanies: 株式会社東急コミュニティーは、ビルメンテナンス事業の販売実績における主な相手先として印字されているが、非上場会社（東急不動産ホールディングス株式会社の子会社）で関連企業候補に含まれず、上場している親会社とは別の法人であるためリンクはせず、事実関係をここに記録した。
- relatedCompanies: 愛知県経済農業協同組合連合会は、住宅等サービス事業の販売実績における主な相手先（同事業の販売実績の23.9％）として印字されているが、協同組合連合会で関連企業候補に含まれないためリンクはせず、事実関係をここに記録した。
- relatedCompanies: 株式会社ナカノコーポレーションは、発行済株式（自己株式を除く。）の26.64％を保有する最大の大株主であるが、当社代表取締役及びその親族が株式を保有する非上場の資産管理会社で関連企業候補に含まれないためリンクはせず、事実関係をここに記録した。
- relatedCompanies: 住化エンバイロメンタルサイエンス株式会社は、大株主の状況に当社株式の1.48％を保有する株主として印字されているが、非上場会社で関連企業候補に含まれず、上場している親会社とは別の法人であるためリンクはしなかった。
- relatedCompanies: 株式会社名古屋銀行の保有株式数の増加は、同行自身の株式分割によるものであり、当社の株式分割ではない。
- relatedCompanies: 連結子会社の株式会社ビルワークは自社グループの構成会社であるため関連企業としてのリンク対象ではなく、事業構造に記載した。
- relatedCompanies: 候補のうち base-4481（自己資本比率等の表記における語句一致）、career（キャリアアップの語句一致）、en（曖昧な語句一致）、friendly（ファミリーフレンドリー企業の語句一致であり、コードリストにもない）は、いずれも当社との取引・提携・資本関係を示す記載がないためリンクしなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
