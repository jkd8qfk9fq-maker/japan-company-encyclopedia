# A＆Dホロンホールディングス — research log

Registered: 2026-10-01（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ａ＆Ｄホロンホールディングス |
| 証券コード | 7745 |
| docID | `S100YHHI` |
| 提出日 | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHHI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ａ＆Ｄホロンホールディングス / 7745 / docID S100YHHI（id は英語表記「A&amp;D HOLON Holdings Company, Limited」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
a-and-d-holon-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社Ａ＆Ｄホロンホールディングス 有価証券報告書－第49期(2025/04/01－2026/03/31) (docID S100YHHI)
前期有報との比較: 20 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 15 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
すべて一致しました。
a-and-d-holon-holdings: 本文の金額 16 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社A＆Dホロンホールディングス」が EDINET の提出者名「株式会社Ａ＆Ｄホロンホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 「主要な顧客ごとの情報」は、有報が「外部顧客への売上高のうち、連結損益計算書の売上高の10％以上を占める相手先がないため、記載はありません。」としているため、businessModel.customers には具体的な取引先名ではなく顧客類型を記載した。
- businessModel: [[term:semiconductor|半導体]] は src/data/terms/semiconductor.json に既存の用語としてリンクした。新規用語の提案はしていない（未確定の用語にはリンクしない原則のため）。
- businessModel: description（一文の説明）は62文字・句点1つで、90文字制限内であることを確認済み。
- businessModel: businessModel.flow は company→offering→customer→revenue→profit の5段階固定順で記載した。各段階の金額は全て md-and-a.txt / business.txt の印字どおり（百万円単位）。
- businessModel: 営業利益の内訳（セグメント利益の合計11,024百万円から全社費用等1,815百万円を差し引いて9,209百万円）は md-and-a.txt に明記された算式をそのまま使用した。
- businessStructure: 事業の並び順は当連結会計年度（2026年3月期）の外部顧客への売上高に基づく：計測・計量機器事業31,545百万円 > 医療・健康機器事業26,667百万円 > 半導体関連事業11,114百万円。いずれも【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】に同額が印字されている。3事業とも有報が【事業の内容】で名指しする報告セグメントそのもので、「報告セグメントに含まれない」区分はない。
- businessStructure: セグメント注記は各事業の下に日本／米州／欧州／アジア・オセアニアの地域別売上高・利益も開示しているが、これは【事業の内容】が示す製品群区分ではなく地域区分であり、富士電機の「分野」や横河電機の「サブセグメント」のような名指しされた事業の下位区分ではないため、children には使っていない。
- businessStructure: shortNameEn（大きなラテン文字のワードマーク）は証拠パック中のどこにも印字されておらず、捏造を避けるため記載していない。
- businessStructure: name・listings は証拠パック（brief.md・cover-page.txt・draft-entry.json）の表紙の印字と、既存のfigures-only登録エントリーの値に一致することを確認して記載した。
- history: 有報の【沿革】は年月・事項が1件ずつ交互に印字される崩れていない形で、48件ある。このうち、現在の事業構成（計測・計量機器／医療・健康機器／半導体関連の3事業）・社名・上場区分の由来を示す10件を選定して記載した。残り38件（追加の現地法人設立、他社の完全子会社化・業務提携、国内外の本社・工場の移転、ISO認証取得など）は本文に含めていない。
- history: 2022年4月に印字されている3件のうち、持株会社化・商号変更と東京証券取引所プライム市場への移行は性質の異なる出来事のため別々のHistoryEventとした。残る1件（㈱エー・アンド・デイ分割準備会社の商号を㈱エー・アンド・デイに変更）は、持株会社化の記述に「現・連結子会社 ㈱エー・アンド・デイ」と既に注記されているため独立した項目にしていない。
- industry: INDUSTRY_IDS には「精密機器」「医療機器」に当たる区分が無いため、計測・計量機器事業（電子天びん・台はかり・材料試験機等）と医療・健康機器事業（血圧計・生体情報モニタ等）は、電子応用製品をつくる会社という性質から electronics に分類した。ニコン（映像・産業機器中心で electronics を primary、半導体露光装置事業により semiconductors を併記）の先例に倣った。
- industry: 半導体関連事業（フォトマスク上の半導体設計回路寸法測定・欠陥レビュー・分析装置、A/D・D/A変換器、電子銃）は、報告セグメントとして独立開示されている（2026年3月期売上高11,114百万円）。半導体そのものはつくらないが半導体製造装置・検査装置を事業として開示しているため、ガイドラインの『AGC・信越化学工業・キヤノン・ニコン』パターンに従い semiconductors を2つ目に付けた。
- industry: primary industry は electronics とした。3事業の2026年3月期売上高は計測・計量機器31,545百万円（45.5％）、医療・健康機器26,667百万円（38.5％）、半導体関連11,114百万円（16.0％）で、単独過半の事業は無いが、計測・計量機器事業と医療・健康機器事業（合計で売上の84％）がいずれも electronics に区分される事業であるため、electronics を primary とした。
- relatedCompanies: src/data/companies/index.ts は relatedCompanies を書く直前に再確認し、以下7社が全て登録済みであることを確認した：chino（㈱チノー）, trusco-nakayama（トラスコ中山㈱）, denkyo-group-holdings（㈱デンキョーグループホールディングス）, sugimoto-and-co（杉本商事㈱）, nihon-kohden（日本光電㈱）, naito-and-co（㈱ＮＡＩＴＯ）, imv（ＩＭＶ㈱）。社名照合は NFKC 正規化し「㈱」を落として行った。
- relatedCompanies: 関連企業・連結子会社（㈱エー・アンド・デイ、㈱ホロン、㈱Ａ＆Ｄマニュファクチャリング、A&D ENGINEERING, INC. など）は relatedCompanies には含めていない。これらはグループ内の100％子会社（一部68.0％所有のA&D SCIENTECH TAIWAN LIMITEDを除く）であり、businessStructure 工程の businesses[].description で既に記載済みであるため（RELATIONSHIP_KINDS に subsidiary という種別も無い）。
- relatedCompanies: 政策保有株式のうち、保有目的が「安定的資金取引の維持を目的とした保有」と印字されている㈱武蔵野銀行・㈱りそなホールディングス・㈱三菱ＵＦＪフィナンシャル・グループ・㈱みずほフィナンシャルグループの4行は、資金調達目的のため結んでいない（pipeline.md の方針どおり）。
- relatedCompanies: 政策保有株式のうち、保有目的が「他社事例情報の取得を目的とした保有」と印字されている㈱島津製作所・協立電機㈱・菊水ホールディングス㈱・ＤＩＣ㈱・㈱小野測器の5銘柄は、取引関係ではなく他社事例（同業の参考情報）の収集を目的とした保有であるため結んでいない。ヤマハ発動機の『株主に対する情報提供方法等の情報収集のため』の保有と同種の非取引保有と判断した。
- relatedCompanies: 第一生命ホールディングス㈱（5,600株、貸借対照表計上額7百万円、保有目的『安定的商業取引の維持を目的とした保有』）は判断に迷い、結んでいない。同社は生命保険持株会社で、有報の脚注②に『第一生命ホールディングス㈱は当社の株式を保有しておりませんが、同社子会社が当社の株式を保有しております』とあるのみで、『商業取引』の具体的な中身（保険取引か否か）が印字されていない。保険会社を保険取引目的の保有として結ばない方針（pipeline.mdの銀行・保険会社の規則）に照らし、生命保険会社との保有目的不特定の『商業取引』は資金・保険関係の延長である可能性が高いと判断して結ばなかったが、確証はないため needsReview ではなく warnings に記録する。
- relatedCompanies: ㈱エー・アンド・デイ（当社最大保有子会社）が保有する政策保有株式（非上場株式1銘柄、貸借対照表計上額159百万円）は、銘柄名が有報に印字されていないため結べない。
- relatedCompanies: 持分法非適用の非連結子会社2社は、有報に社名が印字されていないため結べない。
- relatedCompanies: 有報の【事業等のリスク】【重要な契約等】など未読のセクションに追加の取引関係の記載がある可能性はあるが、業務の性質上の確証が得られる【株式の保有状況】【関係会社の状況】を中心に調査した。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は担当フィールドを持たない助言専任工程であるため、data.requiredTermIds / data.proposedTerms は組み立て時に捨てられる想定で記載している（docs/pipeline.md の担当フィールド表のとおり）。
- terms: requiredTermIds の semiconductor は businessModel-agent が description と businessModel.description / flow[1].description で [[term:semiconductor|半導体]] として既にリンク済み（src/data/terms/semiconductor.json が既存）。consolidated-subsidiary・segment は本文中で『連結子会社』『セグメント』という語を使っているが、リンクは付けていない（businessStructure/businessModelの両agentとも用語リンクとしては未使用。将来の校正で検討の余地があるという参考情報として記録するのみ）。
- terms: proposedTerms の holding-company（持株会社）は未登録のため、本文（businessModel.description, flow[0].description）では『持株会社』という語をプレーンテキストのまま使用し、リンクはしていない（『提案中の用語にはリンクしない』という規則どおり）。

## 要確認（status に反映）

なし。
