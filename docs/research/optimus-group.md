# オプティマスグループ — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オプティマスグループ |
| 証券コード | 9268 |
| docID（データを取り出した文書） | `S100YRX1` |
| 原本 docID | `S100YJVB` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YRX1／有効文書 S100YRX1（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YRX1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オプティマスグループ / 9268 / docID S100YJVB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 5 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
optimus-group: 10 件の数値を有報XBRLと照合
有報: 株式会社オプティマスグループ 訂正有価証券報告書－第12期(2025/04/01－2026/03/31) (docID S100YRX1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上高 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△））。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 訂正有価証券報告書（訂正有価証券報告書－第12期(2025/04/01－2026/03/31)、docID S100YRX1）を有効文書としてこのパックを作った。原本は docID S100YJVB。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはRemunerationForDirectorsAndOtherOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
optimus-group: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…店舗運営などの費用を差し引いた残りが利益になります。2026年3月期のは2,…）

## エージェントの判断記録（fragment warnings）

- businessModel: revenue / netIncome の候補が2件ずつある問題について: 【連結経営指標等】にはIFRSの表（移行日2024年4月1日・第11期・第12期）と日本基準の表（第8期〜第12期）の両方が印字されている。機械が組んだ財務系列は年度ごとに実表と一致している（2024年3月期以前は日本基準の行、2025年3月期・2026年3月期はIFRSの行で、当期の売上高315,507百万円・親会社の所有者に帰属する当期利益2,469百万円はIFRS表の印字どおり）ため、本文も当期・前期ともIFRSの印字額だけを使った。日本基準の当期額（純損失208百万円など）は未監査の参考開示であり、本文には使っていない。
- businessModel: 有効文書は訂正有価証券報告書（docID S100YRX1、2026年7月23日提出）で、分類は record-only（原本との差異は役員報酬の開示のみで、エントリーが引用する数値・本文は同一）のため、訂正については needsReview に入れていない（ibiden の先例）。出典の title・url・publishedAt は訂正有報の値を用いた。
- businessModel: 証拠パックの注意（本文に組替え・遡及適用の記載がある）について: 該当箇所はIFRS初度適用に伴う前期数値の組み替えであり、IFRS移行そのものの一部である。前期有報との修正再表示チェックも全項目一致だったため、独立した注記は書かず、会計基準の変更として financialNotes にまとめた（fuji-oil の先例）。
- businessModel: 永久劣後特約付ローン（2026年3月27日契約締結、2026年3月期中に105億円を実行）は【重要な契約等】に開示された資本・資金調達の事項で、金額も資本政策の内容のため本文・needsReview ともに入れず、ここに記録する（glory の先例）。後発事象は連結・個別とも「該当事項はありません」。
- businessModel: 本文の財務数値は売上高と当期純利益（親会社の所有者に帰属する当期利益）だけにした。営業利益・税引前利益・セグメント利益・持分法損益などの金額と増減率は文章の規則により書かなかった（増減率は売上高の17.3％増のみ）。経営指標として会社が挙げるROE等の数値目標も書いていない。
- businessModel: Wikipedia（「オプティマスグループ」の記事）の冒頭は本社の所在地と事業の概要で、有報と重なる内容しかなかったため、補足には使わなかった。
- businessStructure: 事業の並び順は、セグメント注記の2026年3月期「外部顧客への売上高」の大きい順（小売・卸売事業220,185百万円→輸出入事業53,859百万円→物流事業32,921百万円→検査事業4,323百万円→サービス事業3,863百万円）。「その他」（354百万円）は有報が「報告セグメントに含まれない」と明記する区分のため最後に置いた。
- businessStructure: セグメント利益（営業利益ベース）の金額は文章の規則により書いていない。金額はすべてセグメント注記の外部顧客への売上高（百万円）で、MD&Aのセグメント間取引を含む金額（小売・卸売2,202億３百万円など）とは異なる。
- businessStructure: 株式会社日貿の販売台数49,611台は【事業の内容】の印字どおり。前期比18.1％増の伸びも同箇所の印字である。
- history: 当社の沿革表（2015年設立以降）は年月と事象が一体で印字されており、行順の対応づけは不要だった。1988年・1989年・2001年の項目は【沿革】の前文と事業別沿革（輸出入・検査）の印字に基づく。
- history: 省いた行: Universal Finance Company Limited設立（2015年）、Optimus Group New Zealand Limited／Optimus Group Australia Pty Ltd設立（2018年）などの中間持株会社の設立、OzCar Pty Ltdへの段階的な出資（2019年〜2021年）、Blue Flag Pty Ltdの連結子会社化（2022年）、Autopactの傘下会社の取得・事業譲受（2025年）など、地域統括会社や傘下の細かな再編は主要な転機に絞って落とした。
- history: 金額（資本金・取得価額）は沿革に印字されていないものも含め書いていない。
- industry: 5つの報告セグメントはいずれも自動車関連で、最大の小売・卸売事業（外部顧客への売上高220,185百万円、連結の約7割）が自動車の販売であるため、automotive を主たる業界とした。
- industry: 物流事業は報告セグメントとして独立開示されており（外部顧客への売上高32,921百万円）、自動車の海上・陸上輸送を担うため transportation を2つ目に付けた。
- industry: サービス事業（自動車ローン等）は金額が小さく、金融としての独立開示でもないため finance は付けていない。検査事業・輸出入事業は automotive の範囲として扱った。
- industry: 閉じた分類に主たる事業が合う値があるため taxonomyGaps は付けていない。
- relatedCompanies: 結んだ相手は0社である。関連企業候補22件はいずれも、社名の断片・一般語の一致か、資金調達・純投資の関係にとどまり、有報がその相手について述べる取引・提携・資本関係の根拠がなかった。
- relatedCompanies: land: 一致は「ニュージーランド（New Zealand）」の「ランド」の部分のみで、株式会社ランドの記載はない。
- relatedCompanies: daiwa（ambiguous）: 一致は連結子会社である大和ロジスティクス株式会社の社名の一部であり、株式会社大和（8247）ではない。
- relatedCompanies: port: 一致は連結子会社であるポートサービス株式会社の社名の一部であり、ポート株式会社の記載はない。
- relatedCompanies: rhythm: 一致は行動指針などの理念文中の一般語で、リズム株式会社の記載はない。
- relatedCompanies: base-4481: 一致は「IFRS会計基準ベース」という一般語で、ベース株式会社の記載はない。
- relatedCompanies: vision: 一致は「グループビジョン」という一般語で、株式会社ビジョンの記載はない。
- relatedCompanies: ray（ambiguous）: 一致は個人名などの断片で、株式会社レイの記載はない。
- relatedCompanies: seki（ambiguous）: 一致は「情報セキュリティ」の一部で、セキ株式会社の記載はない。
- relatedCompanies: career: 一致は人材方針における「キャリア（成長実感）」という一般語で、株式会社キャリアの記載はない。
- relatedCompanies: en（ambiguous）: 一致は一般語の断片で、エン株式会社の記載はない。
- relatedCompanies: insight: 一致は「オンラインサイト」の「サイト」の一部で、株式会社インサイトの記載はない。
- relatedCompanies: space: 一致はNVOCCの説明文中の「積載スペース（船腹）」という一般語で、株式会社スペースの記載はない。
- relatedCompanies: aozora-bank: 【重要な契約等】の永久劣後特約付ローンの貸付人の一つとして印字されるが、資金調達の関係であり、規則により結ばない。貸付人の銀行名は本文にも書いていない。
- relatedCompanies: arata: 一致はIFRS初度適用の注記中の「あらたな要求事項」という一般語で、株式会社あらたの記載はない。
- relatedCompanies: core（ambiguous）: 一致は「中古自動車輸出をコアとして」という一般語で、株式会社コアの記載はない。
- relatedCompanies: corona: 一致は「新型コロナウイルス感染症」の一部で、株式会社コロナの記載はない。
- relatedCompanies: cover: 一致は財務制限条項の「デッド・サービス・カバー・レシオ」という一般語で、カバー株式会社の記載はない。
- relatedCompanies: hikari-tsushin: 【大株主の状況】（2026年3月31日現在）にHIKARI TSUSHIN INVESTMENTS OKINAWA株式会社（2.03％）と光通信KK投資事業有限責任組合（1.66％）が載るが、いずれも投資目的の保有で、取引・提携・資本業務関係の記載はなく、純投資のため結ばない。
- relatedCompanies: hub（ambiguous）: 一致は「ハブ物流方式」という一般語で、株式会社ハブの記載はない。
- relatedCompanies: nissin: listing がコードリストになく、一致も新株予約権の文中の断片で、株式会社日新の記載はない。
- relatedCompanies: step: 一致は劣後ローンの条件である「ステップアップ」という一般語で、株式会社ステップの記載はない。
- relatedCompanies: systems-engineering-consultants: 一致は断片のみで、株式会社セックの記載はない。
- relatedCompanies: 候補外の記録: 【大株主の状況】の上位は創業者の山中信哉（18.01％）をはじめとする個人で、事業会社の大株主はいない（大和証券株式会社0.93％は証券会社）。【関係会社の状況】の連結子会社62社・持分法適用関連会社6社はすべて未上場で、候補には含まれていない。
- terms: 登録候補（助言のみ）: NVOCC（非船舶運航事業。船舶を所有せず船腹を借りて貨物を輸送する事業形態で、物流事業の中核）、船積前検査（中古自動車の輸出時に行う安全性検査と検疫。検査事業の中核）、クリーン・カー・スタンダード（CCS。ニュージーランドの環境政策で、中古自動車需要に影響した制度）、バリューチェーン（仕入から販売・金融までを一貫して担う同社の事業構造を表す語）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
