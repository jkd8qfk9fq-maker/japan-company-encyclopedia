# 梅乃宿酒造 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 梅乃宿酒造株式会社 |
| 証券コード | 559A |
| docID（データを取り出した文書） | `S100Z3LJ` |
| 原本 docID | `S100Z3LJ` |
| 提出日（原本） | 2026-09-24 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3LJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 梅乃宿酒造株式会社 / 559A / docID S100Z3LJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
umenoyado-brewery: 10 件の数値を有報XBRLと照合
有報: 梅乃宿酒造株式会社 有価証券報告書－第76期(2025/07/01－2026/06/30) (docID S100Z3LJ)
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
umenoyado-brewery: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報が証拠パックの窓内になく、修正再表示の照合は行われていない（パックの注記どおり）。現在の有報の本文に、組替えや修正再表示が経営指標に影響する旨の記載は見当たらなかった。
- businessModel: 経営指標等の注記のうち、配当・株価収益率・監査の範囲・従業員数の定義など表示に関する事項は warnings のみとし、financialNotes には収益認識基準の適用（事業の内容の業績推移表の注記）と株式分割の2件を入れた。
- businessModel: 2026年4月の上場は当事業年度内の出来事で提出日現在の状態と一致するため、needsReview には入れず沿革に記録した。
- businessModel: 経営指標として開示されているKPI（EBITDA、BtoC売上、海外売上、ROE）の金額や比率は本文・perspectives には書いていない。
- businessStructure: 関係会社の状況は「該当事項はありません」で、子会社・関連会社はない。沿革にある子会社（有限会社エミューコーポレーション、小梅株式会社、UMENOYADO USA.INC）はいずれも吸収合併または清算により消滅済みである。
- businessStructure: セグメント情報の製品及びサービスごとの情報は、単一の製品・サービスの区分の外部顧客への売上高が売上高の90％を超えるため記載が省略されており、品目別の売上高は開示されていない。そのため children には金額を書いていない。
- businessStructure: 主要な設備は本社工場（奈良県葛城市、酒類製造販売事業）で、旧本社工場の日本酒製造設備は休止中、第二蔵は土地のみの全社資産である。帳簿価額は書いていない。
- businessStructure: 仕入先の個別名は事業の内容に印字されていない（リキュールの原料は原料メーカーより調達すると記載）。suppliers はこのツリーの旧スキーマに従い省略した。
- history: 沿革のうち次の行は落とした: 1968年の酒類製造業の営業許可取得（許認可のみ）、2001年11月の焼酎乙類の製造免許取得と東京事務所開設、2002年の有限会社エミューコーポレーション設立（2022年の吸収合併の項目で言及）、2006年・2009年・2020年・2025年の各製造免許取得（2001年のリキュール免許を除く）、2011年の梅乃屋本舗開店、2017年の小梅株式会社設立（2021年に吸収合併済み）、2021年の第三者割当増資によるファンドの資本参加（資本に関する事項）、2021年の小梅株式会社の吸収合併、2023年・2025年・2026年の認証・認定取得（認証類）。
- industry: 主たる業界は food とした。日本酒やリキュールなどの酒類は食料品に分類される食品製造業であり、閉じた分類の food に直接適合する。酒類専用の区分はないが、乖離は小さいと判断し taxonomyGaps は付けなかった。
- relatedCompanies: land: 「ブランド」の部分一致のみのため結ばなかった。
- relatedCompanies: career: 「キャリアパス」の部分一致のみのため結ばなかった。
- relatedCompanies: corona: 新型コロナウイルス感染症の文脈のみのため結ばなかった。
- relatedCompanies: path: ambiguous であり、「パーパス」の部分一致のみのため結ばなかった。
- relatedCompanies: ichigo: 商品名「大人の果肉の沼『いちご』」の果実名のみのため結ばなかった。
- relatedCompanies: base-4481: 「ベースとして」の部分一致のみのため結ばなかった。
- relatedCompanies: en: ambiguous であり、「奈良エクスペリエン酒」の部分一致のみのため結ばなかった。
- relatedCompanies: step: 研修の「ステップ」の部分一致のみのため結ばなかった。
- relatedCompanies: vision: 「ビジョン」の部分一致のみのため結ばなかった。
- relatedCompanies: hit: 「ヒット商品」の部分一致のみのため結ばなかった。
- relatedCompanies: seki: ambiguous であり、一般的な語の部分一致のみのため結ばなかった。
- relatedCompanies: the-nanto-bank: 大株主の状況に発行済株式の2.8％（2026年6月30日現在）を保有する銀行として載るが、取引・提携の記述がなく、銀行の保有は結ばない方針のため結ばなかった。
- relatedCompanies: zero: ambiguous であり、「廃棄物ゼロ」の部分一致のみのため結ばなかった。
- relatedCompanies: cota: ambiguous であり、「インコタームズ」の部分一致のみのため結ばなかった。
- relatedCompanies: daiwa: ambiguous であり、「大和の地酒造り」の部分一致のみのため結ばなかった。
- relatedCompanies: kohsoku: ambiguous であり、「高速化」の部分一致のみのため結ばなかった。
- relatedCompanies: port: 「サポート」の部分一致のみのため結ばなかった。
- relatedCompanies: quick: 「クイックに反応」の部分一致のみのため結ばなかった。
- relatedCompanies: trust: コードリストにない相手であり、日本マスタートラスト信託銀行（信託口）の信託口表記のみのため結ばなかった。
- relatedCompanies: vector: 「ベクトル」の部分一致のみのため結ばなかった。
- relatedCompanies: 候補に含まれていないため結ばなかった相手: 株式会社ＮＳＫは大株主の状況に2.8％で載るが候補一覧にない。日本成長投資アライアンス株式会社が運営するファンドは2021年6月の第三者割当増資で資本参加したが候補一覧になく、現在の関係の記載もない。
- terms: 助言: 用語「桶売り」は、造った酒を他の酒蔵に売り、買い手の商品として販売する商慣習のことで、事業の内容で説明されています。
- terms: 助言: 用語「特定名称酒」は、精米歩合や原料など一定の条件に適合した清酒のことで、事業の内容で説明されています。
- terms: 助言: 用語「あらごし」は、梅酒を漬けた後の果肉成分をブレンドした製法によるシリーズ名で、事業の内容で説明されています。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2025年４月17日付で普通株式１株につき20株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
