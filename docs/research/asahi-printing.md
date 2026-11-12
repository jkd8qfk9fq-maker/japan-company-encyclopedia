# 朝日印刷 — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 朝日印刷株式会社 |
| 証券コード | 3951 |
| docID（データを取り出した文書） | `S100YEXW` |
| 原本 docID | `S100YEXW` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEXW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 朝日印刷株式会社 / 3951 / docID S100YEXW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asahi-printing: 10 件の数値を有報XBRLと照合
有報: 朝日印刷株式会社 有価証券報告書－第110期(2025/04/01－2026/03/31) (docID S100YEXW)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":38806512000,"latestFiling":38806000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":40302830000,"latestFiling":40302000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":41871488000,"latestFiling":41871000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":43945035000,"latestFiling":43945000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":1776211000,"latestFiling":1776000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":1707679000,"latestFiling":1707000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":1627574000,"latestFiling":1627000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":1704990000,"latestFiling":1704000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":2523035000,"latestFiling":2523000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":2535787000,"latestFiling":2535000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":2323352000,"latestFiling":2323000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":2165187000,"latestFiling":2165000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":69225513000,"latestFiling":69225000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":65138486000,"latestFiling":65138000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":68698495000,"latestFiling":68698000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":70462932000,"latestFiling":70462000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":31649279000,"latestFiling":31649000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":32828260000,"latestFiling":32828000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":34171990000,"latestFiling":34171000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":35572091000,"latestFiling":35572000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
asahi-printing: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみとした。セグメント利益やその他の利益の金額、研究開発費の金額、中期経営計画の定量目標の金額は書いていない。
- businessModel: 修正再表示チェックの差異はすべて100万円未満で、前期有報の円単位の値と当期有報の百万円単位の値を百万円で切り捨てると全行が一致する表示上の丸めであるため、financialNotes には記録せず、登録数値は当期有報の値とした。会計方針の変更や変則決算の印字もないため、financialNotes は空である。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。提出後の文書（otherFilingsInWindow）は空だったため、後発文書の確認（ack）は不要だった。postFilingAcknowledged は対象なし。
- businessModel: 2026年5月11日に公表された中期経営計画2030と、それに伴う2027年3月期からの配当方針の変更は、期後の決定事項として strategy の disclosed と warnings に記録した。配当の金額や率は本文に書いていない。
- businessModel: Shin-Nippon Industries Sdn.Bhd.の新工場は、設備の新設等の計画で完了予定が2026年6月に変更された計画事項であり、完了とは書いていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とし、報告セグメントに含まれない人材派遣事業を最後に置いた。セグメント利益の金額は書いていない。
- businessStructure: グループは当社と子会社10社（うち非連結子会社3社）で構成され、連結子会社は7社である。子会社の資本金の金額は書いていない。
- history: 沿革の表は年月と事項が対応して印字されており、行順で対応づけた。営業所の開設・移転など小規模な拠点の動きは、節目となる出来事に絞って省いた。
- history: 株式会社ニッポーの完全子会社化は【沿革】には載らず、【重要な契約等】と【関係会社の状況】の注記に印字された当期中の完了事項のため、history に記録し、needsReview には入れていない。子会社等の資本金の金額は書いていない。
- industry: 主たる業界は chemicals を暫定とした。印刷包材事業が外部顧客への売上高39,995百万円と連結売上高44,642百万円の大半を占めるためである。包装（packaging）に当たる区分が無いことは taxonomyGaps に記録した。
- industry: 包装システム販売事業は報告セグメントとして金額が独立して開示されている（外部顧客への売上高4,147百万円）包装機械・包装ラインの販売事業のため、machinery を2つ目に付けた。人材派遣事業は報告セグメントに含まれない「その他」の区分のため、業界は付けていない。
- relatedCompanies: 特定投資株式の医薬品・化粧品等の取引先（参天製薬、テルモ、サワイグループホールディングス、キッセイ薬品工業、三菱ケミカルグループ、小野薬品工業、ヤクルト本社、日本新薬、わかもと製薬、中外製薬、ゼリア新薬工業、資生堂、富士製薬工業、ダイト、持田製薬、扶桑薬品工業、ツムラ、ミルボン、コーセーホールディングス、不二ラテックス、メニコン、中京医薬品ほか）は結ばなかった。保有目的が「医薬品パッケージ等の取引先であり、安定的・長期的な取引関係の維持・強化」という全銘柄に共通する定型句のみで、会社ごとに固有の取引・提携の事実の印字が無いためである。北越コーポレーションだけは、共同開発という固有の協力の印字があるため supplier で結んだ。
- relatedCompanies: 生産設備等の仕入先とだけ印字された株式会社SCREENホールディングスと株式会社小森コーポレーションのうち、SCREENホールディングスは結ばなかった。仕入先という定型の保有目的のみのためである。小森コーポレーションは【大株主の状況】の大株主として結んだ。
- relatedCompanies: 銀行・金融機関（ほくほくフィナンシャルグループ、富山銀行、富山第一銀行、みずほフィナンシャルグループ、丸三証券ほか）は結ばなかった。保有目的が資金借入等の銀行取引を理由とする定型句のみのためである。大株主の株式会社北陸銀行も金融機関のため結ばず、その親会社であるほくほくフィナンシャルグループとは別の法人であるため、北陸銀行の代わりに結ぶこともしていない。
- relatedCompanies: コーセルは「地元公開企業を応援する」目的のみ、ヤマトは発行会社の要請に応えた資本関係という曖昧な目的のみで、具体的な取引・提携の印字が無いため結ばなかった。竹田iPホールディングス（商品等の仕入先）、日本紙パルプ商事と平和紙業（原材料等の仕入先）も、定型の保有目的のみのため結ばなかった。なお大株主の新生紙パルプ商事株式会社は、日本紙パルプ商事とは別の会社である。
- relatedCompanies: 久光製薬と鳥居薬品はコードリストに無く、かつ当事業年度末の保有株式数が無い（前期に保有し当期に売却済み）ため結ばなかった。
- relatedCompanies: エン、ポート、ベース、イノベーション、ビジョン、セキ、No.1などは、「エンゲージメント」「ポートフォリオ」「ベースアップ」「イノベーション」「ビジョン」などの一般語や用語への部分一致であり、会社への言及ではないため結ばなかった。
- relatedCompanies: 大株主の株式会社サンワールド、朝日印刷持株会、公益財団法人朝日国際教育財団、合同会社サンパラソル、日本生命保険相互会社などは、関連企業候補に含まれないか、持株会・財団・保険会社であるため結ばなかった。グループの子会社は掲載済み企業ではないため、関連企業には含めていない。
- terms: 助言: 用語「印刷包材」は、同社の中核事業の対象で、医薬品・化粧品向けのパッケージ・添付文書・ラベル等の包装資材を指す言葉として解説の対象になりうる。
- terms: 助言: 用語「ASAHI2035」は、同社の長期ビジョン「包むこころで 社会を豊かに 未来を明るく ～新たなパッケージングソリューション企業へ～」の名称である。
- terms: 助言: 用語「中期経営計画2030」は、2026年度から2030年度までの5ヵ年を対象とする同社の中期経営計画の名称である。

## 要確認（status に反映）

- businessModel: 配当：2026年6月25日開催予定の定時株主総会決議による期末配当が予定として印字されています。提出日は2026年6月19日であり、提出時点では未実施の予定事項です。金額は本文には書いていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 朝日印刷（asahi-printing）の主たる業界（印刷包材事業） → 提案: packaging（包装・印刷包材）。売上の大半を占める印刷包材事業は、医薬品・化粧品向けのパッケージ・添付文書・ラベル等の包装資材の製造・販売で、閉じた分類に包装や印刷に当たる区分が無い。包装資材メーカーのザ・パック（the-pack）が chemicals を暫定としている先例に揃え、素材・加工メーカーとして最も近い chemicals を暫定とした。
