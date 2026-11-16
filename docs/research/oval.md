# オーバル — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オーバル |
| 証券コード | 7727 |
| docID（データを取り出した文書） | `S100YDYH` |
| 原本 docID | `S100YDYH` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDYH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オーバル / 7727 / docID S100YDYH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
oval: 10 件の数値を有報XBRLと照合
有報: 株式会社オーバル 有価証券報告書－第104期(2025/04/01－2026/03/31) (docID S100YDYH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
oval: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記は、潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していない旨の1点のみで、表示上の事項のためfinancialNotesには付けていない。
- businessModel: 有報本文に財務諸表の組替えに関する記載がある旨の証拠パックの注意については、前期有報との修正再表示チェックが全6系列・8行で差異なしであり、主要な経営指標等の数値に影響する注記は印字されていないため、financialNotesには付けず、ここに記録する。
- businessModel: 経営方針およびMD&Aに印字された中長期の数値目標（2032年3月期の売上高200億円等の計画値、ROE10.0％目標）は投資指標の目標であるため、戦略の文章には転記せず、存在のみをここに記録する。利益率の数値も転記していない。
- businessModel: MD&Aの利益項目の金額とその理由は本文に書いていない。部門別の販売実績はMD&Aの販売実績（外部顧客への販売）の印字を用いた。受注高・受注残高の金額は本文に書いていない。
- businessModel: 重要な後発事象および継続企業の前提に関する記載は印字されていない。東京計器株式会社との業務・資本提携は重要な契約等に印字されており、relatedCompaniesに記録した。
- businessStructure: 当企業グループは計測機器等の製造・販売事業の単一セグメントであるため、事業は1つとし、事業部門（センサ部門、システム部門、サービス部門）を子事業とした。部門別の金額はセグメント情報ではなくMD&Aの販売実績の印字（千円）を百万円に切捨てたもので、切捨て後の合計（10,427＋1,985＋3,175＝15,587百万円）は連結売上高15,589百万円と2百万円の切捨て差異がある。地域別の内訳も同様に切捨て差異を含む（欧州589百万円、中近東19百万円、その他の地域143百万円を本文では「その他の地域162百万円」として合算した）。
- businessStructure: suppliersキーは旧スキーマのため省略した。個別の仕入先の印字はない。
- businessStructure: グループ構成は、当社、連結子会社12社（オーバルアシスタンス、山梨オーバル、宮崎オーバル、京浜計測、OVAL ASIA PACIFIC、OVAL TAIWAN、HEFEI OVAL INSTRUMENT、HEFEI OVAL AUTOMATION CONTROL SYSTEM、OVAL ENGINEERING INC.、OVAL ENGINEERING SDN. BHD.、OVAL Corporation of Americaほか）、持分法適用非連結子会社1社、持分法適用関連会社2社（山陽機器検定、OVAL THAILAND）である。
- history: 沿革のうち次は採らなかった：1951年・1992年の本社移転/新社屋、1957年の横浜工場新設、1982年の横浜工場移転、1993年の台湾合弁会社設立、1996年・1998年・2005年・2010年の中国合弁会社の設立、1999年のオーバルテクノへの合併・社名変更、2002年のオランダ子会社設立と2015年の同社清算、2004年の韓国子会社設立、2005年のオーバルテクノ吸収合併、2009年の宮崎オーバル設立と2018年の完全子会社化、2015年の上海子会社の持分売却、2016年の監査等委員会設置会社への移行、2018年の中国子会社同士の吸収合併。資本金の金額は沿革に書いていない（1985年の資本提携は割当株数・資本金の金額を落として記載した）。
- history: Wikipediaは会社名で検索したが見つからなかったため使用していない。
- industry: 主たる業界は、流量計・受信器・分析計・流体制御装置といった工業用計測機器の製造・販売が事業の中心であるため、machineryを直接の当てはめとして付けた。単一セグメントで、検定・メンテナンスのサービス部門も同一事業の一部であるため副次的な業界は付けていない。在ツリーのtaxonomy-gaps.tsvにovalの行はない。
- relatedCompanies: tokyo-keiki（東京計器、7721）: 【重要な契約等】に業務・資本提携契約の締結が印字されているため結んだ。大株主の状況にも同社名がある（議決権割合は本文の説明には書いていない）。
- relatedCompanies: yokogawa-electric（横河電機、6841）: 大株主の状況に名前があるのみで、取引・提携の印字はないため結ばなかった。
- relatedCompanies: kyowa-electronic-instruments（共和電業、6853）: 特定投資株式の保有目的の印字のみで、個別の取引関係の印字はないため結ばなかった。
- relatedCompanies: nakakita-seisakusho（中北製作所、6496）・marubun（丸文、7537・ambiguous指定）: 特定投資株式の保有目的（円滑な取引関係の維持等）の印字のみのため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group（8306）・sumitomo-mitsui-financial-group（8316）・yokohama-financial-group（7186）: 特定投資株式の保有目的（主要取引金融機関との関係）の印字のみのため結ばなかった。
- relatedCompanies: dmg-mori（DMG森精機、6141）: 設備の状況に同社製の工作機械の記載があるのみで、取引関係の印字はないため結ばなかった。
- relatedCompanies: port（7047）・no-1（3562）・vision（9416）・base-4481（4481）・en（4849・ambiguous指定）・innovation（3970）・career（6198）・seki（7857・ambiguous指定）・ricoh（7752）: 「製品ポートフォリオ」「アジアNo.1」「経営ビジョン」「ベースづくり」「エンジニアリング」「イノベーション」「キャリア形成」「情報セキュリティ」「リコール」などの一般語・部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: trust（トラスト、3347）: 日本マスタートラスト信託銀行の信託代理人の記載との一致であり、コードリストにもないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: Anton Paar GmbH（センサ部門の売上高にライセンス契約の契約一時金が含まれる旨がMD&Aに印字されている相手方。外国法人で関連候補にない）。日本エマソン株式会社（1985年に資本提携し2002年に解消した相手方。現在の関係の印字はない）。
- relatedCompanies: 連結子会社12社、持分法適用非連結子会社1社、持分法適用関連会社2社は自社グループ会社のため対象外とした。売上高の10％以上を占める主要な顧客はない旨がセグメント情報の関連情報に印字されている。
- terms: 助言: 用語「流量計の検定」は、計量の正確さを確認する検定業務のことで、同社のサービス部門の中核業務の一つです。本文では有報の表記のまま記載しました。
- terms: 助言: 用語「クランプオン形超音波流量計」は、配管の外側から超音波で流量を測る流量計で、既存の配管に追加工事を行わず設置できる点が特徴です。経営方針の課題の記載に出てきます。
- terms: 助言: 用語「OVAL H2 Lab」は、水素実ガスを用いて水素計測用の流量計の校正を行う同社の設備で、2026年2月に開設されました。
- terms: 助言: 用語「センシング・ソリューション」は、同社の中長期経営ビジョンで使われる表現で、計測機器（センサ）の提供にとどまらず計装システムやサービスまでを含む提案を指します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
