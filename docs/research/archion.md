# ARCHION — research log

Registered: 2026-11-25（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＡＲＣＨＩＯＮ株式会社 |
| 証券コード | 543A |
| docID（データを取り出した文書） | `S100YK16` |
| 原本 docID | `S100YK16` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-23 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK16.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＡＲＣＨＩＯＮ株式会社 / 543A / docID S100YK16（id は英語表記「ARCHION Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 0 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
archion: 1 件の数値を有報XBRLと照合
有報: ＡＲＣＨＩＯＮ株式会社 有価証券報告書－第1期(2025/06/02－2026/03/31) (docID S100YK16)
利益・総資産・純資産・従業員数: 3 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
archion: 本文の金額 1 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「ARCHION株式会社」が EDINET の提出者名「ＡＲＣＨＩＯＮ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 収益の内訳は有報に印字されていないため、revenueSources は事業の内容に書かれた経営管理の記述をもとにした
- businessModel: 従業員数が５年表に印字されていないため、人数は書いていない
- businessModel: perspectives は、設立初年度で事業活動の実績がないため省いた
- businessStructure: グループの事業は子会社が行うため、事業の children は主要な連結子会社２社にした
- businessStructure: 2026年３月期は実質的な事業活動がないため、事業別の金額は書いていない
- history: 日野自動車と三菱ふそうの沿革は有報に参考情報として載っているが、両社自身の歴史であり当社の沿革ではないため含めていない
- relatedCompanies: 日野自動車株式会社（2026年４月１日時点で連結子会社、議決権の所有割合100.0％）は、候補一覧（related-candidates.json）がパックに無く同一性を確認できないため結ばなかった
- relatedCompanies: 三菱ふそうトラック・バス株式会社（2026年４月１日時点で連結子会社、議決権の所有割合100.0％）は未上場のため結ばなかった
- relatedCompanies: トヨタ自動車株式会社（2026年４月１日時点でその他の関係会社、議決権の被所有割合37.46％）は、候補一覧がパックに無く同一性を確認できないため結ばなかった
- relatedCompanies: Daimler Truck AG（2026年４月１日時点でその他の関係会社、議決権の被所有割合44.26％）は、候補一覧がパックに無く同一性を確認できないため結ばなかった
- terms: 用語の助言のみの工程のため data は空。株式交換・株式交付などの用語はの用語解説で読めるため、リンク記法は使っていない

## 要確認（status に反映）

- businessModel: 営業収益が主要な経営指標等の推移で「－」のため、財務の売上はnullとしています。売上が空欄である取扱いには人の確認が必要です
- businessModel: 経営統合の完了と持株会社体制への移行は決算日後の2026年４月１日の事項で、有報の提出日（2026年６月25日）時点では完了した事実として記載されています

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
