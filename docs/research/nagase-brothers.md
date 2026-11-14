# ナガセ — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ナガセ |
| 証券コード | 9733 |
| docID（データを取り出した文書） | `S100YK8I` |
| 原本 docID | `S100YK8I` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK8I.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ナガセ / 9733 / docID S100YK8I（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nagase-brothers: 10 件の数値を有報XBRLと照合
有報: 株式会社ナガセ 有価証券報告書－第51期(2025/04/01－2026/03/31) (docID S100YK8I)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nagase-brothers: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: セグメントの売上高は、セグメント注記の外部顧客への売上高を用いた。経営成績の分析に印字された部門別売上高（高校生部門30,068百万円など）はセグメント間の内部売上高又は振替高を含むため用いていない。
- businessModel: businessModel.suppliers は省いた。有報は外部の調達先を一般名詞で述べておらず、教材等の販売はグループ会社間の取引として印字されているためである。
- businessModel: 当期に計上された校舎の移転補償金や、前期の一過性の損失については、本文の財務数値の規則により金額・理由を本文に書かず、純利益の増減の説明は定性的にとどめた。
- businessModel: 重要な後発事象は、2026年6月8日開催の取締役会で決議され実施された自己株式の取得のみであり、資本政策の事項として warnings のみの記録とし、needsReview には入れていない。
- businessModel: wikipedia.json の記事「ナガセ」の冒頭は、有報に印字されたブランド名等の再述にとどまり、有報を超える補足がないため出典に加えていない。
- businessStructure: 上場市場は表紙の印字「東京証券取引所スタンダード市場」による（単独上場）。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とし、報告セグメントに含まれない「その他」は最後に置いた。
- businessStructure: 「その他」の内訳（出版事業、オンライン学校部門、こども英語塾部門、国際事業部門）は事業の内容と経営成績の分析の印字によるもので、金額は区分ごとに開示されていないため、各子事業に金額は書いていない。
- history: 沿革表は2008年6月と2009年6月の年月セルが続けて印字され事象文と分かれている崩れた表で、年月2件と事象2件（アイエスエスの商号変更、シンガポールの子会社設立）の数が一致するため、行順に対応づけた。
- history: 沿革に印字された資本金の金額（1976年の設立時資本金など）は、金額の規則により本文・沿革に書いていない。
- history: 2023年4月1日付で普通株式1株につき3株の割合で株式分割を行っており、指標の注記では第47期の期首に当該分割が行われたと仮定して株式数に関する指標が算定されている。株式数に関する指標そのものは本文に書かないため、warnings のみの記録とした。
- industry: 主たる業界は教育事業だが、閉じた分類に教育の値が無いため、先例（アルー、Aoba-BBT）に揃えて human-resources を暫定の主たる業界とした。詳細は taxonomyGaps に記録した。
- industry: スポーツ事業部門も水泳・フィットネス等の指導を行う事業で教育と一体のため、別の業界は付けていない。
- industry: 出版は「その他」の一部で、金額が独立して開示されていないため media は付けていない。
- relatedCompanies: step（ステップ）: 一致は「5ステップアプローチ」の語句によるもので、当社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: path（パス）: 表記による曖昧な一致で、当社との関係の記述がないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 一致は「賃金ベースアップ」の語句によるもので、関係の記述がないため結ばなかった。
- relatedCompanies: kyoshin（京進）: 一致は「東京進学教室」の表記による曖昧なもので、関係の記述がないため結ばなかった。
- relatedCompanies: land（ランド）: 一致は「ブランド力」の表記によるもので、関係の記述がないため結ばなかった。
- relatedCompanies: bridgestone（ブリヂストン）: 沿革の2022年3月の取得は同社の子会社だったブリヂストンスポーツアリーナ（現・イトマンスポーツスクール）の買収であり、現在の取引・提携関係の記述がないため結ばなかった。
- relatedCompanies: corona（コロナ）: 一致は「コロナ禍」の語句によるもので、関係の記述がないため結ばなかった。
- relatedCompanies: port（ポート）: 一致は「ITパスポート」の語句によるもので、関係の記述がないため結ばなかった。
- relatedCompanies: gakken-holdings（学研ホールディングス）: 特定投資株式の保有目的が「当社グループと共通の事業領域を有する企業として、情報収集等の強化のため」という定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: gakkyusha（学究社）: 特定投資株式の保有目的が上記と同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: seigakusha（成学社）: 特定投資株式の保有目的が同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: shuei-yobiko（秀英予備校）: 特定投資株式の保有目的が同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: johnan-academic-preparatory-institute（城南進学研究社）: 特定投資株式の保有目的が同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: shingakukai-holdings（進学会ホールディングス）: 特定投資株式の保有目的が同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: meiko-network-japan（明光ネットワークジャパン）: 特定投資株式の保有目的が同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: tokyo-individualized-educational-institute（東京個別指導学院）: 特定投資株式の保有目的が同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: riso-kyoiku-group（リソー教育グループ）: 特定投資株式の保有目的が同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: waseda-academy（早稲田アカデミー）: 特定投資株式の保有目的が同型の定型句のみで、具体的な取引・提携の記述がないため結ばなかった。
- relatedCompanies: pronexus（プロネクサス）: 特定投資株式の保有目的は「当社グループと取引関係があり、情報収集等の強化のため」で、具体的な取引内容の記述がない定型句のため結ばなかった。
- relatedCompanies: shobunsha-holdings（昭文社ホールディングス）: 特定投資株式の保有目的はプロネクサスと同型の定型句で、具体的な取引内容の記述がないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱UFJフィナンシャル・グループ）: 特定投資株式の保有目的が金融機関との資金調達等金融取引の円滑化であり、規則により結ばなかった。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ）: 特定投資株式の保有目的が金融取引の円滑化であり、規則により結ばなかった。大株主として印字されているのは株式会社みずほ銀行（銀行そのもの、2026年3月31日現在4.99％）で、同グループとは別の法人であり、金融機関の保有として結ばなかった。
- relatedCompanies: trust（三井住友トラスト・グループ）: 特定投資株式の保有目的が金融取引の円滑化であり、規則により結ばなかった。
- relatedCompanies: 株式会社昭学社（発行済株式の37.00％を所有する大株主）は関係会社の状況で「その他の関係会社」とされる代表取締役社長の財産保全会社だが、未上場で関連候補に含まれないため結ばなかった。
- terms: 助言: 用語「東進衛星予備校」は、映像授業をフランチャイズ加盟校へ配信する予備校の形態を指す同社の中核用語で、事業の内容・沿革に印字されている。
- terms: 助言: 用語「フランチャイズ加盟校」は、東進衛星予備校のネットワークを構成する加盟校（2026年3月期末920校）を指し、経営成績の分析に印字されている。
- terms: 助言: 用語「YTnet・四谷大塚NET」は、四谷大塚のネットワーク加盟教室の呼称で、経営成績の分析に印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ナガセ（nagase-brothers）の主たる業界（東進ハイスクール等の予備校、四谷大塚等の学習塾、イトマンスイミングスクール等のスポーツ教室） → 提案: 教育（学習塾・予備校・スポーツ教室等の教育サービス）。教育事業が2026年3月期の営業収益64,183百万円の大半を占めるが、閉じた分類に教育・学習支援の区分が無い。掲載済みの先例（アルー、Aoba-BBT）で human-resources を暫定値としており、それに揃えた。
