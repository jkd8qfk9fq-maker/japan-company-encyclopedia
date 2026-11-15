# 小倉クラッチ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 小倉クラッチ株式会社 |
| 証券コード | 6408 |
| docID（データを取り出した文書） | `S100YJ6L` |
| 原本 docID | `S100YJ6L` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ6L.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E5%B0%8F%E5%80%89%E3%82%AF%E3%83%A9%E3%83%83%E3%83%81

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 小倉クラッチ株式会社 / 6408 / docID S100YJ6L（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ogura-clutch: 10 件の数値を有報XBRLと照合
有報: 小倉クラッチ株式会社 有価証券報告書－第97期(2025/04/01－2026/03/31) (docID S100YJ6L)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ogura-clutch: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、セグメント注記と連結経営指標等の百万円単位の印字どおりに転記しました。
- businessModel: 証拠パックは本文に財務諸表の組替えの記載がある旨を警告しています。地域ごとの情報では、前連結会計年度に独立掲記していたタイをアジア（中国除く）等に含める表示方法の変更と、その組替えが印字されていますが、これは表示方法の変更であるためwarningsにとどめ、financialNotesには記録しませんでした。前期有報との修正再表示チェックは全系列で一致しています。
- businessModel: 目標とする経営指標には2027年3月期の数値目標が印字されていますが、本文で書けない指標を含むため本文には転記せず、このwarningsに記録しました。
- businessModel: 調達先は、対処すべき課題とサステナビリティの記載で自社の調達について使われる一般名詞「調達先」を採りました。特定の事業への結び付けは印字されていないためbusinessIdsは付けていません。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（輸送機器用事業28,866百万円、一般産業用事業12,308百万円）とし、報告セグメントに含まれない「その他」（490百万円）を最後に置きました。
- businessStructure: 連結子会社11社は事業の内容で輸送機器用事業または一般産業用事業関連の外注加工または製造販売を行うとされており、グループ会社であるため関連企業リンクには含めていません。
- history: 沿革は年月と事象が対応して印字されており、年だけを採り月は行に含めていません。創業時の資本金額など、金額は沿革に書いていません。
- history: 2024年7月の小倉離合機（無錫）有限公司の小倉離合機（長興）有限公司への吸収合併は、同じ2024年の出来事として東洋クラッチの吸収合併の行に集約せず、ここに記録しました。当期中に完了し期末の構成に反映された出来事であるためneedsReviewには入れていません。
- history: Wikipediaの補足はモータースポーツ用クラッチの略称ORCだけに使い、数値は使っていません。
- industry: 主たる業界は、外部顧客への売上高が最も大きい報告セグメントである輸送機器用事業（自動車用部品業界向け）が大半を占めることからautomotiveとしました。
- industry: 一般産業用事業はモーター、変・減速機、昇降・運搬機械業界等向けのクラッチ・ブレーキ等の機械部品事業であるため、2つ目にmachineryを付けました。合う値が無い業界はなく、taxonomyGapsはありません。
- relatedCompanies: ステップ（step）: 収益認識の5ステップアプローチという普通名詞の一致で、株式会社ステップへの言及ではありません。
- relatedCompanies: ランド（land）: タイランド等の文字列の一致で、株式会社ランドへの言及ではありません。
- relatedCompanies: レイ（ray）: ambiguousであり、カーエアコン等の文字列の一致で、株式会社レイへの言及ではありません。
- relatedCompanies: 群馬銀行（the-gunma-bank）: 大株主であり取引銀行ですが、銀行であり、保有目的は円滑な資金調達のための関係維持です。資金調達を理由とする銀行は結びません。
- relatedCompanies: 東和銀行（the-towa-bank）: 大株主であり取引銀行ですが、銀行であり、保有目的は円滑な資金調達のための関係維持です。資金調達を理由とする銀行は結びません。
- relatedCompanies: トルク（torq）: トルクカップリング等の普通名詞の一致で、トルク株式会社への言及ではありません。
- relatedCompanies: コタ（cota）: ambiguousであり、インコタームズの文字列の一致で、コタ株式会社への言及ではありません。
- relatedCompanies: エン（en）: ambiguousであり、エンゲージメント等の普通名詞の一致で、エン株式会社への言及ではありません。
- relatedCompanies: ベース（base-4481）: 利益ベース等の普通名詞の一致で、ベース株式会社への言及ではありません。
- relatedCompanies: セキ（seki）: ambiguousであり、セキュリティ等の文字列の一致で、セキ株式会社への言及ではありません。
- relatedCompanies: ゼロ（zero）: ambiguousであり、ゼロエミッションという普通名詞の一致で、株式会社ゼロへの言及ではありません。
- relatedCompanies: ディスコ（disco）: ディスコネクト用ソレノイドの文字列の一致で、株式会社ディスコへの言及ではありません。
- relatedCompanies: 兼松（kanematsu）: 当事業年度に全株式を売却済みであり、前事業年度の保有目的も営業取引関係の維持・発展という定型的な記述のみで、現在の関係を裏付ける個別の取引の記述がありません。
- relatedCompanies: 三菱重工業（mitsubishi-heavy-industries）: 当事業年度に全株式を売却済みであり、前事業年度の保有目的も営業取引関係の維持・発展という定型的な記述のみで、現在の関係を裏付ける個別の取引の記述がありません。
- relatedCompanies: ニデック（nidec）: 当事業年度に全株式を売却済みであり、前事業年度の保有目的も営業取引関係の維持・発展という定型的な記述のみで、現在の関係を裏付ける個別の取引の記述がありません。
- relatedCompanies: 三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）: 当事業年度に全株式を売却済みであり、保有目的も円滑な資金調達のための関係維持でした。銀行グループであり結びません。
- relatedCompanies: トヨタ自動車（toyota）: 特定投資株式の保有目的が自動車関連業界における良好な関係の維持・発展という定型的な記述のみで、同社との個別の取引・提携を述べる記述がありません。
- relatedCompanies: 当社グループの子会社は関係会社の状況に載るグループ会社であり、関連企業リンクには含めていません。
- terms: 助言: 用語「クラッチ」は、動力をつなぐ・切り離す部品の総称で、当社の輸送機器用・一般産業用製品の中核です（事業の内容に印字）。
- terms: 助言: 用語「ソレノイド」は、電磁力で動作する部品で、輸送機器用事業の製品として印字されています（事業の内容・研究開発活動に印字）。
- terms: 助言: 用語「無励磁作動ブレーキ」は、通電していないときに作動するブレーキで、一般産業用事業の主力製品として研究開発活動に印字されています。
- terms: 助言: 用語「ORC」は、モータースポーツ用クラッチのブランド名Ogura Racing Clutchの略称です（Wikipediaの補足）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
