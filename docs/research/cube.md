# キューブ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社キューブ |
| 証券コード | 7112 |
| docID（データを取り出した文書） | `S100XTL6` |
| 原本 docID | `S100XTL6` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTL6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社キューブ / 7112 / docID S100XTL6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cube: 10 件の数値を有報XBRLと照合
有報: 株式会社キューブ 有価証券報告書－第32期(2025/01/01－2025/12/31) (docID S100XTL6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
cube: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高以外の利益の金額や比率（売上総利益率、自己資本利益率など）は本文に書いていません。経営方針の目標指標（売上高・売上総利益・営業利益）も数値目標のため本文・perspectivesには書いていません。
- businessModel: industryPositionは、ゴルフ用品・ウェア市場の規模が外部の調査会社の数値であり、当社の順位やシェアの印字が無いため省きました。
- businessModel: 関係会社の状況では、エヌエックスシー・ジャパン合同会社とNXC Corporationが「その他の関係会社」として当社の議決権の35.4％を保有していますが、related-candidates.jsonに無いため関連企業には結んでいません（relatedCompaniesのwarningsにも記録）。
- businessModel: 2025年12月期に持分法を適用した場合の投資損失が印字されていますが、持分法損益の金額は本文に書いていません。中国の合弁会社IllumiVista Co., Limitedは当社の関連会社であり、関係の事実は沿革と事業構造に記載しました。
- businessStructure: 単一セグメントのため、子区分は【事業の内容】の事業区分表とMD&Aの事業区分別売上高内訳に基づき、売上高の大きい順に並べました。各区分の売上高は千円印字を百万円に切り捨てたため、8区分の合計（4,860百万円）は売上高の印字（4,863百万円）と3百万円差があります。印字どおり記載し、差は丸めによるものです。
- businessStructure: 商品は国内外の生産先で生産されたものを仕入先から仕入れており、自社では生産活動を行っていません。個別の仕入先名は印字されていないため、suppliersは旧スキーマの本ツリーでは省略し、事実のみここに記録します。
- businessStructure: 主要な販売相手先はJC FAMILY CO., LTD.（2025年12月期の販売実績1,323,492千円、総販売実績の27.2％）で、韓国卸の子区分の説明に総代理店として記載しました。
- history: 本店所在地の移転（2005年、2006年、2013年、2018年）は落としました。個別店舗の開店・閉店（大丸梅田店、小田急ハルク店、岩田屋本店、GINZA SIX、阪急うめだ本店、ハワイアラモアナ店、大丸札幌店、大丸心斎橋店、青山店、松坂屋名古屋店のCODE店など）は、最初の直営展開を示す表参道ヒルズ店を除き落としました。
- history: 米国子会社CUBE INTERNATIONAL INC.の設立（2018年）と清算結了（2022年）、株式会社キューブアソシエイツの設立（2020年）と清算結了（2021年）は落としました。
- history: 資本金の金額は沿革に書かないため、設立時の資本金等は記載していません。
- industry: 主たる業界はretail（小売）としました。衣料品等の企画販売事業の単一セグメントで、直営店と自社ECによる消費者への直接販売（国内リテール2,086百万円、国内EC820百万円、海外EC103百万円）が売上高の過半を占めるため、閉じた分類の retail が直接当てはまります。卸売も行いますが、独立した金額開示のある事業区分ではないため業界は足していません。taxonomy gapはありません。
- relatedCompanies: JC FAMILY CO., LTD.は韓国の総代理店で、2025年12月期の販売実績は総販売実績の27.2％を占める主要な販売相手先ですが、related-candidates.jsonに無いため結んでいません。
- relatedCompanies: エヌエックスシー・ジャパン合同会社とNXC Corporationは【関係会社の状況】で「その他の関係会社」とされ、当社の議決権の35.4％を保有しています（2025年12月31日現在）が、related-candidates.jsonに無いため結んでいません。
- relatedCompanies: IllumiVista Co., Limitedは当社の関連会社（議決権の50.0％を所有）で、その子会社を通じて中国でMARK&LONAブランド商品の小売・卸売を行っていますが、当社自身の関連会社であり、related-candidates.jsonにも無いため結んでいません。
- relatedCompanies: land（株式会社ランド）: 「ブランド」等の一般語の一致であり、関係の記載が無いため結びませんでした。
- relatedCompanies: en（エン株式会社）: ambiguous であり、「エンゲージメント」等の一般語の一致のため結びませんでした。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」という一般語の一致であり、関係の記載が無いため結びませんでした。
- relatedCompanies: innovation（株式会社イノベーション）: 「ブランディング・イノベーション」という一般語の一致のため結びませんでした。
- relatedCompanies: corona（株式会社コロナ）: 「新型コロナウイルス感染症」という一般語の一致のため結びませんでした。
- relatedCompanies: nissin（株式会社日新）: コードリストに無く上場でないため結びませんでした。
- relatedCompanies: port（ポート株式会社）: 「ニューポートビーチ」等の一般語の一致のため結びませんでした。
- relatedCompanies: seki（セキ株式会社）: ambiguous であり、「情報セキュリティ」等の一般語の一致のため結びませんでした。
- relatedCompanies: king（株式会社キング）: 「コンピュータクラッキング」等の一般語の一致のため結びませんでした。
- relatedCompanies: cota（コタ株式会社）: ambiguous であり、「インコタームズ」等の一般語の一致のため結びませんでした。
- relatedCompanies: freee（フリー株式会社）: 「フリーダムロゴ」等の一般語の一致のため結びませんでした。
- relatedCompanies: global-information（株式会社グローバルインフォメーション）: コードリストに無く上場でないため結びませんでした。市場の規模の出典として名前が出るだけで、取引・提携の記載もありません。
- relatedCompanies: matsui-securities（松井証券株式会社）: 大株主の状況に載る証券会社ですが、金融機関の純投資であり、取引・提携の記載が無いため結びませんでした。
- relatedCompanies: path（パス株式会社）: ambiguous であり、「マルチパーパス」等の一般語の一致のため結びませんでした。
- relatedCompanies: ray（株式会社レイ）: ambiguous であり、一般語の一致のため結びませんでした。
- relatedCompanies: slogan（株式会社スローガン）: 「スローガン」という一般語の一致のため結びませんでした。
- relatedCompanies: taya（株式会社田谷）: ambiguous であり、「世田谷区」という地名の一致のため結びませんでした。
- relatedCompanies: the-lead（株式会社リード）: 「リードしていく」という一般語の一致のため結びませんでした。
- relatedCompanies: tokyo-seimitsu（株式会社東京精密）: 役員の経歴の中で他社の旧社名として出るだけで、当社との取引・提携・資本関係の記載が無いため結びませんでした。
- relatedCompanies: tryt（株式会社トライト）: コードリストに無く上場でないため結びませんでした。
- relatedCompanies: united（ユナイテッド株式会社）: 施設名等の一般語の一致であり、関係の記載が無いため結びませんでした。
- terms: 助言のみ。用語の候補としては「消化仕入」「D2C」「パーソナルラグジュアリー」「プロパー消化比率」「ハイエンド向けラグジュアリーブランド」「使用許諾（ライセンス）」などが挙げられますが、本工程ではデータを持ちません。

## 要確認（status に反映）

- businessModel: 2022年5月19日付で普通株式1株につき200株の割合で株式分割を行っています（主要な経営指標等の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
