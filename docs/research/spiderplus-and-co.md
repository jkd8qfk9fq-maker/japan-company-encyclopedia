# スパイダープラス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | スパイダープラス株式会社 |
| 証券コード | 4192 |
| docID（データを取り出した文書） | `S100XT30` |
| 原本 docID | `S100XT30` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT30.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | スパイダープラス株式会社 / 4192 / docID S100XT30（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
spiderplus-and-co: 4 件の数値を有報XBRLと照合
有報: スパイダープラス株式会社 有価証券報告書－第27期(2025/01/01－2025/12/31) (docID S100XT30)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
すべて一致しました。
spiderplus-and-co: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記2から4（潜在株式調整後1株当たり当期純利益、自己資本利益率、株価収益率を当期純損失のため記載していない旨）と注記5（従業員数は就業人員であり臨時雇用者数は外数で記載する旨）は表示事項のため、financialNotesには入れず本欄に記録した。
- businessModel: 重要な後発事象として印字された資本金及び資本準備金の額の減少並びに剰余金の処分（2026年2月12日の取締役会で、2026年3月25日開催予定の第27期定時株主総会への付議を決議）は資本政策の手続きのため、needsReviewには入れず本欄に記録した。
- businessModel: 前連結会計年度に計上されたソフトウエア仮勘定の減損の金額は、本文の財務数値の対象外のため記載していない。
- businessModel: MD&Aに印字された段階利益の金額とその理由は、本文の財務数値の対象外のため記載していない。
- businessModel: 単一セグメントであり、製品及びサービスごとの情報は単一の製品・サービス区分の売上高が売上高の90％を超えるため有報で省略されている。製品・サービス別の金額は記載していない。
- businessModel: Apple Inc.は【重要な契約等】にアプリの配信及び販売に関する契約の相手方として印字されているが、関連企業候補に含まれていないため関連企業には結ばなかった。
- businessModel: 連結子会社SpiderPlus Vietnam, Co., Ltd.は当社の子会社であり、関連企業リンクの対象ではない。
- businessModel: 旧スキーマのツリーのため suppliers キーは省略した。【事業の内容】に個別の仕入先名の印字はない。
- businessStructure: 【主要な設備の状況】の本社（東京都港区）と関西支社（大阪府大阪市北区）は単一セグメントのため事業別に分かれておらず、ICT事業全体に結びつけた。帳簿価額は記載していない。
- businessStructure: 在外子会社については【主要な設備の状況】に該当事項はない。SpiderPlus Vietnam, Co., Ltd.は「SPIDER+」の現地販売を行い、役員の兼任がある。
- businessStructure: 旧スキーマのツリーのため suppliers キーは省略した。
- history: 資本金の金額は規則により沿革に記載していない（2000年の有限会社設立時、2001年の株式会社への組織変更時、2010年の株式会社ヴェイシス設立時の資本金額）。
- history: 2025年の中期Vision策定（1月）、プロダクトロードマップ「Workspace構想」の発表（7月）、サービス名表記の変更（11月）は、年のみの表記のため1項目にまとめた。
- industry: 主たる業界は、単一セグメントのICT事業が施工管理ソフトウエア「SPIDER+」の提供を中核とするためitとした。
- industry: constructionは、提供先が建設業界であり、創業事業が熱絶縁工事で、現在も現場業務への深い知識を事業の基盤としているため2つ目に付けた。
- relatedCompanies: core: 「ノンコア業務」という一般語の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: en: 「エンジニアリング事業」等の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: port: 「サポート」の部分一致のため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: vision: 「ビジョン」「中期Vision」という一般語の一致のため結ばなかった。
- relatedCompanies: suzuki-6785: 【大株主の状況】に載る個人株主の氏名の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: land: 「ブランド」の部分一致のため結ばなかった。
- relatedCompanies: nissin: 新株予約権に関する文言中の部分一致で、現在のコードリストにもないため結ばなかった。
- relatedCompanies: atrae: 同社が提供する組織力向上プラットフォーム「Wevox」のエンゲージメントサーベイのスコアが、人的資本に関する指標の出典として引用されているのみで、当社との取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: career: 「キャリア機会の提供」という一般表現の一致のため結ばなかった。
- relatedCompanies: lec: 「アーマフレックス」の部分一致のため結ばなかった。
- relatedCompanies: taya: 【大株主の状況】の個人株主に関する文言中の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: Apple Inc.は【重要な契約等】にiOS搭載端末向けアプリケーションの配信及び販売に関する契約の相手方として印字されているが、関連企業候補に含まれていないため結ばなかった。
- relatedCompanies: 連結子会社SpiderPlus Vietnam, Co., Ltd.は当社の子会社であり、関連企業リンクの対象ではない。【関連情報】に主要な顧客ごとの情報の記載はなく、外部顧客への売上高の10％以上を占める相手先はない。
- terms: 助言: 「SPIDER+ Workspace」は、主力の施工管理ソフトウエア「SPIDER+」を現場の統合管理ソフトウエアとして進化させる構想の名称です。「ARR」はAnnual Recurring Revenueの略称で、各年12月末時点のストック収入を12倍して算出します。「ARPA」はAverage Revenue Per Accountの略称で、各年12月末時点のストック収入を契約社数で除して算出します。「BPOサービス」は、デジタル化が困難な現場のアナログ業務など、現場のノンコア業務を代行するサービスです。いずれも有報の表記に沿って記述しました。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
