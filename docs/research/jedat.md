# ジーダット — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジーダット |
| 証券コード | 3841 |
| docID（データを取り出した文書） | `S100YAUW` |
| 原本 docID | `S100YAUW` |
| 提出日（原本） | 2026-06-12 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAUW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジーダット / 3841 / docID S100YAUW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jedat: 10 件の数値を有報XBRLと照合
有報: 株式会社ジーダット 有価証券報告書－第24期(2025/04/01－2026/03/31) (docID S100YAUW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
jedat: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記は、株式分割の注記のほかは表示事項のみ（関連会社がないため持分法の投資利益を記載していないこと、潜在株式がない年度の非開示、記念配当の内訳、市場再編に伴う株主総利回りの比較指標の変更、株価の市場区分など）であり、会計基準の変更や決算期変更はないため financialNotes は空にしました。株式分割の注記は needsReview に記録しました。
- businessModel: 売上高の増減理由（製品及び商品は代理店製品の需要増、保守サービスは保守契約の締結促進、ソリューションは商談規模の縮小と一時的な受注減）は本文の範囲で記載しました。段階利益の金額・増減理由、キャッシュ・フローの金額、研究開発費の金額、受注高・受注残高の金額は書いていません。
- businessModel: 目標とする経営指標（経常利益率10％以上）は投資・利益指標の目標のため、本文にも perspectives にも書いていません。
- businessModel: 市場別の売上高（半導体市場1,532百万円、FPD市場509百万円）はMD&Aの記載であり、子区分の金額には【関連情報】の製品・サービス区分を採用しました。
- businessModel: 重要な後発事象の記載は有報にありません。2026年6月17日開催予定の定時株主総会で決議予定の配当は資本政策の手続のため warnings のみとします。
- businessStructure: 単一セグメント（EDAソフトウェア開発・販売コンサルテーション事業）のため、セグメント注記は省略されており、子区分は【関連情報】の製品及びサービスごとの情報の区分（製品及び商品1,178,974千円、保守サービス439,043千円、ソリューション423,586千円）で構成しました。金額は千円の印字を百万円に切り捨てており、切り捨て後の子区分合計（2,040百万円）は印字の売上高合計（2,041百万円）と1百万円差があります。
- businessStructure: 【主要な設備の状況】では本社及びその他事業所の設備の内容が「全社（共通）」と印字されているため、特定の子区分には結びつけず、本社の所在地のみ本文に記載しました。帳簿価額は書いていません。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先名の印字はありません。代理店製品の販売元である大日本印刷株式会社との関係は関連企業に記録しました。
- businessStructure: 当社は連結財務諸表を作成しておらず、子会社はありません（【関係会社の状況】に子会社の印字なし）。親会社は株式会社アルゴグラフィックス、その他の関係会社はセイコーインスツル株式会社です。
- history: 沿革の各行のうち、資本金の増資（2003年の設立時、2005年、2006年、2007年）は資本金額の事項のため項目にしていません。
- history: 省いた小項目: 北京の研究開発子会社績達特軟件（北京）有限公司の設立（2005年）と持分譲渡（2014年）、株式会社Ａ－ソリューションの設立（2007年）と清算結了（2012年）、愛績旻（上海）信息科技有限公司の設立（2013年）と持分譲渡（2015年）、市場統合に伴う上場先の表示変更（2010年、2013年）。
- history: Wikipediaの記事は見つからなかったため、補足はしていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、単一セグメントの事業が電子系CAD（EDA）ソフトウェアの自社開発・販売であるため it としました。閉じた分類に直接当たるため、暫定分類やtaxonomyGapsはありません。
- industry: 半導体は顧客業界であり、同社は半導体そのものや製造装置を作る会社ではないため semiconductors は付けていません。DEIの別記事業はcteです。
- relatedCompanies: argo-graphics: 【関係会社の状況】の親会社の区分どおり結びました。
- relatedCompanies: dai-nippon-printing: 【重要な契約等】の販売代理店契約（同社の商品を当社が販売代理する）に基づき supplier としました。
- relatedCompanies: sk-electronics: 【大株主の状況】に載る事業会社のため major-shareholder としました。
- relatedCompanies: port: 「サポート」などの部分一致のみで、ポート株式会社への言及はありません。
- relatedCompanies: base-4481: 「サンプルベース」などの一般語の部分一致のみです。
- relatedCompanies: kohsoku: 曖昧な候補で、「高速化」などの部分一致のみです。
- relatedCompanies: seki: 曖昧な候補で、「情報セキュリティ」などの部分一致のみです。
- relatedCompanies: no-1: 経営方針の「No.1のポジション」という一般的な文言のみです。
- relatedCompanies: ray: 曖昧な候補で、「フラットパネルディスプレイ」などの部分一致のみです。
- relatedCompanies: innovation: かつての連結子会社名「ジーダット・イノベーション」の部分一致のみです。
- relatedCompanies: core: 「事業のコア」という一般的な文言のみです。
- relatedCompanies: rhythm: 「アルゴリズム」の部分一致のみです。
- relatedCompanies: rohm: 前受金相手先別内訳に名前があるだけで、取引関係の記述がないため結びませんでした。
- relatedCompanies: sharp: 電子記録債権相手先別内訳に名前があるだけで、取引関係の記述がないため結びませんでした。
- relatedCompanies: tokai-rika: 主要な販売費及び一般管理費の内訳に名前があるだけで、取引関係の記述がないため結びませんでした。
- relatedCompanies: セイコーインスツル株式会社は【関係会社の状況】でその他の関係会社（被所有21.2％）として印字されていますが、related-candidates.json に候補がないため結べませんでした。
- relatedCompanies: 当社は上場株式を保有しておらず（【株式の保有状況】）、政策保有株式からの関連付けはありません。
- terms: 助言のみ: 用語候補として EDA（電子設計自動化、電子系CADソフトウェアの総称）、SX-Meister（同社の主力製品シリーズ）、LSI（大規模集積回路）、FPD（フラットパネルディスプレイ）、MEMS（微細加工技術による素子）が挙げられます。

## 要確認（status に反映）

- businessModel: 2022年４月１日付で普通株式１株につき２株の割合で株式分割を行っている（主要な経営指標等の推移の注記に記載）。
- businessStructure: 2022年４月１日付で普通株式１株につき２株の割合で株式分割を行っている（主要な経営指標等の推移の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
