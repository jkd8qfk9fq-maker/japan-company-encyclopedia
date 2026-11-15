# トレジャー・ファクトリー — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社トレジャー・ファクトリー |
| 証券コード | 3093 |
| docID（データを取り出した文書） | `S100Y644` |
| 原本 docID | `S100Y644` |
| 提出日（原本） | 2026-05-26 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y644.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社トレジャー・ファクトリー / 3093 / docID S100Y644（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
treasure-factory: 10 件の数値を有報XBRLと照合
有報: 株式会社トレジャー・ファクトリー 有価証券報告書－第31期(2025/03/01－2026/02/28) (docID S100Y644)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
treasure-factory: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 5年表の注記は、希薄化効果のある潜在株式がない年度の説明と従業員数の定義のみで、変則決算・決算期変更・会計基準の変更等の事実はないため financialNotes は空とした。summary の irregularPeriods は空、fiscalYearChange は null である。
- businessModel: MD&Aが重視する経営指標は利益率や資本効率を示す指標であるため、strategy には定性的な方針のみを書き、数値目標としての指標名は書かなかった。
- businessModel: 本文の財務数値は売上高と当期純利益のみとし、MD&Aやセグメント情報に印字された利益の金額・増減率・利益率は書かなかった。
- businessModel: 資本業務提携先の株式会社STANDING OVATIONは未上場で related-candidates に含まれないため関連企業には結ばず、提携の事実は沿革に記録した。同社株式については、実質価額が著しく低下したため評価損を計上した旨の注記がある。
- businessModel: 重要な後発事象は連結・個別とも該当事項なしと印字されており、needsReview は空とした。
- businessStructure: セグメントは報告セグメント「リユース事業」と、報告セグメントに含まれない「その他」の2区分とした。その他は外部顧客への売上高が印字されているため、売上順の最後に置き金額を併記した。
- businessStructure: 業態別・子会社別の外部売上高は開示されていないため、子区分には金額を書かなかった。リユース事業の金額はセグメント注記の外部顧客への売上高を用い、MD&Aの内部振替を含む数値は使わなかった。
- businessStructure: 連結子会社の株式会社カインドオルは、売上高が連結売上高の10％を超える特定子会社である旨が関係会社の状況に注記されているが、子会社単体の損益情報は範囲が異なるため本文には書かなかった。
- businessStructure: 金額はすべて有報の百万円印字をそのまま用いた（千円印字からの換算は行っていない）。
- history: 沿革表の後半（2014年12月以降）は、年月セルと事象文が分離して印字されていた。年月は24件、事象は30件（うち2件は2文で1行）で数が一致しないため、先頭24件に限って行順に対応づけた。この対応は、タイ子会社設立→バンコク1号店、台湾子会社設立→台湾1号店、アクオ取得→GKファクトリーによる吸収合併といった前後関係が他の記載と矛盾しないことを確認した。
- history: 残りの6件（中国エリア初進出・岡山平井店の開店、東北エリア直営店初進出・トレファクスタイル仙台卸町店の開店、トレファク楽器の開始、Treasure Factory USA Inc.の設立、エンプティ株式会社からの「Empty Dressy」事業の譲受、トレファクスタイル台北公館店の開店）は、年月を印字で確定できないため沿革には含めなかった。USA法人の設立は当連結会計年度の新規設立・新規連結であることが連結の範囲の変更に注記され、楽器業態の1号店出店と岡山・仙台への出店、台北のスタイル業態出店はMD&Aの当期出店実績表から当期中の出来事であることがうかがえるが、いずれも年月は確定できない。
- history: 1999年の株式会社への組織変更に伴う資本金の金額は、金額記載を避けるため沿革には書かなかった。個別の店舗開店・閉店のうち転機でないものは省略した。
- industry: 主たる業界は retail とした。売上高の中心はリユースショップでの店舗販売であり、閉じた集合の retail が最も近い。リユース専用の値は閉じた集合にないが、小売の範囲で説明できるため taxonomy gap は記録していない。
- relatedCompanies: land（株式会社ランド）: 「ブランド品」などの一般語の一部との一致であり、株式会社ランドへの言及はないため結ばなかった。
- relatedCompanies: technologies（株式会社テクノロジーズ）: 連結子会社「株式会社トレファクテクノロジーズ」の名称の一部との一致であり、株式会社テクノロジーズとは別の法人のため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」という一般語との一致のため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「オンラインベース」という一般語との一致のため結ばなかった。
- relatedCompanies: en（エン株式会社、ambiguous）: 英語表記や「Empty Dressy」などの断片的一致であり、エン株式会社への言及はないため結ばなかった。
- relatedCompanies: quest（株式会社クエスト）: かつての連結子会社「株式会社デジタルクエスト」の名称の一部との一致であり、株式会社クエストとは別の法人のため結ばなかった。
- relatedCompanies: rix（リックス株式会社）: 「スキル・マトリックス」の一部との一致のため結ばなかった。
- relatedCompanies: suzuki-6785（株式会社鈴木、ambiguous）: 社外取締役の氏名（鈴木信夫氏）との一致であり、株式会社鈴木への言及はないため結ばなかった。
- relatedCompanies: aeon-mall（イオンモール株式会社）: EDINETコードリストにない相手であり、言及は借入金の内訳に現れる出店先施設名「イオンモール熱田店」のみで、イオンモール株式会社との取引・提携の記載はないため結ばなかった。
- relatedCompanies: ishin（イシン株式会社）: サステナビリティの気候シナリオ文中の一般語の断片との一致のため結ばなかった。
- relatedCompanies: king（株式会社キング）: 子会社の店舗ブランド「ゴルフキング」の一部との一致であり、株式会社キングへの言及はないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「スポーツアウトドア」などの一般語の一部との一致のため結ばなかった。
- relatedCompanies: core（株式会社コア、ambiguous）: 「コアとなるリユース事業」という一般語との一致のため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 「新型コロナウイルス感染症」の一部との一致のため結ばなかった。
- relatedCompanies: garden（株式会社ガーデン）: 出店先施設名「フレッツガーデン姫路花田店」の一部との一致のため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション」という一般語との一致のため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: EDINETコードリストにない相手であり、言及は大株主の信託銀行（信託口）の名称の一部との一致のため結ばなかった。
- relatedCompanies: 資本業務提携先の株式会社STANDING OVATIONは未上場で、related-candidates に含まれないため結ばなかった。提携の事実は沿革（2020年）に記録した。
- relatedCompanies: 政策保有株式は非上場株式のみ（10銘柄）で、特定投資株式及びみなし保有株式は該当事項なしと印字されているため、上場会社との株式保有を通じた関係はない。
- relatedCompanies: 大株主の株式会社スリースターマネジメント（5.11％、2026年2月28日現在）は代表取締役社長の資産管理会社で未上場・候補外のため結ばなかった。野村證券株式会社（同2.67％）は証券会社であり候補にも含まれないため結ばなかった。信託銀行（信託口）は受託・純投資のため結ばなかった。
- relatedCompanies: 関係会社は連結子会社7社のみで、親会社・持分法適用関連会社・その他の関係会社はない（関係会社の状況）。連結子会社は関連企業リンクの対象外とした。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。
- terms: 助言: 「リユース品」「古物市場」「持込買取・出張買取・宅配買取」は本文の理解に必要な用語候補である。古物市場は事業の内容の注記で定義されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
