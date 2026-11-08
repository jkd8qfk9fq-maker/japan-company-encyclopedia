# 日本ゼオン — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本ゼオン株式会社 |
| 証券コード | 4205 |
| docID（データを取り出した文書） | `S100YJ12` |
| 原本 docID | `S100YJ12` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ12.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%82%BC%E3%82%AA%E3%83%B3

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本ゼオン株式会社 / 4205 / docID S100YJ12（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 61 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
zeon: 10 件の数値を有報XBRLと照合
有報: 日本ゼオン株式会社 有価証券報告書－第101期(2025/04/01－2026/03/31) (docID S100YJ12)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
zeon: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…削減の取り組み「ZΣ運動」などにより利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみとし、営業利益・経常利益・セグメント利益などの金額は書かなかった。地域別の内訳は売上高の内訳としてのみ書いた。
- businessModel: 組替え警告への対応：注記原文を確認し、流動負債の「未払金」の区分掲記や営業外収益の「補助金収入」の雑収入への統合に伴う前年度財務諸表の組替え（表示方法の変更）と特定した。売上高・純利益の系列には影響せず、修正再表示チェックも全項目一致だったためfinancialNotesには書かず、この判断を記録した。
- businessModel: financialNotesには、有形固定資産の減価償却方法の変更（定率法から定額法へ、2026年3月期より）の事実だけを書いた。セグメント利益への影響額は書いていない。
- businessModel: 中期経営計画「STAGE30」は方針の内容だけを書き、ROICなどの数値目標は書かなかった。
- businessModel: 連結子会社トウペの株式譲渡（決算日後の契約締結、譲渡は2026年11月2日予定）は、businessStructure成果物のneedsReviewに記録した。本文では2026年3月31日現在の状態で記載している。
- businessStructure: 事業の並び順は、報告セグメントを2026年3月期の外部顧客への売上高の大きい順（エラストマー素材事業221,756百万円→高機能材料事業124,163百万円）に並べ、有報が「報告セグメントに含まれない」と書く「その他」（66,047百万円）を最後に置いた。
- businessStructure: 上場市場は表紙の印字（東京証券取引所プライム市場）どおりとした。
- businessStructure: 連結子会社の株式会社トウペは、エラストマー素材事業（アクリルゴム）とその他の事業（塗料）にまたがる会社として【事業の内容】に載っている。事業の説明は2026年3月31日現在の状態で書き、決算日後の譲渡予定はneedsReviewに記録した。
- history: 1950年の設立の経緯（古河グループ各社とB.F.グッドリッチ社の資本・技術面の関わり）はWikipediaの補足を使い、出典にwikipediaを加えた。数値はWikipediaから使っていない。
- history: 沿革の表は年月と事象が続けて印字された崩れた表ではなく通常の記載だったため、全行を年順に整理し、主要な出来事16件に絞った。資本金の金額は書いていない。
- history: 1988年のZeon Chemicals Texas Inc.設立は、1989年の特殊ゴム事業買収の項目の中で触れた。
- industry: 主たる業界は、売上高の過半を占めるエラストマー素材事業（合成ゴムなどの化学製品の製造販売）からchemicalsとした。
- industry: 電子材料は高機能材料事業の中の一つの製品分野で、金額が独立して開示されていないため、semiconductorsは付けなかった。
- industry: 製品の販売先にはタイヤ・自動車関連メーカーが多いが、自動車部品そのものではなく化学素材を作る会社であるため、automotiveは付けなかった。
- relatedCompanies: 【関係会社の状況】に載る子会社56社と持分法適用関連会社1社（Zeon Advanced Polymix Co., Ltd.）はいずれも未上場で候補にないため結ばなかった。【大株主の状況】の上位は信託銀行・カストディ・生命保険会社・持株会などで、候補にある事業会社はなかった。
- relatedCompanies: en: 「エン」は地名・自社グループ会社名などの断片一致で、株式会社エンについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: innovation: 一般語「イノベーション」の一致で、株式会社イノベーションについての記載はないため結ばなかった。
- relatedCompanies: career: 一般語「キャリア」の一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: port: 「事業ポートフォリオ」の断片一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」の断片一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: land: タイ所在のグループ会社の記述などの断片一致で、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: nissin: 新株予約権などの記述の断片一致で、株式会社日新についての記載はなく、listing がコードリストにないため結ばなかった。
- relatedCompanies: vision: 「2030年のビジョン」の一般語の一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: dai-ichi-life-holdings: 特定投資株式の表に載るが、保有目的は従業員の福利厚生に関する保険取引であり、保険取引が理由のため結ばなかった。
- relatedCompanies: seki: 「情報セキュリティ」などの断片一致で、セキ株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: shibusawa-logistics: 特定投資株式の表に「棚卸資産の保管を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: aeon: 「リチウムイオン二次電池」の部分一致で、イオン株式会社についての記載はないため結ばなかった。
- relatedCompanies: core: 「スコア」などの断片一致で、株式会社コアについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: ricoh: 「リコール」の部分一致で、株式会社リコーについての記載はないため結ばなかった。
- relatedCompanies: sumitomo-chemical: S-SBR事業の合弁は2024年9月に解消され、同年10月に合弁会社を吸収合併済みであり、現在の取引・提携の記載はないため結ばなかった。合弁の統合と解消は沿革の出来事として記載した。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）の名称の部分一致で、株式会社トラストについての記載はなく、listing がコードリストにないため結ばなかった。
- relatedCompanies: aidemy: 特定投資株式の表で前事業年度の保有はあるが、当事業年度末日において同社株式は保有しておらず、取引・提携の記載もないため結ばなかった。
- relatedCompanies: bando-chemical-industries: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: brother-industries: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: cover: 「カバーできる」の一般語の一致で、カバー株式会社についての記載はないため結ばなかった。
- relatedCompanies: fuji-electric: 特定投資株式の表で前事業年度の保有はあるが、当事業年度末日において同社株式は保有しておらず、取引・提携の記載もないため結ばなかった。
- relatedCompanies: furukawa-electric: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: furukawa: 特定投資株式の表に「原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: harima-chemicals-group: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: hisamitsu-pharmaceutical: 特定投資株式の表で前事業年度の保有はあるが、当事業年度末日において同社株式は保有しておらず、取引・提携の記載もないため結ばなかった。listing もコードリストにない。
- relatedCompanies: idemitsu-kosan: 特定投資株式の表で「主要原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: iino-kaiun-kaisha: 特定投資株式の表に「原材料輸送の物流委託を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: iwatani: 特定投資株式の表に「原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: kanto-denka-kogyo: 特定投資株式の表に「工場設備の購入を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: kao: 特定投資株式の表で「主要原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。ambiguous の表示もある。
- relatedCompanies: maxell: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: mitsuboshi-belting: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: mitsui-chemicals: 特定投資株式の表で前事業年度の保有はあるが、当事業年度末日において同社株式は保有しておらず、取引・提携の記載もないため結ばなかった。
- relatedCompanies: mizuho-financial-group: 特定投資株式の表に載るが、保有目的は資金調達取引であり、金融機関の資金調達が理由のため結ばなかった。
- relatedCompanies: natoco: 連結子会社トウペの全株式の譲渡先だが、子会社株式の譲渡は一回の取引であり、継続的な取引・提携関係ではないため結ばなかった。譲渡契約（譲渡は2026年11月2日予定）は後発事象としてbusinessStructure成果物のneedsReviewに記録した。
- relatedCompanies: nichiban: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: nippon-light-metal-holdings: 特定投資株式の表で前事業年度の保有はあるが、当事業年度末日において同社株式は保有しておらず、取引・提携の記載もないため結ばなかった。
- relatedCompanies: nippon-paper-industries: 特定投資株式の表で「主要原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: nippon-shokubai: 特定投資株式の表で「主要原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: nitta: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: nitto-denko: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: okamoto-industries: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: raiznext: 特定投資株式の表に「工場設備の購入を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: rhythm: 市況の記述中の一般語の一致で、リズム株式会社についての記載はないため結ばなかった。
- relatedCompanies: sakai-chemical-industry: 特定投資株式の表で「主要原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: sankyo-tateyama: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: sankyu: 特定投資株式の表に「棚卸資産の保管を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。ambiguous の表示もある。
- relatedCompanies: sekisui-chemical: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: sekisui-jushi: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: sumitomo-rubber-industries: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: the-furukawa-battery: 特定投資株式の表で前事業年度の保有はあるが、当事業年度末日において同社株式は保有しておらず、取引・提携の記載もないため結ばなかった。listing もコードリストにない。
- relatedCompanies: the-yokohama-rubber: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: tigers-polymer: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: tokai-carbon: 特定投資株式の表で「主要原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: tokio-marine-holdings: 特定投資株式の表に載るが、保有目的は損害保険取引であり、保険取引が理由のため結ばなかった。
- relatedCompanies: tosoh: 特定投資株式の表で「主要原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: toyoda-gosei: 特定投資株式の表で「販売を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: toyota-tsusho: 特定投資株式の表で「主要原材料の調達を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: tsukishima-holdings: 特定投資株式の表に「工場設備の購入を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- relatedCompanies: yokogawa-electric: 特定投資株式の表に「工場操業システムの購入・保守、機器類の購入を中心とした取引先」という定型の保有目的が書かれているだけで、個別の提携・契約の記載がないため結ばなかった。
- terms: 助言: 「シクロオレフィンポリマー」は用語集に未登録です。日本ゼオン独自の高機能樹脂で、光学レンズや医療用途などに使われ、高機能材料事業の中心製品の一つとして有報に繰り返し現れるため、登録候補になります。
- terms: 助言: 「カーボンナノチューブ」は用語集に未登録です。徳山工場に製造プラントを持ち、CNT研究所を置く新しい炭素材料として有報に現れるため、登録候補になります。

## 要確認（status に反映）

- businessStructure: 重要な後発事象（提出後の予定事項）：2026年5月11日、塗料事業の譲渡を目的として、連結子会社の株式会社トウペの全株式をナトコ株式会社へ譲渡する契約を締結した。譲渡は2026年11月2日の予定で、トウペのアクリルゴム事業は譲渡に先立ち新設する完全子会社へ会社分割で承継させる予定。当エントリーは2026年3月31日現在（トウペは連結子会社）の状態で記載している。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
