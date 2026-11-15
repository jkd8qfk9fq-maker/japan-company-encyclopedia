# テクマトリックス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | テクマトリックス株式会社 |
| 証券コード | 3762 |
| docID（データを取り出した文書） | `S100YL8T` |
| 原本 docID | `S100YL8T` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL8T.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | テクマトリックス株式会社 / 3762 / docID S100YL8T（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
techmatrix: 10 件の数値を有報XBRLと照合
有報: テクマトリックス株式会社 有価証券報告書－第42期(2025/04/01－2026/03/31) (docID S100YL8T)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":4060857000,"latestFiling":4056530000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":6424641000,"latestFiling":6418947000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":105441363000,"latestFiling":105497930000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":24207219000,"latestFiling":24202927000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
techmatrix: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: セグメント別売上収益は千円単位の印字を百万円に換算して記載した。3セグメントの換算後の合計（71,733百万円）は、連結売上収益71,733,770千円の換算値と一致する。
- businessModel: 中期経営計画の数値目標（2027年3月期の売上収益・営業利益の目標額など）は将来の目標であるため、本文には金額を記載せず方針の要約のみとした。
- businessModel: Firmus Sdn. Bhd.の企業結合に係る暫定的な会計処理の確定は、主要な経営指標等の注記とセグメント情報に理由が印字されているため、needsReviewではなくfinancialNotesに記録した。修正再表示チェックで差異があったのは2025年3月期の列のみである。
- businessModel: メドメイン株式会社は2026年3月31日現在は資本業務提携先として投資有価証券を保有する先であり、連結子会社化は後発事象のため、関連企業には結ばずneedsReviewに記録した。
- businessModel: Wikipediaの記事は確認したが、有報の記載を超える補足は使わず、出典にも加えていない。
- businessStructure: セグメントの売上収益はセグメント注記の外部顧客への売上収益を用い、千円単位の印字（情報基盤事業51,620,293千円、医療システム事業10,229,238千円、アプリケーション・サービス事業9,884,238千円）を百万円に換算して記載した。MD&Aや販売実績の数値も同じ外部顧客ベースであることを確認した。
- businessStructure: 事業の並び順は外部顧客への売上収益の大きい順とし、有報の記載順（情報基盤事業、アプリケーション・サービス事業、医療システム事業）とは異なる。
- history: 沿革に印字された資本金額（設立時の資本金50百万円など）は、資本金額を本文に書かない規則のため記載していない。
- history: 営業所の開設・移転、本社の移転、ISMS等の認証取得、指数構成銘柄への選定、監査等委員会設置会社への移行などの細目は、事業の転機となる出来事を優先して省いた。
- history: 2018年の株式会社NOBORI設立と医療システム事業部承継は、2022年のPSPによる吸収合併の行に統合して記録した。
- industry: 事業はIT関連のソフトウェア、ハードウェア、ソリューションの販売とコンサルティング、保守等のサービスが中心であり、主産業はitとした。医療システム事業は医療機関向けの情報システム事業であり、医薬品や医療機器の製造ではないため、pharmaceuticalsは付けていない。
- relatedCompanies: モビルス（mobilus）は持分法適用関連会社であり、自社グループの会社のため結ばなかった。
- relatedCompanies: エムスリー（m3）は、一致した記載が持分法適用関連会社のエムスリーAI株式会社であり、エムスリー自体についての取引・提携の記載がないため結ばなかった。
- relatedCompanies: 双日（sojitz）は、前身のニチメン株式会社が1984年の設立時の親会社であるが、有報に現在の取引・資本関係の記載がないため結ばなかった。設立の事実は沿革に記録した。
- relatedCompanies: ソフトバンク（softbank）は、2016年に遠隔病理プラットフォームサービスで提携した旨が沿革に載るのみで、現在の関係を示す記載がないため結ばなかった。
- relatedCompanies: キヤノン（canon）は、有報の印字がキヤノンメディカル（キヤノンの子会社）とのAIベンダー連携であり、キヤノン自体ではないため結ばなかった。
- relatedCompanies: サイボウズ（cybozu）、エイトレッド（atled）、ブレインズテクノロジー（brains-technology）、ARアドバンストテクノロジ（ar-advanced-technology）は、事業の内容の取扱製品一覧に製品が載るのみで、個別の取引・提携の記載がないため結ばなかった。
- relatedCompanies: 三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group）は、有報の印字が常任代理人としての三菱UFJ銀行（同グループとは別の法人）などであり、同グループ自体との関係の記載がないため結ばなかった。
- relatedCompanies: 株式会社ベネッセコーポレーションは業務提携先だが未上場でrelated-candidates.jsonになく、親会社のベネッセホールディングスも候補にないため結ばなかった。提携の事実はbusinessModelのindustryPositionと沿革に記録した。
- relatedCompanies: メドメイン株式会社は資本業務提携先だが未上場で候補になく、後発事象による連結子会社化はneedsReviewに記録したため結ばなかった。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）、株式会社日本カストディ銀行（信託口）などの大株主は信託口（カストディ）であり、事業会社ではないため結ばなかった。
- relatedCompanies: 自社グループの連結子会社12社と持分法適用関連会社2社は、関連企業として結ばなかった。
- relatedCompanies: その他の候補（career、en、rix、base-4481、core、port、innovation、step、secure、freee、land、lec、like、cover、idea-consultants、suzuki-6785、the-lead、rent、semba、will、zero、technologies、path、king）は一般語・部分一致であり相手についての記載がなく、nissinとtrustはコードリストにないため、いずれも結ばなかった。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、当社と連結子会社のPSP株式会社は、2026年4月24日の取締役会決議に基づき、2026年4月30日付の株式取得譲渡契約によりメドメイン株式会社の株式を追加取得し、議決権比率72.05％として連結子会社とした。登録は2026年3月31日現在の構成（連結子会社12社）に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
