# ニチダイ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ニチダイ |
| 証券コード | 6467 |
| docID（データを取り出した文書） | `S100YGVK` |
| 原本 docID | `S100YGVK` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGVK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ニチダイ / 6467 / docID S100YGVK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nichidai: 10 件の数値を有報XBRLと照合
有報: 株式会社ニチダイ 有価証券報告書－第59期(2025/04/01－2026/03/31) (docID S100YGVK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nichidai: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記（第57期・第58期の潜在株式調整後1株当たり当期純利益は潜在株式が存在しないため記載していないこと、第55期・第56期・第59期は当期純損失であり潜在株式が存在しないため記載していないこと、第55期・第56期・第59期の株価収益率は当期純損失のため記載していないこと）は表示事項のため、financialNotes には入れず警告のみとしました。
- businessModel: 中期経営戦略の目標とする経営指標（売上高に占める利益率の目標）は、利益率の目標のため本文や perspectives には書いていません。
- businessModel: MD&Aに印字された営業損失・経常損失等の損益の金額と増減率、受注高・受注残高の金額は書いていません。売上高と親会社株主に帰属する当期純損益だけを書きました。固定資産の減損処理は金額を書かず、事実だけを profit の段に書きました。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字され、重要な契約等も「該当事項はありません」のため、needsReview は空です。
- businessModel: 前期有報との修正再表示チェックでは、売上高・純利益・総資産・純資産・従業員数の全てが一致し、差異はありませんでした。
- businessModel: Wikipediaの記事は見つからなかったため、補足には使っていません。
- businessModel: NICHIDAI ASIA CO.,LTD.は議決権の所有割合が46.7％ですが、【関係会社の状況】に連結子会社として印字されており、そのまま連結子会社として扱いました。自社グループ会社のため関連企業にはリンクしていません。
- businessStructure: このツリーの旧スキーマのため、suppliers キーは省略しました。有報に個別の仕入先名の印字はありません。
- businessStructure: 主要な設備の状況に印字された帳簿価額は書いていません。宇治田原工場は金型・精密部品が連記され、NICHIDAI(THAILAND)LTD.の本社・工場は金型・精密部品・フィルタが連記されているため、特定の事業には結びつけていません。京田辺工場は精密部品製造設備です。
- businessStructure: セグメント別の外部顧客への売上高を百万円未満で切り捨てた合計は10,991百万円で、印字された合計10,992百万円と1百万円の差があります。印字の合計をそのまま使っています。
- businessStructure: 連結子会社のTHAI SINTERED MESH CO.,LTD.は2025年7月1日にNICHIDAI(THAILAND)LTD.を存続会社とする吸収合併により消滅しました。期中の再編であり、2026年3月31日現在の構造で登録しています。
- history: 設立時の資本金（4,000千円）は金額のため沿革には書いていません。
- history: 営業所・出張所・事務所の開設、移転、廃止の行は落としました（1973年名古屋営業所、1981年広島営業所、1993年熊谷営業所、1994年米国事務所・岡山出張所、1996年浜松出張所、1999年米国事務所移転、2000年上海事務所、2005年広島出張所廃止、2007年上海事務所廃止）。
- history: 工場の建設、増築、改築の行は落としました（1988年宇治田原工場、1998年第３工場と生産統合、2002年米国金型工場、2004年第４工場、2012年タイ工場増築、2015年京田辺工場改築と組立ライン移転）。
- history: 取引所の合併や市場統合に伴う機械的な上場市場の変更の行は落としました（2010年の大阪証券取引所への変更2件、2013年の東京証券取引所JASDAQ（スタンダード）への移行）。
- industry: 主たる業界は「machinery」を直接付けました。金型事業の精密鍛造金型、精密部品事業のターボチャージャー部品やギア、フィルタ事業の焼結金属フィルタはいずれも機械・金属製品の製造販売であり、閉じた分類に直接当てはまります。
- industry: 販売先は自動車部品メーカーが中心ですが、当社は自動車そのものを製造していないため「automotive」は付けていません。
- relatedCompanies: dijet-industrial（ダイジェット工業株式会社）: 特定投資株式に掲載されていますが、保有目的は「企業間取引の強化」という他の銘柄とも共通する定型的な文言のみで、個別の取引の印字がないためリンクしません。
- relatedCompanies: kyoto-financial-group（株式会社京都フィナンシャルグループ）: 特定投資株式に掲載されていますが、保有目的は財務政策であり、金融機関のためリンクしません。
- relatedCompanies: dai-ichi-life-holdings（第一生命ホールディングス株式会社）: 特定投資株式に掲載されていますが、保有目的は財務政策であり、保険会社のためリンクしません。同社は2026年4月1日付で株式分割を行い、第一ライフグループに社名変更していますが、保有先の会社の事項であり当社の事項ではありません。
- relatedCompanies: nikon（株式会社ニコン）: 設備の新設等の計画に「ニコン製CNC画像測定器」という機器名の印字があるだけで、取引・提携・資本関係の印字がないためリンクしません。
- relatedCompanies: seki（セキ株式会社）、base-4481（ベース株式会社）、core（株式会社コア）、career（株式会社キャリア）、scroll（株式会社スクロール）、en（エン株式会社）、vision（株式会社ビジョン）、innovation（株式会社イノベーション）、kohsoku（株式会社高速）、rent（株式会社レント）: 本文中の一致は一般語や製品名の断片（スクロールコンプレッサー、コア技術、キャリア自律、エンジン、経営ビジョン、ニチノベーション、高速加工機など）であり、各社の正式名称の印字ではないためリンクしません。
- relatedCompanies: 三菱重工グループは主要な顧客として印字されていますが、グループの総称であり個別の法人ではないためリンクしません。候補にもありません。
- relatedCompanies: 連結子会社（ニチダイフィルタ株式会社、NICHIDAI(THAILAND)LTD.、NICHIDAI U.S.A. CORPORATION、NICHIDAI ASIA CO.,LTD.）は自社グループ会社のため、関連企業にはリンクしていません。
- terms: 用語の助言のみです。対象となりうる用語は「冷間鍛造」「焼結金属フィルタ」「スクロールコンプレッサー」などですが、本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
