# タカラスタンダード — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | タカラスタンダード株式会社 |
| 証券コード | 7981 |
| docID（データを取り出した文書） | `S100YE7H` |
| 原本 docID | `S100YE7H` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE7H.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | タカラスタンダード株式会社 / 7981 / docID S100YE7H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takara-standard: 10 件の数値を有報XBRLと照合
有報: タカラスタンダード株式会社 有価証券報告書－第152期(2025/04/01－2026/03/31) (docID S100YE7H)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
takara-standard: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や販売費などの費用を差し引いた残りが利益になります。2026年3月期のは15…）
- 確認: [other-profit-wording] perspectives.industryPosition.analysis.basis: 売上高と当期純利益以外の利益に触れていないか確認する（…報に「本邦の外部顧客への売上高が連結損益計算書の売上高の90％を超える」と印…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全系列で一致し、会計基準の変更や財務諸表の組替えの記載もないため、financialNotes は空にした。経営指標の注記の「第150期より従業員数及び平均臨時従業員数の集計範囲を見直し」は従業員数の集計方法の変更であり、財務数値の基準ではないため、ここに記録するにとどめた。
- businessModel: 重要な後発事象は、2026年4月30日開催の取締役会で決議した自己株式の取得のみであり、通常の資本政策で本登録の2026年3月31日現在の記載に影響しないため、needsReview には入れなかった。
- businessModel: 前連結会計年度に連結子会社であったタカラ物流サービスは2025年12月18日付で清算し連結の範囲から除かれており、2026年3月31日現在の連結子会社はタカラ化工1社という記載に反映している。
- businessModel: 中期経営計画2026の目標のうち、営業利益・営業利益率・ROE等の数値は文章規則により書かず、売上高目標のみを strategy に書いた。総資産・純資産・自己株式取得額などの金額も本文に書いていない。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順（住宅設備関連252,493百万円）とし、報告セグメントに含まれない「その他」（不動産賃貸事業及び倉庫事業、262百万円）を最後に置いた。
- businessStructure: 住宅設備関連事業の子区分の金額は、セグメント注記には製品部門別の金額が無いため、MD&Aの販売実績（製品部門別）を用いた。4部門の合計（154,762＋58,735＋30,574＋8,420百万円）はセグメントの外部顧客への売上高252,493百万円と一致する。
- businessStructure: 子区分の4番目は有報の製品部門表の区分名が「その他」であるため、親事業の「その他」と区別して「その他の住宅設備機器」と表記した。
- businessStructure: listings の market は、表紙の「東京証券取引所 プライム市場」の印字による。
- history: 沿革の各行には年月が印字されており、崩れた表ではないため、行順の対応づけは行っていない。創業時の資本金の金額は文章規則により書かなかった。
- history: 2026年4月の家事代行サービス開始は決算日後の出来事だが、有報の【沿革】に印字されているため沿革に含め、businessModel の needsReview にも記録した。
- history: wikipedia.json はあったが、その補足（本社所在地など）は有報にも記載があり、シェア等の数値は規則により使えないため、出典として使わなかった。
- industry: 主たる業界は、住宅設備関連事業が唯一の報告セグメントで売上高のほぼ全てを占めることから、住宅設備機器メーカーの公開済みエントリー（TOTO、LIXIL）が用いている construction とした。閉じた分類に住宅設備機器の区分はないが、同業の慣例があるため taxonomyGaps には書かなかった。
- industry: 不動産賃貸事業は報告セグメントに含まれず、外部顧客への売上高も262百万円と僅少なため、real-estate は付けなかった。
- relatedCompanies: 結んだ相手はすべて【株式の保有状況】の特定投資株式の表に、銘柄ごとに取引の内容（購入先・営業取引先・流通代理店）が印字され、実株数を保有する相手である。計上額は説明に書いていない。
- relatedCompanies: 流通代理店であり購入先でもある相手（山善、岩谷産業、橋本総業ホールディングス、TOKAIホールディングス、JKホールディングス、OCHIホールディングス、三協立山、三谷産業）は、取引の向きが双方向のため business-partner とした。流通代理店の持株会社で購入先の記載がないミツウロコグループホールディングスとジオリーブグループは、当社製品の販売先グループの親会社として customer とした。
- relatedCompanies: yokohama-financial-group、mebuki-financial-group、mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group は特定投資株式に載るが、保有目的が「取引金融機関の持株会社であり、財務に係る業務の円滑な推進」と資金調達・財務取引に関するものであるため結ばなかった。
- relatedCompanies: resona-holdings は2026年3月期中に全株式を売却しており、当事業年度末の保有がない（金融機関でもある）ため結ばなかった。
- relatedCompanies: heiwa は、有報の「平和」が沿革の企業組合平和ブロック工業（1964年に出資、1970年に九州タカラ工業が業務を継承）を指し、候補の株式会社平和とは別の法人であり、有報に候補企業についての記載がないため結ばなかった。
- relatedCompanies: suzuki-6785 は、有報に同社についての取引・提携・資本関係の記載がなく、社名の断片一致のみのため結ばなかった。
- relatedCompanies: career、en、vision、innovation、base-4481、port、seki、tear、the-lead、ray、applied-technology は、キャリア採用、長期ビジョン、イノベーション、ベースアップ、事業ポートフォリオ、情報セキュリティ、ボランティア休暇、DX人財を「リード」する、アレンジクリアトレイ、応用技術開発といった一般語・断片の一致で、有報に各社についての記載がないため結ばなかった。
- relatedCompanies: trust はコードリストになく、有報での一致は信託銀行の信託口名義のみのため結ばなかった。
- relatedCompanies: 大株主の状況に載るタカラベルモントアセットマネジメント（所有割合10.28％、2026年3月31日現在）は事業会社だが、候補リストにないため結べなかった。株主名簿上の横浜銀行・常陽銀行は金融機関、日本生命保険・明治安田生命保険は相互会社の保険会社であり、major-shareholder としては結ばなかった。
- relatedCompanies: 連結子会社のタカラ化工は非上場で候補リストになく、結ばなかった。特定投資株式に載るKVK、SANEI、AVANTIA、ASGホールディングスも、取引の記載はあるが候補リストにないため結べなかった。
- terms: 助言: 「ホーロー」は用語集の登録候補になります。金属の表面にガラス質の釉薬を焼き付けて作る素材を指し、同社の創業以来の中核技術であるためです。
- terms: 助言: 「フリット」は用語集の登録候補になります。ホーローやタイルの釉薬の主原料を指し、同社が製造し、製品部門の一つにもなっているためです。
- terms: 助言: 「システムキッチン」は用語集の登録候補になります。調理台・コンロ・収納などを一体で構成するキッチンを指し、同社の最大の製品部門であるためです。
- terms: 助言: 「システムバス」は用語集の登録候補になります。浴槽・壁・床などを工場で成型して現場で組み立てる浴室を指し、同社の浴室部門の主力製品であるためです。

## 要確認（status に反映）

- businessModel: 新規事業の開始: 家事代行サービス「saikou!」の提供を2026年4月に東京・大阪・京都で開始しました（有報の【沿革】に記載）。これは決算日（2026年3月31日）後の開始であり、本登録の事業構成の記載は2026年3月31日現在のセグメント構成に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
