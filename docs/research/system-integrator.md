# システムインテグレータ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社システムインテグレータ |
| 証券コード | 3826 |
| docID（データを取り出した文書） | `S100YCIF` |
| 原本 docID | `S100Y7MS` |
| 提出日（原本） | 2026-05-29 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100YCIF／有効文書 S100YCIF（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCIF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社システムインテグレータ / 3826 / docID S100Y7MS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
system-integrator: 4 件の数値を有報XBRLと照合
有報: 株式会社システムインテグレータ 訂正有価証券報告書－第31期(2025/03/01－2026/02/28) (docID S100YCIF)
前期有報との比較: 6 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 8 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第31期(2025/03/01－2026/02/28)、docID S100YCIF）を有効文書としてこのパックを作った。原本は docID S100Y7MS。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはRemunerationForDirectorsAndOtherOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
system-integrator: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益だけにした。セグメント利益・段階利益の金額と増減率、キャッシュ・フローの金額、総資産・純資産の金額、受注高・受注残高、生産高、設備の帳簿価額、のれんの金額は書いていない。
- businessModel: 当期純利益が前期から減少した理由は、前期に関係会社株式の売却による一時的な利益を計上した反動であると経営者による分析が説明しているが、段階利益の内訳に関わる内容のため本文には書かなかった。
- businessModel: 経営方針に印字された数値目標（2033年２月期の売上高・利益目標、２年経営計画の年度目標、売上高成長率と売上高営業利益率を重要な経営指標とする旨、配当性向の方針）は、利益・投資指標に関する目標のため本文とperspectivesには書かず、方針を定性的に要約した。
- businessModel: 有効文書は訂正有価証券報告書（docID S100YCIF、2026年６月16日提出）である。原本（docID S100Y7MS）との照合では財務数値・本文とも差異がなく、異なるのは役員報酬に関するテキストブロックのみで、本登録が引用しない節であるため、訂正は記録のみとして扱いneedsReviewには入れなかった。前期有報との修正再表示の照合も全系列で差異がなかった。
- businessModel: 経営指標等の注記のうち、潜在株式が存在しないことによる希薄化後指標の非開示、第30期の自己資本利益率の計算方法、従業員数は就業人員である旨は表示方法の注記であり、financialNotesには入れず、連結財務諸表の作成開始（第30期）だけをfinancialNotesに記録した。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」。重要な契約等も「該当事項はありません」。
- businessModel: 株式会社BizSaaSは持分法適用関連会社（議決権39.0％）であり、子会社化した株式会社システム開発研究所（100.0％）・KEYSTONE SOLUTIONS COMPANY LIMITED（83.0％）とともに自社の関係会社であるため、関連企業としては結ばなかった。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高の大きい順（ERP事業、Object Browser事業、AI事業）とし、報告セグメントに含まれない「その他」は金額が無い旨を明記して最後に置いた。３事業の外部顧客への売上高の合計は連結売上高と一致する。
- businessStructure: 子事業（GRANDIT、SAP S/4HANA Cloud Public Edition、Asprova、mcframe、SI Object Browserシリーズ、OBPM Neo）は金額が独立して開示されていないため、金額を書かずその旨を明記した。
- businessStructure: 設備と事業の対応は、主要な設備の状況で本社が全セグメント、大阪支社がObject Browser・ERP・AI、福岡支社がERP・AIと連記されているため、どの事業にも結びつけなかった。設備の帳簿価額は書いていない。
- businessStructure: 連結子会社２社（株式会社システム開発研究所、KEYSTONE SOLUTIONS COMPANY LIMITED）は有報の記載どおりERP事業に属するものとしてERP事業の説明に含めた。自社の子会社・関連会社は関連企業としては結ばない。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。製品の提供元（SAPジャパン株式会社、アスプローバ株式会社、ビジネスエンジニアリング株式会社）の事実は各事業・子事業の説明に書いた。
- businessStructure: セグメント利益の金額は書いていない。
- history: 沿革は年単位で記録し、月は書かなかった。設立時の資本金などの資本金額は書いていない。
- history: 沿革表の2009年９月と2010年４月の２つの年月セルに２つの事象文が続く崩れた箇所があるが、年月と事象の数が一致するため行順で対応づけられる。いずれも小規模な製品・サービスの出来事のため、本登録の沿革には採用せず、ここに記録する。
- history: 採用しなかった主な出来事: ECサイト構築パッケージ「SI Web Shopping」の発売（1996年）、「SI Object Browser ER」の発売（2002年）、各データベース対応版ツールの発売（2008〜2013年）、「SI Object Browser PM」の発売とクラウド提供（2008〜2010年）、プログラミングスキル判定サービス「TOPSIC」の開始（2018年）とAtCoder株式会社への事業譲渡（2025年）、AIサービス「AISIA」シリーズの発売（2018年）、カスタマーサクセス支援サービス「VOICE TICKETS」とアイデア創出プラットフォーム「IDEA GARDEN」の開始（2021年）、株式会社DGコマースの設立（2024年）と全持分の譲渡（2025年）、プロジェクト管理研修サービスの開始（2025年）、支社の設置と本社・支社の移転（2005年、2006年、2014年、2022年）。
- history: Wikipedia の記事は見つからなかった（wikipedia.json は found: false）ため、補足には使っていない。
- industry: 主たる業界は it とした。ERP事業、Object Browser事業、AI事業のいずれもソフトウェア製品の開発・販売とその導入支援であり、IT・ソフトウェアに直接当てはまる。
- industry: 付随する事業はすべてソフトウェア関連で、２つ目の業界は付けなかった。DEIの別記事業はcteである。
- relatedCompanies: business-engineering: 生産管理システム「mcframe」の開発元で、当社が取り扱う製品の提供元であるため supplier として結んだ。
- relatedCompanies: base-4481: 「データベース」などの部分文字列の一致のみで、ベース株式会社との関係は印字されていない。結ばなかった。
- relatedCompanies: port: 「サポート」「レポート」などの部分文字列の一致のみ。結ばなかった。
- relatedCompanies: innovation: 「イノベーションが継続的に提供される」という一般語の一致のみ。結ばなかった。
- relatedCompanies: vision: 「長期ビジョン」という一般語の一致のみ。結ばなかった。
- relatedCompanies: bourbon: 埼玉県の公募公債（サステナブルボンド）購入の文脈で「ボンド」の部分文字列が一致したのみで、株式会社ブルボンとの関係はない。結ばなかった。
- relatedCompanies: seki: 「情報セキュリティ」などの部分文字列の一致のみ（曖昧）。結ばなかった。
- relatedCompanies: the-lead: 「設計リードタイム」という一般語の一致のみ。結ばなかった。
- relatedCompanies: zero: 「ゼロから再設計」という一般語の一致のみ（曖昧）。結ばなかった。
- relatedCompanies: fuji-soft: 持分法適用関連会社である株式会社BizSaaSへの出資者として印字されているが、現在のコードリストに載っていない（上場を確認できない）ため結ばなかった。
- relatedCompanies: fujitsu: 沿革に富士通製データベースSymfoware対応版ツールの発売（2012年）が印字されるのみで、現在の取引・提携の印字はない。結ばなかった。
- relatedCompanies: hitachi: 沿革に日立製作所製データベースHiRDB対応版ツールの発売（2012年）が印字されるのみで、現在の取引・提携の印字はない。結ばなかった。
- relatedCompanies: hikari-tsushin: 大株主として印字されているのは光通信ＫＫ投資事業有限責任組合という投資事業有限責任組合であり、株式会社光通信そのものではないため結ばなかった。
- relatedCompanies: hub: 「設計ハブ」という一般語の一致のみ（曖昧）。結ばなかった。
- relatedCompanies: land: 「企業ブランド」の部分文字列の一致のみ。結ばなかった。
- relatedCompanies: slogan: 「コーポレートスローガン」という一般語の一致のみ。結ばなかった。
- relatedCompanies: suzuki-6785: 大株主の個人名の部分文字列の一致のみ（曖昧）。結ばなかった。
- relatedCompanies: taya: 大株主の住所「世田谷区」の部分文字列の一致のみ（曖昧）。結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: SAPジャパン株式会社（「SAP S/4HANA Cloud Public Edition」の提供元）とアスプローバ株式会社（生産スケジューラー「Asprova」の提供元）は related-candidates.json に無い。特定投資株式は「該当事項はありません」で、政策保有株式による結び付けもない。自社の連結子会社２社と持分法適用関連会社１社は結ばない。
- terms: 助言のみ。用語としては「GRANDIT」「SI Object Browser」「OBPM Neo」「KENZ」「Fit to Standard」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
