# エキサイトホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | エキサイトホールディングス株式会社 |
| 証券コード | 5571 |
| docID（データを取り出した文書） | `S100YMC7` |
| 原本 docID | `S100YMC7` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YMC7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | エキサイトホールディングス株式会社 / 5571 / docID S100YMC7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
excite-holdings: 10 件の数値を有報XBRLと照合
有報: エキサイトホールディングス株式会社 有価証券報告書－第8期(2025/04/01－2026/03/31) (docID S100YMC7)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":184120000,"latestFiling":181957000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":354951000,"latestFiling":350500000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":10345546000,"latestFiling":10368547000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":3638124000,"latestFiling":3635961000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
excite-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との数値の差異（2025年３月期の親会社株主に帰属する当期純利益184,120千円→181,957千円ほか）は、主要な経営指標等の推移の注７のとおり、第８期における企業結合に係る暫定的な会計処理の確定を第７期の数値に反映させたことによるものであり、financialNotes に2025年３月期の注として記録した。登録する数値は今期有報のものである。
- businessModel: 主要な経営指標等の推移の注１（第４期の１株当たり純資産額の算定で優先株主に対する残余財産の分配額を控除）は表示上の計算事項であり、注２・注３・注４の潜在株式調整後１株当たり当期純利益や株価収益率を記載しない理由、注５の従業員数の表示方法も表示事項のため、financialNotes には入れず、ここに記録する。
- businessModel: 中期経営計画「EXCITE300」の目標数値（2028年３月期の売上高・EBITDA・営業利益・純利益・時価総額）は目標指標のため、本文にも perspectives にも書いていない。経営方針の文言のみを strategy に要約した。
- businessModel: 経営成績等の分析に印字された売上高以外の利益段階の金額と増減率、その理由は書いていない。本文の金額は売上高と親会社株主に帰属する当期純利益のみとした。セグメント利益も書いていない。
- businessModel: 2024年10月に子会社化したONE MEDICAL株式会社は、2025年３月期の企業結合に係る暫定的な会計処理が第８期に確定した対象であり、注７の反映先である第７期の数値は確定後のものである。
- businessModel: Wikipedia（記事「エキサイト」）は取得されたが、冒頭の記述は有報に印字された事業の説明の範囲内であり、有報にない補足として使える事実はなかったため使用しなかった。
- businessStructure: 当社は純粋持株会社であり、事業はいずれも連結子会社が担う。連結子会社は７社（うち１組合）で、エキサイト株式会社、ONE MEDICAL株式会社、M&A BASE株式会社、M&A BASEサーチファンド１号投資事業有限責任組合、iXIT株式会社、Sharely株式会社とその他１社である。子会社は関連企業としては結んでいない。
- businessStructure: 報告セグメントは当連結会計年度より区分を変更し、プラットフォーム事業に含めていたオンライン診療等のメディカルサービスを分離してメディカル事業を新設した。前連結会計年度のセグメント情報は変更後の区分で作成されている。事業の並びは外部顧客への売上高の大きい順とした。
- businessStructure: 2025年11月１日付でエキサイト株式会社を存続会社、株式会社NAPBIZを消滅会社とする連結子会社間の吸収合併を実施している（期中の出来事のため沿革と事業の説明に記録した）。
- businessStructure: 主要な設備の状況では、提出会社の本社はセグメントの名称が「―」であり、エキサイト株式会社の設備は４事業すべてのセグメント名が連記されているため、どちらの設備も特定の事業に結びつけなかった。帳簿価額は書いていない。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。ブロードバンド事業のアクセス回線の提供関係は関連企業の記録に記載した。
- history: 沿革の年月と事象は行順に対応しており、年単位で記録した。月は書いていない。資本金額は沿革に書いていない。
- history: 落とした行: 2004年11月 エキサイト株式会社の日本証券業協会への店頭登録（同年12月のジャスダック上場の前段のため、上場の行に統合した）、2020年10月 本店所在地の東京都港区南麻布への移転、2020年12月 監査等委員会設置会社への移行、2025年４月 本店所在地の東京都港区麻布台への移転。いずれも拠点移転・登録手続・ガバナンス体制の移行の行である。
- history: 2026年４月１日付のiXIT株式会社の吸収合併（エキサイト株式会社を存続会社とする連結子会社間の合併）は決算日後の出来事のため沿革には入れず、needsReview に記録した。
- industry: 主たる業界は it（IT・ソフトウェア）とした。当社グループはインターネットサービスの企画・運営を中核としており、閉じた分類への直接の適合のため暫定ではない。
- industry: ブロードバンド事業はISP・MVNOの電気通信サービスであり、報告セグメントとして独立に開示され売上高の約３分の１を占めるため、telecommunications（通信）を２つ目に付けた。
- industry: メディカル事業はオンライン診療サービスだが、閉じた分類に医療・ヘルスケアの区分がないため業界を足さなかった。プラットフォーム事業はカウンセリング・メディア・M&A仲介の複合であり、単独の業界は足さなかった。
- relatedCompanies: 結ばなかった候補: en（「検索エンジン」などの一般語との一致で、曖昧な候補）、seki（一般語との一致で曖昧な候補）、nissin（候補リストの上場区分が「コードリストにない」であり、本文の出現箇所も新株予約権の記載で日新という会社への言及ではない）、career（「キャリア形成」の一般語との一致）、port（「ポートフォリオ」の一般語との一致）、base-4481（「連結ベース」の一般語との一致）、space（「スペース」の一般語との一致）、corona（「コロナ禍」の文脈のみ）。
- relatedCompanies: 候補にないため結ばなかった相手: CASK株式会社（代表取締役社長CEOである西條晋一の資産管理会社で、2026年３月31日現在の保有割合は43.72％。候補リストにない）、一般社団法人徳志会（メディカル事業の主要な顧客として印字されているが、候補リストになく上場会社ではないため関連企業としては結ばず、事業の説明に顧客として記載した）、東日本電信電話株式会社・西日本電信電話株式会社（ブロードバンド事業の提携電気通信事業者として印字されているが、候補リストにない）。
- relatedCompanies: 当社の連結子会社（エキサイト株式会社、ONE MEDICAL株式会社、M&A BASE株式会社、iXIT株式会社、Sharely株式会社など）は関連企業としては結んでいない。
- terms: 助言: 用語「EMININAL（エミニナル）」は、エキサイト株式会社が提供するマウスピース歯科矯正サービスの名称で、【沿革】・【事業の内容】に印字されています。メディカル事業に含まれます。
- terms: 助言: 用語「FanGrowth（ファングロース）」は、エキサイト株式会社が提供するウェビナープラットフォームの名称で、【沿革】・【事業の内容】に印字されています。SaaS・DX事業に含まれます。
- terms: 助言: 用語「Sharely」は、Sharely株式会社が提供する株主総会総合支援サービスの名称で、【事業の内容】に印字されています。SaaS・DX事業に含まれます。
- terms: 助言: 用語「BBエキサイト」は、エキサイト株式会社のインターネット接続サービスの名称で、【事業の内容】に印字されています。ブロードバンド事業に含まれます。

## 要確認（status に反映）

- businessModel: [object Object]
- businessModel: [object Object]
- businessStructure: [object Object]
- businessStructure: [object Object]

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
