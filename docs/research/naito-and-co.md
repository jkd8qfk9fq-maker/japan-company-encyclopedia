# ＮａＩＴＯ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＮａＩＴＯ |
| 証券コード | 7624 |
| docID（データを取り出した文書） | `S100Y4MW` |
| 原本 docID | `S100Y4MW` |
| 提出日（原本） | 2026-05-19 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y4MW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＮａＩＴＯ / 7624 / docID S100Y4MW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
naito-and-co: 10 件の数値を有報XBRLと照合
有報: 株式会社ＮａＩＴＯ 有価証券報告書－第75期(2025/03/01－2026/02/28) (docID S100Y4MW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
naito-and-co: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社NaITO」が EDINET の提出者名「株式会社ＮａＩＴＯ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、販売の状況に百万円で印字された売上高43,518百万円と取扱商品分類別の金額、連結経営指標等に印字された当期純利益284百万円をそのまま使った。分類別の単純合計は43,517百万円で印字合計と1百万円異なる点はbusinessStructure工程のwarningsにも記録した。
- businessModel: 連結経営指標等の注記に基づき、収益認識に関する会計基準等の遡及適用を2022年2月期のfinancialNotesに、法人税等に関する会計基準等の遡及適用を2025年2月期のfinancialNotesに記録した。前期有報との修正再表示チェックでは全項目に差異はなかった。
- businessModel: 中期経営計画「共創ビジョン2030」の数値目標（最終年度の売上高と利益指標）は、利益指標を含む将来目標のため本文には転記していない。
- businessModel: 重要な後発事象は、連結・個別とも該当事項なしと印字されている。
- businessModel: 親会社や連結子会社、関連会社の資本金の金額は本文には書いていない。
- businessModel: 本社は本社建替えのため一時移転中であり、最寄りの連絡場所は東京都台東区、登記上の本店所在地は東京都北区である。flowでは所在地に触れていない。
- businessStructure: 単一セグメントのため、事業は1つとし、取扱商品分類（切削工具、産業機器・工作機械等、計測）をchildrenにした。並びは販売実績の大きい順とした。
- businessStructure: 取扱商品分類別の販売実績は、経営成績の分析の販売の状況に百万円で印字された金額（切削工具22,311百万円、産業機器・工作機械等17,280百万円、計測3,926百万円）をそのまま使った。各分類の単純合計は43,517百万円で、印字された合計43,518百万円とは1百万円の差があるため、合計は印字どおり43,518百万円とした。
- businessStructure: グループ4社のうち藤中工具（上海）有限公司は、影響が軽微で重要性がないため持分法の適用範囲から除外されている関連会社である旨が注記に印字されている。
- businessStructure: 本社は本社建替えのため、登記上の本店所在地（東京都北区）から一時移転しており、最寄りの連絡場所は東京都台東区である。事業の説明では所在地に触れていない。
- businessStructure: Wikipediaは補足に使っていない。事業の内容は有報の記載で足りるためである。
- history: 設立時・増資時の資本金や出資金の金額は、沿革の本文には書いていない。
- history: 支店・出張所・事務所の開設や物流センターの移転などの細目は、事業の転機となるものを除き省いた。ISO14001認証の取得も省いた。
- history: 2013年9月の株式分割と単元株式数の変更は、沿革の本文には収録していない。
- history: 2023年11月の管理部門の一時移転と2024年1月の営業部門の一時移転は、本社建替えに伴う一連の移転として2023年の行にまとめて書いた。
- industry: 主たる業界は商社とした。機械工具卸を目的として設立され、切削工具、計測、産業機器、工作機械等の販売を単一セグメントで行う専門商社であり、製造は行っていないためである。取扱商品が機械分野でも、機械は付けていない（杉本商事の先例と同じ判断）。
- relatedCompanies: okaya-and-co、岡谷鋼機株式会社: 【関係会社の状況】に親会社として印字され、議決権の所有割合45.65％（2026年2月28日現在）、役員兼任、物流センターの賃借、商品の売買があるためparentとして結んだ。
- relatedCompanies: union-tool、kyocera、nachi-fujikoshi、nitto-kohki: 【大株主の状況】に事業会社の大株主として氏名・住所・所有株式数・割合が印字されているためmajor-shareholderとして結んだ。いずれも関係会社の4区分には当たらない。
- relatedCompanies: dijet-industrial、ダイジェット工業株式会社: 特定投資株式の保有目的が全銘柄共通の定型文（当社の仕入先として営業上の取引関係の維持・強化）のみで、大株主にも載っていないため結ばなかった。同じ定型文のみの株式会社不二越とＴＯＮＥ株式会社についても、仕入先としては結んでいない（不二越は大株主としてのみ結んだ）。
- relatedCompanies: 株式会社タンガロイ（大株主、5.15％）、ＳＭＣ株式会社（大株主、1.41％）、ＢＩＧ ＤＡＩＳＨＯＷＡ株式会社（大株主、2.56％）は、related-candidates.jsonに無いため結ばなかった。
- relatedCompanies: vision、seki、en、land、nissin: 一般的な語やビル名などとの一致のみで、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: 連結子会社のNAITO VIETNAM CO.,LTD.、持分法適用関連会社のSOMAT Co.,Ltd.、持分法適用外の関連会社の藤中工具（上海）有限公司は、当社グループの会社であるため関連企業のリンク対象にはしなかった。
- terms: 助言: 用語『エンドミル』は、金属などを削る切削工具の一種です。当社のオリジナルブランド「Victoryエンドミル」の商品名として登場します。
- terms: 助言: 用語『流れ品』と『スポット品』は、中期経営計画「共創ビジョン2030」の重点課題で使われる当社の区分です。流れ品は在庫・システムを基盤とした販売、スポット品は狙って獲る営業スタイルへの進化と結び付けて説明されています。
- terms: 助言: 用語『校正』は、計測機器が正しく測れているかを確認し調整することです。当社は計測の分野で検査・校正ビジネスの拡大に取り組んでいます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
