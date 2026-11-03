# TOYO TIRE — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＴＯＹＯ　ＴＩＲＥ株式会社 |
| 証券コード | 5105 |
| docID（データを取り出した文書） | `S100XTYE` |
| 原本 docID | `S100XTYE` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTYE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＴＯＹＯ　ＴＩＲＥ株式会社 / 5105 / docID S100XTYE（id は英語表記「Toyo Tire Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toyo-tire: 10 件の数値を有報XBRLと照合
有報: ＴＯＹＯ　ＴＩＲＥ株式会社 有価証券報告書－第110期(2025/01/01－2025/12/31) (docID S100XTYE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
toyo-tire: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「TOYO TIRE株式会社」が EDINET の提出者名「ＴＯＹＯ　ＴＩＲＥ株式会社」と違います
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…中期経営計画「中計’26」を軸に、高利益体質を保つ方針です。…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes に書くべき変則決算・会計基準の変更はなく、空にした。
- businessModel: ブランド名 NITTO は有報の Nitto Tire U.S.A. Inc. と「NITTO TERRA GRAPPLER」の記載による。
- businessStructure: 「その他」は報告セグメントに含まれない事業セグメントで、事業内容と金額が独立して読み取れないため businesses に入れていない。
- businessStructure: 有報の事業の内容では、東洋ゴム化工品㈱・TOYO TIRE リファイン㈱の主要な事業は関係会社表で「その他」。事業の内容の表では東洋ゴム化工品㈱を自動車部品事業の国内製造・販売会社に載せているため、その記載に従った。
- history: 沿革は表の崩れがなく、年月と事象が対応している。1979年の日東タイヤとの提携、2008年のブリヂストンとの業務提携などは省いた（選別のため）。
- history: 三菱商事への新株発行は沿革では2018年11月の提携、払込みは2019年2月。重要な契約等の記載による。
- industry: 報告セグメントはタイヤ事業と自動車部品事業の2つで、どちらも自動車向けの製品のため automotive を主とした。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との照合を機械で確認できていない。三菱商事は src/data/companies/mitsubishi-corporation.json の存在と、有報の正式名称「三菱商事㈱」の一致で選んだ。
- relatedCompanies: ブリヂストン: 2008年5月の業務提携は「緩やかな提携」で、提携分野を選んだ後に協議・検討を始めるとあるだけ。取引・協業の具体的な事実が印字されていないため結ばなかった。
- relatedCompanies: 正新橡膠工業（台湾）: 洋新工業の合弁相手だが、上場企業としての掲載を確認できないため結ばなかった。
- terms: 用語集への追加候補: 市販用タイヤ（補修用に販売店で買うタイヤ）と新車用タイヤ（自動車メーカーが新車に装着するタイヤ）の違い、防振ゴム（エンジンや路面の振動を車体に伝えにくくするゴム部品）、ライトトラック用タイヤ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
