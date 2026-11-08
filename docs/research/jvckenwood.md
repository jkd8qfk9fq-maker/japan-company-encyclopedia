# JVCケンウッド — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＪＶＣケンウッド |
| 証券コード | 6632 |
| docID（データを取り出した文書） | `S100YG3R` |
| 原本 docID | `S100YG3R` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG3R.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＪＶＣケンウッド / 6632 / docID S100YG3R（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 33 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jvckenwood: 10 件の数値を有報XBRLと照合
有報: 株式会社ＪＶＣケンウッド 有価証券報告書－第18期(2025/04/01－2026/03/31) (docID S100YG3R)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業・財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
jvckenwood: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社JVCケンウッド」が EDINET の提出者名「株式会社ＪＶＣケンウッド」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…製品やサービスの販売を通じて利益を確保しています。2026年3月期の…）

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上収益と親会社の所有者に帰属する当期利益だけとし、MD&Aの印字どおりに書いた。事業利益・営業利益・税引前利益の金額や増減率は規則により書いていない。
- businessModel: 非継続事業の注記は「該当事項はありません」。組替えは連結キャッシュ・フロー計算書の表示方法の変更（長期前払費用の取得による支出、非支配持分への配当金の支払額の独立掲記）に伴う前期分の組替えのみで、売上収益・当期純利益の系列に影響しないため、financialNotes には書かなかった。前期有報との修正再表示チェックも全項目一致している。
- businessModel: 中期経営計画VISION2030の定量目標（ROE・ROIC・売上高・事業利益率・セーフティ＆セキュリティ分野の売上構成比率など）は規則により perspectives に書いていない。
- businessModel: Wikipedia（JVCケンウッド）の冒頭は本社所在地など有報と重なる内容のみで、数値も使えないため補足に使わなかった。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上収益（2026年3月期）の大きい順とした。報告セグメントに含まれない「その他」は最後に置いた。
- businessStructure: 子事業（OEM事業・アフターマーケット事業・テレマティクスサービス事業、無線システム事業・業務用システム事業、メディア事業・エンタテインメント事業）はMD&Aに区分名があるが、金額の独立開示がないため金額は書いていない。
- businessStructure: 市場区分は表紙の「東京証券取引所プライム市場」の印字どおり。
- history: 有報の沿革は2007年の資本業務提携から始まるため、それ以前のビクター・ケンウッド両社の創業経緯は有報に記載がなく、書いていない。
- history: 沿革のうち、新株予約権・転換社債型新株予約権付社債の発行などの資本政策の行と、国内子会社の吸収合併などの細かな再編の行、Shanghai Kenwood Electronicsの譲渡の行は省いた。中期経営計画の策定（VISION2023・VISION2025・VISION2030）の行は、VISION2030を perspectives の strategy に記載したため沿革では省いた。
- history: 2026年1月のヘルスケア事業撤退は当事業年度内（2026年3月期）の完了した出来事として沿革に書いた。重要な後発事象は「該当事項はありません」。
- industry: 3つの報告セグメントはいずれも電機製品の製造・販売が中心のため、主たる業界は electronics とした。
- industry: エンタテインメント ソリューションズ分野には音楽・映像コンテンツ事業も含まれるが、その金額が独立して開示されていないため、media は付けなかった。
- industry: 閉じた分類で表せるため taxonomyGaps は付けていない。
- relatedCompanies: サイエンスアーツは、沿革に資本業務提携契約の締結（2024年10月）が印字され、特定投資株式の保有目的にもIP無線機・サービスの共同開発と販売展開に向けた業務資本提携が相手固有の文で書かれているため結んだ。
- relatedCompanies: アイコムは、特定投資株式の保有目的に無線システム事業に関する業務資本提携の関係にあることが相手固有の文で書かれているため結んだ。取引の向きは印字されていないため business-partner とした。
- relatedCompanies: ホーチキは、特定投資株式の保有目的に業務用システム事業におけるセキュリティ機器・音響機器等の取引を行っていることが相手固有の文で書かれているため結んだ。取引の向きは印字されていないため business-partner とした。
- relatedCompanies: セキ（ambiguous）は「セキュリティ」などの語の一部への一致で、同社への言及はないため結んでいない。
- relatedCompanies: テインは「ビクターエンタテインメント」などの語の一部への一致で、同社への言及はないため結んでいない。
- relatedCompanies: ポートは「事業ポートフォリオ」などの一般語への一致のため結んでいない。
- relatedCompanies: ランドは「ニュージーランド」などの語の一部への一致のため結んでいない。
- relatedCompanies: キャリアは人材施策の「キャリアデザイン」などの一般語への一致のため結んでいない。
- relatedCompanies: ベースは「データベース」などの一般語への一致のため結んでいない。
- relatedCompanies: ステップは収益認識の「5ステップモデル」への一致のため結んでいない。
- relatedCompanies: レイ（ambiguous）は「ディスプレイ」などの語の一部への一致のため結んでいない。
- relatedCompanies: ビジョンは「企業ビジョン」「VISION2030」など自社の理念・計画名への一致のため結んでいない。
- relatedCompanies: フリーは「フリーキャッシュ・フロー」への一致のため結んでいない。
- relatedCompanies: イノベーションは「イノベーションの創出」という一般語への一致のため結んでいない。
- relatedCompanies: トラストは候補の listing が「（コードリストにない）」である上、「ゼロトラスト」という一般語への一致のため結んでいない。
- relatedCompanies: ゼロ（ambiguous）は「ゼロ・クーポン」への一致のため結んでいない。
- relatedCompanies: リズムは京都大学との共同研究のテーマ文中の語への一致で、同社への言及はないため結んでいない。
- relatedCompanies: 鈴木（ambiguous）は役員の個人名への一致のため結んでいない。
- relatedCompanies: リードは「リードタイム」という一般語への一致のため結んでいない。
- relatedCompanies: コア（ambiguous）は一般語への一致のため結んでいない。
- relatedCompanies: 光通信は「光通信用波長選択スイッチ」という技術用語への一致で、同社への言及はないため結んでいない。
- relatedCompanies: コタ（ambiguous）は「インコタームズ」への一致のため結んでいない。
- relatedCompanies: フュージョンは「センサーフュージョン技術」という一般語への一致のため結んでいない。
- relatedCompanies: 学情（ambiguous）は「地政学情勢」の一部への一致のため結んでいない。
- relatedCompanies: 高速（ambiguous）は「高速描画技術」という一般語への一致のため結んでいない。
- relatedCompanies: 日新は候補の listing が「（コードリストにない）」である上、新株予約権の記載中の語への一致で、同社への言及はないため結んでいない。
- relatedCompanies: パス（ambiguous）は「キャリアパス」への一致のため結んでいない。
- relatedCompanies: レントは「エクセレントカンパニー」の一部への一致のため結んでいない。
- relatedCompanies: 田谷（ambiguous）は子会社の所在地「世田谷区」の一部への一致のため結んでいない。
- relatedCompanies: テクノロジーズは自社の合弁会社「J&Kテクノロジーズ」の名称への一致のため結んでいない。
- relatedCompanies: ズームは「光学40倍ズーム」という一般語への一致のため結んでいない。
- relatedCompanies: 持分法適用関連会社のTait International Limited（議決権の所有割合40.0％）とVieureka株式会社（同33.0％）は未上場で候補リストに含まれないため結んでおらず、Taitとの関係は沿革に記載した。
- relatedCompanies: 連結子会社61社は未上場のグループ会社のため結んでいない。大株主は信託銀行・カストディ等の純投資のみで、事業会社の大株主はいないため major-shareholder のリンクはない。
- terms: 登録候補（助言のみ）: テレマティクス（通信技術を使って自動車の運行情報などを活用するサービス）、ドライブレコーダー（走行中の映像や情報を記録する車載機器）、P25（北米の公共安全市場で使われるデジタル無線規格）、DMR（Digital Mobile Radio、デジタル移動無線の規格）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
