# オリエンタル白石 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | オリエンタル白石株式会社 |
| 証券コード | 1786 |
| docID（データを取り出した文書） | `S100Z9WX` |
| 原本 docID | `S100YDUO` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100Z9WX／有効文書 S100Z9WX（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z9WX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | オリエンタル白石株式会社 / 1786 / docID S100YDUO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
oriental-shiraishi: 10 件の数値を有報XBRLと照合
有報: オリエンタル白石株式会社 訂正有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100Z9WX)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":3715000000,"latestFiling":3746000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":77574000000,"latestFiling":76808000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":51268000000,"latestFiling":51299000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第75期(2025/04/01－2026/03/31)、docID S100Z9WX）を有効文書としてこのパックを作った。原本は docID S100YDUO。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはCriticalContractsTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
oriental-shiraishi: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書－第75期（docID S100Z9WX、2026年10月29日提出）であり、もとの有報はdocID S100YDUOである。訂正の分類はrecord-onlyで、財務の数値と本文はもとの有報と同一であり、異なるのはエントリーが引用しないCriticalContractsTextBlockのみであるため、訂正自体はneedsReviewにせず、この警告に記録した。出典は訂正有報を指している。
- businessModel: 証拠パックの「財務諸表の組替え」の注意は、企業結合に係る暫定的な会計処理の確定に伴い前連結会計年度の数値を見直したことを指すものと判断し、financialNotesに記録した。表示方法の変更のみの組替えは見当たらなかった。
- businessModel: セグメント別の外部顧客への売上高の単純合計（68,865百万円）は、連結売上高の印字（68,866百万円）と1百万円異なる。有報の印字どおりに記載し、差異はこの警告に記録した。
- businessModel: 連結子会社の施工工事において要求品質を満たさない製品が発見され、橋梁の再製作・再架設を行うことが2026年3月に公表された。当期中の事象でありグループ構成の変更ではないため、この警告に記録した。純利益は有報の印字どおりとし、金額の理由には触れていない。
- businessModel: 滋賀工場・つくば機材センターの設備の新設等の計画（2026年4月着手）は設備計画であり、グループ構成の変更ではないため、この警告に記録した。
- businessModel: 中期経営計画の経営指標や次期の業績見通し（金額・比率）は将来の目標であるため、本文には金額を書いていない。
- businessModel: 日本橋梁株式会社は連結売上高の10％を超えるが、有報自体が主要な損益情報等の記載を省略している。子会社の単体の数値は本文に書いていない。
- businessModel: セグメント利益の金額と増減の理由は、本文の規則により書いていない。
- businessModel: Wikipediaの記事「オリエンタル白石」は取得できたが、冒頭の記述は有報の記載の範囲を超える補足がなく、有報にない他社との関係の記述も含まれていたため、出典には加えていない。
- businessStructure: グループは当社と子会社を合わせ10社で構成され、うち連結子会社は6社（株式会社タイコー技建、日本橋梁株式会社、山木工業株式会社、株式会社クリエイティブ・ラボ、株式会社榮開発、株式会社デンカリノテック）である（2026年3月31日現在）。
- businessStructure: 連結子会社の株式会社タイコー技建は2026年1月に、同じく連結子会社であった株式会社菊政及び株式会社菊政工務店を吸収合併した。当期中に完了し、2026年3月31日現在の構成に反映されている。
- businessStructure: 株式会社菊政は2025年1月に、株式会社榮開発は2025年2月に、株式会社デンカリノテックは2025年4月に、それぞれ株式取得により連結子会社となった。いずれも期末現在の構成に反映されている。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順とした。「その他」は有報が報告セグメントに含まれない区分と明記しているため最後に置いた。
- history: 沿革の年月と事象は、旧オリエンタル建設・旧白石・合併後の3つの表の記載順に基づき対応づけた。
- history: 支店・出張所・工場の開設、ISO認証の取得、本社の移転、太陽光発電事業の開始などの行は、会社の転機となる行を優先して省いた。
- history: 設立時の資本金の金額は、本文の規則により記載していない。
- history: 2026年1月のタイコー技建による菊政・菊政工務店の吸収合併は、当期中に完了し期末現在の構成に反映されているため、警告と沿革に記録した。
- industry: 建設事業（プレストレストコンクリート工事、ニューマチックケーソン工事、補修補強工事等）が売上の中心であり、鋼構造物事業・港湾事業もいずれも建設工事であるため、主たる業界は construction のみとした。
- industry: その他の区分の太陽光発電による売電事業・不動産賃貸事業・インターネット関連事業は規模が小さく、独立した業界は付けていない。
- relatedCompanies: oriental-consultants-holdings: 特定投資株式として500,000株を保有するが、保有目的は設計手法や現場の知識・経験の共有への将来の期待と、建設事業活動に有益な情報収集であり、提携契約や具体的な取引の印字がないため結ばなかった。
- relatedCompanies: keisei-electric-railway: 特定投資株式として101,553株を保有するが、保有目的は将来の鉄道橋の建設及び維持補修の受注への期待と営業取引の維持・強化であり、現在の具体的な取引関係の印字がないため結ばなかった。
- relatedCompanies: denka: 子会社名「株式会社デンカリノテック」の部分一致で、デンカ株式会社についての記載ではないため結ばなかった。
- relatedCompanies: kohsoku: 「高速道路会社等」など一般語の部分一致で、株式会社高速についての記載ではないため結ばなかった。
- relatedCompanies: 中日本高速道路株式会社、西日本高速道路株式会社、国土交通省は主要な顧客だが、関連企業の候補に含まれず（未上場の高速道路会社と国の機関）、結ばなかった。顧客としての事実はindustryPositionに記録した。
- relatedCompanies: trust: 日本マスタートラスト信託銀行株式会社（信託口）等の信託口名義の部分一致で、取引の相手先ではないため結ばなかった。株式報酬制度の信託である株式会社日本カストディ銀行（信託口）も同様である。
- relatedCompanies: career、seki、zero、base-4481、slogan: いずれも一般語・文言の部分一致（「キャリア」「災害ゼロ」「スローガン」など）で、当該企業についての記載ではないため結ばなかった。
- relatedCompanies: 当社の連結子会社6社は、当社グループの会社であり関連企業には含めていない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 伊藤忠商事株式会社との資本業務提携契約について、2026年6月10日に変更契約が締結され、橋梁インフラメンテナンス領域での事業展開や、インフラ分野におけるPPP・PFI事業での協業等を通じてより強固なパートナーシップを構築することなどが定められた。登録は2026年3月31日現在の契約内容および同社の議決権保有割合19.2％に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
