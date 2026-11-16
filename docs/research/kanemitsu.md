# カネミツ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カネミツ |
| 証券コード | 7208 |
| docID（データを取り出した文書） | `S100YE6U` |
| 原本 docID | `S100YE6U` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE6U.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カネミツ / 7208 / docID S100YE6U（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kanemitsu: 10 件の数値を有報XBRLと照合
有報: 株式会社カネミツ 有価証券報告書－第43期(2025/04/01－2026/03/31) (docID S100YE6U)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kanemitsu: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aに印字された利益段階の金額と増減率は、規則により本文に書かなかった。売上高の総額と前期比の減少は brief の印字どおり本文の金額と整合する範囲でのみ扱った。
- businessModel: 第10次中期経営計画の数値目標（売上高の目標値や経営指標の目標値）は、投資・経営指標の目標として本文・戦略に書かなかった。
- businessModel: 受注実績・受注残高の金額は書かなかった。
- businessModel: 主要な経営指標等の注記は、潜在株式が存在しないことと従業員数の定義に関する表示事項のみで、会計基準の変更や組替えの記載はないため、financialNotes は空とした。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした（日本8,130百万円、東南アジア2,087百万円、中国822百万円）。MD&Aのセグメント別売上高は内部売上高を含む数値のため使わなかった。
- businessStructure: 報告セグメントは地域別区分のため、製品別の内訳（プーリ、トランスミッション、その他）は日本区分の children として金額なしで登録した。製品別金額は地域との組み合わせでのみ開示されており、製品単独の外部売上高は独立して開示されていない。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。連結子会社の松本精工株式会社が当社製品の機械加工を行っている事実は【事業の内容】に記載があるが、自社の連結子会社であり仕入先としての外部企業名は印字されていない。
- businessStructure: セグメント利益は書いていない。
- businessStructure: 有報の印字「EPS部品」は電動パワーステアリング用部品のことだが、文字列「EPS」は投資指標の語として機械検査で禁止されるため、本文では「電動パワーステアリング部品」と言い換えた（意味・内容は印字どおり）。
- history: 沿革表の2011年１月から2022年10月までの部分は、年月セル（12件）と事象文（12件）が分離して印字されていた。数が一致することを確認し、印字順に対応づけて登録した。
- history: 1947年と1984年の項目に印字されていた資本金の金額は、規則により説明文から除いた。
- history: 次の行は登録しなかった: 1978年 ポリVプーリを開発、1992年 ボス一体プーリを開発、2003年 ISO14001認証、2007年 タイにテクニカルセンターを開設、2011年 ISO/TS16949認証、2011年 テクニカルセンターを開設、2015年 長崎市にリサーチセンターを開設、2022年 JBM KANEMITSU PULLEYS PRIVATE LIMITEDより資本撤退（製品開発の細目・認証取得・小規模拠点の開設と、すでに関連会社でなくなった合弁会社の撤退のため）。
- industry: 主たる業界は automotive（自動車）とした。報告セグメントは地域別（日本、東南アジア、中国）だが、いずれもプーリを中心とする自動車部品等の生産・販売であり、売上高の大半を占めるため。
- industry: 農業機械・一般機械向けの供給もあるが、地域別セグメントの中で金額が独立して開示されておらず、独立した業界は付けなかった。
- relatedCompanies: aisin（株式会社アイシン）: 主要な顧客ごとの情報に当期の顧客として印字されており、顧客として結んだ。売上金額そのものは説明文に書いていない。
- relatedCompanies: bando-chemical-industries（バンドー化学株式会社）: 大株主の状況に事業会社として載るため大株主として結んだ。特定投資株式としても保有されているが、結んだ根拠は大株主の記載である。
- relatedCompanies: mitsubishi-electric（三菱電機）、kubota（クボタ）、kyokuto-kaihatsu-kogyo（極東開発工業）、mitsubishi-motors（三菱自動車工業）、mazda（マツダ）、jfe-holdings（JFEホールディングス）、toyota（トヨタ自動車）、hitachi（日立製作所）: 特定投資株式の保有目的が「取引関係の維持・強化による収益拡大」など各銘柄で共通する定型的な文言の組み合わせであり、個別の取引の向きや具体的な取引事実までは印字されていないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）: 特定投資株式の保有目的が「主要金融機関として、取引の円滑化」で、資金調達面の関係のため結ばなかった。
- relatedCompanies: nichirin（ニチリン）、noritz（ノーリツ）、s-foods（エスフーズ）、sumitomo-rubber-industries（住友ゴム工業）: 特定投資株式として各100株程度を「異業種の情報収集」目的で保有するもので、取引関係ではないため結ばなかった。
- relatedCompanies: en（エン）、seki（セキ）、core（コア）、land（ランド）、base-4481（ベース）、port（ポート）、ricoh（リコー）: 「エンジン」「モーターコア」「タイランド」「ベース（算定基準）」「ポートフォリオ」「リコール」などの一般語・部分一致であり、各社についての記載はないため結ばなかった。
- relatedCompanies: 自社の連結子会社（KANEMITSU PULLEY CO., LTD.、佛山金光汽車零部件有限公司、PT. KANEMITSU SGS INDONESIA、松本精工株式会社、株式会社津村製作所）と持分法適用関連会社（株式会社キーネクスト）は候補に含まれておらず、規則により関連企業としては結ばない。
- terms: 用語の助言のみ（data は空）。候補: 「回転成形法」（上下の金型で薄板鋼板を挟み込み回転を加えながら側壁部に金型を押圧して成形する塑性加工の方法。有報の【事業の内容】注１に定義がある）、「塑性加工」（外部から力を加えて変形させる加工方法。同注２）、「プーリ」（ベルトを介して回転することによって動力を伝達する部品。同本文）、「xEV」（バッテリーに蓄えた電気エネルギーを動力のすべてまたは一部として使う自動車の総称。同注３）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
