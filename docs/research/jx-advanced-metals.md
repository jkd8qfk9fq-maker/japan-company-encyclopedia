# ＪＸ金属 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＪＸ金属株式会社 |
| 証券コード | 5016 |
| docID（データを取り出した文書） | `S100YINW` |
| 原本 docID | `S100YINW` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YINW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＪＸ金属株式会社 / 5016 / docID S100YINW（id は英語表記「JX Advanced Metals Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jx-advanced-metals: 8 件の数値を有報XBRLと照合
有報: ＪＸ金属株式会社 有価証券報告書－第24期(2025/04/01－2026/03/31) (docID S100YINW)
前期有報との比較: 21 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
注意: 前期の窓に 訂正有価証券報告書－第23期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 非継続事業・財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
jx-advanced-metals: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「JX金属株式会社」が EDINET の提出者名「ＪＸ金属株式会社」と違います
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…術の差別化と市場創造で市場成長以上の利益成長を目指しています。基礎材料はベー…）

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・税引前利益・セグメント利益・総資産は本文に書いていない。
- businessModel: 10％以上の顧客の割合36.3％は【販売実績】の印字。
- businessModel: 2025年3月期以前の売上高の減少の理由は証拠パックで確認できないため本文に書かず、needsReview に入れた。
- businessStructure: 並び順は【セグメント情報】2026年3月期の外部顧客への売上高の順（基礎材料390,912 > 情報通信材料314,595 > 半導体材料176,565、百万円）。「その他」は報告セグメントでないため事業に入れていない。金額は百万円表のため本文に書かなかった。
- businessStructure: 情報通信材料の children に東邦チタニウム・タツタ電線を置いたのは、【事業の内容】の表でこのセグメントの事業会社として並ぶため。東邦チタニウムの完全子会社化は有報が2026年6月1日の株式交換効力発生と述べている（提出日は6月24日）。
- businessStructure: listings の market は表紙が『東京証券取引所プライム市場』と印字しているため記載。
- businessStructure: wikipedia.json は無く、Wikipedia は使っていない。
- history: 沿革は〔前史〕と〔提出会社設立以降〕の標準形で崩れはない。約40件から9件を採用し、事業の起点・提出会社の設立・上場・主要な買収に直結する出来事に絞った。
- history: カセロネス鉱山権益やパンパシフィック・カッパー株式の譲渡など個別の資本取引は省いた。2026年3月のカセロネス権益の譲渡決定は、完了が2026年4月で採用していない。
- industry: 主たる業界は2026年3月期の外部顧客への売上高が最大の基礎材料（銅の資源開発・製錬）で決めた。非鉄金属の区分が無く、素材系で最も近い chemicals を暫定にした。
- industry: semiconductors は、半導体用スパッタリングターゲットを主力とする半導体材料セグメントを報告セグメントとして開示しているため付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、関連企業は結ばなかった。
- relatedCompanies: ＥＮＥＯＳホールディングス: その他の関係会社だが、候補ファイルが無く同一性を確認できない。
- relatedCompanies: 東邦チタニウム・タツタ電線: 子会社だが、候補ファイルが無く同一性を確認できない。
- relatedCompanies: パンパシフィック・カッパー: 持分法適用会社かつ最大の販売先だが、同上。丸紅・三菱商事・双日・三井金属も同じ理由で結ばない。
- terms: 用語の助言: スパッタリングターゲット、圧延銅箔、フレキシブル回路基板（FPC）、銅製錬、グリーンハイブリッド製錬、IFRS が本文に出る語で、一般読者には説明が要る。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: 売上高が2024年3月期の1,512,345百万円から2025年3月期の714,940百万円へ約半減している。brief.md は修正再表示なしとするが、非継続事業・組替えの記載があり、理由を本文で確認できていない。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ＪＸ金属の主たる業界 → 提案: non-ferrous-metals（非鉄金属・素材）。銅の資源開発・製錬と先端材料が中心で、既存の業界値に非鉄金属が無いため。
