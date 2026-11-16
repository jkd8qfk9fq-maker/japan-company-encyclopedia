# ジャフコ グループ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ジャフコ　グループ株式会社 |
| 証券コード | 8595 |
| docID（データを取り出した文書） | `S100YCOQ` |
| 原本 docID | `S100YCOQ` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YCML（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCOQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ジャフコ　グループ株式会社 / 8595 / docID S100YCOQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jafco-group: 10 件の数値を有報XBRLと照合
有報: ジャフコ　グループ株式会社 有価証券報告書－第54期(2025/04/01－2026/03/31) (docID S100YCOQ)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":27677000000,"latestFiling":26589000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":14073000000,"latestFiling":13156000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":24443000000,"latestFiling":23144000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":29685000000,"latestFiling":28192000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":18360000000,"latestFiling":18099000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":-3048000000,"latestFiling":-1169000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":8822000000,"latestFiling":9438000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":13205000000,"latestFiling":13151000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":233024000000,"latestFiling":225528000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":159847000000,"latestFiling":153205000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":165540000000,"latestFiling":158210000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":169970000000,"latestFiling":163832000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":197390000000,"latestFiling":192558000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":130745000000,"latestFiling":126739000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":137639000000,"latestFiling":133518000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":141126000000,"latestFiling":137540000000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":135,"latestFiling":108},{"key":"NumberOfEmployees|2023-03-31","previousFiling":147,"latestFiling":117},{"key":"NumberOfEmployees|2024-03-31","previousFiling":159,"latestFiling":126},{"key":"NumberOfEmployees|2025-03-31","previousFiling":163,"latestFiling":131}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第53期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
jafco-group: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「ジャフコ グループ株式会社」が EDINET の提出者名「ジャフコ　グループ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は経営指標等に百万円単位で印字された値をそのまま表記した（売上高21,619百万円、当期純利益6,576百万円、地域別売上高も百万円印字のとおり）。
- businessModel: 5年間の経営指標等の過年度数値が前期の有価証券報告書の印字と異なるのは、2026年3月期第3四半期に連結決算から非連結（個別）決算へ移行し、過年度も単体の数値で記載されているためであり、理由は経営指標等の注記3に印字されている。値は当期の有価証券報告書のものを登録し、移行の事実を financialNotes（2026年3月期）に記録した。
- businessModel: 第53期の有価証券報告書については訂正有価証券報告書（S100YCML、2026年6月17日提出）が提出されているが、当期の有価証券報告書（S100YCOQ）は訂正の対象ではなく、本登録は当期の有価証券報告書に基づく。
- businessModel: JIAP及びIconが運用するファンドへの出資持分について、総額法から純額法へ会計処理を変更し、あわせて当該出資持分に係る収益・費用の計上区分を変更した旨がMD&Aに印字されている。あわせて、当該ファンドの財務諸表は決算日を12月31日とするものを使用するよう変更され、当事業年度は2025年4月1日から12月31日までの期間の財務諸表を取り込んでいる。
- businessModel: 中長期的目標として掲げられた投資パフォーマンス（ROI）3倍以上、目標ROE15～20％、DOE6％と配当性向50％のいずれか大きい金額とする株主還元方針、新規ファンドへの当社出資比率を中長期的に20％とする目標は、投資に関する指標及び資本政策のため本文・perspectivesには記載せず、ここに記録した。
- businessModel: JIAP及びIconの株式譲渡に際して計上された配当や株式売却に係る損益の金額は、利益の内訳に関する数値のため本文には記載しなかった。
- businessModel: 2025年12月にジャフコSV8シリーズを設立し、2026年4月24日現在でファンド総額約580億円を上回る金額を目標に募集を継続中である旨がMD&Aに印字されている。ファンド募集の途中経過であるため本文には記載しなかった。
- businessModel: 当社が運用するファンドについては、ファンドの資産、負債及び収益、費用を当社の出資持分割合に応じて計上している旨が経営指標等の注記6に印字されている。
- businessStructure: 当社はファンド運用事業の単一セグメントであり、製品及びサービスの区分も単一のため、報告セグメント別の売上高は開示されていない。事業の内訳としてベンチャー投資とバイアウト投資を children にしたが、種類別の売上高が開示されていない旨を各説明に明記した。
- businessStructure: 2026年3月期の売上高の地域別内訳（投資先の所在地に基づく区分）は日本15,494百万円、米国5,241百万円、アジア883百万円、その他なしで、合計は印字の21,619百万円と一致する。本文への記載は perspectives の分析に留めた。
- businessStructure: 2025年4月に決定した国内投資への集中の方針の下、当事業年度に海外子会社（JAFCO Investment (Asia Pacific) Ltd、JAFCO America Ventures Inc.）の譲渡を完了し、当社が運用するファンドは国内ファンドのみとなった。関係会社の状況は「該当事項はありません」と印字されている。
- businessStructure: ジャフコ コンサルティング株式会社は当事業年度中に連結子会社であったが、規模が小さく重要性が乏しいため2026年3月期第3四半期末に連結範囲から除外されており、期末現在の関係会社には含まれないため事業の children には含めなかった。
- history: 沿革のうち、本社移転（1978年、1984年、1996年、2011年、2018年）、支店・支社の設置と統合（1981年、1982年、1983年、2021年）、海外現地法人・駐在員事務所の設立（1984年、2002年、2008年、2017年、2019年）、子会社の設立・合併・商号変更（1989年、1994年、1996年、1999年、2000年）、監査等委員会設置会社への移行（2015年）は、事業の転機ではないため落とし、ここに記録した。
- history: 設立時の資本金の金額は、沿革に資本金額を書かない規則のため記載しなかった。
- history: 2026年1月のJAFCO America Ventures Inc.譲渡は米国現地時間2026年1月6日に完了した旨がMD&Aに印字されており、沿革の年月（2026年1月）と一致する。
- industry: 主たる業界は、単一セグメントであるファンド運用事業（ファンドを通じたベンチャー投資とバイアウト投資を行うベンチャーキャピタル）であることから finance と判定した。合う閉じた分類があり、不足はない。
- relatedCompanies: いちよし証券株式会社（300,000株）、株式会社スルガ銀行（50,000株）、株式会社三菱UFJフィナンシャル・グループ（41,200株）は特定投資株式として保有するが、保有目的が全銘柄同一の定型文（「当社が運営するファンド持分の保有等、当社の事業推進目的のため」）であり、銘柄ごとに個別化された取引内容の記載がないため結ばなかった（2026年3月31日現在）。
- relatedCompanies: 大株主の光通信ＫＫ投資事業有限責任組合（発行済株式（自己株式を除く。）の総数に対する所有株式数の割合1.84％、2026年3月31日現在）は、株式会社光通信とは別の法人格の組合であるため、hikari-tsushin とは結ばなかった。
- relatedCompanies: nomura-holdings（野村ホールディングス株式会社）と nomura-research-institute（株式会社野村総合研究所）は、2017年7月に両社が保有する当社株式の全てを当社が自己株式として取得した過去の資本取引が沿革に印字されるのみで、現在の取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: astroscale-holdings、timee、kurashiru（旧dely）、informetis、izawa-towel、mirrativ、progress-technologies-group、alt は、MD&Aの新規上場（IPO）の状況の表に、運用するファンドの投資先として新規上場した会社として印字されるのみで、当社との取引・提携・資本関係の記載はないため結ばなかった（alt はコードリストにもない）。
- relatedCompanies: port は「ポートフォリオ」、path は「パーパス」、en は「エンジニアリング」等、core は「スコア」等、seki は「セキュリティ」、seed は投資段階を指す「シード」、freee は「フリーアドレス」、i-ll と land は「アイルランド」や「ブランド」、lec は「フレックスタイム」等、ray、the-lead は「リードする」という表現、base-4481 は「ベース」、corona は「新型コロナウイルス感染症」、space は投資先の事業説明中の「スペースデブリ」、will は米国デラウェア州の地名（ウィルミントン）、ishin は一般語の部分一致であり、いずれも相手企業を指していないため結ばなかった。
- relatedCompanies: trust はコードリストになく、日本マスタートラスト信託銀行株式会社（信託口）という信託口の名称の部分一致であり、nissin はコードリストになく ambiguous のため結ばなかった。
- relatedCompanies: 【関係会社の状況】は「該当事項はありません」と印字されており、親会社・子会社・関連会社に該当する相手はいない。
- terms: 助言のみの工程である。本文で使った語のうち、読者の理解を助ける用語として「ファンド」「キャピタルゲイン」「EXIT（イグジット）」「パートナーシップモデル」「営業投資有価証券」を用語集の候補として提案する。いずれも本文中で文脈から意味が伝わるようには配慮した。

## 要確認（status に反映）

- businessModel: 経営指標等の注記に、2022年２月１日付で普通株式１株につき３株の割合で株式分割を実施した旨が印字されています。
- businessModel: 有報提出後、提出者名がジャフコ グループ株式会社から株式会社ＪＡＦＣＯに変更されています（EDINETコードE04806・証券コード8595は同一で、2026年11月12日提出の半期報告書－第55期は新商号で提出されていることをEDINETで確認済みです）。本登録は2026年３月31日現在の商号・体制に基づいています。
- businessStructure: 経営指標等の注記に、2022年２月１日付で普通株式１株につき３株の割合で株式分割を実施した旨が印字されています。
- businessStructure: 有報提出後、提出者名がジャフコ グループ株式会社から株式会社ＪＡＦＣＯに変更されています（EDINETコードE04806・証券コード8595は同一で、2026年11月12日提出の半期報告書－第55期は新商号で提出されていることをEDINETで確認済みです）。本登録は2026年３月31日現在の商号・体制に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
