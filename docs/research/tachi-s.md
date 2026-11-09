# タチエス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社タチエス |
| 証券コード | 7239 |
| docID（データを取り出した文書） | `S100YLGY` |
| 原本 docID | `S100YLGY` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLGY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社タチエス / 7239 / docID S100YLGY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tachi-s: 10 件の数値を有報XBRLと照合
有報: 株式会社タチエス 有価証券報告書－第74期(2025/04/01－2026/03/31) (docID S100YLGY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tachi-s: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造、販売などの費用を差し引いた残りが利益になります。2026年3月期のは9,…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報と全項目一致（差異なし）で、決算期変更・変則決算もないため、financialNotes は空にした。
- businessModel: 中期経営計画の財務目標のうち営業利益率・ROIC・ROEは、本文に書けない利益・投資の指標であるため perspectives には記載せず、売上高の目標だけを取り上げた。
- businessModel: 報告セグメントの区分変更（欧州の除外）と中国の2社の持分法適用関連会社への変更は、当期の有報の記載どおり本登録に反映済みであり、businessStructure の warnings に記録した。
- businessStructure: 報告セグメントは地域別の「日本」「北米」「中南米」「中国」「東南アジア」の5つであり、セグメント注記の外部顧客への売上高（2026年3月期: 日本108,559百万円、中南米103,744百万円、北米41,449百万円、中国8,999百万円、東南アジア6,256百万円）の大きい順に並べた。
- businessStructure: 報告セグメントの区分変更: 前連結会計年度にTachi-S Engineering Europe S.A.R.L.を清算して連結の範囲から除外したことに伴い、当連結会計年度より報告セグメントから「欧州」を除外している。前連結会計年度の数値も変更後の区分で表示されており、当期の記載と整合するため、needsReview には入れずここに記録する。
- businessStructure: 中国の広州泰李汽車座椅有限公司と襄陽東実李爾泰極愛思汽車座椅有限公司は、出資持分の一部譲渡により当連結会計年度に連結子会社から持分法適用関連会社に変更されている（【関係会社の状況】注8）。本登録は有報の【関係会社の状況】の現在の区分に従った。
- businessStructure: 商業施設の賃貸は【事業の内容】で日本区分の活動として記載されており、独立の報告セグメントではないため、独立の事業としては立てず日本の説明に含めた。
- history: 沿革は有報の【沿革】から主要な出来事に絞って取り上げた。年月と事象は表の行順で対応づけた。
- history: 1973年の資本参加については、有報が「その後、3社とも全保有株式を処分」と明記しているため、その旨を説明に併記した。
- industry: 主たる業界は automotive: 報告セグメントは地域別（日本・北米・中南米・中国・東南アジア）だが、いずれも自動車座席・座席部品の製造販売であり、売上のほぼ全額が自動車部品によるもの。商業施設の賃貸は日本区分内の小規模な活動で独立開示されないため、2つ目の業界は付けなかった。分類の不足はないため taxonomyGaps は空。
- relatedCompanies: 結んだ関連企業は5社（nissan、mitsubishi-motors、honda、toyota-boshoku、nissan-shatai、いずれも customer）。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: nissanの種別判断: 【セグメント情報】の主要な顧客は同社の子会社メキシコ日産自動車会社だが、【株式の保有状況】に日産自動車株式会社自身が得意先として保有目的とともに明記されているため、日産グループの中核会社として customer で結んだ（unipresの先例と同型）。
- relatedCompanies: toyota-boshoku・nissan-shataiの種別判断: 主要な顧客としての売上開示はないが、【株式の保有状況】の保有目的が相手固有に「得意先との取引をより円滑に進めるため」と明記され、関係の種類（得意先）が有報自身の言葉で示されているため customer とした。覆せるようここに記録する。
- relatedCompanies: hino-motors-7205（日野自動車）: 【株式の保有状況】に得意先として425,920株の保有と保有目的が明記されるが、候補の listing が「コードリストにない」ため結べない。
- relatedCompanies: foster-electric（フォスター電機）: 政策保有の目的は株式の相互保有による協力関係の維持にとどまり、具体的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: yorozu（ヨロズ）: 政策保有の目的は株式相互保有による情報交換と事業機会の創出で、具体的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱UFJフィナンシャル・グループ）、mizuho-financial-group（みずほフィナンシャルグループ）、resona-holdings（りそなホールディングス）、sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）: 政策保有の目的がいずれも金融取引の円滑化であり、規則により結ばない。
- relatedCompanies: trust（トラスト）: 候補の listing がコードリストになく結べない。なお日本マスタートラスト信託銀行（信託口）は大株主の筆頭（14.49％）だが信託口の純投資のため結ばない。
- relatedCompanies: en（エン）・aska（アスカ）・core（コア）・vision（ビジョン）・port（ポート）・career（キャリア）・tve（TVE）・base-4481（ベース）・seki（セキ）・zero（ゼロ）・lec（レック）・thinca（シンカ）・innovation（イノベーション）・cover（カバー）・path（パス）・rent（レント）・nissin（日新）: いずれも一般語・地名・略称の断片一致（「アグアスカリエンテス」「コーポレートビジョン」「TVE（中期経営計画名）」「トリムカバー」等）のみで、各社への言及はない。
- relatedCompanies: 候補にない相手の記録: 三桜工業株式会社は株式相互保有の政策保有先だが related-candidates.json に含まれないため結んでいない。株式会社三井住友銀行は大株主（2.17％、2026年3月31日現在）だが金融機関のため結ばない。タチエス取引先持株会は事業会社ではないため結ばない。
- terms: 登録候補（助言のみ）: トリムカバー（自動車座席の表皮材を縫製したカバー部品。同社の縫製子会社が製造）、シートフレーム（自動車座席の骨格となる金属部品）、一体発泡成形（ヘッドレストやアームレストなどを発泡成形で一体に作る技術）、スマートシェル（プライベート空間と没入感による新しい体験価値を提案するコンセプトモデル）。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、株式会社タチエス トーヨー グループホールディングスの株式取得が決議されている。2026年4月10日の取締役会で、株式会社TOYO H&Iが会社分割（吸収分割）により自動車用シート及び内装事業を承継させた同社（2026年4月22日設立）の全株式を取得し子会社化することを決議し、同日に株式譲渡契約を締結したが、株式譲渡の実行日は2026年8月3日（予定）で、有報提出日（2026年6月26日）時点では未実行である。本登録は2026年3月31日現在のグループ構成に基づいており、完了前の事項であるため、承認者の確認を求める。
- businessModel: 米国の連結子会社2社の合併が重要な後発事象として開示されている。TACHI-S Automotive Seating U.S.A., LLCを存続会社、TACHI-S Engineering U.S.A., Inc.を消滅会社とする吸収合併が企業結合日2026年3月31日で行われ、結合後の企業の名称はTACHI-S North America, LLCとなった。一方、【関係会社の状況】には合併前の2社の名称が記載されているため、本登録も有報の記載どおり2社で記録した。承認者の確認を求める。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
