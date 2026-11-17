# unbanked — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ｕｎｂａｎｋｅｄ株式会社 |
| 証券コード | 8746 |
| docID（データを取り出した文書） | `S100YNMZ` |
| 原本 docID | `S100YNMZ` |
| 提出日（原本） | 2026-06-30 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YNMZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ｕｎｂａｎｋｅｄ株式会社 / 8746 / docID S100YNMZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 6 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 6 | スキーマ・整合性ルールともOK |
| registration | running | 3 |  |

## 数値の照合（verify-financials.mjs）

```
unbanked: 10 件の数値を有報XBRLと照合
有報: ｕｎｂａｎｋｅｄ株式会社 有価証券報告書－第54期(2025/04/01－2026/03/31) (docID S100YNMZ)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":5152889000,"latestFiling":5152000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":4637686000,"latestFiling":4637000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":5310427000,"latestFiling":5310000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":9489720000,"latestFiling":9489000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":-1707363000,"latestFiling":-1707000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":-369812000,"latestFiling":-369000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":390930000,"latestFiling":390000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":236746000,"latestFiling":236000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":-522172000,"latestFiling":-522000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":-523089000,"latestFiling":-523000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":45468000,"latestFiling":45000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":308265000,"latestFiling":308000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":10032989000,"latestFiling":10032000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":9440260000,"latestFiling":9440000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":5826166000,"latestFiling":5826000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":7392245000,"latestFiling":7392000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":4973714000,"latestFiling":4973000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":4654357000,"latestFiling":4654000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":5569522000,"latestFiling":5569000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":5752092000,"latestFiling":5752000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第53期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第52期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
unbanked: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「unbanked株式会社」が EDINET の提出者名「ｕｎｂａｎｋｅｄ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 継続企業の前提に関する重要事象等と特別注意銘柄の指定、株式併合、決算日後の主要株主の異動等は needsReview に記載した。
- businessModel: 第52期有価証券報告書の訂正報告書（S100VWB1、2025年6月6日提出）は連結財務諸表注記事項のセグメント情報のみの訂正であり、第53期有価証券報告書の訂正報告書（S100WEZ8、2025年7月28日提出）は事業等のリスクの紛議及び訴訟の記載のみの訂正であることを、両訂正報告書の訂正事項で確認した。いずれも経営指標等の数値に影響しないため warnings にとどめ、本有価証券報告書（S100YNMZ）自体に訂正はない（訂正の有無、DEI＝false、amendments status は none）。
- businessModel: 前期有報との修正再表示チェックの差異はすべて百万円未満の端数であり、経営指標等の注４のとおり第54期より表示単位を千円単位から百万円単位に変更し第50期から第53期も百万円単位で表示し直したことに伴うものである。数値は今期有報の印字どおりとし、表示単位の変更は表示事項のため financialNotes には入れなかった。注１（潜在株式調整後1株当たり当期純利益の非開示）と注２（株価収益率の非開示）も表示事項のため同様に扱った。
- businessModel: 当連結会計年度の減損損失883百万円、関係会社株式評価損、貸倒引当金の増加などの損益の内訳と金額は、本文の財務数値は売上高と親会社株主に帰属する当期純利益だけとする規則のため書かなかった。
- businessModel: 第三者割当による新株式及び第3回新株予約権の募集（2026年3月26日取締役会決議、2026年4月14日払込完了）は資本政策のため本文には書かず、ここに記録する。新株予約権の一部行使に伴う主要株主の異動は needsReview に記載した。
- businessModel: 経営方針に印字された客観的な指標等（収益構造の改革による黒字化の目標）は損益の目標であるため strategy には書かず、ここに記録する。
- businessModel: 当社は2020年7月にも特設注意市場銘柄（現・特別注意銘柄）に指定され、2022年4月に指定が解除された経緯が、今回の指定通知の理由の詳細に印字されている。今回の指定自体は needsReview に記載した。
- businessModel: 主要な顧客の日本マテリアル株式会社と当連結会計年度末の筆頭株主MaaaaRuホールディングス株式会社（16.49％）は掲載済み企業の候補にないため relatedCompanies には結ばず、warnings に記録した。詳細は relatedCompanies の warnings を参照。
- businessStructure: 報告セグメントは「金地金」及び「ノンバンク」の2つであり、事業の内容に印字された業務の区分で子事業を構成した。2026年3月期の外部顧客への売上高は金地金事業8,043百万円、ノンバンク事業1,351百万円である。
- businessStructure: suppliers はこの作業ツリーのスキーマに無いため書かなかった。金地金事業について「販売するための金地金をグループ外から調達し、保管している」と印字されているが、個別の調達先の名称は印字されていない。
- businessStructure: グループ構成は、当社及び連結子会社28社である。主な連結子会社は、クラウドバンク株式会社（議決権の54.6％を所有。2025年8月8日の簡易株式交付により子会社化）、クラウドバンク・キャピタル株式会社（直接所有50.0％・間接所有50.0％）、日本クラウド証券株式会社、クラウドバンク・フィナンシャルサービス株式会社、クラウドバンク・インキュラボ株式会社ほか23社であり、いずれも当社の子会社であるため relatedCompanies には記載していない。
- businessStructure: 2025年10月31日に、MaaaaRuホールディングス株式会社から簡易株式交付により株式会社まーるの株式を取得し子会社化したことが、重要な後発事象の記載から読み取れる。同社は連結子会社28社に含まれる。資本提携の解消に向けた協議は needsReview に記載した。
- history: この工程は「events」を書けません（担当は history）— 無視しました
- history: 1979年東京第一商品株式会社の吸収合併、2000年店頭FX取引開始と外国為替証拠金取引事業部門の設立、2002年あしたば商品株式会社の吸収合併、2005年金融先物取引業者の登録、2007年金融商品取引業者としての登録、2010年大阪証券取引所JASDAQ市場への移行、2013年東京証券取引所JASDAQ（スタンダード）への移行、2016年FX事業の廃止と取引所為替証拠金取引の登録抹消は、証券・商品先物事業の整理や市場の統合に伴う節目であり、現在の2事業の形を決める転機ではないため落とした。
- history: 2020年OKプレミア証券株式会社の完全子会社化、2021年同社の第一プレミア証券株式会社への商号変更、2023年Personal Capital株式会社の完全子会社化（2025年に全株式を譲渡）は、後の全株式譲渡で終わった子会社の取得・商号変更であり、現在の事業構成に残らないため落とした。
- history: 2024年の本店移転（虎ノ門から恵比寿へ）は、事業の形を変える節目ではないため落とした。
- history: 1972年の設立行に印字された金額（資本金）は、規則により本文とsignificanceのいずれにも書かなかった。
- industry: 金地金事業（外部顧客への売上高の85.6％）は金地金バーの販売・買取という現物のディーリングであり、閉じた分類に貴金属・コモディティ取引の区分がない。貸金業のノンバンク事業とあわせ金融事業として finance を暫定の主たる業界とし、taxonomyGaps に記録した。
- relatedCompanies: 結べる相手はなかった。特定投資株式及びみなし保有株式は前事業年度・当事業年度とも「該当事項はありません」と印字されており、株式の保有状況からは結べる相手がいない。
- relatedCompanies: MaaaaRuホールディングス株式会社: 当連結会計年度末現在の筆頭株主（発行済株式（自己株式を除く。）の総数に対する割合16.49％）で、2025年10月に株式会社まーるの株式交付を通じて資本提携関係となった相手だが、掲載済み企業の候補にない（非上場）ため結ばなかった。決算日後の資本提携の解消に向けた協議開始と主要株主の異動は businessModel の needsReview に記載した。
- relatedCompanies: Akatsuki Capital Works株式会社: 大株主の状況に8.41％の株主として印字されているが、候補にないため結ばなかった。
- relatedCompanies: 日本マテリアル株式会社: 金地金セグメントの主要な顧客で、2026年3月期の販売額は4,865百万円（売上高の51.8％）と印字されているが、候補にないため結ばなかった。顧客としての事実は businessModel の本文と perspectives に記載した。
- relatedCompanies: AU投資事業組合: 決算日後の2026年5月26日に新株予約権の一部行使により筆頭株主となり、その他の関係会社に該当することとなったが、決算日現在の関係ではなく、候補でもないため結ばなかった。経緯は businessModel の needsReview に記載した。
- relatedCompanies: EMURGO FINTECH INC.: 海外子会社の発行する暗号資産「Kinka（XNK）」の販路拡大を目的にパートナーシップ契約を締結したと印字されているが、海外の非上場企業で候補にないため結ばなかった。
- relatedCompanies: 楽天証券株式会社・野村證券株式会社・株式会社SBI証券: 大株主の状況に株主として印字されているが、いずれも顧客等の株式を預かる証券会社の立場で現れているもので、当社との取引・提携関係の印字はなく、候補でもないため結ばなかった。
- relatedCompanies: 当社の連結子会社28社（クラウドバンク株式会社、クラウドバンク・キャピタル株式会社、日本クラウド証券株式会社、クラウドバンク・フィナンシャルサービス株式会社、クラウドバンク・インキュラボ株式会社ほか）は当社自身の子会社であるため、規則により結ばなかった。構成は businessStructure の warnings に記録した。
- relatedCompanies: en / career / base-4481 / vision / port / land / vector: 「エンゲージメント」「キャリアアップ」「営業利益ベース」「ビジョン共有」「サポート」「ブランド」「ベクトル」など一般語・部分一致のため結ばなかった。nissin: 「日新」の部分一致（新株予約権の記載中の一致）で曖昧なため結ばなかった。
- terms: 助言: 用語「Kinka（XNK）」は、金地金を裏付けとして海外子会社のKinka（BVI）,Ltd.が発行する暗号資産を指す。金の価格と連動する設計で、海外の暗号資産取引所に上場している。
- terms: 助言: 用語「特別注意銘柄」は、東京証券取引所が、内部管理体制等について改善の必要性が高いと認める上場会社について指定する銘柄を指す。指定後は内部管理体制等の審査を受け、問題があると認められる場合には上場廃止となる。
- terms: 助言: 用語「簡易株式交付」は、株式交付のうち、交付する株式の数などが一定の要件を満たす場合に株主総会の特別決議を省略できる簡易な手続を指す。当社はこの方法でクラウドバンク株式会社と株式会社まーるを子会社化した。

## 要確認（status に反映）

- businessModel: 事業等のリスク及び連結財務諸表の注記に、継続企業の前提に関する重要事象等として、2025年12月に金地金取引における売上債権13.4億円が未回収となり、巨額の貸倒引当金を計上する事態に陥ったことなどから、多額の営業損失、経常損失及び親会社株主に帰属する当期純損失を計上し、営業活動によるキャッシュ・フローも重要なマイナスの値となった旨が記載されています。また、対応策は実施途上ないし計画途上であり、現時点では継続企業の前提に関する重要な不確実性が認められる旨も記載されています。本登録は2026年3月期の構造で登録しています。
- businessModel: 決算日後の2026年5月26日、当社株式は株式会社東京証券取引所から特別注意銘柄に指定されています。金地金取引における売上債権の未回収を発生させた事態が企業行動規範の遵守すべき事項（業務の適正を確保するために必要な体制整備）の規定に違反し、内部管理体制等について改善の必要性が高いと認められたためであり、指定から原則1年後の内部管理体制等の審査において問題があると認められる場合には、原則として上場廃止となる旨が記載されています。本登録は2026年3月期の構造で登録しています。
- businessModel: 2024年10月1日付で普通株式3株につき1株の割合で株式併合を行ったと経営指標等の注記に印字されています。本登録は株式併合後の株式数に基づく指標で登録しています。
- businessModel: 決算日後の2026年5月26日に、AU投資事業組合が第3回新株予約権の一部を行使した結果、同組合が主要株主である筆頭株主に該当することとなり、議決権の所有割合が20％を超えたため、その他の関係会社にも該当することとなりました。本登録は2026年3月31日現在の構造で登録しています。
- businessModel: 決算日後の2026年5月25日に、MaaaaRuホールディングス株式会社との資本提携の解消に向けた協議を開始することが決定されました。協議には同社が株式会社まーるの株式の全部を買い戻すことが含まれており、手続きの一環として、同社が保有する当社株式の全部について当社代表取締役の安達哲也個人との間で貸株契約が締結され、議決権が同個人に帰属することとなったため、同社は当社の主要株主に該当しないこととなりました。本登録は2026年3月31日現在の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] unbankedの主たる業界（金地金事業） → 提案: 金地金・貴金属取引（コモディティ）。主事業の金地金事業は、金地金バーの販売・買取を行う事業であり、2026年3月期の外部顧客への売上高は8,043百万円と全体の85.6％を占めます。閉じた分類の19種に貴金属・コモディティ取引を表す区分がなく、貸金業を主業務とするノンバンク事業とあわせた金融事業として、最も近い finance を暫定としました。
