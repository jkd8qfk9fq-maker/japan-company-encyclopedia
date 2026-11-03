# コムシスホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | コムシスホールディングス株式会社 |
| 証券コード | 1721 |
| docID（データを取り出した文書） | `S100YFLP` |
| 原本 docID | `S100YFLP` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFLP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | コムシスホールディングス株式会社 / 1721 / docID S100YFLP（id は英語表記「COMSYS Holdings Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
comsys-holdings: 10 件の数値を有報XBRLと照合
有報: コムシスホールディングス株式会社 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YFLP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
comsys-holdings: 本文の金額 17 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高は前期614,631百万円から630,658百万円に増えた（経営指標等の印字）。増減の理由は MD&A を読まず本文には書いていない。
- businessModel: perspectives（戦略・強み・業界内の位置）は、有報の確認を十分にしていないため省いた。
- businessStructure: 並びはセグメント注記の外部顧客への売上高（2026年3月期）の大きい順。『その他』は報告セグメントに含まれないため最後。
- businessStructure: 各グループの顧客は、有報が名指しした範囲（NTTグループ・NCC）以外は、エリア名と電気通信設備工事の記述から『通信事業者など』と一般化した。
- businessStructure: brief.md の組替えの注意: 前期有報と重複年度は一致しており、本文では扱わなかった。
- history: 2005年1月、2007年4月、2013年2月・7月・10月の事象は、主要な流れを優先して省いた。
- history: significance の一部は、有報の事実（吸収分割後の報告セグメントの内訳など）から読める範囲にとどめた。
- industry: 8つの報告セグメントのうち7つが電気通信設備工事のため建設を主たる業界にした。コムシス情報システムグループはソフトウェア開発等を行う報告セグメントのため IT を2つ目にした。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる掲載済みの候補が無いため、関連企業は結ばなかった。
- relatedCompanies: NTT東日本・NTT西日本: 主要顧客として有報に売上高が印字されているが、候補ファイルに無く上場かどうかも確認できないため結ばなかった。
- relatedCompanies: 連結子会社65社など: いずれも有報提出会社ではなく、掲載済みの上場企業ではないため結ばなかった。
- terms: 用語集への追加候補: 電気通信設備工事、統括事業会社、NCC（NTTグループ以外の通信事業者）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] コムシスホールディングスの主たる事業（電気通信設備工事） → 提案: 情報通信工事（通信インフラ工事）。通信設備の工事を専業とする会社を、建設の中で区別できる区分が無い。
