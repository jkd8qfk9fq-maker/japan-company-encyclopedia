# ネクソン — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ネクソン |
| 証券コード | 3659 |
| docID（データを取り出した文書） | `S100XSM4` |
| 原本 docID | `S100XSM4` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSM4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ネクソン / 3659 / docID S100XSM4（id は英語表記「NEXON Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nexon: 10 件の数値を有報XBRLと照合
有報: 株式会社ネクソン 有価証券報告書－第24期(2025/01/01－2025/12/31) (docID S100XSM4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nexon: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙DEIで2025年1月1日〜12月31日（12月期、IFRS）。訂正なし、前期との重複年度の照合は全て一致。
- businessModel: 金額の出どころ：売上収益475,102百万円（前期比6.5％増）・当期利益92,052百万円（同31.7％減）はMD&A、前期134,848百万円は経営指標等の表。事業別（PCオンライン335,313、モバイル136,245）と製品・役務別（323,447／146,931／4,724と前期の252,570／189,415／4,226）、顧客の所在地別（韓国249,973、中国109,513、北米及び欧州68,582）、顧客Tencentの94,133（19.8％）と前期143,300は、セグメント注記・MD&Aの印字どおり。
- businessModel: 純利益の減少理由はMD&Aに純利益の単独の説明が無く、税引前利益の説明は規則により書けないため、理由を書いていない。営業利益・税引前利益・セグメント利益・総資産などの金額は書いていない。
- businessModel: 『グループ外の配信会社』の例としてTencent Holdings Limited及びその子会社を挙げたのは、【事業の内容】にNEOPLE INC.が同社を通じて『アラド戦記』を配信する旨の印字があるため。
- businessModel: 『FC ONLINE』は【事業の内容】の表で『スポーツ』ジャンルの韓国配信、本文の説明では『アジア全域のPCプレイヤー向け』と印字。Electronic Arts Inc.との取引はライセンス配信モデルの例として印字がある。
- businessModel: 従業員数は本文に使っていない。
- businessModel: ARC Raidersの開発・配信の主体は有報に書かれておらず、書いていない。
- businessModel: 戦略（perspectives.strategy.disclosed）はMD&Aの『経営成績の状況』の記述の要約。analysisは書いていない。
- businessStructure: 決算期は表紙DEIで2025年1月1日〜12月31日（12月期、IFRS）。訂正なし、決算期変更・変則決算なし。
- businessStructure: 報告セグメントは所在地別の5区分（日本・韓国・中国・北米・その他）。並びはセグメント注記の外部収益の大きい順：韓国400,657、その他39,037、北米28,125、日本5,509、中国1,774（百万円）。『報告セグメントに含まれない』区分や金額の無い区分はない。
- businessStructure: セグメント利益・損失は本文に書いていない（規則により売上収益のみ）。
- businessStructure: その他の区分の増収理由は有報がセグメント別に述べていないため書いていない。MD&Aが挙げるARC Raiders等の新作をどの区分に結びつけるかも印字が無いので結びつけていない。
- businessStructure: PCオンライン／モバイル別の外部収益は注記にあるが、事業の区分はセグメントで立て、子区分は作らなかった。
- businessStructure: shortNameEn は英訳名『NEXON Co., Ltd.』の社名部分。
- businessStructure: wikipedia.json は証拠パックに無く使っていない。
- history: 沿革の表は年月と事象が1対1で崩れずに取れている。グループ会社の設立・商号変更の多くは省き、会社の成り立ちと上場・市場区分に関わる12件を選んだ。
- history: 2018年の項目は、沿革の本文（2018年3月の本社移転）と末尾の注（2018年1月30日のNXC Corporationの区分変更）を1行にまとめた。NXC Corporationの46.3％は【関係会社の状況】の2025年12月31日現在の印字。
- history: Embark Studios ABは沿革に『株式を追加取得し子会社化』とあるのみで、取得前の出資の経緯は書いていない。
- industry: PCオンラインゲームとモバイルゲームの制作・開発・配信が事業の全てで、5つの報告セグメントはいずれも同じ事業の所在地別区分。最も近い既存の値としてエンターテインメントを選んだ。IT・ソフトウェアは、ゲームの配信が中心のため主にしない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、同一性を確かめられる上場の候補が無い。結んだ相手は無い。
- relatedCompanies: NXC Corporation（その他の関係会社、被所有46.3％）：韓国済州の会社で、有報に上場の印字が無く、日本の掲載済み企業でもない。上場でない相手は結べない。
- relatedCompanies: Tencent Holdings Limited及びその子会社（売上収益の10％以上の顧客）：海外の会社で、日本の上場企業の候補に無い。
- relatedCompanies: Electronic Arts Inc.・Valve Corporation（ライセンス配信モデルの相手）：海外の会社で、日本の上場企業の候補に無い。
- relatedCompanies: 連結子会社・持分法適用会社（NEXON Korea Corporationなど）は、いずれも日本の上場企業ではない（NEXON Games Co., Ltd.とNEXON Korea Corporationの一部の注は韓国市場上場の印字で、掲載済み企業ではない）。
- terms: 助言：ゲーム業界の用語（MMORPG、IP、アイテム課金制、ライセンス供与モデル）は用語集に無い。アイテム課金制とIP（知的財産権）は、ネクソンの収益の仕組みを読むのに要る。追加を検討できる。
- terms: 既存の用語で本文に使えるのは、セグメント（segment）、連結子会社（consolidated-subsidiary）、その他の関係会社（other-affiliated-company）、IFRS（ifrs）、持分法（equity-method）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
