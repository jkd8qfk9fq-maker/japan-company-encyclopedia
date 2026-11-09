# ダイヘン — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ダイヘン |
| 証券コード | 6622 |
| docID（データを取り出した文書） | `S100YEET` |
| 原本 docID | `S100YEET` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEET.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ダイヘン / 6622 / docID S100YEET（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 36 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daihen: 10 件の数値を有報XBRLと照合
有報: 株式会社ダイヘン 有価証券報告書－第162期(2025/04/01－2026/03/31) (docID S100YEET)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第160期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daihen: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や人件費などの費用を差し引いた残りが利益になります。2026年3月期のは14…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの注意2件への判断: (1) 前期の窓にある訂正有価証券報告書－第160期は過年度（2024年3月期）の文書であり、当期の5年間の数値は前期有報との照合で全行一致したため、needsReviewには入れず本記録に留めた。(2) 財務諸表の組替え・遡及適用の記載は、連結経営指標等の注記2「第161期における企業結合に係る暫定的な会計処理の確定（第160期指標への反映）」が5年間の数値に関わる事項であり、financialNotesに記録した。それ以外の組替はその他の包括利益の組替調整額などの定型的な注記で、系列の修正再表示ではない。
- businessModel: 中期計画の数値目標のうち売上高のみを引用し、営業利益率・ROE・配当性向などの投資・利益指標は文章の規則により書いていない。
- businessModel: 連結子会社のダイヘンOTC機電(北京)有限会社は、2026年3月27日の取締役会で解散及び清算が決議され清算手続き中である（【関係会社の状況】注6）。決算期内の事項であり、エントリーは2026年3月31日現在の構成で書いた。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」、重要な契約等も「該当事項はありません」だったため、提出後の予定事項はない。
- businessStructure: 事業の並びはセグメント情報の外部顧客への売上高の大きい順（エネルギーマネジメント128,220百万円、マテリアルプロセシング76,419百万円、ファクトリーオートメーション32,896百万円、その他200百万円）とし、報告セグメントに含まれない「その他」は最後に置いた。
- businessStructure: 各セグメントに子区分の金額は独立して開示されていないため、childrenは付けなかった。
- businessStructure: 主要な設備のうち十三工場（エネルギーマネジメント・マテリアルプロセシング）、六甲工場・神戸工場（複数セグメント）など複数区分が連記された行は、特定の事業に結びつけなかった。三重工場・兼平工場・千歳工場はエネルギーマネジメント単独の生産設備として印字されている。
- businessStructure: 上場市場は表紙の印字どおり東京証券取引所（プライム市場）と福岡証券取引所とした。福岡証券取引所については市場区分の印字がないためmarketは書いていない。
- history: 沿革表は年月と事象が一体で印字されており、印字どおりに対応づけた。資本金の金額は文章の規則により書いていない。
- history: 工場の完成・移転、国内販売会社や小規模子会社の設立・合併などの行は多数あるため省略した（例: 千歳工場・三重工場の完成、四変テック・キューヘン等の設立、テクノス各社の合併、ダイヘン電機システムの吸収合併（2022年）、東北電機製造の株式取得（2023年）、四変テックの追加取得による連結子会社化（2023年）、Rolan Robotics B.V.・Force Design, Inc.の買収（2024年）など）。
- history: 1986年7月の決算期変更（4月30日から3月31日へ）は沿革に印字されているが、現在の5年間の数値には影響しない過去の事項のため、沿革の項目としては採用しなかった。
- industry: 主たる業界は、最大セグメントのエネルギーマネジメント（変圧器・受変電設備などの電力機器）をはじめ製品が電機機器であることからelectronicsとした（東証の業種区分も電気機器）。
- industry: semiconductorsは2つ目に付けた。マテリアルプロセシングでは半導体製造装置向けのプラズマ発生用電源等を事業として開示し（主要な顧客は東京エレクトロン宮城株式会社）、ファクトリーオートメーションでも半導体向けのクリーン搬送ロボットや先端パッケージ向け搬送ロボットの開発を事業として開示しているため。
- industry: 産業用ロボットは機械の要素もあるが、金額が独立開示された事業単位ではなく、主たる業界は1つに限るためmachineryは付けなかった。
- relatedCompanies: 関連企業の判定は、特定投資株式・みなし保有株式の保有目的の記載に基づく。目的の末尾には全銘柄共通の定型文があるが、各銘柄ごとに取引の内容（販売先／仕入先、セグメント、製品）が個別に印字され、保有株式数も実質的な水準にある相手を結んだ。電力各社は特定投資株式の保有が僅少でも、退職給付信託を通じたみなし保有株式として実質的な株式数を保有し、販売先の記載がある相手を結んだ。貸借対照表計上額は書いていない。
- relatedCompanies: the-kansai-electric-power: 大株主（6.16％、2026年3月31日現在）でもあるが、主要な顧客として販売実績が印字されているためcustomerとし、大株主である事実は説明に併記した。
- relatedCompanies: tokyo-electron: 販売の相手先として印字されているのは同社の子会社である東京エレクトロン宮城株式会社であり、その旨を説明に明記してcustomerとした。
- relatedCompanies: sun-wa-technos: 販売先と仕入先の両方が印字されているため、向きを一方に寄せずbusiness-partnerとした。
- relatedCompanies: mitsubishi-ufj-financial-group: 主要な取引銀行であり資金調達・外国為替取引が目的のため結ばなかった（銀行は資金調達が理由なら結ばない）。
- relatedCompanies: sumitomo-mitsui-financial-group: みなし保有株式に主要な取引銀行（資金調達・外国為替・決済）とあるため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group: みなし保有株式に主要な取引銀行（資金調達・証券代行）とあるため結ばなかった。
- relatedCompanies: resona-holdings: 資金調達や各種決済取引が目的のため結ばなかった。
- relatedCompanies: iyogin-holdings: 特定投資株式・みなし保有株式とも資金調達・借入取引が目的のため結ばなかった。
- relatedCompanies: the-hyakujushi-bank: 資金調達・継続的な借入取引が目的のため結ばなかった。
- relatedCompanies: the-oita-bank: 資金調達・継続的な借入取引が目的のため結ばなかった。
- relatedCompanies: the-shiga-bank: 資金調達・継続的な借入取引が目的のため結ばなかった。
- relatedCompanies: makita: 販売先の記載はあるが、当年度において全株式を売却し、期末時点で保有していないため結ばなかった。
- relatedCompanies: torishima-pump-mfg: 販売先の記載はあるが、当年度に全株式を売却したため結ばなかった。
- relatedCompanies: nachi-fujikoshi: 業務提携先との記載はあるが、当年度に全株式を売却したため結ばなかった。
- relatedCompanies: sumitomo-electric-industries: 仕入先の記載はあるが、当年度に全株式を売却したため結ばなかった。
- relatedCompanies: okura-industrial: 販売先の記載はあるが、当年度に全株式を売却したため結ばなかった。
- relatedCompanies: nippon-sanso-holdings: 販売先の記載はあるが、特定投資株式・みなし保有株式とも当年度に売却したため結ばなかった。
- relatedCompanies: fujitec: 当年度に売却済みであり、候補のlistingも「（コードリストにない）」のため結ばなかった。
- relatedCompanies: sumitomo-densetsu: 当年度に売却済みであり、候補のlistingも「（コードリストにない）」のため結ばなかった。
- relatedCompanies: shinsho: 販売先・仕入先の両方の記載はあるが、保有が300株と僅少で情報収集の水準と判断し結ばなかった。
- relatedCompanies: the-okinawa-electric-power: 販売先の記載はあるが、保有が1,927株・計上額2百万円と僅少で、みなし保有株式にも含まれないため結ばなかった。
- relatedCompanies: daimaru-enawin: 販売先の記載はあるが、保有が1,200株と僅少なため結ばなかった。
- relatedCompanies: en: 「ダイヘンエンジニアリング」「エネルギーマネジメント」等の語句の断片一致で、同社への言及はないため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」等の語句の断片一致のため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」等の語句の断片一致のため結ばなかった。
- relatedCompanies: port: 「サポート」の語句の断片一致のため結ばなかった。
- relatedCompanies: cota: 「インコタームズ」の語句の断片一致のため結ばなかった。
- relatedCompanies: career: 「キャリア構築」等の一般的な語句の一致のため結ばなかった。
- relatedCompanies: innovation: リスクの記述中の「イノベーション」という一般的な語句の一致のため結ばなかった。
- relatedCompanies: king: 「ワーキンググループ」の語句の断片一致のため結ばなかった。
- relatedCompanies: space: 「省スペース」の語句の断片一致のため結ばなかった。
- relatedCompanies: yamachuu: 役員の氏名（栗山忠士氏ら）の断片一致で、同社への言及はないため結ばなかった。
- relatedCompanies: core: 「コアステークホルダー」の語句の断片一致のため結ばなかった。
- relatedCompanies: scala: 「スカラアーム型ロボット」の語句の断片一致のため結ばなかった。
- relatedCompanies: 候補にない相手の記録: 住友重機械工業（ファクトリーオートメーションの仕入先、68,754株）、日本ガイシ（エネルギーマネジメントの仕入先、76,000株）は保有目的に取引が印字されているが候補リストにない。九州電力・東京電力ホールディングス・北海道電力は電力の販売先としてみなし保有株式等に印字されているが候補にない。SWCCはエネルギーマネジメントの仕入先だが当年度に売却され、候補にもない。連結子会社55社・関連会社8社はいずれも上場しておらず候補にない（阪神溶接機材は持分法適用関連会社、マテリアルプロセシング製品の購入先）。
- terms: 登録候補（助言のみ）: プラズマ発生用電源（プラズマを発生させるための電源装置。半導体製造装置などに使われる）、クリーン搬送ロボット（クリーンルーム内で半導体ウエハなどを搬送するロボット）、受変電設備（電力会社から電気を受け取り、工場などで使える電圧に変換して配る設備）、アーク溶接（電気のアーク熱で金属を接合する溶接方法）、柱上用変圧器（電柱の上に設置される小型の変圧器）、系統用蓄電池パッケージ（電力系統の安定化に使う蓄電池システム）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
