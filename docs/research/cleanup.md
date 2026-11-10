# クリナップ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | クリナップ株式会社 |
| 証券コード | 7955 |
| docID（データを取り出した文書） | `S100YHN2` |
| 原本 docID | `S100YHN2` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHN2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | クリナップ株式会社 / 7955 / docID S100YHN2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 39 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cleanup: 10 件の数値を有報XBRLと照合
有報: クリナップ株式会社 有価証券報告書－第73期(2025/04/01－2026/03/31) (docID S100YHN2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
cleanup: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 長期ビジョンの詳細と2024中期経営計画の基本方針の詳細は有報では図で示されており、テキストとして抽出できないため、戦略の記載は名称と「ファン化促進」「専業力強化」の2つの柱にとどめました。
- businessModel: 前期有報との修正再表示チェックは重複8行すべて一致しており、変則決算・決算期変更・会計基準の変更はないため、financialNotes は空です。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」、otherFilingsInWindow は空のため、ack は不要でした。
- businessModel: Wikipedia の記事冒頭にはみどり会の会員企業である旨の記載がありますが、有報に印字がなく、補足として使う事実の範囲に当たらないため使用しませんでした。
- businessStructure: 単一セグメントのため、【関連情報】の製品及びサービスごとの情報に印字された3区分（厨房部門、浴槽・洗面部門、その他）を children とし、外部顧客への売上高の金額を付けました。
- businessStructure: 「その他」の内訳は【事業の内容】のその他部門の記載（ステンレス素材の加工販売、物流、人材派遣、介護、事務受託、ソフトウェア開発）に基づきます。
- history: 1954年の設立時の資本金額は本文の財務数値の規則のため記載しませんでした。
- history: 【沿革】の2008年以降の部分は年月と事象が別々の並びで印字されており、年月の数（8件）と事象の数（11件）が一致しないため、行順での対応づけはしませんでした。日付を他の節で裏付けられる東京証券取引所プライム市場への移行（2022年4月、表紙のプライム市場上場と市場区分見直しの時期で確認）のみを採用し、次の10件は落としました：九州クリナップ工業㈱の清算、クリナップロジスティクス㈱によるクリナップ運輸㈱の吸収合併、クリナップテクノサービス㈱によるクリナップデザイン㈱の吸収合併、可麗必斯家具（瀋陽）有限公司の新設、クリナップ調理機工業㈱の清算、クリナップ岡山工業㈱の吸収合併、㈱エイチエスケイの買収とクリナップソリューション㈱への商号変更及び本社移転、北京事務所の閉鎖、香港支店の閉鎖、可麗必斯家具（瀋陽）有限公司の清算。
- industry: 主たる業界は、システムキッチンやシステムバスルームなどの住宅設備機器の製造・販売が主たる事業であるため、最も近い機械を暫定としました。
- relatedCompanies: career：「キャリア」は連結子会社クリナップキャリアサービス㈱の社名の部分一致で、株式会社キャリアそのものへの言及ではありません。
- relatedCompanies: vision：「ビジョン」は長期ビジョンの語の一致で、株式会社ビジョンそのものへの言及ではありません。
- relatedCompanies: seki：「セキ」は情報セキュリティの語の部分一致で、セキ株式会社そのものへの言及ではありません。ambiguous のため結びません。
- relatedCompanies: en：「エン」はエンゲージメントの語の部分一致で、エン株式会社そのものへの言及ではありません。ambiguous のため結びません。
- relatedCompanies: lec：「レック」は制度名の文脈での一致で、レック株式会社そのものへの言及ではありません。
- relatedCompanies: dai-ichi-life-holdings：特定投資株式の保有目的は「財務・経理・総務に係る業務のより円滑な推進のため」という全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。金融機関でもあるため結びません。
- relatedCompanies: land：「ランド」はブランド力の語の部分一致で、株式会社ランドそのものへの言及ではありません。
- relatedCompanies: mitsuuroko-group-holdings：大株主（2026年3月31日現在1.69％）ですが、特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: yuasa：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: aica-kogyo：特定投資株式の保有目的は「生産活動に係る業務のより円滑な推進のため」という全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: cosmos-initia：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: daimaru-enawin：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: dcm-holdings：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: haseko：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: hashimoto-sogyo-holdings：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: ikuyo：当事業年度は保有しておらず（「－」）、取引・提携の印字もありません。
- relatedCompanies: iwatsuka-confectionery：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: jk-holdings：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: kamei：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: kibun-foods：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: kimura：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: meiwa-estate：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: mitani-sangyo：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: nice：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: ochi-holdings：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: osaka-gas：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: sala：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: sekisui-house：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: slogan：「スローガン」は長期ビジョンのスローガンの語の一致で、スローガン株式会社そのものへの言及ではありません。
- relatedCompanies: sumitomo-mitsui-financial-group：特定投資株式の保有目的は「財務・経理・総務に係る業務のより円滑な推進のため」という全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。金融機関でもあるため結びません。
- relatedCompanies: sumitomo-realty-and-development：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: trust：EDINETコードリストになく、一致したのは日本マスタートラスト信託銀行の社名の部分一致で、株式会社トラストそのものへの言及ではありません。
- relatedCompanies: tsuchiya-holdings：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: yamae-group-holdings：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。
- relatedCompanies: yamazen：特定投資株式の保有目的は全銘柄共通の定型句のみで、銘柄固有の取引・提携の印字がありません。ambiguous のため結びません。
- relatedCompanies: zero：「ゼロ」はゼロ・エミッションの語の部分一致で、株式会社ゼロそのものへの言及ではありません。ambiguous のため結びません。
- relatedCompanies: 大株主の上位にいる株式会社井上（2026年3月31日現在24.41％）と株式会社タカヤス（同5.34％）は非上場のため、関連企業として結びません。
- relatedCompanies: 大株主の日本マスタートラスト信託銀行、STATE STREET BANK AND TRUST COMPANY、JP MORGAN CHASE BANKは信託・資産管理の純投資のため結びません。
- relatedCompanies: 連結子会社8社はすべて非上場のため候補外です。
- terms: 用語候補： システムキッチン、システムバスルーム、洗面化粧台、ステンレス流し台、ＣＥＮＴＲＯ（セントロ）、ＳＴＥＤＩＡ（ステディア）、ＳＥＬＥＶＩＡ（セレヴィア）、ｒａｋｕｖｉａ（ラクヴィア）、ｒａｋｕｅｒａ（ラクエラ）、ショールーム、オンライン相談、オンラインショールーム——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] クリナップの主たる業界 → 提案: 住宅設備機器。システムキッチンやシステムバスルームなどの住宅設備機器の製造・販売が主たる事業であり、閉じた分類に合う区分がないため、最も近い機械を暫定としました。
