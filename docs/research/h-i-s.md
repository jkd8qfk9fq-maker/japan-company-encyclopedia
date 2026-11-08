# エイチ・アイ・エス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エイチ・アイ・エス |
| 証券コード | 9603 |
| docID（データを取り出した文書） | `S100XHDP` |
| 原本 docID | `S100XHDP` |
| 提出日（原本） | 2026-01-27 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHDP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エイチ・アイ・エス / 9603 / docID S100XHDP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 5 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 32 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
h-i-s: 10 件の数値を有報XBRLと照合
有報: 株式会社エイチ・アイ・エス 有価証券報告書－第45期(2024/11/01－2025/10/31) (docID S100XHDP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第43期(2022/11/01－2023/10/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第42期(2021/11/01－2022/10/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第41期(2020/11/01－2021/10/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第40期(2019/11/01－2020/10/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え・遡及適用・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
h-i-s: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…営にかかる費用などを差し引いた残りが利益になります。2025年10月期のは4…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の窓に第40期から第43期の訂正有価証券報告書がある。経営指標等の注記に、第41期から第43期の数値が誤謬の訂正による遡及処理後の数値であることと、2025年3月31日に訂正報告書を提出したことが印字されているため、その事実をfinancialNotesに記録した。修正再表示チェックでは、前期有報との重複年度が全項目一致している。
- businessModel: 当期純利益の減少理由（子会社の事業縮小に伴う特別損失の計上など）は、利益の金額や理由を書かない規則により本文に書いていない。
- businessModel: 中期経営計画の数値目標は書かず、方針の記述だけをperspectivesに要約した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2025年10月期：旅行事業307,976百万円、九州産交グループ25,355百万円、ホテル事業24,734百万円）の大きい順とし、報告セグメントに含まれない「その他」は最後に置いた。
- businessStructure: 旅行事業のchildrenは【事業の内容】とセグメント概要の区分（海外旅行・国内旅行）に従った。金額の独立開示がないため、childrenに金額は書いていない。
- businessStructure: 拠点数（国内149拠点、海外58カ国110都市141拠点）は、経営成績の分析に印字された2025年10月末時点の数値どおりに書いた。
- history: 沿革表は一部で年月セルと事象文が分かれて印字されている。2019年1月分までは年月の数と事象の数が一致したため行順に対応づけた（2012年12月～2019年1月は年月17件・事象17件）。
- history: 2019年9月以降は事象の数が年月の数を上回り、月単位の対応づけが確実でないため、市場区分の見直しによるプライム市場への移行とハウステンボス全株式の譲渡（いずれも2022年の出来事として並びから確認できるもの）だけを使い、各地の変なホテルの開業、本社の虎ノ門移転、Cross Eホールディングスの福岡証券取引所Q-Board上場、株式会社デベロップの持分法適用会社化などの出来事は落とした。
- history: 設立時の資本金10百万円は、資本金の金額を書かない規則により沿革に書いていない。
- industry: 主たる事業は旅行事業（外部顧客への売上高の8割以上）だが、閉じた分類に旅行・観光の値がないため、余暇・レジャーに最も近いentertainmentを暫定の主たる業界とし、taxonomyGapsに記録した。
- industry: 九州産交グループは自動車運送事業を中核とし、金額が独立して開示されている報告セグメントであるため、transportationを2つ目に付けた。
- industry: ホテル事業は不動産賃貸ではなく運営事業であり、合う値がないため業界を足していない。
- relatedCompanies: cross-e-holdings: 【関係会社の状況】の連結子会社であり、候補の正式名称と有報の印字が一致し、listingが上場のため結んだ。
- relatedCompanies: en: 「西日本エンジニアリング」などへの断片一致で、エン株式会社についての取引・資本関係の記載はない（ambiguous）。
- relatedCompanies: land: 在外子会社の名称（PTY. LTD.等）への断片一致で、株式会社ランドについての記載はない。
- relatedCompanies: rhythm: 「九州産交ランドマーク株式会社」などへの断片一致で、リズム株式会社についての記載はない。
- relatedCompanies: zero: 「CO2排出量を実質ゼロにする」などの一般語への一致で、株式会社ゼロについての記載はない（ambiguous）。
- relatedCompanies: seki: 「情報セキュリティ」への断片一致で、セキ株式会社についての記載はない（ambiguous）。
- relatedCompanies: path: 子会社「株式会社パスポルテ（現 株式会社クオリタ）」や「パスポート」への断片一致で、パス株式会社についての記載はない（ambiguous）。
- relatedCompanies: daiwa: 役員の個人名（大和田順子）への一致で、株式会社大和についての記載はない（ambiguous）。
- relatedCompanies: port: 「パスポート」への断片一致で、ポート株式会社についての記載はない。
- relatedCompanies: rion: 連結子会社「株式会社オリオンツアー」への断片一致で、リオン株式会社ではない。
- relatedCompanies: base-4481: 「営業利益ベース」への断片一致で、ベース株式会社についての記載はない。
- relatedCompanies: career: 「キャリア直販」という流通形態の語への一致で、株式会社キャリアについての記載はない。
- relatedCompanies: crooz: 連結子会社「株式会社クルーズプラネット」への断片一致で、クルーズ株式会社ではない。
- relatedCompanies: planet: 連結子会社「株式会社クルーズプラネット」への断片一致で、株式会社プラネットではない。
- relatedCompanies: trust: listingがコードリストになく、記載は本店所在地の建物名「神谷町トラストタワー」で、株式会社トラストについての記載はない。
- relatedCompanies: lec: 「フレックスタイム制度」への断片一致で、レック株式会社についての記載はない。
- relatedCompanies: marche: 連結子会社「株式会社トラベルマルシェ」への断片一致で、マルシェ株式会社ではない。
- relatedCompanies: heiwa: 経営方針の「世界の平和に貢献する」という一般語への一致で、株式会社平和についての記載はない（ambiguous）。
- relatedCompanies: king: 「海鮮バイキング いろは」への断片一致で、株式会社キングについての記載はない。
- relatedCompanies: kohsoku: 「高速バス」という事業の語への一致で、株式会社高速についての記載はない（ambiguous）。
- relatedCompanies: rix: 「スキルマトリックス」への断片一致で、リックス株式会社についての記載はない。
- relatedCompanies: belc: 連結子会社の名称の並びへの断片一致で、株式会社ベルクについての取引・資本関係の記載はない。
- relatedCompanies: core: 「コアコンピタンス」という一般語への一致で、株式会社コアについての記載はない（ambiguous）。
- relatedCompanies: cota: 地名「コタキナバル」への断片一致で、コタ株式会社についての記載はない（ambiguous）。
- relatedCompanies: freee: 「リスクフリーレート」への断片一致で、フリー株式会社についての記載はない。
- relatedCompanies: hs-holdings: 沿革に2000年の子会社化が載るが「現 グループ外」と印字されており、現在の関係はないため結ばなかった。
- relatedCompanies: meeq: 「プレミアムエコノミークラス」への断片一致で、ミーク株式会社についての記載はない。
- relatedCompanies: nissin: listingがコードリストになく、新株予約権の記載への断片一致で、株式会社日新との関係は確認できない（ambiguous）。
- relatedCompanies: skymark-airlines: 沿革に1996年のスカイマークエアラインズ株式会社の設立が載るが「現 グループ外」と印字されており、現在の関係はないため結ばなかった。
- relatedCompanies: will: 「コンピューターウィルス」への断片一致で、株式会社ウィルについての記載はない。
- relatedCompanies: 大株主は創業者の澤田秀雄氏（24.03％、2025年10月31日現在）や信託銀行・カストディが中心で、候補にある事業会社の大株主はいなかった。
- relatedCompanies: 九州産業交通ホールディングス株式会社は連結子会社（91.6％）だが、候補にないため結んでいない（有報提出会社だが上場会社ではない）。
- terms: 登録候補（助言のみ）: 変なホテル（ロボットなどを活用したホテルブランド）、ウォーターマークホテル（ホテルブランド）、ラグーナテンボス（愛知県蒲郡市のテーマパーク）、サクラマチ クマモト（熊本市の大型商業施設）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] エイチ・アイ・エスの主たる事業である旅行事業 → 提案: tourism（旅行・観光）。旅行事業が連結売上高の8割以上を占めるが、閉じた分類に旅行・観光の値がないため、余暇・レジャーに最も近いentertainmentを暫定とした。
