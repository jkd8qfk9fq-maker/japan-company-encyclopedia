# 新日本空調 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 新日本空調株式会社 |
| 証券コード | 1952 |
| docID（データを取り出した文書） | `S100YDMT` |
| 原本 docID | `S100YDMT` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDMT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 新日本空調株式会社 / 1952 / docID S100YDMT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shin-nippon-air-technologies: 10 件の数値を有報XBRLと照合
有報: 新日本空調株式会社 有価証券報告書－第57期(2025/04/01－2026/03/31) (docID S100YDMT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
shin-nippon-air-technologies: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画PhaseⅢの経営数値目標（2029年度の受注工事高・完成工事高・利益などの目標値）は将来の目標のため、金額を本文には書いていない。
- businessModel: 受注工事高は金額を本文に書かない規則の対象のため、flow には完成工事高と当期純利益だけを書いた。
- businessModel: 変則決算・決算期の変更・会計基準の変更はない。financialNotes には株式分割と1株当たり情報の算定方法の事実のみを記録した。
- businessModel: 2026年6月26日開催予定の定時株主総会で決議予定の期末配当は通常の剰余金の配当であり、本文には書かず warnings に記録する。
- businessStructure: 設備工事事業の単一セグメントのため事業は1つとし、children は【事業の内容】に印字された工事分野（空調・冷熱、給排水・衛生、電気）と、子会社が担う保全・施工協力で分けた。製品・サービスごとの売上高は開示が省略されているため、children に金額は書いていない。
- businessStructure: 海外子会社8社は設備工事事業に含まれるため、地域では分けていない。
- history: 沿革に印字された資本金の金額（1930年の資本金20万円、1969年の資本金2億円）は、本文に財務数値を書かない規則のため本文には書いていない。
- history: 支店の設置や事業内容の細かな追加・変更、本社移転（2007年）などの小項目は割愛した。
- industry: 主たる業界は、設備工事事業の単一セグメント （建設業法に基づく設備工事の設計・施工）であることから建設（construction）とした。閉じた分類に設備工事の専用区分は無いが、建設で表せるため taxonomyGaps は付けていない。
- relatedCompanies: 清水建設：主要な顧客の開示（金額と向きが印字）があるため customer とした。
- relatedCompanies: 日本電設工業・三井物産・三井不動産：【大株主の状況】に載る事業会社であり、4区分（親会社・子会社・持分法適用関連会社・その他の関係会社）に当たらないため major-shareholder とした。日本電設工業と三井不動産は相互に株式を保有し、取引の記載もある。
- relatedCompanies: 大成建設・鹿島建設・大林組・大東建託：完成工事や手持工事の相手先として名前が挙がるが、主要な顧客としての開示がなく、今回は結ばなかった。
- relatedCompanies: LINEヤフー・SMC：完成工事の発注者・相手先として名前が挙がるのみのため、今回は結ばなかった。
- relatedCompanies: 東京ガス：名前が挙がるのは子会社の東京ガスエンジニアリングソリューションズであり、東京ガス自体への取引の言及ではないため結ばなかった。
- relatedCompanies: 株式会社三井住友銀行：大株主に載るが金融機関であり、金融関係のため結ばなかった。三井住友信託銀行も信託銀行のため結ばなかった。
- relatedCompanies: 株式会社東芝：大株主（2.76％、2026年3月31日現在）だが非上場のため候補に無く、結べない。
- relatedCompanies: 三井住友トラストグループ・三井住友フィナンシャルグループ・三菱UFJフィナンシャル・グループ・第一ライフグループ：金融関係取引を理由とする政策保有または大株主のため結ばなかった。
- relatedCompanies: オリンパス、住友不動産、東海旅客鉄道、太平電業、帝国ホテル、東京エネシス、ヤクルト本社、日本ドライケミカル、平和不動産、タクマ、日本化学産業、日機装、ツムラ、西日本旅客鉄道、日本フェンオール、日阪製作所、野村不動産ホールディングス、アジアパイルホールディングス、東プレ、アマノ、東京精密、空港施設、ANAホールディングス、京阪ホールディングス、コスモ・バイオ：【株式の保有状況】の特定投資株式に保有目的の定型文とともに載るのみで、個別の取引実績の裏付けが無いため結ばなかった（日本電設工業と三井不動産は大株主でもあるため major-shareholder として結んだ）。
- relatedCompanies: 連結子会社10社（新日空サービス、日宝工業、新日空（中国）建設有限公司ほか）はいずれも非上場のため relatedCompanies には含めていない。
- relatedCompanies: エン（エン・ジャパン）、イノベーション、フロンティア、セキ、ビジョン、キャリア、ポート、コア、ランド、イシン、日新、高島：一般語や戦略名、地名への社名一致であり、会社への言及ではないため結ばなかった。
- relatedCompanies: 久光製薬、豊田自動織機：候補の listing がコードリストに無いため結べない。
- terms: 用語の助言はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
