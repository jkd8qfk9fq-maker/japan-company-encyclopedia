# ＣＧＳホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＣＧＳホールディングス |
| 証券コード | 6633 |
| docID（データを取り出した文書） | `S100XRYC` |
| 原本 docID | `S100XRYC` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRYC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＣＧＳホールディングス / 6633 / docID S100XRYC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cgs-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ＣＧＳホールディングス 有価証券報告書－第19期(2025/01/01－2025/12/31) (docID S100XRYC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
cgs-holdings: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社CGSホールディングス(旧会社名　株式会社C＆Gシステムズ)」が EDINET の提出者名「株式会社ＣＧＳホールディングス」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 経営指標の目標（短期事業計画の売上高目標、中長期の売上高目標）は投資・目標指標にあたるため、本文にも perspectives にも書いていない。
- businessModel: 表示方法の変更（前連結会計年度の連結貸借対照表で「前払費用」を区分掲記したことに伴う組替え）は表示だけの変更で経営指標に影響しないため、financialNotes には入れず、この警告に記録する。
- businessModel: 主要な経営指標等の注記のうち、潜在株式が存在しないための希薄化後指標の非開示と、株式報酬制度の信託が保有する株式の算定上の取扱いは表示・算定の事項のため、financialNotes には入れていない。
- businessModel: 株式会社ＮＤＥＳの本社は2026年2月に神奈川県川崎市川崎区へ移転している（設備の状況の注記）。提出後の子会社の事務所移転であり、グループ構成の変更ではないため needsReview には入れていない。
- businessModel: 売上高の内訳として生産実績・販売実績の区分（CAD/CAM製品、保守契約・技術サービス、開発サービス）も印字されているが、セグメント注記の収益分解と二重になるため事業構造にはセグメント注記の分解を用いた。受注高の金額は書いていない。
- businessStructure: CAD/CAMシステム等事業の収益分解はセグメント注記の印字行（ソフトウェア、ハードウェア、初年度保守、更新保守、サブスクリプション契約、その他サービス、受託開発）をそのまま children にした。各行を百万円未満切り捨てで合計すると4,129百万円となり、セグメント計4,132百万円とは切り捨ての差があるため、事業の説明には印字のセグメント計を用いた。
- businessStructure: 供給者（仕入先）の個別名は印字されていない。金型製造事業は海外調達によるファブレス方式である旨を事業の説明に記した（このツリーの旧スキーマのため suppliers キーは持たない）。
- businessStructure: 設備と事業の対応は設備の状況のセグメント欄どおりとした。提出会社の北九州本社はCAD/CAMシステム等事業の統括業務施設として印字されている。帳簿価額は書いていない。
- history: 落とした行（沿革に印字があるが採用しなかったもの）: 2007年2月の共同株式移転計画書への調印と同年3月の両社株主総会での承認（2007年の設立の行に統合）、2010年4月・10月と2013年7月の取引所の市場統合に伴う上場先表記の変更、2011年5月の本店移転（東京都品川区東品川）、前身各社の支店・営業所の開設（東京支店1984年、大阪支店1985年、名古屋支店1987年、大阪営業所1986年、名古屋事務所1990年、北関東営業所1999年）、1983年のコンピュータエンジニアリングへの商号変更、1985年の新本社ビル完成、1995年のタム株式会社の吸収合併、1981年の「TOOL-1」の販売開始、前身各社の本社移転（渋谷区1984年・2004年、千葉市2001年）、2001年・2002年の北米・タイ現地法人の設立（現在のCGS NORTH AMERICA INC.とCGS ASIA CO.,LTD.の前身）。
- history: 資本金の金額は沿革に書いていない。
- industry: 主たる業界は売上の最大区分であるCAD/CAMシステム等事業（外部売上4,132百万円、全体の約83％）で決めた。製造業向けの設計・生産ソフトウェアに合う閉じた分類が無いため、ソフトウェア事業に最も近い it を暫定の主たる業界とし、taxonomyGaps に提案を記録した。
- industry: 金型製造事業（外部売上849百万円）は報告セグメントとして金額が開示されているため、金型（工作機械・産業機械に近い金属加工の型）に最も近い machinery を2つ目に付けた。金型そのものの区分は閉じた分類に無い。
- relatedCompanies: en（エン）: ambiguous で、「コンピュータエンジニアリング」等の一般語・社名の部分一致のみ。エン株式会社についての印字なし。
- relatedCompanies: port（ポート）: 「サポート」の部分一致のみ。ポート株式会社についての印字なし。
- relatedCompanies: vision（ビジョン）: 「グループビジョン」の一般語の一致のみ。株式会社ビジョンについての印字なし。
- relatedCompanies: ntt（NTT）: 印字されているのは株式会社ＮＴＴデータエンジニアリングシステムズで、NTT株式会社とは別の法人。同社の新設子会社である株式会社ＮＤＥＳの株式取得はグループの出来事として沿革に記し、NTT株式会社とは結ばなかった。
- relatedCompanies: base-4481（ベース）: 「営業利益ベース」等の一般語の一致のみ。
- relatedCompanies: core（コア）: ambiguous で、「コア事業」の一般語の一致のみ。
- relatedCompanies: path（パス）: ambiguous で、「加工パス」等の技術用語の一致のみ。
- relatedCompanies: seki（セキ）: ambiguous で、「セキュリティ」等の部分一致のみ。
- relatedCompanies: alpha（アルファ）・alpha-4760（アルファ）: 沿革の「アルファホールディングス株式会社」は当社自身の旧商号で、株式会社アルファとは別の法人。
- relatedCompanies: create（クリエイト）: 大株主の株式会社山口クリエイトはクリエイト株式会社とは別の法人で未上場。候補の法人とは結ばなかった。
- relatedCompanies: densan（電算）: ambiguous で、株式会社電算についての取引・提携の印字なし。
- relatedCompanies: land（ランド）: 「ブランド」等の部分一致のみ。
- relatedCompanies: nagawa（ナガワ）: 当社が特定投資株式として保有する相手だが、保有目的は販路拡大のための機能強化等の情報収集であり、取引・提携の印字がないため結ばなかった。
- relatedCompanies: nishi-nippon-financial-holdings（西日本フィナンシャルホールディングス）: 当社が特定投資株式として保有する金融グループで、保有目的は財務体質の安全性強化のためであり、結ばなかった。
- relatedCompanies: trust（トラスト）: listing がコードリストになく、信託口の名義の一致のみ。
- relatedCompanies: 候補に無いため結ばなかった相手: 株式会社山口クリエイト（2025年12月31日現在で17.23％を保有する最大の大株主だが未上場で候補にない）、日本生命保険相互会社（同4.73％。保険会社であり結ばない）、乗田工業株式会社（同1.54％の大株主だが候補にない）、株式会社ＮＴＴデータエンジニアリングシステムズ（株式会社ＮＤＥＳの分社化元の会社だが候補にない）。
- relatedCompanies: 自社の連結子会社8社（株式会社ＣＧＳ、株式会社Ｃ＆Ｇシステムズ、株式会社ＮＤＥＳ、CGS NORTH AMERICA,INC.(USA)、CGS NORTH AMERICA INC.(CANADA)、CGS ASIA CO.,LTD.、CGS ASSISTING(THAILAND)CO.,LTD.、Tritech International,LLC）は規則により結ばない。
- terms: 助言のみ。用語候補: 「CAD/CAM」（コンピュータで設計（CAD）と製造（CAM）を支援するシステム。金型や部品の設計データを加工機械のデータに変える）、「ファブレス」（自社工場を持たず、製造を外部に委託する方式）、「サブスクリプション」（定額を払って一定期間ソフトウェアを使う契約形態）、「純粋持株会社」（事業を子会社に委ね、自らは株式の保有とグループ経営に専念する持株会社）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ＣＧＳホールディングス（cgs-holdings）の主たる事業（CAD/CAMシステム等事業） → 提案: 製造業向け設計・生産ソフトウェア（CAD/CAM）。売上の大半を占めるCAD/CAMシステム等事業は、金型・部品メーカー向けに設計・製造支援ソフトウェア（CAD/CAM）を開発・販売し保守を提供する事業であり、既存の閉じた分類に製造業向けソフトウェアに当たる区分がないため。
