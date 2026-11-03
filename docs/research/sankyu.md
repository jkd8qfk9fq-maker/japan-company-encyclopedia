# 山九 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 山九株式会社 |
| 証券コード | 9065 |
| docID（データを取り出した文書） | `S100YJRS` |
| 原本 docID | `S100YJRS` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJRS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 山九株式会社 / 9065 / docID S100YJRS（id は英語表記「SANKYU INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sankyu: 10 件の数値を有報XBRLと照合
有報: 山九株式会社 有価証券報告書－第117期(2025/04/01－2026/03/31) (docID S100YJRS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第115期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
sankyu: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから2026年3月期（連結、Japan GAAP）。修正再表示なし。brief の注意にある第115期の訂正有報は、前期の窓にあるもので、今期の数値には影響しない（重複年度は全て一致）。
- businessModel: 売上高・純利益は MD&A の印字（億円・百万円）をそのまま使い、前期比も印字値。営業利益・経常利益などの利益は書いていない。
- businessModel: 日本製鉄の売上高96,452百万円は【関連情報】の印字どおり（換算していない）。
- businessModel: perspectives は有報の戦略の記述を読み込んでいないため省いた。
- businessStructure: 決算期は表紙のDEIから2026年3月期（第117期、連結）。訂正フラグはすべてfalse、修正再表示なし。
- businessStructure: 並び順: 外部顧客への売上高が機工事業307,458百万円、物流事業295,256百万円、その他28,858百万円の順。「その他」は有報が報告セグメントに含まれないと書くため、金額に関わらず最後。
- businessStructure: 売上高の表記は MD&A の印字（億円・百万円）をそのまま使った。前期比は印字値。セグメント利益は本文に書いていない。
- businessStructure: 子区分は【事業の内容】のa〜fの列挙に基づく。区分ごとの金額は印字されていないため金額は書かず、関係会社の対応は有報の列挙どおり。
- businessStructure: listings: 表紙は「東京証券取引所プライム市場福岡証券取引所」と印字。福岡は市場区分の印字がないため market なし。
- businessStructure: 山陽工業の取得を機工の説明に入れたのは、MD&Aが「2024年12月に新たに連結対象の子会社が１社加わった」と書き、沿革が同月の山陽工業の取得を書くことの組み合わせ。有報が両者を直接結んではいない。
- history: 沿革は年月と事象が対になった通常の表で、崩れはない。2008年7月と2010年9月が1つのセルにまとまって印字されているため、2010年9月（シンガポールの地域統括会社の設立）は事象との対応が曖昧なので採用しなかった。
- history: 1918年の買収時の資本金など細部は一部省いた。選んだ出来事以外の沿革行（海外現地法人、認証取得など）は採用していない。
- industry: 機工事業（売上の48.7％）は物流事業（46.7％）よりわずかに大きいが、どちらも過半ではない。物流を会社の主たる事業と見て transportation を主とし、報告セグメントとして開示された機工事業（設備の建設・据付）に construction を付けた。
- relatedCompanies: 証拠パックに related-candidates.json が無く、候補から選ぶ規則のため、関連企業は結んでいない。
- relatedCompanies: 日本製鉄: 主要顧客（2026年3月期の売上高96,452百万円）で、政策保有株式も保有するが、候補ファイルに無いため結んでいない。
- relatedCompanies: C.H.Robinson Worldwide: 2015年の業務提携は沿革にあるが過去の提携で、候補に無い。西濃運輸（2000年の業務提携）、日本郵便（2008年の合弁設立）も同様に過去の出来事で、候補に無いため結んでいない。
- relatedCompanies: 子会社・持分法適用関連会社（サンネット物流）は非上場で、結べない。
- terms: 用語の助言: 「コンテナドレイ」（港と荷主の間のコンテナ輸送）、「国際複合輸送」、「通関」、「傭船者」、「非破壊検査」は、初見の読者に説明が要る語。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
