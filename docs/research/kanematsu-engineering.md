# 兼松エンジニアリング — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 兼松エンジニアリング株式会社 |
| 証券コード | 6402 |
| docID（データを取り出した文書） | `S100YD22` |
| 原本 docID | `S100YD22` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD22.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 兼松エンジニアリング株式会社 / 6402 / docID S100YD22（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kanematsu-engineering: 10 件の数値を有報XBRLと照合
有報: 兼松エンジニアリング株式会社 有価証券報告書－第55期(2025/04/01－2026/03/31) (docID S100YD22)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
kanematsu-engineering: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記（連結財務諸表を作成していないこと、関連会社がないため持分法の投資利益を記載していないこと、潜在株式が存在しないこと、配当額の内訳、最高・最低株価の市場）は表示・計算方法や配当の内訳の事項のため、financialNotes には入れなかった。会計基準の変更・決算期変更・株式分割の注記は無い。
- businessModel: 第55期の期末配当（1株当たり74円）は2026年6月19日開催予定の定時株主総会の決議事項であり、提出後の資本政策の事項のため warnings のみとした（needsReview には入れていない）。
- businessModel: MD&Aの売上総利益・営業利益・経常利益の金額や増減は本文に書いていない（書けるのは売上高と当期純利益だけのため）。受注高・受注残高の金額も書いていない。
- businessModel: 目標とする経営指標（売上高経常利益率・自己資本当期純利益率・配当性向の数値目標）は投資・利益指標の目標のため、本文にも perspectives にも書いていない。
- businessModel: 重要な後発事象は「該当事項はありません」。提出後の構造的な出来事は無い。
- businessModel: Wikipedia は記事が見つかったが、抜粋は本社の所在地と事業の概要（有報に記載済み）を述べるにとどまるため使っていない。出典も追加していない。
- businessStructure: 単一事業（環境整備機器関連事業並びにこれらの付帯業務）のため、子区分は【関連情報】の製品及びサービスごとの情報に印字された外部顧客への売上高（強力吸引作業車9,570,025千円、高圧洗浄車1,890,830千円、部品売上1,241,862千円、その他1,112,319千円、粉粒体吸引・圧送車282,900千円）を千円から百万円に切り捨てて、大きい順に並べた。切り捨て後の合計14,095百万円と印字の売上高合計14,097百万円の差2百万円は切り捨てによるもので、印字の合計をそのまま使った。
- businessStructure: 設備と事業の対応は単一事業のため事業所単位では結びつけていない（本社工場・テクノベースなどが生産設備）。帳簿価額は書いていない。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。部品製作の外注委託や、高圧洗浄車の組立・塗装の特定外注先への委託の事実は、事業の説明と本 warnings に書いた。
- history: 沿革のうち、営業所・出張所の開設・移転・改称、本社移転（1974年・1977年分）、工場・ヤードの取得、受賞歴、関係会社の完全子会社化（1997年）とその吸収合併（2002年）、創立50周年（2021年）、新人事制度の開始（2024年）などの行は落とした。
- history: 年だけを使い、月は書いていない。資本金の金額は沿革に書いていない。
- industry: 主たる業界は machinery とした。単一事業の環境整備機器関連事業は、強力吸引作業車・高圧洗浄車などの特殊車両や汚泥脱水機といった機械の製造販売であり、閉じた分類の中で直接合う machinery を選んだ。暫定値ではないため taxonomyGaps は無い。
- relatedCompanies: kanematsu（兼松、8020）は結ばなかった。社名の一致だけで、当社との取引・提携・資本関係を述べる記載は本文に無い（ambiguous の候補でもある）。
- relatedCompanies: isuzu-motors（いすゞ自動車、7202）は結ばなかった。売掛金などの相手先別内訳に金額とともに現れるだけで、その相手について取引の役割を述べる記載が無いため。
- relatedCompanies: obayashi（大林組、1802）は結ばなかった。電子記録債務の相手先別内訳に現れるだけで、取引の役割を述べる記載が無いため。
- relatedCompanies: mitsui-and-co（三井物産、8031）は結ばなかった。売掛金の相手先別内訳に現れるだけで、取引の役割を述べる記載が無いため。
- relatedCompanies: the-shikoku-bank（四国銀行、8387）は結ばなかった。特定投資株式の保有目的が「金融取引先として財務活動の円滑化」であり、大株主（2026年3月31日現在3.11％）でもあるが、金融機関との資金調達関係のため。
- relatedCompanies: tomony-holdings（トモニホールディングス、8600）は結ばなかった。特定投資株式の保有目的が四国銀行と同じく金融取引（財務活動の円滑化）のため。
- relatedCompanies: hino-motors-7205（日野自動車）は結ばなかった。候補の listing が「コードリストにない」であり、本文でも売掛金等の内訳の名称として現れるだけのため。
- relatedCompanies: base-4481、en、ray、slogan、vision、career、rent、step、applied-technology、core、cover、daiwa、innovation、itsumo、king、land は、本文中の一般語や部分一致（「テクノベース」「スローガン」「ビジョン」「キャリアステップ」「防音カバー」等）による機械抽出で、当該会社についての取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: 主要な顧客ごとの情報は「売上高の10％以上を占める相手先がないため記載なし」と印字されており、個別の顧客企業は結んでいない。中国の重慶耐徳山花特種車有限責任公司とは技術移転契約があるが、候補に無いため結ばず、沿革と重要な契約等の事実としてのみ扱った。
- terms: 助言のみ。用語としては「強力吸引作業車」「高圧洗浄車」「粉粒体吸引・圧送車」「汚泥脱水機・減容機」「個別受注生産」「KCSネットワーク」「マイクロ波抽出装置」などが候補だが、本工程ではデータを持たない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
