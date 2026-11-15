# ライト工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ライト工業株式会社 |
| 証券コード | 1926 |
| docID（データを取り出した文書） | `S100YIK2` |
| 原本 docID | `S100YIK2` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIK2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ライト工業株式会社 / 1926 / docID S100YIK2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
raito-kogyo: 10 件の数値を有報XBRLと照合
有報: ライト工業株式会社 有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100YIK2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
raito-kogyo: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは全行一致し、決算期変更・変則決算・会計基準の変更はないため financialNotes は空にしました。
- businessModel: 中期経営計画の数値目標のうち本文に書けるのは売上高だけのため、営業利益・ROE・配当性向・DOEの目標は記載していません。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」で、提出後の書類もないため ack は不要でした。
- businessStructure: 報告セグメントは「建設事業」の1つのみで、その他は報告セグメントに含まれない区分です。建設事業の内訳は、関連情報ではなくMD&Aの売上実績（工種別）の印字を用いました。
- businessStructure: 工種別の売上高の単純合計は139,024百万円で、セグメントの外部顧客への売上高139,027百万円とは3百万円の差があります（MD&Aでも一般土木・その他工事の合計が表と1百万円異なります）。いずれも有報の印字どおりに記載し、調整はしていません。
- businessStructure: 沿革の末尾は「2023年３月」と「2025年11月」の行が連結して印字されていますが、事象の並びから2023年3月の株式取得と2025年11月の合弁会社設立に分けて読みました。
- history: 沿革には支店の設置や子会社の設立が多数並びますが、事業の転機となるものを中心に選びました。
- history: 1949年の建設大臣登録や建設業許可の更新は、許認可の手続きとして沿革には入れませんでした。
- industry: 主たる業界は、連結売上高の99.9％を占める建設事業から construction としました。土木が中心で建築も含みますが、分類上は1つにまとめました。
- industry: その他（商品資材販売・リース・訪問介護）は売上構成がごく小さいため業界には付けていません。
- relatedCompanies: 第一建設工業・名工建設・五洋建設・大成建設・鉄建建設・安藤・間・松井建設・西松建設・大林組・金下建設・デュアルタップ：特定投資株式の保有目的が「当社の元請事業者であり、建設工事の受注や施工を通じた取引関係の円滑化のため保有」という全銘柄共通の定型句のみで、銘柄固有の取引内容の印字がなく、当社の大株主でもないため結びませんでした。
- relatedCompanies: 岡部：特定投資株式の保有目的が「当社の建設資材の調達先であり、調達関係の強化及び円滑化を図ることを目的に保有」という定型的な記載のみで、他の節に取引の裏付けがないため結びませんでした。
- relatedCompanies: 建設技術研究所：保有目的は「業界動向等の情報収集のため」のみで、取引・提携の印字がないため結びませんでした。
- relatedCompanies: ほくほくフィナンシャルグループ・三井住友フィナンシャルグループ・T&Dホールディングス・三井住友トラストグループ・宮崎銀行：特定投資株式の表に載る金融機関で、保有の理由も金融取引のため結びませんでした。
- relatedCompanies: 東海旅客鉄道・JX金属：完成工事や手持工事の発注者として工事名とともに名前が出るだけで、提携・資本関係の印字がないため結びませんでした。
- relatedCompanies: 高速・東名・エン・ベース・セキ・コア・ランド・IC・ビジョン・大和・キャリア・平和・モイ：いずれも一般語・部分一致の誤マッチ（高速道路、東名高速道路、時価ベース、セキュリティ、コア事業、ブランド、中長期ビジョン、役員の氏名など）で、各社との取引・提携・資本関係の印字はありません。
- relatedCompanies: 連結子会社と持分法適用関連会社（Fecon Corporationなど）はいずれも非上場で候補に含まれていないため、relatedCompanies には結んでいません。
- relatedCompanies: 【大株主の状況】に載るのは信託銀行・生命保険会社・銀行・海外ファンドのみで、候補の事業会社は含まれていません。
- terms: 用語候補： 法面（斜面の人工的な表面で、法面保護工事の対象）、地盤改良（建築物や構造物を支える地盤を改良する工事）、特殊土木（当社が自社の独自分野と位置づける土木分野）——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
