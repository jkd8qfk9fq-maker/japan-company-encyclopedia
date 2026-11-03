# 八十二長野銀行 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社八十二長野銀行 |
| 証券コード | 8359 |
| docID（データを取り出した文書） | `S100YAUN` |
| 原本 docID | `S100YAUN` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAUN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社八十二長野銀行 / 8359 / docID S100YAUN（id は英語表記「Hachijuni Nagano Bank, Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hachijuni-nagano-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社八十二長野銀行 有価証券報告書－第143期(2025/04/01－2026/03/31) (docID S100YAUN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第142期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第142期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
hachijuni-nagano-bank: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社八十二長野銀行(旧会社名　株式会社八十二銀行)」が EDINET の提出者名「株式会社八十二長野銀行」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから2026年3月期。売上は経常収益（連結経常収益）、純利益は親会社株主に帰属する当期純利益。
- businessModel: 「長野県を中心に」は、設備表で本店ほか135店が長野県にあることと沿革から。顧客層の細かい説明は有報の印字がないため書いていない。
- businessModel: 訂正有価証券報告書（第142期）が提出されているが、brief.mdの修正再表示チェックでは前期との重複年度は全て一致。
- businessStructure: name は表紙の社名から「株式会社」を除いた。表紙は旧会社名八十二銀行を併記している（2026年1月1日に長野銀行を吸収合併して商号変更）。
- businessStructure: 事業の並びは外部顧客に対する経常収益の大きい順（銀行業263,251、リース業39,065）。「その他」は有報が報告セグメントに含まれないと書く区分なので最後。
- businessStructure: 経常収益は一般企業の売上高に代えた表記（有報の注記）。セグメント利益・資産などは本文に書いていない。
- businessStructure: 関係会社の状況に「その他２社」とあるが社名は印字がないため書いていない。
- history: 沿革表の「2006年4月2008年6月」は年月が2つ続けて印字され、事象も2つ（八十二証券の完全子会社化、銀行本体でのカード発行開始）。数が同じなので行順で対応づけると2006年4月が証券の完全子会社化、2008年6月がカード発行開始になる。証券の完全子会社化は他の節で日付を確認できないため、沿革には載せていない。2008年6月のカード発行は行順の対応による。
- history: 1931年の資本金の金額は書いていない（資本金の金額は本文に書かない規則）。
- history: 省いた行：1962〜2005年の業務開始・認可の各行、1983〜2005年のその他の子会社設立、2015年・2023年3月と10月・2025年4月と10月の子会社関連の行など。
- industry: 銀行業が経常収益の大半を占めるため金融のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業との同一性を確認できないため、結ばなかった。
- relatedCompanies: 静岡銀行：有報が2025年3月の包括業務提携（富士山・アルプス アライアンス）を述べているが、候補ファイルに無く同一性を確認できない。
- relatedCompanies: 山梨中央銀行：同上。
- relatedCompanies: 子会社（八十二証券・八十二リースなど）は上場企業ではない（有報提出会社なし）ため結ばない。
- terms: 助言：経常収益（一般企業の売上高に相当）、吸収合併、包括業務提携、信用保証、債権管理回収が用語候補。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
