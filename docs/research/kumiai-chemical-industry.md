# クミアイ化学工業 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | クミアイ化学工業株式会社 |
| 証券コード | 4996 |
| docID（データを取り出した文書） | `S100XH23` |
| 原本 docID | `S100XH23` |
| 提出日（原本） | 2026-01-27 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XH23.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | クミアイ化学工業株式会社 / 4996 / docID S100XH23（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kumiai-chemical-industry: 10 件の数値を有報XBRLと照合
有報: クミアイ化学工業株式会社 有価証券報告書－第77期(2024/11/01－2025/10/31) (docID S100XH23)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kumiai-chemical-industry: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益は、2025年10月期の有報の印字を採りました。
- businessModel: 本文に財務諸表の組替えの記載がありますが、修正再表示チェックで重複年度は全行一致し、売上高・親会社株主に帰属する当期純利益の範囲に変化がないため、financialNotes は書きませんでした。
- businessModel: 中期経営計画の数値目標（売上高・営業利益・自己資本利益率）は、本文の規則により strategy には書きませんでした。
- businessStructure: 事業の並び順は、2025年10月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: その他の区分は報告セグメントに含まれないため最後に置きました。
- history: 沿革は15件としました。採用しなかった出来事は、1958年の日本印刷工業の株式取得、1962年の小牛田工場の設置、1968年の東亜農薬の吸収合併、1974年のブラジル進出、1997年から2003年のISO認証の取得、2006年の清水工場の生産機能休止と2010年の同工場廃止、2012年から2013年の米国・韓国への進出、2016年のタイ進出、2017年のPI Kumiaiの設立とケイ・アイ研究所の吸収合併、2019年のベンスルフロンメチル事業の譲受、2021年のAsiatic Agricultural Industriesの株式取得、2022年のアグリ・コアの株式取得、2023年のGRAの株式取得、2024年のケイアイ情報システムの吸収合併です。
- industry: 主たる業界は、売上高の最も大きい農薬及び農業関連事業から化学としました。
- industry: 化成品事業で半導体材料向けのビスマレイミド類などを開示しているため、半導体を2つ目に付けました。
- industry: 東証の業種分類は化学です。
- relatedCompanies: 全国農業協同組合連合会：その他の関係会社で22.1％を保有され、2025年10月期の売上高26,803百万円の主要な顧客だが、農業協同組合で上場しておらず related-candidates.json にないため結ばない。
- relatedCompanies: FMC Corporation：主要な顧客（2025年10月期の売上高24,365百万円）だが、海外法人で related-candidates.json にないため結ばない。
- relatedCompanies: BASF AGROCHEMICAL PRODUCTS B.V.：主要な顧客（2025年10月期の売上高21,785百万円）だが、海外法人で related-candidates.json にないため結ばない。
- relatedCompanies: 富士紡ホールディングス：同社との直接的な取引はなく、同社グループとの原料購買等の取引のため結ばない。
- relatedCompanies: カネカ：同社との直接的な取引はなく、当社グループとして同社と原料購買等の取引を行うため結ばない。
- relatedCompanies: 連結子会社16社・持分法適用関連会社3社：すべて非上場または海外法人のため結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行・農林中央金庫・共栄火災海上保険・第一生命保険・日本生命保険相互会社：大株主だが、金融機関・保険会社で金融・保険取引が理由のため結ばない。
- relatedCompanies: キャリア、エン、ビジョン、ベース、セキ、コアなどの断片一致の候補：社名の断片一致のみで、取引・提携・資本関係の根拠がないため結ばない。
- terms: 新たに提案する用語はありません。アクシーブ、ディザルタ、エフィーダなどの製品名は本文で説明しています。

## 要確認（status に反映）

- businessModel: ブラジルで2025年11月26日に成立した法律第15270号により、2026年1月1日以降、ブラジルの非居住者に支払われる配当には10％の源泉所得税が課されます。これにより2026年10月期に、ブラジル持分法適用関連会社であるIHARABRAS S.A. INDUSTRIAS QUIMICASの留保利益について繰延税金負債を計上する予定で、金額は精査中です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
