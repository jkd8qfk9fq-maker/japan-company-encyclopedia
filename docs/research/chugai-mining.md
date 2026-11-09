# 中外鉱業 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 中外鉱業株式会社 |
| 証券コード | 1491 |
| docID（データを取り出した文書） | `S100YKQY` |
| 原本 docID | `S100YKQY` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKQY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 中外鉱業株式会社 / 1491 / docID S100YKQY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
chugai-mining: 10 件の数値を有報XBRLと照合
有報: 中外鉱業株式会社 有価証券報告書－第134期(2025/04/01－2026/03/31) (docID S100YKQY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
chugai-mining: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…、人件費などの費用を差し引いた残りが利益になります。2026年3月期のは1,…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と純利益以外の財務数値（営業利益・経常利益・セグメント利益・総資産・純資産・資本金など）は文章の規則により書いていない。主要な顧客ごとの売上高と割合は売上高の内訳として印字どおりに使った。
- businessModel: 2025年10月1日付の株式併合（普通株式20株につき1株）は当期中に完了した資本政策の事項で、財務諸表の数値そのものに影響しないため、financialNotes ではなく沿革と warnings に記録した。1株当たり指標は経営指標の注記で併合を第130期期首に行ったと仮定して算定されている。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。修正再表示チェックは全項目一致、決算期変更・変則期間なし（summary.json）。
- businessModel: financialNotes は空: 変則決算・会計基準の変更・決算期変更のいずれもないため。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高（2026年3月期）の大きい順: 貴金属事業278,150,937千円 → コンテンツ事業2,778,593千円 → 機械事業737,984千円。「その他」は有報が報告セグメントに含まれないと明記する区分のため最後に置いた。
- businessStructure: 金額はセグメント情報の印字どおりの千円額を使った（MD&Aの販売実績とも一致）。MD&Aの経営成績で印字される貴金属事業278,161,097千円・機械事業751,724千円は内部売上高を含む数値のため使っていない。
- businessStructure: グループは当社と子会社4社で構成されるが、連結子会社は株式会社インテックスのみで、JACK DIAMOND Co.,Ltd.（香港）などは非連結子会社である（事業の内容・関係会社の状況）。
- businessStructure: wikipedia.json の補足（スクラップからの貴金属精製が主力という説明）は有報の記載で足りるため使わなかった。
- businessStructure: check-prose-figures で照合できなかった機械事業737,984千円・その他24,666千円の金額は、セグメント表の中で前後の数値と区切りなく連結して印字されており照合対象の本文と一致しないため、金額を落として割合の表現に置き換えた（金額そのものはセグメント情報の印字どおり）。
- history: 沿革表の後半は年月セルと事象文が分かれて印字される崩れた表だった。年月の数と事象の数が一致したため行順で対応づけた: 2008年12月=中外化学株式会社の全株式売却、2009年4月=投資事業のセグメント区分、2014年4月=研究開発事業のセグメント区分、2014年9月=研究開発事業の廃止、2017年4月=宝飾事業の貴金属事業への統合、2017年4月=コンテンツ事業のセグメント区分、2017年12月=香港JACK DIAMOND Co.,Ltd.の株式取得、2022年4月=スタンダード市場への移行、2025年10月=株式併合（20株を1株）、2025年11月=米国CHUGAI HAWAII LLCの設立。
- history: 省いた行: 大阪・新潟証券取引所への上場、鉱さい流出事故と操業停止、都茂鉱業所の分離、各鉱業所の合理化、甲府分析センター・名古屋営業所・IRセンターの開設、投資関連会社の取得・売却（日本スパイダー・システムズ、ガバキング、リムテック、中外キャピタル、Katsina Optics）、健康事業への進出と廃止、CR任意組合・IR任意組合の設立、中外化学の売却、投資事業・宝飾事業・研究開発事業のセグメント区分と廃止・撤退、JACK DIAMONDの株式取得などは、主要な転機に絞って落とした。
- industry: 主分類は暫定で chemicals とした。最大の報告セグメントである貴金属事業（外部顧客への売上高278,150,937千円、連結の99％）は金・銀・白金などの非鉄金属の精製・販売であり、上場区分も「非鉄金属」だが、閉じた分類に nonferrous-metals がないため、非鉄金属メーカーの暫定値として先行事例（大紀アルミニウム工業所）に倣い chemicals を選んだ。不足は taxonomyGaps に記録した。
- industry: 機械事業（737,984千円）とコンテンツ事業（2,778,593千円）は報告セグメントとして開示されているが、いずれも連結売上高の1％前後にとどまるため、machinery・entertainment は付けなかった。
- relatedCompanies: matsuda-sangyo: 前期（2025年3月期）の主要な顧客としてセグメント情報に記載があるが、当期（2026年3月期）の主要な顧客には含まれておらず、当期の取引関係を確認できないため結ばなかった。
- relatedCompanies: career: 文脈は自社の非連結子会社キャリアメイト（旧・ベンチャーサポート・キャピタル）の商号変更への言及で、株式会社キャリアについての記載ではないため結ばなかった。
- relatedCompanies: base-4481: 「時価ベースの自己資本比率」などの一般表現の部分一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: vision: 経営方針の「将来ビジョン」という一般語の部分一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: slogan: 「スローガン」という一般語の部分一致で、スローガン株式会社についての記載はないため結ばなかった。
- relatedCompanies: king: 沿革の旧子会社ガバキング株式会社の部分一致で、株式会社キングについての記載はないため結ばなかった。
- relatedCompanies: port: 旧子会社ベンチャーサポート・キャピタルの部分一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: amuse: 「アミューズメント施設」という一般語の部分一致で、株式会社アミューズについての記載はないため結ばなかった。
- relatedCompanies: en: ambiguous な候補で、「エンタメ」という一般語の部分一致にすぎず、エン株式会社についての記載はないため結ばなかった。
- relatedCompanies: taya: ambiguous な候補で、大株主・取引関係のいずれの文脈でも株式会社田谷の正式名称の印字を確認できないため結ばなかった。
- relatedCompanies: tear: 大株主である株式会社ムーンズティアの部分一致で、株式会社ティアそのものについての記載ではないため結ばなかった。
- relatedCompanies: 候補外: 主要な顧客のアサヒプリテック株式会社と株式会社佐藤金銀店は related-candidates.json に含まれていないため結ばなかった（アサヒプリテックは当期の販売実績の40.9％を占める）。
- relatedCompanies: 三菱商事RtMジャパン向け売上高132,086,248千円は、主要な顧客の表の中で前後の数値と連結して印字されており check-prose-figures で照合できないため、金額を落として印字された割合46.9％のみを使った。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言扱い（登録は別工程）。地金、スクラップ原料、精金・精製、鈑金機械は、この会社の事業を理解するうえで中心的な語として選んだ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 中外鉱業の主たる業界 → 提案: nonferrous-metals（非鉄金属）。主力の貴金属事業はスクラップ等の原料からの金・銀・白金・パラジウムの精製・販売であり、証券取引所の業種も非鉄金属。閉じた分類に対応する値がない。
