# トレンドマイクロ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | トレンドマイクロ株式会社 |
| 証券コード | 4704 |
| docID（データを取り出した文書） | `S100XUHN` |
| 原本 docID | `S100XUHN` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUHN.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | トレンドマイクロ株式会社 / 4704 / docID S100XUHN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
trend-micro: 10 件の数値を有報XBRLと照合
有報: トレンドマイクロ株式会社 有価証券報告書－第37期(2025/01/01－2025/12/31) (docID S100XUHN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
trend-micro: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…の提供にかかる費用を差し引いた残りが利益になります。2025年12月期のは3…）

## エージェントの判断記録（fragment warnings）

- businessModel: 会計基準は一貫して日本基準で、IFRSへの移行はない。financialNotesには経営指標の注記にある収益認識基準の適用（第34期期首から）のみを記録した。
- businessModel: 重要な後発事象は2026年2月18日の取締役会による自己株式取得の決議のみで、資本政策に関する事項のため本文には書かず、needsReviewにも入れていない。
- businessModel: 目標とする経営指標には営業利益率の目標も含まれるが、本文の財務数値は売上高と当期純利益だけとする規則に従い、perspectivesにも利益率の目標は書いていない。
- businessStructure: 報告セグメントは地域別（日本、アメリカズ、欧州、アジア・パシフィック）の4区分で、並び順は2025年12月期の外部顧客への売上高の大きい順（日本87,840、アジア・パシフィック71,516、欧州61,439、アメリカズ55,187百万円）とした。
- businessStructure: 製品及びサービスごとの情報は、単一の製品・サービス区分の外部顧客への売上高が連結売上高の90％超のため有報で記載が省略されており、事業は地域別のみで構成した。
- businessStructure: 各地域の外部顧客への売上高の合計は、有報の丸めにより連結売上高275,984百万円と2百万円異なるが、各区分の金額は印字どおり引用した。
- history: 沿革表は年月と事象が対応して印字されており、行順どおりに読み取った。
- history: 1996年のグループ親会社化は、沿革の注記（台湾法人の株主から同社および関係会社の株式を購入し、当社がグループの親会社となった）に基づき記述した。
- history: 2002年の「日経平均株価の算出銘柄に選定」は、投資指標にあたる語「株価」を含むため checker の規則により沿革に入れていない（有報の沿革には印字されている事実）。
- industry: 主たる事業はコンピュータセキュリティ対策製品の開発・販売であり、製品・サービスは単一区分（外部顧客への売上高が連結売上高の90％超）のため、業界は it のみとした。
- relatedCompanies: seki（セキ・7857）: ambiguous な一致で、有報の「セキュリティ」等の語の一部として現れるだけであり、セキ株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: land（ランド・8918）: 「アイルランド」の語の一部として現れるだけであり、株式会社ランドとの取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: port（ポート・7047）: 「サポート」等の語の一部として現れるだけであり、ポート株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: i-ll（アイル・3854）: 「アイルランド」の語の一部として現れるもので、株式会社アイルとは無関係であり、結ばなかった。
- relatedCompanies: base-4481（ベース・4481）: 「現地通貨ベース」等の語の一部として現れるだけであり、ベース株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: innovation（イノベーション・3970）: サステナビリティ等の本文中の一般語として現れるだけであり、株式会社イノベーションとの取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: trust（トラスト・3347）: 大株主の状況に現れる日本マスタートラスト信託銀行（信託口）は信託銀行の信託口であり、取引・提携の相手ではない。候補自体もコードリストにない区分のため結ばなかった。
- relatedCompanies: vision（ビジョン・9416）: 企業ビジョンの文言や製品名「Trend Vision One」の一部として現れるだけであり、株式会社ビジョンとの取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: ishin（イシン・143A）: 社名としての出現ではなく、イシン株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: king（キング・8118）: 「ネットワーキング」「メンタリング」等の語の一部として現れるだけであり、株式会社キングとの取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: core（コア・2359）: ambiguous な一致で、「コアバリュー」等の一般語として現れるだけであり、株式会社コアとの取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: freee（フリー・4478）: 在外子会社の所在地表記（シドニーのチフリー・スクエア）の一部として現れるだけであり、フリー株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: nissin（日新・9066）: ambiguous な一致でコードリストにない区分でもあり、新株予約権等の文脈で現れるだけであり、株式会社日新との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: will（ウィル・3241）: 米国デラウェア州ウィルミントンという地名の一部として現れるだけであり、株式会社ウィルとの取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: applied-technology（応用技術・4356）: 研究開発活動の説明中の「応用技術」という一般語として現れるだけであり、応用技術株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: cover（カバー・5253）: 経営成績の分析中の動詞「カバー」の一部として現れるだけであり、カバー株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: en（エン・4849）: ambiguous な一致で、「エンドポイント」等の語の一部として現れるだけであり、エン株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: japan-securities-finance（日本証券金融・8511）: 大株主の状況に1.58％（2025年12月31日現在）で載るが、証券金融機関としての保有であり、当社との取引・提携を述べる記述がないため結ばなかった。
- relatedCompanies: ray（レイ・4317）: ambiguous な一致で、住所表記等の語の一部として現れるだけであり、株式会社レイとの取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: rhythm（リズム・7769）: 社名としての出現ではなく、リズム株式会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: 有報の【関係会社の状況】に載る連結子会社41社と持分法適用関連会社2社（General Mobile Corporation、TXOne Networks Inc.）は、いずれも未上場の海外法人で候補リストになく、有報自身も証券報告書提出会社はないと明記しているため、関連企業のリンクは設けていない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
