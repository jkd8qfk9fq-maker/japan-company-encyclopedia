# ジュンテンドー — research log

Registered: 2026-11-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ジュンテンドー |
| 証券コード | 9835 |
| docID（データを取り出した文書） | `S100Y6C2` |
| 原本 docID | `S100Y6C2` |
| 提出日（原本） | 2026-05-27 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y6C2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ジュンテンドー / 9835 / docID S100Y6C2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
juntendo: 10 件の数値を有報XBRLと照合
有報: 株式会社ジュンテンドー 有価証券報告書－第65期(2025/03/01－2026/02/28) (docID S100Y6C2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
juntendo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は経営成績の分析の本文に億単位で印字された表記（430億４千万円、３億６千１百万円、１億５千２百万円、部門別売上高）をそのまま用いた。千円単位の表から百万円への換算はしていない。
- businessModel: financialNotesは、経営指標等の注記に印字された収益認識に関する会計基準等の適用（第62期期首から適用）の事実のみを書いた。前期有報との修正再表示チェックは全系列で差異がなかった。
- businessModel: 経営方針に印字された目標とする経営指標は、収益の目標額と利益率の目標であるため転記していない。戦略は重点施策の定性的な記述から要約した。
- businessModel: 調達先については、事業の内容等に調達先を表す一般名詞の印字がないため、suppliersは書かなかった。
- businessModel: 2026年２月期の期末配当は2026年５月28日開催予定の定時株主総会の決議事項とされており、有報提出時点では予定である。資本政策の予定事項のためwarningsに留め、本文には書いていない。
- businessModel: 重要な後発事象は「該当事項はありません」。重要な契約等も「該当事項はありません」。
- businessStructure: 単一セグメントのため、子区分は経営成績の分析に印字された部門別販売実績の区分（家庭雑貨・家庭電器、趣味・嗜好、農業・園芸、建築・ＤＩＹ、その他）を用い、2026年２月期の売上高の大きい順に並べた。部門の金額は同分析の本文に億単位で印字された商品別売上高の表記をそのまま用いた。
- businessStructure: 関連事業は報告セグメントではなく、2025年４月にブックセンター事業が終了しているため、金額は書かず終了の経緯を記した。
- businessStructure: 非連結子会社１社については、事業の内容に社名の印字がなく、関係会社の状況は「該当事項はありません」とされているため、社名は書かなかった。
- businessStructure: Wikipediaの記事冒頭は有報の事実と重なる内容のみであったため、補足には使わなかった。
- history: 沿革は19件を選んだ。年月は年のみを記載し、月は書いていない。資本金の金額は沿革に含めていない。
- history: 2024年の広島市農業協同組合・全国農業協同組合連合会広島県本部との売買取引契約と2025年の尾道市農業協同組合との売買取引契約は、2024年の提携の行に集約せず個別には立てなかった（農業協同組合との取引拡大の流れとして2024年の提携を代表させた）。
- industry: 主たる業界は、事業全体がホームセンターを主たる事業とする一般小売業の単一セグメントであることから小売とした。
- relatedCompanies: asahipen・trusco-nakayama・makita：特定投資株式の銘柄ごとの情報に、保有目的の定型句とは別に商品の仕入の事実が個別に印字されているためsupplier（makitaは工具等の仕入の印字）とした。yamabikoは仕入先が子会社のやまびこジャパンであるため、yellow-hatは店舗用建物の賃貸と子会社の株式会社ジョイフルからの仕入という複数の取引があるため、いずれもbusiness-partnerとした。
- relatedCompanies: the-san-in-godo-bank：特定投資株式と大株主の状況に載るが、関係の中心は設備資金・運転資金の借入と当座貸越契約等の資金調達であるため、銀行ルールにより結ばない。
- relatedCompanies: sumitomo-mitsui-financial-group・yamaguchi-financial-group：上場持株会社であり、借入の相手は傘下の銀行である。持株会社と傘下銀行は別法人であり、関係の中心も資金調達のため結ばない。
- relatedCompanies: mitsubishi-ufj-financial-group：傘下の三菱ＵＦＪ信託銀行への株式事務代行業務の委託と金融取引の印字のみで、持株会社自体との取引・提携の印字がないため結ばない。
- relatedCompanies: komeri・dcm-holdings・nafco：特定投資株式の保有目的が業界及び同業他社の情報収集のみで、取引の印字がないため結ばない。
- relatedCompanies: nakayamafuku：電子記録債務の相手先別内訳に載るのみで、仕入取引を示す個別の印字がないため結ばない。
- relatedCompanies: orient：売掛金の相手先別内訳に載るのみで、クレジット決済に伴う債権のため結ばない。
- relatedCompanies: joyfull：有報の株式会社ジョイフルはイエローハットの傘下会社であり、上場している株式会社ジョイフルとは同一性が確認できないため結ばない。
- relatedCompanies: land・slogan・king・zero：語の断片一致のみで、取引・提携の印字がないため結ばない。takashima-and-coはambiguousで県名の一部との一致のみのため結ばない。sundayは大株主の有限会社サンデーズ（非上場）とは別の会社で、コードリストにもないため結ばない。
- relatedCompanies: 大株主の状況に載るアイリスオーヤマ、Ｊ－ＮＥＴ、ドラッグストアモリは候補一覧になく上場も確認できないため結ばない。島根県農業協同組合、全国農業協同組合連合会等の農業協同組合は上場企業ではなく候補一覧にないため結ばない（提携の事実は沿革と戦略に記載した）。
- relatedCompanies: 関係会社の状況は「該当事項はありません」。非連結子会社１社は社名の印字がないため結ばない。
- terms: 新たに提案する用語はない。ホームセンター、ＤＩＹ等の事業用語は本文で説明している。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
