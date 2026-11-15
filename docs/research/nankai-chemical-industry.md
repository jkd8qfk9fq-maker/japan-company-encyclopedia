# 南海化学 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 南海化学株式会社 |
| 証券コード | 4040 |
| docID（データを取り出した文書） | `S100YI8M` |
| 原本 docID | `S100YI8M` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI8M.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 南海化学株式会社 / 4040 / docID S100YI8M（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nankai-chemical-industry: 10 件の数値を有報XBRLと照合
有報: 南海化学株式会社 有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YI8M)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nankai-chemical-industry: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円印字のとおり表記した。2026年3月期の純利益が前期比173.5％増となった主因は、連結子会社であった富士アミドケミカル株式会社の不動産譲渡に伴う土地売却益の計上であり、その内訳は本文には書かず本警告に記録した。
- businessModel: 経常利益1,760百万円の印字はあるが、本文の財務数値は売上高と親会社株主に帰属する当期純利益のみとした。生産実績・受注実績の金額も本文には書いていない。
- businessModel: 本ツリーのスキーマに suppliers キーがないため businessModel に suppliers は書かず、仕入関係の事実は関連企業の説明と警告に記録した。主要な仕入関係として個別の開示はない。
- businessModel: 自己株式の取得（当期の支出149百万円）などの資本政策は本文には書かず本警告に記録した。中期経営計画の数値目標は印字されていない。
- businessModel: Wikipedia「南海化学」が見つかったが、有報の記載を超える補足は使わなかった（数値は使用していない）。
- businessStructure: 報告セグメントは「化学品事業」と「各種塩事業」の2区分であり、並び順はセグメント情報の外部顧客への売上高の大きい順とした。化学品事業の内訳である基礎化学品・機能化学品・アグリ・環境リサイクルは売上高が区分して開示されていないため、childrenとして金額なしで記載した。
- businessStructure: セグメント情報の外部顧客への売上高は化学品事業16,979百万円、各種塩事業4,083百万円で、単純合計は21,062百万円となり、印字の合計21,063百万円と1百万円異なる（有報の丸め）。金額は印字どおり引用した。
- businessStructure: 連結子会社3社（株式会社エヌエムソルト、如皋市四友合成化工有限公司、如皋南海水処理剤有限公司）と持分法適用関連会社2社（サンワ南海リサイクル株式会社、ATNグラファイト・テクノロジー株式会社）はすべて非上場で関連企業候補にないため、関連企業としては結ばず事業の説明に記載した。各社の資本金額は記載していない。
- businessStructure: エヌシー環境株式会社は2025年4月1日付で当社を存続会社とする吸収合併により消滅し、富士アミドケミカル株式会社は2025年12月24日付で清算結了した。いずれも期中に完了し期末の体制に反映されているため、沿革と本警告に記録し、needsReviewにはしなかった。
- history: 沿革の各行は年月と事象文が対応する通常の表形式で印字されており、行順どおりに採用した。子会社等の設立・合併に伴う資本金額は記載していない。
- history: 1907年のさらし粉製造開始、1911年の硫酸製造開始、1918年の土佐工場前身設立・苛性ソーダ製造開始・小雑賀工場竣工など初期の工場沿革は、主要な節目として上記の創業・上場・分離等を優先し省略した。
- industry: 主たる業界は売上高の約8割を占める化学品事業から chemicals とした。各種塩事業も化学品グループ内の事業であり、独立した業界値は付けていない。
- relatedCompanies: nakayama-steel-works（中山製鋼所）: 1939年に合併し1951年に分離した旧親会社で、2013年2月のMBOにより資本関係は消滅している。現在の取引・資本関係の印字がないため結ばず、沿革に記録した。
- relatedCompanies: the-shikoku-bank（四国銀行）: 当社が568株を保有するが、資金調達取引等の安定的な銀行取引が保有目的であり、資金調達が理由のため結ばなかった。
- relatedCompanies: base-4481・slogan・seki・zero・cover・imura-and-co・king・port: 社名の語句が本文の一般語（営業利益ベース、スローガン、情報セキュリティ、実質ゼロ、カバー、等）と一致しただけで、当該会社についての取引・提携・資本関係の記述はないため結ばなかった。nissin はコードリストになく、語句一致のみのため結ばなかった。
- relatedCompanies: 大株主のうち株式会社日本カストディ銀行（信託口）、野村信託銀行株式会社（投信口）は信託・資産管理であり、南海化学従業員持株会、大中物産株式会社、不動恒産株式会社、根岸運送株式会社、尼崎製罐株式会社、協和商事株式会社は関連企業候補にないため結ばなかった。
- relatedCompanies: 特定投資株式の貸借対照表計上額は説明文に書いていない（株式数と持株比率のみ記載）。
- relatedCompanies: シライ電子工業株式会社の販売先である京都支店は2026年3月に閉鎖されているが、保有目的の印字は当事業年度のものであるため、説明は印字どおりとした。
- terms: 助言のみの工程のため data は空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
