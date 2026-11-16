# HEROZ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＨＥＲＯＺ株式会社 |
| 証券コード | 4382 |
| docID（データを取り出した文書） | `S100YS1Z` |
| 原本 docID | `S100YS1Z` |
| 提出日（原本） | 2026-07-23 |
| 決算期 | 2026-04-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YS1Z.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＨＥＲＯＺ株式会社 / 4382 / docID S100YS1Z（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
heroz: 8 件の数値を有報XBRLと照合
有報: ＨＥＲＯＺ株式会社 有価証券報告書－第18期(2025/05/01－2026/04/30) (docID S100YS1Z)
前期有報との比較: 18 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
すべて一致しました。
heroz: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「HEROZ株式会社」が EDINET の提出者名「ＨＥＲＯＺ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記のうち、注1（第15期より連結財務諸表を作成）を financialNotes に採った。注2（潜在株式調整後1株当たり当期純利益の非表示）、注3（連結初年度の自己資本利益率の計算基礎）、注4（株価収益率の非表示）は表示上の事項のため warnings に留めた。
- businessModel: 注5の株式会社ティファナ・ドットコムとの企業結合に係る取得原価の配分の確定（第16期は暫定的な会計処理、第17期に確定し、第16期の連結財務諸表への影響は軽微と印字）については、前期有報との修正再表示チェックで登録数値に差異がなかったため、financialNotes には書かず、ここに記録した。
- businessModel: 提出後の出来事として、AKMコンサルティング株式会社の株式取得による連結子会社化（2026年5月1日）と、バリオセキュア株式会社の株式交換による完全子会社化（2026年6月30日効力発生、同社株式は2026年6月26日付で上場廃止）があり、needsReview に記録した。登録は2026年4月30日現在の構造で行っている。
- businessModel: 株式会社ストラテジットの全株式譲渡（2026年4月30日付）は当連結会計年度末の出来事として沿革に記録した。譲渡に伴う売却益の金額は書いていない。
- businessModel: 段階利益の金額や増減率、キャッシュ・フローの金額、総資産・純資産の金額は書いていない。HEROZ ASKの年次経常収益（ARR）の金額も書かず、累計契約顧客数のみを industryPosition に記録した。主要な顧客については金額を書かず、社名のみを flow の customer に記録した。
- businessModel: 決算期は表紙のDEIから「2026年4月期」とした。従業員数は連結経営指標等の2026年4月30日現在の259人を用いた。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（AIX事業3,581百万円、AI Security事業2,842百万円）とした。当期より報告セグメントの名称が「AI/DX事業」から「AIX事業」に変更されている（名称変更のみで内容の変更はない）。
- businessStructure: AIX事業の内訳であるBtoCサービス・BtoBサービスは【事業の内容】の分類であり、金額が独立して開示されていないため、金額を書かずその旨を明記した。
- businessStructure: 株式会社ストラテジットが提供していたSaaS導入支援・API連携開発は当期のAIX事業に含まれていたが、2026年4月30日付で全株式を売却し連結の範囲から除外され、翌期より報告セグメントの対象からも除外される予定と印字されているため、事業としては登録しなかった。
- businessStructure: 設備と事業の対応について、本社（東京都港区）は「AIX事業、全社（共通）」、バリオセキュア本社は「AI Security事業、全社（共通）」と複数区分が連記された行のため、特定の事業には結びつけなかった。設備の帳簿価額は書いていない。
- businessStructure: このツリーの旧スキーマに合わせ、suppliers は省略した。バリオセキュアの販売は販売代理店を通じた間接販売が中心であり、その事実はAI Security事業の customers に販売代理店として記録した。
- history: 沿革のうち、2016年の株式会社バンダイナムコエンターテインメント、2017年の株式会社コーエーテクモゲームス・株式会社竹中工務店、2018年のNetmarble Corporationとの資本業務提携は、転機となる出来事に絞るため省略した。2022年の「棋神アナリティクス」提供開始、2023年の「棋神ラーニング」リリース、2025年の将棋ウォーズ新モード「スプリント」、2026年の新モード「詰めバト」も製品・機能の追加として省略した。
- history: AKMコンサルティング株式会社の株式取得（2026年5月、連結子会社化）は期後の企業結合であるため沿革には入れず、businessModel・businessStructure の needsReview に記録した。
- history: 資本金の金額は規則により沿革に書いていない。wikipedia.json は found: false のため使用していない。
- industry: 主たる業界は it とした。報告セグメントのAIX事業（AIソリューション・SaaS）とAI Security事業（セキュリティサービス）はいずれも情報サービスが中核である。
- industry: entertainment は付けなかった。将棋ウォーズはAIX事業の一部として開示されており、エンターテインメントとして独立した開示がないため。
- industry: telecommunications は付けなかった。バリオセキュアの販売代理店に通信事業者が含まれるが、同社の事業はセキュリティサービスであるため。
- industry: DEIの別記事業は cte である。
- relatedCompanies: vario-secure（バリオセキュア）: 連結子会社であり自社の子会社は結ばない。加えて2026年6月26日付で上場廃止となりコードリストにないため結ばなかった。
- relatedCompanies: gmo-globalsign-holdings（GMOグローバルサイン・ホールディングス）: 株式会社ストラテジットの全株式の譲渡先だが、1回限りの株式譲渡であり、継続的な取引・提携の印字がないため結ばなかった。譲渡の事実は沿革に記録した。
- relatedCompanies: ai（株式会社エーアイ）: 印字されているのは連結子会社の株式会社エーアイスクエアであり、株式会社エーアイとは別法人のため結ばなかった。
- relatedCompanies: daiwa（大和証券）: 大株主の状況における常任代理人・保有の印字のみで、取引・提携の印字がないため結ばなかった。
- relatedCompanies: sumitomo-corporation（住友商事）: バリオセキュアの本社所在地であるビル名（住友商事錦町ビル）の印字のみのため結ばなかった。
- relatedCompanies: en、ray、kohsoku、path、core、zero、nissin、trust は ambiguous な候補であり、いずれも一般語の部分一致のみで、相手についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: port、land、base-4481、tein、vision、cover、innovation、rhythm、system-integrator、career、freee、king、tear、the-lead は、一般語・文脈語の部分一致のみで、相手についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: 候補一覧にない相手は結んでいない。株式会社竹中工務店（2017年に資本業務提携、大株主の状況に1.07％の保有の印字）、ビッグローブ株式会社（大株主の状況に2.63％の保有の印字）、株式会社コーエーテクモゲームス（2017年に資本業務提携）は候補に含まれないため対象外とした。特定投資株式は該当事項なしと印字されている。
- terms: 用語の助言：「AIX」（AIを社会に浸透させることで、業務プロセスやビジネスモデルを含めて社会全体に抜本的な変革を起こすこととする同社の概念）、「AI BPaaS」（AIが業務そのものを代行する形で価値提供を行うとする同社の戦略概念）、「棋神」（将棋ウォーズで利用者に代わって指し手を示すAI機能）、「VSR」（バリオセキュアが自社開発したネットワークセキュリティ機器）は同社・グループ固有の用語であり、この会社の文脈でのみ用いるのが適切です。

## 要確認（status に反映）

- businessModel: 2026年5月1日付でAKMコンサルティング株式会社の発行済株式の70.0％を取得し連結子会社化しています（期後の企業結合）。登録は2026年4月30日現在の構造で行っています。
- businessModel: 2026年6月30日を効力発生日とする株式交換により、連結子会社のバリオセキュア株式会社を完全子会社化しています（同社株式は2026年6月26日付で上場廃止）。決算期末現在の議決権所有割合は42.8％であり、登録は2026年4月30日現在の構造で行っています。
- businessStructure: 2026年5月1日付でAKMコンサルティング株式会社の発行済株式の70.0％を取得し連結子会社化しています（期後の企業結合）。登録は2026年4月30日現在の構造で行っています。
- businessStructure: 2026年6月30日を効力発生日とする株式交換により、連結子会社のバリオセキュア株式会社を完全子会社化しています（同社株式は2026年6月26日付で上場廃止）。決算期末現在の議決権所有割合は42.8％であり、登録は2026年4月30日現在の構造で行っています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
