# ｓａｎｔｅｃ　Ｈｏｌｄｉｎｇｓ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ｓａｎｔｅｃ　Ｈｏｌｄｉｎｇｓ株式会社 |
| 証券コード | 6777 |
| docID（データを取り出した文書） | `S100YH8U` |
| 原本 docID | `S100YH8U` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH8U.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ｓａｎｔｅｃ　Ｈｏｌｄｉｎｇｓ株式会社 / 6777 / docID S100YH8U（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
santec-holdings: 10 件の数値を有報XBRLと照合
有報: ｓａｎｔｅｃ　Ｈｏｌｄｉｎｇｓ株式会社 有価証券報告書－第47期(2025/04/01－2026/03/31) (docID S100YH8U)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
santec-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「santec　Holdings株式会社」が EDINET の提出者名「ｓａｎｔｅｃ　Ｈｏｌｄｉｎｇｓ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記: セグメントの外部顧客への売上高は千円の印字を百万円へ切り捨てて記載した（切り捨てを warnings に記録する慣例どおり）。切り捨て後のセグメント合計は31,506百万円で、印字の連結売上高31,507百万円と1百万円差がある。連結売上高と純利益はMD&Aの百万円印字どおり。
- businessModel: 経営指標等の注記: 第44期に企業結合に係る暫定的な会計処理が確定し、第43期（2022年3月期）の経営指標は確定後の内容を反映した数値で表示されている。前期有報との修正再表示チェックでは全系列が一致しており、当期の5年表に不連続はないため、financialNotes は付けず判断をここに記録した。
- businessModel: 経営上の目標として掲げる売上高総利益率50%、売上高営業利益率15%は利益率の指標のため本文・戦略には書かず、ここに記録する。
- businessModel: 受注高・受注残高の金額は本文の数値に使っていない。セグメント利益の金額も書いていない。
- businessModel: 主要な顧客のAlcon, Inc.は related-candidates.json に無く百科事典の登録企業ではないため関連企業として結ばず、顧客としての事実を perspectives と warnings に記録した。
- businessModel: suppliers はこのツリーのスキーマに無いキーであるため businessModel には書いていない。個別の仕入先の開示も有報に無い。
- businessModel: 投資有価証券評価損の金額など、売上高と当期純利益以外の損益項目の金額は本文に書いていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（光測定器関連事業22,368百万円、光部品関連事業6,356百万円）。システム・ソリューション事業は有報が「報告セグメントに含まれていない事業セグメント」と明記する区分のため最後に置いた（金額はセグメント注記に印字あり）。
- businessStructure: セグメント外部売上高（千円）を百万円へ切り捨てて記載した。切り捨て後の合計は31,506百万円となり、印字の連結売上高31,507百万円と1百万円差がある（千円単位の内訳を切り捨てたための差異で、有報の印字どおり）。
- businessStructure: 連結子会社は16社（2026年3月31日現在）。MOG LABORATORIES PTY LTDは2026年5月にSANTEC AUSTRALIA PTY LTDへ商号変更している（期後のため businessModel の needsReview に記録し、登録は期末時点の商号）。
- businessStructure: Santec Europe Czech s.r.o.とSantec Vienna GmbHは2026年3月31日現在の連結子会社であり、営業開始は2026年4月（期後）。期末時点の体制として登録した。
- history: 沿革は多数の行があるため、創業・事業転換・上場・持株会社化・主な買収など会社の形を変えた出来事を中心に選んだ。落とした主なもの（いずれも理由は小規模な拠点・認証・設備の動きであるため）: 1985年米国現地法人設立、1989年本社竣工、1996〜2002年の子会社の商号変更・吸収合併、1997年ISO9001取得、1998年英国子会社設立、1999年研究開発棟竣工、2001年工場専用棟竣工、2003年システム・ソリューション事業開始、2004年ISO14001取得、2006年・2013年・2018年・2025年の販売拠点の開設・移転、2009年LCOS製造設備導入、2013年シリコンバレー研究拠点開設、2022年市場区分再編に伴うスタンダード市場移行と海外子会社の商号変更。
- history: 資本金の金額は沿革に書かない規則のため、1979年設立時の資本金額は記載していない。
- history: 2026年4月以降の出来事（Santec Europe Czech s.r.o.とSantec Vienna GmbHの営業開始、Aqumen Capital株式会社への資産管理事業の一部の吸収分割、2026年5月のMOG LABORATORIES PTY LTDの商号変更）は決算期後のため沿革には入れず、期後の分割と商号変更は businessModel の needsReview に、営業開始は businessStructure の warnings に記録した。
- industry: 主たる業界は electronics（電機）とした。光部品関連事業と光測定器関連事業はいずれも光通信・光計測の電気・光学機器であり、閉じた分類の中で最も近い。半導体は、市場環境の文脈以外で半導体事業の開示が無いため付けていない。
- relatedCompanies: Alcon, Inc.: 光測定器関連事業の主要な顧客（2026年3月期の売上高5,572百万円、連結売上高の17.7%）。related-candidates.json に無く百科事典の登録企業ではないため結ばなかった。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 「光通信」は事業分野の名称と子会社名「圣徳科（上海）光通信有限公司」の一部として現れるのみで、株式会社光通信そのものとの取引・提携・資本関係の記載が無いため結ばなかった。
- relatedCompanies: sanyo-engineering-and-construction（株式会社サンテック）: 有報の「サンテック」は当社自身の旧商号であり、株式会社サンテック（証券コード1960）との関係の記載が無いため結ばなかった。
- relatedCompanies: samco（株式会社サムコ）: 沿革に現れる「サムコム」は当社の旧子会社名であり、株式会社サムコとの関係の記載が無いため結ばなかった。
- relatedCompanies: 大株主の株式会社光和（16.93%）、株式会社ChronoSource（12.69%）、Gens Global株式会社（9.23%）、幸昇株式会社（7.23%）はいずれも未上場で候補に無く、結ばなかった（2026年3月31日現在）。信託口の日本カストディ銀行は信託口のため結ばなかった。
- relatedCompanies: 特定投資株式: 保有目的が純投資目的以外の投資株式はすべて非上場株式で、銘柄ごとの開示対象は無い。政策保有による上場企業との関係は確認できなかった。
- relatedCompanies: en / base-4481 / freee / core / heiwa / kohsoku / career / land / zero / ic / port / seki / the-lead / vision: いずれも一般語（エンジニアリング、時価ベース、フリーキャッシュ・フロー、コア技術、理念文中の平和、高速スキャニングレーザー、キャリア、ランド、ゼロ、ICパッケージ、ポートフォリオ、セキ、リード、ビジョン）との文字列一致のみで、各社との取引・提携・資本関係の記載が無いため結ばなかった。
- terms: 用語の助言: 「OCT（光干渉断層画像計）」「空間光変調器（SLM）」「波長可変光源」は光計測分野の専門用語として用語集への追加候補です。本文では初出で読みを補っています。
- terms: 用語工程は助言のみのため data は空です。

## 要確認（status に反映）

- businessModel: 2026年4月1日（決算期後）に、完全子会社であるAqumen Capital株式会社を承継会社とする吸収分割により、当社の資産管理事業の一部を同社へ承継しました（重要な後発事象に記載）。登録は2026年3月31日現在の体制で行っています。
- businessModel: 連結子会社MOG LABORATORIES PTY LTDは、2026年5月（決算期後）にSANTEC AUSTRALIA PTY LTDへ商号変更しました（事業の内容・関係会社の状況に記載）。登録は2026年3月31日現在の商号で行っています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
