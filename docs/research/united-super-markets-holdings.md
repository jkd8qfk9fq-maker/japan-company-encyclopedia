# ユナイテッド・スーパーマーケット・ホールディングス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ユナイテッド・スーパーマーケット・ホールディングス株式会社 |
| 証券コード | 3222 |
| docID（データを取り出した文書） | `S100Y6HP` |
| 原本 docID | `S100Y585` |
| 提出日（原本） | 2026-05-20 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100Y6HP／有効文書 S100Y6HP（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6HP.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%A6%E3%83%8A%E3%82%A4%E3%83%86%E3%83%83%E3%83%89%E3%83%BB%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%83%9E%E3%83%BC%E3%82%B1%E3%83%83%E3%83%88%E3%83%9B%E3%83%BC%E3%83%AB%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%B9

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ユナイテッド・スーパーマーケット・ホールディングス株式会社 / 3222 / docID S100Y585（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 26 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
united-super-markets-holdings: 10 件の数値を有報XBRLと照合
有報: ユナイテッド・スーパーマーケット・ホールディングス株式会社 訂正有価証券報告書－第11期(2025/03/01－2026/02/28) (docID S100Y6HP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第11期(2025/03/01－2026/02/28)、docID S100Y6HP）を有効文書としてこのパックを作った。原本は docID S100Y585。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（OverviewOfAffiliatedEntitiesTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
united-super-markets-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: パックの注意（本文に遡及適用の記載がある）について: 該当する注記は財務諸表の注記事項（会計方針の変更等）にあり、証拠パックの sections.txt からは本文を確認できなかった。前期有報との修正再表示チェックは売上高・純利益など5系列と従業員数の全行で一致し、決算期の変更や変則決算もないため、推測で注記を書かず、financialNotes は空にした。
- businessModel: 2026年2月期の業績について、MD&Aは営業利益・経常利益の増減率や売上総利益率の低下にも触れているが、本文の財務数値は売上高と当期純利益だけという規則により、利益の段では当期純損失の金額と前連結会計年度の当期純利益だけを書いた。
- businessModel: 略称「U.S.M.H」は Wikipedia の補足として flow の company の段にだけ使った（有報でも大株主の「Ｕ．Ｓ．Ｍ．Ｈグループ取引先持株会」の名称に現れる）。出典に wikipedia を加え、businessModel の sourceIds に並べた。
- businessStructure: 単一セグメント（スーパーマーケット事業）のため、事業の区分は【事業の内容】の記載（スーパーマーケット事業／その他の事業）によった。セグメント情報では外部顧客への売上高の内訳が開示されておらず（スーパーマーケット事業の売上高が連結売上高の90％を超えるため【関連情報】の製品別情報も省略）、事業ごとの売上高は書いていない。
- businessStructure: 子会社の並びは、【関係会社の状況】の主要な損益情報等に売上高が印字された子会社（マルエツ400,440百万円、カスミ272,344百万円、いなげや217,444百万円）の順を基本とし、印字のないマックスバリュ関東、セイブ、生鮮加工等の会社を後に置いた。
- businessStructure: マックスバリュ関東の商号変更（2026年3月1日付でイオンフードスタイル）とダイエー関東事業・イオンマーケットとの統合は、決算日後に効力が発生した重要な後発事象として有報に開示され、提出日（2026年5月26日）時点で完了しているため、予定ではなく完了した事実として書いた。
- businessStructure: listings の market は、表紙のDEI「東京証券取引所スタンダード市場」の印字から「スタンダード」とした。
- businessStructure: 出典は有効文書である訂正有価証券報告書（docID S100Y6HP、2026年5月26日提出）とし、本文は訂正後の文面を含む証拠パック（訂正対象は【関係会社の状況】の文面）から書いた。
- history: 本店の移転（2016年1月の神田相生町、2025年5月の神田駿河台）は【沿革】に載るが、事業の転機ではないため省いた。
- history: 2024年は、いなげやの株式交換契約の締結（4月）と経営統合の完了（11月）を分けて2件にした（年は西暦だけを書く規則どおり、月は書いていない）。
- history: セイブの子会社化は【沿革】には載らないため、【関係会社の状況】の注記とセグメント情報の記載から書いた。
- industry: 主たる業界は、売上の大半を占める唯一の報告セグメント「スーパーマーケット事業」から retail（小売）とした。その他の事業（不動産・人材派遣等）は報告セグメントではなく金額の独立した開示もないため、業界を足さなかった。
- relatedCompanies: イオン（aeon）: 親会社で、【関係会社の状況】に親会社（議決権の被所有割合52.9％、うち間接所有34.4％、2026年2月28日現在）と記載され、【関連当事者情報】にも資金の寄託や利息の受取の取引が載るが、related-candidates に含まれていないため結べなかった。
- relatedCompanies: イオンマーケットインベストメント: 【関係会社の状況】に親会社（議決権の被所有割合34.4％、実質支配力基準による親会社）と記載されるが、非上場で related-candidates に含まれていないため結べなかった。
- relatedCompanies: マックス（max）: 「マックスバリュ関東」への部分一致のみで、マックス株式会社への言及ではない。
- relatedCompanies: エン（en）: ambiguous で、「従業員エンゲージメント」等の一般語への一致のみ。
- relatedCompanies: ポート（port）: 「アスビズサポート」等への部分一致のみで、ポート株式会社への言及ではない。
- relatedCompanies: ツルハホールディングス（tsuruha-holdings）: 特定投資株式として保有していたが、当事業年度において全て売却したと記載されており、個別の取引・提携の記載もない。
- relatedCompanies: フリー（freee）: 「リスクフリー・レート」への一致のみ。
- relatedCompanies: ユナイテッド（united）: 自社名（ユナイテッド・スーパーマーケット・ホールディングス）への一致のみ。
- relatedCompanies: ベース（base-4481）: 「連結ベース」という語への一致のみ。
- relatedCompanies: 日新（nissin）: ambiguous で listing もコードリストにない。新株予約権の条文等への一致のみで、株式会社日新への言及ではない。
- relatedCompanies: トラスト（trust）: 大株主の日本マスタートラスト信託銀行（信託口）の名称への一致で、信託口の純投資である。
- relatedCompanies: ビジョン（vision）: 「ビジョン」という一般語への一致のみ。
- relatedCompanies: ウエルシアホールディングス（welcia-holdings）: listing がコードリストにない。ツルハホールディングスとの経営統合に関する注記に現れるのみで、当社との関係の記載はない。
- relatedCompanies: コア（core）: ambiguous で、エンゲージメントスコアの測定サービスの説明文脈等への一致のみ。株式会社コアへの言及ではない。
- relatedCompanies: 平和堂（heiwado）: 特定投資株式として保有していたが、当事業年度において全て売却したと記載されている。
- relatedCompanies: J-オイルミルズ（j-oil-mills）: 特定投資株式として10,400株を保有するが、保有目的は「取引関係の維持・強化のため」という全銘柄共通の定型句のみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: ランド（land）: 「トップバリュ・ブランド」等への語の一致のみ。
- relatedCompanies: リンクアンドモチベーション（link-and-motivation）: エンゲージメントスコアの測定サービス「モチベーションクラウド」の提供元として言及されるのみで、事業上の取引・提携の記述がないため結ばなかった。
- relatedCompanies: 丸紅（marubeni）: 2014年の経営統合契約の当事者として【沿革】に現れるのみで、【大株主の状況】（2026年2月28日現在）にも含まれず、現在の取引・資本関係の記載がないため結ばなかった。出来事として history にのみ書いた。
- relatedCompanies: 三菱食品（mitsubishi-shokuhin）: 【大株主の状況】に0.88％を保有する事業会社として載るが、listing がコードリストにないため結べなかった。
- relatedCompanies: 日清食品ホールディングス（nissin-foods-holdings）: 特定投資株式として796,000株を保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 理研ビタミン（riken-vitamin）: 特定投資株式として保有していたが、当事業年度において全て売却したと記載されている。
- relatedCompanies: エスフーズ（s-foods）: 特定投資株式として保有していたが、当事業年度において全て売却したと記載されている。
- relatedCompanies: セキ（seki）: ambiguous で、「セキュリティ」等への一致のみ。
- relatedCompanies: スローガン（slogan）: 「スローガン」という一般語への一致のみ。
- relatedCompanies: 東洋水産（toyo-suisan-kaisha）: 特定投資株式として98,000株を保有するが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の記載がないため結ばなかった。
- terms: 助言: 「トップバリュ」は用語集に未登録です。イオングループのプライベートブランドで、有報ではマルエツでの取扱い拡大による価格競争力の強化が説明されており、この会社の品揃えを語る中心的なブランド名のため、登録候補になります。
- terms: 助言: 「吸収分割」も未登録です。2026年3月の経営統合で、ダイエーの関東事業をマックスバリュ関東が吸収分割で承継したことが【重要な後発事象】に説明されており、登録候補になります。
- terms: 助言: 「移動スーパー」も未登録です。いなげやが移動スーパー「とくし丸」を新たに3ルート開設し、計33台体制としたことが有報に書かれており、買物が困難な地域への対応を示す用語として登録候補になります。
- terms: holding-company（持株会社）、share-exchange（株式交換）、absorption-merger（吸収合併）、consolidated-subsidiary（連結子会社）、equity-method（持分法）、segment（セグメント）は登録済みのため、新規登録は不要です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
