# 千葉銀行 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社千葉銀行 |
| 証券コード | 8331 |
| docID（データを取り出した文書） | `S100YDSE` |
| 原本 docID | `S100YDSE` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDSE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社千葉銀行 / 8331 / docID S100YDSE（id は英語表記「The Chiba Bank, Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-chiba-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社千葉銀行 有価証券報告書－第120期(2025/04/01－2026/03/31) (docID S100YDSE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-chiba-bank: 本文の金額 0 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額を印字どおりに引用できる箇所が経常収益・当期純利益の表だけだったため、本文には金額を書かず『前期より増えた』という方向だけを書いた（5年表: 経常収益362,179→445,037百万円、当期純利益74,259→94,063百万円）。
- businessModel: financialNotes は変則決算・会計基準変更が無いため空。
- businessModel: 収益の内訳（資金運用収益・役務取引等収益など）は金額を書かない方針のため、収益源は一般的な区分にとどめた。
- businessStructure: 銀行業の単一セグメントで、セグメント別・会社別の売上高は印字されていない。並びは売上順にできないため、事業系統図の記載を機能ごとに束ねて並べた（金額は書かない）。
- businessStructure: 拠点数（本支店164など）は事業系統図の印字。基準日は印字されていないため日付は添えていない。
- businessStructure: ちばぎん証券とエッジテクノロジー等の連結・持分法の区分は【関係会社の状況】の見出し（連結子会社／持分法適用子会社）に従った。
- history: 沿革表の末尾は日付4つ（2014年9月9日・2024年4月1日・2024年10月30日・2025年1月7日）と事象4つが分かれて印字された崩れた表。数が同じなので行順で対応づけた（バンコク駐在員事務所開設／ちばぎんカードの吸収合併／エッジテクノロジー取得／シンガポール支店開設）。2024年4月1日の吸収合併は表の中ほど（ちばぎんカード社名変更の注記）でも裏付けられる。
- history: 2014年のバンコク駐在員事務所開設、1944年の合併・営業継承、1959年以降の各子会社設立などは重要度で選び、掲載を省いた。
- history: 2027年4月1日の共同持株会社設立は提出後に控える予定のため、完了とは書かず『予定』と記した。
- industry: 銀行業の単一セグメントのため、業界は金融のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性の機械確認ができないため、関連企業は結ばなかった。
- relatedCompanies: 千葉興業銀行: 経営統合契約（共同持株会社の設立は2027年4月1日予定）は関係ではなく history の出来事。親会社・子会社などの資本関係は現時点で無く、候補ファイルでの同一性確認も未了。
- relatedCompanies: 武蔵野銀行（千葉・武蔵野アライアンス）、横浜フィナンシャルグループ（千葉・横浜パートナーシップ）、第四北越フィナンシャルグループ・群馬銀行（TSUBASAアライアンス）: 業務提携の記載はあるが、候補ファイルでの同一性確認が未了のため見送り。候補ファイルを作れば business-partner で結べる見込み。
- relatedCompanies: 子会社15社は未上場のため結ばない。政策保有株式の取引先（マツキヨココカラ、イオン、キッコーマン等）は保有目的が定型句のため結ばない。
- terms: 用語集への追加候補（助言のみ）: 経常収益（銀行の売上高に当たる収益）、共同株式移転、銀行持株会社、TSUBASAアライアンス。

## 要確認（status に反映）

- history: 千葉興業銀行との経営統合（共同持株会社ちばフィナンシャルグループの設立は2027年4月1日予定、株主総会の承認と関係当局の認可等が前提）。提出後の予定事項のため、実現の状況を確認すること。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
