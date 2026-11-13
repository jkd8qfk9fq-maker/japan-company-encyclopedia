# 伊勢湾海運 — research log

Registered: 2026-11-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 伊勢湾海運株式会社 |
| 証券コード | 9359 |
| docID（データを取り出した文書） | `S100YE7Y` |
| 原本 docID | `S100YE7Y` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE7Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 伊勢湾海運株式会社 / 9359 / docID S100YE7Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
isewan-terminal-service: 10 件の数値を有報XBRLと照合
有報: 伊勢湾海運株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YE7Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
isewan-terminal-service: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空。変則決算・決算期変更はなく、有報の注記は潜在株式が存在しない旨のみで、前期有報との修正再表示チェックも全行一致だったため。
- businessModel: 中期経営計画および経営数値目標（当期・翌期の売上高、営業利益、経常利益、親会社株主に帰属する当期純利益の目標値）は、目標値および利益に関する指標のため本文に入れず、strategy にはビジョンと重点施策だけを書きました。
- businessModel: 地域別の売上高は千円単位の表で印字されているため、百万円への換算（47,055,128千円→47,055百万円など端数を切り捨て）を行い、その旨をここに記録します。
- businessModel: MD&Aの作業種別の内訳は、沿岸荷役料が「75億円」と億円単位に丸めて印字されているため、内訳の合計は連結売上高と２百万円異なります。有報の印字どおりに引用しました。
- businessModel: Wikipediaの記事「伊勢湾海運」は有報を超える内容を含まないため情報源に採用せず、情報源は有報のみとしました。
- businessStructure: 当社グループは物流事業の単一セグメントであり、【事業の内容】の事業区分そのままを子区分としました。作業種別の金額はMD&Aに印字されていますが、事業区分とは対応しないため子区分には金額を記載していません。
- businessStructure: 持分法適用関連会社の五洋海運株式会社は自社グループの会社であり、関連企業リンクの対象外として事業構造に記載しました。同社は当社株式の23.94％を保有する筆頭株主でもあります（【大株主の状況】）。
- history: 創立時の資本金の金額は、資本金額を沿革に書かない方針により転記していません。
- history: 各行には year のみを用い、month キーは付けていません。
- industry: 主たる業界は transportation とした。報告セグメントは物流事業の単一セグメントであり、港湾運送・倉庫・運送はいずれも transportation の範囲であるため、副業種は付けていません。taxonomyGaps はありません。
- relatedCompanies: 特定投資株式の保有目的は、ほぼ全銘柄が同一の定型文「物流事業の取引関係の維持・強化のため保有しております。」（一部は持株会加入の文言を伴う同趣旨の定型文）であり、個別の取引内容の記載がないため、その記載だけではリンクしていません（koa の先例）。対象：上組、FUJI、DMG森精機、阪和興業、日本製鉄、名港海運、住友商事、トヨタ自動車、住友重機械工業、東邦瓦斯、ノリタケ、河合楽器製作所、双日、伊藤忠商事、豊田通商、大同特殊鋼、岡谷鋼機、商船三井、NSユナイテッド海運、日清製粉グループ本社、中部飼料、フィード・ワン、アマダ。
- relatedCompanies: 名古屋銀行、三菱UFJフィナンシャル・グループ、あいちフィナンシャルグループは、特定投資株式の保有目的が「金融取引の円滑化のため」という資金調達関係のみの記載であり、リンクしていません。なお大株主としての記載があるのは三菱UFJフィナンシャル・グループではなく株式会社三菱UFJ銀行（銀行本体）であり、別の法人です。
- relatedCompanies: 光通信は、光通信ＫＫ投資事業有限責任組合（投資事業有限責任組合）が大株主として記載されているだけで、株式会社光通信そのものとの関係の記載がないためリンクしていません。
- relatedCompanies: 五洋海運株式会社は自社グループの持分法適用関連会社であり、関連企業リンクの対象外として事業構造に記載しました（大株主でもあります）。
- relatedCompanies: エン、ビジョン、キャリア、スローガン、イノベーション、アスカ、東名はいずれも一般語・部分一致（現地法人名の略記、経営理念・中期経営計画の文言、事業所名など）であり、取引・提携・資本関係の記載がないためリンクしていません。日新とトラストはコードリストにない相手（公告の掲載紙名、信託銀行の名称の一部）です。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の【事業の内容】の記載に基づきます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
