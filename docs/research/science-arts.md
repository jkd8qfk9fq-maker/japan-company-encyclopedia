# サイエンスアーツ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サイエンスアーツ |
| 証券コード | 4412 |
| docID（データを取り出した文書） | `S100X6RV` |
| 原本 docID | `S100X6RV` |
| 提出日（原本） | 2025-11-27 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X6RV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サイエンスアーツ / 4412 / docID S100X6RV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
science-arts: 10 件の数値を有報XBRLと照合
有報: 株式会社サイエンスアーツ 有価証券報告書－第22期(2024/09/01－2025/08/31) (docID S100X6RV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
science-arts: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記１・２・４～10（連結指標を記載していない旨、関連会社がないための持分法の記載省略、潜在株式・株価収益率等の表示、従業員数の数え方、上場・市場移行に伴う株価の表示）は表示事項のためwarningsのみとした。注記３の株式分割はfinancialNotesとneedsReviewに入れた。注記11の収益認識基準の適用はfinancialNotesに入れた。
- businessModel: 期間後の本社移転（2025年10月15日の取締役会で決議、移転は2027年４月予定）は期間後の手続的な事項のためwarningsのみとし、金額（加速償却費用の見込み）は書いていない。本社所在地の記述は決算期末現在の渋谷区のまま登録している。
- businessModel: MD&Aの段階利益の金額と増減理由、キャッシュ・フローの金額、ARRの金額は書いていない。売上高の増加理由はMD&Aの印字（契約社数・利用ユーザー数の増加）に基づく。
- businessModel: 株式の保有状況では、保有する株式は非上場株式のみで内訳の記載が省略されており、純投資目的の投資株式は該当事項がないため、政策保有による関連企業のリンクはない。
- businessStructure: 本社（東京都渋谷区）はセグメント欄が全社扱いのため、特定の事業に結びつけていない。帳簿価額は書いていない。
- businessStructure: アクセサリーの機器の多くは出資先の製品や独占販売権を持つ製品で構成される旨が印字されているが、仕入先の個別名は印字されていないため、suppliersはこのツリーの旧スキーマに合わせて省略し、事実のみここに記録した。
- businessStructure: Buddycom事業の子区分の売上高は千円ではセグメント売上高と一致する（908,785千円＋744,285千円＝1,653,070千円）が、百万円への切り捨て後の合計（908百万円＋744百万円＝1,652百万円）はセグメントの1,653百万円と１百万円異なる。切り捨てによる差であり、印字のまま記載した。
- history: 資本金の増資・減資の行（2004年、2005年、2006年、2007年、2009年の増資、2013年の減資）と、第三者割当による自己株式の処分（2018年２回、2020年２回）は資本金額に関わるため沿革に入れていない。
- history: 本社移転の行（2006年、2009年、2011年、2013年、2017年、2019年）は2023年の渋谷移転を除き省略した。
- history: 特許取得の行（2018年の音声通信・映像配信の国内特許、2020年の韓国特許、2021年のシンガポール・中国特許、2022年の欧米各国特許、2023年の米国特許、2024年の国内特許、2025年のBuddycomベルの国内特許）は省略した。
- history: 「ALTIBASE」が医療機器メーカーや金融機関向けFXシステムに採用された行（2008年、2010年）は個別の採用事例のため省略した。
- history: Wikipediaの記事は見つからなかった（found: false）ため使っていない。
- industry: 主たる業界はitとした。売上のほぼ全てを占めるBuddycom事業が、自社開発のソフトウエアをクラウドサービスとして提供する事業であるためである。
- industry: telecommunicationsは付けていない。Buddycomは通信事業者のネットワークを使うクラウドサービスであり、同社は通信事業そのものを行っていないためである。
- relatedCompanies: base-4481: 「データベース」という一般語の部分一致で、社名としての印字がないため結ばなかった。
- relatedCompanies: en: ambiguousで、英訳名などの部分一致のみのため結ばなかった。
- relatedCompanies: port: 「サポート」等の部分一致のみのため結ばなかった。
- relatedCompanies: como: ambiguousで、「ドコモ」等の部分一致のみのため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」の部分一致のみのため結ばなかった。
- relatedCompanies: seki: ambiguousで、「セキュリティ」等の部分一致のみのため結ばなかった。
- relatedCompanies: nissin: コードリストにない相手で、新株予約権の文中の部分一致のみのため結ばなかった。
- relatedCompanies: econavista: 見守りシステム「ライフリズムナビ」とBuddycomの連携が印字されているが、コードリストにない（非上場）相手のため結ばなかった。
- relatedCompanies: freee: 「フリーレント賃料」の部分一致のみのため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」という一般語の部分一致のみのため結ばなかった。
- relatedCompanies: kohsoku: ambiguousで、「高速アクセス」の部分一致のみのため結ばなかった。
- relatedCompanies: path: ambiguousで、「パスワード」の部分一致のみのため結ばなかった。
- relatedCompanies: rent: 「フリーレント賃料」の部分一致のみのため結ばなかった。
- relatedCompanies: rhythm: エコナビスタの見守りシステム「ライフリズムナビ」という製品名の部分一致のみのため結ばなかった。
- relatedCompanies: safie: 自社機能名「セーフィーサポート」の部分一致のみのため結ばなかった。
- relatedCompanies: space: 「執務スペース」の部分一致のみのため結ばなかった。
- relatedCompanies: system-integrator: 沿革の「大手システムインテグレーター」という一般的な記述で、社名の印字がないため結ばなかった。
- relatedCompanies: taya: ambiguousで、大株主の住所（世田谷区）の部分一致のみのため結ばなかった。
- relatedCompanies: 候補にないため結んでいない相手: NTTドコモビジネス株式会社とオープンリソース株式会社は販売実績の相手先として印字されているが候補にない。楽天モバイル株式会社は楽天グループの子会社で連携の印字があるが候補にない（楽天グループをリンクした）。株式会社アジラとパラマウントベッド株式会社は連携先として印字されているが候補にない。
- terms: 助言のみ。用語としては『Buddycom』『フロントラインワーカー』『サブスクリプション』『PTT（Push to Talk）』『ARR』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 2021年８月11日付で普通株式１株につき100株の割合で株式分割を、2022年12月１日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第18期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2021年８月11日付で普通株式１株につき100株の割合で株式分割を、2022年12月１日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第18期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
