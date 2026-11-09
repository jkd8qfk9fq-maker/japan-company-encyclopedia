# 三浦工業 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三浦工業株式会社 |
| 証券コード | 6005 |
| docID（データを取り出した文書） | `S100YEGC` |
| 原本 docID | `S100YEGC` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEGC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三浦工業株式会社 / 6005 / docID S100YEGC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
miura: 10 件の数値を有報XBRLと照合
有報: 三浦工業株式会社 有価証券報告書－第68期(2025/04/01－2026/03/31) (docID S100YEGC)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":23312000000,"latestFiling":22884000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":29629000000,"latestFiling":29202000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":439572000000,"latestFiling":439144000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":204146000000,"latestFiling":203719000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
miura: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…テナンスなどの費用を差し引いた残りが利益になります。2026年3月期のは27…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで前期有報との差異があった2025年3月期の数値（純利益・税引前利益・総資産・純資産）は、株式会社ダイキンアプライドシステムズの持分法適用会社化に係る暫定的な会計処理を当期に確定させたことによる遡及修正であり、有報の経営指標の注記と財政状態計算書の注記に明記されている。理由が有報で特定できるため needsReview には入れず、financialNotes に記録した。コベルコ・コンプレッサに係る2022年3月期の遡及修正も同様に financialNotes に記録した。
- businessModel: 中期経営計画の目標のうち営業利益の目標値は、本文に書けない利益の指標であるため perspectives には記載せず、売上収益の目標だけを取り上げた。
- businessModel: Wikipedia（三浦工業）は冒頭に小型貫流式蒸気ボイラーのシェアなどの順位・シェア情報しか補足がなく、規則上使えないため使用しなかった。記載内容はすべて有報に基づく。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」、重要な契約等も「該当事項はありません」であり、提出後の予定事項はない。
- businessStructure: 報告セグメントは2026年3月期から、従来の「国内機器販売事業」「国内メンテナンス事業」「海外機器販売事業」「海外メンテナンス事業」の4区分から「日本国内事業」「米州事業」「アジアその他事業」の3つの地域別区分に変更された。前期のセグメント情報は変更後の区分で作成されているため、本登録も変更後の区分で記録した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上収益（2026年3月期: 日本国内138,818百万円、米州91,264百万円、アジアその他38,617百万円）の大きい順とした。セグメント利益は規則により記載していない。
- businessStructure: 製品区分（ボイラ等、水管ボイラ及び冷熱機器等、メンテナンス、その他）はグループ全体でのみ開示され地域別には分かれていないため、children にはせず、各事業の products に【事業の内容】の地域別の主な事業内容を反映した。
- history: 沿革は有報の記載どおり、実質上の存続会社（三浦製作所の系譜）について記載した。形式上の存続会社（大栄商事株式会社、後のミウラ産業株式会社）との1981年の合併の経緯は、有報の沿革冒頭の注記に記載のとおりである。
- history: 設立時・増資時の資本金の金額は、本文の規則（金額は売上高と純利益だけ）により記載していない。
- history: 沿革の全行は採用せず、創業・主力製品の開始・上場・事業の拡大につながる子会社化と持分法適用会社化を中心に15件を選んだ。
- industry: 主たる業界は machinery: ボイラ及び関連機器等の製造販売・メンテナンスが事業の中心で、報告セグメントは地域別（日本国内・米州・アジアその他）だが、いずれも同じ機器事業である。機器の供給であってエネルギーの供給事業ではないため energy は付けず、水処理装置・食品機器・メディカル機器なども機器製造の一部であり独立した売上開示がないため、2つ目の業界は付けなかった。
- relatedCompanies: 結んだ関連企業は1社（daikin-industries、major-shareholder）。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: daikin-industries の種別判断: 【関係会社の状況】の4区分には当たらず、【大株主の状況】に載る事業会社であるため major-shareholder とした。持分法適用会社である株式会社ダイキンアプライドシステムズ自体は非上場で候補にない。
- relatedCompanies: applied: 株式会社アプライドではなく、持分法適用会社である株式会社ダイキンアプライドシステムズ（非上場）への言及であり、別会社であるため結ばない。
- relatedCompanies: nac: 持分法適用会社のアイナックス稲本株式会社（非上場）の名称の断片であり、株式会社ナックへの言及はないため結ばない。
- relatedCompanies: en・core・step・seki・base-4481・career・land・freee・corona・cover・oxide・slogan・ricoh・zett: いずれも文中の一般語句や自社グループ会社名の断片一致（トータスエンジニアリング、ステップ1、連結ベース、キャリア育成、コインランドリー、オイルフリー、新型コロナウイルス、賠償責任保険でカバー、エチレンオキサイド、スローガンに、リコール、旧子会社の株式会社ゼットシステム等）で、各候補会社への言及はないため結ばない。
- relatedCompanies: nissin・trust: 日新はコードリストになく文脈も新株予約権等の記載の断片、トラストは日本マスタートラスト信託銀行（信託口）の名称の断片であり、信託口は結ばない。
- relatedCompanies: iyogin-holdings・the-ehime-bank: いよぎんホールディングスは特定投資株式の保有目的が「取引先（金融機関）」であり、愛媛銀行・伊予銀行は大株主に載るが金融機関であるため結ばない。
- relatedCompanies: dai-ichi-life-holdings: 特定投資株式として保有する生命保険会社であり、保険取引が理由の金融機関は結ばない。
- relatedCompanies: link-and-motivation: サステナビリティの記述でエンゲージメント測定ツール「モチベーションクラウド」の利用が述べられるだけで、取引・提携の明示がないため結ばない。
- relatedCompanies: noritz・ono-pharmaceutical・tokyo-gas・ibiden・bourbon・dainichiseika-color-and-chemicals-mfg・dynic・fujicco・iwatani・kikkoman・marudai-food・nakanishi-mfg・nitto-kogyo・osaka-gas・osaka-soda・toppan-holdings・totech・yakult-honsha・yoshitake: いずれも特定投資株式の表に載るだけで、保有目的は全銘柄共通の定型句（取引先（販売先）または仕入先として、事業上の取引関係を維持・強化するために株式を保有）のみであり、相手固有の取引・提携の記載がないため結ばない。
- relatedCompanies: hisamitsu-pharmaceutical: コードリストになく、当事業年度に全株式を売却済みであるため結ばない。
- relatedCompanies: mitsubishi-corporation: 金融商品注記で公正価値測定の株式として金額が載るだけで、個別の取引・提携の記載がないため結ばない。
- relatedCompanies: 候補にない関係会社: 持分法適用会社のコベルコ・コンプレッサ株式会社（49.0％）とJENSEN-GROUP NV（ベルギー、20％）、アイナックス稲本株式会社（51.0％）は、いずれも候補リストになく（非上場または海外上場）結べない。連結子会社59社はすべて非上場で候補にない。
- terms: 登録候補（助言のみ）: 貫流ボイラ（水管内を水が一度だけ通過する間に蒸気を発生させるボイラ。同社の主力製品）、ZMP（有償保守管理契約。ボイラなどの保守を契約で継続的に提供する仕組み）、バラスト水処理装置（船舶のバラスト水を処理して排出基準に適合させる装置）、トータルソリューション（熱・水・環境の製品とサービスを組み合わせて顧客の課題を解決する提案）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
