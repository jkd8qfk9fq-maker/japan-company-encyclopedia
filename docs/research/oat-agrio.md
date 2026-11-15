# ＯＡＴアグリオ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＯＡＴアグリオ株式会社 |
| 証券コード | 4979 |
| docID（データを取り出した文書） | `S100XSHI` |
| 原本 docID | `S100XSHI` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSHI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＯＡＴアグリオ株式会社 / 4979 / docID S100XSHI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
oat-agrio: 10 件の数値を有報XBRLと照合
有報: ＯＡＴアグリオ株式会社 有価証券報告書－第16期(2025/01/01－2025/12/31) (docID S100XSHI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
oat-agrio: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「OATアグリオ株式会社」が EDINET の提出者名「ＯＡＴアグリオ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円単位の印字をそのまま記載した（千円からの換算・切り捨ては行っていない）。地域ごとの売上高の内訳合計（31,949百万円）と売上高総額（31,950百万円）には１百万円の差があるが、印字どおりに記載し、ここに記録する。
- businessModel: 指標注記の収益認識基準の遡及適用については financialNotes に記録した。前期有報との突合（修正再表示チェック）は全行一致し、それ以外に組替え・修正再表示の注記はない。
- businessModel: 新中期経営計画（2024-2026年）の2026年12月期の数値目標（売上高338億円、営業利益38億円、連結ROE12.3％）は本文に書ける数値の範囲外のため、本文と戦略には書かず、ここに記録する。
- businessModel: MD&Aに印字された営業利益等の金額と増減率は、本文に書ける数値の範囲外のため記載していない。生産実績、商品仕入実績、研究開発費の金額も記載していない。
- businessModel: 当期中に行った自己株式の取得（資本政策）は、本文には書かず、ここに記録する。
- businessModel: 当期に新設した Asahi Agrio Deutschland GmbH と Chrysal Services and Distribution Colombia SAS は期末の連結体制に反映済みのため needsReview には入れず、ここに記録する。防除技術の成長を加速するための非上場株式１銘柄の取得（銘柄は非開示）も事実のみ記録する。
- businessModel: 連結範囲の変更を伴う子会社株式の取得による支出が投資活動キャッシュ・フローに印字されているが、対象会社の特定は本文各節では確認できなかったため、本文には書いていない。
- businessStructure: 連結子会社29社のうち、本文には主要な会社のみを記載した。持分法適用関連会社は株式会社むさしのタネ（議決権の所有割合28.6％）ほか１社である。
- businessStructure: このツリーのスキーマには suppliers のキーが無いため、仕入・調達面の事実は relatedCompanies と警告に記録した（東亞合成株式会社との農薬原料調達面の協力関係など）。
- businessStructure: 当期に新設した Asahi Agrio Deutschland GmbH と Chrysal Services and Distribution Colombia SAS は期末の連結体制に反映済みのため、needsReview には入れていない。
- history: 沿革の2011年１月の資本金増額の行は、資本金額のみの記載で本文に書ける金額ではないため落とし、ここに記録する（2010年の設立行についても資本金額は記載していない）。
- history: 沿革から落とした行：2013年３月の殺菌剤「ガッテン乳剤」発売（製品発売）、2013年12月の OAT Pakistan Private Limited 子会社化（2023年の除外行で言及）、2014年10月のＯＡＴステビア株式会社設立、2016年９月のＯＡＴアグリフロンティア株式会社設立と2020年12月の同社清算、2017年12月の ISO9001取得、2019年１月の GLOBALG.A.P.認証取得。
- industry: 主たる事業は農薬・肥料・バイオスティミュラントの製造販売で、閉じた分類に農業資材の値が無いため、最も近い chemicals を主たる業界とした。
- relatedCompanies: リンクしたのは特定投資株式の４社のみで、いずれも保有目的が銘柄ごとに個別化されていた（農薬分野での技術交流、種苗分野での技術交流、製品販売における協力、農薬原料調達面における協力）。東亞合成株式会社は農薬原料の調達面の協力関係だが、供給方向の明示が無いため supplier ではなく business-partner とした。
- relatedCompanies: 丸善薬品産業株式会社は主要な顧客（2025年12月期の売上高5,173百万円、割合16.2％）で、2020年２月に製品販売に関する業務提携契約を締結し、大株主でもある（所有割合4.60％、2025年12月31日現在）が、関連企業候補に無いためリンクしていない。
- relatedCompanies: 大塚化学株式会社は当社の分離元で大株主（所有割合5.12％、2025年12月31日現在）であり、鳴門事業所の敷地について同社との借地契約（2010年から2040年まで）があるが、関連企業候補に無いためリンクしていない。全国農業協同組合連合会とは農薬・肥料の売買基本契約を締結しているが、候補に無いためリンクしていない。
- relatedCompanies: 候補 ichigo は、サービス名『アグリオいちごマスター』と作物名「いちご」の一致で、いちご株式会社への言及ではないためリンクしていない。
- relatedCompanies: 候補 career は、「キャリア形成研修」等の一般語の一致のためリンクしていない。
- relatedCompanies: 候補 asahi-kagaku-kogyo は、有報に印字される旭化学工業が当社の連結子会社（奈良県生駒郡斑鳩町所在）であり、上場している旭化学工業株式会社とは別の法人であること、また自社グループの子会社はリンク対象外であることからリンクしていない。
- relatedCompanies: 候補 innovation は、連結子会社の社名「株式会社インプランタイノベーションズ」の一部であるためリンクしていない。
- relatedCompanies: 候補 nix は、栽培技術名「プロバイオポニックス」の一部であるためリンクしていない。
- relatedCompanies: 候補 frontier は、沿革の「ＯＡＴアグリフロンティア株式会社」（当社子会社として2016年に設立し、2020年に清算）の社名の一部であるためリンクしていない。
- relatedCompanies: 候補 port は、「ポートフォリオ」の一部であるためリンクしていない。
- relatedCompanies: 候補 zero は、「ネットゼロ」等の一般語の曖昧な一致であるためリンクしていない。
- relatedCompanies: 候補 ishin は、気候変動対応の文脈に現れる一般語の一致で、イシン株式会社への言及ではないためリンクしていない。
- relatedCompanies: 候補 rion は、農薬製品名「オリオン水和剤」の一部であるためリンクしていない。
- relatedCompanies: 候補 base-4481 は、「約定ベース」の一部であるためリンクしていない。
- relatedCompanies: 候補 cover は、「１本でカバーする」等の一般語であるためリンクしていない。
- relatedCompanies: 候補 hikari-tsushin は、大株主が「光通信KK投資事業有限責任組合」という投資事業有限責任組合で、株式会社光通信とは別の法人であるためリンクしていない。
- relatedCompanies: 候補 ray は、農薬の製剤名等の部分一致で曖昧であるためリンクしていない。
- relatedCompanies: 候補 rent は、クリザールグループの所在地「ルーロファレントスフェーン」等の部分一致であるためリンクしていない。
- relatedCompanies: 候補 ricoh は、「プロピレングリコール」等の部分一致で、株式会社リコーへの言及ではないためリンクしていない。
- relatedCompanies: 候補 trust は、大株主の「日本マスタートラスト信託銀行株式会社（信託口）」の部分一致で、信託口（資産管理口座）であり、コードリストにも無いためリンクしていない。
- terms: 助言のみの工程。用語の追加提案は無い。

## 要確認（status に反映）

- businessModel: 主要な経営指標等の注記に、2022年３月１日付で普通株式１株につき２株の割合で株式分割を行った旨が印字されています。
- businessStructure: 主要な経営指標等の注記に、2022年３月１日付で普通株式１株につき２株の割合で株式分割を行った旨が印字されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ＯＡＴアグリオ株式会社のアグリテクノ事業（農薬・肥料・バイオスティミュラント） → 提案: 農業資材（農薬・肥料）。閉じた分類に農薬・肥料などの農業資材の区分が無いため、化学製品に最も近い chemicals を充てた。農薬・肥料・バイオスティミュラント専業の会社の分類が不足している。
