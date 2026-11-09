# リケンＮＰＲ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リケンＮＰＲ株式会社 |
| 証券コード | 6209 |
| docID（データを取り出した文書） | `S100YHYP` |
| 原本 docID | `S100YHYP` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHYP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リケンＮＰＲ株式会社 / 6209 / docID S100YHYP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 30 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
npr-riken: 6 件の数値を有報XBRLと照合
有報: リケンＮＰＲ株式会社 有価証券報告書－第3期(2025/04/01－2026/03/31) (docID S100YHYP)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
npr-riken: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「リケンNPR株式会社」が EDINET の提出者名「リケンＮＰＲ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年4月1日付の組織再編による事業持株会社への移行は、businessStructureとhistoryのneedsReviewに記録しました。
- businessStructure: 「その他」は報告セグメントに含まれない事業セグメントのため、売上高の大小にかかわらず最後に並べました。
- industry: 主たる業界は、外部顧客への売上高が最も大きい自動車・産業機械部品事業で決めました。熱エンジニアリング事業は半導体・エレクトロニクス関連向けと有報に明記されているため、半導体を2つ目に付けました。配管・建設機材事業は報告セグメントとして開示されているため、建設を3つ目に付けました。
- relatedCompanies: エンは、「エンジニアリング」の文字の断片一致のため結びませんでした。
- relatedCompanies: ポートは、「ポートフォリオ」の文字の断片一致のため結びませんでした。
- relatedCompanies: コアは、「コア事業」の文字の断片一致のため結びませんでした。
- relatedCompanies: ランドは、「タイランド」の文字の断片一致のため結びませんでした。
- relatedCompanies: キャリアは、「キャリア形成」の文字の断片一致のため結びませんでした。
- relatedCompanies: リードは、「リードし続ける」の文字の断片一致のため結びませんでした。
- relatedCompanies: セキは、「セキュリティ」の文字の断片一致のため結びませんでした。
- relatedCompanies: ゼロは、「ゼロにする」の文字の断片一致のため結びませんでした。
- relatedCompanies: ベースは、「連結ベース」の文字の断片一致のため結びませんでした。
- relatedCompanies: 日新は、断片一致のため結びませんでした。
- relatedCompanies: アスカは、「アグアスカリエンテス」の文字の断片一致のため結びませんでした。
- relatedCompanies: No.1は、「グローバルNo.1サプライヤー」の文字の断片一致のため結びませんでした。
- relatedCompanies: パスは、「パスルアン県」の文字の断片一致のため結びませんでした。
- relatedCompanies: リコーは、「リコール」の文字の断片一致のため結びませんでした。
- relatedCompanies: ベルクは、断片一致のため結びませんでした。
- relatedCompanies: イノベーションは、「イノベーションを創出」の文脈で社名が現れるだけの断片一致のため結びませんでした。
- relatedCompanies: 高速は、「高速大容量化」の文字の断片一致のため結びませんでした。
- relatedCompanies: ウィルは、「ウィルミントン市」の文字の断片一致のため結びませんでした。
- relatedCompanies: 東急は、「三番町東急ビル」の文字の断片一致のため結びませんでした。
- relatedCompanies: 本田技研工業、トヨタ自動車、スズキ、マツダ、いすゞ自動車、日野自動車は、政策保有株式として保有しているだけで、取引関係が述べられていないため結びませんでした。
- relatedCompanies: 大同特殊鋼、大同メタル工業、CKサンエツ、岡谷鋼機、プレス工業、理研計器、サンコール、田中精密工業、ユニバンス、やまびこ、東京鐵鋼は、政策保有株式として保有しているだけで、取引関係が述べられていないため結びませんでした。
- relatedCompanies: 大阪ガス、広島ガス、京葉瓦斯、西部ガスホールディングス、サーラコーポレーションは、政策保有株式として保有しているだけで、取引関係が述べられていないため結びませんでした。
- relatedCompanies: 電気興業は、保有株式を今年度中に売却しており、取引関係が述べられていないため結びませんでした。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ、みずほフィナンシャルグループ、三井住友フィナンシャルグループ、三井住友トラストグループ、第四北越フィナンシャルグループ、武蔵野銀行は、取引金融機関としての保有で、資金調達が理由のため結びませんでした。
- relatedCompanies: SOMPOホールディングス、東京海上ホールディングスは、保険取引に関連する保有で、取引関係が述べられていないため結びませんでした。
- relatedCompanies: みずほリースは、リース取引の向きが印字されていないため結びませんでした。
- relatedCompanies: 明和産業は、子会社の出資者として現れるだけで、当社との取引・提携・資本関係が述べられていないため結びませんでした。
- relatedCompanies: 連結子会社34社はすべて非上場のため結びませんでした。
- relatedCompanies: 持分法適用関連会社6社のうちオーテック以外はすべて非上場のため結びませんでした。
- relatedCompanies: 大株主は信託銀行や金融機関、従業員持株会のため、事業会社の大株主として結べる相手はありませんでした。
- terms: 新たに提案する用語はありません。ピストンリングやカムシャフトなどは本文で説明しています。

## 要確認（status に反映）

- businessStructure: 2026年4月1日付の組織再編により、リケン及び日本ピストンリングの営業・技術開発・コーポレート部門が当社へ移管され、事業部体制の事業持株会社へ移行しました。2026年3月31日現在の事業構成は共同持株会社のものです。
- history: 2026年4月1日付の組織再編により、リケン及び日本ピストンリングの営業・技術開発・コーポレート部門が当社へ移管され、事業部体制の事業持株会社へ移行しました。2026年3月31日現在の事業構成は共同持株会社のものです。
- history: 2026年4月に当社の100%子会社であるリケンコーポレーションオブアメリカ社がヘイスティングスホールディング社の株式を取得し、子会社化しました。2026年3月31日現在の事業構成には含まれていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
