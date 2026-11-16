# イサム塗料 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | イサム塗料株式会社 |
| 証券コード | 4624 |
| docID（データを取り出した文書） | `S100YJCY` |
| 原本 docID | `S100YJCY` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJCY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | イサム塗料株式会社 / 4624 / docID S100YJCY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
isamu-paint: 10 件の数値を有報XBRLと照合
有報: イサム塗料株式会社 有価証券報告書－第80期(2025/04/01－2026/03/31) (docID S100YJCY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
isamu-paint: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは空とした。主要な経営指標等の注記は、潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していないという表示事項のみで、会計基準の変更・遡及適用・変則決算はない。
- businessModel: 特定投資株式の表にあるショーボンドホールディングス株式の増加理由「株式分割により株式数増加」は、保有先企業の株式分割であり、当社自身の分割ではないため、needsReviewには入れず、ここに記録する。
- businessModel: MD&Aに印字された売上高以外の利益段階の金額と増減率の理由は、本文の財務数値の規則に従い書かなかった。売上高の増減率はMD&Aの印字（3.0％増加）を、純利益の増減率もMD&Aの印字（37.6％増加）を用いた。
- businessModel: Wikipediaの記事は証券コードで同一性を確認したが、冒頭文は創業年と本社所在地のみで、有報に書かれていない補足がないため使用しなかった。
- businessStructure: 報告セグメントは塗料事業のみで、「その他」（不動産賃貸業）は有報が報告セグメントに含まれないと明記する区分のため、順序は最後に置いた。金額はセグメント注記の外部顧客への売上高（千円印字を百万円に切り捨て）で、塗料事業8,300百万円、その他102百万円、合計8,402百万円と連結売上高に一致する。
- businessStructure: 製品及びサービスごとの情報は、塗料事業の外部顧客への売上高が連結売上高の90％を超えるため有報で開示が省略されている。分野別の金額は印字されていないため、子区分には金額を書かなかった。
- businessStructure: 主要な設備は、施設表のセグメント欄どおり滋賀工場・各支店・出張所がすべて塗料事業に属し（本社は設備の内容が「その他設備」だがセグメント欄は塗料事業）、イサム土地建物株式会社の賃貸不動産がその他に属するとして扱った。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。原材料の仕入先は有報に個別の社名が印字されていない。
- history: 沿革から省いた出来事: 1948年大阪市福島区への工場建設、1955年名古屋出張所の設置、1956年本社の移転、1958年九州工場竣工、1959年東京工場竣工、1962年名古屋工場竣工、1965年旧滋賀工場竣工、1966年大阪工場竣工、1972年仙台出張所の設置、1977年イサムモータープール株式会社の設立（現・非連結子会社）、1978年中国出張所の設置、1990年九州工場の移転・旧工場の廃止、1991年横浜・札幌出張所の設置、1996年大阪証券取引所市場第二部への指定変更と各工場の支店への改称、2004年東京支店の移転・横浜出張所の廃止、2009年仙台出張所の移転・札幌駐在所への改称、2009年進勇商事株式会社の移転。これらは拠点の開設・移転や呼称変更であり、事業の転機ではないため省いた。
- history: 沿革の年月は年だけを登録し、月は書いていない。
- industry: 主たる業界は、売上の大半を占める報告セグメントである塗料事業（化学製品の製造販売）のため chemicals とした。
- industry: 不動産賃貸業は報告セグメントに含まれない「その他」区分で売上構成も小さいため、real-estate は付けなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「ベースコート」など製品名の部分一致のみで、ベース株式会社への言及はないため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「経営ビジョン」という一般語の部分一致のみのため結ばなかった。
- relatedCompanies: axell（株式会社アクセル）: 製品名「アクセルクリヤー」の部分一致のみのため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 「新型コロナウイルス」の部分一致のみのため結ばなかった。
- relatedCompanies: konishi（コニシ株式会社）、kikusui-chemical-industries（菊水化学工業株式会社）、harima-chemicals-group（ハリマ化成グループ株式会社）、sho-bond-holdings（ショーボンドホールディングス株式会社）: 特定投資株式として保有するが、保有目的は全銘柄共通の定型句「営業上の取引関係の維持・強化」のみで、個別の取引事実が印字されていないため結ばなかった。
- relatedCompanies: daicel（株式会社ダイセル）、ishihara-sangyo-kaisha（石原産業株式会社）、japan-airlines（日本航空株式会社）: 前事業年度までの特定投資株式で、当事業年度は政策保有目的から純投資目的に変更され、保有株式数がゼロになっているため結ばなかった。
- relatedCompanies: daiwa-securities-group（株式会社大和証券グループ本社）、mitsubishi-ufj-financial-group、mizuho-financial-group、sumitomo-mitsui-financial-group、ms-and-ad-insurance-group-holdings: 金融機関で、保有目的は金融取引関係の維持・強化の定型句のみ、かつ当事業年度は純投資目的に変更され保有がゼロになっているため結ばなかった。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 大株主の状況に印字されているのは「光通信ＫＫ投資事業有限責任組合」という投資事業有限責任組合であり、株式会社光通信とは別の法的主体のため結ばなかった。
- relatedCompanies: japan-securities-finance（日本証券金融株式会社）: 大株主の状況に3.71％で載るが、証券金融会社であり純投資と判断し結ばなかった。
- relatedCompanies: 長瀬産業株式会社は、特定投資株式としての保有目的は定型句のみだが、大株主の状況に事業会社として載るため、major-shareholder として結んだ。
- terms: 助言: 「特化則」は特定化学物質障害予防規則の略で、特定の化学物質による健康障害を防ぐための労働安全衛生の規則です。同社は対応した塗料製品を展開しています。
- terms: 助言: 「PRTR法」は、化学物質の排出量や移動量を把握して届け出る制度を定めた法律です。同社は対応した塗料製品を展開しています。
- terms: 助言: 「ハイソリッド塗料」は、溶剤の割合を減らし、塗料の固形分（樹脂など）の割合を高めた塗料で、環境負荷の低減につながります。
- terms: 助言: 「光触媒塗料」は、光のエネルギーを利用する光触媒の働きで、抗ウイルス・抗菌・消臭などの機能を持たせた塗料です。
- terms: 助言: 「エアゾール製品」は、原液と噴射剤を缶に封入し、霧状に噴射して使うスプレー製品です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
