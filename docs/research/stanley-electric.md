# スタンレー電気 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | スタンレー電気株式会社 |
| 証券コード | 6923 |
| docID（データを取り出した文書） | `S100YERJ` |
| 原本 docID | `S100YERJ` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YERJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | スタンレー電気株式会社 / 6923 / docID S100YERJ（id は英語表記「Stanley Electric Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
stanley-electric: 10 件の数値を有報XBRLと照合
有報: スタンレー電気株式会社 有価証券報告書－第121期(2025/04/01－2026/03/31) (docID S100YERJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
stanley-electric: 本文の金額 0 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務の本文は売上高・当期純利益の前期比の増減率だけにした。財務諸表の組替えの記載は修正再表示なしのため basis は書いていない。
- businessStructure: 並びはセグメント注記の外部顧客への売上高の順（自動車機器 > 電子応用製品 > コンポーネンツ）。『その他』は報告セグメントに含まれない区分なので最後。
- businessStructure: 各事業の金額・利益は本文に書かず、前期比の増減率（MD&A印字）だけを使った。
- businessStructure: 「その他」の外部顧客への売上高は表で4百万円と印字されているが、金額は書かず『ごくわずか』とした。
- history: 2007年8月・2009年10月の行は事象が混在して崩れていたため、使っていない。
- history: 2024年の行には2023年12月の設立を含めてまとめた。
- industry: 売上の大半を占める自動車機器事業で automotive を主とした。電子デバイス（LED・液晶）は電機寄りだが金額上は小さいため業界は足していない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業の中での同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: 本田技研工業: 大株主（2026年3月31日現在13.62％）で資本業務提携あり。候補ファイルが無く掲載済みか確認できないため見送り。掲載済みなら major-shareholder で結べる。
- relatedCompanies: 三菱電機（三菱電機モビリティ）: 合弁会社の相手。候補ファイルが無く、三菱電機モビリティは上場会社として確認できないため見送り。
- relatedCompanies: 岩崎電気: 2026年4月23日に子会社化したが、提出後の事象で有報の関係会社の状況には載らず、候補にも無いため見送り。
- terms: 用語集への追加候補: LED（発光ダイオード）、バックライト、車載ランプシステム、ECU（電子制御ユニット）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
