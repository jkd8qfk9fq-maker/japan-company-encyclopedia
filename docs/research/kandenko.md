# 関電工 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社関電工 |
| 証券コード | 1942 |
| docID（データを取り出した文書） | `S100YDOZ` |
| 原本 docID | `S100YDOZ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDOZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社関電工 / 1942 / docID S100YDOZ（id は英語表記「KANDENKO CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kandenko: 10 件の数値を有報XBRLと照合
有報: 株式会社関電工 有価証券報告書－第112期(2025/04/01－2026/03/31) (docID S100YDOZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第111期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kandenko: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから「2026年3月期」。連結。売上高742,022百万円・当期純利益63,516百万円の前期比は【経営者による分析】の印字（110.4％・149.9％）。
- businessModel: 営業利益・経常利益・セグメント利益と、個別の受注高は本文に書いていない。東京電力グループの売上高の金額（181,094百万円）も書かず、有報の「約２割」を使った。
- businessModel: 財務の注記（financialNotes）に書くべき変則決算・会計基準の変更は無く、brief 注意欄の組替え記載も修正再表示は無い（前期有報と重複年度は一致）ため省いた。前期に訂正有報（第111期）があるが、今期の数値は前期有報と一致している。
- businessModel: 顧客区分の順（民間・官公庁・東京電力グループ）は収益認識の注記の設備工事業の金額の大きい順（金額は本文に書いていない）。
- businessModel: 東京電力グループの持株比率は関連当事者情報の議決権等の被所有割合（2026年3月31日現在）。
- businessStructure: 決算期は表紙のDEIから「2026年3月期」。連結決算で、連結子会社は30社。
- businessStructure: 報告セグメントは設備工事業のみ。「その他」（電気機器販売業・不動産事業・リース業・発電事業）は有報が「報告セグメントに含まれない」と書く区分なので、売上高が小さくなくても最後に置いた。外部顧客への売上高は設備工事業731,647百万円、その他10,374百万円（セグメント注記）。
- businessStructure: 「その他」の内訳（電気機器販売・不動産・リース・発電）ごとの売上高は開示されていないため、children にせず金額も書いていない。
- businessStructure: 設備工事業の内訳（電気工事・管工事など）の売上高も独立して開示されていないため、children にしていない。
- businessStructure: セグメント利益・調整額は本文に書いていない。
- businessStructure: 東京電力グループの顧客割合（売上高の約2割）は businessModel 側で扱った。
- businessStructure: name「関電工」は officialName「株式会社関電工」から「株式会社」を除いたもの。shortNameEn「KANDENKO」は表紙の英訳名から法人語尾を除いたもの。
- history: 沿革は有報の【沿革】表から主要な出来事を選んだ。省いた行（支店の新設、建設業許可、社債の発行、本社移転、原子力関連工事の開始など）は事業構造の理解に必要な範囲を超えるため。
- history: 2026年4月の再編は決算期末後の事象。有報は提出済みの事実として「実施した」と書いているため完了として書いた。
- industry: primary は construction。報告セグメントは設備工事業のみで、2026年3月期の外部顧客への売上高742,022百万円のうち731,647百万円を占める。
- industry: 発電事業・不動産事業は報告セグメントに含まれない「その他」に含まれ、独立した金額が開示されていないため、energy・real-estate は付けていない。
- industry: 半導体・データセンター関連投資は有報では市場環境・営業方針の文脈でしか出てこないため、semiconductors は付けていない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、同一性（掲載済みの上場企業）を確認できる候補が無いため、関連企業は結ばなかった。
- relatedCompanies: 東京電力ホールディングス㈱（その他の関係会社。2026年3月31日現在、間接35.3％）: 関係性は有報に明記されているが、候補ファイルが無く掲載済みかどうか確認できないため結ばなかった。掲載済みと確認できれば other-affiliated-company で追加できる。
- relatedCompanies: 東京電力パワーグリッド㈱（その他の関係会社。2026年3月31日現在、直接34.5％・間接0.3％。電気工事の請負・有償支給材料の購入）: 同様に、有報提出会社だが上場会社ではない可能性があり、候補ファイルも無いため結ばなかった。
- relatedCompanies: 連結子会社30社は、上場している川崎設備工業㈱（名古屋市、議決権50.1％）を除き非上場の子会社。川崎設備工業㈱は候補ファイルが無く同一性を確認できないため結ばなかった。
- terms: 助言のみ。本文にリンク記法は使っていない。用語集に追加すると読者の助けになる候補: 「設備工事業」（電気・管工事など建物やインフラの設備を施工する建設業の一分野）、「その他の関係会社」（親会社に当たらないが議決権を一定割合持つ会社。東京電力ホールディングス・東京電力パワーグリッドが該当）、「リニューアル工事」（既存設備の更新・改修）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
