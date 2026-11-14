# 近鉄百貨店 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社近鉄百貨店 |
| 証券コード | 8244 |
| docID（データを取り出した文書） | `S100Y5TO` |
| 原本 docID | `S100Y5TO` |
| 提出日（原本） | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5TO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社近鉄百貨店 / 8244 / docID S100Y5TO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kintetsu-department-store: 10 件の数値を有報XBRLと照合
有報: 株式会社近鉄百貨店 有価証券報告書－第132期(2025/03/01－2026/02/28) (docID S100Y5TO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kintetsu-department-store: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは前期有報と全8行一致し、会計方針の変更や決算期の変更にあたる注記は確認できなかったため、financialNotes は空にした。
- businessModel: 売上高の増加の背景として、MD&Aには大阪・関西万博の会場内オフィシャルストアの運営や外商売上の好調が記載されている。本文には増減率のみを記載した。
- businessStructure: 事業の並び順は、報告セグメントの外部顧客への売上高（2026年2月期）の大きい順とした。不動産業（340百万円）は、その他事業（2,446百万円）より小さいため最後に置いた。
- businessStructure: 「その他事業」には前連結会計年度まで労働者派遣業を営む株式会社Ｋサポートが含まれていたが、同社は連結範囲から除外されたため、現在の構成で記載した。
- businessStructure: 主要な設備の対応は有報のセグメント欄どおりとした。「流通センター八尾ほか」は「百貨店業ほか」と連記されているため、特定の事業には結びつけていない。
- businessStructure: 名古屋店（近鉄パッセ）は2026年2月28日に閉鎖済みのため、現在の店舗としては記載せず、沿革に記録した。
- history: 沿革表は年月セルと事象文が連続して印字された崩れた表のため、年月35件と事象35件の数が一致することから行順で対応づけた（2009年3月＝株式会社中部近鉄百貨店・株式会社和歌山近鉄百貨店の合併、2010年8月＝上本町YUFURAへの商業施設の開設を含む）。
- history: 1934年の株式会社丸物への改組と1972年の株式会社近鉄百貨店の設立には資本金額の印字があるが、金額は本文の規則により記載していない。
- history: ≪≫で示された旧・株式会社近鉄百貨店の沿革は、各項目の説明文の冒頭にその旨を明記した。
- history: Wikipediaの記事は冒頭の一般的な説明のみで、有報にない補足として使える固有の事実がなかったため使用していない。
- industry: 主たる業界は retail（小売）のみとした。百貨店業が外部顧客への売上高の8割以上を占めるためである。
- industry: 不動産業は報告セグメントだが、外部顧客への売上高が340百万円と連結売上高の0.3％にとどまるため、2つ目の業界は付けていない。卸・小売業と内装業は百貨店業を補完するグループ内の事業で、独立した業界は付けていない。
- relatedCompanies: きんえい（kin-ei）は、特定投資株式の保有目的が「近鉄グループとしての協業の推進」のみで、同社との取引の印字がなく、【関係会社の状況】の区分にも当たらないため結ばなかった。ＫＮＴ－ＣＴホールディングスも同じ保有目的の印字があるが、候補データにないため結んでいない。
- relatedCompanies: 帝国ホテル（imperial-hotel）、タカラスタンダード（takara-standard）、上新電機（joshin）は、保有目的が「安定的な商品販売など、事業運営上の良好な関係維持強化」という複数の銘柄に共通する定型的な文言のみで、取引の向きが特定できないため結ばなかった。ＡＮＡホールディングス（ana-holdings）も「全社的な事業運営上の良好な関係維持強化」という文言のみのため結ばなかった。
- relatedCompanies: 伊藤忠食品（itochu-shokuhin）は、主に食料品等の仕入取引の印字があるが、候補データでコードリストにない相手のため結ばなかった。なお、同社株式は公開買付けへの応募により2026年4月に売却が成立した旨が特定投資株式の脚注に記載されている。
- relatedCompanies: 金融機関の特定投資株式（mitsubishi-ufj-financial-group、kyoto-financial-group、the-kiyo-bank、the-nanto-bank、senshu-ikeda-holdings、mizuho-financial-group、the-hyakugo-bank、sumitomo-mitsui-trust-group、sumitomo-mitsui-financial-group、san-ju-san-financial-group）は、保有目的が資金調達等の金融取引の維持・強化のため結ばなかった。大株主の三菱ＵＦＪ銀行も金融機関のため結ばなかった。
- relatedCompanies: 大株主の奥村組（okumura）、大林組（obayashi）、きんでん（kinden）は事業会社だが、保有割合がそれぞれ0.68％、0.68％、0.66％（2026年2月28日現在）と小さく、有報に当社との取引の印字がないため結ばなかった。近鉄エクスプレスは候補データにないため結んでいない。
- relatedCompanies: ワコールホールディングス（wacoal-holdings）とモロゾフ（morozoff）は、特定投資株式に仕入取引の印字があったが、当連結会計年度において全株式を売却済みで現在の関係がないため結ばなかった。
- relatedCompanies: 一般語・部分一致の誤マッチのため結んでいない: step（「次のステップ」という一般語）、port（ポートフォリオ等の部分一致）、base-4481（時価ベースの自己資本比率の部分一致）、career（キャリア採用等の一般語）、create（連結子会社ジャパンフーズクリエイトの部分一致）、vision（長期ビジョンの一般語）、land（グランドオープン等の部分一致）、zero（ネットゼロシナリオの一般語、ambiguous）、lec（フレックスタイム制の部分一致）、corona（コロナ禍の一般語）、ichigo（自社農場の大阪いちごの部分一致）、path（名古屋店「近鉄パッセ」の部分一致、ambiguous）、platz（京都店「プラッツ近鉄」の部分一致）、adventure、en（ambiguous）、freee、garden、innovation、seki（ambiguous）、will（いずれも本文に具体的な関係の印字がない）。
- terms: 用語候補（助言のみ。用語の登録は行いません）: 友の会（百貨店が運営する前払式の積立制度で、積立額にボーナスを加えた買物券等で買い物ができる仕組み）、外商（百貨店が富裕層や法人などの顧客を担当者が訪問して販売する部門・販売方法）、デパ地下（百貨店の地下階にある食料品売場の通称）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
