# 大日光・エンジニアリング — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社大日光・エンジニアリング |
| 証券コード | 6635 |
| docID（データを取り出した文書） | `S100XUDS` |
| 原本 docID | `S100XUDS` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUDS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社大日光・エンジニアリング / 6635 / docID S100XUDS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
di-nikko-engineering: 10 件の数値を有報XBRLと照合
有報: 株式会社大日光・エンジニアリング 有価証券報告書－第47期(2025/01/01－2025/12/31) (docID S100XUDS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
di-nikko-engineering: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、千円単位の印字を百万円単位へ切り捨てて転記しました（売上高36,954,622千円、親会社株主に帰属する当期純利益208,833千円、前期277,378千円など）。四捨五入はしていません。
- businessModel: キヤノングループへの売上依存度は割合（パーセント）で印字されていますが、比率は本文に書かない規則のため、主要販売先である事実だけを書きました。
- businessModel: suppliersには、タイとベトナムで実際に使っている委託生産工場だけを一般名詞で書きました。自社の部品の仕入先の社名は印字されておらず、部品調達は顧客向けに提供する工程として書かれています。
- businessModel: 持分法適用関連会社のTROIS TAKAYA ELECTRONICS (THAILAND) CO.,LTD.は、決算日を11月30日から12月31日に変更したため、当連結会計年度は13ヵ月間について持分法を適用したと注記されています。当社自身の決算期の変更ではありません。
- businessModel: 前期有報との修正再表示チェックは全系列で一致しています。遡及適用は法人税等に関する会計基準の変更によるもので、影響がない旨とあわせてfinancialNotesに記録しました。
- businessModel: 中期経営計画のKPIとして印字された各種の売上比率や開発設計案件の売上高などの数値目標・実績は、比率と目標値のため本文には転記せず、このwarningsにとどめました。
- businessStructure: 事業は報告セグメント注記の名前どおり「アジア」「日本」とし、外部顧客への売上高の大きい順に並べました。「その他」は報告セグメントに含まれない北米の区分のため最後に置きました。
- businessStructure: 金額は千円単位の印字を百万円単位へ切り捨てて転記しました（アジア21,023,768千円、日本15,836,902千円、その他93,950千円）。3区分の外部顧客への売上高の合計は印字された連結売上高と2千円異なりますが、印字の値をそのまま使いました。
- businessStructure: 連結子会社の数は、事業の内容の所有形態別の記述と関係会社の状況の表（その他1社を含む）の数え方が一見異なるため、本文には書きませんでした。
- businessStructure: 関係会社の状況の注記に、連結子会社のTROIS VIETNAM CO.,LTD.が債務超過である旨が印字されています（金額は書きませんでした）。
- businessStructure: 子会社と関連会社の資本金等の金額は書いていません。
- history: 沿革の各行は年月まで印字されていますが、historyの形に月は書けないため年に畳み、月はdescriptionに残しました。
- history: 2026年1月のTROIS TAKAYA ELECTRONICS (THAILAND) CO.,LTD.の子会社化は決算日後の出来事のため、沿革には入れずbusinessModelのneedsReviewに記録しました。
- history: 子会社の設立時の資本金等の金額は書いていません。
- industry: 主たる事業は電子機器メーカー向けの電子部品実装と機構組立の受託加工（EMS）のため、electronics（電機）を主たる業界としました。
- industry: 半導体製造装置は産業機器向けの顧客分野の一つとして印字されるだけで、自社の半導体関連事業として金額が独立開示されていないため、semiconductorsは付けませんでした。部品加工や人材派遣などの国内子会社の事業も金額が独立開示されていないため、業界を足していません。
- relatedCompanies: キヤノン（canon）: キヤノングループへの売上依存度は割合で印字されているため、説明には割合を書いていません。なお特定投資株式のキヤノン株式は当事業年度に全て売却されており、株式の保有は関係の根拠にしていません。
- relatedCompanies: めぶきフィナンシャルグループ（mebuki-financial-group）、三井住友トラストグループ（sumitomo-mitsui-trust-group）、みずほフィナンシャルグループ（mizuho-financial-group）: 特定投資株式の保有目的はいずれも「金融取引の維持・拡大」という共通の定型句で、資金調達の文脈のみのため結んでいません。
- relatedCompanies: 栃木銀行（the-tochigi-bank）: 大株主の状況に載る金融機関ですが、事業会社ではなく、取引や提携の事実が印字されていないため結んでいません。
- relatedCompanies: 日本電子（jeol）: 「日本電子部品実装設備」などの語の部分一致で、日本電子株式会社について述べた箇所はないため結んでいません。
- relatedCompanies: リコー（ricoh）: 「リコール」の部分一致で、株式会社リコーについて述べた箇所はないため結んでいません。
- relatedCompanies: エン（en）、キャリア（career）、イノベーション（innovation）、ベース（base-4481）、パス（path）、レント（rent）、ポート（port）、コロナ（corona）、レイ（ray）: 社名や一般語（キャリアパス、タレントマネジメント、ポートフォリオ、コロナ禍など）の部分一致で、その相手について取引・提携・資本関係を述べた箇所はないため結んでいません。
- relatedCompanies: 住友電子(上海)有限公司と深圳市彩煌英昌科技有限公司: 2020年に合弁会社の設立を伴う業務提携契約を締結した相手ですが、いずれも上場会社ではなくrelated-candidates.jsonにもないため結んでいません。Manutronics Vietnam JSC.も戦略的パートナー契約の相手ですが、未上場で候補にないため結んでいません。
- relatedCompanies: 当社グループの連結子会社と持分法適用関連会社TROIS TAKAYA ELECTRONICS (THAILAND) CO.,LTD.は、当社グループの会社であるため結んでいません。
- terms: 助言: 用語「EMS（エレクトロニクス・マニュファクチャリング・サービス）」は、電子機器の製造を受託するサービスを指し、当社の主たる事業の説明に使われます（経営方針、経営環境及び対処すべき課題等に印字）。
- terms: 助言: 用語「プリント配線基板への電子部品実装」は、電子回路が描かれた基板に電子部品を取り付ける工程を指し、当社グループの中核部門の説明に使われます（事業の内容に印字）。
- terms: 助言: 用語「機構組立」は、実装したプリント配線基板を含めて最終製品や電子モジュールを組み立てる工程を指します（事業の内容に印字）。
- terms: 助言: 用語「セル生産方式」は、携帯用POS端末などの最終製品までの組立に使われる生産方式として印字されています（事業の内容）。

## 要確認（status に反映）

- businessModel: 重要な後発事象：持分法適用関連会社TROIS TAKAYA ELECTRONICS (THAILAND) CO.,LTD.（2025年12月31日現在、議決権の所有割合50％の持分法適用関連会社）は、2025年10月24日開催の取締役会決議と他株主からの同意に基づき、2026年1月1日付で連結子会社及び特定子会社となりました。本登録は2025年12月31日時点の構造（持分法適用関連会社）で行います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
