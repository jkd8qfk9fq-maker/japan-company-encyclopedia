# 共同印刷 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 共同印刷株式会社 |
| 証券コード | 7914 |
| docID（データを取り出した文書） | `S100YF86` |
| 原本 docID | `S100YF86` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF86.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E5%85%B1%E5%90%8C%E5%8D%B0%E5%88%B7

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 共同印刷株式会社 / 7914 / docID S100YF86（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kyodo-printing: 10 件の数値を有報XBRLと照合
有報: 共同印刷株式会社 有価証券報告書－第146期(2025/04/01－2026/03/31) (docID S100YF86)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kyodo-printing: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。経営指標等の注記に遡及適用や表示方法の変更の印字はなく、ブートストラップの前期有報との修正再表示チェックも全行が一致した。
- businessModel: 中期経営計画及び長期ビジョンの数値目標（2027年度の連結営業利益45億円以上・ROE8.0％以上、2034年度の営業利益120億円等）は、本文の財務数値は売上高と純利益のみとする規則により本文に記載せず、方針のみを perspectives に要約した。
- businessModel: 当期純利益の増加は投資有価証券の売却に伴う計上が主因とMD&Aに印字されているが、特別利益に分類される金額と理由は本文に記載しない規則のため、flow の profit 段には金額と増減率のみを記載した。
- businessModel: flow の revenue 段の内訳金額の単純合計は98,203百万円で、連結売上高の印字98,205百万円と2百万円異なる（印字の丸め。詳細は businessStructure の警告に記録）。
- businessModel: コーポレートブランド「TOMOWEL」は、子会社名や長期ビジョン名として有報にも現れるが、ブランドとしての使用開始（2018年1月）は Wikipedia の記事を補足として用い、出典に wikipedia を加えた。数値は Wikipedia からは用いていない。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順とした。「その他」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: 2026年3月期の各部門の外部顧客への売上高の単純合計は98,203百万円で、連結売上高の印字98,205百万円と2百万円異なる。また、セグメント表の報告セグメント計は95,993百万円と印字されており、3部門の単純合計95,992百万円と1百万円異なる。いずれも印字の丸めとして、各金額は印字どおりに記録した。
- businessStructure: 各部門の子事業には金額が独立して開示されていないため、金額を記載していない。子事業の内容は【事業の内容】の主要な製品・事業内容の印字に基づく。
- businessStructure: 【事業の内容】の注記により、当連結会計年度においてデジタルカタパルト株式会社の完全子会社であるKodama Tales Inc.を連結の範囲に含めている。期末現在の構成に反映済みの期中の変更であるため needsReview にはせず、ここに記録した。
- businessStructure: 【事業の内容】では当社、子会社16社及び関連会社1社で構成されると印字されており、【関係会社の状況】には連結子会社16社が個別に記載されている。
- businessStructure: 自己株式の取得（当期958百万円）は通常の資本政策として warnings にとどめ、needsReview にはしていない。
- history: 【沿革】の表は2019年12月と2020年10月の年月セルが続けて印字され事象文と分かれている崩れた表である。年月の数（2つ）と事象の数（2つ）が同じであるため、行順に対応づけた（2019年12月＝PT. Arisu Graphic Prima カラワン工場の開設、2020年10月＝共同印刷メディアプロダクト株式会社への改称）。
- history: 沿革の全35行を転記した。創業行に資本金額の印字はない。
- history: Kodama Tales Inc.は2024年6月に設立され、当連結会計年度にデジタルカタパルト株式会社の完全子会社として連結の範囲に含められた（【事業の内容】の注記）。期末現在の構成に反映済みである。
- industry: 主たる業界は media とした。総合印刷会社であり、閉じた分類に「印刷」はない。公開済みの同業大手（大日本印刷・TOPPANホールディングス）の分類でも印刷事業の中核は media とされており、これに従った。
- industry: 生活・産業資材部門（包装資材）と情報セキュリティ部門（カード・BPO等）は報告セグメントとして開示されているが、いずれも印刷・製造を中核とする事業であり、chemicals や it 等の副次分類は付けていない。
- relatedCompanies: seki はリンクしていない。理由: 「情報セキュリティ」等の一般語や自社子会社名への部分一致であり、セキ株式会社との関係の印字はない（曖昧な一致）。
- relatedCompanies: port はリンクしていない。理由: 「ポートフォリオ」の部分一致であり、ポート株式会社との関係の印字はない。
- relatedCompanies: innovation はリンクしていない。理由: 一般語「イノベーション」の一致であり、株式会社イノベーションとの関係の印字はない。
- relatedCompanies: career はリンクしていない。理由: 一般語「キャリア」の一致であり、株式会社キャリアとの関係の印字はない。
- relatedCompanies: vision はリンクしていない。理由: 長期ビジョン名等の一般語「ビジョン」の一致であり、株式会社ビジョンとの関係の印字はない。
- relatedCompanies: base-4481 はリンクしていない。理由: 「営業利益ベース」等の一般語の一致であり、ベース株式会社との関係の印字はない。
- relatedCompanies: ishin はリンクしていない。理由: サステナビリティのシナリオ記述中の一般語への一致であり、イシン株式会社との関係の印字はない。
- relatedCompanies: the-lead はリンクしていない。理由: 「リードする人材」等の一般語の一致であり、株式会社リードとの関係の印字はない。
- relatedCompanies: cover はリンクしていない。理由: 「サプライヤーカバー率」の一般語の一致であり、カバー株式会社との関係の印字はない。
- relatedCompanies: kamigumi はリンクしていない。理由: 人材指標の表中の一般語への部分一致であり、株式会社上組との関係の印字はない（曖昧な一致）。
- relatedCompanies: step はリンクしていない。理由: 経営方針中の「ファーストステップ」等の一般語の一致であり、株式会社ステップとの関係の印字はない。
- relatedCompanies: daiichikosho はリンクしていない。理由: 特定投資株式として保有していたが、当事業年度に全株を売却し、期末時点の保有がない。
- relatedCompanies: nakamuraya はリンクしていない。理由: 特定投資株式として保有していたが、当事業年度に全株を売却し、期末時点の保有がない。
- relatedCompanies: oji-holdings はリンクしていない。理由: 特定投資株式として保有していたが、当事業年度に全株を売却し、期末時点の保有がない。
- relatedCompanies: sumitomo-mitsui-trust-group はリンクしていない。理由: 金融機関であり、特定投資株式として保有していたが、当事業年度に全株を売却し、期末時点の保有がない。
- relatedCompanies: altech-9972 はリンクしていない。理由: 保有目的が「生活・産業資材事業における事業上の関係強化」のみで、具体的な取引内容の個別の印字がない。
- relatedCompanies: manabi-aid はリンクしていない。理由: 保有目的は教育映像事業を行っている旨のみで、同社との取引・提携の印字がない。
- relatedCompanies: 株式会社リクルートホールディングスは候補リスト（related-candidates.json）に含まれていないためリンクしていない。特定投資株式の保有目的には、情報コミュニケーション事業において主にDMの製造及び販売を行っている重要な取引先と印字されており、当社は同社の株式680,000株を保有している（2026年3月31日現在）。
- relatedCompanies: artience株式会社は候補リストに含まれていないためリンクしていない。2026年3月31日現在、当社の発行済株式（自己株式を除く）の3.04％を保有する大株主として印字されている。
- relatedCompanies: 大株主の状況に印字される日本マスタートラスト信託銀行株式会社（退職給付信託口・DIC株式会社口）は、DIC株式会社が退職給付信託として信託設定した信託財産であり、退職給付信託口名義のためDIC自身の保有としては扱わなかった。DIC株式会社は原材料等の取引の相手先として supplier でリンクしている。
- relatedCompanies: 大株主のうち、日本マスタートラスト信託銀行（信託口）、株式会社日本カストディ銀行（信託口・信託E口）、INTERACTIVE BROKERS LLC（常任代理人経由）、朝日生命保険相互会社、共同印刷従業員持株会は、信託口・名義・相互会社・従業員持株会であり事業会社ではないためリンクしていない。
- relatedCompanies: リンクした21件はいずれも、特定投資株式の保有目的に銘柄ごとに個別の取引・提携の内容が印字されている相手、または合弁契約の相手である。保有目的が全銘柄共通の定型文のみの相手は結んでいない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として3件を提案した。いずれも有報本文に現れる当社の事業に関わる語である。

## 要確認（status に反映）

- businessStructure: 2025年4月1日付で普通株式1株につき4株の割合で株式分割を行っております。これに伴い、株式数に関する経営指標は、第142期（2022年3月期）の期首に当該株式分割が行われたと仮定して算定されております。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
