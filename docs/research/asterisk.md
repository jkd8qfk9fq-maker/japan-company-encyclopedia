# アスタリスク — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アスタリスク |
| 証券コード | 6522 |
| docID（データを取り出した文書） | `S100YJXS` |
| 原本 docID | `S100X66T` |
| 提出日（原本） | 2025-11-27 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | S100X7CR, S100YJXS／有効文書 S100YJXS（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJXS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アスタリスク / 6522 / docID S100X66T（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asterisk: 10 件の数値を有報XBRLと照合
有報: 株式会社アスタリスク 訂正有価証券報告書－第19期(2024/09/01－2025/08/31) (docID S100YJXS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第19期(2024/09/01－2025/08/31)、docID S100YJXS）を有効文書としてこのパックを作った。原本は docID S100X66T。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはChangesInNumberOfIssuedSharesStatedCapitalEtcTextBlock・IndependentAuditorsReportConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
asterisk: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正の状況: 有効文書は訂正有価証券報告書（S100YJXS、2026年6月26日提出）で、原本はS100X66T。本文・数値とも原本と同一の record-only 分類（差異は発行済株式総数・資本金等の推移と独立監査人の報告書のテキストブロックのみ）であり、出典は訂正有報の値で登録した。前期有報との修正再表示チェックは全6系列で差異ゼロだった。訂正の分類に従い、訂正に関する needsReview は付けていない。
- businessModel: 証拠パックの「遡及適用」の注意について: 抽出本文に遡及適用で指標が変わった旨の注記は無く、前期有報との照合も全6系列で差異ゼロだった。会計基準の変更として確認できるのは収益認識基準の第16期（2022年8月期）からの適用であり、financialNotes にその旨を登録した。
- businessModel: 主要な経営指標等の注記のうち、潜在株式調整後1株当たり当期純利益や株価収益率を記載していない旨は表示に関する事項のため financialNotes には載せなかった。株式分割の事実は needsReview に登録した。
- businessModel: MD&Aに印字された売上高と当期純利益以外の利益項目の金額・増減率、セグメント利益、減損損失の金額、受注高・受注残高の金額は、本文の数値規則に従い本文に記載していない。米国子会社2社の債務超過の金額も記載していない。
- businessModel: 重要な契約等には、韓国のSPS Inc.とのAsReader製造に関する売買基本契約（2016年）と、Apple Inc.との開発・製造・販売ライセンス契約（2012年）が印字されている。いずれも外国法人で関連企業の候補に無いため、関連企業には結んでいない。
- businessModel: AsReader, Inc.については、重要な後発事象ではなく事業等のリスクの節で、現時点で売上には至っていないものの閉鎖する予定はないと印字されている。後発事象の節は連結・個別とも確認した範囲で構造変更の予定は無く、登録は決算期末の構造で行った。
- businessModel: Wikipedia は記事が見つからなかった（found: false）ため使用せず、出典も加えていない。
- businessModel: 順位・シェアなど検証できる業界順位の印字が無いため perspectives の industryPosition は省いた。
- businessStructure: 事業の並び順は、報告セグメントの外部顧客への売上高の大きい順（AsReader事業1,384,349千円、システムインテグレーション事業269,427千円、賃貸事業12,530千円）にした。本文には千円額を百万円に切り捨てて記載した。
- businessStructure: 設備と事業の対応は設備表のセグメント欄どおりにした。本社兼研究所の行は全社共通・AsReader事業・賃貸事業に分かれており、東京事業所はシステムインテグレーション事業、倉庫は全社共通とAsReader事業の連記だったため倉庫はどの事業にも結びつけなかった。帳簿価額は記載していない。
- businessStructure: suppliers はこのツリーの旧スキーマに従い省いた。AsReaderの製造に関する売買基本契約の相手方である韓国のSPS Inc.は、重要な契約等に印字されている（businessModel の warnings にも記録）。
- history: 沿革のうち、事業所の開設・移転（2007年代理販売開始、2008年大阪事業所開設、2010年東京事業所開設、2011年本店移転、2017年深圳事務所開設、2019年米国子会社の本店移転と東京事業所移転、2020年名古屋営業所開設、2023年研究開発棟建設と物流拠点開設）、増資（2008年、2016年のベンチャーキャピタル引受の第三者割当増資）、2015年のSalasee著作権の譲渡、2017年の業界別ハンディターミナルの販売開始は、設立・製品開始・子会社設立・上場・市場移行といった転機に絞るため収録しなかった。
- history: 沿革に印字された資本金の金額（設立時・増資時・子会社設立時の資本金）は、金額の規則に従い本文に記載していない。
- industry: 主たる業界は、外部顧客への売上高が最大のAsReader事業に基づき it とした。リーダーなどのハードウエア製品の開発・販売を含むが、自社工場を持たないファブレスで、ソフトウエアとソリューションの提供が中核のため electronics は付けなかった。
- industry: 賃貸事業は外部顧客への売上高が僅少なため real-estate は付けなかった。
- relatedCompanies: seki: 文章の一部（セキュリティ等）に一致しただけの曖昧な候補であり、当社について述べる取引・提携・資本関係の印字が無いため結ばなかった。
- relatedCompanies: suzuki-6785: 代表者の氏名「鈴木」への一致であり、別人であるため結ばなかった。
- relatedCompanies: career: 「携帯通信キャリア」という語への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: land / port: 米国子会社の所在地「ポートランド」への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」という語への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: nissin: listing が「コードリストにない」上、新株予約権の行使期間の文言への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: en: 曖昧な一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: space: バーコードの「スペース」の定義文への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: core: 「コアコンピタンス」という語への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: ficha: 「フィーチャーフォン」という語への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: oricon: 折り畳みコンテナの普通名詞「オリコン」への一致であり、listing も「コードリストにない」ため結ばなかった。
- relatedCompanies: ray: 「リプレイス」という語への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: rhythm: 「アルゴリズム」という語への一致であり、関係の印字が無いため結ばなかった。
- relatedCompanies: 大連明日星科技有限公司、AsReader, Inc.、株式会社自動レジ研究所は当社の連結子会社（いずれも議決権100.0％）であるため、関連企業には結ばなかった。
- relatedCompanies: 重要な契約等の相手方であるSPS Inc.（韓国）とApple Inc.（米国）は外国法人で関連企業の候補に無いため結ばなかった。
- terms: 用語の助言（解説は書かない）: 以下の固有表現・専門用語について、用語集への収録候補として助言します。「AsReader（スマートフォンに取り付けて使う同社の読み取り機器のブランド）」「RFID（電波を用いてタグのデータを非接触で読み書きする仕組み）」「RFタグ」「ファブレス（自社で製造工場を持たず、生産を外部に委託する事業方式）」「ハンディターミナル」「セミセルフレジ」。

## 要確認（status に反映）

- businessModel: 継続企業の前提に関する重要事象等が開示されています。米国子会社のAsReader, Inc.が3期連続で営業損失を計上するなど、継続企業の前提に重要な疑義を生じさせる事象が存在しますが、営業体制の再編やストック型商材の拡充、手元資金の確保などの対応策を実行しており、会社は現時点において重要な不確実性は認められないと判断しています。
- businessModel: 2021年11月26日付で、普通株式1株につき4株の割合で株式分割を実施しています（主要な経営指標等の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
