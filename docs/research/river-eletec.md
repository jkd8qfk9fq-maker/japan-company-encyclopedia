# リバーエレテック — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | リバーエレテック株式会社 |
| 証券コード | 6666 |
| docID（データを取り出した文書） | `S100YJ84` |
| 原本 docID | `S100YJ84` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ84.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | リバーエレテック株式会社 / 6666 / docID S100YJ84（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
river-eletec: 10 件の数値を有報XBRLと照合
有報: リバーエレテック株式会社 有価証券報告書－第81期(2025/04/01－2026/03/31) (docID S100YJ84)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
river-eletec: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記1〜3は、潜在株式が存在しないことや損失年度における表示の省略という表示・算定事項のみのため、financialNotesには入れていません。指標表に会計基準の変更や決算期の変更の注記はなく、financialNotesは空です。
- businessModel: MD&Aに印字された売上高と当期純利益以外の損益の金額や増減率は、規則により本文に書いていません。profitの段には当期純損失の金額と、印字された要因（プロダクトミックスの悪化、原材料費の高騰、人件費等のコスト増、主力製品の受注回復）だけを書きました。River Electronics（Ipoh）Sdn. Bhd.の清算に伴う特別損益の計上は、損益区分の話のため本文には書いていません。
- businessModel: 受注高と受注残高の金額は書いていません。
- businessModel: 中期経営計画の数値目標は投資・利益指標のため、strategyには書いていません。方針と取り組みだけを書きました。
- businessModel: 【事業の内容】の子会社数（4社）と連結の範囲の注記の子会社数（5社、清算手続き中のRiver Electronics（Ipoh）Sdn. Bhd.を含む）の相違は、businessStructure の warnings に記録しました。本文では子会社の社数を特定していません。
- businessModel: 売上高5,784百万円は、印字された5,784,902千円の百万円未満を切り捨てたものです。地域別の売上高も同様に切り捨てています。
- businessModel: Wikipediaの記事は証券コードで照合できましたが、抜粋は本社所在地と事業の概要という有報の事実の再掲のみのため、出典には加えていません。
- businessStructure: 単一セグメント（水晶製品事業）のため、事業は1つだけ立て、【関連情報】の製品区分にあたる水晶振動子と水晶発振器を children にしました。製品及びサービスごとの情報は、単一の製品・サービスの区分が売上高の90％を超えるため有報で開示が省略されており、children に金額は書いていません。
- businessStructure: 【事業の内容】はグループを「当社及び連結子会社4社（国内1社及び在外3社）」としていますが、連結財務諸表の注記（連結の範囲）は連結子会社数を5社とし、River Electronics（Ipoh）Sdn. Bhd.を含めています。同社は2023年9月の取締役会で解散・清算が決議され清算手続き中で、抵抗器の製造・販売は同社の解散に伴い終了しています。本文では子会社の社数を特定せず、期末現在の役割分担だけを書きました。
- businessStructure: 【関係会社の状況】の注記に、青森リバーテクノ株式会社が債務超過の会社である旨が記載されています。金額は売上高・純利益以外の財務数値のため本文には書いていません。
- businessStructure: 拠点は単一セグメントでセグメント欄の区別がないため、事業への結びつけはしていません。本社は山梨県韮崎市（生産・管理・販売設備）、製造は青森リバーテクノ株式会社（青森市）と西安大河晶振科技有限公司（中国西安市）が担います。帳簿価額は書いていません。
- businessStructure: suppliersはこのツリーの旧スキーマのため省略しています。有報に個別の仕入先名の開示はありません。
- history: 沿革のうち、営業所の開設（1982年宇都宮、1985年大阪、1986年名古屋）、高雄力巴股份有限公司の設立（1986年、業務は2000年に台湾利巴へ移管）、ISO9002・ISO9001・ISO14001の取得（1995年・1998年・2001年）、青森リバーテクノによるリバー電子・リバーエルコムの株式取得（1996年、2003年の吸収合併の項目に統合）、リバー金木株式会社の設立（2000年、同上）、上海駐在員事務所の開設（2007年）、大阪証券取引所JASDAQへの上場（2010年、市場再編に伴う機械的な移行）、譲渡制限付株式（RS）の付与（2020年、資本政策）は項目にしていません。
- history: 1951年の設立時の資本金など、資本金の金額は沿革に書いていません。
- history: River Electronics（Ipoh）Sdn. Bhd.の解散・清算決議（2023年）は【関係会社の状況】の注記と連結の範囲の注記に基づく事実で、沿革表の行ではないため、1990年の設立項目の significance に記録しました。
- industry: 主たる業界は「electronics」を付けました。水晶振動子・水晶発振器という周波数制御用の電子部品の製造・販売が事業そのもの（連結売上高の99％超）であり、閉じた分類に直接当てはまります。
- industry: semiconductors（半導体）は付けていません。当社の製品は半導体そのものでも半導体向けの部材・製造装置でもなく、スマートフォン、IoT、カーエレクトロニクス、データセンターなど幅広い電子機器に使われる汎用の周波数制御デバイスのためです。
- relatedCompanies: 台湾晶技股份有限公司は2026年3月期の売上高の43.1％を占める主要な顧客ですが、台湾の外国会社で related-candidates.json に含まれていないため、結んでいません。
- relatedCompanies: ソニーフィナンシャルグループ株式会社の株式は、ソニーグループによるスピンオフ（現物配当）により保有するに至ったもので、取引関係の印字がないため結んでいません。
- relatedCompanies: 株式会社みずほフィナンシャルグループと株式会社山梨中央銀行の株式保有は、取引金融機関・メインバンクとの資金調達など金融サービスのためのものであるため結んでいません。山梨中央銀行は大株主（3.26％、2026年3月31日現在）でもありますが、銀行のため結んでいません。
- relatedCompanies: 大株主の若光株式会社（14.86％）、株式会社376（2.31％）、株式会社商工組合中央金庫（1.46％）はいずれも related-candidates.json に含まれていないため結んでいません。若尾富士男氏ら個人の大株主も候補外です。
- relatedCompanies: 残りの候補（en、vision、innovation、kohsoku、hiraga、ic、seki、career、cover、arata、corona、freee、idea-consultants、port、space、tein）はいずれも一般語・部分一致（エンゲージメント、経営ビジョン、イノベーション、高速通信、平賀工場、発振回路のIC、セキュリティ、キャリア採用、カバー、コロナウイルス感染症など）で、当社との取引・提携・資本関係の印字がないため結んでいません。
- relatedCompanies: 当社の連結子会社（青森リバーテクノ株式会社、台湾利巴股份有限公司、River Electronics（Singapore）Pte. Ltd.、西安大河晶振科技有限公司、清算手続き中のRiver Electronics（Ipoh）Sdn. Bhd.）は関連企業には含めていません。
- terms: 用語の助言のみです。対象となりうる用語は「水晶振動子」「水晶発振器」「音叉型水晶振動子」「位相ジッタ」「周波数制御デバイス」「IATF16949」です。本文では初出で役割を説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
