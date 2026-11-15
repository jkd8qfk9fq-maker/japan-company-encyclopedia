# L is B — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｌ　ｉｓ　Ｂ |
| 証券コード | 145A |
| docID（データを取り出した文書） | `S100XYHQ` |
| 原本 docID | `S100XRTM` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XYHQ／有効文書 S100XYHQ（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XYHQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｌ　ｉｓ　Ｂ / 145A / docID S100XRTM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
l-is-b: 4 件の数値を有報XBRLと照合
有報: 株式会社Ｌ　ｉｓ　Ｂ 訂正有価証券報告書－第16期(2025/01/01－2025/12/31) (docID S100XYHQ)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第16期(2025/01/01－2025/12/31)、docID S100XYHQ）を有効文書としてこのパックを作った。原本は docID S100XRTM。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはIndependentAuditorsReportConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
l-is-b: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社L is B」が EDINET の提出者名「株式会社Ｌ　ｉｓ　Ｂ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨てて表記した（切り上げはしていない）。DXソリューション事業のストック売上高1,768百万円とプロフェッショナルサービスその他売上高364百万円の合計は、売上高2,132百万円と一致する。
- businessModel: 有効文書は訂正有価証券報告書（S100XYHQ、2026年４月14日提出）であるが、原本（S100XRTM、2026年３月24日提出）と主要財務の数値・本文は同一で、差異は独立監査人の監査報告書のテキストブロックのみである（record-only）。出典は訂正有価証券報告書とした。訂正を理由とする確認事項はない。
- businessModel: 投資事業は2025年12月期に開始した新しい報告セグメントであり、外部顧客への売上高はない。セグメントの変更は当期中に完了し期末の体制に反映されているため、沿革と本警告への記録とし、needsReviewにはしなかった。
- businessModel: IU BIM STUDIO株式会社は2025年12月期は貸借対照表のみを連結対象としており、収益への貢献は2026年12月期からとなる見込みである旨を事業の内容に基づき事業構造に記した。のれんの暫定的な金額そのものは本文に書いていない。
- businessModel: 主要な顧客である株式会社トラストバンク（「direct」のOEM提供先。当期の同社への販売高は469,283千円で総販売実績の22.0％）は未上場で、関連企業の候補にも含まれていないため関連企業には結ばず、事業構造と本警告に事実を記録した。
- businessModel: 2026年２月20日開催の取締役会で決議した譲渡制限付株式報酬制度の導入は、提出後の資本政策に関する決議であるため本文には書かず、本警告に記録した。
- businessModel: 会社独自の経営指標であるARR（当社単体、1,879,615千円）とストック売上比率（92.5％）は投資判断に関わる指標として本文の数値には使わず、契約社数696社のみを本文に記した。
- businessStructure: 連結子会社４社はいずれも未上場であり、有価証券報告書を提出している連結子会社はない。
- businessStructure: 投資事業は2025年12月期から開始した報告セグメントであり、当期の外部顧客への売上高はない。
- history: 沿革の表に印字された資本金の金額（設立時、資金調達時、上場に伴う増資時）は、資本金額を沿革に書かない取扱いにより省いた。
- industry: 主たる事業はビジネスチャット等のデジタルサービスの提供であり、DEIの別記事業も情報・通信（cte）であるため、it を主たる業界とした。投資事業は2025年12月期に開始したばかりで外部顧客への売上高がなく、独立した金額の開示もないため業界は付けなかった。
- relatedCompanies: trust（株式会社トラスト）: EDINETコードリストにない相手であり、有報に記載のある取引先は株式会社トラストバンク（未上場）で別の法人であるため結ばなかった。トラストバンクは「direct」のOEM提供先かつ最大の販売先であるが、未上場で候補に含まれていないため関連企業には結ばず、事実は businessModel の警告に記録した。
- relatedCompanies: seki（セキ株式会社）: 「セキュリティ」等の語の一致で、同社の社名の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: en（エン株式会社）: 「エンジン」「専門エンジニア」等の語の一致で、同社の社名の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: land（株式会社ランド）: 文章中の英単語の断片の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「サポート」の語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 経営理念の「ビジョン」という語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「営業利益ベース」の語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: king（株式会社キング）: 「Smart Working Solution」の英単語の断片の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: lec（レック株式会社）: 「フレックス制度」等の語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: cover（カバー株式会社）: 「カバーする」等の語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: hub（株式会社ハブ）: 「業務ツールのハブ」という語の一致で、同社の社名の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション」という一般語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: will（株式会社ウィル）: 文章中の語の一致で、同社の社名の記載はないため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 「セキュリティ事故の発生ゼロ」等の語の一致で、同社の社名の記載はないため結ばなかった（ambiguousでもある）。
- relatedCompanies: 株式会社Well Side（発行済株式の29.73％を保有する筆頭株主）と株式会社QTnet、株式会社サンロフトは未上場で候補に含まれていないため結ばなかった。楽天証券株式会社・株式会社SBI証券は証券会社の口座としての保有であり、純投資の名義であるため結ばなかった。
- terms: 用語の候補として、ビジネスチャット、SaaS（Software as a Service）、BIM（Building Information Modeling）、OEM、DX（デジタルトランスフォーメーション）、チャットボットを挙げる。いずれも有報の事業の内容の注記で定義が示されている語である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
