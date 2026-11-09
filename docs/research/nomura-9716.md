# 乃村工藝社 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社乃村工藝社 |
| 証券コード | 9716 |
| docID（データを取り出した文書） | `S100Y66D` |
| 原本 docID | `S100Y66D` |
| 提出日（原本） | 2026-05-26 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y66D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社乃村工藝社 / 9716 / docID S100Y66D（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nomura-9716: 10 件の数値を有報XBRLと照合
有報: 株式会社乃村工藝社 有価証券報告書－第89期(2025/03/01－2026/02/28) (docID S100Y66D)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nomura-9716: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで重複年度は全行一致しました。
- businessModel: 財務諸表の組替えは確認されませんでした。会計基準の変更の事実のみ、financialNotes に記載しました。
- businessModel: 中期経営計画の定量目標のうち、営業利益などの本文の規則で書けない数値は strategy には書きませんでした。
- businessStructure: 当社グループはディスプレイ事業の単一セグメントのため、事業は1事業とし、市場分野別の売上高を children にしました。市場分野は外部顧客への売上高の大きい順に並べました。
- businessStructure: 市場分野別の売上高を合計すると162,675百万円となり、印字の合計162,679百万円と4百万円ずれますが、千円単位の丸めによるもので、印字の値をそのまま引用しました。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- history: 沿革の2022年以降の箇所は、年月と事象文が分かれて印字された崩れた表のため、年月5つと事象5つが行順で対応することから、行順で対応づけました。2022年3月の2件の吸収合併は同じ月の出来事のため、1件にまとめました。
- history: 横浜営業所の開設（2024年3月）と金沢営業所の開設（2025年3月）は沿革に印字されていますが、15件の選定から外しました。
- industry: 主たる業界は、空間の設計・制作施工を中核とする事業内容から、分類表の中で最も近い construction としました。
- relatedCompanies: 松屋・髙島屋・三越伊勢丹ホールディングス・近鉄百貨店・近鉄グループホールディングス・京王電鉄・京浜急行電鉄・西日本旅客鉄道・南海電気鉄道・日立製作所・パナソニックホールディングス・マツダ・トヨタ自動車・電通グループ・オリエンタルランド：特定投資株式の保有目的欄に「重要な取引先」との定型的な記載があるのみで、取引の内容や向きの印字がないため結ばない。
- relatedCompanies: 第一生命ホールディングス（2026年4月1日付で第一ライフグループに商号変更）：専門店市場における重要な取引先との記載に加え保険契約等の取引があるが、保険会社との保険取引が理由のため結ばない。
- relatedCompanies: 三井住友フィナンシャルグループ：資金調達等の金融取引が理由の政策保有のため結ばない。
- relatedCompanies: インターライフホールディングス：相互の情報交換と円滑な事業推進を目的とした契約の記載のみで、取引・提携の具体的な印字がないため結ばない。
- relatedCompanies: 丹青社・博展・スペース：業界の動向把握のため限定的な規模で保有しているもので、取引・提携の印字がないため結ばない。
- relatedCompanies: 連結子会社7社（ノムラアークス、ノムラメディアス、シーズ・スリー、六耀社、乃村工藝建築装飾（北京）、NOMURA Design & Engineering Singapore、NOMURA Design & Engineering Malaysia）：すべて非上場のため結ばない。
- relatedCompanies: 大株主の状況：三井住友銀行は2026年2月28日現在2.47％の大株主だが、銀行の資金調達が理由のため結ばない。日本生命保険・第一生命保険は保険会社のため結ばない。有限会社乃村・有限会社蟻田・乃村洋子・乃村工藝社共栄会・乃村工藝社従業員持株会は非上場・個人のため結ばない。
- relatedCompanies: レイ・キャリア・ベース・ポート・リオン・アークス・イシン・アミューズ・コロナ・セキ・テイン・いであ・パス・トラスト：断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- terms: 新たに提案する用語はありません。「ディスプレイ事業」や市場分野の用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 乃村工藝社のディスプレイ事業 → 提案: ディスプレイ業（空間デザイン・展示施工業）。ディスプレイ事業は商業施設や博物館、博覧会などの空間の企画・デザイン・設計・制作施工を手がける事業で、建設業の分類には当たりません。分類表にディスプレイ業や空間デザイン業の区分がありません。
