# 文化シヤッター — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 文化シヤッター株式会社 |
| 証券コード | 5930 |
| docID（データを取り出した文書） | `S100YBKB` |
| 原本 docID | `S100YBKB` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBKB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 文化シヤッター株式会社 / 5930 / docID S100YBKB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 31 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bunka-shutter: 10 件の数値を有報XBRLと照合
有報: 文化シヤッター株式会社 有価証券報告書－第80期(2025/04/01－2026/03/31) (docID S100YBKB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
bunka-shutter: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や人件費などの費用を差し引いた残りが利益になります。2026年3月期のは12…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…える化を最優先として、次世代に向けた利益創出の仕組みづくりと人材育成に取り組…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全６系列・全行で一致した。パックの「財務諸表の組替え」警告は、遮熱事業のセグメント区分変更（前年度分を変更後の区分で再表示）に由来すると判断し、数値系列自体の組替え・遡及修正ではないため、セグメント再編の事実のみをfinancialNotesに記録し、needsReviewには入れなかった。
- businessModel: 中期経営計画の目標数値のうち、営業利益・利益率・自己資本利益率・株価に関する目標は文章規則により引用しなかった（売上高目標のみ引用）。
- businessModel: 連結の重要な後発事象は「該当事項なし」、重要な契約等も「該当事項なし」。個別財務諸表の後発事象（連結子会社からの剰余金の配当受領）はグループ内の取引であり、登録内容に影響しないため記録のみとした。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。シャッター関連製品事業94,193百万円、建材関連製品事業93,511百万円、サービス事業32,596百万円、リフォーム事業6,940百万円、その他9,040百万円。「その他」は有報が報告セグメントに含まれない区分と明記しているため、金額にかかわらず最後に置いた。
- businessStructure: 各事業に子区分の金額は独立して開示されていないため、childrenは付けなかった。
- businessStructure: 主要な設備は、支店・工場の多くが複数セグメントにまたがる行として印字されているため、特定の事業に結びつけなかった（BX新生精機の工場はシャッター関連製品、文化シヤッターサービスの支店・本社はサービスと印字されている）。
- businessStructure: 2026年3月期の中間連結会計期間より、遮熱事業はサービス事業から「その他」へ区分変更されている（詳細はbusinessModelのfinancialNotesに記録）。
- businessStructure: 2025年４月１日付で、連結子会社のBX鐵矢株式会社・BX東北鐵矢株式会社はBXティアール株式会社に、BXケンセイ株式会社・BX文化パネル株式会社はBXルーテス株式会社に吸収合併された（期中のグループ内再編）。また、BX新生精機株式会社の子会社BX SHINSEI VIETNAM Co.,Ltd.は2026年１月30日に解散が決議され清算手続中である。いずれも期末時点の構造に不確実性を生じさせるものではないため、needsReviewではなくここに記録した。
- history: 沿革は年月と事象が一体で印字された表のため、そのまま行順で採用した（崩れた表ではない）。創業時の資本金等の金額は文章規則により省略した。
- history: 工場の設置・移転、ISO認証の取得、個別製品の発売開始など、構造に影響しない細目の行は省略した（1955年商号変更、1959年「テットー」発売は本文中で触れた）。
- history: 2025年の連結子会社の吸収合併は【沿革】ではなく【事業の内容】の注記に印字されているため、その節をlocatorとした。
- history: 2011年の志村ショッピングセンター譲渡、2013年のBX BUNKA TAIWAN Co.,Ltd.設立（2017年解散）などの行は、現在の事業構造に直結しないため採用しなかった。
- industry: 主たる業界は、シャッター・スチールドア等の建材の製造販売が中核であり、閉じた分類に金属製品・建材の値が無いため、最も近いconstructionを暫定の主たる業界とした（taxonomyGapsに記録）。
- industry: 不動産賃貸事業は「その他」の中に含まれ金額が独立して開示されていないため、real-estateは付けなかった。リフォーム・サービスも含め、報告セグメント単位で独立した業界値を追加する根拠はないため、業界は１つだけとした。
- relatedCompanies: fujisash（不二サッシ）は【関係会社の状況】の持分法適用関連会社の区分どおりaffiliateとした。EUROWINDOW, JSC.（持分法適用関連会社、議決権29.8％）と文化シヤッター秋田販売株式会社・文化シヤッター高岡販売株式会社（関連会社）は候補リストに無いため結べなかった。
- relatedCompanies: 特定投資株式の保有目的が銘柄ごとに取引内容を印字しているもの（三井物産・佐藤商事の鋼材の調達取引、各住宅・不動産会社等のシャッター関連製品及び建材関連製品等の取引）は、株式数も相応の規模であるため結んだ。取引の向きが印字されていないものはbusiness-partnerとし、向きが印字されている調達取引のみsupplierとした。
- relatedCompanies: yodoko（ヨドコウ）は取引が印字されているためbusiness-partnerとし、大株主である事実（2.36％、2026年3月31日現在）は説明文に併記した。
- relatedCompanies: en: 「エンゲージメント」等の普通名詞の断片一致（ambiguous）のみで、株式会社エンとの取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: career: 「キャリアパス」「キャリア（スキル）マップ」等の語への一致のみで、株式会社キャリアとの関係の記載がないため結ばなかった。
- relatedCompanies: tear: 一致は連結子会社BXティアール株式会社であり、株式会社ティアとは無関係のため結ばなかった。
- relatedCompanies: land: 一致は「クイーンズランド州」等の地名の断片のみで、株式会社ランドとの関係の記載がないため結ばなかった。
- relatedCompanies: base-4481: 「時価ベース」等の語への一致のみで、ベース株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: ishin: リスク記述中の文言への断片一致のみで、株式会社イシンとの関係の記載がないため結ばなかった。
- relatedCompanies: king: 「ワーキンググループ」等の語の断片一致のみで、株式会社キングとの関係の記載がないため結ばなかった。
- relatedCompanies: port: 「サポート」等の語の断片一致のみで、株式会社ポートとの関係の記載がないため結ばなかった。
- relatedCompanies: vision: 「ビジョン」等の普通名詞への一致のみで、株式会社ビジョンとの関係の記載がないため結ばなかった。
- relatedCompanies: path: 「キャリアパス」の断片一致（ambiguous）のみで、株式会社パスとの関係の記載がないため結ばなかった。
- relatedCompanies: zero: 残存価額ゼロ等の語への断片一致（ambiguous）のみで、株式会社ゼロとの関係の記載がないため結ばなかった。
- relatedCompanies: core: 「コア」等の語への断片一致（ambiguous）のみで、株式会社コアとの関係の記載がないため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」の普通名詞への一致のみで、同社との関係の記載がないため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」の断片一致のみで、株式会社レックとの関係の記載がないため結ばなかった。
- relatedCompanies: vector: 「ベクトル」等の語への断片一致のみで、株式会社ベクトルとの関係の記載がないため結ばなかった。
- relatedCompanies: corona: 新型コロナウイルス感染症の文脈への一致のみで、株式会社コロナとの関係の記載がないため結ばなかった。
- relatedCompanies: idea-consultants: 有報本文に株式会社いであとの取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: kohsoku: 「高速シートシャッター」という製品名への断片一致（ambiguous）のみで、株式会社高速との関係の記載がないため結ばなかった。
- relatedCompanies: nagawa: 特定投資株式は200株のみの象徴的な保有であり、みなし保有株式111,700株は信託株式に係る議決権の行使のための保有で取引関係を示すものではないため結ばなかった。
- relatedCompanies: airport-facilities: 特定投資株式は1,331株・計上額１百万円と象徴的な保有にとどまり、取引関係の実質が読み取れないため結ばなかった。
- relatedCompanies: loginet-japan: 特定投資株式は当事業年度に全て売却され、現在は保有していないため結ばなかった。
- relatedCompanies: mizuho-financial-group: 保有目的は株式会社みずほ銀行との資金借入取引等の銀行取引であり、資金調達を理由とする銀行は結ばない規則により対象外とした。大株主の状況に載る株式会社みずほ銀行（3.58％）も銀行であり、対象外とした。
- relatedCompanies: sumitomo-mitsui-trust-group: 保有目的は三井住友信託銀行株式会社との資金借入取引等の銀行取引であり、同様に対象外とした。
- relatedCompanies: semba: 有報本文に株式会社船場との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: seki: 「セキュリティーズ」等の語への断片一致（ambiguous）のみで、株式会社セキとの関係の記載がないため結ばなかった。
- relatedCompanies: freee: 普通名詞への断片一致のみで、freee株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: nippon-kinzoku: 一致は「日本金属製造情報通信労働組合」という労働組合の名称であり、日本金属株式会社とは無関係のため結ばなかった。
- relatedCompanies: 第一生命ホールディングスは特定投資株式に載るが、保有目的が第一生命保険株式会社との保険取引であり、かつ候補リストに無いため結ばなかった。大株主の第一生命保険株式会社（3.92％）も保険会社であり対象外とした。
- terms: 登録候補（助言のみ）: 高速シートシャッター「エア・キーパー大間迅」（シートシャッターの主力製品）、セレカード（カード式無線装置）、BxVA（当社独自の付加価値指標＝NOPAT－資本コスト額）、ライフイン環境防災研究所（栃木県小山市の試験・検証施設）、止水事業（ゲリラ豪雨等への浸水防止用設備の事業）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 文化シヤッターの主たる業界 → 提案: 金属製品（建材）。東証の業種区分は金属製品であり、シャッター・スチールドア等の金属製建材の製造販売が売上の大半を占めるが、閉じた分類に金属製品・建材の区分が無いため。
