# ケー・エフ・シー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ケー・エフ・シー |
| 証券コード | 3420 |
| docID（データを取り出した文書） | `S100YDJU` |
| 原本 docID | `S100YDJU` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDJU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ケー・エフ・シー / 3420 / docID S100YDJU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kfc: 10 件の数値を有報XBRLと照合
有報: 株式会社ケー・エフ・シー 有価証券報告書－第62期(2025/04/01－2026/03/31) (docID S100YDJU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kfc: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて有報の印字どおりの表記（255億48百万円など）を使い、換算・切り捨ての書き換えはしていない。
- businessModel: 中期経営計画の数値目標（売上高・経常利益・配当性向の目標）は、利益額と投資指標を含むため本文・戦略には書いていない。
- businessModel: セグメント利益（連結の経常利益と一致する旨が注記されている）は、金額も増減も本文に書いていない。
- businessModel: 受注工事高・手持工事高の金額は本文に書いていない。
- businessModel: 訂正有報はなく、前期有報との修正再表示チェックでも全系列に差異はなかったため、financialNotes は空とした。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。千円額を百万円に切り捨てた3セグメントの合計は25,547百万円で、印字の連結売上高25,548百万円と1百万円の差がある（切り捨てによる差であり、合計は印字どおりとした）。
- businessStructure: 唐山日翔建材科技有限公司は非連結子会社で持分法非適用会社。出資比率は設立時50％で、2021年3月に22.2％を追加取得している。
- businessStructure: 遮水シート・防水シートの輸入販売・設計・施工は【事業の内容】の総括文にのみ現れ、セグメントとの対応が印字されていないため、特定の事業には結びつけていない。
- businessStructure: 仕入先の個別開示はなく、suppliers はこのワークツリーのスキーマにキーが無いため書いていない（商品仕入実績はセグメント別に印字されるのみ）。
- history: 沿革の表は年月と事項が対応して印字されており、行順で対応づけた。
- history: 営業所の設置、本社移転、ISO認証の取得などの細目は、主要な出来事に絞るため省いた（省略した行は沿革の原文に残る）。
- history: 設立時の資本金などの金額は沿革に書いていない。
- industry: 主たる業界は、最大の報告セグメントである建設事業（建設工事）と、建設資材を販売する2事業を含めた事業全体の性格から construction とした。
- relatedCompanies: ito-yogyo（イトーヨーギョー）: 特定投資株式の保有効果は「収益力の向上や技術・開発力の強化に向けた定期的な対話等」とのみ印字され、取引の記載がないため結ばなかった。
- relatedCompanies: sec-carbon（ＳＥＣカーボン）: 保有効果は「取引関係の維持に一定の効果は認められます」という定型的な文のみで、事業名や具体的な取引の記載がないため結ばなかった。
- relatedCompanies: zojirushi（象印マホービン）: 保有目的は経営基盤の再構築で、財務戦略上の保有と対話のみが印字され、取引の記載がないため結ばなかった。
- relatedCompanies: denka（デンカ）: 当事業年度に保有株式をすべて売却し、期末の保有はゼロのため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱ＵＦＪフィナンシャル・グループ）、senshu-ikeda-holdings（池田泉州ホールディングス）、the-nanto-bank（南都銀行）、the-shiga-bank（滋賀銀行）: いずれも金融機関で、主要取引金融機関としての資金調達・財務基盤の文脈のみのため結ばなかった。三菱ＵＦＪ銀行は大株主にも載るが、銀行の純投資・融資関係のため結ばなかった。
- relatedCompanies: east-japan-railway（ＪＲ東日本）: 開発中の製品『ガイナメッシュＢＴ』の試験施工を同社管内のトンネルで完了した旨の記載はあるが、取引や提携の明示がないため結ばなかった。
- relatedCompanies: central-japan-railway（東海旅客鉄道）、electric-power-development（電源開発）、nissan（日産自動車）: 完成工事・手持工事の表に個別工事の発注者として名前が現れるのみで、継続的な関係の記載がないため結ばなかった。
- relatedCompanies: kohsoku（高速）: 出現箇所はすべて高速道路の名称であり、株式会社高速そのものへの言及ではないため結ばなかった（ambiguous）。
- relatedCompanies: freee、innovation、base-4481、vision、en、port、ic、shinto、toumei、takashima-and-co、taya、seki、the-lead、united: いずれも一般語・部分一致（フリー・キャッシュ・フロー、イノベーション、ベース、経営ビジョン、エンジニアリング、ポートタウン線、インターチェンジ、新東名・東名、高島平、セキジュ、リードタイム等）であり、相手企業への言及ではないため結ばなかった。united は沿革中の旧子会社名の一部であり、候補のユナイテッド株式会社とは別法人である。
- terms: 助言: 用語「あと施工アンカー」は、コンクリートが固まった後に穴を開けて設置するアンカーを指し、同社の主力製品です。同社は1965年に日本初のあと施工アンカー専門企業として設立されました。
- terms: 助言: 用語「せん断補強RMA工法」は、同社独自のせん断補強工法で、ファスナー事業で扱われています。
- terms: 助言: 用語「STマイクロパイル工法」は、小口径鋼管杭を用いる補強工法で、国立研究開発法人土木研究所と同社を含む民間企業との共同研究により開発された工法です。
- terms: 助言: 用語「ガイナメッシュ」は、同社が開発するトンネル覆工コンクリートのはく落対策製品のシリーズ名です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ケー・エフ・シーのファスナー事業・土木資材事業（建設資材の販売） → 提案: 建設資材（あと施工アンカー等の建設用ファスナー・トンネル掘削資材）。ファスナー事業と土木資材事業の合計は外部顧客への売上高の約6割を占め、その中心は建設資材の商品販売で、建設工事の請負とは事業の性格が異なる。しかし閉じた分類に建設資材・建材の区分が無いため、工事を含む最も近い construction を暫定値とした。
