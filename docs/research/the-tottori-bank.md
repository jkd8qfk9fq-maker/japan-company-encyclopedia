# 鳥取銀行 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　鳥取銀行 |
| 証券コード | 8383 |
| docID（データを取り出した文書） | `S100Z1D3` |
| 原本 docID | `S100YDT2` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100Z1D3／有効文書 S100Z1D3（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z1D3.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E9%B3%A5%E5%8F%96%E9%8A%80%E8%A1%8C

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　鳥取銀行 / 8383 / docID S100YDT2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 31 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-tottori-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社　鳥取銀行 訂正有価証券報告書－第162期(2025/04/01－2026/03/31) (docID S100Z1D3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第162期(2025/04/01－2026/03/31)、docID S100Z1D3）を有効文書としてこのパックを作った。原本は docID S100YDT2。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetricsMetricsAndTargetsTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock・MetricsAndTargetsHumanCapitalTextBlock・PerformanceDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetrics（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
the-tottori-bank: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 正式名称「株式会社鳥取銀行」が EDINET の提出者名「株式会社　鳥取銀行」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100Z1D3、2026年9月11日提出）。原本（docID S100YDT2）との差異は人的資本・サステナビリティ関連のテキストブロックのみで、財務数値と本文は同一（分類 record-only）のため、訂正に関する needsReview は立てなかった。出典の title・url・publishedAt は訂正有報の値を用いた。
- businessModel: 前期有報との修正再表示チェックでは重複年度の全系列が一致し、変則決算・決算期変更・会計基準の変更の印字もないため financialNotes は空とした。
- businessModel: 中期経営計画の計数目標（2026年度目標：経常利益20億円、自己資本比率8％程度、コアＯＨＲ80％台前半、行内プロフェッショナル人財150人）と、当期実績として印字された経常利益22億円・自己資本比率8.89％・コアＯＨＲ77.4％・行内プロフェッショナル人財125人は、目標値・投資指標および本文に書けない財務数値のため、本文と戦略には書かずこの warnings に記録した。
- businessModel: 本文の財務数値は経常収益と当期純利益だけとする規則のため、経常利益、資金運用収支、預金残高、貸出金残高などの金額と増減は書かなかった。
- businessModel: 報告セグメントは銀行業のみのため、金額はセグメント注記の関連情報（サービスごとの情報）の外部顧客に対する経常収益を用いた。MD&Aの国内・国際業務部門別収支は経常収益の内訳として使わなかった。
- businessModel: 特定投資株式の第一生命ホールディングス株式会社の株式数増加は同社の株式分割によるものと印字されており、当行自身の分割ではないため needsReview には入れなかった。
- businessStructure: 報告セグメントは銀行業単一で、「その他」は報告セグメントに含まれない区分のため最後に置いた。銀行業の内訳はセグメント注記の関連情報（サービスごとの情報）の外部顧客に対する経常収益の印字どおりで、貸出業務・有価証券投資業務・その他の順に大きい。
- businessStructure: 愛称「とりぎん」は有報に印字がなく、Wikipediaの冒頭（証券コード8383で同一性を確認済み）からの補足として出典を併記した。数値はWikipediaから採っていない。
- businessStructure: 表紙に「東京証券取引所スタンダード市場」と印字があるため、listings に market を書いた。
- businessStructure: businessModel の suppliers はこの作業ツリーのスキーマに無いため書かなかった。個別の調達先の印字も有報にない。
- history: 沿革は年月と事象が対で印字されており、年だけを採って月は書かなかった。資本金の金額は沿革に書かない規則のため記載していない。
- history: 2014年の鳥銀ビジネスサービス株式会社の清算、2015年の株式会社バンク・コンピュータ・サービスの清算は、現在のグループ構成に残らない子会社・関連会社の清算のため、行としては採らなかった。
- history: 1988年の鳥銀ビジネスサービス株式会社の設立も、同社が2014年に清算済みで現在のグループに残らないため採らなかった。
- industry: 銀行業を中心にクレジットカード・リースなどの金融サービスを行うグループであり、閉じたリストでは finance のみが該当するため、産業は finance のみとした。
- relatedCompanies: sompo-holdings: 特定投資株式の保有目的が「損害保険業務を中心とした業務上の連携」と個別に印字され、業務提携等の関係の根拠があるため結んだ。当行株式の保有者は同社ではなく子会社の損害保険ジャパン株式会社である旨も印字どおり書いた。
- relatedCompanies: orix: 保有目的が「リース業務を中心とした金融関連サービスや業務上の連携」と個別に印字されているため結んだ。
- relatedCompanies: tomato-bank: 保有目的が「近隣地域金融機関として金融関連サービスや業務上の連携」と個別に印字されているため結んだ。
- relatedCompanies: the-chugoku-electric-power: 保有目的は「鳥取県内に支所を有し、地域の経済発展・雇用創出に貢献」と地域貢献の理由のみで、当行との取引・提携の印字がないため結ばなかった。
- relatedCompanies: chudenko: 保有目的は「鳥取県内に営業所を有し、地域の経済発展・雇用創出に貢献」と地域貢献の理由のみで、当行との取引・提携の印字がないため結ばなかった。
- relatedCompanies: ana-holdings: 保有目的は「鳥取県と都市部をつなぐ旅客・貨物運送等で重要な役割」と地域での役割のみで、当行との取引・提携の印字がないため結ばなかった。
- relatedCompanies: 第一生命ホールディングス株式会社: 保有目的に「保険商品の窓口販売等における連携」の印字はあるが、関連候補（related-candidates.json）に無いため結ばなかった。なお同社の株式数の増加は同社の株式分割によるもので、当行の分割ではない。
- relatedCompanies: 株式会社トワライズ: 特定投資株式に載るが、関連候補に無いため結ばなかった。
- relatedCompanies: アクシスITパートナーズ株式会社: 特定投資株式に載るが、関連候補のアクシス（株式会社アクシス）とは別法人で、有報の正式名称と一致しないため結ばなかった。
- relatedCompanies: career: 「キャリア形成」など一般語の一致で、社名の一致ではないため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」の部分一致のため結ばなかった。
- relatedCompanies: zero: 「ネットゼロ」など一般語の一致のため結ばなかった（ambiguous）。
- relatedCompanies: seki: 「セキュリティ」等の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: the-lead: 「リードする」という一般語の一致のため結ばなかった。
- relatedCompanies: core: 「コアＯＨＲ」等の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: base-4481: 「連結ベース」など一般語の一致のため結ばなかった。
- relatedCompanies: en: 「エンゲージメント」の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: frontier: グループのファンド名「とっとり共創フロンティアファンド」の部分一致のため結ばなかった。
- relatedCompanies: king: 「バンキング」等の部分一致のため結ばなかった。
- relatedCompanies: rent: 「カレント方式」等の部分一致のため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」一般語の一致のため結ばなかった。
- relatedCompanies: land: 「ブランド」等の部分一致のため結ばなかった。
- relatedCompanies: basic: 「ベーシック」（脱炭素アドバイザーの級）の一致のため結ばなかった。
- relatedCompanies: path: 「パーパス」の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: corona: 「新型コロナウイルス」の部分一致のため結ばなかった。
- relatedCompanies: cover: 「カバーされる」等の一般語の一致のため結ばなかった。
- relatedCompanies: nissin: 沿革の「新本店」等の部分一致で、コードリストにもない相手のため結ばなかった（ambiguous）。
- relatedCompanies: ray: 「プレイン・バニラ」等の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: vision: 「ビジョン」という一般語の一致のため結ばなかった。
- relatedCompanies: 大株主の状況の鳥取銀行従業員持株会、株式会社日本カストディ銀行（信託口）、明治安田生命保険相互会社、大樹生命保険株式会社、UBS証券株式会社、株式会社三洋商事、株式会社エヌケーシー、三信株式会社、DOSO株式会社は、関連候補に無く取引・提携の印字もないため結ばなかった。
- relatedCompanies: 連結子会社（株式会社とりぎんカードサービス）と持分法適用関連会社（とりぎんリース株式会社、とっとりキャピタル株式会社）はグループ会社であり、relatedCompanies には書かなかった（事業構造に記載）。
- terms: 助言: 用語「とりぎん」は、同行の愛称。グループ会社名（とりぎんカードサービス、とりぎんリースなど）やファンド名にも使われている。愛称自体はWikipediaの冒頭に基づく。
- terms: 助言: 用語「パーパス」は、2024年4月に制定した“地域社会の未来を「創る」「守る」「支える」”という同行の存在意義の表現。
- terms: 助言: 中期経営計画「for the FUTURE ～未来に向けて～」は、2024年度から2026年度を計画期間とする同行の中期経営計画の名称。
- terms: 助言: 用語「行内プロフェッショナル人財」は、行内資格である「スペシャリスト」「エキスパート」資格取得者を指す同行の用語。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
