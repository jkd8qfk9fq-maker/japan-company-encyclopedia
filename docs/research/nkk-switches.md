# ＮＫＫスイッチズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＮＫＫスイッチズ株式会社 |
| 証券コード | 6943 |
| docID（データを取り出した文書） | `S100YQ47` |
| 原本 docID | `S100YJBX` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YQ47／有効文書 S100YQ47（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YQ47.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＮＫＫスイッチズ株式会社 / 6943 / docID S100YJBX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nkk-switches: 10 件の数値を有報XBRLと照合
有報: ＮＫＫスイッチズ株式会社 訂正有価証券報告書－第73期(2025/04/01－2026/03/31) (docID S100YQ47)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第73期(2025/04/01－2026/03/31)、docID S100YQ47）を有効文書としてこのパックを作った。原本は docID S100YJBX。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock・OutsideDirectorsAndOutsideCorporateAuditorsTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 前期の窓に 訂正有価証券報告書－第72期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
nkk-switches: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「NKKスイッチズ株式会社」が EDINET の提出者名「ＮＫＫスイッチズ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書（S100YQ47）はrecord-only分類で、財務の数値も本文も原本（S100YJBX）と同一であり、異なるのは役員に関する節だけのため、needsReviewには入れず警告として記録する。出典は訂正有報の値（docID S100YQ47、提出2026年7月21日）を使った。
- businessModel: 前期の窓にある第72期の訂正有価証券報告書については、証拠パックの修正再表示チェックで前期有報と重複する年度がすべて一致し修正再表示なしと確認できたため、financialNotesには書かなかった。
- businessModel: 売上総利益や営業利益、経常利益の金額・増減理由は本文に書いていない。受注高・受注残高の金額も書いていない。中期経営計画の目標数値やROE・ROICなどの投資指標も書いていない。
- businessModel: perspectivesのテキストにはリンク記法を使っていない（このツリーの指示どおり）。
- businessModel: 従業員数は連結の従業員数262人（2026年3月31日現在）を使った。
- businessStructure: 報告セグメントは地域別の「日本」「欧米」「アジア」の3区分で、並び順はセグメント注記の外部顧客への売上高の大きい順（欧米3,945百万円、日本3,337百万円、アジア1,091百万円、合計8,373百万円で連結売上高と一致）とした。
- businessStructure: suppliers キーはこのツリーの旧スキーマにないため省略した。個別の仕入先は有報に印字されていない。
- businessStructure: 子会社は10社と印字されているが、関係会社の状況に連結子会社として掲げられているのは7社である。事業の説明は事業の内容と関係会社の状況の印字に基づく。
- history: 沿革は有報の印字から主要な出来事を選んだ。資本金の金額は書いていない。
- history: Wikipediaの冒頭にあるトグルスイッチのシェアなど数値・順位は使わなかった。社名の由来（日本開閉器工業の頭文字）は沿革の設立の記載と重なるため、補足として使わなかった。
- industry: 主たる業界は electronics とした。産業用スイッチは電子・電気機器の部品であり、電機に直接合う。
- industry: スイッチは半導体そのものではなく、半導体を事業として開示しているわけでもないため semiconductors は付けなかった。
- relatedCompanies: ナ・デックス: 特定投資株式の保有目的が「当社事業における主要な販売先であり、取引関係の維持・強化」と個別に印字されているため、顧客として結んだ。
- relatedCompanies: 平河ヒューテック、三菱鉛筆、菊水ホールディングス、カンダホールディングス、ジオマテック、川崎地質、ソディック、日本航空: 特定投資株式の保有目的が全銘柄共通の定型句「取引関係の維持強化、有益な情報収集など…」のみで、個別の取引関係の記載がないため結ばなかった。
- relatedCompanies: 東洋証券、三井住友フィナンシャルグループ、三井住友トラストグループ: 金融取引が理由の保有で、資金調達・金融取引関係のため結ばなかった。
- relatedCompanies: en、seki、vision、base-4481、cota、taya、sanno、jeol: 一般語や部分一致、歴史の記述中の名称などで、各社との関係を述べる記載がないため結ばなかった。
- relatedCompanies: 候補にないため結べなかった相手: 千代田電子機器株式会社（2026年3月期の主要な顧客、売上高1,254百万円、日本セグメント）、株式会社日本電化工業所（同962百万円、日本セグメント）。いずれも related-candidates.json にない。
- relatedCompanies: 大株主の有限会社ビッグブリッヂ（2026年3月31日現在16.05％）などは候補にないため結ばなかった。株式会社三井住友銀行は大株主だが銀行のため結ばなかった。
- terms: 助言のみ。用語の追加提案: 産業用スイッチ（産業機器の操作に使うスイッチ）、トグルスイッチ（レバーを倒して切り替えるスイッチ）。
- terms: 用語の提案は助言であり、データには何も追加していない。

## 要確認（status に反映）

- businessModel: 子会社のNKK Switches Hong Kong Co., Ltd.について、第74期下半期に販売機能を他のグループ会社に移管し、同社は営業支援を行う会社となる予定と印字されています。提出後の予定事項のため、2026年3月31日現在の体制で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
