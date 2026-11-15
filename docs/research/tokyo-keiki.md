# 東京計器 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東京計器株式会社 |
| 証券コード | 7721 |
| docID（データを取り出した文書） | `S100YMS0` |
| 原本 docID | `S100YMS0` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YMS0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東京計器株式会社 / 7721 / docID S100YMS0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-keiki: 10 件の数値を有報XBRLと照合
有報: 東京計器株式会社 有価証券報告書－第95期(2025/04/01－2026/03/31) (docID S100YMS0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tokyo-keiki: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: businessModel.suppliersは省いた。有報は当社グループの調達先を一般名詞では述べておらず、特定投資株式の保有先は関連企業工程で扱うためである。
- businessModel: 2030年度の経営指標の目標（連結売上高・利益率等）は、利益率に関する指標を含むためperspectivesに転記していない。
- businessModel: 2026年3月期は決算期の変更や修正再表示がなく、5年間の経営指標は前期有報の印字と全て一致しているため、financialNotesは空とした。
- businessModel: 防衛・通信機器事業では、メトロウェザー株式会社への出資及び業務提携と、株式会社ロジック・アンド・デザインへの出資がMD&Aに印字されている。いずれも非上場で候補一覧になく、関連企業としては結んでいない。
- businessModel: 本社の羽田空港への移転は2026年3月に完了し、表紙の本店所在地にも反映されているため、needsReviewではなくwarningsと沿革に記録した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順とし、報告セグメントに含まれない「その他の事業」は最後に置いた。
- businessStructure: セグメント別の金額は、セグメント注記が百万円単位で印字する外部顧客への売上高を使用した。連結売上高61,186百万円との差額1百万円は、セグメント注記で各報告セグメントに配分していない全社売上高であり、合計の内訳として印字どおりに記録する。
- businessStructure: 子会社ごとの売上高は独立して開示されていないため、childrenには金額を書いていない。
- history: 沿革は有報の印字から主要な節目を選んだ。工場開設・事業所移転等の細目は省いた。
- history: 資本金の金額は沿革に書いていない（財務数値の転記制限のため）。
- industry: 主たる業界は、計測・制御機器の製造・販売を中核とする精密機器メーカーであるためmachineryとした。
- industry: electronicsは、防衛・通信機器事業で防衛関連の電子機器や通信機器・センサー機器を報告セグメントとして開示しているため2つ目に付けた。
- relatedCompanies: mitsubishi-ufj-financial-group（株式会社三菱UFJフィナンシャル・グループ）: 特定投資株式に載るが、保有目的は傘下銀行が取引金融機関であることのみで、資金調達が理由のため結ばなかった。
- relatedCompanies: resona-holdings（株式会社りそなホールディングス）: 特定投資株式に載るが、保有目的は傘下のみなと銀行が取引金融機関であることのみで、資金調達が理由のため結ばなかった。
- relatedCompanies: nissei-plastic-industrial（日精樹脂工業株式会社）: 油空圧機器事業の重要な顧客として特定投資株式に載っていたが、2026年3月30日に上場廃止となり当事業年度は特定投資株式に該当せず、コードリストにもないため結ばなかった。
- relatedCompanies: 防衛省: 主要な顧客であるが企業ではないため、関連企業としては結ばず、businessModelとperspectivesに記録した。
- relatedCompanies: メトロウェザー株式会社・株式会社ロジック・アンド・デザイン: MD&Aに出資（メトロウェザーは業務提携も）の印字があるが、非上場で候補一覧にないため結ばなかった。
- relatedCompanies: 株式会社KODENホールディングス: 大株主（2.19％）であるが候補一覧になく、有報に取引・提携の印字もないため結ばなかった。
- relatedCompanies: 株式会社三井住友銀行・株式会社横浜銀行・日本生命保険相互会社等の大株主は金融機関であり、取引・提携の印字がないため結ばなかった。信託銀行の信託口と従業員持株会、個人株主は結ぶ対象ではない。
- relatedCompanies: step、vision、career、en、port、heiwa、base-4481、path、trust、seki、corona、innovation、shinto、suzuki-6785、core、freee、lec、mec、nix、rent、ricoh、space、the-lead、wills、zeroはいずれも社名の一致のみで、関係性の根拠がないため結ばなかった。
- terms: 助言: 用語「ジャイロスコープ／慣性航法」は、自律的に姿勢や位置を測る技術で、当社グループが防衛装備庁との研究請負契約に基づき研究開発を進める中核技術の一つである。
- terms: 助言: 用語「超音波流量計」は、超音波を使って流体の流量を測る計測機器で、当社グループの流体機器事業の製品である。官需市場向けの販売が堅調である。
- terms: 助言: 用語「ニッチトップ」は、特定の狭い市場で首位を取る事業のあり方を指し、当社グループは国内市場で複数のニッチトップ事業を生み出してきたと説明している。
- terms: 助言: 用語「ドップラー・ライダー」は、レーザー光の反射の変化から風の動きを測る装置で、当社グループが防衛市場向けに開発・量産化を目指している。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
