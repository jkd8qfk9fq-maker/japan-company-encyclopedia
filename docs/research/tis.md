# TIS — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＴＩＳ株式会社 |
| 証券コード | 3626 |
| docID（データを取り出した文書） | `S100Z3U3` |
| 原本 docID | `S100YH5C` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100Z3U3／有効文書 S100Z3U3（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3U3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＴＩＳ株式会社 / 3626 / docID S100YH5C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 37 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tis: 10 件の数値を有報XBRLと照合
有報: ＴＩＳ株式会社 訂正有価証券報告書－第18期(2025/04/01－2026/03/31) (docID S100Z3U3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第18期(2025/04/01－2026/03/31)、docID S100Z3U3）を有効文書としてこのパックを作った。原本は docID S100YH5C。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（ManagementAnalysisOfFinancialPositionOperatingResultsAndCashFlowsTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
すべて一致しました。
tis: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「TIS株式会社」が EDINET の提出者名「ＴＩＳ株式会社」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…の提供や生産性向上の取り組みを進め、利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。修正再表示チェックは全項目一致で、決算期の変更・変則決算・会計基準の変更による系列の見直しもないためである。
- businessModel: 有効文書は訂正有価証券報告書（S100Z3U3）で、原本との本文の差異は経営成績等の分析の節のみ。本文（特に flow の売上高・純利益の説明）は訂正後の印字に基づいて書いた。
- businessModel: 文章の規則により、営業利益・経常利益・セグメント利益は金額・増減率とも本文に書かなかった。書いたのは売上高と親会社株主に帰属する当期純利益だけである。訴訟損失引当金や減損損失の金額も書かず、純利益の減少理由として定性的に触れるにとどめた。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。
- businessModel: 中期経営計画の目標指標（売上規模1兆円など）は将来の目標を含むため、本文の数値には使わなかった（strategy の disclosed は会社の説明の要約として方針のみを書いた）。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順（広域ITソリューション176,953百万円、オファリングサービス144,593百万円、産業IT132,791百万円、金融IT96,941百万円、BPM42,803百万円）。「その他」は有報が報告セグメントに含まれないと書く区分のため最後に置いた。
- businessStructure: name は表紙の社名「ＴＩＳ株式会社」から株式会社を除いた通称。表紙の印字は全角英字だが、既存の数値のみエントリーの表記に合わせて半角の「TIS」とした。shortNameEn も「TIS」とした。
- businessStructure: listings の market は表紙の印字「東京証券取引所プライム市場」から「プライム」とした。
- businessStructure: 有効文書は訂正有価証券報告書（S100Z3U3、2026年9月29日提出）。数値は原本（S100YH5C）と同一で、本文の差異は経営成績等の分析の節のみ。本文は訂正後の印字に基づいて書いた。
- history: 沿革の表で2016年4月と2016年7月の2つの年月セルに続けて事象文が連なっている箇所は、事業の一部再配置（4月）と吸収合併・商号変更（7月）を同じ2016年の1件にまとめて書いた。
- history: 2025年のインテック吸収合併の件は、有報の記載どおり効力発生日を「2026年7月1日の予定」として書き、完了とは書いていない。提出後に効力が発生したことの確認は businessStructure の needsReview に記録した。
- history: Wikipedia（記事名「TISI」）は新商号の記事で、冒頭は有報の範囲と重なる内容のみだったため、沿革への補足には使わなかった。
- industry: 主たる業界は、5つの報告セグメントすべてがITサービスの提供であることから it とした。
- industry: 金融IT・産業ITは顧客の業種に特化した区分であり、会社自身の業界はITサービスであるため、finance は付けなかった。
- relatedCompanies: vision: 「グループビジョン」などの一般語への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: step: 「ステップアップ」などの一般語への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: base-4481: 「をベースとして」という一般語への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: career: 「キャリア」という一般語への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」などの語の一部への一致で曖昧であり、同社への言及ではないため結ばなかった。
- relatedCompanies: en: 「エンタープライズ」などの語の一部への一致で曖昧であり、同社への言及ではないため結ばなかった。
- relatedCompanies: land: ブランドメッセージなどの文中の語の一部への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」などの一般語への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: zero: 「ネットゼロ」などの一般語への一致で曖昧であり、同社への言及ではないため結ばなかった。
- relatedCompanies: lec: 連結子会社「株式会社アグレックス」の名称の一部への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: trust: 「ゼロトラスト」や従業員持株会専用信託への言及であり、listing もコードリストにないため結ばなかった。
- relatedCompanies: frontier: 中期経営計画の基本方針「フロンティア開拓」への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: rix: 「スキルマトリックス」などの語の一部への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: freee: 「フリーキャッシュ・フロー」という一般語への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: ray: 「プレイヤー」などの語の一部への一致で曖昧であり、同社への言及ではないため結ばなかった。
- relatedCompanies: the-lead: 「リードする」という動詞への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: path: 「インパクトパス」という一般語への一致で曖昧であり、同社への言及ではないため結ばなかった。
- relatedCompanies: rion: 「パビリオン」などの語の一部への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: core: 「コア技術」などの一般語への一致で曖昧であり、同社への言及ではないため結ばなかった。
- relatedCompanies: i-ll: 大株主の状況に載る資産運用会社「ブラックロック・アセット・マネジメント・アイルランド・リミテッド」の名称の一部への一致で、候補のアイル株式会社とは別の会社であるため結ばなかった。
- relatedCompanies: ichigo: 大株主の状況や臨時報告書に載る「いちごトラスト・ピーティーイー・リミテッド」「いちごアセットマネジメント・インターナショナル・ピーティーイー・リミテッド」は投資運用会社であり、候補のいちご株式会社とは別の会社であるため結ばなかった。
- relatedCompanies: rhythm: 「アルゴリズム」などの語の一部への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: will: 米国の住所（デラウェア州ウィルミントン）への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: alt: 特定投資株式として開示されているが、listing がコードリストにないため結ばなかった。
- relatedCompanies: applied-technology: 「応用技術」という一般語への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: axis: 2009年に設立されたグループ会社「ネオアクシス株式会社」の名称の一部への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: blue-innovation: 特定投資株式（33,333株）の保有目的が「技術連携強化のため」という保有理由の記載のみで、取引・提携の具体的な記載がないため結ばなかった。
- relatedCompanies: disco: 日本科学未来館の常設展示「量子コンピュータ・ディスコ」という展示名への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: informetis: 特定投資株式（278,248株）の保有目的が「協業関係強化のため」という保有理由の記載のみで、取引・提携の具体的な記載がないため結ばなかった。
- relatedCompanies: intelligent-wave: 特定投資株式（12,000株）の保有目的に「当社の決済事業における主要なビジネスパートナーの一社」とあるが、保有目的欄の記載のみで、契約や取引の具体的な記載が本文にないため結ばなかった。
- relatedCompanies: internet-initiative-japan: 特定投資株式（1,056,000株）の保有目的が「長期的・安定的な取引関係の構築、および協業推進のため」という保有理由の記載のみで、取引・提携の具体的な記載がないため結ばなかった。
- relatedCompanies: king: 「ネットワーキング」などの語の一部への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: kokopelli: 特定投資株式（188,300株）の保有目的が「技術連携の強化のため」という保有理由の記載のみで、取引・提携の具体的な記載がないため結ばなかった。
- relatedCompanies: meeq: 特定投資株式（222,700株）の保有目的が「協業関係強化のため」という保有理由の記載のみで、取引・提携の具体的な記載がないため結ばなかった。
- relatedCompanies: mitsubishi-shokuhin: listing がコードリストにないため結ばなかった。なお有報には、連結子会社の株式会社インテックが受託したシステム開発等の業務に関し、同社から損害賠償請求訴訟を受けた旨の記載があるが、係争に関する記載であり、関連企業として結ぶ関係ではない。
- relatedCompanies: 株式会社インテックは完全子会社で候補リストにない（非上場）ため結んでいない。2026年7月1日予定の吸収合併については沿革と businessStructure の needsReview に記録した。
- relatedCompanies: MFEC Public Company Limited や PT Anabatic Technologies Tbk などの海外の関係会社は候補リストにないため結んでいない。
- terms: 助言: 「BPM」は用語集に未登録です。ビジネス・プロセス・マネジメントの略で、この会社では業務プロセスの高度化・効率化やアウトソーシングを提供する報告セグメントの名称にもなっているため、登録候補になります。
- terms: 助言: 「PHR」は用語集に未登録です。パーソナル・ヘルス・レコードの略で、個人の健康・医療に関する情報を記録し活用する仕組みのことです。この会社のヘルスケア分野の業務提携で登場するため、登録候補になります。

## 要確認（status に反映）

- businessStructure: 有報提出後の商号変更・吸収合併・監査等委員会設置会社への移行（EDINETで内容を確認済み）: 第18期有価証券報告書では、完全子会社の株式会社インテックの吸収合併（効力発生日2026年7月1日予定）に伴い、当社の商号を「ＴＩＳＩ株式会社」に変更し、監査等委員会設置会社へ移行することが予定として記載されていた。2026年6月23日開催の第18期定時株主総会で定款の一部変更が決議されたことは臨時報告書（2026年6月24日提出、S100YJ56）に記載されており、有報提出後の自己株券買付状況報告書（2026年7月7日提出、S100YOUS）は新商号「ＴＩＳＩ株式会社」で提出されている（EDINETコードE05739・証券コード3626に変更なし）。autopilot が S100YOUS の提出者名の相違で保留したため、上記のとおり実態を確認のうえ ack した。本エントリーは2026年3月期の有価証券報告書に基づく記載であり、会社名・体制は同有報の表記のままとしている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
