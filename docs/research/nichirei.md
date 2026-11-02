# ニチレイ — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ニチレイ |
| 証券コード | 2871 |
| docID（データを取り出した文書） | `S100YCCS` |
| 原本 docID | `S100YCCS` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCCS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ニチレイ / 2871 / docID S100YCCS（id は英語表記「NICHIREI CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
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
nichirei: 10 件の数値を有報XBRLと照合
有報: 株式会社ニチレイ 有価証券報告書－第108期(2025/04/01－2026/03/31) (docID S100YCCS)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第107期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
nichirei: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 利益の説明は純利益のみ。セグメント利益・営業利益・経常利益は書いていない。減価償却方法の変更は事実のみ（影響額は書かない）。
- businessModel: 顧客の「食品の卸売会社」「食品メーカーや流通企業」は一般的な整理で、有報が顧客として名指しするのは三菱食品のみ。低温物流の荷主の内訳は有報に印字がない。
- businessStructure: 並び順はセグメント注記2026年3月期の外部顧客への売上高（食品426,409／低温物流281,985／不動産3,342）。「その他」は報告セグメントに含まれないため最後。
- businessStructure: 食品の子区分（加工食品・水産・畜産）は【事業の内容】の分類。旧3区分の2026年3月期の売上高は開示されていないため金額を書いていない。低温物流の子区分も同様。
- businessStructure: 拠点・設備との対応は省略した。
- history: 沿革表から主要な出来事を選んだ。2010年7月〜2012年6月の行は年月セルが3つと事象が3つあるが、順序が対応せず（10月・2012年6月の2セルがフランス買収の後に並ぶ）日付を裏付ける他の節も無いため、タイ生産拠点の稼働とアメリカの食品会社買収の2件は落とした。1977年の子会社設立、1982年のバイオ進出などは省いた。
- industry: 食品（外部顧客への売上高426,409百万円）が最大の報告セグメントなので主たる業界は food。低温物流（同281,985百万円）は報告セグメントとして開示されているため transportation を2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる上場の掲載済み企業が特定できないため、結ばなかった。
- relatedCompanies: 日清製粉グループ本社：沿革に2005年の合弁会社（錦築（煙台）食品研究開発有限公司）設立の記載があるが、過去の合弁設立1件で、候補一覧に無く、取引の向きも印字がないため結ばない。
- relatedCompanies: 三菱食品：主要な顧客として売上高の印字はあるが、候補一覧が無く同一性を確認できないため結ばない。
- relatedCompanies: 日立製作所：情報システム会社の共同出資の記載（2003年）のみで、過去の出来事のため結ばない。
- terms: 用語の候補（助言）：「3PL（サード パーティー ロジスティクス）」「低温物流（コールドチェーン）」「持株会社」「報告セグメント」。3PLは有報の事業の内容に注記があり、低温物流は本文の中心概念。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
