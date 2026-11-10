# バッファロー — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社バッファロー |
| 証券コード | 6676 |
| docID（データを取り出した文書） | `S100YGR6` |
| 原本 docID | `S100YGR6` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGR6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社バッファロー / 6676 / docID S100YGR6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
buffalo-6676: 10 件の数値を有報XBRLと照合
有報: 株式会社バッファロー 有価証券報告書－第40期(2025/04/01－2026/03/31) (docID S100YGR6)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":144137000000,"latestFiling":144136000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":142576000000,"latestFiling":142575000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":145773000000,"latestFiling":145751000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":143170000000,"latestFiling":143110000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
buffalo-6676: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 連結ROE15％以上の目標は将来の数値目標のため本文には記載しなかった。
- businessModel: 2026年5月14日開催の取締役会で自己株式の取得（取得し得る株式の総数4,000,000株（上限）、取得価額の総額11,200,000,000円（上限）、取得期間2026年5月15日～2027年4月30日）を決議した旨が重要な後発事象として印字されている。資本政策に関する事項のためneedsReviewには入れず、ここに記録する。
- businessModel: 地域別の売上高の合計は117,859百万円で、連結売上高117,312百万円と547百万円の差があります。印字どおりの数値を記載し、合計は印字の117,312百万円を用いました。
- businessModel: 商品分野別の売上高の合計は117,310百万円で、連結売上高117,312百万円と2百万円の差があります。印字どおりの数値で、端数によるものです。
- businessModel: 株式会社メルコグループは議決権の30.7％を保有するその他の関係会社で主要株主であるが未上場で候補データにないため結ばず、役割をbusinessModelとindustryPositionに記録した。
- businessModel: 創業50周年（2025年5月1日）の記載は経営者による分析の中にあり、沿革表にないため沿革には含めなかった。
- businessModel: 持分法適用関連会社1社の名称は、関係会社の状況の表から確認できなかったため記載せず、子会社12社及び関連会社1社という構成のみを記載した。
- businessStructure: 商品分野別の売上高の合計は117,310百万円で、連結売上高117,312百万円と2百万円の差があります。印字どおりの数値を記載し、合計は印字の117,312百万円を用いました。
- businessStructure: 当社グループはIT関連事業の単一セグメントです。2024年10月にシマダヤ株式会社の株式分配型スピンオフを実施し食品事業が連結の範囲から除外されたため、第1四半期連結会計期間より報告セグメントを「IT関連事業」の単一セグメントに変更しています。
- history: 沿革表に設立時の資本金額の印字がないため、記載していません。
- history: 2018年4月のシマダヤ地域子会社3社の設立は、沿革表の1行に複数の合併が印字されているため、1件の出来事としてまとめました。
- industry: 主たる事業はIT関連事業の単一セグメントであり、閉じた分類では it が最も近いため primary とした。
- relatedCompanies: 株式会社セキュアは、保有目的が「IT関連事業において資本業務提携に伴うシナジー創出のため」と銘柄個別に印字されているため業務提携先として結んだ。
- relatedCompanies: 株式会社セゾンテクノロジーは、保有目的が「IT関連事業において協業継続を図るため」と銘柄個別に印字されているため業務提携先として結んだ。2024年3月の株式売却により持分法適用関連会社から除外された経緯は説明文に記載した。
- relatedCompanies: バッファロー（3352）は、社名の一致が当社自身及び連結子会社（バッファロー・IT・ソリューションズ等）を指すもので、別会社との関係ではないため見送った。
- relatedCompanies: シマダヤは、2024年10月の株式分配型スピンオフにより連結の範囲から除外され、現在の取引・提携・資本関係の印字がないため見送った。
- relatedCompanies: エンは、「エンジニアリング」の部分一致の誤マッチのため見送った。
- relatedCompanies: ポートは、「サポート」の部分一致の誤マッチのため見送った。
- relatedCompanies: スローガンは、コーポレートスローガンの語句の一致で、会社との関係ではないため見送った。
- relatedCompanies: コクヨは、旧子会社名「バッファローコクヨサプライ」の一部で、2012年に統合済みの過去の名称のため見送った。
- relatedCompanies: ランドは、「ブランド」の部分一致の誤マッチのため見送った。
- relatedCompanies: コアは、「コアコンピタンス」の部分一致の誤マッチのため見送った。
- relatedCompanies: ハブは、製品名「ハブ」の語句の一致で、会社との関係ではないため見送った。
- relatedCompanies: トラストは、日本マスタートラスト信託銀行の信託口で、金融機関の純投資のため見送った。
- relatedCompanies: VSTECS Berhadは、当事業年度中に純投資目的に変更されており、取引・提携の印字がないため結ばなかった。
- relatedCompanies: Amazon.com Int'l Sales, Inc.は2026年3月期の主要な顧客（19,295百万円）であるが外国法人で候補データにないため結ばず、役割をbusinessModelとindustryPositionに記録した。
- relatedCompanies: ダイワボウ情報システム株式会社は2026年3月期の主要な顧客（18,549百万円）であるが候補データにないため結ばず、役割をbusinessModelとindustryPositionに記録した。
- relatedCompanies: 連結子会社及び持分法適用関連会社はすべて非上場で候補外のため結んでいない。
- terms: 助言: 用語「Value Chain Engineering」は、当社のコーポレートスローガンで、製品の企画から保守・サポートまでのバリューチェーン全体における課題解決を指す。同社の事業説明の前提になるため、用語集への追加候補と考える。
- terms: 助言: 用語「エンジニアリング・サイクル」は、製品の企画・開発、調達、製造、販売、保守・サポート等を通じて顧客の課題を把握し、品質・機能・サービスの改善につなげる活動を指す。同社のコアコンピタンスの説明の前提になるため、用語集への追加候補と考える。
- terms: 助言: 用語「JC-STAR」は、経済産業省主導のセキュリティ要件適合評価及びラベリング制度で、同社のネットワーク機器の商品開発に関わる。同社の事業説明に現れるため、用語集への追加候補と考える。

## 要確認（status に反映）

- businessModel: 2026年4月1日付で、普通株式1株につき2株の割合で株式分割を行いました。株式数に基づく指標は、第36期の期首に当該株式分割が行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
