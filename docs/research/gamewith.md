# GameWith — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＧａｍｅＷｉｔｈ |
| 証券コード | 6552 |
| docID（データを取り出した文書） | `S100YYH7` |
| 原本 docID | `S100YYH7` |
| 提出日（原本） | 2026-08-25 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYH7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＧａｍｅＷｉｔｈ / 6552 / docID S100YYH7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gamewith: 10 件の数値を有報XBRLと照合
有報: 株式会社ＧａｍｅＷｉｔｈ 有価証券報告書－第13期(2025/06/01－2026/05/31) (docID S100YYH7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
gamewith: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社GameWith」が EDINET の提出者名「株式会社ＧａｍｅＷｉｔｈ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記1・2（潜在株式調整後1株当たり当期純利益、自己資本利益率、株価収益率の未記載に関するもの）は表示事項のため、financialNotes には入れず、ここに記録しました。
- businessModel: financialNotes には、当期の報告セグメント変更の事実を2026年5月期の注記として入れました。前期のセグメント情報も変更後の区分により作成されています。
- businessModel: 【事業の内容】に、新作NFTゲーム「EGGRYPTO X」を2026年秋にリリース予定である旨が印字されています。既存のその他事業の範囲内の新作投入であり、登録する事業構造を変えるものではないため、本文では予定として触れず、needsReview にも入れていません。
- businessModel: MD&Aに印字された利益指標の金額や増減理由、経営上の目標の指標は、本文や perspectives には書いていません。売上高の前期比だけを使っています。
- businessModel: Wikipediaの記事「GameWith」が見つかりましたが、冒頭文は有報に印字された事業内容の言い換えにとどまり、有報にない補足がないため使っていません。
- businessStructure: 当連結会計年度より、報告セグメントを従来の「メディア」「eスポーツ・エンタメ」の2区分から、「メディア」「eスポーツ・エンタメ」「ISP」の3区分に変更しています。前連結会計年度のセグメント情報も変更後の区分により作成されています。事業の並びは、セグメント注記の外部顧客への売上高の大きい順です。
- businessStructure: 各事業・子区分の金額は、セグメント注記の千円印字を百万円未満切り捨てで記載しました。切り捨て後の事業の合計は4,045百万円で、印字された売上高の合計4,047百万円と異なりますが、印字の合計をそのまま使っています。子区分の内訳についても、合計が区分の印字額と一致しない箇所があります。
- businessStructure: このツリーの旧スキーマのため、suppliers キーは省略しました。ISP事業の光回線サービスは合弁会社のGameWith ARTERIA株式会社を通じて提供され、アルテリア・ネットワークス株式会社との連携が【事業の内容】に印字されていますが、個別の仕入先としての印字はないため、事業の説明の範囲で記載しました。
- businessStructure: 主要な設備は本社オフィスの1行のみで、セグメントの名称欄にメディア事業・eスポーツ・エンタメ事業・ISP事業・その他が連記されているため、特定の事業には結びつけていません。帳簿価額は書いていません。
- businessStructure: 連結子会社の株式会社DetonatioNは、2026年5月末時点で債務超過の状態にあることが【関係会社の状況】の注記に印字されています。連結の範囲や事業の構造に変更はないため、当期の構造のまま登録し、needsReview には入れていません。
- history: 沿革のうち、本社の移転（2014年3月、2015年6月、2022年1月）、コミュニティ機能の提供開始（2017年3月）、iOS・Android向けアプリのリリース（2017年11月）、Riot Games, Inc.との長期的パートナーシップの締結（2022年9月）、京都支店の開設（2025年3月）は、事業構造の転機ではないため落としました。
- history: 沿革には資本金の金額の印字はなく、history に金額は書いていません。年月は年だけを year に入れ、月は書いていません。
- industry: 主たる業界は「media」を直接付けました。メディア事業が外部顧客への売上高の過半（2,312百万円／合計4,047百万円）を占め、ゲーム情報メディアの運営が中心事業のため、閉じた分類に直接当てはまります。
- industry: 「entertainment」は2つ目に付けました。eスポーツ・エンタメ事業が報告セグメントとして独立開示され、外部顧客への売上高1,162百万円を占めるためです。
- industry: ISP事業は光回線サービスの提供ですが、外部顧客への売上高は431百万円と小さく、自ら通信インフラを持つ通信事業者ではないため、「telecommunications」は付けていません。その他（NFT事業）は報告セグメントではなく金額も小さいため、独立した業界は付けていません。
- relatedCompanies: アルテリア・ネットワークス株式会社: 【関係会社の状況】にその他の関係会社（議決権の21.1％を保有）として載り、合弁会社GameWith ARTERIA株式会社の共同出資者であり、2022年6月の資本業務提携契約の相手先である実質的な関係会社ですが、related-candidates.json に含まれていないため結んでいません。
- relatedCompanies: 株式会社デジタルガレージ: 2024年9月にアプリ外課金事業の共同推進に向けた戦略的パートナーシップの基本合意が【沿革】に印字されるだけで、有報の本文に現在の取引や資本関係の印字が確認できないため結んでいません。
- relatedCompanies: 松井証券株式会社: 【大株主の状況】に載りますが、証券会社による保有であり、個別の取引・提携の印字がないため結んでいません。
- relatedCompanies: 株式会社日新: 候補の listing が「コードリストにない」で、一致箇所も新株予約権の条文中の部分一致のため結んでいません。
- relatedCompanies: エン株式会社、セキ株式会社、株式会社キャリア、株式会社レイ、株式会社ヒット、ポート株式会社、株式会社テイン、ベース株式会社、株式会社高速、株式会社ランド、フリー株式会社、リックス株式会社: 一般語・部分一致の一致であり、相手についての取引・提携・資本関係の印字がないため結んでいません。
- relatedCompanies: 連結子会社5社と持分法適用関連会社のGameWith ARTERIA株式会社は自社グループのため結んでいません。株式会社Kyuzan（投資先で、NFTゲーム「EGGRYPTO」のプロモーション等の委託元）、株式会社Samurai工房（2023年に包括的業務提携）、Riot Games, Inc.、DIGITAL HEARTS Seoul Co., Ltd. は候補にありません。
- terms: 用語の助言のみです。対象となりうる用語は「ページビュー（PV）」「ネットワーク広告」「アプリ外課金」「eスポーツ」「NFT」などですが、本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
