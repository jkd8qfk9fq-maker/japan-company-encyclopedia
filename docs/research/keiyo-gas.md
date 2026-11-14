# 京葉瓦斯 — research log

Registered: 2026-11-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 京葉瓦斯株式会社 |
| 証券コード | 9539 |
| docID（データを取り出した文書） | `S100XTA9` |
| 原本 docID | `S100XTA9` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTA9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 京葉瓦斯株式会社 / 9539 / docID S100XTA9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
keiyo-gas: 10 件の数値を有報XBRLと照合
有報: 京葉瓦斯株式会社 有価証券報告書－第141期(2025/01/01－2025/12/31) (docID S100XTA9)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":115609000000,"latestFiling":115704000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
keiyo-gas: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画2025-2027の2027年目標や長期経営ビジョン2030の数値目標は将来の数値目標のため本文には記載せず、計画の骨子のみを記載した。
- businessModel: 2025年12月期の売上高について、前連結会計年度の数値は受取賃貸料の表示方法の変更を反映した組替後の数値であり、前期有報の印字（115,609百万円）とは95百万円の差がある。financialNotesに記載した。
- businessModel: ガスの原料の一部を仕入れている株式会社南悠商社は、議決権の30.3％を保有するその他の関係会社であるが未上場で候補データにないため結ばず、役割をbusinessModelとindustryPositionに記録した。
- businessModel: Wikipediaの抜粋（東京ガスに次ぐ規模、LNG受入基地を持たない等）は有報の印字で裏づけられないため補足には使用しなかった。
- businessStructure: リアルエステート事業の売上高について、MD&Aの売上高2,172百万円はセグメント間の内部売上高を含むため、外部顧客への売上高1,906百万円を使用した。
- businessStructure: ガスの原料の一部を仕入れている株式会社南悠商社は、議決権の30.3％を保有するその他の関係会社であるが未上場で候補データにないため結ばず、役割をbusinessModelとindustryPositionに記録した。
- history: 1927年の設立行の資本金額は規則により記載していない。
- industry: 主たる事業は都市ガスの製造・供給及び販売であり、閉じた分類では energy が最も近いため primary とした。
- relatedCompanies: INPEXとAGCは、保有目的が原料・資材調達上の関係維持・強化と印字されているため仕入先として結んだ。両社は関連候補データ（related-candidates.json）に含まれていなかった（全角表記のため機械抽出から漏れたもの）ため、特定投資株式の表から直接確認した。
- relatedCompanies: 京成電鉄、住友商事、北越コーポレーション、イチカワ、イワブチ、長谷工コーポレーションは、保有目的が「営業上の関係維持・強化、主にエネルギーセグメントにおける取引・関係」のみで取引の向きが示されていないため見送った。
- relatedCompanies: 出光興産、福田組、JFEホールディングス、日本瓦斯、東京瓦斯、大阪瓦斯は、保有目的が「事業運営上の関係維持・強化、主にエネルギーセグメントにおける取引・関係」のみで取引の向きが示されていないため見送った。
- relatedCompanies: 三菱UFJフィナンシャル・グループ、みずほフィナンシャルグループ、野村ホールディングス、SOMPOホールディングス、千葉興業銀行は、資金調達・保険・証券取引の文脈の金融機関のため見送った。
- relatedCompanies: 光通信は、大株主の記載が光通信KK投資事業有限責任組合であり、株式会社光通信そのものではないため見送った。
- relatedCompanies: エステー、キャリア、エン、コア、ゼロ、フリー、ビジョン、ポート、イムラ、セキ、ベース、電源開発、キング、ウィル、ガーデン、スペースは、一般語・部分一致の誤マッチのため見送った。
- relatedCompanies: 株式会社南悠商社は、議決権の30.3％を保有するその他の関係会社で原料等の購入先（2025年12月期の原料等の購入1,857百万円）であるが未上場で候補データにないため結ばず、役割をbusinessModelとindustryPositionに記録した。
- relatedCompanies: 連結子会社及び持分法適用関連会社はすべて非上場で候補外のため結んでいない。
- terms: 助言: 用語「都市ガス」は、導管を通じて供給されるガスで、同社の主力事業である。同社の事業説明の前提になるため、用語集への追加候補と考える。
- terms: 助言: 用語「原料費調整制度」は、ガス原料価格の変動をガス販売単価に反映させる制度で、反映までに一定の時間差がある。同社の業績説明に繰り返し現れるため、用語集への追加候補と考える。
- terms: 助言: 用語「カーボンオフセット都市ガス」は、CO2排出量をクレジットで相殺した都市ガスで、同社の脱炭素の取り組みの中核である。同社の戦略説明の前提になるため、用語集への追加候補と考える。
- terms: 助言: 用語「スライドタイムラグ」は、ガス原料価格の変動が原料費調整制度に基づくガス販売単価に反映されるまでの時間差で、一時的な増減益要因となる。同社の業績説明に現れるため、用語集への追加候補と考える。

## 要確認（status に反映）

- businessModel: 2025年1月1日付で、普通株式1株につき3株の割合で株式分割を行いました。株式数に基づく指標は、第137期の期首に当該株式分割が行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
