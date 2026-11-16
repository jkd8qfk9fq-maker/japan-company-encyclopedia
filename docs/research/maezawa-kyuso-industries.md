# 前澤給装工業 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 前澤給装工業株式会社 |
| 証券コード | 6485 |
| docID（データを取り出した文書） | `S100YIVJ` |
| 原本 docID | `S100YIVJ` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIVJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 前澤給装工業株式会社 / 6485 / docID S100YIVJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
maezawa-kyuso-industries: 10 件の数値を有報XBRLと照合
有報: 前澤給装工業株式会社 有価証券報告書－第70期(2025/04/01－2026/03/31) (docID S100YIVJ)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":28789000000,"latestFiling":25140000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":31008000000,"latestFiling":26999000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":32008000000,"latestFiling":31411000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":31957000000,"latestFiling":31644000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":2287000000,"latestFiling":2175000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":2267000000,"latestFiling":2138000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":2598000000,"latestFiling":2642000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":3184000000,"latestFiling":3338000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":45619000000,"latestFiling":44270000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":44643000000,"latestFiling":43107000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":45965000000,"latestFiling":45015000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":45998000000,"latestFiling":45150000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":37630000000,"latestFiling":36946000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":38225000000,"latestFiling":37502000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":39039000000,"latestFiling":38399000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":39754000000,"latestFiling":39001000000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":490,"latestFiling":373},{"key":"NumberOfEmployees|2023-03-31","previousFiling":507,"latestFiling":378},{"key":"NumberOfEmployees|2024-03-31","previousFiling":483,"latestFiling":426},{"key":"NumberOfEmployees|2025-03-31","previousFiling":435,"latestFiling":432}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
maezawa-kyuso-industries: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、有報のセグメント情報・販売実績・経営指標が百万円単位で印字されているため、その印字のまま記載した。経営成績の分析で億単位の印字がある箇所は、セグメント情報の百万円の値で統一した。
- businessModel: 2024年3月期の従業員数についての第二の注記: 経営指標の注記に、第68期（2024年3月期）の従業員数が第67期と比べて48名増加した主な理由は、2023年4月1日付で前澤リビング・ソリューションズ株式会社を吸収合併したことによるものであると印字されている。financialNotes は各期1件のみ反映されるため、2024年3月期の注記には連結から単体への表示替えを優先し、この事実はここに全文を記録する。
- businessModel: 中期経営計画2029の数値目標（2029年度に売上高335億円、売上高営業利益率11.5％以上、ROE7.0％以上など）は、投資指標を含む目標であるため本文・戦略には書かず、ここに記録する。目標のうち利益の金額そのものにも触れていない。
- businessModel: セグメント利益の金額と増減率、生産実績・商品仕入実績の金額は、本文に書かない規則のため記載していない（経営成績の分析とセグメント情報に印字がある）。受注実績は見込み生産のため該当事項なしと印字されている。
- businessModel: この作業ツリーのスキーマには suppliers のキーがないため、businessModel に suppliers は書いていない。仕入先の事実は次のとおりである: 特定投資株式の保有目的に、前澤工業株式会社と前澤化成工業株式会社が「給水装置事業に関連する商品の主要な仕入先」であると印字されている。
- businessModel: 2026年3月期の当期純利益は、完全子会社であったQSOインダストリアル株式会社の吸収合併に伴う差益の計上等により、前連結会計年度の数字との参考比較で12.8％増加したと経営成績の分析に印字されている。
- businessModel: 当事業年度に自己株式の取得による支出があったことが財務活動によるキャッシュ・フローの説明と純資産の変動理由に印字されている（期中の資本政策であり、後発事象ではない）。重要な後発事象は該当事項なしと印字されている。
- businessModel: 主要な顧客である渡辺パイプ株式会社への販売実績の割合（11.0％）は経営成績の分析とセグメント情報に印字されているが、金額は本文に書かない規則のため、割合のみを関連企業の記録ではなくここに残し、本文では社名のみに触れた。なお同社は非上場で関連企業候補にも含まれていない。
- businessModel: Wikipediaの記事「前澤給装工業」は証券コード6485の印字で同一性を確認できたが、冒頭の記述は有報の記載の範囲内にとどまるため、補足には使わなかった。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順（給水装置事業16,860百万円、住宅・建築設備事業12,143百万円、商品販売事業2,679百万円）とした。セグメント間の内部売上高は印字されておらず、外部売上高の合計31,683百万円は売上高と一致する。
- businessStructure: 関係会社の状況は「該当事項はありません」と印字されている。2025年4月1日付で完全子会社のQSOインダストリアル株式会社を吸収合併したため当事業年度末に連結子会社はなく、この体制を現在の事業構造とした。
- businessStructure: 従業員の状況では、給水装置事業・住宅・建築設備事業・商品販売事業を合わせた従業員数が369人、全社（共通）が57人、合計426人と印字されている。主要な設備では福島工場に151人、本社に35人、東京支店等26拠点に234人、福島物流センター等4拠点に6人が配置されている。
- history: 沿革の設立行には資本金の金額が印字されているが、沿革に資本金の金額を書かない規則のため金額は記載していない。
- history: 2023年と2025年はそれぞれ2件の出来事があるため、年ごとに2行に分けて記載した。
- industry: 主たる事業は水道用給水装置の製造・販売（給水装置事業16,860百万円）であるため、主区分は machinery とした。
- industry: 住宅・建築設備事業は配管部材等の製造・販売であり、商品販売事業も両事業に関連する仕入商品の販売であるため、いずれも machinery の範囲で捉え、他の区分は付けなかった。
- industry: 水道用給水装置という水インフラ向け機器に合う閉じた分類の値がないため、taxonomyGaps に専用分類の新設を提案した。
- relatedCompanies: 前澤工業株式会社（maezawa-industries、証券コード6489）は、特定投資株式の保有目的に「創業者を同一とする企業であり経営における情報交流を行うなどの友好関係を保持するほか、給水装置事業に関連する商品の主要な仕入先であり、取引関係の維持・強化のために保有」と個別に印字され、大株主の状況でも当社の株式を1,248千株（6.13％）保有する相互保有の関係にあるが、related-candidates.json で listing が「（コードリストにない）」とされているため結ばなかった。事実はここに全文を記録する。同社は当社の株式を保有しており、当社も同社株式1,198,438株を保有している。
- relatedCompanies: 前澤化成工業株式会社（maezawa-kasei-industries、証券コード7925）は、特定投資株式の保有目的に前澤工業と同文の「創業者を同一とする企業であり経営における情報交流を行うなどの友好関係を保持するほか、給水装置事業に関連する商品の主要な仕入先であり、取引関係の維持・強化のために保有」と個別に印字され、大株主の状況でも当社の株式を1,248千株（6.13％）保有する相互保有の関係にあるが、related-candidates.json で listing が「（コードリストにない）」とされているため結ばなかった。事実はここに全文を記録する。当社は同社株式842,400株を保有している。
- relatedCompanies: SANEI株式会社（sanei、証券コード6230）は、特定投資株式として2,633株を保有し、保有目的に「住宅・建築設備事業の顧客であり、取引関係の維持・強化のために保有」と個別に印字されているが、related-candidates.json に含まれていないため結ばなかった。事実はここに記録する。
- relatedCompanies: 当事業年度に株式数がゼロになるまで売却した銘柄は結ばなかった: 株式会社りそなホールディングス（金融取引の主要取引先）、橋本総業ホールディングス株式会社（給水装置事業・住宅・建築設備事業の顧客）、第一生命ホールディングス株式会社（年金資産運用の主要取引先）、株式会社三井住友フィナンシャルグループ（金融取引の主要取引先）、クリエイト株式会社（給水装置事業・住宅・建築設備事業の顧客）、東京瓦斯株式会社・東邦瓦斯株式会社・大阪瓦斯株式会社（いずれも住宅・建築設備事業の顧客）。いずれも「保有継続について総合的に検証した結果、売却いたしました」と印字されている。
- relatedCompanies: 日本電技株式会社と荏原実業株式会社については、保有株式数の増加理由として「株式分割により株式数が増加しております」と印字されている。これは保有先の会社の株式分割であり、当社の株式分割ではないため、要確認事項にはしていない。
- relatedCompanies: 候補の vision（「新水道ビジョン」の語）、career（「自己キャリア形成」の語）、land（「ブランド」の語の一部）、seki（「セキュリティ」の語、ambiguous）、arata（「あらたな」の語）、base-4481（「営業利益ベース」の語）、port（一般語の一部）、trust（大株主の常任代理人である日本マスタートラスト信託銀行の表記で、コードリストにもない）、zero・en（いずれも一般語の部分一致で ambiguous）などは、いずれも会社名そのものではなく一般語・部分文字列の一致であるため結ばなかった。
- relatedCompanies: 主要な顧客である渡辺パイプ株式会社は非上場で候補に含まれていないため結ばなかった（セグメント情報の主要な顧客ごとの情報に開示されている事実は businessModel に記録した）。
- relatedCompanies: 大株主の日本マスタートラスト信託銀行（信託口）、THE HONGKONG AND SHANGHAI BANKING CORPORATION LIMITED の私募口座、STATE STREET BANK AND TRUST COMPANY などは信託口・常任代理人経由の保有であり、取引関係の印字がないため結ばなかった。株式会社阿部製作所と株式会社藤田製作所は大株主に名があるが非上場で候補になく、取引関係の印字も特定投資株式にはないため結ばなかった。
- terms: 用語の助言: 「サドル付分水栓」（配水管に取り付けて上水道を引き込むための給水装置）、「止水栓」（引き込み部で水道を開閉する装置）、「架橋ポリエチレン管」（住宅・建築設備事業で使う樹脂管で、福島工場で製造している）、「QSO」（当社の会社指針で、Quality, Safety & Originality の略。『品質は人格であり、安全は協調であり、独創は、改革である』と説明されている）、「給水装置」（配水管から家屋等の敷地内に上水道を引き込むための装置の総称）は、この会社を説明する固有の用語候補として助言する。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 前澤給装工業の給水装置事業（水道用給水装置の製造・販売） → 提案: 給水装置・水道用機器（水インフラ機器）。配水管から敷地内へ上水道を引き込む給水装置（サドル付分水栓・止水栓・継手類）という水インフラ専用の機器を製造・販売する事業に合う区分が閉じた分類にありません。機器の製造であるため最も近い machinery を主分類としましたが、水インフラ機器専用の分類があると正確です。
