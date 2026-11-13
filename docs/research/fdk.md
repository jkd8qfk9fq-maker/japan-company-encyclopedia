# ＦＤＫ — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＦＤＫ株式会社 |
| 証券コード | 6955 |
| docID（データを取り出した文書） | `S100YH9L` |
| 原本 docID | `S100YH9L` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH9L.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＦＤＫ株式会社 / 6955 / docID S100YH9L（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fdk: 10 件の数値を有報XBRLと照合
有報: ＦＤＫ株式会社 有価証券報告書－第97期(2025/04/01－2026/03/31) (docID S100YH9L)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第96期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
fdk: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「FDK株式会社」が EDINET の提出者名「ＦＤＫ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 中期事業計画「R2」「R3」の数値目標（売上高、営業利益率、ROIC、営業活動によるキャッシュ・フロー等）は、将来数値・投資指標に当たるため転記せず、戦略の方向性のみを要約した。
- businessModel: 2025年９月に実施した資本金、資本準備金および利益準備金の額の減少と繰越利益剰余金への振替による欠損の補填は、純資産額および発行済株式総数に変更のない資本構成の見直しで、当連結会計年度中に完了しているため、needsReviewではなくここに記録する（金額は転記していない）。
- businessModel: 前期（第96期）の有報には訂正有価証券報告書がある。当期有報の５年間の経営指標と前期有報の重複年度を照合した結果、売上高、純利益、経常利益、総資産、純資産、従業員数の全系列で差異はなく、５年間の経営指標に影響しないことを確認したため、needsReviewではなくここに記録する。登録は当期有報（第97期）の印字による。
- businessModel: 転進支援制度の実施に伴う事業構造改善費用の計上は経営成績の分析に印字されているが、費用の金額は本文に書ける財務数値の範囲外のため転記していない。
- businessModel: Wikipedia（「FDK」）は見つかったが、旧社名や経緯は有報の沿革で足り、有報を超える登録に必要な補足が無いため、情報源には加えていない。
- businessStructure: 子会社の数は【事業の内容】の印字（子会社10社）による。【関係会社の状況】に個別に掲記されている連結子会社は９社（FUCHI ELECTRONICS CO., LTD.、株式会社FDKエンジニアリング、FDK SINGAPORE PTE LTD、FDK AMERICA, INC.、FDKパートナーズ株式会社、XIAMEN FDK CORPORATION、FDK HONG KONG LTD.、FDK ELECTRONICS GMBH、BAOTOU FDK CO., LTD.）である。
- businessStructure: 当連結会計年度中に完了し、期末のグループ構成に反映されている出来事として、FUCHI ELECTRONICS CO., LTD.を存続会社とするFDK TAIWAN LTD.の吸収合併（2026年１月）と、FDK(THAILAND)CO.,LTD.の清算結了（2025年８月19日）がある。いずれもneedsReviewではなく、沿革とここに記録する。
- businessStructure: SILITECH TECHNOLOGY CORPORATIONの保有割合は、【関係会社の状況】の議決権の被所有割合では45.07％、【大株主の状況】では発行済株式（自己株式を除く）の総数に対する割合で45.00％と、基準が異なる。記述には議決権の割合を用いた。
- businessStructure: 富士通株式会社は、当社の普通株式20,295千株（議決権比率58.91％）を保有していたが、SILITECH TECHNOLOGY CORPORATIONによる公開買付けに応募した結果、2025年３月21日付で当社の親会社に該当しないこととなった（【事業の内容】の注記）。期末現在は大株主である。
- history: 沿革の注記にあるとおり、2005年４月に吸収合併したFDK販売株式会社と2012年６月に設立したFDK販売株式会社、2009年１月に事業を譲渡したFDK(THAILAND)CO.,LTD.と2013年４月に設立したFDK(THAILAND)CO.,LTD.は、同一商号だが同一法人ではない。これらの行は沿革に採用していない。
- history: FDK(THAILAND)CO.,LTD.の清算手続きは2025年８月19日に結了し、期末のグループ構成に反映されているため、needsReviewではなくここに記録する。
- history: 創業時・子会社設立時の資本金の金額は、禁止される財務数値に当たるため沿革に転記していない。
- industry: 主たる業界は electronics とした。報告セグメントは電池事業（外部顧客への売上高48,215百万円）と電子事業（同11,345百万円）で、いずれも電気・電子分野の製品である。蓄電デバイスを扱うが、エネルギー事業としての開示はなく、製品別の区分であるため energy は付けていない。
- industry: ２つ目の業界は付けていない。両セグメントとも electronics に収まり、半導体そのものの製造・販売の開示もないため semiconductors も付けていない。
- relatedCompanies: SILITECH TECHNOLOGY CORPORATIONは、【関係会社の状況】で「その他の関係会社」とされ、当社の議決権の45.07％を保有し当社製品を購入している筆頭株主だが、台湾の会社で百科事典の候補（related-candidates）に無く、結ばなかった。資本関係の事実はbusinessStructureとindustryPositionに記録した。
- relatedCompanies: 特定投資株式の３銘柄（コーナン商事株式会社、株式会社デンキョーグループホールディングス、株式会社リテールパートナーズ）は、保有目的が全銘柄同一の定型文（取引先との円滑な関係を維持し、主に市販向けアルカリ乾電池の安定的かつ継続的な販売を目的に保有）のみで、銘柄固有の取引内容が印字されていないため、定型文のみでは結ばない先例により結ばなかった。
- relatedCompanies: 旭化成株式会社は、2011年10月に合弁会社旭化成FDKエナジーデバイス株式会社を設立したが、2015年６月に全株式を取得して完全子会社化し、同年10月に吸収合併済みで、現在継続する関係の印字がないため結ばなかった（沿革の出来事として記録した）。
- relatedCompanies: 湖北工業株式会社は、2015年２月に光部品事業およびFDK LANKA(PVT)LTD.を譲渡した相手だが、過去の１回の事業譲渡のみで、現在の取引・資本関係の印字がないため結ばなかった。
- relatedCompanies: 大株主のうち、ＢＮＰパリバ、バークレイズ・キャピタル・セキュリティーズ（保管・仲介の口座）、個人株主、ＦＤＫ取引先持株会、株式会社ＳＢＩ証券は、事業会社としての取引・提携の 印字がないため結ばなかった。
- relatedCompanies: その他の候補（ケル、エン、レント、キャリア、ポート、ゼロ、フリー、コタ、セキ、ランド、レイ、イオン、ベース、オロ、リコー、コモ、カバー、大和、グリッド、リックスなど）は、一般語・部分文字列の一致（ケルは「ニッケル」、イオンは「リチウムイオン」、大和は常任代理人の住所の「大和市」）であり、相手についての取引・提携・資本関係の印字がないため結ばなかった。
- terms: 助言: 用語「水素吸蔵合金」は、水素を吸蔵・放出する合金で、ニッケル水素電池の材料として使われる。同社は水素貯蔵タンク用に高容量のAB２型水素吸蔵合金を開発している。
- terms: 助言: 用語「全固体電池」は、電解質に固体を用いる電池で、同社はSMD小型全固体電池の高エネルギー密度モデルと定電圧充電対応モデルを開発している。
- terms: 助言: 用語「フェライト」は、電子磁性材料で、同社が1959年に研究開発に成功し製造を開始した素材である。なお、フェライト事業の一部は2019年に長野日本無線株式会社へ譲渡されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
