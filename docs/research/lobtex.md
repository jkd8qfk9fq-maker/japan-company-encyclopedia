# ロブテックス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ロブテックス |
| 証券コード | 5969 |
| docID（データを取り出した文書） | `S100YGO7` |
| 原本 docID | `S100YGO7` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGO7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ロブテックス / 5969 / docID S100YGO7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
lobtex: 10 件の数値を有報XBRLと照合
有報: 株式会社ロブテックス 有価証券報告書－第143期(2025/04/01－2026/03/31) (docID S100YGO7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
lobtex: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…営課題である「業務の整流化を徹底し、利益体質の強化を図る」ことに取り組んでい…）

## エージェントの判断記録（fragment warnings）

- businessModel: MD&A の利益の金額と増減理由（セグメント利益を含む）は、本文の数値は売上高と当期純利益だけとする規則により書いていない。売上高の増減（前年同期比0.1％増）とその水準だけを flow に反映した。
- businessModel: 経営指標等の注記のうち、潜在株式調整後の非開示は表示上の事項のため warnings のみとした。株式分割の注記は needsReview に入れた。
- businessModel: Wikipedia の記事は冒頭が有報の事実の言い換えにとどまるため、補足には使わなかった（ブランド名は有報自身の経営方針の印字から採った）。
- businessStructure: 拠点と事業の対応は設備表のセグメント欄どおりとした（本社・東京営業所他は金属製品事業、ロブエースの練習場設備はレジャー事業）。帳簿価額は書いていない。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。製造子会社の鳥取ロブスターツールから製品を仕入れる関係は金属製品事業の説明と warnings に記録した。
- history: 沿革のうち、社名の変遷の細目（帝国精鍛工業への改称と日本理器への復帰）、営業所・工場の新設や移転、コールセンター設置、監査等委員会設置会社への移行、子会社の設立・清算などの軽微な行は落とし、warnings に記録した。
- history: 1923年の設立行に印字された資本金の金額は、沿革に資本金を書かない規則により落とした。
- industry: 主たる業界は、売上高の95％超を占める金属製品事業（作業工具・ファスニングツール・工業用ファスナー等の製造販売）から machinery を暫定とした。レジャー事業（ゴルフ練習場の運営）は報告セグメントとして外部顧客への売上高243百万円が独立して開示されているため entertainment を2つ目に付けた。いずれも閉じた分類に合う区分がなく taxonomyGaps に記録した。
- relatedCompanies: yamazen: 候補では ambiguous だが、有報の主要な顧客ごとの情報に両年度とも金属製品事業の販売先として正式名称で印字されており、同一性と関係性の両方が確認できるため結んだ。
- relatedCompanies: sugimoto-and-co: 特定投資株式として載るが、保有目的が全銘柄共通の定型句（取引先との関係維持・強化による収益拡大のため保有）のため結ばなかった。
- relatedCompanies: tachibana-eletech: 特定投資株式として載るが、保有目的が全銘柄共通の定型句のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group / the-nanto-bank: 金融機関であり、保有は資金調達等の金融取引が理由のため結ばなかった。
- relatedCompanies: vision / slogan / en / base-4481 / land / port / corona / rhythm / zero: 経営ビジョン・経営スローガン・営業利益ベース・ブランド・サポート・コロナウイルス等の一般語や部分一致のため結ばなかった。
- terms: 助言のみ。用語としては「ドロップフォージング（型打鍛造）」「ファスニング」「リベッティング」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2023年１月１日付で普通株式１株につき２株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] lobtexの主たる業界（金属製品事業） → 提案: 金属製品（作業工具・ファスナー）。売上高の95％超を占める金属製品事業は、作業工具・ファスニングツール・工業用ファスナー等の製造販売ですが、閉じた分類に金属製品や工具を表す区分がなく、製造業として最も近い machinery を暫定としました。
- [industry] lobtexの第2の業界（レジャー事業） → 提案: スポーツ・レジャー施設。レジャー事業はゴルフ練習場の運営ですが、閉じた分類にスポーツ施設やレジャー施設を表す区分がなく、娯楽・余暇として最も近い entertainment を暫定としました。
