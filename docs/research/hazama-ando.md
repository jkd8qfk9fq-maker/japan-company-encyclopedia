# 安藤・間 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社安藤・間 |
| 証券コード | 1719 |
| docID（データを取り出した文書） | `S100YHJP` |
| 原本 docID | `S100YHJP` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHJP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社安藤・間 / 1719 / docID S100YHJP（id は英語表記「HAZAMA ANDO CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hazama-ando: 10 件の数値を有報XBRLと照合
有報: 株式会社安藤・間 有価証券報告書－第13期(2025/04/01－2026/03/31) (docID S100YHJP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hazama-ando: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…投資有価証券の売却益の増加など、特別損益が前期より改善しました。…）

## エージェントの判断記録（fragment warnings）

- businessModel: profit 段は当期純利益(親会社株主に帰属する当期純利益)を使った。経常利益・営業利益は書かない方針。
- businessModel: 売上高4,396億円・297億円は MD&A の億円印字。XBRL の439,615・29,746百万円と一致する。
- businessModel: 『特別損益の改善』は MD&A の『特別損益は…投資有価証券売却益の増加等により55億円増加』に基づく。金額は書いていない。
- businessModel: 財務諸表の組替えの記載があるが、前期有報との重複年度は全て一致のため financialNotes は書かなかった。
- businessModel: perspectives(戦略・強み)は、中期経営計画2025の目標と実績の比較が中心で、会社自身の戦略説明を要約できる材料が本文ファイルに乏しいため省いた。
- businessModel: 『トンネル、道路、ダムなど』は MD&A の完成工事・手持工事の例による。
- businessStructure: name は表紙の「株式会社安藤・間」から「株式会社」を落とした。DEI の呼称「安藤ハザマ」は name にしていない。
- businessStructure: shortNameEn は省略した。英訳名 HAZAMA ANDO CORPORATION のみで短縮表記の印字がないため。
- businessStructure: 事業の並びは外部顧客への売上高の大きい順（建築 262,273 / 土木 140,863 / グループ 26,522 百万円）。報告セグメントに含まれない「その他」（9,956 百万円）は最後。
- businessStructure: 金額は MD&A が印字する億円表記を使い、百万円からの書き換えはしていない。セグメント利益・受注高は書かない方針のため省いた。
- businessStructure: 土木事業の「トンネルや道路、ダムなどの工事」は、MD&A の完成工事・手持工事の例示（トンネル・ダム・道路災害復旧）に基づく例示で、金額は結びつけていない。
- businessStructure: グループ事業の子会社ごとの売上高は印字がなく、金額は書いていない。ハザマアンドウ(タイランド)は議決権49.99%の子会社として関係会社の状況に区分されている。
- history: 沿革の表は崩れておらず、年月と概要が対応している。
- history: 2003年10月の『建設業許可・宅地建物取引業免許の取得』と2005年5月の本店移転、1949年・1973年・1983年の許認可・本店移転は、会社の姿を変える出来事ではないため省いた。
- history: 1962年の項は、同一会社の1961年二部上場・1963年一部指定を説明に含めた。
- industry: 土木事業・建築事業・グループ事業(施工・資材・不動産の関連)が売上の大半を占める建設会社のため construction のみ。不動産は金額が独立して開示されていないため real-estate は付けない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、結べる候補がない。
- relatedCompanies: 安藤ハザマ興業・青山機工・菱晃開発・ハザマアンドウ(タイランド)・ハザマアンドウムリンダ・ベトナムディベロップメントコンストラクション・QXYリソーシズ: 子会社だが上場企業ではない(有報提出なし)ため結ばない。
- relatedCompanies: 坂出バイオマスパワー合同会社: 持分法適用関連会社だが上場企業ではないため結ばない。
- relatedCompanies: 大株主の状況に載る相手は、信託銀行・金融機関・運用会社が中心で事業会社の根拠を確認できていない。みずほ銀行、アセットマネジメントOne、ブラックロック・ジャパンは大量保有報告書の記載にとどまり結ばない。
- terms: 用語の候補(助言のみ): 総合建設業(ゼネコン)、完成工事高、手持工事高、特命と競争(受注方法)、工事進行基準にあたる履行義務の充足に係る進捗度(原価比例法)、分割型分割(新設分割)。既存の用語集に有る語かは確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
