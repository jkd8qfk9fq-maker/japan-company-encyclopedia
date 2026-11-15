# スミダコーポレーション — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | スミダコーポレーション株式会社 |
| 証券コード | 6817 |
| docID（データを取り出した文書） | `S100XQT8` |
| 原本 docID | `S100XQT8` |
| 提出日（原本） | 2026-03-16 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XQT8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | スミダコーポレーション株式会社 / 6817 / docID S100XQT8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sumida: 10 件の数値を有報XBRLと照合
有報: スミダコーポレーション株式会社 有価証券報告書－第71期(2025/01/01－2025/12/31) (docID S100XQT8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sumida: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空にしました： 決算期の変更・変則決算・会計基準の変更はなく、修正再表示チェックも前期有報と重複する年度がすべて一致しています。セグメント注記の地域別情報で前年の「メキシコ」の組み替え表示がありますが、表示方法の変更のみで数値の修正ではないため入れていません。
- businessModel: 本文の財務数値は売上収益と親会社の所有者に帰属する当期利益だけにしました。中期経営計画2026-2028の数値目標のうち、営業利益・EPS・ROIC等の目標は投資や利益の語にあたるため strategy には書かず、売上収益の目標だけを書きました。
- businessModel: 売上収益の10％以上を占める顧客グループが1グループありますが、有報に社名の印字がないため customers には名前を書いていません。
- businessModel: MD&AにあるSchmidbauerの株式取得割合（発行済株式80％）は、関係会社の状況では議決権の所有割合78.4％と印字が異なります。本文ではどちらの数値も使っていません。
- businessStructure: name は表紙の「スミダコーポレーション株式会社」から「株式会社」を除きました。listings の市場区分は表紙の印字（東京証券取引所プライム市場）どおりです。
- businessStructure: 事業の並びは、セグメント情報の外部顧客への売上収益（2025年12月期）の大きい順（アジア・パシフィック事業→EU事業）としました。金額はセグメント注記の印字どおりで、セグメント利益は書いていません。
- businessStructure: 用途別の売上収益（車載関連85,415百万円・インダストリー関連39,312百万円・家電関連22,466百万円）は全社単位の開示でセグメント別ではないため、children には分けず businessModel 側で扱いました。
- history: 沿革は【沿革】の印字から主要な出来事を選びました。年月は年だけを year に入れ、月は書いていません。
- history: 省いたもの： 本社移転（1961年）、シンガポール支店開設（1987年）、米国販売子会社設立（1990年）、仙台技術センター開設（1995年）、米国統括会社設立（1999年）、上海・韓国・台湾の販売子会社設立（2005〜2007年）、ルーマニア・広西の拠点設立（2008年）、国内子会社の株式取得・合併（2008〜2010年）、中国各地の生産子会社設立（2010〜2013年）、ベトナム第2工場（2015年）、ミクロネシアの保険子会社（2015年）、オランダの金融統括会社（2009年）、インド子会社設立（2019年）、グループ内合併（2021年）など、拠点設立やグループ内再編の細目です。
- industry: 主たる業界は、コイル関連の電子部品の開発・製造・販売が事業の中心であるため electronics（電機）としました。報告セグメントは地域別（アジア・パシフィック事業／EU事業）で、どちらの事業も電子部品を扱っています。
- industry: 車載関連が売上収益の約6割を占めますが、自動車そのものではなく電子部品のメーカーであるため automotive は付けていません。
- relatedCompanies: ポート（ポート株式会社）： 「サポート」など一般語の部分一致のみで、有報は同社について取引・提携・資本関係を述べていないため結びませんでした。
- relatedCompanies: ステップ（株式会社ステップ）： 収益認識の「5ステップアプローチ」の語句の一致のみのため結びませんでした。
- relatedCompanies: ランド（株式会社ランド）： 「ブランド」の部分一致のみのため結びませんでした。
- relatedCompanies: セキ（セキ株式会社）： ambiguous で、「セキュリティ」等の語句の一致のみのため結びませんでした。
- relatedCompanies: ビジョン（株式会社ビジョン）： 経営方針の「ビジョン」という語の一致のみのため結びませんでした。
- relatedCompanies: ベース（ベース株式会社）： 「連結ベース」の語句の一致のみのため結びませんでした。
- relatedCompanies: エン（エン株式会社）： ambiguous で、「エンゲージメント」等の部分一致のみのため結びませんでした。
- relatedCompanies: 日新（株式会社日新）： ambiguous でコードリストにもなく、社名としての記載がないため結びませんでした。
- relatedCompanies: トラスト（株式会社トラスト）： 大株主の日本マスタートラスト信託銀行（信託口）の名称の一部で、同社そのものではなく、信託口の純投資のため結びませんでした。
- relatedCompanies: コモ（株式会社コモ）： ambiguous で、「コモンモードコイル」の部分一致のみのため結びませんでした。
- relatedCompanies: 高速（株式会社高速）： ambiguous で、「プロセス高速化」の語句の一致のみのため結びませんでした。
- relatedCompanies: パス（パス株式会社）： ambiguous で、「パスワード」の部分一致のみのため結びませんでした。
- relatedCompanies: レイ（株式会社レイ）： ambiguous で、「レイアウト」の部分一致のみのため結びませんでした。
- relatedCompanies: 【関係会社の状況】に載る相手はすべて連結子会社（未上場）で、掲載済み企業の候補にはありません。2025年10月に子会社化したSchmidbauer Transformatoren- und Gerätebau GmbHも未上場のため結んでいません。
- relatedCompanies: 株式会社三菱UFJ銀行はシンジケートローンのアレンジャー（資金調達）であり、重要な契約等に記載がありますが、資金調達が理由のため結びませんでした。
- terms: 用語候補： コイル（電線を巻いた部品で、インダクタやトランスの基本要素）、インダクタ（電流の変化を妨げる働きを持つ受動部品）、チョークコイル（ノイズを抑えるためのコイル）、地産地消（需要のある地域の中で設計・製造・販売を完結させる体制）、集合技術（同社が呼ぶ、コイルに関わる8つの要素技術の総称）——いずれも有報の本文で同社が繰り返し使う語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
