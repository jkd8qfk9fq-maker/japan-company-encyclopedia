# ワイヤレスゲート — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ワイヤレスゲート |
| 証券コード | 9419 |
| docID（データを取り出した文書） | `S100XSUO` |
| 原本 docID | `S100XSUO` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSUO.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%AC%E3%82%B9%E3%82%B2%E3%83%BC%E3%83%88

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ワイヤレスゲート / 9419 / docID S100XSUO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wirelessgate: 6 件の数値を有報XBRLと照合
有報: 株式会社ワイヤレスゲート 有価証券報告書－第22期(2025/01/01－2025/12/31) (docID S100XSUO)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-12-31","previousFiling":9650521000,"latestFiling":9776033000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-12-31","previousFiling":-218831000,"latestFiling":-337677000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-12-31","previousFiling":188236000,"latestFiling":1996000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":2715296000,"latestFiling":3036977000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":2787503000,"latestFiling":2939623000},{"key":"NetAssetsSummaryOfBusinessResults|2021-12-31","previousFiling":570974000,"latestFiling":892655000},{"key":"NetAssetsSummaryOfBusinessResults|2022-12-31","previousFiling":772123000,"latestFiling":924064000}]
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
wirelessgate: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報（第21期、S100VGCF）との修正再表示チェックで挙がった差異は、すべて前期有報の提出会社（単体）の経営指標の値と当期有報の連結経営指標の値を突き合わせたことによる基礎の違いであり、訂正ではありません。前期有報の連結経営指標（2021年12月期の売上高9,776,033千円、2022年12月期の売上高8,531,068千円、経常損益・純資産額・総資産額・親会社株主に帰属する当期純損益）は当期有報の印字と全系列で一致することを、前期有報のXBRL（XBRL_TO_CSV）で直接確認しました。現在の値（今期有報の連結経営指標）をそのまま使っています。
- businessModel: 事業別の売上高は千円単位の印字を百万円未満切り捨てで記載しました。切り捨て後の単純合計（8,272百万円＋75百万円）は8,347百万円となり、印字された連結売上高8,348百万円と1百万円の差があります（千円単位では合計と一致します）。
- businessModel: 株式会社FREEDiVEの取得に伴うのれんは、企業結合日における識別可能な資産及び負債の特定と時価の算定が未了のため暫定的に算定された金額です。取得原価・のれん等の金額は本文に記載していません。条件付取得対価（アーンアウト）は現時点では確定していないため、本文に記載していません。
- businessModel: 中期経営計画の数値目標（売上高・利益・自己資本利益率の目線を含む）は投資指標・利益指標のため、本文・戦略には記載していません。配当政策も資本政策のため記載していません。
- businessModel: 主要な経営指標等の注記2〜4（潜在株式調整後1株当たり当期純利益の非開示、株価収益率の非開示）は表示事項のため、financialNotes には入れず、ここに記録します。
- businessModel: 株式会社closipの全株式売却に伴う関係会社株式売却益などの金額は、利益・特別損益に関わるため本文に記載していません。
- businessStructure: 単一セグメント（ワイヤレス・ブロードバンド関連事業）のため、事業の区分は【事業の内容】の事業区分と収益認識関係注記の売上高区分により、売上高の大きい順に通信事業、デジタルマーケティング事業の順で記載しました。モバイルWiFiサービス事業は2025年12月期は貸借対照表のみの連結で売上高が含まれていないため、金額を書かず最後に置きました。
- businessStructure: 事業別の売上高は千円単位の印字を百万円未満切り捨てで記載しました。切り捨て後の単純合計（8,272百万円＋75百万円）は8,347百万円となり、印字された連結売上高8,348百万円と1百万円の差があります（千円単位では合計と一致します）。
- businessStructure: suppliers は旧スキーマのため省略しました。通信回線の仕入先については、主力のWiMAXはKDDI株式会社から仕入れている旨を関連企業に記載しています。
- businessStructure: 主要な設備は本社（提出会社、従業員35人）と株式会社FREEDiVE本社（従業員20人）であり、連結の従業員数55人と一致します。設備の帳簿価額は本文に記載していません。
- history: 沿革のうち、商品・サービスの開始や本社移転などの細目は落とし、ここに列挙します: 2005年ワイヤレス・プラットフォームサービスの提供開始、2009年「ワイヤレスゲートWi-Fi＋WiMAX」の提供開始、2010年本社の現在地への移転、2012年株式会社ワイヤレステクノロジー・ラボ及び株式会社ワイヤレスマーケティング・ラボの設立、2012年「ワイヤレスゲートWi-Fi＋LTE」の提供開始、2013年「ワイヤレスゲートWi-Fi＋WiMAXツープラス」の提供開始、2014年Wi-Fiインフラ事業の開始、2014年株式会社ワイヤレステクノロジー・ラボの吸収合併、2014年「ワイヤレスゲートWi-Fi＋LTE SIMカード」の提供開始、2016年株式会社closip（旧・株式会社LTE-X）の設立、2021年「ワイヤレスゲートWiMAX+5G」の提供開始。
- history: 資本金の金額は沿革に書かない規則のため記載していません。
- industry: 単一セグメントであるワイヤレス・ブロードバンド関連事業は、WiMAX・Wi-Fi等の無線通信サービスの提供であり、telecommunications が直接当てはまるため主たる業界としました。分類の不足はありません。
- industry: デジタルマーケティング事業（2025年12月期の売上高75百万円）とモバイルWiFiサービス事業（同・貸借対照表のみの連結で売上高なし）も通信サービスの販売・提供に付随する事業のため、副業界は付けませんでした。
- relatedCompanies: hikari-tsushin: 大株主の状況に載るのは「光通信KK投資事業有限責任組合」（投資事業有限責任組合）であり、株式会社光通信とは別の法人格のため、代替として結びませんでした。
- relatedCompanies: robot-payment: 連結子会社である株式会社FREEDiVEが決済代行を委託している旨の記載はありますが、契約の当事者は子会社であり、候補が数値のみの段階（figures-only）でもあるため、慎重を期して結びませんでした。
- relatedCompanies: kohsoku: 「高速」は高速通信を指す一般語としての出現であり、株式会社高速との関係の記載はありません。
- relatedCompanies: career: 「キャリア」は人材の経歴を指す一般語としての出現であり、株式会社キャリアとの関係の記載はありません。
- relatedCompanies: land: 「ランド」はブランドの部分一致であり、株式会社ランドとの関係の記載はありません。
- relatedCompanies: port: 「ポート」はサポート等の部分一致であり、ポート株式会社との関係の記載はありません。
- relatedCompanies: path: 「パス」はパーパス等の部分一致（ambiguous）であり、パス株式会社との関係の記載はありません。
- relatedCompanies: seki: 「セキ」はセキュリティの部分一致（ambiguous）であり、セキ株式会社との関係の記載はありません。
- relatedCompanies: vision: 「ビジョン」は企業理念のビジョンを指す一般語であり、株式会社ビジョンとの関係の記載はありません。
- relatedCompanies: en: 「エン」はエンゲージメントの部分一致（ambiguous）であり、エン株式会社との関係の記載はありません。
- relatedCompanies: freee: 「フリー」はSIMフリーの部分一致であり、フリー株式会社との関係の記載はありません。
- relatedCompanies: max: 「マックス」はWiMAXの部分一致であり、マックス株式会社との関係の記載はありません。
- relatedCompanies: lec: 「レック」は一般語の部分一致であり、レック株式会社との関係の記載はありません。
- relatedCompanies: nissin: コードリストにない候補であり、新株予約権の記載中の部分一致（ambiguous）のため結びませんでした。
- relatedCompanies: ray: 「レイ」はキレイ等の部分一致（ambiguous）であり、株式会社レイとの関係の記載はありません。
- relatedCompanies: 大株主の状況に載るその他の上位株主は、投資事業有限責任組合や個人等であり、結ぶべき事業会社はありませんでした。株式の保有状況では、純投資目的以外の投資株式は「該当事項はありません」とされており、保有株式を根拠とする関連付けもありません。
- terms: 助言: 用語「WiMAX」は、無線通信技術の規格の一つ（Worldwide Interoperability for Microwave Accessの略）。当社の主力サービス「ワイヤレスゲートWiMAX＋5G」は、WiMAX 2+に加えてau 4G LTEとau 5Gの回線を利用できる。
- terms: 助言: 用語「eSIM」は、スマートフォンにダウンロードして利用する埋め込み型のSIM。デジタルマーケティング事業では、訪日客向けのプリペイド型eSIMを販売している。
- terms: 助言: 用語「MVNO（仮想移動体通信事業者）」は、自ら通信設備を持たず、通信事業者から回線を借りて通信サービスを提供する事業者。当社はKDDI株式会社などから通信回線を仕入れてサービスを提供している。
- terms: 助言: 用語「公衆無線LANスポット」は、駅・空港・ホテル・カフェ等の商業施設で無線LANによるインターネット接続が可能な場所。当社のWi-Fiサービスは全国約40,000ヵ所のスポットで利用できる。
- terms: 助言: 用語「ストック型の課金モデル」は、月額有料会員からの利用料収入が継続的・安定的に発生する収益モデル。ワイヤレス・リモートサービス事業とモバイルWiFiサービス事業がこのモデルに当たる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
