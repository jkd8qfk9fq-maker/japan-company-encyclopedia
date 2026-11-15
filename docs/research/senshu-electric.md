# 泉州電業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 泉州電業株式会社 |
| 証券コード | 9824 |
| docID（データを取り出した文書） | `S100XHVV` |
| 原本 docID | `S100XHVV` |
| 提出日（原本） | 2026-01-28 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHVV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 泉州電業株式会社 / 9824 / docID S100XHVV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
senshu-electric: 10 件の数値を有報XBRLと照合
有報: 泉州電業株式会社 有価証券報告書－第76期(2024/11/01－2025/10/31) (docID S100XHVV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
senshu-electric: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載について、該当する注記はその他の包括利益に関する組替調整額であり、売上高・当期純利益の表示方法の変更ではないことを確認しました。前期有報との修正再表示チェックは重複8行すべて一致しています。
- businessModel: 重要な後発事象のうち、従業員持株会向け譲渡制限付株式インセンティブ制度の導入は2025年12月9日の取締役会決議で決まったもので、日常の資本政策のため warnings に記録し、needsReview には入れませんでした。
- businessModel: Wikipedia の記事の冒頭は本社所在地と上場市場のみで、有報にない補足がなかったため使用しませんでした。
- businessStructure: 単一セグメントのため、【事業の内容】に印字された商品群を children としました。商品群ごとの売上高は開示されていないため金額は書きませんでした。
- businessStructure: 販売実績は電線・ケーブル全体の金額のみ開示されており、商品群ごとの金額はありません。
- history: 1949年の設立時の資本金の金額は、本文の財務数値の規則のため記載しませんでした。
- history: 営業所の開設・移転に関する出来事は、事業の広がりを示す主要なものを選びました。
- industry: 電線・ケーブルと情報関連機器の販売を主な内容とする専門商社で、単一セグメントの売上の大半を占めるため trading としました。
- relatedCompanies: エン（en）: 「エン」は気候変動シナリオの文脈の一般語で、相手との取引を述べる印字がないため不採用としました。
- relatedCompanies: キャリア（career）: 「キャリア」は人材の多様性の文脈の一般語で、相手との取引を述べる印字がないため不採用としました。
- relatedCompanies: 日新（nissin）: コードリストになく、新株予約権の文脈の部分一致のため不採用としました。
- relatedCompanies: ビジョン（vision）: 「ビジョン」は長期ビジョンの文脈の一般語で、相手との取引を述べる印字がないため不採用としました。
- relatedCompanies: ベース（base-4481）: 「ベース」は連結ベースの文脈の一般語で、相手との取引を述べる印字がないため不採用としました。
- relatedCompanies: カバー（cover）: 「カバー」は事業展開の説明の文脈の一般語で、相手との取引を述べる印字がないため不採用としました。
- relatedCompanies: ランド（land）: 「ランド」は自社ブランドの文脈の部分一致で、相手との取引を述べる印字がないため不採用としました。
- relatedCompanies: ポート（port）: 「ポート」はポートフォリオの文脈の部分一致で、相手との取引を述べる印字がないため不採用としました。
- relatedCompanies: セキ（seki）: 「セキ」は情報セキュリティの文脈の部分一致で、相手との取引を述べる印字がないため不採用としました。
- relatedCompanies: トラスト（trust）: 「トラスト」は日本マスタートラスト信託銀行の部分一致で、信託銀行の純投資のため不採用としました。
- relatedCompanies: 岡三証券グループ（okasan-securities-group）: 主幹事証券会社としての業況報告を含めた情報交換と助言を受けることが保有目的で、取引・提携ではなく金融機関の文脈のため不採用としました。
- relatedCompanies: ＳＷＣＣ・ＪＭＡＣＳ・ＰＩＬＬＡＲ: 特定投資株式の表に載りますが related-candidates.json に含まれていないため、関連企業の候補として選ばず不採用としました（ＳＷＣＣは主要な仕入先、ＪＭＡＣＳは主要な販売先及び仕入先、ＰＩＬＬＡＲは今後の営業取引関係の強化が保有目的として印字されています）。
- relatedCompanies: 連結子会社14社はすべて非上場のため候補外です。
- terms: 用語候補： ケーブルアッセンブリ（電線端末処理）、制御盤事業、アグリ事業、名古屋FAセンター、ジャスト・イン・タイム体制、自社ブランド——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: 2022年11月1日付で普通株式1株につき2株の割合の株式分割を行っています。有報の連結経営指標等の株式数に係る数値は、この分割が2022年10月期の期首に行われたと仮定して算定されています。
- businessModel: 2025年10月31日の取締役会決議に基づき、2025年11月1日から2026年4月30日までを期間とする自己株式の取得を実施しています。2025年12月31日までに35,700株を取得済みです。取得期間は有報の提出日時点で終了しておらず、残りの取得は予定です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
