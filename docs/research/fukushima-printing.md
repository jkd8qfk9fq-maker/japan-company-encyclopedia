# 福島印刷 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 福島印刷株式会社 |
| 証券コード | 7870 |
| docID（データを取り出した文書） | `S100X17L` |
| 原本 docID | `S100X17L` |
| 提出日（原本） | 2025-11-14 |
| 決算期 | 2025-08-20 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X17L.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 福島印刷株式会社 / 7870 / docID S100X17L（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fukushima-printing: 10 件の数値を有報XBRLと照合
有報: 福島印刷株式会社 有価証券報告書－第73期(2024/08/21－2025/08/20) (docID S100X17L)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
fukushima-printing: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えについて: 会計方針の注記（表示方法の変更）に、キャッシュ・フロー計算書の「預り金の増減額」を当期から独立掲記するため前事業年度の財務諸表の組替えを行った旨が印字されている。表示方法のみの変更で主要な経営指標等への影響はなく、前期有報との照合も全系列で差異ゼロのため、financialNotesには書かず、ここに記録する。
- businessModel: 経営方針の「目標とする経営指標」に掲げる利益率と自己資本比率の数値目標は、投資指標に当たるため本文・戦略には書かず、存在のみここに記録する。
- businessModel: ＭＤ＆Ａの利益項目の金額と増減理由、受注高・受注残高・生産実績の金額は書いていない。売上高の増減と理由のみを書いた。
- businessModel: 主要な顧客であるＴＯＰＰＡＮ株式会社については関連企業の工程で扱う（候補にないため結んでいない。詳細はrelatedCompaniesのwarningsを参照）。
- businessStructure: 単一セグメント（印刷事業）のため、報告セグメントではなく【事業の内容】の品目区分をchildrenとし、並び順はＭＤ＆Ａの販売実績（外部売上）の大きい順（ＤＭＤＰ4,112百万円／ＩＰＤＰ2,528百万円／ＢＦ複合605百万円／企画商印84百万円）とした。
- businessStructure: 品目別売上高の千円額の単純合計（7,331,484千円）は印字の合計（7,331,485千円）と1千円異なる。印字の合計をそのまま用いた。
- businessStructure: suppliersキーは旧スキーマのため省略した。原材料は原紙・インキ等で、特定の仕入先名は本文に印字されていない。買掛金の相手先として印字される株式会社タナックス・三菱王子紙販売株式会社等は関連企業候補にないため結んでいない。
- businessStructure: 設備は本社・工場（金沢市）とさいたまサテライトが生産用、福井・東京・大阪の各オフィスが販売業務であり、品目区分ごとの対応は印字されていないため事業には結びつけていない。
- history: 沿革表は年月と事象が崩れていない形で印字されているため、行順の対応づけは不要だった。
- history: 落とした項目: 工場・本社の移転（1954年・1961年・1969年・1987年）、営業所・出張所の開設と統合（1973年富山、1981年福井、1983年東京、1994年大阪、2000年名古屋、2012年大阪・名古屋の統合）、認証の取得（2001年プライバシーマーク等、2004年ＩＳＭＳ、2017年ＱＭＳ）、設備の増設類（2006年第二工場棟増築、2011年・2015年・2019年・2021年のインクジェット増設、2016年封入封緘設備、2017年ＤＭ加工機・高速輪転設備、2019年・2021年の設備増設）、2021年のサテライト工場の移転。いずれも拠点・認証・設備の細目であり、事業の転機ではないため落とした。
- history: 1952年の設立時の資本金額は印字されているが、沿革に資本金額を書かない規則により落とした。月は書いていない。
- industry: 主たる業界はmediaとした。閉じた分類の19種に印刷そのものを表す区分はないが、印刷業は本百科事典の慣例でmediaに分類する（大日本印刷等の印刷大手の分類、および総合商研＝商業印刷のmedia先例と同一の判断）ため、暫定ではなく直接の当てはめとしており、taxonomyGapsには書かない。
- industry: 副分類は付けていない。データプリントサービスは印刷事業の単一セグメント内のサービスであり、ＩＴサービスとして独立に開示された事業ではないため、itは付けていない。
- relatedCompanies: ＴＯＰＰＡＮ株式会社は【関連情報】主要な顧客ごとの情報に主要な顧客として印字されている（2025年8月期の売上高912百万円、総販売実績に対する割合12.45％。内、エンドユーザーであるサントリーウエルネス株式会社を対象とするものを含む）が、related-candidatesに含まれていないため結んでいない。事実のみここに記録する。
- relatedCompanies: cci-group: 特定投資株式の保有目的が「取引金融機関であり、取引関係の維持・強化のため保有しております。」で、全ての金融機関銘柄に共通の定型句であり、かつ資金調達先の金融機関であるため結ばない。
- relatedCompanies: sumitomo-mitsui-trust-group: cci-groupと同じく取引金融機関の定型句のみのため結ばない。
- relatedCompanies: the-first-bank-of-toyama: cci-groupと同じく取引金融機関の定型句のみのため結ばない。
- relatedCompanies: densan-system-holdings: 保有目的は「当社の顧客であり、取引関係の維持・強化のため保有しております。」で、全ての顧客銘柄に一字一句同じ定型句であり、個別の取引内容の印字がないため結ばない。
- relatedCompanies: goldwin: densan-system-holdingsと同じ定型句のみのため結ばない。
- relatedCompanies: komatsu-matere: densan-system-holdingsと同じ定型句のみのため結ばない。
- relatedCompanies: mitani-sekisan: densan-system-holdingsと同じ定型句のみのため結ばない。
- relatedCompanies: sankyo-tateyama: densan-system-holdingsと同じ定型句のみのため結ばない。
- relatedCompanies: shibuya: densan-system-holdingsと同じ定型句のみのため結ばない。
- relatedCompanies: takamatsu-machinery: densan-system-holdingsと同じ定型句のみのため結ばない。
- relatedCompanies: mitani-sangyo: 保有目的は「当社の顧客かつ仕入先であり、取引関係の維持・強化のため保有しております。」で、役割語だけを替えた同一の定型句であり、個別の取引内容の印字がないため結ばない。
- relatedCompanies: mitani: mitani-sangyoと同じ定型句のみのため結ばない。
- relatedCompanies: hokuriku-electric-power: 買掛金の相手先別内訳に金額とともに載るだけで、関係性の記述がないため結ばない。
- relatedCompanies: house-of-rose: 電子記録債権の相手先別内訳に金額とともに載るだけで、関係性の記述がないため結ばない。
- relatedCompanies: daito-pharmaceutical: 一致したのは大株主の状況の住所欄等に現れるダイトクコーポレーションという別名称であり、相手そのものではないため結ばない。
- relatedCompanies: base-4481 / kohsoku / core / vision / career / en / nac / transaction / zero: 一般語・部分一致（「ベースに」「高速インクジェット」「コア業務」「ビジョン」「キャリアプラン」「エンドユーザー」等）であり、相手そのものではないため結ばない。
- terms: 助言のみ。用語候補: 「データプリントサービス（ＤＰサービス）」（顧客のデータを受け取り、印刷・封入封緘・発送までを代行するサービスで、同社のＩＰＤＰ・ＤＭＤＰ両サービスの基盤）、「ビジネスフォーム」（コンピュータ出力帳票などの事務用帳票の総称で、同社の発祥の事業領域）、「封入封緘」（印刷物を封筒に入れて封をする後処理工程で、データプリントの付帯業務）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
