# ダイナパック — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ダイナパック株式会社 |
| 証券コード | 3947 |
| docID（データを取り出した文書） | `S100XT1X` |
| 原本 docID | `S100XT1X` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT1X.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ダイナパック株式会社 / 3947 / docID S100XT1X（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dynapac: 10 件の数値を有報XBRLと照合
有報: ダイナパック株式会社 有価証券報告書－第64期(2025/01/01－2025/12/31) (docID S100XT1X)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-12-31","previousFiling":2987110000,"latestFiling":2982474000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":2489043000,"latestFiling":2468154000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":76537630000,"latestFiling":76805107000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":46046711000,"latestFiling":46131525000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
dynapac: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2024年12月期の主要な経営指標が前期有報と異なるのは、Vietnam TKT Plastic Packaging Joint Stock Companyの企業結合に係る暫定的な会計処理の確定によるもので、経営指標の注記３、MD&Aおよびセグメント注記の脚注に理由が印字されているため、financialNotesに記録した。登録は今期有報の値を用いる。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」で、株式分割の記載もない。自己株式の取得による支出は資本政策の事項として、ここに記録するにとどめた。
- businessModel: 中期経営計画の目標数値（2026年度の連結売上高や収益力の指標など）は将来に関する事項のため、本文には転記していない。
- businessStructure: 事業の並びは報告セグメントの外部顧客への売上高の大きい順（包装材関連事業66,717百万円、不動産賃貸事業365百万円）とし、包装材関連事業の子事業には関連情報の製品及びサービスごとの外部顧客への売上高（段ボール49,191百万円、軟包装材8,078百万円、印刷紙器6,699百万円、その他3,114百万円）を金額の大きい順に付けた。製品ごとの金額は千円単位の印字を百万円単位に切り捨てて記載した。
- businessStructure: MD&Aのセグメント業績（包装材関連事業70,460百万円、不動産賃貸事業402百万円）はセグメント間取引を含む金額のため使わず、セグメント注記の外部顧客への売上高を使った。報告セグメントの外部売上高の合計は67,083百万円で連結売上高と一致する。
- businessStructure: 企業集団は当社と子会社18社、関連会社１社（株式会社大成、持分法適用）で構成される。2025年８月のHOANG HAI VIETNAM PACKAGING JOINT STOCK COMPANYと2025年11月の丸中紙工株式会社の株式取得はいずれも期中の取得で、2025年12月31日現在の連結の範囲に反映されているため、沿革とここに記録し、needsReviewには入れなかった。株式会社小倉紙器の駿河ダイナパック株式会社への商号変更（2025年７月）も期中の事項である。
- history: 沿革は年月と事象が交互に印字される崩れた表のため、年月と事象の数が一致することを確認し、行順で対応づけた。
- history: 設立・上場・合併・商号変更・提携・主要な子会社化だけを残した。工場・事業所の開設や閉鎖、海外子会社の設立・商号変更・清算、持分法適用範囲の変動などの各行は省き、ここに記録した。
- history: 沿革に資本金の金額は書いていない（金額の記載を避ける規則による）。
- history: 2025年７月の株式会社小倉紙器の駿河ダイナパック株式会社への商号変更は期中のグループ内事項のため、行には立てず、ここに記録した。
- industry: 閉じた分類（INDUSTRY_IDS）に段ボール・包装資材メーカーに当たる区分がないため、同じ段ボールメーカーのレンゴーや大王製紙、北越コーポレーションの登録先例に倣い、主たる業界を chemicals とした。包装材関連事業は売上高のほぼすべてを占める。
- industry: 不動産賃貸事業は金額が独立して開示される報告セグメントのため、第二の業界として real-estate を付けた。
- relatedCompanies: カゴメ以外の特定投資株式の各銘柄（ブラザー工業、石塚硝子、KPPグループホールディングス、マキタ、森永製菓、パイロットコーポレーション、東洋水産、ザ・パック、文溪堂、ハウス食品グループ本社、昭和産業、ヤクルト本社など）は、保有目的がいずれも「継続的な取引関係の維持強化のため保有」等の定型文のみで、具体的な提携・委託の記載がないため、リンクしなかった。
- relatedCompanies: 金融機関の候補（あいちフィナンシャルグループ、十六フィナンシャルグループ、三菱ＵＦＪフィナンシャル・グループ、みずほフィナンシャルグループ、三井住友トラストグループ）は、いずれも子会社銀行が当社の取引金融機関であるという資金調達の関係の記載のみのため、リンクしなかった。銀行本体と上場持株会社は別の法人でもある。
- relatedCompanies: レンゴー（2.8％）、大王製紙（2.4％）、伊藤忠紙パルプ（2.9％）、丸紅フォレストリンクス（2.8％）、王子マテリア（2.7％）は大株主の状況に記載があるが、保有割合が小さく、その他の関係の記載もないため、リンクしなかった。
- relatedCompanies: 中央紙器工業株式会社は2006年10月に当社と業務提携の契約を締結しているが、関連候補の一覧になく登録先を確認できないためリンクせず、提携の事実は沿革に記録した。
- relatedCompanies: 一般語・部分一致の候補（ベース、キャリア、パス、エン、ポート、レイ、日新、システムソフト、イノベーション、名糖産業（meito）など）は社名の一致のみで関係の記載がないため、リンクしなかった。連結子会社18社と持分法適用関連会社の株式会社大成はグループ会社のため対象外とした。
- terms: 助言: 用語「トータルパッケージング・ソリューション・プロバイダー」は、当社グループが段ボール、印刷紙器、軟包装材などを取り揃える総合包装企業としての自称で、セグメント情報等に印字されている。
- terms: 助言: 企業パーパス「包み、届け、ひらく。」は当社グループの掲げるパーパスで、経営方針に印字されている。
- terms: 助言: 用語「現在の深化と未来の創造」は、2024年から2026年度までの中期経営計画の命題で、経営方針に印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
