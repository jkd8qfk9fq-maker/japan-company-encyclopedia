# すかいらーくホールディングス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社すかいらーくホールディングス |
| 証券コード | 3197 |
| docID（データを取り出した文書） | `S100XUBI` |
| 原本 docID | `S100XUBI` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUBI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社すかいらーくホールディングス / 3197 / docID S100XUBI（id は英語表記「SKYLARK HOLDINGS CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
skylark-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社すかいらーくホールディングス 有価証券報告書－第15期(2025/01/01－2025/12/31) (docID S100XUBI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
skylark-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEI（2025-12-31、第15期）から「2025年12月期」。
- businessModel: 売上収益4,577億94百万円・前年比566億64百万円増・前年比14.1％（MD&Aの販売実績表の114.1）、当期利益は5年表の16,748百万円を167億48百万円と書いた（有報の他の箇所の億円表記に合わせた換算）。本文に利益は純利益だけを書いた。
- businessModel: 『海外の子会社へのブランドのライセンス』は事業の内容と関係会社の状況の印字（ライセンス契約・商標等の使用許諾）。グループ内の取引で、金額は書かれていない。
- businessModel: ブランド別の売上は本文に読み取っていないので、書いていない。
- businessStructure: 決算期は表紙のDEI（当事業年度終了日 2025-12-31、第15期）から「2025年12月期」。会計基準はIFRS。上場市場は表紙の「東京証券取引所プライム市場」から「プライム」。
- businessStructure: 報告セグメントは「レストラン事業」のみ（セグメント注記）。レストラン事業の売上収益4,473億79百万円とその他104億15百万円はMD&Aの印字（合計は457,794百万円と一致）。『その他』は事業の内容の記載上の区分で、報告セグメントではないため最後に置いた。
- businessStructure: children は報告セグメントの内訳ではなく、事業の内容(1)の会社別の紹介。会社別・ブランド別の売上金額は有報の本文（事業の内容）に印字がないので書いていない（ブランド別販売実績の表は読み取っていない）。
- businessStructure: 海外の会社の店舗数（台湾89、マレーシア7と17、米国2）は事業の内容の印字。国内の会社別の店舗数は書いていない。
- businessStructure: セグメント利益・営業利益などの利益は本文に書いていない。
- history: 有報の沿革は、ことぶき食品有限会社の設立から書かれている。現在の当社は2011年2月に設立され、2014年7月に旧すかいらーく④を吸収合併して事業を承継した（沿革の冒頭の説明）。
- history: 旧社名が何度も入れ替わる複雑な合併の経緯（BCJホールディングス6・5など）は、2014年の項目に最小限だけ書いた。
- history: 2012年の株式会社小僧寿し本部の売却、2005〜2006年のトマトアンドアソシエイツの取得などの項目は、紙幅の都合で省いた。
- industry: 報告セグメントはレストラン事業のみ（売上収益4,473億79百万円、連結の大部分）。外食に当てはまる区分が無いため、最も近い food を暫定で選び taxonomyGaps に書いた。
- industry: 2つ目の業界は付けていない。その他（洋菓子・惣菜販売、配送、清掃・保守）は報告セグメントではない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業との照合ができない。そのため関連企業は空にした。
- relatedCompanies: 【関係会社の状況】の連結子会社（すかいらーくレストランツ、ニラックス、トマトアンドアソシエイツ、資さん、雲雀國際、SKYLARK USA、SKYLARK MALAYSIA、Createries Consultancy、Sukiya各社、フロジャポン、ジャパンカーゴ、すかいらーくD＆M）は、有報が『有価証券届出書又は有価証券報告書を提出している会社はありません』と書くので、上場の相手ではなく結べない。
- relatedCompanies: 親会社・その他の関係会社の欄は無い。大株主は読んでおらず、事業会社の大株主は結んでいない。
- relatedCompanies: 沿革に出る株式会社小僧寿し本部（現KOZOホールディングス）は2012年に全株式を売却した過去の出来事で、現在の関係は書かれていないので結ばない。
- terms: 助言のみ。あると読みやすい用語：持株会社、IFRS（既存の用語があれば）、セグメント、フランチャイズ、ブッフェ、ムスリム向け（ハラル）。本文にはリンクを張っていない。
- terms: 用語が src/data/terms/ にあるかは確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] すかいらーくホールディングス（ファミリーレストランを国内外で運営する持株会社）の業界 → 提案: 外食（飲食店チェーン・フードサービス）。報告セグメントのレストラン事業が連結の大部分を占め、料理を店で提供する外食にあたる。閉じた分類に外食が無く、food は食品メーカーが中心のため暫定。
