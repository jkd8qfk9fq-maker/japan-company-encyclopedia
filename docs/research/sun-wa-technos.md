# サンワテクノス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | サンワテクノス株式会社 |
| 証券コード | 8137 |
| docID（データを取り出した文書） | `S100YJ4F` |
| 原本 docID | `S100YJ4F` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ4F.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | サンワテクノス株式会社 / 8137 / docID S100YJ4F（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 33 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sun-wa-technos: 10 件の数値を有報XBRLと照合
有報: サンワテクノス株式会社 有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YJ4F)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sun-wa-technos: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 第12次中期経営計画の目標（最終年度の営業利益や自己資本利益率、株価純資産倍率）は、本文に書ける財務数値（売上高・当期純利益）以外の指標のため、perspectives には金額・比率を書いていない。
- businessModel: 修正再表示チェックは前期有報と重複する全行が一致し、決算期の変更・変則決算はない。重要な後発事象は連結・個別とも「該当事項はありません」。提出後の文書（otherFilingsInWindow）は空だったため、後発文書の確認（ack）は不要だった。
- businessModel: 株式会社エムテックの株式交付による取得（2025年9月30日実行）に伴う取得原価やのれんの金額は、本文に書ける財務数値ではないため本文には書いていない。
- businessStructure: 報告セグメントは地域別（日本・アジア・欧米）で、2026年3月期の外部顧客への売上高は日本101,705百万円、アジア40,005百万円、欧米5,788百万円、その他829百万円。当社グループの事業区分は当連結会計年度より電子コンポーネント部門・制御デバイス部門・産業用PC部門・FAソリューション部門の4部門に変更されており、事業の並びは【関連情報】の製品及びサービスごとの情報（収益認識の分解情報）の外部顧客への売上高の大きい順（電子コンポーネント89,146百万円、制御デバイス34,175百万円、FAソリューション16,429百万円、産業用PC8,577百万円）とし、その他事業を最後に置いた。有報の【事業の内容】の記載順（電子コンポーネント、制御デバイス、産業用PC、FAソリューション）とは異なる。
- businessStructure: 製品・サービスごとの金額は部門単位までしか開示されていないため、children には金額を書いていない（金額がない旨を各 children に明記）。
- history: 沿革の表は一部の年月と事象の対応が崩れて印字されている箇所がある（2014年10月〜2017年4月の海外子会社設立、2025年4月〜10月の各事象、2026年1月・4月の物流センター再編）。エムテックの子会社化は企業結合注記で2025年9月30日の株式交付実行と確認できたため2025年の事象として記録し、HTK Europeの子会社化は2025年の事象として記録した。物流センター再編は2026年の事象として月を特定せずに記録した。
- history: ISO14001認証取得（2004年2月）・ISO9001認証取得（2006年2月）や各地の営業所開設などの細目は、主な転換点に絞るため一部を省略した。
- industry: 主たる業界は、有報で「独立系技術商社」と自らを位置付け、産業用エレクトロニクス・メカトロニクス製品の販売が事業の中心であることから商社（trading）とした。閉じた分類に当てはまる区分があるため taxonomyGap は記録しなかった。
- relatedCompanies: daihen: 特定投資株式の保有目的が「各部門事業における取引先であり、取引関係の維持・強化のために保有」という定型句のみで、取引の向きや具体的な契約の印字がないため結ばなかった。
- relatedCompanies: dmg-mori: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: espec: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: fujifilm-holdings: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: glory: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: kyosan-electric-manufacturing: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: miura: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: nachi-fujikoshi: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: nichicon: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: nikkiso: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: omron: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: sanki-engineering: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: screen-holdings: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: stanley-electric: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: toyo-electric: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: yamato: 同上（特定投資株式の定型句のみ）のため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 保有目的が当社の資金調達及び金融取引に関する主要な取引先という資金調達・金融取引の理由のため結ばなかった。大株主の株式会社三菱UFJ銀行（2.54％）も金融機関のため同様に結ばなかった。
- relatedCompanies: marusan-securities: 保有目的が証券取引の関係の維持・強化のみのため結ばなかった。
- relatedCompanies: en: 「アレックスエンジニアリング」など一般語・他社名の一部が一致しただけで、同社との関係の記述はないため結ばなかった（ambiguous）。
- relatedCompanies: lec: 子会社名「アレックスエンジニアリング」の一部が一致しただけで、同社との関係の記述はないため結ばなかった。
- relatedCompanies: land: 「サンワテクノスタイランド」の一部が一致しただけで、同社との関係の記述はないため結ばなかった。
- relatedCompanies: scala: 「スカラロボット」という一般語の一部が一致しただけで、同社との関係の記述はないため結ばなかった。
- relatedCompanies: seki: 「情報セキュリティ」等の一般語の一部が一致しただけで、同社との関係の記述はないため結ばなかった（ambiguous）。
- relatedCompanies: base-4481: 「営業利益ベース」等の一般語の一部が一致しただけで、同社との関係の記述はないため結ばなかった。
- relatedCompanies: port: 「サポート」等の一般語の一部が一致しただけで、同社との関係の記述はないため結ばなかった。
- relatedCompanies: future: 「GXフューチャー・コンソーシアム」という参画組織の名称の一部が一致しただけで、同社との関係の記述はないため結ばなかった。
- relatedCompanies: vision: 自社の長期経営ビジョン「SUN-WA Vision 2030」の名称の一部が一致しただけで、同社との関係の記述はないため結ばなかった。
- relatedCompanies: suzuki-6785: 社外取締役の人名「鈴木」が一致しただけで、同社との関係の記述はないため結ばなかった（ambiguous）。
- relatedCompanies: taya: 地名・人名の一部が一致しただけで、同社との関係の記述はないため結ばなかった（ambiguous）。
- relatedCompanies: daiwa: 大和証券は第三者割当増資の割当先として現れるのみで、継続的な関係の記述はないため結ばなかった（ambiguous）。
- relatedCompanies: trust: 日本マスタートラスト信託銀行（信託口）は信託口の純投資保有であり、上場コードリストにない相手のため結ばなかった。
- relatedCompanies: 第一生命保険は大株主（4.69％）だが保険会社であり、特定投資株式の保有目的も年金・保険取引の関係の維持・強化という定型句のため結ばなかった。
- relatedCompanies: 連結子会社19社はいずれも未上場のため関連企業には入れていない。株式会社エムテック（議決権50.5％）と株式会社アレックスエンジニアリング（同50.5％）は2025年9月に株式交付で取得したエムテックの子会社化に伴いグループに入った国内子会社である。
- terms: 助言: 用語「技術商社」（メーカーの製品に技術支援やエンジニアリングを付加して販売する商社）と「産業用PC」（工場などの生産現場で使う産業用途のパソコン）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
