# Joshin — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｊｏｓｈｉｎ |
| 証券コード | 8173 |
| docID（データを取り出した文書） | `S100YHVK` |
| 原本 docID | `S100YHVK` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHVK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｊｏｓｈｉｎ / 8173 / docID S100YHVK（id は英語表記「Joshin Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
joshin: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｊｏｓｈｉｎ 有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YHVK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第77期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
joshin: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Joshin(旧会社名　上新電機株式会社)」が EDINET の提出者名「株式会社Ｊｏｓｈｉｎ」と違います
- 確認: [other-profit-wording] businesses[2].description: 売上高と当期純利益以外の利益に触れていないか確認する（…は、長期修理保証制度におけるグループ損益の改善と資金流動の効率化を目的とした…）

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益などは本文に書かない方針のため省略。
- businessModel: perspectives は書いていない（経営方針の節を読み込んでいないため）。
- businessModel: 「連結子会社13社」は【関係会社の状況】に掲載された連結子会社の数。
- businessStructure: 単一セグメントで関連情報の製品区分も省略されているため、事業の並びは売上順ではなく【事業の内容】の記載順（中核の小売を先頭、金額なしの子会社事業を後ろ）。各事業の売上高は書いていない。
- businessStructure: 品種別売上（MD&A）は事業ではなく商品区分のため children にしていない。
- history: 沿革の全行から主要な出来事だけを選んだ（受賞・認証・個別店舗の開設などは省略）。
- industry: 単一事業（家電製品等の小売業並びにこれらの付帯業務）のため小売のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる上場の候補が無いため、関連企業は結んでいない。
- relatedCompanies: 楽天株式会社：Ｒポイントカードでの提携は沿革の1回の出来事（2015年9月）で、取引や資本関係の記載が無いため結ばない。
- relatedCompanies: 株式会社阪神タイガース：スポンサー契約は上場企業ではなく、候補にも無いため結ばない。
- relatedCompanies: 連結子会社（ジョーシンサービス等）は掲載済みの上場企業ではないため結ばない。
- terms: 用語の助言：キャプティブ（再保険会社）、長期修理保証制度、スクラップアンドビルド（店舗の出退店）は用語集に無ければ候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
