# STIフードホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＳＴＩフードホールディングス |
| 証券コード | 2932 |
| docID（データを取り出した文書） | `S100XVLJ` |
| 原本 docID | `S100XUJP` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XVLJ／有効文書 S100XVLJ（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVLJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＳＴＩフードホールディングス / 2932 / docID S100XUJP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sti-foods-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ＳＴＩフードホールディングス 訂正有価証券報告書－第9期(2025/01/01－2025/12/31) (docID S100XVLJ)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-12-31","previousFiling":26264847000,"latestFiling":26264000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-12-31","previousFiling":27567592000,"latestFiling":27567000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-12-31","previousFiling":31784095000,"latestFiling":31784000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":35580529000,"latestFiling":35580000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-12-31","previousFiling":1110806000,"latestFiling":1110000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-12-31","previousFiling":1006160000,"latestFiling":1006000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-12-31","previousFiling":1562852000,"latestFiling":1562000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":1685326000,"latestFiling":1685000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":1745119000,"latestFiling":1745000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":1528117000,"latestFiling":1528000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":2330074000,"latestFiling":2330000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":2917137000,"latestFiling":2917000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":12777709000,"latestFiling":12777000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":13806232000,"latestFiling":13806000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":15102323000,"latestFiling":15102000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":19284753000,"latestFiling":19284000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":5440978000,"latestFiling":5440000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":6202016000,"latestFiling":6202000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":7446559000,"latestFiling":7446000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":8385710000,"latestFiling":8385000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第9期(2025/01/01－2025/12/31)、docID S100XVLJ）を有効文書としてこのパックを作った。原本は docID S100XUJP。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sti-foods-holdings: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社STIフードホールディングス」が EDINET の提出者名「株式会社ＳＴＩフードホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100XVLJ、2026年3月30日提出）で、原本（docID S100XUJP）との差異は機械比較で0件、財務の数値も本文も原本と同一で表紙の項目だけが異なるrecord-onlyの訂正であることを証拠パックで確認した。出典は訂正有報の題名・URL・提出日に合わせ、5年間の経営指標への影響はないためfinancialNotesには記録せず本警告に留めた。
- businessModel: 前期有報との修正再表示チェックで示された差異は、売上高・純利益など全系列とも100万円未満で、当期有報の経営指標等が百万円単位で印字されていることによる切り捨ての範囲である。値は当期有報のものを登録し、理由の無い再表示とは扱わなかった。
- businessModel: 2025年1月1日付で普通株式1株につき3株の株式分割が行われ、株式数に関する指標は2021年12月期の期首に当該分割が行われたと仮定して算定されている旨が経営指標等の注記に印字されている。5年表の売上高や純利益の金額には影響しないため、financialNotesには記録せず本警告に留めた。
- businessModel: セグメントの変更は表示の変更にとどまらず当期の取得に伴う事業構成の変更であり、前期のセグメント情報は変更後の区分で作成し直して開示されている。経営成績の分析に印字された食品製造販売事業の36,142百万円はセグメント間の内部売上高を含む合計であるため本文には使わず、セグメント注記の外部顧客への売上高36,124百万円を使った。
- businessModel: 有報に一般名詞としての仕入先の区分の開示がなく、このワークツリーのスキーマにsuppliersのキーが無いため、businessModelのsuppliersは省略した。原料は国内外で調達している旨は事業の内容に印字されている。
- businessModel: financialNotesは2022年12月期の収益認識基準の適用開始の1件のみで、同じ決算期に複数の注記は無いため、適用時に落とされる注記はない。
- businessModel: 本文の金額はすべて有報に百万円単位で印字された金額をそのまま使っており、千円単位からの換算や丸めは行っていない。
- businessStructure: 報告セグメントは食品製造販売事業とリテール事業の2つで、並び順はセグメント情報の外部顧客への売上高の大きい順（食品製造販売事業36,124百万円、リテール事業2,481百万円、2025年12月期）とした。合計38,605百万円は連結売上高と一致する。
- businessStructure: リテール事業は当連結会計年度より追加された報告セグメントで、2025年4月に株式会社浜信、味の浜藤株式会社、株式会社藤兵衛をグループ化したことに伴う変更である。前連結会計年度のセグメント情報は変更後の区分に基づき作成したものが開示されている。
- businessStructure: 食品と食材は事業の内容が食品製造販売事業の内訳として示す製品分類であり、分類ごとの外部顧客への売上高はセグメント注記では開示されていないため、子事業には金額を記載していない。管理上の販売実績（食品31,082百万円、食材5,041百万円）はセグメント注記の外部売上高とは区分が異なるため本文には使っていない。
- businessStructure: 2025年12月31日現在のグループ構成は当社、連結子会社10社、非連結子会社1社（STI CHILE S.A.）である。2026年1月1日付の連結子会社間の吸収合併による期後の構成変更はbusinessModelのneedsReviewに記録した。
- history: 沿革の各行の年月は年だけを採用し、月は行のキーには書いていない。本文の説明にも資本金の金額は書いていない（2016年・2018年の増資行、2007年のSTI AMERICA Inc.の増資行は資本金額を含むため採用しなかった）。
- history: 沿革には工場取得、設備導入、特許出願、子会社の設立などが多数印字されているが、事業の転機となる行を中心に採用し、個別の設備導入・特許・小規模な子会社設立の行は省いた。
- history: 2026年1月1日付の連結子会社間の吸収合併（ＳＴＩデリカのＳＴＩフードへの合併、浜信・藤兵衛の味の浜藤への合併）は決算日後の構成変更であり重要な後発事象として印字されているため、沿革には含めずbusinessModelのneedsReviewに記録した。登録は2025年12月31日現在の構成に基づく。
- history: 2010年の民事再生は、為替予約における多額の損失で資金繰りが悪化したことが要因と沿革に印字されているが、金額は本文に書いていない。
- industry: 売上の大半を占める食品製造販売事業とリテール事業はいずれも水産原料を使った食品の製造・販売であり、主たる業界はfood（食品）とした。第2の業界は付けていない。
- relatedCompanies: 極洋（kyokuyo）は候補リストではambiguousとされているが、大株主の状況に正式名称・住所とともに株式数と割合が印字され、沿革にも民事再生のスポンサーとしての記載があるため、同一性と関係性の両方を確認してmajor-shareholderとして結んだ。
- relatedCompanies: 新東（shinto）は、新東京インターナショナル株式会社（現在のグループのルーツ）への部分一致であり、新東株式会社自体についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: ナック（nac）は、連結子会社の株式会社ＳＴＩエナックへの部分一致であり、株式会社ナック自体についての印字がないため結ばなかった。自社グループの子会社は関連企業として結ばない。
- relatedCompanies: 三井物産（mitsui-and-co）は、有報が主要な顧客および仕入・販売の契約相手として印字するのが三井物産流通グループ株式会社であり、三井物産株式会社自体とは別の法人であるため結ばなかった。取引の事実は三井物産流通グループ株式会社とのものである。
- relatedCompanies: ヤギ（yagi-and-co）は、連結子会社の株式会社ＳＴＩミヤギへの部分一致であり、株式会社ヤギ自体についての印字がないため結ばなかった。
- relatedCompanies: エン（en）、セキ（seki）、パス（path）は、いずれも曖昧な部分一致であり、その相手自体についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: ランド（land）は「ブランド」への部分一致、ベース（base-4481）は「ベース」という一般的な語への一致、ポート（port）は「ポートフォリオ」への部分一致であり、いずれもその相手自体についての印字がないため結ばなかった。
- relatedCompanies: ヤマト（yamato）は、かつての子会社である株式会社ヤマトミとその事業部への一致であり、株式会社ヤマト自体についての印字がないため結ばなかった。
- relatedCompanies: セブン＆アイ・ホールディングス（seven-and-i-holdings）は、特定投資株式として保有が印字されるだけで、保有目的は取引先持株会を通じた取得であり、同社自体との取引の印字はないため結ばなかった。実際の主要な顧客は同社の子会社である株式会社セブン-イレブン・ジャパン（未上場で候補リストに無い）である。
- relatedCompanies: 三越伊勢丹ホールディングス（isetan-mitsukoshi-holdings）、松屋（matsuya）、東急（tokyu）は、いずれも特定投資株式として「円滑な取引の維持」という共通の保有目的が印字されるだけで、その相手自体についての具体的な取引・提携の印字がないため結ばなかった。
- relatedCompanies: 高速（kohsoku）は「高速自動充填包装設備」という設備名への一致、あらた（arata）は「あらためて」という一般的な語への一致、コロナ（corona）は新型コロナウイルスへの言及であり、いずれもその相手自体についての印字がないため結ばなかった。
- relatedCompanies: 田谷（taya）は、大株主の表に載る他の株主の住所（世田谷区）への部分一致であり、株式会社田谷自体についての印字がないため結ばなかった。
- relatedCompanies: 主要な顧客である株式会社セブン-イレブン・ジャパンと三井物産流通グループ株式会社は、いずれも候補リストに無いため関連企業としては結んでいない。両社向けの売上高はセグメント情報の主要な顧客ごとの情報に印字されている。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、2026年1月1日付で連結子会社間の吸収合併が実施された。食品製造販売事業では株式会社ＳＴＩフードを存続会社として株式会社ＳＴＩデリカが吸収合併され、リテール事業では味の浜藤株式会社を存続会社として株式会社浜信と株式会社藤兵衛が吸収合併された。登録は2025年12月31日現在の構成（当社、連結子会社10社、非連結子会社1社）に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
