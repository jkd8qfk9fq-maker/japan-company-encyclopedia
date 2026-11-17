# カラダノート — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社カラダノート |
| 証券コード | 4014 |
| docID（データを取り出した文書） | `S100Z9X4` |
| 原本 docID | `S100Z9X4` |
| 提出日（原本） | 2026-10-26 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z9X4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社カラダノート / 4014 / docID S100Z9X4（S100WW86 から新しい有報に更新。旧成果物は pipeline/analysis/superseded/karadanote-S100WW86/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z9X4） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
karadanote: 2 件の数値を有報XBRLと照合
有報: 株式会社カラダノート 有価証券報告書－第18期(2025/08/01－2026/07/31) (docID S100Z9X4)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
karadanote: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 指標注記２（2026年７月期の自己資本利益率は期末自己資本に基づいて計算していること）と注記３（従業員数は就業人員数であり、外書は臨時従業員であること）は表示・計算に関する事項のため、financialNotes には書いていません。注記１の連結財務諸表の作成開始のみを financialNotes に記録しました。
- businessModel: 証拠パックの修正再表示チェックは「前期有報と突き合わせられる行がない」とされていました。当期は連結財務諸表の作成初年度であり、連結経営指標等は第18期のみが印字され前期の連結行が存在しないため、連結数値の修正再表示の対象はありません。MD&Aにも前連結会計年度との比較・分析の記載をしていない旨が印字されています。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されています。株式分割の記載は有報のどこにもありません。
- businessModel: 住友生命保険相互会社は最大の顧客であり資本業務提携先・大株主でもありますが、相互会社で related-candidates.json の候補にないため relatedCompanies には結ばず、industryPosition に事実を記録しました。
- businessModel: MD&Aの段階利益の金額と理由、キャッシュ・フローの金額、設備の帳簿価額、資本金の金額、役員退職慰労金の支払額は本文に書いていません。経営方針のM&A投資規律（投資回収期間の年数等）は投資判断の基準のため、perspectives には数値を書かず定性的に要約しました。配当は資本政策の手続きのため、本文には金額を書いていません。
- businessStructure: 単一セグメント（ファミリーデータプラットフォーム事業）のため、セグメント情報・製品及びサービスごとの情報とも記載が省略されており、children には金額を書いていません。主要な顧客ごとの情報では、住友生命保険相互会社302,523千円、株式会社デジタルガレージ137,528千円、メットライフ生命保険株式会社120,780千円が印字されています（金額は本文に書いていません）。
- businessStructure: 主要な設備は提出会社の本社（東京都港区、従業員31名）と連結子会社の株式会社カラダノートライフパートナーズ本社（愛知県春日井市、同17名）で、単一セグメントのため事業との対応は一体です。帳簿価額や賃借料は書いていません。
- businessStructure: 連結子会社は1社です（株式会社カラダノートライフパートナーズ：保険代理事業、議決権100％、特定子会社）。2026年６月に株式会社FPOの全株式を取得し完全子会社化したもので、当連結会計年度の期中の出来事のため、決算日現在のグループ構成に含めています。自社の子会社のため relatedCompanies には結んでいません。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略しました。【事業の内容】に個別の仕入先名の印字はありません。
- history: 沿革の表は年月と事項が対応して印字されており、崩れた表ではありません。年のみを採り、月は書いていません。
- history: 省いた事項: 本店移転（2010年３月・2010年11月・2011年６月・2013年３月・2017年３月・2021年１月）、個別アプリの提供開始（「お薬ノート」2012年、「血圧ノート」2013年、「陣痛きたかも」2013年、「授乳ノート」2014年、「ステップ離乳食」2015年）、ママ向け情報サイト「ママびより」の提供開始（2017年10月）。
- history: 資本金の金額は沿革に書いていません。Wikipedia の記事は取得されておらず（found: false）、使っていません。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は media（メディア）としました。単一セグメントの事業の収益の中心は、提携企業への顧客紹介・広告掲載・サービス連携等への対価であり、自社アプリやウェブメディア「ママびより」を通じて家族の接点を持つマーケティング支援の事業です。
- industry: it を２つ目に付けました。アプリ群の運営と、ユーザーの同意のもとで預かった一次データを蓄積するファミリーデータベースが事業の基盤であるためです。finance は付けていません。保険は連結子会社による代理店事業であり、当社グループ自身が保険の引受けを行うものではなく、金額の独立開示もありません。閉じた分類に当てはまるため、暫定分類や taxonomyGaps はありません。DEIの別記事業は CTE です。
- relatedCompanies: vision: 「コーポレートビジョン」の「ビジョン」という一般語の一致のみです。
- relatedCompanies: port: 「サポート」等の部分文字列の一致のみです。
- relatedCompanies: seki: ambiguous であり、「セキュリティ」等の部分文字列の一致のみです。
- relatedCompanies: base-4481: 「ファミリーデータベース」の「ベース」という部分文字列の一致のみです。
- relatedCompanies: career: 「キャリア形成」という一般語の一致のみです。
- relatedCompanies: freee: 「フリーキャッシュ・フロー」の「フリー」という部分文字列の一致のみです。
- relatedCompanies: lec: 「フレックスタイム制度」の部分文字列の一致のみです。
- relatedCompanies: nissin: コードリストになく ambiguous でもあり、新株予約権に関する記載中の部分文字列の一致のみです。
- relatedCompanies: land: 「ブランドイメージ」等の部分文字列の一致のみです。
- relatedCompanies: step: 当社のアプリ「ステップ離乳食」の名称の一部であり、株式会社ステップへの言及ではありません。
- relatedCompanies: aska: 印字は監査法人である「アスカ監査法人」であり、アスカ株式会社ではなく、監査契約は関連企業の関係に当たらないため結んでいません。
- relatedCompanies: broad-minded: 買掛金の相手先内訳に載るのみで、取引・提携・資本関係の記述がないため結んでいません。
- relatedCompanies: geechs: 買掛金の相手先内訳に載るのみで、取引・提携・資本関係の記述がないため結んでいません。
- relatedCompanies: en: ambiguous であり、「エンジニア」等の部分文字列の一致のみです。
- relatedCompanies: moi: ambiguous であり、「共育（トモイク）プロジェクト」の部分文字列の一致のみです。
- relatedCompanies: will: 「コンピューターウィルス」の部分文字列の一致のみです。
- relatedCompanies: zero: ambiguous であり、「ゼロベース」という語の一致のみです。
- relatedCompanies: 候補にないため記録します: 住友生命保険相互会社は主要な顧客（2026年7月期の販売実績の28.6％）であり、2025年５月に資本業務提携契約を締結し、【大株主の状況】にも9.72％を保有する大株主として印字されていますが、相互会社で候補にありません。メットライフ生命保険株式会社も主要な顧客（同11.4％）ですが候補にありません。連結子会社１社（株式会社カラダノートライフパートナーズ）は自社の子会社のため結んでいません。【株式の保有状況】は該当事項なしと印字されており、保有株式を根拠とするリンクはありません。
- terms: 助言のみ: 用語候補として ライフイベントマーケティング（LEM）、ファミリーデータ、ファミリーデータベース、インサイドセールス、送客、LTV（顧客生涯価値）、一次データ、保険代理店、共同募集 などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
