# 日本電気硝子 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本電気硝子株式会社 |
| 証券コード | 5214 |
| docID（データを取り出した文書） | `S100XU17` |
| 原本 docID | `S100XU17` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU17.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本電気硝子株式会社 / 5214 / docID S100XU17（id は英語表記「Nippon Electric Glass Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-electric-glass: 10 件の数値を有報XBRLと照合
有報: 日本電気硝子株式会社 有価証券報告書－第107期(2025/01/01－2025/12/31) (docID S100XU17)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nippon-electric-glass: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有報が競合や順位・シェアを述べていないため industryPosition と analysis は省いた。
- businessModel: 戦略の目標のうち売上高以外の指標は本文に書かない方針のため省いた。
- businessStructure: グループは「ガラス事業」の単一セグメント。事業の並びは【関連情報】の製品区分（電子・情報、機能材料）の外部顧客への売上高の大きい順。
- businessStructure: 子区分（ディスプレイ・電子デバイス・複合材・医療/耐熱/建築）の金額は有報に独立して印字がないため書かない。
- businessStructure: 医療・耐熱・建築は有報が「医療、耐熱及び建築事業」とまとめて述べるため1つの子区分にした。
- history: 2016年10月・2017年2月・2017年9月の3つの年月と3つの事象が連続して印字された崩れた表。数が同じなので行順で対応づけ、2016年＝欧州ガラス繊維事業の取得、2017年＝米国ガラス繊維事業の取得とした（月は書かない）。2017年2月の福州旭福光電への資本参加は採用しない。
- history: 2012年5月・2012年12月の行も崩れているため、2012年の事象は採用しない。
- industry: 主業界は売上の55.8％を占める電子・情報（ディスプレイ・電子デバイス用ガラス）で決め、近い値として electronics を暫定で選んだ。
- industry: 半導体プロセス用ガラス・半導体用サポートガラスを事業として開示しているため semiconductors を2つ目に付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、有報の本文に社名がある掲載済み企業の候補が無いため、関連企業は結ばない。
- relatedCompanies: 株式会社ヨコオ（合弁会社LTCCマテリアルズの相手）: 候補一覧に無く、過去の合弁設立の記述のみで取引の向きも印字が無いため結ばない。
- relatedCompanies: 日本電気（創業の経緯）: 1944年の設立時の出来事で、現在の親会社・取引先としての記述が無いため結ばない。
- relatedCompanies: サンゴバン・ティーエム: 非上場の関連会社（耐火物の仕入先）で、上場でないため結ばない。
- terms: 用語の追加候補（助言）: 全電気溶融（電気でガラスを溶かす炉）、オーバーフロー法（液晶用基板ガラスの成形法）、LTCC（低温同時焼成セラミックス）、サポートガラス（半導体の薄い基板を支えるガラス）、低誘電ガラスファイバ、結晶化ガラス。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 日本電気硝子の主たる事業（特殊ガラス・ガラス繊維の素材製造） → 提案: ガラス・素材（materials）。ディスプレイ用ガラスや電子部品用ガラスは電機そのものではなく素材で、化学にも当てはまりにくい。素材・ガラス区分があれば適切。
