# 筑邦銀行 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社筑邦銀行 |
| 証券コード | 8398 |
| docID（データを取り出した文書） | `S100YE9H` |
| 原本 docID | `S100YE9H` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE9H.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社筑邦銀行 / 8398 / docID S100YE9H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 32 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-chikuho-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社筑邦銀行 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YE9H)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-chikuho-bank: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aのセグメント別経常収益はセグメント間の内部経常収益を含むため使わず、セグメント注記の外部顧客に対する経常収益を用いた。金額はいずれも有報の百万円の印字どおりで、換算はしていない。
- businessModel: セグメント別の外部顧客に対する経常収益の単純合計は25,753百万円で、印字の合計25,754百万円と1百万円異なる（調整額は貸倒引当金戻入益で△0百万円と印字）。印字どおりとした。
- businessModel: 中期経営計画2024の数値目標（2027年3月期の連結当期純利益15億円以上、役務取引等収益（単体）23億円以上、コア業務純益（単体）22億円以上、自己資本比率（単体）8.0％以上、誰でもDCプランの導入件数1,950件以上、まちのわ関連収益1億80百万円以上、アライアンス戦略による収益貢献額6億20百万円以上）は、投資指標・目標値であるため本文と戦略には書かず、この warnings に記録した。
- businessModel: 当行は2024年7月1日より外国為替業務の取扱を終了しており、当連結会計年度の国際業務部門は該当がない（MD&A）。沿革の1986年の外国為替業務開始の行は当時の事実としてそのまま記載した。
- businessModel: 経常利益・業務粗利益・資金運用収支などの金額と増減は、本文の財務数値は経常収益と当期純利益だけとする規則のため書かなかった。
- businessModel: 前期有報との修正再表示チェックでは重複する年度の全系列が一致し、会計基準の変更や組替えの印字もないため financialNotes は空とした。
- businessStructure: 報告セグメントは銀行業・リース業の2つで、セグメント注記の外部顧客に対する経常収益の大きい順に並べた。「その他」は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: MD&Aのセグメント別経常収益はセグメント間の内部経常収益を含むため使わず、セグメント注記の外部顧客に対する経常収益を用いた。
- businessStructure: セグメント別の外部顧客に対する経常収益の単純合計は25,753百万円で、印字の合計25,754百万円と1百万円異なる（調整額は貸倒引当金戻入益で△0百万円と印字）。いずれも印字どおりとした。
- businessStructure: 表紙の上場金融商品取引所は福岡証券取引所のみで、市場区分の印字はないため listings に market は書かなかった。
- businessStructure: 本店の所在地は福岡県久留米市諏訪野町（表紙）。Wikipediaの冒頭は本店所在地の事実のみで有報と重複するため、補足には使わなかった。
- businessStructure: businessModel の suppliers はこの作業ツリーのスキーマに無いため書かず、調達に関する事実も有報に個別の印字がないため warnings への記録もしていない。
- history: 1999年12月の第三者割当増資の行は、資本金の金額を含むため沿革には書かなかった（増資の事実のみの印字ではないため）。
- history: 1978年11月の総合オンラインシステム完成、1990年11月の社債等登録法に基づく登録機関の指定の行は、主要な出来事ではないため落とした。
- history: 行数の対応は沿革表の印字どおりで、年月と事象は1対1に対応している。
- industry: 銀行業を中心にリース・保証などの金融サービスを行うグループであり、閉じたリストには金融サービス全般を表す finance のみが該当するため、産業は finance のみとした。
- relatedCompanies: tokyo-century: 特定投資株式の保有目的が他の全銘柄と異なり「ビジネスマッチングなど事業上の業務提携取引及び銀行取引関係の維持・強化」と個別に印字されているため、業務提携取引の根拠があるものとして結んだ。
- relatedCompanies: kyushu-railway: 特定投資株式の保有目的が全銘柄共通の定型句「銀行取引関係の維持・強化」のみで、個別の取引・提携の印字がないため結ばなかった。大株主の状況にも2位以下で載るが政策保有の域を出ない。
- relatedCompanies: yaskawa-electric: 保有目的が定型句のみのため結ばなかった（大株主の状況に2.28％で載るが同様）。
- relatedCompanies: nishi-nippon-railroad: 保有目的が定型句のみのため結ばなかった（大株主の状況に2.31％で載るが同様）。
- relatedCompanies: kraftia: 保有目的が定型句のみのため結ばなかった（大株主の状況に2.24％で載るが同様）。大株主表の社名は株式会社クラフティア（旧・九電工）。
- relatedCompanies: saibu-gas-holdings: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: daiwa-securities-group: 保有目的が定型句のみで、資金調達・証券取引の関係の域を出ないため結ばなかった。
- relatedCompanies: mitsui-high-tec: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: the-torigoe: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: greenland-resort: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: platz: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: saita: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: rkb-mainichi-holdings: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: brightpath-biotherapeutics: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: nanyo: 保有目的が定型句のみのため結ばなかった。
- relatedCompanies: fukuoka-financial-group: 保有目的の変更（持合解消）の文脈でのみ現れ、個別の提携の印字がないため結ばなかった。
- relatedCompanies: the-bank-of-saga: 保有目的の変更（持合解消）の文脈でのみ現れ、個別の提携の印字がないため結ばなかった。
- relatedCompanies: sbi-holdings: 取締役会の活動状況にSBIホールディングス株式会社との資本業務提携の解消が議題として印字されるのみで、現行の提携関係の印字がないため結ばなかった。
- relatedCompanies: hisamitsu-pharmaceutical: コードリストにない相手であり、当行は当事業年度に株式公開買付（TOB）に応じて同社株式の全株式を売却済み（期末保有なし）のため結ばなかった。大株主の状況には2.35％で載る。
- relatedCompanies: career: 「キャリア開発モデル」など一般語の一致で、社名の一致ではないため結ばなかった。
- relatedCompanies: en: 「エンゲージメント」の部分一致で、社名の一致ではないため結ばなかった（ambiguous）。
- relatedCompanies: base-4481: 「連結ベース」など一般語の一致のため結ばなかった。
- relatedCompanies: port: 「ポートフォリオ」の部分一致のため結ばなかった。
- relatedCompanies: core: 「コア業務純益」の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: innovation: 「イノベーション」一般語の一致のため結ばなかった。
- relatedCompanies: tenda: 「アテンダントコース」の部分一致のため結ばなかった。
- relatedCompanies: densan: 沿革の「電算センター」の部分一致のため結ばなかった（ambiguous）。
- relatedCompanies: slogan: 中期経営計画の「スローガン」という一般語の一致のため結ばなかった。
- relatedCompanies: vision: システム名「BankVision」の部分一致のため結ばなかった。
- relatedCompanies: 大株主の状況の筑邦銀行従業員持株会、信託銀行の退職給付信託・信託口、福岡ひびき信用金庫、米城ビルディング、K.ホールディングスは、上場の事業会社としての関連付けの対象ではないため結ばなかった。
- relatedCompanies: 一般社団法人DC推進機構は経営方針に企業型確定拠出年金のアライアンス先として印字されるが、上場会社ではなく候補にもないため結ばなかった（事実は businessModel の戦略に記載）。
- relatedCompanies: 連結子会社5社と持分法適用関連会社の株式会社まちのわホールディングスはグループ会社であり、relatedCompanies には書かなかった（事業構造に記載）。
- terms: 助言: 用語「動かす人」は、中期経営計画2024のスローガン「人、まち、地域を『動かす人』がいる銀行へ」のキーワードで、ブランドメッセージでは「人を動かし、心を動かし、未来を動かす」人と説明されている。
- terms: 助言: 用語「まちのわ」は、持分法適用関連会社の株式会社まちのわホールディングスが行うプレミアム付電子商品券・地域通貨事業の名称系統。中期経営計画では「まちのわ関連収益」が数値目標の項目になっている。
- terms: 助言: 用語「誰でもDCプラン」は、企業型確定拠出年金（企業型DC）の導入支援サービスの名称として中期経営計画の目標項目に現れる。
- terms: 助言: 用語「BankVision（バンクビジョン）」は、2010年1月に稼動した当行の新オンラインシステムの名称。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
