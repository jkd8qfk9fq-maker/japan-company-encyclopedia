# 不二ラテックス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 不二ラテックス株式会社 |
| 証券コード | 5199 |
| docID（データを取り出した文書） | `S100YGMK` |
| 原本 docID | `S100YGMK` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGMK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 不二ラテックス株式会社 / 5199 / docID S100YGMK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fuji-latex: 10 件の数値を有報XBRLと照合
有報: 不二ラテックス株式会社 有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YGMK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
fuji-latex: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記は、潜在株式調整後の指標を記載しない理由や第74期の指標を記載しない理由、従業員数の数え方といった表示上の事項のみで、変則決算や会計基準の変更などの事実はないため financialNotes は空とした。
- businessModel: MD&Aに印字された利益に関する金額と増減率は、規則により本文に書かなかった。売上高の増減とその理由に相当する範囲のみを書いた。親会社株主に帰属する当期純利益の減少理由は、工場の移転統合に伴う一時費用の計上という印字の範囲で書いた。
- businessModel: Wikipediaの記事（証券コードで同一性を確認）には、水枕の生産や本社ビルの外観に関する記述があるが、有報の事業内容を補うものではないため使わなかった。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期: 精密機器事業 4,401,135千円、医療機器事業 2,127,861千円、食品容器事業 182,256千円、ＳＰ事業 86,925千円）の大きい順とし、千円額を百万円に切り捨てて記載した。合計は連結売上高 6,798,180千円と一致する。
- businessStructure: 設備と事業の対応は有報のセグメント欄どおりとした。新栃木工場は精密機器事業、真岡工場は食品容器事業に結びつく。栃木千塚工場は医療機器事業・精密機器事業・食品容器事業の3事業が連記され、本社ビルは4事業と全社共通が連記されているため、特定の事業には結びつけなかった。帳簿価額は書いていない。
- businessStructure: 連結子会社は不二ライフ株式会社（医療機器事業）とFUJI LATEX SHANGHAI CO.,LTD.（精密機器事業）の2社で、いずれも自社グループ会社のため関連企業には含めなかった。
- businessStructure: 真岡工場の栃木千塚工場への移転・統合は、2025年3月期に決定された事業構造改革の一環として経営方針に印字された計画であり、2027年3月期中の統合を予定している。期末時点の構成に変更はないため needsReview には入れず、ここに記録する。
- businessStructure: 仕入先の個別名は有報に印字されていないため、suppliers は書かなかった（このツリーの旧スキーマでもある）。
- history: 沿革の表は年月と事象が対応して印字されており、崩れた表ではないため行順の対応づけは不要だった。営業所の設置や本社移転、ISO認証の取得などの行は、事業の転機となる行を中心に選んで省いたものがある（1972年本社移転、1975年名古屋営業所、1981年福岡営業所、1995年・1998年・2003年・2004年・2005年・2006年・2020年の認証取得、2000年サークルラバー吸収合併、2010年・2013年の市場変更、2016年新栃木工場増築とドイツ代表事務所設置、2018年栃木千塚工場完成など）。
- history: 資本金の金額は沿革に書いていない。
- industry: 主たる業界は暫定で chemicals とした。最大の精密機器事業は緩衝器の製造・販売、医療機器事業はゴム製品の製造・販売であり、閉じた分類に緩衝器やゴム製品の区分がないため、素材面で最も近い chemicals を暫定とした。taxonomyGaps に記録した。
- relatedCompanies: takachiho-koheki（高千穂交易株式会社）: 主要な顧客ごとの情報に精密機器事業の顧客として印字されているため customer として結んだ。金額は説明に書いていない。
- relatedCompanies: okamoto-industries（オカモト株式会社）: 大株主の状況に載る事業会社であり、当社がその株式を取引関係と情報収集を目的に保有していることも印字されているため major-shareholder として結んだ。
- relatedCompanies: ピップ株式会社と株式会社テックは主要な顧客として印字されているが、関連企業の候補一覧にないため結ばなかった。
- relatedCompanies: tsuruha-holdings（株式会社ツルハホールディングス）・ohki-healthcare-holdings（大木ヘルスケアホールディングス株式会社）・nichiden（株式会社日伝）・toba（株式会社鳥羽洋行）: 特定投資株式の表に載るだけで、保有目的は全銘柄に共通する定型的な文言の範囲であり、個別の取引の印字がないため結ばなかった。
- relatedCompanies: resona-holdings（株式会社りそなホールディングス）: 特定投資株式の保有目的が主力銀行としての金融取引であり、資金調達が理由のため結ばなかった。
- relatedCompanies: welcia-holdings（ウエルシアホールディングス株式会社）: コードリストにない相手で、上場を確認できないため結ばなかった。
- relatedCompanies: step・career・port・base-4481・cover・innovation・land・rent・the-lead・vision: 一致は一般語や部分文字列によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: cota・en・zero・core・seki・fuji-8278: ambiguous で、一致は一般語や部分文字列（フジは1974年に吸収合併したフジ化工株式会社への言及）によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: 連結子会社2社は自社グループ会社のため、関連企業には含めなかった。大株主の上位は岡本家の個人が中心で、事業会社の大株主はオカモト株式会社のみだった。
- terms: 用語の助言: 「緩衝器」は衝撃や振動を和らげる部品の総称で、同社のショックアブソーバは直線運動の衝撃を、ロータリーダンパーは回転運動の衝撃を和らえます。「プローブカバー」は超音波診断装置の探触子（プローブ）にかぶせるゴム製のカバー、「子宮内避妊器具（IUD）」は子宮内に装着する避妊器具、「不動王」は震度7に対応する家具転倒防止器具のシリーズ名、「SKYN」は新素材ポリイソプレン（IR）製コンドームの製品名です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] fuji-latexの主たる業界（精密機器事業・医療機器事業） → 提案: 精密機器・ゴム製品。最大の精密機器事業はショックアブソーバやロータリーダンパーなどの緩衝器の製造・販売、医療機器事業はコンドームやプローブカバーなどのゴム製品の製造・販売であり、閉じた分類に緩衝器やゴム製品の区分がなく、素材面で最も近い chemicals を暫定としました。
