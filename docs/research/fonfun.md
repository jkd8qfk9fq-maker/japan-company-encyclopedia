# 株式会社ｆｏｎｆｕｎ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ｆｏｎｆｕｎ |
| 証券コード | 2323 |
| docID（データを取り出した文書） | `S100YOGM` |
| 原本 docID | `S100YKRB` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YOGM／有効文書 S100YOGM（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YOGM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ｆｏｎｆｕｎ / 2323 / docID S100YKRB（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fonfun: 6 件の数値を有報XBRLと照合
有報: 株式会社ｆｏｎｆｕｎ 訂正有価証券報告書－第30期(2025/04/01－2026/03/31) (docID S100YOGM)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":367891000,"latestFiling":556319000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":393088000,"latestFiling":638699000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":2257000,"latestFiling":7456000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":20810000,"latestFiling":42509000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":883397000,"latestFiling":950089000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":939381000,"latestFiling":1031861000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":531182000,"latestFiling":553203000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":550029000,"latestFiling":593183000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":14,"latestFiling":22},{"key":"NumberOfEmployees|2023-03-31","previousFiling":17,"latestFiling":28}]
利益・総資産・純資産・従業員数: 12 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第30期(2025/04/01－2026/03/31)、docID S100YOGM）を有効文書としてこのパックを作った。原本は docID S100YKRB。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDescriptionIncludingReasonKAMConsolidatedTextBlock・IndependentAuditorsReportConsolidatedTextBlock・KeyAuditMattersConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fonfun: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社fonfun」が EDINET の提出者名「株式会社ｆｏｎｆｕｎ」と違います
- 確認: [filing-as-subject] financials[1].note: 有報を主語にしない（事業や出来事を直接述べ、根拠は出典欄に任せる）（…の数値は単体の経営指標等でしたが、本有価証券報告書では連結経営指標等の数値を記載しておりま…）

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（切り上げはしていない）。DXソリューション事業の外部顧客への売上高1,154,709千円は1,154百万円、クラウドソリューション事業の956,495千円は956百万円とし、合計は印字の2,111百万円（2,111,204千円）を使った。切り捨てた事業別金額の合計（1,154＋956＝2,110百万円）は印字の合計と１百万円異なる。
- businessModel: MD&Aの事業別売上高（クラウドソリューション事業956百万円、DXソリューション事業1,154百万円）はセグメント注記の外部顧客への売上高と一致しており、セグメント間の内部売上高はないため、セグメント注記の数値を用いた。
- businessModel: 2022年３月期の前期有報との差異の説明は次のとおりで、同じ決算期（2022年３月期）の financialNotes は最初の１件（収益認識基準の適用）のみが保持されるため、こちらに記録した。「第29期の有価証券報告書では連結財務諸表を作成しておらず、第26期の数値は単体の経営指標等でしたが、本有価証券報告書では連結経営指標等の数値を記載しております。」前期有報（第29期）の５年表は単体の数値であったため、売上高・利益・総資産・純資産・従業員数の全系列で差異が生じている（理由は主要な経営指標等の注記８）。
- businessModel: 有効文書は訂正有価証券報告書（S100YOGM、2026年７月２日提出）である。原本（S100YKRB）とのXBRL比較では差異はなく（changed: false、differenceCount: 0）、相違は監査上の主要な検討事項及び独立監査人の監査報告書のテキストブロックのみで、５年表の指標に影響はないため訂正に関する financialNote は設けず、出典は訂正有報とした。
- businessModel: 証拠パックの注意に財務諸表の組替えの記載がある旨があったが、抽出可能なテキストブロック内に組替えの注記は確認できなかった。前期有報との差異はすべて、第28期・第29期に連結財務諸表を作成していなかったことによる単体と連結の範囲の相違で説明でき、注記８に理由が印字されているため financialNotes と warnings で処理した。
- businessModel: 第二次中期経営計画「プロジェクトフェニックスⅡ」の数値目標（2029年３月期までに売上高100億円、EBITDA20億円）は目標指標のため本文には記載しなかった。第一次計画「プロジェクトフェニックス」の目標（エンジニア数100名、時価総額100億円、連結売上20億円、EBITDA４億円）は全て達成したと配当政策に記載されているが、時価総額は投資指標のため本文には転記していない。
- businessModel: 株式会社フェアワークとの業務提携（2025年８月５日、重要な契約等に記載）は、相手方が非上場で関連会社候補に含まれていないため関連会社としては結ばず、事実のみここに記録した。
- businessModel: 重要な後発事象の資金の借入（株式会社りそな銀行、2026年５月20日契約締結）は資金調達であり、関連会社としては結ばなかった。2026年３月６日に株式会社北國銀行から借り入れた融資（重要な契約等に記載）も同様に資金調達である。
- businessModel: 事業譲受の相手方である株式会社ディグロスは非上場で関連会社候補に含まれていないため、関連会社としては結ばなかった（事業譲受の事象自体は needsReview に記録した）。
- businessStructure: 親会社はサイブリッジ合同会社（議決権の被所有割合48.0％、非上場の合同会社）で、関連会社としては結ばなかった。連結子会社は株式会社YNP（議決権の所有割合100.0％、特定子会社）１社、持分法適用関連会社は株式会社ソリッド・ネット（21.0％）と株式会社M&A DX（20.0％）の２社で、いずれも非上場のため関連会社としては結ばなかった。
- businessStructure: 当期中の事業譲受（インバウンドテクノロジー株式会社からのITフリーランスマッチング事業、株式会社porteraからのオンライン診療プラットフォームサービス事業「らく診」）と、株式会社マイクロウェーブデジタルの完全子会社化及び2026年３月31日付の吸収合併、株式会社YNPの完全子会社化は、いずれも当連結会計年度末現在の構造に反映されているため needsReview にはしていない。
- industry: 主たる業界は、売上高の全てを占めるクラウドソリューション事業とDXソリューション事業（いずれも情報サービス業）のため it とした。合う区分が存在するため taxonomyGaps は無い。
- relatedCompanies: kddi（KDDI株式会社）: 1997年に日本高速通信株式会社（現KDDI）と業務提携した旨が沿革に記載されているのみで、現在の関係の記述がないため結ばなかった。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 2009年に光通信グループとの合弁会社「株式会社FunFusion」を設立したが、2012年に完全子会社化し2023年に吸収合併しており、現在の関係はないため結ばなかった。
- relatedCompanies: japan-securities-finance（日本証券金融株式会社）: 【大株主の状況】に1.72％の保有が記載されているが、金融機関であり、主要株主としての関係の記述もないため結ばなかった。
- relatedCompanies: ntt（株式会社NTT）: 一致はNTTドコモへの言及によるもので、株式会社NTTとは別の法人のため結ばなかった。
- relatedCompanies: como（株式会社コモ）: 一致は「ドコモ」の語への一致のみで、取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: fusion（株式会社フュージョン）: 一致は合弁会社であった「株式会社FunFusion」及び「株式会社ミスターフュージョン」への言及によるもので、株式会社フュージョンとは別の法人のため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）: 一致は沿革の「日本高速通信株式会社」（現KDDI）への言及によるもので、株式会社高速とは別の法人のため結ばなかった。
- relatedCompanies: en（エン株式会社）: 「エンジニアリング」等の語への一致のみのため結ばなかった。
- relatedCompanies: nix（株式会社ニックス）: 「フェニックス」（中期経営計画「プロジェクトフェニックス」）の語への一致のみのため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」の語への一致のみのため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション」の語への一致のみのため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: 「セキュリティ」の語への一致のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 一致は事業譲受の相手方「株式会社portera」の名称の一部によるもので、株式会社porteraは非上場で対象外であり、ポート株式会社とは別の法人のため結ばなかった。
- relatedCompanies: freee（freee株式会社）: 一致は子会社であった「合同会社selfree」の名称への一致のみで、freee株式会社との関係の記述がないため結ばなかった。
- relatedCompanies: lec（株式会社LEC）: 「フレックス」の語への一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「クラウドベース」の語への一致のみのため結ばなかった。
- relatedCompanies: core（株式会社コア）: 「コア事業」の語への一致のみのため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「ブランド」の語への一致のみのため結ばなかった。
- relatedCompanies: path（株式会社パス）: 「キャリアパス」の語への一致のみのため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「中期経営ビジョン」の語への一致のみのため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 一致は事業譲受の相手方「株式会社ゼロワン」の名称の一部によるもので、株式会社ゼロワンは非上場で対象外であり、株式会社ゼロとは別の法人のため結ばなかった。
- relatedCompanies: nissin: コードリストに存在しない候補であり、有報本文に当該会社との取引・提携・資本関係の記述がないため結ばなかった。
- relatedCompanies: 親会社のサイブリッジ合同会社、大株主のサイブリッジグループ株式会社、連結子会社の株式会社YNP、持分法適用関連会社の株式会社ソリッド・ネット及び株式会社M&A DXは、いずれも非上場であり関連会社候補に含まれていないため結ばなかった（構造の事実は businessStructure の warnings に記録した）。
- relatedCompanies: 特定投資株式は該当事項がなく、政策保有株式に基づく候補はない。
- terms: 用語の候補として、SaaS、SMS配信、SES（システムエンジニアリングサービス）、DX（デジタルトランスフォーメーション）、ロールアップ型M&A、ボイスメール、ノーコード開発を挙げる。助言のみで、用語データは作成していない。

## 要確認（status に反映）

- businessModel: 2025年２月１日付けで普通株式１株につき２株の割合で、2026年１月30日付けで普通株式１株につき３株の割合で株式分割を行っておりますが、主要な経営指標等の注記に、第26期の期首にこれらの株式分割が行われたと仮定して指標を算定している旨が記載されています。
- businessModel: 重要な後発事象として、2026年４月30日開催の取締役会決議に基づき、株式会社ディグロスが運営するSaaS事業「Sales Performer」の事業譲受を2026年５月１日に実施いたしました。これは当連結会計年度末後の事象であり、本登録は2026年３月31日現在のグループ構造に基づいています。
- businessStructure: 2025年２月１日付けで普通株式１株につき２株の割合で、2026年１月30日付けで普通株式１株につき３株の割合で株式分割を行っておりますが、主要な経営指標等の注記に、第26期の期首にこれらの株式分割が行われたと仮定して指標を算定している旨が記載されています。
- businessStructure: 重要な後発事象として、2026年４月30日開催の取締役会決議に基づき、株式会社ディグロスが運営するSaaS事業「Sales Performer」の事業譲受を2026年５月１日に実施いたしました。これは当連結会計年度末後の事象であり、本登録は2026年３月31日現在のグループ構造に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
