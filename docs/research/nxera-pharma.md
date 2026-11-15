# ネクセラファーマ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ネクセラファーマ株式会社 |
| 証券コード | 4565 |
| docID（データを取り出した文書） | `S100XTYN` |
| 原本 docID | `S100XTYN` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTYN.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%8D%E3%82%AF%E3%82%BB%E3%83%A5%E3%83%A9%E3%83%BC%E3%83%9E

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ネクセラファーマ株式会社 / 4565 / docID S100XTYN（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nxera-pharma: 10 件の数値を有報XBRLと照合
有報: ネクセラファーマ株式会社 有価証券報告書－第36期(2025/01/01－2025/12/31) (docID S100XTYN)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nxera-pharma: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 収益の内訳はセグメント注記の収益区分（上市済製品20,136百万円、研究・開発9,479百万円、合計29,615百万円）に基づきます。MD&Aでは製品別にピヴラッツ®13,511百万円、クービビック®4,327百万円、呼吸器疾患2,169百万円、その他130百万円、研究・開発の内訳として契約一時金収入1,571百万円、マイルストン収入5,227百万円、前受収益取崩額2,652百万円、その他30百万円が示されています。本文では区分単位の金額を中心に用いました。
- businessModel: 2025年12月期の営業損失は8,462百万円、コア営業損失は352百万円、税引前損失は14,950百万円です。金融収益及び金融費用の純額は6,489百万円の費用で、社債の条件変更に伴う費用4,649百万円と条件付対価評価損1,940百万円が主な要因とされています。これらは本文の財務数値の対象外（売上収益と当期純利益のみ）のため、理由の説明は flow の profit 段の範囲に留め、金額はここに記録します。
- businessModel: 2030年ビジョン（売上高500億円以上、営業利益30％以上）は利益率を含む経営目標のため、本文と perspectives には記載せず、ここに記録します。
- businessModel: 受注実績5,941百万円・受注残高1,929百万円、生産実績20,951百万円、研究開発費14,466百万円、前受収益の残高5,356百万円は、本文の財務数値の対象外のため記載していません。
- businessModel: 金額はすべて有報の印字どおり百万円単位で記載しています（千円単位への換算や四捨五入はしていません）。前期の数値も印字どおりです。
- businessModel: 会計基準の変更や変則決算はなく、修正再表示チェックでも前期有報との差異はなかったため、financialNotes は空です。
- businessStructure: 報告セグメントは医薬品事業の単一セグメントのため、セグメント注記で開示された収益区分（上市済製品・研究・開発）を children とし、外部顧客への売上収益をそれぞれ記載しました。区分の並びは外部顧客への売上収益の大きい順です。
- businessStructure: 連結子会社は9社です。関係会社の状況で個別に開示されているのはネクセラファーマジャパン株式会社とNxera Pharma UK Limitedで、その他7社とまとめられています。子会社の資本金（ネクセラファーマジャパン株式会社95百万円、Nxera Pharma UK Limited 416千英ポンド）は資本金の金額のため記載していません。
- businessStructure: 連結子会社のHeptares Therapeutics Zurich AGは提出日現在で清算手続き中です。この点は businessModel の needsReview に記録し、登録は2025年12月31日現在の体制（連結子会社9社）で行っています。
- businessStructure: 連結子会社の主要な損益情報（ネクセラファーマジャパン株式会社の売上収益21,286百万円など）は子会社単体の数値のため、本文には記載していません。
- history: 沿革のうち、新株式発行や転換社債型新株予約権付社債の発行・買入消却（払込金額・額面の記載のある行）、事務所開設、個別の承認取得の細目などは省略しました。資本金の金額は沿革にも記載していません。
- history: 2026年1月のサンセラとのライセンス契約は決算期後の出来事ですが、契約の締結自体は完了した事実であり、重要な後発事象として開示されているため沿革に記載しました。構造の変更を伴わないため needsReview には入れていません。
- history: 創設者に関する補足（田村眞一氏）だけ Wikipedia を出典に使いました。数値は一切使っていません。
- industry: 主たる業界は pharmaceuticals（医薬品）です。医薬品事業の単一セグメントで、GPCRを標的とする創薬から開発・販売までを手掛けるバイオ医薬品企業であり、閉じた分類にそのまま合う値があるため taxonomyGaps はありません。
- relatedCompanies: 結んだのは medipal-holdings（customer）と shionogi-and-co（customer）の2社です。関係の説明には金額を入れていません。
- relatedCompanies: Neurocrine Biosciences Inc.（ムスカリン受容体作動薬のライセンス契約）、Eli Lilly and Company（糖尿病・代謝性疾患の創薬提携）、AbbVie Inc.（神経疾患の研究開発提携）、Novartis International AG（呼吸器疾患製品のロイヤリティ）、Boehringer Ingelheim International GmbH（統合失調症の提携・ライセンスオプション）、Centessa Pharmaceuticals Limited、Tempero Bio, Inc.、Biohaven Pharmaceutical Holding Company Ltd.、Genentech, Inc.、Viatris Inc.、Holling Bio-Pharma Corp.、Handok Inc.はいずれも提携・ライセンス・販売の相手先ですが、海外企業で related-candidates.json に無いため結んでいません（事実は本文・沿革に記載しました）。
- relatedCompanies: Centessa Pharmaceuticals PLCについては、特定投資株式として453,549株を保有し、Nxera Pharma UK Limitedが所有するノウハウ等の権利をオレキシン受容体関連薬に許諾していることが開示されていますが、海外の上場企業で候補に無いため結んでいません（計上額は記載しません）。
- relatedCompanies: ファイザー株式会社は大株主の状況に2.08％（2025年12月31日現在）の保有で載っていますが、Pfizer Inc.の日本法人で非上場、候補にも無いため結んでいません。2015年11月のPfizer Inc.との戦略的提携契約は沿革に記載しました。
- relatedCompanies: 株式会社みずほ銀行は金銭消費貸借契約の相手方（資金調達）であり、関連企業としては結んでいません。Idorsia Pharmaceuticals Ltdは旧親会社的な立場でクービビック®の商標権者ですが、非上場で候補に無いため結んでいません。
- relatedCompanies: その他の候補はすべて社名の一致だけの誤検出です：port（「ポートフォリオ」の語）、base-4481（「連結ベース」の語）、core（「コア営業損益」の語、ambiguous）、vision（「2030年ビジョン」の語）、land（「ブランド」の語の一部）、step（「5ステップアプローチ」の語）、en（一般語、ambiguous）、the-lead（「リード化合物」の語）、innovation（「イノベーション」の語）、i-ll（「アイルランド」の語）、king（「ワーキング・グループ」の語）、zero（「成長率をゼロ」の語、ambiguous）、hit（「ヒット分子」の語）、lec（「フレックス」の語）。nissin と trust はコードリストに無く結べません（trust は日本マスタートラスト信託銀行（信託口）の名称の一部）。
- terms: 用語の助言: 「GPCR（Gタンパク質共役受容体）」（細胞膜にある受容体の一群で、多くの医薬品の標的）、「NxWave™」（同社のGPCR構造ベース創薬プラットフォーム）、「NxStaR™」（候補品探索の技術）、「アンメットニーズ」（有効な治療法がまだ無い医療上の必要性）、「マイルストン収入」（開発の進捗に応じて提携先から受け取る収入）、「契約一時金」（契約開始時に受け取る収入）、「ロイヤリティ」（販売額に応じて受け取る実施料）、「トランスレーショナルメディシン」（基礎研究の成果を臨床応用につなげる研究）、「ファーストインクラス」（新規の作用機序を持つ初めての医薬品）は用語集への追加候補です。本文では有報の説明に沿って使っています。
- terms: 用語工程は助言のみのため data は空です。

## 要確認（status に反映）

- businessModel: 連結子会社のHeptares Therapeutics Zurich AGは、提出日現在で清算手続き中です（事業の内容に記載）。登録は2025年12月31日現在の体制（連結子会社9社）で行っています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
