# 大垣共立銀行 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　大垣共立銀行 |
| 証券コード | 8361 |
| docID（データを取り出した文書） | `S100YELN` |
| 原本 docID | `S100YELN` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YLKM（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YELN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　大垣共立銀行 / 8361 / docID S100YELN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-ogaki-kyoritsu-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社　大垣共立銀行 有価証券報告書－第214期(2025/04/01－2026/03/31) (docID S100YELN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第213期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
the-ogaki-kyoritsu-bank: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社大垣共立銀行」が EDINET の提出者名「株式会社　大垣共立銀行」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 連結経常収益を売上高として扱っています。一般企業の売上高に代えて経常収益を記載すると有報に注記されています。
- businessModel: 株式分割（2026年5月15日取締役会決議、普通株式1株につき5株、基準日2026年9月30日、効力発生日2026年10月1日）は資本政策の後発事象のため、本文には書かずここに記録します。
- businessModel: 訂正有価証券報告書－第213期（S100YLKM、2026年6月26日提出）は、従業員の状況の1数値（共立コンピューターサービスの男性労働者の育児休業取得率133.0％→66.6％）の訂正のみで、財務数値への影響はありません。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客に対する経常収益の大きい順です。「その他」は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: 銀行業の子どもの貸出業務と有価証券投資業務の金額は、セグメント情報の関連情報にあるサービスごとの外部顧客に対する経常収益です。
- businessStructure: 株式会社ＯＫＢフロントは2026年3月31日に解散を決議し、2026年6月8日に清算を結了したため、連結子会社9社には含まれていません。
- industry: 主たる事業は銀行業のため、金融を主たる業界としました。リース業や信用保証業、証券業務なども金融サービスのため、2つ目の業界は付けませんでした。
- relatedCompanies: 連結子会社9社はすべて非上場のため結びませんでした。
- relatedCompanies: 大株主の事業会社である岐建株式会社、明治安田生命保険相互会社、牧村株式会社は非上場または相互会社のため結びませんでした。信託銀行やファンドは純投資のため結びませんでした。
- relatedCompanies: ＳＯＭＰＯホールディングス、野村ホールディングス、中部電力の株式は、2026年3月期に保有目的を純投資目的へ変更したため結びませんでした。
- relatedCompanies: セイノーホールディングス、東邦瓦斯、セリアなど、保有目的が「銀行取引関係の維持・強化」の定型句のみの政策保有先は結びませんでした。
- relatedCompanies: 中部電力との関係は、子会社である中部電力ミライズ株式会社からの電気の供給です。
- terms: 新たに提案する用語はありません。ＯＫＢ、経常収益、ビジネスマッチングなどの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
