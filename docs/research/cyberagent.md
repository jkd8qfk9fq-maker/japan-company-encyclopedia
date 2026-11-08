# サイバーエージェント — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サイバーエージェント |
| 証券コード | 4751 |
| docID（データを取り出した文書） | `S100XZ2X` |
| 原本 docID | `S100XCU9` |
| 提出日（原本） | 2025-12-24 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | S100XZ2X, S100XCYB, S100XCY6, S100XCXO, S100XCXA／有効文書 S100XZ2X（2026-11-06 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XZ2X.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サイバーエージェント / 4751 / docID S100XCU9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 12 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cyberagent: 10 件の数値を有報XBRLと照合
有報: 株式会社サイバーエージェント 訂正有価証券報告書－第28期(2024/10/01－2025/09/30) (docID S100XZ2X)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-09-30","previousFiling":666460000000,"latestFiling":666149000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-09-30","previousFiling":710575000000,"latestFiling":709923000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-09-30","previousFiling":720207000000,"latestFiling":719451000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-09-30","previousFiling":802996000000,"latestFiling":801236000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-09-30","previousFiling":41553000000,"latestFiling":41242000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-09-30","previousFiling":24219000000,"latestFiling":22901000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-09-30","previousFiling":5332000000,"latestFiling":3540000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-09-30","previousFiling":16246000000,"latestFiling":15977000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-09-30","previousFiling":104694000000,"latestFiling":104382000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-09-30","previousFiling":69464000000,"latestFiling":67902000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-09-30","previousFiling":24915000000,"latestFiling":22710000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-09-30","previousFiling":41475000000,"latestFiling":39715000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-09-30","previousFiling":382578000000,"latestFiling":382225000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-09-30","previousFiling":383698000000,"latestFiling":381933000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":477826000000,"latestFiling":475222000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":520417000000,"latestFiling":516686000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-09-30","previousFiling":194145000000,"latestFiling":193792000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-09-30","previousFiling":222915000000,"latestFiling":221245000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":231911000000,"latestFiling":228450000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":254235000000,"latestFiling":250504000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第28期(2024/10/01－2025/09/30)、docID S100XZ2X）を有効文書としてこのパックを作った。原本は docID S100XCU9。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 訂正有価証券報告書－第27期(2023/10/01－2024/09/30) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第26期(2022/10/01－2023/09/30) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第25期(2021/10/01－2022/09/30) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第24期(2020/10/01－2021/09/30) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第27期(2023/10/01－2024/09/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第26期(2022/10/01－2023/09/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第25期(2021/10/01－2022/09/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第24期(2020/10/01－2021/09/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第23期(2019/10/01－2020/09/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え・遡及適用・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
cyberagent: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…高収益事業の開発による利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…高収益な事業を開発・展開して利益率の向上を図ることで利益を確保してい…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…おいてメディア＆IP事業と広告事業で利益を積み上げ、ゲーム事業にてヒットタイ…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで前期有報との差異があった理由は、有報の経営指標の注記で特定した: 過年度に不適切な会計処理が行われていたことが判明し、第24期から第27期（2021年9月期〜2024年9月期）の数値は過年度遡及修正による訂正を反映したもの。このため差異のある全系列（売上高・経常利益・当期純利益・総資産・純資産）について、financialNotes に4期分の注記を書いた。エントリーの数値は有効文書（訂正有報）の値を採用している。
- businessModel: 有効文書は訂正有価証券報告書（S100XZ2X）だが分類は record-only で、財務数値・本文は原本（S100XCU9）と同一。出典の title・url・publishedAt は有効文書の値を用いた。
- businessModel: flow の profit では、セグメント利益や営業利益の金額は規則により書かず、売上高と当期純利益だけを用いた。メディア&IP事業の黒字化にも金額・増減率を伴うため本文には書かなかった。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2025年9月期）の大きい順（インターネット広告438,811百万円、メディア&IP217,164百万円、ゲーム216,391百万円、投資育成1,663百万円）。MD&Aの売上高（セグメント間取引を含む）ではなく、セグメント注記の外部顧客への売上高で並べた。
- businessStructure: 当連結会計年度より報告セグメントの区分が変更されている（「その他事業」をメディア事業へ統合し、「メディア事業」を「メディア&IP事業」に名称変更）。エントリーは変更後の4区分で記載し、前期のセグメント情報も変更後の区分で組替え開示されている。
- businessStructure: listings の market は表紙の印字「東京証券取引所プライム市場」から「プライム」とした。
- businessStructure: Wikipedia の抜粋は有報の記載と重なる内容（事業構成・本社所在地）のみで、補足に使える固有情報が乏しいため使用しなかった。
- history: 沿革は【沿革】の記載から主要な出来事を精選した。省いたもの: 1999年の本店移転、2010年の㈱アプリボット設立（2011年のCygames設立の説明に含めた）、2016年の㈱QualiArts設立、2018年の㈱Colorful Palette設立と㈱AbemaTV・㈱電通・㈱博報堂DYメディアパートナーズの資本業務提携（関係会社としては候補外のため関連企業にも結んでいない）。
- history: 年月は【沿革】の印字どおりで、history の規則に従い年だけを記録した。
- industry: 主たる業界は、外部顧客への売上高の約半分を占めるインターネット広告事業を踏まえ、インターネットサービス全般を表す最も近い値として it を暫定とした（taxonomyGaps 参照）。
- industry: メディア&IP事業（ABEMA等）に media、ゲーム事業に entertainment を2つ目以降として付けた。
- relatedCompanies: エイベックスは特定投資株式だが、保有目的が定型句ではなく「AWA」事業での2014年の資本業務提携とエンターテインメント分野での幅広い取引関係という相手固有の記載があり、株式数も5,500,000株と小さくないため business-partner として結んだ（計上額は書いていない）。
- relatedCompanies: ㈱テレビ朝日（㈱AbemaTVの共同出資者）、㈱電通・㈱博報堂DYメディアパートナーズ（2018年に㈱AbemaTVと資本業務提携）、㈱リアルゲイト（連結子会社）は有報に記載があるが、related-candidates に含まれていないため規則により結ばなかった。
- relatedCompanies: セキ（seki）: 「情報セキュリティ」「人的資本」などの一般語への一致で、セキ㈱への言及ではないため結ばなかった。ambiguous の相手でもある。
- relatedCompanies: キャリア（career）: 「キャリア志向」などの一般語への一致で、㈱キャリアへの言及ではないため結ばなかった。
- relatedCompanies: エン（en）: 「エンジニア」などの語への一致で、エン㈱への言及ではないため結ばなかった。ambiguous の相手でもある。
- relatedCompanies: ランド（land）: 「ブランドロゴ」などの語への一致で、㈱ランドへの言及ではないため結ばなかった。
- relatedCompanies: 日新（nissin）: listing が上場ではなく、「新株予約権」などの語の断片への一致のため結ばなかった。
- relatedCompanies: ゼロ（zero）: 「ゼロ化」などの一般語への一致で、㈱ゼロへの言及ではないため結ばなかった。ambiguous の相手でもある。
- relatedCompanies: ビジョン（vision）: 同社の経営ビジョンへの言及への一致で、㈱ビジョンへの言及ではないため結ばなかった。
- relatedCompanies: ヒット（hit）: 「ヒットタイトル」などの一般語への一致で、㈱ヒットへの言及ではないため結ばなかった。
- relatedCompanies: ベース（base-4481）: 「営業利益ベース」などの語への一致で、ベース㈱への言及ではないため結ばなかった。
- relatedCompanies: イノベーション（innovation）: 「イノベーションの低下」などの一般語への一致で、㈱イノベーションへの言及ではないため結ばなかった。
- relatedCompanies: パス（path）: 「パーパス」の語への一致で、パス㈱への言及ではないため結ばなかった。ambiguous の相手でもある。
- relatedCompanies: テイン（tein）: 「エンターテインメント」の断片への一致で、㈱テインへの言及ではないため結ばなかった。
- relatedCompanies: トラスト（trust）: 日本マスタートラスト信託銀行（信託口）の保管名義への一致で、信託銀行の名義であり結ばなかった。listing も上場ではない。
- relatedCompanies: コロナ（corona）: 新型コロナウイルスへの言及への一致で、㈱コロナへの言及ではないため結ばなかった。
- relatedCompanies: レント（rent）: 「タレント」の断片への一致で、㈱レントへの言及ではないため結ばなかった。
- relatedCompanies: リズム（rhythm）: 一般語への一致で、リズム㈱への言及ではないため結ばなかった。
- terms: 助言: 「DOE（自己資本配当率）」は用語集に未登録です。有報では「DOE５%以上」を経営指標の目安として説明しており、同社の株主還元の考え方を理解する中心的な指標です。
- terms: 助言: 「パーパス」も未登録です。2021年より掲げる「新しい力とインターネットで日本の閉塞感を打破する」という存在意義を指す言葉として、有報の経営方針で説明されています。
- terms: 助言: 「メディアミックス」も未登録です。MD&Aで「メディアミックス戦略を中心としたIPビジネスが急成長」と使われており、「ABEMA」とIP事業を組み合わせる同社の戦略を表す中心概念です。
- terms: 「ABEMA」「Ameba」「WINTICKET」「Makuake」はサービス名（固有名詞）のため、用語の候補にはしなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] サイバーエージェントの主たる事業（インターネット広告事業） → 提案: advertising（広告）。最大の報告セグメントはインターネット広告事業（2025年9月期の外部顧客への売上高438,811百万円、全体の約半分）ですが、閉じた分類に広告業を表す値がありません。インターネットサービス全般を表す最も近い値として it を暫定で付けました。
