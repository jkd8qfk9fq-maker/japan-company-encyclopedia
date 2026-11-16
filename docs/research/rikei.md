# 株式会社　理経 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　理経 |
| 証券コード | 8226 |
| docID（データを取り出した文書） | `S100YK3T` |
| 原本 docID | `S100YK3T` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK3T.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　理経 / 8226 / docID S100YK3T（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
rikei: 10 件の数値を有報XBRLと照合
有報: 株式会社　理経 有価証券報告書－第69期(2025/04/01－2026/03/31) (docID S100YK3T)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
rikei: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の千円印字を百万円に切り捨て換算した（四捨五入はしていない）。セグメント別の外部顧客への売上高の切り捨て合計（13,985＋3,777＋1,773＝19,535百万円）は、印字の連結売上高19,535百万円（19,535,970千円）と一致する。
- businessModel: 前期有報との修正再表示チェックは全系列で差異なしで、会計基準の変更や表示方法の変更、変則決算の印字もないため、financialNotesは付けていない。
- businessModel: 中期経営計画の株主還元の目標（配当性向・1株当たり配当の維持）は投資指標のため、本文と戦略には書かずここに記録した。
- businessModel: セグメント利益の金額や利益率は本文・戦略に書いていない。受注高・受注残高の金額も本文には書いていない。
- businessModel: 連結子会社の株式会社エアロパートナーズの単体損益情報（売上高が連結売上高の10％超のため開示）は、子会社単体の損益であるため本文には書かず、ここに事実のみ記録した。
- businessModel: 最大の販売先である防衛省（2026年3月期の総販売実績の56.7％）は政府機関であり企業ではないため、関連企業には結ばず、事実はindustryPositionの根拠とrelatedCompaniesの警告に記録した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（電子部品及び機器13,985百万円、システムソリューション3,777百万円、ネットワークソリューション1,773百万円）。
- businessStructure: 連結子会社は3社（株式会社エアロパートナーズ、株式会社ネットウエルシステム、エアロパートナーズ・アメリカ,Inc.）で、いずれも自社グループの子会社であるため関連企業リンクの対象外とした。エアロパートナーズ・アメリカ,Inc.は株式会社エアロパートナーズを通じた間接保有である。
- businessStructure: 事業系統図や関係会社の状況に個別の仕入先名の印字がないため、仕入先の事実はbusinessModelの警告にも個別には記録していない（グループの仕入は受注販売を原則とし、連結子会社の主要仕入先は海外である旨がMD&Aに印字される）。
- history: 設立時の資本金の金額は、沿革に金額を書かない規則により記載していない。
- history: 沿革の2013年７月・2015年５月・2017年10月・2017年12月の年月セルが連続して印字され、事項がその順に並ぶ崩れた表であるため、行の順序どおりに対応付けた（2013年７月＝北米駐在事務所の開設、2015年５月＝沖縄出張所の開設、2017年10月＝エアロパートナーズの株式取得、2017年12月＝ネットウエルシステムの株式取得）。うち株式取得の2件のみを沿革に残し、事務所開設の2件はここに記録した。
- history: 沿革に残さなかった事項： 大阪支店の開設（1968年）、米国・香港・シンガポール・上海の現地法人の設立と清算結了、本社の移転（1978年・2021年）、各営業所の開設・改称、技術センターの開設（1990年）、日本ログフォース株式会社の設立と清算結了（1996年・2015年）、ISO14001・ISO27001・ISO9001の認証取得、千歳・恵庭営業所の開設（2023年）。
- industry: 主たる業界は、輸出入販売を主要業務とする技術商社であることに基づきtradingとした（taxonomyGaps参照）。
- industry: 電子部品及び機器が売上高の約72％を占めるが、電子部品の製造ではなく輸出入販売であるため、electronicsやsemiconductorsは付けていない。
- industry: システムソリューション（ITシステムの販売・構築）は売上高の約19％で、商社としての商品販売と一体の事業のため、itは重ねて付けていない。
- relatedCompanies: 最大の販売先である防衛省（2026年3月期の総販売実績の56.7％）は政府機関であり企業ではないため結ばなかった。事実はbusinessModelのindustryPositionの根拠に記録した。
- relatedCompanies: 結ばなかった候補と理由：
- relatedCompanies: aozora-bank（あおぞら銀行）・hachijuni-nagano-bank（八十二長野銀行）・the-chiba-bank（千葉銀行）・the-gunma-bank（群馬銀行）＝グループ会社のシンジケートローン契約の貸付金融機関名の一覧に現れるだけで、個別の取引関係を述べる印字がないため結ばなかった。
- relatedCompanies: hikari-tsushin（光通信）＝『光通信用デバイス』という製品名の部分一致で、株式会社光通信への言及ではない。
- relatedCompanies: kohsoku（高速）＝高速大容量の通信ネットワーク、高速長距離無線LANシステムという一般語の部分一致。
- relatedCompanies: career（キャリア）＝キャリアプランという一般語の一致。
- relatedCompanies: en（エン）＝エンジン等の部分一致。
- relatedCompanies: port（ポート）＝サポート等の部分一致。
- relatedCompanies: seki（セキ）＝セキュリティの部分一致。
- relatedCompanies: ray（レイ）＝ディスプレイ等の部分一致。
- relatedCompanies: vision（ビジョン）＝経営ビジョンという一般語の一致。
- relatedCompanies: aeon（イオン）＝PFAS吸着用イオン交換樹脂の部分一致。
- relatedCompanies: base-4481（ベース）＝営業利益ベースという表現の部分一致。
- relatedCompanies: land（ランド）＝グランドデザインの部分一致。
- relatedCompanies: taya（田谷）＝大株主の住所である世田谷区の部分一致。
- relatedCompanies: trust（トラスト）＝コードリストにない相手で、日本マスタートラスト信託銀行（信託口）という信託口座の部分一致。
- relatedCompanies: 特定投資株式は該当事項なしと印字されており、政策保有株式に基づくリンクはない。大株主は個人、信託銀行の信託口・投信口、生命保険会社などで、事業会社の候補はいなかった。
- relatedCompanies: 連結子会社3社（株式会社エアロパートナーズ、株式会社ネットウエルシステム、エアロパートナーズ・アメリカ,Inc.）は自社グループの子会社であるため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は有報の本文に説明があるものだけを選んだ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 理経の主たる事業（IT・エレクトロニクス製品の輸出入販売を行う技術商社） → 提案: 専門商社（技術商社・電子部品/IT機器の輸出入販売）。有報は、IT及びエレクトロニクス業界において日本、米国並びにアジアの各国間での商品の輸出入販売を主要業務と書く。製造は伴わない商社流通であり、現在の閉じた集合で最も近いのはtrading（商社）だが、『商社』は総合商社を思わせる名前で、電子部品やIT機器を扱う専門商社（技術商社）を探すときの区分としては遠い。専門商社の山善や建材輸入販売のアドヴァングループも同じtradingを暫定で付けており、同種の会社が増えれば区分を決める材料になる。
