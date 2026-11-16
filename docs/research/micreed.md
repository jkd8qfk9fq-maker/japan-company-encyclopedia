# ミクリード — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ミクリード |
| 証券コード | 7687 |
| docID（データを取り出した文書） | `S100YC1L` |
| 原本 docID | `S100YC1L` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC1L.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ミクリード / 7687 / docID S100YC1L（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
micreed: 10 件の数値を有報XBRLと照合
有報: 株式会社ミクリード 有価証券報告書－第14期(2025/04/01－2026/03/31) (docID S100YC1L)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
micreed: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記１～９のうち、財務数値の表示方法や算定に関するもの（連結指標を記載していないこと、関連会社がないこと、損失年度の非開示理由、従業員数の定義、市場名称、株式分割に伴う遡及算定、配当の決議予定）は表示事項としてここに記録し、financialNotes には入れなかった。株式分割そのものは needsReview に記録した。
- businessModel: 経営方針で位置づけられる重要な経営指標（売上高、顧客店舗数、新規顧客店舗数、ＷＥＢ受注率など）の数値目標は有報に印字されておらず、本文・戦略にも転記していない。
- businessModel: ＭＤ＆Ａの数値（顧客店舗数14,196店、ＷＥＢ受注率81.8％など）は経営指標の実績であり、投資指標の目標ではないため分析の根拠としてのみ用い、金額としては売上高と当期純利益以外を本文に書いていない。
- businessStructure: 単一セグメントのため子事業は設けなかった。商品カテゴリー別の売上高は有報に印字されていない。
- businessStructure: 主な仕入先は国分グループ本社株式会社で、2026年３月期の仕入実績は総仕入実績の45.4％を占める（MD&Aの相手先別仕入実績）。同社は未上場で候補にないため関連企業には結んでいない。仕入先は約１千社のメーカーと有報に記載されている。
- businessStructure: 受注センターはバーチャレクス九州株式会社（佐賀県佐賀市）に、出荷センターは増田運輸株式会社（千葉県習志野市）に外部委託している。いずれも候補にないため関連企業には結んでいない。
- businessStructure: 旧スキーマのため suppliers キーは省略し、仕入先の事実はここに記録した。
- businessStructure: 本社（東京都新宿区）の従業員数は34人で、設備は本社機能のみである。
- history: 沿革は有報の表の記載どおりに年単位で整理した。資本金の額などの資本金額は記載していない。
- history: 2013年３月の事業承継・国分提携と同年11月のトーホー提携は、年単位の整理のため１つの項目にまとめた。
- industry: 主たる業界は trading とした。当社は業務用食材を中小飲食店へ販売する卸売・通信販売の事業形態であり、閉じた分類では卸売に最も近い trading が直接当てはまるためである（栄電子の先例）。
- industry: 当社は単一セグメント（業務用食材通販事業）であり、食品の製造や飲食店の運営は行っていないため food は付けなかった。
- relatedCompanies: 国分グループ本社株式会社は、2026年３月31日現在で発行済株式の18.04％を保有する大株主であり、2013年の事業提携先で、2026年３月期には総仕入実績の45.4％を占める最大の仕入先でもあるが、未上場で related-candidates.json の候補にないため結ばなかった。
- relatedCompanies: 株式会社ミスミグループ本社（misumi-group）は1995年のフード事業開始と2006年の子会社化の母体だが、2007年に全株式を譲渡して関係は終了しているため結ばず、沿革にのみ記載した。
- relatedCompanies: ＧＭＯペイメントゲートウェイ（gmo-payment-gateway）は売掛金の相手先別内訳に載る決済の相手先だが、有報に契約や提携の記述がないため結ばなかった。
- relatedCompanies: ヤマト運輸株式会社は売掛金の相手先だが、候補の株式会社ヤマト（yamato、1967）とは別の法人であり、ヤマト運輸は未上場のため結ばなかった。
- relatedCompanies: the-lead、corona、port、base-4481、seki、freee、king、land、nissin、rent、space、suzuki-6785 は一般語・部分一致の機械抽出であり、当社との取引・提携・資本関係の記述がないため結ばなかった。
- terms: 助言のみ（この断片では用語を登録しない）: 「バラ凍結」は【事業の内容】で、食材を一つずつバラバラな状態で凍結し、必要な分だけ取り出せる商品形態を指す当社の商品の特徴として使われているため、用語集への追加を提案する。

## 要確認（status に反映）

- businessModel: 2024年４月１日付で普通株式１株につき３株の割合で株式分割を行っています（主要な経営指標等の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
