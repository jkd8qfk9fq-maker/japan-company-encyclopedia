# トリニティ工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | トリニティ工業株式会社 |
| 証券コード | 6382 |
| docID（データを取り出した文書） | `S100YE9T` |
| 原本 docID | `S100YE9T` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE9T.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | トリニティ工業株式会社 / 6382 / docID S100YE9T（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
trinity-industrial: 10 件の数値を有報XBRLと照合
有報: トリニティ工業株式会社 有価証券報告書－第92期(2025/04/01－2026/03/31) (docID S100YE9T)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
trinity-industrial: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はMD&Aに印字された億単位の表記（売上高389億6千万円、設備部門293億7千1百万円、自動車部品部門95億8千8百万円、親会社株主に帰属する当期純利益26億8千8百万円）をそのまま使いました。千円表記の表だけに印字された地域別売上高などの金額は、単位の換算が必要になるため本文には書いていません。
- businessModel: 調達については、有報が自動車部品部門の文脈で使う一般名詞「仕入先」だけをsuppliersに書きました。特定の調達先の社名は印字されていないため書いていません。
- businessModel: 研究開発費や設備投資の金額は本文に書いていません。
- businessModel: 変則決算や決算期変更はなく、financialNotesに書く事実はありませんでした。
- businessModel: 持分法を適用していた東莞佳立汽車飾件有限公司の清算結了と持分法適用範囲からの除外は、当期中に完了した事象のためwarningsに記録し、needsReviewには入れていません。
- businessStructure: 事業名はセグメント注記の印字どおり「設備部門」「自動車部品部門」とし、外部顧客への売上高の大きい順に並べました。
- businessStructure: 事業別の金額はMD&Aに印字された億単位の表記（設備部門293億7千1百万円、自動車部品部門95億8千8百万円）をそのまま使いました。セグメント注記の千円表記とは同じ金額です。
- businessStructure: 連結子会社10社・関連会社4社の資本金又は出資金の金額は書いていません。
- businessStructure: 持分法を適用していた東莞佳立汽車飾件有限公司は当連結会計年度に清算結了し持分法の適用範囲から除外されました。当期中に完了し期末の体制に反映された事象のため、needsReviewには入れていません。
- businessStructure: 主要な設備の帳簿価額は書いていません。
- history: 沿革の各行は年月まで印字されていますが、historyの形に月は書けないため年に畳み、月はdescriptionに残しました。
- history: 設立時及びその後の資本金の金額は書いていません。
- history: 沿革に印字された営業所開設・認証取得・受賞等の全行は載せず、設立・上場・資本参加・商号変更・本社移転・製造開始・海外子会社設立等の主要な出来事を選びました。
- industry: 売上の大半を占める設備部門（外部顧客への売上高293億7千1百万円）は塗装プラント、塗装機器及び産業機械の設計、製造及び販売のため、machinery（機械）を主たる業界としました。
- industry: 自動車内外装部品の製造及び販売を行う自動車部品部門（同95億8千8百万円）があるため、automotive（自動車）を2つ目に付けました。
- relatedCompanies: 株式会社豊通マシナリー: 主要な顧客ごとの情報に設備部門の顧客として印字される主要な販売先ですが、related-candidates.jsonになく百科事典に企業ファイルがないため結んでいません。事実はbusinessStructureとbusinessModelに記録しました。
- relatedCompanies: 株式会社SUBARU: 特定投資株式に主に設備事業における取引先として印字されていますが、related-candidates.jsonにないため結んでいません。
- relatedCompanies: 豊田合成（toyoda-gosei）: 特定投資株式の保有目的が「主に部品事業における取引先であり、中長期的な関係の維持と更なる発展を図ることを目的として保有を継続」という全銘柄共通の定型句だけであり、主要な顧客ごとの情報等の独立した取引の印字がないため結んでいません。
- relatedCompanies: 名古屋銀行（the-bank-of-nagoya）: 特定投資株式の保有目的が金融取引等の円滑化であり、資金調達・金融取引が理由のため結んでいません。
- relatedCompanies: 中央発條（chuo-spring）: 特定投資株式に載りますが当事業年度の保有株式数は「－」で保有しておらず、定型句以外の関係の印字もないため結んでいません。
- relatedCompanies: 株式会社豊田自動織機（toyota-industries-6201）: 大株主の状況に1.24％の保有で載りますが、related-candidates.jsonのlistingが「（コードリストにない）」で同一性を確認できないため結んでいません。
- relatedCompanies: キング（king）: 本文の「ワーキンググループ」等の語の一部が一致したもので、社名の印字ではありません。
- relatedCompanies: エン（en）: ambiguousで、本文の「総合エンジニアリング会社」等の語の一部が一致したもので、社名の印字ではありません。
- relatedCompanies: ベース（base-4481）: 製品名「ドアスイッチベース」の一部が一致したもので、社名の印字ではありません。
- relatedCompanies: ポート（port）: 本文の「レポート」等の語の一部が一致したもので、社名の印字ではありません。
- relatedCompanies: リード（the-lead）: 本文の「業界をリードする」等の語の一部が一致したもので、社名の印字ではありません。
- relatedCompanies: ゼロ（zero）: ambiguousで、「工場CO2ゼロチャレンジプロジェクト」の一部が一致したもので、社名の印字ではありません。
- relatedCompanies: 松屋（matsuya）: ambiguousで、大株主の住所「松屋町」の一部が一致したもので、社名の印字ではありません。
- relatedCompanies: スローガン（slogan）: 本文の「スローガンに」という一般名詞が一致したもので、社名の印字ではありません。
- relatedCompanies: 当社グループの連結子会社・持分法適用関連会社は、当社自身のグループ会社であり関連企業リンクの対象ではないため結んでいません。
- terms: 助言: 用語「電着塗装装置」は設備部門の主要製品の一つで、塗装設備を構成する装置です（事業の内容に印字）。
- terms: 助言: 用語「塗装ブース」は設備部門の主要製品の一つです（事業の内容に印字）。
- terms: 助言: 用語「Tri-D³eco」は当社の加飾工法の名称で、2011年12月にこの工法による自動車部品の生産を開始しました（沿革に印字）。
- terms: 助言: 用語「Trinity Technical Solution Center（TTSC）」は2025年10月に本社隣接地に開所した技術の共創拠点です（沿革・経営方針に印字）。
- terms: 助言: 用語「熱・水・空気の総合エンジニアリング会社」は当社が自社を表す表現です（経営方針、経営環境及び対処すべき課題等に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
