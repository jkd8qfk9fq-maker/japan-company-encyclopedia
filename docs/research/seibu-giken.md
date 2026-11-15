# 西部技研 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　西部技研 |
| 証券コード | 6223 |
| docID（データを取り出した文書） | `S100XTV5` |
| 原本 docID | `S100XTV5` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTV5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　西部技研 / 6223 / docID S100XTV5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
seibu-giken: 10 件の数値を有報XBRLと照合
有報: 株式会社　西部技研 有価証券報告書－第61期(2025/01/01－2025/12/31) (docID S100XTV5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
seibu-giken: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社西部技研」が EDINET の提出者名「株式会社　西部技研」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の数値目標（2026年12月期：売上高360億円、営業利益率12％、EBITDAマージン15％、ROE13％）は利益・投資指標を含むため strategy 本文には記載せず、ここに記録する。
- businessModel: 重要な後発事象として、2026年2月13日の取締役会決議による自己株式の取得（上限700,000株・1,000百万円）が行われ、2026年3月10日に425,600株・999百万円の取得を完了している。期末後の資本政策事項のため warnings のみの記録とし、登録は2025年12月31日現在の内容に基づく。
- businessModel: 地域別売上高の抽出値は区分合計が34,319百万円となり、印字された合計34,322百万円と3百万円の差がある（抽出上の桁の取り違えとみられる）。製品別金額は合計と一致するため本文では製品別を主に用い、地域別は日本分のみ印字どおり引用した。
- businessModel: suppliers は、有報に当社の調達先を一般名詞で述べる記載がないため省略した（具体的な仕入先企業の開示もない）。
- businessModel: 金額はすべて有報の印字（百万円）どおりであり、換算・四捨五入はしていない。
- businessStructure: 単一セグメント（空調事業）のため、子はセグメント注記の関連情報「製品及びサービスごとの情報」の区分（デシカント除湿機／VOC濃縮装置／その他）で構成した。製品別金額は外部顧客への売上高であり、合計34,322百万円が連結売上高と一致する。
- businessStructure: 連結子会社11社は当社グループ自身の会社であり、relatedCompanies のリンク対象にはしていない。
- history: 沿革の年月は本文印字どおり。資本金額（関係会社の資本金等）は財務数値の範囲外のため history には記載していない。
- history: 2024年10月の米国合弁会社Seibu Giken & Kumyoung Environment, Inc.の設立と2025年9月の宗像第二工場建設も沿革に印字されているが、行数は主要な転機に絞った。
- industry: 事業は空調事業の単一セグメントで、デシカント除湿機・VOC濃縮装置・全熱交換器という産業用空気処理機器の製造・販売が中心であるため machinery を主たる業界とした。他の報告対象セグメントはないため第2の業界は付けていない。
- relatedCompanies: 特定投資株式及びみなし保有株式は「該当事項はありません」と印字されており、上場株式の保有によるリンク根拠は存在しない。保有する投資株式は非上場株式のみである。
- relatedCompanies: 大株主は、代表取締役社長執行役員・隈扶三郎の資産管理会社である株式会社グリーンフューチャー（34.41％、非上場）、公益財団法人隈科学技術・文化振興会（15.10％）、西部技研社員持株会、個人株主であり、いずれも百科事典の登録対象となる上場会社ではない。野村信託銀行（投信口）、SMBC信託銀行（特定有価証券信託受託者）、日本マスタートラスト信託銀行（信託口）は信託口・受託者としての名義であり、リンク対象にしない。
- relatedCompanies: 2024年10月に設立した米国合弁会社Seibu Giken & Kumyoung Environment, Inc.の合弁相手KUMYOUNG ENG CO., LTD.は非上場で登録対象外のため、リンクしていない（合弁の事実は沿革・関係会社の状況に印字）。
- relatedCompanies: 連結子会社11社（Seibu Giken DST AB、西部技研環保節能設備（常熟）有限公司等）は当社グループ自身の会社であり、リンク対象にしない。
- relatedCompanies: 関連候補リストに挙がった社名はすべて一般語の一致（「エン」「コア」「ランド」等）であり、有報が取引・提携・資本関係を述べる上場会社はなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として4件を提案した。いずれも有報の【事業の内容】に説明が印字されている当社の製品・技術の基礎語である。

## 要確認（status に反映）

- businessModel: 株式分割：2023年5月29日付で、普通株式1株につき100株の割合で株式分割を行った。株式関連の指標は、第57期（2022年12月期）の期首に当該分割が行われたと仮定して算定されている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
