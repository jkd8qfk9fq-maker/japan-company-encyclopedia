# 日本触媒 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社日本触媒 |
| 証券コード | 4114 |
| docID（データを取り出した文書） | `S100YBP7` |
| 原本 docID | `S100YBP7` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBP7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社日本触媒 / 4114 / docID S100YBP7（id は英語表記「NIPPON SHOKUBAI CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 1 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-shokubai: 10 件の数値を有報XBRLと照合
有報: 株式会社日本触媒 有価証券報告書－第114期(2025/04/01－2026/03/31) (docID S100YBP7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-shokubai: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙どおり2026年3月期。売上収益の10%以上を占める顧客グループが1グループあるが、名称は印字されていないため書かない。
- businessStructure: 報告セグメントは2つで、外部顧客への売上収益の大きい順にマテリアルズ、ソリューションズ。
- businessStructure: 日触物流㈱は全事業区分に携わるため、事業としては分けない。
- history: 沿革表のうち主な出来事を選んだ。1941年の設立日は表の注記どおり。
- industry: 有報が「化学品の製造販売」を主な内容と述べ、2つの報告セグメントとも化学品。半導体向けの金額は独立して開示されていないため半導体は付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる掲載済み企業の候補が無いため、結ばない。
- relatedCompanies: 住友化学: 2002年の事業交換は過去の1回限りの出来事で、保有株式は600,000株の政策保有の表に載るのみ。取引の向きの記載が無く結ばない。
- relatedCompanies: ENEOSホールディングス・日本ゼオンなど保有株式の表の相手: 取引・提携の記述が無く結ばない。
- relatedCompanies: 子会社・関連会社（日宝化学、東京ファインケミカルなど）: 候補ファイルに無く、掲載済みか確認できないため結ばない。
- terms: 用語の助言: 高吸水性樹脂（紙おむつなどに使われる、自重の何百倍もの水を吸う樹脂）、アクリル酸、酸化エチレン、プロセス触媒、持分法は、用語集に無ければ追加候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
