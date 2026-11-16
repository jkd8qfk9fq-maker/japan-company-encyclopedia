# ノイルイミューン・バイオテック — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ノイルイミューン・バイオテック株式会社 |
| 証券コード | 4893 |
| docID（データを取り出した文書） | `S100XSP4` |
| 原本 docID | `S100XSP4` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSP4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ノイルイミューン・バイオテック株式会社 / 4893 / docID S100XSP4（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
noile-immune-biotech: 10 件の数値を有報XBRLと照合
有報: ノイルイミューン・バイオテック株式会社 有価証券報告書－第11期(2025/01/01－2025/12/31) (docID S100XSP4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
noile-immune-biotech: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: PRIME技術は、山口大学及び有限会社山口ティー・エル・オーからサブライセンス権付き独占実施許諾を受けて導入したものである（2015年10月）。このツリーのスキーマには suppliers キーがないため、本文ではなくここに記録した。
- businessModel: 主要な経営指標等の推移の注記３及び注記８（事業収益を計上するものの費用が上回り当期純損失であること、営業活動によるキャッシュ・フローがマイナスであること）は表示上の事項として warnings のみとした。注記２は収益認識基準の適用として financialNotes に、注記12は自社の株式分割として financialNotes と needsReview に記録した。その他の注記は表示事項のみである。
- businessModel: 武田薬品工業とのライセンス契約は2024年６月に解消され、NIB102及びNIB103は当社に返還されている（沿革の注記）。現在の契約ではないため relatedCompanies には結んでいない。
- businessModel: 事業収益の相手先は、販売実績の表で第一三共株式会社のみが印字されている（2025年12月期は全額）。金額と割合は relatedCompanies の説明文には書いていない。
- businessStructure: 単一セグメント（がん免疫療法創薬事業）のため、セグメント別の金額は開示されていない。事業の内訳として【事業の内容】が示す二つの事業モデル（自社創薬・共同パイプライン）を children とし、いずれも金額は書いていない。
- businessStructure: 本社（東京都港区、従業員15名）、湘南研究所（神奈川県藤沢市、同4名）、山口大学院研究所（山口県宇部市、同4名）はいずれも単一セグメントの施設であり、特定の事業モデルには結びつけていない。
- businessStructure: このツリーのスキーマには suppliers キーがないため、仕入先は書いていない。PRIME技術は山口大学及び有限会社山口ティー・エル・オーから独占的に導入したものであることは businessModel の warnings に記録した。
- history: 沿革の注記によれば、武田薬品工業とのライセンス契約は2024年６月に解消されており、NIB102及びNIB103は当社に返還されている。沿革の行としては印字されていないため history には入れず、この warnings と relatedCompanies の warnings に記録した。
- history: 2015年９月の山口大学との共同研究契約と国立がん研究センターとの共同研究契約は、同じ年の出来事として一つの項目にまとめた。
- industry: 主たる業界は pharmaceuticals とした。単一セグメントのがん免疫療法創薬事業は、遺伝子改変免疫細胞療法の医薬品としての研究開発であり、閉じた分類の医薬品に当たるためである。閉じた分類に当てはまるため、暫定分類と taxonomyGaps は使っていない。
- relatedCompanies: chugai-pharmaceutical（中外製薬株式会社）: 重要な契約等に2022年８月20日のライセンス契約が印字され、共同パイプライン（CHUG01）として現在の事業に含まれているため business-partner とした。取引の向きはライセンス供与だが、契約先としての関係を表すため business-partner とした（金額は書いていない）。
- relatedCompanies: daiichi-sankyo（第一三共株式会社）: 販売実績の表に主な相手先として印字されているため customer とした。金額と割合は説明文に書いていない。
- relatedCompanies: shibuya（澁谷工業株式会社）: 事業の内容に遺伝子改変免疫細胞の自動製造システムに関する共同開発が印字されているため business-partner とした。
- relatedCompanies: takara-bio（タカラバイオ株式会社）: 2024年９月の業務提携契約に基づきNIB103を共同開発している実体は印字されているが、関連企業候補データで listing が「上場」となっていないため結ばなかった。finalize の確認対象になるためである。
- relatedCompanies: takeda-pharmaceutical（武田薬品工業株式会社）: 2017年の共同研究開発提携と2018年のNIB102及びNIB103のライセンス契約は沿革に印字されているが、同契約は2024年６月に解消され、両パイプラインは当社に返還されている。現在の取引・提携ではないため結ばなかった。
- relatedCompanies: kyowa-kirin（協和キリン株式会社）: NIB101について同社の抗GM2抗体由来の配列を利用した協力が事業の内容に印字されているが、NIB101の第Ⅰ相臨床試験は中止されており、重要な契約等に現在の契約の印字もないため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: 新株予約権の行使期間などの定型文への一致のみで、候補データでもコードリストにない曖昧な一致のため結ばなかった。
- relatedCompanies: step / port / seki / base-4481 / corona / core / creo / daiwa / innovation / lec: いずれも一般語・部分文字列の一致のみ（ステップ＝段階、ポート＝ポートフォリオ、セキ＝セキュリティ、ベース＝データベース、コロナ＝新型コロナウイルス感染症、など）で、当該企業についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: Adaptimmune Limited及びAutolus Limited（PRIME技術のライセンス先。いずれも海外企業の100％子会社）、山口大学・有限会社山口ティー・エル・オー・国立がん研究センター（PRIME技術の導入元・共同研究先）、C4U株式会社とリバーセル株式会社（他家CAR-Tの共同研究先）。いずれも関係の実体は事業の内容・重要な契約等に印字されている。
- terms: 助言: 「PRIME技術」は、同社の基盤技術の名称です。CAR-T細胞にインターロイキン７（IL-7）とCCL19という物質を作らせる遺伝子改変を加えることで、がん組織に免疫細胞を集めて活性化し、固形がんへの効果を高めることを狙っています。
- terms: 助言: 「CAR-T細胞療法」は、患者のT細胞を取り出して、がん細胞を認識する人工の受容体（CAR）の遺伝子を導入し、増やしてから体内に戻すがん免疫療法です。血液がんでは実用化されていますが、固形がんではまだ開発段階です。
- terms: 助言: 「マイルストン収入」は、ライセンス契約で、臨床試験の開始や承認など開発の進み具合に応じて受け取る収入のことです。同社の収益は、契約一時金やロイヤリティとあわせて、こうしたライセンス収入が中心です。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2021年11月11日付で普通株式１株につき５株の株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessStructure: 主要な経営指標等の推移の注記に、2021年11月11日付で普通株式１株につき５株の株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
