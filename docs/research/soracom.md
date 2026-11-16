# ソラコム — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ソラコム |
| 証券コード | 147A |
| docID（データを取り出した文書） | `S100YGJH` |
| 原本 docID | `S100YGJH` |
| 提出日（原本） | 2026-06-30 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGJH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ソラコム / 147A / docID S100YGJH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
soracom: 10 件の数値を有報XBRLと照合
有報: 株式会社ソラコム 有価証券報告書－第13期(2025/04/01－2026/03/31) (docID S100YGJH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
soracom: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円印字を百万円に切り捨てて記載した（切り捨ての方針）。区分の単純合計（12,422百万円）と印字の合計（12,423百万円）との1百万円の差は切り捨てによるものである。
- businessModel: brief の「財務諸表の組替え」の注意について確認した。前期有報との修正再表示チェックは全系列で差異がなく、抽出された本文の範囲に財務諸表の組替えに関する注記は見当たらなかった。当期の変更はセグメント名称の変更（名称のみ）のみであるため、financialNotes は設けていない。
- businessModel: 営業利益・経常利益等の金額や、特別損失として計上された貸倒引当金繰入額・投資有価証券評価損の金額は、本文の財務数値を売上高と当期純利益に限る規則のため本文には書いていない。
- businessModel: グローバル売上比率50％超の目標は投資指標ではない会社の公表目標のため strategy.disclosed に要約して含めた。NRRやARPA等の経営指標の数値は、perspectives の要約には含めていない（課金アカウント数と解約率は事業の規模・継続性を示す事実として industryPosition に記載）。
- businessModel: 通信回線の調達先（KDDI株式会社、株式会社NTTドコモ等の移動体通信事業者）は suppliers キーを本ツリーのスキーマが持たないため businessModel には含めず、businessStructure と relatedCompanies に記録した。
- businessStructure: 単一セグメントのため、事業の内訳はセグメント注記【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）に基づき children とした。金額は千円印字を百万円に切り捨てて記載しており、区分の単純合計（12,422百万円）と印字の合計（12,423百万円）との1百万円の差は切り捨てによるものである。
- businessStructure: セグメント名称は当連結会計年度から「IoTプラットフォーム事業」から「AI/IoTプラットフォーム事業」に変更された（名称のみの変更で、セグメント情報への影響はない旨が印字されている）。
- businessStructure: 通信回線の調達先である移動体通信事業者（KDDI株式会社、株式会社NTTドコモ等）は suppliers として businessModel には記載せず（本ツリーのスキーマに suppliers キーがないため）、関係会社の状況に基づく関係は relatedCompanies 及び本文に記録した。
- businessStructure: Wikipediaの記事はあるが、冒頭の「KDDIの連結子会社」という記述は2024年3月上場時にその他の関係会社へ変更された後の体制と食い違うため、補足には使用していない。
- history: 沿革の表は年月と事象が対応して印字されており、そのまま行順に対応づけた。資本金の金額は沿革に印字されていないため記載していない。
- history: 省電力無線通信規格（LoRaWAN・Sigfox）への対応、IoT SELECTIONの開設、SORACOM Mobileの提供開始、LTE-M Buttonの発売等の個別サービスの開始は、主要な節目に絞るため沿革の行としては省き、事業の内容側の記述に委ねた。
- history: 株式会社キャリオット（2024年10月）及び株式会社ミソラコネクト（2025年8月）の株式取得はいずれも期中に完了し、期末の連結体制に反映されているため、needsReview ではなく沿革と警告に記録した。
- industry: 主産業は telecommunications（通信）とした。当社グループは移動体通信事業者から回線を調達する仮想移動体通信事業者（MVNO）として、自社構築のモバイル・コアを運営し、リカーリング収益の主要な収益源が通信サービス（コネクティビティ）であるためである。プラットフォームのネットワークサービス・アプリケーションサービスというソフトウェア面の事業も中核であるため、it（IT・ソフトウェア）を副次産業として付けた。東証の業種分類は情報・通信業である。閉じた分類に当てはまる値があるため taxonomyGaps は設けていない。
- relatedCompanies: 丸紅（marubeni）は結ばなかった。経営方針には「丸紅グループ」との戦略的協業の記述があり、株式会社ミソラコネクトは丸紅ネットワークソリューションズ株式会社のMVNO事業を承継した会社であるが、いずれも丸紅株式会社自身との取引・提携の印字ではなく、グループ総称とその子会社（別法人）に関する記述にとどまるためである。事実は history と本警告に記録した。
- relatedCompanies: NTT（ntt）は結ばなかった。本文に印字されているのは株式会社NTTドコモ（NTT株式会社の子会社）との回線調達であり、NTT株式会社自身は取引の相手方として印字されていないためである。
- relatedCompanies: World Innovation Lab（WiL Ventures III, L.P.）は2021年6月の資本業務提携の相手であり、2026年4月30日現在で発行済株式の7.15％を保有する大株主だが、未上場のファンドであり関連候補に含まれないため結ばなかった。
- relatedCompanies: 株式会社エナジー宇宙（日本瓦斯株式会社の完全子会社）は前連結会計年度の主要な顧客（売上高963,981千円）だが、未上場の別法人であり関連候補に含まれないため結ばなかった。当連結会計年度は売上高の10％以上を占める顧客はないと印字されている。
- relatedCompanies: 株式会社日本カストディ銀行（信託口）は信託口としての保有であり、純投資と判断して結ばなかった。玉川憲、舩渡大地、安川健太の各氏は個人株主のため対象外とした。
- relatedCompanies: 名称の一致のみで根拠のない候補は結ばなかった：career（通信キャリアの語）、core（モバイル・コアの語）、port（サポート・パートナー等の部分一致）、innovation（テクノロジーイノベーションの語）、vision（ビジョンの語）、land・ray・secure・base-4481・king・kohsoku・cover・space・como・lec・en・no-1（いずれも一般語・部分一致）、taya（本店所在地の玉川等との曖昧な一致）、nissin（コードリストにない曖昧な一致）、sumitomo-realty-and-development（最寄りの連絡場所の建物名のみ）。
- terms: 助言のみ。用語の追加提案：IoTプラットフォーム（IoT向けの通信・データ活用基盤）、モバイル・コア（モバイル通信の基幹システム）、MVNO（仮想移動体通信事業者）、リカーリング収益（プラットフォーム利用料として継続的に得る収益）、課金アカウント数、LPWA（省電力・長距離の無線通信技術）、eSIM（組み込み型SIM）。本文中の用語解説（事業の内容末尾）に基づく。

## 要確認（status に反映）

- businessModel: 当社は2022年12月30日付で普通株式1株につき3株の割合で株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（分割は第9期の期首に行われたものとして指標が算定されています）。
- businessStructure: 当社は2022年12月30日付で普通株式1株につき3株の割合で株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（分割は第9期の期首に行われたものとして指標が算定されています）。
- history: 当社は2022年12月30日付で普通株式1株につき3株の割合で株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（分割は第9期の期首に行われたものとして指標が算定されています）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
