# 日本コークス工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本コークス工業株式会社 |
| 証券コード | 3315 |
| docID（データを取り出した文書） | `S100YK1Z` |
| 原本 docID | `S100YK1Z` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK1Z.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本コークス工業株式会社 / 3315 / docID S100YK1Z（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-coke-and-engineering: 10 件の数値を有報XBRLと照合
有報: 日本コークス工業株式会社 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YK1Z)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nippon-coke-and-engineering: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と親会社株主に帰属する当期純利益（純損失）のみを記載した。セグメント利益・営業損益・経常損益の金額や増減率は書かなかった。
- businessModel: 連結損益計算書の表示方法の変更（陸上運賃、助成金収入の独立掲記など）に伴い、前連結会計年度の連結財務諸表の組替えが行われている。表示区分の変更のみで、5年間の主要な経営指標（売上高、経常損益、純損益、総資産、純資産）への影響はなく、修正再表示チェックも前期有報と全行一致したため、financialNotesには入れず、ここに記録した。
- businessModel: コークス生産体制最適化（老朽化した2炉団の休止と健全2炉団体制への移行）は2025年11月に期中決定され、不稼働資産の減損も当期に認識されているため、期中の出来事として戦略に反映し、needsReviewには入れなかった。減損などの金額は本文には書かなかった。
- businessModel: セグメントの外部顧客への売上高の合計は91,385百万円となり、印字の連結売上高91,386百万円と1百万円異なる（印字された表の中での丸め）。本文では各数値を印字どおりに引用した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。「その他」は有報が報告セグメントに含まれない区分と明記するもので、最後に置いた。
- businessStructure: 【事業の内容】ではグループは子会社8社で構成されると印字されるが、【関係会社の状況】に名称が挙がる連結子会社は6社（三池港物流、有明機電工業、三美鉱業、サンテック、サン情報サービス、日本コークス工業東北）であり、事業の説明は名称が印字された範囲で書いた。
- history: 【沿革】の印字26行をすべて転記した。1892年の行に印字された資本金の金額は、本文に書く財務数値を売上高と当期純利益に限る方針のため、説明文には含めなかった。
- history: 年月のセルと事象文が分かれた崩れた表ではなく、年月と事象が一体で印字されているため、行順の対応づけは不要だった。
- industry: 主たる業界はenergyとした。コークス、一般炭、石油コークスはいずれも燃料であり、外部顧客への売上高の大半（コークス事業と燃料・資源リサイクル事業の合計で全体の約87％）を占める。
- industry: 総合エンジニアリング事業は粉粒体装置・機器の製造・販売を行う独立した報告セグメント（2026年3月期の外部顧客への売上高7,917百万円）として開示されているため、machineryを2つ目に付けた。
- industry: コークス副産物は化学品の性質も持つが、独立した金額開示がないため、chemicalsは付けなかった。
- relatedCompanies: 株式会社商船三井（mitsui-o-s-k-lines、大株主の所有割合0.86％）、三井金属株式会社（mitsui-kinzoku、0.79％）、住友金属鉱山株式会社（sumitomo-metal-mining、0.79％）は大株主に印字される事業会社だが、保有割合が小さく、取引・提携の印字もないためリンクしなかった。三井金属は1950年に分離した神岡鉱業の後身だが、現在の関係の印字はない。
- relatedCompanies: 三井物産株式会社（mitsui-and-co）は、沿革の1889年の記述に歴史的な協力先として登場するだけで、現在の取引・提携の印字がないためリンクしなかった。
- relatedCompanies: 株式会社サンテック（sanyo-engineering-and-construction、1960）は、名称が一致する連結子会社サンテック株式会社（栃木県栃木市、当社の完全子会社）とは別法人である。子会社自身は関連企業として結ばないため、リンクしなかった。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社（信託口）は信託口の名義であり、候補の株式会社トラスト（trust）とは別法人で、コードリストにもないためリンクしなかった。STATE STREET BANK AND TRUST COMPANYの各名義も保管・信託の名義のためリンクしなかった。
- relatedCompanies: 株式会社三井住友銀行は大株主（所有割合1.29％）に印字されるが、銀行そのものであり資金調達の関係にとどまるためリンクしなかった。
- relatedCompanies: 一般語・部分一致の候補（en、tear、zero、base-4481、cover、port、career、freee、lec、space）は、当社との取引・提携・資本関係の印字がないためリンクしなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は、有報本文に説明が印字された同社固有の生産体制の単位と新商品の名称から選んだ。

## 要確認（status に反映）

- businessModel: 2026年4月24日付で、財務上の特約が付されたコミットメントライン契約について、コミット期間および財務上の特約の内容を変更しています。重要な後発事象として印字された期後の財務契約の変更であり、本登録は2026年3月31日現在の契約内容に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
