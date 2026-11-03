# カゴメ — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | カゴメ株式会社 |
| 証券コード | 2811 |
| docID（データを取り出した文書） | `S100XQN0` |
| 原本 docID | `S100XQN0` |
| 提出日（原本） | 2026-03-13 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XQN0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | カゴメ株式会社 / 2811 / docID S100XQN0（id は英語表記「KAGOME CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kagome: 10 件の数値を有報XBRLと照合
有報: カゴメ株式会社 有価証券報告書－第82期(2025/01/01－2025/12/31) (docID S100XQN0)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kagome: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 日本アクセスの割合12.7％は販売実績の主な相手先の印字。関連する報告セグメントは国内加工食品事業。
- businessModel: 国内加工食品事業の顧客を『食品卸・小売』としたのは日本アクセス以外の相手先が有報に印字されておらず、卸・小売と明記した箇所もないため、customers の『国内の食品卸・小売』は有報の『多様な販路』の説明にとどめた推定を含む。needsReview にするほどではないと判断。
- businessModel: 利益は当期利益のみ記載。事業利益・営業利益などは方針により書かなかった。
- businessModel: brief.md の注意にある遡及修正の記載は、sections.txt に該当語が見つからず、前期有報との重複年度の値も一致しているため、basis は付けなかった。
- businessStructure: 並び順はセグメント注記の2025年12月期の外部顧客に対する売上収益の大きい順（国内加工食品157,324＞国際114,829＞その他22,109）。子の並びも同じ注記・販売実績の外部顧客分の順。
- businessStructure: 国際事業の子の外部顧客分（61,071＋57,177）と調整額（△3,419）の合計が国際事業の外部顧客売上収益114,829になる。調整額は事業としては書かなかった。
- businessStructure: 国際事業のうち一次加工・二次加工に属さない事業は二次加工に含めると有報が注記している。
- businessStructure: listings の market は表紙が『東京証券取引所(プライム市場)名古屋証券取引所(プレミア市場)』と印字しているため記載した。
- businessStructure: 事業利益などの利益はセグメント別に印字があるが、本文方針により書かなかった。
- history: 沿革は印字どおりの年月で、崩れた表ではなく年月と事象が対になっている。
- history: 1978年の項は、名古屋証券取引所の1976年上場と1978年の市場第一部指定替えも説明に含めた（いずれも沿革に印字）。
- history: 2024年の項の significance は、MD&A（2025年度の国際事業が2021年度対比で売上収益2.6倍）にもとづく。
- history: 沿革の他の項（工場竣工、支店開設、ブランドマーク変更、企業理念の発表など）は重要度を見て省いた。
- industry: 国内加工食品事業と国際事業（トマト加工）の2つの報告セグメントが売上収益の大半を占め、どちらも食品の製造・販売のため food を主たる業界にした。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業の候補が無いため、結ぶ相手は無し。
- relatedCompanies: 株式会社日本アクセス: 主要顧客（売上収益37,271百万円、12.7％）だが、候補ファイルに無く掲載済みと確認できないため結ばなかった。
- relatedCompanies: ダイナパック株式会社: 大株主（4.26％、2025年12月31日現在）だが、候補ファイルに無く掲載済みと確認できず、事業上の関係も印字されていないため結ばなかった。
- relatedCompanies: 連結子会社・持分法適用関連会社（Ingomar、F-LINE、台湾可果美など）はいずれも有報を提出しておらず上場でも無いため結ばなかった。
- terms: 用語の助言: 「トマトペースト」「一次加工」「二次加工」は読者に説明が要る語。トマトペーストは生のトマトを煮詰めて濃縮した加工原料、一次加工はそれをつくる工程、二次加工はそれに調味料を加えてピザソースなどに仕上げる工程。
- terms: 用語の助言: 「IFRS」「持分法適用会社」も候補。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
