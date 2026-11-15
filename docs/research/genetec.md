# ゼネテック — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ゼネテック |
| 証券コード | 4492 |
| docID（データを取り出した文書） | `S100YJQM` |
| 原本 docID | `S100YJQM` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJQM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ゼネテック / 4492 / docID S100YJQM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
genetec: 10 件の数値を有報XBRLと照合
有報: 株式会社ゼネテック 有価証券報告書－第41期(2025/04/01－2026/03/31) (docID S100YJQM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
genetec: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標の注記のうち従業員数の数え方の説明は表示上の事項のため、financialNotes には記録していません。株式分割の注記は financialNotes（2022年3月期）と needsReview に記録しています。
- businessModel: 棚卸資産の評価方法の変更（原材料・仕掛品の一部を個別法から移動平均法へ、当期第３四半期より。新基幹システムの導入を契機とし、影響額は軽微で遡及適用は行われていない旨が印字されています）は、登録している指標に影響しないため warnings のみの記録としています。
- businessModel: 株式会社モアソンジャパンの企業結合に係る暫定的な会計処理が当期に確定し、のれんが減少していますが、前期有報との指標照合は全系列で差異ゼロのため、financialNotes には記録していません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。中期経営計画の目標数値（売上高・自己資本利益率などの経営指標）は投資・利益指標のため、本文と perspectives に数値を書いていません。
- businessModel: MD&Aの段階利益の金額と理由、キャッシュ・フローの金額、減損損失の金額、設備の帳簿価額は書いていません。仕入先に当たる関係（MastercamのCNC Software, LLC、FlexSimのFlexSim Software Products, Inc.、PTCジャパン株式会社）は、このツリーのスキーマに suppliers キーがないため、businessStructure の warnings に記録しています。
- businessStructure: 当期より、「エンジニアリングソリューション事業」に含まれていた「EVC関連開発」を「システムソリューション事業」へ区分変更しています（前期のセグメント情報は変更後の区分で作成し直した旨が印字されています）。登録は当期の区分で行っており、前期の事業別数値は本文に書いていません。
- businessStructure: セグメント別の外部売上高の切捨て合計（6,761＋3,821＋399＝10,981百万円）は、印字された売上高合計10,983百万円と2百万円異なります（千円額の合計は10,983,293千円で一致します）。印字どおりに記録しています。
- businessStructure: 仕入・代理店関係として、Mastercamは米国CNC Software, LLCとの正規輸入代理店契約、FlexSimは米国FlexSim Software Products, Inc.との日本総代理店契約、Windchill等はPTCジャパン株式会社とのPTCパートナーネットワーク契約によります。このツリーのスキーマに suppliers キーがないため、ここに記録しています。
- businessStructure: 設備は本社ほか６事業所が３事業にまたがる統括業務施設のため、特定の事業には紐付けていません。連結子会社モアソンジャパンはシステムソリューション事業とエンジニアリングソリューション事業の両方にまたがります。
- history: 沿革のうち、営業所・事業所の開設や本社移転、ISO9001・ISO27001の認証取得、監査等委員会設置会社への移行は登録していません。2021年の増資は資本金の金額を含むため登録していません。株式分割（2021年・2024年）は financialNotes と needsReview に記録しています。
- history: 沿革に印字された子会社の吸収合併のうち、アプリハウス株式会社・株式会社TOPWELL（2024年）、株式会社バート・ログイン株式会社（2025年）は登録していません。ログイン株式会社の子会社化（2023年）とPTCジャパン株式会社とのパートナー契約（2022年）も登録していません。
- history: Wikipedia（ゼネテック、証券コード4492で照合）は見つかりましたが、有報の記載を超える内容がないため使用していません。
- industry: DEIの別記事業は「CTE」ですが、事業の実体に合わせて分類しました（このツリーのゲートに合わせ industryId キーで記録）。
- industry: it を主としました。組込みソフトウェアの受託開発と、CAD/CAM等のソフトウェア販売・導入支援が売上の大半を占めるためです。
- industry: 製造業向けのソフトウェア販売を含みますが、自ら製造を行う事業ではないため manufacturing は付けていません。防災アプリはサービス提供であり電気通信事業ではないため telecommunications は付けていません。
- industry: 合う区分が閉じた集合に無い事業はなく、直接の適合のため taxonomyGaps には記録していません。
- relatedCompanies: en（エン株式会社）：ambiguous で、「エンジニアリング」等の一般語の部分一致のみです。
- relatedCompanies: port（ポート株式会社）：「サポート」「レポート」の部分一致のみです。
- relatedCompanies: seki（セキ株式会社）：ambiguous で、「セキュリティ」の部分一致のみです。
- relatedCompanies: suzuki-6785（株式会社鈴木）：ambiguous で、役員の氏名「鈴木章浩」の一致のみです。
- relatedCompanies: base-4481（ベース株式会社）：「ベースにした」の一般語の一致のみです。
- relatedCompanies: zero（株式会社ゼロ）：ambiguous で、減損の評価における回収可能価額「ゼロ」の一般語の一致のみです。
- relatedCompanies: path（パス株式会社）：ambiguous で、「dバリューパス」の部分一致のみです。
- relatedCompanies: tein（株式会社テイン）：「インフォテインメント」の部分一致のみです。
- relatedCompanies: como（株式会社コモ）：ambiguous で、「ＮＴＴドコモ」の部分一致のみです。
- relatedCompanies: cover（カバー株式会社）：「カバーできず」の一般語の一致のみです。
- relatedCompanies: daiwa（ダイワ株式会社）：ambiguous で、大株主の住所「神奈川県大和市」の一致のみです。
- relatedCompanies: ntt（日本電信電話株式会社）：印字される相手は株式会社ＮＴＴドコモで、『ココダヨ』が同社の「dバリューパス」に採用されていますが、ＮＴＴドコモは候補のＮＴＴとは別法人（未上場の子会社）のため、ＮＴＴには結んでいません。
- relatedCompanies: aozora-bank（株式会社あおぞら銀行）：コミットメントライン契約の主な借入先の一つとして印字されるのみで、提携等の関係の印字はありません。
- relatedCompanies: career（株式会社キャリア）：「キャリア形成」の一般語の一致のみです。
- relatedCompanies: core（株式会社コア）：ambiguous で、「コア事業」の一般語の一致のみです。
- relatedCompanies: kohsoku（高速株式会社）：ambiguous で、「高速な処理」の一般語の一致のみです。
- relatedCompanies: land（株式会社ランド）：本社所在地「新宿アイランドタワー」の部分一致のみです。
- relatedCompanies: nissin（株式会社日新）：コードリストになく、新株予約権の脚注の部分一致のみです。
- relatedCompanies: the-lead（株式会社リード）：「リードタイム」の一般語の一致のみです。
- relatedCompanies: 候補外のため結ばなかった相手：ソニー株式会社・株式会社ニューフレアテクノロジー（前期の主要な顧客として印字されていますが、当期は売上高の10％以上を占める顧客はなく、候補にもありません）、株式会社KEN&パートナーズ（大株主で36.04％を保有しますが候補にありません）。特定投資株式は「該当事項はありません」。連結子会社の株式会社モアソンジャパンは自社の子会社のため対象外です。
- terms: 用語の提案（助言のみ）：「組込みシステム」（特定用途に特化した機能を果たすため、各種機械や機器に組み込まれるコンピュータシステム。同社の主力事業の中核）、「EVC（Engineering Value Chain）」（製造プロセスにおける設計部門を中心とした一連のシステム開発）、「PLM（製品ライフサイクルマネジメント）」（企画・要件定義から製造・配送・保守までの工程全体のライフサイクルを管理するシステム）、「CAD/CAM」（CADはコンピュータ支援設計、CAMはコンピュータ支援製造。同社の主力製品「Mastercam」が該当）、「エッジコンピュータ」（製造現場でセンサー等から得られる大容量データに対し、端末近くで高速な処理をするコンピュータ）、「インフォテインメント」（主に車載システムで用いられる、情報と娯楽の提供を実現するシステムの総称）。

## 要確認（status に反映）

- businessModel: 2021年９月１日付で普通株式１株につき２株の割合で株式分割を、2024年１月１日付で普通株式１株につき３株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第37期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2021年９月１日付で普通株式１株につき２株の割合で株式分割を、2024年１月１日付で普通株式１株につき３株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第37期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
