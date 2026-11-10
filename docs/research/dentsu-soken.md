# 電通総研 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社電通総研 |
| 証券コード | 4812 |
| docID（データを取り出した文書） | `S100XRJK` |
| 原本 docID | `S100XRJK` |
| 提出日（原本） | 2026-03-18 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRJK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社電通総研 / 4812 / docID S100XRJK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 6 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dentsu-soken: 10 件の数値を有報XBRLと照合
有報: 株式会社電通総研 有価証券報告書－第51期(2025/01/01－2025/12/31) (docID S100XRJK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第49期(2023/01/01－2023/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第50期(2024/01/01－2024/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
dentsu-soken: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: セグメントの事業区分を変更し、前連結会計年度のセグメント情報は変更後の区分に組み替えた数値を記載しているが、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotes には記載していない。
- businessModel: 中期経営計画の定量目標の数値は、本文の規則により strategy には書きませんでした。
- businessStructure: 事業の並び順は、2025年12月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: 報告セグメントの外部顧客への売上高の合計は164,864百万円となり、印字の合計164,865百万円と1百万円ずれますが、有報の丸めによるもので、各セグメントの印字どおりに記載しました。
- businessStructure: 報告セグメントごとの製品・サービスの内訳は有報に印字されていないため、businesses には products を付けていません。6つのサービス品目は事業全体のもので、businessModel に記載しました。
- businessStructure: 2026年1月1日付で普通株式1株につき3株の割合で株式分割を行った（重要な後発事象）。1株当たり数値のみのため注記していない。
- businessStructure: 2026年1月1日付で、完全子会社の電通総研セキュアソリューションを存続会社、電通総研ITを消滅会社とする吸収合併を行い、存続会社の商号を電通総研テクノロジーに変更した（重要な後発事象）。連結の範囲に変更はない。
- businessStructure: 第49期・第50期の訂正有価証券報告書（2025年4月30日提出）をEDINETで確認した。訂正箇所は受注実績・受注残高と残存履行義務に配分した取引価格の注記のみで、売上高・当期純利益などの財務数値への影響はない。
- industry: 主たる業界は、システムインテグレーション事業を中心とする情報サービス事業であることから it としました。
- industry: 金融ソリューションなどの報告セグメントは顧客業種による区分であり、事業内容はいずれも情報サービスのため、金融などの業界は付けませんでした。
- relatedCompanies: 電通グループ：親会社であるとともに主要な取引先であるため、relationship は parent とした。
- relatedCompanies: 鈴与シンワート株式会社：ソフトウェア製品販売におけるパートナーで、特定投資株式100,000株を保有しているが、非上場のため結ばない。
- relatedCompanies: トヨタ自動車・キヤノン・本田技研工業・ＡＮＡホールディングス：特定投資株式を保有しているが、取引先の情報収集のための小額保有のため結ばない。
- relatedCompanies: 連結子会社14社・持分法適用関連会社4社（ミツエーリンクス、FINOLAB、ACSiONほか）：すべて非上場のため結ばない。

## 要確認（status に反映）

- businessModel: 合同会社ＶＩＣ（株式会社伊藤忠商事の子会社）が2026年11月2日から12月2日までを公開買付期間として、当社の普通株式に対する公開買付けを行っています。買付価格は1株につき2,880円で、買付予定数の下限は9,340,400株（4.78％）、上限は設けていません。親会社である株式会社電通グループは保有する全株式120,779,736株（61.78％）について応募しない旨の合意をしています。取締役会は2026年10月30日に公開買付けへの賛同と株主への応募推奨を決議しました。公開買付けが成立した場合、株主を電通グループと公開買付者のみとするための株式併合によるスクイーズ・アウトが予定されています。有価証券報告書の提出日（2026年3月18日）後の出来事で、買付期間中のため結果は未確定です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
