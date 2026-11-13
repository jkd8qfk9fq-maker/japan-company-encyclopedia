# 藤倉化成 — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 藤倉化成株式会社 |
| 証券コード | 4620 |
| docID（データを取り出した文書） | `S100YJ15` |
| 原本 docID | `S100YJ15` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ15.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 藤倉化成株式会社 / 4620 / docID S100YJ15（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fujikura-kasei: 10 件の数値を有報XBRLと照合
有報: 藤倉化成株式会社 有価証券報告書－第115期(2025/04/01－2026/03/31) (docID S100YJ15)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fujikura-kasei: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円印字を百万円に切り捨てて転記した（bushiroadの先例）。切り捨て後の事業別合計は55,634百万円となり印字の合計55,636百万円と2百万円異なるが、千円単位では合計と一致している。MD&Aの億単位の併記表記（556億36百万円等）は使わず、指標表とセグメント注記の印字に統一した。
- businessModel: 本文の「組替え」は連結包括利益計算書の組替調整額を指すものであり、表示方法の変更や経営指標の修正再表示ではない。前期有報との修正再表示チェックは全6系列で差異がなく、経営指標等の注記は潜在株式が存在しない旨のみで会計方針の変更・株式分割等の記載はないため、financialNotesは空とした。
- businessModel: 経営方針に印字されたROE8％以上を目指す旨の目標、総還元性向70％以上、配当16円以上維持等の数値目標は、比率・投資指標に当たるため本文に転記せず、戦略の内容のみを要約した。
- businessModel: 重要な後発事象は2026年5月14日の取締役会で決議された自己株式の取得のみであり、資本政策に関する事項としてneedsReviewには入れなかった。
- businessModel: PT. FUJIKURA KASEI INDONESIAは2025年12月19日に株式を取得して連結子会社化したもので、期末現在の体制に反映されているためneedsReviewには入れず、historyとここに記録した。同取得に伴う負ののれん発生益の金額は本文に転記していない。
- businessModel: 変則決算・決算期変更はなく irregularPeriods は空、fiscalYearChange は null のため、機械生成の変則決算の確認事項は発生していない。
- businessStructure: 報告セグメントは5事業（コーティング、塗料、電子材料、化成品、合成樹脂）で、子区分はセグメント情報の外部顧客に対する売上高の大きい順に並べた。金額はセグメント注記の千円印字を百万円に切り捨てた。
- businessStructure: 【関係会社の状況】に個別記載のある連結子会社はフジケミ東京、フジケミ近畿、フジケミカル、藤光樹脂、FUJIKURA KASEI(THAILAND)、FUJIKURA KASEI MALAYSIA、PT. FUJIKURA KASEI INDONESIA、藤倉化成塗料（天津）、藤倉化成（佛山）塗料、上海藤倉化成塗料、FUJICHEM,INC.、RED SPOT PAINT & VARNISH、Fujichem Sonnebornの13社で、この他に「その他7社」の連結子会社と、社名の印字されない持分法適用関連会社1社がある。いずれもグループ会社であり relatedCompanies には含めていない。
- businessStructure: 藤倉化成塗料（天津）有限公司、藤倉化成（佛山）塗料有限公司、上海藤倉化成塗料有限公司は議決権の所有割合が40.00％だが、実質的に支配しているため子会社とされている旨が【関係会社の状況】の注記に印字されている。
- businessStructure: PT. FUJIKURA KASEI INDONESIAは2025年12月に株式を取得して連結子会社化されたもので、期末現在の体制に反映されているため needsReview には入れなかった（詳細は businessModel の warnings）。
- history: 【沿革】は年月と事象が対応する通常形式の表であり、年だけを採用し月は落とした。
- history: 設立時や子会社化の資本金額は history に書かない規則により転記していない。
- history: 工場・営業所の新設や駐在員事務所の開設など、主要な転機でない行は省略した。
- industry: 主たる業界は chemicals（化学）とした。当社の事業そのものはアクリル樹脂派生製品（コーティング、塗料、電子材料、化成品、合成樹脂）の製造・販売であり、自動車・エレクトロニクス・住宅は用途・市場であるため automotive や electronics は付けなかった（iriso-electronics の先例）。
- relatedCompanies: 藤倉コンポジット株式会社は特定投資株式569,840株の発行会社で大株主（2.08％）でもあるが、保有目的が「業務関係を維持・強化するために保有しております」という全般的な定型句のみで具体的な取引内容の印字がなく、【関係会社の状況】にも記載がないためリンクしなかった（koaの先例）。1938年に当社が分離した元の会社の一つである事実はhistoryに記録した。
- relatedCompanies: 三井住友トラストグループ株式会社は特定投資株式の発行会社だが、保有目的は金融取引先として資金調達の継続と多様化、情報交換や助言等であり、資金調達・金融面の関係にとどまって業務提携等の関係の印字がないためリンクしなかった。
- relatedCompanies: 株式会社みずほフィナンシャルグループと株式会社三井住友フィナンシャルグループの特定投資株式は、2026年3月末において売却済み（保有ゼロ）であるためリンクしなかった。
- relatedCompanies: 極東貿易、長瀬産業、GSIクレオス、巴川コーポレーション、安藤・間の5社は、保有目的が販売取引先・設備関係の取引先としての役割と対象事業（コーティング事業等、化成品事業等）を具体的に特定しており、全銘柄共通の定型句ではないためリンクした。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）、株式会社日本カストディ銀行（信託口）、BNP PARIBAS、DBS BANK、BANK OF NEW YORK MELLONの各名義は信託・カストディであり、藤倉化成従業員持株会も含めリンクしなかった。
- relatedCompanies: base-4481（ベース樹脂）、en（成長エンジン）、land（タイランド）、seki（セキュリティ）、ray、ishin（移行・カーボンプライシング）、port（ポートフォリオ）、aeon（リチウムイオン）、corona（新型コロナウイルス）は一般語・部分一致の誤検出で、関係の記載が無いためリンクしなかった。
- relatedCompanies: 三菱ケミカルエンジニアリング株式会社とは2025年7月30日に新工場の工事請負契約を締結したが、同社はrelated-candidatesに含まれていないためリンクしなかった。
- terms: 助言: 用語「アクリル樹脂派生製品」は、当社グループの事業の総称で、コーティング、塗料、電子材料、化成品、合成樹脂の各事業の製品を指します（【事業の内容】に印字）。
- terms: 助言: 用語「コーティング材」は、プラスチック等の表面に機能を付与する材料で、当社の主力製品です（【事業の内容】に「プラスチック用コーティング材」と印字）。
- terms: 助言: 用語「ドータイト」は、導電性樹脂塗料・導電性接着剤の当社の製品ブランドです（MD&Aに『ドータイト』と印字）。
- terms: 助言: 用語「レクラック」「フジハード」は、プラスチック用コーティング材の当社の製品ブランドです（MD&Aに印字）。
- terms: 助言: 用語「アクリベース」は、粘・接着剤ベースの当社の製品ブランドです（MD&Aに『アクリベース』と印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
