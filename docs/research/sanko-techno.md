# サンコーテクノ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | サンコーテクノ株式会社 |
| 証券コード | 3435 |
| docID（データを取り出した文書） | `S100YHPR` |
| 原本 docID | `S100YHPR` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHPR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | サンコーテクノ株式会社 / 3435 / docID S100YHPR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanko-techno: 10 件の数値を有報XBRLと照合
有報: サンコーテクノ株式会社 有価証券報告書－第62期(2025/04/01－2026/03/31) (docID S100YHPR)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":1122961000,"latestFiling":1111678000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":26558481000,"latestFiling":26553006000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":18755073000,"latestFiling":18743790000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sanko-techno: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の約束: 本文の金額は、千円額を百万円未満で切り捨てた値である。
- businessModel: セグメント利益の金額は本文には書いていない。
- businessModel: 中期経営計画の目標値（売上高240億円、売上高経常利益率８％）は、投資・収益率系の指標を含むため本文・strategy には書かず、ここに記録する。
- businessModel: suppliers はこのツリーのスキーマに無いため書かなかった。個別の仕入先の名称は開示されていない。
- businessModel: 2026年1月にファスニング事業の強化のため甲府精鋲株式会社を子会社化し、同社の子会社KOHBYO（THAILAND）CO.,LTD.を孫会社とした。期中に完了し期末のグループ構成に反映されているため、沿革と事業の内容に記載し、needsReview には入れなかった。負ののれん発生益の金額は本文には書いていない。
- businessModel: 2026年1月に連結子会社のアイエスエム・インターナショナル株式会社が当社と合併し解散した。期中の出来事のため沿革に記録した。
- businessModel: 証拠パックの警告（本文に財務諸表の組替えの記載がある）については、5年間の経営指標に影響する変更はアキヤ電気株式会社の暫定的な会計処理の確定のみであり、financialNotes に記録した。
- businessStructure: 当社グループは当社、子会社15社、関連会社1社により構成される（事業の内容）。報告セグメントはファスニング事業と機能材事業の2つである。
- businessStructure: 報告セグメント対象外として、株式会社イーオプティマイズ（非連結子会社）が販売促進ツールの制作やIT関連のシステム販売を行っている旨が事業の内容に印字されている。
- businessStructure: セグメント間の内部売上高の金額は本文には書いていない。外部顧客への売上高のみを記載した。
- history: 沿革から省いた行: 営業所・支店・物流センター等の拠点開設・移転の各行、ISO認証取得の各行、技術研究所・センター開設の各行。
- history: 子会社化の各行（2003年スイコー、2004年IKK、2019年浦和電研・成光産業ほか、2021年日本メカニック、2023年WDS・新光ナイロン・光洋、2024年アキヤ電気ほか）は、本文の分量の都合で甲府精鋲（直近）以外は個別には採らなかった。
- history: 資本金の金額は沿革には書いていない。
- industry: 主たる業界は、売上高の79.2％を占めるファスニング事業があと施工アンカー等の建設資材の製造・販売であるため、construction（建設）を主分類とした。
- industry: 電動油圧工具や包装・物流関連機器の製造・販売を含むため、machinery（機械）を2つ目の分類として付けた。機能材事業の電子プリント基板は独立した主分類とはしなかった。
- industry: 合う値があるため、taxonomyGaps は記録しなかった。
- relatedCompanies: 株式会社NaITOは、特定投資株式として販売先の一社である旨が個別に印字されている（3,500株保有）が、関連企業候補（related-candidates.json）に含まれないため結ばなかった。
- relatedCompanies: sanko（株式会社サンコー）は、自社名「サンコーテクノ」の部分一致のみで、同社自体への言及はないため結ばなかった。
- relatedCompanies: sanyo-engineering-and-construction（株式会社サンテック）は、沿革で2002年に持分法適用関連会社とし2006年に全株式を売却した旨の歴史的言及のみで、現在の関係はないため結ばなかった。
- relatedCompanies: tokai（株式会社トーカイ）は、債務保証の相手先として印字される「サンコー・トーカイ株式会社」とは別の法人であり、同社自体への言及はないため結ばなかった。三倉工業株式会社・サンコー・トーカイ株式会社に対する債務保証が注記に印字されているが、関連企業候補に含まれないため結ばなかった。保証の金額は本文には書いていない。
- relatedCompanies: career、port、vision、corona、ricoh、base-4481、core、kel、kohsoku、zero、rikei、nissin、en は、いずれも一般語・自社理念・制度名等の部分一致のみで、各社自体への言及はないため結ばなかった。
- relatedCompanies: 連結子会社15社と持分法適用関連会社1社（株式会社サンオー）は自社グループ会社であるため businessStructure の文脈に留め、ここには結ばなかった。
- terms: 助言のみ。用語候補: あと施工アンカー、オールアンカー、ファスニング、FRP（繊維強化プラスチック）シート、軽量物ファスナー、S.T.G Vision2026。いずれも有報の事業の内容・経営方針に基づく。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
