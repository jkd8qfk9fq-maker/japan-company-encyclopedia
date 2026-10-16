# ABEJA — research log

Registered: 2026-10-01（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＡＢＥＪＡ |
| 証券コード | 5574 |
| docID | `S100X6IA` |
| 提出日 | 2025-11-25 |
| 決算期 | 2025-08-31 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100X6IA.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＡＢＥＪＡ / 5574 / docID S100X6IA（id は英語表記「ABEJA,Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 10 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 7 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 10 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
abeja: 10 件の数値を有報XBRLと照合
有報: 株式会社ＡＢＥＪＡ 有価証券報告書－第13期(2024/09/01－2025/08/31) (docID S100X6IA)
前期有報との比較: 20 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 15 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
注意: セグメント情報のテキストブロックがない（US GAAP採用会社に多い）。セグメント別の売上・利益は md-and-a.txt に記載されているので、そこから採り、ログにその旨を書くこと
すべて一致しました。
abeja: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社ABEJA」が EDINET の提出者名「株式会社ＡＢＥＪＡ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: companyの一文説明（description）は57文字・句点1つです。「ABEJA Platformを核に、企業のミッションクリティカル業務へのAI導入支援から運用までを一括で行う会社。」としました。businessStructure（グループ1）の businesses[0].description を要約した一文です。
- businessModel: businessModel.customers の『さくらインターネット株式会社（総販売実績の17.2％）』には金額（615,205千円）を付けていません。md-and-a.txt の【主な相手先別の販売実績】表・【関連当事者情報】のどちらにも『615,205』の直後に『千円』が印字されておらず（単位は表のヘッダーにのみ記載）、check-prose-figures.mjs の逐語一致要件を満たさないためです。businessStructure（グループ1）が同じ理由で同じ金額を本文から外したのと同じ扱いです。SOMPOホールディングス株式会社の461,580千円は『関連当事者情報』に単位付きで印字されているため、そのまま使いました。
- businessModel: businessModel.customers / flow[2](customer) には、前事業年度のみ10％以上だった味の素株式会社（前期11.3％、当期は10％未満につき『－』表示で非開示）を含めていません。businessStructure（グループ1）の customers フィールドと同じ扱いです。relatedCompanies（この工程の別ファイル）でも同じ理由で現時点の relatedCompanies には含めていません。
- businessModel: businessModel.revenueSources は、販売実績表（md-and-a.txt）の『領域の名称』別の2区分（トランスフォーメーション領域／オペレーション領域）をそのまま収入源として採用しました。金額は businesses[].children に既出のため、ここでは収入の性質（フロー型／ストック型）の説明に留めています。
- businessModel: businessModel.flow の kind は company → offering → customer → revenue → profit の5段階・この順で1つずつ書きました。
- businessModel: businessModel.description に『用語集』（business.txt 末尾）のEMS（Electronics Manufacturing Service）という略語をそのまま使っています。正式名称を括弧で併記しており、捏造ではなく有報の記載どおりです。
- businessModel: sources は sourceSchema（strictObject）に合わせ、kind キーなどは入れていません。
- businessStructure: 当社は「デジタルプラットフォーム事業の単一セグメント」（非連結）です。セグメント情報のテキストブロックがなく、【関連情報】の製品及びサービスごとの情報も見当たらなかったため、children には『４　経営者による財政状態、経営成績及びキャッシュ・フローの状況の分析』ｃ．販売実績の「領域の名称」別（トランスフォーメーション領域／オペレーション領域）の金額表を使いました。pipeline.md が単一セグメント企業向けに想定している【関連情報】の製品区分とは section が異なりますが、報告セグメントに準じる形で実額が開示されている唯一の内訳であり、捏造ではなく有報の印字をそのまま使っています。
- businessStructure: children の並び順は、2025年8月期の金額の大きい順（トランスフォーメーション領域2,746,630千円＞オペレーション領域838,779千円）にしました。これは有報の表の印字順とも一致します。
- businessStructure: listings の market は「グロース」としました。表紙の「上場金融商品取引所名又は登録認可金融商品取引業協会名」が「東京証券取引所グロース市場」と、取引所名だけでなく市場区分まで印字しているためです（福岡証券取引所のように取引所名のみの表記ではありません）。
- businessStructure: shortNameEn「ABEJA」は、DEIの「提出者名（英語表記）」＝「ABEJA,Inc.」（表紙の英訳名はフルワイド表記「ＡＢＥＪＡ，Ｉｎｃ．」）から法人格部分「,Inc.」を除いたものです。有報自体にロゴやワードマークの指定はありませんが、ABC-MART・3-D Matrixなど既存エントリーの慣例（nameEnから法人格を除く）に揃えました。
- businessStructure: name「ABEJA」は officialName「株式会社ABEJA」から「株式会社」を除いたものです。この会社の商号自体がラテン文字（EDINET表紙ではフルワイド「株式会社ＡＢＥＪＡ」として格納）で、別途カタカナ表記は有報に見当たりません。
- businessStructure: products / customers は business.txt と md-and-a.txt に名前が挙がっているものに限定しました。customers は『４　経営者による財政状態...』の「主な相手先別の販売実績」の注（10％未満は「－」表示で省略）に基づく当事業年度（2025年8月期）の開示先2社（さくらインターネット株式会社17.2％、SOMPOホールディングス株式会社12.9％）です。前事業年度のみ10％以上だった味の素株式会社（前期11.3％、当期は10％未満で非開示）は当期の customers には含めていません。
- businessStructure: SOMPOホールディングス株式会社は『４　関係会社の状況』で当社の『その他の関係会社の親会社』（議決権被所有間接17.37％、役員1名受入）とされており、資本関係・取引関係の両方を持つ重要な関係者ですが、relatedCompanies はこの工程（businessStructure）の担当外なので書いていません。
- businessStructure: employees（従業員数）はこの工程の担当外（financials の担当）です。indicators.txtの5年表には従業員数の行がありますが、書いていません。
- businessStructure: sources は sourceSchema（strictObject）に合わせ、kind キーなどは入れていません。
- businessStructure: さくらインターネット株式会社615,205千円、トランスフォーメーション領域2,746,630千円、オペレーション領域838,779千円は、md-and-a.txtの表では金額の列に千円の単位が直接付いて印字されていません（ヘッダーの「金額（千円）」にのみ単位がある）。check-prose-figures.mjsは千円額を有報の印字と完全に同じ表記でしか照合できないため、この3つの金額は本文から外し、印字されている増減率・構成比（130.5％・76.6％・126.7％・23.4％・17.2％）だけを使いました。SOMPOホールディングス株式会社461,580千円は、関連当事者情報の別の文（sections.json）に「461,580千円」という形で単位付きで印字されているため、そのまま使えました。
- history: 沿革（history.txt）は全35行とも、各事象の直前に年月がインラインで印字される通常の形式で、年月のセルがまとまって先に並ぶ崩れ方は見当たりませんでした。
- history: 35行のうち8件を出来事として採用し、残りは代表的な出来事の description / significance に集約しました。2012年の出来事に集約したのは本社移転6回（2012年10月・2014年8月・2016年3月・2018年3月・2020年9月・2022年9月）とsalesforce.com, Inc.との資本業務提携（2014年12月）。2021年の出来事に集約したのは米国法人の設立（2019年10月）とヒューリック株式会社との資本業務提携（2021年10月）。2023年の出来事に集約したのは「ABEJA SIX 2022」開催（2022年7月）。2024年の出来事に集約したのはNCGMの戦略的イノベーション創造プログラムへの参画（2024年10月）。2025年・2024年の出来事（significance）に分けて触れたのは2025年4月・7月のNEDO採択です。
- history: 2019年7月の「AIの倫理・法・社会的課題を討議する有識者委員会『Ethical Approach to AI（EAA）』発足」は、現在の報告セグメントや主要製品に直接つながる記述が本文に見当たらず、どの出来事にも自然には集約できなかったため、どこにも入れていません。
- history: 2023年5月の「ABEJA LLM Series」リリースは沿革の表（history.txt）ではなく『事業の内容』（business.txt）に印字されている日付です。同じ有報内の別セクションからの引用で、2023年の出来事（東証グロース上場）に合わせて書きました。
- history: 資本金1,000千円は2012年9月の設立時の金額で、現在（2025年8月期末）の資本金895,936千円とは異なります。
- history: SOMPOホールディングス株式会社との関係は『４　関係会社の状況』『主な相手先別の販売実績』にも記載がありますが、relatedCompanies はこの工程（history）の担当外です。
- history: sources は sourceSchema（strictObject）に合わせ、kind キーなどは入れていません。
- industry: industryId は it 1つのみ、primary: true としました。当社はAI導入基盤ABEJA Platformの開発・導入・運用を行うデジタルプラットフォーム事業の単一セグメント企業で、ソフトウェア／ITサービスの提供そのものが事業内容です。掲載済みエントリーの慣例（企業向け業務システムの設計・構築・運用を主力とするNEC・富士通が it を primary にしている）に揃えました。
- industry: SOMPOホールディングス株式会社（保険持株会社）やさくらインターネット株式会社（データセンター／クラウド事業）が主要な顧客ですが、当社自身が保険業やデータセンター事業を営んでいるわけではないため、finance や telecommunications は付けていません。半導体・AIロボティクス向けハードウェアの製造も行っていないため semiconductors・electronics も付けていません。
- industry: AIロボティクス（LLMの判断結果を現場オペレーションに反映するリアル空間への事業領域拡張）は事業の内容（business.txt）に『戦略領域』として記載がありますが、2025年8月期時点ではオープンな外部連携を通じた社会実装の段階にあり、報告セグメントとして金額が独立して開示されている区分ではないため、業界の追加根拠にはしていません。
- relatedCompanies: src/data/companies/index.ts をこのファイルを書く直前に再読込し、sompo-holdings / sakura-internet / hulic / wantedly が登録済みであること、SOMPO Light Vortex株式会社は未登録であることを確認しました。
- relatedCompanies: SOMPOホールディングス株式会社は relationship を customer としました。理由：有価証券報告書【関連当事者情報】が『役務の提供』461,580千円（2025年8月期）という取引の内容・金額を具体的に記載しており、ABEJA（提出会社）が役務を提供する側＝売り手であることが明記されています。同社は当社の議決権を間接17.37％保有する『その他の関係会社の親会社』でもあり、政策保有株式の表（保有目的のみを書いて向きを書かない形式）とは異なり、本件は販売実績表・関連当事者情報の双方で実際の取引方向と金額が開示されているため、資金調達・保険取引を理由とする保有の除外ルールの対象ではないと判断しました（同社は保険持株会社ですが、保有目的は保険取引ではなく業務提携・資本関係です）。relationship は1社につき1つしか持てない型のため、customer を選び、議決権保有・資本業務提携の事実は description 内に残しました。
- relatedCompanies: SOMPO Light Vortex株式会社（当社の議決権を直接17.37％保有、2025年8月31日現在の大株主の状況では17.34％・1,693,500株で筆頭株主、SOMPOホールディングス株式会社の100％子会社）は、当社にとって最も持株比率の高い株主であり、かつ【関連当事者情報】によれば2025年8月期に役務の提供144,140千円の取引もありますが、src/data/companies/index.ts に未登録（東京証券取引所等に上場していない非公開会社）のため relatedCompanies には書けません。実質的に最重要の資本関係者がこの一覧から抜けている点を記録します。
- relatedCompanies: さくらインターネット株式会社は relationship を customer としました。理由：【主要な顧客ごとの情報】【主な相手先別の販売実績】が、当事業年度の同社向け売上高615,205千円・総販売実績の17.2％を記載し、かつ【関連当事者情報】の個人主要株主（田中邦裕氏、同社代表取締役）の項目でも『役務の提供（注：取締役が第三者＝さくらインターネット株式会社の代表者として行った取引）』と記載されており、ABEJA が役務を提供する側であることが明記されています。同社による当社株式の保有割合は【大株主の状況】の上位10名（所有割合0.95％以上）に入らないため、具体的な保有割合は開示されていません（『同社は当社の株主であり』という記載のみ）。
- relatedCompanies: ヒューリック株式会社は relationship を business-partner としました。理由：沿革（history.txt）に『2021年10月　DX推進を目的に、ヒューリック株式会社と資本業務提携』とあるのみで、どちらが何を供給・購入するかという取引の向きは有価証券報告書のどこにも記載がありません。4.43％（432,945株）の株式保有は【大株主の状況】に明記されています。銀行・保険会社ではなく、資金調達・保険取引を理由とする保有の除外規定の対象でもありません。
- relatedCompanies: ウォンテッドリー株式会社は relationship を business-partner としました。理由：【役員の状況】②社外役員の状況の、常勤監査役 桃原隼一氏（桃原公認会計士事務所所長・同社社外取締役〈監査等委員〉）に関する利害関係開示に『当社とウォンテッドリー株式会社との間には、採用サービスに関する取引関係がありますが、同社との取引条件は一般の取引先と同様であり、その取引額は僅少であります』とあるのみで、取引の向き（当社が同社の採用サービスを利用する側なのか、その逆か）が明記されていません。政策保有株式の表ではなく社外役員の独立性開示からの情報である点、取引額が『僅少』と明記されている点も、customer/supplier のどちらとも断定しない理由です。
- relatedCompanies: 株式会社ビザスク（社外監査役 青山正明氏が代表取締役を務める株式会社キーストーンとは別に、同氏が社外取締役〈監査等委員〉を務め、スポットコンサルに関する取引関係・取引額僅少と記載）は src/data/companies/index.ts に未登録のため書けませんでした。
- relatedCompanies: WALL株式会社（代表取締役CEO 岡田陽介氏の近親者が議決権100％を保有する関連当事者で、業務委託料14,180千円の取引記載あり）は上場会社ではないと考えられ、index.ts にも未登録のため書けませんでした。
- relatedCompanies: 味の素株式会社は、前事業年度（2023年9月～2024年8月期）のみ主要な顧客として10％以上（11.3％、311,278千円）が開示されていましたが、当事業年度（2024年9月～2025年8月期）は10％未満のため『－』表示で非開示です。有価証券報告書が当期の取引継続・金額を示していないため、relatedCompanies には含めていません（businessStructure・businessModel の両工程も同じ理由で customers から外しています）。取引が継続している可能性はありますが、確認できる当期の開示がないため、捏造を避けて省きました。
- relatedCompanies: 株式会社インスパイア・インベストメント（発行済株式2.87％を保有する大株主）は【大株主の状況】に記載がありますが、取引関係や業務提携など株式保有以外の関係性が有価証券報告書に記載されていないため、relatedCompanies の7種類のどの関係にも該当しないと判断し、含めていません。
- relatedCompanies: 株式会社CA ABEJA（代表取締役CEO 岡田陽介氏の略歴に『2018年4月　株式会社CA ABEJA　取締役』とあるのみ）は、当事業年度の【関係会社の状況】【大株主の状況】【関連当事者情報】のいずれにも現れず、現在も当社の関係会社かどうかを有価証券報告書から確認できなかったため、relatedCompanies には含めていません。CyberAgent株式会社との合弁の可能性がある社名ですが、確認できない関係を推測で書くことは捏造にあたるため、ここに記録するに留めます。
- relatedCompanies: salesforce.com, Inc.（2014年12月に販路拡大目的で資本業務提携）、NVIDIA Corporation（2017年5月に技術パートナーとして資本業務提携）は、沿革（history.txt）に記載がありますが、日本の証券取引所に上場する企業を対象とする本エンサイクロペディアの対象外（米国企業）と考えられ、index.ts にも未登録のため relatedCompanies には含めていません。
- relatedCompanies: 同じバッチで登録中の他社については、この工程を実行した時点（src/data/companies/index.ts 再読込時）で abeja の関連企業として新たに名前が挙がるものは見当たりませんでした。
- terms: この工程（terms）は data に何も書きません（担当フィールドが『なし』のため）。以下は助言のみで、Companyのデータには含まれません。
- terms: requiredTermIds（既存の src/data/terms/ の中で、この会社のページにリンクする価値がある語）: 'segment' の1件のみ妥当と考えます。当社はデジタルプラットフォーム事業の単一セグメント企業で、businessStructure（グループ1）の businesses[0].description と本工程の businessModel.flow[0] がどちらも『単一セグメント』という語を使っており、src/data/terms/segment.json の定義（『会社の事業を、経営者が業績を評価したり経営資源の配分を決めたりするときの単位で区切ったもの』）と整合します。他の14語（annual-securities-report, earnings-release, subsidiary, consolidated-subsidiary, ifrs, discontinued-operations, sogo-shosha, semiconductor, semiconductor-manufacturing-equipment, wafer, front-end-process, back-end-process, foundry, image-sensor）は、半導体関連語または当社に該当しない会計処理（IFRS・非継続事業等）の語で、この会社のページには合わないと判断しました。
- terms: proposedTerms（新規に起こす価値がある語。有価証券報告書『事業の内容』末尾の用語集を根拠に、当社の事業理解に特に必要な5語に絞りました。説明文は有報の用語集の文言をそのまま引いたもので、単一企業（当社）の文書が出典のため、実際に src/data/terms/ へ登録する際は他の用語（例：semiconductor.json、ifrs.json）同様、業界団体・学会・行政等のより一般的な一次情報源で裏付け直すことを推奨します。）:
- terms:   1. digital-transformation（デジタルトランスフォーメーション／DX）: 『データとデジタル技術を活用することで製品・サービス・ビジネスモデルの変革を行い、新たな競争優位性を作り出すこと』（有報用語集）。当社に限らず多くのIT関連企業のページで再利用価値が高い語です。
- terms:   2. generative-ai（生成AI）: 『学習データをもとに、テキストや画像など新たなデータを生成するAI（人工知能）のこと』（有報用語集）。businessModel.flow[4]（profit）でLLM案件の構成比に触れており、関連が強い語です。
- terms:   3. large-language-model（大規模言語モデル／LLM）: 『巨大なデータセットとディープラーニング技術を用いて構築された大規模言語モデルのこと』（有報用語集）。『ABEJA LLM Series』という製品名そのものに使われており、businessStructure（グループ1）の products にも挙がっています。
- terms:   4. human-in-the-loop（Human in the Loop／HITL）: 『段階的に運用ノウハウや知識データを蓄積し、人とAIが協調してオペレーションする環境を創出する仕組み』（有報用語集）。当社の事業概要（business.txt）の中核的な説明概念で、businessStructure（グループ1）の businesses[0].description の『人とAIの協調』という表現の元になっています。
- terms:   5. ems-electronics-manufacturing-service（EMS／Electronics Manufacturing Service）: 『電子機器をはじめとした他社の製品の製造を請け負うサービスのこと』（有報用語集）。当社のビジネスモデルの比喩（『デジタル版EMS』）として businessModel.description に使っており、読者がこの比喩を理解するために必要な語です。
- terms:   用語集にはこの他、人工知能（AI）、機械学習（ML）、深層学習（DL）、AIロボティクス、PoC、AutoML、BaaS、RAG、Agent、Fine-tuning、事前学習、事後学習、ガードレール、アノテーション、UI、UXの定義もありますが、当社のページ本文（businessStructure／businessModel／history）では直接使っていない、またはより一般的な既存語で代替可能と判断し、proposedTerms には含めていません。
- terms: sources は sourceSchema（strictObject）に合わせ、kind キーなどは入れていません。

## 要確認（status に反映）

なし。
