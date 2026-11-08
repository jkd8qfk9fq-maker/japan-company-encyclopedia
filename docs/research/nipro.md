# ニプロ — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ニプロ株式会社 |
| 証券コード | 8086 |
| docID（データを取り出した文書） | `S100YJLK` |
| 原本 docID | `S100YJLK` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJLK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ニプロ株式会社 / 8086 / docID S100YJLK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 36 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nipro: 10 件の数値を有報XBRLと照合
有報: ニプロ株式会社 有価証券報告書－第73期(2025/04/01－2026/03/31) (docID S100YJLK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nipro: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…ストを下げ、販売価格の適正化を進めて利益を確保しています。2026年3月期の…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…、規模拡大に加えて収益性を重視する「利益重視経営」を推進しています。経営戦略…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全項目一致した。証拠パックの注意（本文に財務諸表の組替えの記載がある）については、抽出本文で確認できた「組替」は包括利益計算書の組替調整額のみで、前期財務諸表の組替えを示す注記は特定できなかったため、financialNotes には書かず、この判断をここに記録した。
- businessModel: 中期経営計画の目標指標（売上高成長率や資本効率に関する指標など）は、売上高と当期純利益以外の利益および投資の語に関する規則に従い、本文・perspectives には書かなかった。
- businessModel: MD&A にある段階取得に係る差益や固定資産売却益の金額は、売上高と当期純利益以外の金額に関する規則に従い書かなかった。
- businessStructure: 事業の並び順は報告セグメントの外部顧客への売上高（2026年3月期）の大きい順（医療関連523,615百万円→医薬関連81,107百万円→ファーマパッケージング54,687百万円）とし、報告セグメントに含まれない「その他」（1,128百万円）は規則どおり最後に置いた。
- businessStructure: listings は表紙の印字（東京証券取引所プライム市場）どおりとした。
- businessStructure: 設備の状況で複数セグメントが連記された行（東京支店、本社）は、規則どおり特定の事業に結びつけなかった。
- history: 沿革の冒頭注記（形式上の存続会社は1948年設立で、記載は実質上の存続会社に基づく）を1954年の項目に反映した。設立時の資本金・額面は規則により書かなかった。
- history: 2026年4月の出来事（グッドマンの商号変更など）は決算期末後のものだが、有報の沿革に印字されているため収録した。提出後の予定ではなく、沿革に記載された事実として書いた。
- history: Wikipedia（「ニプロ」）は有報と重なる内容（医療機器・医薬品・ガラス製品の製造販売、人工透析分野）のみで、補足に使える固有の情報が乏しいため使用しなかった。
- industry: 主たる業界は、売上高の約8割を占める医療関連（医療機器と医薬品）と医薬関連（医薬品の受託製造）から pharmaceuticals とした。
- relatedCompanies: 日本電気硝子は【大株主の状況】に載る事業会社（所有割合5.19％、2026年3月31日現在）であり、当社の保有目的にも原材料の取引先である旨の個別記載があるため major-shareholder として結んだ。
- relatedCompanies: グロースエクスパートナーズは、特定投資株式の保有目的に同社との資本業務提携契約の締結が個別に記載されているため、定型の保有目的のみの各社と区別して business-partner として結んだ。
- relatedCompanies: 【関係会社の状況】の持分法適用関連会社 Spryte Medical Holdings, LLC は related-candidates に含まれず、上場でもないため結ばなかった。候補外の相手は選ばない規則による。
- relatedCompanies: career（キャリア）: 本文中の「キャリア形成」などの一般語への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: port（ポート）: 「事業ポートフォリオ」の一部への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: en（エン）: 自社子会社の旧社名「ニプロシステムソフトウェアエンジニアリング」の一部への一致（ambiguous）であり、同社への言及ではないため結ばなかった。
- relatedCompanies: land（ランド）: 「ニプロタイランドコーポレーション」など自社子会社名の一部への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「ベース」という一般語への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: mani（マニー）: 子会社の所在地「ドイツミュンナーシュタット市」の一部への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: technologies（テクノロジーズ）: 自社子会社「ニプロデジタルテクノロジーズ」などの社名の一部への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: aichi-financial-group（あいちフィナンシャルグループ）: 特定投資株式に載るが、保有目的は傘下のあいち銀行との財務面の取引による資金調達等の円滑化であり、金融機関との資金調達が理由のため結ばなかった。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ）: 特定投資株式に載るが、保有目的は傘下のみずほ銀行との財務面の取引による資金調達等の円滑化であり、金融機関との資金調達が理由のため結ばなかった。
- relatedCompanies: step（ステップ）: 「次のステップ」などの一般語への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: systemsoft（システムソフト）: 自社子会社の旧社名「ニプロシステムソフトウェアエンジニアリング」の一部への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: trust（トラスト）: listing が上場でなく、自社製品名「Vトラスト」への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: dai-ichi-life-holdings（第一ライフグループ）: 特定投資株式の注記に現れる保険会社グループであり、保険・金融取引の文脈のみのため結ばなかった。
- relatedCompanies: king（キング）: 「ウォーキング」などの一般語への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: seki（セキ）: 一般文の一部への一致（ambiguous）であり、同社についての記載がないため結ばなかった。
- relatedCompanies: takeda-pharmaceutical（武田薬品工業）: 自社製品（リュープロレリン酢酸塩製剤）の先発医薬品の製造会社としての言及のみであり、同社との取引・提携の記載がないため結ばなかった。
- relatedCompanies: zero（ゼロ）: 「ネットゼロ」という一般語への一致（ambiguous）であり、同社への言及ではないため結ばなかった。
- relatedCompanies: chugai-pharmaceutical（中外製薬）: 沿革中の旧子会社名「東北中外製薬」の一部への一致であり、同社自身との現在の関係の記載がないため結ばなかった。
- relatedCompanies: corona（コロナ）: 「新型コロナウイルス」という一般語への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 自社子会社名「ニプロバスキュラーイノベーションズアメリカス」の一部への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: kimura-chemical-plants（木村化工機）: 特定投資株式の保有目的が「機械設備の取引先であり、良好な取引関係を維持・強化させるため」という定型の記載のみで、ほかに取引・提携の具体的な記載がないため結ばなかった。
- relatedCompanies: medipal-holdings（メディパルホールディングス）: 特定投資株式の保有目的が「医療用医薬品の取引先であり、取引関係を維持・強化させるため」という定型の記載のみで、ほかに具体的な記載がないため結ばなかった。
- relatedCompanies: morita-holdings（モリタホールディングス）: 特定投資株式に載っていたが、当事業年度において売却済みで現在は保有していないため結ばなかった。
- relatedCompanies: nissin（日新）: listing が上場でなく、記載中の一般語への一致（ambiguous）であり、同社への言及ではないため結ばなかった。
- relatedCompanies: qol-holdings（クオールホールディングス）: 特定投資株式の保有目的が「医療用医薬品の取引先であり、取引関係を維持・強化させるため」という定型の記載のみで、ほかに具体的な記載がないため結ばなかった。
- relatedCompanies: rengo（レンゴー）: 特定投資株式に載っていたが、当事業年度において売却済みで現在は保有していないため結ばなかった。
- relatedCompanies: rhythm（リズム）: 「心拍リズム」という一般語への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: shibuya（澁谷工業）: 特定投資株式の保有目的が「製商品の取引先であり、良好な取引関係を維持・強化させるため」という定型の記載のみで、ほかに具体的な記載がないため結ばなかった。
- relatedCompanies: space（スペース）: 「省スペース」という一般語への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: thinca（シンカ）: 「シンガポール」の一部への一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: wakamoto-pharmaceutical（わかもと製薬）: 特定投資株式の保有目的が「医療用医薬品の取引先であり、取引関係を維持・強化させるため」という定型の記載のみで、ほかに具体的な記載がないため結ばなかった。
- relatedCompanies: yuki-gosei-kogyo（有機合成薬品工業）: 特定投資株式の保有目的が「原材料の取引先であり、良好な取引関係を維持・強化させるため」という定型の記載のみで、ほかに具体的な記載がないため結ばなかった。
- relatedCompanies: zojirushi（象印マホービン）: 特定投資株式の保有目的が「原材料の取引先であり、良好な取引関係を維持・強化させるため」という定型の記載のみで、ほかに具体的な記載がないため結ばなかった。
- terms: 助言: 「ダイアライザ」は用語集に未登録です。血液透析に使うフィルター（血液透析濾過器）のことで、この会社の主力製品であり事業説明の中心になるため、登録候補になります。
- terms: 助言: 「キット製剤」は用語集に未登録です。薬液と専用容器を組み合わせた医薬品で、この会社の医療関連事業と医薬関連事業の両方に関わるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ニプロの主たる業界 → 提案: medical-devices（医療機器）。売上高の約8割を占める医療関連事業は医療機器が中心だが、閉じた分類に医療機器の値がないため、医薬品の製造販売と受託製造を含む pharmaceuticals を暫定の主たる業界とした。
