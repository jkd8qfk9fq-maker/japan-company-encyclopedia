# オーウエル — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | オーウエル株式会社 |
| 証券コード | 7670 |
| docID（データを取り出した文書） | `S100YFWA` |
| 原本 docID | `S100YFWA` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFWA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | オーウエル株式会社 / 7670 / docID S100YFWA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
o-well: 10 件の数値を有報XBRLと照合
有報: オーウエル株式会社 有価証券報告書－第84期(2025/04/01－2026/03/31) (docID S100YFWA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
o-well: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額はセグメント注記の外部顧客への売上高、連結売上高、親会社株主に帰属する当期純利益のみとした。セグメント利益の金額や増減率は本文に書いていない。MD&Aに印字されたセグメント売上高（コーティング関連事業47,861百万円、エレクトロニクス関連事業20,407百万円）はセグメント注記の外部顧客への売上高と一致することを確認した。
- businessModel: 中期経営計画「MAP24-26」の目標数値（売上高、各種利益、ROE等）は将来に関する事項であり、利益や投資の語を含むため本文に転記せず、方針の要約のみとした。
- businessModel: 事業の内容に印字された販売先・仕入先の社数（約3,000社・約2,000社）は「約」の概数のため本文に書かず、ここに記録する。
- businessModel: financialNotes は空とした。変則決算・決算期変更はなく、修正再表示チェックで前期有報との重複年度の全指標が一致し、印字された理由のある数値の相違も確認できないためである。セグメント名称の変更と財務諸表の組替えの扱いは businessStructure の warnings に記録した。
- businessModel: 重要な後発事象の節は本文になく、後発事象として開示された事項は確認できない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（コーティング関連事業47,861百万円、エレクトロニクス関連事業20,407百万円）とした。金額はいずれもセグメント注記の百万円単位の印字そのままである。2セグメントの単純合計は68,268百万円で連結売上高と一致する。
- businessStructure: 2025年3月期より報告セグメントの名称を「塗料関連事業」から「コーティング関連事業」へ、「電気・電子部品事業」から「エレクトロニクス関連事業」へ変更しているが、名称の変更のみでセグメント情報に与える影響はないと印字されているため、financialNotes には書かずここに記録する。
- businessStructure: 証拠パックの注意書きにある財務諸表の組替えについては、修正再表示チェックで前期有報との重複年度の全指標（売上高・純利益・利益・総資産・純資産・従業員数）が一致しており、数値の変更を伴う再表示は確認できないため、financialNotes には書かずここに記録する。
- businessStructure: 2025年10月に塗料販売業を営む明豊商事株式会社の全株式を取得し非連結子会社とした（当期中の変動で、期末のグループ構成に反映済み）。UNI-ELECTRONICS PTE LTD.（2025年5月29日清算結了）と奥唯（上海）貿易有限公司（2025年7月11日清算結了）は当期中に清算済みで、期末のグループ構成には含まれない。
- businessStructure: 連結子会社15社は関係会社の状況に個別掲記された会社と一致する。子会社の単体の損益情報等は本文に書いていない。
- history: 沿革は年月まで印字されているが、history の形に合わせて年のみを記録した。設立・子会社設立時の資本金の金額は本文に書いていない。
- history: 2013年ドイツ子会社設立・2013年上海子会社設立・2014年タイ及びベトナム子会社設立・2017年メキシコ子会社設立・2021年深圳子会社設立など他の海外拠点の設立行は、沿革の要点として2008年中国進出・2011年韓国・2024年インドの行に絞り、ここに列挙して記録する。2025年7月の上海子会社の清算と大連子会社の上海分公司設立も同様にここに記録する。
- industry: 主たる事業は塗料・化成品と電子部品の販売を中心とする専門商社であり、半導体・電子部品商社の掲載済み先例（マクニカホールディングス、レスター、伯東はいずれも trading を主たる業界とする）に倣い trading を主たる業界とした。ホールIC（半導体磁気センサー）を主力商品とするエレクトロニクス関連事業が独立した報告セグメント（2026年3月期の外部顧客への売上高20,407百万円）として開示されているため、semiconductors を第二の業界として付けた。塗料は製造ではなく販売・調色加工・塗装請負が中心のため chemicals は付けていない。
- relatedCompanies: kansai-paint（関西ペイント）: 関西ペイント販売株式会社（関西ペイントの子会社）とも日本特約店取引契約を結んでいるが、同社は未上場で候補にもないため結ばず、ここに記録する。関西ペイント自身との契約は重要な契約等に印字されている。
- relatedCompanies: yushiro（ユシロ）、koatsu-gas-kogyo（高圧ガス工業）、maruichi-steel-tube（丸一鋼管）、nishikawa-rubber（西川ゴム工業）、daikyonishikawa（ダイキョーニシカワ）、daishin-chemical（大伸化学）、kawakami-paint-mfg（川上塗料）、sk-kaken（エスケー化研）、shinko-wire（神鋼鋼線工業）、nihon-parkerizing（日本パーカライジング）、inaba-seisakusho（稲葉製作所）、okamura（オカムラ）、press-kogyo（プレス工業）、sekisui-chemical（積水化学工業）、nissan（日産自動車）、isuzu-motors（いすゞ自動車）、mikuni（ミクニ）、aichi-electric（愛知電機）、kanadevia（カナデビア）、naikai-zosen（内海造船）、kawasaki-heavy-industries（川崎重工業）、kaneka（カネカ）、ichinen-holdings（イチネンホールディングス）: いずれも特定投資株式の保有目的が全銘柄共通の定型文（コーティング関連事業等における取引関係の維持・強化のため等）のみで、個別の提携・契約の印字がないため結ばなかった（koa の先例）。一部は当期中に売却され保有がなくなっている。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱UFJフィナンシャル・グループ）: 特定投資株式の保有目的は金融取引の強化であり、資金調達・決済の関係のため結ばなかった。
- relatedCompanies: hikari-tsushin（光通信）: 大株主の状況に載る光通信KK投資事業有限責任組合は投資組合であり、純投資のため結ばなかった。
- relatedCompanies: land（ランド）、ic（IC）、port（ポート）、career（キャリア）、en（エン）、seki（セキ）、base-4481（ベース）、core（コア）、ray（レイ）、semba（船場）、vision（ビジョン）、the-lead（リード）、zero（ゼロ）、innovation（イノベーション）、corona（コロナ）: いずれも本文中の一般語・部分一致であり、その相手についての取引・提携・資本関係の記述がないため結ばなかった。
- terms: 助言: 用語「ホールIC」は、磁界の変化や強さを検出して被計測体の位置や回転等を検知する磁気センサー。車載向けでは変速制御やブレーキ制御、ステアリング制御、エンジン制御などに使われ、同社のエレクトロニクス関連事業の主力商品である。
- terms: 助言: 用語「塗膜形成力」は、塗料の選定から塗装仕様、塗装工法、塗装環境までを含めて塗膜を形成する力。同社は自動車業界で培ったこの力をコーティング関連事業の機能の核と位置付けている。
- terms: 助言: 用語「リブレット」は、微細な溝形状を表面に付ける加工。同社は航空機の機体外板の塗膜上にリブレット形状を施工し、燃費改善によるCO2排出量の削減を目指す共同開発と飛行実証実験を進めている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
