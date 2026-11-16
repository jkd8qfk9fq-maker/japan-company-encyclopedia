# ジェイエスエス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジェイエスエス |
| 証券コード | 6074 |
| docID（データを取り出した文書） | `S100YGXC` |
| 原本 docID | `S100YGXC` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGXC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジェイエスエス / 6074 / docID S100YGXC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jss: 4 件の数値を有報XBRLと照合
有報: 株式会社ジェイエスエス 有価証券報告書－第51期(2025/04/01－2026/03/31) (docID S100YGXC)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
すべて一致しました。
jss: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aの利益の金額や増減理由は本文に書かなかった。本文の財務数値は売上高と親会社株主に帰属する当期純利益だけである。
- businessModel: 経営指標等の注記のうち、潜在株式が存在しない旨と第50期の自己資本利益率の計算方法は表示事項のため financialNotes に入れなかった。連結開始の注記のみを financialNotes に記録した。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されており、needsReview に入れる事項はない。
- businessModel: Wikipediaの冒頭は、略称JSSの由来（旧称ジャパンスイミングサービス）が有報の沿革でも確認できる内容であり、プール本体等の設計・施工は有報に印字がないため、補足として使わなかった。
- businessStructure: 単一セグメントのため、子区分は【事業の内容】の売上種類別とし、金額はMD&Aの販売実績（売上種類別）の大きい順とした。各区分の百万円への切り捨て後の合計は8,539百万円で、印字の合計8,541百万円とは切り捨ての差がある。スイミングスクール運営収入の内訳（直営6,711・受託759・企画課外447）の切り捨て後合計は7,917百万円で、印字の小計7,918百万円と1百万円異なる。いずれも印字の値をそのまま用いた。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。個別の仕入先は有報に印字されていない。
- businessStructure: 主要な設備は売上種類別に記載されており、子区分のうち商品売上・その他の営業収入への対応付けは印字されていないため、事業単位までの対応付けにとどめた。帳簿価額は書かない。
- businessStructure: 日本テレビホールディングス株式会社との関係は relatedCompanies に記録した。
- history: 設立時の資本金額は沿革に書かなかった（金額は有報の印字どおりだが、規則により資本金額は沿革に書かない）。
- history: 落とした行：2006年の本店移転、2010年の子会社株式会社リプルの清算、2013年の東京証券取引所と大阪証券取引所の統合に伴う東京証券取引所ＪＡＳＤＡＱ（スタンダード）への移行、2015年の東京事務所の開設。
- history: 沿革の本文は年月と事象が対で印字されており、行順の対応づけは不要だった。
- industry: 主たる業界は entertainment（暫定）とした。単一セグメントであり、売上種類別の区分は報告セグメントではないため、副次の業界は付けなかった。
- relatedCompanies: nippon-television-holdings: 【関係会社の状況】にその他の関係会社として印字され、議決権の被所有割合24.84％と業務・資本提携が印字されているため other-affiliated-company として結んだ。
- relatedCompanies: ezaki-glico: 【大株主の状況】に事業会社として9.22％の保有が印字されているため major-shareholder として結んだ。有報に取引・提携の印字はない。
- relatedCompanies: sojitz: 沿革の1990年の合弁相手（株式会社トーメン、現双日株式会社）だが、合弁子会社リプルは2010年に清算されており、過去の一過性の関係のため結ばない（ambiguousでもある）。
- relatedCompanies: port: 設備欄の施設名「パルポート太田」の部分一致であり、ポート株式会社への言及ではない。結ばない。
- relatedCompanies: corona: 「コロナ禍」の一般語の部分一致のみ。結ばない。
- relatedCompanies: freee: 「フリー会員」の一般語の部分一致のみ。結ばない。
- relatedCompanies: densan: 費用科目「電算費」の部分一致のみ（ambiguous）。結ばない。
- relatedCompanies: land: 「ブランド」の部分一致のみで、株式会社ランドへの言及はない。結ばない。
- relatedCompanies: medley: 競技種目「個人メドレー」の部分一致のみ。結ばない。
- relatedCompanies: zero: イベント名「水難事故を０（ゼロ）に」の部分一致のみ（ambiguous）。結ばない。
- relatedCompanies: 株式会社ティップネス: 日本テレビホールディングスの100％子会社で協業相手として印字されているが、related-candidates.json に無いため結ばない。
- relatedCompanies: 上田八木短資株式会社: 大株主だが金融機関の純投資であり、候補にも無いため結ばない。
- relatedCompanies: 連結子会社である株式会社ワカヤマアスレティックスは自社の子会社のため関連企業には含めない。
- relatedCompanies: 株式の保有状況では、純投資目的以外の投資株式は非上場株式2銘柄のみで、特定投資株式の開示はないため、政策保有による関連付けは行わなかった。
- terms: 助言のみ。用語の追加提案：受託運営（施設を所有する事業者から、スタッフを常駐させてスクールの運営業務を受託する形態）、水泳授業受託（学校の水泳授業を民間事業者が受託して指導する形態）、着衣水泳（衣服を着たまま水に入る体験を通じて水難事故への対処法を学ぶ訓練）、水中健康運動（水の物理的特性を生かして行う健康づくりのための水中運動）。本文中の事業説明に基づく。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] jssの主たる業界（スイミングスクール運営事業） → 提案: スポーツクラブ・スイミングスクール運営。売上高の全てを占めるスイミングスクール運営事業は、スイミングスクールを中心とする会員制スポーツクラブの運営ですが、閉じた分類にスポーツクラブやスイミングスクールを表す区分がなく、レジャー・スポーツ施設の運営として最も近い entertainment を暫定としました。
