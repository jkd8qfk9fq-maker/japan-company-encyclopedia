# エンシュウ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | エンシュウ株式会社 |
| 証券コード | 6218 |
| docID（データを取り出した文書） | `S100YKK8` |
| 原本 docID | `S100YKK8` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKK8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | エンシュウ株式会社 / 6218 / docID S100YKK8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
enshu: 10 件の数値を有報XBRLと照合
有報: エンシュウ株式会社 有価証券報告書－第158期(2025/04/01－2026/03/31) (docID S100YKK8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第156期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
enshu: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…Enshu」を策定し、売上高重視から利益額重視への転換を基本方針として、採算…）

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の財務目標（2029年3月期計画の全社売上高250億円、ROE5％等）は投資指標・目標値のため、本文及び戦略の記述には含めず、ここに記録するにとどめた。
- businessModel: 受注高及び受注残高の金額は本文の数値として用いていない。
- businessModel: ヤマハ発動機株式会社への販売高は8,418百万円（総販売実績に対する割合43.8％）と主要な顧客ごとの情報に印字されているが、関連企業の説明文には金額を含めないため、ここに記録するにとどめた。
- businessModel: 本有報の数値は百万円単位で印字されており、本文の金額はその印字どおりとした。
- businessStructure: 前期の窓に訂正有価証券報告書－第156期(2023/04/01－2024/03/31)があるが、当期有報（第158期）の修正再表示チェックでは前期有報と重複する4年度分について売上高・純利益・経常利益・総資産・純資産・従業員数の全てに差異がなく、当期有報自体も訂正有報ではないため、警告のみとした。
- businessStructure: セグメント注記に記載の退職給付に係る費用処理年数の変更（13年から11年）は会計上の見積りの変更であり、セグメント利益への影響は軽微と印字されているため、財務注記ではなく警告のみとした。
- businessStructure: 連結子会社は10社で、そのうちENSHU GmbH（ドイツ、議決権100.0％）は現在清算手続き中である（needsReviewに記録）。
- industry: 工作機械の製造販売と輸送機器部品の受託加工はいずれも機械の製造に属し、閉じた分類の machinery（機械）に直接合うため、主たる業界は machinery のみとした。taxonomyGaps は無い。
- relatedCompanies: 株式会社りそなホールディングス及び株式会社みずほフィナンシャルグループは、特定投資株式の保有目的が当社の資金調達及び金融取引に関する主要な取引先としての関係であり、資金調達関係のため関連企業に含めない。
- relatedCompanies: 豊和工業株式会社は1977年に繊維機械主要機種の営業を譲渡した相手方であり、現在の継続的な取引・提携関係の記載がないため関連企業に含めない（沿革に記録）。
- relatedCompanies: 候補リストのエン、キャリア、セキ、鈴木、ポート、ベース、ビジョン、日工は、いずれも一般語・人名・団体略称（日工は日本工作機械工業会の略称「日工会」）の語の一致であり、当該企業との関係の記載がないため関連企業に含めない。
- relatedCompanies: ヤマハ発動機株式会社は主要な顧客であると同時に大株主（10.24％）でもあるため、最初に根拠づけられる顧客（customer）として登録し、大株主である事実を説明文に明記した。
- terms: 用語の助言のみの工程。フレキシブルトランスファーマシンは、複数の加工ステーション間で被加工物を自動搬送しながら一連の切削加工を行う専用工作機械のライン形態を指す。
- terms: マシニングセンタは、工具を自動交換しながらフライス削り・中ぐり・穴あけ等の複数の切削加工を1台で行う工作機械である。
- terms: ホーニングは、砥石で円筒内面を精密に仕上げる研削加工で、日産自動車株式会社との実施許諾契約の対象技術である。
- terms: SIer＆IoT事業は、エンシュウコネクティッド株式会社が担うシステムインテグレーションサービスを指す社内呼称である。

## 要確認（status に反映）

- businessStructure: 連結子会社のENSHU GmbH（ドイツ）は現在清算手続き中であり、2026年3月31日現在も連結の範囲に含まれています。本登録は2026年3月31日現在の体制に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
