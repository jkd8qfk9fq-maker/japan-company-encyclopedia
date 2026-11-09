# 三信電気 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三信電気株式会社 |
| 証券コード | 8150 |
| docID（データを取り出した文書） | `S100YCKF` |
| 原本 docID | `S100YCKF` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCKF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三信電気株式会社 / 8150 / docID S100YCKF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanshin-electronics: 10 件の数値を有報XBRLと照合
有報: 三信電気株式会社 有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YCKF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sanshin-electronics: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に財務諸表の組替えの記載がありますが、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため financialNotes は書きませんでした。
- businessModel: Ｖ76中期経営計画の定量目標のうち、経常利益とROEの数値は本文の規則により strategy には書きませんでした。
- businessModel: 本文の財務数値は売上高と当期純利益だけにしました。
- businessModel: 本社移転の予定は needsReview に記録しました。
- businessStructure: 売上高は外部顧客への売上高です。
- businessStructure: 当社グループは当社と子会社12社で構成され、連結子会社は8社、非連結子会社は4社です。
- history: 沿革は15件を選びました。
- industry: 主たる業界は、半導体・電子部品の卸売が主たる事業であることから商社としました。東証の業種分類も卸売業です。
- industry: デバイス事業で半導体の販売を主軸としているため、半導体を2つ目に付けました。
- relatedCompanies: 三井住友フィナンシャル・グループ、三菱ＵＦＪフィナンシャル・グループ、三十三フィナンシャルグループ、三井住友トラストグループは重要な借入先であり、資金調達が理由のため結びませんでした。
- relatedCompanies: ＭＳ＆ＡＤインシュアランスグループホールディングスは重要な保険引受先であり、保険取引が理由のため結びませんでした。
- relatedCompanies: シャープは重要な得意先との印字がありますが、貸借対照表計上額が0百万円のため結びませんでした。
- relatedCompanies: related-candidates.json の断片一致のみの候補（セキ、エン、ポート、アクシス、ビジョン、ベース、コタほか）は結びませんでした。
- relatedCompanies: 連結子会社8社と非連結子会社4社はすべて非上場のため結びませんでした。
- terms: 新たに提案する用語はありません。デバイス事業、ソリューション事業などの事業用語は本文で説明しています。

## 要確認（status に反映）

- businessModel: 2026年4月22日の取締役会で本社の仮移転を決議し、2026年6月5日に定期建物賃貸借契約を締結しました。移転予定先は東京都港区高輪三丁目25番29号のAve.Takanawaで、移転時期は2027年9月（予定）です。本社ビル（東京都港区芝四丁目4番12号）の建て直しのための仮移転で、定款上の本店所在地の変更はありません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
