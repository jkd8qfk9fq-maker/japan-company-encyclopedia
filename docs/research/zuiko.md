# 瑞光 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社瑞光 |
| 証券コード | 6279 |
| docID（データを取り出した文書） | `S100Y3PF` |
| 原本 docID | `S100Y3PF` |
| 提出日（原本） | 2026-05-14 |
| 決算期 | 2026-02-20 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y3PF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社瑞光 / 6279 / docID S100Y3PF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
zuiko: 10 件の数値を有報XBRLと照合
有報: 株式会社瑞光 有価証券報告書－第63期(2025/02/21－2026/02/20) (docID S100Y3PF)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-02-20","previousFiling":-788076000,"latestFiling":-778314000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-02-20","previousFiling":-149489000,"latestFiling":-142524000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-02-20","previousFiling":52384739000,"latestFiling":52416915000},{"key":"NetAssetsSummaryOfBusinessResults|2025-02-20","previousFiling":34268592000,"latestFiling":34300768000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
zuiko: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の換算: 関連情報の千円額は百万円単位に切り捨てて記載した（例: 紙おむつ製造機械14,409,439千円→14,409百万円）。MD&Aに百万円で印字された数値（スパンレース事業の売上518百万円、売上高の前期比6.1％増など）は印字のまま引用した。
- businessModel: 第62期（2025年２月期）の親会社株主に帰属する当期純損失の計上理由として、経営指標等の注記に「連結子会社から当社への配当方針の見直しに伴い、子会社の留保利益に係る将来加算一時差異について繰延税金負債を計上したこと等による」と印字されている。同じ年度の注記は financialNotes では暫定的な会計処理の確定を優先したため、この理由は本 warnings に全文の趣旨を記録する。
- businessModel: 「第４次中期経営計画」の数値目標（最終年度の2028年２月期に売上高300億円、新規事業の売上高80億円、利益率８％以上）と、本中計期間中の株主還元に関する数値目標は、利益率や投資に関する指標を含むため本文と perspectives には書かず、ここに記録する。
- businessModel: ユニチカ株式会社からのスパンレース不織布事業の譲受に伴い負ののれん発生益1,925百万円が計上されているが、金額は取得原価の配分が完了していない暫定的な算出額である旨が注記されている。本文の記載対象の数値ではないため金額は本文に書かず、譲受の事実のみを沿革と事業構造に記載した。
- businessModel: 受注高22,246百万円と受注残高15,848百万円は本文の記載対象外の数値のため書いていない。
- businessModel: 期末後の自己株式の取得（2026年２月19日の取締役会決議に基づき、2026年２月25日に普通株式500,000株を取得）は資本政策に関する事項のため、本文には書かず本 warnings に記録する。
- businessModel: DELTA S.R.L.における買収前の事象に関する和解金の計上など、特別の損益の内訳は本文の記載対象外のため書いていない。
- businessStructure: 単一セグメントの会社であり、セグメント情報の記載自体が省略されている。事業の内訳は【関連情報】の製品及びサービスごとの情報（千円額を百万円に切り捨て）と、MD&Aの販売実績（製品別）に基づく。
- businessStructure: 「その他事業」は割合が僅少で金額が独立開示されていないため最後に置き、その旨を本文に明記した。スパンレース事業の売上高518百万円はMD&Aの百万円印字のまま引用した。
- businessStructure: 当社は衛生用品製造機械等の部品調達取引のある相手先から部品等を調達している（因幡電機産業株式会社、杉本商事株式会社。特定投資株式の保有目的の印字に基づく）。本ツリーのスキーマに suppliers のキーがないため、仕入先の事実は relatedCompanies と本 warnings に記録した。
- history: 沿革の年月は有報の印字どおり年単位に丸めて記載した（月は書かない規則）。各行の出来事は【沿革】で裏付けられるものだけを使った。
- history: スパンレース不織布事業の譲受は期中に完了し当期の structure に反映されているため needsReview ではなく沿革に記載した。譲受の対価などの金額は沿革に書かない規則のため記載していない。
- industry: 主たる業界は、事業の太宗を占める衛生用品製造機械（紙おむつ製造機械・生理用ナプキン製造機械等の一般産業用機械・装置）の製造・販売に基づき machinery とした。
- industry: スパンレース不織布の製造・販売は2026年１月に始まった新規事業で、当期の売上への算入は約２か月分にとどまり、金額も独立して開示されていないため、業界は付けなかった。
- industry: 事業の中心は machinery で言い表せるため taxonomyGaps はない。
- relatedCompanies: 株式会社三菱UFJフィナンシャル・グループ: 金融取引関係の維持・強化を目的に保有していたが、当事業年度に全て売却されており、保有株式もなくなったため結ばなかった。
- relatedCompanies: ユニチカ株式会社: スパンレース不織布事業の譲受先だが、related-candidates.json に含まれないため結ばなかった。譲受の事実は沿革と事業構造に記載した。
- relatedCompanies: 白十字株式会社: 2026年２月20日現在の大株主（2.33％）だが、related-candidates.json に含まれず、取引関係の記述も確認できないため結ばなかった。
- relatedCompanies: キャリア、ポート、エン、イノベーション、日新、セキ、トラスト、ガーデン、高速、レイ、住友不動産: 社名の断片が一般語や住所表記などに一致しただけで、当社との取引・提携・資本関係を述べる記述がないため結ばなかった（住友不動産はユニ・チャーム株式会社の住所表記に現れるのみ）。
- relatedCompanies: 子会社13社と関連会社１社（PROGA ZUIKO CORPORATION）は当社グループの会社であるため、関連企業としては結ばなかった。
- relatedCompanies: ユニ・チャーム株式会社は大株主でもあるが、主要な顧客としての販売取引の根拠が最も具体的であるため customer として結び、大株主である事実は説明文に併記した。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語の説明は有報の記述に基づく助言であり、有報に数値は使っていない。

## 要確認（status に反映）

- businessStructure: スパンレース不織布事業は2026年１月１日の事業譲受により当期は「その他の事業」に含まれているが、MD&Aに「2026年度からは別個のセグメントとしてお示しします」と印字されており、翌期から表示区分が変わる予定である。当期は有報の表示どおりに登録した。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
