# 今仙電機製作所 — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社今仙電機製作所 |
| 証券コード | 7266 |
| docID（データを取り出した文書） | `S100YER6` |
| 原本 docID | `S100YER6` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YER6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社今仙電機製作所 / 7266 / docID S100YER6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
imasen-electric-industrial: 10 件の数値を有報XBRLと照合
有報: 株式会社今仙電機製作所 有価証券報告書－第89期(2025/04/01－2026/03/31) (docID S100YER6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
imasen-electric-industrial: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と純利益の増減率はMD&Aの印字（売上高前期比7.6％減、親会社株主に帰属する当期純利益前期比19.0％増）に基づきます。セグメント利益や営業利益などの金額・増減率は本文に書いていません。
- businessModel: 中期経営計画の数値目標（2026年度の売上高860億円への見直し、営業利益率や自己資本利益率の目標）は計画値であり、本文には書かずここに記録します。
- businessModel: MD&Aのセグメント別売上高は外部顧客への売上高と一致するため、そのまま使いました。生産実績・受注実績の金額は本文に書いていません。
- businessModel: 前期の修正再表示チェックは前期有報と全行一致し、会計方針の変更等の印字もないため、financialNotesは空にしました。
- businessStructure: 報告セグメントは地域別（日本・北米・アジア）の3区分であり、子会社の並びはセグメント注記の外部顧客への売上高の大きい順（日本38,461百万円、北米25,004百万円、アジア23,683百万円、合計87,149百万円で連結売上高と一致）としました。
- businessStructure: 【事業の内容】の事業区分（シート・電装事業、電子事業、その他事業）は製品別の区分で、金額は地域別セグメントでしか開示されていないため、各地域の説明の中に製品の内容を書きました。その他事業（ワイヤーハーネス、福祉機器、画像・映像処理装置など）は日本に所在するグループ会社が担っています。
- businessStructure: 非連結子会社の株式会社ナイト（従業員向け福利厚生サービス）は2026年3月31日付で解散し清算手続中です。期末現在の事象として事業の説明には含めず、ここに記録します。
- businessStructure: 上場市場は表紙の印字（東京証券取引所スタンダード市場、名古屋証券取引所プレミア市場）に基づきます。
- history: 【沿革】の末尾は年月セルと事象文が分かれて崩れて印字されています。2014年8月・2015年4月・2015年6月の3つの年月と3つの事象、2020年11月・2022年8月・2023年10月の3つの年月と3つの事象は、数が一致するため行順に対応づけました。
- history: 転換社債型新株予約権付社債の発行（2005年、2007年、2012年）は資金調達の出来事であり、事業構造の変遷ではないため沿革の行にしませんでした。
- history: 各行の月は有報の印字どおり説明文に含め、行のキーは年のみとしています。資本金の金額は沿革に印字されていないため書いていません。
- industry: 主たる業界は automotive（自動車）としました。連結売上高87,149百万円の大部分が自動車用シート機構・電装製品と電子製品であり、報告セグメントも自動車部品関連事業の地域別区分です。
- industry: その他事業（航空機用・工作機械用ワイヤーハーネス、福祉機器、画像・映像処理装置）は独立した金額の開示がなく、売上に占める割合も小さいため、独立した業界は追加していません。
- relatedCompanies: honda（本田技研工業）: 事業等のリスクに本田技研工業系列向け売上高割合39.4％の印字はありますが、系列企業の集約表示であり、本田技研工業そのものとの直接の取引は印字されていないため結びませんでした。割合は industryPosition に記載しています。
- relatedCompanies: mitsubishi-motors（三菱自動車工業）: 同様に系列向け売上高割合9.8％の集約表示のみで、直接の取引の印字がないため結びませんでした。
- relatedCompanies: aichi-financial-group（あいちフィナンシャルグループ）: 特定投資株式として保有していましたが、当事業年度に全て売却し保有がなくなったため結びませんでした。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）: 当事業年度に全て売却し保有がなくなったこと、金融機関であることから結びませんでした。
- relatedCompanies: the-ogaki-kyoritsu-bank（大垣共立銀行）: 当事業年度に全て売却し保有がなくなったこと、金融機関であることから結びませんでした。
- relatedCompanies: san-ju-san-financial-group（三十三フィナンシャルグループ）: 特定投資株式の保有目的が資金調達等財務活動の円滑化であり、金融機関との資金調達関係のため結びませんでした。
- relatedCompanies: jeol（日本電子）: 設備の状況の「日本」セグメントの「電子製品生産設備」という印字の部分一致であり、日本電子株式会社ではありません。
- relatedCompanies: land（ランド）: 当社の持分法適用会社イマセン ランドホールディング コーポレーションの名称の一部の一致であり、グループ会社のため結びませんでした。
- relatedCompanies: japan-airlines（日本航空）: 「日本」セグメントの航空機用ワイヤーハーネス生産設備という印字の部分一致であり、日本航空株式会社ではありません。
- relatedCompanies: en、port、seki、base-4481、core、cover、freee、kohsoku: 一般語や部分一致のみで、取引・提携・資本関係の印字がないため結びませんでした。
- relatedCompanies: 日本発條株式会社は大株主（1.46％、2026年3月31日現在）ですが、related-candidates.json に含まれていないため結んでいません。その子会社NHK Seating of America,Inc.は前連結会計年度の主要な顧客でした。
- terms: 用語候補: リクライニングアジャスタ、スライドアジャスタ、パワーシートアジャスタ、ウインドレギュレータ、ワイヤーハーネス、無動力歩行支援機、シートアジャスタ、メガサプライヤー、持分法適用関連会社、その他の関係会社——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
