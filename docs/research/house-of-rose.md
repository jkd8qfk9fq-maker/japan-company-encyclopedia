# ハウス オブ ローゼ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　ハウス　オブ　ローゼ |
| 証券コード | 7506 |
| docID（データを取り出した文書） | `S100YHK9` |
| 原本 docID | `S100YHK9` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHK9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　ハウス　オブ　ローゼ / 7506 / docID S100YHK9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
house-of-rose: 10 件の数値を有報XBRLと照合
有報: 株式会社　ハウス　オブ　ローゼ 有価証券報告書－第45期(2025/04/01－2026/03/31) (docID S100YHK9)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":79624000,"latestFiling":80852000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":148759000,"latestFiling":150376000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":8332802000,"latestFiling":8405799000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":5652547000,"latestFiling":5644640000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
house-of-rose: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社ハウス　オブ　ローゼ」が EDINET の提出者名「株式会社　ハウス　オブ　ローゼ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記１（連結財務諸表を作成していないため連結の指標を記載していない）、注記２（潜在株式が存在しないため調整後の指標を記載していない）、注記３（関連会社がないため持分法の投資利益を記載していない）、注記４（従業員数は就業人員数であり契約社員を含む）、注記５（株価の市場区分の変遷）は表示・定義事項のため financialNotes には入れず、本警告に記録する。注記６の会計方針の変更に伴う遡及適用は financialNotes に入れた。
- businessModel: 前期有報との照合で第44期（2025年3月期）の当期純利益・利益・総資産・純資産に差異があった点は、注記６のとおり第45期の会計方針の変更に伴う遡及適用後の指標であるためであり、値は今期有報の印字どおりとした。
- businessModel: 目標とする経営指標として営業利益率（2028年3月期に3.1％を目標）が印字されているが、利益指標の目標であるため本文・perspectives には書かず、存在のみ本警告に記録する。
- businessModel: MD&A に印字された売上高以外の利益項目の金額・増減率は本文に書いていない（規則）。セグメント別の金額はセグメント注記の外部顧客への売上高（千円）を百万円に切り捨てて用いた。
- businessModel: 2025年４月に株式会社ビーバイ・イーから「MAMA BUTTER」（ママバター）ブランド事業を譲り受けたことは当事業年度内の事象であり、期末の構造に反映されているため needsReview ではなく事業構造・沿革に記載した。のれんの金額は本文に書いていない。
- businessModel: 重要な後発事象は「該当事項はありません」。提出後の資本政策の決議等も印字されていない。
- businessModel: suppliers は旧スキーマのため省略した。仕入の事実は次のとおり：当社は自社で工場を持たず商品は外部で製造しており、特定店舗では株式会社ワコールから一部商品を仕入れている（関連企業側に記載）。個別の製造委託先名の印字はない。
- businessStructure: セグメント別の金額は、セグメント注記の外部顧客への売上高（千円）を百万円に切り捨てたもので、３事業の合計は売上高11,541百万円と一致する。MD&A の事業別売上高も同じ金額であり、内部売上高は印字されていない。
- businessStructure: suppliers は旧スキーマのため省略した。仕入の事実は businessModel 側の警告に記録した。
- businessStructure: 主要な設備（本社ビル、研修センタービル、横浜物流センター等）は全社共通であり、特定の事業には結びつけていない。
- businessStructure: 子会社４社の個別の名称・事業内容は証拠パックの【関係会社の状況】には印字されておらず（その他の関係会社のみ）、事業構造には含めていない。
- history: 沿革表のうち、商品ラインの発売・リニューアルの各行（1987年の旧ミルキュアライン、1990年の旧薬用美白ＵＶＣスキンケアライン、1993年のカモマイルドライン、1998年のディズニーキャラクター商品、2008年のミルキュアピュア、2009年のマイセンシュア、2010年の「Ｏｈ！Ｂａｂｙ ボディ スムーザー」のリニューアル、2016年のリファイニングホワイト、2018年のエクセラージュ、2022年のアロフローラ、2023年のヘアケアシリーズのリニューアル、2024年のムーミンとの初コラボ）は商品施策であり、history には含めなかった。
- history: 1991年の商品部の移転・物流センターへの改称、2001年の「ロイヤルセブンカスタマー」づくりへの着手、2002年の本社移転、2008年の斉藤牧場とのライセンス契約、2023年の町田物流センター土地・建物の売却・移転は落とした。
- history: 2026年４月のミルキュアピュアの「ミルキュアミー」へのリニューアルは決算日後の商品施策であり、history には含めなかった。
- history: 資本金の金額は history に書いていない（規則）。月のキーは使っていない（規則）。
- industry: 主たる業界は retail（小売）とした。直営店商品販売事業は直営店舗と自社ネット通販による化粧品等の消費者向け販売であり、2026年3月期の外部顧客への売上高8,957百万円は売上高全体の78％を占める。卸販売事業も同じ化粧品の流通であり、直営店サービス事業（1,208百万円）は小規模であるため、副たる業界は付けていない。閉じた分類に化粧品小売の専用区分はないが、小売が直接の当てはめであるため暫定とはしていない。
- relatedCompanies: j-front-retailing、takashimaya、h2o-retailing、isetan-mitsukoshi-holdings、izutsuya、matsuya：特定投資株式として保有するが、保有目的は全銘柄で同一文の定型句（「企業間取引の強化のため」）であり、個別の取引事実の印字もないため結ばない。
- relatedCompanies: kintetsu-department-store、mizuho-financial-group、sumitomo-mitsui-financial-group：当事業年度に全株式を売却しており保有はゼロであるため結ばない。金融２社については主要取引金融機関であることも理由に含まれる。
- relatedCompanies: land（ランド）は本店所在地の住所や「ブランド」の語の部分一致、career（キャリア）は「キャリアアップアンケート」の語、seki（セキ）は「セキュリティ」の部分一致、friendly（フレンドリー）は「４Universal」の理念の語でありコードリストにもなく、port（ポート）は「サポート」の部分一致、base-4481（ベース）は「全店ベース」の語、members（メンバーズ）は「メンバーズシステム」の語、king（キング）は「ワーキンググループ」の部分一致、tokyu（東急）は保養施設「東急ハーベスト」の名称、vision（ビジョン）は「キャリアビジョン」の語、corona（コロナ）は「新型コロナウイルス」の語、en と taya（世田谷区の地名）と tein（プロテインの語）はいずれも一般語・部分一致であり、各社への言及ではないため結ばない。
- relatedCompanies: 株式会社ビーバイ・イーは「MAMA BUTTER」ブランド事業の譲渡元であるが、related-candidates.json の候補にないため関連企業には含めず、本警告に記録する。株式会社ワコール（ワコールホールディングスの子会社）は仕入先であるが候補ではなく、持株会社側の記載で扱った。
- relatedCompanies: 当社の子会社４社は当社グループの会社であるため関連企業には含めていない。【関連情報】によれば、外部顧客への売上高の10％以上を占める顧客はない。
- terms: 助言のみ（この断片では用語を登録しない）: 「ハンドウォッシュ」は直営店の販売手法で、お客様の手を顔に見立て洗顔料等を使用し手に触れながら洗顔方法を伝える当社独自の接客手法を指すため、用語集への追加を提案する。
- terms: 助言のみ: 「素肌みがき」は当社の中期経営計画の軸となる概念で、強みの源泉として位置づけられているため、用語集への追加を提案する。
- terms: 助言のみ: 「４Universal」は for Skin、for Everyone、for Animals、for Earth のサステナビリティの理念を指す当社の商品開発の考え方であるため、用語集への追加を提案する。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
