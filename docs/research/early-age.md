# アールエイジ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アールエイジ |
| 証券コード | 3248 |
| docID（データを取り出した文書） | `S100XH8O` |
| 原本 docID | `S100XH8O` |
| 提出日（原本） | 2026-01-23 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XH8O.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アールエイジ / 3248 / docID S100XH8O（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
early-age: 10 件の数値を有報XBRLと照合
有報: 株式会社アールエイジ 有価証券報告書－第39期(2024/11/01－2025/10/31) (docID S100XH8O)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
early-age: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は売上高と親会社株主に帰属する当期純利益だけにした。MD&Aやセグメント注記に印字された段階利益の金額や増減率は書いていない。
- businessModel: 売上高の増減率はMD&Aの印字（前期比30.4％減）を使った。セグメント別の売上高はセグメント注記の外部顧客への売上高（千円印字を百万円に切り捨て）を使った。
- businessModel: 前期の大型物件売却の反動で売上高が減ったことはMD&Aに印字されているが、開発販売事業の売上高の前期比の減少としてbusinessStructure側の数値の範囲で説明し、段階利益には触れていない。
- businessModel: 経営方針に印字された経営上の目標の指標は投資・利益率に関する指標のため、本文と戦略には書かず、定性的な方針だけをstrategyに要約した。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されており、needsReviewには入れていない。株式の保有状況も「該当事項はありません」で、特定投資株式はない。
- businessModel: 前期有報との再表示チェックは全系列で差異ゼロだったため、その旨のfinancialNoteは作っていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（運営管理事業2,880,482千円、開発販売事業409,440千円）とした。切り捨て後の合計（2,880＋409＝3,289百万円）は印字の連結売上高3,289百万円と一致する。
- businessStructure: MD&Aのセグメント売上高のうち前期の運営管理事業の数値はセグメント間の内部売上高を含むため使わず、セグメント注記の外部顧客への売上高を使った。セグメント利益は書いていない。
- businessStructure: 自社所有物件（東京都内及び千葉県内）は運営管理事業の設備として印字されている。帳簿価額は書いていない。本社・船橋店・高円寺店は複数事業に関わるため特定の事業には結びつけなかった。
- businessStructure: suppliersキーはこのツリーの旧スキーマのため付けていない。仕入先・外注先の固有名は有報に印字されていない。
- businessStructure: 親会社は株式会社ＢＨＡＧコーポレーション（議決権の所有割合50.24％、2025年10月31日現在）で、連結子会社は株式会社アールエイジ・テクニカル・サービス（同100％）の1社である。いずれも自社グループの関係会社として本文には書かず、関連企業の判断はrelatedCompaniesに記録した。
- businessStructure: Wikipediaのパックは企業一覧の記事で同社固有の記事ではなかったため、補足には使わなかった。
- history: 沿革は年月と事項が対応して印字されており、年だけを取り出して8件を登録した。資本金の金額は書いていない。
- history: 省いたもの：各店舗の開設・統合・移転、本社の移転、一級建築士事務所としての登録、住宅販売子会社の設立と清算など。いずれも拠点や付随事業の動きであり、会社の骨格をなす出来事を優先した。
- industry: 主たる業界は、外部顧客への売上高の大半を占める運営管理事業と開発販売事業がいずれも賃貸マンションに関する不動産事業であることから real-estate とした。
- industry: DEIの別記事業は「CTE」と印字されている。
- relatedCompanies: 結んだ関連企業はない。
- relatedCompanies: 株式会社ＢＨＡＧコーポレーション：親会社（関係会社の状況に議決権の所有割合50.24％、2025年10月31日現在。大株主の状況では50.02％）だが、候補一覧になく、連結財務諸表の注記にも「非上場」と印字されているため結ばなかった。
- relatedCompanies: 株式会社アールエイジ・テクニカル・サービス：連結子会社（議決権100％）であり、自社の子会社のため結ばなかった。
- relatedCompanies: 日本オープンエンド不動産投資法人：前期の主要な顧客として開発販売事業の販売先に印字されているが、当期は主要な顧客に該当がなく、候補一覧にもないため結ばなかった。金額は書いていない。
- relatedCompanies: 株式会社ＳＢＩ証券：2025年10月31日現在の大株主に載るが証券会社の立場であり、候補一覧にもないため結ばなかった。その他の大株主は個人である。
- relatedCompanies: en（エン株式会社）：「円」の部分一致で、候補もambiguousである。
- relatedCompanies: base-4481（ベース株式会社）：「ベース」という一般語の部分一致である。
- relatedCompanies: freee（フリー株式会社）：「フリー・キャッシュ・フロー」という一般語の部分一致である。
- relatedCompanies: king（株式会社キング）：「コインパーキング」という一般語の部分一致である。
- relatedCompanies: core（株式会社コア）：「コアバンク」という一般語の部分一致で、候補もambiguousである。
- relatedCompanies: seki（セキ株式会社）：「セキュリティ」という一般語の部分一致で、候補もambiguousである。
- relatedCompanies: 【株式の保有状況】は「該当事項はありません」と印字されており、政策保有株式による結びつきはない。
- terms: 用語の助言のみ：「サブリース」は賃貸マンションを一括で借り上げて入居者に転貸する運営形態として有報で説明されている。「運営管理事業」は自社所有・サブリース・管理受託を束ねる同社の中核事業の名称、「開発販売事業」は賃貸マンションの企画・開発・販売を行う事業の名称である。各成果物でこれらの語を一貫して使った。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
