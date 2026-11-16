# タウンズ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社タウンズ |
| 証券コード | 197A |
| docID（データを取り出した文書） | `S100Z3TC` |
| 原本 docID | `S100Z3TC` |
| 提出日（原本） | 2026-09-24 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3TC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社タウンズ / 197A / docID S100Z3TC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 26 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tauns-laboratories: 10 件の数値を有報XBRLと照合
有報: 株式会社タウンズ 有価証券報告書－第11期(2025/07/01－2026/06/30) (docID S100Z3TC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
tauns-laboratories: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の印字どおりとし、千円の印字は百万円未満を切り捨てて百万円単位で記載した（主要製品別売上高はMD&Aの百万円印字をそのまま使用）。
- businessModel: 当社は連結財務諸表を作成しておらず、本登録の数値はすべて提出会社単体のものである。
- businessModel: 2026年6月期には、富士山三島工場の新設に伴う国庫補助金4,363百万円が計上され、当期純利益の下支えとなった。また、関係会社株式の評価損391百万円も計上されている（いずれもMD&Aの印字どおり。本文の数値は売上高と当期純利益のみに限定した）。
- businessModel: 経営上の目標の指標として掲げられた営業利益率、EBITDA、ROE等の投資・収益性指標は、本文・戦略には記載せず本警告に記録する。
- businessModel: 研究開発費の総額は2026年6月期1,126,102千円と印字されている（本文の数値には含めていない）。
- businessModel: 非連結子会社1社及び持分法非適用関連会社4社を有しているが、重要性が乏しいとして社名の記載は省略されている。
- businessStructure: 当社は非連結子会社1社及び持分法非適用関連会社4社を有しているが、重要性が乏しいため社名の記載は省略されており、関係会社の状況にも個別の記載はない。
- businessStructure: 仕入・委託関係（本樹のスキーマにはsuppliersキーがないため本文には含めず、ここに記録する）：体外診断用医薬品等の製造、これに付随する保管、在庫管理、荷造り及び納入の業務について、DICプラスチック株式会社（2020年5月）及び株式会社シン・コーポレイション（2020年6月）と製造委託基本契約書を締結している。
- businessStructure: （株）スズケンとは医薬品、医療用具、診断薬等の医療用品の売買に関する取引基本契約書を2009年2月に締結している（1年間、以後自動更新）。
- history: 沿革は有報【沿革】の表の行を中心に構成した。合併・株式譲渡の金額や資本金の額は記載していない。
- history: 白金―金コロイド粒子の物質・製法特許は2024年2月をもって特許期間が満了している（沿革の注記どおり）。
- history: 2016年の再編の詳細（CITIC Capital Japan Partners Ⅲ, L.P.等による取得の経緯）は企業の概況の記載に基づく事実であり、資本参加したファンド自体は関連企業には含めていない。
- industry: EDINETの別記事業（個別）は「cte」（その他）だが、当社の事業は医薬品医療機器等法上の体外診断用医薬品（抗原検査キット等）の製造販売であり、閉じたリストの pharmaceuticals（医薬品）に該当するため、ギャップは記録しない。
- relatedCompanies: 候補dic（DIC株式会社、4631）：有報の重要な契約等の相手先はDICプラスチック株式会社であり、DIC株式会社とは別の法人であるためリンクしない。製造委託の事実はbusinessStructureの警告に記録した。
- relatedCompanies: 候補kobayashi-pharmaceutical（小林製薬株式会社、4967）：1991年設立当時の(株)ビーエルの取引先としての歴史的な言及のみで、現在の取引関係を示す印字がないためリンクしない。
- relatedCompanies: 候補kufu-company-holdings（4376）：2016年から2021年の組織再編の過程で株式の譲渡を受けた株主としての歴史的な言及のみで、現在の事業上の関係を示す印字がないためリンクしない。
- relatedCompanies: 候補aozora-bank（あおぞら銀行、8304）：借入金の貸付金融機関の一つとして印字されているのみで、融資関係のみのためリンクしない。
- relatedCompanies: 候補asahi-printing（朝日印刷、3951）：金額一覧の中の社名の印字のみで、取引・提携関係の記載がないためリンクしない。
- relatedCompanies: 候補daiwa（株式会社大和、8247、ambiguous）：印字は大和証券株式会社（株主の常任代理人）であり、株式会社大和ではないためリンクしない。
- relatedCompanies: 候補corona（株式会社コロナ、5909）：「新型コロナウイルス感染症」等の一般語の一致でありリンクしない。
- relatedCompanies: 候補en（4849、ambiguous）：「エンドユーザー」等の一般語の部分一致でありリンクしない。
- relatedCompanies: 候補innovation（3970）：「オープンイノベーション促進積立金」等の一般語の一致でありリンクしない。
- relatedCompanies: 候補seki（7857、ambiguous）：「情報セキュリティ」等の一般語の部分一致でありリンクしない。
- relatedCompanies: 候補core（2359、ambiguous）：「新たなコア技術」等の一般語の部分一致でありリンクしない。
- relatedCompanies: 候補slogan（9253）：「コーポレートスローガン」の一般語の一致でありリンクしない。
- relatedCompanies: 候補rix（7525）：「スキルマトリックス」等の一般語の部分一致でありリンクしない。
- relatedCompanies: 候補care-service（2425）：「ヘルスケアサービス」の一般語の一致でありリンクしない。
- relatedCompanies: 候補cover（5253）：テストプレートの「カバー」の一般語の一致でありリンクしない。
- relatedCompanies: 候補ray（4317、ambiguous）：「テストプレート」等の一般語の部分一致でありリンクしない。
- relatedCompanies: 候補trust（3347）：EDINETコードリストにない候補であり、本文の一致も一般語の部分一致のためリンクしない。
- relatedCompanies: 候補vision（9416）：「ビジョン」の一般語の一致でありリンクしない。
- relatedCompanies: 候補zero（9028、ambiguous）：「法令違反ゼロ」の一般語の一致でありリンクしない。
- relatedCompanies: 候補career（6198）：「キャリアプラン」の一般語の一致でありリンクしない。
- relatedCompanies: 候補karula（2789）：「タウンズクリニカルラボ」の部分一致でありリンクしない。
- relatedCompanies: 候補linical（2183）：「タウンズクリニカルラボ」の部分一致でありリンクしない。
- relatedCompanies: 候補nissin（9066、ambiguous）：EDINETコードリストにない候補であり、本文の一致も一般語の部分一致のためリンクしない。
- relatedCompanies: 候補rhythm（7769）：「アルゴリズム」の部分一致でありリンクしない。
- relatedCompanies: 候補will（3241）：「新型コロナウィルス」の部分一致でありリンクしない。
- relatedCompanies: 大株主のCITIC CAPITAL JAPAN PARTNERS Ⅲ, L.P.（39.09％）等のファンド及び信託口は、掲載企業ではないため関連企業には含めていない。
- terms: 用語候補（助言のみ）：イムノクロマト法（検体中の標的抗原と標識抗体の反応を利用し、判定ラインの発色を目視で確認する検査法）、POCT（臨床現場即時検査。患者のそばで迅速に実施できる検査）、白金―金コロイド／ブラックライン（当社独自の標識粒子と、それによる黒色の判定ライン表示）、体外診断用医薬品（検体中の物質を検出・測定して疾病の診断を補助する検査薬）、SaMD（医療機器プログラム）、D-IA（デジタルイムノアッセイ）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
