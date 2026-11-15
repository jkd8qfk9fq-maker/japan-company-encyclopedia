# ジャストシステム — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジャストシステム |
| 証券コード | 4686 |
| docID（データを取り出した文書） | `S100YHW4` |
| 原本 docID | `S100YHW4` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHW4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジャストシステム / 4686 / docID S100YHW4（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
justsystems: 10 件の数値を有報XBRLと照合
有報: 株式会社ジャストシステム 有価証券報告書－第45期(2025/04/01－2026/03/31) (docID S100YHW4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
justsystems: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: suppliers は空にしました。有報は当社グループの調達先について具体的な記載をしておらず、業種からの推定はしないためです。
- businessModel: 経営方針が重視する「1人当たりの営業利益額」の継続的な拡大と「継続的な増収増益」の目標は、利益指標であるため strategy の本文には転記せず、この warnings に記録します。
- businessModel: 金額はすべて有報の百万円印字どおりです（367億76百万円は MD&A の億・百万円併記印字のまま）。前期の市場別売上高は転記していません。
- businessModel: 会計方針の変更や修正再表示はなく（前期有報との照合で全系列一致）、financialNotes は空です。
- businessStructure: 単一セグメント（ソフトウエア関連事業）のため、セグメント情報の記載は有報で省略されています。children は MD&A の販売実績に印字された市場別区分（個人向け事業・法人向け事業）で、報告セグメントではありません。両区分の売上高の合計は連結売上高51,515百万円と一致します。
- businessStructure: 【関連情報】の製品・サービスごと情報、地域ごと情報、主要な顧客ごと情報はいずれも90％超の基準により記載が省略されています（国内の外部顧客への売上高が9割超、10％以上を占める顧客なし）。
- businessStructure: 調達先は businessModel 工程の担当であり、ここでは書いていません。
- history: 沿革の表は年月と事象が対応して印字されており、行順で対応づけました。2026年4月の米国向け「Smile Zemi」Pre-kindergarten Courseの提供開始は決算日後の月ですが製品発売であり構造変更ではないため、沿革の行としては2026年2月の行までを採用し、この件は warnings に留めました。
- history: 資本金の金額は沿革に書いていません（禁止される財務金額のため）。
- industry: ソフトウエア関連事業の単一セグメントであり、主たる業界は it（IT・ソフトウェア）です。
- relatedCompanies: hikari-tsushin（光通信）: 【大株主の状況】に1.31％の保有が印字されますが、同社グループの投資事業有限責任組合やノミニー口座を通じた投資保有が中心で、取引・提携の記載がないため結びませんでした。
- relatedCompanies: daiwa: 大株主表の常任代理人「大和証券」の名称一致のみで、相手先そのものではないため結びませんでした。
- relatedCompanies: base-4481: 製品名「UnitBase」の部分一致のため結びませんでした。
- relatedCompanies: seki: 本文中の一般語の部分一致（ambiguous）のため結びませんでした。
- relatedCompanies: port: 「ATOK Passport」等の部分一致のため結びませんでした。
- relatedCompanies: trust: 信託銀行の信託口の名称一致であり、コードリストにもないため結びませんでした。
- relatedCompanies: 特定投資株式及びみなし保有株式は「該当事項なし」と印字されており、保有株式を根拠とする候補はありません。
- terms: 助言: 用語「ATOK」は、当社が1982年に前身の「KTIS」を発表して以来続く日本語入力システムの名称です（沿革・事業の内容に印字）。
- terms: 助言: 用語「スマイルゼミ」は、当社グループのタブレット通信教育サービスの名称で、幼児から高校生までを対象とします（MD&Aに印字）。
- terms: 助言: 用語「一太郎」は、当社が1985年に発売した日本語ワープロソフトの名称です（沿革に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
