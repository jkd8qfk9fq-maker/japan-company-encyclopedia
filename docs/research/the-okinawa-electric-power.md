# 沖縄電力 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 沖縄電力株式会社 |
| 証券コード | 9511 |
| docID（データを取り出した文書） | `S100YGEA` |
| 原本 docID | `S100YGEA` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGEA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 沖縄電力株式会社 / 9511 / docID S100YGEA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-okinawa-electric-power: 10 件の数値を有報XBRLと照合
有報: 沖縄電力株式会社 有価証券報告書－第54期(2025/04/01－2026/03/31) (docID S100YGEA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
the-okinawa-electric-power: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や他社購入電力料の減少で費用を抑え、利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意「財務諸表の組替えの記載がある」については、【主要な経営指標等の推移】の注記で企業会計基準第27号（法人税等）の遡及適用を確認したため financialNotes に記録した。前期有報との修正再表示チェックは全行一致だった。
- businessModel: 従業員数は第51期（2023年3月期）から、嘱託および定年退職後の再雇用者（シニア社員）を加えた数え方に変わっている（【主要な経営指標等の推移】の注記）。数値そのものは機械が扱うため本文には書かず、ここに記録する。
- businessModel: 「おきでんグループ中期経営計画2025」の財務目標（経常利益の金額目標・ROE・自己資本比率）は、利益（売上高・当期純利益以外）と投資の語に関する規則に従い、perspectives には書かなかった。
- businessModel: 提出後の文書のパークや鮮度保留は発生しておらず、ack は不要だった。
- businessStructure: 事業の並び順は報告セグメントの外部顧客への売上高（2026年3月期）の大きい順とし、報告セグメントに含まれない「その他」（13,794百万円）は、建設業（5,041百万円）より大きいが規則どおり最後に置いた。
- businessStructure: listings の market は表紙の印字「東京証券取引所（プライム市場）」から東証のみ「プライム」とし、福岡証券取引所は市場区分の印字がないため market を書かなかった。
- businessStructure: Wikipedia の抜粋は有報の記載と重なる内容のみで、エントリーには使わなかった。
- history: 沿革は年月と事象が同じ行に印字された表から、年単位で採用した。
- history: 落とした行：1972年の増資完了、1987年の資本金の減少、1995年・1999年・2005年・2007年・2015年・2016年・2017年・2018年・2020年の株式分割（資本政策の細目）。
- history: 落とした行：石川発電所1・2号機、牧港火力発電所9号機、具志川火力発電所2号機、金武火力発電所2号機、吉の浦火力発電所2号機、牧港ガスエンジン発電所の営業運転開始（各発電所の初号機のみ採用した）。
- history: 落とした行：沖電企業、沖縄プラント工業、沖電開発、沖電グローバルシステムズ、株式会社沖縄エネテック、沖縄新エネ開発、OTNet、FRT、株式会社プログレッシブエナジー、株式会社リライアンスエナジー沖縄などの子会社・関連会社の設立と、沖縄電機工業の子会社化、1991年の株式会社沖電工の合併（グループ会社の設立・再編の細目）。
- history: 1972年の設立時の資本金の金額は、文章の規則に従い書かなかった。
- industry: 主たる業界は、外部顧客への売上高の9割以上を占める電気事業から energy（エネルギー）とした。建設業は報告セグメントだが外部顧客への売上高が連結の2％程度で大半がグループ内向けであり、情報通信などは「その他」に含まれるため、業界を足さなかった。
- relatedCompanies: okinawa-cellular-telephone: 特定投資株式の保有目的に、相手固有の「離島地域持続可能性推進に関するパートナーシップ協定」の締結が印字されており、提携の根拠があるため business-partner として結んだ。
- relatedCompanies: okinawa-financial-group: 金融グループだが、保有目的の理由は資金調達ではなく、相手固有の包括連携協定・パートナーシップ協定の締結が印字されているため business-partner として結んだ。
- relatedCompanies: vision: 一致は「おきでんグループ経営ビジョン」という自社のビジョンの名称で、会社としての記載はないため結ばなかった。
- relatedCompanies: base-4481: 一致は「P/Lベース」「キャッシュベース」などの一般語で、会社としての記載はないため結ばなかった。
- relatedCompanies: electric-power-development: 一致は「電源開発促進税」という税目の名称で、電源開発株式会社との取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: en: 一致は「ガスエンジン発電所」の語で、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: zero: 一致は「沖縄電力ゼロエミッションへの取り組み」という自社の取り組みの名称で、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: land: 一致は「ブランドイメージ」の語で、会社としての記載はないため結ばなかった。
- relatedCompanies: seki: 一致は「エネルギーセキュリティ」「石炭」などの語で、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: step: 一致は社債の金利の「ステップアップ」の語で、会社としての記載はないため結ばなかった。
- relatedCompanies: freee: 一致は「フリー・キャッシュ・フロー」の語で、会社としての記載はないため結ばなかった。
- relatedCompanies: grid: 一致は「マイクログリッド」「地域グリッド」という技術の語で、会社としての記載はないため結ばなかった。
- relatedCompanies: mizuho-financial-group: 特定投資株式として50,000株を保有する金融グループだが、保有目的は「当社事業運営に寄与」と配当に関する定型的な記載のみで、具体的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: san-a: 特定投資株式として172,800株を保有するが、保有目的は地域経済の振興などの定型的な記載のみで、同社との具体的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: slogan: 一致は「コーポレートスローガン」の語で、会社としての記載はないため結ばなかった。
- relatedCompanies: bank-of-the-ryukyus: 脱炭素社会の実現に向けた包括連携協定の記載はあるが、当事業年度末の保有株式数は「－」で当期に全て売却されており、現在の資本関係がないため結ばなかった。
- relatedCompanies: core: 一致は「総合エネルギー事業をコアに」の語で、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: port: 一致は「生活・ビジネスサポート事業」の語で、会社としての記載はないため結ばなかった。
- relatedCompanies: tein: 一致は「ジャパンエンターテインメント」という別の会社名の一部で、会社としての記載はないため結ばなかった。
- relatedCompanies: trust: コードリストにない相手で、一致は日本マスタートラスト信託銀行（信託口）の受託者の名称のため結ばなかった。
- relatedCompanies: 【大株主の状況】の上位は信託銀行・社員持株会・沖縄県・保険会社・銀行であり、関係会社の4区分に当たらず主要株主として結ぶ事業会社はなかった。
- relatedCompanies: 連結子会社18社と持分法適用関連会社OTNet株式会社はいずれも未上場で、候補には含まれていない。
- terms: 助言: 「一般送配電事業」は用語集に未登録です。送配電網を運営して他の電気事業者に送電サービスを提供する事業で、電力会社の事業の中心用語のため、登録候補になります。
- terms: 助言: 「燃料費調整制度」も未登録です。燃料価格の変動を電気料金に反映させる仕組みで、電力会社の売上高の変動要因として頻出するため、登録候補になります。
- terms: 助言: 「特定投資株式」も未登録です。政策保有株式の開示区分を指す用語で、関連企業の判断材料になるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
