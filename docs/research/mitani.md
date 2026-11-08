# 三谷商事 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三谷商事株式会社 |
| 証券コード | 8066 |
| docID（データを取り出した文書） | `S100YJ7S` |
| 原本 docID | `S100YJ7S` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ7S.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三谷商事株式会社 / 8066 / docID S100YJ7S（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 5 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 47 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitani: 10 件の数値を有報XBRLと照合
有報: 三谷商事株式会社 有価証券報告書－第109期(2025/04/01－2026/03/31) (docID S100YJ7S)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitani: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…長投資と新規事業領域への投資を進めて利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesには、主要な経営指標等の注記2（2022年改正の税効果会計基準等の遡及適用）のみを記録した。注記3の株式分割（2021年10月1日、1株につき4株）は1株当たり指標だけに影響するため入れていない。
- businessModel: 証拠パックの「財務諸表の組替え」警告について: 該当する記載は表示方法の変更（特別利益の「補助金収入」、特別損失の「固定資産売却損」等の独立掲記に伴う前年度の組替え）であり、売上高・当期純利益・総資産・純資産の系列には影響しないため、financialNotesには入れず本警告に記録した（calbeeの先例）。
- businessModel: 売上高の増減理由（GIGAスクール更新特需・Windows 10サポート終了に伴う買い替え特需の一方で燃料卸や建設資材の販売量が減少し前期並み）はMD&Aに印字されているが、flowには水準のみを書き、理由の詳細は省いた。営業利益・経常利益・持分法損益には金額・理由とも触れていない。
- businessModel: 提出後の文書（otherFilingsInWindow）は無く、重要な後発事象に相当する予定事項の記載も確認できなかったため、needsReviewは空とした。
- businessStructure: 事業の並び順は、セグメント注記の2026年3月期・外部顧客への売上高の大きい順（企業サプライ関連事業167,411百万円、生活・地域サービス関連事業140,211百万円、情報システム関連事業31,408百万円）。3区分はいずれも報告セグメントであり、「報告セグメントに含まれない」区分はない。
- businessStructure: 上場市場は表紙の印字（東京証券取引所スタンダード市場）どおりとした。
- businessStructure: Wikipediaの抜粋は有報の記載と重なる内容（商社であること、福井市と東京に本社を置くこと）のみで、有報にない補足はなかったため使わなかった。
- history: 沿革表は年月と事象が対応して印字されており、行順で対応づけた。1946年の設立行に印字された資本金の金額は、金額を沿革に書かない規則により省いた。
- history: 1914年の創業は【沿革】冒頭の叙述（前身は1914年創業の三谷商店）に基づく。
- history: 落とした行: セメント・石炭の販売再開（1948年・1949年）、各子会社の設立・買収のうち事業の転機とならないもの（福井エネルギー、西日本エネルギー、寺前生コン、クリーンガス福井、ハート光学、ミテネインターネット、鶴見石油、ウィンド・パワー、睦栄風力発電、Dama Trading、Pacific Basin Partnership、KLTグループ、シリウス、MJI UNIVERSAL、LFA Globalなど）、本社社屋の竣工・移転、サービスエリアでのレストラン経営開始、電子機器事業部の発足。
- industry: 主たる業界は trading（総合商社。最大の報告セグメントである企業サプライ関連事業は企業間取引の卸売りが中心）。
- industry: 情報システム関連事業は独立した報告セグメントとして金額が開示されているため、it を2つ目に付けた。
- industry: energy は付けなかった: 石油製品・ＬＰガス・風力発電は企業サプライ関連事業の中の一品目であり、金額が独立して開示されていないため。
- industry: telecommunications は付けなかった: ケーブルテレビ・インターネットは生活・地域サービス関連事業の中の一事業であり、金額が独立して開示されていないため。
- industry: 閉じた分類に合う値があるため taxonomyGaps は付けていない。
- relatedCompanies: 結んだのは三谷セキサン1社のみ。以下、候補ごとに結ばなかった理由を記録する。
- relatedCompanies: rent: 「レント」はゴンドラのレンタル等の一般語の一致のみで、株式会社レントへの言及ではない。
- relatedCompanies: cci-group: 特定投資株式。保有目的は全銘柄共通の定型文に「主にリース物件の販売取引があり、当社の主要取引金融機関」と続くが、金融グループであり、資金調達・リースを理由とする金融機関は結ばない規則による。
- relatedCompanies: base-4481: 「ベース」は「連結会社ベース」等の一般語の一致のみ。
- relatedCompanies: daito-trust-construction: 特定投資株式。保有目的は共通定型文と「主に建設資材の販売取引」という分類句のみで、相手固有の関係の記載がないため結ばない。
- relatedCompanies: hokuhoku-financial-group: 特定投資株式。主要取引金融機関であり、金融機関は結ばない規則による。
- relatedCompanies: ic: ambiguous。「IC」は経営方針中の投下資本の略号（EV≒IC）の一致のみで、株式会社ICへの言及ではない。
- relatedCompanies: port: 「ポート」は「サポート」等の語の一部としての断片一致のみ。
- relatedCompanies: taiheiyo-cement: 特定投資株式100株・計上額0百万円で、情報収集目的の水準。保有目的も共通定型文と分類句のみのため、取引関係の根拠にしない。
- relatedCompanies: tokio-marine-holdings: 保険会社であり、記載された関係は同社グループが提供する各種保険の取引のみ。保険取引を理由とする保険会社は結ばない規則による。
- relatedCompanies: komatsu: 有報の記載は、役員の近親者が議決権の過半数を所有するコマツサービスエース株式会社に関するもので、株式会社小松製作所との取引・資本関係の記載はない。
- relatedCompanies: land: 一般語の断片一致のみ。
- relatedCompanies: nix: 「ニックス」は連結子会社フェニックスリース株式会社の名称の一部との一致のみ。
- relatedCompanies: will: 米国デラウェア州ウィルミントン（大量保有報告書の住所）の地名の一致のみ。
- relatedCompanies: asanuma: 特定投資株式。共通定型文と「主に建設資材の販売取引」の分類句のみ。
- relatedCompanies: core: ambiguous。「勝ち組コア事業」等の一般語の一致のみ。
- relatedCompanies: cover: 「カバー」は「保険でカバーされない」等の一般語の一致のみ。
- relatedCompanies: daiwa-house-industry: 特定投資株式。共通定型文と「主に燃料の販売取引」の分類句のみ。
- relatedCompanies: fukui-computer-holdings: 特定投資株式だったが当事業年度において全て売却済み。
- relatedCompanies: fukuvi-chemical-industry: 特定投資株式。共通定型文と「各種保険の取引」の分類句のみ（実態は保険取引の記載）。
- relatedCompanies: hazama-ando: 特定投資株式。共通定型文と「主に石油化学製品の販売取引」の分類句のみ。
- relatedCompanies: hokuriku-electric-power: 特定投資株式。共通定型文と「主に建設資材の販売取引」の分類句のみ。
- relatedCompanies: infroneer-holdings: 特定投資株式。共通定型文と「主に建設資材の販売取引」の分類句のみ。
- relatedCompanies: keifuku-electric-railroad: 特定投資株式。共通定型文と「建設資材の販売及び仕入取引」の分類句のみ。
- relatedCompanies: maruzen-showa-unyu: 特定投資株式だったが当事業年度において全て売却済み。
- relatedCompanies: matsui-construction: 特定投資株式。共通定型文と分類句のみ。
- relatedCompanies: mitani-sangyo: 特定投資株式100株・計上額0百万円で「参考のため保有」。三谷セキサンとは別会社であり、【関係会社の状況】にも記載がない。
- relatedCompanies: mitsubishi-materials: 特定投資株式。共通定型文と分類句のみ。
- relatedCompanies: nicca-chemical: 特定投資株式。共通定型文と分類句のみ。
- relatedCompanies: nikkon-holdings: 特定投資株式。共通定型文と「主に燃料の販売取引」の分類句のみ。
- relatedCompanies: raito-kogyo: 特定投資株式。共通定型文と分類句のみ。
- relatedCompanies: ray: ambiguous。大量保有報告書の住所等の断片一致のみで、株式会社レイへの言及ではない。
- relatedCompanies: rengo: 特定投資株式。共通定型文と「主に燃料の販売取引」の分類句のみ。
- relatedCompanies: sankyo-tateyama: 特定投資株式。共通定型文と分類句のみ。
- relatedCompanies: sata-construction: 特定投資株式。共通定型文と分類句のみ。
- relatedCompanies: seiren: 特定投資株式で保有計上額は最大の銘柄だが、保有目的は共通定型文と「情報機器及び燃料の販売取引」の分類句のみで、相手固有の関係の記載がないため結ばない。
- relatedCompanies: shinnihon: 特定投資株式。共通定型文と分類句のみ。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式だったが当事業年度において全て売却済み。信託銀行でもある。
- relatedCompanies: sumitomo-osaka-cement: 特定投資株式。共通定型文と「主にセメントの仕入取引及び建設資材の販売取引」の分類句のみ。
- relatedCompanies: the-yokohama-rubber: 特定投資株式。共通定型文と「主に石油化学製品の販売取引」の分類句のみ。
- relatedCompanies: tobishima-holdings: 特定投資株式700株。共通定型文と分類句のみ。
- relatedCompanies: toda: 特定投資株式。共通定型文と「主に建設資材の販売取引」の分類句のみ。
- relatedCompanies: tohbu-network: 特定投資株式。共通定型文と分類句のみ。
- relatedCompanies: toyobo: 特定投資株式。共通定型文と「主に建設資材の販売取引」の分類句のみ。
- relatedCompanies: yahagi-construction: 特定投資株式。共通定型文と「主に燃料の販売及び仕入取引」の分類句のみ。
- relatedCompanies: 候補外の記録: ＵＢＥ三菱セメント株式会社は【大株主の状況】に載る事業会社（2.34％、2026年3月31日現在）だが related-candidates.json に無いため、候補の中からだけ選ぶ規則により結ばなかった。その他の大株主は財団・個人・外国ファンド等で候補にない。
- relatedCompanies: 判断の記録: 特定投資株式の各銘柄には取引の分類（建設資材の販売等）が印字されているが、保有目的の本文は全銘柄共通の定型文であり、分類句も少数の型の繰り返しであるため、相手固有の関係の記載とはみなさず結ばなかった（calbee・ミツウロコグループホールディングス等の先例）。
- terms: 登録候補（助言のみ）: ゴンドラ（建物の外壁清掃・保守などに使う作業用ゴンドラ。同社は製造・販売・レンタルを行う）、TQM（全部門で仕事の品質を高める改善活動。同社が付加価値の拡大策として取り組む）、PMI（買収後の事業の見える化・統合・改善プロセス。同社の新規事業投資の進め方）、付加価値（同社の定義では、お客様が製品・サービスから得る価値で、総利益にほぼ等しいとされる経営指標）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
