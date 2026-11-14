# KYORITSU — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＫＹＯＲＩＴＳＵ |
| 証券コード | 7795 |
| docID（データを取り出した文書） | `S100YJSY` |
| 原本 docID | `S100YJSY` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJSY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＫＹＯＲＩＴＳＵ / 7795 / docID S100YJSY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kyoritsu: 8 件の数値を有報XBRLと照合
有報: 株式会社ＫＹＯＲＩＴＳＵ 有価証券報告書－第45期(2025/04/01－2026/03/31) (docID S100YJSY)
前期有報との比較: 18 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kyoritsu: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社KYORITSU」が EDINET の提出者名「株式会社ＫＹＯＲＩＴＳＵ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 財務数値は売上高と親会社株主に帰属する当期純利益だけを書いた。経常利益・営業利益・セグメント利益の金額や増減率は書いていない。金額は千円の印字を百万円に切り捨てて書いた（42,920.314百万円→42,920百万円、1,174.170百万円→1,174百万円）。丸め上げはしていない。
- businessModel: 表示方法の変更（連結キャッシュ・フロー計算書で「投資有価証券売却損益」を独立掲記し、前期分を組み替えたもの）は表示の再分類のみで、売上高・純利益等の系列に影響しないため、financialNotesには入れず、この警告に記録した。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。決算期の変更や変則決算もない（summary.irregularPeriodsは空）。
- businessModel: 株式給付信託（J-ESOP）は2025年10月31日の取締役会決議で導入され、信託が保有する当社株式は自己株式として扱われている。対象は主に株式に関する指標のため、financialNotesには入れなかった。
- businessModel: perspectivesのstrategy.disclosedでは、中長期目標のうち売上高の目標だけを書いた。利益率や株主還元に関する比率の目標は、比率や投資の語に当たるため含めていない。
- businessModel: businessModel.suppliersは置かなかった。有報は自社の調達について一般名詞で仕入先を述べていないためである（棚卸資産の「原材料及び貯蔵品」という科目名だけでは調達先の記述にならない）。
- businessModel: セグメント別の売上高はMD&Aの記述（計の行）ではなく、セグメント注記の外部顧客への売上高を使った。両者は当期は切り捨て後の百万円で一致する。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順（プリントメディア29,209／情報デジタル10,791／環境1,992／ＢＰＯ927百万円）。金額はセグメント注記の外部顧客への売上高（千円）を百万円に切り捨てたもので、MD&Aのセグメント売上高（内部売上高を含む計の行）ではない。切り捨てのため4事業の合計（42,919百万円）は連結売上高42,920百万円と1百万円異なる。有報の印字どおりの合計を本文の売上高として使った。
- businessStructure: グループ構成は【事業の内容】の印字どおり当社・連結子会社13社・非連結子会社2社とした。
- businessStructure: 【主要な設備の状況】で本社（東京都板橋区）はプリントメディア事業・情報デジタル事業の連記行のため、特定の事業には結びつけていない。本庄市の工場はプリントメディア事業の行として印字されているため、その範囲でだけ触れた。
- history: 沿革は当社（ＫＹＯＲＩＴＳＵ）の沿革と、有報が別掲する共立印刷株式会社の沿革の両方から主要な節目を選んだ。本社移転・子会社の設立などの細目は省いた。子会社化した会社の資本金の金額は書いていない。
- history: 株式会社Ｍ＆Ｃの連結子会社化は沿革では2025年５月、セグメント注記ののれんの注記では2025年６月と印字が異なる。年だけを書く沿革の形では影響しないため、月は書いていない。
- industry: 主たる業界はmediaとした。最大の報告セグメントはプリントメディア事業（外部顧客への売上高29,209百万円）で、商業印刷・出版印刷が中核であり、閉じた分類に印刷に当たる区分はない。公開済みの同業大手（大日本印刷・TOPPANホールディングス）や共同印刷でも印刷事業の中核はmediaとされている先例に従った。
- industry: 情報デジタル事業（ＤＭ・電子書籍・広告・ＷＥＢマーケティング）もメディア・広告の領域であり、it等の副次分類は付けていない。環境事業（リサイクル・廃棄物処理）とＢＰＯ事業（ロジスティック・商業流通）は報告セグメントとして開示されているが、閉じた分類に合う区分がなく、売上も小さいため副次分類は付けていない。
- relatedCompanies: monotaro・k-s-holdings・belluna: 【事業等のリスク】（特定の取引先への依存度）で上位の得意先として具体名が印字されているためcustomerとした。上位５社の売上高合計の割合は比率のため説明には書いていない。３社とも特定投資株式にも載るが、結んだ根拠はそちらではない。
- relatedCompanies: tokyo-printing-ink-mfg・komori: 【大株主の状況】に事業会社として載る大株主（2026年3月31日現在、東京インキ5.41％、小森コーポレーション4.83％）のためmajor-shareholderとした。特定投資株式の保有目的の定型句は根拠にしていない。
- relatedCompanies: base-4481: 「連結ベース」等の一般語と、連結子会社「株式会社バッハベルク」の一部（ベルク）が一致したもの。ベース株式会社への言及ではない。
- relatedCompanies: belc: 連結子会社「株式会社バッハベルク」の名称の一部が一致したもの。株式会社ベルクへの言及ではない。
- relatedCompanies: port: 「ポートフォリオ経営」等の一般語の一致で、ポート株式会社への言及ではない。
- relatedCompanies: zero: ambiguous。「残存価額をゼロ」等の一般語の一致で、株式会社ゼロへの言及ではない。
- relatedCompanies: rent: 「タレント性」等の一般語の一部が一致したもの。株式会社レントへの言及ではない。
- relatedCompanies: career: 「キャリア形成」等の一般語の一致で、株式会社キャリアへの言及ではない。
- relatedCompanies: seki: ambiguous。「セキュリティ」等の語の一部で、セキ株式会社への言及ではない。
- relatedCompanies: vision: 連結子会社の前身である「株式会社インフォビジョン」等の名称の一部が一致したもの。株式会社ビジョンへの言及ではない。
- relatedCompanies: corona: 新型コロナウイルス感染症の記述で感染症を指し、株式会社コロナへの言及ではない。
- relatedCompanies: daio-paper・elecom・japan-pulp-and-paper・kyodo-paper-holdings・nippon-paper-industries・screen-holdings・scroll・seven-and-i-holdings・shobunsha-holdings・softbank-group・toppan-holdings: 特定投資株式として保有が載るだけで、保有目的は全銘柄共通の「取引関係維持・発展の為」という定型句であり、相手ごとに取引や提携を述べる記述がないため結ばない。
- relatedCompanies: グループの連結子会社・非連結子会社（共立印刷、暁印刷、西川印刷、暁ＮＥＸＴ、今野、山陰クリエート、バッハベルク、東京アド、Ｍ＆Ｃ、丸正北海総業、インターメディア・コミュニケーションズ、竹崎など）は関連企業リンクの対象にしない。
- terms: 登録候補（助言のみ）: ＤＭサービス（購買履歴などを活用したダイレクトメールのサービスで、有報の事業の内容に印字）、ＲＰＦ燃料（プラスチック類などから作る固形燃料で、環境事業のサーマルリサイクルに印字）、生分解性プラスチック（自然に還るプラスチックで、環境事業に印字）、マテリアルリサイクル（プラスチック類再生事業の説明に印字）、サーマルリサイクル（ＲＰＦ燃料製造事業の説明に印字）、ＢＰＯ事業（保管発送などの業務受託を指す事業名で、有報に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
