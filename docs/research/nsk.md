# 日本精工 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本精工株式会社 |
| 証券コード | 6471 |
| docID（データを取り出した文書） | `S100YFE3` |
| 原本 docID | `S100YFE3` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFE3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本精工株式会社 / 6471 / docID S100YFE3（id は英語表記「NSK Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nsk: 10 件の数値を有報XBRLと照合
有報: 日本精工株式会社 有価証券報告書－第165期(2025/04/01－2026/03/31) (docID S100YFE3)
前期有報との比較: 20 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nsk: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] history[1].significance: 売上高と当期純利益以外の利益に触れていないか確認する（…0％を超える会社として、有報に個別の損益が載っています。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と親会社の所有者に帰属する当期利益は brief.md の印字ラベルどおり（IFRSの有報）。営業利益・税引前利益・セグメント利益は本文規則により書いていない。
- businessModel: 売上高の増加の理由は、この工程では md-and-a.txt を読んでおらず書いていない（ステアリング事業の連結化が増収に寄与している点は、セグメントの売上高から読めるが、理由としては断定していない）。
- businessModel: 従業員数26,278人は表の印字ラベル「従業員数[ほか、平均臨時雇用者数]」の本体の数値。臨時雇用者数は brief.md に無いため書かない。
- businessModel: 「売上高が10％以上の相手先がない」は【主要な顧客に関する情報】の記述。
- businessModel: perspectives（戦略・強み）は書いていない。
- businessStructure: 並び順は【セグメント情報】の外部顧客への売上高（自動車403,304／産業機械377,491／ステアリング100,554／その他30,294百万円）。「その他」は報告セグメントに含まれない区分なので末尾。
- businessStructure: ステアリング事業は2025年9月1日の支配獲得後に報告セグメントに追加され、前期の外部顧客への売上高欄は「－」。前期以前のステアリング関連会社の持分法投資利益は自動車事業から組み替えて表示されている（利益は本文に書いていない）。
- businessStructure: セグメント利益・営業利益・持分法損益・負ののれん発生益などは本文規則により書いていない。
- businessStructure: 地域別の製造会社の事業対応は【事業の内容】の表の列に従った。表の「主要製造会社」は事業ごとの列挙で、会社と事業の個別の結びつきは関係会社の状況の「主要な事業の内容」で確認できるものだけ（NSKマシナリー=機械設備、天辻鋼球=鋼球）を結びつけた。
- businessStructure: Wikipediaは使っていない（有報で足りるため）。
- history: 沿革表は1916年から2025年10月まで約50行あり、事業の変わり目になる出来事を選んだ（工場の竣工や拠点の設立の大半は省いた）。
- history: 2026年5月のNTN株式会社との基本合意は沿革表にはなく、【重要な契約等】と後発事象の注記から採った。提出後も続く予定の段階なので「予定」と書き、needsReview に入れた。関連企業（relatedCompanies）としては結ばず、出来事としてのみ扱った。
- history: 2023年8月の持分法移行後の議決権（JIS50.1％・当社49.9％）は【企業結合】の注記から採った。
- industry: 主な業界は、軸受（ベアリング）という機械部品を中心にする点から machinery にした。報告セグメントの外部顧客への売上高は自動車403,304百万円が最大で産業機械377,491百万円が次ぐが、自動車事業の製品（ハブユニット軸受・ニードル軸受など）も軸受で、ステアリング事業と合わせて自動車メーカー向けの部品でもあるため、automotive を2つ目に置いた。
- industry: automotive を主にするか machinery を主にするか迷う会社。自動車事業とステアリング事業の外部顧客への売上高の合計（503,858百万円）は連結売上高911,644百万円の半分あまりで、売上の大半が自動車向けとも読める。「売上の大半を占める報告セグメントで決める」規則に厳密に従うなら automotive が主になりうるが、会社自身は『軸受メーカー』であり、自動車事業の製品も軸受と自動変速機用部品なので、事業の本質を優先して machinery とした。人が見直す余地はあるが、分類の不足ではないので taxonomyGaps や needsReview には入れていない。
- industry: semiconductors は付けない。有報に半導体向けの部品や装置を事業として開示している箇所は見当たらない。
- relatedCompanies: NTN（6472）: 経営統合の基本合意書の締結（2026年5月12日付）が有報にあるが、統合は提出日時点で完了しておらず資本・取引の関係はまだない。経営統合は関係ではなく history の出来事なので結ばず、history に予定として書いた。
- relatedCompanies: 日本トムソン・オークマ・牧野フライス製作所・日伝: 政策保有株式の表に載る産業機械事業関連の取引先だが、取引の向き・内容が印字されておらず、保有目的の定型句のみ。結ばない。
- relatedCompanies: いすゞ自動車・SOMPOホールディングス・東京建物・群馬銀行・滋賀銀行・みずほフィナンシャルグループ・三菱UFJフィナンシャル・グループ・横浜フィナンシャルグループ・ニデック・大成建設・JR東海: 政策保有株式または金融取引の表に載るだけで、取引関係の記述がない。結ばない。
- relatedCompanies: SBSホールディングス: NSKロジスティックスの一部株式の譲渡先という過去1回限りの取引。持分法適用会社SBS NSKロジスティクス㈱は関連会社だが related-candidates.json にその会社自体がなく、結ばない。
- relatedCompanies: ブイ・テクノロジー: 2015年のNSKテクノロジー株式の譲渡先という過去1回限りの取引。結ばない。
- relatedCompanies: 東京精密: 候補は『東京精密器具製作所』（持分法適用会社）との名称の部分一致で、別の会社。結ばない。
- relatedCompanies: コア・エン・キャリア・ポート・ランド・ビジョン・ステップ・鈴木・パス・ゼロ・地主・セキ・キング・トルク・トラスト・ベース・ハブ・イノベーション・あらた・高速・リード・レイ・リックス・スペース・信和・高島: 一般語・別会社名との偶然の一致で、有報がその会社について述べたものではない。結ばない。
- relatedCompanies: 持分法適用会社・連結子会社はいずれも related-candidates.json に無い（非上場または未掲載）ため結べない。
- terms: 用語の追加候補（助言のみ）: 軸受（ベアリング）、ボールねじ、リニアガイド、ハブユニット軸受、状態監視システム、電動パワーステアリング、持分法適用会社、非継続事業、共同株式移転。既存の用語 id は確認していないので、登録の有無は人が確認してください。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません
- history: 2026年5月12日付のNTN株式会社との経営統合の基本合意書の締結は、有報提出日時点で統合が完了しておらず、その後の進展（最終契約・株主総会の承認・統合の完了）が有報からは分からない。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
