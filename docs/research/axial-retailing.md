# アクシアル リテイリング — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アクシアル　リテイリング株式会社 |
| 証券コード | 8255 |
| docID（データを取り出した文書） | `S100YBP0` |
| 原本 docID | `S100YBP0` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBP0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アクシアル　リテイリング株式会社 / 8255 / docID S100YBP0（id は英語表記「Axial Retailing Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
axial-retailing: 10 件の数値を有報XBRLと照合
有報: アクシアル　リテイリング株式会社 有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YBP0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
axial-retailing: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 店舗数131は有報の販売網の記載（スーパーマーケットのみ、100円ショップを含まない）。新潟県と群馬県で115店舗と大半を占める。
- businessModel: 財務諸表の組替えの記載はあるが、前期有報との重複年度は一致しており、売上高・純利益の比較に影響しないと判断し financialNotes は書かなかった。
- businessModel: 売上高の増減の理由は本工程の範囲では確認していないため、書かなかった。
- businessStructure: 決算期は表紙のDEIから2026年3月期（第75期、12か月）。報告セグメントはスーパーマーケットの1つで、「その他」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: 「その他」の事業の内容（原興産・アイテック・高速印刷）は【事業の内容】の記載。「グループ内の取引が中心」は、セグメント間の内部売上高が4,972百万円で外部顧客への売上高767百万円を上回ることからの読み取りだが、金額は本文に書かなかった。
- businessStructure: 店舗数の内訳（新潟71・長野6・富山4・群馬44・栃木3・埼玉3、合計131）は事業等のリスクの販売網の表。表の見出し順は新潟・長野・富山・群馬・栃木・埼玉で、本文は店舗数の多い順に並べた。
- businessStructure: 子会社は有報の「子会社11社」のうち、事業の内容に事業内容が書かれている会社を children / その他に使った。
- history: 沿革の表は年月と事象が対応して印字されており、崩れはなかった。多数の事象のうち、会社の骨格に関わる13件を選んだ。吸収合併・小規模な子会社の整理、地震被害などは省いた。
- industry: 報告セグメントはスーパーマーケットのみで、売上の大半を占めるため小売。食品の製造・加工は店舗向けの子会社で、独立して開示されていないため food は付けなかった。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、関連企業は結ばなかった。
- relatedCompanies: 株式会社シジシージャパン：共同集中仕入機構との継続的商取引契約は有報にあるが、候補ファイルに無く、上場でもないため結ばない。
- relatedCompanies: 子会社11社は有報に記載があるが、いずれも非上場で掲載対象外のため結ばない。
- terms: 用語の助言：「純粋持株会社」「ドミナント・エリア（集中出店）」「共同集中仕入機構」「プライベート・ブランド」「ネットスーパー」は、初めての読者に説明があると助かる語。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
