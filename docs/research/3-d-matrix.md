# スリー・ディー・マトリックス — research log

Registered: 2026-10-01（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社スリー・ディー・マトリックス |
| 証券コード | 7777 |
| docID | `S100YR3G` |
| 提出日 | 2026-07-22 |
| 決算期 | 2026-04-30 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YR3G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社スリー・ディー・マトリックス / 7777 / docID S100YR3G（id は英語表記「3-D Matrix,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
3-d-matrix: 10 件の数値を有報XBRLと照合
有報: 株式会社スリー・ディー・マトリックス 有価証券報告書－第22期(2025/05/01－2026/04/30) (docID S100YR3G)
前期有報との比較: 20 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 15 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
3-d-matrix: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: businessModel.products は、連結事業収益の90％超を占め実際に上市・販売されている吸収性局所止血材（TDM-621）のみを記載しました。businessStructure段階（群1）の警告のとおり、粘膜隆起材・癒着防止材・創傷治癒材・歯槽骨再建材・DDS関連技術は有報自身が『開発パイプライン』と呼んでおり、国・地域によって承認状況が異なるため、未承認の開発品を商業製品と並べて products に列挙すると商業化の段階を実態以上に見せる恐れがあると判断し、flow[offering].description の文章でのみ言及しました。
- businessModel: flow[profit] で経常利益・当期純利益が営業利益より大きい理由として為替差益（2,661百万円）を明記しました。これは事業の収益力そのものではなく、海外子会社向け貸付金の為替換算によるものであるため、営業利益の黒字化（本業の指標）と区別して書いています。
- businessModel: businessModel.customers と flow[customer] は、有報【重要な契約等】『当社は、FUJIFILMに対し、欧州地域において消化器内視鏡領域の止血材製品にかかる独占的販売権を許諾する。』、および【主要な顧客ごとの情報】のFUJIFILM Europe B.V.（事業収益1,455,794千円、13.4％）の記載を根拠にしています。千円額の1,455,794は【主要な顧客ごとの情報】の表の列（単位：千円）に印字されているだけで、同じ数字の直後に『千円』の文字が続く書き方ではないため、本文では落として印字されている割合13.4％のみを使いました。
- businessModel: この工程が書いたのは businessModel と description の2フィールドのみです。businesses・history・industries・relatedCompanies は担当外のため書いていません。
- businessStructure: 単一セグメントの会社で、有報の【事業の内容】は「医療製品事業の単一セグメント」と明記しています。【関連情報】の「製品及びサービスごとの情報」は単一の製品の事業収益が連結事業収益の90％を超えるため記載を省略しており、商品区分ごとの金額の裏付けがないため children は作っていません（親の businesses をその単一セグメント1ノードとしました）。
- businessStructure: businesses[].products は書いていません。事業の内容に列挙された吸収性局所止血材・粘膜隆起材・創傷治癒材等は、有報自身が「開発パイプライン」と呼んでおり、国・地域ごとに承認状況が異なります（例: 吸収性局所止血材は日本・米国・欧州・オーストラリアで承認取得済み、新規ペプチドを用いた止血材等は開発中）。一律に products として並べると承認段階を実態以上に見せる恐れがあると判断し、各パイプラインの位置づけは description の文章で説明するにとどめました。
- businessStructure: name「スリー・ディー・マトリックス」は商号（表紙）「株式会社スリー・ディー・マトリックス」から法人格の表記を除いたもの、shortNameEn「3-D Matrix」は英訳名（表紙）「3-D Matrix,Ltd.」から法人格の表記を除いたもので、いずれも表紙の印字を機械的に短縮しただけの判断です。
- businessStructure: listings の market「グロース」は、表紙の「上場金融商品取引所名又は登録認可金融商品取引業協会名」が「東京証券取引所グロース市場」と市場区分まで印字しているため記載しました。
- businessStructure: description中の「連結子会社7社」は【事業の内容】の記載をそのまま使用しました。【関係会社の状況】の表には6社（3-D Matrix,Inc.、3-D Matrix Europe SAS.、3-D Matrix Asia Pte.Ltd.、3-D Matrix Medical Technology Pty Ltd、3-D Matrix EMEA B.V.、3-D Matrix UK Limited）が記載されていますが、同表の注3に、2025年3月26日の取締役会で解散を決議し2026年4月30日時点で清算手続中の3-D Matrix Medical Technology Limitedが別途あり、これを含めると7社になることを確認しました。
- history: 沿革は有報の記載どおり、各事象の直前に年月が印字される通常の形式で、年月のセルが複数まとまって事象文と対応がずれる崩れ方はしていません（確認済み）。
- history: 有報の沿革表には20件超の事象（各種承認・許可の取得が中心）がありますが、「5-8件の転機、年表ではない」というルールに従い8件に絞りました。選ばなかった規制対応上の節目（オーストラリア・中国・各種追加適応の承認取得等）は、企業の現在の姿を説明するうえでの重複度が高いと判断して割愛しています。
- history: 2025年12月の「欧州における新規ペプチドの製造販売承認」について、【事業の内容】には『新規ペプチドを用いた止血材（RADA16とは異なる当社独自開発品で、既存の止血材より原価を大幅に削減できる等の優位性があるとして開発中）』という記載がありますが、沿革はこの承認がどの製品かを明記しておらず、両者が同一の製品であるとは有報から確認できませんでした。そのため、両者を結びつける記述はしていません。
- history: 2022年4月の『東京証券取引所の市場区分の見直しにより、東京証券取引所JASDAQ（グロース）からグロース市場に移行』は、同時期に行われた東証全体の市場区分再編に伴うものと見られ、当社固有の転機というより制度変更への対応であるため、5-8件の転機には含めませんでした。
- history: 2008年3月の商号変更（㈱スリー・ディー・マトリックス・ジャパン→株式会社スリー・ディー・マトリックス）は独立した事象にせず、2004年の設立事象の description / significance に含めました。
- industry: INDUSTRY_IDS の閉じた集合に『医療機器』専用の区分は無いため、既存の分類慣例に揃える形で pharmaceuticals を選びました。当社の主力製品（吸収性局所止血材）は法律上は医薬品ではなく医療機器（製造販売承認）ですが、有報は【事業の内容】で医療機器及び医薬品の研究開発・製造・販売を『医療製品事業』として一体で説明しており、DDS領域では製薬会社への技術供与によるライセンス収入を目指すなど、事業の性格は医薬品メーカーに近い研究開発型のライフサイエンス企業です。掲載済みのエーザイ（医薬品メーカー）が pharmaceuticals に分類されていることとの整合性も踏まえ、他のどの既存区分（electronics・chemicals等）よりも pharmaceuticals が実態に近いと判断しました。
- industry: semiconductors のような『2つ目の業界を付す』慣例（本業の製造装置・部材を開示している場合）に相当する記載は無く、医療製品事業の単一セグメントのみのため、2つ目の industryId は付していません。
- relatedCompanies: relatedCompanies を書く直前に src/data/companies/index.ts を読み直し、fujifilm-holdings・fuso-pharmaceutical-industries が引き続き登録済みであることを確認しました（3-d-matrix 自体も機械工程によりfigures-onlyとして既に登録されています）。
- relatedCompanies: fujifilm-holdingsの説明文では、【主要な顧客ごとの情報】の事業収益1,455,794千円（千円単位の表の列にのみ印字され、数字の直後に『千円』の文字が続く書き方ではない）を本文から落とし、同じ表に印字されている割合13.4％のみを使いました（check-prose-figures.mjsで事業収益額を含めた場合に照合できなかったため）。
- relatedCompanies: MIT（技術導入元、【重要な契約等】(1)技術導入契約）は米国の大学で日本の上場企業ではないため結んでいません。
- relatedCompanies: Pharmpur GMBH（ドイツの製造委託先、【重要な契約等】(2)止血材製品に関する契約）も外国企業のため結んでいません。扶桑薬品工業と同じ『製造を委託する』関係ですが、相手が日本の上場企業である扶桑薬品工業のみを結んでいます。
- relatedCompanies: 3-D Matrix,Inc.・3-D Matrix Europe SAS.・3-D Matrix Asia Pte.Ltd.・3-D Matrix Medical Technology Pty Ltd・3-D Matrix EMEA B.V.・3-D Matrix UK Limited・（清算手続中の）3-D Matrix Medical Technology Limitedは【関係会社の状況】に記載された当社の連結子会社そのもの（businessStructure段階で既述）であり、独立した関連会社としては結んでいません。
- relatedCompanies: 株式会社りそな銀行（財務上の特約付き短期借入金の相手先）および株式会社三井住友銀行（当座貸越契約の相手先、md-and-aに記載）は、資金調達目的の金融取引のみが有報に記載されており、資本業務提携や事業上の協業は記載がないため結んでいません（いずれも src/data/companies/index.ts に resona-holdings / sumitomo-mitsui-financial-group として登録済みですが、ルールに従い除外しました）。
- relatedCompanies: ハイツ・キャピタル・マネジメント・インクおよびCVI Investments, Inc.（第36回新株予約権の割当先・契約当事者、【重要な契約等】(3)その他の契約）は新株予約権の発行に伴う資金調達スキーム上の投資ファンドであり、事業上の取引関係ではないため結んでいません。いずれも外国の投資ファンドで、src/data/companies/ にも登録がありません。
- relatedCompanies: 【株式の保有状況】によれば、当社は純投資目的以外の投資株式として非上場株式28,579千円のみを保有しており（銘柄数の内訳・個別銘柄名の記載なし）、上場株式の政策保有はありません。そのため政策保有株式を根拠とする関連会社はありません。
- relatedCompanies: FUJIFILM Europe B.V.自体はFUJIFILMグループの欧州子会社で単独では登録されていないため、グループを代表する上場親会社 fujifilm-holdings に結びました。
- relatedCompanies: 同じバッチで並行登録中の他社との間に、本有報から結べる関係の記載は見当たりませんでした。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は担当フィールドを持ちません（助言のみ）。data.requiredTermIds と data.proposedTerms は組み立て時に捨てられる想定どおりの内容です。
- terms: requiredTermIds を空にしたのは、businessModel・industry・relatedCompaniesの3つの成果物で自分が書いた本文に [[term:...]] リンクを1つも使わなかったためです。businessStructure・history段階（群1）が使った可能性のある annual-securities-report / segment / consolidated-subsidiary 等の既存用語は群1の担当分なのでここには含めていません。
- terms: proposedTerms は今後 terms を新設する場合の参考です。id・term・reason 以外のキー（description, sources, updatedAt など termSchema が要求するフィールド）は書いていません——実際に用語を書き起こすのはterms工程の担当外で、これはあくまで助言です。

## 要確認（status に反映）

なし。
