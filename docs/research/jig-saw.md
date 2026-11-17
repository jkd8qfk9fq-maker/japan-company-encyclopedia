# JIG-SAW — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＪＩＧ－ＳＡＷ株式会社 |
| 証券コード | 3914 |
| docID（データを取り出した文書） | `S100XSVD` |
| 原本 docID | `S100XSVD` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSVD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＪＩＧ－ＳＡＷ株式会社 / 3914 / docID S100XSVD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 6 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jig-saw: 10 件の数値を有報XBRLと照合
有報: ＪＩＧ－ＳＡＷ株式会社 有価証券報告書－第25期(2025/01/01－2025/12/31) (docID S100XSVD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
jig-saw: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「JIG-SAW株式会社」が EDINET の提出者名「ＪＩＧ－ＳＡＷ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aの段階利益の金額と増減理由、キャッシュ・フローの金額、「JIG-SAW PRIME」の取引総額、受注に関する金額は書いていない（本文の数値は売上高と当期純利益だけ）。
- businessModel: 経営方針の目標指標（売上高や段階利益、営業キャッシュ・フロー、企業価値としての時価総額）は投資・利益指標の目標のため、文章と戦略には入れていない。
- businessModel: 財務諸表の組替えの記載は今回の証拠パックでは確認できなかった。前期有報との修正再表示照合は全系列で差異ゼロであり、指標に影響する訂正はない。
- businessStructure: 単一セグメント（データコントロール事業）のため、セグメント別の外部売上高は開示されておらず、【関連情報】の製品・サービス区分も単一区分が90％超のため省略されている。子区分（システムマネジメント、IoT向け各種サービス）には金額を書かず、その旨を各説明に明記した。
- businessStructure: コア技術の応用プロジェクト（再生医療の視覚再生プロジェクト「NEW VISION」、ロードローラの自動運転・自動操縦ソフトウエア開発、生成AI制御サービスのNEQTO.ai）は事業の柱ではなく研究開発段階の取り組みのため、独立した事業にはせず、沿革と強みの記述で扱った。
- businessStructure: 設備は単一セグメントでセグメント欄の記載が省略されており、本社（東京都中央区）、SCC N83・SCC N44（いずれも札幌市）の各拠点はデータコントロール事業の拠点として【主要な設備の状況】に印字されている。帳簿価額は書いていない。
- businessStructure: suppliersキーはこのツリーの旧スキーマに無いため省略した。仕入先の個別名は【事業の内容】に印字されていない。
- history: 沿革の年月と事象は対応して印字されており、行順で対応づけた。資本金の金額は沿革に書いていない（2001年の設立時資本金は除外）。
- history: 省いた項目: 東京本社の開設・移転（2014年、2016年、2020年の丸の内オフィス開設、2024年の八重洲への移転）、SCCの開設（2014年）とSCC N44の開設（2021年）、各種クラウド向けマネジメントサービスの開始（2014年）、クラウド自動セキュリティサービス「Safing」の提供開始（2021年）、特許登録（2017年、2019年、2025年の3件）、AWSマネージドサービスプロバイダープログラム認定（2023年）、次世代システムマネジメントサービス「JIG-SAW OPS」のリニューアル（2025年）、科学技術振興機構プログラムへの採択（2025年）。
- history: Wikipediaは記事が見つからなかった（found: false）ため、補足には使っていない。
- industry: 主たる業界は、単一セグメントのデータコントロール事業がシステムの監視・運用ソフトウェアとIoTソフトウェアの提供であり、itが直接当てはまるため暫定分類はしていない。DEIの別記事業はcteである。
- industry: telecommunicationsは付けていない。同社は通信モジュールや通信制御の技術を提供する側であり、通信事業者ではないため。
- relatedCompanies: core: 「コア技術」という一般語の一致のみで、株式会社コアとの関係の印字はない。
- relatedCompanies: base-4481: 「〜をベースに」という表現の一致のみで、ベース株式会社との関係の印字はない。
- relatedCompanies: en: 「エンジニア」という語の一致のみで、エン株式会社との関係の印字はない。
- relatedCompanies: rhythm: 「アルゴリズム」という語の部分一致のみで、リズム株式会社との関係の印字はない。
- relatedCompanies: career: 「キャリアグレード」という技術用語の一致のみで、株式会社キャリアとの関係の印字はない。
- relatedCompanies: land: 「ブランド名」という語の部分一致のみで、株式会社ランドとの関係の印字はない。
- relatedCompanies: suzuki-6785: 事務連絡者である取締役の姓「鈴木」の一致のみで、株式会社鈴木との関係の印字はない。
- relatedCompanies: innovation: 「イノベーション促進」という一般語の一致のみで、株式会社イノベーションとの関係の印字はない。
- relatedCompanies: daiwa: 外国株主の常任代理人である大和証券株式会社の印字のみで、株式会社大和とは別法人であり関係も印字されていない。
- relatedCompanies: nissin: 現在のコードリストになく、新株予約権の行使期間の印字に含まれる部分一致のみで、関係の印字はない。
- relatedCompanies: port: 「サポート」という語の部分一致のみで、ポート株式会社との関係の印字はない。
- relatedCompanies: secure: 「セキュアな開発」という一般語の一致のみで、株式会社セキュアとの関係の印字はない。
- relatedCompanies: shinto: 「新東京本社」という語の部分一致のみで、新東株式会社との関係の印字はない。
- relatedCompanies: vision: 自社プロジェクト名「NEW VISION」の一致のみで、株式会社ビジョンとの関係の印字はない。
- relatedCompanies: will: 一般語の一致のみで、株式会社ウィルとの関係の印字はない。
- relatedCompanies: 候補にないため結ばなかった相手: SBI JIG-SAWモダナイゼーションズ株式会社は自社の持分法適用関連会社であり関連企業には結ばない。その合弁相手のSBIセキュリティ・ソリューションズ株式会社、前田道路株式会社（ASCSプロジェクトの参画企業）は候補一覧にない。
- relatedCompanies: 【大株主の状況】に載るのは個人と外国株主の保管機関のみで、結べる事業会社の大株主はいない。政策保有株式に結べる個別名の印字はない。
- terms: 助言: 用語「puzzle」は、インターネットにつながる全てのモノとコトを1つのコンソールで統合運用できる同社独自のロボット型自動運用プラットフォームで、【事業の内容】に印字されています。
- terms: 助言: 用語「NEQTO」は、機器や機械などのエッジデバイスから通信経路、クラウドまでIoTに必要な制御機能を統合パッケージ化した同社のIoTエンジンで、【事業の内容】に印字されています。
- terms: 助言: 用語「A&A（自動検知・自動制御）」は、同社のコアコンセプトで、保有する独自のコア技術の応用による自動検知と自動制御を指し、【事業の内容】に印字されています。
- terms: 助言: 用語「Safing」は、常時セキュリティ監視・診断を自動で実施するSaaSモデルのクラウドセキュリティサービスで、【事業の内容】に印字されています。
- terms: 助言: 用語「JIG-SAW PRIME」は、クラウドの請求代行から導入支援、運用保守までを包括的に支援するマルチクラウド型のサービスで、【事業の内容】に印字されています。
- terms: Wikipediaは記事が見つからなかった（found: false）ため、助言にも使っていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
