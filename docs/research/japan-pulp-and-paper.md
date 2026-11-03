# 日本紙パルプ商事 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本紙パルプ商事株式会社 |
| 証券コード | 8032 |
| docID（データを取り出した文書） | `S100YF3W` |
| 原本 docID | `S100YF3W` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF3W.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本紙パルプ商事株式会社 / 8032 / docID S100YF3W（id は英語表記「Japan Pulp &amp; Paper Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
japan-pulp-and-paper: 10 件の数値を有報XBRLと照合
有報: 日本紙パルプ商事株式会社 有価証券報告書－第164期(2025/04/01－2026/03/31) (docID S100YF3W)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
japan-pulp-and-paper: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: profit 段は規則により当期純利益を用いた。経常利益・営業利益・セグメント利益は書いていない。
- businessModel: financialNotes は変則決算・会計基準の変更などがないため書いていない。
- businessModel: products の機能材料製品は国内卸売の説明（エレクトロニクス関連用途）による。
- businessStructure: 事業の並びは【セグメント情報】2026年3月期の外部顧客への売上収益の大きい順（海外卸売338,078／国内卸売193,118／製紙加工51,409／環境原材料20,044／不動産賃貸4,130）。
- businessStructure: 海外卸売の customers は有報に顧客の種類の記載がないため書いていない。
- businessStructure: 段ボール・再生家庭紙の記述は md-and-a.txt の製紙加工の説明による。
- businessStructure: セグメント利益（経常利益ベース）は規則により書いていない。
- history: 沿革の表は崩れておらず、年月と事象が対応して印字されている。
- history: 沿革の全行は載せず、主な出来事に絞った（1944〜46年の統制期、各種の設立・小規模な買収、OVOL日本橋ビル竣工などは省略）。
- history: 2024年は5月の中期経営計画と11月のM&Aを1件にまとめた。
- industry: 売上の大半は国内卸売・海外卸売（紙・板紙の卸売）なので、主たる業界は商社（trading）とした。製紙加工・環境原材料は金額が小さく、業界は足していない。
- relatedCompanies: related-candidates.json が証拠パックに存在せず、同一性を確認できる掲載済み企業の候補がないため、関連企業は結ばなかった。
- relatedCompanies: 王子ホールディングス: 保有株式の表と関連当事者取引の記載はあるが、候補ファイルがなく掲載済みか確認できない。親会社等はなく、前期の主要株主から外れている。結ばない。
- relatedCompanies: TOPPANホールディングス: 国内卸売の顧客の1社と有報は述べるが、候補ファイルがなく同一性を確認できない。結ばない。
- terms: 用語の助言: 板紙、段ボール原紙、白板紙、再生家庭紙、古紙、パルプ、木質バイオマス発電、代理店（紙卸商）の説明があると読みやすい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
