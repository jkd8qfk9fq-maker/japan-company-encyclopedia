# 鈴茂器工 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 鈴茂器工株式会社 |
| 証券コード | 6405 |
| docID（データを取り出した文書） | `S100YN3J` |
| 原本 docID | `S100YN3J` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YN3J.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 鈴茂器工株式会社 / 6405 / docID S100YN3J（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
suzumo-machinery: 10 件の数値を有報XBRLと照合
有報: 鈴茂器工株式会社 有価証券報告書－第66期(2025/04/01－2026/03/31) (docID S100YN3J)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
suzumo-machinery: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正の状況: 本有報（S100YN3J）は未訂正である（amendments status none、訂正書類なし、DEIの訂正フラグはすべて false、2026-11-12まで確認）。前期有報との修正再表示チェックは全6系列で差異ゼロだった。
- businessModel: 主要な経営指標等の注記1（潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していない旨）と注記3（株式給付信託（BBT-RS及びJ-ESOP）に残存する自社株式の自己株式への算入）は表示・計算に関する事項のため financialNotes には載せず warnings の扱いとした。注記2の株式分割（2022年8月1日、1株につき2株）は financialNotes に2023年3月期の注記として登録した。
- businessModel: 主要株主だったGulf Japan 1（議決権等の被所有割合13.87％）との資本業務提携は2025年8月に解消され、当連結会計年度に当社がGulf Japan 1から自己株式を取得した結果、Gulf Japan 1は主要株主に該当しなくなった（関連当事者情報）。期中の出来事であり期末時点の株主構成に反映済みのため、needsReview には入れず warnings に記録した。自己株式の取得金額は本文の数値規則により記載していない。
- businessModel: 中期経営計画「Next 2028」の目標数値（2028年3月期の売上高・利益・ROEの目標）は、投資指標・目標に当たるため perspectives と本文に記載していない。基本方針と戦略の定性的な内容だけを strategy に要約した。
- businessModel: MD&Aに印字された売上高と当期純利益以外の利益項目の金額・増減率、生産実績・受注実績・販売実績の金額（販売実績は売上高と同一のため flow で売上高として記載）、財政状態の内訳金額は、本文の数値規則に従い本文に記載していない。
- businessModel: 親会社株主に帰属する当期純利益は602,992千円を百万円未満切り捨てで602百万円とした。MD&Aの概況表では603百万円と丸めて印字されているが、千円額の切り捨て規則を優先した。
- businessModel: Wikipedia の記事（証券コードで同一性を確認済み）の冒頭は、米飯加工機械などの食品加工機械を製造する企業である旨など有報と重なる内容のみで、有報に無い補足は得られなかったため使用せず、出典にも加えていない。
- businessStructure: 当社グループは米飯加工機械関連事業の単一セグメントであり、セグメント情報の記載は省略されている。事業は【事業の内容】の3区分（米飯加工機械関連・衛生資材関連・店舗システム関連）を単一セグメントの children として登録した。区分ごとの売上高は独立して開示されていないため、金額は親事業の連結売上高と【関連情報】の地域別売上高だけを記載した。
- businessStructure: 店舗システム関連の事業を行っていた株式会社日本システムプロジェクトは、2025年9月1日付で当社を存続会社とする吸収合併により消滅し、連結の範囲から除外されている（関係会社の状況の注記）。期末時点の構造で登録しており、needsReview には入れていない。
- businessStructure: 主要な設備はすべて単一セグメント（米飯加工機械関連）に帰属するため、設備の事業への対応づけは行っていない。帳簿価額は本文の数値規則により記載していない。
- businessStructure: 2026年6月に登記上の本店所在地を東京都練馬区へ変更している（沿革）。表紙の本店所在地は変更後の練馬区豊玉北であり、登録内容と矛盾しないため needsReview には入れず、沿革に印字どおり記録した。
- history: 沿革から、本社・工場・営業所の移転や開設、工場の竣工・増築、米国子会社Suzumo Machinery USA Inc.の設立と清算、北海道鈴茂販売株式会社・株式会社ピーケーサポートの子会社化と吸収合併、各地の出張所開設などの行は、会社の転機に当たるものだけを残し落とした（落とした行は沿革表の印字どおり多数）。資本金の金額に関する行は規則により記載していない。
- history: 2025年の鶴ヶ島テックプラント竣工は、生産戦略で新工場のライン生産方式への移行が位置づけられているため、2025年の吸収合併の項目の significance に併記した。
- industry: 主たる業界は、寿司ロボット等の米飯加工機械の製造・販売が事業の中心であることから machinery を選んだ。衛生資材と店舗システムは単一セグメントの中で独立した売上開示がなく、金額が独立して開示されていない事業には業界を足さない規則により、2つ目の業界は付けなかった。閉じた分類に直接適合するため暫定分類は使わず、taxonomyGap は記録していない。
- relatedCompanies: 候補のうち vision、rent、zero、en、base-4481、lec、port、land、corona、no-1 は社名の一般語・部分一致のみで、有報に取引・提携・資本関係の記述が無いため結ばなかった。
- relatedCompanies: 候補 suzuki-6785（鈴木）は社名の部分一致のみである。有報の大株主に載る鈴木美奈子氏・鈴木映子氏は個人であり、当該候補企業ではないため結ばなかった。
- relatedCompanies: 候補 trust はコードリストにない（上場でない）うえ、有報に取引・提携の記述も無いため結ばなかった。大株主の日本マスタートラスト信託銀行株式会社（信託口）と株式会社日本カストディ銀行（信託Ｅ口）は信託・保管口座であり、純投資のため結ばない。
- relatedCompanies: 候補外だが記録する: Gulf Japan 1 は主要株主（議決権等の被所有割合13.87％）かつ資本業務提携の相手方だったが、2025年8月に提携を解消し、当期に当社が同社から自己株式を取得した結果、2026年3月31日現在は主要株主に該当しない。候補一覧に無いため結ばなかった。Mizuho Gulf Capital Partners Ltd も提携解消済みの相手方で、候補一覧に無いため結ばなかった。
- relatedCompanies: 候補外だが記録する: 合同会社アン・コーポレーションは大株主（所有割合10.87％、2026年3月31日現在）だが候補一覧に無いため結ばなかった。立花証券株式会社（同2.36％）も候補一覧に無いため結ばなかった。
- relatedCompanies: 当社の連結子会社（株式会社セハージャパン、Suzumo International Corporation、Suzumo Singapore Corporation）と持分法適用関連会社（Bluefin Trading LLC）は、自社グループのため関連企業には結ばない。
- terms: 用語の助言（解説は書かない）: 以下の固有表現・専門用語について、用語集への収録候補として助言します。「寿司ロボット（寿司用の米飯加工機械）」「盛付けロボット（ご飯の盛付け用米飯加工機械）」「Fuwarica（ご飯盛付けロボットの製品名）」「米飯加工機械（ご飯を加工する機械の総称）」。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
