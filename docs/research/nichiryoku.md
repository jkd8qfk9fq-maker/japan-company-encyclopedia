# ニチリョク — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ニチリョク |
| 証券コード | 7578 |
| docID（データを取り出した文書） | `S100YN6A` |
| 原本 docID | `S100YN6A` |
| 提出日（原本） | 2026-06-29 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YM11, S100YM0K, S100YLZO, S100YLZ1（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YN6A.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%8B%E3%83%81%E3%83%AA%E3%83%A7%E3%82%AF

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ニチリョク / 7578 / docID S100YN6A（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 5 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 6 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nichiryoku: 10 件の数値を有報XBRLと照合
有報: 株式会社ニチリョク 有価証券報告書－第60期(2025/04/01－2026/03/31) (docID S100YN6A)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":2979035000,"latestFiling":2975493000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":3223085000,"latestFiling":3219031000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":2852583000,"latestFiling":2848018000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":2242603000,"latestFiling":2239421000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":129228000,"latestFiling":-97626000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":118059000,"latestFiling":63164000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":279610000,"latestFiling":210451000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":-271014000,"latestFiling":-418516000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":184127000,"latestFiling":-42727000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":137921000,"latestFiling":83026000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":220516000,"latestFiling":151356000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":-147158000,"latestFiling":-294660000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":9467104000,"latestFiling":8050703000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":8910699000,"latestFiling":7439403000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":8067639000,"latestFiling":6527183000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":7475774000,"latestFiling":5787816000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":4313683000,"latestFiling":2897282000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":4539671000,"latestFiling":3068376000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":4856074000,"latestFiling":3315618000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":4585650000,"latestFiling":2897693000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第59期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第58期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第57期(2022/04/01－2023/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第56期(2021/04/01－2022/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
nichiryoku: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 過年度の訂正について：第56期から第59期までの有価証券報告書の訂正報告書（2026年６月26日提出、S100YLZ1、S100YLZO、S100YM0K、S100YM11）が提出され、当期の有価証券報告書の主要な経営指標等の推移には訂正後の数値が記載されています。第59期（2025年３月期）の当期純損失は訂正前271百万円から訂正後418百万円になるなど影響は大きく、業績等の推移の分析には訂正の背景として、過去に宗教法人へ差し入れた保証金の評価見積りの前提が見直された経緯が印字されています（金額は本文に書いていません）。訂正対象の４年分すべてに financialNotes を付けました。
- businessModel: 後発の資本施策（警告のみ）：2026年４月16日の取締役会で決議された第三者割当による新株式の発行、第１回・第２回無担保転換社債型新株予約権付社債及び第４回新株予約権の発行は2026年５月７日に払込が完了しました。本社は割当先の名称を印字していますが、資本政策の決議・履行であるため needsReview にはせず、ここに記録します。
- businessModel: 2025年９月に『ラステル新横浜』に関する事業を株式会社金宝堂に譲渡しました（沿革に印字）。当期中の出来事であり期末の構造に反映されているため、history に記録し needsReview にはしていません。
- businessModel: 親会社について：【関係会社の状況】に親会社として投資事業有限責任組合とその無限責任組合員である株式会社が印字されていますが、いずれも関係会社候補（related-candidates.json）に含まれていないため、relatedCompanies では結びませんでした。
- businessModel: 売上高の内訳はセグメント注記の外部顧客への売上高（千円）を百万円に切り捨てて記載しました。３区分の合計は1,724百万円となり、印字の売上高1,725百万円と１百万円異なりますが、印字の数値をそのまま記載しています。
- businessModel: 主要な顧客として、納骨堂のセグメントに関連する宗教法人１法人の売上高が印字されていますが、顧客の個別名は本文に書いていません。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（葬祭事業1,025,421千円、お墓事業（屋外墓地）555,769千円、お墓事業（納骨堂）144,316千円）とした。３セグメントの千円額の単純合計は1,725,506千円で、印字の売上高1,725,508千円と２千円異なるが、印字の数値をそのまま記載した。
- businessStructure: 墓石（石材）は、ほぼ100％米ドル建てで主に中国より輸入している旨が事業等のリスクに印字されている。仕入先の個別名は印字されておらず、suppliers はこのツリーの旧スキーマのため省略し、事実をここに記録する。
- businessStructure: 主要な設備は、葬祭事業の販売設備としてセレハウス谷原、ラステル久保山、ラステル鶴見、高島平会館、お墓事業の生産設備として日の出工場が印字されている。本社（東京都中央区）は『その他』の統括業務施設として複数事業に連記されているため、どの事業にも結びつけなかった。
- businessStructure: 関係会社として、非連結子会社が１社ある旨が経営指標等の注記に印字されている（第60期）。子会社の個別名・事業は【関係会社の状況】に印字されておらず、事業構造には含めていない。なお、重要な後発事象で言及されるニチリョク納骨堂株式会社とニチリョクライフケア株式会社は期末後の文脈で現れる完全子会社であり、期末の構造としては注記のみにとどめた（後発事象は businessModel の needsReview に記録）。
- history: 沿革のうち2012年以降の行は、抽出テキストで年月列と出来事列が分離していたため、年月23件と出来事23件を出現順に1対1で対応付けた（2013年７月の証券取引所統合に伴うＪＡＳＤＡＱ（スタンダード）上場、2022年４月のスタンダード市場への移行という既知の時期とも一致する）。この対応付けで、バリューアップ・ファンド投資事業有限責任組合との資本提携契約の締結は2020年９月、払込の完了と親会社化は2020年10月、サン・ライフホールディングとの資本提携の解消は2019年11月となる。
- history: 沿革に印字された霊園・納骨堂の募集開始や支店の設置・移転などの細目はすべては載せず、創業、事業の転機、上場、ブランドの開業、親会社の交代、事業譲渡など主要なものに絞った。
- history: 堂内陵墓を日本で初めて開発した旨はWikipediaの記述による補足であり、【事業の内容】には1999年４月から自動搬送式の納骨堂を開始した旨が印字されている。
- history: 2017年に完全子会社として設立した株式会社ニチリョクライフケアについて、沿革では『当社100％出資のニチリョクライフケアを設立』と印字されている。2026年５月の後発事象（事業譲渡の譲受先としての完全子会社）と同一の会社とみられるが、有報本文で同一性が明記されていないため、沿革には載せなかった（後発事象は businessModel の needsReview に記録）。
- industry: 葬祭事業（2026年３月期の外部顧客への売上高1,025百万円）と、お墓事業（屋外墓地555百万円、納骨堂144百万円）はいずれも葬祭・供養の領域であり、閉じた一覧の funeral-memorial（葬祭・供養）に直接当てはまるため、単一の primary とした。暫定分類や付けていない区分はない。
- relatedCompanies: 親会社は【関係会社の状況】にバリューアップ・ファンド投資事業有限責任組合（議決権所有割合は貸株分を含め40.4％）と、その無限責任組合員である株式会社アリスタゴラ・アドバイザーズが印字されているが、いずれも候補一覧（related-candidates.json）に含まれていないため結ばなかった。
- relatedCompanies: 候補のサン・ライフホールディング（7040）は、沿革に2006年４月の株式会社サン・ライフとの業務提携・資本提携の基本合意と、2019年11月の株式会社サン・ライフホールディングとの資本提携の解消が印字されている。解消済みの過去の提携であり、個別化された現在の取引関係の印字もないため結ばなかった。
- relatedCompanies: その他の候補（port、takashima-and-co、en、lec、base-4481、freee、garden、nissin、seed、taya、career、land、seki）は、いずれも施設名・地名・一般語の部分一致によるもので実在の関係を示す印字がなく、結ばなかった。nissin はコードリストにない旨が候補ファイルに記録されている。
- relatedCompanies: 本有報には特定投資株式の一覧の印字がなく、株式保有による関係先も確認できなかった。
- terms: 助言: 用語『堂内陵墓』は、自動搬送式の納骨堂のことで、参拝カードを機械にかざすと骨壷の入った厨子が礼拝所まで運ばれてくる仕組みを指し、【事業の内容】に印字されています。当社が1999年４月から始めた形式です。
- terms: 助言: 用語『永代使用権』は、墓地や納骨堂を将来にわたって使用する権利のことで、【事業の内容】に販売・販売代行の対象として印字されています。
- terms: 助言: 用語『差入保証金』は、霊園や納骨堂の販売にあたり経営主体の宗教法人等へ差し入れる保証金のことで、業績等の推移の分析や事業等のリスクに回収に関する記述が印字されています。
- terms: 助言: 用語『改葬』は、既存のお墓を別の場所へ移すことで、【事業の内容】に全国のパートナー企業と提携して対応する旨が印字されています。
- terms: 助言: 用語『ラステル』は、当社の葬儀会館のブランド名で、【事業の内容】に横浜市内の会館が印字されています。
- terms: 助言: 用語『終活』は、人生の終わりに向けた準備活動のことで、会員組織『さくら・あおい倶楽部』や『ニチリョク安心パック』とともに【事業の内容】に印字されています。

## 要確認（status に反映）

- businessModel: 事業等のリスクに、継続企業の前提に関する重要事象等として、過去の業績動向や財務状況の影響により手元流動性に関する懸念が認識されている旨が記載されています。資本増強の実施や有利子負債の返済、収益構造の見直しなどの施策が進められており、財政状態の注記では、継続企業の前提に関する重要な不確実性は認められないと判断した旨が記載されています。本登録は2026年３月期の構造で登録しています。
- businessModel: 重要な後発事象として、当社の子会社であるニチリョク納骨堂株式会社が、2026年５月25日にRSJ合同会社より茗荷谷陵苑『林泉寺 縁の園』に係る事業（永代使用権の独占販売代理権及び管理運用業務等）を譲り受けた旨が記載されています。本登録は2026年３月期の構造で登録しています。
- businessModel: 重要な後発事象として、2026年５月26日開催の取締役会において、当社の事業（グループ経営管理事業等を除くすべての事業）を完全子会社であるニチリョクライフケア株式会社に譲渡し純粋持株会社体制へ移行すること、及び商号を株式会社レガシアホールディングスに変更することが決議された旨が記載されています。事業譲渡日は2026年８月１日の予定であり、本登録は2026年３月期の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
