# ＧＭＯグローバルサイン・ホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＧＭＯグローバルサイン・ホールディングス株式会社 |
| 証券コード | 3788 |
| docID（データを取り出した文書） | `S100XREJ` |
| 原本 docID | `S100XREJ` |
| 提出日（原本） | 2026-03-18 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XREJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＧＭＯグローバルサイン・ホールディングス株式会社 / 3788 / docID S100XREJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gmo-globalsign-holdings: 10 件の数値を有報XBRLと照合
有報: ＧＭＯグローバルサイン・ホールディングス株式会社 有価証券報告書－第33期(2025/01/01－2025/12/31) (docID S100XREJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
gmo-globalsign-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「GMOグローバルサイン・ホールディングス株式会社」が EDINET の提出者名「ＧＭＯグローバルサイン・ホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（切り捨ての旨をここに記録する）。セグメント別の売上高はセグメント注記の外部顧客への売上高を用い、MD&Aの内部売上高を含むセグメント売上高（13,016百万円等）は用いていない。セグメント外部売上高の切り捨て合計は20,669百万円となり、印字の合計20,670百万円と１百万円異なるが、印字の合計をそのまま記載した。
- businessModel: 2026年12月期の通期業績見込みと、目標とする経営指標として挙げられた売上高経常利益率・ROEは、投資指標・利益率にあたるため本文・戦略には書かず、ここに記録するにとどめた。
- businessModel: suppliersキーは本ツリーのスキーマに無いため記載していない（仕入先の固有名の印字もない）。
- businessModel: financialNotesは連結経営指標等の注記（収益認識基準の第30期期首からの適用）に基づく１件のみ。変則決算・決算期変更はない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（電子認証・印鑑事業12,845百万円、クラウドインフラ事業6,947百万円、DX事業877百万円）。金額は千円の印字を百万円に切り捨てた。子会社15社のうち連結子会社は12社で、ロシア・UAE・ブラジルの3社は非連結子会社である旨を事業の内容に記載のとおりwarningsに記録する。
- businessStructure: suppliersキーは本ツリーのスキーマに無いため記載していない。データセンターは自社保有せず複数のIDC事業者からハウジングサービス等の提供を受けている事実は【事業等のリスク】に記載があるが、特定の仕入先名の印字はない。
- history: 沿革表の各行は年月と事項が対応して印字されており、主要な出来事のみを年単位で採った。設立時・改組時等の資本金の金額は本文に書かない規則のため記載していない。2021年７月のＧＭＯモビリティクラウド株式会社の吸収合併など、年表の細目は省略した。
- industry: 3つの報告セグメント（電子認証・印鑑事業、クラウドインフラ事業、DX事業）はいずれもITサービスであり、閉じた分類の「it」が直接適合する。分類の不足はない。
- relatedCompanies: gmo-internet-group以外の候補はすべて社名の単語一致のみで、有報がその相手について取引・提携・資本関係を述べていないため結ばなかった。個別の理由は次のとおり。
- relatedCompanies: seki（セキ株式会社）：「セキュリティ」の語の一致のみで、相手についての記載はない。
- relatedCompanies: land（株式会社ランド）：「ブランド」の語の一致のみ。
- relatedCompanies: trust（株式会社トラスト）：「トラスト・ログイン」「グローバルサイン」等のサービス名の一致のみで、コードリストにもない。
- relatedCompanies: path（パス株式会社）：「パスワード」の語の一致のみ。ambiguous指定。
- relatedCompanies: base-4481（ベース株式会社）：「クラウドベース」の語の一致のみ。
- relatedCompanies: port（ポート株式会社）：「サポート」等の語の一致のみ。
- relatedCompanies: career（株式会社キャリア）：人事・従業員の文脈での「キャリア」の語の一致のみ。
- relatedCompanies: como（株式会社コモ）：注記用語「コモンネーム」の一致のみ。ambiguous指定。
- relatedCompanies: i-ll（株式会社アイル）：当社の旧商号・旧ブランド「アイル」の一致のみで、上場している株式会社アイル（3854）についての記載はない。
- relatedCompanies: innovation（株式会社イノベーション）・ishin（イシン株式会社）・lec（レック株式会社）・rent（株式会社レント）・vision（株式会社ビジョン）・alpha-4760/alpha（アルファ）・king（キング）・no-1・ray・taya（田谷）・will・fisco（フィスコ）・fuller（フラー）・kohsoku（高速）・rhythm（リズム）・space（スペース）・technologies・zero：いずれも一般語やサービス名（アルファSSL、ドメインキング、高速発行等）の一部との一致のみで、相手についての取引・提携・資本関係の記載はない。
- relatedCompanies: orient（オリエントコーポレーション）：MD&Aで同社のデジタル分割払いアプリ「ワケタラ」が「GMOおみせアプリ」の決済分野の展開例として導入拡大に触れられているが、当社との提携・取引関係そのものの記載はないため結ばなかった。
- relatedCompanies: 特定投資株式は該当事項なし。大株主のうち事業会社に当たるのは親会社のＧＭＯインターネットグループ株式会社のみで、関係会社の状況の区分どおりparentとして記載した。
- terms: 助言のみの工程。用語の追加提案は無い。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
