# スプリックス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社スプリックス |
| 証券コード | 7030 |
| docID（データを取り出した文書） | `S100XCTM` |
| 原本 docID | `S100XCTM` |
| 提出日（原本） | 2025-12-26 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XCTM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社スプリックス / 7030 / docID S100XCTM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sprix: 10 件の数値を有報XBRLと照合
有報: 株式会社スプリックス 有価証券報告書－第29期(2024/10/01－2025/09/30) (docID S100XCTM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sprix: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と当期純利益のみとした。金額はいずれもセグメント情報等とMD&Aに百万円単位で印字された値をそのまま転記した。
- businessModel: 本ツリー（jce-w3）のスキーマにsuppliersキーが存在しないため、businessModelにsuppliersは記載していない。個別の仕入先名と取引内容は印字されていない。
- businessModel: 変則決算と決算期変更は印字されておらず、修正再表示チェックでも前期有報との差異はなかった。重要な後発事象は該当事項なしと印字されている。
- businessModel: 連結の範囲の変更（SPRIX MANABIE EDUCATION PRIVATE LTDと株式会社Edutainment-Labの連結化）は当期中に完了し期末の体制に反映されているため、needsReviewではなくfinancialNotesとwarningsに記録した。株式会社Edutainment-Labは議決権の85％を所有する連結子会社である。
- businessModel: 経営指標として印字される比率は、投資・財務指標にあたるためperspectivesには転記していない。
- businessStructure: 事業の並び順はセグメント情報等の外部顧客への売上高の大きい順とした（森塾18,562百万円、湘南ゼミナール9,295百万円、河合塾マナビス3,355百万円、その他3,914百万円のうち報告セグメントを先に並べ、報告セグメントに含まれない「その他」は注記どおり最後とした）。実際には「その他」3,914百万円が河合塾マナビス3,355百万円より大きいが、報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: セグメントごとの金額はセグメント情報等に百万円単位で印字された外部顧客への売上高をそのまま転記した。セグメント間の内部売上高を含むMD&Aの数値は使っていない。
- businessStructure: 関係会社の状況に印字される連結子会社7社と持分法適用関連会社1社の資本金額は、金額に関する記載制限のため転記していない。
- businessStructure: 主要な設備の状況に印字される各事業所の帳簿価額は転記していない。
- history: 沿革の表は年月列と事象列が分離して印字されている崩れた表である。年月と事象を行順に対応づけて年を特定した。対応の裏付けとして、湘南ゼミナールとのフランチャイズ契約の締結日が重要な契約等に2007年2月1日と印字されること、プライム市場への移行が2022年4月、スタンダード市場への移行が2023年10月であることが行順対応と一致する。特定が不確かな中国事業やSNS「ゴルスタ」等の2012年から2017年の事象は、年を取り違えるおそれがあるため沿革には採用しなかった。
- history: 沿革に印字される子会社設立等に伴う資本金額は、金額に関する記載制限のため転記していない。
- industry: 主たる業界は human-resources（暫定）とした。教育サービス事業が売上の全てを占めるためであり、合う区分が無いことはtaxonomyGapsに記録した。金額が独立して開示されていない事業はないため、2つ目の業界は付けていない。
- relatedCompanies: cyberagent（サイバーエージェント）: 沿革にプログラミング総合研究所の共同設立が印字され、MD&Aにサイバーエージェントグループと協業中の「キュレオプログラミング教室」の記載があるため business-partner とした。株式会社キュレオ自体は当社の持分法適用関連会社（議決権40％）で上場会社ではなく、共同設立の相手である株式会社CA Tech Kidsも候補に無いため、いずれも関連付けの対象としなかった。
- relatedCompanies: rix（リックス）: 社名「スプリックス（SPRIX）」の部分一致であり、リックス株式会社への言及はないため結ばなかった。
- relatedCompanies: land（ランド）: 「ブランドロゴ」等の語句の部分一致であり、株式会社ランドへの言及はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「フォレスタデータベース」等の語句の部分一致であり、ベース株式会社への言及はないため結ばなかった。
- relatedCompanies: en（エン）: 「教育×エンタメ」等の一般語句の部分一致（ambiguous）であり、エン株式会社への言及はないため結ばなかった。
- relatedCompanies: port（ポート）: 「学習ナビゲーション」（対人サポート）等の語句の部分一致であり、ポート株式会社への言及はないため結ばなかった。
- relatedCompanies: nissin（日新）: コードリストになく、新株予約権等の本文の部分一致（ambiguous）であり、株式会社日新との取引・提携の印字はないため結ばなかった。
- relatedCompanies: grems（グリムス）: 読書教育プログラム「グリムスクール」の部分一致であり、株式会社グリムスへの言及はないため結ばなかった。
- relatedCompanies: seki（セキ）: 一般語句の部分一致（ambiguous）であり、セキ株式会社への言及はないため結ばなかった。
- relatedCompanies: shikigaku（識学）: 一般語句の部分一致（ambiguous）であり、株式会社識学への言及はないため結ばなかった。
- relatedCompanies: taya（田谷）: 所在地「世田谷区」等の部分一致（ambiguous）であり、株式会社田谷への言及はないため結ばなかった。
- relatedCompanies: zero（ゼロ）: 評価額をゼロとする会計処理の記述の部分一致（ambiguous）であり、株式会社ゼロへの言及はないため結ばなかった。
- relatedCompanies: corona（コロナ）: 「コロナ禍」の部分一致であり、株式会社コロナへの言及はないため結ばなかった。
- relatedCompanies: cover（カバー）: 内部監査が全体をカバーするという一般語句の部分一致であり、カバー株式会社への言及はないため結ばなかった。
- relatedCompanies: opro（オプロ）: 「プログラミング」等の語句の部分一致であり、株式会社オプロへの言及はないため結ばなかった。
- relatedCompanies: shinto（新東）: 一般語句の部分一致（ambiguous）であり、新東株式会社への言及はないため結ばなかった。
- relatedCompanies: trust（トラスト）: コードリストになく、大株主の日本マスタートラスト信託銀行株式会社（信託口）の部分一致であり、純投資の信託口のため結ばなかった。
- relatedCompanies: 株式会社河合塾マナビスは、連結子会社の株式会社湘南ゼミナールとのフランチャイズ契約（2007年2月1日締結）の相手だが、上場会社ではなく候補にも無いため結ばず、事実はここに記録する。株式会社松尾研究所はタブレット教材の共同開発の相手だが、上場会社ではなく候補に無いため結ばなかった。連結子会社7社と持分法適用関連会社1社は自社グループの会社のため関連付けの対象としなかった。特定投資株式は該当事項なしと印字されている。大株主は資産管理会社と個人、信託口等で、事業会社にあたる候補は無いため major-shareholder は付けなかった。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。「QE授業」「TOFAS」「フォレスタ」は同社固有のサービス・教材の名称であり、一般用語としての新規用語の提案は行わない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] スプリックス（sprix）の主たる業界（学習塾を中核とする教育サービス） → 提案: 教育（学習塾・進学塾・予備校などの教育サービス）。有報は、個別指導塾「森塾」を中核とし、湘南ゼミナールと河合塾マナビスを含む教育サービス事業を行う企業グループで、2025年9月期の連結売上高は35,127百万円です。閉じた集合に教育・学習支援を表す区分が無く、人材の育成を含む点で最も近い human-resources を暫定にしたが、同区分は人材紹介・派遣などの人材サービスを指す先例が中心で、子どもの学習指導とは事業の中身が異なります。学習塾を human-resources で暫定にした早稲田アカデミーや、企業研修を human-resources で暫定にしたアルーの先例に揃えた暫定であり、教育を表す区分の追加が望ましい。
