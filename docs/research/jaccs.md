# ジャックス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジャックス |
| 証券コード | 8584 |
| docID（データを取り出した文書） | `S100YEIM` |
| 原本 docID | `S100YEIM` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEIM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジャックス / 8584 / docID S100YEIM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jaccs: 10 件の数値を有報XBRLと照合
有報: 株式会社ジャックス 有価証券報告書－第95期(2025/04/01－2026/03/31) (docID S100YEIM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
jaccs: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 第92期（2023年3月期）より、金融機関等が保有する貸付金等の債務の保証に係る保証残高を連結貸借対照表に計上せず偶発債務として注記する方法に会計処理を変更し、遡及適用しています。第91期の総資産額と自己資本比率も遡及適用後の値です。5年間の売上高と当期純利益の範囲に変更はなく、修正再表示チェックも全行一致したため、financialNotes には記載しませんでした。
- businessModel: flow の最終段の題名は「利益の確保」ではなく「収益の確保」としました。
- businessStructure: 報告セグメントは地域別の「国内」「海外」の2つで、外部顧客への営業収益の大きい順に並べました。国内・海外の内訳の金額は、MD&Aのセグメント別営業収益の表（セグメント間の内部営業収益は含まない）から取りました。
- businessStructure: 国内の内訳の合計（170,413百万円）と国内セグメントの営業収益（170,415百万円）の2百万円の差、海外の内訳の合計（21,895百万円）と海外セグメントの営業収益（21,897百万円）の2百万円の差は、有報の丸めによるものです。印字の金額をそのまま記載しています。
- businessStructure: 金融収益はセグメント別営業収益の表に独立した行として印字されているため、children に入れました。
- history: 沿革は15件に絞りました。落とした主な行は、1965年の本社移転、1982年のカードローン保証業務の開始、1987年のジャックス・トータル・サービス設立、1999年のジャックス債権回収サービス設立、2016年のフィリピン合弁会社設立、2019年のジェーシービー信用保証事業の承継、2025年5月の Carsome Capital Sdn.Bhd. の持分法適用会社化です。
- history: 登記上の設立年月日は1948年12月23日ですが、これは1976年の合併で形式上の存続会社とした結果によるもので、実際の創業は1954年6月29日のデパート信用販売株式会社の設立です。沿革は創業の1954年から始めました。
- history: 2008年3月の第三者割当増資により三菱東京UFJ銀行の持分法適用会社となったことは、2008年の行の説明に含めました。
- industry: 消費者信用業を主とするため、finance を主たる業界としました。国内と海外の報告セグメントはいずれも消費者信用業で、他の業界を2つ目に付ける根拠はありません。
- relatedCompanies: 三菱UFJ銀行は2026年3月31日現在で当社株式の39.41％を保有する大株主で、その他の関係会社ですが、掲載企業リスト（related-candidates.json）にないため結びませんでした。
- relatedCompanies: 連結子会社7社（ジャックス債権回収サービス、ジャックス・トータル・サービス、ジャックスリース、JACCS International Vietnam Finance、PT JACCS MITRA PINASTHIKA MUSTIKA FINANCE INDONESIA、JACCS MICROFINANCE（CAMBODIA）、JACCS FINANCE PHILIPPINES）と持分法適用会社の Carsome Capital Sdn.Bhd. は、いずれも非上場または海外法人のため、掲載企業リストになく結びませんでした。
- relatedCompanies: dai-ichi-life-holdings、tokio-marine-holdings、ms-and-ad-insurance-group-holdings、sompo-holdings は、資金調達円滑化が保有目的で、金融・保険機関のため結びませんでした（銀行ルール）。
- relatedCompanies: the-keiyo-bank、north-pacific-bank、the-bank-of-toyama、the-first-bank-of-toyama、the-gunma-bank、tsukuba-bank は、資金調達安定化が保有目的のため結びませんでした（銀行ルール）。
- relatedCompanies: t-o-holdings と syla-holdings は、2025年度に全株式を売却し、当事業年度の保有がないため結びませんでした。
- relatedCompanies: seki、port、en、vision、base-4481、land、suzuki-6785、ishin、core、nissin、path、technologies、the-lead、trust、innovation、rhythm、zero は語の断片一致のみのため結びませんでした。
- relatedCompanies: MasterCard, Inc. や VISAインターナショナルなど海外の取引先は、掲載企業リストにないため結びませんでした。
- terms: 新たに提案する用語はありません。クレジット、ペイメント、ファイナンス、家賃保証、集金代行などの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
