# クロスフォー — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社クロスフォー |
| 証券コード | 7810 |
| docID（データを取り出した文書） | `S100Z9I0` |
| 原本 docID | `S100Z9I0` |
| 提出日（原本） | 2026-10-22 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z9I0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社クロスフォー / 7810 / docID S100Z9I0（S100WWNJ から新しい有報に更新。旧成果物は pipeline/analysis/superseded/crossfor-S100WWNJ/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z9I0） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
crossfor: 10 件の数値を有報XBRLと照合
有報: 株式会社クロスフォー 有価証券報告書－第39期(2025/08/01－2026/07/31) (docID S100Z9I0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
crossfor: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 表示方法の変更（テニスチェーン・中空チェーンの独立掲記と前年度の組替え）は、経営指標等の数値そのものには影響せず、修正再表示チェックでも前期有報との差異はゼロでした。製品区分の年度比較に関わる事実のため financialNotes に記録しました。
- businessModel: 経営方針の「目標とする経営指標」は投資指標に当たるため本文・戦略には書かず、存在だけをここに記録します。
- businessModel: 重要な契約等に記載のGP上場企業出資投資事業有限責任組合を割当先とする新株予約権と転換社債型新株予約権付社債の発行（2025年12月決議、2026年１月に払込完了）は当期中の資金調達であり、期末時点の事業構造を変えるものではないため warnings にとどめました。
- businessModel: MD&Aの段階利益や事業撤退損の金額・理由は本文に書いていません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」でした。
- businessStructure: 単一セグメント（ジュエリー事業）のため、子区分はセグメント注記の【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）の区分を用い、金額の大きい順に並べました。
- businessStructure: 製品区分ごとの金額は千円単位の印字を百万円に切り捨てたため、6区分の合計（5,533百万円）は印字の合計5,536百万円と一致しません。印字の合計をそのまま引用しました。
- businessStructure: 中空チェーンの製造元YT Gold社は海外の未上場メーカーで関連企業候補にないため、関連企業には結ばず事業の説明に事実だけを書きました。
- businessStructure: 旧schemaのため suppliers は省略しました。製造は一部を除き外注工場への委託であり、特定の外注先名は開示されていません。
- businessStructure: 施設の状況の帳簿価額は金額を開示する対象外の情報として本文に書きませんでした。
- history: 沿革のうち、1989年の子会社設立と1993年・1999年の商号変更の連鎖、2013年の東京支店開設、2017年の本社移転、2018年・2025年の東京支店移転、2019年の日本経済団体連合会加入と甲府商工会議所第１号議員当選、2020年の知財功労賞受賞、2023年の監査等委員会設置会社への移行は、事業の転機ではないため落としました。
- history: 2014年に設立されたタイ子会社は2016年に全株式が売却されており、2024年の設立は同名の新しい子会社として別項目にしました。
- history: 創業（1980年の個人事業としての輸入宝石販売）は沿革表の対象外の前史であるため、項目にはせず warnings に記録します。
- industry: 主たる業界は、ジュエリー・アクセサリーの製造販売であることから、閉じた分類に宝飾品の区分が無いため、宝飾品の製造販売会社の前例（ツツミ・ナガホリ・エステールホールディングス）に揃えて retail を暫定としました（taxonomyGaps に記録）。売上高の全てがジュエリー事業（単一セグメント）によるものであるため、2つ目の業界は付けていません。
- relatedCompanies: kohsai（光・彩、7878）: 特定投資株式の保有目的に、同社が当社グループの取引先であり、加工費支払い等の継続的な営業取引が存在することが個別に記載されているため、加工を委託する相手（supplier）として結びました。計上額は書きませんでした。
- relatedCompanies: nihon-seimitsu（日本精密、7771）: 沿革に2019年10月の業務提携契約締結があるだけで、当期の重要な契約等や取引の記載がなく、過去の提携のみでは結ばない規則により結びませんでした。
- relatedCompanies: land（ランド、8918）: 本文の一致は「当社ブランド」の一般語で、株式会社ランドへの言及ではありません。結んでいません。
- relatedCompanies: core（コア、2359）: 本文の一致は「コア・コンピタンス」の一般語で、ambiguous のため結んでいません。
- relatedCompanies: base-4481（ベース、4481）: 本文の一致は「基本給のベースアップ」の一般語です。結んでいません。
- relatedCompanies: cota（コタ、4923）: 本文の一致は「インコタームズ」の一部で、ambiguous のため結んでいません。
- relatedCompanies: en（エン、4849）: 本文の一致は「エンゲージメント」の一部で、ambiguous のため結んでいません。
- relatedCompanies: port（ポート、7047）: 本文の一致は「顧客サポート」の一般語です。結んでいません。
- relatedCompanies: ricoh（リコー、7752）: 本文の一致は「製品リコール」の一般語です。結んでいません。
- relatedCompanies: slogan（スローガン、9253）: 本文の一致は経営の「スローガン」の一般語です。結んでいません。
- relatedCompanies: 関係会社の状況に載る5社は全て当社の連結子会社であり、関連企業には結びませんでした。親会社・持分法適用関連会社はありません。
- terms: 助言のみ。本文で使った用語の候補: Dancing Stone、EXL-LOCK、テニスチェーン、中空チェーン、クロスフォーカット、キュービックジルコニア、OEM です。
- terms: wikipedia.json はありませんでした（found: false）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] クロスフォーの主たる業界（ジュエリー・アクセサリーの製造販売） → 提案: jewelry（ジュエリー・宝飾品）。主事業は、特許技術「Dancing Stone」を用いたジュエリー・アクセサリー製品とそのパーツの製造販売であり、2026年7月期の売上高5,536百万円の全てがジュエリー事業（単一セグメント）によるものです。閉じた分類の19種に宝飾品・ジュエリーを表す区分がなく、宝飾品の製造販売会社の前例に揃えて、最も近い retail を暫定としました。
