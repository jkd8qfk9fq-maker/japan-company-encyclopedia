# 森六 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 森六株式会社 |
| 証券コード | 4249 |
| docID（データを取り出した文書） | `S100YE00` |
| 原本 docID | `S100YE00` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE00.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 森六株式会社 / 4249 / docID S100YE00（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
moriroku: 10 件の数値を有報XBRLと照合
有報: 森六株式会社 有価証券報告書－第111期(2025/04/01－2026/03/31) (docID S100YE00)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
moriroku: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの機械警告（本文に財務諸表の組替えの記載あり）について： 該当する記載は、報告セグメントの管理費用等の配分方法の見直しに伴い前連結会計年度のセグメント情報を変更後の方法で作成したことと、地域ごとの有形固定資産の表示区分の変更に伴い前連結会計年度の表示を組み替えたことであり、修正再表示チェックは前期有報と全行一致し、売上高・当期純利益への影響はないため、financialNotes に記録しました。
- businessModel: 2026年4月1日に実行したレゾナックのモビリティ事業一部の譲受に必要な資金は、2026年3月27日に締結したシンジケートローンで調達しています（重要な後発事象）。企業結合と一体の資金調達のため needsReview の企業結合の件で併せて確認できるよう、ここにも記録します。本文には書いていません。
- businessModel: 前連結会計年度（2025年3月期）に当期純損失となった理由（メキシコ子会社の譲渡に伴う損失や減損損失の計上）は、本文の財務数値の規則のため本文には書いていません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順としました。セグメント利益は規則により記載していません。
- businessStructure: 樹脂加工製品事業の children は【事業の内容】の主要製品の区分に、ケミカル事業の children は分野別主要取扱商品に基づきます。いずれも金額が独立して開示されていないため、金額は書かず、その旨を各 children に明記しました。
- history: 沿革表の末尾付近（2021年2月／2022年4月）は、年月と事象が分かれて印字された崩れた表でした。年月が2件・事象が2件で数が一致するため、行順で対応づけました（2021年2月＝Moriroku Chemicals India Pvt. Ltd.のインド設立はケミカル事業の細目のため沿革には採用せず、2022年4月＝プライム市場移行のみを採用）。
- history: 1916年の設立時の資本金額は、本文の財務数値の規則のため記載していません。
- history: 支店・営業所・駐在員事務所の設置などの細目は省略しました。
- industry: 主たる業界は、外部顧客への売上高の約８割を占める樹脂加工製品事業（自動車用樹脂部品の製造・販売）に基づき automotive としました。
- industry: ケミカル事業は、化学品の販売・輸出入と合成樹脂加工製品の製造で金額が独立して開示されているため、chemicals を２つ目に付けました。
- industry: ケミカル事業の取扱分野には半導体材料が含まれますが、独立した事業区分として金額が開示されていないため、semiconductors は付けていません。
- relatedCompanies: レゾナック： 2025年9月にモビリティ事業の一部の譲受を決定し、2026年4月1日に株式取得を実行した相手ですが、related-candidates.json に含まれていないため結んでいません。事業譲受の件は businessModel の needsReview に記録しました。
- relatedCompanies: 阿波銀行（the-awa-bank）: 2026年3月31日現在で発行済株式（自己株式を除く）の3.66％を保有する大株主ですが、銀行であり、特定投資株式の保有目的も資金調達等の金融取引であるため結んでいません。
- relatedCompanies: エン（en）: ambiguous で、「エン」などの一般語・部分一致の誤マッチです。同社との取引・提携の印字がないため結んでいません。
- relatedCompanies: ナック（nac）: 「レゾナック」の部分一致で、株式会社ナックとは無関係のため結んでいません。
- relatedCompanies: ポート（port）: 「ポートフォリオ」の部分一致で、ポート株式会社との関係の印字がないため結んでいません。
- relatedCompanies: ビジョン（vision）: 自社の長期ビジョンの文言の一致で、株式会社ビジョンとの関係の印字がないため結んでいません。
- relatedCompanies: イノベーション（innovation）: 「オープンイノベーション」の一般語の一致で、株式会社イノベーションとの関係の印字がないため結んでいません。
- relatedCompanies: セキ（seki）: ambiguous で、部分一致の誤マッチです。セキ株式会社との関係の印字がないため結んでいません。
- relatedCompanies: キャリア（career）: 「キャリア採用」の一般語の一致で、株式会社キャリアとの関係の印字がないため結んでいません。
- relatedCompanies: ステップ（step）: 一般語の一致で、株式会社ステップとの関係の印字がないため結んでいません。
- relatedCompanies: ベース（base-4481）: 一般語の一致で、ベース株式会社との関係の印字がないため結んでいません。
- relatedCompanies: カバー（cover）: 一般語の一致で、カバー株式会社との関係の印字がないため結んでいません。
- relatedCompanies: フリー（freee）: 一般語の一致で、フリー株式会社との関係の印字がないため結んでいません。
- relatedCompanies: レック（lec）: 部分一致の誤マッチで、レック株式会社との取引・提携の印字がないため結んでいません。
- relatedCompanies: イオン（aeon）: イオン交換などの一般語句との一致で、イオン株式会社との取引・提携の印字がないため結んでいません。
- relatedCompanies: コア（core）: ambiguous で、一般語の一致のため結んでいません。
- relatedCompanies: リックス（rix）: 「マトリックス」などの部分一致で、リックス株式会社との取引・提携の印字がないため結んでいません。
- relatedCompanies: 船場（semba）: ambiguous で、部分一致の誤マッチのため結んでいません。
- relatedCompanies: スペース（space）: 一般語の一致で、株式会社スペースとの関係の印字がないため結んでいません。
- relatedCompanies: 田谷（taya）: ambiguous で、部分一致の誤マッチのため結んでいません。
- relatedCompanies: トラスト（trust）: 「信託」などの一般語の一致で、株式会社トラストとの関係の印字がないため結んでいません。
- terms: 用語候補： 加飾（樹脂部品の表面に木目調・金属調などの意匠を施すこと）、樹脂化（金属部品を樹脂製に置き換えること）、多層フィルム（複数の樹脂素材を組み合わせた機能性フィルムで、四国化工が製造します）——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: 2026年4月1日（決算期後）に、株式会社レゾナックのモビリティ事業の一部を譲り受けるため、同社が新たに設立した成形部材分割準備株式会社（現 森六ReNova株式会社）と、その子会社２社（現 森六モビリティプロダクツ株式会社、Moriroku Mobility Products (Thailand) Co., Ltd.）の株式取得を実行し、連結子会社としました。取得の対価は現金17,200百万円ですが、価格調整が完了しておらず、取得原価は現時点で確定していません。本登録の事業構成・関係会社は2026年3月期（取得前）の区分に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
