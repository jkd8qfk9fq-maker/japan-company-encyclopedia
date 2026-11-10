# メディカルシステムネットワーク — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　メディカルシステムネットワーク |
| 証券コード | 4350 |
| docID（データを取り出した文書） | `S100YX7Q` |
| 原本 docID | `S100YDT5` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YX7Q／有効文書 S100YX7Q（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YX7Q.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　メディカルシステムネットワーク / 4350 / docID S100YDT5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
medical-system-network: 10 件の数値を有報XBRLと照合
有報: 株式会社　メディカルシステムネットワーク 訂正有価証券報告書－第28期(2025/04/01－2026/03/31) (docID S100YX7Q)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第28期(2025/04/01－2026/03/31)、docID S100YX7Q）を有効文書としてこのパックを作った。原本は docID S100YDT5。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
medical-system-network: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社メディカルシステムネットワーク」が EDINET の提出者名「株式会社　メディカルシステムネットワーク」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YX7Q、提出2026-08-18）ですが、分類は record-only で、財務の数値も本文も原本（docID S100YDT5）と同一であり、違うのは表紙の項目だけです。そのため needsReview には入れていません。
- businessModel: 前期有報との修正再表示チェックは全系列で一致しており、変則決算や会計基準の変更もないため、financialNotes は空にしました。
- businessModel: 長期ビジョンと中期経営計画には利益の金額や投資の語にあたる経営指標の目標も印字されていますが、本文の規則のため書いていません。サポート件数の目標だけを記載しました。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順です。部門ごとの金額は開示されていないため、地域薬局ネットワーク事業の子供区分には金額を書いていません。
- history: 沿革の表は年月と事象が分かれて崩れた形で印字されていますが、年月のセル42件と事象42件の数が一致するため、行順に対応づけて年を特定しました。設立時の資本金の金額は本文の規則のため書いていません。
- industry: 主たる業界は、売上の大部分を占める地域薬局ネットワーク事業に基づき、閉じた分類の中で最も近い pharmaceuticals（医薬品）を暫定で選びました。
- relatedCompanies: 三井物産（mitsui-and-co）: 沿革に2005年の合弁会社エムエムネットの設立と、2013年の資本業務提携の解消に伴う完全子会社化・吸収合併が印字されるのみで、現在の取引関係の印字がないため結びませんでした。
- relatedCompanies: ダイト（daito-pharmaceutical）: 沿革に2018年の連結子会社フェルゼンファーマとの業務提携が印字されるのみで、当期の事業の内容や関係会社の状況に現在の取引の印字がないため結びませんでした。
- relatedCompanies: イーエムシステムズ（em-systems）: 沿革に2015年の業務提携が印字されるのみで、現在の取引関係の印字がないため結びませんでした。
- relatedCompanies: 芙蓉総合リース（fuyo-general-lease）: 沿革に2015年の戦略的包括提携が印字されるのみで、現在の取引の印字がなく、リースという金融取引の相手でもあるため結びませんでした。
- relatedCompanies: 光通信（hikari-tsushin）: 大株主の状況に載るのは光通信KK投資事業有限責任組合という投資事業組合であり、株式会社光通信そのものではなく、純投資の保有であるため結びませんでした。
- relatedCompanies: みずほフィナンシャルグループ（mizuho-financial-group）: 特定投資株式として保有する金融機関であり、株式の保有以外の関係性の印字がないため結びませんでした。
- relatedCompanies: ポート（port）: 「サポート」などの一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: ビジョン（vision）: 「長期ビジョン」という一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: エン（en）: 「エンゲージメント」などの一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: キャリア（career）: 「キャリア面談」などの一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: ベース（base-4481）: 「連結ベース」などの一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: ランド（land）: 「ブランド」などの一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: カバー（cover）: 「市場カバー率」という一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: イノベーション（innovation）: 「イノベーション創出」という一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: セキュア（secure）: 「セキュアな基盤」という一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: あらた（arata）: 「あらためて」という一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: フリー（freee）: 「リスクフリーレート」という一般語の部分一致であり、社名の印字ではないため結びませんでした。
- relatedCompanies: トラスト（trust）: 印字は日本マスタートラスト信託銀行（信託口）で別法人であり、コードリストにもないため結びませんでした。
- terms: 用語候補: 医薬品ネットワーク（薬局・病医院と医薬品卸売会社の間の医薬品売買を仲介する仕組み）、債権流動化サポート（調剤・診療報酬債権の流動化による資金調達の支援）、かかりつけ薬局化支援（LINE公式アカウント「つながる薬局」を用いた支援）、メディシスネットワーク（当社のサービスを利用する全国の薬局とそこから生まれるデータの基盤）、後発医薬品（先発医薬品と有効成分が同じ医薬品）。いずれも助言のみで、用語の登録は行いません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] メディカルシステムネットワークの主たる業界 → 提案: healthcare。主事業は調剤薬局の運営と薬局向けの医薬品流通支援サービスであり、医薬品の製造販売は事業の一部にとどまります。医療サービスを表す区分がないため、最も近い医薬品を暫定にしました。
