# ソレキア — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ソレキア株式会社 |
| 証券コード | 9867 |
| docID（データを取り出した文書） | `S100YKQM` |
| 原本 docID | `S100YKQM` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKQM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ソレキア株式会社 / 9867 / docID S100YKQM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
solekia: 10 件の数値を有報XBRLと照合
有報: ソレキア株式会社 有価証券報告書－第68期(2025/04/01－2026/03/31) (docID S100YKQM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
solekia: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（切り上げはしていない）。地域別の切り捨て後の合計は30,379百万円で、印字の連結売上高30,381百万円とは2百万円の切り捨て差異があり、印字の合計を採用した。
- businessModel: 経営指標として重視すると印字されたROE・売上高営業利益率などの投資・利益率の指標とその目標は、本文の規則により戦略の文章に入れず、ここに記録する。
- businessModel: 富士通株式会社は当社の株式の2.73％を保有する大株主でもある（2026年3月31日現在）。関連企業としては仕入先としてリンクした。
- businessModel: 前期有報との修正再表示チェックは全系列で差異がなく、会計方針の変更や変則決算もないためfinancialNotesは空とした。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高（2026年3月期）の大きい順とし、「その他」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: 金額は千円の印字を百万円に切り捨てて記載した（切り上げはしていない）。切り捨て後の4区分の合計は30,379百万円で、印字の連結売上高30,381百万円とは2百万円の切り捨て差異がある。千円単位では各区分の合計と連結売上高は一致する。
- businessStructure: 完全子会社のソレキア・プラッツ株式会社は2026年10月1日付で当社に吸収合併される予定（2026年6月18日決議・契約締結）であり、needsReviewに記録した。登録は2026年3月31日現在の体制で行っている。
- history: 沿革の2012年5月・2013年5月の年月セルが2件続けて印字され事象文と分かれている箇所は、年月と事象の数が同じ（2件ずつ）ため行順に対応づけた（2012年=SOLEKIA VIETNAM LIMITED、2013年=SOLEKIA HONG KONG LIMITED）。
- history: 沿革に印字された資本金の金額（設立時の資本金、増資後の資本金）は本文の規則により記載していない。
- history: 支店・営業所・出張所の設置、本社移転のうち所在地が現在と異なるもの、特約店契約の細目などの行は、主要な出来事に絞って省略した。
- history: 1993年設立のKOBADEN DESIGNER BUSINESS SOLUTIONS,INC.は2004年に解散しており、現在の体制に関係しないため沿革の行から省略した。
- industry: 主たる業界は、事業の内容が情報・通信システム関連商品の販売、ソフトウェアの開発およびこれらに係るサービスの提供と印字され、製品・サービス別でも情報関連機器とシステムソリューションが大半を占めるためitとした。
- industry: コンポーネント・デバイス（電子デバイス、半導体など）の販売が関連情報で独立して開示されているため、2つ目にelectronicsを付けた。半導体そのものの製造や製造装置の事業ではなく、部品販売の一部であるためsemiconductorsは付けていない。
- relatedCompanies: fujitsu: パートナー契約・保守基本契約（重要な契約等）と、売上・仕入の両面の取引（事業等のリスク）が印字されており、仕入先としてリンクした。特定投資株式の保有目的も主要な取引先として個別に印字されている。
- relatedCompanies: fuji-electric: 保有目的がコンポーネント・デバイス・ソリューション分野という特定の取引分野を名指ししており、沿革にも取扱店としての関係が印字されているため、取引の向きは印字されていないことからbusiness-partnerとしてリンクした。
- relatedCompanies: hioki-e-e: 保有目的が他の4銘柄（沖電気工業、仙波糖化工業、ダイヤモンドエレクトリックホールディングス、中央倉庫）と同一の定型文（ITソリューション・サービス分野、システムソリューション分野、フィールドサービス分野という3分野を並べた共通文）のみで、個別の取引事実の印字がないためリンクしない。
- relatedCompanies: oki-electric-industry: 保有目的が上記と同一の定型文のみのためリンクしない。
- relatedCompanies: semba-tohka-industries: 保有目的が上記と同一の定型文のみのためリンクしない。
- relatedCompanies: diamond-electric-holdings: 保有目的が上記と同一の定型文のみのためリンクしない。
- relatedCompanies: chuo-warehouse: 保有目的が上記と同一の定型文のみのためリンクしない。
- relatedCompanies: resona-holdings: 保有目的が安定した資金調達及び金融情勢等の情報収集であり、資金調達の関係のためリンクしない。
- relatedCompanies: yokohama-financial-group: 保有目的が安定した資金調達及び金融情勢等の情報収集であり、資金調達の関係のためリンクしない。なお、同社は2025年10月1日付で株式会社コンコルディア・フィナンシャルグループから社名変更している。
- relatedCompanies: mizuho-financial-group: 保有目的が安定した資金調達及び金融情勢等の情報収集であり、資金調達の関係のためリンクしない。
- relatedCompanies: marusan-securities: 保有目的が業界動向の情報収集等のためリンクしない。
- relatedCompanies: yokowo: 保有目的が業界動向の情報収集等のためリンクしない。
- relatedCompanies: origin: 保有目的が業界動向の情報収集等のためリンクしない。
- relatedCompanies: platz: 候補の株式会社プラッツは、当社の完全子会社であるソレキア・プラッツ株式会社とは別の法人であり、社名の一部一致のみのためリンクしない。
- relatedCompanies: technologies: 本文に印字されたエフサステクノロジーズ株式会社は富士通株式会社の子会社であり、候補の株式会社テクノロジーズとは別の法人のためリンクしない。エフサステクノロジーズ株式会社とは、取扱製品の販売に関するパートナー契約と、保守・サービス業務の委託に関する基本契約を締結しており、仕入の割合も大きいが、上場会社ではなく候補にないためリンクしていない。
- relatedCompanies: 富士通Japan株式会社は未上場で候補にないためリンクしない。取扱製品の販売に関するパートナー契約を締結し、仕入の割合も大きい事実はここに記録する。
- relatedCompanies: en、seki、port、base-4481、will、zero、densan: 本文中の語句（エンジニアリング、セキュリティ、サポート、ベース、ウィルス、ゼロトラスト、電算機）との一致による候補で、取引・提携の事実の印字がないためリンクしない。
- relatedCompanies: trust: ゼロトラストという語句との一致による候補で、コードリストにもないためリンクしない。
- terms: 助言: 用語「Thinking Together」は、経営の基本方針に印字された当社グループの事業活動方針で、お客様をはじめパートナーや従業員などのステークホルダーと衆知を結集する考え方として使われています。
- terms: 助言: 用語「三位一体のトータルサポート力」は、経営方針に印字された当社グループの強みで、ITの専門スキルを持つ営業、システムエンジニア、サービスエンジニアが一体で顧客を支援する体制を指します。
- terms: 助言: 用語「ストック型ビジネス」「伴走型支援」は、対処すべき課題に印字された方針で、保守・運用の枠を超えて顧客のIT環境の変化に継続的に対応するサービスを指します。
- terms: 助言: 用語「キッティング」は、フィールドサービスの商談や吸収合併の目的（キッティング事業）に印字された語で、パソコンなどの機器の初期設定・展開作業の文脈で使われています。

## 要確認（status に反映）

- businessModel: 完全子会社であるソレキア・プラッツ株式会社は、2026年6月18日開催の取締役会において決議され同日付で合併契約が締結されたことにより、2026年10月1日を効力発生日として当社に吸収合併される予定です（重要な後発事象に記載）。登録は2026年3月31日現在の体制（連結子会社3社）で行っています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
