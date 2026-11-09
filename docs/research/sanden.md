# サンデン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | サンデン株式会社 |
| 証券コード | 6444 |
| docID（データを取り出した文書） | `S100XUJB` |
| 原本 docID | `S100XUJB` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUJB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | サンデン株式会社 / 6444 / docID S100XUJB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanden: 10 件の数値を有報XBRLと照合
有報: サンデン株式会社 有価証券報告書－第100期(2025/01/01－2025/12/31) (docID S100XUJB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2021-12 の期は 9 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sanden: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替え・遡及適用の記載があるとの注意があったが、修正再表示チェックは重複年度の全行で一致したため、売上高と当期純利益の範囲に変更はないと判断し、financialNotes には追加していない。
- businessModel: 中期経営計画の経常利益90億円の目標値は、利益区分の金額のため本文には書いていない。
- businessModel: 2025年12月期と2026年12月期の配当は無配の予定だが、配当の語は投資の語のため本文には書いていない。
- businessStructure: 報告セグメントは自動車機器事業のみのため、事業の金額は販売実績の印字を使いました。自動車機器事業189,799百万円、その他1,076百万円で、合計は売上高190,875百万円と一致します。
- businessStructure: 製品別の売上高の内訳は印字されていないため、children に金額は書いていません。
- businessStructure: 地域別の売上高の表は抽出された数値と見出しの対応が読み取れないため、本文には使わず、経営者による分析の記載（海外向けの売上高が93％、欧州・中国の売上が約6割）のみを使いました。
- history: 2026年1月の新ビジョン及びミッションの発表は、当期の末日（2025年12月31日）より後の出来事ですが、有報の沿革に印字されているため記載しました。
- history: 1943年の創立の行は、資本金の金額を省いて記載しました。
- history: 沿革は15件に絞り、受賞・表彰・設備の行は落としました。
- industry: 自動車機器事業が売上高のほとんどを占めるため、自動車を主たる業界としました。その他の事業（住宅用給湯・環境機器）は報告セグメントではなく、金額も小さいため業界は付けていません。
- relatedCompanies: career・en・step・seki・port・vision・base-4481・land・core・rent・trust・cota・ray・cover・densan・integral・ricoh・showcase・slogan・witz・zero — いずれも語の断片一致のみで、取引・提携の印字がないため結ばない。
- relatedCompanies: Volkswagen Group — 2025年12月期の売上高28,205百万円の主要な顧客だが、掲載企業リストになく結ばない。
- relatedCompanies: 華域三電汽車空調有限公司 — 持分法適用関連会社で主要な顧客（2025年12月期の売上高14,040百万円）だが、掲載企業リストになく結ばない。
- relatedCompanies: 海信日本オートモーティブエアコンシステムズ合同会社 — 2025年12月31日現在、議決権の73.16％を所有する親会社だが、掲載企業リストになく結ばない。海信家電集団股份有限公司と科龍発展有限公司（間接に73.2％を所有される親会社）も同様に結ばない。
- relatedCompanies: 海信集団控股股份有限公司・青島海信空調有限公司 — その他の関係会社だが、掲載企業リストになく結ばない。
- relatedCompanies: 連結子会社29社と持分法適用関連会社（旭産業・三和コーテックスなど）はすべて非上場のため結ばない。
- terms: 助言: 「ITMS（統合熱マネジメントシステム）」は用語集の登録候補になります。自動車の空調や熱管理を統合したシステムのことです。
- terms: 助言: 「NEV（新エネルギー車）」は用語集の登録候補になります。電気自動車などの新エネルギーを使う車のことです。
- terms: 助言: 「電動コンプレッサー」は用語集の登録候補になります。電動で動くカーエアコン用のコンプレッサーです。
- terms: 助言: 「エコキュート」は用語集の登録候補になります。住宅用の給湯機器です。

## 要確認（status に反映）

- businessModel: 2021年12月期は決算期の変更による9か月の変則決算のため、他年度と期間の長さが異なります。5年間の数値の比較には注意が必要です。
- 財務: 変則決算。2021-12 の期は 9 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
