# ミクニ — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ミクニ |
| 証券コード | 7247 |
| docID（データを取り出した文書） | `S100YLLZ` |
| 原本 docID | `S100YLLZ` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YLW0, S100YLVW, S100YLVL, S100YLVB, S100YG9K（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLLZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ミクニ / 7247 / docID S100YLLZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 6 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mikuni: 10 件の数値を有報XBRLと照合
有報: 株式会社ミクニ 有価証券報告書－第104期(2025/04/01－2026/03/31) (docID S100YLLZ)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":1318000000,"latestFiling":1301000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":-1682000000,"latestFiling":-1717000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":1115000000,"latestFiling":1071000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":1995000000,"latestFiling":1949000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":3137000000,"latestFiling":3135000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":2644000000,"latestFiling":2640000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":3161000000,"latestFiling":3149000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":2845000000,"latestFiling":2837000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":96917000000,"latestFiling":96770000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":100108000000,"latestFiling":99930000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":111536000000,"latestFiling":111283000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":109950000000,"latestFiling":109652000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":31918000000,"latestFiling":31676000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":32199000000,"latestFiling":31877000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":40598000000,"latestFiling":40210000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":38837000000,"latestFiling":38384000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第103期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第102期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第101期(2022/04/01－2023/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第100期(2021/04/01－2022/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第99期(2020/04/01－2021/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第103期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
mikuni: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 5年間の経営指標の修正再表示チェックで、前期有報との差異が純利益・経常利益・総資産額・純資産額の各行で確認された。経営指標等の注記により、第100期から第103期までの数値は、連結子会社である台湾三國股份有限公司の元従業員による不正行為に伴う誤謬の訂正による遡及処理後の金額であることが確認でき、過年度の有価証券報告書の訂正報告書（第99期から第103期）が2026年6月26日に提出されている。登録に用いる数値は当期有報の訂正後の金額であり、financialNotesに記録した。
- businessModel: 提出日2026年6月26日の窓にある他の5件の提出書類は、いずれも第99期から第103期の訂正有価証券報告書であり、当期有報の提出前に提出された過年度の訂正である。決算日後の新規の有価証券報告書や臨時報告書ではなく、後発事象の印字も連結・個別とも「該当事項はありません」であるため、ackは不要である。
- businessModel: 連結売上高の10％以上を占める相手先はないため、主要な顧客ごとの情報の記載は省略されている。
- businessModel: ミクニ インディア プライベート リミテッドの売上高25,523百万円は、関係会社の状況の注記に基づく。
- businessStructure: ミクニ ヨーロッパ ゲーエムベーハー、株式会社ミクニグリーンサービス、旭エアーサプライ株式会社、サンライズメディカルジャパン株式会社、株式会社ミクニライフ＆オート、コービン プロパティーズ アイエヌシーは、関係会社の状況における特定子会社12社以外の子会社に当たり、議決権の所有割合の印字がないため、割合を記載していません。
- businessStructure: 浙江三国精密機電有限公司はモビリティ事業とガステクノ事業の両方に属する旨が印字されていますが、子事業としてはモビリティ事業に配置し、ガステクノ事業の説明で同社が同事業を担う旨を記載しました。
- businessStructure: ミクニ アメリカン コーポレーションはモビリティ事業、ガステクノ事業及び商社事業の3事業に属する旨が印字されていますが、子事業としてはモビリティ事業に配置し、説明で3事業の製品を取り扱う旨を記載しました。
- businessStructure: 子会社の資本金額は財務金額であるため、子事業の説明文には記載していません。
- history: 沿革の末尾は年月と事象が崩れた表になっており、「平成27年3月」「平成28年7月」の2年月と「東京証券取引所の市場第一部に指定」「株式会社ミクニグリーンサービス（現・連結子会社）を設立」の2事象を行順で対応づけて収録しました。
- history: 1961年7月の複合行（商号変更と貿易業務の譲渡）は、2件の事象に分割して収録しました。
- industry: 主たる業界は automotive とした。モビリティ事業が2026年3月期の外部顧客への売上高85,725百万円で最大であり、四輪車・二輪車・汎用エンジン用燃料供給装置類及びエンジン関連機能品類の製造販売が中核事業である。東証の業種分類も輸送用機器である。
- industry: machinery を副として付けた。ガステクノ事業（2026年3月期の外部顧客への売上高4,981百万円）は、ガス用立ち消え安全装置や電磁弁などのガス制御機器類及び水制御機器類の製造販売であり、工業用の機械・装置に当たるためである。
- industry: trading を副として付けた。商社事業（2026年3月期の外部顧客への売上高10,212百万円）は、航空機部品類及び芝管理機械等の輸入販売を行う商社事業として独立開示されているためである。
- relatedCompanies: ヤマハ発動機株式会社（311,667株）・リンナイ株式会社（89,391株）: 特定投資株式の保有目的は「主要取引先企業の１つとして商品・サービスに係る業務のより円滑な推進のため。」という全社共通の定型句のみで、個別の取引事実の印字がないため結ばない。
- relatedCompanies: 株式会社横浜フィナンシャルグループ・株式会社三菱ＵＦＪフィナンシャル・グループ・株式会社りそなホールディングス・株式会社岩手銀行・株式会社三井住友フィナンシャルグループ・株式会社みずほフィナンシャルグループ: 特定投資株式の保有目的は「主要取引銀行の１つとして財務に係る業務のより円滑な推進のため。」という全社共通の定型句のみで、個別の取引事実の印字がないため結ばない。
- relatedCompanies: MS＆ADインシュアランスグループホールディングス株式会社: 特定投資株式の保有目的は「主要取引損害保険会社の１つとして商品・サービスに係る業務のより円滑な推進のため。」という定型句のみで、個別の取引事実の印字がないため結ばない。
- relatedCompanies: トヨタ自動車株式会社・三菱自動車工業株式会社・川崎重工業株式会社・マツダ株式会社: 保有目的を純投資目的以外の目的から純投資目的に変更済み（トヨタ自動車は令和４年３月期、三菱自動車工業・川崎重工業・マツダは令和７年３月期）であるため結ばない。
- relatedCompanies: あいおいニッセイ同和損害保険株式会社（大株主5.61％）: 未上場の損害保険会社で百科事典にエントリがなく、親会社であるMS＆ADインシュアランスグループホールディングスとは別法人であるため結ばない。
- relatedCompanies: 株式会社りそな銀行（大株主4.93％）・株式会社横浜銀行（大株主4.93％）・株式会社三菱ＵＦＪ銀行（大株主3.35％）: 印字されているのは各銀行であり、上場の持株会社（りそなホールディングス・横浜フィナンシャルグループ・三菱ＵＦＪフィナンシャル・グループ）とは別法人であるため、持株会社には結ばない。
- relatedCompanies: ミクニ総業株式会社（大株主2.99％）: 未上場で百科事典にエントリがないため結ばない。
- relatedCompanies: 風の会持株会・むつき持株会・ミクニ社員持株会・生田允紀信託口: 持株会及び個人の信託口であり、事業上の関係の対象外のため結ばない。
- relatedCompanies: エン（4849）、ランド（8918）、セキ（7857）、スペース（9622）、ビジョン（9416）、レイ（4317）、鈴木（6785）、ベース（4481）、レック（7874）、ポート（7047）、パス（3840）、イノベーション（3970）、トラスト（3347）: いずれも製品名・一般語（エンジン、タイランド、情報セキュリティ、ビジョン、パワートレイン、ポートフォリオ、パス、イノベーション、信託等）や監査役の姓への社名の部分一致による機械抽出であり、有報に当社との取引・提携・資本関係の記載がないため結ばない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
