# オリジナル設計 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | オリジナル設計株式会社 |
| 証券コード | 4642 |
| docID（データを取り出した文書） | `S100XU33` |
| 原本 docID | `S100XU33` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU33.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | オリジナル設計株式会社 / 4642 / docID S100XU33（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
original-engineering-consultants: 2 件の数値を有報XBRLと照合
有報: オリジナル設計株式会社 有価証券報告書－第64期(2025/01/01－2025/12/31) (docID S100XU33)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
original-engineering-consultants: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益のみとした。MD&Aやセグメント注記に印字されたその他の利益段階の金額や受注に関する金額は本文に書かなかった。
- businessModel: 前期との比較分析は、第64期より連結財務諸表を作成しているため行われていない旨が印字されている。
- businessModel: 修正再表示の照合は、連結経営指標等が第64期分のみの記載で前期有報と突き合わせられる行がないため、指標表の注記（第64期より連結作成）に基づいて判断した。
- businessModel: 重要な後発事象は連結・個別とも該当事項なしと印字されている。
- businessModel: Wikipediaの記事冒頭は本社の所在地と事業分野の一般的な説明にとどまり、有報にない補足がなかったため使わなかった。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の大きい順とした（建設コンサルタント事業7,506,494千円、情報処理サービス事業1,008,715千円。千円額は百万円に切り捨てて記載し、合計は売上高8,515,210千円と一致する）。
- businessStructure: セグメント利益の金額は書かなかった。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。仕入先として特定の相手の印字はない。
- businessStructure: 設備は、本社（東京都渋谷区）が全社共通、東京事務所・新潟事務所・大阪事務所・福岡事務所が建設コンサルタント事業、クラックスシステム本社ほか（大阪市中央区）が情報処理サービス事業、日本技術サービス本社（神戸市東灘区）が建設コンサルタント事業と印字されている。
- businessStructure: 連結子会社は株式会社クラックスシステム（情報処理サービス事業、議決権100.0％）と日本技術サービス株式会社（建設コンサルタント事業、議決権100.0％）で、非連結子会社1社（株式会社VISTAQUA）がある。いずれも自社の子会社であり関連企業としては結ばない。
- history: 沿革の年月は年だけを記録し、月は書かなかった。
- history: 全国各地への事務所設置の個別の出来事は、事業の転機となるものに絞るため一部を省いた。
- history: 資本金の金額は沿革に書かなかった（印字もない）。
- industry: 主たる業界は construction とした。売上高の大半（8,515百万円のうち7,506百万円）が建設コンサルタント事業によるものであるため。情報処理サービス事業は金額が独立して開示されているが、売上構成は小さく2つ目の業界は付けなかった。
- industry: DEIの別記事業は cte である。
- relatedCompanies: 光通信（hikari-tsushin）以外の候補は結ばなかった。en・career・innovation・base-4481・freee・mtg・ray・seki・systemsoft・takashima-and-co・vision は、いずれも一般語や用語・人名の部分文字列の一致のみで（エンジニアリング、キャリアデザイン、グリーンイノベーション、営業利益ベース、フリーアドレス、イノベーションMTG、レイアウト、セキュリティ、システムソフト（事業説明の一部）、高島俊文（個人株主）、新水道ビジョン）、相手についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: 主要な顧客である日本下水道事業団（2025年12月期の売上高1,618百万円、建設コンサルタント事業）は、上場会社ではなく候補にもないため関連企業としては結ばず、事業構造と事業モデルの顧客として記載した。
- relatedCompanies: 大株主のうち株式会社東京スペックス（33.66％）、株式会社UH Partners 2（9.08％）などは候補にない相手であり、結ばなかった。個人株主も結ばない。
- relatedCompanies: 特定投資株式は該当事項なしと印字されており、政策保有による結びつきはない。
- relatedCompanies: 連結子会社2社と非連結子会社1社は自社の子会社であるため関連企業としては結ばなかった。
- terms: 用語の助言: 「建設コンサルタント」は、公共事業等について調査・計画・設計・施工監理などを行う事業者を指します。「ウォーターPPP」は、水道分野での官民連携の手法を指します。「アセットマネジメント」は、施設の状態を踏まえて計画的に維持・更新を行う考え方を指します。「MONJU（都市施設情報管理システム）」は、同社が1989年に完成し運用を開始した都市施設情報管理システムの名称です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
