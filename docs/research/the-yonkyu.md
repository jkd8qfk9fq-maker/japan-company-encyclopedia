# ヨンキュウ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ヨンキュウ |
| 証券コード | 9955 |
| docID（データを取り出した文書） | `S100YDUS` |
| 原本 docID | `S100YDUS` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDUS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ヨンキュウ / 9955 / docID S100YDUS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-yonkyu: 10 件の数値を有報XBRLと照合
有報: 株式会社ヨンキュウ 有価証券報告書－第52期(2025/04/01－2026/03/31) (docID S100YDUS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
the-yonkyu: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: この worktree のスキーマには businessModel の suppliers キーがないため suppliers は省略した。仕入れに関する事実（四国及び九州の漁業協同組合・養殖業者等から養殖魚を仕入れること）は businessStructure と businessModel の本文に記録した。
- businessModel: 金額は千円額を百万円単位に切り捨てて記載した（切り捨て convention）。MD&A が億単位で印字する連結売上高476億76百万円と当期純利益37億84百万円は、セグメント注記の百万円切り捨て値と整合する。
- businessModel: 表示方法の変更（営業外費用の支払手数料の組替え）は表示変更のみのため financialNotes には書かず、businessStructure の warnings に記録した。financialNotes は空とした（変則決算・決算期変更・会計基準変更に当たる 5年表の注記はない）。
- businessModel: 中長期的な目標数値は設定していない旨が経営方針と MD&A に印字されているため、perspectives には目標数値を転記しなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした。「その他の事業」は報告セグメントに含まれない区分であり、最後に置いた。
- businessStructure: 金額はセグメント注記の千円額を百万円単位に切り捨てて記載した（切り捨て convention）。外部売上高の単純合計は47,675百万円となり、印字の連結売上高47,676百万円と1百万円異なるが、印字どおりの各値を引用した。
- businessStructure: 表示方法の変更は、連結損益計算書の営業外費用で「支払手数料」を独立掲記から「その他」への含め表示に変えた表示上の組替えのみであり、表示変更のみの再分類として warnings にのみ記録し、financialNotes には書かなかった。5年表の数値に前期有報との差異はない（修正再表示チェックは全系列一致）。
- history: 沿革に印字された資本金・出資金の金額は、禁止される財務金額に当たるため、すべての沿革行で省略した。
- history: 2025年3月の最上鮮魚の追加取得は期中に完了し期末構造に反映されているため、needsReview ではなく沿革と warnings に記録した。
- history: 2020年3月の本社第二製氷工場の設置と2021年9月の資本・業務提携は、沿革表で年月と事象が並んで印字されており、行順で対応づけた。製氷工場の設置は事業構造を変えるものではないため沿革には含めなかった。
- industry: 主たる事業は鮮魚の販売事業と餌料・飼料の販売事業であり、売上高のほぼ全体を占める。閉じた分類に水産業・水産物卸売がないため、最も近い food（食品）を主産業として暫定で付け、taxonomyGaps に記録した。運送事業はその他の事業でごく小さいため transportation は付けなかった。
- relatedCompanies: モイ（5031）：「モイストペレット」の「モイ」への一致であり、モイ株式会社ではないため結ばなかった。
- relatedCompanies: キャリア（6198）：キャリアプランなどの普通名詞への一致であり、株式会社キャリアではないため結ばなかった。
- relatedCompanies: ポート（7047）：普通名詞の一部への一致であり、ポート株式会社との関係は印字されていないため結ばなかった。
- relatedCompanies: ビジョン（9416）：経営ビジョンという普通名詞への一致であり、株式会社ビジョンではないため結ばなかった。
- relatedCompanies: 中部飼料（2053）、中央魚類（8030）、大黒天物産（2791）、ヒガシマル（2058）：特定投資株式の保有目的が「売買取引の緊密化のため」という定型的な文言のみで、業務提携等の具体的な概要は印字されていないため、その保有だけでは結ばなかった。
- relatedCompanies: いよぎんホールディングス（5830）：特定投資株式の保有目的は金融機関取引の緊密化のためという定型的な文言のみである。また、大株主として記載されているのは株式会社伊予銀行であり、同ホールディングスとは別の法人であるため結ばなかった。
- relatedCompanies: 愛媛銀行（8541）：大株主として記載されている金融機関であり、金融機関の保有は関係に当たらないため結ばなかった。同様に大株主の株式会社伊予銀行と株式会社香川銀行も金融機関のため結ばなかった。
- relatedCompanies: 西本Wismettacホールディングス（9260）：related-candidates.json で listing が「（コードリストにない）」とされており、検証できないため結ばなかった。実際の提携相手はその連結子会社であるWismettacフーズ株式会社であり、同社自体は候補に含まれていない。資本・業務提携の事実は沿革に記録した。
- relatedCompanies: 坂本飼料株式会社、坂本水産、松下水産、木村水産：資本・業務提携の相手として印字されているが、いずれも related-candidates.json に含まれない（上場の掲載済み企業ではない）ため結ばなかった。提携の事実は沿革と、フィード・ワン及び Umios の説明に記録した。
- relatedCompanies: 連結子会社（株式会社海昇、四急運輸株式会社、日振島アクアマリン有限責任事業組合、株式会社西日本養鰻）と持分法適用関連会社（株式会社最上鮮魚）は自社グループの会社であり、関連企業リンクの対象ではないため結ばなかった。各社の役割は businessStructure に記録した。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ヨンキュウの水産物卸売・養殖支援事業 → 提案: fisheries（水産業・水産物卸売）。主事業は養殖魚などの鮮魚の卸売と養殖魚用餌料・飼料の販売であり、食品製造ではなく水産業に属する。閉じた分類に水産業がないため、最も近い food を暫定とした。
