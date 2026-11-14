# 日本食品化工 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本食品化工株式会社 |
| 証券コード | 2892 |
| docID（データを取り出した文書） | `S100YF39` |
| 原本 docID | `S100YF39` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF39.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本食品化工株式会社 / 2892 / docID S100YF39（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nihon-shokuhin-kako: 4 件の数値を有報XBRLと照合
有報: 日本食品化工株式会社 有価証券報告書－第105期(2025/04/01－2026/03/31) (docID S100YF39)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
すべて一致しました。
nihon-shokuhin-kako: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画「中経2027」の目標指標の数値は、将来に関する事項であり、投資関連の用語も含むため、本文に転記していない。
- businessModel: 期中に行われた自己株式の消却と取得は資本政策に関する事項のため、本文ではなくここに記録する。
- businessModel: 富士工場の原料コーン浸漬液濃縮設備の新設計画（2026年12月完了予定）は、印字された設備計画のため、本文ではなくここに記録する。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項はありません」と印字されている。
- businessModel: Wikipediaの記事「日本食品化工」は三菱商事系列である旨など有報の記載と重なる内容のみで、有報にない補足がないため、出典に加えていない。
- businessStructure: 単一セグメント（とうもろこし等加工事業）のため、報告セグメントは1つとし、子区分にはセグメント関連情報の製品部門を用いた（各部門の外部顧客への売上高は関連情報の印字による）。
- businessStructure: 製品部門別の外部顧客への売上高の合計は62,992百万円で、印字の連結売上高62,993百万円と1百万円異なる。有報の印字どおりに転記した。
- history: 1948年の設立時の資本金の金額は、金額の転記を避けるため沿革に書いていない。
- history: 沿革表のうち年月セルが崩れた箇所（2010年6月・2012年7月の2つの年月と2つの事象、2016年10月・2020年4月の2つの年月と2つの事象）は、年月と事象の数が一致するため行順に対応づけた。このうち本店移転（2010年）と両本社体制への移行（2020年）を採用し、九州事業所の閉鎖・九州支店の開設と共同商事の解散は採用しなかった。
- history: 個別の営業所の開設・統合や、解散した子会社の設立などの細かな沿革は、選択のうえ省略した。
- industry: 主たる業界は food とした。とうもろこしを原料とする澱粉・糖化品は食品・飲料向けの素材が中核であり、連結売上高のほぼ全てを占めるためである。ファインケミカル部門は単一セグメント内の一部門で売上高も小さいため、chemicals は副次に付けなかった。三菱商事を通じた販売は代理店取引であり、自社の製造販売が事業の本体のため、trading は付けなかった。
- relatedCompanies: ヤクルト本社・亀田製菓・ヤマエグループホールディングスは、特定投資株式の保有目的が全銘柄に共通の定型文「取引先との関係の維持・強化を目的として保有」のみで、具体的な取引・提携の内容が有報に印字されていないため、結ばなかった。
- relatedCompanies: Asia Modified Starch Co., Ltd.（議決権49.0％）とミナト流通サービス（同20.0％）は当社の関連会社、日食サービス＆ファシリティーズは連結子会社であり、いずれも当社グループの会社であるため、関連企業としては結ばなかった。
- relatedCompanies: 三和澱粉工業と堀内運輸は大株主だが非上場で、関連企業候補に含まれていないため、結ばなかった。
- relatedCompanies: vision、career、port、innovation、king、lec、rent、base-food、land は一般語・部分一致による候補で、当社との取引・提携・資本関係の印字がないため、結ばなかった。trust は信託口の印字による候補で、コードリストにもないため、結ばなかった。
- terms: 助言: 用語「糖化品」は、でん粉を分解して作る糖質素材の総称で、清涼飲料や酒類、食品、調味料などに幅広く使われている。当社の最大の製品部門の名称である。
- terms: 助言: 用語「湿式法」は、とうもろこしを水に浸漬して成分ごとに分離・加工する方法で、当社が1948年に我が国で初めて事業化した製法である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
