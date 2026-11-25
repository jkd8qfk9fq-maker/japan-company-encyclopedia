# CYBERDYNE — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＣＹＢＥＲＤＹＮＥ株式会社 |
| 証券コード | 7779 |
| docID（データを取り出した文書） | `S100YIAC` |
| 原本 docID | `S100YIAC` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIAC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | ＣＹＢＥＲＤＹＮＥ株式会社 / 7779 / docID S100YIAC |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 28 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cyberdyne: 10 件の数値を有報XBRLと照合
有報: ＣＹＢＥＲＤＹＮＥ株式会社 有価証券報告書－第22期(2025/04/01－2026/03/31) (docID S100YIAC)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
cyberdyne: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「CYBERDYNE株式会社」が EDINET の提出者名「ＣＹＢＥＲＤＹＮＥ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意（本文に非継続事業の記載）を確認した結果、非継続事業への言及は会計方針におけるIFRS第5号の定型文のみで、非継続事業の注記や金額の開示はなかったため、financialNotes には入れず、この警告に記録した。前期のドイツ子会社LeyLine社の売却は、経営成績の分析で売上収益の減少要因として述べられている。
- businessModel: 2021年3月4日に資本金26,768百万円を減少してその他資本剰余金に振り替えた資本政策事項は、warnings のみとした。
- businessModel: 前期有報との重複年度は全系列が一致しており、修正再表示はない。
- businessStructure: 単一セグメント（ロボット関連事業）のため事業は1つとし、【事業の内容】の製品及びサービスの区分（サイバニクス治療、介護・自立支援、予防・早期発見、作業支援）を children にした。各区分の金額は独立して開示されていないため、金額は書いていない。
- businessStructure: 地域別の外部顧客への売上収益（2026年3月期）は日本1,302百万円、米州1,483百万円、EMEA522百万円、APAC540百万円で、内訳の単純合計は連結の売上収益3,846百万円と1百万円異なる。印字の合計をそのまま採用し、本文には地域別の金額を書かなかった。
- businessStructure: 主要な顧客はマレーシアの従業員社会保障機構PERKESO（2026年3月期457百万円）とイタリアのCooperativa Sociale Coopselios SC（同153百万円）で、いずれも掲載企業ではないため関連企業には結んでいない。
- businessStructure: ロボットスーツの製品に関する特許の独占的実施許諾契約の相手先は国立大学法人筑波大学（2012年3月14日締結）で、上場企業ではないため関連企業には結ばず、事業の説明に事実だけを書いた。
- history: 沿革は【沿革】の表の印字どおりに年月と事象を対応づけた。2026年5月の新型モデルの製造販売開始は期末後の出来事だが、沿革に印字されているため、その旨を明記して収録した。
- industry: 主業界は machinery とした。単一セグメントのロボット関連事業が売上の全てを占め、EDINETコードリストの提出者業種も「精密機器」である。
- industry: 医療機器としての展開もあるが、閉じた分類に医療機器やロボットの区分がないため、金額が独立開示されていない事業に業界は足さなかった。taxonomyGaps に「ロボット」の新設を提案した。
- relatedCompanies: 大和ハウス工業のみを大株主として結んだ。その他の候補は次の理由で結ばなかった。
- relatedCompanies: heiwa（平和）: 本文の一致は「平和倫理委員会」の語で、株式会社平和への言及ではない。
- relatedCompanies: innovation（イノベーション）: 一致は「サイバニクス医療健康イノベーション」という自社事業の呼称で、株式会社イノベーションへの言及ではない。
- relatedCompanies: step（ステップ）: 一致は収益認識の会計方針にある「ステップ」の語で、株式会社ステップへの言及ではない。
- relatedCompanies: vision（ビジョン）: 一致は「事業のビジョン」などの一般語で、株式会社ビジョンへの言及ではない。
- relatedCompanies: port（ポート）: 一致は「テクノピアサポート社会」の語の一部で、ポート株式会社への言及ではない。
- relatedCompanies: saibo（サイボー）: 一致は「装着型サイボーグ」の語の一部で、サイボー株式会社への言及ではない。
- relatedCompanies: core（コア）: 一致は「コア技術」の語で、株式会社コアへの言及ではない（ambiguous）。
- relatedCompanies: king（キング）: 一致は川崎市の拠点名「キングスカイフロント」の一部で、株式会社キングへの言及ではない。
- relatedCompanies: ray（レイ）: 一致は「フレイル」などの語の一部で、株式会社レイへの言及ではない（ambiguous）。
- relatedCompanies: en（エン）: 一致は一般語の一部で、エン株式会社への言及ではない（ambiguous）。
- relatedCompanies: base-4481（ベース）: 一致は「イノベーションベース」という自社施設名の一部で、ベース株式会社への言及ではない。
- relatedCompanies: career（キャリア）: 一致は「キャリア」の一般語で、株式会社キャリアへの言及ではない。
- relatedCompanies: kringle-pharma（クリングルファーマ）: 特定投資株式として200,000株を保有し、保有目的は「サイバニクス産業の創出加速のため」と印字されているが、取引・提携・資本関係の具体的な記載が本文にないため結ばなかった。
- relatedCompanies: the-lead（リード）: 一致は「世界をリードする」の語で、株式会社リードへの言及ではない。
- relatedCompanies: aeon（イオン）: 一致は神経系の「イオン電流」の語で、イオン株式会社への言及ではない。
- relatedCompanies: care-service（ケアサービス）: 一致は「ロボケア事業・サービス」の語の一部で、株式会社ケアサービスへの言及ではない。
- relatedCompanies: como（コモ）: 一致は「ロコモスコア」の語の一部で、株式会社コモへの言及ではない（ambiguous）。
- relatedCompanies: hub（ハブ）: 一致は「ハブ拠点」の語で、株式会社ハブへの言及ではない（ambiguous）。
- relatedCompanies: kohsoku（高速）: 一致は「高速自律走行」の語で、株式会社高速への言及ではない（ambiguous）。
- relatedCompanies: land（ランド）: 一致はリスクの説明文中の一般語で、株式会社ランドへの言及ではない。
- relatedCompanies: nissin（日新）: 一致は日付等の記載の一部で、日新への言及ではない（ambiguous）。
- relatedCompanies: ricoh（リコー）: 一致は「リコール」の語の一部で、株式会社リコーへの言及ではない。
- relatedCompanies: shinpo（シンポ）: 一致は「シンポジウム」の語の一部で、株式会社シンポへの言及ではない。
- relatedCompanies: suzuki-6785（鈴木）: 一致は社外取締役の個人名で、株式会社鈴木への言及ではない（ambiguous）。
- relatedCompanies: tein（テイン）: 一致は「エンターテインメント分野」の語の一部で、株式会社テインへの言及ではない。
- relatedCompanies: will（ウィル）: 一致は「ウィルス性」の語の一部で、株式会社ウィルへの言及ではない。
- relatedCompanies: zero（ゼロ）: 一致は会計方針の「ゼロまで減額」の語で、株式会社ゼロへの言及ではない（ambiguous）。
- terms: 用語解説の候補として、装着型サイボーグ「HAL」、サイバニクス、サイバニクス治療、Neuro HALFIT、Cyvis（サイビス）を挙げる。いずれも【事業の内容】と【沿革】の用語解説に印字された当社固有の語である。

## 要確認（status に反映）

- businessModel: 普通株式に加えて、B種類株式77,700,000株（非上場）が発行されています。B種類株式は1単元が10株で1議決権となり、普通株式（1単元100株で1議決権）より議決権の密度が高くなっています。代表取締役社長の山海嘉之氏は、普通株式とB種類株式を合わせて80,738,000株（発行済株式（自己株式を除く。）の総数に対する割合38.24％）を保有し、2026年3月31日現在の議決権の割合は85.68％です。
- businessModel: 2026年6月1日付で、Pegasus Tech Ventures, Inc.と戦略的業務提携を行い、同社グループが無限責任組合員として運営するPEGASUS TECH VENTURES COMPANY XXXIII, L.P.（コーポレート・ベンチャー・キャピタル・ファンド）に有限責任組合員として加入する契約を締結しました。期末（2026年3月31日）の後に起きた事項のため、この登録は期末時点の構成で作成しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ロボット関連事業（装着型サイボーグHAL等の医療・福祉・作業支援ロボット） → 提案: ロボット。装着型ロボットや清掃・搬送ロボットの開発・製造・レンタルと、それを使ったサービスが売上の全てを占める会社ですが、閉じた分類にはロボットを表す区分がなく、機械に近い machinery を暫定としているため、ロボットの区分があると実態に合います。
