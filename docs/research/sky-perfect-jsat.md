# スカパーJSAT — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | スカパーＪＳＡＴ株式会社 |
| 証券コード | 9412 |
| docID（データを取り出した文書） | `S100YBNS` |
| 原本 docID | `S100YBNS` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBNS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | スカパーＪＳＡＴ株式会社 / 9412 / docID S100YBNS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sky-perfect-jsat: 10 件の数値を有報XBRLと照合
有報: スカパーＪＳＡＴ株式会社 有価証券報告書－第19期(2025/04/01－2026/03/31) (docID S100YBNS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sky-perfect-jsat: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「スカパーJSAT株式会社 (旧会社名　株式会社スカパーJSATホールディングス)」が EDINET の提出者名「スカパーＪＳＡＴ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの「財務諸表の組替え」の注意について、修正再表示チェックは前期有報と全8行一致し、証拠テキストに表示方法の変更にあたる注記は確認できなかったため、組替えに関するfinancialNotesは書かず、判断経緯をここに記録しました。
- businessModel: 2025年1月に連結子会社であった㈱スカパー・カスタマーリレーションズの株式の一部を売却し、持分法適用の関連会社としました。本登録は2026年3月期の期末時点の構成に基づきます。
- businessModel: 当連結会計年度において、連結子会社であった㈱Orbital Lasersは第三者割当増資により連結子会社から除外され、持分法適用関連会社となりました。本登録は2026年3月期の期末時点の構成に基づきます。
- businessStructure: 【関係会社の状況】に載る子会社・関連会社は上場していないため、関連企業としては結ばず、事業の構成として記載しました。内訳は連結子会社9社、持分法適用関連会社14社、その他15社です。
- businessStructure: 拠点・設備と事業の対応は、【主要な設備の状況】のセグメント欄どおりとしました。複数区分が連記された行は、どの事業にも結びつけていません。
- history: Wikipediaは、有報にない補足として使える事実がなかったため使用していません。
- industry: 主たる業界は telecommunications としました。最大の報告セグメントは宇宙事業（2026年3月期の外部顧客への営業収益66,039百万円）で、通信衛星によるデータ通信や移動体通信等の衛星通信サービスが中心であるためです。2つ目に media を付けました。メディア事業（同61,544百万円）は有料多チャンネル放送のプラットフォームサービスであるためです。
- relatedCompanies: エン（4849）: ambiguousで、「エン」の部分一致（スカパー・エンターテイメント等）であり、エン㈱との関係の印字はない。
- relatedCompanies: セキ（7857）: ambiguousで、「セキ」の部分一致（情報セキュリティ等）であり、セキ㈱との関係の印字はない。
- relatedCompanies: ポート（7047）: 「テレポートセンター」等の部分一致であり、ポート㈱との関係の印字はない。
- relatedCompanies: スペース（9622）: 「スペースインテリジェンス」等の一般語の部分一致であり、㈱スペースとの関係の印字はない。
- relatedCompanies: キャリア（6198）: 「キャリア採用」等の一般語の部分一致であり、㈱キャリアとの関係の印字はない。
- relatedCompanies: QPS研究所（5595）: コードリストにない。防衛省事業の共同落札者の一社だが、上場しておらずコードリストにないため結ばず。
- relatedCompanies: レック（7874）: 「フレックスタイム制度」等の部分一致であり、レック㈱との関係の印字はない。
- relatedCompanies: パス（3840）: ambiguousで、「パススルー方式」の部分一致であり、パス㈱との関係の印字はない。
- relatedCompanies: ゼロ（9028）: ambiguousで、「ゼロ」一般語の部分一致（排出量の実質ゼロ化等）であり、㈱ゼロとの関係の印字はない。
- relatedCompanies: コア（2359）: ambiguousで、一般語の部分一致であり、コア㈱との関係の印字はない。
- relatedCompanies: フジ（8278）: ambiguousで、「伊藤忠・フジ・パートナーズ」の部分一致であり、㈱フジ自体との関係の印字はない。なお、伊藤忠・フジ・パートナーズ㈱は非上場のため結ばず。
- relatedCompanies: 光通信（9435）: 「光通信技術」等の一般語の部分一致であり、㈱光通信との関係の印字はない。
- relatedCompanies: アクセル（6730）: 「アクセルスペース」の部分一致であり、㈱アクセル自体との関係の印字はない。アクセルスペースは非上場のため結ばず。
- relatedCompanies: ベース（4481）: 「ベース」一般語の部分一致であり、ベース㈱との関係の印字はない。
- relatedCompanies: イノベーション（3970）: 「イノベーション」一般語の部分一致であり、イノベーション㈱との関係の印字はない。
- relatedCompanies: コモ（2224）: ambiguousで、「ドコモ」の部分一致であり、コモ㈱との関係の印字はない。
- relatedCompanies: カバー（5253）: 「カバー」一般語の部分一致（提供エリアは37都道府県をカバー）であり、カバー㈱との関係の印字はない。
- relatedCompanies: フリークアウト・ホールディングス（6094）: 特定投資株式として670,600株を保有しているが、保有目的が「関係維持及び今後の事業機会の検討」等の定型的な文言のみで、具体的な取引・提携の印字がないため結ばず。
- relatedCompanies: 高速（7504）: ambiguousで、「高速」一般語の部分一致であり、高速㈱との関係の印字はない。
- relatedCompanies: NTT（9432）: 大株主はNTTドコモビジネス㈱であり、NTT本体との取引・提携・資本関係の印字がないため結ばず。「NTTグループの光ファイバー網を利用」との印字のみ。
- relatedCompanies: リード（6982）: 「リードする」の部分一致であり、㈱リードとの関係の印字はない。
- relatedCompanies: トラスト（3347）: コードリストにない。日本マスタートラスト信託銀行の部分一致であり、信託銀行の純投資のため結ばず。
- relatedCompanies: ビジョン（9416）: 自社のビジョンの文言の部分一致であり、㈱ビジョンとの関係の印字はない。
- relatedCompanies: ウィル（3241）: 「ウィルス対策ソフト」等の部分一致であり、ウィル㈱との関係の印字はない。
- relatedCompanies: 日本テレビ放送網㈱は2026年3月31日現在で7.37％を保有する大株主だが、related-candidates.jsonにないため結ばず。NTTドコモビジネス㈱は同9.19％を保有する大株主だが、非上場のため結ばず。伊藤忠・フジ・パートナーズ㈱はその他の関係会社（被所有27.0％）だが、非上場のため結ばず。
- relatedCompanies: Planet Labs PBCは衛星画像データサービスに関するパートナーシップ契約及び低軌道衛星コンステレーション構築に向けた協業の相手だが、海外上場企業のためrelated-candidates.jsonになく結ばず、役割をbusinessModelのindustryPositionに記載しました。
- relatedCompanies: 日活㈱、㈱ジェイ・スポーツ、㈱エム・シー・シー、㈱Space Compass、Horizons-3 Satellite LLC、㈱トライサット・コンステレーションなどの持分法適用関連会社は上場していないため結ばず。
- terms: 助言: 用語「スペースインテリジェンス」（低軌道衛星から得られる画像や位置情報等のデータを解析・活用し、社会課題の解決や産業の高度化に資する情報・ソリューションを提供する事業）、「Multi-Orbit戦略」（静止軌道から非静止軌道へ事業領域を拡大する戦略）、「Multi-Alliance戦略」（多様なパートナー企業との協業を通じたメディア事業の戦略）、「スカパー！」（東経110度の衛星を利用した約70チャンネルの有料多チャンネル放送サービス）、「衛星コンステレーション」（複数の衛星を連携させて運用する仕組み）、「光データリレー」（静止軌道衛星を経由して地球観測データを光通信で中継する仕組み）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

- businessModel: 2026年4月1日に連結子会社であったスカパーJSAT㈱を吸収合併し、当社の商号をスカパーJSAT㈱に変更しました。本登録は、合併前の2026年3月期の持株会社体制に基づく旨を明記しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
