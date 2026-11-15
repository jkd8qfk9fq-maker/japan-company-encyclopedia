# 野村マイクロ・サイエンス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 野村マイクロ・サイエンス株式会社 |
| 証券コード | 6254 |
| docID（データを取り出した文書） | `S100YG4U` |
| 原本 docID | `S100YG4U` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG4U.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 野村マイクロ・サイエンス株式会社 / 6254 / docID S100YG4U（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nomura-micro-science: 10 件の数値を有報XBRLと照合
有報: 野村マイクロ・サイエンス株式会社 有価証券報告書－第57期(2025/04/01－2026/03/31) (docID S100YG4U)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nomura-micro-science: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の経営目標のうち売上高以外の指標（段階利益や資本効率に関する指標）は投資・利益に関する語を含むため、strategyのdisclosedには転記せず、売上高目標と施策の内容のみを要約した。配当政策の目標値も同様に転記していない。
- businessModel: 売上高の内訳（水処理装置36,723百万円、メンテナンス等18,626百万円、その他の事業895百万円）の合計は、印字の丸めにより連結売上高56,245百万円と1百万円差がある。いずれもMD&Aの印字どおりに転記した。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。修正再表示はなく、前期有報との数値の相違も確認されていないため、financialNotesは付けていない。
- businessModel: Wikipediaの記事は有報の事業内容と重なる補足にとどまるため使っていない。
- businessStructure: 報告セグメントは設計・施工及び販売体制を基礎とした地域別（日本、韓国、中国、台湾、米国、その他）の6つであり、子は外部顧客への売上高の大きい順に並べた。金額はMD&A及びセグメント情報の印字どおりで、セグメント利益は転記していない。
- businessStructure: 事業の種類別では水処理装置事業が売上の大半を占め、その他の事業は高純度薬品・配管材料等の販売である。事業の種類は地域別セグメントと軸が異なるため、子の区分には使わず、親の説明とbusinessModelに織り込んだ。
- businessStructure: 連結子会社6社はいずれもグループ内の会社であり、関連企業としては結んでいない。韓国子会社は当連結会計年度に決算日を12月31日から3月31日に変更しているが、期末日現在の体制に影響しないためwarningsに記録した。
- history: 沿革の年月は行ごとに印字されており、年だけをyearに採った（月は書かない）。設立時や合弁設立時の出資比率・資本金の金額は転記していない。
- history: 清算済みの海外子会社や吸収合併済みの国内子会社など、期末日現在の体制に残らない沿革行は、主要な市場進出と体制変更を中心に選んで記録した。
- industry: 主たる業界はmachinery（機械）とした。事業は超純水製造装置というプラント装置の設計・施工・販売が中心であり、閉じたリストではmachineryが最も近い。
- industry: 超純水製造装置は半導体製造に必須の装置として事業内容に開示されているため、semiconductorsを2つ目に付けた。半導体そのものを製造する会社ではないため主たる業界にはしていない。閉じた集合の値で表現できるためtaxonomyGapsは記録しなかった。
- relatedCompanies: 北興化学工業株式会社（hokko-chemical-industry）は【大株主の状況】に事業会社として載る最大の株主（10.97％、2026年3月31日現在）であり、関連候補に正式名称が一致するため主要株主として結んだ。金額は記載していない。
- relatedCompanies: 株式会社クラレ（kuraray）は、2008年に排水処理事業の合弁会社クラレアクア株式会社を設立した相手だが、合弁は2012年3月に解消されており、現在の取引・提携の印字がないため結ばなかった。
- relatedCompanies: 日揮ホールディングス株式会社（jgc-holdings）は、1980年の合弁会社設立時の相手として沿革に現れるのみで、現在の取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: 主要な顧客であるラピスセミコンダクタ株式会社、SAMSUNG AUSTIN SEMICONDUCTOR,L.L.C.、SK Hynix Inc.は関連候補に含まれておらず、百科事典の対象として確認できないため結ばなかった。顧客としての事実はbusinessModelのperspectivesに記録した。
- relatedCompanies: 大株主に載る株式会社りそな銀行は金融機関であり、信託銀行（信託口）や資産管理会社は純投資の名義であるため結ばなかった。野村殖産株式会社、カツラギ工業株式会社、国土防災技術株式会社は関連候補に含まれていないため結ばなかった。
- relatedCompanies: 特定投資株式は「該当事項はありません」と印字されており、政策保有株式を根拠とする関連付けは行っていない。
- relatedCompanies: エン（en、ambiguous）は連結子会社名等への部分一致、ベース（base-4481）は「連結ベース」等の一般語、コア（core、ambiguous）は「コアタイム」、ゼロ（zero、ambiguous）は「ネットゼロ」等の記述、イオン（aeon）は「イオン類」という普通名詞、フリー（freee）は「バリアフリー」、レック（lec）は「ピュアレックス」への部分一致、ポート（port）は一般語、ビジョン（vision）は「経営ビジョン」、イノベーション（innovation）は一般語への一致であり、いずれも相手企業についての取引・提携の印字がないため結ばなかった。
- relatedCompanies: 日本アクア（nippon-aqua）は沿革の「日本アクアメディア株式会社」（当社の合弁会社、後に株式会社ナムテックに商号変更し吸収合併済み）への名称の類似であり、相手企業そのものではないため結ばなかった。レイ（ray、ambiguous）、あらた（arata）、日新（nissin、コードリストにない）、トラスト（trust、コードリストにない）は一般語や信託口への一致で、相手についての記述がないため結ばなかった。
- relatedCompanies: 連結子会社6社はグループ内の会社であり、businessStructureに記載した。関連企業としては結んでいない。
- terms: 助言: 用語「超純水」は、水中に溶解しているイオン類、有機物、生菌、微粒子等を含まない極めて純度の高い水を指します。半導体の製造過程では洗浄工程に必須とされています（【事業の内容】に印字）。
- terms: 助言: 用語「BOOM契約」は、Build Own Operate and Maintenanceの略で、当社がユーザーに超純水装置を提供し、ユーザーが使用した超純水の使用料を支払う契約で、装置の運転管理・メンテナンスは全て当社が行います（【事業の内容】に印字）。
- terms: 助言: 用語「ニュクリポアー・メンブレン」は、超精密ろ過膜の名称で、当社の設立目的となった製品です（【沿革】に印字）。

## 要確認（status に反映）

- businessModel: 株式分割：2024年４月１日付で普通株式１株につき４株の割合で株式分割を行った。株式数に関する指標は、2022年３月期の期首に当該株式分割が行われたと仮定して算定されている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
