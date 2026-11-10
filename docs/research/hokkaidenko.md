# 北海電工 — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社北海電工 |
| 証券コード | 1832 |
| docID（データを取り出した文書） | `S100YH4H` |
| 原本 docID | `S100YH4H` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH4H.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社北海電工 / 1832 / docID S100YH4H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hokkaidenko: 10 件の数値を有報XBRLと照合
有報: 株式会社北海電工 有価証券報告書－第86期(2025/04/01－2026/03/31) (docID S100YH4H)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hokkaidenko: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 親会社の北海道電力株式会社と北海道電力ネットワーク株式会社は百科事典に未掲載で、related-candidates.jsonにも含まれないため、関連企業として結んでいない。北海道電力ネットワークは大株主の状況（2026年3月31日現在）で発行済株式の55.60％を保有する直接の親会社であり、北海道電力はその親会社である。
- businessModel: 工事種別の売上高は収益認識関係の注記に百万円単位で印字された数値をそのまま記載した。6種別の合計は連結売上高72,445百万円と一致する。
- businessModel: 中期経営計画2021-2025の数値目標は、本文の財務指標として記載していない。
- businessModel: 主要な顧客ごとの情報の『北海道電力関係』は北海道電力株式会社と北海道電力ネットワーク株式会社の合算として印字されている。MD&Aの完成工事高（提出会社個別）に基づく割合は使用していない。
- businessStructure: 設備工事業の単一セグメントであるため、子事業は収益認識関係の注記に印字された工事種別の売上高で構成した。親会社から主に受注するのは配電線・発送変電・地中線等の電気工事である（事業の内容）。
- history: 沿革のうち、建設業許可の取得、本社の新社屋落成、ISO認証取得、部門の新設・改編などの項目は省略した。設立時の資本金の額は記載していない。2024年の商号変更について、有報の本文に旧商号の印字がないため、旧商号は記載していない。
- industry: 設備工事業の単一セグメント（電気工事・電気通信工事・土木工事・建築工事等）であり、閉じた産業リストでは『construction』が主産業として最も近い。同業の日本リーテック（登録済み）も同じ分類である。
- relatedCompanies: KDDIは、特定投資株式（704,400株）の保有目的に『当社が設備工事を請け負う重要な顧客』と印字されているが、related-candidates.jsonに含まれないため結ばなかった。顧客としての事実はbusinessModelのindustryPositionに文章で記録した。
- relatedCompanies: 株式会社北洋銀行（north-pacific-bank）は特定投資株式200,000株を保有するが、保有目的に金融取引の維持・円滑化が含まれ、金融機関との取引を含むため結ばなかった。
- relatedCompanies: ほくほくフィナンシャルグループ（4,000株）とみずほフィナンシャルグループ（1,080株）は、保有目的に金融取引の維持・円滑化を含む金融持株会社であり、結ばなかった。
- relatedCompanies: 大林組（obayashi）と大成建設（taisei）は、完成工事高と工事受注残高の発注者名としてのみ現れ、株式保有や提携の印字がないため結ばなかった。
- relatedCompanies: ダイヘン（daihen）は大株主の状況における退職給付信託口の名称としてのみ現れるため結ばなかった。
- relatedCompanies: ヘリオス（healios）の一致は工事の発注者であるヘリオス1合同会社であり、別の法人であるため結ばなかった。
- relatedCompanies: セキ（seki）、パス（path）、キャリア（career）、エン（en）、ポート（port）、ビジョン（vision）、ステップ（step）は一般語・部分一致であり、結ばなかった。
- relatedCompanies: 連結子会社の株式会社アイテスと関連会社の株式会社札幌電工は自社グループの会社であるため結ばなかった。親会社の北海道電力と北海道電力ネットワークは未掲載のため結ばなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
