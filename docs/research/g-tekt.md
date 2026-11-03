# ジーテクト — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジーテクト |
| 証券コード | 5970 |
| docID（データを取り出した文書） | `S100YIKX` |
| 原本 docID | `S100YIKX` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIKX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジーテクト / 5970 / docID S100YIKX（id は英語表記「G-TEKT CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 8 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
g-tekt: 10 件の数値を有報XBRLと照合
有報: 株式会社ジーテクト 有価証券報告書－第15期(2025/04/01－2026/03/31) (docID S100YIKX)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第14期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第9期(2019/04/01－2020/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第10期(2020/04/01－2021/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第12期(2022/04/01－2023/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第11期(2021/04/01－2022/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第13期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
g-tekt: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: businessModel.description は100文字以内・句点1つ。
- businessModel: financialNotes は特記すべき変則決算・会計基準変更がないため空。表示方法の変更（地域別売上高のタイの扱い）は本文に影響しないため省いた。
- businessModel: perspectives は省いた（有報の印字を超える合算割合を避けるため）。
- businessStructure: 報告セグメントは地域別6つ。順序は2026年3月期の外部顧客への売上高の大きい順（北米126,657／日本59,253／中国52,934／アジア40,049／欧州36,264／南米18,254）。
- businessStructure: セグメント利益・営業利益は本文に書かない方針のため省いた。
- businessStructure: 主要顧客の欄の北米の顧客名は、顧客別情報（関連するセグメント名が北米）の印字による。
- history: 沿革は11件に絞った。清算・商号変更・小規模な子会社設立などは省いた。
- history: 1952年・1953年の設立は会社名付きの行を有報の印字どおりに採った。
- industry: 全報告セグメントが自動車用部品の製造・販売のため automotive のみ。
- relatedCompanies: 本田技研工業（その他の関係会社、被所有20.8％）：関係性は有報に明記されているが、証拠パックに related-candidates.json が無く、掲載済み企業としての同一性を確認できないため結ばなかった。候補ファイルが用意されれば other-affiliated-company で追加できる。
- relatedCompanies: 連結子会社19社と持分法適用関連会社1社は非上場の海外現地法人であり、結ばなかった。
- terms: 用語の助言: 「プレス部品」「金型」「治工具」「車体（ボディ）部品」は初学者に説明が要る語。用語集に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
