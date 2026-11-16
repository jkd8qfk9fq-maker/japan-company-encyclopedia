# ドリームベッド — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ドリームベッド株式会社 |
| 証券コード | 7791 |
| docID（データを取り出した文書） | `S100ZFFY` |
| 原本 docID | `S100YHQB` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100ZFFY／有効文書 S100ZFFY（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100ZFFY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ドリームベッド株式会社 / 7791 / docID S100YHQB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dreambed: 10 件の数値を有報XBRLと照合
有報: ドリームベッド株式会社 訂正有価証券報告書－第69期(2025/04/01－2026/03/31) (docID S100ZFFY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第69期(2025/04/01－2026/03/31)、docID S100ZFFY）を有効文書としてこのパックを作った。原本は docID S100YHQB。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
dreambed: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100ZFFY、2026年11月12日提出）である。原本（docID S100YHQB）との差異は証拠パックの照合で差異なし（differenceCount 0）と確認されたrecord-onlyの訂正であり、主要な経営指標等の数値と本文は原本と同一のため、needsReviewには入れず、出典は訂正有報（タイトル・提出日・URL）とした。
- businessModel: 証拠パックに財務諸表の組替えへの注意があったが、指標表の数値は前期有報との照合で全系列差異がなく、指標表に影響する注記は印字されていないため、financialNotesには記載しなかった。販売経路の区分変更（ハウスメーカー向けを家具販売店向けに含める表示変更）は事業説明上の事項としてbusinessStructureのwarningsに記録した。
- businessModel: 主要な経営指標等の注記は、連結財務諸表を作成していないこと、関連会社を有していないこと、従業員数の定義、上場の経緯、株価の出典、潜在株式が存在しないこと、配当の決議事項など表示・定義の事項のみであり、いずれもfinancialNotesには記載しなかった。
- businessModel: 経営方針に印字された経営指標（売上高、ROE、PBR等）の目標値は投資指標の目標であるため、本文・perspectivesには書かず、存在のみをここに記録した。
- businessModel: MD&Aに印字された利益項目の金額や増減の理由は書いていない。本文の財務数値は売上高と当期純利益のみとした。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されており、needsReviewに記載する提出後の構造的事象はない。Wikipediaの記事は有報の事実の言い換えのみであったため使わなかった。
- businessStructure: 販売経路別の金額はMD&Aの販売実績（販売経路別）に百万円で印字された値を用いた。千円の印字を百万円に切り捨てると経路別の合計は12,173百万円となり、印字の売上高12,174百万円と1百万円の差が生じるため、合計は印字の値をそのまま採用した。
- businessStructure: 2026年3月期より、従来個別に記載していたハウスメーカー向けは家具販売店向けに含めて記載されている（【事業の内容】及びMD&Aの注記どおり）。
- businessStructure: 単一セグメントのため、事業の子区分は販売経路別に記載した。商品分類別の金額（マットレス、ソファ等）は事業の説明には使っていない。
- businessStructure: suppliersキーは旧スキーマのため省略した。協力工場での製造やOEM供給の事実は事業の説明に含めた。
- history: 沿革のうち、子会社の設立（1964年ドリームファニチャ、1970年ドリーム寝台工業、1972年ドリーム化工、1973年ドリーム総合研究所、1985年ドリームリース、1990年あさひ産業、1991年株式会社高須霊苑販売等）、流通センターの操業開始（1978年八千代、1988年千代田）、ショールーム・ショップの開設とリニューアル（1983年広島ショールームから2026年新横浜ギャラリーまで）、工場の増設（2022年新スプリング棟、2024年新縫製棟）、ISO9001の取得（1999年）は、構造の転機ではないため落とした。合併で消滅した子会社は2002年・2003年の合併の項目に集約した。
- history: 資本金の金額は沿革に書いていない（金額は有報の印字どおり資本金785百万円台で推移するが、沿革の項目には含めない規則に従った）。
- industry: 主たる業界は、閉じた分類に家具の区分がないため、家具メーカーの先例（オカムラ・イトーキ）に従い製造業として最も近いmachineryを暫定とした。詳細はtaxonomyGapsを参照。
- industry: 単一セグメント（ホームファニシング事業）のため副分類は付けていない。
- industry: w14のin-tree TSVに当社の行はないため、下記のtaxonomyGapsの行を親のマージ時に追記する必要がある。
- relatedCompanies: land（ブランド）、career（キャリア志向）、vector（ベクトル）、base-4481（ベース）、port（ポートフォリオ）、space（スペース）、arata（あらためて）、ray（ディスプレイ）、the-lead（リードタイム）、vision（ビジョン）、corona（新型コロナウイルス感染症）はいずれも一般語・部分一致による機械抽出であり、相手そのものへの取引・提携・資本関係の記述はないため、結ばなかった。
- relatedCompanies: en（ハイエンド等）、seki（情報セキュリティ等）はambiguousな部分一致であり、相手そのものへの記述はないため、結ばなかった。
- relatedCompanies: king: 有報のKING KOILは米国KING KOIL LICENSING COMPANY, INC.との独占ライセンス契約であり、候補の株式会社キングとは別法人であるため、結ばなかった。ライセンスの事実はbusinessModelと沿革に記載した。
- relatedCompanies: asahi: 設備表の「あさひ工場」は当社自身の工場名であり、候補の株式会社あさひとは無関係であるため、結ばなかった。なお、沿革のあさひ産業株式会社は2002年に当社が合併した元子会社で、これも候補とは別法人である。
- relatedCompanies: the-hyakujushi-bank（百十四銀行）、the-san-in-godo-bank（山陰合同銀行）: 借入契約の金融機関名の一覧に現れるのみで、資金調達を理由とする関係は結ばないため、結ばなかった。
- relatedCompanies: hirogin-holdings（ひろぎんホールディングス）、yamaguchi-financial-group（山口フィナンシャルグループ）: 特定投資株式として「資金調達先として取引の円滑化を図るため」との定型的な保有目的が印字されるのみであり、資金調達を理由とする関係は結ばないため、結ばなかった。
- relatedCompanies: greens（グリーンズ）、washington-hotel（ワシントンホテル）: 特定投資株式として「製品等の販売先として取引の円滑化を図るため」との保有目的が印字されるが、全銘柄に共通する定型句であり、その相手との個別の取引の記述はないため、結ばなかった。
- relatedCompanies: nafco（ナフコ）、yamada-holdings（ヤマダホールディングス）、mitsui-fudosan（三井不動産）: 売掛金の相手先別内訳に金額とともに現れるのみで、個別の取引関係の記述はないため、結ばなかった。
- relatedCompanies: garden: 株主優待の「三井ガーデンホテル無料宿泊券」の記載による部分一致であり、候補の株式会社ガーデンとは無関係であるため、結ばなかった。
- relatedCompanies: ricoh: 「リコールの実施」の記載による部分一致であり、株式会社リコーとは無関係であるため、結ばなかった。
- relatedCompanies: 候補外の主要な関係先として、ライセンサーのSerta Simmons Bedding, LLC、ROSET SAS、RUF-BETT INTERNATIONAL GMBH & CO.KG、KING KOIL LICENSING COMPANY, INC.はいずれも海外法人でrelated-candidatesに含まれないため結ばなかった。当社には関係会社はなく、【関係会社の状況】は「該当事項はありません」と印字されている。
- terms: 助言のみ。用語候補: 「ポケットコイル」（それぞれのスプリングが袋内に収納され互いに独立して加重を支えるマットレスの構造で、体の凹凸にフィットして寝姿勢を支える。当社は太さ・形状・配列の組み合わせで寝心地を調整している）、「ライセンス生産」（海外ブランドとのライセンス契約に基づき国内でそのブランドの製品を製造すること。当社はSerta、KING KOIL、ligne roset、rufで採用している）、「空環」（当社がミッション「空環創造宣言」で使う、空間と環境を組み合わせた造語）、「アップホルスターベッド」（布張りのベッドで、rufブランドの代表的な製品形態）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ドリームベッドの主たる業界（ベッド・マットレス・ソファ等の家具の製造販売） → 提案: furniture（家具・寝具）。主事業はベッド、マットレス、ソファ、寝装品等の家具のデザイン開発・製造・販売であり、2026年3月期の売上高は12,174百万円です。閉じた分類の19種に家具を表す区分がなく、製造業として最も近い machinery を暫定としました。オフィス家具メーカーのオカムラ・イトーキでも同じ区分が足りていません。
