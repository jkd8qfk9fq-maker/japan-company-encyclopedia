# 白鳩 — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社白鳩 |
| 証券コード | 3192 |
| docID（データを取り出した文書） | `S100XN0D` |
| 原本 docID | `S100XN0D` |
| 提出日（原本） | 2026-02-27 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XN0D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社白鳩 / 3192 / docID S100XN0D（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shirohato: 10 件の数値を有報XBRLと照合
有報: 株式会社白鳩 有価証券報告書－第54期(2025/03/01－2025/11/30) (docID S100XN0D)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2025-11 の期は 9 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
shirohato: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aに印字された営業損失・経常損失の金額とその要因分析は、本文の数値を売上高と当期純利益に限る規則のため書いていない。
- businessModel: 投資活動によるキャッシュ・フローの主な要因として旧本社の売却による収入がMD&Aに印字されているが、金額や損益区分には触れていない。
- businessModel: 第54期は9か月の変則決算で有報が前期比を記載していないため、売上高の増減率は書いていない。
- businessModel: 主要な経営指標等の注記３（臨時雇用人員の表示方法を第53期より変更）は従業員数の表示方法の変更であり、financialNotes には入れず、ここに記録する。潜在株式が存在しないため希薄化後の数値を記載していない旨の注記５も同様に記録のみとする。
- businessModel: PB（プライベートブランド）商品及びCB（コラボレーションブランド）商品の売上高構成比率は印字されているが、本文には書いていない。
- businessModel: 経営上の目標の指標として売上高と段階利益を重視する旨が印字されているが、投資指標にあたる目標数値は印字されておらず、本文にも書いていない。
- businessStructure: 単一セグメント（WEBサイトでのインナーショップ事業）のため、事業は1つだけとし、MD&Aの販売実績に印字される品目区分を children とした。品目別の販売高はMD&Aの参考数値でありセグメント開示ではないため、children には金額を書いていない。
- businessStructure: suppliers: このツリーの旧スキーマのため suppliers キーは付けていない。仕入先はインナーメーカー各社で、取扱ブランドとしてワコール、トリンプ、グンゼ、アツギなどが【事業の内容】に印字されている。
- businessStructure: 本社物流センターが唯一の主要な設備であり、単一セグメントのため事業への対応付けは行っていない（帳簿価額は書いていない）。
- businessStructure: 親会社は株式会社歯愛メディカル（議決権の50.60％を保有、2025年11月30日現在）だが、同社は2025年12月15日に上場廃止となっており候補の listing が上場でないため、関連企業としては結んでいない。事実は businessModel と relatedCompanies の warnings に記録した。
- businessStructure: Wikipedia の記事は有報の記載（歯愛メディカルの連結子会社であること）を繰り返すだけで、有報に無い補足が無いため出典として使っていない。
- history: 沿革の表は年月と事象が対応して印字されているため、行順どおりに年を対応づけた。月は書いていない。
- history: 省いた項目: アバンティ店のオープンと退店、携帯公式サイトとスマートフォン公式サイトの開設、Yahoo!ショッピング・au PAY マーケット・Amazon.co.jp・Qoo10・Qoo10 - Singapore・ポンパレモール・dショッピング・メルカリShops・Shopee への各出店、楽天市場への「トレランジェ」出店、プライバシーマークの取得、本店移転（2005年・2011年）、本店サイトのリニューアル、SNS公式サイトの開設、東京営業所の開設と閉鎖、ZOZOTOWNへのブランド出店（3件）、区画整理事業による地番変更、京都本店（直営実店舗）のオープン。いずれも店舗・チャネル単位の細目であり、事業の転機ではないため落とした。
- history: 1974年の設立時の資本金額は history には書いていない。
- industry: 主たる業界は、単一セグメントであるWEBサイトでのインナーショップ事業（インナーウェアの通信販売）から retail とした。
- industry: DEIの別記事業はCTEである。
- relatedCompanies: air-water: 【関係会社の状況】に「親会社の親会社」として印字されており、間接被所有割合50.60％と基準日が確認できるため parent として結んだ。直接の親会社は株式会社歯愛メディカルである旨を説明に書いた。
- relatedCompanies: rakuten-group: 【重要な契約等】に楽天サイト出店契約（1999年締結、期間の定めなし）が販売活動を行う上での重要な契約として印字され、【事業の内容】でも楽天市場が主要な販売チャネルとされているため business-partner として結んだ。取引の向き（出店料の支払い等）は印字されていないため customer / supplier にはしていない。
- relatedCompanies: c-i-medical: 直接の親会社（議決権の50.60％を保有、2025年11月30日現在）だが、2025年12月15日に上場廃止となっており、候補の listing が「（コードリストにない）」で上場でないため結ばなかった。親会社である事実は businessModel の flow と businessStructure の warnings に記録した。
- relatedCompanies: odakyu-electric-railway: 2016年に資本業務提携を締結し2018年に同社の連結子会社となったが、2023年３月に資本業務提携を解消し、同社の保有株式は株式会社歯愛メディカルへ譲渡されている。現在の資本・取引関係の印字が無いため結ばず、過去の関係は沿革に記載した。
- relatedCompanies: itfor: 自社サイト運営に係るリモート監視・ソフトウェア保守・ハウジングの各契約は、2025年７月の本店サイトリニューアルに伴い解約済みと印字されているため結ばなかった。
- relatedCompanies: atsugi: 取扱ブランド名としての印字のみで、仕入取引の内容や提携の記載が無いため結ばなかった。仕入先の事実は businessStructure の warnings に記録した。
- relatedCompanies: gunze: 取扱ブランド名としての印字のみで、仕入取引の内容や提携の記載が無いため結ばなかった。
- relatedCompanies: ly: 主な資産及び負債の内容における売掛金の内訳の相手先としての印字のみで、取引・提携の内容の記載が無いため結ばなかった。
- relatedCompanies: mercari: 販売チャネル「メルカリShops」の名称の印字のみで、契約や提携の内容の記載が無いため結ばなかった。
- relatedCompanies: the-shiga-bank: 借入先の金融機関名としての印字のみで、資金調達の関係のため結ばなかった。
- relatedCompanies: land: 「ブランド」の部分一致のみで、株式会社ランドとの関係の記載は無いため結ばなかった。
- relatedCompanies: king: 「ショッピング」等の部分一致のみのため結ばなかった。
- relatedCompanies: pigeon: 自社オリジナルブランド「Mon cher pigeon」の名称の部分一致のみで、ピジョン株式会社との関係の記載は無いため結ばなかった。
- relatedCompanies: space: 「スペース」という語の一致のみのため結ばなかった。
- relatedCompanies: zero: ambiguous であり、「残存価額をゼロとする」という会計方針の記載の部分一致のみのため結ばなかった。
- terms: 助言: 用語「楽らく通販システム」は、同社の自社開発の基幹システムで、発注・仕入・在庫管理・受注・売上・出荷・顧客管理などをワンストップに管理します。事業の内容に印字されています。
- terms: 助言: 用語「オートストア」は、自動倉庫型ピッキングシステムのことで、同社の本社物流センターに導入されています。事業の内容に印字されています。
- terms: 助言: 用語「SKU管理」は、品番・カラー・サイズによる最小の分類単位で商品を管理することです。用語の解説が事業の内容に印字されています。
- terms: 助言: 用語「越境EC」は、国境を越えて海外の顧客に商品を販売する電子商取引のことで、同社は天猫国際やShopeeへ出店しています。事業の内容に印字されています。

## 要確認（status に反映）

- businessModel: 決算期を２月末日から11月30日に変更したため、第54期（2025年11月期）は2025年３月１日から2025年11月30日までの９か月間であり、他の期と期間の長さが異なります（主要な経営指標等の推移の注記に記載）。本登録はこの変則決算の期間の数値に基づいています。
- businessModel: 当事業年度において、金融機関とのローン契約の財務制限条項であるインタレストカバレッジレシオが１以下となり条項に抵触しましたが、金融機関と協議を行い、期限の利益の喪失事由に該当しないこと等について確認しております（財務諸表の注記に記載）。
- 財務: 変則決算。2025-11 の期は 9 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
