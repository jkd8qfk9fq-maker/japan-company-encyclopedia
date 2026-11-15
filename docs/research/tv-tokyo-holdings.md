# テレビ東京ホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社テレビ東京ホールディングス |
| 証券コード | 9413 |
| docID（データを取り出した文書） | `S100YCRR` |
| 原本 docID | `S100YCRR` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCRR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社テレビ東京ホールディングス / 9413 / docID S100YCRR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tv-tokyo-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社テレビ東京ホールディングス 有価証券報告書－第16期(2025/04/01－2026/03/31) (docID S100YCRR)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tv-tokyo-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に財務諸表の組替えの記載がありますが、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotes は書きませんでした。
- businessModel: 中期経営計画の定量目標の数値は、本文の規則により strategy には書きませんでした。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- history: 2026年1月のQ-nineの完全子会社化は会計年度内の出来事のため、沿革に採用しました。
- industry: 主たる業界は、売上高が最も大きい地上波・BS放送事業が放送事業であることから media としました。
- industry: アニメ・配信事業が報告セグメントのため entertainment を2つ目に付けました。
- relatedCompanies: 日本経済新聞社：その他の関係会社で2026年3月31日現在33.1％を保有し、放送番組の宣伝広告を掲載しているが、非上場で related-candidates.json にないため結ばない。
- relatedCompanies: WOWOW：配信事業・映画事業等における重要な取引先だが、related-candidates.json にないため結ばない。
- relatedCompanies: note：コンテンツ制作協力等における重要な取引先だが、related-candidates.json にないため結ばない。
- relatedCompanies: MBSメディアホールディングス：2026年3月31日現在1.95％の大株主だが、related-candidates.json にないため結ばない。
- relatedCompanies: 三井住友フィナンシャルグループ・みずほフィナンシャルグループ：主要取引金融機関のため結ばない。
- relatedCompanies: 連結子会社15社・持分法適用関連会社5社（日経映像、インタラクティーヴィ、日経CNBC、TVer、D・A・Gほか）：すべて非上場のため結ばない。
- relatedCompanies: ベース・マックス・エン・ステップ・キャリア・ゼロ・パス・ビジョン・レイ・レック・ポート・ヒット・テイン・ランド・セキ・フロンティア・ハブ・リズム・鈴木・トラスト：断片一致のみで、取引・提携・資本関係の印字がないため結ばない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
