# クオリプス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | クオリプス株式会社 |
| 証券コード | 4894 |
| docID（データを取り出した文書） | `S100YIP2` |
| 原本 docID | `S100YIP2` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIP2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | クオリプス株式会社 / 4894 / docID S100YIP2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 22 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cuorips: 6 件の数値を有報XBRLと照合
有報: クオリプス株式会社 有価証券報告書－第10期(2025/04/01－2026/03/31) (docID S100YIP2)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
cuorips: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の増減率は印字どおり21.2％増と書きました。利益の金額の増減理由は本文に書いていません。
- businessModel: 研究開発費の金額は本文に書いていません。経営上の目標の指標として研究開発の進捗状況を用いる旨は印字されていますが、投資の語に当たる財務指標の目標値は書いていません。
- businessModel: 受注実績の金額は書いていません（受注残高が僅少であるため記載を省略する旨が印字されています）。
- businessModel: 証拠パックの注意に財務諸表の組替えの記載がある旨がありましたが、修正再表示チェックでは前期有報と重複する年度の数値は全て一致しており、組替えの内容を示す具体的な注記は本文ファイルからは特定できなかったため、financialNotes には連結作成開始の事実のみを記録しました。
- businessModel: 第一三共株式会社との共同研究開発契約は2026年3月末で終了していますが、心筋細胞シートの商業化に必要な知的財産権のライセンス条件を定める覚書は引き続き効力を有しています（relatedCompanies に記録）。
- businessModel: wikipedia.json は「日本の企業一覧 (医薬品)」の記事で、補足に使える当社固有の事実がないため出典に加えていません。
- businessStructure: 単一セグメント（再生医療等製品事業）のため、販売実績のサービス別区分であるCDMO・コンサルティングサービス（2026年3月期210百万円）を children とし、金額が独立して印字されていない心筋細胞シート（リハート）を金額なしで最後に置きました。販売実績の「その他」2百万円は独立したサービス区分として定義されていないため children にはしていません。CDMO・コンサルティングサービス210百万円とその他2百万円の合計は売上高212百万円と一致します。
- businessStructure: CLiC-1は事業の内容で心筋細胞の製造・シート作製とCDMO事業の双方の拠点と印字されているため、親事業の説明に置き、特定の children には結びつけていません。本社と大阪ラボ、中之島クロス（パイロットスケールプラント）も単一セグメントの設備のため特定の children には結びつけていません。
- businessStructure: CLiC-1は2026年5月に「特定細胞加工物等製造施設」として改めて届出されています（施設番号：FC5260014）。決算日後の事実ですが、事業の内容に現在の体制として印字されているため、親事業ではなく本 warnings に記録しました。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略しました。原材料等の仕入先に関する個別の印字は事業の内容にはありません。
- businessStructure: 設備の帳簿価額は書いていません。
- history: 沿革の年月は年だけを採用し、月と資本金の金額は書いていません。
- history: 2017年の大阪大学での研究施設開設、2018年の本店移転と臨床研究の試験計画申請、2019年から2023年の医師主導治験の実施と終了、2022年の朝日インテック株式会社との共同研究契約の締結、2023年の新潟大学との共同研究契約の締結とジャパン・イノベーション・キャンパスへの入居決定、2024年のVMaCS発足とスタンフォード大学との共同研究契約の締結、2025年の大阪・関西万博での展示開始と再生医療の製造設備投資支援事業への採択は、主要な節目に絞るため省きました（朝日インテックとの共同開発は relatedCompanies に記録）。
- history: wikipedia.json は「日本の企業一覧 (医薬品)」の記事で、補足に使える当社固有の事実がないため出典に加えていません。
- industry: 主たる業界は単一セグメントである再生医療等製品事業（ヒトiPS細胞由来の再生医療等製品の開発・製造販売とCDMO事業）から選びました。閉じた分類に再生医療等製品に当たる区分がないため、製造販売承認を受けて医薬品医療機器等法の下で製造販売する製品の事業として最も近い pharmaceuticals を暫定とし、taxonomyGaps に提案を記録しました。
- relatedCompanies: pasona-group: セグメント情報の主要な顧客ごとの情報に2026年3月期の顧客として印字されているため customer として結びました。金額は説明文に書いていません。
- relatedCompanies: daiichi-sankyo: 大株主（12.11％）であり、共同研究開発契約とライセンス覚書の相手先でもあるため、資本関係を主として major-shareholder として結び、提携の事実を説明に併記しました。
- relatedCompanies: asahi-intecc: 重要な契約等に共同研究契約が印字され、共同開発が進行中のため business-partner として結びました。大株主でもありますが、進行中の共同開発を主たる関係としました。
- relatedCompanies: terumo: 大株主の状況に載る事業会社で、他の区分に当たらないため major-shareholder として結びました。本文に取引・提携の個別の記載はありません。
- relatedCompanies: dai-dan: 大株主の状況に載る事業会社で、クリーンブースの技術に関する記載もあるため major-shareholder として結びました。
- relatedCompanies: ono-pharmaceutical: 重要な契約等に、大阪大学とともに特許及びノウハウの譲渡に関する覚書の相手先として印字されているため business-partner として結びました。
- relatedCompanies: nomura-9716: 前連結会計年度の主要な顧客として印字されていますが、当連結会計年度は主要な顧客ごとの情報に載っておらず（割合10％未満の相手先は記載省略）、当期の取引関係を確認できないため結びませんでした。
- relatedCompanies: matsui-securities: 大株主の状況に載っていますが、証券会社であり、取引・提携の個別の記載がない純投資の保有と判断して結びませんでした。
- relatedCompanies: en: 「ヘルスケア」等の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: innovation: 「オープンイノベーション」等の一般語の一致のみのため結びませんでした。
- relatedCompanies: path: 「バイパス手術」等の部分文字列の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: nissin: コードリストにない相手で、新株予約権の定型文中の一致のみのため結びませんでした。
- relatedCompanies: cube: 沿革の相手先は株式会社セルキューブであり、候補の株式会社キューブとは別の法人のため結びませんでした。
- relatedCompanies: zero: 一般語の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: base-4481: 「終値ベース」等の一般語の一致のみのため結びませんでした。
- relatedCompanies: career: 「キャリアプラン」の一般語の一致のみのため結びませんでした。
- relatedCompanies: corona: 「新型コロナウイルス感染症」の一致のみのため結びませんでした。
- relatedCompanies: cover: 「カバーできない」等の一般語の一致のみのため結びませんでした。
- relatedCompanies: no-1: 特許番号中の「No.」の一致のみのため結びませんでした。
- relatedCompanies: port: 「サポート」等の部分文字列の一致のみのため結びませんでした。
- relatedCompanies: takashima-and-co: 住所の「高島」の一致のみで、ambiguous のため結びませんでした。
- relatedCompanies: tear: 部分文字列の一致のみのため結びませんでした。
- terms: 助言のみ。本文で使った用語の候補: iPS細胞、心筋細胞シート、再生医療等製品、CDMO（製造開発受託）、特定細胞加工物、希少疾病用再生医療等製品、条件及び期限付き製造販売承認、CLiC-1、体内再生因子誘導剤です。
- terms: wikipedia.json は「日本の企業一覧 (医薬品)」の記事で補足に使える事実がないため、出典には加えていません。

## 要確認（status に反映）

- businessStructure: 表紙に、本店は2026年6月25日開催予定の第10回定時株主総会において定款の一部変更が承認可決された場合、2027年3月31日までに開催予定の取締役会の決議により、大阪府大阪市北区中之島4丁目3番51号 Nakanoshima Qross 8Fへ移転する予定である旨が記載されています。提出日時点では条件付きの予定のため、2026年3月31日現在の本店所在地で登録しており、移転の実施には人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] クオリプスの主たる業界（再生医療等製品事業） → 提案: 再生医療等製品。事業はヒトiPS細胞由来の再生医療等製品の研究開発・製造販売と細胞培養加工の受託が単一セグメントであり、主力製品のリハートは再生医療等製品として条件及び期限付き製造販売承認を取得しています。閉じた分類に再生医療等製品に当たる区分がなく、医療関連で最も近い pharmaceuticals（医薬品）を暫定としました。
