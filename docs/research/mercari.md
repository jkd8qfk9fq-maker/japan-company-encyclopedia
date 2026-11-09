# メルカリ — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社メルカリ |
| 証券コード | 4385 |
| docID（データを取り出した文書） | `S100Z2BE` |
| 原本 docID | `S100Z2BE` |
| 提出日（原本） | 2026-09-17 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z2BE.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AA

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社メルカリ / 4385 / docID S100Z2BE（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 28 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 4 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mercari: 10 件の数値を有報XBRLと照合
有報: 株式会社メルカリ 有価証券報告書－第14期(2025/07/01－2026/06/30) (docID S100Z2BE)
前期有報との比較: 36 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△））。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 財務諸表の組替え・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mercari: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、前期に比べて35.6％増えました。増益を伴うトップラインの成長を目指す経営…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…います。経営方針としては、原則として増益を伴うトップラインの成長を目指し、G…）

## エージェントの判断記録（fragment warnings）

- businessModel: 指標の候補が2件あった点については、有報の連結経営指標等の主表である国際会計基準の表（売上収益・親会社の所有者に帰属する当期利益）を採用した。日本基準の表は第10期から第12期の参考表示で、第12期の数値については監査を受けていない旨が注記されている。機械の5年系列も2022年6月期は日本基準、2023年6月期以降はIFRSで構成されており、本文の数値はIFRSの当期（2026年6月期）の印字で統一した。IFRS適用の事実はfinancialNotesに記録した。
- businessModel: 財務諸表の組替えの記載は、連結キャッシュ・フロー計算書の表示方法の変更（「無形資産の取得による支出」の独立掲記に伴う前連結会計年度の組替え）であり、5年系列の数値に影響しないため、financialNotesには入れずここに記録した。温室効果ガス排出量の算定方法の見直しに伴う遡及修正も財務数値ではないため同様に扱った。前期有報との修正再表示チェックは全系列で一致している。
- businessModel: セグメント名称の変更（Japan RegionからJapan Businessへ）は、第1四半期連結会計期間からの名称変更のみでセグメント情報に与える影響はない旨が有報に明記されているため、financialNotes・needsReviewには入れなかった。
- businessModel: コア営業利益は売上収益と当期純利益以外の利益指標のため、金額・増減率は書いていない。セグメント利益の金額も書いていない。
- businessModel: 目標とする経営指標のうちコア営業利益など利益に関する目標の金額は、文章の規則により書いていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上収益の大きい順とした（Japan Business 180,858百万円、US 40,782百万円、その他 7,653百万円）。「その他」は有報が報告セグメントに含まれないと明記する区分のため、金額にかかわらず最後に置いた。
- businessStructure: Japan Businessの子区分は、セグメント注記の分解で金額が開示されているMarketplace（129,526百万円）とFintech（51,201百万円）とした。同区分内の「その他」130百万円は内容が独立して開示されていないため子区分にせず、子区分の合計とJapan Businessの金額との差はこの130百万円と有報の丸めである。
- businessStructure: セグメント利益の金額は文章の規則により書いていない。
- businessStructure: 設備は本社の行が「Japan Business/全社（共通）」と複数区分の連記であるため、事業への設備の結びつけはしていない。
- history: 【沿革】は年月と事象が一体で印字されており、行順どおり年単位で採用した。設立時の資本金の金額は文章の規則により書いていない。
- history: 2013年の創業者名はWikipediaの冒頭で補足し、出典を併記した（数値はWikipediaから採っていない）。山田進太郎は有報の大株主の状況にも2026年6月30日現在21.45％を保有する筆頭株主として印字されている。
- history: 採用しなかった行: 株式会社ソウゾウ（旧）の設立・清算、Mercari Europe Ltd.の設立・清算、Merpay Ltd.の設立・譲渡・清算、「メルカリ アッテ」「メルカリ カウル」「メルカリ メゾンズ」「メルカリチャンネル」「メルカリNOW」「teacha」「メルチャリ」など終了したサービス、株式会社メルペイコネクトの設立・吸収合併、マイケル株式会社の子会社化・全株式譲渡、株式会社Origamiの孫会社化・清算、株式会社Bassetの孫会社化・吸収合併、株式会社メルロジの設立・吸収合併、株式会社ソウゾウ（新）の設立・吸収合併・吸収分割、匿名配送サービスの開始、手数料徴収の開始、スマート払い（定額払い）・バーチャルカードの開始、「メルカリ ハロ」「メルカリNFT」「オークション機能」「全額補償サポートプログラム」「匿名返品機能」などの個別サービス・機能の開始、台湾・香港への越境進出、イーサリアムの取扱開始、ESG委員会の設立、メルカリ物価・数量指数の提供開始、指名委員会等設置会社への移行、コインチェック取扱銘柄の取引機能の提供開始。
- industry: 主たる業界はitとした: フリマアプリをはじめとするインターネットサービスのプラットフォーム運営が事業の中核であり、東証の業種区分も情報・通信業であるため。
- industry: financeを2つ目に付けた: FintechはJapan Businessの中で金額が独立して開示されるドメインで、2026年6月期の売上収益は51,201百万円と全体の2割を超え、決済・与信・暗号資産の金融サービスを行っているため。
- industry: retailは付けなかった: 自ら商品を仕入れて販売するのではなく、個人間取引の場を提供する事業であるため。
- relatedCompanies: ntt: 結ばなかった。有報が述べる提携相手は株式会社NTTドコモ（NTT株式会社の子会社）であり、記載は【沿革】における2020年2月の業務提携開始のみで、NTT株式会社自体との現在の取引・提携は有報に述べられていないため。
- relatedCompanies: yamato: 結ばなかった。有報に印字されるのは配送業者のヤマト運輸株式会社であり、候補の株式会社ヤマト（1967）とは別の会社であるため。
- relatedCompanies: trust: 結ばなかった。一致は大株主の日本マスタートラスト信託銀行株式会社（信託口）の名称であり、候補自体はコードリストにないため。
- relatedCompanies: nissin: 結ばなかった。候補はコードリストになく、一致は新株予約権等の記載中の断片であるため。
- relatedCompanies: ray: 結ばなかった。「レイ」は記載中の断片一致であり、株式会社レイとの取引・提携の記載はないため。
- relatedCompanies: en: 結ばなかった。「エン」はエンゲージメント等の一般語の断片一致であるため。
- relatedCompanies: core: 結ばなかった。「コア」はプロダクトのコア体験等の一般語であるため。
- relatedCompanies: rent: 結ばなかった。「レント」はタレントの断片一致であるため。
- relatedCompanies: port: 結ばなかった。「ポート」はサポート等の断片一致であるため。
- relatedCompanies: land: 結ばなかった。「ランド」はブランドの断片一致であるため。
- relatedCompanies: step: 結ばなかった。「ステップ」は収益認識の5ステップアプローチの記載であるため。
- relatedCompanies: planet: 結ばなかった。「プラネット」は自社の用語「プラネット・ポジティブ」の一部であるため。
- relatedCompanies: cover: 結ばなかった。「カバー」は暗号資産のカバー取引（ヘッジ）の用語であるため。
- relatedCompanies: ishin: 結ばなかった。「イシン」はカーボンプライシング等の記載中の断片一致であるため。
- relatedCompanies: king: 結ばなかった。「キング」はハッキング等の断片一致であるため。
- relatedCompanies: lec: 結ばなかった。「レック」はフレックス制度等の断片一致であるため。
- relatedCompanies: no-1: 結ばなかった。「No.1」は参考文献の号数表記であるため。
- relatedCompanies: base-4481: 結ばなかった。「ベース」は「概念をベースにした」等の一般語であるため。
- relatedCompanies: como: 結ばなかった。「コモ」は株式会社NTTドコモの名称の一部であるため。
- relatedCompanies: freee: 結ばなかった。「フリー」はリスクフリー利子率の用語であるため。
- relatedCompanies: innovation: 結ばなかった。「イノベーション」は一般語であるため。
- relatedCompanies: kel: 結ばなかった。「ケル」は旧子会社マイケル株式会社の名称の一部であるため。
- relatedCompanies: kohsoku: 結ばなかった。「高速」は「高速な技術革新」の一般語であるため。
- relatedCompanies: path: 結ばなかった。「パス」はパスキーの用語であるため。
- relatedCompanies: ricoh: 結ばなかった。「リコー」はノンリコース形式の断片一致であるため。
- relatedCompanies: secure: 結ばなかった。「セキュア」は本人認証サービス「EMV-3Dセキュア」の用語であるため。
- relatedCompanies: 株式会社駿河屋とは2025年12月に資本業務提携契約を締結しているが、候補リストにないため結べなかった（関係は【沿革】に記録した）。
- relatedCompanies: 株式会社suaddは2026年6月30日現在6.26％を保有する大株主だが、候補リストにないため結べなかった。その他の大株主は個人、信託銀行・資産管理会社、投資ファンドであり、事業会社の候補はいない。
- terms: 登録候補（助言のみ）: GMV（流通取引総額。キャンセル等を考慮後の取引高の合計）、MAU（Monthly Active Users。1か月に1回以上アプリ又はWebサイトをブラウジングした登録済みのお客さま数）、コア営業利益（営業利益からその他の収益・その他の費用等を控除した当社独自の利益指標）、越境取引（日本で出品された商品を海外から購入できる取引）、メルカード（「メルカリ」「メルペイ」の利用履歴や行動履歴に基づくAI与信を活用したクレジットカード）、メルペイのあと払い（翌月払い・定額払い・分割払いの総称）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
