# 株式会社ソリトンシステムズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ソリトンシステムズ |
| 証券コード | 3040 |
| docID（データを取り出した文書） | `S100XRPJ` |
| 原本 docID | `S100XRPJ` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRPJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ソリトンシステムズ / 3040 / docID S100XRPJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
soliton-systems: 10 件の数値を有報XBRLと照合
有報: 株式会社ソリトンシステムズ 有価証券報告書－第48期(2025/01/01－2025/12/31) (docID S100XRPJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
soliton-systems: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円印字をそのまま引用した（千円額の切り捨て換算はしていない）。セグメント別の外部顧客への売上高の合計（18,516＋1,053＋191＝19,760百万円）は印字の連結売上高19,762百万円と2百万円異なるが、有報の印字どおりに引用し、差異は有報側の集計に基づくものとしてここに記録した。
- businessModel: 2025年12月期のセグメント変更（映像伝送の基盤技術開発チームをEco 新規事業開発から映像コミュニケーション事業へ移管し、前期のセグメント情報を変更後の区分で再表示）は表示区分の変更であり、連結の5年指標に影響しないためfinancialNoteにはしていない。前期有報との修正再表示チェックも全系列で差異なしだった。
- businessModel: 経営方針に掲げる目標指標（1株当たり当期純利益）と配当政策（配当性向・株主資本配当率の目安）は投資指標のため、本文と戦略には書かずここに記録した。
- businessModel: 売上総利益率や営業利益率などの利益率は本文・戦略に書いていない。セグメント利益の金額も書いていない。
- businessModel: その他の関係会社Zen-Noboks（当社株式の44.3％を所有する資産管理会社）とは事業上の取引関係がないと印字されているため、フローと関連企業には含めていない。
- businessModel: 主力製品の正式名は「NetAttest EPS」だが、末尾のEPSが投資指標の語として機械検査に抵触するため、本文（products・perspectives）では「NetAttest」と表記した。正式名はtermsフラグメントに記録している。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（ITセキュリティ18,516百万円、映像コミュニケーション1,053百万円、Eco 新規事業開発191百万円）。
- businessStructure: 2025年12月期に索利通網絡系統（上海）有限公司の出資持分を全て売却し連結の範囲から除外したため、連結子会社は5社となった。期中に完了し期末現在の体制に反映済みのため、needsReviewには入れず沿革と本警告に記録した。
- businessStructure: その他の関係会社である有限会社Zen-Noboksは当社株式の44.3％を所有する資産管理会社で、事業上の取引関係はないと印字されている。非上場のため関連企業リンクの対象外であり、関係は本警告とbusinessModelのフローには含めず、ここに事実を記録した。
- businessStructure: 2025年12月期より、従来Eco 新規事業開発に含めていた映像伝送の基盤技術開発チームを映像コミュニケーション事業に含めるセグメント変更があった。前期のセグメント情報は変更後の区分で再表示されており、連結の5年指標への影響はないため、financialNoteにはせず本警告に記録した。
- history: 沿革の2019年の行は年月セルが2つ（2019年４月・2019年７月）続けて印字され事象文と分かれている崩れた表で、事象も2つ（Sound-FinTech完全子会社化・オレガ吸収合併）のため、行順に対応づけて年だけを記録した。
- history: 落とした行：商号変更（カマケン、1982年）以外の本店移転・営業所開設等の拠点の動き、シリコン・コンパイラ・システムズ・ジャパンやスリーコム・ソリトンの設立と吸収合併（1989–1993年）、Solphoneとソルフォンの設立・清算（2000–2005年）、アステックの取得・吸収合併（2000–2006年）、シンセシスの取得・吸収合併（2013–2017年）、Ji2の子会社化・吸収合併（2014–2016年）、デンマーク2社の取得・社名変更・清算（2014–2022年）、シンガポール子会社の設立・清算（2013–2022年）、Soliton Cyber & Analyticsの社名変更・解散（2016–2018年）、Applause Messagesの設立・清算（2020–2024年）、物流倉庫の移転など。いずれも拠点・小規模子会社の動きで、現在の事業体制を理解するうえで中核でないため省いた。
- history: 創立や子会社化に伴う資本金の金額は沿革に書いていない。
- industry: 主たる業界は、売上高の94％を占めるITセキュリティ事業（ソフトウェア開発・販売と運用サービス）に基づきitとした。
- industry: Eco 新規事業開発にはアナログ・デジタル混在半導体デバイスの開発・販売が含まれるが、新規事業開発の一区分で売上高は191百万円（全体の約1％）にとどまり、映像伝送システム等と一体の区分のため、semiconductorsは付けていない。
- relatedCompanies: 結ばなかった候補と理由：
- relatedCompanies: seki（セキ）＝セキュリティ等の部分一致で、当社について述べる取引の相手ではない。
- relatedCompanies: career（キャリア）＝社員のキャリア成長という一般語の一致。
- relatedCompanies: taya（田谷）＝本店所在地の世田谷区の部分一致。
- relatedCompanies: base-4481（ベース）＝時価ベースの自己資本比率の部分一致。
- relatedCompanies: ray（レイ）＝レイアウト等の部分一致。
- relatedCompanies: en（エン）＝エンゲージメント等の部分一致。
- relatedCompanies: port（ポート）＝サポート等の部分一致。
- relatedCompanies: trust（トラスト）＝コードリストにない相手で、ゼロトラストという技術用語の一致。
- relatedCompanies: core（コア）＝一般語の部分一致。
- relatedCompanies: freee（フリー）＝フリー・キャッシュ・フローの部分一致。
- relatedCompanies: innovation（イノベーション）＝一般語の一致。
- relatedCompanies: ntt（NTT）＝1989年にLAN通信システムを落札した過去1回限りの取引の印字のみで、現在の取引・提携の印字がないため結ばなかった。
- relatedCompanies: zero（ゼロ）＝ゼロトラストという技術用語の一致。
- relatedCompanies: cover（カバー）＝「カバーしています」という一般語の一致。
- relatedCompanies: garden（ガーデン）＝幕張テクノガーデンという地名・施設名の一致。
- relatedCompanies: ic（IC）＝半導体デバイスのICという技術用語の一致。
- relatedCompanies: kohsoku（高速）＝低速自動車の文脈の部分一致。
- relatedCompanies: no-1（No.1）＝国内シェアNo.1という表現の一致。
- relatedCompanies: the-lead（リード）＝「時代の流れをリードする」という一般語の一致。
- relatedCompanies: tokyu（東急）＝有報が協業を述べる相手は東急バスであり、上場会社である東急株式会社そのものではない（別法人）ため、親会社側を結ばなかった。協業の事実はここに記録した。
- relatedCompanies: 主要な顧客のダイワボウ情報システム株式会社（2025年12月期の販売実績2,878百万円、総販売実績の14.6％）は関連企業候補の一覧に含まれていないため結ばず、事実はindustryPositionの根拠と本警告に記録した。
- relatedCompanies: その他の関係会社の有限会社Zen-Noboksは非上場の資産管理会社で候補に含まれず、事業上の取引関係もないため結ばなかった。
- relatedCompanies: 特定投資株式は該当事項なしと印字されており、政策保有株式に基づくリンクもない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の本文に説明があるものだけを選んだ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
