# シークス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | シークス株式会社 |
| 証券コード | 7613 |
| docID（データを取り出した文書） | `S100XUJ0` |
| 原本 docID | `S100XUJ0` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUJ0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | シークス株式会社 / 7613 / docID S100XUJ0（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
siix: 10 件の数値を有報XBRLと照合
有報: シークス株式会社 有価証券報告書－第34期(2025/01/01－2025/12/31) (docID S100XUJ0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
siix: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造、販売などの費用を差し引いた残りが利益になります。2025年12月期のは2…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報（第33期）と全行一致でクリーン。訂正有報はなく、決算期変更もない。
- businessModel: financialNotes は経営指標等の注記にある収益認識基準の適用（第31期期首から）のみを記録した。ハンガリー工場の閉鎖にともなう評価損や湖北工場の固定資産の評価損は特別損失の内訳であり、金額規則の対象外のため本文には書いていない。
- businessModel: 中期経営計画の数値目標や経営指標の目標値は投資指標・利益指標にあたるため本文には書かず、戦略は定性的に要約した。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。提出後の対象文書（TOB等）の保留は発生しておらず（otherFilingsInWindow は空）、ack は不要・未使用。
- businessModel: 【重要な契約等】のRenzoku Biologics株式会社の定期建物賃貸借契約（2026年4月1日から2046年3月31日、相手先は淵野辺デベロップメント特定目的会社と日本生命保険相互会社）は子会社の事業用不動産の賃貸借であり、グループ構成の変更ではないため needsReview には入れていない。
- businessStructure: 報告セグメントは地域別（日本・中華圏・東南アジア・欧州・米州）のため、事業は地域セグメントを2025年12月期の外部顧客への売上高の大きい順（東南アジア93,122百万円、米州60,098百万円、中華圏57,467百万円、日本56,647百万円、欧州21,403百万円）に並べた（ユニプレス・ハイレックス・エフテック先例）。
- businessStructure: 全社（共通）は報告セグメントではなく調整額の区分のため最後に置いた。金額752百万円はセグメント注記の調整額の注記（外部顧客への売上高の調整額は全社（共通）の区分の売上）に印字された値。
- businessStructure: セグメント注記の製品及びサービスごとの情報（車載関連機器188,747百万円、産業機器55,287百万円、家電機器20,085百万円、情報機器21,156百万円、一般電子部品3,661百万円、その他552百万円）は同じ合計に対する製品軸の切り口であり、二重数えを避けるため事業にはせず、各地域の products と businessModel に反映した。
- businessStructure: 各地域の担当会社は【事業の内容】の主要各社の位置づけと【主要な設備の状況】のセグメント欄に基づく。シークスエレクトロニクスとRenzoku Biologicsは設備欄でも全社（共通）に区分されている。
- history: 沿革は年月と事象が同じ行に印字された通常の表で、行順の対応づけは不要だった。設立時の資本金（10億円）は規則により書いていない。
- history: 落とした小項目（warnings に記録）: 海外子会社・合弁会社の設立の各行（PFUとの合弁1994、バンドー化学との合弁1995、フィリピン1997、台湾1997、上海1999、タカヤとの合弁2001、スロバキア2001、東莞2002、インドネシア子会社の合併2006、メキシコ2007・2013、インドネシアEMS2010、上海EMS2012、フィリピンEMS2013・2014、美的集団の子会社との合弁2015・2017・2023、シンガポール医療技術会社2015、ハンガリー2016、湖北2017、ベトナム2017、マレーシア2019、シンガポール合弁2021・2023、インド2024・2025）、株式分割（2005・2008・2018）と売買単位の変更（2000）、本社・東京営業部の移転（2004・2008）、名古屋営業部の開設（2014）、会社設立30周年（2022）。
- history: バンドー化学との1995年の合弁設立は、関連企業の判断材料として relatedCompanies の warnings に記録した。
- industry: 主たる事業は電子部品の調達とEMS（電子機器受託製造サービス）であり、報告セグメントは地域別のため、主たる業界は electronics とした。
- industry: 品目別では車載関連機器向けが最大だが、自動車メーカーではなく自動車関連の顧客企業に部材調達と受託製造を提供する事業であるため、automotive は付けなかった。
- industry: Renzoku Biologicsのバイオ抗体医薬品の受託開発製造は全社（共通）に含まれる小規模な事業で、独立した金額開示がないため、pharmaceuticals は付けなかった。
- relatedCompanies: 結んだ関連企業は2社（sakata-inx=other-affiliated-company、shindengen-electric-manufacturing=supplier）。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: resona-holdings: 特定投資株式の保有目的が主要金融機関としての資金借入や株式関係事務委託など金融取引であり、資金調達の理由のため結ばなかった。大株主の株式会社りそな銀行（4.61％）、株式会社三井住友銀行（4.58％）、株式会社三菱UFJ銀行（1.53％）も金融機関のため同様。
- relatedCompanies: bando-chemical-industries: 沿革に1995年3月に香港で合弁会社Bando Sakata Ltd.（現Bando SIIX Ltd.）を設立した記載があるのみで、当期の【関係会社の状況】にバンドー化学との資本関係や取引関係の記載がないため、過去の合弁設立だけでは結ばなかった。
- relatedCompanies: en: 「エンジン点火装置」等の断片一致。base-4481: 「時価ベースの自己資本比率」等の断片一致。career: 「ビジネスキャリア」「キャリアパス形成」等の一般語。core: 曖昧な候補で、一致は一般語の文脈のみ。innovation: 「オープンイノベーション促進税制積立金」の断片一致。seki: 「情報セキュリティ」の断片一致。path: 「キャリアパス」の断片一致。port: 「顧客ポートフォリオ」の断片一致。stream: 研究開発活動の「ダウンストリーム工程」の断片一致。trust: listing が「（コードリストにない）」で、一致は日本マスタートラスト信託銀行（信託口）へのもの。
- relatedCompanies: 候補にない主な相手（記録のみ）: Integrated Microelectronics, Inc.は株式の保有状況でフィリピン地域における当社EMS事業の重要な顧客とされる上場会社だが、フィリピンの会社で候補にないため結ばなかった。株式会社PFUとは1994年に合弁会社を設立したが、未上場で候補にない。美的集団の子会社との合弁3社（Guangdong Midea-SIIX Electronics、Hefei Midea-SIIX Electronics、Jingzhou Midea-SIIX Electronics）とKAWASAKI MOTORS (PHILS.) CORPORATIONは持分法適用関連会社だが、いずれも外国の会社で候補にない。SIIX Hungary Kft.の譲渡先Vipulse Technology Kft.も外国の会社で候補にない。日本生命保険相互会社はRenzoku Biologicsの賃貸借契約の相手先の一つだが、保険会社で候補にない。
- terms: 登録候補（助言のみ）: EMS（電子機器受託製造サービス。顧客の製品の製造を一括して請け負うサービスで、同社の中核事業）、グローバル・ビジネス・オーガナイザー（世界各地のニーズを調整し顧客に事業上の利点を提供する、同社の基本方針の呼び名）、基板実装（電子部品を基板に取り付ける工程で、受託製造の中心的な作業）、プリンテッドエレクトロニクス（印刷技術で電子回路をつくる技術で、同社が注力する新規分野）。

## 要確認（status に反映）

- businessModel: 連結子会社SIIX Hungary Kft.（欧州セグメント、ハンガリー）の全出資持分について、2025年11月にVipulse Technology Kft.への譲渡契約を締結し、2026年4月に出資持分譲渡の予定である（【重要な契約等】）。ハンガリー工場は2024年11月に閉鎖を決議している。本登録は2025年12月31日現在のグループ構成と欧州セグメントに基づいており、譲渡は提出時点で未完了の予定事項であるため、承認者の確認を求める。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
