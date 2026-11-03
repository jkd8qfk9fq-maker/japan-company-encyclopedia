# アスクル — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アスクル株式会社 |
| 証券コード | 2678 |
| docID（データを取り出した文書） | `S100YSYE` |
| 原本 docID | `S100YSYE` |
| 提出日（原本） | 2026-07-30 |
| 決算期 | 2026-05-20 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YSYE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アスクル株式会社 / 2678 / docID S100YSYE（id は英語表記「ASKUL Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
askul: 10 件の数値を有報XBRLと照合
有報: アスクル株式会社 有価証券報告書－第63期(2025/05/21－2026/05/20) (docID S100YSYE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
askul: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[2].description: 売上高と当期純利益以外の利益に触れていないか確認する（…とアスクルからの仕切り価格との差額を利益にし、アスクルは開拓や回収のコストを…）

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のとおり5月20日締めです。2026年5月期は2025年5月21日から2026年5月20日までの12か月で、変則決算ではありません。
- businessModel: brief が注意に挙げた「財務諸表の組替え」は sections.txt で該当の記載が見つからず、5年間の数値は前期有報と一致していたため、basis は付けていません。
- businessModel: 営業損益・経常損益・システム障害対応費用・減損損失の金額は、本文の財務数値の規則（売上高と当期純利益のみ）に従い書いていません。
- businessModel: perspectives（戦略と強み）は、書く材料が経営方針の節にありますが任意のため省略しました。
- businessStructure: 報告セグメントはeコマース事業（外部顧客への売上高393,081百万円）とロジスティクス事業（6,276百万円）の2つ。「その他」（840百万円）は報告セグメントに含まれない区分なので、売上順でも最後です。
- businessStructure: eコマース事業の children（ASKUL事業・LOHACO事業・グループ会社）は、セグメント情報の売上高の内訳行です。ASKUL事業・LOHACO事業の金額はセグメント間の内部売上高を含む値、グループ会社は「内部取引消去」と合算された一行（82,049百万円）なので、グループ会社の金額は書いていません。children は売上の大きい順に並べました（ASKUL 282,947 / LOHACO 28,084 / グループ会社は金額なし）。
- businessStructure: グループ会社の説明に挙げた子会社と事業内容は【事業の内容】の記載どおりです。どの子会社がどの区分に入るかの対応表は有報に印字されていないため、アルファパーチェス・フィード・チャームだけを具体的な強みとともに書き、ビジネスマート・ソロエルは「含まれる」と書いたのは【事業の内容】がこの2社を eコマース事業の主な関係会社として挙げているためです。
- businessStructure: セグメント別の営業損益・減損損失・システム障害対応費用の金額は、本文の財務数値の規則（売上高と当期純利益のみ）に従い書いていません。
- businessStructure: 従業員数は【従業員の状況】のセグメント別の欄を読んでいないため書いていません。
- history: 沿革の表は年月と事象のセルが連記される崩れ方をしていますが、各行に年月が印字されていて事象と順に対応するため、そのまま使いました。
- history: 1963年のプラス工業の設立、1986年の商号変更・営業譲渡、1993年の リンクス株式会社への商号変更は、現在のアスクルの事業とのつながりが沿革の文面だけでは分かりにくいため、1993年にはアスクル事業の発足だけを書き、省きました。
- history: 物流センターの個別の開設（2001年横浜、2004年名古屋、2006年大阪、2007年仙台、2013年以降など）、カタログの発刊、ISO・ISMS認証、2006年の上海法人設立と2014年の清算、2014年の昌利株式会社の取得と合併、2015年のエコ配の取得と2020年の一部譲渡、2009年のアスマル設立（2013年合併）は、本文を短く保つため省きました。
- history: 2024年6月の「ASKUL関東DC」開設の稼働時期（2025年6月）は【経営者による分析】の記述からです。
- industry: 売上の大部分（2026年5月期は外部顧客への売上高の約98％）を報告セグメント「eコマース事業」（OA・事務用品・食料品・日用品などの通信販売）が占めるため、小売を主たる業界にしました。
- industry: ロジスティクス事業は報告セグメントですが売上が小さく、eコマースを支える物流の延長なので、運輸は付けていません。
- relatedCompanies: このパックには related-candidates.json がありませんでした。そのため、src/data/companies/ に存在する id（ly = LINEヤフー株式会社、alphapurchase = 株式会社アルファパーチェス）を正式名称の一致で確認して使いました。
- relatedCompanies: ソフトバンクグループ㈱・ソフトバンクグループジャパン㈱・ソフトバンク㈱・Aホールディングス㈱は、【関係会社の状況】で「その他の関係会社の親会社」として並ぶだけで、取引・提携・資本の直接の関係はアスクルについて述べられていないため結びませんでした（議決権の被所有割合は LINEヤフー経由の間接 46.9％）。
- relatedCompanies: 株式会社チャーム（アスクルの連結子会社）は、src/data/companies/ に同名の登録がなく（charm-care は株式会社チャーム・ケア・コーポレーションで別会社）、上場会社でもないため結びませんでした。
- relatedCompanies: プラス株式会社は、沿革でかつての親会社・その他の関係会社として登場しますが、現在の関係は印字されておらず、登録も確認できないため結びませんでした。
- relatedCompanies: ASKUL LOGIST㈱・ビジネスマート㈱・嬬恋銘水㈱・ソロエル㈱・㈱AP67・フィード㈱は連結子会社ですが、上場していないため結びませんでした。
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: terms は助言のみの工程で、エントリーには何も書き込みません。本文には存在を確認していない用語へのリンクを置いていません。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
