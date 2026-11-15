# ＦＵＪＩジャパン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＦＵＪＩジャパン |
| 証券コード | 1449 |
| docID（データを取り出した文書） | `S100XT84` |
| 原本 docID | `S100XT84` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT84.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＦＵＪＩジャパン / 1449 / docID S100XT84（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 0 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fuji-japan: 10 件の数値を有報XBRLと照合
有報: 株式会社ＦＵＪＩジャパン 有価証券報告書－第21期(2025/01/01－2025/12/31) (docID S100XT84)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
fuji-japan: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社FUJIジャパン」が EDINET の提出者名「株式会社ＦＵＪＩジャパン」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨てて記載した（切り上げはしていない）。セグメント別の切り捨て額の合計988百万円と売上高の切り捨て額989百万円には端数処理の差がある。千円単位でもセグメント別売上高の合計989,139千円に対し印字の合計は989,140千円で、有報の丸めの差をそのまま記載した。
- businessModel: 当期純利益の増加要因である本社土地の売却については、金額を本文に書かず、売却益を計上したという事実のみを記載した。
- businessModel: 施工は指定工事店への外注であり、ＯＥＭ先製造会社の社名は有報に印字されていないため供給者の社名は記載していない。このツリーのスキーマに suppliers キーがないため、businessModel に suppliers は入れていない。
- businessModel: 経営上の目標の指標に関する記載のうち、本文に書ける売上高以外の利益指標については転記を省いた。
- businessStructure: 市場区分は表紙に印字がないため listings に market を入れていない（札幌証券取引所本則市場であることは主要な経営指標等の注記に記載がある）。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高の大きい順とした。外壁リフォーム工事にはセグメント間の内部売上高9,601千円があるが、内部売上高は使っていない。
- history: 沿革の後半は年月と事象が分かれて印字される崩れた表になっており、年月10件と事象10件の数が一致したため行順に対応づけた。
- history: 資本金の金額を含む増資の行（2008年９月、2013年６月、2018年12月の公募増資）は、沿革に資本金額を書かないため行ごと省いた。2018年２月・12月の対応が抽出テキストで判然としない道東支店閉鎖の行も省いた。
- history: 各支店・物流センターの開設や閉鎖など拠点の細目は、主なもの以外は省いた。
- relatedCompanies: en（エン株式会社）: 『ハッピーエンドシリーズ』など文章中の『エン』という語の一致で、同社の社名の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: base-4481（ベース株式会社）: 『ベースアップ』という語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: fuji（株式会社FUJI）: 自社の英訳名『FUJI JAPAN』の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 文章中の語の一致で、同社の社名としての記載はないため結ばなかった。
- relatedCompanies: cover（カバー株式会社）: 『カバーする』という語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: nippon-kinzoku（日本金属株式会社）: 『日本金属サイディング工業会』という業界団体名の一致で、同社の記載ではないため結ばなかった。
- relatedCompanies: nitta（ニッタ株式会社）: 『ニッタイ工業』という別会社の名称の一致で、同社の記載ではないため結ばなかった。
- relatedCompanies: taya（株式会社田谷）: 個人株主の記載に伴う語の一致で、同社の社名の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: 代表取締役の佐々木忠幸氏は個人株主（71.83％）であり、関連企業としては結ばない。特定投資株式等の政策保有株式の記載はなく、関係会社の状況も該当事項なしである。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ＦＵＪＩジャパンの主たる業界（外壁リフォーム工事を中心とする住宅リフォーム工事の請負。2025年12月期の外部顧客への売上高は外壁リフォーム工事775百万円、その他リフォーム工事120百万円） → 提案: リフォーム・修繕工事（建物の維持・保全工事）。閉じた分類にリフォーム・修繕工事の区分がなく、工事の請負に最も近い construction を暫定値としたため。ニッソウ、エムビーエスなどリフォーム工事の会社で同じ暫定と提案が記録されている。
