# 髙松コンストラクショングループ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社髙松コンストラクショングループ |
| 証券コード | 1762 |
| docID（データを取り出した文書） | `S100YDDS` |
| 原本 docID | `S100YDDS` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDDS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社髙松コンストラクショングループ / 1762 / docID S100YDDS（id は英語表記「TAKAMATSU CONSTRUCTION GROUP CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takamatsu-construction-group: 10 件の数値を有報XBRLと照合
有報: 株式会社髙松コンストラクショングループ 有価証券報告書－第61期(2025/04/01－2026/03/31) (docID S100YDDS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
takamatsu-construction-group: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 変則決算・会計基準の変更はないため financialNotes は書かなかった。brief の「財務諸表の組替え」の注意は、その他の包括利益の組替調整額の記載で、売上・純利益の範囲には関わらないと判断した。
- businessModel: perspectives は有報の事実から言える範囲が限られるため省いた。
- businessStructure: 事業は【セグメント情報】の外部顧客への売上高の順（建築172,838／土木100,736／不動産84,100）。
- businessStructure: 「その他事業」（建築資金融資、蓄電所の電気事業）は報告セグメントではないため事業に立てなかった。
- businessStructure: listings の market は表紙が「東京証券取引所プライム市場」と印字。
- businessStructure: shortNameEn は表紙の英訳名から CO., LTD. を落とした。
- history: 沿革は主な出来事に絞った。小さな社名変更・合併・子会社の設立などは省いた。
- industry: 建築・土木で売上の大半を占めるため建設のみ。不動産事業は報告セグメントだが売上の4分の1弱のため、業界は足さなかった。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業の候補がないため、結ばなかった。
- relatedCompanies: 子会社（髙松建設、青木あすなろ建設など）と持分法適用関連会社（TPG関連のLLC）は、いずれも上場企業ではないため結ばなかった。
- terms: 用語の追加候補: 持株会社（事業会社の株式を持ち、グループを束ねる会社）、法面保護（斜面の崩れを防ぐ工事）、地盤改良、海洋土木、特定上場会社等（連結ベースでインサイダー取引規制の軽微基準を判断する会社）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
