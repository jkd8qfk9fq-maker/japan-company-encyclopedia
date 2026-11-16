# ソノコム — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ソノコム |
| 証券コード | 7902 |
| docID（データを取り出した文書） | `S100YJAF` |
| 原本 docID | `S100YJAF` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJAF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ソノコム / 7902 / docID S100YJAF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sonocom: 10 件の数値を有報XBRLと照合
有報: 株式会社ソノコム 有価証券報告書－第64期(2025/04/01－2026/03/31) (docID S100YJAF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
sonocom: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営方針に記載された今後の目標（九州ソノコム株式会社設立に当たっての連結売上高・利益の目標数値）は投資指標を含む目標であるため、本文・戦略には記載せず、存在のみ記録した。
- businessModel: 主要な経営指標等の注記５として、第64期の配当が2026年６月25日開催予定の定時株主総会の決議事項である旨が記載されている。資本政策に関する決議事項のためwarningsのみとした。
- businessModel: 主要な経営指標等の注記１～４（連結財務諸表を作成していない旨・創立60周年記念配当・潜在株式が存在しない旨・株価の市場出典）は表示・基礎事項であり既に基準情報に反映されているため、financialNotesには記載していない。
- businessModel: 設備の新設、除却等の計画（玉川工場・松戸工場の生産設備及び研究設備、2026年４月着手・2027年３月完了予定、自己資金による）は通常の設備投資計画としてwarningsのみとし、needsReviewには入れていない。金額は記載していない。
- businessModel: MD&Aの利益項目の金額・理由は本文に記載していない。生産実績・受注実績の金額も記載していない。
- businessModel: 研究開発費の金額は本文に記載していない（金額記載禁止の対象のため）。
- businessStructure: suppliersキーは旧スキーマのため省略した。主要な原材料は紗・枠・フィルム・感光剤・メタル材料であり、個別の仕入先は開示されていない。
- businessStructure: 単一セグメントでありセグメント情報の製品区分の記載が省略されているため、MD&Aの販売実績に印字された品目区分（スクリーンマスク／スクリーン印刷用資機材）をchildrenとした。
- businessStructure: 品目別の千円内訳の合計（2,712,843千円）は、印字された売上高合計（2,712,844千円）と1千円の差異がある。百万円への切り捨て後の内訳（2,314百万円＋398百万円）は印字合計の切り捨て値（2,712百万円）と一致するため、そのまま記載した。
- businessStructure: 主要な顧客である太陽誘電株式会社はrelatedCompaniesに記載した。
- history: 沿革から落とした行: 目黒工場設置（1973年）・玉川スクリーン工場設置（1987年）・玉川事業本部への移転と本社移転（1988年）・松戸第２工場新設（2005年）・足立工場閉鎖（2013年）・玉川工場の設備増強（2020年）・本社新社屋完成（2023年）などの拠点・設備の動き、フォト自動製図機・レーザープロッター・描画マシン等の設備導入行、リジダイズドワイヤーメッシュマスク開発（1984年）・新製法ファインパターン用メタルマスク開発（1990年）などの個別製品開発行、ＩＳＯ認証取得行（1999年・2007年）、組織変更行（1985年・2005年）、市場再編に伴う中間の移行行（2010年大阪証券取引所ＪＡＳＤＡＱ・2013年東京証券取引所ＪＡＳＤＡＱ（スタンダード））。資本金額は記載していない。
- history: Wikipediaはパック内で見つからなかったため使用していない。
- industry: 主たる業界は、電子業界向けのスクリーン印刷用マスク（電子部品の生産・プリント回路板の表面実装・液晶デバイスの生産用）の製造販売であるため、electronicsを直接の適合として主分類とした。半導体は研究開発の対象分野として言及されるにとどまるため、副次分類は付けていない。
- relatedCompanies: taiyo-yuden: 特定投資株式の保有目的は全銘柄共通の定型句のみであるため、リンクの根拠は主要な顧客ごとの情報における2期連続の主要顧客としての記載とした。
- relatedCompanies: maxell: ＥＦ２事業の承継に係る株式譲渡契約（2026年３月27日締結）の相手方だが、決算日後の子会社化に向けた一回限りの取引であり、決算日時点で継続的な取引・提携・資本関係の記載はないため結ばなかった。事象自体はbusinessModelのneedsReviewに記載した。
- relatedCompanies: murata-manufacturing / nomura-holdings: 特定投資株式の保有目的が全銘柄共通の定型句「取引関係等の円滑化のため」のみで、その相手についての個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group / mizuho-financial-group / resona-holdings: 特定投資株式の保有目的が同上の定型句のみであり、金融機関でもあるため結ばなかった。
- relatedCompanies: kyocera: 売掛金の相手先別内訳に名称があるのみで、取引の内容を述べた記載がないため結ばなかった。
- relatedCompanies: taya / suzuki-6785 / en / ic / kohsoku / ray: ambiguousな候補であり、役員氏名や一般語句の一致のみのため結ばなかった。
- relatedCompanies: trust: コードリストにない候補であり、信託銀行名の一部の一致のみのため結ばなかった。
- relatedCompanies: career / port / s-e: 一般語句の一致のみのため結ばなかった。
- relatedCompanies: 株式会社ノア（ＥＦ２事業を承継する新設会社）は非上場で関連企業候補に含まれておらず、決算日時点では未設立のため結ばなかった。
- terms: 助言: 用語「スクリーンマスク」は、スクリーン印刷に用いる版（マスク）で、同社の主力製品です。本文では有報の表記のまま用いています。
- terms: 助言: 用語「フォトマスク」は、写真製版の技術で作るマスクで、プリント基板や集積回路のパターン形成に使われます。本文では有報の表記のまま用いています。
- terms: 助言: 用語「ＥＦ２（Electro-Fine-Forming）」は、マクセル株式会社が営む精密微細加工技術を用いる事業の名称で、needsReviewの中で有報の表記のまま用いています。

## 要確認（status に反映）

- businessModel: 2026年３月27日開催の取締役会において、マクセル株式会社が営むＥＦ２（Electro-Fine-Forming）事業を吸収分割により継承する新設会社「株式会社ノア」（2026年４月17日設立）の全株式を取得し、子会社化することを決議し、同日付けで株式譲渡契約を締結しています。企業結合予定日は2026年７月１日で、結合後企業の名称は九州ソノコム株式会社となる予定です。本登録は2026年３月期（決算日時点）の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
