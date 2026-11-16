# ホットリンク — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ホットリンク |
| 証券コード | 3680 |
| docID（データを取り出した文書） | `S100XTX2` |
| 原本 docID | `S100XTX2` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTX2.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%9B%E3%83%83%E3%83%88%E3%83%AA%E3%83%B3%E3%82%AF

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ホットリンク / 3680 / docID S100XTX2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hotto-link: 10 件の数値を有報XBRLと照合
有報: 株式会社ホットリンク 有価証券報告書－第27期(2025/01/01－2025/12/31) (docID S100XTX2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hotto-link: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 非継続事業の確認: 証拠パックの注意に基づき本文を確認したところ、「非継続事業」の語は会計方針におけるIFRS第5号（「売却目的で保有する非流動資産及び非継続事業」）の名称の引用のみで、当連結会計年度・前連結会計年度に非継続事業に分類された事業や処分グループの記載はない。したがって financialNotes への記載は不要と判断した。前期有報との修正再表示チェックは全6系列で差異ゼロであった。
- businessModel: 主要な経営指標等の注記（第26期以降は潜在株式が存在しないため希薄化後の1株当たり当期利益を記載していないこと、当期損失の期は持分当期利益率と株価収益率を記載していないこと）は表示・開示上の説明であり、会計基準の変更や決算期の変更ではないため financialNotes には入れていない。決算期の変更もない。
- businessModel: 注記事項（後発事象）に印字された自己株式の取得は、2025年11月14日の取締役会決議に基づき当連結会計年度中に実施された資本政策であり、グループ構成の変更ではないため needsReview には入れず、ここに記録する（株数・金額は書いていない）。
- businessModel: MD&Aの段階利益の金額や増減率、EBITDA・調整後EBITDA、減損損失、キャッシュ・フローの金額、総資産・資本の金額は本文に書いていない（本文の金額は売上高と当期純損失のみ）。
- businessModel: 会社が重視する指標として売上高・売上成長率・営業利益率が印字されているが、利益率などの投資・利益指標は本文にも perspectives にも書いていない。industryPosition は、自社の順位や市場占有率の印字がないため省いた。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。【事業の内容】に個別の仕入先名の印字はない。
- businessStructure: 【関係会社の状況】には連結子会社として Effyis, Inc.、合同会社Nonagon Capital、NONAGON CAPITAL PTE.LTD. の3社が印字され、「その他1社」は社名・事業内容が印字されていないため、子会社として登録していない。
- businessStructure: 設備は、本社（東京都千代田区）とEffyis, Inc.（米国ミシガン州）のいずれもが、設備の表でソーシャルメディアマーケティング支援事業の欄に印字されている。Web3関連事業に結びつく主要な設備の印字はない。帳簿価額は書いていない。
- businessStructure: 子区分（SNSマーケティング支援・DaaS）の金額は、経営成績の分析に印字されたセグメント別売上高の内訳（SNSマーケティング支援事業2,325,937千円、DaaS事業1,315,612千円）に基づく。Effyis, Inc.単体の売上高も1,315,612千円と印字されており、DaaS事業の売上高と一致する。
- businessStructure: 地域別売上高（日本2,335百万円、米国1,315百万円）は地域に関する情報であり、事業区分ではないため事業の金額としては書いていない。
- history: 沿革から省いた項目: 本社移転（2004年・2006年・2009年・2012年・2016年）、受賞（2010年・2011年・2012年の各賞）、株式会社ホットリンクコンサルティングの設立と株式会社トレンドExpressへの商号変更（2013年・2015年）、中国天津・香港の子会社設立（2016年）、トレンドExpressの各サービス開始（2015年・2017年・2018年）、「BuzzSpreader」のリリース（2018年）、東京大学の寄付講座への参画（2018年）、PRIDE指標の受賞・Famieeの支援・SAMURAI Security株式会社への出資（2019年）、上海の子会社設立と事業譲受（2019年・2020年）、「クチコミ＠係長」の機能追加（2009年）。
- history: Wikipediaの補足は2005年の項目の「上場前はオプトの関連会社であった」という経緯のみに使い、数値は一切使っていない。
- history: 沿革に資本金の金額の印字はないため、金額に関する記載はない。
- industry: 主たる業界は、売上高の99％超を占めるソーシャルメディアマーケティング支援事業（SNSデータの収集・分析基盤の提供、分析ツール、データアクセス権の販売）の実体に基づき it とした（直接の適合であり暫定ではない）。
- industry: Web3関連事業は報告セグメントとして金額が開示されているが、閉じた分類にWeb3・ブロックチェーンに当たる区分が無いため副次の業界は付けず、taxonomyGaps に記録した。
- relatedCompanies: port（ポート株式会社）は「レポート」（定期レポート、Nonagon Report等）の部分一致のみで、同社について述べる記載はないため結ばなかった。
- relatedCompanies: step（株式会社ステップ）は収益認識の手順を指す「ステップ」の部分一致のみのため結ばなかった。
- relatedCompanies: career（株式会社キャリア）は「キャリア継続支援」など人事制度の文脈の部分一致のみのため結ばなかった。
- relatedCompanies: en（エン株式会社）はambiguousな候補であり、「エンタープライズ」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: gala（株式会社ガーラ）は、沿革に印字されるのは株式会社ガーラバズ（2008年に電通バズリサーチ事業を譲り受け、2012年に子会社化のうえ吸収合併した別法人）であり、株式会社ガーラそのものについて述べる記載はないため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）は「金融イノベーションビジネスカンファレンス」という催事名の部分一致のみのため結ばなかった。
- relatedCompanies: lec（レック株式会社）は「フレックスタイム」の部分一致のみのため結ばなかった。
- relatedCompanies: nissin（株式会社日新）はコードリストにない相手であり、日付等の断片の一致のみのため結ばなかった。
- relatedCompanies: seki（セキ株式会社）はambiguousな候補であり、「セキュリティ」の部分一致のみのため結ばなかった。
- relatedCompanies: suzuki-6785（株式会社鈴木）はambiguousな候補であり、大株主の鈴木智博氏（個人）の氏名の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）は「営業利益ベース」の部分一致のみのため結ばなかった。
- relatedCompanies: jinushi（地主株式会社）はambiguousな候補であり、「主要な子会社の状況」等の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）はコードリストにない相手であり、大株主の住所にある建物名「神谷町トラストタワー」の部分一致のみのため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）は当社グループのビジョン文の部分一致のみのため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）はambiguousな候補であり、減損測定に関する「ゼロとしております」の部分一致のみのため結ばなかった。
- relatedCompanies: 候補に含まれない相手の記録: 主要な顧客であるSprinklr Inc.（2025年12月期の外部顧客への売上高の10.1％、関連セグメントはソーシャルメディアマーケティング支援事業）は候補に含まれないため結ばなかった（顧客名は businessModel に記載）。
- relatedCompanies: 候補に含まれない相手の記録: 大株主の株式会社Faber Company（2025年12月31日現在6.34％）は非上場で候補に含まれないため結ばなかった。楽天証券株式会社と野村證券株式会社は大株主に載るが、証券会社の純投資・事務口と判断し結ばなかった。
- relatedCompanies: 自社の連結子会社4社（Effyis, Inc.、合同会社Nonagon Capital、NONAGON CAPITAL PTE.LTD. ほか1社）は結ばなかった。当社が保有する株式は非上場株式4銘柄のみで、特定投資株式の該当はない。
- terms: 助言のみ。用語候補: ソーシャル・ビッグデータ、DaaS（データ・アズ・ア・サービス）、SNSマーケティング、バリデーター、DeFi（分散型金融）、クチコミ＠係長、両利きの経営

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ホットリンク（hotto-link）のWeb3関連事業（Web3領域への投資運用事業） → 提案: Web3・ブロックチェーン関連事業。Web3領域への投資運用、バリデーター運用支援、DeFi運用が事業の実体だが、閉じた分類（INDUSTRY_IDS）にWeb3・ブロックチェーンに当たる区分が無いため、分類の不足として記録する。2025年12月期の売上高は9百万円と小さく、主たる業界（it）はソーシャルメディアマーケティング支援事業で決めている。
