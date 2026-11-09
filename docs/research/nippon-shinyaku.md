# 日本新薬 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本新薬株式会社 |
| 証券コード | 4516 |
| docID（データを取り出した文書） | `S100YGRG` |
| 原本 docID | `S100YGRG` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGRG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本新薬株式会社 / 4516 / docID S100YGRG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-shinyaku: 10 件の数値を有報XBRLと照合
有報: 日本新薬株式会社 有価証券報告書－第163期(2025/04/01－2026/03/31) (docID S100YGRG)
前期有報との比較: 29 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nippon-shinyaku: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益と当期純利益はIFRSの印字を採りました。日本基準の売上高137,547百万円と親会社株主に帰属する当期純利益23,044百万円は2022年3月期の旧表示のため採っていません。
- businessModel: 繰延税金資産の注記の表示方法の変更により、前連結会計年度の注記の組替えを行っています（研究開発費等9,959百万円を研究開発費等9,617百万円と繰越税額控除342百万円に組み替え）。修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotes は書きませんでした。
- businessModel: 中期経営計画の数値目標（売上収益・営業利益・EPS・ROE・ROIC）は、本文の規則により strategy には書きませんでした。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上収益の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: その他の事業は報告セグメントではないため最後に置き、金額がない旨を明記しました。
- history: 沿革は15件としました。採用しなかった出来事は、1934年の西大路工場設置、1935年の山科研究圃場設置、1954年の総合工場設置、1957年の本社移転、1962年の新研究所設置と日本新薬アドバンスの前身の設立、1966年の盛岡工場設置、1970年のタジマ食品工業への資本参加、1982年の中央研究所本館設置、1990年の千歳クリエートパーク設置、1991年の東京支社設置とデュッセルドルフ事務所開設、1994年の西部創薬研究所2号館設置、1997年のニューヨーク事務所開設、2002年のNS Pharma, Inc.の移転、2006年のラプラスファルマ設立、2011年の北京事務所開設、2016年の治験原薬製造棟設置、2017年の高生理活性固形製剤棟設置、2023年の北京事務所の事業移管とNS Pharma, Inc.のケンブリッジオフィス開設です。
- industry: 主たる業界は、売上収益の最も大きい医薬品事業から医薬品としました。
- industry: 機能食品事業があるため、食品を2つ目に付けました。
- industry: 東証の業種分類は医薬品です。
- relatedCompanies: ジョンソン・エンド・ジョンソン社：主要な顧客（2026年3月期の売上収益57,022百万円）だが、日本の上場会社ではなく related-candidates.json にないため結ばない。
- relatedCompanies: アルフレッサ株式会社：主要な顧客（2026年3月期の売上収益16,176百万円）だが、アルフレッサホールディングスの子会社で related-candidates.json にないため結ばない。
- relatedCompanies: 株式会社メディセオ：主要な顧客（2026年3月期の売上収益12,958百万円）だが、メディパルホールディングスの子会社で上場していないため、親会社のメディパルホールディングスを結んだ。
- relatedCompanies: 株式会社京都銀行・株式会社三菱ＵＦＪ銀行：大株主だが、金融機関で金融取引が理由のため結ばない。
- relatedCompanies: 明治安田生命保険相互会社・日本生命保険相互会社：大株主だが、保険会社で純投資のため結ばない。
- relatedCompanies: 株式会社三菱ＵＦＪフィナンシャル・グループ・株式会社京都フィナンシャルグループ：金融取引関係の維持・強化が保有目的のため結ばない。
- relatedCompanies: 東京海上ホールディングス株式会社：損害保険取引関係の維持・強化が保有目的のため結ばない。
- relatedCompanies: 小野薬品工業株式会社・科研製薬株式会社・株式会社松風・北興化学工業株式会社：協力関係の構築を目的とする保有のみで、具体的な取引・提携の印字がないため結ばない。
- relatedCompanies: 久光製薬株式会社：当事業年度（2025年度）に株式を売却済みで、コードリストにもないため結ばない。
- relatedCompanies: NISSHA株式会社：仕入取引関係の維持・強化が保有目的だが、related-candidates.json にないため結ばない。
- relatedCompanies: Capricor Therapeutics Inc.：医薬品事業における関係の維持・強化が保有目的だが、非上場の海外法人のため結ばない。
- relatedCompanies: 連結子会社6社（NS Pharma, Inc.、北京艾努愛世医薬科技有限公司、天津艾努愛世医薬有限公司、シオエ製薬株式会社、タジマ食品工業株式会社、日本新薬アドバンス株式会社）：すべて非上場または海外法人のため結ばない。
- relatedCompanies: エン、キャリア、ポート、ステップ、セキ、レック、イノベーション、レイ、キング、テイン、リニカル、リコー、リオン、ビジョン、ベース、コア、ランド、リズム、リックス、トラスト、ウィル：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- terms: 新たに提案する用語はありません。ウプトラビ、フィンテプラ、アーリーダなどの製品名は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
