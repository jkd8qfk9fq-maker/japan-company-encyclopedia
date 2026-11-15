# シグマ光機 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | シグマ光機株式会社 |
| 証券コード | 7713 |
| docID（データを取り出した文書） | `S100YXKH` |
| 原本 docID | `S100YXKH` |
| 提出日（原本） | 2026-08-24 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YXKH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | シグマ光機株式会社 / 7713 / docID S100YXKH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sigmakoki: 10 件の数値を有報XBRLと照合
有報: シグマ光機株式会社 有価証券報告書－第51期(2025/06/01－2026/05/31) (docID S100YXKH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sigmakoki: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes: 連結経営指標等の注記は、潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していないという表示事項のみで、会計基準の変更・表示方法の変更・決算期変更などの事実は無いため、financialNotes は空にしました。
- businessModel: 経営方針の「経営上の目標の達成状況を判断するための客観的な指標等」（売上高・親会社株主に帰属する当期純利益・ROE・PBR等への言及）は経営指標に関する記述であるため、数値目標として本文や戦略には書いていません。
- businessModel: セグメント利益、その他の中間的な利益指標の金額は書いていません（売上高と親会社株主に帰属する当期純利益のみ）。MD&Aのセグメント別売上高はセグメント間の内部売上高を含む数値のため使わず、セグメント情報の外部顧客への売上高を用いました。
- businessModel: suppliers はこのツリーの旧スキーマのため省略しました。個別に印字された仕入先はありません。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」でした。継続企業の前提に関する注記・リスク記載もありません。
- businessModel: 特定投資株式の注記にある株式会社CCIグループ（2025年10月1日付で1株を10株に分割）と株式会社武蔵野銀行（2026年4月1日付で1株を3株に分割）の株式分割は、いずれも保有先企業の分割であり当社の分割ではないため、needsReview には入れていません。
- businessModel: 連結子会社OptoSigma Corporationの主要な損益情報等（売上高1,965百万円等）は同社の単体数値であり、グループの数値ではないため本文には書いていません。
- businessStructure: セグメント別売上高は、セグメント情報の外部顧客への売上高（要素部品事業9,808,274千円、システム製品事業1,631,160千円）を千円から百万円へ切り捨てて記載しました。合計は連結売上高11,439百万円と一致します。MD&Aのセグメント別売上高は内部売上高を含むため使っていません。
- businessStructure: セグメント利益は書いていません。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略しました。個別に印字された仕入先はありません。
- businessStructure: グループは当社、子会社6社（OptoSigma Corporation、OptoSigma Europe S.A.S.、OptoSigma Southeast Asia Pte. Ltd.、OptoSigma Germany GmbH、上海西格瑪光机有限公司、上海西格瑪総合国際貿易有限公司）及び関連会社2社（LMS株式会社、タックコート株式会社）で構成されています。タックコート株式会社は光学素子・薄膜製品の生産を担う持分法適用関連会社です。
- history: 沿革のうち、本社・工場の移転・増設（1982年・1990年・1997年・2007年・2020年・2023年・2024年）、営業所の開設・移転・改組（1986年・1992年・1994年・2007年・2007年）、技術センターの開設・統合（1993年・1995年）、上海工場の完成・増設（1998年・2005年）、米国子会社の社屋移転（2010年）、ISO認証の取得・再認証（2000年-2017年）、東京本社ビルの取得・開設（2001年・2002年）、組織改組（2017年）などは、会社の転機となる出来事に絞るため省きました。
- history: 資本金の金額（設立時の資本金、1996年・2001年の増資後の資本金）は沿革に書いていません。
- history: 2025年はOptoSigma Germany GmbHの設立（4月）と上海西格瑪総合国際貿易有限公司の設立（10月）の2件を、年単位の形式に合わせて1項目にまとめました。
- industry: 主たる業界は、レーザ用精密光学部品・光学機器装置の製造販売（精密機器）であることから machinery としました。要素部品事業とシステム製品事業はいずれも同じ光学機器の領域であり、直接合うため2つ目の業界は付けていません。
- relatedCompanies: hamamatsu-photonics: 大株主の状況に筆頭株主（発行済株式総数に対する所有割合14.11％）として印字され、当社の取締役・監査役には同社の出身者・現任の執行役員が含まれますが、関係会社の状況への記載はなく、取引・提携・資本関係を述べる記載も有報に無いため結びませんでした。
- relatedCompanies: hikari-tsushin: 大株主の状況に印字されているのは「光通信KK投資事業有限責任組合」という投資事業有限責任組合であり、株式会社光通信とは別の法人のため結びませんでした。
- relatedCompanies: the-musashino-bank / mizuho-financial-group / resona-holdings / sumitomo-mitsui-financial-group / cci-group: 特定投資株式として保有していますが、保有目的は「金融取引関係の維持・強化」という金融機関共通の定型文のみで、個別の取引関係を述べる記載が無いため結びませんでした。なお、CCIグループと武蔵野銀行の株式数の増加は両社の株式分割によるもので、当社の分割ではありません。
- relatedCompanies: lion: 沿革のLMS株式会社の共同出資者はライオンパワー株式会社であり、ライオン株式会社とは別の法人のため結びませんでした。LMS株式会社とタックコート株式会社は当社の持分法適用関連会社のため、関連会社として結んでいません（事業の内容・沿革に記載）。夏目光学株式会社とミナト光学工業株式会社は候補にありません。
- relatedCompanies: en / base-4481 / career / land / ray / como / core / ic / kohsoku / path / rhythm / space / vision / yamadai: 一般語・製品名・人名等への部分一致のみのため結びませんでした（ベースは製品名、リズムはプリズムの部分一致、ランドはグローバルブランドの部分一致、yamadai はコードリストにありません）。
- relatedCompanies: 当社の子会社6社と関連会社2社は、ルールにより relatedCompanies には結んでいません。
- terms: 助言のみ。本文で使った用語の候補: 光学基本機器、光学素子・薄膜、自動応用製品、光学システム製品、OptoSigma、カタログ販売（無店舗販売）、Great Reset です。
- terms: wikipedia.json は当社の記事が見つからなかった（found=false）ため、補足には使いませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
