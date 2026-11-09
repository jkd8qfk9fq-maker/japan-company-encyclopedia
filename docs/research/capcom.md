# カプコン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カプコン |
| 証券コード | 9697 |
| docID（データを取り出した文書） | `S100YCGO` |
| 原本 docID | `S100YCGO` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCGO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カプコン / 9697 / docID S100YCGO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
capcom: 10 件の数値を有報XBRLと照合
有報: 株式会社カプコン 有価証券報告書－第47期(2025/04/01－2026/03/31) (docID S100YCGO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
capcom: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空です。表示方法の変更による前連結会計年度の組替え（投資有価証券の区分掲記）は、売上高・純利益の範囲を変えるものではなく、前期有報との修正再表示チェックも全行一致のため、注記には書きませんでした。
- businessModel: 2024年4月1日付の普通株式1株につき2株の株式分割は、1株当たりの数値だけに関わるため、financialNotes には書きませんでした。
- businessStructure: 事業の金額は2026年3月期の外部顧客への売上高（セグメント情報の印字）で、セグメント利益は書いていない。
- businessStructure: デジタルコンテンツ事業の製品別の売上高は有報に印字されていないため、children に金額は書いていない。
- businessStructure: その他事業の内訳（eスポーツ・映像・キャラクター）の売上高も独立して印字されていないため、children に金額は書いていない。
- history: 沿革は主要な出来事を選びました。設立時の資本金は有報に印字がありますが、資本金の金額は書かない規則のため記載していません。
- industry: 主たる業界は、デジタルコンテンツ事業の2026年3月期の外部顧客への売上高が144,277百万円で連結売上高195,365百万円のうち最も大きく、家庭用ゲームなどのエンターテインメントであるため entertainment とした。
- industry: アミューズメント施設事業とアミューズメント機器事業もゲーム関連のため、2つ目の業界は付けていない。
- relatedCompanies: 結ばなかった候補: amuse（4301）— 「アミューズメント」の語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: en（4849）— 「エンターライズ」などの語の断片一致（ambiguous）で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: seki（7857）— 「情報セキュリティ」の語の断片一致（ambiguous）で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: land（8918）— 「ブランド」などの語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: ray（4317）— 「レクイエム」などの語の断片一致（ambiguous）で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: trust（3347）— listing がコードリストに無く、語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: career（6198）— 「キャリア形成支援」などの語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: vision（9416）— 経営の「ビジョン」の語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: tein（7217）— 語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: base-4481（4481）— 「ベースの数値」などの語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: create（3024）— 「クリエイト」の語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: rion（6823）— 「アデリオン」の語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: zero（9028）— 「ゼロ」の語の断片一致（ambiguous）で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: adventure（6030）— 「アドベンチャーゲーム」の語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: freee（4478）— 「CO2フリー電力」の語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: king（8118）— 大株主の住所にある「キング・アブドラ金融地区」の語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: port（7047）— 語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 結ばなかった候補: space（9622）— 「CAPCOM CONNECT SPACE」の語の断片一致で、相手の会社との取引・提携の記載なし。
- relatedCompanies: 非候補: Valve Corporation — 2026年3月期の主要な顧客（売上高40,383百万円、連結売上高の20.7％）だが、外国法人で当社の掲載企業リストに無く、関連企業として結べない。
- relatedCompanies: 非候補: Sony Interactive Entertainment LLC — 2026年3月期の主要な顧客（売上高20,741百万円）で、PlayStation向けの許諾契約もあるが、ソニーグループの子会社（LLC）で当社の掲載企業リストに無く、関連企業として結べない。
- relatedCompanies: 非候補: MICROSOFT CORPORATION — Xbox向けの許諾契約があるが、外国法人で当社の掲載企業リストに無く、関連企業として結べない。
- relatedCompanies: 非候補: 株式会社クロスロード — 2026年3月31日現在の大株主（所有株式数43,734千株、10.26％）だが、非上場で当社の掲載企業リストに無く、関連企業として結べない。
- relatedCompanies: 非候補: パブリック・インベストメント・ファンド — 大量保有報告書で保有が報告されているが、当社として実質所有株式数の確認ができておらず、大株主の状況にも含まれていないため結ばない。
- relatedCompanies: 非候補: 子会社15社（ケーツー、エンターライズ、アデリオン、レオスター、ソードケインズスタジオ、Minimum Studios Co., Ltd.ほか）— すべて非上場のため関連企業として結べない。事業の内容は businessStructure に記載した。
- relatedCompanies: 非候補: 親会社 — 有報に「当社には親会社等はありません」と印字されている。
- terms: 助言: 「リピートタイトル」は用語集の登録候補になります。発売から時間がたったゲームソフトの再販売のことで、同社のデジタルコンテンツ事業では2026年3月期に4,946万本を販売しました。
- terms: 助言: 「スマートパチスロ」は用語集の登録候補になります。メダルを使わず遊技できるパチスロ機のことで、同社のアミューズメント機器事業で販売しています。
- terms: 助言: 「デジタル販売」は用語集の登録候補になります。ゲームソフトをインターネット経由で販売することで、同社が成長の主軸としています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
