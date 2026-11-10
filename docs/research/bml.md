# ビー・エム・エル — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ビー・エム・エル |
| 証券コード | 4694 |
| docID（データを取り出した文書） | `S100YFSM` |
| 原本 docID | `S100YFSM` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFSM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ビー・エム・エル / 4694 / docID S100YFSM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bml: 10 件の数値を有報XBRLと照合
有報: 株式会社ビー・エム・エル 有価証券報告書－第71期(2025/04/01－2026/03/31) (docID S100YFSM)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":179200000000,"latestFiling":183162000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":168943000000,"latestFiling":172732000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":170991000000,"latestFiling":176384000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":177507000000,"latestFiling":182873000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
bml: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益の増減率はMD&Aの印字どおりです。営業利益・経常利益の金額は本文に書きません。
- businessModel: 第9次中期経営計画の数値目標（連結売上高営業利益率・連結自己資本利益率）は投資の語を含むため記載しません。
- businessStructure: 事業の金額はMD&Aの販売実績によります。セグメント注記には報告セグメントごとの金額の記載がありません。
- businessStructure: 検査事業の販売実績は、臨床検査事業と食品衛生事業を合わせた検査事業小計の金額です。
- businessStructure: その他事業の内訳（治験実施医療機関支援業務、調剤薬局事業）に金額の開示はないため、金額を記載していません。
- industry: 主たる業界は医薬品（pharmaceuticals）を暫定としました。臨床検査の受託が事業の中心で、医薬品の製造・販売は行っていないため、taxonomyGapsに記載しました。
- relatedCompanies: 結ばなかった候補（en）：「エン」は本文の語句の一致で、エン株式会社との取引・提携・資本関係の記述はありません。
- relatedCompanies: 結ばなかった候補（career）：「キャリア」は従業員のキャリア形成の記述の語で、株式会社キャリアとの関係ではありません。
- relatedCompanies: 結ばなかった候補（karula）：「カルラ」は「メディカルラボラトリー」の語句の一致で、カルラ株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（nissin）：「日新」は新株予約権の記述の語で、日新株式会社との関係ではなく、上場の確認もできません。
- relatedCompanies: 結ばなかった候補（linical）：「リニカル」は「ジャパンクリニカルサービス」の語句の一致で、リニカル株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（port）：「ポート」は「事業ポートフォリオ」の語で、ポート株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（seki）：「セキ」は「情報セキュリティ」などの語で、セキ株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（zero）：「ゼロ」は残存価額をゼロとする定額法の記述の語で、ゼロ株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（core）：「コア」は「エンゲージメントスコア」の語句の一致で、コア株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（lintec）：リンテックの検査部門は2012年に吸収分割で承継した過去一度限りの取引で、現在の取引・提携・資本関係の記述はありません。
- relatedCompanies: 結ばなかった候補（sapporo-clinical-laboratory）：2026年2月16日付で上場廃止となり、特定投資株式の表から除外されており、現在の関係の記述はありません。
- relatedCompanies: 結ばなかった候補（trust）：「トラスト」は「日本マスタートラスト信託銀行」の語で、トラスト株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（ain-holdings）：保有目的は「業界を通じた情報収集のため」のみで、取引・提携の記述はありません。
- relatedCompanies: 結ばなかった候補（h-u-group-holdings）：保有目的は定型句「受託臨床検査業界における取引先であり、関係維持のため」のみで、業務提携等の具体的な記述はありません。
- relatedCompanies: 結ばなかった候補（mitsubishi-corporation）：2007年の合弁による中間持株会社の設立は過去の出来事で、同社は2025年9月に当社へ吸収合併されており、現在の取引・提携・資本関係の記述はありません。
- relatedCompanies: 結ばなかった候補（phc-holdings）：保有目的は定型句「受託臨床検査業界における取引先であり、関係維持のため」のみで、業務提携等の具体的な記述はありません。
- relatedCompanies: 結ばなかった候補（ray）：「レイ」は「リプレイス需要」の語句の一致で、レイ株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（resona-holdings）：売却済みで、現在の関係の記述はありません。
- relatedCompanies: 結ばなかった候補（s-t）：「エステー」は「エステート興業」の語句の一致で、エステー株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（shinto）：「新東」は「新東京ラボ」などの語句の一致で、新東株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（sumitomo-mitsui-financial-group）：売却済みで、資金調達が理由の金融機関の保有は結びません。
- relatedCompanies: 結ばなかった候補（taya）：「田谷」は大株主の氏名の語句の一致で、田谷株式会社との関係ではありません。
- relatedCompanies: 結ばなかった候補（vision）：「ビジョン」は「グループビジョン」の語で、ビジョン株式会社との関係ではありません。
- relatedCompanies: 非上場の連結子会社16社と非連結子会社・関連会社は、上場企業ではないため結びません。
- terms: 用語の助言はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ビー・エム・エルの主たる業界 → 提案: healthcare。臨床検査の受託が事業の中心で、医薬品の製造・販売は行っていません。閉じた分類に医療・ヘルスケアの区分がありません。
