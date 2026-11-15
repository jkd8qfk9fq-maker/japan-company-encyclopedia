# NISSOホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＮＩＳＳＯホールディングス株式会社 |
| 証券コード | 9332 |
| docID（データを取り出した文書） | `S100YGQ8` |
| 原本 docID | `S100YGQ8` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGQ8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＮＩＳＳＯホールディングス株式会社 / 9332 / docID S100YGQ8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nisso-holdings: 6 件の数値を有報XBRLと照合
有報: ＮＩＳＳＯホールディングス株式会社 有価証券報告書－第3期(2025/04/01－2026/03/31) (docID S100YGQ8)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nisso-holdings: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「NISSOホールディングス株式会社」が EDINET の提出者名「ＮＩＳＳＯホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 収益分解情報の表示区分が当期から変更され（従来の産業別区分からサービス別区分へ）、前期分は組替済みの数値が印字されている。連結売上高・純利益などの5年経営指標に影響はなく、前期有報との修正再表示チェックも全行一致したため、表示方法の変更は financialNotes には記録せず、この記録にとどめた。
- businessModel: 中期経営計画の数値目標（2028年3月期の売上高目標など）や投資指標に当たる目標値は、本文・perspectives には含めなかった。
- businessModel: 株式会社ワールドインテックは合弁会社SUBARU nw Sightの共同出資者だが、related-candidates.json に含まれていないため関連企業には結ばず、役割を industryPosition に記録した。
- businessModel: 連結子会社のうちMan to Manホールディングス及び同社の子会社4社の決算日は5月31日、オールジヤパンガード株式会社の決算日は1月31日で、連結決算日と異なる（仮決算等の財務諸表を使用）。通常の取扱いのため needsReview には入れなかった。
- businessStructure: 単一セグメントのため、事業の区分は【事業の内容】と収益認識関係注記の分解情報（総合人材サービス107,766百万円、その他のサービス3,664百万円、合計111,430百万円で連結売上高と一致）に基づく。総合人材サービスの内訳4区分の単純合計は107,764百万円で、印字の107,766百万円と2百万円の差がある（端数処理）。印字どおりとした。
- businessStructure: その他のサービスの内訳（介護・福祉、警備、製造系システム開発受託）は金額が区分ごとに開示されていないため、children には金額を書かなかった。
- history: 沿革は当社の沿革（2023年以降）と、完全子会社の日総工産株式会社の沿革（1980年以降）の両方から主要な出来事を選んだ。日総工産の前身である日総工営株式会社の設立（1971年2月）は、沿革表の記載開始が日総工産設立の1980年8月であるため独立した行にはしなかった。
- history: 設立時の金額（資本金など）は沿革の文章には書かなかった。
- industry: 主たる業界は human-resources（人材サービス）とした。単一セグメントで、売上高の約97％を総合人材サービスが占めることが根拠。その他のサービス（介護・福祉、警備、製造系システム開発受託）は売上高の約3％で独立した報告セグメントではないため、副たる業界は付けなかった。
- relatedCompanies: en（エン）: ambiguous で、「エンジニア」などの語の部分一致のみで、相手について述べた取引・提携の記載がないため結ばなかった。
- relatedCompanies: ray（レイ）: ambiguous で、語の部分一致のみのため結ばなかった。
- relatedCompanies: career（キャリア）: 「キャリアチェンジ」などの語の一致のみで、相手についての記載がないため結ばなかった。
- relatedCompanies: land（ランド）: 「ブランド」などの語の部分一致のみのため結ばなかった。
- relatedCompanies: eyez（アイズ）: 連結子会社の株式会社アイズ（東京都中央区、未上場の子会社）とは社名が同じだが、上場のアイズ（5242）とは別の会社であり、同一性の根拠がないため結ばなかった。
- relatedCompanies: port（ポート）: 連結子会社テックポート株式会社の社名の部分一致のみのため結ばなかった。
- relatedCompanies: vector（ベクトル）: 連結子会社の株式会社ベクトル伸和とは社名が似るが、株式会社ベクトル（6058）とは別の会社であり、相手についての記載がないため結ばなかった。
- relatedCompanies: the-lead（リード）: 「リードする」という表現の一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「連結ベース」という語の一致のみのため結ばなかった。
- relatedCompanies: daiwa（大和）: ambiguous で、大株主の状況に載る大和証券株式会社は証券会社であり、取引・提携の記載がないため結ばなかった。
- relatedCompanies: idea-consultants（いであ）: 語の部分一致のみのため結ばなかった。
- relatedCompanies: seki（セキ）: ambiguous で、「セキュリティ」などの語の部分一致のみのため結ばなかった。
- relatedCompanies: sincere（シンシア）: 大株主の状況に所有割合1.45％で載るのみで、取引・提携の事実が印字されていないため結ばなかった。
- relatedCompanies: takashima-and-co（高島）: ambiguous で、住所中の「高島」の一致のみのため結ばなかった。
- relatedCompanies: trust（トラスト）: 信託銀行の名称の部分一致で、コードリストにない相手でもあるため結ばなかった。
- relatedCompanies: vision（ビジョン）: 「ビジョン」という語の一致のみのため結ばなかった。
- relatedCompanies: 株式会社ワールドインテックは合弁相手だが related-candidates.json に含まれていないため結ばず、役割を businessModel の industryPosition に記録した。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の事業の内容・関係会社の状況に説明のあるものに限った（助言のみ）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
