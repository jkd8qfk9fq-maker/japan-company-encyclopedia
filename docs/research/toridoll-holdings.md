# トリドールホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社トリドールホールディングス |
| 証券コード | 3397 |
| docID（データを取り出した文書） | `S100YDW4` |
| 原本 docID | `S100YDW4` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDW4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社トリドールホールディングス / 3397 / docID S100YDW4（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
toridoll-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社トリドールホールディングス 有価証券報告書－第36期(2025/04/01－2026/03/31) (docID S100YDW4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
toridoll-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社　トリドールホールディングス」が EDINET の提出者名「株式会社トリドールホールディングス」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…店舗の運営費用などを差し引いた残りが利益になります。2026年3月期のは23…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes には第34期の企業結合に係る取得原価配分の完了に伴う遡及修正の事実のみを記録した。前期有報との修正再表示チェックは全項目で一致しており、本有報の5年数値に不整合はないため needsReview には入れていない。
- businessModel: 中長期経営計画の数値目標（売上収益・事業利益率）は将来目標と利益指標を含むため、文章には引用していない。
- businessModel: 店舗数2,102店はMD&Aの店舗数表の2026年3月末・連結合計の印字値。
- businessStructure: セグメントの並び順は2026年3月期の外部顧客への売上高の大きい順（丸亀製麺1,371億93百万円、海外事業1,018億95百万円、国内その他396億26百万円）。
- businessStructure: 各業態（children）は売上高が独立して開示されていないため、金額は書いていない。
- businessStructure: 海外事業の英国ブランド（FRANCO MANCA、THE REAL GREEK）は2026年3月31日現在の構成で記載した。決算日後の事業再構築は needsReview に記録した。
- history: 【沿革】の表から主要な出来事を選んだ。1990年の有限会社への改組、1998年の「日の出食堂」開店、1999年の「とりどーる」への転換、2003年のフードコート出店、2004年の「長田本庄軒」開店、2007年の本社移転、2008年の東証第一部への市場変更、2012年の香港・台湾の子会社設立、2015年のWOK TO WALK取得と米子会社設立、2016年のBoat Noodle運営会社の株式取得、2017年のアクティブソース・ZUND取得、2019年の本社移転、2020年の分社化とZUND・アクティブソースの完全子会社化、2023年の国内カフェ事業の分社化は省略した。
- industry: 主たる業界は、全セグメントが飲食店の運営であることから、閉じた分類の中で最も近い food を暫定で選んだ。
- relatedCompanies: land（ランド）: 結ばない。本文中の「ブランド」等の一般語の断片一致で、有報は同社について取引・提携・資本関係を述べていない。
- relatedCompanies: port（ポート）: 結ばない。「事業ポートフォリオ」の語の断片一致で、同社への言及ではない。
- relatedCompanies: step（ステップ）: 結ばない。収益認識の「5ステップアプローチ」の語の一致で、同社への言及ではない。
- relatedCompanies: base-4481（ベース）: 結ばない。「ベースとなるヌードル」等の一般語の一致で、同社への言及ではない。
- relatedCompanies: shofu（松風）: 結ばない。社外取締役の人名（松風里栄子）への一致で、ambiguous の相手であり同社への言及ではない。
- relatedCompanies: slogan（スローガン）: 結ばない。「コーポレートスローガン」の語の一致で、同社への言及ではない。
- relatedCompanies: core（コア）: 結ばない。ambiguous で、金融商品の時価評価の文脈（気配値スコア）の語の一致。同社への言及ではない。
- relatedCompanies: seki（セキ）: 結ばない。ambiguous で、一般語の断片一致。同社について取引・提携・資本関係の記述はない。
- relatedCompanies: en（エン）: 結ばない。ambiguous で、「従業員エンゲージメント」等の語の一致。同社への言及ではない。
- relatedCompanies: vision（ビジョン）: 結ばない。経営方針の「ビジョン」の語の一致で、同社への言及ではない。
- relatedCompanies: corona（コロナ）: 結ばない。「コロナ禍」の語の一致で、同社への言及ではない。
- relatedCompanies: nissin（日新）: 結ばない。listing が「コードリストにない」相手で、ambiguous。新株予約権の文脈の語の一致にすぎない。
- relatedCompanies: space（スペース）: 結ばない。「休憩室のスペース」等の一般語の一致で、同社への言及ではない。
- relatedCompanies: trust（トラスト）: 結ばない。listing が「コードリストにない」相手で、「ゼロトラスト・セキュリティモデル」の語の一致。
- relatedCompanies: zero（ゼロ）: 結ばない。ambiguous で、「ゼロトラスト」の語の一致。同社への言及ではない。
- relatedCompanies: aeon-mall（イオンモール）: 結ばない。listing が「コードリストにない」相手で、新ブランドの出店先施設名としての言及のみ。取引・提携・資本関係の記述はない。
- relatedCompanies: career（キャリア）: 結ばない。「キャリア面談」の語の一致で、同社への言及ではない。
- relatedCompanies: hub（ハブ）: 結ばない。ambiguous で、「各地域のバディをハブに」の語の一致。同社への言及ではない。
- relatedCompanies: rent（レント）: 結ばない。「タレントレビュー」の語の断片一致で、同社への言及ではない。
- relatedCompanies: 大株主のうち粟田貴也は個人、有限会社ティーアンドティーは未上場のため結ばない。信託銀行・信託口・外国ファンド等の純投資の保有も結ばない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言のみ。CVA は重要な後発事象の注記に基づく。

## 要確認（status に反映）

- businessStructure: 重要な後発事象（英国子会社の事業再構築）：The Fulham Shore Limitedの子会社 Franco Manca 2 UK Limited は2026年4月16日に CVA（英国の倒産法制に基づく再建手続）を申請し、2026年5月5日（英国時間）の債権者集会で再建計画が承認された。同じく子会社の The Real Greek Food Company Limited は2026年5月1日にアドミニストレーション（倒産更生手続き）を開始し、選任された管財人のもとで Karali Group への事業・関連資産の譲渡契約を締結しており、今後譲渡手続きが進められる。翌連結会計年度の損益に与える影響額の詳細は有報提出時点で精査中。本登録の事業構成は2026年3月31日現在のものである。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] トリドールホールディングスの主事業（飲食店の運営） → 提案: restaurants（外食・飲食店）。主事業は飲食店の運営であり、食品の製造・販売を指す food とは業態が異なるため
