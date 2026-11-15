# ヒロセ通商 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ヒロセ通商株式会社 |
| 証券コード | 7185 |
| docID（データを取り出した文書） | `S100YJPR` |
| 原本 docID | `S100YJPR` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJPR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ヒロセ通商株式会社 / 7185 / docID S100YJPR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hirose-tusyo: 10 件の数値を有報XBRLと照合
有報: ヒロセ通商株式会社 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YJPR)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hirose-tusyo: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は付けていません：主要な経営指標等の注記は従業員数の定義のみで、会計基準の変更・表示方法の変更等の注記はなく、前期有報との修正再表示チェックも全系列で差異ゼロでした。
- businessModel: MD&Aの利益系の金額と増減理由（営業利益・経常利益等）は規則により本文に書いていません。純利益の前期比増減率は印字どおり本文外でも使っていません。
- businessModel: Wikipedia「ヒロセ通商」の冒頭は有報の事実の言い換えのみで、補足として使える有報外の事実が無かったため使いませんでした（出典も追加していません）。
- businessModel: カバー先の金融機関は「国内外の銀行等金融機関20社以上」とだけ印字され個別名が無いため、関連企業には結んでいません。
- businessModel: MD&Aの販売実績に印字された営業収益の内訳（トレーディング損益10,395百万円、金融収益95百万円）は、利益系の語を含む区分名のため本文には書かず、記録のみとしました。
- businessStructure: 単一セグメントの会社です。有報は「事業セグメントは金融商品取引事業を主要な事業としており、他の事業セグメントの重要性が乏しいため記載を省略」と明記し、関連情報の製品・サービス別情報も単一区分が90%超のため省略されているため、children は【事業の内容】の商品・サービス区分で構成し、各区分の金額は開示されていない旨を明記しました。
- businessStructure: 供給者（suppliers）はこのツリーの旧スキーマに無いため書いていません。顧客の注文のカバー先は国内外の銀行等金融機関20社以上とだけ印字され、個別名は開示されていません。
- businessStructure: 連結子会社のうち HIROSE TRADING HK LIMITED（2025年1月15日の取締役会で解散・清算を決議）と HIROSE FINANCIAL LIMITED（2025年12月15日の取締役会で解散・清算を決議）は期末時点で清算手続中ですが、期末現在の連結子会社として【関係会社の状況】に載っているため、期末構造のまま登録しています。LION PAYMENT UK LTD.は当期に清算結了し連結から除外されています。
- history: 沿革の各行の資本金の金額は規則により落としました（設立時の資本金、海外子会社の資本金等）。
- history: 落とした行：個別の取引ツールの提供開始・終了の細目（Hirose-FX、HiroseTrader、LION FX C2、LION Tab、LION FX5、シグナル発注、LION BO等の一部）、上海代表処の開設（2012年）、プライバシーマーク認証取得（2012年）、らいおん保育園の開園・分社化・清算（2013〜2018年）、ライオンコイン株式会社の設立・解散・清算（2018〜2020年）、日本証券業協会への加入（2021年）、LION PAYMENT UK LTD.の設立（2019年）と清算結了（2026年2月）。主要な節目に絞っています。
- industry: 主たる業界は、唯一の事業である金融商品取引事業（外国為替証拠金取引・CFD取引）に対応する finance です。閉じた分類に直接当てはまるため、暫定分類は付けていません。
- relatedCompanies: cover（カバー）: 「カバー取引」「カウンターパーティ」等の一般語の一致であり、カバー株式会社との関係は印字されていないため結んでいません。
- relatedCompanies: port（ポート）: 「サポート」等の一般語の部分一致のため結んでいません。
- relatedCompanies: zero（ゼロ）: 証拠金の計算式中の「ゼロとする」という一般語の一致（ambiguous）であり、株式会社ゼロとの関係は印字されていないため結んでいません。
- relatedCompanies: land（ランド）: 「ブランド」等の一般語の部分一致のため結んでいません。
- relatedCompanies: lion（ライオン）: 「LION FX」等の自社ブランド名と連結子会社だったライオンコイン株式会社の社名の一致であり、ライオン株式会社との関係は印字されていないため結んでいません。
- relatedCompanies: en（エン）: 一般語の部分一致（ambiguous）のため結んでいません。
- relatedCompanies: kohsoku（高速）: 「高速約定処理」という一般語の一致（ambiguous）のため結んでいません。
- relatedCompanies: nix（ニックス）: 2011年10月にカバー取引を開始したフェニックス証券株式会社の社名の部分一致であり、株式会社ニックスとは別の会社です。フェニックス証券自体も候補にないため結んでいません。
- relatedCompanies: rent（レント）: 「カレント」等の一般語の部分一致のため結んでいません。
- relatedCompanies: will（ウィル）: 「コンピュータウィルス」という一般語の部分一致のため結んでいません。
- relatedCompanies: 株式会社三井住友銀行: 顧客区分管理信託契約とボンド・ファシリティ契約の相手方ですが、顧客資産の分別管理と銀行保証に関する金融機関との契約であり、候補にもないため結んでいません。SBIクリアリング信託株式会社も同様に候補にありません。
- relatedCompanies: 岡三証券株式会社（旧岡三オンライン証券）: 2012年5月にホワイトラベルサービスの提供を開始したことが沿革に印字されていますが、候補にないため結んでいません。
- relatedCompanies: エース交易株式会社: 2011年6月に外国為替証拠金取引事業の顧客口座の移管を受けた相手ですが、候補にないため結んでいません。
- relatedCompanies: Maicos International Company Limited: 2026年3月31日現在の大株主（1.52%）ですが、候補にないため結んでいません。その他の大株主は個人です。
- terms: 用語の助言のみです。対象となりうる用語は「カバー取引（顧客の注文による為替変動リスクを避けるためカウンターパーティへ同じ注文を出すこと）」「為替マリー（社内で売り注文と買い注文を相殺すること）」「スワップポイント（2国間の金利差）」「ロスカット（有効比率が100%を下回ると自動で全ポジションを決済する仕組み）」「ホワイトラベルサービス（自社システムを他社ブランドで提供する仕組み）」「カウンターパーティ（取引の相手方）」です。本文には定義を書いていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
