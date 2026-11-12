# 株式会社バロックジャパンリミテッド — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社バロックジャパンリミテッド |
| 証券コード | 3548 |
| docID（データを取り出した文書） | `S100Y6V9` |
| 原本 docID | `S100Y6V9` |
| 提出日（原本） | 2026-05-28 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6V9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社バロックジャパンリミテッド / 3548 / docID S100Y6V9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
baroque-japan: 10 件の数値を有報XBRLと照合
有報: 株式会社バロックジャパンリミテッド 有価証券報告書－第27期(2025/03/01－2026/02/28) (docID S100Y6V9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
baroque-japan: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本有報の金額は百万円単位で印字されており、千円単位からの換算は行っていない。地域ごとの売上高（日本50,156百万円、中国（香港含む）142百万円、アメリカ1,200百万円）の合計は連結売上高51,499百万円と一致する（構成比は一致しない箇所があるが印字どおり）。
- businessModel: 証拠パックの警告（本文に遡及適用の記載）については、主要な経営指標等の注記（注1〜4）に遡及修正の記載はなく、前期有報との照合でも6系列×4行すべて差異ゼロであったため、financialNotesは付けず、本警告に記録するにとどめた。
- businessModel: 重要な後発事象として印字された資本準備金の額の減少（2026年1月14日取締役会決議、2026年5月27日株主総会承認・効力発生、資本準備金2,990百万円をその他資本剰余金へ振替）は配当財源に関する資本政策であり、グループ構成に変更はないためwarningsにとどめた。
- businessModel: 2025年10月の株式会社バロックトレーディング設立と2025年12月のDB Capital Limited設立はいずれも当連結会計年度中の出来事であり、当連結会計年度末のグループ構成に反映されている。
- businessModel: 新中期経営計画2027-2028に数値目標の印字はないため、strategyには定性的な方針のみを転記した。経営方針中の「売上高100億円超の新規ブランドの開発」は目標の印字として warnings に記録するにとどめ、本文には要約として記載した。
- businessStructure: 当社グループは衣料品等の企画販売事業を単一の報告セグメントとしており、事業区分ごとの外部売上高は開示されていないため、子事業には金額を記載していない。地域ごとの売上高（日本50,156百万円、中国（香港含む）142百万円、アメリカ1,200百万円）は関連情報の開示であり、事業構造ではなく事業モデルと業界ポジションの根拠とした。
- businessStructure: 連結子会社4社（BAROQUE HK LIMITED、巴羅克(上海)貿易有限公司、BAROQUE USA LIMITED、株式会社バロックトレーディング）は仕入・品質管理・北米販売・酒販を担う機能子会社であり、独立した事業区分としては記載していない。
- history: 沿革に印字された設立時・増資時の資本金額は、禁止される財務金額に当たるため転記していない。
- history: 登記上の存続会社（旧有限会社AKLOサービス・ナイン）は実質的に休眠状態であったため、沿革は実質上の存続会社である株式会社フェイクデリックの設立（2000年）を起点とした。
- history: 中国合弁会社の株式譲渡は2025年5月に完了し、当連結会計年度末のグループ構成に反映済みであるため、needsReviewではなく沿革とwarningsに記録した。
- industry: 主たる業界は retail とした。衣料・服飾雑貨の企画も行うSPAであるが、収益の中核は直営店舗・FC店舗・百貨店・自社ECを通じた消費者への販売であり、閉じた集合においてアパレル小売に当たる区分は retail である（look-holdings の先例）。
- relatedCompanies: BELLE INTERNATIONAL HOLDINGS LIMITED及びその100％子会社MUTUAL CROWN LIMITEDは当社株式の20.11％を保有するその他の関係会社・主要株主であるが、外国会社であり関連候補に含まれずEDINETコードリストでも確認できないため結んでいない（事実は本warningsに記録）。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）・日本カストディ銀行（信託口・信託E口）は信託口であり結ばない。村井資本株式会社（7.17％）は非上場で関連候補に含まれないため結んでいない。
- relatedCompanies: 株式の保有状況は「該当事項なし」であり、特定投資株式に基づく関連付けはない。主要な顧客ごとの情報でも売上高の10％以上を占める相手先はない。
- relatedCompanies: 関連候補のうち land（ブランドの文字列）、en（ENFÖLD）、career（キャリアウーマン）、port（インポート）、tokyu（東急プラザ表参道）、aeon-mall（イオンモール＝店舗立地の例示、コードリストにもない）、core、like、ray、seki、daiwa（大和証券＝常任代理人）、itsumo、path、taya、trust（信託口）は一般語・部分一致の誤検出であり、いずれも取引・提携・資本関係の印字はないため結んでいない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

- businessModel: 2026年3月に当社の100％子会社として株式会社バロックサステナブルを設立した（沿革に印字）。本登録は2026年2月28日時点のグループ構成（当社及び連結子会社4社）で行う。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
