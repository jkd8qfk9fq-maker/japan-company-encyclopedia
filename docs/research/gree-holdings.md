# グリーホールディングス — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | グリーホールディングス株式会社 |
| 証券コード | 3632 |
| docID（データを取り出した文書） | `S100Z3F1` |
| 原本 docID | `S100Z3F1` |
| 提出日（原本） | 2026-09-25 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3F1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | グリーホールディングス株式会社 / 3632 / docID S100Z3F1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gree-holdings: 10 件の数値を有報XBRLと照合
有報: グリーホールディングス株式会社 有価証券報告書－第22期(2025/07/01－2026/06/30) (docID S100Z3F1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
gree-holdings: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて有報の百万円印字をそのまま転記しました（千円印字からの換算・切り捨ては生じていません）。
- businessModel: 前期有報との修正再表示チェックは全6系列で差異ゼロであり、会計方針の変更の記載もないため、financialNotes は空です。証拠パックの「財務諸表の組替え」の警告は、当連結会計年度のセグメント区分変更に伴い前連結会計年度の数値を変更後の区分に組み替えて開示したことを指すものと判断し、表示方法の変更として businessStructure の warnings に記録しました。
- businessModel: 経営方針が「目標とする経営指標」として掲げる売上高及び営業利益のうち、営業利益は利益指標であるため strategy の本文には転記せず、定性的な方針のみを要約しました。
- businessModel: 重要な後発事象には社債の発行も含まれますが、資金調達に関する事項であり、グループ構成やセグメント区分の変更ではないため、needsReview ではなくこの warnings に記録します。
- businessModel: 地域ごとの情報の構成要素（日本46,049百万円＋その他5,274百万円＝51,323百万円）と、製品及びサービスごとの情報の構成要素（有料課金収入33,092百万円＋その他18,231百万円＝51,323百万円）は、いずれも印字された合計51,324百万円と1百万円差があります。印字の数値をそのまま転記しました。
- businessModel: suppliers は空にしました。有報は当社グループの調達先を記載しておらず、Apple Inc.・Google Inc.との契約はアプリケーションの配信に関する主要な取引契約として印字されるもので、調達先の記載ではないためです。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。MD&Aのセグメント別売上高（ゲーム事業29,439百万円など）はセグメント間の内部売上高を含む数値のため使わず、セグメント注記の外部顧客への売上高を使用しました。
- businessStructure: セグメント構成要素の単純合計は51,321百万円で、印字された連結売上高51,324百万円とは3百万円の差があります。印字の数値をそのまま転記しました。
- businessStructure: 当連結会計年度のセグメント変更（従来の「メタバース事業」から「VTuber事業」への名称変更と、「その他」に区分していた領域を新設した「エンジニアリング事業」への区分）は表示方法の変更であり、前連結会計年度のセグメント情報は変更後の区分で組み替えて開示されています。5年間の経営指標に影響はないため、financialNotes ではなくこの warnings に記録します。
- businessStructure: 翌連結会計年度からの投資事業の撤退とセグメント名称の変更は、businessModel の needsReview に記録しています。
- history: 沿革の設立行に印字された資本金の金額は、財務数値の規則により本文に転記していません。
- history: 沿革から取り上げなかった行（海外子会社の設立・清算、一部の子会社化など）は、現在の事業構成に関わる主要な出来事を優先したためです。
- industry: 売上の大半を占めるゲーム事業・VTuber事業・IP事業はいずれもコンテンツ・エンターテインメント領域のため、主たる業界は entertainment としました。DX事業（法人向けDX支援・SaaS）とエンジニアリング事業は報告セグメントとして開示されるITサービスのため、it を2つ目に付けました。
- relatedCompanies: bushiroad（ブシロード、7803）: 特定投資株式の唯一の上場銘柄で6,232,000株を保有しますが、保有目的は「取引関係の維持・強化のため」という定型句のみで、銘柄ごとに個別化された取引の役割の印字がなく、他に取引・提携の記載もないため結びませんでした。株式数の増加はブシロード側の株式分割によるものです。
- relatedCompanies: kddi（KDDI、9433）: 沿革に2006年11月の「EZ GREE」共同提供開始の記載があるのみで、過去の連携であり、現在の取引・提携の印字がないため結びませんでした。
- relatedCompanies: softbank（ソフトバンク、9434）: 沿革に2007年8月のYahoo！ケータイ公式サービスの記載があるのみで、現在の取引・提携の印字がないため結びませんでした。
- relatedCompanies: ntt（NTT、9432）: 有報が印字する相手は株式会社エヌ・ティ・ティ・ドコモ（現：株式会社ＮＴＴドコモ）であり、候補の株式会社ＮＴＴとは別の法人です。また記載は2007年の公式サービスの歴史的事実のみのため結びませんでした。
- relatedCompanies: 株式会社セコイア: 【関係会社の状況】に親会社として記載され、議決権の被所有割合は61.8％（2026年6月30日現在）ですが、未上場で related-candidates に含まれないため結べませんでした。事実は businessStructure に記録しています。
- relatedCompanies: Apple Inc.、Google Inc.、Stripe, Inc.: 主要な顧客として印字され、Apple Inc.・Google Inc.とは配信に関する主要な取引契約もありますが、いずれも外国会社で候補に含まれないため結びませんでした。
- relatedCompanies: en、tein、land、rent、innovation、lec、port、como、hit、king、will、seki、freee: 社名の部分一致のみで、有報がその相手について取引・提携・資本関係を述べていないため結びませんでした。nissin、trust は信託口等の名称の部分一致で、コードリストにもありません。
- terms: 助言: 用語「GREE」は、当社グループが運営するソーシャルゲームプラットフォームの名称です（事業の内容・沿革に印字）。前身は2006年にKDDIと共同で提供を開始した「EZ GREE」です。
- terms: 助言: 用語「REALITY」は、VTuber専用のライブ配信アプリ（プラットフォーム）の名称です（事業の内容・沿革に印字）。2018年に提供を開始し、連結子会社のREALITY株式会社が運営します。
- terms: 助言: 用語「WFS」は、ゲーム事業を担う連結子会社・株式会社WFSの略称です（事業の内容・関係会社の状況に印字）。旧社名は株式会社Wright Flyer Studiosです。
- terms: 助言: 用語「有料課金収入」は、セグメント情報等の関連情報（製品及びサービスごとの情報）で、利用者からの課金による売上高を指す区分名です。

## 要確認（status に反映）

- businessModel: 翌連結会計年度より投資事業を撤退し「投資事業」のセグメント区分を廃止すること、ならびに「VTuber事業」を「ライブエンターテインメント事業」へ、「IP事業」を「アニメ・マンガ・MD事業」へ名称変更することが、重要な後発事象として開示されています。本登録は2026年6月30日時点の6セグメント構成（投資事業を含む）で行います。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
