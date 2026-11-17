# ＵＬＳグループ — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＵＬＳグループ株式会社 |
| 証券コード | 3798 |
| docID（データを取り出した文書） | `S100YCBQ` |
| 原本 docID | `S100YCBQ` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCBQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＵＬＳグループ株式会社 / 3798 / docID S100YCBQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
uls-group: 10 件の数値を有報XBRLと照合
有報: ＵＬＳグループ株式会社 有価証券報告書－第26期(2025/04/01－2026/03/31) (docID S100YCBQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
uls-group: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「ULSグループ株式会社」が EDINET の提出者名「ＵＬＳグループ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。主要な経営指標等の推移の注記は、株式分割に関するもの（needsReview に記録）と臨時雇用者数の記載省略に関するもののみで、会計基準の変更や変則決算などの基礎の変更はない。前期有報との修正再表示照合は全6系列で差異ゼロだった。
- businessModel: 目標とする経営指標として経常利益とその中長期的成長が掲げられているが、利益指標の目標であるため金額・数値は本文にも perspectives にも書いていない。strategy は定性的に書いた。
- businessModel: MD&Aの段階利益の金額・増減率、受注高・受注残高、キャッシュ・フローの金額、研究開発費の金額は書いていない（本文の金額は売上高と当期純利益のみ）。
- businessModel: 株式会社パソナはセグメント注記の主要な顧客として印字されているが、related-candidates.json に含まれていないため関連企業には結んでいない（customers には名前のみ記載）。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」だった。重要な契約等も「該当事項はありません」だった。
- businessStructure: 単一セグメント（コンサルティング事業）のため、事業は1つとし、【事業の内容】に位置づけが印字されている連結子会社3社を children とした。セグメント注記・関連情報（製品及びサービスごとの情報）は単一セグメントを理由に記載が省略されている。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。【事業の内容】に個別の仕入先名の印字はない。MD&Aでは品質管理に適合したパートナー事業者の確保が売上高の要因として述べられている。
- businessStructure: 設備は提出会社・国内子会社とも全てコンサルティング事業のセグメント欄で印字されているため、子会社ごとの children には結びつけていない。設備の帳簿価額は書いていない。
- businessStructure: 【関係会社の状況】の子会社の主要な損益情報等（ＵＬＳコンサルティング・ピースミール・テクノロジーの売上高等）は本文に書いていない。
- businessStructure: 議決権の所有割合は、ＵＬＳコンサルティング99.3％、ピースミール・テクノロジー82.8％、株式会社アークウェイ80.0％（2026年3月31日現在）。
- history: 資本に関する事項は沿革に含めていない: 2000年・2001年の第三者割当増資、2004年の無償減資、2007年の株式分割（1株を4株）、2013年の株式分割（1株を100株）、2025年の株式分割（1株を10株）。2025年の株式分割は指標注記に基づき needsReview に記録した。
- history: 省略した軽微な事項: 2001年の本社移転、2005年のソフトウェアUMLaut/J-XMLの販売開始、2006年の賃貸住宅トータルサポート株式会社（現リーシング・マネジメント・コンサルティング株式会社）の第三者割当増資の引受け。
- history: Wikipedia は見つからなかった（found: false）ため、補足はしていない。
- industry: 主たる業界は it とした。単一セグメントのコンサルティング事業はITコンサルティングサービスの提供であり、閉じた分類に直接当てはまるため、暫定分類は使っていない。
- relatedCompanies: 結んだ関連企業はない。主要な顧客としてセグメント注記に印字されている株式会社パソナ、【大株主の状況】に載る事業会社の株式会社インテック（発行済株式の3.89％を所有、2026年3月31日現在）、沿革に業務・資本提携が印字されている株式会社HashPort（旧フレセッツ株式会社）はいずれも related-candidates.json に含まれていないため結んでいない。
- relatedCompanies: base-4481（ベース）: 「連結ベース」などの一般語のみで、ベース株式会社との関係の印字はない。
- relatedCompanies: port（ポート）: 「サポート」などの部分一致のみで、ポート株式会社との関係の印字はない。
- relatedCompanies: zero（ゼロ、ambiguous）: 「有利子負債残高はゼロ」などの一般語のみ。
- relatedCompanies: en（エン、ambiguous）: 「エンジニア」の部分一致のみ。
- relatedCompanies: land（ランド）: 本店所在地の「晴海アイランド」などの部分一致のみ。
- relatedCompanies: cover（カバー）: 「GHG排出量カバー率」の一般語のみ。
- relatedCompanies: career（キャリア）: 「キャリアプラン」の一般語のみ。
- relatedCompanies: nissin（日新、ambiguous）: 現在のコードリストになく、一致は新株予約権の行使期間の印字のみ。
- relatedCompanies: basic（ベーシック）: 「ベーシック研修」の一般語のみ。
- relatedCompanies: seki（セキ、ambiguous）: 「セキュリティ」の部分一致のみ。
- relatedCompanies: innovation（イノベーション）: 経営理念の文中の一般語のみ。
- relatedCompanies: lec（レック）: 「フレックスタイム」の部分一致のみ。
- relatedCompanies: slogan（スローガン）: 「スローガン」の一般語のみ。
- relatedCompanies: the-lead（リード）: 理念文中の「リードし」の一般語のみ。
- relatedCompanies: rhythm（リズム）: 「エンゲージメント」などの部分一致のみ。
- relatedCompanies: rix（リックス）: 「スキル・マトリックス」の部分一致のみ。
- relatedCompanies: taya（田谷、ambiguous）: 大株主の住所である「東京都世田谷区」のみ。
- relatedCompanies: technologies（テクノロジーズ）: 沿革の株式会社ノーチラス・テクノロジーズは別法人であり、株式会社テクノロジーズとの関係の印字はない。
- relatedCompanies: trust（トラスト）: 現在のコードリストになく、日本マスタートラスト信託銀行株式会社（信託口）の部分一致のみ。信託口は純投資の保管であり結ばない。
- relatedCompanies: 自社の連結子会社3社（ＵＬＳコンサルティング、ピースミール・テクノロジー、株式会社アークウェイ）は関連企業に含めていない。【株式の保有状況】の特定投資株式に結べる上場銘柄の印字は確認できなかった。
- terms: 助言: 用語「ULBOK（ウルボック）」は、当社グループ独自のナレッジベースの名称で、【経営方針、経営環境及び対処すべき課題等】に印字されています。
- terms: 助言: 用語「戦略的IT投資領域」は、顧客企業の競争優位性を支える情報システム投資領域を指す当社グループの事業ドメインの呼称で、同節に印字されています。

## 要確認（status に反映）

- businessModel: 2025年10月1日付で普通株式1株につき10株の割合で株式分割を行っている（主要な経営指標等の推移の注記に記載）。
- businessStructure: 2025年10月1日付で普通株式1株につき10株の割合で株式分割を行っている（主要な経営指標等の推移の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
