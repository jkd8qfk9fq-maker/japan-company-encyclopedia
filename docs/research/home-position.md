# ホームポジション — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ホームポジション株式会社 |
| 証券コード | 2999 |
| docID（データを取り出した文書） | `S100X6G1` |
| 原本 docID | `S100X6G1` |
| 提出日（原本） | 2025-11-25 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X6G1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ホームポジション株式会社 / 2999 / docID S100X6G1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
home-position: 10 件の数値を有報XBRLと照合
有報: ホームポジション株式会社 有価証券報告書－第36期(2024/09/01－2025/08/31) (docID S100X6G1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
home-position: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨てて引用した（売上高17,364,543千円→17,364百万円、当期純利益387,725千円→387百万円、前期の当期純損失691,102千円→691百万円）。
- businessModel: 当作業ツリーのスキーマに仕入先（suppliers）の項目がないため、businessModelには仕入先を記載していない。建築は外部の協力業者へ発注している事実は事業構造に記録した。
- businessModel: 経営上の目標の達成状況を判断するための客観的な指標として会社が重視する「売上高営業利益率」は、利益率の指標であるため本文・戦略には書かず、ここに記録する。
- businessModel: 中長期の目指す姿として印字された売上高1,000億円・販売棟数3,000棟規模という数値目標は、本文・戦略には書かず、ここに記録する。
- businessModel: 生産実績・受注実績・受注残高の金額は本文には書かず、ここに記録する（受注高・受注残高は記載対象外の数値のため金額自体も転記しない）。
- businessModel: 2025年８月期に実施されたケイアイスター不動産株式会社に対する第三者割当増資による資金調達の事実は関連企業に記録し、増資金額は本文に書いていない。
- businessStructure: 建築工事は全拠点において外部の協力業者に発注しており、価格、品質並びに施工に掛かる時間等を総合的に判断して選定している。個別の協力業者名は印字されていない。
- businessStructure: 用地の仕入れは、各地域に密着した地元の仲介業者等とのネットワークを通じて物件情報を入手している。個別の仲介業者名は印字されていない。
- history: 沿革のうち、本社の移転（1991年、2007年）、宅地建物取引業免許・建設業許可・建築士事務所登録などの許認可の取得・廃業、個別の支店・営業所の開設・移転・閉鎖（2016年東京オフィス、2017年愛知県知事登録、2018年東関東支店・浜松営業所、2019年神奈川営業所、2020年名古屋支店移転・大宮支店・城東支店開設と東関東支店廃止、2021年相模原支店、2023年町田支店・神奈川県知事登録、2024年海老名支店開設・横浜支店閉鎖、2025年三島支店）は、会社の転機となるもの以外は採用せず列挙にとどめた。
- history: 設立時の資本金額は沿革に印字されているが、金額は記載していない。
- industry: 主たる業界は、売上高の全額を占める戸建分譲事業（分譲戸建住宅の販売）に基づき real-estate とした。建築工事は外部の協力業者へ発注しており、建設の独立した事業・金額の開示がないため construction は付けなかった。
- relatedCompanies: career（株式会社キャリア）は「キャリア意識の醸成」等の文言への一致のみで、同社への言及ではないため結ばなかった。
- relatedCompanies: nissin（株式会社日新）はコードリストになく、新株予約権の行使期間等の文言中の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: seki（セキ株式会社）は「情報セキュリティ」の文言への一致のみ（ambiguous）のため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）は「コロナウイルスの感染拡大」の文言への一致のみで、同社への言及ではないため結ばなかった。
- relatedCompanies: ichiyoshi-securities（いちよし証券株式会社）は、発行済株式総数・資本金の推移において過去の第三者割当増資の割当先として一度記載されるのみで、継続的な取引・提携関係の記載がないため結ばなかった。
- relatedCompanies: kitakei（北恵株式会社）は、未払金の相手先として金額とともに記載されるのみで、取引関係を明示する記載がないため結ばなかった（ambiguous）。
- relatedCompanies: ray（株式会社レイ）は、常任代理人の住所文中の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: 伴野アセットマネジメント株式会社は創業者である代表取締役社長の資産管理会社で大株主だが、候補（related-candidates.json）に載らない非上場会社のため結ばなかった。事実はリスク情報の記載に基づき、ここに記録する。
- relatedCompanies: 当社は投資株式を保有しておらず（株式の保有状況に明記）、特定投資株式に基づくリンクはない。
- terms: 用語の助言は行いませんでした。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の注記に、2022年５月18日付で普通株式１株につき２株の割合で株式分割を行った旨が印字されています。
- businessModel: 次の有価証券報告書（第37期、決算期2026年８月31日）は未提出であり、提出期限は2026年11月30日です。EDINETで未提出を確認し、2025年８月31日現在の情報で登録しました。
- businessStructure: 主要な経営指標等の注記に、2022年５月18日付で普通株式１株につき２株の割合で株式分割を行った旨が印字されています。
- businessStructure: 次の有価証券報告書（第37期、決算期2026年８月31日）は未提出であり、提出期限は2026年11月30日です。EDINETで未提出を確認し、2025年８月31日現在の情報で登録しました。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
