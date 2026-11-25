# レイヤード — research log

Registered: 2026-11-19（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社レイヤード |
| 証券コード | 634A |
| docID（データを取り出した文書） | `S100Z4Z3` |
| 原本 docID | `S100Z4Z3` |
| 提出日（原本） | 2026-09-29 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z4Z3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社レイヤード / 634A / docID S100Z4Z3（id は英語表記「LAYERED Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
layered: 10 件の数値を有報XBRLと照合
有報: 株式会社レイヤード 有価証券報告書－第28期(2025/07/01－2026/06/30) (docID S100Z4Z3)
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
layered: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: このツリーのスキーマでは businessModel.suppliers は書かない。調達に関する印字は有報に具体的な記載がなく、代理店販売の提供元（株式会社pipon、SB C&S株式会社）は products に記載した。
- businessModel: 財務諸表の組替えは、損益計算書の表示方法の変更（クレジット手数料収入の独立掲記と支払保証料の表示統合）に伴う前事業年度分の組替えであり、売上高と当期純利益への影響はないため、financialNotes には記録せず warnings のみとした。
- businessStructure: 単一セグメント（医療DX事業）のため、【関連情報】の製品及びサービスごとの情報に印字された3つのサービス区分を children とした。並び順は外部顧客への売上高の大きい順。
- businessStructure: 他社プロダクトの代理店販売（株式会社piponの『VoiceChart』、SB C&S株式会社の『Pay CAS POS for clinic』）は businessModel の products に記載した。
- history: 沿革表は年月と事象が1つの表として印字されており、年月・事象の対応は印字どおりに採用した。
- history: 2024年7月の株式会社メディパルホールディングスとの業務提携と、2024年8月の株式会社日本経営が提供する『Wevery!』との業務提携は、関連企業の判断材料として relatedCompanies 工程に委ね、沿革には一般的な出来事としてのみ現れる提携先のうちメディカル・データ・ビジョンの資本業務提携を採用した。
- industry: 主たる業界はitとした。医療機関向けSaaSの月額利用料と導入支援が売上高の大部分を占める。広告事業（医療機関向けデジタルサイネージ等を媒体とする広告）は外部顧客への売上高が独立して開示されているため、mediaを副次分類に付けた。
- relatedCompanies: メディカル・データ・ビジョン（medical-data-vision）は、2022年12月に資本業務提携を結んだことが沿革に印字されているが、現行のEDINETコードリストでは上場区分が「非上場」（証券コードなし）のためリンクしなかった。
- relatedCompanies: 株式会社日本経営は、2024年8月に同社が提供するホームページ作成『Wevery!』との業務提携が沿革に印字されているが、関連候補リストにないためリンクしなかった。
- relatedCompanies: クロスログ株式会社は当社の関連会社（議決権の所有割合30.0％、持分法非適用）だが、未上場で関連候補リストにもないためリンクしなかった。
- relatedCompanies: メドレー（medley）は未払金の相手先としてのみ印字されており、取引・提携の内容の記載がないためリンクしなかった。
- relatedCompanies: 野村総合研究所（nomura-research-institute）は市場データの出典元として引用されているだけで、取引・提携・資本関係の印字がないためリンクしなかった。
- relatedCompanies: その他の候補は社名の部分一致のみで、正式名称の印字も関係の記載もないためリンクしなかった：seki（セキュリティ）、port（サポート）、land（ブランド）、ray（レイヤードの表紙表記）、en、corona（コロナ禍）、base-4481（患者データベース）、cover（カバー）、nissin、caster（メディキャスター）、core、hub（Wehub）、king。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は【事業の内容】の注記に定義が印字されたものから選んだ。

## 要確認（status に反映）

- businessStructure: 2026年4月30日付で、普通株式1株につき20株の割合で株式分割を行っています。主要な経営指標等の推移の注記に記載のとおり、一部の指標は当該株式分割が第26期の期首に行われたと仮定して算出されています。
- businessStructure: 当社株式は、決算日（2026年6月30日）時点では非上場でしたが、2026年9月25日付で東京証券取引所スタンダード市場に上場しました。上場にあたり、公募による新株式の発行（2026年9月24日払込完了）及びオーバーアロットメントによる売出しに関連する第三者割当による新株式の発行が行われています。本登録は、2026年6月30日現在の資本構成と事業構造に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
