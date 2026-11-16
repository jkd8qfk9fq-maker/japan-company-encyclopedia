# カーメイト — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カーメイト |
| 証券コード | 7297 |
| docID（データを取り出した文書） | `S100YKN6` |
| 原本 docID | `S100YKN6` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKN6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カーメイト / 7297 / docID S100YKN6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
car-mate-mfg: 10 件の数値を有報XBRLと照合
有報: 株式会社カーメイト 有価証券報告書－第61期(2025/04/01－2026/03/31) (docID S100YKN6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
car-mate-mfg: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの注意について: 組替えは表示方法の変更（前連結会計年度の貸借対照表で「受取手形」に含めていた「電子記録債権」を当期から独立掲記したもの）によるもので、連結経営指標等の数値には影響しません。前期有報との照合でも6系列すべて差異ゼロでした。そのため financialNotes には入れず、この警告に記録しました。
- businessModel: 連結経営指標等の注記（潜在株式がないため希薄化後の1株当たり利益を記載していないこと、前期は純損失のため株価収益率を記載していないこと、従業員数は就業人員であること）はいずれも表示上の事項のため、financialNotes には入れませんでした。
- businessModel: 経営方針に印字された経営目標の数値（売上高経常利益率、自己資本利益率、1株当たり当期純利益金額の目標）は、利益率・投資指標の目標であるため本文にも戦略にも書きませんでした。
- businessModel: MD&Aの利益項目の金額や増減理由、セグメント利益は本文に書いていません（売上高と当期純利益のみ）。
- businessStructure: グループは当社と連結子会社5社（カーメイト物流、CARMATE CAR ACCESSORIES CO., LTD.、快美特汽車精品(深セン)有限公司、Car Mate USA, Inc.、烈卓(上海)貿易有限公司）で構成され、このほかにその他の関係会社として有限会社エム・テイ興産（当社の議決権の46.0％を保有）があります。CARMATE CAR ACCESSORIESと烈卓(上海)貿易は事業活動を実質休止中です。
- businessStructure: 主要な設備の状況では、結城工場・本社・物流センターのセグメント欄に両事業が連記されているため、設備と事業の対応は結びつけませんでした。
- businessStructure: このツリーのスキーマには suppliers キーがないため省略しました。製造は茨城県の結城工場と中国・深センの連結子会社が担い、個別の外部仕入先は印字されていません。
- businessStructure: Wikipedia「カーメイト」が見つかりましたが、冒頭は有報の事実の言い換えにとどまるため使いませんでした。
- history: 本社移転の各行（1968年中野区、1974年新宿区、2004年豊島区への本社と開発本部の統合移転）と、営業拠点の開設・移転の各行（1977年大阪、1981年札幌、1984年福岡、1985年名古屋、1990年仙台、2006年名古屋移転、2007年札幌移転、2010年仙台移転、2012年大阪移転、2022年大阪移転、2025年札幌移転）は落としました。
- history: 結城工場の新設（1976年）、結城物流センターの竣工（1988年）、ISO9001認証取得（1998年）、ISO14001認証取得（2000年）と、2010年の市場再編に伴う上場先の変遷2件（大阪証券取引所への上場、JASDAQ(スタンダード)への移行）は落としました。
- industry: 主たる業界は、売上高の約9割を占める車関連事業（カー用品の製造販売）から automotive としました（直接該当）。
- industry: アウトドア・レジャー・スポーツ関連事業（売上高1,709百万円、スノーボード用品と自転車関連商品）は報告セグメントとして金額が開示されているため、レジャー・スポーツに最も近い entertainment を2つ目に付けました。
- relatedCompanies: アマゾンジャパン合同会社は主要な顧客ごとの情報に2026年3月期の相手先として印字されているが、候補一覧にないため関連会社として登録しなかった。
- relatedCompanies: 有限会社エム・テイ興産は【関係会社の状況】で「その他の関係会社」とされ、当社の議決権の46.0％を保有し、大株主の筆頭（45.94％、2026年3月31日現在）でもあるが、有限会社で候補一覧にないため登録しなかった。
- relatedCompanies: 候補の hotman は、特定投資株式の保有目的が「イエローハットを通じた主要販売企業」という記載と追加取得の理由にとどまり、主要な顧客ごとの情報にも載らないため、結ばなかった。
- relatedCompanies: 候補の buffalo-6676、buffalo、i-a-group は、特定投資株式の保有目的が「オートバックスセブンを通じた主要販売企業」という同一の定型文面であり、個別の取引関係の記載がないため結ばなかった。㈱Ｇ-７ホールディングスも同じ文面だが候補一覧にない。
- relatedCompanies: 候補の mizuho-financial-group と mitsubishi-ufj-financial-group は主力・準主力の取引金融機関としての資金決済・融資の関係であり、結ばなかった。
- relatedCompanies: 候補の marusan-securities は幹事証券としての関係（財務基盤の安定等を目的とする保有）であり、結ばなかった。
- relatedCompanies: 候補の career（ルーフキャリア等の一般語）、land（ブランド名INNO・バイアスロンの部分）、port（サポートの部分一致）、corona（新型コロナウイルスの文脈）、hyper（製品名「ナイトシグナルハイパー」）、ricoh（リコールの一般語）は一般語・部分一致と判断し、結ばなかった。
- relatedCompanies: 候補の en、seki、go、zero は曖昧な照合であり、結ばなかった。候補の base-4481 は「連結会社ベース」等の一般語の一致であり、結ばなかった。候補の alpha-4760、alpha はトヨタ車「アルファード」の車名の一致であり、結ばなかった。
- relatedCompanies: 候補の tryt は現在のEDINETコードリストに証券コード付きで載っていないため、結ばなかった。
- relatedCompanies: 連結子会社5社（カーメイト物流、CARMATE CAR ACCESSORIES CO., LTD.、快美特汽車精品(深セン)有限公司、Car Mate USA, Inc.、烈卓(上海)貿易有限公司）は当社の子会社であり、リンクしない。
- terms: 用語の同定のみを助言し、定義は書いていない。事業の理解に資する固有の用語として、INNO（ルーフキャリア等のブランド）、バイアスロン（非金属タイヤチェーンのブランド）、FLUX（スノーボード関連用品のブランド）、チャイルドシート、ドライブレコーダー、リモコンエンジンスターターが印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
