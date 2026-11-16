# デルソーレ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社デルソーレ |
| 証券コード | 2876 |
| docID（データを取り出した文書） | `S100YC0N` |
| 原本 docID | `S100YC0N` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC0N.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社デルソーレ / 2876 / docID S100YC0N（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
delsole: 10 件の数値を有報XBRLと照合
有報: 株式会社デルソーレ 有価証券報告書－第62期(2025/04/01－2026/03/31) (docID S100YC0N)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
delsole: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2024年10月27日に千葉工場で火災が発生し、一部製品の休売があったこと、全ての製造ラインが2025年9月に再開したことはMD&Aに印字される事実として、売上高の減少理由（flow の revenue）にのみ使った。火災に関連する損失の金額は書いていない。
- businessModel: 本文の財務数値は売上高と当期純利益だけとし、MD&Aの営業利益・経常利益・セグメント利益の金額や増減率は書いていない。
- businessModel: 主要な経営指標等の注記には、決算期の変更や会計基準の変更など年度に紐づく事実がないため financialNotes は空にした（第59期からの従業員数の数え方の変更は注記にあるが、財務数値の注記ではないため warnings に留めた）。
- businessModel: 【事業の内容】に、関連当事者である株式会社ヒガ・インダストリーズから商品及び原材料の仕入を行っている旨が印字されている。同社は関連企業候補にないため結んでいない。
- businessModel: Wikipediaの記事は会社の概要の1文のみで、有報にない補足（旧社名・ブランド名等）は有報の沿革で足りるため、出典として使っていない。
- businessStructure: 事業の並び順と金額はセグメント注記の外部顧客への売上高（食品事業11,579,243千円、外食事業3,041,023千円）によった。MD&Aのセグメント別売上高（食品事業11,589百万円、外食事業3,069百万円）はセグメント間内部売上高を含む数値のため使っていない。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省いた。仕入の事実として、【事業の内容】に、関連当事者である株式会社ヒガ・インダストリーズから商品及び原材料の仕入を行っている旨が印字されている。
- businessStructure: 拠点と事業の対応は【主要な設備の状況】のセグメント欄どおり（多摩工場・千葉工場・九州工場・食品事業ユニットが食品事業、外食店舗計42店舗が外食事業、本社はセグメント名の印字がないため結びつけていない）。
- businessStructure: 【関係会社の状況】に載る関連会社は二海鷲ウイスキー株式会社（ウイスキーの製造、議決権25.0％）のみで、報告セグメントには含まれないため事業としては登録していない。
- businessStructure: 食品事業の子区分（ピザ製品、エスニックブレッド製品）と外食事業の子区分（テイクアウト業態、レストラン店舗）は金額が独立して開示されていないため、金額を書かずその旨を明記した。
- history: 沿革表は年月と事象が対応して印字されており、年だけを取り出して登録した（月は書かない）。資本金の金額は沿革にも書かないため、2015年の第三者割当増資の出来事は金額を落とすのではなく出来事ごと省いた。
- history: 省いた minor な出来事: 1977年大阪営業所開設、2005年「ハーベスター八雲」リニューアル、2008年農林水産大臣賞受賞、2021年アンテナショップ「デルソーレSHOP」オープン。
- history: 2024年10月に千葉工場で発生した火災と2025年9月の全ライン再開は【沿革】ではなくMD&Aに印字される当期・前期の出来事のため、沿革には入れず businessModel の warnings に記録した。
- industry: 主たる業界は、外部顧客への売上高の約79％を占める食品事業（ピザ・エスニックブレッド製品等の製造販売）に直接合う food とした。外食事業も料理を店で提供する事業であり、同じ food の範囲のため副次的な業界は付けていない。
- industry: DEIの別記事業は CTE（その他）である。
- relatedCompanies: 候補 mitsuuroko-group-holdings（株式会社ミツウロコグループホールディングス）は【大株主の状況】（2026年3月31日現在）に3.37％を保有する事業会社として印字されるため major-shareholder として結んだ。
- relatedCompanies: 候補 nichirei（株式会社ニチレイ）: 大株主として印字されるのは子会社の株式会社ニチレイフーズ（2.86％）であり、ニチレイ本体ではないため結ばなかった（法人格の異なる会社を代替しない）。
- relatedCompanies: 候補 mitsubishi-corporation（三菱商事株式会社）: 1985年の合弁会社ジェー・シー・シーの設立が沿革に印字されるのみで、当期の取引・提携の印字がないため結ばなかった（合弁の事実は沿革に記録した）。
- relatedCompanies: 候補 kuze（株式会社久世）、oie-sangyo（尾家産業株式会社）、toho（株式会社トーホー）: 特定投資株式の保有目的が全銘柄で同一の定型文（「安定的な取引関係を維持していくために保有しているものです。業務提携等はありません。」）のみで、個別の取引関係の印字がないため結ばなかった。
- relatedCompanies: 候補 mitsubishi-ufj-financial-group: 特定投資株式の保有目的は上記の定型文のみであり、金融機関でもあるため結ばなかった。
- relatedCompanies: 候補 key-coffee（キーコーヒー株式会社）: 特定投資株式だったが当事業年度に全株売却され保有がないため結ばなかった。
- relatedCompanies: 候補 lacto-japan（株式会社ラクト・ジャパン）: 主な資産及び負債の内容における買掛金の相手先別内訳に載るだけで、取引内容の印字がないため結ばなかった。
- relatedCompanies: 候補 saizeriya（株式会社サイゼリヤ）: 売掛金の相手先別内訳に載るだけで、取引内容の印字がないため結ばなかった。
- relatedCompanies: 候補 mitsubishi-shokuhin（三菱食品株式会社）: コードリストになく（上場を確認できない）、買掛金の相手先別内訳に載るだけのため結ばなかった。
- relatedCompanies: 候補 land（ランド）、career（キャリア）、base-4481（ベース）、corona（コロナ）: いずれも一般語の部分一致のみで、当該会社への言及はないため結ばなかった。
- relatedCompanies: 候補 choei（長栄）: ambiguous で、代表取締役社長「武長栄治」の部分一致のみのため結ばなかった。
- relatedCompanies: 候補 seki（セキ）: ambiguous で、「情報セキュリティ」の部分一致のみのため結ばなかった。
- relatedCompanies: 候補 taya（田谷）: ambiguous で、株主の住所「世田谷区」の部分一致のみのため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 株式会社日本アクセス（主要な顧客ごとの情報に印字される食品事業の主要な顧客）、株式会社ヒガ・インダストリーズ（関連当事者で、商品及び原材料の仕入先）、株式会社ニチレイフーズ・日清製粉株式会社・マリンフード株式会社（大株主の事業会社）、PT INDOFOOD CBP SUKSES MAKMUR TBK（大株主）。
- relatedCompanies: 自社の関連会社である二海鷲ウイスキー株式会社（持分法適用関連会社）は結ばない。
- terms: 用語候補（助言のみ）: エスニックブレッド（ナン・ピタ・トルティーヤ・フォカッチャなど世界各国のパンを指す当社の製品分類）、世界のパン（ピザとエスニックブレッドの総称として当社が使う表現）、おめで鯛焼き本舗（鯛焼きのテイクアウトブランド）、ハーベスター八雲（北海道八雲町のレストラン）、FSSC22000（食品安全マネジメントシステムの国際認証）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
