# モリテックスチール — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | モリテックスチール株式会社 |
| 証券コード | 5986 |
| docID（データを取り出した文書） | `S100YGQQ` |
| 原本 docID | `S100YGQQ` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGQQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | モリテックスチール株式会社 / 5986 / docID S100YGQQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
molitec-steel: 10 件の数値を有報XBRLと照合
有報: モリテックスチール株式会社 有価証券報告書－第85期(2025/04/01－2026/03/31) (docID S100YGQQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
molitec-steel: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「モリテック スチール株式会社」が EDINET の提出者名「モリテックスチール株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は、セグメント注記と連結経営指標等の千円単位の印字を百万円単位に切り捨てて転記しました（切り捨て convention）。MD&Aに億円単位で印字された金額は本文には使っていません。
- businessModel: 4セグメントの外部顧客への売上高の合計は48,191百万円となり、印字された連結売上高48,192百万円と1百万円異なりますが、印字の値をそのまま引用しました。
- businessModel: 中期経営計画の数値目標（2030年3月期の目標値など）は、本文の財務数値は売上高と当期純利益だけとする規則のため、perspectives の disclosed には転記せず、この warnings に記録しました。
- businessModel: 前期有報との修正再表示チェックは全系列で一致し、変則決算や決算期変更もないため、financialNotes は空にしました。
- businessModel: 重要な後発事象は、連結・個別ともに該当事項なしと印字されています。
- businessStructure: 事業名はセグメント注記の印字どおり「商事部門」「鈑金加工品部門」「海外事業」「焼入鋼帯部門」とし、外部顧客への売上高の大きい順に並べました。
- businessStructure: 金額はセグメント注記の千円単位の印字を百万円単位に切り捨てて転記しました（切り捨て convention）。4セグメントの外部顧客への売上高の合計は48,191百万円となり、印字された連結売上高48,192百万円と1百万円異なりますが、印字の値をそのまま引用しました。
- businessStructure: 連結子会社8社の資本金又は出資金の金額は書いていません。
- businessStructure: 事業の内容には子会社9社とあり、連結子会社として8社が列挙され、非連結子会社1社は重要性が乏しいため記載を省略すると注記されています。
- history: 沿革の各行は年月まで印字されていますが、history の形に月は書けないため年に畳み、月は description に残しました。
- history: 1950年の法人化の行に印字された資本金の金額は書いていません。
- history: Wikipedia の補足（ベーナイト鋼帯の量産化が日本初である旨など）は、沿革の印字で足りるため使っていません。
- industry: 主たる業界は、特殊帯鋼などの鋼材の販売と焼入鋼帯・鈑金加工品の製造販売が事業の中心であることから決めましたが、閉じた分類に鉄鋼・金属素材を表す区分がないため、掲載済みの日本製鉄（nippon-steel）などが素材のバケットとして chemicals を使っている先例に揃えて chemicals（暫定）としました。化学品の会社ではありません。
- industry: 商事部門が外部顧客への売上高の最も大きな報告セグメントですが、扱う商品は鋼材であり、独立した商社事業として開示されているわけではないため、trading は付けていません。
- relatedCompanies: 第一金属株式会社: セグメント情報の主要な顧客ごとの情報に載る販売先ですが、百科事典に企業ファイルがなく related-candidates.json にもないため結んでいません。
- relatedCompanies: ジヤトコ株式会社: セグメント情報の主要な顧客ごとの情報に載る販売先ですが、百科事典に企業ファイルがなく related-candidates.json にもないため結んでいません。
- relatedCompanies: 日鉄物産株式会社: 事業等のリスクに、主として同社より多くの鋼材を仕入れていると印字される実際の仕入先ですが、百科事典に企業ファイルがなく related-candidates.json にもないため結んでいません。その親会社側の日本製鉄（nippon-steel）は別法人であり、大株主としての関係で結びました。
- relatedCompanies: 株式会社今仙電機製作所（imasen-electric-industrial）: 前連結会計年度の主要な顧客ごとの情報には載りますが、当連結会計年度の主要な顧客には載らず、当期の根拠は特定投資株式の保有目的の定型的な文言だけのため結んでいません。
- relatedCompanies: 株式会社クボタ（kubota）、トピー工業株式会社（topy-industries）、株式会社日阪製作所（hisaka-works）、バンドー化学株式会社（bando-chemical-industries）、日亜鋼業株式会社（nichia-steel-works）、象印マホービン株式会社（zojirushi）、株式会社島精機製作所（shima-seiki-mfg）、三菱自動車工業株式会社（mitsubishi-motors）: 特定投資株式の保有目的に販売先・仕入先等の役割が印字されますが、いずれも同じ定型の保有目的の文言だけが根拠で、主要な顧客ごとの情報など独立した取引の印字がないため結んでいません。
- relatedCompanies: 三菱商事株式会社（mitsubishi-corporation）: 特定投資株式の保有目的は同社の関係会社が主要な仕入先であることで、取引の相手方は関係会社側であり、別法人のため結んでいません。
- relatedCompanies: 株式会社三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group）、株式会社みずほフィナンシャルグループ（mizuho-financial-group）、株式会社りそなホールディングス（resona-holdings）: 特定投資株式の保有目的はいずれも取引金融機関としての関係維持であり、資金調達の文脈のみのため結んでいません。
- relatedCompanies: 株式会社T＆Dホールディングス（t-and-d-holdings）: 特定投資株式の保有目的は取引保険会社としての関係維持であり、保険取引が理由のため結んでいません。
- relatedCompanies: パナソニックホールディングス株式会社（panasonic-holdings）、シャープ株式会社（sharp）: 特定投資株式は当事業年度中に全量売却されており、保有が終了しているため結んでいません。
- relatedCompanies: ランド（land）、キャリア（career）、エン（en）、ポート（port）、セキ（seki）、ベース（base-4481）、アスカ（aska）、コア（core）、リード（the-lead）: 一般語や地名・住所などの部分一致で、その相手について取引・提携・資本関係を述べた箇所はないため結んでいません。
- relatedCompanies: 当社グループの連結子会社8社（ジュタワン・モリテック（タイランド）株式会社、モリテックスチールインドネシア株式会社、モリテックスチールメキシコ株式会社、上海摩立特克鋼鉄商貿有限公司、日輪鋼業株式会社、モリテックスチール（ベトナム）会社、中川産業株式会社、株式会社サンド）は、当社グループの会社であるため結んでいません。
- relatedCompanies: 関連会社の説明には金額を書いていません（持株比率と基準日のみ）。特定投資株式の貸借対照表計上額も書いていません。
- terms: 助言: 用語「焼入鋼帯」は、特殊帯鋼を熱処理して硬くした帯状の鋼材で、当社の焼入鋼帯部門の製品です（事業の内容・沿革に印字）。
- terms: 助言: 用語「ベーナイト鋼帯」は、ベーナイト組織を持つ焼入鋼帯で、1966年に量産工業化に成功したと沿革に印字されています。
- terms: 助言: 用語「みがき特殊帯鋼」は、表面を磨いた特殊帯鋼で、商事部門が扱う特殊帯鋼の一種です（事業の内容に印字）。
- terms: 助言: 用語「コードリール」は、鈑金加工品部門が製造販売する鈑金加工品の一例で、ゼンマイと並んで印字されています（事業の内容に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] モリテックスチールの主たる業界 → 提案: 鉄鋼・金属素材（steel-and-metals など）。事業の中心は特殊帯鋼などの鋼材の販売と、焼入鋼帯・鈑金加工品の製造販売で、化学品の会社ではない。閉じた集合に鉄鋼・素材を表す区分が無く、掲載済みの日本製鉄（nippon-steel）が素材のバケットとして chemicals を使っている先例に揃えて暫定にした。
