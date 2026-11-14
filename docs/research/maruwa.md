# 株式会社ＭＡＲＵＷＡ — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＭＡＲＵＷＡ |
| 証券コード | 5344 |
| docID（データを取り出した文書） | `S100YB11` |
| 原本 docID | `S100YB11` |
| 提出日（原本） | 2026-06-12 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YB11.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＭＡＲＵＷＡ / 5344 / docID S100YB11（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
maruwa: 10 件の数値を有報XBRLと照合
有報: 株式会社ＭＡＲＵＷＡ 有価証券報告書－第53期(2025/04/01－2026/03/31) (docID S100YB11)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
maruwa: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社MARUWA」が EDINET の提出者名「株式会社ＭＡＲＵＷＡ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営上の目標の指標として有報は「売上高営業利益率」を重要な指標と印字しているが、利益率の語を含むため本文には書かず、数値目標とあわせて記載を省いた。
- businessModel: 主要な顧客のHAINAN THING LOT TECHNOLOGY CO.,LTDは関連候補になく、未上場の海外法人のため relatedCompanies には結ばず、顧客の事実を businessModel と industryPosition に記載した。
- businessModel: セグメントの金額はセグメント情報の外部顧客への売上高を用いた（MD&Aのセグメント別売上高も同じ外部ベースの数値である）。
- businessModel: wikipedia.json は found=true だったが、有報の記載を超える利用可能な情報はなかったため、出典には加えていない。
- businessStructure: 報告セグメントは外部顧客への売上高の大きい順（セラミック部品事業、照明機器事業）に並べた。金額はセグメント情報の外部顧客への売上高の印字どおりで、セグメント間の内部売上高を含むMD&Aの数値とは異なる場合がある。
- businessStructure: 子区分は【事業の内容】の品目の記載によった。品目別の金額は開示されていないため、子区分の説明に金額は書いていない。
- history: 沿革の末尾は日付セルと出来事の対応が崩れて印字されているため、行順に対応させた（2022年4月＝市場区分の移行とMARUWA CERAMIC・MARUWA QUARTZの吸収合併、2023年5月＝瀬戸工場の新設）。
- history: 山の田工場・土岐工場の新設、韓国・ドイツ・イギリス・アメリカ・中国・台湾・インドの販売子会社の設立は、軽微な拠点・組織の変更として省いた（マレーシア生産子会社のみ生産拠点として残した）。
- history: 沿革に資本金の金額は印字されておらず、書いていない。
- industry: セラミック基板や半導体装置用部品などの電子部品が事業の中心のため、主たる業界を electronics とした。照明機器事業も照明機器の製造販売であり、独立した閉じた分類値はないため、副次の業界は追加しなかった。
- relatedCompanies: 名古屋銀行（8522）：特定投資株式として5,500株を保有する旨の印字はあるが、保有目的は「当社グループの金融取引先として財務活動の円滑化のため」とされており、資金調達に関わる金融取引のみのため結ばなかった。
- relatedCompanies: ローム（6963）：2023年3月期に保有目的を純投資目的に変更した旨が印字されており、取引関係の維持・強化を目的とする政策保有ではなくなっているため結ばなかった。
- relatedCompanies: ノリタケ（5331）：2023年3月期に保有目的を純投資目的に変更した旨が印字されており、取引関係の維持・強化を目的とする政策保有ではなくなっているため結ばなかった。
- relatedCompanies: 株式会社神戸アート：有報で「その他の関係会社」とされるグループ会社であり、関連企業リンクの対象ではないため結ばなかった。
- relatedCompanies: 連結子会社13社：グループ会社のため結ばなかった。
- relatedCompanies: 高速、エン、ベース、フリー、ホープ、スペース、ゼロ、光通信、IC：社名の一般語・部分一致のみで、本文に取引・提携・資本関係の印字がないため結ばなかった（光通信は「光通信市場」という市場名への一致）。
- relatedCompanies: トラスト：日本マスタートラスト信託銀行（信託口）の信託口表記への一致で、候補自体もコードリストにないため結ばなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
