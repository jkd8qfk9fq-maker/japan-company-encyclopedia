# チェンジホールディングス — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社チェンジホールディングス |
| 証券コード | 3962 |
| docID（データを取り出した文書） | `S100YONX` |
| 原本 docID | `S100YJC3` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YONX／有効文書 S100YONX（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YONX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社チェンジホールディングス / 3962 / docID S100YJC3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
change-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社チェンジホールディングス 訂正有価証券報告書－第24期(2025/04/01－2026/03/31) (docID S100YONX)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":7532000000,"latestFiling":7470000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":12745000000,"latestFiling":12650000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":104790000000,"latestFiling":104861000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":41254000000,"latestFiling":41191000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2022-03 の期は 6 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
注意: 訂正有価証券報告書（訂正有価証券報告書－第24期(2025/04/01－2026/03/31)、docID S100YONX）を有効文書としてこのパックを作った。原本は docID S100YJC3。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
change-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YONX、2026年7月3日提出）であり、原本（docID S100YJC3）との差異は証拠パックの照合でdifferenceCount 0、財務の数値も本文も同一で違うのは表紙の項目だけ（分類record-only）であることを確認した。登録は訂正有報に基づき、出典は訂正有報の表題・URL・提出日で登録した。数値に影響がないため訂正に関するfinancialNoteは記録せず、本警告に記録した。
- businessModel: 前期有報との修正再表示チェックで2025年3月期の当期利益・税引前利益・総資産・純資産に差異があったが、理由は企業結合に係る暫定的な会計処理の確定であり（経営指標等の注記6及び経営成績等の分析の冒頭に印字）、financialNote（2025年3月期）に記録した。値は今期有報のものを登録した。2024年3月期についても同様の確定が注記5に印字されているためfinancialNoteに記録した。
- businessModel: 金額は有報の百万円印字のとおり転記した。セグメントの外部収益はセグメント情報の注記の印字を用い、MD&Aのセグメント合計（内部取引を含む）とは区別した。
- businessModel: セグメント外部収益の単純合計（23,254百万円＋29,461百万円＝52,715百万円）は印字のセグメント計52,716百万円と1百万円異なり、報告セグメントに帰属しない売上収益111百万円を加えた連結売上収益52,827百万円が印字のとおりであるため、そのまま転記した。
- businessModel: 販売実績の事業領域別の金額は他セグメントへの内部取引分を含む印字であるため、businessStructureの子事業には金額を書かず、industryPositionに内部取引分を含む旨を断って引用した。
- businessModel: 重要な後発事象として印字された自己株式の取得決議（2026年5月14日の取締役会決議、取得し得る株式の総数2,500,000株・取得価額の総額2,000百万円、取得期間2026年5月15日から2026年11月30日）は期後の資本政策であるため、needsReviewには入れず本警告に記録した。
- businessModel: 株式会社トラストバンクのエネルギー事業及び特別目的会社9社の株式は、2024年3月期末に売却目的保有の処分グループに分類され、TBエネルギー株式会社の株式の相鉄ホールディングス株式会社への譲渡が2024年10月1日に完了している（連結財務諸表注記に印字）。5年表の数値は今期有報の印字どおりであり、前期有報との差異の理由は暫定的な会計処理の確定で説明されるため、非継続事業に関するfinancialNoteは記録しなかった。
- businessModel: 地域別の情報は、本邦の外部顧客への売上収益及び国内に所在する非流動資産が大部分を占めるため有報で省略されている。主要な顧客に関する情報も、売上収益の10％以上を占める顧客がないため省略されている。
- businessModel: 調達先については、有報が自社の調達について一般名詞の調達先を述べていないため、調達先は書いていない。
- businessStructure: 報告セグメントは2つで、外部顧客への売上収益の大きい順に並べた。事業領域別の販売実績の金額は内部取引分を含むため、子事業には金額を書いていない。
- businessStructure: 関係会社の状況では、連結子会社として17社が名前付きで載り「その他15社」と印字され、持分法適用関連会社として2社が名前付きで載り「その他3社」と印字されている。子会社の資本金の金額は転記していない。
- businessStructure: 金額は有報の百万円印字のとおり転記した。
- history: 沿革は有報の印字に基づき、設立・上場・持株会社化・主要な子会社化などの出来事に絞って選定した。本社移転や個別の子会社化の一部は省略した。
- history: 2026年4月の株式会社フィールドエックスの連結子会社化は期末後の出来事であるため、historyには入れず、needsReviewに記録した。
- history: 沿革に印字された子会社設立時の資本金の金額は転記していない。
- industry: 主たる業界は、デジタル人材の育成支援や業務プロセスのデジタル化、自治体向けSaaSなど情報技術を軸とする事業内容に基づき、閉じた分類のitとした。
- relatedCompanies: 候補「e-guardian」（イー・ガーディアン株式会社）は当社の連結子会社（議決権52.51％）であり、自社グループの会社のため結ばなかった。
- relatedCompanies: 候補「hope」（株式会社ホープ）は当社の持分法適用関連会社であり、自社グループの会社のため結ばなかった。
- relatedCompanies: 候補「trust」（株式会社トラスト）はコードリストになく、本文の一致は連結子会社の株式会社トラストバンクへの言及であり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 候補「port」（ポート株式会社）と候補「writeup」（株式会社ライトアップ）は特定投資株式に載るが、保有目的は全銘柄同一の定型文「DX事業における取引・協業関係を維持・強化するため。」のみであり、それだけでは結ばなかった。同じく特定投資株式の株式会社LisBは非上場で候補に含まれない。
- relatedCompanies: 候補「sotetsu-holdings」（相鉄ホールディングス株式会社）は、株式会社トラストバンクのエネルギー事業に係るTBエネルギー株式会社の株式譲渡契約の相手先として注記に載るが、譲渡は2024年10月1日に完了した一過性の取引であり、継続的な提携関係の記載はないため結ばなかった。
- relatedCompanies: 候補「seki」（セキ株式会社）はambiguousで「セキュリティ」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「vision」（株式会社ビジョン）は「ビジョン」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「base-4481」（ベース株式会社）は「連結ベース」等の一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「step」（株式会社ステップ）は収益認識の「ステップ」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「fuller」（フラー株式会社）はプロバレーボールチーム「フラーゴラッド鹿児島」の名称の部分一致であり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 候補「hub」（株式会社ハブ）はambiguousで「地域経済活性化のハブ」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「ray」（株式会社レイ）はambiguousで、一般語の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「cover」（カバー株式会社）は「カバーする」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「freee」（フリー株式会社）は「リスクフリー利子率」の部分一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「innovation」（株式会社イノベーション）は「イノベーション」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 候補「technologies」（株式会社テクノロジーズ）は連結子会社「ガバナンステクノロジーズ」の名称の部分一致であり、同社との関係の記載はないため結ばなかった。
- relatedCompanies: 候補「the-lead」（株式会社リード）は「リード獲得」という一般語の一致であり、関係の記載はないため結ばなかった。
- relatedCompanies: 連結子会社32社（その他15社を含む）と持分法適用関連会社5社（その他3社を含む）は自社グループの会社のため関連企業には含めていない。
- terms: 助言: 用語「ふるさとチョイス」は、株式会社トラストバンクが運営するふるさと納税のプラットフォームです（事業の内容に印字）。
- terms: 助言: 用語「LoGoシリーズ」は、株式会社チェンジが提供する自治体向けSaaSサービスで、LoGoチャットやLoGoフォームを含みます（事業の内容に印字）。
- terms: 助言: 用語「パブリテック」は、ふるさと納税のプラットフォームビジネス及び官公庁向けのソリューション等の提供を通じて地方創生の推進をミッションとする当社グループの事業の呼称です（事業の内容に印字）。

## 要確認（status に反映）

- businessModel: 2021年1月1日付で普通株式1株につき2株の割合で株式分割を行った。株式数に関する指標は第19期の期首に当該分割が行われたと仮定して算定されている。
- businessModel: 株式会社フィールドエックス（プロバレーボールチーム「フラーゴラッド鹿児島」の運営）については、2026年4月に連結子会社化した（沿革及び経営成績等の分析に印字）。登録は2026年3月31日現在のグループ構成で行う。
- 財務: 変則決算。2022-03 の期は 6 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
