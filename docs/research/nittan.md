# NITTAN — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＮＩＴＴＡＮ |
| 証券コード | 6493 |
| docID（データを取り出した文書） | `S100YVDP` |
| 原本 docID | `S100YIJ0` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YVDP／有効文書 S100YVDP（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YVDP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＮＩＴＴＡＮ / 6493 / docID S100YIJ0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nittan: 10 件の数値を有報XBRLと照合
有報: 株式会社ＮＩＴＴＡＮ 訂正有価証券報告書－第104期(2025/04/01－2026/03/31) (docID S100YVDP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第104期(2025/04/01－2026/03/31)、docID S100YVDP）を有効文書としてこのパックを作った。原本は docID S100YIJ0。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはCriticalContractsTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
nittan: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社NITTAN」が EDINET の提出者名「株式会社ＮＩＴＴＡＮ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は千円単位の印字を百万円に切り捨てて転記した（切り上げはしていない）。
- businessModel: セグメント別の外部顧客への売上高の合計は51,675百万円で、印字された連結売上高51,676百万円と1百万円異なる。地域別の売上高も切り捨て後の合計が印字総額と異なる。いずれも印字どおり転記した。
- businessModel: MD&Aのセグメント別売上高（舶用部品5,124百万円、その他4,705百万円等）はセグメント間の内部売上高又は振替高を含むため使わず、セグメント注記の外部顧客への売上高を用いた。
- businessModel: 中長期経営ビジョン「NITTAN Challenge 10」の2030年目標のうち、連結売上高1,000億円以上のみをstrategy.disclosedに転記した。営業利益額100億円以上と売上高営業利益率10%以上の目標は利益・比率系の指標のため転記しなかった。
- businessModel: 有効文書は訂正有価証券報告書（S100YVDP）である。原本（S100YIJ0）との差異は重要な契約等のテキストブロックのみで、登録する数値と引用する本文は原本と同一であることを証拠パックの差異検証で確認したため、訂正の検証はwarningsに記録し、financialNotesには入れなかった。
- businessModel: 2024年5月のPBW事業の廃止（その他事業に統合）や、2024年11月の株式会社秦和の農作物事業からの撤退は、期中に完了し期末構成に反映されているため、沿革とwarningsに記録し、needsReviewには入れなかった。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順（小型エンジンバルブ41,476百万円、舶用部品5,045百万円、その他3,324百万円、歯車1,830百万円）とした。
- businessStructure: 「その他」には持分法適用関連会社である新和精密株式会社のバルブリフター事業が含まれる（事業の内容の印字どおり）。新和精密は2026年6月に連結子会社化されたが、本登録は2026年3月31日時点の構成による（詳細はbusinessModelのneedsReview）。
- businessStructure: U.S.エンジンバルブ（パートナーシップ）の個別の売上高は関係会社の状況の主要な損益情報等に印字されているが、グループ会社の数値でありセグメントの内訳ではないため、子要素の金額としては書かなかった。
- history: 2026年4月の北京柳成新和汽車部件有限公司の清算結了と、2026年6月の新和精密株式会社の連結子会社化は、決算日後の出来事として沿革にも印字されているが、本登録は2026年3月31日時点の構成によるため沿革には入れず、businessModelのneedsReviewに記録した。
- history: 沿革に印字された子会社の設立時の資本金額は、禁止される財務金額にあたるため転記しなかった。
- industry: 全セグメントがエンジンバルブや精密鍛造歯車等の輸送用機器部品の製造販売であり、舶用部品も船舶用エンジンバルブであるため、主たる業界は自動車（automotive）とした。分類に不足はなく、taxonomyGapsは空とした。
- relatedCompanies: honda: 特定投資株式の保有目的が「輸送用機器部品の重要な販売先としての取引関係の維持・強化」と個別に印字され、主要な顧客ごとの情報にも同社グループの販売先が印字されているため顧客として結んだ。最大の販売先として印字されているHonda Development and Manufacturing of America, LLC, Anna Engine Plantは同社の米国子会社であり上場会社本人ではないため、それ自体は結ばなかった。
- relatedCompanies: iwatani: 保有目的に「グローバル産業ガス調達の強化」と調達の役割が個別に印字されているため仕入先として結んだ。大株主の状況にも4.52％の保有が印字されている。
- relatedCompanies: nihon-parkerizing、onex: 保有目的に表面処理技術（onexは熱処理技術も）の競争力向上における関係強化と技術分野が個別に印字されているため、表面処理等の委託先として結んだ。
- relatedCompanies: イートンコーポレーション: 関係会社の状況で「その他の関係会社」と区分され、当社の議決権の17.2％を保有し、当社と技術提携をしている。しかし米国法人で関連候補に含まれず、百科事典の対象外のため結ばなかった。事実はここに記録する。なお、U.S.エンジンバルブ（パートナーシップ）等の合弁会社は当社グループの会社である。
- relatedCompanies: yokohama-financial-group、mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-trust-group、nomura-holdings: 保有目的はいずれも子会社銀行・証券会社が主要な取引銀行・取引証券会社であり財務活動・取引の円滑化を目的とするもので、資金調達・金融取引が理由のため結ばなかった。
- relatedCompanies: subaru、mazda、suzuki、hino-motors-7205、iseki-and-co、kubota、daihatsu-infinearth-mfg: 当事業年度の保有株式数はなく、個別の取引・提携の記載もないため結ばなかった。
- relatedCompanies: 株式会社シンニッタン: 特定投資株式として前事業年度まで保有していたが当事業年度に保有がなく、非上場で関連候補にも含まれないため結ばなかった。
- relatedCompanies: en、nitta、step、land、career、vision、path、seki、port、slogan、base-4481、core、ricoh、corona、freee、suzuki-6785、ray、nissin: 社名の部分一致や一般語（ニッタン、タイランド、5ステップアプローチ、経営ビジョン、パーパス、セキュリティ、ポートフォリオ、スローガン、ベース、コア技術、リコール、コロナウイルス、フリー燃料、役員氏名の鈴木等）による機械的な一致であり、当社との取引・提携・資本関係の記載がないため結ばなかった。
- terms: 助言: 用語「エンジンバルブ」は、内燃機関の吸気・排気の開閉を行う部品で、当社グループの主力製品です（事業の内容に印字）。
- terms: 助言: 用語「バルブリフター」は、エンジンバルブを駆動する部品で、当社や新和精密株式会社等が製造販売しています（事業の内容に印字）。
- terms: 助言: 用語「中空エンジンバルブ」は、内部を中空にしたエンジンバルブで、国内事業で受注が増加している高付加価値製品です（MD&Aに印字）。
- terms: 助言: 用語「NC10（NITTAN Challenge 10）」は、2030年を目標年とする当社の中長期経営ビジョンの名称です（経営方針に印字）。

## 要確認（status に反映）

- businessModel: 2026年6月15日、持分法適用関連会社である新和精密株式会社の株式を追加取得（16％相当、譲渡元は合弁パートナーの柳成企業株式会社）し、同社並びに同社の100％出資子会社である日照柳成新和汽車部件有限公司及び同社の51％出資子会社であるSTP株式会社を連結子会社化しました（2026年2月27日の取締役会で決議し、重要な後発事象として印字）。本登録は2026年3月31日時点のグループ構成（新和精密は持分法適用関連会社）で行います。
- businessModel: 持分法適用関連会社であった北京柳成新和汽車部件有限公司（新和精密株式会社の100％子会社）は、2026年4月15日に清算結了しました（事業の内容及び沿革に印字）。本登録は2026年3月31日時点のグループ構成で行います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
