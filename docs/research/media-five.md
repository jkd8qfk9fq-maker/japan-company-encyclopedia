# メディアファイブ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | メディアファイブ株式会社 |
| 証券コード | 3824 |
| docID（データを取り出した文書） | `S100YYIA` |
| 原本 docID | `S100YYIA` |
| 提出日（原本） | 2026-08-26 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYIA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | メディアファイブ株式会社 / 3824 / docID S100YYIA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
media-five: 10 件の数値を有報XBRLと照合
有報: メディアファイブ株式会社 有価証券報告書－第30期(2025/06/01－2026/05/31) (docID S100YYIA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
media-five: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNote は１件だけ付けた。主要な経営指標等の推移の注記のうち、連結財務諸表の作成に関する注記（第28期までは連結財務諸表を作成していたため一部項目を記載していない）は開示の基準の変更にあたるため、2024年12月の連結子会社の全株式譲渡による連結除外の事実とあわせて 2025年５月期の financialNote とした。その他の注記（持分法を適用した場合の投資利益の不記載、配当の定時株主総会決議事項であること、潜在株式が存在しないこと、従業員数の定義）は表示事項であり、financialNote にはしていない。
- businessModel: セグメント利益、ＭＤ＆Ａの段階利益の金額と増減理由、キャッシュ・フローの金額、受注高・受注残高の金額、設備の帳簿価額は本文に書いていない。
- businessModel: 経営方針の目標指標（売上総利益率、稼働率の数値目標）は利益率・指標の目標であるため、本文と perspectives のいずれにも書いていない。戦略は定性的に書いた。
- businessModel: 重要な後発事象は、財務諸表の注記に「該当事項はありません」と印字されている。
- businessModel: 売上高の前事業年度比4.4％増は、ＭＤ＆Ａの販売実績の前年同期比104.4％の印字に基づく。
- businessModel: 保育事業の収益と費用は報告セグメントではなく、本文の金額には含めていない（businessStructure の warnings に記録）。
- businessStructure: 設備の状況では、本社（福岡市中央区）の行はＳＥＳ事業・ソリューション事業・全社（共通）が連記され、東京支店（千代田区）の行はＳＥＳ事業・全社（共通）が連記されているため、どちらの事業所も個別の事業には結びつけていない。保育園（福岡市中央区）の行はセグメント欄が「－」である。帳簿価額は書いていない。
- businessStructure: 「メディアファイブ保育園　薬院」の運営は、子育て世代の両立支援と働きやすい職場づくりの一環として行われ、損益計算書では保育事業収益・保育事業費用として扱われている。報告セグメントではないため事業にはしていない。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。【事業の内容】に個別の仕入先名は印字されていない。
- history: 沿革のうち、本社の移転（2000年天神、2010年薬院）、プライバシーマーク付与認定（2007年）、企業向け・個人向けＩＴエンジニア育成事業の開始（2008年）、ＩＳＯ／ＩＥＣ 27001認証取得（2010年）、ＩＴプロ育成スクールの開設・閉鎖（2010年～2012年）、飲食事業「スイス料理ハウゼ」の店舗運営（2016年開始、2019年閉鎖）、東京営業所の移転・支店化（2020年、2023年）と東京支店の移転（2024年）などの細目は省き、ここに列挙した。
- history: 創業時の資本金の金額は書いていない（資本金額は history に書かない規則による）。
- history: Wikipedia の記事「メディアファイブ」は見つかったが、冒頭は本社の所在地と事業の概要を述べるもので、有報に書かれていない補足（旧社名・ブランド名・創業の経緯等）は得られなかったため、出典として使っていない。
- industry: 主たる業界は it とした。ＳＥＳ事業（ＩＴエンジニアの提供による業務支援）とソリューション事業（ソフトウエア開発の受託等）が報告セグメントであり、ＤＥＩの別記事業も CTE であるため直接当てはまる（暫定ではない）。
- industry: ＳＥＳ事業は人材の提供を含むが、顧客のシステム開発・運用を支援するＩＴサービスとして開示されており、人材サービス専業ではないため、human-resources は付けていない。
- relatedCompanies: rakuten-bank（楽天銀行株式会社）は、資金調達や保険取引ではなく、ＳＥＳ事業の販売先として【主要な顧客ごとの情報】に２期連続で印字されているため customer として結んだ。販売金額は説明に書いていない。
- relatedCompanies: 株式会社インフォメーション・ディベロプメントは【主要な顧客ごとの情報】に２期連続で印字される主要な顧客だが、related-candidates.json の候補にないため結んでいない。
- relatedCompanies: en（エン株式会社）は結ばなかった。「エンジニア」等の部分文字列の一致のみである（ambiguous）。
- relatedCompanies: career（株式会社キャリア）は結ばなかった。「キャリアプラン」等の一般的な文言の一致のみである。
- relatedCompanies: seki（セキ株式会社）は結ばなかった。「セキュリティ」の部分文字列の一致のみである（ambiguous）。
- relatedCompanies: port（ポート株式会社）は結ばなかった。「サポート」の部分文字列の一致のみである。
- relatedCompanies: path（パス株式会社）は結ばなかった。「キャリアパス」の部分文字列の一致のみである（ambiguous）。
- relatedCompanies: base-4481（ベース株式会社）は結ばなかった。「営業利益ベース」という一般的な文言の一致のみである。
- relatedCompanies: reskill（株式会社リスキル）は結ばなかった。「リスキル」という一般的な文言の一致のみである。
- relatedCompanies: land（株式会社ランド）は結ばなかった。「ブランド」の部分文字列の一致のみである。
- relatedCompanies: taya（株式会社田谷）は結ばなかった。大株主の住所「世田谷区」の部分一致のみである（ambiguous）。
- relatedCompanies: canon-marketing-japan（キヤノンマーケティングジャパン株式会社）は結ばなかった。【主な資産及び負債の内容】の買掛金の相手先別内訳に名称が載るのみで、取引関係の説明は印字されていない。
- relatedCompanies: hyper（株式会社ハイパー）は結ばなかった。買掛金の相手先別内訳に名称が載るのみで、取引関係の説明は印字されていない。
- relatedCompanies: orix（オリックス株式会社）は結ばなかった。買掛金の相手先別内訳に印字されるのは子会社のオリックス・レンテック株式会社であり、別の法人である。内訳に名称が載るのみで、取引関係の説明も印字されていない。
- relatedCompanies: 大株主の株式会社開心社（所有株式数の割合6.27％、2026年５月31日現在）は事業会社だが、related-candidates.json の候補にないため結んでいない。その他の大株主は個人と社員持株会である。
- relatedCompanies: 特定投資株式は保有していない旨が【株式の保有状況】に印字されている。関係会社は存在しない旨が【関係会社の状況】に印字されている。
- terms: 助言のみ。用語候補: SES、虎の穴研修、OFFICE DOCTOR、アキバ・テックドリーム・アカデミー

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
