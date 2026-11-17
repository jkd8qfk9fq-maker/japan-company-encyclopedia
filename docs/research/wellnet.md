# ウェルネット — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ウェルネット株式会社 |
| 証券コード | 2428 |
| docID（データを取り出した文書） | `S100Z3QG` |
| 原本 docID | `S100Z3QG` |
| 提出日（原本） | 2026-09-24 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3QG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ウェルネット株式会社 / 2428 / docID S100Z3QG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wellnet: 10 件の数値を有報XBRLと照合
有報: ウェルネット株式会社 有価証券報告書－第44期(2025/07/01－2026/06/30) (docID S100Z3QG)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
wellnet: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。５年間の経営指標等の表の期間中に、決算期の変更・変則決算・会計基準の変更は無く（証拠パックの fiscalYearChange・irregularPeriods でも確認）、前期有報との修正再表示チェックも全項目で差異が無かった。
- businessModel: 中期経営計画「Think Wild.」における2030年６月期の利益規模の倍増という目標は、利益の数値目標であるため perspectives には書かなかった。
- businessModel: 売上高の内訳は、単一セグメントのためサービス別の金額が開示されておらず、flow の revenue には合計額のみを書いた。
- businessModel: 主要な販売先であるアマゾンジャパン合同会社と株式会社ＫＯＭＯＪＵ（前事業年度の主要な販売先であった株式会社ＤＥＧＩＣＡが2026年３月５日付で商号変更）は、関連企業の候補に無いため relatedCompanies には結んでいない。
- businessStructure: 当社は決済・認証事業の単一セグメントで、セグメント情報の「製品及びサービスごとの情報」も省略されているため、【事業の内容】に印字されたサービス区分（マルチペイメントサービス・送金サービス・電子マネーサービス・交通系事業者向ＤＸ化ソリューション・その他サービス）を children とした。サービス別の金額は開示されていないため、金額は書いていない。
- businessStructure: suppliers は本ツリーのスキーマに無いため省略した。事業の内容に特定の仕入先の記載はない。
- businessStructure: 札幌証券取引所については、表紙に市場区分の印字が無いため listings の market を付けなかった（沿革に本則市場への重複上場の印字がある）。
- businessStructure: Wikipedia の冒頭は有報の記載の範囲内の内容であり、有報に無い補足として使える事実が無かったため、出典には加えなかった。
- history: 沿革は年月まで印字されているが、成果物の規則により year のみの形にし、月は書いていない。
- history: 設立時や増資などの資本金の金額は、規則により沿革に書いていない。
- history: 1999年の一髙たかはしによる当社株式50.2％の取得は、2009年の完全子会社化の記載で経緯が分かるため独立した項目にはしなかった。
- history: 2026年７月の南海電鉄「南海デジタルきっぷ」への採用など、決算日後・提出日前の出来事が沿革に印字されている。これらは有報の沿革そのものの記載であり事実として確認できるため、2026年の項目は作らず、2024年のＱＲ乗車券の項目と経営方針側の記載にとどめた。
- industry: 主たる業界は it（IT・ソフトウェア）とした。当社は自社のシステムで決済・認証プラットフォームを提供する情報サービス事業者で、売上高10,059百万円の全てが決済・認証事業から生じている。資金移動や収納代行は事業者の代金の仲介であり、貸付などの金融機関業務ではないため finance（金融）は付けなかった。
- industry: 交通事業者向けＤＸ化ソリューションは交通事業者へのシステム提供であり、当社自身が運輸業を行うものではないため transportation（運輸）は付けなかった。分類の不足は無いため taxonomyGaps は空とした。
- relatedCompanies: japan-communications（日本通信株式会社）: 経営方針に「日本通信株式会社との協働で」本人認証付き電子マネーを展開する方針が印字され、沿革にも2024年11月の協業開始、MD&Aにも同社の認証基盤を活用した社会実装の取組が印字されているため business-partner とした。
- relatedCompanies: east-japan-railway（東日本旅客鉄道株式会社）: 沿革に2021年６月、同社の「えきねっと」にウェルネット決済の提供を開始した印字があるが、当事業年度における取引や継続を示す記載（主要な顧客への掲載等）が確認できないため結ばなかった。
- relatedCompanies: the-kansai-electric-power（関西電力株式会社）: 沿革に2017年８月、「支払秘書」のファーストクライアントとして採用された印字があるが、当事業年度の取引関係を示す記載が無いため結ばなかった。
- relatedCompanies: ana-holdings（ＡＮＡホールディングス株式会社）・japan-airlines（日本航空株式会社）: 特定投資株式として保有するが、保有目的は「取引先の情報収集及び株主優待・配当等収益メリット享受目的」と全銘柄共通の定型句で、情報収集目的の保有であり、その相手との取引・提携の記載は無いため結ばなかった。
- relatedCompanies: mizuho-financial-group（株式会社みずほフィナンシャルグループ）・sumitomo-mitsui-financial-group（株式会社三井住友フィナンシャルグループ）・trust（株式会社トラスト）: 投資有価証券の社債銘柄として名称が印字されているだけで、取引・提携の記載は無いため結ばなかった（trust はコードリストにも無く、印字は三井住友トラスト・ホールディングスの社債で別法人）。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 大株主の状況に印字されているのは「光通信ＫＫ投資事業有限責任組合」（所有株式数の割合2.62％、2026年６月30日現在）であり、株式会社光通信そのものとは別法人のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group に関して: 大株主の株式会社三井住友銀行（所有割合4.84％）は同グループの銀行であり、金融機関の保有であるうえ、候補の三井住友フィナンシャルグループとは別法人のため結ばなかった。
- relatedCompanies: japan-post-bank（株式会社ゆうちょ銀行）・japan-post-holdings（日本郵政株式会社）: 沿革の印字は日本郵政公社（現ゆうちょ銀行）ＡＴＭとの接続（2006年）で、銀行との接続であり、当事業年度の取引関係を示す記載も無いため結ばなかった。日本郵政株式会社との関係の記載は無い。
- relatedCompanies: rakuten-bank（楽天銀行株式会社）・sbi-sumishin-net-bank（住信ＳＢＩネット銀行株式会社）・ministop（ミニストップ株式会社）・three-f（株式会社スリーエフ）: 沿革に接続・サービス拡大の印字（2006年・2011年・2006年・2011年）があるが、いずれも決済チャネルの接続であり当事業年度の取引関係を示す記載が無いため結ばなかった（sbi-sumishin-net-bank はコードリストにも無い）。
- relatedCompanies: nextage（株式会社ネクステージ）: 印字されている相手は株式会社アクセスネクステージであり、候補の株式会社ネクステージとは別法人のため結ばなかった。
- relatedCompanies: medical-system-network（株式会社メディカルシステムネットワーク）: 財務諸表の注記（相手先別の金額一覧）に名称があるだけで、取引や提携の内容の記載が無いため結ばなかった。
- relatedCompanies: seki・kohsoku・step・en・freee・king・port・base-4481・career・corona・densan・innovation・path・will・nissin: いずれも一般語の部分一致（「セキュリティ」「高速バス」「ステップ３」「コンビニエンス」「フリー乗車券」「バンキング」「サポート」「Ｗｅｂベース」「キャリア形成」「新型コロナウイルス」「電算業務」「イノベーション」「フリーパス」「コンピューターウィルス」等）で、相手企業への言及ではないため結ばなかった（nissin はコードリストにも無く ambiguous）。
- relatedCompanies: yamazaki（株式会社ヤマザキ）: 印字はコンビニチェーン「デイリーヤマザキ」であり、候補の株式会社ヤマザキとの関係の記載は無いため結ばなかった。
- terms: 助言: 用語「マルチペイメントサービス」は、払込票を使う収納代行と、番号やバーコードを電送するペーパーレス決済を束ねた当社の中核サービス名で、事業の内容に印字されています。
- terms: 助言: 用語「収納代行」は、事業者に代わってコンビニや郵便局などで代金を受け取り、事業者へ送金する業務で、当社の設立以来の基幹業務です。
- terms: 助言: 用語「支払秘書」は、当社のサーバー型電子マネーのスマートフォンアプリで、公共料金や交通、ＥＣの支払いに使われています。
- terms: 助言: 用語「バスもり！」はバスの予約・購入アプリ、「アルタイルトリプルスター」は交通事業者向けのオールインワンのクラウドサービスで、いずれも事業の内容と経営方針に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
