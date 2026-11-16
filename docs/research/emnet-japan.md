# イーエムネットジャパン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社イーエムネットジャパン |
| 証券コード | 7036 |
| docID（データを取り出した文書） | `S100Y5DB` |
| 原本 docID | `S100XVWO` |
| 提出日（原本） | 2026-03-31 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100Y5DB, S100XVXB, S100XVX3／有効文書 S100Y5DB（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5DB.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社イーエムネットジャパン / 7036 / docID S100XVWO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 7 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
emnet-japan: 10 件の数値を有報XBRLと照合
有報: 株式会社イーエムネットジャパン 訂正有価証券報告書－第13期(2025/01/01－2025/12/31) (docID S100Y5DB)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:OperatingRevenue1SummaryOfBusinessResults|2023-12-31","previousFiling":1369551000,"latestFiling":1370104000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":73191000,"latestFiling":65788000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":69753000,"latestFiling":12592000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-12-31","previousFiling":120158000,"latestFiling":120711000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":3013606000,"latestFiling":3006258000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":2705762000,"latestFiling":2641199000},{"key":"NetAssetsSummaryOfBusinessResults|2023-12-31","previousFiling":1451788000,"latestFiling":1444385000},{"key":"NetAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":1406346000,"latestFiling":1341783000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（売上高 / －－－－営業収益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 訂正有価証券報告書（訂正有価証券報告書－第13期(2025/01/01－2025/12/31)、docID S100Y5DB）を有効文書としてこのパックを作った。原本は docID S100XVWO。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのは表紙の項目だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 訂正有価証券報告書－第12期(2024/01/01－2024/12/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第11期(2023/01/01－2023/12/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
emnet-japan: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの下書き（draft-entry）が2022〜2025年12月期の収益を null としていたため、主要な経営指標等の推移表に印字された営業収益の行（2022年12月期1,466,689千円、2023年12月期1,370,104千円、2024年12月期1,329,624千円、2025年12月期1,594,782千円）に合わせ、該当4行の revenue と revenueLabel（－－－－営業収益）のみを訂正した。パイプラインのコードは変更していない。差分は当該8項目のみであることを検証済み。
- businessModel: 主要な経営指標等の注記により、第11期より収益の表示科目を「売上高」から「営業収益」に変更し、第10期の「売上高」は「営業収益」に組み替えて表示している。2021年12月期の売上高（10,672百万円）と2022年12月期以降の営業収益は表示科目が異なる。表示方法の変更であるため financialNotes には記録せず、ここに残した。
- businessModel: 当事業年度に、元取締役常務執行役員CFOによる会社資金の私的流用が判明し、第三者委員会による調査が行われた。第11期・第12期の数値は誤謬の訂正による遡及処理後の印字値で登録し、経緯は financialNotes（2023年12月期・2024年12月期）に記録した。当期純損失の要因は特別損失に当たる項目を含むため本文には書かず、純損失額のみを記載した。
- businessModel: 第13期の有価証券報告書には訂正報告書（S100Y5DB、2026年５月20日提出）があるが、訂正は表紙の記載事項に関するもので、主要な経営指標等を含む数値および本文に変更はないことを証拠パックの原報告書との比較で確認した。情報源は訂正報告書に置いた。
- businessModel: 決算日後の重要な後発事象として、元取締役の退職慰労金に備えて積み立てていた生命保険契約の解約が開示されており、2026年12月期に解約益を計上する予定とされている。事業構造の変更ではないため needsReview にはせず、ここに記録した。
- businessStructure: 単一セグメント（インターネット広告事業）のため事業は1つとし、【事業の内容】に列挙されたサービス区分（運用型広告／クリエイティブ制作／インハウス支援サービス／受託業務サービス）を children とした。製品及びサービスごとの情報は、単一の製品・サービスの区分の外部顧客への営業収益が営業収益の90%を超えるため開示が省略されており、children に金額は付けていない。
- businessStructure: このツリーは旧スキーマのため suppliers キーは使わず、仕入関係をここに記録する。広告媒体の主な仕入先はグーグル合同会社、Facebook Japan合同会社、LINEヤフー株式会社などである（仕入債務の明細に記載）。関連当事者情報では、LINEヤフー株式会社が「仕入先」と明記されている。
- businessStructure: 主要な設備は東京都新宿区の本社のみ（従業員130名）であり、特定の子事業への紐付けはしていない。設備の帳簿価額は記載していない。
- businessStructure: 親会社はソフトバンク株式会社（議決権の40.93%を直接保有）であり、主要な顧客でもある。関係会社の状況の詳細は relatedCompanies フラグメントとその警告に記録した。
- history: 沿革に印字された認定・資格類の行のうち、2015年のYahoo!認定パートナー登録、2016年のGoogle Partnerプレミアバッジ取得とYahoo!マーケティングソリューション パートナー認定、2017年の労働者派遣事業許可取得とGoogle・Yahoo!のパートナープログラム認定、2018年のYahoo!プロモーション広告「インプレッションベース」認定とMarketing Partner Program Sales Partner認定、2019年のTRANSCOSMOS (MALAYSIA) SDN. BHD.との業務委託基本契約、2021年のYahoo!マーケティングソリューション セールスパートナー４つ星認定と日本経済団体連合会への入会は、転機に絞るため沿革項目から外し、ここに記録した。
- history: 沿革のテキスト抽出では2017年10月と2018年8月の2行が1行に結合していた（日付2件に対し事象2件）。行の順序どおり、2017年10月をGoogle Marketing Partner Program Sales Partner（Basic）認定、2018年8月を同（Bronze）認定と対応付けた。いずれも認定類のため沿革項目には含めていない。
- history: 設立時の資本金199,900千円は沿革に印字されているが、資本金額は沿革に記載しないため項目には含めていない。
- history: 2021年10月1日の株式分割（1株を2株）は沿革表には載っておらず、主要な経営指標等の注記に記載されている。businessModel フラグメントの needsReview に記録した。
- industry: 主たる業界は media とした。インターネット広告の代理店事業が営業収益の全てを占め、閉じた分類に広告を表す値がないため、広告を含むメディア産業として最も近い media を暫定値とした。分類の不足は taxonomyGaps に記録した。
- relatedCompanies: ソフトバンク株式会社: 直接の親会社（議決権の40.93%を直接保有）であり、2025年12月期の営業収益の22.48%を占める主要な顧客でもあるが、related-candidates に含まれていなかったため結ばなかった。候補リスト側の不足であり、親会社を代用していない。
- relatedCompanies: EMNET INC.: 関係会社の状況で「その他の関係会社」（議決権の20.43%を直接保有、韓国のコスダック上場のインターネット広告会社）と印字されているが、外国法人で候補に含まれていないため結ばなかった。2013年の設立時の親会社であり、販売管理・社内情報共有システムの提供を受けている。
- relatedCompanies: ソフトバンクグループジャパン株式会社: 関係会社の状況で間接保有の親会社と印字されているが、非上場で候補に含まれていないため結ばなかった。
- relatedCompanies: global-style（グローバルスタイル株式会社）: 特定投資株式として保有する唯一の上場銘柄だが、保有目的は「取引先との関係強化」という定型的な記載のみで、個別の取引関係は印字されていないため結ばなかった。
- relatedCompanies: ポケトーク株式会社: 重要な契約等に第三者割当増資の引受けとデジタル広告支援が印字されているが、非上場で候補に含まれていないため結ばなかった。
- relatedCompanies: グーグル合同会社・Facebook Japan合同会社: 広告媒体の仕入先として仕入債務の明細に印字されているが、候補に含まれていないため結ばなかった（仕入関係は businessStructure フラグメントの警告に記録）。
- relatedCompanies: aeon-financial-service・vision: 売掛金の相手先明細に印字されているのみで、関係を結ぶ根拠がないため結ばなかった。
- relatedCompanies: aeon-mall: 売掛金の相手先明細に印字されているのみで、候補の上場区分もコードリストにないため結ばなかった。
- relatedCompanies: cube・en・port・ray・corona・career・imura-and-co・seki・slogan: 一般語・部分文字列による一致であり、有報に当該候補との関係は印字されていないため結ばなかった。ray・en・seki は名称が紛らわしい候補でもある。
- relatedCompanies: nissin: コードリストにない候補であり、有報に当該候補との関係も印字されていないため結ばなかった。
- terms: 助言のみ。用語候補: 「運用型広告」（配信結果を見ながら運用を調整して出稿する広告の総称。当社の中核サービス）、「リスティング広告」（検索キーワードに連動して検索結果に表示される広告）、「インハウス支援」（広告主が自社内で広告運用を行う体制づくりを支援すること）、「専任制・分業制」（顧客ごとに専任の担当者を置く体制と、業務ごとに専門部署が担う体制を組み合わせた当社の運用体制）。

## 要確認（status に反映）

- businessModel: 2021年10月1日付で普通株式1株につき2株の割合で株式分割を行っています（主要な経営指標等の注記に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] イーエムネットジャパンの主たる業界 → 提案: advertising（広告）。インターネット広告の代理店事業が営業収益の全てを占めるが、閉じた分類に広告（広告代理店）を表す値がないため、広告を含むメディア産業として最も近い media を暫定とした。
