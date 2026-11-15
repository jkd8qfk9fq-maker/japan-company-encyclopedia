# ユキグニファクトリー — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ユキグニファクトリー株式会社 |
| 証券コード | 1375 |
| docID（データを取り出した文書） | `S100YK0W` |
| 原本 docID | `S100YK0W` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK0W.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ユキグニファクトリー株式会社 / 1375 / docID S100YK0W（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yukiguni-factory: 10 件の数値を有報XBRLと照合
有報: ユキグニファクトリー株式会社 有価証券報告書－第9期(2025/04/01－2026/03/31) (docID S100YK0W)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
yukiguni-factory: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 収益53,449百万円はIFRSの収益であり、売上収益37,845百万円に、IAS第41号「農業」に基づく生物資産の公正価値変動による利得15,604百万円（収益に含まれる額）を含む。セグメント金額は売上収益ベースの外部顧客への売上収益を用いた。
- businessModel: 製品別の売上収益（まいたけ20,264百万円、ぶなしめじ7,948百万円、その他の茸5,284百万円、エリンギ3,973百万円）はMD&A販売実績の印字であり、合計37,469百万円と茸事業の外部顧客への売上収益37,471百万円との間に2百万円の差がある（有報印字の丸め）。印字どおり転記した。
- businessModel: 親会社の株式会社神明ホールディングス（議決権の被所有割合50.13％、提出会社の親会社等の情報に印字）は非上場で百科事典の登録がなく、関連候補にも含まれないため、関連企業として結ばなかった。
- businessModel: 連結子会社の瑞穂農林株式会社は、2025年8月1日に事業のすべてを当社が譲り受け（京丹波バイオセンターとして稼働開始）、2025年9月30日に解散した。期中に完了し期末の構成に反映済みのため、needsReviewにはせず沿革・構造に記載した。
- businessModel: オランダ子会社3社の商号変更（2025年4月・9月）及びYUKIGUNI FACTORY NETHERLANDS HOLDINGS B.V.の完全子会社化（2025年12月）は期中に完了し期末の構成に反映済みのため、沿革・構造に記載した。
- businessModel: 中期経営計画の定量目標には比率指標（海外売上構成比等）が含まれるため、戦略本文には転記しなかった。
- businessModel: タカラバイオ株式会社は、2019年3月に瑞穂農林株式会社及び株式会社きのこセンター金武の全株式を当社が取得した際の譲渡元であり、一過性の取引相手で継続的な提携の印字がないため、関連企業として結ばなかった。
- businessModel: 関連候補のその他の社名（コア、ベース、ステップ、ゼロ、エン、セキ、イノベーション、ランド、スペース、地主、テイン、トラスト、大水、パス、ポート、リズム、ビジョン）は、いずれも一般語・部分一致の誤検出であり、有報に取引・提携・資本関係の記述がないため結ばなかった。大水は2014年の青島東冷食品有限公司の株式譲渡先（青島大水食品有限公司）の部分一致でもある。
- businessModel: 金額はすべて有報の百万円印字をそのまま転記した（換算・四捨五入はしていない）。
- businessStructure: 報告セグメントは茸事業のみであり、その他は報告セグメントに含まれない事業として構造化した。
- businessStructure: 連結子会社は、瑞穂農林株式会社（2025年9月30日解散）、YUKIGUNI FACTORY NETHERLANDS HOLDINGS B.V.、SPROOMZ B.V.、YUKIGUNI FACTORY NETHERLANDS REAL ESTATE B.V.の4社（関係会社の状況に印字）。瑞穂農林は議決権所有割合49.0％だが実質的に支配しているため子会社とされている。
- history: 沿革は旧雪国まいたけ①の設立から記載される有報の印字に基づき、主要な構造変化に絞って選定した。営業所開設・工場新設等の個別行は省略した。
- history: 資本金の金額は沿革に転記しなかった。
- industry: 主たる業界は、きのこ類及びきのこ加工食品の生産及び販売が主たる事業であることに基づく食品とした。
- relatedCompanies: 親会社の株式会社神明ホールディングス（議決権の被所有割合50.13％）は非上場で百科事典の登録がなく、関連候補にも含まれないため結ばなかった。親会社の事実は事業構造とbusinessModelのwarningsに記録した。
- relatedCompanies: タカラバイオ株式会社は2019年の株式取得の際の一過性の譲渡元であり、継続的な提携の印字がないため結ばなかった。
- relatedCompanies: その他の関連候補はすべて一般語・部分一致の誤検出であり、有報に取引・提携・資本関係の記述がないため結ばなかった（候補ごとの理由はbusinessModelのwarningsに記録）。
- terms: 助言: 用語「生物資産」は、IFRSの農業会計（IAS第41号）で、生産工程にあるきのこを売却費用控除後の公正価値で測定する資産のことで、当社の連結財務諸表で使われています（MD&Aに印字）。
- terms: 助言: 用語「公正価値変動による利得」は、生物資産の公正価値の変動により生じる利得で、当社では収益と売上原価の双方に含まれます（MD&Aに印字）。
- terms: 助言: 用語「培地」は、オガ粉と栄養添加物を独自の割合で配合し高温・高圧で殺菌した、きのこ栽培の土台となる材料です（事業の内容に印字）。
- terms: 助言: 用語「雪国まいたけ 極」は、当社が自社開発の新菌から収穫する主力のまいたけで、旨味と歯ごたえに特徴があります（事業の内容に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
