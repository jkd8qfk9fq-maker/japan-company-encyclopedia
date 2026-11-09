# サンゲツ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サンゲツ |
| 証券コード | 8130 |
| docID（データを取り出した文書） | `S100YA8B` |
| 原本 docID | `S100YA8B` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YCA9（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YA8B.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サンゲツ / 8130 / docID S100YA8B（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 35 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sangetsu: 10 件の数値を有報XBRLと照合
有報: 株式会社サンゲツ 有価証券報告書－第74期(2025/04/01－2026/03/31) (docID S100YA8B)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":12567000000,"latestFiling":12550000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":18606000000,"latestFiling":18572000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":183859000000,"latestFiling":183923000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":113781000000,"latestFiling":113810000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第73期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sangetsu: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年3月期 の note は既にあります — 先のものを保持しました
- businessModel: financialNotesの2件は、いずれも主要な経営指標等の注記に印字された遡及修正である。2022年改正の法人税等会計基準の遡及適用は第73期の期首から適用され第72期の数値に反映され、企業結合に係る暫定的な会計処理の確定は当連結会計年度に確定した見直しが第73期の数値に反映されている。表示方法の変更の痕跡はこの包括利益計算書関係の注記の範囲であり、それ以外の修正再表示の記載は確認できなかった。az-com-maruwa-holdings、daihen、miuraの前例に従い、needsReviewではなくfinancialNotesとwarningsに記録した。
- businessModel: 2026年6月16日に提出された第73期の訂正有価証券報告書（S100YCA9）をEDINETで確認した。訂正箇所は連結財務諸表の注記事項（連結包括利益計算書関係）のみで、その他有価証券評価差額金の当期発生額の符号の誤りを正すもので、売上高や当期純利益など主要な経営指標等の数値には影響しないため、needsReviewではなくwarningsに記録した。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項はありません」と印字されているため、needsReviewは付けていない。
- businessModel: 中期経営計画2029の目標のうち連結売上高2,500億円のみをperspectivesに記載し、営業利益・当期純利益・ROE・ROICの目標は投資の語にあたるため記載していない。
- businessModel: 財務数値は売上高と親会社株主に帰属する当期純利益だけを書き、営業利益・経常利益の金額や増減率は書いていない。
- businessStructure: 国内インテリアの子供の金額（壁装ユニット79,949百万円など）は、MD&Aの販売実績に印字されたセグメント計（セグメント間の内部売上高を含む164,106百万円）の分解であり、セグメント情報の外部顧客への売上高164,102百万円とは集計の基礎が異なる。4ユニットの合計は164,105百万円で、セグメント計との差1百万円は有報の端数である。
- businessStructure: 関係会社の状況には個別の売上高・利益が印字されていないため、連結子会社は事業の説明の中でのみ触れ、金額は書いていない。
- businessStructure: Wikipedia（「サンゲツ」）も確認したが、最大手といった順位の表現を含み、有報の記載で足りるため、出典には使っていない。
- history: 沿革のうち、支店・営業所・ショールームの開設・移転（1970年名古屋ショールーム、1972年東京営業所、1976年東京店・福岡店、1978年大阪店、1982年仙台店・本社移転、1984年札幌店、1991年岡山店、2018年北海道支社移転、2019年中国四国支社・広島ショールーム移転、2021年関西支社移転）、個別の商品の販売開始（1979年クッションフロア、1981年カーテン、1982年カーペット、1986年フロアタイル、1988年カーペットタイル、1994年椅子生地）、1989年の名古屋証券取引所市場第一部への指定、1996年の米国現地法人設立、2008年の山田照明の株式取得、ロジスティクスセンターの開設（2014年・2016年・2017年・2018年・2021年）、2016年の中国現地法人設立と英文社名変更、2017年のサンゲツヴォーヌ設立、2018年のサンゲツ沖縄設立、2020年のベトナム現地法人設立、2021年の見本帳リサイクルセンター開設、2022年のクロス企画の株式取得、2024年のPARCs開設は、子会社・拠点レベルの出来事として採用しなかった。
- industry: 東証の業種分類は卸売業で、壁装材・床材・ファブリックなどのインテリア商材の販売が連結売上高の大半を占める専門商社であり、閉じた分類のtradingがそのまま合うため、暫定値やtaxonomyGapsは不要と判断した。
- industry: 空間総合事業（設計・施工）は国内インテリアセグメントの中に含まれて独立した金額開示がなく、クレアネイトによる壁紙の製造も同セグメント内であるため、constructionや製造系の産業は付けなかった。
- relatedCompanies: 結ばなかった候補：career — 「キャリア採用」などの一般語への一致で、株式会社キャリアへの言及はない。
- relatedCompanies: 結ばなかった候補：en — ambiguous。「エンゲージメント」等の語の断片一致で、エン株式会社への言及はない。
- relatedCompanies: 結ばなかった候補：core — ambiguous。「コアビジネス」等の一般語への一致で、株式会社コアへの言及はない。
- relatedCompanies: 結ばなかった候補：port — 「カーポート」等の商品を指す語への一致で、株式会社ポートへの言及はない。
- relatedCompanies: 結ばなかった候補：innovation — 中期経営計画のスローガン「イノベーションの創出」の語への一致で、株式会社イノベーションへの言及はない。
- relatedCompanies: 結ばなかった候補：land — 「ブランド」や床材メーカーBOLON等の断片一致で、株式会社ランドへの言及はない。
- relatedCompanies: 結ばなかった候補：vision — 「長期ビジョン」等の一般語への一致で、株式会社ビジョンへの言及はない。
- relatedCompanies: 結ばなかった候補：lec — 「フレックス」等の語の断片一致で、株式会社レックへの言及はない。
- relatedCompanies: 結ばなかった候補：seki — ambiguous。「セキュリティ」等の語の断片一致で、セキ株式会社への言及はない。
- relatedCompanies: 結ばなかった候補：base-4481 — 「営業利益ベース」等の語への一致で、ベース株式会社への言及はない。
- relatedCompanies: 結ばなかった候補：king — 「ワーキング」等の語の断片一致で、株式会社キングへの言及はない。
- relatedCompanies: 結ばなかった候補：the-lead — 「リードする人材」等の表現への一致で、株式会社ザ・リードへの言及はない。
- relatedCompanies: 結ばなかった候補：slogan — 中期経営計画の「スローガン」という語への一致で、株式会社スローガンへの言及はない。
- relatedCompanies: 結ばなかった候補：frontier — 自社の価値観「フロンティアスピリット」の語への一致で、株式会社フロンティアへの言及はない。
- relatedCompanies: 結ばなかった候補：space — 自社機能の名称「スペース材料提供機能」への一致で、株式会社スペースへの言及はない。
- relatedCompanies: 結ばなかった候補：zero — ambiguous。「ネット・ゼロ」等の語への一致で、株式会社ゼロへの言及はない。
- relatedCompanies: 結ばなかった候補：cover — BCPの文脈の「カバー」という動詞への一致で、カバー株式会社への言及はない。
- relatedCompanies: 結ばなかった候補：dai-ichi-life-holdings — 保険会社である。特定投資株式22,400株の保有はあるが、保有目的に取引の内容は印字されておらず売却予定とされ、保険・金融関係は結ばない方針のため結ばなかった。
- relatedCompanies: 結ばなかった候補：freee — 「CO2フリー商品」等の語への一致で、フリー株式会社への言及はない。
- relatedCompanies: 結ばなかった候補：itokuro — 連結子会社の株式会社クレアネイトと株式会社クロス企画（現・株式会社SDS）の名称の断片一致で、株式会社イトクロへの言及はない。
- relatedCompanies: 結ばなかった候補：teijin — ambiguous。ポリエステルカーテンの水平循環リサイクルシステムの連携相手は帝人の子会社である帝人フロンティア株式会社で、帝人株式会社自体との取引・提携の記載がないため結ばなかった。
- relatedCompanies: 結ばなかった候補：the-ogaki-kyoritsu-bank — 銀行である。当期は保有株式がなく（前期までに売却）、大株主名簿の持分も金融機関のものであるため結ばなかった。
- relatedCompanies: 結ばなかった候補：corona — 「新型コロナウイルス感染症」の語への一致で、株式会社コロナへの言及はない。
- relatedCompanies: 結ばなかった候補：misonoza-theatrical — 特定投資株式18,000株の保有はあるが、保有目的（取引の内容）の記載がなく売却予定と印字されているため結ばなかった。
- relatedCompanies: 結ばなかった候補：mitsubishi-ufj-financial-group — 銀行・金融グループである。特定投資株式920,150株の保有はあるが、資金調達等の金融取引の範囲であり、銀行・金融関係は結ばない方針のため結ばなかった。
- relatedCompanies: 結ばなかった候補：nissin — listing が（コードリストにない）。
- relatedCompanies: 結ばなかった候補：token — 特定投資株式2,000株（貸借対照表計上額26百万円）の保有はあり、当社製品の販売促進の目的も印字されているが、保有規模が僅少なため結ばなかった。
- relatedCompanies: 結ばなかった候補：lonseal — 特定投資株式1,303株（貸借対照表計上額2百万円）の保有はあり、仕入先との関係強化の目的も印字されているが、保有規模が僅少なため結ばなかった。
- relatedCompanies: 結ばなかった候補：the-bank-of-nagoya — 銀行である。当期は保有株式がなく（前期までに売却）、金融機関のみの関係のため結ばなかった。
- relatedCompanies: 結ばなかった候補：step — 「次のステップ」等の一般語への一致で、株式会社ステップへの言及はない。
- relatedCompanies: 結ばなかった候補：taya — ambiguous。大株主の住所（東京都世田谷区）等の断片一致で、株式会社TAYAへの言及はない。
- relatedCompanies: 候補外だが記録する：株式会社AVANTIAは特定投資株式7,200株（当社商品の販売促進目的）が印字されているが、候補リストにないため結んでいない。
- relatedCompanies: 候補外だが記録する：吉野石膏株式会社はINNO PANELの共同開発先として印字されているが、候補リストにないため結んでいない（共同開発先のうち候補にあったフジプレアムのみ結んだ）。
- relatedCompanies: 候補外だが記録する：帝人フロンティア株式会社はポリエステルカーテンの水平循環リサイクルシステムの連携相手として印字されているが、候補リストにないため結んでいない。
- relatedCompanies: 候補外だが記録する：スウェーデンの床材メーカーBOLON社は、当社が同社製品の国内取り扱いを決め2027年3月期から販売を始めることが印字されているが、候補リストにないため結んでいない。
- terms: 助言: 「見本帳」は、壁紙や床材などのサンプルを綴じた同社の主力の販売ツール（カタログ）を指す固有の語で、事業の仕組みの中心として有報に繰り返し現れるため、登録候補になります。
- terms: 助言: 「トータルインテリア」は、素材・デザイン・物流・施工を組み合わせた同社のソリューション提案の考え方を指す語で、競争力の源泉として有報に現れるため、登録候補になります。
- terms: 助言: 「ファブリック」は、カーテンや椅子生地などの布地製品を指す同社の製品区分の語で、ユニット名としても現れるため、登録候補になります。
- terms: 助言: 「特定投資株式」は政策保有株式の開示区分を指す用語で、関連企業の判断材料になるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
