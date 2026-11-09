# ＧＳＩクレオス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＧＳＩクレオス |
| 証券コード | 8101 |
| docID（データを取り出した文書） | `S100YGXI` |
| 原本 docID | `S100YGXI` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGXI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＧＳＩクレオス / 8101 / docID S100YGXI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gsi-creos: 10 件の数値を有報XBRLと照合
有報: 株式会社ＧＳＩクレオス 有価証券報告書－第96期(2025/04/01－2026/03/31) (docID S100YGXI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
gsi-creos: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社GSIクレオス」が EDINET の提出者名「株式会社ＧＳＩクレオス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の重点施策に印字されるPBR・ROEの目標は投資の語のため書いていない。
- businessModel: 主要な顧客の売上高は【関連情報】に印字されている（Toray Industries (HK) Ltd. 49,396百万円、Pacific Textiles Limited 28,782百万円）が、本文には書いていない。
- businessModel: PHD社との合弁会社設立等に関する契約（2026年5月1日から、日本製OPVの共同開発・製造・販売、出資比率は予定）は【重要な契約等】に印字されるが、相手方は海外の非上場会社のため関連企業には結ばず、本文にも書いていない。
- businessModel: 2026年4月1日付の株式分割（ビジネスブレイン太田昭和、青山商事、いずれも1株を3株とする）は1株当たり数値のみのため注記していない。
- businessModel: Wikipediaの記事は確認したが、有報にない補足として使う事実がなく、拠点数の記載は有報（国内9拠点、海外27拠点）と異なるため使っていない。
- businessStructure: 事業の金額は【セグメント情報】の外部顧客への売上高（2026年3月期）を使った。セグメント利益は金額を書かない規則のため記載していない。
- businessStructure: 事業の並び順は外部顧客への売上高の大きい順で、children には金額が独立して開示されていないため金額を書いていない。
- history: 沿革は15件に絞り、支店の開設・閉鎖や設備の移転など事業の構成に直接つながらない行は省いた。
- history: 2022年4月の行は桜物産の株式取得とプライム市場への移行の2件が並んでいるが、桜物産の取得は15件の枠に入れていない。
- history: 設立時の資本金は金額を書かない規則のため記載していない。
- industry: 主たる業界は商社とした。ファイバー事業が売上高の最大の区分だが、繊維の取引が中核の商社であり、閉じた分類に繊維を表す区分はないため、事業の形態である商社を主たる業界とした。
- industry: セミコンダクター事業は報告セグメントとして開示されているため、2つ目の業界に付けた。ケミカル事業も報告セグメントだが、化学品の取引であり化学の製造業を表すものではないため、業界は付けていない。
- relatedCompanies: gunze・toray・komatsu-matere は大株主でもあるが、【株式の保有状況】の保有目的に取引の向きが印字されているため、取引の種類を優先した。販売と仕入の両方が印字される相手は、印字の順（販売が先）に従い customer とし、仕入側も説明に記載した。
- relatedCompanies: gsi・creo — 社名の断片一致のみ（GSIマルロンテックス、GSIクレオス自体の社名）。結ばない。
- relatedCompanies: land・career・path・base-4481・port・step・en・seki・vision・king・trust — 語の断片一致のみ。結ばない。
- relatedCompanies: fuji-8278 — 有報の「フジシロ」は上場の株式会社フジとは別の会社のため結ばない。
- relatedCompanies: cci-group・mizuho-financial-group・mitsubishi-ufj-financial-group・sumitomo-mitsui-financial-group — 取引金融機関のみのため結ばない（銀行ルール）。
- relatedCompanies: okura-industrial — 保有目的は「当社工業製品事業における重要な仕入先」だが、保有株式数が1,000株と小さいため結ばない。
- relatedCompanies: sumitomo-realty-and-development — 本社ビルの賃貸人として【主要な設備の状況】に印字されるが、取引先としての関係の記載はなく、賃貸借のみのため結ばない。
- relatedCompanies: Toray Industries (HK) Ltd.・Pacific Textiles Limited — 主要な顧客だが海外法人で掲載企業リストにないため結ばない。
- relatedCompanies: 連結子会社26社と持分法適用関連会社2社はすべて非上場または海外法人のため結ばない。
- relatedCompanies: PHD社（ブラジル）は【重要な契約等】の合弁相手だが、海外の非上場会社のため結ばない。
- relatedCompanies: 大株主の日本生命保険相互会社・株式会社みずほ銀行は金融機関のため結ばない。日本マスタートラスト信託銀行・日本カストディ銀行は信託口のため結ばない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
