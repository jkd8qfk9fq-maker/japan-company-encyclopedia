# 藤田エンジニアリング — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 藤田エンジニアリング株式会社 |
| 証券コード | 1770 |
| docID（データを取り出した文書） | `S100YGU7` |
| 原本 docID | `S100YGU7` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGU7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 藤田エンジニアリング株式会社 / 1770 / docID S100YGU7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fujita-engineering: 10 件の数値を有報XBRLと照合
有報: 藤田エンジニアリング株式会社 有価証券報告書－第63期(2025/04/01－2026/03/31) (docID S100YGU7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
fujita-engineering: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨てて記載した（連結売上高29,769百万円、親会社株主に帰属する当期純利益1,840百万円）。切り捨ての方針はここに記録する。
- businessModel: businessModel に suppliers は書いていない（このツリーのスキーマに無いキー）。仕入に関する事実として、機器販売及び情報システム事業において株式会社日立製作所と特約店契約を締結し、同社のグループ会社が主要な仕入先である旨が株式の保有状況に印字されており、関連企業と businessStructure の文脈に記録した。
- businessModel: financialNotes は空：前期有報との修正再表示チェックは全系列で差異ゼロ、決算期変更・変則決算の印字はなく、summary の irregularPeriods は空である。前期に電子部品製造事業で減損損失が計上された事実は5年表の数値の注記には当たらないため financialNotes には書いていない。
- businessModel: 中期経営計画の経営目標（連結売上高350億円、連結経常利益30億円、ROE8％以上、総還元性向30％以上）は利益指標・投資指標であるため本文・戦略には書かず、ここに記録する。
- businessModel: 建設事業の受注高（22,235百万円）などの受注高の金額は本文の数値として使っていない。
- businessModel: セグメントの売上高はセグメント注記の外部顧客への売上高を用いた。MD&Aのセグメント別売上高はセグメント間取引消去前の金額であり、本文には使っていない。
- businessModel: 株式会社群工の全株式取得（2025年5月14日、みなし取得日2025年6月30日）は当期中に完了し期末の体制に反映されているため needsReview ではなく沿革と warnings に記録した。
- businessModel: 提出後の重要な後発事象は連結・個別とも「該当事項はありません」と印字されており、後発事象に関する needsReview はない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（建設14,692百万円、機器のメンテナンス7,154百万円、機器販売及び情報システム6,625百万円、電子部品製造1,296百万円）。MD&Aのセグメント別売上高はセグメント間取引消去前の金額であるため使っていない。
- businessStructure: 金額は有報の千円印字を百万円に切り捨てて記載した。切り捨て後のセグメント外部売上高の合計は29,767百万円で、印字の連結売上高29,769百万円と2百万円差がある（切り捨てによる差）。印字の合計をそのまま引用し、差はここに記録する。
- businessStructure: 株式会社群工は2025年5月14日付で全株式を取得し連結子会社化した（みなし取得日2025年6月30日）。当期中に完了し期末の体制に反映されているため、事業の内容・関係会社の状況の印字どおり建設事業に含めた。
- history: 沿革の1964年の設立行に印字された資本金の金額は、規則により沿革に書いていない。
- history: 沿革の表は年月と事象が連続して印字されており、年月と事象の数は一致したため行順で対応づけた。
- history: 株式会社群工の子会社化は2025年5月に当期中完了し期末の体制に反映されているため沿革に記録した（needsReview ではない）。
- history: システムハウスエンジニアリングは2008年に子会社化し2020年に全株式を譲渡済みのため、現在の事業構成には含めていない。
- industry: 建設事業が外部売上高の約半分を占め、機器のメンテナンス事業も空調設備等の営繕・保守であり設備工事に連なるため、主たる業界を construction とした。電子部品製造事業は報告セグメントとして独立開示されており、半導体の受託加工も含まれるが、セグメントの中核は電子部品の製造・加工であるため electronics を第二の業界とした。機器販売及び情報システム事業は販売・開発が中心で、独立した金額開示はあるが業界は追加していない。閉じた分類の範囲で対応づけられており、分類の不足はない。
- relatedCompanies: taiyo-yuden、yamato、nippon-kayaku、sata-construction、gun-ei-chemical-industry は、特定投資株式の保有目的が会社ごとに個別化され、工事等を請け負う事業分野が具体的に印字されているため customer として結んだ。説明には計上額を書いていない。
- relatedCompanies: hitachi は、機器販売及び情報システム事業において同社と特約店契約を締結している印字があり、同社のグループ会社が主要な仕入先とされていることから supplier として結んだ。
- relatedCompanies: 株式会社SUBARUは特定投資株式として、建設事業、機器のメンテナンス事業、機器販売及び情報システム事業において工事やシステム開発等を請け負う主要な取引先である旨が個別に印字されているが、related-candidates に無いため結ばなかった。事実はここに記録する。
- relatedCompanies: the-gunma-bank（株式会社群馬銀行）は特定投資株式の保有目的が主要取引銀行としての取引関係の維持・強化であり、資金調達等の金融機関関係であるため結ばなかった。大株主の状況にも4.36％（2026年3月31日現在）で載っているが、金融機関の純投資・取引銀行関係として同様に結ばない。
- relatedCompanies: sumitomo-mitsui-financial-group は特定投資株式の保有目的が主要取引銀行としての関係維持・強化であり、金融機関関係であるため結ばなかった。
- relatedCompanies: hikari-tsushin は、大株主の状況に印字されているのが「光通信KK投資事業有限責任組合」（所有株式数の割合2.58％）であり、株式会社光通信そのものではなく別法人であるため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group、nomura-holdings、mizuho-financial-group、sumitomo-mitsui-trust-group、aeon、ana-holdings、eneos-holdings、japan-post-insurance、zensho-holdings は、満期保有目的の債券（劣後債・社債型種類株式）の発行体としてのみ登場し、取引・提携の記載がないため結ばなかった。
- relatedCompanies: en、base-4481、career、path、seki、freee は一般語・部分一致（エンジニアリング、時価ベース、キャリアパス、情報セキュリティ、フリーアドレス）で、相手企業への言及ではないため結ばなかった。
- terms: 助言のみ：建築に付帯する電気・空調・給排水などの設備工事を指す『建築付帯設備工事』、建物や設備の修繕・維持管理を指す『営繕』、工場の生産自動化を指す『ファクトリーオートメーション』、メーカーの代理店として製品を販売する契約を指す『特約店契約』、他社から加工を請け負う『受託加工』は、この会社の解説で読者がつまずきやすい語として用語候補に挙げる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
