# ＦＵＪＩ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＦＵＪＩ |
| 証券コード | 6134 |
| docID（データを取り出した文書） | `S100YKAW` |
| 原本 docID | `S100YKAW` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKAW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＦＵＪＩ / 6134 / docID S100YKAW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fuji: 10 件の数値を有報XBRLと照合
有報: 株式会社ＦＵＪＩ 有価証券報告書－第80期(2025/04/01－2026/03/31) (docID S100YKAW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fuji: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社FUJI」が EDINET の提出者名「株式会社ＦＵＪＩ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 表示方法の変更の注記は、収益の地域別分解における「タイ」の独立掲記と「米国」の「北米」への統合のみで、売上高と当期純利益の範囲に変更はなく、修正再表示チェックも全行一致したため、financialNotesには書きませんでした。
- businessModel: 中期経営計画の数値目標のうち、営業利益とＲＯＥの目標値は文章規則により省き、売上高の目標値のみ記載しました。
- businessStructure: 事業はセグメント注記の外部顧客への売上高の大きい順に並べました。セグメント利益は書きません。
- businessStructure: その他事業は報告セグメントに含まれないため最後に配置し、金額の内訳が印字されていない区分には金額を書きませんでした。
- history: 沿革の2018年の行は年月が2つ続けて印字され事象文と分かれている崩れた表のため、年月と事象の数が同じであることから行順で対応づけました（2018年4月が商号変更、2018年8月がファスフォードテクノロジの買収）。
- history: 2026年4月の名古屋市科学館のネーミングライツ取得は、決算期末より後の出来事ですが、有報の沿革に印字されているため記載しました。
- industry: 東京証券取引所の業種分類でも機械に属し、ロボットソリューション事業とマシンツール事業が主たる事業のため、machinery を主たる業界としました。半導体製造装置やダイボンダを事業として開示しているため、semiconductors を2つ目に付けました。
- relatedCompanies: fuji-8278：有報の「フジ」は自社や子会社名の断片のみで、上場の株式会社フジとの取引・提携の印字がないため結びませんでした。
- relatedCompanies: ＣＫＤ、ＥＩＺＯ、ＫＯＡ：特定投資株式の表に取引の向きの印字がありますが、related-candidates.json にないため結びませんでした。
- relatedCompanies: 住友不動産：当社事業に関連した総合的な不動産取引のみで、取引先としての関係の印字がないため結びませんでした。
- relatedCompanies: 名古屋銀行、あいちフィナンシャルグループ、大垣共立銀行：特定融資枠契約の貸付人で、金融取引のみのため結びませんでした（銀行ルール）。
- relatedCompanies: Ｔ＆Ｄホールディングス：保険取引の円滑化のみのため結びませんでした。
- relatedCompanies: 名古屋電機工業：資本関係上のパートナーシップと地域振興のみで、具体的な取引・提携の印字がないため結びませんでした。
- relatedCompanies: マキタ、朝日インテック、東京窯業：当事業年度に全株式を売却済みのため結びませんでした。
- relatedCompanies: アメリカンテック カンパニーリミテッド（中国）：主要な顧客（2026年3月期の売上高217億16百万円・12.0％）ですが、海外法人で掲載企業リストにないため結びませんでした。
- relatedCompanies: 大株主の三菱ＵＦＪ銀行と大同生命保険は金融機関、信託銀行2行は信託口、ＦＵＪＩ取引先持株会は持株会のため結びませんでした。
- relatedCompanies: 連結子会社18社はすべて非上場または海外法人のため結びませんでした。
- relatedCompanies: ray、port、career、base-4481、freee、kel、no-1、seki、cota、land、en、innovation、ishin、path、friendly、kohsoku、lec、rix、step、trust、vision、will：語の断片一致のみのため結びませんでした。
- terms: 新たに提案する用語はありません。電子部品実装ロボットや半導体製造装置などの事業名は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
