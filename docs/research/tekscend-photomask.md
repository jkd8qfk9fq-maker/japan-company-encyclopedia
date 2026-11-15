# テクセンドフォトマスク — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | テクセンドフォトマスク株式会社 |
| 証券コード | 429A |
| docID（データを取り出した文書） | `S100YJ5L` |
| 原本 docID | `S100YJ5L` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ5L.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | テクセンドフォトマスク株式会社 / 429A / docID S100YJ5L（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tekscend-photomask: 8 件の数値を有報XBRLと照合
有報: テクセンドフォトマスク株式会社 有価証券報告書－第5期(2025/04/01－2026/03/31) (docID S100YJ5L)
利益・総資産・純資産・従業員数: 16 件を照合
すべて一致しました。
tekscend-photomask: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報が窓内に見つからず比較していない（証拠パックの注記のとおり）。訂正・後発事象はいずれも「該当事項はありません」と印字されている。
- businessModel: 経営指標として開示された売上収益成長率と営業利益率は、利益の金額や比率を本文に書かない規則のため perspectives には記載しなかった。
- businessModel: 調整後営業利益・調整後EBITDA等の非IFRS指標は本文に記載しなかった。
- businessStructure: 報告セグメントは「フォトマスク関連事業」の単一セグメントで、製品別・領域別の売上収益は開示されていないため、children には金額を書かず、その旨を各 children の説明に明記した。
- businessStructure: シンガポールでは現在データ処理工程のみを行っており、2026年度中に新工場が稼働予定と印字されている。提出時点では未稼働の計画であるため、事業構成には含めず、ここに記録する。
- businessStructure: 拠点と事業の対応は単一セグメントのため全拠点がフォトマスク関連事業に属する。主要な設備の状況のセグメント欄も「フォトマスク事業」と印字されている。
- history: 沿革表は年月セルと事象文が対応して印字されており、行順で対応づけた。当社設立前（1961年〜2019年）は前身であるTOPPANグループのフォトマスク事業の沿革で、本文の記載どおり収録した。
- history: 設立時の資本金額は印字がないため記載していない。
- industry: 主たる業界は、単一セグメントである半導体用フォトマスクの製造・販売に対応する semiconductors とした。
- industry: フォトマスクは半導体製造工程の原版であり、製造装置・部材の性格も持つが、事業の中心は半導体製造向けであるため electronics は付けなかった。
- relatedCompanies: integral（インテグラル）: 2022年4月に当社株式の49.9％を凸版印刷株式会社から取得した経緯は印字されているが、2026年3月31日現在の大株主の状況では保有割合は0.85％で、投資を本業とする会社であり、現在の取引・提携の印字がないため結ばなかった。
- relatedCompanies: ray（レイ）: 「ファウンドリ」等の一般語の部分一致で、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: en（エン）: 「AIエンジン」等の一般語の部分一致で、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: zero（ゼロ）: 「ゼロ災害」等の一般語の部分一致で、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: seki（セキ）: リスク記述中の一般語の部分一致で、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: step（ステップ）: 収益認識の「ステップ」という一般語の一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: career（キャリア）: 「キャリアの形成」という一般語の一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: cota（コタ）: 「インコタームズ」中の部分一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「ベースに算出」という一般語の一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: core（コア）: 「コア技術」という一般語の一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: trust（トラスト）: コードリストにない相手で、文脈も位相シフトマスクの説明中の一般語のため結ばなかった。
- relatedCompanies: vision（ビジョン）: 経営方針の「Vision（ありたい姿）」という一般語の一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: jinushi（地主）: 子会社の議決権に関する一般的な記述中の部分一致で、当社との関係の記載がないため結ばなかった。
- relatedCompanies: land（ランド）: 「ブランド」中の部分一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: port（ポート）: 「レポート」中の部分一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: slogan（スローガン）: 「スローガンとして掲げ」という一般語の一致で、会社としての記載がないため結ばなかった。
- relatedCompanies: Samsung Electronics Co., Ltd. は主要な顧客として売上収益15,063百万円が印字されているが、関連企業候補のデータに含まれていないため結ばなかった。顧客としての事実は businessModel に記載した。
- relatedCompanies: GlobalFoundries は持分法適用関連会社2社の共同出資者（持分50％）として印字されているが、関連企業候補のデータに含まれていないため結ばなかった。
- terms: 助言: 用語「フォトマスク」（半導体製造の露光工程で回路パターンを転写するための原版）、「EUVマスク」（極端紫外線を使うフォトマスク）、「位相シフトマスク」（光の位相を制御して転写特性を高めたフォトマスク）、「ファウンドリ」（半導体の製造を専門に請け負う会社）、「プロセスノード」（半導体の微細加工技術の世代を示す指標）、「ナノインプリント」（型を押し当てて微細なパターンを転写する技術）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
