# カナレ電気 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | カナレ電気株式会社 |
| 証券コード | 5819 |
| docID（データを取り出した文書） | `S100XULV` |
| 原本 docID | `S100XRBT` |
| 提出日（原本） | 2026-03-18 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XULV／有効文書 S100XULV（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XULV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | カナレ電気株式会社 / 5819 / docID S100XRBT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
canare-electric: 10 件の数値を有報XBRLと照合
有報: カナレ電気株式会社 訂正有価証券報告書－第53期(2025/01/01－2025/12/31) (docID S100XULV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第53期(2025/01/01－2025/12/31)、docID S100XULV）を有効文書としてこのパックを作った。原本は docID S100XRBT。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
canare-electric: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析に印字された営業利益・経常利益・売上総利益の金額や増減の理由、セグメント利益の金額は、本文の規則により書いていない。売上高と親会社株主に帰属する当期純利益のみを記載した。経営方針に掲げる1株当たり当期純利益の目標も、投資指標の目標であるため本文や戦略には書いていない。
- businessModel: 訂正有価証券報告書（S100XULV）は record-only の分類で、原本（S100XRBT）との差異は役員の状況のテキストブロックのみであり、財務の数値も本文も同一であるため、needsReview にはせず、出典は訂正有報の値とした。前期有報との修正再表示照合は全6系列で差異がなかった。主要な経営指標等の推移の注記2（収益認識に関する会計基準を第50期の期首から適用）は financialNotes に記録した。証拠パックの遡及適用に関する注意については、指標表に組替えや修正再表示の注記がなく、前期照合にも差異がないため、perspectives の basis には書かなかった。
- businessModel: 重要な後発事象は、連結・個別のいずれも「該当事項はありません」であった。指標表の注記に自社の株式分割・株式併合の記載はない。
- businessModel: セグメント注記の外部顧客への売上高は、千円単位で各区分を合計すると報告セグメント計の印字（11,351,526千円）と2千円異なり、印字の連結売上高（13,114,992千円）とも1千円異なる。有報側の丸めとみて、区分・合計とも印字どおり記載した。百万円未満切り捨ての区分合計（13,111百万円）は印字の合計（13,114百万円）と異なるため、合計は印字の値を用いた。
- businessModel: 株式の保有状況には、純投資目的以外の投資株式は原則として保有しない方針で、前事業年度及び当事業年度に保有実績がないことが印字されているため、政策保有株式による関連企業はない。保有する純投資目的の株式は銘柄が印字されていない。
- businessModel: 証拠パックの Wikipedia（記事「カナレ電気」）は、本社所在地と製品の説明で、有報に記載のある事実の範囲を超える補足がほぼないため、出典には使わなかった。
- businessStructure: 事業は地域別セグメント（日本、米国、韓国、中国、台湾、シンガポール）で構成し、セグメント注記の外部顧客への売上高の大きい順に並べた。「その他」は有報が報告セグメントに含まれない区分（インド、欧州及び中東）と印字するため、金額にかかわらず最後に置いた。
- businessStructure: 主要な設備の状況は、有報のセグメント欄の印字どおり各地域の事業に対応づけた（インド、欧州、中東の設備は「その他」に対応）。帳簿価額は書いていない。
- businessStructure: このツリーの旧スキーマに従い suppliers は省略した。製造は当社グループの子会社が担っており、外部の個別の仕入先は印字されていない。
- businessStructure: 連結子会社は12社（カナレハーネス、カナレコネクティッドプロダクツ、カナレシステムワークス、Canare Corporation of America、Canare Corporation of Korea、Canare Corporation of Taiwan、Canare Electric (Shanghai) Co.,Ltd.、Canare Electric Corporation of Tianjin、Canare Singapore Private Ltd.、Canare Electric India Private Ltd.、Canare Europe GmbH、Canare Middle East FZCO）で、いずれも当社グループの会社のため関連企業には結んでいない。
- history: 以下の沿革項目は、製品の細目や拠点の移転・改称などの事項のため落とした: 1977年の放送用カラーマイクロホンケーブルの販売開始、1987年の75ΩBNC型コネクタの販売開始（競争優位の根拠には使用した）、1993年のナノテック研究所の完成、1995年の本社移転と日進工場の改称、2004年の中国・天津への販売子会社の設立と事業所の統合、2009年の本社所在地の移転と東京事業所の閉鎖、2011年のカナレシステムワークスの設立、2012年の株式会社カナレテック（現カナレコネクティッドプロダクツ）の設立、2017年と2020年の本社機能の移転、2023年の新横浜本社と横浜事業所の機能移転統合。
- history: 1982年のカナレ電線株式会社の設立は、1989年の合併の項目の中で言及した。
- history: 沿革には年月が印字されているが、規則に従い年のみを記載し、月は書いていない。資本金額も書いていない。
- industry: 提出者情報（DEI）の別記事業はCTEである。主たる業界は、放送・通信用ケーブル、コネクタ、ハーネス、機器（パッシブ・電子）の製造・販売という実体から electronics が閉じた分類に直接該当するため、暫定にはしていない。
- relatedCompanies: base-4481（ベース株式会社）: 「営業利益ベース」の語句の部分一致であり、同社との関係の記述はないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「レポート」の語句の部分一致であり、同社との関係の記述はないため結ばなかった。
- relatedCompanies: the-lead（株式会社リード）: 「リードタイム」の語句の部分一致であり、同社との関係の記述はないため結ばなかった。
- relatedCompanies: cover（カバー株式会社）: 「カバーできる」の語句の部分一致であり、同社との関係の記述はないため結ばなかった。
- relatedCompanies: en（エン株式会社）: ambiguous の候補で、「エンターテイメント」の語句の部分一致であり、同社との関係の記述はないため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）: ambiguous の候補で、「高速化」の語句の部分一致であり、同社との関係の記述はないため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「ブランド」の語句の部分一致であり、同社との関係の記述はないため結ばなかった。
- relatedCompanies: noda（株式会社ノダ）: ambiguous の候補である。有報の大株主の状況に印字されるのは株式会社ノダノ（所有割合2.92％）という別法人であり、候補の株式会社ノダとは異なるため結ばなかった。読み替えはしていない。
- relatedCompanies: zero（株式会社ゼロ）: ambiguous の候補で、「使用価値はゼロ」の語句の部分一致であり、同社との関係の記述はないため結ばなかった。
- relatedCompanies: 大株主の状況に載る有限会社香流（11.69％）、株式会社新高輪（11.69％）、株式会社センリキ（5.12％）、株式会社センユキ（5.12％）、株式会社サウンドハウス（2.43％）などは、候補一覧にないため結ばなかった。INTERACTIVE BROKERS LLCは証券会社であり純投資の名義であるため結ばなかった。
- terms: 助言: 「ハーネス」は、複数のケーブルを束ねて機器同士を接続できるように加工した配線部材です。
- terms: 助言: 「機器（パッシブ）」は増幅などの能動的な信号処理を行わない機器を指し、有報では能動素子を使う「機器（電子）」と区別して製品区分を印字しています。
- terms: 助言: 「12G-SDI」は4K・8K放送向けに高速化した映像信号の伝送規格で、有報では対応製品群の文脈で使われています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
