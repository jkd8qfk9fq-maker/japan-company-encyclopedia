# テリロジーホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社テリロジーホールディングス |
| 証券コード | 5133 |
| docID（データを取り出した文書） | `S100YPAC` |
| 原本 docID | `S100YGVT` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YJAH, S100YPAC, S100YFLU／有効文書 S100YPAC（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YPAC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社テリロジーホールディングス / 5133 / docID S100YGVT（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
terilogy-holdings: 8 件の数値を有報XBRLと照合
有報: 株式会社テリロジーホールディングス 訂正有価証券報告書－第4期(2025/04/01－2026/03/31) (docID S100YPAC)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"NumberOfEmployees|2025-03-31","previousFiling":305,"latestFiling":255}]
利益・総資産・純資産・従業員数: 16 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第4期(2025/04/01－2026/03/31)、docID S100YPAC）を有効文書としてこのパックを作った。原本は docID S100YGVT。原本との主要財務の差異: S100YJAH（1件）・S100YPAC（1件） — amendments.records[].comparedToBase を見ること
注意: 訂正有報の分類: financial-change — 数値が原本と異なる（主要財務 1 件／その他の数値 1 件: NumberOfEmployees）。このパックの数値は有効文書のもの。原本の数値を出典にした記述が混ざっていないか確認すること
注意: 訂正有価証券報告書－第3期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
terilogy-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益だけに限定した。MD&Aの部門別売上高は事業構造の説明に用い、セグメント利益や営業利益・経常利益等の金額・増減理由は書いていない。
- businessModel: 受注高・受注残高の金額は書いていない（MD&Aに印字はある）。
- businessModel: 新中期経営計画の2026年度の連結業績目標（売上高・利益の目標値）は、計画の金額であり投資指標に当たるため本文・perspectivesには書いていない。
- businessModel: financialNotesの候補は２件とも2025年3月期の従業員数訂正に関するもので同一の事象のため、１件にまとめて着地させた。
- businessModel: 訂正有価証券報告書（S100YPAC）が有効文書であり、出典は訂正有報の提出日・docIDで記載した。原本はS100YGVT（2026年６月23日提出）。第３期の有報にも訂正有報（S100YFLU）が提出されているが、当期の登録数値は有効文書のものを用いた。
- businessStructure: セグメント情報は単一セグメント（ITソリューション・サービス事業）のため記載が省略されており、３部門の売上高はMD&Aの販売実績（事業部門別）の印字によった。事業の並びは外部売上高の大きい順（セキュリティ部門4,434百万円、ソリューションサービス部門4,424百万円、ネットワーク部門1,787百万円）とした。部門合計は連結売上高10,646百万円と一致する。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。仕入先である海外ハードウェア・ソフトウェアメーカー等の個別名は【事業の内容】に印字がなく、warningsへの記録も行っていない。
- businessStructure: 【主要な設備の状況】は提出会社（純粋持株会社）には重要な設備がなく、国内子会社の本社設備に事業部門との対応欄の印字がないため、設備と事業は結びつけていない。
- businessStructure: 【関係会社の状況】では連結子会社７社が印字されている。キャロルシステム仙台株式会社は2026年２月27日に全株式を取得して子会社化したもので、期末現在の構成に含めて登録した。
- businessStructure: 【事業の内容】には関連会社３社とあるが、【関係会社の状況】に持分法適用関連会社として印字されているのはアイティーエム株式会社とVNCS Global Solution Technology Joint Stock Companyの２社である。
- history: 【沿革】の表は年月セルと事象文が分かれて印字される崩れた表で、年月は11件、事象文は12件と数が一致しない。事象文の並び順どおりに年月を対応づけ、最後の年月（2026年）には２件（INTEPとの投資契約、キャロルシステム仙台の子会社化）を対応させた。キャロルシステム仙台の子会社化は企業結合の注記で2026年２月27日の株式取得が裏付けられる。INTEPとの投資契約の年月は他の節に裏付けがなく、行順の対応づけによった。
- history: 中核事業会社である株式会社テリロジーの1989年創業は【経営方針、経営環境及び対処すべき課題等】に印字されているが、【沿革】の記載範囲外のため沿革の項目には加えていない。
- industry: 主たる業界は it とした。当社はITソリューション・サービス事業の単一セグメントで、ネットワーク・セキュリティ製品の販売・構築・保守とソフトウェアサービスの提供が事業の全体を占めるため、閉じた分類の it が当たる。DEIの別記事業もCTEである。
- relatedCompanies: kanematsu（兼松株式会社）: 【大株主の状況】に印字されているのは兼松エレクトロニクス株式会社であり、候補の兼松株式会社とは別の法人のため結ばない。
- relatedCompanies: アイティーエム株式会社とVNCS Global Solution Technology Joint Stock Companyは持分法適用関連会社だが、候補の一覧にないため結ばない。
- relatedCompanies: seki（セキ株式会社）: 一致箇所は「セキュリティ」等の部分一致のみで、同社への言及ではないため結ばない（ambiguous）。
- relatedCompanies: career（株式会社キャリア）: 一致箇所は人財戦略の「キャリア拡大」という一般的な語句であり、同社への言及ではないため結ばない。
- relatedCompanies: en（エン株式会社）: 一致箇所は「カスタマー・エクスペリエンス」等の部分一致のみのため結ばない（ambiguous）。
- relatedCompanies: port（ポート株式会社）: 一致箇所は「サポート」「リプレイス」等の部分一致のみのため結ばない。
- relatedCompanies: seed（株式会社シード）: 一致箇所は連結子会社名「クレシード」の部分一致のみのため結ばない。
- relatedCompanies: planet（株式会社プラネット）: 一致箇所は事業譲受の相手方であるワンプラネット株式会社の名称の部分一致であり、同社への言及ではないため結ばない。
- relatedCompanies: core（株式会社コア）: 一致箇所は「既存コア事業戦略」という一般的な語句のため結ばない（ambiguous）。
- relatedCompanies: innovation（株式会社イノベーション）: 一致箇所は組織風土に関する一般的な語句のため結ばない。
- relatedCompanies: ray（株式会社レイ）: 一致箇所は住所の「フロントプレイス」等の部分一致のみのため結ばない（ambiguous）。
- relatedCompanies: suzuki-6785（株式会社鈴木）: 一致箇所は代表者の氏名「鈴木達」の部分一致のみのため結ばない（ambiguous）。
- relatedCompanies: corona（株式会社コロナ）: 一致箇所は「ポストコロナ」という一般的な語句のため結ばない。
- relatedCompanies: land（株式会社ランド）: 部分一致のみで同社への言及がないため結ばない。
- relatedCompanies: nissin（株式会社日新）: 候補の listing がコードリストになく、一致箇所も部分一致のみのため結ばない（ambiguous）。
- relatedCompanies: path（パス株式会社）: 部分一致のみで同社への言及がないため結ばない（ambiguous）。
- relatedCompanies: rent（株式会社レント）: 部分一致のみで同社への言及がないため結ばない。
- relatedCompanies: step（株式会社ステップ）: 一致箇所は連結子会社名「エフェステップ」の部分一致のみのため結ばない。
- relatedCompanies: vision（株式会社ビジョン）: 部分一致のみで同社への言及がないため結ばない。
- relatedCompanies: base-4481（ベース株式会社）: 部分一致のみで同社への言及がないため結ばない。
- relatedCompanies: daiwa（株式会社大和）: 部分一致のみで同社への言及がないため結ばない（ambiguous）。
- relatedCompanies: kohsoku（株式会社高速）: 部分一致のみで同社への言及がないため結ばない（ambiguous）。
- relatedCompanies: slogan（スローガン株式会社）: 一致箇所は経営の「スローガン」という一般的な語句のため結ばない。
- relatedCompanies: system-integrator（株式会社システムインテグレータ）: 部分一致のみで同社への言及がないため結ばない。
- relatedCompanies: the-lead（株式会社リード）: 一致箇所は「新規リードの獲得」という一般的な語句のため結ばない。
- terms: 助言: 用語「THX」は、当社グループ開発のネットワーク運用・管理・監視製品およびトラフィックデータ収集・分析製品の名称で、【事業の内容】に印字されています。
- terms: 助言: 用語「CloudTriage」は、当社グループ独自のアプリケーション等の性能を監視するクラウドサービスで、【事業の内容】に印字されています。
- terms: 助言: 用語「EzAvater」は、当社グループ開発のソフトウェアRPAツールで、【事業の内容】に印字されています。RPAは、人間が手作業で行っていた定型的な事務作業をソフトウェアロボットが代行する取り組みです。
- terms: 助言: 用語「CTI（サイバー脅威情報）」は、サイバーリスクにつながる脅威について収集、分析して得られる情報の総称で、【事業の内容】の用語解説に印字されています。
- terms: 助言: 用語「みえる通訳」は、外国人観光客との円滑なコミュニケーションのためのリアルタイム多言語映像通訳サービスで、【事業の内容】に印字されています。

## 要確認（status に反映）

- businessModel: [object Object]
- businessModel: [object Object]
- businessStructure: [object Object]
- businessStructure: [object Object]

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
