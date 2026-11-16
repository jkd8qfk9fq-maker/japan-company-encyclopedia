# 湖北工業 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 湖北工業株式会社 |
| 証券コード | 6524 |
| docID（データを取り出した文書） | `S100XT3K` |
| 原本 docID | `S100XT3K` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT3K.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 湖北工業株式会社 / 6524 / docID S100XT3K（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kohoku-kogyo: 10 件の数値を有報XBRLと照合
有報: 湖北工業株式会社 有価証券報告書－第67期(2025/01/01－2025/12/31) (docID S100XT3K)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kohoku-kogyo: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は連結経営指標等とセグメント情報の百万円印字をそのまま記載した（千円額からの換算や切り捨ては行っていない）。
- businessModel: 営業利益・経常利益・セグメント利益の金額と増減率は、本文の財務数値が売上高と当期純利益に限られるため書いていない。受注高・受注残高・生産実績の金額も書いていない。
- businessModel: 経営指標等の注記５の表示単位の変更（第65期より千円単位から百万円単位へ）は表示方法の変更のみであるため、financialNotesには入れずここに記録した。
- businessModel: 経営方針に印字された2028年12月期に向けた目標経営指標と、経営者による分析で客観的な指標とされた事業別営業利益は、利益に関する指標であるため本文・戦略には書かずここに記録した。
- businessModel: 2025年12月期に実施した自己株式の取得は期中の資本政策であり、金額は本文の財務数値の範囲外のため書いていない。
- businessModel: suppliersは本ツリーのスキーマに無いためbusinessModelから省略した。仕入に関する事実として、アルミ線をはじめとした原材料等を仕入れており、特定の仕入先名は印字されていない。
- businessModel: 高純度石英ガラス製品（SSG®）は光部品・デバイス事業の中の製品分野であり、独立した報告セグメントではないため、productsに含めた。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順（リード端子事業8,802百万円、光部品・デバイス事業8,651百万円）とした。セグメント利益は本文に書いていない。
- businessStructure: 連結子会社は7社（KOHOKU ELECTRONICS (S) PTE.LTD.、KOHOKU ELECTRONICS (M) SDN.BHD.、東莞瑚北電子有限公司、蘇州瑚北光電子有限公司、KOHOKU LANKA (PVT) LTD.、エピフォトニクス株式会社、EpiPhotonics USA, Inc.）で、いずれもリード端子事業または光部品・デバイス事業を担うため、構造は報告セグメント単位で表した。
- businessStructure: 光部品・デバイス事業の主要な顧客は、セグメント情報の関連情報に印字されたAlcatel Submarine Networks UK Ltd.とSubCom, LLCであり、顧客の種類として事業の説明に含めた。相手先別の金額や割合は本文の財務数値の範囲外のため書いていない。
- businessStructure: 2024年11月に株式会社ワープスペースと、2025年1月にARIEL Photonics Assembly Limited.と資本・業務提携を行っている。いずれも相手先は候補に含まれない非上場会社であり、構造上の変化ではないため、沿革に記録した。
- history: 設立行の資本金（50万円）は、沿革に資本金の金額を書かない規則のため落とした。
- history: 落とした行：1974年リード端子専用工場の増設、1991年本社管理事務・研究開発棟の完成、1997年ISO9001認証取得、1998年本社工場の増築、2000年中国（東莞）への委託加工会社設立、2005年ISO14001認証取得、2015年ISO/TS16949（現IATF16949）認証取得、2023年蘇州子会社の新工場移転。工場の増設・認証取得等の行は構造上の転機ではないため落とした。
- history: wikipedia.jsonは記事が見つからなかった（found: false）ため、補足には使わなかった。
- industry: 主たる業界は、両報告セグメント（リード端子事業＝電子部品、光部品・デバイス事業＝光通信用部品）がいずれも電機・電子部品の製造・販売であるためelectronicsとした。高純度石英ガラス製品は半導体関連市場向けの引き合いが増えているが、独立した事業としての開示がなく光部品・デバイス事業に含まれるため、semiconductorsは付けなかった。閉じた分類に合う値があるため、taxonomyGapsは付けていない。
- relatedCompanies: the-ogaki-kyoritsu-bank（株式会社大垣共立銀行）: 特定投資株式として10,937株を保有していますが、保有目的は「当社の主たる資金決済等を行う金融機関であり、安定的な取引維持のため」と金融機関との資金決済上の関係であるため、銀行は資金調達・決済が理由なら結ばない規則により結ばなかった。
- relatedCompanies: 日本ケミコン株式会社: 特定投資株式として8,000株を保有し、保有目的は「当社の販売先であり、取引関係の維持・強化のため」と個別に印字されていますが、同社はrelated-candidates.jsonに含まれないため結ばなかった（事実はここに記録）。
- relatedCompanies: fdk（FDK株式会社）: 2015年2月に同社より光デバイス事業を譲り受けた一度限りの事業譲渡であり、継続的な取引・提携の印字がないため結ばなかった（事実は沿革に記録）。
- relatedCompanies: space（株式会社スペース）: 2024年11月の資本・業務提携の相手先は株式会社ワープスペースであり、株式会社スペースとは別の法人です。ワープスペースは非上場で候補にも含まれないため結ばなかった。
- relatedCompanies: ARIEL Photonics Assembly Limited.: 2025年1月に資本・業務提携を行いましたが、非上場の外国会社で候補に含まれないため結ばなかった（事実は沿革に記録）。
- relatedCompanies: the-lead（株式会社リード）: 一致箇所は製品名「リード端子」への部分一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 一致箇所は「光通信」「衛星光通信」等の一般語で、同社への言及ではないため結ばなかった。
- relatedCompanies: core（株式会社コア）: ambiguous。一致箇所は「コア技術」の一般語への部分一致のため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 一致箇所は「営業利益ベース」等の一般語への部分一致のため結ばなかった。
- relatedCompanies: cota（コタ株式会社）: ambiguous。一致箇所は「インコタームズ」への部分一致のため結ばなかった。
- relatedCompanies: daiwa（株式会社大和）: ambiguous。一致箇所は子会社の所在地「大和市」への部分一致のため結ばなかった。
- relatedCompanies: king（株式会社キング）: 一致箇所は「ワーキンググループ」への部分一致のため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）: ambiguous。一致箇所は「超高速通信」への部分一致のため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguous。一致箇所は「情報セキュリティ」への部分一致のため結ばなかった。
- relatedCompanies: rent（株式会社レント）: 一致箇所は「タレントマネジメント」への部分一致のため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: listingが（コードリストにない）。一致箇所も大株主の日本マスタートラスト信託銀行（信託口）で、信託口は結ばないため結ばなかった。
- relatedCompanies: amuse（株式会社アミューズ）: 一致箇所は「アミューズメント機器」の用途名への部分一致のため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 一致箇所は「キャリア」等の一般語への部分一致のため結ばなかった。
- relatedCompanies: freee（フリー株式会社）: 一致箇所は一般語への部分一致のため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 一致箇所は「サポート」への部分一致のため結ばなかった。
- relatedCompanies: ray（株式会社レイ）: ambiguous。一般語への部分一致のため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 一致箇所は「経営ビジョン」の一般語への部分一致のため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: ambiguous。一般語への部分一致のため結ばなかった。
- relatedCompanies: 大株主の状況に載るのは個人株主と信託銀行・カストディ等の金融機関、非上場のアイエフマネジメント株式会社であり、結べる事業会社はなかった。
- terms: 助言: 用語「リード端子」は、アルミ電解コンデンサの主要構成部品である電極リード材を指し、同社の祖業として事業の内容に印字されています。
- terms: 助言: 用語「光アイソレータ」は、光ファイバ通信で光の逆流を防ぐ光部品で、海底ケーブル向けが同社の中核商品として印字されています。
- terms: 助言: 用語「SSG®」は、同社の高純度石英ガラス製品の名称で、半導体関連市場向けに量産体制の構築が進められている旨が印字されています。
- terms: 助言: 用語「PLZT」は、チタン酸ジルコン酸ランタン鉛の略称で、子会社のエピフォトニクス株式会社が薄膜形成技術を持ち、単結晶PLZT薄膜ウエハの販売が開始されています。
- terms: 助言: 用語「グローバルニッチトップ（GNT）」は、国内外の小規模市場を一体的に捉えたグローバル市場で高いシェアと地位を築くという同社の成長シナリオを指し、経営方針に印字されています。

## 要確認（status に反映）

- businessModel: 連結経営指標等の注記に、2024年４月１日付で普通株式１株につき３株の割合で株式分割を行った旨が印字されています。
- businessStructure: 連結経営指標等の注記に、2024年４月１日付で普通株式１株につき３株の割合で株式分割を行った旨が印字されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
