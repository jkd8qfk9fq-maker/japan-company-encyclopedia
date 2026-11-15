# 松井建設 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 松井建設株式会社 |
| 証券コード | 1810 |
| docID（データを取り出した文書） | `S100YHYW` |
| 原本 docID | `S100YHYW` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHYW.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E6%9D%BE%E4%BA%95%E5%BB%BA%E8%A8%AD

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 松井建設株式会社 / 1810 / docID S100YHYW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
matsui-construction: 10 件の数値を有報XBRLと照合
有報: 松井建設株式会社 有価証券報告書－第97期(2025/04/01－2026/03/31) (docID S100YHYW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
matsui-construction: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。第97期の経営指標等の注記に遡及修正や表示変更の印字はなく、前期有報との修正再表示チェックでも全8行が一致したためである。
- businessModel: 中期経営計画〈2025-2027〉の数値目標（売上高・利益・資本効率などの目標値）は本文には書かず、方針と課題の要約のみを strategy.disclosed に記載した。
- businessModel: 重要な後発事象は連結・個別とも「該当事項なし」で、提出後の予定事項も印字されていないため needsReview は空とした。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（建設事業94,470百万円、不動産事業等1,567百万円）とした。
- businessStructure: 建築工事・土木工事の金額は、セグメント注記では独立開示されていないため、MD&Aに参考として記載された提出会社個別の売上高（種類別）を用い、その旨を各説明に明記した。
- businessStructure: 不動産事業等は売買・賃貸と設計・監理で金額が独立開示されていないため、子事業に分けず金額も書いていない。
- businessStructure: 関連会社のいなぎ文化センターサービス株式会社はPFI事業を営むが、関係会社の状況の表には記載がなく金額も独立開示されていないため、事業としては立てていない。
- history: 沿革の冒頭の物語部分（1586年の創業から1939年の設立まで）は年月と事象が分かれた崩れた表ではないため、本文の記述どおりに年ごとに整理した。資本金の金額は沿革に印字がないため書いていない。
- history: Wikipediaの補足は通称「社寺の松井」のみを用いた（1586年の行の significance）。数値・順位の類は使っていない。
- industry: 主たる業界は construction とした。報告セグメントの建設事業が外部顧客への売上高の98.4％を占める。
- industry: 不動産事業等は独立した報告セグメントだが、外部顧客への売上高は1,567百万円と全体の約1.6％にとどまるため、real-estate の副次分類は付けていない。
- relatedCompanies: hulic はリンクしていない。理由: ヒューリック（1,389,580株保有）をはじめ、東京建物、共立メンテナンス、ライト工業、日本ヒューム、都築電気、ヤマト、カーリット、松竹、朝日工業社、富士急行、中村屋、ＡＶＡＮＴＩＡ、東部ネットワーク、北沢産業、トーエル、山忠ら事業会社については、特定投資株式の保有目的が「当社建設事業の事業活動の円滑化のために保有している」という全銘柄共通の定型文のみで、銘柄ごとの個別の取引・提携事実の印字がないためリンクしていない。北沢産業とトーエルには保有株式増加の理由文があるが、これも両社共通の定型文である。
- relatedCompanies: tokio-marine-holdings はリンクしていない。理由: 保険持株会社であり、保有目的は全銘柄共通の定型文のみ。当社株式を保有しているのは傘下の東京海上日動（別法人）である旨が注記されており、リンクしていない。
- relatedCompanies: sompo-holdings はリンクしていない。理由: 保険持株会社であり、保有目的は全銘柄共通の定型文のみ。当社株式を保有しているのは傘下の損害保険ジャパン（別法人）である旨が注記されており、リンクしていない。
- relatedCompanies: hokuhoku-financial-group はリンクしていない。理由: 金融機関グループであり、保有目的は「取引金融機関との連携強化」という共通の定型文のみ。当社株式を保有しているのは傘下の北陸銀行（銀行本体・別法人）である旨が注記されており、リンクしていない。
- relatedCompanies: mizuho-financial-group はリンクしていない。理由: 金融機関グループであり、保有目的は共通の定型文のみ。当社株式を保有しているのは傘下のみずほ銀行及びみずほ信託銀行（銀行本体・別法人）である旨が注記されており、リンクしていない。
- relatedCompanies: the-ogaki-kyoritsu-bank はリンクしていない。理由: 大株主の状況に4.31％（2026年3月31日現在）と載るが、銀行本体であり金融機関であるため major-shareholder としてはリンクしていない。特定投資株式の保有目的も取引金融機関との関係に関する定型文のみである。
- relatedCompanies: the-77-bank はリンクしていない。理由: 金融機関であり、保有目的は取引金融機関との関係に関する共通の定型文のみのためリンクしていない。
- relatedCompanies: japan-post-bank はリンクしていない。理由: 株式の保有状況の集計表に現れるのみで、保有目的の個別印字がない。金融機関でもあるためリンクしていない。
- relatedCompanies: japan-post-holdings はリンクしていない。理由: 株式の保有状況の集計表に現れるのみで、保有目的の個別印字がないためリンクしていない。
- relatedCompanies: mitsubishi-ufj-financial-group はリンクしていない。理由: 株式の保有状況の集計表に現れるのみで、保有目的の個別印字がない。金融機関でもあるためリンクしていない。
- relatedCompanies: hikari-tsushin はリンクしていない。理由: 大株主の状況の名義は「光通信ＫＫ投資事業有限責任組合」であり、同社自体ではなく投資事業組合である。事業関係の印字もないためリンクしていない。
- relatedCompanies: takashima-and-co はリンクしていない。理由: 株式の保有状況の集計表に現れるのみで、保有目的の個別印字がなく、一致も曖昧なためリンクしていない。
- relatedCompanies: en はリンクしていない。理由: サステナビリティ本文中の一般語への曖昧な一致であり、企業との関係はないためリンクしていない。
- relatedCompanies: suzuki-6785 はリンクしていない。理由: 役員の氏名（鈴木博光・鈴木裕子）への一致であり、企業との関係はないためリンクしていない。
- relatedCompanies: zero はリンクしていない。理由: 「ゼロエミッション活動」等の一般語への曖昧な一致であり、企業との関係はないためリンクしていない。
- relatedCompanies: shochiku はリンクしていない。理由: 特定投資株式の保有目的が共通の定型文のみであることに加え、当社の沿革等にも現れる社名で一致が曖昧なためリンクしていない。
- relatedCompanies: yamachuu はリンクしていない。理由: 特定投資株式の保有目的が共通の定型文のみで、個別の取引事実の印字がないためリンクしていない。2025年7月に名古屋証券取引所へ新規上場した銘柄である。
- relatedCompanies: trust はリンクしていない。理由: 日本マスタートラスト信託銀行（信託口）への一致であり、信託口名義はリンク対象外のためリンクしていない。
- relatedCompanies: 関連企業は0件とした。重要な契約等は「特記事項なし」で、セグメント関連情報でも特定の主要顧客の印字はなく、有報に個別の取引・提携事実が印字された上場企業はなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として3件を提案した。いずれも有報本文に現れる当社の事業に関わる語である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
