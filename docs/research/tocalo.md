# トーカロ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | トーカロ株式会社 |
| 証券コード | 3433 |
| docID（データを取り出した文書） | `S100YOZB` |
| 原本 docID | `S100YFML` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YOZB／有効文書 S100YOZB（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YOZB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | トーカロ株式会社 / 3433 / docID S100YFML（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tocalo: 10 件の数値を有報XBRLと照合
有報: トーカロ株式会社 訂正有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YOZB)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":8052000000,"latestFiling":8051000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":12561000000,"latestFiling":12558000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":81676000000,"latestFiling":81683000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":65731000000,"latestFiling":65730000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第75期(2025/04/01－2026/03/31)、docID S100YOZB）を有効文書としてこのパックを作った。原本は docID S100YFML。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはAuditorsResponseKAMConsolidatedTextBlock・DescriptionIncludingReasonKAMConsolidatedTextBlock・IndependentAuditorsReportConsolidatedTextBlock・KeyAuditMattersConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
tocalo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YOZB、2026年７月６日提出）です。原本（S100YFML）との差異はdifferenceCount 0で、財務の数値も本文も同一であり、異なるのは監査報告書・監査上の主要な検討事項に関するテキストブロックのみ（record-only）であることを確認したため、needsReviewにはせず、ここに検証結果を記録しました。情報源は訂正有報のものとしています。
- businessModel: 前期有報との修正再表示チェックでは、第74期（2025年３月期）の行にのみ差異があり（親会社株主に帰属する当期純利益8,052百万円から8,051百万円への変更など）、その理由は主要な経営指標等の注３・注４に印字されているためfinancialNotesに記録し、登録は当期有報の数値を用いました。
- businessModel: 中期経営計画「ＴＯＣＡＬＯ2030」の数値目標（連結売上高900億円等）は将来の目標値であり実績ではないため本文には転記せず、戦略は定性的に要約しました。あわせて印字されている利益・配当に関する目標値も転記していません。
- businessStructure: 当社グループは当社、連結子会社７社、非連結子会社２社で構成されます。非連結子会社のPT.TOCALO Surface Technology IndonesiaとTOCALO Surface Technology (Thailand）Co., Ltd.は「その他」の区分で現地の日系鉄鋼メーカー向けの表面改質加工を行っており、報告セグメントの子会社としては記載していません。
- businessStructure: TOCALO USA-Arizona LLCの設立（2025年９月）と、タイの関連会社の子会社化・商号変更（2024年７月）はいずれも期中の変動で、2026年３月31日現在の体制に反映済みです。
- businessStructure: 溶射加工（単体）の分野別（半導体・ＦＰＤ製造装置用部品、産業機械用部品、鉄鋼用設備部品、その他）の金額はMD&Aの生産・販売実績表にのみ印字されているため、子事業の説明には金額を付けていません。
- history: 沿革は、有報の記載に従い実質上の存続会社である旧トーカロ株式会社の歩みを中心に記載しました。設立時等の資本金の金額は転記していません。
- history: 沿革の注記に印字された2026年４月の東京工場鈴身事業所・東京工場行田事業所の改称は、当社内の事業所名の変更であり、グループの体制やセグメントに変更はないため、ここに記録するにとどめました。
- industry: 主たる業界は、産業機械部品等への表面改質加工の受託が事業の中核であるため machinery としました。
- industry: 半導体・ＦＰＤ製造装置用部品への加工が最大の分野であり、中期経営計画でも半導体・ＦＰＤ分野の飛躍を柱としているため、semiconductors を副業種として付けました。
- relatedCompanies: アプライド・マテリアルズグループは主要な顧客（2026年３月期の販売実績4,258百万円）ですが、米国のアプライド・マテリアルズのグループであり百科事典に登録された企業ではないため、リンクはせず主要な顧客としてindustryPositionに記載しました。候補の applied（アプライド株式会社）は同名の別会社であり、リンクしていません。
- relatedCompanies: 特定投資株式及びみなし保有株式の銘柄ごとの情報は「該当事項はありません」と印字されており、株式保有を根拠とする関連付けは行っていません。
- relatedCompanies: 候補の base-4481（ベース）は「実力ベース」等の語の一部、vision（ビジョン）は経営計画のビジョンの語、zero（ゼロ）は「ネットゼロ」の語、career（キャリア）はキャリア開発の語、en（エン）は語の一部、seki（セキ）、ray（レイ）、path（パス）、ic（IC）、core（コア）、daiwa（大和）、kohsoku（高速）はいずれも一般語・部分一致であり、取引・提携・資本関係の記載がないためリンクしていません。
- relatedCompanies: 候補の trust（トラスト）はコードリストにない相手であり、innovation（イノベーション）、port（ポート）、aeon（イオン）、corona（コロナ）、freee（フリー）、like（ライク）、mitsubishi-ufj-financial-group（三菱ＵＦＪフィナンシャル・グループ）、rix（リックス）、ishin（イシン）についても、有報に当該企業との取引・提携・資本関係を述べる記載がないためリンクしていません。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の【事業の内容】の記載に基づきます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] トーカロの主たる業界 → 提案: 表面処理・コーティング。主事業は溶射を中心とする表面改質加工の受託であり、閉じた分類に表面処理・コーティングに合う値がないため、産業部品の加工に最も近い machinery を暫定的な主たる業界としました。
