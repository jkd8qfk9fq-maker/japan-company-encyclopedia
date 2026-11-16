# チノー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社チノー |
| 証券コード | 6850 |
| docID（データを取り出した文書） | `S100YJHF` |
| 原本 docID | `S100YJHF` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJHF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社チノー / 6850 / docID S100YJHF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
chino: 10 件の数値を有報XBRLと照合
有報: 株式会社チノー 有価証券報告書－第90期(2025/04/01－2026/03/31) (docID S100YJHF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
chino: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円印字をそのまま記載した。セグメント注記・関連情報・MD&Aはいずれも百万円単位の印字であり、千円印字からの切り捨て換算は行っていない。
- businessModel: MD&Aに印字された受注高30,239百万円は、本文の財務数値を売上高と当期純利益に限る規則のため記載しなかった。営業利益3,225百万円・経常利益3,326百万円の金額と増減も同規則により本文に記載しなかった。
- businessModel: MD&Aに印字された事業別ROICの検討・導入や、経営指標等の自己資本利益率などの投資・収益性指標は、本文・戦略には書かなかった。
- businessModel: Wikipediaの冒頭にある『赤外線計測分野は国内シェアトップクラス』『燃料電池評価試験分野では世界シェアトップクラス』はシェア・順位の記述であり、規則により本文に使わず、出典にも加えなかった。
- businessModel: financialNotesは空とした。修正再表示チェックで前期有報との差異がなく、変則決算・決算期変更もないためである。株式分割についてはneedsReviewに記録した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順（計装システム11,695百万円、計測制御機器9,608百万円、センサ9,188百万円）とし、報告セグメントに含まれない「その他」（1,155百万円）を最後に置いた。
- businessStructure: 連結子会社は12社（チノーソフテックス、三基計装、浅川レンズ製作所、アーズ、アドバンス理工、明陽電機、CHINO Works America Inc.、上海大華－千野儀表有限公司、千野測控設備（昆山）有限公司、韓国チノー、CHINO Corporation India Private Limited、CHINO Corporation (Thailand) Limited）。いずれもグループ会社のため関連企業には結んでいない。
- businessStructure: 上海大華－千野儀表有限公司（議決権50％）、韓国チノー（同50％）、CHINO Corporation (Thailand) Limited（同49％）は、持分が50％以下でも実質的に支配しているため連結子会社とされている旨が【関係会社の状況】に注記されている。
- history: 沿革の表は2015年1月・2016年4月の年月セルが連続して印字され事象文と分かれている崩れた表だった。年月の数（2）と事象の数（2）が同じため、行順で対応づけた（2015年1月＝チノーサービスの吸収合併、2016年4月＝東京支店・北部支店の統合）。2020年4月・2022年4月も同様に、明陽電機の子会社化とプライム市場移行を行順で対応づけた。
- history: 沿革のうち、藤岡工場・久喜工場の新設、本店所在地の移転、営業所の支店への改組、千野製作所の子会社設立（チノーソフテックス、山形チノー）、東京精工・山形チノーの吸収合併、インド子会社の完全子会社化、アーズの子会社化、技術開発センターの改組などの行は、会社の輪郭を描くうえで優先度が低いため落とした。
- history: 子会社の資本金の額は沿革・事業の説明に書かない規則のため記載していない。
- industry: 主たる業界は、計測制御機器・計装システム・センサという産業用計測機器の製造・販売が売上の大半を占めるため machinery とした。
- industry: 計装システムにはデバイス・半導体試験装置も含まれるが、半導体向けの金額は独立して開示されておらず、同セグメントは燃料電池評価試験装置やコンプレッサ評価試験装置など自動車・環境分野の装置も中心であるため、semiconductors は付けなかった。
- industry: 閉じた分類に計測機器専用の値はないが、machinery で足りると判断し、分類の不足（taxonomyGaps）は記録しなかった。
- relatedCompanies: 特定投資株式の保有目的は2種類に分かれる。『当社製品の販売先であり、安定的な取引関係の維持・強化を目的』と、取引先としての役割が銘柄ごとに明示された6社（ニッカトー、共和電業、エスペック、東亜ディーケーケー、英和、不二越）は、販売先（customer）として結んだ。説明には計上額を書かず、株式数と、当社の大株主でもある場合はその持株比率と基準日を書いた。
- relatedCompanies: hioki-e-e（日置電機）・horiba（堀場製作所）・azbil（アズビル）・yokogawa-electric（横河電機）・nagano-keiki（長野計器）・tokyo-keiki（東京計器）・ono-sokki（小野測器）：特定投資株式の保有目的は『当社と同業である同社の情報収集・動向調査を目的』であり、取引・提携の記述がないため結ばなかった。
- relatedCompanies: optex-group（オプテックスグループ）：同上の情報収集目的の保有であり、当連結会計年度に全て売却され株式数がゼロになったため結ばなかった。
- relatedCompanies: 大株主のうち、日本マスタートラスト信託銀行株式会社（信託口）・株式会社日本カストディ銀行（信託口）は信託口の純投資、チノー取引先持株会・チノー従業員持株会は未上場の持株会、株式会社北浜製作所は未上場で候補に無く、日本生命保険相互会社は相互会社で候補に無いため、いずれも結ばなかった。
- relatedCompanies: career（キャリア）・en（エン）・vision（ビジョン）・port（ポート）・innovation（イノベーション）・core（コア）・zero（ゼロ）・base-4481（ベース）・freee（フリー）・ishin（イシン）・king（キング）・kohsoku（高速）・land（ランド）・rent（レント）・seki（セキ）・suzuki-6785（鈴木）・trust（トラスト）・applied-technology（応用技術）：キャリア自律、エンゲージメント、経営ビジョン、サポート室、イノベーションセンター、コア事業、実質ゼロ、営業利益ベース、フリー・キャッシュ・フロー、ワーキングチーム、熱画像の高速化、ブランド、コンカレント、セキュリティ、役員の人名、信託銀行名、研究開発の用語などへの部分一致であり、当該上場企業についての取引・提携・資本関係の記述はないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 当社は2025年10月1日付で普通株式1株につき2株の割合で株式分割を行っています。株式関連の指標は、第86期の期首に当該株式分割が行われたと仮定して算定されています（経営指標等の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
