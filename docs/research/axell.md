# アクセル — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アクセル |
| 証券コード | 6730 |
| docID（データを取り出した文書） | `S100YC4Y` |
| 原本 docID | `S100YC4Y` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC4Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アクセル / 6730 / docID S100YC4Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
axell: 10 件の数値を有報XBRLと照合
有報: 株式会社アクセル 有価証券報告書－第31期(2025/04/01－2026/03/31) (docID S100YC4Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
axell: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記（第27期の潜在株式調整後1株当たり当期純利益を記載していない理由）は表示に関する事項のため financialNotes には入れなかった。会計基準の変更や変則決算の注記は無く、financialNotes は空である。なお、1株当たりの数値そのものは本文にも書いていない。
- businessModel: bootstrap の財務諸表の組替えに関する注意について: 前期有報との指標の照合は6系列すべて差異ゼロであり、組替えは連結財務諸表の表示に関するものと判断した。指標に影響する組替えの印字は確認できなかったため、financialNotes には入れず warnings に記録する。
- businessModel: 報告セグメントの名称変更（LSI開発販売関連→LSI事業、新規事業関連→AI事業）は名称のみの変更でセグメント情報への影響はない旨が印字されており、会計方針の変更ではないため financialNotes には入れなかった。
- businessModel: MD&A の売上総利益・営業利益・経常利益等の金額と増減理由、セグメント利益、生産実績・受注高・受注残高の金額、経営上の目標（ROE10％の達成）は規則により本文・perspectives に書いていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」であり、提出後の予定事項はない。
- businessModel: Wikipedia は検索で見つからなかった（found: false）ため使用していない。
- businessModel: perspectives にはリンク記法を使っていない（w12 では perspectives はリンク表示対象外のため）。industryPosition は、順位やシェアの数値が印字されておらず、会社の自己評価は competitiveAdvantage の disclosed に要約したため省いた。
- businessStructure: 報告セグメントの名称は当期より「LSI開発販売関連」から「LSI事業」に、「新規事業関連」から「AI事業」に変更された（名称変更のみでセグメント情報への影響はない旨が印字されている）。前期のセグメント情報も変更後の区分・名称で開示されているため、本登録は変更後の名称で統一した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（LSI事業13,793百万円、AI事業862百万円）とした。
- businessStructure: 主要な設備は本社（東京都千代田区）のみで、設備の表にセグメント名の記載がないため、特定の事業には結びつけなかった。帳簿価額は書いていない。
- businessStructure: 旧スキーマのため suppliers キーは省略した。製造はファブレス型で、経営上の重要な契約を締結している製造委託先がある旨が事業等のリスク等に印字されている（相手先名は印字されていない）。販売は販売代理店（緑屋電気株式会社など）を通じる構造で、事実は businessModel と relatedCompanies の warnings に記録した。
- history: 沿革から落とした行: 本店移転（2001年飯田橋、2006年外神田）、ISO9001認証の取得・更新（2005年、2009年、2017年）、サウンド機能等と統合したグラフィックスLSIの販売開始（2008年）、パソコン系グラフィックスLSIの販売開始（2009年）、株式会社ニューゾーンの設立（2010年）と清算結了（2015年）、株式会社VIPPOOLの設立（2018年）と清算結了（2022年）、bitcraft株式会社の吸収合併（2020年。株式取得の項目に記載）、モーションポートレート株式会社の吸収合併（2022年。株式取得の項目に記載）、東京証券取引所の市場区分見直しによるスタンダード市場への移行（2022年。機械的な市場再表示のため）。
- history: 年月は有報の印字どおり年だけを用い、月は書いていない。資本金の金額は書いていない。
- industry: 主たる業界は semiconductors とした。売上の大半を占めるLSI事業はパチンコ・パチスロ機向けグラフィックスLSIやメモリモジュール等の半導体製品の開発販売であり、半導体そのものの設計・開発を行う事業であるため直接合う。
- industry: 副次的に it を付けた。報告セグメント「AI事業」は外部顧客への売上高862百万円が独立して開示されており、AIフレームワーク等のソフトウェア製品とソリューション提供を含むためである。AI事業には組み込み機器向けLSIやセキュリティ製品も含まれるが、セグメント単位の開示に基づき1つの業界のみを付けた。
- industry: electronics は付けなかった。主力は半導体（LSI）の設計・開発販売そのものであり、semiconductors が直接合うためである。
- relatedCompanies: kaga-electronics（加賀電子）: 主要な顧客ごとの情報に印字される主要な顧客のため customer とした。説明文には金額を書いていない。
- relatedCompanies: celsys（セルシス）・aval-data（アバールデータ）: 特定投資株式の保有目的のうち後段が個別の協力関係（セルシスは資本業務提携とAI領域での共同開発、アバールデータは組み込み機器市場向け製品での協力関係）を印字しており、全銘柄共通の定型句だけではないため business-partner とした。両社とも当社の大株主である事実も説明に含めた。
- relatedCompanies: shinko-shoji（新光商事）・okaya-and-co（岡谷鋼機）: 特定投資株式の保有目的の後段が個別の協力関係（新光商事はLSI製品での協力関係、岡谷鋼機はグループ企業が当社LSI製品の販売代理店であること）を印字しているため business-partner とした。
- relatedCompanies: nihon-enterprise（日本エンタープライズ）: 大株主の状況に載る事業会社（2.10％、2026年3月31日現在）であり、4区分のいずれにも当たらないため major-shareholder とした。
- relatedCompanies: port（ポート）: 「モーションポートレート」等の部分一致のみで、正式名称での取引・提携の印字がないため結ばなかった。
- relatedCompanies: seki（セキ）: ambiguous で、「セキュリティ」等の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「新規販売ベース」等の一般語の一致のみのため結ばなかった。
- relatedCompanies: suzuki-6785（鈴木）: ambiguous で、役員個人の姓の一致のみのため結ばなかった。
- relatedCompanies: trust（トラスト）: コードリストにない相手で、日本マスタートラスト信託銀行（信託口）の名称の部分一致である。信託口の純投資のため結ばなかった。
- relatedCompanies: core（コア）: ambiguous で、「コア・コンピタンス」の一般語の一致のみのため結ばなかった。
- relatedCompanies: fujitsu（富士通）: 沿革に印字される共同出資の相手は富士通デバイス株式会社（現NVデバイス株式会社）であり、候補の富士通株式会社とは別の法人のため結ばなかった（親会社への読み替えはしない）。
- relatedCompanies: nissin（日新）: コードリストにない相手で、新株予約権の記載中の部分一致のみのため結ばなかった。
- relatedCompanies: rhythm（リズム）: 事業等のリスクの文章中の一般語の一致のみのため結ばなかった。
- relatedCompanies: space（スペース）: 「本社執務スペース」の一般語の一致のみのため結ばなかった。
- relatedCompanies: 候補にない相手: 緑屋電気株式会社は最大の大株主（8.99％、2026年3月31日現在）であり、主要な顧客かつ2000年から販売代理店契約を結ぶ相手だが、上場候補にないため結ばず、事実は businessModel と本 warnings に記録した。加賀FEI株式会社は主要な顧客だが加賀電子株式会社とは別の法人であり候補にないため結ばなかった（親会社への読み替えはしない）。Semiconductor Components Industries, LLC 及び ON Semiconductor Trading Sàrl はLEDドライバLSI製品の長期供給契約の相手だが外国法人で候補にないため結ばなかった。アイリア株式会社とaimRage株式会社は当社の連結子会社のため結ばなかった。
- terms: 助言のみ。用語の追加提案: グラフィックスLSI（液晶表示装置等に表示を行うためのLSI）、アイリアSDK（当社が自社開発したAIフレームワーク）、AXIPシリーズ（ゲーム開発向けミドルウェア製品）、メモリモジュール（画像データを保持するLSIが組み込まれた基板）、マイニングハードウェア（暗号資産のマイニングに使う計算装置）、ファブレス（自社工場を持たず製造を外部に委託する事業形態）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
