# AIRMAN — research log

Registered: 2026-10-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＡＩＲＭＡＮ |
| 証券コード | 6364 |
| docID（データを取り出した文書） | `S100YI16` |
| 原本 docID | `S100YI16` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-10-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI16.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＡＩＲＭＡＮ / 6364 / docID S100YI16（id は英語表記「AIRMAN CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 8 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 10 件） |
| history | completed | 0 | history-agent の成果物あり（警告 7 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
airman: 10 件の数値を有報XBRLと照合
有報: 株式会社ＡＩＲＭＡＮ 有価証券報告書－第95期(2025/04/01－2026/03/31) (docID S100YI16)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":36650986000,"latestFiling":36438562000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":49000185000,"latestFiling":48939614000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":51900205000,"latestFiling":51779388000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":54827987000,"latestFiling":54353661000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":2748804000,"latestFiling":2742004000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":3752085000,"latestFiling":3765710000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":5098832000,"latestFiling":5083682000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":4812530000,"latestFiling":4767169000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":4055242000,"latestFiling":4048165000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":5380011000,"latestFiling":5397446000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":7323852000,"latestFiling":7304074000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":6888498000,"latestFiling":6828991000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
airman: 本文の金額 16 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社AIRMAN」が EDINET の提出者名「株式会社ＡＩＲＭＡＮ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの確認: 株式会社ＡＩＲＭＡＮ（証券コード6364、docID S100YI16、第95期 2025年4月1日〜2026年3月31日、2026年6月25日提出、Japan GAAP、連結決算あり）。決算期ラベルは表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」、出典idは yuho-2026。訂正報告書なし、fiscalYearChange は null、irregularPeriods は空。【主要な経営指標等】の各期は12か月。
- businessModel: financialNotes: draft-entry.json の _注記の候補 は、2022〜2025年3月期の売上・経常利益・純利益が前期有報と違う（有報の注記に理由がある）という内容。理由は【主要な経営指標等】の注記2と会計方針の変更の注記（在外子会社等の収益及び費用の換算方法の変更を当期から遡及適用）。前期有報との差額の数値そのものは、brief.md にしかないため本文に書いていない。2025年3月期だけは、会計方針の変更の注記が遡及適用前との差額を千円単位で印字しているため（売上高474,325千円の減少、営業利益458,954千円の減少、経常利益59,506千円の減少、親会社株主に帰属する当期純利益45,361千円減少）、その印字どおりに書いた。2022〜2024年3月期の年ごとの差額は有報に印字がなく、書いていない。『以前の有価証券報告書に載っていた数値とは異なる場合があります』は、遡及適用後の数値を載せているという有報の説明からの言い換えで、原因の推測は書いていない。
- businessModel: 金額は、【経営者による分析】が百万円で印字している値（売上高、営業利益、経常利益、親会社株主に帰属する当期純利益、セグメント売上高、国内建設機械・海外建設機械・国内産業機械の内訳、キャッシュ・フロー）と増減率だけを使った。セグメント注記・関連情報の千円セルは書いていない。海外売上高比率44.8％と Alliance North America, Inc. の23.2％はそれぞれ事業等のリスクと販売実績の表の印字。
- businessModel: 『製品・部品・サービス』の区分: セグメント注記の収益の分解が『製品』『部品』『サービス』に分けているが、金額は千円セルで本文には書いていない。revenueSources の『保守を含む』は有報に直接は書かれていない（㈱エーエスシーが『当社製品の販売及び保守サービス』を行うと【関係会社の状況】に印字）ため、products の『部品・サービス（保守を含む）』は、その印字に基づく言い換え。
- businessModel: 『北米の主要な販売代理店に対する売掛金』: 重要な会計上の見積り、監査上の主要な検討事項（KAM）が、北米事業から生じた販売代理店に対する売掛金を貸倒懸念債権に分類し、個別に回収可能性を検討、2026年3月期は貸倒引当金を計上していないと書く。金額は千円セルのため書いていない。有報自身が説明している手続きと監査上の対応であり、数値の食い違いや誤りの兆候ではないので needsReview にはしていない。この販売代理店が Alliance North America, Inc. かどうかは有報に明記がなく、本文は同一だと書いていない（customers にも別々に書いた）。
- businessModel: 『ほとんど見込生産』『受注実績の記載を省略』は【経営者による分析】の受注実績の印字。
- businessModel: リーファーコンテナ用発電機の販売は伊藤忠メタルズ㈱が担うと経営方針の節に印字（businessStructure に書いた）。ここでは販売会社名は書いていない。
- businessModel: 営業活動によるキャッシュ・フローの支出超過は、有報が『税金等調整前当期純利益、棚卸資産の増加、仕入債務の減少及び法人税等の支払額等』と要因を書いているため数字だけを書き、原因は推測していない（本文では要因の説明は省いた）。
- businessModel: リンクは既存の用語 annual-securities-report だけ（src/data/terms/ にあることを確認）。財務の注記には用語リンクを使っていない。投資指標の禁止語（株価・PER・ROE・自己資本利益率・配当・時価総額など）は本文に使っていない（有報の経営指標等にある自己資本利益率や1株当たりの指標は書いていない）。
- businessModel: data.description（一文の説明）は句点1つ。
- businessStructure: 証拠パックの確認: 株式会社ＡＩＲＭＡＮ（証券コード6364、EDINETコードE01663、docID S100YI16、第95期 2025年4月1日〜2026年3月31日、2026年6月25日提出）。pipeline/state/airman.json の identity.docID と一致。決算期ラベルは表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」、出典idは yuho-2026。会計基準は Japan GAAP、連結決算あり。amendments は status none（訂正報告書なし）、fiscalYearChange は null、irregularPeriods は空。【主要な経営指標等】の決算年月は2022年3月〜2026年3月の毎年3月で、12か月でない期はない。
- businessStructure: 報告セグメントは「建設機械事業」と「産業機械事業」の2つ。並び順は【セグメント情報】の外部顧客への売上高の順（建設機械事業が大きい。セグメント間の内部売上高はなく、計の行も同額）。「報告セグメントに含まれない」区分はない。
- businessStructure: 金額は【経営者による分析】が百万円で印字している値（セグメント売上高・セグメント利益、国内建設機械・海外建設機械の内訳）と増減率だけを使った。セグメント注記や関連情報の千円セル（Alliance North America, Inc. の12,903,061千円など）は本文に書いていない。Alliance North America, Inc. の割合23.2％は【経営者による分析】の販売実績の表の印字。
- businessStructure: 国内建設機械・海外建設機械・国内産業機械の3区分は、【経営者による分析】が売上高の内訳として印字しているもので、報告セグメントではない（建設機械事業の売上高を国内と海外に分けたもの）。そのため children にはせず、建設機械事業の description に金額を書いた。海外売上高比率44.8％は事業等のリスクの印字だが、本文には使っていない。
- businessStructure: 子会社の位置づけ: 【関係会社の状況】の連結子会社6社（㈱エーエスシー、イーエヌシステム㈱、HOKUETSU INDUSTRIES EUROPE B.V.、㈱ファンドリー、AIRMAN ASIA SDN.BHD.、AIRMAN USA CORPORATION）と持分法適用関連会社1社（上海復盛埃爾曼機電有限公司）は、事業の区分ではなく関係会社なので businesses のノードにはせず、製造・販売の担当として建設機械事業・産業機械事業の description に書いた。製造・販売の分担は【事業の内容】の印字。イーエヌシステム㈱は2026年4月1日付で当社に吸収合併されており（有報の注記）、事業の内容の記載は期末時点の体制を引いている。
- businessStructure: 伊藤忠メタルズ㈱とコベルコ・コンプレッサ㈱は customers に書いたが、いずれも有報が資本関係を印字していない（親会社等・関係会社として載っていない）取引先で、販売の担当・OEM供給先という役割だけを有報の印字どおりに書いた。
- businessStructure: 在外子会社等の収益及び費用の換算方法の変更（決算日の直物為替相場から期中平均相場へ）を当期から遡及適用しており、前期のセグメント売上高・セグメント利益は遡及適用後の数値。遡及適用前と比べ、前連結会計年度の外部顧客への売上高は建設機械事業で474,325千円減少、セグメント利益は458,954千円減少と有報が書いている。businessModel 工程の財務の注記に回す。前期比の増減率（1.0％増など）は遡及適用後の前期との比較。
- businessStructure: businesses[].description に [[…]] のリンクは使っていない（リンク先の用語が存在するか確認できないため）。
- history: 証拠パックの確認: 株式会社ＡＩＲＭＡＮ（証券コード6364、docID S100YI16、第95期 2025年4月1日〜2026年3月31日、2026年6月25日提出）。pipeline/state/airman.json の identity.docID と一致。この沿革は第95期の【沿革】（証拠パックの history.txt）から書いた。決算期ラベルは表紙のDEIから「2026年3月期」、出典idは yuho-2026。訂正報告書なし（amendments は status none）、fiscalYearChange は null、irregularPeriods は空で、【主要な経営指標等】の各期は12か月。
- history: 【沿革】の表は、年月と事象が1対1で印字されていて崩れていない（年月のセルがまとまって先に印字される形ではない）。年の推測や位置による対応づけはしていない。
- history: 同じ年の出来事は1件にまとめた（1980年、2000年、2001年、2013年、2014年、2019年、2025年）。別の年の出来事を同じ項目に入れたものはない。
- history: 個別の項目にしなかった【沿革】の行（落とした行の一覧）: 1940年10月 東京出張所を新設、1944年5月 東京出張所を東京支社に改称、1963年1月 大阪営業所を新設、1964年6月 大阪支店に改称、1970年5月 大阪支店を現在地に移転、1978年7月 東京支社を東京本社・東京支店に改称、1980年2月 東京本社・東京支店を現在地に移転、1990年7月 新潟本社の機械設備を増設、2002年3月 小池産業株式会社を連結子会社とする、2003年8月 東京本社機構を新潟本社に移転し本社・工場に改称、2006年6月 現在地（燕市下粟生津）に本店を移転、2011年3月 連結子会社の小池産業株式会社を清算結了。いずれも営業拠点の新設・改称・移転、既に清算した子会社、設備の増設で、現在の事業の構造との関係が沿革の記載だけでは言えないと判断した。事実として誤りがあるわけではない。
- history: 新潟証券取引所上場（1980年）の現在の状況: 表紙の上場金融商品取引所は『東京証券取引所(プライム市場)』のみで、新潟証券取引所について有報は上場の終了などを書いていない。significance は表紙の記載（東京証券取引所のみ）を述べるにとどめ、新潟証券取引所の上場がいつ終わったかは書いていない。
- history: 2025年4月の商号変更の前の社名は、沿革が1939年12月に『北越工業株式会社に商号変更』と書いたあと他の商号変更を書いていないことから、北越工業株式会社と書いた。2025年4月の行そのものは『株式会社ＡＩＲＭＡＮに商号変更』とだけ印字している。
- history: 年表の title に [[company:…]] のリンクは使っていない。description と significance にも [[…]] のリンクは使っていない。金額は書いていない（株式の所有割合と連結売上高に占める割合の％のみ）。割合は【関係会社の状況】の印字（議決権の所有割合）。
- industry: 決算期は表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」。accessedAt は date -u +%F の2026-10-09。この工程は src/types/company.ts の INDUSTRY_IDS（19種）から選んだ。
- industry: machinery を primary にした根拠: 有報は『コンプレッサ、発電機及び車両系建設機械等の建設機械・産業機械の製造及び販売を主な内容』とし、2つの報告セグメント（建設機械事業、産業機械事業）のどちらも機械の製造・販売。閉じた集合の中で、コンプレッサ・発電機などの機械メーカーに最も近い区分は machinery と判断した。掲載済みエントリーの machinery（ebara、advanex、toyokoh、aeroedge、kubota の副）に揃えた。
- industry: construction を2つ目に付けた根拠: 掲載済みの komatsu は construction のみ、kubota は construction を主に machinery を併記している。当社の建設機械事業は、エンジンコンプレッサ、エンジン発電機、高所作業車などを製造・販売する報告セグメントで、2026年3月期の売上高44,552百万円（連結売上高55,604百万円のうち）を有報が報告セグメントの金額として開示している（読者がページ上で確かめられるのは報告セグメントの金額まで）。ただし建設工事を請け負う事業ではないため primary にはしない。construction を付けるか machinery のみにするかは分類の慣例の問題で、データの誤りではないため needsReview にはしていない。
- industry: automotive、electronics、energy、semiconductors は付けない。発電機を製造・販売するが電力を供給する事業ではなく、有報が自動車・電子部品・半導体向けの事業を区分として開示してもいない。primary はちょうど1つ。
- relatedCompanies: 決算期は表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」。accessedAt は date -u +%F の2026-10-09。relatedCompanies を書く直前（2026-10-09）に src/data/companies/ の全エントリー（3,893件）の name・officialName・nameEn を NFKC で全角・半角を揃え、『株式会社』『㈱』を落として、証拠パックの全文（sections.json と *.txt）と照合した。名前が当たったうち、関係として印字されていたのは政策保有株式の表の銘柄と、役員略歴の勤務先（三菱商事、日立製作所、日水コン）、会計用語（『ステップ』）などの部分一致。役員略歴の勤務先は取引関係ではないので結んでいない。
- relatedCompanies: 結んだ相手の同一性: 有報は政策保有株式の銘柄を社名（㈱カナモト、ニシオホールディングス㈱、住友商事㈱、ユアサ商事㈱、日立建機㈱、㈱山善）で印字し、証券コードは印字していない。登録済みのカナモト・ニシオホールディングス・日立建機の entry は figures-only で description も所在地も無いため、『特徴のある正式名称の一致』と有報が印字した保有目的（建設機械事業における商品販売等の業務）だけを根拠に結んだ。人が見て同一性を確認してほしい。住友商事・山善は登録済みの description（総合商社、工作機械・住宅設備機器などの販売）が有報の取引目的と矛盾しない。ユアサ商事は、有報が『2026年4月1日付で㈱YUASAに商号変更』と注記し、登録済みの yuasa が officialName に『旧会社名　ユアサ商事株式会社』を持つことで同一と判断した。いずれも post-filing/events.tsv に該当する行は無い。
- relatedCompanies: 結んだ関係の種類: 政策保有株式の表は『商品販売等の業務のより円滑な推進のため』と目的を書くだけで、当社が売る側か買う側かを書いていない。supplier / customer を創作せず、business-partner とした。親会社・子会社・関連会社・その他の関係会社ではない（【関係会社の状況】にこれらの相手は載っていない）。
- relatedCompanies: 政策保有株式の表（貸借対照表計上額は千円単位のセルのため本文には書いていない）で、銘柄と目的が印字されていたが結ばなかったもの: ㈱レント（計上額が約9.3億円。非上場時から保有していたが新規上場に伴い特定投資株式になった旨が印字。社名が短く一般的で、登録済みの株式会社レント372Aに description が無く、事業内容を確認できないため結ばなかった。同一かどうかは人が確認してほしい）、㈱ワキタ・㈱ナガワ・日本製鉄㈱・㈱鶴見製作所・㈱リンコーコーポレーション・㈱南陽・山九㈱（いずれも保有目的は商品販売・商品輸送等の業務の円滑な推進だが、計上額が小さく、ナガワは100株・約556千円で、本文で関係として扱うほどの根拠が無い。ワキタは登録済みで同一性の確認は同様に弱い）。
- relatedCompanies: 結ばなかった金融機関: ㈱三菱UFJフィナンシャル・グループ、㈱みずほフィナンシャルグループ、㈱第四北越フィナンシャルグループ、㈱三井住友フィナンシャルグループ、㈱岡三証券グループは、保有目的が『当該会社の子会社との金融取引等の業務のより円滑な推進のため』の金融取引で、結ばない方針のとおり。シンジケートローンの貸し手（みずほ銀行、第四北越銀行、三菱UFJ銀行、三井住友銀行）も同じ。
- relatedCompanies: 大株主（【大株主の状況】）: 日本マスタートラスト信託銀行（信託口）、バイオグリーン有限会社、GOLDMAN, SACHS & CO. REG、千代田産業株式会社、佐藤美武（個人）、AIRMAN持株会、CITCO TRUSTEES (CAYMAN) LIMITED（VPL1 TRUST）、みずほ銀行、第四北越銀行、NORTHERN TRUST CO. (AVFC) は、登録済みの上場会社に該当するものが無い（信託口・外国法人・個人・持株会・非上場会社・銀行本体）。千代田産業（東京都中野区、6.34％）は src/data/companies/ に同名のエントリーが無く、登録済みの chiyoda-8185 は別の会社と判断した。そのため大株主の taxonomyGaps も作っていない。大量保有報告書の変更報告書に載る株式会社ヴァレックス・パートナーズ（2024年1月4日現在の保有割合13.85％、当社として実質所有株式数を確認できず大株主の状況には含めていない旨を有報が注記）も、登録対象外のファンド運用会社で結んでいない。
- relatedCompanies: 関係会社: 連結子会社6社と持分法適用関連会社の上海復盛埃爾曼機電有限公司は、【関係会社の状況】の注3で『有価証券届出書または有価証券報告書を提出しておりません』とされ、登録対象（上場会社）ではないため結べない。『同じ回に登録する企業どうしは結べない』にも当たらない。
- relatedCompanies: 結べなかった取引先（未登録・非上場・外国法人）: Alliance North America, Inc.（北米の主要な顧客。売上高の23.2％）、コベルコ・コンプレッサ㈱（モータコンプレッサのOEM供給先。経営者による分析が業績への寄与を書く。登録済みの kobe-steel の子会社かどうかは有報に印字が無く、結んでいない）、伊藤忠メタルズ㈱（リーファーコンテナ用発電機の販売を担う会社。登録済みの itochu との資本関係は有報に印字が無く、結んでいない）。登録後に結び直す価値が高いのは、有報が役割を具体的に書く Alliance North America とコベルコ・コンプレッサ。
- relatedCompanies: 同じ回に登録する企業との関係: 有報の本文に、同じ回の企業（aica-kogyo、aichi-electric、aichi-steel、aida-engineering など）の名前が関係として印字されたものは無かった。
- relatedCompanies: 日立製作所・三菱商事・日水コンは役員の前職・現職として印字されているだけで、取引関係の記載ではないため結んでいない。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は助言のみで、companySchema に requiredTermIds・proposedTerms という項目はありません。書いても組み立て時に捨てられ、捨てた旨の警告が出るのは想定どおりです（docs/pipeline.md の terms 工程の説明のとおり）。
- terms: requiredTermIds の4件はすべて既存の用語です（src/data/terms/ に annual-securities-report.json・segment.json・consolidated-subsidiary.json・subsidiary.json があることを確認）。businessModel 工程の本文で実際にリンクしたのは annual-securities-report だけです。会計基準は Japan GAAP で、ifrs は不要と判断した。
- terms: proposedTerms は有報に実際に出てくる語（エンジンコンプレッサ・OEM・遡及適用・貸倒懸念債権・政策保有）に限った。提案中の用語にはリンクしていない。
- terms: 各 note は用語の一般的な意味に加えて、有報が当社について書いている事実を添えた。一般的な意味の部分は有報の記載ではなく編集上の説明のため、用語として登録する際は外部の一次資料に出典をつけて確認が必要。この工程では確認していない。note に金額は書いていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
