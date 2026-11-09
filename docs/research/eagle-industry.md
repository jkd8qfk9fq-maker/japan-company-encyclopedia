# イーグル工業 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | イーグル工業株式会社 |
| 証券コード | 6486 |
| docID（データを取り出した文書） | `S100YFUB` |
| 原本 docID | `S100YFUB` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFUB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | イーグル工業株式会社 / 6486 / docID S100YFUB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
eagle-industry: 10 件の数値を有報XBRLと照合
有報: イーグル工業株式会社 有価証券報告書－第72期(2025/04/01－2026/03/31) (docID S100YFUB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
eagle-industry: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…関等を加えた全てのステークホルダーに利益と誇りをもたらす」ことです。2026…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替え・表示方法の変更（地域別売上高で中国をアジア・オセアニアから独立掲記）の記載がありますが、修正再表示チェックで全行一致し、売上高・当期純利益の範囲に変化がないため financialNotes は書きませんでした。
- businessModel: 中期経営計画の最終年度の目標経営数値は、投資指標の語を含むため strategy には書きませんでした。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。
- history: 沿革は15件に絞りました。1985年の有漢精密株式会社の設立、1989年のイーグル工機株式会社の設立、1990年の島根イーグル株式会社の設立、1996年のイーグル精密株式会社の設立、1998年の新潟イーグル株式会社への商号変更、2010年のイーグルホールディングヨーロッパB.V.の設立、2012年のＫＥＭＥＬ株式会社の吸収合併は含めていません。
- industry: 主たる業界は、売上高の大半を占める自動車・建設機械業界向け事業と東証の業種分類（機械）から機械としました。
- industry: 自動車・建設機械業界向け事業が売上高の半分以上を占めるため、自動車を2つ目に付けました。
- industry: 半導体製造装置向けシールなどを事業として開示しているため、半導体を付けました。
- relatedCompanies: 神戸製鋼所：2004年にコベルコ・マリンエンジニアリングの株式を取得したのは過去の一回限りの取引で、同社は2012年に吸収合併されたため結ばない。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ：資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: みずほフィナンシャルグループ：資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: りそなホールディングス：資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: 三井住友フィナンシャルグループ：資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: 三井住友トラストグループ：資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: 第一ライフグループ：保有目的が純投資目的のため結ばない。
- relatedCompanies: リコー：社名の断片一致（リコール）のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: セキ、マニー、エン、高速、ランド、コア、ベース、大和、キャリア、フリー、トルク、ゼロ、カバー、ウィル、スローガン：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 連結子会社と持分法適用関連会社はすべて非上場のため結ばない。
- relatedCompanies: 大株主のその他の相手は信託銀行・金融機関・個人・持株会のため、事業会社の大株主として結ばない。
- terms: 新たに提案する用語はありません。メカニカルシール（軸封装置）、特殊バルブなどの事業用語は本文で説明しています。

## 要確認（status に反映）

- businessModel: ＮＯＫ株式会社との共同株式移転による経営統合は2026年10月1日を予定しています。2025年11月10日に経営統合契約を締結し、両社の完全親会社となる「NOK Group株式会社」を設立する予定です。提出日時点では計画であり、完了した取引ではありません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
