# アジアクエスト — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アジアクエスト株式会社 |
| 証券コード | 4261 |
| docID（データを取り出した文書） | `S100XVLI` |
| 原本 docID | `S100XVLI` |
| 提出日（原本） | 2026-03-31 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XVLI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アジアクエスト株式会社 / 4261 / docID S100XVLI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asiaquest: 10 件の数値を有報XBRLと照合
有報: アジアクエスト株式会社 有価証券報告書－第14期(2025/01/01－2025/12/31) (docID S100XVLI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
asiaquest: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記のうち、株式分割（注3）と収益認識基準の適用（注4）を financialNotes に採った。注1（2021年12月27日のマザーズ上場に伴う期中平均株価の算定方法）と注2（従業員数の定義・臨時雇用者の外数表示）は表示上の事項のため warnings に留めた。
- businessModel: 株式分割は当社自身の分割であり、指標の算定仮定を伴うため needsReview にも記録した（financialNotes の文には1株当たり指標の項目名は書いていない）。
- businessModel: 【経営方針、経営環境及び対処すべき課題等】の経営上の目標の指標（売上高成長率、営業利益率）は投資・利益率の指標であるため、数値目標としては本文にも perspectives にも書かなかった。MD&Aの段階利益の金額や理由、キャッシュ・フローの金額も書いていない。
- businessModel: 前期有報との修正再表示チェックは全系列で差異ゼロであり、訂正有報もない（amendments status は none、otherFilingsInWindow は空）ため、訂正に関する注記は書いていない。
- businessModel: マレーシア子会社は2025年12月末時点で債務超過であり、当期に同子会社の事業用資産の減損が計上されているが、いずれも有報に開示された事実であり、金額は本文に書いていない。
- businessStructure: 単一セグメントのため、事業はデジタルトランスフォーメーション事業の1つとし、【事業の内容】が区分する3サービス（コンサルティング、モダナイゼーション、AIインテグレーション）を children とした。セグメント注記の【関連情報】は製品及びサービスごとの情報を省略（単一区分が売上高の90％超）しており、サービス区分ごとの売上高は開示されていないため、children に金額は書いていない。
- businessStructure: この工程の旧スキーマに合わせ suppliers は書かなかった。【事業の内容】に個別の仕入先名の印字はなく、仕入・外注パートナーの拡大方針だけが【経営方針、経営環境及び対処すべき課題等】にある。
- businessStructure: 設備は、本社（東京都文京区、従業員393人）が単一セグメント全体の拠点であり、福岡オフィス等2営業所とインドネシア子会社の本社も同じ事業に属するため、特定の children には結びつけなかった。帳簿価額は書いていない。
- businessStructure: 連結子会社は PT.AQ Business Consulting Indonesia（特定子会社、議決権100.0％）と AsiaQuest Internet Malaysia SDN. BHD.（同100.0％）の2社。【関係会社の状況】の注記に、マレーシア子会社が2025年12月末時点で債務超過である旨の印字がある（金額は書いていない）。
- businessStructure: 株式分割（2021年8月26日、1株につき100株）については businessModel の financialNotes と needsReview に記録した。
- history: 沿革のうち次は省略した: 2013年4月の東京都千代田区への移転と国内企業向けシステム開発の開始、2014年4月のクラウド・インフラ構築の開始、2014年12月のジョグジャカルタ開発拠点の開設、2017年7月の福岡オフィスの新設、2017年12月のISO27001認証の取得、2018年4月の別府ラボの新設、2018年5月の「beaconnect plus」のリリース、2018年7月のRPA導入サポートの開始、2018年8月の「SmartCUBE」のリリース、2018年11月のPT. Dipo Star Financeとの業務提携、2022年9月のAWS 100 APN Certification Distinctionの取得、2024年4月の大阪オフィスの新設、2024年12月の本社の東京都文京区への拡張移転、2025年12月のAWS 500 APN Certification Distinctionの取得（拠点の開設・移転、認証・表彰、個別サービスの開始は事業の転機となるものだけを採った）。
- history: 資本金の金額は規則により沿革に書いていない。
- industry: 主たる業界は it とした。単一セグメントのデジタルトランスフォーメーション事業は、コンサルティング、システム開発、クラウド・データ基盤構築、AI実装までを提供する情報サービス事業である。
- industry: human-resources は付けなかった。サービス提供の方法として派遣も選択肢にあるが、事業の主体はコンサルティングとシステム開発・運用の受託であり、人材サービスとして開示されていないため。
- industry: DEIの別記事業は cte である。
- relatedCompanies: en: 「エンジニア」等の一般語の部分一致（ambiguous）のみで、エン株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: port: 「サポート」の部分一致のみで、ポート株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: quest: 自社名「アジアクエスト」の部分一致のみで、株式会社クエストとの関係の記載がないため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」の部分一致（ambiguous）のみで、セキ株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: vision: 「ビジョンの共有」等の一般語の一致のみで、株式会社ビジョンとの関係の記載がないため結ばなかった。
- relatedCompanies: base-4481: 「データベース」の部分一致のみで、ベース株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: kohsoku: 「高速化」という一般語の一致（ambiguous）のみで、株式会社高速との関係の記載がないため結ばなかった。
- relatedCompanies: nissin: 新株予約権の条文中の部分一致のみで、同社はコードリストになく、関係の記載もないため結ばなかった。
- relatedCompanies: cybozu: 印字は同社の製品kintoneの用語解説と、インドネシア子会社によるkintone導入支援およびCYBOZU AWARD 2019の受賞の記載にとどまり、サイボウズ株式会社との取引・提携の明記がないため結ばなかった。
- relatedCompanies: innovation: 「イノベーション創出力」という一般語の一致のみで、株式会社イノベーションとの関係の記載がないため結ばなかった。
- relatedCompanies: land: 「ブランド」の部分一致のみで、株式会社ランドとの関係の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-corporation: 沿革に印字された業務提携の相手は三菱商事グループのPT. Dipo Star Financeであり、三菱商事株式会社とは別法人のため結ばなかった。
- relatedCompanies: ntt: 資本業務提携の相手は西日本電信電話株式会社であり、NTT株式会社とは別法人のため結ばなかった。西日本電信電話株式会社（現・NTT西日本株式会社）は2025年12月31日現在の大株主にも0.79％で載っているが、候補にはない。
- relatedCompanies: slogan: 自社のスローガン「Empower to Change」の文脈の一般語の一致のみで、スローガン株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: startia-holdings: 2018年12月の資本業務提携が沿革にあるが、当期の大株主の状況に同社はなく、現在の資本関係・取引関係の印字がないため結ばなかった（提携の事実自体は沿革に記録した）。
- relatedCompanies: taya: 「世田谷区」の部分一致（ambiguous）のみで、株式会社田谷との関係の記載がないため結ばなかった。
- relatedCompanies: the-lead: 「リード拡大」という一般語の一致のみで、株式会社リードとの関係の記載がないため結ばなかった。
- relatedCompanies: 候補にない相手: 大株主は代表取締役の桃井純とその資産管理会社ＪＨＤアセットマネジメント株式会社が中心で、事業会社の大株主は西日本電信電話株式会社（0.79％）のみ。【株式の保有状況】は該当事項なし。連結子会社2社は自社の子会社のため結ばない。
- terms: 用語の助言：「AIX（AIトランスフォーメーション）」（AI技術を中核に据えてビジネスプロセスや意思決定を抜本的に変革すること）、「DX（デジタルトランスフォーメーション）」、「AIインテグレーター」（同社の自称。コンサルティングからシステム設計・開発・運用まで一貫支援する立場）、「AIエージェント」（目的達成に必要なタスクを自律的に実行するAI）、「モダナイゼーション」（老朽化した既存システムを最新の環境へ刷新すること）、「AIインテグレーション」（既存の業務システムにAI技術を組み込む一連の統合プロセス）、「PMO」（プロジェクト・マネジメント・オフィス）、「デジタルツイン」（物理空間の情報をもとにデジタル空間に再現する技術）、「beaconnect」（同社のIoTプラットフォーム）、「AQ-AIエージェント」（同社のAIエージェントサービス群）、「まるクラ」（同社のマルチクラウド・マネジメントサービス）、「ビジネスエンジニア」（業界のドメイン知識を持つ同社の専門人材）は、この会社の説明に繰り返し現れる中心用語である。

## 要確認（status に反映）

- businessModel: 2021年8月26日付で普通株式1株につき100株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第10期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2021年8月26日付で普通株式1株につき100株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第10期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
