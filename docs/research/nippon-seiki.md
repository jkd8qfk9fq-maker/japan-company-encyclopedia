# 日本精機 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本精機株式会社 |
| 証券コード | 7287 |
| docID（データを取り出した文書） | `S100YHIT` |
| 原本 docID | `S100YHIT` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHIT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本精機株式会社 / 7287 / docID S100YHIT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 31 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-seiki: 10 件の数値を有報XBRLと照合
有報: 日本精機株式会社 有価証券報告書－第81期(2025/04/01－2026/03/31) (docID S100YHIT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-seiki: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造、販売などの費用を差し引いた残りが利益になります。2026年3月期のは8,…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは【連結経営指標等】の注2（第79期における企業結合の暫定的会計処理の確定と、第78期指標への反映）に基づく。前期有報との修正再表示チェックは全行一致だったが、有報自身が確定内容の反映を注記しているため、事実として記録した。
- businessModel: 中期経営計画2026の業績目標（売上収益・当期利益の目標額、PBR、総還元性向などの投資指標）は数値目標・投資の語にあたるため書かず、戦略は定性的に要約した。
- businessModel: 東洋電装の株式取得の対価（現金49,850百万円・予定）は取得原価の金額であり、本文の財務数値の規則（売上高と当期純利益のみ）により書かなかった。出来事自体は沿革とneedsReviewに記録した。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上収益（2026年3月期）の大きい順: 車載部品事業267,236百万円、自動車販売事業27,000百万円、民生部品事業13,881百万円、樹脂コンパウンド事業8,374百万円。
- businessStructure: 「その他」（11,401百万円）は金額では樹脂コンパウンド事業を上回るが、セグメント注記が「報告セグメントに含まれない事業セグメント」と明記する区分のため最後に置いた。
- businessStructure: 車載部品事業のchildrenは【事業の内容】の主要製品の区分による。区分ごとの売上収益は開示されていないため、各childの説明にその旨を明記した。
- businessStructure: 「その他」の内容は当期（2026年3月期）のセグメント注記の記載（貨物運送、ソフトウエアの開発販売、受託計算等）によった。前期の注記にあった液晶表示素子・モジュールの製造販売は当期の注記に記載がないため含めていない。
- businessStructure: 市場区分「スタンダード」は表紙の上場金融商品取引所名（東京証券取引所スタンダード市場）の印字による。
- history: 沿革の細目（本社・工場の移転、営業所の開設、ISO認証の取得、国内子会社の設立・合併の多く）は省いた。採用は設立、上場、市場移行、海外展開の節目、事業再編、2026年の東洋電装の子会社化決議。
- history: 2026年の東洋電装の件は決算日後の出来事で、企業結合日（2026年10月1日）・完全子会社化はいずれも予定であるため、完了とは書かず「予定」と明記した。根拠は【重要な契約等】と連結財務諸表注記「34．後発事象」。
- history: 創業時の資本金など金額は沿革に印字がなく、書いていない。
- industry: 主たる業界はautomotive: 車載部品事業が外部顧客への売上収益267,236百万円で、売上収益全体（327,894百万円）の大部分を占める。
- industry: retailは自動車販売事業（27,000百万円、報告セグメントとして独立開示）による。electronicsは民生部品事業（13,881百万円、報告セグメントとして独立開示。ＯＡ・情報機器操作パネル、空調・住設機器コントローラー）による。
- industry: 樹脂コンパウンド事業（8,374百万円）には業界を付けなかった。樹脂材料の製造販売は車載部品等への材料供給の位置づけで、金額も小さく、閉じた分類に樹脂材料そのものの区分がないため。
- industry: 「その他」（貨物運送、ソフトウエアの開発販売、受託計算等）は報告セグメントに含まれない区分のため、業界を付けなかった。
- relatedCompanies: 結んだ関連企業は3社（honda=customer、alps-alpine=business-partner、yamaha-motor=major-shareholder）。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: alps-alpineの種別判断: 【大株主の状況】の事業会社でもあるが、【株式の保有状況】に「統合コックピットの開発等の業務提携」という相手固有の提携内容が印字されているため、資本関係ではなく提携を主としてbusiness-partnerとした。持株比率は説明に併記した。
- relatedCompanies: yamaha-motorの種別判断: 【株式の保有状況】の保有目的は「車載部品事業における取引の円滑化」という定型的な文言で、取引の向きや内容の個別記載がないため、【大株主の状況】の事業会社としてmajor-shareholderとした。
- relatedCompanies: mazda: 有報の「マツダ」は連結子会社である新潟マツダ自動車株式会社への言及と、2010年に同社の株式をマツダ株式会社から取得した沿革の記載のみ。当期におけるマツダ株式会社自身との取引・提携の記載がないため結ばなかった。
- relatedCompanies: sanshin-electronics: 【株式の保有状況】に載るが、保有目的は「車載部品事業並びに民生部品事業における取引の円滑化」という定型的な文言のみで、相手固有の取引内容の記載がないため結ばなかった。
- relatedCompanies: the-taiko-bank / resona-holdings / mitsubishi-ufj-financial-group / daishi-hokuetsu-financial-group / the-first-bank-of-toyama / okasan-securities-group / ms-and-ad-insurance-group-holdings: 保有目的が資金調達の円滑化・金融取引の円滑化であり、金融機関との資金調達・金融取引は関係性にあたらないため結ばなかった。
- relatedCompanies: nissin: listingがコードリストになく、一致箇所も新株予約権等の文の断片で、株式会社日新への言及ではない。
- relatedCompanies: suzuki-6785: ambiguous。役員等の個人名「鈴木」の一致で、株式会社鈴木への言及ではない。
- relatedCompanies: en: ambiguous。「エンドユーザー」等の一般語の断片一致で、エン株式会社への言及ではない。
- relatedCompanies: ray: ambiguous。「ディスプレイ」等の語の断片一致で、株式会社レイへの言及ではない。
- relatedCompanies: daiwa: ambiguous。沿革の旧子会社名「株式会社大和ホンダ」への言及で、大和証券グループ等への言及ではない。
- relatedCompanies: zero: ambiguous。一般語の断片一致で、株式会社ゼロへの言及ではない。
- relatedCompanies: path: ambiguous。一般語の断片一致で、パス株式会社への言及ではない。
- relatedCompanies: seki: ambiguous。「日本精機」等の社名の断片一致で、セキ株式会社への言及ではない。
- relatedCompanies: career: 「キャリア形成」など人材戦略の一般語の一致で、株式会社キャリアへの言及ではない。
- relatedCompanies: base-4481: 「マーケットベース」等の一般語の一致で、ベース株式会社への言及ではない。
- relatedCompanies: port: 「事業ポートフォリオ」の一般語の一致で、ポート株式会社への言及ではない。
- relatedCompanies: vision: 「グループビジョン」の一般語の一致で、株式会社ビジョンへの言及ではない。
- relatedCompanies: land: 「ポーランド」等の国名の断片一致で、株式会社ランドへの言及ではない。
- relatedCompanies: step: 「ステップ」等の一般語の一致で、ステップ株式会社への言及ではない。
- relatedCompanies: ishin: 一般語の断片一致で、イシン株式会社への言及ではない。
- relatedCompanies: rix: 一般語の断片一致で、リックス株式会社への言及ではない。
- relatedCompanies: ns-group: 当社グループの略称「ＮＳ」を冠する子会社名等の一致で、NSグループ株式会社への言及ではない。
- relatedCompanies: corona: 「新型コロナウィルス」への言及で、株式会社コロナへの言及ではない。
- relatedCompanies: innovation: バリュー（価値観）の「イノベーション」の一般語の一致で、イノベーション株式会社への言及ではない。
- relatedCompanies: stg: 英字の断片一致で、STG株式会社への言及ではない。
- relatedCompanies: the-lead: 一般語の断片一致で、株式会社リードへの言及ではない。
- relatedCompanies: will: 英単語等の断片一致で、株式会社ウィルへの言及ではない。
- relatedCompanies: 候補外の記録: 日亜化学工業株式会社は【大株主の状況】に載る事業会社の大株主（2.93％、2026年3月31日現在）だが、related-candidates.jsonに含まれないため、候補の中からだけ選ぶ規則により結ばなかった。
- relatedCompanies: 候補外の記録: 東洋電装株式会社は未上場で候補に含まれない。2026年4月20日に株式譲渡契約を締結した子会社化予定先であり、沿革とneedsReviewに記録した（関連企業としては結ばない）。
- relatedCompanies: 候補外の記録: EMERGING DISPLAY TECHNOLOGIES（台湾のTFT液晶メーカー）は【株式の保有状況】に資本業務提携に基づく当期の株式取得が記載されているが、海外企業で候補に含まれないため結ばなかった。
- terms: 登録候補（助言のみ）: ヘッドアップディスプレイ（HUD。フロントガラスなどに速度や案内を表示する装置で、同社の成長分野）、HMI（ヒューマンマシンインターフェイス。人と機械の接点となる表示・操作の仕組み）、樹脂コンパウンド（樹脂に添加剤などを混ぜて成形材料に加工すること）、TFT液晶（薄膜トランジスタを使う液晶表示素子）。

## 要確認（status に反映）

- businessModel: 決算日後の2026年4月20日に、東洋電装株式会社の株式を取得し子会社化することを取締役会で決議し、株式譲渡契約を締結したことが【重要な契約等】と連結財務諸表注記「34．後発事象」に記載されている。企業結合日は2026年10月1日（予定）、取得する議決権比率は55.8％で、最終的に発行済株式の全部を取得し2027年3月期中に完全子会社化する予定とされている。本登録は2026年3月31日現在のグループ構成（子会社33社・関連会社1社）に基づいており、完了前の予定事項であるため、承認者の確認を求める。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
