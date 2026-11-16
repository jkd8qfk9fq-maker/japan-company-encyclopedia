# ＶＲＡＩＮ　Ｓｏｌｕｔｉｏｎ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＶＲＡＩＮ　Ｓｏｌｕｔｉｏｎ |
| 証券コード | 135A |
| docID（データを取り出した文書） | `S100Y2CG` |
| 原本 docID | `S100Y2CG` |
| 提出日（原本） | 2026-05-27 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y2CG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＶＲＡＩＮ　Ｓｏｌｕｔｉｏｎ / 135A / docID S100Y2CG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
vrain-solution: 10 件の数値を有報XBRLと照合
有報: 株式会社ＶＲＡＩＮ　Ｓｏｌｕｔｉｏｎ 有価証券報告書－第6期(2025/03/01－2026/02/28) (docID S100Y2CG)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-02-28","previousFiling":344466000,"latestFiling":344000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-02-28","previousFiling":617397000,"latestFiling":617000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-02-29","previousFiling":1411008000,"latestFiling":1411000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-02-28","previousFiling":2144641000,"latestFiling":2144000000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2022-02-28","previousFiling":11193000,"latestFiling":11000000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2023-02-28","previousFiling":49930000,"latestFiling":49000000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2024-02-29","previousFiling":330161000,"latestFiling":330000000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2025-02-28","previousFiling":425072000,"latestFiling":425000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-02-28","previousFiling":14553000,"latestFiling":14000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-02-28","previousFiling":63399000,"latestFiling":63000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-02-29","previousFiling":495677000,"latestFiling":495000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-02-28","previousFiling":595437000,"latestFiling":595000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-02-28","previousFiling":242285000,"latestFiling":242000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-02-28","previousFiling":341115000,"latestFiling":341000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-02-29","previousFiling":1449901000,"latestFiling":1449000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-02-28","previousFiling":1873506000,"latestFiling":1873000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-02-28","previousFiling":34933000,"latestFiling":34000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-02-28","previousFiling":89211000,"latestFiling":89000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-02-29","previousFiling":997040000,"latestFiling":997000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-02-28","previousFiling":1422113000,"latestFiling":1422000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
vrain-solution: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社VRAIN　Solution」が EDINET の提出者名「株式会社ＶＲＡＩＮ　Ｓｏｌｕｔｉｏｎ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで前期有報との差異が示された各指標の差異は、いずれも百万円未満の端数です。主要な経営指標等の注記13のとおり、第６期より表示単位が千円単位から百万円単位に変更され、過年度分も百万円単位で表示し直されたことによるもので、指標の内容自体の変更ではありません。その旨を financialNotes（2026年2月期）に記録しました。
- businessModel: 受注高4,202百万円及び受注残高1,269百万円（2026年２月期）は、本文の数値に含めず、この警告にのみ記録します。
- businessModel: AIシステムの平均販売単価18百万円及びDXコンサルティングの平均販売単価１百万円（2026年２月期）は本文の数値に含めていません。
- businessModel: 2027年度から2029年度の中期経営方針が定められていますが、数値目標は本文に含めていません。
- businessModel: 当社は単一セグメント・非連結で、関係会社はありません。仕入先の個別名は【事業の内容】に印字されていないため、suppliers は記載していません（このツリーのスキーマにも suppliers はありません）。原材料はカメラ、パソコン、Ｘ線発生装置等です。
- businessStructure: 当社は連結財務諸表を作成しておらず、2026年２月28日現在、関係会社はありません（【関係会社の状況】は該当事項なし）。
- businessStructure: AIシステム及びDXコンサルティングの金額は、セグメント関連情報の「製品及びサービスごとの情報」の外部顧客への売上高（2026年２月期）の印字どおりで、MD&Aの販売実績とも一致しています。両ソリューションは完全に分離されるものではないため、経営管理上はセグメントを分離せず単一セグメントとされています。
- businessStructure: 前期（2025年２月期）の主要な顧客は東海漬物株式会社（売上高248百万円）でしたが、2026年２月期は売上高の10％以上を占める顧客がないため、主要な顧客ごとの情報の記載は省略されています。
- history: 沿革の設立行に印字された資本金の金額は、沿革に資本金を書かない規則に従い、本文には記載していません。
- history: 沿革表は年月と事象が対応して印字されており、そのまま行順で読み取りました。
- industry: 主たる事業は、製造業向けのAIソフトウェア（外観検査システム）の開発・販売とITコンサルティングであり、閉じた分類の it（IT・ソフトウェア）が直接当てはまるため、it を唯一の主たる業界としました。撮像機器等のハードウェアはAIシステムと組み合わせて提供されるもので、独立した金額の開示がないため electronics は付けていません。
- relatedCompanies: 候補 base-4481（ベース株式会社）は「ルールベース」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 career（株式会社キャリア）は「キャリアパス」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 land（株式会社ランド）は「晴海アイランド」という地名の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 path（パス株式会社）は「キャリアパス」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 port（ポート株式会社）は「サポート」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 en（エン株式会社）は「エンジニア」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 freee（フリー株式会社）は「フリーレント」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 rent（株式会社レント）は「フリーレント」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 corona（株式会社コロナ）は「新型コロナウイルス」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 kohsoku（株式会社高速）は「高速化」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 seki（株式会社セキ）は「セキュリティ」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 the-lead（株式会社リード）は「リード獲得」という語の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 zero（株式会社ゼロ）は「ゼロとする」という表現の一部が一致しただけであり、当社との関係の記載はありません。
- relatedCompanies: 候補 okaya-and-co（岡谷鋼機株式会社）は、【主な資産及び負債の内容】の売掛金及び契約資産の相手先別内訳に名称があるだけであり、取引関係の内容を述べた記載がないため、リンクしていません。
- relatedCompanies: 候補 ariake-japan（アリアケジャパン株式会社）は、同じく売掛金及び契約資産の相手先別内訳に名称があるだけであり、取引関係の内容を述べた記載がないため、リンクしていません。
- relatedCompanies: 候補 yukiguni-factory（ユキグニファクトリー株式会社）は、同じく売掛金及び契約資産の相手先別内訳に名称があるだけであり、取引関係の内容を述べた記載がないため、リンクしていません。
- relatedCompanies: 候補 shinwa-7607（株式会社進和）は、同じく売掛金及び契約資産の相手先別内訳に名称があるだけであり、取引関係の内容を述べた記載がないため、リンクしていません。
- relatedCompanies: 候補 jafco-group（ジャフコグループ株式会社）について、大株主の状況に印字されているのはジャフコＳＶ６投資事業有限責任組合（2026年２月28日現在、所有株式数99,500株、割合0.97％）であり、投資事業有限責任組合による保有であって事業上の取引・提携の記載がないため、リンクしていません。
- relatedCompanies: 候補 trust（トラスト）は、コードリストにない相手であり、大株主の状況に印字されているのは日本カストディ銀行（信託口）及び日本マスタートラスト信託銀行株式会社（信託口）の信託口であるため、リンクしていません。
- relatedCompanies: 東海漬物株式会社は前期（2025年２月期）の主要な顧客（売上高248百万円）としてセグメント関連情報に印字されていますが、非上場であり関連候補に含まれないためリンクしていません。2026年２月期は売上高の10％以上を占める顧客はありません。
- relatedCompanies: サントリー株式会社は売掛金及び契約資産の相手先別内訳に名称がありますが、上場しているサントリー食品インターナショナル株式会社とは別の法人であり、関連候補にも含まれないためリンクしていません。
- terms: 助言のみの工程です。用語候補：「AI外観検査」（AI技術を用いて、製品の外観の良品・不良品の判定を自動で行う検査）、「IoT」（Internet of Things。あらゆるモノをインターネットに接続する技術）、「DX」（デジタルトランスフォーメーション。企業がデジタル技術によって業務やビジネスを変革すること）、「ISMS」（情報セキュリティマネジメントシステム）。いずれも本文で使った語です。

## 要確認（status に反映）

- businessModel: 当社は2023年12月８日付で普通株式１株につき1,000株の割合で株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（分割は第２期の期首に行われたものとして指標が算定されています）。
- businessModel: MD&AのKPI推移表では2026年２月期の継続顧客売上高は1,476百万円と印字されていますが、同じMD&Aの経営成績等の分析本文では1,483百万円と印字されており、両者の数値が一致していません。本登録では、どちらの数値も本文には使用していません。
- businessStructure: 当社は2023年12月８日付で普通株式１株につき1,000株の割合で株式分割を実施しており、主要な経営指標等の注記にその旨が記載されています（分割は第２期の期首に行われたものとして指標が算定されています）。
- businessStructure: MD&AのKPI推移表では2026年２月期の継続顧客売上高は1,476百万円と印字されていますが、同じMD&Aの経営成績等の分析本文では1,483百万円と印字されており、両者の数値が一致していません。本登録では、どちらの数値も本文には使用していません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
