# スガイ化学工業 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | スガイ化学工業株式会社 |
| 証券コード | 4120 |
| docID（データを取り出した文書） | `S100YBHZ` |
| 原本 docID | `S100YBHZ` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBHZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | スガイ化学工業株式会社 / 4120 / docID S100YBHZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sugai-chemical-industry: 10 件の数値を有報XBRLと照合
有報: スガイ化学工業株式会社 有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YBHZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
sugai-chemical-industry: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は付けていません。主要な経営指標等の推移の注記は、連結財務諸表を作成していないこと、関連会社がないこと、潜在株式が存在しないこと、期末配当が株主総会の決議事項であること、市場の名称の変遷の説明だけで、変則決算・会計基準の変更・株式分割等の事実はありません。
- businessModel: 2026年３月期の期末配当は2026年６月23日開催予定の定時株主総会の決議事項と印字されていますが、配当は本文に書かないため warnings のみの記録です。
- businessModel: 目標とする経営指標は印字されていません（中東情勢の影響で2026年度及び中期経営の見通しは状況を見極めてから公表すると印字）。投資指標は書いていません。
- businessModel: MD&A の段階利益の金額と理由、キャッシュ・フローの金額、受注に関する金額、設備の帳簿価額は書いていません。売上高の増減と理由のみを使いました。
- businessStructure: 単一セグメントのため、事業は１つとし、【関連情報】の製品及びサービスごとの情報の外部顧客への売上高の大きい順に children としました。「その他」は金額が開示されているため売上順の最後に置きました。
- businessStructure: 子区分の売上高（千円）は農薬用中間物4,316,040、機能性用中間物1,167,562、医薬用中間物411,436、界面活性剤381,299、その他用中間物124,590、その他31,873で、合計は印字の合計6,432,802千円と一致します。百万円に切り捨てた子区分の合計（6,430百万円）は売上高6,432百万円と２百万円ずれるため、本文では印字の合計を使いました。
- businessStructure: 設備は本社及び研究所（和歌山市）・和歌山事業所・福井事業所・旧和歌山工場・大阪営業所・東京営業所で、いずれも単一セグメントに属するため特定の子区分には結びつけていません。帳簿価額は書いていません。旧和歌山工場の跡地は2026年３月に一部を賃貸し、残りの一部は製品倉庫として使用しています。
- businessStructure: 仕入先の個別名は【事業の内容】に印字されていません。原料仕入先としてのテイカ株式会社と株式会社マナック・ケミカル・パートナーズは関連企業の工程で扱いました。
- history: 沿革から落とした行: 1974年３月の本社事務所新築（単なる建物の新築）、1992年10月のSUGAI AMERICA,INC.の設立と2001年12月の清算、1995年10月のスガイシステムサービス株式会社の設立と2005年３月の清算（いずれも現在は存続しない海外・物流子会社の設立と清算で、現在の事業構成に残っていません）。
- history: 1962年の合併の行に印字された資本金の金額は、規則により history には書いていません。
- history: Wikipedia（スガイ化学工業、証券コード4120で同一性を確認）は、創業や製品分野が有報の記載と重なる補足にとどまり、有報に無い新しい事実は使っていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は chemicals としました。有機化学合成に基づく中間物と界面活性剤の製造販売が事業そのもので、閉じた分類に直接当たります。
- industry: pharmaceuticals は付けていません。同社は医薬品そのものではなく医薬用の中間物を供給する化学メーカーであり、売上の中心は農薬用中間物です。DEIの別記事業は cte です。暫定分類や taxonomyGaps はありません。
- relatedCompanies: frontier: 印字された相手は伊藤忠ケミカルフロンティア株式会社で、株式会社フロンティアとは別の法人です。伊藤忠ケミカルフロンティア自体は候補にないため結んでいません（主な相手先別の販売実績で2026年３月期に総販売実績の10.2％を占める主要な販売先です）。
- relatedCompanies: seki: 「セキュリティ」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: en: 「エンゲージメント」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: the-kiyo-bank: 大株主であり特定投資株式の保有も印字されていますが、保有目的は「主に資金調達先として、円滑な金融取引の維持」であり、資金調達・金融取引が理由のため結んでいません。
- relatedCompanies: trust: 日本マスタートラスト信託銀行株式会社の名称の一部の一致で、コードリストにもなく、結んでいません。
- relatedCompanies: daiwa: 印字された相手は大和産業株式会社で別の法人であり、電子記録債務の相手先別内訳の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: hokuriku-electric-power: 未払費用の相手先別内訳に印字されたのみで、取引関係の説明がないため結んでいません。
- relatedCompanies: innovation: 「イノベーション創出」という一般表現の一致のみです。
- relatedCompanies: meiwa: 買掛金等の相手先別内訳に印字されたのみで、取引関係の説明がないため結んでいません。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的が「主に資金調達先として、円滑な金融取引の維持」で、資金調達・金融取引が理由のため結んでいません。大株主の株式会社三菱ＵＦＪ銀行も同じ理由で結んでいません。
- relatedCompanies: mizuho-financial-group: 特定投資株式の保有目的が「主に資金調達先として、円滑な金融取引の維持」で、資金調達・金融取引が理由のため結んでいません。
- relatedCompanies: osaka-gas: 未払費用の相手先別内訳に印字されたのみで、取引関係の説明がないため結んでいません。
- relatedCompanies: path: 「マルチパーパスプラント」等の部分文字列の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: rix: 「カリックスアレーン」等の部分文字列の一致のみです。
- relatedCompanies: senshu-ikeda-holdings: 特定投資株式の保有目的が「主に資金調達先として、円滑な金融取引の維持」で、資金調達・金融取引が理由のため結んでいません。
- relatedCompanies: shima-seiki-mfg: 特定投資株式の保有目的は「地域経済の連携」で、具体的な取引・提携の記載がないため結んでいません。
- relatedCompanies: the-kansai-electric-power: 未払費用の相手先別内訳に印字されたのみで、取引関係の説明がないため結んでいません。
- relatedCompanies: zero: 「残存価額をゼロとする」等の一般表現の一致のみで、ambiguous でもあり、結んでいません。
- relatedCompanies: 候補にないため記録します: 日星産業株式会社は主な相手先別の販売実績で2026年３月期に総販売実績の25.1％を占める最大の販売先ですが、候補にないため結んでいません。三木産業株式会社は2026年３月31日現在で当社の株式の2.73％を保有する大株主ですが、候補にありません。スガイケミー株式会社は当社の非連結子会社であり、関連企業には結びません。
- terms: 助言のみ: 用語候補として 有機合成、中間物、界面活性剤、農薬原体、機能性化学品、マルチパーパスプラント、受注見込生産、特定投資株式、取引先持株会 などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
