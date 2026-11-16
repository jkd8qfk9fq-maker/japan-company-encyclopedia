# アサックス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アサックス |
| 証券コード | 8772 |
| docID（データを取り出した文書） | `S100YI2V` |
| 原本 docID | `S100YI2V` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI2V.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アサックス / 8772 / docID S100YI2V（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asax: 2 件の数値を有報XBRLと照合
有報: 株式会社アサックス 有価証券報告書－第57期(2025/04/01－2026/03/31) (docID S100YI2V)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
asax: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 当連結会計年度より連結財務諸表を作成しているため、連結経営指標等は第57期（2026年3月期）の1期分のみが印字されている（第53期から第56期は「－」）。financialNotes には連結作成開始の注記（注1）を 2026年3月期 にキーして登録した。
- businessModel: 指標表の注2（潜在株式がないため希薄化EPSを記載していない）は表示事項のため financialNotes に入れなかった。注3（第57期の自己資本利益率は期末自己資本に基づき計算）は計算方法の表示事項のため financialNotes に入れず、ここに記録する。
- businessModel: 前期有報（第56期、S100W3LE）は単体のみで連結経営指標がなく、修正再表示の突合対象行がない（bootstrap の restatement check は comparedRows 0）。連結系列は当期が初年度のため、組替えの影響を受ける過去の連結数値は存在しない。
- businessModel: 営業収益の内訳は【関連情報】の製品及びサービスごとの外部顧客への営業収益（不動産担保ローン8,435,237千円、不動産賃貸344,123千円、合計8,779,361千円）を千円切り捨てで用いた。セグメント情報そのものは記載が省略されている。
- businessModel: 中計等の計数目標は有報に印字されていない。経営方針の文章のみを用いた。
- businessModel: Wikipedia（証券コードで同一性確認済み）は本社所在地と事業内容を述べるだけで、有報にない補足が乏しいため使用しなかった。
- businessStructure: 事業の並び順は【関連情報】の製品及びサービスごとの外部顧客への営業収益の大きい順（不動産担保ローン8,435百万円、不動産賃貸344百万円）とし、金額が独立して開示されていない信用保証事業と不動産販売事業を最後に置き、その旨を各説明に明記した。
- businessStructure: セグメント情報は、不動産担保ローン事業が主要な事業で他のセグメントは重要性が乏しいとして、関連情報を除き記載が省略されている。
- businessStructure: 当社グループは当社、連結子会社ASAX America, Inc.（議決権100％、当連結会計年度より重要性が増したため連結の範囲に含めた）、非連結子会社株式会社フォーサイト（議決権100％）、その他の関係会社株式会社フレキシブルで構成される。
- businessStructure: 当連結会計年度より連結財務諸表を作成している（第57期が初の連結年度）。
- businessStructure: suppliers は旧スキーマのため省略した。【事業の内容】に個別の仕入先の社名は印字されていない。
- history: 落とした行：本店移転（1970年の中野移転、1984年の四谷移転、1995年の銀座移転、2005年の広尾移転と旧本店の銀座支店開設）、1995年の大宮支店開設（支店開設）。
- history: 沿革に資本金額の記載はない。月は書かず年だけとした。
- history: 1983年は商号変更（1月）と貸金業登録（12月）の2件を1項目にまとめた。
- industry: 主たる業界は、不動産を担保とする融資を行う貸金業であり、2026年3月期の外部顧客への営業収益の96％を不動産担保ローンが占めるため、閉じた分類の finance に直接当てはめた（暫定ではない）。
- industry: 不動産賃貸事業（外部顧客への営業収益344百万円）や不動産販売事業は、不動産担保ローン事業に付随する隣接事業であり、セグメント情報も単一の扱いであるため、副次的な業界は付けなかった。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 【大株主の状況】に所有割合7.51％で載る事業会社であり、信託口や金融機関ではないため major-shareholder として結んだ。
- relatedCompanies: career（株式会社キャリア）: 「キャリアに応じた階層別研修」という一般語の一致であり、同社との関係を示す記載はないため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「企業ブランド力の強化」の文脈などでの部分一致であり、同社との関係を示す記載はないため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguous であり、「セキュリティ」等の部分一致であるため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「ベースアップの検討」という一般語の一致であり、同社との関係を示す記載はないため結ばなかった。
- relatedCompanies: 株式会社フレキシブルは【関係会社の状況】で「その他の関係会社」とされ、当社の議決権の34.56％を保有する大株主でもあるが、related-candidates に含まれていないため結ばなかった。
- relatedCompanies: 株式会社UH Partners 2（大株主6.04％）、株式会社山和（大株主2.34％）は related-candidates に含まれていないため結ばなかった。日本カストディ銀行（信託口）は純投資の信託口であるため結ばなかった。
- relatedCompanies: 当社の連結子会社ASAX America, Inc.と非連結子会社株式会社フォーサイトは自社の子会社であり、関連企業には含めない。
- terms: 助言: 用語「不動産担保ローン」は、不動産を担保として事業資金等を融資する同社の主力事業の名称です。本文では有価証券報告書の表記のまま用いています。
- terms: 助言: 用語「営業貸付金」は、貸金業を営む同社の貸付債権を指す勘定科目です。本文の金額には用いていません。
- terms: 助言: 用語「特定金融会社等」は、「特定金融会社等の開示に関する内閣府令」に基づく開示区分で、同社はこの府令に基づき営業貸付金の状況を開示しています。本文では有価証券報告書の表記のまま用いています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
