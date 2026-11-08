# DMG森精機 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＤＭＧ森精機株式会社 |
| 証券コード | 6141 |
| docID（データを取り出した文書） | `S100XUMY` |
| 原本 docID | `S100XUMY` |
| 提出日（原本） | 2026-03-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUMY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＤＭＧ森精機株式会社 / 6141 / docID S100XUMY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 4 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dmg-mori: 10 件の数値を有報XBRLと照合
有報: ＤＭＧ森精機株式会社 有価証券報告書－第78期(2025/01/01－2025/12/31) (docID S100XUMY)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2023-12-31","previousFiling":49113000000,"latestFiling":47927000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":37138000000,"latestFiling":22068000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
dmg-mori: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「DMG森精機株式会社」が EDINET の提出者名「ＤＭＧ森精機株式会社」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…械の製造・販売と関連サービスを通じて利益を確保しています。2025年12月期…）
- 確認: [other-profit-wording] financials[3].note: 売上高と当期純利益以外の利益に触れていないか確認する（…業のみの金額となり、には非継続事業の損益が含まれています。2023年12月期…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との間で税引前当期利益の2023年12月期・2024年12月期の数値が異なるのは、ロシア事業の非継続事業への分類替えによるもので、有報の経営指標の注記と注記「32．非継続事業」に説明がある。事実として financialNotes に記録し、needsReview には入れなかった。
- businessModel: MD&Aに印字された営業利益・税引前当期利益の金額や増減率は、本文の数値は売上収益と当期純利益だけという規則により書いていない。受注高・受注残高の金額も書いていない。
- businessModel: wikipedia.json はあったが、内容は本社所在地や事業概要など有報と重なるものが中心で、順位などの数値は使えないため、補足には使わなかった。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上収益（2025年12月期）の大きい順（マシンツール343,277百万円、インダストリアル・サービス171,652百万円）。2つとも報告セグメントである。
- businessStructure: セグメント注記の全社機能に計上される外部顧客への売上収益46百万円は報告セグメントではないため、事業として立てなかった。
- businessStructure: listings の market は表紙の印字「東京証券取引所プライム市場」から「プライム」とした。
- history: 沿革は年月と事象文が連記された表で、崩れた表ではないため印字どおりに採用した。工場建設・テクニカルセンタ拡充などの細目は省略し、設立・事業転換・上場・提携・商号変更・子会社化などの節目に絞った。
- history: 資本金の金額が関わる行は沿革に含めていない（金額の記載自体を避けた）。
- industry: 主たる業界は machinery とした。2つの報告セグメント（マシンツール、インダストリアル・サービス）はいずれも工作機械とその関連サービスであり、売上収益514,976百万円の全部が工作機械に関わるため、業界は1つだけにした。
- industry: 半導体はMD&Aで顧客産業として受注回復の文脈に現れるだけで、自社の事業として開示されていないため semiconductors は付けなかった。
- relatedCompanies: アマダ: 【沿革】に2015年3月のアマダマシンツールの旋盤事業の譲受契約があるだけで、過去1回限りの事業譲受のため結ばなかった。
- relatedCompanies: 南都銀行: シンジケートローンの貸付人の一社として名前があるだけで、資金調達の関係のため結ばなかった。
- relatedCompanies: 日本証券金融: 【大株主の状況】に載る金融機関で、事業会社ではなく、取引・提携の個別の記述もないため結ばなかった。
- relatedCompanies: エン: 「エンジニアリング」という一般語の断片への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: ステップ: 収益認識の会計方針にある「ステップ」という一般語への一致のため結ばなかった。
- relatedCompanies: ベース: 「四半期ベース」などの一般語への一致のため結ばなかった。
- relatedCompanies: セキ: 「水セキュリティ」などの一般語の断片への一致のため結ばなかった。
- relatedCompanies: ランド: 「ポーランド」「ブランド」などの断片への一致のため結ばなかった。
- relatedCompanies: 大和: 所在地の「大和郡山市」への一致で、同社への言及ではないため結ばなかった。
- relatedCompanies: ゼロ: 「CO2排出量ゼロ」という一般語への一致のため結ばなかった。
- relatedCompanies: コア: 「コアユニット」という部品の呼称への一致のため結ばなかった。
- relatedCompanies: イノベーション: 施設名「東京デジタルイノベーションセンタ」への一致のため結ばなかった。
- relatedCompanies: ポート: 「サポート」の断片への一致のため結ばなかった。
- relatedCompanies: トラスト: 日本マスタートラスト信託銀行（信託口）の名称への一致で、listing も「（コードリストにない）」のため結ばなかった。
- relatedCompanies: フリー: 「CO2フリー電力」という一般語への一致のため結ばなかった。
- relatedCompanies: アイル: 大量保有報告書の「アイルランド」という地名への一致のため結ばなかった。
- relatedCompanies: ウィル: 「ウィルミントン」という地名への一致のため結ばなかった。
- relatedCompanies: ベーシック: 「ベーシック・マシン」という製品区分の呼称への一致のため結ばなかった。
- relatedCompanies: カバー: 「カバーする方針」という一般語への一致のため結ばなかった。
- relatedCompanies: 高速: 「高速精密旋盤」という一般語への一致のため結ばなかった。
- relatedCompanies: リコー: 「リコール」の断片への一致のため結ばなかった。
- relatedCompanies: テイン: 「リテイン」という一般語の断片への一致のため結ばなかった。
- relatedCompanies: リード: 「リードタイム」という一般語への一致のため結ばなかった。
- terms: 助言: 「MX（マシニング・トランスフォーメーション）」は用語集への登録候補です。工程集約・自動化・DXにより顧客へ付加価値の高いソリューションを提供し生産性を向上させる考え方で、この会社が推進する戦略の中核として有報の経営方針やMD&Aに説明があります。
- terms: 助言: 「工程集約」も登録候補です。複数の加工工程を1台の機械や1回の段取りに集約することで生産性を高める工作機械の考え方で、同社の製品戦略を説明する言葉として有報に繰り返し現れます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
