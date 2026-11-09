# 合同製鐵 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 合同製鐵株式会社 |
| 証券コード | 5410 |
| docID（データを取り出した文書） | `S100YCUF` |
| 原本 docID | `S100YCUF` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCUF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 合同製鐵株式会社 / 5410 / docID S100YCUF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
godo-steel: 10 件の数値を有報XBRLと照合
有報: 合同製鐵株式会社 有価証券報告書－第120期(2025/04/01－2026/03/31) (docID S100YCUF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
godo-steel: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 2022年改正会計基準（法人税、住民税及び事業税等に関する会計基準）を第119期の期首から適用しているが、修正再表示チェックは重複年度の全行で一致し、売上高・当期純利益の範囲に変更はないため financialNotes には書いていない。
- businessModel: 2025年6月30日付で合同デーバーエンジニアリング㈱を譲受し連結子会社化したことにより、鉄鋼事業において295百万円の負ののれん発生益を計上している。負ののれん発生益は文章規則で書けない利益区分のため本文には書かず、ここに記録する。
- businessModel: 姫路製造所の圧延機刷新（投資予定額12,800百万円、完了予定2028年度下期）は計画中の設備投資であり、本文には書いていない。
- businessModel: 重要な後発事象については、証拠パックの本文ファイルに該当の印字がなく確認できないため、本文には書いていない。
- businessModel: 中期ビジョン2030の数値目標のうち、経常利益160億円などの利益区分の目標は文章規則により本文に書かず、売上高の目標2,250億円だけを記載した。
- businessModel: Wikipedia の記事は確認したが、有報にない補足として使う事実がなかったため使っていない。
- businessStructure: 鉄鋼事業の子分類（線材・形鋼・棒鋼／棒鋼加工製品・線材加工製品／ねじ節鉄筋／機械・製鋼原料等の販売）は【事業の内容】の記載によるもので、金額の内訳は有報に印字されていないため金額なしとした。
- businessStructure: 農業資材事業の子分類（有機質肥料・化成肥料／種苗・乾牧草）も同様に金額なしとした。
- businessStructure: その他は、報告セグメントに含まれない事業セグメントとして有報の区分どおり最後に置いた。
- history: 沿革のうち1993年のジーエス興産株式会社の設立は、同社を2018年に合併しており現在の事業構成に直接つながらないため、15件に収める都合で落とした。
- history: 2025年の合同デーバーエンジニアリングの譲受は【沿革】ではなく【事業の内容】に印字されているため、locator を【事業の内容】とした。
- industry: 主たる業界は、鉄鋼事業（2026年3月期の外部顧客への売上高174,307百万円）が事業の中心であることから、閉じた分類に鉄鋼・素材を表す区分がないため、掲載済みの日本製鉄（nippon-steel）、JFEホールディングス、神戸製鋼所が素材のバケットとして chemicals を使っている先例に揃えて chemicals（暫定）とした。化学品の会社ではない。東証の業種は鉄鋼業である。
- industry: 農業資材事業（2026年3月期の外部顧客への売上高12,716百万円）は肥料の製造販売で chemicals の範囲に近く、2つ目の業界は付けていない。
- relatedCompanies: 日工（nikko-6306）：「日工」は朝日工業の社名の断片一致であり、同一性の根拠がないため結ばない。
- relatedCompanies: エン（en）：「エンジニアリング」などの語の断片一致のみのため結ばない。
- relatedCompanies: トーカイ（tokai, 9729）：有報の㈱トーカイは福岡県北九州市の連結子会社で、鉄筋用棒鋼の製造販売を行う会社であり、上場企業の株式会社トーカイとは別の会社のため結ばない。
- relatedCompanies: ベース（base-4481）：語の断片一致のみのため結ばない。
- relatedCompanies: 丸紅（marubeni）：伊藤忠丸紅住商テクノスチール㈱は主要な販売先だが、丸紅株式会社そのものとの取引の印字がないため結ばない。
- relatedCompanies: ブラス（brass）：「ブラスト」の語の断片一致のみのため結ばない。
- relatedCompanies: キャリア（career）：語の断片一致のみのため結ばない。
- relatedCompanies: フリー（freee）：語の断片一致のみのため結ばない。
- relatedCompanies: ランド（land）：語の断片一致のみのため結ばない。
- relatedCompanies: セキ（seki）：語の断片一致のみのため結ばない。
- relatedCompanies: ポート（port）：語の断片一致のみのため結ばない。
- relatedCompanies: スローガン（slogan）：語の断片一致のみのため結ばない。
- relatedCompanies: リード（the-lead）：語の断片一致のみのため結ばない。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ（mitsubishi-ufj-financial-group）：子会社からの資金の借入のみで、銀行ルールにより結ばない。
- relatedCompanies: みずほフィナンシャルグループ（mizuho-financial-group）：子会社からの資金の借入のみで、銀行ルールにより結ばない。
- relatedCompanies: りそなホールディングス（resona-holdings）：子会社からの資金の借入のみで、銀行ルールにより結ばない。
- relatedCompanies: 池田泉州ホールディングス（senshu-ikeda-holdings）：子会社からの資金の借入のみで、銀行ルールにより結ばない。
- relatedCompanies: 三井住友トラストグループ（sumitomo-mitsui-trust-group）：子会社からの資金の借入のみで、銀行ルールにより結ばない。
- relatedCompanies: 三十三フィナンシャルグループ（san-ju-san-financial-group）：子会社からの資金の借入のみで、銀行ルールにより結ばない。
- relatedCompanies: 伊藤忠丸紅住商テクノスチール㈱は2026年3月期の主要な販売先（売上高20,430百万円、連結売上高の10.7％）だが、掲載企業リストにないため結べない。
- relatedCompanies: 中山鋼業㈱は持分法適用関連会社（議決権45.0％）だが、非上場のため結べない。
- relatedCompanies: 朝日工業㈱・合鐵産業㈱・三星金属工業㈱・㈱トーカイなどの連結子会社はすべて非上場のため結べない。
- relatedCompanies: 大株主の日本マスタートラスト信託銀行㈱（信託口）・㈱日本カストディ銀行（信託口）は信託口のため結ばない。
- terms: 助言: 「ねじ節鉄筋」は用語集の登録候補になります。鉄筋用棒鋼の一種で、表面にねじ状の節を持つ鉄筋です。同社の鉄鋼事業の製品の一つです。
- terms: 助言: 「条鋼」は用語集の登録候補になります。棒鋼・形鋼・線材など、断面が棒状の鋼材の総称です。同社の鉄鋼事業は多様な条鋼類の製造販売を行っています。
- terms: 助言: 「電炉」は用語集の登録候補になります。鉄スクラップを電気で溶かして鋼をつくる炉です。同社は電炉メーカーとして鉄鋼リサイクルシステムの一翼を担っています。
- terms: 助言: 「GODO Green」は用語集の登録候補になります。同社の非化石電力鋼材のブランドです（商標登録出願中）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 合同製鐵の主たる業界 → 提案: 鉄鋼・金属素材（steel-and-metals など）。有報の事業の中心は、線材・形鋼・棒鋼などの鉄鋼製品の製造・販売で、化学品の会社ではない。閉じた集合（INDUSTRY_IDS）に鉄鋼・素材を表す区分が無く、掲載済みの日本製鉄（nippon-steel）、JFEホールディングス、神戸製鋼所が素材のバケットとして chemicals を使っている先例に揃えて暫定にした。
