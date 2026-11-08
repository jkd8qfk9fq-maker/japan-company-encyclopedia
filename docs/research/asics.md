# アシックス — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アシックス |
| 証券コード | 7936 |
| docID（データを取り出した文書） | `S100XOKI` |
| 原本 docID | `S100XOKI` |
| 提出日（原本） | 2026-03-04 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XOKI.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B9

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アシックス / 7936 / docID S100XOKI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 29 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 3 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
asics: 10 件の数値を有報XBRLと照合
有報: 株式会社アシックス 有価証券報告書－第72期(2025/01/01－2025/12/31) (docID S100XOKI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
asics: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…地域で売上が成長したことなどにより、利益を確保しています。2025年12月期…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は、経営指標等の注記（「収益認識に関する会計基準」等を第69期＝2022年12月期の期首から適用）の事実だけを書いた。
- businessModel: 証拠パックの注意（本文に財務諸表の組替えの記載がある）について、パック内の sections.txt を「組替」「表示方法の変更」で探したが、前期の財務諸表の組替えを示す注記は見つからなかった（その他の包括利益に関する組替調整額の節があるのみ）。前期有報との修正再表示チェックも全項目一致だったため、組替えに関する basis は書かなかった。
- businessModel: 経営方針・MD&A にある2026年12月期の計画（売上高9,500億円など）は将来の計画であるため、本文の数値には使わなかった。
- businessModel: MD&A のカテゴリー別・地域別の利益（営業利益・セグメント利益・カテゴリー利益）は、文章の規則により金額・増減率とも本文に書かなかった。書いたのは売上高と親会社株主に帰属する当期純利益だけである。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2025年12月期）の大きい順（欧州地域225,805百万円、日本地域156,385百万円、北米地域141,192百万円、中華圏地域120,236百万円、その他地域52,077百万円、東南・南アジア地域49,745百万円、オセアニア地域49,649百万円）。「その他」は有報が報告セグメントに含まれないと書く区分（ランニングサービス事業・スポーツ施設運営事業）のため最後に置いた。
- businessStructure: アシックスはスポーツ用品の製造販売が単一の事業であり、報告セグメントは地域別に分かれているため、地域を事業として立てた。製品及びサービスごとの情報は、有報が同種・同系列のスポーツ用品を専ら製造販売しているとして記載を省略している。
- businessStructure: listings の market は表紙の印字「東京証券取引所プライム市場」から「プライム」とした。
- history: 沿革表は年月と事象が連結した印字だったため、行順で対応づけた。
- history: 創業者の鬼塚喜八郎の氏名は有報に印字がなく、Wikipedia の抜粋（1949年に鬼塚喜八郎が鬼塚商会を設立）から補足し、出典を並記した。数値は Wikipedia からは使っていない。
- history: 個別の子会社設立・販売会社の再編・認証取得などは主要な節目に絞って省いた（例: 1953年タイガーゴム工業所開所、1975年オニツカタイガー有限会社設立、1986年アシックスタイガーオセアニア設立、2001年アシックス歩人館設立、2012年アシックスアジアPTE.LTD.設立とアシックスジャパン株式会社設立、2021年Registration Logic Pty Ltd.の子会社化、2022年アールビーズの連結子会社化、2024年ASICS Creation Center LLC.設立、2025年DPTK INNOVACION Y TECNOLOGIA SLの子会社化）。
- history: 2026年1月の山陰アシックス工業の商号変更は決算日（2025年12月31日）後の出来事だが、有報の沿革と関係会社の状況に印字されているため沿革に入れた。本文のエントリーは2025年12月31日現在の体制を前提に書いている。
- industry: 主たる業界は暫定で retail とした。スポーツ用品の製造販売という事業の中身に合う値が閉じた分類にないためで、詳しくは taxonomyGaps に記録した。掲載済みのヨネックス（スポーツ用品メーカー）も同じ事情で retail を暫定とし、同じ区分の新設が提案されている。
- industry: 地域別の報告セグメントはすべて同じスポーツ用品事業であり、金額が独立して開示された別事業がないため、業界は1つだけにした。
- relatedCompanies: ランド（land）: 「アシックスブランド」等の一般語の部分一致のみで、会社としての関係の記載がない。
- relatedCompanies: エン（en、ambiguous）: 「ブランドエンゲージメント」等の一般語への一致のみ。
- relatedCompanies: キャリア（career）: 「女性のキャリアアップ」等の一般語への一致のみ。
- relatedCompanies: イノベーション（innovation）: 「商品イノベーション」等の一般語への一致のみ。
- relatedCompanies: ゼロ（zero、ambiguous）: 「温室効果ガス排出量実質ゼロ」の一般語への一致のみ。
- relatedCompanies: コア（core、ambiguous）: 「コア事業」の一般語への一致のみ。
- relatedCompanies: ポート（port）: 「神戸ポートアイランド」の地名への一致のみ。
- relatedCompanies: ビジョン（vision）: 「ビジョン」の一般語への一致のみ。
- relatedCompanies: キング（king）: 「ウォーキング」の一般語への一致のみ。
- relatedCompanies: No．1（no-1）: 「シェアNo.1」の表現への一致のみ。
- relatedCompanies: ベース（base-4481）: 「連結ベース」の一般語への一致のみ。
- relatedCompanies: レント（rent）: 「タレントマネジメント」の一般語への一致のみ。
- relatedCompanies: トラスト（trust）: listing が上場ではない（コードリストにない）うえ、「グローバル反トラスト・競争方針」の一般語への一致のみ。
- relatedCompanies: カバー（cover）: 「全地域をカバー」の一般語への一致のみ。
- relatedCompanies: レイ（ray、ambiguous）: 「アシックス・プレイシュア」「レース登録」の部分一致のみ。
- relatedCompanies: セキ（seki、ambiguous）: 一般語への一致のみで、会社としての関係の記載がない。
- relatedCompanies: ステップ（step）: 「主要なステップ」の一般語への一致のみ。
- relatedCompanies: リード（the-lead）: 「ビジネスをリードできる人財」の一般語への一致のみ。
- relatedCompanies: パス（path、ambiguous）: 「キャリアパス」の一般語への一致のみ。
- relatedCompanies: アイル（i-ll）: 「アイルランド」の国名への一致のみ。
- relatedCompanies: スローガン（slogan）: 「ブランド・スローガン」の一般語への一致のみ。
- relatedCompanies: フロンティア（frontier）: 文脈は2016年の大牟田工場の全事業の承継先である帝人フロンティアアパレル工業株式会社（帝人の子会社）で、フロンティア株式会社そのものへの記載ではない。
- relatedCompanies: レック（lec）: 「アシックス・スポーツコンプレックス」の部分一致のみ。
- relatedCompanies: 丸紅（marubeni、ambiguous）: 文脈は2015年にアシックス物流株式会社の全株式を譲渡した先の丸紅ロジスティクス株式会社（丸紅の子会社）で、丸紅株式会社自身との継続的な取引・提携の記載はなく、過去1回限りの譲渡のため結ばなかった。
- relatedCompanies: 日本テレビホールディングス（nippon-television-holdings）: 2022年に株式会社アールビーズの株式を共同で取得したという沿革の記載のみで、現在の有報に継続的な取引・提携の具体的な記載がないため結ばなかった。
- relatedCompanies: 帝人（teijin、ambiguous）: 文脈は子会社の帝人フロンティアアパレル工業株式会社への事業承継（2016年）で、帝人株式会社自身との取引・提携の記載はない。
- relatedCompanies: 大株主の状況（2025年12月31日現在）に載るのは信託銀行・カストディ銀行・海外の機関投資家のみで、事業会社はないため、major-shareholder として結ぶ相手はなかった。
- relatedCompanies: 政策保有株式（上場株式）は全て売却済みで、今後も保有しない方針が書かれており、特定投資株式の記載もない。
- relatedCompanies: 関係会社の状況に載るのは全て非上場の連結子会社（アシックスジャパン、アシックス商事、アシックスアメリカコーポレーションなど）で、related-candidates には含まれていない。
- terms: 助言: 「オニツカタイガー」は有報で独立したカテゴリーとして売上高が開示されるブランド名で、登録候補になり得ます。
- terms: 助言: 「ランニングエコシステム」は、レース登録からレース後までランナーを支える仕組みを指す当社固有の言い方として有報の複数箇所で使われており、登録候補になり得ます。
- terms: 助言: 「スポーツ工学研究所」は当社の研究開発拠点の固有名詞ですが、事業を説明する一般用語ではないため、登録候補にはしませんでした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] アシックス（スポーツ用品メーカー）の業界 → 提案: スポーツ・レジャー用品（スポーツ用品メーカー）。有報はスポーツ用品等の製造販売を主な事業としており、2025年12月期の連結売上高810,916百万円の大半がスポーツ用品です。自社で企画・開発したブランド製品を、地域ごとの販売子会社や直販を通じて国内外で売るメーカーで、閉じた集合の19種のどれにも製造業としては当てはまりません。小売は「最終のお客様に自社ブランドの商品を届ける」という点で近いだけで、事業の中身（競技用シューズなどのものづくり）を言い表せていません。掲載済みのヨネックスも同じ事情で retail を暫定としており、数値のみ登録の企業には美津濃、ゴールドウインなどスポーツ用品に関わる会社があって、同じ事情が及ぶ可能性があります。
