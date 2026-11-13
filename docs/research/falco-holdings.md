# ファルコホールディングス — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ファルコホールディングス |
| 証券コード | 4671 |
| docID（データを取り出した文書） | `S100YS5W` |
| 原本 docID | `S100YIIX` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YS5W／有効文書 S100YS5W（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YS5W.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 3 | 株式会社ファルコホールディングス / 4671 / docID S100YIIX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
falco-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ファルコホールディングス 訂正有価証券報告書－第39期(2025/04/01－2026/03/31) (docID S100YS5W)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第39期(2025/04/01－2026/03/31)、docID S100YS5W）を有効文書としてこのパックを作った。原本は docID S100YIIX。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはCriticalContractsTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
falco-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YS5W、2026年7月24日提出）で、原本はdocID S100YIIXである。分類はrecord-onlyで、主要財務（5系列・従業員数）と本文は原本と同一であり、差異はエントリーの数値に影響しないため、needsReviewには入れずここに記録した。出典のtitle・url・publishedAtは訂正有報の値とした。
- businessModel: 重要な後発事象として印字された自己株式の取得（2026年5月12日取締役会決議、取得期間2026年5月25日から2027年1月29日まで、2026年5月31日までに12,500株を取得済み）は資本政策の事項であるため、本文にもneedsReviewにも入れず、ここに記録した。
- businessModel: 中期経営計画の目標数値には投資の語や比率が含まれるため本文に転記せず、戦略は定性的に要約した。
- businessModel: 変則決算・決算期変更はなく、前期有報との照合でも修正再表示はなかったため、financialNotesは空とした。
- businessModel: セグメント注記の外部顧客への売上高の単純合計（43,577百万円）と印字された連結売上高（43,578百万円）には1百万円の差があり、印字の合計を用いた。経営成績の分析の調剤薬局事業の売上高15,196百万円は内部売上高を含むため使っていない。
- businessModel: wikipedia.jsonの冒頭は本店所在地が有報の印字と異なり、有報を超える補足がないため使っていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした（臨床検査事業26,662百万円、調剤薬局事業15,195百万円、ICT事業1,720百万円）。
- businessStructure: 経営成績の分析に印字された調剤薬局事業の売上高15,196百万円はセグメント間の内部売上高を含むため使わず、セグメント注記の外部顧客への売上高15,195百万円を用いた。
- businessStructure: セグメント注記の外部顧客への売上高の単純合計は43,577百万円で、印字された連結売上高43,578百万円と1百万円差がある（印字どおりとし、合計は印字の43,578百万円を引用した）。
- businessStructure: 事業と連結子会社の対応は【事業の内容】の印字どおりとした。連結子会社は5社である。
- history: 1962年の行は【沿革】の冒頭文（1962年7月に設立した株式会社関西医学検査センターを母体とする旨の印字）に基づく。その他の行は沿革表の印字から主な出来事を選んだ。
- history: 年月は落として年のみを記録した。沿革表には子会社の設立・合併・株式取得が多数印字されているが、事業の転機となるものに絞った。
- history: 沿革に印字された子会社の資本金等の金額は記録していない。
- industry: 主たる業界は、外部顧客への売上高が最大の臨床検査事業（26,662百万円）で決め、最も近い pharmaceuticals を暫定で付け、taxonomyGapsに記録した。
- industry: ICT事業は報告セグメントとして金額が独立に開示されている（外部顧客への売上高1,720百万円）ため、2つ目に it を付けた。調剤薬局事業に対応する独立した業界は付けていない。
- relatedCompanies: bml（ビー・エム・エル）は大株主であると同時に資本業務提携の相手方であり、主要な関係としてmajor-shareholderに分類し、提携の事実は説明に書いた。odk-solutions（ODKソリューションズ）は当社の株主ではないためbusiness-partnerとした。
- relatedCompanies: hikari-tsushin（光通信）: 大株主として印字されているのは光通信KK投資事業有限責任組合であり、株式会社光通信そのものではない（同社はその無限責任組合員として名が挙がる）ため、法人を同一視せず関連付けていない。
- relatedCompanies: chuo-warehouse（中央倉庫）、nakabayashi（ナカバヤシ）、nakanishi-mfg（中西製作所）、niitaka（ニイタカ）: 特定投資株式の表にのみ現れ、保有目的は取引関係の強化等の定型的な文面で、事業の内容等にその相手との具体的な取引の印字がないため関連付けていない。
- relatedCompanies: port（ポート）、base-4481（ベース）、innovation（イノベーション）、vision（ビジョン）、career（キャリア）: 一般語・理念やビジョンの文面の部分一致による誤検出で、有報に当該会社との関係の印字はないため関連付けていない。
- relatedCompanies: kuze（久世）、seki（セキ）、en（エン）、linical（リニカル）、core（コア）、aeria（アエリア）: 地名（久世郡）や「セキュリティー」「エルデ」「クリニカルプラン」「ノンコアエリア」「エリア」等の部分一致による誤検出で、有報に当該会社との関係の印字はないため関連付けていない（ambiguousを含む）。
- relatedCompanies: nissin（日新）とtrust（トラスト）: コードリストにない相手で、日新は新株予約権の文面、トラストは日本マスタートラスト信託銀行（信託口）の名称の部分一致であり、当該会社との関係の印字はないため関連付けていない。
- relatedCompanies: 当社グループの連結子会社5社はグループ会社であり、関連企業には含めていない。大株主の信託銀行（信託口）や従業員持株会は純投資・名義のため関連付けていない。
- relatedCompanies: 関連企業の説明には計上額等の金額を書いていない（株式数と議決権・所有割合のみ）。
- terms: 助言: 用語「NIPT（非侵襲性出生前遺伝学的検査）」は、ゲノム事業で受託する周産期医療に係る遺伝子検査で、経営成績等の状況の概要に印字されている。
- terms: 助言: 用語「MSI検査キット（FALCO）」は、同社グループが販売する体外診断用医薬品の製品名で、経営成績等の状況の概要に印字されている。
- terms: 助言: 用語「レセスタ」は、診療所向けクラウド型レセプト総合支援サービスの名称、「HAYATE／NEO」は中小規模病院向けクラウド型電子カルテの名称で、いずれもICT事業の製品として印字されている。
- terms: 助言: 用語「FALCO VISION 2030」は2030年までを対象とする長期ビジョン、「FALCO INNOVATION 2026」は2024年度から2026年度までの中期経営計画の名称で、経営方針に印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ファルコホールディングス（falco-holdings）の主たる業界（臨床検査事業） → 提案: 医療・ヘルスケアサービス（臨床検査）。最大の報告セグメントである臨床検査事業（2026年3月期の外部顧客への売上高26,662百万円）は、医療機関からの臨床検体検査の受託と体外診断用医薬品の製造・販売が中心で、医薬品の開発・製造を主とする会社とは性質が異なる。閉じた分類（INDUSTRY_IDS）に医療・ヘルスケアサービスを表す区分が無いため、体外診断用医薬品の製造・販売を含む最も近い pharmaceuticals を暫定とした。掲載済みのH.U.グループホールディングスでも同じ理由で pharmaceuticals が暫定とされている。
