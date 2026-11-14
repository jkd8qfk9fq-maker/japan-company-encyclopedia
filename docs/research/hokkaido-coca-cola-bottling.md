# 北海道コカ・コーラボトリング — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 北海道コカ・コーラボトリング株式会社 |
| 証券コード | 2573 |
| docID（データを取り出した文書） | `S100XRTE` |
| 原本 docID | `S100XRTE` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRTE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 北海道コカ・コーラボトリング株式会社 / 2573 / docID S100XRTE（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hokkaido-coca-cola-bottling: 10 件の数値を有報XBRLと照合
有報: 北海道コカ・コーラボトリング株式会社 有価証券報告書－第64期(2025/01/01－2025/12/31) (docID S100XRTE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hokkaido-coca-cola-bottling: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の中期的な経営指標として自己資本利益率（ROE）4.0％の達成が有報に印字されているが、利益率にあたるため本文には転記せず、戦略は定性的に要約した。正式な目標はここに記録する。
- businessModel: 証拠パックの注意（本文に財務諸表の組替えの記載がある）については、前期有報との修正再表示チェックが全6系列・各4行で差異ゼロであり、主要な経営指標等への影響は確認できないため、financialNotesにはせずここに記録する。
- businessModel: 証拠パックのsections内に重要な後発事象に該当する記載は確認できなかったため、needsReviewにはしていない。重要な契約等はボトラー契約のみである。
- businessModel: MD&Aに印字された営業利益・経常利益の数値は、本文の財務数値は売上高と純利益のみとする規則により転記していない。
- businessModel: Wikipedia（北海道コカ・コーラボトリング）が見つかったが、有報の記載を超える情報源としては採用せず、情報源は有報のみとした。
- businessStructure: 単一セグメントでセグメント別の外部顧客への売上高が開示されていないため、子事業は【事業の内容】に印字された各社の位置付けに基づく役割分担で構成し、金額は付けていない。MD&Aの生産実績（製造原価ベースで31,749百万円）は売上高ではないため子事業の金額には使わず、industryPositionに集約した。
- businessStructure: グループ構成は2025年12月31日現在で、当社、親会社の大日本印刷株式会社、連結子会社5社である。親会社は印刷事業を営み当社グループの事業には含まれないため、事業には含めずrelatedCompaniesにparentとして記録した。
- history: 沿革の全行は転記せず、設立・上場・事業拡大・グループ再編・市場移行の主要な節目を選んだ。資本金の額は有報に印字がある場合も含め一切転記していない（資本金額はhistoryに書かない規則）。行にmonthキーは付けていない。
- history: 1973年の合併は株式上場を目的とする株式額面変更のためのものであり、沿革の注記に事実上の存続会社は当社である旨が印字されているため、その旨を本文に反映した。
- industry: 東証の業種は食料品であり、飲料の製造・販売事業が単一セグメントで売上高の全額を占めるためfoodを主業種とした。清涼飲料専用の区分は閉じた一覧になく食料品に含まれるため、taxonomyGapsにはしない。運送・自動販売機運営等の付帯業務は独立したセグメントではないため副業種は付けていない。
- relatedCompanies: 株式会社栗林商会は発行済株式（自己株式を除く）の9.48％を保有する大株主だが、related-candidates.jsonの候補に含まれず、上場会社でもないため結んでいない。
- relatedCompanies: ザ コカ・コーラカンパニー及び日本コカ・コーラ株式会社はボトラー契約の相手先だが、候補に含まれないため結ばず、契約の事実はbusinessModelに記録した。
- relatedCompanies: トヨタ自動車（toyota）の候補一致は、MD&Aで札幌市とともに連携が述べられているトヨタ自動車北海道株式会社への言及であり、トヨタ自動車本体との取引・提携の印字ではないため結んでいない。トヨタ自動車北海道はトヨタ自動車とは別の法人である。
- relatedCompanies: その他の候補（port、land、en、slogan、cover、king、seki、vision、zero、base-4481）は汎用語や部分文字列による一致で、取引・提携の印字がないため結んでいない。trustは信託口の名称であり会社ではないため結んでいない。
- relatedCompanies: 連結子会社5社（北海道コカ・コーラリテール＆ベンディング株式会社、北海道コカ・コーラプロダクツ株式会社、幸楽輸送株式会社、北海道サービス株式会社、北海道ベンディング株式会社）は自社グループ会社であるため結んでいない。
- relatedCompanies: 特定投資株式は該当事項がなく（保有は非上場株式のみ）、定型文の保有目的を根拠とする候補は存在しない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の【重要な契約等】【事業の内容】及びMD&Aの記載に基づく助言的な成果物である。

## 要確認（status に反映）

- businessModel: 株式分割：2023年７月１日付で普通株式１株につき２株の割合で株式分割を行った。株式数に関する指標は、第60期の期首に当該分割が行われたと仮定して算定されている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
