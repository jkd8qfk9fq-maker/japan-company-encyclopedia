# フェリシモ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社フェリシモ |
| 証券コード | 3396 |
| docID（データを取り出した文書） | `S100Y6XM` |
| 原本 docID | `S100Y6XM` |
| 提出日（原本） | 2026-05-27 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6XM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社フェリシモ / 3396 / docID S100Y6XM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
felissimo: 10 件の数値を有報XBRLと照合
有報: 株式会社フェリシモ 有価証券報告書－第61期(2025/03/01－2026/02/28) (docID S100Y6XM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
felissimo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…前期に確立した収益基盤を土台に「増収増益の常態化」を実現する重要な実行年と位…）

## エージェントの判断記録（fragment warnings）

- businessModel: 2027年2月期の連結業績見通し（売上高30,265百万円など）は将来の計画数値のため本文・戦略には記載していません。
- businessModel: 営業利益・経常利益の金額と増減率、特別損失の金額は本文の財務数値の対象外のため記載していません。
- businessModel: Wikipedia「フェリシモ」を確認しましたが、使える補足（1965年創業・主な取扱商品）は有報の記載と重なるため出典としては使用していません。
- businessModel: 決算期末後の重要な後発事象は連結・個別とも「該当事項はありません」。提出後の予定事項はありません。
- businessStructure: 報告セグメントは通信販売事業の単一セグメントのため、【事業の内容】の取扱品目を children とし、金額は経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析の販売実績（品目別・百万円印字）の印字を用いました。3品目の合計29,179百万円は連結売上高と一致します。
- businessStructure: 連結子会社は株式会社hope for（ベンチャービジネスへの投資、支援事業）の1社です。同社の資本金は資本金の金額のため記載していません。
- businessStructure: suppliers は本ツリーのスキーマに無いため省略しました。個別の仕入先の開示は有報にありません。
- history: 海外子会社の設立・解散（上海・北京・香港・ニューヨーク・パリ）、本店移転の細目、株式会社Ｗの設立と株式譲渡、haco!事業の吸収分割と株式会社cd.の吸収合併などの細目は、主要な流れに絞るため一部を省略しここに記録します。
- history: 沿革には資本金の金額を含めていません。
- industry: 通信販売事業の単一セグメントであり、閉じた分類の retail（小売）が直接当てはまるため暫定値や分類不足の申告は不要と判断しました。
- relatedCompanies: 候補6件はいずれも一般語の一致で、相手についての取引・提携・資本関係の記述は有報にありません: career（キャリア＝人材の属性やキャリア採用の語）、en（曖昧な一致）、lec（フレックスタイム制の部分一致）、path（エスパスフェリシモの部分一致）、port（神戸ポートタワーの部分一致）、corona（新型コロナウイルスの部分一致）。
- relatedCompanies: 大株主の株式会社目神山事務所（11.27％、2026年2月28日現在）は未上場で候補に無く、一般財団法人フェリシモ財団（8.42％）やフェリシモ共創会（5.36％）も上場事業会社ではないため結んでいません。その他の大株主は個人です。
- relatedCompanies: 特定投資株式及びみなし保有株式は「該当事項はありません」で、政策保有株式の開示はありません。
- relatedCompanies: 連結子会社の株式会社hope forと持分法適用関連会社の株式会社Antennaはいずれも未上場で候補に無く、自社グループの会社であるため関連企業には含めていません。関係は事業の内容と関係会社の状況の記載どおりです。
- terms: 助言のみの工程のため data は空です。「フェリシモ定期便」（毎月1回商品を届ける当社独自の継続購入の仕組み）が用語候補として考えられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
