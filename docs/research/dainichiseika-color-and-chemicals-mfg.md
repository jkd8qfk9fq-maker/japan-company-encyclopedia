# 大日精化工業 — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大日精化工業株式会社 |
| 証券コード | 4116 |
| docID（データを取り出した文書） | `S100YGML` |
| 原本 docID | `S100YGML` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGML.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大日精化工業株式会社 / 4116 / docID S100YGML（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
dainichiseika-color-and-chemicals-mfg: 10 件の数値を有報XBRLと照合
有報: 大日精化工業株式会社 有価証券報告書－第123期(2025/04/01－2026/03/31) (docID S100YGML)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
dainichiseika-color-and-chemicals-mfg: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は、売上高とセグメント別売上高、当期純利益について【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の印字（1,242億9千4百万円、690億5千万円、310億6千5百万円、241億3千2百万円、81億1百万円、前期比0.4％減、同21.3％減）のとおり記載した。地域別の金額は【セグメント情報等】の表の印字（単位：百万円）のまま記載した。
- businessModel: 営業利益・経常利益の金額や増減率、特別利益に計上した投資有価証券売却益と前期の固定資産売却益の金額は本文に書けないため、当期純利益の減少理由は、政策保有株式の売却を進めたことと前期の跡地売却の反動という事実の範囲で記載した。
- businessModel: 中期経営計画の長期目標（ROE・ROAの数値）は投資指標のため、perspectives にも記載していない。
- businessModel: financialNotes の研究開発費の集計方法の変更は、証拠パックの注意（財務諸表の組替え・遡及適用の記載）に対応する注記である。一般管理費に含まれる研究開発費の総額の集計方法の変更であり、5年間の経営指標は修正再表示チェックで前期有報と全8行一致している。
- businessStructure: 報告セグメントは製品別の3つで、【セグメント情報等】の外部顧客への売上高の大きい順（カラー＆ファンクショナルプロダクト69,050百万円、グラフィック＆プリンティングマテリアル31,065百万円、ポリマー＆コーティングマテリアル24,132百万円）に並べた。各セグメントの金額は【経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析】の印字（690億5千万円、310億6千5百万円、241億3千2百万円）のとおり記載した。
- businessStructure: 「その他」は報告セグメントに含まれない区分（不動産の賃貸借など）のため最後に置いた。金額はセグメント情報の表の印字（45百万円）のまま記載した。
- businessStructure: 当社グループは当社と関係会社24社で構成され、子会社21社を連結し、関連会社3社のうち2社に持分法を適用している（【事業の内容】、2026年3月31日現在）。
- businessStructure: 拠点と事業の対応は有報のセグメント欄どおりとし、複数区分が連記された行（本社の3セグメント連記など）はどの事業にも結びつけていない。
- history: 沿革表は年月と事象文が連記された形式で崩れておらず、記載の順序どおりに対応づけた。表の先頭は1939年の設立だが、【沿革】冒頭の文章に1931年の彩華顔料合資会社としての創業が記されているため、これを先頭の出来事として加えた（計45件）。
- history: DAICOLOR DO BRASIL, IND. E COM. LTDA.とDM COLOR MEXICANA S.A. DE C.V.は清算手続中である旨が【関係会社の状況】に注記されているため、沿革の説明にもその旨を記した。
- history: wikipedia.json の冒頭は本社所在地と化学メーカーという位置づけのみで、いずれも有報で確認できる内容のため、補足には使用しなかった。
- industry: 主たる業界は、報告セグメントのすべてが顔料・着色剤、合成樹脂・コーティング剤、印刷インキという化学製品であることから chemicals とした。閉じた分類に合致するため taxonomyGaps はない。
- industry: 機能性材料の一部に半導体向けの製品があるが、独立した金額の開示がない事業のため、2つ目の業界として semiconductors は付けていない。
- relatedCompanies: seki・hiraga は ambiguous の候補だが、【株式の保有状況】の特定投資株式に正式名称（セキ株式会社・株式会社平賀）と一致する銘柄として載り、個別の販売取引が印字されているため結んだ。
- relatedCompanies: aica-kogyo は販売取引と購入取引の両方が印字されているため、最初に印字された販売取引の向きで customer とし、両面の取引がある旨を説明に記した。komori は「オフセット印刷機の販売代理店としての取引」という印字から、当社が同社の製品を代理店として扱う関係と読んで supplier とした。
- relatedCompanies: toyo-suisan-kaisha・daito-chemix: 特定投資株式の保有目的が「安定株主の確保のため、また、当社製品の最終利用先であり」という記載で、個別の販売・購入取引の向きが印字されていないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group・mizuho-financial-group・mitsubishi-ufj-financial-group・the-chiba-bank: 保有目的が発行会社傘下の金融機関との資金調達等の金融取引のため結ばなかった。【大株主の状況】に載る株式会社三井住友銀行、株式会社三菱UFJ銀行、みずほ信託銀行株式会社、日本マスタートラスト信託銀行株式会社（信託口）、株式会社日本カストディ銀行（信託口）、大樹生命保険株式会社も、金融機関または信託の純投資のため結ばなかった。
- relatedCompanies: nakamoto-packs・pilot・daicel・wellco-holdings・achilles・mitsubishi-chemical-group・hagihara-industries・dai-nippon-toryo・kyowa-leather-cloth・sun-a-kaken・taiyo-holdings: 当事業年度に保有の適否の検証の結果、全株式を売却済みであり、現在の取引・資本関係の根拠がないため結ばなかった（taiyo-holdings はみなし保有株式）。
- relatedCompanies: en・innovation・core・base-4481・ray・port・path・rent・career・kohsoku・land・corona・ishin・scala・vision・arata・freee: 一般語や部分一致で、当該会社について取引・提携・資本関係を述べる記載がないため結ばなかった（en・core・kohsoku は ambiguous の候補でもある）。
- relatedCompanies: trust: EDINETのコードリストにない相手で、日本マスタートラスト信託銀行株式会社（信託口）への一致のため結ばなかった。
- relatedCompanies: ウルトラファブリックス・ホールディングス株式会社、NISSHA株式会社、SWCC株式会社は、特定投資株式に販売取引の印字があるが related-candidates.json に載っていないため結ばなかった。
- terms: 助言: 用語「顔料分散体」は、顔料を樹脂などに均一に分散させた中間素材を示す語として用語集への追加候補と考える。この会社の主力製品のひとつで、液晶ディスプレイ向けなどに使われている。
- terms: 助言: 用語「樹脂コンパウンド」は、樹脂に顔料や添加剤を練り込んだ成形用材料を示す語として用語集への追加候補と考える。自動車向けなどを中心に、この会社の売上の一角を占める製品である。

## 要確認（status に反映）

- businessModel: 2025年11月10日開催の取締役会決議に基づき、2026年4月1日を効力発生日として、普通株式1株につき4株の割合で株式分割を実施しました。連結経営指標等の株式数に基づく数値は、第119期の期首に当該分割が行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
