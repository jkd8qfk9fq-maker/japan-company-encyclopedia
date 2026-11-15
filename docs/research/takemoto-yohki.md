# 竹本容器 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 竹本容器株式会社 |
| 証券コード | 4248 |
| docID（データを取り出した文書） | `S100XSML` |
| 原本 docID | `S100XSML` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSML.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 竹本容器株式会社 / 4248 / docID S100XSML（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takemoto-yohki: 10 件の数値を有報XBRLと照合
有報: 竹本容器株式会社 有価証券報告書－第75期(2025/01/01－2025/12/31) (docID S100XSML)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
takemoto-yohki: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空にしました。主要な経営指標等の注記は従業員数の数え方に関する表示事項のみで、変則決算・決算期変更・会計方針の変更にあたる事実は証拠パックにありませんでした。
- businessModel: 資源循環型パッケージングの売上高（36億11百万円）は経営指標的な区分の数値であり、報告セグメントや【関連情報】の区分ではないため本文には書いていません。
- businessModel: 経営方針の主要な経営指標（売上高伸長率など投資・収益性の指標）の目標値は、本文・戦略のいずれにも書いていません。
- businessModel: MD&Aの段階利益の金額や理由、キャッシュ・フローの金額、設備の帳簿価額は書いていません。
- businessStructure: 単一セグメント（容器事業）のため、事業は1つとし、製品区分（生産実績の分類である容器本体（ボトル、ジャー）・容器本体（押し出しチューブ）・容器付属品）を children にしました。製品区分ごとの売上高は開示されていないため、金額は書いていません（生産高は売上高ではないため引用していません）。
- businessStructure: 地域別の外部顧客への売上高はセグメント注記【関連情報】の千円印字を百万円に切り捨てて引用しました（日本10,909百万円・中国2,200百万円・その他1,381百万円）。切り捨てのため3区分の合計は連結売上高14,491百万円と1百万円差があります。
- businessStructure: MD&Aの地域別売上高（日本110億9百万円等）は生産・販売拠点ベースの数値で、セグメント注記の顧客所在地ベースの外部売上高とは異なるため、事業の内訳にはセグメント注記の値を使いました。
- businessStructure: 設備は単一セグメントで事業所ごとに複数機能が連記されているため、特定の事業（children）には結びつけていません。
- businessStructure: suppliers はこのツリーの旧スキーマに無いため書いていません。原料・製品の供給面では、日本で販売する製品は主に国内の自社工場（6工場）と当社の金型を預託している協力メーカーで生産していることが【事業の内容】に印字されています。
- history: 沿革表のうち、営業所の開設・移転・改称（1960年合羽橋店舗、1980年大阪営業所、1988年福岡営業所、1996年東海営業所、2000年名古屋営業所への移転、2012年北海道営業所、2013年タイ駐在員事務所）、国内子会社の設立・吸収合併の細目（1988年・1990年・1997年・1999年・2005年・2009年・2011年・2013年の各行）、工場の廃止・移転（1992年・2015年・2016年）、2005年の本社ビル竣工、2016年の岡山事業所設立、2017年のFSSC22000認証取得、2020年のTOGETHER LAB開設は、事業の転機として選んだ項目に絞るため割愛しました。
- history: 1950年の竹本商店創業は沿革表の前文に印字されている事実です。資本金の金額は沿革に書いていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は chemicals としました。当社グループの製品はプラスチック製の包装容器であり、証券コード協議会の業種区分でも化学に分類されています（証拠パックの Wikipedia は「日本の企業一覧（化学）」に証券コード4248で掲載）。閉じた分類に容器・包装専用の区分は無く、樹脂製品として chemicals が実態に合います。
- industry: Wikipedia の記事は企業一覧ページであり当社自身の記事ではないため、補足には使っていません。DEIの別記事業は cte です。
- relatedCompanies: nof（日油）: セグメント注記とMD&Aの双方で主要な顧客として正式名称「日油株式会社」が印字されており、同一性と取引関係の両方に根拠があるため customer として結びました。
- relatedCompanies: adjuvant-holdings（株式会社アジュバンホールディングス）: 特定投資株式として6,000株を保有していますが、保有目的はもう1銘柄の株式会社MTGと同一の定型句「取引関係の維持・強化」であり、個別の取引関係は印字されていないため結びませんでした。
- relatedCompanies: matsui-securities（松井証券株式会社）: 【大株主の状況】に1.08％の株主として載りますが、金融機関の純投資とみられるため結びませんでした。
- relatedCompanies: core（株式会社コア）: 「コア」はコア人材などの一般語であり、同社への言及ではありません。
- relatedCompanies: nissin（株式会社日新）: コードリストに無く、「日新」は新株予約権の条文中の部分文字列であり、同社への言及ではありません。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」は経営理念（ビジョン、ミッション等）の一般語であり、同社への言及ではありません。
- relatedCompanies: base-4481（ベース株式会社）: 「ベース」は連結ベースの部分であり、同社への言及ではありません。
- relatedCompanies: corona（株式会社コロナ）: 「コロナ」は新型コロナウイルス感染症の文脈であり、同社への言及ではありません。
- relatedCompanies: idea-consultants（いであ株式会社）: 「いであ」は「〜であります」の部分文字列であり、同社への言及ではありません。
- relatedCompanies: seki（セキ株式会社）: 「セキ」はセキュリティの部分文字列であり、同社への言及ではありません。
- relatedCompanies: will（株式会社ウィル）: 「ウィル」はコンピュータ・ウィルスの部分であり、同社への言及ではありません。
- relatedCompanies: 株式会社MTGは特定投資株式（1,200株、保有目的は定型句「取引関係の維持・強化」）ですが、関連企業候補に含まれないため結んでいません。
- relatedCompanies: 連結子会社7社（株式会社共栄プラスコ、上海竹本容器包装有限公司、竹本容器（昆山）有限公司、TAKEMOTO PACKAGING INC.、Takemoto Netherlands B.V.、TAKEMOTO PACKAGING (THAILAND) CO., LTD.、TAKEMOTO YOHKI INDIA PRIVATE LIMITED）は自社の子会社であるため結んでいません。【株式の保有状況】の特定投資株式は上記2銘柄のみです。
- terms: 助言のみ: 用語候補として スタンダードボトル、ディスペンサー、金型、ブロー成型、押し出しチューブ、資源循環型パッケージング、生分解性樹脂、バイオマス原料 などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
