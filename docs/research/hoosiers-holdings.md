# フージャースホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社フージャースホールディングス |
| 証券コード | 3284 |
| docID（データを取り出した文書） | `S100YB28` |
| 原本 docID | `S100YB28` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YB28.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社フージャースホールディングス / 3284 / docID S100YB28（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hoosiers-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社フージャースホールディングス 有価証券報告書－第13期(2025/04/01－2026/03/31) (docID S100YB28)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第12期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
hoosiers-holdings: 本文の金額 16 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…針は「資本効率を伴う成長への転換 ～利益成長の継続に加え、ＲＯＩＣを起点に成…）

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは全行一致し、決算期変更・変則決算・会計基準の変更もないため financialNotes は空にしました。
- businessModel: 第13期における純資産額の増加は、2025年9月に実施した公募による新株式の発行等による旨が有報に記載されています。資本政策のため financialNotes にはしません。
- businessModel: 前期の窓にある訂正有価証券報告書－第12期（2025年7月31日提出）は、修正再表示チェックで売上高・純利益・総資産・純資産・従業員数が全行一致したため、過年度の数値への影響はありません。
- businessModel: 報告セグメントの外部顧客への売上高の合計（138,576百万円）と連結売上高（138,579百万円）の3百万円の差は有報の印字のとおりで、丸めによるものです。
- businessModel: 中期経営計画の数値目標のうち本文に書けるのは売上高だけのため、営業利益・当期純利益・ＥＰＳ・ＲＯＥ・ＲＯＩＣの目標は記載していません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です（不動産開発事業、不動産投資事業、ＣＣＲＣ事業、不動産関連サービス事業）。
- businessStructure: 報告セグメントの外部顧客への売上高の合計（138,576百万円）と連結売上高（138,579百万円）の3百万円の差は有報の印字のとおりで、丸めによるものです。
- businessStructure: 不動産関連サービス事業の内訳の合計（8,398百万円）と報告セグメントの外部顧客への売上高（8,399百万円）の1百万円の差は有報の印字のとおりで、丸めによるものです。
- businessStructure: 2026年5月公表の「報告セグメント変更に関するお知らせ」のとおり、2027年3月期第1四半期より報告セグメントは3区分へ変更される予定です。本登録は変更前の4区分に基づきます。
- history: 2026年4月の吸収合併2件は、事業年度末（2026年3月31日）後の出来事ですが、有報の沿革及び事業の内容の注記に印字されているため沿革に含めました。
- industry: 主たる業界は不動産の開発・販売・管理が事業の全体を占めるため、閉じた分類の real-estate としました。報告セグメントは不動産開発事業、不動産投資事業、ＣＣＲＣ事業、不動産関連サービス事業の4つです。
- relatedCompanies: 住友不動産：特定投資株式の保有目的が2026年3月期に純投資目的へ変更され、業務提携関係の強化を目的とした保有ではなくなった旨が印字されているため結びませんでした。
- relatedCompanies: ポート：Hoosiers, Inc.の所在地「ポートランド」の部分一致のため結びませんでした。
- relatedCompanies: ベース：「連結ベース」の部分一致のため結びませんでした。
- relatedCompanies: ゼロ：「ネットゼロ」の部分一致のため結びませんでした。
- relatedCompanies: コモ：子会社名「フージャースアコモデーションサービス」の部分一致のため結びませんでした。
- relatedCompanies: エン：「オープンエンド型」の部分一致のため結びませんでした。
- relatedCompanies: ランド：「ポートランド」の部分一致のため結びませんでした。
- relatedCompanies: 大和：常任代理人「大和証券」の部分一致のため結びませんでした。
- relatedCompanies: キング：「パーキング」の部分一致のため結びませんでした。
- relatedCompanies: セキ：「情報セキュリティ」の部分一致のため結びませんでした。
- relatedCompanies: 田谷：「世田谷区」の部分一致のため結びませんでした。
- relatedCompanies: トラスト：日本マスタートラスト信託銀行（信託口）の部分一致で、コードリストにもないため結びませんでした。
- relatedCompanies: 連結子会社22社及び持分法適用関連会社AHJ EKKAMAI Co., Ltd.はいずれも非上場で候補に含まれていないため、relatedCompanies には結んでいません。
- relatedCompanies: 大株主の状況に載るのは廣岡哲也氏（12.26％）や信託銀行などで、事業会社の関連企業はありません。
- terms: 用語候補： ＣＣＲＣ（アクティブシニアをターゲットにした分譲マンション及びその附帯サービスを取り扱う事業）、デュオヒルズ（新築分譲マンションの自社ブランド）、デュオセーヌ（シニア向け分譲マンションの自社ブランド）、デュオフラッツ（賃貸マンションの自社ブランド）、私募リート（非上場オープンエンド型の私募の不動産投資信託）——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

- businessModel: 2026年5月公表の「報告セグメント変更に関するお知らせ」のとおり、2027年3月期第1四半期より報告セグメントを「不動産開発事業」「不動産投資事業」「不動産関連サービス事業」の3区分へ変更する予定です。ＣＣＲＣ事業は独立した報告セグメントではなくなります。本登録の事業構成は変更前の4区分に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
