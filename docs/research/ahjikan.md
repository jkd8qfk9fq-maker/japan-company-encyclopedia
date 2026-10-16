# あじかん — research log

Registered: 2026-10-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社あじかん |
| 証券コード | 2907 |
| docID（データを取り出した文書） | `S100YGFU` |
| 原本 docID | `S100YGFU` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-10-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGFU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社あじかん / 2907 / docID S100YGFU（id は英語表記「AHJIKAN CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 9 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 10 件） |
| history | completed | 0 | history-agent の成果物あり（警告 6 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ahjikan: 10 件の数値を有報XBRLと照合
有報: 株式会社あじかん 有価証券報告書－第62期(2025/04/01－2026/03/31) (docID S100YGFU)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":45315990000,"latestFiling":45315000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":47433388000,"latestFiling":47433000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":50240380000,"latestFiling":50240000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":51045379000,"latestFiling":51045000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":635033000,"latestFiling":635000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":267967000,"latestFiling":267000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":1509888000,"latestFiling":1509000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":1548947000,"latestFiling":1548000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":921897000,"latestFiling":921000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":466258000,"latestFiling":466000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":2266691000,"latestFiling":2266000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":2221338000,"latestFiling":2221000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":24440636000,"latestFiling":24440000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":25102922000,"latestFiling":25102000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":27640861000,"latestFiling":27640000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":26897028000,"latestFiling":26897000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":13874822000,"latestFiling":13874000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":14157409000,"latestFiling":14157000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":15844755000,"latestFiling":15844000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":17388775000,"latestFiling":17388000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ahjikan: 本文の金額 16 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの確認: 株式会社あじかん（証券コード2907、docID S100YGFU、第62期 2025年4月1日〜2026年3月31日、2026年6月23日提出、Japan GAAP、連結決算あり）。決算期ラベルは表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」、出典idは yuho-2026。accessedAt は date -u +%F の2026-10-08。訂正報告書なし、fiscalYearChange は null、irregularPeriods は空。
- businessModel: financialNotes: draft-entry.json の _注記の候補 は、2022〜2025年3月期の売上・利益・純利益・総資産・純資産が前期有報と違うこと（各年とも今期有報の値を採用）を20件並べています。理由は、【主要な経営指標等】の注2が『第62期より金額の表示単位を千円単位から百万円単位に変更しております。なお、比較を容易にするため、第61期以前についても、表示単位を千円単位から百万円単位に変更しております』と書いていることです。前期の有報の千円単位の金額と一致しないのは単位の変更による端数の違いで、数値の訂正や修正再表示ではありません（本文はその点を『百万円未満の端数が一致しない』とだけ書きました）。千円単位の金額は本文に書いていません。2026年3月期の note は書いていません（表示単位が変わった当期自体で、比較の対象になる前期の数値は2025年3月期の欄に書きました）。
- businessModel: 金額の出典（有報の本文に『○○百万円』と単位つきで印字されている値だけを使った）: 売上高51,430百万円（前期比0.8％増）、営業利益1,279百万円（34.9％減）、経常利益1,642百万円（26.1％減）、親会社株主に帰属する当期純利益1,111百万円（28.3％減）、業務用食品等の外部顧客への売上高46,960百万円、ヘルスフード4,007百万円は MD&A（md-and-a.txt）の印字。
- businessModel: 減益の理由は MD&A の印字（鶏卵価格が過去に例を見ない高値、人件費・物流コストの上昇、売価改定でも吸収しきれなかった）に限りました。経常利益・当期純利益の内訳（為替差益、持分法による投資利益、長期為替予約評価益、固定資産除却損）も MD&A の印字です。
- businessModel: 海外売上高: 有報は海外売上高が前期を上回ったと書くだけで、金額は書いていません（【関連情報】は本邦の外部顧客への売上高が連結売上高の90％を超えるため地域別の記載を省略）。本文に海外の金額は書いていません。
- businessModel: revenueSources の『製品と商品の合計は、外部顧客への売上高が46,960百万円』: 販売実績の表で業務用食品等は製品計（33,520百万円）と商品計（13,440百万円）の合計46,960百万円です。製品と商品を分けた金額は本文に書いていません。
- businessModel: 重要な後発事象（関東物流センター〔仮称〕の建設、投資予定額約28億円、着工予定2026年7月、事業開始予定2027年9月）: 着工予定の日付がすでに過ぎており、現在の進み具合を有報から確認できないため、本文には書いていません。
- businessModel: 継続企業の前提に関する記載はありません。EBITDA等の有報独自の指標、フリー・キャッシュ・フローの定義は本文に書いていません。投資指標の禁止語（株価・PER・ROE・自己資本利益率・配当・時価総額など）は本文に使っていません。
- businessModel: リンクは既存の用語 annual-securities-report だけ（src/data/terms/ にあることを確認）。
- businessModel: data.description（一文の説明）は47文字・句点1つ。
- businessStructure: 証拠パックの確認: 株式会社あじかん（証券コード2907、EDINETコードE00480、docID S100YGFU、第62期 2025年4月1日〜2026年3月31日、2026年6月23日提出）。決算期ラベルは表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」、出典idは yuho-2026。会計基準は Japan GAAP、連結決算あり。summary.json の amendments は status none（訂正報告書なし）、fiscalYearChange は null、irregularPeriods は空で、連結の対象期間は12か月です。
- businessStructure: 事業の構造: 有報は報告セグメントを『業務用食品等』『ヘルスフード』の2つとし、運輸業を主とする『その他』を『報告セグメントに含まれない事業セグメント』と書いています。並び順は、外部顧客への売上高の大きい順に報告セグメントを置き（業務用食品等46,960百万円、ヘルスフード4,007百万円）、報告セグメントに含まれない『その他』（462百万円）を最後に置きました。
- businessStructure: 業務用食品等の children は、MD&Aの販売実績の表（製商品別、セグメント間取引は相殺消去後）の区分を、売上高の大きい順に並べたものです。製品の区分（玉子焼類、味付かんぴょう・しいたけ類、蒲鉾類、自社企画ブランド品、その他）と商品の区分（常温食品、冷凍・冷蔵食品、その他）を横並びにしています。製品の『その他』（2,845百万円）と商品の『その他』（15百万円。表では『15』のあとに前期比『110.4』が続く）は、中身が有報に書かれていないため独立したノードにしていません。金額はこの表の印字（単位は表の見出しの百万円）で、前期比は表の印字（前連結会計年度比の％）です。
- businessStructure: ヘルスフードの内訳（ごぼう茶関連製品3,916百万円、その他90百万円）は販売実績の表にありますが、金額はノードにしていません。ヘルスフードの製品名は MD&A の印字です。
- businessStructure: 金額は MD&A が『○○百万円』と単位つきで印字している値（セグメント別の外部顧客への売上高・セグメント利益）と、販売実績の表の値だけを使いました。セグメント注記の表のセルは、単位が表の見出しにあるため本文には『百万円』を付けて書きましたが、MD&Aの本文と一致するものに限っています（その他の462百万円は販売実績の表と【セグメント情報】の外部顧客への売上高の表で一致）。
- businessStructure: customers: 有報は、主要取引先を『スーパーマーケットやコンビニエンスストアを中心とした米飯市場』『中食業態』と書くだけで、個別の社名は売上高の10％未満（『単一外部顧客への売上高が連結損益計算書の売上高の10％未満』）のため載せていません。
- businessStructure: 関係会社: 【関係会社の状況】は連結子会社4社（あじかんアグリファーム、井口産交、山東安吉丸食品有限公司、AHJIKAN FOODS,INC.）、持分法適用関連会社1社（愛康食品（青島）有限公司）、その他の関係会社1社（株式会社足利興産、被所有23.7％）を挙げます。子会社・関連会社は事業の構造の一部ではなく関係会社なので、独立したノードにしていません。その他の運輸業だけは、報告セグメントに含まれない事業セグメントとして独立したノードにし、担当する連結子会社を書きました。
- businessStructure: 重要な後発事象: 有報は、2026年6月12日の取締役会で関東物流センター（仮称）の建設（埼玉県春日部市、投資予定額約28億円）を決議したと書いています。着工予定は2026年7月、事業開始予定は2027年9月で、着工予定の日付はすでに過ぎているため、現在の進み具合を確認できず、本文には書いていません。
- businessStructure: businesses[].description に [[…]] のリンクは使っていません。
- history: 証拠パックの確認: 株式会社あじかん（証券コード2907、docID S100YGFU、第62期 2025年4月1日〜2026年3月31日、2026年6月23日提出）。この沿革は第62期の【沿革】（証拠パックの history.txt）から書いています。決算期ラベルは表紙のDEIから「2026年3月期」、訂正報告書なし、fiscalYearChange は null、irregularPeriods は空です。
- history: 【沿革】の表で年月のセルが崩れている箇所が3つあります（年月のセルが2つ続けて印字され、そのあとに事象文が連続する形）。いずれも年月の数と事象文の数が一致しているため、docs/pipeline.md の規則に従い、i番目の年月をi番目の事象に対応づけて復元しました。(1) 『1985年12月 / 1987年９月』→ 1985年12月＝株式会社大口屋の株式取得、1987年9月＝株式会社てんぐの株式取得。(2) 『2005年３月 / 2005年５月』→ 2005年3月＝子会社の株式会社政所の清算結了、2005年5月＝愛康食品（青島）有限公司の設立。(3) 『2014年５月 / 2017年11月』→ 2014年5月＝味堪（広州）餐飲管理有限公司の設立、2017年11月＝つくば工場の建設。対応づけの根拠は行の順序だけです。(1)は、てんぐの注記に『1989年７月 東京あじかんに商号変更』とあり、1987年9月より後の日付と矛盾しないこと、(3)は、味堪（広州）が2024年3月に清算結了と別の行に出てくることと矛盾しないことを確認しましたが、どちらも日付そのものの裏付けではありません。(2)の2つの出来事の順序は、有報の他の節に裏付けがありません。
- history: 【沿革】の表の行は、すべて独立した項目または項目内の記載として使っています。落とした行はありません。1年1件にまとめており、1978年（2月・3月・6月・7月）、1990年（1月・4月・12月）、1992年（4月・5月）、2003年（5月・10月）、2005年（3月・5月）、2022年（3月・4月）は同じ年の出来事を1件の description に並べました。別の年の出来事を同じ項目に入れたものはありません。
- history: 1978年7月に吸収合併した『愛媛県松山市の株式会社あじかん』は、1978年3月に現社名へ変更した当社とは別の同名会社で、有報はそれ以上の説明を書いていません。
- history: significance に書いた『現在の関係会社の状況』は【関係会社の状況】と【主要な設備の状況】の印字です。株式会社足利興産（その他の関係会社、被所有23.7％）は沿革にも出てこないため、書いていません。
- history: 年表の title に [[company:…]] のリンクは使っていません。description と significance にも [[…]] のリンクは使っていません。金額は、設立時の資本金100万円（沿革の印字）だけです。
- industry: 決算期は表紙のDEI（当事業年度終了日2026-03-31、第62期）から「2026年3月期」。accessedAt は date -u +%F の2026-10-08。この工程は src/types/company.ts の INDUSTRY_IDS（19種）から選んだ。
- industry: food を primary にした根拠: 有報は、鶏卵加工製品・野菜加工製品・水産練製品・その他食品の製造、販売、卸売を主な事業とし、報告セグメントは『業務用食品等』と『ヘルスフード』（ごぼう茶関連製品）で、どちらも食品メーカーの事業です。経営方針も『“食”に携わる企業』『需要創造型食品メーカーへの挑戦』と書きます。2026年3月期の売上高51,430百万円のうち、業務用食品等が46,960百万円、ヘルスフードが4,007百万円で、報告セグメントはどちらも food の範囲です。
- industry: transportation を付けない根拠: 運輸業（株式会社井口産交）は、報告セグメントに含まれない『その他』で、外部顧客への売上高は462百万円と、連結売上高51,430百万円の1％程度です。自社の食品の輸送を主に担う子会社で、独立した業界として読者に示すほどの金額の開示（報告セグメントとしての利益や資産）がないため、足していません。retail、trading も、販売先に流通業があるだけで、当社自身の事業ではないため付けていません。
- industry: primary はちょうど1つ。当てはまる区分がなく暫定にした業界はないため、taxonomyGaps は書いていない。
- relatedCompanies: 決算期は表紙のDEI（当事業年度終了日2026-03-31）から「2026年3月期」。accessedAt は date -u +%F の2026-10-08。relatedCompanies を書く直前（2026-10-08）に src/data/companies/ の全エントリーの name・officialName・nameEn を NFKC で全角・半角を揃え、『株式会社』『㈱』を落として、証拠パックの全文と照合した。
- relatedCompanies: 結んだ13社は、いずれも【株式の保有状況】（保有目的が純投資目的以外の目的である投資株式）の特定投資株式の表が、保有目的に『当社の販売先』『当社の仕入先』『当社の主要な物流委託先』と、取引の向きを印字している会社です。向きが印字されているため customer / supplier を使い、business-partner は使っていません。保有の合理性の欄は『営業取引の関係強化を目的』と明記しており、情報収集目的の保有ではありません（政策保有株式の注意に該当しない）。物流委託先の鴻池運輸は、当社に物流サービスを提供する側として supplier としました。リテールパートナーズ・バローホールディングス（販売先）とニップン（仕入先）は、有報が『同社の関係会社は当社の販売先／仕入先』と書くため、取引相手が保有先そのものではなく関係会社であることを description に明記して結びました（グループ単位の関係）。
- relatedCompanies: 同一性の確認: 有報は証券コードを印字しないため、社名の完全一致（NFKC・『株式会社』を除いて照合）と、保有目的に書かれた取引上の役割（販売先＝食品小売・卸売、仕入先＝食品メーカー・包装資材メーカー、物流委託先＝運輸会社）が掲載済みエントリー（ハローズ2742、イズミ8273、フジ8278、エイチ・ツー・オー リテイリング8242、カネ美食品2669、加藤産業9869、マルヨシセンター7515、はごろもフーズ2831、丸東産業7894、鴻池運輸9025、リテールパートナーズ8167、バローホールディングス9956、ニップン2001）の事業と矛盾しないことで確認した。掲載済みエントリーは数値のみで所在地・事業内容の本文を持たないため、所在地の照合はできていない。『株式会社フジ』『株式会社イズミ』は、掲載済みのフジ・コーポレーション（7605）やFUJI（6134）、フジ住宅（8860）とは別の会社として、社名が完全に一致するフジ（8278）とイズミ（8273）だけを選んだ。
- relatedCompanies: 結ばなかった相手（保有先）: ㈱ひろぎんホールディングス、㈱三菱UFJフィナンシャル・グループ、㈱山口フィナンシャルグループは、『同社の関係会社は当社の主要取引金融機関であり、長期的な財務の安定性維持を目的』とする金融取引のため結ばない。東洋証券㈱は『持株運営委託先』（持株会運営の委託）で金融取引のため結ばない。理研ビタミン㈱は『株式保有の合理性・必要性が乏しいことを確認できたため、随時、売却予定』と書かれる保有で、取引の記載がないため結ばない。
- relatedCompanies: 結ばなかった相手（未登録）: ㈱梅の花グループ（『当社の販売先』、2025年5月1日付で㈱梅の花から社名変更と有報が注記）は src/data/companies/ に掲載が無い。株式会社足利興産（広島市中区、資産管理等、資本金10百万円、被所有23.7％）は有報の【関係会社の状況】が『その他の関係会社』と明記しているが、掲載が無く、非上場の資産管理会社と読めるため結べない（関係の種類は other-affiliated-company）。登録対象に加えない。
- relatedCompanies: 子会社・関連会社: 連結子会社4社（あじかんアグリファーム、井口産交、山東安吉丸食品有限公司、AHJIKAN FOODS,INC.）と持分法適用関連会社の愛康食品（青島）有限公司は、いずれも有価証券報告書を提出している会社ではなく（注2）、掲載が無いため結べない。
- relatedCompanies: 大株主（2026年3月31日現在）: ㈱足利興産23.66％、あじかん三栄持株会、㈱広島銀行、あじかん株式持株会、㈱山口銀行、㈱三菱UFJ銀行、明治安田生命保険相互会社、広島海苔㈱、共栄火災海上保険㈱、西和興産㈱。持株会・銀行（広島銀行・山口銀行・三菱UFJ銀行はそれぞれ持株会社の子会社で、銀行そのものは掲載が無い）・生命保険・損害保険・非上場会社で、掲載済みのエントリーにありません。大株主は関係の種類が無く、相手が掲載済みのときだけ taxonomyGaps に書く方針のため、書いていません。
- relatedCompanies: 【関連当事者情報】は『該当事項はありません』、【重要な契約等】も『該当事項はありません』。【提出会社の親会社等の情報】は『親会社等はありません』。
- relatedCompanies: 同じ回に登録する企業（aeria、aeroedge、afc-hd-ams-life-science、ageha、agent-ig-holdings、agora-hospitality-group、agratio-urban-design、ags、ahc-group、ahresty、ai-cross、ai-fusion-capital-group、ai-holdings、ai-inside、ai-partners-financial、ai-robotics、ai-storm、ai、aiai-group）との関係として印字された相手は、有報にありませんでした。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は助言のみで、companySchema に requiredTermIds・proposedTerms という項目はありません。書いても組み立て時に捨てられ、捨てた旨の警告が出るのは想定どおりです。
- terms: requiredTermIds の4件はすべて既存の用語です（src/data/terms/ に annual-securities-report.json・segment.json・consolidated-subsidiary.json・subsidiary.json があることを確認）。businessModel 工程の本文で実際にリンクしたのは annual-securities-report だけです。会計基準は Japan GAAP で、ifrs は不要と判断しました。
- terms: proposedTerms は有報に実際に出てくる語に限りました。提案中の用語にはリンクしていません。各 note は用語の一般的な意味に加えて、有報が当社について書いている事実を添えました。一般的な意味の部分は有報の記載ではなく編集上の説明のため、用語として登録する際は外部の一次資料に出典をつけて確認が必要です。この工程では確認していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
