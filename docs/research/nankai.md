# NANKAI — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＮＡＮＫＡＩ |
| 証券コード | 9044 |
| docID（データを取り出した文書） | `S100YBA0` |
| 原本 docID | `S100YBA0` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBA0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＮＡＮＫＡＩ / 9044 / docID S100YBA0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 28 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nankai: 10 件の数値を有報XBRLと照合
有報: 株式会社ＮＡＮＫＡＩ 有価証券報告書－第109期(2025/04/01－2026/03/31) (docID S100YBA0)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":22496000000,"latestFiling":22548000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":35572000000,"latestFiling":35599000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":976877000000,"latestFiling":981014000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":328225000000,"latestFiling":329865000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nankai: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社NANKAI（旧会社名　南海電気鉄道株式会社）」が EDINET の提出者名「株式会社ＮＡＮＫＡＩ」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで2025年3月期の純利益・経常利益・総資産・純資産が前期有報と異なるのは、連結経営指標等の注記2にあるとおり、企業結合に係る暫定的な会計処理の確定により取得原価の当初配分額の見直しが反映されたためである。訂正や誤謬ではないため needsReview には入れず、financialNotes に記録した。
- businessModel: 本文の「財務諸表の組替え」にあたる記載は、その他の包括利益に関する組替調整額の注記のみで、財務諸表の表示の組替えや遡及修正ではないと判断した。そのため basis の注記は置かなかった。
- businessModel: 中期経営計画の数値目標（営業利益、純有利子負債残高/EBITDA倍率、ROE）は、文章の規則により本文・perspectives のいずれにも書いていない。
- businessModel: 営業利益・経常利益の金額や増減理由は文章の規則により書いていない。営業収益の増加理由はMD&Aの印字（万博効果、インバウンド需要、通天閣観光の寄与）によった。
- businessStructure: 事業の並び順は、セグメント注記の2026年3月期の外部顧客への営業収益の大きい順（運輸業115,953百万円、不動産業51,636百万円、レジャー・サービス業36,884百万円、建設業30,418百万円、流通業29,690百万円、その他の事業131百万円）とした。6区分すべてが報告セグメントであり、「その他の事業」も報告セグメントに含まれるため売上順の最後に置いた。
- businessStructure: 各事業の子区分の金額は、セグメント注記では独立して開示されていない。MD&Aの営業成績はセグメント間の内部営業収益を含む管理上の数値のため、子区分には金額を書かず、その旨を各子区分の説明に明記した。
- businessStructure: 社名は表紙の「株式会社ＮＡＮＫＡＩ」によった。当社は2026年4月1日付で南海電気鉄道株式会社から商号を変更している（提出後の事項として businessModel フラグメントの needsReview に記録）。
- businessStructure: 海運業（フェリー事業）の撤退決定（2028年3月末を目途）はMD&Aの記載に基づき子区分の説明に書き、needsReview にも記録した。
- history: 沿革は、会社の姿の変化を伝える主な行に絞った。連続立体交差化工事の完成などの設備工事の行、個別子会社の設立・商号変更の行、小規模な事業譲渡の行（和歌山県下の乗合自動車事業の一部譲渡など）は省略した。
- history: 沿革の2008年から2010年の部分は年月と事象文が分かれて印字される崩れた表だが、年月3つ（2008年3月、2009年3月・4月、2010年10月）と事象文の数が対応するため行順で対応づけられる。本フラグメントではこの範囲の行は採用しなかった。
- history: 創業は、沿革の冒頭の記載に従い、1885年の難波～大和川間の運輸営業開始とした（大阪堺間鉄道の設立は1884年）。
- history: 2026年の分社化・商号変更は【沿革】にはなく、【重要な後発事象】と【重要な契約等】の記載によった。
- industry: 主たる業界は、2026年3月期の外部顧客への営業収益が最大の報告セグメントである運輸業（115,953百万円）により transportation とした。第2位の不動産業（51,636百万円）は報告セグメントとして独立開示があるため real-estate を2つ目に付けた。流通業・レジャー・サービス業・建設業は付けなかった。
- relatedCompanies: innovation: 一般的な語「イノベーション」の一致のみ。有報が同社について述べる取引・提携・資本関係はないため結ばなかった。
- relatedCompanies: kohsoku: 「泉北高速鉄道」などの一般語・固有名詞の断片の一致（ambiguous）のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: port: 「サザントランスポートサービス」などの語の断片の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: core: 「コア事業」の語の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: en: 「セブン-イレブン」などの語の断片の一致（ambiguous）のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: seki: 語の断片の一致（ambiguous）のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: career: 「キャリア採用」の語の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: vision: 「経営ビジョン」の語の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」の語の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: daiwa: 沿革に登場する地名「大和川」の一致（ambiguous）のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: the-kiyo-bank: 大株主の状況（0.92％）と特定投資株式のいずれも、主要取引金融機関としての資金調達を目的とする保有であり、金融機関の資金調達・純投資の関係は結ばないため結ばなかった。
- relatedCompanies: the-lead: 「戦略をリードする人財」の語の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: zero: 「0（ゼロ）番のりば」の語の一致（ambiguous）のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: land: 「新ブランド」の語の断片の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式は主要取引金融機関としての関係維持と安定的な資金調達が保有目的であり、銀行との資金調達の関係は結ばないため結ばなかった。
- relatedCompanies: mizuho-financial-group: 特定投資株式は主要取引金融機関としての資金調達が保有目的であり、銀行との資金調達の関係は結ばないため結ばなかった。
- relatedCompanies: senshu-ikeda-holdings: 有報の大株主の状況に載るのは子会社の株式会社池田泉州銀行（1.19％）であり、候補の持株会社そのものではなく、主要取引金融機関としての関係でもあるため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式は主要取引金融機関としての資金調達が保有目的であり、銀行との資金調達の関係は結ばないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group: 大株主の状況の注記にある変更報告書の共同保有者は信託銀行と資産運用会社であり、特定投資株式も主要取引金融機関としての資金調達が保有目的のため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス」の語の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: dai-ichi-life-holdings: 前事業年度に全株式を売却済みで当事業年度の保有はなく、主要取引金融機関としての関係でもあったため結ばなかった。
- relatedCompanies: denso: 電子QRコードがデンソーウェーブの登録商標である旨の表示での言及のみで、同社との取引の記述はないため結ばなかった。
- relatedCompanies: ic: ICカードの語の一致（ambiguous）のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: resona-holdings: 特定投資株式は主要取引金融機関としての資金調達が保有目的であり、銀行との資金調達の関係は結ばないため結ばなかった。
- relatedCompanies: space: 「ポップアップスペース」の語の一致のみ。同社についての記述はないため結ばなかった。
- relatedCompanies: the-awa-bank: 前事業年度に全株式を売却済みで当事業年度の保有はなく、主要取引金融機関としての関係でもあったため結ばなかった。
- relatedCompanies: the-nanto-bank: 特定投資株式は主要取引金融機関としての資金調達が保有目的であり、銀行との資金調達の関係は結ばないため結ばなかった。
- relatedCompanies: 候補外の相手: 関西高速鉄道株式会社（なにわ筋線整備のための借入金への債務保証の相手）、KNT-CTホールディングス株式会社（特定投資株式に旅行業の提携先として記載）、新関西国際空港株式会社（空港線の鉄道施設の賃貸人）は、いずれも related-candidates に含まれないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 提出後の事項（2026年4月1日に実施済み）: 当社は2026年4月1日付で、鉄道事業を吸収分割により南海電気鉄道分割準備株式会社（同日付で南海電気鉄道株式会社に商号変更）へ承継させ、当社の商号を株式会社NANKAIに変更して事業持株会社へ移行した（2025年6月18日開催の第108期定時株主総会で承認。【重要な後発事象】【重要な契約等】に記載）。本エントリーの事業構成と数値は2026年3月31日現在のものである。
- businessModel: 海運業の撤退決定: MD&Aに、事業環境の変化、運航コストの上昇、船舶・設備の老朽化などを踏まえ、2028年3月末を目途にフェリー事業（和歌山・徳島航路）から撤退することを決定した旨が記載されている。撤退は未実施であり、本エントリーは2026年3月31日現在の事業構成によっている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
