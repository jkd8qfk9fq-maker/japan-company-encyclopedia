# データセクション — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | データセクション株式会社 |
| 証券コード | 3905 |
| docID（データを取り出した文書） | `S100YMGV` |
| 原本 docID | `S100YMGV` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YMGV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | データセクション株式会社 / 3905 / docID S100YMGV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
datasection: 10 件の数値を有報XBRLと照合
有報: データセクション株式会社 有価証券報告書－第26期(2025/04/01－2026/03/31) (docID S100YMGV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
datasection: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円印字を百万円に切り捨てて表記した（売上高33,605,038千円→33,605百万円、AIインフラ30,477,329千円→30,477百万円、リテールマーケティング1,918,575千円→1,918百万円、データ分析ソリューション1,209,134千円→1,209百万円、当期純利益2,801,675千円→2,801百万円、前期比増減30,662百万円はMD&Aの印字どおり）。
- businessModel: 営業利益・経常利益・調整後EBITDAなどの金額と増減率、セグメント利益、売上原価・販管費の内訳金額は、本文に書ける財務数値の対象外のため書かなかった。2027年3月期の業績見通しの金額も、見通しの数値のため本文には書かなかった。
- businessModel: 仕入先・調達先の事実（本ツリーのスキーマに suppliers キーがないため本文には書かない）: AIデータセンター向けに、2025年7月にGIGA COMPUTING CO., LTD.との間でNVIDIA製B200を搭載したGPUサーバー一式の売買契約を、2025年12月にINVENTEC CORPORATIONとの間でNVIDIA製B300を搭載したGPUサーバー一式の売買契約を締結している。台数は設備取得の事実として warnings にのみ記録し、金額は記載されていないため書かない。
- businessModel: CUDO Ventures Ltd.（CUDO Compute）については、2025年6月に資本提携に伴う子会社化の基本合意と合弁子会社設立の合意があり協議を継続している段階で、2026年3月31日現在で子会社化は完了していないため、本文では関係として扱わなかった。
- businessModel: 重要な後発事象の第23回新株予約権の行使（2026年4月20日）は期後の資本の異動であり、金額も本文対象外のため warnings にのみ記録した。
- businessModel: 地域ごとの情報の表示方法の変更（チリ・コロンビア・ペルーを「南米」に組み替え、前期も組み替えて表示）は表示区分の変更のみで数値の修正ではないため、financialNotes には書かなかった。
- businessModel: 【重要な契約等】には、First Plus Financial Holdings PTE. Ltd.向け第三者割当増資の株式引受契約で同社が役員候補者2名を指名する権利を有する旨の合意が印字されている。相手は非上場の海外会社で関連企業候補にないため、relatedCompanies には結ばず、事実は relatedCompanies の warnings に記録した。
- businessStructure: 報告セグメントは【セグメント情報】の国内事業・海外事業の2区分であり、【事業の内容】の4事業（AIインフラ、データサイエンス、システムインテグレーション、マーケティングソリューション）は国内事業の内訳等として children に置いた。事業の並びは外部顧客への売上高の大きい順（国内事業32,468百万円、海外事業1,136百万円）。
- businessStructure: 金額は千円印字を百万円に切り捨てて表記した（国内事業32,468,614千円→32,468百万円、海外事業1,136,424千円→1,136百万円、AIインフラ30,477,329千円→30,477百万円）。
- businessStructure: 製品及びサービスごとの情報の「データ分析ソリューション」1,209百万円と「リテールマーケティング」1,918百万円は、データサイエンス事業・システムインテグレーション事業・マーケティングソリューション事業への内訳が印字されていないため、各 children には金額を割り当てなかった。
- businessStructure: セグメント利益は本文に書ける財務数値の対象外のため記載しなかった。
- businessStructure: Fupbimx, S.A.P.I. de C.V.は当連結会計年度に重要性が増したことに伴い連結の範囲に含められた連結子会社であり、2026年3月31日現在の体制として記載した。
- businessStructure: 仕入先については、本ツリーのスキーマに suppliers キーがないため businessModel には書かず、GPUサーバーの売買契約先などの事実は businessModel の warnings に記録した。
- history: 沿革の表は年月と事象が一体で印字されており、月は history の形に含めないため年だけを記録した。
- history: 2023年9月のThe ROOM４D株式会社等からの事業譲受（株式会社ディーエスエスにおけるSES事業の譲受を含む）は、単独の節目としての重要度が相対的に小さいため行を省いた。
- history: 資本金の金額は history には書かない規則のため、設立時・増資時の資本金額は記載しなかった。
- industry: 主たる業界は、売上高の大半を占めるAIインフラ事業と、データサイエンス・システムインテグレーションの各事業が情報技術の提供であることから it とした。
- relatedCompanies: kddi（KDDI株式会社）: 2018年7月に資本業務提携契約を締結した事実は沿革に記載したが、前事業年度末において主要株主であった同社は当事業年度末現在では主要株主ではなく、大株主の状況にも載らず、当期の取引の印字もないため、関連企業には結ばなかった。
- relatedCompanies: tbs-holdings（株式会社TBSホールディングス）: 2014年の資本業務提携は、同社の子会社であるTBSイノベーション・パートナーズ合同会社を引き受け先とする第三者割当増資によるもので、契約の相手は上場会社である同社自身ではなく、現在の保有・取引の印字もないため結ばなかった。
- relatedCompanies: First Plus Financial Holdings PTE. Ltd.: 大株主の状況の筆頭（9,788,000株、33.03％）で、関連当事者として資金の借入や新株予約権の引受・行使などの取引が注記され、株式引受契約では役員候補者2名の指名権の合意もあるが、非上場の海外投資会社で候補にないため結ばなかった。
- relatedCompanies: ナウナウジャパン株式会社: 主要な顧客であり、2026年3月期の売上高30,477百万円（全体の90.7％）を占めるが、非上場で候補にないため結ばなかった。業務提携先としてAIデータセンターサービス利用契約の締結経路である事実は businessModel に記載した。
- relatedCompanies: 東海東京証券株式会社・株式会社SBI証券・モルガン・スタンレーMUFG証券株式会社・野村證券株式会社・楽天証券株式会社: 大株主の状況に載るが、いずれも証券会社としての保有であり、取引・提携の印字がないため結ばなかった。
- relatedCompanies: 保有目的が純投資目的以外の目的である投資株式は非上場株式3銘柄のみで、銘柄名の印字がないため、特定投資株式を根拠とする関連付けは行わなかった。
- relatedCompanies: base-4481、port、core、career、vision、lec、innovation、rhythm、cover、land、seki、en、nissin: 一般語や語句の一部（ベース、サポート、コア、キャリア、ビジョン、フレックス、イノベーション、リズム、カバー、ブランド、セキュリティ、エン、行使期間の「自」など）への機械一致で、正式名称での関係の記載がないため結ばなかった。
- relatedCompanies: GIGA COMPUTING CO., LTD.、INVENTEC CORPORATION、NVIDIA Corporation、CUDO Ventures Ltd.: 売買契約や資本提携の協議先として印字があるが、いずれも上場候補にないため結ばなかった（CUDO社は子会社化の基本合意・協議継続の段階）。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として4件を提案した。いずれも有報本文に現れる当社事業固有の語です。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、2026年6月29日開催の取締役会において、連結子会社であるJach Technology SpAの全株式を、同社の役員等が出資する買収目的会社Practicando SpAへ譲渡することを決議しています。Jach社及びその子会社6社（Alianza FollowUP S.A.S.、Inteligenxia S.A.、FollowUP Peru S.A.C.、FollowUP Customer Experience S.L.、Alianza FollowUPPanamá S.A.、Fupbimx, S.A.P.I. de C.V.）は2027年3月期の第2四半期連結会計期間より連結子会社から除外される予定で、株式譲渡は2026年7月から8月中の予定です。登録は2026年3月31日現在の連結体制（Jach社及びその子会社を含む）で行っています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] データセクションのAIインフラ事業（AIデータセンターの運営、GPUクラウドサービスの提供、AIクラウドスタックの開発・提供） → 提案: AIインフラ・データセンター。2026年3月期の売上高33,605百万円のうちAIインフラが30,477百万円を占める中心事業ですが、閉じた業界分類にはデータセンターの運営やAI計算基盤の提供を表す区分がありません。ソフトウェア・ITサービスの提供という点で最も近い it を暫定の主業種としました。
