# 那須電機鉄工 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 那須電機鉄工株式会社 |
| 証券コード | 5922 |
| docID（データを取り出した文書） | `S100YJYT` |
| 原本 docID | `S100YJYT` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJYT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 那須電機鉄工株式会社 / 5922 / docID S100YJYT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nasu-denki-tekko: 10 件の数値を有報XBRLと照合
有報: 那須電機鉄工株式会社 有価証券報告書－第104期(2025/04/01－2026/03/31) (docID S100YJYT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nasu-denki-tekko: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨てて記載した（切り上げはしていない）。セグメント外部売上高の合計は連結売上高と一致する。
- businessModel: 報告セグメントの名称変更（交通インフラ事業→交通等インフラ事業）は名称変更のみであり、会計方針の変更でも組替えでもないため financialNotes には書かず、事業構造の説明と本warningsに記録した。前期有報との修正再表示チェックは全6系列で差異なし。
- businessModel: MD&Aの営業利益・経常利益等の金額、受注高・受注残高、生産高は本文の数値の対象外のため書いていない。連結子会社（那須電材産業・東北那須電機）の個別の損益情報も書いていない。
- businessModel: suppliers はこのツリーのスキーマに無いため businessModel には書かなかった。原材料の仕入先に関する個別の開示は有報にない。
- businessModel: 最大の販売先である東京電力パワーグリッド株式会社と大明通産株式会社は関連候補リストにないため関連企業には結べず、顧客の事実は businessModel の flow と perspectives に記録した。
- businessStructure: セグメントは外部顧客への売上高の大きい順に並べた（電力・通信インフラ事業19,589百万円、交通等インフラ事業4,158百万円。合計は連結売上高23,747百万円と一致）。
- businessStructure: 報告セグメント名の変更（交通インフラ事業→交通等インフラ事業）は名称変更のみでセグメント情報への影響はないため、needsReviewにはせず、事業の説明と本warningsに記録した。
- businessStructure: 関係会社の状況では連結子会社のうち3社（那須電材産業・那須電機商事・東北那須電機）が名称付きで開示され、残りは「その他4社」とされている。沿革に現連結子会社と明記された北海道那須電機・那須化成・那須エンジニアリング（旧那須設計）・Nテックを合わせた7社が連結子会社で、非連結子会社は電材運輸である。子会社の売上高等の損益情報は本文の数値として使っていない。
- history: 沿革の資本金額（設立時・増資時の資本金）は本文の数値として使えないため、各行から除いて記録した。
- history: 沿革表は年月と事象が対応して読める形で開示されており、行順の対応づけは不要だった。
- industry: 主たる事業は送電用鉄塔・架線金物等の鋼製インフラ資材の製作であり、閉じた分類に金属製品・鉄鋼製品の区分がないため、製造業の最も近い値として machinery（機械）を暫定で選んだ。電力会社向けの販売が中心でも、電力事業者ではないため energy は付けない。報告セグメント単位で独立開示のない事業には業界を足していない。
- relatedCompanies: 関連企業は4件（tohoku-electric-power、kfc、tomoe、sanyo-denki）。東北電力は有報の主要な顧客情報・販売実績に載る販売先。ケー・エフ・シー、巴コーポレーション、山洋電気は【大株主の状況】に載る事業会社の大株主（金融機関・信託・ファンドは除いた）。当社も3社の株式を特定投資株式として保有する持合いの関係にあるが、保有目的は全銘柄同一の定型文のため、持合い自体は取引関係の根拠にしていない。
- relatedCompanies: 結ばなかった候補: kandenko（関電工）、mitsubishi-corporation（三菱商事）、okaya-and-co（岡谷鋼機）、takaoka-toko（東光高岳）— 特定投資株式の保有目的が全銘柄同一の定型文「取引関係の円滑化、信頼関係の保持。」のみで、個別の取引内容の記載がないため結ばなかった。
- relatedCompanies: 結ばなかった候補: jfe-holdings（JFEホールディングス）、fujikura（フジクラ）、maruichi-steel-tube（丸一鋼管）、sumitomo-mitsui-trust-group（三井住友トラストグループ）— 2026年3月期に保有目的を純投資目的へ変更した銘柄で、当期の特定投資株式には計上されていないため結ばなかった。
- relatedCompanies: 結ばなかった候補: sumitomo-mitsui-financial-group、mizuho-financial-group、mitsubishi-ufj-financial-group、the-chiba-kogyo-bank（千葉興業銀行）、tokyo-kiraboshi-financial-group（東京きらぼしフィナンシャルグループ）— 金融機関であり、特定投資株式の保有目的も定型文のみのため結ばなかった。大株主の株式会社三井住友銀行は三井住友フィナンシャルグループの子会社で候補の持株会社とは別法人であり、みずほ信託銀行は信託銀行（資産管理）のため、いずれも結ばなかった。
- relatedCompanies: 結ばなかった候補: 東京電力ホールディングス — 特定投資株式に記載があるが関連候補リストになく、保有目的も定型文のみのため結ばなかった。最大の販売先である東京電力パワーグリッド株式会社と大明通産株式会社も関連候補リストにないため結べず、顧客の事実は businessModel に記録した。
- relatedCompanies: 結ばなかった候補: エムエム建材（大株主2.63％）と明治安田生命保険相互会社（同2.57％）は関連候補リストにないため結ばず、ここに事実を記録する。NIPPON ACTIVE VALUE FUND PLC（7.46％）とNAVF SELECT LLC（3.53％）は投資ファンドであり、事業会社ではないため結ばなかった。
- relatedCompanies: 結ばなかった候補（語の一致のみ）: career（キャリア構築の文脈）、suzuki-6785（代表取締役社長の姓）、grid（東京電力パワーグリッドの名称の一部）、land（100年企業ブランドの文脈）、path（キャリアパス制度）、zero（GHG排出量ゼロの目標）、ishin、base-4481（営業利益ベースの文脈）、kohsoku（高速道路の文脈）、seki、applied-technology（応用技術開発の文脈）、core（コア技術の文脈）、corona（新型コロナウイルスの文脈）、en（那須エンジニアリングの名称の一部）。
- terms: 用語の助言のみの工程。「架線金物」は、送電線や配電線を鉄塔・電柱に取り付けるための金具類を指す当社の主要製品分野の呼称。「碍子」は、電線と鉄塔・支持物を絶縁するための部品で、当社の会津工場は碍子工場として新設された。「無電柱化」は、電線を地中化して電柱をなくす取り組みで、交通等インフラ事業で提案を行っている。「通信鉄塔延命化工事」は、既存の通信鉄塔の寿命を延ばすための工事を指す。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 那須電機鉄工（nasu-denki-tekko）の主たる業界（電力・通信インフラ向け資材の製作・販売） → 提案: 電力インフラ資材（鉄塔・架線金物等の送配電設備材料）。送電用鉄塔や架線金物、碍子加工品など電力・通信インフラ向け鋼製資材の製作・販売が売上の大半を占めるが、閉じた分類に金属製品・電力インフラ資材の区分がなく、機械とも電機とも言い切れないため。
