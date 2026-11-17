# ウエスコホールディングス — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ウエスコホールディングス |
| 証券コード | 6091 |
| docID（データを取り出した文書） | `S100Z9QH` |
| 原本 docID | `S100Z9QH` |
| 提出日（原本） | 2026-10-26 |
| 決算期 | 2026-07-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z9QH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ウエスコホールディングス / 6091 / docID S100Z9QH（S100WWUT から新しい有報に更新。旧成果物は pipeline/analysis/superseded/wesco-holdings-S100WWUT/） |
| edinet | completed | 0 | pack + draft 再作成（S100Z9QH） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
wesco-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ウエスコホールディングス 有価証券報告書－第13期(2025/08/01－2026/07/31) (docID S100Z9QH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
wesco-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の数値目標（売上高や利益、自己資本利益率などの目標値）は、投資・利益指標の目標のため、本文にも perspectives にも書いていない。
- businessModel: 経営者による分析に印字のある売上高以外の利益の金額と増減率は、本文に書ける数値が売上高と純利益のみのため書いていない。
- businessModel: 連結経営指標等の注記は、潜在株式調整後１株当たり当期純利益を潜在株式が存在しないため記載していないという表示上の事項のみのため、financialNotes は空とした。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されている。重要な契約等も「該当事項はありません」と印字されている。
- businessModel: 配当に関する方針は資本政策のため本文には書いていない。
- businessModel: 当期の有報に訂正はない。前期の有報に対する訂正有報は主要経営指標の数値を変更するものではなく、当期の5年表の前期以前の数値と前期の有報との照合でも差異がなかったため、訂正の扱いは warnings にとどめた。
- businessModel: Wikipedia「ウエスコ (建設コンサルタント)」の冒頭は有報と重なる内容で、補足に使う新しい事実がなかったため使わなかった。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。仕入先・外注先の個別名は有報に印字されていない。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の大きい順とし、報告セグメントに含まれない「その他」は最後に置いた。千円額を百万円へ切り捨てた4区分の合計（16,999百万円）は、印字の連結売上高17,001百万円と2百万円異なる（切り捨ての差）。本文には印字の区分ごとの額と総額をそのまま用いた。
- businessStructure: 複写製本事業の撤退方針の決定は2026年7月期中の出来事のため「その他」の説明に書いた。撤退は完了しておらず、2026年7月31日現在の事業構成は有報の印字どおりとした。
- businessStructure: 主要な顧客として開示されている国土交通省は政府機関で企業ではないため、関連企業には結ばず、顧客の記述にとどめた。
- businessStructure: 設備の帳簿価額は書いていない。拠点と事業の対応は有報のセグメント欄の印字どおりである。
- history: 落とした行: 株式会社ウエスコの沿革のうち、本店の移転（1971年・1972年・1978年）、支社・営業所・事務所の開設（1972年・1974年・1976年・1981年・1982年・1984年・1986年・1988年・1991年・1994年・2011年）、測量業者登録（1970年）と計量証明事業者登録（1987年）は項目化せずここに記録した。
- history: 沿革は当社（持株会社）の沿革と、完全子会社である株式会社ウエスコの沿革の両方が印字されているため、ウエスコの主要な出来事も項目化した。
- industry: 主たる業界は、売上高の8割超を占める総合建設コンサルタント事業から construction とした。水族館運営事業とスポーツ施設運営事業は施設の運営サービスのため、2つ目に entertainment を付けた。
- relatedCompanies: cti-engineering（株式会社建設技術研究所）: 特定投資株式として保有していますが、保有目的は「総合建設コンサルタント事業における業界動向の情報収集」のみで、取引・提携の記述がないため結ばなかった。
- relatedCompanies: chugin-financial-group（株式会社ちゅうぎんフィナンシャルグループ）: 保有目的を純投資目的に変更した銘柄としての言及のみで、現在の特定投資株式にはなく、銀行でもあるため結ばなかった。
- relatedCompanies: the-san-in-godo-bank（株式会社山陰合同銀行）: 保有目的を2024年7月期に純投資目的へ変更しており（取引関係の希薄化が理由と印字）、銀行でもあるため結ばなかった。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 大株主の状況での一致は「光通信KK投資事業有限責任組合」で、株式会社光通信とは別の法的主体であり、投資目的の組合のため結ばなかった。
- relatedCompanies: freee（フリー株式会社）: 「フリー・キャッシュ・フロー」の部分一致のみで、関係の記述がないため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: corona（株式会社コロナ）: 新型コロナウイルス感染症への言及の部分一致のみのため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: 「セキュリティ」等の一般語・部分一致（ambiguous）のみのため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「連結ベース」の部分一致のみのため結ばなかった。
- relatedCompanies: en（エン株式会社）: 「エンゲージメント」の部分一致（ambiguous）のみのため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「サポート」の部分一致のみのため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 「企業内イノベーション」の一般語の部分一致のみのため結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「ウエスコブランド技術」の文脈での部分一致のみで、関係の記述がないため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「キャリアビジョン研修」の部分一致のみのため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）: 「高速道路」の部分一致（ambiguous）のみのため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: listing が「コードリストにない」ため結ばなかった（「ゼロトラストモデル」の部分一致）。
- relatedCompanies: yamadai（株式会社山大）: 「岡山大学」の部分一致（ambiguous）のみのため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 「ゼロトラスト」の部分一致（ambiguous）のみのため結ばなかった。
- relatedCompanies: 大株主の状況に載る公益財団法人ウエスコ学術振興財団・公益財団法人加納美術振興財団・ウエスコ社員持株会・住友生命保険相互会社・信託銀行等は、候補に含まれないか金融機関の純投資等のため結ばなかった。連結子会社7社は自社の子会社のため結ばなかった。
- terms: 助言: 「総合建設コンサルタント」は、道路・河川・都市計画などの社会インフラについて、調査・計画・設計などを官公庁等から受注して行う事業の総称です。同社グループの中核事業です。
- terms: 助言: 「単独株式移転」は、既存の会社が株式移転によって新しい持株会社を設立し、その完全子会社になる再編の方法です。同社は2014年にこの方法で設立されました。
- terms: 助言: 「環境アセスメント」は、開発事業が環境に与える影響を事前に調査・予測・評価する手続きです。同社の総合建設コンサルタント事業の業務の一つです。
- terms: 助言: 「純粋持株会社」は、自ら事業を行わず、子会社の株式を保有してグループ全体の経営管理を行う会社です。同社はこの形態です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
