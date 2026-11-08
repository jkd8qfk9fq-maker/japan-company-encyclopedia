# 日産車体 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日産車体株式会社 |
| 証券コード | 7222 |
| docID（データを取り出した文書） | `S100YGCO` |
| 原本 docID | `S100YGCO` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGCO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日産車体株式会社 / 7222 / docID S100YGCO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nissan-shatai: 10 件の数値を有報XBRLと照合
有報: 日産車体株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YGCO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nissan-shatai: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…持費用などのコストを差し引いた残りが利益になります。2026年3月期のは6,…）

## エージェントの判断記録（fragment warnings）

- businessModel: 組替えの注意への対応: 経営指標等の注記4のとおり、2022年改正の法人税等に関する会計基準を第102期の期首から適用し、第101期の経営指標は遡及適用後の数値である。この事実を financialNotes に記録した。修正再表示チェックは前期有報と全項目一致している。
- businessModel: 中期経営計画の定量目標など、本文には書いていない数値目標がある場合は perspectives にも記載していない。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。4区分はいずれも報告セグメントである。
- businessStructure: 自動車関連の children（完成車／部分品・車体・特別架装）は【事業の内容】の区分によるもので、金額は独立して開示されていないため金額は書いていない。
- businessStructure: 湘南工場のサービス部品生産への事業転換は、当期に固定資産の減損損失と事業構造改革引当金を計上した進行中の再編として経営成績の分析に記載されている事項であり、提出後に未了の予定事項ではないため needsReview には入れなかった。減損損失・引当金の金額は規則により本文に書いていない。
- businessStructure: Wikipedia は有報と重なる内容が中心で、生産能力や稼働率などの数値は規則により使えないため、補足には使わなかった。
- history: 沿革は有報【沿革】の表の記載どおりに記載した。年月と事象は行ごとに対応している。
- history: 設立時の資本金（1949年の資本金1億円）など、沿革中の金額は規則により本文に書いていない。
- industry: 主たる業界は、外部顧客への売上高のほぼすべてを占める自動車関連セグメント（完成車・部分品の製造販売）から automotive とした。
- industry: 情報処理・人材派遣・設備メンテナンスはグループ向けの支援サービスで外部顧客への売上高も小さく（3,169百万円・2,167百万円・872百万円）、2つ目の業界は付けなかった。
- relatedCompanies: 連結子会社6社（日産車体九州、日産車体マニュファクチュアリング、日産車体エンジニアリング、オートワークス京都、日産車体コンピュータサービス、プロスタッフ）はいずれも未上場で候補にないため結ばなかった。
- relatedCompanies: career: 「キャリア」は新卒採用や就業環境の文脈で使われる一般語への一致で、株式会社キャリアへの言及はない。
- relatedCompanies: port: 「ポート」は「サポート事業」「レポート」などの一部への一致で、ポート株式会社への言及はない。
- relatedCompanies: en: ambiguous。「エン」は「エンジン」の一部への一致で、エン株式会社への言及はない。
- relatedCompanies: seki: ambiguous。「セキ」は「情報セキュリティ」などの一部への一致で、セキ株式会社への言及はない。
- relatedCompanies: lec: 「レック」は「フレックス勤務」などの一部への一致で、レック株式会社への言及はない。
- relatedCompanies: suzuki-6785: ambiguous。経理部主管の個人名「鈴木宏章」への一致で、株式会社鈴木への言及はない。
- relatedCompanies: trust: listing がコードリストにない。「トラスト」は大株主名簿の信託機関名の一部への一致で、株式会社トラストへの言及はない。
- relatedCompanies: base-4481: 「ベース」は「営業利益ベース」「連結ベース」の一般語への一致で、ベース株式会社への言及はない。
- relatedCompanies: cover: 「カバー」は「保険でカバーされる」の一般語への一致で、カバー株式会社への言及はない。
- relatedCompanies: crooz: 「クルーズ」は「インテリジェントクルーズコントロール」の機能名への一致で、クルーズ株式会社への言及はない。
- relatedCompanies: freee: 「フリー」は「フリー・キャッシュフロー」の一般語への一致で、フリー株式会社への言及はない。
- relatedCompanies: innovation: 「イノベーション」はコーポレートパーパスの文言への一致で、株式会社イノベーションへの言及はない。
- relatedCompanies: land: 「ランド」は「ブランド」の一部への一致で、株式会社ランドへの言及はない。
- relatedCompanies: path: ambiguous。「パス」はコーポレートパーパスなどの文言への一致で、パス株式会社への言及はない。
- relatedCompanies: ray: ambiguous。「レイ」は「パワートレイン」などの一部への一致で、株式会社レイへの言及はない。
- relatedCompanies: ricoh: 「リコー」は「リコール」の一部への一致で、株式会社リコーへの言及はない。
- relatedCompanies: core: ambiguous。「コア」は「コア技術」の一般語への一致で、株式会社コアへの言及はない。
- relatedCompanies: idea-consultants: 車種名「AD」の記載文脈への一致で、いであ株式会社への言及はない。
- relatedCompanies: japan-airlines: 沿革に登場する前身会社「日本航空工業」への一致で、日本航空株式会社ではない。
- relatedCompanies: kohsoku: ambiguous。「高速」は「高速道路」の一般語への一致で、株式会社高速への言及はない。
- relatedCompanies: yamato: 「ヤマトモビリティとの協業」への言及で、株式会社ヤマトではない。ヤマトモビリティは候補にない別の会社であり、協業の主体は子会社の事業文脈であるため結ばなかった。
- terms: 登録候補（助言のみ）: 特別架装（車両の用途に合わせて架装を施すこと。特装車の製造）、有償支給（親会社から部品を有償で支給を受けて製造する方式）、サービス部品（生産終了後の補修用部品）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
