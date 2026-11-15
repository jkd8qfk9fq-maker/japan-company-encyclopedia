# 矢作建設工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 矢作建設工業株式会社 |
| 証券コード | 1870 |
| docID（データを取り出した文書） | `S100YEMP` |
| 原本 docID | `S100YEMP` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEMP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 矢作建設工業株式会社 / 1870 / docID S100YEMP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yahagi-construction: 10 件の数値を有報XBRLと照合
有報: 矢作建設工業株式会社 有価証券報告書－第85期(2025/04/01－2026/03/31) (docID S100YEMP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
yahagi-construction: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載は、2022年改正会計基準を第84期の期首から適用し第83期を遡及適用したもので、修正再表示チェックで重複年度は全行一致し売上高・当期純利益の範囲に変化がないため financialNotes は書きませんでした。
- businessModel: 中期経営計画の数値目標は本文の規則により strategy には書きませんでした。
- businessModel: 分譲マンション開発・販売事業と分譲マンション管理事業の譲渡、株式会社海昌の子会社化は決算期後の出来事のため needsReview に入れました。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: 不動産セグメントの説明は2026年3月31日現在のものです。分譲マンション開発・販売事業と分譲マンション管理事業の譲渡は2026年4月1日付の決算期後の出来事で、needsReview に入れました。
- industry: 主たる業界は、売上高の最も大きい建築セグメントが建設工事の請負であるためconstructionとしました。不動産セグメントは不動産の売買や賃貸などを手がける報告セグメントのため、real-estateを2つ目に付けました。
- relatedCompanies: 野村不動産株式会社は2026年3月期の主要な顧客で売上高55,620百万円ですが、related-candidates.json にないため結びませんでした。
- relatedCompanies: 三井不動産株式会社と三井不動産レジデンシャル株式会社は完成工事の相手先ですが、単発の工事の取引のため結びませんでした。
- relatedCompanies: 三菱地所株式会社は次期繰越工事の相手先ですが、単発の工事の取引のため結びませんでした。
- relatedCompanies: 大和ハウス工業株式会社は前事業年度の完成工事の相手先ですが、単発の工事の取引のため結びませんでした。
- relatedCompanies: 特定投資株式の表にあるコムシスホールディングス、名古屋銀行、横浜フィナンシャルグループ、あいちフィナンシャルグループ、アイホン、中部鋼鈑、十六フィナンシャルグループ、九州フィナンシャルグループ、マキタ、三菱ＵＦＪフィナンシャル・グループ、ニフコ、日東工業、りそなホールディングス、三井住友フィナンシャルグループ、大垣共立銀行、今仙電機製作所、菊水化学工業、御園座、日本ハム、岡谷鋼機、三井住友トラストグループは、株式の保有のみで保有目的が全銘柄共通の定型句のため結びませんでした。ビー・エム・エルは当事業年度に全株式を売却済みのため結びませんでした。
- relatedCompanies: リンクアンドモチベーション株式会社はエンゲージメント調査の提供元ですが、単発の役務の取引のため結びませんでした。
- relatedCompanies: 第一ライフグループ株式会社は社名変更の記載のみのため結びませんでした。
- relatedCompanies: 大株主の状況にある日本マスタートラスト信託銀行、矢作建設取引先持株会、日本カストディ銀行、矢作建設工業社員持株会、日本生命保険、ステート・ストリート・バンク、ＪＰモルガン証券、百十四銀行、ＮＤＳは、信託銀行・持株会・保険会社・金融機関の純投資のため結びませんでした。
- relatedCompanies: 連結子会社8社はすべて非上場のため結びませんでした。
- relatedCompanies: 名鉄都市開発株式会社と名鉄コミュニティライフ株式会社は2026年4月1日付の事業譲渡の相手先ですが、related-candidates.json にないため結びませんでした。
- relatedCompanies: 株式会社海昌と株式会社アクエリアスインベスコは2026年4月1日付で子会社化しましたが、非上場のため結びませんでした。
- relatedCompanies: 断片一致のみの候補（エン、ステップ、キャリア、ポート、ベース、コア、キング、セキ、ゼロ、イシン、ランド、スペース、高速、IC）は、有報の本文に会社としての言及がないため結びませんでした。
- terms: 新たに提案する用語はありません。建築、土木、不動産などの用語は本文で説明しています。

## 要確認（status に反映）

- businessModel: 2026年4月1日付で、矢作地所株式会社の分譲マンション開発・販売事業を名鉄都市開発株式会社へ、矢作ビル＆ライフ株式会社の分譲マンション管理事業を名鉄コミュニティライフ株式会社へ、それぞれ会社分割により譲渡しました。2026年3月31日現在の事業構成には両事業が含まれています。
- businessModel: 2026年4月1日付で、株式会社アクエリアスインベスコの発行済株式の全てを取得し、同社と株式会社海昌を連結子会社化しました。2026年3月31日現在の事業構成には両社は含まれていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
