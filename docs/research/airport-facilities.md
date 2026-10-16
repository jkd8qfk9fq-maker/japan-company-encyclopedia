# 空港施設 — research log

Registered: 2026-10-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 空港施設株式会社 |
| 証券コード | 8864 |
| docID（データを取り出した文書） | `S100YGNC` |
| 原本 docID | `S100YGNC` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-10-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGNC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 空港施設株式会社 / 8864 / docID S100YGNC（id は英語表記「AIRPORT FACILITIES Co.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 10 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 8 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 5 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
airport-facilities: 10 件の数値を有報XBRLと照合
有報: 空港施設株式会社 有価証券報告書－第57期(2025/04/01－2026/03/31) (docID S100YGNC)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":23777481000,"latestFiling":23777000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":25516472000,"latestFiling":25516000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":25950897000,"latestFiling":25950000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":31121104000,"latestFiling":31121000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":821411000,"latestFiling":821000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":1564483000,"latestFiling":1564000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":2020003000,"latestFiling":2020000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":2577568000,"latestFiling":2577000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":2962181000,"latestFiling":2962000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":2121583000,"latestFiling":2121000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":3175847000,"latestFiling":3175000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":4629102000,"latestFiling":4629000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":102468014000,"latestFiling":102468000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":100403211000,"latestFiling":100403000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":110461725000,"latestFiling":110461000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":108580604000,"latestFiling":108580000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":55306229000,"latestFiling":55306000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":57368892000,"latestFiling":57368000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":60765822000,"latestFiling":60765000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":62594282000,"latestFiling":62594000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
airport-facilities: 本文の金額 22 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの確認: 空港施設株式会社（証券コード8864、docID S100YGNC、第57期 2025年4月1日〜2026年3月31日、2026年6月23日提出、Japan GAAP、連結決算あり）。決算期ラベルは表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」、出典idは yuho-2026。訂正報告書なし、fiscalYearChange は null、irregularPeriods は空。【主要な経営指標等】の各期は12か月。
- businessModel: financialNotes: draft-entry.json の _注記の候補 は、2022〜2025年3月期の売上・経常利益・純利益・総資産・純資産が前期有報と違うという内容。理由は【主要な経営指標等】の注記（第57期から金額の表示単位を千円単位から百万円単位に変更。第56期以前も百万円単位）で、前期有報の千円単位の値（例: 売上高23,777,481千円）が今期有報では百万円未満を含まない値（23,777百万円）になっているだけ。数値が食い違っているのではなく表示単位の変更。前期有報との差額の数値そのものは brief.md にしかないため本文に書いていない。『百万円未満の部分が異なります』は、この有報の説明からの言い換えで、原因の推測は書いていない。2026年3月期の注記は、会計上の見積りの変更の注記（資産除去債務の見積りの変更）に印字された3つの金額をそのまま書いた。
- businessModel: 『表示方法の変更』（連結貸借対照表の支払手形及び買掛金→買掛金、短期借入金→1年内返済予定の長期借入金。連結損益計算書の補助金収入の独立掲記）の前期連結財務諸表の組替えは、5年表の行（売上高、経常利益、純利益、総資産、純資産）の値を変えない科目間の組替えのため、財務の注記には書かなかった。
- businessModel: 金額は【経営者による分析】と、セグメント情報・収益認識関係・賃貸等不動産関係・会計上の見積りの変更の注記が百万円で印字している値だけを使った。『その他の収益』20,921百万円と『顧客との契約から生じる収益』15,870百万円は収益認識関係の表（単位：百万円）の印字で、その他の収益には、リース取引に関する会計基準及び金融商品に関する会計基準で認識される収益が含まれると注記に書かれている。賃貸収益だけの金額ではないため、本文は『賃貸収益などの「その他の収益」』と書いた。
- businessModel: 顧客の割合: 日本航空㈱11.9％（4,385百万円）、日本空港ビルデング㈱11.1％（4,098百万円）、全日本空輸㈱10.4％（3,838百万円）は【経営者による分析】の販売実績の表の印字。3社で売上高の33.4％は事業等のリスクの印字（11.9＋11.1＋10.4＝33.4で一致）。日本航空㈱がその他の関係会社であることは【関係会社の状況】、全日本空輸㈱がANAホールディングス㈱の100％子会社であることは関連当事者情報の注記の印字。
- businessModel: 『空港機能施設事業者の指定を受け国内貨物ターミナルを設置、管理、運営』は事業等のリスク（国の施策等のリスク）の印字。
- businessModel: リンクは既存の用語 annual-securities-report だけ（src/data/terms/ にあることを確認）。財務の注記には用語リンクを使っていない。投資指標の禁止語（株価・PER・ROE・自己資本利益率・配当・時価総額など）は本文に使っていない（有報の経営方針にあるROE目標・自己資本利益率は書いていない）。
- businessModel: data.description（一文の説明）は句点1つ。
- businessStructure: 証拠パックの確認: 空港施設株式会社（証券コード8864、EDINETコードE03958、docID S100YGNC、第57期 2025年4月1日〜2026年3月31日、2026年6月23日提出）。pipeline/state/airport-facilities.json の identity.docID と一致。決算期ラベルは表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」、出典idは yuho-2026。会計基準は Japan GAAP、連結決算あり。amendments は status none（訂正報告書なし）、fiscalYearChange は null、irregularPeriods は空。【主要な経営指標等】の決算年月は2022年3月〜2026年3月の毎年3月で、12か月でない期はない。
- businessStructure: 報告セグメントは4つ。並び順は【セグメント情報】の外部顧客への売上高の順（空港内不動産17,291、空港外不動産11,312、空港内インフラ7,459、その他729の各百万円）。『その他の事業』は有報が報告セグメントの1つとして扱っており、売上高の順でも最後になる（『報告セグメントに含まれない』区分ではない）。
- businessStructure: 金額は【経営者による分析】と【セグメント情報】が百万円で印字している値（セグメント売上高・セグメント利益、減損損失1,647百万円）と増減率だけを使った。減損損失1,647百万円は会計上の見積りの変更の注記と、セグメント情報の減損損失の表（空港内不動産事業のみ）の印字。
- businessStructure: children（空港内インフラ事業の3区分）: 【事業の内容】が『主要事業』として地域冷暖房事業、給排水運営事業、共用通信事業を並べ、報告セグメントの説明もこの3つを挙げている。3区分の売上高・利益は独立して開示されていないため、金額は書いていない（増減の方向と有報が書く理由だけ）。読者がページ上で確かめられるのは報告セグメントの金額まで。3区分の並び順は有報の印字順。共用通信事業は、有報にこれ以上の説明がなく、description も報告セグメントの説明どおりにとどめた。
- businessStructure: 空港内不動産事業・空港外不動産事業には children を置いていない。【事業の内容】の『主要事業』は不動産賃貸の対象を並べたもの（事務所ビル、格納庫、工場用建物等）で、独立した事業名ではないため、products に書いた。ノンアセット事業は空港外不動産事業の説明に含めた（報告セグメントの概要が『空港外における不動産賃貸等やノンアセット事業』と書く）。
- businessStructure: 関係会社の位置づけ: 連結子会社6社（東京空港冷暖房㈱、AFCアセットマネジメント㈱、AFC商事㈱、AIRPORT FACILITIES ASIA PTE.LTD.、AFS PROPERTIES PTE.LTD.、AFN PROPERTIES LTD.）は事業の区分ではなく関係会社なので businesses のノードにはせず、担当する区分の description に書いた。【事業の内容】の『子会社9社』は、連結子会社6社と、連結の範囲から除いた非連結子会社3社（アクアテクノサービス㈱、㈱ブルーコーナー、㈱エスキューブ。小規模会社）の合計で、矛盾ではない。その他の関係会社（日本航空㈱、ANAホールディングス㈱）は relatedCompanies 工程で扱う。
- businessStructure: 新日本空調㈱への熱供給事業の運営管理の委託は、株式の保有状況の表（保有目的の説明）の印字。同社は株式の保有先（取引関係の維持・強化）であり、親会社等ではない。
- businessStructure: 上場区分: 表紙の上場金融商品取引所は東京証券取引所スタンダード市場。沿革は2022年4月にプライム市場に移行し、2026年1月にスタンダード市場へ市場区分を変更したと書く。表紙の記載と整合しており、listings の market は『スタンダード』（表紙の印字から）。
- businessStructure: 第57期から金額の表示単位を千円単位から百万円単位に変更している（【主要な経営指標等】の注記）。businessModel 工程の財務の注記に回す。
- businessStructure: businesses[].description に [[…]] のリンクは使っていない（リンク先の用語が存在するか確認できないため）。
- history: 証拠パックの確認: 空港施設株式会社（証券コード8864、docID S100YGNC、第57期 2025年4月1日〜2026年3月31日、2026年6月23日提出）。pipeline/state/airport-facilities.json の identity.docID と一致。この沿革は第57期の【沿革】（証拠パックの history.txt）から書いた。決算期ラベルは表紙のDEIから「2026年3月期」、出典idは yuho-2026。訂正報告書なし（amendments は status none）、fiscalYearChange は null、irregularPeriods は空で、【主要な経営指標等】の各期は12か月。
- history: 【沿革】の表は、年月と事象が1対1で印字されていて崩れていない。『〃』は2011年の行（神戸空港の格納庫と同じ11月）に1回だけ出るが、年月のセルがまとまって先に印字される形ではなく、直前の年月（11月）を指している。年の推測や位置による対応づけはしていない。
- history: 同じ年の出来事は1件にまとめた（1970年、1993年、2011年、2014年、2016年、2017年、2018年、2019年、2020年、2021年、2022年）。別の年の出来事を同じ項目に入れたものはない。
- history: 個別の項目にしなかった【沿革】の行（落とした行の一覧）: 1994年6月 関西国際空港に航空機汚水処理施設（SDプラント）竣工、1996年3月 那覇空港に小型機用格納庫竣工、2002年3月 東京国際空港に第１テクニカルセンター取得、2003年3月 同空港に第２テクニカルセンター竣工、2005年2月 中部国際空港にSDプラント竣工、2008年2月 東京国際空港にエンジンメンテナンスビル南棟竣工、2009年4月 同空港にコンポーネントメンテナンスビル竣工、2015年3月 広島ヘリポートに格納庫竣工。いずれも個別の施設の竣工・取得で、独立した出来事として書くほどの情報が沿革にない（施設の用途・賃借先が書かれていない）と判断した。事実として誤りがあるわけではない。第１・第２テクニカルセンター、エンジンメンテナンスビル南棟、コンポーネントメンテナンスビルは、主要な設備の状況に賃貸用の設備として載っている。
- history: significance は、有報の他の節（事業の内容、重要な契約等、関係会社の状況、主要な設備の状況）が裏付ける現在との関係だけを書いた。2010年と2011年の物件がどの報告セグメントに属すか、HANEDA INNOVATION CITYへの当社の関与は、有報が書いていないため書かなかった。
- history: 2010年・2011年・2021年の物件（共同ビル、ホテル、共同住宅、学生寮、店舗用建物）の所在地は、東京都大田区などで空港の内か外かが沿革から分からないため、空港外の物件だとは書いていない。
- history: 2026年1月のスタンダード市場への変更は、表紙の上場金融商品取引所（東京証券取引所スタンダード市場）と整合している。変更の理由は有報に書かれておらず、書いていない。
- history: 年表の title に [[company:…]] のリンクは使っていない。description と significance にも [[…]] のリンクは使っていない。金額は、設立時の資本金250百万円と上場時の資本金6,826百万円（沿革の印字）、出資比率・所有割合の％（沿革と【関係会社の状況】の印字）だけ。
- industry: 決算期は表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」。accessedAt は date -u +%F の2026-10-09。この工程は src/types/company.ts の INDUSTRY_IDS（19種）から選んだ。
- industry: real-estate を primary にした根拠: 有報は空港内不動産事業（事務所ビル、格納庫、工場用建物等の不動産賃貸）と空港外不動産事業（事務所ビル、共同住宅、ホテル等の不動産賃貸、不動産の販売）を報告セグメントとし、2026年3月期の外部顧客への売上高は両セグメントで連結売上高36,792百万円の大半（17,291百万円と11,312百万円）を占める。
- industry: energy を2つ目に付けた根拠: 空港内インフラ事業の地域冷暖房（熱供給事業）を連結子会社の東京空港冷暖房㈱が行い、有報の【関係会社の状況】が同社の売上高（連結会社相互間の内部売上高を除く）を4,785百万円と印字している（空港内インフラ事業の外部顧客への売上高7,459百万円の内数にあたる）。熱供給事業の金額の独立した開示は、この子会社の売上高までで、読者がページ上で確かめられるのは、報告セグメントの金額（7,459百万円）と子会社の売上高まで。給排水運営事業と共用通信事業には、閉じた集合に当てはまる区分が無いため、industries には反映していない。
- industry: transportation は付けない（航空・空港事業者に施設を提供する会社で、旅客や貨物の輸送を行う会社ではない。掲載済みの transportation は鉄道・物流の慣例）。construction は付けない（建設工事を請け負う事業を行っていない。有報は、建設・修繕工事は安藤・間などへの発注と書く）。primary はちょうど1つ。
- industry: 空港の施設・インフラを提供する事業にあたる区分は閉じた集合に無い。real-estate は事業の大半を占める賃貸の面で最も近い区分で、分類の誤りではなく区分が足りない面があるため、記録のため taxonomyGaps（kind: industry）にも書いた。
- relatedCompanies: 決算期は表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」。accessedAt は date -u +%F の2026-10-09。relatedCompanies を書く直前（2026-10-09）に src/data/companies/ の全エントリー（3,893件）の name・officialName・nameEn を NFKC で全角・半角を揃え、『株式会社』『㈱』を落として、証拠パックの全文（sections.json と *.txt）と照合した。名前が当たった中で関係として印字されていたのは、日本航空、ANAホールディングス、日本空港ビルデング、新日本空調、安藤・間、京浜急行電鉄。残りは役員略歴の勤務先（富士石油、日本電気など）や普通名詞・社名の部分一致。
- relatedCompanies: 結んだ相手の同一性: 日本航空㈱は有報が住所（東京都品川区東品川2丁目4番11号）と事業（定期航空運送事業）を印字し、有価証券報告書を提出している会社である旨の注記があるが、証券コードは印字していない。登録済みの japan-airlines（証券コード9201）は figures-only で description も所在地も無いため、『特徴のある正式名称の一致』と有報が印字した事業・住所だけを根拠にした。ANAホールディングス㈱は登録済みの ana-holdings の description（全日本空輸などを傘下に置く持株会社）が有報の印字（グループ経営戦略策定事業、全日本空輸㈱を100％子会社とする）と矛盾しない。日本空港ビルデング㈱（japan-airport-terminal）、新日本空調㈱（shin-nippon-air-technologies）、㈱安藤・間（hazama-ando）は、有報が社名だけを印字し、登録済みの entry が figures-only で description も所在地も無いため、特徴のある正式名称の一致と有報の印字した役割（羽田空港関連の取引、熱供給事業の運営の委託、建設・修繕工事）だけが根拠。人が見て同一性を確認してほしい。いずれも post-filing/events.tsv に該当する行は無い。
- relatedCompanies: 資本関係の種類: 有報の【関係会社の状況】は『(2) その他の関係会社』として日本航空㈱とANAホールディングス㈱を挙げ、議決権の被所有割合はそれぞれ21.33％。【提出会社の親会社等の情報】は『金融商品取引法第24条の７第１項に規定する親会社等はありません』で、親会社・関連会社の区分には載っておらず、印字どおりに other-affiliated-company とした。大株主の状況の所有割合（21.30％）は、議決権の被所有割合（21.33％）と数値が異なるが、前者は発行済株式（自己株式を除く）の総数に対する所有株式数の割合、後者は議決権の割合で、基準が違うため食い違いとはしていない。
- relatedCompanies: 取引関係の種類: 日本空港ビルデング㈱は有報が『熱供給事業・給排水事業等における主要顧客』と向きまで書くため customer、新日本空調㈱は『熱供給事業におけるオペレーション管理・運営業務の一部を委託』と書くため supplier、㈱安藤・間は『所有施設の建設及び修繕工事等の取引実績』と書くため supplier とした。いずれも株式を政策保有株式として持つ理由の説明に印字された取引内容で、貸借対照表計上額は百万円単位の表の値（日本空港ビルデング1,312百万円、新日本空調1,084百万円、安藤・間285百万円）。保有目的の記載は具体的で、取引関係の維持・強化と明記されている。
- relatedCompanies: 結ばなかった相手: 京浜急行電鉄㈱は、株式を『取引関係の維持・強化のために保有しておりましたが、当事業年度に保有株式すべてを売却しております』と有報が書く過去の保有で、現在の関係ではないため結ばない。㈱日本政策投資銀行（直接の被所有割合14.02％、借入・社債の相手）は未登録（登録対象の上場会社ではない）で、金融取引が目的の関係のため結ばない。日本マスタートラスト信託銀行、日本カストディ銀行、BNYM、NORTHERN TRUST、J.P.MORGAN、STATE STREETなどの信託口・名義人は大株主の状況に載るが、登録対象外。
- relatedCompanies: 連結子会社6社（東京空港冷暖房㈱、AFCアセットマネジメント㈱、AFC商事㈱、AIRPORT FACILITIES ASIA PTE.LTD.、AFS PROPERTIES PTE.LTD.、AFN PROPERTIES LTD.）は、【関係会社の状況】の注4で『有価証券届出書又は有価証券報告書を提出しておりません』とされ、登録対象（上場会社）ではないため結べない。非連結子会社3社（アクアテクノサービス㈱、㈱ブルーコーナー、㈱エスキューブ）も同様。
- relatedCompanies: 同じ回に登録する企業との関係: 有報の本文に、同じ回の企業（aica-kogyo、aichi-electric、aichi-steel、airman など）の名前が関係として印字されたものは無かった。
- relatedCompanies: 大株主の taxonomyGaps: 日本航空㈱とANAホールディングス㈱は other-affiliated-company で結んだため、大株主としての別の taxonomyGaps は作っていない。他の大株主（DBJ、信託口、外国法人の名義人）は登録済みの上場会社に該当しない。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は助言のみで、companySchema に requiredTermIds・proposedTerms という項目はありません。書いても組み立て時に捨てられ、捨てた旨の警告が出るのは想定どおりです（docs/pipeline.md の terms 工程の説明のとおり）。
- terms: requiredTermIds の4件はすべて既存の用語です（src/data/terms/ に annual-securities-report.json・segment.json・consolidated-subsidiary.json・subsidiary.json があることを確認）。businessModel 工程の本文で実際にリンクしたのは annual-securities-report だけです。会計基準は Japan GAAP で、ifrs は不要と判断した。
- terms: proposedTerms は有報に実際に出てくる語（地域冷暖房・ノンアセット事業・空港機能施設事業者・資産除去債務・プロパティマネジメント）に限った。提案中の用語にはリンクしていない。
- terms: 各 note は用語の一般的な意味に加えて、有報が当社について書いている事実を添えた。一般的な意味の部分は有報の記載ではなく編集上の説明のため、用語として登録する際は外部の一次資料に出典をつけて確認が必要。この工程では確認していない。『ノンアセット事業』は有報が定義していない語のため、note で推測であることを明示した。note に金額は書いていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 空港施設（airport-facilities）の主たる業界（空港内不動産事業・空港内インフラ事業） → 提案: 空港関連インフラ・施設（空港内の施設賃貸と、熱供給・給排水・通信のインフラ運営）。有報は、空港内の不動産賃貸と、空港内の熱供給・給排水・共用通信を、航空会社や空港関連会社向けに提供する事業を、主な事業としている。賃貸の面は real-estate、熱供給の面は energy で言い表せるが、空港という場所に固有の施設・インフラ提供という性質と、給排水運営事業・共用通信事業は、現在の区分では言い表せない。
