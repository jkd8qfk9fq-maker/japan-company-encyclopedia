# エクスモーション — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エクスモーション |
| 証券コード | 4394 |
| docID（データを取り出した文書） | `S100XN3A` |
| 原本 docID | `S100XN3A` |
| 提出日（原本） | 2026-02-25 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XN3A.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エクスモーション / 4394 / docID S100XN3A（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
exmotion: 6 件の数値を有報XBRLと照合
有報: 株式会社エクスモーション 有価証券報告書－第18期(2024/12/01－2025/11/30) (docID S100XN3A)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
exmotion: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記のうち、従業員数の定義（注２）は表示上の事項のため financialNotes には記録しませんでした。
- businessModel: 2018年３月16日付の株式分割（１株につき50株）と2019年６月１日付の株式分割（１株につき２株）は、ストック・オプションの注記に換算後の株式数として現れるのみで、主要な経営指標等の推移の注記に分割の記載がないため、financialNotes にも needsReview にも記録しませんでした。
- businessModel: 経営上の目標の指標（売上総利益率、売上高営業利益率、ROE、増配率など）の数値や目標値は、投資・利益の指標のため本文や perspectives には書いていません。
- businessModel: 受注高・受注残高の金額、セグメント利益に当たる金額、設備の帳簿価額は書いていません。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されています。
- businessStructure: 単一セグメントのため、製品及びサービスごとの情報は「外部顧客への売上高が単一のサービスの区分で90％を超える」として開示が省略されており、子区分に金額は書いていません。
- businessStructure: 主要な顧客として、株式会社ＳＵＢＡＲＵ、トヨタ自動車株式会社が2025年11月期の【関連情報】に、ウーブン・バイ・トヨタ株式会社が2024年11月期の【関連情報】に開示されています（金額は本文に書いていません）。
- businessStructure: 設備の帳簿価額は書いていません。
- businessStructure: Wikipediaの記事がありましたが、冒頭の記述は有報の記載の範囲を超える補足を含まないため使用していません。
- history: 設立時（2008年）の資本金の金額は書いていません。
- history: 2021年のプライバシーマーク認証の取得は、転機に絞るため省きました。
- industry: 主たる業界は、単一セグメントのコンサルティング事業が組込みソフトウェアの開発支援というITサービスであるため、it としました。
- industry: automotive は付けていません。自動車は顧客の業界であり、当社グループ自身の事業はソフトウェア開発のコンサルティングであるためです。
- industry: 閉じた分類で表しきれない事業はないと判断したため、taxonomyGaps は記録していません。
- relatedCompanies: en（エン）: 「エンジニアリング手法」という文言の部分一致のみで、相手についての取引・提携・資本関係の印字がないため結びませんでした。
- relatedCompanies: ray（レイ）: 「CoBrain（コブレイン）」の読みの部分一致のみのため結びませんでした。
- relatedCompanies: innovation（イノベーション）: 「イノベーションを生み出すための活動」という一般的な文言の部分一致のみのため結びませんでした。
- relatedCompanies: seki（セキ）: 「情報セキュリティ」等の一般語の部分一致のみで曖昧なため結びませんでした。
- relatedCompanies: base-4481（ベース）: 「モデルベース開発」という技術用語の部分一致のみのため結びませんでした。
- relatedCompanies: king（キング）: 「ワーキング活動」という文言の部分一致のみのため結びませんでした。
- relatedCompanies: path（パス）: 「BIOSパスワード」という文言の部分一致のみで曖昧なため結びませんでした。
- relatedCompanies: the-lead（リード）: 「日本の産業をリードする自動車分野」という文言の部分一致のみのため結びませんでした。
- relatedCompanies: 候補にない相手: 株式会社ＳＵＢＡＲＵは2025年11月期の最大の主要顧客として【関連情報】に開示されていますが、related-candidates に含まれないため結んでいません。事業構造の顧客には社名を記載しました。
- relatedCompanies: 候補にない相手: ウーブン・バイ・トヨタ株式会社は2024年11月期の主要顧客として開示されていますが、related-candidates に含まれないため結んでいません。
- relatedCompanies: ＧＭＯクリック証券株式会社は【大株主の状況】に載りますが、証券会社であり純投資とみられるため結んでいません。
- relatedCompanies: 政策保有株式は「該当事項はありません」と印字されており、株式の保有状況からの関連付けはありません。
- terms: 助言のみ。用語の追加提案はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
