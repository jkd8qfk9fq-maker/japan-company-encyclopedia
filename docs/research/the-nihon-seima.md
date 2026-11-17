# 日本製麻 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本製麻株式会社 |
| 証券コード | 3306 |
| docID（データを取り出した文書） | `S100YFIL` |
| 原本 docID | `S100YFIL` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFIL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本製麻株式会社 / 3306 / docID S100YFIL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-nihon-seima: 10 件の数値を有報XBRLと照合
有報: 日本製麻株式会社 有価証券報告書－第98期(2025/04/01－2026/03/31) (docID S100YFIL)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":3151011000,"latestFiling":2154051000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":3733311000,"latestFiling":2317479000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":4334457000,"latestFiling":2358577000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":4422391000,"latestFiling":2492948000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":74598000,"latestFiling":59236000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":178469000,"latestFiling":86460000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":321776000,"latestFiling":98069000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":262057000,"latestFiling":92984000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":3634525000,"latestFiling":2064911000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":4048246000,"latestFiling":2124169000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":4623355000,"latestFiling":2227289000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":5685263000,"latestFiling":2960249000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":2197366000,"latestFiling":898647000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":2511368000,"latestFiling":964748000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":2880154000,"latestFiling":1028685000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":3710364000,"latestFiling":1512241000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":255,"latestFiling":77},{"key":"NumberOfEmployees|2023-03-31","previousFiling":275,"latestFiling":77},{"key":"NumberOfEmployees|2024-03-31","previousFiling":283,"latestFiling":86},{"key":"NumberOfEmployees|2025-03-31","previousFiling":279,"latestFiling":81}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
the-nihon-seima: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益だけにし、MD&Aの営業損失・経常損失の金額や増減率、キャッシュ・フローの金額は書かなかった。
- businessModel: 事業別の売上高はセグメント情報等の注記の外部顧客への売上高（千円）を百万円未満切り捨てで書いた。切り捨て後の事業別合計は2,397百万円で、印字の売上高2,399百万円とは切り捨て差がある。その他（不動産事業）は2,704千円（切り捨てで２百万円）である。
- businessModel: 前期有報との修正再表示チェックの差異は、前期有報では連結ベースの主要な経営指標等が抽出されていた一方、当期有報は非連結移行後の単体ベースの表であることによる範囲の違いであり、当期有報の値をそのまま使った。理由は企業結合等関係の注記（連結子会社株式の譲渡・非連結決算への移行）と主要な経営指標等の推移の注記４（第97期まで連結財務諸表を作成）に印字されている。
- businessModel: 財務諸表の組替えの警告については、抽出済みの本文・注記の範囲では、主要な経営指標等の数値の変更を伴う組替えの注記は確認できなかったため、組替え自体はfinancialNoteにはせず、差異の理由は上記の連結・単体の範囲の違いとして記録した。
- businessModel: 関係会社株式売却益855,296千円は、本文には金額を書かず、売却益の計上が当期純利益の増加の主因である旨だけを書いた。
- businessModel: 経営上の目標の指標として従来掲げていた売上高に関する利益率の目標は、有報が客観的な指標等を特に定めていない旨に変更しており、数値目標は本文・strategyのいずれにも書かなかった。
- businessModel: Wikipediaの記事（SEIMAホールディングス）は、有報の表紙の会社名や本文の記載と一致しない内容を含むため、出典として使わなかった。
- businessStructure: 事業の並び順は、有報の記載順（食品事業、産業資材事業、マット事業、その他）に合わせた。事業別の売上高はセグメント注記の外部顧客への売上高（千円）の切り捨てであり、切り捨て後の合計は2,397百万円で、印字の売上高2,399百万円とは切り捨て差がある。
- businessStructure: このツリーの旧スキーマに従い suppliers キーは付けていない。産業資材事業とマット事業の輸入取引の相手は、関連企業の warnings に記録したトレーディア株式会社・トーア紡コーポレーションとの関係を参照。
- businessStructure: 設備と事業の対応は設備の状況のセグメント欄どおりとした。北陸工場は食品事業、東京支店はその他事業に結びつけた。本社の行は全社（共通）のためどの事業にも結びつけなかった。設備の帳簿価額は書かなかった。
- businessStructure: 主要株主である株式会社ゴーゴーカレーグループとは、レトルトカレーの販売等の取引関係がある旨が事業の内容に印字されている。同社は非上場で関連企業候補に無いため、関連企業としては結ばず、ここに記録した。
- businessStructure: Wikipediaの記事（SEIMAホールディングス）は、有報の記載と一致しない内容を含むため、出典として使わなかった。
- businessStructure: その他（不動産事業）の外部顧客への売上高の印字は2,704千円であり、本文では百万円未満切り捨てで２百万円と書いた。
- history: 設立時の資本金は、規則により沿革に書かなかった。
- history: 次の項目は転換点として採用した項目と重なるか細部であるため沿革に入れず、ここに列挙した：1961年兵庫工場の完成、1969年タイ国への進出（サラブリジュートミル設立）、1975年兵庫工場の閉鎖、1980年サラブリジュートミルのオリエンタルジュートミルへの社名変更と1984年の売却、1985年の新サイロ完成と鮎養殖場の操業開始、1990年のホテル「ニチマ倶楽部」の営業開始、1991年の関西工場売却とホテル・レストラン営業部門の営業譲渡、1992年のホテル売却、1994年の関西工場閉鎖、1995年の賃貸事業用不動産の完成、1999年のホテル＆レストランの営業の譲受けと砺波アーバンリゾート株式会社の子会社化、2013年の砺波アーバンリゾートの清算結了、2019年のサハキット・ウィサーンによるインド合弁会社の設立。
- history: Wikipediaの記事は有報の記載と一致しない内容を含むため、沿革の補足には使わなかった。
- industry: 主たる業界は、外部顧客への売上高の過半（1,284百万円）を占める食品事業（スパゲッチ、カレー・レトルトソース等の製造販売）から food とした。
- industry: 産業資材事業は、黄麻製品・大型包装資材等の輸入販売が実体であるため trading を付けた。
- industry: マット事業は、自動車用フロアーマットの販売であり、販売先が自動車メーカーであるため automotive を付けた。
- relatedCompanies: path（パス）: 印字は「パスタ」の一部であり、パス株式会社ではないため結ばなかった。
- relatedCompanies: career（キャリア）: 印字は「キャリア採用」の一般語であり、株式会社キャリアではないため結ばなかった。
- relatedCompanies: en（エン）: ambiguous で、印字はタイ子会社の社名変更等の文脈であり、エン株式会社ではないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 印字はサステナビリティの文脈の一般語であり、株式会社イノベーションではないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「営業利益ベースの数値」の一般語の一部であり、ベース株式会社ではないため結ばなかった。
- relatedCompanies: corona（コロナ）: 「コロナ禍」の文脈のみであり、株式会社コロナではないため結ばなかった。
- relatedCompanies: land（ランド）: 「ブランド」の一般語の一部であり、株式会社ランドではないため結ばなかった。
- relatedCompanies: moi（モイ）: ambiguous で、印字は主要株主LEOMO.Inc.（関連当事者情報ではリオモインク）の一部であり、モイ株式会社とは確認できないため結ばなかった。
- relatedCompanies: nissin（日新）: コードリストに無く、印字は新株予約権の条文等の文脈であり、株式会社日新とは確認できないため結ばなかった。
- relatedCompanies: resona-holdings（りそなホールディングス）: 特定投資株式として保有するが、保有目的の記載は、同グループのみなと銀行が当社の主要取引金融機関であり長期借入及び債務保証等の取引関係があるという金融機関との資金調達関係であるため結ばなかった。
- relatedCompanies: hokuhoku-financial-group（ほくほくフィナンシャルグループ）: 特定投資株式として保有するが、保有目的の記載は、同グループの北陸銀行が当社の主要取引金融機関であり長期借入及び債務保証等の取引関係があるという金融機関との資金調達関係であるため結ばなかった。
- relatedCompanies: the-bank-of-toyama（富山銀行）: 社債の相手先として印字される金融機関であり、資金調達関係であるため結ばなかった。
- relatedCompanies: itochu-shokuhin（伊藤忠食品）: コードリストに無く、売掛金の相手先別内訳に載るだけであるため結ばなかった。
- relatedCompanies: japan-securities-finance（日本証券金融）: 大株主の状況に10.96％の株主として載るが、証券金融会社であり純投資の位置づけであるため結ばなかった。
- relatedCompanies: taya（田谷）: ambiguous で、印字は個人株主の住所等の文脈であり、株式会社田谷とは確認できないため結ばなかった。
- relatedCompanies: zero（ゼロ）: ambiguous で、印字は「残存価額をゼロとする」等の会計方針の文脈であり、株式会社ゼロではないため結ばなかった。
- relatedCompanies: united-super-markets-holdings（ユナイテッド・スーパーマーケット・ホールディングス）: 特定投資株式として保有するが、保有目的の記載が「当社製品の販売先としての取引関係があったため」と過去形であり、併せて保有の合理性を検証し保有の是非を検討する旨が印字されていて、現在の取引関係を確認できないため結ばなかった。
- relatedCompanies: 候補に無いため結ばなかった相手: 株式会社ゴーゴーカレーグループは主要株主（16.04％）であり、レトルトカレーの販売等の取引関係が事業の内容に印字されているが、非上場で候補に無いため結ばなかった。LEOMO.Inc.は主要株主（16.80％）で、前事業年度に当社の第三者割当増資を引き受けた相手であるが、候補に無いため結ばなかった。国分グループ株式会社は売掛金の相手先に載るが、候補に無いため結ばなかった。譲渡した連結子会社サハキット・ウィサーン社は当社グループを離れた会社であり、関連企業としては結ばなかった。
- terms: 助言: 用語「スパゲッチ」は、当社が有報の事業の内容で用いるスパゲッティの表記で、食品事業の主力製品を指す当社独自の呼称です。
- terms: 助言: 用語「黄麻（ジュート）」は、産業資材事業で取り扱う麻袋やカーペット裏地等の原料となる繊維で、当社の創業以来の事業分野を表す用語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
