# 川崎地質 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 川崎地質株式会社 |
| 証券コード | 4673 |
| docID（データを取り出した文書） | `S100XN3U` |
| 原本 docID | `S100XN3U` |
| 提出日（原本） | 2026-02-25 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XN3U.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 川崎地質株式会社 / 4673 / docID S100XN3U（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kawasaki-geological-engineering: 6 件の数値を有報XBRLと照合
有報: 川崎地質株式会社 有価証券報告書－第75期(2024/12/01－2025/11/30) (docID S100XN3U)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
kawasaki-geological-engineering: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは6系列すべて差異ゼロで、組替えに伴う数値の変更はない。
- businessModel: 主要な経営指標等の注記のうち、潜在株式が存在しないための希薄化後指標の非開示と、第73期の自己資本利益率を期末自己資本で計算した旨は表示事項のため、financialNotesには入れていない。
- businessModel: 営業利益、総資産、純資産、受注高、現金及び預金の残高などの金額は本文に書いていない（売上高と当期純利益だけを本文の金額とする規則による）。第6次中期経営計画の数値目標も書いていない。
- businessModel: 期末配当（2026年2月26日開催予定の定時株主総会で決議予定）は資本政策の手続のため、本文には書いていない。
- businessModel: 中期経営計画で目標とする経営指標（自己資本当期純利益率）は投資の語にあたるため、本文には書いていない。
- businessModel: Wikipediaの冒頭は「地質調査業者の登録第1号」など有報と重なる内容が中心で、有報にない補足として使う事実はなかったため使っていない。
- businessStructure: 単一セグメントのため、本社・関東支社・海洋・エネルギー事業部、ジオラボ関東、北陸支店などの拠点は特定の子区分に結びつけていない。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。有報に個別の仕入先名の記載はない（MD&Aで協力業者への外注費に触れるのみ）。
- businessStructure: 連結子会社は株式会社ユニオン・コンサルタント（議決権の所有割合100％）の1社。関連会社は文化財調査コンサルタント株式会社（微化石分析と文化財調査。当社が一部発注）とＯＨＹＡ　ＵＮＤＥＲＧＲＯＵＮＤ　ＥＮＥＲＧＹ株式会社（大谷石採石場跡地の地下水を利用した熱供給。当社は地下空間貯留水管理業務を受託）の2社で、【関係会社の状況】では重要性が乏しいため記載が省略されている。
- businessStructure: MD&Aの対象区分別の販売実績（運輸施設・上下水道・情報通信分野が最大）は顧客分野別の内訳であり、製品・サービス区分ごとの金額開示ではないため、子区分には金額を登録していない。
- history: 沿革のうち、支店・営業所・出張所・事務所の設置（1951年の東京支店から1998年の秋田事務所まで多数）、本社の移転（1969年・1970年・1974年・1999年）、ＩＳＯ９００１の認証取得（1997年）、川崎土木株式会社と株式会社エスピーシーの設立（1983年）およびエスピーシーの吸収合併（1993年）、ハノイ駐在員事務所の設置（2014年）、土質試験室の移転（2019年）、大谷地下資源研究所の展示室開室（2023年）は、個別の事業転換ではないため沿革に登録していない。
- history: 1951年の設立時の資本金額は沿革に印字されているが、資本金額は歴史に書かない規則のため記載していない。
- history: 2025年12月の名桜土質測量設計の子会社化は決算日後の出来事であり、needsReviewにも記録した。
- industry: 主たる業界はconstructionとした。単一セグメントの地質調査事業（建設コンサルタント）が事業のすべてであるためである。
- industry: DEIの別記事業はCTEと印字されており、分類とも整合する。
- relatedCompanies: focus-systems / kuribayashi-steamship / nkk-switches / environmental-control-center / fudo-tetra: 特定投資株式として印字されるが、保有目的は全銘柄共通の定型句（「地質調査関連事業の取引の安定的、長期的な維持・強化のため保有しております。」）のみで、個別の取引・提携の記載がないため結ばない。
- relatedCompanies: cti-engineering: 特定投資株式の保有目的は全銘柄共通の定型句であり、かつ当事業年度中に全株式を売却済みのため結ばない。
- relatedCompanies: mizuho-financial-group / sumitomo-mitsui-financial-group: 金融機関であり、特定投資株式の保有目的は預金や資金決済等の金融取引の継続・強化のためであるため結ばない。大株主として印字される株式会社みずほ銀行・株式会社三井住友銀行も金融取引の関係として結ばない。
- relatedCompanies: career: 「キャリア研修」など一般語の部分文字列一致のみで、株式会社キャリアについての取引・提携・資本関係の記載はない。
- relatedCompanies: vision: 「中・長期ビジョン」など一般語の部分文字列一致のみで、株式会社ビジョンについての記載はない。
- relatedCompanies: daiwa: ambiguous。住所の地名（神奈川県大和市）などの一致のみで、株式会社大和についての記載はない。
- relatedCompanies: en: ambiguous。一般語の部分文字列一致のみ。
- relatedCompanies: idea-consultants: 財務諸表の文章中の部分文字列一致のみで、いであ株式会社についての取引・提携の記載はない。
- relatedCompanies: 候補外のため結んでいない相手: 国土交通省と防衛省は官公庁であり、つがるオフショアエナジーは候補にない主要な顧客である。日本生命保険相互会社と明治安田生命保険相互会社は大株主だが候補になく保険会社である。株式会社日本カストディ銀行（信託Ｅ口）は役員株式給付信託（BBT）に係る信託口である。主要な顧客ごとの売上金額は、関連企業の説明には書かない規則のため記載していない。
- terms: 助言のみ。用語としては「地質調査」「ボーリング調査」「物理探査」「土質試験」「地質リスクマネジメント」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 期間後の出来事として、2025年12月3日に株式会社名桜土質測量設計の全株式を取得し子会社化しています（2025年7月の取締役会決議を経て、同年9月に株式譲渡契約を締結）。登録は2025年11月30日現在の構成で行っており、期間後の子会社化の反映には人の確認が必要です。
- businessStructure: 期間後の出来事として、2025年12月3日に株式会社名桜土質測量設計の全株式を取得し子会社化しています（2025年7月の取締役会決議を経て、同年9月に株式譲渡契約を締結）。登録は2025年11月30日現在の構成で行っており、期間後の子会社化の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
