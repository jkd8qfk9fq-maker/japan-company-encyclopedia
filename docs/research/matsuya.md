# 松屋 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社松屋 |
| 証券コード | 8237 |
| docID（データを取り出した文書） | `S100Y7R7` |
| 原本 docID | `S100Y6A8` |
| 提出日（原本） | 2026-05-27 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100Y7R7／有効文書 S100Y7R7（2026-11-16 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y7R7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社松屋 / 8237 / docID S100Y6A8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 34 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
matsuya: 10 件の数値を有報XBRLと照合
有報: 株式会社松屋 訂正有価証券報告書－第157期(2025/03/01－2026/02/28) (docID S100Y7R7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第157期(2025/03/01－2026/02/28)、docID S100Y7R7）を有効文書としてこのパックを作った。原本は docID S100Y6A8。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
matsuya: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 経営計画の数値目標は利益の区分を指標とする目標であるため、perspectives には含めていません。
- businessModel: suppliers は省きました: 有報は百貨店業について自社の調達を一般名詞で述べていないためです（businessStructure の warnings にも記録）。
- businessModel: 百貨店業でオムニチャネル戦略を担う株式会社MATSUYA GINZA.comについては、2025年度に事業の進捗が当初の事業計画を下回ったことから減損を計上した旨が経営方針に印字されていますが、金額は本文に書けないため記載していません。期中に起きた事実で、当期の構造に反映されているため needsReview には入れていません。
- businessModel: 金額はセグメント情報と経営指標の印字どおりの百万円表記を使いました。MD&Aのセグメント別売上高は内部売上高を含むため使っていません。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高の大きい順です（百貨店業37,686百万円、飲食業3,473百万円、ビル総合サービス及び広告業2,381百万円、その他2,165百万円）。「その他」は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: セグメントの外部顧客への売上高の合計は45,705百万円で、連結売上高の印字45,706百万円と1百万円差があります。印字の合計をそのまま使い、差は丸めによるものとして記録します。
- businessStructure: MD&Aのセグメント別売上高（百貨店業37,741百万円など）はセグメント間の内部売上高を含む数値のため使わず、セグメント情報の外部顧客への売上高を使いました。
- businessStructure: 調達先について: 有報は百貨店業について自社の調達を一般名詞で述べていないため、businessModel.suppliers は省きました。子会社を通じた仕入の事実は関係会社の状況にありますが、一般名詞の調達先としては記載しませんでした。
- businessStructure: Wikipediaの補足（銀座店の通称など）は、事業の説明に有報の記載で足りるため使いませんでした。
- businessStructure: 有効文書は訂正有価証券報告書（docID S100Y7R7、2026年6月1日提出）です。原本（docID S100Y6A8）との差異は役員の状況のテキストブロックだけで、財務の数値も本文も同一であることがパックで確認されているため、訂正に関する事項は needsReview に入れていません。
- history: 沿革に印字された資本金の増資や社債の発行の行は、金額を本文に書かないため取り上げていません。
- history: 創業と神田進出は沿革の冒頭文に印字された事実です（1869年創業、1889年神田進出）。
- history: 1944年の横浜支店の改称など、現在の店舗体制に直接つながらない支店の出来事は省きました。
- industry: 百貨店業が外部顧客への売上高の大半を占めるため、retail を主たる業界としました。飲食業やビル総合サービス及び広告業は規模が小さく、独立した業界は付けていません。
- relatedCompanies: en: 「従業員エンゲージメント」などの語の断片一致のみで、会社としての記載がありません。
- relatedCompanies: career: 「キャリア」という一般語の一致のみで、会社としての取引等の記載がありません。
- relatedCompanies: core: 「ギンザコア」（連結ではない持分法適用関連会社）の社名の一部一致で、株式会社コアとしての記載がありません。グループ会社はリンク対象にしません。
- relatedCompanies: port: レポートなどの語の断片一致のみで、会社としての記載がありません。
- relatedCompanies: seki: 「セキュリティ」などの語の断片一致で、曖昧な候補でもあり、会社としての記載がありません。
- relatedCompanies: kitano-construction: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句（事業活動の円滑化のために保有）のみで、個別の取引の記載がありません。
- relatedCompanies: land: 「ブランド」という語の断片一致のみで、会社としての記載がありません。
- relatedCompanies: base-4481: 「ベース」という語の断片一致のみで、会社としての記載がありません。
- relatedCompanies: daiwa-securities-group: 特定投資株式に載りますが、保有目的は財務活動の円滑化という共通の定型句のみで、金融機関の資金調達が理由のため結びません。
- relatedCompanies: freee: 「フリーディスカッション」などの語の断片一致のみで、会社としての記載がありません。
- relatedCompanies: fuji-kyuko: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: innovation: 「イノベーションの推進」という一般語の一致のみで、会社としての記載がありません。
- relatedCompanies: isetan-mitsukoshi-holdings: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引や提携の記載がありません。同業であることだけでは結びません。
- relatedCompanies: kikkoman: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: kuraudia-holdings: 2026年4月1日付で株式会社アターブル松屋の婚礼事業等に係る業務委託契約の地位を継承した相手ですが、地位の継承は一回限りの移転で、継続する業務提携等の関係の記載がないため結びません。事実は businessStructure の needsReview に記録しました。
- relatedCompanies: look-holdings: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: mebuki-financial-group: 特定投資株式に載りますが、保有目的は財務活動の円滑化という共通の定型句のみで、金融機関のため結びません。
- relatedCompanies: mitsubishi-estate: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: mitsubishi-ufj-financial-group: 大株主に載るのは株式会社三菱UFJ銀行（銀行本体）で、持株会社とは別の法人です。特定投資株式の保有目的も財務活動の円滑化という共通の定型句のみのため結びません。
- relatedCompanies: mizuho-financial-group: 大株主に載るのは株式会社みずほ銀行（銀行本体）で、持株会社とは別の法人です。特定投資株式の保有目的も財務活動の円滑化という共通の定型句のみのため結びません。
- relatedCompanies: nomura-9716: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式に載りますが、保有目的は財務活動の円滑化という共通の定型句のみで、金融機関のため結びません。
- relatedCompanies: taisei: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: takashima-and-co: 候補は高島（8007）ですが、有報に印字されるのは高島屋で、名称が一致せず曖昧な候補です。特定投資株式の保有目的も定型句のみのため結びません。
- relatedCompanies: takihyo: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: the-yamanashi-chuo-bank: 特定投資株式でしたが、当事業年度に保有する全ての株式を売却し、期末の保有はゼロのため結びません。保有目的も財務活動の円滑化でした。
- relatedCompanies: tokio-marine-holdings: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、保険取引が理由の場合は結ばないため結びません。
- relatedCompanies: trust: コードリストにない信託口の名称で、同一性が確認できないため結びません。
- relatedCompanies: tsi-holdings: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: tsukamoto: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: vision: 「ビジョン」という一般語の一致のみで、会社としての記載がありません。
- relatedCompanies: wacoal-holdings: 特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、個別の取引の記載がありません。
- relatedCompanies: 大株主のうち、日本マスタートラスト信託銀行（信託口）、株式会社日本カストディ銀行（信託口）、三菱UFJ信託銀行は信託・資産管理で純投資のため、株式会社三菱UFJ銀行と株式会社みずほ銀行は銀行本体で候補の持株会社とは別法人のため、東武シェアードサービスと松岡地所は候補にないため、それぞれ結んでいません。
- relatedCompanies: 松屋の連結子会社と持分法適用関連会社（株式会社ギンザコア、株式会社ライツ・アンド・ブランズなど）はグループ会社であり、関連企業リンクの対象にしていません。
- terms: 新たに提案する用語はありません。オムニチャネルや友の会などは本文の文脈で説明しています。

## 要確認（status に反映）

- businessStructure: 飲食業の連結子会社である株式会社アターブル松屋は、宗教法人東京大神宮との婚礼事業等に係る業務委託契約について、2026年4月1日付で株式会社クラウディアホールディングスへ地位を継承しました。本エントリーの事業構造は、2026年2月28日現在の、継承前の構造で記載しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
