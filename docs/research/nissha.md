# NISSHA — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＮＩＳＳＨＡ株式会社 |
| 証券コード | 7915 |
| docID（データを取り出した文書） | `S100XS06` |
| 原本 docID | `S100XS06` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XS06.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＮＩＳＳＨＡ株式会社 / 7915 / docID S100XS06（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nissha: 10 件の数値を有報XBRLと照合
有報: ＮＩＳＳＨＡ株式会社 有価証券報告書－第107期(2025/01/01－2025/12/31) (docID S100XS06)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":3862000000,"latestFiling":3851000000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":6213000000,"latestFiling":6202000000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":250780000000,"latestFiling":251847000000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-12-31","previousFiling":114167000000,"latestFiling":114297000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業・財務諸表の組替え・遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nissha: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「NISSHA株式会社」が EDINET の提出者名「ＮＩＳＳＨＡ株式会社」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 2024年12月期の数値の遡及修正の理由は、2024年3月取得のIsometric Intermediate LLC、2024年10月取得のCathtek, LLC、2025年1月取得の滋賀県製薬株式会社に係る暫定的な会計処理の確定によるものです。売上高は前期有報と差異がなく、範囲の変更はありません。非継続事業の記載は有報に見当たりませんでした。
- businessModel: strategy.disclosed では、長期ビジョンの数値目標のうち売上高3,000億円（うちメディカル分野1,500億円）だけを引用し、執筆規則で禁じられている投資の語にあたる目標値は省きました。
- businessModel: 2026年3月9日に第4回期限前償還条項付無担保社債（5,500百万円）を発行し、払込が完了しています（後発事象の記載。完了済みのため needsReview には入れていません）。
- businessStructure: 事業の並び順は2025年12月期の外部顧客への売上高の大きい順（産業資材76,315百万円、ディバイス58,452百万円、メディカルテクノロジー47,130百万円、その他13,000百万円）。「その他」は報告セグメントに含まれないため最後。
- businessStructure: セグメントの合計（181,897百万円）とその他（13,000百万円）の和は194,897百万円で、連結売上高の印字194,898百万円と1百万円ずれます。有報の丸めによるもので、印字の合計をそのまま引用しています。
- businessStructure: children は金額が独立して開示されていない製品区分のため、金額なしで記載しました。
- history: 創業時の資本金は記載していません（執筆規則による）。
- history: 沿革は会社設立以降の主な推移から会社全体の節目を選び、子会社単体の設立・工場竣工・吸収合併などの行は落としました（2025年1月のNISSHAエフエイト株式会社の吸収合併、2024年1月の株式会社エムクロッシングの吸収合併など）。
- history: USM Healthcareの子会社化は2026年3月取得予定として後発事象に記載されており、提出日時点で完了は確認できないため、沿革には入れず needsReview に記録しました。
- industry: 主たる業界は、最大の報告セグメントである産業資材事業（加飾フィルム・転写箔・蒸着紙などの素材・フィルム製品）に最も近い化学を暫定としました。東京証券取引所の業種分類ではその他製品に属します。
- industry: ディバイス事業（フィルムタッチセンサー・ガスセンサー）は報告セグメントとして金額が開示されているため、2つ目の業界として電機を付けました。
- relatedCompanies: 結ばなかった候補: horiba — 保有目的が「円滑な関係を維持し、地域社会の発展に協力して取り組むため」と一般的で、取引の向きが印字されていないため結ばない。
- relatedCompanies: 結ばなかった候補: kyoto-financial-group、mitsubishi-ufj-financial-group、mizuho-financial-group — 保有目的が金融取引先であり、銀行は資金調達が理由のため結ばない。
- relatedCompanies: 結ばなかった候補: mitsubishi-paper-mills — 保有目的は「資材等の仕入先」だが、1,100株・貸借対照表計上額0百万円と小規模のため結ばない。
- relatedCompanies: 結ばなかった候補: DIC、artience — 特定投資株式の表で「資材等の仕入先」と印字されているが、related-candidates.json に無いため結ばない。
- relatedCompanies: 結ばなかった候補: kyodo-printing — 2018年9月の株式譲渡契約による事業譲渡は過去1回限りの取引のため結ばない。olympus — 2020年11月のノーウォーク工場の資産買収は過去1回限りの取引のため結ばない。
- relatedCompanies: 結ばなかった候補: vision、port、land、en、technologies、core、step、suzuki-6785、base-4481、i-ll、seki、trust、innovation、career、ray、idea-consultants — 社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 大株主の状況の事業会社（鈴木興産株式会社、株式会社京都銀行、明治安田生命保険相互会社）は上場企業でないか金融機関のため結ばない。株式会社みずほ銀行の所有株式は退職給付信託の信託財産であり、銀行のため結ばない。
- relatedCompanies: USM Healthcare は2026年3月取得予定の未完了の子会社化で、上場企業でもないため結ばない。
- relatedCompanies: 島津製作所は販売先と仕入先の両面が印字されており、販売先が先に書かれているため customer とし、仕入先であることも説明に書きました。
- terms: 助言: 「IMD」「IML」「IME」は用語集の登録候補になります。プラスチックの成形と同時に加飾や機能を付与する技術で、産業資材事業の主力製品です。
- terms: 助言: 「CDMO」は用語集の登録候補になります。開発製造受託のことで、メディカルテクノロジー事業とその他事業（一般用医薬品）で展開しています。
- terms: 助言: 「蒸着紙」は用語集の登録候補になります。金属光沢と印刷適性を兼ね備えた紙で、飲料品や食品向けのサステナブル資材として使われています。

## 要確認（status に反映）

- businessModel: USM Healthcare（ベトナムの医療機器メーカー）の子会社化は、2026年1月23日の取締役会決議と同日付の株式譲渡契約締結が有報の後発事象に記載されていますが、取得日は2026年3月（予定）で、提出日時点で完了は確認できません。完了した事実として書かないでください。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] NISSHAの主たる業界 → 提案: その他製品（other-products など）。東京証券取引所の業種分類ではその他製品に属し、閉じた分類にその他製品を表す区分がないため、最大の報告セグメントである産業資材事業に最も近い化学を暫定としました。
