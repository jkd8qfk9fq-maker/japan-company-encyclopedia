# 日本ライフライン — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本ライフライン株式会社 |
| 証券コード | 7575 |
| docID（データを取り出した文書） | `S100YEH7` |
| 原本 docID | `S100YEH7` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEH7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本ライフライン株式会社 / 7575 / docID S100YEH7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
japan-lifeline: 10 件の数値を有報XBRLと照合
有報: 日本ライフライン株式会社 有価証券報告書－第46期(2025/04/01－2026/03/31) (docID S100YEH7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
japan-lifeline: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: suppliers は省いた。有報は仕入について、海外メーカーの場合は国内輸入元、国内メーカーの場合は国内総販売元を経由する場合がある旨と、商品仕入の約70％が円建て取引である旨を述べるのみで、当社の調達先の種類を一般名詞では特定していないため。
- businessModel: 中期経営計画の数値目標（2028年3月期の売上高・新領域売上高の金額、営業利益率、EPS、ROICの目標と見通し）は転記せず、重点施策の内容のみを要約した。
- businessModel: 重要な契約等のうち、カーディオフォーカス社との内視鏡式レーザーバルーンに関する日本における独占販売契約は2025年12月に終了している（当期中に終了した事項として有報が注記）。
- businessModel: 重要な後発事象は連結・個別とも該当事項なし。会計方針の変更や株式分割の印字はない。
- businessStructure: 単一セグメント（医療機器事業）のため、セグメント注記の関連情報（製品およびサービスごとの情報）に開示された5つの品目区分を children とし、外部顧客への売上高の大きい順に並べた。
- businessStructure: 品目区分の外部顧客への売上高の合計は59,185百万円で、連結売上高59,187百万円と2百万円異なる。有報の印字どおりに転記した（丸めの差異）。
- businessStructure: 連結子会社はJLL Malaysia Sdn. Bhd.（マレーシア、議決権100％、EPカテーテル等の製造・販売、特定子会社）1社、非連結子会社はJLL Korea Co.,Ltd.1社である（【関係会社の状況】・【沿革】）。
- history: 沿革の各行は年月で印字されているが、スキーマに従い年のみを記録した。月は記録していない。
- history: 沿革に印字された資本金の金額は転記していない。
- history: 1985年の子会社設立・解散、1988年・2008年の本社移転、1999年のリサーチセンター開設、2010年のSynexmed (Hong Kong) Limited取得（2023年清算・譲渡）など、事業の転機ではない行は省略した。
- industry: 医療機器の製造・販売が売上のすべてを占めるが、閉じた分類に医療機器の区分がないため、最も近い医薬品（pharmaceuticals）を暫定の主たる業界とした。
- relatedCompanies: dvx（ディーブイエックス株式会社）: 主要な顧客で、2026年3月期の販売高は5,571百万円（売上高の9.4％）。ただし関連候補の listing が「（コードリストにない）」となっており上場区分を検証できないため結ばなかった。顧客の事実は businessModel の industryPosition に記載した。
- relatedCompanies: Conavi Medical Inc.: 特定投資株式として保有し、保有目的は「製品ラインの強化による将来的な企業価値向上のため」と印字されている。ただし海外企業で関連候補に無く、EDINETのコードリストでも検証できないため結ばなかった。
- relatedCompanies: ボストン・サイエンティフィックジャパン株式会社: CRM関連製品の日本における独占的販売代理店契約（2029年8月31日まで）の相手先だが、米国ボストン・サイエンティフィック社の日本子会社という独立した法人であり、関連候補にも無いため結ばなかった。
- relatedCompanies: 重要な契約等のそのほかの相手先（オクルテックホールディング社、カーディオフォーカス社、エンドロジックス社、エンドスパン社、ワラビー・メディカル社、ヘモネティクスジャパン合同会社）: いずれも未上場または海外の企業で関連候補に無いため結ばなかった。各社との独占販売権等の契約内容は有報の【重要な契約等】に記載のとおりである。
- relatedCompanies: 大株主のKS商事株式会社（2026年3月31日現在、発行済株式（自己株式を除く。）の15.76％）: 未上場で関連候補に無いため結ばなかった。日本マスタートラスト信託銀行株式会社（信託口）・株式会社日本カストディ銀行（信託口）は信託口の純投資のため結ばなかった。
- relatedCompanies: rhythm、the-lead、corona、zero、port、land、base-4481、en、seki、core、suzuki-6785、innovation、space、freee、heiwa、nissin、ricoh、trust: 製品名・一般語・地名・役員名などの部分一致であり、当社との取引・提携・資本関係を述べる記述が無いため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 助言: 「PFA（パルス・フィールド・アブレーション）」は心房細動の新しい治療法として本文の中心概念であり、用語集での解説が有用です。
- terms: 助言: 「Frozen Elephant Trunk（FET）」および自社ブランド「FROZENIX」は心血管関連の中核製品であり、用語・製品名としての整理が有用です。
- terms: 助言: 「TAVI（経カテーテル生体弁）」は構造的心疾患領域の成長ドライバーとして繰り返し言及されており、用語集での解説が有用です。

## 要確認（status に反映）

- businessStructure: 設備の新設、除却等の計画：新本社（東京都品川区）の新設が計画されています（2026年9月着手予定、2027年2月完了予定）。登録は2026年3月31日現在の本社（東京都品川区東品川）および体制に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 日本ライフライン（japan-lifeline）の主たる業界（医療機器の製造・販売） → 提案: 医療機器。心臓血管領域を中心とする医療機器専業の会社だが、閉じた業界分類に医療機器の区分がないため、最も近い医薬品を暫定で付けた。
