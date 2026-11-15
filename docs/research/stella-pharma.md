# ステラファーマ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ステラファーマ株式会社 |
| 証券コード | 4888 |
| docID（データを取り出した文書） | `S100YDYN` |
| 原本 docID | `S100YDYN` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDYN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ステラファーマ株式会社 / 4888 / docID S100YDYN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
stella-pharma: 10 件の数値を有報XBRLと照合
有報: ステラファーマ株式会社 有価証券報告書－第19期(2025/04/01－2026/03/31) (docID S100YDYN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
stella-pharma: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aの利益の金額や増減理由は本文に書いていません。売上高の減少理由（前事業年度に計上された海外向け売上高が当期はなかったこと）は印字どおりに書きました。
- businessModel: 2025年9月に主要な製造委託先が準自己破産し、製造体制の見直しを行ったこと、2025年10月に新たな国内製造委託先と製造技術移管に関する開発委受託契約を締結したことがMD&Aに記載されています。期中の製造体制の見直しであり、2026年3月31日現在の構成への影響はないため、warnings に留めました。
- businessModel: 重要な後発事象として、第三者割当による新株式及び新株予約権の発行プログラムに基づく発行（第1回は2026年4月16日、第2回は同年6月22日に払込完了）が記載されています。期間後の資本政策の実施であり、2026年3月31日現在の構成に影響しないため、warnings に留めました。
- businessModel: 経営指標等の注記は、連結財務諸表を作成していないこと、関連会社を有していないこと、配当を実施していないこと、当期純損失のため1株当たり情報等を記載していないこと、上場時期に関する注記など表示事項のみのため、financialNotes は設けていません。
- businessModel: wikipedia.json は「日本の企業一覧 (医薬品)」の記事で、補足に使える当社固有の事実がないため出典に加えていません。
- businessStructure: 単一セグメント（医薬品開発事業）のため children は設けていません。関連情報では、単一の製品区分の外部顧客への売上高が売上高の90％を超えるため製品及びサービスごとの情報の記載が省略されており、区分ごとに独立した金額は印字されていません。
- businessStructure: 設備の本社（大阪市中央区）と研究所（堺市中区、さかい創薬研究センター）はいずれも単一セグメントに属するため、特定の事業への結び付けは行っていません。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略しました。原料の高純度B-10は、その他の関係会社であるステラケミファ株式会社が製造し、独占的売買取引に係る契約で調達しています（relatedCompanies に記録）。
- history: 沿革のうち、臨床試験の開始・終了、増資、研究所の移設、個別の治験契約や共同研究契約の締結、海南BNCTセンターでの治療開始などは、主要な節目として選んだ出来事以外は省略しました。
- history: 2020年の承認取得と販売開始は同じ年の別の出来事として分けています。資本金の金額は沿革に書いていません。
- industry: 主たる業界は単一セグメントである医薬品開発事業（BNCT用ホウ素薬剤の開発・製造・販売）から pharmaceuticals を選びました。DEIの別記事業はCTEですが、事業の実態は医薬品の開発・製造販売であるため、閉じた分類の医薬品がそのまま合います。
- relatedCompanies: stella-chemifa: 【関係会社の状況】に「その他の関係会社」として印字され、議決権の被所有割合33.66％（2026年3月31日現在）と、当社医薬品の原材料の製造が関係内容に記載されています。重要な契約等にも原材料の独占的売買取引に係る契約が記載されているため結びました。
- relatedCompanies: mitsubishi-chemical-group: 【沿革】に2023年11月の共同研究契約締結の記載のみで、重要な契約等への記載がなく、現在の取引関係の継続が本文から確認できないため結びませんでした（出来事としては沿革の主要な節目からも外しました）。
- relatedCompanies: suzuken: 【沿革】に2020年10月の第三者割当増資の引受先としての記載のみで、現在の取引は印字されていないため結びませんでした。
- relatedCompanies: core: 「テストスコア」等の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: lec: 「フレックスタイム制度」の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: base-4481: 「コンビネーションプロダクトをベースとしている」の一般語の一致のみのため結びませんでした。
- relatedCompanies: cover: 「保険契約でカバーされる」の一般語の一致のみのため結びませんでした。
- relatedCompanies: en: 「エンゲージメント」の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: fuji-8278: 沿革の相手先は株式会社フジタであり、候補の株式会社フジとは別の法人のため結びませんでした。
- relatedCompanies: land: 「イメージ・ブランド」の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: nissin: コードリストにない相手で、新株予約権の定型文中の一致のみのため結びませんでした。
- relatedCompanies: oro: PET薬剤の化学物質名中の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: ray: 「レイアウト変更」の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: seki: 「セキュリティ」の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: 候補にない相手: 住友重機械工業株式会社（加速器メーカーとして共同開発・パートナーシップ契約の相手先）、株式会社エス・ディ・コラボ（2026年3月期の販売先）、株式会社CICS（治験の契約相手先）は related-candidates.json にないため結んでいません。
- terms: 助言のみ。本文で使った用語の候補: BNCT（ホウ素中性子捕捉療法）、ボロファラン（10B）、LAT-1（L型アミノ酸トランスポーター1）、先駆け審査指定制度、希少疾病用医薬品、FBPA-PETです。
- terms: wikipedia.json は「日本の企業一覧 (医薬品)」の記事で補足に使える事実がないため、出典には加えていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
