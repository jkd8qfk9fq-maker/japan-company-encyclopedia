# 河合楽器製作所 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社河合楽器製作所 |
| 証券コード | 7952 |
| docID（データを取り出した文書） | `S100YG4C` |
| 原本 docID | `S100YG4C` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-16 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG4C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社河合楽器製作所 / 7952 / docID S100YG4C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
kawai-musical-instruments-manufacturing: 10 件の数値を有報XBRLと照合
有報: 株式会社河合楽器製作所 有価証券報告書－第99期(2025/04/01－2026/03/31) (docID S100YG4C)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kawai-musical-instruments-manufacturing: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 表示方法の変更に伴い、前事業年度の連結損益計算書について営業外収益の内訳表示を改める組替えが行われている。表示方法の変更のみであり、主要な経営指標等の修正再表示チェックでは全系列が前期有報と一致したため、financialNotesには記録せず本warningsのみとした。
- businessModel: セグメント別売上高の合計（72,048百万円）および地域別売上高の合計（72,047百万円）と連結売上高（72,049百万円）との差は印字の丸めによるもので、各数値は印字のまま記載した。
- businessModel: 第8次中期経営計画『KAWAI 十年の計』の目標指標はROEなどの比率と金額目標であるため、本文には数値を記載せず方針の要約のみとした。
- businessModel: 学研ホールディングスとの資本提携の解消（2026年2月27日）は当期中の出来事で期末の構成に反映されているため、needsReviewには入れず、関連企業の説明と沿革に反映した。
- businessModel: Wikipediaの記事は確認したが、創業者名など有報にない補足は本登録では使わず、出典にも加えていない。
- businessStructure: セグメントの外部顧客への売上高は注記事項（セグメント情報等）の印字どおりで、3セグメントの合計72,048百万円と連結売上高72,049百万円の差1百万円は印字の丸めによるもので、そのまま記載した。
- businessStructure: セグメント内の事業分野ごとの売上高は開示されていないため、子事業には金額を記載していない。
- history: 沿革に印字された創業時や子会社設立時の資本金の金額は、財務金額に当たるため本文には記載していない。
- history: 営業所・出張所の開設、販売子会社の設立・合併などの細かな行は省き、理由は本 warnings のとおりである。省いた主な行：1960年の直営店制度開始、1981年のカワイオーストラリア設立、1985年のカワイビジネスソフトウエア設立、1986年のカワイUK設立、1989年のカワイ音響システム設立、1998年のカワイハイパーウッド設立、2002年・2016年の中国販売会社の設立、2004年の河合楽器（寧波）設立、2012年の上海カワイ電子とカワイキャスティングの設立、2015年のヒューストン直営店開設、2018年のカワイフランス設立、2023年の中国販売会社の合併、2023年のポーランド支店設立。
- history: パーソンズミュージックコーポレーションとの資本提携は2026年2月27日に解消され業務提携のみが継続しているため、2017年の行の significance にその旨を併記した。
- industry: 主たる事業はピアノ・電子楽器の製造販売であり、閉じた産業リストに楽器の区分はない。掲載済みのヤマハ（yamaha）も electronics を主産業としている先例に揃え、electronics を暫定の主産業とした。素材加工事業は電子電気部品用材料を含むが、独立した金額開示のある報告セグメント単位では楽器教育事業が大半を占めるため、第2の産業は付けていない。
- relatedCompanies: パーソンズミュージックコーポレーションは、重要な契約等に資本業務提携契約（2017年2月9日から2027年2月8日、以後1年ごとの自動更新）が印字されているが、香港の未上場会社でrelated-candidates.jsonに含まれず百科事典にも掲載がないため結ばなかった。提携の事実はbusinessModelのindustryPositionに文章で記録した。
- relatedCompanies: 住友不動産（sumitomo-realty-and-development）は特定投資株式766,000株を保有し、同社も2026年3月31日現在の大株主（所有割合5.11％）であるが、保有目的は『当社グループの取引先であり、取引関係の維持、強化のため』という定型の記載のみで具体的な取引内容の印字がないため結ばなかった。
- relatedCompanies: 日本毛織（the-japan-wool-textile）は特定投資株式500,000株を保有し大株主（所有割合4.03％）でもあるが、保有目的は同じ定型の記載のみのため結ばなかった。
- relatedCompanies: 天龍製鋸（tenryu-saw-mfg）は特定投資株式180,000株を保有するが、保有目的は定型の記載のみのため結ばなかった。
- relatedCompanies: スズキ（suzuki）は特定投資株式106,000株を保有するが、保有目的は『同社との良好な関係維持のため、また、地域経済への貢献のため』で取引の印字がないため結ばなかった。
- relatedCompanies: しずおかフィナンシャルグループ（shizuoka-financial-group）は特定投資株式450,000株を保有するが、当社の主要取引金融機関であり資金調達の関係のため結ばなかった。
- relatedCompanies: 三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）は特定投資株式33,000株を保有するが、当社の主要取引金融機関であり資金調達の関係のため結ばなかった。
- relatedCompanies: 永大産業（eidai）は特定投資株式を当期に全て売却し、期末の保有がなくなったため結ばなかった。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）は大株主に載るが信託口（カストディ）であり、事業会社ではないため結ばなかった。
- relatedCompanies: セキ（seki）は『セキュリティ』等の部分一致でambiguousな候補であり、相手についての記載はないため結ばなかった。
- relatedCompanies: ランド（land）は『オーストラリア』等の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: エン（en）は『エンジン』等の部分一致でambiguousな候補であり、相手についての記載はないため結ばなかった。
- relatedCompanies: キャリア（career）は『キャリア』の一般語の一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: ベース（base-4481）は『営業利益ベース』等の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: ハイパー（hyper）は連結子会社カワイハイパーウッドの名称の部分一致で、自社グループの会社のため結ばなかった。
- relatedCompanies: キング（king）は『ランキング』の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: ポート（port）は『サポート』の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: ビジョン（vision）は『ビジョン』の一般語の一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: コロナ（corona）は『新型コロナウイルス』の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: イシン（ishin）は『プライシング』の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: コア（core）は一般語の部分一致でambiguousな候補であり、相手についての記載はないため結ばなかった。
- relatedCompanies: 日本金属（nippon-kinzoku）は労働組合名『全日本金属情報機器労働組合』の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: パス（path）は『キャリアパス』等の部分一致でambiguousな候補であり、相手についての記載はないため結ばなかった。
- relatedCompanies: リズム（rhythm）は『リズム感』の一般語の一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: ステップ（step）は『ステップ』の一般語の一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: トラスト（trust）は信託口表記の部分一致であり、相手についての記載はないため結ばなかった。
- relatedCompanies: 連結子会社23社は自社グループの会社のため結んでいない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
