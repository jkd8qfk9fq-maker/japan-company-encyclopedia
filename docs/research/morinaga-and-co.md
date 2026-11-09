# 森永製菓 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 森永製菓株式会社 |
| 証券コード | 2201 |
| docID（データを取り出した文書） | `S100YHJS` |
| 原本 docID | `S100YHJS` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHJS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 森永製菓株式会社 / 2201 / docID S100YHJS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 40 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
morinaga-and-co: 10 件の数値を有報XBRLと照合
有報: 森永製菓株式会社 有価証券報告書－第178期(2025/04/01－2026/03/31) (docID S100YHJS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
morinaga-and-co: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、人件費などの費用を差し引いた残りが利益になります。2026年3月期のは17…）

## エージェントの判断記録（fragment warnings）

- businessModel: ブートストラップの「遡及適用」警告について: 本文の遡及適用の記載は、2021年度の期初からの「収益認識に関する会計基準」等の適用に伴う2020年度以前の数値の遡及適用と、2024年１月１日実施の株式分割（１株につき２株）に伴う１株当たり指標の遡及適用であり、いずれも本登録の５年間の数値（2022年３月期から2026年３月期まで）の基準を変えるものではない。前期有報との修正再表示チェックは全行一致のため、financialNotesには入れず、ここに判断を記録した。株式分割は１株当たり情報のみに影響するためfinancialNotesにも入れていない。
- businessModel: 連結子会社の決算日統一は、５年間のうち当期の連結範囲の期間の取り方が変わる事実であるため、financialNotesに記録した。決算期そのものの変更や変則決算ではないためneedsReviewには入れていない。
- businessModel: 主要な顧客である三菱食品株式会社への販売高（24,900百万円）はセグメント注記の【関連情報】とMD&Aの販売実績に印字された売上高であるため、フローに記載した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高（2026年3月期）の大きい順とし、「その他」は有報が報告セグメントに含まれない区分と明記するため最後に置いた。
- businessStructure: 食料品製造の子区分と金額は、MD&Aの販売実績（セグメント間の取引を相殺消去したもの）による。子区分の合計は食料品製造セグメントの外部顧客への売上高225,167百万円と一致する。
- businessStructure: 設備と事業の対応は有報のセグメント欄どおりとし、提出会社の本社・各支店・各工場はいずれも食料品製造、研究所は食料品製造とその他にまたがるため特定の子区分には結びつけなかった。
- history: 沿革は年月と事象が一体で印字されており、崩れた表ではないため、印字どおりに対応づけた。
- history: 工場新設・閉鎖や販売会社の設立などの行（1921年塚口工場新設、1923年森永製品販売・森永キャンデーストア開店、1925年鶴見工場新設、1947年久留米工場建設、1987年小山新工場完成、2013年塚口工場閉鎖）と、合併・社名変更・分離の細かな行（1920年日本煉乳合併、1942年の各社合併、1943年森永食糧工業への改称、1954年売店部門の分離、1969年森永商事（旧）合併、1970年森永開発設立・1999年同社合併、1980年森永デザート設立、2001年エンゼルフードシステムズ設立・2004年同社株式譲渡、2010年森永食品（浙江）設立、2011年高崎森永設立、2013年森永キノインドネシア設立・2019年同社株式譲渡、2019年森永アジアパシフィック設立、2020年森永スナック食品合併）は、会社の姿を変える節目として採った行と重なるため省いた。資本金の金額は書いていない。
- history: 2026年のMyMo Holdco, Inc.取得は【沿革】末尾の注記と【重要な後発事象】に印字された期後の出来事で、完了済みとして印字されているため沿革に採り、本登録が2026年3月31日現在の構成に基づく旨を明記した（needsReviewにも記載）。
- industry: 主たる業界は、売上高の約95％を占める報告セグメント「食料品製造」が食品であることからfoodとした。
- industry: 「不動産及びサービス」は独立した報告セグメントだが、売上高は1,897百万円（全体の１％未満）で不動産賃貸とゴルフ場経営の複合区分であり、金額の内訳が独立して開示されていないため、real-estateは付けなかった。「食料卸売」も食品の卸売であり、独立した業界値は付けなかった。
- relatedCompanies: 関連企業の判定は特定投資株式の保有目的の記載に基づく。目的の末尾には全銘柄共通の定型文（「安定的な営業取引の維持・強化を目的として保有」）があるが、各銘柄について「食料品製造事業における得意先」など取引の内容と相手が個別に印字され、保有株式数も実質的な水準であるため、その記載のある相手をcustomerとして結んだ。取引の向き（得意先＝製品の販売先）が印字されているためcustomerとした。貸借対照表計上額は書いていない。
- relatedCompanies: morinaga-milk-industry: ブランド共有と営業取引の取組強化が保有目的で、取引の向きが特定できないためbusiness-partnerとした。大株主（1.63％、2026年3月31日現在）である事実と、退職給付信託を通じた保有は説明に併記した。
- relatedCompanies: kaneka: 取引の当事者は当社ではなく連結子会社の森永商事株式会社であるため、その旨を説明に明記した。
- relatedCompanies: mitsubishi-shokuhin: 主要な顧客（2026年3月期の販売高24,900百万円、全体の10.5％）だが、listingが「（コードリストにない）」ため結べない。事業モデルのフローには主要な顧客として記載した。
- relatedCompanies: itochu-shokuhin: 食料品製造事業における得意先として37,510株を保有するが、listingが「（コードリストにない）」ため結べない。
- relatedCompanies: バリーカレボー社（Barry Callebaut）: 【重要な契約等】にチョコレート原液の供給契約（2024年１月１日から2028年12月31日まで）が印字されているが、候補リストにない海外企業であるため結んでいない。
- relatedCompanies: mitsubishi-ufj-financial-group: 主要な取引金融機関として資金調達を中心とした金融取引を行うための保有であり、銀行・金融機関は資金調達が理由なら結ばない規則により対象外とした。
- relatedCompanies: mizuho-financial-group: 当事業年度に全株式を売却済み（みなし保有株式分も売却済み）のため結ばない。
- relatedCompanies: albis / blue-zones-holdings / h2o-retailing / tsuruha-holdings / okuwa: いずれも当事業年度に全株式を売却済みのため結ばない。
- relatedCompanies: 大株主の状況には、信託銀行・資産管理会社・相互会社である生命保険会社・従業員持株会・取引先持株会のほか森永乳業株式会社（business-partnerとして結んだ）が載るのみで、他に結ぶべき事業会社の大株主はいない。
- relatedCompanies: 連結子会社15社はいずれも非上場で候補リストになく、【関係会社の状況】に親会社・持分法適用関連会社・その他の関係会社の記載はない。
- relatedCompanies: career: 「プロティアン・キャリア」という考え方を表す一般語への一致で、株式会社キャリアへの言及はない。
- relatedCompanies: en: ambiguous。連結子会社「森永エンゼルデザート」等の社名の一部への一致で、エン株式会社への言及はない。
- relatedCompanies: land: 「ブランド」等の語の一部への一致で、株式会社ランドへの言及はない。
- relatedCompanies: vision: 企業理念の「ビジョン」という一般語への一致で、株式会社ビジョンへの言及はない。
- relatedCompanies: path: ambiguous。企業理念の「パーパス」の一部への一致で、パス株式会社への言及はない。
- relatedCompanies: core: ambiguous。「森永ココア」等の商品名の一部への一致で、株式会社コアへの言及はない。
- relatedCompanies: base-4481: 「現地通貨ベース」等の一般語への一致で、ベース株式会社への言及はない。
- relatedCompanies: port: 「事業ポートフォリオ」「サポート」等の一般語への一致で、ポート株式会社への言及はない。
- relatedCompanies: zero: ambiguous。「GHG排出量実質ゼロ」等の一般語への一致で、株式会社ゼロへの言及はない。
- relatedCompanies: friendly: listingが「（コードリストにない）」。「エイジフレンドリー」という一般語への一致でもある。
- relatedCompanies: innovation: 「イノベーション」という一般語への一致で、株式会社イノベーションへの言及はない。
- relatedCompanies: trust: listingが「（コードリストにない）」。「ゼロトラスト」等の一般語への一致でもある。
- relatedCompanies: tryt: listingが「（コードリストにない）」。「アセットライト」の一部への一致でもある。
- relatedCompanies: daiwa: ambiguous。連結子会社の所在地「神奈川県大和市」への一致で、株式会社大和への言及はない。
- relatedCompanies: king: 「ウォーキング」等の一般語の一部への一致で、株式会社キングへの言及はない。
- relatedCompanies: rent: 「マルチタレント」等の一般語の一部への一致で、株式会社レントへの言及はない。
- relatedCompanies: step: 「次ステップ」等の一般語への一致で、株式会社ステップへの言及はない。
- relatedCompanies: arata: 「あらためて」という一般語への一致で、株式会社あらたへの言及はない。
- relatedCompanies: freee: 「フリーキャッシュ・フロー」の一部への一致で、フリー株式会社への言及はない。
- relatedCompanies: nac: 「森永スナック食品」等の社名の一部への一致で、株式会社ナックへの言及はない。
- relatedCompanies: ricoh: 「リコール」という一般語への一致で、株式会社リコーへの言及はない。
- relatedCompanies: tein: 「プロテイン」の一部への一致で、株式会社テインへの言及はない。
- relatedCompanies: chino: 「パラチノース」という素材名の一部への一致で、株式会社チノーへの言及はない。
- relatedCompanies: como: ambiguous。「チョコモナカジャンボ」の一部への一致で、株式会社コモへの言及はない。
- relatedCompanies: corona: 「新型コロナウイルス感染症」への一致で、株式会社コロナへの言及はない。
- relatedCompanies: frontier: 「横浜サイエンスフロンティア高等学校」という学校名の一部への一致で、株式会社フロンティアへの言及はない。
- relatedCompanies: rhythm: 「アルゴリズム」等の一部への一致で、リズム株式会社への言及はない。
- relatedCompanies: seki: ambiguous。「セキュリティ」の一部への一致で、セキ株式会社への言及はない。
- relatedCompanies: shinpo: listingが「（コードリストにない）」。「シンポジウム」の一部への一致でもある。
- terms: 登録候補（助言のみ）: ハイチュウ（主力のキャンディブランド。海外では「HI-CHEW」の名称で販売）、ｉｎゼリー（ゼリー飲料の主力ブランド）、HI-CHEW（ハイチュウの海外ブランド名）、Chargel（米国で育成中のゼリー飲料ブランド）、バニラモナカジャンボ（冷菓の主力商品）、パセノール™（当社独自の素材）。

## 要確認（status に反映）

- businessModel: 2026年４月１日付で、The Mochi Ice Cream Company, LLCの全持分を間接的に保有するMyMo Holdco, Inc.の全株式を取得し、子会社化している（2026年３月６日の取締役会決議および同日付の株式譲渡契約の締結、【重要な後発事象】（取得による企業結合））。本登録は2026年３月31日現在のグループ構成に基づいており、米国事業の構成には同社を含んでいない。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
