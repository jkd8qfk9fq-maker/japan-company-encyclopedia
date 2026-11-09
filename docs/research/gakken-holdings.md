# 学研ホールディングス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社学研ホールディングス |
| 証券コード | 9470 |
| docID（データを取り出した文書） | `S100XKOH` |
| 原本 docID | `S100XBI1` |
| 提出日（原本） | 2025-12-18 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | S100XKOH／有効文書 S100XKOH（2026-11-07 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XKOH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社学研ホールディングス / 9470 / docID S100XBI1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 30 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gakken-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社学研ホールディングス 訂正有価証券報告書－第80期(2024/10/01－2025/09/30) (docID S100XKOH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第80期(2024/10/01－2025/09/30)、docID S100XKOH）を有効文書としてこのパックを作った。原本は docID S100XBI1。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはAuditsTextBlock・OverviewOfCorporateGovernanceTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 前期の窓に 訂正有価証券報告書－第79期(2023/10/01－2024/09/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
gakken-holdings: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの警告（本文に財務諸表の組替え・遡及適用の記載がある）については、経営指標等の注記で確認できる基準変更は収益認識基準の第77期期首からの適用のみであり、これを financialNotes に記録した。前期有報との修正再表示チェックは全行一致している。
- businessModel: 訂正有価証券報告書（S100XKOH）は record-only の分類で、財務の数値も本文も原本（S100XBI1）と同一（差異は監査・ガバナンスのテキストブロックのみ）のため、needsReview には入れていない。出典は有効文書である訂正有報の値を使った。
- businessModel: 前期の窓にある訂正有価証券報告書－第79期については、当期有報との修正再表示チェックで全行一致しているため、needsReview には入れていない。
- businessModel: 中期経営計画の数値目標は売上高（2026年9月期2,050億円）のみを引用し、営業利益・当期純利益・EBITDAの目標やROE・DOEの目標は文章の規則により書いていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。
- businessModel: DTP Education Solutions JSCの連結化に伴う段階取得差益や、学研Link取得に伴う負ののれん発生益は、特別利益の性質のため本文には書いていない。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順（教育分野95,390百万円、医療福祉分野95,088百万円）とした。「その他」は有報が「報告セグメントに含まれない事業セグメント」と印字する区分のため、金額にかかわらず最後に置いた。
- businessStructure: 教育分野・医療福祉分野の子事業の金額は、MD&A（経営成績等の状況の概要）の「主な事業」別売上高の印字による。子事業の合計は教育分野で95,389百万円、医療福祉分野で95,087百万円となり、セグメント計とは各1百万円の差がある（有報の丸め）。本文では印字のセグメント計をそのまま引用した。
- businessStructure: セグメント利益は書いていない。
- history: 沿革の設立行に印字された資本金の金額は、文章の規則により書いていない。
- history: 子会社単位の設立・買収・吸収合併などの行は多数あるため、グループの形を変えた主な出来事に絞った。落とした行は主に、出版系子会社の再編（株式会社Gakkenへの統合過程）、教室・塾系子会社の買収・合併、ココファン系子会社の設立・合併などである。
- history: 2024年10月の株式会社Gakken SEEDへの商号変更・吸収分割は、子会社レベルの再編のため独立した沿革項目にしなかった。
- industry: 主たる業界は、売上の約半分を占める教育分野（教室・塾事業が最大の子事業で、出版コンテンツ事業を含む）に基づく。閉じた分類に教育の値がないため、出版を含む media を暫定の primary とした。
- industry: 医療福祉分野（売上の約48％）については、閉じた分類に医療・介護・福祉サービスの値がなく、該当する暫定値もないため業界を付けていない。
- relatedCompanies: ichishin-holdings（市進ホールディングス）: 【関係会社の状況】の区分が連結子会社のため subsidiary とした。
- relatedCompanies: odk-solutions / kawai-musical-instruments-manufacturing / shingakukai-holdings / johnan-academic-preparatory-institute: 特定投資株式の保有目的に「業務資本提携の関係にあり」と相手ごとに印字されているため business-partner とした。取引の向きは印字されていないため customer / supplier にはしていない。
- relatedCompanies: kawai-musical-instruments-manufacturing は【大株主の状況】にも載るが、業務資本提携の印字を優先し business-partner とし、大株主であることは説明に併記した。
- relatedCompanies: kosaido-holdings（広済堂ホールディングス）: 【大株主の状況】に載る事業会社で、関係会社の4区分に当たらないため major-shareholder とした。
- relatedCompanies: rarejob（レアジョブ）: 【関係会社の状況】で持分法適用関連会社（議決権20.0％、業務・資本提携）と印字されるが、候補の listing が「（コードリストにない）」で「上場」でないため結ばなかった。
- relatedCompanies: waseda-academy（早稲田アカデミー）: 特定投資株式に526,400株の保有があるが、保有目的は「取引関係の維持・強化を目的」とする全銘柄共通の定型句のみで、業務資本提携などの固有の記載がないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）: 特定投資株式の保有目的が資金調達等の金融取引（取引金融機関としての保有）のため結ばなかった。また【大株主の状況】の株式会社三井住友銀行は同社とは別の法人である。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱UFJフィナンシャル・グループ）: 当事業年度は保有がなく（前期までに売却）、結ばなかった。
- relatedCompanies: falco-holdings（ファルコホールディングス）: 当事業年度は保有がなく（前期までに売却）、結ばなかった。
- relatedCompanies: toc（テーオーシー）: みなし保有株式（退職給付信託）としてのみ現れ、取引・提携の記載がないため結ばなかった。
- relatedCompanies: care-service（ケアサービス）: 有報の「メディカル・ケア・サービス」「グランユニライフケアサービス」は連結子会社であり、株式会社ケアサービスとは別会社のため結ばなかった。
- relatedCompanies: port（ポート）: 「サポート」などの語句の断片一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: en（エン）: 「エンゲージメント」の断片一致で、曖昧なため結ばなかった。
- relatedCompanies: nissin（日新）: コードリストになく、一致箇所は新株予約権等の記載で同社への言及ではないため結ばなかった。
- relatedCompanies: seki（セキ）: 「セキュリティ」の断片一致で、曖昧なため結ばなかった。
- relatedCompanies: core（コア）: 一般語の断片一致のため結ばなかった。
- relatedCompanies: shift（SHIFT）: 中期経営計画の名称「SHIFT」との一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「連結ベース」の断片一致のため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 連結子会社「株式会社学研イノベーション」の名称一致で、別会社のため結ばなかった。
- relatedCompanies: rent（レント）: 「リカレント」の断片一致のため結ばなかった。
- relatedCompanies: space（スペース）: 「居住スペース」の断片一致のため結ばなかった。
- relatedCompanies: zero（ゼロ）: 「概ねゼロ」などの断片一致で、曖昧なため結ばなかった。
- relatedCompanies: daiwa（大和）: 新株予約権の割当先「大和証券」の名称の一部一致で、株式会社大和とは別会社のため結ばなかった。
- relatedCompanies: freee（フリー）: 「フリー・キャッシュ・フロー」の断片一致のため結ばなかった。
- relatedCompanies: hit（ヒット）: 「ヒット本」の断片一致のため結ばなかった。
- relatedCompanies: jtec（ジェイテック）: 連結子会社の旧名「ジェイテックスマネジメントセンター」の一部一致で、株式会社ジェイテックとは別会社のため結ばなかった。
- relatedCompanies: platz（プラッツ）: 連結子会社の前身「有限会社プラッツアーティスト」の一部一致で、株式会社プラッツとは別会社のため結ばなかった。
- relatedCompanies: ray（レイ）: 施設名「ココファンレイクヒルズ」の断片一致で、曖昧なため結ばなかった。
- relatedCompanies: trust（トラスト）: 【大株主の状況】の日本マスタートラスト信託銀行株式会社（信託口）の名称一致で、信託口（カストディ）であり株式会社トラストとは別で、コードリストにもないため結ばなかった。
- relatedCompanies: 候補外の記録: DTP Education Solutions JSC は連結子会社（議決権45.2％、その他区分）だが海外の非上場会社のため候補にない。Quang Ich Technology Group JSC は持分法適用関連会社だが候補にない。株式会社FRONTEO・株式会社文教堂グループホールディングスは特定投資株式にあるが、保有目的が定型句のみのため候補外として記録する。
- terms: 助言: 「サービス付き高齢者向け住宅」は、高齢者住宅事業の中核をなす施設形態で、事業の説明や設備の状況に繰り返し現れるため、用語としての登録を勧める。
- terms: 助言: 「認知症グループホーム」は、認知症グループホーム事業の中核をなす施設形態で、事業の説明に繰り返し現れるため、用語としての登録を勧める。
- terms: 助言: 「持分法適用関連会社」は関係会社の説明に現れる会計上の区分で、一般の読者には分かりにくいため、用語としての登録を勧める。

## 要確認（status に反映）

- businessModel: 監査等委員会設置会社への移行が、【経営方針、経営環境及び対処すべき課題等】で「ガバナンスの強化」の施策として「予定」と印字されている（移行時期は印字されていない）。提出時点では未実施の予定事項のため、本文では移行済みとは書いていない。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 学研ホールディングスの主たる業界（教育分野） → 提案: education。教室・塾事業を最大の事業とし出版も含む教育分野が売上の約半分を占めるが、閉じた分類に教育・学習支援の値がないため、出版を含む media を暫定値とした。
- [industry] 学研ホールディングスの医療福祉分野 → 提案: healthcare。サービス付き高齢者向け住宅・認知症グループホーム・保育施設の運営が売上の約48％を占めるが、閉じた分類に医療・介護・福祉サービスの値がない。
