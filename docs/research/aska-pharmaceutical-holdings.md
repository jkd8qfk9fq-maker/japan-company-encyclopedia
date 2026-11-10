# あすか製薬ホールディングス — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | あすか製薬ホールディングス株式会社 |
| 証券コード | 4886 |
| docID（データを取り出した文書） | `S100YEAY` |
| 原本 docID | `S100YEAY` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEAY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | あすか製薬ホールディングス株式会社 / 4886 / docID S100YEAY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 31 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
aska-pharmaceutical-holdings: 10 件の数値を有報XBRLと照合
有報: あすか製薬ホールディングス株式会社 有価証券報告書－第5期(2025/04/01－2026/03/31) (docID S100YEAY)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":100534000000,"latestFiling":104295000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":69195000000,"latestFiling":71814000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
aska-pharmaceutical-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの「財務諸表の組替え」の注意について：組替えの内容は、Ha Tay Pharmaceutical Joint Stock Companyとの企業結合に係る暫定的な会計処理の確定に伴う前連結会計年度の数値の見直しであり、主要な経営指標等の注記および企業結合等関係の注記に理由が印字されているため、financialNotes に記録した。表示方法の変更のみに当たる組替えは確認されなかった。
- businessModel: 重要な後発事象は、連結・個別のいずれの注記にも「該当事項はありません」と印字されている。当社自身の株式分割は印字されていない（株式数の増加に関する注記は、保有銘柄であるダイト株式会社の株式分割に関するものである）。
- businessModel: あすかアニマルヘルス株式会社と物産アニマルヘルス株式会社との販売契約が2026年6月22日に終了予定である旨が重要な契約等に印字されているが、グループの構成に関わる事項ではないため warnings に留めた。
- businessModel: 中期経営計画2028の目標数値（2028年度の売上高や比率の目標）は将来の目標であるため本文に書かなかった。財務戦略に印字される投資関連の指標名も本文に書かなかった。
- businessModel: MD&Aに印字される売上高と当期純利益以外の財務数値（中間の利益の内訳を含む）は本文に書かなかった。あすか製薬株式会社とあすかアニマルヘルス株式会社の主要な損益情報等（単体数値）も書かなかった。
- businessStructure: セグメントごとの外部顧客への売上高はセグメント注記の印字（百万円単位）どおりであり、合計71,127百万円は連結売上高の印字と一致する。
- businessStructure: 「その他事業」は報告セグメントに含まれない区分であり、臨床検査および医療機器等の事業を含む。金額はセグメント注記の「その他」の外部顧客への売上高を用いた。
- businessStructure: 海外事業は、前連結会計年度にHa Tay Pharmaceutical Joint Stock Companyを連結子会社化したことに伴い新たに追加された報告セグメントである。
- businessStructure: あすか製薬株式会社とあすかアニマルヘルス株式会社の主要な損益情報等（単体数値）は本文に書かなかった。
- history: 沿革は当社の沿革と、参考として印字されるあすか製薬株式会社の2021年3月までの沿革から主要な行を選んだ。資本金の金額は本文に書かなかった。
- history: あすか製薬の沿革で年月と事象が分かれて印字されている箇所（2013年6月・2017年4月・2018年10月の3つの年月と、あすかアニマルヘルス株式会社の設立、あすかActavis製薬株式会社の吸収合併、NeoASKA Pharma Private Limitedへの出資の3つの事象）は、数が一致するため行順に対応づけた。このうち、あすかアニマルヘルスの設立のみを採用し、吸収合併と海外出資の行は細目として省略した。
- history: 本社移転、出張所・営業所の開設、工場・研究所の新設・移転、ロンドンオフィスの開設（2021年）、日本硝子産業株式会社への出資（2021年）等の行は細目として省略した。
- industry: 主たる業界は、最大セグメントの医薬品事業（外部顧客への売上高58,927百万円）に基づき pharmaceuticals とした。アニマルヘルス事業（動物用医薬品）と海外事業（ベトナムでの医療用医薬品）も医薬品の製造・販売であり、独立した業界区分は付けなかった。その他事業（臨床検査・医療機器等）は金額が小さく、業界区分を付けなかった。
- relatedCompanies: kyorin-pharmaceutical（杏林製薬株式会社）: AKP-009の日本における開発・販売権の許諾契約は2025年8月までに解消されており、過去の関係のみであるため結ばなかった。
- relatedCompanies: torii-pharmaceutical（鳥居薬品株式会社）: あすか製薬株式会社が鉄欠乏性貧血治療剤の共同販促（コ・プロモーション）権を許諾する契約が重要な契約等に印字されているが、EDINETコードリストで上場を確認できないため結ばず、事実のみ warnings に残した。
- relatedCompanies: medipal-holdings（株式会社メディパルホールディングス）: 医薬品事業等における特約店であったが、保有株式を当事業年度に売却しており、結ばなかった。
- relatedCompanies: mitsubishi-hc-capital（三菱HCキャピタル株式会社）: リース取引にかかる取引先であったが、保有株式を当事業年度に売却しており、結ばなかった。
- relatedCompanies: kaga-electronics（加賀電子株式会社）: 保有株式を当事業年度に売却しており、保有目的も事業経営に関する定型的な記載のみであるため結ばなかった。
- relatedCompanies: daiichi-sankyo（第一三共株式会社）: 販売契約の相手方は同社の子会社である第一三共ヘルスケア株式会社であり、法人格が異なるため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 取引金融機関を傘下に持つ金融持株会社であり、財務面の取引関係（資金調達）のみであるため結ばなかった。大株主の状況に印字される株式会社三菱UFJ銀行は同社とは別の法人である。
- relatedCompanies: mebuki-financial-group: 取引金融機関を傘下に持つ金融持株会社であり、財務面の取引関係のみであるため結ばなかった。
- relatedCompanies: iyogin-holdings: 取引金融機関であり、財務面の取引関係のみであるため結ばなかった。
- relatedCompanies: the-toho-bank: 取引金融機関であり、財務面の取引関係のみであるため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: みなし保有株式として印字される金融持株会社であり、財務面の取引関係のみであるため結ばなかった。
- relatedCompanies: osaka-soda: 特定投資株式として保有するが、保有目的は事業経営の観点からの中長期的な関係維持と事業拡大という定型的な記載のみで、具体的な取引・提携の印字がないため結ばなかった。
- relatedCompanies: inabata-and-co: 特定投資株式として保有するが、保有目的は定型的な記載のみで、具体的な取引・提携の印字がないため結ばなかった。
- relatedCompanies: sankyu: ambiguous であり、保有目的も定型的な記載のみであるため結ばなかった。
- relatedCompanies: 自社グループの会社（連結子会社のあすか製薬株式会社、株式会社あすか製薬メディカル、あすかアニマルヘルス株式会社、Ha Tay Pharmaceutical Joint Stock Company、Ha Tay Pharmaceutical and Medical Equipment Joint Stock Companyと、持分法適用関連会社の日本硝子産業株式会社、Vietnam Hataphar Healthcare High Technology Pharmaceutical JSC、FTS Ambrose Holdings, Inc.、Tomodachi I.P. Holdings Inc.等）は結ばなかった。
- relatedCompanies: career: 「キャリア」という一般語への一致のため結ばなかった。
- relatedCompanies: en: ambiguous であり、本文中の一般語への一致のため結ばなかった。
- relatedCompanies: innovation: 「オープンイノベーション」という一般語への一致のため結ばなかった。
- relatedCompanies: aeon: 「イオンチャネル」という一般語への一致のため結ばなかった。
- relatedCompanies: freee: 「CO2フリー電力」という一般語への一致のため結ばなかった。
- relatedCompanies: ishin: 医薬品名の文脈への一致のため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」という一般語への一致のため結ばなかった。
- relatedCompanies: vision: 長期ビジョン「ASKA VISION 2035」の表記への一致のため結ばなかった。
- relatedCompanies: base-4481: 「連結ベース」という一般語への一致のため結ばなかった。
- relatedCompanies: rent: 「タレント」という一般語への一致のため結ばなかった。
- relatedCompanies: seki: ambiguous であり、一般語への一致のため結ばなかった。
- relatedCompanies: alpha-4760 / alpha: 一般語への一致のため結ばなかった。
- relatedCompanies: core: ambiguous であり、一般語への一致のため結ばなかった。
- relatedCompanies: teijin: ambiguous であり、本文中の一般的な言及のみで具体的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行株式会社（信託口）の表記への一致であり、コードリストにもないため結ばなかった。
- relatedCompanies: will / zero: 一般語への一致のため結ばなかった（zero は ambiguous）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
