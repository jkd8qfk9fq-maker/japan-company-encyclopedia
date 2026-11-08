# 不二製油 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 不二製油株式会社 |
| 証券コード | 2607 |
| docID（データを取り出した文書） | `S100YEWN` |
| 原本 docID | `S100YEWN` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEWN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 不二製油株式会社 / 2607 / docID S100YEWN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 39 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fuji-oil: 10 件の数値を有報XBRLと照合
有報: 不二製油株式会社 有価証券報告書－第98期(2025/04/01－2026/03/31) (docID S100YEWN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上高 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fuji-oil: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…売上高の増加などにより、利益を確保しています。2026年3月期の…）
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: revenue / netIncome の候補が2件ずつある問題について: indicators.txt には国際財務報告基準の表（移行日・第97期・第98期）と日本基準の表（第94期〜第98期）の両方が印字されている。機械が組んだ財務系列は年度ごとに実表と一致している（2024年3月期以前は日本基準の行、2025年3月期・2026年3月期はIFRSの行で、当期の売上高772,288百万円・親会社の所有者に帰属する当期利益11,142百万円はIFRS表の印字どおり）ため、その前提で本文も当期・前期ともIFRSの印字額だけを使った。日本基準の当期額（売上高772,285百万円など）は未監査の参考開示であり、本文には使っていない。
- businessModel: 本文の財務数値は売上高と当期純利益だけにした。事業利益・税引前当期利益・営業利益・セグメント利益・Blommerに係る減損損失などの金額と増減率は、文章の規則により本文に書かなかった（増減率は売上高の15.1％増のみ）。
- businessModel: 中期経営計画の財務目標（事業利益450億円、ROE、FUJI ROIC等）は将来の目標値であり投資の語も含むため、本文・perspectives のどちらにも書かなかった。
- businessModel: 証拠パックの注意（本文に遡及適用の記載がある）について: 該当箇所はIFRS初度適用（IFRS第1号）の免除規定の注記であり、IFRS移行そのものの一部である。前期有報との修正再表示チェックも全項目一致だったため、遡及適用についての独立した注記は書かず、会計基準の変更として financialNotes にまとめた。
- businessModel: Wikipedia（「不二製油」の記事）は冒頭1文のみで、本社の所在地など有報と重なる内容しかなかったため、補足には使わなかった。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順（業務用チョコレート370,904百万円、植物性油脂271,076百万円、乳化・発酵素材97,432百万円、大豆加工素材32,874百万円）。4つすべてが報告セグメントである。
- businessStructure: には各事業に関連する物流及びその他のサービス等の事業活動にも触れているが、報告セグメントではなく金額の開示もないため、事業として立てなかった。
- businessStructure: listings の market は表紙の印字「東京証券取引所プライム市場」から「プライム」とした。
- businessStructure: 当連結会計年度から、従来は調整額に含めていた全社費用を各報告セグメントに配分する表示に変わっている（前期のセグメント情報も変更後の配分方法で表示）。外部顧客への売上高の合計・順序に影響はないため、事業の並びには影響しない。
- history: 沿革はの印字から、設立・上場・商号変更・主要事業の開始・大型の株式取得など要点に絞った。資本金の金額は文章の規則により書かなかった（1950年の設立時の資本金300万円など）。
- history: 工場の建設・移転や研究開発拠点の開設など、数多く印字されている項目はすべては載せず、事業の転機になるものを選んだ。
- industry: 主たる業界は food とした。4つの報告セグメント（業務用チョコレート・植物性油脂・乳化・発酵素材・大豆加工素材）はいずれも食品素材の製造販売であり、売上高772,288百万円の全部が食品に関わるため、業界は1つだけにした。
- relatedCompanies: 伊藤忠商事の関係の種類について: の区分は「その他の関係会社の親会社」（直接の保有者は子会社の伊藤忠フードインベストメント合同会社で「その他の関係会社」）であり、は「親会社等はありません」と明記しているため parent にはしなかった。にも伊藤忠商事自身が載る（1.32％、2026年3月31日現在）事業会社の大株主として major-shareholder とし、説明には関係会社の状況の被所有割合43.8％（間接42.5％を含む）を書いた。
- relatedCompanies: 伊藤忠フードインベストメント合同会社: 議決権の42.52％を持つ筆頭株主での「その他の関係会社」だが、非上場の合同会社で related-candidates に含まれないため結ばず、親会社の伊藤忠商事を結んだ。
- relatedCompanies: ロイズコンフェクト（ロイズ）: に1.86％で載る事業会社だが非上場で related-candidates に含まれないため結ばなかった。
- relatedCompanies: コア（core、ambiguous）: 「ココア」などの製品を表す語への部分一致のみで、会社としての関係の記載がない。
- relatedCompanies: エン（en、ambiguous）: 一般語への部分一致のみで、会社としての関係の記載がない。
- relatedCompanies: ポート（port）: 「特許ポートフォリオ」の語への一致のみ。
- relatedCompanies: ビジョン（vision）: グループのビジョンを述べる文への一致のみ。
- relatedCompanies: セキ（seki、ambiguous）: 「情報セキュリティ」などの一般語への一致のみ。
- relatedCompanies: ステップ（step）: 収益認識の「5ステップアプローチ」への一致のみ。
- relatedCompanies: フジ（fuji-8278、ambiguous）: 子会社の「株式会社フジサニーフーズ」など自社グループの会社名への一致で、株式会社フジへの記載ではない。
- relatedCompanies: ベース（base-4481）: 「連結ベース」の一般語への一致のみ。
- relatedCompanies: イノベーション（innovation）: 「不二サイエンスイノベーションセンター」など自社の施設名への一致のみ。
- relatedCompanies: ゼロ（zero、ambiguous）: 「ネットゼロ」の一般語への一致のみ。
- relatedCompanies: ランド（land）: 「ブランド」の語への部分一致のみ。
- relatedCompanies: フリー（freee）: 「フリー・キャッシュ・フロー」の語への一致のみ。
- relatedCompanies: ナック（nac）: 「ワンハンドスナック」の語への部分一致のみ。
- relatedCompanies: レイ（ray、ambiguous）: 「高オレイン酸ひまわり油」などの一般語への部分一致のみ。
- relatedCompanies: 理研ビタミン（riken-vitamin）: 特定投資株式として100千株を保有するが、保有目的は全銘柄共通の定型文（安定的な営業関係取引の維持・強化及び相互の取組による将来的な企業価値向上）のみで、相手についての個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: テイン（tein）: 「プロテイン」の語への部分一致のみ。
- relatedCompanies: 東洋水産（toyo-suisan-kaisha）: 特定投資株式として119千株を保有するが、保有目的は全銘柄共通の定型文のみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: トラスト（trust）: listing が上場ではない（コードリストにない）うえ、日本マスタートラスト信託銀行株式会社（信託口）の名称への一致で、信託銀行の信託口は結ばない。
- relatedCompanies: 応用技術（applied-technology）: 「酵素応用技術」などの一般語への一致のみ。
- relatedCompanies: ベーシック（basic）: 製品名「カカオクオリーベーシック」の一部への一致のみ。
- relatedCompanies: ブルボン（bourbon）: 特定投資株式の表に載るが当事業年度の株式数はなく、保有目的も全銘柄共通の定型文のみのため結ばなかった。
- relatedCompanies: キャリア（career）: 「キャリア形成」の一般語への一致のみ。
- relatedCompanies: コモ（como、ambiguous）: 「コモディティスワップ」の語への部分一致のみ。
- relatedCompanies: キューブ（cube）: 製品名「じゅわっとキューブ」の一部への一致のみ。
- relatedCompanies: 江崎グリコ（ezaki-glico）: 特定投資株式として17千株を保有するが、保有目的は全銘柄共通の定型文のみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: FUJI（fuji）: FUJI OIL ASIA PTE. LTD.など自社グループの会社名への一致のみ。
- relatedCompanies: 亀田製菓（kameda-seika）: 特定投資株式だったが当事業年度に全株式を売却済みで、保有目的も定型文のみのため結ばなかった。
- relatedCompanies: レック（lec）: 「フレックス勤務」の語への部分一致のみ。
- relatedCompanies: 丸大食品（marudai-food）: 特定投資株式の表に載るが、保有目的は全銘柄共通の定型文のみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 尾家産業（oie-sangyo）: 特定投資株式として25千株を保有するが、保有目的は全銘柄共通の定型文のみのため結ばなかった。
- relatedCompanies: パス（path、ambiguous）: オランダの大学キャンパス内の研究拠点の説明への部分一致のみ。
- relatedCompanies: サトー商会（satoh-and-co）: 特定投資株式として28千株を保有するが、保有目的は全銘柄共通の定型文のみのため結ばなかった。
- relatedCompanies: 正栄食品工業（shoei-foods）: 特定投資株式だったが当事業年度の保有はなく、保有目的も定型文のみのため結ばなかった。
- relatedCompanies: スペース（space）: 「オフィス・スペース」の一般語への一致のみ。
- relatedCompanies: ヤクルト本社（yakult-honsha）: 公正価値で測定する資本性金融商品の表に移行日時点の金額が載るのみで、前連結会計年度末・当連結会計年度末の保有はなく、取引・提携の記載もないため結ばなかった。
- relatedCompanies: 関係会社の状況に載る連結子会社・持分法適用関連会社はすべて非上場のグループ会社で、related-candidates には含まれていない。
- terms: 助言: 「チョコレート用油脂（CBE）」は有報が成長領域として繰り返し述べる当社の主力素材で、登録候補になり得ます。
- terms: 助言: 「コンパウンドチョコレート」は業務用チョコレート事業の中核製品として有報の複数箇所で使われており、登録候補になり得ます。
- terms: 助言: 「水溶性大豆多糖類」は大豆加工素材事業の主要製品の一つとして印字されており、登録候補になり得ます。
- terms: 助言: 「ハードバター」は1955年に日本で初めて製造した製品の区分名として沿革に残る語ですが、現在の事業説明ではチョコレート用油脂に含まれて語られるため、登録候補にはしませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
