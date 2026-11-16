# ラクオリア創薬 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ラクオリア創薬株式会社 |
| 証券コード | 4579 |
| docID（データを取り出した文書） | `S100XSQX` |
| 原本 docID | `S100XSQX` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSQX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ラクオリア創薬株式会社 / 4579 / docID S100XSQX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
raqualia-pharma: 10 件の数値を有報XBRLと照合
有報: ラクオリア創薬株式会社 有価証券報告書－第18期(2025/01/01－2025/12/31) (docID S100XSQX)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第17期(2024/01/01－2024/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
raqualia-pharma: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期（第17期）の有価証券報告書には訂正報告書（2025年３月31日提出）が存在するが、当期有報の主要な経営指標等と前期有報の当初XBRLとの修正再表示照合では、事業収益・当期純利益・利益・総資産・純資産・従業員数の全６系列で差異はゼロであり、登録する指標への影響はないためwarningsのみとした。
- businessModel: 「法人税、住民税及び事業税等に関する会計基準」（2022年改正適用指針）等を当期の期首から適用し前連結会計年度は遡及適用後の数値となっているが、同基準の変更による前連結会計年度の連結財務諸表への影響はない旨が印字されており、指標注記にも該当項目がないため、financialNoteにはせずwarningsのみとした。
- businessModel: 主要な経営指標等の注記１～３（潜在株式調整後１株当たり当期純利益・自己資本利益率・株価収益率の未記載理由、臨時雇用者数の表示）は表示上の事項であるためwarningsのみとした。注記４の収益認識基準の適用のみをfinancialNoteとした。
- businessModel: 期間後の第三者割当による新株式の発行（HK inno.N Corporationへの割当、2026年１月29日払込完了）は資本政策の手続きであるためwarningsのみとし、金額は書かなかった。
- businessModel: 経営成績の分析に印字される営業利益・経常利益等の金額、キャッシュ・フローの金額、研究開発費の金額、ファイメクスの共同研究に係る将来のマイルストンの上限額は、本文には書かなかった。
- businessModel: 中期経営計画2025-2027の数値目標は投資指標に当たるため、本文・戦略には数値を書かず定性的に記載した。
- businessStructure: 当社グループは単一セグメント（医薬品の研究開発）のため、事業は1つとし、【事業の内容】に印字されるプログラム分類（導出準備プログラム・導出済みプログラム・共同研究プログラム）を children とした。製品及びサービスごとの情報は単一区分が事業収益の90％を超えるため省略されており、区分ごとの金額は開示されていないため金額は書かなかった。
- businessStructure: 主要な設備（本社・研究開発部門・湘南アイパークラボ・ファイメクス本社他）は単一セグメントの設備であり、個別のプログラムには結びつけなかった。
- businessStructure: 連結子会社は2025年12月31日現在でテムリック株式会社（がん領域に特化した創薬事業、議決権100％）とファイメクス株式会社（タンパク質分解誘導を機序とする新規医薬品の研究開発、議決権100％）の2社。自社の子会社であり関連企業としては結ばない。
- businessStructure: ファイメクス株式会社とアステラス製薬の共同研究に係る将来のマイルストン（最大で150億円を上回る金額を受領する可能性）の記載は、将来の進捗に応じた条件付きの金額であるため本文には書かなかった。
- businessStructure: 期間後の第三者割当による新株式の発行（HK inno.N Corporationへの割当、2026年１月29日払込完了）は資本政策の手続きであるため、needsReviewには入れずwarningsのみとした。
- history: 沿革の設立時資本金（１百万円）は、資本金額を沿革に書かない規則により本文に書かなかった。
- history: 省略した出来事: 2014年９月の創薬研究部門生物研究部の名古屋市千種区への移転、2015年８月の化学研究部の移転、2017年１月のGALLIPRANT®の米国販売開始、2017年10月のENTYCE™の米国販売開始、2018年４月のラクオリア創薬産学協同研究センターの設置、2021年３月のELURA™の米国販売開始、2021年４月の岐阜薬科大学との共同研究講座設置契約、2021年９月のXgene Pharmaceutical Co. Ltd.とのTRPM8遮断薬の導出契約、2023年４月のVetbiolix SASとのオプション及びライセンス契約。いずれも拠点移転・個別製品の販売開始・個別契約であり、会社の転機となる出来事を優先した。
- history: Wikipedia（ラクオリア創薬）が見つかったが、冒頭文は有報の記載を超える補足を含まないため使用しなかった。
- industry: 主たる業界は、単一セグメントである医薬品の研究開発が事業の中心であるため pharmaceuticals とした。
- industry: 動物用医薬品用途での導出も行っているが、同じ医薬品の研究開発事業の一部であり、独立した業界区分は付けなかった。
- relatedCompanies: astellas-pharma: 【セグメント情報】の主要な顧客ごとの情報及び経営成績の分析の販売実績に主要な顧客として印字されており、さらに連結子会社ファイメクスとの共同研究が印字されているため customer として結んだ。金額は説明に書かなかった。
- relatedCompanies: d-western-therapeutics-institute: 【事業の内容】の共同研究プログラムに、眼疾患治療薬創製に向けた共同研究先として印字されているため business-partner として結んだ。
- relatedCompanies: veritas-in-silico: 【事業の内容】の共同研究プログラムに、mRNAを標的とした低分子医薬品の創出に向けた共同研究先として印字されているため business-partner として結んだ。
- relatedCompanies: advanced-media: 【大株主の状況】に事業会社の大株主として印字されているため major-shareholder として結んだ（2025年12月31日現在、0.92％）。
- relatedCompanies: asahi-kasei: 有報に印字される導出先は旭化成株式会社の子会社である旭化成ファーマ株式会社（P2X7受容体拮抗薬の導出先）であり、候補の旭化成株式会社とは別の法人のため結ばなかった。親会社への読み替えはしなかった。
- relatedCompanies: hisamitsu-pharmaceutical: 有報にナトリウムチャネル遮断薬の導出先として印字されているが、候補の listing が「コードリストにない」相手であるため結ばなかった。
- relatedCompanies: en / port / aeon / innovation / the-lead / land / alpha / alpha-4760 / ckd / corona / kohsoku / slogan / step / tear: いずれも一般語・部分文字列の一致のみ（イノエン、ポートフォリオ、カリウムイオン、オープンイノベーション、リード化合物等）で、各候補企業についての取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: nissin: 候補の listing が「コードリストにない」相手であり、印字も新株予約権の文脈における部分文字列の一致のみであるため結ばなかった。
- relatedCompanies: HK inno.N Corporation（韓国）は最大の顧客であり、tegoprazanの導出先かつ資本業務提携の相手だが、関連会社候補に含まれていないため結ばなかった（大株主の状況ではKOREA SECURITIES DEPOSITORY名義で印字）。
- relatedCompanies: Elanco Animal Health Inc.（米国）はgrapiprant及びcapromorelinの導出先であり主要な顧客で、当社が特定投資株式としてその株式も保有しているが、関連会社候補に含まれていないため結ばなかった。
- relatedCompanies: ファイザー株式会社は2025年12月31日現在で3.04％を保有する大株主として印字され、当社の研究基盤の起源でもあるが、関連会社候補に含まれていないため結ばなかった。
- relatedCompanies: 株式会社エス・ビー・シーは2025年12月31日現在で1.03％を保有する大株主として印字されているが、関連会社候補に含まれていないため結ばなかった。
- relatedCompanies: Xgene Pharmaceutical Co. Ltd.、株式会社AskAt、Vetbiolix SAS、Velovia Pharma, LLC は導出先・提携先として印字されているが、いずれも関連会社候補に含まれていないため結ばなかった。
- terms: 助言: 「導出（ライセンスアウト）」は、自社で創出した開発化合物の開発・製造・販売に関する権利を、契約により他の製薬企業等へ使用許諾することです。同社の収益の基本となる取引形態です。
- terms: 助言: 「マイルストン収入」は、導出先の研究開発の進捗や売上の進捗など、契約で定めた段階の達成に応じて受け取る収入です。
- terms: 助言: 「ロイヤルティ収入」は、導出先が医薬品を上市した後に、その販売額の一定割合として受け取る収入です。
- terms: 助言: 「モダリティ」は、医薬品の種類や作用の仕組みの分類を指す言葉で、低分子化合物、抗体医薬、標的タンパク質分解誘導剤などが含まれます。
- terms: 助言: 「カリウムイオン競合型アシッドブロッカー（P-CAB）」は、胃酸の分泌を抑える薬の種類の一つで、同社のtegoprazanが該当します。

## 要確認（status に反映）

- businessModel: 期間後の出来事として、2026年１月１日付で、当社を存続会社として完全子会社のテムリック株式会社を吸収合併しています。登録は2025年12月31日現在の連結子会社２社の構成で行っており、期間後の吸収合併の反映には人の確認が必要です。
- businessStructure: 期間後の出来事として、2026年１月１日付で、当社を存続会社として完全子会社のテムリック株式会社を吸収合併しています。登録は2025年12月31日現在の連結子会社２社の構成で行っており、期間後の吸収合併の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
