# ローツェ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ローツェ株式会社 |
| 証券コード | 6323 |
| docID（データを取り出した文書） | `S100Y5GM` |
| 原本 docID | `S100Y5GM` |
| 提出日（原本） | 2026-05-22 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5GM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ローツェ株式会社 / 6323 / docID S100Y5GM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
rorze: 10 件の数値を有報XBRLと照合
有報: ローツェ株式会社 有価証券報告書－第41期(2025/03/01－2026/02/28) (docID S100Y5GM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
rorze: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に財務諸表の組替えの記載がある旨の注意があったため、前期有報との修正再表示チェックを確認したところ重複年度は全8行一致し、証拠テキストに表示方法の変更にあたる注記は確認できなかったため、会計基準の変更に関するfinancialNotesは書かず、判断経緯をここに記録します。
- businessModel: 2024年6月に行われたNanoverse Technologies, Ltd.との企業結合について、前連結会計年度は暫定的な会計処理でしたが、当連結会計年度に確定しました。この確定に伴うのれんの金額の変更はありません。
- businessModel: 2024年9月にローツェライフサイエンス株式会社がジェノスタッフ株式会社の全株式を取得し子会社化しました。本登録は取得後の2026年2月期の事業構成に基づきます。
- businessModel: ベトナム子会社（RORZE ROBOTECH CO.,LTD.）では新工場の建設を進めており、工場用地の取得は完了し、2028年春頃の稼働開始を予定しています。
- businessModel: Applied Materials,Inc.とTaiwan Semiconductor Manufacturing Company, Ltd.は主要な顧客ですが、related-candidates.jsonに載っていない海外企業で日本に上場していないため、関連企業としては結ばず、役割をbusinessModelとindustryPositionに記載しました。
- businessStructure: 製品区分ごとの売上高は【関連情報】の製品及びサービスごとの情報の印字どおりです。
- businessStructure: RORZE SYSTEMS CORPORATION（議決権所有割合40.1％）及びNanoverse Technologies, Ltd.（同33.0％）は、持分が100分の50以下ですが実質的に支配しているため子会社としています。
- businessStructure: 報告セグメントの利益は営業利益ベースの数値のため、本文には金額を書きませんでした。
- history: 沿革は1985年3月の設立から2025年3月まで46件を、日付と事象の対応が取れるものだけ使いました。設立時の資本金の金額は沿革の文に印字されていますが、本文の財務数値の規則により記載しませんでした。
- industry: 主たる業界は semiconductors とした。最大の報告セグメントは半導体・ＦＰＤ関連装置事業（外部顧客への売上高127,593百万円）で、半導体製造装置の開発・製造・販売が中心であるため。製造装置の事業であるため、2つ目に machinery を付けた。ライフサイエンス事業（細胞培養装置）は報告セグメントとして開示されているが、売上高は1,201百万円と小さく、該当する業界区分がないため付けなかった。
- relatedCompanies: エン（4849）: ambiguous で、「エン」の部分一致であり、エン株式会社との関係の記載はない。
- relatedCompanies: セキ（7857）: ambiguous で、「セキュリティ」など一般語の部分一致であり、セキ株式会社との関係の記載はない。
- relatedCompanies: ポート（7047）: 「ロードポート」という製品名の部分一致で、ポート株式会社との関係の記載はない。
- relatedCompanies: キャリア（6198）: ウエハ搬送の用語「キャリア」の部分一致で、株式会社キャリアとの関係の記載はない。
- relatedCompanies: イノベーション（3970）: 「イノベーション」という一般表現の部分一致で、株式会社イノベーションとの関係の記載はない。
- relatedCompanies: ベース（4481）: 「ベースの数値」という一般表現の部分一致で、ベース株式会社との関係の記載はない。
- relatedCompanies: レイ（4317）: ambiguous で、「ディスプレイ」という一般語の部分一致であり、株式会社レイとの関係の記載はない。
- relatedCompanies: コア（2359）: ambiguous で、一般語の部分一致であり、株式会社コアとの関係の記載はない。
- relatedCompanies: コタ（4923）: ambiguous で、「インコタームズ」という貿易用語の部分一致であり、コタ株式会社との関係の記載はない。
- relatedCompanies: フリー（4478）: 「フリーモント」という地名の部分一致で、フリー株式会社との関係の記載はない。
- relatedCompanies: IC（4769）: ambiguous で、「ICチップ」という一般語の部分一致であり、株式会社ICとの関係の記載はない。
- relatedCompanies: トラスト（3347）: コードリストにない相手で、「日本マスタートラスト信託銀行」という信託銀行名の部分一致であり、純投資のため結ばない。
- relatedCompanies: ビジョン（9416）: 自社のビジョンの文言の部分一致で、株式会社ビジョンとの関係の記載はない。
- relatedCompanies: 川崎重工業（7012）: 2022年8月30日に当社製品が同社の保有する米国特許権を侵害するとの主張を受けた旨が印字されているが、訴訟の相手方であり、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: キング（8118）: 「ドッキング」という一般語の部分一致で、株式会社キングとの関係の記載はない。
- relatedCompanies: リード（6982）: 「リードタイム」という一般語の部分一致で、株式会社リードとの関係の記載はない。
- relatedCompanies: Applied Materials,Inc.とTaiwan Semiconductor Manufacturing Company, Ltd.は主要な顧客（2026年2月期の売上高はそれぞれ22,009百万円、19,522百万円）ですが、related-candidates.jsonに載っていない海外企業で日本に上場していないため結ばない。
- relatedCompanies: 大株主の状況では、創業者の個人株主が35.72％を保有し、信託銀行や株式会社中国銀行（1.85％）などが並んでいます。事業会社としての取引・提携・資本関係の印字がないため、関連企業としては結ばない。
- relatedCompanies: 連結子会社14社は【関係会社の状況】に載っていますが、日本に上場していないため関連企業としては結ばず、businessStructureに記載しました。
- terms: 助言: 用語「EFEM」（Equipment Front End Module、製造装置や検査装置の前面に設置するウエハ搬送装置）、「ウエハソータ」（FOUP間でウエハの移載・振り分けを行う搬送装置）、「N2パージ対応ウエハストッカ」（窒素供給によりウエハの表面酸化を抑える個別保管庫）、「ロードポート」（FOUPの供給を受けてウエハを装置に取り込んだり収納するための窓口）、「FOUP」（300mmウエハが最大で25枚入る保管箱）、「VPD装置」（全自動気相分解装置、Siウエハ中の金属不純物を自動分析するための前処理装置）、「CellKeeper」（自動培地交換機能を搭載した細胞培養装置）、「SCALE48」（細胞の自動培養を実現するメカトロCO2インキュベータ）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

- businessModel: 2024年9月1日付で普通株式1株につき10株の割合で株式分割を行いました。過去の年度の株式に関する数値は、分割が行われたものとして算定しています。
- businessModel: 当連結会計年度に訴訟に備えた引当金7,429百万円を計上したことにより、親会社株主に帰属する当期純利益は19,048百万円（前期比19.4％減）となりました。引当金の対象となった訴訟の相手方や内容は、有報の要約箇所からは特定できません。
- businessModel: 2026年4月17日開催の取締役会において、連結子会社であるNanoverse Technologies, Ltd.の借入金に係る債務保証について、保証限度額を13百万米ドルから29.7百万米ドルに増額することを決議しました。本登録は2026年2月期の事業構成に基づく旨を明記します。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
