# 亀田製菓 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 亀田製菓株式会社 |
| 証券コード | 2220 |
| docID（データを取り出した文書） | `S100YEEA` |
| 原本 docID | `S100YEEA` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEEA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 亀田製菓株式会社 / 2220 / docID S100YEEA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kameda-seika: 10 件の数値を有報XBRLと照合
有報: 亀田製菓株式会社 有価証券報告書－第69期(2025/04/01－2026/03/31) (docID S100YEEA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kameda-seika: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空としました：決算期の変更や会計基準の変更はなく、前期有報との修正再表示チェックは重複する8行すべて一致しました。セグメント注記の地域ごとの情報で、米国を「その他」から独立掲記した表示方法の変更に伴う前年度数値の組替えがありますが、売上高・純利益の数値への影響はないため warnings に記録しました。
- businessModel: 2026年3月期の純利益の大幅な増加は、TH FOODS, INC.の完全子会社化に伴う段階取得に係る差益の計上が主因とMD&Aに印字されています。差益の金額は本文ルール（本文の財務数値は売上高と当期純利益だけ）のため本文には書かず、ここに記録しました。
- businessModel: THAI KAMEDA CO., LTD.は、現地の法律にしたがい必要な手続きが完了次第、清算結了となる予定ですが、具体的な日程は未定と有報に注記されています（完了したとは書いていません）。
- businessStructure: 報告セグメントは国内米菓事業・海外事業・食品事業の3つで、並び順はセグメント情報の外部顧客への売上高の大きい順としました。「その他」は報告セグメントに含まれないため最後尾に置きました。
- businessStructure: セグメント利益は本文ルールのため記載していません。
- businessStructure: 各事業の内訳（ブランド・地域・製品）は金額が区分ごとに開示されていないため、金額を書かず、その旨を各 children に明記しました。
- businessStructure: THAI KAMEDA CO., LTD.は清算結了予定（日程未定）と有報に注記されていますが、現時点では海外事業の連結子会社として記載しました。
- history: 沿革は有報の【沿革】の印字から主要な出来事を選んで記載しました。本社移転や工場新設、認証取得などの細目は省略しました。
- history: 2025年の出来事は2件（5月 Mary's Gone Crackers, Inc.株式譲渡、6月 TH FOODS, INC.及びWatch City Properties, LLC.子会社化）を年単位でまとめました。
- industry: 主たる業界は、米菓と食品で連結売上高のほぼ全てを占めるため food としました。
- industry: 海外事業も米菓等の製造販売であり、食品事業と一体のため、業界は food の1つだけとしました。
- relatedCompanies: 三菱商事（mitsubishi-corporation）: 米国のTH FOODS, INC.への共同出資の相手でしたが、2025年6月に同社等の保有株式をすべて取得して完全子会社化が完了し、資本関係は解消済みです。現在の継続的な取引・提携を述べる印字がないため不採用としました。
- relatedCompanies: 第四北越フィナンシャルグループ（daishi-hokuetsu-financial-group）・みずほフィナンシャルグループ（mizuho-financial-group）・三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）: 金融機関で、大株主の状況・特定投資株式・資金調達の文脈にのみ現れるため不採用としました。
- relatedCompanies: セブン＆アイ・ホールディングス（seven-and-i-holdings）・ライフコーポレーション（life）・アクシアル リテイリング（axial-retailing）・江崎グリコ（ezaki-glico）・明治ホールディングス（meiji-holdings）・ユナイテッド・スーパーマーケット・ホールディングス（united-super-markets-holdings）・バローホールディングス（valor-holdings）・マミーマートホールディングス（mammy-mart-holding）・フジ（fuji-8278）・アルビス（albis）・エコス（eco-s）・スリーエフ（three-f）・マルヨシセンター（maruyoshi-center）・ヤマナカ（yamanaka）・ヤマザワ（yamazawa）・リテールパートナーズ（retail-partners）・イオン北海道（aeon-hokkaido）・一正蒲鉾（ichimasa-kamaboko）・イチネンホールディングス（ichinen-holdings）・J-オイルミルズ（j-oil-mills）・岡三証券グループ（okasan-securities-group）・マルイチ産商（maruichi）・セントラルフォレストグループ（central-forest-group）: 特定投資株式の表に載り、保有目的は「当グループの製品の販売先であり、取引関係の維持・強化のため」等の全銘柄共通の定型句のみで、その相手についての具体的な取引・提携の印字がないため不採用としました。
- relatedCompanies: 東北電力（tohoku-electric-power）: サステナビリティの文脈で同社が提供するCO2フリー電気の利用に触れているのみで、取引関係を述べる印字ではないため不採用としました。
- relatedCompanies: 日新（nissin）: 連結子会社である株式会社日新製菓の部分一致で、候補の株式会社日新とは別の会社です。候補の listing もコードリストにないため不採用としました。
- relatedCompanies: ランド（land）・エン（en）・ポート（port）・ベースフード（base-food）・ビジョン（vision）・キャリア（career）・パス（path）・フリー（freee）・セキ（seki）・トライト（tryt）・ナック（nac）・コロナ（corona）・イシン（ishin）・レック（lec）・コア（core）・ゼロ（zero）: 一般語・部分一致の誤マッチ（ブランド、エンジニアリング、トランスポート、プラントベースフード、ビジョン、キャリア、パーパス、フリー・キャッシュ・フロー、アセットライト、スナック、コロナウイルス、ライシン、フレックスタイム、コアコンピタンス、ゼロ等）のため不採用としました。
- relatedCompanies: トラスト（trust）・日本マスタートラスト信託銀行: 大株主の状況の信託口としての記載のみで、純投資の信託銀行のため不採用としました。
- relatedCompanies: 関係会社の状況に載る連結子会社18社・持分法適用関連会社2社（株式会社マスヤ、KAMEDA LT FOODS (INDIA) PRIVATE LIMITED）はいずれも非上場で、有価証券報告書を提出していないため関連企業には結んでいません。
- terms: 用語候補： 米菓（米を原料として作る菓子の総称で、せんべいやあられなどがあります）、長期保存食（災害時などに備えて長期間保存できる食品）、植物性乳酸菌（植物由来の原料から分離された乳酸菌）、プラントベースフード（植物由来の原料で作る食品で、同社は「植物性たんぱく質食材」と位置付けています）——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: 2026年4月1日付で、普通株式1株につき3株の割合の株式分割を実施しました（2026年2月18日の取締役会決議に基づくもので、重要な後発事象として有報に注記されています）。有報の大株主の状況などに記載された株式数は、この分割前の数で記載されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
