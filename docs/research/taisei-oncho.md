# 大成温調 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大成温調株式会社 |
| 証券コード | 1904 |
| docID（データを取り出した文書） | `S100YIC7` |
| 原本 docID | `S100YIC7` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIC7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大成温調株式会社 / 1904 / docID S100YIC7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
taisei-oncho: 10 件の数値を有報XBRLと照合
有報: 大成温調株式会社 有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YIC7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
taisei-oncho: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画「LIVZON DREAM 2030 2nd half!」の数値目標（営業利益額・ROE・EPS・DOE）は投資の語や比率を含むため転記せず、戦略の内容だけを要約した。
- businessModel: 主要な顧客の株式会社フジタは売上実績の印字に基づき顧客として本文に書いたが、関連企業としては結んでいない（理由は関連企業の成果物の warnings に記録）。
- businessModel: 売上高・当期純利益の増減率はMD&Aの印字（売上高1.3％減・当期純利益42.7％増）をそのまま使った。
- businessStructure: 報告セグメントは地域別（日本・米国・中国・オーストラリア）の4区分で、外部顧客への売上高の大きい順に並べた。金額はMD&Aの印字（475億26百万円・123億50百万円・17億93百万円・47百万円）をそのまま使った。
- businessStructure: セグメント注記の外部顧客への売上高（千円）は日本47,526,867・米国12,350,787・中国1,793,442・オーストラリア47,967で、単純合計は連結売上高61,719,065千円と2千円差がある（印字の丸め）。本文ではMD&A印字の金額を用いた。
- businessStructure: 事業の内容に区分される設備工事事業・建築事業・不動産事業・その他の事業は地域セグメントと対応づけて日本の子区分等に整理した。事業区分ごとの独立した金額開示はないため、子区分には金額を書いていない。建築事業は中国の上海法人のみが担う。
- businessStructure: セグメントに含まれない「その他」（ベトナムへの投資額）は外部顧客への売上高がなく、事業として並べていない。
- history: 沿革の印字から節目となる出来事を選んだ。支店・営業所の設置や昇格・降格、清算結了した海外子会社（フィリピン・インド・香港など）の個別行は省いた。
- history: 資本金の金額は沿革に印字がなく、書いていない。
- industry: 主たる業界は construction とした。設備工事事業が連結売上高の大半を占め、関連情報でも単一の製品・サービスの区分が連結売上高の90％を超えると開示されているためである。
- industry: 不動産事業と太陽光発電事業は地域セグメント（日本・オーストラリア）の中に含まれ、独立した金額の開示がないため、real-estate と energy は付けていない。
- relatedCompanies: 株式会社フジタ: 売上高の10.1％を占める主要な顧客だが、同社には百科事典のエントリがなく、related-candidates.json にも載っていないため結ばなかった。候補の fuji-8278 は株式会社フジで、別の会社である。
- relatedCompanies: アクアウェッジ株式会社: 関係会社の状況では「その他の関係会社」として当社株式の15.9％を保有し、大株主の状況でも筆頭株主（15.81％、2026年３月31日現在）だが、非上場で候補に載っていないため結ばなかった。
- relatedCompanies: ISOTEAM LTD.: 特定投資株式として「設備工事業の海外展開」を目的に保有し、沿革にも2019年の株式取得が印字されるが、外国の会社で候補に載っていないため結ばなかった。
- relatedCompanies: 特定投資株式の各銘柄（森永製菓・TOPPANホールディングス・松竹・東京瓦斯・リンテック・日立製作所・ブルーイノベーションなど）: 保有目的が「施主からの設備工事の継続的な受注を含む企業間取引の強化」という全銘柄共通の定型句だけであり、相手ごとの具体的な取引・提携の印字がないため結ばなかった。
- relatedCompanies: 大林組・長谷工コーポレーション・安藤・間・大和ハウス工業: 完成工事・手持工事の印字で元請として名前が出るだけで、継続的な取引関係の印字がなく、有報の主要な顧客の開示は株式会社フジタのみであるため結ばなかった。
- relatedCompanies: 東テク株式会社・株式会社オーテック: 大株主の状況に載る事業会社だが、持株比率は1.12％・0.80％にとどまり、取引や提携の印字がないため結ばなかった。
- relatedCompanies: SEAREFICO CORPORATION: 持分法適用関連会社（当社グループの関連会社そのもの）であり、関連企業リンクの対象ではない。
- relatedCompanies: 日本カストディ銀行（信託口）は信託口であり結ばない。大成温調取引先持株会・従業員持株会・奨学財団は候補にない。
- relatedCompanies: 候補の en・career・step・seki・core・vision・base-4481・land・hub・port・path・zero・trust・corona・sanno・taya・link-and-motivation は、いずれも一般語・部分一致であり、該当する会社との関係の印字がないため結ばなかった。
- terms: 助言: 用語「LIVZON」は、同社グループが2020年４月にスタートした自社ブランドで、長期経営ビジョン「LIVZON DREAM 2030」の名称にも使われている。
- terms: 助言: 用語「総合たてものサービス企業」は、設備工事にとどまらず建物に関する幅広い付加価値を提供する企業像として、同社が目指す姿を表す呼び方である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
