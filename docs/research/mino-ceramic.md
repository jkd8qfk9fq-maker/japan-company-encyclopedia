# 美濃窯業 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 美濃窯業株式会社 |
| 証券コード | 5356 |
| docID（データを取り出した文書） | `S100YG4G` |
| 原本 docID | `S100YG4G` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG4G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 美濃窯業株式会社 / 5356 / docID S100YG4G（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mino-ceramic: 10 件の数値を有報XBRLと照合
有報: 美濃窯業株式会社 有価証券報告書－第164期(2025/04/01－2026/03/31) (docID S100YG4G)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mino-ceramic: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aの利益額や利益の増減理由は本文に書かなかった（本文の財務数値は売上高と親会社株主に帰属する当期純利益のみ）。受注高・受注残高の金額も書いていない。
- businessModel: 中期経営計画の数値目標（売上高や利益の目標額、利益率の目標、配当性向の目標）は目標値のため、本文とperspectivesに書かなかった。
- businessModel: 証拠パックの「財務諸表の組替え」の注意について：前期有報との照合で重複年度の数値は全て一致した。経営指標の注記にある会計基準の遡及適用の事実は financialNotes に記録し、それ以外の組替えに当たる事実は書いていない。
- businessModel: 経営指標のその他の注記（役員株式給付信託・従業員株式給付信託の信託財産の取扱い、潜在株式が存在しないための非開示、従業員数は就業人員数である旨）は表示事項のため warnings のみとした。
- businessModel: Wikipediaの記事は事業説明の言い換えのみで、有報にない補足が得られなかったため使わなかった。
- businessStructure: 報告セグメントの名称は当連結会計年度より「耐火物事業」から「耐火物セラミックス事業」に変更されている（名称変更のみでセグメント情報に与える影響はない旨が印字）。登録は変更後の名称によった。
- businessStructure: セグメントの外部顧客への売上高を百万円未満切り捨てで合計すると16,151百万円となり、印字の連結売上高16,154百万円と3百万円差がある。千円単位では合計と一致する切り捨ての差であり、印字の合計をそのまま使った。
- businessStructure: 設備の対応付けは有報のセグメント欄どおりとし、亀崎・瑞浪・四日市工場や名古屋本社事務所のように「耐火物セラミックス事業・不動産賃貸事業」と連記された行は単一の事業に結びつけなかった。プラント部・エンジニアリング部はプラント事業、美州興産の設備は建材及び舗装用材事業、岩佐機械工業の本社はプラント事業に対応する。帳簿価額は書いていない。
- businessStructure: suppliers キーはこのツリーの旧スキーマのため省略した。仕入・委託の事実は関連企業の記録と warnings に残した。
- businessStructure: Fuller Technologies社（米国）は関連企業候補にないため結んでおらず、エンジニアリング部門の説明に販売店の事実として記載した。
- history: 沿革表の2015年３月・2017年９月・2018年12月・2019年９月の４つの年月は事象文と分かれて続けて印字されていた。年月と事象の数がともに４つで一致するため行順で対応づけた（2015年=日本セラミツクエンジニヤリングの連結子会社化、2017年=花王からの事業譲受け、2018年=美州興産の完全子会社化、2019年=ミノセラミックス商事の完全子会社化）。
- history: 2019年のミノセラミックス商事株式会社の株式追加取得による完全子会社化は、2022年に吸収合併された子会社の手続きのため沿革に含めなかった。
- history: 落とした行：1936年 合資会社三和窯業商会の買収、1937年 亀崎工場の新設、1942年 中央珪石煉瓦株式会社の吸収合併、1960年 美濃窯業製陶株式会社の設立、1961年 美窯原料株式会社の設立、1966年 日本セラミツクエンジニヤリング株式会社の設立、1970年 タイ合弁会社G.S.CERAMICSの設立、1972年 ミノー油絵具株式会社の設立、1976年 ミノセラミックス商事株式会社の設立、1977年 フィリピン合弁会社の設立、1978年 モノリス株式会社の設立、1984年 株式会社ブライトセラムの設立、1990年 美窯原料とブライトセラムの合併による株式会社ビヨーブライトの発足、1996年 ミノー油絵具の株式会社クサカベへの売却、2022年 大阪営業所の名古屋営業所への統合（営業所・工場の開設行と、後に吸収合併・消滅した子会社の設立行）。
- history: 設立時の資本金の金額は沿革に書かなかった。
- industry: 主たる業界は耐火物・セラミックス製品の製造販売が最大事業であることから、素材メーカーとして最も近い chemicals を暫定とした（taxonomyGaps に記録）。
- industry: プラント事業（工業炉・自動化設備の設計・製造・施工）が売上の約４割を占めるため machinery を副分類とした。不動産賃貸事業は独立した報告セグメントとして開示されているため real-estate を副分類とした。
- relatedCompanies: career: 「キャリア形成」等の一般語の部分一致のみで、会社としての記載はないため結ばなかった。
- relatedCompanies: freee: 「フリー・キャッシュ・フロー」の部分一致のみのため結ばなかった。
- relatedCompanies: base-4481: 「連結ベース」の部分一致のみのため結ばなかった。
- relatedCompanies: port: 「サポート」の部分一致のみのため結ばなかった。
- relatedCompanies: applied-technology: 「応用技術開発」という一般的な表現の一致のみのため結ばなかった。
- relatedCompanies: corona: 「新型コロナウイルス感染症」の部分一致のみのため結ばなかった。
- relatedCompanies: innovation: 「イノベーション」という一般語の一致のみのため結ばなかった。
- relatedCompanies: seki: ambiguous で、出現は文書管理等の一般的な文脈のみのため結ばなかった。
- relatedCompanies: kao: ambiguous の相手。2017年９月の高機能セラミックス事業の譲受けは一回限りの過去の取引であり、継続的な取引・提携の印字がないため結ばず、沿革に記録した。
- relatedCompanies: the-bank-of-nagoya / the-ogaki-kyoritsu-bank / juroku-financial-group / mizuho-financial-group / tokai-tokyo-financial-holdings: 銀行で、出現は大株主の状況や借入先としての記載であり、資金調達が理由のため結ばなかった。
- relatedCompanies: ms-and-ad-insurance-group-holdings: 保険・金融の相手で、取引関係の個別の印字がないため結ばなかった。
- relatedCompanies: howa-machinery / janis / kikukawa-enterprise / taiho-transportation: 特定投資株式の保有目的が「安定株主としての事業運営の円滑化」という全銘柄共通の定型句のみで、個別の取引関係の印字がないため結ばなかった。
- terms: 助言のみ。用語としては「耐火煉瓦」「不定形耐火物」「ロータリーキルン」「築炉」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] mino-ceramicの主たる業界（耐火物セラミックス事業） → 提案: 窯業・耐火物（セラミックス）。最大の事業は耐火煉瓦などの耐火物とセラミックス製品の製造・販売であり、プラント事業も工業窯炉が中核だが、閉じた分類に窯業・耐火物の区分がなく、素材メーカーとして最も近い chemicals を暫定とした。
