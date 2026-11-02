# 松田産業 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 松田産業株式会社 |
| 証券コード | 7456 |
| docID（データを取り出した文書） | `S100YGWM` |
| 原本 docID | `S100YGWM` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGWM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 松田産業株式会社 / 7456 / docID S100YGWM（id は英語表記「MATSUDA SANGYO Co.,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
matsuda-sangyo: 10 件の数値を有報XBRLと照合
有報: 松田産業株式会社 有価証券報告書－第77期(2025/04/01－2026/03/31) (docID S100YGWM)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":168900000000,"latestFiling":169259000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
matsuda-sangyo: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 利益は当期純利益のみ記載。経常利益・セグメント利益は方針により書かない。
- businessModel: brief.md の『財務諸表の組替え』の注意は確認できる範囲で、前期有報との重複年度が全て一致のため basis は付けなかった。
- businessModel: perspectives は省略（MD&A の戦略記述を読み込んでいないため、書けない）。
- businessStructure: 並び順は【セグメント情報】の外部顧客への売上高（貴金属関連事業570,422百万円 > 食品関連事業117,421百万円）。
- businessStructure: children は使わなかった（2セグメント。製品区分の売上は複数セグメントにまたがる関連情報で、事業との対応が印字されていない）。
- businessStructure: shortNameEn は書かなかった（英訳名 MATSUDA SANGYO Co.,Ltd. 以外の表記が証拠パックにない）。
- businessStructure: listings の market は表紙が『東京証券取引所プライム市場』と印字しているため記載。
- history: 2009年6月・2011年11月・2012年2月の行は表が崩れて日付と事象の対応が一意でないため使っていない。
- history: 1951年の竹善商事設立と1979年の商号変更は、事象に会社の合併経緯が続くため1992年の項目に含めた。
- industry: 主たる業界は売上の83%を占める貴金属関連事業（地金・電子材料の販売が中心）から trading とした。貴金属リサイクル・製錬に対応する区分がないため taxonomyGaps に記録。
- industry: 食品関連事業は報告セグメントとして売上が開示されているため food を併記。
- industry: 半導体向けの部材として開示された事業はなく semiconductors は付けない（スクラップの発生源として半導体・電子部品業界に触れるのみ）。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性（掲載済み・上場）を確認できないため、誰とも結ばなかった。
- relatedCompanies: 日鉄マイクロメタル: 持分法適用関連会社（30.0%）だが非上場で、候補にも無い。
- relatedCompanies: 三菱商事RtMジャパン・三井物産: 主要な販売先として有報に印字されるが、候補ファイルが無く同一性を確認できない。
- relatedCompanies: ALD Vacuum Technologies GmbH・日本製鉄: 過去の共同出資の記述のみで、現在の関係として印字されていない。
- terms: 用語の候補: 貴金属の回収製錬（スクラップから金属を取り出す工程）、LBMA・LPPM認定（地金の品質認定）、ボンディングワイヤ（半導体の配線に使う細線）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 松田産業の貴金属関連事業（貴金属の回収製錬・リサイクル） → 提案: 資源リサイクル・非鉄金属。貴金属スクラップの回収製錬と地金販売、産業廃棄物処理を行い、商社・化学・エネルギーのどれにも収まらない。
