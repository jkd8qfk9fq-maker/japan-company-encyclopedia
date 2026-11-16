# 日本精密 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本精密株式会社 |
| 証券コード | 7771 |
| docID（データを取り出した文書） | `S100YKSP` |
| 原本 docID | `S100YKSP` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKSP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本精密株式会社 / 7771 / docID S100YKSP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nihon-seimitsu: 10 件の数値を有報XBRLと照合
有報: 日本精密株式会社 有価証券報告書－第48期(2025/04/01－2026/03/31) (docID S100YKSP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nihon-seimitsu: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記は、潜在株式が存在しないため潜在株式調整後１株当たり当期純利益を記載していない旨と、従業員数は就業人員数である旨の２件のみであり、いずれも表示事項のためfinancialNoteにはせずwarnings扱いとした。
- businessModel: セグメント情報の外部顧客への売上高（千円）を百万円に切り捨てた内訳の合計は7,894百万円で、印字された合計7,895百万円と１百万円異なる。有報の印字どおり合計を引用し、差異をここに記録した。
- businessModel: MD&Aに印字された利益の金額や増減の理由は本文に書いていない（売上高と当期純利益のみ記載）。受注実績の金額も記載していない。
- businessModel: 2026年３月６日付の第三者割当増資による資金調達（2億円）とタームローンの期限前弁済は、期中の資本政策・財務基盤に関する事項であり、期末の事業構造の変更ではないため、needsReviewにはせずwarnings扱いとした。金額は本文に書いていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」。継続企業の前提に関する注記も連結・個別とも「該当事項はありません」で、事業等のリスクにも継続企業の前提に関する重要事象等の記載はなかった。
- businessModel: 株式の分割・併合の記載は主要な経営指標等の注記になく、needsReview事項はない。
- businessModel: 連結子会社の株式会社村井の損益情報等（売上高が連結売上高の10％超）は子会社の数値であり、当社グループの本文数値としては使っていない。
- businessModel: Wikipediaの記事（証券コードで同一性確認済み）は見つかったが、冒頭の記述は有報の事実の言い換えにとどまり、有報にない補足はなかったため使わなかった。
- businessStructure: 報告セグメントは「時計関連」「メガネフレーム」「釣具・応用品」の３つで、セグメント注記の外部顧客への売上高を用いた。MD&Aの販売実績も同額であることを確認した。
- businessStructure: セグメントごとの外部売上高（千円を百万円に切り捨て）の合計は7,894百万円となり、印字された連結売上高7,895百万円と１百万円異なる（印字のまま記載）。
- businessStructure: suppliersは旧スキーマのため省略した。製造は主に連結子会社のNISSEY VIETNAM CO.,LTD.とNISSEY CAMBODIA CO.,LTD.が担う事実は各事業の説明に記載した。
- businessStructure: 休眠会社のNISSEY(HONG KONG)LIMITEDは事業を行っていないため、事業区分には含めていない。
- history: 沿革のうち、本社移転（1985年・1995年）、NISSEY VIETNAMのISO9001認証取得と新工場竣工（2000年）、秩父工場の操業停止（2000年）・杉戸工場の閉鎖（2001年）、NISSEY(HONG KONG)LIMITEDの設立（2001年）と営業譲受（2004年）、株式会社シーテックの連結子会社化（2001年）と解散（2005年）、株式会社エムアンドエフシーとの業務提携（2007年）、欧州向けOEMフレームの開始（1995年）、RADO向け高級バンドの開始（1995年・1997年）、電子ロックの開始（1988年）、市場統合に伴う上場市場の変遷（2010年・2013年）は、構造上の転機ではないため落とし、ここに列挙した。資本金の金額は記載していない。
- history: 1978年の設立とカシオ計算機向け製造開始、1994年の吸収合併・メガネフレーム開始とベトナム子会社設立は、同一年の複数行を１項目にまとめた（年キー形式のため）。月は記載していない。
- industry: 主たる業界はelectronicsとした。当社は時計バンド・時計外装部品の製造販売が外部売上高の過半（時計関連5,878百万円／全体7,895百万円）を占める時計部品メーカーであり、本百科事典では時計メーカー（カシオ計算機、シチズン時計、セイコーグループ）がelectronicsを主分類とする先例に倣った。釣具・応用品とメガネフレームは副次的事業であり、副分類は付けていない。
- industry: 分類に不足はなく、taxonomyGapsは記録していない。w14のin-tree TSVにも当社の行はない。
- relatedCompanies: citizen-watch（シチズン時計）: 沿革に1980年の製造・販売開始の記載があるのみで、当期の取引を個別に示す記載（主要な顧客ごとの情報等）はないため、結ばなかった。
- relatedCompanies: CASIO COMPUTER(HK) LTD.は主要な顧客ごとの情報に記載されたカシオ計算機のグループ会社であり、候補のカシオ計算機株式会社とは別法人であるため、結ばなかった（事実は販売先の広がりとしてbusinessModelに集約）。
- relatedCompanies: GNCO CO.,LTD.（KOSDAQ上場）は【関係会社の状況】で「その他の関係会社」として当社の議決権の21.12％を保有する旨が記載されているが、related-candidatesに含まれない海外法人のため結ばず、ここに記録した。
- relatedCompanies: the-gunma-bank（群馬銀行）・the-musashino-bank（武蔵野銀行）: シンジケートローン契約の貸付機関名の一覧に現れるのみで、個別の関係の記述はないため、結ばなかった。
- relatedCompanies: land（ブランド）、base-4481（連結ベース）、career／path（キャリアパス）、aeon（イオンプレーティング）、en（エンジニアリング）、like（ダイヤモンドライクカーボン）、slogan（コーポレートスローガン）、space（職務スペース）、will（コンピューターウィルス）、zero（実質ゼロ）はいずれも一般語・部分一致による機械抽出であり、相手そのものへの取引・提携・資本関係の記述はないため、結ばなかった。
- relatedCompanies: 当社の連結子会社（NISSEY VIETNAM CO.,LTD.、NISSEY CAMBODIA CO.,LTD.、株式会社村井、エヌエスジー株式会社、休眠会社のNISSEY(HONG KONG)LIMITED）と持分法適用の関連会社（NS Murai Inc.、モンドティカジャパン株式会社）は、自社グループのため関連企業には含めていない。
- terms: 助言のみ。用語候補: 「イオンプレーティング加工」（真空中で金属をイオン化して製品表面に被膜を形成する表面処理で、当社は時計等装飾品に適用）、「超硬セラミックス」（タングステンカーバイト等の硬質素材で、当社が業界初の時計バンド素材として採用）、「ベゼル」（時計の文字盤周囲を固定する枠部品で、時計外装部品の一つ）、「静電気除去器」（釣具・応用品事業で製造販売する、静電気を取り除く機器）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
