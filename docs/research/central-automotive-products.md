# 中央自動車工業 — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 中央自動車工業株式会社 |
| 証券コード | 8117 |
| docID（データを取り出した文書） | `S100YFX5` |
| 原本 docID | `S100YFX5` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFX5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 中央自動車工業株式会社 / 8117 / docID S100YFX5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
central-automotive-products: 10 件の数値を有報XBRLと照合
有報: 中央自動車工業株式会社 有価証券報告書－第87期(2025/04/01－2026/03/31) (docID S100YFX5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第86期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
central-automotive-products: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と当期純利益だけに絞りました。金額はMD&Aに印字された466億92百万円、359億14百万円、107億78百万円、96億45百万円をそのまま用い、千円表からの換算や切り捨てはしていません。
- businessModel: 修正再表示チェックは前期有報と全項目で一致し、差異はありませんでした。前期の窓にある訂正有価証券報告書－第86期についても、5年表の数値に修正再表示の差異は確認されなかったため、financialNotesは空としました。決算期変更・変則決算もありません。
- businessModel: 株式分割（2025年4月1日付、普通株式1株につき3株）は期中の実施済み事項のため needsReview に記録しました。財務数値そのものの変更ではないため financialNotes には入れていません。
- businessModel: 森田産業株式会社の株式取得に伴う負ののれんの計上はセグメント注記に印字されていますが、本文の金額を売上高と当期純利益に限るため本文には書かず、沿革と事業構造の子会社化の事実だけを記録しました。
- businessModel: 重要な後発事象は連結・個別とも該当事項はありません。2026年6月24日開催予定の定時株主総会への期末配当の付議は、配当に関する予定事項として本文には書いていません。
- businessModel: この作業ツリーのスキーマには suppliers キーが無いため、businessModel に仕入先の専用キーは書いていません。仕入の事実はセントラル自動車工業株式会社など連結子会社との関係として事業の内容・関係会社の状況に印字された範囲で、businessStructure側に記録しました。
- businessModel: 中期経営計画の目標数値や経営指標の目標（比率・配当に関する目標を含む）は将来の目標や投資に関する語を含むため、perspectivesの本文には書いていません。
- businessStructure: 報告セグメントは自動車部品・用品等販売事業と自動車処分事業の2つで、並び順はセグメント注記の外部顧客への売上高の大きい順です。金額はMD&Aに億単位で印字された359億14百万円と107億78百万円をそのまま用いました。
- businessStructure: 当社グループは当社、子会社14社及び関連会社3社で構成されると事業の内容に印字されています。関係会社の状況には連結子会社7社と持分法適用関連会社2社が表で印字され、その他の子会社・関連会社は事業の内容に名称と役割が印字されています。
- businessStructure: 主要な設備は本社、中之島R&Dセンター、東京支社などの各支社が自動車部品・用品等販売事業に属し、セントラル自動車工業の本社工場も同事業に属すると印字されています。設備の金額は本文に書けないため記載していません。
- history: 沿革のうち、拠点開設や清算など全行は載せず、発足・上場・海外子会社設立と近年の完全子会社化を中心に選びました。子会社化の金額や資本金の金額は本文に書けないため記載していません。
- history: 登記上の設立日は旧大洋工業株式会社の設立日である1943年1月7日ですが、実質上の発足は1946年5月10日と印字されているため、1946年を起点としました。
- history: 森田産業株式会社の完全子会社化は2025年8月、株式会社ＹＯＯコーポレーションの完全子会社化は2026年1月で、いずれも当期中の完了事項として沿革に記録しました。
- industry: 主たる業界は、外部顧客への売上高の大半を占める自動車部品・用品等販売事業と自動車処分事業がいずれも自動車分野のため automotive としました。業界は1つです。
- relatedCompanies: uss（株式会社ユー・エス・エス）: セグメント情報の関連情報と経営成績の分析に、自動車処分事業の主要な顧客として相手固有に印字されているため customer として結びました。説明には金額を書いていません。
- relatedCompanies: nissan-tokyo-sales-holdings、tpr、tsubakimoto-chain: 大株主の状況に事業会社として印字され、発行済株式（自己株式を除く）に対する割合がそれぞれ5.72％、3.58％、2.70％（2026年3月31日現在）のため major-shareholder として結びました。特定投資株式としての保有目的は全銘柄共通の定型文のため、それだけでは結んでいません。
- relatedCompanies: mitsubishi-corporation（三菱商事）: 沿革に2019年12月に同社より株式会社ＡＢＴの全株を買収した過去1回の取引が印字されるだけのため結びませんでした。
- relatedCompanies: hi-lex、t-and-d-holdings、ms-and-ad-insurance-group-holdings、senko-group-holdings、mitsubishi-ufj-financial-group、mizuho-financial-group: 特定投資株式として印字されますが、保有目的は保険・金融・物流等の取引関係の円滑化や維持強化という共通の定型文だけで、相手固有の取引・提携の印字がなく、金融機関・保険会社は資金調達・保険取引を理由とする場合は結ばないため結びませんでした。TONE株式会社は候補リストにありません。
- relatedCompanies: hikari-tsushin: 大株主に印字されるのは光通信ＫＫ投資事業有限責任組合であり、株式会社光通信本体ではないため結びませんでした。
- relatedCompanies: en、career、ishin、land、path、base-4481、slogan、step、corona、will、takashima-and-co: 一般語や自社子会社名（ケー・エム・エンタープライズ等）との部分一致・曖昧な一致で、相手企業について取引・提携・資本関係を述べる印字がないため結びませんでした。
- terms: 用語候補: 全損認定車両（損害保険会社が全損と認定した車両）、アルコール検知器（飲酒運転防止のために呼気中のアルコールを測る機器）、中之島R&Dセンター（同社の研究開発拠点）——いずれも本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

- businessModel: 2025年4月1日付で普通株式1株につき3株の割合で株式分割を行いました。株式数に関する指標は2022年3月期の期首に当該分割が行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
