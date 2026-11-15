# ユシロ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ユシロ |
| 証券コード | 5013 |
| docID（データを取り出した文書） | `S100YEVT` |
| 原本 docID | `S100YEVT` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEVT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ユシロ / 5013 / docID S100YEVT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yushiro: 10 件の数値を有報XBRLと照合
有報: 株式会社ユシロ 有価証券報告書－第93期(2025/04/01－2026/03/31) (docID S100YEVT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
yushiro: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円印字どおりです。中国セグメントの2026年3月期売上高1,486百万円は、上海尤希路化学工業有限公司の第１四半期分（３か月分）のみを計上した数値です。
- businessModel: 中国合弁会社の連結除外・持分法適用関連会社化（上海尤希路化学工業有限公司は2025年９月29日、如東尤希路化学工業有限公司は2025年３月）は期中に完了し、2026年３月31日時点のグループ構成に反映されているため、needsReview ではなく沿革とこの warnings に記録します。
- businessModel: 2026年５月15日の取締役会で決議された自己株式の取得は、重要な後発事象として印字されていますが資本政策事項のため warnings に留めます。
- businessModel: 経営指標として印字される2027年３月期の予想数値（売上高522億円等）は将来予想であり、利益指標・ＲＯＥを含むため strategy 本文には転記していません。
- businessModel: クレンリネス関連事業は従来のビルメンテナンス関連事業からの名称変更であり、セグメント情報の数値への影響はない旨が印字されています（表示の変更のみ）。
- businessModel: 特定投資株式の保有目的欄に印字された株式分割（2025年10月１日付１株を２株）は保有先企業の分割であり、当社の分割ではありません。
- businessModel: suppliers は空にしました。調達先の社名は特定投資株式の保有目的（資材調達先）に印字される範囲で relatedCompanies に記録しており、事業の内容に調達先としての具体的記載がないためです。
- businessModel: 会計方針の変更や修正再表示はなく（前期有報との照合で全系列一致）、financialNotes は空です。
- businessStructure: 報告セグメントは地域別の４セグメントで、外部顧客への売上高の合計51,165百万円は連結売上高と一致します。中国セグメントの数値は持分法適用関連会社化の影響を受けた印字どおりです。
- businessStructure: 特定子会社の単体売上高（クオリケムInc.12,620百万円、ユシロマニュファクチャリングアメリカInc.5,586百万円、連結会社相互間の内部売上高を除く）には損益情報等が併記されるため、children には転記せずこの warnings に留めます。
- businessStructure: 製品別の内訳（金属加工油剤関連事業49,181百万円、クレンリネス関連事業1,983百万円）は【関連情報】の印字であり、報告セグメントではないため children にはしていません。
- history: 設立時の資本金の金額は沿革に書いていません（禁止される財務金額のため）。
- history: 2023年３月の連結子会社日本シー・ビー・ケミカル㈱の吸収合併、2024年６月の㈱汎宇の持分法適用範囲からの除外など、その他の沿革事項は行数とのバランスから主要なものに絞っています。
- industry: 金属加工油剤を主力とする化学品メーカーであり、主たる業界は chemicals（化学）です。報告セグメントは地域別ですが、製品は化学品に単一化されています。
- relatedCompanies: 各銘柄の保有目的は末尾の文言は共通ですが、販売先・資材調達先という取引上の役割が銘柄ごとに個別に印字されているため、その役割を根拠に結んでいます（fujicco・imuraya の型）。
- relatedCompanies: sojitz: 有報の印字は「双日ホールディングス㈱」であり、候補リストの sojitz（双日）に対応するものとして結びました。
- relatedCompanies: 三井住友フィナンシャルグループ・三菱UFJフィナンシャル・グループ・みずほフィナンシャルグループ: 保有目的は傘下銀行との財務取引・資金調達の円滑化であり、資金調達目的のため結びませんでした。
- relatedCompanies: ハリマビステム: 保有目的は「主として、業界動向の情報収集」であり、情報収集目的のため結びませんでした。
- relatedCompanies: 東洋紡: 保有目的は「取引のある保険代理店の親会社」であり、直接の取引役割が印字されないため結びませんでした。
- relatedCompanies: 関西ペイント・ENEOSホールディングス・イオンディライト: 当事業年度の保有株式数がゼロ（関西ペイント、ENEOS）またはコードリストにない（イオンディライト）ため結びませんでした。
- relatedCompanies: ㈱MORESCO・オーウェル㈱・山本通産㈱: 保有目的に資材調達先・主要販売先の役割が個別に印字されますが、関連候補リスト（related-candidates.json）に含まれないため結ばず、事実をこの warnings に記録します。
- relatedCompanies: land・mec・base-4481・en・seki・nippon-kinzoku・trust: 地名・子会社名・一般語・製品名（金属加工油剤）・信託口名称の部分一致であり、相手先そのものではないため結びませんでした。
- relatedCompanies: 連結子会社11社と持分法適用関連会社4社（上海尤希路化学工業有限公司、如東尤希路化学工業有限公司、汎宇化学工業㈱、三宜油化股份有限公司）は自社グループの会社のため結びませんでした。
- terms: 助言: 用語「金属加工油剤」は、金属の切削・圧延などの加工に用いる油剤で、当社グループの主力製品分野です（事業の内容に印字）。
- terms: 助言: 用語「クレンリネス関連事業」は、ビルメンテナンス製品を扱う事業の名称で、従来のビルメンテナンス関連事業から名称変更されたものです（セグメント情報に印字）。
- terms: 助言: 用語「ヒカリアクション」は、ビタミンＢ２光触媒技術を活用した当社のソリューション製品の技術名称です（経営方針・MD&Aに印字）。
- terms: 助言: 用語「共々の道」は、当社の企業理念です（経営方針に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
