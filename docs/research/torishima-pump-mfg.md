# 酉島製作所 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社酉島製作所 |
| 証券コード | 6363 |
| docID（データを取り出した文書） | `S100YDRV` |
| 原本 docID | `S100YDRV` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDRV.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E9%85%89%E5%B3%B6%E8%A3%BD%E4%BD%80%E6%89%80

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社酉島製作所 / 6363 / docID S100YDRV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 17 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
torishima-pump-mfg: 10 件の数値を有報XBRLと照合
有報: 株式会社酉島製作所 有価証券報告書－第145期(2025/04/01－2026/03/31) (docID S100YDRV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
torishima-pump-mfg: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は空とした。変則決算・決算期変更はなく、前期有報との修正再表示チェックは全行一致（差異なし）で、会計基準の変更等の事実も証拠パックにないためである。
- businessModel: 中期経営計画「Beyond 110」の目標数値（売上高1,000億円、営業利益100億円、ROE10％。2024年度に上方修正）は、利益の金額と投資の語を含むため perspectives の要約には書かず、ここに記録する。
- businessModel: 2026年４月のジャパン・レジリエンス・アワード（強靭化大賞）における企業・産業部門の最優秀賞の受賞は決算期後の出来事であるが、有報の経営方針に印字された事実であるため、competitiveAdvantage には含めず、ここに記録するにとどめた。
- businessModel: 売上高の前期比7.4％増と当期純利益の前期比46.1％増は、印字された当期・前期の金額から算出した増減率である（経営成績の分析には売上高が前期の107.4％と印字されている）。
- businessStructure: セグメント情報は、ポンプ事業が全セグメントの売上高・営業利益の合計に占める割合がいずれも90％を超えるため、有報で記載が省略されている。事業区分は【事業の内容】の事業部門別の記載（ポンプ事業・環境新エネルギー事業）に基づき、事業ごとの売上高は独立開示がないため金額を書かなかった。なお、経営成績の分析の販売実績では、2026年３月期のポンプ事業92,534百万円・その他392百万円と印字され、合計は連結売上高と一致する（industryPosition に記録）。
- businessStructure: グループ構成は、当社と子会社31社（うち連結子会社30社）及び関連会社２社（協和機工株式会社、AESSEAL TORISHIMA JAPAN CO.,LTD.）である。連結従業員数は2,127人（2026年３月31日現在）。
- businessStructure: 新日本造機株式会社の株式取得は、効力発生日が2026年７月１日の予定で2026年３月31日現在の構成に含まれないため、needsReview に記録した。登録は2026年３月31日現在の構成・数値に基づく。
- businessStructure: 自己株式の取得は定例の資本政策として扱い、本文と needsReview には書かなかった。自社の株式分割の印字はない（株式の保有状況にある株式分割は、保有先である株式会社栗本鐵工所が実施したものである）。
- businessStructure: 重要な後発事象は、連結・個別とも「該当事項はありません」と印字されている。新日本造機の株式譲受契約は【重要な契約等】と注記事項の追加情報に印字された事項である。
- history: 沿革は全52行を転記した。年月セルが連続して印字され事象文と分かれている崩れた表が４か所あり、いずれも年月の数と事象の数が一致したため、行順で対応づけた（2011年１月・５月の２件、2015年６月〜2021年３月の８件、2021年12月・2022年２月の２件、2022年４月〜2024年９月の11件）。
- history: 2010年９月のイオスエンジニアリング アンド サービス株式会社の株式取得の行には、印字どおり2025年２月に売却した旨を併記した。
- history: 1919年の創設行の意義にある社名の由来は、有報に印字のない補足として Wikipedia によった（数値は使用していない）。設立に係る資本金の印字は沿革表にない。
- industry: 主たる業界は machinery とした。ポンプ事業が売上高の90％超を占め、ポンプ・ポンププラント等の機械の製造販売が事業の中心であるためである。
- industry: 副次分類は付けなかった。環境新エネルギー事業は事業ごとの金額が独立して開示されておらず、金額が独立開示されていない事業に業界を足さない原則による。閉じた分類で言い表せるため taxonomyGaps には上げなかった。
- relatedCompanies: フジテック株式会社（fujitec）: 政策保有株式の縮減方針に基づき公開買付けに応募し、当期中に保有する全株式の売却を完了して期末の保有がゼロであるため結ばなかった。候補の listing もコードリストにない。
- relatedCompanies: 中外炉工業株式会社（chugai-ro）: 保有関係の見直しにより当期中に全株式の売却を完了し、期末の保有がゼロであるため結ばなかった。
- relatedCompanies: 株式会社ダイヘン（daihen）: 保有目的には早期の売却完了を目指す方針のみが印字され、取引・提携の印字がないため結ばなかった。
- relatedCompanies: 三精テクノロジーズ株式会社（sansei-technologies）: 特定投資株式の保有目的が「ポンプ等資機材の受注、資機材の受給等の取引関係の維持の他、地元企業間の地域情報収集のため」という複数銘柄に共通する定型句のみで、個別の提携・協業の印字がないため結ばなかった。
- relatedCompanies: 株式会社日阪製作所（hisaka-works）: 保有目的が三精テクノロジーズと同一の定型句のみのため結ばなかった。
- relatedCompanies: 京阪神ビルディング株式会社（keihanshin-building）: 保有目的が同一の定型句のみのため結ばなかった。
- relatedCompanies: 三京化成株式会社（sankyo-kasei）: 保有目的が同一の定型句のみのため結ばなかった。
- relatedCompanies: 株式会社三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group）: 保有目的は主要取引金融機関である傘下の株式会社三井住友銀行からの資金調達であり、資金調達を理由とする金融機関は結ばないため結ばなかった。大株主の株式会社三井住友銀行は銀行本体であり、上場持株会社とは別法人である。
- relatedCompanies: 株式会社りそなホールディングス（resona-holdings）: 保有目的は傘下の株式会社りそな銀行からの資金調達と人的交流であり、金融機関のため結ばなかった。大株主の株式会社りそな銀行は銀行本体であり、上場持株会社とは別法人である。
- relatedCompanies: 株式会社池田泉州ホールディングス（senshu-ikeda-holdings）・株式会社千葉銀行（the-chiba-bank）・株式会社佐賀銀行（the-bank-of-saga）: いずれも保有目的が資金調達であり、金融機関のため結ばなかった。
- relatedCompanies: 株式会社ミロク（miroku）: 2025年３月期に保有目的を純投資目的へ変更しており、取引関係の根拠がないため結ばなかった。
- relatedCompanies: 川崎重工業株式会社（kawasaki-heavy-industries）: 有報に同社との取引・提携・資本関係の印字が確認できないため結ばなかった。
- relatedCompanies: 株式会社新東（shinto）: 連結子会社の新東邦株式会社とは別法人であり、有報に同社との関係の印字がないため結ばなかった。
- relatedCompanies: 住友重機械工業株式会社: 新日本造機株式会社の株式譲受の売主であるが、候補リストになく、１回限りの株式取得取引で継続的な取引・提携の印字もないため結ばなかった。取得の予定は businessStructure の needsReview に記録した。
- relatedCompanies: 大株主のうち、公益財団法人原田記念財団（10.6％）は公益財団法人であり企業でないため、信託口名義の株主、従業員持株会、個人株主は結ばなかった。第一生命保険株式会社（2.4％）は保険会社で、取引の印字がないため結ばなかった。
- relatedCompanies: その他の候補（en、step、career、port、vision、seki、base-4481、cota、nissin、no-1、zero、core、cover、ishin、path、ray、the-lead、trust）: 社名の部分一致・一般語への一致で、有報に関係の印字がないため結ばなかった。nissin と trust は候補の listing がコードリストにもない。
- relatedCompanies: 関連会社２社（協和機工株式会社、AESSEAL TORISHIMA JAPAN CO.,LTD.）は当社グループの関連会社であり、候補リストにもないため関連企業としては結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessStructure: 新日本造機株式会社の全株式の取得について、2026年２月10日付で、2026年７月１日（予定）を効力発生日として、新日本造機株式会社の全株式を住友重機械工業株式会社から譲受する株式譲受契約を締結しています。株式取得の完了は2026年７月１日の予定であり、2026年３月31日現在のグループ構成には含まれていません。登録は2026年３月31日現在の構成・数値に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
