# 松風 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社松風 |
| 証券コード | 7979 |
| docID（データを取り出した文書） | `S100YGMA` |
| 原本 docID | `S100YGMA` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGMA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社松風 / 7979 / docID S100YGMA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shofu: 10 件の数値を有報XBRLと照合
有報: 株式会社松風 有価証券報告書－第154期(2025/04/01－2026/03/31) (docID S100YGMA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
shofu: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額はセグメント注記と連結経営指標等の百万円単位の印字どおりに転記しました。研究開発費の金額は本文に書いていません。
- businessModel: 調達先については、事業の内容に自社の調達を一般名詞で述べる記述が特定できないため、suppliersは省きました。
- businessModel: Vision10や第五次中期経営計画の数値目標（売上高や利益の目標額と比率）は、perspectivesには転記せず、このwarningsに記録しました。目標はグループ売上高2,500億円などの長期目標と、第五次中期経営計画のグループ売上高500億円構想です。
- businessModel: 2026年1月のSHOFU Dental Corp.によるSmart Dentistry Solutions Inc.の吸収合併は当期中に完了し、連結の範囲から除かれたことが事業の内容と沿革に印字されているため、needsReviewではなくhistoryに記録しました。重要な後発事象は連結・個別とも該当事項なしと印字されています。
- businessModel: 設備の新設等の計画（本社工場の建替は2028年8月完了予定、株式会社滋賀松風の工場新設は2026年12月完了予定）は、提出日時点で進行中の設備計画として印字された予定であり、後発事象ではないためneedsReviewには入れていません。本文にも金額は書いていません。
- businessStructure: 事業名はセグメント注記の印字どおり「デンタル関連事業」「ネイル関連事業」「その他の事業」とし、外部顧客への売上高の大きい順に並べました。その他の事業は報告セグメントとして開示されています。
- businessStructure: nameは表紙の「株式会社松風」から「株式会社」を除きました。shortNameEnは表紙の英訳名そのままです。listingsの市場区分は表紙の印字（東京証券取引所プライム市場）どおりです。
- businessStructure: 連結子会社等の資本金又は出資金の金額は書いていません。
- history: 沿革の各行は年月まで印字されていますが、historyの形に月は書けないため年に畳み、月はdescriptionに残しました。創立時や子会社化の際の資本金の金額は書いていません。2020年の第三者割当増資についても資本金の金額は書いていません。
- industry: 主たる業界はpharmaceuticals（医薬品）を暫定としました。閉じた集合に歯科材料・医療機器の区分が無く、歯科医療向けの材料・機器を製造販売する事業に最も近いためです。ネイル関連事業とその他の事業は売上が小さく、独立した業界は付けていません。
- relatedCompanies: 三井化学株式会社（mitsui-chemicals）: 【関係会社の状況】のその他の関係会社として結びました。大株主の状況でも20.11％と印字されますが、関係は関係会社の区分どおりとし、被所有割合は関係会社の状況の20.1％を使いました。
- relatedCompanies: 株式会社モリタ: 【大株主の状況】に457千株・1.28％の事業会社として載りますが、related-candidates.jsonに無く、有報に同社との取引・提携の個別記述も特定できないため結んでいません。
- relatedCompanies: 株式会社京都フィナンシャルグループ（kyoto-financial-group）、株式会社滋賀銀行（the-shiga-bank）: 特定投資株式の保有目的は安定した金融取引関係の維持であり、資金調達・金融取引が理由のため結んでいません。滋賀銀行は大株主にも載りますが、金融機関の純投資・金融取引のため結んでいません。
- relatedCompanies: 星和電機株式会社（seiwa-electric-mfg）、京都機械工具株式会社（kyoto-tool）: 特定投資株式の保有目的は地元企業として情報交換を中心とする関係の維持・強化のみで、取引の向きや提携の具体的な内容が印字されていないため結んでいません。
- relatedCompanies: 株式会社中央倉庫（chuo-warehouse）、日本新薬株式会社（nippon-shinyaku）、株式会社ファルコホールディングス（falco-holdings）、東洋テック株式会社（toyo-tec）: 当事業年度に保有する全株式を売却したと印字され、期末時点で保有が無いため結んでいません。
- relatedCompanies: en、career、seki、vision、zero、land、path、suzuki-6785、kuze、base-4481、mec、step、tein、innovation、port、ray、como、garden、rhythm、trust: 一般語、役員氏名、地名、製品名などの部分一致で、当社がその相手について取引・提携・資本関係を述べた箇所はないため結んでいません。trustは日本マスタートラスト信託銀行（信託口）の名称一致で、コードリストにもありません。
- relatedCompanies: サンメディカル株式会社: 持分法適用関連会社で三井化学株式会社の連結子会社ですが、未上場でrelated-candidates.jsonに無いため結んでいません。事実はhistoryとbusinessModelのindustryPositionに記録しました。
- relatedCompanies: 当社グループの連結子会社18社と持分法適用関連会社であるサンメディカル株式会社は、当社グループの会社であるため関連企業リンクには含めていません（三井化学を除く）。三井化学はその他の関係会社として結んでいます。
- terms: 助言: 用語「人工歯」は歯科材料の主要製品区分で、当社の創業製品です（沿革・事業の内容に印字）。
- terms: 助言: 用語「CAD/CAM」は歯科医療のデジタル化を指す文脈で、歯科切削加工用材料などの製品説明に使われます（MD&A・研究開発活動に印字）。
- terms: 助言: 用語「充填修復材料」は歯科用充填修復のための材料で、海外売上を支える製品としてMD&Aに印字されます。
- terms: 助言: 用語「PRESTO」はネイル関連事業の可視光線LED硬化ジェルネイルシステムの主力ブランド名です（研究開発活動に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 松風（shofu）の主たる業界（歯科材料・機器） → 提案: 医療機器・歯科材料（ヘルスケア）。売上高の大半はデンタル関連事業（2026年3月期の外部顧客への売上高37,669百万円）の人工歯類、研削材類、化工品類、セメント類、機械器具類などの歯科材料・機器であり、医薬品の開発・製造ではない。閉じた集合に医療機器・歯科材料の区分が無いためpharmaceuticalsを暫定にしたが、実態は歯科医療向けの材料・機器メーカーである。
