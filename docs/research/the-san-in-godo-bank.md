# 山陰合同銀行 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社山陰合同銀行 |
| 証券コード | 8381 |
| docID（データを取り出した文書） | `S100YBU8` |
| 原本 docID | `S100YBU8` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBU8.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E5%B1%B1%E9%99%B0%E5%90%88%E5%90%8C%E9%8A%80%E8%A1%8C

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社山陰合同銀行 / 8381 / docID S100YBU8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-san-in-godo-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社山陰合同銀行 有価証券報告書－第123期(2025/04/01－2026/03/31) (docID S100YBU8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第122期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
the-san-in-godo-bank: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載は、2025年度からの連結キャッシュ・フロー計算書の表示方法の変更によるもので、修正再表示チェックで重複年度は全行一致し売上高・当期純利益の範囲に変化がないため、financialNotesは書きませんでした。
- businessModel: 前期の窓にある訂正有価証券報告書－第122期について、修正再表示チェックで重複年度は全行一致したため、financialNotesは書きませんでした。
- businessModel: 2026年5月15日取締役会決議の自己株式の取得は提出後の資本政策のため、needsReviewには入れずwarningsに記録しました。
- businessStructure: 事業はセグメント注記の外部顧客への経常収益の大きい順に並べました。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: 「その他」の区分は報告セグメントに含まれていない事業セグメントのため、最後に置きました。
- history: 沿革は15件としました。
- industry: 主たる業界は、銀行業務を中心とする地方銀行であることから finance としました。東京証券取引所の業種分類は銀行業です。
- industry: リース業も金融サービスのため、2つ目の業界は付けませんでした。
- relatedCompanies: 連結子会社9社（ごうぎんリース・ごうぎんクレジットなど）はすべて非上場のため結びませんでした。
- relatedCompanies: 野村證券株式会社：金融商品仲介業務の包括的業務提携（Ｎアライアンス）がありますが、related-candidates.jsonに野村ホールディングスがなく、野村證券自体は上場していないため結びませんでした。
- relatedCompanies: 株式会社ＮＴＴデータ：「地銀共同センター」利用の基本契約がありますが、related-candidates.jsonにＮＴＴデータがなく、候補の「NTT」は断片一致のため結びませんでした。
- relatedCompanies: 大株主は信託銀行・保険会社・従業員持株会などで、事業会社の大株主はいないため結びませんでした。
- relatedCompanies: 特定投資株式の銘柄（寿スピリッツ・イオン・中国電力・西日本旅客鉄道など）は、保有目的が預金・貸出金取引等の維持・強化など金融取引のみのため結びませんでした。
- relatedCompanies: ＳＯＭＰＯホールディングス・東京海上ホールディングス・ＭＳ＆ＡＤインシュアランスグループホールディングス：金融関連業務のリレーション強化のみのため結びませんでした。
- relatedCompanies: いよぎんホールディングス：近隣地域金融機関とのリレーション強化のみのため結びませんでした。
- relatedCompanies: 断片一致のみの候補（セキ・キャリア・ポート・ベース・フリー・ビジョン・キング・ゼロ・パス・トラスト・ランド・Ｎｏ．１・カバー・コア・虹技など）は取引・提携の記載がないため結びませんでした。
- terms: 新たに提案する用語はありません。「全員コンサル」「Ｎアライアンス」「地銀共同センター」などの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
