# GreenBee — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＧｒｅｅｎＢｅｅ株式会社 |
| 証券コード | 3913 |
| docID（データを取り出した文書） | `S100XT1W` |
| 原本 docID | `S100XT1W` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT1W.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＧｒｅｅｎＢｅｅ株式会社 / 3913 / docID S100XT1W（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
greenbee: 10 件の数値を有報XBRLと照合
有報: ＧｒｅｅｎＢｅｅ株式会社 有価証券報告書－第19期(2025/01/01－2025/12/31) (docID S100XT1W)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
greenbee: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「GreenBee 株式会社」が EDINET の提出者名「ＧｒｅｅｎＢｅｅ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 指標注記２（収益認識基準の第16期期首適用）と注記３（2022年改正税基準の第19期期首適用・第18期指標の遡及適用）の２件を financialNotes にした。ブートストラップ照合では前期有報との差異は全系列ゼロで、遡及適用後の第18期指標は前期有報の印字と一致している。注記１（潜在株式調整後１株当たり当期純利益の不記載）は表示事項のため warnings のみとした。
- businessModel: 経営方針の「目標とする経営指標」（営業利益）は利益・投資指標の目標のため、本文と perspectives には書かず、戦略は定性的に書いた。MD&Aの段階利益の金額と増減理由、翌期の利益予想、受注高・受注残高、キャッシュ・フローの金額、研究開発費の金額は書いていない。
- businessModel: 後発事象のうち、GreenBee Energy株式会社の設立資金に係る株式会社千葉銀行からの借入は資金調達であり、自己株式の取得（Kiwi Technology Inc.との資本業務提携の解消に伴うキーウィテクノロジー株式会社保有株式の取得を含む）は資本政策であるため、いずれも warnings のみとした。Kiwi Technology Inc.との資本業務提携契約は2026年２月20日に終了している（【重要な契約等】の注記）。
- businessModel: 特定投資株式及びみなし保有株式は「該当事項はありません」。純投資目的以外の投資株式は非上場株式１銘柄のみで、個別名の印字はない。
- businessStructure: 当社グループはソフトウェア事業の単一セグメントであり、セグメント情報の記載は省略されている。children はMD&Aの販売実績（事業領域別）の区分を用い、販売高の大きい順に並べた。事業領域別の販売高（千円）はテクノロジーライセンス事業593,016、DXサービス事業347,868、GXサービス事業21,057で、合計は961,941千円となり、印字の合計961,943千円と２千円異なる（有報の印字どおり記載し、切り捨て後の百万円では合計と一致する）。セグメント利益は書いていない。
- businessStructure: このツリーの旧スキーマに従い suppliers キーは省略した。【事業の内容】に個別の仕入先名の印字はない。
- businessStructure: 設備は本社・タオソフトウエア㈱・GreenBee Technology (Shanghai) Inc.のいずれもセグメント欄が「ソフトウェア事業」のため単一セグメントの事業に結びつけた。帳簿価額は書いていない。
- businessStructure: グループ構成は2025年12月31日現在で、当社と連結子会社２社（GreenBee Technology (Shanghai) Inc.、タオソフトウエア㈱、いずれも議決権100％・特定子会社）である。
- history: 年月は年だけを記録し、月は書いていない。資本金の金額（設立時の資本金、2022年12月の無償減資など）は沿革に書いていない。
- history: 省いた項目: 本社移転（2007年・2010年・2015年・2017年）、台湾VideAce Technologyの設立と全株式売却（2007年・2009年）、Rolltech Technologyの子会社化と売却（2009年・2010年）、成都支店の開設と閉鎖（2011年・2014年）、sMedio Americaの設立と閉鎖（2011年・2024年）、Syncable事業の取得（2012年）、台北支店の開設と閉鎖（2013年・2018年）、株式会社情報スペースの子会社化と清算（2015年・2021年）、株式会社ブイログの設立と吸収合併（2015年・2017年）、株式会社ミックステクノロジーズの子会社化と吸収合併（2017年・2018年）、2022年４月の市場区分見直しに伴うグロース市場への移行、Kiwi Technology, Inc.との資本業務提携と第三者割当（2022年。同提携は2026年２月に終了）、上海子会社の現社名への変更（2024年）。
- history: Wikipedia「GreenBee」の冒頭は旧社名と本社所在地を述べるのみで、いずれも有報に印字されているため、補足には使わなかった。
- industry: 主たる業界は it とした。単一セグメントであるソフトウェア事業が直接当てはまる。
- industry: energy は付けなかった。GXサービス事業は単一セグメント内の事業領域であり報告セグメントではなく、2025年12月期の販売高は21百万円にとどまる。
- industry: entertainment は付けなかった。コンテンツ再生ソフトウェアのライセンスはソフトウェア事業の一部であり、コンテンツ事業そのものではない。
- industry: DEIの別記事業は cte である。
- relatedCompanies: fujitsu: 印字されているのは富士通クライアントコンピューティング株式会社であり、富士通株式会社とは別の法人であるため結ばなかった。
- relatedCompanies: ntt: 印字されているのは株式会社NTTドコモであり、NTT株式会社とは別の法人であるため結ばなかった。
- relatedCompanies: como: NTTドコモの表記の部分一致のみ（ambiguous）で、株式会社コモとの関係の印字はないため結ばなかった。
- relatedCompanies: the-chiba-bank: 後発事象の借入先（資金調達）として印字されているのみであり、資金調達を理由には結ばなかった。
- relatedCompanies: dts: 【重要な契約等】に印字されているのは米国のDTS Corporationであり、株式会社DTSとは別の法人であるため結ばなかった。
- relatedCompanies: space: 沿革に印字されているのは株式会社情報スペース（かつての子会社）であり、株式会社スペースとは別の法人であるため結ばなかった。
- relatedCompanies: technologies: 沿革に印字されているのは株式会社ミックステクノロジーズ（かつての子会社）であり、株式会社テクノロジーズとは別の法人であるため結ばなかった。
- relatedCompanies: software-service: 経営方針の一般的な表現「テクノロジーソフトウェア・サービス開発」の部分一致のみで、株式会社ソフトウェア・サービスとの関係の印字はないため結ばなかった。
- relatedCompanies: port / en / ray / lec / vision / career / seki / zero: 部分文字列または一般語の一致のみ（レポート、エンドユーザー、ブルーレイ、フレックスタイム、長期ビジョン、通信キャリア、セキュリティ、機会をゼロに、など）で、関係の印字がないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 株式会社ストアフロント（2025年12月期の最大の販売先）、Microsoft Corp.（主要な顧客）、キーウィテクノロジー株式会社およびKiwi Technology Inc.（資本業務提携先だったが契約は2026年２月20日に終了）、Dynabook株式会社・株式会社デジオン（技術の使用許諾契約の相手先）。いずれも related-candidates.json にない。
- relatedCompanies: 自社の連結子会社２社（GreenBee Technology (Shanghai) Inc.、タオソフトウエア㈱）は結んでいない。
- terms: 「テクノロジーライセンス事業」「DXサービス事業」「GXサービス事業」は事業領域の名称として有報の表記どおりに用いた。「ソフトウェア事業」はセグメントの名称として有報の表記どおりに用いた。
- terms: 「tourbillon」「GreenBee Cloud Backup」「RiskFinder」「VAlution」「TrueBD」は製品・サービスの名称として有報に印字されている。
- terms: 「sMedio」は旧社名として有報の沿革に印字されている。

## 要確認（status に反映）

- businessModel: 2026年１月27日に完全子会社GreenBee Energy株式会社を設立し、同社は2026年２月１日に株式会社ウエストエネルギーソリューションと系統用蓄電設備の売買契約を締結しています（重要な後発事象に記載）。本登録は2025年12月31日現在のグループ構成（当社及び連結子会社２社）に基づいており、設立後の取扱いは人の確認が必要です。
- businessStructure: 2026年１月27日に完全子会社GreenBee Energy株式会社を設立し、同社は2026年２月１日に株式会社ウエストエネルギーソリューションと系統用蓄電設備の売買契約を締結しています（重要な後発事象に記載）。本登録は2025年12月31日現在のグループ構成（当社及び連結子会社２社）に基づいており、設立後の取扱いは人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
