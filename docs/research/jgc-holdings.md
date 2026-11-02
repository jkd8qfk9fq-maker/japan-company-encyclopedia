# 日揮ホールディングス — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日揮ホールディングス株式会社 |
| 証券コード | 1963 |
| docID（データを取り出した文書） | `S100YEFQ` |
| 原本 docID | `S100YEFQ` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEFQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日揮ホールディングス株式会社 / 1963 / docID S100YEFQ（id は英語表記「JGC HOLDINGS CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jgc-holdings: 10 件の数値を有報XBRLと照合
有報: 日揮ホールディングス株式会社 有価証券報告書－第130期(2025/04/01－2026/03/31) (docID S100YEFQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
jgc-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [filing-as-subject] financials[4].note: 有報を主語にしない（事業や出来事を直接述べ、根拠は出典欄に任せる）（…有報は、中東での武力衝突によるプロジェクト…）

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives は省略。
- businessModel: financialNotes は有報の説明に沿った事実のみ。
- businessStructure: 事業は外部顧客への売上高の大きい順（679,588 / 56,995 / その他8,696百万円）。その他は報告セグメントに含まれないため最後。
- businessStructure: 子会社数・関連会社数は本文に載せていない（事業の内容の印字は子会社58社・関連会社45社）。
- history: 本店移転・許認可登録・研究所の設置と統合などの事務的な行は省いた。「significance」の「バイオ」関連の説明は、研究開発活動の節（微生物を活用したものづくり）による。
- industry: 主たる業界は売上の大半（約91％）を占める総合エンジニアリング事業のEPCで、建設。プラント建設の専用区分は無いため暫定。
- industry: 機能材製造事業は触媒・素材を開示しており化学。半導体・FPD製造装置用セラミックス部品などを事業として開示しているため半導体も付けた。
- relatedCompanies: related-candidates.json が証拠パックに無かった。同一性は有報の印字名と、掲載済みエントリー（takada=株式会社高田工業所1966、mitsubishi-gas-chemical=三菱瓦斯化学株式会社4182）の正式名称の一致で確認した。
- relatedCompanies: インフロニア・ホールディングス: 水ing株式の譲渡先で、2026年4月14日に契約。当社との継続的な関係ではなく、完了も未確認のため結ばない。
- relatedCompanies: 日揮ユニバーサル・水ing・日揮グローバル等: 掲載済みの上場企業ではないため結ばない（子会社は上場でない）。
- relatedCompanies: IHIプラント: 医薬品事業の譲受の相手だが、掲載済みの上場企業と確認できず、過去の取引のため結ばない。
- relatedCompanies: 政策保有株式のその他の銘柄: 取引関係の記載が個別に確認できないため結ばない。
- terms: 用語の追加提案: EPC（設計・調達・建設を一括して請け負う契約形態）、LNG（液化天然ガス）、FCC触媒（石油精製で重質油を分解する触媒）、持株会社。既存の用語集に無ければ追加を検討。

## 要確認（status に反映）

- businessStructure: 水ing㈱の株式譲渡は2026年4月14日に契約済みで、有報提出（2026年6月19日）時点の完了有無は有報から分からない。その他の事業の説明は契約の事実だけを書いた。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 日揮ホールディングスの主たる業界 → 提案: プラントエンジニアリング（EPC）。石油・ガス・化学プラントを設計・調達・建設するEPCが売上の大半で、建設や機械では言い切れない。
