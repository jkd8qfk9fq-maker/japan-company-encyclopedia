# モダリス — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社モダリス |
| 証券コード | 4883 |
| docID（データを取り出した文書） | `S100XSHO` |
| 原本 docID | `S100XSHO` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSHO.pdf / `yuho-2022` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSHO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社モダリス / 4883 / docID S100XSHO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
modalis-therapeutics: 7 件の数値を有報XBRLと照合
有報: 株式会社モダリス 有価証券報告書－第10期(2025/01/01－2025/12/31) (docID S100XSHO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
modalis-therapeutics: 本文の金額 1 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「yuho-2022」はどこからも引用されていません

## エージェントの判断記録（fragment warnings）

- businessModel: 事業収益は2021年12月期に1百万円、2022年12月期に40百万円が計上された後、2023年12月期から2025年12月期までは「－」（計上なし）であるため、2025年12月期の本文には事業収益の金額を書いていない。
- businessModel: 期間後の出来事として、2026年２月20日開催の取締役会で、資本金及び資本準備金の額の減少並びにその他資本剰余金の処分を、2026年３月26日開催予定の第10回定時株主総会に付議することを決議している。期間後の資本政策の決議であり、2025年12月31日現在の構成の登録には影響しないため、warningsのみとした。
- businessModel: 前期有報との修正再表示チェックは6系列すべて差異なしだった。適用時期の注意は、収益認識基準を第７期の期首から適用した旨の指標注記としてfinancialNotesに記録した。
- businessModel: MD&Aの損益段階の金額や経営指標に関する数値目標は書いていない。
- businessStructure: 本社（東京都中央区）と米国子会社の研究施設（マサチューセッツ州ウォルサム市）は、どちらも単一セグメントである遺伝子治療薬開発事業の設備として印字されている。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。個別に印字された仕入先はない。基盤技術の実施許諾を受けている東京大学、Editas Medicine, Inc.、The Broad Institute, Inc.との契約は【重要な契約等】に印字されているが、関連企業候補の一覧にないため関連企業には結んでいない。
- history: 省いた行: 2019年の米国子会社のケンブリッジ市内での移転・拡張、2020年の東京都中央区内での本社移転、2021年の米国子会社のウォルサム市への移転・拡張（拠点の移転であり、事業の転機ではないため）。
- history: Wikipediaの取得記事は企業一覧のページであり、当社の記事ではないため使わなかった。
- industry: 主たる業界は pharmaceuticals とした。当社グループは遺伝子治療薬開発事業の単一セグメントで、医薬品の開発そのものが事業であるため、閉じた分類の医薬品が当たる。
- relatedCompanies: astellas-pharma（アステラス製薬株式会社）: 2017年の共同研究契約と2019年のライセンス契約2件が沿革に印字されるが、2023年に当社が2件のライセンス契約の対象プログラムを再取得しており、現在の【重要な契約等】にも同社との契約はなく、現在の関係は印字されていないため結ばない。
- relatedCompanies: eisai（エーザイ株式会社）: 2019年の共同研究契約が沿革に印字されるのみで、現在の関係は印字されていないため結ばない。
- relatedCompanies: will（株式会社ウィル）: 一致箇所は「ウィルスベクター」などの部分一致のみで、同社への言及ではないため結ばない。
- relatedCompanies: port（ポート株式会社）: 一致箇所は「ポートフォリオ」の部分一致のみのため結ばない。
- relatedCompanies: nissin（株式会社日新）: 候補の listing がコードリストになく、一致箇所も新株予約権に関する定型文等の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: core（株式会社コア）: 一致箇所は「コアとなるプラットフォーム技術」の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: seki（セキ株式会社）: 一致箇所は「セキュリティ」の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: base-4481（ベース株式会社）: 一致箇所は「連結ベース」の部分一致のみのため結ばない。
- relatedCompanies: draft（株式会社ドラフト）: 候補の listing がコードリストになく、一致箇所は「ドラフトガイダンス」の部分一致のみのため結ばない。
- relatedCompanies: king（株式会社キング）: 一致箇所は「フレームワーキング」の部分一致のみのため結ばない。
- relatedCompanies: lec（レック株式会社）: 一致箇所は「フレックスタイム制度」の部分一致のみのため結ばない。
- relatedCompanies: step（株式会社ステップ）: 一致箇所は臨床試験の段階の説明における「ステップ」の部分一致のみのため結ばない。
- relatedCompanies: vision（株式会社ビジョン）: 一致箇所は「将来ビジョン」の部分一致のみのため結ばない。
- relatedCompanies: zero（株式会社ゼロ）: 一致箇所は「ゼロから行うこと」の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: alpha（株式会社アルファ）とalpha-4760（株式会社アルファ）: 一致箇所は監査法人である「アルファ監査法人」への言及であり、両候補の会社への言及ではないため結ばない。
- relatedCompanies: imura-and-co（株式会社イムラ）: 一致箇所は「タイムライン」の部分一致のみのため結ばない。
- relatedCompanies: kohsoku（株式会社高速）: 一致箇所は「より簡便かつ高速に」という一般語の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: matsui-securities（松井証券株式会社）: 大株主の状況に載る証券会社で、取引・提携の印字がないため結ばない。
- relatedCompanies: ray（株式会社レイ）: 一致箇所は「レイオフ」の部分一致のみ（ambiguous）のため結ばない。
- relatedCompanies: shinpo（シンポ株式会社）: 候補の listing がコードリストになく、一致箇所は「シンポジウム」の部分一致のみのため結ばない。
- relatedCompanies: the-lead（株式会社リード）: 一致箇所は「リードプログラム」の部分一致のみのため結ばない。
- relatedCompanies: 候補外のため結ばない相手: 基盤技術の実施許諾を受けている国立大学法人東京大学・株式会社東京大学TLO・Editas Medicine, Inc.・The Broad Institute, Inc.と、2024年にパートナーシップ契約を締結したGinkgo Bioworks社は候補一覧にないため関連企業には結ばない（契約の存在は【重要な契約等】と【沿革】に印字されている）。当社の連結子会社Modalis Therapeutics Inc.は関連企業には結ばない。
- terms: 助言: 用語「CRISPR-GNDM®」は、切断活性を不活化したCRISPR酵素にスイッチング分子を組み合わせ、遺伝子を切断せずに発現のオン・オフを制御する当社独自の創薬プラットフォーム技術で、【事業の内容】に印字されています。
- terms: 助言: 用語「エピゲノム編集」は、遺伝子の配列を書き換えることなく、エピジェネティクスの制御によって遺伝子の発現を調節する編集の考え方で、【事業の内容】に印字されています。
- terms: 助言: 用語「MDL-101」は、先天性筋ジストロフィー1A型（LAMA2-CMD）を対象とする当社のリードプログラムの開発コードで、【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】に印字されています。

## 要確認（status に反映）

- businessModel: 【事業等のリスク】に継続企業の前提に関する重要事象等が記載されています。医薬品の研究開発に多額の資金と長い期間を要するため、継続的な営業損失の発生と営業活動によるキャッシュ・フローのマイナスが続いており、継続企業の前提に重要な疑義を生じさせるような状況が存在していますが、当連結会計年度末現在の現金及び預金で翌連結会計年度の事業活動を展開するための資金は十分に確保しているとして、継続企業の前提に関する重要な不確実性はないと認識されています。重要な不確実性はないとする判断の扱いには人の確認が必要です。
- businessStructure: 【事業等のリスク】に継続企業の前提に関する重要事象等が記載されています。医薬品の研究開発に多額の資金と長い期間を要するため、継続的な営業損失の発生と営業活動によるキャッシュ・フローのマイナスが続いており、継続企業の前提に重要な疑義を生じさせるような状況が存在していますが、当連結会計年度末現在の現金及び預金で翌連結会計年度の事業活動を展開するための資金は十分に確保しているとして、継続企業の前提に関する重要な不確実性はないと認識されています。重要な不確実性はないとする判断の扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
