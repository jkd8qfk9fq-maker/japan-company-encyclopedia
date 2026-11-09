# 日本航空電子工業 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本航空電子工業株式会社 |
| 証券コード | 6807 |
| docID（データを取り出した文書） | `S100YF73` |
| 原本 docID | `S100YF73` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF73.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本航空電子工業株式会社 / 6807 / docID S100YF73（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 4 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
japan-aviation-electronics-industry: 10 件の数値を有報XBRLと照合
有報: 日本航空電子工業株式会社 有価証券報告書－第96期(2025/04/01－2026/03/31) (docID S100YF73)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
japan-aviation-electronics-industry: 本文の金額 20 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] relatedCompanies[2].description: 売上高と当期純利益以外の利益に触れていないか確認する（…販売店です。事業戦略、取引関係の相互利益維持・強化のため、当社は同社の株式7…）
- 確認: [other-profit-wording] relatedCompanies[3].description: 売上高と当期純利益以外の利益に触れていないか確認する（…販売店です。事業戦略、取引関係の相互利益維持・強化のため、当社は同社の株式1…）
- 確認: [other-profit-wording] relatedCompanies[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…販売店です。事業戦略、取引関係の相互利益維持・強化のため、当社は同社の株式7…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの「財務諸表の組替え」の注意は、連結経営指標等の注記にある法人税等会計基準（企業会計基準第27号、2022年改正）の遡及適用に対応し、financialNotesに記録した。前期有報との修正再表示チェックは全行一致しており、5年間の数値系列そのものに組替えの影響はない。
- businessModel: 中期経営計画（2026～2028年度）の数値目標のうち売上高2,600億円のみを引用し、営業利益180億円・ROE8％の目標は文章の規則により書いていない。
- businessModel: 従業員数は前期の10,154人から11,908人へ増えているが、増加の理由は有報に印字されていないため、理由は書いていない。
- businessModel: 当期純利益の減少理由は、MD&Aの記載に基づき原材料価格の急騰と新製品立上げコスト、投資有価証券評価損の計上を定性的に記した（金額は書いていない）。
- businessModel: 京セラとの資本業務提携（2025年10月30日契約締結）は当期中の事項であり、期後の予定事項ではないためneedsReviewには入れなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした（コネクタ事業199,205百万円→航機事業20,474百万円→インターフェース・ソリューション事業7,691百万円→その他501百万円）。「その他」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: 各事業のchildrenはセグメント注記の収益分解情報（市場別）の金額を用いた。コネクタ事業のchildrenの合計199,203百万円はセグメント売上高199,205百万円と2百万円異なるが、有報の印字どおり引用した（有報の丸め）。航機事業・インターフェース・ソリューション事業のchildrenの合計は各セグメントの売上高と一致する。
- businessStructure: 2027年3月期よりインターフェース・ソリューション事業をコネクタ事業へ統合する報告セグメントの変更が【事業の内容】に印字されている。本エントリーは2026年3月期の区分に基づく（businessModel工程のneedsReviewに記録）。
- businessStructure: 設備は、昭島事業所が全セグメントにまたがるため特定の事業に結びつけなかった。国内子会社の設備はセグメント欄どおり（弘前航空電子・山形航空電子・富士航空電子・盟友技研はコネクタ事業、信州航空電子は航機事業、ニッコー・ロジスティクスはその他）で、生産を担う子会社名を各事業の説明に記した。
- history: 【沿革】は年月と事象がインラインで対応づいて印字されており、年単位で採用した。
- history: 落とした行：1954年の川崎工場設置（航空機用電子機器の修理・オーバーホール開始）、1975年の株式会社富士工業の株式100％取得、1977年のゼット・マーケティング・カンパニー（現・JAE Electronics,Inc.）設立、1986年の信州航空電子設立、1987年の八紘電業（現・JAE八紘）の株式60％取得、1988年の山形航空電子への商号変更と富士航空電子の分離設立・JAE Oregon,Inc.設立、1991年のニッコー・ロジスティクス設立、1994年〜2003年の海外子会社設立（JAE Hong Kong Ltd.、JAE Singapore Pte Ltd.、JAE Korea,Inc.、JAE Philippines,Inc.、JAE Europe,Ltd.、JAE Wuxi Co.,Ltd.、JAE Wujiang Co., Ltd.、JAE Shanghai Co., Ltd.）、2003年のJAE八紘の完全子会社化、2004年のニッコー・ロジスティクスの完全子会社化、2010年のJAE Tijuana, S.A. de C.V.設立、2012年の盟友技研の完全子会社化。
- history: 商業登記上の設立日は合併会社（旧・株式会社四国鋼材工業所）の1950年11月28日だが、【沿革】の注記に基づき、事実上の存続会社である日本航空電子工業の設立（1953年1月）を採用した。
- history: 資本金額は文章の規則により書いていない。Wikipediaは、創業の経緯等の補足が有報の記載と重なるため使用しなかった。
- industry: 主たる業界はelectronicsとした：東証の業種区分は電気機器で、コネクタ事業が売上高の約9割を占める電子部品メーカーであるため。
- industry: semiconductorsを2つ目に付けた：航機事業が半導体製造装置向け制振・駆動用機器を製品として開示しているため（執筆指示の半導体向け部材・部品・装置の条項）。
- industry: automotiveは付けなかった：自動車は用途別の市場区分として開示されているが報告セグメントではなく、顧客の業界であるため。
- relatedCompanies: kyocera（京セラ）: 【関係会社の状況】の区分どおりother-affiliated-companyとした。資本業務提携の内容は【重要な契約等】に、製品の供給は【関係会社の状況】に印字されている。
- relatedCompanies: sanshin-electronics（三信電気）: 【セグメント情報】の主要な顧客ごとの情報に売上高が印字されており、販売の向きが明確なためcustomerとした。特定投資株式には含まれない（当社は同社株式を保有していない）。
- relatedCompanies: 住友商事・カナデン・立花エレテックは「販売店」、東海旅客鉄道・西日本旅客鉄道は「重要顧客」と保有目的が銘柄ごとに印字され、株式数も実質的な水準のためcustomerとした。計上額は書いていない。
- relatedCompanies: nec（日本電気）: 京セラとの資本業務提携の文脈でのみ登場し、2025年10月30日付で京セラとの間に株式譲渡契約を締結し、保有していた当社株式22,232,269株を京セラへ譲渡した相手である。【関係会社の状況】に記載がなく、当社との現在の取引・提携の印字がないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group（三井住友トラストグループ）: 主要金融機関であり、保有目的が資金借入や株式関係事務委託等の金融取引のため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development（住友不動産）・ryoyo-ryosan-holdings（リョーサン菱洋ホールディングス）・kyosan-electric-manufacturing（京三製作所）: 当事業年度の株式数が「―」（保有していない）ため結ばなかった。
- relatedCompanies: hagiwara-electric-holdings（萩原電気ホールディングス）: コネクタ事業における販売店と印字があるが、候補のlistingが（コードリストにない）ため結べなかった。
- relatedCompanies: japan-airlines（日本航空）: 一致は当社自身の社名「日本航空電子工業」の一部であり、日本航空株式会社への言及ではないため結ばなかった。
- relatedCompanies: nikko（ニッコー）: 一致は連結子会社のニッコー・ロジスティクス株式会社であり、ニッコー株式会社（5343）ではないため結ばなかった。
- relatedCompanies: port（ポート）: 一致は「ポートフォリオ変革」の断片であり、ポート株式会社への言及はないため結ばなかった。
- relatedCompanies: en（エン）: 一致は一般語の断片であり、エン株式会社への言及はないため結ばなかった（ambiguousな候補）。
- relatedCompanies: career（キャリア）: 一致は「キャリア形成」の語であり、株式会社キャリアへの言及はないため結ばなかった。
- relatedCompanies: seki（セキ）: 一致は「セキュリティ」の断片であり、セキ株式会社への言及はないため結ばなかった（ambiguousな候補）。
- relatedCompanies: base-4481（ベース）: 一致は「連結ベース」の語であり、ベース株式会社への言及はないため結ばなかった。
- relatedCompanies: kohsoku（高速）: 一致は「高速伝送化」の語であり、株式会社高速への言及はないため結ばなかった（ambiguousな候補）。
- relatedCompanies: ray（レイ）: 一致は「パワートレイン」の断片であり、株式会社レイへの言及はないため結ばなかった（ambiguousな候補）。
- relatedCompanies: lec（レック）: 一致は「フレックスタイム」の断片であり、レック株式会社への言及はないため結ばなかった。
- relatedCompanies: the-lead（リード）: 一致は「リードタイム」の語であり、株式会社リードへの言及はないため結ばなかった。
- relatedCompanies: cover（カバー）: 一致はデバイスを保護するカバーの一般語であり、カバー株式会社への言及はないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 一致はグローバルスローガンの「イノベーション実現」の語であり、株式会社イノベーションへの言及はないため結ばなかった。
- relatedCompanies: nissin（日新）: 候補のlistingが（コードリストにない）ため結べない。一致は新株予約権の記載中の断片であり、株式会社日新への言及はない（ambiguousな候補）。
- relatedCompanies: slogan（スローガン）: 一致は「グローバルスローガン」の語であり、スローガン株式会社への言及はないため結ばなかった。
- relatedCompanies: applied-technology（応用技術）: 一致は「基礎・応用技術の研究開発」の一般語であり、応用技術株式会社への言及はないため結ばなかった。
- relatedCompanies: core（コア）: 一致は京セラの事業内容「コアコンポーネント」の断片であり、株式会社コアへの言及はないため結ばなかった（ambiguousな候補）。
- relatedCompanies: freee（フリー）: 一致は「フリー・キャッシュ・フロー」の語であり、フリー株式会社への言及はないため結ばなかった。
- relatedCompanies: will（ウィル）: 一致は「コンピュータ・ウィルス」の断片であり、株式会社ウィルへの言及はないため結ばなかった。
- relatedCompanies: zero（ゼロ）: 一致は接点技術の名称「wearzerO（ウェアゼロ）」であり、株式会社ゼロへの言及はないため結ばなかった（ambiguousな候補）。
- relatedCompanies: zett（ゼット）: 一致は【沿革】のゼット・マーケティング・カンパニー（現・JAE Electronics,Inc.、当社の連結子会社）の名称であり、ゼット株式会社ではないため結ばなかった。
- relatedCompanies: 候補にない相手の記録： 航機事業の産機・インフラ分野で当連結会計年度に株式を取得したTooltronix社は候補一覧にない。連結子会社27社・関連会社2社はすべて候補にない（未上場）。大株主のうち事業会社は京セラのみで、他は信託銀行・保管機関・証券会社である。
- terms: 登録候補（助言のみ）: コネクタ（電子機器同士を電気的に接続する部品）、慣性航法装置（加速度や角速度を測って自機の位置や姿勢を求める装置）、静電タッチパネル（指の静電気の変化で触れた位置を検出する入力パネル）、ADAS（先進運転支援システム）、電波高度計（電波の反射で地表からの高度を測る装置）、特定投資株式（純投資目的以外で保有する上場株式）。

## 要確認（status に反映）

- businessModel: 2027年3月期より、インターフェース・ソリューション事業をコネクタ事業へ統合する報告セグメントの変更を行う旨が有報【事業の内容】及び【経営方針、経営環境及び対処すべき課題等】に記載されている。本エントリーの事業構成は2026年3月期の報告セグメントに基づいて記載したため、次期以降の区分との差異を確認されたい。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
