# トーメンデバイス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社トーメンデバイス |
| 証券コード | 2737 |
| docID（データを取り出した文書） | `S100YJQ2` |
| 原本 docID | `S100YJQ2` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJQ2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社トーメンデバイス / 2737 / docID S100YJQ2（id は英語表記「TOMEN DEVICES CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tomen-devices: 10 件の数値を有報XBRLと照合
有報: 株式会社トーメンデバイス 有価証券報告書－第35期(2025/04/01－2026/03/31) (docID S100YJQ2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tomen-devices: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は md-and-a.txt と segments.txt の印字のまま（億円表記はMD&A、地域別・顧客別は百万円表記の表）。換算していない。
- businessModel: 『商品の仕入れ』の説明は事業の内容の『国内では当社が主に日本国内のサムスングループより商品を仕入れ販売し、海外では子会社が主に海外のサムスングループから』の記載による。
- businessModel: 営業利益・経常利益・セグメント利益・総資産などは本文に書いていない。
- businessModel: NEW H3C 向け11.2％は販売実績の主な相手先の割合の印字。前期は7.0％で、10％未満のため前期は主要な顧客として記載されていない。
- businessModel: リンク記法は、存在する id を確認できないため使っていない。
- businessModel: perspectives は strategy の disclosed のみ。競争優位・業界の位置づけは有報に自社の説明が見つからず省略。
- businessStructure: 報告セグメントは「日本」「海外」の2つ。外部顧客への売上高（海外473,783百万円＞日本159,885百万円）の大きい順に並べた。
- businessStructure: セグメント利益は本文に書いていない。品目別の売上高（メモリ・システムLSI・ディスプレイ・その他）は business model 側で扱い、ここでは各セグメントに区分けしていない（有報はセグメント別の品目内訳を印字していない）。
- businessStructure: 各セグメントの products は、MD&Aのセグメント別の説明に名前が出る品目だけ。事業全体の取扱品目（LED・MLCC・バッテリーなど）はセグメントとの対応が印字されていないため、置かなかった。
- businessStructure: listings の market は表紙の「東京証券取引所　プライム市場」に基づく。
- history: 2002年の『海外セグメントが大半』は、2026年3月期のセグメント表（海外473,783百万円、日本159,885百万円）から読める事実。
- history: 沿革の本店移転・ISO認証・営業所開設・2001年の合併などは、重要度が低いため省いた。
- industry: 事業は『半導体および電子部品などの売買』で、自社製造はないため、売買を営む trading を主とし、取扱商品が半導体である点を semiconductors で補った。半導体商社にあたる専用の区分は無いが、近い値で足りると判断し taxonomyGaps には入れていない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、関連企業は候補の中からだけ選ぶ規則のため、1社も結ばなかった。
- relatedCompanies: 豊田通商株式会社（親会社、議決権の50.2％を被所有、2026年3月31日現在）：【関係会社の状況】に親会社と印字。候補ファイルが無く同一性を機械照合できないため結ばなかった。候補が得られれば parent で結べる。
- relatedCompanies: 株式会社ネクスティエレクトロニクス（その他の関係会社、被所有23.5％）：同上の理由で結ばなかった。候補が得られれば other-affiliated-company で結べる。
- relatedCompanies: ITGマーケティング株式会社（持分法適用関連会社、38.8％）：上場の確認ができる候補が無いため結ばなかった。
- relatedCompanies: 海外・米国の子会社5社は未上場の子会社で、候補に無いため結ばなかった。
- terms: 用語の追加候補（助言のみ）：DRAM、NAND FLASH、SiP（システム・イン・パッケージ）、CIS（CMOSイメージセンサー）、MLCC（積層セラミックコンデンサ）、専門商社、販売特約店。既存の用語 id は確認していないため、重複するものは省いてよい。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
