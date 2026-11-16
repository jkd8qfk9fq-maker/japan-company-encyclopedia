# 精工技研 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　精工技研 |
| 証券コード | 6834 |
| docID（データを取り出した文書） | `S100YB9C` |
| 原本 docID | `S100YB9C` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YB9C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　精工技研 / 6834 / docID S100YB9C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
seikoh-giken: 10 件の数値を有報XBRLと照合
有報: 株式会社　精工技研 有価証券報告書－第54期(2025/04/01－2026/03/31) (docID S100YB9C)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
seikoh-giken: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社精工技研」が EDINET の提出者名「株式会社　精工技研」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨てて記載した（連結売上高30,087百万円、親会社株主に帰属する当期純利益6,210百万円、セグメント外部売上高）。切り捨ての方針はここに記録する。セグメント外部売上高の切り捨て後の合計（9,963百万円＋20,124百万円）は連結売上高30,087百万円と一致する。
- businessModel: businessModel に suppliers は書いていない（このツリーのスキーマに無いキー）。仕入先・外注先との関係強化に努めている旨はMD&Aに印字されているが、個別の仕入先名の開示は無い。
- businessModel: financialNotes は空：前期有報との修正再表示チェックは全系列で差異ゼロ、決算期変更・変則決算の印字はなく、summary の irregularPeriods は空である。セグメント情報の地域ごとの情報で、前期の「北米」を「アメリカ」「メキシコ」「その他北米」に組み替えた表示方法の変更が印字されているが、表示の変更のみで経営指標等の数値に影響しないため warnings の記録にとどめた。
- businessModel: 中期経営計画『マスタープラン2022』の計数目標（2027年3月期の売上目標250億円、営業利益33億円を1年前倒しで達成した旨、2026年度末の新製品比率30％以上、特許登録件数の増加目標など）は収益・投資指標を含むため本文・戦略の文章には書かず、ここに記録する。
- businessModel: 受注高・受注残高・生産実績の金額（MD&Aに印字）は本文の数値として使っていない。
- businessModel: 連結子会社の香港精工技研有限公司は2026年4月に清算が結了した（決算日後の事象）ため needsReview に記録し、登録は2026年3月31日現在の体制で行った。重要な後発事象の注記は連結・個別とも『該当事項はありません』と印字されている。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高の大きい順（光製品関連20,124百万円／精機関連9,963百万円）。MD&Aのセグメント売上高は外部売上高と一致するが、セグメント利益は書いていない。
- businessStructure: 当社グループは当社と連結子会社11社（SEIKOH GIKEN USA,INC.、SEIKOH GIKEN EUROPE GmbH、杭州精工技研有限公司、大連精工技研有限公司、香港精工技研有限公司、不二電子工業株式会社、DATA PIXEL SAS、SEIKOH GIKEN (THAILAND) Co., Ltd.、株式会社エムジー、精工訊捷光電（杭州）有限公司、精工訊捷光電（鶴壁）有限公司）と持分法適用関連会社2社（浙江精工光電科技有限公司、蘇州安准智能装備有限公司）の計14社で構成される（2026年3月31日現在）。グループ会社は relatedCompanies には結んでいない。
- businessStructure: 香港精工技研有限公司は2026年4月に清算結了したため、提出日現在は存在していない。登録は決算日現在の体制で行い、事実は businessModel の needsReview に記録した。
- history: 沿革は【沿革】の印字から主要な出来事を選んだ。設立時や子会社設立時の資本金の金額は書いていない。
- history: 2026年4月の香港精工技研有限公司の清算は決算日後の事象であり、businessModel の needsReview にも記録した。
- history: 2001年の住友重機械工業株式会社の海外子会社からの光ディスク金型の部品販売及びメンテナンスに関する営業譲受、2023年1月の７Ｇａａ株式会社とのローカル５Ｇ関連ビジネスでの提携の行は、代表的な出来事に絞るため沿革の行としては採用しなかった。
- industry: 光コネクタ等の光通信用部品・機器を扱う光製品関連が売上高の約3分の2を占めるため主たる業界を electronics とし、精密金型・精密成形品等を扱う精機関連について machinery を併記した。閉じた分類の範囲で対応づけられており、分類の不足はない。
- relatedCompanies: denso は、セグメント情報の「主要な顧客ごとの情報」とMD&Aの相手先別販売実績に主要な顧客として印字されているため customer として結んだ。金額は関連企業の説明には書いていない。
- relatedCompanies: tokai-rika は、沿革と経営方針に小型部品向け型内塗装技術の共同開発が具体的に印字されているため business-partner として結んだ。
- relatedCompanies: 株式会社豊田自動織機は主要な顧客として印字されている（2026年3月期の販売実績の割合5.6％、前期は11.0％）が、related-candidates ではコードリストに無い相手とされており、ゲートで拒否されるため結ばなかった。事実はここに記録する。
- relatedCompanies: Corning Optical Communications, S.de R.L.de C.V. は光製品関連の主要な顧客として印字されている（2026年3月期の販売実績の割合10.5％）が、コーニングのメキシコ子会社で related-candidates に無いため結ばなかった。
- relatedCompanies: 住友重機械工業株式会社は、型内塗装システム「SSIMC」の共同開発・販売活動や、2001年の光ディスク金型の部品販売及びメンテナンスに関する営業譲受の事実が印字されているが、related-candidates に無いため結ばなかった。
- relatedCompanies: 住友電気工業株式会社は特定投資株式（8,766株）として、保有目的『安定的な取引関係の維持・発展を目的として保有』が印字されているが、取引の役割や分野が特定されていないため結ばなかった。
- relatedCompanies: 株式会社千葉銀行、株式会社三菱ＵＦＪフィナンシャル・グループ、株式会社みずほフィナンシャルグループは特定投資株式として『主要取引金融機関であり、営業情報の提供及び良好な取引関係を維持・強化するため』と同一の目的が印字されており、資金調達等の金融機関関係であるため結ばなかった。
- relatedCompanies: セイコーインスツル株式会社（2005年の光事業の営業譲受、2006年の大連精工技研有限公司の譲受の相手方）及びＮＥＣトーキン株式会社（2006年の光デバイス事業の営業譲受の相手方）は、いずれも related-candidates に無いため結ばなかった。営業譲受の事実は沿革に記録した。
- relatedCompanies: hikari-tsushin、kohsoku、king、base-4481、career、corona、cota、secure、core、okabe、en、hyper、innovation、port、ray、step、the-lead、trust、vision は一般語・地名・施設名等の一致（光通信、超高速、鎌ヶ谷、営業利益ベース、キャリア、コロナウイルス、インコタームズ、セキュア、コアテクノロジー、岡部工場、エンゲージメント、ハイパースケール、イノベーション、サポート、ファイバアレイ、ステップフェルール、リードタイム、信託口、ビジョン）で、相手企業への言及ではないため結ばなかった。
- terms: 助言のみ：光コネクタの接続部品である『フェルール』、光コネクタの端面を研磨する『光コネクタ研磨機』、光学部品をチップ上に集積する次世代通信技術の文脈で使われる『CPO（Co-Packaged Optics）』、金型内で塗装まで行う『型内塗装技術（SSIMC）』、電源なしで光信号を伝送する『無給電光伝送装置』は、この会社の解説で読者がつまずきやすい語として用語候補に挙げる。

## 要確認（status に反映）

- businessModel: 連結子会社の香港精工技研有限公司は、2010年9月に営業を停止して休眠化した後、2026年4月に清算が結了しています（事業の内容及び沿革に記載）。登録は2026年3月31日現在の体制（連結子会社11社）で行っています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
