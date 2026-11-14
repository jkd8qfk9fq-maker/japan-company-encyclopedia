# 日本トランスシティ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本トランスシティ株式会社 |
| 証券コード | 9310 |
| docID（データを取り出した文書） | `S100YGL7` |
| 原本 docID | `S100YGL7` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGL7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本トランスシティ株式会社 / 9310 / docID S100YGL7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
japan-transcity: 10 件の数値を有報XBRLと照合
有報: 日本トランスシティ株式会社 有価証券報告書－第112期(2025/04/01－2026/03/31) (docID S100YGL7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
japan-transcity: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象は、2026年5月29日の取締役会で決議した自己株式取得のみで、実施に向けた定例的な資本政策のため、ここに記録するにとどめた。
- businessModel: 修正再表示チェックは前期有報と全8行一致し、数値の修正再表示はないことを確認した。financialNotes のIAS第12号の適用は、【連結経営指標等】の注記に基づく。
- businessModel: 最大の顧客である住友電装株式会社は非上場で関連企業の候補に載っていないため関連企業としては結ばず、顧客としての役割を businessModel と perspectives に記載した。
- businessStructure: 当社グループは、当社と子会社45社、関連会社15社で構成されている（【事業の内容】）。
- businessStructure: 報告セグメントは「総合物流事業」の単一セグメントのため、その children は【セグメント情報】の【関連情報】にある製品及びサービスごとの区分（倉庫業／港湾運送業／陸上運送業／国際複合輸送業／その他）により、外部顧客への売上高の大きい順に並べた。5区分の合計123,442百万円は報告セグメントの外部顧客への売上高と一致する。
- businessStructure: 「その他の事業」は報告セグメントに含まれない区分として、総合物流事業の後に置いた。
- businessStructure: 拠点・設備と事業の対応は有報のセグメント欄どおりとし、複数区分が連記された設備の行は特定の事業に結びつけていない。
- history: 沿革の末尾（2014年4月から2021年2月分）は、年月セルが連続して印字され事象文と分かれている崩れた表だったが、年月8件と事象8件で数が一致したため行順で対応づけた（2014年4月のJSR物流への資本参加から2021年2月のベトナム保税倉庫の稼働まで）。
- history: 資本金の増資のみを内容とする行（1970年6月、1987年10月、1991年10月の2件、2005年4月、2005年9月、2006年12月）は、資本金の金額を本文に書かない規則のため収録しなかった。
- history: 1942年の設立の行に印字された資本金額は、規則のため記載していない。
- history: 1995年7月の創業100周年は、1945年に合併した旧四日市倉庫株式会社（1895年7月設立）からの年数による。
- industry: 「その他の事業」（2026年3月期の外部顧客への売上高2,075百万円）は、不動産業・建設業・損害保険代理店業・自動車整備業・ゴルフ場経営など複合的で割合も小さいため、業界を足していない。
- relatedCompanies: 住友電装株式会社: 【セグメント情報】の主要な顧客（2026年3月期の売上高15,983百万円、全体の12.7％）で、2022年4月にはSTコネクトロジスティクス株式会社の共同設立相手でもあるが、非上場で related-candidates.json に載っていないため結ばなかった。役割は businessModel と perspectives に記載した。
- relatedCompanies: イオン株式会社: 特定投資株式の保有目的に総合物流事業における主要顧客とあるが、related-candidates.json に載っていないため結ばなかった（候補のイオンフィナンシャルサービスは別法人で、金融機関のため結ばなかった）。
- relatedCompanies: mitsui-chemicals・ngk・meiko-trans・maruzen-showa-unyu・mitsubishi-chemical-group・marubeni・tokuyama・toyobo・katakura-industries・takara-holdings・ezaki-glico・mitsubishi-gas-chemical・chubu-electric-power・rasa・kikukawa-enterprise・yamazen: 特定投資株式の保有目的が「総合物流事業における主要な顧客であり、取引関係の維持・強化のため」という全銘柄共通の定型句のみで、個別の取引内容の印字がないため結ばなかった。
- relatedCompanies: isewan-terminal-service・okayamaken-freight-transportation・toyo-logistics: 特定投資株式の保有目的が「協業関係にある」という定型句のみのため結ばなかった。なお、沿革に共同設立の相手として載る伊勢湾倉庫株式会社が候補の伊勢湾海運株式会社と同一かどうかは、有報本文からは確認できなかった。
- relatedCompanies: mitsubishi-ufj-financial-group・san-ju-san-financial-group: 特定投資株式の保有目的が資金借入先という金融取引のみのため結ばなかった。大株主の株式会社三十三銀行は三十三フィナンシャルグループの子会社で、候補とは別法人である。
- relatedCompanies: toho-gas・kawasaki-kisen-kaisha・mitsui-o-s-k-lines・imuraya-group・dai-nippon-printing・howa-machinery・kaneka・ishihara-sangyo-kaisha・mitsubishi-corporation・mitsui-and-co・mizuno・nomura-holdings・okasan-securities-group・orix・sumitomo-mitsui-trust-group・zeon・mizuho-financial-group・aichi-financial-group: 退職給付信託のみなし保有株式の文脈のみのため結ばなかった。
- relatedCompanies: mitsui-fudosan: 関東地区の施設に関するオペレーティングリース契約の相手で、事業上の取引・提携を述べる印字がないため結ばなかった。
- relatedCompanies: ray・seki・zero・daiwa・yamazen（ambiguous）: いずれも ambiguous の候補で、出現は一般語や地名の部分一致のため結ばなかった。
- relatedCompanies: base-4481・port・career・space・land・aska・path・will・slogan: 一般語や連結子会社名、地名の部分一致で、同社について取引・提携・資本関係を述べる記載はないため結ばなかった。
- relatedCompanies: 【大株主の状況】に載る日本マスタートラスト信託銀行・日本カストディ銀行・三菱UFJ信託銀行は信託・資産管理の純投資、明治安田生命保険・株式会社三菱UFJ銀行・株式会社三十三銀行は金融機関、社員持株会と蒼栄会は事業会社でないため結ばなかった。
- terms: 助言: 用語「倉荷証券」（倉庫業者が寄託を受けた物品について発行する証券で、物品の引渡し請求や担保金融に使われるもの）は、この会社の倉庫業の中核を示す語として用語集への追加候補と考える。当社は倉庫営業の許可に加え、倉荷証券発行の許可も受けている。
- terms: 助言: 用語「スルーB/L」（国際複合輸送で、荷送人の指定場所から荷受人の指定場所まで一貫した運送責任を持つことを示す船荷証券）は、この会社の国際複合輸送業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
