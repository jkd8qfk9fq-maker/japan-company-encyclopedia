# ブラザー工業 — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ブラザー工業株式会社 |
| 証券コード | 6448 |
| docID（データを取り出した文書） | `S100YECO` |
| 原本 docID | `S100YECO` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YECO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ブラザー工業株式会社 / 6448 / docID S100YECO（id は英語表記「BROTHER INDUSTRIES, LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
brother-industries: 10 件の数値を有報XBRLと照合
有報: ブラザー工業株式会社 有価証券報告書－第134期(2025/04/01－2026/03/31) (docID S100YECO)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:RevenueIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":876558000000,"latestFiling":848889000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":74694000000,"latestFiling":72542000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
brother-industries: 本文の金額 20 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、前期より23.5％増えました。この利益には、非継続事業からのが含まれていま…）
- 確認: [filing-as-subject] financials[4].note: 有報を主語にしない（事業や出来事を直接述べ、根拠は出典欄に任せる）（…収益も組み替えて表示しており、今回の有報では848,889百万円です。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期（2025年3月期）の売上収益は、今回の有報では848,889百万円に変わった。理由は有報が書く、ネットワーク・アンド・コンテンツ事業の非継続事業への分類に伴う組替。financialNotes に記録した。純利益は組替の影響を受けない（継続・非継続の合算）。
- businessModel: financials の revenueBasis / netIncomeBasis は fragments に入れていない（工程の書けるキー外）。basis の説明は financialNotes に書いた。
- businessModel: 営業利益・セグメント利益・税引前利益は書いていない（規則）。MD&Aの中期戦略の目標値（ROE等）も書いていない。
- businessModel: profit の段の「税効果調整が発生したことも」は、MD&Aが増益の理由として印字している文言。
- businessStructure: 決算期は表紙のDEIから2026年3月期。会計基準はIFRSで、売上は「売上収益」の語で書いた。
- businessStructure: 並び順はセグメント注記の外部収益（P&S 570,583／IP 139,291／マシナリー 82,969／P&H 60,973／ニッセイ 21,441／その他 18,204百万円）の大きい順。パーソナル・アンド・ホームはニッセイより大きいので、ニッセイの前に置いた。
- businessStructure: ネットワーク・アンド・コンテンツ事業は2026年3月期から非継続事業で、セグメント情報から除外されているため金額が無い。事業の内容にまだ載っているので、金額の無い区分として最後に置いた。
- businessStructure: セグメント利益・営業利益は本文に書いていない（規則）。
- businessStructure: children は【関連情報】の製品・サービス別の外部売上収益の区分。ニッセイ・P&H・その他は製品区分が無いので children を空にした。
- businessStructure: ドミノの「各種コーディング・マーキング機器の販売からアフターサービスまで」は事業等の記述からの要約。
- history: 沿革は【沿革】の年月・事象が1行ずつ印字されており、崩れた表ではない。年単位に絞って14件を選んだ。
- history: 『ドミノの売上125,326百万円』『エクシング譲渡』の記述は、セグメント注記・【重要な契約等】で裏付けた。
- history: 社名変更・上場廃止（MUTOH）の日付は【関係会社の状況】の注記による。
- industry: 主な業界は electronics。最大の報告セグメントであるプリンティング・アンド・ソリューションズ（プリンター・複合機・ラベル機器）が2026年3月期の外部顧客への売上収益893,464百万円のうち570,583百万円を占める。沿革も2006年10月に株式の所属業種を「機械」から「電気機器」に変更したと書いている。
- industry: machinery を足した。マシナリー事業（工作機械・工業用ミシン）とニッセイ事業（減速機・歯車）、インダストリアル・プリンティング事業の産業用機器は、いずれも報告セグメントとして外部顧客への売上収益が開示されているため。
- industry: semiconductors・automotive・entertainment は付けていない。ネットワーク・アンド・コンテンツ事業（カラオケ）は非継続事業で、継続事業の報告セグメントに含まれない。自動車関連は、工業用ミシンの自動車部品向け部門など、金額が独立して開示されていない。
- relatedCompanies: MUTOHホールディングス（mutoh-holdings）: 連結子会社だが listing が上場でなく（2026年6月10日に上場廃止）、結ばない。
- relatedCompanies: U-NEXT HOLDINGS: エクシング株式70％の譲渡という1回限りの取引で、継続する取引・提携の印字が無いため結ばない。
- relatedCompanies: コシダカホールディングス: スタンダードの事業譲渡という1回限りの取引なので結ばない。
- relatedCompanies: 山善（ambiguous）: 製品販売・購入関係の保有目的だが同一性が曖昧なので結ばない。
- relatedCompanies: オークマ（取引関係の維持のためという定型の保有目的のみ）・千代田インテグレ・リョーサン菱洋ホールディングス（各保有株数が小さく部品仕入関係の定型句のみ）・自重堂・名港海運・東邦瓦斯: 取引の中身が印字されておらず結ばない。
- relatedCompanies: MS&ADインシュアランスグループホールディングス・三菱UFJフィナンシャル・グループ・三井住友フィナンシャルグループ: 保険・金融取引、議決権行使が理由なので結ばない。
- relatedCompanies: エクシング（連結子会社）・各販売/製造子会社: 候補一覧に無く、非上場のため結ばない。
- relatedCompanies: エン・セキ・コア・パス・高速・ゼロ・ビジョン・ポート・ステップ・ベースなど: 一般語の部分一致であり、社名ではないので結ばない。
- relatedCompanies: zeon・nidec・sanyo-denki・okaya-and-co は政策保有株式の表の保有目的を根拠にした。株式数は数十万〜数百万株で、情報収集目的の100株とは違う。向きが印字されているのはゼオン（仕入）だけで、ニデックは仕入と販売の両方、山洋電気・岡谷鋼機は向きが不明確なので business-partner にした。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: 助言のみの工程。既存の用語 id は他社の成果物で使われているものだけを挙げた。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
