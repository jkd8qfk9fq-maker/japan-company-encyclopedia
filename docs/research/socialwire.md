# ソーシャルワイヤー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ソーシャルワイヤー株式会社 |
| 証券コード | 3929 |
| docID（データを取り出した文書） | `S100YF9R` |
| 原本 docID | `S100YF9R` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF9R.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ソーシャルワイヤー株式会社 / 3929 / docID S100YF9R（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
socialwire: 10 件の数値を有報XBRLと照合
有報: ソーシャルワイヤー株式会社 有価証券報告書－第20期(2025/04/01－2026/03/31) (docID S100YF9R)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第19期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第19期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
socialwire: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 当期有報自体は未修正（訂正なし）。前期の第19期有報には訂正有価証券報告書があるが、前期有報との修正再表示チェックは全６系列で差異ゼロであり、経営指標に影響する修正は認められなかったため、warnings のみの取扱いとし financialNotes には落とさなかった。
- businessModel: 経営指標等の注記は、潜在株式の不記載や当期純損失の年度における指標の不記載といった表示事項のみで、会計基準の変更や決算期の変更はないため financialNotes は空とした。
- businessModel: 経営方針に印字された中期ターゲットの数値（売上高や段階利益の目標）は投資指標・利益の目標であるため、本文や perspectives には書かず、方針のみを定性的に書いた。
- businessModel: MD&Aの段階利益の金額や理由、キャッシュ・フローの金額、SEIRYOの取得対価、設備の帳簿価額は書いていない。
- businessModel: セグメント利益は書いていない。本文の金額は売上高と親会社株主に帰属する当期純利益だけとした。
- businessStructure: セグメントはデジタルPR事業の単一セグメントであり、サービス別の金額は連結財務諸表の注記事項（収益認識関係）の収益分解情報の外部顧客への売上高によった。４サービスの千円合計は3,513,185千円で、印字された売上高合計3,513,186千円と１千円異なるが、合計は印字どおりとした。
- businessStructure: 連結子会社のうちCrosscoop Vietnam Consulting Company LimitedとCrosscoop (Thailand) Co., Ltd.はシェアオフィス事業を営むが、単一セグメントで金額の開示がなく、収益分解情報にも含まれないため独立した事業とはしなかった。
- businessStructure: MK1 TECHNOLOGY VIETNAM COMPANY LIMITEDは2025年９月に出資持分の一部譲渡により連結子会社から持分法適用関連会社となった（期中の異動で、期末の構成に反映済み）。CROSSCOOP PHILIPPINES INC.は子会社に該当しなくなったため連結の範囲から除外されている。
- businessStructure: 主要な設備は本社ほか５営業所のオフィス設備等のみで、単一セグメントのためセグメント名の記載がなく、特定の事業には結びつけなかった。帳簿価額は書いていない。
- businessStructure: 表紙に2026年９月１日付の本店移転予定が注記されているが、グループ構成やセグメントの変更ではないため needsReview にはせず、ここに記録する。
- businessStructure: suppliers キーはこのツリーの旧スキーマにないため付けず、仕入先にあたる個別名も【事業の内容】に印字されていない。
- history: 沿革の表は年月と事項が一体で印字されており、行順で対応づけた。資本金の増減を伴う第三者割当増資（2006年・2008年・2012年）は資本額を書けないため沿革に入れず、ここに列挙する（2024年の割当増資はジーニーの子会社化の事象として記載）。
- history: 省いた事項: レンタルオフィス「CROSSCOOP」の海外拠点開設（2011年シンガポール設立、シンガポール・ジャカルタ・デリー・ホーチミン・マニラ・バンコクの各開設）、株式会社アップステアーズの子会社化（2008年）、メディア・アイズ株式会社の子会社化と吸収合併（2014年）、グループ組織変更に伴う全孫会社の子会社化（2014年）、Entrehub (Thailand) Co., Ltd.の子会社化（2016年）、クラウドソーシング翻訳「TRANSMART」の運営開始（2016年）とクラウド翻訳事業の株式譲渡（2024年）、イベント集客・運用「everevo」の事業譲受（2018年）、ミャンマーの美容メディア「YUYU Beauty」の事業譲受と子会社設立（2020年）、2022年の市場区分見直しに伴うグロース市場への移行、MK1 TECHNOLOGY VIETNAM COMPANY LIMITEDの子会社化（2023年）と持分法適用会社化（2025年、関係会社の異動として businessStructure の warnings にも記録）、海外シェアオフィス事業の終了（2024年）。
- history: wikipedia.json の記事は本社の所在地を述べる冒頭のみで、有報にない補足情報がないため使わなかった。
- industry: 主たる業界は media とした。デジタルPR事業は、顧客の情報をプレスリリース配信やSNSを通じてメディアに届ける事業であり、閉じた集合の中ではメディアに最も近い。
- industry: it は付けなかった。配信プラットフォームやSaaS型ツールはPRサービスを提供する手段であり、独立した報告セグメントとしてのITサービス事業の開示はない。
- industry: entertainment は付けなかった。インフルエンサーPRは広告・広報支援であり、娯楽コンテンツの提供事業ではない。
- industry: DEIの別記事業は cte である。
- relatedCompanies: en: 「エンジニア」等の部分一致のみ（ambiguous）で、エン株式会社との関係の印字はないため結ばなかった。
- relatedCompanies: port: 「サポート」「レポート」等の部分一致のみで、ポート株式会社との関係の印字はないため結ばなかった。
- relatedCompanies: tryt: コードリストにない相手で、「スポットライト」の部分一致のみのため結ばなかった。
- relatedCompanies: vision: コーポレートビジョンという一般語の一致のみで、株式会社ビジョンとの関係の印字はないため結ばなかった。
- relatedCompanies: core: 「コア事業」等の一般語の一致のみ（ambiguous）で、株式会社コアとの関係の印字はないため結ばなかった。
- relatedCompanies: eyez: 自社サービス「RISK EYES」の名称の部分一致のみで、株式会社アイズとの関係の印字はないため結ばなかった。
- relatedCompanies: seki: 「情報セキュリティ」の部分一致のみ（ambiguous）で、セキ株式会社との関係の印字はないため結ばなかった。
- relatedCompanies: land: 「ブランド」の部分一致のみで、株式会社ランドとの関係の印字はないため結ばなかった。
- relatedCompanies: base-4481: 「プロダクトをベースに」という一般表現の部分一致のみで、ベース株式会社との関係の印字はないため結ばなかった。
- relatedCompanies: cyberbuzz: 経営環境の説明で市場調査データの引用元として印字されているのみで、取引・提携の印字はないため結ばなかった。
- relatedCompanies: hub: 「ハブの役割」という一般語の一致のみ（ambiguous）で、株式会社ハブとの関係の印字はないため結ばなかった。
- relatedCompanies: kohsoku: 「高速な検索・判定」という一般語の一致のみ（ambiguous）で、株式会社高速との関係の印字はないため結ばなかった。
- relatedCompanies: nissin: コードリストにない相手で、新株予約権の行使期間の印字の部分一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: suzuki-6785: 印字されているのは取締役の個人名（鈴木基文氏）のみで、株式会社鈴木との関係の印字はないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 親会社の株式会社ジーニー（【関係会社の状況】に親会社として記載され、議決権の被所有割合は2026年３月31日現在49.0％。資本業務提携、役員の兼任、人員の出向受入、広告サービス等の利用、技術提供が印字されている）は related-candidates.json に候補がなく、百科事典にも登録がないため結ばなかった。株式会社SBI証券は【大株主の状況】に5.05％の大株主として印字されているが、候補になく、証券会社（金融機関）の保有であるため結ばなかった。Japan AI株式会社（親会社の子会社で、当期に子会社株式の譲渡取引が関連当事者情報に印字）は候補になかった。連結子会社４社と持分法適用関連会社MK1 TECHNOLOGY VIETNAM COMPANY LIMITEDは自社の子会社・関連会社であるため結ばなかった。
- terms: 「デジタルPR事業」は報告セグメントの名称として、有報の表記どおりに用いた。
- terms: 「Find Model」「Find Model Circle」「iHack」「＠Press」「＠クリッピング」「Clip Master」「RISK EYES」はサービスの名称として有報に印字されている。
- terms: 「デジタルPR」は同社が事業分野を指す用語として有報に印字されている。

## 要確認（status に反映）

- businessModel: 株式会社SEIRYOについて、2026年５月29日開催の取締役会で株式を取得して子会社化することが決議され、同日付で株式譲渡契約が締結されています（重要な後発事象に記載）。企業結合日は2027年３月期第１四半期連結会計期間中を予定しており、本登録は2026年３月31日現在のグループ構成（当社及び連結子会社４社）に基づいております。子会社化後の取扱いは人の確認が必要です。
- businessStructure: 株式会社SEIRYOについて、2026年５月29日開催の取締役会で株式を取得して子会社化することが決議され、同日付で株式譲渡契約が締結されています（重要な後発事象に記載）。企業結合日は2027年３月期第１四半期連結会計期間中を予定しており、本登録は2026年３月31日現在のグループ構成（当社及び連結子会社４社）に基づいております。子会社化後の取扱いは人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
