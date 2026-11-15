# 神田通信機 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 神田通信機株式会社 |
| 証券コード | 1992 |
| docID（データを取り出した文書） | `S100Y9QZ` |
| 原本 docID | `S100Y9QZ` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y9QZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 神田通信機株式会社 / 1992 / docID S100Y9QZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kanda-tsushinki: 10 件の数値を有報XBRLと照合
有報: 神田通信機株式会社 有価証券報告書－第89期(2025/04/01－2026/03/31) (docID S100Y9QZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kanda-tsushinki: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記は千円の印字を百万円に切り捨てた（切上げはしていない）。セグメント別の切捨て値の合計（6,226＋490＋60＝6,776百万円）は、印字された売上高合計6,777百万円と切捨てのため１百万円異なる。合計は印字どおり6,777百万円を書いた。
- businessModel: 中期経営計画の目標とする経営指標（売上高・経常利益・ＲＯＥの数値目標）と配当政策におけるＲＯＥ・ＤＯＥの基準は、投資指標・利益指標のため本文と戦略には書かず、ここに記録するにとどめた。
- businessModel: 受注高の金額（当連結会計年度75億24百万円など）は本文の数値として書かなかった。投資有価証券売却に係る特別の利益・損失の金額と理由も本文には書かなかった。
- businessModel: suppliers はこのツリーのスキーマに無いため businessModel には書かなかった。仕入先の一覧としての開示はなく、三菱電機との代理店関係は relatedCompanies に記録した。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の大きい順（情報通信6,226,439千円、照明制御490,636千円、不動産賃貸60,781千円）。
- businessStructure: 主要な設備の状況では本社等のセグメント欄が「全社共通」と情報通信・照明制御・不動産賃貸の連記になっており、拠点と事業の対応は結びつけなかった。
- businessStructure: 三菱電機との代理店関係は relatedCompanies に supplier として記録した。仕入先の一覧としての開示はない。
- history: 設立時の資本金（19万５千円）は、沿革への資本金額の記載が禁じられているため書かなかった。
- history: 支店・営業所の開設、ISO認証の取得などの細目は、主要な転機に絞って割愛した。株式会社神田製作所（1971年設立、2007年に全株式を譲渡）は元連結子会社であり、現在の子会社ではないため children には入れなかった。
- industry: 主たる業界は、売上高の９割超を占める情報通信事業（電話交換設備・ネットワークシステムの構築・保守）から telecommunications とした。
- industry: 不動産賃貸事業は報告セグメントとして独立開示があるため real-estate を２つ目に付けた。照明制御事業は建物設備の制御であり、閉じた集合に独立の区分が無いため業界としては足さなかった。
- relatedCompanies: hitachi（日立製作所）は、沿革に1952年の販売特約店契約の締結と1992年の特約店契約への一本化の記載があるだけで、事業の内容など当期の取引を示す記述がないため結ばなかった。事実は沿革に記載した。
- relatedCompanies: canon-marketing-japan（キヤノンマーケティングジャパン）は、沿革に1992年の取引基本契約の締結と販売開始の記載があるだけで、当期の取引を示す記述がないため結ばなかった。事実は沿革に記載した。
- relatedCompanies: konica-minolta（コニカミノルタ）は、沿革に1982年のＯＡ機器販売開始の記載があるだけで、当期の取引を示す記述がないため結ばなかった。
- relatedCompanies: ntt（ＮＴＴ）は、特定投資株式の保有目的が他の銘柄と同一の定型句（円滑な取引関係の維持・強化による収益拡大のため保有しており、主に情報通信事業における販売取引を行っております）であり、それだけでは結ばなかった。沿革の1953年の記載は前身の日本電信電話公社の機械工事認定業者となった事実である。
- relatedCompanies: bandai-namco-holdings（バンダイナムコホールディングス）、seven-and-i-holdings（セブン＆アイ・ホールディングス）、t-and-d-holdings（Ｔ＆Ｄホールディングス）、resorttrust（リゾートトラスト）、meisei-industrial（明星工業）は、いずれも特定投資株式の保有目的が同一の定型句であり、それだけでは結ばなかった。リゾートトラストについては、保有目的の注記に同社が2025年４月１日付で株式分割（１株につき２株）を行った事実が印字されているが、これは保有先の分割であり当社の分割ではない。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱ＵＦＪフィナンシャル・グループ）と resona-holdings（りそなホールディングス）は、特定投資株式の保有目的が「当社の主要取引金融機関」である金融機関であり、資金調達先としての関係のため結ばなかった。
- relatedCompanies: hikari-tsushin（光通信）は、大株主の状況に載るのが光通信ＫＫ投資事業有限責任組合（純投資の有限責任組合）であり、株式会社光通信自身が事業会社の大株主として載っているわけではないため結ばなかった。
- relatedCompanies: 株式会社ナカヨは2026年３月31日現在の大株主の状況に所有株式数60,300株（2.63％）の事業会社として載っているが、候補（掲載済み企業）に無いため結ばなかった。なお当社が保有していた株式会社ナカヨの株式は、当事業年度にあいホールディングス株式会社による同社のＴＯＢにより全株式を売却している。
- relatedCompanies: ai-holdings（あいホールディングス）は、株式会社ナカヨへのＴＯＢの実施者として印字されているだけで、当社との取引・提携の記述はないため結ばなかった。
- relatedCompanies: en（エン）、port（ポート）、seki（セキ）、career（キャリア）、base-4481（ベース）、cover（カバー）、core（コア）、fisco（フィスコ）、freee（フリー）、kohsoku（高速）、kuze（久世）、system-integrator（システムインテグレータ）、vision（ビジョン）はいずれも一般語や人名等への文字列の一致であり、各社との取引・提携・資本関係の記述はないため結ばなかった。
- relatedCompanies: 自社の子会社である日神電子株式会社と日本電話工業株式会社は、事業構造の children に記録し、関連企業としては結ばなかった。
- terms: 用語の候補として、ＤＡＬＩ（照明制御の国際標準規格）、マルチゲートウェイ®（建物設備とＩＴ機器・クラウドシステムを接続する当社グループのソフトウェア）、ＰＢＸ（電話交換設備）、かんだ光（当社の光回線サービス）、ＳＩｅｒ（システムインテグレーター）を挙げる。助言のみで、用語データは作成していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
