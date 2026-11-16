# ネオジャパン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ネオジャパン |
| 証券コード | 3921 |
| docID（データを取り出した文書） | `S100Y0W0` |
| 原本 docID | `S100Y0W0` |
| 提出日（原本） | 2026-04-27 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y0W0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ネオジャパン / 3921 / docID S100Y0W0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
neojapan: 10 件の数値を有報XBRLと照合
有報: 株式会社ネオジャパン 有価証券報告書－第34期(2025/02/01－2026/01/31) (docID S100Y0W0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
neojapan: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 段階利益の金額や増減は本文に書いていない。会社が目標とする経営指標（売上高成長率と売上高の段階利益率）は投資・利益指標の目標に当たるため perspectives にも数値では書いていない。
- businessModel: セグメント利益の金額は書いていない（本文に書くのは売上高と当期純利益のみ）。
- businessModel: 当連結会計年度の期首から、DELCUI Inc.の属するセグメントを海外事業からソフトウエア事業へ変更している（業績管理区分の見直し）。表示上の変更のため needsReview にはせず、businessStructure の warnings に記録した。
- businessModel: 受注高と受注残高は重要性が乏しいとして有報で金額の記載が省略されており、本文にも書いていない。
- businessModel: 指標の注記２（第34期は希薄化効果を有する潜在株式が存在しないため潜在株式調整後１株当たり当期純利益を記載していない）は表示事項のため、本文には書かずここに記録する。
- businessModel: 期中の動きとして、株式会社neoAIとの業務提携による生成AIプラットフォーム「neoAI Chat for desknet's」の提供開始（2025年９月）、米国LIVEX AI Inc.との販売パートナー契約による日本でのサービス提供開始（2025年10月）、マレーシアのInvest JohorとのCentre of Excellence設立に向けた覚書締結（2025年６月）がMD&Aに印字されている。いずれも相手先が関連企業候補の一覧にないため relatedCompanies には結んでいない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（ソフトウエア事業6,217,645千円、システム開発サービス事業1,935,820千円、海外事業76,764千円）とした。３事業の合計は連結売上高8,230,230千円と一致する。
- businessStructure: ソフトウエア事業の子区分（クラウドサービス、プロダクト、技術開発）はMD&Aの売上区分による。MD&Aの区分別金額はセグメント内部売上高13,503千円を含む合計6,231,148千円を基礎とするため外部売上高とは一致せず、子区分には金額を書かなかった。
- businessStructure: 当連結会計年度の期首から、DELCUI Inc.の属するセグメントを海外事業からソフトウエア事業へ変更している（業績管理区分の見直し）。表示上の変更であり needsReview にはせず、ここに記録する。前期のセグメント情報は変更後の区分で開示されている。
- businessStructure: 連結子会社は５社で、株式会社Pro-SPIRE（システム開発サービス事業、議決権100.0％）、DELCUI Inc.（ソフトウエア事業、100.0％）、NEOREKA ASIA Sdn. Bhd.（海外事業、70.0％）、NEO THAI ASIA Co.,Ltd.（海外事業、49.0％）、NEOPhilippine Tech Inc.（海外事業、100.0％）である。自社の子会社であるため relatedCompanies には結んでいない。
- businessStructure: 主要な設備は、本社（横浜市西区）と大阪営業所がソフトウエア事業、株式会社Pro-SPIREの本社（東京都大田区）がシステム開発サービス事業に属する。海外子会社の設備は重要性が乏しいとして有報で記載が省略されている。設備の帳簿価額は書いていない。
- businessStructure: 株式会社Pro-SPIREの単体の売上高などの数値が関係会社の状況に印字されているが、子会社の単体数値は本文に書かなかった。
- businessStructure: 主要な顧客はダイワボウ情報システム株式会社で、2026年1月期の同社への売上高は1,204,441千円（ソフトウエア事業）である。同社は関連企業候補の一覧に含まれていないため relatedCompanies には結んでおらず、ここに記録する。
- history: 沿革のうち、本社移転（1996年、2004年）、東京オフィス開設（2000年）、大阪営業所新設（2017年）、名古屋営業所新設（2019年）、福岡営業所新設（2022年）の拠点の開設・移転の項目は本文の沿革には入れなかった。
- history: 子会社の設立・異動の項目（2010年の株式会社ライブラネオ設立、2015年の同社全株式の譲渡、2019年のDELCUI Inc.設立、2019年のNEOREKA ASIA Sdn. Bhd.設立、2021年のNEO THAI ASIA Co.,Ltd.設立、2024年のNEOPhilippine Tech Inc.設立）は、2019年のPro-SPIRE子会社化を除き本文の沿革には入れなかった。
- history: 市場の呼称変更の項目（2018年の東京証券取引所市場第一部への市場変更、2022年のプライム市場への移行）は本文の沿革には入れなかった。
- history: 2009年の株式会社ビットアイル（現：エクイニクス・ジャパン・エンタープライズ株式会社）による資本参加は過去の資本関係であり、本文の沿革には入れなかった。
- history: Wikipediaの「ネオジャパン」の記事は、本社の所在地など有報と重なる一般的な記述のみで、補足として使う事実はなかったため出典には加えなかった。
- industry: 主たる業界は it とした。グループウェア等のソフトウエアの開発・クラウド提供と、子会社によるシステム開発サービスのいずれも情報サービスに直接当てはまるため、業界は it のみとした。
- industry: telecommunications は付けなかった。同社は通信回線や通信インフラを提供する事業者ではないためである。
- industry: 海外事業はASEAN地域での自社製品の販売・サポートであり、別の業界には当てはまらない。
- industry: DEIの別記事業はcteである。
- relatedCompanies: port（ポート）: 「パートナー企業」等の部分文字列の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: en（エン）: 「エンジニアリング」等の部分文字列の一致のみで、ambiguousでもあるため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「時価ベース」等の部分文字列の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 経営方針やMD&A中の一般語「オープンイノベーション」等の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: seki（セキ）: 「セキュリティ」等の部分文字列の一致のみで、ambiguousでもあるため結ばなかった。
- relatedCompanies: vision（ビジョン）: 株主優待や理念に関する文中の一般語「ビジョン」の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: land（ランド）: 本店所在地「横浜ランドマークタワー」の部分文字列の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: zero（ゼロ）: 行動指針「ゼロから何かを生み出す喜び」等の一般表現の一致のみで、ambiguousでもあるため結ばなかった。
- relatedCompanies: career（キャリア）: 人材の多様性に関する文中の一般語「キャリア」の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: freee（フリー）: 「CO2フリー電力」の部分文字列の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: path（パス）: 「ITパスポート」の部分文字列の一致のみで、ambiguousでもあるため結ばなかった。
- relatedCompanies: i-ll（アイル）: 有報に印字されるのは株式会社ビットアイル（現：エクイニクス・ジャパン・エンタープライズ株式会社）であり、候補の株式会社アイルとは別法人である。ビットアイルとの関係も2009年の資本参加と2015年の子会社株式の譲渡という過去の出来事のみであるため結ばなかった。
- relatedCompanies: trust（トラスト）: 現在のコードリストにない候補である。有報の印字は日本マスタートラスト信託銀行株式会社（信託口）で、信託の受託者としての記載であるため結ばなかった。
- relatedCompanies: no-1（ナンバーワン）: 経営戦略の目標文中の一般表現「シェアNo.1」の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: ray（レイ）: 「レイアウト変更」等の部分文字列の一致のみで、ambiguousでもあるため結ばなかった。
- relatedCompanies: seed（シード）: 大株主の名称「プロシードゥス」の部分文字列の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: the-lead（リード）: マーケティング文脈の一般語「リード獲得」の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: will（ウィル）: 「コンピューターウィルス」の部分文字列の一致のみで、同社についての印字はないため結ばなかった。
- relatedCompanies: 候補一覧にないため結ばなかった相手: ダイワボウ情報システム株式会社はセグメント情報とMD&Aに主要な顧客として印字されるが（2026年1月期の売上高1,204,441千円）、候補一覧に含まれていないため結んでいない。株式会社neoAI（業務提携）、LIVEX AI Inc.（販売パートナー契約）、Invest Johor（覚書締結先）も候補一覧にないため結んでいない。
- relatedCompanies: 特定投資株式は「該当事項はありません」と印字されており、政策保有株式からのリンクはない。
- relatedCompanies: 自社の連結子会社５社（株式会社Pro-SPIRE、DELCUI Inc.、NEOREKA ASIA Sdn. Bhd.、NEO THAI ASIA Co.,Ltd.、NEOPhilippine Tech Inc.）は関連企業には結ばない。
- terms: 助言のみ。用語としては「desknet's NEO」「グループウェア」「AppSuite」「ChatLuck」「neoAI Chat」「DaaS」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
