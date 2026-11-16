# センコン物流 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | センコン物流株式会社 |
| 証券コード | 9051 |
| docID（データを取り出した文書） | `S100ZDPU` |
| 原本 docID | `S100YKGW` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100ZDPU／有効文書 S100ZDPU（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100ZDPU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | センコン物流株式会社 / 9051 / docID S100YKGW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
senkon-logistics: 10 件の数値を有報XBRLと照合
有報: センコン物流株式会社 訂正有価証券報告書－第67期(2025/04/01－2026/03/31) (docID S100ZDPU)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":383878000,"latestFiling":333372000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":506407000,"latestFiling":499981000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":588079000,"latestFiling":515120000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":935308000,"latestFiling":925133000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":18029245000,"latestFiling":18051592000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":18836671000,"latestFiling":18862843000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":5760651000,"latestFiling":5710039000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":6123975000,"latestFiling":6067012000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第67期(2025/04/01－2026/03/31)、docID S100ZDPU）を有効文書としてこのパックを作った。原本は docID S100YKGW。原本との主要財務の差異: S100ZDPU（12件） — amendments.records[].comparedToBase を見ること
注意: 訂正有報の分類: financial-change — 数値が原本と異なる（主要財務 12 件／その他の数値 215 件: Assets・BasicEarningsLossPerShareSummaryOfBusinessResults・ComprehensiveIncome・ComprehensiveIncomeAttributableToNonControllingInterests・ComprehensiveIncomeAttributableToOwnersOfTheParent・ComprehensiveIncomeSummaryOfBusinessResults・DeferredTaxAssets・DilutedEarningsPerShareSummaryOfBusinessResults・EquityToAssetRatioSummaryOfBusinessResults・IncomeBeforeIncomeTaxes・IncomeTaxes・IncomeTaxesDeferred）。このパックの数値は有効文書のもの。原本の数値を出典にした記述が混ざっていないか確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
senkon-logistics: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書（S100ZDPU、2026年11月10日提出）が有効文書であり、本フラグメントの数値はすべて訂正後の値である。原本（S100YKGW、2026年6月25日提出）との主要財務の差異は12件で、分類は financial-change。主な変更: 親会社株主に帰属する当期純利益は2026年3月期167,333千円→48,508千円、2025年3月期506,407千円→499,981千円、2024年3月期383,878千円→333,372千円。営業収益は訂正の対象ではない。
- businessModel: 訂正の理由は有報の監査上の主要な検討事項（誤謬による役員退職慰労引当金の訂正）に印字されている: 役員退職慰労引当金の算定方法の再検討により、当社と連結子会社1社で期末要支給額の算定に誤りがあり過少計上されていた誤謬を把握し、金額に重要性があると判断して関連事項を訂正したもの。あわせて決算・財務報告プロセスにおける開示すべき重要な不備が識別された旨も印字されている。訂正は完了し訂正後の財務諸表に監査報告書が付されているため needsReview には入れず、影響を受けた年度（2024年3月期・2025年3月期・2026年3月期）に financialNotes を付けた。
- businessModel: 前期有報との修正再表示チェックの差異（純利益の2024年3月期・2025年3月期ほか）は、上記の誤謬訂正による変更と一致する。別途、表示方法の変更として、前連結会計年度の連結財務諸表の組替え（「流動負債」の「その他」に含めていた「前受金」の独立掲記）が注記されているが、表示の変更のみで経営指標の値に影響しないため financialNotes には入れていない。
- businessModel: 経営方針に目標とする経営指標（ROE）への言及があるが、投資指標の目標は本文・戦略に書かない規則のため、perspectives には含めていない。
- businessModel: 金額は有報の千円印字を百万円に切り捨てて表記した（営業収益19,919,026千円→19,919百万円、親会社株主に帰属する当期純利益48,508千円→48百万円、前期499,981千円→499百万円）。増減率はMD&Aの印字（営業収益は対前年同期比105.8％）から前期比5.8％増と表記した。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されている。提出後の文書は evidence の otherFilingsInWindow でも空であり、ack は不要と判断した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への営業収益の大きい順（乗用車販売10,120百万円、運送5,222百万円、倉庫4,124百万円、その他235百万円、再生可能エネルギー215百万円）。【事業の内容】の記載順（運送、倉庫、乗用車販売、再生可能エネルギー、その他）とは異なる。
- businessStructure: セグメント別の外部顧客への営業収益は千円印字（乗用車販売10,120,438千円、運送5,222,405千円、倉庫4,124,742千円、その他235,520千円、再生可能エネルギー215,918千円）を百万円へ切り捨てて転記した。切り捨て後の5事業の合計は19,916百万円で、印字の連結営業収益19,919百万円と3百万円異なるが、印字の値をそのまま用いた。MD&Aのセグメント別営業収益（運送5,225百万円等）は内部営業収益を含む数値のため使っていない。
- businessStructure: 連結子会社7社（株式会社ホンダカーズ埼玉西、株式会社センコンエンタープライズ、株式会社センコン・マテリアル、山陰センコン物流株式会社ほか）は当社グループの会社であり、関連企業リンクの対象ではないため構造の説明にとどめた。持分法適用関連会社の久保洪潤科技発展（大連）有限責任公司（議決権の78.5％を所有、アグリ事業）も同様にリンク対象ではない。
- businessStructure: 【関係会社の状況】の注記に、株式会社センコンエンタープライズ（債務超過302,143千円）と株式会社センコン・マテリアル（債務超過507,939千円）が債務超過の状況にあることが2026年3月末時点で印字されている。金額は本文には書かず、この記録に留めた。
- businessStructure: suppliers はこのツリーのスキーマに無いため書いていない。乗用車販売事業の仕入先である本田技研工業株式会社については relatedCompanies に記録した。
- history: 沿革は営業所の開設・移転や事業区域の拡大などの細目が多いため、設立、事業の開始、商号変更、株式公開、子会社設立、資本・業務提携、認定取得、市場移行の節目に絞った。
- history: 沿革に印字された資本金の金額（設立時の100万円、1996年・2007年の資本金額）は、規則により本文・沿革のいずれにも書いていない。
- history: 2007年の提携先は沿革の印字どおり「株式会社日立物流（現ロジスティード株式会社）」と記録した。
- industry: 主たる業界は、指示書の規則（主たる業界は売上の大半を占める報告セグメントで決める）に従い、外部顧客への営業収益が最も大きく過半（19,919百万円のうち10,120百万円）を占める乗用車販売事業から automotive とした。当社は社名・東証の業種区分（陸運）では物流会社であり、この点は判断が分かれ得るため記録する。
- industry: 運送事業（5,222百万円）と倉庫事業（4,124百万円）を合わせた物流の2事業が約5割弱を占めるため、2つ目に transportation を付けた。再生可能エネルギー事業は報告セグメントとして独立に開示されている（215百万円）ため、3つ目に energy を付けた。その他の事業に含まれる不動産事業・葬祭事業・採石事業は独立した開示が無いため、業界は付けなかった。
- relatedCompanies: en（エン）: 「センコンエンタープライズ」の文字列の一致のみで、同名の相手方との取引等の記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「連結ベース」の語句の一致のみで、取引等の記載はないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 大株主の「株式会社プロフィットイノベーション」は候補の株式会社イノベーションとは別の法人であり、候補本人との取引等の記載はないため結ばなかった。
- relatedCompanies: port（ポート）: 「事業ポートフォリオ」の語句の一致のみで、取引等の記載はないため結ばなかった。
- relatedCompanies: seki（セキ）: 曖昧な一致で、情報セキュリティ等の文脈の語句の一致のみであり、取引等の記載はないため結ばなかった。
- relatedCompanies: daiwa（大和）: 曖昧な一致で、所在地「大和町」の地名の一致のみであり、取引等の記載はないため結ばなかった。
- relatedCompanies: iseki-and-co（井関農機）: 保有目的は、同社グループに属する物流会社との取引を通じて農業機械等の輸送・保管に関与していることに伴う物流需要や市場動向の把握であり、同社本人との取引の記載はないため結ばなかった。
- relatedCompanies: the-77-bank（七十七銀行）: 主要取引金融機関であり大株主（2026年3月31日現在3.00％）でもあるが、資金調達や金融取引を理由とする金融機関であり、事業会社ではないため結ばなかった。
- relatedCompanies: ana-holdings（ANAホールディングス）: 保有目的が輸送インフラや輸送市場の動向把握のみで、取引の記載はないため結ばなかった。
- relatedCompanies: hirata（平田機工）: 保有目的が製造分野の市場動向・技術動向の把握のみで、取引の記載はないため結ばなかった。
- relatedCompanies: japan-airlines（日本航空）: 保有目的が輸送・物流市場の動向把握のみで、取引の記載はないため結ばなかった。
- relatedCompanies: nissin（日新）: コードリストになく上場が確認できず、新株予約権の文脈の語句の一致のみであるため結ばなかった。
- relatedCompanies: path（パス）: 曖昧な一致で、「パスワード」の語句の一致のみであるため結ばなかった。
- relatedCompanies: solxyz（ソルクシーズ）: 保有目的はIT分野の技術・市場動向の把握やデジタル化推進の参考であり、取引の記載はないため結ばなかった。同社が当社の株式を保有する旨の記載はあるが、大株主の状況の上位には載っていない。
- relatedCompanies: t-and-d-holdings（T＆Dホールディングス）: 保有目的が金融・保険分野や資本市場の動向把握のみで、取引の記載はないため結ばなかった。
- relatedCompanies: tohoku-electric-power（東北電力）: MD&Aの「東北電力管内での出力制御」は発電所が立地する地域・系統への言及で、同社との取引の記載はないため結ばなかった。
- relatedCompanies: ロジスティード株式会社（2026年3月31日現在で発行済株式の10.12％を所有する筆頭株主。2007年に資本・業務提携）と株式会社富士ロジテックホールディングス（同9.15％。2019年に資本・業務提携）は、related-candidates.json に含まれていないため結ばなかった（ロジスティードは現在非上場）。
- terms: 助言: 用語「3PL」は、企業物流の包括的受託を指す当社の注力事業の呼称で、経営方針やMD&Aに「3PL（企業物流の包括的受託）事業」と印字されています。
- terms: 助言: 用語「レコードマネジメントサービス」は、文書や記録媒体の保管・管理を請け負う当社の事業（RM事業部が担当）の呼称として、経営方針や沿革に印字されています。
- terms: 助言: 用語「認定通関業者（AEO）」は、税関から認定を受けた通関業者の制度で、2021年に認定を受けたことが沿革に印字されています。
- terms: 助言: 用語「政府倉庫指定」は、農林水産省から政府所有米穀の保管倉庫として指定を受ける制度で、山形・新潟・古川の各営業所の低温倉庫が指定を受けたことが沿革に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
