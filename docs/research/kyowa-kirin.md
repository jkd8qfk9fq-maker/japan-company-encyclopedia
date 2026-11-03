# 協和キリン — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 協和キリン株式会社 |
| 証券コード | 4151 |
| docID（データを取り出した文書） | `S100XPTY` |
| 原本 docID | `S100XPTY` |
| 提出日（原本） | 2026-03-10 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XPTY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 協和キリン株式会社 / 4151 / docID S100XPTY（id は英語表記「Kyowa Kirin Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kyowa-kirin: 10 件の数値を有報XBRLと照合
有報: 協和キリン株式会社 有価証券報告書－第103期(2025/01/01－2025/12/31) (docID S100XPTY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業・財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kyowa-kirin: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 利益の段には、本文で書ける当期純利益（親会社の所有者に帰属する当期利益）だけを書きました。
- businessModel: 地域別の売上は、顧客の所在地を基礎とした分類（日本・米州・欧州・アジア・その他）の印字どおりです。
- businessModel: brief の注意（非継続事業・財務諸表の組替え）について：前期有報と重複年度は全て一致しており、売上収益・当期利益の比較に影響する記載は読み取れなかったため、basis は付けていません。
- businessModel: financialNotes は IFRS 採用という事実のみ。変則決算・決算期変更はありません。
- businessStructure: 構造：有報は「医薬事業」の単一セグメントで、報告セグメント別の記載を省略しています。医薬事業を親ノードとし、【関連情報】の製品及びサービスごとの外部顧客売上収益（製商品・技術収入）を、金額の大きい順に children にしました。
- businessStructure: 地域別売上収益（日本・米州・欧州・アジア）は事業の区分ではなく顧客所在地による分類なので、親ノードの説明にだけ書き、children にはしていません。
- businessStructure: 技術収入の具体的な中身（どの契約・どの製品か）は有報に印字されていないため、書いていません。BioWa, Inc.の記述は関係会社の状況の印字のみで、技術収入との対応は断定していません。
- businessStructure: 製品名は【経営方針、経営環境及び対処すべき課題等】に印字されたものだけを使いました。製品ごとの売上は印字されていないため書いていません。
- businessStructure: Wikipedia は証拠パックに無いため使っていません。
- history: 沿革の表は年月と事象が一続きの文章として抽出されており、行ごとの対応は事象文の順で読み取りました。年と月は事象文のすぐ前の年月から採っています。
- history: 沿革の事象のうち、1981年の協和メデックス設立、2004年の協和発酵ケミカルへの商号変更、2005年の協和発酵フーズ設立などは、近い年の出来事と同じ項目にまとめるか省きました。
- history: Orchard Therapeutics Limitedの清算結了（2026年1月20日）は有報の事業の内容に書かれた事実で、提出日（2026年3月10日）より前のため完了として書いています。
- industry: 単一セグメント「医薬事業」で、医療用医薬品の製造・販売が事業のすべてのため、医薬品のみを primary にしました。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済み企業との同一性を確認できないため、関連企業は1社も結んでいません。
- relatedCompanies: キリンホールディングス株式会社：親会社（議決権の被所有割合55.2％、2025年12月31日現在）だが、掲載済みの候補一覧が無く同一性を確認できないため結んでいない。掲載済みなら parent で結ぶ候補。
- relatedCompanies: 協和キリン富士フイルムバイオロジクス株式会社（持分法適用会社、議決権50.0％）・キリンバイオマテリアル株式会社・Cowellnex株式会社：候補一覧が無く、上場かどうかも確認できないため結んでいない。
- relatedCompanies: 富士フイルム株式会社：合弁相手だが、候補一覧が無く同一性を確認できないため結んでいない。
- relatedCompanies: Amgen社・Boehringer Ingelheim社・Kura Oncology社・CVS Caremark社：海外企業で掲載対象外のため結んでいない。
- terms: 用語の助言：「バイオシミラー」「抗体医薬」「造血幹細胞遺伝子治療」「希少疾患」「IFRS」「完全子会社」「持分法適用会社」は、読者が初めて目にする語として用語集に加える候補です。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
