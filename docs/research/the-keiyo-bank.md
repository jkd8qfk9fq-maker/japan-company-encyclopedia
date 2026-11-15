# 京葉銀行 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　京葉銀行 |
| 証券コード | 8544 |
| docID（データを取り出した文書） | `S100YBD2` |
| 原本 docID | `S100YBD2` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBD2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　京葉銀行 / 8544 / docID S100YBD2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 28 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-keiyo-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社　京葉銀行 有価証券報告書－第120期(2025/04/01－2026/03/31) (docID S100YBD2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-keiyo-bank: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: サービスごとの情報（関連情報）に印字された金額は報告セグメントの内訳ではないため、銀行業の子事業には金額を書かず、flow の収益ステージと industryPosition に集約した。
- businessModel: 経常収益と当期純利益の前期比増減率は、有価証券報告書に印字された当期・前期の金額から算出した。
- businessStructure: 報告セグメントは銀行業のみでセグメント情報の記載自体が省略されているため、事業区分は【事業の内容】の区分（銀行業・その他）どおりとし、「その他」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: サービスごとの情報（関連情報）に印字された外部顧客に対する経常収益（貸出業務54,820百万円、有価証券関連業務40,081百万円、その他13,754百万円）は、報告セグメントの内訳として開示されたものではないため、銀行業の子事業には金額を書かず、businessModel の industryPosition に集約した。
- history: 沿革は年月と事象が対で印字され表は崩れていないため、全行を収録した。1974年８月の行には外国為替業務の取扱開始と事務センター新設の２件が含まれるため、２つの出来事に分けて収録した。
- history: 設立時の資本金（700千円）と第１回国内無担保転換社債の発行額（150億円）は、金額であるため本文には書いていない。
- industry: 報告セグメントが銀行業のみで、銀行業以外の事業の割合も僅少なため、主たる業界は finance のみとした。
- relatedCompanies: career（キャリア）: 「キャリア形成」「キャリア採用」など人財に関する一般語の一致のみで、同社との取引・提携の印字がないため結ばなかった。
- relatedCompanies: port（ポート）: 「人財ポートフォリオ」などの一般語の一致のみで、同社との関係の印字がないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「ベース」などの一般語の一致のみで、同社との関係の印字がないため結ばなかった。
- relatedCompanies: vision（ビジョン）: 長期ビジョン「＋αＶｉｓｉｏｎ ９０」など一般語の一致のみで、同社との関係の印字がないため結ばなかった。
- relatedCompanies: core（コア）: 一般語の一致のみで、同社との関係の印字がないため結ばなかった。
- relatedCompanies: alpha-4760・alpha（アルファ）: 「＋α（プラスアルファ）」の表記との一致のみで、両社とも同社との関係の印字がないため結ばなかった。
- relatedCompanies: path（パス）: 一般語の一致のみで、同社との関係の印字がないため結ばなかった。
- relatedCompanies: lec（レック）: 一般語・部分一致の誤抽出で、同社名の印字がないため結ばなかった。
- relatedCompanies: seki（セキ）: 一般語・部分一致の誤抽出で、同社との関係の印字がないため結ばなかった。
- relatedCompanies: ray（レイ）: 部分一致の誤抽出で、同社との関係の印字がないため結ばなかった。
- relatedCompanies: rent（レント）: 部分一致の誤抽出で、同社との関係の印字がないため結ばなかった。
- relatedCompanies: trust（トラスト）: 信託業務・信託代理店などの一般語の一致で、コードリストにもないため結ばなかった。
- relatedCompanies: ms-and-ad-insurance-group-holdings: 特定投資株式の保有目的は保険窓販商品の提供等による業務上の協力関係で、保険取引が理由のため結ばなかった。なお当行の保有目的は2022年３月期に純投資目的へ変更されている。
- relatedCompanies: sompo-holdings: 特定投資株式の保有目的は保険窓販商品の提供等による業務上の協力関係で、保険取引が理由のため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 金融機関で、当行の保有は純投資目的へ変更のうえ当期に売却済みであり、金融取引の文脈のみのため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 金融機関で、当行の保有は純投資目的へ変更のうえ当期に売却済みであり、金融取引の文脈のみのため結ばなかった。
- relatedCompanies: mizuho-financial-group: 金融機関で、特定投資株式の当事業年度の保有もないため結ばなかった。
- relatedCompanies: the-musashino-bank: 当行の保有目的が2026年３月期に純投資目的へ変更され、当事業年度末の保有株式数もないため結ばなかった。
- relatedCompanies: aichi-financial-group: 保有目的は金融関連業務における協力関係で、金融機関との金融取引の文脈のため結ばなかった。
- relatedCompanies: central-japan-railway（ＪＲ東海）: 保有目的は観光面等における営業エリア内の経済活性化への寄与と定型の取引関係・協力関係の文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: oriental-land: 保有目的は千葉県を地盤とするテーマパーク運営企業という地域性の説明と定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: shinnihon（新日本建設）: 保有目的は千葉県を地盤とするデベロッパー機能を持つ総合建設業者という説明と定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: k-and-amp-o-energy-group: 保有目的は千葉県を地盤とする生活インフラ企業という説明と定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: keisei-electric-railway: 保有目的は千葉県を地盤とする鉄道インフラ企業という説明と定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: nanso-transport: 保有目的は千葉県を地盤とする物流インフラ企業という説明と定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: cvs-bay-area: 保有目的は千葉県を地盤とするコンビニエンスストア等の運営企業という説明と定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: ichishin-holdings: 保有目的は千葉県を地盤とする総合教育サービス企業という説明と定型文言のみで、個別の取引・提携の事実の印字がないため結ばなかった。
- relatedCompanies: ntt: 有価証券報告書の印字は株式会社ＮＴＴデータ（プラットフォームの提供）で同社とは別法人であり、同社自体との取引・提携の印字もないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
