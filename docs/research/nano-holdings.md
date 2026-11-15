# ＮＡＮＯホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＮＡＮＯホールディングス株式会社 |
| 証券コード | 4571 |
| docID（データを取り出した文書） | `S100YLFM` |
| 原本 docID | `S100YLFM` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLFM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＮＡＮＯホールディングス株式会社 / 4571 / docID S100YLFM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 7 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nano-holdings: 8 件の数値を有報XBRLと照合
有報: ＮＡＮＯホールディングス株式会社 有価証券報告書－第30期(2025/04/01－2026/03/31) (docID S100YLFM)
前期有報との比較: 18 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
すべて一致しました。
nano-holdings: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「NANOホールディングス株式会社（旧会社名　NANO MRNA株式会社）」が EDINET の提出者名「ＮＡＮＯホールディングス株式会社」と違います
- 確認: [other-profit-wording] businesses[0].description: 売上高と当期純利益以外の利益に触れていないか確認する（…と、共同開発した耳科用液の販売に伴う利益分配などで収益を得ています。2026…）
- 確認: [other-profit-wording] businesses[0].children[2].description: 売上高と当期純利益以外の利益に触れていないか確認する（…が販売する耳科用液「コムレクス®」の利益分配と、株式会社アルビオンが販売する…）
- 確認: [other-profit-wording] businessModel.description: 売上高と当期純利益以外の利益に触れていないか確認する（…薬と、化粧品原料の販売や共同開発品の利益分配で収益を得ています。…）
- 確認: [other-profit-wording] businessModel.revenueSources[1]: 売上高と当期純利益以外の利益に触れていないか確認する（…共同開発品の販売に伴う利益分配…）
- 確認: [other-profit-wording] businessModel.flow[3].description: 売上高と当期純利益以外の利益に触れていないか確認する（…万円、セオリアファーマ株式会社からの利益分配が84百万円です。…）
- 確認: [other-profit-wording] perspectives.industryPosition.analysis.text: 売上高と当期純利益以外の利益に触れていないか確認する（…全てが化粧品原料の販売と共同開発品の利益分配による、研究開発段階の創薬企業で…）

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記のうち、潜在株式調整後の金額・自己資本利益率・株価収益率を当期純損失のため記載していない旨は表示上の事項のため financialNotes には記録していません。第27期から連結財務諸表を作成している旨は、5年表の対象年度である2023年3月期の注記として記録しました。株式分割・株式併合・決算期変更・変則決算・収益認識基準の適用開始の印字はありません。
- businessModel: 経営方針に印字されるファンドの管理報酬率や成功報酬の割合などの説明は、投資事業の収益構造の一般的な説明として本文には金額を書いていません。MD&Aの利益段階の金額と増減理由、キャッシュ・フローの金額、財政状態の金額は本文に書いていません。
- businessModel: 2025年12月11日付の商号変更（NANO MRNA株式会社からＮＡＮＯホールディングス株式会社へ）は当期中の出来事のため、沿革に登録しました。2026年4月の持株会社体制への移行とLuna RD株式会社の子会社化は期間後の出来事のため、needsReview に記録し、登録は2026年3月31日現在の構成で行いました。
- businessStructure: 報告セグメントは「医薬品等の研究開発及び製造販売並びにこれらの付随業務」の単一セグメントで、売上高は株式会社アルビオンへの原材料販売89百万円とセオリアファーマ株式会社からの利益分配84百万円の2件で構成されています（主要な顧客ごとの情報の印字によります）。
- businessStructure: 投資事業は、2025年12月に正式に開始し、連結子会社と組成したファンドが2026年3月31日現在の関係会社に載るため事業として登録しましたが、売上高が独立して開示されていないため金額は書かず、並びは最後にしました。有報の「事業の内容」は2026年4月以降の体制を中心に書かれており、投資事業を主たる事業とする変更は2026年4月からです。
- businessStructure: 設備は本社（東京都港区、従業員19人）と研究所（神奈川県藤沢市、従業員4人）がいずれも「医薬事業」に区分されており、事業ごとの対応は本文に書いていません。
- businessStructure: このツリーのスキーマに suppliers キーがないため、仕入・委託の関係は本文には書いていません。
- history: 省いた出来事: 研究所・オフィスの移転や開設（1999年、2003年、2004年、2014年、2015年、2017年、2021年、2023年、2024年）、各開発候補品のライセンス契約・共同開発契約・臨床試験の開始や中止（2001年、2002年、2008年、2012年、2016年、2017年、2018年、2019年、2020年、2022年、2023年、2024年）、2025年2月のPrimRNA AU Pty Ltdの設立、2026年1月の投資ファンドの組成。個別の契約や臨床試験の進捗は件数が多く、登録は会社の形を変えた出来事に絞りました。
- history: 2026年4月の新設分割による持株会社体制への移行は決算日後の出来事のため、沿革には登録せず needsReview に記録しました。
- history: Wikipediaの記事は見つからなかったため使っていません。
- industry: 主たる業界は pharmaceuticals としました。2026年3月期の売上高の全てが医薬品等の研究開発及び製造販売の単一セグメントによるためです（このツリーのゲートに合わせ industryId キーで記録）。
- industry: 投資事業は2025年12月に開始しましたが、売上高が独立して開示されていないため、finance は付けていません。
- industry: DEIの別記事業は「CTE」ですが、事業の実体に合わせて分類しました。合う区分が閉じた集合に無い事業はなく、taxonomyGaps には記録していません。
- relatedCompanies: nec（日本電気株式会社）: 前連結会計年度の主要な顧客として印字されますが、当連結会計年度の売上高はなく、当期の取引関係が確認できないため結んでいません。
- relatedCompanies: kao（花王株式会社）: 包括共同研究契約が印字されますが、2025年8月に終了しているため、現在の関係が確認できず結んでいません。
- relatedCompanies: nippon-kayaku（日本化薬株式会社）: 沿革に2002年の実施許諾基本契約が印字されるのみで、現在の関係が印字されていないため結んでいません。
- relatedCompanies: sbi-holdings（SBIホールディングス株式会社）: 投資ファンドの共同組成の相手は、その子会社であるSBI新生企業投資株式会社を親会社とするSBI新生グロースキャピタル株式会社であり、SBIホールディングス自体との関係は印字されていないため結んでいません（別の法人です）。
- relatedCompanies: kidswell-bio（キッズウェル・バイオ株式会社）: 特定投資株式で、保有目的は「取引関係の維持、強化」という定型的な文言であり、提携の内容が具体的に印字されていないため結んでいません。
- relatedCompanies: matsui-securities（松井証券株式会社）: 大株主に載りますが、証券会社（金融機関）のため結んでいません。大株主に載る他の証券会社・短資会社も同様です。
- relatedCompanies: en（エン株式会社）: ambiguous で、「エンゲージメント」等の一般語の部分一致のみです。
- relatedCompanies: career（株式会社キャリア）: 「ナノキャリア」の部分一致のみです。
- relatedCompanies: core（株式会社コア）: ambiguous で、「コア技術」の一般語の一致のみです。
- relatedCompanies: freee（フリー株式会社）: 「PEGフリー」の部分一致のみです。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション」の一般語の一致のみです。
- relatedCompanies: port（ポート株式会社）: 「ポートフォリオ」の部分一致のみです。
- relatedCompanies: the-lead（株式会社リード）: ambiguous で、契約先のアクセリード株式会社の部分一致のみです。
- relatedCompanies: seed（株式会社シード）: 「創薬シード」の一般語の一致のみです。
- relatedCompanies: aeon（イオン株式会社）: 「イオン化脂質」の部分一致のみです。
- relatedCompanies: ricoh（株式会社リコー）: 化学物質名の「ポリエチレングリコール」の文脈の部分一致のみです。
- relatedCompanies: shinto（新東株式会社）: ambiguous で、「新東京オフィス」の部分一致のみです。
- relatedCompanies: taya（株式会社田谷）: ambiguous で、地名の部分一致のみです。
- relatedCompanies: vision（株式会社ビジョン）: 「人材ビジョン」の一般語の一致のみです。
- relatedCompanies: nissin（株式会社日新）: 候補の listing が「コードリストにない」うえ、部分一致のみです。
- relatedCompanies: 候補にない相手: 主要な顧客は株式会社アルビオン（2026年3月期の売上高89百万円）とセオリアファーマ株式会社（同84百万円）ですが、どちらも候補にありません。千寿製薬株式会社との共同研究契約（2024年8月）も候補にありません。
- terms: 用語の提案（助言のみ）：「ミセル化ナノ粒子」（薬物を内包した高分子の粒子で、薬を目的の部位へ届ける同社の中核技術）、「核酸医薬」（DNAやRNAなどの核酸を有効成分とする医薬品）、「LNP（脂質ナノ粒子）」（核酸を包んで細胞へ届ける脂質の粒子で、核酸医薬の送達技術）、「アンチセンス核酸（ASO）」（標的のRNAに結合して働きを抑える短い核酸）、「ライセンスアウト（導出）」（開発候補品の開発・販売の権利を他の製薬企業に許諾すること）、「投資事業有限責任組合」（投資ファンドの組成に使われる組合の形態）。

## 要確認（status に反映）

- businessModel: 2026年４月１日付で新設分割により持株会社体制へ移行し、創薬事業を新設のNANO MRNA株式会社に承継させています。登録は2026年３月31日現在の事業構成で行っており、期間後の持株会社体制への移行の反映には人の確認が必要です。
- businessModel: 期間後の出来事として、2026年５月にNANO MRNA株式会社がLuna RD株式会社の第三者割当増資を引き受け、同社を子会社化しています。登録は2026年３月31日現在の構成で行っており、期間後の子会社化の反映には人の確認が必要です。
- businessStructure: 2026年４月１日付で新設分割により持株会社体制へ移行し、創薬事業を新設のNANO MRNA株式会社に承継させています。登録は2026年３月31日現在の事業構成で行っており、期間後の持株会社体制への移行の反映には人の確認が必要です。
- businessStructure: 期間後の出来事として、2026年５月にNANO MRNA株式会社がLuna RD株式会社の第三者割当増資を引き受け、同社を子会社化しています。登録は2026年３月31日現在の構成で行っており、期間後の子会社化の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
