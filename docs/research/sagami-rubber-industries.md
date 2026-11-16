# 相模ゴム工業 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 相模ゴム工業株式会社 |
| 証券コード | 5194 |
| docID（データを取り出した文書） | `S100YL8G` |
| 原本 docID | `S100YL8G` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL8G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 相模ゴム工業株式会社 / 5194 / docID S100YL8G（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sagami-rubber-industries: 10 件の数値を有報XBRLと照合
有報: 相模ゴム工業株式会社 有価証券報告書－第93期(2025/04/01－2026/03/31) (docID S100YL8G)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sagami-rubber-industries: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益だけに限定した。セグメント利益や営業利益・経常利益等の金額・増減理由は書いていない。
- businessModel: 【経営方針、経営環境及び対処すべき課題等】に印字される経営指標（営業利益率、自己資本利益率、営業キャッシュ・フロー、純資産比率など）は投資指標に当たるため、本文・perspectivesには書いていない。MD&Aに印字される2026年３月期の計画値と実績値の対比も書いていない。
- businessModel: 受注は大部分が見込生産のため受注高の記載はなく、書いていない。
- businessModel: Wikipediaの記事（「相模ゴム工業」、証券コードで同一性を確認）は見つかったが、冒頭の記述は本社所在地とコンドームメーカーである旨で、有報の記載を超える補足がないため出典として使っていない。
- businessModel: perspectivesにはリンク記法を使っていない（このツリーでは表示対象のフィールドではないため）。
- businessModel: 主要な経営指標等の推移に株式分割・決算期変更・会計方針の変更の注記はなく、financialNotesは空とした。介護サービス事業の譲渡・閉鎖（2025年9月末）は当期中の出来事であり、事業構造の説明に記載した。
- businessStructure: 事業の並びはセグメント情報の外部顧客への売上高の大きい順とし、報告セグメントに含まれない「その他」は最後に置いた。千円単位を百万円に切り捨てた事業別売上高の合計は5,909百万円で、印字の合計5,911百万円と2百万円差があるが、印字どおりとした。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。仕入先の個別名は【事業の内容】に印字がない。
- businessStructure: 設備と事業の対応は【主要な設備の状況】のセグメント欄どおりとした。本社・厚木工場は「ヘルスケア事業 全社(共通)」、関西営業所と渋谷オフィスは「ヘルスケア事業 プラスチック製品事業」の連記行のため、特定の事業に結びつけなかった。静岡工場・福岡工場はプラスチック製品事業、在外子会社2社の拠点はヘルスケア事業と印字されている。帳簿価額は書いていない。
- businessStructure: 【関係会社の状況】の抜粋では持分法適用関連会社は「１社」とだけ印字され社名が確認できなかったため、構造の説明には含めていない。連結子会社2社（株式会社ラジアテックス、相模マニュファクチャラーズ有限公司）は事業の説明の中で扱った。
- history: 年だけを記載し、月は書いていない。資本金の金額は書いていない。
- history: 2026年１月の東京営業所の渋谷区への移転（渋谷オフィスへの改称）は営業所の移転のみの行のため落とした。1940年の北支護謨乳液化学有限公司の設立と1942年の合併・改名、1952年の相模プラスチック工業株式会社の設立、工場の新設・移転のみの行（1965年、1973年、1977年、1986年、1991年、1994年）、1984年のインドネシア国営コンドームプラントの成約、1988年の巡回入浴サービス業務への着手、2002年のマレーシア子会社の生産設備増設も、構造の変化を伴わないか主要な転機ではないため落とした。
- industry: 主たる業界は、連結売上高の約8割を占めるヘルスケア事業がコンドームや医療用ゴム製品などの医療・ヘルスケア製品の製造・販売であるため、閉じた分類で最も近い pharmaceuticals を暫定とした。医療・ヘルスケア製品そのものの区分が無いため taxonomyGaps に記録した。プラスチック製品事業には2つ目の業界を付けていない。
- relatedCompanies: maruto-sangyo（丸東産業株式会社）: 特定投資株式として100株を保有するのみで、保有目的は「プラスチック事業における取引関係の強化のため」という定型的な記載であり、具体的な取引は本文に印字されていないため結ばなかった。
- relatedCompanies: mitsubishi-chemical-group（三菱ケミカルグループ株式会社）: 特定投資株式として保有するのみで、保有目的は「ヘルスケア事業における取引関係の強化のため」という定型的な記載であり、具体的な取引は本文に印字されていないため結ばなかった。
- relatedCompanies: tokuyama（株式会社トクヤマ）: 特定投資株式として保有するのみで、具体的な取引は本文に印字されていないため結ばなかった。
- relatedCompanies: toppan-holdings（TOPPANホールディングス株式会社）: 特定投資株式として保有するのみで、具体的な取引は本文に印字されていないため結ばなかった。
- relatedCompanies: sundrug（株式会社サンドラッグ）: 特定投資株式として保有するのみで、具体的な取引は本文に印字されていないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group、tokyo-kiraboshi-financial-group、yokohama-financial-group: いずれも「財務面の取引関係の強化のため」を目的とする特定投資株式の保有であり、資金調達・金融取引を理由とする金融機関のため結ばなかった。横浜フィナンシャルグループ傘下の株式会社横浜銀行が当社株式の4.95％（2026年3月31日現在）を保有する点も、金融機関との取引関係の範囲である。
- relatedCompanies: en（エン株式会社）: 「エンゲージメント」の部分一致のみのため結ばなかった。
- relatedCompanies: taya（株式会社田谷）: 「世田谷区」の部分一致のみのため結ばなかった。
- relatedCompanies: cota（コタ株式会社）: 「インコタームズ」の部分一致のみのため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 「ゼロゼロツー」という製品名の読みの一致のみのため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「営業利益ベース」の部分一致のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「ポートフォリオ」の部分一致のみのため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 新型コロナウイルス感染症への言及のみのため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「ブランド」の部分一致のみのため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguous で、「セキュリティ」の部分一致のみのため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: ピップ株式会社は【主要な顧客ごとの情報】に印字される主要な顧客で、2026年3月期の売上高は総販売実績に対する割合44.7％を占めるが、候補一覧にないため結んでいない。相模産業株式会社は関連当事者で当社製品の一部を販売し、当社株式の2.99％（2026年3月31日現在）を保有するが、候補一覧にないため結んでいない。連結子会社2社は自社の子会社のため関連企業に含めない。
- terms: 用語の助言のみ。「サガミオリジナル」は製品ブランド名として扱い、固有の用語登録は提案しない。「巡回入浴」は介護サービスの一般的な呼称として扱った。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] sagami-rubber-industriesの主たる業界（ヘルスケア事業） → 提案: 医療機器・ヘルスケア製品。ヘルスケア事業が連結売上高の約8割を占め、コンドームや医療用ゴム製品などの医療・ヘルスケア製品の製造・販売が中核であり、医薬品の製造・販売は行っていません。閉じた分類に医療・ヘルスケア製品の区分がなく、最も近い pharmaceuticals を暫定としました。
