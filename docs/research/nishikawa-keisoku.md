# 西川計測 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 西川計測株式会社 |
| 証券コード | 7500 |
| docID（データを取り出した文書） | `S100Z3XS` |
| 原本 docID | `S100Z3XS` |
| 提出日（原本） | 2026-09-28 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3XS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 西川計測株式会社 / 7500 / docID S100Z3XS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nishikawa-keisoku: 10 件の数値を有報XBRLと照合
有報: 西川計測株式会社 有価証券報告書－第91期(2025/07/01－2026/06/30) (docID S100Z3XS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
nishikawa-keisoku: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空にしました。修正再表示チェックは前期有報との重複年度が全行一致し、変則決算や決算期変更はなく、5年表の指標に影響する会計方針の変更等の印字もありません。
- businessModel: 金額の表記は切り捨ての約束に従いました。品目別の外部顧客への売上高は千円単位の印字を百万円未満で切り捨て（制御・情報機器システム22,571百万円、理化学機器10,518百万円、産業機器・その他6,328百万円、計測器5,801百万円）、合計の売上高と当期純利益は経営者による分析に印字された億単位の表記（452億20百万円、32億93百万円）をそのまま使いました。
- businessModel: 仕入先の事実は次のとおりで、businessModel には suppliers のキーを置かず、ここに記録します。主要な商品は横河電機株式会社、横河ソリューションサービス株式会社、アジレント・テクノロジー株式会社の3社から仕入れており、横河電機グループからの仕入額は全仕入の約30％を占めると【事業等のリスク】に印字されています。
- businessModel: 経営指標の目標として自己資本比率と自己資本当期純利益率に関する数値目標が印字されていますが、投資の語に当たるため本文と perspectives には記載せず、ここに記録します。
- businessModel: 第91期の配当は2026年9月29日開催予定の定時株主総会の決議事項として経営指標等の注記に印字されています。提出日時点では予定の事項であり、資本政策に関する事項として needsReview ではなくここに記録します。
- businessModel: 重要な後発事象は該当事項なしと印字されています。研究開発活動は市場販売目的ソフトウェアの制作で、金額は印字されていないため本文には記載していません。
- businessStructure: 単一セグメントのため、事業の子区分はセグメント注記の関連情報（製品及びサービスごとの情報）の品目区分を用い、外部顧客への売上高の大きい順に並べました。各品目の金額は千円単位の印字を百万円未満で切り捨てた値で、4区分の単純合計は45,218百万円となり、別途印字された売上高の合計45,220百万円とは2百万円異なります。印字された表の切り捨てによる差異として、金額はそれぞれ印字どおりに記載しました。
- businessStructure: 主な仕入先は横河電機株式会社、横河ソリューションサービス株式会社、アジレント・テクノロジー株式会社の3社で、【事業の内容】に代理店として主な商品の仕入れを行う旨が印字されています。横河電機以外の2社は百科事典の掲載企業ではないため、関連企業としては結ばず、ここに記録します。
- businessStructure: 主要な設備は本社（東京都渋谷区、従業員257名）、関西支社（神戸市中央区、同38名）、九州支社（大分市、同49名）、横浜営業所（横浜市保土ヶ谷区、同37名）で、いずれも営業・サービス設備または全社共通設備であり、特定の品目区分との対応は印字されていないため、事業との対応付けは行いませんでした。
- history: 沿革の印字のうち、各営業所の開設・移転・廃止など拠点の細かな変遷は、主要な出来事に絞って記載し、一部を省略しました。
- history: 創業時や設立時の資本金の金額は沿革には印字されていないため、記載していません。
- industry: 主たる業界は trading（商社）としました。他社製品の代理店販売を中核とし、自身もエンジニアリング商社と位置付ける技術商社であり、自社で機器を製造する事業ではないため electronics は付けませんでした。単一セグメントで、品目別の金額は商品販売と付随サービスを合わせた開示のため、第2の業界は付けていません。合う分類があるため taxonomyGaps はありません。
- relatedCompanies: 結ばなかった候補は次の理由によります。
- relatedCompanies: en、step、career、rent、core、kohsoku、innovation、taya、zero: 一般的な語や部分一致のみ（rent はアジレント・テクノロジー株式会社の部分一致）で、各社との取引・提携・資本関係の印字がないため結びませんでした。
- relatedCompanies: gltechno-holdings、nihon-dengi、tomoe、eiken-chemical、espec、human-metabolome-technologies、kikusui-holdings、meidensha、muro、nagawa、nakabayashi、nakanishi-mfg、new-cosmos-electric、nippon-gas、nippon-paper-industries、resonac-holdings、rion、sumitomo-electric-industries、takamisawa-cybernetics、the-nippon-signal、toba、togami-electric-mfg、vertex、yamato: 特定投資株式の保有目的（取引関係の強化や協業の維持など全銘柄に共通する定型的な記載）の表に載るだけで、本文や重要な契約等に個別の取引・提携の事実が印字されていないため結びませんでした。
- relatedCompanies: dkk-toa、metawater、mitsubishi-electric、mitsui-chemicals、nippon-steel、nissan、tokyo-gas、tokyo-seimitsu: 主な資産及び負債の内容における受取手形・電子記録債権・売掛金・買掛金・契約負債などの相手先別内訳に載るだけで、取引関係そのものを述べる印字ではなく、主要な顧客ごとの情報でも売上高の10％以上を占める相手先はないとされているため結びませんでした。
- relatedCompanies: mitsubishi-hc-capital、mizuho-financial-group、sumitomo-mitsui-financial-group: 金融機関またはその持株会社で、受取手形の相手先や取引金融機関との取引・協力関係の維持を目的とする株式保有にとどまるため結びませんでした。
- relatedCompanies: suido-kiko-kaisha、sumitomo-densetsu: コードリストにない相手であり、特定投資株式の表に載るだけ（住友電設は当事業年度は保有なし）のため結びませんでした。
- relatedCompanies: 候補にない契約相手先として、横河ソリューションサービス株式会社、横河計測株式会社、横河レンタ・リース株式会社（いずれも横河電機のグループ会社で代理店契約の相手先）とアジレント・テクノロジー株式会社（分析機器の代理店契約の相手先）があり、関連当事者情報では横河ソリューションサービスと横河計測からの代理店契約に基づく商品仕入が印字されていますが、百科事典の掲載企業ではないため結ばず、ここに記録します。
- relatedCompanies: 大株主の状況に載るジーエルサイエンス株式会社（所有割合3.09％）は候補に含まれていないため結びませんでした。光通信の子会社である各投資事業有限責任組合は上場会社ではないため結んでいません。
- terms: 用語候補： プロセスオートメーション（PA、プラントなどの連続プロセスを自動で制御すること）、ファクトリーオートメーション（FA、工場の生産工程を自動化すること）、計装工事（計測・制御機器を現場に取り付けて配線・配管する工事）、ガスクロマトグラフ（気体試料の成分を分離して分析する装置）、ICP質量分析装置（プラズマで試料をイオン化して元素を分析する装置）、オシロスコープ（電気信号の波形を観測する計測器）、エンジニアリング商社（機器の販売に設計や工事、保守を組み合わせて提供する商社）、代理店契約（メーカーの製品を販売する権利と条件を定める契約）——いずれも本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
