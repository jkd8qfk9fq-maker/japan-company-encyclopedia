# 武蔵野銀行 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社武蔵野銀行 |
| 証券コード | 8336 |
| docID（データを取り出した文書） | `S100YDFO` |
| 原本 docID | `S100YDFO` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDFO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社武蔵野銀行 / 8336 / docID S100YDFO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 35 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-musashino-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社武蔵野銀行 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YDFO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-musashino-bank: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 報告セグメントの外部顧客に対する経常収益（銀行業91,255百万円、リース業11,687百万円、信用保証業912百万円、その他2,006百万円）の単純合計105,860百万円は、連結経常収益105,684百万円を176百万円上回ります。差異調整表によると貸倒引当金戻入益の調整額178百万円が控除されており、残り2百万円はセグメント小計の印字上の丸めです。
- businessModel: サービスごとの情報に印字された外部顧客に対する経常収益（貸出業務54,234百万円、有価証券投資業務25,572百万円、リース業務11,687百万円、その他14,189百万円）の単純合計105,682百万円は、印字の合計105,684百万円を2百万円下回ります。印字上の丸めです。
- businessModel: 経常収益と当期純利益の前期比増減率は、有価証券報告書に印字された当期・前期の金額から算出した。
- businessModel: ５年指標表に遡及修正の印字がないため、financialNotes は空です。
- businessModel: 2026年３月16日に100億円（上限）の自己株式の取得枠を設定し、株主優待制度の導入も決定しました。日常的な資本政策・株主還元のため、本文には記載しません。
- businessModel: 当行の調達先は、有価証券報告書が自社の調達について一般名詞で触れていないため、記載しません。
- businessStructure: サービスごとの情報（関連情報）に印字された金額は報告セグメントの内訳ではないため、銀行業の子事業には金額を書かず、businessModel の flow の収益ステージと industryPosition に集約した。
- businessStructure: ぶぎん総合リース株式会社の経常収益は連結経常収益の10％を超えていますが、関係会社の状況の注記に印字された金額であり、本文の財務数値は売上高と純利益のみとするため、事業の説明文には金額を書きません。
- history: 2014年２月、2017年５月、2019年４月の３つの年月と、ぶぎんビジネスサービス清算、むさしのハーモニー設立、信託業務開始の３つの事象が、沿革の印字で対応関係が崩れて並んでいるため、行の順序どおりに組み合わせて収録した。
- history: 1969年10月の行には東京証券取引所市場第二部への上場と1970年８月の市場第一部への上場の２件が、1975年２月の行には総合オンラインの稼動と1985年２月の第２次総合オンラインの稼動の２件が含まれているため、それぞれ２つの出来事に分けて収録した。
- history: 設立時の資本金と第１回無担保転換社債の発行額は、金額であるため本文には書いていない。
- industry: 報告セグメントは銀行業、リース業、信用保証業及びその他で、いずれも金融サービスに属するため、主たる業界は finance のみとした。
- relatedCompanies: daishi-hokuetsu-financial-group: 特定投資株式の保有目的は「ＴＳＵＢＡＳＡアライアンス」を通じた連携ですが、2026年３月31日現在の保有株式数はなく、当事業年度に売却されたため結ばなかった。
- relatedCompanies: gunma-bank: 特定投資株式の保有目的は「ＴＳＵＢＡＳＡアライアンス」を通じた連携ですが、2026年３月31日現在の保有株式数はなく、当事業年度に売却されたため結ばなかった。
- relatedCompanies: miyazaki-bank: 特定投資株式の保有目的はシステム共同化プロジェクトである「じゅうだん会」を通じた連携ですが、2026年３月31日現在の保有株式数はなく、当事業年度に売却されたため結ばなかった。
- relatedCompanies: tokio-marine-holdings: 保有目的が2026年３月期に純投資目的へ変更され、当事業年度末の保有株式数もないため結ばなかった。
- relatedCompanies: nomura-holdings: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、2026年３月31日現在の保有株式数もないため結ばなかった。
- relatedCompanies: sompo-holdings: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、2026年３月31日現在の保有株式数もないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 金融機関で、特定投資株式の当事業年度の保有もないため結ばなかった。
- relatedCompanies: daiwa-securities-group: 特定投資株式の保有目的は同社グループの金融商品販売など、金融関連業務における連携関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: mito-securities: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: shimizu-bank: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: toyama-bank: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: the-keiyo-bank: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: okinawa-financial-group: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、2026年３月31日現在の保有株式数もないため結ばなかった。
- relatedCompanies: ogaki-kyoritsu-bank: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、2026年３月31日現在の保有株式数もないため結ばなかった。
- relatedCompanies: okasan-securities-group: 特定投資株式の保有目的は金融関連業務における連携関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: yakult-honsha: 特定投資株式の保有目的は安定的・中長期的な取引関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: east-japan-railway: 特定投資株式の保有目的は安定的・中長期的な取引関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: jeol: 特定投資株式の保有目的は安定的・中長期的な取引関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: npr-riken: 特定投資株式の保有目的は安定的・中長期的な取引関係の維持・強化という定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: santec: 特定投資株式の保有目的は安定的・中長期的な取引関係の維持・強化という定型文言のみで、2026年３月31日現在の保有株式数もないため結ばなかった。
- relatedCompanies: 次の銘柄は、特定投資株式の保有目的が「同社との総合的な銀行取引関係の維持・強化」などの定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった：ブルーゾーンホールディングス、ベルク、西武ホールディングス、ハイデイ日高、リズム、エンプラス、日本フエルト、太平洋セメント、エイチワン、大成ラミックグループ、ピックルスホールディングス、ダイニック、朝日ラバー、東武鉄道、ナガワ、シグマ光機、中村屋、みのや、グラファイトデザイン、秩父鉄道、日本製紙、大崎電機工業、日本製罐、Ａ＆Ｄホロンホールディングス、ニッチツ、ヤマトモビリティ＆マニュファクチャリング。
- relatedCompanies: credit-saison: 百科事典にエントリがなく、コードリストにもないため結ばなかった。なお当事業年度に売却され、2026年３月31日現在の保有株式数もない。
- relatedCompanies: meiji-yasuda-life-insurance: 相互会社で未上場のため結ばなかった。
- relatedCompanies: sumitomo-life-insurance: 相互会社で未上場のため結ばなかった。
- relatedCompanies: maeda-glass: 未上場の大株主で、取引・提携の印字がないため結ばなかった。
- relatedCompanies: 日本マスタートラスト信託銀行、日本カストディ銀行、STATE STREET BANK: 信託口・名義口座のため結ばなかった。
- relatedCompanies: 武蔵野銀行従業員持株会、高橋慧: 自社の従業員持株会・個人のため結ばなかった。
- relatedCompanies: mitsui-sumitomo-trust-asset-management: 大量保有報告書の共同保有者で、受益所有が確認できないため結ばなかった。
- relatedCompanies: nikko-asset-management: 大量保有報告書の共同保有者で、受益所有が確認できないため結ばなかった。
- relatedCompanies: nomura-securities: 大量保有報告書の提出者で、受益所有が確認できないため結ばなかった。
- relatedCompanies: yaoko: コードリストになく、印字はブルーゾーンホールディングスの設立に関するもので同社自体との取引の印字がないため結ばなかった。
- relatedCompanies: 次の語は一般語・部分一致の誤抽出で、同社との関係の印字がないため結ばなかった：キャリア、ビジョン、コア、ポート、ベース、No.1、パス、セキ、イノベーション、ステップ、アルー、高速、コロナ、電算、レイ、レント、日新、トラスト。
- relatedCompanies: ちばぎんアセットマネジメント: 持分法適用関連会社で未上場のため、関連企業としては結ばず、事業構造の子事業として記載した。
- relatedCompanies: 連結子会社８社: 未上場のため、関連企業としては結ばず、事業構造の子事業として記載した。
- relatedCompanies: 持分法非適用の関連会社４社: 未上場のため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 2026年４月１日付で普通株式１株につき３株の株式分割を実施しました（2025年11月７日取締役会決議、基準日2026年３月31日）。株式数に基づく経営指標は、当該分割が2021年度の期首に行われたものと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
