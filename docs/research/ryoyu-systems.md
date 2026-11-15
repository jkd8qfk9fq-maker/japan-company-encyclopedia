# 菱友システムズ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社菱友システムズ |
| 証券コード | 4685 |
| docID（データを取り出した文書） | `S100YH80` |
| 原本 docID | `S100YH80` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH80.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社菱友システムズ / 4685 / docID S100YH80（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ryoyu-systems: 10 件の数値を有報XBRLと照合
有報: 株式会社菱友システムズ 有価証券報告書－第58期(2025/04/01－2026/03/31) (docID S100YH80)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ryoyu-systems: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益の金額は、連結経営指標等の表に百万円単位で印字された値をそのまま記載した。MD&Aでは億単位の表記（432億29百万円等）でも印字されているが、表の百万円表記に統一した。
- businessModel: 翌連結会計年度の業績予想として印字された金額は将来の予想であるため、本文には記載していない。
- businessModel: 中期経営計画の注力項目のうち業務運営体制の強化の記述に、パートナー企業との関係強化による外部リソースの確保が印字されているため、調達先としてパートナー企業を一般名詞で記載した。個別の協力先の社名は印字されていないため記載していない。
- businessModel: 株式分割は当期中に実施され経営指標等の注記に算定方法が印字されているため、financialNotesに記録した。修正再表示や変則決算はなく、summaryのirregularPeriodsは空である。
- businessStructure: 報告セグメントは情報サービスの単一セグメントであり、セグメント情報の記載自体が省略されている。子区分として並べた4項目は報告セグメントではなく、事業の内容に印字された情報サービスの内訳であり、項目ごとの売上高は独立して開示されていないため金額は記載していない。
- businessStructure: 連結子会社は株式会社菱友システム技術、株式会社菱友システムビジネス、株式会社菱友システムサービスの3社であり、自社グループの会社であるため関連企業には結んでいない。各子会社の資本金の金額は本文に記載していない。
- businessStructure: 主要な顧客である三菱重工業株式会社への売上高は、主要な顧客ごとの情報に26,432百万円と印字されている。関連企業の説明には金額を書かないため、この金額は事業構造と視点の記述でのみ用いた。
- history: 沿革の末尾は2022年4月の市場移行の行と2026年2月の株式会社網屋との資本業務提携契約締結の行が続けて印字され年月と事象が崩れているが、網屋との契約は重要な契約等に2026年2月12日締結と印字され、市場移行は2022年4月の見直しとして対応づけられるため、両行を分けて記載した。
- history: 設立時や子会社設立時の資本金の金額は、記載が禁じられた金額に当たるため沿革には記載していない。
- history: 1989年5月の行は、株式会社第一ソフテックからのシステム開発事業の譲受と株式会社新生社ソフテックからのデータエントリ事業の譲受が1行に続けて印字されているため、1件にまとめた。
- industry: 主たる業界は it とした。同社は情報サービスの単一セグメントの情報サービス事業者であり、閉じた集合の it が実態に合う。副次業界は付けていない。
- relatedCompanies: セキ（seki、7857）は「セキュリティ」などの語の一致による誤検出で、会社としての記載はないため関連付けしなかった。
- relatedCompanies: キャリア（career、6198）は「キャリア選択」などの一般名詞の一致による誤検出のため関連付けしなかった。
- relatedCompanies: エン（en、4849）は「データエントリ」などの語の一致による誤検出のため関連付けしなかった。
- relatedCompanies: ベース（base-4481、4481）は「連結ベース」などの一般名詞の一致による誤検出のため関連付けしなかった。
- relatedCompanies: パス（path、3840）は「モデルキャリアパス」などの語の一致による誤検出のため関連付けしなかった。
- relatedCompanies: リード（the-lead、6982）は「成長をリードする」などの語の一致による誤検出のため関連付けしなかった。
- relatedCompanies: ゼロ（zero、9028）は「使用価値をゼロとして評価」などの語の一致による誤検出のため関連付けしなかった。
- relatedCompanies: サンデー（sunday、7450）は沿革の「株式会社サンデータサービス」の名称の一致による誤検出で、株式会社サンデーとは別法人のため関連付けしなかった。
- relatedCompanies: 光通信（hikari-tsushin、9435）は大株主等の記載に現れる投資事業有限責任組合の名称の一部としての一致で、同社自体との取引・提携の記載はないため関連付けしなかった。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ（mitsubishi-ufj-financial-group、8306）は特定投資株式の表に載るのみで、保有目的は金融取引における関係の維持・強化という資金・金融取引の定型的な理由であるため関連付けしなかった。
- relatedCompanies: 三菱電機（mitsubishi-electric、6503）は特定投資株式を当事業年度に全株式売却しており、現在は保有しておらず、それ以外の取引の個別記載もないため関連付けしなかった。
- relatedCompanies: 三菱自動車工業（mitsubishi-motors、7211）は特定投資株式を当事業年度に全株式売却しており、現在は保有しておらず、それ以外の取引の個別記載もないため関連付けしなかった。
- relatedCompanies: 自社グループの連結子会社3社（株式会社菱友システム技術、株式会社菱友システムビジネス、株式会社菱友システムサービス）は関連付けの対象としていない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
