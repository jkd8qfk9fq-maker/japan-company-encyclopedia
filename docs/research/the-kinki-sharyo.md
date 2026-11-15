# 近畿車輛 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 近畿車輛株式会社 |
| 証券コード | 7122 |
| docID（データを取り出した文書） | `S100YI50` |
| 原本 docID | `S100YI50` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI50.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 近畿車輛株式会社 / 7122 / docID S100YI50（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-kinki-sharyo: 10 件の数値を有報XBRLと照合
有報: 近畿車輛株式会社 有価証券報告書－第114期(2025/04/01－2026/03/31) (docID S100YI50)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
the-kinki-sharyo: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、有報の百万円印字（主要な経営指標等・セグメント情報・関連情報）をそのまま転記した。MD&Aの億円表記（売上高371億円など）は転記していない。セグメント利益の金額や増減は書いていない。
- businessModel: 前期有報との修正再表示チェックでは、売上高・純利益・総資産・純資産・従業員数のいずれにも差異がなかった。証拠パックが注意を促す財務諸表の組替えについては、抽出されたセクション内では具体的な組替えの説明を確認できなかったため、financialNotesには入れていない。
- businessModel: 重要な後発事象は、連結・個別ともに該当事項なしと印字されている。
- businessModel: businessModelにsuppliersは設けていない。車両製造に関わる補助業務は子会社の株式会社ケーエステクノスへの委託であり、その体制はbusinessStructureの子要素に記録した。
- businessModel: 2026年3月期は政策保有株式の縮減のため投資有価証券の一部を売却したことがMD&Aに印字されているが、金額の内訳は本文の財務数値の範囲外のため転記していない。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順とした（鉄道車両関連事業36,252百万円、不動産賃貸事業847百万円）。MD&Aのセグメント別売上高も同じ外部売上高であるため、金額はセグメント情報の百万円印字によった。
- businessStructure: 連結子会社は【関係会社の状況】に印字された2社（KINKISHARYO International, L.L.C.、KI-PISCATAWAY LLC）を子要素とし、【事業の内容】に子会社として印字された株式会社ケーエステクノス、KINKISHARYO INTERNATIONAL CANADA INC.、RAIL TRANSIT CONSULTANTS, INC.も子要素とした。子会社の資本金の額は転記していない。
- businessStructure: KI-PISCATAWAY LLCは2025年11月に設立され、2026年3月31日現在の連結子会社として体制に反映済みのため、needsReviewには入れていない。
- history: 沿革は有報の印字どおり年単位で記載し、月は行に含めていない。主な節目を選んで記載した。創設・改組時の出資金や資本金の額は転記していない。
- history: 本社移転や子会社の設立・統合のうち、事業体制の節目となるものだけを選んだ。
- industry: 主たる業界は machinery とした。売上の大半を占める鉄道車両関連事業は鉄道車両を製造する事業であり、閉じた集合の既存値で表せるため taxonomy gap は記録していない。不動産賃貸事業は売上のごく一部であり、業界は足していない。
- relatedCompanies: 近畿日本鉄道株式会社：【関係会社の状況】でその他の関係会社（議決権の被所有割合30.4％）とされ、2026年3月期の主要な顧客として鉄道車両などを販売しているが、同社は上場会社ではなく関連企業候補一覧にも含まれていないため結んでいない。販売と資本関係の事実はここに記録する。同社の議決権割合の一部は退職給付信託口を通じたものであり、信託口の名義である日本マスタートラスト信託銀行株式会社（退職給付信託口）は関連企業として結んでいない。
- relatedCompanies: 東海旅客鉄道株式会社、東日本旅客鉄道株式会社、三菱商事株式会社、住友商事株式会社、伊藤忠商事株式会社：特定投資株式の保有目的はいずれも「受注実績がある取引先との信頼関係を維持、強化している」という全銘柄共通の定型句のみであり、それだけでは結んでいない。
- relatedCompanies: 株式会社三菱UFJフィナンシャル・グループ：特定投資株式の保有目的は金融取引基盤の安定であり、資金調達・金融取引が理由のため結んでいない。
- relatedCompanies: 連結子会社2社（KINKISHARYO International, L.L.C.、KI-PISCATAWAY LLC）などの子会社は自社グループの会社のため、関連企業として結んでいない。
- relatedCompanies: その他の候補（エン、ゼロ、コア、トラスト、フリー、リコー）は、本文の一般語（エンジニアリング、CO2排出ゼロ、エンゲージメント、信託、バリアフリー、リコール）との一致であり、当社との関係を述べる印字がないため結んでいない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
