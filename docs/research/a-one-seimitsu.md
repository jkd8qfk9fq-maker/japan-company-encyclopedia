# エーワン精密 — research log

Registered: 2026-10-01（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エーワン精密 |
| 証券コード | 6156 |
| docID | `S100WQRX` |
| 提出日 | 2025-09-29 |
| 決算期 | 2025-06-30 |
| 訂正報告書 | なし |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100WQRX.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エーワン精密 / 6156 / docID S100WQRX（id は英語表記「A-ONE SEIMITSU INC.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 7 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 5 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 5 件） |
| sourceValidation | completed | 1 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 1 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
a-one-seimitsu: 10 件の数値を有報XBRLと照合
有報: 株式会社エーワン精密 有価証券報告書－第35期(2024/07/01－2025/06/30) (docID S100WQRX)
前期有報との比較: 20 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 15 件を照合
注意: employees が5年表に見当たらない。有報が実際に掲げていない項目であれば空欄のままでよい（銀行は営業利益を出さない等）。ログにその旨を書くこと
注意: セグメント情報のテキストブロックがない（US GAAP採用会社に多い）。セグメント別の売上・利益は md-and-a.txt に記載されているので、そこから採り、ログにその旨を書くこと
すべて一致しました。
a-one-seimitsu: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: description（会社の一文説明）は74文字、句点1つで、CNC自動旋盤・マシニングセンター等の工作機械で使う工具を供給する精密部品メーカーである点を要約した。
- businessModel: businessModel.flow の profit 段階は経常利益（119,781千円、前期比33.1％減）と当期純損失（221,288千円、前期は120,523千円の純利益）の両方を書いた。有価証券報告書が『切削工具部門で...部門損益がマイナスとなったため、固定資産の減損を行い特別損失を計上いたしました』と明記しており、経常利益は前期より悪化したがなお黒字、純損失は一過性の減損による特別損失が主因という構造を読者に伝えるために両方必要と判断した。
- businessModel: customer 段階の『販売高で10％を超える主要な販売先はありません』は md-and-a.txt の販売実績の注1の印字どおり。会社名を名指しできる顧客は有報に記載がないため、業態（CNC自動旋盤・カム式自動旋盤を保有する機械加工業者）と輸出統計で説明した。
- businessModel: 輸出比率9.6％（前期8.5％）は md-and-a.txt の『c. 販売実績』注2の合計行から採った。絶対額153,257千円は当初書いたが、有報の表では単位（千円）が列ヘッダーにのみ印字され、セルには『153,257(9.6％)』としか印字されていないため、千円額としての逐語照合ができず check-prose-figures.mjs で落ちた。docs/pipeline.md の『書き換えたくなったら、金額をあきらめて印字されている増減率を使うのが正解』に従い、絶対額を書かず比率（9.6％、前期8.5％）だけを本文に残した。
- businessModel: revenue 段階の部門別売上高（コレットチャック部門1,106,068千円、切削工具部門470,433千円、自動旋盤用カム部門14,344千円）は、businessStructure工程がbusinessesの並び順の根拠として引いた同じmd-and-a.txtの『c. 販売実績』の数値と一致させた。
- businessModel: businessModel.description の『供給メーカーが少なくなるなかでも...祖業として供給責任を果たすために継続』は business.txt の自動旋盤用カム部門の説明（『カムの供給メーカーがほとんどなくなりましたが、当社の祖業であり...できる限りメーカーの供給責任を果たすために事業を継続しております』）をそのまま要約したもので、businessStructure工程のcollet-chuck部門の説明と矛盾しない。
- businessModel: リンク記法は使わなかった。src/data/terms/ の既存16語はいずれも半導体・商社・会計関連で、コレットチャック・自動旋盤・マシニングセンター等この工程の本文に合う語がなく、提案中の用語にはリンクできない（検証で落ちるため）。
- businessModel: sources は sourceSchema（strictObject）に合わせ、kind キーは入れていない。
- businessStructure: docID S100WQRX をevidence/a-one-seimitsu/summary.json・brief.mdで確認し、本工程のソースとして使用した（会社名は株式会社エーワン精密、依頼文にあった『エー・オー・ジー精密』ではない）。
- businessStructure: businesses の並び順は、セグメント情報のテキストブロックが有報にない（当社は非連結・単体決算のため）ため、md-and-a.txt の『c. 販売実績』（当事業年度）の金額で決定した：コレットチャック部門1,106,068千円 > 切削工具部門470,433千円 > 自動旋盤用カム部門14,344千円。この並びは【事業の内容】(business.txt)がa・b・cの順で説明する並びとも一致している。3部門とも segment-overview.txt が『上記３事業を報告セグメントとしております』と明記しており、除外すべき区分はない。
- businessStructure: children は使わなかった。切削工具部門については business.txt が『市販切削工具の再研磨』と『別注切削工具の製作・販売、再研磨』という2つの活動を説明しており、md-and-a.txt にもそれぞれの売上高（別注切削工具144,814千円、市販切削工具の再研磨325,618千円、合計470,432千円≒セグメント売上高470,433千円、丸めによる1千円のずれ）が書かれているが、富士電機の『分野』や横河電機の『サブセグメント』のように会社自身が名指しした区分構造ではなく、MD&Aの文中で売上高の言及順も business.txt の説明順と逆（MD&Aは別注→市販、business.txtは市販→別注）で一貫していないため、Business の children にはしなかった。レビューの参考までにこの数値をここに残す。
- businessStructure: shortNameEn は書かなかった。表紙・DEIにある英訳名は『A-ONE SEIMITSU INC.』のみで、それ以外の英語表記（ロゴ・ワードマーク相当の短縮名）は証拠パック内に見当たらない。掲載済みエントリーでも『〇〇 Inc.』型の英訳名を持つ会社の多くは shortNameEn を書いておらず（AGC・ANA・CANON などブランド名そのものが英訳名と別にある会社のみ shortNameEn を持つ）、この慣例に合わせてキー自体を省略した（null ではなく省略）。
- businessStructure: name『エーワン精密』は officialName『株式会社エーワン精密』から法人格（株式会社）を除いたもの。既に figures-only で登録済みの src/data/companies/a-one-seimitsu.json の name も同じ値になっている。
- businessStructure: listings の market は、表紙『上場金融商品取引所名又は登録認可金融商品取引業協会名』が『東京証券取引所スタンダード市場』と取引所名だけでなく市場区分（スタンダード市場）まで印字しているため記載した。
- businessStructure: sources は sourceSchema（strictObject）に合わせ、存在しない kind キーは入れていない。
- history: 沿革の形式：『年月／沿革』の標準形で、年月トークンは22件、各年月の直後に事象文が1つずつ続く（『〃』や年月セルのまとまりによる崩れはない）。位置対応ではなく表の構造そのものとして読めるため、対応づけの復元は不要だった。
- history: 22件の沿革から8件を採用した。採用基準は、現在の3事業部門（コレットチャック・切削工具・自動旋盤用カム）それぞれの起点、当社（提出会社）自体の設立の経緯、現在の上場区分（東証スタンダード市場）に至る経緯のいずれかに直接つながる出来事であること。
- history: 省いた事象と理由：本社・工場の建設・移転（1971年5月、1974年6月、1990年4月第2工場、1996年11月第3工場、1998年3月本社建設移転、1999年6月第4工場、2001年3月第5工場、2004年7月山梨第2工場改修、2009年8月第1工場建設）は住所・設備の変更のみで事業構造と無関係のため省いた。1980年2月の『有限会社→株式会社』改組は、1990年の事象の significance 内で旧・株式会社エーワン精密として要約している。2003年3月の店頭登録と2010年4月の大阪証券取引所JASDAQ市場上場は、それぞれ2004年・2013年の上場関連の事象の description に経緯として含め、独立した項目にはしなかった。
- history: 最重要の論点：有報の沿革は『当社は1990年７月に設立し、旧株式会社エーワン精密...の事業のすべてを営業譲受しております』と明記しており、当社（現在の提出会社・株式会社エーワン精密）は1990年7月設立の法人である。1970年の設立から1990年までの記述はすべて、事業を譲り受けた別法人（旧・株式会社エーワン精密、そのまた前身の有限会社エーワン精密）についてのものであり、連続した単一法人の沿革ではない。この区別を1970年と1990年の各事象の significance に明記した。
- history: sourceIds はすべて yuho-2025（docID S100WQRX）。沿革本文は history.txt、1990年の事業譲渡の経緯の裏付けは history.txt 冒頭の記述そのもの。
- industry: INDUSTRY_IDS（src/types/company.ts）には工作機械・機械部品に対応する分類（『machinery』等）が存在しない。閉じた集合の中で最も近いのは electronics で、これは掲載済みエントリーの慣例（ファナック＝CNC・ロボットのメーカーを electronics に分類、SMC＝空気圧制御機器のメーカーを electronics に分類）に倣った判断である。
- industry: ただしこの判断には留保がある。当社の製品（コレットチャック・切削工具・自動旋盤用カム）は純粋に機械的な工作機械用工具で、ファナックやSMCのような電子制御・電気制御の要素を持たない。有報のどこにも『電子』『電気』に類する言葉で自社の製品を説明した記載はなく、business.txt は一貫して機械的な構造（棒状材料の切削、カムによる機械的な形状制御）として説明している。electronics への分類は『工作機械・工具関連の会社をこのタクソノミーでどこに置くか』という既存の慣例を当社にも当てはめたものであり、当社の事業内容そのものから直接導かれる分類ではない。
- industry: 同業の比較対象（TSUGAMI・OKUMA・牧野フライス製作所・THK・NSK・NTN・JTEKT・不二越・シチズンマシナリー等）はいずれも src/data/companies/ に figures-only で存在するのみで、industries が未確定（空配列）だった。これらが解説工程を通過して分類が決まった段階で、工作機械・工具関連の会社に共通する慣例が確立する可能性が高く、その時点で当社の分類も合わせて見直す価値がある。
- industry: 業界ページの金額確認条件（『報告セグメントの単位で開示されている』）は満たしている。当社は非連結・単体決算で、segment-overview.txt が明記するとおりコレットチャック部門・切削工具部門・自動旋盤用カム部門の3部門すべてが報告セグメントであり、md-and-a.txtに部門別の売上高・セグメント利益が開示されている。
- industry: 半導体向けの部材・装置としての開示は有報のどこにもないため semiconductors は付けなかった（md-and-a.txt は『AIやその関連分野の増加で、半導体、電子部品などは堅調に推移しました』と市場環境の文脈でのみ半導体に触れており、当社自身の事業説明ではない）。
- relatedCompanies: relatedCompanies は空のまま提出する。以下の3つの開示をすべて確認したうえでの判断である。
- relatedCompanies: （1）【関係会社の状況】（affiliates.txt）は『該当事項はありません』——子会社・関連会社が存在しない。
- relatedCompanies: （2）【株式の保有状況】②『保有目的が純投資目的以外の目的である投資株式』（政策保有株式）も『該当事項はありません』——当社が保有する投資株式（非上場株式以外23銘柄、貸借対照表計上額93,813千円）はすべて③に区分される『純投資目的である投資株式』で、取引関係や業務提携の目的を伴う保有ではない。docs/pipeline.md が注意を促す政策保有株式の表自体がこの会社には存在しないため、supplier/customer/business-partner のいずれも導けない。
- relatedCompanies: （3）md-and-a.txt『c. 販売実績』の注1は『販売高で10％を超える主要な販売先はありません』と明記しており、取引の向きが分かる名指しの顧客企業が有報に存在しない。同じ注の輸出統計（アジア各国向け）も国・地域単位の金額で、相手先企業名ではない。
- relatedCompanies: 【大株主の状況】（MajorShareholdersTextBlock）は別途確認した。筆頭株主は株式会社致知（東京都府中市八幡町一丁目４－１（紅富士ハイツ内）、所有割合25.27％）だが、これは当社株式を保有する側（資本関係の相手）であり、取引関係や事業上の協業を示す記述は一切ない。住所がマンション名を含む私的な住所表記であることから資産管理会社である可能性が高く、有報は保有目的や取引内容を何も書いていないため、relatedCompanies のどの関係種別にも分類できない。src/data/companies/index.ts にも該当する企業は見当たらなかった（結べなかった相手として記録のみ残す）。
- relatedCompanies: relatedCompanies を書くにあたり src/data/companies/index.ts を直前に再読した（2026-10-01時点）が、上記の理由により結べる相手は0件だった。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: この工程は助言のみで、companySchemaにrequiredTermIds・proposedTermsという項目はない。書いても組み立て時に捨てられ、捨てた旨の警告が出るのは想定どおり（docs/pipeline.mdのterms工程の説明のとおり）。
- terms: requiredTermIdsの2件：annual-securities-report（有価証券報告書）は本工程・他の全工程が唯一の出典として使っているyuho-2025の性格を説明する語。segment（報告セグメント）はコレットチャック部門・切削工具部門・自動旋盤用カム部門の3部門がすべて報告セグメントである（segment-overview.txtが明記）ことを理解する前提になる語。
- terms: 既存16語（annual-securities-report以外）のうち、semiconductor・semiconductor-manufacturing-equipment・wafer・foundry・front-end-process・back-end-process・image-sensorは半導体業界の語でこの会社には不要。sogo-shoshaは商社の語で不要。consolidated-subsidiary・subsidiaryは不要（affiliates.txtが『該当事項はありません』と明記しており、当社に子会社・関連会社はない）。ifrsは不要（会計基準は日本基準）。discontinued-operations・earnings-releaseも本件の有報に該当する記載がなく不要。
- terms: 会社の規模に見合うよう、提案は3件（コレットチャック・自動旋盤・マシニングセンター）に留めた。ガイドブッシュはコレットチャックと同じ段落で構造が似た工具として説明されるため独立した語にせず、再研磨（切削工具の再研磨）はbusinessStructure工程の説明文中ですでに平易に説明されているため見送った。
- terms: 自動旋盤の用語は本来CNC自動旋盤とカム式自動旋盤を分けて2語にする案も検討したが、両者の対比そのものが会社の事業構造を説明する核心のため、1語の中で対比して説明する形にまとめた（会社規模とのバランスを考慮）。

## 要確認（status に反映）

- industry: industryId の選定（electronics、primary）は閉じたタクソノミーに工作機械・精密機械部品に対応する分類がないための次善の判断であり、人による確認を推奨する。同業の工作機械・工具メーカー（TSUGAMI・OKUMA・THK・NSK等）が解説工程を通過した時点で、それらとの整合性も含めて見直すこと。
