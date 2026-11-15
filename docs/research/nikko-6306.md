# 日工 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日工株式会社 |
| 証券コード | 6306 |
| docID（データを取り出した文書） | `S100YH1J` |
| 原本 docID | `S100YH1J` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH1J.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日工株式会社 / 6306 / docID S100YH1J（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nikko-6306: 10 件の数値を有報XBRLと照合
有報: 日工株式会社 有価証券報告書－第163期(2025/04/01－2026/03/31) (docID S100YH1J)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nikko-6306: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は有報の百万円印字のとおり転記した（千円額からの切捨て換算は行っていない）。
- businessModel: 証拠パックの組替え注意について、抽出セクション内に表示方法の変更・組替えの注記は確認できず（会計方針の変更は連結・個別とも「該当事項なし」）、前期有報との修正再表示チェックも全系列一致のため、financialNotesには記録せず本warningsに判断を留めた。
- businessModel: 2030年ビジョン及び中期経営計画の数値目標（売上高・営業利益率・ROE・時価総額・配当性向）は利益・投資指標であるためstrategyには転記せず、定性的な方針のみを記載した。
- businessModel: 特定投資株式の注記に印字される株式分割は、日本ヒューム株式会社・株式会社鶴見製作所・三谷セキサン株式会社・阪和興業株式会社という保有先企業のものであり、当社の株式分割ではないためneedsReviewには記録していない。
- businessModel: 破砕機関連事業の事業用資産に減損損失が計上されているが、金額は本文の記載対象外のため記載していない。
- businessModel: 受注高・受注残高の金額及び増減率は本文に記載していない。
- businessModel: 本ツリー（jce-w3）のスキーマにsuppliersキーが存在しないためsuppliersは記載していない。有報に個別の仕入先の印字もない。
- businessStructure: セグメント間の内部売上高又は振替高を含む数値は用いず、事業の金額はセグメント情報の外部顧客への売上高のみを記載した。
- businessStructure: 「その他」は有報が報告セグメントに含まれない事業セグメントと明記する区分のため、外部売上高の金額順ではなく最後に置いた。
- businessStructure: 報告セグメント5区分の外部顧客への売上高の単純合計は43,846百万円で、セグメント情報に印字された報告セグメント計43,848百万円と2百万円異なる（印字の集計差異）。本文には印字された区分別金額と連結売上高を用いた。
- businessStructure: 関係会社の状況に印字される連結子会社の資本金は、禁止金額に当たるため転記していない。
- history: 沿革の2012年10月から2020年1月までの6件は、年月と事象文が分かれて印字された崩れた表であり、年月の数（6）と事象文の数（6）が一致したため行順に対応づけた（2012年10月=日工ダイヤクリート吸収合併、2015年3月=山推楚天の持分譲渡、2015年4月=Benninghoven一部譲渡、2018年10月=テクノセンター新築、2018年12月=Benninghoven全部譲渡、2020年1月=日工マシナリー関西工場新設）。
- history: 2004年・2005年の日工（上海）工程機械有限公司の増資の行は、金額が資本に関するものであるため転記していない。
- history: 営業所・出張所の開設など軽微な行は省略し、設立・上場・社名変更・事業開始・譲受・子会社化・合併・持分譲渡などの主要な行を選んだ。
- industry: 主たる業界は、プラント・機械の製造販売が売上高の大半を占めるため machinery とした。建設機械そのものの区分は閉じた分類に無いが、機械製造業として machinery が最も近い値であり、暫定値ではないため taxonomyGaps には記録していない。売上高の中心が機械設備の製造販売であるため副業界は付していない。
- relatedCompanies: 結んだ7社の保有目的は、対象事業（アスファルトプラント／コンクリートプラント／環境及び搬送）が銘柄ごとに個別に印字されており、取引の向き（販売・仕入）は印字されていないため business-partner とした。目的文の末尾は共通でも、事業分野が銘柄ごとに異なる点を根拠とした。
- relatedCompanies: 株式会社日伝は候補で ambiguous とされるが、特定投資株式の表に社名と株式数が個別に印字されており同一性を確認したため結んだ。
- relatedCompanies: 株式会社ノザワ、株式会社鶴見製作所、酒井重工業株式会社、阪和興業株式会社、神戸電鉄株式会社は、保有目的が全銘柄共通の定型句「取引関係の維持・強化のため保有」のみで事業別の関係の印字がないため結ばなかった（神戸電鉄は保有1,000株と僅少でもある）。
- relatedCompanies: 株式会社三井住友フィナンシャルグループは、保有目的が財務政策上の理由であり、金融機関との資金調達等の関係は結ばないため結ばなかった。
- relatedCompanies: 株式会社立花エレテックは当事業年度に全株式を売却し保有がゼロとなったため結ばなかった。
- relatedCompanies: 東亜道路工業株式会社、インフロニア・ホールディングス株式会社、鹿島建設株式会社は、保有目的が純投資目的へ変更済みで政策保有ではなくなっているため結ばなかった（変更の事実は株式の保有状況に印字）。
- relatedCompanies: 三菱重工業株式会社は、2006年にコンクリートポンプ事業を譲り受けた過去の1回の取引のみで、現在の取引・提携関係の印字がないため結ばなかった。
- relatedCompanies: 候補の vision・en・port・core・zero・cover・base-4481・innovation・suzuki-6785・trust は語の一致のみで当該企業への言及ではない（vision=2030年ビジョン、port=パイプサポート、core=コア技術、zero=実質ゼロ、cover=動詞のカバー、base-4481=営業利益ベース、innovation=グリーンイノベーション基金、suzuki-6785=創業時の鈴木商店、trust=コードリストにない）。
- relatedCompanies: systems-engineering-consultants（株式会社セック）は、当社の連結子会社である日工セック株式会社への言及と一致したもので、株式会社セックとは別の法人のため結ばなかった。
- relatedCompanies: 大株主の中西電機工業株式会社・湊ハマ株式会社は未上場で候補に無く、取引関係の印字もないため結ばなかった。日工社員持株会・日工取引先持株会は持株会であり結ぶ対象ではない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

- businessModel: 連結子会社のNikko Asia (Thailand) Co.,Ltd.は清算手続中であり、当連結会計年度に清算に伴う事務費用の見込額等が計上されております（連結財務諸表の注記に印字）。本登録は2026年3月31日時点のグループ構成（当社、子会社14社）で行います。
- businessModel: 連結子会社のNikko Global Manufacturing (Thailand) Co.,Ltd.は、2026年4月1日付でNikko Asia-Engineering (Thailand) Co., Ltd.に社名変更しております（関係会社の状況の注記に印字）。本登録は2026年3月31日時点の社名・グループ構成で行います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
