# 倉敷紡績 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 倉敷紡績株式会社 |
| 証券コード | 3106 |
| docID（データを取り出した文書） | `S100YIYE` |
| 原本 docID | `S100YIYE` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIYE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 倉敷紡績株式会社 / 3106 / docID S100YIYE（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kurabo-industries: 10 件の数値を有報XBRLと照合
有報: 倉敷紡績株式会社 有価証券報告書－第218期(2025/04/01－2026/03/31) (docID S100YIYE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kurabo-industries: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは空です。決算期の変更や変則決算はなく、修正再表示チェックも全行一致でした。
- businessModel: 中期経営計画の目標のうち本文に書けるのは売上高だけとし、利益や資本効率の目標数値は記載していません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順です。セグメント利益は記載していません。
- businessStructure: 各事業の内訳区分（高機能樹脂製品、糸など）は【事業の内容】とセグメント概要の記載に基づくもので、金額は区分ごとに独立して開示されていないため、その旨を各区分に明記しました。
- history: 沿革は【沿革】の印字どおりに年月から年だけを取り、主な出来事を選んで記載しました。1951年安城工場新設、1963年技術研究所設置、1971年裾野工場新設、1994年鴨方工場新設、1996年徳島工場新設、2010年ブラジル化学子会社設立は、紙幅の都合で省きました（安城工場の新設年は2025年閉鎖の項目で言及）。
- industry: 主たる業界は、最大の報告セグメントである化成品事業（2026年3月期の外部顧客への売上高62,654百万円、全体の約44％）に基づき chemicals（化学）としました。
- industry: 繊維事業（同43,276百万円、約30％）は閉じた分類に対応する値が無いため業界を付けず、taxonomyGaps に記録しました。環境メカトロニクス事業は機械・電子・プラントが混在し単一の閉じた分類に当てはまらないため、業界は付けませんでした。
- relatedCompanies: クラレ（kuraray）: 特定投資株式の保有目的に「化成品事業の不織布製品等の重要な販売先」と銘柄固有の記載があり、【大株主の状況】にも1.66％（2026年3月31日現在）の保有が印字されているため customer として結びました。
- relatedCompanies: テイ・エス テック（ts-tech）: 特定投資株式の保有目的に「化成品事業の軟質ウレタン製品等の重要な販売先」と銘柄固有の記載があり、【大株主の状況】にも1.90％の保有が印字されているため customer として結びました。
- relatedCompanies: 信越化学工業（shin-etsu-chemical）・丸紅（marubeni）・東レ（toray）: 特定投資株式の保有目的に、製品名を挙げた重要な販売先（東レと信越化学工業は仕入先でもある旨、丸紅は海外関係会社の共同出資先である旨）の銘柄固有の記載があるため customer として結びました。
- relatedCompanies: 長瀬産業（nagase-and-co）・豊田通商（toyota-tsusho）・稲畑産業（inabata-and-co）・椿本興業（tsubakimoto-kogyo）: 特定投資株式の保有目的に重要な販売先・仕入先の記載はありますが、大株主等の追加の裏付けがなく、保有株式の表だけを根拠とするため結びませんでした。
- relatedCompanies: 大阪ソーダ（osaka-soda）・グンゼ（gunze）・ニッタ（nitta）・日本毛織（the-japan-wool-textile）・マツオカコーポレーション（matsuoka）・自重堂（jichodo）・大東建託（daito-trust-construction）・大和ハウス工業（daiwa-house-industry）・ヤマトインターナショナル（yamatointernationalinc）・タチエス（tachi-s）: 特定投資株式の保有目的に販売先・仕入先の記載はありますが、保有株式の表だけを根拠とするため結びませんでした。
- relatedCompanies: ちゅうぎんフィナンシャルグループ（chugin-financial-group）・三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）・三菱ＵＦＪフィナンシャル・グループ（mitsubishi-ufj-financial-group）・みずほフィナンシャルグループ（mizuho-financial-group）・MS＆ADインシュアランスグループホールディングス（ms-and-ad-insurance-group-holdings）・百十四銀行（the-hyakujushi-bank）・いよぎんホールディングス（iyogin-holdings）・ひろぎんホールディングス（hirogin-holdings）・三井住友トラストグループ（sumitomo-mitsui-trust-group）・阿波銀行（the-awa-bank）: 保有目的は主力取引銀行・保険取引など金融取引の維持・強化であり、規則により結びませんでした。
- relatedCompanies: アシックス（asics）・豊田自動織機（toyota-industries-6201）・久光製薬（hisamitsu-pharmaceutical）・ナイガイ（naigai）・東リ（toli）: 当事業年度は保有しておらず（前期までの保有）、取引関係の記載もないため結びませんでした。
- relatedCompanies: エン（en）・ゼロ（zero）・ビジョン（vision）・イノベーション（innovation）・ベース（base-4481）・フリー（freee）・セキ（seki）・レック（lec）・イシン（ishin）・ステップ（step）・東名（toumei）・コア（core）・ポート（port）・キャリア（career）・高速（kohsoku）・カバー（cover）: 一般語や部分一致の誤マッチで、有報にその会社についての記載はないため結びませんでした。東名は連結子会社の東名化成株式会社への言及です。
- terms: 用語候補： NaTech（原料改質技術を活用した高機能な糸の製品群）、フリーズドライ（食品を凍結させて乾燥させる加工方法で、同社は即席麺の具材などを製造）、軟質ウレタン（柔らかいポリウレタンフォームで、自動車内装材などに使われる）、不織布（織らずに繊維をシート状にした素材）、ロボットビジョン（カメラと画像処理で対象を認識する自動化技術）、撹拌脱泡装置（材料を混ぜながら気泡を取り除く装置）、バイオマス発電（植物由来の燃料を使う発電）——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

- businessModel: 2026年10月1日を効力発生日とする株式分割（2026年9月30日を基準日として普通株式1株につき5株の割合）が、2026年5月14日の取締役会で決議され、重要な後発事象として開示されています。有報提出時点では未実施のため、本文には完了として記載していません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 繊維事業（糸、ユニフォーム、カジュアルの製造・加工・販売） → 提案: textiles（繊維）。繊維事業は2026年3月期の外部顧客への売上高43,276百万円で全体の約30％を占める第2の事業ですが、閉じた分類に繊維の区分がありません。
