# Kudan — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | Ｋｕｄａｎ株式会社 |
| 証券コード | 4425 |
| docID（データを取り出した文書） | `S100YIKS` |
| 原本 docID | `S100YIKS` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIKS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | Ｋｕｄａｎ株式会社 / 4425 / docID S100YIKS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kudan: 10 件の数値を有報XBRLと照合
有報: Ｋｕｄａｎ株式会社 有価証券報告書－第12期(2025/04/01－2026/03/31) (docID S100YIKS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kudan: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「Kudan株式会社」が EDINET の提出者名「Ｋｕｄａｎ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記１から３（潜在株式調整後１株当たり当期純利益、株価収益率、自己資本利益率を純損失のため記載していない旨）と注記４、５（従業員数の数え方）は表示事項のため financialNotes には入れず、ここに記録する。
- businessModel: 期間後の出来事として、2026年５月25日の取締役会で、繰越利益剰余金の欠損填補を目的とする剰余金の処分（その他資本剰余金の一部を繰越利益剰余金へ振替）を第12回定時株主総会に付議することが決議されている。これは資本政策の手続のため warnings のみとし、金額は書いていない。
- businessModel: 前期有報との再表示照合では、全６系列で差異がなかった。表示方法の変更等の注記はなく、組替えに係る financialNote は記録していない。
- businessModel: 主要な顧客への売上金額は書かず、顧客名のみを記載した。
- businessStructure: セグメント情報は省略されており（AP事業が主要な事業で他の事業セグメントの重要性が乏しいため）、製品及びサービスごとの情報も単一区分が90％超のため省略されている。３つの提供形態（SWアルゴリズム／SWソリューション／HWパッケージ）には金額を書かず、独立開示がない旨を各子区分に明記した。
- businessStructure: 主要な顧客は【関連情報】に印字された３社（神戸清光、アクティブリテック、新エネルギー・産業技術総合開発機構）を名称のみ事業の customers に記載した。各顧客への売上金額は書いていない。
- businessStructure: 連結子会社はKudan Limited（英国）、Kudan USA LLC、Kudan Vision株式会社、Artisense Corporation、Kudan Germany GmbHの５社で、いずれも当社グループの会社であるため関連企業には含めていない。Kudan Vision株式会社の事業区分は「その他」と印字されている。
- businessStructure: このツリーの旧スキーマに従い suppliers は省略した。個別に印字された仕入先はない。
- businessStructure: 本社（東京都渋谷区）とKudan Limited本社（英国ブリストル）の設備は事業全体に係るものであるため、特定の子区分には結びつけなかった。設備の帳簿価額や賃料は書いていない。
- history: 沿革の年月は年だけを記載し、月は書いていない。資本金額は書いていない。
- history: Artisense Corporationについては、2020年１月の段階的株式取得契約の締結と同年７月のグループ会社化を、2021年12月の完全子会社化の項目の説明に統合した。
- history: 本社の移転（設立時の千代田区から現在の渋谷区）など、沿革表に印字のない事項は記載していない。
- industry: 主たる業界は、空間知覚技術のソフトウェアライセンス、ソリューション及び関連ハードウェアパッケージの提供が事業の中心であるため it とした。
- industry: 半導体メーカーやロボットメーカーは技術の組込先・顧客であり、同社は半導体や機械そのものを製造していないため semiconductors と machinery は付けなかった。
- industry: デジタルツインやロボティクスの応用先である建設、製造、物流等の産業は顧客産業であるため、それらの業界は付けなかった。
- relatedCompanies: port: 「サポート」の部分一致のみで、ポート株式会社との取引・提携・資本関係の印字はないため結ばなかった。
- relatedCompanies: step: 収益認識の「5ステップアプローチ」の語の一致のみのため結ばなかった。
- relatedCompanies: rhythm: 一般語の一致のみで、リズム株式会社との関係の印字はないため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」の部分一致のみのため結ばなかった。
- relatedCompanies: vision: コーポレートビジョンの「ビジョン」の語の一致のみのため結ばなかった。
- relatedCompanies: core: 「コアSW」の語の一致のみのため結ばなかった。
- relatedCompanies: en: 「エンジニア」の語の部分一致のみのため結ばなかった。
- relatedCompanies: innovation: 「イノベーションを起こす」の語の一致のみのため結ばなかった。
- relatedCompanies: ray: 常任代理人の所在地表記の一致のみのため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」の語の部分一致のみのため結ばなかった。
- relatedCompanies: system-integrator: 「システムインテグレーター」という一般的な連携先の呼称の一致のみで、株式会社システムインテグレータとの個別の関係の印字はないため結ばなかった。
- relatedCompanies: the-lead: 「リードする」の語の一致のみのため結ばなかった。
- relatedCompanies: zero: 「割引率をゼロ」の語の一致のみのため結ばなかった。
- relatedCompanies: 候補にない相手: 主要な顧客の株式会社神戸清光、株式会社アクティブリテック、国立研究開発法人新エネルギー・産業技術総合開発機構、MD&Aに当社技術の採用が印字されたIntel社、大株主の株式会社ヘルシア及び株式会社アグリは、いずれも候補一覧にないため結んでいない。
- relatedCompanies: 特定投資株式については、該当事項なしと印字されている。連結子会社５社は当社グループの会社のため結んでいない。
- terms: 助言: 「SLAM」は、コンピュータが現実環境における自己位置推定と３次元立体地図作成を同時に行う技術です。「空間知覚」は、カメラ、３次元センサ、IMU、GPS等から得られる情報を処理し、機械が現実空間における自己位置、周辺環境、物体、移動可能領域、空間構造等を認識・理解するための技術です。
- terms: 助言: 「フィジカルAI」は、デジタル空間上の情報処理にとどまらず、現実空間においてデータ取得、学習、行動、継続学習を行うAI及びその技術体系を指します。「デジタルツイン」は、現実環境や設備、構造物等をデジタル空間上に再現し、状態把握、分析、シミュレーション、管理等に活用する技術及びその体系です。
- terms: 助言: 「ロボットナビゲーション」は、ロボットが自己位置、周辺環境、障害物、目的地等を認識し、経路計画及び移動制御を行うための技術です。「セマンティック3D認識」は、３次元データや3D地図に含まれる物体、構造、領域等に意味情報を付与し、機械が空間内の対象を識別・理解する技術です。「フォトリアル3D表現」は、３次元データや3D地図を写実的に表示・再構成する技術です。
- terms: 助言: 「AP事業」は当社の主要事業の名称で、空間知覚関連事業を指します。「Kudan PRISM」は設備点検・管理向けのデジタルツインソリューションの名称です。いずれも【事業の内容】の用語説明に基づきます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
