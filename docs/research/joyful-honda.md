# ジョイフル本田 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジョイフル本田 |
| 証券コード | 3191 |
| docID（データを取り出した文書） | `S100Z1T7` |
| 原本 docID | `S100Z1T7` |
| 提出日（原本） | 2026-09-15 |
| 決算期 | 2026-06-20 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z1T7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジョイフル本田 / 3191 / docID S100Z1T7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
joyful-honda: 2 件の数値を有報XBRLと照合
有報: 株式会社ジョイフル本田 有価証券報告書－第51期(2025/06/21－2026/06/20) (docID S100Z1T7)
前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること
利益・総資産・純資産・従業員数: 4 件を照合
すべて一致しました。
joyful-honda: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは「前期有報と突き合わせられる行がない」という結果でした。前期は連結財務諸表を作成しておらず、突き合わせる連結の行自体がないためであり、組替えや修正再表示の記載は本文にありません。この判断をここに記録します。
- businessModel: 配当政策にDOE（株主資本配当率）の目安が印字されていますが、投資の語にあたるため本文には書いていません。
- businessModel: 当期純利益には負ののれん発生益が含まれますが、金額は本文の財務数値の規則のため書いていません。
- businessStructure: 当社グループはホームセンター事業の単一セグメントで、セグメント情報の記載自体が省略されています。事業の下位区分は、MD&Aの販売実績（主要分野別および商品グループ別）の印字を用い、金額もその印字どおりに記載しました。
- businessStructure: 分野別の合計は印字の合計（住まい75,195百万円・生活57,622百万円）をそのまま引用しています。商品グループ別の金額を足し合わせると住まいが75,194百万円、生活が57,621百万円となり、印字の合計と1百万円ずつ異なりますが、有報の丸めによるものです。
- businessStructure: リフォーム事業部は、翌連結会計年度（2026年6月21日）から屋号を「JOYFUL HOME」に変更することが公表されています。提出時点では予定のため、事業名は現在の区分のまま記載しました。
- businessStructure: 大規模小売店は17店舗、専門小売店は17店舗が【事業の内容】の店舗表に載っています。店舗数の内訳は本文には書いていません。
- history: 沿革の表は年月と概要が1行に続けて印字されており、行順の対応づけは不要でした。
- history: 店舗開設は多数あるため、1号店と新ブランド・大型店の節目だけを取り上げ、個別の専門店開設の多くは省きました。
- history: 設立時の資本金額は、本文の財務数値は売上高と当期純利益だけとする規則のため記載していません。
- industry: 主たる業界は、ホームセンターでの商品販売が売上の大半を占めるため retail としました。リフォーム工事も手がけますが、単一セグメントの中で商品グループ単位の開示にとどまるため、2つ目の業界は付けていません。
- relatedCompanies: ジョイフル（joyfull）：自社の社名・店舗名の一部との一致で、株式会社ジョイフルとの関係の印字はないため結びません。
- relatedCompanies: ポート（port）：店舗名「ニューポートひたちなか」の一部との一致のみのため結びません。
- relatedCompanies: ランド（land）：一般語との一致のみのため結びません。
- relatedCompanies: ガーデン（garden）：商品分野名「ガーデン・ファーム」との一致のみのため結びません。
- relatedCompanies: キャリア（career）：人財のキャリア支援という一般語との一致のみのため結びません。
- relatedCompanies: イシン（ishin）：一般語・部分一致の誤マッチのため結びません。
- relatedCompanies: ベース（base-4481）：一般語との一致のみのため結びません。
- relatedCompanies: エン（en）：ambiguous で、正式名称の印字も関係の説明もないため結びません。
- relatedCompanies: ビジョン（vision）：長期ビジョンなどの一般語との一致のみのため結びません。
- relatedCompanies: No．1（no-1）：一般語との一致のみのため結びません。
- relatedCompanies: アエリア（aeria）：正式名称の印字も関係の説明もないため結びません。
- relatedCompanies: アイ・グリッド・ソリューションズ（i-grid-solutions）：正式名称の印字も関係の説明もないため結びません。
- relatedCompanies: セキ（seki）：ambiguous で、一般語との部分一致のみのため結びません。
- relatedCompanies: ゼロ（zero）：ambiguous で、関係の印字がないため結びません。
- relatedCompanies: イオンモール（aeon-mall）：子会社がイオンモールつくば内に店舗を出店していますが、コードリストにない相手のため結びません。
- relatedCompanies: オートバックスセブン（autobacs-seven）：2021年4月に子会社株式を譲渡した1回限りの取引の相手のため結びません。
- relatedCompanies: コア（core）：ambiguous で、関係の印字がないため結びません。
- relatedCompanies: コロナ（corona）：一般語・部分一致の誤マッチのため結びません。
- relatedCompanies: 出光興産（idemitsu-kosan）：2020年2月にガソリンスタンド事業の譲渡契約を締結した1回限りの取引の相手のため結びません。
- relatedCompanies: キムラ（kimura）：株式会社ジョイフルエーケーの共同設立者ですが、現在の取引・提携関係の印字は沿革の設立経緯のみのため結びません。
- relatedCompanies: キング（king）：一般語・部分一致の誤マッチのため結びません。
- relatedCompanies: めぶきフィナンシャルグループ（mebuki-financial-group）：主要取引金融機関で金融取引が理由であり、当事業年度に保有株式も売却済みのため結びません。
- relatedCompanies: クイック（quick）：「クイックリフォーム」という一般語との一致のみのため結びません。
- relatedCompanies: ステップ（step）：ペット販売の仕組み「CLOVER STEP」の語との一致のみのため結びません。
- relatedCompanies: 田谷（taya）：ambiguous で、関係の印字がないため結びません。
- relatedCompanies: トラスト（trust）：信託という一般語との一致で、コードリストにない相手のため結びません。
- relatedCompanies: 連結子会社の株式会社本田、関連会社の株式会社MTJフィットネスと株式会社ジョイフルエーケーは、いずれも非上場で候補リストにないため結んでいません。
- terms: 用語候補： ジョイホン（同社の店舗ブランド）、本田屋（プロ向け専門店の店舗ブランド）、Pet's CLOVER（ペット専門店の店舗ブランド）、THE GLOBE（専門小売店の店舗ブランド）、CLOVER STEP（ペットの衝動買いを避けるため段階を踏んで迎え入れる同社の仕組み）、ドミナント商圏（基幹店舗を中心に専門店を集める出店の考え方）——いずれも有報の本文で同社の事業の説明に使われる語です。

## 要確認（status に反映）

- businessModel: アークランズ株式会社との間で、共同株式移転による共同持株会社の設立を通じた経営統合について、2026年4月14日に基本合意書を締結しました。決算期後の2026年7月3日、アークランズの子会社における不適切な会計処理の疑義に関する特別調査委員会の調査を受けて、最終契約書の締結や株式移転の効力発生日などの日程は未定に変更されました。本登録の事業構成と関係会社は、経営統合前の2026年6月期の区分に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
