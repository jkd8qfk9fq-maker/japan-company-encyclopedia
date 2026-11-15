# 東和薬品 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 東和薬品株式会社 |
| 証券コード | 4553 |
| docID（データを取り出した文書） | `S100YFVM` |
| 原本 docID | `S100YFVM` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFVM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 東和薬品株式会社 / 4553 / docID S100YFVM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
towa-pharmaceutical: 10 件の数値を有報XBRLと照合
有報: 東和薬品株式会社 有価証券報告書－第70期(2025/04/01－2026/03/31) (docID S100YFVM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
towa-pharmaceutical: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や販売にかかる費用を差し引いた残りが利益になります。2026年3月期のは5,…）

## エージェントの判断記録（fragment warnings）

- businessModel: セグメントの売上高はセグメント注記の外部顧客への売上高を用いた（MD&Aの海外セグメント57,630百万円は内部売上高を含む計の行のため使わなかった）。
- businessModel: 財務注記の変則決算は【連結経営指標等】の注4、三生医薬ののれん減損は【セグメント情報】の減損損失に関する情報とMD&Aに基づく。減損損失の金額は書いていない。
- businessModel: 前期比の増減率（売上高5.4%増、純利益72.3%減）はMD&Aの印字どおり。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（国内216,976百万円、海外56,734百万円、2026年3月期）。
- businessStructure: MD&Aのセグメント別業績で海外セグメントの売上高が57,630百万円と印字されているのはセグメント間内部売上高を含む「計」の行であり、外部顧客への売上高はセグメント注記の56,734百万円を採用した。
- businessStructure: 三生医薬の単体売上高は【関係会社の状況】の注記に開示されているが、独立したセグメント開示ではないため金額は書かなかった。
- businessStructure: Wikipedia（「東和薬品 （大阪府）」）を確認したが、必要な事実はすべて有報にあり、補足には使わなかった。
- history: 沿革表は年月と事象が対応して印字されており、行順で対応づけた。
- history: 工場の完成・閉鎖、物流センターの完成など設備面の出来事は多数あるため、事業の転換・上場・子会社化など主要なものに絞った。
- history: 1989年3月の決算期変更（9月期から3月期へ。第33期は6か月決算）は古い制度変更であり、現在の5年系列には影響しないため沿革には入れなかった。
- industry: 報告セグメントは国内・海外のいずれも医薬品事業であり、売上高のすべてが医薬品関連のため、主たる業界はpharmaceuticalsのみとした。
- industry: 三生医薬の健康食品事業は国内セグメントに含まれ、金額が独立して開示されていないため、foodは付けなかった。
- relatedCompanies: 東邦薬品株式会社は主要な顧客として開示されているが、候補（related-candidates.json）にないため結ばなかった。
- relatedCompanies: 株式会社吉田事務所は【関係会社の状況】で「その他の関係会社」（被所有割合40.85%、2026年3月31日現在）に挙がり、筆頭株主でもあるが、未上場で候補にないため結ばなかった。
- relatedCompanies: 連結子会社（ジェイドルフ製薬、大地化成、グリーンカプス製薬、九州医薬、三生医薬、株式会社サン・フレイルラボラトリ、Towa Pharma International Holdings, S.L.ほか）はいずれも未上場で候補にないため結ばなかった。
- relatedCompanies: 大塚製薬株式会社は2026年1月に医薬品製造の協業に関する基本合意を締結した相手だが、候補にないため結ばなかった。株式会社日本政策投資銀行は後発事象の優先株式の割当先だが、未上場で候補にないため結ばなかった。
- relatedCompanies: tis: 沿革に2018年10月の合弁会社Tスクエアソリューションズ株式会社の設立が記載されているのみで、現在の関係を示す記載が本有報にないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式に載るが、保有目的は取引金融機関としての預金・資金借入取引であり、資金調達が理由のため結ばなかった。
- relatedCompanies: mizuho-financial-group: 特定投資株式に載るが、保有目的は取引金融機関としての預金・資金借入取引であり、資金調達が理由のため結ばなかった。
- relatedCompanies: career: 一般語「キャリア」の一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: port: 「ヘルスケアパスポート」の断片一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: vision: 自社の方針名「東和ビジョン」等の一致で、株式会社ビジョンについての記載はないため結ばなかった。
- relatedCompanies: path: ambiguous で、「ヘルスケアパスポート」の断片一致のため結ばなかった。
- relatedCompanies: en: ambiguous で、製品名「リバルエン」の断片一致のため結ばなかった。
- relatedCompanies: core: ambiguous で、一般語「コア事業」の一致のため結ばなかった。
- relatedCompanies: seki: ambiguous で、「セキュリティ」等の断片一致のため結ばなかった。
- relatedCompanies: towa: 自社ブランドや社内行事「TOWA健康チャレンジ」の記述の一致で、同名の別会社であるTOWA株式会社についての記載はないため結ばなかった。
- relatedCompanies: trust: listing がコードリストになく、日本マスタートラスト信託銀行（信託口）の名称の断片一致のため結ばなかった。
- relatedCompanies: base-4481: 「営業利益ベース」等の断片一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: daiun: ambiguous で、一般語の断片一致のため結ばなかった。
- relatedCompanies: innovation: 一般語「イノベーション」の一致で、株式会社イノベーションについての記載はないため結ばなかった。
- relatedCompanies: land: 一般語「ブランド」の断片一致で、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: ray: ambiguous で、連結子会社名「サン・フレイルラボラトリ」の断片一致のため結ばなかった。
- relatedCompanies: s-t: 大株主である吉田エステートの名称の断片一致で、エステー株式会社についての記載はないため結ばなかった。
- terms: 助言: 「ジェネリック医薬品」は用語集の登録候補になります。先発医薬品と有効成分・効能が同等の後発医薬品を指す、この会社の事業の中核概念で、有報全体に繰り返し現れるためです。
- terms: 助言: 「オーソライズド・ジェネリック」は用語集の登録候補になります。先発医薬品メーカーの許諾を得て販売するジェネリック医薬品で、2026年3月に当社として2成分目の製品を発売したことが有報に現れるためです。
- terms: 助言: 「特許満了医薬品」は用語集の登録候補になります。特許が満了した先発医薬品と同成分のジェネリック医薬品を一つの市場として捉える、同社の方針「東和ビジョン」の中核概念として有報に繰り返し現れるためです。
- terms: 助言: 「ヘルスケアパスポート」は用語集の登録候補になります。治療・予防・介護支援をつなぐ健康関連事業の中心に位置づけられる同社の取り組みとして有報に現れるためです。

## 要確認（status に反映）

- businessModel: 第67期（2023年3月期）は、連結子会社9社の決算期変更に伴う経過期間として、当該9社については2022年1月1日から2023年3月31日までの15ヵ月を連結対象期間とする変則決算である（【連結経営指標等】の注記）。財務注記にも同内容を記録した。
- businessModel: 重要な後発事象（2026年3月期有報の注記）: 2026年5月21日の取締役会で、株式会社日本政策投資銀行を割当先とする第三者割当によるA種優先株式の発行（第1回は払込期日2026年7月31日、第2回は2027年4月30日までの任意の日）、定款の一部変更、資本金及び資本準備金の額の減少を決議し、同日付で同行と投資契約を締結した。本第三者割当と定款変更は2026年6月24日開催予定の定時株主総会への付議予定であり、有報提出日（2026年6月22日）時点では払込は未実施である。本エントリーは2026年3月期有報の記載に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
