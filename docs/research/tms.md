# ティムス — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ㈱ティムス |
| 証券コード | 4891 |
| docID（データを取り出した文書） | `S100XVBS` |
| 原本 docID | `S100XVBS` |
| 提出日（原本） | 2026-03-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVBS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ㈱ティムス / 4891 / docID S100XVBS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tms: 6 件の数値を有報XBRLと照合
有報: ㈱ティムス 有価証券報告書－第22期(2025/03/01－2025/12/31) (docID S100XVBS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2025-12 の期は 10 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
tms: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社ティムス」が EDINET の提出者名「㈱ティムス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は営業収益と当期純損失のみとした。MD&Aや財務諸表に印字されたその他の金額（研究開発費、販売費及び一般管理費、現金及び預金の残高等）は本文に書かなかった。
- businessModel: 期間後の出来事として、TMS-007（JX10）の日本における最初の被験者への投与が2026年2月に行われたことが事業の内容に印字されている。臨床試験の進捗であり構成の変更ではないため、本文には書かず warnings のみとした。
- businessModel: 2026年1月1日付で、JX09に関する事業化の権利がCORXEL Pharmaceuticals Hong Kong LimitedからCORXEL Pharmaceuticals, Inc.に譲渡されたことが重要な契約等の注記に印字されている。契約相手方側の移転であり当社の構成の変更ではないため、本文には書かず warnings のみとした。
- businessModel: 2025年7月に資本金及び資本準備金の額の減少と欠損填補が行われている。資本政策であり、金額は本文に書かなかった。
- businessModel: 修正再表示の照合では、前期有報と重複する年度の全系列に差異はなかった（証拠パックの記載どおり）。
- businessModel: 証拠パックにWikipediaの抜粋は含まれていなかったため、補足は使わなかった。
- businessStructure: 単一セグメント（医薬品開発事業）のため、セグメント別の売上高は開示されておらず、金額が独立して開示されていないパイプラインを children とした。各パイプラインに金額は書かなかった。
- businessStructure: 本社（東京都府中市、2025年12月31日現在で従業員18人）は全社共通の事業所であり、特定のパイプラインには結びつけなかった。
- businessStructure: 2025年11月に北海道大学から生理活性脂質レゾルビン類縁体を導入し研究開発を開始している。開発コード名が印字されていないため、children には加えず、ここに記録した。
- businessStructure: このツリーのスキーマには suppliers キーがないため、原薬製造の委託先（日本マイクロバイオファーマ株式会社など）の事実はここに記録するにとどめた。
- history: 沿革表は年月と事象が連続して印字された形式で、採用した行は年月と事象の対応が本文から確認できるものだけを使った。
- history: 設立時の資本金の金額は、規則により沿革に書かなかった。
- history: 本店所在地の移転（2005年港区、2008年府中市幸町、2011年稲城市、2017年府中市宮町、2022年府中市府中町）は沿革から省いた。
- history: 科学技術振興機構（JST）や新エネルギー・産業技術総合開発機構（NEDO）の事業への採択（2011年、2015年）、TMS-008のGLP非臨床試験の開始（2021年）、TMS-007前期第Ⅱ相臨床試験の組入完了（2020年）は、沿革の主要な出来事として取り上げなかったため省き、ここに記録した。
- industry: 主たる業界は pharmaceuticals とした。医薬品開発事業の単一セグメントで、医薬品候補物質の研究開発が唯一の事業であるため。
- industry: DEIの別記事業は CTE である。
- relatedCompanies: 候補 core（株式会社コア）は、「コア」等の一般語の一致のみで、同社への取引・提携の印字がないため結ばなかった。
- relatedCompanies: 候補 nissin（株式会社日新）は、現在のコードリストに同名の上場会社がなく、新株予約権の定型文中の一致のみのため結ばなかった。
- relatedCompanies: 候補 en（エン株式会社）は、一般語の部分一致のみで、同社への取引・提携の印字がないため結ばなかった。
- relatedCompanies: 候補 the-lead（株式会社リード）は、「リードパイプライン」という一般語の一致のみで、同社への言及がないため結ばなかった。
- relatedCompanies: 候補 seki（セキ株式会社）は、一般語の部分一致のみで、同社への取引・提携の印字がないため結ばなかった。
- relatedCompanies: 候補 base-4481（ベース株式会社）は、「データベース」の部分一致のみで、同社への言及がないため結ばなかった。
- relatedCompanies: 候補 lec（レック株式会社）は、「フレックスタイム制」の部分一致のみで、同社への言及がないため結ばなかった。
- relatedCompanies: 候補 port（ポート株式会社）は、「サポート」の部分一致のみで、同社への言及がないため結ばなかった。
- relatedCompanies: 候補 ray（株式会社レイ）は、一般語の部分一致のみで、同社への取引・提携の印字がないため結ばなかった。
- relatedCompanies: 候補 zero（株式会社ゼロ）は、mRSスコアの「ゼロ」という評価文脈の一致のみで、同社への言及がないため結ばなかった。
- relatedCompanies: 候補 daiwa（株式会社大和）は、大株主欄に印字されているのは大和日台バイオベンチャー投資事業有限責任組合（投資事業組合）であり、株式会社大和とは別法人のため結ばなかった。
- relatedCompanies: 候補 ckd（CKD株式会社）は、慢性腎疾患の略称「CKD」の一致のみで、同社への言及がないため結ばなかった。
- relatedCompanies: 候補 corona（株式会社コロナ）は、新型コロナウイルス感染症の文脈の一致のみで、同社への言及がないため結ばなかった。
- relatedCompanies: 候補 insight（株式会社インサイト）は、一般語の部分一致のみで、同社への取引・提携の印字がないため結ばなかった。
- relatedCompanies: 候補 land（株式会社ランド）は、「ブランド」の部分一致のみで、同社への言及がないため結ばなかった。
- relatedCompanies: 候補にない提携先として、CORXELグループ（CORXEL Pharmaceuticals Hong Kong Limited及びCORXEL Pharmaceuticals, Inc.、外国法人）とバイオジェン社（Biogen MA Inc.、外国法人）、日本マイクロバイオファーマ株式会社（未上場）が印字されている。いずれも related-candidates.json の候補ではないため結ばなかった。
- relatedCompanies: 大株主欄のＴＨＶＰ－１号投資事業有限責任組合、ニッセイ・キャピタル９号投資事業有限責任組合は投資事業組合であり、楽天証券株式会社・株式会社ＳＢＩ証券は証券会社であるため、純投資として結ばなかった。
- terms: 用語の助言: 「SMTP化合物」は、カビの一種Stachybotrys microsporaの代謝産物であるスタプラビンの誘導体で、同社の創薬の基盤となる化合物群を指します。「sEH（可溶性エポキシドヒドロラーゼ）」は体内の酵素で、これを阻害すると抗炎症作用が得られるとされています。「ヒトPOC（Proof Of Concept）」は、開発中の新薬候補物質の有用性・効果がヒトへの投与で認められることを指します。「前期第Ⅱ相臨床試験」は、有効性と安全性を少数の患者で調べる臨床試験の初期の段階を指します。「導出（ライセンスアウト）」は、自社で開発した化合物の開発・製造・販売の権利を他の製薬会社に許諾し、対価として契約一時金やマイルストーン（開発・承認・販売の節目ごとの一時金）、ロイヤリティ（売上に応じた実施料）を得ることを指します。「オプション契約」は、将来の一定の時点までに権利を行使するかどうかを選べる契約を指します。

## 要確認（status に反映）

- businessModel: 第22期は決算期変更に伴う経過期間であり、2025年3月1日から2025年12月31日までの10ヶ月間となっています。登録は2025年12月期の10か月決算の数値で行っており、変則決算の取扱いには人の確認が必要です。
- businessModel: 主要な経営指標等の推移の注記に、2021年9月21日付で普通株式1株につき40株の株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- 財務: 変則決算。2025-12 の期は 10 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
