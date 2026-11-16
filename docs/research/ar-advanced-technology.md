# ＡＲアドバンストテクノロジ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＡＲアドバンストテクノロジ株式会社 |
| 証券コード | 5578 |
| docID（データを取り出した文書） | `S100X6EQ` |
| 原本 docID | `S100X6EQ` |
| 提出日（原本） | 2025-11-25 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X6EQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＡＲアドバンストテクノロジ株式会社 / 5578 / docID S100X6EQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ar-advanced-technology: 10 件の数値を有報XBRLと照合
有報: ＡＲアドバンストテクノロジ株式会社 有価証券報告書－第16期(2024/09/01－2025/08/31) (docID S100X6EQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ar-advanced-technology: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「ARアドバンストテクノロジ株式会社」が EDINET の提出者名「ＡＲアドバンストテクノロジ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記５（収益認識に関する会計基準を第13期の期首から適用）は2022年8月期の行の financialNote に着地させた。注記６（2023年３月１日付の株式分割）は自社の株式分割のため needsReview に入れ、2023年8月期の行の financialNote にも着地させた。financialNote では、原注記にある１株当たり指標の算定方法のくだりは「第12期の期首に当該株式分割が行われたと仮定して経営指標等を算定しております」と言い換えた。
- businessModel: 注記１（潜在株式調整後１株当たり当期純利益の非記載）・注記２（上場前の表示）は表示上の事項、注記３（監査法人の異動）と注記４（従業員数の定義）は表示・定義の事項のため financialNotes には入れなかった。注記７（期末配当）は定時株主総会の決議事項である資本政策のため financialNotes には入れず、ここに記録した。
- businessModel: 前期有報との修正再表示チェックは全系列で差異なし（８行照合）。訂正報告書はなく、対象有報自体も訂正されていない（DEIの訂正フラグはいずれも false）。
- businessModel: MD&Aに印字された前期比の増減率（売上高27.2％増、親会社株主に帰属する当期純利益61.6％増）と増収理由（AI開発案件及び高付加価値案件の受注強化策が奏功）を本文に用いた。売上高14,152百万円・親会社株主に帰属する当期純利益445百万円はいずれも千円印字を百万円に切り捨てたものである。
- businessModel: 主要な顧客ごとの情報は「売上高の10％以上を占める相手先がいないため該当事項なし」と印字されているため、個別顧客名は本文に書かなかった。
- businessStructure: 当社グループはDXソリューション事業の単一セグメントであり、セグメント注記・製品及びサービスごとの情報は省略されているため、子区分にはサービス領域（主力サービスと関連サービス）を用い、金額は付けなかった。事業の売上高14,152百万円は連結損益計算書の売上高14,152,706千円を百万円に切り捨てたものである。
- businessStructure: 連結子会社は株式会社エーティーエス（議決権100.0％、情報通信技術者人材サービス業）、株式会社ピー・アール・オー（同100.0％、システムインテグレーション事業等）、株式会社P.R.O ID（同100.0％間接保有）、株式会社CryptoLab（同44.1％間接保有）の４社、持分法適用関連会社は株式会社emotivE（同35.1％、対話AI技術開発）と株式会社ねこまた（同39.0％）の２社である（関係会社の状況）。これらは当社グループ自身の会社であるため relatedCompanies には含めていない。
- businessStructure: 株式会社エーティーエスの売上高1,622,502千円がセグメント関連情報に印字されているが、子会社の損益金額であるため本文の数値としては用いなかった。
- businessStructure: 供給者については、経営方針に250社超のビジネスパートナーとアライアンスを構築し調達・管理の専門部署を置く旨が印字されているが、個別の仕入先名の開示はないため、スキーマ上も suppliers は設けなかった。
- history: 沿革から落とした項目: 支社の開設・移転（2010年東京支社、2011年関西支社、2017年名古屋支社開設、2025年名古屋支社移転・増床）、本社の移転（2017年渋谷、2024年渋谷アクシュへの本店移転）、プライバシーマーク取得（2011年）、ISMS認証取得（2017年）、NEDO公募事業での受賞（2017年、株式会社島津製作所との共同研究）、えるぼし認定（2023年）、AWSの各種プログラム認定・資格取得数区分の認定（2022年Well-Architected／Amazon Connect、200・300・400・500 APN Certification Distinction）、「LOOGUE NoQA」「LOOGUE deepdoc」「ZiDOMA sync」「ZiDOMA ファイルサーバデータ移行サービス」の提供開始、横浜市立大学等との医療AI共同研究開始（2024年）、株式会社MILIZEとの業務提携（2024年）、ICCとの業務提携（2024年）。拠点・認証・受賞・細目のプロダクトは落とし、事業の転換点となる項目に絞った。
- history: 2025年９月の「ZiDOMA access」提供開始は決算期末（2025年８月31日）後の出来事だが、有報の沿革に印字されているため沿革として記載した。
- industry: 主たる業界は it とした。事業はDXソリューション事業の単一セグメントで、ITコンサルティング、AI・クラウドシステムの設計・構築、保守・運用、自社プロダクトの提供、DX人材サービスで構成され、閉じた分類の it に直接当てはまるため、暫定分類や taxonomyGaps は記録しなかった。
- relatedCompanies: shimadzu: 2017年にNEDO公募事業で「人工知能による診療科推論等の調査研究」を共同研究した相手として沿革に印字されているが、過去１回限りの共同研究のため結ばなかった。
- relatedCompanies: recruit-holdings: エーティーエスの「テクパス」が連携する大手求人サイトの代表例として、同社が運営する「Indeed」が事業の内容に印字されているが、株式会社リクルートホールディングス自体との取引・提携・資本関係の記述ではないため結ばなかった。
- relatedCompanies: en / land / tear / port / seki / innovation / path / slogan / freee / rent / rhythm / the-lead / alpha / alpha-4760 / base-4481 / corona / okabe / semba / taya / zero: 一般語・部分一致のみで、当該企業を指す記述がないため結ばなかった（land は「ブランド」、tear は「アドバンストティア」、path は「テクパス」、freee・rent は「フリーレント」、corona は新型コロナウイルス感染症、okabe・taya は個人株主の氏名、semba は「南船場」の地名、alpha・alpha-4760 は株主の住所に現れる別法人の名称の文脈）。
- relatedCompanies: nissin: 候補データの上場区分が「コードリストにない」であり、有報側の出現も新株予約権の文脈で当該企業を指す記述がないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 株式会社エスエスアール（大株主の状況に2025年８月31日現在で60.00％を保有する事業会社として印字されているが、当社代表取締役社長の資産管理会社であり候補にない）、株式会社ホテルアルファーワン・ディベロップメント（同2.45％、候補にない）。株式会社日本カストディ銀行（信託口）・野村證券株式会社は金融機関・名義口座のため対象外とした。
- relatedCompanies: 当社の連結子会社（エーティーエス、ピー・アール・オー、P.R.O ID、CryptoLab）と持分法適用関連会社（emotivE、ねこまた）は当社グループ自身の会社のため結ばなかった。業務提携先の株式会社MILIZE・ICCは候補にないため結ばなかった。
- terms: 用語の助言: 「DX」はデジタルトランスフォーメーション、「AI駆動開発」は生成AIを含むAI知見のあるコンサルタント及びエンジニアが生成AIを駆使してシステム開発を行うこと、「BTCアプローチ」はビジネス（業務知見）・テクノロジー・クリエイティブの３つの専門集団を三位一体で提供する仕組み、「テクパス」はエーティーエスの人材マッチングプラットフォーム、「APNアドバンストティアサービスパートナー」はAWSのパートナープログラムにおける認定区分です。

## 要確認（status に反映）

- businessModel: [object Object]
- businessStructure: [object Object]
- businessStructure: [object Object]

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
