# エステールホールディングス — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | エステールホールディングス株式会社 |
| 証券コード | 7872 |
| docID（データを取り出した文書） | `S100YLKC` |
| 原本 docID | `S100YLKC` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLKC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | エステールホールディングス株式会社 / 7872 / docID S100YLKC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
estelle-holdings: 10 件の数値を有報XBRLと照合
有報: エステールホールディングス株式会社 有価証券報告書－第68期(2025/04/01－2026/03/31) (docID S100YLKC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
estelle-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はセグメント注記と経営指標等の百万円単位の印字に合わせ、百万円表記で統一した。MD&Aの「338億90百万円」などの表記は使わなかった。
- businessModel: 誤謬の訂正の事実（指標の注記4）は financialNotes に記録した。当期の有報自体は訂正有報ではなく、前期有報との修正再表示チェックでも全系列に差異がなかったため、needsReview にはしなかった。
- businessModel: 減損損失などの特別損失の内訳や、営業利益・経常利益の金額・増減率は、本文に書ける財務数値の対象外のため書かなかった。
- businessModel: As-meエステール株式会社など子会社の債務超過の事実は、子会社自身の財政状態に関する注記であり金額も対象外のため、本文には書かなかった。
- businessModel: 仕入先については事業の内容に一般名詞の印字も特定の仕入先企業の印字もないため、suppliers は省略した（本ツリーのスキーマには suppliers キーがない）。
- businessModel: Wikipedia「As-meエステール」を確認したが、登録に必要な事実は有報で足りるため出典には使わなかった。
- businessStructure: 谷口ジュエル株式会社は事業活動を休止していると【事業の内容】と【関係会社の状況】が注記しているため、宝飾品事業の担い手には含めなかった。
- businessStructure: 株式会社賛光は【事業の内容】の子会社一覧に名があるが、【関係会社の状況】の一覧になく事業内容の印字もないため、特定の事業への割当てはしなかった。
- businessStructure: As-meエステール株式会社の単体の売上高などの損益情報は、本文に書ける財務数値の対象外のため記載しなかった。
- history: 沿革の年月と事象は対応して印字されており、表の崩れはなかった。
- history: 1959年の設立時の資本金など、資本金額は沿革に書かなかった。
- history: 1946年9月に設立された形式上の存続会社（旧・東北土建工業株式会社）の経緯は、1973年の吸収合併の行に集約した。
- history: 次の行は主要な転機に絞るため省いた：2001年サイゴンパール設立、2003年本社移転、2005年谷口ジュエル子会社化、2006年サイゴンオプティカル設立、2010年本社移転、2012年愛思徳（杭州）珠宝設立、2014年BLOOMへの商号変更とエステールカンボジア設立、2017年ハリー ＆ CO.設立、2018年コンセプトアイウェアマニュファクチャーベトナム設立、2022年株式会社賛光設立。
- industry: 眼鏡事業と食品販売・飲食店事業も店舗での小売の形態であり、retail の読みに含めた。金額が独立して開示されていない事業はない。
- relatedCompanies: orient（株式会社オリエントコーポレーション）：【大株主の状況】に1.29％の保有が載るが、金融事業会社であり、取引・提携の印字がないため結ばなかった。
- relatedCompanies: ZODIAC-JRD-MKJ LTD：インドの旧関連会社で、持分比率の低下により当社が特定投資株式として保有する（保有目的は商品情報の共有などと印字）が、上場会社ではなく候補にもないため結ばなかった。
- relatedCompanies: 株式会社桑山：【大株主の状況】に7.34％の保有が載る事業会社だが、非上場で候補にないため結ばなかった。
- relatedCompanies: 東京貴宝株式会社：【大株主の状況】に1.62％の保有が載るが、非上場で候補にないため結ばなかった。
- relatedCompanies: 株式会社雅コーポレーション（33.90％）と有限会社英（2.19％）：大株主だが非上場で候補にないため結ばなかった。
- relatedCompanies: s-t（エステー）：社名の一部が当社名と一致するだけの機械抽出で、当社との関係を述べる記載はないため結ばなかった。
- relatedCompanies: base-4481、innovation、port、land、corona、seki：一般語（営業利益ベース、イノベーション、サポート、ブランド、新型コロナウイルス、セキュリティ）への一致で、関係の記載はないため結ばなかった。
- relatedCompanies: suzuki-6785、zero：役員の氏名および「ゼロとして算定」の語句への一致で、関係の記載はないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として3件を提案した。いずれも有報本文に現れる当社事業・沿革固有の語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] エステールホールディングスの宝飾品事業（ジュエリーの製造・販売）の業界 → 提案: 宝飾品（jewelry）。宝飾品の製造販売が外部顧客への売上高33,890百万円のうち27,498百万円を占める中心事業ですが、閉じた業界分類には宝飾品・ジュエリーを表す区分がありません。売上は直営店舗での販売が中心のため、最も近い retail を暫定の主業種としました（株式会社ツツミの前例と同種の不足です）。
