# アスカ — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アスカ株式会社 |
| 証券コード | 7227 |
| docID（データを取り出した文書） | `S100XNA6` |
| 原本 docID | `S100XNA6` |
| 提出日（原本） | 2026-02-26 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XNA6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アスカ株式会社 / 7227 / docID S100XNA6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
aska: 10 件の数値を有報XBRLと照合
有報: アスカ株式会社 有価証券報告書－第72期(2024/12/01－2025/11/30) (docID S100XNA6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第71期(2023/12/01－2024/11/30) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
aska: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: suppliersは省いた。有報は自社の調達について一般名詞の調達先を印字しておらず、具体的な材料調達先である岡谷鋼機はrelatedCompaniesで結んだ。理由はここに記録する。
- businessModel: financialNotesは空にした。会計方針の変更は「該当事項はありません」と印字され、変則決算・決算期変更はなく、修正再表示チェックでも重複年度の全指標が前期有報と一致した。
- businessModel: 前期（第71期）有報には2025年4月9日提出の訂正報告書があるが、当期有報の5年表の重複年度は前期有報の印字と全て一致しており（修正再表示チェックで差異なし）、指標への影響は確認されなかったためwarningsに記録するにとどめた。
- businessModel: 経営指標の目標である「連結売上高営業利益率5％以上」（2025年11月期の実績は4.6％で目標未達成とMD&Aに印字）は、本文・戦略に使えない語を含むためwarningsにのみ記録した。
- businessModel: 事業別の外部顧客への売上高は千円印字を百万円へ切り捨てており、5事業の合計46,355百万円は印字の合計46,356百万円と1百万円異なる。印字の合計を優先した。
- businessModel: MD&Aのセグメント別売上高は内部売上高を含むため使わず、セグメント注記の外部顧客への売上高と販売実績の増減率を用いた。
- businessModel: 地域ごとの売上高（日本37,124百万円、インドネシア7,337百万円、米国1,895百万円）も千円印字の切り捨てである。
- businessStructure: 事業名はセグメント注記の印字どおりとし、外部顧客への売上高の大きい順（自動車部品36,254百万円、ロボットシステム5,120百万円、制御システム3,419百万円、モータースポーツ1,410百万円、賃貸及び太陽光152百万円）に並べた。金額は千円印字を百万円へ切り捨てた。
- businessStructure: MD&Aのセグメント別売上高はセグメント間の内部売上高を含む金額のため使わず、セグメント注記の外部顧客への売上高を用いた。
- businessStructure: 【事業の内容】に挙がる「その他の事業」（子会社アスカ有限会社による損害保険代理業）は報告セグメントではなく、同社は非連結子会社のため独立した連結売上高の印字がない。子事業にはせず、グループ全体の説明に含めた。
- businessStructure: 株式会社MIRAI-LABは、重要性が増したため当連結会計年度から連結の範囲に含めている（連結の範囲の重要な変更として印字）。期中に完了し期末の体制に反映された変更のため、needsReviewには入れていない。
- businessStructure: 子会社・関連会社の資本金の金額は書いていない。
- history: 沿革表の2018年7月と2022年4月の2つの年月と、MIRAI-LAB設立・名古屋証券取引所メイン市場への移行の2つの事象は、印字が崩れて続けて記載されているため、年月と事象の数が同じであることから行順に対応づけた（2018年7月=MIRAI-LAB設立、2022年4月=メイン市場移行）。メイン市場への移行が2022年4月であることは市場区分見直しの時期とも一致する。
- history: 沿革の子会社設立・買収に伴う資本金の金額は書いていない。
- history: 月は書かず年だけにした。工場の設置・営業所の開閉など小規模な出来事は省いた。
- industry: 主たる業界は、最大セグメントの自動車部品事業（外部顧客への売上高36,254百万円）に基づきautomotiveとした。
- industry: 産業用ロボットや自動化システムを製造販売するロボットシステム事業（同5,120百万円）が独立して開示されているためmachineryを2つ目に付けた。
- industry: 分電盤・制御盤・FAボックス等を製造販売する制御システム事業（同3,419百万円）が独立して開示されているためelectronicsを3つ目に付けた。
- industry: モータースポーツ事業（同1,410百万円）と賃貸及び太陽光事業（同152百万円）は規模が小さく、独立した業界区分は付けなかった。
- relatedCompanies: mitsubishi-motors: 主要な顧客ごとの情報に三菱自動車工業株式会社自身が自動車部品事業の顧客として印字されているためcustomerで結んだ。同表のPT.Mitsubishi Motors Krama Yudha Indonesiaはインドネシアの別法人で候補にないため結んでいない。
- relatedCompanies: 豊田鉄工株式会社と株式会社協豊製作所は主要な顧客だが、未上場で候補リストになく百科事典の項目もないため結んでいない。
- relatedCompanies: TONE株式会社（tone、証券コード5967）は大株主の状況に2.62％（2025年11月30日現在）の事業会社として載り、特定投資株式の保有目的も自動化設備等の重要取引先と個別化されているが、related-candidates.jsonに含まれていないため、候補からのみ選ぶ規則により結んでいない。アスカは同社株式800,000株を保有している。
- relatedCompanies: 株式会社CISは大株主の状況の筆頭株主（33.18％、2025年11月30日現在）だが未上場で候補にないため結んでいない。
- relatedCompanies: 大株主の株式会社三井住友銀行（3.69％）、株式会社三菱UFJ銀行（1.97％）、株式会社あいち銀行（1.89％）は金融機関であり、候補にある各フィナンシャルグループは銀行本体とは別の法人で、保有目的も資金調達・金融取引のみのため結んでいない。
- relatedCompanies: aichi-financial-group・mitsubishi-ufj-financial-group・mizuho-financial-group・sumitomo-mitsui-financial-group・san-ju-san-financial-group・the-hyakugo-bank・the-hyakujushi-bank・the-ogaki-kyoritsu-bank: 特定投資株式の保有目的が安定的な資金調達や金融取引等の取引関係の構築・維持・強化のみのため、銀行ルールで結んでいない。
- relatedCompanies: resorttrust: 特定投資株式の保有目的が福利厚生の提供・取組強化の維持のみで、取引・提携の関係ではないため結んでいない。
- relatedCompanies: taiho-transportation・sun-messe・tokai-electronics: 特定投資株式の保有目的が「当社との良好な事業関係の維持・強化」という定型文のみで、事業分野や取引の役割の個別化がないため結んでいない。
- relatedCompanies: freee・base-4481・port・vision・fuller・slogan: 本文中の一般語（二酸化炭素フリー、営業利益ベース、ラジエーターサポート、長期ビジョン、マフラー、全社年間スローガン）との語の一致であり、会社への言及ではないため結んでいない。
- relatedCompanies: suzuki-6785・t-kawabe-and-co: 役員の個人名（鈴木・川辺）との一致でambiguousのため結んでいない。
- relatedCompanies: グループの子会社・持分法適用関連会社（N&Aテック株式会社を含む）自体はリンクにしていない。ニチアスとの合弁の事実はnichiasの説明に書いた。
- relatedCompanies: 関連会社の説明には金額（計上額・売上高）を書いていない。株式数と議決権の割合のみ書いた。
- terms: 助言: 用語「ユニロボ」は、ロボットシステム事業で製造販売する産業用ロボットの呼称です（報告セグメントの概要に「産業用ロボット（ユニロボ）」と印字）。
- terms: 助言: 用語「超ハイテン部品」は、電気自動車部品の軽量化対応として研究開発に取り組む部品です（研究開発活動に印字）。
- terms: 助言: 用語「FAボックス」は、制御システム事業で製造販売する製品の一つです（報告セグメントの概要に、分電盤、制御盤、FAボックス、盤用キャビネット等と印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
