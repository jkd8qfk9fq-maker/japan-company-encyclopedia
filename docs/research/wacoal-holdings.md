# ワコールホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ワコールホールディングス |
| 証券コード | 3591 |
| docID（データを取り出した文書） | `S100YKJC` |
| 原本 docID | `S100YKJC` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKJC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ワコールホールディングス / 3591 / docID S100YKJC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wacoal-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ワコールホールディングス 有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YKJC)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":6989000000,"latestFiling":7218000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":5693000000,"latestFiling":5680000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":272183000000,"latestFiling":272745000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":191819000000,"latestFiling":192047000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益（△損失） / 当社株主に帰属する当期純利益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 遡及適用・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
wacoal-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益は国際会計基準の「売上収益」を採りました。第74期までの米国会計基準の「売上高」は、会計基準の変更前の旧表示のため採っていません。
- businessModel: 戦略の定量目標の数値は、本文の規則により書きませんでした。
- businessModel: 自己株式の取得は提出後の資本政策のため warnings のみとし、needsReview には入れていません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上収益の大きい順です。
- businessStructure: 売上収益は国際会計基準の「売上収益」を採りました。第74期までの米国会計基準の「売上高」は、会計基準の変更前の旧表示のため採っていません。
- businessStructure: セグメント利益の金額は本文に書かないため、事業の説明には含めていません。
- history: 1970年は韓国、タイ、台湾の合弁会社設立の3件を1件にまとめました。
- history: 2024年は七彩の株式譲渡もありましたが、取得の出来事であるBRAVISSIMO GROUPの取得を採用しました。
- industry: 主たる業界は、インナーウェアなどの繊維製品を製造販売し、直営店舗やECサイトを通じて最終消費者に販売していることから retail を暫定としました。
- relatedCompanies: イオン：インナーウェア等の取引を行っている販売先だが、related-candidates.json にないため結ばない。
- relatedCompanies: イオンフィナンシャルサービス：取引の相手はイオンであり、同社自体との取引の印字がないため結ばない。
- relatedCompanies: 京都フィナンシャルグループ、滋賀銀行、三菱ＵＦＪフィナンシャル・グループ：金融取引のみのため結ばない。
- relatedCompanies: 堀場製作所、ＳＣＲＥＥＮホールディングス、宝ホールディングス、三共生興、キング：情報の共有のみで、具体的な取引の印字がないため結ばない。
- relatedCompanies: 東京海上ホールディングス：保険取引のみのため結ばない。
- relatedCompanies: イズミ：当事業年度に全株式を売却済みのため結ばない。
- relatedCompanies: ＮＴＴ：取引の相手は子会社のＮＴＴデータであり、同社自体との取引の印字がないため結ばない。
- relatedCompanies: 三菱ＵＦＪ銀行、京都銀行：大株主だが、金融機関のため結ばない。
- relatedCompanies: 連結子会社46社、持分法適用関連会社6社（ハウス　オブ　ローゼを除く）：すべて非上場または海外法人のため結ばない。
- relatedCompanies: キャリア、ランド、エン、ポート、コア、セキ、ビジョン、ステップ、ゼロ、ベース、トライト、レック、パス、日新、メンバーズ、フラー、イノベーション、クエスト、テイン、カバー、鈴木、リード、トラスト、フリー、ヒップ、イシン、ナイス、レント、リズム、シンポ、ティア：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- terms: 新たに提案する用語はありません。ファンデーションやランジェリーなどの事業用語は本文で説明しています。

## 要確認（status に反映）

- businessModel: 米国のGlamorise Foundations, Inc.の発行済株式の全てを、連結子会社を通じて2026年4月1日付で取得しました。取得対価は現金約33百万米ドル（約5,308百万円）で、条件付対価が別に付されています。本文の事業構成は2026年3月31日現在のもので、この取得後の事業構成は含まれていません。
- businessStructure: 米国のGlamorise Foundations, Inc.の発行済株式の全てを、連結子会社を通じて2026年4月1日付で取得しました。取得対価は現金約33百万米ドル（約5,308百万円）で、条件付対価が別に付されています。本文の事業構成は2026年3月31日現在のもので、この取得後の事業構成は含まれていません。
- history: 米国のGlamorise Foundations, Inc.の発行済株式の全てを、連結子会社を通じて2026年4月1日付で取得しました。取得対価は現金約33百万米ドル（約5,308百万円）で、条件付対価が別に付されています。本文の事業構成は2026年3月31日現在のもので、この取得後の事業構成は含まれていません。
- industry: 米国のGlamorise Foundations, Inc.の発行済株式の全てを、連結子会社を通じて2026年4月1日付で取得しました。取得対価は現金約33百万米ドル（約5,308百万円）で、条件付対価が別に付されています。本文の事業構成は2026年3月31日現在のもので、この取得後の事業構成は含まれていません。
- relatedCompanies: 米国のGlamorise Foundations, Inc.の発行済株式の全てを、連結子会社を通じて2026年4月1日付で取得しました。取得対価は現金約33百万米ドル（約5,308百万円）で、条件付対価が別に付されています。本文の事業構成は2026年3月31日現在のもので、この取得後の事業構成は含まれていません。
- terms: 米国のGlamorise Foundations, Inc.の発行済株式の全てを、連結子会社を通じて2026年4月1日付で取得しました。取得対価は現金約33百万米ドル（約5,308百万円）で、条件付対価が別に付されています。本文の事業構成は2026年3月31日現在のもので、この取得後の事業構成は含まれていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 繊維事業 → 提案: textiles。東証の業種分類は繊維製品で、主たる事業はインナーウェアなどの繊維製品の製造販売ですが、閉じた分類に繊維を表す値がないため、小売を暫定としました。
