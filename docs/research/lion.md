# ライオン — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ライオン株式会社 |
| 証券コード | 4912 |
| docID（データを取り出した文書） | `S100XU1E` |
| 原本 docID | `S100XU1E` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU1E.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ライオン株式会社 / 4912 / docID S100XU1E（id は英語表記「Lion Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
lion: 10 件の数値を有報XBRLと照合
有報: ライオン株式会社 有価証券報告書－第165期(2025/01/01－2025/12/31) (docID S100XU1E)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
lion: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期比2.2％はMD&Aに印字された増減率。売上高412,943と422,092百万円は経営指標等の印字です。
- businessModel: customers の2社は【主要な顧客に関する情報】の印字によります。個別の取引条件は有報にないため書いていません。
- businessModel: perspectives（戦略・強み）は md-and-a の精読を省いたため書いていません。
- businessStructure: 並び順は【セグメント情報】2025年12月期の外部顧客への売上高（一般用消費財223,743、海外158,125、産業用品39,307、百万円）の大きい順。「その他」は報告セグメントに含まれないため最後。
- businessStructure: 2025年12月期から、国内の海外支援部門の関連取引を一般用消費財事業から海外事業へ移す組替が行われています（前期分も組替済み）。
- businessStructure: 海外事業・産業用品事業・その他の主要製品は、有報の印字に合わせました。海外事業は製品名の印字がなく「日用品」のみです。
- businessStructure: listingsのmarketは表紙の「東京証券取引所プライム市場」に基づきます。
- businessStructure: childrenは使っていません（単一セグメントではなく、製品区分ヘルスケア等は報告セグメントと対応しないため）。
- history: 沿革の表は左右二欄が崩れて印字されているため、年月と事象が明確に対応する行だけを使いました。2004年12月〜2007年7月の行（中外製薬の一般用医薬品事業・韓国CJ Corp.の生活化学品事業の取得など）は年月と事象の対応が確定できず省きました。
- history: Merap Lion Holding Corporationがベトナムの会社であることは【関係会社の状況】の所在地の印字によります。
- history: 2026年1月のPNB Consolidated Pty Ltd取得と2026年2月のインド子会社設立は、決算期後の出来事のため載せていません。
- industry: 最大の報告セグメントは日用品・一般用医薬品の一般用消費財事業ですが、閉じた分類に日用品の区分が無く、油脂・洗剤・化学品を源流とし産業用品事業（化学品原料）も持つため、最も近い chemicals を暫定にしました。一般用医薬品は金額が独立して開示されていないので pharmaceuticals は足していません。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業として同一性を確認できないため、結んだ相手はありません。
- relatedCompanies: 株式会社PALTAC: 主要な顧客（売上97,604百万円）で関係性の根拠はあるが、候補ファイルが無く上場・同一性を確認できないため結ばない。
- relatedCompanies: Saha Pathanapibul Public Company Limited: 主要な顧客かつタイの合弁パートナー。候補ファイルが無く、掲載済み企業でもないため結ばない。
- relatedCompanies: 株式会社プラネット: 持分法適用関連会社（15.61％）だが、候補ファイルが無く同一性を確認できないため結ばない。
- relatedCompanies: 株式会社あらた・丸全昭和運輸・高砂香料工業: 保有株式の表に載るだけで取引の記述がないため結ばない。
- terms: 用語の追加提案: 「代理店・特約店」（メーカーと小売の間で製品を流通させる卸売の仕組み）。事業利益（IFRSの報告セグメントの評価指標）は本文で財務数値として扱わないため用語集に限る。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ライオンの主たる業界 → 提案: 日用品・トイレタリー（household-products）。ハミガキ・洗剤などの日用品が売上の最大の事業で、化学・食品・小売のどれにも当たらない
