# エブレン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | エブレン株式会社 |
| 証券コード | 6599 |
| docID（データを取り出した文書） | `S100YI0V` |
| 原本 docID | `S100YI0V` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI0V.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | エブレン株式会社 / 6599 / docID S100YI0V（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ebrains: 10 件の数値を有報XBRLと照合
有報: エブレン株式会社 有価証券報告書－第53期(2025/04/01－2026/03/31) (docID S100YI0V)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第51期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
ebrains: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の窓にある訂正有価証券報告書－第51期については、前期有報との重複年度の修正再表示チェックで売上高・純利益等の全項目に差異がなかったため、financialNotesには書かず、警告として記録しています。
- businessModel: 経営指標の注記は潜在株式と臨時従業員に関するものだけで、変則決算や会計基準の変更等の事実はないため、financialNotesは空にしました。
- businessStructure: 単一セグメントのため、事業は1つとし、応用分野別の販売実績（MD&Aの販売実績表）をchildrenにしました。応用分野別の金額は千円印字を百万円に切り捨てた値で、合計は丸めにより売上高とわずかに異なります。
- businessStructure: 仕入先については、海外の仕入先から部材を仕入れ、連結子会社の蘇州惠普聯電子有限公司と相互に部材を融通していることが【事業の内容】に印字されていますが、具体的な仕入先名の印字はないため、事業の説明と沿革・関係会社の範囲で記録しています（このツリーのスキーマではsuppliersキーは省略）。
- businessStructure: 連結子会社の蘇州惠普聯電子有限公司は自社グループのため、関連企業には結んでいません。
- history: 沿革の年月と事象は表の行順どおりに対応づけました。2026年4月のR&Dセンター設置は決算期末（2026年3月31日）後の出来事ですが、沿革に印字された完了した出来事のため沿革に含め、予定とは書いていません。
- history: ISO認証の取得など、事業の転機ではない認証関係の行は沿革から省きました。
- industry: 主たる業界は「electronics」を直接付けました。産業用コンピュータ向けの電子機器（バックプレーン、ボードコンピュータ等）の設計・製造・販売が単一セグメントの全事業のため、閉じた分類に直接当てはまります。
- industry: 半導体製造装置向けの製品は応用分野の一つですが、同社は半導体そのものや半導体製造装置を作る会社ではないため、「semiconductors」は付けていません。
- relatedCompanies: 株式会社エフティグループ: 【大株主の状況】に2.27％の大株主として載りますが、候補のlistingが「コードリストにない」ため結んでいません。
- relatedCompanies: 光通信ＫＫ投資事業有限責任組合: 【大株主の状況】に4.67％の保有者として載りますが、投資事業有限責任組合であり、候補の株式会社光通信とは別の主体のため結んでいません。株式会社光通信への置き換えもしていません。
- relatedCompanies: 株式会社コア、セキ株式会社、株式会社IC、ベース株式会社、株式会社キャリア、カバー株式会社、株式会社高速、株式会社レイ、株式会社鈴木: 一般語・人名・技術用語の部分一致であり、相手についての取引・提携・資本関係の印字がないため結んでいません。
- relatedCompanies: 連結子会社の蘇州惠普聯電子有限公司は自社グループのため結んでいません。カーム有限会社とエブレン社員持株会は候補にありません。
- terms: 用語の助言のみです。対象となりうる用語は「バックプレーン」「ボードコンピュータ」「プレスフィットマシン」「エッジコンピューティング」などですが、本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
