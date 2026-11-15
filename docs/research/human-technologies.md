# ヒューマンテクノロジーズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ヒューマンテクノロジーズ |
| 証券コード | 5621 |
| docID（データを取り出した文書） | `S100YL5B` |
| 原本 docID | `S100YL5B` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL5B.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ヒューマンテクノロジーズ / 5621 / docID S100YL5B（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
human-technologies: 10 件の数値を有報XBRLと照合
有報: 株式会社ヒューマンテクノロジーズ 有価証券報告書－第15期(2025/04/01－2026/03/31) (docID S100YL5B)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
human-technologies: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記4は2回の株式分割と、第11期の期首に分割が行われたと仮定する1株当たり指標の算定方法を1つの注記で述べています。financialNotes には年度ごとの分割の事実だけを記載し、1株当たり指標の算定に関する部分は表示方法の事項として書きませんでした。分割の取扱いは needsReview に記録しています。
- businessModel: MD&Aに記載のある損益項目（営業利益・経常利益・売上総利益等）の金額や増減率は、本文には書いていません。
- businessModel: 経営方針に記載のある中期の収益目標（利益率の目標値と達成時期）は、投資指標の目標のため perspectives には書いていません。
- businessModel: 潜在株式調整後の1株当たり指標を記載していない理由、非上場年度の株価収益率、従業員数の定義は、表示方法の事項のため warnings のみとしています。
- businessModel: OEM提供先の弥生株式会社、ミイダス株式会社、株式会社HRBrainは、related-candidates.json に無く未上場のため、関連企業には結んでいません。本文にはパートナーとしての事実のみを記載しています。
- businessStructure: 単一セグメントのため、セグメント別の売上高は開示されていません。子サービスごとの金額も開示されていないため、children には金額を書いていません。
- businessStructure: 設備は本社（東京都港区、従業員323人）が単一セグメントでセグメント欄がないため、特定の子サービスには結びつけていません。帳簿価額は書いていません。
- businessStructure: 連結子会社4社（Human Technologies Singapore PTE. LTD.、Human Technologies (Thailand) Co., Ltd.、ＩＴエージェント株式会社、Human Technologies Lanka (Pvt) Ltd.）は自社の子会社のため関連企業には結んでいません。スリランカの子会社は休眠会社です。
- businessStructure: suppliers はこのツリーの旧スキーマに従い省略しました。個別の仕入先は有報に印字されていません。
- history: 沿革表のうち、2020年のKING OF TIME ショールーム開設は施設の開設であり事業の転機ではないため落としました。
- history: 2022年のHUUBAP PTE. LTD.からHuman Technologies Singapore PTE. LTD.への名称変更は、連結子会社の商号変更のため落としました。
- history: 沿革は有報の2つの表（実質上の存続会社の沿革と、当社の沿革）を時系列に統合しました。資本金の金額は書いていません。
- industry: 主たる業界は、売上高の全てを占める単一セグメントの勤怠管理SaaS事業です。クラウドソフトウェアの開発・販売が事業の実体であり、閉じた分類の it が直接該当するため、暫定ではなく it を primary としました。DEIの別記事業は CTE です。人事労務向けのソフトウェアを提供する会社であり、人材の派遣・紹介等を行う人材サービスの会社ではないため、human-resources は付けていません。
- relatedCompanies: technologies: 自社名の一部（ヒューマンテクノロジーズ）の部分一致であり、相手企業についての取引・提携・資本関係の記載はありません。
- relatedCompanies: step: 会計方針の「5ステップアプローチ」の語の一致であり、相手企業についての記載はありません。
- relatedCompanies: base-4481: 課金方式の「打刻ベース」「登録ベース」の語の一致であり、相手企業についての記載はありません。
- relatedCompanies: port: 「サポート体制」の語の部分一致であり、相手企業についての記載はありません。
- relatedCompanies: career: 人材育成の文脈の「キャリアデザイン」の語の一致であり、相手企業についての記載はありません。
- relatedCompanies: path: 「パーパス」の語の一致（ambiguous）であり、相手企業についての記載はありません。
- relatedCompanies: en: 「エンジニア」の語の一致（ambiguous）であり、相手企業についての記載はありません。
- relatedCompanies: ic: 「ICカード」の語の一致（ambiguous）であり、相手企業についての記載はありません。
- relatedCompanies: secure: 「セキュアな環境」の語の一致であり、相手企業についての記載はありません。
- relatedCompanies: core: 「コア顧客層」の語の一致（ambiguous）であり、相手企業についての記載はありません。
- relatedCompanies: cover: 「カバーが可能」の語の一致であり、相手企業についての記載はありません。
- relatedCompanies: daiwa: 大株主の状況に常任代理人として現れる大和証券株式会社は候補の株式会社大和とは別の法人であり、株式会社大和についての取引・提携・資本関係の記載はありません。
- relatedCompanies: ray: 「レイアウト」の語の一致（ambiguous）であり、相手企業についての記載はありません。
- relatedCompanies: rent: 「タレントマネジメント」の語の部分一致であり、相手企業についての記載はありません。同文脈のOEM提供先である株式会社HRBrainは候補一覧にありません。
- relatedCompanies: 候補一覧に無い相手: ニューホライズン株式会社は2026年3月31日現在の大株主（37.53％）ですが、代表取締役会長の資産管理会社で候補一覧に無いため結んでいません。信託銀行・資産管理会社・ファンド・個人の大株主は結びません。上場株式の政策保有はありません（保有する投資株式は非上場株式1銘柄のみ）。
- relatedCompanies: 弥生株式会社、ミイダス株式会社、株式会社HRBrainはOEM提供先ですが、候補一覧に無く未上場のため結んでいません。
- terms: 助言のみ。本文で使った用語の候補: 勤怠管理、SaaS、KING OF TIME、打刻、登録人数課金、OEM提供、販売パートナー、BPaaS、SMP（サブスクリプションマネジメントプラットフォーム）、ワークフロー です。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2022年８月24日付で普通株式１株につき60株の割合、及び2023年９月８日付で普通株式１株につき300株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessStructure: 主要な経営指標等の推移の注記に、2022年８月24日付で普通株式１株につき60株の割合、及び2023年９月８日付で普通株式１株につき300株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
