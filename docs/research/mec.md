# メック — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | メック株式会社 |
| 証券コード | 4971 |
| docID（データを取り出した文書） | `S100XRJV` |
| 原本 docID | `S100XRJV` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRJV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | メック株式会社 / 4971 / docID S100XRJV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mec: 10 件の数値を有報XBRLと照合
有報: メック株式会社 有価証券報告書－第57期(2025/01/01－2025/12/31) (docID S100XRJV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
mec: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の換算方法: 本文の金額は有報の千円印字を百万円未満切り捨てで記載した。地域別セグメントの切り捨て後の合計は20,946百万円で、印字の合計20,947百万円と1百万円異なる（切り捨てによる差異）。合計は印字どおり20,947百万円を引用した。
- businessModel: 報告セグメントの名称変更（「香港（香港、珠海）」→「珠海（中国）」、「中国（蘇州）」→「蘇州（中国）」）は名称のみの変更で、セグメント情報への影響はない旨が印字されているため、needsReview ではなく warnings とした。
- businessModel: 目標とする経営指標（連結ROEの中期目標、連結配当性向の基本方針など）は投資指標のため、本文・strategy には書かず、ここに記録するにとどめた。
- businessModel: 当期純利益の増加要因としてMD&Aに挙がる特別利益（省力化等の大規模成長投資補助金の収入）や前期の税金計上の影響は、本文には書いていない。
- businessModel: suppliers は本ツリーのスキーマに無いため省略した。なお有報に個別の仕入先名の開示はない。
- businessModel: MD&Aのセグメント別数値は内部売上高を含む箇所があるため使わず、セグメント注記の外部顧客への売上高を用いた。セグメント利益は本文に書いていない。
- businessStructure: 報告セグメントは地域別（生産・販売体制）であり、事業区分は単一（電子基板・電子部品資材事業）のため、businesses は1事業とし、地域別セグメントの外部売上高を説明文に売上順で記載した。
- businessStructure: 当連結会計年度より報告セグメントの名称を変更（「香港（香港、珠海）」→「珠海（中国）」、「中国（蘇州）」→「蘇州（中国）」）。名称変更のみでセグメント情報への影響はない旨が印字されており、前期分も変更後の名称で記載されているため、warnings のみとした。
- businessStructure: 金額はセグメント注記の千円印字を百万円未満切り捨てで記載した（切り捨ての内訳合計と印字合計との差異は businessModel の warnings に記録）。
- history: 沿革のうち、工場・営業所の移転や新設、出展、個別製品の発売などの細目は割愛した（1971年工場移転、1975年東京営業所設置・住友スリーエムとの販売代理店契約、1981年本社・工場建設、1985年西宮工場、1989年研究所併設、1990年台湾支店開設、1993年長岡工場、1996年香港子会社設立、1997年米国子会社設立、2007年・2008年の海外子会社移転、2009年ヘラクレス上場廃止・米国子会社清算、2016年本社・尼崎事業所建設、2020年東初島研究所再稼働、2023年東初島事業所への改称など）。
- history: 設立時の資本金は沿革に金額を書かない規則のため記載していない。
- industry: 主たる事業は金属表面処理剤（化学品）の製造販売のため chemicals を主とした。半導体パッケージ基板向けの薬品を事業として開示しているため、semiconductors を2つ目に付けた。
- relatedCompanies: ibiden（イビデン）: 特定投資株式119,693株を保有するが、保有目的は他銘柄と同一の定型文（「当社薬品等の取引があり、同社とのさらなる取引拡大、同社との良好な関係維持、強化を図るため」）のみで、個別の取引内容の印字がないため結ばなかった。
- relatedCompanies: taiyo-holdings（太陽ホールディングス）: 特定投資株式121,200株を保有するが、保有目的は他銘柄と同一の定型文のみのため結ばなかった。なお、同社が2025年12月1日付で行った株式分割は保有先の分割であり、メック自身の株式分割ではない。
- relatedCompanies: kyosha（京写）: 特定投資株式162,000株を保有するが、保有目的は他銘柄と同一の定型文のみのため結ばなかった（候補抽出でも ambiguous 扱い）。
- relatedCompanies: toppan-holdings（TOPPANホールディングス）: 特定投資株式9,702株を保有するが、保有目的は他銘柄と同一の定型文のみのため結ばなかった。
- relatedCompanies: 株式会社メイコー: 特定投資株式10,000株を保有し、保有目的は他銘柄と同一の定型文。related-candidates.json に含まれないため結べず、事実のみ記録する。
- relatedCompanies: vision、base-4481、ray、career、en、zero、seki、cota、port、core、kohsoku、land、rent: いずれも一般語・部分文字列の一致のみで、当該会社への言及はないため結ばなかった。
- relatedCompanies: trust: 有報の「日本マスタートラスト信託銀行（信託口）」は信託口の名義であり、候補の株式会社トラストとは別人格のため結ばなかった。
- terms: 用語候補（助言のみ）: 密着向上剤、エッチング剤、CZシリーズ、半導体パッケージ基板、COF基板。

## 要確認（status に反映）

- businessModel: 連結子会社のMEC(HONG KONG)LTD.は、2024年10月22日開催の取締役会で解散が決議され、2025年12月末日現在、現地の法令に従い清算手続きが進められています。残余財産の分配により重要性が低下したため、当連結会計年度末より連結の範囲から除外されました。本登録は2025年12月31日現在の体制（連結子会社6社）に基づいています。
- businessStructure: 連結子会社のMEC(HONG KONG)LTD.は、2024年10月22日開催の取締役会で解散が決議され、2025年12月末日現在、現地の法令に従い清算手続きが進められています。残余財産の分配により重要性が低下したため、当連結会計年度末より連結の範囲から除外されました。本登録は2025年12月31日現在の体制（連結子会社6社）に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
