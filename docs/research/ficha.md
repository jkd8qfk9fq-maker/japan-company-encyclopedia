# フィーチャ — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | フィーチャ株式会社 |
| 証券コード | 4052 |
| docID（データを取り出した文書） | `S100Z1RU` |
| 原本 docID | `S100Z1RU` |
| 提出日（原本） | 2026-09-28 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z1RU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | フィーチャ株式会社 / 4052 / docID S100Z1RU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ficha: 10 件の数値を有報XBRLと照合
有報: フィーチャ株式会社 有価証券報告書－第21期(2025/07/01－2026/06/30) (docID S100Z1RU)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-06-30","previousFiling":26753000,"latestFiling":25905000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-06-30","previousFiling":-25496000,"latestFiling":-26841000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-06-30","previousFiling":-2956000,"latestFiling":-4493000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-06-30","previousFiling":-10772000,"latestFiling":-3866000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-06-30","previousFiling":599459000,"latestFiling":595683000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-06-30","previousFiling":591353000,"latestFiling":586171000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-06-30","previousFiling":768102000,"latestFiling":759868000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-06-30","previousFiling":720034000,"latestFiling":727682000},{"key":"NetAssetsSummaryOfBusinessResults|2022-06-30","previousFiling":568493000,"latestFiling":559727000},{"key":"NetAssetsSummaryOfBusinessResults|2023-06-30","previousFiling":548841000,"latestFiling":539204000},{"key":"NetAssetsSummaryOfBusinessResults|2024-06-30","previousFiling":729879000,"latestFiling":716720000},{"key":"NetAssetsSummaryOfBusinessResults|2025-06-30","previousFiling":689803000,"latestFiling":685117000},{"key":"NumberOfEmployees|2024-06-30","previousFiling":32,"latestFiling":31},{"key":"NumberOfEmployees|2025-06-30","previousFiling":31,"latestFiling":30}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
ficha: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 指標注記1〜6（配当を行っていないこと、潜在株式調整後指標・自己資本利益率・株価収益率を記載していない理由、従業員数の数え方、最高・最低株価の市場の名称の変遷）は表示事項であるため warnings のみの記録とした。注記7（第20期まで連結財務諸表を作成していたため、第20期までのキャッシュ・フロー等を指標表に記載していない旨）は非連結移行の表示上の帰結であり、移行の事実そのものは financialNotes に記録した。
- businessModel: 前期有報との修正再表示チェックで経常利益・総資産・純資産・従業員数に差異があるのは、前期有報の主要な経営指標等が連結ベース、当期の表が個別ベースであるためであり、有報は非連結決算への移行を明記している。売上高は重複する4年度すべてで一致し、純利益は前期有報の要素が連結のものであるため突合できる行がない。訂正ではないため、financialNotes の移行注記と warnings で記録し、needsReview には入れなかった。
- businessModel: フロー revenue の受託開発収入277百万円・ライセンス収入265百万円は、収益認識関係の注記に印字された千円額（277,978千円、265,892千円）を百万円に切り捨てたもので、切り捨て後の合計は印字の売上高543百万円と1百万円異なる。
- businessModel: 【重要な後発事象】の資本準備金の額の減少及び剰余金の処分（2026年8月28日の取締役会決議で、2026年9月29日開催予定の第21回定時株主総会への付議を決定。効力発生日は2026年11月2日の予定）は、繰越利益剰余金の欠損填補を目的とする資本政策の手続であり、純資産の額に変動はないと印字されているため、金額を書かず warnings のみの記録とした。
- businessModel: MD&Aの段階利益の金額・増減率、売上原価・販管費の金額、キャッシュ・フローの金額、研究開発費・設備投資の金額、前期の固定資産の減損の金額と理由の詳細は書いていない。経営方針に掲げる重要指標のうち利益・資本効率に関する指標と2027年6月期の予想値は、本文・戦略に書いていない。
- businessModel: 受託開発収入の減少は、大手自動車メーカーとの共同開発案件が中断となったことによるものと印字されている。相手先の社名は印字されていないため書いていない。
- businessStructure: 単一セグメントのため事業は1つとし、【事業の内容】に印字された2つのソリューション（Mobility Solutions、DX-AI Solutions）を children とした。各ソリューションの金額は開示されていない（製品及びサービスごとの情報も、単一の製品・サービスの区分が売上高の90％を超えるため記載が省略されている）。
- businessStructure: 収入形態別の金額（収益認識関係の注記に印字された受託開発収入277,978千円・ライセンス収入265,892千円）は事業区分の金額ではないため、事業の金額には使わなかった。
- businessStructure: 設備と事業の対応: 本社（東京都豊島区、2026年6月30日現在の従業員数32人）は単一セグメントのため当事業の設備として扱った。帳簿価額と年間賃借料は書いていない。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。【事業の内容】に個別の仕入先の社名は印字されておらず、一部の取引に商社が介在する旨のみが印字されている。
- businessStructure: 連結子会社であった北京飞澈科技有限公司は2026年6月5日付で清算が結了しており、期末時点で子会社はない。【関係会社の状況】は「該当事項はありません」と印字されている。
- history: 本社移転のうち2009年の埼玉県新座市への移転と2018年の東京都豊島区内での移転は独立した項目としなかった（2015年の移転は社名変更・事業分離と同時のため同じ項目に含めた）。
- history: 沿革表は年月と事象が一体で印字されており、行の対応づけの問題はない。資本金の金額は書いていない。
- industry: 主たる業界は it（IT・ソフトウェア）とした。画像認識ソフトウェアの開発とライセンス提供が事業の実体であるためである。
- industry: automotive は付けなかった。顧客の多くは自動車メーカーや自動車部品メーカーだが、当社はソフトウェアを開発する会社であり、自動車や部品の製造は行っていないためである。
- industry: ＤＥＩの別記事業は cte である。
- relatedCompanies: forcia: 有報の主要な顧客は「フォルシアクラリオン・エレクトロニクス株式会社」（未上場の自動車電装品メーカー）であり、候補のフォルシア株式会社（証券コード304A）とは別の法人であるため結ばなかった。同社への販売は2026年6月期の売上高の34.0％を占める。
- relatedCompanies: rion: 「クラリオン」の部分文字列での一致であり、リオン株式会社との関係は印字されていないため結ばなかった。
- relatedCompanies: en: 「エンジン」の部分文字列での一致で曖昧であり、結ばなかった。
- relatedCompanies: freee: 「リスクフリーレート」の部分文字列での一致であり、結ばなかった。
- relatedCompanies: nissin: 現在のコードリストにない相手であり、一致箇所も社名を示すものではないため結ばなかった。
- relatedCompanies: port: 「サポート」等の部分文字列での一致であり、結ばなかった。
- relatedCompanies: rhythm: 「アルゴリズム」の部分文字列での一致であり、結ばなかった。
- relatedCompanies: otsuka: 【主な資産及び負債の内容】の未払金の相手先として印字されているのみで、取引関係の記述がないため結ばなかった。
- relatedCompanies: uchida-yoko: 【主な資産及び負債の内容】の売掛金の相手先として印字されているのみで、取引関係の記述がないため結ばなかった。
- relatedCompanies: seki: 部分文字列での一致で曖昧であり、結ばなかった。
- relatedCompanies: vision: 「コンピュータビジョン」の一般語での一致であり、結ばなかった。
- relatedCompanies: zero: 一般語での一致で曖昧であり、結ばなかった。
- relatedCompanies: 候補外の記録: ボッシュ株式会社は資本業務提携先（契約締結日2023年6月2日）であり、2026年6月30日現在で当社株式の10.05％を保有する株主で、売上高の35.7％を占める最大の顧客でもあるが、未上場で候補にないため結ばなかった。HUIZHOU DESAY SV AUTOMOTIVE CO.,LTD.は同日現在で9.03％を保有する株主だが、候補にないため結ばなかった。【株式の保有状況】は「該当事項はありません」と印字されており、政策保有株式はない。
- terms: 助言のみ。用語候補: 画像認識ソフトウェア、コンピュータビジョン、機械学習、ADAS（先進運転支援システム）、DMS（ドライバー監視システム）、OMS（乗員モニタリングシステム）、Tier 1、組み込みソフトウェア、AI-OCR、Drawing-AI、生成AI、LLM（大規模言語モデル）、Mobility Solutions、DX-AI Solutions、ライセンス収入、受託開発収入。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
