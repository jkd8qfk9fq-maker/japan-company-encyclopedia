# 物語コーポレーション — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社物語コーポレーション |
| 証券コード | 3097 |
| docID（データを取り出した文書） | `S100Z3ME` |
| 原本 docID | `S100Z3ME` |
| 提出日（原本） | 2026-09-24 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3ME.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社物語コーポレーション / 3097 / docID S100Z3ME（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-monogatari: 10 件の数値を有報XBRLと照合
有報: 株式会社物語コーポレーション 有価証券報告書－第57期(2025/07/01－2026/06/30) (docID S100Z3ME)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
the-monogatari: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: brief.md の注意（本文に財務諸表の組替えの記載がある）について: 修正再表示チェックでは前期有報との重複年度は全て一致し、差異はありませんでした。決算期の変更や変則決算もありません。開示上の再編として確認できたのは、MD&Aに印字された販売実績カテゴリーの再編（2026年6月期から7部門を6カテゴリーへ）であり、これを financialNotes に記録しました。除外対象の金額は書いていません。
- businessModel: 連結の従業員数2,347人は主要な経営指標の印字（第57期）によります。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」で、提出後の後発文書も evidence pack の otherFilingsInWindow が空（2026-11-08まで確認済み）のため、予定事項の needsReview はありません。
- businessStructure: name は表紙の「株式会社物語コーポレーション」から「株式会社」を除きました。listings の市場区分は表紙の印字（東京証券取引所プライム市場）どおりです。shortNameEn は省略しました。
- businessStructure: 飲食事業の単一セグメントで、【関連情報】の製品及びサービスごとの情報も開示省略（単一区分が売上の90％超）のため、children はMD&Aのカテゴリー別販売実績（2026年6月期）を使い、販売実績の大きい順に並べました。焼肉・ゆず庵・ラーメン・専門店・新業態の4カテゴリーは直営店の販売実績、海外とフランチャイズはカテゴリー全体の販売実績で、合計は連結売上高151,689百万円と一致します。
- businessStructure: カテゴリーは2026年6月期から従来の7部門を6カテゴリーに再編した新しい区分です（businessModel の financialNotes にも記録）。
- history: 沿革表は年月セルと事象文が分かれて印字される崩れた形でした。1989年2月の次に年月セルが2つ（1990年12月・1995年12月）続けて印字され、事象文も2件（『魚貝三昧 げん屋』開店・『焼肉一番カルビ』1号店開店）あるため、数が一致するので行順に対応づけました。
- history: 設立時の資本金500万円は財務数値のため沿革に書いていません。
- industry: 外食事業が売上の全てを占める単一セグメントです。閉じた分類に外食専用の区分がないため、外食運営会社の前例（ロイヤルホールディングス等）に倣い食品（food）を主たる業界としました。
- relatedCompanies: ワルツ株式会社: 『継続的売買基本契約書』で当社の直営店舗・フランチャイズ加盟店舗へ商品を継続的に売り渡す仕入先ですが、related-candidates.json の候補に無く非上場のため結びませんでした。
- relatedCompanies: 株式会社三菱ＵＦＪフィナンシャル・グループ: 特定投資株式として保有していますが、保有目的は取引金融機関としての関係であり、金融機関との資金調達の関係は結ばないため対象外としました。三菱ＵＦＪ銀行との金銭消費貸借契約も資金調達のため結んでいません。
- relatedCompanies: フィリピンのSPICE MONOGATARI FOOD CORP.とシンガポールのRORO RICE PTE. LTD.: エリアフランチャイズ契約の相手方ですが、非上場で候補リストにも無いため結びませんでした。
- relatedCompanies: 株式会社ランド: 「ブランド」の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社ビジョン: 「長期経営ビジョン」の誤マッチのため結びませんでした。
- relatedCompanies: エン株式会社: 「成長エンジン」など一般語の誤マッチ（ambiguous）のため結びませんでした。
- relatedCompanies: セキ株式会社: 「情報セキュリティ」など一般語の誤マッチ（ambiguous）のため結びませんでした。
- relatedCompanies: 株式会社コア: 「Cスコア」など一般語の誤マッチ（ambiguous）のため結びませんでした。
- relatedCompanies: 株式会社平和: 加盟店名一覧の「平和ダイニング」等の誤マッチ（ambiguous）で、株式会社平和との取引・資本関係の記載がないため結びませんでした。
- relatedCompanies: 株式会社ゼロ: 「2050年ネットゼロ」の誤マッチ（ambiguous）のため結びませんでした。
- relatedCompanies: 株式会社キャリア: 「キャリアアップ」の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社イノベーション: 「イノベーション創出」の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社日新: listing が「（コードリストにない）」で、新株予約権等の文脈の誤マッチ（ambiguous）のため結びませんでした。
- relatedCompanies: コタ株式会社: 店舗名一覧の誤マッチ（ambiguous）のため結びませんでした。
- relatedCompanies: カバー株式会社: 「保険によるカバー」の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社フレンドリー: 「フレンドリーなサービス」の誤マッチで、listing も「（コードリストにない）」のため結びませんでした。
- relatedCompanies: イシン株式会社: TCFDシナリオの参照機関名の誤マッチのため結びませんでした。
- relatedCompanies: ポート株式会社: 「ポートフォリオ」の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社トラスト: 日本マスタートラスト信託銀行（信託口）の誤マッチのため結びませんでした。信託銀行の信託口は結びません。
- relatedCompanies: ベース株式会社: 「実質ベース」の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社レイ: 「レインボー認定」の誤マッチ（ambiguous）のため結びませんでした。
- relatedCompanies: リックス株式会社: 一般語の誤マッチのため結びませんでした。
- relatedCompanies: 株式会社山王: 店舗名「ゆず庵 名古屋山王店」の地名の誤マッチ（ambiguous）のため結びませんでした。
- relatedCompanies: シンポ株式会社: listing が「（コードリストにない）」で、当事業年度中に全株を売却済みの相手であり、現在の関係がないため結びませんでした。
- relatedCompanies: 連結子会社12社はすべて非上場のため結びませんでした（関係は【関係会社の状況】の印字どおりで、エントリーの対象外）。
- terms: 用語の助言はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
