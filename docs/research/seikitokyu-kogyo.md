# 世紀東急工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 世紀東急工業株式会社 |
| 証券コード | 1898 |
| docID（データを取り出した文書） | `S100YEPV` |
| 原本 docID | `S100YEPV` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEPV.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E4%B8%96%E7%B4%80%E6%9D%B1%E6%80%A5%E5%B7%A5%E6%A5%AD

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 世紀東急工業株式会社 / 1898 / docID S100YEPV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
seikitokyu-kogyo: 10 件の数値を有報XBRLと照合
有報: 世紀東急工業株式会社 有価証券報告書－第77期(2025/04/01－2026/03/31) (docID S100YEPV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
seikitokyu-kogyo: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益だけとし、経常利益・セグメント利益・受注高の金額は書かなかった（増減率もセグメント利益については書いていない）。
- businessModel: 中期経営計画の計画数値（2026年度予想や2030年度目標の売上高・利益・ROE等）は将来の目標値のため本文には書かなかった。
- businessModel: 会計方針の変更・表示方法の変更の印字はなく、前期有報との修正再表示チェックも全行一致だったため financialNotes は空にした。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」で、株式分割の印字もないため needsReview は空。提出後の文書（otherFilingsInWindow）も無く、ack は不要だった。
- businessStructure: 報告セグメントは建設事業と舗装資材製造販売事業の2つで、セグメント情報の外部顧客への売上高の大きい順に並べた。「その他」は報告セグメントに含まれない区分（売電事業等）のため最後に置いた。
- businessStructure: 建設事業の子区分は連結の売上実績（工種別）の金額順に並べた。舗装資材製造販売事業は連結での製品別内訳が開示されていないため子区分を設けなかった（提出会社単独の製造・販売状況の金額は連結の数値と異なるため使っていない）。
- businessStructure: 株式会社ゼネラルアクトは2025年12月10日に全株式を取得して連結子会社化した期中の出来事で、期末（2026年3月31日）の構成に反映されているため、沿革とwarningsに記録し、needsReviewには入れなかった。
- businessStructure: 【関係会社の状況】の表に載る連結子会社は11社だが【事業の内容】は子会社12社としており、中外エンジニアリング株式会社は【事業の内容】で建設事業の担い手として挙げられている会社として数に含めた。
- businessStructure: 東急株式会社は related-candidates.json に無いため関連企業としては結んでおらず、【事業の内容】の印字どおり工事の受注先として事業説明に記した（関連企業フラグメントの warnings に理由を記録）。
- history: 沿革の全41行を転記した（年月と事象の対応は行順どおり）。
- history: 1950年1月の設立行に印字された資本金1百万円は、資本金の金額を本文に書かない規則により省いた。
- history: 株式会社ゼネラルアクトの全株式取得（2025年12月）は期中の出来事で期末の構成に反映されているため、needsReviewではなく沿革に記録した。
- history: 略称「世紀工（せいきこう）」はWikipediaの補足で有報に印字はなく、数値はWikipediaから採っていない。本社所在地（東京都港区）は【主要な設備の状況】の印字に基づく。
- industry: 主たる業界は建設：報告セグメントの建設事業が外部売上高の約8割を占める。舗装資材製造販売事業は道路建設の資材部門であり、閉じた分類に建材の値がなく、化学にも当たらないため副次の業界は付けなかった。
- relatedCompanies: 東急株式会社：【関係会社の状況】で「その他の関係会社」に区分され（議決権の被所有割合4.40％、大株主の状況では4.19％）、当社が舗装・土木工事等の請負を受注する相手だが、related-candidates.json に無いため候補からのみ選ぶ規則により結ばなかった。役割は businessModel の flow と businessStructure の事業説明に印字どおり記録した。
- relatedCompanies: 株式会社三菱UFJフィナンシャル・グループ：特定投資株式として保有していたが当事業年度中に全株式を売却し期末の保有はなく、保有目的も「安定した金融取引関係の構築」という定型文のみのため結ばなかった。
- relatedCompanies: 株式会社みずほフィナンシャルグループ：三菱UFJフィナンシャル・グループと同様、当事業年度中に全株式を売却し期末の保有はなく、保有目的も金融取引関係の定型文のみのため結ばなかった。
- relatedCompanies: 三菱商事株式会社：有価証券明細表に投資有価証券として小口が計上されるだけで、取引・提携の印字がないため結ばなかった。
- relatedCompanies: ビジョン（9416）：長期ビジョンの「ビジョン」という語への一致で、会社との関係の印字はないため結ばなかった。
- relatedCompanies: エン（4849）：連結子会社「中外エンジニアリング」の名称の一部への曖昧な一致で、別法人のため結ばなかった。
- relatedCompanies: 高速（7504）：「高速道路」という語への曖昧な一致で、会社との関係の印字はないため結ばなかった。
- relatedCompanies: やまびこ（6250）：連結子会社「やまびこ工業株式会社」の名称の一部への一致で、上場会社の株式会社やまびことは別法人のため結ばなかった。
- relatedCompanies: 大和（8247）：連結子会社・新世紀工業株式会社の所在地「奈良県大和郡山市」への曖昧な一致のため結ばなかった。
- relatedCompanies: キャリア（6198）・イシン（143A）・コア（2359）・IC（4769）・セキ（7857）・あらた（2733）・ベース（4481）・コロナ（5909）：いずれも一般語への一致で、当社との取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: トラスト（3347）：日本マスタートラスト信託銀行株式会社（信託口）への一致で、コードリストにない信託口名義のため結ばなかった。
- relatedCompanies: ガルフシール工業株式会社（関連会社）と能登アスコン株式会社（関連会社）は自社グループの関連会社そのものであり、上場の百科事典エントリーが無いため関連企業には結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語の助言のみ。本文の根拠はいずれも有報の記載に基づく。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
