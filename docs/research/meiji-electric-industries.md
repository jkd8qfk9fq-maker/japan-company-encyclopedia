# 明治電機工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 明治電機工業株式会社 |
| 証券コード | 3388 |
| docID（データを取り出した文書） | `S100YKYA` |
| 原本 docID | `S100YKYA` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKYA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 明治電機工業株式会社 / 3388 / docID S100YKYA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
meiji-electric-industries: 10 件の数値を有報XBRLと照合
有報: 明治電機工業株式会社 有価証券報告書－第70期(2025/04/01－2026/03/31) (docID S100YKYA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
meiji-electric-industries: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 連結キャッシュ・フロー計算書の表示方法の変更により、第69期の営業活動によるキャッシュ・フローと財務活動によるキャッシュ・フローは組替え後の数値が主要な経営指標等に印字されています。表示方法の変更のみで、5年間の売上高・純利益等の指標は前期有報と全行一致したため、financialNotesには書きませんでした。
- businessModel: 第11次中期経営計画の2027年3月期の数値目標は将来の目標のため、本文には書きませんでした。
- businessModel: オムロン株式会社との販売店・代理店契約は、2026年4月1日付で新たに1年間の契約が締結された旨が重要な契約等に印字されています。毎年の定型的な更新のため、warningsのみとしました。
- businessModel: 連結子会社の名電エンジニアリング株式会社の工場社屋の新設（2026年4月完成予定）が設備の新設等の計画に印字されています。子会社の設備計画のため、warningsのみとしました。
- businessModel: 研究開発費の金額は本文の財務数値の範囲外のため、本文には書きませんでした。
- businessModel: Wikipediaの記事は有報の記載を超える補足がなかったため、出典には加えませんでした。
- businessStructure: 単一セグメントのため、セグメント別の金額はありません。事業の子区分には、経営者による分析に印字された品目別の売上高を用いました。
- businessStructure: 品目別の売上高は経営者による分析の印字（百万円単位）どおりです。各品目の丸めのため、品目別の合計は連結売上高の印字と一致しません。
- businessStructure: 地域別の収益は収益認識関係の注記に千円単位の表でのみ印字されているため、子区分の金額には使いませんでした（日本が大半を占めます）。
- businessStructure: 検査装置や生産支援システムなど自社開発製品の設計・製造は産業機器の一部で、独立した金額が開示されていないため、子区分には分けませんでした。
- history: 沿革に印字された資本金の金額は、本文の財務数値の範囲外のため、各行の説明には書きませんでした。
- history: 営業所・支店の開設などの小規模な拠点の新設・移転の行は、件数が多いため省きました。
- history: 清算済みの現地法人（明治進和（天津）機電工程有限公司、Meiji Electric Industries(Thailand) Co.,Ltd.）の設立行は省きました。
- industry: 制御機器、産業機器、計測機器等の販売が事業の中心であり、技術商社としての性格が強いため、主たる業界は商社としました（ユアサ商事と同じ分類です）。
- industry: 自社開発製品の設計・製造はエンジニアリング事業本部等が担いますが、独立した金額が開示されていないため、第二の業界は付けませんでした。
- relatedCompanies: デンソー: 主要な顧客ごとの情報に印字された主要な顧客のため結びました。販売高の金額は説明には書かず、割合のみを書きました。
- relatedCompanies: オムロン: 特定投資株式には載っていませんが、重要な契約等に販売店・代理店契約が印字されているため仕入先として結びました。
- relatedCompanies: ダイフク: 特定投資株式に制御機器等の取引が印字されていますが、related-candidates.jsonに無いため結びませんでした。
- relatedCompanies: パナソニックグループ各社とシュナイダーエレクトリックホールディングス: 【事業の内容】に代理店として名前がありますが、related-candidates.jsonに無いため結びませんでした。
- relatedCompanies: 三菱UFJフィナンシャル・グループ: 主要取引金融機関としての決済・為替等の金融取引のみのため結びませんでした。
- relatedCompanies: ふくおかフィナンシャルグループ: 主要取引金融機関としての金融取引のみのため結びませんでした。
- relatedCompanies: 三井住友トラストグループ: 主要取引金融機関としての金融取引と証券代行・年金資産運用委託のみのため結びませんでした。
- relatedCompanies: 三菱HCキャピタル: 事務機器等のリース取引に限られる金融取引先のため結びませんでした。
- relatedCompanies: 八十二長野銀行: 特定投資株式は当事業年度に全て売却済みで、期末の保有がないため結びませんでした。
- relatedCompanies: 御園座: 名古屋地区の文化・芸能の維持発展を目的とした地域貢献のための保有で、取引関係の印字がないため結びませんでした。
- relatedCompanies: トヨタ自動車: 海外営業の対象として関連各社とともに名前が挙がるのみで、個別の取引関係の印字がないため結びませんでした。
- relatedCompanies: 進和: 2006年の合弁会社（2016年清算）という過去の関係のみで、現在の取引・提携の印字がないため結びませんでした。
- relatedCompanies: 株式会社KYOTSUと株式会社アドバン・テック: 当社グループの関連会社であり、関連企業リンクの対象ではないため結びませんでした。
- relatedCompanies: エン、ステップ、キャリア、ベース、ポート、No.1、スローガン、ゼロ、コア、カバー、リックス: 社名と一般語の一致のみで、取引・提携・資本関係の印字がないため結びませんでした。
- terms: 助言: 用語『FAエンジニアリング』は、工場の自動化に関する技術力で、【事業の内容】に印字されています。
- terms: 助言: 用語『1-Day Delivery』は、注文を受けた翌日に商品を届ける物流体制で、【事業の内容】に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
