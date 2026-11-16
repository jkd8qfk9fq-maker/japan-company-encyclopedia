# 高松機械工業 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 高松機械工業株式会社 |
| 証券コード | 6155 |
| docID（データを取り出した文書） | `S100YOLD` |
| 原本 docID | `S100YHHC` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YOLD／有効文書 S100YOLD（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YOLD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 高松機械工業株式会社 / 6155 / docID S100YHHC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 10 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takamatsu-machinery: 10 件の数値を有報XBRLと照合
有報: 高松機械工業株式会社 訂正有価証券報告書－第65期(2025/04/01－2026/03/31) (docID S100YOLD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第65期(2025/04/01－2026/03/31)、docID S100YOLD）を有効文書としてこのパックを作った。原本は docID S100YHHC。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock・NumberOfSharesHeldOrdinarySharesInformationAboutDirectorsAndCorporateAuditors・NumberOfSharesHeldOrdinarySharesInformationAboutDirectorsAndCorporateAuditorsProposal（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
takamatsu-machinery: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書（S100YOLD）は record-only 分類であり、財務の数値も本文も原本（S100YHHC）と同一で、異なるのは役員等の情報に関する節のみであるため、警告のみとし、出典は訂正報告書とした。
- businessModel: 経営指標等の推移の注記は、潜在株式が存在しないため希薄化後1株当たり当期純利益を記載していない旨と、当期純損失のため株価収益率を記載していない旨の表示事項のみであり、financialNotes に入れる事項はない。
- businessModel: セグメント情報の外部顧客への売上高は、工作機械事業11,215百万円、IT関連製造装置事業1,338百万円、自動車部品加工事業168百万円と印字されており、合計は連結売上高12,722百万円と1百万円異なるが、印字どおり記載した。
- businessModel: MD&Aの利益の金額や増減理由は本文に書かなかった。本文の財務数値は売上高と親会社株主に帰属する当期純損益だけである。
- businessModel: 中期計画2027の定量目標（最終年度の連結売上高・利益率・ROE）は投資指標の目標であるため本文に書かなかった。
- businessModel: 主要な顧客である山下機械株式会社は related-candidates.json にないため関連会社として登録せず、ここに記録する。
- businessModel: 株式会社CCIグループと株式会社三菱UFJフィナンシャル・グループの特定投資株式の保有目的は、主要な取引金融機関の持株会社としての定型的な記載であるため関連会社として登録しなかった。澁谷工業株式会社と福島印刷株式会社の保有目的は両社で同一の定型的な記載であるため登録しなかった。
- businessModel: 大株主の株式会社北國銀行は株式会社CCIグループの子会社であり、異なる法人であるため、持株会社である株式会社CCIグループを代替として登録しなかった。
- businessModel: 株式会社CCIグループが2025年10月1日に行った株式分割は保有先企業のものであり、当社の分割ではないため needsReview には入れなかった。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。重要な契約等も「該当事項はありません」と印字されている。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。個別の仕入先は【事業の内容】に印字されていない。
- businessStructure: 設備の帳簿価額は書かなかった。本社・工場、あさひ工場、第2工場は工作機械事業、開発センターはIT関連製造装置事業、第3工場は自動車部品加工事業に印字されている。本社・工場の行は全社管理業務を含む連記である。
- businessStructure: 第4工場は2025年12月に売却されており、期末現在の設備には含まれていない。
- history: 設立時の資本金額は規則により書かなかった。
- history: 支店・営業所・駐在員事務所の新設、ISO9001・ISO14001の認証取得、第2工場の新設、テクニカルセンター用地の取得と開発センターの新設、喜志高松貿易（杭州）の設立と社名変更、第4工場の新設などの行は登録しなかった。
- industry: 主たる業界は machinery とした。売上高の88.2％を占める工作機械事業はCNC旋盤等の工作機械の製造・販売であり、閉じた分類の machinery に直接当てはまるため、暫定分類は付けず、taxonomy gap も記録しなかった。IT関連製造装置事業と自動車部品加工事業は独立した報告セグメントだが、会社を特徴づける主たる業界は工作機械とした。
- relatedCompanies: 主要な顧客である山下機械株式会社は候補にないため登録しなかった。
- relatedCompanies: 株式会社CCIグループと株式会社三菱UFJフィナンシャル・グループは、主要な取引金融機関の持株会社という定型的な保有目的のみであるため登録しなかった。
- relatedCompanies: 澁谷工業株式会社と福島印刷株式会社は、両社で同一の定型的な保有目的（有力な地元企業の一つ）しか印字されていないため登録しなかった。
- relatedCompanies: 大株主の株式会社北國銀行は候補になく、その親会社である株式会社CCIグループを代替登録しなかった。
- relatedCompanies: vision、base-4481、seki、asahi、cota、land、port、space、career、cover、shibuya は一般語・部分一致等のため登録しなかった（shibuya は澁谷工業の表記ゆれとして候補に出たが、保有目的が定型的なため登録しなかった）。
- terms: 助言のみ。用語の追加提案：CNC旋盤（コンピュータ数値制御により加工を自動化する旋盤。当社の主力製品）、コレットチャック（工作機械で加工対象物や工具を保持するための筒状の治具。当社が製造・販売する周辺装置）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
