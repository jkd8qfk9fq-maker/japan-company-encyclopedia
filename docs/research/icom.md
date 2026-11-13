# アイコム — research log

Registered: 2026-11-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アイコム株式会社 |
| 証券コード | 6820 |
| docID（データを取り出した文書） | `S100YP1U` |
| 原本 docID | `S100YGGJ` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YP1U／有効文書 S100YP1U（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YP1U.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 3 | アイコム株式会社 / 6820 / docID S100YGGJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
icom: 10 件の数値を有報XBRLと照合
有報: アイコム株式会社 訂正有価証券報告書－第62期(2025/04/01－2026/03/31) (docID S100YP1U)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第62期(2025/04/01－2026/03/31)、docID S100YP1U）を有効文書としてこのパックを作った。原本は docID S100YGGJ。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDisclosureOfSustainabilityRelatedFinancialInformationTextBlock・StrategyTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
icom: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YP1U、2026年7月6日提出）で、分類はrecord-onlyです。原本（docID S100YGGJ）と主要財務（5系列・従業員数）は同一で、異なるのはサステナビリティと戦略のテキストブロック（エントリーが引用しない節）だけであるため、needsReviewには入れていません。出典のtitle、URL、publishedAtは訂正有報の値に合わせました。
- businessModel: 金額は【経営指標等】と【セグメント情報等】に百万円単位で印字された表記で書きました。MD&Aに億単位で印字された同じ売上高を百万円に書き換えたものではありません。
- businessModel: 仕入の事実（部材の一部をPURECOM CO.,LTD.、ICOM ASIA CO.,LTD.と関連会社のポジション株式会社から仕入れること）はbusinessStructureの説明とwarningsに記録しました。businessModelにsuppliersキーは置いていません（この作業ツリーのスキーマにsuppliersキーが無いため）。
- businessModel: 「中期経営計画2030」の目標のうち売上高430億円だけをstrategyに書き、目標の他の項目は本文の財務数値の規則に従い書いていません。
- businessModel: 当期に計上された特許権侵害訴訟の和解に関する事項は、本文の財務数値の規則に従い金額では書いていません。和解が成立した事実そのものは経営成績の概要に印字されていますが、事業モデルの説明には含めていません。
- businessModel: 【関連情報】の地域区分の見直し（その他北米をその他米州への変更など、前期分の組替えを含む）は表示の変更のみであるため、financialNotesには記録せず本warningsに残しました。financialNotesに書くべき変則決算、決算期変更、会計基準の変更等の事実は確認できませんでした。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されています。
- businessModel: セグメントの外部顧客への売上高の合計（36,958百万円）と連結売上高（36,959百万円）の1百万円の差は、businessStructureのwarningsにも記録しました。印字の数値をそのまま使いました。
- businessStructure: 報告セグメントは販売体制を基礎とした地域別セグメント（日本、北米、ヨーロッパ、アジア・オセアニア）で、【セグメント情報等】の外部顧客への売上高の大きい順に並べました（日本21,177百万円、北米11,338百万円、ヨーロッパ2,788百万円、アジア・オセアニア1,655百万円）。
- businessStructure: セグメントの外部顧客への売上高の合計は36,958百万円で、印字された連結売上高36,959百万円と1百万円異なります。印字の数値をそのまま用いました。
- businessStructure: セグメント利益は本文に書いていません。北米セグメントが損失であることも金額では書いていません。
- businessStructure: 製造は当社と和歌山アイコム株式会社が行い、部材の一部はPURECOM CO.,LTD.、ICOM ASIA CO.,LTD.と関連会社のポジション株式会社から仕入れています。この仕入の事実は本warningsと事業の説明に記録し、businessModelにはsuppliersキーを置いていません（この作業ツリーのスキーマにsuppliersキーが無いため）。
- businessStructure: 【関連情報】の地域ごとの売上高（顧客の所在地が基礎）は報告セグメントとは区分が異なるため、事業の金額には用いていません。
- businessStructure: 有効文書は訂正有価証券報告書（docID S100YP1U、2026年7月6日提出）です。原本（docID S100YGGJ）と主要財務は同一で、訂正はrecord-onlyと分類されています。
- history: 1964年の設立の行に印字された金額は資本の金額であるため、本文には書いていません。
- history: 沿革のすべての行を採らず、創業、製品分野への進出、海外販売会社の設立、生産子会社の設立、上場と市場移行、近年の買収と子会社化を選びました。
- history: Wikipediaの記事冒頭は本社の所在地の説明にとどまるため、補足としては使っていません。沿革の事実はすべて沿革の印字に基づきます。
- industry: 主たる業界は、無線通信機器等の情報通信機器の製造・販売が事業の中心であるためelectronicsとしました。通信サービスを提供する会社ではないためtelecommunicationsは付けていません。地域別セグメントはいずれも同じ製品の製造・販売であるため、2つ目の業界は付けていません。
- relatedCompanies: 株式会社JVCケンウッド（jvckenwood）は、特定投資株式に無線通信に関する技術提携が銘柄ごとに印字され、大株主でもあるためtechnologyで結びました。定型の保有目的の文だけを根拠にはしていません。
- relatedCompanies: 住友不動産株式会社（sumitomo-realty-and-development）は、特定投資株式にオフィスビルの賃貸借と当社製品の販売協力等の取引関係が銘柄ごとに印字され、大株主でもあります。取引の向きが単一でないためbusiness-partnerとしました。
- relatedCompanies: ホシデン株式会社（hosiden）は、特定投資株式に電子部品の調達先であることが銘柄ごとに印字されているためsupplierで結びました。
- relatedCompanies: 株式会社アドバンスト・メディア（advanced-media）は、特定投資株式に当社製品と関連性のある音声認識技術を保有することが銘柄ごとに印字されているためbusiness-partnerで結びました。
- relatedCompanies: 株式会社光通信（hikari-tsushin）は、【大株主の状況】に載る事業会社で上の資本関係の区分に当たらないためmajor-shareholderで結びました。
- relatedCompanies: ウェッジ株式会社は特定投資株式に当社製品の販売先として載りますが、related-candidates.jsonに無く、掲載済み企業としての同一性を確認できないため結んでいません。
- relatedCompanies: 日本証券金融株式会社（japan-securities-finance）は大株主の状況に載りますが、金融機関であり純投資と区別できないため結んでいません。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）は信託口であり、候補のトラスト（trust）はその名称との部分一致のみであるため結んでいません。
- relatedCompanies: ゼロ（zero）、ベース（base-4481）、ポート（port）、エン（en）、IC（ic）、ランド（land）、キャリア（career）、コア（core）、電算（densan）、パス（path）、リコー（ricoh）、セキ（seki）は、いずれも本文中の一般的な語や製品名、所在地の表記などとの部分一致のみで、印字された正式名称の取引先・提携先・株主ではないため結んでいません。
- relatedCompanies: 当社グループの連結子会社14社と持分法適用関連会社のポジション株式会社は、グループの会社であるため関連企業リンクの対象にはしていません。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として3件を提案しました。いずれも事業や経営戦略の説明に繰り返し現れる語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
