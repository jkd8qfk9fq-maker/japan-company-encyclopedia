# 伯東 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 伯東株式会社 |
| 証券コード | 7433 |
| docID（データを取り出した文書） | `S100YI3S` |
| 原本 docID | `S100YI3S` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YI76, S100YI70, S100YI6W, S100YI6R, S100YI66（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI3S.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 伯東株式会社 / 7433 / docID S100YI3S（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 5 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hakuto: 10 件の数値を有報XBRLと照合
有報: 伯東株式会社 有価証券報告書－第74期(2025/04/01－2026/03/31) (docID S100YI3S)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第73期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第72期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第71期(2022/04/01－2023/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第70期(2021/04/01－2022/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第69期(2020/04/01－2021/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
hakuto: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 第69～73期の訂正有価証券報告書が5件提出されていますが、修正再表示チェックは重複年度の全行で一致し、当期の5年間の数値に修正再表示はないため、financialNotesには書いていません。
- businessModel: 決算期の変更や変則決算はなく、修正再表示チェックも全行一致のため、financialNotesは空です。
- businessModel: 中期経営計画の定量目標のうち、売上高の目標のみを記載し、利益率などの目標値は文章規則により省きました。
- businessStructure: その他の事業の売上高は、セグメント間の内部売上高406百万円を含むセグメント計では48億53百万円ですが、外部顧客への売上高である44億46百万円を記載しました。
- businessStructure: ケミカル事業は、当連結会計年度より「工業薬品事業」から名称を変更しています。
- history: 沿革の後半は年月と事象文が分かれた崩れた表で、年月18件に対し事象19件のため、行順で対応づけました。2026年2月はRabyte Pte. Ltd.とRabyte Edge Pvt. Ltd.の2件の出来事に対応し、両社とも2026年2月に連結子会社化したことは経営者による分析の記載とも一致します。
- industry: 電子部品や電子・電気機器の販売が主たる事業で、東京証券取引所の業種分類でも卸売業に属するため、trading を主たる業界としました。半導体デバイスの販売を事業として開示しているため、semiconductors を2つ目に付けました。ケミカル事業は売上高の約6％のため、chemicals は付けていません。
- relatedCompanies: サンエー技研株式会社は持分法適用関連会社ですが、候補のサンエー（2659）は株式会社サンエーで別会社のため結びませんでした。サンエー技研は非上場のため結べません。
- relatedCompanies: 高千穂交易は保有目的が業界情報の収集等で営業取引以外の効果のみ、株式数も100株のため結びませんでした。
- relatedCompanies: 日立製作所は当事業年度に全ての株式を売却済みのため結びませんでした。
- relatedCompanies: Pfeiffer Vacuum GmbH、FIT Hon Teng Ltd、ISA RIBERは海外法人で掲載企業リストにないため結びませんでした。
- relatedCompanies: 連結子会社17社はすべて海外・非上場のため結びませんでした。
- relatedCompanies: 大株主は公益財団法人、個人、信託銀行などのため、事業会社の大株主として結べる相手はありませんでした。
- relatedCompanies: en・seki・port・base-4481・vision・career・land・como・core・cota・the-lead・corona・heiwa・ray・space・trust・innovation・path・rent・ricoh・toumei・zero は語の断片一致のみのため結びませんでした。
- terms: 新たに提案する用語はありません。電子部品事業やケミカル事業などの事業名は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
