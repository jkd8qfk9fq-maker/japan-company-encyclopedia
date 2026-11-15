# 御園座 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社御園座 |
| 証券コード | 9664 |
| docID（データを取り出した文書） | `S100YG20` |
| 原本 docID | `S100YG20` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG20.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社御園座 / 9664 / docID S100YG20（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
misonoza-theatrical: 10 件の数値を有報XBRLと照合
有報: 株式会社御園座 有価証券報告書－第136期(2025/04/01－2026/03/31) (docID S100YG20)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
misonoza-theatrical: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記（潜在株式がないための表示事項、配当を実施していないための配当性向の不記載、株価の市場区分に関する注記など）は表示事項のみであり、financialNotes には記録しなかった。会計方針の変更や決算期変更もなく、financialNotes は空である。
- businessModel: 第136期の配当の見送りは資本政策の事項のため warnings に留めた（配当政策に、安定的な配当の継続を基本方針としつつ、企業体質の強化と内部留保の充実のため第136期の配当を見送った旨が記載されている）。
- businessModel: 目標とする経営指標（公演ごとの収支等）は利益指標を含むため、数値目標としては本文・戦略に書いていない。令和9年3月期の公演予定（約30種類・約260回）は有報の課題の記載に基づく公演計画であり、戦略の開示として記載した。
- businessModel: MD&Aに記載された利益項目の金額や増減の理由は本文に書いていない（flowのprofit段には当期純利益の金額の事実だけを記載）。
- businessModel: 従業員数は就業人員6人であり、外数として記載された平均臨時雇用者数8人は本文に書いていない。
- businessStructure: 当社は劇場事業の単一セグメントであり、セグメント別の売上高の記載はない。販売実績は「劇場」区分のみで3,217,352千円（売上高3,217百万円と一致）。
- businessStructure: 主要な設備は本社ビル（名古屋市中区）の劇場のみで、従業員数は6人（2026年3月31日現在）。
- businessStructure: suppliers: 公演の出演者・制作関係者など個別の仕入先・委託先の名称は有報に印字されていないため、suppliersキーは旧スキーマに従い省略し、特記すべき仕入先の事実もない。
- history: 沿革から落とした項目: 1935年の劇場改装工事完成、1980年のみその事業株式会社設立とその後の観光事業・リース業・宅地取引業への展開、1986年のミソノピア株式会社設立と有料老人ホーム竣工、2000年の観光事業からの撤退、2014年のみその事業株式会社の清算決議と清算結了。これらはいずれも現在は撤退済みの周辺事業に関するものである。資本金の金額は規則により記載していない。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 劇場事業（歌舞伎・ミュージカル・演劇・歌謡ショーの興行）は entertainment に直接適合するため、主たる業界を entertainment とし、暫定分類は付けなかった。taxonomyGaps はない。
- relatedCompanies: 株式会社大丸松坂屋百貨店は筆頭株主（4.01％、2026年3月31日現在）だが、候補一覧に無く、同社自体は上場会社ではないため結ばなかった。
- relatedCompanies: 株式会社宮崎、株式会社中日新聞社、株式会社三菱ＵＦＪ銀行、岡崎信用金庫、大日産業株式会社、有限会社ＭＭＳはいずれも大株主だが、候補一覧に無い、または金融機関・非上場会社のため結ばなかった。
- relatedCompanies: avex: 有報に現れるのはエイベックス・ライヴ・クリエイティヴ株式会社であり、エイベックス株式会社とは別の法人であるため結ばなかった。
- relatedCompanies: pia: 売掛金の相手先に現れるのはチケットぴあ名古屋株式会社であり、ぴあ株式会社とは別の法人であるため結ばなかった。チケット販売の委託関係は売掛金の内訳に現れる範囲にとどまる。
- relatedCompanies: corona: 新型コロナウイルス感染症の文脈の部分一致であり、株式会社コロナとの関係の記載はないため結ばなかった。
- relatedCompanies: en: 監査法人の名称などに現れる一般語の部分一致であり、エン株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: king: 情報セキュリティの文脈（ハッキング）に現れる部分一致であり、株式会社キングとの関係の記載はないため結ばなかった。
- relatedCompanies: nissin: コードリストにない候補（ambiguous）であり、結ばなかった。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループは特定投資株式として保有しているが、保有目的は「主要な取引銀行であり、良好な取引関係維持強化をはかる」という記載であり、候補一覧にも無いため結ばなかった。
- terms: 助言: 「御園座」は会社名であると同時に、同社が名古屋市中区栄で運営する劇場の名称でもある。1897年に近代的劇場として落成し、空襲や火災による焼失と復興を経て、2018年に現在の新劇場が開場した。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
