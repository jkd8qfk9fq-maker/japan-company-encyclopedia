# サイネックス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　サイネックス |
| 証券コード | 2376 |
| docID（データを取り出した文書） | `S100YICX` |
| 原本 docID | `S100YICX` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YICX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　サイネックス / 2376 / docID S100YICX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
scinex: 10 件の数値を有報XBRLと照合
有報: 株式会社　サイネックス 有価証券報告書－第61期(2025/04/01－2026/03/31) (docID S100YICX)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
scinex: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社サイネックス」が EDINET の提出者名「株式会社　サイネックス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円単位に切り捨てて引用した（例：売上高17,089,576千円→17,089百万円）。経営者による分析に億単位で印字された数値は使わず、セグメント注記の千円印字に基づく切り捨て値で統一した。
- businessModel: 表示方法の変更として、前連結会計年度の連結財務諸表の組替え（営業外収益の「その他」に含めていた補助金収入の独立掲記）が注記されている。表示の変更のみで５年間の経営指標に影響しないため、financialNotesには書かず、ここに記録する。
- businessModel: 前期有報との修正再表示チェックは、売上高・純利益を含む全項目で差異なし（修正再表示なし）。
- businessModel: 当作業ツリーのスキーマに仕入先（suppliers）の項目がないため、businessModelには仕入先を記載していない。
- businessModel: 経営方針では、連結売上高と並んで連結経常利益の増加を目指す旨と、両者を重要な指標とする旨が印字されている。経常利益の語は本文の禁止語にあたるため、strategyの本文には売上高のみを書き、事実はここに記録する。
- businessModel: DXサポート事業において、ふるさと納税事業用資産について減損損失42,218千円が計上された旨がセグメント情報に注記されている。
- businessModel: 名古屋証券取引所メイン市場への重複上場は令和７年12月（当連結会計年度内）の完了事項として沿革に印字されており、後発事象ではないためneedsReviewには入れず、沿革に記録した。重要な後発事象は「該当事項はありません」と印字されている。
- businessStructure: 報告セグメントは５つで、事業の内容の部門区分と同一である旨が印字されている。事業は外部顧客への売上高の大きい順に並べた。
- businessStructure: 連結子会社は６社（株式会社サイネックス・ネットワーク、株式会社エルネット、株式会社ベック、株式会社マルヤマ歯科商店、株式会社ナイン、株式会社リーディ）で、いずれも議決権の所有割合は100％と印字されている。
- businessStructure: 株式会社エルネットについては、売上高（連結会社相互間の内部売上高を除く。）の連結売上高に占める割合が10％を超えている旨と主要な損益情報等が関係会社の状況に注記されている。
- industry: 主たる業界は、官民協働の行政情報誌・電話帳の発行を中核とする情報メディア事業に基づき media とした。外部顧客への売上高ではDM発送代行等を担うロジスティクス事業（7,067百万円）が情報メディア事業（6,694百万円）を上回るため、transportation を副分類に加えた。DXサポート事業は it、投資事業（不動産賃貸）は real-estate を副分類とした。
- industry: ヘルスケア事業（歯科医療機械器具・歯科材料の卸売、外部顧客への売上高1,069百万円）に当たる卸売の独立区分は閉じた分類になく、独立した副分類は付けなかった。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）、san-ju-san-financial-group（三十三フィナンシャルグループ）、mizuho-financial-group（みずほフィナンシャルグループ）は特定投資株式として保有するが、保有目的はいずれも同一の定型句「取引先との関係強化」で、脚注に「営業上の取引として各々の子会社と銀行取引があります。業務上の提携はありません。」と明記されているため結ばなかった。なお三十三フィナンシャルグループの保有株式数の増加は同社の株式分割によるもので、当社の株式分割ではない。
- relatedCompanies: ntt（NTT株式会社）は結ばなかった。沿革の「番号情報データベース（TDIS）利用に係る利用契約」の相手方は西日本電信電話株式会社（現NTT西日本株式会社）であり、上場持株会社のNTT株式会社とは別の法人のためである。
- relatedCompanies: ly（LINEヤフー株式会社）は結ばなかった。沿革にヤフー株式会社（現LINEヤフー株式会社）とのプロパティ系広告に関する取次特約店契約（平成16年８月）と資本および業務提携契約（平成19年11月）の記載があるが、当期の本文に現在の関係を示す記載が見当たらないためである。
- relatedCompanies: smartvalue（株式会社スマートバリュー）は結ばなかった。沿革に、平成28年５月に自治体支援で業務提携した一方、令和５年３月に業務提携を解消した旨が印字されているためである。
- relatedCompanies: hikari-tsushin（株式会社光通信）は結ばなかった。大株主の状況に載るのは光通信ＫＫ投資事業有限責任組合（6.35％）で、株式会社光通信とは別の法人のためである。
- relatedCompanies: japan-communications（日本通信株式会社）は結ばなかった。沿革の「子会社日本通信株式会社を合併」（平成７年３月）は当社の子会社への言及であり、上場の日本通信株式会社とは別の法人のためである。
- relatedCompanies: 大株主の状況には株式会社三井住友銀行（2.67％）が載るが、これは三井住友フィナンシャルグループの子会社で別の法人のため、持株会社とは結ばなかった。筆頭株主の株式会社富士教育創研（19.26％）は候補リストにない非上場会社のため結ばなかった。
- relatedCompanies: port、base-4481、corona、innovation、path、en、seki、career、land、aeon-mall は、ポータル、データベース、新型コロナウイルス感染症、イノベーション・パーパス等の一般語句や施設名への部分一致であり、該当企業への言及ではないため結ばなかった。
- terms: 用語の助言は行いませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
