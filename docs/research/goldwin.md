# ゴールドウイン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ゴールドウイン |
| 証券コード | 8111 |
| docID（データを取り出した文書） | `S100YGJI` |
| 原本 docID | `S100YGJI` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGJI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ゴールドウイン / 8111 / docID S100YGJI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
goldwin: 10 件の数値を有報XBRLと照合
有報: 株式会社ゴールドウイン 有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YGJI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
goldwin: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 株式分割（2025年10月1日、1株につき3株）は期中の実施済み事項のため needsReview に記録しました。
- businessStructure: 単一セグメント（スポーツ用品関連事業）のため、【事業の内容】の商品群（アウトドア関連・アスレチック関連・ウインター関連・その他）を children としました。商品群ごとの外部顧客への売上高は開示されていないため、各 children に金額を記載せず、その旨を明記しました。
- businessStructure: 連結売上高137,516百万円は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の印字によります。
- history: 沿革は有報の【沿革】の印字から主要な出来事を選んで記載しました。営業所の開設などの細目は省略しました。
- history: 2019年・2020年の海外子会社設立（nanamica USA, Inc.、Goldwin Europe GmbH）は個別に取り上げず、欧米拠点は2013年・2025年の設立で代表させました。
- industry: 閉じた分類にスポーツ用品・繊維製品（アパレル）の区分がないため、消費者向けブランド商品の販売が中心であることから小売を暫定としました。
- relatedCompanies: 三井物産以外の候補は次の理由で結びませんでした。
- relatedCompanies: ビジョン： 「Goldwin500」などの長期ビジョンの文言との一般語の一致で、株式会社ビジョンとの関係の印字はありません。
- relatedCompanies: セキ： 株主の常任代理人等の記載に現れる部分一致（ambiguous）で、セキ株式会社との関係の印字はありません。
- relatedCompanies: エン： 子会社名「ゴールドウインエンタープライズ」等の部分一致（ambiguous）で、エン株式会社との関係の印字はありません。
- relatedCompanies: パス： 子会社名「アンパスィ」の部分一致（ambiguous）で、パス株式会社との関係の印字はありません。
- relatedCompanies: ポート： 「ポートフォリオ」の部分一致で、ポート株式会社との関係の印字はありません。
- relatedCompanies: キャリア： 「キャリア」の一般語の一致で、株式会社キャリアとの関係の印字はありません。
- relatedCompanies: キング： 「ハイキング」等の部分一致で、株式会社キングとの関係の印字はありません。
- relatedCompanies: ほくほくフィナンシャルグループ： 特定投資株式に載る主要取引金融機関で、保有目的は長期・安定的な取引関係の維持という定型的な記載のみのため結びません。
- relatedCompanies: 川田テクノロジーズ： 特定投資株式の保有目的が「地域情報の収集等による当社事業の円滑な遂行」という定型的な記載のみで、個別の取引の印字がないため結びません。
- relatedCompanies: みずほフィナンシャルグループ： 特定投資株式に載る主要取引金融機関で、資金調達の文脈のみのため結びません。
- relatedCompanies: ベース： 「時価ベースの自己資本比率」の部分一致で、ベース株式会社との関係の印字はありません。
- relatedCompanies: リックス： 「スキル・マトリックス」の部分一致で、リックス株式会社との関係の印字はありません。
- relatedCompanies: イノベーション： 「イノベーション」の一般語の一致で、株式会社イノベーションとの関係の印字はありません。
- relatedCompanies: 富山銀行： 特定投資株式に載る主要取引金融機関で、資金調達の文脈のみのため結びません。
- relatedCompanies: 富山第一銀行： 特定投資株式に載る主要取引金融機関で、資金調達の文脈のみのため結びません。
- relatedCompanies: 東レ： 特定投資株式の保有目的が「商品調達における取引の関係強化」という全銘柄に共通する定型的な記載のみで、個別の取引の印字がないため結びません。
- relatedCompanies: トラスト： 日本マスタートラスト信託銀行（信託口）の部分一致で、純投資の信託口でありコードリスト外でもあるため結びません。
- relatedCompanies: ゼロ： 「ゼロ」の一般語の一致（ambiguous）で、株式会社ゼロとの関係の印字はありません。
- relatedCompanies: アルペン： 特定投資株式に載っていた同社株式は当事業年度にすべて売却済みで、現在の保有がないため結びません。
- relatedCompanies: 旭化成： 特定投資株式の保有目的が「商品調達における取引の関係強化」という定型的な記載のみのため結びません。
- relatedCompanies: イシン： 本文の表中に現れる部分一致で、イシン株式会社との関係の印字はありません。
- relatedCompanies: ランドビジネス： 「ブランドビジネス」の部分一致で、株式会社ランドビジネスとの関係の印字はありません。
- relatedCompanies: 日本電気： 特定投資株式の保有目的が「IT分野における当社事業の円滑な遂行」という定型的な記載のみで、保有株数も500株と僅少なため結びません。
- relatedCompanies: レイ： 製品名「VECTIV」等に現れる部分一致（ambiguous）で、株式会社レイとの関係の印字はありません。
- relatedCompanies: 田中精密工業： 特定投資株式の保有目的が「地域情報の収集等による当社事業の円滑な遂行」という定型的な記載のみのため結びません。
- relatedCompanies: ゼビオホールディングス： 特定投資株式の保有目的が「商品の販売における長期・安定的な取引関係の維持」という定型的な記載のみのため結びません。
- relatedCompanies: ゼット： 特定投資株式の保有目的が「商品の販売における長期・安定的な取引関係の維持」という定型的な記載のみのため結びません。
- relatedCompanies: YOUNGONE OUTDOOR Corporation（韓国の持分法適用関連会社、議決権40.7％）とゴールドウイン開発株式会社（持分法適用関連会社、議決権31.7％）は、候補リストに無く上場会社として検証できないため結んでいません。
- terms: 用語候補： ハイテックウエア（防塵服など、特殊な作業環境向けの機能性ウエア）、コト事業（商品の販売にとどまらない体験の提供を中心とする事業）、Goldwin 500（自社ブランドGoldwinの全世界売上高500億円を目指す長期目標）——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: 2025年10月1日付で普通株式1株につき3株の割合の株式分割を実施済みです。有報の連結経営指標は、この分割が2022年3月期の期首に行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ゴールドウインの主たる業界 → 提案: スポーツ用品・アパレル。スポーツウエア等の繊維製品を製造販売するメーカーであり、閉じた分類に合う区分がありません。売上はスポーツ用品関連事業の単一セグメントです。
