# サンヨーホームズ株式会社 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | サンヨーホームズ株式会社 |
| 証券コード | 1420 |
| docID（データを取り出した文書） | `S100YGLY` |
| 原本 docID | `S100YGLY` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGLY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | サンヨーホームズ株式会社 / 1420 / docID S100YGLY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sanyo-homes: 10 件の数値を有報XBRLと照合
有報: サンヨーホームズ株式会社 有価証券報告書－第30期(2025/04/01－2026/03/31) (docID S100YGLY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sanyo-homes: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円へ切り捨てて転記した（四捨五入はしていない）。セグメント別売上高の切り捨て後の合計は50,501百万円となり、印字された連結売上高50,502百万円と1百万円差があるが、印字どおり転記した。
- businessModel: 本文の財務諸表の組替えは、営業外収益の「違約金収入」を「その他」へ含める表示方法の変更に伴う前年度財務諸表の組替えであり、売上高・当期純利益等の転記数値に影響しないため、financialNotesには記載せず本警告に記録した。前期有報との修正再表示チェックでも全系列で差異はなかった。
- businessModel: 経営方針、経営環境及び対処すべき課題等に印字された経営指標の目標（ROE15～20％、自己資本比率35～40％、配当性向20～30％）は、投資・利益指標であるため strategy には転記していない。
- businessModel: 主要な顧客として開示された丹下大（売上高5,117百万円、マンション事業）は個人であり、関連企業としては結んでいない（industryPositionに事実を記載）。
- businessModel: 重要な後発事象は「該当事項なし」。当連結会計年度中に発行された第3回・第4回新株予約権はインターナショナルスクール日本校の誘致プロジェクトに対する資金調達として印字されており、資本政策事項として本警告に記録するにとどめた。
- businessStructure: セグメントの並びは外部顧客への売上高の大きい順（マンション事業、住宅事業、その他）とした。「その他」はセグメント注記の区分どおり生活支援サービス等である。
- businessStructure: 連結子会社の主要な損益情報等に印字されたサンヨーリフォーム株式会社及びサンヨーホームズコミュニティ株式会社の単体売上高は、連結セグメントの数値と範囲が異なるため children には転記していない。
- history: 沿革に印字された設立時・増資時の資本金の金額は、転記禁止の金額情報にあたるため各行の説明には含めていない。
- industry: 主たる業界は construction とした。当社グループは軽量鉄骨プレハブ住宅を工場生産し設計・施工まで担う住宅事業が基盤であり、分譲マンションの開発・販売・賃貸を行うマンション事業の比重も大きいため、real-estate を副次区分とした。閉じた集合の既存値で足りるため taxonomy gap は記録していない。
- relatedCompanies: 株式会社クボタは、前身事業の譲渡元として沿革にのみ現れ、現在の資本・取引関係の印字がないため結んでいない（沿革のみの関係は結ばない）。
- relatedCompanies: 関西電力株式会社、セコム株式会社、オリックス株式会社は大株主の状況に主要株主として印字されているが、関係会社の状況への記載がなく、個別の取引役割や提携の印字も確認できないため結んでいない。
- relatedCompanies: 協業相手として印字された東京電力エナジーパートナー株式会社は、東京電力ホールディングス株式会社の未上場子会社であり別の法人のため結んでいない。
- relatedCompanies: 日本製鉄株式会社は前身会社の系列として沿革に現れるのみであり、現在の関係の印字がないため結んでいない。株式会社日本カストディ銀行は信託口のため結んでいない。
- relatedCompanies: Tien Phat Sanyo Homes Corporationは当社グループの関連会社そのものであるため結んでいない。特定投資株式は非上場株式1銘柄のみで、上場株式の保有による関係先はない。
- relatedCompanies: 上記のほか、本文の一般語との一致による候補（ポート、ハブ、ゼロ、スローガン、エン、フロンティア、ランド、ベース、キャリア、ビジョン等）は、いずれも当社との関係を述べる印字がないため結んでいない。日新、フレンドリーはEDINETコードリストにない相手でもある。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
