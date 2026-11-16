# サンクゼール — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サンクゼール |
| 証券コード | 2937 |
| docID（データを取り出した文書） | `S100YD6O` |
| 原本 docID | `S100YD6O` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD6O.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サンクゼール / 2937 / docID S100YD6O（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
st-cousair: 10 件の数値を有報XBRLと照合
有報: 株式会社サンクゼール 有価証券報告書－第44期(2025/04/01－2026/03/31) (docID S100YD6O)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
st-cousair: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（切り上げはしていない）。売上高20,600,612千円は20,600百万円、親会社株主に帰属する当期純利益618,234千円は618百万円とした。
- businessModel: 会社は営業利益及び売上高営業利益率を重要指標としているが、利益率等の指標は本文・戦略に書かない規則のため warnings に記録するにとどめた。
- businessModel: 生産実績（4,170,165千円）の金額は本文の財務数値に含めない規則のため書かなかった。受注実績は見込み生産のため該当事項はありませんと印字されている。
- businessModel: この作業ツリーのスキーマには suppliers キーがないため businessModel に suppliers は書かなかった。仕入・供給の事実：全国500社を超える食品メーカーとのネットワークを持ち、各メーカーの商品にブランドの独自性を加えて販売している。連結子会社の㈱斑尾高原農場は当社製品の原材料を製造し、St. Cousair,Inc.は当社製品を仕入れて米国を中心に販売している。
- businessModel: Wikipedia は証券コードで同一性を確認できたが、その要約には有報の6ブランドに無い「THE GROCERY&WINE」が含まれており、有報と食い違うため使わなかった。有報の事実だけで足りている。
- businessStructure: 事業セグメントは食品製造販売事業のみの単一セグメントで、セグメント情報の記載自体が省略されている。children のチャネル別金額はセグメント注記の【関連情報】（製品及びサービスごとの情報）の外部顧客への売上高であり、報告セグメントの内訳ではない。
- businessStructure: 金額は千円の印字を百万円に切り捨てて記載した（切り上げはしていない）。チャネル別の切り捨て後の合計は20,599百万円で、印字の合計20,600百万円と1百万円異なる。合計は印字どおり20,600百万円を引用した。
- businessStructure: 連結子会社は4社（㈱斑尾高原農場、St. Cousair,Inc.、St. Cousair Korea Co., Ltd.、㈲長生堂）。㈱斑尾高原農場は議決権の所有割合が49％（緊密な者の所有割合51％は外数）だが実質的に支配しているため子会社とされている。St. Cousair,Inc.は特定子会社。
- businessStructure: ㈲長生堂の全株式取得について、【関係会社の状況】の注記は2025年9月25日、【沿革】は2025年10月と印字が異なる。いずれも当期中の完了で期末の体制に反映されているため history と warnings に記録した。
- history: 沿革の資本金の増減資の行（1982年設立時、1992年・2000年・2008年・2020年の増資、2010年の減資）は、資本金額を本文に書かない規則のため落とした。
- history: 落とした行：1989年レストランサンクゼール開店と農業生産法人㈲三水ワイン生産農園の設立、1996年リキュール類の酒類製造免許取得、1997年オリンピックライセンスの特別製造ジャム、2000年カリフォルニアワインの輸入販売開始、2011年ものづくり大賞NAGANO大賞、2012年㈲三水ワイン生産農園の商号変更、2013年サンクゼール シードルの原産地呼称認定とチャリティージャム事業の日本パートナーシップ大賞、2014年サンクゼール信濃町センター設立、2016年信州ブランドアワード受賞、2017年いいづなシードルブランデー製造開始と奈良県とのパートナーシップ協定締結、2017年㈱斑尾高原農場（別法人）の設立、2019年一般財団法人アファンの森財団とのスポンサー契約とForbes Japan SMALL GIANTS AWARD受賞、2020年JFS-B規格認証取得・久世福e商店街の立上げ・職場いきいきアドバンスカンパニー認証、2021年島根県とのパートナーシップ協定締結とBokksu, Inc.への出資及び業務提携、2022年Blue Hill Tech, Inc.への出資及び業務提携、2023年MeKELブランドの立ち上げと公益財団法人サンクゼール財団の共同設立、2024年サンクゼールの森の自然共生サイト認定。
- history: MeKELブランドは2023年9月に立ち上げられたが当期の6ブランドには含まれておらず、前期にはMeKEL退店による減損の計上があった旨がMD&Aに印字されている。現在の事業構成には含まれないため沿革の行にも入れなかった。
- history: ㈲長生堂の全株式取得は【沿革】では2025年10月、【関係会社の状況】の注記では2025年9月25日と印字される。当期中の完了で期末体制に反映されているため、沿革では年月を特定せず2025年の行とした。
- industry: 事業セグメントは食品製造販売事業のみの単一セグメントであり、食品の製造と販売が一体の事業であるため food のみとした。店舗・EC・卸・海外はいずれも同じセグメント内の販売チャネルであり、独立した小売セグメントとして開示されていないため retail は付けなかった。
- relatedCompanies: Costco Wholesale Corporation： 【主要な顧客ごとの情報】に2026年3月期の売上高3,908,625千円（売上高の19.0％）が印字される主要な顧客だが、related-candidates.json に含まれていないため結ばなかった。
- relatedCompanies: 株式会社イートスタイル： 【主要な顧客ごとの情報】に2026年3月期の売上高2,220,367千円（同10.8％）が印字される主要な顧客だが、related-candidates.json に含まれていないため結ばなかった。
- relatedCompanies: Bokksu, Inc.及びBlue Hill Tech, Inc.： 【沿革】に2021年10月のBokksu, Inc.への出資及び業務提携契約の締結、2022年7月のBlue Hill Tech, Inc.への出資及び業務提携契約の締結が印字されるが、いずれもrelated-candidates.json に含まれない非上場の米国企業であるため結ばなかった。
- relatedCompanies: 連結子会社4社（㈱斑尾高原農場、St. Cousair,Inc.、St. Cousair Korea Co., Ltd.、㈲長生堂）はいずれも非上場で候補に含まれないため、関連企業としては結ばない（体制は businessStructure の warnings に記録）。
- relatedCompanies: 【株式の保有状況】は特定投資株式が該当事項なしで、保有する投資株式は非上場株式3銘柄のみのため、政策保有によるリンクは無い。【大株主の状況】の上位株主は創業家個人とその関係する信託・LLC等で、上場している事業会社は無いため major-shareholder のリンクも無い。
- relatedCompanies: land（株式会社ランド）: 「ブランド」の部分文字列による一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: kuze（株式会社 久 世）: 創業家の姓「久世」とブランド名「久世福商店」の一致（ambiguous）であり、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「ポートフォリオ」及び「Portlandia」の部分文字列による一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成支援」という一般語の一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: nissin（株式会社日新）: コードリストに無い相手であり、新株予約権の文脈の一致でもあるため結ばなかった。
- relatedCompanies: slogan（スローガン株式会社）: 「コーポレート・スローガン」という一般語の一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: seed（株式会社シード）: 「シードル」（りんご酒）の部分文字列による一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「ドリンクベース」という商品名の一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: seki（セキ株式会社）: 「セキュリティ」という一般語の一致（ambiguous）で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: zero（株式会社ゼロ）: 「ゼロベース」という一般語の一致（ambiguous）で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: en（エン株式会社）: 「エンジニア」という一般語の一致（ambiguous）で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: vision（株式会社ビジョン）: 「ビジョン」という一般語の一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: freee（フリー株式会社）: 「グルテンフリー認証」の部分文字列による一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: innovation（株式会社イノベーション）: 「イノベーション」という一般語の一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: path（パス株式会社）: 「パスタソース」という商品名の一致（ambiguous）で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: stream（株式会社ストリーム）: 「メインストリーム」という一般語の一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: コードリストに無い相手であり、一致箇所は日本マスタートラスト信託銀行（信託口）という別法人の名称であるため結ばなかった。
- relatedCompanies: aeon-mall（イオンモール株式会社）: コードリストに無い相手であり、一致箇所は久世福商店1号店の出店先施設名（イオンモール幕張新都心店）であって取引・提携の記述ではないため結ばなかった。
- relatedCompanies: garden（株式会社ガーデン）: 「イングリッシュガーデン」という一般語の一致で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: heiwa（株式会社平和）: 「平和」という一般語の一致（ambiguous）で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: kohsoku（株式会社高速）: 「高速回転」という一般語の一致（ambiguous）で、相手企業についての記述は無いため結ばなかった。
- relatedCompanies: space（株式会社スペース）: 「未活用スペース」という一般語の一致で、相手企業についての記述は無いため結ばなかった。
- terms: 用語候補（助言のみ）: 食のSPAモデル、久世福商店、サンクゼール、KUZE FUKU ＆ SONS、FBCプログラム（Fan-Based Community）、OFC（オーナー・フランチャイズ・チェーン）、サンクゼールの丘、自社POS連動型ERPシステム。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
