# 富山銀行 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　富山銀行 |
| 証券コード | 8365 |
| docID（データを取り出した文書） | `S100YFUZ` |
| 原本 docID | `S100YFUZ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFUZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　富山銀行 / 8365 / docID S100YFUZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 46 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-bank-of-toyama: 10 件の数値を有報XBRLと照合
有報: 株式会社　富山銀行 有価証券報告書－第100期(2025/04/01－2026/03/31) (docID S100YFUZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-bank-of-toyama: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社富山銀行」が EDINET の提出者名「株式会社　富山銀行」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aのセグメント別経常収益はセグメント間の内部経常収益を含むため使わず、セグメント注記の外部顧客に対する経常収益を用いた。金額はいずれも有報の百万円の印字どおりで、換算はしていない。
- businessModel: セグメント別の外部顧客に対する経常収益の単純合計は13,786百万円で、連結経常収益13,771百万円と15百万円異なる（調整額△15百万円は「リース業」の貸倒引当金繰入額と印字）。印字どおりとした。
- businessModel: 第7次中期経営計画の数値目標（2028年度の事業承継コンサルティング件数の5年間累計1,000件、NISA残高80億円以上、外部研修派遣者数の3年間累計45名、コア業務純益（除く投信売却益ベース）16億円以上、見直し前の最終利益（連結ベース）10億円以上・中小企業等貸出比率75％以上など）は、投資指標・目標値であるため本文と戦略には書かず、この warnings に記録した。
- businessModel: 2026年5月に公表された中期経営計画の見直しは、決算日後に公表された戦略の見直しであり、事業構造の変更ではないため needsReview には入れず、経営方針の印字どおり見直し後の重点戦略を戦略に記載した。
- businessModel: 2026年5月の株主還元方針の変更は、配当政策に印字された資本政策の事項のため本文には書かず、この warnings に記録のみとした。
- businessModel: 経常利益・業務粗利益・資金運用収支などの金額と増減理由は、本文の財務数値は経常収益と当期純利益だけとする規則のため書かなかった。
- businessModel: 主要な経営指標等の注記1（潜在株式がないため潜在株式調整後1株当たり当期純利益を記載していない旨）と注記2（自己資本比率の算出方法）は表示事項のため financialNotes には入れなかった。前期有報との修正再表示チェックでは重複する年度の全系列が一致し、会計基準の変更の印字もないため financialNotes は空とした。
- businessModel: 株式会社Plan・Do・Seeとの資本業務提携は経営方針に印字されているが、同社は上場会社ではなく関連企業の候補にもないため関連企業には結ばず、戦略とこの warnings に記録した。大株主の状況では同社が4.90％を保有する筆頭株主である（2026年3月31日現在）。
- businessModel: 特定投資株式のうちゴールドウイン・アルビス・住友不動産の株式数の増加は、各社の株式分割によるものと印字されており、保有先の分割であって当行自身の分割ではないため needsReview には入れなかった。
- businessStructure: 報告セグメントは銀行業・リース業の2つで、セグメント注記の外部顧客に対する経常収益の大きい順に並べた。「その他」（保証業務）は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: MD&Aのセグメント別経常収益はセグメント間の内部経常収益を含むため使わず、セグメント注記の外部顧客に対する経常収益を用いた。
- businessStructure: セグメント別の外部顧客に対する経常収益の単純合計は13,786百万円で、連結経常収益13,771百万円と15百万円異なる（調整額△15百万円は「リース業」の貸倒引当金繰入額と印字）。いずれも印字どおりとした。
- businessStructure: suppliers はこの作業ツリーのスキーマに無いため書かなかった。仕入先にあたる個別の相手の印字も有報にはない。
- businessStructure: Wikipediaの冒頭は本店所在地（富山県高岡市）の事実のみで有報と重複するため、補足には使わなかった。
- history: 2009年12月の公募増資と2010年1月の第三者割当増資の行は、資本金の金額を含むため沿革には書かなかった。
- history: 1983年の国債窓口販売、1986年の公共債ディーリング、1990年の社債等登録機関業務、1991年の社債受託業務、1994年の信託代理店業務、2001年の損害保険窓口販売、2002年の基幹系システム移行と生命保険窓口販売、2009年の医療保険窓口販売、2012年の基幹系システム更改の各行は、主要な出来事ではないため落とした。
- history: 行数の対応は沿革表の印字どおりで、年月と事象は1対1に対応している。
- industry: 銀行業を中心にリース・信用保証などの金融サービスを行うグループであり、閉じたリストには金融サービス全般を表す finance のみが該当するため、産業は finance のみとした。
- relatedCompanies: hokuriku-electric-power: サステナビリティの節に2026年2月の協定締結という具体的な連携の印字があるため business-partner として結んだ。特定投資株式としての保有はない。
- relatedCompanies: sankyo-tateyama: 大株主の状況に2.62％（2026年3月31日現在）で載る事業会社だが、取引・提携の印字がなく政策保有の域を出ないため結ばなかった。
- relatedCompanies: kusuri-no-aoki-holdings: 大株主の状況に2.06％で載り、特定投資株式の保有目的も全銘柄共通の定型句のみのため結ばなかった。
- relatedCompanies: goldwin: 特定投資株式の筆頭銘柄だが、保有目的は全銘柄共通の定型句（営業基盤である富山県に本店を置く企業として取引関係を維持・強化し企業価値の向上を図る）のみで、個別の取引・提携の印字がないため結ばなかった。株式数の増加は同社の株式分割によるものである。
- relatedCompanies: hokuhoku-financial-group: 特定投資株式の保有目的が地域金融機関同士の情報交換・協力関係という他行と共通の定型句のみのため結ばなかった。
- relatedCompanies: hachijuni-nagano-bank: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: the-fukui-bank: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: the-musashino-bank: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: the-taiko-bank: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: the-tohoku-bank: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: procrea-holdings: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: tokyo-kiraboshi-financial-group: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: okinawa-financial-group: 2023年度に持ち合い解消の合意があり売却を進める方針の文脈でのみ現れるため結ばなかった。
- relatedCompanies: japan-resistor-mfg: 2021年度に持ち合い解消の合意があった銘柄であり、現在の関係の印字がないため結ばなかった。
- relatedCompanies: zenkoku-hosho: 特定投資株式の保有目的に住宅ローン等の保証委託先とあるが、金融機関業務の委託関係であり、定型句の域を出ないため結ばなかった。
- relatedCompanies: jaccs: 特定投資株式の保有目的が金融機関業務における消費者金融の文脈の定型句のみのため結ばなかった。
- relatedCompanies: daiwa-securities-group: 特定投資株式の保有目的が証券業務の定型句のみのため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的が定型句のみで、金融取引の域を出ないため結ばなかった。
- relatedCompanies: mizuho-financial-group: 特定投資株式の保有目的が定型句のみで、金融取引の域を出ないため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development: 特定投資株式の保有目的が定型句のみのため結ばなかった。株式数の増加は同社の株式分割によるものである。
- relatedCompanies: albis: 特定投資株式の保有目的が定型句のみのため結ばなかった。株式数の増加は同社の株式分割によるものである。
- relatedCompanies: asahi-printing: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: chuetsu-pulp-and-paper: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: ck-san-etsu: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: cosel: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: fushiki-kairiku-unso: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: hokuriku-electric-industry: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: hokuriku-electrical-construction: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: nachi-fujikoshi: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: oji-holdings: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: takagi-seiko: 特定投資株式の保有目的が定型句のみのため結ばなかった。
- relatedCompanies: career: 「キャリア形成」など一般語の一致で、社名の一致ではないため結ばなかった。
- relatedCompanies: base-4481: 「連結ベース」など一般語の一致のため結ばなかった。
- relatedCompanies: en: 感染症リスクの記述などの部分一致で、社名の一致ではないため結ばなかった（ambiguous）。
- relatedCompanies: path: 「パーパス」の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: port: 「ポートフォリオ」の部分一致のため結ばなかった。
- relatedCompanies: seki: サイバーリスク等の記述の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: core: 「コア業務純益」の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: corona: コロナウイルス感染症の記述の一致のため結ばなかった。
- relatedCompanies: cover: 「カバーできない」という一般語の一致のため結ばなかった。
- relatedCompanies: rent: 「カレント方式」の部分一致のため結ばなかった。
- relatedCompanies: imura-and-co: 金利改定のタイムラグ等の記述の部分一致のため結ばなかった。
- relatedCompanies: ntt: 沿革の「NTTデータ共同センター」は株式会社NTTデータの施設の名称であり、NTT（日本電信電話）との関係の印字ではないため結ばなかった。
- relatedCompanies: japan-post-bank: 経営環境における競合の文脈でのみ現れ、取引・提携の印字がないため結ばなかった。
- relatedCompanies: 大株主の状況の株式会社北陸銀行（4.38％）は金融機関であり、上場の事業会社としての関連付けの対象ではないため結ばなかった。株式会社Plan・Do・See（4.90％、筆頭株主）は未上場で候補にないため結ばなかった（資本業務提携の事実は businessModel の戦略に記載）。トナミホールディングス株式会社（3.01％）・株式会社ホクタテ（3.35％）・日本海ガス絆ホールディングス株式会社（2.15％）・北日本放送株式会社（2.06％）は候補にないため結ばなかった。
- relatedCompanies: 連結子会社2社（富山リース株式会社・富山保証サービス株式会社）はグループ会社であり、relatedCompanies には書かなかった（事業構造に記載）。
- terms: 助言: 用語「パーパス」は、同行が第7次中期経営計画で新たに制定した存在意義「地域を愛し、お客さまに常に寄り添い続け、最も頼りにされる銀行を実現します」を指す。
- terms: 助言: 用語「Change & Challenge」は、第7次中期経営計画（2024年4月～2029年3月）の名称。2026年5月に見直しが公表され、重点戦略は4つに再編された。
- terms: 助言: 用語「店舗内店舗」は、近隣の支店同士を同じ店舗内に移行する店舗形態で、MD&Aには福光支店と福光中央支店の移行が現れる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
