# ダイセキ — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ダイセキ |
| 証券コード | 9793 |
| docID（データを取り出した文書） | `S100Y63V` |
| 原本 docID | `S100Y63V` |
| 提出日（原本） | 2026-05-27 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y63V.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ダイセキ / 9793 / docID S100Y63V（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daiseki: 10 件の数値を有報XBRLと照合
有報: 株式会社ダイセキ 有価証券報告書－第68期(2025/03/01－2026/02/28) (docID S100Y63V)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daiseki: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: ダイセキ環境ソリューションの公開買付けによる完全子会社化（2025年12月上場廃止）と、株式会社杉本商事による有限会社杉本紙業の吸収合併（2026年2月21日）、ＳｙｎｃＭＯＦ株式会社のＭＯＦ事業の譲受け（2026年1月30日）はいずれも当期内の完了事項で期末の構成に反映されているため、needsReview ではなく沿革とここに記録した。
- businessModel: ＳｙｎｃＭＯＦの事業譲受けで発生したのれんは発生時に全額の減損処理がされており、当期純利益の減少要因として経営者分析に触れられているが、金額は本文に書かなかった。
- businessModel: 中期計画の目標値（2029年2月期の売上高・利益の金額）と連結ＲＯＥの目標・実績は、将来目標と比率のため本文に書かなかった。
- businessModel: ダイセキ環境ソリューションの主要な損益情報等（売上高など）は単体子会社の数値のため本文に書かず、連結売上高の10％超という位置づけだけを industryPosition に記した。
- businessModel: 前期有報との修正再表示チェックは全系列で一致した。本文の「財務諸表の組替え・遡及適用」の注意は、主要な経営指標等の注記にある収益認識基準の第65期からの適用を指すものと判断し、financialNotes に記録した。
- businessStructure: 単一セグメントのため報告セグメント別の売上高は開示されておらず、子事業の金額は収益認識関係の注記における収益の分解情報（外部顧客への売上高）の印字を用いた。並び順はその金額の大きい順。
- businessStructure: 事業の内容に挙がる石油化学製品・商品の製造販売と一般廃棄物の収集運搬は、収益の分解情報に独立した区分が無く金額が開示されていないため、独立した子事業にしなかった。
- businessStructure: 2026年2月21日に株式会社杉本商事が有限会社杉本紙業を吸収合併しており（期内の完了事項）、関係会社の状況の一覧は両社を含む連結子会社8社として印字されている。登録は有報の印字どおり8社の構成に基づく。
- history: 設立時の資本金（2百万円）は金額規則のため沿革に書かなかった。
- history: 沿革表で年月が続けて印字された崩れた箇所（2019年8月と2022年4月の2つの年月に対し、岐阜リサイクルセンター完成と市場移行の2つの事象文）は行順で対応づけた。市場移行の行（2022年）は採用し、岐阜リサイクルセンター完成の行は拠点完成の細目として沿革に採用しなかった。
- history: 事業所の開設・移転、子会社の設立などの細目は理由を記録のうえ沿革に採用しなかった（例：北陸ダイセキの設立1970年、千葉事業所の開設1997年、広島事業所の開設2024年）。
- history: 2026年2月の株式会社杉本商事による有限会社杉本紙業の吸収合併は、グループ内の再編であり期内の完了事項のため、沿革の行にはせず判断をここに記録した。
- industry: 環境・廃棄物処理に当たる業界区分が閉じた分類に無いため、chemicals を暫定とし、taxonomyGaps に記録した。
- relatedCompanies: daiseki-eco-solution（株式会社ダイセキ環境ソリューション）: 当社グループの連結子会社であり、上場廃止によりコードリストにもないため結ばなかった。
- relatedCompanies: sugimoto-and-co（杉本商事株式会社、9932）: 有報に印字される「株式会社杉本商事」は滋賀県彦根市の連結子会社であり、上場会社の杉本商事株式会社とは別の法人（自社子会社の同名）であるため結ばなかった。
- relatedCompanies: aichi-financial-group: 特定投資株式の保有目的が中部地区の企業の情報収集と長期安定的な金融取引関係の維持であり、金融取引が理由のため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的が主要取引金融機関としての金融取引関係の維持であり、資金調達が理由のため結ばなかった。
- relatedCompanies: 株式会社ホリコーポレーション: 大株主の状況に2.36％の保有が印字されるが、related-candidates に無く、取引関係の記載もないため結ばなかった。
- relatedCompanies: step: 「5ステップアプローチ」という収益認識の一般語への一致のため結ばなかった。
- relatedCompanies: path: 「パーパス」の一部への一致のため結ばなかった。
- relatedCompanies: core: 「エコアクション21」の一部への一致のため結ばなかった。
- relatedCompanies: en: 「エンジニアリング」の一部への一致のため結ばなかった。
- relatedCompanies: ishin: 気候変動シナリオの文中の一般語への一致のため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行の信託口表記への一致で、コードリストにもないため結ばなかった。
- relatedCompanies: career: 「キャリア志向」という一般語への一致のため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」という一般語への一致のため結ばなかった。
- relatedCompanies: orvis: 大量保有報告書における資産運用会社オービス・インベストメント・マネジメント・リミテッドへの言及で、取引関係の記載がないため結ばなかった。
- relatedCompanies: vision: 長期経営ビジョン「VISION2030」の表記への一致のため結ばなかった。
- relatedCompanies: zero: 「ゼロ・エミッション支援」の表記への一致のため結ばなかった。
- relatedCompanies: alpha-4760 / alpha: 大量保有報告書におけるグローバル・アルファ・キャピタル・マネージメントへの言及で、取引関係の記載がないため結ばなかった。
- relatedCompanies: base-4481: 「約定ベース」という一般語への一致のため結ばなかった。
- relatedCompanies: king: 「ルールメイキング」の一部への一致のため結ばなかった。
- relatedCompanies: ricoh: 大株主の住所欄にある株式会社ホリコーポレーションの社名の一部への一致のため結ばなかった。
- relatedCompanies: グループの連結子会社8社と、持分法を適用していない関連会社の株式会社グリーンアローズホールディングスは、自社グループの会社のため結ばなかった。

## 要確認（status に反映）

- businessModel: 2021年9月1日付で普通株式1株につき1.2株の割合で株式分割を実施。株式数に関する指標は2022年2月期（第64期）の期首に当該分割が行われたと仮定して算定。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ダイセキ（daiseki）の主たる業界（産業廃棄物の収集運搬・中間処理とリサイクル） → 提案: 環境・資源循環（廃棄物処理・リサイクル）。売上の中心は産業廃棄物の収集運搬・中間処理とリサイクルであり、閉じた分類（INDUSTRY_IDS）に環境・廃棄物処理に当たる区分が無い。廃棄物を再資源化して素材として供給するアミタホールディングスが chemicals を暫定としている先例に揃え、素材の製造に最も近い chemicals を暫定とした。
