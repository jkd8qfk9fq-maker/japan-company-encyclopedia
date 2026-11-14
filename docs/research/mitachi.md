# ミタチ産業 — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ミタチ産業株式会社 |
| 証券コード | 3321 |
| docID（データを取り出した文書） | `S100YYVJ` |
| 原本 docID | `S100YYVJ` |
| 提出日（原本） | 2026-08-27 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYVJ.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%9F%E3%82%BF%E3%83%81%E7%94%A3%E6%A5%AD

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ミタチ産業株式会社 / 3321 / docID S100YYVJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitachi: 10 件の数値を有報XBRLと照合
有報: ミタチ産業株式会社 有価証券報告書－第50期(2025/06/01－2026/05/31) (docID S100YYVJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitachi: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 出典「wikipedia」はどこからも引用されていません

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの「財務諸表の組替え」の注意について、該当する注記は個別財務諸表の表示方法の変更（関係会社に対する金銭債権及び金銭債務の一括掲記、営業取引の売上高・仕入高の表示）で、連結の5年間の経営指標等には影響せず、修正再表示チェックも全8行一致のため、financialNotesには記載しませんでした。
- businessModel: 中期経営計画2026の数値目標は本文の規則により strategy の要約には含めていません。
- businessModel: デンソーグループへの販売実績は、【関連情報】の主要な顧客ごとの情報の印字どおりです。地域別売上高と品目別売上高は千円単位の印字を億円・百万円表記に換算しました。
- businessModel: Wikipediaの冒頭は、本社所在地と電子部品の専門商社という位置づけのみで、descriptionの「電子部品の専門商社」という表現の補足に使用しました。数値は使用していません。
- businessStructure: 当社グループは、当社、連結子会社9社、非連結子会社2社で構成されています（【事業の内容】）。連結子会社のうちM.A.TECHNOLOGY,INC.はフィリピンで電子機器の受託加工を担う生産拠点です。非連結子会社のMITACHI AMERICA,INC.とMITACHI INDIA PVT.LTDは小規模のため連結の範囲から除かれています。
- businessStructure: 連結売上高は2024年5月期の388億99百万円から2025年5月期に981億76百万円へ大きく増加していますが、これは有報の5年間の経営指標等の印字どおりであり、修正再表示チェックは前期有報と全8行一致しています。当有報に企業結合等の注記はなく、増加の理由を推測して記載していません。
- businessStructure: 当連結会計年度に非連結子会社のMITACHI INDIA PVT.LTDを新規設立しました（【事業の内容】）。
- history: 沿革表は年月45件と事象文が連記された形式で、2003年8月と2004年4月の欄にそれぞれ2件の出来事が含まれていたため、行順どおりに分割して計47件としました。
- history: 設立時の資本金額は財務金額のため、沿革の本文には記載していません。
- history: Wikipediaの冒頭は本社所在地と電子部品の専門商社という位置づけのみで、いずれも有報で確認できる内容のため、沿革の補足には使用しませんでした。
- industry: 主たる業界は、報告セグメントが半導体・電子部品の販売と受託加工で、電子部品の専門商社であることから electronics としました。
- industry: 半導体は品目別販売実績として独立して開示され、2026年5月期の売上高は958億35百万円で全体の約8割を占めるため、2つ目の業界として semiconductors を付けました。
- relatedCompanies: 株式会社ＪＵ: 【関係会社の状況】のその他の関係会社で、議決権の被所有割合24.4％、役員の兼任がありますが、資産管理会社で非上場のため、related-candidates.jsonの候補になく結べませんでした。ここに記録します。
- relatedCompanies: ＫＯＡ株式会社: 特定投資株式の保有目的に主に仕入取引を行っている旨の印字がありますが、related-candidates.jsonの候補に無いため結べず、ここに記録します。
- relatedCompanies: 株式会社名古屋銀行: 特定投資株式の保有目的は資金調達取引等で、金融機関のため結びませんでした。
- relatedCompanies: 株式会社大垣共立銀行: 特定投資株式の保有目的は資金調達取引等で、金融機関のため結びませんでした。大株主の状況に1.25％で載りますが、金融機関の資金調達の文脈のため major-shareholder としても結びませんでした。
- relatedCompanies: 大和証券株式会社: 大株主の状況に2.16％で載りますが、証券会社で金融機関のため結びませんでした。
- relatedCompanies: シャープ株式会社: 1993年12月にフィリピンでシャープ株式会社オプトデバイス事業部の加工業務を開始した旨が沿革にありますが、過去の一度きりの出来事で、継続的な取引の印字がないため結びませんでした。
- relatedCompanies: 東芝デバイス＆ストレージ株式会社: 重要な契約等に特約店基本契約の印字がありますが、非上場でrelated-candidates.jsonの候補に無いため結べず、ここに記録します。
- relatedCompanies: 株式会社アミューズ、セキ株式会社、ベース株式会社、株式会社レント、株式会社コア、エン株式会社、株式会社ＩＣ、スローガン株式会社: 一般語・製品名・部分一致の誤マッチのため結びませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
