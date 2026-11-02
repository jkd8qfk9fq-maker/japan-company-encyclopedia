# 伊藤忠エネクス — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 伊藤忠エネクス株式会社 |
| 証券コード | 8133 |
| docID（データを取り出した文書） | `S100YC4K` |
| 原本 docID | `S100YC4K` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC4K.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 伊藤忠エネクス株式会社 / 8133 / docID S100YC4K（id は英語表記「ITOCHU ENEX CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
itochu-enex: 10 件の数値を有報XBRLと照合
有報: 伊藤忠エネクス株式会社 有価証券報告書－第66期(2025/04/01－2026/03/31) (docID S100YC4K)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
itochu-enex: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 決算期は2026年3月31日で、年度ラベルは「2026年3月期」です。
- businessModel: 営業活動に係る利益・税引前利益・セグメント利益は規則により本文に書いていません。
- businessModel: 中期経営計画ENEX2030の財務目標（ROEなど）は投資の指標なので書いていません。
- businessModel: ガソリンスタンドの運営形態など、有報に書かれていない事柄は書いていません。
- businessStructure: 事業の並びは【セグメント情報】の外部顧客からの収益の大きい順（カーライフ584,747、産業ビジネス117,331、ホームライフ77,774、電力・ユーティリティ71,383、単位百万円）です。【事業の内容】の記載順（ホームライフが最後、電力・ユーティリティが3番目）とは異なります。
- businessStructure: セグメント利益・セグメントの当期純利益は規則により本文に書いていません。
- businessStructure: 当期に報告セグメントの区分方法が見直され、従来どのセグメントにも配分していなかった持分法適用会社がカーライフ事業へ移りました。前期のセグメント情報は組替後で開示されているため、本文の前期比は組替後どうしの比較です。
- businessStructure: 設備・拠点とセグメントの対応は facilities.txt を使っていません（本文に結びつけていません）。
- history: 沿革の年月と事項は history.txt の表が正常に対応しており、崩れはありません。
- history: 設立時の資本金など金額は規則により書いていません。
- history: 登記上の設立は1948年（中峯化学工業）ですが、有報の注記に従い、実質的な存続会社である伊藤忠燃料の設立（1961年）を起点にしました。
- history: 2008年に本店を移した港区芝浦などの本店移転、チコマート事業の分社・売却、シナネンの株式の取得・売却など、事業の成り立ちに直接つながらない行は省きました。
- industry: energy を主な業界にしました。4つの報告セグメントはいずれも石油製品、LPガス、電力、熱などのエネルギーの販売が中心です。
- industry: カーライフ事業は自動車販売も含みますが、自動車の売上は金額が独立して開示されていないため、automotive は付けませんでした。
- industry: ホームライフ・電力・産業ビジネスの各事業にも他の業界に当たる独立した報告セグメントはありません。
- relatedCompanies: related-candidates.json が証拠パックに無かったため、同一性は有報が印字する正式名称「伊藤忠商事株式会社」と、掲載済みの companyId「itochu」で確認しました。
- relatedCompanies: 子会社（エネクスフリート、九州エナジー、伊藤忠工業ガスなど）と持分法適用会社（エネアーク、ジャパンガスエナジー）は、related-candidates.json が無く掲載済みの上場企業であることを確認できないため結びませんでした。いずれも非上場の会社と見られます。
- relatedCompanies: シナネンホールディングスは沿革に株式の取得・売却があるだけで、現在の関係を述べた記載が無いため結びませんでした。
- relatedCompanies: 大阪ガスはエネアーク設立時の合弁相手として沿革に出るだけで、現在の取引・資本関係の記載が無く、過去の1回限りの提携にあたるため結びませんでした。
- relatedCompanies: 王子グリーンリソースは沿革に出る合弁相手ですが、現在の関係の記載が無く、結びませんでした。
- terms: terms は助言だけの工程です。要る語の候補: ifrs（会計基準がIFRSで、売上収益などのラベルが並ぶため）、segment、annual-securities-report。
- terms: 提案したい新しい語: LPガス（液化石油ガス。家庭用のガスとして使われる）、熱供給（熱源プラントから複数の建物へ冷水・温水を配管で送る事業）、AdBlue®（ディーゼル車の排気ガスを無害化する高品位尿素水）、オートガス、GTL燃料、リニューアブル燃料。いずれも事業の説明に出てきますが、本文ではリンクにしていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
