# 静岡ガス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 静岡ガス株式会社 |
| 証券コード | 9543 |
| docID（データを取り出した文書） | `S100XTDX` |
| 原本 docID | `S100XTDX` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTDX.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E9%9D%99%E5%B2%A1%E3%82%AC%E3%82%B9

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 静岡ガス株式会社 / 9543 / docID S100XTDX（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shizuoka-gas: 10 件の数値を有報XBRLと照合
有報: 静岡ガス株式会社 有価証券報告書－第178期(2025/01/01－2025/12/31) (docID S100XTDX)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"NumberOfEmployees|2024-12-31","previousFiling":1464,"latestFiling":1466}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shizuoka-gas: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの注意（本文に財務諸表の組替え・遡及適用の記載がある）について、経営指標等の注記を確認した。5年間の数値に影響する事実は収益認識基準の第175期期首からの適用のみで、修正再表示チェックでも前期有報との照合は全行一致（従業員数の2024年12月期が1,464人から1,466人への2人の差のみ）だったため、financialNotes は収益認識基準の1件のみとした。その他の包括利益の組替調整額の注記は5年系列に影響しない。
- businessModel: 重要な後発事象は、連結・個別とも「該当事項はありません」と印字されている。提出後の予定事項はない。
- businessModel: MD&Aに印字されたグッドリビング株式会社の連結子会社化と不二高圧株式会社の連結子会社化は、いずれも当期中の出来事のため、needsReview には入れなかった。
- businessModel: グループ2030年ビジョンの数値目標は有報の経営方針に印字されていないため、strategy には引用していない。
- businessStructure: 事業の並び順は、セグメント情報の2025年12月期の外部顧客への売上高の大きい順（ガス155,167百万円→LPG・その他エネルギー29,845百万円）にし、有報が「報告セグメントに含まれない事業セグメント」と印字する「その他」（16,195百万円）は最後に置いた。
- businessStructure: 子分類には金額を付けなかった。収益認識関係の分解情報は「顧客との契約から生じる収益」ベースで、ガス153,031百万円、LPG・その他エネルギーはLPG12,468百万円・電力16,133百万円・その他601百万円、その他セグメントはくらしサービス11,615百万円・エンジニアリング3,452百万円と印字されるが、外部顧客への売上高とは補助金やリース収益を含む「その他の収益」の分だけ基準が異なるため、子分類の金額としては採用しなかった。
- businessStructure: セグメント利益は書いていない。
- history: 設立時の資本金（50万円）は文章の規則で書けないため、沿革・説明のいずれにも記載しなかった。
- history: 2015年の商号変更について、変更前の商号「静岡瓦斯株式会社」は有報の沿革には変更の事実のみが印字されるため、Wikipediaの記事（旧商号の記載）で補足した。数値はWikipediaから採っていない。
- history: 次の行は、工場・基地の竣工や閉鎖、子会社の設立など拠点・子会社レベルの事項のため落とした：1944年静岡製造所竣工、1959年大富士瓦斯株式会社設立、1961年静岡液化瓦斯株式会社（現 静岡ガスエネルギー）設立、1973年大富士ガス工業株式会社設立、1986年吉原工場の運営開始、1987年エスジー・リビング株式会社（現 静岡ガスリビング）設立、1992年大富士ガス工業株式会社の吸収合併、2001年袖師基地第2号LNG貯槽完成、2003年静岡工場閉鎖、2004年吉原工場閉鎖・第二駿河幹線完成、2010年袖師基地第3号LNG貯槽完成。
- industry: 東証の業種分類は電気・ガス業で、都市ガスの供給・販売が連結売上高の最大部分を占め、LPGや電力の販売もエネルギー供給であるため、閉じた分類の energy が直接合う。暫定値ではないため taxonomyGaps には書かなかった（日本瓦斯の先例と同じ扱い）。
- industry: 「その他」に含まれる住宅の設計・施工・販売やリフォームは、報告セグメントとして独立開示されておらず、リース等と混在する区分の一部であるため、real-estate・construction の副次分類は付けなかった。
- relatedCompanies: inpex: MD&Aに主要な販売先として卸供給が印字され、取引の向きが明確なため customer とした。特定投資株式にも載るが、保有目的は全銘柄共通の定型句のため、根拠はMD&Aの記載に置いた。
- relatedCompanies: tokyo-gas / chubu-electric-power / tokai-holdings / premium-water-holdings: 【大株主の状況】に載る事業会社のため major-shareholder とした。前三者については、静岡ガスが相手の株式を保有していることも特定投資株式と保有の有無欄に印字されている。
- relatedCompanies: shizuoka-financial-group: 特定投資株式の保有目的が「資金調達上等の関係維持・強化」で、資金調達を理由とする金融機関のため結ばなかった。大株主の株式会社静岡銀行（2,682千株、3.55％）は同社の子会社だが、印字された株主名は静岡銀行であり候補の持株会社とは一致せず、銀行でもあるため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group / mizuho-financial-group: 特定投資株式の保有目的が「資金調達上等の関係維持・強化」のみで、資金調達を理由とする金融機関のため結ばなかった。
- relatedCompanies: the-shimizu-bank: 大株主に載るが銀行であり、特定投資株式の保有目的も「資金調達上等の関係維持・強化」のため結ばなかった。
- relatedCompanies: tokio-marine-holdings: 特定投資株式の保有目的が全銘柄共通の定型句のみで、保険取引が理由の保険会社のため結ばなかった。
- relatedCompanies: mitsubishi-corporation / eneos-holdings / kyowanissei / new-cosmos-electric / aichi-tokei-denki / azbil: 特定投資株式に載るが、保有目的は全銘柄共通の定型句「ガス事業等の発展のための関係維持・強化」のみで、その相手についての具体的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: tokushu-tokai-paper / terumo / nippon-light-metal-holdings / daio-paper / koito-manufacturing / nihon-shokuhin-kako: 特定投資株式に載るが、保有目的は全銘柄共通の定型句「営業上の取引先として関係維持・強化」のみで、その相手についての具体的な取引の記載がないため結ばなかった。
- relatedCompanies: hitachi / mitsubishi-kakoki-kaisha / mitsubishi-materials / ms-and-ad-insurance-group-holdings / shimizu / sumitomo-mitsui-trust-group: 特定投資株式の脚注に、2025年12月31日時点で保有していないと印字されているため結ばなかった。
- relatedCompanies: en / como / base-4481 / port / vision / land / career / corona / imura-and-co / seki / slogan / zero: 社名の断片が一般語や別文脈に一致しただけで、その会社についての記載がないため結ばなかった。nissin はコードリストになく、一致箇所も同社を指していないため結ばなかった。
- relatedCompanies: 候補外の注記: 大株主の筆頭は鈴与商事株式会社（13,652千株、18.11％）、第2位は鈴与建設株式会社（10,609千株、14.07％）だが、いずれも候補にないため結べなかった。日本マスタートラスト信託銀行株式会社（信託口）は信託口名義のため対象外。MD&Aの主要な販売先であるサーラエナジー株式会社（2025年12月期の販売量201百万㎥、12.7％）も候補にないため結べず、ここに記録した。
- terms: 助言: 「オンサイト・エネルギーサービス」は、お客さまの事業所内にエネルギー設備を設置・運転して電気・熱を販売する事業を指す用語で、有報の【事業の内容】に定義が印字され、LPG・その他エネルギーセグメントの構成要素でもあるため、登録候補になります。
- terms: 助言: 「原料費調整制度」は、原料価格の変動をガス料金・販売単価に反映させる仕組みを指す用語で、売上高の増減理由として繰り返し現れるため、登録候補になります。
- terms: 助言: 「地域共創」は、グループ2030年ビジョンに掲げる、地域の課題解決を通じて持続可能なくらしやすい地域をつくる考え方を指す用語で、同社の経営方針の中心にあるため、登録候補になります。
- terms: 助言: 「特定投資株式」は政策保有株式の開示区分を指す用語で、関連企業の判断材料になるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
