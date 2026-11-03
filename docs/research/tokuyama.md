# トクヤマ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社トクヤマ |
| 証券コード | 4043 |
| docID（データを取り出した文書） | `S100YY70` |
| 原本 docID | `S100YDQ3` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YY70／有効文書 S100YY70（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YY70.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社トクヤマ / 4043 / docID S100YDQ3（id は英語表記「Tokuyama Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokuyama: 10 件の数値を有報XBRLと照合
有報: 株式会社トクヤマ 訂正有価証券報告書－第162期(2025/04/01－2026/03/31) (docID S100YY70)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第162期(2025/04/01－2026/03/31)、docID S100YY70）を有効文書としてこのパックを作った。原本は docID S100YDQ3。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDisclosureOfSustainabilityRelatedFinancialInformationTextBlock・MetricsAndTargetsRespondingToClimateChangeInitiativesForTheTCFDRecommendationsTextBlock・MetricsAndTargetsTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 前期の窓に 訂正有価証券報告書－第161期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tokuyama: 本文の金額 1 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 日本の顧客の割合は地域別売上高（257,591／349,476百万円）から読めること。金額は書いていない。
- businessModel: 純利益は金額を書かず、増減の向きだけ（23,388→22,205百万円）。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の順（化成品→電子先端材料→セメント→ライフサイエンス→環境事業）。「その他」は報告セグメントに含まれない区分なので最後。
- businessStructure: セグメント別の金額は本文の財務数値の規則により書いていない。
- history: 沿革表の全行のうち、事業の成り立ちを示す10件を選んだ。海外現地法人や研究所の新設などは省いた。
- industry: 最大の報告セグメントは化成品のため化学を主とした。電子先端材料セグメントが半導体用多結晶シリコンなどを事業として開示しているので半導体を2つ目にした。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる掲載済み企業が無いため、結んだ相手は無い。
- relatedCompanies: 太平洋セメント: セメント・固化材の国内販売事業の譲渡先（2026年10月1日付の予定）。経営上の取引で、現時点の関係ではなく予定のため結ばない。
- relatedCompanies: 信越化学工業: 多結晶シリコンの顧客と印字されているが、候補一覧に無く同一性を確認できないため結ばない。
- relatedCompanies: DOWAホールディングス: 業務提携先と印字されているが、候補一覧に無く同一性を確認できないため結ばない。
- terms: 用語の候補（助言のみ）: 苛性ソーダ、ソーダ灰、多結晶シリコン、乾式シリカ、窒化アルミニウム、体外診断用医薬品、イオン交換膜、生コンクリート、固化材。

## 要確認（status に反映）

- businessModel: セメント・固化材の国内販売事業の譲渡（2026年10月1日付の予定）は提出後に期日が来る予定事項。完了したかは未確認。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
