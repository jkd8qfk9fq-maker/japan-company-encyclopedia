# ウィルグループ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ウィルグループ |
| 証券コード | 6089 |
| docID（データを取り出した文書） | `S100YFJF` |
| 原本 docID | `S100YFJF` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFJF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ウィルグループ / 6089 / docID S100YFJF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
will-group: 10 件の数値を有報XBRLと照合
有報: 株式会社ウィルグループ 有価証券報告書－第20期(2025/04/01－2026/03/31) (docID S100YFJF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
will-group: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の目標（2029年3月期の連結営業利益やROE）は、本文に書ける財務数値（売上収益と当期純利益）以外の指標のため、perspectives には金額・比率を書かなかった。
- businessModel: 決算期の変更や変則決算はなく、会計基準は一貫してIFRSで、修正再表示チェックも前期有報と全行一致だったため、financialNotes は空にした。経営指標の注記にある企業結合の取得原価配分の遡及修正は一般的な会計処理の注記であり、数値の訂正ではないため financialNotes には入れなかった。
- businessModel: 従業員数（2026年3月期9,005人）は経営指標に印字されているが、本文の説明には使っていない。
- businessStructure: 事業の並び順は、セグメント注記の外部収益（2026年3月期：国内Working事業88,262百万円、海外Working事業58,501百万円）の大きい順とし、報告セグメントに含まれない「その他」（92百万円）を最後に置いた。
- businessStructure: 国内Working事業のchildrenは、【事業の内容】に印字された6つのカテゴリー（セールス、コールセンター、ファクトリー、介護、建設技術者、その他）を使った。カテゴリー別の金額は開示されていないため、金額は書いていない。
- businessStructure: 「その他」の内容（民間・地方自治体向けDX推進支援事業等）はセグメント注記の概要による。前期に事業譲渡した外国人向けモバイル通信事業「ENPORT mobile」は、当期は事業として存在しないため含めていない。
- history: 沿革は【沿革】の表の印字どおりに年月を確認し、年単位で記載した。事業の転機ではない行（2006年設立時の本社移転など細目）は主な出来事に絞った。
- history: 当社の設立（2006年）は共同株式移転による持株会社の設立で、グループの事業の起源は1997年のセントメディアとビッグエイドの設立にあるため、沿革は1997年から記載した。
- history: HR CAREERの株式取得（2025年10月）は提出前の完了した事実であり、MD&Aでも新規連結として印字されている。提出後の文書（otherFilingsInWindow）は空で、重要な後発事象は連結・個別とも「該当事項はありません」だったため、後発文書の確認（ack）は不要だった。
- industry: 主たる業界は、報告セグメントのすべて（国内Working事業・海外Working事業）が人材派遣、業務請負、人材紹介などの人材サービスであることから人材サービス（human-resources）とした。閉じた分類に当てはまる区分があるため taxonomyGap は記録しなかった。
- relatedCompanies: will（株式会社ウィル）: 「ウィル」の一致は自社のブランド「WILLOF」や連結子会社（ウィルオブ・ワーク等）の名称によるもので、株式会社ウィルとの取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: core（株式会社コア、ambiguous）: 「コア」の一致はWell-beingスコアなどの文中の一般語との部分一致で、曖昧なため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「ランド」の一致は「ブランド」の部分一致のため結ばなかった。
- relatedCompanies: step（株式会社ステップ）: 「ステップ」の一致は収益認識の5ステップアプローチなど文中の一般語のため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「ポート」の一致は「ポートフォリオ」や前期に譲渡した事業「ENPORT mobile」の部分一致のため結ばなかった。
- relatedCompanies: en（エン株式会社、ambiguous）: 「エン」の一致は文中の一般語との部分一致で、曖昧なため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア」の一致は「キャリア支援」などの文中の一般語や子会社名（HR CAREER）の部分によるもので、株式会社キャリアとの関係の記載がないため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」の一致は自社の理念である「WILLビジョン」などの文中の語のため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「ベース」の一致は「連結ベース」など文中の一般語のため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 「コロナ」の一致は「ポストコロナ」の部分一致のため結ばなかった。
- relatedCompanies: nissin（株式会社日新、コードリストにない・ambiguous）: 「日新」の一致は新株予約権の文中の部分一致と思われ、相手の同一性も確認できないため結ばなかった。
- relatedCompanies: freee（フリー株式会社）: 「フリー」の一致は「リスクフリー・レート」の部分一致のため結ばなかった。
- relatedCompanies: king（株式会社キング）: 「キング」の一致は「ワーキング」の部分一致のため結ばなかった。
- relatedCompanies: no-1（株式会社No．1）: 「No.1」の一致はWILLビジョンの文中の表現のため結ばなかった。
- relatedCompanies: trust（株式会社トラスト、コードリストにない）: 「トラスト」の一致は大株主の日本マスタートラスト信託銀行株式会社（信託口）の名称の一部で、信託銀行の信託口のため結ばなかった。
- relatedCompanies: 株式会社ROXX（候補リスト外）: 特定投資株式として、国内Working事業（建設技術者領域）の派遣事業成長における主要な取引先としての関係強化のため株式を保有している旨が印字されているが、related-candidates.json の候補に含まれていないため、候補からのみ選ぶ規則により結ばなかった。
- relatedCompanies: HmComm株式会社（候補リスト外）: 特定投資株式として保有していたが、当事業年度に全株式を売却済みで現在の関係ではないため結ばなかった。
- relatedCompanies: 大株主の状況（2026年3月31日現在）は、個人株主と日本マスタートラスト信託銀行株式会社（信託口）などの信託口が中心で、結べる事業会社の大株主はいなかった。
- relatedCompanies: 連結子会社44社はいずれも非上場のため、関連企業には含めていない（事業構造と businessModel に記載）。
- terms: 助言: 用語「ハイブリッド派遣」（スタッフをチーム単位で派遣する形態）、「正社員派遣（無期派遣）」（派遣会社と無期雇用契約を結んだスタッフを派遣する形態）、「外国人雇用支援」（外国人労働者を受け入れる企業の雇用と生活を支援するサービス）、「エッセンシャル領域」（社会生活の維持に不可欠でAIや自動化に代替されにくい領域）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
