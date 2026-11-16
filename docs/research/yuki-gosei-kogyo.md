# 有機合成薬品工業 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 有機合成薬品工業株式会社 |
| 証券コード | 4531 |
| docID（データを取り出した文書） | `S100YHPD` |
| 原本 docID | `S100YHPD` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHPD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 有機合成薬品工業株式会社 / 4531 / docID S100YHPD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yuki-gosei-kogyo: 10 件の数値を有報XBRLと照合
有報: 有機合成薬品工業株式会社 有価証券報告書－第106期(2025/04/01－2026/03/31) (docID S100YHPD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
yuki-gosei-kogyo: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: ブートストラップが警告した財務諸表の組替えは、表示方法の変更（「受取手形」に含めていた「電子記録債権」の独立掲記）に伴う前事業年度の貸借対照表の組替えであり、売上高・当期純利益などの登録指標には影響しないため、financialNotes には書かず warnings に記録した。前期有報との指標照合でも全系列で差異はなかった。
- businessModel: 主要な経営指標等の推移の注記は、連結財務諸表を作成していないこと、関連会社がないこと、潜在株式が存在しないこと、平均臨時雇用者数の省略、市場区分変更に伴う株価の注記、期末配当が株主総会の決議事項であることの6件で、いずれも表示事項のため financialNotes は空とした。株式分割・株式併合、決算期変更、変則期間の印字はない。
- businessModel: 段階利益（営業利益・経常利益）の金額と増減の理由（アミノ酸関係設備の償却負担、電子材料向け製品の市場価格とシェアの低下など）は規則により書いていない。当期純利益の増減率は印字どおり書いた。総資産・純資産・キャッシュ・フローの金額、国庫補助金と圧縮記帳の金額も書いていない。
- businessModel: 中期経営計画の目標とする経営指標（売上高の年度目標など）は投資指標に当たるため、perspectives には数値を書いていない。研究開発費の金額も書いていない。
- businessModel: 【重要な後発事象】は「該当事項はありません」と印字されており、提出後の予定事項はないため needsReview は空とした。
- businessStructure: 単一セグメントのため、子区分は【関連情報】の製品及びサービスごとの情報に印字された製品区分を用い、外部顧客への売上高の大きい順（化成品関係、 アミノ酸関係、 医薬品関係）に並べた。製品区分の金額の合計は15,446百万円で、売上高15,448百万円とは2百万円の差があるが、いずれも印字どおり記載した。
- businessStructure: 主要な顧客ごとの情報に印字された長瀬産業株式会社、中外製薬株式会社、株式会社山口薬品商会、TRINITTI INTERNATIONAL CORP.は、親事業の customers に名称のみを記載し、各社への売上金額は書いていない。株式会社山口薬品商会とTRINITTI INTERNATIONAL CORP.は関連企業候補に含まれていない。
- businessStructure: 子会社ユーキテクノサービス株式会社は非連結子会社で、当社の製造業務の請負等を行っている。自社グループの会社のため関連企業には含めていない。【関係会社の状況】は「該当事項はありません」と印字されている。
- businessStructure: 主要な設備はすべてファインケミカル事業に帰属する（常磐工場、東京研究所、生産技術グループ）。本社の行はセグメントの名称が「－」のため、特定の子区分には結びつけていない。設備の帳簿価額は書いていない。
- history: 本社の移転（1948年板橋区、1961年中央区京橋、1991年千代田区平河町、1995年現在地の中央区日本橋人形町）は、事業の節目として扱わず省いた。現在地は businessModel に記載している。
- history: 1984年の常磐工場への多目的製造設備の新設と、2014年の常磐工場へのコージェネレーションシステムの導入は省いた。
- history: Wikipedia（記事「有機合成薬品工業」）は冒頭文のみで、有報にない補足（旧社名・創業の経緯等）が得られなかったため使っていない。
- industry: 主たる業界は、ファインケミカル事業の単一セグメントでアミノ酸、化成品、医薬品原料・中間体などの化学品を製造販売しているため chemicals とした。
- industry: 医薬品原料・中間体を製造するが、完成した医薬品そのものは製造していないため pharmaceuticals は付けなかった。食品添加物用途のアミノ酸も製造するが、食品そのものではないため food は付けなかった。
- relatedCompanies: nagase-and-co: 主要な顧客ごとの情報に主要な顧客として印字され、販売の向きが明らかなため customer とした。大株主（5.08％）でもあることは説明に併記した。
- relatedCompanies: nipro: 【大株主の状況】の筆頭株主（15.25％）であり、【関係会社の状況】に区分の印字がないため major-shareholder とした。医薬品関係の取引と業務提携・資本提携の印字は説明に併記した。
- relatedCompanies: sumitomo-corporation / zeria-pharmaceutical / aska-pharmaceutical-holdings / osaka-soda / kureha: 特定投資株式の保有目的が銘柄ごとに事業分野を挙げて取引と関係強化を述べており定型句ではないため、取引の向きが印字されていないことから business-partner とした。株式数は説明に書いたが、計上額は書いていない。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的が「融資等で取引があり」と金融取引のみのため結ばなかった。
- relatedCompanies: mebuki-financial-group: 特定投資株式の保有目的が「融資等で取引があり」と金融取引のみのため結ばなかった。
- relatedCompanies: tokyo-kiraboshi-financial-group: 特定投資株式の保有目的が「融資等で取引があり」と金融取引のみのため結ばなかった。
- relatedCompanies: hisamitsu-pharmaceutical: コードリストになく、保有していた株式も当事業年度にすべて売却済み（当事業年度の株式数は「－」）のため結ばなかった。
- relatedCompanies: mitsubishi-electric: 印字されているのは三菱電機プラントエンジニアリング株式会社（設備関係支払手形の相手先）で、三菱電機株式会社そのものとの取引の印字がないため結ばなかった。
- relatedCompanies: en / base-4481 / slogan / career / innovation / port / king / seki / cota: 一般語・部分文字列の一致のみで、当該会社との取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: 住友商事ケミカル株式会社は大株主（2.48％）として印字されているが、住友商事株式会社とは別の法人であり、候補にも含まれていないため結ばなかった（代替もしていない）。
- relatedCompanies: 大鵬薬品工業株式会社（大株主3.11％）、あすか製薬株式会社（同1.69％）、サンヨーファイン株式会社（同1.42％）は候補に含まれていないため結ばなかった。あすか製薬株式会社は、あすか製薬ホールディングス株式会社とは別の法人である。
- relatedCompanies: 株式会社山口薬品商会は主要な顧客であり大株主（1.40％）でもあるが、候補に含まれていないため結ばず、事業構造の customers に名称のみ記載した。TRINITTI INTERNATIONAL CORP.も同様である。
- terms: 助言: 「ファインケミカル」は、医薬品や電子材料などに使われる付加価値の高い化学品のことです。同社はアミノ酸、化成品、医薬品原料・中間体をファインケミカル事業として製造販売しています。
- terms: 助言: 「グリシン」はアミノ酸の一種です。同社は2025年6月に常磐工場へグリシンの増産設備を新設しました。
- terms: 助言: 「CDMO」は、医薬品の開発から製造までを製薬会社から受託する事業のことです。同社は中期経営計画の重点施策に、医薬品分野におけるCDMOビジネスの拡大を挙げています。
- terms: 助言: 「タイヤコード接着剤」は、タイヤの骨格材であるタイヤコードとゴムを接着するための材料です。同社はその原料を化成品関係で製造販売しています。
- terms: 助言: 「圧縮記帳」は、国からの補助金を受けて取得した設備について、補助金の分だけ取得価額を減らして計上する会計処理のことです。同社は当期に竣工したアミノ酸関係設備でこの処理を行っています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
