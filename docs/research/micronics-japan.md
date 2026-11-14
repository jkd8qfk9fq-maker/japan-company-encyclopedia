# 日本マイクロニクス — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社日本マイクロニクス |
| 証券コード | 6871 |
| docID（データを取り出した文書） | `S100XTD8` |
| 原本 docID | `S100XTD8` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTD8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社日本マイクロニクス / 6871 / docID S100XTD8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
micronics-japan: 10 件の数値を有報XBRLと照合
有報: 株式会社日本マイクロニクス 有価証券報告書－第55期(2025/01/01－2025/12/31) (docID S100XTD8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第53期(2023/01/01－2023/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第52期(2022/01/01－2022/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第51期(2021/01/01－2021/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第50期(2019/10/01－2020/12/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
micronics-japan: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の窓に第50期〜第53期の訂正有価証券報告書があるが、当期有報の主要な経営指標等は前期有報の印字と全系列・全行で一致しており（修正再表示チェックで差異なし）、指標への影響は確認されなかったため warnings に留めた。登録は当期有報の数値に基づく。
- businessModel: 中期経営計画「FV26」の目標数値（売上高・営業利益額・営業利益率・ROE）は将来に関する事項および比率・対象外の利益額のため、本文には転記せず方針の要約のみとした。
- businessModel: セグメント利益・損失の金額は本文に書いていない（売上高と当期純利益のみ）。受注高・受注残高の金額も本文に書いていない。
- businessModel: MEK Co.,Ltd.の主要な損益情報等（単体数値）は本文に転記していない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。株式分割の印字はなく、needsReview は空とした。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（プローブカード事業68,525百万円、TE事業1,648百万円）とした。
- businessStructure: 連結子会社は7社（美科樂電子股份有限公司、邁嘉路微電子（上海）有限公司、MJC Electronics Corporation、MJC Europe GmbH、MEK Co.,Ltd.、昆山麦克芯微電子有限公司、MJC ELECTRONICS ASIA PTE.LTD.）で、その他1社を含めた構成は【事業の内容】の印字どおり。
- businessStructure: MEK Co.,Ltd.は単体売上高が連結売上高の10％を超える特定子会社だが、金額は本文に書かず事業の位置付けのみを記した。
- history: 沿革のうち、本社移転、工場の新設・増築（平賀工場、青森工場、大分・熊本テクノロジーラボラトリー等）、営業所の開設・統合、研究開発センターの開設は拠点の変遷として省いた。
- history: 中国・上海の旺傑芯微電子（上海）有限公司（2003年）や邁嘉路微電子（上海）有限公司（2005年）、MJC Europe GmbH（2007年）、MJC ELECTRONICS ASIA PTE.LTD.（2016年）などの子会社設立は、主要なもの（台湾・韓国・中国昆山）以外は省いた。
- history: KES・ISOの認証取得、J-Stock銘柄への選定、2013年の東証JASDAQ（スタンダード）上場、2017年の株式会社MJCテクノの吸収合併、2021年の監査等委員会設置会社への移行は、事業の転機ではないため省いた。
- history: 設立時の資本金など資本金額は沿革に書かない規則に従い記載していない（沿革の印字にも資本金額はない）。
- industry: 主たる事業は半導体製造の検査工程で使うプローブカードや半導体検査機器の製造・販売であり、半導体向けの製造・検査装置の会社として semiconductors を主たる業界とした。LCD検査機器も半導体と同じ検査機器事業（TE事業）の一部であり、独立した金額開示のある報告セグメントではないため、別の業界は付けていない。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的が安定的な資金調達先としての取引関係の維持・強化であり、資金調達・金融取引が理由のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有目的が安定的な資金調達先としての取引関係の維持・強化であり、資金調達・金融取引が理由のため結ばなかった。
- relatedCompanies: Hermes Testing Solutions Inc.・Gallant Precision Machining Co., Ltd.: 特定投資株式に協業・技術供与契約の関係が印字されているが、いずれも台湾の非上場会社で関連候補（related-candidates）に無く、EDINETコードリストで同一性を確認できないため結ばなかった。
- relatedCompanies: rohm: 社名の部分一致（シンドローム等の語）であり、同社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）の名称の部分一致であり、信託口は大株主の名義のため結ばなかった。
- relatedCompanies: hiraga: 沿革中の地名「平賀町」の部分一致であり、同社との関係の記載がないため結ばなかった。
- relatedCompanies: yamachuu: 社外監査等委員の個人名（内山忠明氏）の部分一致のため結ばなかった。
- relatedCompanies: career, en, port, ray, seki, base-4481, king, path, no-1, rix, freee, will: いずれも一般語・部分一致（キャリアパス、エンゲージメント、サポート、ベース、ワーキング等）であり、同社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: 当社グループの連結子会社7社は関連企業として結ぶ対象ではない。
- terms: 助言: 用語「プローブカード」は、半導体製造のウェーハ検査工程で、シリコンウェーハ上の半導体チップの電極にピンを接触させ、テスタと半導体チップを接続するコネクタのような役割を担う計測器具。同社の主力製品で、経営成績の分析の節に役割の説明が印字されている。
- terms: 助言: 用語「HBM」は広帯域メモリ（High Bandwidth Memory）の略で、生成AI向けデータセンター投資の拡大を背景に需要が伸びているメモリ。同社のメモリ向けプローブカードの主要な需要先として経営成績の分析の節に印字されている。
- terms: 助言: 用語「パッケージプローブ」は、半導体チップの実装組立後の検査で使用されるテストソケット。TE事業の主力製品の一つとして事業の内容・経営成績の分析の節に印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
