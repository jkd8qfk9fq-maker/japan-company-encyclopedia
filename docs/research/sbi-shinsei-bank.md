# SBI新生銀行 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＳＢＩ新生銀行 |
| 証券コード | 8303 |
| docID（データを取り出した文書） | `S100YT5Q` |
| 原本 docID | `S100YDBB` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YT5Q／有効文書 S100YT5Q（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YT5Q.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＳＢＩ新生銀行 / 8303 / docID S100YDBB（id は英語表記「SBI Shinsei Bank, Limited」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 9 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 6 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 5 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sbi-shinsei-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社ＳＢＩ新生銀行 訂正有価証券報告書－第26期(2025/04/01－2026/03/31) (docID S100YT5Q)
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第26期(2025/04/01－2026/03/31)、docID S100YT5Q）を有効文書としてこのパックを作った。原本は docID S100YDBB。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetricsMetricsAndTargetsTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
sbi-shinsei-bank: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社SBI新生銀行」が EDINET の提出者名「株式会社ＳＢＩ新生銀行」と違います
- 確認: [other-profit-wording] businesses[1].children[1].description: 売上高と当期純利益以外の利益に触れていないか確認する（…ル」と新生パーソナルローン株式会社の損益などもここに入ります。このセグメント…）
- 確認: [other-profit-wording] businesses[2].children[1].description: 売上高と当期純利益以外の利益に触れていないか確認する（…債券等による市場性運用に係る損益が含まれるセグメントです。このセグメ…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…トや経費、貸倒れに備える費用を引いて利益が残ります。2026年3月期のは11…）
- 確認: [other-profit-wording] relatedCompanies[0].description: 売上高と当期純利益以外の利益に触れていないか確認する（…せん。同社の傘下の会社との取引のうち利益相反のおそれのあるものは、特定取引審…）

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから取った（2025年4月1日〜2026年3月31日、第26期、Japan GAAP、連結あり、ラベル「2026年3月期」）。会計基準の変更はないため financialNotes は書いていない。有効文書は訂正有報（record-only）で、数値・本文は原本と同一。
- businessModel: 売上は連結経常収益（銀行は一般の売上高に代えて経常収益を記載する、と【関連情報】の注記にある）。連結経常収益774,058・前期614,001、親会社株主に帰属する当期純利益113,415・前期84,499（いずれも百万円、5年表）を使った。サービスごとの外部顧客に対する経常収益の合計は774,058で印字の合計と一致。
- businessModel: 地域別の経常収益（日本617,227、オセアニア53,032、いずれも百万円）は【関連情報】の印字。預金・譲渡性預金17.3兆円は MD&A の「預金量は17.3兆円」の印字。
- businessModel: flow.profit は損益の内訳を書かず、MD&Aが述べる増加要因だけを書いた。業務粗利益・経費・与信関連費用・経常利益などの金額は本文に書ける財務数値の対象外のため引用していない。
- businessModel: 最上位の description は【事業の内容】冒頭の「法人業務」「個人業務」「海外事業」の説明と、SBIホールディングスが親会社である旨（【関係会社の状況】）に基づく。
- businessModel: perspectives（戦略・強み・業界内の位置づけ）は、会社自身の説明を確認して要約するところまで進めなかったため書いていない。順位やシェアを述べた記載も確認できていない。
- businessModel: brief.md の中にしかない数値は使っていない。
- businessStructure: 決算期は表紙のDEIから取った（2025年4月1日〜2026年3月31日、第26期、Japan GAAP、連結あり、ラベル「2026年3月期」）。有効文書は訂正有報（docID S100YT5Q、原本S100YDBB）で、brief.md の分類は record-only（財務の数値も本文も原本と同一）。needsReview にしていない。
- businessStructure: 並び順：セグメントごとの外部顧客に対する経常収益は有報に印字されていない（セグメント表は業務粗利益・セグメント利益などの経営管理上の指標で、外部顧客への売上高ではない）。【関連情報】にあるのはサービスごとの区分（貸出業務・リース業務・有価証券投資業務・販売信用業務・その他）だけで、セグメントとは対応しない。このため売上順に並べられず、有報【事業の内容】の記載順（法人業務→個人業務→海外事業／証券投資／その他）とし、各セグメントに金額が無い旨を明記した。
- businessStructure: セグメントの階層は有報どおり：法人業務（5セグメント）、個人業務（4セグメント）、海外事業／証券投資／その他（2セグメント）。MD&Aは個人業務のうち新生フィナンシャル・アプラス・その他個人を「コンシューマーファイナンス」とまとめて呼ぶが、報告セグメントの名称ではないため使っていない。
- businessStructure: サービスごとの情報の金額（リース業務104,711・前期94,051、販売信用業務84,718・前期81,147、有価証券投資業務119,309・前期67,032、いずれも百万円）は、名称が近いセグメントの説明に添えたが、セグメントの売上高そのものではないとことわった。昭和リースとリース業務、アプラスと販売信用業務、証券投資と有価証券投資業務が完全に同じ範囲かは有報に書かれていないため、金額を「セグメントの金額」とは書いていない。
- businessStructure: 本文に書かなかったもの：業務粗利益・セグメント利益・与信関連費用・持分法投資利益などのセグメント表の金額、セグメント資産・負債、のれん、設備投資額、昭和リースの経常利益・当期純利益・純資産・総資産、総資産・純資産。
- businessStructure: リテールバンキングの「住宅ローンの手数料収益の増加」はMD&Aの記述（業務粗利益の増加要因）。金額は書いていない。
- businessStructure: 新生フィナンシャルの議決権の所有割合98.9％は【関係会社の状況】の「98.97(－)」を、割合98.9と役員の兼任7(－)が続けて印字されたものと読んだ。新生パーソナルローン行の間接所有「(98.9)」と一致する。
- businessStructure: listings の market「プライム」は表紙の「東京証券取引所プライム市場」から。name は商号から「株式会社」を除いた形、shortNameEn は表紙の英訳名 SBI Shinsei Bank, Limited から「, Limited」を除いた形（有報が略称として定義した文言は確認できていない）。
- businessStructure: 拠点・設備と事業の対応は facilities.txt を使っていない（本文に書いていない）。brief.md の中にしかない数値は使っていない。
- history: 【沿革】の最後の行は表が崩れている：年月のセル9つ（2020年9月・2021年12月・2022年4月・2023年1月・2023年9月・2024年1月・2024年10月・2025年7月・2025年12月）が続けて印字され、事象の文9つが後ろにまとめて並ぶ。年月と事象の数が同じ（9対9）なので行順で対応づけた：UDC Finance連結子会社化／SBIHDが親会社に／スタンダード市場へ移行／行名変更／スタンダード市場の上場廃止／ダイヤモンドアセットファイナンス連結子会社化／NECキャピタルソリューション持分法適用／公的資金完済／プライム市場上場。MD&Aと整合する（公的資金返済2025年7月31日、プライム上場2025年12月17日、NECキャピタルソリューション持分法適用2024年10月）。
- history: 1つの出来事として括ったもの：2020年は1件、2021年12月と2022年4月（市場区分の移行）を2021年の項目に、2023年1月と2023年9月を2023年の項目にまとめた。年ごとの項目にしたため、月は説明文に書いた。
- history: 2021年12月の「SBI地銀ホールディングス株式会社による株式公開買付けにより、SBIホールディングス株式会社が当行の親会社へ異動」は沿革の記載。親会社の異動には、2026年3月26日付の主要株主である筆頭株主の異動（SBI地銀ホールディングスからSBIホールディングスへ）が別にある（MD&A）が、本文には書いていない。
- history: 省いたもの：2019年8月の主要株主による株式売出（J.C.Flowers & Co.LLCの関係者を含む投資家）、1996年11月の長銀信託銀行設立、2000年10月の郵便貯金との提携開始、2001年12月のアイワイバンク銀行（現セブン銀行）とのＡＴＭ提携開始。いずれも沿革にあるが、説明を絞るために1行ずつは立てなかった（ATM提携は2000年の項目の説明に含めていない）。1996年の長銀信託銀行は現SBI新生信託銀行株式会社で、議決権の所有割合は51.0％である。
- history: 2011年3月の海外募集による普通株式の新規発行（690百万株）と2008年2月の第三者割当増資（総額500億円）は、株式数・金額のため本文に数値を書かず、事実だけを書いた。
- history: brief.md の中にしかない数値は使っていない。
- industry: 銀行業（別記事業 BNK）で、報告セグメントはいずれも融資・リース・カード・為替などの金融業務なので finance のみ。リースの昭和リース、ショッピングクレジットのアプラスも金融サービスの範囲内で、独立して別の業界を付ける根拠はない。
- relatedCompanies: related-candidates.json は証拠パックに無かったため、掲載済みの企業一覧（src/data/companies）で社名を確認し、掲載済みかつ listing が上場（東京証券取引所プライム）の3社だけを選んだ。SBIホールディングス株式会社・NECキャピタルソリューション株式会社・SBIアルヒ株式会社は、有報が印字する正式名称と掲載済みエントリーの officialName が一致する。
- relatedCompanies: SBIホールディングス：【関係会社の状況】が「（親会社）」と印字、被所有71.2％。【大株主の状況】の所有割合は71.21％。parent で結んだ。
- relatedCompanies: NECキャピタルソリューション：【関係会社の状況】が「持分法適用関連会社」に分類、議決権の所有割合43.5％（役員の兼任4(－)と続けて「43.54(－)」と印字）。追加取得は【セグメント情報】の負ののれんの注記（2025年度第1四半期）による。
- relatedCompanies: SBIアルヒ：資本関係は当行にはなく（親会社の連結子会社）、銀行代理業務委託契約という取引関係が有報（【事業等のリスク】）に印字されている。取引の向きの記載がないため business-partner とした。親会社の子会社であることは説明に書いたが、資本関係の代用にはしていない。
- relatedCompanies: 結ばなかった相手（上場でない子会社・関連会社）：昭和リース株式会社、株式会社アプラス（有価証券報告書は提出しているが上場会社ではない）、新生フィナンシャル株式会社、新生パーソナルローン株式会社、SBI新生アセットファイナンス株式会社、新生コベルコリース株式会社、SBI新生信託銀行株式会社、UDC Finance Limited、SBI PEホールディングス株式会社、ニッセン・クレジットサービス株式会社、MB Shinsei Consumer Credit Finance Limited Liability Company、ほか。いずれも掲載済みの上場会社ではない（または掲載なし）。
- relatedCompanies: 結ばなかった相手（大株主）：QATAR HOLDING LLC（所有割合1.91％）は事業会社ではなく国の投資主体で、取引・提携の記載もない。日本マスタートラスト信託銀行・日本カストディ銀行・日本証券金融・JPモルガン証券・野村証券・農林中央金庫・MSIP CLIENT SECURITIES・JP MORGAN CHASE BANK は信託銀行・証券会社・金融機関・名義の保管で、持株比率も小さく関係の記載がない。
- relatedCompanies: 結ばなかった相手：SBI地銀ホールディングス株式会社（2021年12月の公開買付けの当事者で、2026年3月まで筆頭株主。非上場）、SBI地方創生バンキングシステム株式会社（次世代バンキングシステムを提供する、親会社の子会社。非上場で、導入は計画中）。
- relatedCompanies: 結ばなかった相手：NEC（NECキャピタルソリューションの名称の一部に一致するだけで、日本電気との関係の記載はない）。昭和リースの業務提携先などの記載もなし。保有株式の表は確認しておらず、政策保有株式を根拠にした関連はない。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は助言のみで、companySchema に requiredTermIds・proposedTerms という項目はない（docs/pipeline.md の terms 工程の説明）。
- terms: requiredTermIds の segment と consolidated-subsidiary は、businessStructure と businessModel の本文でリンクした既存の用語。equity-method は本文でリンクしていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
