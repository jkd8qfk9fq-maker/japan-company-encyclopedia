# リテールパートナーズ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社リテールパートナーズ |
| 証券コード | 8167 |
| docID（データを取り出した文書） | `S100Y650` |
| 原本 docID | `S100Y650` |
| 提出日（原本） | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y650.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社リテールパートナーズ / 8167 / docID S100Y650（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
retail-partners: 10 件の数値を有報XBRLと照合
有報: 株式会社リテールパートナーズ 有価証券報告書－第73期(2025/03/01－2026/02/28) (docID S100Y650)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
retail-partners: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[2].description: 売上高と当期純利益以外の利益に触れていないか確認する（…す。外部顧客への営業収益のうち、連結損益計算書の営業収益の10％以上を占める…）
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、人件費などの費用を差し引いた残りが利益になります。2026年2月期のは5,…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの警告にある遡及適用の記載は、収益認識に関する会計基準等を第70期（2023年2月期）の期首から適用したこと（経営指標の注記）を指す。前期有報との修正再表示チェックは全項目（8行）一致しており数値の組替えは生じていないため、needsReview には入れず、financialNotes に適用の事実を記録した。表示単位の変更（千円→百万円）も同様に financialNotes に記録した。
- businessModel: 重要な後発事象として、2026年4月13日開催の取締役会で自己株式の取得（取得期間2026年4月15日から2026年8月31日まで）を決議したことが記載されている。株主還元と資本効率の向上を目的とする定型的な資本政策であり、登録内容（2026年2月28日現在の構成）への影響はないため needsReview には入れず、ここに記録する。
- businessModel: 第3次中期経営計画の目標のうち経常利益・経常利益率・ROE・PBRの目標値は、本文に書けない利益・投資の指標であるため perspectives には記載せず、営業収益の目標だけを取り上げた。
- businessModel: Wikipedia（リテールパートナーズ）の冒頭は、持株会社であることと主要なグループ子会社3社の情報のみで、有報の記載を補う事実がないため使用しなかった。記載内容はすべて有報に基づく。
- businessStructure: 報告セグメントは「スーパーマーケット事業」のみ。その他（保険代理業、スポーツクラブ事業、食品製造業等）は有報が「報告セグメントに含まれない事業セグメント」と明記するため、規則どおり最後に置いた。
- businessStructure: 事業の金額はセグメント注記の「外部顧客への営業収益」（2026年2月期: スーパーマーケット事業277,290百万円、その他907百万円）であり、経営指標の売上高（268,295百万円）とは別の指標であるため、文章では「営業収益」と明記した。セグメント利益は規則により記載していない。
- businessStructure: children は【事業の内容】に掲げる店舗運営会社6社とした。各社の金額は独立して開示されていないため金額は書かず、店舗数（2026年2月末時点、MD&Aの事業会社別店舗数表）のみを記した。食品二次卸の株式会社青木商事は店舗を持たないため、マルキョウの children の説明の中で触れた。
- history: 沿革は崩れた表ではなく年月と事象が一体で印字されているため、行順の対応づけは不要だった。
- history: 1971年の旅行事業開始、1988年の台湾丸久設立、2008年のピクロス・かいた取得など、現在の事業構成に直接つながらない行は割愛した（判断の記録）。
- history: 2018年の資本業務提携の significance にある「新日本スーパーマーケット同盟」の名称は、沿革ではなくMD&Aに現在の提携の呼称として記載されているものを使った。
- industry: 主たる業界は retail: 報告セグメントはスーパーマーケット事業のみで、外部顧客への営業収益の大半を占める。その他（保険代理業・スポーツクラブ事業・食品製造業）は報告セグメントに含まれず金額も小さい（2026年2月期の外部顧客への営業収益907百万円）ため、2つ目の業界は付けなかった。
- relatedCompanies: 結んだ関連企業は5社（arcs・valor-holdings は business-partner、ajinomoto・nh-foods・unicharm は supplier）。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: arcs・valor-holdings の種別判断: 【関係会社の状況】の4区分には当たらず、【重要な契約等】に資本業務提携契約（期間の定めなし）が明記され、提携に基づく共同の取り組みが現在も続いているため business-partner とした。大株主（各7.30％、2026年2月28日現在）であることは説明に併記した。
- relatedCompanies: ajinomoto・nh-foods・unicharm の種別判断: 株式会社丸久の特定投資株式の保有目的が、3社とも個別に「同社は、㈱丸久の商品調達先であり、スーパーマーケット事業における取引関係の維持・強化のために保有」と相手固有の取引関係を述べており、株式数も実数（10,000株・5,000株・27,000株）のため、取引の向き（当社グループへの商品供給）が印字されている supplier とした。
- relatedCompanies: izumi: 沿革に2005年10月の業務・資本提携の記載があるだけで、当期の有報に現在の取引・提携・株式保有の記載が確認できないため結ばない。過去の提携のみでは結ばない。
- relatedCompanies: daiwa-securities-group・nomura-holdings・sumitomo-mitsui-financial-group・sumitomo-mitsui-trust-group・hirogin-holdings・nishi-nippon-financial-holdings・yamaguchi-financial-group: いずれも特定投資株式として保有する金融機関・金融グループで、保有目的は傘下の銀行・証券会社との金融取引等であるため結ばない。なお大株主の状況に載るのは山口フィナンシャルグループ傘下の株式会社山口銀行そのものであり、候補の同グループ自体でもない。
- relatedCompanies: port: 「サポート」「レポート」等の一般語の断片一致であり、ポート株式会社への言及はないため結ばない。
- relatedCompanies: base-4481: 「連結ベース」の断片一致であり、ベース株式会社への言及はないため結ばない。
- relatedCompanies: seki: ambiguous の候補。「セキュリティ」等の断片一致であり、セキ株式会社への言及はないため結ばない。
- relatedCompanies: vision: 「長期経営ビジョン」の断片一致であり、株式会社ビジョンへの言及はないため結ばない。
- relatedCompanies: career: 人材育成の記述（キャリアアップ講座等）の断片一致であり、株式会社キャリアへの言及はないため結ばない。
- relatedCompanies: en: ambiguous の候補。一般語の断片一致であり、エン株式会社への言及はないため結ばない。
- relatedCompanies: ishin: インターナルカーボンプライシング等の記述の断片一致であり、イシン株式会社への言及はないため結ばない。
- relatedCompanies: land: 「ブランド力」の断片一致であり、株式会社ランドへの言及はないため結ばない。
- relatedCompanies: freee: 「CO2フリープラン」の断片一致であり、フリー株式会社への言及はないため結ばない。
- relatedCompanies: 候補にない関係会社: 連結子会社10社と持分法非適用の関連会社3社（株式会社仁保庵、RPGプラント株式会社、有限会社白石罐詰工場）はすべて非上場で候補にない。大株主に載るヤマエ久野株式会社（2.32％）も候補にないため結べない。
- terms: 登録候補（助言のみ）: 新日本スーパーマーケット同盟（リテールパートナーズ、株式会社アークス、株式会社バローホールディングスの3社による資本業務提携に基づくスーパーマーケットの提携枠組み）、アルク（株式会社丸久が展開する店舗ブランドの一つ）、プロセスセンター（生鮮食品の加工と物流を集約する拠点。同社グループでは丸久プロセスセンターや精肉プロセスセンター「宮崎ミートファクトリー」がある）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
