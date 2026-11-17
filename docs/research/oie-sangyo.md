# 尾家産業 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 尾家産業株式会社 |
| 証券コード | 7481 |
| docID（データを取り出した文書） | `S100YDVR` |
| 原本 docID | `S100YDVR` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDVR.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 尾家産業株式会社 / 7481 / docID S100YDVR（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
oie-sangyo: 6 件の数値を有報XBRLと照合
有報: 尾家産業株式会社 有価証券報告書－第66期(2025/04/01－2026/03/31) (docID S100YDVR)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
oie-sangyo: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: wikipedia.json の冒頭は「大手業務用食料品商社」という一般的な説明のみで、有報に書かれていない補足（旧社名・ブランド名・創業の経緯など）がなかったため、Wikipedia は使用しなかった。
- businessModel: 第6次中期経営計画の数値目標や目標とする経営指標は、業績目標・投資の語にあたるため perspectives には書かなかった。
- businessModel: 連結財務諸表の作成は第64期（2024年3月期）からで、5年間の数値のうち開示されているのは3年分である。修正再表示チェックは前期有報と全て一致し、差異はなかった。
- businessStructure: 報告セグメントは「食品卸売事業」の単一セグメントのため、children にはセグメント注記の【関連情報】に印字された製品及びサービスごとの売上高（2026年3月期）を使い、外部顧客への売上高の大きい順に並べた。
- businessStructure: 倉庫業は【事業の内容】で重要性が乏しいとされ報告セグメントに含まれないが、【関連情報】に売上高が独立して印字されているため、金額が最も小さい children として最後に置いた。
- businessStructure: 拠点（支店・物流センター等）は単一セグメントのため、特定の事業への対応づけはしていない。主要な設備の状況もセグメント別の記載が省略されている。
- history: 1961年の設立と2000年の増資については、沿革に資本金額が印字されているが、本文の規則により金額は記載していない。
- history: 1995年はC&C店舗の第1号店開設（8月）と大阪証券取引所市場第二部への上場（12月）の2件を、別々の出来事として分けて記載した。
- history: 1964年から1993年までの各地の営業所開設、ISO14001の認証取得と返上、物流センターの開設などは、全国展開の流れとして主要な節目に絞り、個別の記載を省いた。
- history: 2024年に子会社化した会社は、取得時点の商号が壽屋商事株式会社で、2025年4月22日に寿屋商事株式会社へ商号変更している旨を表記に反映した。
- industry: 主たる業界は、単一セグメントである業務用食品卸売事業に対応する trading（商社・卸売）とした。取扱商品が食品であるため food を2つ目に付けた。
- relatedCompanies: 仕入先・販売先の関係は、特定投資株式の保有目的に銘柄ごとに印字された文言（「安定的調達」「重要な顧客」）に基づき、2026年3月31日を基準とする株式の保有状況の検証結果として記載した。保有株式数や貸借対照表計上額は本文の規則により書いていない。
- relatedCompanies: takachiho（タカチホ）: 保有目的に「外食業態の重要な顧客」と印字されているが、保有は200株で貸借対照表計上額が0百万円とごく小規模であり、取引関係を裏付けるには足りないため結ばなかった。
- relatedCompanies: ワタミ: 特定投資株式に「外食業態の重要な顧客」として印字されているが、関連企業候補のデータに含まれていないため結ばなかった。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ）: 保有目的が安定的な銀行取引であり、銀行は結ばない規則のため結ばなかった。大株主の状況に載る三井住友信託銀行・みずほ銀行も、信託口・金融機関の保有のため結ばなかった。
- relatedCompanies: kotobukiya（壽屋）: 一致箇所は連結子会社の壽屋商事株式会社（現・寿屋商事株式会社）であり、株式会社壽屋とは別の会社のため結ばなかった（ambiguous の候補）。
- relatedCompanies: heiwa（平和）: 東京支店の所在地「平和島」という地名の一致のため結ばなかった。
- relatedCompanies: kuze（久世）: 京都支店の所在地「久世郡」という地名の一致のため結ばなかった。
- relatedCompanies: en（エン）: 「エンゲージメント」等の一般語の部分一致のため結ばなかった（ambiguous の候補）。
- relatedCompanies: port（ポート）: 「人材ポートフォリオ」という一般語の部分一致のため結ばなかった。
- relatedCompanies: core（コア）: 「コアか否か」という一般語の部分一致のため結ばなかった（ambiguous の候補）。
- relatedCompanies: land（ランド）: 「プライベートブランド」という語中の部分一致のため結ばなかった。
- relatedCompanies: lec（レック）: 「フレックスタイム」という語中の部分一致のため結ばなかった。
- relatedCompanies: vision（ビジョン）: 長期ビジョン「OIE vision 2035」の「ビジョン」という語の一致のため結ばなかった。
- relatedCompanies: career（キャリア）: 「キャリアデザイン研修」という一般語の一致のため結ばなかった。
- relatedCompanies: freee（フリー）: 「バリアフリー」等の語中の部分一致のため結ばなかった。
- relatedCompanies: king（キング）: 「ロジカルシンキング」等の語中の部分一致のため結ばなかった。
- relatedCompanies: reskill（リスキル）: 「リスキル・学び直し」という一般語の一致のため結ばなかった。
- relatedCompanies: slogan（スローガン）: 「スローガンとして掲げ」という一般語の一致のため結ばなかった。
- relatedCompanies: base-4481（ベース）: 物流拠点「ダイナベース」の名称中の部分一致のため結ばなかった。
- relatedCompanies: corona（コロナ）: 「コロナ禍」という一般語の一致のため結ばなかった。
- relatedCompanies: seki（セキ）: 「リスク」等の一般語中の部分一致のため結ばなかった（ambiguous の候補）。
- relatedCompanies: 連結子会社の寿屋商事株式会社は、候補データにない社内グループ会社のため関連企業には含めていない（【関係会社の状況】の記載は businessModel の flow に反映した）。
- terms: 助言: 用語「業務用食品卸売」（ホテル・レストランなどの事業者向けに食品を卸売する事業）、「キャッシュアンドキャリー（C&C）」（事業者が店舗で商品を現金で仕入れる業態）、「プライベートブランド（PB）商品」（卸売会社や小売会社が自社で企画するブランド商品）、「ヘルスケアフード」（病院・高齢者施設など医療・介護向けの食事・食材）、「三温度帯」（常温・冷蔵・冷凍の3つの温度帯）、「FSSC22000」（食品安全マネジメントシステムの国際認証）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 主たる業界 → 提案: wholesale。事業の中心は業務用食品の卸売であり、閉じた分類に卸売の区分がないため、最も近い trading を暫定とした。
