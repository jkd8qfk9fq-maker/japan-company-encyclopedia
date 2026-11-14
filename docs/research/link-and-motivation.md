# リンクアンドモチベーション — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社リンクアンドモチベーション |
| 証券コード | 2170 |
| docID（データを取り出した文書） | `S100XSV5` |
| 原本 docID | `S100XSV5` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSV5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社リンクアンドモチベーション / 2170 / docID S100XSV5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
link-and-motivation: 10 件の数値を有報XBRLと照合
有報: 株式会社リンクアンドモチベーション 有価証券報告書－第26期(2025/01/01－2025/12/31) (docID S100XSV5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
link-and-motivation: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額はセグメント注記と連結経営指標等の百万円単位の印字どおりに転記しました。MD&Aの千円単位で印字された「モチベーションクラウド」の月会費売上（627,382千円）は、単位のない金額として本文には使っていません。
- businessModel: 調達先については、サービスの提供を主体とする事業で仕入先の一般名詞による記述が確認できないため、suppliersは記載しませんでした。
- businessModel: 当連結会計年度よりコンサル・クラウド事業とIR支援事業の事業内容を変更し、前年の数値を変更後の区分に組み替えた旨は、表示の組替えに関する事項のためfinancialNotesには入れず、このwarningsに記録しました。
- businessModel: 2026年2月12日の取締役会で決議された自己株式の取得（2026年2月13日から2026年8月31日まで、東京証券取引所における市場買付）と、その取得資金に充てるシンジケートローン契約の締結は、期末後の資本政策に関する事項のためfinancialNotesやneedsReviewには入れず、このwarningsに記録しました。
- businessModel: 証拠パックの警告にある遡及適用は、連結経営指標等の注記のIAS第12号の適用を指すものとしてfinancialNotesに記録しました。非継続事業に該当する事業の切り分けは、抽出された範囲では特定できませんでした。
- businessModel: 中期計画に印字された収益の目標数値は、利益に関する数値目標のため本文には転記せず、このwarningsにとどめました。
- businessStructure: 事業名はセグメント注記の印字どおり「マッチングDivision」「組織開発Division」「個人開発Division」とし、外部顧客への売上収益の大きい順に並べました。「その他」は報告セグメントに含まれないレストラン事業で、最後に置きました。
- businessStructure: 各Divisionの2つの事業区分（組織開発はコンサル・クラウド事業とIR支援事業、個人開発はキャリアスクール事業と学習塾事業、マッチングはALT配置事業と人材紹介事業）は、金額がDivision単位でしか開示されていないため、子区分として分けず各Divisionの説明の中に記載しました。
- businessStructure: MD&Aに印字されたDivision別の売上収益（内部売上を含む数値）は使わず、セグメント注記の外部顧客への売上収益を使いました。
- businessStructure: 連結子会社と持分法適用関連会社の資本金の金額は書いていません。
- history: 沿革の表は年月と事象が続けて印字された形式で、行順どおりに対応づけました。
- history: 設立時の資本金の金額は、資本金の金額を書かない規則のため記載していません。
- history: 2026年1月のインドネシア子会社の事業開始は、2025年12月期の期末後で有価証券報告書の提出前に沿革に印字された出来事です。期末時点の体制の説明には含めていません。
- history: 沿革に印字されたすべての子会社設立・取得を網羅はせず、事業の転機となる出来事を中心に選びました。
- industry: 最も大きい報告セグメントはマッチングDivision（ALT配置と人材紹介）で、組織開発Divisionも企業の組織人事を支援する事業のため、human-resources（人材サービス）を主たる業界としました。
- industry: 個人開発Divisionは教育事業ですが、金額が独立して開示された報告セグメント単位では人材関連の2つのDivisionが大半を占めるため、2つ目の業界は付けませんでした。
- relatedCompanies: オープンワーク株式会社（openwork、5139）: 連結子会社（議決権52.71％、2025年12月31日現在）で当社グループの会社のため結んでいません。
- relatedCompanies: 株式会社FCE（fce、9564）: 持分法適用関連会社（議決権20.5％、2025年12月31日現在）で当社グループの会社のため結んでいません。大株主の状況にも1.46％の保有が印字されますが、同じくグループの会社のため結んでいません。
- relatedCompanies: Sansan株式会社（sansan、4443）: 2025年7月1日に同社が保有するUnipos株式会社の株式を当社が取得した一回限りの株式譲渡の相手方で、継続的な取引・提携の記述がないため結んでいません。
- relatedCompanies: AGS株式会社（ags、3648）: Unipos株式会社の取得に際して助言者として選定された旨の記述のみで、継続的な取引・提携の記述がないため結んでいません。
- relatedCompanies: 山田コンサルティンググループ株式会社（yamada-consulting-group、4792）: 株式交換比率の算定に関してファイナンシャル・アドバイザーとして選定された旨の記述のみで、継続的な取引・提携の記述がないため結んでいません。
- relatedCompanies: 株式会社千葉銀行（the-chiba-bank、8331）: 借入先としての記述のみで、資金調達が理由のため結んでいません。
- relatedCompanies: 株式会社インバウンドテック（inbound-tech、7031）: 2020年12月に持分法適用外となり関連会社から除外された過去の関係で、現在の関係の記述がないため結んでいません。
- relatedCompanies: 株式会社歌舞伎座（kabuki-za、9661）: 本店所在地である歌舞伎座タワーの名称の一致のみで、当社が取引・提携・資本関係を述べた記述がないため結んでいません。
- relatedCompanies: エン株式会社（en、4849、ambiguous）、株式会社キャリア（career、6198）、ベース株式会社（base-4481、4481）、株式会社ステップ（step、9795）、株式会社コア（core、2359、ambiguous）、株式会社ランド（land、8918）、株式会社ゼロ（zero、9028、ambiguous）、ポート株式会社（port、7047）、株式会社イノベーション（innovation、3970）、株式会社レイ（ray、4317、ambiguous）、株式会社キング（king、8118）、株式会社No.1（no-1、3562）、セキ株式会社（seki、7857、ambiguous）、株式会社テイン（tein、7217）、株式会社ベーシック（basic、519A）、株式会社コロナ（corona、5909）、レック株式会社（lec、7874）、株式会社ニックス（nix、4243）、株式会社スペース（space、9622）: 一般語・製品名・所在地等の部分一致で、当社がその相手について取引・提携・資本関係を述べた箇所がないため結んでいません。
- relatedCompanies: 株式会社トラスト（trust、3347）: 日本マスタートラスト信託銀行（信託口）の名称の部分一致で、コードリストにもないため結んでいません。信託銀行の信託口は純投資のため結びません。
- relatedCompanies: 株式会社フェニックス: 大株主の状況に32.90％の保有（2025年12月31日現在）が印字される最大の株主ですが、上場企業ではなくrelated-candidates.jsonにもないため結んでいません。
- relatedCompanies: 特定投資株式は該当事項なしと印字されており、政策保有株式を根拠とする結びはありません。
- terms: 助言: 用語「モチベーションエンジニアリング」は、経営学・社会システム論・行動経済学・心理学等の学術的成果を取り入れた当社グループの基幹技術を指します（事業の内容・経営方針に印字）。
- terms: 助言: 用語「モチベーションクラウド」は、組織の診断と変革を通じて組織人事の課題解決を支援するクラウドサービスを指します（事業の内容・MD&Aに印字）。
- terms: 助言: 用語「エンゲージメント」は、会社と従業員の相互理解・相思相愛度合いを指す言葉として使われています（MD&Aに印字）。
- terms: 助言: 用語「ALT」は外国語指導助手（Assistant Language Teacher）を指します（事業の内容に印字）。
- terms: 助言: 用語「モチベーションカンパニー」は個人から選ばれる組織を、「アイカンパニー」は組織から選ばれる個人を指します（事業の内容に印字）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
