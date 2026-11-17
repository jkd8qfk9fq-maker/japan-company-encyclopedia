# はてな — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社はてな |
| 証券コード | 3930 |
| docID（データを取り出した文書） | `S100ZASH` |
| 原本 docID | `S100ZASH` |
| 提出日（原本） | 2026-10-29 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100ZASH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社はてな / 3930 / docID S100ZASH（S100WX9N から新しい有報に更新。旧成果物は pipeline/analysis/superseded/hatena-S100WX9N/） |
| edinet | completed | 0 | pack + draft 再作成（S100ZASH） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hatena: 10 件の数値を有報XBRLと照合
有報: 株式会社はてな 有価証券報告書－第26期(2025/08/01－2026/07/31) (docID S100ZASH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
hatena: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記3は、第26期の当期純利益の大幅な減少が資金流出事案に伴う損失の計上等によるものだと説明しています。段階利益に当たる項目の金額と内訳は本文に書かない規則のため、損失の金額は本文・perspectives のどこにも書いていません。事案そのものは【経営方針、経営環境及び対処すべき課題等】に再発防止が最優先課題として開示されているため、strategy に金額なしで記載しました。
- businessModel: 会社が重視する経営指標（売上高と段階利益の指標）と業績予想・中期的な数値目標は、利益指標の目標に当たるため本文と perspectives には書いていません。セグメント利益は存在せず（単一セグメント）、段階利益の金額、キャッシュ・フローの金額、受注高・受注残高の金額も書いていません。
- businessModel: 売上高の内訳はセグメント注記【関連情報】の外部顧客への売上高を使いました（経営成績等の分析の販売実績も同じ値です）。
- businessModel: 訂正有報はありません（amendments status は none、DEI の訂正フラグはすべて false、2026年11月12日まで確認）。前期有報との修正再表示の照合は全6系列で差異ゼロでした。
- businessStructure: 単一セグメント（UGCサービス事業）のため、事業の子区分はセグメント注記の【関連情報】製品及びサービスごとの情報の区分を使い、外部顧客への売上高の大きい順に並べました（テクノロジーソリューションサービス2,780百万円、コンテンツマーケティングサービス541百万円、コンテンツプラットフォームサービス319百万円、その他サービス5百万円）。千円単位の内訳合計は3,647,169千円で、印字された売上高3,647,171千円と2千円差があります。印字どおり記載しました。
- businessStructure: 主要な設備の表にはセグメント欄の印字がないため、東京の本店（統括業務設備）と京都の本社（業務設備）はどの子区分にも結びつけていません。帳簿価額は書いていません。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため省略しました。事業系統図の個別の相手先名は、本文で関係が印字されている相手を関連企業側で扱いました。
- businessStructure: 後発事象の資本金の額の減少（2026年9月18日取締役会決議、2026年10月28日株主総会承認、効力発生は2026年12月25日の予定）は資本政策の手続きであり、純資産の額に変動はないと有報に記載されているため、needsReview ではなくここに記録しました。金額は書いていません。
- history: 沿革は年月と事象が1つの表に続けて印字されており、年月（「〃」なし）と事象の数が一致するため行順で対応づけました。本文には年だけを記載し、月は書いていません。
- history: 本店移転（2004年・2008年・2012年）、京都本社の移転（2022年）、20周年での企業ロゴのリニューアル（2021年）、任天堂株式会社のゲーム連動サービスへの個別の開発協力（2017年・2019年・2022年）、「GigaViewer for Apps」の提供開始（2021年）と株式会社集英社の「少年ジャンプ＋」への提供開始（2024年）は、列挙して省略しました。設立時の資本金の金額は書いていません。
- history: Wikipedia（記事「はてな (企業)」、証券コード3930で一致）の extract はサービスの列挙にとどまり、有報にない補足事実がなかったため、出典には使っていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 単一セグメント（UGCサービス事業）の全サービスがインターネットサービスの開発・運営とその技術を活かした企業向け支援であり、売上の大半をテクノロジーソリューションサービスが占めるため it を主たる業界としました。
- industry: 広告収入やマンガビューワの提供は各サービスの一部であり、独立した報告セグメントとして開示されていないため、media と entertainment は付けていません。
- relatedCompanies: 集英社：セグメント情報の主要な顧客ごとの情報で最大の顧客として印字され、「少年ジャンプ＋」への「GigaViewer」の提供や「マンガノ」の協業もありますが、候補（related-candidates.json）に無く、上場会社ではないため結んでいません。
- relatedCompanies: オーバーラップ・プラス、ストライプジャパン：相手先別の販売実績に印字された販売先ですが、候補に無いため結んでいません。
- relatedCompanies: 株式会社SBI証券：【大株主の状況】に載る金融機関であり、取引・提携の印字もないため結んでいません。その他の大株主は個人です。
- relatedCompanies: en、port、land、career、step、corona、ray、base-4481、core、freee、lec、seki、cover、space、tein、innovation、king、technologies、transaction：いずれも一般語・部分文字列の一致のみで、相手についての取引・提携・資本関係の印字がありません（technologies は監査報酬等の内訳表に現れるアカマイ・テクノロジーズを指し、候補の株式会社テクノロジーズとは別法人です）。
- relatedCompanies: 【関係会社の状況】は「該当事項はありません」で、親会社・子会社・関連会社はありません。売掛金・契約資産の相手先別内訳に現れる社名だけでは結んでいません。
- terms: 助言のみ：UGC（User Generated Content）、CMS、SaaS、APM（アプリケーションパフォーマンスモニタリング）、オブザーバビリティ、バリデータは有報の用語説明・注記に基づく候補です。本文では有報の説明に沿って言い換えています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
