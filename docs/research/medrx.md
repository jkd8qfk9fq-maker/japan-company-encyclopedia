# メドレックス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社メドレックス |
| 証券コード | 4586 |
| docID（データを取り出した文書） | `S100XS7V` |
| 原本 docID | `S100XS7V` |
| 提出日（原本） | 2026-03-19 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XS7V.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社メドレックス / 4586 / docID S100XS7V（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
medrx: 10 件の数値を有報XBRLと照合
有報: 株式会社メドレックス 有価証券報告書－第24期(2025/01/01－2025/12/31) (docID S100XS7V)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
medrx: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象として、2026年２月13日の取締役会で、資本金及び資本準備金の額の減少並びに剰余金の処分を2026年３月27日開催予定の第24期定時株主総会に付議することを決議しています。期末後の資本政策に関する手続であり、事業構造の変更ではないため warnings にとどめました。
- businessModel: 経営指標等の注記には、第20期から第24期までの各期に新株予約権の行使による新株発行があった旨が記載されています。株式分割・併合ではないため needsReview には入れていません。
- businessModel: MRX-7MLL（アルツハイマー治療薬のメマンチン貼付剤）は、2025年５月の臨床試験結果を受けて経皮浸透性が不十分と判断され、開発が中止されています。現在のパイプラインではないため products には含めていません。
- businessModel: 2025年12月期の売上高128百万円の相手先別の内訳（千円単位の印字）は、デ・ウエスタン・セラピテクス研究所からのマイルストン収入100百万円、Alto Neuroscience, Inc.24百万円、株式会社マリーヌ３百万円で、百万円への切り捨て後の合計は総額と一致しませんが、印字どおりの数値として扱いました。
- businessStructure: 単一セグメント（医薬品製剤開発及びこれらの付帯業務）のため、セグメント情報の記載は省略されています。金額が独立して開示されていない区分はないため、children は作りませんでした。
- businessStructure: 関連情報では、地域ごとの売上高として日本103百万円、米国24百万円が印字されています（千円単位の印字を百万円に切り捨て）。
- businessStructure: 主要な顧客ごとの情報では、Alto Neuroscience, Inc.（売上高24百万円）と株式会社マリーヌ（同３百万円）が印字され、株式会社デ・ウエスタン・セラピテクス研究所からのマイルストン収入100百万円がその他の収益として計上されています。Altoとマリーヌは関連企業の候補にないため関連企業には記録せず、customers は顧客の種類だけにしています。
- businessStructure: 製品はすべて製造委託により生産されており、自社工場での製造は行っていません。設備は本社（香川県東かがわ市、試験薬設備を含む）と東京事務所、MEDRX USA INC.本社（米国カリフォルニア州）で、いずれも単一セグメントの拠点のため、特定の製品区分には結びつけていません。
- businessStructure: 連結子会社のMEDRX USA INC.とMEDRX AUSTRALIA PTY LTD（いずれも議決権の所有割合100％、開発委託先）は自社の子会社であり、関連企業には記録していません。
- industry: 医薬品製剤開発の単一セグメントで、経皮吸収型製剤技術を用いた医薬品の研究開発が事業の全てであるため pharmaceuticals を primary にしました。他の業界は付けていません。
- relatedCompanies: aeon: 「イオン液体」という技術用語の部分文字列の一致だけで、イオン株式会社についての記載はないため結びませんでした。
- relatedCompanies: lec: 「メドレックス」の部分文字列（レック）の一致だけで、レック株式会社についての記載はないため結びませんでした。
- relatedCompanies: ray: ambiguous で、「マイクロニードルアレイ」等の部分文字列の一致だけのため結びませんでした。
- relatedCompanies: port: 「ポートフォリオ」という一般語の一致だけで、ポート株式会社についての記載はないため結びませんでした。
- relatedCompanies: nac: 「ジクロフェナック」という薬物名の部分文字列の一致だけで、株式会社ナックについての記載はないため結びませんでした。
- relatedCompanies: path: ambiguous で、「ファーストパスエフェクト」という薬学用語の一致だけのため結びませんでした。
- relatedCompanies: land: 「ブランド」という一般語の部分文字列の一致だけで、株式会社ランドについての記載はないため結びませんでした。
- relatedCompanies: taya: ambiguous で、大株主の住所（東京都世田谷区）の一致だけのため結びませんでした。
- relatedCompanies: Alto Neuroscience, Inc.は候補一覧にないため結びませんでした（2023年にAlto-101に関する提携契約を締結し、主要な顧客でもありますが、候補にない相手は関連企業に記録しません）。
- relatedCompanies: 株式会社マリーヌは候補一覧にないため結びませんでした（製品の販売先であり主要な顧客ですが、候補にない相手は関連企業に記録しません）。
- relatedCompanies: 大株主には証券会社や個人が並び、事業会社の大株主は印字されていません。純投資目的以外の目的で保有する投資株式はない旨が記載されています。
- terms: 助言のみ。本文で使った用語の候補: ILTS®、NCTS®、経皮吸収、マイクロニードルアレイ、帯状疱疹後神経痛、マイルストン、ロイヤリティ、POC試験、Fast Track指定です。

## 要確認（status に反映）

- businessStructure: 【事業等のリスク】の「継続企業の前提に関する重要事象等」に、継続企業の前提に重要な疑義を生じさせるような状況となっておりますが、翌連結会計年度の研究開発活動を展開するための資金は確保できており、継続企業の前提に関する重要な不確実性はないと認識している旨が記載されています（連結財務諸表の注記「継続企業の前提に関する事項」は該当事項なし）。継続企業の前提に関する記載の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
