# ＲＳ　Ｔｅｃｈｎｏｌｏｇｉｅｓ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＲＳ　Ｔｅｃｈｎｏｌｏｇｉｅｓ |
| 証券コード | 3445 |
| docID（データを取り出した文書） | `S100XUA2` |
| 原本 docID | `S100XUA2` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUA2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＲＳ　Ｔｅｃｈｎｏｌｏｇｉｅｓ / 3445 / docID S100XUA2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
rs-technologies: 10 件の数値を有報XBRLと照合
有報: 株式会社ＲＳ　Ｔｅｃｈｎｏｌｏｇｉｅｓ 有価証券報告書－第16期(2025/01/01－2025/12/31) (docID S100XUA2)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-12-31","previousFiling":34620854000,"latestFiling":34620000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-12-31","previousFiling":49864656000,"latestFiling":49864000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":51893198000,"latestFiling":51893000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":59200997000,"latestFiling":59200000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-12-31","previousFiling":3304242000,"latestFiling":3304000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-12-31","previousFiling":7739192000,"latestFiling":7739000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-12-31","previousFiling":7703340000,"latestFiling":7703000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":9446865000,"latestFiling":9446000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":8833359000,"latestFiling":8833000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":15500440000,"latestFiling":15500000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":14921463000,"latestFiling":14921000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":15668114000,"latestFiling":15668000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":78997625000,"latestFiling":78997000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":127554681000,"latestFiling":127554000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":140665916000,"latestFiling":140665000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":182146828000,"latestFiling":182146000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":54951730000,"latestFiling":54951000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":101473488000,"latestFiling":101473000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":115428096000,"latestFiling":115428000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":135548043000,"latestFiling":135548000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
rs-technologies: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社RS　Technologies」が EDINET の提出者名「株式会社ＲＳ　Ｔｅｃｈｎｏｌｏｇｉｅｓ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックの差異（売上高・当期純利益・経常利益・総資産・純資産の2021年12月期から2024年12月期分）は、いずれも前期有報の千円単位の実額と当期有報の百万円表示との表示単位の差によるもので、百万円単位では全行が一致する。表示単位のみの差異のため financialNotes には記載せず warnings に留めた。
- businessModel: 連結財務諸表の表示方法の変更として、前連結会計年度の営業外費用の内訳表示の組替えが注記されているが、表示方法の変更のみで5年指標に影響しないため、financialNotes には記載せず warnings に留めた。
- businessModel: 2024年12月に連結子会社化した艾索精密部件（惠州）有限公司の取得原価の配分（負ののれん発生益1,500百万円）は2025年12月期中に確定し、2025年12月期には条件付取得対価の確定により新たに負ののれん発生益367百万円が発生した旨がセグメント注記に印字されているが、5年指標の印字に前期有報との差異は生じていないため warnings に留めた。金額は本文に記載していない。
- businessModel: 調達については、有報が資金需要の文脈でウェーハや半導体生産設備の仕入に触れるのみで、調達先を一般名詞で区分する記述がないため、businessModel.suppliers は省いた。
- businessModel: MD&Aのセグメント別売上高はセグメント間の内部売上高又は振替高を含むため、本文の金額にはセグメント注記の外部顧客への売上高を用いた。
- businessStructure: 子区分はセグメント注記の外部顧客への売上高の大きい順（半導体関連装置・部材等30,244百万円、ウェーハ再生事業27,528百万円、プライムシリコンウェーハ製造販売事業18,778百万円）に並べ、有報が報告セグメントに含まれないと明記する「その他」（155百万円）を最後に置いた。
- businessStructure: MD&Aのセグメント別売上高にはセグメント間の内部売上高又は振替高が含まれるため、子区分の金額にはセグメント注記の外部顧客への売上高を用いた。各区分の外部顧客への売上高の合計（76,705百万円）と連結売上高（76,707百万円）の差2百万円は有報の丸めであり、印字の数値をそのまま記載した。
- businessStructure: 事業名はセグメント注記の名称どおりに記載した（「半導体関連装置・部材等」は注記の表記に従い末尾の「事業」を付けていない）。
- history: 沿革のうち軽微な行は省略した: 2011年11月のISO9001:2008認証取得、2013年3月の古物商許可証取得と半導体生産設備の買取・販売開始、2015年6月の三本木工場第8工場竣工、2018年8月の山東有研半導体材料有限公司の設立、2020年2月の上海悠年半導体有限公司の設立、同年3月の山東有研RS半導体材料有限公司及び有研艾唯特（北京）科技有限公司の設立と同年7月の山東有研RS半導体材料有限公司の持分法適用会社化、2021年6月の有研半導体材料有限公司の株式会社化・社名変更、2023年10月の艾唯特（徳州）閥門科技有限公司の設立、2024年11月の艾斯科技（厦門）有限公司の設立、2025年8月の山東研晶石英科技有限公司の設立。
- history: 設立時の資本金は沿革に印字されていないため記載していない。
- industry: 売上高の大半を占める3つの報告セグメント（ウェーハ再生事業、プライムシリコンウェーハ製造販売事業、半導体関連装置・部材等）がいずれも半導体関連のため、主たる業界は semiconductors とした。
- industry: 蓄電池用電解液は半導体関連装置・部材等の一部として開示され独立した金額がなく、ソーラー事業は「その他」155百万円と小さいため、energy 等の業界は追加しなかった。
- relatedCompanies: en（エン株式会社）: 本文中の「エン」は他の語の一部として一致したもので、同社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: no-1（株式会社No.1）: 人材育成の標語「就業環境No.1」を目指す旨の記述に一致したもので、同社への言及ではないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「営業利益ベース」等の一般語に一致したもので、同社への言及ではないため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: EDINETコードリストにない相手であり、一致箇所も新株予約権の記載中の語の一部で、同社との関係の記述がないため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: リスク情報の文中での部分一致であり、同社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: technologies（株式会社テクノロジーズ）: 一致した「DGテクノロジーズ」は当社グループの連結子会社である株式会社DG Technologiesを指し、同社ではないため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: EDINETコードリストにない相手であり、一致したのは大株主の日本マスタートラスト信託銀行株式会社（信託口）で、信託銀行の信託口保有は結ばないため対象外とした。
- relatedCompanies: corona（株式会社コロナ）: 新型コロナウイルスへの言及に一致したもので、同社への言及ではないため結ばなかった。
- relatedCompanies: ic（株式会社IC）: 「ICチップ」の一般語に一致したもので、同社への言及ではないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「サポート」等の一般語の一部に一致したもので、同社への言及ではないため結ばなかった。
- relatedCompanies: suzuki-6785（株式会社鈴木）: 大株主の個人「鈴木正行」氏に一致したもので、同社への言及ではないため結ばなかった。
- relatedCompanies: 大株主のR.S. TECH HONG KONG LIMITED（発行済株式の35.85％）と那須マテリアル株式会社（同2.58％）は候補リストにない相手であり、結ばなかった。主要な顧客として開示されるSony Semiconductor Solutions CorporationとTaiwan Semiconductor Manufacturing Co., Ltd.も候補リストにないため結ばなかった。
- terms: 助言: 用語「モニタウェーハ」は、半導体製造過程のモニタリングを実施するために使用するウェーハ。有報の【事業の内容】の注記に定義がある。
- terms: 助言: 用語「ダミーウェーハ」は、半導体製造装置の立ち上げ、プロセス条件の確認、搬送系の動作確認等を目的として使用されるウェーハ。有報の【事業の内容】の注記に定義がある。
- terms: 助言: 用語「プライムシリコンウェーハ」は、カッティングされICチップとして製品化されるウェーハ（製品用シリコンウェーハ）。有報の【事業の内容】の注記に定義がある。
- terms: 助言: 用語「ファウンドリ」は、半導体産業において、実際に半導体デバイス（半導体チップ）を生産する工場のこと。有報の【事業の内容】の注記に定義がある。

## 要確認（status に反映）

- businessModel: 株式分割: 2023年1月1日付で普通株式1株につき2株の割合による株式分割を実施した。株式数に関する指標は第12期（2021年12月期）の期首に当該分割が行われたと仮定して算定されている旨が印字されている。登録は有報の印字どおり。
- businessModel: 重要な後発事象: 2026年1月31日、当社は100％連結子会社である株式会社DG Technologiesの当社保有株式の70％を、連結子会社の有研半導体硅材料股份公司へ譲渡した。同社は有研半導体硅材料股份公司の子会社となるが、売却後も当社が議決権の過半数を保有するため、連結子会社であることに変わりはない。また、2026年2月12日には有研半導体硅材料股份公司の当社保有株式のうち12,500,000株（発行済株式の1％）を売却した（売却後も連結子会社のままである）。さらに、有研半導体硅材料股份公司は2026年3月19日開催の董事会において、単結晶工場を建設する子会社 国晶半導体材料（包頭）有限公司（仮称）を2026年4月（予定）に設立することを決議した。登録は2025年12月31日現在の構造に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
