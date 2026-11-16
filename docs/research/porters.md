# ポーターズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ポーターズ株式会社 |
| 証券コード | 5126 |
| docID（データを取り出した文書） | `S100XSOH` |
| 原本 docID | `S100XSOH` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSOH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ポーターズ株式会社 / 5126 / docID S100XSOH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
porters: 6 件の数値を有報XBRLと照合
有報: ポーターズ株式会社 有価証券報告書－第25期(2025/01/01－2025/12/31) (docID S100XSOH)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
porters: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 連結経営指標等は第23期より連結財務諸表を作成しているため3年分のみが印字されており、5年表はその3年分で構成される（前期有報との修正再表示チェックは全系列で差異なし）。
- businessModel: MD&Aの利益段階の金額やその理由（特別損失の計上など）は書いていない。本文の金額は売上高と親会社株主に帰属する当期純利益のみとした。
- businessModel: 経営上の目標指標として印字されているPORTERSの有料ユーザーID数の実績値（2025年12月末時点）はKPIの実績であるため、本文には数値を書かず、増減の理由として定性的に触れるにとどめた。
- businessModel: 連結子会社である株式会社KIKAN flexの第三者割当増資や、連結の範囲の変更を伴わない子会社株式の追加取得は当事業年度中のグループ内の資本取引であり、2025年12月31日現在の構成の登録に影響しないため、warningsのみとした。
- businessModel: Global HR-Tech事業で固定資産の減損損失が計上されているが、利益段階に関わる金額のため本文には書いていない。
- businessStructure: 本社（東京都港区）と株式会社KIKAN flexの本社（東京都港区）の設備は、いずれもHR-Tech事業の設備として【主要な設備の状況】に印字されている。在外子会社の主要な設備は重要性が乏しいとして記載が省略されている。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。オフショア開発の拠点であるバングラデシュのリソース活用については事業の説明に含めた。
- businessStructure: 連結子会社は5社（株式会社atB、ATB LAB Ltd.、PORTERS ASIA SG PTE. LTD.、株式会社KIKAN flex、PORTERS ASIA VIETNAM COMPANY LIMITED）で、いずれも当社グループの子会社であり、事業区分との対応は【関係会社の状況】の印字どおりとした。
- businessStructure: 連結子会社のATB LAB Ltd.は2025年12月末時点で債務超過であることが【関係会社の状況】の注記に印字されている（金額は書いていない）。提出会社自体の継続企業の前提に関する注記はない。
- history: 【沿革】は年月と事象が対応して印字された表であり、行順のまま対応づけた。月は項目に含めず年のみとした。
- history: Wikipediaの記事は取得されなかった（found: false）ため、補足情報は使っていない。
- industry: 主たる業界は it とした。当社は人材紹介・労働者派遣のサービスそのものを行う会社ではなく、人材サービス会社向けにクラウド型の業務システムを提供するソフトウェア会社であり、売上高の大部分がクラウドサービスの利用料であるため、閉じた分類のIT・ソフトウェアが当たる。人材業界向けであることは事業の説明で示した。
- industry: DEIの別記事業はCTE（情報・通信）であり、it の選択と整合する。
- relatedCompanies: port（ポート株式会社）: 一致箇所はサービス名「PORTERS」の部分一致のみで、同社への言及ではないため結ばない。
- relatedCompanies: career（株式会社キャリア）: 一致箇所は帳票名「キャリアシート」の部分一致のみのため結ばない。
- relatedCompanies: seki（セキ株式会社）: 一致箇所は「セキュリティ」という一般語の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: vision（株式会社ビジョン）: 一致箇所は経営理念の「ビジョン」という一般語のみのため結ばない。
- relatedCompanies: base-4481（ベース株式会社）: 一致箇所は「営業利益ベース」という表現の部分一致のみのため結ばない。
- relatedCompanies: zero（株式会社ゼロ）: 一致箇所は当社サービス「ZLOSS」の説明文中の「ゼロ（Zero）」という語のみ（ambiguous）のため結ばない。
- relatedCompanies: corona（株式会社コロナ）: 一致箇所は「新型コロナウイルス感染症」という一般語のみのため結ばない。
- relatedCompanies: en（エン株式会社）: 一致箇所は「エントリー」という語の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: freee（フリー株式会社）: 一致箇所は「フリーワード検索」の部分一致のみのため結ばない。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 【大株主の状況】に印字されているのは「光通信KK投資事業有限責任組合」であり、株式会社光通信とは別の法人の投資事業有限責任組合であるため結ばない。同組合は純投資の株主であり、取引・提携の印字もない。
- relatedCompanies: rhythm（リズム株式会社）: 一致箇所は「アルゴリズム」の部分一致のみのため結ばない。
- relatedCompanies: taya（株式会社田谷）: 一致箇所は役員等の氏名・住所の文字列の部分一致のみ（ambiguous）で、同社への言及はないため結ばない。
- relatedCompanies: 候補外のため結ばない相手: 大株主のKAキャピタル株式会社（2025年12月31日現在45.96％）は候補一覧にない非上場の投資会社であり、関連企業には結ばない。【大株主の状況】のそのほかの株主は個人、カストディ銀行等の信託口、証券会社の純投資であり結ばない。連結子会社5社は当社グループの子会社であり、関連企業（他社）としては結ばない。
- terms: 助言: 用語「PORTERS」は、人材紹介会社、労働者派遣会社などのためのクラウド型マッチング総合管理システムの名称で、求人・求職者の情報管理や選考プロセス管理、マッチング検索などの機能を備えることが【事業の内容】に印字されています。
- terms: 助言: 用語「ZLOSS」は、候補者の流入機会損失（LOSS）をゼロ（Zero）にするための人材ビジネス専用スケジューラーで、候補者の個人情報入力から面談日のアサインまでを自動化するツールとして【事業の内容】に印字されています。
- terms: 助言: 用語「atB JOBS」は、当社グループがバングラデシュ国内で展開する求人媒体の名称として【事業の内容】に印字されています。
- terms: 助言: 用語「PORTERS Assist」は、AIによるスカウト代行サービスの名称として【沿革】に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
