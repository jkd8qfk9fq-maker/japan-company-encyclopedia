# ノムラシステムコーポレーション — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ノムラシステムコーポレーション |
| 証券コード | 3940 |
| docID（データを取り出した文書） | `S100XTIP` |
| 原本 docID | `S100XTIP` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTIP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ノムラシステムコーポレーション / 3940 / docID S100XTIP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nomura-system: 10 件の数値を有報XBRLと照合
有報: 株式会社ノムラシステムコーポレーション 有価証券報告書－第41期(2025/01/01－2025/12/31) (docID S100XTIP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
nomura-system: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本有報は未修正です（state の amendments は status none、訂正docIDなし、DEIの訂正フラグはすべて false、checkedThrough 2026-11-12）。前期有報との修正再表示照合は全6系列・重複4行すべて差異ゼロでした。
- businessModel: 重要な後発事象の自己株式の取得（2026年2月13日取締役会決議）は資本政策の手続のため、本文には書かずここに記録します。金額は記載していません。従業員に対する譲渡制限付株式としての自己株式の処分（経営成績等の分析に記載）も同様に資本政策として扱いました。
- businessModel: 第41期の配当は2026年3月26日開催予定の定時株主総会の決議事項であり、手続事項のため本文には書いていません。
- businessModel: 経営方針の目標とする経営指標（収益性・安全性を示す指標）と配当方針の数値目標は、投資・利益指標の目標のため本文・perspectivesには書いていません。
- businessModel: 段階利益の金額と理由、キャッシュ・フローの金額、外注実績の金額は本文に書いていません。受注実績は会社がサービスの性格上記載を省略しています。
- businessModel: Wikipediaは業界の一覧ページしか見つからず、補足に使える記事がなかったため使用していません。
- businessStructure: 当社はERPソリューション事業のみの単一セグメントであり、セグメント情報の記載は有報で省略されています。子区分は【事業の内容】に印字されたサービス形態（プライム、PMOコンサルティング、FIS）で、金額の独立開示はありません（【関連情報】の製品及びサービスごとの情報も単一セグメントのため省略）。
- businessStructure: MD&Aの販売実績は契約形態別（準委任契約等・請負契約・その他）の区分であり、事業・サービスの区分ではないため、子区分の金額には使っていません。
- businessStructure: 主要な設備は本社（東京都渋谷区）と西日本支社の2拠点で、いずれも単一事業の事業設備です。設備の帳簿価額は記載していません。
- businessStructure: コンサルティング支援の一部はパートナーである個人事業主及び外注会社へ外注していますが、個別の外注先名は【事業の内容】に印字されていないため、suppliers はこのツリーの旧スキーマに従い省略し、ここに記録します。
- history: 沿革表は年月と事象が分かれて印字される崩れた表ですが、年月21件と事象21件で数が一致したため、行順に対応づけて読みました。
- history: 省いた項目: 本社移転（1988年虎ノ門、1990年芝大門、2000年恵比寿）、大阪支店（現西日本支社）の開設（1990年）、SAP HRパートナーコンソーシアム（現HCMコンソーシアム）の設立メンバー選定（2003年）、ブライダルサイト「Relie」の運営開始（2010年、2018年2月サービス終了）、SAPジャパンのPartner Center of Expertise認定（2012年）、「Jet-One」のQualified Partner in Japan Rapid-Deployment Solution 2013認定（2013年）、ISMS認証取得（2015年）、プライバシーマーク認証取得（2015年）、市場第二部への市場変更（2018年3月、第一部への変更の項目に統合）。
- history: 設立時の資本金の金額は、沿革に資本金額を書かない規則のため記載していません。
- history: Wikipediaは業界の一覧ページしか見つからず、補足に使える記事がなかったため使用していません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる事業はSAP ERPの導入コンサルティングというITサービスであり、it を primary としました。通信事業者でもメディア事業者でもないため、telecommunications・media は付けていません。
- relatedCompanies: seki: 「セキュリティ」等の部分文字列のみで、曖昧な一致のため結びませんでした。
- relatedCompanies: en: 「エンドユーザー」等の部分文字列のみで、曖昧な一致のため結びませんでした。
- relatedCompanies: port: 「サポート」等の部分文字列のみのため結びませんでした。
- relatedCompanies: career: 「キャリア形成」という一般語の一致のみのため結びませんでした。
- relatedCompanies: suzuki-6785: 取締役の姓の一致のみで、曖昧な一致のため結びませんでした。
- relatedCompanies: taya: 「世田谷区」の部分一致のみで、曖昧な一致のため結びませんでした。
- relatedCompanies: cover: 「カバーできない」という一般語の一致のみのため結びませんでした。
- relatedCompanies: cresco: 有報の印字は株式会社クレスコの子会社であるクレスコ・イー・ソリューションで、別法人のため結びませんでした。
- relatedCompanies: freee: 「フリーレント」の部分文字列のみのため結びませんでした。
- relatedCompanies: rent: 「フリーレント」の部分文字列のみのため結びませんでした。
- relatedCompanies: vision: 「組織のビジョン」という一般語の一致のみのため結びませんでした。
- relatedCompanies: mitsubishi-materials: 創業者の前職として沿革に印字されるのみで、当社との取引・提携の記載がないため結びませんでした。
- relatedCompanies: 候補にないため結ばず記録します: SAPジャパン株式会社（サービス・パートナー契約、SAP PartnerEdgeチャネル契約VAR、各種認定の相手方ですが、非上場で候補にありません）、株式会社NHKメディアホールディングスと株式会社NHKエンタープライズ（主要な顧客として印字されますが、候補にありません）、株式会社SBI証券（大株主ですが証券会社であり、候補にありません）。
- relatedCompanies: 政策保有株式は該当事項がなく、純投資目的の投資株式のみのため、保有株式を根拠とするリンクはありません。
- terms: 助言のみの工程です。用語候補: 「ERP」（企業内の会計・販売・物流・人事などの経営資源を統合的に管理し有効活用する手法・概念、またその基幹系統合システム）、「プライム」（エンドユーザーと直接取引する案件形態）、「PMO（プロジェクト マネジメント オフィス）」（ERP導入・DX推進を戦略策定から実装・定着まで支援する伴走型の進め方）、「FIS（ファンクション インプリメント サービス）」（パートナー企業向けに要件分析・機能設計やアドオン設計を支援するサービス）。いずれも本文で使った語で、有報の用語解説に基づきます。

## 要確認（status に反映）

- businessModel: 2022年７月１日に普通株式１株につき２株の株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第37期の期首に行われたと仮定して指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2022年７月１日に普通株式１株につき２株の株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第37期の期首に行われたと仮定して指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
