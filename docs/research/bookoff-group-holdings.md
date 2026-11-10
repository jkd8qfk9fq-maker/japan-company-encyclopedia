# ブックオフグループホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ブックオフグループホールディングス株式会社 |
| 証券コード | 9278 |
| docID（データを取り出した文書） | `S100YY2G` |
| 原本 docID | `S100YWGX` |
| 提出日（原本） | 2026-08-14 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | S100YY2G／有効文書 S100YY2G（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YY2G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ブックオフグループホールディングス株式会社 / 9278 / docID S100YWGX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
bookoff-group-holdings: 10 件の数値を有報XBRLと照合
有報: ブックオフグループホールディングス株式会社 訂正有価証券報告書－第8期(2025/06/01－2026/05/31) (docID S100YY2G)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第8期(2025/06/01－2026/05/31)、docID S100YY2G）を有効文書としてこのパックを作った。原本は docID S100YWGX。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
bookoff-group-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。決算期の変更は2020年6月の変更で経過期間の2021年5月期が14ヶ月決算だったが、表示している5年間（2022年5月期から2026年5月期）はいずれも5月期の12ヶ月決算であり、修正再表示チェックは前期有報と全行一致し、表示方法の変更にあたる注記も確認できないためである。決算期変更の事実は沿革に記載した。
- businessModel: 訂正有価証券報告書（S100YY2G）は原本（S100YWGX）との差異が役員の状況の節のみで財務・本文は同一の record-only 分類のため、needsReview には入れなかった。
- businessModel: 中期経営方針に印字された数値目標は業績目標のため perspectives には書かなかった。
- businessStructure: 報告セグメントはセグメント注記の2026年5月期の外部顧客への売上高の大きい順（国内ブックオフ事業112,665百万円、プレミアムサービス事業8,527百万円、海外事業7,153百万円）に並べ、「その他」は有報が報告セグメントに含まれないとする区分のため最後に置いた（1,776百万円）。
- businessStructure: 子区分の金額は独立して開示されていないため、各子区分の説明にその旨を明記し、金額は書かなかった。
- history: 沿革表は年月と事象が本文中に連続して印字されており、行順で対応づけて主な出来事を選んだ。
- history: 1991年の設立時の資本金額は本文ルールのため記載しなかった。
- history: 当社の法人格は形式上の存続会社（旧株式会社橘屋）に由来するが、有報の沿革が実質上の存続会社を中心に記載しているため、その流れに沿って記載した。
- industry: 主たる業界は、売上の大半を占める国内ブックオフ事業（リユース店舗の小売）から retail とした。フランチャイズ事業も同じ小売店舗の展開に含まれるため、2つ目の業界は付けなかった。
- relatedCompanies: dai-nippon-printing（大日本印刷）: 2025年3月までは当社のその他の関係会社だったが、2025年3月25日に当社株式の全てを売却した旨の連絡を受けており、関係が解消済みのため結ばなかった。
- relatedCompanies: izutsuya（井筒屋）・takashimaya（髙島屋）: hugallやaidectの出店先である百貨店・商業施設としての記載のみで、取引・提携の明記がないため結ばなかった。
- relatedCompanies: aeon-mall（イオンモール）: 専門店「あそビバ」の出店先モールの名称としての記載のみで、コードリストにない相手でもあるため結ばなかった。
- relatedCompanies: econos（エコノス）: コードリストにない相手で、純投資目的の保有に関する記載のみのため結ばなかった。
- relatedCompanies: trust（トラスト）: 日本マスタートラスト信託銀行（信託口）の名称の一部の一致で、コードリストにない相手でもあるため結ばなかった。
- relatedCompanies: land（ランド）・career（キャリア）・path（パス）・base-4481（ベース）・port（ポート）・seki（セキ）・en（エン）・ray（レイ）・tein（テイン）・insight（インサイト）・garden（ガーデン）: 一般語や店舗所在地などの部分一致のみで、会社としての関係の記載がないため結ばなかった。
- relatedCompanies: corona（コロナ）: 新型コロナウイルス感染症への言及のみで、会社としての関係の記載がないため結ばなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
