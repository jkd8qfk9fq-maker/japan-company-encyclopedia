# ドリームインキュベータ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ドリームインキュベータ |
| 証券コード | 4310 |
| docID（データを取り出した文書） | `S100YD1A` |
| 原本 docID | `S100YD1A` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD1A.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%A4%E3%83%B3%E3%82%AD%E3%83%A5%E3%83%99%E3%83%BC%E3%82%BF

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ドリームインキュベータ / 4310 / docID S100YD1A（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dream-incubator: 10 件の数値を有報XBRLと照合
有報: 株式会社ドリームインキュベータ 有価証券報告書－第26期(2025/04/01－2026/03/31) (docID S100YD1A)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
dream-incubator: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 経営戦略に掲げる2030年3月期の目標（売上高と利益率）は投資・利益指標にかかわる数値目標のため、本文とperspectivesには数値を書かず、経営資源をビジネスプロデュース事業に集中する方針のみを定性的に記載した。
- businessModel: MD&Aの段階利益（セグメント利益など）の金額と増減理由、キャッシュ・フローの金額、受注実績の金額は書いていない。
- businessModel: パックの組替え警告について、該当する記載は連結財務諸表注記の「その他の包括利益に関する組替調整額」等の標準的な項目と、経営指標等の注記にある法人税等会計基準の遡及適用であり、後者はfinancialNotesに記録した。前期有報との修正再表示照合は全6系列で差異ゼロだった。
- businessModel: 連結従業員数は2022年3月期の773人から2023年3月期に136人へ減っているが、アイペットグループの連結除外によるものである。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした（ビジネスプロデュース6,787百万円、ベンチャー投資1,904百万円）。2事業の合計は連結売上高8,691百万円と一致する。
- businessStructure: 本社設備はビジネスプロデュースとベンチャー投資の両セグメントが連記された行のため、特定の事業に結びつけなかった。設備の帳簿価額は書いていない。
- businessStructure: suppliersキーは本ツリーの旧スキーマのため省略した。【事業の内容】に個別の仕入先名の記載はない。
- businessStructure: 連結子会社は【関係会社の状況】にDI Pan Pacific Inc.、Dream Incubator Southeast Asia Joint Stock Company、DIインドデジタル投資組合、Next Riseソーシャル・インパクト・ファンド投資事業有限責任組合が個別に記載され、ほかに6社がある。
- businessStructure: 売上高が2023年3月期の30,132百万円から2024年3月期に5,378百万円へ大きく減っているのは、2023年1月にアイペットホールディングス株式会社の全株式を譲渡し連結の範囲から除外したことによる（沿革に出来事として記録した）。
- history: 本社移転（2002年6月の東京都目黒区への移転、2011年6月の東京都千代田区霞が関への移転）、2000年6月の本社事務所開設、2000年7月の新事業創出促進法の認定、2010年のDI Asian Industrial Fund, L.P.の組成、2012年の日本知財ファンド１号投資事業有限責任組合への出資と連結子会社化、2015年の東京ガールズコレクションの商標権売却は省略した。
- history: 資本金額（設立時の資本金、2002年と2005年の公募増資後の資本金）は書いていない。
- history: 創立者（堀紘一）はWikipediaの補足であり、創業の項目のsignificanceにのみ使った。数値はWikipediaから採っていない。
- industry: 主たる業界は暫定でitとした。売上の約8割を占めるビジネスプロデュース事業は経営・戦略コンサルティングであり、閉じた集合にコンサルティングの区分がない。デジタル・IT領域への支援を含む専門サービスとして最も近いitを暫定とした（taxonomyGaps参照）。
- industry: ベンチャー投資は報告セグメントとして外部顧客への売上高1,904百万円が独立して開示されているため、financeを2つ目に付けた。
- relatedCompanies: trust：日本マスタートラスト信託銀行の信託口や役員報酬BIP信託に関する文言の一致のみで、コードリストにもないため結ばなかった。
- relatedCompanies: core：「コア・ケイパビリティ」という一般的な表現の一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: career：「キャリア志向」など一般語の一致のみのため結ばなかった。
- relatedCompanies: en：「エンゲージメント」などの部分一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: vision：「ビジョン」という一般語の一致のみのため結ばなかった。
- relatedCompanies: base-4481：「議決権ベース」の部分一致のみのため結ばなかった。
- relatedCompanies: port：「ポートフォリオ」の部分一致のみのため結ばなかった。
- relatedCompanies: zero：「残存価額をゼロ」など会計処理の文言の一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: tein：「リテイン」の部分一致のみのため結ばなかった。
- relatedCompanies: ray：「プレイヤー」の部分一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: suzuki-6785：執行役員の氏名（鈴木一矢）の一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: wills：株主優待ポイントの交換先である「プレミアム優待倶楽部」の運営会社として印字されるのみで、事業上の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 候補にない相手：日本マスタートラスト信託銀行株式会社（信託口）は信託口の保有であり結ばなかった。SMBC日興証券株式会社は金融機関の保有であり結ばなかった。自社の連結子会社は結ばない。アイペットホールディングス株式会社は2023年1月に全株式を譲渡済みで、現在の関係はない。
- terms: 助言のみ。用語としては『ビジネスプロデュース』『ソーシャルインパクトボンド（SIB）』『インキュベーション』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ドリームインキュベータの主たる事業（ビジネスプロデュース事業） → 提案: コンサルティング（経営・戦略コンサルティング）。有価証券報告書が主たるセグメントを「ビジネスプロデュースセグメント」とし、事業創造支援や成長戦略立案支援を行うと書く事業に合う区分が閉じた集合に無いため、デジタル・IT領域への支援を含む専門サービスとして最も近いitを暫定とした。当社の中心はソフトウェア開発ではなく経営・戦略コンサルティングであり、通常のITとは事業の性格が異なる。
