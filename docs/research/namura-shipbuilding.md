# 名村造船所 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社名村造船所 |
| 証券コード | 7014 |
| docID（データを取り出した文書） | `S100YEFT` |
| 原本 docID | `S100YEFT` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEFT.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社名村造船所 / 7014 / docID S100YEFT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
namura-shipbuilding: 10 件の数値を有報XBRLと照合
有報: 株式会社名村造船所 有価証券報告書－第127期(2025/04/01－2026/03/31) (docID S100YEFT)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第125期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第124期(2022/04/01－2023/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
namura-shipbuilding: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみとし、営業利益・経常利益・セグメント利益・受注高・総資産・純資産の金額は書かなかった。地域別の内訳とLEPTA SHIPPINGへの売上高は売上高の内訳としてのみ書いた。
- businessModel: 前期の窓にある第124期・第125期の訂正有価証券報告書は、修正再表示チェックで重複年度の全行が一致したため、needsReviewには入れず本記録に留めた。
- businessModel: 中期経営計画の数値目標は本文に書かず、戦略の内容だけを書いた。
- businessModel: 日本基準（Japan GAAP）で一貫しており、決算期の変更・変則決算・修正再表示はない。会計基準の変更として、2025年3月期の期首からの「法人税、住民税及び事業税等に関する会計基準」等の適用をfinancialNotesに記録した。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」、重要な契約等も「該当事項はありません」だったため、提出後の予定事項はない。
- businessStructure: 事業の並び順は、報告セグメントを2026年3月期の外部顧客への売上高の大きい順（新造船事業125,643百万円→修繕船事業20,538百万円→その他事業6,575百万円→鉄構・機械事業6,279百万円）に並べた。
- businessStructure: 鉄構・機械事業のcustomersは、鋼製橋梁の発注者が国や地方自治体であることは印字されているが、舶用機械の販売先が特定されていないため書かなかった。
- businessStructure: 上場市場は表紙の印字（東京証券取引所スタンダード市場）どおりとした。
- history: 沿革の印字は年月と事象が連続した形だったが、年月の数と事象の数が一致し、順序どおり対応づけて使用した。
- history: 資本金の金額は書いていない。
- industry: 主たる業界は、売上高の大半を占める新造船事業（船舶の製造販売）からmachineryとした。重工業の造船を手がける三菱重工業・川崎重工業もmachineryを主たる業界としており、同じ扱いとした。
- industry: 修繕船事業は船舶の修繕で運輸サービスそのものではなく、金額が独立して開示されていない海運（船舶貸渡業）はその他事業の一部であるため、transportationは付けなかった。
- industry: 鉄構・機械事業の鉄鋼構造物（鋼製橋梁）は一事業で、金額が独立して開示されていないため、constructionは付けなかった。
- relatedCompanies: に載る子会社・関連会社はいずれも未上場で候補にないため結ばなかった。
- relatedCompanies: 川崎汽船・商船三井・日本郵船・NSユナイテッド海運・出光興産: 特定投資株式の開示に「船舶の建造等の取引」と個別に書かれているため、顧客として結んだ。計上額は書いていない。
- relatedCompanies: 三井E&S・日阪製作所・小池酸素工業・中北製作所・小野建: 特定投資株式の開示に「舶用エンジン／舶用機器／鋼材の調達等の取引」と個別に書かれているため、仕入先として結んだ。
- relatedCompanies: 三菱重工業: 特定投資株式の開示に同社グループの三菱重工マリンマシナリとの「舶用機器の調達等の取引」と書かれているため、仕入先として結んだ。
- relatedCompanies: ジャパンエンジン: 特定投資株式の開示に舶用低速エンジン分野での関係強化と高付加価値の商品開発の促進と書かれているため、取引の向きが印字されていないbusiness-partnerとして結んだ。
- relatedCompanies: 三菱商事・双日: 特定投資株式の開示に新造船商談の仲介等の取引と書かれているため、取引の向きが印字されていないbusiness-partnerとして結んだ。
- relatedCompanies: 日本製鉄・エア・ウォーター・大和工業: に載る事業会社であるためmajor-shareholderとして結んだ。日本製鉄とエア・ウォーターは特定投資株式の開示にも取引が書かれているため、説明に併記した。
- relatedCompanies: kimura-chemical-plants: 特定投資株式の開示に「今後の取引検討」とあるのみで、現に行われている取引が印字されていないため結ばなかった。
- relatedCompanies: the-bank-of-saga: 特定投資株式の表に載るが、借入等の銀行取引が理由の金融機関のため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の表に載るが、借入等の銀行取引が理由の金融機関のため結ばなかった。
- relatedCompanies: amada: 2018年10月のオリイメック全株譲渡は過去1回限りの取引のため結ばなかった。
- relatedCompanies: port: 「ポート」は「佐世保マリン・アンド・ポートサービス」の部分一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」は「非連続的なイノベーション」等の一般語の一致で、株式会社イノベーションについての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「ベース」は「営業利益ベース」等の断片一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: career: 「キャリア」は「キャリア構築」等の一般語の一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: mec: 「メック」は旧子会社「メックマシナリー株式会社」の名称の部分一致で、メック株式会社についての記載はないため結ばなかった。
- relatedCompanies: zero: 「ゼロ」は「ゼロエミッション船」等の一般語の一致で、株式会社ゼロについての記載はなく、ambiguousのため結ばなかった。
- relatedCompanies: seki: 断片一致で、セキ株式会社についての記載はなく、ambiguousのため結ばなかった。
- relatedCompanies: ray: 断片一致で、株式会社レイについての記載はなく、ambiguousのため結ばなかった。
- relatedCompanies: semba: 「船場」は住所「南船場」の部分一致で、株式会社船場についての記載はなく、ambiguousのため結ばなかった。
- relatedCompanies: trust: 断片一致で、株式会社トラストについての記載はなく、listingがコードリストにないため結ばなかった。
- relatedCompanies: will: 「ウィル」は「コンピュータウィルス」等の断片一致で、株式会社ウィルについての記載はないため結ばなかった。
- terms: 助言: 「ハンディ型撒積運搬船」は用語集の登録候補です。グループの主力商品で、MD&Aや有報の各所に現れる船型の呼称です。
- terms: 助言: 「ゼロエミッション船」は用語集の登録候補です。経営方針で2040年より前の建造比率100％体制の構築が目標とされている環境対応船の呼称です。
- terms: 助言: 「スマートファクトリー」は用語集の登録候補です。伊万里事業所の先進化プロジェクトなどで、生産活動の合理化と省力化設備の導入を指す言葉として使われています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 名村造船所の主たる業界 → 提案: shipbuilding（造船）。船舶の製造販売が中核事業だが、閉じた分類に造船の区分が無いため、最も近いmachineryを暫定とした。
