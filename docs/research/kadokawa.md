# KADOKAWA — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＫＡＤＯＫＡＷＡ |
| 証券コード | 9468 |
| docID（データを取り出した文書） | `S100YGF5` |
| 原本 docID | `S100YGF5` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGF5.pdf / `wikipedia` https://ja.wikipedia.org/wiki/KADOKAWA

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＫＡＤＯＫＡＷＡ / 9468 / docID S100YGF5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 33 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 4 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kadokawa: 10 件の数値を有報XBRLと照合
有報: 株式会社ＫＡＤＯＫＡＷＡ 有価証券報告書－第12期(2025/04/01－2026/03/31) (docID S100YGF5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kadokawa: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 正式名称「株式会社KADOKAWA」が EDINET の提出者名「株式会社ＫＡＤＯＫＡＷＡ」と違います
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や人件費などの費用を差し引いた残りが利益になります。2026年3月期のは1,…）

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の目標のうち営業利益・ROE・EPSの数値は、文章の規則（本文の財務数値は売上高と当期純利益だけ）により書かず、売上高の目標だけを perspectives に記載した。
- businessModel: パックの注意にあった「財務諸表の組替え」の記載は、有報の本文ファイル（財務諸表の注記は証拠パックの対象外）に該当箇所を確認できず、前期有報との修正再表示チェックでも全項目に差異がなかったため、組替えに関する財務注記は置かなかった。会計基準の変更や決算期の変更もない。
- businessModel: 早期退職特別募集施策は、決議済みだが募集・退職は今後の予定であり影響額も未確定のため、financialNotes に事実を記録し、needsReview にも入れた。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。「その他」は有報が報告セグメントに含まれない区分と明記するため最後に置いたが、金額はセグメント注記に印字されているため記載した。
- businessStructure: 子区分（children）の金額は独立して開示されていないため、各子区分の説明にその旨を明記し、金額は書いていない。
- businessStructure: グループの構成は【事業の内容】の連結子会社57社・持分法適用会社11社（2026年3月31日時点）に基づく。
- history: 沿革は有報【沿革】の表の行をそのまま採用した。年月と事象の対応は表の記載順どおりで、崩れた表ではないため行の対応づけは不要だった。
- history: 1945年の角川書店の創設は有報の沿革に記載がないため、Wikipediaの補足として加えた（数値は使っていない）。
- industry: 出版に相当する閉じた分類がないため、会社自身が掲げる「総合エンターテインメント企業」の位置づけから entertainment を主産業とし、書籍・雑誌の出版とWebメディア・動画サービスの面から media を第2の産業とした。教育・EdTech事業は金額が独立開示された報告セグメントだが、教育に相当する閉じた分類もないため産業は足していない。
- relatedCompanies: seki： 「セキ」は一般語句の断片一致で、有報にセキ㈱との取引・提携の記載がないため結ばなかった。
- relatedCompanies: en： 「エン」はエンジニア等の一般語句の断片一致で、エン㈱との関係の記載がないため結ばなかった。
- relatedCompanies: yamachuu： 役員氏名等の断片一致で、㈱山忠との関係の記載がないため結ばなかった。
- relatedCompanies: career： 「キャリア」は人材・働き方に関する一般語句の断片一致で、㈱キャリアとの関係の記載がないため結ばなかった。
- relatedCompanies: port： 「ポート」はポートフォリオの断片一致で、ポート㈱との関係の記載がないため結ばなかった。
- relatedCompanies: core： 一般語句の断片一致で、㈱コアとの関係の記載がないため結ばなかった。
- relatedCompanies: hit： 「ヒット」はヒット作品等の一般語句で、㈱ヒットとの関係の記載がないため結ばなかった。
- relatedCompanies: zero： 「ゼロ」はゼロトラスト・排出実質ゼロ等の一般語句で、㈱ゼロとの関係の記載がないため結ばなかった。
- relatedCompanies: base-4481： 「ベース」は営業利益ベース等の一般語句で、ベース㈱との関係の記載がないため結ばなかった。
- relatedCompanies: freee： 「フリー」はフリーランス法等の一般語句で、フリー㈱との関係の記載がないため結ばなかった。
- relatedCompanies: vision： 連結子会社グロービジョン㈱の社名の一部で、㈱ビジョンとの関係の記載がないため結ばなかった。
- relatedCompanies: tein： 「エンタテインメント」等の断片一致で、㈱テインとの関係の記載がないため結ばなかった。
- relatedCompanies: trust： コードリストにない相手で、記載もゼロトラスト等の一般語句の断片一致のため結ばなかった。
- relatedCompanies: mec： 連結子会社㈱アニメックの社名の断片で、メック㈱との関係の記載がないため結ばなかった。
- relatedCompanies: land： 作品名等の断片一致で、㈱ランドとの関係の記載がないため結ばなかった。
- relatedCompanies: como： 持分法適用関連会社㈱ドコモ・アニメストアの社名の断片で、㈱コモとの関係の記載がないため結ばなかった。なお、㈱ドコモ・アニメストア自体は未上場で候補にないため結んでいない。
- relatedCompanies: innovation： 「イノベーション」は一般語句で、㈱イノベーションとの関係の記載がないため結ばなかった。
- relatedCompanies: hub： 「ハブ」は戦略上の位置づけを表す一般語句の断片一致で、㈱ハブとの関係の記載がないため結ばなかった。
- relatedCompanies: lec： 「レック」はアニプレックス等の文脈の断片一致で、レック㈱との関係の記載がないため結ばなかった。
- relatedCompanies: path： 「パス」はキャンパス等の断片一致で、パス㈱との関係の記載がないため結ばなかった。
- relatedCompanies: ray： 「レイ」はワークプレイス等の断片一致で、㈱レイとの関係の記載がないため結ばなかった。
- relatedCompanies: rent： 「レント」はタレント等の断片一致で、㈱レントとの関係の記載がないため結ばなかった。
- relatedCompanies: sony-financial-group： 2025年10月1日にソニーグループが実施したパーシャル・スピンオフにより取得した株式で、事業上の取引・提携の記載がなく、今後は縮減の可能性も検討するとされているため結ばなかった。
- relatedCompanies: dai-nippon-printing： 出版関連の取引円滑化を目的に保有していたが、当事業年度に全株式を売却済みで現在の関係がないため結ばなかった。
- relatedCompanies: japan-pulp-and-paper： 出版関連の取引円滑化を目的に保有していたが、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: nippon-paper-industries： 出版関連の取引円滑化を目的に保有していたが、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: mitsubishi-paper-mills： 出版関連の取引円滑化を目的に保有していたが、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: media-do： 出版関連の取引円滑化を目的に保有していたが、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: imagica-group： コードリストにない相手であり、映像関連の取引円滑化を目的に保有していた株式も当事業年度に全て売却済みのため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group： 主要取引金融機関としての保有で資金調達面の関係にあたり、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: mizuho-financial-group： 主要取引金融機関としての保有で資金調達面の関係にあたり、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group： 主要取引金融機関としての保有で資金調達面の関係にあたり、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: ㈱WOWOWは特定投資株式に雑誌・広告関連の取引円滑化目的の保有が載るが、候補リストにないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 重要な後発事象：2026年5月14日の取締役会で、当社社員を対象とした早期退職特別募集施策の実施を決議しました。募集期間は2026年6月1日から6月26日まで（予定）、退職日は2026年7月31日（予定）で、割増退職金は2027年3月期に計上する予定ですが、応募者数と影響額は未確定で、実施結果は確認できていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] KADOKAWAの出版・IP創出事業 → 提案: publishing（出版）。売上高の過半を占める出版・IP創出事業に相当する閉じた分類がなく、主産業を entertainment で暫定としているため
