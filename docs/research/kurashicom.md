# クラシコム — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社クラシコム |
| 証券コード | 7110 |
| docID（データを取り出した文書） | `S100Z9TW` |
| 原本 docID | `S100Z9TW` |
| 提出日（原本） | 2026-10-28 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z9TW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社クラシコム / 7110 / docID S100Z9TW（S100WWW2 から新しい有報に更新。旧成果物は pipeline/analysis/superseded/kurashicom-S100WWW2/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z9TW） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kurashicom: 6 件の数値を有報XBRLと照合
有報: 株式会社クラシコム 有価証券報告書－第20期(2025/08/01－2026/07/31) (docID S100Z9TW)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
すべて一致しました。
kurashicom: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本準備は、ユニバース行の第19期有報（S100WWW2）ではなく、パイプラインのリフレッシュが採用した、より新しい第20期有報（S100Z9TW、2026-10-28提出）に基づく（genuine-newer adoption。state の docID と originalDocID はいずれも S100Z9TW）。
- businessModel: 経営指標等の注記2〜4（潜在株式調整後1株当たり当期純利益の未記載、第18期の自己資本利益率の計算方法、従業員数の定義）は表示事項のため financialNotes には書かず、ここに記録する。注記1（第18期より連結財務諸表を作成）は financialNotes に登録した。
- businessModel: 前期有報との修正再表示照合は全系列で差異ゼロで、遡及適用に触れる会計方針の注記も指標に影響するものはなかったため、組替えに関する financialNote は付けていない。
- businessModel: セグメント利益、EBITDA、MD&Aの利益系の金額と増減理由は規則により本文に書いていない。売上高の増減率も、印字の確認できる範囲を超えるため書いていない。
- businessModel: industryPosition は、順位やシェアが印字されていないため省いた。経営環境で引用されるEC市場の規模は市場全体の数値であり、当社の地位ではない。
- businessStructure: セグメントの並び順と金額はセグメント注記の外部顧客への売上高による。MD&A本文のfoufouの売上高382,732千円はセグメント間の内部売上高を含む数値のため使わず、セグメント注記の外部顧客への売上高336,099千円を用いた。
- businessStructure: D2Cとブランドインテグレーションはビジネスラインであり、売上高が分けて開示されていないため、children には金額を書かず、その旨を明記した。
- businessStructure: 主要な設備の状況の注記に「当社は、『北欧、暮らしの道具店』の単一セグメントであるため」とあるが、事業の内容とセグメント注記は2つの報告セグメントで開示されているため、2区分で登録した。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。個別の仕入先は印字されていない。
- businessStructure: 本社は東京都国立市で、本社オフィスに97名が勤務している（主要な設備の状況）。帳簿価額は規則により書いていない。
- history: 沿革の各行は年月まで印字されているが、規則により year のみで登録した（月は書いていない）。
- history: 設立行の資本金800万円は、規則により金額を書いていない。
- history: 落とした行はない。沿革は2023年10月の吸収合併までで全13行を登録した。
- industry: 主たる業界は retail とした。売上高の大半（外部顧客への売上高10,010百万円）を占める「北欧、暮らしの道具店」は自社ECサイトでの商品販売であり、foufou（同336百万円）もファッション商品の販売で、いずれも小売に直接合う。
- industry: ブランドインテグレーション（企業のブランディング支援）は「北欧、暮らしの道具店」セグメント内の一事業で、売上高が独立して開示されていないため、media などの業界は足していない。
- industry: 分類の不足はないため taxonomyGaps は空とした。
- relatedCompanies: garden（株式会社ガーデン）: 有報で資本業務提携とシステム開発取引が印字されている相手は株式会社ソニックガーデン（当社取締役が議決権の過半数を保有する関連当事者）であり、候補の株式会社ガーデンとは別の法人である。ソニックガーデン自体は候補に含まれておらず非上場のため、結ばなかった。
- relatedCompanies: noritake（ノリタケ）: 経営方針のカテゴリ戦略で取り扱うテーブルウェアブランドとして言及されているが、取引の向きや資本関係が印字されていないため、社名の言及だけでは結ばなかった。
- relatedCompanies: en・heiwa・port・lec・freee・ray・base-4481・core・corona・space・taya・land: いずれも一般語や部分文字列による一致（「エンゲージメント」「平和（マニフェストの文言）」「サポート」「フレックス」「フリーランス」「プレイリスト」「営業利益ベース」「コアな顧客基盤」「新型コロナウイルス」「利用スペース」「世田谷区」「ブランド」）であり、有報に当該候補との取引・提携・資本関係は印字されていないため結ばなかった。
- relatedCompanies: classico（クラシコ）: 社名「クラシコム」の部分一致で当社自身を指すため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: 「新株予約権」などの部分一致で、コードリストにない相手のため結ばなかった。
- relatedCompanies: 主要な顧客ごとの情報は、売上高の10%以上を占める相手先がないため記載がない旨が印字されている。重要な契約等は該当事項なしで、投資株式の保有もないため、定型句だけを根拠に結べる相手もいなかった。
- relatedCompanies: 連結子会社である株式会社foufouは、規則により関連企業に含めていない。
- terms: 助言のみ。用語候補: 「ライフカルチャープラットフォーム」（世界観でユーザーとつながり、その土台の上で複数のビジネスラインを展開する同社の事業の表現）、「カルチャーアセット」（コンテンツやブランド、データとして蓄積される無形資産）、「エンゲージメントチャネル」（SNSやアプリ、自社サイトなどユーザーと直接つながる多様なチャネル）、「エンゲージメントアカウント数」（公式SNSのフォロワー数やアプリのダウンロード数などの合計）、「D2C」（自社サイトを通じてユーザーに直接商品を提供する販売形態）、「ブランドインテグレーション」（ブランドと顧客基盤、コンテンツの企画制作能力を活用した企業のブランディング支援事業）、「フィットする暮らし」（自分の生き方を自分らしいと感じ、満足できる暮らしを指す同社のミッションの言葉）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
