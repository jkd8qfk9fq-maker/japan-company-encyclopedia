# バンク・オブ・イノベーション — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社バンク・オブ・イノベーション |
| 証券コード | 4393 |
| docID（データを取り出した文書） | `S100XD6Y` |
| 原本 docID | `S100XD6Y` |
| 提出日（原本） | 2025-12-25 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XD6Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社バンク・オブ・イノベーション / 4393 / docID S100XD6Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 10 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bank-of-innovation: 10 件の数値を有報XBRLと照合
有報: 株式会社バンク・オブ・イノベーション 有価証券報告書－第20期(2024/10/01－2025/09/30) (docID S100XD6Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
bank-of-innovation: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 表示方法の変更（前連結会計年度の連結貸借対照表・連結損益計算書・連結キャッシュ・フロー計算書の組替え）は表示だけの変更で、登録している経営指標に影響しないためwarningsのみとし、financialNotesには入れていない。前期有報との指標の照合でも差異はなかった。
- businessModel: 経営指標等の注記１・２（潜在株式調整後１株当たり当期純利益と株価収益率の未記載理由）は表示事項のためwarningsのみとした。株式分割・株式併合の記載は経営指標等の注記にない。
- businessModel: サービス別売上高の内訳（メメントモリ11,683百万円、恋庭682百万円）の合計は12,365百万円で、売上高12,366百万円と１百万円異なる。印字の表の丸めによるもので、そのまま印字どおりに記載し、事業別にも同じ数値を用いている。
- businessModel: Apple Inc.とGoogle LLCは決済代行事業者であり、関連候補にもないため結んでいない。売上は利用者からのものである旨がセグメント情報の関連情報に印字されている。
- businessModel: 連結子会社の株式会社Koiniwaと株式会社バンク・オブ・インキュベーションはいずれも債務超過の状態にある旨が関係会社の状況の注記に印字されている。金額は書かず、自社子会社であるため関連企業にも結んでいない。
- businessModel: 大株主の株式会社Cygames（1.99％、2025年９月30日現在）は関連候補にない非上場会社で、取引や提携の印字もないため結んでいない。残りの大株主は個人と証券会社・信託口である。
- businessModel: 【重要な後発事象】は連結・個別とも「該当事項はありません」であり、期間後の出来事として登録する事項はない。【株式の保有状況】も「該当事項はありません」で、政策保有株式はない。
- businessModel: 経営方針の目標指標（翌期以降３年間における売上高と営業利益の合計金額）は利益・投資指標のため、数値目標は本文にもperspectivesにも書いていない。
- businessModel: MD&Aの段階利益の金額と増減理由、キャッシュ・フローの金額、設備の帳簿価額と年間賃借料は書いていない。売上高の減少理由はMD&Aの印字に基づく。
- businessModel: Wikipediaの記事「バンク・オブ・イノベーション」は見つかったが、有報にない数値や事実は使っていないため出典には加えていない。
- businessStructure: 単一セグメントのため、事業の区分は事業の内容の分類（ゲーム／その他サービス）に従い、金額は事業の内容のサービス別売上高の表の印字を用いた。セグメント情報の関連情報では製品及びサービスごとの情報は省略されている。
- businessStructure: サービス別売上高の内訳の合計（12,365百万円）は売上高（12,366百万円）と１百万円異なるが、印字どおりに記載している。
- businessStructure: 連結子会社の株式会社Koiniwa（恋庭の開発・運営、議決権100％）と株式会社バンク・オブ・インキュベーション（新規事業の開発、議決権100％）の役割は事業の説明に含めた。両社は債務超過の状態にある旨が注記されているが、金額は書いていない。
- businessStructure: 主要な設備は本社（東京都新宿区）の事務所用設備のみで、単一セグメントのため事業全体に紐付けた。帳簿価額と年間賃借料は書いていない。国内子会社の設備は重要性がないため有報でも記載が省略されている。
- history: 本社移転（2007年中野区、2008年新宿区新宿、2010年新宿区大久保、2015年新宿区新宿）は沿革に印字されているが、転機に絞るため省略した。
- history: 『恋庭』と『メメントモリ』の開始年は、事業の内容のサービス表の配信開始年月に基づく（沿革には個別の記載がない）。個別の製品・サービスの開始は原則として絞っているが、両サービスは現在の事業の両輪であるため沿革に入れた。
- history: 資本金の金額や増資の履歴は書いていない。
- industry: 主たる業界はentertainmentとした。スマートフォンゲームアプリの開発・運営が売上の大半を占め、ゲーム恋活アプリも含めてエンターテイメントサービスの提供が事業の実体であるため直接当てはまる。
- industry: itは付けていない。自社サービスの開発・運営であり、他社向けのITサービスの提供ではないためである。
- industry: mediaは付けていない。『恋庭』はマッチングサービスであり、単一セグメントの中で独立したメディア事業として開示されていないためである。
- industry: DEIの別記事業はcteである。
- relatedCompanies: en: 「エンターテイメント企業」など企業理念の文言の部分一致（ambiguous）で、社名としての印字がないため結ばなかった。
- relatedCompanies: innovation: 当社自身の社名「バンク・オブ・イノベーション」の部分一致であり、株式会社イノベーションの印字ではないため結ばなかった。
- relatedCompanies: hit: 「１本のタイトルをヒットさせる」など一般語の部分一致のため結ばなかった。
- relatedCompanies: freee: 「リスクフリーレート」の部分一致のため結ばなかった。
- relatedCompanies: land: 「コーポレートブランド」の部分一致のため結ばなかった。
- relatedCompanies: base-4481: 「強みをベースに」の部分一致のため結ばなかった。
- relatedCompanies: garden・sumitomo-realty-and-development: 役員の兼任先である株式会社セガの所在地「住友不動産大崎ガーデンタワー」の印字のみで、当社との取引や資本関係の印字がないため結ばなかった。
- relatedCompanies: king: 「ランキング」の部分一致のため結ばなかった。
- relatedCompanies: no-1: 『恋庭』の「ゲーム恋活アプリ利用者数No.1」の表現の部分一致のため結ばなかった。
- relatedCompanies: ray: 「ロールプレイングゲーム」の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: seki: 「情報セキュリティ」の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: 大株主の株式会社Cygames（1.99％、2025年９月30日現在）は非上場で関連候補になく、取引や提携の印字もないため結んでいない。Apple Inc.とGoogle LLCは決済代行事業者であり、関連企業には結んでいない。
- relatedCompanies: 【株式の保有状況】は「該当事項はありません」で政策保有株式はなく、【関係会社の状況】は自社の連結子会社２社のみであるため、結ぶ相手はいなかった。
- terms: 助言のみ。用語としては『放置RPG』『ラメント』『自社IP』『ロマン』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
