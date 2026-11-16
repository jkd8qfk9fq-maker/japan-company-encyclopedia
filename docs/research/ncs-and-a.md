# NCS＆A — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＮＣＳ＆Ａ株式会社 |
| 証券コード | 9709 |
| docID（データを取り出した文書） | `S100YAMN` |
| 原本 docID | `S100YAMN` |
| 提出日（原本） | 2026-06-12 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAMN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＮＣＳ＆Ａ株式会社 / 9709 / docID S100YAMN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ncs-and-a: 10 件の数値を有報XBRLと照合
有報: ＮＣＳ＆Ａ株式会社 有価証券報告書－第60期(2025/04/01－2026/03/31) (docID S100YAMN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ncs-and-a: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「NCS＆A株式会社」が EDINET の提出者名「ＮＣＳ＆Ａ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記は千円印字を百万円に切り捨てた（切り捨てであり四捨五入はしていない）。売上高22,485百万円（22,485,991千円）、当期純利益2,067百万円（2,067,634千円）。
- businessModel: suppliers キーはこのツリーの旧スキーマに存在しないため省略した。仕入先の個別名は有報に開示されていない。
- businessModel: 中期経営計画の数値目標（2027年3月期の連結売上高205億円、連結営業利益率12.8％、連結配当性向45％以上の達成）及び目標とする経営指標（売上高営業利益率12％以上、ROE10％以上）は、投資指標・利益率の目標であるため本文・戦略には書かず、ここに記録する。
- businessModel: MD&Aの営業利益・経常利益の金額と増減、特別損益、法人税等調整額の内訳、受注高・受注残高の金額は本文に書かず、ここに記録する。
- businessModel: 自己株式の取得（2025年8月より資本構成の改善を目的として実施）は期中の資本政策であり、warnings のみの扱いとした。
- businessModel: 財務注記は経営指標等の注記（第59期の純利益増加の理由）のみを登録した。同年に複数の注記はない。
- businessStructure: 単一セグメント（ITサービス）のため、報告セグメントごとの金額はない。【事業の内容】の3区分（システム開発、サービス、システム機器等販売）を children とし、金額はMD&Aの販売実績（品分類別、千円印字を百万円に切り捨て）を用いた。切り捨て後の3区分の合計は22,484百万円で、印字の合計22,485百万円と1百万円ずれる（切り捨て差異。そのまま印字の合計を引用し、ここに記録）。
- businessStructure: 連結子会社3社はいずれも非上場で related-candidates にないため、関連企業リンクの対象にしていない。
- businessStructure: 持分法を適用しない関連会社であったアイ・システム株式会社は、当連結会計年度中に全株式を売却し関連会社の範囲から除外された。期中に完了し期末体制に反映されているため needsReview にはせず、ここに記録する。
- history: 沿革から落とした行（warnings に列挙）: 1972年東京営業所開設、1974年名古屋営業所開設、1983年京都営業所開設、1988年システムインテグレーター認定、1993年エヌシーエステクノロジー設立（2012年の合併行で言及）、1999年プライバシーマーク認定、2000年ISO9001認証、2003年ISO14001認証、2004年ISMS認証・本社移転、2007年ISO27001移行、2008年京都支店の本社統合、2016年Luciad社製品の販売開始、2017年日本アイ・ビー・エムとのパートナーシップによるIBM Watson Explorerの取扱い開始。
- history: 1966年の設立行に印字された資本金の金額は、沿革に資本金額を書かない規則のため本文に含めていない。
- history: Wikipedia（NCS&A、証券コード9709で同一性確認済み）は参照したが、冒頭文は有報の沿革と重なる内容のみのため使用していない。
- industry: ITサービス事業の単一セグメントであり、閉じた分類の「it」がそのまま該当するため、暫定値や taxonomyGaps はない。
- relatedCompanies: 日本電気（nec、6701）は、セグメント情報の主要な顧客ごとの情報とMD&Aの相手先別販売実績に印字された主要顧客のため customer として結んだ。説明文には金額を書いていない（割合のみ）。
- relatedCompanies: アズワン（as-one、7476）、日本金銭機械（japan-cash-machine、6418）、東洋テック（toyo-tec、9686）は、特定投資株式の保有目的が「システムインテグレーションにおける販売関係取引の維持・強化」と事業分野と取引の向きまで個別に印字されているため customer として結んだ。ダイワボウホールディングス（daiwabo-holdings、3107）とキヤノンマーケティングジャパン（canon-marketing-japan、8060）は保有目的が「機器・パッケージにおける購買関係取引の維持・強化」と購買の向きが印字されているため supplier として結んだ。
- relatedCompanies: 三井住友トラストグループ（sumitomo-mitsui-trust-group、8309）は保有目的が金融関係取引の維持・強化のみで、信託銀行との資金調達関係のため結ばなかった。
- relatedCompanies: 三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group、8316）は銀行持株会社で、保有目的の中心が金融関係取引の維持・強化であり（自社製品ソリューションの販売関係取引の文言は併記）、また有報の脚注では同社自体は当社株式を保有せず子会社の三井住友銀行が保有するとされているため結ばなかった。
- relatedCompanies: りそなホールディングス（resona-holdings、8308）は銀行持株会社で、保有目的の中心が金融関係取引の維持・強化であるため結ばなかった。
- relatedCompanies: 丸三証券（marusan-securities、8613）は証券会社で、保有目的が金融関係取引の維持・強化のみのため結ばなかった。
- relatedCompanies: NCD株式会社は特定投資株式の保有目的に「システムインテグレーションにおける販売関係取引の強化」と個別に印字されているが、related-candidates.json に含まれないため結ばず、事実のみここに記録する（保有株式数62,000株、2026年3月31日現在）。
- relatedCompanies: 株式会社Casaは特定投資株式の保有目的に「自社製品によるソリューションにおける販売関係取引の維持・強化」と個別に印字されているが、related-candidates.json に含まれないため結ばず、事実のみここに記録する（保有株式数44,000株、2026年3月31日現在）。
- relatedCompanies: 株式会社ZENは大株主の状況の筆頭株主（2026年3月31日現在、発行済株式総数に対する割合12.25％）だが、非上場で related-candidates.json に含まれないため結ばなかった。明治安田生命保険相互会社は大株主（同3.51％）だが保険会社であり、資金・保険関係のため結ばなかった。
- relatedCompanies: 株式会社セブン・ペイメントサービスは、自治体向け給付金システム「The給付」と送金サービス「ATM受取」の機能連携を開始した相手だが、非上場で related-candidates.json に含まれないため結ばなかった。
- relatedCompanies: seki（7857）は「情報セキュリティ」等の部分文字列一致、port（7047）は「サポート」の部分文字列一致、career（6198）は「キャリア開発教育」の語、en（4849）は「エンジニアリング」の部分文字列、innovation（3970）は「イノベーション」の一般語、base-4481（4481）は「時価ベース」の語、zero（9028）は「ゼロトラストセキュリティ」の語、king（8118）は「ワーキング」の部分文字列、ray（4317）は「ペーパーレス」の部分文字列、system-integrator（3826）は「システムインテグレーター認定制度」の一般名称、the-lead（6982）は「リードタイム」の語であり、いずれも当該企業への言及ではないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言のみ。本文には反映していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
