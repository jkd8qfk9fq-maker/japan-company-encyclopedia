# ルネサンス — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ルネサンス |
| 証券コード | 2378 |
| docID（データを取り出した文書） | `S100YK5N` |
| 原本 docID | `S100YK5N` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK5N.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 株式会社ルネサンス / 2378 / docID S100YK5N |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
renaissance: 10 件の数値を有報XBRLと照合
有報: 株式会社ルネサンス 有価証券報告書－第44期(2025/04/01－2026/03/31) (docID S100YK5N)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
renaissance: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 株式会社楓の風の完全子会社化（2025年12月1日、全株式取得。みなし取得日は2025年12月31日）により、同社の業績は2026年1月1日から2026年3月31日までが連結の範囲に含まれている。取得原価の配分は暫定的な会計処理によっている（企業結合関係の注記）。financialNotesは同年度1件のみ残る仕様のため、この事実はここに全文を記録した。
- businessModel: 調達先について有報に一般名詞での記載がないため、suppliersは書かなかった。
- businessModel: 中期経営計画の2030年度の目標数値（売上高、営業利益、自己資本比率、ROE、配当性向等）は投資指標・目標値のため、perspectivesには転記せず、計画の定性的な内容のみを書いた。
- businessModel: 2023年3月期の当期純損失の要因は本有報に記載がないため、financialNotesには書かなかった。
- businessModel: 大株主のAAGS S3,L.P.は株式会社アドバンテッジパートナーズがサービスを提供するファンドで、A種種類株式2,092千株（発行済株式総数に対する割合9.95%）を保有している。同社との事業提携契約は2022年11月11日締結で、期間は2027年1月31日または資本提携の終了日のいずれか早い日まで。同社とアドバンテッジパートナーズはいずれも非上場のため、関連企業には結んでいない。
- businessStructure: 報告セグメントは「スポーツクラブ運営事業」のみのため、子事業は収益認識関係の収益分解情報の区分で分け、金額は外部顧客への売上高（千円を百万円に切り捨て）を書いた。
- businessStructure: 収益分解情報の「その他の収入」（駐車場、パーソナルレッスン等、5,161百万円）と「その他の収益」（239百万円）は独立した事業区分ではないため子事業にしなかった。子事業の金額の合計（59,529百万円）と売上高（64,933百万円）との差は、この2項目と切り捨ての差による。
- businessStructure: アウトドアフィットネスは【事業の内容】に独立した事業として記載があるが、収益分解情報に独立した金額がないため、金額を書かず最後に置いた。
- businessStructure: 収益分解情報の区分は当期に株式会社スポーツオアシスの吸収合併及び組織変更に伴い変更され、前連結会計年度分は変更後の区分に組替えられている。5年間の売上高と純利益の合計値には影響しないため、financialNotesには書かず、この記録にとどめた。
- history: 沿革のうち伊王島リゾート開発（1989年設立、2002年閉鎖）、ルネサンス棚倉（1990年）、シナプソロジー研究所の韓国マスター代理店契約（2018年）、沖縄出店（2018年）、健康経営宣言（2016年、元氣ジムの項目に併記）などは、現在の事業体制を理解するうえで補助的なため一部を省略または併記した。
- history: 1991年の株式会社リーヴ・スポーツ設立（合弁）は、2008年の合併の項目に併記した。
- industry: スポーツクラブ・フィットネス施設の運営に当たる業界区分が値リストにないため、余暇・レジャーサービスとして最も近いentertainmentを暫定の主分類とした。介護リハビリ事業は売上高の構成比が小さい（2,467百万円）ため副分類は付けなかった。
- relatedCompanies: sompo-holdings: 大株主の状況にSOMPOホールディングス株式会社（7.63%）が載るが、保険持株会社であり、有報に取引関係や提携の記述がないため結ばなかった。
- relatedCompanies: tokyu: 株式会社東急スポーツオアシスは2025年4月に吸収合併済みであり、東急スポーツシステム株式会社からの施設譲受（2026年7月1日付予定）は一回限りの資産の譲受のため結ばなかった。候補はambiguousでもある。
- relatedCompanies: aeon-mall: 施設名（イオンモール内のクラブ名）の中に現れるだけで、取引関係や提携の記述がないため結ばなかった。
- relatedCompanies: central-sports、konami-group、twenty-four-seven-holdings: 特定投資株式として少数の株式を「同業他社の情報収集」を目的に保有するだけで、取引関係の記述がないため結ばなかった。
- relatedCompanies: mitsubishi-estate: 1991年の合弁会社設立と2008年の合併という過去の出来事のみで、現在の関係の記述がないため結ばなかった。
- relatedCompanies: japan-tobacco: 2000年に子会社と合併した過去の出来事のみのため結ばなかった。
- relatedCompanies: sumitomo-corporation: 2006年の株式譲受という一回限りの過去の取引のみのため結ばなかった。
- relatedCompanies: teijin: 2004年の株式譲受という一回限りの過去の取引のみのため結ばなかった。候補はambiguousでもある。
- relatedCompanies: 連結子会社の株式会社楓の風、株式会社BEACH TOWN、RENAISSANCE VIETNAM, INC.は自社の子会社のため結ばず、businessStructureに記載した。
- relatedCompanies: step、port、base-4481、career、freee、innovation、king、corona、cover、space、vision、ray、seki、daiwa、core、trustは、一般語句の一部への部分一致による誤検出で、会社への言及ではないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 提出後の構造変更：東急株式会社の完全子会社である東急スポーツシステム株式会社が運営する総合スポーツクラブ等8施設を、2026年7月1日付で譲り受けることを決定している。本登録は2026年3月31日現在の体制に基づく。
- businessModel: 提出後の構造変更：株式会社レーベンコミュニティが運営する通所介護施設「マイリハ」5施設の事業譲受を決定している（2026年4月1日付）。本登録は2026年3月31日現在の体制に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ルネサンスの主事業（スポーツクラブ運営事業） → 提案: スポーツ・フィットネス。スポーツクラブやフィットネス施設の運営に当たる区分がなく、余暇サービスとして最も近いentertainmentを暫定としたため
