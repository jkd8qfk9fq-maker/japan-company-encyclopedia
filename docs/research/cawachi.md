# カワチ薬品 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カワチ薬品 |
| 証券コード | 2664 |
| docID（データを取り出した文書） | `S100Y9UW` |
| 原本 docID | `S100Y9UW` |
| 提出日（原本） | 2026-06-10 |
| 決算期 | 2026-03-15 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y9UW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カワチ薬品 / 2664 / docID S100Y9UW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cawachi: 10 件の数値を有報XBRLと照合
有報: 株式会社カワチ薬品 有価証券報告書－第59期(2025/03/16－2026/03/15) (docID S100Y9UW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
cawachi: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…営にかかる費用などを差し引いた残りが利益になります。2026年3月期のは32…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の前期比1.2％減、純利益の前期比34.5％減と、その理由である減損損失の計上は、MD&Aの印字どおりに書いた。営業利益・経常利益については金額も増減率も書いていない。
- businessModel: financialNotesは経営指標等の注記にある収益認識基準の第56期期首からの適用のみを記録した（オブジェクト形式）。修正再表示チェックは前期有報との重複年度が全項目一致で、決算期変更・変則決算はない。ブートストラップ時の警告にあった財務諸表の組替えの記載は、抽出テキスト（sections.txt）内では確認できなかったため、組替えに関する注記は記録していない。
- businessModel: 次期中期経営計画は有報提出時点で「現在精査を行っております」とされており、目標数値は書いていない。
- businessStructure: 単一セグメントのため事業は1つとし、【事業の内容】の主要取扱商品の商品区分（医薬品・化粧品・雑貨・一般食品）を children にした。並び順はMD&Aの商品別売上高（2026年3月期）の大きい順で、金額は同表の印字どおりに書いた。
- businessStructure: 商品別売上高の合計283,555百万円は不動産賃貸収入を含まない販売実績ベースであり、連結売上高2,844億92百万円とは一致しない。children の金額は商品別売上高としての印字である。
- businessStructure: 店舗数386店舗（うち調剤併設160店舗）はMD&Aの印字どおり（2026年3月15日現在）。
- history: 沿革表は年月と事項が対応して印字されており、そのまま使った。1960年の創業は沿革の前文の印字どおり。月は成果物の形に合わせて説明に含めていない。
- history: 2006年の倉持薬局の完全子会社化の項目に、2014年3月の吸収合併（沿革表の別の行）を補足として書いた。
- industry: 主たる業界は、単一セグメントであるドラッグストア事業（小売業）から retail とした。
- industry: 医薬品の販売と処方箋調剤を行うが製造はしておらず小売が本体のため、pharmaceuticals は付けなかった。金額が独立して開示されていない事業に2つ目の業界は付けなかった。
- relatedCompanies: career（6198・キャリア）: 「キャリアアップセミナー」など一般語の部分一致のみで、有報は同社について取引・提携・資本関係を述べていないため結ばなかった。
- relatedCompanies: port（7047・ポート）: 「子育てサポート企業」認定の文脈など一般語の部分一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: nissin（9066・日新）: コードリストになく ambiguous。新株予約権の行使期間の表記などへの断片的な一致で、同社との関係を示す記述はないため結ばなかった。
- relatedCompanies: freee（4478・フリー）: 「バリアフリー型」という店舗形態の表現への部分一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: land（8918・ランド）: 「プライベートブランド」の表現への部分一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: mebuki-financial-group（7167・めぶきフィナンシャルグループ）: 政策保有株式として保有しているが、保有目的は「円滑な金融取引のため」とされており、金融取引を理由とする銀行は関連企業にしないため結ばなかった。
- relatedCompanies: ray（4317・レイ）: ambiguous。「シンプルなレイアウト」など一般語の部分一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: space（9622・スペース）: 「一台あたりの駐車スペース」など一般語の部分一致のみで、同社についての記述はないため結ばなかった。
- relatedCompanies: the-tochigi-bank（8550・栃木銀行）: 政策保有株式として116,000株を保有しているが、保有目的は「円滑な金融取引のため」とされており、金融取引を理由とする銀行は関連企業にしないため結ばなかった。
- relatedCompanies: trust（3347・トラスト）: コードリストになく、大株主名簿の「日本マスタートラスト信託銀行（信託口）」の名称への部分一致である。信託口は純投資の名義であり結ばなかった。
- relatedCompanies: 連結子会社の株式会社横浜ファーマシー（議決権の所有割合100％）は未上場で、related-candidates.json に含まれていないため結ばなかった。親会社はない。
- terms: 登録候補（助言のみ）: メガ・ドラッグストア（売場面積400坪以上のドラッグストアの当社の定義。通常のドラッグストアの定義である90坪以上より大型）、ファーマシー・モア（「医薬品にとどまらない、多種多様な商品を提供することによりお客様の健康で快適な生活を実現する」という当社のコンセプト）、調剤薬局併設型ドラッグストア（処方箋調剤を行う調剤薬局を併設した店舗形態）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
