# ウイン・パートナーズ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ウイン・パートナーズ株式会社 |
| 証券コード | 3183 |
| docID（データを取り出した文書） | `S100YEHT` |
| 原本 docID | `S100YEHT` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEHT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ウイン・パートナーズ株式会社 / 3183 / docID S100YEHT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
win-partners: 10 件の数値を有報XBRLと照合
有報: ウイン・パートナーズ株式会社 有価証券報告書－第13期(2025/04/01－2026/03/31) (docID S100YEHT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
win-partners: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 目標とする経営指標として掲げる自己資本利益率の目標値（中期的には15.0％以上、当連結会計年度は8.9％）は投資指標に当たるため perspectives には記載せず、ここに記録します。
- businessModel: 売上高と当期純利益の金額は、経営者による分析の本文に印字された千円単位の表記をそのまま記載しました。
- businessModel: 財務諸表の組替えや会計方針の変更の印字はなく、修正再表示チェックも全行一致のため financialNotes は空にしました。
- businessStructure: 単一セグメント（医療機器販売事業）のため、【事業の内容】の取扱商品の分類を children とし、経営者による分析に印字された分類別売上高の大きい順に並べました。分類別の金額は千円単位の表で印字されているため、各 children には金額を書かず、印字された構成比と前期比のみを記載しました。
- businessStructure: 連結子会社は株式会社ウイン・インターナショナル、テスコ株式会社、株式会社トーセイメディカル、株式会社トライテック、株式会社プラステンメディカルの5社で、いずれも医療機器販売事業です（【関係会社の状況】）。株式会社ウイン・インターナショナルとテスコ株式会社は特定子会社です。
- history: 沿革は有報の【沿革】の全行を転記しました。月は year に含めず description に記載しています。
- industry: 医療機器の卸売（専門商社）であり、閉じた分類に医療・ヘルスケアや卸売業の区分がないため、専門商社の事業に最も近い trading を暫定としました。
- relatedCompanies: レオクラン以外の候補は次の理由で結びませんでした。
- relatedCompanies: ベース： 「連結ベース」の部分一致で、ベース株式会社との関係の印字はありません。
- relatedCompanies: キャリア： 人材育成の記述に現れる一般語「キャリア」の一致で、株式会社キャリアとの関係の印字はありません。
- relatedCompanies: トーセイ： 連結子会社「株式会社トーセイメディカル」の部分一致で、トーセイ株式会社とは別法人であり、関係の印字はありません。
- relatedCompanies: イノベーション： 「イノベーションの原動力」という一般語の一致で、株式会社イノベーションとの関係の印字はありません。
- relatedCompanies: レック： 従業員関連の表中の部分一致（一般語）で、レック株式会社との関係の印字はありません。
- relatedCompanies: ポート： 復職サポート等の記述の部分一致（一般語）で、ポート株式会社との関係の印字はありません。
- relatedCompanies: セキ： ambiguous の部分一致（情報セキュリティ等）で、セキ株式会社との関係の印字はありません。
- relatedCompanies: トラスト： 日本マスタートラスト信託銀行（信託口）の部分一致で純投資の信託口であり、株式会社トラストはコードリスト外でもあるため結びません。
- relatedCompanies: ビジョン： 「企業ビジョン」という一般語の一致で、株式会社ビジョンとの関係の印字はありません。
- relatedCompanies: グリーンホスピタルサプライ株式会社は【大株主の状況】に載る事業会社（2026年3月31日現在5.82％）ですが、related-candidates.json に含まれていないため結ばず、ここに記録します。
- relatedCompanies: 主要な販売先である株式会社エフエスユニマネジメントとエム・シー・ヘルスケア株式会社は related-candidates.json に含まれていないため結ばず、役割は industryPosition に記載しました。
- relatedCompanies: レオクランの株式については、有報に今後の売却を予定している旨（時期は未定）の記載があります。期末時点で保有が継続しているため結び、売却予定の事実をここに記録します。資本政策上の事項として warnings にとどめます。
- terms: 用語候補： 低侵襲医療（身体への負担が少ない治療の総称で、同社の事業の中核概念）、薬剤溶出型ステント（DES。虚血性心疾患の治療に使う主要製品）、PTCAバルーンカテーテル（虚血性心疾患関連の主力商品）、血管内超音波（IVUS）診断カテーテル、経カテーテル的大動脈弁留置術（TAVI）——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ウイン・パートナーズの主たる業界（医療機器販売事業） → 提案: ヘルスケア・医療機器。医療機器の販売を専門とする卸売業であり、閉じた分類に医療・ヘルスケアや卸売業に当たる値がありません。売上は医療機器販売事業の単一セグメントです。
