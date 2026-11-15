# サンコール — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | サンコール株式会社 |
| 証券コード | 5985 |
| docID（データを取り出した文書） | `S100YKOJ` |
| 原本 docID | `S100YKOJ` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKOJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | サンコール株式会社 / 5985 / docID S100YKOJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
suncall: 10 件の数値を有報XBRLと照合
有報: サンコール株式会社 有価証券報告書－第109期(2025/04/01－2026/03/31) (docID S100YKOJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
suncall: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は千円単位の印字を百万円に切り捨てて転記した（切り上げはしていない）。
- businessModel: 中期経営計画2027の2027年度目標のうち、連結売上高525億円のみをstrategy.disclosedに転記した。営業利益、営業利益率、当期純利益、ROEの目標は利益・比率系の指標のため転記しなかった。
- businessModel: HDD用サスペンション事業の終了（2025年6月に生産委託先での生産を終了、同年7月に顧客への出荷を終了）は期中に完了し期末構成に反映されているため、沿革とwarningsに記録し、needsReviewには入れなかった。前連結会計年度の主要な顧客であったWESTERN DIGITAL STORAGE TECHNOLOGIES (PHILIPPINES) CORPは海外法人で候補に含まれないため結ばなかった。
- businessModel: 当連結会計年度から、地域ごとの情報で「その他の地域」に含まれていた「米国」を独立掲記する方法に変更している。表示方法の変更のみであり、financialNotesには入れなかった。
- businessModel: 連結子会社整理及び固定資産廃棄損の計上はMD&Aに印字されているが、金額が本文に印字されていないため本文には書かなかった。
- businessModel: 伊藤忠商事株式会社の2026年1月1日付の株式分割は、保有先である同社自身の分割であり、当社の分割ではないためneedsReviewには入れなかった（富山第一銀行・田辺工業の先例）。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順（日本27,644百万円、アジア15,285百万円、北米9,232百万円、欧州60百万円）とした。MD&Aのセグメント別売上高（日本29,261百万円等）はセグメント間の内部売上高を含むため使っていない。
- businessStructure: 外部顧客への売上高の4セグメント合計は52,221百万円で、印字の連結売上高52,223百万円と2百万円異なる。各セグメントの金額は有報の印字どおりに転記した。
- businessStructure: 製品区分別（材料関連製品、自動車関連製品、HDD用サスペンション、プリンター関連、通信関連、その他製品）は報告セグメントではなく関連情報の開示であるため、businessStructureの子事業には地域別セグメントを採り、製品区分の金額はbusinessModelのindustryPositionに集約した。
- businessStructure: HDD用サスペンションは2025年6月に生産委託先での生産を、同年7月に顧客への出荷を終了した期中の事業終了であり、2026年3月期の従業員の状況でも同区分の従業員数は「－」と印字されている。期末時点の構成に反映済みのため、沿革とwarningsに記録し、needsReviewには入れなかった。
- businessStructure: 連結子会社のSUNCALL (Tianjin) Co.,Ltd.は2025年5月に清算決議を行い、2026年3月31日時点でも連結子会社として列挙されている。清算手続中の子会社である旨はbusinessModelのneedsReviewに記録した。
- history: 沿革の設立時の資本金等の金額は、禁止される財務金額に当たるため転記しなかった。
- history: HDD用サスペンションの生産・出荷の終了はMD&Aの印字に基づく。沿革には同事業の開始（1985年）のみが印字されている。
- history: SUNCALL (Tianjin) Co.,Ltd.の清算決議（2025年5月）は沿革に括弧書きで印字されている。清算手続中の子会社である旨はbusinessModelのneedsReviewに記録したため、沿革の行としては設立のみを採った。
- history: 選択から外した主な沿革事項（国内工場の建設、海外子会社の設立・清算、ISO認証の取得等）は、主要な転機に絞るため省略した。
- industry: 主たる業界は、精密線材・ばね等の金属加工部品の製造が事業の基盤であることに基づく機械とした。
- industry: 副次の業界として、光通信用精密部品やプリンター関連製品等の電子情報通信分野の製品に基づく電子部品・デバイス（electronics）を付けた。自動車関連製品は最大の製品区分だが、閉じた分類に自動車部品の独立区分がないため、製造技術の基盤である機械に集約した。
- relatedCompanies: toyota: 主要な顧客ごとの情報に当連結会計年度の最大の顧客として印字されているため顧客として結んだ。みなし保有株式として退職給付信託に同社株式が計上されていたが、前事業年度の保有であり当事業年度は「－」であること、信託口は結ばない先例からも、保有ではなく顧客関係を根拠とした。
- relatedCompanies: itochu: 特定投資株式として1,313,760株を保有するが、保有目的は他の全銘柄と同一の定型文（「中長期的に良好な関係維持が当社の企業価値を向上させ…」）であり、個別の取引・提携の記載がないため、koaの先例により結ばなかった。
- relatedCompanies: kyoto-financial-group: 特定投資株式として322,736株を保有するが、保有目的は全銘柄同一の定型文であり、個別の取引関係の記載がないため結ばなかった。
- relatedCompanies: kobe-steel: 特定投資株式の保有目的自体は全銘柄同一の定型文だが、沿革に同社が設立したKOBELCO SPRING WIRE (FOSHAN) CO.,LTD.への資本参加が印字され、同合弁会社が当社の持分法適用関連会社であるため、合弁の事実を根拠に業務提携先として結んだ。
- relatedCompanies: sanko: 「サンコール」の部分一致による誤検出で、株式会社サンコーとの関係の記載はないため結ばなかった。
- relatedCompanies: en: 「サンコールエンジニアリング」等の部分一致による誤検出で、エン株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: seki: 一般語の部分一致による誤検出で、セキ株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: hikari-tsushin: 「光通信用コネクタ」等の一般語の一致で、株式会社光通信との関係の記載はないため結ばなかった。
- relatedCompanies: core: 一般語の部分一致による誤検出で、株式会社コアとの関係の記載はないため結ばなかった。
- relatedCompanies: aska: 子会社の所在地「アグアスカリエンテス州」の部分一致で、アスカ株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」等の一般語の一致で、ベース株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」の部分一致で、ポート株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: kohsoku: 一般語の部分一致による誤検出で、株式会社高速との関係の記載はないため結ばなかった。
- relatedCompanies: marubeni: 有報の本文に当社との取引・提携・資本関係を示す記載が確認できないため結ばなかった。
- relatedCompanies: trust: 退職給付信託や信託口の表記の一部で、株式会社トラストそのものとの関係の記載はないため結ばなかった。
- relatedCompanies: nhk-spring: 有報の本文に当社との取引・提携関係を示す記載が確認できないため結ばなかった。
- relatedCompanies: space: 一般語の部分一致による誤検出で、株式会社スペースとの関係の記載はないため結ばなかった。
- relatedCompanies: zero: 一般語の部分一致による誤検出で、株式会社ゼロとの関係の記載はないため結ばなかった。
- relatedCompanies: career: 一般語の部分一致による誤検出で、株式会社キャリアとの関係の記載はないため結ばなかった。
- relatedCompanies: freee: 「フリーキャッシュ・フロー」等の一般語の一致で、フリー株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: king: 一般語の部分一致による誤検出で、株式会社キングとの関係の記載はないため結ばなかった。
- relatedCompanies: rion: 一般語の部分一致による誤検出で、リオン株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: WESTERN DIGITAL STORAGE TECHNOLOGIES (PHILIPPINES) CORPは前連結会計年度の主要な顧客（売上高13,159百万円）だが、海外法人で候補に含まれないため結ばなかった。HDD用サスペンション事業は当連結会計年度に終了している。
- terms: 助言: 用語「HDD用サスペンション」は、ハードディスクドライブの磁気ヘッドを支える精密ばね部品で、当社は1985年に生産を開始し、2025年に生産・出荷を終了しました（沿革・MD&Aに印字）。
- terms: 助言: 用語「バスバー」「シャントバスバー」は、電動車の電流経路や電流検出に使う導体部品で、当社の電動化関連の成長製品です（事業の内容・経営方針に印字）。
- terms: 助言: 用語「オイルテンパー線」は、焼入れ・焼戻しを施した高強度の鋼線で、弁ばね等の材料となる当社の材料関連製品です（事業の内容に印字）。
- terms: 助言: 用語「特定子会社」は、資本金が親会社の資本金の10％以上である子会社などを指す開示上の区分で、当社ではSUNCALL AMERICA INC.等が該当します（関係会社の状況に印字）。

## 要確認（status に反映）

- businessModel: 連結子会社のSUNCALL (Tianjin) Co.,Ltd.（中国・天津市、自動車関連製品の製造及び販売）は2025年5月に清算決議を行った（沿革に印字）。2026年3月31日時点では連結子会社として関係会社の状況に列挙されており、本登録は2026年3月31日時点のグループ構成で行う。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
