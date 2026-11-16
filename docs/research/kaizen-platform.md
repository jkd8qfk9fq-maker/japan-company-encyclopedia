# Kaizen Platform — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｋａｉｚｅｎ　Ｐｌａｔｆｏｒｍ |
| 証券コード | 4170 |
| docID（データを取り出した文書） | `S100XSOQ` |
| 原本 docID | `S100XSOQ` |
| 提出日（原本） | 2026-03-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSOQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｋａｉｚｅｎ　Ｐｌａｔｆｏｒｍ / 4170 / docID S100XSOQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kaizen-platform: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｋａｉｚｅｎ　Ｐｌａｔｆｏｒｍ 有価証券報告書－第9期(2025/01/01－2025/12/31) (docID S100XSOQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kaizen-platform: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Kaizen Platform」が EDINET の提出者名「株式会社Ｋａｉｚｅｎ　Ｐｌａｔｆｏｒｍ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 指標注記6（全文）: 『第７期において、企業結合に係る暫定的な会計処理の確定を行っております。この暫定的な会計処理の確定に伴い第６期の関連する主要な経営指標等について、確定の内容を反映させております。』2022年12月期のfinancialNoteは先に登録される注記5（収益認識に関する会計基準の適用）を採用したため、注記6は全文をここに記録した。
- businessModel: 指標注記1（損失年度の潜在株式調整後指標の不記載）、注記2・3（株価収益率・自己資本利益率の不記載）、注記4（従業員数の範囲）は表示方法の事項のためwarningsのみとした。
- businessModel: 遡及適用の判断: 証拠パックの注意にある遡及適用は、会計方針の変更注記の法人税等に関する2022年改正会計基準（子会社株式等の売却損益の税務上繰延べの見直し）であり、連結財務諸表への影響はないと印字されている。前期有報との照合は全6系列・4行で差異ゼロであり、本文数値に不整合はないため、financialNotesに事実を記録し、needsReviewには入れなかった。
- businessModel: 当連結会計年度より報告セグメントの区分を従来の『グロース』『トランスフォーメーション』から『プロフェッショナル』『クラウド』に変更している（前連結会計年度のセグメント情報は変更後の区分で作成）。表示区分の変更であり指標への影響はないためwarningsのみとし、登録は当期の区分で行った。
- businessModel: 経営方針の客観的指標（取引アカウント数、ARPU）は事業指標のため、数値目標は本文とperspectivesに書いていない。MD&Aの利益段階の金額・増減理由、セグメント利益の金額、キャッシュ・フローの金額は書いていない。
- businessModel: 株式会社ハイウェルは2025年11月1日付で株式会社Kaizen Tech Agentに商号変更している（期中の変更で、期末のグループ構成に反映済み）。
- businessModel: 前期に米国事業の人的リソースおよび顧客契約の一部をSepteni America社へ移管している（後発事象注記の記載）。Septeni Americaは関連企業候補に含まれていないため結んでいない。
- businessStructure: このツリーの旧スキーマに従い、suppliersキーは省略した。連結子会社の株式会社ディーゼロと株式会社Kaizen Tech Agentは【関係会社の状況】で『当社の外注先』と印字されているが、いずれも当社グループの子会社であり、個別の外部仕入先名は印字されていない。
- businessStructure: 主要な設備のうち提出会社の本社はプロフェッショナルセグメント・クラウドセグメント・その他の行が連記されているため、特定の事業には結びつけなかった。株式会社Kaizen Tech Agentの本社と米国子会社はプロフェッショナルセグメント、株式会社ディーゼロの本社は『その他』と印字されている。帳簿価額は書いていない。
- businessStructure: 連結子会社は3社（Kaizen Platform USA, Inc.、株式会社ディーゼロ、株式会社Kaizen Tech Agent）で、いずれも議決権の所有割合は100.0％である。子会社はいずれも関連企業には結んでいない。
- businessStructure: 当連結会計年度より報告セグメントの区分を変更しており（旧『グロース』『トランスフォーメーション』→『プロフェッショナル』『クラウド』）、事業の並びは当期の区分と外部顧客への売上高の大きい順とした。
- businessStructure: 2025年4月に発表したコンセプト『Magical UX』は商品・サービスそのものではないため、製品には含めていない。
- history: 2025年の商号変更（ハイウェル→Kaizen Tech Agent）は【沿革】には載っておらず、【関係会社の状況】の注記と【主要な設備の状況】の注記の印字に基づくため、当該項目のlocatorは【関係会社の状況】とした。
- history: 省いたもの: 前身KAIZEN platform Inc.の日本支店設置（2013年）、『Kaizen Platform エンタープライズ版』の提供開始（2013年）、『Kaizen Ad』の提供開始（2016年）は、個別のサービス開始・拠点設置のため沿革には含めなかった。設立時の資本金等の金額は書いていない。
- history: 沿革表は年月と事象が同じ行に印字されている崩れのない表であり、行順の対応づけの問題は生じなかった。
- industry: 主たる業界はit（DX支援のコンサルティング等の専門サービスとクラウドサービスの提供が売上のすべて）とした。
- industry: human-resourcesは付けなかった。SESやDX人材ソリューションはプロフェッショナルセグメントの一部であり、金額が独立して開示されていないためである。
- industry: mediaは付けなかった。動画制作やクリエイティブ制作はプロフェッショナルセグメントの一部であり、金額が独立して開示されていないためである。
- relatedCompanies: nissin（株式会社日新）: 『新株予約権』の文言の部分一致のみで、同社との関係の記載はなく、コードリストにもないため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 連結子会社『株式会社ディーゼロ』の名称の部分一致のみで、株式会社ゼロとは別の法人のため結ばなかった。
- relatedCompanies: en（エン株式会社）: 『エンジニア』等の部分文字列の一致で曖昧なため結ばなかった。
- relatedCompanies: core（株式会社コア）: 『コアターゲット』の部分文字列の一致のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 『DXレポート』の部分文字列の一致のみのため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 『ブランド』の部分文字列の一致のみのため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: 『セキュリティ』の部分文字列の一致で曖昧なため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 『経営ビジョン』の一般語の一致のみのため結ばなかった。
- relatedCompanies: 候補に含まれない相手: 株式会社エヌ・ティ・ティ・アドは株式会社DX Catalystの合弁相手で2023年に全株式を譲渡済みの過去の関係であり、候補にも含まれていない。Septeni America社は前期の米国事業の一部移管先だが候補に含まれていない。大株主のうち証券会社・投資事業組合・資産管理会社（株式会社ハック思）は純投資または代表者の資産管理会社であり結ばなかった。
- relatedCompanies: 当社の連結子会社3社（Kaizen Platform USA, Inc.、株式会社ディーゼロ、株式会社Kaizen Tech Agent）は関連企業には結ばなかった。【株式の保有状況】は純投資目的・純投資目的以外とも『該当事項はありません』で、政策保有株式はない。
- terms: 助言のみ。用語としては「DX」「UX」「グロースハッカー」「タグ」「A/Bテスト」「パーソナライズ」「クロスセル」「SES」「BPO」「ARPU」「生成AIエージェント」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 2025年11月27日の取締役会で子会社『株式会社Kaizen AIX Consulting』の設立を決議し、2026年1月30日に設立しています（重要な後発事象）。登録は2025年12月31日現在のグループ構成（連結子会社3社）で行っており、期間後の子会社追加の反映には人の確認が必要です。
- businessModel: 2026年2月13日の取締役会で、連結子会社のKaizen Platform USA, Inc.の全事業の休止を決議しています（事業の休止日は2026年3月31日の予定です）。登録は2025年12月31日現在のグループ構成で行っており、期間後の事業休止の反映には人の確認が必要です。
- businessStructure: 2025年11月27日の取締役会で子会社『株式会社Kaizen AIX Consulting』の設立を決議し、2026年1月30日に設立しています（重要な後発事象）。登録は2025年12月31日現在のグループ構成（連結子会社3社）で行っており、期間後の子会社追加の反映には人の確認が必要です。
- businessStructure: 2026年2月13日の取締役会で、連結子会社のKaizen Platform USA, Inc.の全事業の休止を決議しています（事業の休止日は2026年3月31日の予定です）。登録は2025年12月31日現在のグループ構成で行っており、期間後の事業休止の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
