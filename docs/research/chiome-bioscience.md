# カイオム・バイオサイエンス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カイオム・バイオサイエンス |
| 証券コード | 4583 |
| docID（データを取り出した文書） | `S100XUJT` |
| 原本 docID | `S100XUJT` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUJT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カイオム・バイオサイエンス / 4583 / docID S100XUJT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
chiome-bioscience: 10 件の数値を有報XBRLと照合
有報: 株式会社カイオム・バイオサイエンス 有価証券報告書－第22期(2025/01/01－2025/12/31) (docID S100XUJT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
chiome-bioscience: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の増減率はMD&Aの印字（前期比76.0％）から減少率24.0％として記載した。金額は千円額を百万円に切り捨て（売上高593,290千円→593百万円、当期純損失982,779千円→982百万円、前期の当期純損失1,020,776千円→1,020百万円）。
- businessModel: MD&Aの印字する営業損失・経常損失などの金額と理由、セグメント利益、研究開発費の金額、キャッシュ・フローの金額は規則により本文に記載していない。
- businessModel: 経営方針の「目標とする経営指標」に含まれる投資指標（成功確率の一般的な水準など数値目標）は本文・perspectivesに記載していない。創薬支援事業の利益率目標も利益率であるため数値は記載していない。
- businessModel: 指標注記6（収益認識に関する会計基準を第19期の期首から適用）をfinancialNotesに記載した。注記1〜5（持分法投資利益の記載なし、潜在株式調整後の非表示、自己資本利益率・株価収益率の非表示、市場区分の変遷）は表示上の事項としてwarningsのみとした。
- businessModel: 重要な後発事象は新株予約権の行使による増資（資本政策の手続き）のみであり、表示上の事項としてwarningsのみとし、needsReviewには入れていない。
- businessModel: 継続企業の前提に関する事項は「該当事項はありません」と印字されている。
- businessModel: wikipedia.jsonは企業一覧の記事で当社の補足情報が得られないため使用していない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（創薬支援事業593,290千円、創薬事業は当期の外部顧客への売上高なし）。創薬事業は金額が印字されていない区分として最後に置き、売上高がない旨を明記した。
- businessStructure: 金額は千円額を百万円に切り捨てて記載した（創薬支援事業593,290千円→593百万円）。
- businessStructure: 創薬支援事業の子区分（サービス項目）と創薬事業の子区分（開発候補品）には金額が独立して開示されていないため、金額は記載していない。
- businessStructure: 設備（本社及び技術研究所＝東京都渋谷区、創薬研究所＝川崎市宮前区）は、設備表で創薬事業と創薬支援事業が連記される行のため、特定の事業には結びつけていない。
- businessStructure: IDDビジネスは2025年に立ち上げられ、その収益は創薬支援事業の売上高に含まれる旨が印字されているため、創薬支援事業の子区分とした。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。仕入・委託の相手方は関連企業にも該当しない範囲で本文に個別の仕入先の印字はない。
- history: 2005年の設立行に印字された資本金の金額は、規則により沿革に記載していない。
- history: 省いた行: 2005年７月の理研からの実施許諾権の取得、2009年10月の新宿区への本社移転、2015年10月の株式会社イーベックへの資本参画、2017年２月の株式会社Trans Chromosomicsへの出資（いずれも本社移転の経過または小規模な資本参画のため）。
- history: 沿革の年月は年だけを登録した（月は書かない規則）。
- industry: 主たる業界はpharmaceuticalsとした。抗体医薬品の研究開発（創薬事業）と抗体作製等の研究支援（創薬支援事業）のいずれも医薬品領域の事業であるためである。
- industry: 創薬支援事業は研究支援サービスだが、対象が抗体医薬の創薬研究に限られ、独立した金額開示もセグメント単位のため、it等の第2の業界は付けていない。
- relatedCompanies: ono-pharmaceutical: 重要な契約等に業務委受託契約が印字され、主要な顧客ごとの情報にも販売先として印字されているためcustomerとして結んだ。
- relatedCompanies: chugai-pharmaceutical: 重要な契約等に中外製薬株式会社との業務委受託契約が印字されているためcustomerとして結んだ。主要な顧客ごとの情報の印字は「中外製薬グループ」だが、契約の相手方は中外製薬株式会社そのものである。
- relatedCompanies: kyowa-kirin: 重要な契約等に業務委受託契約（自動更新付き）が印字されているためcustomerとして結んだ。
- relatedCompanies: alfresa-holdings: 主要な顧客ごとの情報に創薬支援事業の販売先として印字されているためcustomerとして結んだ。
- relatedCompanies: kidswell-bio: 助成事業の共同申請とバイオシミラーの共同開発が印字されているためbusiness-partnerとして結んだ。
- relatedCompanies: nano-holdings: 共同研究契約の締結が印字されているためbusiness-partnerとして結んだ。契約当時の社名NANO MRNAは候補の旧会社名と一致する。
- relatedCompanies: nitto-boseki: 創薬支援事業の新規顧客として印字されているためcustomerとして結んだ。
- relatedCompanies: asahi-kasei: 契約と販売の相手方は子会社の旭化成ファーマ株式会社であり、旭化成株式会社そのものについて述べる印字はないため結ばなかった（別人格の代替はしない）。
- relatedCompanies: japan-securities-finance: 大株主の状況に載る金融機関で、純投資のため結ばなかった。
- relatedCompanies: shin-nippon-biomedical-laboratories: 主な資産及び負債の内容で前渡金の相手先としてのみ印字され、取引・提携の内容を述べる印字がないため結ばなかった。
- relatedCompanies: the-lead: 「リード抗体」という語の部分一致のみのため結ばなかった。
- relatedCompanies: en: 「エンジニアリング」等の語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: lec: 「フレックスタイム」という語の部分一致のみのため結ばなかった。
- relatedCompanies: no-1: 経営ビジョンの「No.1ベンチャー」という語の一致のみのため結ばなかった。
- relatedCompanies: port: 「特許ポートフォリオ」という語の部分一致のみのため結ばなかった。
- relatedCompanies: alpha-4760 / alpha: 用語解説の「50音、アルファベット順」の見出しの一致のみのため結ばなかった。
- relatedCompanies: base-4481: 「特許情報データベース」という語の部分一致のみのため結ばなかった。
- relatedCompanies: step: 「最適化などのステップ」という語の部分一致のみのため結ばなかった。
- relatedCompanies: vision: 「経営ビジョン」という語の部分一致のみのため結ばなかった。
- relatedCompanies: nissin: コードリストにない相手で、新株予約権の文脈の部分一致のみのため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手（いずれもwarningsへの記録のみ）: PFKRのライセンス契約先かつ主要な顧客の旭化成ファーマ株式会社、重要な契約等に業務委受託契約が印字される武田薬品工業株式会社とCPR社、業務提携契約先の株式会社エスアールディ、業務協力基本契約先のAxcelead Drug Discovery Partners株式会社、バイオシミラーで協働するMycenax Biotech Inc.。
- relatedCompanies: 特定投資株式は該当事項なしのため、政策保有株式を根拠とするリンクはない。大株主の状況には事業会社の大株主は載っていない。関係会社の状況は該当事項なしで、子会社・関連会社はない。
- terms: 助言のみ。用語としては『アンメットニーズ』『ADLib®システム』『Tribody®』『DoppeLib™』『導出（ライセンスアウト）』『マイルストーン』『ロイヤルティ』『T cell engager』『抗体薬物複合体（ADC）』『バイオシミラー』『IDDビジネス』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
