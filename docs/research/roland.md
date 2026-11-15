# ローランド — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ローランド株式会社 |
| 証券コード | 7944 |
| docID（データを取り出した文書） | `S100XNYW` |
| 原本 docID | `S100XNYW` |
| 提出日（原本） | 2026-03-05 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XNYW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ローランド株式会社 / 7944 / docID S100XNYW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 31 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
roland: 10 件の数値を有報XBRLと照合
有報: ローランド株式会社 有価証券報告書－第54期(2025/01/01－2025/12/31) (docID S100XNYW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
roland: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックは、前期有報と重複する年度の全行（8行）が一致した。
- businessModel: ブートストラップ時の「財務諸表の組替え・遡及適用」の指摘への判断：経営指標の注記に基づき、収益認識基準の適用を financialNote（2022年12月期）に記録した。従業員数の注記（マレーシア子会社の雇用形態の変更）も、5年間の経営指標のうち従業員数に関わるため financialNote（2023年12月期）に記録した。
- businessModel: セグメント関連情報の有形固定資産の地域別情報における表示方法の変更（前連結会計年度に区分掲記していた「マレーシア」を「その他」に含めて表示し、前期分を組み替えたもの）は、関連情報の表示区分のみの変更で、5年間の経営指標のいずれにも影響しないため warnings のみとした。
- businessModel: 当期純利益の減少要因として、MD&AにはDrum Workshop, Inc.の固定資産に対する減損損失3,860百万円と、同社の繰延税金資産の取崩し等による法人税等調整額1,724百万円が印字されている。本文の財務数値は売上高と当期純利益のみとする規則により、理由の詳細はフローに書かずここに記録する。
- businessModel: 地域別売上高の各地域の単純合計は、連結売上高100,952百万円と3百万円の差がある（印字の丸めの範囲で、印字どおり記載した）。
- businessModel: 中期経営計画の業績目標（2028年12月期の売上高・営業利益・当期純利益・ROE・ROICの目標値）は計画の数値であるため、本文及び perspectives には記載していない。
- businessModel: 連結子会社のRoland Organ Corporationは休眠会社となっており清算を予定している（【関係会社の状況】の注記）。清算の時期は印字されておらず、決算日現在のグループ構成は注記のとおりであるため、needsReview ではなくここに記録する。Roland Drum Corporationは2025年1月1日付でDrum Workshop, Inc.を存続会社とする吸収合併により消滅しており、期中の変更として期末の構成に反映済みである。
- businessStructure: 当社グループは電子楽器事業の単一セグメントであるため、子事業はMD&Aに印字された製品カテゴリー別の販売実績に基づく。金額は販売実績の印字どおりで、各カテゴリーの単純合計は連結売上高100,952百万円と2百万円の差がある（印字の丸め）。
- businessStructure: グループの機能分担は【事業の内容】に基づく。当社は製品の企画や研究開発、本社機能に加え、主に映像関連機器の生産と日本国内向けの販売を担う。製造子会社2社（Roland Manufacturing Malaysia Sdn. Bhd.、Roland Electronics (Suzhou) Co.,Ltd.）が生産の大部分を担い、販売子会社9社が米州・欧州・アジア・オセアニアで販売する。MI Services Malaysia Sdn. Bhd.は製造子会社2社の株式保有及び事業活動統括と、製品の仕入販売、物流管理、開発を担う。
- businessStructure: 本店所在地は表紙の記載による。2026年1月6日に本店所在地を浜松市浜名区細江町中川2036番地の1から同区新都田一丁目6番4号へ移転している（表紙の注記及び【主要な設備の状況】の注記）。決算日現在のグループ構成に影響しないため needsReview ではなく、沿革とここに記録する。
- history: 沿革は【沿革】の全行を転記した（69件）に、2026年1月の本社移転を加えた70件。1972年4月の設立行に印字された資本金額は、規則により本文に記載していない。
- history: 2026年1月の本社移転は沿革表の行ではなく、沿革末尾の注記、表紙の本店所在地の注記及び【主要な設備の状況】の注記に印字された事実であり、期後の事象として1件追加した。決算日現在のグループ構成や経営指標に影響しないため needsReview にはしていない。
- industry: 主たる業界は electronics とした。同社の製品は電子ピアノ、電子ドラム、シンセサイザーなどの電子楽器であり、電子機器そのものであるため、閉じた分類の中で electronics が正確に対応する。楽器専用の区分は閉じた分類にないが、electronics で事業の性質を正確に表せるため taxonomyGap は記録しない。映像音響機器も電子機器の範囲であり、副次分類は付けない。
- relatedCompanies: 関連企業は0件とした。特定投資株式及びみなし保有株式は「該当事項はありません」と印字されており、政策保有株式を通じた取引・提携の根拠がない。
- relatedCompanies: 大株主は、信託口（日本マスタートラスト信託銀行（信託口）8.59％、株式会社日本カストディ銀行（信託口）4.02％）、カストディ口座（ノーザントラスト系の各口座、ステート・ストリート）、投資ファンド（MINERVA GROWTH CAPITAL, LP 16.39％）、個人（BRIAN K. HEYWOOD、三木純一）及びローランド社員持株会のみで、リンク可能な事業会社はいない。MINERVA GROWTH CAPITAL, LPは未上場の投資ファンドで、関連企業候補に含まれない。
- relatedCompanies: 候補 land（ランド）は、社名「ローランド」の部分一致であり、株式会社ランドとの関係の印字はない。
- relatedCompanies: 候補 en（エン）は、「エンターテインメント」等の一般語への部分一致で曖昧であり、エン株式会社との関係の印字はない。
- relatedCompanies: 候補 vision（ビジョン）は、「人事戦略ビジョン」など一般語「ビジョン」への一致であり、株式会社ビジョンとの関係の印字はない。
- relatedCompanies: 候補 ishin（イシン）は、カーボンプライシングの記述中の部分一致であり、イシン株式会社との関係の印字はない。
- relatedCompanies: 候補 port（ポート）は、「事業ポートフォリオ」の部分一致であり、ポート株式会社との関係の印字はない。
- relatedCompanies: 候補 rhythm（リズム）は、自社製品「リズムマシン」の部分一致であり、リズム株式会社との関係の印字はない。
- relatedCompanies: 候補 seki（セキ）は、「セキュリティ」等の語への部分一致で曖昧であり、セキ株式会社との関係の印字はない。
- relatedCompanies: 候補 corona（コロナ）は、「コロナ禍」の部分一致であり、株式会社コロナとの関係の印字はない。
- relatedCompanies: 候補 lec（レック）は、「テレワーク」等の語への部分一致であり、レック株式会社との関係の印字はない。
- relatedCompanies: 候補 ray（レイ）は、「プレイヤー」等の語への部分一致で曖昧であり、株式会社レイとの関係の印字はない。
- relatedCompanies: 候補 base-4481（ベース）は、「コストのゼロベースでの見直し」の部分一致であり、ベース株式会社との関係の印字はない。
- relatedCompanies: 候補 cota（コタ）は、「インコタームズ」の部分一致で曖昧であり、コタ株式会社との関係の印字はない。
- relatedCompanies: 候補 go（GO）は、自社製品名「GO:KEYSシリーズ」の部分一致で曖昧であり、GO株式会社との関係の印字はない。
- relatedCompanies: 候補 career（キャリア）は、「キャリア選択制度」等の語への一致であり、株式会社キャリアとの関係の印字はない。
- relatedCompanies: 候補 slogan（スローガン）は、経営理念を表す一般語「スローガン」への一致であり、スローガン株式会社との関係の印字はない。
- relatedCompanies: 候補 suzuki-6785（鈴木）は、取締役の氏名「鈴木康伸」（個人）への一致で曖昧であり、株式会社鈴木との関係の印字はない。
- relatedCompanies: 候補 cover（カバー）は、動詞「カバーする」への一致であり、カバー株式会社との関係の印字はない。
- relatedCompanies: 候補 hub（ハブ）は、製品の「ワイヤレスハブ」及び新本社「Roland Inspiration Hub」の名称への一致で曖昧であり、株式会社ハブとの関係の印字はない。
- relatedCompanies: 候補 i-ll（アイル）は、地名「アイルランド」への一致であり、株式会社アイルとの関係の印字はない。
- relatedCompanies: 候補 ic（IC）は、「カスタムICチップ」の部分一致で曖昧であり、株式会社ICとの関係の印字はない。
- relatedCompanies: 候補 innovation（イノベーション）は、一般語「イノベーション」への一致であり、株式会社イノベーションとの関係の印字はない。
- relatedCompanies: 候補 kohsoku（高速）は、「超高速レスポンス」の部分一致で曖昧であり、株式会社高速との関係の印字はない。
- relatedCompanies: 候補 path（パス）は、ライセンス名「モデル・パス」の部分一致で曖昧であり、パス株式会社との関係の印字はない。
- relatedCompanies: 候補 rohm（ローム）は、「クローム・フープ」の部分一致であり、ローム株式会社との関係の印字はない。
- relatedCompanies: 候補 step（ステップ）は、「戦略的ステップ」の部分一致であり、株式会社ステップとの関係の印字はない。
- relatedCompanies: 候補 the-lead（リード）は、「リードタイム」の部分一致であり、株式会社リードとの関係の印字はない。
- relatedCompanies: 候補 trust（トラスト）はコードリスト外の候補であり、一致箇所は大株主の日本マスタートラスト信託銀行（信託口）の信託口名義であるため関連企業としない。
- relatedCompanies: 候補 zero（ゼロ）は、「ゼロベース」の部分一致で曖昧であり、株式会社ゼロとの関係の印字はない。
- relatedCompanies: 候補 zig-zag（ジグザグ）は、大量保有報告書の注記中のロンドンの建物名「ザ・ジグザグビルディング」への一致であり、株式会社ジグザグとの関係の印字はない。
- terms: 助言: 用語「V-Drums」は、同社の電子ドラムの製品シリーズの名称。
- terms: 助言: 用語「Roland Cloud」は、同社が提供するクラウドサービスで、バーチャル楽器や製品のアップデータを提供し、顧客のライフタイムバリューを高める基盤と位置づけられている。
- terms: 助言: 用語「Roland Inspiration Hub」は、2025年10月に竣工した浜松市浜名区新都田の新本社の名称。研究開発、生産、管理などの機能を一体化した拠点。
- terms: 助言: 用語「Direct Connect」は、中期経営計画2026-2028の重点戦略の一つで、顧客との直接的かつ継続的な接点を強化する取り組みを指す。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
