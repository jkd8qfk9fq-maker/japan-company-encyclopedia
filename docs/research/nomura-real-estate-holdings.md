# 野村不動産ホールディングス — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 野村不動産ホールディングス株式会社 |
| 証券コード | 3231 |
| docID（データを取り出した文書） | `S100YH2N` |
| 原本 docID | `S100YH2N` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH2N.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 野村不動産ホールディングス株式会社 / 3231 / docID S100YH2N |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 10 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 10 件） |
| history | completed | 0 | history-agent の成果物あり（警告 7 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nomura-real-estate-holdings: 10 件の数値を有報XBRLと照合
有報: 野村不動産ホールディングス株式会社 有価証券報告書－第22期(2025/04/01－2026/03/31) (docID S100YH2N)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nomura-real-estate-holdings: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIで2026年3月期（第22期）、会計基準は日本基準（Japan GAAP）。訂正有報なし、決算期変更・変則決算なし。前期有報との重複年度に修正再表示なし
- businessModel: セグメント別の金額は【セグメント情報】の「外部顧客への売上高」（百万円）。MD&Aの部門別売上高（部門間の内部売上高を含む）は使っていない。外部顧客売上高の合計は報告セグメント942,230百万円、その他275百万円、連結942,505百万円で一致する
- businessModel: セグメント別の増減理由は【経営者による分析】の部門別の記述をそのまま引いた。都市開発部門は、MD&Aが「収益不動産売却の増加」を主因とすると述べている（部門別の金額内訳は本文に書かなかった）
- businessModel: 当期純利益の増減の理由は有報が述べていないため書かなかった。profit 段は構造の説明にとどめた。事業利益・営業利益・経常利益・セグメント利益は本文規則により書いていない
- businessModel: customers は有報が顧客層を名指ししていない。購入者・入居者は事業内容から読み取れる範囲に限り、仲介の顧客区分（リテール／ミドル／ホールセール）だけは有報の注記どおり。管理を委託する建物の所有者は、運営管理事業が『管理の受託』であることからの表現
- businessModel: revenueSources は、MD&Aの部門別の売上高分類（分譲、売却（収益不動産）、賃貸、運営、仲介手数料、運営管理、受注工事）と【事業の内容】に沿って書いた。資産運用の収入の内訳（フィー等の名称）は有報が分けていないため『資産運用に係る収入』とした
- businessModel: 従業員数9,043人は【主要な経営指標等の推移】の2026年3月期の値（外、平均臨時雇用者数は別に4,301人）
- businessModel: perspectives は strategy の disclosed のみ。業界内の順位・シェアを述べる記述は見つからず、competitiveAdvantage・industryPosition は書かなかった。ROA・ROE・総還元性向などの指標・指針とセグメント別の利益目標は本文規則により書いていない
- businessModel: financialNotes は書かなかった。会計基準の変更・修正再表示・変則決算はなく、野村不動産アメニティサービス㈱の合併（2025年9月1日）は数値の連続性に関する有報の注記としては出ていないため
- businessModel: 事業系統図は画像のため読んでいない。【事業の内容】の文章だけを根拠にした
- businessStructure: 決算期は表紙のDEIで2026年3月期（第22期、2025年4月1日〜2026年3月31日）、会計基準は日本基準（Japan GAAP）。訂正有報なし、決算期変更・変則決算なし（summary.json）
- businessStructure: 事業の並びは【セグメント情報】の「外部顧客への売上高」（2026年3月期）の大きい順：住宅事業431,723、都市開発事業318,711、運営管理事業109,653、仲介・CRE事業62,322、資産運用事業16,102、海外事業3,718（百万円）。最後の「その他」は有報が「報告セグメントに含まれない事業セグメント」と明記しているため、金額（275百万円）にかかわらず末尾に置いた
- businessStructure: 各事業の金額は外部顧客への売上高のみ。セグメント利益（事業損益）・営業利益・持分法投資損益・セグメント資産は本文規則により書いていない。報告セグメントの外部顧客売上高の合計は942,230百万円（有報印字）で、その他275百万円を足した連結売上高942,505百万円と合う
- businessStructure: children（住宅・都市開発・運営管理の下位区分）は【事業の内容】が会社ごとに述べる事業内容の区分で、有報は子区分ごとの金額を開示していない。そのため子区分には金額を書いていない。読者がページ上で確かめられるのは報告セグメントの金額まで
- businessStructure: 【事業の内容】は「野村不動産㈱は事業部門」を基礎にセグメントを構成すると述べる（【セグメント情報】）。野村不動産㈱は住宅・都市開発・海外・資産運用・その他の複数セグメントに現れるため、会社名を事業の担い手として挙げたのは有報が名指ししている範囲に限った
- businessStructure: 海外事業は【関係会社の状況】の海外子会社（NOMURA REAL ESTATE ASIA、THAILAND、UK、VIETNAM、上海など）が「海外」区分に属すると印字している。ただし【事業の内容】が事業内容を述べているのは野村不動産㈱とZEN PLAZA CO., LTDだけなので、説明はその2社に限った
- businessStructure: customers は有報が顧客層を述べていないため全事業で書いていない。主要な顧客ごとの情報は、特定の顧客が連結売上高の10％に満たないため記載省略と印字されている
- businessStructure: 事業系統図は画像のため読んでいない。【事業の内容】の文章だけを根拠にした。拠点・設備の事業対応（facilities.txt）は使っていない
- businessStructure: shortNameEn は省略。有報の英訳名は「Nomura Real Estate Holdings, Inc.」のみで、会社自身が使う短い英字表記の記載はない。推測で作らなかった
- businessStructure: listings は表紙の「東京証券取引所プライム市場」のみ。沿革の「2006年10月 東京証券取引所市場第一部（現 プライム市場）に株式を上場」と整合する
- history: 【沿革】の2011年10月以降の年月セルは、21件（2011年10月〜2025年9月）がまとめて先に印字され、その後に事象文が25件続く崩れた表。年月21件に対し事象25件で数が合わないため、位置による対応づけはしていない（推測で年を当てることを避けた）
- history: 崩れたブロックの事象のうち、同じ有報の別の箇所で日付が裏付けられる3件だけを使った：2011年10月（野村不動産投信への合併。同ブロックの旧 野村不動産投資顧問・野村不動産インベストメント・マネジメントの括弧書きにも「2011年10月」と印字）、2021年4月（野村不動産アーバンネットの野村不動産ソリューションズへの商号変更。＜野村不動産株式会社の沿革＞に「2021年4月」と印字）、2022年4月（株式会社ＵＨＭの吸収合併。2019年5月の行の括弧書きに「2022年4月」と印字）。2025年9月の合併は【事業の内容】にも「2025年９月１日付」と印字されている
- history: 裏付けが取れないため落としたもの（崩れたブロックの事象）：NOMURA REAL ESTATE ASIA PTE.LTD.設立（シンガポール）、野村不動産ウェルネス設立、株式会社メガロスの完全子会社化、ＮＦパワーサービス設立、NOMURA REAL ESTATE HONG KONG LIMITED設立、株式会社ファースト リビング アシスタンス設立、JAPANライフデザイン株式会社との資本提携、野村不動産ホテルズ設立、Tokio Property Services Pte Ltdとの資本提携、株式会社ＵＨＭの全株式取得、NOMURA REAL ESTATE VIETNAM設立、ZEN PLAZA CO.,LTDの完全子会社化、NOMURA REAL ESTATE (THAILAND)設立、ＮＲＥＧ東芝不動産の完全子会社化（旧 野村不動産ビルディング）、東京ガス野村不動産エナジー設立、野村不動産諮詢（上海）設立、野村不動産ビルディングの合併、Federal Land NRE Global Inc.への出資、野村リアルアセット・インベストメント設立、ＵＤＳ株式会社他3社の完全子会社化、2014年4月の野村ビルマネジメントとの合併（これは＜野村不動産株式会社の沿革＞の括弧書きで2014年4月と裏付けられるが、節目として選ばなかった）。海外展開・ホテル・住まいのサービスなど、現在の事業の広がりを示す出来事の年月は、有報の表からは確定できない
- history: 2004年の件は6月（設立）と12月（子会社管理営業の承継）の2行をまとめて1件にした。年は数値1つしか持てないため。2006年の件も、6月のプライムクロス設立（インターネット広告代理店事業）を同じ年の記載としてまとめた
- history: 1957年・1970年の件は、有報の＜野村不動産株式会社の沿革＞（子会社の沿革）の行。年月とその事象が1対1で並ぶ崩れていない表（年月10件・事象10件）で、持株会社の沿革ではないため significance に当時は持株会社がなかったことを書いた。2000年・2001年・2003年・1977年・1987年・1989年・1990年・1991年の各子会社設立は、節目として選ばなかった
- history: 2008年の significance の「その後、完全子会社化・商号変更・合併」は、崩れたブロックの事象（時期は不確定）を年なしで述べたもの。2008年12月の行自体は、年月と事象が崩れる前の部分に1対1で印字されており、取得割合65％もその行から引いた
- history: 沿革の年の表記（2006年10月の「東京証券取引所市場第一部（現 プライム市場）」）は表紙の上場取引所（東京証券取引所プライム市場）と整合する
- industry: real-estate を primary に1つだけ付けた。報告セグメントは住宅・都市開発・海外・資産運用・仲介・CRE・運営管理で、いずれも不動産の開発・賃貸・運営管理・仲介・資産運用であり、掲載済みの三菱地所など同業の慣例と揃う
- industry: UDS㈱の『不動産の企画・設計・施工事業』など建築に関わる記述はあるが、独立した報告セグメントでも金額の開示でもないため construction は付けなかった
- relatedCompanies: 結んだのは野村ホールディングス（8604、上場）のみ。【関係会社の状況】が『その他の関係会社』『被所有 37.14％（間接0.45％）』と印字し、正式名称『野村ホールディングス株式会社』が掲載済みエントリーと一致する。区分は有報の4区分に従い other-affiliated-company とした（business-partner の代用はしていない）
- relatedCompanies: 野村プロパティーズ㈱（野村ホールディングスの子会社）への信託受益権の売却は【関連当事者情報】の記載。同社は掲載済みエントリーに無く、独立の関連企業としては結ばず、野村ホールディングスの説明文に事実だけ書いた。金額は書いていない
- relatedCompanies: 大株主の状況では野村ホールディングスが37.08％（2026年3月31日現在）の筆頭。大株主は関係の種類にしていないが、同社は『その他の関係会社』として資本関係の区分で結んだため、taxonomyGaps には書かない。ほかの大株主（日本マスタートラスト信託銀行、日本カストディ銀行、JPモルガン証券、従業員持株会）は掲載済み候補にない／結ぶ根拠がない
- relatedCompanies: tokyo-gas（東京瓦斯）: 持分法適用関連会社『東京ガス野村不動産エナジー㈱』（議決権34.0％、間接）の社名に『東京ガス』を含むが、有報は東京瓦斯㈱がこの会社の出資者であるとは印字していない。社名の一致だけのため結ばない（同定の根拠なし）。関連会社そのものは未登録で結べない
- relatedCompanies: ricoh: 社外取締役の略歴（リコー取締役会長）に出るのみ。取引・提携の記述なし。結ばない
- relatedCompanies: niterra（日本特殊陶業）: 社外取締役の略歴（社外監査役）に出るのみ。結ばない
- relatedCompanies: mcdonald-s-holdings-company-japan（日本マクドナルドホールディングス）: 社外役員の略歴に出るのみ。結ばない
- relatedCompanies: asahi-kasei（旭化成）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: kubota（クボタ）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: rohto-pharmaceutical（ロート製薬）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: yamaha（ヤマハ）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: yasuda-logistics（安田倉庫）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: ajinomoto（味の素）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: asahi-group-holdings（アサヒグループホールディングス）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: bookoff-group-holdings（ブックオフグループホールディングス）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: canon-marketing-japan（キヤノンマーケティングジャパン）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: jtekt（ジェイテクト）: 社外監査役の略歴に出るのみ。結ばない
- relatedCompanies: modec（三井海洋開発）: 社外取締役の略歴に出るのみ。結ばない
- relatedCompanies: nsk（日本精工）: 取締役の略歴（入社・執行役）に出るのみ。結ばない
- relatedCompanies: zoom（ズーム）: 社外監査役の略歴に出るのみ。結ばない
- relatedCompanies: oracle-corporation-japan（日本オラクル）: 社外監査役の略歴に出るのみ。結ばない
- relatedCompanies: tsukishima-holdings（月島ホールディングス）: 社外監査役の略歴（旧月島機械）に出るのみ。結ばない
- relatedCompanies: nissin（日新）: 監査法人の略歴の部分文字列の一致。listing が『コードリストにない』。結ばない
- relatedCompanies: trust（トラスト）: 『日本マスタートラスト信託銀行』の部分文字列の一致。listing が『コードリストにない』。結ばない
- relatedCompanies: create（クリエイト）: 沿革の『エヌ・エフ・クリエイト』（旧メガロス、現野村不動産ライフ＆スポーツ）の部分文字列の一致。別会社。結ばない
- relatedCompanies: port（ポート）: 『野村不動産パートナーズ』の部分文字列の一致。別会社。結ばない
- relatedCompanies: ings（INGS）: 英字社名『LIMHOLDINGS』の部分文字列の一致。別会社。結ばない
- relatedCompanies: ic / ne / seki / en / como / core / ray / sanno: ambiguous（短い名称の部分文字列の一致。セキュリティ、エンゲージメント、アコモデーション、コア事業、アムステルプレイン、溜池山王ビルなど）。数値のみのエントリーで根拠が弱い。結ばない
- relatedCompanies: vision / note / base-4481 / i-ll / innovation / land / people / career / rent / corona / king / tpr / will: 一般名詞・英字の部分文字列の一致（2030年ビジョン、footnote、連結ベース、アイルランド、イノベーション、ランド、ピープル・マネジメント、キャリア形成、タレントマネジメント、新型コロナ、キング、ウィルミントンなど）。取引・提携・資本関係の記述なし。結ばない
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は担当フィールドを持たない（助言のみ）。data.requiredTermIds と data.proposedTerms は組み立て時に捨てられる想定どおりの内容。
- terms: requiredTermIds は businessModel で実際に使ったリンク4件（[[term:holding-company|純粋持株会社]]、[[term:consolidated-subsidiary|連結子会社]]、[[term:other-affiliated-company|その他の関係会社]]、[[term:segment|セグメント]]）。4件とも src/data/terms/ に存在することを確認した。relatedCompanies の description は RichText を通らないのでリンクは書いていない。
- terms: proposedTerms は今後 terms を新設する場合の参考。id・term・reason 以外のキーは書いていない。提案中の用語にはリンクしていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
