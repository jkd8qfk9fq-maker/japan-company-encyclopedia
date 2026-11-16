# テラテクノロジー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | テラテクノロジー株式会社 |
| 証券コード | 483A |
| docID（データを取り出した文書） | `S100YGDD` |
| 原本 docID | `S100YGDD` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGDD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | テラテクノロジー株式会社 / 483A / docID S100YGDD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 6 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tera-technology: 6 件の数値を有報XBRLと照合
有報: テラテクノロジー株式会社 有価証券報告書－第36期(2025/04/01－2026/03/31) (docID S100YGDD)
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
tera-technology: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 指標注記（潜在株式調整後1株当たり当期純利益の算定方法、上場に伴う取扱い、従業員数の basis、連結財務諸表の作成・監査の basis）は表示・算定上の事項のため financialNotes には入れていない。2025年12月の上場自体は沿革に記録した。
- businessModel: 前期の有報がEDINETの窓内になく、修正再表示の照合はできなかった（証拠パックの restatementCheck の注記のとおり）。訂正有報はない（summary.json で確認）。
- businessModel: MD&Aの利益段階の金額と増減理由、受注高・受注残高の金額は、本文の規則により書いていない。
- businessModel: 開発部門従業員数を毎期増やすという経営上の目標は数値目標のため、本文と戦略の説明には書いていない。
- businessModel: 分野別の金額は販売実績の印字（千円額を百万円に切り捨て）で、合計との差は businessStructure の warnings に記録した。
- businessStructure: 単一セグメント（システム開発事業）のため、【事業の内容】とMD&Aの分野別販売実績に沿って5つのサービス分野を children とした。並び順は2026年3月期の分野別販売実績の大きい順。分野別の金額はセグメント注記ではなく販売実績の印字であり、千円額を百万円に切り捨てた children の合計は4,746百万円で、連結売上高4,749百万円との差3百万円は切り捨てによるものとして印字の分野別金額をそのまま使った。
- businessStructure: 本社（東京都豊島区、303人）と松江R&Dセンター（島根県松江市、34人）は単一セグメントの全社設備のため、特定の children には結びつけていない。連結従業員数は363人（2026年3月31日現在）。
- businessStructure: 連結子会社は知識工学株式会社（長野市、議決権100％）1社で、システム開発の委託を受けている。同社は製造分野を得意とする旨を製造その他分野の説明に書いた。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。個別に印字された仕入先はない（外注は一般的な記述のみ）。
- history: 増資の各行（1992年・1993年・1997年の資本金の増額）は資本金額を含む事項のため落とした。
- history: 本社移転の各行（1992年上池袋、1996年東池袋）は事業の転機ではないため落とした。
- history: 一般労働者派遣事業許可の取得（2000年）、ISO9001・ISO14001・ISO/IEC27001やプライバシーマークの認証取得、健康優良企業の認定（2022年）は、認証・認定に関する事項のため落とした。
- history: 2022年の組織変更（4事業部6部門）、2024年のローコード開発プロジェクト拡大の行は、事業分野の出来事として分野の説明に含まれる内容のため独立した沿革項目にはしなかった。
- history: 2014年8月の商号変更・本社移転と同年9月の事業譲渡は、知識工学株式会社に関する一連の出来事として2014年の1項目にまとめた。
- history: Wikipedia は見つからなかったため使っていない。
- industry: 主たる業界は it とした。売上の全てがシステム開発事業（受託開発と運用・保守、自社チャットサービス）によるものであるためである。
- industry: DEIの別記事業は CTE と印字されているが、事業の実態は情報システムの開発・運用であるため it を採った。
- relatedCompanies: career / seki / en / freee / ray / space / transaction / core / corona / ic / kohsoku / lec / vision / system-integrator: いずれも一般語・部分一致のみで、各候補会社についての取引・提携・資本関係の記載はないため結んでいません（一致箇所はキャリア、セキュリティ、エンジニア、フリーキャッシュ・フロー、レイアウト、スペース、トランザクションデータ、コアパートナー、新型コロナウイルス感染症、ICカード、高速大容量、フレックスタイム制、ビジョン、システムインテグレーターの定義など）。
- relatedCompanies: taya / tokyu: 大株主表の住所（世田谷区）・建物名（渋谷道玄坂東急ビル）として現れるのみで、各候補会社との取引・提携・資本関係の記載はないため結んでいません。
- relatedCompanies: nissin: コードリストにない相手で、新株予約権の定型文中の部分一致のみのため結んでいません。
- relatedCompanies: 株式会社ネッツは【大株主の状況】に発行済株式の52.76％を保有する筆頭株主として印字されていますが（2026年3月31日現在）、候補にない非上場の会社であり、【関係会社の状況】に親会社としての記載もないため結んでいません。
- relatedCompanies: 連結子会社である知識工学株式会社は自社の子会社のため結んでいません。
- relatedCompanies: 大手情報提供サービス会社（2005年から取引）・大手通信キャリア（2012年から取引）は社名が印字されていないため、関連企業としては結んでいません。
- terms: 助言のみ。用語としては「SIer」「コアパートナー」「組織戦略パートナー」「プロパー比率」「継続受注率」「ChatCo!」「RADIUS認証」「テレマティクス」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
