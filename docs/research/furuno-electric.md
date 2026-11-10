# 古野電気 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 古野電気株式会社 |
| 証券コード | 6814 |
| docID（データを取り出した文書） | `S100YS03` |
| 原本 docID | `S100Y3Q6` |
| 提出日（原本） | 2026-05-18 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100YS03／有効文書 S100YS03（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YS03.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 古野電気株式会社 / 6814 / docID S100Y3Q6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
furuno-electric: 10 件の数値を有報XBRLと照合
有報: 古野電気株式会社 訂正有価証券報告書－第75期(2025/03/01－2026/02/28) (docID S100YS03)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第75期(2025/03/01－2026/02/28)、docID S100YS03）を有効文書としてこのパックを作った。原本は docID S100Y3Q6。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはAuditorsResponseKAMConsolidatedTextBlock・IndependentAuditorsReportConsolidatedTextBlock・KeyAuditMattersConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
furuno-electric: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の目標のうち本文に書けるのは売上高（2029年2月期に1,500億円）だけとし、営業利益率・ROE・ROIC・総還元性向などの目標数値は記載していません。
- businessModel: 訂正有価証券報告書（docID S100YS03）が有効文書ですが、分類は record-only で、財務の数値も本文も原本（S100Y3Q6）と同一（違いは監査報告書・KAMの節のみ）のため、needsReview には入れていません。出典は訂正有報の値を使いました。
- businessModel: 修正再表示チェックは全行一致で、決算期の変更や変則決算はありません。
- businessModel: 重要な後発事象や提出後の追加書類（otherFilingsInWindow）は無いため、承認待ち（ack）は不要でした。
- businessStructure: 事業の並びは2026年2月期のセグメント情報における外部顧客への売上高の大きい順です（舶用121,147百万円、産業用15,821百万円、無線LAN・ハンディターミナル3,305百万円、その他341百万円）。
- businessStructure: 「その他」は有報が「報告セグメントに含まれない事業セグメント」と明記する区分のため、売上順でも最後に置きました。
- businessStructure: 各事業の内訳区分（製品群）は【事業の内容】とセグメント概要の印字に基づきますが、金額は区分ごとに独立開示されていないため、各 children にその旨を明記しました。
- history: 有報の沿革は、1980年の合併について「実質上の存続会社である旧古野電気株式会社」について記述する旨が明記されているため、それに従いました。（参考）として載る形式上の存続会社（旧水産電気工業株式会社）の沿革行は、資本金の増資など金額を含む行が中心のため採用していません。
- history: 当連結会計年度（2026年2月期）に、関連会社だったFURUNO NAVIGATION TECHNOLOGY (SHANGHAI) CO., LTD.の出資金を追加取得して連結子会社としましたが、取得の年月が印字されていないため沿革には入れていません。
- history: 創立時の資本金など、資本金の金額は本文ルールのため記載していません。
- industry: 主たる業界は、最大の報告セグメントである舶用事業（2026年2月期の外部顧客への売上高121,147百万円、全体の約86％）がレーダーや魚群探知機などの電子機器であることに基づき electronics（電機）としました。産業用事業・無線LAN・ハンディターミナル事業も電子機器のため、2つ目の業界は付けていません。
- industry: 舶用電子機器そのものの区分は閉じた分類にありませんが、electronics で主たる事業を表現できるため taxonomyGaps にはしていません。
- relatedCompanies: 共栄タンカー（kyoei-tanker）: みなし保有株式等の表に名前があるだけで、保有目的や取引の印字が無いため結んでいません。
- relatedCompanies: サノヤスホールディングス（sanoyas-holdings）: 同上。保有目的や取引の印字が無いため結んでいません。
- relatedCompanies: ビジョン（vision）: 経営ビジョン「FURUNO GLOBAL VISION」の語の一致で、会社への言及ではありません。
- relatedCompanies: エン（en）・セキ（seki）・コア（core）・レイ（ray）・平和（heiwa）・高速（kohsoku）: 「エンゲージメント」「セキュリティ」「リプレイス」「平和の維持」「高速情報通信」などの一般語・部分一致（ambiguous含む）のため結んでいません。
- relatedCompanies: キャリア（career）・ベース（base-4481）・ランド（land）・ポート（port）・リード（the-lead）: 「キャリア形成」「営業利益ベース」「フィンランド」「ポートフォリオ」「生産リードタイム」などの一般語・部分一致のため結んでいません。
- relatedCompanies: リコー（ricoh）: 「リコール」の部分一致で、会社への言及ではありません。
- relatedCompanies: イノベーション（innovation）: 認証サービス「イノベーションエンドースメント」の名称の一部で、会社への言及ではありません。
- relatedCompanies: スペース（space）: 有報の提携相手は米国のスタートアップ、ゾナ・スペース・システムズで、候補の株式会社スペースとは別の会社です。同社は非上場でもあるため結んでいません。
- relatedCompanies: トラスト（trust）: 大株主の日本マスタートラスト信託銀行（信託口）の部分一致で、純投資の信託口のため結んでいません。
- relatedCompanies: 古野興産株式会社: 2026年2月28日現在で当社株式の13.24％を保有する筆頭株主ですが、非上場で候補にも無いため結んでいません。
- relatedCompanies: 連結子会社36社・持分法適用関連会社1社（SIGNET S.A.S）は、いずれも非上場のため結んでいません。
- terms: 用語候補： 魚群探知機（超音波で魚群の位置や深さを表示する装置）、舶用電子機器（船舶に搭載する航海・漁労・通信などの電子機器の総称）、GNSS（人工衛星で位置や時刻を測る仕組みの総称）、LEO-PNT（低軌道衛星でGNSSを補完する測位技術）、ITS（高度道路交通システム）、時刻同期（通信網や基地局の時刻を正確に合わせる技術）、電磁環境試験（電子機器が電磁波の影響を受けないかなどを測る試験）、IVD（体外診断用医療機器）——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
