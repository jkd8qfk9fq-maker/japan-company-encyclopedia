# AB&Company — research log

Registered: 2026-10-01（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＡＢ＆Ｃｏｍｐａｎｙ |
| 証券コード | 9251 |
| docID | `S100XHI8` |
| 提出日 | 2026-01-27 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHI8.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＡＢ＆Ｃｏｍｐａｎｙ / 9251 / docID S100XHI8（id は英語表記「AB&amp;Company Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 11 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 6 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ab-and-company: 10 件の数値を有報XBRLと照合
有報: 株式会社ＡＢ＆Ｃｏｍｐａｎｙ 有価証券報告書－第8期(2024/11/01－2025/10/31) (docID S100XHI8)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 15 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
注意: 本文に 遡及修正 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ab-and-company: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社AB&Company」が EDINET の提出者名「株式会社ＡＢ＆Ｃｏｍｐａｎｙ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: description（一文、90文字以内・句点1つ）は「全国で美容室「Agu.」を直営とフランチャイズで展開し、加盟店への経営支援や内装デザインも手がける会社です。」とした。
- businessModel: 決算期ラベルは表紙の事業年度（自2024年11月1日 至2025年10月31日、DEIの当事業年度終了日2025-10-31）から「2025年10月期」とした。
- businessModel: 金額は有報の印字どおり百万円単位で引用した。売上収益19,378百万円と前期比6.6％増・営業利益1,630百万円と6.3％減・当期利益893百万円と17.0％減は経営者による分析の印字、15,746／1,723／1,800百万円は注記22（売上収益）の分解表、報告セグメントの損益（1,190／67／△20）は注記6（セグメント情報）の印字。
- businessModel: flow.profit の費用構成（人件費48％・地代家賃10％・広告宣伝費7％・本部ロイヤリティ5％・店舗営業利益2％）は、有報【事業の内容】の『Agu.グループの一般的な店舗の売上に対する費用等の構成比率』（2025年10月期の当社直営店舗における平均数値）をそのまま引用した。会社全体の利益率ではなく直営店舗の平均である点を本文で明記した。
- businessModel: flow.profit の『利益の大半はフランチャイズ事業が占めます』は、報告セグメント損益（フランチャイズ1,190、インテリア67、直営△20）の比較による記述。報告セグメント以外の『その他』（本社管理事業等）の損益は有報に502百万円と印字されているが、報告セグメントではないため本文では触れていない。
- businessModel: 店舗数は、有報【事業の内容】の店舗数推移表（2025年10月31日：直営447、フランチャイズ653、合計1,100）を使った。なお第１【企業の概況】（はじめに）の本文には『現在の1,210店舗（2025年10月末現在）』という別の数字が印字されているが、同じ有報の店舗数推移表と経営者による分析（国内1,100店舗）の双方が1,100であるため、1,100を採用し1,210は使っていない（有報内の不一致として記録）。
- businessModel: 『10％以上を占める単一の外部顧客はありません』は、セグメント注記（5）主要な顧客に関する情報の記載を要約した。
- businessModel: flow.customer の『集客全体の約8割はWEB予約』は事業等のリスク(2)の『集客全体に占めるWEB予約比率は2025年10月期通年で約８割』による。HOT PEPPER Beauty への依存度が高い旨は事業等のリスク(15)にも記載がある（同サイトの提供元の資本関係は本ファイルでは扱わない）。
- businessModel: flow.company の『連結子会社13社』は【事業の内容】冒頭の記載。【関係会社の状況】の表は12社＋休眠中の間接子会社1社（株式会社RITA）で、合計は一致する。
- businessModel: businessModel.description と flow で既存の用語集エントリー [[term:segment|セグメント]] と [[term:consolidated-subsidiary|連結子会社]] を使用した（いずれも src/data/terms/ に既存）。
- businessModel: 担当外のフィールド（businesses, name, listings, industries, history, relatedCompanies）は書いていない。
- businessStructure: name は表紙の会社名「株式会社AB&amp;Company」から法人格を除いた常用の表記です。社名そのものがラテン文字のため、shortNameEn（別の英語ワードマーク）に相当する記載は有報中に見当たらず書いていません（a-and-d-holon-holdingsと同じ扱い）。
- businessStructure: 報告セグメントは「直営美容室運営事業」「フランチャイズ事業」「インテリアデザイン事業」の3つで、外部顧客への売上収益（2025年10月期：15,746／1,831／1,800百万円）の降順に並べました。
- businessStructure: セグメント注記の「その他」（本社管理事業等）は有報が『報告セグメントに含まれない事業セグメント等』と明記しており、かつ外部収益が「－」（印字なし）なので、事業ノードとして追加していません。事業の内容の本文も持株会社としての経営指導業務は対価（経営指導料）を得ている旨を述べるのみで、報告セグメントとしての独立した金額開示はありません。
- businessStructure: セグメント損益の前期比％は有報が直接印字した数値ではなく、同じ有報のセグメント注記に印字されている当期・前期の両方の金額から算出したものです（A&Dホロンホールディングス等、既存の掲載企業と同じ手法）。
- businessStructure: 直営美容室運営事業の「20百万円の損失」は桁の小さい数字のため、check-prose-figures.mjs の照合が偶然一致している可能性があります。ただしセグメント注記のセグメント損益列「△20」をそのまま引用したもので、作り話ではありません。
- history: 沿革の年月は崩れておらず（年月1件につき事象文1件の通常の並び）、対応づけの復元は不要でした。
- history: 有報の沿革は約50行の出来事を列挙していますが、すべてを転記すると読者が主要な転換点を追えなくなるため、設立・ブランド変更・持株会社化・上場・市場区分移行・資本提携の開始と解除・海外展開の開始と撤退・大きな店舗数の節目など、現在のAB&Companyを理解するうえで重要な出来事に絞りました。省いたのは主に個別子会社の完全子会社化・吸収合併や、100店舗刻みの店舗数到達の記録（1,000店舗到達のみ残しました）です。
- history: 2025年10月末時点の店舗数（合計1,100店舗、直営447店舗、フランチャイズ653店舗）はbusiness.txtの店舗数推移表から引用し、1,000店舗到達イベントのsignificanceに添えました。
- industry: INDUSTRY_IDS（automotive, semiconductors, electronics, it, finance, trading, food, retail, real-estate, construction, chemicals, pharmaceuticals, transportation, energy, telecommunications, media, entertainment）に、美容室などの個人向け生活サービスを直接表す区分は無い。有報自身は事業を『美容室チェーン』『美容室事業に特化』と書いており、店舗網をもつ個人客向けの事業という点で最も近い既存区分として retail を primary にした。
- industry: retail を採った根拠：掲載済みの店舗チェーン型の企業（エービーシー・マート、ファーストリテイリング等）が retail を primary にしている慣例に揃えた。ただし当社の売上の大半（美容サービス15,746百万円）は商品の販売ではなく施術というサービスの提供で、物販中心の小売とは性質が異なるため、ぴったりの分類ではない。
- industry: 検討して採らなかった区分：entertainment（ホテル業を entertainment に置いた暫定の前例はあるが、美容室は娯楽・観光施設ではない）、real-estate（空中店舗の出店情報などで不動産に触れるが、事業の収益源ではない）、it（HOT PEPPER Beauty を使う集客は手段であって、当社がIT事業を行うわけではない）。
- industry: construction を2つ目に付けた。インテリアデザイン事業は報告セグメントとして独立し、外部収益1,800百万円・セグメント損益67百万円が注記6で開示されている（金額の条件を報告セグメントの単位で満たす）。有報も注記22で『店舗内装工事を請け負っております』と書いており、店舗の内装デザインと施工業者のアレンジを事業として行っている。読者がページ上で確かめられるのはセグメントの金額までで、案件ごとの金額は無い。
- industry: フランチャイズ事業はロイヤリティ収入などを得る本部機能であり、独立した業種ではなく店舗展開（retail の側）の一部として扱った。副業界は付けていない。
- industry: 半導体・IT・金融など他の INDUSTRY_IDS に当たる事業は、有報本文にも事業の内容にも印字されていない。
- relatedCompanies: 掲載企業の一覧（src/data/companies/index.ts、書く直前に読み直した時点で3,828社）の全社名を NFKC で正規化し、「株式会社」「㈱」を落として有報の全文（証拠パックの *.txt と sections.json）と突き合わせた。当たった候補は、ほとんどが一般語の部分一致（キャリア、カバー、ステップ、ビジョン、ランド、スペース、レック、フリー、ベース、CAPITA＝Sunrise Capital の一部）か、役員略歴の前職・出向元（伊藤忠商事、三菱商事、三井物産、パーソルホールディングス、ジャフコグループ、ユナイテッド＆コレクティブ）で、当社との取引・資本関係ではないため結んでいない。
- relatedCompanies: recruit-holdings を supplier として結んだ根拠：事業等のリスク(15)『特定の取引先への依存』が、広告宣伝活動における株式会社リクルート提供の『HOT PEPPER Beauty』への依存度が高いと明記している（調達先としての向きが印字されている）。ただし有報が名指しするのは事業会社の『株式会社リクルート』で、リクルートホールディングスの名前も親子関係も当社の有報には印字されていない。HOT PEPPER Beauty がリクルートホールディングスのサービスであることは、掲載済みのリクルートホールディングスのエントリー（沿革2007年・事業説明）で確認した。当社の有報だけでは親子関係を確かめられないため、needsReview に残した。
- relatedCompanies: 金融機関は結んでいない。株式会社三菱UFJ銀行（シンジケートローンのアレンジャー）、株式会社みずほ銀行、株式会社横浜銀行、株式会社福井銀行、株式会社商工組合中央金庫は、【重要な契約等】にシンジケートローン・借入の貸付人として載っているだけで、資金調達の取引であり、金融取引を超える関係は印字されていない。掲載済みのthe-fukui-bank（株式会社福井銀行）は有報の本文に名前が出るが、貸付人としてだけなので結ばない。
- relatedCompanies: 結べなかった（掲載済みエントリーが無い、または RELATIONSHIP_KINDS で表せない）相手の記録：①Sunrise Capital（Sunrise Capital III, L.P. ほか3ファンド。CLSA Capital Partners がアドバイザー）は2018年3月に資本提携を開始し2023年10月に解消した、LBO方式の株式取得を支えた外部資本。ファンドであり掲載企業ではない。②大株主：株式会社SunFlower（7.2％）、株式会社Logotype（7.2％）、株式会社I.M.C（3.1％）は代表取締役社長・市瀬一浩の資産管理会社、市瀬一浩（3.4％）、丹内悠佑（7.1％）、株式会社MCC（3.4％）、株式会社Kzグループ（1.7％）、AB&Companyグループ取引先持株会（0.3％）、野口洋二（0.3％）、楽天証券株式会社共有口（0.5％）。いずれも掲載企業ではなく、取引の内容も印字されていない。③連結子会社12社（B-first株式会社、株式会社ロイネス、株式会社Puzzle、株式会社agir、株式会社建．LABO、AGU NY, Inc.、J ISLAND Inc.、株式会社BELLTREE、株式会社KESHIKI、株式会社est、株式会社Arose、株式会社SENSE）と休眠中の間接子会社 株式会社RITA は当社グループそのもので、businessStructure で説明済み。④Agu.グループのフランチャイズ加盟法人（39人のオーナー）は個別の社名が印字されていない。
- relatedCompanies: 同業他社（競合）は、事業等のリスク(7)が『多数の競合企業が存在』と書くだけで、社名は印字されていない。同じ業界の掲載企業を same-industry や competitor で結ぶ根拠が有報に無いため、結んでいない（業界は retail だが、物販中心の小売企業と同じ事業ではない）。
- relatedCompanies: HOT PEPPER Beauty の関係は、AB&Company にとっての調達先（広告・予約の経路）として書いた。株式会社リクルートが当社の顧客や出資者であるという記載は無い。
- relatedCompanies: description は RichText を通さない欄なので、リンク記法は使っていない。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: terms 工程は助言のみでエントリーには書き込まない（担当フィールド無し）。requiredTermIds と proposedTerms はここに記録するだけで、アセンブラ（merge-fragments.mjs）が助言工程としての警告を出して無視する想定どおりの動きになる。
- terms: requiredTermIds: businessModel の本文で [[term:segment|セグメント]] と [[term:consolidated-subsidiary|連結子会社]] を使用した。どちらも src/data/terms/（segment.json, consolidated-subsidiary.json）に既存であることを確認済み。
- terms: proposedTerms は franchise と holding-company の2件。いずれも本文の理解に欠かせないが、既存の用語集に無いためリンクはしていない（提案中の用語にはリンクしない規則）。
- terms: IFRS（国際会計基準）は当社の会計基準だが、businessModel などの本文では会計基準の名称を使っていないため requiredTermIds には含めていない。

## 要確認（status に反映）

- industry: INDUSTRY_IDS に美容室・理美容などの生活サービス業に当たる区分が無く、retail を primary にしたのは暫定の分類（売上の大半は物販ではなく施術サービス）。生活サービス業の区分を INDUSTRY_IDS に足すか、retail のままにするかは人の判断を要する。同種の問題は a-tie（industries を空にした例）や abhotel（entertainment を暫定採用した例）でも出ている。
- relatedCompanies: recruit-holdings との supplier の関係：当社の有報が名指しするのは『株式会社リクルート』（HOT PEPPER Beauty の提供元）で、リクルートホールディングスではない。事業会社がリクルートホールディングスの連結子会社であることは当社の有報には印字されておらず、掲載済みのリクルートホールディングスのエントリーが HotPepper Beauty を同社グループのサービスとして書いていることで補った。この親子関係を、有報以外の根拠で確認するか、結ばないでおくかを人が決める必要がある。
