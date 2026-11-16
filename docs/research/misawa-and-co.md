# ミサワ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ミサワ |
| 証券コード | 3169 |
| docID（データを取り出した文書） | `S100Y0VC` |
| 原本 docID | `S100Y0VC` |
| 提出日（原本） | 2026-04-24 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y0VC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ミサワ / 3169 / docID S100Y0VC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
misawa-and-co: 10 件の数値を有報XBRLと照合
有報: 株式会社ミサワ 有価証券報告書－第67期(2025/02/01－2026/01/31) (docID S100Y0VC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
misawa-and-co: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは1件だけにした。主要な経営指標等の推移の注記のうち、5年表の年度（2023年1月期＝第64期）に対応する会計基準の変更は収益認識に関する会計基準の適用のみである。従業員数の記載方法（販売職正社員を外数とする注記）、潜在株式が存在しない旨、株価の市場の注記、持分法を適用する関連会社が存在しない旨は、会計基準の変更や決算期変更ではないためfinancialNotesには入れていない。
- businessModel: 報告セグメントの区分変更（従来の「unico事業」「food事業」の2区分から単一セグメントへ）は当事業年度の第１四半期会計期間から行われ、5年表の数値には影響しないため、financialNotesではなくbusinessStructureのwarningsに記録した。
- businessModel: 売上高と当期純利益以外の金額（営業利益・経常利益・総資産・純資産・仕入高・設備投資額など）と、中期経営計画の目標値（売上高・営業利益の目標）は本文に書いていない。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されている。
- businessStructure: 報告セグメントは当事業年度の第１四半期会計期間から「unico事業」の単一セグメントに変更された（従来は「unico事業」と「food事業」の2区分）。現在の【事業の内容】はunico事業のみを記述しており、本登録は現在の単一セグメント体制に基づく。セグメント情報の記載は省略され、製品及びサービスごとの外部顧客への売上高も報告セグメントと同一として開示が省略されているため、childrenには金額を書いていない。
- businessStructure: 非連結子会社が1社あるが、重要性が乏しいとして【関係会社の状況】で社名の記載が省略されている。子会社は関連企業に結ばない。
- businessStructure: 設備は全てunico事業に属する行のみで、本社・物流センターも同セグメントの欄に記載されているため、事業への対応は印字どおりとした。
- businessStructure: suppliersキーはこのツリーの旧スキーマに無いため省略した。家具・ファブリック等の製造は国内・海外の協力工場へ委託し、シリーズ毎に適正な協力工場を選択してコストコントロールを行っている事実は事業の説明に含めた。
- businessStructure: Wikipediaの記事は見つからなかった（found: false）ため、補足はしていない。
- history: 沿革の各行には年月が印字されているが、成果物の規則により年だけを用い、月は書いていない。
- history: 創業時の資本金の金額は書いていない。
- history: 地方第１号店のオープン（大阪・福岡・名古屋・札幌・仙台・広島・金沢）、本社・支店の移転、物流センターの開設・移転、海外拠点（フィリピン工場・上海代表処・ベトナム駐在員事務所・インド支店・インドネシア駐在員事務所）の開設、店舗形態の出来事（二子玉川のカフェ併設店など）は、主要な転機に絞るため省いた。
- industry: 報告セグメントは「unico事業」の単一セグメントで、自社企画の家具・インテリア雑貨を直営店とオンラインショップで消費者に販売する小売が事業の実体であるため、retailを主たる業界とした。閉じた分類に家具専門小売の区分は無いが、retailは小売一般を指す値であり暫定扱いには当たらないため、taxonomyGapsは記録していない。DEIの別記事業はcteである。
- relatedCompanies: land（株式会社ランド）: 「unicoブランド」「unico loomブランド」等の「ブランド」の部分一致で、同社についての取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「新卒キャリア枠制度」等の一般語の部分一致で、同社についての記述がないため結ばなかった。
- relatedCompanies: suzuki-6785（株式会社鈴木）: ambiguousな候補で、印字は取締役の氏名「鈴木裕之」であり、同社についての記述がないため結ばなかった。
- relatedCompanies: aeon-mall（イオンモール株式会社）: コードリストにない相手であり、印字も店舗所在地（イオンモール堺北花田等）と売掛金の相手先別内訳に限られ、取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: daiwa（株式会社大和）: ambiguousな候補で、印字は店舗所在地の地名「大和郡山」であり、同社についての記述がないため結ばなかった。
- relatedCompanies: taya（株式会社田谷）: ambiguousな候補で、印字は地名「世田谷区」の部分一致であり、同社についての記述がないため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョンを掲げており」という一般語の部分一致で、同社についての記述がないため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: ambiguousな候補で、印字は会計方針の「残存価額をゼロとする」の部分一致であり、同社についての記述がないため結ばなかった。
- relatedCompanies: ray（株式会社レイ）: ambiguousな候補で、印字は商業施設名「ステラプレイス」等の部分一致であり、同社についての記述がないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「フラワーベース」という商品名の部分一致で、同社についての記述がないため結ばなかった。
- relatedCompanies: future（フューチャー株式会社）: 商業施設名「フューチャーシティ・ファボーレ」の部分一致で、同社についての記述がないため結ばなかった。
- relatedCompanies: gmo-payment-gateway（GMOペイメントゲートウェイ株式会社）: 売掛金の相手先別内訳にのみ登場し、同社との取引・提携・資本関係を述べる記述がないため結ばなかった。
- relatedCompanies: hamakyorex（株式会社ハマキョウレックス）: 未払金の相手先別内訳にのみ登場し、同社との取引・提携・資本関係を述べる記述がないため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguousな候補で、印字は「ITセキュリティ」等の一般語の部分一致であり、同社についての記述がないため結ばなかった。
- relatedCompanies: 候補に挙がらなかった相手: 大株主は全て個人と従業員持株会で事業会社はなく、【株式の保有状況】は「該当事項はありません」で政策保有株式は無い。非連結子会社1社は自社の子会社であり、社名も開示されていないため結んでいない。
- terms: 助言のみ。用語としては「インナーブランディング」「多能工化」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
