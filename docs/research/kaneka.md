# カネカ — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カネカ |
| 証券コード | 4118 |
| docID（データを取り出した文書） | `S100YIFD` |
| 原本 docID | `S100YIFD` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIFD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カネカ / 4118 / docID S100YIFD（id は英語表記「KANEKA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 5 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kaneka: 10 件の数値を有報XBRLと照合
有報: 株式会社カネカ 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YIFD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kaneka: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEI（第102期、2025/04/01〜2026/03/31）から2026年3月期。通常決算。
- businessModel: 金額は百万円の表の印字値だけを書いた。MD&Aの『売上高、純利益は過去最高』は MD&A の見出しの印字による。利益に関する他の数値は書いていない。
- businessModel: 従業員数11,762人は主要な経営指標等（連結）の印字値。
- businessModel: 地域別売上高の5地域の合計は811,637で、印字された合計811,638と1ずれる（有報の丸め）。合計は印字値を使った。
- businessModel: customers の記述は、有報の事業の内容・関係会社の状況（営業上の取引等）から読める範囲にとどめ、個別の社名・金額は書いていない。
- businessModel: Wikipedia（wikipedia.json）は証拠パックになく、使っていない。perspectives（戦略・強み）は書いていない。
- businessModel: 財務5年表の前期有報との比較で修正再表示はない。brief.md は本文に『財務諸表の組替え』の記載があると注意している。該当注記は読んでおらず、数値の範囲への影響は確認していない。
- businessStructure: 決算期は表紙のDEIで確認：第102期、2025年4月1日〜2026年3月31日、Japan GAAP、連結あり、訂正なし（amendments status none）。上場は表紙の「東京証券取引所プライム市場」から。
- businessStructure: 並び順は外部顧客への売上高（2026年3月期、百万円）：Material 327,235＞Nutrition 205,977＞Quality of Life 194,340＞Health Care 82,975。「その他」1,109は報告セグメントに含まれないので最後。MD&Aの順（Material・QoL・Health Care・Nutrition）には従っていない。
- businessStructure: SV（Solutions Vehicle）単位の売上高はセグメント注記に印字がないため、SVは children にせず products に製品名だけ載せた。「Pharma & Supplemental Nutrition」は1つのSVだが、セグメント注記は Pharma を Health Care に、Supplemental Nutrition を Nutrition に分けて置いているのでその通りにした。
- businessStructure: 利益に関する数値と増減は本文に書いていない。各セグメントの増収・減収の理由はMD&Aの記述から要約した。
- businessStructure: Health Care の「消化器および循環器領域の医療器材事業の譲渡を受けた」は、セグメント情報の負ののれん発生益の注記の記載による（金額は書いていない）。
- businessStructure: 主要な設備の状況では、高砂工業所は4区分を連記しているため、どの事業にも結びつけなかった。
- businessStructure: Wikipedia（wikipedia.json）は証拠パックになく、使っていない。
- history: 沿革の表に、年月のセルが連続して印字され事象文と分かれている崩れたブロックが3つある（1974年10月・12月、1994年10月〜1999年3月、1999年10月〜2004年9月）。年月と事象の数は各ブロックで同じ（2／9／6）なので行順で対応づけた。採用したのは2001年4月（機能性食品素材、事象文の括弧書きの理由と内容が一致）と2004年9月（商号変更、2004年の社名変更として一致）の2件のみ。ほかのブロックの行は使っていない。
- history: 資本金の額は、金額の規則により書いていない。
- industry: primary は chemicals。最大の報告セグメントMaterial Solutions Unit（外部顧客への売上高 327,235百万円）は塩化ビニル樹脂・モディファイヤーなどの樹脂で、沿革も合成樹脂を中核とする総合化学会社と書く。Quality of Life（194,340百万円）の発泡樹脂・フィルム・繊維も樹脂・素材。
- industry: food: Nutrition Solutions Unit（205,977百万円、報告セグメント）がマーガリン・ショートニング・パン酵母・香辛料などを含む。
- industry: pharmaceuticals: Health Care Solutions Unit（82,975百万円、報告セグメント）が低分子医薬品原料・API・バイオ医薬品を含む。医療機器も同セグメントだが、該当する区分が無い。
- industry: 半導体向けの材料としてはポリイミドフィルム等が電子材料として載るが、半導体向けとしての開示は無いため semiconductors は付けていない。
- industry: 太陽電池・蓄電池（PV & Energy management）は金額が独立して開示されていないため、energy は付けていない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業として同一性を確かめられる相手がいないため、結んだ相手は無い。
- relatedCompanies: 【関係会社の状況】の連結子会社（カネカ食品㈱、セメダイン㈱、AB-Biotics, S.A.、EndoStream Medical Ltd.など）は、掲載済みで上場の候補として確認できていないため結んでいない。セメダイン㈱は2022年8月に完全子会社化されている。
- relatedCompanies: 親会社・その他の関係会社・持分法適用関連会社（2社）の社名は【関係会社の状況】に印字がなく、結べない。大株主の状況・株式の保有状況はこの工程では読んでいない。
- terms: 助言のみ。用語の候補: 報告セグメント、Solutions Vehicle／Solutions Unit（カネカ独自の組織名）、モディファイヤー（塩ビなどの樹脂に混ぜて強さを足す添加剤）、変成シリコーンポリマー、ポリイミドフィルム、コエンザイムＱ１０、血液浄化器、API（医薬品の有効成分）。定義は有報にないため、登録時は別途一次資料で確認する前提。src/data/terms/ にあるかは確認していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] カネカのHealth Care Solutions Unitの医療機器（血液浄化器、カテーテルなど） → 提案: 医療機器。Health Care Solutions Unitは報告セグメント（2026年3月期の外部顧客への売上高 82,975百万円）で、有報はMedicalを最大の収益事業と書く。閉じた分類に医療機器の区分が無い。
