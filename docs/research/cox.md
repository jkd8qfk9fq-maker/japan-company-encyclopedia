# コックス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社コックス |
| 証券コード | 9876 |
| docID（データを取り出した文書） | `S100Y54S` |
| 原本 docID | `S100Y4RA` |
| 提出日（原本） | 2026-05-19 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100Y54S／有効文書 S100Y54S（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y54S.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社コックス / 9876 / docID S100Y4RA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cox: 10 件の数値を有報XBRLと照合
有報: 株式会社コックス 訂正有価証券報告書－第53期(2025/03/01－2026/02/28) (docID S100Y54S)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第53期(2025/03/01－2026/02/28)、docID S100Y54S）を有効文書としてこのパックを作った。原本は docID S100Y4RA。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
cox: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書（S100Y54S、2026年5月20日提出）を有効文書として登録している。パックの分類はrecord-onlyで、財務の数値も本文も原本（S100Y4RA）と同一であり、異なるのはエントリーが引用しない役員の状況のテキストブロックのみであるため、warningsのみとし、出典は訂正報告書に付けている。
- businessModel: 会計方針の変更として、法人税等に関する会計基準等を当連結会計年度の期首から適用している。包括利益に対する課税の計上区分の改正は経過的な取扱いに従い連結財務諸表への影響はないとされ、連結会社間の子会社株式等の売却に関する改正は遡及適用されているが、前期有報との照合では登録した6系列すべてに差異がなかったため、financialNotesには入れずwarningsのみとした。
- businessModel: 経営指標等の注記のうち、潜在株式調整後1株当たり当期純利益を第49期に記載していない理由、自己資本利益率・株価収益率を第49期に記載していない理由、従業員数の定義は表示事項のためwarningsのみとした。
- businessModel: 事業部門別売上高の千円未満切り捨て後の合計は14,954百万円となり、印字された売上高14,955百万円と1百万円の差がある（千円単位の内訳合計14,955,339千円と印字合計14,955,340千円の差による）。印字された合計を採用し、差異はそのまま記録する。
- businessModel: 親会社のイオン株式会社（議決権の被所有割合71.80％）は関連企業の候補に含まれていないためリンクせず、事実はbusinessStructureの説明と本warningsに記録した。主要な顧客ごとの情報は、売上高の10％以上を占める相手先がないため記載が省略されている。
- businessModel: 中期の数値目標や配当政策は投資指標・資本政策に当たるため本文・strategyには書かず、存在のみを記録する。MD&Aの利益項目の金額・理由、セグメント利益は書いていない。
- businessStructure: 当社は衣料品小売業の単一セグメントであり、セグメント情報は記載が省略されている。事業部門別の売上高はMD&Aの販売実績（ikka 13,079,771千円、LBC 1,448,016千円、EC限定ブランド 386,350千円、その他 41,202千円）に基づく。
- businessStructure: 連結子会社はBLUE GRASS (SHANGHAI) CO.,LTD.（中華人民共和国上海市、衣料品小売業、当社100.0％出資）の1社で、上海に店舗1店舗を構える。海外（中国）地域の売上高は27百万円（MD&Aの商品の地域別売上高）である。子会社であるため関連企業にはリンクしていない。
- businessStructure: 親会社はイオン株式会社（千葉市美浜区、純粋持株会社）で、議決権の被所有割合は71.80％（うち間接所有3.72％）。当社はイオングループの専門店事業を営む企業群に属し、期末店舗174店舗のうち113店舗はイオン株式会社の子会社（イオンリテール株式会社他）との賃貸借契約に基づき賃借している。
- businessStructure: suppliers: 商品の調達について、個別の仕入先の名称は有報に印字されていない（調達面では直貿・直商流の推進や取引先の絞り込みが経営方針に記載されるのみ）ため、suppliersキーは付けていない（旧スキーマ）。
- history: 沿革のうち、本社・本店の移転、POSシステムや新ストアシステムの導入、転換社債の発行（資本に関する事項）、主要ブランドのZOZOTOWN出店の個別経緯などは落とし、warningsに記録した。資本金額は沿革に書いていない。
- history: 2010年8月に合併した株式会社ブルーグラスの合併までの沿革（1984年設立、1995年店頭登録、2000年営業譲受、2004年ジャスダック上場）は、合併相手方の沿革であるため項目としては採用せず、合併の事実のみを2010年の項目に記載した。
- history: 市場再編に伴う mechanical な上場市場の変遷（2010年の大阪証券取引所JASDAQへの移行、2013年の東京証券取引所JASDAQ（スタンダード）への移行）は落とした。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 衣料品小売業は閉じた分類（INDUSTRY_IDS）の retail に直接当たるため、暫定分類は付けていない。単一セグメントであり、副次的な業界も付けていない。
- relatedCompanies: 親会社のイオン株式会社（議決権の被所有割合71.80％、大株主表では発行済株式総数に対する所有割合67.78％）は関連企業の候補に含まれていないためリンクせず、事実はbusinessStructureの説明とbusinessModelのwarningsに記録した。
- relatedCompanies: aeon-mall（イオンモール株式会社）: 【事業の内容】で一部の店舗が同社等のショッピングセンターに入居し店舗の賃借取引を行っていることが印字されているが、候補の一覧でコードリストにない分類となっているためリンクせず、賃借の事実はbusinessStructureに記録した。イオンリテール株式会社も非上場で候補にない。
- relatedCompanies: aeon-fantasy（株式会社イオンファンタジー）: 特定投資株式の保有目的「専門店事業における情報収集のため」は、候補にない株式会社ジーフットと同一の文言であり、区分共通の定型句と判断したためリンクしなかった。
- relatedCompanies: ministop（ミニストップ株式会社）、dcm-holdings（DCMホールディングス株式会社）、sumitomo-mitsui-trust-group（三井住友トラストグループ株式会社）: 特定投資株式の保有目的が「取引関係等の円滑化のため」という全銘柄共通の定型句のみのためリンクしなかった。
- relatedCompanies: fuji-8278（株式会社フジ）: 大株主表に1.94％の株主として載るのみで、個別の取引・提携の記載がなく、ambiguousでもあるためリンクしなかった。
- relatedCompanies: land（株式会社ランド）、en（エン株式会社）、members（株式会社メンバーズ）、base-4481（ベース株式会社）、core（株式会社コア）、vision（株式会社ビジョン）、freee（フリー株式会社）、rent（株式会社レント）: ブランド名・一般語・指標の算出方法の記述などへの部分一致のみで、同社についての取引・提携・資本関係の記載はないためリンクしなかった。
- terms: 助言: 「ikka」は同社の基幹ブランドで、ikka、IKKA LOUNGE、CURRENTを区分した事業部門の名称である。「LBC」はLBC、Lbc with Lifeを区分したブランド部門、「EC限定ブランド」はTDC、notch.、NO NEED、VENCE EXCHANGE、VENCE share styleの総称、「TOKYO DESIGN CHANNEL」は公式オンラインストアの名称である。いずれも同社の事業ブランドであり、他社の名称ではない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
