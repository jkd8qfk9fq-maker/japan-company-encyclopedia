# 株式会社守谷商会 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社守谷商会 |
| 証券コード | 1798 |
| docID（データを取り出した文書） | `S100YDA3` |
| 原本 docID | `S100YDA3` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDA3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社守谷商会 / 1798 / docID S100YDA3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
moriya: 10 件の数値を有報XBRLと照合
有報: 株式会社守谷商会 有価証券報告書－第72期(2025/04/01－2026/03/31) (docID S100YDA3)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":1651794000,"latestFiling":1650370000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":2373304000,"latestFiling":2371087000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":34143776000,"latestFiling":34144730000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":15940610000,"latestFiling":15939185000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
moriya: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 特定投資株式の保有目的は全銘柄とも同一の定型文（建設会社各社は「建設工事の営業等の業務のより円滑な推進のため」、株式会社八十二長野銀行は「金融取引等の業務のより円滑な推進のため」）であり、個別化された取引内容の記載がないため、koa（714）の先例により保有目的だけでは関連企業としてリンクしなかった。対象は第一建設工業、マルイチ産商、高見澤、キッセイ薬品工業、エムケー精工、サンリン、エフビー介護サービス、タカノ、東急。
- businessModel: 前期有報との照合で第71期（2025年3月期）の親会社株主に帰属する当期純利益・経常利益・総資産額・純資産額に差異があったが、経営指標の注記2に企業結合に係る暫定的な会計処理の確定による旨が印字されているため、financialNotesに理由を記録し、登録は当期有報の数値を用いた。
- businessModel: セグメント情報の内部売上高を含む数値（建築事業の合計42,866百万円等）は用いず、外部顧客への売上高（建築42,865百万円、土木7,600百万円、不動産389百万円）を用いた。3セグメントの外部売上高の合計は連結売上高50,855百万円と一致する。
- businessModel: MD&Aは売上高・セグメント数値を百万円単位で印字しているため、本文の金額はその印字どおり百万円単位で記載した。
- businessModel: 中期経営計画2026の達成指標（営業利益率等の収益性指標）は投資・利益指標であるためstrategyには数値を書かず、計画名、基本テーマと施策のみを記載した。
- businessModel: 2024年11月の未来ネットワーク株式会社の完全子会社化は前連結会計年度中に完了し期末の構造に反映されているため、needsReviewには入れず沿革に記載した。
- businessModel: 関連候補のうちゼロ（ゼロカーボンの文脈）、ベース（営業利益ベースの文脈）、ビジョン（長期ビジョンの文脈）、キャリア（キャリア採用の文脈）、ポート（コンプライアンスの部分一致）、レント（タレントマネジメントの部分一致）、トラスト（信託銀行の文脈）は一般語・部分一致による誤検出であり、取引・提携・資本関係の記載がないためリンクしなかった。
- businessStructure: セグメント別の従業員数は、建築事業及び土木事業を合わせて399人と印字されているため（両事業に携わる従業員がおり明確に分けられない旨の注記あり）、子事業への従業員数の按分は行わなかった。
- history: 設立時等の資本金の金額は、禁止される財務金額に当たるため沿革には記載しなかった。
- industry: 閉じた分類のうち、当社グループの事業（建築・土木の建設工事請負と不動産事業）の実態に当たる区分としてconstructionを主たる業界とした。建設業の大臣許可を受け建設工事の請負を主体とする事業構成であり、不動産事業は売上構成が小さいため副次的な業界は付していない。
- relatedCompanies: 株式会社八十二長野銀行は、大株主の状況に主要な株主として印字されているため主要株主としてリンクした。特定投資株式としての当社からの保有目的は「金融取引等の業務のより円滑な推進のため」という定型文であり、それだけでは取引先としてリンクしなかった。
- relatedCompanies: 第一建設工業、マルイチ産商、高見澤、キッセイ薬品工業、エムケー精工、サンリン、エフビー介護サービス、タカノ、東急は、特定投資株式の保有目的が全社同一の定型文「建設工事の営業等の業務のより円滑な推進のため」であり、個別化された取引役割の記載がないため、koa（714）の先例によりリンクしなかった。各社の保有事実そのものは株式の保有状況に印字されている。
- relatedCompanies: 連結子会社5社（株式会社アスペック、丸善土木株式会社、守谷不動産株式会社、機材サービス株式会社、未来ネットワーク株式会社）は自社グループの会社であるためリンクしていない。
- relatedCompanies: 候補のうちゼロ、ベース、ビジョン、キャリア、ポート、レント、トラストは一般語・部分一致による誤検出であり、取引・提携・資本関係の記載がないためリンクしなかった。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

- businessModel: 2026年4月1日付で普通株式1株につき5株の割合で株式分割を実施しました（2026年2月9日開催の取締役会決議に基づくもので、連結財務諸表及び財務諸表の重要な後発事象に印字）。株式数に関する指標は第68期の期首に当該分割が行われたと仮定して算定されています。本登録は分割前の2026年3月31日時点の構造で行います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
