# 東京鐵鋼 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東京鐵鋼株式会社 |
| 証券コード | 5445 |
| docID（データを取り出した文書） | `S100YJ6R` |
| 原本 docID | `S100YJ6R` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ6R.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東京鐵鋼株式会社 / 5445 / docID S100YJ6R（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-tekko: 10 件の数値を有報XBRLと照合
有報: 東京鐵鋼株式会社 有価証券報告書－第98期(2025/04/01－2026/03/31) (docID S100YJ6R)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tokyo-tekko: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象として印字された自己株式の取得（2026年5月7日の取締役会決議、取得期間2026年5月11日から6月30日）は資本政策の事項のため、needsReview ではなく warnings にとどめました。
- businessModel: businessModel.suppliers は省きました。調達については主原料が鉄スクラップである旨の記載と特定投資株式の個別社名の印字だけで、仕入先の一般名詞の区分は印字されていないためです。
- businessModel: 目標とする経営指標の数値（連結の利益水準や自己資本の比率）は比率・利益の数値のため本文に書かず、方針の要約だけを perspectives に書きました。
- businessModel: 鉄鋼事業の減損損失228百万円は売上高・当期純利益ではないため、本文の金額には書きませんでした。
- businessModel: 持分法適用関連会社の株式会社伊藤製鐵所の単体数値（売上高等）は単一会社の数値のため本文に書かず、関係は history と warnings に記録しました。
- businessModel: Wikipediaの記事「東京鐵鋼」はありましたが、冒頭の記述は有報の記載と重なる内容のため、出典に加えていません。
- businessStructure: セグメントの金額はセグメント注記の外部顧客への売上高を使いました。MD&Aのセグメント別売上高は内部売上高を含み（鉄鋼事業71,603百万円、その他4,767百万円）、外部売上高と異なるため使いませんでした。
- businessStructure: 鉄鋼事業71,575百万円とその他964百万円の合計は72,539百万円で、連結売上高72,540百万円と1百万円異なります。有報の印字どおりに記載し、差は warnings に残しました。
- businessStructure: 持分法適用関連会社の株式会社伊藤製鐵所は自社グループの会社のため、事業の区分には含めていません。
- history: 【沿革】のうち、製鋼工場・圧延工場の個別の完成、ISO認証の取得、営業所や事業所の開設・移転、清算した子会社などの細目は理由を残して省き、設立・上場・拠点・提携・合併の節目を残しました。
- history: 【沿革】に資本金の額は印字されておらず、書いていません。
- industry: 主たる業界は chemicals を暫定で選択しました。事業の中心は鉄鋼事業（2026年3月期の外部顧客への売上高71,575百万円）で、その他（貨物運送・メンテナンス）は964百万円と小さいため、第二の業界は付けませんでした。
- relatedCompanies: 候補 hanwa（阪和興業株式会社）は主要な顧客ごとの情報の印字に基づき customer として結びました。
- relatedCompanies: 伊藤忠丸紅住商テクノスチール株式会社は最大の主要な顧客ですが、関連候補に無く、上場会社として百科事典の対象に確認できないため結ばず、industryPosition に記録しました。
- relatedCompanies: エムエム建材株式会社も主要な顧客ですが、関連候補に無く同様に結びませんでした。
- relatedCompanies: 候補 marubeni（丸紅株式会社）: 一致は伊藤忠丸紅住商テクノスチール株式会社の社名の一部で、丸紅自体との取引・提携の印字はありません。
- relatedCompanies: 候補 mebuki-financial-group（三井住友フィナンシャルグループ、the-tochigi-bank も同じ）: 特定投資株式の保有目的は資金調達を中心とした金融取引で、資金調達のみのため結びませんでした。
- relatedCompanies: 候補 nireco（株式会社ニレコ）: 保有目的は製鋼・圧延工程における制御装置等の「購入候補先」で、実際の取引の印字がないため結びませんでした。
- relatedCompanies: 候補 trust（株式会社トラスト）: 一致は日本マスタートラスト信託銀行（信託口）の信託口表記で、コードリストにない相手です。
- relatedCompanies: 候補 en、career、path、base-4481、core、nikko-6306: 一般語や文章中の部分一致で、同社への言及ではありません。
- relatedCompanies: 株式会社伊藤製鐵所は持分法適用関連会社（自社グループの会社）であり非上場のため、関連企業には結んでいません。資本業務提携と原材料の共同購買の関係は history と businessModel の warnings に記録しました。
- relatedCompanies: 連結子会社8社と非連結子会社2社は自社グループの会社のため、関連企業には結んでいません。
- relatedCompanies: 第一生命ホールディングス株式会社は年金運用の取引先ですが、関連候補に無いため結びませんでした。
- terms: 助言: 『ネジテツコン』は同社のネジフシ鉄筋の製品名で、有報の沿革と経営方針に主力製品として印字されています。本文では鉄筋の機械式継手と併せて説明しました。
- terms: 助言: 『電炉』は鉄スクラップを電気炉で溶かす製鋼方式を指し、有報は当社の属する業界を「電炉小棒業界」と呼んでいます。本文では電気炉で製造する旨を併記しました。

## 要確認（status に反映）

- businessModel: 2026年4月1日付で普通株式1株につき3株の割合で株式分割を実施しました。株式数に関する指標は第94期（2022年3月期）の期首に当該分割が行われたと仮定して算定されています。登録は2026年3月31日現在の構成に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 東京鐵鋼の主たる業界 → 提案: 鉄鋼・金属素材（合金鉄、特殊鋼、非鉄金属などの素材メーカー）。有報の事業の中心は、鉄スクラップを主原料とする電気炉による鉄筋コンクリート用棒鋼などの製造・販売であり、化学品の会社ではない。閉じた分類（INDUSTRY_IDS）に鉄鋼・素材を表す区分が無く、掲載済みの日本製鉄（nippon-steel）や愛知製鋼（aichi-steel）、新日本電工（nippon-denko）が素材のバケットとして chemicals を使っている先例に揃えて暫定にした。
