# テクノメディカ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社テクノメディカ |
| 証券コード | 6678 |
| docID（データを取り出した文書） | `S100YGSP` |
| 原本 docID | `S100YGSP` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGSP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社テクノメディカ / 6678 / docID S100YGSP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
techno-medica: 10 件の数値を有報XBRLと照合
有報: 株式会社テクノメディカ 有価証券報告書－第39期(2025/04/01－2026/03/31) (docID S100YGSP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
techno-medica: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の計画値のうち売上高だけを記載しました。利益や収益性に関する計画値は、本文に書ける財務数値が売上高と当期純利益に限られるため記載していません。
- businessModel: 配当政策に記載された2026年3月期の配当（2026年6月25日の定時株主総会への付議予定）は、決算日後の資本政策の予定であるため本文には書かず、warnings に記録しました。
- businessModel: 重要な後発事象は該当事項なし、重要な契約等も該当事項なしです。needsReview はありません。
- businessModel: 非連結のため financialNotes は付けていません。単体の basis は draft-entry の印字どおりです。
- businessStructure: 単一セグメント（医療機器および消耗品の製造販売）のため、報告セグメントではなく【関連情報】の製品区分（採血管準備装置・システム、検体検査装置、消耗品等）を children とし、外部顧客への売上高の大きい順に並べました。
- businessStructure: 品目別の外部顧客への売上高の合計は11,236,605千円で、売上高の合計11,236,606千円と1千円差があります。有報の印字どおりに各区分の金額を記載しました。
- businessStructure: 子会社・関連会社はなく、連結財務諸表は作成していません（非連結）。
- businessStructure: 製造工程は社外の協力会社へ委託しています（サプライヤー名は特定の1社を事業の内容では印字していないため、suppliers はこのツリーの旧スキーマに従い省略し、委託の事実を事業の説明に記載しました）。主要株主の株式会社オートニクスへの製造委託等は関連当事者情報に印字されていますが、同社は related-candidates.json の候補にないため関連企業には結んでいません。
- history: 1987年の設立時の資本金額は、資本金額を沿革に書かない規則に従い記載していません。
- history: 2007年には市場第二部への上場とジャスダック上場廃止の2件が印字されているため、同年に2項目を立てました。
- industry: 主たる業界は electronics としました。医療機器とその消耗品の製造販売が単一セグメントで売上高の全額を占め、臨床検査用分析装置や医療機器という電子機器の開発・販売が中核であるため、閉じた分類の中で直接に合います。暫定分類ではないため taxonomyGaps は付けていません。
- industry: 自らは通信サービスや医薬品の製造販売を行っていないため、telecommunications や pharmaceuticals は付けていません。
- relatedCompanies: 株式会社オートニクスは、2026年3月31日現在の大株主（議決権の被所有割合14.50％）であり、関連当事者情報に製造委託等の製品購入、研究開発業務の委託、製品販売の取引が印字されている最も強い関係先ですが、related-candidates.json の候補にないため結びませんでした。
- relatedCompanies: suzuken（株式会社スズケン）: 売掛金の相手先別内訳に残高が印字されているのみで、販売取引の内容の記述がないため結びませんでした。
- relatedCompanies: sysmex（シスメックス株式会社）: 売掛金の相手先別内訳に残高が印字されているのみで、販売取引の内容の記述がないため結びませんでした。
- relatedCompanies: fujitsu（富士通株式会社）: 買掛金の相手先は富士通フロンテック株式会社であり、富士通株式会社とは別の法人であるため結びませんでした。親会社への読み替えはしていません。
- relatedCompanies: en（エン株式会社）: ambiguous で、一般語の部分一致の機械抽出であり、同社についての記述がないため結びませんでした。
- relatedCompanies: base-4481（ベース株式会社）: 自己資本比率の注記の「時価ベース」の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: career（株式会社キャリア）: キャリア研修などの一般語の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: ray（株式会社レイ）: ambiguous で、ディスプレイなどの一般語の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: vision（株式会社ビジョン）: 長期ビジョンという一般語の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: aeon（イオン株式会社）: イオン電極用標準血清という製品用語の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: ic（株式会社IC）: ambiguous で、ICタグの用語説明の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: land（株式会社ランド）: ブランドという一般語の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: lec（レック株式会社）: フレックスタイム制などの一般語の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: space（株式会社スペース）: 省スペース化などの一般語の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: the-lead（株式会社リード）: 業界をリードするという一般語の部分一致であり、同社についての記述がないため結びませんでした。
- relatedCompanies: trust（株式会社トラスト）: 大株主の状況の日本マスタートラスト信託銀行（信託口）の部分一致であり、候補自体もコードリストにないため結びませんでした。信託銀行の信託口は純投資のため結ばない対象でもあります。
- relatedCompanies: will（株式会社ウィル）: 電子記録債権の相手先はクロスウィルメディカル株式会社であり、株式会社ウィルとは別の法人であるため結びませんでした。
- relatedCompanies: 株式の保有状況は該当事項なしで、政策保有株式による結び付けの対象はありません。主要な顧客ごとの情報は、売上高の10％以上を占める相手先がないため記載なしと印字されています。
- terms: 助言のみ。用語の候補としては「採血管準備装置」「血液ガス分析装置」「電解質分析装置」「RFID検体情報統括管理システム」「POCT」「赤血球沈降速度」などが挙げられますが、本工程ではデータを持ちません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
