# コーナン商事 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | コーナン商事株式会社 |
| 証券コード | 7516 |
| docID（データを取り出した文書） | `S100Y7KL` |
| 原本 docID | `S100Y7KL` |
| 提出日（原本） | 2026-05-29 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y7KL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | コーナン商事株式会社 / 7516 / docID S100Y7KL（id は英語表記「KOHNAN SHOJI CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kohnan-shoji: 10 件の数値を有報XBRLと照合
有報: コーナン商事株式会社 有価証券報告書－第49期(2025/03/01－2026/02/28) (docID S100Y7KL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kohnan-shoji: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[2].description: 売上高と当期純利益以外の利益に触れていないか確認する（…ます。外部顧客への売上高のうち、連結損益計算書の売上高の10％以上を占める相…）
- 確認: [other-profit-wording] financials[4].note: 売上高と当期純利益以外の利益に触れていないか確認する（…の子会社は2025年12月1日以降の損益計算書が連結の範囲に含まれています。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙DEIから2026年2月期。売上高は有報の印字ラベル『営業収益』、純利益は『親会社株主に帰属する当期純利益』。前期比・増減額はMD&Aの印字。
- businessModel: 売上高の増減理由は MD&A の『経営成績の分析』の記述のみ。純利益の減少理由として有報は販売費及び一般管理費の増加を挙げているが、費用の金額は本文規則上書かず、理由も省いた。
- businessModel: 商品部門別の販売実績の合計は502,059百万円で営業収益と一致しない。有報は差を説明していないため、合計は書いていない。
- businessModel: 営業収益の前期の金額は brief.md の5年表（501,403百万円）と一致するが、本文では増減率のみ使った。
- businessModel: 「売上高の90％超が日本国内」は【関連情報】の記載（本邦の外部顧客への売上高が連結損益計算書の売上高の90％を超える）。
- businessModel: 『売上の源泉』のEC販売は、I'nTホールディングスが『インテリア・家具を中心としたEC専業事業会社２社を統括する持株会社』であるというMD&Aの記述から。EC売上の金額は印字がない。
- businessModel: 戦略・強み・業界内の地位の perspectives は、第4次中期経営計画の目標が将来の数値目標であり省略した。
- businessModel: 2026年2月と4月のアレンザホールディングスに関する出来事（公開買付け・資本業務提携）は期末後の事象で、事業の仕組みの説明からは外し history に記載した。
- businessStructure: 決算期は表紙DEIから2026年2月期（第49期）。訂正なし。
- businessStructure: セグメントは単一。事業の並びは【事業の内容】の区分（小売・建築資材等の販売 → その他（流通業周辺サービス等））で、後者は金額なしのため最後。children は MD&A の商品部門別『販売実績』の大きい順（240,177／158,928／70,254／16,693／16,006）。
- businessStructure: 商品部門別の販売実績の合計は502,059百万円で、営業収益519,779百万円と一致しない（有報は差の内訳を印字していない）。合計は本文に使っていない。
- businessStructure: 店舗数はMD&Aの店舗数表の印字。KOHNAN VIETNAM は決算日が12月31日のため同社の2025年12月31日現在の店舗数。
- businessStructure: ホームセンターみつわ（2025年10月31日に51％取得）とI'nTホールディングス（2025年12月26日に全株取得）は期中に連結に加わったため、売上高には取得後の期間分のみが含まれる。
- businessStructure: 店舗の呼称『コーナン』は沿革の第1号店名から。ブランド別店舗数は有報に無いため書いていない。
- businessStructure: listings の market は表紙が東京証券取引所プライム市場と印字しているため。
- history: 沿革の表は崩れておらず、年月と概要が対応している。主要な出来事を選び、同年の複数の出来事は1件にまとめた。
- history: 1982年のリックス子会社化、各種の子会社設立・吸収合併、本社移転などは省略した。
- history: 2026年2月の2件と2026年4月の公開買付け成立は有報提出時点（2026-05-29）までの記載。アレンザホールディングス株式会社の株主を当社とバローのみとする手続は『予定』と有報が書いており、本文には書いていない。
- history: 2023年の株式会社ホームインプルーブメントひろせの記述は、2018年4月の資本業務提携契約と2023年6月の全株式取得の2つの沿革行を合わせたもの。
- industry: 単一セグメントで、事業は『小売、建築資材等の販売』。小売業界の会社と明記されている（MD&Aの『当社グループが主に事業展開している小売業界』）ため retail のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を機械で確認できないため、結んだ相手は無い。
- relatedCompanies: アレンザホールディングス株式会社: 持分法適用関連会社（2026年4月6日）で関係性はあるが、掲載済み企業に無い（src/data/companies に該当なし）。同一性の根拠が足りず結ばない。
- relatedCompanies: 株式会社バローホールディングス: 資本業務提携に関する基本合意書の段階（2026年2月）で、取引・提携の内容が有報に印字されていない。同一性（候補ファイル無し）も確認できず結ばない。
- relatedCompanies: 連結子会社（建デポ、ホームインプルーブメントひろせ、ホームセンターみつわ、I'nTホールディングス等）は未上場で、掲載済みの上場企業ではないため結ばない。
- relatedCompanies: 提出会社の親会社等は『ありません』（有報）。
- terms: 用語の助言: 『ホームセンター』『DIY』『持分法適用関連会社』『連結子会社』『フランチャイズ（FC）』『公開買付け』が読者に説明を要する語。既存の用語集に無ければ追加を検討してほしい（本文ではリンクを使っていない）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
