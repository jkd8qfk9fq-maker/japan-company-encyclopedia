# 博報堂DYホールディングス — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社博報堂ＤＹホールディングス |
| 証券コード | 2433 |
| docID（データを取り出した文書） | `S100YHXU` |
| 原本 docID | `S100YHXU` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHXU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社博報堂ＤＹホールディングス / 2433 / docID S100YHXU（id は英語表記「HAKUHODO DY HOLDINGS INCORPORATED」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hakuhodo-dy-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社博報堂ＤＹホールディングス 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YHXU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hakuhodo-dy-holdings: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社博報堂DYホールディングス」が EDINET の提出者名「株式会社博報堂ＤＹホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIで確認した：第23期、自2025年4月1日至2026年3月31日、Japan GAAP、連結決算あり。
- businessModel: 本文の収益は【関連情報】の印字（百万円）を使った。MD&Aの『売上高』1兆5,804億60百万円は従前基準の自主開示なので、減収の理由（ユナイテッドの連結除外、官公庁業務の反動減）は、その『売上高』について有報が述べた要因であり、収益の減少にも関わる要因として書いた。両者の関係は有報が個別に説明していないため、断定は避けた。
- businessModel: 営業利益・経常利益・のれん償却前利益などの中期経営目標は、本サイトの方針により書いていない。
- businessModel: 広告媒体の取り扱いで受け取る対価の形（手数料か売上総額かなど）は、証拠パックの範囲で確認できなかったため書いていない。
- businessModel: perspectives は strategy の disclosed だけを書いた。competitiveAdvantage と industryPosition は、業界順位やシェアを有報から確認できなかったため省いた。
- businessModel: 用語リンク・会社リンクは使っていない。
- businessStructure: 決算期は表紙のDEIで確認した：第23期、自2025年4月1日至2026年3月31日、Japan GAAP、連結決算あり。訂正報告書は証拠パックに見当たらない。
- businessStructure: 報告セグメントは連結全体で1つ（セグメント情報等）。このため並びは【関連情報】の製品及びサービスごとの外部顧客への収益（広告業858,427百万円、その他の事業2,575百万円）で決めた。合計は連結の収益861,003百万円と一致する。
- businessStructure: 中核会社（博報堂・大広・読売広告社・Hakuhodo DY ONE・kyu）ごとの収益は有報に印字がないため、事業としては分けず、広告業の説明に名前だけ書いた。
- businessStructure: 前期（2025年3月期）の中核会社には博報堂ＤＹメディアパートナーズが含まれていたが、当期はHakuhodo DY ONEに替わっている。2025年4月の吸収分割と合併は history に書いた。
- businessStructure: その他の事業の中身は有報が説明していないため、products は空にし、【関係会社の状況】で区分が『その他の事業』となっている子会社名だけを挙げた。
- businessStructure: MD&Aの『売上高』（1兆5,804億60百万円）は従前の会計基準による自主開示で、表の『収益』（861,003百万円）とは別の数値。本文の収益は【関連情報】の印字を使った。
- businessStructure: listings の market は表紙の『東京証券取引所プライム市場』から。Wikipedia は証拠パックに無いため使っていない。
- history: 沿革の表は年月と事象が対になって印字されており、崩れていない。10件すべてを使った。
- history: 2008年3月の本社移転（港区東新橋から赤坂）は、事業の理解に関わらないため省いた。
- history: 2025年12月のデジタルホールディングス取得は、提出日（2026-06-25）より前の出来事で、予定ではなく完了として書いた。
- industry: 広告業が収益の大半（858,427百万円／861,003百万円）を占め、広告媒体の取り扱いと広告制作が中心なので、最も近い media を primary にした。
- industry: 広告会社専用の区分は無いが、media に広告媒体を扱う会社が入る想定のため taxonomyGaps にはしなかった。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業の中から同一性を確認できる相手がいないため、結んだ相手は無い。
- relatedCompanies: 株式会社朝日新聞社（持株比率3.12％）と日本テレビ放送網株式会社（同2.40％）は、2026年3月31日現在の大株主に載る事業会社だが、候補ファイルに無く上場・掲載の確認ができないため結ばなかった。
- relatedCompanies: 公益財団法人博報堂教育財団（19.77％）、一般社団法人博政会、一般社団法人フラタニテは事業会社ではなく、信託銀行や社員持株会も対象外のため結ばなかった。
- relatedCompanies: 株式会社デジタルホールディングスは有報が子会社と印字するが、候補ファイルが無く掲載済みかどうか確認できないため結ばなかった。
- terms: 助言のみ。用語集への追加候補：持株会社、統合マーケティング、クロスセル。いずれも本文ではリンクを使っていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
