# アトミクス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アトミクス株式会社 |
| 証券コード | 4625 |
| docID（データを取り出した文書） | `S100YIIT` |
| 原本 docID | `S100YIIT` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIIT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アトミクス株式会社 / 4625 / docID S100YIIT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
atomix: 10 件の数値を有報XBRLと照合
有報: アトミクス株式会社 有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YIIT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
atomix: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の印字どおりに記載した（売上高127億63百万円・前期123億48百万円、塗料販売事業118億36百万円、施工事業9億27百万円、親会社株主に帰属する当期純利益9億45百万円・前期2億28百万円）。
- businessModel: MD&Aの印字するその他の利益項目の金額と理由、資産・負債・純資産の金額、キャッシュ・フローの金額、受注高の金額は規則により本文に記載していない。本文の財務数値は売上高と当期純利益のみとした。
- businessModel: 経営指標の注記のうち、潜在株式調整後1株当たり当期純利益を記載していないこと、従業員数は就業人員であること、日本マスタートラスト信託銀行（株式付与ESOP信託口）の株式を自己株式として扱うことは表示上の事項のためfinancialNotesには入れず、warningsのみとした。法人税等に関する会計基準の適用と第77期への遡及適用のみをfinancialNotesに記録した。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」のため、後発事象に関するneedsReviewはない。
- businessModel: 特定投資株式の三井化学の株式数が増えているのは三井化学自身の株式分割によるもので、当社の株式分割ではないためneedsReviewには入れていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（塗料販売事業11,836百万円、施工事業927百万円、2026年3月期）とした。子区分は【事業の内容】の製品区分で、金額が独立して開示されていないため金額は書かず、その旨を各子区分に明記した。
- businessStructure: 設備は、加須工場・久喜工場・岡山工場がセグメント欄で塗料販売事業と印字されている。本社と支店・営業所・その他は塗料販売事業・全社的管理業務・施工事業が連記されているため、特定の事業には結びつけていない。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。原料仕入先として特定投資株式の保有目的にDIC・石原産業・三井化学が印字されている（関連企業として結んだ相手はrelatedCompaniesに記録）。
- businessStructure: 連結子会社4社（アトムサポート株式会社、株式会社アブス、アトム機械サービス株式会社、アトムテクノス株式会社、いずれも議決権100%）は自社グループのため関連企業には結んでいない。アトムサポート株式会社は特定子会社に該当する。
- history: 沿革から、工場の完成（志村工場1949年、埼玉工場1971年、久喜工場1977年、大阪工場1985年、岡山工場1994年、新研究棟2014年）、本社・営業所の移転や昇格、ISO認証の取得、中国子会社（阿童木(廊坊)塗料有限公司・阿童木(無錫)塗料有限公司）の設立と清算、米国ボルチモアペイント社やマメコインターナショナル社との技術提携、タイのハイアップ・ホン社への技術供与、アトムライナー株式会社の吸収合併（1986年）、レイズ事業部の発足（2018年）などは、転機となる出来事に絞るため登録しなかった（各事実は沿革に印字されている）。
- history: 1988年の株式公開の行には増資の記載もあるが、資本金の金額は規則により記載していない。
- history: wikipedia.jsonは該当記事なし（found: false）のため使用していない。
- industry: 主たる業界はchemicalsとした。売上の大半を占める報告セグメントが塗料の製造・販売であり、塗料は化学製品であるためである。
- industry: 施工事業は自社製品を用いた工事で売上の1割未満にとどまり、塗料販売と一体の事業のため、construction等の第2の業界は付けていない。
- relatedCompanies: watahan-and-co: 特定投資株式の保有目的に「塗料販売事業の販売先」と個別に印字されているためcustomerとして結んだ。
- relatedCompanies: dcm-holdings: 特定投資株式の保有目的に「塗料販売事業の販売先」と個別に印字されているためcustomerとして結んだ。
- relatedCompanies: nippon-rietec: 特定投資株式の保有目的に「塗料販売事業の販売先」と個別に印字されているためcustomerとして結んだ。
- relatedCompanies: ishihara-sangyo-kaisha: 特定投資株式の保有目的に「塗料販売事業の原料仕入先」と個別に印字されているためsupplierとして結んだ。
- relatedCompanies: mitsui-chemicals: 特定投資株式の保有目的に「塗料販売事業の原料仕入先」と個別に印字されているためsupplierとして結んだ。保有株式数の増加は三井化学自身の株式分割によるものと印字されている。
- relatedCompanies: toyo-tec: 特定投資株式の保有目的に「支店・営業所の警備の委託先」と印字され、大株主の状況にも事業会社として載るためsupplierとして結んだ。
- relatedCompanies: kissei-pharmaceutical: 特定投資株式の保有目的が「長期的な友好関係の構築を図るため」という文言のみで、取引・提携の向きが印字されていないため結ばなかった。
- relatedCompanies: trust: コードリストにない相手で、株式付与ESOP信託口の文脈の部分一致のみのため結ばなかった。
- relatedCompanies: port: 「アトムサポート」の部分一致のみのため結ばなかった。
- relatedCompanies: career: 「キャリア」という一般語の部分一致のみのため結ばなかった。
- relatedCompanies: en: ambiguousな候補で、「エンゲージメント」という語の部分一致のみのため結ばなかった。
- relatedCompanies: suzuki-6785: ambiguousな候補で、役員の氏名の部分一致のみのため結ばなかった。
- relatedCompanies: ray: ambiguousな候補で、「レイズ事業部」の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481: 「シートベース」という設備の語の部分一致のみのため結ばなかった。
- relatedCompanies: seki: ambiguousな候補で、一般語の部分一致のみのため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 日本乾溜工業株式会社（特定投資株式の保有目的に塗料販売事業の販売先と印字）、DIC株式会社（同じく原料仕入先と印字）、楠本化成株式会社・ケーシー工業株式会社・ナラサキライン株式会社（大株主の事業会社）、東京中小企業投資育成株式会社（大株主だが投資育成会社で純投資）。
- terms: 助言のみ。用語としては『路面標示塗料』『溶着吹付式区画線塗装機（ヒートラインマーカー）』『塗膜防水材（アトムレイズ）』『コンクリート構造物の保護・補修材』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
