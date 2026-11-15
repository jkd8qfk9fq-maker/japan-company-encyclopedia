# ノバック — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ノバック |
| 証券コード | 5079 |
| docID（データを取り出した文書） | `S100YSTZ` |
| 原本 docID | `S100YSTZ` |
| 提出日（原本） | 2026-07-29 |
| 決算期 | 2026-04-30 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YSTZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ノバック / 5079 / docID S100YSTZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
novac: 4 件の数値を有報XBRLと照合
有報: 株式会社ノバック 有価証券報告書－第62期(2025/05/01－2026/04/30) (docID S100YSTZ)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
すべて一致しました。
novac: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円印字を百万円に切り捨てて表記した（切り捨て convention。切り上げはしていない）。2026年4月期の売上高35,363,237千円は35,363百万円、親会社株主に帰属する当期純利益1,176,573千円は1,176百万円とした。
- businessModel: MD&Aに印字された受注高やセグメント別の増減の金額は、本文の財務数値を売上高と当期純利益に限る規則に従い、本文には書かなかった。売上高が前年同期比28.5％増となったことはMD&Aの印字どおりであるが、本文では金額のみを記載した。
- businessModel: 本ワークツリーのスキーマに suppliers のキーがないため、businessModel に suppliers は書かなかった。特定の仕入先・外注先の名称の開示はなく、外注は工事ごとの発注として説明されている。
- businessModel: financialNotes は1件のみで、同一の fiscalYear に重なる注記はないため、取りこぼしはない。
- businessModel: 新本社ビルの建設（2025年8月着手、2027年12月完成予定）と基幹システム関連の設備計画が【設備の新設、除却等の計画】に開示されているが、投資予定額は本文に書けない金額に当たるため、計画の存在のみをここに記録した。
- businessModel: 期末配当は2026年7月30日開催予定の定時株主総会の決議事項として開示されている。通常の配当手続であり、構造的な事象ではないため needsReview には入れず、ここに記録した。
- businessModel: 主要な顧客である東京都、西日本高速道路株式会社、ひめじ手柄山PFI株式会社は非上場または候補リストにないため、relatedCompanies には結ばず、顧客の名称としてのみ扱った。
- businessStructure: 事業の並びは、2026年4月期のセグメント注記の外部顧客への売上高の大きい順にした（建築工事事業24,533百万円、土木工事事業10,816百万円）。「その他（不動産賃貸事業）」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: 金額はセグメント注記の千円印字を百万円に切り捨てて表記した（切り捨て convention）。切り捨て後の事業別金額の合計と連結売上高35,363百万円との間に生じる差は切り捨てによるものである。
- businessStructure: 連結子会社の株式会社ＴＯＭＴＥＮは【関係会社の状況】で主要な事業の内容が建築工事事業と印字されているため、建築工事事業の説明に含めた。
- businessStructure: 主要な設備は大半が共通使用でセグメント別に分類されていないため、事業と拠点の対応は書かなかった。
- history: 沿革の設立時や子会社設立時の資本金の金額は、財務金額に当たるため本文には書かなかった。
- history: 営業所・支店の開設、本社移転、建設業許可の追加取得、ISO認証の取得などの細かな沿革は、会社の姿を変える出来事を優先して省いた。
- history: 2025年の株式会社ＴＯＭＴＥＮの子会社化は、2025年2月に全株式を取得した出来事として沿革の印字どおりに書いた。
- industry: 主たる業界は、2026年4月期の外部顧客への売上高のほぼ全てを占める建築工事事業と土木工事事業に合わせ、construction とした。不動産賃貸を行うその他は13百万円とごく小さいため、2つ目の業界は付けていない。
- relatedCompanies: 和田興産（wadakohsan）: 2026年4月期の主要な顧客ごとの情報に建築工事事業の顧客として載り、前期にも請負金額の大きな完成工事の発注者として現れ、期末繰越高の主な工事にも同社発注の工事がある継続的な取引のため customer として結んだ。説明文には金額を書いていない。
- relatedCompanies: エン（en）: 「エンゲージメント」などの一般語の一致（ambiguous）で、エン株式会社への言及ではないため結ばなかった。
- relatedCompanies: 高速（kohsoku）: 「高速道路会社」などの一般語の一致（ambiguous）で、株式会社高速への言及ではないため結ばなかった。
- relatedCompanies: キャリア（career）: 「キャリアアップ」などの一般語の一致で、株式会社キャリアへの言及ではないため結ばなかった。
- relatedCompanies: 平和（heiwa）: 「平和な社会」などの一般語の一致（ambiguous）で、株式会社平和への言及ではないため結ばなかった。
- relatedCompanies: ベース（base-4481）: 「営業利益ベース」などの一般語の一致で、ベース株式会社への言及ではないため結ばなかった。
- relatedCompanies: セキ（seki）: 一般語の部分一致（ambiguous）で、セキ株式会社への言及ではないため結ばなかった。
- relatedCompanies: エスコン（es-con-japan）: 期末繰越高の主な工事として、同社発注の新築工事が1件挙がるのみで、売上先としての継続的な取引関係の記述がないため結ばなかった。
- relatedCompanies: IC（ic）: 高速道路のインターチェンジ（IC）の略称の一致（ambiguous）で、株式会社ICへの言及ではないため結ばなかった。
- relatedCompanies: 丸紅（marubeni）: 言及は沿革における丸紅建設株式会社からの営業譲渡についてであり、丸紅株式会社そのものとの現在の取引や資本関係の記述がないため結ばなかった。営業譲渡は沿革の出来事として記録した。
- relatedCompanies: 三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）: 特定投資株式に載るのみで、保有目的は主要な取引金融機関としての資金調達のための取引関係の維持・強化という各銘柄共通の文言であり、資金調達が理由の金融機関のため結ばなかった。
- relatedCompanies: トマト銀行（tomato-bank）: 特定投資株式に載るのみで、保有目的は主要な取引金融機関としての資金調達のための取引関係の維持・強化という各銘柄共通の文言であり、資金調達が理由の金融機関のため結ばなかった。
- relatedCompanies: 東京都・西日本高速道路株式会社・ひめじ手柄山PFI株式会社: 2026年4月期の主要な顧客だが、非上場で候補リストにもないため結ばなかった。
- terms: 用語候補として、シールド工事（地中にトンネルを作るためシールドマシンを使用して行われる工事で、共同溝や雨水幹線に用いられます）、堰堤工事（河川や渓谷を横断して水流や土砂をせきとめる堤防を設置する工事）、元請（発注者から直接工事を請け負うこと）、監理技術者（工事現場で施工の技術上の管理を行う資格者）があります。本文ではリンク記法を使っていません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
