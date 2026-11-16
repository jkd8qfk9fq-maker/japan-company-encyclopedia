# トーセ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社トーセ |
| 証券コード | 4728 |
| docID（データを取り出した文書） | `S100X5JM` |
| 原本 docID | `S100X5JM` |
| 提出日（原本） | 2025-11-20 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X5JM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社トーセ / 4728 / docID S100X5JM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tose: 10 件の数値を有報XBRLと照合
有報: 株式会社トーセ 有価証券報告書－第46期(2024/09/01－2025/08/31) (docID S100X5JM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tose: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは同一年（2025年8月期）に税効果関連の会計基準適用とセグメント変更の2事実があるため、1件のノートに併記した。
- businessModel: 証拠パックの注意（本文に財務諸表の組替えの記載がある）については、前期有報との重複年度の数値が全て一致していることを確認し、組替えを前提とする記述は置かなかった。
- businessModel: 2025年3月24日に発表した長岡京トーセビルの建替え計画は当期中の出来事であり、提出後の予定事項ではないため needsReview には入れなかった。
- businessStructure: 報告セグメントは当期より「ゲーム事業」「その他事業」に変更されており、前期の数値も変更後の区分で印字されているため、その区分で記載した。
- businessStructure: 主要な顧客は【セグメント情報】の主要な顧客ごとの情報に印字された4社をゲーム事業の顧客として記載した（金額は本文に書かない）。
- businessStructure: TOSE PHILIPPINES, INC.は2024年8月に解散を決定し清算手続き中のため、事業の担い手としては記載しなかった。
- businessStructure: 関連会社1社は【関係会社の状況】に個別の名称・内容が印字されていないため、事業の担い手として記載しなかった。
- history: 沿革は年月まで印字されているが、この工程の形式に合わせ年だけを記載した。
- history: 2013年のフィリピン法人は2024年8月に解散し清算手続き中であることを2024年の項目に記載した。
- industry: 主たる業界は、売上高の9割超を占めるゲーム事業（ゲームソフトの企画・開発・運営受託）のため entertainment とした。
- industry: その他事業は非ゲーム領域のデジタルコンテンツ開発やソリューションサービスの提供を行う報告セグメントで金額が独立開示されているため、2つ目の業界として it を付けた。
- relatedCompanies: tomy（株式会社タカラトミー）: 【セグメント情報】の主要な顧客ごとの情報に当期・前期とも印字された顧客のため結んだ。
- relatedCompanies: 株式会社アトラス: 主要な顧客として印字されているが、related-candidates.json に候補がなく、掲載済み企業としての同一性を確認できないため結ばなかった。
- relatedCompanies: 株式会社スクウェア・エニックス: 主要な顧客として印字されているが、候補にあるのは持株会社のスクウェア・エニックス・ホールディングスであり、印字された事業会社とは別の法人格のため結ばなかった。
- relatedCompanies: 株式会社バンダイナムコスタジオ: 主要な顧客として印字されているが、候補にあるのは持株会社のバンダイナムコホールディングスであり、印字された事業会社とは別の法人格のため結ばなかった。
- relatedCompanies: 株式会社アクアプラス: 前期の主要な顧客として印字されているが、候補がなく同一性を確認できないため結ばなかった。
- relatedCompanies: capcom（株式会社カプコン）: 特定投資株式の表に載るだけで、保有目的は業界動向の把握という情報収集であり、取引・提携の記述がないため結ばなかった。
- relatedCompanies: kyoto-financial-group（株式会社京都フィナンシャルグループ）: 特定投資株式の表に載るだけで、保有目的は財務基盤の維持であり、資金調達等の取引を理由とする記述もないため結ばなかった。
- relatedCompanies: monoAItechnology株式会社: 特定投資株式の表に印字されているが、related-candidates.json の候補にないため結ばなかった。
- relatedCompanies: en、tein、career、base-4481、nix、lec、path、seki、innovation、port、ray、amuse、rhythm、slogan: いずれも一般語や他社の社名の一部の一致による機械抽出で、当社との取引・提携・資本関係の記述がないため結ばなかった。
- terms: 助言: 「レベニューシェア」は、開発したゲームタイトルの販売実績に応じて、開発会社が成功報酬として受け取る分配金です。原価を伴わない収益として同社の業績に影響しています。
- terms: 助言: 「受託開発」は、顧客であるゲームメーカーなどからの依頼を受けて、ゲームソフトの企画・開発・運営を請け負う事業形態です。同社は自社で販売するのではなく、顧客ブランドのタイトル開発を担います。
- terms: 助言: 「ディベロッパー」は、ゲームソフトの開発を専門に行う会社のことです。同社は特定のゲームメーカーの資本系列に属さない独立系ディベロッパーです。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
