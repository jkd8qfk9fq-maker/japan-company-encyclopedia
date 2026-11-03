# 平和堂 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　平和堂 |
| 証券コード | 8276 |
| docID（データを取り出した文書） | `S100Y2FB` |
| 原本 docID | `S100Y2FB` |
| 提出日（原本） | 2026-05-11 |
| 決算期 | 2026-02-20 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y2FB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　平和堂 / 8276 / docID S100Y2FB（id は英語表記「HEIWADO CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 7 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 1 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
heiwado: 10 件の数値を有報XBRLと照合
有報: 株式会社　平和堂 有価証券報告書－第69期(2025/02/21－2026/02/20) (docID S100Y2FB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第67期(2023/02/21－2024/02/20) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第66期(2022/02/21－2023/02/20) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第65期(2021/02/21－2022/02/20) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第64期(2020/02/21－2021/02/20) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第63期(2019/02/21－2020/02/20) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
heiwado: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社  平和堂」が EDINET の提出者名「株式会社　平和堂」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 営業収益と純利益は有報の経営成績の印字（億円表記）を使った。2030年定量目標は目標値のため書かなかった。
- businessModel: 営業利益・経常利益・セグメント利益と総資産などは規則により書かなかった。
- businessModel: financialNotes は変則決算などの事実が無いので空にした。
- businessStructure: 決算期は表紙のDEIから2026年2月期（2025年2月21日〜2026年2月20日）。
- businessStructure: 事業の並びは外部顧客への売上高の順（小売432,348、小売周辺6,867、その他16,793）ではなく、その他が「報告セグメントに含まれない事業セグメント」と注記されているため最後にした。小売周辺は報告セグメントなので、その他より前に置いた。
- businessStructure: 小売事業の children は、有報に独立した売上高の開示が無いので置かなかった（空配列）。
- businessStructure: shortNameEn は表紙の英訳名 HEIWADO CO.,LTD. から接尾辞を除いたもの。
- businessStructure: related-candidates.json と wikipedia.json は証拠パックに無く、使っていない。
- history: 資本金の金額は規則により書かなかった。
- history: 沿革の表は崩れておらず、年月と事象は対応している。
- history: 本社移転・流通センターなど一部の行は省いた。
- industry: 小売事業が外部顧客への売上高の大半を占める報告セグメントのため、小売を主たる業界にした。
- relatedCompanies: related-candidates.json が証拠パックに無い。有報の【関係会社の状況】に載る連結子会社12社（ファイブスター、シー・オー・エム、ベストーネ、ナショナルメンテナンス、ダイレクト・ショップ、加賀コミュニティプラザ、武生駅北パーキング、平和堂（中国）有限公司、湖南平和物業発展有限公司、福井南部商業開発、富山フューチャー開発）はいずれも有価証券報告書を提出しておらず、掲載済みの上場企業ではないため結ばなかった。
- terms: 用語集への追加候補：HOP経済圏（平和堂のカード・電子マネー・アプリを軸にした自社経済圏）、ドミナント戦略（特定地域に集中して出店する戦略）、KVI（キーバリューアイテム）。いずれも有報の用語で、定義は有報に説明が無いため、助言にとどめた。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
