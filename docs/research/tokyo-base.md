# TOKYO BASE — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＴＯＫＹＯ　ＢＡＳＥ |
| 証券コード | 3415 |
| docID（データを取り出した文書） | `S100Y0D8` |
| 原本 docID | `S100Y0D8` |
| 提出日（原本） | 2026-04-22 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y0D8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＴＯＫＹＯ　ＢＡＳＥ / 3415 / docID S100Y0D8（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-base: 10 件の数値を有報XBRLと照合
有報: 株式会社ＴＯＫＹＯ　ＢＡＳＥ 有価証券報告書－第18期(2025/02/01－2026/01/31) (docID S100Y0D8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tokyo-base: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社TOKYO BASE」が EDINET の提出者名「株式会社ＴＯＫＹＯ　ＢＡＳＥ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨てて記載した（切り捨ての方針をここに記録する）。地域別の切り捨て合計（23,733百万円）と業態別の切り捨て合計は、印字の合計23,734百万円と1百万円程度ずれるため、合計は印字どおり23,734百万円を引用した。
- businessModel: 中期経営計画の目標とする経営指標は自己資本利益率（2028年度に20%超）であり、投資指標に当たるため本文とperspectivesには書かず、ここに記録する。企業理念の5つのVISIONにある売上高1,000億円・EC売上500億円の目標も、将来目標のため本文には書いていない。
- businessModel: MD&Aに印字された売上総利益・営業利益・経常利益等の金額と増減率は、本文の財務数値は売上高と当期純利益だけとする規則により本文に書いていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。株式分割・株式併合の印字は経営指標等の注記に見当たらない。
- businessModel: Wikipedia「TOKYO BASE」は証券コードで同一性を確認できたが、抜粋は有報の事実の言い換えにとどまり、有報に無い補足は使わなかったため出典に加えていない。
- businessStructure: 単一セグメントのため、報告セグメントではなく業態（店舗ブランド）を children とし、売上高はMD&Aの補足情報「業態別売上高」の印字（千円）を百万円に切り捨てて記載した。業態別売上高には「その他」15百万円があり、切り捨て後の各業態の合計は全社合計23,734百万円と一致しない（有報の印字合計を優先した）。
- businessStructure: 店舗数はMD&Aおよび主要な設備の状況の連結ベース（実店舗92店＝国内78店・海外14店、インターネット販売12店、合計104店、2026年1月末現在）で記載した。事業の内容に印字された海外店舗の内訳には、非連結子会社TOKYO BASE NEW YORK, Inc.（米国）とTOKYO BASE KOREA CO., LTD.（韓国）の各1店が含まれている。
- businessStructure: 連結子会社はTOKYO BASE HONG KONG.,Ltd.（議決権100%）と東百国際貿易(上海)有限公司（間接所有100%）の2社で、米国のTOKYO BASE NEW YORK, Inc.と韓国のTOKYO BASE KOREA CO., LTD.は重要性が乏しいため非連結子会社である。東百国際貿易(上海)有限公司は債務超過会社であり、2026年1月末時点の債務超過額は2,569,263千円と印字されている（金額は本文に書かず、事実のみ記録する）。
- businessStructure: 仕入先は、オリジナル商品について国内縫製メーカー等と連携している旨の印字のみで、個別の仕入先名の開示はない。本ツリーのスキーマには suppliers キーが無いため、businessModel には suppliers を書いていない。
- history: 沿革の設立行に印字された資本金額は、規則により本文に書いていない。
- history: 2008年設立時の社名は株式会社STUDIOUSで、2016年に現在の株式会社TOKYO BASEへ商号変更した。
- history: 2021年9月のA＋ TOKYO開始は、2024年9月にCITY TOKYOへ業態変更され、2025年10月にCITYへ名称変更された流れを2021年と2025年の行にまとめた。
- history: KEY TIMEZの開始（2026年3月）は決算期末（2026年1月31日）後であるが、有報の沿革に印字された事実として記載した。
- industry: 主たる業界は retail とした。衣料品および身の回り品、雑貨類の小売販売が唯一の事業（単一セグメント）であり、閉じた分類で直接当たる。
- industry: インターネット販売は販売チャネルであり、独立した事業として金額が開示されていないため it は付けなかった。
- relatedCompanies: 結んだ関連企業は0社である。候補はいずれも一般語・部分一致であり、有報がその相手について取引・提携・資本関係を述べた箇所はない。
- relatedCompanies: デイトナ（daytona、7228）: 沿革の譲渡元は株式会社デイトナ・インターナショナル（非上場）であり、候補の株式会社デイトナとは別の法人である。2009年・2010年の事業譲受は過去の出来事で、現在の取引・資本関係の印字もないため結ばなかった。
- relatedCompanies: ランド（land、8918）: 一致箇所は「ブランド」の部分一致で、同社への言及ではない。
- relatedCompanies: ビジョン（vision、9416）: 一致箇所は当社の「企業ビジョン」の語で、同社への言及ではない。
- relatedCompanies: コロナ（corona、5909）: 一致箇所は「コロナ禍」の語で、同社への言及ではない。
- relatedCompanies: エン（en、4849）: ambiguous の候補。一致箇所は一般語の部分一致で、同社への言及ではない。
- relatedCompanies: 日新（nissin、9066）: コードリストにない相手。一致箇所は新株予約権の文脈の一般語である。
- relatedCompanies: セキ（seki、7857）: ambiguous の候補。一致箇所は「情報セキュリティ」の部分一致で、同社への言及ではない。
- relatedCompanies: トラスト（trust、3347）: コードリストにない相手。一致箇所は大株主の日本マスタートラスト信託銀行（信託口）で、信託口のカストディであり取引関係ではない。
- relatedCompanies: ゼロ（zero、9028）: ambiguous の候補。一致箇所は会計方針の「残存価額をゼロとする」の語で、同社への言及ではない。
- relatedCompanies: フリー（freee、4478）: 一致箇所は「フリー・キャッシュ・フロー」の語で、同社への言及ではない。
- relatedCompanies: インサイト（insight、2172）: 一致箇所は設備投資の文脈の一般語で、同社への言及ではない。
- relatedCompanies: ポート（port、7047）: 一致箇所は「ポートフォリオ」の部分一致で、同社への言及ではない。
- relatedCompanies: スローガン（slogan、9253）: 一致箇所は当社の「企業スローガン」の語で、同社への言及ではない。
- relatedCompanies: 東名（toumei、4439）: ambiguous の候補。一致箇所は「東名阪エリア」の部分一致で、同社への言及ではない。
- relatedCompanies: 大株主の状況に載るのは信託銀行（信託口）等の名義のみで、事業会社の大株主はいない。関連当事者として印字されるのは役員個人（中水英紀）のみで、会社ではない。特定投資株式の開示から結べる相手もない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 助言: 用語は有報の事業の内容に説明がある当社事業固有の用語に限った。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
