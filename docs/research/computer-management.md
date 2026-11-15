# コンピューターマネージメント — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | コンピューターマネージメント株式会社 |
| 証券コード | 4491 |
| docID（データを取り出した文書） | `S100YGM1` |
| 原本 docID | `S100YGM1` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGM1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | コンピューターマネージメント株式会社 / 4491 / docID S100YGM1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
computer-management: 10 件の数値を有報XBRLと照合
有報: コンピューターマネージメント株式会社 有価証券報告書－第45期(2025/04/01－2026/03/31) (docID S100YGM1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
computer-management: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高・サービスライン別金額は千円の印字（売上高8,235,420千円、ゼネラル5,442,617千円、インフラ1,616,142千円、ERP1,176,659千円）を百万円へ切り捨てて書いています。増減率は印字どおり（売上高は前期比4.2％増）です。
- businessModel: 経営指標等の注記１（平均臨時雇用者数の記載省略）は表示方法の注記のため warnings のみにしています。注記２の株式分割は financialNotes（2022年3月期）と needsReview に記録しました。
- businessModel: 経営方針の客観的な指標等（期末人員数、BP平均人員数、非稼働人員の労務費額）は数値を本文・perspectives に書いていません。
- businessModel: 受注高・受注残高の金額は書いていません。MD&Aの利益段階の金額・理由、キャッシュ・フローの金額も書いていません。
- businessStructure: 単一セグメント（システムソリューションサービス）のため、事業は１つだけ登録し、【事業の内容】が区分する３つのサービスラインを children にしました。並び順と金額はセグメント注記【関連情報】の製品及びサービスごとの情報（外部顧客への売上高：ゼネラル5,442,617千円、インフラ1,616,142千円、ERP1,176,659千円、合計8,235,420千円）によります。千円額を百万円へ切り捨てると内訳の合計は8,234百万円となり、売上高の8,235百万円と１百万円の差が出ますが、切り捨てによるもので印字どおりに書いています。
- businessStructure: 主要な顧客ごとの情報は、売上高の10％を占める相手先がいないため記載を省略している旨が印字されており、customers は顧客の種類だけにしています。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。仕入先として個別に印字された会社はありません（ビジネスパートナーとの協業は本文に金額・相手先名の記載がありません）。
- businessStructure: 設備（大阪本社・東京本社・四国営業所・仙台営業所、ノックス株式会社本社）は単一セグメントの全社設備のため特定のサービスラインには結びつけていません。帳簿価額・賃借料は書いていません。
- businessStructure: 連結子会社はノックス株式会社１社（議決権100.0％）です。自社の子会社のため relatedCompanies には結んでいません。
- history: 設立時の資本金（300万円）は金額のため description に書いていません。
- history: 沿革のうち、拠点の開設・移転（東京出張所・本社分室・松山営業所・仙台営業所・高松出張所・広島オフィス・高松オフィス・福岡オフィス・東京開発センター等）、認証取得（プライバシーマーク2005年、ISO27001 2009年、ISO9001 2017年）、システムインテグレーター登録企業となったこと（2001年）、BPOセンターの開設（2018年）、代表取締役社長の就任（2024年）は省きました。
- industry: システムソリューションサービス（情報システムの受託開発・インフラ構築・ERP導入支援）の単一セグメントが全社の事業のため it を primary にしました。
- industry: human-resources は付けていません（ビジネスパートナーの活用は体制整備の手段で、人材サービス事業の開示はありません）。telecommunications も付けていません（クラウドサービスの導入支援は IT サービスであり、通信事業ではありません）。
- relatedCompanies: seki: ambiguous な候補で、「セキュリティ」等の一般語への部分文字列の一致のみで、セキ株式会社への言及ではありません。
- relatedCompanies: career: 「キャリア形成」等の一般語への一致のみで、株式会社キャリアへの言及ではありません。
- relatedCompanies: base-4481: 「データベース」等の一般語への一致のみで、ベース株式会社への言及ではありません。
- relatedCompanies: innovation: 「イノベーション」という一般語への一致のみで、株式会社イノベーションへの言及ではありません。
- relatedCompanies: hikari-tsushin: 【大株主の状況】に記載があるのは光通信ＫＫ投資事業有限責任組合とＵＨ Ｐａｒｔｎｅｒｓ ２投資事業有限責任組合であり、株式会社光通信は大量保有報告書の注記に共同保有者として現れるのみで、当社自身が実質所有株式数を確認できない旨を注記しています。取引・提携の記載もないため結んでいません。
- relatedCompanies: port: 「サポート」等の部分文字列への一致のみで、ポート株式会社への言及ではありません。
- relatedCompanies: no-1: 大量保有報告書の「変更報告書No.18」の番号への一致のみで、株式会社No．1への言及ではありません。
- relatedCompanies: softbank-group: 取引関係維持・強化のため政策保有株式として保有していましたが、保有意義が薄れたことから2026年３月期に保有目的を純投資目的へ変更しており、現在の取引関係の記載がないため結んでいません。
- relatedCompanies: system-integrator: 【沿革】の「システムインテグレーター（SIer）登録企業」という制度の名称への一致のみで、株式会社システムインテグレータへの言及ではありません。
- relatedCompanies: trust: コードリストになく、「ゼロトラスト」というセキュリティ用語への一致のみです。
- relatedCompanies: zero: ambiguous な候補で、「ゼロトラスト」という用語への一致のみです。
- relatedCompanies: heiwa: ambiguous な候補で、経営方針の「平和を守るための道具」という一般語への一致のみです。
- relatedCompanies: land: 「ブランド」という一般語への一致のみで、株式会社ランドへの言及ではありません。
- relatedCompanies: nissin: コードリストになく曖昧で、新株予約権等の脚注中の文字列への一致のみです。
- relatedCompanies: step: 「ステップアップ」という一般語への一致のみで、株式会社ステップへの言及ではありません。
- relatedCompanies: 候補にないため結んでいない相手: SAPジャパン株式会社（SAP社の日本法人。パートナー契約の相手ですが候補にありません）、有限会社シー・エム・ケー（2026年３月31日現在の筆頭株主 35.90％ですが候補にありません）。
- relatedCompanies: 政策保有株式のうち富士通株式会社は、主要なパートナー企業としての個別の保有目的と取引の寄与が印字されているため business-partner として結びました。ソフトバンクグループ株式会社は上記のとおり結んでいません。
- terms: 助言のみ。本文で使った用語の候補: システムソリューションサービス、サービスライン、SIer（システムインテグレーター）、ERP、SAP S/4HANA、SAP Cloud ERP、mcframe、奉行シリーズ、BPO（業務のアウトソーシング）、AMOサービス（情報システム部門の保守・運用支援）です。

## 要確認（status に反映）

- businessModel: 2022年11月26日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第41期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2022年11月26日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第41期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
