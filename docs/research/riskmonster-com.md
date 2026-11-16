# リスクモンスター — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リスクモンスター株式会社 |
| 証券コード | 3768 |
| docID（データを取り出した文書） | `S100YGM6` |
| 原本 docID | `S100YGM6` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGM6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リスクモンスター株式会社 / 3768 / docID S100YGM6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
riskmonster-com: 10 件の数値を有報XBRLと照合
有報: リスクモンスター株式会社 有価証券報告書－第26期(2025/04/01－2026/03/31) (docID S100YGM6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
riskmonster-com: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 指標の注記１（潜在株式調整後１株当たり当期純利益の非開示）・注記２（自己資本利益率・株価収益率の非開示）は表示事項であり算定基礎の変更ではないため、financialNotes には入れていない。
- businessModel: 指標の注記３は、第25期の親会社株主に帰属する当期純損失が固定資産の除却や訴訟関連の損失の計上による旨の説明であり、損失の理由であって算定基礎の変更ではないため、financialNotes には入れていない。
- businessModel: MD&Aの段階利益・EBITDA・キャッシュ・フロー金額、セグメント利益は本文に書いていない（本文の金額は売上高と当期純利益のみ）。
- businessModel: 第９次中期経営計画の数値目標（2028年度の売上高・利益・EBITDAマージンの目標）は投資・利益指標の目標であるため、本文及び perspectives には書いていない。
- businessModel: セグメント外部顧客への売上高の百万円切り捨ての合計は3,822百万円となり、印字の合計3,824百万円と２百万円の差がある（千円単位の合計は印字と一致）。切り捨てのまま印字している。
- businessModel: suppliers キーはこのツリーの旧スキーマのため省略した。仕入先の個別名の印字はない（J-MOTTOのライセンス関係は関連企業に記録）。
- businessModel: 2026年４月１日の連結子会社間の合併は期末後の構造変化のため needsReview に記録し、2026年３月31日現在の構成で登録している。
- businessStructure: 設備の状況では提出会社の本社は与信管理サービスに区分されている。国内子会社・在外子会社の重要な設備はないと印字されている。
- businessStructure: 【関係会社の状況】に印字される子会社の主要な損益情報等の金額は書いていない。
- businessStructure: セグメント外部顧客への売上高の百万円切り捨ての合計は3,822百万円となり、印字の合計3,824百万円と２百万円の差がある（千円単位の合計は印字と一致）。
- businessStructure: 2026年４月１日の連結子会社間の合併は期末後の構造変化のため needsReview に記録し、2026年３月31日現在の構成で登録している。
- history: 沿革のうち、支社・営業所の開設、本社の移転、認証取得、個別サービスの開始等の細目（ｅ－管理ファイル、攻めモンスター、ポートフォリオサービス、Secured Monster、社内格付システム、反社チェックヒートマップ等）は省略した。
- history: 設立時の資本金額は書いていない（資本金額は沿革に含めない規則）。
- history: 2022年４月から2023年１月の沿革は日付セルがまとめて抽出されていたため行順に対応付けた（市場区分の見直しによるスタンダード市場への移行は2022年４月）。
- history: 2026年４月の連結子会社間の合併（日本アウトソースがリスモン・マッスル・データを吸収合併し商号変更）は期末後の事項のため沿革には入れず、needsReview に記録した。
- history: Wikipediaの記事「リスクモンスター」は証券コードで照合できたが、冒頭の記述は有報の事実の言い換えにとどまるため補足には使っていない。
- industry: 売上高の過半を占める与信管理サービスは、企業データベースを活用したＡＳＰ・クラウド型の情報提供サービスであり、ビジネスポータルサイト事業もクラウドサービスのため、it を主分類とした（直接の適合であり暫定ではない）。
- industry: 教育関連事業とＢＰＯサービス事業は付随的な事業であり、独立した二次分類は付けていない。
- relatedCompanies: seki（セキ株式会社）は結ばなかった。「セキュリティ」等の部分文字列の一致のみで、同社についての印字はない（ambiguous）。
- relatedCompanies: base-4481（ベース株式会社）は結ばなかった。「企業データベース」等の一般語の部分一致のみである。
- relatedCompanies: port（ポート株式会社）は結ばなかった。「レポート」「ポートフォリオサービス」等の部分文字列の一致のみである。
- relatedCompanies: vision（株式会社ビジョン）は結ばなかった。「長期ビジョン」という自社の計画名の一致のみである。
- relatedCompanies: step（株式会社ステップ）は結ばなかった。「５ステップアプローチ」という収益認識の用語の一致のみである。
- relatedCompanies: career（株式会社キャリア）は結ばなかった。「キャリア開発研修」という一般語の一致のみである。
- relatedCompanies: freee（フリー株式会社）は結ばなかった。「フリーランス法」等の法令名の一致のみである。
- relatedCompanies: king（株式会社キング）は結ばなかった。「ランキング」という一般語の部分一致のみである。
- relatedCompanies: en（エン株式会社）は結ばなかった。「データエントリー」等の部分文字列の一致のみである（ambiguous）。
- relatedCompanies: lec（レック株式会社）は結ばなかった。「フレックスタイム制」の部分文字列の一致のみである。
- relatedCompanies: nissin（株式会社日新）は結ばなかった。新株予約権の期間の印字に由来する一致のみで、コードリストにもない（ambiguous）。
- relatedCompanies: rhythm（リズム株式会社）は結ばなかった。企業理念の文中の一般語の一致のみである。
- relatedCompanies: kohsoku（株式会社高速）は結ばなかった。「高速×高品質×高付加価値」という一般的な表現の一致のみである（ambiguous）。
- relatedCompanies: land（株式会社ランド）は結ばなかった。「ブランド価値向上」という一般語の部分一致のみである。
- relatedCompanies: f-and-m（株式会社エフアンドエム）は結ばなかった。2011年１月に「エフアンドエムクラブ」の会員企業向けにリスモン企業信用格付の提供を開始した旨の沿革の印字のみで、現在の取引・提携の印字はない（過去の関係）。
- relatedCompanies: nippon-information-development（株式会社エヌアイデイ）は結ばなかった。【大株主の状況】に保有の印字はあるが、取引・提携等の関係の印字はない。
- relatedCompanies: obic-business-consultants（株式会社オービックビジネスコンサルタント）は結ばなかった。【大株主の状況】に保有の印字はあるが、取引・提携等の関係の印字はない。
- relatedCompanies: sumitomo-realty-and-development（住友不動産株式会社）は結ばなかった。【大株主の状況】に保有の印字はあるが、取引・提携等の関係の印字はない。
- relatedCompanies: 候補に含まれない相手の記録: 株式会社ＵＨＰａｒｔｎｅｒｓ２は【大株主の状況】に印字されるが候補に含まれないため結んでいない。自社の連結子会社５社は結んでいない。
- terms: 助言のみ。用語候補: ＲＭ格付、ＲＭ与信限度額、ｅ－与信ナビ、ｅ－管理ファイル、モニタリング機能、反社チェックヒートマップ、J-MOTTO、サイバックスUniv.、与信管理

## 要確認（status に反映）

- businessModel: 2026年４月１日付で、連結子会社の日本アウトソース株式会社が、連結子会社のリスモン・マッスル・データ株式会社を吸収合併し、存続会社の商号をリスモン・マッスル・データ株式会社に変更しています（重要な後発事象に印字）。本登録は2026年３月31日現在のグループ構成に基づいており、合併後の取扱いは人の確認が必要です。
- businessStructure: 2026年４月１日付で、連結子会社の日本アウトソース株式会社が、連結子会社のリスモン・マッスル・データ株式会社を吸収合併し、存続会社の商号をリスモン・マッスル・データ株式会社に変更しています（重要な後発事象に印字）。本登録は2026年３月31日現在のグループ構成に基づいており、合併後の取扱いは人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
