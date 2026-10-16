# ABホテル — research log

Registered: 2026-10-01（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＡＢホテル株式会社 |
| 証券コード | 6565 |
| docID | `S100YDVA` |
| 提出日 | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDVA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＡＢホテル株式会社 / 6565 / docID S100YDVA（id は英語表記「ABHOTEL CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 6 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
abhotel: 10 件の数値を有報XBRLと照合
有報: ＡＢホテル株式会社 有価証券報告書－第12期(2025/04/01－2026/03/31) (docID S100YDVA)
前期有報との比較: 20 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 15 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: セグメント情報のテキストブロックがない（US GAAP採用会社に多い）。セグメント別の売上・利益は md-and-a.txt に記載されているので、そこから採り、ログにその旨を書くこと
すべて一致しました。
abhotel: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「ABホテル株式会社」が EDINET の提出者名「ＡＢホテル株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙・DEIから2026年3月期（第12期、2025年4月1日〜2026年3月31日）。本文の期ラベルは全て「2026年3月期」
- businessModel: 売上の内訳（宿泊と朝食など）は有報に印字されていない（単一セグメント、生産・受注実績は記載なじまず）。revenueSources は事業の内容の記述（宿泊サービス、一部店舗の有料朝食・夕食）から書いたもので、金額・比率は書いていない。「地域別の販売高は東海エリアが最大」は経営者による分析の販売実績表（東海エリア7,083,986千円が最大）から。千円の数値は本文に出さなかった
- businessModel: 「主要顧客であるビジネス客」「関西圏を中心としたインバウンド需要の増加」「客室単価は上昇」は経営者による分析の印字。観光客の比率は印字されていない
- businessModel: 「宿泊料金」を売上のおもな源泉とした根拠は、有報が客室単価・稼働率で業績を説明している点と、事業の内容が宿泊サービスの提供を事業としている点。料金体系そのものは有報にない
- businessModel: 営業利益は売上高に対する比率39.8％（有報印字）を使った。「営業利益率」の語は使っていない。売上原価54.1％・販管費6.1％も有報印字
- businessModel: ローコスト建築・清掃の内製化は事業の内容（出店戦略）の記述。profit 段階の説明として固定費抑制策を添えたが、これらが利益額に与えた効果は有報に数値で印字されていない
- businessModel: 「有報が主要顧客と呼ぶ層」「平均宿泊稼働率84.7％」は既存34店舗の数字で、全38店舗の数字ではない
- businessModel: businessModel.flow は company→offering→customer→revenue→profit の5段階、各1つ。description は90文字以内・句点1つ
- businessStructure: 有報は「ホテル事業の単一セグメント」と明記しており、報告セグメントは1つ。製品区分の売上内訳（【関連情報】）は証拠パックに無いため children は作らず、1ノードのみとした
- businessStructure: shortNameEn は省略。有報の英訳名は「ABHOTEL CO., LTD.」のみで、社名から「CO., LTD.」を除いた短い英字表記を会社自身が使っている記載はない（店名・ブランドは「ＡＢホテル」と日本語混じりで印字）。推測で作らなかった
- businessStructure: name は officialName「ABホテル株式会社」から株式会社を除いた表示名。有報の表紙は全角「ＡＢホテル」だが draft-entry.json の officialName に合わせて半角とした
- businessStructure: listings は表紙の「名古屋証券取引所メイン市場」のみ。沿革に2026年5月の東京証券取引所の上場廃止が印字されており、現在は名古屋の単独上場のため東京は載せていない
- businessStructure: 店舗数38・16府県は有報の事業の内容（2026年6月19日現在）の印字から数えた。事業の内容に列挙された都道府県は愛知・埼玉・石川・群馬・奈良・岐阜・静岡・京都・滋賀・山口・福岡・大阪・長野・千葉・三重・福井の16。京都府・大阪府は「府」であり「16府県」と書いた
- businessStructure: products/customers は事業の内容の記述（宿泊・和洋朝食サービス、ビジネス利用と観光利用）に基づく。顧客層の内訳の金額・比率は印字されていないため書いていない
- history: 有報の沿革は年月と概要が1対1で交互に印字されており、崩れていない（年月の数と事象の数が対応）。位置対応の復元は不要だった
- history: 沿革の表は約27行あるが、会社の成り立ちを理解する節目5件に絞った。落としたもの：2014年6月・2014年10月以外の個別出店（石川・群馬・奈良・岐阜・静岡・京都・滋賀・山口・福岡・大阪・長野・千葉・三重・福井の各県初出店）、1979年・1999年4月の東祥の設立・商号変更（親会社の沿革）、2015年3月・2017年12月・2018年1月の増資、2016年9月の本社移転、2022年4月の市場区分見直し（市場全体の再編で会社固有の出来事ではないため）
- history: 2014年は6月（愛知県外初出店）と10月（会社設立）の2行を1件にまとめた。年は数値1つしか持てないため
- history: 2026年の件の「38店舗」は沿革の末尾の文（2026年6月現在、2026年2月「ＡＢホテル犬山」の出店含め）から引いた。年月行ではなく締めくくりの文なので、犬山の出店は独立した事象にしていない
- history: 沿革冒頭の文「2013年度より…全国展開を開始」は年月行ではないため事象にしていない。2014年の件の significance の「全国展開」はこの文と、実際に愛知県外へ出店した行に基づく
- history: ABホテル株式会社の設立は2014年10月。2014年より前の事象は東祥のホテル事業部の沿革で、有報自身がそう注記している。そのため1999年・2005年の件の significance に、当時はまだ別の会社だったことを書いた
- industry: INDUSTRY_IDS（automotive, semiconductors, electronics, it, finance, trading, food, retail, real-estate, construction, chemicals, pharmaceuticals, transportation, energy, telecommunications, media, entertainment）に宿泊・ホテル業に当たる区分が無い。最も近い既存の慣例として、ホテルを運営するオリエンタルランドが entertainment を主にしているのに揃えて entertainment を primary とした。ただし ABホテルの事業は観光・娯楽施設ではなく宿泊特化型のビジネスホテルで、ぴったりの分類ではない
- industry: real-estate（ホテル施設を保有する面はあるが、有報の事業内容は不動産の売買・賃貸ではなく宿泊サービスの提供）、retail、transportation は採らなかった。ホテル専業の掲載済み企業（washington-hotel, imperial-hotel, hotel-newgrand, the-royal-hotel, the-kyoto-hotel）は figures-only で industries が空のため、揃えるべき既存の慣例はオリエンタルランドの1例だけだった
- industry: 副業界は付けていない。単一セグメント（ホテル事業）で、他の業界に属する事業は有報に印字されていない。半導体など他の業界との関わりもない
- relatedCompanies: src/data/companies/index.ts を書く直前に読み直し、東祥（tosho、株式会社東祥、証券コード8920）が登録済みであることを確認した。社名の照合は NFKC 正規化のうえで行った
- relatedCompanies: 東祥との関係は有報の関係会社の状況（【関係会社の状況】）に「（親会社）株式会社東祥、被所有52.8％、関係内容：本社事務所及び一部店舗の土地賃借取引・宿泊取引他」と印字され、事業等のリスクにも「東祥は当社の議決権の52.8％を所有しており、大株主として当社の取締役の指名権等経営に関する権利を有しております」「役員の兼任は存在しておらず」「親会社への事前承認事項はなく、独自に経営の意思決定を行っております」とある。RELATIONSHIP_KINDS（same-industry, competitor, supplier, customer, technology, same-business-model, business-partner）に「親会社・資本関係」に当たる値が無いため、取引の目的だけが印字され向きが不明な取引（土地賃借・宿泊）を根拠に business-partner を使った。土地賃借は東祥が貸し手とも読めるが有報は向きを明記していないため supplier にはしていない。宿泊取引も向きが印字されていない
- relatedCompanies: 未登録で結べなかった相手：ＡＢ開発株式会社（愛知県安城市）。大株主の状況で議決権5,040千株（35.55％）を所有する第2位株主として印字されているが、持株比率以外の関係（取引・役員兼任）は有報に印字されていない。登録済みか確認し、無ければ未登録として残す
- relatedCompanies: 楽天トラベル・じゃらん等の他社サイトでの集客（事業の内容「ＩＴ活用について」）は、販売経路として名指しされているだけで、取引の向き・条件・目的が印字されていないため結んでいない。楽天グループ（rakuten-group）は登録済みだが、有報が楽天グループ自体との取引関係を述べているわけではない（「楽天トラベル」という予約サイトに掲載しているという記述）
- relatedCompanies: 政策保有株式は非上場株式1銘柄・貸借対照表計上額500千円のみで、上場株式の保有は無い。銘柄名は印字されておらず、結べる相手は無い。取引先金融機関も、資金調達の目的で結ぶ対象ではないため結んでいない（借入は複数の金融機関から行っているが、名指しの記載は証拠パックに無い）
- relatedCompanies: 競合・同業（ワシントンホテル、帝国ホテルなど登録済みのホテル運営会社）は、有報が競合として名指ししていないうえ、それらの企業は figures-only で事業内容の記述が無いため、same-industry / same-business-model を根拠付きで書けず結んでいない。登録後に人の手で同業リンクを足す価値はある
- terms: 助言のみの工程のため data は空。businessModel.description で既存の用語 segment（セグメント）にだけリンクした
- terms: 用語として説明の候補になるもの（提案のみ、リンクはしていない）：稼働率（有報が既存店の平均宿泊稼働率84.7％を業績指標として使う）、客室単価、インバウンド、OTA（有報は「海外系ＯＴＡ」「他社サイト」と書く）、レベニューマネジメント、業務委託方式（支配人らに運営を委託する方式）、新設会社分割（東祥のホテル事業部から2014年に設立）、親会社、純投資目的以外の投資株式

## 要確認（status に反映）

- industry: INDUSTRY_IDS にホテル・宿泊業に当たる区分が無く、entertainment は最も近いものを選んだ暫定の分類。ホテル業の区分を INDUSTRY_IDS に足すかどうかを人が決める必要がある（ホテル専業の figures-only 企業が複数あり、同じ問題が繰り返される）
- relatedCompanies: 親会社・支配株主（東祥、議決権の52.8％所有）との関係を表せる RELATIONSHIP_KINDS の値が無く、business-partner に押し込んでいる。RELATIONSHIP_KINDS に資本関係（parent / subsidiary / affiliate など）を足すか、現状の business-partner のままにするか、人が決める必要がある。なお東祥のページから見れば ABホテルは被所有52.8％の子会社にあたるので、相互リンクの追加も登録後に必要
