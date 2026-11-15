# PKSHA Technology — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＰＫＳＨＡ　Ｔｅｃｈｎｏｌｏｇｙ |
| 証券コード | 3993 |
| docID（データを取り出した文書） | `S100XC4P` |
| 原本 docID | `S100XC4P` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XC4P.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＰＫＳＨＡ　Ｔｅｃｈｎｏｌｏｇｙ / 3993 / docID S100XC4P（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
pksha-technology: 10 件の数値を有報XBRLと照合
有報: 株式会社ＰＫＳＨＡ　Ｔｅｃｈｎｏｌｏｇｙ 有価証券報告書－第13期(2024/10/01－2025/09/30) (docID S100XC4P)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-09-30","previousFiling":2100104000,"latestFiling":2082791000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2024-09-30","previousFiling":3343266000,"latestFiling":3316798000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2024-09-30","previousFiling":41696338000,"latestFiling":41785267000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2024-09-30","previousFiling":32245476000,"latestFiling":32228163000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上収益 / 売上高）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: netIncome の候補が 2 件ある（親会社の所有者に帰属する当期利益 / 親会社株主に帰属する当期純利益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
pksha-technology: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社PKSHA　Technology」が EDINET の提出者名「株式会社ＰＫＳＨＡ　Ｔｅｃｈｎｏｌｏｇｙ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の換算規則: 本文の金額は、有報の千円の印字を百万円に切り捨てて表記し、切り上げはしていない。セグメント別の外部売上収益の切り捨て後の合計（12,889百万円＋8,881百万円＝21,770百万円）は印字の合計21,771百万円と1百万円異なり、印字の合計をそのまま本文に用いた。
- businessModel: MD&Aに印字されたセグメント別の売上収益（AI Research & Solution事業12,892百万円、AI SaaS事業9,049百万円）はセグメント間の内部売上収益を含む数値であるため用いず、セグメント注記の外部顧客への売上収益（12,889,589千円、8,881,802千円）を用いた。セグメント利益の金額は本文に書かない規則のため書いていない。
- businessModel: 2024年9月期の数値の前期有報との差異は、株式会社トライアンフの企業結合に係る暫定的な会計処理の確定という印字された理由があるため、financialNotesに記録した。売上収益と従業員数には差異はない。2025年9月期の平均臨時雇用者数123人は外数であり、本文の従業員数には含めていない。
- businessModel: 経営指標等の注記に当社自身の株式分割・株式併合の印字はなく、重要な後発事象は連結・個別とも「該当事項はありません」。株式会社FCEの株式分割（2025年4月1日付、1株につき2株）は保有先の会社のものであるため、当社の分割とは扱わず relatedCompanies のwarningsに記録した。
- businessModel: 配当や中長期の数値目標など投資の語に当たる内容は本文・戦略には書いていない。
- businessStructure: 当社グループは当社、子会社15社、関連会社及び共同支配企業7社を中心に構成される（【事業の内容】）。連結子会社は株式会社アイテック（議決権100.0％、AI Research & Solution事業、特定子会社）、株式会社PKSHA Associates（同100.0％、AI SaaS事業、特定子会社）、株式会社トライアンフ（同100.0％、AI Research & Solution事業、特定子会社）、株式会社サーキュレーション（同100.0％、AI Research & Solution事業、特定子会社）のほか11社である（【関係会社の状況】）。
- businessStructure: 株式会社アイテックについては、売上高（連結会社相互間の内部売上高を除く）の連結売上高に占める割合が10％を超えていることが【関係会社の状況】の注記に印字されている。同社の個別の損益情報の金額は、売上高と当期純利益以外の数値を本文に書かない規則との関係で本文・本warningsのいずれにも金額を転記していない。
- businessStructure: 株式会社Sapeetは2018年7月に子会社化されたが、2024年10月に株式の一部を売却したことにより関連会社化し、期末現在は持分法適用関連会社（議決権36.0％、AI Research & Solution事業）である。有価証券報告書の提出会社であることも印字されている。自社の関連会社であるため relatedCompanies には結んでいない。
- businessStructure: 2025年7月に子会社である株式会社PKSHA Workplaceと株式会社PKSHA Communicationを吸収合併し、2025年8月に株式会社サーキュレーションを子会社化した。いずれも当連結会計年度内に完了し、期末現在の体制に反映されているため needsReview には入れず、沿革と本warningsに記録した。登録は2025年9月30日現在の体制に基づく。
- businessStructure: 地域に関する情報は、本邦以外の顧客・所在資産がないため記載が省略されている。主要な顧客に関する情報は、外部顧客への売上収益の10％以上を占める相手がいないため記載が省略されている（セグメント情報）。
- history: 設立行に資本金の金額は書いていない（沿革に資本金額を書かない規則）。年月は年までとし、月のキーは使っていない。
- history: 採用しなかった主な細目行: アルゴリズムモジュールの開発（2013年2月の予測モジュール＜Predictor＞、2013年11月の強化学習モジュール＜Reinforcer＞、2014年3月の推薦モジュール＜Recommender＞、2014年12月の異常検知モジュール＜Detector＞とテキスト理解モジュール＜Dialogue_1＞、2015年3月の画像/映像解析モジュール＜Recognizer＞、2015年10月の対話モジュール＜Dialogue_2＞）、アルゴリズムソフトウエアのリリース（2015年10月の「CELLOR」、2016年10月の「BEDORE」、2016年12月の「HRUS」）、本店所在地の移転（2013年6月、2014年2月、2016年12月）、子会社の商号変更（2022年4月の株式会社BEDOREから株式会社PKSHA Workplaceへ、株式会社PRAZNAから株式会社PKSHA Communicationへ、2023年1月の株式会社アシリレラから株式会社PKSHA Associatesへ）。いずれも沿革に印字された事実だが、主要な節目に絞って採用した。
- history: 2024年10月に株式会社Sapeetの株式を一部売却し関連会社化した行は、沿革に印字された事実だが、子会社化の行（2018年）と対になる経緯として businessStructure のwarningsに記録し、沿革の行としては採用しなかった。
- industry: 主たる業界は、両報告セグメント（AI Research & Solution事業、AI SaaS事業）ともアルゴリズム・ソフトウエアの開発と提供であることに基づき it とした。閉じた分類に直接合う値があるため taxonomyGaps は設けていない。
- relatedCompanies: fce（株式会社FCE）: 特定投資株式として249,600株を保有し、保有目的は「当社グループは同社と取引を行っており、連携によるシナジー創出のため、同社株式を保有しております」と印字されているが、この文は他の保有銘柄（株式会社ROXX、株式会社サーキュレーション）とも同一の定型文であり、銘柄ごとに個別化された取引の内容の印字がないため結ばなかった。なお、同社は2025年4月1日付で普通株式1株につき2株の株式分割を行ったが、これは保有先の会社の分割であり当社の分割ではない。
- relatedCompanies: roxx（株式会社ROXX）: 特定投資株式として81,610株を保有し、保有目的は株式会社FCEと同一の定型文であるうえ、related-candidates.json の候補に含まれていないため結ばなかった。保有の事実は本warningsに記録した。
- relatedCompanies: porters（ポーターズ株式会社）: 特定投資株式として8,300株を保有するが、保有目的は「市場動向調査のため、当事業年度に同社株式を追加取得しております」と情報収集の目的のみが印字され、取引や提携の印字がないため結ばなかった。
- relatedCompanies: toyota（トヨタ自動車株式会社）: 【大株主の状況】に766,600株（2.46％、2025年9月30日現在）の大株主として印字されているが、取引や提携についての印字が有報の他の節にもないため、大株主の印字だけでは結ばなかった。
- relatedCompanies: japan-securities-finance（日本証券金融株式会社）: 【大株主の状況】に614,900株（1.97％、2025年9月30日現在）の大株主として印字されているが、金融機関の保有であり、取引や提携の印字もないため結ばなかった。日本マスタートラスト信託銀行（信託口）、株式会社日本カストディ銀行（信託口）、BNYM AS AGT/CLTS 10 PERCENTも信託口・常任代理人の保有であるため結んでいない。
- relatedCompanies: ricoh（株式会社リコー）: 有報の本文に同社自身についての取引や提携の記述が確認できないため結ばなかった。
- relatedCompanies: circulation（株式会社サーキュレーション）: 2025年8月に当社が子会社化した当社グループの連結子会社であり、自社の子会社であるため結ばなかった（経緯は沿革に記載）。
- relatedCompanies: sapeet（株式会社Sapeet）: 当社の持分法適用関連会社（議決権36.0％）であり、自社の関連会社であるため結ばなかった（経緯は businessStructure のwarningsに記録）。
- relatedCompanies: rhythm（リズム株式会社）: 「アルゴリズム」の部分一致であり、同社についての記述はないため結ばなかった。
- relatedCompanies: en（エン株式会社）: 「エンジン」等の一般語の部分一致であり、同社についての記述はないため結ばなかった（ambiguous）。
- relatedCompanies: innovation（株式会社イノベーション）: IoTの用語解説など一般語の文脈での部分一致であり、同社についての記述はないため結ばなかった。
- relatedCompanies: step（株式会社ステップ）: 「4つのステップ」という一般語の部分一致であり、同社についての記述はないため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 製品名「PKSHA Vertical Vision」の部分一致であり、同社についての記述はないため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」という一般語の部分一致であり、同社についての記述はないため結ばなかった。
- relatedCompanies: cota（コタ株式会社）: 「コタエル信託」という信託の名称の部分一致であり、同社についての記述はないため結ばなかった（ambiguous）。
- relatedCompanies: freee（freee株式会社）: 「フリーランス」という一般語の部分一致であり、同社についての記述はないため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「サポート」という一般語の部分一致であり、同社についての記述はないため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 会計方針等の一般語の文脈での部分一致であり、同社についての記述はないため結ばなかった（ambiguous）。
- relatedCompanies: base-4481（株式会社ベース）: 「事業利益ベース」という一般語の部分一致であり、同社についての記述はないため結ばなかった。
- relatedCompanies: core（株式会社コア）: 一般語の部分一致であり、同社についての記述はないため結ばなかった（ambiguous）。
- relatedCompanies: kohsoku（株式会社高速）: 「高速化」という一般語の部分一致であり、同社についての記述はないため結ばなかった（ambiguous）。
- relatedCompanies: nissin（日新株式会社）: 日付等の一般語の部分一致であり、コードリストにもないため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: 「セキュリティ」という一般語の部分一致であり、同社についての記述はないため結ばなかった（ambiguous）。
- relatedCompanies: trust（株式会社トラスト）: 信託銀行名の部分一致であり、コードリストにもないため結ばなかった。
- terms: 助言のみ: 「アルゴリズムモジュール」（アルゴリズムを再利用可能な形でひとまとまりにしたプログラム）、「PKSHA ChatAgent」「PKSHA VoiceAgent」（自動応答エンジン）、「PKSHA FAQ」（FAQシステム）、「Yomel」（AI議事録）、「イニシャルフィー／ライセンスフィー」（初期設定時と月額の料金構造）が用語候補。本文側の記述は有報の印字どおりで完結しているため、このファイルの data は空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
