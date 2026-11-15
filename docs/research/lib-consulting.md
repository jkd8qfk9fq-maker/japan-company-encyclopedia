# リブ・コンサルティング — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社リブ・コンサルティング |
| 証券コード | 480A |
| docID（データを取り出した文書） | `S100XT4I` |
| 原本 docID | `S100XT4I` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT4I.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社リブ・コンサルティング / 480A / docID S100XT4I（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
lib-consulting: 6 件の数値を有報XBRLと照合
有報: 株式会社リブ・コンサルティング 有価証券報告書－第14期(2025/01/01－2025/12/31) (docID S100XT4I)
利益・総資産・純資産・従業員数: 12 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
lib-consulting: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes: 経営指標等の注記７（2025年９月16日付で普通株式１株につき1,700株の割合で株式分割）を、2025年12月期の financialNote として記録しました。注記１・２（潜在株式調整後１株当たり当期純利益・株価収益率の不記載）は表示事項、注記５・６は各期の業績や資金の流れの説明のため、financialNotes には入れていません。
- businessModel: 売上高と親会社株主に帰属する当期純利益以外の財務数値（EBITDAや利益の各段階の金額、総資産・純資産・キャッシュ・フローの金額など）は書いていません。経営方針にある売上高や利益の成長率の数値目標も、投資指標的な目標のため本文や戦略には書いていません。
- businessModel: 表示方法の変更（未払消費税等の独立掲記）に伴う前連結会計年度の財務諸表の組替えは表示のみの変更で、売上高や当期純利益に影響しないため、warnings のみとしました。前期の有報が確認窓内になかったため、修正再表示の比較は行えていません。
- businessModel: 重要な後発事象（第三者割当による新株式発行の払込が2026年１月27日に完了）は新規上場に伴う資本取引のため、warnings のみとしました。
- businessModel: suppliers はこのツリーの旧スキーマのため省略しました。個別に印字された仕入先はありません。
- businessModel: wikipedia.json の記事は証券コード480Aの印字で同一性を確認しましたが、冒頭は本社の所在地と事業の一般的な説明のみで、有報に書かれていない補足に使える事実がなかったため、使いませんでした。
- businessStructure: 当社グループはコンサルティング事業の単一セグメントのため、事業は1つとし、収益認識関係に開示された契約形態別の外部顧客への売上高（準委任契約5,544百万円、請負契約213百万円、その他351百万円）を children に記載しました。切り捨て後の合計は6,108百万円で、連結売上高6,109百万円とは1百万円の切り捨て差があります。印字どおりに記載しました。
- businessStructure: 株式会社Impact Venture Capitalは関係会社の状況で主要な事業の内容が「その他事業」と印字されていますが、セグメントはコンサルティング事業の単一セグメントであり、金額の独立した開示もないため、事業としては分けませんでした。
- businessStructure: 本社は単一事業の本社機能の施設のため、コンサルティング事業に結びつけました。帳簿価額や賃料の金額は書いていません。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略しました。個別に印字された仕入先はありません（業務委託の相手は連結子会社です）。
- businessStructure: 表示方法の変更（未払消費税等を独立掲記するための前連結会計年度の財務諸表の組替え）は表示のみの変更で、売上高や当期純利益に影響しないため、warnings のみとし、financialNotes には入れませんでした。
- businessStructure: 重要な後発事象の第三者割当による新株式発行（ＳＭＢＣ日興証券株式会社への247,500株、2026年１月27日に払込完了）は新規上場に伴う資本取引のため、warnings のみとしました。
- history: 2013年２月の本社移転（東京都千代田区大手町）と2024年11月の本社移転（東京都中央区日本橋）は、本社の所在地の変更のみのため省きました。
- history: 沿革の年月は印字どおりですが、history には年だけを記載しました。資本金の金額を含む行は沿革にはありませんでした。
- industry: 主たる業界は、単一セグメントであるコンサルティング事業から決めました。閉じた分類にコンサルティングの区分が無いため、DX導入支援などの情報技術に近い支援を含む点で最も近い it を暫定の主たる業界とし、不足は taxonomyGaps に記録しました。
- relatedCompanies: port: 「ポート」は「サポート」などの一般語の部分一致のみのため結びませんでした。
- relatedCompanies: king: 「キング」は「ランキング」などの一般語の部分一致のみのため結びませんでした。
- relatedCompanies: cota: ambiguous で、一致したのは新株予約権信託の受託者である「コタエル信託」という別の名称であり、コタ株式会社への言及ではないため結びませんでした。
- relatedCompanies: en: ambiguous で、「エンゲージメント」などの一般語の部分一致のみのため結びませんでした。
- relatedCompanies: freee: 「フリー」は「フリーレント賃料」などの会計用語の部分一致のみのため結びませんでした。
- relatedCompanies: land: 「ランド」は「ブランド」などの一般語の部分一致のみのため結びませんでした。
- relatedCompanies: base-4481: 「ベース」は「データベース化」などの一般語の部分一致のみのため結びませんでした。
- relatedCompanies: rent: 「レント」は「フリーレント賃料」の部分一致のみのため結びませんでした。
- relatedCompanies: imura-and-co: 一致は事業の説明の中の一般的な文脈のみで、株式会社イムラとの取引・提携の記載が無いため結びませんでした。
- relatedCompanies: japan-securities-finance: 大株主の状況に2025年12月31日現在で1.80％の保有が印字されていますが、証券金融会社による投資保有であり、取引・提携の記載も無いため結びませんでした。
- relatedCompanies: nissin: コードリストにない相手であり、一致も新株予約権の文脈の部分一致のみのため結びませんでした。
- relatedCompanies: seki: ambiguous で、「セキュリティ」などの一般語の部分一致のみのため結びませんでした。
- relatedCompanies: the-lead: 「リード」は「リードをとる」という一般的な表現の部分一致のみのため結びませんでした。
- relatedCompanies: vision: 「ビジョン」は「理念・ビジョン」という一般語の部分一致のみのため結びませんでした。
- relatedCompanies: 株式会社Preferred Networks（2025年７月に生成AI活用の業務提携を締結）と韓国のISKRA CONSULTING INC（2022年９月に戦略的業務提携を締結）は、関連企業候補に含まれないため結びませんでした（提携の事実は事業の内容と沿革に記載しています）。連結子会社５社（株式会社Goofy、株式会社プルーセル、株式会社Impact Venture Capital、LiB Consulting(Thailand) Co., Ltd.、株式会社Flow Group）は当社の子会社のため結びませんでした。
- terms: 助言のみ。本文で使った用語の候補: ハンズオン支援、準委任契約、請負契約、アンバサダークラウド、５つの成果です。
- terms: wikipedia.json の記事は証券コード480Aの印字で同一性を確認しましたが、補足に使える有報外の事実がなかったため、使いませんでした。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の推移の注記に、2025年９月16日付で普通株式１株につき1,700株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessStructure: 主要な経営指標等の推移の注記に、2025年９月16日付で普通株式１株につき1,700株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] リブ・コンサルティングの主たる業界（コンサルティング事業） → 提案: 経営コンサルティング（経営戦略・実行支援）。事業は経営戦略の立案から実行までを支援するコンサルティング事業の単一セグメントであり、閉じた分類に経営コンサルティングを表す区分がありません。DX導入支援など情報技術に近い支援も含むため、最も近い it を暫定としました。
