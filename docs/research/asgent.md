# アズジェント — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アズジェント |
| 証券コード | 4288 |
| docID（データを取り出した文書） | `S100YGM0` |
| 原本 docID | `S100YGM0` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGM0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アズジェント / 4288 / docID S100YGM0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asgent: 10 件の数値を有報XBRLと照合
有報: 株式会社アズジェント 有価証券報告書－第29期(2025/04/01－2026/03/31) (docID S100YGM0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
asgent: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記１～４（潜在株式調整後１株当たり当期純利益の非記載理由、従業員数の数え方、関連会社がないことによる持分法の投資利益の非記載、株価の市場履歴）は表示事項のため financialNotes には入れませんでした。株式分割・株式併合、決算期変更、変則決算、会計方針の変更の記載はいずれもありません。
- businessModel: MD&Aに印字された段階利益の金額や増減の理由、キャッシュ・フローの金額は本文には書いていません。受注高・受注残高の金額も書いていません。
- businessModel: 前期有報との修正再表示照合は６系列×４行すべて差異ゼロであり、訂正有価証券報告書もないため、訂正に関する注記は書いていません。
- businessModel: 「Hirundo」の提供開始（2026年４月）は有報の【沿革】とMD&Aに印字された期間後の事実であり、事業構造の変更ではないため needsReview には入れず、沿革に記録しました。【重要な後発事象】は「該当事項はありません」です。
- businessModel: 経営方針に数値目標の印字はなく、本文と perspectives に目標数値は書いていません。
- businessStructure: 当社はネットワークセキュリティ事業の単一セグメントであり、【関連情報】の製品・サービスごとの情報は単一区分が売上高の90％を超えるため省略されています。そのため事業の内訳金額は開示されておらず、子事業は設けていません。
- businessStructure: 【関係会社の状況】は「該当事項はありません」で、子会社・関連会社はありません。最大株主の株式会社アズウェルマネジメント（議決権の46.28％、2025年９月１日に株式会社アズジェントホールディングスから商号変更）は代表取締役社長が全議決権を所有する資産管理会社であり、関連企業候補に含まれないため結んでいません。
- businessStructure: 【主要な設備の状況】は本社（東京都中央区）のみで単一セグメントのため、設備は事業全体に結びつけました。帳簿価額は書いていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマにないため省略しました。仕入先は海外の製品ベンダー（Check Point Software Technologies Ltd.、Votiro CyberSec Ltd.、IRONSCALES Ltd.、Radware Ltd.など）であり、【主な資産及び負債の内容】の買掛金相手先に印字されています。
- businessStructure: 売上高の10％以上を占める主要な顧客はないため、顧客名は事業の説明に書いていません。
- history: 沿革のうち、セミナーの開催開始（2001～2010年）、製品・サービスの個別の提供開始（1998年AsgentIt！、2000年M@gicPolicy、2002年M@gicPolicyR2・スタートアップパッケージ、2016年Karamba Security、2018年Arxan・IRONSCALES、2020年情報セキュリティサービス基準への適合登録、2022年Quantum Lightspeed・Cloud Native Protector Service、2023年WAAPソリューション、2024年SecureLayer Browser Extension・MSS for Sysdig・C1NS監視、2025年SecureLayerのモジュール提供）、Interop Tokyoでの各年の受賞、チェック・ポイント社からの受賞、無害化ソリューションの国内シェアNo.1の各年の継続、2009年の日本ヒューレット・パッカード社との協業、2010年の大阪証券取引所JASDAQへの移行は省略し、ここに列挙しました。
- history: 資本金等の金額は沿革に書いていません（設立時の資本金額は有報に印字がありません）。
- history: Wikipedia は企業一覧ページへの掲載のみで自社の記事ではないため、使っていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は it としました。ネットワークセキュリティ事業の単一セグメントであり、セキュリティソフトウェア製品の販売とマネージドセキュリティサービスの提供が売上のすべてを占めます。
- industry: electronics は付けませんでした。取り扱う製品の中心はソフトウエアであり、機器の製造は行っていません。DEIの別記事業は cte です。
- relatedCompanies: nec: 【主な資産及び負債の内容】の売掛金相手先に日本電気株式会社が印字されるのみで、個別の取引・提携の記載がないため結びませんでした。
- relatedCompanies: obic-business-consultants: 【大株主の状況】に1.66％の株主として印字されるのみで、取引・提携の記載がないため結びませんでした。
- relatedCompanies: marubeni: 印字されているのは丸紅情報システムズ株式会社であり、丸紅株式会社とは別の法人のため結びませんでした。
- relatedCompanies: mitsubishi-electric・innovation: 印字されているのは三菱電機デジタルイノベーション株式会社であり、三菱電機株式会社とは別の法人のため結びませんでした。
- relatedCompanies: mitsui-fudosan: 印字されているのは三井不動産ビルマネジメント株式会社であり、三井不動産株式会社とは別の法人のため結びませんでした。
- relatedCompanies: future: 印字されているのはレコーデッド・フューチャー・ジャパン株式会社であり、フューチャー株式会社とは別の法人のため結びませんでした。
- relatedCompanies: secure: 印字はIIJのサービス名「IIJセキュアエンドポイントサービス」と一般語の「セキュア」であり、株式会社セキュアについての記載がないため結びませんでした。
- relatedCompanies: en・port・base-4481・no-1・como・king・land・slogan・suzuki-6785・system-integrator・technologies・the-lead・zero: 社名の一部や一般語（エンドユーザー、サポート、時価ベース、国内シェアNo.1、システムインテグレータ、経営スローガン等）の部分文字列一致のみで、相手企業についての記載がないため結びませんでした。
- relatedCompanies: 候補にない相手: 株式会社アズウェルマネジメント（最大株主46.28％、代表取締役社長の資産管理会社）、株式会社日立システムズ、NTTドコモビジネスデータ株式会社、NECネッツエスアイ株式会社（いずれも売掛金相手先）、Check Point Software Technologies Ltd.やMenlo社（旧Votiro社）などの海外製品ベンダーは関連企業候補に含まれないため結んでいません。海外ベンダーは businessStructure の warnings に記録しました。
- relatedCompanies: 【株式の保有状況】の政策保有株式は非上場株式２銘柄のみで、候補となる上場株式の保有はありません。【関係会社の状況】は「該当事項はありません」です。
- terms: 助言のみ: 用語候補として セキュリティ・プラス、マネージドセキュリティサービス（MSS）、SOC、CTER、マシンアンラーニング、ファイル無害化、ASM（Attack Surface Management）、CSPM、WAAP などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
