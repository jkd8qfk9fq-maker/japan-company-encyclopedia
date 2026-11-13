# ダイニック — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ダイニック株式会社 |
| 証券コード | 3551 |
| docID（データを取り出した文書） | `S100YFSH` |
| 原本 docID | `S100YFSH` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFSH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ダイニック株式会社 / 3551 / docID S100YFSH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 38 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dynic: 10 件の数値を有報XBRLと照合
有報: ダイニック株式会社 有価証券報告書－第163期(2025/04/01－2026/03/31) (docID S100YFSH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
dynic: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額はMD&Aと連結経営指標等の百万円単位の印字を基本とし、セグメント別の外部顧客への売上高はセグメント注記の千円単位の印字を百万円未満で切り捨てました。切り捨てのためセグメント合計（44,225百万円）は連結売上高44,227百万円と一致しません。
- businessModel: 表示方法の変更の注記（前連結会計年度に支払手形及び買掛金に含めていた電子記録債務を、当連結会計年度より独立掲記したことに伴う前年度財務諸表の組替え）は、表示の変更のみのためfinancialNotesには入れず、このwarningsにとどめました。前期有報との修正再表示チェックは全系列で一致しています。
- businessModel: 当連結会計年度に中国子会社である昆山司達福紡織有限公司を売却し、連結の範囲から除外しました。期中に完了し、期末のグループ構成に反映されているためneedsReviewには入れず、このwarningsに記録しました。売却に関する金額は書いていません。また、関連会社であったTPCNIC Co.,Ltd.の売却も注記されていますが、金額は書いていません。
- businessModel: 重要な後発事象として、2026年5月15日の取締役会で自己株式の取得を決議したことが印字されています（取得期間は2026年5月22日から2027年3月31日まで）。資本政策に関する決議のためneedsReviewには入れず、このwarningsに記録しました。取得価額の総額などの金額は書いていません。
- businessModel: 新中期経営計画の数値目標（連結ベースの収益性に関する指標など）は、投資に関する語や本文に書けない指標を含むため転記せず、このwarningsにとどめました。計画の名称と取組みの内容はperspectivesのstrategyに記録しました。
- businessModel: 調達先については、有報が当社製品の材料等の資材調達先という一般名詞で述べている範囲だけをsuppliersに書き、個別の会社名は書いていません。
- businessStructure: 事業名はセグメント注記の印字どおりとし、外部顧客への売上高の大きい順に並べました。「その他」は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: セグメントの外部顧客への売上高は、セグメント注記の千円単位の印字を百万円未満で切り捨てて百万円単位にしました（印刷情報関連事業22,381,380千円、住生活環境関連事業11,908,531千円、包材関連事業7,990,641千円、その他1,946,606千円）。切り捨てのため、区分の合計は連結売上高の印字と一致しません。
- businessStructure: MD&Aのセグメント売上高はセグメント間の内部売上高を含む数値のため、事業別の金額には使わず、セグメント注記の外部顧客への売上高を使いました。
- businessStructure: 関係会社の資本金の金額は書いていません。
- history: 沿革の各行は年月まで印字されていますが、historyの形に月は書けないため年に畳み、代表的な月はdescriptionに残しました。創業時などの資本金の金額は書いていません。
- history: 1990年の行は、沿革表で1990年3月と1990年9月の年月セルが連続して印字され、オフィス・メディア株式会社の買収と英国子会社の設立の事象文と分かれている崩れた表のため、年だけを採り両方の出来事を1行にまとめました。月と出来事の個別の対応は断定していません。
- history: 沿革にはこのほか工場の認証取得や営業所の開設・移転などが多数印字されていますが、主要な設立・上場・商号変更・海外展開・再編を中心に選びました。
- industry: 主たる業界は、最大の報告セグメントである印刷情報関連事業（外部顧客への売上高22,381百万円）をはじめ、クロス・不織布・フィルムなどの素材製造が事業の基盤であることから決めました。繊維に当たる区分が閉じた分類に無いため、繊維・素材メーカーの先例に揃えてchemicalsを暫定の主たる業界とし、taxonomyGapsに記録しました。
- industry: 住生活環境関連事業や包材関連事業も素材製造の範囲としてchemicalsに含め、別途の業界は付けませんでした。
- relatedCompanies: ヤクルト本社（yakult-honsha）は大株主の事業会社（2.52％、2026年3月31日現在）のためmajor-shareholderとして結びました。当社からの保有目的はセグメント名を替えた定型句ですが、大株主としての資本関係自体が根拠です。
- relatedCompanies: コクヨ（kokuyo）は大株主の事業会社（2.04％、2026年3月31日現在）のためmajor-shareholderとして結びました。みなし保有株式として退職給付信託に拠出されている同社株式は根拠に使っていません。
- relatedCompanies: 東京インキ（tokyo-printing-ink-mfg）と中越パルプ工業（chuetsu-pulp-and-paper）は、特定投資株式の保有目的に全銘柄共通の定型句ではなく「当社製品の材料等の資材調達先」という固有の役割が印字されているためsupplierとして結びました。株式数は当事業年度の印字（株式分割後の数）です。
- relatedCompanies: エン（en）: ambiguousで、「エン」などの一般的な文字列の部分一致のため結びませんでした。
- relatedCompanies: ベース（base-4481）: 「営業利益ベース」などの一般語の部分一致のため結びませんでした。
- relatedCompanies: コタ（cota）: ambiguousで、「インコタームズ」の部分一致のため結びませんでした。
- relatedCompanies: 第一ライフグループ（dai-ichi-life-holdings）: 特定投資株式の保有目的は保険取引の円滑化であり、保険取引が理由の相手は結ばないため結びませんでした。
- relatedCompanies: 良品計画（ryohin-keikaku）: みなし保有株式として退職給付信託に拠出されているだけであり、退職給付信託の相手は結ばないため結びませんでした。
- relatedCompanies: 住友不動産（sumitomo-realty-and-development）: 特定投資株式の保有目的はセグメント名を替えた定型句（事業活動の円滑化と取引関係の維持・発展）のみで、固有の取引の役割が印字されていないため結びませんでした。
- relatedCompanies: 武蔵野銀行（the-musashino-bank）: 大株主にも載りますが金融機関であり、特定投資株式の保有目的も資金調達などの金融取引関係の維持のため結びませんでした。
- relatedCompanies: 滋賀銀行（the-shiga-bank）: 大株主にも載りますが金融機関であり、特定投資株式の保有目的も資金調達などの金融取引関係の維持のため結びませんでした。
- relatedCompanies: キャリア（career）: 「グローバルキャリアエントリー制度」などの人事制度の一般語の一致のため結びませんでした。
- relatedCompanies: カーリット（carlit）: 特定投資株式の保有目的はセグメント名を替えた定型句のみで、固有の取引の役割が印字されていないため結びませんでした。
- relatedCompanies: コア（core）: ambiguousで、「コア技術」という一般語の一致のため結びませんでした。
- relatedCompanies: 大和ハウス工業（daiwa-house-industry）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: 日本紙パルプ商事（japan-pulp-and-paper）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: キングジム（king-jim）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: 高速（kohsoku）: ambiguousで、「高速充填」という一般語の一致のため結びませんでした。
- relatedCompanies: 雪印メグミルク（megmilk-snow-brand）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: 盟和産業（meiwa-industry）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: みずほフィナンシャルグループ（mizuho-financial-group）: 保有目的は資金調達などの金融取引関係の維持のため結びませんでした。その子会社である銀行が大株主であることとも別法人として扱いました。
- relatedCompanies: MS＆ADインシュアランスグループホールディングス（ms-and-ad-insurance-group-holdings）: 保有目的は保険取引の円滑化であり、保険取引が理由の相手は結ばないため結びませんでした。
- relatedCompanies: ムサシ（musashi）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: 日新（nissin）: listingがコードリストになくambiguousであり、当事業年度に全株式を売却して保有していないため結びませんでした。
- relatedCompanies: レイ（ray）: ambiguousで、有機ELディスプレイなどの文字列の部分一致のため結びませんでした。
- relatedCompanies: サンゲツ（sangetsu）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: 三陽商会（sanyo-shokai）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: セキ（seki）: ambiguousで、一般的な文字列の部分一致のため結びませんでした。
- relatedCompanies: 船場（semba）: ambiguousで、大阪支社の移転先である南船場という地名の一致のため結びませんでした。
- relatedCompanies: 三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）: 保有目的は資金調達などの金融取引関係の維持のため結びませんでした。その子会社である三井住友銀行が大株主であることとも別法人として扱いました。
- relatedCompanies: 三井住友トラストグループ（sumitomo-mitsui-trust-group）: 保有目的は資金調達などの金融取引関係の維持のため結びませんでした。
- relatedCompanies: 立川ブラインド工業（tachikawa）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: 帝国繊維（teikoku-sen-i）: みなし保有株式として退職給付信託に拠出されているだけのため結びませんでした。
- relatedCompanies: 群馬銀行（the-gunma-bank）: 保有目的は資金調達などの金融取引関係の維持であり、金融機関のため結びませんでした。
- relatedCompanies: TOPPANホールディングス（toppan-holdings）: 特定投資株式の保有目的はセグメント名を替えた定型句のみのため結びませんでした。
- relatedCompanies: ゼロ（zero）: ambiguousで、「ゼロ災害」という一般語の一致のため結びませんでした。
- relatedCompanies: 当社グループの連結子会社15社と持分法適用関連会社1社（福建尼科斯科技有限公司）は、当社グループの会社であるため結んでいません。
- relatedCompanies: 大株主のうちニックグループ持株会、ダイニック従業員持株会、個人株主、オー・ジー株式会社はrelated-candidates.jsonにないため結んでいません。三井住友銀行とみずほ信託銀行は金融機関・信託銀行のため結んでいません。
- terms: 助言: 用語「TTR」は熱転写リボンの略称で、印刷情報関連事業の主力製品として経営方針に印字されています。
- terms: 助言: 用語「HGS」は水分除去シートの製品名で、高い吸湿能力により有機ELなど水分を嫌う電子デバイスに採用されていると研究開発活動に印字されています。
- terms: 助言: 用語「FFC」はフィルム関連製品を指す略称として経営方針に印字されています。
- terms: 助言: 用語「ターポリン」は産業用に使われるシート状の素材で、住生活環境関連事業の取扱商品として事業の内容に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ダイニックの主たる業界（印刷情報関連事業を最大とする素材製造） → 提案: textiles（繊維）。クロス、不織布、カーペットなどの繊維系素材の製造が事業の基盤だが、閉じた分類に繊維に当たる区分が無い。素材の製造が中心のため、繊維・素材メーカーの先例に揃えてchemicalsを暫定とした。
