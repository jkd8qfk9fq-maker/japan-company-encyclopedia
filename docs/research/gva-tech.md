# ＧＶＡ　ＴＥＣＨ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＧＶＡ　ＴＥＣＨ株式会社 |
| 証券コード | 298A |
| docID（データを取り出した文書） | `S100XSCJ` |
| 原本 docID | `S100XSCJ` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSCJ.pdf / `wikipedia` https://ja.wikipedia.org/wiki/GVA_TECH

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＧＶＡ　ＴＥＣＨ株式会社 / 298A / docID S100XSCJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gva-tech: 10 件の数値を有報XBRLと照合
有報: ＧＶＡ　ＴＥＣＨ株式会社 有価証券報告書－第9期(2025/01/01－2025/12/31) (docID S100XSCJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
gva-tech: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 正式名称「GVA　TECH株式会社」が EDINET の提出者名「ＧＶＡ　ＴＥＣＨ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営成績の分析に印字された売上総利益・営業損失・経常損失の金額と増減率は、本文の財務数値を売上高と当期純利益に限る規則により書いていません。
- businessModel: 主要な経営指標等の推移の注記２（収益認識基準の第６期期首からの適用）を financialNote として2022年12月期に登録しました。2022年12月期に付く注記はこの1件だけです。
- businessModel: 証拠パックは本文に財務諸表の組替えの記載があると警告しましたが、抽出された注記の中に該当の記載は確認できず、前期有報との修正再表示チェックも全系列で差異がなく、訂正有報もないため、warningsのみとし、訂正数値の登録やfinancialNoteは行っていません。
- businessModel: 重要な後発事象は「該当事項はありません」でした。決算期の変更や株式分割の注記もありません。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先の名称は印字されていません。
- businessStructure: 主要な設備は本社（東京都渋谷区）のみで、単一セグメントのリーガルテック事業に使われています。帳簿価額は書いていません。
- businessStructure: 非連結で子会社・関連会社はなく、【関係会社の状況】は「該当事項はありません」です。
- businessStructure: サービス別の売上高は、セグメント情報等の【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）により、LegalTech SaaS事業816百万円・登記事業667百万円としました。千円額の切り捨ての合計は1,483百万円で、印字の合計と一致します。
- history: 沿革表は年月セル15件と事象文15件が分かれて印字される崩れた表でしたが、数が一致するため行順に対応づけました。
- history: 本社オフィスの移転（2019年 千駄ヶ谷、2023年 代々木）と、サービスの名称変更（2020年「ＡＩ－ＣＯＮ」→「ＧＶＡ　ＮＤＡチェック」、2021年「ＡＩ－ＣＯＮ登記」→「ＧＶＡ法人登記」、「ＡＩ－ＣＯＮ　Ｐｒｏ」→「ＧＶＡ　ａｓｓｉｓｔ」）は minor として沿革に入れず、ここに列挙します。
- history: 創業者と社名の由来は Wikipedia の補足であり、数値は使っていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は、単一セグメントのリーガルテック事業（法務向けSaaS「ＯＬＧＡ」と登記手続きのオンライン支援）の実体がソフトウェア・クラウドサービスの提供であるため it としました。閉じた分類にリーガルテックの区分はありませんが、SaaSの提供が事業の実体であり、分類の不足として記録する必要はないと判断しました。金額が独立して開示されていない他の事業はないため、追加の業界は付けていません。
- relatedCompanies: 候補 nissin はコードリストになく ambiguous で、「日新」は新株予約権の発行期間の文脈の一部であり、当該会社との関係を示す記載ではないためリンクしていません。
- relatedCompanies: 候補 path は「パーパス」の一部、候補 port は「サポート」の一部、候補 lec は「フレックス」の一部、候補 base-4481 は「データベース」の一部、候補 cover は「カバーする」の文脈、候補 land は「ブランド」の一部、候補 the-lead は「リードタイム」の一部、候補 secure は「セキュアな運用」の文脈、候補 transaction は「トランザクション型の収益」の文脈、候補 en は「エンタープライズ」の一部で ambiguous、候補 taya は ambiguous で「世田谷区」の地名の一部、候補 tear は「サムティアセットマネジメント」の名称の一部であり、いずれも当該会社との関係を示す記載ではありません。
- relatedCompanies: 候補 airtrip は株式の発行履歴における割当先の文脈に載るのみで、現在の取引・提携の記載がないためリンクしていません。
- relatedCompanies: 候補 aozora-bank は第三者割当増資の主な割当先として載る銀行であり、資金調達の関係のためリンクしていません。
- relatedCompanies: 候補 freee は第三者割当増資の主な割当先として載るのみで、現在の取引・提携の記載がないためリンクしていません。
- relatedCompanies: 候補 sbi-shinsei-bank は財務制限条項付き借入の契約先の銀行であり、資金調達の関係のためリンクしていません。
- relatedCompanies: 候補 matsuda-sangyo、serverworks、terrasky は未払金等の相手先別内訳に名称が載るのみで、取引の内容を述べた記載がないためリンクしていません。
- relatedCompanies: 候補 sanko-sangyo はコードリストになく、第三者割当の割当先の文脈に載るのみのためリンクしていません。候補 tenma はコードリストになく ambiguous で、棚卸資産等の内訳の文脈に載るのみのためリンクしていません。候補 tokyo-printing-ink-mfg は「東海東京インキュベーション投資事業有限責任組合」の文脈で、別法人を指すためリンクしていません。
- relatedCompanies: 【大株主の状況】に載るその他の相手は、創業者の山本俊（個人、19.33％）、投資事業有限責任組合（ＤＢＪキャピタル、ＭＳ・ＨＡＹＡＴＥ１号、INNOVATION HAYATE V Capital）、外国のベンチャーキャピタル（SALESFORCE VENTURES LLC.）、証券会社（株式会社SBI証券、楽天証券株式会社）であり、いずれも関連候補ではありません。【関係会社の状況】は「該当事項はありません」です。
- terms: 助言のみの工程です。用語候補：「リーガルテック」（法律とIT技術を融合し法務業務を支援する分野）、「ＯＬＧＡ」（AI法務アシスタント・法務データ基盤・AI契約レビュー・契約管理の4モジュールからなる法務オートメーション）、「法務データ基盤」（法務案件の情報を一元的に集約し検索・活用できるようにする仕組み）、「登記情報自動反映機能」（法務局から連携される登記情報PDFから変更前の情報を書類に自動反映する機能）。いずれも本文で使った語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
