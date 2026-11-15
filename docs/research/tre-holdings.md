# TREホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＴＲＥホールディングス株式会社 |
| 証券コード | 9247 |
| docID（データを取り出した文書） | `S100YFHS` |
| 原本 docID | `S100YFHS` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFHS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＴＲＥホールディングス株式会社 / 9247 / docID S100YFHS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tre-holdings: 10 件の数値を有報XBRLと照合
有報: ＴＲＥホールディングス株式会社 有価証券報告書－第5期(2025/04/01－2026/03/31) (docID S100YFHS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tre-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「TREホールディングス株式会社」が EDINET の提出者名「ＴＲＥホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報と全行一致し、表示方法の変更や会計方針の変更にあたる注記はなかったため、financialNotes は第1期の連結成績の基礎に関する注記のみとした。パックの「財務諸表の組替え」の注意は「その他の包括利益に関する組替調整額」の節見出しに由来するもので、過年度数値の組替えではないことを確認した。
- businessModel: 中期経営計画の財務目標（事業利益率10％、総還元性向35％～40％、自己資本比率40％以上の維持）は将来の数値目標のため、本文と perspectives には記載していない。
- businessModel: 主要な顧客である一般社団法人石川県産業資源循環協会は未上場の一般社団法人で関連企業候補にないため結ばず、役割を businessModel と industryPosition に記録した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とし、「その他」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: 各事業の金額はセグメント注記の印字どおりであり、個別額の合計と連結売上高119,164百万円との間には、有報の丸めによる数百万円の差がある。
- businessStructure: 子区分は【事業の内容】の業務・事業区分により、区分ごとの売上高は開示されていないため金額は記載していない。
- history: 沿革は有報の印字どおり年月順に全20件を採用した。年月と事象文が対応して印字されており、対応づけに推測は要しなかった。
- history: 2026年4月の2件は決算日（2026年3月31日）後の出来事だが、有報の沿革に印字され、重要な後発事象は連結・個別とも「該当事項はありません」とされているため、印字どおり記載した。
- industry: 主たる業界は、資源循環事業に最も近い chemicals を暫定とした。再生可能エネルギー事業は報告セグメントとして売上高が独立して開示されているため、energy を2つ目に付けた。
- relatedCompanies: en（エン）： 社名の一部が「エンジニアリング」等の一般語と部分一致するのみで、同社についての取引・提携・資本関係の記載がないため結ばなかった。ambiguous の候補でもある。
- relatedCompanies: career（キャリア）： 人材育成の文脈の一般語「キャリア」との一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: seki（セキ）： 「情報セキュリティー」等の一般語との部分一致で、同社についての記載がないため結ばなかった。ambiguous の候補でもある。
- relatedCompanies: zero（ゼロ）： 連結子会社イコールゼロ(株)の社名の一部との一致で、(株)ゼロとは別法人であり、同社についての記載がないため結ばなかった。
- relatedCompanies: base-4481（ベース）： 一般語「連結ベース」との一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: port（ポート）： 一般語「サポート」との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: land（ランド）： 一般語「ブランド」との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: path（パス）： 一般語「キャリアパス」との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: rent（レント）： 一般語「タレントマネジメント」との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: suzuki-6785（鈴木）： 大株主の個人である鈴木徹氏の氏名との部分一致で、(株)鈴木とは別人・別法人であり、同社についての記載がないため結ばなかった。
- relatedCompanies: future（フューチャー）： 官民連携プラットフォーム「GXフューチャー・コンソーシアム」の名称との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: lec（レック）： 連結子会社メトレック(株)の社名との部分一致で、レック(株)とは別法人であり、同社についての記載がないため結ばなかった。
- relatedCompanies: ray（レイ）： 連結子会社(株)アースアプレイザルの社名との部分一致で、(株)レイとは別法人であり、同社についての記載がないため結ばなかった。ambiguous の候補でもある。
- relatedCompanies: trust（トラスト）： 日本マスタートラスト信託銀行(株)（信託口）との部分一致で、同行は信託口の名義であり、(株)トラストはコードリストになく検証できないため結ばなかった。
- relatedCompanies: mitsui-e-and-s（三井E&S）： 施設用地について2026年4月から3年間の転貸借契約の印字はあるが、経過的な用地の賃借にとどまり、事業上の取引・提携関係とは言えないため結ばなかった。
- relatedCompanies: nix（ニックス）： 2022年にリバー(株)が吸収合併したフェニックスメタル(株)の社名との部分一致で、(株)ニックスとは別法人であり、同社についての記載がないため結ばなかった。
- relatedCompanies: resona-holdings（りそなホールディングス）： (株)タケエイが株式を保有するが、保有目的は安定的な銀行取引と関係強化のためであり、銀行取引を理由とするため結ばなかった。
- relatedCompanies: エム・エム・プラスチック（候補外）： 2026年4月に資本業務提携契約を締結したが、テラレムグループ(株)の未上場子会社で候補データにないため結ばず、沿革に記録した。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報に定義・説明のある当社グループ固有のものに限った（助言のみ）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 主たる業界 → 提案: environment（環境・廃棄物処理）。廃棄物処理・再資源化事業と資源リサイクル事業で2026年3月期の外部顧客への売上高の80.6％を占める資源循環事業が中核ですが、閉じた分類に環境・廃棄物処理の区分がないため、素材の再資源化に最も近い chemicals を暫定としました。
