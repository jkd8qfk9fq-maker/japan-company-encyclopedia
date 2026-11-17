# 島精機製作所 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社島精機製作所 |
| 証券コード | 6222 |
| docID（データを取り出した文書） | `S100YIO7` |
| 原本 docID | `S100YIO7` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIO7.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E5%B3%B6%E7%B2%BE%E6%A9%9F%E8%A3%BD%E4%BD%9C%E6%89%80

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社島精機製作所 / 6222 / docID S100YIO7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shima-seiki-mfg: 10 件の数値を有報XBRLと照合
有報: 株式会社島精機製作所 有価証券報告書－第65期(2025/04/01－2026/03/31) (docID S100YIO7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
shima-seiki-mfg: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画「Ever Onward 2026」の2027年3月期の経営目標（連結売上高410億円、営業利益３億円、経常利益10億円、親会社株主に帰属する当期純利益９億円、ROE1.1％以上）と連結配当性向40％の目安は、利益・投資指標のため本文と戦略には入れず、ここに記録する。
- businessModel: セグメント利益、営業損失、経常利益、受注高・受注残高の金額は、本文に書ける財務数値が売上高と当期純利益だけのため、本文に入れていない（有報のMD&Aとセグメント注記に印字がある）。
- businessModel: 金額はいずれも有報の百万円印字をそのまま引用した。千円単位への換算や億円表記への書き換えはしていない。
- businessModel: suppliers はこのツリー（旧スキーマ）にキーが無いため省略した。部品の製造委託（連結子会社のシマファインプレス、海南精密）と材料の購入（東洋紡糸工業）の事実は businessStructure の warnings に記録した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とし、報告セグメントに含まれない「その他」は金額が2番目に大きいが規則により最後に置いた。
- businessStructure: 製品の一部部品は連結子会社の株式会社シマファインプレスと株式会社海南精密に製造を委託し、組立用部品として購入している（【事業の内容】の印字）。東洋紡糸工業株式会社からは材料を購入している（【関係会社の状況】の印字）。
- businessStructure: 非連結子会社の株式会社イノベーションファクトリーは株式会社ファーストリテイリングが51％、当社が49％を出資する会社で、繊維製品の製造販売を行っている（【沿革】・【事業の内容】の印字）。
- history: 登記上の設立年月日は1976年8月24日で、1989年4月に株式額面金額の変更のため実質上の存続会社である（旧）株式会社島精機製作所を吸収合併した経緯がある。有報の注記どおり、沿革は実質上の存続会社について記載した。
- history: 創業者名（島正博）は有報に印字がなく、Wikipedia「島精機製作所」の補足として1961年の行にのみ用いた。数値はWikipediaから一切使っていない。
- history: 沿革のうち営業所開設・展示会出展などの細目は、会社の転機となる出来事に絞って省略した。
- industry: 横編機、デザインシステム（裁断機等の機械を含む）、手袋靴下編機はいずれも機械であり、連結売上高の大半を占めるため machinery を主たる業界とした。閉じた集合に繊維機械の区分は無いが、機械が実態に合うため taxonomyGaps は付けていない。
- industry: デザインシステム関連事業にはソフトウェアのサブスクリプションも含まれるが、金額は自動裁断機等のハードウェアと一体のセグメント単位でしか開示されていないため、it は付けなかった。
- relatedCompanies: toyobo（東洋紡）: 有報の「東洋紡」は連結子会社「東洋紡糸工業株式会社」（当社製品の材料の購入先）の表記に現れるもので、上場会社の東洋紡株式会社とは別法人であり、同社との関係の記載もないため結ばなかった。
- relatedCompanies: fast-retailing（ファーストリテイリング）: 非連結子会社の株式会社イノベーションファクトリーへの出資（51％）の記載はあるが、当社自身との取引・提携の記載ではなく当社の子会社への出資関係のため、当社の関連企業としては結ばず、沿革と事業構造の判断記録に事実を残した。
- relatedCompanies: the-kiyo-bank（紀陽銀行）: 大株主の状況に7.71％を保有する株主として載り、特定投資株式も保有するが、保有目的が「主要な取引金融機関であり、資金調達等財務活動の円滑化及び金融情勢等の情報収集」と資金調達・金融取引の理由であり、金融機関のため結ばなかった。
- relatedCompanies: mizuho-financial-group、sumitomo-mitsui-financial-group、senshu-ikeda-holdings: 特定投資株式の保有目的がいずれも「主要な取引金融機関」としての財務活動の円滑化・情報収集で、資金調達関係のため結ばなかった。三菱UFJフィナンシャル・グループは当期に全株式を売却済みのため結ばなかった。
- relatedCompanies: okuwa（オークワ）: 保有目的が「地元企業である同社との良好な関係維持及び取引強化を図るため」と地元関係の定型的な記載で、取引の役割や分野の個別記載がないため結ばなかった。
- relatedCompanies: sugai-chemical-industry（スガイ化学工業）: オークワと同一の地元関係の記載で、個別の取引役割の記載がないため結ばなかった。
- relatedCompanies: NAMESON HOLDINGS LIMITED: 特定投資株式に「営業上の主要な取引先」として記載があり当社が19,390,000株を保有するが、海外の会社で関連企業候補に無く百科事典の登録対象でもないため結ばなかった。事実はここに記録する。
- relatedCompanies: toyota-industries-6201（豊田自動織機）: 沿革にデザインシステムAPEX-Tの共同開発（2015年11月）の記載があるが、過去の共同開発の事実のみで現在の取引・提携関係の記載がないため関連企業としては結ばず、沿革の出来事として記録した。
- relatedCompanies: path、port、seki、career、cota、core、base-4481、corona、en、freee、land、the-lead、thinca、nissin、trust、yamadai、innovation: 社名の文字列一致のみで、有報に当該上場会社との関係の記載がないため結ばなかった（innovation は当社子会社の「イノベーションファクトリー」の略称との一致）。
- terms: 助言のみ: この会社の固有の用語として「ホールガーメント（完全無縫製）」「横編機」「デザインシステム」が解説候補になる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
