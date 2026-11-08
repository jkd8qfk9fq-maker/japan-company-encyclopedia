# JKホールディングス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＪＫホールディングス株式会社 |
| 証券コード | 9896 |
| docID（データを取り出した文書） | `S100YJ4A` |
| 原本 docID | `S100YJ4A` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ4A.pdf / `wikipedia` https://ja.wikipedia.org/wiki/JK%E3%83%9B%E3%83%BC%E3%83%AB%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%B9

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＪＫホールディングス株式会社 / 9896 / docID S100YJ4A（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 2 件・数値照合OK（注意 4 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jk-holdings: 10 件の数値を有報XBRLと照合
有報: ＪＫホールディングス株式会社 有価証券報告書－第80期(2025/04/01－2026/03/31) (docID S100YJ4A)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
jk-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 正式名称「JKホールディングス株式会社」が EDINET の提出者名「ＪＫホールディングス株式会社」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、運賃などのコストを差し引いた残りが利益になります。2026年3月期のは4,…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。修正再表示チェックは前期有報と全項目一致し、決算期の変更や会計基準の変更にあたる記載もないためである。
- businessModel: 中期経営計画『Value Proposition 27』の数値目標（売上高・各段階利益・資本収益性・配当の目標）と、長期ビジョンの売上高目標は、いずれも目標値であり実績ではないため、本文にも perspectives にも書いていない。
- businessModel: Wikipedia の補足として、プライベートブランド『Bulls』を products に加えた。Wikipedia の順位や売上比率などの数値は使っていない。
- businessModel: 重要な後発事象として、2026年6月5日の取締役会決議による第三者割当での自己株式処分（処分先はNezu Engagement Fund、2026年6月22日に払込完了）が注記されている。資本政策に関する事項で、提出前に完了しており未了の予定事項ではないため、本文にも needsReview にも入れなかった。処分価額などの金額も書いていない。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。「その他」は有報が報告セグメントに含まれない区分としているため、金額の大小にかかわらず最後に置いた。
- businessStructure: ジャパン建材株式会社の個別の損益情報（売上高・経常利益・当期純利益）が【関係会社の状況】の注記に印字されているが、連結の売上高・当期純利益以外の金額になるため本文には書かず、連結売上高の10％超という印字された割合だけを述べた。
- businessStructure: セグメント利益（営業利益ベース）やセグメント資産の金額は、規則により本文に書いていない。
- history: 沿革は有報【沿革】の表の記載どおりに記載した。年月と事象は行ごとに対応している。1990年は4月（本社移転）と11月（店頭登録）の2件を1項目にまとめた。
- history: 1978年の第1回「まるよし市」（現在のジャパン建材フェア）の開催は、項目数を絞るため落とした。
- history: 2006年の項目の「JK」の由来は有報に記載がないため、Wikipedia の記述で補足した（数値は使っていない）。
- industry: 主たる業界は、外部顧客への売上高の8割超を占める総合建材卸売事業（建材・住宅機器の専門商社としての卸売）から trading とした。閉じた分類に建材流通・卸売の値はないが、商社が最も近く、先行する同種の商社の扱いに合わせて taxonomyGaps には入れなかった。
- industry: 総合建材小売事業は報告セグメントとして独立して開示され、外部顧客への売上高51,241百万円があるため、retail を2つ目に付けた。
- industry: 合板製造・木材加工事業（外部顧客への売上高11,342百万円）は建材の製造だが、閉じた分類に合う値がなく金額も小さいため、業界は付けなかった。
- relatedCompanies: 結んだ16社は、特定投資株式の銘柄ごとの保有目的に、相手ごとの具体的な取引（仕入れ・販売とその品目）が印字されている相手に限った。日東紡績と三井物産は相手の関係会社からの仕入れ、住友不動産とスターツコーポレーションは相手の関係会社への販売である旨を、各説明に明記した。
- relatedCompanies: noda は候補データで ambiguous だが、特定投資株式の表に正式名称「株式会社ノダ」と株式数、床材の仕入れ（取引金額は上位）という具体的な取引の記載が印字されており、同一性と関係性の両方を確認できるため結んだ。
- relatedCompanies: lixil: 特定投資株式として8,680株を保有し、内装建材・住宅設備機器の仕入れ（住宅設備機器は取引金額として上位）の記載があるが、有報の銘柄名は「ＬＩＸＩＬグループ」と印字され、候補の正式名称「株式会社LIXIL」と一致しないため、同一性を確認できず結ばなかった。
- relatedCompanies: mebuki-financial-group: 特定投資株式の保有目的が借入金融機関との金融取引関係の維持・強化であり、資金調達が理由の金融機関は結ばない規則により結ばなかった。
- relatedCompanies: mizuho-financial-group: 特定投資株式の保有目的が借入金融機関との金融取引関係の維持・強化であり、資金調達が理由の金融機関は結ばない規則により結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有目的が借入金融機関との金融取引関係の維持・強化であり、資金調達が理由の金融機関は結ばない規則により結ばなかった。
- relatedCompanies: yokohama-financial-group: 特定投資株式の保有目的が借入金融機関との金融取引関係の維持・強化であり、資金調達が理由の金融機関は結ばない規則により結ばなかった。
- relatedCompanies: trust: 候補の listing が「上場」ではなく（コードリストにない）、一致箇所も【大株主の状況】の日本マスタートラスト信託銀行株式会社（信託口）の記載であり、株式会社トラストについての記載はないため結ばなかった。
- relatedCompanies: en: 「協働的なエンゲージメント」など一般語の部分一致で、エン株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: port: 「人材ポートフォリオ」など一般語の部分一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: career: 「キャリア教育」など一般語の一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: king: 「ワーキンググループ」など一般語の部分一致で、株式会社キングについての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「連結ベース」など一般語の部分一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: core: 「コア事業」など一般語の一致で、株式会社コアについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: seki: 「セキュリティ」等の表記の部分一致で、セキ株式会社についての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: vision: 長期ビジョン『Brand-New JKHD 2030』など自社の計画名の一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: zero: 「ゼロゼロ融資」など一般語の一致で、株式会社ゼロについての記載はなく、ambiguous のため結ばなかった。
- relatedCompanies: cover: 「カバーしきれず」など一般語の一致で、カバー株式会社についての記載はないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 【関係会社の状況】の連結子会社・関連会社はいずれも未上場である。筆頭株主の吉野石膏株式会社（発行済株式の12.57％、2026年3月31日現在）も候補にない。特定投資株式のうちＴＯＴＯ株式会社（トイレ・バスを中心に仕入れ、取引金額は上位）と株式会社高松コンストラクショングループ（同社の関係会社への販売）も候補にないため結ばなかった。
- terms: 登録候補（助言のみ）: キーラム（株式会社キーテックが製造する構造用LVL＝単板積層材の製品名）、単板積層材（LVL。薄くむいた木材の板を積層・接着した木質材料）、ジャパン建材フェア（グループが開催する展示即売会。旧称は「まるよし市」）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
