# 清水銀行 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社清水銀行 |
| 証券コード | 8364 |
| docID（データを取り出した文書） | `S100YC9F` |
| 原本 docID | `S100YC9F` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC9F.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社清水銀行 / 8364 / docID S100YC9F（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-shimizu-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社清水銀行 有価証券報告書－第151期(2025/04/01－2026/03/31) (docID S100YC9F)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-shimizu-bank: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて有報の百万円印字のまま記載した（連結経常収益33,674百万円、親会社株主に帰属する当期純利益2,000百万円、セグメント外部経常収益）。
- businessModel: 第29次中期経営計画の数値目標（ROE（単体）5％以上、当期純利益40億円以上、連結自己資本比率8.5％以上など）は投資・収益指標のため本文・戦略には書かず、ここに記録する。
- businessModel: businessModel に suppliers は書いていない（このツリーのスキーマに無いキー）。仕入先にあたる開示は銀行業務には無い。
- businessModel: financialNotes は空：会計基準の変更・変則決算・決算期変更・セグメント変更の印字はなく、前期有報との修正再表示チェックも全系列で差異ゼロだった。
- businessModel: 2024年3月期は親会社株主に帰属する当期純損失3,301百万円だった（機械が入れる財務数値の範囲であり、本文には書いていない）。
- businessStructure: 事業の並び順はセグメント情報の外部顧客に対する経常収益の大きい順（銀行業26,822百万円／リース業・クレジットカード業6,384百万円／その他468百万円）。MD&Aのセグメント経常収益は内部取引を含む数値のため使っていない。
- businessStructure: 連結子会社6社はグループ会社であり、relatedCompanies には結んでいない（清水リース＆カード、清水信用保証、清水ビジネスサービス、清水総合メンテナンス、清水総合コンピュータサービス、清水地域経済研究センター）。
- history: 沿革の増資行（1989年・2018年）は資本金の金額を含むため採っていない。清水銀キャリアップ株式会社の清算（2021年）など、グループ内の小規模な出来事は省いた。
- industry: 銀行業が経常収益の大半を占め、リース業・クレジットカード業・信用保証業務も金融サービスであるため、主たる業界は finance のみとした。
- relatedCompanies: sbi-holdings のみ結んだ：保有目的が『業務提携による連携・協力関係強化』と個別に書かれ、脚注に2020年2月18日の資本業務提携の締結と目的が明記されているため。
- relatedCompanies: 特定投資株式のうち保有目的が全銘柄共通の定型句『地域経済の発展及び取引関係の維持・強化』のみの相手は、個別の取引内容が印字されていないため結ばなかった：suzuki、central-japan-railway、shizuoka-gas、tokai-holdings、murakami、alsok、oji-holdings、seiko（靜甲）、kyoritsu-electric、ahresty、noda、fuji-nihon、tomoegawa、nippon-paper-industries、akasaka-diesels、nippon-light-metal-holdings、koito-manufacturing、hagoromo-foods、dcm-holdings。
- relatedCompanies: 保有目的が定型句『安定的な連携・協力関係維持』のみの相手は結ばなかった：daiwa-securities-group、aizawa-securities-group、nomura-holdings、sumitomo-realty-and-development、suzuyo-shinwart、fujitsu。fujitsu と daiwa-securities-group はみなし保有株式（退職給付信託）としても載るが、信託口の保有は関係として結ばない。
- relatedCompanies: 金融機関で保有目的が『金融機関としての総合的な関係維持』の相手は、資金調達・金融機関間取引の関係として結ばなかった：yokohama-financial-group、the-musashino-bank、shizuoka-financial-group、suruga-bank。
- relatedCompanies: 当事業年度に全株を売却し保有が無くなった相手は結ばなかった：tokio-marine-holdings、the-toho-bank、the-nanto-bank、the-bank-of-iwate、the-shikoku-bank、the-tottori-bank、jaccs、procrea-holdings。
- relatedCompanies: encho：EDINETコードリストに無い相手であり結べない。2025年9月1日に株式交換で dcm-holdings の完全子会社となり、当行は DCM 株式の割当交付を受けた事実のみ記録する。
- relatedCompanies: ntt：本文の記載は NTTデータ（別法人）の算定ツールへの言及のみで、NTT 自体との取引・提携の記載が無いため結ばなかった。
- relatedCompanies: japan-securities-finance：大株主（2.36％、2026年3月31日現在）だが金融機関であり純投資として結ばなかった。大株主の鈴与株式会社（4.36％）・共栄火災海上保険株式会社（2.57％）・SBI地銀ホールディングス株式会社（2.47％）・アイザワ証券株式会社（1.47％）は候補に無い、または上場持株会社とは別法人（SBI地銀ホールディングスは sbi-holdings の子会社、アイザワ証券は aizawa-securities-group の子会社）のため結ばなかった。
- relatedCompanies: core、base-4481、path、port、career、freee、nissin、ray、rent、zero、trust は一般語・制度名の一致（コア業務純益、連結ベース、パーパス、サポート、清水キャリエール、CO2フリー電気、日新、レベル、平均残高、ネットゼロ、信託口）で、相手企業への言及ではないため結ばなかった。
- terms: 助言のみ：銀行の収益を表す『経常収益』、住宅ローン等の保証を担う『信用保証』、第29次中期経営計画の『ソリューション営業』は、この会社の解説で読者がつまずきやすい語として用語候補に挙げる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
