# 株式会社アルバイトタイムス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アルバイトタイムス |
| 証券コード | 2341 |
| docID（データを取り出した文書） | `S100Y5RZ` |
| 原本 docID | `S100Y5RZ` |
| 提出日（原本） | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5RZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アルバイトタイムス / 2341 / docID S100Y5RZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 10 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
arbeit-times: 10 件の数値を有報XBRLと照合
有報: 株式会社アルバイトタイムス 有価証券報告書－第53期(2025/03/01－2026/02/28) (docID S100Y5RZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
arbeit-times: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（切り上げはしていない）。人材サービス事業の外部顧客への売上高4,314,668千円は4,314百万円、販促支援事業の404,388千円は404百万円とし、合計は印字の4,719百万円（4,719,056千円）を使った。切り捨てた事業別金額の合計（4,314＋404＝4,718百万円）は印字の合計と１百万円異なる。
- businessModel: MD&Aの販促支援事業の売上高409百万円はセグメント間の内部売上高を含む数値のため使わず、セグメント注記の外部顧客への売上高404,388千円を用いた。人材サービス事業はMD&Aの4,314百万円とセグメント注記の外部顧客への売上高が一致している。
- businessModel: 当連結会計年度より、株式会社WHOMを連結子会社化したことに伴い、報告セグメントの名称を「情報提供事業」から「人材サービス事業」へ変更しているが、名称の見直しのみで事業内容・対象子会社に実質的な変更はなく、前連結会計年度のセグメント情報も変更後の名称で表示されている表示方法の変更であるため、financialNote にはせず warnings に記録した。
- businessModel: 事業等のリスクに記載された事業別売上高の内訳では、2026年２月期より求人情報サイトにHRテック（『ワガシャ de DOMO』等）を追加し、2024年２月期実績まで遡って数値を修正しているが、これは経営管理上の内訳の組替えであり、５年間の経営指標等は前期有報と全系列で一致している（修正再表示チェックは差異なし）ため、financialNote にはしなかった。
- businessModel: 2025年２月期の financialNote は、減損損失に関する注記に印字された理由（基幹システム刷新に伴うソフトウエア投資の導入範囲見直し）に基づく。同年度の親会社株主に帰属する当期純損失467百万円の主因である。
- businessModel: 重要な後発事象は自己株式の消却のみである（2026年４月９日取締役会決議、2026年４月17日に普通株式1,000,000株を消却）。資本政策に関する決議でありグループ構造に影響しないため、needsReview にはせず warnings に記録した。
- businessModel: 株式会社WHOMの全株式取得（2025年３月14日、取得価額500,000千円、のれん468,168千円）は当連結会計年度中の企業結合で、期末のグループ構造に反映されているため needsReview にはしていない。
- businessModel: 配当政策に記載された連結配当性向50％を目処とする方針は投資指標のため、本文及び perspectives には記載しなかった。
- businessModel: 求人情報誌の印刷は大日本印刷株式会社に外注している（MD&Aの生産実績に主な相手先として記載。当連結会計年度の印刷費相当額181,037千円）。businessModel に suppliers キーは設けず（本ツリーのスキーマに無いため）、相手方は relatedCompanies で supplier として結んだ。
- businessModel: Wikipedia（証券コードで照合）には人材紹介業『Achieve Career』への言及があるが、有報の抽出可能な記載では確認できないため引用しなかった。
- businessStructure: 連結子会社は株式会社リンク（議決権の所有割合100％、販促支援事業）、Mirac Company Limited（同100％、ミャンマー連邦共和国、人材サービス事業）、株式会社WHOM（同100％、人材サービス事業）の３社で、いずれも非上場で関連会社候補に含まれていないため関連会社としては結ばなかった。
- businessStructure: 当連結会計年度より株式会社WHOMを連結子会社化したことに伴い、報告セグメントの名称を「情報提供事業」から「人材サービス事業」へ変更している。名称の見直しのみで事業内容・対象子会社に実質的な変更はないため、期末の構造として登録した（needsReview にはしていない）。
- businessStructure: 求人情報誌の印刷は大日本印刷株式会社に外注している（businessModel には suppliers キーを設けないため、ここに記録する）。
- history: 沿革に印字された設立時・子会社設立時の資本金額は、資本金額を沿革に記載しないルールにより転記しなかった。
- history: 当連結会計年度のセグメント名称変更（「情報提供事業」から「人材サービス事業」へ）は名称の見直しのみであり、沿革の行にはしなかった（businessStructure の warnings に記録した）。
- industry: 主たる業界は、2026年２月期の外部顧客への売上高の91.4％を占める人材サービス事業（求人情報誌・求人情報サイトの運営等）のため human-resources とした。販促支援事業（フリーペーパーの取次等）は media を２つ目に付けた。いずれも閉じた集合に合う区分が存在するため taxonomyGaps は無い。
- relatedCompanies: freee（freee株式会社）: 一致は「フリーランス」「フリーペーパー」の語への一致のみで、取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 一致は「イノベーションの創出」の語への一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 一致は「営業利益ベース」の語への一致のみのため結ばなかった。
- relatedCompanies: en（エン株式会社）: 一致は「エンゲージメント」の語への一致のみのため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: 一致は「情報セキュリティ」の語への一致のみのため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 一致は「ブランド」の語への一致のみのため結ばなかった。
- relatedCompanies: pa（株式会社ピーエイ）: 2008年11月に合弁会社モバイル求人株式会社を設立した相手方だが、同社は議決権の所有割合の減少により2012年２月期から持分法適用の範囲から除外されており、現在の関係の記述がないため結ばなかった。
- relatedCompanies: systemsoft（株式会社システムソフト）: 一致は「基幹システムソフトウエア」の語への一致のみのため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: コードリストに存在しない候補であり、一致は大株主の常任代理人「日本マスタートラスト信託銀行」の語への一致のみのため結ばなかった。
- relatedCompanies: will（株式会社ウィル）: 一致は「コンピューターウィルス」の語への一致のみのため結ばなかった。
- relatedCompanies: 株式会社日本カストディ銀行（信託口）の保有（7.38％）は信託口業務に係るものであり、関連会社としては結ばなかった。株式会社EPARK（5.17％）とUH Partners ２投資事業有限責任組合（6.95％）は大株主に記載されているが、候補に含まれておらず、関係の実質は株式会社光通信をその他の関係会社として結ぶことで記録した。
- relatedCompanies: 特定投資株式は該当事項がなく、政策保有株式に基づく候補はない。
- terms: 用語の候補として、ATS（採用管理システム）、RPO（Recruitment Process Outsourcing、採用業務のアウトソーシング）、HRテック、フリーペーパー取次、サブスクリプション型課金モデルを挙げる。助言のみで、用語データは作成していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
