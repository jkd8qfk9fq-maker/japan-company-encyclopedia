# INCLUSIVE Holdings — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＩＮＣＬＵＳＩＶＥ　Ｈｏｌｄｉｎｇｓ株式会社 |
| 証券コード | 7078 |
| docID（データを取り出した文書） | `S100YMA3` |
| 原本 docID | `S100YMA3` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YMA3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＩＮＣＬＵＳＩＶＥ　Ｈｏｌｄｉｎｇｓ株式会社 / 7078 / docID S100YMA3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
inclusive-holdings: 10 件の数値を有報XBRLと照合
有報: ＩＮＣＬＵＳＩＶＥ　Ｈｏｌｄｉｎｇｓ株式会社 有価証券報告書－第19期(2025/04/01－2026/03/31) (docID S100YMA3)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":-353793000,"latestFiling":-354899000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第17期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第16期(2022/04/01－2023/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
inclusive-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「INCLUSIVE Holdings株式会社2025年10月1日付で商号の登記上の表記を「INCLUSIVE株式会社」から「INCLUSIVE Holdings株式会社」に変更いたしました。」が EDINET の提出者名「ＩＮＣＬＵＳＩＶＥ　Ｈｏｌｄｉｎｇｓ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年3月期の利益（売上高と当期純利益の間の行）の値は、前期の有価証券報告書の印字（△353,793千円）と当期の有価証券報告書の印字（△354,899千円）で異なります。本登録の財務数値は当期の有価証券報告書の印字を用いています。売上高と当期純利益には前期との差異はありませんでした。
- businessModel: 前期以前の期間には第16期・第17期の訂正有価証券報告書が存在しますが、当期の有価証券報告書（第19期）自体は訂正されていません。
- businessModel: 当期の報告セグメント区分の変更（ブランドコンサルティング事業への集約など）は表示の変更であり、前期数値も変更後の区分に組み替えられているため、financialNotesには入れていません。
- businessModel: 経営成績の説明にある調整後EBITDAやその他の利益指標の金額・増減理由は、本文に書いていません。
- businessModel: Wikipediaの会社記事は確認できなかったため、補足情報は使っていません。
- businessStructure: 報告セグメントは当連結会計年度から変更されています（従来の「メディア＆コンテンツ事業」「企画＆プロデュース事業」を「ブランドコンサルティング事業」に集約し、「その他」だった宇宙関連事業と投資事業を報告セグメント化）。区分の変更は表示上のものであり、前期のセグメント情報も変更後の区分で組み替えて記載されています。
- businessStructure: セグメント別の外部顧客への売上高を百万円未満で切り捨てると合計が4,559百万円となり、連結売上高4,560百万円と1百万円の差があります。有報の印字どおりに記載しています。
- businessStructure: 連結子会社は2026年3月31日現在9社です。株式会社OGSとOGS PLUS,INC.は債務超過の状態にありますが、金額は本文に書いていません。OGS PLUS,INC.は清算手続き中です。
- businessStructure: 持分法適用関連会社だったオレンジタイズ株式会社は、2026年2月27日付の株式売却により持分法適用の範囲から除外されています（期中の変更のため、needsReviewには入れていません）。
- businessStructure: 2025年10月1日付で持株会社体制へ移行し、事業を承継した連結子会社INCLUSIVE株式会社（旧INCLUSIVE分割準備株式会社）がブランドコンサルティング事業を行っています。
- history: 沿革の表から、事業所の設置・閉鎖（松山・大阪・名古屋）、United Editors株式会社の解散、株式会社Y&Iメディアソリューションズの株式譲渡、STOKK株式会社の設立、本店移転の行は、会社の事業構造を変える出来事ではないため省きました。
- history: 資本金の金額は沿革に書いていません。
- industry: 主たる業界は、外部顧客への売上高が最大の報告セグメントである食関連事業（2,211百万円）に対応する food としました。次いで大きいブランドコンサルティング事業（2,209百万円）は、デジタルメディアのマネタイズ支援やデジタルマーケティングが中心であるため media を2つ目に付けました。
- industry: 宇宙関連事業（30百万円）と投資事業（109百万円）は売上高の割合が小さいため、独立した業界は付けていません。
- relatedCompanies: land（株式会社ランド）は、当社の連結子会社LAND INSIGHT株式会社の社名の一部との一致であり、株式会社ランドとの関係の記載はないため結んでいません。
- relatedCompanies: step・career・port・vision・base-4481・core・corona・will・cover・king・path・rion・taya は、いずれも本文中の一般語や部分文字列（ステップアップ、キャリア採用、ポートフォリオ、ビジョン、ベース、コアな情報、新型コロナウイルス感染症など）との一致であり、当該企業との取引・提携・資本関係の記載がないため結んでいません。
- relatedCompanies: nissin（株式会社日新）は新株予約権の行使期間などの定型文中の「日新」との一致で曖昧であり、コードリストにもないため結んでいません。zero・seki・en・suzuki-6785・matsuya は、ゼロとして計上、セキュリティ、エンゲージメント、役員名、麻布松屋ビル（建物名）との一致であり、関係の記載がないため結んでいません。
- relatedCompanies: 大株主のインターステラテクノロジズ株式会社（3.97％）と株式会社Hakuhodo DY ONE（1.88％）は related-candidates.json に含まれていないため結んでいません。楽天証券株式会社・株式会社ＳＢＩ証券などの証券会社や信託口は、純投資・金融機関のため結んでいません。
- relatedCompanies: 特定投資株式は該当事項がありません。
- terms: 用語の助言のみです。対象となりうる用語は「圃場DX（地方自治体の農業行政における転作確認などの現地調査を、衛星データを活用して支援するサービス）」「場のメディア化（来場者が訪れる場所をメディアと捉え、体験を通じてブランド価値を高める施策）」です。本文では有報の説明に沿って書いています。

## 要確認（status に反映）

- businessModel: 2021年4月13日付で普通株式1株につき3株の割合で株式分割を行っています（主要な経営指標等の注記に記載）。
- businessStructure: 2026年3月31日の決算日後の2026年6月1日付で、連結子会社の株式会社ジョージクリエイティブカンパニーは、同じく連結子会社の株式会社オレンジ・アンド・パートナーズを存続会社とする吸収合併により消滅しています。本登録は2026年3月31日現在のグループ構成に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
