# オークマ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | オークマ株式会社 |
| 証券コード | 6103 |
| docID（データを取り出した文書） | `S100YFQC` |
| 原本 docID | `S100YFQC` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFQC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | オークマ株式会社 / 6103 / docID S100YFQC（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 38 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
okuma: 10 件の数値を有報XBRLと照合
有報: オークマ株式会社 有価証券報告書－第162期(2025/04/01－2026/03/31) (docID S100YFQC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
okuma: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 指標の注記4の税効果会計基準（2022年改正）の遡及適用は、5年間の数値系列の表示基準に関する事実としてfinancialNotesに記録した。前期有報との修正再表示チェックは全系列で一致しており、数値の不整合はない。
- businessModel: 2024年10月1日の株式分割（1株につき2株）は1株当たり指標のみに影響するため、financialNotesには書かず、この警告に記録した。
- businessModel: 重要な契約等は「該当事項はありません」。重要な後発事象に期後のグループ変更の記載はなく、訂正有報もないため、needsReviewは空とした。
- businessModel: 中期経営計画2028・2030年ビジョンの数値目標は売上高のみを引用し、営業利益率・ROE・ROICの目標は文章の規則により書いていない。
- businessStructure: 報告セグメントは地域別（日本・米州・欧州・アジア・パシフィック）の4区分であり、2026年3月期の外部顧客への売上高の大きい順に並べた。セグメント利益は書いていない。
- businessStructure: 【関連情報】の製品別売上高（マシニングセンタ132,309百万円・複合加工機60,763百万円・NC旋盤34,304百万円・NC研削盤2,424百万円・その他6,087百万円）はグループ全体の区分であり地域別セグメントに対応しないため、子事業の金額としては使わなかった（事業モデルの収入の段にのみ記載）。
- businessStructure: 子事業は【事業の内容】・【関係会社の状況】に印字された地域ごとの主要関係会社とし、金額は独立して開示されていないため付けていない。
- businessStructure: 主要な設備は提出会社の工場・支店がすべて「日本」セグメントに属するが、事業への設備の対応付けは行わなかった。
- history: 【沿革】は年月と事象が本文中に一体で印字されているため、そのまま年ごとに採用した。資本金の金額は文章の規則により書いていない。
- history: 工場の新設や海外拠点の開設などの細かい行（可児第1～第5工場、各地のテクノロジーセンター開設など）は主要なものに絞り、省略した行は次のとおり: 萩野工場への本社移転(1937)、大隈鋳造の設立(1955)と改称(1979)、米国販売法人の設立(1979)、三井物産との合弁による米国法人の設立(1984)、大隈技研の設立(1985)、欧州現地法人の買収(1988)、大隈鉄工マシンサービスの設立(1988)、日本精機商会の子会社化(1993)、台湾の大同大隈の設立(1997)、オークマスチールテクノの子会社化(1999)、タイ法人の設立(2000)、上海法人の設立(2001)、豪州法人の設立(2002)、大阪証券取引所の上場廃止(2003)、ドリームサイト2(2017)・ドリームサイト3(2019)の新設、大隈(常州)机床の設立(2019)、Okuma Deutschland(2019)・Okuma Benelux(2020)・Okuma Austria(2024)の子会社化、群馬工場の新設(2023)、オークマPDCの新設(2025)。
- industry: 東証の業種区分は機械であり、工作機械の製造・販売が事業の中心のため、主たる業界をmachineryとした。
- industry: semiconductorsは付けなかった: 半導体製造装置は需要先の産業として言及されるが、半導体向けの部材・部品・装置を事業として開示していないため。
- industry: automotiveは付けなかった: 自動車産業は需要先の一つだが、自動車そのものの製造事業ではないため。
- relatedCompanies: 結んだ19件はすべて【株式の保有状況】の特定投資株式で、銘柄ごとに取引の内容（販売代理店・ユーザ・調達先）が印字され、保有株数も相応の規模があるものに限った。計上額は書いていない。
- relatedCompanies: base-4481（ベース）: 「ネットベース／グロスベース」という温室効果ガス排出目標の表現の一部であり、ベース株式会社への言及はないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 「イノベーションの創出」という一般語としてのみ使われ、株式会社イノベーションへの言及はないため結ばなかった。
- relatedCompanies: career（キャリア）: 「キャリア自律」など人材育成の文脈の一般語のため結ばなかった。
- relatedCompanies: nippon-seiki（日本精機）: 有報の「日本精機商会」は当社の連結子会社である株式会社日本精機商会（愛知県小牧市）であり、日本精機株式会社（7287）とは別の会社であるため結ばなかった。
- relatedCompanies: seki（セキ）: 「情報セキュリティ」等の語の一部としてのみ現れるため結ばなかった（ambiguous）。
- relatedCompanies: port（ポート）: 「サポート」の語の一部としてのみ現れるため結ばなかった。
- relatedCompanies: space（スペース）: 「組立スペース」等の一般語としてのみ現れるため結ばなかった。
- relatedCompanies: kanematsu（兼松）: 特定投資株式として2,546株を保有するが、当社製品の販売代理店であるのは同社の子会社であり、保有規模も僅少（計上額5百万円）であるため結ばなかった。
- relatedCompanies: zero（ゼロ）: 「排出量実質ゼロ」等の一般語のため結ばなかった（ambiguous）。
- relatedCompanies: land（ランド）: 「ニュージーランド」の地名の一部としてのみ現れるため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的は資金調達及び金融取引であり、銀行・金融機関は結ばないため。その他の言及も大量保有報告書の共同保有者としての記載のみである。
- relatedCompanies: the-lead（リード）: 「世界をリードする研究開発」という一般語の表現のため結ばなかった。
- relatedCompanies: vision（ビジョン）: 「2030年ビジョン」等の一般語のため結ばなかった。
- relatedCompanies: aichi-financial-group: 保有目的が資金調達及び金融取引のため結ばなかった（銀行グループ）。
- relatedCompanies: hachijuni-nagano-bank: 保有目的が資金調達及び金融取引のため結ばなかった（銀行）。
- relatedCompanies: juroku-financial-group: 保有目的が資金調達及び金融取引のため結ばなかった（銀行グループ）。
- relatedCompanies: sumitomo-mitsui-trust-group: 保有目的が資金調達及び金融取引のため結ばなかった（銀行グループ）。
- relatedCompanies: cover（カバー）: 「成長産業、強みの産業を幅広くカバーする」という一般語のため結ばなかった。
- relatedCompanies: dai-ichi-life-holdings（第一ライフグループ）: 保有目的が資金調達及び金融取引であり、保険・金融機関は結ばないため結ばなかった。
- relatedCompanies: mitsui-and-co（三井物産）: 1984年の米国合弁会社の設立と1997年のブラジル合弁会社の設立という過去の沿革上の出来事のみで、現在の取引・提携の記述が有報にないため結ばなかった。
- relatedCompanies: fukuoka-financial-group: 保有目的が資金調達及び金融取引のため結ばなかった（銀行グループ）。
- relatedCompanies: iyogin-holdings: 保有目的が資金調達及び金融取引のため結ばなかった（銀行グループ）。
- relatedCompanies: kel（ケル）: ドイツ・ケルン市という地名への一致のため結ばなかった（ambiguous）。
- relatedCompanies: kohsoku（高速）: 「加工の高速化」という一般語のため結ばなかった（ambiguous）。
- relatedCompanies: misonoza-theatrical（御園座）: 保有目的は「当社所在地域社会の伝統文化発展への貢献のため」であり、取引・提携の記述がないため結ばなかった。
- relatedCompanies: mitsubishi-hc-capital: 保有目的が金融取引のため結ばなかった。
- relatedCompanies: nikko-6306（日工）: 「日本工作機械工業会（日工会）」という業界団体名への一致のため結ばなかった（ambiguous）。
- relatedCompanies: nissin（日新）: コードリストにない相手であり、「中日新聞」への一致のため結ばなかった。
- relatedCompanies: path（パス）: 「名古屋大学東山キャンパス」の「キャンパス」への一致のため結ばなかった。
- relatedCompanies: rent（レント）: 「エクセレントカンパニー」という表現への一致のため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 保有目的が資金調達及び金融取引であり、かつ当事業年度は保有していない（株式数「－」）ため結ばなかった。
- relatedCompanies: the-bank-of-nagoya（名古屋銀行）: 保有目的が資金調達及び金融取引のため結ばなかった（銀行）。
- relatedCompanies: the-hyakujushi-bank（百十四銀行）: 保有目的が資金調達及び金融取引のため結ばなかった（銀行）。
- relatedCompanies: toho-gas（東邦瓦斯）: 保有目的は「当社所在地域社会のインフラ基盤の安定のため」であり、取引の記述がないため結ばなかった。
- relatedCompanies: tsudakoma（津田駒工業）: 保有目的は当社製品のユーザであり且つ部品の調達先と印字されているが、保有が6,310株・計上額2百万円と僅少であり、情報収集的水準と判断して結ばなかった。
- relatedCompanies: 候補リストにない相手: CKD株式会社は当社製品のユーザであり且つ部品の調達先（922,800株）、THK株式会社も当社製品のユーザであり且つ部品の調達先（164,000株）と印字されているが、候補リストにないため結べなかった。主要な顧客であるMorris Group, Inc.とGosiger Machine Tools, LLCも候補リストにない（販売実績は事業モデルに記載）。
- relatedCompanies: 大株主のうち株式会社三菱UFJ銀行（2.26%）は金融機関であり、岡谷鋼機以外の事業会社の大株主は候補にない。連結子会社16社はすべて非上場で候補にない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
