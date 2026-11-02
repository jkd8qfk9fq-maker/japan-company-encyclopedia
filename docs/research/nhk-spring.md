# 日本発条 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本発條株式会社 |
| 証券コード | 5991 |
| docID（データを取り出した文書） | `S100YD4O` |
| 原本 docID | `S100YD4O` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD4O.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本発條株式会社 / 5991 / docID S100YD4O（id は英語表記「NHK SPRING CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nhk-spring: 10 件の数値を有報XBRLと照合
有報: 日本発條株式会社 有価証券報告書－第106期(2025/04/01－2026/03/31) (docID S100YD4O)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nhk-spring: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「日本発条株式会社」が EDINET の提出者名「日本発條株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空。brief.md の財務諸表の組替えの注意は、修正再表示チェックで前期有報との重複年度が全て一致したため、5年の数値の連続性に影響しないと判断した。
- businessModel: 利益の本文は当期純利益のみ。経常利益・営業利益・セグメント利益は書いていない。減損損失の金額も書いていない。
- businessModel: 目標経営指標（ROE・配当性向など）と2026年度予想は投資の語・予想にあたるため書いていない。
- businessStructure: 並び順は【セグメント情報等】の2026年3月期の外部顧客への売上高の大きい順（シート292,561、懸架ばね167,417、DDS126,753、産業機器ほか124,535、精密部品105,612）。報告セグメントに含まれない区分はない。
- businessStructure: セグメント利益は書いていない（営業利益ベースのため）。
- history: 沿革は約130行あるため、事業の広がりを示す主な出来事に絞った。2005年4月・5月の2行は表のセルが連なって崩れているため、使っていない。
- industry: 主たる業界は、売上高が最大のシート事業と懸架ばね事業が自動車部品であるため automotive。
- industry: 半導体は、DDS事業の半導体検査用プローブユニットと産業機器ほか事業の半導体プロセス部品を製品として開示しているため2つ目に付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業の候補がないため、関連企業は結んでいない。
- relatedCompanies: 【関係会社の状況】の子会社・関連会社（日発販売、横浜機工、日発精密工業、フォルシア・ニッパツなど）は、掲載済みの上場企業として確認できる候補ではないため結んでいない。
- terms: 用語の新規追加の助言: 「懸架ばね」（車体を支え乗り心地を整えるばね）、「スタビライザ」、「DDS（ディスクドライブサスペンション）」、「モーターコア」は、読者に説明が要る専門語。既存の用語に無ければ追加を検討できる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
