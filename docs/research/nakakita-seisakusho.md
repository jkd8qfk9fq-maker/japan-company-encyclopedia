# 中北製作所 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社中北製作所 |
| 証券コード | 6496 |
| docID（データを取り出した文書） | `S100YYFP` |
| 原本 docID | `S100YYFP` |
| 提出日（原本） | 2026-08-26 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYFP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社中北製作所 / 6496 / docID S100YYFP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nakakita-seisakusho: 4 件の数値を有報XBRLと照合
有報: 株式会社中北製作所 有価証券報告書－第100期(2025/06/01－2026/05/31) (docID S100YYFP)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-05-31","previousFiling":1450099000,"latestFiling":1448065000}]
利益・総資産・純資産・従業員数: 8 件を照合
すべて一致しました。
nakakita-seisakusho: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は千円印字を百万円に切り捨てて表記した（売上高29,254,158千円→29,254百万円、品種別も同様）。切り捨て後の品種別合計は印字の合計と1百万円異なる。
- businessModel: 当社は第99期（2025年5月期）から連結財務諸表を作成しているため、経営指標等の推移は2期分のみが印字されている。
- businessModel: 受注高32,063百万円・受注残高27,443百万円は本文の財務数値に含めていない（経営者による分析に記録のみ）。
- businessModel: 売上高以外の利益の金額や増減の理由（営業利益・経常利益・税金等調整前当期純利益など）は本文に書いていない。
- businessModel: 目標とする経営指標として掲げられた売上高営業利益率の向上や、当期の業績目標の数値は、投資・利益指標のため本文・戦略に書いていない。
- businessModel: suppliers キーはこのツリーのスキーマに無いため省略した。仕入先の事実は、資材等の仕入先である株式会社PILLAR（特定投資株式85,500株）の保有が株式の保有状況に印字されていることのみで、関連企業候補に含まれていなかったため関連企業にも結んでいない。
- businessModel: 生産実績・販売実績の金額は本文に使っていない（販売実績の品種別金額はセグメント情報の外部売上高と一致）。
- businessModel: 中北(無錫)工業科技有限公司は2024年11月に設立された非連結子会社である。
- businessStructure: 単一セグメントのため、品種区分は【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）を children とし、外部売上高の大きい順（バタフライ弁・自動調節弁・遠隔操作装置）に並べた。事業の内容の販売構成比の順ではない。
- businessStructure: 品種別の金額は千円印字を百万円に切り捨てた値（13,574,197千円→13,574百万円など）。切り捨て後の3品種の合計29,253百万円は、印字の合計29,254百万円と1百万円異なる（切り捨てによる差異）。
- businessStructure: 非連結子会社3社のうち名称が確認できるのは中北(無錫)工業科技有限公司のみで、他の2社は本文で個別に確認できないため本文に社名を書いていない。
- businessStructure: 協力工場（協力企業）からの製品仕入れは事業の内容に記載があるが、個別の仕入先名は開示されていない。
- history: 1939年6月の大阪市城東区蒲生町への移転、1972年12月の本社組織の大東市への移転、1994年9月のISO9001認証取得は、主要な事業の転機ではないため沿革から省いた。
- history: 資本金の金額は沿革に印字されていない。創業・設立の金額には触れていない。
- history: 1960年の工場建設開始と1970年の完成は1行にまとめた。
- industry: バルブ（自動調節弁・バタフライ弁）や遠隔操作装置の製造・販売が唯一の事業であり、閉じた分類の machinery（機械）が主たる業界に当たる。合わない値はないため taxonomyGaps は無い。
- relatedCompanies: 株式会社PILLARは、株式の保有状況で「当社製品等の製造に係る資材等の仕入先」と明記された特定投資株式（85,500株）だが、関連企業候補（related-candidates.json）に含まれていないため結んでいない。事実はここに記録する。
- relatedCompanies: 住友重機械工業株式会社は「当社製品等の販売先」の特定投資株式（4,320株）だが、関連企業候補に含まれていないため結んでいない。
- relatedCompanies: 株式会社三井住友フィナンシャルグループ、株式会社三菱ＵＦＪフィナンシャル・グループ、株式会社りそなホールディングス、三井住友トラストグループ株式会社は、いずれも「主要な取引金融機関」としての保有であり資金調達の関係のため結んでいない。
- relatedCompanies: 株式会社第一ライフグループは保険契約等の取引先としての保有（400株）であり、保険取引の関係のため結んでいない。
- relatedCompanies: 三精テクノロジーズ株式会社、コクヨ株式会社、サノヤスホールディングス株式会社は「地元企業として地域及び経営情報収集の為」の保有で、具体的な取引の役割が印字されていないため結んでいない。なおコクヨの株式数の増加は同社自身の株式分割（1株につき4株）によるもので、当社の分割ではない。
- relatedCompanies: 一般語・部分一致の候補は結んでいない： career（キャリアアップの文言）、core（脱炭素の文言）、en（非連結子会社NSエンジニアリングの名称の一部）、land（ブランドの文言）、port（環境経営レポートの文言）、cota（インコタームズの文言）、seki（情報セキュリティの文言）、base-4481（支給実績をベースにの文言）、frontier（フロンティア・スピリットの文言）。
- relatedCompanies: 連結子会社2社と非連結子会社3社は自社グループのため関連企業に含めていない。協力工場（協力企業）の個別名は開示されていない。
- terms: 用語の助言のみ：自動調節弁、バタフライ弁、遠隔操作装置、流体制御は、この会社の事業を説明する中核の語として各成果物で一貫して使った。既存の用語IDとの対応は機械側の照合に委ねる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
