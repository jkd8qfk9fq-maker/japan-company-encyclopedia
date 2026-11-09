# GA technologies — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＧＡ　ｔｅｃｈｎｏｌｏｇｉｅｓ |
| 証券コード | 3491 |
| docID（データを取り出した文書） | `S100XMV3` |
| 原本 docID | `S100XHWU` |
| 提出日（原本） | 2026-01-28 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | S100XMV3／有効文書 S100XMV3（2026-11-07 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XMV3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＧＡ　ｔｅｃｈｎｏｌｏｇｉｅｓ / 3491 / docID S100XHWU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 5 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ga-technologies: 10 件の数値を有報XBRLと照合
有報: 株式会社ＧＡ　ｔｅｃｈｎｏｌｏｇｉｅｓ 訂正有価証券報告書－第13期(2024/11/01－2025/10/31) (docID S100XMV3)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-10-31","previousFiling":1841000000,"latestFiling":1702000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2024-10-31","previousFiling":3143000000,"latestFiling":2957000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2024-10-31","previousFiling":77130000000,"latestFiling":77203000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-10-31","previousFiling":22843000000,"latestFiling":22703000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益又は親会社の所有者に帰属する当期損失（△） / 親会社株主に帰属する当期純損失（△））。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 訂正有価証券報告書（訂正有価証券報告書－第13期(2024/11/01－2025/10/31)、docID S100XMV3）を有効文書としてこのパックを作った。原本は docID S100XHWU。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはCriticalContractsTextBlock・NotesInterestBearingLiabilitiesConsolidatedFinancialStatementsIFRSTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 非継続事業・財務諸表の組替え・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ga-technologies: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社GA　technologies」が EDINET の提出者名「株式会社ＧＡ　ｔｅｃｈｎｏｌｏｇｉｅｓ」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…ップの拡充を含むトップラインの拡大や利益率の向上を図るとともに、安定収益であ…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益は、【経営指標等】のIFRSの表が掲げる「売上収益」の系列を採用した。日本基準の表は第9期・第10期のみで、IFRS移行前の参考値である（IFRSは第10期から適用し、第9期の数値もIFRSの表に掲げられている）。純利益もIFRSの表の「親会社の所有者に帰属する当期利益」を採用した。
- businessModel: 前期有報との差異（2024年10月期の当期利益1,841百万円→1,702百万円など）は、企業結合に係る暫定的な会計処理の確定によるものであることが【経営指標等】の注5、MD&A、セグメント注記のいずれにも明記されているため、financialNotes に記録し、needsReview には入れなかった。値は今期有報のものを採用している。
- businessModel: 有効文書は訂正有価証券報告書（docID S100XMV3、原本S100XHWU）だが、分類は record-only で、財務数値・本文とも原本と同一（差異は重要な契約等と有利子負債の注記のみ）であるため、needsReview には入れなかった。出典の title・url・publishedAt は訂正有報の値を用いた。
- businessModel: 政策保有株式（特定投資株式・みなし保有株式）は「該当事項はありません」と印字されており、政策保有による関連付けは行っていない。
- businessModel: 中期経営計画の数値目標（2026年10月期）には利益水準の目標が含まれるため、文章には金額・率を書かず、方針の内容だけを strategy に要約した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上収益（2025年10月期）の大きい順にした（RENOSYマーケットプレイス241,331百万円、ITANDI6,538百万円）。「その他」は有報が報告セグメントに含まれないと明記する区分のため最後に置いた（1,077百万円）。
- businessStructure: RENOSYマーケットプレイス事業には children を置かなかった。売上収益の分解注記は「購入DX及び売却DX事業226,647百万円」「その他9,411百万円」「その他の源泉から認識した収益5,272百万円」という収益認識の区分で、【事業の内容】の6つのサービス（購入DX・売却DX、高級賃貸、米国不動産、オーナー向け管理、タイ、中華圏）とは対応しないため、区分に金額を結びつけなかった。
- businessStructure: 連結子会社は57社（【事業の内容】）。【関係会社の状況】に載る主な子会社のうち、株式会社マーキュリーは上場会社で関連企業として別工程で結んだ。その他の子会社は未上場である。
- businessStructure: 株式会社リコルディは2025年8月1日付で株式会社RENOSY Ricordiに商号変更している（【関係会社の状況】注3）。
- businessStructure: 株式会社Housmartは2025年11月1日（決算日後）にイタンジ株式会社に吸収合併され解散した。本事業構成は2025年10月31日現在のもので、この点は businessModel 工程の needsReview に記録した。
- history: 【沿革】の表は途中で崩れており、2018年10月から2020年10月までの区間は年月セル19件に対して事象26件、2020年11月から2022年10月までの区間は年月セル13件に対して事象20件と数が一致せず、年月と事象を対応づけられなかった。そのためこの2区間の事象は、他の節で年を裏付けられるものだけを採用した（2020年の神居秒算の事業取得と2021年11月のDear Life Corporation Ltd.の買収は、連結財務諸表注記「企業結合」の記載で裏付けた）。
- history: 対応づけできず採用しなかった事象（2018年10月〜2020年10月）: GA Fundの組成検討、リーガル賃貸保証（現・株式会社RENOSY ASSET MANAGEMENT）の完全子会社化、イタンジ株式会社の完全子会社化、株式会社RENOSY FINANCEの設立、オーナー向けアプリの提供開始、本社の六本木移転、「Mortgage Gateway」の提供開始、「RENOSY SELL」の提供開始、RENOSY STAND SHIBUYAの開設、福岡営業所の開設、「電子契約くん」の提供開始、RENOSY SHOWROOM ROPPONGIの開設、イエスリノベーション（現・株式会社RENOSY DESIGN & BUILD）の完全子会社化、「申込受付くん」導入社数No.1認定、札幌営業所の開設、株式会社RENOSY Xの設立、「RENOSY ASSET」の提供開始、株式会社Modern Standardの完全子会社化、資産運用型中古マンション販売実績No.1認定、「2秒でブッカク！」の提供開始、賃貸管理事業の吸収分割、ITANDI BBのリニューアル、横浜営業所の開設、DX銘柄への初選定、グッドデザイン賞の受賞。
- history: 対応づけできず採用しなかった事象（2020年11月〜2022年10月）: 株式分割、Modern StandardとRENOSYのサービス統合、株式会社ジャックスと株式会社RENOSY Xの業務提携、公募・第三者割当による新株式発行、株式会社パートナーズの完全子会社化、DX銘柄への2年連続選定、「ノマドクラウド」のIT導入補助金対象認定、資産管理アプリ内での交付書類電子化、賃貸管理プラン「NEOインカム」の提供開始、株式会社リコルディ（現・株式会社RENOSY Ricordi）の完全子会社化、不動産取引のオンライン化実現、グロース市場への移行（年は2018年の上場の項目に移行の事実のみ記した）、DLホールディングス株式会社の完全子会社化、「電子契約くん」のアップデート、DX銘柄への3年連続選定、「内装工事くん」の提供開始、株式会社ダンゴネットの子会社化、「OWNR by RENOSY」のアップデート。
- history: 2013年から2018年9月までと2023年3月以降の区間は、年月と事象が対応して印字されていたため、そのまま採用した。2023年12月のCore Asset Management（2023年12月1日完了）、2024年1月のHousmart（2024年1月4日完了）、2024年3月のRW OpCo（2024年3月1日完了）、2024年8月のマーキュリー（2024年8月21日に52.3％取得）は、企業結合注記の記載とも一致している。
- history: 2025年11月のイタンジによるHousmartの吸収合併は、決算日後の出来事として【沿革】の注記と【関係会社の状況】注8に記載されており、沿革の項目として採用した。この点は businessModel 工程の needsReview にも記録した。
- industry: 主たる業界は、最大の報告セグメントであるRENOSYマーケットプレイス事業（2025年10月期の外部売上収益241,331百万円、全体の約97％）が不動産の売買・賃貸・管理であることから real-estate とした。
- industry: ITANDI事業は不動産会社向けSaaSの開発・運営を独立した報告セグメントとして開示しており（同6,538百万円）、賃貸名人などのソフトウエアパッケージの開発・販売・保守も行っているため、2つ目に it を付けた。
- industry: その他事業のM&A仲介は報告セグメントではなく規模も小さいため、対応する業界は付けなかった。
- relatedCompanies: 連結子会社57社のうち related-candidates.json に含まれるのは株式会社マーキュリー（5025）のみで、同社だけを結んだ。株式会社パートナーズ、イタンジ株式会社、株式会社RENOSY Ricordi、株式会社Modern Standard、株式会社RENOSY ASSET MANAGEMENT、株式会社Core Asset Management、株式会社神居秒算、株式会社ダンゴネット、株式会社Housmart、株式会社スピカコンサルティング、RW OpCo, LLCなど他の子会社は未上場で候補に含まれていない。
- relatedCompanies: 【大株主の状況】（2025年10月31日現在）の上位は、樋口龍氏（25.82％）、合同会社GGA（11.25％）、外国の保管機関などであり、上場している事業会社は候補に含まれていないため、major-shareholder の関連付けは行わなかった。
- relatedCompanies: オリックス（8591）: 【沿革】に2024年7月の「オリックス銀行に対する第三者割当増資」の記載があるが、相手方はオリックス株式会社ではなく、その子会社であるオリックス銀行（候補に含まれない銀行）であり、資金調達を目的とする取引のため、オリックス株式会社としては結ばなかった。
- relatedCompanies: ジャックス（8584）: 【沿革】に株式会社ジャックスと子会社の株式会社RENOSY Xが業務提携し、保証業務に特化した住宅ローン手続きシステムを開発した旨の記載があるが、沿革上の過去の出来事としてのみ現れ、現在の取引・提携関係を述べた記載が他にないため結ばなかった。
- relatedCompanies: 住友不動産（8830）: 本店の所在地が「住友不動産六本木グランドタワー」であることが住所として現れるだけで、同社との取引・提携・資本関係を述べた記載はないため結ばなかった。
- relatedCompanies: レイ（4317）・セキ（7857）・コア（2359）・エン（4849）・理経（8226）・田谷（4679）: いずれも ambiguous な断片一致である。レイは「パートナーズ」等の文中の断片、セキは「セキュリティ」の断片、コアは「コア事業」等の一般語と子会社名「株式会社Core Asset Management」の断片、エンは「エンプロイープロテクション」等の断片、理経は「管理経営」等の断片、田谷は大株主の住所「世田谷区」の断片であり、各社への言及はない。
- relatedCompanies: ポート（7047）: 「サポート」「ポートフォリオ」の断片一致で、ポート株式会社への言及はない。
- relatedCompanies: ステップ（9795）: 収益認識の「5ステップアプローチ」の語で、株式会社ステップへの言及はない。
- relatedCompanies: No．1（3562）: 「申込受付くん」の導入社数No.1認定など、順位の表現としての一致で、株式会社No．1への言及はない。
- relatedCompanies: ランド（8918）: 本店所在地のビル名「住友不動産六本木グランドタワー」の断片一致で、株式会社ランドへの言及はない。
- relatedCompanies: キャリア（6198）: 「キャリア支援」等の一般語で、株式会社キャリアへの言及はない。
- relatedCompanies: イノベーション（3970）: 経営理念の文言「テクノロジー×イノベーション」の語で、株式会社イノベーションへの言及はない。
- relatedCompanies: トランザクション（7818）: 「オンライントランザクション」の語で、株式会社トランザクションへの言及はない。
- relatedCompanies: アルテック（9972）: 子会社の旧社名「株式会社マーキュリーリアルテックイノベーター」の断片一致で、アルテック株式会社への言及はない。
- relatedCompanies: ベース（4481）: 「データベース」の語で、ベース株式会社への言及はない。
- relatedCompanies: カバー（5253）: 「業務全般をカバーする」の語で、カバー株式会社への言及はない。
- relatedCompanies: フリー（4478）: 「フリー・キャッシュ・フロー」の語で、フリー株式会社への言及はない。
- relatedCompanies: レック（7874）: 「フレックスタイム」の断片一致で、レック株式会社への言及はない。
- relatedCompanies: トラスト（3347）: 日本マスタートラスト信託銀行（信託口）の信託口としての記載のみで純投資の保管名義であり、候補の listing もコードリストにないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 2025年11月1日（決算日後）、連結子会社の株式会社Housmartは、連結子会社のイタンジ株式会社を存続会社とする吸収合併により解散した（【関係会社の状況】注8・【沿革】の注記）。本エントリーのグループ構成は2025年10月31日現在のものであるため、確認のため記録する。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
