# ユニバーサルエンターテインメント — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ユニバーサルエンターテインメント |
| 証券コード | 6425 |
| docID（データを取り出した文書） | `S100XVDD` |
| 原本 docID | `S100XVDD` |
| 提出日（原本） | 2026-03-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XS54（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVDD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ユニバーサルエンターテインメント / 6425 / docID S100XVDD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
universal-entertainment: 10 件の数値を有報XBRLと照合
有報: 株式会社ユニバーサルエンターテインメント 有価証券報告書－第53期(2025/01/01－2025/12/31) (docID S100XVDD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第52期(2024/01/01－2024/12/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
universal-entertainment: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 第52期の訂正有価証券報告書（S100XS54、2026-03-19提出）の訂正内容をEDINETの原本XBRLで確認しました。訂正は関連当事者注記の関係会社長期預り金（EAGLEⅠ LAND HOLDINGS,INC.分、18,333百万円から38,351百万円への修正）と担保資産・担保付債務の注記の拡充で、5年間の連結経営指標等（売上高、純利益、総資産、純資産、従業員数）は原本・訂正後・当有報のいずれも一致しており、本登録で用いる数値への影響はありません。当有報は訂正後の38,351百万円を記載しています。
- businessModel: 連結経営指標等の注記により、「収益認識に関する会計基準」等を第50期（2022年12月期）の期首から適用しており、第50期以降の指標は適用後の数値です。
- businessModel: 経営指標の数値目標は本文の規則により記載していません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」でした。
- businessStructure: 報告セグメントごとの外部顧客への売上高（遊技機事業56,708百万円、統合型リゾート(IR)事業65,409百万円、その他534百万円）の合計は122,651百万円ですが、有報の印字する合計は122,653百万円で、2百万円の差があります。百万円単位への丸めによるもので、有報の印字どおりに記載しています。
- businessStructure: 報告セグメントに帰属しない全社収益174百万円（主に報告セグメントに帰属しない美術館の収入）は、いずれの事業にも配分していません。
- businessStructure: 「その他」の区分は報告セグメントに含まれない事業セグメントのため、売上順にかかわらず最後に配置しています。
- history: 沿革表は年月65件の印字に対し、同一セルに2件の事象が連結された箇所4件（1975年9月の大阪営業所開設と小山新工場建設、1988年4月の高輪本社ビル建設と米子工場取得、2007年4月の事業譲渡とアルゼメディアネット新設、2008年8月のプロビジョナルライセンス取得とAruze Gaming Americaの第三者割当増資）を分割し、計69件としました。1993年4月の吸収合併と消滅は同一の事象として1件にまとめています。
- history: Wikipediaの記事冒頭は本社所在地と遊技機メーカーとしての位置づけのみで、いずれも有報で確認できる内容のため使用していません。
- industry: 主たる業界は、売上高の最も大きな統合型リゾート(IR)事業と遊技機事業のいずれもエンターテインメントに属するため、エンターテインメントとしました。メディアコンテンツ事業は「その他」の区分（売上高534百万円）に含まれる小規模な事業のため、2つ目の業界は付けていません。
- relatedCompanies: en（エン株式会社）：「エンターテインメント」の部分一致で、ambiguousのため結ばない。
- relatedCompanies: tein（株式会社テイン）：「エンターテインメント」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: base-4481（ベース株式会社）：「時価ベース」などの一般語の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: seki（セキ株式会社）：ambiguousで、「セキュリティ」などの部分一致のため結ばない。
- relatedCompanies: frontier（株式会社フロンティア）：本店所在地「有明フロンティアビル」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: king（株式会社キング）：製品名「eシャーマンキング」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: lec（レック株式会社）：製品名「マギアレコード」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: ray（株式会社レイ）：ambiguousで、「スロットストリート」などの部分一致のため結ばない。
- relatedCompanies: cover（カバー株式会社）：「元利金弁済カバー率」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: land（株式会社ランド）：一般語の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: suzuki-6785（株式会社鈴木）：社外取締役の氏名「鈴木誠」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: amuse（株式会社アミューズ）：「アミューズメント機」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: corona（株式会社コロナ）：「新型コロナウイルス感染症」の一般語で、同社そのものの記載ではないため結ばない。
- relatedCompanies: ficha（フィーチャ株式会社）：「フィーチャーした」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: innovation（株式会社イノベーション）：「イノベーションの推進」の一般語で、同社そのものの記載ではないため結ばない。
- relatedCompanies: no-1（株式会社No．1）：「市場シェアNo.1」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: rion（リオン株式会社）：製品名「ミリオンゴッド」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: visional（ビジョナル株式会社）：「プロビジョナルライセンス」の部分一致で、同社そのものの記載ではないため結ばない。
- relatedCompanies: 親会社のOkada Holdings Limited（香港、議決権70.2％を被所有）は非上場で候補データになく、EDINETコードリストで検証できないため結ばず、ここに記録する。
- relatedCompanies: 持分法適用関連会社のジーグ合同会社（議決権50.0％、サミー株式会社との合弁）は、合弁相手のサミー株式会社が非上場の子会社で候補データになく結べないため、ここに記録する。
- relatedCompanies: 持分法適用関連会社のEAGLEⅠ LAND HOLDINGS,INC.（フィリピン、議決権40.0％）は非上場で候補データになく結べないため、ここに記録する。
- relatedCompanies: 連結子会社の㈱メーシー、㈱エレコ、㈱ミズホ、㈱アクロス、㈱ユニバーサルブロス、TIGER RESORT, LEISURE AND ENTERTAINMENT, INC.などはいずれも非上場で候補データになく、関連企業としては結ばない。
- terms: 助言: 用語「スマートパチスロ」（スマートパチスロの普及が遊技機事業の業績を牽引している中核概念）は、この会社の中核事業を示す語として用語集への追加候補と考える。
- terms: 助言: 用語「統合型リゾート（IR）」（フィリピンのオカダ・マニラを運営する中核事業を示す語）は、この会社の中核事業を示す語として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
