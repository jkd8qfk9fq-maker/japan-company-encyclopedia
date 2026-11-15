# 高速 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社高速 |
| 証券コード | 7504 |
| docID（データを取り出した文書） | `S100YEIF` |
| 原本 docID | `S100YEIF` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEIF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社高速 / 7504 / docID S100YEIF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 33 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kohsoku: 10 件の数値を有報XBRLと照合
有報: 株式会社高速 有価証券報告書－第63期(2025/04/01－2026/03/31) (docID S100YEIF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kohsoku: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中長期経営計画の定量目標（2035年度の売上高目標など）は、本文の規則により記載しなかった。
- businessModel: 前期有報との修正再表示チェックは全行一致し、会計方針の変更や決算期の変更にあたる注記も確認できなかったため、financialNotes は空にした。
- businessStructure: 単一セグメントのため、子区分はセグメント注記ではなく、MD&Aの「販売の実績」に示された商品グループ別区分によった。並び順は2026年3月期の販売実績の大きい順。
- businessStructure: 子区分の金額は、有報では千円単位の表として印字され単位が数値に隣接しないため、本文では金額ではなく印字の前年同期比を用いた。並び順の判定には販売実績（食品容器53,046,568千円、フィルム・ラミネート26,037,730千円、機械・設備資材・消耗材22,785,081千円、紙製品・ラベル14,393,189千円、段ボール製品6,113,464千円、その他1,815,509千円、合計124,191,544千円で連結売上高と一致）を用いた。
- history: 1966年の設立時の資本金額は、規則により沿革の本文に記載しなかった。
- history: 営業所の開設のうち、地域への初進出や物流拠点など節目になるものを採り、新潟営業所（1986年）、京都南営業所（2011年）、長野営業所（2012年）、岐阜羽島営業所（2013年）、北上営業所（2014年）の開設は個別の沿革項目にしなかった。
- history: 沿革の表は年月と事象が一体で印字されており、行順の対応づけは不要だった。
- industry: 包装資材の製造販売を表す区分が閉じた分類に無いため、素材・加工メーカーとして最も近い chemicals を暫定の主たる業界とし、taxonomyGaps に記録した。掲載済みの富士シールインターナショナル、東洋製罐グループホールディングス、レンゴーなどの包装・容器の会社と同じ近似である。
- relatedCompanies: 関係会社の状況に載る連結子会社6社（高速シーパック、清和、日本コンテック、プラス包装システム、常磐パッケージ、高速シーリング）はいずれも非上場で、関連企業候補（related-candidates.json）にも含まれないため、関連企業としては結んでいない。
- relatedCompanies: ステップ（step）は結ばなかった: 会計基準の説明にある「5ステップアプローチ」という一般的な語の一致で、同社への言及ではない。
- relatedCompanies: エン（en）は結ばなかった: 「エンゲージメント」という一般的な語の部分一致で、同社への言及ではない。
- relatedCompanies: ビジョン（vision）は結ばなかった: 「長期経営ビジョン」という一般的な語の一致で、同社への言及ではない。
- relatedCompanies: イオン（aeon）は結ばなかった: 特定投資株式に載るが、保有目的は全銘柄共通の定型句「営業取引に係る協力関係維持」のみで、その相手についての取引や提携の具体的な記載がない。
- relatedCompanies: ベース（base-4481）は結ばなかった: 「時価ベース」という一般的な語の一致で、同社への言及ではない。
- relatedCompanies: 七十七銀行（the-77-bank）は結ばなかった: 大株主の状況に載る金融機関（2026年3月31日現在2.61％）で、特定投資株式の保有目的も「財務取引に係る協力関係維持」という資金調達・財務取引の文脈であるため、規則により結ばない。
- relatedCompanies: トラスト（trust）は結ばなかった: 一致先は日本マスタートラスト信託銀行（信託口）の名称の一部であり、候補自体も上場コードリストにない。
- relatedCompanies: アークス（arcs）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: コア（core）は結ばなかった: 「紙緩衝材コア」という製品名の部分一致で、同社への言及ではない。
- relatedCompanies: コロナ（corona）は結ばなかった: 「コロナ禍」という一般的な語の一致で、同社への言及ではない。
- relatedCompanies: 大王製紙（daio-paper）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない（1,000株）。
- relatedCompanies: フリー（freee）は結ばなかった: 「フリー・キャッシュ・フロー」という一般的な語の一致で、同社への言及ではない。
- relatedCompanies: フレンドリー（friendly）は結ばなかった: 沿革に出るフレンドリー商事株式会社は2008年3月に当社へ合併した非上場の別会社で、候補の株式会社フレンドリーとは別法人である。社名の類似だけで結ばない。
- relatedCompanies: 光通信（hikari-tsushin）は結ばなかった: 大株主の状況に載るのは「光通信KK投資事業有限責任組合」という投資事業組合で、株式会社光通信そのものではないため、同一性が確認できない。
- relatedCompanies: 日本空港ビルデング（japan-airport-terminal）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: JBCCホールディングス（jbcc-holdings）は結ばなかった: 特定投資株式の保有目的が「情報技術向上に係る協力関係維持」という保有目的の記載にとどまり、具体的な取引や提携の内容の記載がない。
- relatedCompanies: カメイ（kamei）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: カネ美食品（kanemi）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: ランド（land）は結ばなかった: 「ブランド」という一般的な語の部分一致で、同社への言及ではない。
- relatedCompanies: リンテック（lintec）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない（1,000株）。
- relatedCompanies: マミーマートホールディングス（mammy-mart-holding）は結ばなかった: 特定投資株式のなかで最大の保有銘柄だが、保有目的は定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: マツキヨココカラ＆カンパニー（matsukiyococokara-and-co）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: みずほフィナンシャルグループ（mizuho-financial-group）は結ばなかった: 特定投資株式の保有目的が「財務取引に係る協力関係維持」という金融機関との財務取引の文脈であるため、規則により結ばない。
- relatedCompanies: 日本ハム（nh-foods）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない（500株）。
- relatedCompanies: ニチレイ（nichirei）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: ピックルスホールディングス（pickles-holdings）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: ポート（port）は結ばなかった: 「デュアルレポート」という一般的な語の部分一致で、同社への言及ではない。
- relatedCompanies: サイゼリヤ（saizeriya）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない（507株）。
- relatedCompanies: セキ（seki）は結ばなかった: 「セキュリティ」という一般的な語の部分一致（ambiguous）で、同社への言及ではない。
- relatedCompanies: ユナイテッド・スーパーマーケット・ホールディングス（united-super-markets-holdings）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: ヤマナカ（yamanaka）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- relatedCompanies: ヤマザワ（yamazawa）は結ばなかった: 特定投資株式の定型句のみで、個別の取引・提携の記載がない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言のみで、本文の内容を変えるものではない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 高速（kohsoku）の主たる業界（包装資材等製造販売事業） → 提案: packaging（包装・包装資材）。有報は事業を「包装資材等製造販売事業」と開示し、食品容器・フィルム・紙製品・段ボールなどの包装資材の製造販売が売上のすべてを占めますが、閉じた分類（INDUSTRY_IDS）に包装を表す値がありません。化学品を主な製品とする会社ではないため、素材・加工に最も近い chemicals は近似にすぎません。富士シールインターナショナルや東洋製罐グループホールディングスなど、同じ近似を使っている包装・容器の会社が複数あります。
