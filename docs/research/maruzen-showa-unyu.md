# 丸全昭和運輸 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 丸全昭和運輸株式会社 |
| 証券コード | 9068 |
| docID（データを取り出した文書） | `S100YKCI` |
| 原本 docID | `S100YKCI` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKCI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 丸全昭和運輸株式会社 / 9068 / docID S100YKCI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 70 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
maruzen-showa-unyu: 10 件の数値を有報XBRLと照合
有報: 丸全昭和運輸株式会社 有価証券報告書－第124期(2025/04/01－2026/03/31) (docID S100YKCI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
maruzen-showa-unyu: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益の増減率はMD&Aの印字どおりです。営業利益・経常利益の金額は本文に書きません。
- businessModel: 第9次中期経営計画の数値目標のうち、経常利益の目標とROEの目標は本文に書けないため記載しません。連結売上高の目標だけを記載しました。
- businessModel: 変則決算・決算期変更・会計基準の変更・訂正はありません。修正再表示チェックは前期有報と重複年度が全行一致のため、financialNotesは空です。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」のため、needsReviewはありません。提出後の文書もありません。
- businessStructure: 事業はセグメント注記の外部顧客への売上高の大きい順に並べました。物流事業が1,293億18百万円、構内作業及び機械荷役事業が168億84百万円、その他事業が24億円です。
- businessStructure: その他事業は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: 物流事業のchildrenはセグメント概要に印字されたサービスの種類どおりです。金額が独立して開示されていないため、childrenに金額は書きません。
- businessStructure: 売上高の増減率は本文に書きません。
- history: 沿革の2018年6月から2021年4月までの8行は、年月と事象文が分かれた崩れた表のため、年月8件と事象8件の数が一致することから行順で対応づけました。
- history: ISO9001やISO14001の認証取得の各件は沿革の出来事として小さいため、ISO27001の取得を除いて省きました。
- industry: 主たる業界は運輸（transportation）としました。物流事業が2026年3月期の売上高の87.0％を占めます。
- relatedCompanies: 結ばなかった候補（asahi-kasei）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（chuo-warehouse）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（feed-one）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（fujibo-holdings）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（japan-foundation-engineering）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（japan-transcity）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（jfe-holdings）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（jgc-holdings）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（kaneka）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（keikyu）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（kyokuto-kaihatsu-kogyo）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（lec）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（marusan-securities）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（mitsui-chemicals）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（mitsui-o-s-k-lines）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（mizuho-financial-group）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（nagawa）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（nichiha）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（nippon-hume）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（nippon-steel）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（nippon-yakin-kogyo）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（okasan-securities-group）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（okumura）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（resonac-holdings）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（riken-vitamin）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（sakai-chemical-industry）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（sakata-seed）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（sato-sho-ji）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（seikagaku）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（showa-sangyo）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（sumitomo-realty-and-development）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（taihei-dengyo-kaisha）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（the-keihin）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（toa）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（tohbu-network）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（tsumura-and-co）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（yamabiko）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（yokogawa-bridge-holdings）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（yokorei）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（zeon）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（yokohama-financial-group）：特定投資株式の表に載るのみで、保有目的が全銘柄共通の定型句のため、具体的な取引・提携の記述がなく結びません。
- relatedCompanies: 結ばなかった候補（maruzen）：「マルゼン」は子会社「マルゼン・オブ・アメリカ・インコーポレイテッド」の語句の一致で、株式会社マルゼンとの関係ではありません。
- relatedCompanies: 結ばなかった候補（step）：「ステップ」は収益認識の5つのステップの記述の語で、株式会社ステップとの関係ではありません。
- relatedCompanies: 結ばなかった候補（port）：「ポート」は「丸全トランスポート」などの語句の一致で、ポート株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（ray）：「レイ」は語句の一致で、株式会社レイとの関係ではありません（ambiguous）。
- relatedCompanies: 結ばなかった候補（en）：「エン」は語句の一致で、エン株式会社との関係ではありません（ambiguous）。
- relatedCompanies: 結ばなかった候補（vision）：「ビジョン」は「長期ビジョン」の語で、株式会社ビジョンとの関係ではありません。
- relatedCompanies: 結ばなかった候補（career）：「キャリア」は「キャリアパス」の語で、株式会社キャリアとの関係ではありません。
- relatedCompanies: 結ばなかった候補（base-4481）：「ベース」は「営業利益ベース」の語で、ベース株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（corona）：「コロナ」は新型コロナウイルスの語で、株式会社コロナとの関係ではありません。
- relatedCompanies: 結ばなかった候補（ishin）：「イシン」は語句の一致で、イシン株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（land）：「ランド」は語句の一致で、株式会社ランドとの関係ではありません。
- relatedCompanies: 結ばなかった候補（nitto-fuji-flour-milling）：2025年10月に子会社である日東富士運輸の株式を譲り受けた過去一度限りの取引で、現在の取引・提携・資本関係の記述はありません。
- relatedCompanies: 結ばなかった候補（daihen）：ダイヘン千歳工場作業場は施設の言及のみで、株式会社ダイヘンとの取引・提携・資本関係の記述はありません。
- relatedCompanies: 結ばなかった候補（lion）：2004年のライオン流通サービスの子会社・スマイルラインの株式取得は過去の出来事で、ライオン株式会社との現在の関係の記述はありません。
- relatedCompanies: 結ばなかった候補（mitsubishi-ufj-financial-group）：大量保有報告書の記載のみで、当社として2026年3月31日現在の実質所有株式数を確認できず大株主にも含めておらず、資金調達が理由の金融機関のため結びません。
- relatedCompanies: 結ばなかった候補（nidec）：2015年の日本電産ロジステックの株式取得は過去の出来事で、ニデック株式会社との現在の関係の記述はありません。
- relatedCompanies: 結ばなかった候補（rikei）：「理経」は語句の一致で、株式会社理経との関係ではありません（ambiguous）。
- relatedCompanies: 結ばなかった候補（seki）：「セキ」は「情報セキュリティ」などの語で、セキ株式会社との関係ではありません（ambiguous）。
- relatedCompanies: 結ばなかった候補（toumei）：「東名」は「東名横浜物流センター」の語句の一致で、株式会社東名との関係ではありません（ambiguous）。
- relatedCompanies: 結ばなかった候補（zero）：「ゼロ」は「排出量ゼロ」の語で、株式会社ゼロとの関係ではありません（ambiguous）。
- relatedCompanies: 結ばなかった候補（path）：「パス」は「キャリアパス」の語で、パス株式会社との関係ではありません（ambiguous）。
- relatedCompanies: 結ばなかった候補（sojitz）：2016年の双日との合弁会社設立は過去の出来事で、現在の取引・提携の記述は有報にありません（ambiguous）。
- relatedCompanies: 結ばなかった候補（cover）：「カバー」は「全額カバーできる」の語で、カバー株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（hip）：「ヒップ」は設備の「ヒップリフター車」の語で、株式会社ヒップとの関係ではありません。
- relatedCompanies: 結ばなかった候補（innovation）：「イノベーション」は「イノベーションの創出」の語で、株式会社イノベーションとの関係ではありません。
- relatedCompanies: 結ばなかった候補（slogan）：「スローガン」はブランドスローガン「物流は、愛だ。」の語で、スローガン株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（trust）：「トラスト」は「日本マスタートラスト信託銀行」の語で、株式会社トラストとの関係ではありません。
- relatedCompanies: 丸全商事は2026年3月31日現在8.40％を保有する筆頭株主で持分法適用関連会社ですが、上場企業ではないため結びません。
- relatedCompanies: 非上場の連結子会社24社と持分法適用関連会社（徐州丸全外運有限公司、ユニタイマルゼンロジスティックス、マルゼン・サムデラ・タイヘイヨー、丸全昭和タイランドリミテッド）は、上場企業ではないため結びません。
- terms: 用語の助言はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
