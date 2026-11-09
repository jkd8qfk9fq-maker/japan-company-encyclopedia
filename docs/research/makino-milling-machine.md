# 牧野フライス製作所 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　牧野フライス製作所 |
| 証券コード | 6135 |
| docID（データを取り出した文書） | `S100YEQK` |
| 原本 docID | `S100YEQK` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEQK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　牧野フライス製作所 / 6135 / docID S100YEQK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
makino-milling-machine: 10 件の数値を有報XBRLと照合
有報: 株式会社　牧野フライス製作所 有価証券報告書－第87期(2025/04/01－2026/03/31) (docID S100YEQK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
makino-milling-machine: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社牧野フライス製作所」が EDINET の提出者名「株式会社　牧野フライス製作所」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…サービスの費用などを差し引いた残りが利益になります。2026年3月期のは20…）

## エージェントの判断記録（fragment warnings）

- businessModel: 会計基準はJapan GAAPで5年間一貫している。前期有報との修正再表示チェックは全項目一致し、決算期変更・変則決算はないため financialNotes は空にした。
- businessModel: MMホールディングスによる公開買付けは、当期の損益に与える影響はないと有報に記載されており、金額には触れていない。事実関係は needsReview に記録した。
- businessModel: 受注実績には文章で触れていない（金額を書かない規則のため）。
- businessModel: セグメント利益・経常利益などの金額は文章の規則により一切記載していない。
- businessStructure: 報告セグメントは有報で「Ⅰ・Ⅱ・Ⅲ・Ⅳ」とだけ呼ばれ固有の名称がないため、担当会社と主な地域から「アジア（セグメントⅡ）」などの名称を付けた。並び順は2026年3月期の外部顧客への売上高の大きい順（Ⅱ 121,426百万円 → Ⅲ 75,123百万円 → Ⅰ 46,668百万円 → Ⅳ 17,966百万円）。
- businessStructure: セグメントⅠの主な地域には中国が、セグメントⅡの主な地域にも中国が含まれる。有報のセグメント概要の印字どおりに記載した（担当するグループ会社が異なる）。
- businessStructure: 製品及びサービスごとの情報は、単一の製品・サービスの区分が連結売上高の90％を超えるため有報で記載が省略されており、区分ごとの金額は開示されていない。そのため children は設けず、製品は【事業の内容】と沿革に印字された範囲で products に挙げた。
- businessStructure: セグメント利益は規則により記載していない。
- history: 沿革の各行には年月が印字されており、崩れた表ではないため行順の対応づけは不要だった。
- history: 2019年2月の中国現地法人の設立行は、有報で社名が空欄のため採用しなかった。
- history: 1958年には2件の開発（一番タレット形立フライス盤Kシリーズ、数値制御立フライス盤）が印字されているが、代表的な数値制御立フライス盤のみを採用した。その他の製品開発の細目は、代表的なものに絞って割愛した（1966年・2020年など）。
- history: 改組時などの資本金の金額は、文章の規則（資本金の金額を書かない）により記載していない。
- history: Wikipediaの補足は使わなかった（有報で足りるため）。出典は有報のみ。
- industry: 主たる業界は machinery（機械）とした。工作機械の製造販売が事業の全体を占め、報告セグメントは地域別のみで、独立した金額が開示された第二の事業はない。
- industry: 半導体は付けなかった。半導体製造装置関連は顧客の分野としてMD&Aの受注動向に現れるだけで、自社の事業として開示されていないため。
- relatedCompanies: 結んだ相手はいずれも【株式の保有状況】の特定投資株式に、相手ごとの保有目的（部品の生産者、販売代理店、工場建設の主要な取引先）と実株式数が印字されている相手。計上額は説明に書いていない。
- relatedCompanies: SMCとダイフクも同じく「部品の生産者であり、且つユーザ」と印字されているが、候補リスト（related-candidates.json）にないため結んでいない。
- relatedCompanies: 大株主の状況（2026年3月31日現在）に載るのは信託銀行（信託口）、海外の保管機関、公益財団法人工作機械技術振興財団、証券会社と個人のみで、関係区分や大株主に当たる事業会社がないため major-shareholder は結んでいない。
- relatedCompanies: base-4481: 「連結ベース」という語の一致のみで、同社への言及はないため結ばなかった。
- relatedCompanies: career: 人材方針の「キャリア形成」という語の一致のみで、同社への言及はないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 保有目的は資金調達及び金融・保険取引に関する主要な取引先であり、金融取引が理由のため結ばなかった。
- relatedCompanies: sompo-holdings: 保有目的は資金調達及び金融・保険取引に関する主要な取引先であり、保険取引が理由のため結ばなかった。
- relatedCompanies: belc: 関係会社の状況の MAKINO Europe GmbH の記載に含まれる語の一致で、スーパーマーケットのベルクへの言及はないため結ばなかった。
- relatedCompanies: core: 役員報酬の「業績スコア」等の文中の語の一致（ambiguous）で、同社への言及はないため結ばなかった。
- relatedCompanies: kohsoku: 沿革の「高速大型5軸マシニングセンタ」という語の一致（ambiguous）で、同社への言及はないため結ばなかった。
- relatedCompanies: scroll: 製品の「スクロール加工パッケージ」という語の一致で、同社への言及はないため結ばなかった。
- relatedCompanies: trust: コードリストにない相手で、一致箇所は日本マスタートラスト信託銀行（信託口）の記載であり、結ばなかった。
- relatedCompanies: zero: サステナビリティ方針の「排出実質ゼロ」という語の一致（ambiguous）で、同社への言及はないため結ばなかった。
- relatedCompanies: aida-engineering: 保有目的は、金型市場において密接な関係を有する製品メーカーとの情報収集・情報交換であり、仕入・販売・提携などの取引は印字されていないため結ばなかった。
- relatedCompanies: ikuyo: 保有目的は「当社製品のユーザであるため」という定型文のみで、相手固有の取引内容の記載がないため結ばなかった。
- relatedCompanies: koito-manufacturing: 保有目的は「当社製品のユーザであるため」という定型文のみで、相手固有の取引内容の記載がないため結ばなかった。
- relatedCompanies: lec: 沿革の「レブロンド社」「レブロンド・マキノ」という語の一致で、同社への言及はないため結ばなかった。
- relatedCompanies: ns-tool: 保有目的は「当社製品のユーザであるため」という定型文のみで、相手固有の取引内容の記載がないため結ばなかった。
- relatedCompanies: seki: 大量保有報告書の注記にある NOMURA SECURITIES の記載の一致（ambiguous）で、同社への言及はないため結ばなかった。
- relatedCompanies: tokai-carbon: 保有目的は「当社製品のユーザであるため」という定型文のみで、相手固有の取引内容の記載がないため結ばなかった。
- terms: 登録候補（助言のみ）: マシニングセンタ（工具を自動で交換しながら、フライス加工や穴あけなどを1台で行う工作機械。牧野フライス製作所の主力製品）、数値制御（NC。数値で指令して機械の動きを自動制御する方式）、放電加工機（電気の放電で金属を溶かして加工する工作機械。金型の加工などに使われる）、フライス盤（回転する刃物で金属を削る工作機械）、5軸制御（工具や材料を5つの方向に動かして複雑な形を加工する方式）。

## 要確認（status に反映）

- businessModel: MMホールディングス株式会社による公開買付け： 2025年6月3日開催の取締役会で、本公開買付けが開始された場合には賛同の意見を表明し、株主に応募を推奨する旨を決議し、同日付で公開買付契約を締結した。その後、外為法に基づくクリアランスについて、公開買付者が財務大臣及び経済産業大臣から2026年4月22日付で株式取得を中止することの勧告を受領し、必要な許認可を取得できないことが確実になったため、2026年4月30日付で公開買付契約を合意解約し、公開買付けは不実施となった。有報の【重要な契約等】と【重要な後発事象】に開示済みで、当期の損益に与える影響はないとされている。エントリーは2026年3月31日現在の構造で作成した。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
