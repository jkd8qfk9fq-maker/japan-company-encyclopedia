# Appier Group — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | Ａｐｐｉｅｒ　Ｇｒｏｕｐ株式会社 |
| 証券コード | 4180 |
| docID（データを取り出した文書） | `S100XTNG` |
| 原本 docID | `S100XTNG` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTNG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | Ａｐｐｉｅｒ　Ｇｒｏｕｐ株式会社 / 4180 / docID S100XTNG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
appier-group: 10 件の数値を有報XBRLと照合
有報: Ａｐｐｉｅｒ　Ｇｒｏｕｐ株式会社 有価証券報告書－第8期(2025/01/01－2025/12/31) (docID S100XTNG)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
appier-group: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「Appier Group株式会社」が EDINET の提出者名「Ａｐｐｉｅｒ　Ｇｒｏｕｐ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意にある遡及修正の記載は、未適用の新基準の節で「改訂基準の適用に伴い、前連結会計年度の連結財務諸表における会計方針の変更や遡及修正を行う必要はありませんでした」とするものでした。前期有報との修正再表示チェックも全系列で一致したため、financialNotesは空にしました。
- businessModel: 2021年1月29日付の株式の無償割当に関する注記は、株式数に関する指標の算定の前提を示すもので、本文では株式数に関する指標を使わないため、financialNotesには入れていません。指標の注記の文面は、そのままの表現を避けてここに記録します。
- businessModel: 主要な顧客であるCoupang, Inc.は、related-candidates.jsonに含まれない相手（日本の上場会社の一覧の対象ではない）のため、関連企業としては結ばず、顧客としての事実だけをflowに書きました。金額は書いていません。
- businessModel: ARRは年換算した社内の指標で売上収益そのものではないため、本文の金額としては使いませんでした。
- businessModel: 後発事象は、連結と個別のいずれも「該当事項はありません」と印字されています。
- businessModel: AdCreative.aiは2025年3月にADYOUNEED SASの買収で加わったプロダクトで、当期中に連結の範囲に加わった出来事として沿革にも収録しました。資本政策に関する事項はありません。
- businessStructure: 単一セグメント（AaaS事業）のため事業は1つにしました。childrenは【事業の内容】でプロダクトを分類する3つのクラウド（広告クラウド、パーソナライゼーションクラウド、データクラウド）で分け、区分ごとの金額は開示されていないため金額は書いていません。
- businessStructure: 連結子会社19社はすべてAaaS事業を担う会社か、グループ会社の統括本社機能を担うAppier Pte. Ltd.のため、独立した事業としては分けていません。
- businessStructure: nameは表紙の「Appier Group株式会社」から「株式会社」を除きました。listingsの市場区分は表紙の印字（東京証券取引所 プライム）どおりです。shortNameEnは省略しました。
- history: 2012年から2017年までの出来事は、沿革で「当社設立前（参考情報）」として印字された区間から採りました。
- history: 各地のオフィス設立（ホーチミン、シドニー、マニラなど多数）は、主な出来事を選ぶため個別には収録しませんでした。
- history: 沿革に資本金の金額は印字されていない行を選んでおり、金額は書いていません。
- industry: 主たる業界は、AaaS事業の単一セグメントでAIソフトウェアを提供する事業内容から、IT・ソフトウェアとしました。
- relatedCompanies: en（エン株式会社）: 「エン」はエンジニアなどの一般語の部分一致で、同社についての取引・提携・資本関係の記載はありません（ambiguous）。
- relatedCompanies: rhythm（リズム株式会社）: 一般語の部分一致にとどまり、同社についての記載はありません。
- relatedCompanies: land（株式会社ランド）: 「ランド」はブランドなどの一般語の部分一致で、同社についての記載はありません。
- relatedCompanies: port（ポート株式会社）: 「ポート」はサポートなどの一般語の部分一致で、同社についての記載はありません。
- relatedCompanies: base-4481（ベース株式会社）: 「ベース」はAIベースなどの一般語の部分一致で、同社についての記載はありません。
- relatedCompanies: insight（株式会社インサイト）: 「インサイト」は知見を表す一般語としての記載のみで、同社についての記載はありません。
- relatedCompanies: seki（セキ株式会社）: 一般語の部分一致にとどまり、同社についての記載はありません（ambiguous）。
- relatedCompanies: step（株式会社ステップ）: 「ステップ」は手順を表す一般語としての記載のみで、同社についての記載はありません。
- relatedCompanies: core（株式会社コア）: 「コア」はコアバリューなどの一般語の部分一致で、同社についての記載はありません（ambiguous）。
- relatedCompanies: freee（フリー株式会社）: 「フリー」はコア・フリー・キャッシュ・フローの語の部分一致で、同社についての記載はありません。
- relatedCompanies: cover（カバー株式会社）: 「カバー」は対象範囲を表す一般語の部分一致で、同社についての記載はありません。
- relatedCompanies: i-ll（株式会社アイル）: 大株主の名称の一部（アイルランド）の部分一致で、同社についての記載はありません。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション」は技術革新を表す一般語としての記載のみで、同社についての記載はありません。
- relatedCompanies: trust（株式会社トラスト）: コードリストになく、信託銀行の名称などの部分一致にとどまります。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」は方向性を表す一般語としての記載のみで、同社についての記載はありません。
- relatedCompanies: draft（株式会社ドラフト）: コードリストになく、報告書の草案を表す一般語としての記載のみです。
- relatedCompanies: ishin（イシン株式会社）: 一般語の部分一致にとどまり、同社についての記載はありません。
- relatedCompanies: rix（リックス株式会社）: マトリックスなどの語の部分一致で、同社についての記載はありません。
- relatedCompanies: the-lead（株式会社リード）: リードタイムなどの語の部分一致で、同社についての記載はありません。
- relatedCompanies: zero（株式会社ゼロ）: 「ゼロ」は金額が無いことを表す一般語としての記載のみで、同社についての記載はありません（ambiguous）。
- relatedCompanies: corona（株式会社コロナ）: 新型コロナウイルスの記載における部分一致で、同社についての記載はありません。
- relatedCompanies: hope（株式会社ホープ）: 住所の一部（サウスホープ・ストリート）の部分一致で、同社についての記載はありません。
- relatedCompanies: scroll（株式会社スクロール）: 画面のスクロールという動作の記載における部分一致で、同社についての記載はありません。
- relatedCompanies: transaction（株式会社トランザクション）: トランザクション・データという一般語の記載における部分一致で、同社についての記載はありません。
- relatedCompanies: 主要な顧客であるCoupang, Inc.は候補一覧に含まれないため結んでいません。連結子会社（Appier Pte. Ltd.、Appier, Inc.、Appier Japan株式会社など19社）はグループ内の会社のため結んでいません。
- terms: 用語候補: AaaS（Agentic AI as a Service。自律型AIをサービスとして提供する形態）、自律型AI（設定された目標に対して自ら計画を立て、ツールを使って完遂するAI）、フル・ファネル（潜在ユーザーの予測と獲得から維持と関係構築、販売までマーケティングの全プロセス）、CDP（カスタマー・データ・プラットフォーム）、深層学習（ニューラルネットワークにより機械学習を実装する手法）。いずれも助言のみで、用語の登録は行いません。
- terms: Wikipediaは日本の企業一覧の記事で、会社固有の補足がなかったため使用していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
