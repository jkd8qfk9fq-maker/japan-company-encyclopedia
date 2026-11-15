# テラスカイ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社テラスカイ |
| 証券コード | 3915 |
| docID（データを取り出した文書） | `S100YO1B` |
| 原本 docID | `S100Y60F` |
| 提出日（原本） | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100YO1B／有効文書 S100YO1B（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YO1B.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社テラスカイ / 3915 / docID S100Y60F（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
terrasky: 10 件の数値を有報XBRLと照合
有報: 株式会社テラスカイ 訂正有価証券報告書－第20期(2025/03/01－2026/02/28) (docID S100YO1B)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第20期(2025/03/01－2026/02/28)、docID S100YO1B）を有効文書としてこのパックを作った。原本は docID S100Y60F。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（OverviewOfAffiliatedEntitiesTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
すべて一致しました。
terrasky: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記: 本文の金額は有報の千円印字を百万円に切り捨てた（切捨て方式）。セグメント別の売上高はセグメント情報の外部顧客への売上高（ソリューション事業25,819,502千円、製品事業2,237,318千円）を用い、切り捨て後の合計28,056百万円は印字の連結売上高と一致する。
- businessModel: MD&A及び【事業の内容】が示すセグメント別売上高（ソリューション事業26,020,682千円、製品事業2,254,367千円）はセグメント間の内部売上高を含む数値であるため本文には用いず、セグメント情報の外部売上高を用いた。
- businessModel: 訂正有報について: 有効文書は訂正有価証券報告書（S100YO1B、2026年７月１日提出）で、分類は text-change。原本（S100Y60F）との差異は【関係会社の状況】（OverviewOfAffiliatedEntitiesTextBlock）の本文のみで、５年間の経営指標（売上高・純利益・総資産・純資産・従業員数）は原本と同一である。本文は有効文書から書き、出典は訂正有報を指している。指標に影響しないため financialNotes には書かず、ここに記録した。
- businessModel: 連結経営指標等の注記１（「収益認識に関する会計基準」等を第17期の期首から適用）は、前期有報との修正再表示チェックで全系列に相違が無く、指標の比較可能性に影響しないため、financialNote にはせずここに記録した。
- businessModel: 書かなかったもの: 営業利益・経常利益の金額、セグメント利益の金額、受注高・受注残高の金額は、本文の規則（本文の財務数値は売上高と当期純利益だけ、受注高は書かない）により本文に入れていない。経営指標の数値目標は有報の証拠パックに印字が無く、書いていない。
- businessModel: 期中に完了し期末の体制に反映された事象（連結子会社であった株式会社エノキの吸収合併（2025年６月１日効力発生）、株式会社DiceWorksの吸収合併（2025年11月１日効力発生）、TerraSky Inc.の清算）は【沿革】と history に記録し、needsReview には入れていない。重要な後発事象は連結・個別とも『該当事項なし』である。
- businessModel: 2026年２月期の配当予想の修正及び株主優待制度の廃止の決議（MD&Aの主な取組に印字）は資本政策に関する事項であり、本文・needsReview には入れずここに記録した。
- businessModel: suppliers は、この worktree の旧スキーマにキーが存在しないため businessModel に入れていない。仕入・提携にあたる事実（セゾンテクノロジーの『DataSpider』のOEM化等）は relatedCompanies 及びその warnings に記録した。
- businessStructure: セグメント別の売上高はセグメント情報の外部顧客への売上高を用いた。MD&A等の内部売上高を含む数値（ソリューション事業26,020,682千円、製品事業2,254,367千円）は用いていない。
- businessStructure: 『SkyVisualEditor』『mitoco X』の製品別売上高は【事業の内容】の印字（千円）を百万円に切り捨てた。製品事業の報告セグメントには、Salesforceライセンス販売、オンプレミス連携ツール『DCSpider』、LINE連携サービス『OMLINE』等の提供も含まれるが、金額の印字が無いものは children に含めていない。
- businessStructure: 連結子会社の株式会社テラスカイベンチャーズ及びTSV１号投資事業有限責任組合による投資事業は報告セグメントの『その他』であり、金額の開示が無いため businesses には含めず、ここに記録した。
- history: 沿革のうち、本社・事業所の移転・開設、ISO認証の取得、TerraSky Labの開設等の行は、事業の転機ではないため history には含めていない。資本・業務提携の相手のうち未上場の会社（ＮＴＴテクノクロス株式会社、エコモット株式会社、クラウディアジャパン株式会社、株式会社Phone Appli、株式会社イグアス）との提携行も、関連企業リンクの対象ではないため本文には含めず、ここに記録した（エコモットとの関係は関連企業の根拠として別途記録）。
- history: 設立時・子会社設立時の資本金の金額は、規則により history に書いていない。
- history: 2025年６月の株式会社エノキの吸収合併、同年11月の株式会社DiceWorksの吸収合併、TerraSky Inc.の解散は、当連結会計年度中に完了し期末の連結体制に反映された事象として history に記録した（needsReview ではない）。
- history: 2022年９月に持分法適用会社であった株式会社キットアライブが札幌証券取引所アンビシャス市場に新規上場したこと、その後株式取得により連結子会社となったことは、関係会社の状況の注記に印字されている。当社の連結子会社であり関連企業には含めていない。
- industry: 主たる業界は、ソリューション事業（クラウドシステムの構築・導入支援・保守）と製品事業（自社クラウドサービスの開発・販売・保守）のいずれもがIT・クラウドサービスであるため it とした。閉じた分類に当てはまる値があるため taxonomyGaps は無い。
- industry: 連結子会社の投資事業（『その他』）は報告セグメントではなく規模も小さいため、独立した業界は付けていない。
- relatedCompanies: 株式会社NTTデータは、2024年４月に資本・業務提携を締結し、2026年２月28日現在で当社株式2,054,600株（15.92％）を保有する大株主であり、MD&Aには同社と共同で『NTT DATA Salesforce Hub』を設立した旨も印字されている。しかし related-candidates.json に同社が無く、候補の ntt（NTT株式会社）は同社とは別の法人であるため、リンクせず事実のみここに記録した。
- relatedCompanies: ビジネスエンジニアリング株式会社は、かつて特定投資株式として330,000株を保有していたが、2025年２月期に保有目的を純投資目的へ変更した（同社の株式は純投資目的の区分で保有継続）ため、関連企業には含めていない。
- relatedCompanies: 株式会社テクノスジャパンは特定投資株式として保有していたが、当事業年度に全て売却した（当事業年度末の株式数はゼロ）ため、関連企業には含めていない。
- relatedCompanies: 連結子会社（株式会社スカイ３６５、株式会社BeeX、株式会社Cuon、株式会社テラスカイベンチャーズ、TSV１号投資事業有限責任組合、株式会社Quemix、TerraSky (Thailand) Co., Ltd.、株式会社テラスカイ・テクノロジーズ、株式会社リベルスカイ、株式会社キットアライブ）は自社グループの会社であり、関連企業には含めていない。候補の technologies は当社の連結子会社である株式会社テラスカイ・テクノロジーズの名称一致であり、候補企業そのものではないためリンクしていない。
- relatedCompanies: 候補の ntt（NTT株式会社）について、有報に現れるのは同社の子会社であるＮＴＴテクノクロス株式会社（2010年の資本・業務提携の相手、未上場）及び株式会社NTTデータであり、NTT株式会社そのものとの提携・取引の印字は無いためリンクしていない。
- relatedCompanies: 連結子会社の株式会社Quemixの共同研究の相手としてMD&Aに現れる旭化成株式会社、株式会社本田技術研究所（候補 honda は本田技研工業株式会社で別の法人）、三菱電機株式会社、住友ゴム工業株式会社、SCSK株式会社（コードリストに無い旨が候補データに印字）は、当社自身の提携・取引関係の印字では無いためリンクしていない。
- relatedCompanies: 富士通株式会社については、クラウドERPで利用する『GLOVIA OM』が同社の『GLOVIA』のノウハウを用いたサービスである旨の印字に留まり、同社との提携関係の明示は無いためリンクしていない。
- relatedCompanies: 大株主のうち日本マスタートラスト信託銀行株式会社（信託口）は信託口、株式会社マレスカイは未上場で候補に無く、その他は個人株主であるためリンクしていない。野村證券株式会社は大株主として現れるが金融機関であり提携の印字も無いためリンクしていない。
- relatedCompanies: 候補のうち一般語・名称の一致のみで当社との関係の印字が無いもの（nissin（新株予約権の記載中の文字一致、コードリストに無い）、base-4481（売上額ベース）、seki（セキュリティ）、core、innovation、king、lec、rhythm、ray、trust（コードリストに無い）、ai、slogan、system-integrator、vision、japan-exchange-group（指数の公表元として登場）、japan-post-holdings・toyota（Salesforceの利用企業例として脚注に登場））はリンクしていない。
- terms: 助言のみの工程。用語の追加提案は無い。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
