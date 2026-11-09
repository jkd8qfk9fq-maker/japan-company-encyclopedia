# サカタインクス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | サカタインクス株式会社 |
| 証券コード | 4633 |
| docID（データを取り出した文書） | `S100XSP9` |
| 原本 docID | `S100XSP9` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSP9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | サカタインクス株式会社 / 4633 / docID S100XSP9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sakata-inx: 10 件の数値を有報XBRLと照合
有報: サカタインクス株式会社 有価証券報告書－第148期(2025/01/01－2025/12/31) (docID S100XSP9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sakata-inx: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造、販売などの費用を差し引いた残りが利益になります。2025年12月期のは1…）
- 確認: [other-profit-wording] financials[3].note: 売上高と当期純利益以外の利益に触れていないか確認する（…7期（2024年12月期）より、連結損益計算書の営業外収益の「その他」に計上…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は経営指標等の注記（注2・注3・注4）に基づく。注3の受取ロイヤリティーの売上高への組替えと注4の法人税等会計基準の遡及適用が、証拠パックの「遡及適用」警告の該当箇所である。前期有報との修正再表示チェックは全行一致しており、数値の誤りではないため needsReview ではなく financialNotes に記録した。
- businessModel: 重要な後発事象は、2026年2月12日の取締役会で決議された自己株式の取得のみで、通常の資本政策であり2025年12月31日現在の記述に影響しないため warnings に記録するにとどめた。
- businessModel: 2025年12月期の純利益の増加理由としてMD&Aが挙げる投資有価証券売却益（特別利益に当たるもの）は、文章規則により本文には書いていない。
- businessModel: Wikipedia の冒頭には本社所在地の補足があったが、有報の表紙・最寄りの連絡場所で足りるため、出典として使わなかった（順位の数値は規則により使わない）。
- businessStructure: 事業の並び順は、セグメント注記の2025年12月期の外部顧客への売上高の大きい順（米州101,117百万円、アジア56,008百万円、日本49,318百万円、欧州20,861百万円、機能性材料20,331百万円）。「その他」は有報が報告セグメントに含まれない区分と明記するため最後に置いた。
- businessStructure: 印刷インキ・機材（日本）の子区分（印刷インキ／印刷用機材）は【事業の内容】の事業区分によるが、金額は区分ごとに独立して開示されていないため金額を書いていない（【関連情報】の製品区分の金額はグループ全体のもので、日本セグメントの内訳ではない）。
- businessStructure: 2025年12月期より全社費用の配分基準が見直され、前期のセグメント情報は変更後の方法で作成されているが、これはセグメント利益の配分方法の変更であり、売上高の並び順には影響しないため、warnings に記録するにとどめた。
- history: 沿革表は年月と事象が対応して印字されており、崩れた表ではないため、全行を年順に採用した。資本金額は文章規則により省いた。
- history: 2015年の決算期変更は2015年12月期より前の出来事であり、現在の5年間の数値（2021年12月期以降はいずれも12月決算）には影響しないため、沿革に記録するにとどめ、needsReview には入れなかった。
- industry: 主たる業界は chemicals: 報告セグメントはすべて印刷インキと機能性材料（いずれも化学製品の製造販売）で、印刷インキ関係が売上高の大半を占める。
- industry: electronics は付けなかった。機能性材料のカラーフィルター用顔料分散液などは画像表示材料の素材供給であり、電子部品そのものの事業として開示されていないため。
- relatedCompanies: 結ばなかった候補（銀行・金融機関）: resona-holdings、mitsubishi-ufj-financial-group、sumitomo-mitsui-financial-group、sumitomo-mitsui-trust-group — いずれも「主要な取引金融機関であり、円滑な資金調達を目的として保有」と印字される資金調達目的のため結ばない。
- relatedCompanies: 結ばなかった候補（当事業年度に全株売却済み）: dai-nippon-printing、daio-paper、harima-chemicals-group、ishihara-sangyo-kaisha、koyosha、matsumoto、mitsubishi-chemical-group、nozaki-insatsu-shigyo、ohishi-sangyo、sasatoku-printing、chuetsu-pulp-and-paper — 特定投資株式の表で当事業年度の株式数が「－」となり、政策保有株式縮減の観点から売却したと印字されているため結ばない。
- relatedCompanies: 結ばなかった候補: nippon-paper-industries — 印刷インキ事業における取引先と印字されるが、保有は297株・貸借対照表計上額0百万円と僅少で、取引関係の裏付けとして不足するため結ばない。
- relatedCompanies: 結ばなかった候補: kobe-bussan — 【大株主の状況】に載るのは「有限会社神戸物産」（2.88％、2025年12月31日現在）で、上場している株式会社神戸物産とは別の法人であり、同一性が確認できないため結ばない。大株主のうち事業会社は他に株式会社朝日新聞社（2.40％）があるが候補リストにない。
- relatedCompanies: 結ばなかった候補（一般語・断片の一致）: career（キャリア形成）、vision（長期ビジョン『SAKATA INX VISION 2030』）、land（サカタブランドソリューションズ・ブランド）、base-4481（時価ベース）、innovation（イノベーションを生み出すという理念文）、seki（サイバーセキュリティ、ambiguous）、ray（ディスプレイサービス）、port（サポート）、en（ambiguous）、rent（タレントマネジメント）、path（キャリアパス）、zero（違反件数ゼロ、ambiguous）、core（コア事業、ambiguous）、ishin（インターナルカーボンプライシング）、king（ワーキング）、freee（PFASフリー）— 有報に当該企業への言及はない。
- relatedCompanies: 結ばなかった候補: nissin — コードリストにない相手で、一致箇所は朝日新聞社の表記の一部であり、当該企業への言及ではない。
- relatedCompanies: 候補リストにない関連会社: ロジコネット株式会社（持分法適用関連会社、議決権50.00％、物流業務全般の委託）とTAIWAN SAKATA INX CORP.（持分法適用関連会社、50.00％）は未上場で候補にないため結べない。【関係会社の状況】に印字されている。
- relatedCompanies: hiraga は候補リストで ambiguous だが、特定投資株式の表に株式会社平賀として保有目的（印刷インキ事業における取引先）と株式数20,000株が印字されており、同一性と関係性の両方が確認できるため結んだ。
- terms: 登録候補（助言のみ）: フレキソインキ（柔らかい樹脂版を使うフレキソ印刷用のインキ。食品包装などのフィルム印刷に使われる）、グラビアインキ（凹版（グラビア印刷）用のインキ。パッケージの写真印刷などに使われる）、メタルインキ（飲料缶などの金属への印刷用インキ）、ボタニカルインキ（植物由来の原料を使った環境配慮型インキのシリーズ）、顔料分散液（顔料を液体の中に均一に分散させた材料。カラーフィルター用などに使う）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
