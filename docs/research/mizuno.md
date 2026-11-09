# 美津濃 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 美津濃株式会社 |
| 証券コード | 8022 |
| docID（データを取り出した文書） | `S100YFWX` |
| 原本 docID | `S100YFWX` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFWX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 美津濃株式会社 / 8022 / docID S100YFWX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 34 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 4 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mizuno: 10 件の数値を有報XBRLと照合
有報: 美津濃株式会社 有価証券報告書－第113期(2025/04/01－2026/03/31) (docID S100YFWX)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
mizuno: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…入、販売などの費用を差し引いた残りが利益になります。2026年3月期のは18…）
- 確認: [relationship-unclear] relatedCompanies[9]: business-partner だが、説明に取引・提携の事実が見当たらない（…文具・オフィス家具のコクヨです。美津濃は、オフィス空間の共創など事業連携における協力関係の維持強化のため、同社の株式21…）
- 確認: [relationship-unclear] relatedCompanies[14]: business-partner だが、説明に取引・提携の事実が見当たらない（…倉庫・物流の住友倉庫です。美津濃は、ロジスティクス管理など事業連携における協力関係の維持強化のため、同社の株式405,0…）

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年4月1日を効力発生日とする株式分割（普通株式1株につき3株）は1株当たりの指標のみに影響するため、financialNotes には入れなかった。
- businessModel: 売上高と当期純利益以外の財務数値（営業利益・経常利益・売上総利益・ROA・ROE・中期経営計画の利益目標など）は規則により書いていない。中期経営計画の目標のうち書いたのは売上高目標だけである。
- businessModel: 欧州の前期（2025年3月期）の会計期間が9か月だった件は、連結の5年間の数値に影響しないため businessStructure の warnings に記録した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期: 日本155,152百万円、米州37,748百万円、アジア・オセアニア35,351百万円、欧州30,793百万円）の大きい順とした。セグメント利益は規則により記載していない。
- businessStructure: 日本の子区分（スポーツ品等販売事業・スポーツ施設運営事業）はセグメント注記の収益の分解情報に基づく。分解額はセグメントごとに印字されているため、日本の children の説明にのみ記した。
- businessStructure: 欧州は2025年1月1日付で在外支店を子会社化する事業再編を行っており、前連結会計年度の欧州の会計期間は9か月だったことがMD&Aに書かれている。連結の5年間の数値には影響しないため financialNotes には入れず、ここに記録する。
- businessStructure: Wikipedia（「ミズノ」）は利用可能だったが、有報で足りるため使っていない。
- history: 沿革表は年月と事象が対応して印字されており（年月セルと事象文が分かれた崩れた表ではない）、全行を年順に採用した。資本金の金額は規則により各エントリーに書いていない。
- history: 沿革のうち本登録では、創業・社名変更・上場・主要な子会社設立と完全子会社化・市場移行・欧州再編・直近の海外子会社設立を採用し、支社・営業所の開設移転や財団設立などの行は省いた。
- industry: スポーツ用品メーカーに当たる業界区分が閉じた分類にないため、ヨネックスの登録（taxonomy-gaps に記録済み）と同じく、最終消費者に自社ブランドの商品を届ける点で最も近い retail を暫定の主たる業界とした。スポーツ施設運営事業は日本のセグメント内の事業で、独立した報告セグメントではないため、別の業界は付けていない。
- relatedCompanies: 結んだ関連企業は15社（customer 9社、business-partner 6社）。いずれも【株式の保有状況】の特定投資株式に、相手ごとの取引・事業連携の内容と実株式数が印字されている相手である。貸借対照表計上額は規則により書いていない。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: 種別判断: 「商品の販売における取引関係」と印字された小売・流通の相手は、美津濃が商品を販売する相手であるため customer とした。「事業連携における協力関係」と具体的な連携内容（ライセンス品の開発・販売、製品・素材開発、オフィス空間の共創、ロジスティクス管理）が印字された相手は、取引の向きが印字されていないため business-partner とした。
- relatedCompanies: 大株主の状況（2026年3月31日現在）には、事業会社に当たる候補は載っていない（最大の保有者は公益財団法人ミズノスポーツ振興財団17.27％で、上場事業会社ではなく候補にもない。その他は信託銀行・保険会社・金融機関など）。そのため major-shareholder のリンクはない。
- relatedCompanies: 【関係会社の状況】の子会社・関連会社はすべて非上場で（有報に「有価証券報告書を提出している会社はありません」と印字）、候補にないため結んでいない。なお、印字されたミズノの完全子会社「シャープ産業株式会社」は上場のシャープ株式会社とは別会社である。
- relatedCompanies: イオン株式会社は特定投資株式に「商品の販売における取引関係の維持強化のため」305,178株と印字されているが、候補リストにない（候補にあるのはイオン九州のみ）ため結べない。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有目的が「主要取引金融機関として、協力関係の維持強化のため」で、金融取引が理由のため結ばない。
- relatedCompanies: the-ogaki-kyoritsu-bank: 保有目的が「取引金融機関として、協力関係の維持強化のため」で、金融取引が理由のため結ばない。
- relatedCompanies: daikin-industries: みなし保有株式（退職給付信託契約による議決権行使の指図権限）として印字されているだけで、直接の取引・提携の記載がないため結ばない。
- relatedCompanies: fuji-8278: みなし保有株式（退職給付信託）として印字されているだけで、直接の取引関係の記載がないため結ばない。
- relatedCompanies: japan-transcity: みなし保有株式（退職給付信託）として印字されているだけで、直接の取引関係の記載がないため結ばない。
- relatedCompanies: mitsubishi-ufj-financial-group: みなし保有株式（退職給付信託）として印字されているだけで、金融機関でもあるため結ばない。
- relatedCompanies: sharp: 有報の印字は完全子会社の「シャープ産業株式会社」であり、上場しているシャープ株式会社とは別の会社のため結ばない。
- relatedCompanies: land: 「ブランド」など一般語の一部への一致で、株式会社ランドへの言及がないため結ばない。
- relatedCompanies: career: 「キャリア形成支援」など人材育成の記述への一致で、株式会社キャリアへの言及がないため結ばない。
- relatedCompanies: en: ambiguous な候補で、一致は一般語・部分一致であり、エン株式会社への言及がないため結ばない。
- relatedCompanies: base-4481: 「日本ベースボール品」などの「ベース」への一致で、ベース株式会社への言及がないため結ばない。
- relatedCompanies: innovation: 自社の研究開発施設「イノベーションセンターMIZUNO ENGINE」への一致で、株式会社イノベーションへの言及がないため結ばない。
- relatedCompanies: port: 自社の店舗名「エスポートミズノ」などへの一致で、ポート株式会社への言及がないため結ばない。
- relatedCompanies: lec: 「フレックスタイム制」などへの一致で、レック株式会社への言及がないため結ばない。
- relatedCompanies: path: 経営方針の用語「パーパス」への一致で、パス株式会社への言及がないため結ばない。
- relatedCompanies: vision: 経営方針の用語「ビジョン」への一致で、株式会社ビジョンへの言及がないため結ばない。
- relatedCompanies: king: 「ワーキング品」への一致で、株式会社キングへの言及がないため結ばない。
- relatedCompanies: zero: 環境目標の用語「ネットゼロ」への一致で、株式会社ゼロへの言及がないため結ばない。
- relatedCompanies: core: 「コアとなる生産技術」など一般語への一致で、株式会社コアへの言及がないため結ばない。
- relatedCompanies: kohsoku: 「高速で回転させる」など一般語への一致で、株式会社高速への言及がないため結ばない。
- relatedCompanies: nissin: コードリストになく、一致箇所は新株予約権等の記載で、株式会社日新への言及と確認できないため結ばない。
- relatedCompanies: takashima-and-co: 施設所在地の地名「高島平」への一致で、高島株式会社への言及がないため結ばない。
- relatedCompanies: trust: コードリストになく、印字は日本マスタートラスト信託銀行（信託銀行）で、株式会社トラストへの言及がないため結ばない。
- relatedCompanies: alpha: 沿革のかつての子会社名「ミズノアルファーサービス株式会社」への一致で、株式会社アルファへの言及がないため結ばない。
- relatedCompanies: alpha-4760: 沿革のかつての子会社名「ミズノアルファーサービス株式会社」への一致で、株式会社アルファ（4760）への言及がないため結ばない。
- relatedCompanies: cover: 保険の記述「カバーできる」などへの一致で、カバー株式会社への言及がないため結ばない。
- relatedCompanies: frontier: 自社の価値観の記述「フロンティア精神」への一致で、株式会社フロンティアへの言及がないため結ばない。
- relatedCompanies: ricoh: 製品回収のリスク記述「リコール」への一致で、株式会社リコーへの言及がないため結ばない。
- relatedCompanies: seki: 「セキュリティ」などへの一致で、セキ株式会社への言及がないため結ばない。
- terms: 登録候補（助言のみ）: DTC（Direct to Consumerの略。直営店やeコマースを通じて、メーカーが消費者へ直接販売する方式）、カスタムフィッティング（ゴルフクラブなどを、顧客一人ひとりの体格やスイングに合わせて調整・提案するサービス）、ワーキング品（ワークビジネス。作業服や安全靴など、働く人向けにスポーツの知見を応用した製品群）、ミズノクリスタ（大阪市住之江区にある美津濃の本社ビル）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 美津濃（スポーツ用品メーカー）の業界 → 提案: スポーツ用品（スポーツ・レジャー用品）。有報はスポーツ品の製造及び販売を主な事業とし、2026年3月期の売上高259,045百万円の大部分がスポーツ品等販売事業です。自社の工場でゴルフ品や野球品などを製造し、自社ブランドの完成品を国内外の子会社・代理店と直営店・eコマース（DTC）を通じて売る事業であり、閉じた集合の19種のどれにも製造業としては当てはまりません。最終消費者に自社ブランドの商品を届ける点で最も近い retail を暫定にしました。アシックスやヨネックスなど他のスポーツ用品メーカーにも同じ事情があります。
