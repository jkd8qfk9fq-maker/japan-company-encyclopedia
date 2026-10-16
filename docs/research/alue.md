# アルー — research log

Registered: 2026-10-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アルー株式会社 |
| 証券コード | 7043 |
| docID（データを取り出した文書） | `S100XT2J` |
| 原本 docID | `S100XT2J` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-10-10 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT2J.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アルー株式会社 / 7043 / docID S100XT2J（id は英語表記「Alue co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 8 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 8 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
alue: 10 件の数値を有報XBRLと照合
有報: アルー株式会社 有価証券報告書－第23期(2025/01/01－2025/12/31) (docID S100XT2J)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
alue: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEI（当事業年度終了日2025-12-31、第23期）から「2025年12月期」、出典idは yuho-2025。証拠パックは pipeline/state/alue.json の identity.docID（S100XT2J）と一致、訂正報告書なし、fiscalYearChange は null、irregularPeriods は空で、【主要な経営指標等】の各期は12か月。accessedAt は UTC の今日（2026-10-13）。
- businessModel: description は一文・句点1つ・90文字以内。「人材育成」という語は有報の言葉。
- businessModel: 金額は、MD&Aが「千円」の単位つきで印字している値（サービス別の売上高と前年同期比、営業利益・経常利益・当期純利益とその増減額）だけを使った。【関連情報】の表にある教室型研修・グローバル人材育成の売上高は、セルが数字だけで単位が表の見出しにあるため書いていない。
- businessModel: 利益の増加の理由は、MD&Aが書く文（教室型研修の受注・納品の好調、期初計画以上の売上高、外注費・労務費の減少による売上総利益率の向上）の範囲で書いた。前年同期の営業利益が赤字だったことは、MD&Aの目標指標の表（前連結会計年度の営業利益がマイナス）と増加額から分かる。
- businessModel: flow の「アルー」の従業員数は【従業員の状況】（連結198人、臨時雇用人員の平均42人、2025年12月31日現在）。提出会社単体の従業員数は153人（同日現在）。
- businessModel: financialNotes: draft-entry.json に _注記の候補 は無い。【主要な経営指標等】の注記4が、収益認識に関する会計基準等を第20期の期首から適用し、第20期以降は適用後の数値と印字しているため、その事実だけを2022年12月期（第20期）に書いた。表の最初の年（2021年12月期、第19期）が適用前であるとは、有報が書いていないので書かなかった。注記5（第23期に企業結合に係る暫定的な会計処理の確定を行ったが、第22期の関連する主要な経営指標等に影響はない）は、影響がないと有報が書いており数字を読み違える原因にならないため、財務の注記には書かなかった。前期有報との差は無い（修正再表示チェックは全て一致）。
- businessModel: businessModel.description の [[term:annual-securities-report|有価証券報告書]] は src/data/terms にある用語へのリンク（ラベル付き）。
- businessModel: 連結の範囲の変更（株式会社エナジースイッチの吸収合併による連結除外、QUINTEGRAL PHILIPPINES, INC. の連結追加でこの期は貸借対照表のみ連結）は businessStructure と history に書いたため、ここでは繰り返さなかった。
- businessStructure: 証拠パックの確認: アルー株式会社（証券コード7043、EDINETコードE34498、docID S100XT2J、第23期 2025年1月1日〜2025年12月31日、2026年3月24日提出、Japan GAAP、連結決算あり）。pipeline/state/alue.json の identity.docID と一致。決算期ラベルは表紙のDEI（当事業年度終了日2025-12-31）から「2025年12月期」、出典idは yuho-2025。訂正報告書なし（amendments は status none）、fiscalYearChange は null、irregularPeriods は空。【主要な経営指標等】の決算年月は2021年12月〜2025年12月の毎年12月で、12か月でない期はない。
- businessStructure: 報告セグメントは「人材育成事業」の1つだけ（【事業の内容】【セグメント情報】）。単一セグメントの会社なので、親の businesses を単一セグメントの1ノードにし、【関連情報】の「製品及びサービスごとの情報」の区分（法人向け教育［教室型研修・グローバル人材育成］、etudes、海外教室型研修）を children にした。children の並びは、MD&Aの販売実績の表が印字する売上高の順（法人向け教育3,060,306、etudes436,573、海外教室型研修140,963の各千円）。「報告セグメントに含まれない」区分はない。
- businessStructure: 金額は、MD&Aが「千円」の単位つきで印字している値（サービス別の売上高と前年同期比、営業利益）だけを使った。【関連情報】の表にある教室型研修とグローバル人材育成の売上高は、セル内が数字だけで単位が表の見出しにある値のため書かず、2区分を法人向け教育の下位区分として文章で説明した（MD&Aは法人向け教育を1区分として印字）。表の2区分の合計はMD&Aの法人向け教育の売上高より1千円小さいが、有報自身の丸めと判断し、MD&Aの印字値をそのまま引用した。
- businessStructure: MD&Aは海外教室型研修を「その他」の見出しの下に置いているが、売上高の順では3番目でもあり最後に置いた。「報告セグメントに含まれない」区分ではない（単一セグメントの内訳）。
- businessStructure: 関係会社の位置づけ: 連結子会社6社（クインテグラル株式会社、艾陸企業管理諮詢(上海)有限公司、ALUE SINGAPORE PTE. LTD.、Alue India Private Limited、ALUE PHILIPPINES INC.、ALUE TRAINING CENTER, INC.）、連結子会社の子会社1社（QUINTEGRAL PHILIPPINES, INC.）、非連結子会社1社（PT.ALUE INDONESIA）。事業の区分ではなく関係会社なので businesses のノードにはせず、担当するサービス区分の description に書いた（【事業の内容】の主な関係会社の欄の印字どおり）。ALUE TRAINING CENTER, INC. は当社の出資比率が40％だが、支配力基準の適用により連結子会社としている（【関係会社の状況】の注記5）。
- businessStructure: QUINTEGRAL PHILIPPINES, INC. は、2025年12月23日の株式取得、みなし取得日は2025年12月31日で、2025年12月期は貸借対照表のみを連結している（【連結の範囲の変更】【企業結合等関係】）。この期の売上高・利益には含まれないため、海外教室型研修の説明でそのとおり書いた。
- businessStructure: 上場区分: 表紙の上場金融商品取引所は「東京証券取引所グロース市場」。listings の market はその印字から「グロース」。
- businessStructure: businesses[].description に [[…]] のリンクは使っていない。
- history: 証拠パックの確認: アルー株式会社（証券コード7043、EDINETコードE34498、docID S100XT2J、第23期 2025年1月1日〜2025年12月31日、2026年3月24日提出、Japan GAAP、連結決算あり）。pipeline/state/alue.json の identity.docID と一致。決算期ラベルは表紙のDEI（当事業年度終了日2025-12-31）から「2025年12月期」、出典idは yuho-2025。訂正報告書なし（amendments は status none）、fiscalYearChange は null、irregularPeriods は空。【主要な経営指標等】の決算年月は2021年12月〜2025年12月の毎年12月で、12か月でない期はない。
- history: 【沿革】の表は、年月と事象が1対1で印字されていて崩れていない。年月のセルがまとまって先に印字される形ではなく、位置による対応づけや年の推測はしていない。
- history: 同じ年の出来事は、2011年（シンガポール・インド・インドネシア）と2024年（2社の株式取得）でそれぞれ1件にまとめた。2025年は性格の違う2件（合併、孫会社化）に分けた。別の年の出来事を同じ項目に入れたものはないが、2013年の項目だけは、同じサービス「ALUGO」の2016年4月の個人向け開始を同じ項目の description に書いた。
- history: 個別の項目にしなかった【沿革】の行（落とした行の一覧）: 2008年3月 プライバシーマーク取得、2009年11月 本社を新宿区市谷本村町に移転、2014年1月 名古屋支社を開設、2016年5月 本社を千代田区九段北に移転、2017年4月 フィリピンにALUE PHILIPPINE HOLDINGS INC.（現 ALUE TRAINING CENTER, INC.）を設立、2023年2月 ISMS認証取得。いずれも独立した出来事として書くほどの情報が沿革にないと判断した。事実として誤りがあるわけではない。
- history: 社名の読み方・併記: 2003年10月の設立時の社名は「株式会社エデュ・ファクトリー(現 アルー株式会社)」と印字されている。
- history: 沿革の「現・連結子会社」「現・非連結子会社」の表記は【沿革】の印字、特定子会社と議決権の割合、関係内容は【関係会社の状況】の印字。金額は、2025年12月期の売上高3,637,843千円（MD&Aの印字）とetudesの売上高436,573千円（同）だけを使った。取得対価などの千円単位の値は、表やセルに単位がなく照合できない記載があるため書いていない。
- history: 2025年の合併の日付（取締役会決議2025年9月18日、効力発生日2025年11月1日）は【企業結合等関係】の印字で、【沿革】は「2025年11月 株式会社エナジースイッチを吸収合併」と印字している。両者は整合する。QUINTEGRAL PHILIPPINES, INC. の株式取得日2025年12月23日とみなし取得日2025年12月31日は【企業結合等関係】の印字（【沿革】は2025年12月）。
- history: 年表の title に [[company:…]] のリンクは使っていない。description と significance にも [[…]] のリンクは使っていない。
- industry: 決算期は表紙のDEI（当事業年度終了日2025-12-31、第23期）から「2025年12月期」、出典idは yuho-2025。証拠パックは pipeline/state/alue.json の identity.docID（S100XT2J）と一致、訂正報告書なし、fiscalYearChange は null、irregularPeriods は空で、【主要な経営指標等】の各期は12か月。accessedAt は UTC の今日（2026-10-13）。
- industry: human-resources を primary にした根拠: 有報の事業は「人材育成事業」の単一の報告セグメントで、法人向けの研修（教室型研修、グローバル人材育成）が売上高の大部分（2025年12月期は法人向け教育が3,060,306千円、売上高の合計3,637,843千円）を占める。閉じた集合に研修・教育の区分は無く、「人材サービス」の human-resources が最も近い。掲載済みの先例では、従業員の人材育成の支援を事業に含むアドバンテッジリスクマネジメント（advantage-risk-management）が human-resources を primary にしている。
- industry: it を付けた根拠: etudes（クラウド型eラーニングシステム、LMS）を独立したサービス区分として提供し、MD&Aが売上高436,573千円（前年同期比18.9%増）を単位つきで印字している。クラウド型のシステムの提供は it の範囲に含まれると判断した。ただし単一セグメントの会社で、セグメントの金額ではなくサービス別の金額による判断。読者がページ上で確かめられるのはMD&Aが印字するサービス別の売上高まで。
- industry: 教育を専門にする区分が無いことは taxonomyGaps に書いた（暫定は human-resources）。
- relatedCompanies: 決算期は表紙のDEI（当事業年度終了日2025-12-31、第23期）から「2025年12月期」、出典idは yuho-2025。証拠パックは pipeline/state/alue.json の identity.docID（S100XT2J）と一致、訂正報告書なし、fiscalYearChange は null、irregularPeriods は空で、【主要な経営指標等】の各期は12か月。accessedAt は UTC の今日（2026-10-13）。
- relatedCompanies: relatedCompanies は空のまま提出する。以下を確認したうえでの判断である。
- relatedCompanies: （1）【提出会社の親会社等の情報】は「金融商品取引法第24条の７第１項に規定する親会社等はありません」。【関係会社の状況】の連結子会社（クインテグラル株式会社、艾陸企業管理諮詢(上海)有限公司、Alue India Private Limited、ALUE SINGAPORE PTE. LTD.、ALUE PHILIPPINES INC.、ALUE TRAINING CENTER, INC.）、連結孫会社（QUINTEGRAL PHILIPPINES, INC.）、非連結子会社（PT.ALUE INDONESIA）はいずれも非上場で、同注記3は「有価証券届出書又は有価証券報告書を提出している会社はありません」と印字している。掲載済みのエントリーには該当しない。関連会社（持分法適用）は無い。
- relatedCompanies: （2）【株式の保有状況】は、純投資目的以外の保有株式が非上場株式1銘柄だけで、特定投資株式・みなし保有株式は「該当事項はありません」。結べる上場会社の取引関係は書かれていない。
- relatedCompanies: （3）【セグメント情報】【販売実績】は「売上高の10%以上を占める相手先がない」と書き、名指しの顧客企業が無い。仕入先・提携先として名指しされる掲載済みの上場会社も、有報には無い。人材育成組織のAMA（アメリカンマネジメントアソシエーション）は、クインテグラル社が持つトレーニングプログラムの開発元として出てくる海外の組織で、上場会社として掲載されていない（結べない相手）。
- relatedCompanies: （4）【大株主の状況】（2025年12月31日現在）は、落合文四郎氏（31.45％、個人）、株式会社フォーティーシクサーズ（17.34％、東京都文京区）、新井友行氏、池田祐輔氏、野村證券株式会社、湯川泰行氏、アルー社員持株会、株式会社SBI証券、稲村大悟氏、株式会社こやの。大株主は関係の種類が無いため結ばない。掲載済みで同定できる上場会社は無く（フォーティーシクサーズ、こやのは掲載済みに無い。野村證券とSBI証券は金融商品取引業者の名義で、有報は保有目的を書いていない）、taxonomyGaps も作らない。
- relatedCompanies: 社名の照合は全角・半角、「株式会社」「㈱」を除いて、証拠パックの全文を掲載済みエントリーの名称と突き合わせた。当たったのは、役員の略歴に出てくる他社名（三菱商事、ファーストリテイリング、イオン、大和証券グループ本社、Gunosy、じげん、オイシックス・ラ・大地、新電元工業、東京コスモス電機など）と、「ヒューリック九段ビル」（本社の所在する建物名）、一般語（ベース、キャリア、ポート、キング）だけ。役員の兼職・経歴・本社ビルの名称であり、事業上の関係の記述ではないので結ばない。
- relatedCompanies: 登録後に結び直す価値のある相手は、有報の記載の範囲では無い。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は助言のみで、companySchema に requiredTermIds・proposedTerms というフィールドはない（assemble が捨てる旨の警告を出すのが想定どおり）。
- terms: requiredTermIds の4件は、src/data/terms に既にある用語（annual-securities-report、segment、consolidated-subsidiary、subsidiary）。businessModel の本文は annual-securities-report にだけリンクしている。
- terms: proposedTerms は、有報の【事業の内容】【関係会社の状況】【企業結合等関係】に実際に出てくる語に限った。語義は一般的な用語の意味で、金額・事実は有報の印字に基づく。提案中の用語にはリンクしていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] アルー（alue）の主たる業界（法人向けの研修サービス。2025年12月期の法人向け教育の売上高は3,060,306千円で、売上高の合計は3,637,843千円） → 提案: 教育・研修サービス（企業研修、eラーニングなどの人材育成）。有報の事業は企業などへの研修・eラーニングによる人材育成の支援で、人材の紹介・派遣を行う会社ではない。閉じた集合（INDUSTRY_IDS）に教育・研修の区分が無く、人材の育成を含む「人材サービス」に最も近い human-resources を暫定にした。
