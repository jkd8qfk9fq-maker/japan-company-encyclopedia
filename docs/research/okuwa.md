# オークワ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オークワ |
| 証券コード | 8217 |
| docID（データを取り出した文書） | `S100Y362` |
| 原本 docID | `S100Y362` |
| 提出日（原本） | 2026-05-13 |
| 決算期 | 2026-02-20 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y362.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オークワ / 8217 / docID S100Y362（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
okuwa: 10 件の数値を有報XBRLと照合
有報: 株式会社オークワ 有価証券報告書－第57期(2025/02/21－2026/02/20) (docID S100Y362)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
okuwa: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…営にかかる費用などを差し引いた残りが利益になります。2026年2月期のは26…）
- 確認: [other-profit-wording] perspectives.industryPosition.analysis.basis: 売上高と当期純利益以外の利益に触れていないか確認する（…ービス区分の外部顧客への売上高が連結損益計算書の売上高の90％を超えると印字…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期（第56期）の親会社株主に帰属する当期純損失2,381百万円は実際の業績であり、会計基準の変更ではないため、financialNotesには入れず、flowの利益の段で前期値として触れた。
- businessModel: 中期経営計画の目標数値の取り下げは会社が公表した経営方針の事実であり、提出後の予定事項ではないため、needsReviewには入れず、strategy.disclosedにそのまま書いた。
- businessModel: 重要な後発事象・重要な契約等はいずれも該当事項がなく、訂正有報もない。
- businessStructure: 報告セグメントはスーパーマーケット事業のみのため、事業の並びはMD&Aの販売実績（スーパーマーケット事業238,163百万円、その他1,385百万円）の順とした。「その他」は報告セグメントに含まれないため最後に置いた。
- businessStructure: 子会社の金額は独立して開示されていないため、childrenには金額を書かず、その旨を明記した。
- businessStructure: 関連会社の株式会社オー・エンターテイメントは当連結会計年度より持分法の適用範囲から除外されているため、事業には含めなかった。
- history: 沿革は年月と事象が一体で印字されており、崩れた表ではないため、印字どおりに対応づけた。
- history: 店舗の移転・開閉や小規模な子会社化など、会社の姿を変えない行は省いた（本店移転1989年、オーマート設立1991年、湯浅プラザ吸収合併1994年、黒潮設立1997年、ショッピングセンターマミーからの営業譲受2001年、オーマートの営業承継2001年など）。資本金の金額は書いていない。
- industry: 主たる業界は、単一の報告セグメントであるスーパーマーケット事業からretailとした。
- industry: 外食・施設管理・クリーニングは「その他の事業」に含まれ、金額の独立開示がないため、2つ目の業界は付けなかった。
- relatedCompanies: career: 「キャリア」は人材ビジョン等の記述におけるキャリア形成の一般語への一致で、株式会社キャリアへの言及はない。
- relatedCompanies: en: ambiguousの候補。「エン」は関連会社の株式会社オー・エンターテイメントへの言及（エンターテイメントの部分）で、エン株式会社への言及はない。なお、オー・エンターテイメントは候補に含まれておらず、当連結会計年度より持分法の適用範囲から除外されている。
- relatedCompanies: port: 「ポート」は連結子会社の社名「株式会社リテールバックオフィスサポート」の「サポート」の断片への一致で、ポート株式会社への言及はない。
- relatedCompanies: vision: 「ビジョン」は「人材ビジョン」の一般語への一致で、株式会社ビジョンへの言及はない。
- relatedCompanies: yamadai: listingが（コードリストにない）候補。「山大」は子会社の和歌山大同青果株式会社の社名の断片等への一致で、株式会社山大への言及はない。
- relatedCompanies: no-1: 「No.1」は「出店エリアのリージョナルチェーンNo.1」という標語への一致で、株式会社No.1への言及はない。
- relatedCompanies: rent: 「レント」は「タレントマネジメント」の断片への一致で、株式会社レントへの言及はない。
- relatedCompanies: joyfull: 沿革の株式会社ジョイフル朝日（ホームセンター。2002年に合併により株式会社オージョイフルとなり、2007年に当社持分を全て売却）への言及で、外食チェーンの株式会社ジョイフルとは別の会社であり、現在の関係もない。
- relatedCompanies: nissin: listingが（コードリストにない）・ambiguousの候補。新株予約権等の記述の断片への一致で、株式会社日新への言及はない。
- relatedCompanies: freee: 「フリー」は「リスクフリー・レート」の語への一致で、フリー株式会社への言及はない。
- relatedCompanies: heiwado: 特定投資株式として306,200株を保有するが、保有目的は「同業他社の情報収集、同社との友好関係の維持・強化のため」と印字され、取引・提携の記載がないため結ばなかった。1974年の日本流通産業株式会社の共同設立は沿革上の出来事であり、現在の関係の記載はない。
- relatedCompanies: marche: 「マルシェ」は愛知県の店舗名「パレマルシェ池下店」への一致で、マルシェ株式会社への言及はない。
- relatedCompanies: the-kiyo-bank: 大株主（発行済株式の総数に対する割合3.39％、2026年2月20日現在）であり特定投資株式の保有先でもあるが、銀行であり、保有目的も金融取引の円滑化等のためであるため結ばなかった。
- relatedCompanies: izumi: 沿革に1974年の日本流通産業株式会社の共同設立者として名前があるのみで、現在の取引・提携の記載がないため結ばなかった。
- relatedCompanies: land: 「ランド」は「株式会社グランドタマコシ」の断片への一致で、株式会社ランドへの言及はない。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有先だが、金融グループであり、保有目的は金融取引の円滑化及び金融情報の収集等に関わる関係の維持・強化のためであるため結ばなかった。
- relatedCompanies: san-ju-san-financial-group: 特定投資株式の保有先だが、金融グループであり、保有目的は金融取引の円滑化及び地域の経済情報等の相互共有のためであるため結ばなかった。
- relatedCompanies: senshu-ikeda-holdings: 特定投資株式の保有先だが、金融グループであり、保有目的は金融取引の円滑化及び地域の経済情報等の相互共有のためであるため結ばなかった。
- relatedCompanies: slogan: 「スローガン」は「年度スローガン」の一般語への一致で、スローガン株式会社への言及はない。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有先だが、金融グループであり、保有目的は金融取引の円滑化等のためであるため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group: 特定投資株式の保有先だが、信託銀行グループであり、保有目的は金融取引の円滑化等のためであるため結ばなかった。
- relatedCompanies: the-nanto-bank: 特定投資株式の保有先だが、銀行であり、保有目的は金融取引の円滑化等のためであるため結ばなかった。
- relatedCompanies: will: 「ウィル」は「コンピュータウィルス」の断片への一致で、株式会社ウィルへの言及はない。
- relatedCompanies: 大株主のオークワ共栄会（8.78％、取引先を会員とする持株会）・Bermuda Assetment株式会社（3.81％）・公益財団法人大桑教育文化振興財団（3.73％）は候補に含まれていないため結ばなかった。連結子会社5社と関連会社の株式会社オー・エンターテイメントはいずれも未上場で、候補にない。
- terms: 登録候補（助言のみ）: スーパーセンターオークワ（大型店舗の店舗名）、パレマルシェ（愛知県内の店舗名。旧・株式会社パレの店舗）、オークワ共栄会（当社の取引先を会員とする持株会）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
