# ラクト・ジャパン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ラクト・ジャパン |
| 証券コード | 3139 |
| docID（データを取り出した文書） | `S100XMUD` |
| 原本 docID | `S100XMUD` |
| 提出日（原本） | 2026-02-24 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XMUD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ラクト・ジャパン / 3139 / docID S100XMUD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
lacto-japan: 10 件の数値を有報XBRLと照合
有報: 株式会社ラクト・ジャパン 有価証券報告書－第28期(2024/12/01－2025/11/30) (docID S100XMUD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
lacto-japan: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年改正会計基準の適用とグローバル・ミニマム課税の適用については、有報に連結財務諸表への影響はない、または軽微と記載され、修正再表示チェックも全行一致のため、financialNotesには書いていません。
- businessModel: 税効果会計の注記の表示方法の変更（「税額控除」の独立掲記に伴う前年度注記の組替え）は、売上高と当期純利益の範囲に変更がないため、financialNotesには書いていません。
- businessModel: 機能性食品原料部門は2025年12月1日付で「ライフサイエンス事業部門」に改称しました。有報の事業年度は2025年11月期のため、部門名は有報の印字どおりとしています。
- businessStructure: 事業は報告セグメントが単一のため、MD&Aの管理会計上の区分（販売実績の表）の金額で並べました。部門別売上高の合計と連結売上高の1百万円の差は有報の丸めによるもので、印字の金額をそのまま記載しています。
- businessStructure: アジア事業・その他の内訳（乳原料販売228億19百万円、チーズ製造販売63億91百万円）は、LACTO USA INC.などのアジア事業以外の海外子会社や株式会社LJフーズのその他事業を含むため、部門合計の317億72百万円とは一致しません。有報の注記のとおりに記載しています。
- businessStructure: 機能性食品原料部門は2025年12月1日付で「ライフサイエンス事業部門」に改称しました。有報の事業年度は2025年11月期のため、部門名は有報の印字どおりとしています。
- businessStructure: 乳原料・チーズ部門の乳原料とチーズ、食肉食材部門の各区分、機能性食品原料部門の各区分には金額の内訳の印字がないため、金額を書いていません。
- history: 沿革は15件に絞りました。省いた行：2000年の農畜産業振興事業団の指定輸入業者への指定、2004年と2018年の本社移転、2011年の楽可多食品（煙台）の設立と2013年の清算、2013年のタイ・上海以外の行、2019年のバンコク駐在員事務所の開設、2021年の監査等委員会設置会社への移行とインドネシア法人PT. LACTO TRADING INDONESIAの設立、1998年から1999年の駐在員事務所の開設など。
- history: 設立時の資本金の金額は本文の規則により記載していません。
- industry: 乳製品原料や食肉、機能性食品原料の輸入を主とする卸売が主たる事業で、東京証券取引所の業種分類でも卸売業に属するため、trading を主たる業界としました。食品の取扱いが事業の内容のため、food を2つ目に付けました。
- relatedCompanies: 特定投資株式の8銘柄（ニッピ、江崎グリコ、日油、ＡＤＥＫＡ、明治ホールディングス、雪印メグミルク、森永製菓、エア・ウォーター）は、保有目的が「○○部門の取引関係の維持・強化」という定型句のみで、取引の向きや内容の印字がないため結びませんでした。
- relatedCompanies: SEABOARD FOODS社は豚肉加工品の大手仕入先として有報に記載されますが、米国の会社で掲載企業リストにないため結びませんでした。
- relatedCompanies: 大株主のよつ葉乳業（2.00％）とマリンフード（1.71％）は事業会社ですが、非上場で掲載企業リストにないため結びませんでした。信託銀行2行は信託口、個人株主は個人のため結びませんでした。
- relatedCompanies: 連結子会社10社と持分法適用関連会社PT. PACIFIC LACTO JAYAはすべて海外・非上場のため結びませんでした。
- relatedCompanies: career・seki・port・vision・path・base-4481・en・land・tein・trust・zero・core・corona・shinto・slogan・step・taya・nissin は語の断片一致のみのため結びませんでした。trust・nissin はコードリストにありません。
- terms: 新たに提案する用語はありません。乳原料・チーズ部門や乳調製品、機能性食品原料などの部門名・商品名は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
