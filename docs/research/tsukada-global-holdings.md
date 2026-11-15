# ツカダ・グローバルホールディング — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ツカダ・グローバルホールディング |
| 証券コード | 2418 |
| docID（データを取り出した文書） | `S100XTC0` |
| 原本 docID | `S100XTC0` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTC0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ツカダ・グローバルホールディング / 2418 / docID S100XTC0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tsukada-global-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ツカダ・グローバルホールディング 有価証券報告書－第31期(2025/01/01－2025/12/31) (docID S100XTC0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tsukada-global-holdings: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益は経営指標等およびMD&Aの印字（百万円）どおりに記載した。セグメント別の金額はセグメント注記の外部顧客への売上高を用いた（MD&Aのセグメント別売上高も外部顧客への売上高と同額である）。
- businessModel: 【関係会社の状況】に載る連結子会社の主要な損益情報等（㈱ベストブライダルの売上高28,784百万円、㈱ベストホスピタリティーネットワークの売上高20,144百万円）は単体の数値であるため、本文の金額には用いなかった。
- businessModel: 証拠パックの「本文に財務諸表の組替え・遡及適用の記載がある」との注意について、抽出された注記本文からは5年間の主要な経営指標等に影響する組替えは確認できず、修正再表示チェックも前期有報と全行一致したため、当該事項はfinancialNotesに記載しなかった。経営指標等の注記にある収益認識基準の第28期期首からの適用のみをfinancialNotesに記載した。
- businessModel: Victory Hotel Dunhill HN Investors LLC及びその子会社2社の出資持分の追加取得（2025年6月）は当連結会計年度中に完了し、2025年12月31日現在の構成に反映されているため、needsReviewには入れなかった。MD&Aが述べる段階取得に係る差益、負ののれん発生益、投資有価証券評価損の金額と、特別利益・特別損失という表現は本文には書かなかった。
- businessModel: 【経営方針】の基本方針のうち第4の正式名称は「利益率向上」であるが、利益率という表現を本文で使うことを避けるため、本文では「経営の合理化と業務効率の向上」として要約し、正式名称はこの警告に記録した。
- businessModel: wikipedia.jsonはfound=falseであったため、出典には加えなかった。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2025年12月期：婚礼事業38,800百万円、ホテル事業31,345百万円、Ｗ＆Ｒ事業2,949百万円）の大きい順とした。3セグメントの合計は連結売上高73,095百万円と一致する。
- businessStructure: ㈱ベストホスピタリティーネットワークは婚礼事業とホテル事業の双方を担うが、【事業の内容】の記載順に従い婚礼事業の子として置き、ホテル運営の役割も説明に記した。
- businessStructure: 【事業の内容】(4) 全社(共通)に載るEcpark Pte.Ltd.、TSUKADA GLOBAL ASIA PTE.LTD.、TGU LLC、HNRB QOZBⅡ,LPは子会社の経営管理等を行う会社で、いずれのセグメントにも属さないため、businessesには含めなかった。
- history: 【沿革】には資本金の金額が載っておらず、創業・子会社設立時の資本金額は書いていない。
- history: 個別のゲストハウスの開業（白金、横浜、大阪、仙台、星ヶ丘、新浦安、大宮、青山、市ヶ谷、心斎橋、鴨川、赤坂、伊勢山等）や本店移転の各行は、同種の出来事が多数に上るため、初のゲストハウス開業を除き省略した。子会社の設立・合併の細かな行（株式会社ア・リリアーレ、株式会社ライフクリエートバンク、グロリアブライダルジャパンの株式取得等）も省略し、事業の転機となる行を残した。
- history: Victory Hotel Dunhill HN Investors LLC等の出資持分の追加取得は当連結会計年度中の出来事であり、2025年12月31日現在の構成に反映されているため、needsReviewには入れず沿革に記録した。
- industry: 婚礼事業（2025年12月期の外部顧客への売上高38,800百万円）とホテル事業（同31,345百万円）が事業の中心で、閉じた分類に婚礼・宿泊に当たる区分が無いため、ホテル運営会社の先例（agora-hospitality-group、abhotel、kyoritsu-maintenance）に揃えて主たる業界を「entertainment」（暫定）とした。Ｗ＆Ｒ事業はリフレクソロジー・温浴・フィットネスで同じ対人サービスの事業であり、第二の業界は付けなかった。
- relatedCompanies: related-candidates.jsonの候補11件（career、ray、ricoh、base-4481、port、vision、insight、king、land、path、seki）はいずれも一般語・部分一致による一致であり（例：careerは「キャリア開発」、rayは施設名「ホアカレイ」、ricohは「ノンリコース債務」、portは施設名「ポートサイドヴィラ」、kingは「ランキング」、landは「デスティネーション」、pathは「パスワード」、sekiは「セキュリティ」）、有報が取引・提携・資本関係を述べる相手ではないため、すべて関連企業としなかった。
- relatedCompanies: ホテル事業で運営する「ホテル インターコンチネンタル 東京ベイ」「キンプトン　新宿東京」等はブランド名であり、ブランドの保有者は候補にも無く、有報に上場会社との提携関係の記載も無いため、関連企業としなかった。
- relatedCompanies: 子会社30社及び関連会社1社は当社グループの会社であるため、関連企業には含めなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ツカダ・グローバルホールディングの主たる業界 → 提案: bridal-and-lodging（婚礼・宿泊）。事業の中心は結婚式場の運営と挙式・披露宴の施行を行う婚礼事業と、ホテルにおける婚礼・宴会・宿泊サービスの提供であり、閉じた分類に婚礼・宿泊に当たる区分が無い。ホテル運営会社の先例（agora-hospitality-group、abhotel、kyoritsu-maintenance）に揃えて entertainment を暫定としたが、事業の実態は娯楽施設の運営ではなく、婚礼と宿泊を中心とするサービスの提供である。
