# 芝浦機械 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 芝浦機械株式会社 |
| 証券コード | 6104 |
| docID（データを取り出した文書） | `S100YLEZ` |
| 原本 docID | `S100YLEZ` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLEZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 芝浦機械株式会社 / 6104 / docID S100YLEZ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shibaura-machine: 10 件の数値を有報XBRLと照合
有報: 芝浦機械株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YLEZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shibaura-machine: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの機械警告（本文に財務諸表の組替えの記載あり）については、該当する表示方法の変更の注記を確認しました。電子記録債権と電子記録債務の独立掲記に伴う前年度の連結財務諸表の組替えで、表示区分の変更のみであり、修正再表示チェックも前期有報と重複する8行すべてが一致しているため、financialNotes に表示方法の変更として記録しました。
- businessModel: 当期純利益の減少には、前期に計上した固定資産売却益の反動減や、子会社化したSHIBAURA MACHINE LWB GmbHに係るのれんの減損などが影響していますが、金額は本文の財務数値の規則のため書いていません。
- businessModel: Wikipediaの冒頭は旧社名が東芝機械であることの補足のみで、同じ事実が有報の沿革に印字されているため使用していません。
- businessModel: 中期経営計画の利益に関する目標値や、2027年3月期の業績予想の利益の金額は、本文の財務数値の規則のため書いていません。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2026年3月期）の大きい順です。「その他」は報告セグメントに含まれない区分のため最後に置きました。
- businessStructure: 成形機事業の内訳（射出成形機・ダイカストマシン・押出成形機）など、区分ごとの金額が独立して開示されていないものには金額を書いていません。
- businessStructure: 主要な設備の状況では、沼津本社や東京本社などが複数のセグメントにまたがって印字されているため、拠点と事業の対応は事業の説明に結びつけていません。
- history: 沿革は有報の印字のうち、会社の形を変えた出来事を中心に選びました。サービス子会社の設立・解散や工場の開設などの細目は省略しています。
- history: 設立時や合併時の資本金の金額は、本文の財務数値の規則のため書いていません。
- industry: 主たる業界は、売上高の約74％を占める成形機事業をはじめ、全事業が機械の製造・販売であるため machinery としました。
- industry: 半導体については、半導体装置部門を2002年に分社化して承継済みであり、現在の事業区分に半導体関連の独立した開示がないため semiconductors は付けていません。超精密加工機は工作機械事業の中の製品で金額が独立して開示されていないため、2つ目の業界は付けていません。
- relatedCompanies: steps（step）：一般語「ステップアップ」の一部との一致のみで、同社との関係の印字はないため結びません。
- relatedCompanies: ポート（port）：「事業ポートフォリオ」など一般語の一部との一致のみのため結びません。
- relatedCompanies: キャリア（career）：「キャリア形成」など一般語の一部との一致のみのため結びません。
- relatedCompanies: ビジョン（vision）：「長期ビジョン2030」など一般語の一部との一致のみのため結びません。
- relatedCompanies: ベース（base-4481）：「時価ベースの自己資本比率」など一般語の一部との一致のみのため結びません。
- relatedCompanies: イオン（aeon）：「リチウムイオン電池」の「イオン」との部分一致のみのため結びません。
- relatedCompanies: ゼロ（zero）：「ゼロ災害」など一般語との一致のみで、同一性が曖昧な相手でもあるため結びません。
- relatedCompanies: ランド（land）：「グランド・ケイマン」など地名の一部との一致のみのため結びません。
- relatedCompanies: カバー（cover）：「カバーしています」など一般語の一部との一致のみのため結びません。
- relatedCompanies: イノベーション（innovation）：「イノベーションの創出」など一般語の一部との一致のみのため結びません。
- relatedCompanies: 高速（kohsoku）：「高速化」など一般語との一致のみで、同一性が曖昧な相手でもあるため結びません。
- relatedCompanies: ティア（tear）：「ボランティア」など一般語の一部との一致のみのため結びません。
- relatedCompanies: トラスト（trust）：大株主の日本マスタートラスト信託銀行（信託口）は信託口の名義であり、コードリストにもないため結びません。
- relatedCompanies: 光通信（hikari-tsushin）：「光通信向け」は超精密加工機の需要分野の記述で、同社との取引の印字はないため結びません。
- relatedCompanies: レント（rent）：「タレントマネジメント」など一般語の一部との一致のみのため結びません。
- relatedCompanies: セキ（seki）：「情報セキュリティ」など一般語の一部との一致のみで、同一性が曖昧な相手でもあるため結びません。
- relatedCompanies: 不二精機（fuji-seiki）：沿革の「株式会社不二精機製造所」は2022年に吸収合併した非上場の子会社で、同社との関係の印字はないため結びません。
- relatedCompanies: ホシザキ（hoshizaki）：1999年に食品機器部門の生ビールディスペンサーなどをホシザキ電機株式会社へ事業移管した、1回限りの過去の取引のみのため結びません。
- relatedCompanies: 小森コーポレーション（komori）：2001年に印刷機械部門のオフセット輪転機事業を営業譲渡した、1回限りの過去の取引のみのため結びません。
- relatedCompanies: ナブテスコ（nabtesco）：2015年に子会社の株式会社ハイエストコーポレーションの全株式を譲渡した、1回限りの過去の取引のみのため結びません。
- relatedCompanies: 前澤化成工業（maezawa-kasei-industries）：特定投資株式の保有目的に「主に当社射出成形機の主要ユーザーであり、販売取引」との印字がありますが、コードリストにない相手で検証できないため結びません。
- relatedCompanies: しずおかフィナンシャルグループ（shizuoka-financial-group）：保有目的が「資金借入等の銀行取引の他、日常の金融・資金取引」のみの金融機関のため結びません。
- relatedCompanies: 三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）：保有目的が「資金借入等の銀行取引の他、日常の金融・資金取引」のみの金融機関のため結びません。
- relatedCompanies: 横浜フィナンシャルグループ（yokohama-financial-group）：保有目的が「資金借入等の銀行取引の他、日常の金融・資金取引」のみの金融機関のため結びません。
- relatedCompanies: 関係会社の状況に載る連結子会社28社はすべて非上場のため候補外です。主要な顧客のChongqing Shenpeng Industrial Development Co., Ltd.も非上場のため結んでいません。
- terms: 用語候補： 超精密加工機（工作機械事業の製品区分）、ギガキャスト（自動車業界における大型一体成形の動き）、セパレータフィルム製造装置（押出成形機の用途の一つ）、竪型射出成形機（SHIBAURA MACHINE LWB GmbHの製品分野）、ドライ電極（次世代電池の製造技術）——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: 2026年5月18日の取締役会で、米国の100％子会社を通じて、精密工作機械メーカーのMoore Nanotechnology Systems, LLCの全持分を取得し子会社化することを決定し、持分譲渡契約を締結しました。取得の時期は2026年後半の予定で、本有報の提出時点では完了していないため、本登録の事業構成と関係会社は取得前の2026年3月期の区分に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
