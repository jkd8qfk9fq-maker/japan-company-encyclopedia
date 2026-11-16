# サイバーセキュリティクラウド — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サイバーセキュリティクラウド |
| 証券コード | 4493 |
| docID（データを取り出した文書） | `S100XTY6` |
| 原本 docID | `S100XTY6` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTY6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サイバーセキュリティクラウド / 4493 / docID S100XTY6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cyber-security-cloud: 8 件の数値を有報XBRLと照合
有報: 株式会社サイバーセキュリティクラウド 有価証券報告書－第16期(2025/01/01－2025/12/31) (docID S100XTY6)
前期有報との比較: 18 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 16 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
cyber-security-cloud: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 連結損益計算書の表示方法の変更（「キャッシュバック収入」と「株式交付費」の独立掲記に伴う前連結会計年度の組替え）は、営業外収益・営業外費用の内訳の表示のみの変更であり、売上高と親会社株主に帰属する当期純利益に影響しないため、financialNotesには入れていない。前期有報との修正再表示チェックでも全系列に差異はなかった。
- businessModel: 経営指標等の注記1（第13期は連結子会社であった株式会社ソフテックを2022年４月１日に吸収合併したため連結財務諸表を作成していない）は、５年表に2022年12月期の行が無いためfinancialNotesには入れていない。５年表の2022年12月期が欠けている理由がこの注記である。
- businessModel: 中期経営計画の財務目標（売上高や営業利益の金額）は投資指標にあたるため、本文とperspectivesに金額を書いていない。ARRやMRRなどの経営指標の金額も書いていない。
- businessModel: 営業利益・経常利益の金額と増減理由、キャッシュ・フローの金額、総資産・純資産の金額は書いていない。
- businessModel: 【重要な後発事象】は連結・個別とも該当事項なしだった。株式分割・株式併合の記載もない。
- businessStructure: 単一セグメントのため、子区分は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の販売実績のサービス別内訳（攻撃遮断くん、WafCharm、その他）どおりとした。セグメント注記と【関連情報】の製品及びサービスごとの情報は単一セグメントを理由に省略されている。
- businessStructure: 販売実績の「その他」（1,738百万円）は3区分の中で最も大きいが、SIDfm、脆弱性診断サービス、AWS WAF Managed Rules、CloudFastener、webtruなど複数のサービスの合算であり、個別の金額は開示されていない。
- businessStructure: 2024年５月に設立したCyber Security Cloud Pte. Ltd.（シンガポール法人）は【関係会社の状況】の連結子会社に含まれていないため、グループ構成は関係会社表どおりの連結子会社3社で記載した。
- businessStructure: 設備は本社（東京都品川区）と米国子会社本社のみで、単一セグメントのため特定の子区分には結びつけていない。帳簿価額や賃借料の金額は書いていない。
- businessStructure: suppliersキーはこのツリーの旧スキーマに無いため付けていない。個別に印字された仕入先はない。
- history: 沿革のうち、Web改ざん検知サービス「Web改ざん発見くん」の提供開始（2016年）、サイバー保険の自動付帯の開始（2016年）、ファイアウォール装置の特許取得（2018年）、ISMS認証の取得（2018年）、「WafCharm AWS版」の米国提供開始（2021年）、本店の品川区への移転（2022年）、Cyber Security Cloud Pte. Ltd.の設立（2024年）は、事業の転機ではないため落とした。資本金の金額は書いていない（沿革にも印字がない）。
- history: 年月は有報の印字どおり年だけに丸め、月は書いていない。
- industry: 主たる業界はitとした。クラウド型WAFやWAF自動運用、脆弱性情報の提供、フルマネージドセキュリティサービスはいずれもサイバーセキュリティに関する情報サービスであり、売上高の全体がこれにあたるためである。閉じた分類にサイバーセキュリティ専用の区分はないが、ソフトウェアとクラウドを通じたサービス提供が事業の実態であり、過去の同業の準備（グローバルセキュリティエキスパート株式会社）でもitのみとしているため、暫定の当てはめはしていない。
- industry: 他の業界は付けていない。顧客はあらゆる業種の企業であり、顧客の属性は業界ではないためである。
- relatedCompanies: gmo-internet-group以外の候補は次のとおり結ばなかった。
- relatedCompanies: career: 「キャリア」という一般語の一致のみで、株式会社キャリアについて述べる印字はないため結ばなかった。
- relatedCompanies: en: 「エンジニア」などの語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: base-4481: 「情報ベース」という語の部分一致のみのため結ばなかった。
- relatedCompanies: nissin: 候補のlistingがコードリストにないうえ、新株予約権の行使期間の表記などの部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: port: 「サポート」という語の部分一致のみのため結ばなかった。
- relatedCompanies: kohsoku: 「高速化」という語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: lec: 「フレックスタイム」という語の部分一致のみのため結ばなかった。
- relatedCompanies: no-1: 「No.1ポジション」という目標表記の一致のみで、株式会社No．1について述べる印字はないため結ばなかった。
- relatedCompanies: core: 「コア領域」という語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: secure: 「セキュアな環境」という語の部分一致のみのため結ばなかった。
- relatedCompanies: cota: 有報が印字する相手は新株予約権の受託者であるコタエル信託であり、コタ株式会社とは別の主体のため結ばなかった（ambiguous）。
- relatedCompanies: cover: 「カバーする」という動詞の一致のみのため結ばなかった。
- relatedCompanies: insource: 「インソース型」という支援モデルの語の一致のみのため結ばなかった。
- relatedCompanies: trust: 候補のlistingがコードリストにないうえ、印字は日本マスタートラスト信託銀行株式会社（信託口）という信託口の名義にとどまるため結ばなかった。
- relatedCompanies: vector: 株式会社ベクトルは株主の常任代理人として印字されたのみで、株主本人ではないため結ばなかった。当該株主自身も当事業年度末現在では主要株主ではなくなっている。
- relatedCompanies: vision: 「ビジョン」という一般語の一致のみのため結ばなかった。
- relatedCompanies: zero: 「ゼロデイ」という語の部分一致のみのため結ばなかった（ambiguous）。
- relatedCompanies: 大株主のうち、JIC VGIオポチュニティファンド１号投資事業有限責任組合はファンド、株式会社日本カストディ銀行（信託口）と日本マスタートラスト信託銀行株式会社（信託口）は信託口であり、事業会社ではないため結ばなかった。セントラル短資株式会社と野村證券株式会社は金融機関で、資金調達や証券事務の範囲を超える関係の印字がないため結ばなかった。
- relatedCompanies: 【株式の保有状況】の特定投資株式は該当事項なしで、政策保有による候補はない。当社グループの連結子会社（Cyber Security Cloud Inc.、株式会社ジェネレーティブテクノロジー、株式会社DataSign）は関連企業に含めていない。
- terms: 助言のみ。用語としては『WAF（Webアプリケーションファイアウォール）』『クラウド型WAF』『シグネチャ』『脆弱性』『マネージドルール（Managed Rules）』『サブスクリプション』などが候補だが、本工程ではデータを持たないため空とした。有報の用語集にはWAF、クラウド型WAF、シグネチャ、Managed Rules、AWS WAFなどの定義が印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
