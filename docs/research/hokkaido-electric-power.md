# 北海道電力 — research log

Registered: 2026-11-19（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 北海道電力株式会社 |
| 証券コード | 9509 |
| docID（データを取り出した文書） | `S100YDWY` |
| 原本 docID | `S100YDWY` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-17 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDWY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 1 | 北海道電力株式会社 / 9509 / docID S100YDWY |
| edinet | completed | 1 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
hokkaido-electric-power: 10 件の数値を有報XBRLと照合
有報: 北海道電力株式会社 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YDWY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hokkaido-electric-power: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 連結財務諸表の注記（表示方法の変更）に、営業外収益の内訳と連結キャッシュ・フロー計算書の表示区分の変更に伴う前連結会計年度の財務諸表の組替えが記載されているが、売上高と親会社株主に帰属する当期純利益には影響せず、前期有報との重複年度の数値も全て一致しているため、financialNotes には入れなかった。
- businessModel: 「ほくでんグループ経営ビジョン2035」の経営目標として印字された連結の利益水準や資本効率に関する目標数値は、本文と perspectives のいずれにも書かなかった。
- businessModel: セグメント別の売上高は、MD&Aに消去前の数値が印字されているため使わず、セグメント注記の外部顧客への売上高を用いた。
- businessModel: 継続企業の前提に関する注記はなく、重要な契約等は「該当事項なし」と印字されている。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした（北海道電力677,591百万円、北海道電力ネットワーク140,521百万円、その他37,870百万円。合計855,983百万円で連結売上高と一致）。MD&Aのセグメント別売上高は内部取引消去前の数値のため使っていない。
- businessStructure: 「その他」は、有報が報告セグメントに含まれない事業セグメントと明記している区分のため、売上順でも最後に置いた。
- businessStructure: 上場市場は表紙の印字どおり東京証券取引所プライム市場と札幌証券取引所とした。札幌証券取引所には市場区分の印字がないため market は付けていない。
- history: 沿革には子会社の設立・商号変更・合併が多数印字されているが、会社本体の歩みとして重要な設立・上場・送配電事業の分離に絞った。落とした行はすべて連結子会社等の設立・再編に関するものである。
- history: 沿革の年月は印字どおり年だけを year に用い、月は書いていない。
- industry: 主たる業界は、外部顧客への売上高の大半を占める電気事業（北海道電力セグメントと北海道電力ネットワークセグメントの合計が連結売上高の約96％）から energy とした。閉じた分類に直接合う区分があるため暫定にはしていない。
- industry: 「その他」に含まれる電気通信事業や土木・建築工事などは、金額が独立して開示されていないため副次的な業界は付けなかった。
- relatedCompanies: the-japan-steel-works（日本製鋼所）は、特定投資株式の保有目的に原子力部材の製造・供給を担うことが具体的に印字され、株式数も250,400株と読み取れるため supplier として結んだ。説明に計上額は書いていない。
- relatedCompanies: hokkaidenko（北海電工）は連結子会社（議決権の所有割合55.80％）であり、自社の子会社は関連企業として結ばないため、businessStructure の事業説明に含める扱いとした。
- relatedCompanies: north-pacific-bank（北洋銀行）は大株主の状況に載る金融機関（発行済株式の総数に対する所有株式数の割合4.96％、2026年3月31日現在）で、当社が保有する同行株式の目的も大口の借入先としての資金調達であるため、資金調達を理由とする金融機関として結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱ＵＦＪフィナンシャル・グループ）は、特定投資株式の保有目的が大口の借入先としての資金調達という定型の文言のため結ばなかった。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ）は、特定投資株式の保有目的が大口の借入先としての資金調達という定型の文言のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）は、特定投資株式の保有目的が大口の借入先としての資金調達という定型の文言のため結ばなかった。
- relatedCompanies: hokuhoku-financial-group（ほくほくフィナンシャルグループ）は、特定投資株式の保有目的が大口の借入先としての資金調達という定型の文言のため結ばなかった。
- relatedCompanies: en（エン）、port（ポート）、vision（ビジョン）、career（キャリア）、core（コア）、base-4481（ベース）、lec（レック）、no-1（No．1）、path（パス）、rent（レント）、seki（セキ）、suzuki-6785（鈴木）、ishin（イシン）、zero（ゼロ）はいずれも一般的な語句や人名の部分一致による誤検出で、各社自体への言及がないため結ばなかった。
- relatedCompanies: trust（トラスト）は日本マスタートラスト信託銀行（信託口）の誤検出で、コードリストにもないため結ばなかった。信託銀行の信託口は純投資のため、いずれにしても結ばない。
- relatedCompanies: nissin（日新）はコードリストになく、一致箇所も同社への言及ではないため結ばなかった。
- relatedCompanies: 日本原燃株式会社とＲａｐｉｄｕｓ株式会社は株式の保有状況に保有理由が印字されているが、関連候補リストに無く非上場のため結ばなかった。
- terms: 助言のみ。用語としては「託送」「一般送配電事業」「燃料費等調整制度」「発受電電力量」などが候補だが、本工程ではデータを持たない。

## 要確認（status に反映）

- businessModel: 泊発電所3号機については、2027年のできるだけ早期の再稼働に向け、設計及び工事の計画の認可や保安規定変更認可の審査、使用前事業者検査、防潮堤等の安全対策工事に取り組んでいる旨が記載されています。再稼働は提出日時点で実現しておらず、本登録は2026年3月31日現在の体制に基づいています。
- businessModel: 主要な設備の除却等の計画として、奈井江発電所1・2号機と砂川発電所3・4号機を2027年3月に廃止する予定であること、音別発電所1・2号機は廃止予定（時期は未定）であることが記載されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
