# ラクサス・テクノロジーズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ラクサス・テクノロジーズ株式会社 |
| 証券コード | 288A |
| docID（データを取り出した文書） | `S100YYR9` |
| 原本 docID | `S100YI4C` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YYR9／有効文書 S100YYR9（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYR9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ラクサス・テクノロジーズ株式会社 / 288A / docID S100YI4C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 6 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
laxus-technologies: 10 件の数値を有報XBRLと照合
有報: ラクサス・テクノロジーズ株式会社 訂正有価証券報告書－第20期(2025/04/01－2026/03/31) (docID S100YYR9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第20期(2025/04/01－2026/03/31)、docID S100YYR9）を有効文書としてこのパックを作った。原本は docID S100YI4C。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（ManagementAnalysisOfFinancialPositionOperatingResultsAndCashFlowsTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 前期の窓に 訂正有価証券報告書－第19期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
laxus-technologies: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書S100YYR9（2026年８月31日提出）は、経営成績等の分析の本文の記載事項訂正であり、主要財務（売上高・当期純利益・総資産・純資産・従業員数）は原本S100YI4Cと同一である。指標に影響しないため訂正数値の登録やfinancialNoteは行わず、本文は訂正有報から書き、出典は訂正有報に付けた。
- businessModel: 前期の窓にある第19期の訂正有価証券報告書についても、前期有報との修正再表示チェックで全系列に差異がなかったため、warningsのみとした。
- businessModel: 経営成績の分析に印字された営業利益・経常利益・売上総利益の金額と増減率は、本文の財務数値を売上高と当期純利益に限る規則により書かなかった。
- businessModel: 経営方針に印字されたLTV/CACやCACの回収期間などの数値は、指標の目標・実績の類として戦略の文章には書かなかった。
- businessModel: Wikipedia（「ラクサス・テクノロジーズ」）は旧社名がエス株式会社である補足のみで、沿革は有報で足りるため出典に使わなかった。なお、Wikipediaは同社を「ワールドの持分法適用会社」とするが、有報の【関係会社の状況】の分類は「その他の関係会社」であり、有報の分類に従った。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。サービスの用に供するブランドバッグは主にリユース市場を通じて調達している旨が【事業の内容】に印字されているが、個別の仕入先の名称は印字されていない。
- businessStructure: 主要な設備は本社（広島市中区）、東京オフィス（東京都渋谷区）、物流拠点「Laxus Base」（広島市南区）で、いずれも単一セグメントのラクサス事業に使われている。帳簿価額は書かなかった。
- businessStructure: 子会社はなく非連結である。米国の子会社LAXUS TECHNOLOGIES INC.は2024年５月に解散し、2025年６月に清算結了している（沿革・関連当事者情報の印字）。
- history: 沿革は年月セル15件と事象文15件が同数で対応が取れる崩れた表だったため、行順に対応づけて年だけを採った（月は書かない）。
- history: 省いた項目: 2014年の東京オフィス開設、2018年のセカンドサービス「BagList（バッグリスト）」開始、2020年の米国子会社LAXUS TECHNOLOGIES INC.設立と2024年の解散、2020年の物流拠点「Laxus Base」開設、2024年の東京オフィス移転。いずれも事務所・拠点の開設移転や子会社の設立・解散で、事業の骨格を変えるものではないため落とし、ここに列挙した。
- history: 設立時の資本金950万円は、沿革に資本金の金額を書かない規則により落とした。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、単一セグメントのラクサス事業（ブランドバッグのサブスクリプション型シェアリング）に基づき、消費者にモノを提供する形態に最も近い retail を暫定とした。金額が独立して開示された他の事業はないため、追加の業界は付けなかった。分類の不足は taxonomyGaps に記録した。
- relatedCompanies: 株式会社ワールド（候補外）: 【関係会社の状況】で「その他の関係会社」とされ、2026年３月31日現在の被所有割合は41.3％で営業上の取引があると印字され、【大株主の状況】でも所有割合41.27％の筆頭株主である。しかし related-candidates.json の候補にないため結ばなかった。2019年に親会社となり、2024年12月の上場に伴いその他の関係会社に変更となった経緯は沿革に記録した。
- relatedCompanies: land（株式会社ランド）: 「ブランド」などの一般語の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「〜をベースとした」「基盤」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: cover（カバー株式会社）: 「カバーし合える」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: step（株式会社ステップ）: 「ステップアップ」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: core（株式会社コア）: ambiguous で、「コアビジネス」の部分一致のみのため結ばなかった。
- relatedCompanies: en（エン株式会社）: ambiguous で、「エンジニア」などの部分一致のみのため結ばなかった。
- relatedCompanies: technologies（株式会社テクノロジーズ）: 自社名「ラクサス・テクノロジーズ」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: ambiguous で、「仕入れたバッグの直接廃棄はゼロ」の文脈のみのため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: コードリストになく ambiguous で、新株予約権の文脈の部分一致のみのため結ばなかった。
- relatedCompanies: ray（株式会社レイ）: ambiguous で、「レイヤー」の部分一致のみのため結ばなかった。
- relatedCompanies: the-lead（株式会社リード）: 「消費者のニーズ、嗜好をリードしていく」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 新型コロナウイルス感染症の市場環境の文脈のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: enigmo（株式会社エニグモ）: 主な資産及び負債の内容の売掛金の相手先内訳に名称があるだけで、取引の内容を示す記載がないため結ばなかった。
- relatedCompanies: freee（フリー株式会社）: 「フリーロケーション」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: seki（株式会社セキ）: ambiguous で、「セキュリティ」の部分一致のみのため結ばなかった。
- relatedCompanies: space（株式会社スペース）: 「保管・作業スペース」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: zett（株式会社ゼット）: 「マイバッグクローゼット」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: 大株主のうち野村信託銀行（投信口）、岡三証券、野村證券、SBI証券は金融機関・証券会社の純投資であり、事業会社ではないため結ばなかった。当社は投資株式を保有していないため、政策保有株式によるリンクもない。
- terms: 提案する用語候補は次のとおりです（用語集への登録は提案のみで、ここでは登録していません）。
- terms: ラクサス：ラクサス・テクノロジーズが2015年から提供する、ブランドバッグのサブスクリプション型シェアリングサービスの名称。
- terms: 買えちゃうラクサス：レンタル中のバッグを会員がそのまま購入できるサービス。
- terms: Lax-mochi（ラクモチ）：2025年12月に提供を開始したスマートキープ型サービス。試して月額払いとし、後で返せる仕組み。
- terms: モノの価値循環モデル：シェアリングによる「使用」と「販売」を組み合わせ、1つのバッグの生涯収益を最大化する同社の事業モデルの呼称。
- terms: ShaaS（Sharing as a Service）：同社のシェアリングサービスのノウハウを外部企業へ展開する連携の呼称。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ラクサス・テクノロジーズのラクサス事業（ブランドバッグのサブスクリプション型シェアリングサービス） → 提案: レンタル・シェアリングサービス。ブランドバッグを販売するのではなく月額定額で貸し出し、貸出後のバッグを販売するシェアリングが事業の実体であり、商品の販売を指す retail とは業態が異なります。閉じた分類（INDUSTRY_IDS）にレンタル・シェアリングに当たる区分が無いため、最も近い retail を暫定とし、分類の不足として記録します。
