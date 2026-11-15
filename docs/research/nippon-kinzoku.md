# 日本金属 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本金属株式会社 |
| 証券コード | 5491 |
| docID（データを取り出した文書） | `S100YJG2` |
| 原本 docID | `S100YJG2` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJG2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本金属株式会社 / 5491 / docID S100YJG2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-kinzoku: 10 件の数値を有報XBRLと照合
有報: 日本金属株式会社 有価証券報告書－第119期(2025/04/01－2026/03/31) (docID S100YJG2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nippon-kinzoku: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は有報の百万円印字のとおり転記した（セグメント・指標とも百万円単位で印字されている）。
- businessModel: 証拠パックの組替え注意について、抽出セクション内に表示方法の変更・組替えの注記は確認できず、前期有報との修正再表示チェックも全系列一致のため、financialNotesには記録せず本warningsに判断を留めた。
- businessModel: 経営方針に印字される次期の業績見通し（利益指標を含む数値）は、利益・投資指標であるためstrategyには転記せず定性的な方針のみを記載した。
- businessModel: 本ツリー（jce-w3）のスキーマにsuppliersキーが存在しないためsuppliersは記載していない。仕入先の事実（日本製鉄株式会社・日本冶金工業株式会社が購買取引先）はrelatedCompaniesフラグメントに記録した。
- businessModel: 特定投資株式の保有株式数注記に印字される株式分割は、伊藤忠商事株式会社・株式会社名古屋銀行・日本製鉄株式会社という保有先企業のものであり、当社の株式分割ではないためneedsReviewには記録していない。
- businessModel: 当期に実施された自己株式の取得は資本政策事項であり、期末時点の登録内容に影響しないため本warningsに留めた。
- businessStructure: セグメント間の内部売上高を含むMD&A・セグメント計の数値は用いず、子にはセグメント情報の外部顧客への売上高のみを記載した。
- businessStructure: 連結子会社の日金スチール株式会社の売上高（21,168百万円、主要な損益情報等）は範囲が異なるため子には転記していない。
- businessStructure: 関係会社の資本金は禁止金額に当たるため、沿革・関係会社の記載からは転記していない。
- history: 1939年の株式会社改組に印字される資本金は、禁止金額に当たるため転記していない。
- history: 連結子会社の設立・合併等の資本金額も同様に転記していない。
- industry: 鉄鋼メーカーの主たる業界は、日本製鉄・中山製鋼所・大同特殊鋼・中部鋼鈑などの先例に従い chemicals を主業界とした（同タクソノミーでは鉄鋼を含む素材産業の区分）。売上高の大半をみがき帯鋼事業が占めるため、副業界は付していない。
- relatedCompanies: 特定投資株式の保有目的は末尾の文言が全銘柄で同一だが、各銘柄の取引役割（販売取引先・購買取引先・販売及び購買取引先・金融取引先）は銘柄ごとに個別に印字されているため、取引役割が印字された銘柄についてその役割で関連付けした（目的の末尾が同一様式でも役割が個別に異なる場合は関連付けする先例による）。
- relatedCompanies: 田島スチール株式会社は主要な顧客ごとの情報に売上高4,769百万円（全体の9.6％）と印字される最大の販売先だが、関連候補に含まれていないため関連付けせず、本warningsに事実を記録した。
- relatedCompanies: 株式会社みずほフィナンシャルグループ・株式会社名古屋銀行・株式会社大垣共立銀行・株式会社三菱ＵＦＪフィナンシャル・グループ・株式会社四国銀行は、保有目的が金融取引先としての財務活動の円滑化であり、資金調達関係のみのため関連付けしなかった。
- relatedCompanies: 大株主に印字される伊藤忠丸紅鉄鋼株式会社は伊藤忠商事株式会社・丸紅株式会社の子会社であり、上場親会社とは別の法人であるため関連付けしなかった。
- relatedCompanies: 関連候補のうちニックス（日金精整テクニックスの語の一致）、ランド（THAILANDの語の一致）、ビジョン（経営ビジョンの語の一致）、コタ（インコタームズの語の一致）、BASE（本社事務所の建物名の一致）、リコー（リコールの語の一致）、ステップ、カバー、コア、エン、パス、丸紅（伊藤忠丸紅鉄鋼の語の一致）はいずれも誤検出であり、取引・提携・資本関係の印字はないため関連付けしなかった。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
