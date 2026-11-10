# ホクト — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ホクト株式会社 |
| 証券コード | 1379 |
| docID（データを取り出した文書） | `S100YKAZ` |
| 原本 docID | `S100YKAZ` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKAZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ホクト株式会社 / 1379 / docID S100YKAZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hokuto: 10 件の数値を有報XBRLと照合
有報: ホクト株式会社 有価証券報告書－第63期(2025/04/01－2026/03/31) (docID S100YKAZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hokuto: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全項目一致しており、変則決算・決算期変更もないため financialNotes は空とした。
- businessModel: 経営成績等の分析は当期純利益の増加要因として、上田第一きのこセンターの火災に係る受取保険金の発生を挙げているが、本文の財務数値は売上高と当期純利益だけとする規則に従い、その金額と要因は本文に書かなかった。
- businessModel: 中期経営計画の数値目標は本文に書かず、方針の記述にとどめた。
- businessModel: 経営ビジョンの後段（企業の社会的責任との両立に関する標語）は、利益に関する語を含むため本文では言い換えず省略した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（国内きのこ560億77百万円、化成品135億98百万円、海外きのこ82億36百万円、加工品80億３百万円）。化成品事業は内部売上高を含む合計では2番目に大きく、外部売上高でも2番目であることを確認した。
- businessStructure: セグメント注記の外部顧客への売上高の単純合計は85,914百万円で、連結売上高85,915百万円と1百万円異なる（印字の丸め）。本文の金額は経営成績等の分析に印字された億表記を用いた。
- history: 沿革表は年月セルが連続する行（〃）を含む崩れた表だが、年月と事象の数が一致する行は行順で対応づけた。個別のきのこセンターの設置・閉鎖、営業所の設置・移転などの細目は、主要なもの以外を省いた。
- history: 創業時の資本金は沿革に印字されていないため書いていない。
- history: 2025年のエリンギ発売は沿革ではなく経営成績等の分析に印字された事実で、出典の節を分けて記録した。
- industry: 報告セグメントは国内きのこ・海外きのこ・加工品・化成品の4つで、いずれも食品（きのこ・加工食品）が中核であり、化成品も食品向け包装資材と農業資材が中心のため、主たる業界は食品のみとした。
- relatedCompanies: イオン株式会社: 特定投資株式に「主に国内きのこ事業において、きのこの取引先」と印字されているが、related-candidates.json に含まれないため結ばなかった。
- relatedCompanies: アルピコホールディングス株式会社: 特定投資株式に「同グループ内の量販店がきのこの取引先」と印字されているが、related-candidates.json に含まれないため結ばなかった。
- relatedCompanies: 株式会社八十二長野銀行: 特定投資株式の保有目的は決済・資金借入・資金運用等の金融取引であり、大株主（4.95％）としても銀行そのものであるため結ばなかった。
- relatedCompanies: 株式会社三井住友フィナンシャルグループ: 保有目的はグループ内の銀行との資金借入・資金運用等の金融取引であるため結ばなかった。
- relatedCompanies: 株式会社三菱ＵＦＪフィナンシャル・グループ: 保有目的はグループ内の銀行及び信託銀行との決済・資金借入・資金運用等の金融取引であるため結ばなかった。
- relatedCompanies: 久光製薬株式会社: 当事業年度に株式公開買付けに応じて全株を売却し、保有株式数がゼロとなったため結ばなかった（候補一覧でも上場区分が確認できない）。
- relatedCompanies: 三木産業株式会社: 大株主（1.39％）だが related-candidates.json に含まれないため結ばなかった。
- relatedCompanies: 株式会社北斗: 大株主（18.73％）だが related-candidates.json に含まれず、上場も確認できないため結ばなかった。
- relatedCompanies: エン（en）: 一般語の部分一致で、当該企業との取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: キャリア（career）: 人材戦略の記述中の一般語の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: ベース（base-4481）: 「連結ベース」等の一般語の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: コア（core）: 一般語の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: トラスト（trust）: 信託銀行の信託口表記の部分一致であり、候補一覧でも上場区分が確認できないため結ばなかった。
- relatedCompanies: ビジョン（vision）: 「経営ビジョン」の一般語の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: ナイス（nice）: 社内表彰制度名の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: ポート（port）: 「事業ポートフォリオ」の一般語の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: イノベーション（innovation）: 人材類型の名称の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: ランド（land）: 「ブランド」等の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 大和（daiwa）: 沿革中の地名（大和町）の部分一致で、関係の印字がないため結ばなかった。
- relatedCompanies: 日新（nissin）: 曖昧な部分一致で、候補一覧でも上場区分が確認できず、関係の印字がないため結ばなかった。
- relatedCompanies: 連結子会社8社（ホクト産業、株式会社アーデン、HOKTO KINOKO COMPANY、台灣北斗生技股份有限公司、HOKTO MALAYSIA SDN.BHD.、株式会社サン・メディカ、Mushroom Wisdom,Inc.、PT HOKTO INDONESIA MATERIALS）は自社グループの会社のため関連企業には結ばなかった。
- terms: 助言: 用語「きのこで菌活」は、健康・美容・スポーツを３本柱として、きのこの需要喚起を図るためにホクトが提唱している考え方です。経営成績等の分析で営業活動の方針として使われています。
- terms: 助言: 用語「霜降りひらたけ」は、ホクトが「プレミアムきのこ」と位置づける独自品種のひらたけです。経営成績等の分析に印字されています。
- terms: 助言: 用語「ブナピー」は、ホクトが開発したブナシメジの新品種（ホクト白１号菌）の商品名で、生産量の内訳ではブナシメジに含めて数えられています。沿革と経営成績等の分析に印字されています。
- terms: 助言: 用語「Ｐ．Ｐビン」は、ポリプロピレン製のきのこ栽培用ビンで、化成品事業の主力の農業資材です。事業の内容と沿革に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
