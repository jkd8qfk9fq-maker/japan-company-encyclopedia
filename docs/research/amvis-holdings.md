# アンビスホールディングス — research log

Registered: 2026-10-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アンビスホールディングス |
| 証券コード | 7071 |
| docID（データを取り出した文書） | `S100XD1A` |
| 原本 docID | `S100XD1A` |
| 提出日（原本） | 2025-12-25 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-10-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XD1A.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アンビスホールディングス / 7071 / docID S100XD1A（id は英語表記「Amvis Holdings, Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
amvis-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社アンビスホールディングス 有価証券報告書－第9期(2024/10/01－2025/09/30) (docID S100XD1A)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
amvis-holdings: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEI（当事業年度終了日2025-09-30、第9期）から「2025年9月期」、出典idは yuho-2025。証拠パックの docID（S100XD1A）は pipeline/state/amvis-holdings.json と一致、訂正報告書なし、fiscalYearChange なし、irregularPeriods は空、【主要な経営指標等】の各期は12か月。会計基準は表紙のDEIでJapan GAAP。accessedAt は UTC の今日（2026-10-13）。
- businessModel: description は一文・句点1つ・90文字以内。
- businessModel: 金額は、MD&Aが『百万円』の単位つきで印字している値（売上高、営業利益・経常利益・純利益と増減率、売上原価、販売費及び一般管理費、主な相手先別の販売実績）を使った。従業員数5,135人と臨時雇用者826人は【主要な経営指標等】の印字。
- businessModel: EBITDA・EBITDAマージン・営業利益率・自己資本比率の目安・Net Debt/EBITDA倍率はMD&Aと経営方針が使う指標だが、投資指標に近い語を含むため本文に書いていない。
- businessModel: 『入居者の過半数が末期がん患者』は経営方針の中長期戦略の文のとおり。『看護職員9.5:1』は【事業の内容】の印字。
- businessModel: 報酬の支払い元の審査支払機関（神奈川県国民健康保険団体連合会など）は会社ではなく、relatedCompanies でも結んでいない。社会保険診療報酬支払基金の割合9.7％は、MD&Aの表の割合の列の印字。
- businessModel: 財務の注記（data.financialNotes）は1件書いた。draft-entry.json に _注記の候補 は無かったが、【主要な経営指標等】の注記３が、収益認識に関する会計基準等を第6期の期首から適用し、第6期以降は適用後の数値と印字している（2021年9月期は適用前）。効果の大きさは有報が書いていないので書いていない。前期有報との比較（修正再表示チェック）は全て一致。2022年1月1日と2022年10月1日の株式分割は、1株当たりの数値にだけ関わり、本ページの財務の表には出ない。
- businessModel: 報告セグメントの変更の予定は有報の【重要な後発事象】にあり、グループ1の businessStructure の needsReview に書いた。ここでは重ねて書かない。本文では単一セグメントのままの説明にしている。
- businessModel: リンクは既存の用語 annual-securities-report だけ（src/data/terms/ に存在を確認）。投資指標の禁止語は本文に使っていない。
- businessStructure: 決算期は表紙のDEI（当事業年度終了日2025-09-30、第9期）から「2025年9月期」、出典idは yuho-2025。証拠パックの docID（S100XD1A）は pipeline/state/amvis-holdings.json の identity と一致、訂正報告書なし（amendments.status none）、fiscalYearChange は null、irregularPeriods は空。【主要な経営指標等】の第5期〜第9期の決算年月はいずれも9月で、各期は12か月。会計基準は表紙のDEIでJapan GAAP。accessedAt は UTC の今日（2026-10-13）。
- businessStructure: listings: 表紙の上場金融商品取引所名は『東京証券取引所(プライム市場)』。
- businessStructure: 報告セグメントは『医心館事業』の単一セグメント（有報の【セグメント情報】『単一セグメントであるため、セグメント別の記載は省略』、【関連情報】の製品及びサービスごとの情報も『単一の製品・サービスの区分の外部顧客への売上高が損益計算書の売上高の90％を超えているため、記載を省略』）。children の4つのサービスは【事業の内容】が名指しする区分で、金額は独立して開示されていないので書いていない。読者がページ上で確かめられるのは連結の売上高までで、サービス別の金額は確かめられない。
- businessStructure: 『医心館 本郷』の閉鎖と『医心館 姫路』の事業譲渡はMD&Aの記載（当連結会計年度中）。月は書かれていない。
- businessStructure: 大株主の株式会社IDEA Capital（52.97％）は有報の【提出会社の親会社等の情報】が『親会社等』と書く会社（代表取締役 柴原慶一の資産管理会社）で、掲載済みの上場会社ではないため relatedCompanies で結べない。詳細は relatedCompanies の warnings。
- businessStructure: 売上高の主な相手先（神奈川県国民健康保険団体連合会13.2％など）は、診療報酬・介護報酬の審査支払機関で、サービス利用者の自己負担分を除く報酬の支払い元。会社ではない。
- businessStructure: MD&Aが使う指標のうち、EBITDA・EBITDAマージン・営業利益率・自己資本比率の目安などは、投資指標に近い語を含むため本文に書いていない。金額は、MD&Aが『百万円』の単位つきで印字している値と、有報の表（見出しが百万円）の値に限った。
- history: 決算期は表紙のDEI（当事業年度終了日2025-09-30）から「2025年9月期」、出典idは yuho-2025。証拠パックの docID（S100XD1A）は pipeline/state/amvis-holdings.json と一致、訂正なし、fiscalYearChange なし、irregularPeriods は空、各期は12か月。
- history: 【沿革】の表１は『年月／概要』の2列で、年月と事象が1対1で印字されている（崩れていない）。2013年9月〜2023年3月の8行のうち、2014年5月・8月は同じ事業（医心館の開設）なので1件にまとめた。
- history: 2025年2月の株式会社ミドリの買収は【沿革】には無く、【関係会社の状況】の注記3（『当社は2025年２月に株式会社ミドリを買収し、完全子会社としました』）が根拠。
- history: significance の『約3年半後に…スタンダード市場へ移り』は、2019年10月の上場から2022年4月までの期間の算数。上場の市場名は有報の印字のとおり（JASDAQ（スタンダード））。
- history: significance の『株式会社アンビスの売上高は48,794百万円』は、【関係会社の状況】の主要な損益情報（売上高（連結会社相互間の内部取引売上高を除く））の印字。
- industry: 決算期は表紙のDEI（当事業年度終了日2025-09-30、第9期）から「2025年9月期」、出典idは yuho-2025。証拠パックの docID（S100XD1A）は pipeline/state/amvis-holdings.json と一致、訂正報告書なし、fiscalYearChange なし、irregularPeriods は空、各期は12か月。
- industry: retail を暫定の primary にした。事業は医療依存度が高い方向けの有料老人ホーム「医心館」の運営と、訪問看護・訪問介護などの医療・介護サービスの提供で、閉じた集合（19種）に医療・介護サービスの区分が無い。掲載済みの先例（pipeline/taxonomy-gaps.tsv にあるAHCグループ、AIAIグループ。いずれも福祉・介護サービスを retail の暫定にして taxonomyGaps に書いた）に揃えて retail を選んだが、retail は商品を仕入れて売る小売を指す例が多く、サービス事業所を運営する会社の分類としては暫定の当てはめにすぎない。pharmaceuticals は医薬品を製造・販売する会社の区分で当てはまらないと判断した。
- industry: real-estate を付けなかった根拠: 当社が株式会社アンビスに有料老人ホームの用に供する土地及び建物を賃貸しているが、グループ内の取引で、連結の売上は医療保険報酬・介護保険報酬と入居者から受け取る家賃・管理費・食費などの医心館事業の売上として開示されている。単一セグメントで、不動産の賃貸は独立した金額で開示されていない。
- relatedCompanies: 決算期は表紙のDEI（当事業年度終了日2025-09-30、第9期）から「2025年9月期」、出典idは yuho-2025。証拠パックの docID（S100XD1A）は pipeline/state/amvis-holdings.json と一致、訂正報告書なし、fiscalYearChange なし、irregularPeriods は空、各期は12か月。
- relatedCompanies: relatedCompanies は空のまま提出する。有報の次の開示をすべて確認した。
- relatedCompanies: （1）【関係会社の状況】: 連結子会社3社（株式会社アンビス、株式会社明日の医療、株式会社ミドリ）はいずれも非上場で、src/data/companies/ に掲載済みの会社ではない。有報は『有価証券届出書又は有価証券報告書を提出している会社はありません』と書く。
- relatedCompanies: （2）【提出会社の親会社等の情報】: 『当社の金融商品取引法第24条の７第１項に規定する親会社等は、株式会社IDEA Capitalであります』。株式会社IDEA Capital（東京都中央区、資本金100百万円、当社代表取締役 柴原慶一の資産管理会社、議決権の52.97％を所有、2025年9月30日現在）は、parent に当たるが、非上場の資産管理会社で掲載済みではないため結べない（架空の企業は作らない）。登録対象は上場会社で、親会社の関係を結べないことは needsReview に書かない。
- relatedCompanies: （3）【株式の保有状況】: 保有目的が純投資目的以外・純投資目的のいずれも『該当事項はありません』。取引関係を示す政策保有株式の表が存在しない。
- relatedCompanies: （4）【大株主の状況】（2025年9月30日現在）: 株式会社IDEA Capital 52.97％、柴原慶一8.74％、日本マスタートラスト信託銀行株式会社（信託口）5.52％、BNP PARIBAS SINGAPORE/2S/JASDEC/MAYBANK CLT ASET 30E-0B 1.88％、東京短資株式会社1.20％、株式会社日本カストディ銀行（信託口）1.11％、UBS AG LONDON ASIA EQUITIES 0.99％、ＪＰモルガン証券株式会社0.89％、DBS BANK LTD. 700104 0.62％、佐護勝紀0.62％。いずれも掲載済みの上場会社と同定できるものは無い。大株主は関係の種類が無いため結ばず、掲載済みの相手でもないので taxonomyGaps も作らない。
- relatedCompanies: （5）【関連当事者情報】: 株式会社IDEA Capitalによる資金の立替（378百万円）の記載のみ。非上場。
- relatedCompanies: （6）売上の主な相手先（神奈川県国民健康保険団体連合会、東京都国民健康保険団体連合会、社会保険診療報酬支払基金）は診療報酬・介護報酬の審査支払機関で、会社ではない。取引先として名指しされた企業は有報に無い（『アンビスを含め当社グループは病院等の系列には属さず、また特定の医師と包括的な資本関係を持たない』と書く）。
- relatedCompanies: 社名の照合は、全角・半角を揃え『株式会社』『㈱』を除いた掲載済みエントリーの名称（name と officialName）を、証拠パックの全テキストと突き合わせて行った。当たったのは、取締役・監査役の兼職先・前職の社名（中部鋼鈑、エルテス、gooddaysホールディングス、Link-Uグループ、SCSK、東京窯業、リックス）と、一般語（キャリア、イノベーション、ビジョン、トラスト、テクノロジーズ）だけで、事業上の関係の記述ではないので結ばない。掲載企業の一覧は relatedCompanies を書く直前（2026-10-13）に src/data/companies/ を読み直した。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は助言のみで、companySchema に requiredTermIds・proposedTerms というフィールドはない（assemble が捨てる旨の警告を出すのが想定どおり）。
- terms: requiredTermIds の4件は src/data/terms に既にある用語。会計基準は Japan GAAP なので ifrs は挙げていない。
- terms: proposedTerms は有報の【事業の内容】の用語集と【関係会社の状況】に実際に出てくる語に限った。語義は一般的な意味または有報の用語集の説明で、事実は有報の印字に基づく。提案中の用語にはリンクしていない。

## 要確認（status に反映）

- businessStructure: 有価証券報告書の【重要な後発事象】は『翌連結会計年度より報告セグメントを「医心館事業」及び「総合医療支援事業」の報告セグメントに変更することといたしました』と書いている（変更後の区分による金額は『現在算定中』）。翌連結会計年度は2025年10月1日に始まる2026年9月期で、その決算期は今日（2026年10月13日）より前に終わっている。報告セグメントの変更が実際に行われたかどうかは有報から分からない。ここでは有報の当期の区分のとおり医心館事業の単一セグメントとして書いている。変更後の区分の確認が必要かどうか、人が確認してほしい。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] アンビスホールディングス（amvis-holdings）の業界 → 提案: 医療・介護サービス（ヘルスケアサービス。有料老人ホーム・訪問看護・訪問介護などの運営）。有報は、報告セグメントを医心館事業の単一セグメント（有料老人ホーム「医心館」の運営と、同一敷地内の訪問看護・訪問介護・居宅介護支援・居宅介護／重度訪問介護）とし、2025年9月期の連結の売上高は49,174百万円（130事業所、定員6,706人、2025年9月末日現在）と書く。事業の中身は医療依存度が高い方向けのホスピス事業で、閉じた集合の19種に医療・介護サービスの区分が無い。retail は商品を仕入れて売る小売を指す例が多く、サービス事業所を運営する会社の分類としては暫定の当てはめにすぎない。
