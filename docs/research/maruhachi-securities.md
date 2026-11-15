# 丸八証券 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 丸八証券株式会社 |
| 証券コード | 8700 |
| docID（データを取り出した文書） | `S100YEDZ` |
| 原本 docID | `S100YEDZ` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEDZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 丸八証券株式会社 / 8700 / docID S100YEDZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
maruhachi-securities: 10 件の数値を有報XBRLと照合
有報: 丸八証券株式会社 有価証券報告書－第84期(2025/04/01－2026/03/31) (docID S100YEDZ)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（営業収益 / 純営業収益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
maruhachi-securities: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 収益の候補は営業収益と純営業収益の2つが印字されているが、主要な経営指標等の推移の先頭行であり標準要素である営業収益（2026年3月期3,576百万円）を収益として採用した。ステージングの数値表も営業収益で構築されている。純営業収益（同3,560百万円）は金融費用を差し引いた後の値であり、本文の収益としては書かなかった。
- businessModel: 中期経営計画の数値目標（2028年3月末に預り資産3,600億円、自己資本利益率（ROE）8.0％）と、MD&Aに印字された当事業年度末の実績値（預り資産3,203億円、ROE8.7％）は投資指標・目標値であるため本文と戦略には書かず、この warnings に記録した。
- businessModel: 主要な経営指標等の注記1〜7（連結財務諸表を作成していない旨、比率の算式、関連会社がない旨、潜在株式がない旨、比較指標の説明、最高・最低株価の市場区分、第82期の配当額に設立80周年記念配当20円を含む旨）は表示事項のため financialNotes には入れなかった。前期有報との修正再表示チェックでは重複する年度の全系列が一致し、会計方針の変更の印字もないため financialNotes は空とした。
- businessModel: トレーディング損益（2026年3月期737百万円）や金融収支などの損益科目の金額と増減理由は、本文の財務数値は営業収益と当期純利益だけとする規則のため書かなかった（収益源の列挙にとどめた）。
- businessModel: 親会社の東海東京フィナンシャル・ホールディングス株式会社については relatedCompanies に記載した。2021年に同社がエース証券株式会社を公開買付けで取得し、同年11月に親会社が同社1社のみとなった経緯は沿革に記載した。
- businessStructure: 報告セグメントは「投資・金融サービス業」の単一セグメントであるため、事業の内容に印字された主要業務の区分で子事業を構成した。セグメント別の収益は開示されていない。
- businessStructure: 店舗数は主要な設備の状況の印字（本店・西尾支店・蒲郡支店・安城支店・庄内支店の5事業所、いずれも賃借店舗）に基づく。
- businessStructure: suppliers はこの作業ツリーのスキーマに無いため書かなかった。仕入先にあたる個別の相手の印字も有報にはない。
- businessStructure: 親会社の東海東京フィナンシャル・ホールディングス株式会社はグループ会社であり、事業構造ではなく relatedCompanies に記載した。当社に子会社・関連会社はない（関係会社の状況には親会社のみが印字されている）。
- history: 2002年の増資、2005年・2011年・2013年の転換社債の株式転換や新株予約権の権利行使に伴う資本金の変動の行は、資本金の金額を含むため沿革には書かなかった。2011年の行についてはエース証券の子会社となった事実のみを沿革に記載した。
- history: 1982年の累積投資業務の代理業務、1984年の投資信託の収益金等支払いの代理業務、1988年の抵当証券の販売媒介・保管業務の各兼業承認の行と、2010年の本社移転、2010年の大阪証券取引所ＪＡＳＤＡＱ上場・2013年の東京証券取引所ＪＡＳＤＡＱ（スタンダード）上場の各市場統合に伴う行は、主要な出来事ではないため落とした。
- history: 行数の対応は沿革表の印字どおりで、年月と事象は1対1に対応している。
- industry: 金融商品取引業（証券業）を単一セグメント「投資・金融サービス業」として営んでおり、閉じたリストでは finance が直接該当するため、産業は finance のみとした。
- relatedCompanies: tokai-tokyo-financial-holdings: 関係会社の状況に親会社として印字されており、被所有割合43.6％・役員の受入ありのため parent として結んだ。
- relatedCompanies: nomura-holdings: 特定投資株式は同社の1銘柄のみが開示され、保有目的に取引先としての長期にわたる親密な取引関係が個別に印字されているため business-partner として結んだ。同社の子会社である野村證券株式会社と野村プロパティーズ株式会社は大株主の状況に載るが、別法人であり候補でもないため結ばなかった。
- relatedCompanies: suzuki-6785: 代表取締役社長の姓「鈴木」との一致（ambiguous）で、社名の一致ではないため結ばなかった。
- relatedCompanies: career: 「キャリア教育の支援」など一般語の一致のため結ばなかった。
- relatedCompanies: seki / port / base-4481 / core / land / ray: 「セキュリティ」「家族サポート証券口座」「ベースアップ」「iシェアーズ・コア」「南アフリカランド」「ロールプレイング」など部分一致・一般語の一致のため結ばなかった。
- relatedCompanies: canon / cosmo-energy-holdings / kyushu-financial-group / kameda-seika / mitsuboshi-belting / nisso-holdings: 有価証券明細表等に投資有価証券の保有銘柄として現れるのみで、取引・提携の印字がないため結ばなかった。
- relatedCompanies: future / innovation: 投資信託のファンド名の一部としての一致のため結ばなかった。
- relatedCompanies: 大株主の状況の豊証券株式会社（7.79％）・中村吉孝氏・細川幸祐氏などは候補にないため結ばなかった。エース証券株式会社は2011年から2021年まで親会社であったが、現在の関係の印字はなく候補にもないため結ばなかった（経緯は沿革に記載）。
- relatedCompanies: 当社に子会社・関連会社はないため、グループ会社の記載はない。
- terms: 助言: 用語「家族サポート証券口座」は、高齢の顧客が将来にわたって安心して取引を続けられるよう家族と連携する仕組みとして当社が取扱いを開始した証券口座のサービスを指す。
- terms: 助言: 用語「自己資本規制比率」は、金融商品取引業者の経営の健全性を測る指標で、固定化されていない自己資本の額のリスク相当額の合計に対する比率を指す。金融商品取引法等により一定以上に維持することが義務づけられている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
