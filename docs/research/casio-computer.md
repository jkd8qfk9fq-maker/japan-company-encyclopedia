# カシオ計算機 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | カシオ計算機株式会社 |
| 証券コード | 6952 |
| docID（データを取り出した文書） | `S100YJ1H` |
| 原本 docID | `S100YJ1H` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ1H.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | カシオ計算機株式会社 / 6952 / docID S100YJ1H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 35 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
casio-computer: 10 件の数値を有報XBRLと照合
有報: カシオ計算機株式会社 有価証券報告書－第70期(2025/04/01－2026/03/31) (docID S100YJ1H)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業・財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
casio-computer: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…ービスにかかる費用を差し引いた残りが利益になります。2026年3月期のは18…）

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の数値目標のうち売上高以外（利益・指標類）は文章規則により書いていない。売上高の目標値も、計画の説明は perspectives の strategy に理念と位置付けのみを記し、金額は省いた。
- businessModel: 重要な後発事象は自己株式の消却と取得（資本政策）のみで、事業の記述には影響しないため warnings の記録にとどめた。
- businessModel: 前期有報との修正再表示チェックは全項目一致。セグメント区分の変更は前期数値が新区分で組み替えて開示されており、financialNotes に記録した。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順（時計184,966百万円、コンシューマ82,057百万円、その他9,244百万円。2026年3月期）。
- businessStructure: 2026年3月期から報告セグメントは4区分から3区分に変更され、旧「システム」は「その他」に含まれている（businessModel の financialNotes に記録）。
- businessStructure: コンシューマ事業の内訳（EdTech／サウンド）はMD&Aの記述に基づく区分で、金額は独立して開示されていないため children には金額を書いていない。
- history: 沿革の表は年月と事象が連続して印字された形式で、行ごとに年月が対応しているため、その順序どおりに読み取った。
- history: 工場完成・海外拠点設立などの細目は、主要な転機に絞って省略した（1970年の米国販売会社設立は上場と同じ年の出来事として併記）。
- industry: 売上の大半は時計とコンシューマ（電卓・電子辞書・電子楽器）の電子機器であり、主たる業界は electronics とした。
- industry: 電子楽器はコンシューマ事業の一部で金額が独立開示されていないため、entertainment は付けていない。
- relatedCompanies: 連結子会社36社と持分法適用関連会社2社はすべて未上場で候補に含まれないため、関連企業は特定投資株式のうち販売先と明示された4社のみとした。
- relatedCompanies: career（キャリア）: 一般語「キャリア」の部分一致のみで、同社への言及ではないため結ばない。
- relatedCompanies: port（ポート）: 「事業ポートフォリオ」の部分一致のみのため結ばない。
- relatedCompanies: land（ランド）: 「ブランド」の部分一致のみのため結ばない。
- relatedCompanies: cover（カバー）: 「カバー率」の部分一致のみのため結ばない。
- relatedCompanies: core（コア）: 一般語「コア事業」の部分一致で ambiguous であり、相手への言及がないため結ばない。
- relatedCompanies: freee（フリー）: 「フリー・キャッシュ・フロー」の部分一致のみのため結ばない。
- relatedCompanies: base-4481（ベース）: 音作りの文脈の一般語「ベース」の部分一致のみのため結ばない。
- relatedCompanies: innovation（イノベーション）: 一般語の部分一致のみのため結ばない。
- relatedCompanies: path（パス）: 「パーパス」の部分一致で ambiguous であり、相手への言及がないため結ばない。
- relatedCompanies: rix（リックス）: 「スキル・マトリックス」の部分一致のみのため結ばない。
- relatedCompanies: s-t（エステー）: 吸収合併で消滅した連結子会社カシオエステートの部分一致で、同社への言及ではないため結ばない。
- relatedCompanies: seki（セキ）: 「セキュリティ」等の部分一致で ambiguous のため結ばない。
- relatedCompanies: arata（あらた）: 「あらためて」の部分一致のみのため結ばない。
- relatedCompanies: daiwa（大和）: 地名「東大和市」の部分一致で ambiguous のため結ばない。
- relatedCompanies: ito-en（伊藤園）: 特定投資株式として保有するが、保有目的は「当社関連会社の主要顧客」とされ、当社自身との取引の明示がなく、保有株数も4,000株と小さいため結ばない。
- relatedCompanies: zero（ゼロ）: 「実質ゼロ」の部分一致で ambiguous のため結ばない。
- relatedCompanies: dcm-holdings（DCMホールディングス）: 特定投資株式だったが、当事業年度中に全て売却しているため結ばない。
- relatedCompanies: edion（エディオン）: 特定投資株式だったが、当事業年度中に全て売却しているため結ばない。
- relatedCompanies: en（エン）: 「エントリー」の部分一致で ambiguous のため結ばない。
- relatedCompanies: k-s-holdings（ケーズホールディングス）: 特定投資株式だったが、当事業年度中に全て売却しているため結ばない。
- relatedCompanies: lec（レック）: 連結子会社リプレックスの部分一致のみのため結ばない。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱UFJフィナンシャル・グループ）: 保有目的が資金調達等の金融取引であり、規則により結ばない。
- relatedCompanies: mtg（MTG）: 腕時計の製品名「MTG-B4000」の部分一致で、同社への言及ではないため結ばない。
- relatedCompanies: nippon-bs-broadcasting（日本BS放送）: 保有目的は「同社の連結グループ会社が主力販売先」とされ、相手自身との取引の明示がないため結ばない。
- relatedCompanies: oki-electric-industry（沖電気工業）: みなし保有株式で、退職給付信託への拠出が理由のため結ばない。
- relatedCompanies: ray（レイ）: 「ディスプレイ」等の部分一致で ambiguous のため結ばない。
- relatedCompanies: space（スペース）: 一般語の部分一致のみのため結ばない。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）: 保有目的が資金調達等の金融取引であり、規則により結ばない。
- relatedCompanies: sumitomo-mitsui-trust-group（三井住友トラストグループ）: 保有目的が金融取引と証券代行であり、規則により結ばない。
- relatedCompanies: sumitomo-realty-and-development（住友不動産）: みなし保有株式で、退職給付信託への拠出が理由のため結ばない。
- relatedCompanies: suzuki-6785（鈴木）: 会計監査人の個人名の部分一致で ambiguous のため結ばない。
- relatedCompanies: taya（田谷）: 大株主の住所「世田谷区」の部分一致で ambiguous のため結ばない。
- relatedCompanies: tbs-holdings（TBSホールディングス）: みなし保有株式で、退職給付信託への拠出が理由のため結ばない。
- relatedCompanies: tera-probe（テラプローブ）: 2011年にWLP関連事業を譲渡した相手として沿革に現れるのみで、継続的な取引・提携の明示がないため結ばない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言扱い（登録は別工程）。G-SHOCK、EdTech、関数電卓、電子辞書は、この会社の事業を理解するうえで中心的な語として選んだ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
