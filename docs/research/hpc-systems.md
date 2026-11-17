# HPCシステムズ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＨＰＣシステムズ株式会社 |
| 証券コード | 6597 |
| docID（データを取り出した文書） | `S100Z4KT` |
| 原本 docID | `S100Z4KT` |
| 提出日（原本） | 2026-09-28 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z4KT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＨＰＣシステムズ株式会社 / 6597 / docID S100Z4KT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hpc-systems: 6 件の数値を有報XBRLと照合
有報: ＨＰＣシステムズ株式会社 有価証券報告書－第21期(2025/07/01－2026/06/30) (docID S100Z4KT)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
hpc-systems: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「HPCシステムズ株式会社」が EDINET の提出者名「ＨＰＣシステムズ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正：S100Z4KT に対する訂正有報はなく（amendments status none、checkedThrough 2026-11-12）、前期有報との修正再表示チェックも全系列で差異ゼロだったため、訂正に関する financialNotes は付けていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」だった。
- businessModel: 経営指標等の注記2（株式給付信託の株式を自己株式に含める1株当たり情報の算定方法）は表示・算定上の事項のため financialNotes には入れていない。注記1（第19期より連結作成）は 2024年6月期の financialNote として入れた。
- businessModel: 仕入の事実：【重要な契約等】に米国Super Micro Computer, Inc. との代理店契約（HPC事業のハードウェア仕入、2026年5月22日〜2027年5月21日）が書かれている。海外企業で候補にもないため関連企業には入れていない。また【関連当事者情報】に、前期に主要株主だった菱洋エレクトロ株式会社（現リョーサン菱洋株式会社）からの原材料の仕入が書かれているが、同社は related-candidates.json に無く、当期の関連当事者取引は「該当事項はありません」とされているため、関連企業には入れていない。
- businessModel: Wikipedia の記事は無かった（found: false）ため使っていない。
- businessModel: MD&A の利益の金額や増減率、セグメント利益、受注高・受注残高の金額、経営指標の目標は本文に書いていない。売上高の増減率は印字どおり使った。
- businessStructure: 事業はセグメント注記の外部顧客への売上高の大きい順に並べた（HPC事業5,000,558千円、CTO事業2,905,848千円。千円を百万円に切り捨てて記載し、合計は印字の7,906,406千円から7,906百万円とした）。
- businessStructure: HPC事業の内訳（システム販売とソフトウェア・サービス）の売上高は独立して開示されていないため、children には金額を書いていない。
- businessStructure: 設備は、本社のサーバ等がセグメント欄でHPC事業のためHPC事業に、本社の本社機能は「共通」のためどの事業にも結びつけず、匝瑳工場はCTO事業のためCTO事業に対応する。帳簿価額は書いていない。
- businessStructure: suppliers キーはこのツリーの旧スキーマに無いため省略した。仕入先の事実は businessModel の warnings に記録した（Super Micro Computer, Inc. との代理店契約、主要株主だった菱洋エレクトロ株式会社からの原材料の仕入）。
- businessStructure: 連結子会社はベトナムの Intelligent Integration Company Limited（議決権100.0％）の1社で、自社グループのため関連企業には入れていない。
- history: 沿革表は年月と事象が崩れず対応しており、行順の対応づけは不要だった。
- history: 落とした行：2011年7月の西日本営業所の移転、2025年7月の西日本営業所の移転（いずれも営業所の移転のみのため）。
- history: 資本金の金額は沿革に書いていない。
- industry: 主たる業界は、売上の約63％を占めるHPC事業（科学技術計算用コンピュータのシステムインテグレーションとソフトウェア・サービス）から it とした。
- industry: CTO事業は産業用コンピュータの開発・製造であり、報告セグメントとして開示されているため electronics を2つ目に付けた。
- industry: 閉じた分類にスーパーコンピュータ専用の区分はないが、it と electronics で事業の実態を表せるため taxonomyGaps は付けていない。
- relatedCompanies: en（エン株式会社）：「エンジニア」等への部分一致で ambiguous であり、同社についての取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）：「材料データベース」「営業利益ベース」等への部分一致のみのため結ばなかった。
- relatedCompanies: king（株式会社キング）：スパコン名「kukai」の読み等への部分一致のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）：「サポート」という語への部分一致のみのため結ばなかった。
- relatedCompanies: heiwa（株式会社平和）：経営理念の「世界平和」という語への一致で ambiguous であり、同社についての記載はないため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）：「超高速計算」という語への一致で ambiguous であり、同社についての記載はないため結ばなかった。
- relatedCompanies: land（株式会社ランド）：「人財グランドデザイン」という語への部分一致のみのため結ばなかった。
- relatedCompanies: cube（株式会社キューブ）：自社サービス名「Sキューブソリューション」への部分一致のみのため結ばなかった。
- relatedCompanies: seki（セキ株式会社）：「情報セキュリティ」という語への部分一致で ambiguous であり、同社についての記載はないため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）：「ビジョン」という一般語への一致のみのため結ばなかった。
- relatedCompanies: hub（株式会社ハブ）：「官と民を結ぶハブ」という表現への一致で ambiguous であり、同社についての記載はないため結ばなかった。
- relatedCompanies: innovation（イノベーション株式会社）：「イノベーション創出」という一般語への一致のみのため結ばなかった。
- relatedCompanies: japan-securities-finance（日本証券金融株式会社）：【大株主の状況】に2026年6月30日現在1.36％の株主として載るが、証券金融会社による保有であり、取引・提携の印字はないため結ばなかった。
- relatedCompanies: nissin（日新）：候補の listing が「コードリストにない」で ambiguous であり、一致箇所も新株予約権の条文中の一般語のため結ばなかった。
- relatedCompanies: ray（株式会社レイ）：「ディスプレイ」等への部分一致で ambiguous であり、同社についての記載はないため結ばなかった。
- relatedCompanies: space（株式会社スペース）：「省スペース性」という語への部分一致のみのため結ばなかった。
- relatedCompanies: 候補にない相手：萩原テクノソリューションズ株式会社は2026年6月期に売上高の12.0％を占める主要な顧客（CTO事業）だが related-candidates.json に無いため結ばなかった（上場している萩原電気ホールディングスとは別法人のため代替もしていない）。リョーサン菱洋株式会社（旧菱洋エレクトロ株式会社）は前期に主要株主で原材料の仕入取引があったが候補に無いため結ばなかった。Super Micro Computer, Inc. は【重要な契約等】の代理店契約の相手先だが海外企業で候補に無いため結ばなかった。その他の大株主は信託銀行（信託口）・証券会社・外国証券のカストディ口座・個人であり結ばなかった。連結子会社1社は自社グループのため除外した。
- terms: 助言のみ。用語の追加提案：HPC（High Performance Computing。高性能コンピュータによる科学技術計算の処理環境）、CTO（Configure-to-order。顧客の注文仕様に合わせてコンピュータを開発・製造する受注仕様生産方式）、マテリアルズ・インフォマティクス（材料データベースやAIを活用して材料開発を行う手法）、エンベデッド・コンピュータ（装置に組み込まれる組込コンピュータ）、GREEN500（スーパーコンピュータの省エネルギー性能ランキング）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
