# プレイド — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社プレイド |
| 証券コード | 4165 |
| docID（データを取り出した文書） | `S100XBSL` |
| 原本 docID | `S100XAX3` |
| 提出日（原本） | 2025-12-17 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | S100XBSL／有効文書 S100XBSL（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBSL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社プレイド / 4165 / docID S100XAX3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
plaid: 10 件の数値を有報XBRLと照合
有報: 株式会社プレイド 訂正有価証券報告書－第14期(2024/10/01－2025/09/30) (docID S100XBSL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第14期(2024/10/01－2025/09/30)、docID S100XBSL）を有効文書としてこのパックを作った。原本は docID S100XAX3。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはOtherReferenceInformationTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
plaid: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書 S100XBSL（2025年12月19日提出、原本 S100XAX3）です。パックの照合では数値・本文とも原本と同一で、差異は OtherReferenceInformationTextBlock のみ（record-only 分類）のため、訂正を理由とする needsReview は設けず、出典は訂正有報に付けています。前期有報との修正再表示照合も、売上高・純利益・経常利益・総資産・純資産・従業員数の全系列で差異ゼロでした。
- businessModel: 主要な経営指標等の推移の注記１から４は、潜在株式調整後１株当たり当期純利益や自己資本利益率・株価収益率を純損失のため記載していない理由と、従業員数の定義であり、いずれも表示上の事項のため financialNotes には記録しませんでした。注記５（収益認識基準の適用）のみを financialNotes に記録しています。株式分割・変則決算の記載はありません。
- businessModel: 経営方針が目標とするARR（経常的に得られる収益の指標）や単体顧客社数・単体顧客単価などの経営指標は、本文と perspectives には金額・数値を書かず、戦略は定性的に書きました（サブスクリプション売上高比率は【事業の内容】に印字された実績値として強みの分析にのみ使いました）。MD&Aの段階利益の金額と理由、キャッシュ・フローの金額、設備の帳簿価額と賃料は書いていません。
- businessModel: 期間後の事象として、2025年10月に取引金融機関からの多額の借入が実行されていますが、資金調達であり構造的な事象ではないため warnings のみとしました。株式会社CloudFitの子会社化は needsReview に記録しています。アジト株式会社の株式交換による完全子会社化（2025年５月）は期間中の事象で、2025年９月30日現在の構成に反映済みです。
- businessModel: 製品・サービスごとの売上高の内訳は【関連情報】の外部顧客への売上高（千円を百万円に切り捨て）を使いました。区分の千円合計と印字の合計には１千円の差があります（businessStructure の warnings に記録）。
- businessStructure: 単一セグメント（SaaS事業）のため、子事業は【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）からプロダクト／サービス／その他の３区分としました。区分の千円合計は13,396,473千円で、印字の売上高合計13,396,474千円と１千円異なります。また、百万円への切り捨て後の区分合計（13,394百万円）は印字の売上高（13,396百万円）と異なります。いずれも有報の印字どおりとしました。
- businessStructure: 【事業の内容】の事業分野は①SaaS事業と②その他周辺事業（CXメディア「XD」の運営やイベント「CX DIVE」の開催）ですが、【関連情報】の「その他」とその他周辺事業の対応は有報に明記されていないため、「その他」の子事業にはメディア事業を直接結びつけず、周辺事業は親事業の説明と businessModel の warnings に記録しました。
- businessStructure: 連結子会社の製品（株式会社エモーションテックの「EmotionTech CX／EX」、株式会社RightTouchの「QANT」、株式会社CODATUMのデベロッパー向けデータ分析プロダクト）の売上高は、製品・サービス区分の中で独立して開示されていません。
- businessStructure: 主要な設備は本社（東京都中央区）のみが印字され、単一セグメントのため特定の事業への対応付けはありません（国内子会社の設備は重要性が乏しいとして有報でも省略されています）。帳簿価額と年間賃料は書いていません。
- businessStructure: 本ツリーの旧スキーマに従い suppliers は省略しました。【事業の内容】に個別の仕入先名は印字されていません。
- businessStructure: 期間後の株式会社CloudFitの子会社化は needsReview に記録し、登録は2025年９月30日現在の連結子会社４社の構成で行っています。
- history: 沿革表は年月と事象が一体で印字されており、崩れた表ではありません。年月は規則により年だけにし、資本金額は書いていません。
- history: 省いた項目: 2013年11月のEC特化型メディア「Shopping Tribe」のサービス開始、2014年７月の「KARTE」のコンセプト発表と同年８月の本社移転（東京都渋谷区）、2015年10月の本社移転（東京都品川区）、2018年３月のCXメディア「XD」の開始、同年４月の「KARTE」のコンセプト変更、同年７月の本社移転（東京都中央区）、2019年11月のGoogle International LLCを引受先とする第三者割当増資、2020年３月の「スタートアップ・エコシステム 東京コンソーシアム」への参画。
- history: Wikipedia「プレイド (企業)」（証券コード4165で同一性を確認）の冒頭は本社所在地とSaaS企業である旨だけで、有報に印字された事実と重なるため、補足には使わず、出典にも加えていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は it としました。単一セグメントのSaaS事業は、CXプラットフォーム「KARTE」をクラウド方式で提供するソフトウエア事業そのものです。
- industry: media は付けませんでした。CXメディア「XD」の運営はその他周辺事業で、金額が独立して開示されていません。human-resources も、連結子会社のEX（従業員体験）マネジメントクラウドが人材サービスそのものではないため付けませんでした。DEIの別記事業は cte です。閉じた分類に直接当たるため、暫定分類や taxonomyGaps はありません。
- relatedCompanies: seki: 「セキュリティ」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: zero: 「使用価値はゼロ」等の一般表現の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: en: 「エン」や Customer Experience の略語等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: port: 「カスタマーサポートプラットフォーム」等の部分文字列の一致のみで、結んでいません。
- relatedCompanies: ray: 社名の英訳名「プレイド」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: nissin: 新株予約権の事務的な記載での一致のみで、現行のEDINETコードリストにもなく、ambiguous でもあり、結んでいません。
- relatedCompanies: corona: 「コロナ禍」という一般語の一致のみです。
- relatedCompanies: base-4481: 「顧客データベース」という一般語の一致のみです。
- relatedCompanies: vision: 「ビジョン」という一般語の一致のみです。
- relatedCompanies: lec: 「フレックスタイム」の部分文字列の一致のみです。
- relatedCompanies: the-lead: 「デジタル活用をリードしており」という動詞表現の一致のみです（期間後に子会社化した株式会社CloudFitの事業説明の中の表現です）。
- relatedCompanies: trust: 印字された相手は日本マスタートラスト信託銀行株式会社で、信託銀行による保有（純投資）の文脈であり、候補の株式会社トラストとは別の法人です。
- relatedCompanies: will: 「コンピューターウィルス」の部分文字列の一致のみです。
- relatedCompanies: 候補にないため記録します: トランスコスモス株式会社とは2019年７月に「KARTE」導入支援の戦略パートナーとして業務提携していますが、候補（related-candidates.json）にないため結んでいません。株式会社unerryは【株式の保有状況】の特定投資株式に、広告及びリテールソリューション分野での協業による競争力強化を目的として当期に取得したことが個別に印字されていますが、候補にないため結んでいません。Google International LLCは2025年９月30日現在で3.46％を保有する大株主ですが、候補になく、外国法人でもあるため結んでいません。期間後に子会社化した株式会社CloudFitは候補にありません（needsReview に記録）。【関係会社の状況】の連結子会社４社（株式会社エモーションテック、株式会社RightTouch、アジト株式会社、株式会社CODATUM）は自社の子会社のため結んでいません。【主要な顧客ごとの情報】では売上高の10％以上を占める相手先はないと印字されています。
- terms: 助言のみ: 用語候補として CX（顧客体験）、顧客体験プラットフォーム、SaaS、サブスクリプションモデル、MAU（月間利用者数）、パーソナライズ、リアルタイム解析、プロフェッショナルサービス、EX（従業員体験）、カスタマーサポート などが挙げられます。

## 要確認（status に反映）

- businessModel: 2025年11月12日の取締役会で株式会社CloudFitの株式取得を決議し、2025年11月30日に同社を子会社化しています（みなし取得日2025年12月31日）。登録は2025年９月30日現在のグループ構成で行っており、期間後の子会社化の反映には人の確認が必要です。
- businessStructure: 2025年11月12日の取締役会で株式会社CloudFitの株式取得を決議し、2025年11月30日に同社を子会社化しています（みなし取得日2025年12月31日）。登録は2025年９月30日現在のグループ構成で行っており、期間後の子会社化の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
