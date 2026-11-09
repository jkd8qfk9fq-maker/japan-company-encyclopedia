# 立花エレテック — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社立花エレテック |
| 証券コード | 8159 |
| docID（データを取り出した文書） | `S100YG86` |
| 原本 docID | `S100YG86` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG86.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社立花エレテック / 8159 / docID S100YG86（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tachibana-eletech: 10 件の数値を有報XBRLと照合
有報: 株式会社立花エレテック 有価証券報告書－第97期(2025/04/01－2026/03/31) (docID S100YG86)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tachibana-eletech: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…や人件費などの費用を差し引いた残りが利益になります。2026年3月期のは7,…）
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…社版生産性を高め、1人当たりの売上・利益を向上させます。戦略項目ごとの投資判…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの注意への判断: 本文の「財務諸表の組替え」は、表示方法の変更（「営業外費用」の「雑損失」に含めていた「シンジケートローン手数料」が営業外費用総額の10％を超えたため独立掲記し、前期の連結財務諸表を組み替えたもの）であり、5年間の売上高・純利益等の系列の修正再表示ではない。前期有報との修正再表示チェックでも重複年度は全行一致したため、needsReviewには入れず、financialNotesは空とした。
- businessModel: 中長期経営計画「NEW C.C.J2200」「GIC30」に数値目標の印字は確認できなかったため、目標数値は引用していない（達成の有無は有報の記述どおりに書いた）。
- businessModel: 文章に書いた金額は売上高と親会社株主に帰属する当期純利益（およびその前期比）だけであり、営業利益・経常利益・セグメント利益などの金額は書いていない。
- businessStructure: 事業の並びはセグメント情報の外部顧客への売上高の大きい順（FAシステム事業109,865百万円、半導体デバイス事業89,156百万円、施設事業21,720百万円、その他6,768百万円）とし、報告セグメントに含まれない「その他」（MS事業を含む）は最後に置いた。セグメント利益は書いていない。
- businessStructure: セグメント情報には日本／アジア他の地域別内訳がセグメントごとに開示されているが、地域別内訳は事業の子区分ではないため、childrenは付けなかった。
- businessStructure: 主要な設備のうち本社・東日本支社等の拠点は全セグメントにまたがるため特定の事業に付けず、単一セグメントの子会社拠点（立花宏和システムサービス＝施設事業など）の情報は各事業の記述の参考にとどめた。
- history: 沿革は年月と事象が一体の文章で印字されており、印字どおりに対応づけた。創業時の資本金などの金額は文章の規則により書いていない。
- history: 支店・営業所の開設移転、駐在員事務所の開設、建設業許可の取得、小規模子会社の設立・合併などの行は多数あるため省略した（例: 東京支店・名古屋支店等の開設、研電工業・宏和工業・太洋商会の株式取得、タカギコネクトの資本業務提携と完全子会社化、八洲電子ソリューションズの株式譲渡契約と連結子会社化、立花オーバーシーズホールディングスの設立など）。
- industry: 主たる業界は、最大セグメントのFAシステム事業をはじめ取扱商品がFA機器・配電制御機器などの電機・電子機器であることからelectronicsとした（東証の業種区分は卸売業だが、取扱製品の性質に基づく）。
- industry: semiconductorsは2つ目に付けた。半導体デバイス事業は外部顧客への売上高89,156百万円（全体の約39％）の独立開示された報告セグメントであり、マイコン・ASIC・メモリーなどの半導体の販売を事業として開示しているため。なお同事業は販売が主体だが、連結子会社の立花デバイスコンポーネント・立花電子ソリューションズは半導体・電子デバイス品の開発、設計、製造、販売、保守を行うと開示されている。
- relatedCompanies: 関連企業の判定は、重要な契約等の記載と、特定投資株式の保有目的の記載に基づく。保有目的には全銘柄共通の定型文があるが、各銘柄ごとに取引の内容（販売先／仕入先、セグメント、製品、方向）が個別に印字され、保有株式数も実質的な水準にある相手を結んだ。貸借対照表計上額は書いていない。
- relatedCompanies: mitsubishi-electric: 大株主（8.74％、2026年3月31日現在）でもあるが、特約販売・販売契約と「全事業の主要仕入先」の記載があるためsupplierとし、大株主であることは説明に併記した。kinden（3.43％）・noritz（3.38％）も同様に、販売取引の記載があるためcustomerとし、大株主であることを説明に併記した。
- relatedCompanies: hirano-tecseedは保有株式数5,535株とやや小さいが、保有目的にFAシステム事業の取引先として販売とシステム提案の継続的な取引が相手固有に印字されており、計上額も僅少の域ではないためcustomerとして結んだ。
- relatedCompanies: tomita（4,668株）・shima-seiki-mfg（1,650株）・siriusvision（5,500株）: 保有目的に取引の記載はあるが、保有株式数・計上額が僅少な水準にとどまるため結ばなかった。
- relatedCompanies: kanaden（72,000株）・mansei（10,000株）: 保有目的は「当社と同様、三菱電機株式会社の主要代理店であり、良好な関係の維持」という同業代理店同士の関係維持のみで、当社との取引の記載がなく、大株主の状況にも載っていないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group・iyogin-holdings・sumitomo-mitsui-financial-group・the-ehime-bank: 保有目的が主要取引金融機関としての資金借入れ等の金融取引であるため結ばなかった。
- relatedCompanies: almetax-manufacturing・chubu-steel-plate・diamond-electric-holdings・espec・fenwal-controls-of-japan・kobe-steel・kyokuto-kaihatsu-kogyo・lobtex・nikko-6306・nippon-steel・nissin-shoji・obayashi・panasonic-holdings・sansha-electric-manufacturing: 当連結会計年度に全株を売却済みで、期末時点で保有していないため結ばなかった。
- relatedCompanies: ntt: 一致箇所は重要な契約等における三菱電機の「通信・NTT事業部」扱い製品の記載であり、NTT株式会社そのものとの関係ではないため結ばなかった。
- relatedCompanies: sansei: 大株主の状況の「株式会社サンセイテクノス」は候補のサンセイ株式会社（証券コード6307）とは別の会社であり、同一性が確認できないため結ばなかった。
- relatedCompanies: yashima-denki: 沿革の2020年の八洲電子ソリューションズ株式会社の株式譲渡契約という過去1回限りの取引のみで、相手の子会社は現在当社の連結子会社であり、現在の関係の記載がないため結ばなかった。
- relatedCompanies: career・base-4481・step・en・ic・port・seki・core・trust: いずれも一般語・製品名・制度名等の断片的一致（キャリアアップ、ベースアップ、5ステップアプローチ、エンベデッド機器、ASIC・アナログIC、サポート、セキュリティ、コア事業、日本マスタートラスト信託銀行（信託口）等）であり、会社との関係の記載がないため結ばなかった。trustは上場区分がコードリストにない点でも対象外である。
- relatedCompanies: 候補リストにない相手の注記: 株式会社ダイフク（848,114株）と株式会社FUJI（204,050株）は特定投資株式にFAシステム事業の販売先として個別の取引が印字されているが、候補リストに含まれないため結んでいない。株式会社サンセイテクノスは大株主（7.56％）だが候補リストになく、上場会社かどうかも有報からは確認できないため結んでいない。
- terms: 登録候補（助言のみ）: MMS（金属加工製造受託。立体駐車場向け部材などの金属加工を請け負う受託事業で、同社のMS事業を構成する）、EMS（電子機器製造受託。基板ビジネスなど電子機器の製造を請け負う受託事業で、同社のMS事業を構成する）、技術商社（商品の販売に設計・製作・技術支援などの技術サービスを組み合わせて提供する商社。同社は企業理念で「電機、機械、電子、情報を扱う技術商社」と自らを位置づけている）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
