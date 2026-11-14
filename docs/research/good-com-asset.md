# グッドコムアセット — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社グッドコムアセット |
| 証券コード | 3475 |
| docID（データを取り出した文書） | `S100XHS4` |
| 原本 docID | `S100XHS4` |
| 提出日（原本） | 2026-01-28 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHS4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社グッドコムアセット / 3475 / docID S100XHS4（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
good-com-asset: 10 件の数値を有報XBRLと照合
有報: 株式会社グッドコムアセット 有価証券報告書－第20期(2024/11/01－2025/10/31) (docID S100XHS4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
good-com-asset: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨てて転記した（切り捨て規約）。
- businessModel: セグメント外部顧客への売上高の切り捨て合計は54,580百万円で、印字の連結売上高54,581百万円と1百万円の差がある。印字どおり転記した。
- businessModel: MD&Aのセグメント別数値は内部売上高を含むため使用せず、セグメント注記の外部顧客への売上高を使用した。
- businessModel: 株式会社Livenup Groupの連結子会社化（2025年6月5日付で議決権の80％を取得）は当連結会計年度中の完了事項であり、期末現在の構造に反映されているため、沿革・事業構造に記録し、確認事項にはしていない。同社ののれんは取得原価の配分が完了していないため暫定的な会計処理による旨が印字されている。
- businessModel: 主要な顧客である首都圏レジ３合同会社・首都圏レジ４合同会社は合同会社（特別目的会社）で上場会社ではなく関連候補にも含まれないためリンクせず、主要な顧客ごとの情報の事実を industryPosition に記録した。
- businessModel: 配当政策に印字された配当性向35％の目標は投資指標のため、strategy には転記していない。
- businessModel: 前期有報との修正再表示チェックは全系列で差異なし。表示方法の変更に係る財務諸表の組替えの印字もないため、組替えの注記は置いていない。
- businessStructure: 報告セグメントは当連結会計年度より『Livenup Group』を追加した5区分であり、前連結会計年度のセグメント情報は新区分に基づき作成されたものが開示されている。
- businessStructure: 非連結子会社2社（一般社団法人ソウ・プラス、シルクル２合同会社）は小規模で連結財務諸表への影響が軽微なため、事業構造には含めていない。
- history: 沿革は構造上の節目を選んで収録し、ブランド採用（skygarden、skyrun等）、免許・登録の取得、支店開設、上海家徳可睦商務諮詢有限公司の設立（2017年）・清算結了（2022年）等の行は省略した。
- history: 設立時等の資本金額は印字があっても転記していない。年月のみの印字のため、月は記録していない。
- industry: 主たる業界は real-estate とした。投資用新築マンションの開発・販売が事業の中核であり、管理・家賃債務保証・不動産ファンドも不動産関連事業であるため。副次の業界は付けなかった。
- relatedCompanies: 株式会社ジャックスは、特定投資株式のうち当社顧客が利用する住宅ローンの提携先という具体的な取引役割が印字されているため、業務提携先としてリンクした。
- relatedCompanies: エレベーターコミュニケーションズ株式会社（353A、札幌証券取引所アンビシャス市場）は特定投資株式の銘柄であり関連候補にも含まれるが、保有目的は『良好な取引関係の維持・強化及び将来的な取引の拡大』という定型的な記載のみで、具体的な取引内容・提携内容の印字がないためリンクせず、事実をここに記録する（連結子会社が同社株式7,200株を保有）。
- relatedCompanies: 大株主の長嶋義和氏・長嶋弘子氏は個人であり、株式会社long-islandは代表取締役社長の資産管理会社で未上場のため、いずれもリンクしない。信託口・カストディ名義の大株主もリンクしない。
- relatedCompanies: その他の候補（s-t、land、port、zero、en、base-4481、career、garden、aska、sumitomo-realty-and-development、idea-consultants、seki、wealth-management）は一般語・部分一致の誤検出であり、有報に当社との取引・提携の印字がないためリンクしない。trust はEDINETコードリストにないためリンクしない。
- terms: 助言: 用語『GENOVIA（ジェノヴィア）』は、当社の自社ブランドマンションのシリーズ名です（【事業の内容】に印字）。
- terms: 助言: 用語『green veil（グリーンヴェール）』は、壁面緑化デザインのブランド名です（【事業の内容】に印字）。
- terms: 助言: 用語『専有物件』はマンション建設事業主から1棟を買い取り自社ブランド仕様に変更する物件、『開発物件』は土地を仕入れて自社ブランドマンションを開発する物件を指します（【事業の内容】に印字）。

## 要確認（status に反映）

- businessModel: 2022年11月1日付で普通株式1株につき2株の割合で株式分割を行っております。株式数に関する指標は第16期の期首に当該分割が行われたと仮定して算定されております。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
