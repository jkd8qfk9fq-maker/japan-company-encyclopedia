# LIFULL — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＬＩＦＵＬＬ |
| 証券コード | 2120 |
| docID（データを取り出した文書） | `S100XD4M` |
| 原本 docID | `S100X8TY` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | S100XD4M／有効文書 S100XD4M（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XD4M.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＬＩＦＵＬＬ / 2120 / docID S100X8TY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 10 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
lifull: 10 件の数値を有報XBRLと照合
有報: 株式会社ＬＩＦＵＬＬ 訂正有価証券報告書－第31期(2024/10/01－2025/09/30) (docID S100XD4M)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2024-09-30","previousFiling":34466000000,"latestFiling":26312000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2024-09-30","previousFiling":-7076000000,"latestFiling":2549000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第31期(2024/10/01－2025/09/30)、docID S100XD4M）を有効文書としてこのパックを作った。原本は docID S100X8TY。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはIndependentAuditorsReportConsolidatedTextBlock・IndependentAuditorsReportNonConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 非継続事業・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
lifull: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社LIFULL」が EDINET の提出者名「株式会社ＬＩＦＵＬＬ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円単位の印字どおりに記載した（当社は第29期より連結財務諸表の金額を百万円単位で記載）。
- businessModel: 有効文書は訂正有価証券報告書（docID S100XD4M、原本S100X8TY）で、分類はrecord-only。原本との差異は監査報告書のテキストブロックのみで、財務の数値・本文・開示数値は同一のため、訂正に関するneedsReviewは設けず、出典は訂正有報に向けた。
- businessModel: 第30期（2024年9月期）の売上収益と税引前当期利益は前期有報の印字（売上収益34,466百万円、税引前当期損失7,076百万円）と異なる。有報の経営指標等の注記に理由（第31期の非継続事業分類に伴う組替え）が印字されているため、financialNotesに2024年9月期の注記を書いた。値は今期有報のもの（売上収益26,312百万円、税引前当期利益2,549百万円）。
- businessModel: 海外事業の非継続事業への分類は2025年1月に期中で完了し、期末の体制（報告セグメントはHOME'S関連事業の単一セグメント）に反映されているため、needsReviewではなく沿革と本警告に記録した。
- businessModel: 従業員数は前期末の1,758名から918名へ減少した。2025年1月の現物出資によりLIFULL CONNECT, S.L.が連結の範囲から外れ、海外事業が非継続事業に分類されている。
- businessModel: 後発事象として、2025年11月12日の取締役会でストックオプションとしての新株予約権（第4回・第5回）の発行が決議されている。期後の資本政策の決議のため本文には書かず、本警告に記録した。
- businessModel: MD&Aのセグメント別売上収益25,538百万円はセグメント間取引（7百万円）消去前の金額で、セグメント情報の外部顧客からの売上収益25,530百万円と異なる。本文・フローでは外部顧客からの売上収益を用いた。
- businessModel: 中期経営計画に関する目標数値（単体の利益指標の目標等）は、利益指標・投資指標のため本文・戦略には記載しなかった。
- businessModel: 楽天グループ株式会社との関連当事者取引として投資不動産の取得が開示されている（その他セグメントでRakuten STAY VILLA4物件の信託受益権を取得）。金額は関連企業の説明には書かなかった。
- businessModel: suppliersは本ツリーのスキーマに無いため省略した。該当する仕入先の事実は開示されていない。
- businessStructure: 報告セグメントは、2025年1月に海外事業を非継続事業に分類したことに伴い、HOME'S関連事業の単一セグメントに変更された（期中に完了し、期末の体制に反映済み）。前期のセグメント情報は継続事業のみの金額に組み替えて表示されている。
- businessStructure: 株式会社LIFULL Investment（ファンド運営・投融資・空き家利活用）、株式会社LIFULL Financial（不動産NFT事業と金融関連事業の統括）等の子会社の事業は、独立した金額開示がないため子区分にはせず、本文の会社説明の範囲に留めた。
- businessStructure: MD&Aのセグメント別売上収益25,538百万円はセグメント間取引消去前の金額であり、セグメント情報の外部顧客からの売上収益25,530百万円と7百万円異なる。本フラグメントでは外部顧客からの売上収益を用いた。
- history: 沿革から割愛した行: 本社移転（2001年・2004年・2006年・2011年・2017年）、支店・営業所の開設・移転（2005年大阪支店、2006年福岡営業所、2008年名古屋営業所、2016年札幌支店等）、ISMS・ISO/IEC27001の認証取得・移行（2006年・2007年）、システム開発事業の開始（1999年）。
- history: 沿革から割愛した子会社関連の行: 株式会社アクセリオンの連結子会社化（2015年）、株式会社LIFULL seniorの設立（2015年）、株式会社JGマーケティング（現株式会社LIFULL Investment）の子会社化（2017年）、ベトナム開発子会社の子会社化（2017年）、株式会社レンターズの吸収合併（2017年）、株式会社LIFULL ArchiTechの設立（2019年）、LIFULL CONNECT, S.L.の設立（2019年）、株式会社LIFULL Marketing Partnersの全株式譲渡（2022年）、FazWaz Thailand Co., Ltd.の全株式取得（2023年）、LIFULL TECH MALAYSIA SDN. BHD.の設立（2023年）、株式会社LIFULL Financialの設立（2024年）。
- history: 設立時（1997年）の資本金額は沿革に印字されているが、資本金額のため沿革の本文には記載しなかった。
- industry: 主たる業界はreal-estateとした。単一セグメントHOME'S関連事業（外部顧客からの売上収益25,530百万円／売上収益28,127百万円）が不動産・住宅情報サービスであり、その他も介護施設情報・収納スペース情報等の住まい周辺の情報サービスで、事業の実態は不動産情報サービスであるため。
- industry: インターネットを媒体とする事業だが、ソフトウエアの受託開発等を事業とする会社ではないためitは付けていない。分類上のギャップは無いためtaxonomyGapsには挙げていない。
- relatedCompanies: arealink（エリアリンク株式会社）: 前期に連結子会社だった株式会社LIFULL SPACEの全株式を譲渡した相手先だが、譲渡は前期に完了した一回の取引であり、当期の有報に継続的な取引・提携・資本関係の印字がないため結ばなかった。譲渡の狙い（トランクルーム市場での両社のノウハウ統合）は前期有報の記載事項としてここに記録する。
- relatedCompanies: Hash DasH Holdings株式会社は持分法適用関連会社（議決権10.1％）だが未上場で関連候補に含まれていないため結ばなかった。株式会社LIFULL senior、株式会社LIFULL Investment、健美家株式会社は当社の連結子会社であり、関連企業としては結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社（信託口）は信託口であり結ばなかった（候補trustはコードリストにない相手でもある）。大株主の井上高志氏は個人であり結ばなかった。
- relatedCompanies: 一般語・部分一致のため結ばなかった候補: career（社員キャリア志向調査）、vision（ビジョンシェアリング等の一般語）、core（組織サーベイ等の部分一致、ambiguous）、en（エンゲージメントの部分一致、ambiguous）、port（サポートの部分一致）、step（収益認識の5ステップアプローチ）、base-4481（データベース・金額ベースの一般語）、nissin（新株予約権の行使期間等の印字、コードリストにない）、no-1（『物件鮮度No.1』の表示）、secure（セキュアな環境の一般語）、freee（フリーランスの部分一致）、cover（住宅ストックのカバー率）、innovation（イノベーションの一般語）、land（ブランドの部分一致）、lec（フレックスタイムの部分一致）、ray（レイアウトの部分一致、ambiguous）、space（自社サービス名『LIFULLトランクルーム』等の部分一致）、taya（楽天グループの住所『世田谷区』の部分一致、ambiguous）、zero（配当金額をゼロとする一般語、ambiguous）、jinushi（地主の一般語、ambiguous）、rhythm（アルゴリズムの部分一致）、rion（株式会社アクセリオンの部分一致）、will（コンピュータウィルスの部分一致）。
- relatedCompanies: 楽天グループ株式会社の説明には、関連当事者取引の金額（投資不動産の取得等）を書かなかった。議決権の保有割合のみ記載した。
- terms: 助言: 用語「LIFULL HOME'S」は、当社の主力サービスである不動産・住宅情報サイトの名称で、旧称は『HOME'S（ホームズ）』。沿革と事業の内容に印字されています。
- terms: 助言: 用語「アグリゲーションサイト」は、物件情報等を集約して提供するサイトを指し、Trovit Search, S.L.とMitula Group Limitedの事業説明として沿革に印字されています。
- terms: 助言: 用語「非継続事業」は、売却等により経営から分離された事業の区分で、当期に海外事業が分類され、連結損益計算書では継続事業と区分して表示されています。
- terms: 助言: 用語「ARPA」は、一顧客あたり平均売上の略称で、MD&Aの目標とする経営指標（事業上の指標）に印字されています。数値は計画・指標のため本文には名称の範囲で触れるに留めました。
- terms: 助言: 用語「おとり物件」は、実在しない又は成約済みの物件情報で顧客を誘引する表示を指し、当社はAIによる検知・自動非掲載やレオパレス21との情報連携等の撲滅の取組をサステナビリティの取組に印字しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
