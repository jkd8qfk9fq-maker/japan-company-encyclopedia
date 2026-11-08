# 極洋 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　極洋 |
| 証券コード | 1301 |
| docID（データを取り出した文書） | `S100YE8K` |
| 原本 docID | `S100YE8K` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE8K.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　極洋 / 1301 / docID S100YE8K（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kyokuyo: 10 件の数値を有報XBRLと照合
有報: 株式会社　極洋 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YE8K)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kyokuyo: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社極洋」が EDINET の提出者名「株式会社　極洋」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…流、販売などの費用を差し引いた残りが利益になります。2026年3月期のは6,…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務数値は売上高と親会社株主に帰属する当期純利益だけを書き、営業利益・経常利益の金額や増減率は規則により書いていない。純利益の増減理由も書いていない。
- businessModel: 修正再表示チェックは前期有報との重複年度が全項目一致したため、financialNotes は空にした。
- businessModel: 財務諸表の組替えの記載は、連結貸借対照表の表示方法の変更（流動資産の「商品及び製品」の一部を「原材料及び貯蔵品」に含めて表示し、前期の連結財務諸表を組み替えたもの）と損益計算書の表示変更であり、売上高・当期純利益・総資産・純資産の系列には影響しないため、financialNotes には書かなかった（calbeeの先例）。
- businessModel: 中期経営計画の定量目標は規則により perspectives に書いていない。
- businessModel: Wikipedia（極洋）の冒頭は本社所在地と事業の説明で有報と重なるため、補足には使わなかった（ロゴ表記の「キョクヨー」のみ、本文には使っていない）。
- businessModel: 第104期からの水産加工事業セグメント新設と、期後の合弁解消・株式取得は、businessModel では触れず needsReview に記録した。
- businessStructure: 事業の並び順は、セグメント情報の2026年3月期の外部顧客への売上高の大きい順（水産事業195,039百万円、生鮮事業71,725百万円、食品事業65,528百万円、物流サービス1,737百万円、その他581百万円）。
- businessStructure: 「その他」は名前が「その他」でも報告セグメントであるため、売上順の最後に置いた。
- businessStructure: 第104期より新設が予定されている水産加工事業セグメントは、2026年3月期の報告セグメントではないため事業には含めていない（needsReviewに記録）。
- businessStructure: shortNameEn は表紙の英訳名「KYOKUYO CO.,LTD.」から採った。
- history: 設立時の資本金（500万円）は、金額を沿革に書かない規則により省略した。
- history: 工場新設・研究所新設・ISO14001認証取得・本社移転などの細目の行と、子会社設立・連結子会社化の細目の多く（1970年八戸冷凍工場、1984年キョクヨーフーズ、2005年青島極洋貿易、2006年Kyokuyo Europe B.V.、2007年キョクヨーマリンファーム、2008年ジョッキ連結子会社化、2010年海洋フーズ取得、2019年クロシオ水産取得、2022年Kyokuyo Vina Foods設立、2025年倉吉工場竣工など）は、主要な転換点に絞るため落とした。
- history: 2026年の合弁解消は【沿革】ではなく重要な後発事象の注記に基づく。取締役会決議（2026年5月15日）の事実として書き、完了形では書いていない。
- industry: 主たる事業は水産物の買付・加工・販売と食品の製造販売であり、売上高の大半を水産事業・生鮮事業・食品事業が占めるため、food を主たる業界とした。
- industry: 物流サービスは報告セグメントとして独立開示されており（2026年3月期の外部顧客への売上高1,737百万円）、冷蔵倉庫業と利用運送事業を行うため、transportation を2つ目に付けた。金額は売上全体の0.5％程度と小さい。
- industry: 「その他」の保険代理店業は金額が小さく（581百万円）、finance は付けなかった。
- industry: 閉じた分類に合う値があるため taxonomyGaps は付けていない。
- relatedCompanies: 特定投資株式の保有目的は、相手ごとに事業内容と関係するセグメント名が個別に印字されており（全銘柄共通の定型句ではない）、「水産物の主要な販売先」と向きが明記された5社を customer、「重要な取引先」とのみ記され向きの印字がない17社を business-partner として結んだ。判断を覆せるようここに記録する。
- relatedCompanies: 大株主のうち事業会社は東洋製罐グループホールディングス（2.63％）のみを major-shareholder として結び、信託銀行・銀行・農林中央金庫・個人・取引先持株会・従業員持株会は結んでいない。
- relatedCompanies: career: 「キャリアデザイン研修」など一般語としての出現のみで、株式会社キャリアとの取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: port: 「サポート」の断片一致であり、ポート株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: densan: セグメント注記の「電算機及びソフトウェア」（管理部門の設備）のことであり、株式会社電算ではないため結ばなかった（ambiguous）。
- relatedCompanies: en: 文中の断片一致であり、エン株式会社との関係の記載はないため結ばなかった（ambiguous）。
- relatedCompanies: path: 企業パーパスの「パーパス」の断片一致であり、パス株式会社ではないため結ばなかった（ambiguous）。
- relatedCompanies: suzuki-6785: 監査役の個人名「鈴木淳二」の一致であり、株式会社鈴木ではないため結ばなかった（ambiguous）。
- relatedCompanies: will: 「コンピューターウィルス」の断片一致であり、株式会社ウィルとの関係の記載はないため結ばなかった。
- relatedCompanies: cover: 「カバーしきれない」の断片一致であり、カバー株式会社との関係の記載はないため結ばなかった。
- relatedCompanies: land: 市販用ブランド「シーマルシェ」の断片一致であり、株式会社ランドではないため結ばなかった。
- relatedCompanies: marche: 「シーマルシェ」の断片一致であり、株式会社マルシェではないため結ばなかった。
- relatedCompanies: fuji-8278: 特定投資株式に印字されるのは株式会社フジオフードシステムであり、候補の株式会社フジ（8278）とは別会社のため結ばなかった（ambiguous）。
- relatedCompanies: mitsubishi-shokuhin: 当事業年度は保有がなく（前事業年度3,000株、当事業年度は「―」表示で当期に売却済み）、listing もコードリストにないため結ばなかった。
- relatedCompanies: olympic-group: 特定投資株式に食品事業セグメントにおける重要な取引先として記載があるが、listing がコードリストになく結べなかった。
- relatedCompanies: mitsubishi-ufj-financial-group / resona-holdings / sumitomo-mitsui-trust-group / sumitomo-mitsui-financial-group: 「資金運用・調達などの主要な取引先金融機関」としての保有であり、資金調達が理由のため結ばなかった。
- relatedCompanies: hokuhoku-financial-group / iyogin-holdings / the-77-bank: 連結子会社を含む当社グループの取引先金融機関としての保有であり、結ばなかった。
- relatedCompanies: 候補にない相手の記録: 株式会社FOOD & LIFE COMPANIES（生鮮事業セグメントにおける重要な取引先、1,110,800株を保有）、株式会社Genki Global Dining Concepts（同）、株式会社フジオフードシステム（食品事業セグメントにおける重要な取引先）は候補にないため結んでいない。重要な後発事象の相手方であるGreat Ocean Group Holding LLCとLS Stream Ltd.は海外法人で候補にない。
- terms: 登録候補（助言のみ）: 寿司種（寿司に使う生食商材の総称で、生鮮事業の中核商品）、海外まき網（カツオ・マグロを対象とする漁法・事業区分）、シーマルシェ（2013年に発表した市販用ブランド）、だんどり上手（食品事業の魚の切身シリーズ。第104期からの水産加工事業セグメントの対象商品）。

## 要確認（status に反映）

- businessModel: 報告セグメントの変更が予定されている。【経営方針、経営環境及び対処すべき課題等】によれば、第104期（2027年3月期）より、水産事業セグメントで取り扱っていた魚の切身、フィーレ商品と食品事業セグメントで取り扱っていた「だんどり上手」シリーズを主に取り扱う水産加工事業セグメントを新設する。本登録は2026年3月期の報告セグメントに基づいており、変更は翌期の予定事項であるため、承認者の確認を求める。
- businessModel: 決算日後の重要な後発事象として、2026年5月15日開催の取締役会で、Great Ocean Group Holding LLCとの米国カニカマ事業の合弁解消（同社がOcean's Kitchen Property Management LLCに出資する30％の持分をKyokuyo America Corporationが取得し、同社を100％子会社化する）と、同グループのLS Stream Ltd.による当社株式の取得（市場買付を予定し、取得完了は2029年4月末頃の見込み）への同意が決議されている。期後のグループ構造の変化であり、株式取得は未了の予定事項であるため、承認者の確認を求める。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
