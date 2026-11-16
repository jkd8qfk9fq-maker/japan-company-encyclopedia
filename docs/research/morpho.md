# モルフォ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社モルフォ |
| 証券コード | 3653 |
| docID（データを取り出した文書） | `S100XHZH` |
| 原本 docID | `S100XHZH` |
| 提出日（原本） | 2026-01-28 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHZH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社モルフォ / 3653 / docID S100XHZH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
morpho: 10 件の数値を有報XBRLと照合
有報: 株式会社モルフォ 有価証券報告書－第22期(2024/11/01－2025/10/31) (docID S100XHZH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
morpho: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 指標等の注記1（従業員数は就業人員）、注記2（潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していない）、注記3（当期純損失の期は自己資本利益率及び株価収益率を記載していない）は表示・開示上の説明であり、会計基準の変更ではないため financialNotes には入れず、ここに記録する。
- businessModel: MD&Aの段階利益の金額や増減率、キャッシュ・フローの金額、総資産・純資産の金額は本文に書いていない（本文の金額は売上高と当期純損失のみ）。
- businessModel: 中期経営計画「Vision2027」の数値目標は投資指標に関わるため、戦略の文章には書いていない。
- businessModel: 主な製品別の販売実績の金額は、割合の分母が売上高全体と一致しないため本文に書いていない。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。個別の仕入先名は【事業の内容】に印字されていない。
- businessStructure: 単一セグメントのため設備と事業の対応は結びつけなかった。本社は本社機能及び研究開発設備（東京都千代田区）、在外子会社ではMorpho China, Inc.（中国深セン市）の事業用及び研究開発設備が印字されている。帳簿価額は書いていない。
- businessStructure: 地域ごとの売上高（2025年10月期）は日本1,280百万円、中国1,594百万円、米国286百万円、欧州139百万円、その他海外158百万円、韓国0百万円と【関連情報】に印字されているが、セグメントではないため事業の金額としては書かず、記録のみとする（千円印字を百万円に切り捨て）。
- businessStructure: 主な製品別の販売実績（Morpho Image Refiner、Morpho Panorama Giga Pixel、Morpho Super-Resolution、MovieSolid、Morpho Distortion Correction）はMD&Aの販売実績表に印字されているが、割合の分母が売上高全体と一致しないため、金額は事業の内訳として書かず、製品名のみ businessModel の products に記録した。
- businessStructure: 連結子会社は5社（株式会社モルフォAIソリューションズ、Morpho US, Inc.、Morpho Korea, Inc.、Morpho China, Inc.、Morpho Taiwan, Inc.、いずれも議決権の所有割合100.0％）。持分法適用会社はPUX株式会社（20.8％）とTop Data Science Ltd.（26.3％）。株式会社モルフォAIソリューションズはAIコンサルティング・ソフトウェア開発事業を営む。
- history: 沿革のうち本社の移転のみの行（2014年の東京都千代田区西神田への移転）は、2022年の神田錦町への移転を2022年の事象に併記し、2014年の行は落とした。
- history: 2017年の株式会社エスアールエルとの業務提携は、相手が非上場で現在の関係を示す記載もないため落とした。
- history: 年月は印字されているが、規則により年のみを記録した（月は書いていない）。資本金の金額は書いていない。
- industry: 画像処理ソフトウェアの開発とライセンス販売が事業の実体であり、売上高のすべてを占める単一セグメントであるため、it を主分類とした（直接の適合であり暫定ではない）。
- relatedCompanies: h-u-group-holdings（H.U.グループホールディングス）は、2017年に前身のみらかホールディングスと資本提携したことが沿革に印字されるのみで、2025年10月31日現在の大株主の上位になく、現在の取引や契約の記載もないため結ばなかった。
- relatedCompanies: matsui-securities（松井証券）は2025年10月31日現在の大株主（4.14％）だが、証券会社の純投資と判断し結ばなかった。同じく大株主の株式会社ＳＢＩ証券（2.87％）も候補ではない。
- relatedCompanies: port（ポート）は「ポーティング」など一般語の部分一致のみで、同社について述べる記載はないため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）は、中期経営計画のビジョン文の部分一致のみで、同社について述べる記載はないため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）は、ビジョン文の「イノベーション」の部分一致のみで、同社について述べる記載はないため結ばなかった。
- relatedCompanies: hiraga（株式会社平賀）はambiguousな候補であり、代表取締役社長の氏名の部分一致のみのため結ばなかった。
- relatedCompanies: en（エン株式会社）はambiguousな候補であり、一般語の部分一致のみのため結ばなかった。
- relatedCompanies: land（株式会社ランド）は「フィンランド」の部分一致のみのため結ばなかった。
- relatedCompanies: lec（レック株式会社）は「フレックスタイム」の部分一致のみのため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）はambiguousな候補であり、「処理高速化」の部分一致のみのため結ばなかった。
- relatedCompanies: path（パス株式会社）はambiguousな候補であり、部分一致のみのため結ばなかった。
- relatedCompanies: rhythm（リズム株式会社）は一般語の部分一致のみのため結ばなかった。
- relatedCompanies: trust（トラスト）はlistingがコードリストにない相手であり、日本マスタートラスト信託銀行株式会社（信託口）の部分一致で、信託口の純投資のため結ばなかった。
- relatedCompanies: 候補に含まれない相手の記録: ソニーセミコンダクタソリューションズ株式会社は2024年に資本業務提携を結び、2025年10月期の主要な顧客（売上高に占める割合12.5％）だが、候補に含まれないため結ばなかった。
- relatedCompanies: 候補に含まれない相手の記録: 株式会社ミックウェアは2021年に業務提携を結び、2025年10月31日現在の大株主（4.20％）だが、候補に含まれないため結ばなかった。
- relatedCompanies: 候補に含まれない相手の記録: Xiaomi Communications Co., Ltd.とMotorola Mobility LLCは主要な顧客だが、候補に含まれないため結ばなかった。
- relatedCompanies: 自社の連結子会社5社と持分法適用会社2社（PUX株式会社、Top Data Science Ltd.）は結ばなかった。
- terms: 助言のみ。用語候補: 画像処理ソフトウェア、ロイヤリティ収入（搭載機器の出荷台数等に応じたライセンス料）、ポーティング（ソフトウェア製品の実装支援）、組込み機器、イメージング・テクノロジー、特定子会社

## 要確認（status に反映）

- businessModel: 連結子会社の株式会社モルフォAIソリューションズについて、2025年12月12日付の取締役会で、2026年４月１日を合併効力発生日として当社が吸収合併することが決議されています（【重要な契約等】と注記事項（重要な後発事象）に印字）。本登録は2025年10月31日現在のグループ構成（同社は連結子会社として存続）で作成しており、合併後の取扱いは人の確認が必要です。
- businessStructure: 連結子会社の株式会社モルフォAIソリューションズについて、2025年12月12日付の取締役会で、2026年４月１日を合併効力発生日として当社が吸収合併することが決議されています（【重要な契約等】と注記事項（重要な後発事象）に印字）。本登録は2025年10月31日現在のグループ構成（同社は連結子会社として存続）で作成しており、合併後の取扱いは人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
