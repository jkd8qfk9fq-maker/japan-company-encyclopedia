# 三井倉庫ホールディングス — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三井倉庫ホールディングス株式会社 |
| 証券コード | 9302 |
| docID（データを取り出した文書） | `S100YEZT` |
| 原本 docID | `S100YEZT` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEZT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三井倉庫ホールディングス株式会社 / 9302 / docID S100YEZT（id は英語表記「MITSUI-SOKO HOLDINGS Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsui-soko-holdings: 10 件の数値を有報XBRLと照合
有報: 三井倉庫ホールディングス株式会社 有価証券報告書－第178期(2025/04/01－2026/03/31) (docID S100YEZT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitsui-soko-holdings: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は【セグメント情報】の外部顧客への営業収益と、5年表の営業収益・親会社株主に帰属する当期純利益の印字値（百万円）。
- businessModel: perspectives（戦略・強み・業界内の位置）は、根拠となる節を読んでいないため省いた。
- businessModel: financialNotes は、変則決算・会計基準の変更の記載がないため空。財務諸表の組替えの記載は前期との重複年度が一致しており、書く事実がない。
- businessStructure: 決算期は表紙のDEIから2026年3月期（第178期、12か月）。連結決算。修正再表示なし。brief.md に財務諸表の組替えの記載の注意があるが、前期との重複年度は全て一致していた。
- businessStructure: 並び順: 外部顧客への営業収益の大きい順（物流事業291,963百万円、不動産事業7,509百万円。計299,472百万円は連結と一致）。どちらも報告セグメント。
- businessStructure: 物流事業の子区分（倉庫・港湾・航空など）は、金額が独立して開示されていないため children にしなかった。
- businessStructure: listings: 表紙が「東京証券取引所プライム市場」と印字しているため market をプライムとした。
- businessStructure: 子会社数: 事業の内容は子会社74社・関連会社6社、うち連結子会社73社・持分法適用関連会社3社。本文では使っていない。
- businessStructure: 関係会社の状況の連結子会社のうち、不動産事業に区分された会社は表に載っていない（その他55社は区分不明）。そのため不動産事業の担当会社は書かなかった。
- history: 沿革は表が崩れず、年月と事象は対応していた。重要な出来事だけを12件選び、小さな子会社の設立や本店移転の一部は省いた。
- history: 2026年2月の三井不動産との資本業務提携は、契約の内容（出資の有無・比率など）が沿革欄にしかなく、他の節で確認できなかったため、締結の事実だけを書いた。
- industry: 主たる業界は、営業収益の大部分を占める報告セグメント「物流事業」（外部顧客への営業収益291,963百万円）から運輸。物流・倉庫専用の区分はなく、最も近い運輸を選んだ。
- industry: 不動産事業は報告セグメントとして外部顧客への営業収益（7,509百万円）が開示されているため、2つ目に不動産を付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる候補がないため、結んだ相手はない。
- relatedCompanies: 三井不動産: 沿革に2026年2月の資本業務提携契約の締結だけが印字され、出資・取引の内容や持株比率の記載が他の節にない。保有株式の表にも、退職給付信託の株式として載るだけ（議決権行使の指図権限を持つ）で、取引関係ではない。迷ったため結ばない。
- relatedCompanies: 子会社・関連会社（三井倉庫㈱など）: 上場会社でないか、候補で確認できないため結ばない。
- relatedCompanies: 大株主の変更報告書（野村證券、日本生命、三井住友銀行、3Dインベストメント・パートナーズなど）: 金融機関・投資ファンドの純投資で、2026年3月31日現在の実質所有は確認できないと有報が記しているため結ばない。
- terms: 用語解説の追加を勧めるもの: 3PL（物流の一括請負）、複合一貫輸送、持株会社。ページ内では3PLをかっこ書きで短く説明した。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 三井倉庫ホールディングスの物流事業（倉庫・港湾・3PL） → 提案: logistics（物流・倉庫）。倉庫保管や3PLが中心で、運輸の区分では言い表しにくいため。
