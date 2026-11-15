# ゼリア新薬工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ゼリア新薬工業株式会社 |
| 証券コード | 4559 |
| docID（データを取り出した文書） | `S100YKC2` |
| 原本 docID | `S100YKC2` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKC2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ゼリア新薬工業株式会社 / 4559 / docID S100YKC2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
zeria-pharmaceutical: 10 件の数値を有報XBRLと照合
有報: ゼリア新薬工業株式会社 有価証券報告書－第72期(2025/04/01－2026/03/31) (docID S100YKC2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
zeria-pharmaceutical: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: セグメント別外部顧客への売上高の合計は89,159,261千円となり、連結売上高89,159,262千円と1千円の差があるが、印字どおりに用いる。
- businessModel: 地域別売上高の内訳の合計は89,159,260千円となり、連結売上高89,159,262千円と2千円の差があるが、印字どおりに用いる。
- businessModel: 証拠パックは本文に財務諸表の組替えの記載がある旨の注意を示すが、抽出された本文に当該注記の本文は含まれず、前期有報との5年間指標の照合は全8行一致したため、指標への影響はないものとして表示のみの変更と扱い、financialNotesには載せない。
- businessModel: 第12次中期経営計画の数値目標（連結売上高1,000億円、連結自己資本当期純利益率10％以上）は投資指標・比率のため本文には載せず、警告にのみ記録する。
- businessModel: 2025年4月1日付で完全子会社であった健創製薬株式会社を吸収合併した（共通支配下の取引）。合併に際し株式の発行及び金銭その他の財産の交付はなく、期首の構造に反映されているため、needsReviewには載せない。
- businessModel: 当連結会計年度の研究開発費は3,709百万円（セグメント別は医療用医薬品事業2,954百万円、コンシューマーヘルスケア事業754百万円）で、本文の金額は売上高と当期純利益のみのため本文には載せない。
- businessStructure: 当社グループは当社、子会社19社及び関連会社1社で構成される。連結子会社は17社、非連結子会社はゼリア商事株式会社と株式会社ゼリアエコテックの2社、持分法適用関連会社は1社である。
- businessStructure: 子会社の事業内容は【事業の内容】の記載に基づく。子会社ごとの金額は印字されていないため、子会社の説明には金額を載せない。
- history: 沿革の2014年9月から2016年11月までの区間は日付9件と事象9件が崩れて並んでいたため、日付と事象を順に対応させて行に分けた。2018年4月・2020年3月、2020年4月・9月・11月、2021年12月・2022年3月・4月、2024年10月・2025年3月・4月、2025年9月・10月の各区間も同様に件数が一致したため順に対応させた。
- history: 1983年10月は中央研究所の新設と埼玉工場の増設の2事象が1つの日付に載っていたため2行に分け、2000年3月も市場第一部指定とゼリアエコテック設立の2事象を2行に分けた。
- history: 設立時の資本金など、沿革に印字された資本金額は先例の規則により載せない。
- industry: 主たる業界はpharmaceuticalsとした。報告セグメントは医療用医薬品事業とコンシューマーヘルスケア事業で、いずれも医薬品関連であり、医療用医薬品事業が外部顧客への売上高の69.1％を占める。
- industry: その他（保険代理業及び不動産業等）は外部顧客への売上高が150百万円（全体の0.2％程度）で報告セグメントでもないため、副次分類は付けなかった。
- industry: 海外売上高比率は59.3％で、欧州を中心に海外展開している。
- relatedCompanies: 特定投資株式のうち、保有目的が金融取引等の円滑な推進である銀行・金融持株会社（あいちフィナンシャルグループ、みずほフィナンシャルグループ、三井住友フィナンシャルグループ、三菱ＨＣキャピタル）は資金調達目的のみのため結ばない。
- relatedCompanies: ツルハホールディングスは当事業年度に保有株式をすべて売却し期末保有がなくなったため結ばない。
- relatedCompanies: みなし保有株式（退職給付信託契約に基づく議決権行使の指図権）は信託口の保有のため、リンクの根拠とはしない。特定投資株式として直接保有する銘柄については直接保有を根拠に結ぶ。
- relatedCompanies: アステラス製薬は2023年4月の「ダフクリア錠200mg」の製造販売承認の承継が一時的な権利承継のみで、継続的な取引の印字がないため結ばない。Tillotts Pharma AGの「ディフィクリア錠」の製造販売権の承継元は海外法人Astellas Pharma Europe Ltd.である。
- relatedCompanies: 日産化学はカルシウム拮抗剤「ランデル」の製造販売承認の承継が一時的な権利取得のみで、継続的な取引の印字がないため結ばない。
- relatedCompanies: Vifor (International) AG（フェインジェクト、ビルタサのライセンス元）、MSD International GmbH（ダフクリアのライセンス元）、AstraZeneca AB（エントコートの権利元）、Eli Lilly and Company（アシノンの権利元）、Meiji Seikaファルマ（アコファイドのタイにおけるライセンス先）、FAES FARMA, S.A.及びAgastra-Lab s.r.l.（アコファイドのライセンス先）はいずれも海外法人又は非上場で関連候補になく、エントリもないため結ばないが、契約関係は【重要な契約等】に印字されている。
- relatedCompanies: 住友不動産は2025年12月31日付で普通株式1株につき2株の割合をもって株式分割を行っており、保有株式数は前事業年度の189,000株から378,000株に増加している。
- relatedCompanies: 大株主のうち、有限会社伊部（12.09％）は非上場で関連候補になくエントリもないため結ばない。日本マスタートラスト信託銀行は信託口のため結ばない。三菱ＵＦＪ銀行、三井住友銀行、みずほ銀行は銀行本体であり、上場持株会社とは別人格のため結ばない。三井住友カードは三井住友フィナンシャルグループの非上場子会社で関連候補にないため結ばない。伊部幸顕及びゼリア新薬工業従業員持株会は個人・団体のため結ばない。
- relatedCompanies: en、base-4481、king、lec、port、career、path、seki、core、corona、cover、hiraga、suzuki-6785、hyper、kawasaki-and-co、kinden、hisaka-works、yokogawa-bridge-holdings、tokai-tokyo-financial-holdings、resona-holdings、sumitomo-mitsui-trust-groupは一般語の部分一致、役員名の一致、退職給付信託の一致、又は当社グループ自身の旧社名の一致であり、取引の事実がないため結ばない。
- relatedCompanies: 連結子会社17社、非連結子会社2社及び持分法適用関連会社1社は当社グループ自身であり、関連企業のリンクとはしない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
