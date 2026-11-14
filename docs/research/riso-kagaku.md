# 理想科学工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 理想科学工業株式会社 |
| 証券コード | 6413 |
| docID（データを取り出した文書） | `S100YE4Y` |
| 原本 docID | `S100YE4Y` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE4Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 理想科学工業株式会社 / 6413 / docID S100YE4Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
riso-kagaku: 10 件の数値を有報XBRLと照合
有報: 理想科学工業株式会社 有価証券報告書－第72期(2025/04/01－2026/03/31) (docID S100YE4Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
riso-kagaku: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象は、2026年5月8日開催の取締役会における自己株式取得の決議のみであり、資本政策に関する事項のためneedsReviewには入れていない。
- businessModel: 地域別売上高の内訳（日本37,202百万円、米州5,753百万円、欧州19,695百万円、アジア16,339百万円）の合計は78,989百万円で、印字された連結売上高78,990百万円とは有報の丸めにより1百万円異なる。本文では印字の合計を用いた。
- businessModel: 当連結会計年度に連結子会社であったRISO (SG) PTE. LTD.は清算結了し連結の範囲から除かれた。清算に伴う損失の金額は、本文の財務数値を売上高と当期純利益に限る規則により本文に書いていない。
- businessModel: 修正再表示チェックは前期有報と全行一致し、訂正有価証券報告書も無いため、financialNotesは空とした。
- businessModel: Wikipediaの記事にあった通称は、有報に印字が無い補足として本文には使わなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（印刷機器関連事業77,317百万円、不動産事業1,061百万円、その他611百万円）。印刷機器事業とインクジェットヘッド事業は印刷機器関連事業として一括開示され、個別の売上高が印字されていないため、子事業には金額を書いていない。
- businessStructure: 連結子会社は24社。当連結会計年度に連結子会社であったRISO (SG) PTE. LTD.は清算結了したため連結の範囲から除かれている（期中の出来事であり、登録は2026年3月31日現在の構成で行う）。
- history: 沿革の設立行に印字された資本金の金額は、規則により本文・沿革に書いていない。
- history: 沿革から主要な節目を選んで収録した。本社移転、各工場・出荷センターの完成、海外販売子会社の設立などの細目は一部を省略した（例: 1958年・1968年の本社移転、1981年の筑波工場完成は1981年の行に併記、1989年以降の欧州各国の販売子会社設立、1994年の筑波出荷センター、1997年の開発技術センター、2011年のタイ生産子会社設立、2014年のロジャナ工場、2015年のシンガポール・トルコ子会社設立、2020年の理想開発センターⅡ完成）。
- history: 2015年4月に設立したRISO (SG) PTE. LTD.は当連結会計年度に清算結了し連結の範囲から除かれた。清算の完了日は印字されていないため、沿革の行にはしていない。
- industry: 主たる業界は、売上高の大半を占める印刷機器関連事業（事務用印刷機等の製造・販売）から機械とした。不動産事業は報告セグメントとして金額が開示されているため2つ目に付けた。
- relatedCompanies: olympus（オリンパス）: 2003年9月に合弁会社オルテック株式会社を設立したが、2011年3月に合弁を終了して完全子会社化し、同年9月に吸収合併済みである。現在の取引・提携関係の印字が無いため結ばない（合弁の経緯は沿革に記録した）。
- relatedCompanies: tokyo-kiraboshi-financial-group（東京きらぼしフィナンシャルグループ）: 特定投資株式として209,688株を保有するが、保有目的は口座決済・資金調達・為替取引などの金融取引が主であり、販売先としての文言も他の金融機関銘柄と共通の定型句のため結ばない。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱ＵＦＪフィナンシャル・グループ）: 特定投資株式として423,240株を保有するが、保有目的は金融取引が主であり、販売先としての文言も全銘柄共通の定型句のため結ばない。
- relatedCompanies: ms-and-ad-insurance-group-holdings（ＭＳ＆ＡＤインシュアランスグループホールディングス）: 特定投資株式として243,810株を保有するが、保有目的は保険取引の円滑化と情報収集が主であり、販売先としての文言も全銘柄共通の定型句のため結ばない。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）: 特定投資株式として80,000株を保有するが、保有目的は金融取引が主であり、販売先としての文言も全銘柄共通の定型句のため結ばない。
- relatedCompanies: sumitomo-mitsui-trust-group（三井住友トラストグループ）: 特定投資株式として37,600株を保有するが、保有目的は金融取引と証券代行業務の委託が主であり、販売先としての文言も全銘柄共通の定型句のため結ばない。
- relatedCompanies: nippon-paper-industries（日本製紙）: 当事業年度において保有株式を全て売却済みのため結ばない。
- relatedCompanies: create（クリエイト）: 「プリントクリエイト事業」の語句の一致であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: technologies（テクノロジーズ）: 連結子会社である理想テクノロジーズ株式会社の社名の一部の一致であり、当該候補企業との関係の印字は無いため結ばない。
- relatedCompanies: kohsoku（高速）: 「高速インクジェットプリンター」の語句の一致（ambiguous）であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: base-4481（ベース）: 「時価ベース」の語句の一致であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: innovation（イノベーション）: 「オープンイノベーション促進積立金」の語句の一致であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: taya（田谷）: 旧本社所在地である世田谷区の地名の一致（ambiguous）であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: seki（セキ）: 「サイバーセキュリティ」の部分一致（ambiguous）であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: suzuki-6785（鈴木）: 監査役の人名の一致（ambiguous）であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: core（コア）: 「コアビジネス」の語句の一致（ambiguous）であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: cover（カバー）: 「保険でカバー」の語句の一致であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: land（ランド）: 南アフリカの通貨単位「ランド」の語句の一致であり、企業との関係の印字は無いため結ばない。
- relatedCompanies: ricoh（リコー）: 「リコール」の部分一致であり、企業との関係の印字は無いため結ばない。
- terms: 助言: 用語『孔版印刷』は、原紙（マスター）に微細な孔を開けてインクを押し出して印刷する方式で、デジタル印刷機「リソグラフ」の印刷方式として【事業の内容】に印字されています。
- terms: 助言: 用語『インクジェットヘッド』は、インクを微小な滴として吐出する印刷ヘッドで、理想テクノロジーズ株式会社が開発・製造・販売する製品として【事業の内容】に印字されています。

## 要確認（status に反映）

- businessModel: 株式分割: 当社は、2025年1月1日付で普通株式1株につき2株の割合による株式分割を実施しました。株式数に関する指標は第70期（2024年3月期）の期首に当該株式分割が行われたと仮定して算定されている旨が印字されています。登録は有報の印字どおり行います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
