# 京成電鉄 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 京成電鉄株式会社 |
| 証券コード | 9009 |
| docID（データを取り出した文書） | `S100YL5Y` |
| 原本 docID | `S100YL5Y` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL5Y.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E4%BA%AC%E6%88%90%E9%9B%BB%E9%89%84

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 京成電鉄株式会社 / 9009 / docID S100YL5Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 40 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
keisei-electric-railway: 10 件の数値を有報XBRLと照合
有報: 京成電鉄株式会社 有価証券報告書－第183期(2025/04/01－2026/03/31) (docID S100YL5Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
keisei-electric-railway: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…貸物件の取得などの投資を進めながら、利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全項目一致（差異なし）。主要な経営指標等の注記にある2025年1月1日付の株式分割（1株につき3株）は1株当たり指標のみに影響し、売上高・純利益・総資産・純資産の系列には影響しないため financialNotes には入れていない。
- businessModel: セグメント区分の変更（運輸業と不動産業の間の資産移管、京成トラベルサービスの流通業への移管）は表示区分の組替えであり、前期のセグメント情報は移管後の区分で組み替えられている。5年間の数値系列には影響しないため financialNotes には入れていない。
- businessModel: 中期経営計画「D2プラン」の数値目標（営業収益・投資計画・ROE・配当性向など）は、規則により本文に書いていない。戦略は定性的にのみ記した。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」。重要な契約等は財務上の特約が付された金銭消費貸借契約と社債の発行のみで、資金調達に関する事項のため本文には入れていない。
- businessStructure: 事業の並び順は、セグメント情報の2026年3月期「外部顧客への営業収益」の大きい順（運輸業205,095百万円、流通業58,846百万円、不動産業31,259百万円、建設業18,093百万円、レジャー・サービス業13,860百万円、その他の事業5,269百万円）。「その他の事業」はセグメント情報で報告セグメントの一つとして開示されており、金額の小さい順位どおり最後に置いた。
- businessStructure: 運輸業と流通業の子区分の金額は、セグメント情報の「収益の分解情報」に印字された顧客との契約から生じる収益であり、その旨を各子区分の説明に明記した。不動産業の子区分（賃貸業・販売業・管理業）は外部収益の内訳が独立して開示されていないため金額を書いていない。
- businessStructure: セグメント情報の注記にある区分の変更（バス事業・タクシー事業の中間持株会社体制への移行に伴う運輸業と不動産業の間の資産移管、株式会社コミュニティー京成による京成トラベルサービス株式会社の吸収合併に伴うレジャー・サービス業から流通業への移管）は、当期に実施され前期のセグメント情報も移管後の区分で組み替えられており、翌期以降の予定事項ではないため needsReview には入れていない。
- businessStructure: MD&Aには、2026年4月1日に京成バス株式会社の吸収分割及び合併をもってバス事業の再編が完了した旨の記載があるが、【沿革】にも【重要な後発事象】（該当事項なし）にも載っていないため、本文には書かずここに記録する。
- history: 【沿革】の行のうち、1913年の柴又～金町間、1914年の江戸川～市川間、1915年の市川新田～中山間、1916年の中山～船橋間、1921年の船橋～千葉間、1926年の津田沼～成田花咲町間、1930年の成田花咲町～成田間、1932年のバス事業直営開始、1972年の北総開発鉄道（現・北総鉄道）設立、1979年の北総線北初富～小室間開通、1991年の北総線京成高砂～新鎌ヶ谷間開通、2004年の千葉ニュータウン鉄道による鉄道施設取得、2019年の京成タクシーホールディングス設立、2024年の京成電鉄茨城ホールディングス設立、2025年のタクシー事業再編（商号変更）は、区間の開通の細目や子会社の設立・再編の細目として落とした。
- history: 設立時の資本金（150万円）は、金額を書かない規則のため説明に含めていない。
- history: 1945年の項目の社名の由来は Wikipedia の補足（有報に記載がない事項）であり、出典を併記した。数値は Wikipedia から採っていない。
- industry: 主たる業界は、報告セグメントの外部顧客への営業収益が最大の運輸業（2026年3月期205,095百万円、全体の約6割）に基づき transportation とした。流通業（58,846百万円）、不動産業（31,259百万円）、建設業（18,093百万円）、レジャー・サービス業（13,860百万円）はそれぞれ独立して開示される報告セグメントのため、retail、real-estate、construction、entertainment を2つ目以降に付けた。「その他の事業」（鉄道車両・自動車の整備等、5,269百万円）には業界を付けていない。
- relatedCompanies: 結んだのは8社。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: shochiku: 候補が ambiguous（figures-only）のため慎重に検討したが、有報が正式名称「松竹株式会社」を印字し、映画と連携したイベント開催など相手固有の連携内容を述べているため business-partner として結んだ。
- relatedCompanies: oriental-land 以外の持分法適用関連会社3社と、北総鉄道株式会社（連結子会社、議決権57.1％）、関東鉄道株式会社（連結子会社、100.0％）などの関係会社は、いずれも未上場で候補にないため結んでいない。
- relatedCompanies: イオン株式会社: 【大株主の状況】に載る事業会社の大株主（2.14％、2026年3月31日現在）であり、特定投資株式の筆頭銘柄で、MD&Aには資本業務提携の第一弾として「イオンモール津田沼South」の開業も記載されているが、related-candidates.json に候補がないため、候補からのみ選ぶ規則により結んでいない（候補の aeon-mall はコードリストにない相手である）。
- relatedCompanies: toda: 特定投資株式の保有目的が、ナガワと同一文の「建設業での受注応対等のほか、共通する事業での取引・協力関係を維持強化するため」という定型句の範囲であり、相手固有の取引内容の記載がないため結ばない（この判断は覆しうるよう明記する）。
- relatedCompanies: nagawa: 特定投資株式の保有目的が、戸田建設と同一文の定型句のみのため結ばない。
- relatedCompanies: seibu-holdings: 特定投資株式の保有目的が、鉄道同業他社に共通する「運輸業での共同誘客のほか、共通する事業におけるノウハウ共有等」という同一の定型句であり、相手固有の取引の記載がないため結ばない。
- relatedCompanies: nankai: 特定投資株式の保有目的が、鉄道同業他社に共通する同一の定型句（共同誘客・ノウハウ共有）のため結ばない。
- relatedCompanies: tobu-railway: 特定投資株式の保有目的が、鉄道同業他社に共通する同一の定型句（共同誘客・ノウハウ共有）のため結ばない。
- relatedCompanies: tokyo-metro: 特定投資株式の保有目的が、鉄道同業他社に共通する同一の定型句（共同誘客・ノウハウ共有）のため結ばない。
- relatedCompanies: nishi-nippon-railroad: 特定投資株式の保有目的は、共同誘客・ノウハウ共有の定型句に不動産業等の共通する事業における収益拡大への言及を加えた範囲であり、相手固有の取引内容の記載がないため結ばない（この判断は覆しうるよう明記する）。
- relatedCompanies: ana-holdings: 特定投資株式の保有目的は「運輸業、レジャー業での共同誘客」「不動産業での建物賃貸借等」という事業区分の定型句の組み合わせであり、相手固有の取引内容の記載がないため結ばない（この判断は覆しうるよう明記する）。
- relatedCompanies: the-nippon-signal: 特定投資株式の保有目的が、京三製作所と同一文の「運輸業において、安全対策や旅客機器等の導入」という製品分野を添えた定型句であり、相手固有の取引内容の記載がないため結ばない（この判断は覆しうるよう明記する）。
- relatedCompanies: kyosan-electric-manufacturing: 特定投資株式の保有目的が、日本信号と同一文の製品分野を添えた定型句のため結ばない（この判断は覆しうるよう明記する）。
- relatedCompanies: seven-and-i-holdings: 特定投資株式の保有目的が「流通業・不動産業における取引・協力関係を維持強化するため」という事業区分のみの定型句のため結ばない。
- relatedCompanies: mitsubishi-estate: 特定投資株式の保有目的が「不動産業・運輸業における取引・協力関係を維持強化するため」という事業区分のみの定型句のため結ばない。
- relatedCompanies: the-chiba-bank: 特定投資株式に載るが、保有目的は「借入先金融機関との取引・協力関係」であり、金融機関との資金調達関係のため結ばない。
- relatedCompanies: mebuki-financial-group: 特定投資株式に載るが、保有目的は借入先金融機関との取引・協力関係のため結ばない。
- relatedCompanies: the-keiyo-bank: 特定投資株式に載るが、保有目的は借入先金融機関との取引・協力関係のため結ばない。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式に載るが、保有目的は借入先金融機関との取引・協力関係のため結ばない。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式に載るが、保有目的は借入先金融機関との取引・協力関係のため結ばない。
- relatedCompanies: mizuho-financial-group: 特定投資株式に載るが、保有目的は借入先金融機関との取引・協力関係のため結ばない。また【大株主の状況】の株式会社みずほ銀行（3.00％）も金融機関のため major-shareholder として結んでいない。
- relatedCompanies: tsukuba-bank: 連結子会社である関東鉄道の社債の保証先として現れるのみで、金融機関との資金調達関係のため結ばない。
- relatedCompanies: aeon-mall: MD&Aに「イオンモール津田沼South」の開業への言及はあるが、候補の listing がコードリストにない相手のため結ばない。
- relatedCompanies: mitsubishi-electric: 固定資産除却損の注記等に現れるのみで、取引・提携・資本関係についての相手固有の記載がないため結ばない。
- relatedCompanies: vision: 「ビジョン」は長期ビジョン等の一般語の一致のみで、株式会社ビジョンへの言及ではない。
- relatedCompanies: kohsoku: 「高速」は高速バスや成田空港高速鉄道株式会社（未上場の関連会社）等の名称の一致で、株式会社高速への言及ではない。
- relatedCompanies: core: 「コア」はコア事業等の一般語の一致のみ。
- relatedCompanies: port: 「ポート」は成田空港「エアポートシティ」構想等の語の断片一致のみ。
- relatedCompanies: step: 「ステップ」は中期経営計画の「第1ステップ」等の一般語の一致のみ。
- relatedCompanies: freee: 「フリー」はバリアフリー等の一般語の一致のみ。
- relatedCompanies: zero: 「ゼロ」は「CO2ゼロSTAY」等の一般語の一致で、株式会社ゼロへの言及ではない。
- relatedCompanies: career: 「キャリア」はキャリアパス等の一般語の一致のみ。
- relatedCompanies: corona: 「コロナ」はコロナ禍等の一般語の一致のみ。
- relatedCompanies: frontier: 有報の「フロンティア」は連結子会社の京成フロンティア企画株式会社であり、候補の株式会社フロンティアとは別の会社である。
- relatedCompanies: path: 「パス」はキャリアパス等の語の断片一致のみ。
- relatedCompanies: ray: 「レイ」はちばレインボーバス等の語の断片一致のみ。
- relatedCompanies: seki: 「セキ」は機密・セキュリティ等の語の断片一致のみ。
- relatedCompanies: ichigo: 「いちご」は京成バラ園芸のいちご狩り施設への言及で、いちご株式会社への言及ではない。
- relatedCompanies: 日本生命保険相互会社: 【大株主の状況】に2.69％で載るが、保険会社であり相互会社（未上場）のため結ばない。
- terms: 登録候補（助言のみ）: スカイライナー（上野・日暮里と成田空港を結ぶ京成電鉄の有料特急）、成田スカイアクセス（成田空港線の愛称で、都心と成田空港を結ぶアクセス路線）、サングランデ（京成電鉄が分譲する中高層住宅のブランド）、BMK（ベストマナー向上）推進運動（京成グループの接客向上の取組）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
