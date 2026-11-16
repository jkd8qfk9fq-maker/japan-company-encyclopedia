# 光・彩 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社光・彩 |
| 証券コード | 7878 |
| docID（データを取り出した文書） | `S100Y03W` |
| 原本 docID | `S100Y03W` |
| 提出日（原本） | 2026-04-22 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y03W.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社光・彩 / 7878 / docID S100Y03W（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kohsai: 10 件の数値を有報XBRLと照合
有報: 株式会社光・彩 有価証券報告書－第59期(2025/02/01－2026/01/31) (docID S100Y03W)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第58期(2024/02/01－2025/01/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
kohsai: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社　光・彩」が EDINET の提出者名「株式会社光・彩」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の窓にある訂正有価証券報告書（第58期）は、前期有報との照合で売上高・当期純利益・総資産・純資産・従業員数の全系列に差異がなかったため、主要な経営指標等への影響はないものとしてwarningsのみとした。
- businessModel: 目標とする経営指標（自己資本当期純利益率及び総資産経常利益率の向上）は投資指標であるため、本文・戦略には記載せず存在のみ記録した。
- businessModel: MD&Aの利益項目の金額・理由は本文に記載していない。生産実績・受注状況の金額も記載していない（受注高の記載禁止ルールによる）。
- businessModel: 地域別の売上高は日本3,649百万円・その他592百万円であり、千円単位の内訳合計は印字された合計額と1千円の差異があるため、品目別の内訳（ジュエリー1,156百万円・ジュエリーパーツ3,038百万円・商品47百万円、合計は印字合計と一致）を本文に用いた。
- businessStructure: suppliersキーは旧スキーマのため省略した。主要な原材料は金・プラチナ・宝石等であり、貴金属材料の伸線・圧延加工は内製化されている旨を事業の説明に含めた。
- businessStructure: 親会社の株式会社エスティオは健康食品の販売を主たる事業とする別法人であり、当社の事業には含めていない（関係はrelatedCompaniesのwarningsに記録）。
- businessStructure: 主要な顧客である鍛造指輪株式会社は非上場で関連企業候補に含まれていないため、customersには名称のみを金額なしで記載した。
- history: 沿革のうち、1988年の6階建工場建設・本社機能の一部移管と1990年の本社移転は拠点の移転・整備に関する事項として採用せず、ここに記録した。
- industry: 主たる業界は、宝飾品の製造加工販売を主事業とするため、掲載済みの宝飾品会社（クロスフォー等）の慣例に揃えてretailを主分類とし、宝飾品を表す区分がないことをtaxonomyGapsに記録した。副次分類は付けていない。
- relatedCompanies: 株式会社エスティオ（親会社）：当社の議決権の54.45％を保有する親会社であるが、非上場で関連企業候補に含まれていないため結んでいない。同社は健康食品の販売を主たる事業としている。
- relatedCompanies: 鍛造指輪株式会社：主要な顧客ごとの情報に売上高の10％以上を占める主要な顧客として印字されているが、非上場で関連企業候補に含まれていないため結んでいない。
- relatedCompanies: nagahori（株式会社ナガホリ）：特定投資株式の保有目的が全銘柄同一の定型文（「取引先との円滑な取引関係維持のため」）であるため結んでいない。大株主の状況にも名称があるが、個別の取引関係の記載はない。
- relatedCompanies: yondoshi-holdings（ヨンドシーホールディングス）：特定投資株式の保有目的が全銘柄同一の定型文（「取引先との円滑な取引関係維持のため」）であるため結んでいない。
- relatedCompanies: estelle-holdings（エステールホールディングス）：受取手形の相手先別内訳に名称があるのみで、個別の取引関係の記載がないため結んでいない。
- relatedCompanies: the-yamanashi-chuo-bank（山梨中央銀行）：借入金の相手先である金融機関のため結んでいない。
- relatedCompanies: suzuki-6785：役員の個人名の部分一致のため結んでいない。
- relatedCompanies: base-4481：「時価ベース」の部分一致のため結んでいない。
- relatedCompanies: land：「ブランド」の部分一致のため結んでいない。
- relatedCompanies: vision：自社のビジョン文における一般語の記載のみのため結んでいない。
- relatedCompanies: corona：事業等のリスクにおける感染症の記載のみのため結んでいない。
- relatedCompanies: rhythm：事業等のリスクにおける一般語の部分一致のため結んでいない。
- terms: 助言: 用語「鍛造」は、金属を叩いて成形する加工技術で、同社は鍛造技術に特化したブライダル商品を手がけています。本文では有報の表記のまま用いています。
- terms: 助言: 用語「クラスプ」は、ネックレスやブレスレット等の留め具のことで、同社のジュエリーパーツ事業の半製品の一つです。本文では有報の表記のまま用いています。

## 要確認（status に反映）

- businessModel: 2023年11月１日付で普通株式１株につき２株の割合で株式分割を行っています（主要な経営指標等の注記に記載）。
- businessModel: 2024年11月１日付で普通株式１株につき２株の割合で株式分割を行っています（主要な経営指標等の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 光・彩の主たる業界（宝飾品の製造加工販売） → 提案: jewelry（宝飾品）。主事業は、金・プラチナ・宝石等を主要な原材料とした貴金属装身具の製造加工販売であり、2026年1月期の売上高は4,241百万円です。閉じた分類の19種に宝飾品を表す区分がなく、掲載済みの宝飾品会社の慣例に揃えて、自社製品を最終消費者に届ける製造販売業として最も近い retail を暫定としました。
