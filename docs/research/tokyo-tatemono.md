# 東京建物 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東京建物株式会社 |
| 証券コード | 8804 |
| docID（データを取り出した文書） | `S100XSKF` |
| 原本 docID | `S100XSKF` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSKF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 東京建物株式会社 / 8804 / docID S100XSKF |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-tatemono: 10 件の数値を有報XBRLと照合
有報: 東京建物株式会社 有価証券報告書－第208期(2025/01/01－2025/12/31) (docID S100XSKF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tokyo-tatemono: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の出方…）

## エージェントの判断記録（fragment warnings）

- businessModel: 純利益の減少理由は md-and-a を読んでいないため書かず、増減の事実のみ。
- businessModel: 売上高は有報が「営業収益」と印字しているため、その表記を使った。
- businessStructure: その他事業は報告セグメントに含まれないため最後に置いた。その他事業の3つの区分（体験型施設運営・ファンド・海外）は金額が独立して開示されていないので金額を書いていない。
- history: 沿革表の多数の行のうち、事業の流れが分かる主な出来事だけを選んだ。
- industry: ビル事業・住宅事業・アセットサービス事業のいずれも不動産の事業のため、不動産のみとした。
- relatedCompanies: ポート・ビジョン・エン・キャリア・キング・ゼロ・ランド・レイ・リコーなど: 社名の一致が部分文字列やテナント名・一般語で、同一性の根拠がないため結ばない。
- relatedCompanies: みずほFG・三井住友FG・東京海上HD・千葉興業銀行・四国銀行・大垣共立銀行: 銀行・保険は資金調達や保険取引が理由のため結ばない。
- relatedCompanies: 芙蓉総合リース・ミツウロコGHD・宝HD・沖電気工業・日本精工・タカラスタンダード: 保有目的がテナントとの取引維持の定型で、取引の向きや内容が具体的でないため結ばない。
- relatedCompanies: 東武鉄道・片倉工業・ヤマトHD・戸田建設・東亜建設工業・ダイダン・松井建設・インターライフHD・平和不動産・ヒューリックほか政策保有の各社: 保有目的が定型句のみで、提携・取引の具体的な記述がないため結ばない。
- relatedCompanies: 大和証券グループ本社・西武HD・日本製紙・安田倉庫・日本毛織・帝国繊維ほか: 保有目的の定型句のみで、関係の根拠が足りないため結ばない。
- relatedCompanies: 日本証券金融・BASE・ベース・アイルほか: 大株主の金融機関や本文中の一般語・外国法人名との一致で、関係の根拠がないため結ばない。
- terms: 用語の助言: 「Park-PFI」「SPC法（資産流動化法）」「匿名組合」「特定目的会社」「買取再販」「ノンリコース債務」は、事業の内容や沿革に出てくる専門語で、用語集に無ければ追加の候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
