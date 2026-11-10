# CKサンエツ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＣＫサンエツ |
| 証券コード | 5757 |
| docID（データを取り出した文書） | `S100YIA1` |
| 原本 docID | `S100YIA1` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIA1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＣＫサンエツ / 5757 / docID S100YIA1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ck-san-etsu: 10 件の数値を有報XBRLと照合
有報: 株式会社ＣＫサンエツ 有価証券報告書 (docID S100YIA1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ck-san-etsu: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社CKサンエツ」が EDINET の提出者名「株式会社ＣＫサンエツ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: エビデンスパックの注意（本文に財務諸表の組替えの記載がある）について: 該当箇所は個別財務諸表の【表示方法の変更】で、前事業年度に「営業外費用」の「その他」に含めていた「支払利息」を当事業年度から独立掲記し、前事業年度分を組み替えたもの（組替額はいずれも0百万円）。連結の経営指標に影響する組替えではなく、修正再表示チェックでも前期有報と重複する全行が一致していたため、financialNotes への記録は不要と判断した。
- businessModel: 決算期の変更・変則決算はなく、重要な後発事象は連結・個別とも「該当事項はありません」。提出後の文書（otherFilingsInWindow）は空だったため、後発文書の確認（ack）は不要だった。
- businessModel: 【経営方針、経営環境及び対処すべき課題等】にある2027年3月期の経常利益の目標は、本文に書ける財務数値（売上高・当期純利益）以外の利益指標のため、perspectives には書いていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（伸銅131,442百万円、配管・鍍金11,985百万円、精密部品6,009百万円）とした。有報の【事業の内容】の記載順（伸銅、精密部品、配管・鍍金）とは異なる。
- businessStructure: 当社は純粋持株会社で、当社グループは当社と子会社14社で構成される。【事業の内容】の系統図の注記に、三星工業株式会社は2026年1月4日開催の株主総会で解散を決議し清算手続き中であることが印字されている（期中の事象として warnings に記録し、本文には書いていない）。
- businessStructure: 製品区分ごとの売上高は開示されていないため、children には金額を書いていない（金額がない旨を各 children に明記）。
- history: 【沿革】の前文のとおり、法律上の存続会社は1963年設立の北銅商事株式会社（現・CKサンエツ）だが、1991年4月の額面変更目的の合併により実態は旧サンエツ金属株式会社（1937年設立）が存続するのと同様の状態であり、有報の沿革は実質上の存続会社について記載されている。本文もそれに従い1937年を創業とした。
- history: 【沿革】で年月セルが連続印字され事象文と分かれている崩れた表が2か所ある。1か所目（2011年12月〜2014年4月）は年月6件・事象6件、2か所目（2015年1月〜2025年4月）は年月14件・事象14件で数が一致するため、行順に対応づけた。末尾の三谷伸銅の連結子会社化（2025年4月）は【企業結合等関係】の企業結合日（2025年4月1日）とも一致する。
- history: 沿革のうち、エスケー商事の設立・吸収合併、ISO9001・ISO14001の認証取得、砺波工場の第二工場増設、サンエツ商事の設立、日伸地金の設立、ヤシマの吸収合併、大阪黄銅の吸収合併、大連三越精密部件工業への出資持分の全部譲渡、古河電気工業との銅合金線設備の譲受け合意、JX金属黒部ガルバからの設備譲受け、高岡工場のISO/TS16949認証取得は、紙幅のため history には入れていない。
- industry: 主たる業界は、2026年3月期の外部顧客への売上高の大半を占める報告セグメント「伸銅」から決めた。
- relatedCompanies: port: 「サポート」等の一般語の一部が一致しただけで、有報に同社との関係の記述はないため結ばなかった。
- relatedCompanies: king: 「ランキング」等の一般語の一部が一致しただけで、関係の記述はないため結ばなかった。
- relatedCompanies: land: 「ブランド」等の一般語の一部が一致しただけで、関係の記述はないため結ばなかった。
- relatedCompanies: base-4481: 「ベース」等の一般語の一部が一致しただけで、関係の記述はないため結ばなかった。
- relatedCompanies: rhythm: 「リズム」等の一般語の一部が一致しただけで、関係の記述はないため結ばなかった。
- relatedCompanies: kel: ambiguous の相手で、商品スワップ取引の数表に現れるのみで関係の記述はないため結ばなかった。
- relatedCompanies: corona: 新型コロナウイルス感染症の記述に一致しただけで、株式会社コロナとの関係の記述はないため結ばなかった。
- relatedCompanies: asaka-industrial: 連結子会社の日本伸銅が保有するが、保有目的は地元企業との関係維持・強化という一般的なもので、取引の記述がないため結ばなかった。
- relatedCompanies: cci-group: 2026年3月期に全株式を売却済みで、現在の関係はないため結ばなかった。
- relatedCompanies: furukawa-electric: 2012年に銅合金線製造設備の一部譲受けに合意した過去の出来事のみで、現在の関係の記述はないため結ばなかった。
- relatedCompanies: hashimoto-sogyo-holdings: 製品販売先は同社の子会社であり、同社自体との取引の記述がないため結ばなかった。
- relatedCompanies: hokuhoku-financial-group: 保有目的が資金調達先との取引関係の維持・強化であり、資金調達が理由のため結ばなかった。
- relatedCompanies: jx-advanced-metals: 2013年にシーケー金属が溶融亜鉛加工設備を譲り受けた過去の出来事のみのため結ばなかった。
- relatedCompanies: mitsui-kinzoku: 2025年4月の三谷伸銅の株式取得の譲渡相手方という一回限りの取引のみで、継続的な関係の記述はないため結ばなかった（取得の経緯は history に記録）。
- relatedCompanies: sumitomo-metal-mining: 2000年の事業譲受けという過去の出来事のみのため結ばなかった（経緯は history に記録）。
- relatedCompanies: the-bank-of-toyama: 資金調達先の金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: trust: 上場コードリストにない相手のため結ばなかった。
- relatedCompanies: 東泉産業株式会社は主要な顧客（2026年3月期の売上高19,742百万円）で大株主（2026年3月31日現在2.18％）でもあり、株式会社KVK・SANEI株式会社は製品販売先として特定投資株式に印字されているが、いずれも掲載済み企業ではないため関連企業には入れていない。
- relatedCompanies: 株式会社リケンは大株主（2026年3月31日現在2.20％）でリケンCKJVの合弁相手だが、掲載済み企業としての候補はリケンNPRのみだったため、業務提携の根拠があるリケンNPRに結んだ。
- terms: 助言: 用語「伸銅」（銅および銅合金を圧延・引き伸ばして作る棒・線・管などの製品の総称）と「めっき線」（表面にめっきを施した線材）は、この会社の主力製品を理解する要点として用語集への追加候補と考える。本文のリンク記法は、沿革で既存の用語「holding-company」「tender-offer」へのリンクのみ使った。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] CKサンエツの主たる業界 → 提案: nonferrous-metals。売上の大半を占める事業が黄銅などの銅合金（非鉄金属）の製造・販売であるが、閉じた分類に非鉄金属の区分が無いため、金属素材に最も近い化学（chemicals）を暫定とした。
