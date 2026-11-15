# NSD — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＮＳＤ |
| 証券コード | 9759 |
| docID（データを取り出した文書） | `S100YEYZ` |
| 原本 docID | `S100YEYZ` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEYZ.pdf / `wikipedia` https://ja.wikipedia.org/wiki/NSD_(%E4%BC%81%E6%A5%AD)

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＮＳＤ / 9759 / docID S100YEYZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 21 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nsd: 10 件の数値を有報XBRLと照合
有報: 株式会社ＮＳＤ 有価証券報告書－第57期(2025/04/01－2026/03/31) (docID S100YEYZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nsd: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 正式名称「株式会社NSD」が EDINET の提出者名「株式会社ＮＳＤ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。連結経営指標等の注記に、法人税、住民税及び事業税等に関する会計基準（2022年改正）等を第56期の期首から適用した旨の記載があるが、経過的な取扱いの適用で連結財務諸表に与える影響はないと印字されており、修正再表示チェックも前期有報と全行一致のため、注記にはしなかった。
- businessModel: 証拠パックで検出された『財務諸表の組替え』の記載は、前連結会計年度の連結財務諸表における買掛金の表示を支払手形及び買掛金へ組み替えるなど、表示上の組替えに関するもので、5年間の連結経営指標に影響する組替えではないと判断した（修正再表示チェックは全行一致）。
- businessModel: 新中期経営計画（2027年3月期～2029年3月期）の計数目標は将来の数値目標のため、本文と perspectives には金額や比率を記載せず、計画を公表した事実と方針のみを strategy に記した。
- businessModel: ＭＤ＆Ａのセグメント別売上高は内部取引を含む数値（産業ＩＴ28,286百万円など）のため、本文の事業別金額はセグメント注記の外部顧客への売上高を用いた。
- businessModel: Wikipedia の補足は「独立系のシステムインテグレーター」という位置づけのみに使い、数値は使用していない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした。ＭＤ＆Ａのセグメント別実績は内部取引を含む数値のため、金額はセグメント注記の外部顧客への売上高を用いた。
- businessStructure: セグメント注記の外部顧客への売上高の単純合計は117,812百万円で、連結売上高117,813百万円と1百万円の差がある（有報の丸め）。各事業の金額は印字どおりとした。
- businessStructure: 関係会社の社名は2026年3月31日現在の【関係会社の状況】の印字どおりとした。2026年4月1日付の商号変更・吸収合併は businessModel の needsReview に記録した。
- history: 2026年4月・5月の4件は決算日（2026年3月31日）後の出来事ですが、有報の沿革表自体に印字され、提出日（2026年6月22日）までに完了しているため、同表に沿って収録した。
- history: 設立時の資本金額は沿革に印字がないため、記載していない。
- industry: 主たる業界は it（IT・ソフトウェア）とした。システム開発事業とソリューション事業はいずれも情報サービスであり、閉じた分類に収まるため taxonomyGaps はない。
- relatedCompanies: seki（セキ）： 「セキュリティ」等の一般語との部分一致で、同社についての取引・提携・資本関係の記載がないため結ばなかった。ambiguous の候補でもある。
- relatedCompanies: en（エン）： 「エンジニア」等の一般語との部分一致で、同社についての記載がないため結ばなかった。ambiguous の候補でもある。
- relatedCompanies: base-4481（ベース）： 「営業利益ベース」等の一般語との一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: career（キャリア）： 「キャリア採用」等の一般語との一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: port（ポート）： 「サポート」等の一般語との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: innovation（イノベーション）： 「イノベーション事業本部」等の組織名に含まれる一般語との一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: zero（ゼロ）： 「ネットゼロ」の文脈の一般語との一致で、同社についての記載がないため結ばなかった。ambiguous の候補でもある。
- relatedCompanies: vision（ビジョン）： 「経営ビジョン」等の一般語との一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: king（キング）： 「ウォーキング」等の一般語との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: core（コア）： 特定投資株式の保有目的にある「コアパートナー企業」は(株)ＩＣを指す表現で、(株)コアについての記載がないため結ばなかった。
- relatedCompanies: rhythm（リズム）： 「アルゴリズム」等の一般語との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: tokyu（東急）： 大株主の住所にある「渋谷道玄坂東急ビル」の名称との一致で、同社についての取引・提携の記載がないため結ばなかった。ambiguous の候補でもある。
- relatedCompanies: corona（コロナ）： 「新型コロナウイルス感染症」の文脈の一般語との一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: step（ステップ）： 「新たなステップ」等の一般語との一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: system-d（システム ディ）： 当社の旧社名「日本システムディベロップメント」との部分一致で、同社とは別法人であり、同社についての記載がないため結ばなかった。
- relatedCompanies: trust（トラスト）： 日本マスタートラスト信託銀行(株)（信託口）の名称との部分一致で、同社とは別法人であり、listing もコードリストにないため結ばなかった。
- relatedCompanies: will（ウィル）： 「ウィルス」等の一般語との部分一致で、同社についての記載がないため結ばなかった。
- relatedCompanies: sho-bond-holdings（ショーボンドホールディングス）： 特定投資株式の保有目的に、同社と合弁会社設立の経緯があり株式を取得した旨の印字はあるが、現在の取引・提携の記載がないため結ばなかった。
- relatedCompanies: (株)ＩＣ： 特定投資株式の保有目的に「システム開発におけるコアパートナー企業として株式を取得し、安定したシステム開発要員の確保等、協力関係の維持・強化を目的に保有」と印字された協業先ですが、related-candidates.json に含まれていないため結ばなかった。
- relatedCompanies: 大株主の状況に載るのは信託銀行・外国保管機関・従業員持株会・生命保険会社などで、事業会社の大株主で結べる相手はなかった。
- relatedCompanies: 特定投資株式のうち非上場株式6銘柄は社名の開示がなく、結ぶ対象にできない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報に定義・説明のある当社グループ固有のものに限った（助言のみ）。

## 要確認（status に反映）

- businessModel: 2026年4月1日付で、子会社のＮＳＤ‐ＤＸテクノロジー(株)はＮＳＤ ＡＩテクノロジー(株)に、(株)ステラスは(株)ＮＳＤデジタルソリューションズに商号変更し、(株)アートホールディングスは完全子会社である(株)アートテクノロジーを存続会社とする吸収合併により消滅しました。本登録の内容は2026年3月31日現在のグループ構成に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
