# モリ工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | モリ工業株式会社 |
| 証券コード | 5464 |
| docID（データを取り出した文書） | `S100YEUF` |
| 原本 docID | `S100YEUF` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEUF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | モリ工業株式会社 / 5464 / docID S100YEUF（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mory-industries: 10 件の数値を有報XBRLと照合
有報: モリ工業株式会社 有価証券報告書－第84期(2025/04/01－2026/03/31) (docID S100YEUF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
mory-industries: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべてセグメント注記・連結経営指標等の百万円表の印字どおりで、千円額からの換算や切り捨てはしていません。MD&Aの億単位の表記（432億88百万円など）は使わず、百万円表の43,288百万円に統一しました。
- businessModel: 修正再表示チェックは前期有報と重複する全項目で一致し、変則決算・決算期変更・会計基準の変更の印字も確認できないため、financialNotes は空としました。
- businessModel: 中期経営計画「MORY－PLAN26」の定量目標（売上高や資本収益性に関する指標の目標値）は、本文の財務数値と投資の語の規則に従い、perspectives には転記せず、基本方針だけを要約しました。
- businessModel: businessModel に suppliers のキーは入れていません（この作業コピーのスキーマに無いため）。主な原材料がコイル材等であることは businessStructure の warnings に記録しました。
- businessModel: 重要な後発事象の印字は確認できず、提出後の予定事項はありません。計画中の新工場の建設は、経営方針の節で「予定通り進めており」と印字された進行中の計画として strategy に書きました。
- businessStructure: name は表紙の「モリ工業株式会社」から「株式会社」を除きました。listings の市場区分は表紙・DEIの印字（東京証券取引所スタンダード市場）どおりです。shortNameEn は表紙の英訳名をそのまま入れました。
- businessStructure: 報告セグメントは地域別の「日本」と「インドネシア」の2つで、並びはセグメント注記の外部顧客への売上高（2026年3月期、日本41,483百万円／インドネシア1,804百万円）の大きい順です。セグメント利益は書いていません。
- businessStructure: 日本の children はセグメント注記に印字された製品部門別の売上高（日本セグメントの値）の大きい順です。ステンレス管の連結計26,325百万円にはインドネシア分1,804百万円が含まれるため、children には日本セグメントの24,521百万円と明記しました。
- businessStructure: 主要な原材料はコイル材等で、仕入価格には市場価格がある旨がMD&Aに印字されていますが、仕入先の会社名はセグメント情報には印字されていないため、businesses には仕入先を書いていません（特定投資株式の相手については relatedCompanies の warnings を参照）。
- history: 沿革の表は年月と摘要が連続して印字されており、行ごとに年月と事象を対応づけて読みました。資本参加・設立の各行について、資本金の金額は本文ルールに従い書いていません。
- history: 途中の営業所開設・移転など小規模な出来事は省き、社名・上場・グループ構成・海外展開に関わる出来事を中心に選びました。
- history: 1993年のマエダ工業株式会社とモリ金属の合併による株式会社モリ・サンツアー（現・モリ金属株式会社）の設立は、現在のモリ金属の成り立ちとして本文に含めず、1984年の設立行と2026年3月31日現在の関係会社の状況で補いました。
- industry: 主たる業界は、外部顧客への売上高の大半を占めるステンレス関連事業（ステンレス管・ステンレス条鋼・ステンレス加工品・鋼管の製造・販売）の内容から判断しました。閉じた分類に鉄鋼・金属の区分が無いため chemicals を暫定とし、taxonomyGaps に記録しました。
- industry: 機械（パイプ切断機等）は2026年3月期の日本セグメントの売上高661百万円と小さく、独立した業界は付けていません。
- relatedCompanies: 阪和興業（hanwa）は【大株主の状況】の印字（事業会社としての大株主）を根拠に結びました。特定投資株式の保有目的の定型文だけを根拠にはしていません。
- relatedCompanies: 岩谷産業（iwatani）は特定投資株式として532,512株を保有し、保有目的に工場で使用するガスの供給元及び当社商・製品の販売先である旨が印字されていますが、根拠が株式の保有状況の表だけのため、関連企業には含めていません。
- relatedCompanies: 大同特殊鋼（daido-steel）、日本冶金工業（nippon-yakin-kogyo）、神戸製鋼所（kobe-steel）、JFEホールディングス（jfe-holdings）は、いずれも特定投資株式の保有目的に主原材料の調達先である旨が同じ定型の文で印字されているだけで、相手ごとの取引の事実が別に印字されていないため、関連企業には含めていません。
- relatedCompanies: カノークス（canox）、UEX（uex）、ユニソルホールディングス（unisol-holdings）、カネソウ（kaneso）は、いずれも特定投資株式の保有目的に当社商・製品の販売先である旨が同じ定型の文で印字されているだけで、相手ごとの取引の事実が別に印字されていないため、関連企業には含めていません。錢高組（the-zenitaka）も工場・倉庫の建築を依頼している旨が株式の保有状況の表だけのため含めていません。
- relatedCompanies: 京都フィナンシャルグループ（kyoto-financial-group）、三菱ＵＦＪフィナンシャル・グループ（mitsubishi-ufj-financial-group）、三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）、りそなホールディングス（resona-holdings）、T＆Dホールディングス（t-and-d-holdings）、岡三証券グループ（okasan-securities-group）は、発行会社傘下の金融機関との資金調達等金融取引や証券窓口の関係が保有目的で、金融機関・金融取引の関係のため関連企業には含めていません。
- relatedCompanies: 日亜鋼業（nichia-steel-works）は特定投資株式の保有目的が同じ鉄鋼業界での情報共有のためであり、取引・提携の事実が印字されていないため含めていません。タカノ（takano）は当事業年度に全株式を売却済みのため含めていません。
- relatedCompanies: 大株主のうち光通信ＫＫ投資事業有限責任組合は候補の光通信（hikari-tsushin）とは別主体の組合であり、三菱ＵＦＪ銀行・りそな銀行・大同生命保険・日本生命保険相互会社・日本マスタートラスト信託銀行（信託口）は金融機関や信託口のため、関連企業には含めていません。
- relatedCompanies: ステップ（step）は収益認識の5ステップの部分一致、ベース（base-4481）は営業利益ベースの部分一致、レック（lec）はフレックスタイムの部分一致、ケル（kel）とエン（en）は一般語の部分一致、ビジョン（vision）は長期ビジョンの部分一致、コロナ（corona）は感染症の文脈、リズム（rhythm）とリード（the-lead）は一般語であり、いずれも当該会社の社名としての記載ではありません。トラスト（trust）は日本マスタートラスト信託銀行（信託口）の表記で、コードリストにない相手のため含めていません。
- relatedCompanies: 連結子会社３社（モリ金属株式会社、関東モリ工業株式会社、PT. MORY INDUSTRIES INDONESIA）と持分法適用関連会社のAuto Metal Company Limitedは、いずれも自社グループの会社で非上場のため、関連企業の対象外です。
- terms: 用語候補として、ステンレス管（ステンレス製のパイプ）、ステンレス条鋼（ステンレス製の棒状の鋼材）、造管機（鋼板やコイル材から管を成形する専用設備。当社は大半を自社で設計製作しています）、熱間圧延（鋼材を熱して圧延する工程）、フレキ管（給湯器用などのフレキシブルな管）、持分法適用会社（持分法で連結に取り込む関連会社）があります。いずれも既存の用語集には無いため、本文ではリンク記法を使っていません。

## 要確認（status に反映）

- businessModel: 2025年4月1日付で普通株式1株につき5株の割合で株式分割を行いました。株式数に関する指標は2022年3月期の期首に当該分割が行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] モリ工業の主たる業界 → 提案: steel-and-metals（鉄鋼・金属）。売上高の中心はステンレス管・ステンレス条鋼などのステンレス製品の製造・販売であり、鉄鋼メーカーとしての事業ですが、閉じた分類に鉄鋼・金属に合う値がないため、素材の製造・加工に最も近い chemicals を暫定の主たる業界としました。
