# ＭＲＴ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＭＲＴ株式会社 |
| 証券コード | 6034 |
| docID（データを取り出した文書） | `S100XSR6` |
| 原本 docID | `S100XSR6` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSR6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＭＲＴ株式会社 / 6034 / docID S100XSR6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mrt: 10 件の数値を有報XBRLと照合
有報: ＭＲＴ株式会社 有価証券報告書－第27期(2025/01/01－2025/12/31) (docID S100XSR6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
mrt: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「MRT株式会社」が EDINET の提出者名「ＭＲＴ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記２（企業結合に係る暫定的な会計処理の確定）は financialNotes として2023年12月期に記録した。前期有報との照合（修正再表示チェック）は全系列で差異なしであり、数値は確定後の印字どおりである。
- businessModel: 経営方針に掲げる数値目標（売上収益・利益の対前年度比を指標とすること）は投資・利益指標に当たるため本文・perspectives には書いていない。
- businessModel: MD&A の利益項目（営業利益・税引前利益等）の金額・増減理由は規則により書いていない。本文の財務数値は売上収益と親会社の所有者に帰属する当期利益だけである。
- businessModel: サービス別内訳の千円額の合計と印字合計の1千円の差は有報の丸めとして印字どおりとした。
- businessModel: 株式会社医師のともの主要な損益情報（関係会社の状況の注記）は金額であるため書いていない。
- businessStructure: 単一セグメント（医療情報プラットフォームの提供事業）のため、セグメント注記の「サービスごとの情報」に外部顧客への売上収益が開示されている医療人材サービスとその他を children とした。サービス別内訳の千円額の合計（3,061,275千円＋1,130,196千円＝4,191,471千円）は印字の合計4,191,472千円と1千円異なるが、有報の丸めとして印字どおりとした（百万円への切捨てでは合計が一致する）。
- businessStructure: suppliers キーはこのツリーの旧スキーマに無いため省略した。個別の仕入先は有報に印字されていない。
- businessStructure: 設備は全て単一セグメント（医療情報プラットフォームの提供）に帰属する印字のため、children には結びつけていない。帳簿価額は書いていない。
- businessStructure: 連結子会社は【関係会社の状況】に9社が名称付きで載り「その他4社」と合わせて13社、持分法適用関連会社はメドリング株式会社（議決権21.1％）1社。自社の子会社・関連会社は関連企業として結ばないため、ここでは構造の記述にとどめた。
- history: 沿革の表は年月と事象が一体で印字されており、行順どおりに対応づけた。資本金の金額は規則により書いていない。
- history: 落とした行：本店移転（2004年・2007年・2011年・2015年）、一般労働者派遣事業の許可取得（2004年）、営業所開設（2015年名古屋・2017年福岡・大阪支社化）、ISMS認定・プライムマーク取得、医師紹介実績10万件・50万件・100万件の各到達、子会社化のうち NOSWEAT（現・ＭＲＴスタッフィング）・ＣＢキャリア（現・ＭＲＴメディアパートナーズ）・ａｎｅｗ・メディアルト・Medikiki の取得、Vantage株式会社・株式会社バリューメディカルの設立、MRT GLOBAL MANAGEMENT PTE. LTD.の設立。これらは構造上の転機として大きいものを優先して選んだためである。
- history: Wikipedia の記事はパックで found: false のため使っていない。
- industry: 主たる業界は、売上収益の約7割を占める医療人材サービス（医師・コメディカルの人材紹介）に基づき human-resources とした。単一セグメントで金額が独立開示されていない個別サービスには業界を足していない。
- relatedCompanies: port・seki・en・step・career・land・care-service・core・base-4481・karula・no-1・ray・vision: いずれも一般語・部分一致・自社サービス名（career）・理念文の一部などによる機械抽出で、有報は各社との取引・提携・資本関係を述べていないため結ばなかった。
- relatedCompanies: 候補にない相手: 株式会社冨田医療研究所（大株主21.69％、2025年12月31日現在）は related-candidates.json に無いため結ばなかった。株式会社メディカル・コンシェルジュ（大株主4.08％、同日現在）も候補に無いため結ばなかった。楽天証券株式会社は証券会社の純投資とみられるため結ばなかった。
- relatedCompanies: 自社の連結子会社13社と持分法適用関連会社メドリング株式会社は、関連企業として結ぶ対象ではないため結ばなかった（構造は businessStructure に記録）。
- relatedCompanies: 政策保有株式に当たる開示は本有報では確認できず、保有株式の表だけを根拠にしたリンクは行っていない。
- terms: 助言のみ。用語としては「外勤（Gaikin）」「医局」「コメディカル」「紹介予定派遣」「医療情報プラットフォーム」などが候補だが、本工程ではデータを持たない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] mrtの主たる業界（医療情報プラットフォーム事業） → 提案: 医療人材サービス（医師・医療従事者専門の人材紹介・プラットフォーム）。売上収益の約7割を占める医療人材サービスは医師・コメディカル専門の人材紹介ですが、閉じた分類に医療分野の人材サービスを表す区分がなく、人材紹介として最も近い human-resources を暫定としました。
