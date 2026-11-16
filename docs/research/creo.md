# クレオ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社クレオ |
| 証券コード | 9698 |
| docID（データを取り出した文書） | `S100YGVQ` |
| 原本 docID | `S100YGVQ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGVQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社クレオ / 9698 / docID S100YGVQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
creo: 10 件の数値を有報XBRLと照合
有報: 株式会社クレオ 有価証券報告書－第53期(2025/04/01－2026/03/31) (docID S100YGVQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
creo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との照合は6系列すべて差異ゼロだった。bootstrap の警告にあった組替えは、前連結会計年度の連結財務諸表における表示区分の組替え（表示方法の変更）であり、登録する売上高と純利益の数値に影響しないため、financialNotes には入れず warnings に留めた。
- businessModel: 経営指標等の注記は、潜在株式が存在しないことによる希薄化数値の非開示と、株式給付信託（J-ESOP・BBT）の株式の扱いに関する表示事項のみであり、financialNotes は付けていない。変則決算、決算期変更、会計基準の変更、株式分割・株式併合はいずれも無い。
- businessModel: 2026年4月に新設した「DX本部」は期後の社内組織であり、決算日現在の構造には含めていないが、経営方針の記載として strategy の disclosed に含めた。重要な後発事象は連結・単体とも「該当事項はありません」と印字されている。
- businessModel: 配当方針（株主還元に関する方針）と中期経営計画の数値目標は、投資・利益指標に関わるため本文と戦略には書かず、存在のみここに記録する。受注に関する金額も書いていない。
- businessModel: セグメント別の利益の金額と増減の理由は本文に書いていない。売上高の増減と理由のみを記載した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（ソリューションサービス5,342百万円、サポートサービス4,275百万円、受託開発2,786百万円、システム運用・サービス2,165百万円）とし、合計14,569百万円は連結売上高と一致する。
- businessStructure: 事業の内容ではサポートサービス事業の表記が「サポート＆サービス事業」となっている箇所があるが、セグメント注記の正式名称「サポートサービス事業」で統一した。
- businessStructure: suppliers は旧スキーマのため省略した。仕入先として個別に印字された企業はなく、開発パートナー団体「FSA」に関する記載は relatedCompanies の富士通の項目と株式の保有状況の文脈に留めた。
- businessStructure: 期後の2026年4月に新設された「DX本部」は社内の専任組織であり、決算日現在の事業構造には含めていない（fce の期後社内再編の先例に倣い warnings に留める）。
- businessStructure: 連結子会社3社（ココト、ブライエ、アダムスコミュニケーション）の単体数値は各事業の説明には書いていない。
- history: 沿革の後半（2013年7月以降）は年月セルと事象文が分かれて印字された崩れた表で、年月20件に対して事象文23件と数が一致しないため、行順の対応づけは行わなかった。裏付けのある2件だけを採用した: 2022年のスタンダード市場移行は表紙の上場市場（スタンダード市場）と年月セルの「2022年4月」で、2024年の創業50周年は1974年3月の創業（沿革の確定部分）からの経過年数で裏付けた。
- history: 崩れた表から落とした事象: アマノ株式会社との業務提携、連結子会社によるアダムスコミュニケーションの子会社化、連結子会社ココトの新設、イアス株式会社の子会社化、本社事務所移転（2回）、連結子会社5社の吸収合併、アダムスコミュニケーションによるセールスゲイトの吸収合併、グループ新体制の発足、『ZeeM 就業V2 Powered by TimePro-VG』の販売開始、Ominext JSCとの資本・業務提携の基本合意、健康経営優良法人2019の認定、『ジームクラウド』の販売開始、ブライエへの商号変更、インディビジュアルシステムズ社との資本業務提携、滋賀大学との産学連携基本協定、『トラミル』『SmartStage ServiceDesk』等の提供開始、SmartStageの各サービスの提供開始。いずれも年月との対応が確定できないため登録していない（関係会社の状況など他節で確認できる現在の構造は businessStructure に反映済み）。
- history: 沿革の前半から落とした項目: 関西営業所・名古屋営業所の開設、本社事務所移転、AT&T社とのライセンス契約、システムインテグレータ認定、Microsoft SOLUTION PROVIDER契約、ISO9001・ISMS認証取得、各種コンシューマ向けソフトの販売開始（デジカメの横綱、ピクチャミクス、FACE Conference、筆まめBridal、プロアトラスSV4等）、株式会社アルプス社との業務提携、株式会社ネットジーンの合併、株式会社インテックホールディングスとの業務提携、株式会社クレオスマイルの設立、筆まめ★ネット・筆まめonlineの開設。資本金の金額は沿革に書かない規則のため各増資の金額も落とした。
- industry: 主たる業界は it（直接適合）とした。4つの報告セグメントはいずれもソフトウェアの提供、システムの受託開発、開発・保守・運用、サポートというITサービスであり、売上高の全額がITサービスによる。
- industry: 副業界は付けなかった。ソリューションサービス事業は人事給与分野のソフトウェア提供であり、人材サービスそのものではないため human-resources は付けていない（コンサルティング・ソフトウェア提供に human-resources を付けない先例に倣う）。
- relatedCompanies: amano: 関係会社の状況の区分どおり other-affiliated-company とした。主要な顧客としての取引も印字されているが、区分は関係会社の状況を優先した。
- relatedCompanies: ly: 関係会社の状況には載らないため major-shareholder とした。取引先としての記載は事業等のリスクと経営成績等の分析（LINEヤフーグループ等の主要顧客）にあり、説明に併記した。
- relatedCompanies: seki: 「サイバーセキュリティ」等の部分一致（ambiguous）であり、セキ株式会社との関係の記載はない。
- relatedCompanies: port: 「サポート」の部分一致であり、ポート株式会社との関係の記載はない。
- relatedCompanies: en: 「エンタープライズDX事業本部」等の部分一致（ambiguous）であり、エン株式会社との関係の記載はない。
- relatedCompanies: create: 当社の旧社名「株式会社東海クリエイト」や子会社「株式会社クリエイトラボ」の部分一致であり、クリエイト株式会社との関係の記載はない。
- relatedCompanies: career: 「キャリア形成施策」の文脈であり、株式会社キャリアとの関係の記載はない。
- relatedCompanies: king: 「ワーキンググループ」の部分一致であり、株式会社キングとの関係の記載はない。
- relatedCompanies: zero: ambiguous な候補であり、当社との取引・提携・資本関係の記載はない。
- relatedCompanies: base-4481: 部分一致であり、ベース株式会社との関係の記載はない。
- relatedCompanies: land: 部分一致であり、株式会社ランドとの関係の記載はない。
- relatedCompanies: nipro: 当社との取引・提携・資本関係を印字する記載を確認できなかったため結ばなかった。
- relatedCompanies: tear: 部分一致であり、株式会社ティアとの関係の記載はない。
- relatedCompanies: trust: コードリストにない候補であり、結ばなかった。
- relatedCompanies: vision: 中長期経営ビジョン「VISION2030」の文脈であり、株式会社ビジョンとの関係の記載はない。
- relatedCompanies: sumitomo-realty-and-development: 本社が入居するビル名「住友不動産品川ビル」の記載のみであり、住友不動産株式会社との取引・提携・資本関係の記載はない。
- relatedCompanies: suzuki-6785: 個人の氏名との一致（ambiguous）であり、株式会社鈴木との関係の記載はない。
- relatedCompanies: system-integrator: 沿革の「通商産業大臣システムインテグレータ認定」という一般語の一致であり、株式会社システムインテグレータとの関係の記載はない。
- relatedCompanies: 連結子会社3社（ココト、ブライエ、アダムスコミュニケーション）は当社の子会社であるため結ばず、businessStructure に記載した。
- terms: 用語の助言: 「ZeeM（ジーム）」は、クレオが提供する人事給与・会計などの業務ソリューションのブランド名です。「ストックビジネス」とは、利用料モデルなど継続的に収益が積み上がる事業形態を指します。「クロスセル」とは、既存顧客に複数の製品やサービスを組み合わせて提案する営業手法です。「モダナイゼーション」とは、既存の情報システムを新しい技術基盤へ移行・刷新することです。「コンタクトセンター」とは、電話やメールなどの問い合わせ対応を担う窓口組織を指します。「株式給付信託（J-ESOP・BBT）」は、従業員や役員への株式給付の仕組みです。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
