# 昭和システムエンジニアリング — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　昭和システムエンジニアリング |
| 証券コード | 4752 |
| docID（データを取り出した文書） | `S100YE2I` |
| 原本 docID | `S100YE2I` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE2I.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　昭和システムエンジニアリング / 4752 / docID S100YE2I（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
showa-system-engineering: 10 件の数値を有報XBRLと照合
有報: 株式会社　昭和システムエンジニアリング 有価証券報告書－第60期(2025/04/01－2026/03/31) (docID S100YE2I)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
showa-system-engineering: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社 昭和システムエンジニアリング」が EDINET の提出者名「株式会社　昭和システムエンジニアリング」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes: 経営指標等の注記は、潜在株式がないこと、連結財務諸表を作成していないこと、株価の表示市場の変遷に関する表示事項のみで、会計基準の変更や変則決算などの事実は無いため、financialNotes は空にしました。
- businessModel: 日興システムソリューションズ株式会社は2026年4月1日付で株式会社日本総合研究所を存続会社とする合併を行った旨が有報に注記されています（グループ内再編）。当期の主要な顧客としての記載は印字どおりとし、合併後の関係は有報では確認できないため、関連企業・顧客の記述は期末時点の内容に留めました。
- businessModel: セグメント利益、受注高・受注残高、営業利益・経常利益などの金額は書いていません（売上高と当期純利益のみ）。
- businessModel: suppliers はこのツリーの旧スキーマのため省略しました。個別に印字された仕入先はありません。
- businessModel: 中期経営計画の数値目標は有報に印字が無いため書いていません。
- businessStructure: セグメントの売上高は全て顧客との契約から生じる収益で、内部売上高の開示はありません。セグメント利益は書いていません。
- businessStructure: 本社（東京都中央区）は設備表でソフトウエア開発事業とＢＰＯ事業が連記されているため、特定の事業には結びつけませんでした。大阪支社はソフトウエア開発事業のみの印字のため、同事業の説明に含めました。社宅・社宅用地は経営管理本部の設備で、事業には結びつけていません。
- businessStructure: 主要な顧客の日興システムソリューションズ株式会社は、グループ内再編により2026年4月1日付で株式会社日本総合研究所を存続会社とする合併を行った旨が有報に注記されています。当期の顧客としては印字どおり記載し、合併後の取引関係は有報では確認できないため関連企業には結んでいません。
- businessStructure: 受注高・受注残高の金額は書いていません。
- businessStructure: 設備の新設（社宅の建築、2026年5月着工予定・2027年12月完成予定）は有報の計画どおりの記載で、完了とは書いていません。
- history: 沿革のうち、汎用コンピュータの導入・増設（1969年・1973年・1976年・1979年・1980年・1983年・1987年・1993年）、本社移転（1968年・1991年・2016年）、大阪支社開設（1985年）、ISO9001認証取得（2002年）、プライバシーマーク付与認定（2005年）、ITSS導入（2006年）、市場の統合に伴う上場（2010年4月・同年10月）などは、会社の転機となる出来事に絞るため省きました。
- history: 資本金の金額は沿革に書いていません。
- industry: 主たる業界は、売上高8,730百万円のうち8,651百万円を占めるソフトウエア開発事業から it としました。
- industry: ＢＰＯ事業（売上高79百万円）は報告セグメントですが、業務代行に合う区分が閉じた集合に無く、金額も小さいため、2つ目の業界は付けませんでした。
- relatedCompanies: biprogy: 主要な顧客ごとの情報に顧客として印字され、MD&Aの相手先別販売実績でも主要な相手先であるため customer で結びました。特定投資株式としての保有目的は全銘柄共通の定型文ですが、リンクの根拠は顧客としての取引関係です。
- relatedCompanies: en: ambiguous で、一般語の部分一致のみのため結びませんでした。
- relatedCompanies: system-integrator: 一致した語は通産省「システムインテグレータ」登録制度の名称で、株式会社システムインテグレータへの言及ではないため結びませんでした。
- relatedCompanies: the-ehime-bank: 【大株主の状況】に載る金融機関（2026年3月31日現在4.20％）であり、特定投資株式の保有目的も全銘柄共通の定型文のみで、個別の取引関係の記載が無いため結びませんでした。
- relatedCompanies: cross-cat: 2022年3月期に保有目的を純投資目的へ変更しており、現在の保有は純投資のため結びませんでした。
- relatedCompanies: fujitsu: 売掛金の相手先別内訳にのみ登場し、取引関係を述べる記載が無いため結びませんでした。
- relatedCompanies: hikari-tsushin: 【大株主の状況】に載るのは光通信ＫＫ投資事業有限責任組合で、株式会社光通信とは別の法人のため結びませんでした。
- relatedCompanies: hitachi: 特定投資株式の保有目的が全銘柄共通の定型文のみで、個別の取引関係の記載が無いため結びませんでした。
- relatedCompanies: path: 「サーパス」の部分一致のため結びませんでした。
- relatedCompanies: seki: 「セキュリティ」の部分一致のため結びませんでした。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式として200株を保有するのみで、保有目的は定型文（上記に同じ）のため結びませんでした。
- relatedCompanies: will: 「コンピュータウィルス」の部分一致のため結びませんでした。
- relatedCompanies: 候補外のため結ばなかった相手: 日興システムソリューションズ株式会社（最大の顧客ですが候補に無く、2026年4月1日付で株式会社日本総合研究所を存続会社とする合併を行っています）、ＳＭＢＣ日興証券株式会社・株式会社ＮＴＴデータ フィナンシャルテクノロジー（売掛金の相手先内訳にのみ登場）。
- terms: 助言のみ。本文で使った用語の候補: システムインテグレーション、BPO、SEサービス、受注制作、Knowledge Integrator（ナレッジインテグレーター）です。
- terms: wikipedia.json は当社の記事が見つからなかったため、補足には使いませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
