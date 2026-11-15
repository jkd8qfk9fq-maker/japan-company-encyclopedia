# 中広 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社中広 |
| 証券コード | 2139 |
| docID（データを取り出した文書） | `S100YHNL` |
| 原本 docID | `S100YHNL` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHNL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社中広 / 2139 / docID S100YHNL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
chuco: 10 件の数値を有報XBRLと照合
有報: 株式会社中広 有価証券報告書－第48期(2025/04/01－2026/03/31) (docID S100YHNL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
chuco: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社 中広」が EDINET の提出者名「株式会社中広」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記は千円の印字を百万円に切り捨てた（切上げはしていない）。売上高12,153,429千円は12,153百万円、親会社株主に帰属する当期純利益188,319千円は188百万円とした。
- businessModel: suppliers はこのツリーのスキーマに無いため businessModel には書かなかった。仕入実績はメディア広告事業で開示されているが、特定の仕入先名の開示はない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません。」であり、後発事項はない。
- businessModel: 当期に株式会社広済堂ホールディングスの連結子会社からの吸収分割で設立された株式会社中広ワークインの株式を取得して連結子会社化した（2025年7月）。期末の構造に反映済みのため needsReview には入れず、沿革と本文に記録した。
- businessModel: MD&Aに印字された売上総利益率や営業利益率などの比率と金額は、本文の数値規則により本文と戦略には書かなかった。
- businessStructure: 単一セグメント（メディア広告事業）のため事業は1つとし、収益認識関係の分解情報（自社メディア広告、セールスプロモーション等、その他）を children とした。
- businessStructure: 金額は千円の印字を百万円に切り捨てた（切上げはしていない）。分解区分の合計12,152百万円（切り捨て後）と連結売上高12,153百万円との差は切り捨てによるものである。
- businessStructure: 連結子会社は株式会社中広メディアソリューションズ、株式会社中広ワークイン、株式会社ケイ・クリエイト、株式会社関西ぱど、株式会社ケイピーエスの5社で、いずれもメディア広告事業を営む自社グループ会社であるため children には含めなかった。持分法適用関連会社1社は名称の印字がないため記載しなかった。
- history: 沿革のうち支局・編集室の開設や移転などの細目は主要なもの以外を省略した。
- history: 設立時の資本金など資本の金額は沿革の本文には書かなかった。
- history: 株式会社中広ワークインの子会社化は2025年7月に完了し、期末の関係会社の状況にも連結子会社として載っているため、後発の予定事項ではなく沿革の出来事として扱った。
- industry: 主たる業界は、フリーマガジンなどの自社メディアと広告事業を営むメディア広告事業（単一セグメント）から media とした。
- industry: 求人メディアも含まれるが単一セグメントのメディア広告事業の一部であるため、human-resources は付けなかった。合う値が無い区分は無く、taxonomyGapsは無い。
- relatedCompanies: chiikishinbunsha（地域新聞社）と saylor-advertising（セーラー広告）は特定投資株式に載るが、保有目的は両社とも「同業種であり、今後の戦略的取引関係を構築することを期待して継続保有」と同一の定型的な文言であり、個別の取引の事実が印字されていないため結ばなかった。
- relatedCompanies: juroku-financial-group（十六フィナンシャルグループ）は特定投資株式に載るが、保有理由は関係会社が取引先かつ取引金融機関であることと取引関係の維持・財務活動の円滑化であり、金融機関との資金調達・取引関係を理由とする保有のため結ばなかった。
- relatedCompanies: t-and-d-holdings（T＆Dホールディングス）は特定投資株式に載るが、保有理由は関係会社が取引先であることと取引関係の維持・強化であり、保険会社の関係会社との取引を理由とする保有のため結ばなかった。
- relatedCompanies: kosaido-holdings（広済堂ホールディングス）は、当期に同社の連結子会社からの吸収分割で設立された株式会社中広ワークインの株式取得の相手方グループであるが、これは一回限りの事業取得の経緯であり、継続的な取引・提携の印字はないため関連企業としては結ばず、沿革と businessModel の warnings に事実を記録した。
- relatedCompanies: freee（フリー）はフリーマガジンの語の一部、land（ランド）はブランド等の語の一部、career（キャリア）はキャリア教育等の一般語、create（クリエイト）は連結子会社である株式会社ケイ・クリエイトの名称の一部、port（ポート）はサポート等の語の一部、rent（レント）はタレントクリップの語の一部、slogan（スローガン）は今期のスローガンの一般語、cover（カバー）はカバー率の一般語、lec（レック）は支局名の一部であり、いずれも各社との取引・提携・資本関係の記述はないため結ばなかった。seki、ray、nissin、shinpo は曖昧またはコードリストにない相手で、関係の根拠もないため結ばなかった。
- relatedCompanies: 大株主の有限会社オリベ興産（33.30％）などは候補（掲載済み企業）に無いため結ばなかった。中広従業員持株会は自社の従業員持株会であり関連企業としては結ばなかった。
- terms: 用語の候補として、ハッピーメディア（同社のフリーマガジンのブランド）、フリモ（クーポンアプリ）、VC契約（ボランタリー・チェーン契約）、ハイブリッド広告（紙媒体とデジタルを組み合わせた広告）を挙げる。助言のみで、用語データは作成していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
