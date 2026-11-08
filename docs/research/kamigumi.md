# 上組 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社上組 |
| 証券コード | 9364 |
| docID（データを取り出した文書） | `S100YG9D` |
| 原本 docID | `S100YG9D` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG9D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社上組 / 9364 / docID S100YG9D（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 53 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kamigumi: 10 件の数値を有報XBRLと照合
有報: 株式会社上組 有価証券報告書－第87期(2025/04/01－2026/03/31) (docID S100YG9D)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kamigumi: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…で取扱量の拡大と事業の効率化を進めて利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空。修正再表示チェックは全系列で一致し、経営指標等の注記にも遡及適用や会計基準の変更の記載はない（注記は潜在株式と従業員数の算定に関するもののみ）。
- businessModel: 中期経営計画2030・長期ビジョン2035の数値目標（連結営業収益3,500億円・4,500億円、営業利益、ROE等）は経営指標・利益の目標であるため本文に書かず、戦略は定性的に要約した。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」。重要な契約等も「該当事項はありません」。提出後に過ぎた予定事項はない。
- businessModel: 日本ポート産業の完全子会社化（2026年2月27日）とSAURASHTRA FREIGHTの連結子会社化は決算期日までの出来事のため、事実として沿革・本文に書き、needsReview には入れなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への営業収益の大きい順（物流事業 260,849百万円 → その他事業 33,908百万円）。どちらも報告セグメントであり、「その他事業」も売上順に置いた。
- businessStructure: 事業ごとの子会社・関連会社の社数は【事業の内容】の記載（物流事業：子会社 上組陸運㈱他26社・関連会社 KLKGホールディングス㈱他13社、その他事業：子会社 ㈱カミックス他5社・関連会社 ㈱神戸港国際流通センター他3社）に基づく。
- businessStructure: 金額はセグメント注記の「外部顧客への営業収益」（2026年3月期）。MD&Aのセグメント別営業収益（内部取引を含む 261,097百万円／37,451百万円）は使っていない。
- history: 沿革は日付と事象が一体で印字されており、行順の対応づけは不要だった。支店・出張所の開設、組織変更、本部の開設などの小項目は落とし、主要な出来事だけを採用した（落とした行は沿革原文どおり多数あるが、会社形態・上場・海外展開・子会社化に関わるものだけを残した）。
- history: 創業時の資本金は有報に印字されていないため書いていない。
- history: 日本ポート産業の完全子会社化の完了日（2026年2月27日）は【関係会社の状況】の注記に基づく。
- industry: 主たる業界は transportation とした。物流事業が外部顧客への営業収益の約9割（260,849百万円）を占め、港湾運送・倉庫・自動車運送・国際輸送が中心であるため。
- industry: その他事業（重量建設機工・不動産賃貸・酒類の製造販売・金融・農産物生産販売・太陽光発電・ソフトウエア）は混合した区分で、事業ごとの金額が独立して開示されていないため、construction や real-estate は付けなかった。会社の業界は transportation で表せるため taxonomyGaps にはしていない。
- relatedCompanies: port: 「日本ポート産業」の社名の一致で、日本ポート産業は当社の連結子会社（未上場）であり、ポート株式会社への言及はないため結ばなかった。
- relatedCompanies: vision: 「長期ビジョン2035」の語の一致で、株式会社ビジョンへの言及はないため結ばなかった。
- relatedCompanies: career: 「キャリア形成」の語の一致で、株式会社キャリアへの言及はないため結ばなかった。
- relatedCompanies: path: 「パーパス」（存在意義）の語の一致で、パス株式会社への言及はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: en: 「エンゲージメント」の語の一致で、エン株式会社への言及はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: ray: 断片一致で、株式会社レイへの言及はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）の名称の一致で、株式会社トラストへの言及はなく、候補の上場区分も「コードリストにない」ため結ばなかった。
- relatedCompanies: ana-holdings: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: asahi-group-holdings: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: chubu-electric-power: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: chugai-ro: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス」の語の一致で、株式会社コロナへの言及はないため結ばなかった。
- relatedCompanies: fuji-oil: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: hirano-tecseed: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: iseki-and-co: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: itochu: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: itoham-yonekyu-holdings: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: j-oil-mills: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: jfe-holdings: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: kanadevia: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: kanematsu: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった（ambiguousでもある）。
- relatedCompanies: kawasaki-kisen-kaisha: 特定投資株式で最大の保有銘柄（4,114,800株）だが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: komatsu: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: konica-minolta: 特定投資株式に載っていたが、当事業年度に保有株式を全て売却しており、保有目的も定型文のみのため結ばなかった。
- relatedCompanies: marubeni: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった（ambiguousでもある）。
- relatedCompanies: maruichi-steel-tube: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: megmilk-snow-brand: 特定投資株式に載るが、保有目的は「事業上の協力関係の維持」という定型句のみで、相手固有の取引の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-corporation: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-heavy-industries: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-logistics: 特定投資株式に載っていたが、当事業年度に保有株式を全て売却しており、保有目的も定型文のみのため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的が「金融取引における取引関係の維持」で、資金調達にあたるため結ばなかった。
- relatedCompanies: mitsui-and-co: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: mitsui-e-and-s: 特定投資株式に載るが、保有目的は「事業上の協力関係の維持」という定型句のみで、相手固有の取引の記載がないため結ばなかった。
- relatedCompanies: ms-and-ad-insurance-group-holdings: 特定投資株式の保有目的が「金融取引における取引関係の維持」で、保険・金融取引にあたるため結ばなかった。
- relatedCompanies: nippon-steel: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: nisshin-seifun-group: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: nomura-holdings: 特定投資株式の保有目的が「金融取引における取引関係の維持」で、金融取引にあたるため結ばなかった。
- relatedCompanies: onoken: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: penta-ocean-construction: 特定投資株式の保有目的は「倉庫等、物流施設の安定的な供給の維持」だが、大成建設と全く同じ定型句であり、相手固有の取引・請負の記載がないため結ばなかった（覆し可能な判断として記録）。
- relatedCompanies: ryohin-keikaku: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: shinyei-kaisha: 特定投資株式に載るが、保有目的は「事業上の協力関係の維持」という定型句のみで、相手固有の取引の記載がないため結ばなかった（ambiguousでもある）。
- relatedCompanies: showa-sangyo: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: sintokogio: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: sojitz: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった（ambiguousでもある）。
- relatedCompanies: sugimura-warehouse: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: sumitomo-corporation: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式に載っていたが、当事業年度に保有株式を全て売却しており、保有目的も金融取引の定型文のため結ばなかった。
- relatedCompanies: taisei: 特定投資株式の保有目的は「倉庫等、物流施設の安定的な供給の維持」だが、五洋建設と全く同じ定型句であり、相手固有の取引・請負の記載がないため結ばなかった（覆し可能な判断として記録）。
- relatedCompanies: tokuyama: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: toyota-tsusho: 特定投資株式の保有目的は定型文「物流事業の取引関係の維持」のみ。持分法適用関連会社の豊通上組物流（常熟）有限公司は社名に「豊通」を含むが、有報は豊田通商自体との取引・提携・出資関係を明記していないため結ばなかった（覆し可能な判断として記録）。
- relatedCompanies: toyota: 特定投資株式に載るが、保有目的は全銘柄共通の定型文「物流事業の取引関係の維持」のみで、相手固有の取引・提携の記載がないため結ばなかった。
- relatedCompanies: weds: 特定投資株式に載るが、保有目的は「事業上の協力関係の維持」という定型句のみで、相手固有の取引の記載がないため結ばなかった。
- relatedCompanies: 候補外の記録: 特定投資株式のシハヌークビル港湾公社（カンボジア）は候補にない外国法人。【大株主の状況】（2026年3月31日現在）は信託銀行・かみぐみ共栄会・社員持株会・保険会社等のみで、結べる事業会社の大株主はいない。豊通上組物流（常熟）有限公司・KLKGホールディングス等の関連会社はいずれも未上場で候補にない。
- terms: 登録候補（助言のみ）: NVOCC（船舶を自ら運航せず海上輸送を担う事業形態。インドのSAURASHTRA FREIGHTが営む）、港湾運送（港湾での荷役・保管・運送を一体で担う事業）、コンテナターミナル（コンテナ貨物の積み替え拠点の運営）、重量建設機工（重量貨物の運搬・据付を行う事業）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
