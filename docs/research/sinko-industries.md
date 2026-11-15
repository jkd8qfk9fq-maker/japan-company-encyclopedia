# 新晃工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 新晃工業株式会社 |
| 証券コード | 6458 |
| docID（データを取り出した文書） | `S100Y1I3` |
| 原本 docID | `S100Y1I3` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y1I3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 新晃工業株式会社 / 6458 / docID S100Y1I3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sinko-industries: 10 件の数値を有報XBRLと照合
有報: 新晃工業株式会社 有価証券報告書－第77期(2025/04/01－2026/03/31) (docID S100Y1I3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sinko-industries: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画「move.2027」の経営指標目標として ROE（自己資本利益率）10％以上・PBR（株価純資産倍率）1倍以上が有報に印字されているが、投資指標・利益率にあたるため本文には転記せず、戦略は定性的に要約した。正式な目標値はここに記録する。
- businessModel: 当連結会計年度の自己株式の取得（4,892百万円）と、取得資金の調達手段としての転換社債型新株予約権付社債の発行（2025年4月）は資本政策であり、warningsのみに記録し needsReview にはしない。
- businessModel: 主要な経営指標等の注記は、役員報酬BIP信託・株式付与ESOP信託の自己株式扱い、株式分割、潜在株式の取扱いのみで、会計方針の変更に伴う財務注記にあたる事項はない。前期有報との修正再表示チェックは全系列で差異ゼロであり、financialNotesは空とした。
- businessModel: Wikipedia（新晃工業）が見つかったが、セントラル空調機器の国内シェア等の記述は有報に裏付けがなく、有報を超える情報源としては採用しなかった。情報源は有報のみとした。
- businessStructure: 報告セグメントは地域別（日本・アジア）のため、子事業には報告セグメントを外部顧客への売上高の大きい順（日本51,332百万円、アジア8,006百万円）に並べた。金額はいずれもセグメント注記の外部顧客への売上高である。MD&Aのセグメント業績ではアジアの売上高が内部売上高を含む8,092百万円と印字されているが、内部売上高を含む数値は使わない規則により、セグメント注記の外部売上高8,006百万円を用いた。
- businessStructure: 製品及びサービスごとの情報では、空調機器製造販売事業53,711百万円、ビル管理事業等5,627百万円と印字されている。ビル管理事業等は独立した報告セグメントではないため子事業にはせず、事業の説明と industryPosition に集約した。
- businessStructure: SINKO AIR CONDITIONING(THAILAND)CO.,LTD.は2016年6月に持分法適用関連会社へ移行し、2026年3月に持分法適用関連会社から除外された。期末時点のグループ構成（連結子会社7社、持分法適用関連会社2社）に反映済みのため、needsReviewにはせず沿革とここに記録する。
- businessStructure: セグメント利益は書かない規則により、本文には記載していない。
- history: 沿革の全行は転記せず、設立・主力製品の開始・上場・海外進出・事業拡大・市場移行の主要な節目を選んだ。資本金の額は有報に印字がある場合も含め一切転記していない（資本金額は history に書かない規則）。月は title・description の本文には含めず、行に month キーは付けていない。
- history: SINKO AIR CONDITIONING(THAILAND)CO.,LTD.は2003年12月に完全子会社化、2016年6月に持分法適用関連会社へ移行、2026年3月に持分法適用関連会社から除外された。期末のグループ構成に反映済みのため、沿革の行にはせずここに記録する。
- industry: 東証の業種は機械であり、事業は空気調和機・ファンコイルユニット等の空調機器の製造販売が中核であるため machinery を主業種とした。ビル管理事業等は売上高の1割未満で独立したセグメントでもないため、副業種は付けていない。
- relatedCompanies: 高砂熱学工業株式会社（takasago-thermal-engineering）、ダイダン株式会社（dai-dan）、株式会社朝日工業社（asahi-kogyosha）、川崎設備工業株式会社（kawasaki-setsubi-kogyo）は特定投資株式に印字されているが、4社とも保有目的が「同社は当社売上高の上位30社に入る主要得意先であり、その株式の保有目的は営業上の取引関係等の円滑化による事業基盤の強化であります」という全く同一の定型文であり、個別の提携内容の印字がないため、この定型文のみを根拠には結ばなかった（koa先例）。各社が主要得意先である事実はここに記録する。
- relatedCompanies: 株式会社大氣社も特定投資株式に同一の定型文で印字されているが、related-candidates.json の候補に含まれないため結んでいない。
- relatedCompanies: 株式会社三菱ＵＦＪフィナンシャル・グループ（mitsubishi-ufj-financial-group）と株式会社横浜フィナンシャルグループ（yokohama-financial-group）は保有目的が「主要借入先の株主であり、財務上の取引関係等の円滑化」という同一の定型文で、資金調達上の関係にとどまるため結んでいない。なお株式会社横浜銀行は同グループの銀行本体であり、持株会社とは別の法人である。
- relatedCompanies: その他の候補（seki、en、freee、zero、port、base-4481、career、core、land、no-1、vision、hyper、innovation、path、the-lead、slogan、space、taya、will、nissin）は汎用語や部分文字列による一致で、取引・提携の印字がないため結んでいない。trustは信託口の名称であり、EDINETコード表にも該当がないため結んでいない。
- relatedCompanies: 当社グループの連結子会社・持分法適用関連会社（新晃アトモス、日本ビー・エー・シー、千代田ビル管財、上海新晃空調設備股份有限公司、SINKO AIR CONDITIONING(HONG KONG)LTD.、TAIWAN SINKO KOGYO CO.,LTD.等）は自社グループ会社であるため結んでいない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の【事業の内容】【沿革】の記載に基づく。

## 要確認（status に反映）

- businessModel: 株式分割：2024年12月１日付で普通株式１株につき３株の割合で株式分割を行った。株式数に関する指標は、第73期の期首に当該分割が行われたと仮定して算定されている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
