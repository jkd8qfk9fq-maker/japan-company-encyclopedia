# ツガミ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ツガミ |
| 証券コード | 6101 |
| docID（データを取り出した文書） | `S100YBZA` |
| 原本 docID | `S100YBZA` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBZA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ツガミ / 6101 / docID S100YBZA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tsugami: 10 件の数値を有報XBRLと照合
有報: 株式会社ツガミ 有価証券報告書－第123期(2025/04/01－2026/03/31) (docID S100YBZA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tsugami: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報と全行一致し、変則決算・決算期変更・会計基準の変更もないため、financialNotes は空とした。
- businessModel: セグメント利益や営業利益などの金額は、本文のルールのため記載していない（売上収益の内訳と増減のみ記載）。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」で、提出後の予定事項もない。
- businessModel: Wikipedia の冒頭は本社の所在地と工作機械メーカーという有報と重なる一般的な説明のみで、補足に使える固有の事実がなかったため使用しなかった。
- businessStructure: 報告セグメントは製造・販売拠点の所在地別（日本・中国・インド・韓国・その他）のため、事業はセグメント単位で記載し、外部顧客への売上収益の大きい順に並べた。製品別の売上収益は開示されていない。
- businessStructure: 拠点と事業の対応はセグメント欄の記載どおりとした。主要な設備のうち長岡工場は「日本」セグメントに印字されている。
- history: 沿革表は年月セル46件と事象47件（2004年10月は同じ日付に2件の合併が併記されている）で、行順で対応づけた。
- history: 1937年の設立時の資本金額は、本文のルールのため記載しなかった。
- history: 沿革のうち本社移転、工場閉鎖、国内子会社の設立・合併などの細目は、海外展開と社名変更を中心に選んで省略した。
- industry: 主たる業界は、工作機械の製造販売が事業の全てであるため machinery とした。半導体向けの専業事業としての開示はなく、semiconductors は付けなかった。
- relatedCompanies: 山善は候補データで ambiguous だが、特定投資株式の表に正式名称・株式数・「主要な得意先」の保有目的が印字されているため同一と判断した。
- relatedCompanies: 第四北越フィナンシャルグループ: 特定投資株式に「金融取引先であり、財務活動の円滑化」が保有目的と印字され、金融取引が理由のため結ばなかった。
- relatedCompanies: 三菱UFJフィナンシャル・グループ: 「金融取引先」と印字され、金融取引が理由のため結ばなかった。
- relatedCompanies: 八十二長野銀行: 「金融取引先」と印字され、金融取引が理由のため結ばなかった。
- relatedCompanies: 岡三証券グループ: 「金融取引先」と印字され、金融取引が理由のため結ばなかった。
- relatedCompanies: THK: 特定投資株式に「主要な仕入先」と印字があるが、related-candidates.json に含まれていないため結ばなかった。
- relatedCompanies: 第一生命ホールディングス: 特定投資株式に「保険契約先」と印字があるが候補に含まれず、保険取引のため結ばなかった。
- relatedCompanies: ステップ: 収益認識の会計方針に現れる一般語「ステップ」の誤マッチのため結ばなかった。
- relatedCompanies: ポート: 「製品ポートフォリオ」の一般語の部分一致のため結ばなかった。
- relatedCompanies: ゼロ: CO2排出量「実質ゼロ」の一般語の誤マッチのため結ばなかった。
- relatedCompanies: 高速: 製品特性を表す一般語「高速」の誤マッチのため結ばなかった。
- relatedCompanies: エン: 一般語の部分一致の誤マッチのため結ばなかった。
- relatedCompanies: ベース: 「技術をベースに」の一般語の部分一致のため結ばなかった。
- relatedCompanies: イノベーション: 一般語「イノベーション」の誤マッチのため結ばなかった。
- relatedCompanies: リード: 「リードタイム」の一般語の部分一致のため結ばなかった。
- relatedCompanies: ウィル: 「コンピュータウィルス」の一般語の部分一致のため結ばなかった。
- relatedCompanies: トラスト: 大株主の状況の日本マスタートラスト信託銀行（信託口）の記載であり、株式会社トラストではなく、コードリストにもないため結ばなかった。
- relatedCompanies: 大株主の状況に載る事業会社はなく（信託銀行・銀行・保険会社のみ）、major-shareholder として結ぶ相手はなかった。
- terms: 助言: 用語「自動旋盤」（工作物を回転させながら自動で切削加工する工作機械）、「マシニングセンタ」（工具を自動で交換しながら複数の加工を行う工作機械）、「転造盤」（ねじや歯車などを転がし加工で成形する工作機械）、「研削盤」（砥石で表面を高精度に仕上げる工作機械）は、この会社の事業を理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
