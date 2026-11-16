# 中日本鋳工 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 中日本鋳工株式会社 |
| 証券コード | 6439 |
| docID（データを取り出した文書） | `S100YIME` |
| 原本 docID | `S100YIME` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIME.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 中日本鋳工株式会社 / 6439 / docID S100YIME（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nakanippon-casting: 10 件の数値を有報XBRLと照合
有報: 中日本鋳工株式会社 有価証券報告書－第115期(2025/04/01－2026/03/31) (docID S100YIME)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
nakanippon-casting: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標等の注記は表示・計算方法の事項のみ（第111期から第113期は関係会社がないため持分法の投資利益を記載していない旨、第114期・第115期は重要性の乏しい非連結子会社のみのため同旨、潜在株式の取扱い、期末配当が定時株主総会の決議事項である旨、株価の市場出典）のため financialNotes は付けていない。期末配当（2026年6月29日定時株主総会の決議事項）は期後の資本政策事項のため warnings のみとした。
- businessModel: MD&Aの利益面の金額（営業損失・経常損失等）と受注高・受注残高の金額、経営目標の数値は書いていない（本文の財務数値は売上高と当期純利益だけの規則）。当期純損失の要因として印字された貸倒引当金繰入額等の特別損失の金額も書いていない。
- businessModel: カヤバ株式会社への販売金額はMD&A（2,087,342千円）とセグメント注記（2,089,091千円）で印字が異なるため、金額は本文に書かず割合のみを使った。
- businessModel: キャッシュ・フローの内訳に印字された関係会社貸付による支出は、タイ子会社への貸付と推測されるが相手先の印字がないため本文に書いていない。
- businessModel: perspectives にはリンク記法を使っていない（このツリーの運用）。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。仕入先の個別名は有報に印字されていない（原材料は銑鉄・鉄スクラップ等の市況品）。
- businessStructure: 事業の並び順と金額はセグメント注記の外部顧客への売上高（鋳物事業4,658,588千円、不動産賃貸事業142,670千円、発電・売電事業82,989千円、合計4,884,248千円）によった。セグメント間の内部売上高はない。
- businessStructure: 鋳物事業の子区分は【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）によった。各品目の切捨て合計（4,656百万円）はセグメント注記の鋳物事業の印字（4,658百万円）と2百万円異なる（千円単位の印字では製品別合計4,658,585千円と3千円差）。印字のセグメント金額をそのまま使った。
- businessStructure: 【設備の状況】の本社及び本社工場・吉良工場・物流センターは鋳物事業の設備、賃貸不動産の各行は不動産賃貸事業、太陽光発電設備の行は発電・売電事業として各事業に結びつけた。独身寮の2行は「全社（共通）」のためどの事業にも結びつけていない。帳簿価額は書いていない。
- businessStructure: カヤバ株式会社への販売金額は、MD&Aの相手先別販売実績（2,087,342千円）とセグメント注記の主要な顧客ごとの情報（2,089,091千円）で印字が異なる。本文には金額を書かず、割合（MD&A印字の42.7％）のみを使った。
- history: 落とした沿革行: 1946年 電動機鋳物部品の生産開始、1949年 ミシン脚部完成品の輸出・納入開始、1991年 松下電器産業（現パナソニック）向けカークーラー用シリンダー鋳物の納入開始、1997年 リケン向けエンジン用カムシャフトの生産開始、2002年 ISO9001認証取得、2006年 工場用地取得、2010年 ISO14001認証取得（単発の納入開始・認証・用地取得のため）。
- history: 沿革に資本金の金額の印字はないため、金額に関する記載はない。
- industry: 主たる業界は machinery とした。売上高の約95％を占める鋳物事業は自動車・産業機械向け銑鉄鋳物部品の鋳造・加工であり、閉じた分類の「機械」に直接合うため暫定値ではない。不動産賃貸事業（売上高の約3％）と発電・売電事業（同約2％）は売上構成が小さいため業界を付けていない。分類の不足はないので taxonomyGaps は付けない。
- relatedCompanies: カヤバ株式会社: セグメント注記の主要な顧客ごとの情報とMD&Aの相手先別販売実績に、2026年3月期の売上高の42.7％を占める主要な顧客として印字されているが、related-candidates.json に候補がないため結べない（warnings のみ）。
- relatedCompanies: tsurumi-manufacturing / tsudakoma / denso: 沿革に過去の納入・生産開始（鶴見製作所1979年、津田駒工業1984年、日本電装1969年）の印字があるだけで、当期の取引が個別に印字されていないため結ばない。
- relatedCompanies: nachi-fujikoshi / sintokogio: 特定投資株式の保有目的が全銘柄共通の定型句（「取引関係の円滑化のため」）だけであり、不二越は売掛金の相手先別内訳にも載るが金額表のみのため結ばない。
- relatedCompanies: ebara: 売掛金の相手先別内訳に社名と金額が載るのみで、個別の取引の印字がないため結ばない。
- relatedCompanies: nabtesco / seria: 投資有価証券の内訳に銘柄名が載るのみのため結ばない。
- relatedCompanies: nissin: 候補の listing が「コードリストにない」ため結ばない。
- relatedCompanies: the-bank-of-nagoya / the-ogaki-kyoritsu-bank: 長期借入金の相手先（金融取引）として載る銀行のため結ばない。
- relatedCompanies: career / lec / en / base-4481 / innovation / ricoh: 一般語・部分一致のみで、相手についての取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 候補にないため warnings のみ: 有限会社大西屋（大株主36.3％、未上場）、阪部工業株式会社（大株主4.3％）、西尾信用金庫（大株主3.8％、信用金庫）、中鋳工投資会（大株主2.7％）、株式会社IJTT・三遠機材株式会社（売掛金の相手先別内訳に載る販売先）、ＪＦＥスチール株式会社（沿革で1943年に協力工場となった旨の印字）。
- relatedCompanies: 株式会社旭メンテナンス工業は当社の子会社だった会社で2011年に吸収合併済み、NAKANIPPON Precision THAILAND Co.,Ltd.は当社の子会社のため、いずれも関連企業には結ばない。
- terms: 助言のみ。用語の追加提案：鋳物（溶かした金属を型に流し込んで成形した部品）、銑鉄鋳物（銑鉄を原料とする鋳物）、ジェットルーム（糸を空気の力で送る自動織機）、メガソーラー（大規模な太陽光発電設備）。いずれも有報の【事業の内容】【沿革】の文脈で使われている。

## 要確認（status に反映）

- businessModel: 子会社NAKANIPPON Precision THAILAND Co.,Ltdについては、2026年2月12日開催の取締役会において解散を決議し、現在清算手続き中であります。同社は有効な支配従属関係が認められないため連結の範囲から除外されており、登録は2026年3月31日現在の構成で行っております。清算の完了に伴う今後の扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
