# フーディソン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社フーディソン |
| 証券コード | 7114 |
| docID（データを取り出した文書） | `S100YJIB` |
| 原本 docID | `S100YJIB` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJIB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社フーディソン / 7114 / docID S100YJIB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
foodison: 10 件の数値を有報XBRLと照合
有報: 株式会社フーディソン 有価証券報告書－第13期(2025/04/01－2026/03/31) (docID S100YJIB)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
foodison: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 連結経営指標等の注記のうち、第９期の損失の発生要因、１株当たり指標や自己資本比率・株価収益率に関する注記、キャッシュ・フローに関する注記は表示・算定上の事項のため financialNotes には入れなかった。従業員数の定義（就業人員）の注記も表示事項として扱った。
- businessModel: 売上高・純利益の金額は千円額を百万円に切り捨てて記載した（7,820,013千円→7,820百万円、146,780千円→146百万円）。サービス別の切り捨て合計（7,819百万円）と連結売上高との差１百万円は切り捨てによるものである。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」であり、提出後の予定事項はないため needsReview は空とした。
- businessModel: wikipedia.json は「日本の企業一覧 (卸売業)」の一覧記事であり、当社の補足情報は得られなかったため使わなかった。
- businessModel: 従業員数は連結経営指標等の就業人員103人（2026年３月31日現在）を用いた。平均臨時雇用者数200人は外数であり本文には書いていない。
- businessStructure: 単一セグメント（生鮮流通プラットフォーム事業）のため、事業の内訳は【関連情報】の製品およびサービスごとの情報（外部顧客への売上高）を children とした。
- businessStructure: サービス別の売上高は千円額を百万円に切り捨てて記載したため、３サービスの合計（7,819百万円）は連結売上高（7,820百万円）と１百万円差がある。合計は印字どおり7,820百万円を引用した。
- businessStructure: 株式会社フーディソン大田は当社の連結子会社（議決権100.0％、特定子会社）のため relatedCompanies には結ばず、事業構造の説明に位置付けを記載した。
- businessStructure: 仕入先は生産者、卸売業者、仲卸業者、メーカー等と総称で印字されており、個別の仕入先名は【事業の内容】に印字されていないため、suppliers は記載していない（本ツリーの旧スキーマでもある）。
- businessStructure: 【重要な契約等】の大都魚類株式会社（水産物の仕入に関する商品売買の取引基本契約）は related-candidates.json に含まれないため結ばなかった。
- history: 沿革のうち本社移転の２行（2014年３月 東京都中央区築地へ、2015年12月 東京都中央区勝どきへ）は事業の節目ではないため落とした。
- history: 設立行の資本金の金額は規則により記載していない。
- industry: 主たる業界は、売上高の81.2％を占めるBtoBコマースサービス（飲食店向けの生鮮食品の販売）が食品の流通・卸売であることに基づき、最も近い food を暫定とした。
- industry: retail は、BtoCコマースサービス（鮮魚セレクトショップ「sakana bacca」９店舗、外部顧客への売上高1,135百万円で独立開示あり）が小売に当たるため２つ目に付けた。
- industry: HRサービス（人材紹介、売上構成比4.3％）は金額規模が小さく、業界は付けなかった。
- relatedCompanies: 株式会社ビジョン: 「ビジョン」は当社の掲げるビジョンという一般語への一致であり、取引・提携・資本関係の記述はないため結ばなかった。
- relatedCompanies: エン株式会社: ambiguous であり、「エンゲージメント」等の一般語への一致のため結ばなかった。
- relatedCompanies: ベース株式会社: 「データベース化」という一般語への一致のため結ばなかった。
- relatedCompanies: 株式会社キャリア: 「キャリアパス」という一般語への一致のため結ばなかった。
- relatedCompanies: ポート株式会社: 「サポート」という一般語への一致のため結ばなかった。
- relatedCompanies: セキ株式会社: ambiguous であり、「セキュリティ」等の一般語への一致のため結ばなかった。
- relatedCompanies: 株式会社ショーケース: 店舗設備の「ショーケース」という一般名詞への一致のため結ばなかった。
- relatedCompanies: 株式会社コロナ: 「新型コロナウイルス感染症」への一致のため結ばなかった。
- relatedCompanies: 株式会社ランド: 「ブランド」という一般語への一致のため結ばなかった。
- relatedCompanies: パス株式会社: ambiguous であり、「キャリアパス」という一般語への一致のため結ばなかった。
- relatedCompanies: リズム株式会社: 「リズム」という一般語への一致のため結ばなかった。
- relatedCompanies: 株式会社リコー: 「食品リコール」という一般語への一致のため結ばなかった。
- relatedCompanies: 株式会社スペース: 「倉庫スペース」という一般語への一致のため結ばなかった。
- relatedCompanies: 大都魚類株式会社: 【重要な契約等】に水産物の仕入に関する商品売買の取引基本契約の相手先として印字されているが、related-candidates.json に含まれないため結ばなかった。
- relatedCompanies: 株式会社フーディソン大田は当社の連結子会社（議決権100.0％）であり、関連企業ではなく事業構造で扱った。
- relatedCompanies: 大株主のうち株式会社リープラジャパンは related-candidates.json に含まれないため結ばなかった。信託銀行・投資事業組合・個人の大株主は規則により結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語の説明は有報の記述に基づく助言であり、有報にない数値は使っていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] フーディソンの主たる業界（生鮮流通プラットフォーム事業） → 提案: 食品卸売・流通。売上高の大半を占めるBtoBコマースサービスは、生産者・卸業者等から仕入れた生鮮食品を飲食店に販売する食品の卸売・流通事業ですが、閉じた分類に食品卸売・流通を表す値がありません。取り扱う商品である食品に最も近い food を暫定としました。
