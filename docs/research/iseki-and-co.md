# 井関農機 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 井関農機株式会社 |
| 証券コード | 6310 |
| docID（データを取り出した文書） | `S100XTT5` |
| 原本 docID | `S100XTT5` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTT5.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E4%BA%95%E9%96%A2%E8%BE%B2%E6%A9%9F

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 井関農機株式会社 / 6310 / docID S100XTT5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
iseki-and-co: 10 件の数値を有報XBRLと照合
有報: 井関農機株式会社 有価証券報告書－第102期(2025/01/01－2025/12/31) (docID S100XTT5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
iseki-and-co: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 在外子会社の収益及び費用の換算方法の変更は、影響額が軽微であるため遡及適用を行っておらず、修正再表示チェックも重複年度の全行で一致したため、financialNotes には追加していません。
- businessModel: プロジェクトＺの数値目標（営業利益率・ROE・DOE・PBR）は投資の語のため、本文には書いていません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項なし」です。
- businessModel: 2025年5月9日の公正取引委員会からの下請法に基づく勧告は、取引適正化の取り組みとして有報に記載されていますが、事業の説明ではないため本文には書いていません。
- businessStructure: 製品別の販売実績の合計は185,767百万円で、連結売上高185,770百万円と3百万円の差がありますが、有報の丸めによるもので、印字の金額をそのまま記載しています。
- businessStructure: 単一セグメントのため、事業は農業関連事業の1つで、children には販売実績の製品区分を使いました。
- history: 2025年12月の㈱ISEKI M&D熊本工場の生産終了は、沿革の15件の制約のため入れていません。
- history: 工場の建設・統合や販売会社の設立・合併の行は、会社の転換点となるものを優先して選び、残りは入れていません。
- history: 設立時の資本金は規則により記載していません。
- industry: 農業機械の製造・販売が主たる事業のため、機械を主たる業界としました。単一セグメントのため、2つ目の業界は付けていません。
- relatedCompanies: カヤバとNOKは、特定投資株式の表に保有目的の印字がありますが、related-candidates.json にないため結んでいません。
- relatedCompanies: いよぎんホールディングス、ひろぎんホールディングス、みずほフィナンシャルグループ、三井住友トラストグループは、安定的かつ継続的な金融取引が保有目的のため結んでいません。MS＆ADインシュアランスグループホールディングスは、損害保険取引が保有目的のため結んでいません。
- relatedCompanies: NIPPON EXPRESSホールディングスと第一生命ホールディングスは、当事業年度中に全株式を売却済みのため結んでいません。
- relatedCompanies: 連結子会社14社はすべて非上場のため、子会社として結んでいません。
- relatedCompanies: 大株主の状況に載る事業会社は、信託銀行・銀行・持株会・農林中央金庫・伊予銀行のみで、major-shareholder として結べる相手はありませんでした。
- relatedCompanies: seki・en・vision・land・port・king・systems-engineering-consultants・career・innovation・zero・core・cover・crooz・nissin・rent・will は語の断片一致のみのため結んでいません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
