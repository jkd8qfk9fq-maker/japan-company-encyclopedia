# ウルトラファブリックス・ホールディングス — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ウルトラファブリックス・ホールディングス株式会社 |
| 証券コード | 4235 |
| docID（データを取り出した文書） | `S100XU4V` |
| 原本 docID | `S100XU4V` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU4V.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | ウルトラファブリックス・ホールディングス株式会社 / 4235 / docID S100XU4V |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
ultrafabrics-holdings: 10 件の数値を有報XBRLと照合
有報: ウルトラファブリックス・ホールディングス株式会社 有価証券報告書－第61期(2025/01/01－2025/12/31) (docID S100XU4V)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ultrafabrics-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意「本文に非継続事業の記載がある」について、該当箇所は会計方針におけるIFRS第5号「売却目的で保有する非流動資産及び非継続事業」への言及のみで、非継続事業そのものの計上はなく金額への影響もないため、financialNotesとneedsReviewには入れていません。
- businessModel: 目標とする経営指標は売上収益、EBITDA、自己資本利益率と印字され、中期経営計画の目標値も開示されていますが、投資指標・目標値に当たるため本文とperspectivesには記載せず、ここに記録します。
- businessModel: 受注実績と受注残高の金額は本文に記載していません。
- businessModel: suppliersはこのツリーの旧スキーマのため省略しました。MD&Aにはアウトソーシング生産の増加が印字されていますが、外部委託先の名称の開示はありません。
- businessModel: industryPositionは、順位や市場シェアの印字がないため記載していません。
- businessStructure: 報告セグメントは単一（ポリウレタンレザー製品製造及び販売事業）のため、【事業の内容】の用途区分を children としました。用途別の売上収益はMD&Aの用途別の売上収益の概況の印字（億と百万円の併記）どおりに記載しています。4区分の合計20,552百万円と連結売上収益20,553百万円との1百万円差は、印字の丸めによるものです。
- businessStructure: 【主要な設備の状況】では第一化成株式会社の埼玉事業所・群馬工場・千代田工場がポリウレタンレザー製造設備として印字されていますが、用途別の設備対応は印字されていないため、特定の子区分には結びつけていません。帳簿価額は書いていません。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略しました。製造は連結子会社の第一化成株式会社が担う旨を事業の説明に記載しています。
- history: 沿革は年月で印字されていますが、年単位に集約し、月は記載していません。
- history: 沿革に印字された資本金額（1998年の株式会社ディー・エス・シー設立時の資本金など）は記載していません。
- history: 2025年11月に研究所を閉鎖し技術部を行田工場及び群馬工場へ移転した旨が沿革に印字されていますが、事業の転機ではないため項目にはしていません。
- industry: 主たる業界は、ポリウレタンレザー（合成皮革）の製造・販売に基づき chemicals としました。EDINETコードリストの提出者業種も「化学」です。閉じた分類に合成皮革そのものの区分は無く、製造業としての性質から最も近い chemicals を用いたため、新規の taxonomyGaps は記録していません。
- relatedCompanies: 証拠パックに関連候補ファイル（related-candidates.json）が生成されておらず、有報本文から機械抽出された掲載済み企業の候補が提示されていないため、関連リンクは結んでいません。
- relatedCompanies: Saltillo Lamination S.A de C.V：主要な販売先で、2025年12月期の販売実績は売上収益の17.3％を占めますが、メキシコの会社で掲載対象の上場会社ではないため結んでいません。顧客であることは businessModel の flow に記載しました。
- relatedCompanies: 大日精化工業株式会社：【大株主の状況】に所有株式数の割合3.19％（2025年12月31日現在）で載る事業会社ですが、有報に取引・提携などの関係の記載がなく、候補ファイルにも無いため結んでいません。
- relatedCompanies: 白石カルシウム株式会社：【大株主の状況】に所有株式数の割合2.79％（2025年12月31日現在）で載る事業会社ですが、同様に関係の記載がないため結んでいません。
- relatedCompanies: 株式会社みずほ銀行、株式会社りそな銀行、株式会社きらぼし銀行：【大株主の状況】に載る金融機関で、純投資の保有と判断し結んでいません。
- relatedCompanies: 東京中小企業投資育成株式会社：【大株主の状況】の筆頭株主（12.83％）ですが、投資育成会社による保有であり事業上の関係の記載がないため結んでいません。
- relatedCompanies: 第一化成株式会社、Ultrafabrics Inc.などのグループ会社は、自社の子会社・持分法適用関連会社であるため対象外です。
- terms: ポリウレタンレザー：ポリウレタンを用いた合成皮革で、当社グループの主力製品です。家具、自動車、航空機の内装材などに使われます（【事業の内容】に印字）。用語集への登録を提案します。
- terms: コントラクト家具：ホテル、レストラン、劇場などの施設で使われる家具を指します（【事業の内容】に印字）。用語集への登録を提案します。

## 要確認（status に反映）

- businessModel: 2023年4月1日付で普通株式1株につき2株の割合で株式分割を行いました。連結経営指標等の株式数に係る指標は、第57期（2021年12月期）の期首に当該株式分割が行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
