# 岡野バルブ製造 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 岡野バルブ製造株式会社 |
| 証券コード | 6492 |
| docID（データを取り出した文書） | `S100XBYD` |
| 原本 docID | `S100XBYD` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBYD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 岡野バルブ製造株式会社 / 6492 / docID S100XBYD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
okano-valve-mfg: 10 件の数値を有報XBRLと照合
有報: 岡野バルブ製造株式会社 有価証券報告書－第126期(2024/12/01－2025/09/30) (docID S100XBYD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2025-09 の期は 10 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
すべて一致しました。
okano-valve-mfg: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記1（潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していない）は表示事項のため warnings のみとし、financialNotes には付けていない。
- businessModel: MD&Aに印字された営業利益・経常利益の金額と理由、特別利益・特別損失の計上への言及、受注高・受注残高の金額は書いていない（本文の財務数値と受注高の規則）。売上高の前期比も、変則決算のため有報自身が対前年同期比の記載を行っていない。
- businessModel: 部門別（製造販売・メンテナンス）の売上高は独立して開示されていないため、本文には書いていない。
- businessModel: Wikipediaの記事（証券コードで同一性確認済み）は見つかったが、冒頭の記述は本社所在地と事業の概要を述べるもので、いずれも有報に記載のある事実のみだったため、補足には使わず出典も足していない。
- businessModel: perspectives にはリンク記法を使っていない（このツリーの運用）。
- businessModel: 主要な販売先の東京電力ホールディングス株式会社は【関連情報】とMD&Aに売上高の13.7％で印字されているが、関連企業の候補（related-candidates.json）にないため relatedCompanies には結ばず、flow の customer の段に社名のみ記載した。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。部品等の一部を岡野商事株式会社（その他の関係会社）から仕入れている旨は【事業の内容】に印字されており、バルブ事業の description に記載した。
- businessStructure: 報告セグメントはバルブ事業のみで、セグメント情報の記載自体が省略されている。製造販売部門とメンテナンス部門の売上高は独立して開示されていないため、子区分には金額を書いていない。
- businessStructure: ドローン・ロボット・IoTを活用した設備点検・診断ソリューションや製造受託などの新事業は、経営方針とMD&Aに記載があるが金額が独立して開示されておらず、【事業の内容】でもバルブ事業のみが説明されているため、独立の事業としては登録せず businessModel の戦略に記載した。
- businessStructure: 【主要な設備の状況】の本社・行橋工場・東京営業所・柏崎刈羽事業所他7拠点は単一セグメント（バルブ事業）の設備のため、特定の子区分には結びつけていない。帳簿価額は書かない。
- businessStructure: 連結子会社は岡野クラフト株式会社1社（当社製品の機械加工・出荷業務・鋳鋼処理および当社メンテナンス業務の外注）、持分法適用関連会社はスペロ機械工業株式会社1社（超高圧部品製造・土地の賃貸）。いずれも自社の関係会社であり relatedCompanies には結ばない。
- history: 沿革表の末尾は年月セルと事象文が分離して印字されており、年月（2013年10月・2014年4月・2018年1月・2022年4月）と事象文が各4つで数が一致するため、行順に対応づけた（2013年=岡野クラフト発足、2014年=平田バルブ工業との資本業務提携、2018年=行橋工場への統合、2022年=スタンダード市場移行。2022年の市場移行は市場区分見直しの実施時期とも一致する）。
- history: 1936年の設立の印字にある資本金の金額は書いていない（沿革に資本金を書かない規則）。
- history: 2000年10月のISO14001認証取得は、品質認証であるISO9001（1994年）を代表として登録し、環境認証は本項目では落とした。
- history: 1935年の現本社所在地への新工場建設・移転は、工場移転の細目として落とした（本社所在地は現在の表紙で確認できる）。
- industry: 主たる業界は machinery とした。売上高の全額がバルブ事業（発電所向けバルブの製造・販売とメンテナンス）であり、バルブ製造は閉じた分類の「機械」に直接合うため暫定値ではない。分類の不足はないので taxonomyGaps は付けない。
- relatedCompanies: 東京電力ホールディングス株式会社: 【関連情報】の主要な顧客ごとの情報とMD&Aの相手先別販売実績に、2025年9月期の売上高962百万円（13.7％）の主要な顧客として印字されているが、related-candidates.json に候補がないため結ばなかった。
- relatedCompanies: 岡野商事株式会社: 【関係会社の状況】のその他の関係会社で、当社の株式の24.43％を保有する（2025年9月30日現在）大株主でもあり、主な代理店かつ部品等の仕入先だが、非上場で候補にないため結ばなかった。関係の事実は businessStructure に記載した。
- relatedCompanies: 岡野クラフト株式会社（連結子会社）とスペロ機械工業株式会社（持分法適用関連会社）: 自社の子会社・関連会社であり、候補にもないため結ばなかった。
- relatedCompanies: 平田バルブ工業株式会社: 2014年4月に資本業務提携を締結した旨が【沿革】に印字されているが、非上場で候補にないため結ばなかった。
- relatedCompanies: marubeni（丸紅株式会社）: 特定投資株式の保有目的が「当社の重要な取引先として取引関係の維持・発展目的で保有しております」と川崎重工業株式会社と同一の定型文であり、個別の取引の印字がないため結ばなかった（候補でも ambiguous とされている）。
- relatedCompanies: kawasaki-heavy-industries（川崎重工業株式会社）: 特定投資株式として保有していたが当事業年度中にすべて売却し、保有がゼロになったため結ばなかった。
- relatedCompanies: zenrin（株式会社ゼンリン）: 当事業年度中にすべて売却し、保有がゼロになったため結ばなかった。
- relatedCompanies: ana-holdings（ANAホールディングス株式会社）: 特定投資株式の保有目的が「配当利回り等を総合的に勘案し、保有しております」という投資目的であり、取引関係の印字がないため結ばなかった。
- relatedCompanies: fukuoka-financial-group（株式会社ふくおかフィナンシャルグループ）、nishi-nippon-financial-holdings（株式会社西日本フィナンシャルホールディングス）、yamaguchi-financial-group（株式会社山口フィナンシャルグループ）、the-oita-bank（株式会社大分銀行）: 特定投資株式の保有目的がいずれも「資金調達の安定化を目的として当社取引銀行との取引関係の維持・発展のため」という資金調達に関するものであるため結ばなかった。
- relatedCompanies: flier（株式会社スターフライヤー）: 特定投資株式の保有目的が「地域経済の発展における地場企業との協調のために保有しております」という定型的なもので、個別の取引の印字がないため結ばなかった。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 【大株主の状況】に印字されているのは光通信ＫＫ投資事業有限責任組合（発行済株式の4.99％、2025年9月30日現在）であり、株式会社光通信とは別の法的主体のため結ばなかった。
- relatedCompanies: career、core、base-4481、path、en、seki、corona、taya、zero: いずれも一般語や住所などの部分一致のみで、同一性・関係性の根拠がないため結ばなかった。
- terms: 助言のみ。用語の追加提案：原子力弁（原子力発電所で使用されるバルブ）、BWR（沸騰水型原子炉。沿革で敦賀1号への納入に言及）、特定重大事故等対処施設（原子力発電所の重大事故等に対処するための施設。MD&Aで同施設用弁の販売に言及）、鋳鋼（鋳造で作る鋼。鋳鋼弁・鋳鋼部品の販売に言及）、Nスタンプ（米国機械学会ASMEによる原子力規格認証）。

## 要確認（status に反映）

- businessModel: 2025年9月期は、決算期変更により2024年12月1日から2025年9月30日までの10ヶ月間の変則決算です。本登録では、財務注記（financialNotes）にその旨を記載しています。
- 財務: 変則決算。2025-09 の期は 10 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
