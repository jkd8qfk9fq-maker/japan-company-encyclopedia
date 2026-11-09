# オルガノ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | オルガノ株式会社 |
| 証券コード | 6368 |
| docID（データを取り出した文書） | `S100YK07` |
| 原本 docID | `S100YK07` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK07.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | オルガノ株式会社 / 6368 / docID S100YK07（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
organo: 10 件の数値を有報XBRLと照合
有報: オルガノ株式会社 有価証券報告書－第81期(2025/04/01－2026/03/31) (docID S100YK07)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
organo: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年5月13日開催の取締役会で決議された株式分割（2026年9月30日を基準日として普通株式1株を5株に分割、効力発生日2026年10月1日）は、資本政策の後発事象のため本文には書かず、ここに記録します。
- businessModel: 表示方法の変更（地域別売上高における米国の独立掲記、収益の分解の組替え）は売上高・当期純利益の範囲に変化がなく、修正再表示チェックで前期有報との重複年度は全行一致したため、financialNotesには書きません。
- businessModel: Taiwan Semiconductor Manufacturing Company, Ltd.は2026年3月期の売上高の25.2％を占める主要顧客ですが、掲載企業でないため関連企業には結んでいません。
- businessStructure: プラント事業、ソリューション事業、水処理薬品事業、標準型機器・機能材事業、食品事業の売上高は、有報に独立して開示されていないため金額を書いていません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。
- history: 2000年4月の欄には3件の事象（東北オルガノ商事株式会社と中部オルガノ商事株式会社の設立、いわき工場開設）が並び、年月が1つしか印字されていないため、年月と事象の対応づけができず3件とも採用しませんでした。
- history: 1959年の日本デグラモン株式会社の設立、2005年7月の台湾法人設立、2010年のベトナム法人設立は、15件の沿革に含めませんでした。
- industry: 主たる業界は、売上高の大半を占める水処理エンジニアリング事業（純水・超純水製造設備などの製造販売）から機械としました。東証の業種分類も機械です。
- industry: 機能商品事業に水処理薬品事業があるため、化学を2つ目に付けました。
- industry: 先端半導体市場を主力市場とし、半導体製造に用いる電子材料の高度分離・精製向け機能材も手がけるため、半導体を付けました。
- relatedCompanies: 東亞合成：機能商品事業の仕入先として株式を保有していたが、当事業年度に売却済みのため結ばない。
- relatedCompanies: みずほフィナンシャルグループ：主要取引銀行との資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ：主要取引銀行との資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: 三井住友トラストグループ：証券代行業務や資金調達等金融取引が保有目的のため結ばない。
- relatedCompanies: SOMPOホールディングス：プラント事業の組立保険など保険取引が保有目的のため結ばない。
- relatedCompanies: ノーリツ：株式交付で取得した株式を売却することとしたため結ばない。
- relatedCompanies: エン、キャリア、ベース、イノベーション、セキ、イオン、ハブ、キング、ポート、ランド、ビジョン、コア、ゼロ、レック、パス、リックス、リード：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 東北電機鉄工、PTラウタン・オルガノ・ウォーター：持分法適用関連会社だが非上場のため結ばない。
- relatedCompanies: 連結子会社11社：すべて非上場のため結ばない。
- relatedCompanies: 大株主のその他の相手は信託銀行・外国金融機関のため、事業会社の大株主として結ばない。
- terms: 新たに提案する用語はありません。純水・超純水製造設備、水処理薬品などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
