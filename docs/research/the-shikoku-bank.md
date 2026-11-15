# 四国銀行 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社四国銀行 |
| 証券コード | 8387 |
| docID（データを取り出した文書） | `S100YD3N` |
| 原本 docID | `S100YD3N` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD3N.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社四国銀行 / 8387 / docID S100YD3N（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-shikoku-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社四国銀行 有価証券報告書－第212期(2025/04/01－2026/03/31) (docID S100YD3N)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第211期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
the-shikoku-bank: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期の窓に訂正有価証券報告書－第211期(2024/04/01－2025/03/31)があるが、前期有報との修正再表示チェックでは重複年度の全行が一致し、主要な経営指標等への影響は確認されなかったため、warnings のみとした。本有報（第212期）自体に訂正はなく、docID S100YD3N が有効文書である。
- businessModel: 親会社株主に帰属する当期純利益の増加は、四銀総合リース株式会社の完全子会社化に伴う一過性の要因を含むと印字されているが、その金額や内訳は本文に記載していない。
- businessModel: 中期経営計画2026の目標とする経営指標（金額・比率）や計画の柱に含まれる資本効率に関する指標名は、将来目標・投資の語に当たるため本文には含めていない。
- businessModel: MD&Aに印字された国内・国際業務部門別の収支や、連結子会社の個別の収益情報は、本文では用いていない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されている。当行自身の株式分割の印字もない（株式分割の注記は保有先である住友不動産・ヨドコウに関するもの）。
- businessStructure: 報告セグメントは銀行業単一のため、【関連情報】のサービスごとの情報（貸出業務・有価証券投資業務・その他）を子事業とした。
- businessStructure: サービス別の外部顧客に対する経常収益の単純合計（69,523百万円）は、印字された連結経常収益69,524百万円と1百万円異なる（有報の丸め）。いずれも印字どおりに引用した。
- businessStructure: 当行グループは当行、子会社9社（うち非連結3社）及び関連会社2社（うち持分法非適用2社）で構成される。連結子会社は四銀代理店、四国保証サービス、四銀総合リース、四銀コンピューターサービス、四銀地域経済研究所、しぎんキャピタルパートナーズの6社である。
- businessStructure: wikipedia.json の記事「四国銀行」は有報で確認できる内容（高知市に本店を置く地方銀行で「四銀」の愛称）の範囲内だったため、補足として用いず出典にも追加していない。
- history: 沿革は年月と事象文が分かれて印字された崩れた表であり、年月31件と事象31件で数が一致したため行順で対応づけた。
- history: 外貨両替業務開始、オンライン稼働開始、国債取扱開始などの業務開始の細目、解散した四国ビジネスサービス（2013年6月解散）・四銀ビル管理（2012年3月解散）などの行は、主要な出来事に絞って省略した。
- history: 四銀総合リースの完全子会社化は当連結会計年度中の出来事で、2026年3月31日現在の構成（連結子会社6社）に反映されているため、沿革に記載し needsReview には入れなかった。取得価額や負ののれん発生益などの金額は記載していない。
- history: 創業時の資本金などの金額は記載していない。
- industry: 報告セグメントは銀行業単一で、リース業務などのグループ事業も金融サービスであるため、finance のみとした。
- industry: 本邦の外部顧客に対する経常収益が全体の90％を超えるため、地域ごとの情報の開示は省略されている。経常収益の10％以上を占める特定の顧客はない。
- relatedCompanies: 特定投資株式の保有目的が全銘柄共通の定型文（「銀行取引を含めた協力関係の維持・強化が取引先及び当行の企業価値向上に資するため」「当行が営業基盤を有する地域の経済発展に重要な役割を担っており…」等）で、個別の提携・取引内容の印字がないため結ばなかった相手: penta-ocean-construction、sumitomo-realty-and-development、tokyo-tatemono、giken、rock-field、nippon-kodoshi、fuyo-general-lease、yodoko、electric-power-development、yasuda-logistics、nippon-express-holdings、east-japan-railway、haruyama-holdings、toagosei、fuji-8278、daiwa-industries、daiwabo-holdings、okura-industrial、kanematsu-engineering、okamura、taiheiyo-cement、miroku、nippon-paper-industries、nankai-chemical-industry、dcm-holdings、fumakilla、first-juken、sec-carbon、central-general-development、tokai-lease、axas-holdings、jfe-holdings、nippon-kinzoku、toyo-wharf-and-warehouse。
- relatedCompanies: the-hyakujushi-bank: 当事業年度末時点の保有株式数が「―」（保有なし）で、銀行同士の関係でもあるため結ばなかった。
- relatedCompanies: tadano: 当事業年度末時点の保有株式数が「―」（保有なし）のため結ばなかった。
- relatedCompanies: shikoku-electric-power: みなし保有株式としての印字のみで、直接の提携・取引の記載がないため結ばなかった。
- relatedCompanies: iyogin-holdings: 当事業年度の株式売却の印字等、保有関係のみで提携の記載がなく、銀行持株会社との資金関係でもあるため結ばなかった。
- relatedCompanies: fukuoka-financial-group: 株式売却の印字等、保有関係のみで提携の記載がなく、銀行持株会社との資金関係でもあるため結ばなかった。
- relatedCompanies: tomony-holdings: 株式売却の印字等、保有関係のみで提携の記載がなく、銀行持株会社との資金関係でもあるため結ばなかった。
- relatedCompanies: sumitomo-forestry: みなし保有株式等の保有関係のみで、提携・取引の記載がないため結ばなかった。
- relatedCompanies: sumitomo-metal-mining: みなし保有株式等の保有関係のみで、提携・取引の記載がないため結ばなかった。
- relatedCompanies: link-and-motivation: 人財施策におけるサービス（モチベーションクラウド）導入の言及のみで、提携関係の印字がないため結ばなかった。
- relatedCompanies: ntt: 子会社のNTTデータが関わる地銀共同センターへの基幹系システム移行の印字であり、NTT自体との提携・取引の印字がないため結ばなかった。
- relatedCompanies: port / base-4481 / career / core / vision / seki / basic / path / land / cover / step / king: 一般語・部分一致による候補であり、該当企業への言及ではないため結ばなかった。
- relatedCompanies: nissin / trust: コードリストにない候補（trust は信託銀行の信託口の印字）であり、結ばなかった。
- relatedCompanies: 株式会社高知銀行: 特定投資株式に「四国島内の地方銀行として協力関係」と印字があるが、候補リストになく非上場のため結ばなかった。
- relatedCompanies: 日亜化学工業株式会社: 大株主の状況に所有割合2.36％（2026年3月31日現在）の印字があるが、候補リストになく、提携・取引の印字もないため結ばなかった。
- relatedCompanies: 大株主の状況に載る信託銀行（信託口）・生命保険相互会社は、信託業務・保険取引に係る保有であり、関連企業として結ばなかった。
- relatedCompanies: 当行グループの連結子会社6社と非連結子会社・関連会社（四国アライアンスキャピタル等）は、当行グループ自身の会社であるため関連企業として結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
