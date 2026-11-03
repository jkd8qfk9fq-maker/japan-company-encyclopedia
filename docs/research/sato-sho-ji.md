# 佐藤商事 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 佐藤商事株式会社 |
| 証券コード | 8065 |
| docID（データを取り出した文書） | `S100YFE8` |
| 原本 docID | `S100YFE8` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFE8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 佐藤商事株式会社 / 8065 / docID S100YFE8（id は英語表記「SATO SHO-JI CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sato-sho-ji: 10 件の数値を有報XBRLと照合
有報: 佐藤商事株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YFE8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第102期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
sato-sho-ji: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益は MD&A の印字（2,921億9千1百万円・65億6千8百万円、前期比2.7％増・9.2％増）をそのまま使った。営業利益・経常利益・セグメント利益は書いていない。
- businessModel: 最上位の description は data 直下、businessModel.description は businessModel の中に置いた。perspectives（戦略・強み）は書ける根拠を絞り込まなかったため省き、空にした。
- businessModel: 訂正有価証券報告書は第102期（前期）のもので、今回の有報（訂正なし）の修正再表示チェックでは差異なし。財務の変則事項はないため financialNotes は書かない。
- businessStructure: docID S100YFE8（第103期、提出2026-06-19）。DEI の訂正フラグは false。決算期は2026年3月期（12か月、連結、Japan GAAP）。
- businessStructure: 並び順は【セグメント情報】の2026年3月期「外部顧客への売上高」の大きい順：鉄鋼 → 電子 → 非鉄金属 → ライフ営業 → 機械・工具 → 営業開発。【事業の内容】の列挙順（鉄鋼・非鉄金属・電子…）とは違う。6つとも報告セグメントで、「報告セグメントに含まれない」区分はない。
- businessStructure: セグメント別の金額は書かず、MD&Aの販売実績に印字された前期比（増減率）だけを使った。セグメント利益・営業利益は方針により本文に書いていない。
- businessStructure: listings：表紙は「東京証券取引所プライム市場」。沿革の2022年4月のプライム市場移行と矛盾しない。
- businessStructure: 【事業の内容】末尾の事業系統図は図で、確認していない。図に頼った記述はしていない。
- businessStructure: relatedCompanies 工程で、子会社名を事業の説明に書くことはしていない（関連企業の選定は別工程）。
- history: 【沿革】の表は2016年2月以降で年月と事象が分かれて印字されている。年月は18個（2016年2月〜2026年3月）、事象も18個で数が一致したため、行順で対応づけた。プライム市場への移行が2022年4月に当たることなど、他の節と矛盾しない。
- history: 対応づけた行のうち使ったのは、2019年5月（冨士自動車興業の設立）、2022年1月（阪神特殊鋼）、2022年4月、2022年6月、2024年4月・6月・8月・10月、2025年8月の分。ほかの行（インド、中国、台湾の子会社など）は省いた。
- history: 2012年は、5月（YUASA SATO）と7月（PT.SATO-SHOJI INDONESIA）の2件を1つにまとめた。2010年も同様に複数の事象をまとめた。
- industry: 売上の大半は鉄鋼事業・非鉄金属事業・電子事業など、材料や部材を仕入れて販売する報告セグメント。商社（trading）を主とした。
- industry: 電子事業は半導体・液晶・HDD向け部材の輸出に MD&A で触れるが、報告セグメントとして開示されているのはプリント配線基板用積層板などの電子材料の販売で、半導体向けとして独立した開示はないため semiconductors は付けなかった。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業との同一性を確かめられる候補が無いため、関連企業は結ばなかった。
- relatedCompanies: 【関係会社の状況】の連結子会社（日本洋食器、メタルアクト、佐藤ケミグラス、大東鋼業、冨士自動車興業、阪神特殊鋼、エヌケーテック新潟、海外子会社）と持分法適用関連会社（井上マテリアル、YUASA SATO（Thailand））は、いずれも上場企業として確認できる情報が無い。
- relatedCompanies: 大株主の状況に載る事業会社は、候補ファイルが無く同一性を確認できないため結ばなかった。
- terms: 用語の候補（助言のみ）：コイルセンター（巻いた鋼板を切断・加工して出荷する拠点）、ダイカスト（金属を型に流し込んで部品をつくる方法）、プリント配線基板用積層板、専門商社。既存の用語集に同じ語があるかは確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
