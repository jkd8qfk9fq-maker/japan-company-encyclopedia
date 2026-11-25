# 高知銀行 — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社高知銀行 |
| 証券コード | 8416 |
| docID（データを取り出した文書） | `S100YJZJ` |
| 原本 docID | `S100YJZJ` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJZJ.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E9%AB%98%E7%9F%A5%E9%8A%80%E8%A1%8C

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 株式会社高知銀行 / 8416 / docID S100YJZJ |
| edinet | completed | 1 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-bank-of-kochi: 10 件の数値を有報XBRLと照合
有報: 株式会社高知銀行 有価証券報告書－第146期(2025/04/01－2026/03/31) (docID S100YJZJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-bank-of-kochi: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画のKPI・KGIの数値目標は、目標値のため本文・perspectivesに書かなかった。
- businessModel: 前期有報との重複年度は全系列が一致しており、修正再表示はない。決算期変更・変則決算・会計基準の変更もないため financialNotes は空とした。
- businessModel: Wikipediaは第二地方銀行という位置づけと通称「こうぎん」の補足にだけ使い、数値は使っていない。
- businessModel: 中期経営計画の経緯として公的資金を前倒しで償還した旨の記載があるが、過去の完了した事実であり金額も書かないため、本文には入れずここに記録した。
- businessStructure: セグメント別の外部顧客に対する経常収益（銀行業21,743百万円・リース業6,248百万円・クレジットカード業386百万円）の単純合計は28,377百万円で、連結経常収益28,379百万円と2百万円の差異がある。有報のセグメント表の「計」欄自体が28,379百万円と印字されており、印字どおりの値をそのまま記載した。
- businessStructure: 地域商社業務は報告セグメントではなく、金額が独立して開示されていないため最後に置き、金額を書かなかった。
- businessStructure: こうぎん地域協働投資事業有限責任組合は【関係会社の状況】の注記で2026年3月31日をもって解散し清算中と印字されている。期末時点の事実として確定しているため needsReview には入れなかった。
- history: 沿革は年月まで印字されているが、規則に従い year のみで記録した。
- industry: 主たる業界は finance（金融）とした。外部顧客に対する経常収益の大半を銀行業が占め、リース業・クレジットカード業も金融サービスであり、提出者業種も「銀行業」である。
- industry: リース業・クレジットカード業は金融サービスの一環であり、独立した第2の業界は付けなかった。地域商社業務は金額が独立して開示されていないため業界を足していない。
- relatedCompanies: the-shikoku-bank: 特定投資株式の保有目的が「連携関係の維持・拡大を図る」という定型的な記載にとどまり、具体的な協定・取引の印字がないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有・売却方針の表に載る金融機関で、具体的な取引・提携の印字がないため結ばなかった。
- relatedCompanies: daiko-tsusan / globeride / miroku / nippon-express-holdings / sinfonia-technology / tokyo-automatic-machinery-works / yodoko: 特定投資株式で、保有目的が全銘柄共通の定型句（連携強化・取引関係の維持等）のみのため結ばなかった。
- relatedCompanies: alsok: みなし保有株式の注記で商号変更に触れたもので、当行との取引・提携の印字がないため結ばなかった。
- relatedCompanies: shinwa: 【大株主の状況】の「信和建設株式会社」は候補の信和株式会社とは別法人のため結ばなかった。
- relatedCompanies: career: 「キャリア形成」など一般語への部分一致のため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」等への部分一致のため結ばなかった。
- relatedCompanies: innovation: 当行の組織名「ソリューション提供・イノベーション推進室」への一致で、相手企業との関係の印字がないため結ばなかった。
- relatedCompanies: base-4481: 「連結ベース」など一般語への部分一致のため結ばなかった。
- relatedCompanies: en: ambiguous な機械抽出で、「エンゲージメント」など一般語への部分一致のため結ばなかった。
- relatedCompanies: semba: 支店所在地の地名（東船場町）への部分一致のため結ばなかった。
- relatedCompanies: seki: ambiguous な機械抽出で、一般語への部分一致のため結ばなかった。
- relatedCompanies: corona: 「コロナ禍」という一般語への部分一致のため結ばなかった。
- relatedCompanies: nissin: コードリストにない（上場区分を確認できない）うえ、新株予約権の注記への部分一致のため結ばなかった。
- relatedCompanies: rent: 為替取引の記述への部分一致で、相手企業を指すものではないため結ばなかった。
- terms: 用語の助言: 「第二地方銀行」は地方銀行のうち一般社団法人第二地方銀行協会の会員である銀行を指す区分、「経常収益」は銀行の売上高にあたる収益の科目、「勘定系基幹システム」は預金・貸出・為替などの銀行の中核業務を処理するシステム、「特定投資株式」は純投資目的以外で保有する上場株式を指します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
