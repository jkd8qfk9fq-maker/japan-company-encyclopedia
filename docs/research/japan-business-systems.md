# 日本ビジネスシステムズ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本ビジネスシステムズ株式会社 |
| 証券コード | 5036 |
| docID（データを取り出した文書） | `S100XB8X` |
| 原本 docID | `S100XB8X` |
| 提出日（原本） | 2025-12-18 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XB8X.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%83%93%E3%82%B8%E3%83%8D%E3%82%B9%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%82%BA

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本ビジネスシステムズ株式会社 / 5036 / docID S100XB8X（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
japan-business-systems: 6 件の数値を有報XBRLと照合
有報: 日本ビジネスシステムズ株式会社 有価証券報告書－第35期(2024/10/01－2025/09/30) (docID S100XB8X)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
japan-business-systems: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 出典「wikipedia」はどこからも引用されていません

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは全行一致し、売上高・当期純利益の範囲に変化がないため financialNotes は書きませんでした。
- businessModel: 中期的な売上構成の目標比率は数値のため strategy には書きませんでした。
- businessModel: 自己株式の取得（2025年11月21日取締役会決議）は資本政策の後発事象のため needsReview には入れず、warnings にのみ記録しました。
- businessModel: 本文の財務数値は売上高と当期純利益だけにしました。
- businessStructure: セグメントの並びは外部顧客への売上高の大きい順にしました。その他は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: ライセンス＆プロダクツ事業の売上高122,941百万円、クラウドインテグレーション事業27,736百万円、クラウドサービス事業21,890百万円、その他11百万円は、セグメント情報の外部顧客への売上高の印字です。
- businessStructure: 略称JBSはWikipediaの補足です。
- history: 沿革は15件を選択しました。2000年の本社移転、2011年のHPパートナーAward受賞、2017年の香港現地法人設立などは省略しました。
- industry: 東証の業種分類は情報・通信業ですが、主たる事業はクラウドインテグレーションのため it を主たる業界としました。
- relatedCompanies: 三菱総研DCS株式会社は三菱総合研究所の子会社で、議決権の0.6％を保有していますが、掲載企業でないため結ばず、三菱総合研究所の説明に含めました。
- relatedCompanies: 株式会社日テレWandsは持分法適用関連会社で20.2％を出資していますが、非上場のため結ばない。
- relatedCompanies: 株式会社ネクストスケープとSureBizCloud株式会社は連結子会社ですが、非上場のため結ばない。
- relatedCompanies: 株式会社プロディライトは特定投資株式の銘柄ですが、保有目的が「当社との事業上のシナジーを期待して保有」との定型的な記載のみで、具体的な取引の印字がないため結ばない。
- relatedCompanies: 株式会社ロマネは大株主で40.71％を保有していますが、非上場のため結ばない。
- relatedCompanies: アイテック阪急阪神株式会社はネクストスケープの株式20％の譲渡先ですが、掲載企業の阪急阪神ホールディングスとは別会社で、上場の印字がないため結ばない。
- relatedCompanies: Crayon Group Holding ASAは業務提携先ですが、海外企業で掲載企業でないため結ばない。
- relatedCompanies: エン、セキ、ポート、ベース、イノベーション、レイ、リード、トラスト、アトラエ、コア、レント、ハイパー、ランド、No.1、キャリア、日新、システムインテグレータ、ティア、テイン、東宝：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 日本マイクロソフト株式会社は主要な取引先ですが、掲載企業でないため結ばない。
- terms: 新たに提案する用語はありません。クラウドインテグレーション、クラウドサービス、ライセンス＆プロダクツなどの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
