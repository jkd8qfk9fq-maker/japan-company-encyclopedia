# テイン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社テイン |
| 証券コード | 7217 |
| docID（データを取り出した文書） | `S100YIDI` |
| 原本 docID | `S100YIDI` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIDI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社テイン / 7217 / docID S100YIDI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tein: 10 件の数値を有報XBRLと照合
有報: 株式会社テイン 有価証券報告書－第43期(2025/04/01－2026/03/31) (docID S100YIDI)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":5316141000,"latestFiling":5344800000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tein: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックでは、2025年3月期の売上高だけに差異がありました（前期有報の5,316,141千円に対し当期有報では5,344,800千円）。主要な経営指標等の注記3と経営成績等の分析に、2026年3月期より顧客から受領する運賃収入の表示方法を営業外収益から売上高に変更し、過年度の数値は組替え後の数値を用いる旨が印字されているため、表示方法の変更として2025年3月期の financialNotes に記録しました。純利益・利益・総資産・純資産・従業員数の各系列に差異はありませんでした。
- businessModel: 重要な後発事象として、自己株式の消却（2026年4月22日の取締役会決議、2026年4月30日完了）が印字されています。資本政策の事項であり、期末の構造に影響しないため warnings に記録しました。
- businessModel: 長期経営ビジョンに掲げる売上高の数値目標と、経営指標としてのROAの数値は、目標・投資指標の規則により本文と perspectives には書かず、存在だけをここに記録しました。
- businessModel: 主要な経営指標等の注記のうち、潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していない旨は表示の事項のため、financialNotes には入れずここに記録しました。
- businessModel: 【株式の保有状況】は「該当事項はありません」であり、政策保有株式はありません。【重要な契約等】も「該当事項はありません」でした。
- businessStructure: 当社グループは自動車用サスペンションの製造・販売事業の単一セグメントであり、セグメント情報と製品・サービスごとの情報はいずれも記載が省略されているため、事業は1つだけとし、金額を持つ children は設けませんでした。
- businessStructure: TEIN Manufacturing(Thailand),Co.,Ltd.は2025年11月に新設された連結子会社ですが、2026年3月31日現在は事業活動を開始していない旨が【事業の内容】に印字されています。期末の構造として連結子会社に含まれる会社です。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略しました。製品用資材や消耗品等の調達は、中国の連結子会社である天御減振器制造(江蘇)有限公司と宿遷天野貿易有限公司が調査・調整活動を行っている旨が【事業の内容】に印字されています。
- history: 沿革の表は、年月と事象が1つの文章に連なって印字される形式でした。各事象の冒頭に年月が印字されているため、印字順に対応づけました。資本金の金額（1985年の再出発時など）は規則により本文に書きませんでした。
- history: 沿革のうち、工場の新設・移転・廃止（1989年、1994年、1995年、1996年、1997年、1998年）、営業所の設置（1999年の大阪・横浜・仙台）、1999年の形式上の存続会社との合併（額面金額の変更のため）、2003年の本社工場等の集約移転、2010年と2013年の証券取引所の統合・市場名称の変更、2014年の本社工場の移転は、事業の転機ではないため落としました。
- industry: 主たる業界は自動車用サスペンションの製造・販売であり、閉じた分類の automotive が直接当てはまるため、暫定分類と taxonomyGaps は不要でした。単一セグメントのため2つ目の業界は付けませんでした。
- relatedCompanies: land（株式会社ランド）: 「ポーランド」（TEIN Europe Sp.z o.o.の所在地）の部分一致であり、株式会社ランドについて述べる取引・提携・資本関係の記載が無いため結びませんでした。
- relatedCompanies: en（エン株式会社）: ambiguous であり、「エンジン」等の一般語の一致のため結びませんでした。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」等の一般語の一致のため結びませんでした。
- relatedCompanies: seki（セキ株式会社）: ambiguous であり、「セキュリティ」等の一般語の一致のため結びませんでした。
- relatedCompanies: vision（株式会社ビジョン）: 「長期経営ビジョン」等の一般語の一致のため結びませんでした。
- relatedCompanies: cover（カバー株式会社）: 「カバーできる」という動詞の一致のため結びませんでした。
- relatedCompanies: sportsfield（株式会社スポーツフィールド）: 「モータースポーツフィールド」という語句の部分一致であり、株式会社スポーツフィールドについて述べる記載ではないため結びませんでした。
- relatedCompanies: TURN 14 DISTRIBUTION INC.は2026年3月期の主要な顧客（売上高の14.3％、主要な顧客ごとの情報に印字）ですが、related-candidates.json に無いため結びませんでした。
- relatedCompanies: 株式会社タカマコンペティションプロダクトは2026年3月期の主要な顧客（売上高の10.4％、主要な顧客ごとの情報に印字）ですが、related-candidates.json に無いため結びませんでした。
- relatedCompanies: 株式会社イチノホールディングスは2026年3月31日現在の筆頭株主（37.34％）ですが、related-candidates.json に無いため結びませんでした。【関係会社の状況】の「その他の関係会社」1社は社名が印字されておらず、事業上の関係はないとされているため、特定して結ぶこともしていません。
- relatedCompanies: 連結子会社8社と持分法適用関連会社2社は、自社の子会社・関連会社であるため規則により結びませんでした。
- terms: 助言のみ。用語の候補としては「サスペンション」「ショックアブソーバー」「カーアフターマーケット」「OEM（相手先ブランドによる生産）」などが挙げられますが、本工程ではデータを持ちません。

## 要確認（status に反映）

- businessModel: 2025年10月1日付で普通株式1株につき2株の割合で株式分割を行っています（主要な経営指標等の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
