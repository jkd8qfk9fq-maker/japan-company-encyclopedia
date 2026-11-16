# インティメート・マージャー — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社インティメート・マージャー |
| 証券コード | 7072 |
| docID（データを取り出した文書） | `S100XBTQ` |
| 原本 docID | `S100XBTQ` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBTQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社インティメート・マージャー / 7072 / docID S100XBTQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
intimate-merger: 10 件の数値を有報XBRLと照合
有報: 株式会社インティメート・マージャー 有価証券報告書－第13期(2024/10/01－2025/09/30) (docID S100XBTQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
intimate-merger: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記は従業員数の定義（就業人員である旨）のみで、表示事項のため financialNotes には入れず、ここに記録しました。
- businessModel: 財務諸表の注記の表示方法の変更（「ポイント還元収入」の表示区分を独立掲記に改め、前連結財務諸表を組替えたもの）は表示方法のみの変更で、主要な経営指標等の数値に影響しないため、financialNotes には入れず、ここに記録しました。前期有報との指標の照合でも6系列すべて差異はありませんでした。
- businessModel: 経営者による分析には売上高と純利益以外の利益項目の金額や増減率も印字されていますが、本文には売上高と純利益だけを書きました。業績予想との比較や経営指標としての利益目標も本文・戦略には書いていません。
- businessModel: 自己株式の取得と、2025年6月4日付の自己株式の消却（220,000株）は当期中の資本政策であり、本文には書かず、ここに記録しました。重要な後発事象は連結・個別とも「該当事項はありません」でした。
- businessModel: Wikipediaの記事が見つかりましたが、抜粋は有報の事実の言い換えにとどまるため、補足には使っていません。
- businessStructure: 単一セグメント（DMP事業）のため、子区分は事業の内容に印字されたサービスの区分（データマネジメント・アナリティクスサービス／マーケティング支援サービス／Performance DMP／Select DMP）に基づきました。サービス別の売上高は有報に独立して開示されていないため、各子区分に金額は書いていません。
- businessStructure: 連結子会社のクレジットスコア株式会社（議決権の所有割合95.00％）は自社の子会社のため関連企業には結ばず、DMP事業の説明の中に事業内容を記載しました。
- businessStructure: この作業ツリーの旧スキーマのため suppliers キーは省略しました。有報には個別の仕入先の社名は印字されておらず、データの一部をインターネットリサーチ会社やデータプロバイダーから購入している旨の記載のみです。
- history: 沿革の9行はすべて年月と事象が対応しており、全行を採用しました。資本金の金額は沿革に印字されていません。
- history: 2019年には「Performance DMP」の提供開始とマザーズ上場の2件があり、別々の項目として記載しました。
- industry: 主たる業界は、オーディエンスデータのプラットフォーム「IM-DMP」や共通ID「IM-UID」など、データ基盤そのものを提供する事業であるため、itを直接の当てはめとして主たる業界としました。広告は主な活用領域ですが、広告枠や広告そのものを販売する事業ではないため、広告を主たる業界とはしませんでした。
- relatedCompanies: ローソン・ユナイテッドシネマ株式会社は2025年9月期の主要な顧客（売上高400,327千円、11.9％）ですが、関連候補にありません。候補のunited（2497、ユナイテッド株式会社）は別法人で、社名の一部が一致するだけのため結んでいません。
- relatedCompanies: 株式会社メタップスワンは前期（2024年9月期）の主要な顧客（売上高379,777千円）ですが、関連候補にないため結んでいません。
- relatedCompanies: 株式会社Preferred Infrastructureは2013年の設立時の合弁相手ですが、関連候補にないため結んでいません。連結子会社のクレジットスコア株式会社は自社の子会社のため結んでいません。
- relatedCompanies: 大株主の楽天証券株式会社、株式会社SBI証券、GMOクリック証券株式会社、野村證券株式会社はいずれも証券会社の保有として結んでいません。候補のmatsui-securities（8628、松井証券株式会社）も同様に証券会社の保有として結んでいません。株式会社SBI新生銀行も大株主に載りますが、結んだ関係は共同事業に基づくもので、保有に基づくものではありません。
- relatedCompanies: en（4849）、base-4481（4481）、ray（4317）、core（2359）、rikei（8226）、seki（7857）、the-lead（6982）、como（2224）、no-1（3562）、path（3840）、port（7047）、rhythm（7769）、taya（4679）、will（3241）は一般語や部分一致であり、当社との関係は印字されていないため結んでいません。nissin（9066）はコードリストにない候補であり、当社との関係も印字されていないため結んでいません。
- relatedCompanies: 特定投資株式は「該当事項はありません」でした。
- terms: 助言のみ。用語の候補としては「DMP（データマネジメントプラットフォーム）」「DSP」「SSP」「アドネットワーク」「3rd Party Cookie」「オーディエンスデータ」「IM-UID」「AI-Readyデータ」「リードジェネレーション」などが挙げられますが、本工程ではデータを持ちません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
