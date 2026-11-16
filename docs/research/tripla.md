# tripla — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ｔｒｉｐｌａ株式会社 |
| 証券コード | 5136 |
| docID（データを取り出した文書） | `S100XH92` |
| 原本 docID | `S100XH92` |
| 提出日（原本） | 2026-01-26 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XH92.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ｔｒｉｐｌａ株式会社 / 5136 / docID S100XH92（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tripla: 4 件の数値を有報XBRLと照合
有報: ｔｒｉｐｌａ株式会社 有価証券報告書－第11期(2024/11/01－2025/10/31) (docID S100XH92)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-10-31","previousFiling":209347000,"latestFiling":209389000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-10-31","previousFiling":246220000,"latestFiling":244591000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-10-31","previousFiling":10958184000,"latestFiling":10995128000},{"key":"NetAssetsSummaryOfBusinessResults|2024-10-31","previousFiling":1102404000,"latestFiling":1108966000}]
利益・総資産・純資産・従業員数: 8 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tripla: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「tripla株式会社」が EDINET の提出者名「ｔｒｉｐｌａ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年10月期の financialNote の候補として、「法人税、住民税及び事業税等に関する会計基準」（企業会計基準第27号　2022年10月28日）等を第11期の期首から適用しておりますが、主要な経営指標等への影響はありません、という注記が主要な経営指標等の注記５に印字されている。同年度の financialNotes は暫定的な会計処理の確定の note を優先して登録したため、この注記はここに全文を記録する。
- businessModel: 前期有報との差異（2024年10月期の親会社株主に帰属する当期純利益 209,347千円から209,389千円への変更など）は、企業結合に係る暫定的な会計処理の確定によるものであることを、主要な経営指標等の注記４と企業結合等関係の注記で確認し、2025年10月期の financialNote に記録した。本文の数値は今期有報の値を用いた。
- businessModel: MD&Aに印字された利益に関する金額と増減率は、規則により本文に書かなかった。売上高の増減とその理由に相当する範囲のみを書いた。経営上の目標の指標として印字された利益の金額も本文と perspectives には書かなかった。
- businessModel: 2025年12月に連結子会社のPT. tripla BookandLink Indonesiaのサーバーへの不正アクセスの形跡が確認され、個人情報の漏洩が発生したことは、対処すべき課題と事業等のリスクに印字されている。期末後の出来事だが報告書自体に開示され、事業構成の変更ではないため needsReview には入れず、ここに記録する。再発防止策として親会社の厳格なセキュリティ基準の適用などが印字されている。
- businessModel: 本文に財務諸表の組替えの記載がある旨の証拠パックの注意については、組替えの具体的な注記を sections で確認できず、差異の理由は暫定的な会計処理の確定で説明が付くため、perspectives の basis には組替えを根拠とする記述は書かなかった。
- businessStructure: 単一セグメントのため、事業の children はセグメント情報の【関連情報】が参照する収益認識関係の分解情報（tripla Book 1,814,027千円、tripla Bot 411,617千円、その他 347,898千円）を千円額を百万円に切り捨てて用いた。MD&Aの販売実績の注記にある tripla Book 1,814,027千円・tripla Bot 411,617千円とも一致する。
- businessStructure: 地域別の営業収益（日本 2,124百万円、台湾 260百万円、アジア 179百万円、その他 9百万円。いずれも千円額の切り捨て）は事業区分ではないため businesses には分けず、ここに記録する。
- businessStructure: 連結子会社は8社（PT. tripla BookandLink Indonesia、翠普拉台灣股份有限公司、旭海國際科技股份有限公司、品辰旅行社有限公司、tripla Singapore Pte. Ltd.、tripla Hong Kong Limited、tripla USA, Inc.、tripla Philippines Technologies Inc.）で、いずれも自社グループ会社のため関連企業には含めなかった。tripla (Thailand) Co., Ltd. と tripla Thai Holdings Co., Ltd. は非連結子会社として開示されている。
- businessStructure: 2025年４月にシンガポール子会社間で吸収合併が行われ、存続会社の商号が tripla Singapore Pte. Ltd. に変更されたことは、期末現在の関係会社の状況に反映済みのため、事業構成は期末現在の構成で記載した。
- history: 沿革は年月まで印字されているが、規則により year のみの記載とし、月は title・description の本文に必要な範囲でのみ触れた（2022年の上場月など）。資本金の金額は沿革に書かなかった。沿革に印字された個別の小規模な出来事（プライバシーマーク認証取得、札幌オペレーションセンター開設単体など）は、主要な転機に絞って他の出来事とまとめたものがある。
- industry: 主たる業界は it とした。単一セグメントのホスピタリティソリューション事業は宿泊施設向けのクラウドサービスの提供であり、営業収益の全額がこれに当たる。DEIの別記事業も情報・通信業であり、閉じた分類にそのまま合うため taxonomyGaps は記録しなかった。
- relatedCompanies: quest（株式会社クエスト）: 一致は「リクエスト」の語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguous で、一致は「セキュリティ」などの一般語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: en（エン株式会社）: ambiguous で、一致は「予約エンジン」などの語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: path（パス株式会社）: ambiguous で、一致は「パーパス」などの語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 一致は「新型コロナウイルス」の語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 一致は「レポート」などの語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 一致は「ブランド」などの語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: lec（レック株式会社）: 一致は「フレックス」などの語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 一致は「ベース」などの一般語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: hub（株式会社ハブ）: ambiguous で、一致は「コネクティビティハブ」の語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: ray（株式会社レイ）: ambiguous で、一致は「レイアウト」などの語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: core（株式会社コア）: ambiguous で、一致は「コア」などの一般語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 一致は「イノベーション」の一般語によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: king（株式会社キング）: 一致は一般語の一部によるもので、同社への言及はないため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development（住友不動産株式会社）: 一致は最寄りの連絡場所である住友不動産西新宿ビルの住所表記によるもので、取引や提携の言及はないため結ばなかった。
- relatedCompanies: taya（株式会社田谷）: ambiguous で、同社への言及はないため結ばなかった。
- relatedCompanies: 大株主は個人と信託・証券などの金融機関口座が中心で、事業会社の大株主はなく、関連企業には含めなかった。株式の保有状況は該当事項なしと印字されている。
- relatedCompanies: チャネルマネージャー「TLリンカーン」「ねっぱん」「らく通with」の提供会社、デジタルギフト「デジコ」を提供する株式会社DIGITALIO、OpenAI社は、連携先として本文に言及があるが関連企業の候補一覧にないため結ばなかった。
- relatedCompanies: 連結子会社8社は自社グループ会社のため、関連企業には含めなかった。
- terms: 用語の助言: 「tripla Book」は宿泊施設の公式サイトに組み込んで自社予約を可能にするクラウド型の公式サイト予約システム、「tripla Bot」は宿泊客の質問にAIが自動回答するチャットボット、「tripla Connect」は宿泊施設向けのCRM・MAツールです。「チャネルマネージャー」はOTAや予約システムなどの複数の宿泊予約情報と宿泊施設の基幹システムを連携し、在庫やプラン、価格をまとめて管理するシステムで、国内ではサイトコントローラーとも呼ばれます。「OTA」は実店舗を持たずインターネット上のみで旅行商品を取引する旅行会社、「PMS」は宿泊施設が部屋在庫や予約情報などを管理する基幹システム、「取扱高・GMV」はtripla Book経由の宿泊代金の総額を指します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
