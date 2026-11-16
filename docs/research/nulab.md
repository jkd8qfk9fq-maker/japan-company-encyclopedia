# ヌーラボ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ヌーラボ |
| 証券コード | 5033 |
| docID（データを取り出した文書） | `S100YH55` |
| 原本 docID | `S100YH55` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH55.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ヌーラボ / 5033 / docID S100YH55（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nulab: 10 件の数値を有報XBRLと照合
有報: 株式会社ヌーラボ 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YH55)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nulab: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記は、潜在株式調整後当期純利益の不記載の理由、上場前の株価収益率の不記載、上場に伴う新株発行による純資産額・総資産額の増加の説明、従業員数の算定方法など表示事項が中心であり、financialNotes には記録しなかった。決算期変更・株式分割・会計方針の変更を示す注記はない。
- businessModel: 前期有報との修正再表示の照合は全6系列で差異なし（証拠パックの照合結果どおり）。組替え・遡及修正を示す注記は見当たらなかった。
- businessModel: MD&Aの利益面の金額と理由（営業利益・経常利益・税引前当期純利益・特別損失の内訳）は本文に書いていない。売上高の増減と理由のみを書いた。自己株式の取得や2027年3月期の業績見込みなども本文と perspectives には書いていない。
- businessModel: 経営方針が重視するARR・有料契約数・解約率などの経営指標の数値・目標は、本文と perspectives には書いていない。
- businessModel: Typetalkは2025年12月1日にサービスを終了したため、businessModel の products には含めていない（businessStructure の children には終了の旨を明記して残した）。
- businessStructure: サービス別の売上高はMD&Aの販売実績（サービス別）の印字による。千円単位の内訳（Backlog 4,041,631千円、Cacoo 111,292千円、Typetalk 2,464千円、Nulab Pass 238,274千円）の合計は4,393,661千円で、印字の合計4,393,663千円と2千円異なる。百万円への切り捨て後の内訳合計（4,392百万円）も売上高4,393百万円と1百万円異なる。いずれも印字どおりに記載した。
- businessStructure: 単一セグメントのため【主要な設備の状況】ではセグメント別の記載が省略されており、本社（福岡市中央区）、東京事務所、京都事務所はクラウドサービス事業全体の拠点として扱い、子サービスには結びつけていない。京都事務所は2026年3月31日現在の設備として記載したが、2026年4月に閉鎖されている（沿革の記載。期間後の出来事）。
- businessStructure: suppliers キーはこのツリーの旧スキーマにないため省略した。米国とオランダの連結子会社は親会社から開発業務及びマーケティング業務を受託している（【関係会社の状況】の記載どおり）。
- history: 沿革表は年月と事象が交互に印字された崩れた表だが、年月22件と事象22件が同数で交互に対応しているため、行順で対応づけた。
- history: 採用したのは12件。落とした10件は事務所・本社の所在地の変更のみの行（2006年 東京事務所開設、2009年 本社移転、2010年 京都事務所開設、2014年 京都事務所移転、2016年 本社移転、2016年 東京事務所移転、2017年 東京事務所移転、2018年 京都事務所移転、2020年 東京事務所移転、2025年 東京事務所移転）で、いずれも warnings に列挙した。
- history: 2026年4月の京都事務所閉鎖は期間後（決算日後・提出前）の出来事だが、有報の沿革自体に記載された行であり、その旨を説明文に明記して採用した。
- history: 資本金の金額は沿革に書いていない（記載があっても書かない）。
- industry: 主たる業界は it（IT・ソフトウェア）とした。クラウドサービス事業の単一セグメントで、プロジェクト管理・作図・ID管理のSaaSを提供しており、閉じた分類にそのまま当たる。DEIの別記事業もCTE（情報・通信）である。
- relatedCompanies: seki（セキ株式会社）: 「セキュリティ」等の部分文字列の一致であり、同社への言及ではないため結ばなかった（ambiguousでもある）。
- relatedCompanies: en（エン株式会社）: 「エンジニア」の部分文字列の一致であり、同社への言及ではないため結ばなかった（ambiguousでもある）。
- relatedCompanies: core（株式会社コア）: 「コラボレーションのコアとなるもの」の一般語の一致であり、同社への言及ではないため結ばなかった（ambiguousでもある）。
- relatedCompanies: port（ポート株式会社）: 「カスタマーサポート」の部分文字列の一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: コードリストにない相手であり、本文の一致箇所は新株予約権の注記の定型文であるため結ばなかった（ambiguousでもある）。
- relatedCompanies: land（株式会社ランド）: 「ブランドメッセージ」の部分文字列の一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: lec（レック株式会社）: 「フレックスタイム制」の部分文字列の一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: ray（株式会社レイ）: 「レイアウト」の部分文字列の一致であり、同社への言及ではないため結ばなかった（ambiguousでもある）。
- relatedCompanies: space（株式会社スペース）: 「契約スペース」の一般語の一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「基本給をベースに」の一般語の一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成支援」の一般語の一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: tear（株式会社ティア）: 「セキュリティアサーションマークアップ言語」の部分文字列の一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: the-lead（株式会社リード）: 「リード・トライアルの獲得」の一般語の一致であり、同社への言及ではないため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 「ゼロとして算定しております」の一般語の一致であり、同社への言及ではないため結ばなかった（ambiguousでもある）。
- relatedCompanies: 【関係会社の状況】に載るのは連結子会社2社（Nulab USA, Inc.、Nulab Netherlands B.V.）のみで、いずれも当社自身の子会社であるため関連企業リンクの対象ではない。主要な顧客ごとの情報も、売上高の10％以上を占める相手先がないため開示が省略されている。
- terms: 助言のみ。用語としては「SaaS」「サブスクリプション」「シングルサインオン（SSO）」「SAML認証」「監査ログ」「Wiki」「製品主導の成長（プロダクト・レッド・グロース）」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 連結子会社のNulab USA, Inc.及びNulab Netherlands B.V.は解散予定であり、本書提出日時点において清算手続き中です。登録は2026年3月31日現在の連結子会社としての構成で行っており、清算の結了による構成の変更には人の確認が必要です。
- businessStructure: 連結子会社のNulab USA, Inc.及びNulab Netherlands B.V.は解散予定であり、本書提出日時点において清算手続き中です。登録は2026年3月31日現在の連結子会社としての構成で行っており、清算の結了による構成の変更には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
