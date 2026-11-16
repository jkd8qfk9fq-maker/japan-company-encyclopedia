# プレシジョン・システム・サイエンス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | プレシジョン・システム・サイエンス株式会社 |
| 証券コード | 7707 |
| docID（データを取り出した文書） | `S100Z33F` |
| 原本 docID | `S100Z33F` |
| 提出日（原本） | 2026-09-18 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z33F.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | プレシジョン・システム・サイエンス株式会社 / 7707 / docID S100Z33F（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
precision-system-science: 10 件の数値を有報XBRLと照合
有報: プレシジョン・システム・サイエンス株式会社 有価証券報告書－第41期(2025/07/01－2026/06/30) (docID S100Z33F)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
precision-system-science: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記は、潜在株式が存在しないため希薄化後の数値を記載していない旨と、損失計上年度の自己資本利益率・株価収益率を記載していない旨の2点のみで、いずれも表示上の事項のためfinancialNotesには付けていない。
- businessModel: 経営方針の「目標とする経営指標」（2027年６月期の連結売上高・利益水準の数値目標や、2026年８月14日発表の決算短信における翌期予想）は投資指標の目標であるため、戦略の文章には転記せず、存在のみをここに記録する。粗利率・利益率の数値目標も同様に転記していない。
- businessModel: MD&Aの利益項目の金額とその理由は本文に書いていない。製品区分別の売上高はセグメント情報の関連情報（製品及びサービスごとの情報）の外部顧客への売上高を用いた。PSSプラットフォームの売上高1,901百万円はMD&Aの印字（百万円単位）である。
- businessModel: 受注実績の受注高・受注残高は受注高の金額であるため本文には書いていない。ELITech Group S.p.Aとのコミットメント契約の総額も本文には書いていない。
- businessModel: 重要な後発事象は連結・個別のいずれも「該当事項はありません」。継続企業の前提に関する注記も財務諸表にはない（事業等のリスクにおける重要事象等の解消の記載はneedsReviewに記録した）。
- businessModel: エヌピーエスからの試薬製造・消耗材製造事業の吸収分割による承継（2025年９月１日効力発生）、同社の持分法適用関連会社化、米国子会社Precision System Science USA, Inc.の清算結了（2026年３月）はいずれも当事業年度内の事象であり、期末時点の構造に反映されているため、沿革と事業の内容に記録し、needsReviewには入れていない。
- businessModel: industryPositionは、有報に市場における順位やシェアの印字がないため省いた。Wikipediaは有報と重なる事実の確認にとどめ、出典として使わなかった。
- businessStructure: 当社グループは単一セグメントのため、事業は1つとし、製品区分（装置、試薬・消耗品、サービス・その他）を子事業とした。製品区分別の売上高はセグメント情報の関連情報（製品及びサービスごとの情報）の外部顧客への売上高を用い、切捨て後の合計（2,231＋2,037＋948）は連結売上高5,216百万円と一致する。
- businessStructure: suppliersキーは旧スキーマのため省略した。装置・消耗品・試薬の製造は持分法適用関連会社のエヌピーエス株式会社が担ってきたが、試薬製造及び消耗材製造事業は2025年９月１日に吸収分割により当社が承継した。
- businessStructure: グループ構成は、当社、連結子会社１社（Precision System Science Europe GmbH、欧州販売）、持分法適用関連会社１社（エヌピーエス株式会社、議決権の所有割合49.0％）である。米国子会社Precision System Science USA, Inc.は2026年３月に清算結了したため期末時点のグループには含まれていない。
- history: 沿革は年月と事象が同じ行に印字されているため行順の対応づけは不要であった。資本金額は記載していない。年月は有報の印字どおり年までとし、月は記載していない（2014年の項目が2件あるのは大館試薬センター新設とELITech Groupとの契約を分けたため）。
- history: 落とした行: 本社所在地の移転（1986年府中市、1993年稲城市）、1991年の松戸研究所設置、OEM契約のうちF.Hoffmann-La Roche Ltd.（1997年）、Boehringer Mannheim GmbH（1998年）、Magnetic Biosolutions Sweden AB（2000年）、QIAGEN（2002年）、株式会社LSIメディエンス（2004年）、Invitrogen Corporation（2006年）、Beckman Coulter, Inc.（2006年）、NanoString Technologies, Inc.（2007年）、GEヘルスケアバイオサイエンスとの国内独占販売契約（2007年）、Diasorin Ireland, Ltd.との装置供給契約（2013年）、Elitech Groupとの開発販売契約（2013年）、Roka Bioscience, Inc.との供給契約（2014年）、Abbott Molecular, Inc.との製品供給契約（2014年）、エヌピーエス株式会社の株式取得（2009年・2012年・2016年。2025年の事業承継に含めた）、ユニバーサル・バイオ・リサーチ株式会社の設立（2002年）と株式譲渡による連結除外（2024年）、JASDAQスタンダード市場への移行（2010年）、補助金の採択（2020年）、受賞（2020年・2021年）、PSS新宿ラボラトリーの衛生検査所登録と閉鎖（2021年・2025年）、株式会社PF・BioLineの設立（2022年）と清算結了（2025年）。
- industry: 主たる業界は、遺伝子検査の自動化装置と体外診断用試薬・消耗品の事業であるため、閉じた分類に体外診断・医療機器を表す区分がなく、医療分野に最も近いpharmaceuticalsを暫定とした（星医療酸器、adr120s、japan-medical-dynamic-marketingの先例）。単一セグメントのため副次的な業界は付けていない。在ツリーのtaxonomy-gaps.tsvにprecision-system-scienceの行はない。
- relatedCompanies: ferrotec（株式会社フェローテック、6890）: 2022年12月に合弁会社株式会社PF・BioLineを設立したが、同社は2025年３月に清算結了しており、現在の取引・提携関係の印字はないため結ばなかった。
- relatedCompanies: toyobo（東洋紡、3101）: 1996年８月に核酸（DNA）自動抽出装置等に関するOEM契約を締結したことは沿革に印字されているが、2026年６月30日現在の主なODM契約の相手方には含まれておらず、現在の関係の印字はないため結ばなかった。
- relatedCompanies: technologies（株式会社テクノロジーズ、5248）: 「日立ハイテクノロジーズ」の部分一致であり、別の法人である。2017年５月の資本業務提携の相手方である株式会社日立ハイテクは関連候補の一覧にないため結ばなかった。
- relatedCompanies: the-lead（株式会社リード、6982）: 製品名「geneLEAD（ジーンリード）」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: step（株式会社ステップ、9795）: 収益認識の「5ステップアプローチ」の一般語との一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: en（エン株式会社、4849）: 一般語・部分一致であり（ambiguous指定）、関係の印字はないため結ばなかった。
- relatedCompanies: seki（セキ株式会社、7857）: 「情報セキュリティ」等の部分一致であり（ambiguous指定）、関係の印字はないため結ばなかった。
- relatedCompanies: cota（コタ株式会社、4923）: 「インコタームズ」の部分一致であり（ambiguous指定）、関係の印字はないため結ばなかった。
- relatedCompanies: land（株式会社ランド、8918）: 「相手先ブランド」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社、4481）: 「時価ベースの自己資本比率」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: port（ポート株式会社、7047）: 「サポート」の部分一致であり、関係の印字はないため結ばなかった。
- relatedCompanies: suzuki-6785（株式会社鈴木、6785）: 役員の氏名「鈴木泰浩」との一致であり（ambiguous指定）、関係の印字はないため結ばなかった。
- relatedCompanies: 候補にないため結ばなかった相手: ELITech Group S.p.A（主要な顧客でありODM契約の相手方。売上高の62.4％）、PHC株式会社（主要な顧客であり、2025年６月20日にODM契約を締結）、Thermo Fisher Scientific Inc.、QIAGEN GmbH、Bruker Spatial Biology, Inc.（いずれも現在のODM契約の相手方）、ユニバーサル・バイオ・リサーチ株式会社（対象特許の無償・無期限の実施許諾契約と共同研究開発の相手方。2024年８月に株式譲渡により連結除外された元子会社）。
- relatedCompanies: 連結子会社（Precision System Science Europe GmbH）と持分法適用関連会社（エヌピーエス株式会社）は自社グループ会社のため対象外とした。売上高の10％以上を占める主要な顧客はELITech Group S.p.AとPHC株式会社である旨がセグメントの関連情報に印字されている。
- terms: 助言: 用語「マグトレーション・テクノロジー」は、同社が開発した磁性体粒子法を利用した核酸抽出等の基盤技術の名称で、日本・米国・欧州等で特許を出願しています。本文では有報の表記のまま記載しました。
- terms: 助言: 用語「PSSプラットフォーム」は、当社製の核酸抽出試薬を使用する遺伝子検査向け装置群の総称で、装置の設置台数の蓄積が試薬・消耗品の継続販売につながる事業構造の中核です。
- terms: 助言: 用語「ODM」は、製品設計の段階から受託した相手先ブランドによる販売のことで、同社事業の中心的な販売形態です。有報の定義のまま本文で説明しています。
- terms: 助言: 用語「geneLEAD」は、同社の全自動PCR検査装置の製品シリーズ名です。

## 要確認（status に反映）

- businessModel: 事業等のリスクに、継続企業の前提に関する重要事象等について、当連結会計年度において利益を計上し、それを支える売上高も当期以降堅調に伸長することが見込まれること、また資金面においては取引金融機関との良好な関係の下で当面必要な資金は確保していることから、継続企業の前提に重要な疑義を生じさせるような事象又は状況はすでに解消したものと判断した旨が記載されています。本登録は2026年６月期の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] プレシジョン・システム・サイエンスの主たる業界（遺伝子検査自動化装置・試薬） → 提案: healthcare（体外診断用自動化装置・試薬・消耗品）。主事業は、遺伝子検査向けの自動化装置（2026年6月期の外部顧客への売上高2,231百万円）と、核酸抽出試薬・PCR試薬や専用プラスチック消耗品（同2,037百万円）の開発・製造販売であり、医薬品の開発・製造は行っていません。閉じた分類の19種に体外診断・医療機器を表す区分がなく、医療分野に最も近い pharmaceuticals を暫定としました。
