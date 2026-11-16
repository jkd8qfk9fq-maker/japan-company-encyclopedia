# Photosynth — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｐｈｏｔｏｓｙｎｔｈ |
| 証券コード | 4379 |
| docID（データを取り出した文書） | `S100XV3D` |
| 原本 docID | `S100XV3D` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XV3D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｐｈｏｔｏｓｙｎｔｈ / 4379 / docID S100XV3D（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
photosynth: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｐｈｏｔｏｓｙｎｔｈ 有価証券報告書－第12期(2025/01/01－2025/12/31) (docID S100XV3D)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
photosynth: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Photosynth」が EDINET の提出者名「株式会社Ｐｈｏｔｏｓｙｎｔｈ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記１～３・５（潜在株式や損失計上年度の表示、従業員数の数え方）は表示事項のためwarningsのみとした。注記４（第８期から第10期に損失を計上した理由）も表示・経過の説明のためfinancialNotesには入れていない。
- businessModel: 期間後の出来事である資本準備金の額の減少（2026年３月５日取締役会決議、2026年３月30日の定時株主総会に付議予定）と有償ストック・オプションの発行決議（2026年２月13日）は、いずれも資本政策の手続きのためwarningsのみとし、金額は書いていない。
- businessModel: 2026年２月に公表された中期経営計画の売上高成長率などの数値目標は、投資・収益に関する指標のため本文や戦略には書いていない。調整後EBITDAも利益指標のため金額は書いていない。
- businessModel: MD&Aの段階利益の金額と増減理由、キャッシュ・フローの金額、設備の帳簿価額は書いていない。売上高の増加理由はMD&Aの印字（新規顧客獲得と既存顧客からの追加受注）に基づく。
- businessStructure: 単一セグメント（空間DX事業）のため、事業は1つとし、製品及びサービスごとの情報（関連情報）の区分であるAkerun、施設運営代行、その他を子区分とした。セグメント名称は前連結会計年度に「Akerun事業」から「空間DX事業」へ変更されている（名称変更のみ）。
- businessStructure: 施設運営代行の外部顧客への売上高436,675千円は、関係会社の状況に印字された連結子会社株式会社Migakunの売上高と一致する。
- businessStructure: fixU（2025年10月に完全子会社化）の売上高が製品及びサービスごとの情報のどの区分に含まれるかは印字されていないため、区分への金額の割当てはせず、事業全体の説明と沿革に記載した。
- businessStructure: 連結子会社は4社（株式会社MIWA Akerun Technologies（議決権51％）、株式会社Migakun（100％）、株式会社fixU（100％）、株式会社D分割準備会社（100％））で、いずれも当社の子会社であるため関連企業には結んでいない。合弁相手の美和ロック株式会社は非上場で関連候補にないため結んでいない（合弁会社設立の契約は重要な契約等に印字）。
- businessStructure: 主要な設備は本社（東京都港区）のみで、単一セグメントのため特定の事業には結びつけていない。設備の帳簿価額は書いていない。
- businessStructure: suppliersのキーはこのツリーの旧スキーマのため省略した。仕入先として個別に印字された相手はない。
- history: 設立時の資本金の額は書いていない。
- history: 省いた沿革事項: NEDOの支援事業への採択（2014年・2017年）、本社の移転（2015年・2016年・2018年）、CNET Japan Startup Awardやニッポン新事業創出大賞の受賞、Forbes「30 UNDER 30」への選出、Akerun RemoteやAkerunコントローラーの発表、大阪・福岡・名古屋・札幌の各オフィスの設立、ISMS認証の取得、CISO・CTOの設置、ロゴやブランドのリニューアル、JR東日本スタートアップ大賞の受賞、国内シェアNo.1の獲得（業界ポジションの根拠として使用）、ヤマト運輸のプラットフォームとの連携発表、ソフトバンク株式会社等が提供するサービスとの連携開始、Akerunデジタル身分証とAkerun QR受付システムの提供開始、Sansan株式会社のサービスとの連携開始、GOLFZON Japan株式会社とのパートナーシップ、ステップゴルフ株式会社との協業開始、ニチガス／エナジー宇宙との協業。製品発表や受賞などの単発の出来事は、事業の転機となるものだけを採った。
- industry: 主たる業界はitとした。スマートロック等のIoT機器とクラウド上の認証プラットフォームを組み合わせたソフトウェアサービスが中核であり、別記事業も情報・通信（CTE）である。
- industry: real-estateは付けていない。不動産は同社の顧客業界であり、同社自身の事業ではないためである。telecommunicationsも付けていない（通信そのものの事業ではない）。
- relatedCompanies: hikari-tsushin: 経営方針に「光通信グループの各社との販売パートナー契約を推進」との印字はあるが、相手はグループ各社であり株式会社光通信そのものとの契約の印字はない。また、大株主の光通信KK投資事業有限責任組合（6.75％、2025年12月31日現在）は株式会社光通信とは別の法人格のため、結ばなかった。
- relatedCompanies: mitsui-fudosan: 2020年の資本業務提携が沿革に印字されるのみで、当期の取引や関係の印字がないため結ばなかった。
- relatedCompanies: nec: 2018年の顔認証技術の技術連携が沿革に印字されるのみで、当期の関係の印字がないため結ばなかった。
- relatedCompanies: sumitomo-realty-and-development: 特定投資株式の唯一の銘柄だが、保有目的は「取引関係の円滑化」という定型的な文言のみで個別の取引の印字がないため結ばなかった。なお、保有株式の注記の株式分割は住友不動産自身のものであり、当社の分割ではない。
- relatedCompanies: sansan: 2025年３月に名刺アプリ「Eight」のカード型デジタル名刺との連携開始が沿革に印字されるが、製品間の連携であり、同社との取引や提携の印字とは判断しなかったため結ばなかった。
- relatedCompanies: softbank: 2023年４月～７月に同社等が提供する各種サービスとの連携開始が沿革に印字されるのみで、同社との取引や提携の印字がないため結ばなかった。
- relatedCompanies: east-japan-railway: 沿革の印字はJR東日本スタートアッププログラム2020での受賞のみで、取引や提携の印字がないため結ばなかった。
- relatedCompanies: step: 沿革の「ステップゴルフ」は株式会社ステップゴルフであり、候補の株式会社ステップとは別の法人のため結ばなかった。
- relatedCompanies: yamato: 沿革のヤマト運輸株式会社は候補の株式会社ヤマトとは別の法人であり、連携の主体も連結子会社の株式会社MIWA Akerun Technologiesのため結ばなかった。
- relatedCompanies: kokuyo: 新株予約権の割当先としての印字のみで、取引や提携の印字がないため結ばなかった。
- relatedCompanies: ntt: 印字は投資事業有限責任組合の名称の一部（NTTインベストメント・パートナーズファンド）であり、株式会社NTTとの関係の印字がないため結ばなかった。
- relatedCompanies: seki・en・ic・core・kohsoku・suzuki-6785: いずれも一般語や役員の姓などの部分一致（ambiguous）で、社名としての印字がないため結ばなかった。
- relatedCompanies: king・land・space・port・base-4481・vision・freee・lec・the-lead・kel・itsumo・no-1・ray・ricoh・torq・will: いずれも一般語や製品・制度の語の部分一致で、社名としての印字がないため結ばなかった。
- relatedCompanies: daiwa: 印字は大和ハウスグループの文脈であり、候補の株式会社大和ではないため結ばなかった。
- relatedCompanies: nissin・tryt: コードリストにない相手で、印字も新株予約権の文や一般語の部分一致のみのため結ばなかった。
- relatedCompanies: innovation: 印字は投資事業有限責任組合の名称の一部であり、株式会社イノベーションとの関係の印字がないため結ばなかった。
- terms: 助言のみ。用語としては『Akerun』『スマートロック』『HESaaS』『BPaaS』『リカーリング収益』『空間DX』などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 2021年８月11日付で普通株式１株につき200株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第８期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。
- businessStructure: 2021年８月11日付で普通株式１株につき200株の割合で株式分割を行っており、主要な経営指標等の推移の注記に、当該株式分割が第８期の期首に行われたと仮定して株式関連の指標を算定している旨が記載されています。分割に伴う指標の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
