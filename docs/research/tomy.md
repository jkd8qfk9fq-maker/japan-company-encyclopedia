# タカラトミー — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社タカラトミー |
| 証券コード | 7867 |
| docID（データを取り出した文書） | `S100YHL0` |
| 原本 docID | `S100YHL0` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHL0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社タカラトミー / 7867 / docID S100YHL0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tomy: 10 件の数値を有報XBRLと照合
有報: 株式会社タカラトミー 有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YHL0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tomy: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、地域軸と年齢軸の拡大で成長しながら利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみとし、営業利益・経常利益・セグメント利益・のれん減損損失の金額は書かなかった。地域別の内訳は売上高の内訳としてのみ書いた。
- businessModel: 「中長期経営戦略 2030」の売上高3,000億円・営業利益率10％・ROE11％以上などの数値目標は、投資・利益指標の金額にあたるため本文には書かず、戦略の内容だけを書いた。
- businessModel: 当期純利益の減少理由は、MD&Aの記載どおりTOMY International, Inc.におけるのれんの減損を計上したこととし、金額は書かなかった。
- businessModel: 日本基準（Japan GAAP）で一貫しており、決算期の変更・変則決算・修正再表示はないため、financialNotesは空とした。前期有報との修正再表示チェックは全項目一致だった。
- businessStructure: 事業の並び順は、報告セグメントを2026年3月期の外部顧客への売上高の大きい順（日本210,434百万円→アメリカズ30,405百万円→アジア18,975百万円→欧州7,776百万円→オセアニア2,862百万円）に並べた。報告セグメントに含まれない区分は無い。
- businessStructure: 「日本」区分には【事業の内容】の表どおり不動産賃貸等（株式会社タカラトミーアイビス）も含まれ、販売（株式会社タカラトミーマーケティング、株式会社キデイランド等）と一体で開示されているため、独立した事業には分けなかった。
- businessStructure: 持分法適用の関連会社である株式会社タツノコプロは【事業の内容】の表で「日本」区分に含まれるため、日本の説明に含めた。
- businessStructure: 上場市場は表紙の印字（東京証券取引所 プライム市場）どおりとした。
- history: 沿革の表の後半（2008年8月以降）は年月セルが続けて印字され事象文と分かれた崩れた表だった。年月の数（20件）と事象の数（20件）が一致したため、行順で対応づけて使用し、そのうち2011年（RC2 Corporationの買収完了・連結子会社化）、2020年（Fat Brain Holdings, LLCの子会社化）、2022年（プライム市場への移行）を採った。
- history: 資本金の金額は書いていない。数値はWikipediaから使っていないため、出典は有報のみとした。
- industry: 主たる業界は、売上高のほぼ全てを占める玩具（ベビー事業を含む）及び玩具周辺事業からentertainmentとした。閉じた分類に玩具の区分が無いため、taxonomyGapsに提案を記録した。
- industry: キデイランドなどの小売店舗は日本セグメント内の一事業で、金額が独立して開示されていないため、retailは付けなかった。
- industry: テレビ東京ホールディングスとのIP関連取引などメディアとの接点はあるが、メディア事業として売上が開示されていないため、mediaは付けなかった。
- relatedCompanies: 【関係会社の状況】に載る連結子会社34社と持分法適用関連会社1社（株式会社タツノコプロ）はいずれも未上場で候補にないため結ばなかった。【大株主の状況】の上位は信託銀行・カストディ銀行・個人・外国金融機関などで、候補にある事業会社はなかった（司不動産株式会社は未上場で候補にない）。
- relatedCompanies: oriental-land: 【重要な契約等】にスポンサー契約が明記され、特定投資株式の開示でもOEMに関する取引が確認できるため結んだ。
- relatedCompanies: aeon / happinet: 特定投資株式の開示に「当社商品の販売取引は有」と個別に書かれており、株式数も実数があるため、販売先として結んだ。計上額は書いていない。
- relatedCompanies: sanrio: 特定投資株式の開示に「ライセンスに関する取引は有」と個別に書かれているため結んだ。ライセンスの向きは印字されていないためbusiness-partnerとした。
- relatedCompanies: tv-tokyo-holdings: 特定投資株式の開示に「当社IPに関連した取引は有」と個別に書かれているため結んだ。
- relatedCompanies: genda: MD&Aに、北米の「ガチャ」展開で同社のプラットフォームでの販売を進めたと個別に書かれているため結んだ。販売の向きの厳密な印字はないためbusiness-partnerとした。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の表に載るが、保有目的は金融機関との取引関係保持で、資金調達・その他金融サービスに関する取引が理由のため結ばなかった。
- relatedCompanies: tokyo-kiraboshi-financial-group: 特定投資株式の表に載るが、金融機関であり、資金調達・その他金融サービスに関する取引が理由のため結ばなかった。
- relatedCompanies: vision: 「サステナビリティ・ビジョン」等の一般語の一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: path: 「パーパス」等の一般語の一致で、パス株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: amuse: 「アミューズメント機器」等の一般語の部分一致で、株式会社アミューズについての記載はないため結ばなかった。
- relatedCompanies: career: 一般語「キャリア」の一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: ibis: 連結子会社「株式会社タカラトミーアイビス」の名称の部分一致で、株式会社アイビスについての記載はないため結ばなかった。
- relatedCompanies: hit: 一般語「ヒット」の一致で、株式会社ヒットについての記載はないため結ばなかった。
- relatedCompanies: nissin: 断片一致で、株式会社日新についての記載はなく、listing がコードリストにないため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」等の断片一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: core: 一般語・断片一致で、株式会社コアについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: zero: 「実質ゼロ」等の一般語の一致で、株式会社ゼロについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: innovation: 「アソビイノベーション」の一般語の一致で、株式会社イノベーションについての記載はないため結ばなかった。
- relatedCompanies: port: 「事業ポートフォリオ」の断片一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: seki: 断片一致で、セキ株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: brass: 断片一致で、株式会社ブラスについての記載はないため結ばなかった。
- relatedCompanies: freee: 「フリーキャッシュ・フロー」の一般語の一致で、フリー株式会社についての記載はないため結ばなかった。
- relatedCompanies: kel: 地名「ケルン」の部分一致で、ケル株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: ray: 断片一致で、株式会社レイについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: ricoh: 「リコール」の部分一致で、株式会社リコーについての記載はないため結ばなかった。
- relatedCompanies: trust: 断片一致で、株式会社トラストについての記載はなく、listing がコードリストにないため結ばなかった。
- terms: 助言: 「ガチャ」は用語集の登録候補です。カプセル玩具の呼称で、タカラトミーアーツの中核フォーマットとして有報の各所に現れ、北米展開も進められています。
- terms: 助言: 「Kidults」は用語集の登録候補です。子ども向け商品を買う大人の愛好者層を指す言葉で、有報では年齢軸拡大の対象層として繰り返し使われています。
- terms: 助言: 「アソビIP」は用語集の登録候補です。「トミカ」「プラレール」「リカちゃん」「ベイブレード」などの主力ブランドから生まれる知的財産を指す、同社の知的資本戦略で定義された言葉です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] タカラトミーの主たる業界 → 提案: toys（玩具）。玩具（ベビー事業を含む）及び玩具周辺事業の製造販売が中核事業だが、閉じた分類に玩具の区分が無いため、最も近いentertainmentを暫定とした。
