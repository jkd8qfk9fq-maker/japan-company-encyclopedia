# 日本化薬 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本化薬株式会社 |
| 証券コード | 4272 |
| docID（データを取り出した文書） | `S100YD4R` |
| 原本 docID | `S100YD4R` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD4R.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E5%8C%96%E8%96%AC

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本化薬株式会社 / 4272 / docID S100YD4R（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-kayaku: 10 件の数値を有報XBRLと照合
有報: 日本化薬株式会社 有価証券報告書－第169期(2025/04/01－2026/03/31) (docID S100YD4R)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-kayaku: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全行一致し、会計基準の変更・決算期の変更・変則決算はないため、financialNotesは空とした。
- businessModel: 長期経営計画Phase1の数値目標のうち売上高以外のもの（営業利益、ROE、税引後ROIC）は、文章の規則によりperspectivesに書いていない。
- businessModel: 重要な後発事象の自己株式の取得（2026年5月12日取締役会決議、上限13,000,000株・15,000百万円、2026年5月13日から2027年3月31日までの市場買付け）と自己株式の消却（11,300,000株、2026年5月22日予定）は通常の資本政策のため、needsReviewには入れず、この警告に記録する。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高（2026年3月期）の大きい順（モビリティ＆イメージング94,714百万円、ファインケミカルズ74,142百万円、ライフサイエンス72,994百万円）とした。
- businessStructure: 各事業領域内の売上区分（セイフティシステムズ、機能性材料、医薬など）は金額が独立して開示されていないため、childrenは金額なしとし、その旨を各説明に明記した。
- businessStructure: 設備と事業の対応は有報のセグメント欄どおり（セイフティ本社工場・上越工場はモビリティ＆イメージング、福山・厚狭・東京工場はファインケミカルズ、高崎・鹿島工場はライフサイエンス。本社は全社（共通）のため、どの事業にも結びつけていない）。
- history: 【沿革】は年月と事象が一体で印字されており、印字どおりに対応づけて採用した。
- history: 1916年の設立への鈴木商店・金子直吉の関与だけは有報に記載がない補足としてWikipediaから加え、出典を併記した。数値はWikipediaから採っていない。
- history: 子会社・関係会社の設立、資本参加、清算などの行（1977年厚和産業設立、1995年日本化薬フードテクノ設立、海外子会社の設立・清算、2025年化薬（上海）管理有限公司の清算など）は、会社の骨格に関わるもの以外を省略した。
- industry: 3つの報告セグメントはいずれも化学製品の製造・販売であり、最大のモビリティ＆イメージング事業領域も火工品技術に基づく化学製品が中心のため、chemicalsを主たる業界とした。
- industry: 機能性材料ではMEMS用レジスト、LCD・半導体用クリーナー、半導体製造装置（ラミネーター、リムーバー、マウンター、UV照射機）が製品として開示され、半導体市況の拡大が業績の背景として述べられているため、semiconductorsを2つ目に付けた。
- industry: 医薬はライフサイエンス事業領域の一区分で、金額が独立して開示されていないため、pharmaceuticalsは付けていない。自動車安全部品もモビリティ＆イメージング事業領域の一区分であり独立した金額がないため、automotiveは付けていない。
- relatedCompanies: ソレイジア・ファーマは、【重要な契約等】にダルビアス（ダリナパルシン）のライセンス契約（2021年10月26日締結、ロイヤリティの支払い）が印字され、特定投資株式の保有目的も「研究・開発・販売先」と相手固有のため、technologyとして結んだ。
- relatedCompanies: 特定投資株式の保有目的が事業領域と取引の向き（販売先／調達先）を銘柄ごとに印字し、保有株式数も実質的な水準にある相手は、向きが単一のものをsupplier／customerとして結んだ。販売・調達の双方が印字される相手は向きを特定できないためbusiness-partnerとした。計上額は書いていない。
- relatedCompanies: 候補「旭化成」（asahi-kasei）は、【沿革】2008年の産業火薬事業統合で旭化成ケミカルズ株式会社（当時の子会社）が統合当事者として現れるだけで、過去の1回限りの統合であり、旭化成自身との現在の取引・資本関係の記載がないため結ばなかった。
- relatedCompanies: 候補「日鉄鉱業」（nittetsu-mining）は、特定投資株式の保有目的が「グループ会社における販売先」と、当社との直接の取引の向きが明確でないため結ばなかった。
- relatedCompanies: 候補「めぶきフィナンシャルグループ」（mebuki-financial-group）、「群馬銀行」（the-gunma-bank）、「阿波銀行」（the-awa-bank）は、保有目的が安定的な資金調達であり、銀行は資金調達を理由に結ばない規則のため結ばなかった。
- relatedCompanies: 候補「SOMPOホールディングス」（sompo-holdings）は、保有目的が損害保険などにおける財務取引関係であり、保険取引を理由に結ばない規則のため結ばなかった。
- relatedCompanies: 候補「明治ホールディングス」（meiji-holdings）、「三菱UFJフィナンシャル・グループ」（mitsubishi-ufj-financial-group）、「豊田通商」（toyota-tsusho）、「信越化学工業」（shin-etsu-chemical）、「三井住友トラストグループ」（sumitomo-mitsui-trust-group）、「カイノス」（kainos-laboratories）は、当事業年度の株式数が「－」で検証の結果売却済みと印字され、現在保有していないため結ばなかった。カイノスはlistingも（コードリストにない）である。
- relatedCompanies: 大株主の状況（2026年3月31日現在）の上位は信託銀行の信託口、カストディ銀行、常陽銀行、明治安田生命保険相互会社などの金融機関と、中外産業株式会社（2.32％、候補リストにない非上場の事業会社）であり、事業会社の候補はいないため、major-shareholderのリンクは作っていない。
- relatedCompanies: 持分法適用関連会社のカヤク・ジャパン株式会社（50.0％）、株式会社カルティベクス（37.3％）、化薬ヌーリオン株式会社（25.0％）、三光化学工業株式会社（45.0％）と、連結子会社37社は、いずれも上場しておらず候補リストにないため結んでいない。
- relatedCompanies: 候補リストにない相手の記録: Adlai Nortye Ltd.は特定投資株式として1,739,130株を保有し、ライフサイエンス事業領域における日本での開発・販売の関係強化が目的と印字されるが、候補リストにないため結んでいない。AstraZeneca UK Limited及びアストラゼネカ株式会社（ゾラデックスの製造販売承認承継契約の相手）、株式会社富士薬品（株式取得の決議先）も候補リストにない。
- relatedCompanies: 候補「エン」（en）はambiguousで、「エンゲージメント」等の一般語への断片一致のため結ばなかった。
- relatedCompanies: 候補「キャリア」（career）は、「キャリア採用者」という一般語への一致のため結ばなかった。
- relatedCompanies: 候補「ポート」（port）は、自社施設名「ポートプラザ日化」への一致のため結ばなかった。
- relatedCompanies: 候補「ビジョン」（vision）は、「企業ビジョン」という一般語への一致のため結ばなかった。
- relatedCompanies: 候補「ベース」（base-4481）は、「約定ベース」「受渡ベース」という一般語への一致のため結ばなかった。
- relatedCompanies: 候補「コア」（core）はambiguousで、一般語への断片一致のため結ばなかった。
- relatedCompanies: 候補「リオン」（rion）は、持分法適用関連会社の社名「化薬ヌーリオン」の断片への一致で、リオン株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: 候補「高速」（kohsoku）はambiguousで、「次世代高速通信」という一般語への一致のため結ばなかった。
- relatedCompanies: 候補「ランド」（land）は、連結子会社ニッポンカヤク（タイランド）の社名の断片への一致のため結ばなかった。
- relatedCompanies: 候補「イノベーション」（innovation）は、「イノベーション創出力」という一般語への一致のため結ばなかった。
- relatedCompanies: 候補「ナイガイ」（naigai）は、【沿革】に現れる日化実業株式会社が合併した内外興業株式会社・株式会社ナイガイニッカ（当社グループの旧子会社）への一致で、株式会社ナイガイとの関係の記載がないため結ばなかった。
- relatedCompanies: 候補「レント」（rent）は、「タレントマネジメント」という一般語の断片への一致のため結ばなかった。
- relatedCompanies: 候補「リックス」（rix）は、「マテリアリティマトリックス」という一般語の断片への一致のため結ばなかった。
- relatedCompanies: 候補「ゼロ」（zero）はambiguousで、「ゼロエミッション」という一般語への一致のため結ばなかった。
- relatedCompanies: 候補「カバー」（cover）は、MD&Aの「カバーし」という動詞への一致のため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言扱い（登録は別工程）。インフレータ、マイクロガスジェネレータ、スクイブ、火工品、特定投資株式を、この会社の事業と成り立ちを理解するうえで中心的な語として選んだ。

## 要確認（status に反映）

- businessModel: 2026年3月30日開催の取締役会で、株式会社富士薬品の医薬品製造事業の一部を承継する会社の株式を取得することを決議し、富士薬品と株式譲渡契約を締結しているが、その会社は2026年3月31日現在の【関係会社の状況】に含まれていない。本文は2026年3月31日現在のグループ構成で書いた。取得の完了時期は証拠パックの範囲では確認できない。
- businessModel: 2026年5月21日（期末後）に、AstraZeneca UK Limitedとの間で、抗悪性腫瘍ホルモン剤「ゾラデックス」の日本における製造販売承認の承継に関する契約を締結し、契約一時金を支払っているが、承継時期は確定していない。本文は2026年3月31日現在の事業内容で書いた。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
