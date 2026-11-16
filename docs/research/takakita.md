# タカキタ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社タカキタ |
| 証券コード | 6325 |
| docID（データを取り出した文書） | `S100YFLC` |
| 原本 docID | `S100YFLC` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFLC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社タカキタ / 6325 / docID S100YFLC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takakita: 10 件の数値を有報XBRLと照合
有報: 株式会社タカキタ 有価証券報告書－第82期(2025/04/01－2026/03/31) (docID S100YFLC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第80期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
takakita: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記は、連結財務諸表を作成していない旨（注1）、株価の市場区分の出典（注2）、期末配当の株主総会決議事項（注3）の表示事項のみで、会計基準の変更・決算期変更・株式分割等の注記はないため financialNotes は付けていない。
- businessModel: 前期の窓にある訂正有価証券報告書－第80期について: 前期有報との修正再表示チェックで売上高・当期純利益・総資産・純資産・従業員数の全6系列が一致しており、当期有報の5年表の指標への影響はないため warnings のみとした。
- businessModel: 中期・長期計画の数値目標（2033年3月期目標等）と受注高は書いていない（投資指標・受注高の規則）。分析の文章には利益率を書いていない。
- businessModel: perspectives にはリンク記法を使っていない（このツリーの運用）。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。軸受事業ではベアリングメーカーから原材料の支給を受ける旨が【事業の内容】に印字されている（個別の仕入先名は印字されていない）。
- businessStructure: 【設備の状況】の本社・本社工場及び関西営業所はセグメント欄が「農業機械事業・軸受事業」の連記であり、複数区分が連記された行はどの事業にも結びつけない。その他の営業所・札幌工場は農業機械事業と印字されている。帳簿価額は書かない。
- businessStructure: 農業機械事業の子区分は【事業の内容】と分析の記載に基づく製品区分で、製品区分ごとの売上高は独立して開示されていないため金額を書いていない。販売実績の区分（製商品5,133百万円・部品998百万円・その他0百万円）は分析に印字されているが、セグメント注記の区分ではないため子区分の金額には使っていない。
- history: 1945年の設立行に印字された資本金の金額は書いていない（沿革に資本金を書かない規則）。
- history: 落とした行: 1967年札幌支社開設、1972年札幌支社・工場の新築移転、1986年タナシン電機株式会社との資本提携と電器音響部品の取扱開始、1988年御殿場事業所開設・株式会社サンソーの設立（撤退・吸収合併は2009年の行に集約した）。
- industry: 主たる業界は machinery とした。売上高の約94％を占める農業機械事業は農業用作業機の製造であり、軸受事業も大型軸受の加工で、いずれも閉じた分類の「機械」に直接合うため暫定値ではない。分類の不足はないので taxonomyGaps は付けない。
- relatedCompanies: kubota: 【関連情報】の主要な顧客ごとの情報に販売先として金額とともに印字され、【大株主の状況】にも載るため customer として結んだ。
- relatedCompanies: iseki-and-co / maruyama-mfg: 【大株主の状況】に載る事業会社であり、4区分（親会社・子会社・関連会社・その他の関係会社）に当たらないため major-shareholder として結んだ。
- relatedCompanies: jtekt: 【沿革】の1970年の業務提携のみが根拠で、現在の取引・提携の印字がない（過去の提携は結ばない）ため結ばない。
- relatedCompanies: the-nanto-bank: 【大株主の状況】に4.90％で載るが銀行（金融機関）であり、資金取引が理由のため結ばない。
- relatedCompanies: fujitsu: 投資有価証券の表に載るのみで、個別の取引・提携の印字がないため結ばない。
- relatedCompanies: amada / dmg-mori: 設備関係電子記録債務の相手先として残高表に載るのみで、取引関係の記述がないため結ばない。
- relatedCompanies: san-ju-san-financial-group / aichi-financial-group / sumitomo-mitsui-trust-group / sumitomo-rubber-industries: 特定投資株式等の保有表に載るのみで、個別の取引・提携の印字がないため結ばない。
- relatedCompanies: land / en / base-4481 / career / cota / vision / core / innovation / port / seki / slogan / step / suzuki-6785 / taya / the-lead / will: 一般語・部分一致のみで、相手についての取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: nissin: コードリストにないため結ばない。
- relatedCompanies: 候補にないため warnings のみ: ヤンマーアグリ株式会社（主要な販売先、2026年3月期の売上高の19.5％）、日本ニューホランド株式会社（同10.5％）、タナシン電機株式会社（大株主5.58％）、株式会社三十三銀行（大株主4.43％、銀行）、株式会社ヤハタ（大株主2.21％）、アグリテクノサーチ株式会社（大株主1.77％）。山東五征高北農牧機械有限公司は当社の関連会社（議決権35％）であり、自社の関係会社は結ばない規則のため対象外。
- terms: 助言のみ。用語の追加提案：作業機（トラクタ等に取り付けて使う農業機械）、飼料収穫機（牧草や飼料作物を収穫する作業機）、軸受（ベアリング。回転部分を支える部品）、外輪・内輪・転子（ベアリングを構成する部品で、有報の【事業の内容】に説明がある）。本文中の事業説明に基づく。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
