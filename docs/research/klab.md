# ＫＬａｂ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＫＬａｂ株式会社 |
| 証券コード | 3656 |
| docID（データを取り出した文書） | `S100XU7P` |
| 原本 docID | `S100XU7P` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU7P.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＫＬａｂ株式会社 / 3656 / docID S100XU7P（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
klab: 10 件の数値を有報XBRLと照合
有報: ＫＬａｂ株式会社 有価証券報告書－第26期(2025/01/01－2025/12/31) (docID S100XU7P)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
klab: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「KLab株式会社」が EDINET の提出者名「ＫＬａｂ株式会社」と違います
- 確認: [other-profit-wording] financials[4].note: 売上高と当期純利益以外の利益に触れていないか確認する（…る子会社株式等の売却に伴い生じた売却損益を税務上繰り延べる場合の取扱いの見直…）

## エージェントの判断記録（fragment warnings）

- businessModel: 継続企業の前提については、重要な疑義を生じさせるような状況が存在していたものの、当連結会計年度末において解消したと判断した旨が印字されているため、needsReview には入れず、この記録にとどめた。
- businessModel: 連結損益計算書の表示方法の変更（前連結会計年度に独立掲記していた項目を当期より「その他」に含めて表示）は表示のみの変更であり、主要な経営指標等の数値に影響しないため warnings のみとした。前期有報との修正再表示チェックは全系列で差異なしだった。
- businessModel: 経営者による分析に印字された売上高と当期純損失以外の利益の金額や増減率、減損損失の金額、投資有価証券売却益の金額、キャッシュ・フローの金額、総資産・純資産の金額は、本文の数値制限により書いていない。本文には売上高の増減率（17.5％減）だけを使った。
- businessModel: 中期経営計画の数値目標（2028年の売上高・利益の目標額）は利益・投資指標の目標であるため、本文や perspectives には書いていない。
- businessModel: 連結子会社KLab Global Pte. Ltd.の債務超過の金額は書いていない（事実のみ businessStructure の warnings に記録した）。
- businessModel: 2026年リリース予定の新作タイトルは決算日時点の予定であり、完了した事実としては書いていない。
- businessStructure: 本社の設備の行はセグメント名称が「ゲーム事業 その他」と連記されているため、どの事業にも結びつけなかった。帳簿価額は書いていない。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。業務委託の事実として、連結子会社の可来軟件开发（上海）有限公司（KLab China Inc.）と持分法適用関連会社の株式会社BLOCKSMITH&Co.に業務委託取引があることが【関係会社の状況】に印字されている。
- businessStructure: 連結子会社のKLab Global Pte. Ltd.は2025年12月31日時点で債務超過であることが【関係会社の状況】の注記に印字されている。金額は書いていない。
- businessStructure: 株式会社グローバルギアは2025年７月１日に全株式を譲渡して連結の範囲から除外された期中の事実であり、2025年12月31日現在のグループ構成（連結子会社２社）で登録した。
- history: 沿革のうち次の項目は登録しなかった: 2010年のKLabGames株式会社の吸収合併、2011年のKLab Ventures株式会社の設立、2012年のKLab America, Inc.の設立・CYSCORPIONS INC.の子会社化・メディアインクルーズ株式会社の子会社化、2014年のメディアインクルーズ株式会社の吸収合併、2015年のKLab Entertainment株式会社の設立、2016年のKLab Food&Culture株式会社の設立、2017年のKLab Cyscorpions, Inc.の全株式譲渡、2018年のKLab Food&Culture株式会社の全株式譲渡、2020年の株式会社KVPの株式の一部譲渡、2022年の株式会社アバシーの全株式譲渡と非子会社化。
- history: 設立時・取得時の資本金の金額は書いていない。
- industry: 主たる業界は entertainment とした。唯一の報告セグメントであるゲーム事業が外部顧客への売上高の大部分（6,365百万円／6,856百万円）を占め、モバイルオンラインゲームの企画・開発・運営が事業の実体であるため直接当てはまる。
- industry: その他区分のGPUクラウドやAI関連事業は報告セグメントではなく規模も小さいため、２つ目の業界は付けなかった。
- industry: DEIの別記事業はcteである。
- relatedCompanies: happinet: 特定投資株式として前期は194,500株を保有し、音楽作品の販売や物販等のゲーム周辺領域に関する取引の目的が印字されていたが、当事業年度の保有株式数は０（全て売却）であるため結ばなかった。
- relatedCompanies: bandai-namco-holdings: 特定投資株式として前期は236,400株を保有し、同社グループのIPを活用したゲーム開発・運営の目的が印字されていたが、当事業年度の保有株式数は０（全て売却）であるため結ばなかった。
- relatedCompanies: sbi-holdings: 2007年に株式会社USENが当社株式をSBIホールディングス株式会社等へ譲渡した沿革上の一時点の事実のみで、現在の取引・提携・保有の印字はないため結ばなかった。大株主の状況に載る株式会社ＳＢＩ証券は別の法人であり、証券会社の保有であるため結んでいない。
- relatedCompanies: en / hit / nissin / tein / land / base-4481 / port / quest / seki / crooz / rent / kohsoku / ray / taya / trust / vision: 一般語・部分一致のみで、取引・提携・資本関係の印字がないため結ばなかった。nissin と trust は現在のコードリストにない。
- relatedCompanies: 候補外のため結ばなかった相手: Apple Inc.・Google Inc.・Xsolla (USA), Inc.（主要な顧客ごとの情報に印字された主要顧客だが候補にない）、株式会社シックスセンツホールディングス（役員が議決権の100％を保有する資産管理会社で大株主2.62％だが候補にない）。自社の連結子会社２社と持分法適用関連会社（株式会社BLOCKSMITH&Co.）は結ばない。
- terms: 助言のみ。用語としては「モバイルオンラインゲーム」「IP（知的財産）」「課金収益」「GPUクラウド」「AIタレント」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
