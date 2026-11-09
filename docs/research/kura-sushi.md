# くら寿司 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | くら寿司株式会社 |
| 証券コード | 2695 |
| docID（データを取り出した文書） | `S100XHP5` |
| 原本 docID | `S100XHP5` |
| 提出日（原本） | 2026-01-27 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHP5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | くら寿司株式会社 / 2695 / docID S100XHP5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kura-sushi: 10 件の数値を有報XBRLと照合
有報: くら寿司株式会社 有価証券報告書－第30期(2024/11/01－2025/10/31) (docID S100XHP5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kura-sushi: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…舗の運営などの費用を差し引いた残りが利益になります。2025年10月期のは3…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は連結経営指標等の注３に基づく（収益認識基準の第27期期首からの適用）。前期有報との修正再表示チェックは全行一致しており、数値の不一致ではないため needsReview ではなく financialNotes に記録した（サーラコーポレーション等の先例）。
- businessModel: 証拠パックの注意（本文に財務諸表の組替えの記載がある）を確認した。5年数値に影響する事項は収益認識基準の適用（注３）のみで、修正再表示チェックは全行一致のため、basis は financialNotes の1件で足りると判断した。
- businessModel: 重要な後発事象は連結・個別とも『該当事項はありません』、提出後の対象書類（otherFilingsInWindow）も無いため、needsReview は空とした。
- businessStructure: 報告セグメントは飲食事業を基礎とした地域別（日本・北米・アジア）の3区分で、並び順はセグメント注記の外部顧客への売上高の大きい順とした。製品・サービス別の開示は単一セグメントのため省略されており、区分ごとの金額はセグメント注記の印字どおり。
- businessStructure: 店舗数は【主要な設備の状況】と【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の印字に基づく（全店直営・合計687店舗、2025年10月31日現在）。
- businessStructure: wikipedia.json は取得されていたが、冒頭文は有報の記載を超える補足を含まないため使用しなかった。
- history: 【沿革】は年月と事象が同じセルに続けて印字された表のため、年月単位でそのまま採用し、年だけを year に入れた（月は書かない規則）。資本金の金額は文章規則により各項目に書いていない。
- history: 【沿革】の全行のうち、店舗設備・システム導入などの細目（セントラルキッチンの個別開設、研修センター、個別の旗艦店など）は主要な節目に絞って省略し、設立・上場・商号変更・海外進出・子会社設立・店舗網の節目を中心に16件を採用した。
- history: 2025年12月のEY表彰は決算日後の出来事だが、有報の【沿革】に印字された事実であり構造・数値に影響しないため採用し、needsReview には入れなかった。
- industry: 主事業は飲食店（回転すし店）の運営であり、閉じた分類に外食の区分が無いため、最も近い food を暫定の主業界とした（サイゼリヤ・トリドール等の先例）。地域別セグメントはいずれも同じ飲食事業のため、第二の業界は付けなかった。
- relatedCompanies: base（ベース株式会社）: 『経常利益又は経常損失ベースの数値』など一般語『ベース』の一致のみで、同社についての取引・提携・資本関係の記載は無いため結ばなかった。
- relatedCompanies: cover（カバー株式会社）: 抗菌寿司カバー『鮮度くん』の『カバー』の一致のみで、同社についての記載は無いため結ばなかった。
- relatedCompanies: land（株式会社ランド）: スイーツブランド名など文中の語の断片一致のみで、同社についての取引・提携・資本関係の記載は無いため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 人材方針の『キャリアアップ』など一般語の一致のみで、同社についての記載は無いため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 『新型コロナウイルス等による感染症拡大リスク』の記載の一致のみで、同社についての取引等の記載は無いため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: 候補の listing が（コードリストにない）である上、有報の大株主の株式会社トラスト（堺市中区楢葉）は候補企業（証券コード3347）とは別の会社とみられ同一性が確認できず、取引関係の記載も無いため結ばなかった。
- relatedCompanies: amuse（株式会社アミューズ）: 『アミューズメント機能を充実させ』という一般語の一致のみで、同社についての記載は無いため結ばなかった。
- relatedCompanies: en（エン株式会社）: ambiguous な候補で、『エンターテインメント性』の断片一致のみのため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）: ambiguous な候補で、『高速レーン』の一般語の一致のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 『店舗運営をサポートする』の断片一致のみで、同社についての記載は無いため結ばなかった。
- relatedCompanies: ray（株式会社レイ）: ambiguous な候補で、店舗名・地名などの断片一致のみのため結ばなかった。
- relatedCompanies: tein（株式会社テイン）: 『エンターテインメント性』の断片一致のみで、同社についての記載は無いため結ばなかった。
- relatedCompanies: 候補に無いため結べなかった相手: 連結子会社のKura Sushi USA,Inc.（NASDAQ Global Market上場、議決権66.9％）と亞洲藏壽司股份有限公司（Taipei Exchange上場、議決権66.6％）は海外上場の子会社だが候補リストに無い。他の連結子会社2社（Kura Sushi Hong Kong Limited、上海藏寿餐飲管理有限公司）は非上場。
- relatedCompanies: 大株主の株式会社ウォルナットコーポレーション（2025年10月31日現在29.29％）は【沿革】によれば2000年に株式会社くら寿司から商号変更した不動産賃貸業等の会社だが、候補リストに無いため結ばなかった。大株主のうち候補に当たる事業会社は無く（信託銀行・従業員持株会・個人・証券会社のみ）、主要株主としてのリンクも作らなかった。
- terms: 助言のみ: 鮮度くん（特許技術の抗菌寿司カバー）、ビッくらポン！（皿回収と連動したゲーム）、四大添加物（同社が排除を掲げる化学調味料・人工甘味料・合成着色料・人工保存料）、スマートくら寿司（非接触型サービスを標準装備した店舗形態）、セントラルキッチン（すしネタ加工の集中拠点）の用語解説が有用と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] くら寿司の主事業（飲食店の運営） → 提案: restaurants（外食・飲食店）。主事業は飲食店の運営であり、食品の製造・販売を指す food とは業態が異なるため
