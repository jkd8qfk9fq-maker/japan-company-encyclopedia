# 太陽ホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 太陽ホールディングス株式会社 |
| 証券コード | 4626 |
| docID（データを取り出した文書） | `S100YBLG` |
| 原本 docID | `S100YBLG` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBLG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 太陽ホールディングス株式会社 / 4626 / docID S100YBLG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
taiyo-holdings: 10 件の数値を有報XBRLと照合
有報: 太陽ホールディングス株式会社 有価証券報告書－第80期(2025/04/01－2026/03/31) (docID S100YBLG)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
taiyo-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の財務目標のうち、売上高以外の項目（利益や資本効率に関する指標）は本文ルールのため記載していません。
- businessModel: 訂正有報はなく、前期有報との修正再表示チェックは重複年度の全行が一致しました。
- businessModel: 後発の開示として、2026年6月23日に定時株主総会の決議事項に関する臨時報告書（S100YI9K）が提出されていますが、役員選任等の通常の決議の報告であり、確認事項には含めていません。
- businessStructure: 事業の金額はセグメント情報の外部顧客への売上高で統一しました。関係会社の状況の注記にある子会社単体の売上高（太陽ファルマテック株式会社23,002百万円など）はセグメントの内訳ではないため、子区分の金額には用いていません。
- businessStructure: 提出会社（持株会社）は報告セグメントに含まれていないため、事業としては記載していません。
- history: 沿革の全行から主要なものを19件選びました。本社移転（1992年、2018年）、販売子会社の設立、水上太陽光発電所を運営する特別目的会社の子会社化などは省きました。
- industry: 主たる業界は、連結売上高の約69％を占めるエレクトロニクス事業（電子部品用化学品部材）から electronics としました。
- industry: 医療・医薬品事業は報告セグメントとして連結売上高の約26％を占めるため、pharmaceuticals を2つ目に付けました。歯科技工物は同事業の一部であり、独立した業界は付けていません。
- relatedCompanies: DIC株式会社の保有割合は、関係会社の状況（議決権の被所有割合）では20.03％、大株主の状況（発行済株式・自己株式を除くに対する割合）では20.02％と、基準の異なる2つの値が印字されています。説明文には関係会社の状況の値を用いました。
- relatedCompanies: 四国化成ホールディングス（shikoku-kasei-holdings）: 大株主の状況に2.66％の保有が載るのみで、取引・提携や関係会社の区分の印字がないため結びませんでした。
- relatedCompanies: 中外製薬（chugai-pharmaceutical）: 太陽ファルマが長期収載品19製品を譲り受けた相手の一つですが、2018年の一過性の譲受であり、継続的な取引・提携の印字がないため結びませんでした。
- relatedCompanies: 株式会社ステップ（step）: 収益認識の説明にある「5ステップアプローチ」という一般語への一致で、同社との関係の印字がないため結びませんでした。
- relatedCompanies: 株式会社トラスト（trust）: 日本マスタートラスト信託銀行（信託口）の名称の一部への一致で、コードリストにもない純投資の信託口のため結びませんでした。
- relatedCompanies: 株式会社リード（the-lead）: 連結子会社である株式会社ファンリードの名称の一部への一致で、同社との関係の印字がないため結びませんでした。
- relatedCompanies: 株式会社レイ（ray）: 「ディスプレイ」などの一般語への一致（ambiguous）で、関係の印字がないため結びませんでした。
- relatedCompanies: ポート株式会社（port）、株式会社キャリア（career）、エン株式会社（en）、株式会社コア（core）、株式会社シード（seed）、株式会社ゼロ（zero）、株式会社キング（king）、ベース株式会社（base-4481）、カバー株式会社（cover）、株式会社高速（kohsoku）、株式会社スペース（space）、株式会社テクノロジーズ（technologies）、株式会社大和（daiwa）、リックス株式会社（rix）、セキ株式会社（seki）: いずれも一般語や部分一致による候補で、各社との取引・提携・資本関係の印字がないため結びませんでした。
- relatedCompanies: 株式会社山大（yamadai）: コードリストにない相手で、関係の印字もないため結びませんでした。
- terms: 用語候補： ソルダーレジスト（プリント基板の回路部分を保護する絶縁性の材料）、ドライフィルム（フィルム状のソルダーレジスト）、プリント基板（電子部品を載せて配線する板）、長期収載品（薬価基準に長く収載されている医薬品）、歯科技工物（歯科治療に使うかぶせ物や入れ歯など）——いずれも有報の本文や用語説明で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: 2026年3月31日付で、KJ005株式会社による当社普通株式に対する公開買付けの開始予定が公表されています。同日、当社の取締役会は、本公開買付けが開始された場合には賛同の意見を表明すること、応募するか否かは株主の皆様の判断に委ねることを決議しました。本公開買付けは、当社株式を非公開化することを目的とした一連の取引の一環とされています。EDINETの開示書類の索引（2026年11月8日時点）では公開買付届出書はまだ提出されておらず、本公開買付けの成否は未確定です。
- businessModel: 2025年12月1日付で、普通株式1株につき2株の割合の株式分割を実施済みです。有報の配当に関する注記には、分割前の株式数を対象とする中間配当の記載が含まれています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
