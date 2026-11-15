# シンフォニアテクノロジー — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | シンフォニアテクノロジー株式会社 |
| 証券コード | 6507 |
| docID（データを取り出した文書） | `S100YI4V` |
| 原本 docID | `S100YI4V` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI4V.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%B3%E3%83%95%E3%82%A9%E3%83%8B%E3%82%A2%E3%83%86%E3%82%AF%E3%83%8E%E3%83%AD%E3%82%B8%E3%83%BC

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | シンフォニアテクノロジー株式会社 / 6507 / docID S100YI4V（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sinfonia-technology: 10 件の数値を有報XBRLと照合
有報: シンフォニアテクノロジー株式会社 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YI4V)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sinfonia-technology: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意（本文に財務諸表の組替えの記載がある）について、修正再表示チェックは前期有報と全8行一致し、証拠テキストに表示方法の変更にあたる注記は確認できなかったため、組替えに関する financialNotes は書かず、判断経緯をここに記録しました。
- businessModel: 中期経営計画の数値目標（2027年度目標など）は、本文には売上高と当期純利益の実績だけを書く規則のため、perspectives にも金額・比率の目標は書いていません。
- businessModel: 株式会社大崎電業社の売却は needsReview に記録しました。
- businessStructure: 事業の並びは報告セグメントの外部顧客への売上高の大きい順（モーション機器事業→クリーン搬送システム事業→パワーエレクトロニクス機器事業→エンジニアリング＆サービス事業）としました。報告セグメントは4つで、「その他」にあたる区分はありません。
- businessStructure: 非連結子会社であったSINFONIA TECHNOLOGY (AMERICA) INC.は、重要性の観点から当連結会計年度より連結の範囲に含められています（【事業の内容】の注記）。
- businessStructure: 100％連結子会社であった株式会社大崎電業社は、当連結会計年度中に全株式を売却し連結の範囲から除外されています。この点は businessModel の needsReview に記録しました。
- history: 2010年の2件は、沿革表で年月セル（2010年2月・2010年10月）が連続して印字され事象文と分かれている崩れた表のため、年月と事象の数が一致することから行順で対応づけました（2010年2月＝株式会社ダイケンの全株式取得、2010年10月＝昕芙旎雅商貿（上海）有限公司の設立）。
- history: 1949年の設立の項目に、Wikipedia の補足（前身は神戸製鋼所の電気機械部門で1917年創業）を使いました。数値は使っていません。
- history: 沿革表の全件を収録しました。資本金の金額は沿革表に印字されていないため、記載はありません。
- industry: 主たる業界は electronics（電機）としました。4つの報告セグメントはいずれも電気機器・産業機器の製造・販売または関連工事・サービスであり、売上の中心です。
- industry: 2つ目に semiconductors を付けました。クリーン搬送システム事業（半導体製造装置用ハンドリング機器）と、モーション機器事業の半導体製造装置向けアクチュエータなど、半導体製造装置向けの製品を事業として開示しているためです。
- relatedCompanies: kobe-steel（神戸製鋼所）: 1949年に同社の再建整備計画に基づき独立した創業の経緯は沿革に記載しました。同社が設定した退職給付信託（日本マスタートラスト信託銀行株式会社（退職給付信託口・神戸製鋼所口））が当社株式の6.47％を保有し、議決権の行使の指図権限は同社が保有する旨の注記はありますが、大株主の状況に同社自体は名義として載っておらず、現在の取引の印字もないため結んでいません。
- relatedCompanies: 特定投資株式・みなし保有株式の相手は、保有目的が「取引関係を維持・強化するため」という全銘柄共通の定型句のみで、銘柄固有の取引の印字がないため結んでいません: shinsho（神鋼商事）、kanematsu（兼松）、mitsubishi-heavy-industries（三菱重工業）、murata-manufacturing（村田製作所）、nikkiso（日機装）、nippon-thompson（日本トムソン）、nabtesco（ナブテスコ）、screen-holdings（SCREENホールディングス）、sanwa-holdings（三和ホールディングス）、sojitz（双日）、kaga-electronics（加賀電子）、akasaka-diesels（赤阪鐵工所）、ana-holdings（ANAホールディングス）、hazama-ando（安藤・間）、nichiden（日伝）、nippon-electric-glass（日本電気硝子）。
- relatedCompanies: 金融機関（mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group、sumitomo-mitsui-trust-group、resona-holdings、san-ju-san-financial-group）: 株式の保有は資金調達等の金融取引の文脈のみのため結んでいません。大株主の状況に載る信託銀行・証券会社は純投資のため結んでいません。
- relatedCompanies: shimadzu（島津製作所）、the-hyakugo-bank（百五銀行）: 退職給付信託に拠出した信託財産を含むみなし保有株式の文脈で載るのみで、取引関係の印字がないため結んでいません。
- relatedCompanies: daiken（株式会社ダイケン、5900）: 沿革に載る「株式会社ダイケン」は現シンフォニアマイクロテック株式会社（子会社）であり、上場会社の株式会社ダイケンとは別会社のため結んでいません。
- relatedCompanies: agp（エージーピー）、kyoei-sangyo（協栄産業）: 候補データの listing がコードリストにないため結んでいません（いずれも当事業年度に保有株式を売却済みです）。
- relatedCompanies: shimizu（清水建設）、unicafe（ユニカフェ）: 当事業年度に保有株式を売却済みで、現在の関係の印字がないため結んでいません。
- relatedCompanies: 一般語・部分一致の誤マッチのため結んでいません: en（エンジニアリング＆サービス等の部分一致、ambiguous）、port（ポートフォリオの部分一致）、core（コア技術の部分一致、ambiguous）、career（キャリアパスの一般語）、ray（パワートレイン等の部分一致、ambiguous）、seki（情報セキュリティ等の部分一致、ambiguous）、base-4481（連結ベースの部分一致）、cota（インコタームズの部分一致、ambiguous）、hope（住所のストリート名）、kohsoku（高速化の一般語、ambiguous）、lec（フレックスタイムの部分一致）、path（キャリアパスの部分一致、ambiguous）、amuse（アミューズメント関連の一般語）、freee（フリーキャッシュ・フローの部分一致）、innovation（イノベーションの一般語）、ricoh（リコールの部分一致）、shinwa（人名の部分一致、ambiguous）。
- terms: 用語候補（助言のみ。用語の登録は行いません）: ロードポート（半導体ウエハを搬送する容器を製造装置に接続する装置で、クリーン搬送システムの主力製品）、EFEM（ロードポートを組み込んだシステム製品）、パーツフィーダ（振動を利用して部品を整列・供給する装置）、電磁クラッチ・ブレーキ（電磁力で動力の伝達と制動を行う部品）、アクティブ制振装置（振動を検知して打ち消す装置）。

## 要確認（status に反映）

- businessModel: 当連結会計年度において、100％連結子会社であった株式会社大崎電業社の全株式を売却し、同社に対する支配を喪失したため、同社を連結の範囲から除外した。本登録は売却後の2026年3月期の事業構成に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
