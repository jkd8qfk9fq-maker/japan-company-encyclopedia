# リプロセル — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社リプロセル |
| 証券コード | 4978 |
| docID（データを取り出した文書） | `S100YLVF` |
| 原本 docID | `S100YLVF` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLVF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社リプロセル / 4978 / docID S100YLVF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
reprocell: 10 件の数値を有報XBRLと照合
有報: 株式会社リプロセル 有価証券報告書－第24期(2025/04/01－2026/03/31) (docID S100YLVF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
reprocell: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記1〜3は、潜在株式調整後1株当たり当期純利益・自己資本利益率・株価収益率を記載しない理由に関する表示事項のみであり、会計基準の変更・決算期変更・株式分割・変則決算の事実はないため、financialNotes は空とした。
- businessModel: セグメント関連情報の地域別売上高で「英国」「インド」の表示を「欧州」「その他」に含める表示方法の変更があり、前期分も新しい区分で組み替えられている。これは地域別情報の表示区分の変更であり、連結経営指標等の数値に影響しないため、financialNotes には入れず、この記録にとどめた。前期有報との照合（修正再表示チェック）は全系列で差異なしだった。
- businessModel: 重要な後発事象として、2026年5月27日の取締役会決議による第三者割当の新株式発行と新株予約権発行のプログラム（割当予定先は米国の機関投資家が運用するCVI Investments, Inc.）が印字されている。決算期後の資本政策の事項であり、期末現在の構成に影響しないため needsReview には入れず、この記録にとどめた。金額は書かない。
- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益だけに限り、セグメント利益・研究開発費・設備の帳簿価額などの金額は書かなかった。地域別の売上高も書かなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（研究支援事業1,952百万円、メディカル事業281百万円）とした。子区分は【事業の内容】の区分によるもので、金額は独立して開示されていないため各子区分に金額は書かず、その旨を明記した。
- businessStructure: 本社はセグメント欄が「－」のため、どの事業にも結びつけなかった。研究室は有報のセグメント欄どおり研究支援事業・メディカル事業に分かれている。在外子会社はREPROCELL USA Inc.（研究支援事業・メディカル事業）、REPROCELL Europe Ltd.（研究支援事業）、Bioserve Biotechnologies India Pvt. Ltd.（研究支援事業）である。
- businessStructure: 旧スキーマのため suppliers キーは省略した。供給・導入の事実は次のとおり: 細胞測定機器はドイツのナニオンテクノロジーズ社・フランスのインターサイエンス社・ドイツのイノメ社から導入・販売している。ステムカイマルは台湾のSteminent Biotherapeutics Inc.から導入した製品である。
- businessStructure: 連結子会社は5社（REPROCELL USA Inc.、REPROCELL Europe Ltd.、RCパートナーズ株式会社、株式会社MAGiQセラピューティクス、Bioserve Biotechnologies India Pvt. Ltd.）で、いずれも自社の子会社のため関連企業には結ばなかった。
- history: 沿革の年月と事象は行順で対応づけられている印字であり、採用した行はすべて対応が確認できた。設立時の資本金額は規則により書かなかった。
- history: 2026年5月の「株式及び新株予約権発行プログラム」による資金調達の決定は、決算期後の資本政策の事項のため沿革には入れず、businessModel の warnings に記録した。
- history: 本店移転（2003年・2007年・2010年）、研究所の設立、特許成立、補助金・助成事業への採択、新型コロナウイルス関連の検査サービス開始などの行は、事業の転機となる行を優先して省いた。
- industry: 主たる業界は pharmaceuticals とした。研究支援事業はiPS細胞関連の研究用製品・受託サービスで創薬研究を支援する事業、メディカル事業は再生医療等製品の開発事業であり、閉じた分類では医薬品が最も近い。分類の不足ではなく当てはめの問題と判断し、taxonomyGaps には書かなかった。
- relatedCompanies: kringle-pharma: 特定投資株式の保有目的が「研究支援事業における事業機会の創出や協業関係の強化」と個別に印字されており、協業を目的とする資本関係があるため business-partner とした。計上額は書いていない。
- relatedCompanies: corona: 「新型コロナウイルス」の部分一致のみで、株式会社コロナとの関係の記載がないため結ばなかった。
- relatedCompanies: core: 「スコア」等の部分一致（ambiguous）のみで、株式会社コアとの関係の記載がないため結ばなかった。
- relatedCompanies: base-4481: 「ベースライン」の部分一致のみで、ベース株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: innovation: 「ライフイノベーションセンター」の部分一致のみで、株式会社イノベーションとの関係の記載がないため結ばなかった。
- relatedCompanies: king: 「バンキング」の部分一致のみで、株式会社キングとの関係の記載がないため結ばなかった。
- relatedCompanies: land: 「メリーランド州」の部分一致のみで、株式会社ランドとの関係の記載がないため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」の部分一致のみで、レック株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: cover: 「カバーする」という一般語の一致のみで、カバー株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: en: 「インターサイエンス社」等の部分一致（ambiguous）のみで、エン株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: idea-consultants: 「いであ」という一般語の一致のみで、いであ株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」の部分一致のみで、ポート株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: technologies: 「ナニオンテクノロジーズ社」という別法人の社名の部分一致のみで、株式会社テクノロジーズとの関係の記載がないため結ばなかった。
- relatedCompanies: asahi-kasei: 印字されているのは「旭化成酸素」という別の法人の名称であり、旭化成株式会社そのものではないため結ばなかった。
- relatedCompanies: kel: 「ファンケル」の部分一致のみで、ケル株式会社との関係の記載がないため結ばなかった。共同開発の相手は株式会社ファンケルであり、候補には含まれていない。
- relatedCompanies: seed: 「シードクローン」という一般語の一致のみで、株式会社シードとの関係の記載がないため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」等の部分一致（ambiguous）のみで、セキ株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: tear: 「リプロレジストリ（ReproRegistry）」の部分一致のみで、株式会社ティアとの関係の記載がないため結ばなかった。
- relatedCompanies: vision: 「ビジョン」という一般語の一致のみで、株式会社ビジョンとの関係の記載がないため結ばなかった。
- relatedCompanies: 候補にない相手: iPSアカデミアジャパン株式会社（特許ライセンス契約の相手）、Steminent Biotherapeutics Inc.（ステムカイマルの導入元）、Q Therapeutics Inc.（合弁相手）、株式会社ファンケル（感覚神経細胞の共同開発）はいずれも候補一覧にないため結ばず、事実は businessStructure・history に記録した。
- terms: 用語の助言: 「iPS細胞」は人工多能性幹細胞で、同社グループの中核技術です。「RNAリプログラミング」は、ウイルス等を使わずRNAでiPS細胞を作製する同社の基盤技術です。「ステムカイマル」は台湾のSteminent社から導入した脂肪由来間葉系幹細胞製品で、脊髄小脳変性症を対象とします。「TIL療法」は患者のがん組織から採取した腫瘍浸潤リンパ球を培養して投与する免疫療法です。「GPC-1 CAR-T療法」はグリピカン1を標的とする免疫細胞療法です。「StemEdit」はAI設計ゲノム編集システムを基盤とする臨床用遺伝子編集サービス、「マスターセルバンク（MCB）」は製造の出発材料となる細胞の保管単位、「パーソナルiPS」は将来の疾患に備えて個人のiPS細胞を作製・保管するサービス、「ウェルミル」は唾液等を用いる郵送検査サービスです。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
