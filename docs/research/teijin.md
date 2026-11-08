# 帝人 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 帝人株式会社 |
| 証券コード | 3401 |
| docID（データを取り出した文書） | `S100YCMK` |
| 原本 docID | `S100YCMK` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCMK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 帝人株式会社 / 3401 / docID S100YCMK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 44 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 6 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
teijin: 10 件の数値を有報XBRLと照合
有報: 帝人株式会社 有価証券報告書－第160期(2025/04/01－2026/03/31) (docID S100YCMK)
前期有報との比較: 36 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益（△は損失） / 親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△））。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 非継続事業・財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
teijin: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…付加価値の高い素材とサービスで利益を生む…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…など、付加価値の高い製品とサービスで利益を生んでいます。2026年3月期は、…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…では、①顧客起点型ビジネスでの確かな利益成長、②構造改革による質の高い収益基…）

## エージェントの判断記録（fragment warnings）

- businessModel: revenue / netIncome の候補が2件ずつあったため、現在の会計基準であるIFRSの系列（売上収益 / 親会社の所有者に帰属する当期利益（△は損失））を採用した。日本基準の系列（売上高 / 親会社株主に帰属する当期純利益又は当期純損失）は旧基準の比較表示。
- businessModel: 前期有報との修正再表示チェックは全項目一致（パックの restatementCheck で差異なし）。
- businessModel: デュポン帝人アドバンスドペーパー（株）とDuPont Teijin Advanced Papers (Asia) Limitedの全株式は、2025年8月29日の株式譲渡契約に基づき2026年4月1日にDuPontへ譲渡が完了している（後発事象・重要な契約等に開示済み）。相手先が related-candidates に含まれないため関連企業には結んでいない。
- businessModel: 2026年度の業績予想や中期経営計画の目標値（事業利益など）は将来予想のため本文には書かず、戦略は perspectives の disclosed にとどめた。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上収益（2026年3月期）の大きい順（繊維・製品350,068百万円、マテリアル338,579百万円、ヘルスケア138,558百万円、その他45,986百万円）。「その他」は有報が報告セグメントに含まれないと明記する区分のため最後に置いた。
- businessStructure: マテリアルの children は【事業の内容】の区分（高機能材料事業・複合成形材料事業）に、製品及びサービスに関する情報の外部顧客への売上収益（高機能材料268,527百万円、複合成形材料70,051百万円）を対応させた。2つの合計338,578百万円とセグメントの外部収益338,579百万円との1百万円の差は有報の丸め。
- businessStructure: 2026年4月1日付で組織再編が実施され、翌連結会計年度から報告セグメントが「アパレル＆インダストリーズ」「ヘルスケア＆ライフソリューションズ」「エレクトロニクス＆エナジー」「スペシャリティマテリアルズ」の4区分に変更されることが後発事象に開示されている（当期の金額を新区分で組み替えた情報も開示済み）。エントリーの事業構成は当期（2026年3月期）の開示区分に従った。
- businessStructure: listings の market は表紙の印字「東京証券取引所プライム市場」から「プライム」とした。
- businessStructure: Wikipedia の抜粋は本店所在地や持株会社といった有報と重なる内容のみで、有報にない補足事実が乏しかったため出典として使わなかった。
- history: 【沿革】の表は年月セルと事象文が分かれて崩れており、第1表は年月46件に対して事象文が50件、第2表は年月11件に対して事象文が12件と一致しない。規則に従い、行順の対応が裏付けられる行だけを使った（表の先頭行同士の対応、1958年テトロン・1962年社名変更・1987年テクノーラ・2000年東邦レーヨン資本参加という表内の対応が通説的事実と一致する区間、2022年のプライム市場移行は市場再編の日付、2024年のインフォコム譲渡は非継続事業の注記、2025年のTAT譲渡はMD&Aの「2025年7月1日に株式譲渡完了」の記載で裏付け）。
- history: 落とした主な行: 帝人製機（株）の設立、帝人化成（株）の設立、ポリカーボネート樹脂の生産開始、トワロン事業の買収、東邦テナックス（株）の完全子会社化、フェブリク錠の販売開始、帝人化成（株）の吸収合併、ポリエステルフィルム事業の買収と譲渡、武田薬品工業からの販売権取得、Axcelead Tokyo West Partnersの設立など（年月との対応が一意に定まらないため）。
- history: 2025年のTAT譲渡は完了日（2025年7月1日）をMD&Aで裏付けたうえで記載した。
- industry: 主たる業界は、マテリアル（アラミド繊維・樹脂・炭素繊維）と繊維・製品（ポリエステル繊維等）で売上の大半を占めることから chemicals とした。
- industry: ヘルスケアは医薬品・医療機器の製造・販売と在宅医療サービスを行う報告セグメントとして独立開示があるため、2つ目に pharmaceuticals を付けた。
- relatedCompanies: mizuno（美津濃）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: nisshinbo-holdings（日清紡ホールディングス）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: osaka-soda（ダイソー）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: the-japan-wool-textile（日本毛織）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: stanley-electric（スタンレー電気）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: koito-manufacturing（小糸製作所）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: asahi-kagaku-kogyo（旭化成とは別の会社）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。旭化成アドバンスの親会社である旭化成とは別の会社。
- relatedCompanies: miraial（ミライアル）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: muto-seiko（ムトー精工）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: teikoku-sen-i（帝国繊維）: 特定投資株式の集計表に名前が載るだけで、関係の実態の記載がないため結ばない。
- relatedCompanies: jichodo（自重堂）: 特定投資株式の集計表に名前が載るだけで、関係の実態の記載がないため結ばない。
- relatedCompanies: kitabo（北日本紡績、ambiguous）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: mitsuboshi-belting（三ツ星ベルト）: 特定投資株式の表（提出時点の注記）への一致のみのため結ばない。
- relatedCompanies: globeride（グローブライド）: 特定投資株式の表に載るだけで、保有目的は定型句（取引関係の維持・強化）のみのため結ばない。
- relatedCompanies: resonac-holdings（レゾナック・ホールディングス）: 特定投資株式の表（退職給付信託への拠出分）に載るだけで、関係の実態の記載がないため結ばない。
- relatedCompanies: bridgestone（ブリヂストン）: 研究開発活動に協創事例（ソーラーカーレース用タイヤへの素材採用）が紹介されるだけで、提携・取引関係の明示がないため結ばない。
- relatedCompanies: iyogin-holdings（いよぎんホールディングス）: 特定投資株式の表に載る金融機関で、保有目的は資金調達等金融取引のため結ばない。
- relatedCompanies: the-shiga-bank（滋賀銀行）: 特定投資株式の表に載る金融機関で、保有目的は資金調達等金融取引のため結ばない。
- relatedCompanies: the-ogaki-kyoritsu-bank（大垣共立銀行）: 特定投資株式の表に載る金融機関で、保有目的は資金調達等金融取引のため結ばない。
- relatedCompanies: takeda-pharmaceutical（武田薬品工業）: 2021年の2型糖尿病治療剤の販売権取得という1回限りの過去の取引が沿革にあるだけで、現在の関係の記載がないため結ばない。
- relatedCompanies: nabtesco（ナブテスコ）: 2003年の帝人製機との経営統合という沿革上の出来事のみで、現在の関係の記載がないため結ばない。
- relatedCompanies: 大株主は信託銀行・保管機関等の信託口と日本生命保険相互会社（3.65％）、社員持株会であり、いずれも純投資・事務上の名義のため結ばなかった。
- relatedCompanies: frontier（株式会社フロンティア）: 帝人グループの中核子会社「帝人フロンティア」の名称への一致で、別の会社。
- relatedCompanies: the-lead（株式会社リード）: 帝人ファーマの合弁会社「アクセリード」の名称への部分一致で、別の会社。
- relatedCompanies: port: 「事業ポートフォリオ」等の一般語への一致のみ。
- relatedCompanies: vision: 「長期ビジョン」等の一般語への一致のみ。
- relatedCompanies: base（ベース）: 「連結ベース」等の一般語への一致のみ。
- relatedCompanies: innovation（イノベーション）: 「イノベーション創出」等の一般語への一致のみ。
- relatedCompanies: aeon（イオン）: 「リチウムイオン」への部分一致で、イオン株式会社ではない。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）の名称への部分一致で、純投資の信託口。
- relatedCompanies: path（ambiguous）: 医薬品名「ヨビパス」等への一致のみ。
- relatedCompanies: career: 「キャリア形成」等の一般語への一致のみ。
- relatedCompanies: core（ambiguous）: 一般語への一致のみ。
- relatedCompanies: land: 「IPランドスケープ」等の一般語への一致のみ。
- relatedCompanies: step: 「5ステップアプローチ」等の一般語への一致のみ。
- relatedCompanies: como（ambiguous）: 本店所在地「霞が関コモンゲート」への一致のみ。
- relatedCompanies: freee（フリー）: 「フリー・キャッシュ・フロー」への一致のみ。
- relatedCompanies: zero（ambiguous）: 「ネットゼロ」等の一般語への一致のみ。
- relatedCompanies: cover: 「カバーする」等の一般語への一致のみ。
- relatedCompanies: oro（ambiguous）: 一般語への一致のみ。
- relatedCompanies: seki（ambiguous）: 一般語への一致のみ。
- relatedCompanies: ray（ambiguous）: 一般語への一致のみ。
- relatedCompanies: space: 「エアロスペース」への部分一致のみ。
- relatedCompanies: nissin: ambiguous で、候補リストに証券コード表記がない。新株予約権の記載への一致のみのため結ばない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 助言: 「トワロン」は用語集に未登録です。帝人グループのパラ系アラミド繊維の商標で、有報には耐熱性・耐薬品性や防弾・防護用途の説明があり、高機能材料事業の主力製品として繰り返し登場します。
- terms: 助言: 「テクノーラ」も未登録です。帝人が1987年に生産を開始したパラ系アラミド繊維の商標で、有報の沿革と研究開発活動に登場します。
- terms: 助言: 「コーネックス」も未登録です。帝人のメタ系アラミド繊維の商標で、消防服などの耐熱素材として有報に説明があります。
- terms: 助言: 「テトロン」も未登録です。1958年に生産を開始したポリエステル繊維の商標で、繊維・製品事業の出発点となった製品です。
- terms: 助言: 「スリアワセ」「クミアワセ」も未登録です。中期経営計画2026-2028で、顧客起点型ビジネスの特徴として有報に定義と説明があります（自社の素材に限らず最適な解決手段を組み合わせる考え方）。
- terms: discontinued-operations、absorption-merger、tender-offer、subsidiary、consolidated-subsidiary は登録済みのため、新規登録は不要です。

## 要確認（status に反映）

- businessModel: businessStructure: 帝人フロンティアと旭化成アドバンスの経営統合 — 2025年12月1日に基本契約を締結済みだが、統合の効力発生日は2026年10月1日の予定（関係当局からの許認可等を前提）で、有報提出時点では未実施。統合後は帝人フロンティアが存続会社となり、当社80％・旭化成20％の共同出資会社となり、商号はTAフロンティア株式会社に変更される予定。エントリーの記載は2026年3月31日現在のもので、統合を完了とは書いていない。
- relatedCompanies: 関連企業: 旭化成との帝人フロンティア・旭化成アドバンス経営統合 — 2025年12月1日に基本契約を締結済みだが、効力発生日は2026年10月1日の予定（関係当局からの許認可等を前提）で、有報提出時点では未実施。統合後、帝人フロンティアは当社80％・旭化成20％の共同出資会社（商号はTAフロンティア株式会社に変更予定）となる。エントリーの記載は予定として書いており、完了とは書いていない。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 繊維・製品事業 → 提案: textiles。最大の報告セグメントである繊維・製品事業（ポリエステル繊維・織物・繊維製品）に合う値が閉じた分類にない。素材の製造が中心のため chemicals を暫定としたが、繊維を表す区分があると正確になる。
