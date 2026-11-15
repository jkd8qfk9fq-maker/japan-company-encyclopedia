# タケダ機械 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | タケダ機械株式会社 |
| 証券コード | 6150 |
| docID（データを取り出した文書） | `S100YZ4M` |
| 原本 docID | `S100YZ4M` |
| 提出日（原本） | 2026-08-28 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YZ4M.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | タケダ機械株式会社 / 6150 / docID S100YZ4M（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
takeda-machinery: 10 件の数値を有報XBRLと照合
有報: タケダ機械株式会社 有価証券報告書－第55期(2025/06/01－2026/05/31) (docID S100YZ4M)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
takeda-machinery: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益だけです。経営方針と経営成績の分析に印字された経常利益などの金額や、目標とする経営指標である2027年5月期の事業計画の数値は、利益指標の目標のため書いていません。
- businessModel: financialNotes は空です。指標表の注（潜在株式が存在しないため潜在株式調整後の1株当たり当期純利益を記載していない旨、従業員数は就業人員数を表示している旨）は表示の事項のため、注記ではなく本warningsに記録します。
- businessModel: 製品別の金額は【セグメント情報等】の関連情報に印字された外部顧客への売上高の千円額を百万円に切り捨てて記録しました。MD&Aの品目別売上高でまとめられている「部品・サービス」は、部品583百万円とサービス118百万円に分けて印字どおりに記録しています。
- businessModel: Wikipedia（タケダ機械）は有報の事実の言い換えのみで、有報にない補足はなかったため使っていません。
- businessStructure: 単一セグメントのため、設備の状況にセグメント欄はなく、拠点と事業の対応づけはしていません。設備の帳簿価額は金額のため書いていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先の印字はありません。
- history: 沿革のうち次の行は落としました: 1971年の本社工場増設、1973年の九州・大阪・東京の各営業所開設とユニットワーカーシリーズの開始、1974年の本社工場増設、1976年のシャープカッターシリーズ開始と仙台営業所開設、1978年のコーナーシャーシリーズ開始と本社工場増設、1979年の名古屋営業所開設と営業部門の譲渡、1980年の広島営業所開設、1984年の本社工場増設、1985年の北関東営業所開設、1986年の本社総合事務所建設、1989年の平板オートボーラーシリーズ開始、1999年の環境機器シリーズ開始、2000年の株式会社タケダテクニカルの吸収合併、2006年の資本準備金及び資本金の減少、2010年と2013年の取引所統合に伴う上場先の変更。
- history: 設立時の資本金は金額のため書いていません。
- industry: DEIの別記事業は「cte」ですが、事業の実体（金属加工機械の製造販売）に合わせて machinery としました（このツリーのゲートに合わせ industryId キーで記録）。machinery は直接合う区分のため taxonomyGaps はありません。
- relatedCompanies: yamazen（株式会社山善）: 【セグメント情報等】の主要な顧客ごとの情報と販売実績の主な相手先に2期連続で正式名称で印字されているため customer として結びました。金額は説明に書いていません。
- relatedCompanies: amada（株式会社アマダ）: 2025年5月期の主要な顧客ごとの情報と、両期の販売実績の主な相手先に正式名称で印字されているため customer として結びました。なお沿革の2008年の業務提携の相手は株式会社アマダマシナリー（旧 株式会社アマダカッティング）で別の法人のため、その提携は根拠にしていません。金額は説明に書いていません。
- relatedCompanies: matsumoto（株式会社マツモト）: 有報に印字される販売先はマツモト産業株式会社で、候補の株式会社マツモトとは別の法人のため結んでいません。
- relatedCompanies: the-fukui-bank（株式会社福井銀行）: 【大株主の状況】に1.82％（2026年5月31日現在）を保有する金融機関として載りますが純投資であり、株式の保有状況には相互保有を解消した旨も印字されているため結んでいません。
- relatedCompanies: cci-group（株式会社CCIグループ）: 投資株式は全て純投資目的で保有されており、その相手との取引・提携の記述がないため結んでいません。
- relatedCompanies: hokuriku-electric-power（北陸電力株式会社）: CO2排出係数の公表元として名前が出るだけで、その相手との取引・提携・資本関係の記述がないため結んでいません。
- relatedCompanies: sharp（シャープ株式会社）: 製品名「シャープカッターシリーズ」の一部であり、企業名として印字されたものではありません。
- relatedCompanies: suzuki-6785（株式会社鈴木）: 役員の氏名（鈴木修平）の一部であり、企業との関係の記述はありません。
- relatedCompanies: freee（フリー株式会社）・seki（セキ株式会社）・slogan（スローガン株式会社）・base-4481（ベース株式会社）・en（エン株式会社）・path（パス株式会社）・port（ポート株式会社）・vision（株式会社ビジョン）: 一般語（フリー・キャッシュ・フロー、セキュリティ、スローガン、ベース、エンゲージメント、パスワード、サポート、ビジョン）の一部だけで、有報にその相手との取引・提携・資本関係の記述がないため結んでいません。
- relatedCompanies: 株式会社テーエスワイ: 【大株主の状況】の筆頭株主（12.73％、2026年5月31日現在）ですが、候補一覧（related-candidates.json）にないため結んでいません。
- terms: 用語の助言のみです。対象となりうる用語は「形鋼加工機」「丸鋸切断機」「プレス金型」などですが、本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
