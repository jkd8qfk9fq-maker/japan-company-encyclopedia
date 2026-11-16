# シンシア — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社シンシア |
| 証券コード | 7782 |
| docID（データを取り出した文書） | `S100XUH3` |
| 原本 docID | `S100XUH3` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUH3.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社シンシア / 7782 / docID S100XUH3（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sincere: 10 件の数値を有報XBRLと照合
有報: 株式会社シンシア 有価証券報告書－第18期(2025/01/01－2025/12/31) (docID S100XUH3)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sincere: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記3（第18期の潜在株式調整後1株当たり当期純利益は潜在株式が存在しないため記載していない旨）は表示上の事項のためfinancialNotesには付けていない。注記1（収益認識基準の第15期からの適用）は2022年12月期のfinancialNoteとして、注記2（企業結合に係る暫定的な会計処理の確定と第16期数値への反映）は2023年12月期のfinancialNoteとして付けた。
- businessModel: 経営方針に印字された目標とする経営指標（売上高と利益に関する指標）は投資指標の目標であるため、戦略の文章には転記せず、存在のみをここに記録する。利益率の数値も転記していない。
- businessModel: MD&Aの利益項目の金額とその理由は本文に書いていない。親会社株主に帰属する当期純利益の減少理由としてMD&Aに印字された、コンサルティング事業の受注先である医療脱毛クリニックへの貸付金に関する引当金の計上についても、利益項目の内訳に触れるため本文には書いていない。
- businessModel: 2025年3月に連結子会社のカラコンワークスがフリュー株式会社からカラーコンタクトレンズ販売事業を譲り受けた件は、期中の出来事であり期末の構造に反映済みのため、needsReviewではなく沿革とrelatedCompaniesに記録した。
- businessModel: 重要な後発事象（連結・個別とも）および重要な契約等は「該当事項はありません」と印字されている。継続企業の前提に関する記載は印字されていない。
- businessStructure: セグメント別の金額はセグメント情報の外部顧客への売上高（千円）を百万円に切捨てたもの。コンタクトレンズ事業の内訳の切捨て後の合計（3,432＋830＋1,993＋708＋10＝6,973百万円）は同事業の6,976百万円と3百万円の切捨て差異があり、3事業の切捨て後の合計（6,976＋31＋448＝7,455百万円）は連結売上高7,456百万円と1百万円の切捨て差異がある。いずれも印字の数値をそのまま記載した。
- businessStructure: suppliersキーは旧スキーマのため省略した。個別の仕入先の印字はなく、商品仕入実績はセグメント別の金額のみが印字されている。
- businessStructure: グループ構成は、当社と連結子会社5社（カラコンワークス、Sincere Vision Co., Ltd.、新視野光學股份有限公司、ジェネリックコーポレーション、タロスシステムズ）。親会社の株式会社ユカリアとは事業上の取引関係はない旨が事業の内容に印字されている。
- businessStructure: 主要な顧客である株式会社パレンテ、株式会社ビジョナリーホールディングス、HOYA株式会社アイケアカンパニーは関連候補にないため結んでいない（関連情報に顧客として印字されている）。
- history: 沿革のうち次は採らなかった：2008年の東京都中央区への移転、2021年の東京都文京区への本社移転、2014年のSINCERE LENS SDN. BHD.（マレーシア）とSincere Vision (Thailand) Co., Ltd.（タイ）の設立、個別商品の発売の多く（2week CANVIEW、L-CON 1DAY POP、FAIRY 1day、Ultimate 1DAY PEARL、Ultimate 2week PEARL、L-CON 2WEEK UV、Miche Bloomin'、Select FAIRY、L-CON 1DAY MOISTURE、EYE BEAUTY 2week、select fairy monthly、Select FAIRY USER SELECT、EYEDDiCT by FAIRY、1day Eye Well、Miche Bloomin' Monthly、L-CON 1DAY 55、SINCERE 1DAY S、EYEDDiCT by FAIRY HYDROUS、FAIRY 1day Shimmeringシリーズ、SINCERE 2WEEK S、1day Eye Well 55、SINCERE 1DAY S Cleché、Pranair、2week Eye Well、FAIRY 1day NEUTRALシリーズ、SINCERE 2WEEK S Cleché、FAIRY 1month）。資本金の金額は沿革に書いていない。
- history: Wikipediaは使用していない（証拠パックのみで作成した）。
- industry: 主たる業界は、コンタクトレンズ（高度管理医療機器）の製造・販売が事業の中心であるため、閉じた分類に医療機器を表す区分がなく、医療分野に最も近いpharmaceuticalsを暫定とした（プレシジョン・システム・サイエンス、星医療酸器の先例）。システム事業（リユース業界向けパッケージシステム）はitを直接の当てはめとして副次的に付けた。コンサルティング事業（医療脱毛クリニック運営支援、売上高31百万円）は当てはまる区分がなく付けていない。在ツリーのtaxonomy-gaps.tsvにsincereの行はない。
- relatedCompanies: eucalia（ユカリア、286A）: 【関係会社の状況】に親会社として印字され、有価証券報告書の提出会社であるため結んだ。事業上の取引関係はない旨が【事業の内容】に印字されている。
- relatedCompanies: furyu（フリュー、6238）: 2025年3月のカラーコンタクトレンズ販売事業の譲受という個別の取引が沿革・経営方針・MD&Aに印字されているため結んだ。譲受の金額は説明に書いていない。
- relatedCompanies: land（8918）: 「ブランド」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: port（7047）: 「サポート」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: ricoh（7752）: 「シリコーンハイドロゲル」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: base-4481（4481）: 「営業利益ベース」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: corona（5909）: 「新型コロナウイルス」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: eyez（5242）: 沿革の「株式会社フォー・アイズ」（コンサルティング事業の譲渡元）との名称の一致であり、株式会社アイズとは別の法人で、関係の印字もないため結ばなかった。
- relatedCompanies: seki（7857・ambiguous指定）: 「情報セキュリティ」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: vision（9416）: 「経営ビジョン」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: 株式会社パレンテ、株式会社ビジョナリーホールディングス（いずれも主要な顧客として関連情報に印字）、HOYA株式会社アイケアカンパニー（HOYA株式会社の一部門として主要な顧客に印字）、医療法人緑風会（コンサルティング事業の支援先）、株式会社フォー・アイズ（2022年のコンサルティング事業の譲渡元、非上場）。
- relatedCompanies: 連結子会社5社（カラコンワークス、Sincere Vision Co., Ltd.、新視野光學股份有限公司、ジェネリックコーポレーション、タロスシステムズ）は自社グループ会社のため対象外とした。
- terms: 助言: 用語「シリコーンハイドロゲル」は、酸素透過性を高めたコンタクトレンズの素材で、同社の主力商品である「シンシアSシリーズ」に用いられています。本文では有報の表記のまま記載しました。
- terms: 助言: 用語「プライベートブランド」は、小売店等が自社ブランドとして販売する商品のことで、同社は量販店向けにクリアレンズとカラーレンズを供給しています。
- terms: 助言: 用語「サークルレンズ」は、黒目を大きく見せるための着色が施されたコンタクトレンズで、カラーコンタクトレンズの一種です。
- terms: 助言: 用語「乱視用」は、乱視の矯正に対応したコンタクトレンズのことで、同社は2025年2月に「SINCERE 1DAY S 乱視用」を発売しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] シンシアの主たる業界（コンタクトレンズ） → 提案: healthcare（コンタクトレンズ等の医療機器）。主事業は、コンタクトレンズ（高度管理医療機器）の製造・販売であり、2025年12月期の外部顧客への売上高6,976百万円と全体の9割超を占めます。医薬品の開発・製造は行っていません。閉じた分類の19種に医療機器を表す区分がなく、医療分野に最も近い pharmaceuticals を暫定としました。
