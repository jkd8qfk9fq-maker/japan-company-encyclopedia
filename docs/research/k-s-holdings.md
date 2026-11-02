# ケーズホールディングス — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ケーズホールディングス |
| 証券コード | 8282 |
| docID（データを取り出した文書） | `S100Z8J8` |
| 原本 docID | `S100YFQY` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YSC3, S100Z8J8／有効文書 S100Z8J8（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z8J8.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%BC%E3%82%BA%E3%83%9B%E3%83%BC%E3%83%AB%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%B9

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ケーズホールディングス / 8282 / docID S100YFQY（id は英語表記「K'S HOLDINGS CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 7 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
k-s-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ケーズホールディングス 訂正有価証券報告書－第46期(2025/04/01－2026/03/31) (docID S100Z8J8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第46期(2025/04/01－2026/03/31)、docID S100Z8J8）を有効文書としてこのパックを作った。原本は docID S100YFQY。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetricsMetricsAndTargetsTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock・IndependentAuditorsReportConsolidatedTextBlock・MetricsAndTargetsTextBlock・PerformanceDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetrics（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 前期の窓に 訂正有価証券報告書－第45期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第43期(2022/04/01－2023/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第44期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第42期(2021/04/01－2022/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第41期(2020/04/01－2021/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
k-s-holdings: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [filing-as-subject] relatedCompanies[0].description: 有報を主語にしない（事業や出来事を直接述べ、根拠は出典欄に任せる）（…）の総数に対する割合は1.9％です。有報は、取引や提携の内容については書いてい…）

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから「2026年3月期」としました。訂正有価証券報告書が有効文書で、原本と数値・本文は同一（record-only）です。
- businessModel: 売上高7,597億10百万円と、直営店757,265百万円・フランチャイズ等2,445百万円（合計759,710百万円）は、MD&Aの商品別販売実績の印字どおりです。品種別の金額も同じ表の印字（直営店とフランチャイズ等の合計）で、金額を継ぎ足して書き換えていません。
- businessModel: profit の説明は、当期純利益（143億17百万円・前年同期比150.3％）だけを書き、営業利益・経常利益・税金等調整前当期純利益と減損損失の金額は規則により書いていません。増益の理由を有報は売上高以外には数値で説明していないため、利益増の理由を断定していません。
- businessModel: 「主要な仕入先」は有報に印字がなく、仕入は「国内家電メーカー又は卸売会社等から」と書かれているだけなので、相手の名前は書いていません。
- businessModel: perspectives（戦略・強み・業界内の位置づけ）は、訂正有報の提出日と原本の提出日（2026年6月23日）のどちらを asOf とするか迷うため、書きませんでした。「中期経営計画2027」の基本方針（既存店効率の再点検及び接客力強化など）はMD&Aに書かれています。
- businessModel: リンク記法は、存在する用語 id を確認できなかったため使っていません。
- businessStructure: 決算期は表紙のDEI（当事業年度終了日 2026-03-31）から「2026年3月期」としました。有効文書は2026年10月16日提出の訂正有価証券報告書（原本 S100YFQY）で、パックの分類は record-only（財務の数値も本文も原本と同一）です。
- businessStructure: 単一セグメントで、セグメント情報は「開示情報としての重要性が乏しいため省略」、製品・サービス区分も「単一の区分が売上高の90％を超えるため省略」です。そのため事業は家庭用電気製品小売業を1つ目に置き、【関連情報】に製品区分の印字が無いので children は作りませんでした。商品別の販売実績はMD&Aにありますが、有報が事業の区分として示したものではないため区分には使っていません。
- businessStructure: 2つ目の区分は有報のセグメントではなく、関係会社の状況に載る3社（人材派遣・パソコンサポート・運送等）を、金額が無い旨を明記して最後に置いたものです。【事業の内容】は子会社9社のうち小売の6社を「主要な会社（計7社）」に挙げ、残る3社の事業は関係会社の状況にだけ書かれています。
- businessStructure: 屋号「ケーズデンキ」はWikipedia（wikipedia.json）による補足です。有報は子会社名などに「ケーズデンキ」を含みますが、店舗の屋号としては明記していません。Wikipediaの数値・順位・北関東YKKなどは使っていません。
- businessStructure: 【事業の内容】は子会社を9社と書いています。関係会社の状況に載る連結子会社は9社（ギガス・関西ケーズデンキ・ビッグ・エス・北越ケーズ・九州ケーズデンキ・デンコードー・ケーズキャリアスタッフ・ケーズデンキテクニカルサポート・ケーズキャリーサービス）で一致しています。
- businessStructure: 営業利益・経常利益・減損損失の金額、売場面積、個別会社の損益はMD&Aと関係会社の状況にありますが、規則により書いていません。
- history: 沿革は history.txt（表は年月と事項が対応して印字されており、崩れていません）から書きました。1972年と1973年、1979年と1984年、1987年と1988年と1991年など、近い出来事は1項目にまとめ、年は項目の最初の出来事の年にしています。
- history: 年表のなかった出来事のうち、1985年3月の吸収合併、2003年2月のデジックスケーズの株式譲受、2016年のマックスブロードバンドの吸収合併、2021年4月のケーズソリューションシステムズの吸収合併は、項目の説明や重要性の文に含めたものを除き、独立した項目にしませんでした。
- history: 「significance」の1972年の項目にある本社所在地の町名の一致は、有報の表紙（本店の所在の場所）と沿革の記載を照らして書いた事実です。
- industry: 単一の区分「家庭用電気製品小売業」（家電量販店の多店舗展開）なので、主たる業界は小売です。電機・半導体には、製造や部材の事業開示がないため付けていません。
- relatedCompanies: 佐藤商事（8065）: 大株主の状況に事業会社として載り（1.9％、2026年3月31日現在）、related-candidates の正式名称「佐藤商事株式会社」と一致、上場。親会社・子会社・関連会社の区分には当たらないため major-shareholder にしました。
- relatedCompanies: イオンフィナンシャルサービス（8570）: 重要な契約等に、クレジット販売の信販会社としての加盟店契約が載るだけで、取引の向きや提携内容の説明がなく、支払手段の仲介にすぎないため結びませんでした（tier が needs-attention でもある）。
- relatedCompanies: ケーズデンキ従業員持株会・日本マスタートラスト信託銀行・日本カストディ銀行・株式会社ケーズマネジメント・加藤新次郎ほか個人・資産管理会社は、事業会社ではない（信託口・持株会・個人・資産管理会社）ため結びませんでした。
- relatedCompanies: en（エン）・port・career・path・base-4481・ishin・okabe・trust・innovation・ray・land・seki・suzuki-6785・will・core・corona・garden・izumi・max・zero: 社名の一致は、一般語（エンゲージメント、サポート、キャリアスタッフ、パスポート等）や人名・店舗名・無関係な文脈の一部で、有報がその相手について取引・提携・資本関係を述べていないため結びませんでした。
- relatedCompanies: 三井住友カード・株式会社ジェーシービー・株式会社三菱UFJ銀行: クレジット販売の加盟店契約と借入のアレンジャーで、資金調達や決済の取引が理由のため結びません（候補にも無い）。
- terms: 助言: 用語として説明すると読者の理解が進むのは「フランチャイズ契約」（本部が商号・商標・経営ノウハウを提供し、加盟店が対価を払って営業する契約。有報の重要な契約等に要旨が載る）と「一括仕入」（本社でまとめて仕入れ、仕入単価を下げる）です。「持株会社」「株式交換」も既存の用語があれば使えます。用語集に無い場合のみ新設を検討してください。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
