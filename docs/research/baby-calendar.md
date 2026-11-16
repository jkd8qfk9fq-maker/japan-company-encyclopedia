# ベビーカレンダー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ベビーカレンダー |
| 証券コード | 7363 |
| docID（データを取り出した文書） | `S100YX4F` |
| 原本 docID | `S100YNQ1` |
| 提出日（原本） | 2026-06-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100YX4F, S100YNO5／有効文書 S100YX4F（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YX4F.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ベビーカレンダー / 7363 / docID S100YNQ1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 5 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
baby-calendar: 10 件の数値を有報XBRLと照合
有報: 株式会社ベビーカレンダー 訂正有価証券報告書－第35期(2025/01/01－2025/12/31) (docID S100YX4F)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-12-31","previousFiling":1528358000,"latestFiling":1528155000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":17186000,"latestFiling":-14569000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":47596000,"latestFiling":43723000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":1558992000,"latestFiling":1526542000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":704584000,"latestFiling":672828000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第35期(2025/01/01－2025/12/31)、docID S100YX4F）を有効文書としてこのパックを作った。原本は docID S100YNQ1。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 訂正有価証券報告書－第34期(2024/01/01－2024/12/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
baby-calendar: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（S100YX4F、2026年８月17日提出）。証拠パックの原本比較では財務の数値・本文とも原本（S100YNQ1）と同一の record-only 分類であり、指標への影響はないため warnings のみの扱いとした。
- businessModel: 訂正有価証券報告書－第34期（S100YNO5、2026年６月30日提出）がある。第34期の指標が前期有報の印字と異なる点は、指標注記11の暫定的な会計処理の確定の反映として financialNotes（2024年12月期）に記録した。
- businessModel: 2025年12月期の負債の増加要因として訂正関連費用引当金80,402千円の計上がMD&Aに印字されている。貸借対照表項目であり、本文の金額（売上高・当期純利益）には含めていない。
- businessModel: セグメント外部売上高の千円未満切り捨て後の合計（1,638百万円＋288百万円＝1,926百万円）は、売上高1,927百万円と１百万円異なる。印字どおりとし、切り捨ての差異として記録する。
- businessModel: 目標とする指標（売上高・利益の前年比成長を重視する旨）は方針の記載のみで、数値目標は prose・strategy に書いていない。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高の大きい順とした（メディア事業1,638百万円、医療法人向け事業288百万円）。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。個別の仕入先名は印字されていない。
- businessStructure: MD&Aのメディア事業の売上高1,640,453千円はセグメント間の内部売上高を含む数値であり、登録にはセグメント情報の外部顧客への売上高1,638,593千円を用いた。
- businessStructure: セグメント利益は書いていない。
- history: 資本金の金額は沿革に書いていない（設立時の資本金100万円等の記載は除外した）。
- history: 本社移転のみの行（2006年の港区移転、2018年の渋谷区移転）、オオサキメディカルとの協業開始（2017年）、個別のサイトリリース（2019年のウーマンカレンダー・介護カレンダー、2020年のムーンカレンダー）などは独立項目とせず、主要な節目に絞った。
- history: クックパッドとの関係は沿革上の記載（2015年の子会社化と2017年のMBOによる独立）のみであり、現在の関係会社の記載はない。
- industry: 主たる業界は media（メディア）とした。最大の報告セグメントであるメディア事業（外部顧客への売上高1,638百万円、売上高の約85％）が妊娠・出産・育児等の情報サイトの運営であるため。
- industry: it（IT）を２つ目に付けた。医療法人向け事業（同288百万円）は、産婦人科向けの院内システムや予約システムの提供、WEBマーケティング支援であり、独立して開示された報告セグメントであるため。
- industry: 分類の不足として記録すべき新しい業界はなく、taxonomyGaps は空とした。
- relatedCompanies: cookpad（クックパッド株式会社）: 2015年に当社を子会社化した元親会社だが、2017年のMBOで経営権が移っており、沿革上の記載のみで現在の取引・資本関係の記載がないため結ばなかった。
- relatedCompanies: crowdworks（株式会社クラウドワークス）: 売掛金の相手先別内訳に載るのみで、取引関係を述べる記載がないため結ばなかった。
- relatedCompanies: microad（株式会社マイクロアド）: 売掛金の相手先別内訳に載るのみで、取引関係を述べる記載がないため結ばなかった。
- relatedCompanies: j-frontier（ジェイフロンティア株式会社）: 前受金の相手先に載るのみで、取引関係を述べる記載がないため結ばなかった。
- relatedCompanies: mitsubishi-electric（候補の三菱電機）: 売掛金の相手先は三菱電機フィナンシャルソリューションズ株式会社であり、候補とは別の法人のため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」という一般語への一致であり、同社についての記載はないため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」という一般語への一致であり、同社についての記載はないため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション」という一般語への一致であり、同社についての記載はないため結ばなかった。
- relatedCompanies: king（株式会社キング）: 「ハッキング」という語の部分一致であり、同社についての記載はないため結ばなかった。
- relatedCompanies: port（ポート株式会社）・en（エン株式会社）・base-4481（ベース株式会社）・seki（セキ株式会社）・lec（レック株式会社）・i-ne（株式会社Ｉ－ｎｅ）: 一般語・部分一致であり、同社についての記載はないため結ばなかった。
- relatedCompanies: nissin（日新）: コードリストにない相手であり、部分一致のため結ばなかった。
- relatedCompanies: 候補にない相手: グーグル合同会社はメディア事業の主要な顧客（2025年12月期の売上高370,073千円）として印字されるが、関連企業候補に含まれていないため結ばなかった。オオサキメディカル株式会社は大株主（1.68％）であり2017年の協業開始が沿革に載るが、候補に含まれていないため結ばなかった。株式会社SBI証券・楽天証券株式会社は大株主の表に載るが証券会社の名義口座のため結ばなかった。
- terms: 助言のみ。用語候補: 「ベビーパッドシリーズ」（産婦人科の施設ごとにカスタマイズしたコンテンツをiPad等で提供する院内サポートサービス）、「専門家監修」（医師・助産師等の専門家が記事等の内容を確認すること）、「タイアップ広告」（企業と連携して制作する広告記事）、「PV連動型広告」（サイトのページビューに応じて掲載・課金される広告）、「産後ケア」（出産後の母子を支援するサービス）、「日めくり」（出産予定日等を登録した利用者に、その日に必要な情報を日替わりで届ける機能）。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、当社が運営する一部のチャンネルについて、当事業年度末後に、第三者が運営する動画配信プラットフォームにおいて収益化停止となる事象が発生した旨が記載されています。本登録は2025年12月期の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
