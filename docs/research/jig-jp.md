# jig.jp — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ｊｉｇ．ｊｐ |
| 証券コード | 5244 |
| docID（データを取り出した文書） | `S100YGSA` |
| 原本 docID | `S100YGSA` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGSA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ｊｉｇ．ｊｐ / 5244 / docID S100YGSA（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jig-jp: 10 件の数値を有報XBRLと照合
有報: 株式会社ｊｉｇ．ｊｐ 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YGSA)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第22期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
jig-jp: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社jig.jp」が EDINET の提出者名「株式会社ｊｉｇ．ｊｐ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: MD&Aに印字された売上高以外の利益の金額と増減率は、規則により本文に書かなかった。売上高の増減と理由に相当する範囲のみを書いた。
- businessModel: 前期（第22期）の有価証券報告書には訂正有価証券報告書が提出されているが、当期有報の修正再表示チェックでは前期有報と重複する年度の数値は全て一致しており、経営指標への影響はないことを確認した。
- businessModel: 主要な経営指標等の注記のうち、2022年8月のA種優先株式の取得請求権行使と消却、種類株式の定款定めの廃止は資本構成の事実としてここに記録する。本文には書かなかった。
- businessStructure: 報告セグメントは一般消費者向け関連事業を主要な事業とし、他の事業セグメントの重要性が乏しいためセグメント情報の記載は省略されている。事業区分ごとの売上高は開示されていないため、金額は書かなかった（グループ収益の約95％が「ふわっち」のアイテム販売である旨は【事業の内容】の印字どおり）。
- businessStructure: サプライヤー欄はこのツリーのスキーマに無いため省略した。主要な顧客として印字されたApple Inc.、Google Inc.、株式会社DGフィナンシャルテクノロジー、PayPay株式会社はいずれも関連企業候補にないため、関連企業には結ばなかった。
- businessStructure: 連結子会社の株式会社B Inc.、株式会社C Inc.、株式会社アンビリアルは2026年3月末時点で債務超過である旨が【関係会社の状況】の注記に印字されている。金額は書かなかった。
- history: 沿革の2026年4月の「株式会社バチェラーデートの全株式を取得し、子会社化（株式会社Mirisへ商号変更）」は決算日後の出来事のため沿革には入れず、businessStructure の needsReview に記録した。
- history: 設立時の資本金の額は、沿革に印字されているが金額の規則により書かなかった。
- industry: 主たる業界は entertainment とした。売上の約95％がライブ配信サービス「ふわっち」のアイテム販売によるもので、消費者向けのライブ配信プラットフォーム事業が実質である。閉じた分類にライブ配信プラットフォームを表す値がないため、最も近い entertainment を暫定とし、taxonomyGaps に記録した。自治体向け・企業向け関連事業は金額開示がなく重要性が乏しいため、2つ目の業界は付けなかった。
- relatedCompanies: nomura-research-institute（株式会社野村総合研究所）: 経営環境の説明で市場予測レポート（ITナビゲーター2021年版）の引用元として印字されているだけで、取引や提携の記述はないため結ばなかった。
- relatedCompanies: en（エン・ジャパン）、ficha（フィーチャ）、king（キング）、seki（セキ）、corona（コロナ）、innovation（イノベーション）、career（キャリア）、ray（レイ）、base-4481（ベース）、core（コア）、kohsoku（高速）、land（ランド）、nice（ナイス）、port（ポート）、vision（ビジョン）: いずれも一般語や部分文字列の一致によるもので、各社への言及はないため結ばなかった。
- relatedCompanies: giftee（ギフティ）、tryt（トライト）: 候補の listing が上場でない（コードリストにない）ため対象外とした。なお本文にも各社への言及はない。
- relatedCompanies: 主要な顧客として印字されたApple Inc.、Google Inc.、株式会社DGフィナンシャルテクノロジー、PayPay株式会社は候補にないため結ばなかった。大株主は個人と証券会社等の純投資主体のみで、事業会社の大株主はなかった。政策保有株式は該当事項なしと印字されている。
- terms: 用語の助言: 「ふわっち」は誰でもスマートフォンやPCからライブ配信と視聴ができるライブ配信サービスで、視聴ユーザーが配信中に使うアイテムの販売が主な収益源です。「アイテム」は配信画面を盛り上げるエフェクト等に使う有料・無料のアイテム、「配信ユーザー」はライブ配信を行う利用者、「視聴ユーザー」は視聴やコメントを行う利用者を指します。「IchigoJam」はプログラミング専用のこどもパソコン、「オープンデータプラットフォーム」は自治体の公開データを統一形式へ変換して公開できる仕組み、「ARPPU」は課金ユーザー1人当たりの平均課金額を意味します。

## 要確認（status に反映）

- businessStructure: 提出後の2026年4月20日の取締役会で、株式会社バチェラーデートの全株式を取得して子会社化することを決議し、2026年4月に取得して株式会社Mirisへ商号変更している。登録は2026年3月31日現在の連結子会社4社の構成とした。
- businessStructure: 2022年6月23日付で普通株式1株につき1,500株の割合で株式分割を行っている（主要な経営指標等の注記に印字）。
- businessStructure: 2025年12月にスマート眼鏡ブランド「SABERA」を設立し、スマート眼鏡事業を開始している（沿革に印字）。事業区分としての金額開示はないため、businesses には独立した区分として追加しなかった。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] jig.jpの主たる業界 → 提案: ライブ配信プラットフォーム（ライブストリーミング）。売上高の約95％がライブ配信サービス「ふわっち」におけるアイテム販売であり、事業の実質は消費者向けライブ配信プラットフォームの運営である。しかし閉じた分類にライブ配信プラットフォームを表す値がないため、エンターテインメントに最も近い entertainment を暫定とした。
