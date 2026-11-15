# 山陽電気鉄道 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 山陽電気鉄道株式会社 |
| 証券コード | 9052 |
| docID（データを取り出した文書） | `S100YD7X` |
| 原本 docID | `S100YD7X` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD7X.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E5%B1%B1%E9%99%BD%E9%9B%BB%E6%B0%97%E9%89%84%E9%81%93

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 山陽電気鉄道株式会社 / 9052 / docID S100YD7X（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 1 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanyo-electric-railway: 10 件の数値を有報XBRLと照合
有報: 山陽電気鉄道株式会社 有価証券報告書－第137期(2025/04/01－2026/03/31) (docID S100YD7X)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sanyo-electric-railway: 本文の金額 18 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、連結経営指標等とセグメント注記の百万円単位の印字どおりに転記しました。比率や構成比は書いていません。
- businessModel: 通称「山陽電鉄」はWikipediaの補足で、businessModelのsourceIdsに有報の出典と並べて記録しました。本文の数値はWikipediaから採っていません。
- businessModel: suppliersは省きました。外部からの調達先を一般名詞で述べる記載がなく、グループ会社への業務の委託は事業の内容の中で事業として記載しました。
- businessModel: MD&Aは当期純利益の増加の理由の一つとして退職給付制度の改定に伴う計上を挙げていますが、本文には金額と前期の値だけを書き、理由の詳細はこの記録にとどめました。
- businessModel: 変則決算や決算期の変更はなく、修正再表示チェックでも前期有報と重なる年度の数値はすべて一致しているため、financialNotesは空にしました。
- businessStructure: 事業名はセグメント注記の印字どおりとし、外部顧客に対する営業収益の大きい順（運輸業21,284百万円、流通業9,360百万円、不動産業5,820百万円、レジャー・サービス業2,416百万円、その他の事業1,250百万円）に並べました。
- businessStructure: 子事業の金額はMD&Aの業種別営業成績の印字どおりです。不動産業の業種別金額の合計は消去△156百万円を差し引くと5,819百万円となり、外部顧客に対する営業収益5,820百万円と1百万円異なりますが、印字の値をそのまま引用しました。
- businessStructure: その他の事業の子事業には金額を書いていません。MD&Aの業種別区分（労働者派遣事業、業務請負業、設備の保守・整備・工事業・情報業ほか）は【事業の内容】の区分とそのまま一致しないためです。
- businessStructure: 関係会社の資本金の金額は本文に書いていません。グループは当社、子会社14社と関連会社1社で構成されます（【事業の内容】）。
- history: 沿革の資本金の金額はすべて省きました。
- history: 2022年4月と2023年4月の2つの年月セルが1つの事象文に続けて印字される崩れた表は、年月と事象の数が合うため行順に対応づけ、2022年4月をプライム市場への移行、2023年4月を「鉄道駅バリアフリー料金制度」の導入として分けました。
- history: 沿革のうち、子会社の設立など主要な出来事を中心に選び、清算法人の設立などは省きました。
- industry: 主たる業界は、報告セグメントの外部顧客に対する営業収益が最大の運輸業に基づきtransportationとしました。
- industry: 流通業と不動産業は独立して開示される報告セグメントのためretailとreal-estateを付けました。レジャー・サービス業（飲食業やスポーツ業など）には最も近いentertainmentを付けました。
- industry: その他の事業（情報処理、設備の保守・整備・工事、労働者派遣など）は単独の報告セグメント名を持たない混合した区分のため、業界を付けていません。
- relatedCompanies: 結んだのは4社。以下、候補ごとに結ばなかった理由を記録します。
- relatedCompanies: 阪神電気鉄道株式会社は【大株主の状況】の筆頭株主（17.4％、2026年3月31日現在）ですが、上場している候補にはなく、親会社の阪急阪神ホールディングスとは別の会社であるため、major-shareholderとしては結んでいません。阪急阪神ホールディングスは特定投資株式に印字された同社自身の保有目的（相互直通運転など）を根拠にbusiness-partnerとして結びました。
- relatedCompanies: 関電不動産開発株式会社は【大株主の状況】に載る事業会社（5.0％）ですが、候補にないため結んでいません。
- relatedCompanies: shinki-bus（神姫バス）は、特定投資株式の保有目的に不動産の賃貸などの具体的な事業活動が印字されるためbusiness-partnerとして結びました。なお、同社株式は2025年10月1日の株式分割により当社の保有株式数が増えています。みなし保有株式としての退職給付信託分は、それだけでは結ぶ根拠にしていません。
- relatedCompanies: fuji-kyuko: 特定投資株式の保有目的はバス事業等での協業関係の構築・強化で、具体的な協業の内容が印字されていないため結んでいません。
- relatedCompanies: kyokuto-kaihatsu-kogyo: 特定投資株式の保有目的は駐車場設備関連の取引の円滑化で、ノザワと同型の「関連の取引の円滑化及び地域社会との良好な関係構築」という文の範囲のため結んでいません。
- relatedCompanies: nozawa: 特定投資株式の保有目的は建築材料関連の取引の円滑化で、極東開発工業と同型の文の範囲のため結んでいません。
- relatedCompanies: taki-chemical: 特定投資株式の保有目的は地域社会との良好な関係構築のみのため結んでいません。
- relatedCompanies: sumitomo-mitsui-financial-group / mitsubishi-ufj-financial-group / mizuho-financial-group / resona-holdings / sumitomo-mitsui-trust-group / nomura-holdings: 特定投資株式の保有目的はいずれも資金調達や証券業務など金融機関との取引の円滑化であり、金融機関との資金調達関係のため結んでいません。
- relatedCompanies: 株式会社三井住友銀行は【大株主の状況】に載ります（2.8％）が、銀行であり金融機関のためmajor-shareholderとして結んでいません。その他の大株主は信託銀行の信託口やカストディのため結んでいません。
- relatedCompanies: daiwa-securities-group / japan-airport-terminal / japan-securities-finance / kawasaki-heavy-industries / nabtesco / the-kansai-electric-power / the-nippon-signal / kobe-electric-railway: みなし保有株式として退職給付信託契約に基づく議決権行使権限の対象に載るだけで、取引・提携の記載がないため結んでいません。退職給付信託口として大株主の状況に現れる川崎重工業についても同様です。
- relatedCompanies: en: 「エン」は一般語への断片一致（ambiguous）のため結んでいません。
- relatedCompanies: vision: 「ビジョン」は新長期ビジョンなどの一般語の一致のため結んでいません。
- relatedCompanies: corona: 「コロナ」はコロナ禍などの一般語の一致のため結んでいません。
- relatedCompanies: kohsoku: 「高速」は神戸高速鉄道や高速バスなどの語の一致（ambiguous）のため結んでいません。
- relatedCompanies: freee: 「フリー」はバリアフリーなどの一般語の一致のため結んでいません。
- relatedCompanies: port: 「ポート」はサポートなどの語の断片一致のため結んでいません。
- relatedCompanies: seki: 「セキ」はセキュリティなどの語の断片一致（ambiguous）のため結んでいません。
- relatedCompanies: base-4481: 「ベース」は営業利益ベースなどの一般語の一致のため結んでいません。
- relatedCompanies: career: 「キャリア」はキャリア形成などの一般語の一致のため結んでいません。
- relatedCompanies: ishin: 「イシン」は語の断片一致のため結んでいません。
- relatedCompanies: land: 「ランド」はブランドなどの語の断片一致のため結んでいません。
- relatedCompanies: lec: 「レック」はフレックスタイムなどの語の断片一致のため結んでいません。
- relatedCompanies: alpha / alpha-4760: 「アルファ」は分譲住宅の名称「アルファリアラス西二見」の一部で、株式会社アルファへの言及ではないため結んでいません。
- relatedCompanies: densan: 「電算」は電算処理業務などの一般語の一致（ambiguous）のため結んでいません。
- relatedCompanies: ic: 「IC」はICカードシステムの略称の一致（ambiguous）のため結んでいません。
- relatedCompanies: ray: 「レイ」は語の断片一致（ambiguous）のため結んでいません。
- terms: 助言: 用語「PiTaPa」は、2006年7月に導入されたICカードシステムの名称です（沿革に印字）。
- terms: 助言: 用語「スルッとKANSAI」は、1999年10月に参入した共通乗車カードの仕組みの名称です（沿革に印字）。
- terms: 助言: 用語「鉄道駅バリアフリー料金制度」は、駅のバリアフリー化を進めるために2023年4月に導入された料金制度です（沿革に印字）。
- terms: 助言: 用語「直通特急」は、阪神梅田～山陽姫路間を直通で結ぶ特急列車を指します（沿革に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
