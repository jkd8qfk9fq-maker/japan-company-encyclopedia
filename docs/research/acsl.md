# ＡＣＳＬ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＡＣＳＬ |
| 証券コード | 6232 |
| docID（データを取り出した文書） | `S100XVUY` |
| 原本 docID | `S100XVUY` |
| 提出日（原本） | 2026-03-31 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVUY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＡＣＳＬ / 6232 / docID S100XVUY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 26 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 7 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
acsl: 10 件の数値を有報XBRLと照合
有報: 株式会社ＡＣＳＬ 有価証券報告書－第14期(2025/01/01－2025/12/31) (docID S100XVUY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2021-12 の期は 9 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
すべて一致しました。
acsl: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社ACSL」が EDINET の提出者名「株式会社ＡＣＳＬ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 連結経営指標等の注記（注２）は、第11期（2022年12月期）より「収益認識に関する会計基準」（企業会計基準第29号 2020年3月31日）等を適用している旨であり、financialNotes に2022年12月期の注記として記録した。
- businessModel: 重要な後発事象として、2026年2月25日の取締役会で、資本金及び資本準備金の額の減少並びに剰余金の処分に関する議案を2026年3月30日開催予定の定時株主総会に付議することを決議した旨が印字されている。期後の資本政策の決議であり、登録数値の誤りではないため needsReview には入れず、ここに記録した。
- businessModel: 日本郵便株式会社及び日本郵政キャピタル株式会社は、2021年6月の資本業務提携以来の実在の提携先であり、長距離飛行マルチユースドローン「PF4」を日本郵便と共同開発しているが、related-candidates に含まれていないため関連企業には結んでいない。上場している日本郵政株式会社は別の法人格のため代替していない。
- businessModel: 主要な顧客であるAlmo Corporation（2025年12月期の売上高833百万円、米国の総代理店）、有限会社タイプエス（同656百万円）、日本特装株式会社（同404百万円）は related-candidates に含まれていないため関連企業には結んでいない。
- businessModel: 経営成績の分析には営業損失、経常損失、助成金収入、不正関連損失、減損損失等の印字があるが、本文に書ける数値が売上高と当期純利益（損失）のみのため書いていない。国家プロジェクトに係る助成金収入は営業外収益であり、売上高には含めていない。
- businessModel: 中期経営方針「ACSL Accelerate FY26」に数値目標が含まれるかは本文に書かず、perspectives には方針の内容だけを要約した。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。部品の調達先として個別の仕入先名は印字されていない。
- businessStructure: 単一セグメントのため、事業の下位区分はセグメント注記の製品・サービス別情報（外部顧客への売上高）で並べた。並び順は2025年12月期の金額順（用途特化型機体販売2,046,087千円、実証実験165,525千円、プラットフォーム機体販売52,495千円）とし、「その他」（334,625千円）は報告セグメントではないため金額にかかわらず最後に置いた。前期（2024年12月期）は「その他」が1,752,729千円と最大だったが、これはインドのARCV Holdings Private Limited向け地上ロボット等の販売を含むもので、製品・サービス別情報の注記にその旨が印字されている。
- businessStructure: 本社工場（東京都江戸川区）は単一セグメントに属する研究開発・製造の設備であり、事業の説明に含めた。帳簿価額は書いていない。
- businessStructure: 持分法適用関連会社のACSL India Private Limitedは連結子会社ではないため、事業への結びつけは関連会社の存在の記録にとどめた。2021年に株式会社NJSと共同出資で設立した株式会社FINDiは、当事業年度の関係会社の状況に記載がないため事業に結びつけていない。
- history: 沿革表は年月と事象が対応して印字されており、行順どおりに項目化した。
- history: 落とした行: 2016年1月の千葉大学発ベンチャー企業の認定、2016年7月のNEDOプロジェクトへの採択、2018年9月のインドでの実証実験開始、2020年4月のアラブ首長国連邦とシンガポールでの代理店契約、2020年10月の楽天グループ株式会社向け実証実験の実施、2021年5月の株式会社NJSとの共同出資による株式会社FINDiの設立（当事業年度の関係会社の状況に記載がないため）、2022年5月の日本郵便株式会社とのドローン共同開発の開始（2025年のPF4量産開始の項目に含めた）、2022年12月の米国への輸出許可取得、2023年1月のAlmo Corporationとの販売代理店契約の締結、2025年6月の「SOTEN」の米国への輸出許可取得は、項目化せずここに記録した。
- history: 資本金の金額は沿革に書かない規則のため、設立時や上場時の資本金額は記録していない。
- industry: 主たる業界は、産業用ドローン（無人航空機）の開発・製造・販売が主業だが、閉じた分類にドローンの項目がないため、電子機器を扱う electronics を暫定として選んだ。副分類は付けていない。
- relatedCompanies: murata-manufacturing（株式会社村田製作所）: 2024年12月の業務提携契約の印字があり結んだ。なお、同社は2025年1月に当社が発行した転換社債型新株予約権付社債の割当先の一つでもある。
- relatedCompanies: kikuchi-seisakusho（株式会社菊池製作所）: 大株主の状況に載る事業会社（所有割合2.69％、2025年12月31日現在）のため major-shareholder として結んだ。
- relatedCompanies: japan-post-holdings（日本郵政株式会社）: 提携の相手方は日本郵便株式会社と日本郵政キャピタル株式会社であり、上場している日本郵政株式会社とは別の法人格のため結ばなかった。日本郵便株式会社と日本郵政キャピタル株式会社は related-candidates に含まれていない。
- relatedCompanies: njs（株式会社NJS）: 2021年5月に共同出資で株式会社FINDiを設立した印字は沿革にあるが、当事業年度の関係会社の状況にFINDiの記載がなく、現在の資本関係や取引関係の印字がないため結ばなかった。
- relatedCompanies: ricoh（株式会社リコー）: 「リコール」という語の部分一致のみのため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: listing がコードリストになく、ambiguous で部分一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「プラットフォーム機体をベースにした」という語の部分一致のみのため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「自身のキャリア」という一般的な語の部分一致のみのため結ばなかった。
- relatedCompanies: secure（株式会社セキュア）: 「セキュアなドローン」という語の部分一致のみのため結ばなかった。
- relatedCompanies: core（株式会社コア）: ambiguous で、「制御技術をコアとし」という語の部分一致のみのため結ばなかった。
- relatedCompanies: lec（レック株式会社）: 「フレックス」という語の部分一致のみのため結ばなかった。
- relatedCompanies: cover（カバー株式会社）: 「賠償責任をカバーする」という語の部分一致のみのため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）: ambiguous で、「高速飛行」という語の部分一致のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「販売・サポート」という語の部分一致のみのため結ばなかった。
- relatedCompanies: rhythm（リズム株式会社）: 「一定のリズム」という語の部分一致のみのため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: ambiguous で、「ゼロから国内で」という語の部分一致のみのため結ばなかった。
- relatedCompanies: en（エン株式会社）: ambiguous で、「エンジニア」という語の部分一致のみのため結ばなかった。
- relatedCompanies: fusion（フュージョン株式会社）: 「センサー・フュージョン」という技術用語の部分一致のみのため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 「中小企業イノベーション創出推進事業」という事業名の部分一致のみのため結ばなかった。
- relatedCompanies: ray（株式会社レイ）: ambiguous で部分一致のみのため結ばなかった。
- relatedCompanies: sincere（株式会社シンシア）: 人名「シンシア・ホァン」の部分一致のみのため結ばなかった。
- relatedCompanies: tear（株式会社ティア）: 監査法人名「アヴァンティア」の部分一致のみのため結ばなかった。
- relatedCompanies: the-lead（株式会社リード）: 「技術開発をリード」という語の部分一致のみのため結ばなかった。
- relatedCompanies: will（株式会社ウィル）: 地名「ウィルミントン」の部分一致のみのため結ばなかった。
- relatedCompanies: 主要な顧客であるAlmo Corporation（米国の総代理店）、有限会社タイプエス、日本特装株式会社は related-candidates に含まれていないため結べなかった。
- relatedCompanies: 連結子会社（ＡＣＳＬ１号有限責任事業組合、ACSL, Inc.）と持分法適用関連会社（ACSL India Private Limited）は自社のグループ会社のため結ばなかった。
- terms: 助言: 「自律制御」とは、人が操縦しなくても機体が自らの判断で姿勢や飛行を制御する技術を指す同社の核となる技術で、GPSの届かない環境でも安定した飛行を可能にします。
- terms: 助言: 「SOTEN（蒼天）」は、同社のセキュアな小型空撮ドローンの製品名です。政府調達でも採用されています。
- terms: 助言: 「PF4」は、日本郵便株式会社と共同開発した長距離飛行マルチユースドローンの製品名です。ユーザーが用途に応じてペイロード（搭載物）を交換できます。
- terms: 助言: 「レベル４飛行」とは、有人地帯で補助者を置かずに目視外飛行を行う飛行区分で、第一種型式認証と第一種機体認証、無人航空機操縦者技能証明が必要です。
- terms: 助言: 「第一種型式認証」とは、国土交通省が無人航空機の型式の安全性などを認証する制度で、同社は2023年3月に国内で初めて取得しました。
- terms: 助言: 「プラットフォーム機体」とは、顧客が自社ブランドの機体を生産・販売する際の基盤となる同社の機体を指します。
- terms: 助言: 「デュアルユース」とは、民生用途と防衛用途の双方に使える技術や製品を指す言葉です。

## 要確認（status に反映）

- businessModel: [object Object]
- 財務: 変則決算。2021-12 の期は 9 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ドローン関連事業 → 提案: ドローン（無人航空機）。産業用ドローンの開発・製造・販売が主業であり、閉じた分類にドローン（無人航空機）の項目がないため
