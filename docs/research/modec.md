# 三井海洋開発 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三井海洋開発株式会社 |
| 証券コード | 6269 |
| docID（データを取り出した文書） | `S100XU6C` |
| 原本 docID | `S100XU6C` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU6C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三井海洋開発株式会社 / 6269 / docID S100XU6C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
modec: 10 件の数値を有報XBRLと照合
有報: 三井海洋開発株式会社 有価証券報告書－第40期(2025/01/01－2025/12/31) (docID S100XU6C)
前期有報との比較: 29 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益又は親会社の所有者に帰属する当期損失（△） / 親会社株主に帰属する当期純損失（△））。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
すべて一致しました。
modec: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…オペレーションサービスの提供を通じて利益を確保しています。2025年12月期…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上収益と当期利益の金額は、連結経営指標等の邦貨併記（百万円）の印字どおりに書いた。米ドル建ての増加率は邦貨の増加率と異なるため、増加率は書いていない。
- businessModel: 受注高・受注残高の金額は規則により本文に書いていない。中期経営計画の定量目標（純利益の目標値など）も perspectives に書いていない。
- businessModel: Wikipedia（三井海洋開発）の冒頭は有報と重なる内容が中心で、数値や順位は使えないため補足に使わなかった。
- businessModel: 財務数値の基準の混在は是正済み: draft-entry の基準判定（無印字の KeyFinancialData 要素を日本基準とみなす誤り）を修正し、機械の5年数値を再生成した。2021年12月期はIFRS主表の印字どおり（売上収益448,510百万円・税引前損失△39,597百万円・親会社の所有者に帰属する当期損失△41,860百万円・資産合計393,971百万円・親会社の所有者に帰属する持分61,247百万円）、全年度の会計基準はIFRS。邦貨併記の印字と全年度突合済み。
- businessStructure: 事業は浮体式石油生産設備の建造と関連サービスのほぼ単一セグメントで、セグメント情報の記載自体が省略されている。製品・サービス別の外部顧客への売上収益は連結財務諸表注記「23.売上収益」に記載があるが証拠パックに含まれないため、children（EPCI／チャーター／その他サービス）は【事業の内容】のサービス区分で立て、金額は書いていない。
- businessStructure: 地域別の売上収益（2025年12月期）はブラジル向けが最大でガイアナ向けが続くが、地域は事業区分ではないため businesses にはしていない。
- businessStructure: 三井E&Sは2024年5月にその他の関係会社・主要株主・筆頭株主に該当しなくなったが、【大株主の状況】（2025年12月31日現在）には所有割合3.66％で載るため、relatedCompanies では major-shareholder として結んだ。
- history: 沿革は【沿革】の記載順に、会社の形を変えた出来事を中心に13件へ絞った。海外子会社の設立はSHAPE（2021年）とOFFSHORE FRONTIER SOLUTIONS（2022年）以外を落とした。
- history: 2025年11月の合併の発表は、【関係会社の状況】の注記で2025年12月31日付の吸収合併として確認できるため、完了した出来事として沿革に書いた。
- industry: 売上収益のすべてが海洋石油・ガスの生産設備とその操業サービスによるもので、エネルギー開発の領域に属するため energy を主たる業界とした。設備の設計・建造を含むが、自社工場を持たないファブレスであり、設備の保有・リースと操業が事業の中核にあるため machinery は付けなかった。
- relatedCompanies: en: 「エンジニアリング」など一般語の部分一致で、エン株式会社についての記載はないため結ばなかった。
- relatedCompanies: king: 「ワーキンググループ」など一般語の部分一致で、株式会社キングについての記載はないため結ばなかった。
- relatedCompanies: zero: 「ネットゼロ」など一般語の部分一致で、株式会社ゼロについての記載はないため結ばなかった。
- relatedCompanies: core: 「コア事業」など一般語の部分一致で、株式会社コアについての記載はないため結ばなかった。
- relatedCompanies: daisui: 「大水深」の部分一致で、株式会社大水についての記載はないため結ばなかった。
- relatedCompanies: step: 収益認識の「5ステップアプローチ」の部分一致で、株式会社ステップについての記載はないため結ばなかった。
- relatedCompanies: port: 「サポート」の部分一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: career: 「キャリア機会」など一般語の部分一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: corona: 「コロナ禍」の部分一致で、株式会社コロナについての記載はないため結ばなかった。
- relatedCompanies: suzuki-6785: 役員の個人名「鈴木」との一致で、株式会社鈴木についての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「コンディション・ベースド・メンテナンス」の部分一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: innovation: 中期経営計画の名称「イノベーションで持続可能な未来を拓く」の部分一致で、株式会社イノベーションについての記載はないため結ばなかった。
- relatedCompanies: land: 「ニュージーランド」の部分一致で、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: lec: 「フレックスタイム」の部分一致で、レック株式会社についての記載はないため結ばなかった。
- relatedCompanies: seki: ambiguous で、証券会社名などへの部分一致にとどまり、セキ株式会社についての記載はないため結ばなかった。
- relatedCompanies: trust: listing がコードリストになく、日本マスタートラスト信託銀行（信託口）への部分一致のため結ばなかった。
- relatedCompanies: rix: 「スキルマトリックス」の部分一致で、リックス株式会社についての記載はないため結ばなかった。
- relatedCompanies: vision: 「ビジョンとして掲げている」など一般語の部分一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: 東洋エンジニアリングはOFFSHORE FRONTIER SOLUTIONSやTOYO MODEC OFS INDIAの共同設立先だが、候補リスト（related-candidates.json）にないため結ばなかった。
- relatedCompanies: 主要な顧客であるExxonMobil Guyana Limited、Equinor Energy do Brasil Ltda.、Shell Brasil Petróleo Ltda.、Petrobrasはいずれも候補リストにないため結ばなかった。
- terms: 助言: 「FPSO」は用語集に未登録です。浮体式海洋石油・ガス生産貯蔵積出設備の略称で、この会社の中核事業そのものを指し、有報全体で繰り返し使われる中心語のため、登録候補になります。
- terms: 助言: 「EPCI」は用語集に未登録です。設計（Engineering）・調達（Procurement）・建造（Construction）・据付（Installation）を一括で受注するサービスの呼び方で、この会社の事業形態を表す中心語のため、登録候補になります。
- terms: 助言: 「チャーター」は用語集に未登録です。この会社では、関係会社がFPSOなどを保有して貸し出すリースと、操業を担うオペレーションを合わせたサービスの呼び方として使われており、事業モデルを理解する鍵になるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
