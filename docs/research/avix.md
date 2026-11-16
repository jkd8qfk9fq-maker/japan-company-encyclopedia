# アビックス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アビックス株式会社 |
| 証券コード | 7836 |
| docID（データを取り出した文書） | `S100YM6H` |
| 原本 docID | `S100YM6H` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YM6H.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アビックス株式会社 / 7836 / docID S100YM6H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 16 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
avix: 10 件の数値を有報XBRLと照合
有報: アビックス株式会社 有価証券報告書－第37期(2025/04/01－2026/03/31) (docID S100YM6H)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第36期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 前期の窓に 訂正有価証券報告書－第35期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
avix: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記は、潜在株式調整後1株当たり当期純利益の非開示理由（第33期・第34期は損失、第35期以降は潜在株式が存在しない）と損失年度の株価収益率の非開示のみで、いずれも表示上の事項のためfinancialNotesには付けていない。
- businessModel: 前期の窓にある第36期・第35期の訂正有価証券報告書については、証拠パックの修正再表示チェックで前期有報との重複年度が全て一致（差異なし）であることを確認し、主要な経営指標等への影響はないためwarningsのみとした。当期の有報自体に訂正はない。
- businessModel: 経営方針に印字された指標（ROA・ROEの実績値）は投資指標であるため、戦略の文章には転記せず、存在のみをここに記録する。
- businessModel: MD&Aの利益項目の金額と増減理由は本文に書いていない。売上高の増減と理由のみを記載した。
- businessModel: 重要な後発事象と重要な契約等は、抽出した本文の範囲では該当の記載を確認できなかった。沿革に印字された2026年4月の合同会社ａｕａ設立は決算日後の出来事としてneedsReviewに記録した。
- businessModel: Wikipediaの記事は企業一覧ページのみで会社の補足情報が得られなかったため使用していない。
- businessStructure: セグメント別の外部顧客への売上高は、デジタルサイネージ関連事業5,147百万円、Value creating事業258百万円で、千円単位では合計が連結売上高と一致するが、百万円未満を切り捨てると合計5,405百万円となり、連結売上高5,406百万円と1百万円の差が生じる。印字の合計をそのまま用いた。
- businessStructure: デジタルサイネージ関連事業の3部門（機器リース部門・運営部門・情報機器部門）には独立した売上高が開示されていないため、金額は書いていない。
- businessStructure: suppliersキーは旧スキーマのため付けていない。LED表示機の製造は外注先へ委託するファブレス形態である旨を事業の説明とbusinessModelのwarningsに記録した。個別の外注先名は印字されていない。
- history: 沿革の2026年４月の行（連結子会社として合同会社ａｕａを設立）は決算日（2026年３月31日）後の出来事のため沿革には入れず、businessModelのneedsReviewに記録した。
- history: 落とした行：本社移転（1990年逗子、1994年横浜市金沢区、2006年横浜市西区）、アビックス販売株式会社の設立と吸収合併（1990年・1993年）、個別製品の開発・販売開始・設置の各行（タイムスリット、ウェーブライター、ミラクルスリット、ポールビジョン各型、バナービジョン、電光掲示器の鉄道駅設置など多数）、受賞の各行（警察装備資機材開発改善コンクール、ニュービジネス大賞）、新株予約権付社債の発行と第三者割当増資の各行（資本金額に関わるため）、視認者分析サービス「リアルなう」や制作エンジン「TemPo」等のサービス開始の行、監査等委員会設置会社への移行（2023年）。
- history: 2009年・2011年の資本提携・現物出資の行は、資本金額を書かずに事象のみを記録した。
- industry: 主たる業界は、売上高の95％超を占めるデジタルサイネージ関連事業の中核がLED表示機の開発・製造・販売であるためelectronicsを直接の当てはめとした。映像配信やコンテンツ運営、地域メディア「タウンビジョン」の運営など販促・メディア面の事業はmediaを副次的に付けた。閉じた分類への当てはめに不足はないためtaxonomyGapsは付けていない。在ツリーのtaxonomy-gaps.tsvにavixの行はない。
- relatedCompanies: テラスホールディングス：関係会社の状況に「その他の関係会社」として印字され、当社の議決権の35.3％を保有されているが、関連企業候補（related-candidates.json）に含まれていないため結んでいない。
- relatedCompanies: vision：製品名「ポールビジョン」等の部分一致のみで、会社としての記載はないため結んでいない。
- relatedCompanies: en：ambiguousであり、「エンジン」等の一般語の部分一致のため結んでいない。
- relatedCompanies: career：「キャリア」形成支援の一般語としての記載のみのため結んでいない。
- relatedCompanies: king：「ワーキンググループ」等の一般語の部分一致のため結んでいない。
- relatedCompanies: ray：ambiguousであり、「ディスプレイ」等の部分一致のため結んでいない。
- relatedCompanies: corona：「コロナ禍」の記載のみのため結んでいない。
- relatedCompanies: no-1：ビジョン文「デジタルサイネージ業界No.1」の記載のみのため結んでいない。
- relatedCompanies: port：「ポートフォリオ」の部分一致のため結んでいない。
- relatedCompanies: toyota：沿革における2000年・2001年の設置・納入の記載のみで、現在の取引関係の記載がないため結んでいない。
- relatedCompanies: applied-technology：「応用技術」の一般語としての記載のみのため結んでいない。
- relatedCompanies: hyper：「ハイパーローカルメディア」の部分一致のため結んでいない。
- relatedCompanies: matsui-securities：大株主の状況における記載のみで、取引・提携の記載がないため結んでいない。
- relatedCompanies: porters：「ポールビジョン」等の部分一致のため結んでいない。
- relatedCompanies: uss：沿革における2006年の設置の記載のみで、現在の取引関係の記載がないため結んでいない。
- relatedCompanies: 自社の連結子会社（デジタルプロモーション株式会社、SS Lab.株式会社）と持分法適用関連会社（株式会社エクスポルト）は対象外とした。
- terms: 助言: 用語「デジタルサイネージ」は、屋外や店頭などに設置した表示機で映像や情報を発信する仕組みで、同社の主力事業の名称にもなっています。本文では有報の表記のまま用いています。
- terms: 助言: 用語「ファブレス」は、製造設備を自社で保有せず外注先へ製造委託する業務形態で、同社はLED表示機の開発・販売を担うファブレスメーカーと有報に記載されています。

## 要確認（status に反映）

- businessModel: 2026年４月に、連結子会社として神奈川県横浜市西区に合同会社ａｕａを設立しています（沿革に記載）。これは決算日（2026年３月31日）後の出来事であり、本登録は2026年３月期の構造（当社、デジタルプロモーション株式会社、SS Lab.株式会社、株式会社エクスポルトの４社）で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
