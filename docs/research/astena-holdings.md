# アステナホールディングス — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アステナホールディングス株式会社 |
| 証券コード | 8095 |
| docID（データを取り出した文書） | `S100XN2T` |
| 原本 docID | `S100XN2T` |
| 提出日（原本） | 2026-02-25 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XN2T.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アステナホールディングス株式会社 / 8095 / docID S100XN2T（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
astena-holdings: 10 件の数値を有報XBRLと照合
有報: アステナホールディングス株式会社 有価証券報告書－第86期(2024/12/01－2025/11/30) (docID S100XN2T)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-11-30","previousFiling":72322233000,"latestFiling":72322000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-11-30","previousFiling":49636012000,"latestFiling":49636000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-11-30","previousFiling":51984426000,"latestFiling":51984000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-11-30","previousFiling":57993375000,"latestFiling":57993000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-11-30","previousFiling":1736962000,"latestFiling":1736000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-11-30","previousFiling":579604000,"latestFiling":579000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-11-30","previousFiling":1162744000,"latestFiling":1162000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-11-30","previousFiling":-2525292000,"latestFiling":-2525000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-11-30","previousFiling":2420877000,"latestFiling":2420000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-11-30","previousFiling":887467000,"latestFiling":887000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-11-30","previousFiling":1363948000,"latestFiling":1363000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-11-30","previousFiling":2804151000,"latestFiling":2804000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-11-30","previousFiling":63553650000,"latestFiling":63553000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-11-30","previousFiling":63551819000,"latestFiling":63551000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-11-30","previousFiling":67254750000,"latestFiling":67254000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-11-30","previousFiling":64595266000,"latestFiling":64595000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-11-30","previousFiling":27006272000,"latestFiling":27006000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-11-30","previousFiling":27068701000,"latestFiling":27068000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-11-30","previousFiling":28601522000,"latestFiling":28601000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-11-30","previousFiling":25302132000,"latestFiling":25302000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
astena-holdings: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との主要経営指標の差異は、すべての項目で百万円未満の端数の差のみであり、修正再表示ではないことを確認した。収益認識基準の適用については、指標等の注記３の印字に基づきfinancialNotesに記録した。
- businessModel: 中長期ビジョンの数値目標（売上高の目標額、自己資本当期純利益率等の投資指標を含むもの）は将来の目標値のため、本文にもperspectivesにも書かず、計画の存在と取り組みのみをstrategyに記した。
- businessModel: 2025年11月期から報告セグメントの利益の算定方法（全社費用の配賦基準）が見直され、前期のセグメント情報は変更後の方法で作成されている。セグメント利益は本文に書かないため、この変更は記録のみとした。
- businessModel: 2025年９月に池田物産株式会社、池田産業株式会社、イノベイション株式会社、Ikeda Corporation of Americaを連結子会社化し、当期のＨＢＣ・食品事業に含まれている。期末現在の構造に反映済みの事項のため、needsReviewには入れず、沿革と事業構造に記した。
- businessModel: 重要な後発事象は、連結財務諸表・財務諸表のいずれの注記でも「該当事項はありません」と印字されている。
- businessModel: ＭＤ＆Ａのセグメント別売上高はセグメント注記の外部顧客への売上高と一致するが、本文の数値はセグメント注記の外部顧客への売上高を用いた。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2025年11月期）の大きい順（ファインケミカル22,333百万円、ＨＢＣ・食品18,190百万円、医薬12,429百万円、化学品9,732百万円）とした。「その他」は報告セグメントに含まれない区分であり、外部顧客への売上高57百万円と最も小さいため最後に置いた。
- businessStructure: 部門（children）はＭＤ＆Ａの部門構成による。部門別の外部売上高は独立して開示されていないため、childrenには金額を書かなかった。
- businessStructure: 子会社数は【事業の内容】の子会社27社・関連会社１社の印字に従った（【関係会社の状況】の表の社数とも一致）。
- history: 沿革表の2020年３月・2020年７月は年月セルが２つ続けて印字され、事象文（スペラファーマ株式会社の完全子会社化、岩城製薬佐倉工場株式会社の連結子会社化）と数が一致するため、行順に対応づけた。
- history: 沿革のうち出張所・販売拠点の開設、海外子会社の設立などは選択して省いた。設立時の資本金の金額は印字があっても書かなかった。
- history: 1914年の創業は薬種問屋としての個人創業であり、法人設立は1931年・1941年の行に分けて記した。
- industry: ファインケミカル事業（外部顧客への売上高22,333百万円）と医薬事業（同12,429百万円）で連結売上高62,744百万円の過半を医薬品関連が占めるため、pharmaceuticalsを主な産業とした。
- industry: 化学品事業は電子工業用薬品・表面処理薬品の製造販売を行う報告セグメントとして独立に開示されている（同9,732百万円）ため、chemicalsを２つ目に付けた。
- industry: ＨＢＣ・食品事業は化粧品原料・化粧品の製販と食品原料・健康食品が一体のセグメントであり、化粧品と食品の金額が分かれて開示されていないため、food等の産業は付けなかった。半導体電極形成用薬品は化学品事業の一部であり、半導体向け部材・部品を独立した事業として開示しているわけではないため、semiconductorsは付けなかった。
- relatedCompanies: 株式会社大阪ソーダは【大株主の状況】の大株主である事業会社として結んだ。特定投資株式としての保有目的は全銘柄共通の定型文のため、根拠は大株主の印字と相互保有の事実に置いた。
- relatedCompanies: サワイグループホールディングス（4887）: 特定投資株式に記載があるが、保有目的は「主にファインケミカル事業における取引先であり、良好な関係の維持、強化を図る」という全銘柄共通の定型文（事業名のみ差し替え）で、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: ロート製薬（4527）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 森永製菓（2201）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 大塚ホールディングス（4578）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 東和薬品（4553）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 住友ファーマ（4506）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 富士製薬工業（4554）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 小林製薬（4967）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: ゼリア新薬工業（4559）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 三菱ケミカルグループ（4188）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 日本ケミファ（4539）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: ツムラ（4540）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 日本ピグメントホールディングス（4119）: 特定投資株式に記載があるが、保有目的は「良好な関係の維持、強化を図る」という定型文のみで、取引・提携の記載がないため結ばなかった。
- relatedCompanies: わかもと製薬（4512）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: イビデン（4062）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 持田製薬（4534）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: ニプロ（8086）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 扶桑薬品工業（4538）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 武田薬品工業（4502）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: ブルボン（2208）: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、銘柄固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: ＮＯＫ: 特定投資株式に記載があるが、保有目的は全銘柄共通の定型文のみで、related-candidates.jsonにも含まれないため結ばなかった。
- relatedCompanies: 参天製薬（4536）: みなし保有株式として退職給付信託に拠出されたものであり、保有目的も定型文のみのため結ばなかった。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ（8306）: みなし保有株式として退職給付信託に拠出されたもので、金融機関との関係維持が目的のため結ばなかった。
- relatedCompanies: エーザイ（4523）: 特定投資株式であったが、当事業年度に全株式を売却し保有がなくなったため結ばなかった。
- relatedCompanies: 日東ベスト（2877）: 特定投資株式であったが、当事業年度に全株式を売却し保有がなくなったため結ばなかった。
- relatedCompanies: イワキ（6237）: 株式会社イワキ（ポンプメーカー）は、当社の連結子会社であるイワキ株式会社とは別法人であり、有報に同社自体への言及はないため結ばなかった。
- relatedCompanies: エン（4849）、イノベーション（3970）、ランド（8918）、ビジョン（9416）、ポート（7047）、ベース（4481）、キャリア（6198）、キング（8118）、レック（7874）、リード（6982）、理経（8226）、コロナ（5909）、キューブ（7112）、高速（7504）、セキ（7857）、ゼロ（9028）、トラスト（3347）: 社名の部分一致や一般語の一致のみで、有報に当該企業自体への言及はないため結ばなかった。トラストはコードリストにもない。
- relatedCompanies: 【大株主の状況】のそのほかの大株主は、信託銀行（信託口）、従業員持株会、個人、未上場の関係先であり、結ぶ対象ではない。
- terms: 助言: 用語「Molecular Hiving™」は、同社グループのペプチド合成法の名称で、ファインケミカル事業で開発を行っている。
- terms: 助言: 用語「策揃え」は、顧客・取引先の課題解決にグループのあらゆる機能で応える同社グループの事業構成の考え方を指す言葉。
- terms: 助言: 用語「Torriden（トリデン）」は、ＨＢＣ・食品事業の化粧品製販部門が扱う韓国コスメの輸入化粧品ブランドの名称。
- terms: 助言: 用語「NAVISION DR」は、医薬事業の美容医療部門が扱う医療機関専売化粧品のシリーズ名。
- terms: 助言: 用語「MicroED」は、微小結晶電子回折（Microcrystal Electron Diffraction）の略で、ファインケミカル事業の医薬品開発エコシステム部門が受注に注力する分析技術。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
