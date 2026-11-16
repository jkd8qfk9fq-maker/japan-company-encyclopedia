# オキサイド — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オキサイド |
| 証券コード | 6521 |
| docID（データを取り出した文書） | `S100Y5QW` |
| 原本 docID | `S100Y5QW` |
| 提出日（原本） | 2026-05-22 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5QW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オキサイド / 6521 / docID S100Y5QW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
oxide: 6 件の数値を有報XBRLと照合
有報: 株式会社オキサイド 有価証券報告書－第26期(2025/03/01－2026/02/28) (docID S100Y5QW)
前期有報との比較: 12 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 12 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
oxide: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記2（潜在株式は存在するものの当期純損失のため潜在株式調整後1株当たり当期純利益を記載していない）と注記3（当期純損失のため株価収益率を記載していない）は表示・計算方法の事項のため、financialNotes には入れなかった。注記1（第24期より連結財務諸表を作成）のみを financialNotes に入れた。
- businessModel: 証拠パックの「財務諸表の組替え・遡及適用」の注意については、本文で確認できた変更はRaicol Crystals Ltd.の株式譲渡に伴う連結の範囲の変更であり、前期有報との数値照合でも全系列で差異は無く、経営指標等の数値に影響する組替えは確認できなかったため、financialNotes には入れず、この記録にとどめた。
- businessModel: MD&Aの営業利益・経常利益の金額や増減、特別利益・特別損失（補助金収入、関係会社株式売却損など）の金額は本文に書いていない（書けるのは売上高と純利益だけのため）。受注高・受注残高の金額も書いていない。生産実績は製造原価ベースのため書いていない。
- businessModel: 経営指標の目標（営業利益率10％、EBITDAマージン20％）は投資・利益指標の目標のため、本文にも perspectives にも書いていない。
- businessModel: 主要な販売相手先のSkyverse Technology Co., Ltd.とMarubeni America Corporationは related-candidates.json に無いため関連企業には結ばず、flow の customer 段に販売割合だけを書いた。Marubeni America Corporationは丸紅株式会社の子会社であり、丸紅への読み替えはしていない。
- businessModel: suppliers キーはこのツリーの旧スキーマのため省略した。仕入先として個別に述べられた相手は本文に無い。
- businessModel: Wikipedia は記事が見つからなかったため使っていない。
- businessStructure: 単一セグメント（光学事業）のため、子区分は【関連情報】の製品及びサービスごとの情報に印字された事業区分（半導体事業5,002,019千円、新領域事業3,040,702千円、ヘルスケア事業1,997,672千円）を使い、外部顧客への売上高の大きい順に並べた。千円を百万円に切り捨てた子区分の合計は10,039百万円で、印字の売上高合計10,040百万円とは切り捨てにより1百万円異なる。印字の合計をそのまま使った。
- businessStructure: 設備と事業の対応は、主要な設備の状況が単一セグメントでセグメント別の記載を省略しているため、子区分には結びつけず親事業の説明にも拠点名のみを書いた。帳簿価額は書いていない。
- businessStructure: 地域別の売上高（中国4,390百万円、米国3,137百万円、日本916百万円、その他海外1,596百万円）は事業の説明には使わなかった。
- history: 沿革のうち次の行は落とした: 2001年 Super LN/LT新製品開発・販売開始、2006年 米国KLA-Tencor Corporationとの資本・業務提携、2007年 エヌ・ティ・ティ・アドバンステクノロジ株式会社との資本・業務提携、2008年 ISO9001認証取得、2010年 横浜事業所の設置、2012年 久保田研究所の設立、2013年 266nmCWレーザとDr.SPECKLEの発売、2016年 横浜事業所の移転とスペックル測定方法の国際標準取得、2016年 株式会社日立ハイテクノロジーズ（現・日立ハイテク）との資本・業務提携、2019年 NKT Photonics A/Sとの業務提携、2020年 LASEA S.A.との業務提携と久保田研究所のレーザ事業部への統合、2021年 株式会社UJ-Crystalとの資本業務提携、2022年 第6工場取得・LQUOM株式会社との資本業務提携・日立ハイテクとの資本提携解消、2023年 第4工場（第1期工事）と第5工場の竣工、2024年 株式会社JSファンダリとの業務提携。製品発売・認証・事業所の開設移転と、現在の資本関係が確認できない提携は、会社の骨格に関わる出来事に絞るため落とした。
- history: 年月は沿革表の印字どおり年だけを使い、月は書いていない。資本金の金額は沿革に印字が無いため書いていない。
- industry: 主たる業界は electronics とした。単一セグメントの光学事業は単結晶・光部品・レーザ光源・光計測装置の製造販売であり、閉じた分類の中で直接合うのは electronics である。半導体ウエハ検査装置向けの単結晶・レーザを事業として開示し、半導体事業が売上高の約半分を占めるため、semiconductors を2つ目に付けた。どちらも閉じた分類の値のため taxonomyGaps は無い。
- relatedCompanies: nikon（ニコン）と lasertec（レーザーテック）は、大株主の状況に事業会社として印字され（いずれも2026年2月28日現在2.16％）、沿革にも資本・業務提携／資本提携が印字されているため major-shareholder として結んだ。説明には計上額を書いていない。
- relatedCompanies: ケーエルエー・テンコール株式会社（大株主8.21％）とKLA-TENCOR(SINGAPORE)PTE,LTD（同3.54％）、ＮＴＴアドバンステクノロジ株式会社（同5.79％）は候補に無いため結ばなかった。ＮＴＴファイナンス株式会社（同4.32％）は金融取引の相手のため結ばなかった。株式会社ＳＢＩ証券・楽天証券株式会社の共有口は証券会社の口座名義のため結ばなかった。
- relatedCompanies: 主要な販売相手先のSkyverse Technology Co., Ltd.（販売実績の31.0％）とMarubeni America Corporation（同18.3％）は候補に無いため結ばなかった。Marubeni America Corporationは丸紅株式会社の子会社であり、丸紅への読み替えはしていない。
- relatedCompanies: 連結子会社の株式会社オキサイドパワークリスタルは自社の子会社のため結ばなかった。2026年2月に全株式を譲渡したRaicol Crystals Ltd.は、譲渡時点で既に連結の範囲から外れており、候補にも無いため結ばなかった。
- relatedCompanies: 特定投資株式は「該当事項はありません」と印字されており、政策保有株式からの関連付けは行っていない。
- relatedCompanies: core、port、rent、base-4481、innovation、en、ray、career、kohsoku、seki、corona、gakujo、go、hikari-tsushin、nac、rix、technologies、the-yamanashi-chuo-bank、zero は、本文中の一般語や部分一致（「コア技術」「光通信」「サポート」「タレント」等）による機械抽出で、当該会社についての取引・提携・資本関係の記載はないため結ばなかった。the-yamanashi-chuo-bank（山梨中央銀行）は仮に言及があっても資金調達の相手にあたる。nissin（日新）は listing が「コードリストにない」ため結ばなかった。
- terms: 助言のみ。用語としては「単結晶」「シンチレータ」「波長変換」「ファラデー回転子」「量子もつれ光子対」「スペックルノイズ」などが候補だが、本工程ではデータを持たない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
