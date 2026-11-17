# ゴールドクレスト — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ゴールドクレスト |
| 証券コード | 8871 |
| docID（データを取り出した文書） | `S100YCU8` |
| 原本 docID | `S100YCU8` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCU8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ゴールドクレスト / 8871 / docID S100YCU8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
goldcrest: 10 件の数値を有報XBRLと照合
有報: 株式会社ゴールドクレスト 有価証券報告書－第35期(2025/04/01－2026/03/31) (docID S100YCU8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第34期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
goldcrest: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.analysis.text: 売上高と当期純利益以外の利益に触れていないか確認する（…を組み合わせる構成です。用地取得では利益の見込める用地を選別して取得する方針…）

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の印字（百万円単位）をそのまま使った。セグメントの金額はセグメント注記の外部顧客への売上高であり、MD&Aのセグメント別売上高とも一致する。
- businessModel: 会社の目標とする経営指標（売上高経常利益率15％以上、自己資本比率30％以上）は利益率・財務比率の目標であるため、本文・戦略には書かず、この記録に留めた。当期の実績値（売上高経常利益率28.1％、自己資本比率42.1％）も同様に本文には書いていない。
- businessModel: 前期の窓に第34期の訂正有価証券報告書があるが、機械の修正再表示チェックでは前期有報との重複年度が全系列で一致（差異なし）であり、当期有報の5年表にも修正の注記はないため、financialNotes と needsReview には入れず、この記録に留めた。
- businessModel: 重要な後発事象は連結・個別とも該当事項なし、重要な契約等も該当事項なし、株式の保有状況も該当事項なしと印字されている。
- businessModel: 売上高以外の利益の金額や増減理由（固定資産の取得に伴う動きを含む）は本文に書いていない。
- businessStructure: 親会社は株式会社ミューアセット（非上場）で、【関係会社の状況】では議決権の被所有割合48.5％、【大株主の状況】では2026年3月31日現在で所有株式数の割合48.44％と印字されている。株式会社サクセス・プロ（不動産賃貸業、不動産の賃借の関係）と株式会社サクセス・プロホールディングス（有価証券の保有）は親会社グループの会社として【関係会社の状況】に載るが、いずれも非上場で関連企業候補にないため relatedCompanies には結んでいない。
- businessStructure: 持分法適用関連会社は合同会社TSインベストメント１号を営業者とする匿名組合（不動産賃貸業、出資比率50.0％）であり、上場会社ではないため relatedCompanies には結んでいない。
- businessStructure: 2026年3月期は賃貸用不動産の取得により不動産賃貸事業のセグメント資産が前期から大きく増加している（金額は本文に書かない）。
- businessStructure: suppliers はこのツリーのスキーマに無いため businessModel に書いていない。個別の仕入先の開示は有報にない。
- history: 沿革の2002年12月の首都圏でのマンション供給ランキング（順位）の行と、2023年７月のSUUMO AWARD受賞の行は、順位・受賞の類として本文の沿革には入れず、この記録に留めた。
- history: 沿革の2021年６月のペット用個室「わんルーム」の実用新案登録の行は細目として落とした。
- history: 沿革に資本金の金額は印字されていない。
- industry: 主たる業界は、不動産分譲事業が外部顧客への売上高20,576百万円と連結売上高の67.6％を占めるため real-estate とした。不動産賃貸事業・不動産管理事業も不動産であり、同じ値に含まれる。
- industry: ホテル事業は報告セグメントとして独立開示があるため、暫定の entertainment を2つ目に付け、分類の不足を taxonomyGaps に記録した。
- relatedCompanies: career（株式会社キャリア）: 本文中の「キャリア研修」という一般語の一致のみで、同社との取引・提携・資本関係の記述はないため結ばなかった。
- relatedCompanies: en（エン株式会社）: 「エンゲージメント」という一般語の一致のみで、同社についての記述はないため結ばなかった。ambiguous の相手でもある。
- relatedCompanies: land（株式会社ランド）: 「クレストタワー」ブランド等の「ランド」を含む文字列の一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 大株主の状況の住所等の文字列の一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: space（株式会社スペース）: 「ソロワークスペース」という一般語の一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 「ZEH（ネット・ゼロ・エネルギー・ハウス）」という一般語の一致のみで、同社についての記述はないため結ばなかった。ambiguous の相手でもある。
- relatedCompanies: base-4481（ベース株式会社）: 「営業利益ベース」という一般語の一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: king（株式会社キング）: 「ランキング」という一般語の一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: taya（株式会社田谷）: 設備の所在地「世田谷区」の文字列の一致のみで、同社についての記述はないため結ばなかった。ambiguous の相手でもある。
- relatedCompanies: trust（株式会社トラスト）: 「日本マスタートラスト信託銀行（信託口）」の文字列の一致のみで、コードリストにない相手でもあるため結ばなかった。信託銀行の信託口は純投資であり結ばない。
- relatedCompanies: 親会社の株式会社ミューアセット、その他グループ会社の株式会社サクセス・プロ・株式会社サクセス・プロホールディングス、持分法適用関連会社の匿名組合はいずれも非上場で関連企業候補にないため結んでいない。事実は businessStructure の warnings に記録した。
- relatedCompanies: 大株主のうち INTERTRUST TRUSTEES (CAYMAN) LIMITED、NORTHERN TRUST CO.、日本マスタートラスト信託銀行（信託口）、株式会社日本カストディ銀行（信託口）、STATE STREET BANK AND TRUST COMPANY は信託・カストディ等の純投資であり、事業会社の大株主として結ぶ対象ではない。株式会社エスディサポートは非上場で候補にない。
- relatedCompanies: 株式の保有状況は該当事項なしと印字されており、政策保有株式による結び付きはない。
- terms: 助言: 用語「クレストシティ」「クレストフォルム」「クレストタワー」「クレストレジデンス」「クレストプライムレジデンス」は、当社グループの新築分譲マンションのブランド（シリーズ）名で、事業の内容と沿革に印字されています。
- terms: 助言: 用語「わんルーム」は、ペット用の個室の名称で、2021年６月に実用新案登録されたことが沿革に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ゴールドクレストのホテル事業 → 提案: hospitality（ホテル・宿泊）。ホテル事業は自社所有のホテルの経営・運営を行う報告セグメントで、2026年3月期の外部顧客への売上高3,253百万円（連結売上高の10.7％）を占めるが、閉じた分類にホテル・宿泊を表す値がない。宿泊事業の先例（アゴーラホスピタリティーグループ等）に揃えて entertainment を暫定としたが、娯楽施設の運営ではなく宿泊サービスの提供が事業の実態である。
