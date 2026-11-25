# イリソ電子工業 — research log

Registered: 2026-11-19（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | イリソ電子工業株式会社 |
| 証券コード | 6908 |
| docID（データを取り出した文書） | `S100Z5N2` |
| 原本 docID | `S100Z57M` |
| 提出日（原本） | 2026-09-30 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100Z5N2, S100Z56F, S100Z56C, S100Z568, S100Z566／有効文書 S100Z5N2（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z5N2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | イリソ電子工業株式会社 / 6908 / docID S100Z57M（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 7 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
iriso-electronics: 10 件の数値を有報XBRLと照合
有報: イリソ電子工業株式会社 訂正有価証券報告書－第60期(2025/04/01－2026/03/31) (docID S100Z5N2)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":43863000000,"latestFiling":43849000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":52903000000,"latestFiling":52339000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":55271000000,"latestFiling":55814000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":56332000000,"latestFiling":56385000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":3913000000,"latestFiling":3667000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":5541000000,"latestFiling":5279000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":5593000000,"latestFiling":5340000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":2662000000,"latestFiling":2512000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":4838000000,"latestFiling":4653000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":7661000000,"latestFiling":7542000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":7189000000,"latestFiling":7078000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":5504000000,"latestFiling":5567000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":73153000000,"latestFiling":72397000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":82491000000,"latestFiling":81722000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":96856000000,"latestFiling":95829000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":91370000000,"latestFiling":90333000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":61776000000,"latestFiling":61103000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":68019000000,"latestFiling":67256000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":77016000000,"latestFiling":75870000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":71196000000,"latestFiling":69900000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第60期(2025/04/01－2026/03/31)、docID S100Z5N2）を有効文書としてこのパックを作った。原本は docID S100Z57M。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはIndependentAuditorsReportConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 訂正有価証券報告書－第59期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第58期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第57期(2022/04/01－2023/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第56期(2021/04/01－2022/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
iriso-electronics: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書－第60期（docID S100Z5N2、2026年10月1日提出）である。原本（S100Z57M）との差異は監査報告書のテキストブロックのみで、財務の数値と本文は同一（record-only）のため、出典は訂正有報に向け、訂正の不完全を理由とする needsReview は付けていない。
- businessModel: 主要な経営指標等の過年度数値（2022年3月期～2025年3月期）が前期有報と異なるのは、第三者委員会の調査（2026年9月29日に調査報告書の公表）で判明した海外子会社の売上の前倒し計上等の誤謬の訂正による修正再表示であり、理由が有報の注記に印字されているため financialNotes に記録した。登録の数値は当期有報の値を使っている。第56期～第59期の訂正報告書は2026年9月30日に提出されている。
- businessModel: 連結財務諸表の注記には、本件不適切行為により今後、金銭的負担や補償費用等が発生する可能性が記載されている。重要な後発事象は連結・個別とも「該当事項はありません」であり、期末日現在の体制と数値に影響する事項ではないため needsReview には入れず、ここに記録する。
- businessModel: MD&Aの純利益の増減理由（第三者委員会の調査関連費用の計上）は禁止語を含むため、本文の flow には理由を転記せず数値のみを書いた。
- businessModel: 中期経営計画の目標のうち営業利益率、EPS、ROE、ROIC、配当性向などの指標と、「資本コストと株価を意識した経営」の重点施策は投資・利益率の語を含むため、strategy には転記せず、売上高目標と重点施策の内容のみを要約した。
- businessModel: 財務諸表の組替えについては、表示方法の変更等に当たる注記は確認できず、標準的な注記の範囲と判断して warnings のみとした。
- businessModel: Wikipediaの記事は有報を超える補足が乏しいため使っていない。
- businessStructure: 報告セグメントは生産・販売体制を基礎とした地域別（日本、アジア、欧州、北米）であり、子は外部顧客への売上高の大きい順に並べた。金額はセグメント情報の外部顧客に対する売上高の印字どおりで、セグメント利益は転記していない。
- businessStructure: 【事業の内容】の機能別の子会社構成（生産子会社4社、販売子会社7社、設計・研究開発の委託先子会社1社）は、地域別セグメントの子の説明に織り込んだ。連結子会社12社はいずれもコネクタ事業であり、個別の子会社は関連企業としては結んでいない。
- businessStructure: メキシコのIRISO ELECTRONICS Mexico，S.A. de C.V.は沿革に設立の記載があるが【関係会社の状況】の連結子会社には含まれておらず、非連結子会社1社は名称が印字されていないため、特定の会社として記載していない。
- businessStructure: 秋田工場は2025年4月に開設され、期末日現在の主要な設備に含まれているため、設備の事実として日本セグメントの説明に含めた。
- history: 沿革の年月は行ごとに印字されており、年だけを year に採った（月は書かない）。資本金の金額は転記していない。
- history: 2022年の有限会社エスジーディーの株式譲受による完全子会社化は、2024年の吸収合併の行の説明に統合して記録した。
- history: 2016年のメキシコ子会社設立は、期末日現在の連結子会社に含まれないため沿革には採らず、businessStructure の warnings に記録した。
- industry: 主たる業界は electronics（電機）とした。事業はコネクタ（電子部品）の製造・販売が大半であり、閉じたリストでは electronics が当たる。報告セグメントは地域別であり、製品分野別の売上高は独立して開示されていない。
- industry: 車載向けが中心だが、事業そのものは電子部品の製造・販売であり自動車の事業ではないため automotive は付けていない。半導体製造装置はインダストリアル市場の顧客分野の一つとして述べられるにとどまり、半導体向けの部材・装置を事業として開示していないため semiconductors は付けていない。閉じた集合の値で表現できるため taxonomyGaps は記録しなかった。
- relatedCompanies: ケル株式会社（kel）は、【研究開発活動】に「ケル株式会社との共同開発により、9GHz対応の同軸WtoBコネクタの試作品を作製しました」と相手についての技術協力が印字され、関連候補に正式名称が一致するため技術提携として結んだ。金額は記載していない。
- relatedCompanies: 高速（kohsoku、ambiguous）は「高速伝送」等の一般語への一致、セキ（seki、ambiguous）は「セキュリティ」等への部分一致、エン（en、ambiguous）は当社子会社の旧称「イリソエンジニアリング」等への部分一致で、いずれも取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: キャリア（career）は人材育成の記述中の「キャリア形成」、鈴木（suzuki-6785、ambiguous）は代表取締役社長鈴木仁の氏名、テイン（tein）は「インフォテインメント」等への部分一致であり、いずれも相手企業についての記述ではないため結ばなかった。
- relatedCompanies: ベース（base-4481）は「ベースアップ」、レイ（ray、ambiguous）は「パワートレイン」等、ビジョン（vision）は「長期ビジョン」、コロナ（corona）は感染症リスクの記述、パス（path、ambiguous）は「パーパス」、ポート（port）は「事業ポートフォリオ」、リコー（ricoh）は「リコール」、リード（the-lead）は「リードタイム」、コア（core、ambiguous）は「スコアリング」等、カバー（cover）は「カバー率」、キング（king）は「スタッキング」、ランド（land）は「ブランド」、ティア（tear）は制度名、ゼロ（zero、ambiguous）は「実質ゼロ化」、平和（heiwa、ambiguous）は安全衛生方針中の「平和に」、イノベーション（innovation）は「イノベーションが促進」、イシン（ishin）は切替の取組の記述、グリッド（grid）は顧客分野の例示「スマートグリッド」、No.1（no-1）は経営方針の標語への一致であり、いずれも取引・提携の印字がないため結ばなかった。
- relatedCompanies: トラスト（trust）は日本マスタートラスト信託銀行（信託口）への一致で、信託口は純投資の名義であり、候補情報でもコードリストにないとされているため結ばなかった。日本カストディ銀行（信託口）も同様に純投資の名義のため結ばなかった。
- relatedCompanies: 株式会社シティインデックスイレブンスは大量保有報告書の記載が注記されるのみで、当社として実質所有株式数を確認できない旨が印字されており、関連候補にも含まれていないため結ばなかった。
- relatedCompanies: 保有目的が純投資目的以外の目的である投資株式は「該当事項はありません」と印字されており、特定投資株式の開示はない。主要な顧客で売上高の10％以上を占める相手先はないと印字されている。
- relatedCompanies: 連結子会社12社はグループ内の会社であり、businessStructure に記載した。関連企業としては結んでいない。
- terms: 助言: 用語「基板対基板コネクタ（BtoBコネクタ）」は、プリント基板の接続用に開発されたコネクタの総称で、ボード・ツー・ボードコネクタとも呼ばれます（【事業の内容】に印字）。
- terms: 助言: 用語「FPC/FFCコネクタ」は、FPC基板（Flexible Printed Circuits）やFFCケーブル（Flexible Flat Cable）の接続用に開発されたコネクタの総称です（【事業の内容】に印字）。
- terms: 助言: 用語「ZIF（Zero Insertion Force）」は、コネクタの挿入時に力を加えずにロック可能なタイプを指します（【事業の内容】に印字）。
- terms: 助言: 用語「フローティングBtoBコネクタ」は、高速伝送に対応する可動式の基板対基板コネクタで、当社グループが製品開発に注力しています（【研究開発活動】に印字）。
- terms: 助言: 用語「WtoBコネクタ」は、ワイヤーと基板を接続するコネクタで、統合ECU分野向けにスケーラブルコネクタの投入が進められています（【経営方針、経営環境及び対処すべき課題等】に印字）。

## 要確認（status に反映）

- businessModel: 海外子会社における不適切な金銭の交付等の疑義が生じたため、当社は2026年4月27日、外部の独立した専門家による第三者委員会の設置及び2026年3月期決算発表の延期を公表し、その後判明した他の会計処理及び品質・検査上の問題の有無を含めて調査を進めました。第三者委員会は2026年9月28日に調査報告書を提出し、当社は同月29日に調査報告書の公表に関するお知らせを出しました。調査の結果、海外子会社2社における不適切な金銭交付、海外子会社における決算作業及び監査の遅延、2023年3月期及び2024年3月期における海外子会社での売上の前倒し計上、その他会計処理の誤謬、並びに当社における品質管理及び品質保証上の問題等の事実が判明しました。連結財務諸表の注記では、連結子会社2社において外国公務員等に対する不適切な金銭供与及びその疑義が判明した旨が記載されています。
- businessModel: これを受けて過年度の決算は訂正され、第56期から第59期までの有価証券報告書の訂正報告書が2026年9月30日に提出されました。主要な経営指標等の過年度の数値（2022年3月期から2025年3月期）は修正再表示後のものであり、本登録の数値は修正再表示後の当期の有価証券報告書の値です。第60期の有価証券報告書についても訂正報告書（2026年10月1日提出）が有効文書ですが、原本との差異は監査報告書のテキストのみで、財務の数値と本文は同一です。この影響で2026年3月期の有価証券報告書の提出は遅れ、提出期限延長に関する承認申請書の提出が2026年6月29日に公表されています。当期は、第三者委員会に係る調査費用や過年度決算訂正関連費用等として、特別調査費用等1,334百万円を計上しました。
- businessModel: 連結財務諸表の偶発債務の注記には、本件に関連して今後、日本及び海外現地の関係法令に基づき罰金等を負担する可能性があるものの、現時点ではその影響額を合理的に見積もることは困難である旨、また品質管理及び品質保証上の問題に関して再検査の実施や認定書類の再提出等の対応費用が発生する可能性があり、合理的に見積ることが可能なものについては品質関連費用引当金を計上しているものの、引当額を超える追加的な対応費用が発生する可能性があり、その影響額を合理的に見積もることは困難である旨が記載されています。事業等のリスクにも、刑事処分や訴訟等の可能性、金銭的負担や補償費用の発生、信用低下や認証の停止・取り消しによる販売活動への影響等が記載されています。当社は再発防止策として、コンプライアンス最優先の企業風土への改革、ガバナンス推進部の新設を含む本社における管理体制の強化等を掲げ、内部統制及びコーポレート・ガバナンス体制の強化を通じて信頼回復に努める旨を記載しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
