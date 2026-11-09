# 新東工業 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 新東工業株式会社 |
| 証券コード | 6339 |
| docID（データを取り出した文書） | `S100YE4V` |
| 原本 docID | `S100YE4V` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE4V.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 新東工業株式会社 / 6339 / docID S100YE4V（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sintokogio: 10 件の数値を有報XBRLと照合
有報: 新東工業株式会社 有価証券報告書－第129期(2025/04/01－2026/03/31) (docID S100YE4V)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sintokogio: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは重複年度の全行一致で、売上高・当期純利益の範囲に変化がないため、地域別売上高の表示方法の変更についてfinancialNotesは書きませんでした。
- businessModel: 2026年3月期の当期純損失の要因として、減損損失の計上が経営者による分析に記載されています。
- businessStructure: セグメントの並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: 「その他」の区分は報告セグメントに含まれない事業セグメントで、機械設計と福利厚生などの事業です。
- history: 沿革の1960年2月・1961年10月の欄と2002年10月・2003年3月の欄は、年月セルと事象文が分かれて印字されており、年月と事象の数が同じため行順で対応づけました。
- history: 1934年の設立時の資本金の金額は、本文の規則により書きませんでした。
- industry: 主たる業界は、売上高の大半を占める表面処理事業と鋳造事業が設備装置の製造販売であることから機械としました。東証の業種分類も機械です。
- industry: 特機事業に半導体市場向けの装置がありますが、市場環境の文脈での記載にとどまり、報告セグメントとして半導体を事業と開示していないため、半導体は付けませんでした。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ・みずほフィナンシャルグループ・りそなホールディングス・八十二長野銀行・七十七銀行・紀陽銀行・滋賀銀行：主要金融機関としての資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: 東海旅客鉄道・ダイセキ・日本トランスシティ・芝浦機械・御園座・岡谷鋼機・東邦瓦斯・タキヒヨー・キクカワエンタープライズ・東海染工・東陽倉庫・サーラコーポレーション・日本車輌製造：保有目的が情報収集のみのため結ばない。
- relatedCompanies: アイチコーポレーション：保有目的が情報収集のみで、当事業年度に全株式を売却済みのため結ばない。
- relatedCompanies: 住友理工：上場していないため結ばない。
- relatedCompanies: 新東：新東エンジニアリング株式会社などの連結子会社の略称で、新東株式会社との取引の印字がないため結ばない。
- relatedCompanies: ブラス・ランド・トーイン・トラスト・キャリア・レイ・ポート・ベース・コア・カバー・ベクトル・ハブ・キング・鈴木・ビジョン・レック・コロナ：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 連結子会社84社・関連会社6社：すべて非上場のため結ばない。
- relatedCompanies: 大株主のその他の相手は信託銀行・銀行・保険会社・財団・持株会のため、事業会社の大株主として結ばない。
- relatedCompanies: 特定投資株式の表にあるＦＵＪＩ・ＴＹＫ・ＣＫＤ・ＩＨＩ・ＡＧＣ・ＬＩＸＩＬ・ＴＰＲ・東亜ソシオホールディングス・東亜ＳＴは、関連企業の候補一覧にないため結ばない。
- terms: 新たに提案する用語はありません。表面処理事業、鋳造事業などの事業用語は本文で説明しています。

## 要確認（status に反映）

- businessModel: 2026年5月13日開催の取締役会で、豊川製作所敷地内（愛知県豊川市）に3Dプリンター技術を核とした放熱用金属部品及びセラミックス部品の量産体制を構築するため、新工場の建設を決定しました。総投資額は約100億円で、稼働開始は2028年8月を予定しています。提出日時点では計画であり、完了した投資ではありません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
