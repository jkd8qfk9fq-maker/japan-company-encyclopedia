# 北日本銀行 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　北日本銀行 |
| 証券コード | 8551 |
| docID（データを取り出した文書） | `S100Y8FP` |
| 原本 docID | `S100Y8FP` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y8FP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　北日本銀行 / 8551 / docID S100Y8FP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-kita-nippon-bank: 10 件の数値を有報XBRLと照合
有報: 株式会社　北日本銀行 有価証券報告書－第122期(2025/04/01－2026/03/31) (docID S100Y8FP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
the-kita-nippon-bank: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて有報の百万円印字のまま記載した（連結経常収益30,308百万円、親会社株主に帰属する当期純利益4,363百万円、セグメント外部経常収益）。千円額の換算や四捨五入はしていない。
- businessModel: businessModel に suppliers は書いていない（このツリーのスキーマに無いキー）。銀行業務に仕入先にあたる開示は無い。
- businessModel: financialNotes は空：会計基準の変更・変則決算・決算期変更の印字はなく、summary の irregularPeriods は空であり、前期有報との修正再表示チェックも全系列で差異ゼロだった。
- businessModel: 中期経営計画の主要計数目標（2026年度目標として単体の収益性・効率性・健全性の各指標）は投資・収益指標を含むため本文・戦略には書かず、ここに記録する：2025年5月14日に最終年度の数値目標を上方修正した旨が印字されている。
- businessModel: 株式会社アイビーシー・ソフトアルファとの資本業務提携に基づきDX関連事業を加速させる旨が経営方針に印字されているが、同社は related-candidates に無く（候補の株式会社アルファ等は別法人）、関連企業としては結んでいない。事実は relatedCompanies の warnings にも記録した。
- businessModel: 重要な後発事象は連結・個別とも『該当事項はありません』と印字されている。
- businessStructure: 事業の並び順はセグメント情報の外部顧客に対する経常収益の大きい順（銀行業26,737百万円／リース業3,408百万円／クレジットカード業・信用保証業150百万円／その他11百万円）。MD&Aのセグメント経常収益は内部取引を含む数値のため使っていない。
- businessStructure: セグメント表の印字合計（報告セグメント計30,296百万円、その他を合わせた合計30,308百万円）は各区分の単純合計と1〜2百万円ずれるが、有報の丸めとして印字どおり引用した。
- businessStructure: 連結子会社3社（きたぎんリース・システム、きたぎんユーシー、きたぎんキャピタルパートナーズ）はグループ会社であり、relatedCompanies には結んでいない。2026年1月に設立した、きたぎんキャピタルパートナーズ1号投資事業有限責任組合は持分法非適用の非連結子会社である。
- history: 沿革は【沿革】の印字から主要な出来事を選んだ。資本金の金額は沿革には書いていない（子会社の設立年についても資本金額は記載していない）。
- history: 2009年10月のきたぎんリース株式会社ときたぎんコンピュータサービス株式会社の合併（存続会社きたぎんリース、商号をきたぎんリース・システム株式会社へ変更）は本文の事業説明で補い、沿革の行としては代表的な出来事に絞った。
- industry: 銀行業が経常収益の大半を占め、リース業・クレジットカード業・信用保証業・投資業務も金融サービスであるため、主たる業界は finance のみとした。
- relatedCompanies: kamei、ferrotec、arcs は特定投資株式の保有目的が各社個別に書かれ（ビジネスマッチング契約、岩手県内工場建設を契機とする長年の取引、傘下ベルジョイスとの創業当時からの取引）、取引関係の維持・強化が明記されているため結んだ。
- relatedCompanies: tomony-holdings と tomato-bank は、保有目的が『基幹系システム共同利用行』という具体的な協力の役割で書かれており、汎用的な定型句ではないため結んだ。
- relatedCompanies: hitachi は沿革に基幹系システムの共同利用サービス『NEXTBASE』への移行が印字され、大株主でもあるため結んだ。
- relatedCompanies: sunday は当事業年度に保有が無くなった（株式数が『―』）ため結ばなかった。
- relatedCompanies: 株式会社アイビーシー・ソフトアルファとの資本業務提携（DX関連事業の加速）は経営方針に印字されているが、同社自身は related-candidates に無く、候補にある株式会社アルファ（alpha、alpha-4760）やアイビーシー株式会社（internetworking-and-broadband-consulting）は別法人であるため結ばなかった。
- relatedCompanies: 大株主のうち、明治安田生命保険相互会社（4.52％）、住友生命保険相互会社（1.66％）、株式会社みずほ銀行（0.91％）は保険・資金調達等の金融機関関係として結ばなかった。日本マスタートラスト信託銀行（信託口）・株式会社日本カストディ銀行（信託口）は信託口の純投資として結ばなかった。株式会社十文字チキンカンパニー（1.22％）は候補に無いため結ばなかった。北日本銀行従業員持株会は結ぶ対象ではない。
- relatedCompanies: seki、career、en、vision、base-4481、port、nissin、innovation、path、rent、core、trust は一般語・制度名の一致（関、キャリア、エンゲージメント、ビジョン、ベース、サポート、日新、フィナンシャルイノベーション、ITパスポート、タレント、コア事業基盤、信託口）で、相手企業への言及ではないため結ばなかった。
- terms: 助言のみ：銀行の収益を表す『経常収益』、貸出の保証を担う『信用保証』、基幹系システムの共同利用サービス『NEXTBASE』は、この会社の解説で読者がつまずきやすい語として用語候補に挙げる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
