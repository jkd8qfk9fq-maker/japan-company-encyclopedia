# ファーストアカウンティング — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ファーストアカウンティング株式会社 |
| 証券コード | 5588 |
| docID（データを取り出した文書） | `S100XUQ2` |
| 原本 docID | `S100XUQ2` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUQ2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ファーストアカウンティング株式会社 / 5588 / docID S100XUQ2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 6 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fast-accounting: 2 件の数値を有報XBRLと照合
有報: ファーストアカウンティング株式会社 有価証券報告書－第10期(2025/01/01－2025/12/31) (docID S100XUQ2)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
fast-accounting: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の課金体系別の内訳（月額課金1,724,709千円・従量課金252,726千円・プロフェッショナルサービス387,875千円）の合計は2,365,310千円で、印字の売上高合計2,369,766千円とは一致しない。印字の合計をそのまま引用し、各区分の金額も印字どおりに記載した。
- businessModel: MD&Aの売上原価・売上総利益・販売費及び一般管理費・営業利益・経常利益・特別損益の金額と理由は本文に書かず、本文の財務数値は売上高と親会社株主に帰属する当期純利益だけとした。金額は印字の千円額を百万円未満切り捨てで表記した（売上高2,369百万円、純利益202百万円）。
- businessModel: ARPAやグロスチャーンレート、LTV、顧客の平均契約締結期間などの経営指標は本文とperspectivesには書かなかった。
- businessModel: 前期有報との修正再表示の突合は、連結経営指標等が第10期のみの記載で比較対象の行がないため機械突合できなかった（証拠パックの comparedRows は0行）。当期有報の指標注記に組替えや修正再表示の記載はなく、連結初年度のため financialNotes は連結開始の事実のみとした。
- businessModel: 2026年2月19日の取締役会で決議され実施された自己株式の取得は、資本政策の事項のため本文には書かず warnings のみに記録した。
- businessModel: wikipedia.json の冒頭は有報の記載の範囲を超える補足（旧社名・ブランド名・創業の経緯など）がなかったため使わなかった。
- businessStructure: 当社はAIソリューション事業（経理AI事業）の単一セグメントで、セグメント情報の記載は省略されている。サービス区分ごとの売上高は開示されていないため、Robotaシリーズ・Remota・経理AIエージェント・Peppolアクセスポイントの各子事業には金額を書かなかった。課金体系別の売上高は事業全体の内訳として事業ノードに記載した。
- businessStructure: 主要な設備は本社（東京都港区）とデータセンター（東京都府中市）で、いずれも単一セグメントに属するため特定の子事業には結びつけなかった。帳簿価額は書かなかった。
- businessStructure: suppliers はこの工程のスキーマに無いため書いていない。事業系統図ではサーバ事業者（クラウドコンピューティングサービスの提供事業者）が関係者として 印字されているが、個別の社名は印字されていない。
- businessStructure: 連結子会社はFast Accounting USA Inc.（米国イリノイ州、議決権の所有割合100.0％、特定子会社）の1社で、【関係会社の状況】に印字されている。自社の子会社のため relatedCompanies には含めていない。
- history: 本社移転の行（2017年3月 東京都新宿区、2017年8月 東京都千代田区、2019年6月 東京都港区、2024年5月 東京都港区）は事業の転機ではないため落とした。
- history: 2026年2月のプロシップとの資本業務提携は沿革にも印字された出来事のため history に含めたが、決算日後の後発事象でもあるため、businessModel の needsReview にも記録している。
- industry: 主たる業界は it（IT・ソフトウェア）とした。当社はAIソリューション事業（経理AI事業）の単一セグメントで、会計分野に特化したSaaS型クラウドサービスを提供しており、閉じた分類にそのまま当てはまるため、taxonomyGapsは記録しなかった。
- relatedCompanies: pro-ship: 株式会社プロシップは2026年2月13日に資本業務提携契約を締結した相手方だが、決算日（2025年12月31日）後の後発事象であり期末現在の関係ではないため結ばなかった。提携の事実は history に記録し、businessModel の needsReview に挙げた。
- relatedCompanies: en: ambiguous であり、「エンタープライズ」の部分一致のみのため結ばなかった。
- relatedCompanies: nissin: 上場区分が（コードリストにない）であり、新株予約権の発行条件の定型文中の一致のみのため結ばなかった。
- relatedCompanies: rhythm: 「リモートワーク」等の部分一致のみのため結ばなかった。
- relatedCompanies: seki: ambiguous であり、「セキュリティ」等の部分一致のみのため結ばなかった。
- relatedCompanies: no-1: 「マーケットシェアでNo.1になれる分野」という文中の一致のみのため結ばなかった。
- relatedCompanies: pca: 過去の第三者割当の割当先として氏名が印字されるが、大株主の状況には載っておらず、取引・提携の記載がないため結ばなかった。
- relatedCompanies: path: ambiguous であり、「パーパス」の部分一致のみのため結ばなかった。
- relatedCompanies: suzuki-6785: ambiguous であり、プロシップの代表者の姓との一致のみで、株式会社鈴木そのものではないため結ばなかった。
- relatedCompanies: trust: 上場区分が（コードリストにない）であり、日本マスタートラスト信託銀行（信託口）の文脈のみのため結ばなかった。
- relatedCompanies: base-4481: 「約定ベース」の部分一致のみのため結ばなかった。
- relatedCompanies: corona: 新型コロナウイルス感染症の流行の文脈のみのため結ばなかった。
- relatedCompanies: daiwa: ambiguous であり、ファンドの常任代理人である大和証券の文脈のみのため結ばなかった。
- relatedCompanies: kddi: 印字されるのはKDDI新規事業育成3号投資事業有限責任組合というファンドであり、KDDI株式会社そのものとの取引・提携の記載がないため結ばなかった。
- relatedCompanies: kohsoku: ambiguous であり、一般的な語の部分一致のみのため結ばなかった。
- relatedCompanies: ray: ambiguous であり、一般的な語の部分一致のみのため結ばなかった。
- relatedCompanies: stream: 割当先として印字されるのはスーパーストリーム株式会社であり、株式会社ストリームとは別の法人のため結ばなかった。
- relatedCompanies: system-integrator: 「システムインテグレーター」という一般的な語の文脈のみのため結ばなかった。
- relatedCompanies: 候補に含まれていないため結ばなかった相手: 株式会社マイナビ（2025年12月31日現在の大株主、所有割合4.46％）とMoriSpaceManagement株式会社（同21.40％）は事業会社だが候補に含まれていない。その他の大株主は個人と信託口・カストディである。特定投資株式は「該当事項はありません」で、政策保有株式によるリンクはない。
- terms: 助言: 用語「AI-OCR」は、印刷された文字や手書き文字を読み取りデジタルの文字コードに変換するOCRにAIを組み合わせた技術で、事業の内容に定義が印字されています。
- terms: 助言: 用語「Robota」は、AI-OCR関連及び会計仕訳のアルゴリズムをサービス化した同社のサービス群の総称で、事業の内容で印字されています。
- terms: 助言: 用語「Remota」は、請求書の受け取りから会計システムへの連携までを行う同社の請求書処理プラットフォームで、事業の内容で印字されています。
- terms: 助言: 用語「経理AIエージェント」は、会計・税務データと専門知識を学習したAIが、経理業務における判断を支援する仕組みで、事業の内容で印字されています。
- terms: 助言: 用語「Peppol」は、受発注や請求にかかる電子文書をネットワーク上でやり取りするための文書仕様・ネットワーク・運用ルールの国際標準規格で、事業の内容に定義が印字されています。
- terms: 助言: 用語「MRR（Monthly Recurring Revenue）」は月額課金の継続収益を指す課金体系の区分で、事業の内容で印字されています。

## 要確認（status に反映）

- businessModel: 期間後の資本業務提携について: 2026年2月13日付で株式会社プロシップとの間で資本業務提携契約を締結し、2026年3月2日にプロシップの株式を取得しています（重要な後発事象として注記されています）。登録は2025年12月31日現在の構造で行っており、期間後の資本業務提携の反映には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
