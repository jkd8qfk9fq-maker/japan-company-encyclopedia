# IC — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＩＣ |
| 証券コード | 4769 |
| docID（データを取り出した文書） | `S100XBNE` |
| 原本 docID | `S100XBNE` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBNE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＩＣ / 4769 / docID S100XBNE（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ic: 10 件の数値を有報XBRLと照合
有報: 株式会社ＩＣ 有価証券報告書－第48期(2024/10/01－2025/09/30) (docID S100XBNE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ic: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社IC」が EDINET の提出者名「株式会社ＩＣ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は収益認識基準の適用（2022年9月期）の1件のみ着地させた。同年に競合する注記はない。指標注記1（潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していない）は表示事項のため warnings にとどめた。
- businessModel: 目標とする経営指標（売上高経常利益率8.0％）は利益率の目標数値のため、本文にも perspectives にも書かなかった。
- businessModel: 受注高・受注残高の金額、MD&Aの営業利益・経常利益・特別損益などの金額は書かなかった。
- businessModel: ITサービス事業の売上減少の理由（主要顧客の開発業務の一部をITソリューション事業へ戦略的に移管）は、売上高の増減理由としてMD&Aの印字どおりに記した。
- businessStructure: 単一セグメント（情報サービス事業）のため、【事業の内容】に印字された事業部門（ITソリューション事業・ITサービス事業）を businesses とし、金額はセグメント注記の【関連情報】に印字された製品及びサービスごとの外部顧客への売上高によった。
- businessStructure: ITソリューション事業の内訳（ソフトウェア開発5,095百万円、システム運用4,871百万円）はMD&Aに印字された事業部門別の売上高であり、合計は9,966百万円とセグメント注記の9,967百万円に1百万円届かない。切り捨てによる差として印字のまま記載した。
- businessStructure: セグメント注記の主要な顧客は「日立グループ」とグループ集計で印字されているため、事業の説明にはMD&Aの販売実績に印字された株式会社日立システムズを主な販売先として記すにとどめた。
- businessStructure: 主要な設備（本社、茨城センタ）は単一セグメントの全社共通の設備のため、特定の事業には結びつけなかった。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。個別に印字された仕入先・外注先はない。
- history: 沿革の資本金額（設立時の資本金、株式会社日本ネイルゲージシステムズや株式会社LOCOBEEの資本金）は規則により記載しなかった。
- history: 省略した行: 営業所・開発センタの開設・移転・統廃合（1981〜2003年の各行）、セラミック系塗料の施工・防水剤販売の開始と商権譲渡（1993・1995年）、合弁子会社株式会社日本ネイルゲージシステムズの設立と清算（1994・1998年）、本社の移転（1986・1997・2006年）、株式会社フィートの移転（2025年）など、拠点の異動と撤退事業に関する minor な行。
- history: 2004年の買収と上場は同年のため2項目に分けた。月の情報は history の形式上、年に丸めている。
- industry: 主たる業界は it とした。単一セグメントの情報サービス事業であり、ITソリューション事業とITサービス事業のいずれも情報サービスに当たるため、2つ目の業界は付けなかった。
- industry: DEIの別記事業は連結・個別とも CTE（情報サービス）であり、it の分類と整合する。
- relatedCompanies: scala: 特定投資株式の保有目的に、システム・ソフト開発や情報サービス分野での取引と協力関係が個別に印字されており、【大株主の状況】にも事業会社として載るため business-partner として結んだ。取引の向きは印字されていない。
- relatedCompanies: en: 「エン」は一般語（エンジニア等）の部分一致であり、エン株式会社への言及ではないため結ばなかった。
- relatedCompanies: base-4481: 「ベース」は時価ベース等の一般語の部分一致であり、ベース株式会社への言及ではないため結ばなかった。
- relatedCompanies: career: 「キャリア」はキャリアプラン等の一般語であり、株式会社キャリアへの言及ではないため結ばなかった。
- relatedCompanies: seki: ambiguous で、「セキュリティ」等の一般語の部分一致にとどまり、セキ株式会社への言及が確認できないため結ばなかった。
- relatedCompanies: yondoshi-holdings: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句（投資先との将来的な事業展開等）であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: tokyu: 一致箇所は厚生施設「東急ハーヴェストクラブ」の名称であり、東急株式会社との取引・資本関係の記載がないため結ばなかった。
- relatedCompanies: vision: 「ビジョン」は長期ビジョン「VISION 2031」の語であり、株式会社ビジョンへの言及ではないため結ばなかった。
- relatedCompanies: hikari-tsushin: 【大株主の状況】に印字されているのは光通信ＫＫ投資事業有限責任組合であり、株式会社光通信とは別の法人格のため結ばなかった。
- relatedCompanies: itfor: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: kawasaki-geological-engineering: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: kikusui-holdings: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: mk-seiko: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: nippon-gas: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: nireco: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: nishikawa-keisoku: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: yamato: 特定投資株式として保有するのみで、保有目的は全銘柄共通の定型句であり、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: port: 「ポート」はサポートの部分一致であり、ポート株式会社への言及ではないため結ばなかった。
- relatedCompanies: step: 「ステップ」はセカンドステップ等の一般語の部分一致であり、株式会社ステップへの言及ではないため結ばなかった。
- relatedCompanies: 候補にない相手: セグメント注記の主要な顧客「日立グループ」はグループ集計の名称で単一の法人格ではなく、MD&Aの主な販売先である株式会社日立システムズも候補にないため、いずれも結ばなかった。
- relatedCompanies: 候補にない相手: 株式会社NSDは特定投資株式の保有目的にスカラと同じく取引の記載があるが、候補（related-candidates.json）にないため結ばなかった。
- relatedCompanies: 自社の連結子会社（株式会社シルク・ラボラトリ、株式会社フィート、株式会社日本画像配信）は関連企業として結ばなかった。
- terms: 助言: 用語「チケット for LINE Hybrid」は、当社が提供するクラウド型チケット販売サービスの名称で、【事業の内容】に印字されています。
- terms: 助言: 用語「らくらく入場サービスHINORI」は、当社の入場サービス（チケット販売サービスとあわせて提供）の名称で、【事業の内容】に印字されています。
- terms: 助言: 用語「iDEP」は、スポーツや教育領域に向けた個人能力開発支援システムの名称で、【事業の内容】に印字されています。
- terms: 助言: 用語「こえとら」は、連結子会社の株式会社フィートが提供する聴覚障がい者コミュニケーション支援アプリの名称で、【事業の内容】に印字されています。
- terms: 助言: 用語「Sound Pipette」は、連結子会社の株式会社フィートが提供する、騒音環境下で目的エリアの音をクリアに収音する装置の名称で、【事業の内容】に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
