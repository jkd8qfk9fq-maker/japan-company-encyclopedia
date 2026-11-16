# 川上塗料 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 川上塗料株式会社 |
| 証券コード | 4616 |
| docID（データを取り出した文書） | `S100XMOI` |
| 原本 docID | `S100XMOI` |
| 提出日（原本） | 2026-02-20 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XMOI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 川上塗料株式会社 / 4616 / docID S100XMOI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 18 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kawakami-paint-mfg: 10 件の数値を有報XBRLと照合
有報: 川上塗料株式会社 有価証券報告書－第111期(2024/12/01－2025/11/30) (docID S100XMOI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kawakami-paint-mfg: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有報はなく、前期有報との修正再表示照合でも全6系列で差異はゼロだった。ブートストラップが「財務諸表の組替え・遡及適用」の記載を警告したが、指標に影響する再表示は確認されず、表示上の事項として扱った。有報で確認できる会計基準の変更は、収益認識に関する会計基準等の第108期期首からの適用のみで、financialNotesに記録した。
- businessModel: 潜在株式調整後1株当たり当期純利益を記載していない旨や、臨時雇用者数の外書表示などの注記は表示上の事項のため、financialNotesにはしなかった。
- businessModel: 期間後の資本金の額の減少（2026年1月14日取締役会決議、2026年2月20日の第111回定時株主総会で承認可決、効力発生は2026年6月1日の予定）は期末後の資本政策の手続きであるためwarningsのみとし、金額は書かなかった。
- businessModel: 中期経営計画の数値目標（2027年11月期の売上高・利益の目標額）は投資指標にあたる目標値のため、本文・戦略には書かなかった。
- businessModel: 経営成績等の分析に印字される資産・負債・純資産の合計額、キャッシュ・フローの金額、設備投資額、借入金の残高は本文には書かなかった。
- businessModel: Wikipediaの記事冒頭は同社を「三井物産傘下」と表現しているが、有報では三井物産株式会社自体は当社株式を保有しておらず、株式を保有するのは同社子会社の三井物産ケミカル株式会社（7.32％、2025年11月30日現在）であるため、この表現は採用せず、補足に使える事実もなかったためWikipediaは出典に加えなかった。
- businessStructure: 単一セグメント（塗料の製造・販売事業）のため、子区分は経営成績等の分析に印字された品種別の販売実績（合成樹脂塗料類5,466百万円、その他塗料類 他466百万円、合計5,932百万円）に従った。
- businessStructure: 設備（本社及び本社工場、東京営業所・東京工場、千葉工場、名古屋営業所等、越谷倉庫）は単一セグメント全体のものであるため、子区分には結びつけず、事業の説明の中で生産拠点として触れた。帳簿価額は書かなかった。
- businessStructure: 旧スキーマのため suppliers キーは省略した。個別に印字された仕入先は本文には記録しなかった。
- businessStructure: 連結子会社ダイヤス化成株式会社と持分法適用関連会社株式会社友進商会は自社グループのため関連企業には記録しなかった。議決権の所有割合は、ダイヤス化成が100％、友進商会が31.25％（2025年11月30日現在）である。
- history: 1946年の東京営業所開設と2000年の越谷倉庫取得は、転機性が低い小規模な拠点の出来事のため沿革には入れなかった。
- history: 1945年の改組に印字された資本金の額は、沿革に資本金額を書かない規則のため記載しなかった。
- history: 沿革の年月はすべて有報の【沿革】の印字どおりで、年だけを記録した。
- industry: 主たる業界は、単一セグメントである塗料の製造・販売事業が化学製品の製造にあたるため chemicals とした。
- relatedCompanies: mitsui-chemicals（三井化学）: 特定投資株式の保有目的が「重要な取引先であり、原材料の安定的な調達のため」という定型の文であり、個別の取引事実の印字がないため結ばなかった。なお、同社の退職給付信託口が当社株式を保有しているが、信託口のため大株主としての関係も結ばなかった。
- relatedCompanies: sekisui-house（積水ハウス）: 特定投資株式の保有目的が「重要な顧客であり、取引関係の維持・強化のため」という全銘柄共通の定型文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: o-well（オーウエル）: 特定投資株式の保有目的が全銘柄共通の定型文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: kubota（クボタ）: 特定投資株式の保有目的が全銘柄共通の定型文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: airman（AIRMAN）: 特定投資株式の保有目的が全銘柄共通の定型文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: iseki-and-co（井関農機）: 特定投資株式の保有目的が全銘柄共通の定型文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: aichi-tokei-denki（愛知時計電機）: 特定投資株式の保有目的が全銘柄共通の定型文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: corona（コロナ）: 特定投資株式の保有目的が全銘柄共通の定型文のみで、株式累積投資により株式数が増加した旨も定型の説明のため結ばなかった。
- relatedCompanies: koatsu-gas-kogyo（高圧ガス工業）: 特定投資株式の保有目的が全銘柄共通の定型文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: dainichiseika-color-and-chemicals-mfg（大日精化工業）: 特定投資株式の保有目的が「重要な取引先であり、原材料の安定的な調達のため」という定型の文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: ishihara-sangyo-kaisha（石原産業）: 特定投資株式の保有目的が定型の文のみで、個別の取引事実の印字がないため結ばなかった。
- relatedCompanies: nippon-steel（日本製鉄）: 特定投資株式として保有していたが、当事業年度にすべて売却し保有がなくなったため結ばなかった。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ）: 特定投資株式の保有目的が「重要な取引金融機関であり、安定的な取引を維持するため」という資金調達に関わる理由であり、同社自体は当社株式を保有しておらず（保有するのは子会社のみずほ銀行・みずほ信託銀行）、金融機関のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group（三井住友トラストグループ）: 特定投資株式の保有目的が「重要な取引金融機関であり、安定的な取引を維持するため」という資金調達に関わる理由であり、金融機関のため結ばなかった。
- relatedCompanies: core（コア）: 「コア顧客」という一般語の部分一致のみで、ambiguous のため結ばなかった。
- relatedCompanies: zero（ゼロ）: 会計方針の「残存価額をゼロとする」という文言の部分一致のみで、ambiguous のため結ばなかった。
- relatedCompanies: ray（レイ）: 「レイアウト」の部分一致のみで、ambiguous のため結ばなかった。
- relatedCompanies: seki（セキ）: 「セキュリティ」等の部分一致のみで、ambiguous のため結ばなかった。
- terms: 助言: 「粉体塗料」は、粉末状の塗料で、溶剤を使わず静電気などで対象物に付着させて加熱硬化させる塗料です。同社はVOCの放出を削減できる環境配慮型の製品として開発に注力しています。
- terms: 助言: 「調色加工」は、塗料の色を需要家の求める色合いに合わせて調整する加工です。同社は製造とあわせて調色加工も自社で行っています。
- terms: 助言: 「特約店」は、メーカーと特約を結んでその製品を販売する販売店です。同社の製品は一部を除き、主として特約店を通じて販売されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
