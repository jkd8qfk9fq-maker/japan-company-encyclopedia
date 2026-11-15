# ツバキ・ナカシマ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ツバキ・ナカシマ |
| 証券コード | 6464 |
| docID（データを取り出した文書） | `S100XTLM` |
| 原本 docID | `S100XTLM` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTLM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ツバキ・ナカシマ / 6464 / docID S100XTLM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tsubaki-nakashima: 10 件の数値を有報XBRLと照合
有報: 株式会社ツバキ・ナカシマ 有価証券報告書－第20期(2025/01/01－2025/12/31) (docID S100XTLM)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tsubaki-nakashima: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2024年2月の取締役会で決議したボールねじ及びボールウェイ事業のミネベアミツミ株式会社への譲渡は、2025年10月3日に完了し、TNリニアモーション株式会社（現・ミネベアリニアモーション株式会社）及びTN TAIWAN CO., LTD.の株式が譲渡された。期中に完了し期末のグループ構成（連結子会社20社）に反映されている事象のため、needsReview ではなく沿革とこの warnings に記録した。非継続事業への分類の表示上の扱いは financialNotes に記した。
- businessModel: 後発事象として印字された連結子会社TN INDIA PRIVATE LIMITEDへの増資（2026年3月16日決議、2026年4月払込予定）はグループ内の資本増強であり、グループ構成に変更はないため warnings に留めた。
- businessModel: 2025年12月期の財務活動によるキャッシュ・フローに自己株式の取得による支出が印字されているが、通常の資本政策のため warnings に留めた。
- businessModel: 中期経営計画の2029年12月期の目標指標（売上収益額・利益額）は将来に関する事項のため、本文には転記せず方針の要約のみとした。
- businessModel: セグメント利益・損失の金額、棚卸資産評価損や減損損失の金額は本文に書いていない（本文の金額は売上収益と当期純利益・損失のみ）。
- businessModel: TN ITALY, S.P.A.、TN TAICANG CO., LTD.、TN TENNESSEE, LLC.の主要な損益情報等（単体数値）は本文に転記していない。
- businessModel: wikipedia.json は found=true だが、抜粋は本社所在地等の最小限の情報で有報の記載を超える内容がないため、wikipedia の出典は追加していない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上収益の大きい順（プレシジョン・コンポーネントビジネス68,925百万円、ブロア・リアルエステイトビジネス912百万円）とした。
- businessStructure: 連結子会社は全て海外の20社（TN AMERICAS HOLDINGS, INC.、TN GEORGIA, INC.、TN MICHIGAN, LLC.、TN AMERICAS INTERNATIONAL, INC.、TN TENNESSEE, LLC.、TN POLSKA Sp. z o.o.、TN EUROPE, B.V.、TN EUROPE INTERNATIONAL, B.V.、TN ITALY, S.P.A.、Rispa S.r.l.、TN SLOVAKIA, s.r.o.、TN BOSNIA DOO KONJIC、TN TAICANG CO., LTD.、TN CHONGQING CO., LTD.、TN KUNSHAN CO., LTD.、KUNSHAN TN TRADING CO., LTD.、TN INDIA PRIVATE LIMITED、TN UNITED KINGDOM, LTD.、TN RAYONG LTD.、TN ASIA PTE. LTD.）で、持分法適用関連会社の記載はない。【関係会社の状況】の印字どおり。
- businessStructure: TN ITALY, S.P.A.、TN TAICANG CO., LTD.及びTN TENNESSEE, LLC.は売上収益の割合が10％を超える特定子会社だが、単体の主要な損益情報等は本文に書かず事業の位置付けのみを記した。
- history: 沿革のうち、本社・工場・営業所の移転や開設・閉鎖、子会社の設立・閉鎖の細目（台湾・インド・シンガポール・英国・タイ拠点の設立、TN KOREA PTE.LTD.の閉鎖等）は、主要な転機以外を省いた。資本参加や株式の追加取得の細目も同様に省いた。
- history: 1954年の椿本鋼球製造株式会社への商号変更、1968年の株式会社椿本精工への商号変更は、現在の社名に至る途中の変更として省いた。
- history: 2012年11月の決算期変更（3月31日から12月31日へ）は事業の転機ではないため省いた。
- history: 設立時・子会社設立時の資本金額は沿革に書かない規則に従い記載していない（1970年の椿薬品工業株式会社の設立行など）。
- history: 2024年2月の椿鋼球株式会社の吸収合併は、完全子会社の吸収合併であり事業構成の転機ではないため省いた。
- industry: 主力事業はベアリングの構成部品である精密ボールや精密ローラーの製造販売であり、軸受メーカーの分類（日本精工は machinery を主たる業界とする）に倣い machinery を主たる業界とした。製品の最終用途には自動車が多いため automotive を第二の業界とした。
- industry: ブロア・リアルエステイトビジネス（送風機・不動産賃貸）は外部顧客への売上収益の約1.3％と小さく、独立した業界は付けていない。
- relatedCompanies: minebea-mitsumi: 特定投資株式として8,820株を保有するが、保有目的の印字は不二越と同一の定型文（ベアリング用精密ボールの販売等、安定的・長期的な取引関係の維持強化）であり、それだけでは結ばなかった（koa の先例）。ボールねじ及びボールウェイ事業の株式譲渡（2024年2月契約締結、2025年10月に完了）は一過性の事業譲渡取引であり、継続的な提携や取引の関係を示すものではないため結ばなかった。譲渡の事実は沿革と businessModel の warnings に記録した。
- relatedCompanies: nachi-fujikoshi: 特定投資株式として3,661株を保有するが、保有目的の印字がミネベアミツミと同一の定型文のみで、具体的な提携や取引の内容の記載がないため結ばなかった。
- relatedCompanies: nikkato: 当事業年度に株式数が増加した銘柄として印字があるのみで、保有目的など関係の内容の記載がないため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）は大株主の名義・保管名義であり、信託口は関連企業として結ぶ対象ではない。
- relatedCompanies: daiwa: 沿革中の地名「大和郡山市」の部分一致であり、同社との関係の記載がないため結ばなかった。
- relatedCompanies: hikari-tsushin: ガラスボールの用途である「光通信用」の語の部分一致であり、同社との関係の記載がないため結ばなかった。
- relatedCompanies: caster, hub: 製品用途の一般語（キャスター、ハブベアリング）の部分一致であり、会社としての関係の記載がないため結ばなかった。
- relatedCompanies: zero, vision, path, step, base-4481, freee, innovation, land, port, ray, rent, ricoh, en, shift, systems-engineering-consultants, imura-and-co, kohsoku, value-creation: いずれも一般語・部分一致（ビジョンゼロ、経営計画の「バリュークリエーション」、フリー・キャッシュ・フロー、時価ベース、SHIFT施策等）であり、同社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: アドバンテッジアドバイザーズ株式会社は【重要な契約等】に事業提携契約が印字されているが、非上場会社で関連候補に無く、EDINETコードリストで確認できないため結ばなかった。
- relatedCompanies: 大株主は信託銀行の信託口や資産運用会社等の名義が中心で、事業会社による大株主の印字はない。当社グループの連結子会社20社は関連企業として結ぶ対象ではない。
- terms: 助言: 用語「プレシジョン・コンポーネントビジネス」は、同社の報告セグメントの名称で、精密ボール、精密ローラー、リテーナー及びシートメタル部品の製造販売を行う事業。事業の内容の節に印字されている。
- terms: 助言: 用語「非継続事業」は、譲渡等により分離された事業区分で、同社ではボールねじ及びボールウェイの製造及び販売事業が第19期から非継続事業に分類され、2025年10月にミネベアミツミ株式会社への譲渡が完了した。主要な経営指標等の注記に印字されている。
- terms: 助言: 用語「MEBO」はマネジメント・エンプロイー・バイアウトの略で、経営陣と従業員による買収。同社は2007年にMEBOを実施して非上場化し、2015年に再上場した。沿革の節に印字されている。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、連結子会社TN GEORGIA, INC.の遊休地（米国ジョージア州の土地19エーカー）の譲渡が印字されている。2026年2月18日の取締役会で決議し、同日付で売買契約を締結して物件を引き渡した。譲渡益の金額は2026年12月期の決算で計上される見込みの金額のため本文には転記していない。登録は2025年12月31日現在の構成に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
