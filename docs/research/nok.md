# NOK — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＮＯＫ株式会社 |
| 証券コード | 7240 |
| docID（データを取り出した文書） | `S100YFWJ` |
| 原本 docID | `S100YFWJ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFWJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＮＯＫ株式会社 / 7240 / docID S100YFWJ（id は英語表記「NOK CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nok: 10 件の数値を有報XBRLと照合
有報: ＮＯＫ株式会社 有価証券報告書－第120期(2025/04/01－2026/03/31) (docID S100YFWJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nok: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「NOK株式会社」が EDINET の提出者名「ＮＯＫ株式会社」と違います
- 確認: [filing-as-subject] relatedCompanies[0].description: 有報を主語にしない（事業や出来事を直接述べ、根拠は出典欄に任せる）（…います（2026年3月31日現在）。有報によると、NOKは同社の製品を購入し、NOK…）

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益は方針により書いていません。
- businessModel: Apple Inc. は有報が主要な顧客として名前と売上高割合14.0%を印字しているため customers に入れました（金額は書いていません）。
- businessModel: イーグル工業との経営統合は2026年10月1日予定で提出後に完了するため『予定』と書き、needsReview に入れました。
- businessStructure: 並びは2026年3月期の外部顧客への売上高の順（シール 367,397、電子部品 345,109、その他 25,926 百万円）。3つとも報告セグメントなので売上順。
- businessStructure: children は作っていません。製品区分ごとの売上高が印字されていないため。
- businessStructure: name は表紙の「ＮＯＫ株式会社」から株式会社を除き半角の NOK にしました（英訳名 NOK CORPORATION に合わせる）。
- businessStructure: セグメント利益は方針により書いていません。
- history: 日付はすべて有報の印字どおり。月は説明文に書いた（year のみ構造化）。
- history: 2026年10月予定のイーグル工業との共同持株会社設立は提出後の予定なので history には入れず、businessModel 側で予定として扱いました。
- industry: 主たる業界はシール事業（売上最大の報告セグメント。主に自動車・建設機械・一般産業機械向け）に合わせ、閉じた分類で最も近い automotive を暫定で選びました。自動車用シール部品という『部品・素材』の区分が無いため taxonomyGaps に記録。
- industry: electronics は電子部品事業が報告セグメントとして開示され、売上の半分近くを占めるため2つ目に付けました。
- industry: semiconductors は付けていません。有報にHDD用製品の記載はありますが、半導体向けの部材・装置を事業として開示していません。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性は掲載済みエントリー eagle-industry（有報の正式名称イーグル工業株式会社、証券コード6486）との照合で確認しました。
- relatedCompanies: フロイデンベルグ・エス・エー（大株主27.01%、技術提携・合弁）は外国の非上場企業で、掲載済み企業ではないため結びません。
- relatedCompanies: メクテック㈱・ユニマテック㈱などの子会社は非上場のため結びません。
- relatedCompanies: NOK持株会・信託銀行・損保・銀行は資金・保険・純投資で、結びません。正和地所㈱（5.45%）は非上場の可能性があり、掲載済みの確認もできないため結びません。
- terms: 用語の追加案: 「オイルシール」（回転する軸から油がもれないようにする部品）、「フレキシブルサーキット（FPC）」（曲げられる回路基板）、「共同株式移転」（複数の会社が新しい持株会社をつくり、その子会社になる手法。既存の holding-company 用語と関連）。
- terms: 既存の term では affiliate / equity-method / consolidated-subsidiary / holding-company が本文のリンクに使えます。

## 要確認（status に反映）

- businessModel: イーグル工業との共同持株会社（NOK Group株式会社）設立は2026年10月1日予定で、有報提出後の予定事項。実施済みかの確認が必要。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] NOK のシール事業（オイルシール・Oリングなど） → 提案: 自動車部品・産業用部品（機械要素部品）。シール製品は自動車だけでなく建設機械・一般産業機械にも使われる部品で、自動車・機械のどちらにも完全には当てはまらない。
