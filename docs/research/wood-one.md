# ウッドワン — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ウッドワン |
| 証券コード | 7898 |
| docID（データを取り出した文書） | `S100YI45` |
| 原本 docID | `S100YI45` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI45.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ウッドワン / 7898 / docID S100YI45（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wood-one: 10 件の数値を有報XBRLと照合
有報: 株式会社ウッドワン 有価証券報告書－第74期(2025/04/01－2026/03/31) (docID S100YI45)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
wood-one: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: ニュージーランド子会社におけるノースランド工場及びトライボード工場の抜本的な見直しの決定に伴う事業再編損2,956百万円（固定資産の減損等）は、当連結会計年度に決定・計上され当期の連結数値に反映済みであるため、needsReview には入れず warnings に留めた。前連結会計年度のギスボン工場閉鎖に伴う事業再編損も前期の完了事項である。
- businessModel: 上海倍楽厨業有限公司の清算結了と連結範囲からの除外は期中の完了事項で、2026年3月31日現在のグループ構造に反映済みのため、needsReview には入れず沿革と warnings に留めた。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」。重要な契約等は財務制限条項付きの借入金契約（シンジケートローン方式のコミットメントライン契約・タームローン契約）のみで、構造に関する事項ではないため needsReview には入れていない。
- businessModel: 経営方針・MD&Aに印字された目標・比率（連結売上高1,000億円の目標、ROE、自己資本比率等）は将来目標・比率のため本文に転記せず、方針の要約のみとした。
- businessModel: 前期有報との修正再表示チェックは全系列で差異なし。証拠パックの財務諸表の組替えに関する注意については、表示方法の変更に該当する注記の印字を確認できず、5年表の数値に影響する再表示もないため、financialNotes には入れていない。
- businessModel: MD&Aの比率（売上総利益率、営業利益率等）は本文に転記していない。セグメント利益も本文に書いていない。
- businessStructure: MD&Aのセグメント別売上高（住宅建材設備事業64,992百万円）はセグメント間の内部売上高47百万円を含むため用いず、セグメント注記の外部顧客への売上高64,945百万円を用いた。発電事業には内部売上高がないため1,054百万円で一致する。
- businessStructure: 住宅建材設備事業の子事業は、セグメント注記の収益の分解情報の区分（造作材・その他建材・床材・住宅設備機器）により、外部売上高の大きい順に並べた。
- history: 沿革のうち2016年4月から2019年3月の行は、抽出テキストで年月と摘要の対応が崩れているため、対応が確実な行のみを採り、当該期間の子会社清算・譲渡・子会社化の各行は採らなかった。
- history: 1952年の設立時の資本金など、沿革に印字された資本金額は転記していない。
- industry: 閉じた分類に木質建材・林業の区分がないため、主たる業界は住宅建材メーカーの先例（住友林業・LIXIL が construction を主たる業界とする）に倣い construction とした。発電事業（バイオマス発電・売電）は energy を副次として付けた。dynapac の先例と同様、近接する閉じた分類で表せるため taxonomyGaps には記録していない。
- relatedCompanies: SMB建材株式会社: セグメント関連情報の主要な顧客で、2026年3月期の連結売上高に対する割合は11.0％だが、非上場の子会社であり関連候補（related-candidates.json）にないため結ばなかった。販売の事実は industryPosition に記載した。
- relatedCompanies: 株式会社AVANTIA: みなし保有株式に「当社の販売先」との個別の保有目的の印字があるが、関連候補にないため結ばなかった。
- relatedCompanies: yondoshi-holdings（ヨンドシーホールディングス）: 特定投資株式の保有目的が「当社と同社の株式の安定した関係の維持のため」のみで、取引・提携の内容の印字がないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）・yamaguchi-financial-group（山口フィナンシャルグループ）・hirogin-holdings（ひろぎんホールディングス）・mizuho-financial-group（みずほフィナンシャルグループ）: 保有目的はいずれも取引金融機関としての資金借入取引・情報提供であり、融資関係のため結ばなかった。ひろぎんホールディングスとみずほフィナンシャルグループのみなし保有株式は株式信託に係る議決権帰属（退職給付信託）であり信託口のため結ばない。
- relatedCompanies: ms-and-ad-insurance-group-holdings（MS＆ADインシュアランスグループホールディングス）・dai-ichi-life-holdings（第一ライフグループ）・tokio-marine-holdings（東京海上ホールディングス、みなし保有株式）: 保有目的は保険に関する情報提供のみのため結ばなかった。
- relatedCompanies: toyo-securities（東洋証券）: 保有目的は副幹事証券としての株式市場に関する情報提供のみのため結ばなかった。
- relatedCompanies: kikusui-chemical-industries（菊水化学工業）: 保有目的が「同社との良好な関係の維持、強化を図るため」のみで、具体的な取引の印字がないため結ばなかった。
- relatedCompanies: rinnai（リンナイ）: MD&Aに同社のガス衣類乾燥機「乾太くん」推奨の衣類乾燥機専用台を発売した旨の印字があるのみで、提携や株式保有の印字がないため結ばなかった。
- relatedCompanies: the-kansai-electric-power（関西電力）: 国内の製造拠点で同社の再エネ電力プランを活用している旨の印字があるのみで、提携や株式保有の印字がないため結ばなかった。
- relatedCompanies: land（ランド）・zero（ゼロ、ambiguous）・nissin（日新、ambiguous）・seki（セキ、ambiguous）・en（エン、ambiguous）・base-4481（ベース）・port（ポート）・step（ステップ）・trust（トラスト）・vision（ビジョン）・king（キング）: いずれも一般語・部分一致（ランドはニュージーランド等の部分一致）であり、当該企業についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: グループの連結子会社8社は関連企業として結ばない（グループ会社であるため）。
- terms: 用語の助言なし。「LVL」「法正林施業」は木材・林業分野の一般的な用語であり、新規の用語登録は提案しない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
