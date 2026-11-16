# ＲＯＢＯＴ　ＰＡＹＭＥＮＴ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＲＯＢＯＴ　ＰＡＹＭＥＮＴ |
| 証券コード | 4374 |
| docID（データを取り出した文書） | `S100XUUD` |
| 原本 docID | `S100XUUD` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUUD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＲＯＢＯＴ　ＰＡＹＭＥＮＴ / 4374 / docID S100XUUD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
robot-payment: 10 件の数値を有報XBRLと照合
有報: 株式会社ＲＯＢＯＴ　ＰＡＹＭＥＮＴ 有価証券報告書－第26期(2025/01/01－2025/12/31) (docID S100XUUD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
robot-payment: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社ROBOT　PAYMENT」が EDINET の提出者名「株式会社ＲＯＢＯＴ　ＰＡＹＭＥＮＴ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記のうち、連結財務諸表を作成していない旨、関連会社が存在しない旨、潜在株式調整後の数値を記載しない理由、従業員数の数え方、上場に伴う株価関係の注記は表示事項のため financialNotes には入れず、ここに記録した。
- businessModel: 2025年２月13日実施の自己株式の取得は資本政策の手続きのため、warnings のみとし金額は書いていない。
- businessModel: 各事業のアカウント数・ARPAは経営指標として重視されている旨が印字されているが、数値目標ではないため本文・perspectives には目標値として書いていない。
- businessModel: MD&Aのセグメント利益・段階利益の金額と理由、キャッシュ・フローの金額、設備の帳簿価額は書いていない。
- businessStructure: 本社（東京都渋谷区）の設備行はペイメント・フィナンシャルクラウド・本社業務設備と連記されているため、特定の事業には結びつけていない。帳簿価額は書いていない。
- businessStructure: セグメント注記の外部顧客への売上高は、ペイメント1,987,250千円とフィナンシャルクラウド1,269,185千円の合計が3,256,435千円となり、印字の合計3,256,436千円と1千円異なる。印字の数値をそのまま使い、差異はここに記録した。
- businessStructure: 2024年12月期のセグメント注記には報告セグメントに含まれない「その他」（顧客のDXにおける技術支援事業の収入2,854千円）があったが、2025年12月期の注記表には区分がなく金額も印字されていないため、事業として登録していない。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略した。ペイメント事業では各クレジットカード会社と業務代行・代表加盟の提携契約を締結している旨が印字されている（個別の相手は関連企業としては結んでいない）。
- businessStructure: 「請求管理ロボ」はSalesforce®のAppExchange上でも「請求管理ロボ for Salesforce」として提供され、株式会社セールスフォース・ドットコムからライセンスの付与を受けている旨が印字されている。同社は関連企業候補にないため、ここに記録した。
- history: 沿革の設立行に印字された資本金の金額は、規則により書いていない。
- history: 省いた行と理由：2006年のプライバシーマーク取得（認証の取得で事業の転機ではない）、2013年の顧客データベース拡張機能「ＰａｙＤｏ」のリリース（個別機能）、2015年・2016年の「経理のミカタ」の機能追加（個別機能の拡張）、2018年の「金融機関連携ロボ」のリリース（個別機能）、2019年の請求書テンプレート機能（個別機能）、2020年のAPI連携機能の提供開始（個別機能）、2022年の市場再編に伴うグロース市場への移行（市場制度上の移行）、2022年の「1click後払い」提供開始と「請求管理ロボ for Enterprise」提供開始（製品としては事業構造に記載）、2024年の「サブスクペイ　インボイスエディション」と「1click早マール」の提供開始（製品としては事業構造に記載）。
- history: Wikipediaは見つからなかったため使っていない。
- industry: 主たる業界は、決済代行と請求管理のソフトウェアサービスが中核であるため it とした。両セグメントとも金額が独立して開示されており、最大はペイメント（外部顧客への売上高1,987百万円）である。
- industry: finance は付けていない。同社は金融機関や資金移動業者としてではなく、決済と請求の処理を担うソフトウェアサービスを提供する会社であり、別記事業も情報・通信（CTE）であるためである。
- relatedCompanies: career：キャリア形成の文言のみで、その相手についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: nissin：コードリストにない。新株予約権の文言中の部分一致のみで、関係の印字がないため結ばなかった。
- relatedCompanies: vision：同社自身のビジョンの文言のみで、関係の印字がないため結ばなかった。
- relatedCompanies: en：課金エンジン等の文言の部分一致（曖昧）のみで、関係の印字がないため結ばなかった。
- relatedCompanies: base-4481：『決済の機能をベースに』等の文言の部分一致のみで、関係の印字がないため結ばなかった。
- relatedCompanies: port：サポートの文言の部分一致のみで、関係の印字がないため結ばなかった。
- relatedCompanies: land：ブランドの文言の部分一致のみで、関係の印字がないため結ばなかった。
- relatedCompanies: nix：旧社名ジニックスジャパンの部分一致のみで、株式会社ニックスとは別の対象であるため結ばなかった。
- relatedCompanies: aeon：印字はイオンクレジットサービス株式会社との包括代理加盟店契約であり、イオン株式会社とは別の法人であるため結ばなかった。
- relatedCompanies: caster：預り金の相手先として金額が載るのみで、取引内容や提携の印字がないため結ばなかった。
- relatedCompanies: corona：新型コロナウイルス感染症の文言のみで、関係の印字がないため結ばなかった。
- relatedCompanies: ly、jaccs、mitsubishi-hc-capital、mizuho-financial-group、orix、sbi-holdings、takeda-pharmaceutical、tokyu-fudosan-holdings：いずれも投資有価証券として同社債券を保有する旨の印字のみで、事業上の取引・提携の印字がないため結ばなかった。
- relatedCompanies: money-forward：会計システムの連携先の名称として印字されるのみで、同社との取引・提携の印字がないため結ばなかった。
- relatedCompanies: ray：AppExchangeの文言中の部分一致（曖昧）のみで、関係の印字がないため結ばなかった。
- relatedCompanies: secure：『セキュアな環境』の文言のみで、関係の印字がないため結ばなかった。
- relatedCompanies: trust：コードリストにない。三井住友トラスト・ホールディングスの社債名の部分一致のみで、関係の印字がないため結ばなかった。
- relatedCompanies: 候補にない相手：Ginix.Incは設立時の親会社だが2006年に傘下を離れており候補にない。株式会社セールスフォース・ドットコムは「請求管理ロボ for Salesforce」のライセンス関係があるが候補にないため結ばず、事業構造のwarningsに記録した。各クレジットカード会社とは業務代行・代表加盟の契約があるが、個別の候補としては結んでいない。
- terms: 助言のみ。用語としては『サブスクペイ』『請求管理ロボ』『リカーリング収益』『ARPA』『PCI DSS』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 2021年６月４日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第22期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2021年６月４日付で普通株式１株につき２株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第22期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
