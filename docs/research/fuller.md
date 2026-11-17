# フラー — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | フラー株式会社 |
| 証券コード | 387A |
| docID（データを取り出した文書） | `S100Z3K6` |
| 原本 docID | `S100Z3K6` |
| 提出日（原本） | 2026-09-29 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3K6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | フラー株式会社 / 387A / docID S100Z3K6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fuller: 10 件の数値を有報XBRLと照合
有報: フラー株式会社 有価証券報告書－第16期(2025/07/01－2026/06/30) (docID S100Z3K6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
fuller: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 指標注記のうち第12期・第14期の1株当たり指標の算定方法、配当を実施していないこと、非上場であった期間の株価指標の不記載などは表示事項として warnings にとどめた。会計基準の変更・決算期の変更・変則決算はないため financialNotes は空である。
- businessModel: 提出後の資本金の額の減少（2026年8月12日取締役会決議、2026年9月28日の定時株主総会で承認可決）は資本政策の手続であるため、本文には書かず warnings にとどめた。
- businessModel: MD&A の段階利益の金額・増減理由、キャッシュ・フローの金額、設備の帳簿価額は書いていない。本文の金額は売上高と当期純利益だけである。
- businessStructure: 単一セグメント（デジタルパートナー事業）のため、【事業の内容】の提供品目の区分（クライアントワーク／アプリ分析サービス）を children とし、金額は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の販売実績の印字を用いた。セグメント利益は書いていない。
- businessStructure: children の売上高（千円印字 1,907,823千円・101,759千円）の合計は2,009,582千円で、印字の合計2,009,583千円と1千円異なる。百万円への切り捨て後の合計（1,907＋101＝2,008）も印字の売上高2,009百万円と1百万円異なるが、印字どおりに記載した。
- businessStructure: 設備は柏の葉本社（千葉県柏市）と新潟本社（新潟県新潟市中央区）の2拠点で、単一セグメントのため事業別のセグメント欄の印字はなく、特定の子事業には結びつけなかった。帳簿価額は書いていない。
- businessStructure: このツリーの旧スキーマに従い suppliers キーは省略した。【事業の内容】に個別の仕入先名の印字はない。
- history: 沿革の表は年月と事象が対応して印字されており、年だけを取り出して記載した（月は書かない）。
- history: 軽微な項目として、本社オフィスの移転（2013年守谷市、2014年柏市）、新潟拠点の同区内移転（2020年）、オウンドメディア「フラーのデジタルノート」の開始（2021年）、ISO/IEC 27001（ISMS）認証の取得（2022年）を省いた。
- history: 資本金の金額は沿革に書かない規則のため、増資等の資本の動きは記載していない。wikipedia.json は found: false のため補足は使っていない。
- industry: 主たる業界は it とした。単一セグメントのデジタルパートナー事業はスマートフォンアプリの受託開発とアプリ分析サービスであり、直接当てはまる。
- industry: telecommunications は付けなかった。フラーは通信事業者ではなく、通信事業者向けのネットワークを運営していない。
- industry: media は付けなかった。「App Ape」は企業向けのデータ分析サービスであり、メディアの運営事業ではない。
- industry: DEIの別記事業は cte である。
- relatedCompanies: sumitomo-corporation（8053）：前事業年度（2025年6月期）には主要な販売先として販売実績に印字されているが、当事業年度の主要な顧客ごとの情報には記載がなく、当期の取引関係の印字が確認できないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手：株式会社電通デジタル（2026年6月期の主要な顧客であり、業務提携契約の相手先でもあるが、related-candidates.json にない。株式会社電通グループとは別の法人であり、代用しなかった）。
- relatedCompanies: en（4849、ambiguous）：「エンジニア」等の部分文字列のみで、エン株式会社についての記載はないため結ばなかった。
- relatedCompanies: seki（7857、ambiguous）：「情報セキュリティ」等の部分文字列のみで、セキ株式会社についての記載はないため結ばなかった。
- relatedCompanies: nissin（9066）：現在のコードリストにない相手であり、新株予約権の行使期間の印字に含まれる部分文字列のみで、株式会社日新についての記載はないため結ばなかった。
- relatedCompanies: land（8918）：「新潟地域におけるブランド力」等の部分文字列のみで、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: lec（7874）：「フレックスタイム制度」等の部分文字列のみで、レック株式会社についての記載はないため結ばなかった。
- relatedCompanies: path（3840、ambiguous）：最寄りの連絡場所の住所「柏の葉キャンパス」の部分文字列のみで、パス株式会社についての記載はないため結ばなかった。
- relatedCompanies: port（7047）：「分析レポート」等の部分文字列のみで、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: corona（5909）：「新型コロナウィルス」という一般語のみで、株式会社コロナについての記載はないため結ばなかった。
- relatedCompanies: plaid（4165）：売掛金及び契約資産の相手先別内訳に名称があるだけで、取引関係の説明の印字がないため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development（8830）：株式会社ヤプリの住所（住友不動産六本木グランドタワー）の印字のみで、住友不動産株式会社についての取引・提携の記載はないため結ばなかった。
- relatedCompanies: the-lead（6982）：「リード人材」という一般語のみで、株式会社リードについての記載はないため結ばなかった。
- relatedCompanies: tokyu（ambiguous）：売掛金及び契約資産の相手先別内訳に名称があるだけで、取引関係の説明の印字がないため結ばなかった。
- relatedCompanies: trust：現在のコードリストにない相手であり、日本マスタートラスト信託銀行（信託口）の部分文字列のみで、信託口は関連企業に結ばないため結ばなかった。
- relatedCompanies: will：『新型コロナウィルス』の部分文字列のみで、該当する会社についての記載はないため結ばなかった。
- terms: 「デジタルパートナー事業」「クライアントワーク」「アプリ分析サービス」は有報の表記どおりに用いた。
- terms: 「App Ape」は当社のアプリ分析サービスの名称として有報に印字されている。

## 要確認（status に反映）

- businessModel: 2023年５月９日付で普通株式１株につき10株の割合で株式分割を行っている（主要な経営指標等の推移の注記に記載）。
- businessStructure: 2023年５月９日付で普通株式１株につき10株の割合で株式分割を行っている（主要な経営指標等の推移の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
