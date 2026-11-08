# ハイレックスコーポレーション — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ハイレックスコーポレーション |
| 証券コード | 7279 |
| docID（データを取り出した文書） | `S100XGCL` |
| 原本 docID | `S100XGCL` |
| 提出日（原本） | 2026-01-23 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XGCL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ハイレックスコーポレーション / 7279 / docID S100XGCL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hi-lex: 10 件の数値を有報XBRLと照合
有報: 株式会社ハイレックスコーポレーション 有価証券報告書－第82期(2024/11/01－2025/10/31) (docID S100XGCL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hi-lex: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造、販売などの費用を差し引いた残りが利益になります。2025年10月期のは8…）

## エージェントの判断記録（fragment warnings）

- businessModel: bootstrapの組替え警告への対応: 経営指標等の注2により「収益認識に関する会計基準」等を第79期の期首から適用し、同79期以降の指標が適用後の数値であることが確認できたため、financialNotesに1件記録した。セグメント関連情報の表示方法の変更（当期から「ドアラッチ」を新たに区分表示し前期数値を組替え）は表示区分の変更で金額系列に影響しないため、financialNotesには入れず本警告に記録する（カルビー先例）。修正再表示チェック自体は前期有報と全行一致でクリーン。
- businessModel: 後発事象の株式取得に伴う取得原価13,325百万円やアドバイザリー費用377百万円は、売上高・純利益以外の金額のため本文には書いていない（沿革とneedsReviewには金額なしで記録）。
- businessModel: 経営方針に掲げる自己資本・ROE等の指標目標は投資・収益性指標のため本文に書いていない。戦略は定性的に要約した。
- businessStructure: 報告セグメントは地域別（日本・北米・中国・アジア・欧州・南米）のため、事業は地域セグメントを外部顧客への売上高の大きい順に並べた（ユニプレス先例）。【関連情報】の製品別情報（コントロールケーブル68,572百万円、ウインドレギュレータ92,717百万円、ドアモジュール75,809百万円、ドアラッチ27,776百万円、パワーリフトゲート24,324百万円、その他14,922百万円）は同じ合計に対する別の切り口であり、二重数えを避けるため事業にはせず businessModel の products に記載した。
- businessStructure: 日本セグメントには医療用機器（補助人工心臓など）の製造販売が含まれるが、金額は独立して開示されていないため、説明文にその旨を書くにとどめた。
- history: 沿革の年月と事象は対応づけて印字されており、崩れた表ではないため行順どおりに採用した。資本金の金額（1963年の設立時など）は印字されているが、金額を沿革に書かない規則のため省いた。
- history: 落とした小項目: 各工場の新設（三ケ日・三田西など）、認証取得（QS9000・ISO14001）、清算結了した子会社（出石ケーブル・HI-LEX CABLE SYSTEM等）、株式の追加取得や持分売却による連結範囲の細かな変更、形式上の存続会社である宝塚ケーブル株式会社（旧・時田産業）の沿革。
- history: 2025年の三井金属アクト取得は決算日（2025年10月31日）後の完了事項であり、完了として沿革に書いた。登録本体は決算日現在の構成に基づくため、businessModel の needsReview にも明記した。
- industry: 6つの報告セグメントはいずれも自動車部品の地域別区分であり、売上の大半が自動車向けのため主たる業界は automotive のみとした。
- industry: 日本セグメントには医療用機器（補助人工心臓など）が含まれるが、金額が独立して開示されていないため、2つ目の業界は付けなかった（金額が独立開示されていない事業に業界を足さない規則）。
- relatedCompanies: 結んだ関連企業は3社（toyota=customer、honda=major-shareholder、nishikawa-rubber=major-shareholder）。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: alpha（3434）と alpha-4760: 大株主の状況と特定投資株式に載る「株式会社アルファ」（大株主として2.18％、2025年10月31日現在）は、正式名称が同一の候補が2社あり、有報の記載（住所は神奈川県横浜市金沢区福浦）だけではどちらの会社か特定できないため、同一性が確定できず結ばなかった。承認者が特定できる場合は覆し可能。
- relatedCompanies: mitsui-kinzoku: 取得したのは三井金属アクト株式会社（現・株式会社ハイレックスアクト）であり、有報は株式の譲渡人や三井金属株式会社との取引・提携を明記していない。社名の一部が一致するだけで結ばない。取得の事実は沿革と needsReview に記録した。
- relatedCompanies: asahi-intecc: 特定投資株式に載り、保有目的に取引関係の維持・強化とあるが、定型的な目的の記載のみで相手固有の取引の記述がなく、当事業年度に保有株式の一部を売却しているため結ばなかった。
- relatedCompanies: central-automotive-products / shinmaywa-industries / kyokuto-kaihatsu-kogyo / matsumoto-yushi-seiyaku / tokyo-rope-mfg / okaya-and-co / suzuki: いずれも特定投資株式に載るが、保有目的が全銘柄共通の定型文（「自動車部品事業における取引関係維持・強化」「素材開発における取引関係維持・強化」など）のみで、相手固有の取引・提携の記述がないため結ばなかった（カルビー・三谷商事の先例）。スズキについては取引先持株会による定期買付も理由に含まれ、固有の取引記述がない。
- relatedCompanies: mitsubishi-ufj-financial-group / sumitomo-mitsui-financial-group: 特定投資株式の保有目的が「取引先金融機関との金融取引等の安定化」で、資金調達のための関係のため結ばなかった。大株主の株式会社三菱UFJ銀行（1.99％）も金融機関のため同様。
- relatedCompanies: lec: 「ハイレックス埼玉」「ハイレックス島根」等の子会社名に含まれる文字列の断片一致で、レック株式会社との関係の記載はない。
- relatedCompanies: vision: 「経営ビジョン」「ビジョンの形成」等の一般語への一致。
- relatedCompanies: como: 「チェコモスト郡」（地名）の断片一致。
- relatedCompanies: base-4481: 「連結ベース」の断片一致。
- relatedCompanies: career: 「キャリア自律支援」等の一般語への一致。
- relatedCompanies: land: 「ブランド」の断片一致。
- relatedCompanies: nikko-6306: ambiguous な候補で、有報の出現箇所は設備関連の一般文字列の断片一致であり、日工株式会社との関係の記載はない。
- relatedCompanies: torq: 地名「バトルクリーク市」等への断片一致で、トルク株式会社との記載はない。
- relatedCompanies: core: メキシコの州名「コアウイラ州」の断片一致。
- relatedCompanies: en: 「エンジニアリング」の断片一致。
- relatedCompanies: port: 英国の地名「ポートタルボット市」の断片一致。
- relatedCompanies: taya: 「世田谷区」の断片一致。
- relatedCompanies: trust: 「日本マスタートラスト信託銀行（信託口）」への断片一致で候補の株式会社トラストではなく、候補の listing もコードリストにない。
- relatedCompanies: zero: 「回収可能性をゼロとし」という一般語への一致。
- relatedCompanies: 候補にない主な相手（記録のみ）: 現代自動車株式会社・起亜株式会社・Stellantis N.V.は主要な顧客だが外国会社で候補にない。THAI STEEL CABLE PUBLIC COMPANY LIMITED（持分法適用関連会社、26.9％）と株式会社大同システム（同、32.9％）は候補にない。大株主の寺浦興産株式会社（28.05％）は未上場の創業家会社で候補にない。株式会社SUBARUは特定投資株式に定型文の保有目的で載るが候補にない。
- terms: 登録候補（助言のみ）: コントロールケーブル（離れた場所の操作をケーブルで伝える部品で、同社の創業以来の主力製品）、ウインドレギュレータ（自動車の窓ガラスを昇降させる装置で、製品別の売上高が最大）、ドアラッチ（自動車のドアを施錠・固定する部品）、パワーリフトゲート（電動で開閉する後部ドアの仕組み）、EVAHEART（連結子会社が製造販売する補助人工心臓）。

## 要確認（status に反映）

- businessModel: 2025年11月4日（決算日2025年10月31日の直後）に三井金属アクト株式会社の全株式を取得して完全子会社化し、同社は株式会社ハイレックスアクトに商号を変更した（2025年5月13日の取締役会決議・株式譲渡契約に基づく）。本登録は2025年10月31日現在のグループ構成（子会社49社・関連会社5社）に基づいており、ハイレックスアクトは関係会社の一覧に含まれていない。あわせて同日、同子会社への資金貸付けと、その借入金に対する債務保証も実行されている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
