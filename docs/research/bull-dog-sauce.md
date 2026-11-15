# ブルドックソース — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ブルドックソース株式会社 |
| 証券コード | 2804 |
| docID（データを取り出した文書） | `S100YGZB` |
| 原本 docID | `S100YGZB` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGZB.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%96%E3%83%AB%E3%83%89%E3%83%83%E3%82%AF%E3%82%BD%E3%83%BC%E3%82%B9

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ブルドックソース株式会社 / 2804 / docID S100YGZB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bull-dog-sauce: 10 件の数値を有報XBRLと照合
有報: ブルドックソース株式会社 有価証券報告書－第101期(2025/04/01－2026/03/31) (docID S100YGZB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
bull-dog-sauce: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 出典「wikipedia」はどこからも引用されていません

## エージェントの判断記録（fragment warnings）

- businessModel: 経営成績の分析に印字された段階利益（営業利益・経常利益）の金額と増減率、旧鳩ケ谷工場跡地売却に伴う固定資産売却益や投資有価証券売却益の金額は、本文の財務数値を売上高と当期純利益に限る規則により書かなかった。当期純利益が前期から大きく増えた理由にも触れていない。
- businessModel: 主要な経営指標等の注記は、潜在株式が存在しないため調整後1株当たり当期純利益を記載していない旨のみで、決算期や会計基準の変更に当たる年次の注記がないため、financialNotes は空とした。
- businessModel: 重要な後発事象として印字された2026年4月24日取締役会決議の自己株式取得（株主還元方針に基づくもの）は資本政策の事項のため、本文には書かずここに記録する。取得期間は2026年5月18日から2027年3月19日までの予定である。
- businessModel: 政策保有株式の売却や自己株式の取得を進めている旨は経営成績の分析に印字されているが、金額を伴う資本政策・保有資産の話のため本文には書かなかった。
- businessModel: 社名の日本語表記は「ブルドッグ」ではなく「ブルドック」が正式である旨は Wikipedia の補足であり、有報の表記どおり「ブルドックソース」で統一した。
- businessStructure: 報告セグメントはソース類の製造販売事業の単一セグメントで、セグメント情報と製品及びサービスごとの情報はいずれも記載が省略されているため、事業の子区分は経営成績の分析に印字された販売区分（家庭用ソース、業務用ソース、家庭用ドレッシング・たれ等、家庭用その他、輸出、現地法人（上海））を使い、金額は同表の印字値（百万円）を大きい順に並べた。
- businessStructure: このツリーの旧スキーマに従い suppliers は付けなかった。個別の仕入先名は【事業の内容】に印字されておらず、原材料は野菜や香辛料、酢などが経営方針に挙げられているのみである。
- businessStructure: 主要な設備では、本社ビルと研究所R&Dラボはセグメント名が「―」で事業に結びつかないため、事業の説明には生産設備であるTATEBAYASHIクリエイションセンターとイカリソース西宮工場だけを結びつけた。
- businessStructure: イカリソース株式会社の主要な損益情報等（売上高など）は【関係会社の状況】に印字されているが、子会社の財務数値は本文に書かない規則のため、事業の説明には書かなかった。
- history: 沿革は年月と事象が一体で印字されており、対応づけの推測は不要だった。
- history: 1976年の本社社屋新築、2015年の鳩ヶ谷工場・館林工場のFSSC22000認証取得、2016年の監査等委員会設置会社への移行、2018年の委任型執行役員制度導入、2021年の任意の指名報酬委員会設置とブルドックグループSDGs宣言制定は、事業の転機ではないため沿革に入れず、ここに記録する。
- history: 資本金の金額は沿革に書かない規則のため、設立・合併いずれの項目にも金額は書いていない。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、連結売上高のすべてを占めるソース類の製造販売事業（単一セグメント）に基づいて food とした。金額が独立して開示された他の事業がないため、追加の業界は付けなかった。
- relatedCompanies: mitsubishi-shokuhin（三菱食品株式会社）: 主要な顧客ごとの情報に販売先として印字されているが、候補情報でコードリストにない（上場を確認できない）相手のため結ばなかった。販売先である事実は businessModel に記録した。
- relatedCompanies: itochu-shokuhin（伊藤忠食品株式会社）: 特定投資株式の表に販売先としての保有が印字されているが、コードリストにない相手のため結ばなかった。
- relatedCompanies: 候補にない相手: 国分グループ本社は主要な顧客ごとの情報に販売先として印字されているが、非上場で候補にないため結ばなかった。興和株式会社（5.64％）と養命酒製造株式会社（2.92％）は大株主の事業会社だが候補にないため結ばなかった。日本マスタートラスト信託銀行（信託口）、日本生命保険相互会社、株式会社福岡銀行、株式会社あいち銀行は金融機関・信託口の純投資のため結ばなかった。
- relatedCompanies: 特定投資株式の保有先で、保有目的が「販売先として取引関係をより強化するため」等の定型句のみで本文に個別の取引の記載がない相手は結ばなかった: arcs（アークス）、hagoromo-foods（はごろもフーズ）、mammy-mart-holding（マミーマートホールディングス）、maruichi（マルイチ産商）、ootoya-holdings（大戸屋ホールディングス）、seven-and-i-holdings（セブン＆アイ・ホールディングス）、toyo-suisan-kaisha（東洋水産）、yamae-group-holdings（ヤマエグループホールディングス）。
- relatedCompanies: 特定投資株式の保有先で、保有目的が「仕入先として取引関係をより強化するため」等の定型句のみの相手は結ばなかった: rengo（レンゴー）、semba-tohka-industries（仙波糖化工業）、shoei-foods（正栄食品工業）。
- relatedCompanies: 特定投資株式の保有先で、保有目的が定型句のみの相手は結ばなかった: mitsuuroko-group-holdings（ミツウロコグループホールディングス）、ohmura-shigyo（大村紙業）。
- relatedCompanies: hazama-ando（安藤・間）、sakata-seed（サカタのタネ）、nitto-kohki（日東工器）: 特定投資株式の表に売却予定や協議の記載があり、保有目的も定型句のみのため結ばなかった。
- relatedCompanies: san-ju-san-financial-group（三十三フィナンシャルグループ）、aichi-financial-group（あいちフィナンシャルグループ）、fukuoka-financial-group（ふくおかフィナンシャルグループ）、sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）: 金融機関で、金融関連取引・資金調達の関係のため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguous で、「セキュリティ」などの一般語の部分一致のみのため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 経営方針の「長期ビジョン」の一般語のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「ブランド」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: en（エン株式会社）: ambiguous で、「エンゲージメント」の部分一致のみのため結ばなかった。
- relatedCompanies: rent（株式会社レント）: 「リカレント教育」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: step（株式会社ステップ）: 人材育成の「ステップ」の一般語のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: ambiguous で、「廃棄ゼロ」などの一般語の文脈のみのため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: 「日本マスタートラスト信託銀行」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: no-1（株式会社No．1）: 「ソースメーカーNo.1」の一般語のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: ricoh（株式会社リコー）: 「リコール」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: amuse（株式会社アミューズ）: 「アミューズメントショップ」の一般語のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 「コロナ禍」の文脈のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「サポート」の部分一致のみで、同社についての記載はないため結ばなかった。
- relatedCompanies: slogan（株式会社スローガン）: 「企業スローガン」の一般語のみで、同社についての記載はないため結ばなかった。
- terms: 提案する用語候補は次のとおりです（用語集への登録は提案のみで、ここでは登録していません）。
- terms: TATEBAYASHIクリエイションセンター（TCC）：群馬県館林市の旧館林工場を再構築した、生産と商品に関わる機能を集約する旗艦拠点の同社の呼称。
- terms: BGI 2032：同社グループの長期ビジョンの名称。「Sauce」を極める世界ブランドへの成長を掲げています。
- terms: ブルドック：社名の日本語表記は「ブルドッグ」ではなく「ブルドック」が正式で、創業者が濁音の続く語感を避けて名付けたとされています（Wikipedia の補足情報）。
- terms: ＆ブルドック：同社のドレッシングのブランド名。定番のラインナップと「素材を味わうドレッシングプレミアム」があります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
