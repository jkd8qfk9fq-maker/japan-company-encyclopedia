# ミスターマックス・ホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ミスターマックス・ホールディングス |
| 証券コード | 8203 |
| docID（データを取り出した文書） | `S100Y58I` |
| 原本 docID | `S100Y58I` |
| 提出日（原本） | 2026-05-20 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y58I.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ミスターマックス・ホールディングス / 8203 / docID S100Y58I（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mr-max-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ミスターマックス・ホールディングス 有価証券報告書－第77期(2025/03/01－2026/02/28) (docID S100Y58I)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mr-max-holdings: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社　ミスターマックス・ホールディングス」が EDINET の提出者名「株式会社ミスターマックス・ホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の目標（売上高2,000億円など）は、本文に書ける財務数値以外の指標（営業利益・営業利益率）と一体で印字されているため、perspectives には金額・比率を書かなかった。
- businessModel: 営業収益は、売上高と不動産賃貸収入とその他の営業収入を合計したものである旨が、経営指標等の注記とMD&Aに印字されている。
- businessModel: エビデンスパックの「財務諸表の組替え」警告については、経営指標等の注記で確認した「収益認識に関する会計基準」等の2023年2月期の期首からの適用が該当事実であり、financialNotes に記録した。修正再表示チェックは前期有報と重複する全行が一致し、売上高・純利益の遡及修正は確認されなかった。
- businessModel: 売上高営業利益率は、本文に書ける財務数値（売上高・当期純利益）以外の指標のため、本文には書いていない。
- businessStructure: 単一セグメント（小売及びこれに付随する事業）のため、事業の内訳は【事業の内容】の会社別の役割分担で組み立て、ディスカウントストア事業の children には【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）の6部門を使った。
- businessStructure: 【関連情報】の「その他」は2026年2月期の外部顧客への売上高が0百万円、「消去」△391百万円は売上高全体から控除する変動対価等のため、children には含めていない。
- businessStructure: 製品区分の外部顧客への売上高の合計142,134百万円は、営業収益147,684百万円とは範囲が異なる（営業収益は売上高に不動産賃貸収入とその他の営業収入を合計したもの）。
- businessStructure: ショッピングセンター運営事業と物流事業は、金額が独立して開示されていないため、売上順の最後に置き、その旨を明記した。
- history: 沿革表の末尾は、年月（2020年8月・2022年4月・2022年11月・2024年2月）と事象文が分かれて印字されていたが、年月4件と事象4件で数が一致したため、行順で対応づけた。
- history: 当社は法律上は1950年12月8日設立で、実質上の存続会社は平野電機株式会社である旨が沿革の冒頭に印字されている。沿革は実質上の存続会社についての記載とした。
- history: ISO14001の取得、POSシステム・PORシステムの導入、東京本部の設置、子会社2社の設立（2000年）とその後の売却・吸収合併（2009年）、関東物流センターの移設（2007年）など、事業の転機ではない行は省いた。
- history: 上海最高先生商貿有限公司の清算結了（2025年11月）は、提出前の完了した事実として沿革と warnings に記録した。提出後の文書（otherFilingsInWindow）は空で、重要な後発事象は連結・個別とも「該当事項はありません」だったため、後発文書の確認（ack）は不要だった。
- industry: 主たる業界は、小売及びこれに付随する事業を行う単一セグメントで、ディスカウントストアの小売が事業の中心であることから小売（retail）とした。閉じた分類に当てはまる区分があるため taxonomyGap は記録しなかった。
- relatedCompanies: max（マックス株式会社）: 「マックス」の一致は当社と子会社（株式会社ミスターマックス）の社名の一部によるもので、マックス株式会社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: fukuoka-financial-group: 特定投資株式の保有目的が資金調達に関する関係維持であり、金融機関のため結ばなかった。
- relatedCompanies: nishi-nippon-financial-holdings: 特定投資株式の保有目的が資金調達に関する関係維持であり、金融機関のため結ばなかった。
- relatedCompanies: seki: 「セキ」はリスクの文中の一般語との一致で、曖昧なため結ばなかった。
- relatedCompanies: en（エン株式会社）: 「エン」は経営理念などの文中の一般語との部分一致で、曖昧なため結ばなかった。
- relatedCompanies: space: 「スペース」は授乳スペース・おむつ替スペースなど店舗設備の一般語のため結ばなかった。
- relatedCompanies: career: 「キャリア」は人材育成の文中の一般語のため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」は人材育成の文中の一般語のため結ばなかった。
- relatedCompanies: port: 「ポート」はITパスポートなど資格名の文中の部分一致のため結ばなかった。
- relatedCompanies: ricoh: 「リコー」の一致は「リコール」の部分一致で、株式会社リコーではないため結ばなかった。
- relatedCompanies: land: 「ランド」の一致は「ブランド」の部分一致のため結ばなかった。
- relatedCompanies: ishin: 「イシン」の一致は気候シナリオなどの文中の部分一致のため結ばなかった。
- relatedCompanies: okabe: 「岡部」の一致は役員の人名で、曖昧なため結ばなかった。
- relatedCompanies: path: 「パス」の一致は「ITパスポート」の部分一致で、曖昧なため結ばなかった。
- relatedCompanies: trust: 「トラスト」の一致は大株主の日本マスタートラスト信託銀行（信託口）の名称の一部で、信託銀行の信託口のため結ばなかった。
- relatedCompanies: freee: 「フリー」の一致は「バリアフリー」の部分一致のため結ばなかった。
- relatedCompanies: 連結子会社の株式会社ミスターマックスと株式会社ロジディアは、非上場のため関連企業には含めていない（事業構造と businessModel に記載）。
- terms: 助言: 用語「ディスカウントストア」（生活必需品などを低価格で販売する小売業態）、「エブリデイ・ロープライス（EDLP）」（商品を毎日低価格で販売する価格政策）、「プライベートブランド（PB）」（小売企業が自社企画で販売する商品）、「3PL」（物流業務を包括的に受託する事業）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
