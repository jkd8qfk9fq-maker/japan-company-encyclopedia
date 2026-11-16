# 松尾電機 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 松尾電機株式会社 |
| 証券コード | 6969 |
| docID（データを取り出した文書） | `S100YD97` |
| 原本 docID | `S100YD97` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD97.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 松尾電機株式会社 / 6969 / docID S100YD97（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
matsuo-electric: 10 件の数値を有報XBRLと照合
有報: 松尾電機株式会社 有価証券報告書－第77期(2025/04/01－2026/03/31) (docID S100YD97)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
matsuo-electric: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は付けていません。経営指標等の注記は、潜在株式がないことによる希薄化後指標の非記載、関連会社がないことによる持分法の投資利益の非記載、株価の市場区分の変遷、2022年1月の第三者割当増資による株式発行という表示・資本上の事項のみで、会計基準の変更・変則決算などの事実はありません。2022年の第三者割当増資は沿革に記録しました。
- businessModel: 前期有報との修正再表示チェックは全系列で差異ゼロであり、組替えはありません。
- businessModel: 当期純利益が前期から減った理由として有報が挙げる事業構造改革費用などの計上は、本文に書けない費目に触れるため、金額も理由も書いていません。一部製品の生産終了とそれに伴う費用の計上は当事業年度中の出来事であり、年度末の数値に反映されているため needsReview には入れていません。
- businessModel: セグメント利益の金額、経営指標の目標値（売上高や利益率の数値目標）、受注高・受注残高の金額は、本文の規則により書いていません。
- businessModel: 中期経営計画の数値目標（2027年3月期の売上高60億円など）は投資・目標の数値であるため、戦略の文章にも書いていません。
- businessModel: Wikipedia の記事にある略称「NCC」の商標登録の補足は、対応するデータ項目がないため取り込んでいません。
- businessModel: 2026年3月期の期末配当を実施しないことは配当政策の事項であり、本文には書いていません。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の大きい順（タンタルコンデンサ事業3,171,311千円、回路保護素子事業1,776,175千円、その他194,448千円）です。「その他」は報告セグメントに含まれないフィルムコンデンサ事業で、金額が印字されているため最後に置きました。
- businessStructure: 設備と事業の対応は主要な設備の状況の印字どおりです（本社工場はタンタルコンデンサ事業、福知山工場はタンタルコンデンサ事業と回路保護素子事業、島根工場はその他）。複数区分が連記された行は特定の事業の説明には結びつけていません。帳簿価額は書いていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマに無いため付けていません。仕入先の個別名は有報に印字されていません。
- history: 沿革から落とした行: 1953年東京営業所（現東日本営業部）開設、1982年名古屋営業所（現中部日本営業部）開設、2020年島根工場の回路保護素子設備の福知山工場への移管。いずれも営業所の開設と設備の移管で、事業の転機ではないため省きました。
- history: 1949年の設立時の資本金（50万円）は、資本金の金額を書かない規則により沿革に書いていません。2022年の第三者割当増資の発行株数も書いていません。
- history: 年号だけを書き、月は書いていません（history の規則）。
- industry: 主たる業界は electronics としました。タンタルコンデンサ、フィルムコンデンサ、回路保護素子はいずれも電子部品であり、閉じた分類の中で直接に合うため、暫定分類ではなく taxonomyGaps は付けていません。
- industry: semiconductors は付けていません。コンデンサと回路保護素子は受動部品であり、半導体そのものや半導体向けの部材・装置の事業は開示されていません。
- relatedCompanies: 釜屋電機株式会社: 【関係会社の状況】で「その他の関係会社」とされ、議決権の被所有割合は27.5％、2026年3月31日現在で発行済株式（自己株式を除く）の27.33％を保有する筆頭株主であり、当社製品の販売も担っています。関係性と同一性は有報に印字されていますが、related-candidates.json に含まれないため結んでいません。
- relatedCompanies: zero（ゼロ）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: daiwa（大和）: 有報本文に取引・提携・資本関係の記述がなく、証券会社名などの部分一致のみで、結ぶ根拠がありません。
- relatedCompanies: the-lead（リード）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: aeon（イオン）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: freee（フリー）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: enomoto（エノモト）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: hitachi（日立製作所）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: iwatani（岩谷産業）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: kyosan-electric-manufacturing（京三製作所）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: land（ランド）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: mitsubishi-electric（三菱電機）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: mitsui-high-tec（三井ハイテック）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: rikei（理経）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: step（ステップ）: 有報本文に取引・提携・資本関係の記述がなく、結ぶ根拠がありません。
- relatedCompanies: the-hyakujushi-bank（百十四銀行）: 有報本文に取引・提携・資本関係の記述がなく、金融機関でもあるため結んでいません。
- terms: 助言のみ。用語の候補としては「タンタルコンデンサ」「導電性高分子タンタルコンデンサ」「マイクロヒューズ」「サージアブソーバ」「回路保護素子」「フィルムコンデンサ」などが挙げられますが、本工程ではデータを持ちません。

## 要確認（status に反映）

- businessModel: 提出後の2026年4月14日に、釜屋電機株式会社を割当先とする第三者割当増資（普通株式627,000株）の払込が完了しています。登録内容は2026年3月31日現在の発行済株式総数と株主構成に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
