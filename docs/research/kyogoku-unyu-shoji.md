# 京極運輸商事 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 京極運輸商事株式会社 |
| 証券コード | 9073 |
| docID（データを取り出した文書） | `S100YGY5` |
| 原本 docID | `S100YGY5` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGY5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 京極運輸商事株式会社 / 9073 / docID S100YGY5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kyogoku-unyu-shoji: 10 件の数値を有報XBRLと照合
有報: 京極運輸商事株式会社 有価証券報告書－第86期(2025/04/01－2026/03/31) (docID S100YGY5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kyogoku-unyu-shoji: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全6系列で差異ゼロ（照合8行）であり、訂正有価証券報告書も存在しない（amendments status none、2026-11-12時点）ため、訂正に関する financialNotes は入れていない。
- businessModel: 連結経営指標等の注1（潜在株式調整後1株当たり当期純利益を記載していない理由）及び注2（従業員数の定義）はいずれも表示事項のため、financialNotesには入れず本警告のみとした。注3の税効果会計基準の適用は financialNotes に入れた。
- businessModel: セグメント情報の外部顧客への売上高（千円）を百万円未満切り捨てで並べると、国内輸送3,960百万円、ドラム缶・ペール缶2,461百万円、エネルギー959百万円、タンク洗浄689百万円、国際物流631百万円の合計は8,700百万円となり、印字された連結売上高8,702百万円と2百万円の差がある。切り捨てによる差異であり、印字どおりとした。
- businessModel: 目標とする経営指標及び中期経営計画の数値目標（営業利益・ROE等の目標値と実績値）は投資・利益の指標のため、本文と perspectives には書かず、定性的な施策のみを strategy に要約した。
- businessModel: 財務諸表注記の重要な後発事象に当たる本文は証拠パックの本文ファイルに見当たらず、提出後の構造変更の記載もないため、needsReview には入れていない。
- businessModel: Wikipedia（証券コードで同一性確認済み）の冒頭は本店所在地とENEOSグループとの関係を述べるのみで、有報にない補足がないため使わなかった。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順（国内輸送3,960百万円、ドラム缶・ペール缶2,461百万円、エネルギー959百万円、タンク洗浄689百万円、国際物流631百万円）とした。
- businessStructure: エネルギー事業について、MD&A及び関係会社の状況にある京極石油株式会社の売上高1,185,749千円はセグメント間の内部売上高を含む数値のため使わず、セグメント情報の外部顧客への売上高959,844千円（959百万円）を用いた。
- businessStructure: suppliers は旧スキーマのため省略した。仕入先として個別に印字された会社はない。
- history: 1891年の創業は【沿革】ではなく【経営方針、経営環境及び対処すべき課題等】の基本方針の印字に基づく（京極家9代目「京極高通」が創業）。【沿革】の先頭は1947年の株式会社京極社の設立である。
- history: 落とした沿革行（理由: 事業所の開設・廃止、本社の移転、現在の構造につながらない子会社の設立・譲渡・出資等）: 1961年市川支店開設、1962年五井営業所開設、1971年サンドラムサービス株式会社（現・日本容器株式会社、2008年に株式譲渡）の設立、1973年小樽事業所開設、1976年鹿島事業所開設、1979年蔵王事業所開設、1981年京浜京極運送株式会社の設立と中津事業所開設、1986年大阪事業所開設、1987年苫小牧事業所開設、1988年株式会社泉州配送センターの子会社化（1993年に株式譲渡）と倉敷・富士事業所の開設、1996年有限会社本町ビルへの出資（1999年に売却）、1999年関西営業部開設、2004年有限会社京極トランスポートサービスの設立と白井事業所の設立、2006年本社移転。
- history: 資本金の金額は沿革・履歴のいずれにも書いていない。
- industry: 主たる業界は transportation とした。国内輸送事業（外部顧客への売上高3,960百万円）と国際物流事業（同631百万円）は貨物運送・港湾荷役・倉庫保管そのものであり、ドラム缶・ペール缶事業とタンク洗浄事業も物流に付随する事業であるため、直接適合する。暫定値ではないため taxonomyGaps には記録していない。
- industry: 副業界として、エネルギー事業（石油製品類の販売、外部顧客への売上高959百万円）には energy を直接適合として付けた。
- relatedCompanies: eneos-holdings（ENEOSホールディングス）: 関係会社の状況の「その他の関係会社」の記載（議決権の被所有割合34.96％、2026年3月31日現在）、関連情報の主要な顧客（同社子会社のENEOS株式会社）の記載に基づき結んだ。関係の種類は有報自身の分類に合わせた。
- relatedCompanies: jfe-holdings、mitsubishi-chemical-group、mitsubishi-gas-chemical、fuji-united-holdings、carlit、new-japan-chemical、nippon-gas: 特定投資株式として保有するが、保有目的は全銘柄共通の定型文（「当社事業の顧客であり、長期的・安定的な取引関係の維持を目的に保有しております。」）のみで、個別の取引の記載がないため結ばなかった（日本瓦斯については保有目的の印字自体がない）。
- relatedCompanies: mitsubishi-ufj-financial-group、mizuho-financial-group、yokohama-financial-group: 特定投資株式の保有目的は主要な取引金融機関であること（横浜フィナンシャルグループは子会社の横浜銀行との関係）に関するもので、資金調達の関係のため結ばなかった。
- relatedCompanies: maruwn（丸運）: 特定投資株式として保有していたが、2026年3月12日付で全株式を売却済みである。また現在のEDINETコードリストにないため結ばなかった。
- relatedCompanies: isuzu-motors（いすゞ自動車）: 大株主の状況に記載があるのは同社ではなく、いすゞ自動車首都圏株式会社（別の法人）であり、同社への言及はないため結ばなかった。
- relatedCompanies: step（ステップ）: 収益認識に関する「5ステップ」の語句との一致であり、会社への言及ではないため結ばなかった。
- relatedCompanies: suzuki-6785（鈴木）: 役員の氏名「鈴木秀樹」との一致であり、曖昧な一致のため結ばなかった。
- relatedCompanies: base-4481（ベース）: 「営業利益ベース」の語句との一致であり、会社への言及ではないため結ばなかった。
- relatedCompanies: career（キャリア）: 人材戦略の「キャリア形成」の語句との一致であり、会社への言及ではないため結ばなかった。
- relatedCompanies: port（ポート）: 「京極トランスポートサービス」の名称との一致であり、会社への言及ではないため結ばなかった。
- relatedCompanies: en（エン）: 「エンゲージメント」の語句との一致であり、曖昧な一致のため結ばなかった。
- relatedCompanies: path（パス）: 「キャリアパス」の語句との一致であり、曖昧な一致のため結ばなかった。
- relatedCompanies: rent（レント）: 「タレントマネジメント」の語句との一致であり、会社への言及ではないため結ばなかった。
- relatedCompanies: seki（セキ）: 「セキュリティ」の語句との一致であり、曖昧な一致のため結ばなかった。
- relatedCompanies: taya（田谷）: 設備の所在地等の記載との一致であり、曖昧な一致のため結ばなかった。
- relatedCompanies: 連結子会社2社（京極石油株式会社、日本タンクサービス株式会社）と持分法適用関連会社1社（株式会社弥生京極社）は自社のグループ会社であるため結んでいない。ENEOS株式会社は非上場で候補にないため結んでいない（主要な顧客である旨は eneos-holdings の説明に記載した）。
- terms: 用語の助言: 「更生缶」は、使用済みのドラム缶を洗浄・整形して再利用できるようにした再生ドラム缶を指します。「はい替え」は、倉庫で保管貨物を積み替える作業を指します。「構内作業」は、顧客の工場・施設の構内で行う荷役等の作業を指します。「特約店」は、石油元売会社の販売店として製品を供給する契約店舗を指します。「上屋」は、港湾で貨物を一時保管する倉庫建物を指します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
