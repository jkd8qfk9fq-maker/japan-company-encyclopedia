# ペッパーフードサービス — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ペッパーフードサービス |
| 証券コード | 3053 |
| docID（データを取り出した文書） | `S100XULF` |
| 原本 docID | `S100XULF` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XULF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ペッパーフードサービス / 3053 / docID S100XULF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
pepper-food-service: 10 件の数値を有報XBRLと照合
有報: 株式会社ペッパーフードサービス 有価証券報告書－第41期(2025/01/01－2025/12/31) (docID S100XULF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
pepper-food-service: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aに印字された営業利益・経常利益・セグメント利益（損失）の金額や増減率は書いていません。本文の金額は売上高と当期純利益（純損失）だけです。
- businessModel: 当期純損失の要因として経営成績の分析に記載された減損損失などの内訳は、本文には書いていません。
- businessModel: 会社が重視する経営指標である売上高経常利益率は、利益率の指標であるため戦略の文章には書いていません。
- businessModel: 証拠パックの注意では本文に財務諸表の組替えの記載があるとされましたが、抽出されたテキストブロックの中では該当箇所を確認できませんでした。前期有報との修正再表示チェックは全系列で差異ゼロであり、訂正有報もないため、financialNotes には入れず、この記録にとどめています。
- businessModel: 重要な後発事象として記載されたその他資本剰余金の処分（2026年2月27日の取締役会で株主総会への付議を決議し、2026年3月26日開催の第41期定時株主総会で承認可決）は資本政策の手続きであり、事業の構造に関わらないため本文には書いていません。
- businessModel: 2025年12月期に新株予約権の行使による株式の発行と減資がありましたが、資本金の金額は書いていません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。「その他」は有報が報告セグメントに含まれない区分と明記しているため、金額にかかわらず最後に置きました。
- businessStructure: いきなり！ステーキ事業の子区分は、財務諸表の収益認識関係の注記で分解開示された収益の区分（直営・委託店売上高13,347百万円、加盟店への卸売高302百万円、その他181百万円）によっています。直営と委託の内訳金額は独立して開示されていません。
- businessStructure: レストラン事業の業態別（炭焼ステーキくに、かつき亭、すきはな、かいり）の金額と、商品販売事業の販売形態別の金額は独立して開示されていないため、子区分にはしていません。
- businessStructure: 主要な設備の状況は都道府県別の店舗設備の一覧で、レストラン事業の東京都の行のように複数業態が連記された行もあるため、設備と事業は結びつけていません。帳簿価額は書いていません。
- businessStructure: 仕入先について、【事業の内容】に個別の仕入先名は印字されていません。このツリーの旧スキーマのため suppliers キーは省略しています。
- businessStructure: Wikipediaの記事の冒頭は、有報の記載と重なる内容（本社所在地と「いきなり！ステーキ」の運営）のみで、有報にない補足はなかったため使っていません。
- history: 沿革の後半（2013年以降）は、年月セルがまとめて印字され事象文と分かれた崩れた表です。年月は42件あり、事象文の数と一致しないため、行順の対応づけだけに頼らず、行順の対応が前後の確定した項目（2013年の「いきなり！ステーキ」開店、2023年のスタンダード市場への移行、2025年のかいり譲受など）で裏付けられる項目と、経営成績の分析や事業の内容で裏付けられる項目だけを採用しました。
- history: 年の対応に確信が持てない項目（市場第二部・市場第一部への変更、「いきなり！ステーキ」100号店舗・200号店舗・300号店舗・400号店舗の達成、復配、カナダ第1号店の開店など）は、項目から省きました。
- history: 本社の移転（1995年、2000年、2018年）、研修センターの開設、協会への加盟、特許の取得、受賞、ギネス世界記録の認定、代表取締役社長の交代、監査等委員会設置会社への移行は、事業の転機ではないため項目から省きました。
- history: 沿革に印字された出資金・資本金の金額（設立時の出資金など）は、規則により文章に書いていません。
- history: 2009年のステファングリル事業の譲受は過去1回限りの取引であり、関連企業としては結んでいません（関連企業の判断は relatedCompanies の warnings を参照）。
- industry: 全ての報告セグメントは店舗で料理を提供する飲食店の運営と食品の販売であり、閉じた分類に外食に当たる区分が無いため、最も近い food を暫定で付け、分類の不足を taxonomyGaps に記録しました。
- industry: DEIの別記事業は CTE です。
- relatedCompanies: 候補「pepper-food-service/land」「pepper-food-service/port」「pepper-food-service/career」「pepper-food-service/vision」「pepper-food-service/slogan」「pepper-food-service/garden」は、いずれも「ブランド」「サポート」「キャリア目標」「ビジョン」「スローガン」「パピヨンガーデン店」など一般語や店舗名への部分一致で、当社との関係の記述がないため結んでいません。
- relatedCompanies: 候補「pepper-food-service/en」「pepper-food-service/zero」「pepper-food-service/ray」は ambiguous な候補で、一致箇所も一般語への部分一致のため結んでいません。
- relatedCompanies: 候補「pepper-food-service/corona」「pepper-food-service/open-door」「pepper-food-service/base-4481」「pepper-food-service/ishin」は、「新型コロナウイルス」「オープンドアポリシー」「営業利益ベース」「脱炭素シナリオ」への部分一致のため結んでいません。
- relatedCompanies: 候補「pepper-food-service/aeon-mall」はコードリストにない相手で、一致箇所も出店先の商業施設の名称のみであり、取引や提携の記述がないため結んでいません。
- relatedCompanies: 候補「pepper-food-service/aeon-hokkaido」は、敷金及び保証金の差入先の内訳に載るのみで、取引・提携・資本関係の記述がないため結んでいません。差入保証金の内訳に載るイオンリテール、イトーヨーカ堂も同様に結んでいません。
- relatedCompanies: 候補「pepper-food-service/demae-can」は、デリバリーサービスの提供先の1つとして名前が挙がるのみで、提携等の記述がないため結んでいません。
- relatedCompanies: 候補「pepper-food-service/fuji-8278」は ambiguous な候補で、大株主の状況に印字された名称は「フジパングループ本社株式会社」であり、候補の株式会社フジとは別の法人のため結んでいません。
- relatedCompanies: 候補「pepper-food-service/mos-food-services」は、2009年にステファングリル事業を譲り受けた過去1回限りの取引の相手方で、現在の取引・提携・資本関係の記述がないため結んでいません。この譲受は沿革の出来事として記録しました。
- relatedCompanies: 候補「pepper-food-service/natori」は、自社の業態名「牛たん 仙台なとり」への部分一致で、株式会社なとりとの関係の記述がないため結んでいません。
- relatedCompanies: 候補「pepper-food-service/rion」「pepper-food-service/seki」「pepper-food-service/will」は、「パビリオン」「アサヒセキュリティ」「プライムウィル」などへの部分一致や内訳表への記載のみで、関係の記述がないため結んでいません。
- relatedCompanies: 候補「pepper-food-service/nissin」「pepper-food-service/trust」はコードリストにない相手で、一致箇所も新株予約権の記載や日本マスタートラスト信託銀行（信託口）への部分一致のため結んでいません。
- relatedCompanies: 大株主の状況に載る信託銀行の信託口（日本マスタートラスト信託銀行6.78％、日本カストディ銀行1.02％）と楽天証券（0.54％）は、純投資や証券会社の共有口であるため結んでいません。個人の大株主も結んでいません。
- relatedCompanies: 特定投資株式として保有するイオン株式会社は、候補にあるイオンモールやイオン北海道とは別の法人であり、候補にないため結んでいません。なお、イオンモール株式会社の株式は、2025年6月の株式交換によりイオン株式会社の株式に交換され、全株式を保有しなくなりました。
- relatedCompanies: 商品販売事業のライセンス契約の相手方である株式会社SBICは、候補にないため関連企業としては結んでいません（事業の説明には記載しています）。
- relatedCompanies: 関係会社の状況は「該当事項はありません」で、当社に親会社・子会社・関連会社はありません。
- terms: 助言: 用語「肉マイレージ」は、「いきなり！ステーキ」の会員制度で、来店回数に応じてお得なサービスが受けられる仕組みです。
- terms: 助言: 用語「感熱センサー付電磁調理器」は、ステーキなどの加熱料理の提供に使う当社独自の店舗運営システムの中核となる調理器で、当社は関連する特許を取得しています。
- terms: 助言: 用語「いきなり！やきにく」は、株式会社SBICとのライセンス契約により同社がゴーストレストランで運営するデリバリー専門ブランドで、「いきなり！ステーキ」では販売していないやきにく丼などのメニューを提供しています。
- terms: 助言: 用語「委託事業」は、当社所有店舗の運営を受託者が行い、店舗の業績に応じて当社が業務委託料を支払う運営形態です。直営事業、フランチャイズ事業と並ぶ「いきなり！ステーキ」の運営形態の1つです。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ペッパーフードサービス（pepper-food-service）の飲食店事業（いきなり！ステーキ事業、レストラン事業） → 提案: 外食・飲食サービス。店舗でステーキなどの料理と酒類を提供する飲食店の運営が事業の実体であり、食品の製造・販売を指す food とは業態が異なるが、閉じた分類（INDUSTRY_IDS）に外食に当たる区分が無いため、最も近い food を暫定とし、分類の不足として記録する。
