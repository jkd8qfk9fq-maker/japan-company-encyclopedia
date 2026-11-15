# サガミホールディングス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サガミホールディングス |
| 証券コード | 9900 |
| docID（データを取り出した文書） | `S100YGZJ` |
| 原本 docID | `S100YGZJ` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGZJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サガミホールディングス / 9900 / docID S100YGZJ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sagami-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社サガミホールディングス 有価証券報告書－第56期(2025/04/01－2026/03/31) (docID S100YGZJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sagami-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。変則決算・決算期変更は無く、前期の有報との修正再表示チェックは全項目で一致し、注記すべき事実が無いためである。
- businessModel: 2027年3月期の経営目標のうち、店舗数と売上高だけを strategy に引用した。目標に含まれるその他の数値は文章に引用していない。
- businessModel: suppliers の「仕入先」は、事業等のリスクの節で会社が仕入れについて使う一般名詞であり、複数の仕入れルートの確保と仕入先との連携強化の記載に基づく。仕入先の個別の社名は印字されていないため書いていない。
- businessModel: 金額の表記はMD&Aの印字どおり百万円単位を用いた（売上高39,359百万円、当期純利益1,618百万円、部門別売上高も同じ）。
- businessStructure: 報告セグメントは「外食事業」のみ（単一セグメント）。【事業の内容】の事業部門（和食麺処サガミ部門・味の民芸部門・どんどん庵部門・その他部門）を外食事業の children とし、【事業の内容】で別区分とされる「その他の事業」（子会社等の経営管理・不動産賃貸）を第2の最上位事業とした。
- businessStructure: 部門の並び順は2026年3月期の販売実績（事業部門別の売上高）の大きい順。和食麺処サガミ部門28,409百万円、味の民芸部門7,778百万円、その他の部門2,067百万円、どんどん庵部門1,024百万円、その他の事業79百万円。セグメント注記には部門別の外部売上高の開示が無いため、MD&Aの販売実績・事業部門別概況の印字額を用いた。これらは部門合計が連結売上高39,359百万円と一致する外部向けの販売高である。
- businessStructure: 部門別販売高の千円表の合計（39,359,935千円）と連結売上高の印字（39,359,936千円）には1千円の差があるが、印字の合計をそのまま用いた。
- businessStructure: 店舗数はMD&Aの事業部門別概況の当期末の印字値（和食麺処サガミ166店舗、味の民芸はフランチャイズ店舗を含み50店舗、どんどん庵はフランチャイズ店舗を含み28店舗、その他の部門はフランチャイズ店舗を含み国内20店舗・海外10店舗）。
- history: 沿革の冒頭の説明どおり、当社は1978年設立の株式会社どんどん庵が前身で、主たる営業活動は1970年設立のサガミチェーン株式会社（後の株式会社キャッスルサガミ）で行われていたため、1970年以降の主な出来事を選んだ。
- history: 資本金などの金額は沿革には書いていない。月の情報は year のみに落とし、本文にも月は書いていない。
- industry: 主たる業界は、唯一の報告セグメントである外食事業（飲食店の運営）について、閉じた分類の中で最も近い food を暫定で選んだ。
- relatedCompanies: land（ランド）: 結ばない。本文中の「レゴランド」や「ブランド」等の一般語の断片一致で、同社について取引・提携・資本関係の記述はない。
- relatedCompanies: no-1（No.1）: 結ばない。グループビジョン「No.1 Noodle Restaurant Company」の語の一致で、同社への言及ではない。
- relatedCompanies: career（キャリア）: 結ばない。「キャリア研修」の語の一致で、同社への言及ではない。
- relatedCompanies: en（エン）: 結ばない。ambiguous の相手で、「従業員エンゲージメント」等の語の一致。同社への言及ではない。
- relatedCompanies: ishin（イシン）: 結ばない。気候変動のリスクの文章中の一般語の断片一致で、同社について取引・提携・資本関係の記述はない。
- relatedCompanies: port（ポート）: 結ばない。連結子会社名「サガミマネジメントサポート」等の「サポート」の断片一致で、同社への言及ではない。
- relatedCompanies: vision（ビジョン）: 結ばない。「グループビジョン」の語の一致で、同社への言及ではない。
- relatedCompanies: the-lead（リード）: 結ばない。一般語の断片一致で、同社について取引・提携・資本関係の記述はない。
- relatedCompanies: base-4481（ベース）: 結ばない。「連結ベース」の語の一致で、同社への言及ではない。
- relatedCompanies: dai-ichi-life-holdings（第一ライフグループ）: 結ばない。特定投資株式に載るが、保有目的は他の銘柄と同一の定型的な文言のみで、同社について個別の取引の内容は印字されていない。保険会社であり、その文言だけでは結ばない。
- relatedCompanies: seki（セキ）: 結ばない。ambiguous の相手で、「情報セキュリティ」の語の断片一致。同社への言及ではない。
- relatedCompanies: aichi-financial-group（あいちフィナンシャルグループ）: 結ばない。特定投資株式の保有目的は財務・経理に係る業務の円滑な推進であり、金融取引を理由とする保有のため結ばない。なお大株主に載るのは子会社の株式会社あいち銀行であり、別法人である。
- relatedCompanies: freee（フリー）: 結ばない。「リスクフリー・レート」の語の一致で、同社への言及ではない。
- relatedCompanies: hamayuu（浜木綿）: 結ばない。沿革に1999年の資本参加の記載があるだけで、現在の関係会社の区分・大株主・特定投資株式のいずれにも載っておらず、現在の関係を示す記載がない。
- relatedCompanies: misonoza-theatrical（御園座）: 結ばない。MD&Aの販売促進の「御園座企画」という企画名の言及のみで、同社について取引・提携・資本関係の記述はない。
- relatedCompanies: mitsuuroko-group-holdings（ミツウロコグループホールディングス）: 結ばない。特定投資株式に載るが、保有目的は他の銘柄と同一の定型的な文言のみで、同社について個別の取引の内容は印字されていない。
- relatedCompanies: nichirei（ニチレイ）: 結ばない。特定投資株式に載るが、保有目的は他の銘柄と同一の定型的な文言のみで、同社について個別の取引の内容は印字されていない。
- relatedCompanies: palma（パルマ）: 結ばない。海外店舗の所在地である地名「パルマ」の一致で、同社への言及ではない。
- relatedCompanies: path（パス）: 結ばない。ambiguous の相手で、「バイパス」等の一般語の断片一致。同社への言及ではない。
- relatedCompanies: riken-vitamin（理研ビタミン）: 結ばない。特定投資株式に載るが、保有目的は他の銘柄と同一の定型的な文言のみで、同社について個別の取引の内容は印字されていない。
- relatedCompanies: step（ステップ）: 結ばない。「ステップアップクーポン」の語の一致で、同社への言及ではない。
- relatedCompanies: takashima-and-co（高島）: 結ばない。ambiguous の相手で、沿革の「高島屋」（出店先の百貨店名）の断片一致。同社への言及ではない。
- relatedCompanies: toei（東映）: 結ばない。ambiguous の相手で、MD&Aの映画とのコラボレーション企画（1回限りの企画）の言及のみで、継続的な提携や取引の記述はない。
- relatedCompanies: trust（トラスト）: 結ばない。コードリストにない相手で、大株主に載る信託銀行の信託口（純投資の保有）の名称の断片一致である。
- relatedCompanies: will（ウィル）: 結ばない。「コンピュータウィルス」の語の断片一致で、同社への言及ではない。
- relatedCompanies: 大株主に載るアサヒビール株式会社は上場会社の候補に無く（上場しているのは親会社である）、株式会社あいち銀行と株式会社昭和は候補に無いため結ばない。信託銀行の信託口、従業員持株会、外国銀行の純投資の保有も結ばない。
- relatedCompanies: 特定投資株式は6銘柄あるが、あいちフィナンシャルグループを除く5銘柄は保有目的の文言が全銘柄で同一の定型文であり、それだけを根拠には結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言のみ。定義は本文の記載に基づく一般的な説明である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] サガミホールディングスの主事業（飲食店の運営） → 提案: restaurants（外食・飲食店）。主事業は飲食店の運営であり、食品の製造・販売を指す food とは業態が異なるため
