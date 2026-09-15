# Research log — 半導体 industry page and the first 15 terms

- Files: `src/data/industries/semiconductors.ts`, `src/data/terms/*.ts` (15), registries in
  `src/data/industries/index.ts` and `src/data/terms/index.ts`, inline term markup in the five company files.
- Researched and written 2026-09-14 (AI-generated; revision recorded in the industry entry).
- Governing rule: CLAUDE.md invariant 1. Every stage, sentence, placement and definition below is tied to a
  quoted passage. Where a source did not say something, the page does not say it either; those places are
  listed under **Gaps and judgement calls**.

## How the documents were read

- HTML pages were fetched with `curl` (browser User-Agent) on 2026-09-14 and reduced to text.
- **Japanese government PDFs do not extract with the local `pdftotext`**: METI, NEDO and ASBJ PDFs came out
  with no Japanese text at all (the Poppler build has no CJK CMap data). They were read with pdf.js
  (`pdfjs-dist` 4.10.38 with its bundled CMaps) installed in the scratchpad, never in the repository. Page
  numbers below are the printed page numbers, which in these documents equal the PDF page index.
- The two 有価証券報告書 were **not** re-downloaded: the text extractions made for the company entries
  (Sony `r7_q4.txt`, TEL `yuho63q4-raw.txt`, fetched 2026-09-13) were read again on 2026-09-14. Filed reports do
  not change. Sony's PDF returns 403 to a HEAD request without browser headers, as the protocol notes.
- Tokyo Electron's 「半導体を知る」 and nanotec museum glossary page 12 were re-fetched live on 2026-09-14 and the
  quoted sentences confirmed present (a copy from 2026-09-13 existed).

---

## A. The industry page (`semiconductors`)

### Sources

| id | Document | Rank / why it is used |
|---|---|---|
| `meti-supply-policy` | 経済産業省「半導体に係る安定供給確保を図るための取組方針」令和5年1月19日、令和6年3月29日改定、**令和7年5月16日改定** (PDF metadata also 2025-05-16) | Government. The stage structure |
| `nedo-tsc-trend` | NEDO 技術戦略研究センター「TSCトレンド グローバルな半導体競争 ～エコシステム確保をかけて～」(©NEDO 2021; no day given, so no `publishedAt`) | National R&D agency. Which kinds of company do which stage; why the industry is split |
| `seaj-about-semiconductor` | 日本半導体製造装置協会「半導体とは」 | The equipment makers' association. What a semiconductor and 半導体製造装置 are |
| `seaj-process` | 日本半導体製造装置協会「半導体製造工程とは」 | Process detail and equipment per step |
| `tel-about-semiconductor` | 東京エレクトロン「半導体を知る」 | Company page, plain-language definition and uses |
| `tel-yuho-2026` | 東京エレクトロン 有価証券報告書（第63期）, 提出日 2026年6月22日 | TEL placement |
| `sony-yuho-2026` | ソニーグループ 有価証券報告書（2025年度）, 提出日 2026年6月18日 | Sony placement |
| `sony-semicon-group` / `sony-semicon-about` / `sony-semicon-flow` | ソニーセミコンダクタソリューションズグループ「グループ」「会社概要」「開発・設計・生産の取り組み（フロー）」 | Company official pages. Which Sony company does which stage |

### Stages — each one, and the passage that defines it

The chain is METI's. `meti-supply-policy` p.13–14, 「（５）サプライチェーンの構造」:

> 半導体の製造工程は、大別すると、設計・前工程・後工程の３つの工程で構成される。
> 設計工程においては、求められる性能を達成するための回路やレイアウトの設計を行う。専用の設計ツールを用いて回路設計や動作シミュレーションを行い、更に回路パターンを転写するためのフォトマスクも併せて設計する。
> 前工程は、珪石等の原料から製造されるウエハ上に電子回路を形成するまでの部分が該当し、フォトレジスト塗布、露光・現像、エッチング処理、イオン注入、表面平坦化等のプロセスが数十回～数百回繰り返し実施される。回路形成後は、ウエハ上に配線を施し、その後検査装置を用いて、ウエハの導通検査を実施する。
> 後工程では、ウエハを切断し、切り出したチップをリードフレームにボンディングしてワイヤを接続し、エポキシ樹脂等でモールディングする。最後に、外観検査や電気特性検査を実施する。
> なお、半導体の製造に当たっては、工程の数が非常に多いことから、使用する原料等も非常に多く、またそれぞれの品質が半導体の性能に直結するため、原料等は半導体のサプライチェーン上、非常に重要な要素である。
> 以上の工程を経て製造された半導体が、様々な電子機器に組み込まれた形で世の中に行き渡ることになる。半導体の製造に当たっては、サプライチェーンを構成する原料等が必要であるが、一つでも構成要素が欠ければ半導体は製造できず、供給途絶のリスクが増加する。

「原料等」 is defined on p.9: 「その製造に必要な製造装置や部素材、原料（以下「原料等」という。）」.

| # | Category (id) | Supporting passages |
|---|---|---|
| 1 | 設計 (`design`) | METI p.13 (above). 「工場を持たず、設計に専念して製造を外部に任せる会社（ファブレス）」 → NEDO p.28: 「設計専門型 Fabless（ファブレス） 設計を強みとして専念、工場はもたず製造は外部委託、通常販売は自社」 |
| 2 | 製造装置 (`manufacturing-equipment`) | METI p.8「イ 半導体製造装置」: 「後工程を中心に、ダイシング装置、モールディング装置や検査装置等…前工程を中心に、露光装置や、エッチング装置、成膜装置等」; 「半導体製造装置は、製造する半導体のスペックに合わせた綿密な仕様の調整が必要な場合が多いため、基本的に同一製品は存在しない」. What each machine does: SEAJ「半導体とは」「各種の材料膜を形成する装置、写真蝕刻技術を利用して材料膜を形状加工する装置…組立て装置、検査装置」; SEAJ「半導体製造工程とは」「マスクを介し露光してパターンを焼きつける」「エッチングしてレジストのない部分の酸化膜を除去する」; Sony flow page 「ダイシング工程 シリコンウェーハを個々のチップ（ダイ）に切り離します」; METI p.14 「エポキシ樹脂等でモールディングする」 |
| 3 | 部素材・原料 (`materials`) | METI p.6: 「部素材のうち、半導体の回路基板の材料として使用される主要な部素材であるシリコンウエハ」; p.8「ウ 半導体部素材」: 「シリコンウエハや先端パッケージングに用いる基板等…パッケージ用のリードフレームや樹脂等」; p.9「エ 半導体原料」: 「黄リン、ヘリウム、希ガス、蛍石等」; p.14 「工程の数が非常に多いことから、使用する原料等も非常に多く、またそれぞれの品質が半導体の性能に直結する」 |
| 4 | 前工程（回路づくり） (`front-end-process`) | METI p.13–14 (above). 「回路の模様を写し取る露光・現像」 → SEAJ process page (above). 「設計は行わず製造だけを請け負う会社（ファウンドリ）が担うこともあります」 → NEDO p.28 「製造専門型 Foundry（ファウンドリ） 大規模設備投資で高効率工場を構え、設計・販売は行わず製造のみを受託」; p.14 diagram label 「Foundry (Wafer Process)」 |
| 5 | 後工程（組み立て・検査） (`back-end-process`) | METI p.14 (above). 「金属の線でつなぎ」 → SEAJ 「リードフレームとチップを金線で接合する」; 「不良品を取り除きます」 → SEAJ 「電気的特性検査、外観構造検査などを行い不良品を取り除く」; the name's 組み立て・検査 → SEAJ headings 「組立用装置 - 組み立て」「検査用装置 - 試験／検査・マーキング」; 「組み立てと検査を専門に請け負う会社」 → NEDO p.28 「組立専門型 ATP (Assembly/Testing/Packaging) 最終製品化（基板への埋込み等）、テスト、パッケージング専門に受託」 |
| 6 | 電子機器への組み込み (`electronic-devices`) | METI p.14 「様々な電子機器に組み込まれた形で世の中に行き渡る」; TEL「半導体を知る」「スマートフォンやパソコン、家電、自動車から、人工衛星まで、半導体はあらゆるものに使われています」; SEAJ 「半導体は情報の記憶、数値計算や論理演算などの知的な情報処理機能を持っており、電子機器や装置の頭脳部分として中心的役割を果たしています」 |

### Industry `description`, sentence by sentence

1. 「半導体は、電気を通したり通さなかったりする性質をもつ物質や、それを使ってつくった電子部品のことで」 → TEL
   「電気の流れを制御できる物質や、それを使った電子部品のことです。」「半導体は、ある条件では電気を通したり通さなかったりする、スイッチのような働きをします。」.
   「情報の記憶や計算を担い」 → SEAJ 「情報の記憶、数値計算や論理演算などの知的な情報処理機能」.
   「スマートフォンから自動車まで、あらゆる電子機器に組み込まれています」 → TEL (uses, above); METI p.14 「様々な電子機器に組み込まれた形で」.
2. 「回路の設計、ウェーハの上に回路をつくる前工程、チップに切り分けて包む後工程があり、多くの製造装置や材料が欠かせません」 →
   METI p.13–14 (設計・前工程・後工程; 「使用する原料等も非常に多く」; 「一つでも構成要素が欠ければ半導体は製造できず」).
3. 「世界の市場をめぐる競争のなかで分業が進み」 → NEDO p.11 「国際市場の獲得競争の結果、供給側と需要側で国際分業が進んだ。」.
   「設計だけを行う会社、製造だけを請け負う会社、装置や材料をつくる会社など、得意分野の違う企業が国境を越えてつながっています」 →
   NEDO p.28 table (設計専門型 / 製造専門型 / 半導体製造装置産業 / 半導体材料産業) and its caption 「多様な企業が国境を越えて連携・競合、グローバルな水平分業が展開されている。」.

### Company placements

**`tokyo-electron` → 製造装置.**
- `tel-yuho-2026` p.5【事業の内容】: 「当社グループは、当社及び27社の関係会社で構成され、エレクトロニクス技術を利用した半導体製造装置の開発・製造・販売・保守サービスを主な事業の内容としております。…なお、当社グループは「半導体製造装置」の単一セグメントであるため」.
- Independent corroboration, NEDO p.28 row 半導体製造装置産業 (SME): 主なメーカー例 「蘭ASML 米Applied Materials、Lam Research 東京エレクトロン、アドバンテスト スクリーン、日立ハイテク」.
- Consistent with the TEL entry: its product lines (成膜・塗布現像・エッチング・洗浄・ウェーハプローバ) are the 前工程 equipment METI and SEAJ describe. TEL already lists `semiconductors` (primary).

**`sony-group` → 設計, 前工程, 後工程.** Sony already lists `semiconductors`.
- Design and manufacture, from the filing: `sony-yuho-2026` p.139 注記1: 「…静止画・動画カメラ、スマートフォン、イメージセンサー等を開発、設計、制作、製造、提供、販売しています。」
- Which companies: p.8 事業の内容 lists under イメージング＆センシング・ソリューション / イメージセンサー: ソニーセミコンダクタソリューションズ㈱, ソニーセミコンダクタマニュファクチャリング㈱, … Sony Device Technology (Thailand) Co., Ltd.
- 設計: `sony-semicon-group`: 「ソニーセミコンダクタソリューションズ 本社機能、半導体関連製品の研究開発、商品企画、設計、販売を担うグループの中核企業です。」; `sony-semicon-flow` 「STEP 3設計 イメージセンサーとしての機能面（駆動タイミングやインターフェース、画像処理など）の回路設計や、画素の設計や駆動回路、読み出し回路の設計を行います。」
- 前工程: `sony-semicon-flow` 「積層型CMOSイメージセンサーの生産フロー」「ウェーハ工程（前工程）」「基板工程（画素部） 入射光を電荷に変換する「フォトダイオード」やその他素子を、シリコンウェーハに作り込みます。」; `sony-semicon-group` 「ソニーセミコンダクタマニュファクチャリング 半導体製品のプロセス開発、生産を担う企業です。」
- 後工程: `sony-semicon-about` 「Sony Device Technology (Thailand) Co., Ltd. … 事業内容 イメージセンサーの生産（後工程）」; `sony-semicon-flow` lists ダイシング工程, ダイ/ワイヤーボンディング工程, モールド工程, 組立測定工程 under a heading the page itself labels 「ウェーハ工程（後工程）」 (quoted as printed).
- **Limit recorded, not hidden**: the same flow page says 「画素部を作り込んだウェーハと、製造委託した論理回路ウェーハを積層します。」 The logic wafer in Sony's stacked sensors is made by a contractor. The placement says Sony works in these stages, not that it does all of each alone.

---

## B. Terms

Selection: words a reader meets in the five entries and on the industry page, and words the UI prints
(「国際会計基準（IFRS）」 is the label in `financial-section.tsx`; 「非継続事業」 appears in Sony's `revenueBasis`;
有価証券報告書 and 決算短信 are the titles of nearly every source). Descriptions are checked by script: all ≤ 160
characters (longest 103) and at most three sentences.

| id | Term | Sources | Passage(s) |
|---|---|---|---|
| `semiconductor` | 半導体 (はんどうたい) | SEAJ「半導体とは」; METI Journal ONLINE「半導体って何？」(2023-08-25, 経済産業省 広報室); TEL glossary「半導体」 | SEAJ: 「電気を良く通す金属などの「導体」と電気をほとんど通さないゴムなどの「絶縁体」との、中間の性質を持つシリコンなどの物質や材料のことです。ただし、このような半導体を材料に用いたトランジスタや集積回路…も、慣用的に"半導体"と呼ばれています。半導体は情報の記憶、数値計算や論理演算などの知的な情報処理機能を持っており」. METI Journal says the same two sentences. Reading: TEL glossary 「半導体 読み方： はんどうたい」 |
| `semiconductor-manufacturing-equipment` | 半導体製造装置 | SEAJ「半導体とは」 | 「半導体製造装置とは、その名前の通り半導体（集積回路）を製造するために用いられる装置のことです。…たとえば各種の材料膜を形成する装置、写真蝕刻技術を利用して材料膜を形状加工する装置、微量不純物を添加する装置、組立て装置、検査装置などです。」 |
| `wafer` | ウェーハ | TEL glossary「ウェーハ」「シリコン・ウェーハ」 | 「ICを作るための大元の素材となる円板。…ウェーハ上に素子を多数形成して最後にスクライバーという装置で切り出す。」; 「半導体の中心素材で、ケイ素を溶かして99.999999999％の純度のシリコン・インゴットを作り、厚さ1ミリ以下の円板にしたもの。このウェーハに複数の半導体回路を書き込み、切断して半導体チップを製造する。」 |
| `image-sensor` | イメージセンサー | ソニーセミコンダクタソリューションズ「イメージセンサー共通」「グループ」 | 「イメージセンサーは、レンズから入った光を電気信号に変換する「電子の眼」として…」「フィルムカメラでいえばフィルム、人間の眼でいえば網膜に相当するイメージセンサー」; 「イメージセンサーは、スマートフォンやデジタルカメラ、自動車、セキュリティカメラなど、世界中のさまざまな分野で使われており」 |
| `front-end-process` | 前工程 | METI 取組方針 p.13–14; SEAJ 製造工程 | METI 前工程 passage (section A). SEAJ: 「ウェーハプロセス用処理装置 - 素子形成（ウェーハプロセス）・電極形成／ウェーハ検査」 under 前工程 |
| `back-end-process` | 後工程 | METI 取組方針 p.14; SEAJ 製造工程 | METI 後工程 passage (section A); SEAJ 後工程 steps |
| `foundry` | ファウンドリ | NEDO TSCトレンド p.28 | 製造専門型 and 設計専門型 rows (section A) |
| `segment` | セグメント | ASBJ 企業会計基準第17号 (会計基準検索システム, 最終更新日 2026/7/17) | §6 「「事業セグメント」とは、企業の構成単位で、次の要件のすべてに該当するものをいう。（1）収益を稼得し、費用が発生する事業活動に関わるもの…（2）企業の最高経営意思決定機関が、当該構成単位に配分すべき資源に関する意思決定を行い、また、その業績を評価するために、その経営成績を定期的に検討するもの（3）分離された財務情報を入手できるもの」; §19 「企業は、各報告セグメントの利益（又は損失）及び資産の額を開示しなければならない。」 |
| `subsidiary` | 子会社 | ASBJ 企業会計基準第22号 (2024年7月1日までの修正反映版) | §6 「「親会社」とは、他の企業の財務及び営業又は事業の方針を決定する機関（株主総会その他これに準ずる機関…）を支配している企業をいい、「子会社」とは、当該他の企業をいう。」; §7(1) 「他の企業…の議決権の過半数を自己の計算において所有している企業」 |
| `consolidated-subsidiary` | 連結子会社 | 連結財務諸表規則 (e-Gov); JPX 用語集「連結財務諸表」 | 第2条第4号 「連結子会社 連結の範囲に含められる子会社をいう。」 (read via the e-Gov API, law id 351M50000040028); JPX: 「連結財務諸表は、支配・従属関係にある2つ以上の会社からなる企業集団を単一の組織体とみなして、親会社がその企業集団の財政状態及び経営成績を投資家等に対し、総合的に報告するために作成するものです。」 |
| `sogo-shosha` | 総合商社 | 日本貿易会「商社ハンドブック2017」p.32;「商社の強み」;「商社のビジネスモデルと社会的役割」 | p.32 「特に「総合商社」と呼ばれる大手の商社」; 「商社が取り扱っている商品・サービスは多種多様です。」; 「商社の収益の源泉は、伝統的なモノの売買（トレード）に加えて、投資活動の割合が近年大きくなっており、トレードと事業投資を「車の両輪」とする事業ポートフォリオを形成しています。」 |
| `annual-securities-report` | 有価証券報告書 (ゆうかしょうけんほうこくしょ) | JPX 用語集 | 「…金融商品取引法（第24条）に基づき、各事業年度終了後3か月以内に内閣総理大臣への提出を義務づけられている書類のことをいいます。企業の概況、事業の状況、経理の状況等の、投資判断に資するような様々な企業情報が記載されています。なお、…EDINET…を通じて閲覧が可能です。」 |
| `earnings-release` | 決算短信 (けっさんたんしん) | JPX 用語集 | 「上場会社が決算発表及び四半期決算発表を行う際に、決算内容の要点をまとめた書類の名称。」 |
| `ifrs` | 国際会計基準（IFRS） | JPX「IFRSとは」; 金融庁「IFRS関連情報一覧」 | JPX: 「IFRSとは、International Financial Reporting Standardsの略称で、邦訳は国際財務報告基準といいます。IASB（International Accounting Standards Board：国際会計基準審議会）が作成している会計基準です。」「世界共通のモノサシ」「投資情報の比較可能性が高まり」「IFRSを任意適用している会社等の一覧」. 金融庁 page titles use 「国際会計基準（IFRS）」 |
| `discontinued-operations` | 非継続事業 | ASBJ「財務諸表の表示に関する論点の整理」(2009-07-10) §34–35; Sony 有報 p.1, p.140, p.192 | ASBJ §35 「非継続事業の定義について、IFRS 第5号では、既に処分されたか又は売却目的保有に分類されている企業の構成単位であり、かつ以下の要件のいずれかを満たすものをいうとされている。(1) 独立の主要な事業分野又は営業地域の事業を表すこと (2) …処分する、統一された計画の一部であること (3) 転売のみのために取得した子会社であること」; §34 (損益計算書上、単一の金額として開示). Sony p.140 「非継続事業に分類した事業に係る損益は、連結損益計算書において継続事業からの当期純利益の後に、法人所得税控除後の金額で区分表示しています。」; p.192 「金融事業の資産を所有者分配目的で保有する処分グループに分類しました。」 |

---

## C. Inline markup added

Only `description` fields of businesses (including children), history and businessModel; never a company's
one-sentence `description`; at most one occurrence per term per company. Applied by a script that required
each context to occur exactly once and verified that stripping the markup gives back the original file, so
no other character changed.

| Company | Count | Where |
|---|---|---|
| tokyo-electron | 5 | `businesses.semiconductor-production-equipment`: 半導体, 半導体製造装置, セグメント · `new-equipment`: ファウンドリ · `coater-developer`: ウェーハ |
| sony-group | 2 | `businesses.imaging-sensing-solutions`: イメージセンサー · `history.2025.description`: 連結子会社 |
| nintendo | 1 | `history.1980.description`: 連結子会社 |
| toyota | 1 | `history.1998.description`: 子会社 |
| mitsubishi-corporation | 3 | `history.1954.description`: 総合商社 · `history.2000.description`: 子会社 · `businesses.functional-materials`: 半導体 |

The industry `description` also links 半導体, ウェーハ, 前工程, 後工程 and 半導体製造装置 (label 「製造装置」); the
integrity test validates those references. Category descriptions carry no markup: they are rendered as rich
text but the test does not validate references there, so a typo would render silently.

Skipped on purpose:
- TEL `history.1986` 半導体製造装置 — the term is already linked in the business section, which a reader sees first.
- Sony `history.1980` 「CCDイメージセンサー」 — linking イメージセンサー inside the compound would split a product name; the I&SS business carries the link.
- Sony `history.2025` 連結子会社 is linked as 連結子会社, so 子会社 inside it is not linked again.
- MC `businesses.steel-products` 「鉄鋼総合商社」 — a compound; the 1954 history event carries 総合商社.
- MC `history.2020` 子会社 — second occurrence.
- No eligible occurrence in any entry: 有価証券報告書, 決算短信, 国際会計基準（IFRS）, 非継続事業, 前工程, 後工程
  (they appear only in `significance`, flow steps, source titles, UI labels, `revenueBasis` or on the industry page).
  Toyota's セグメント and 持分法 etc. appear only in flow steps, which are not rendered as rich text.

---

## Gaps and judgement calls

1. **Stage order.** The spec's example chain is followed (設計 → 製造装置 → 材料 → 製造 → パッケージ → 最終製品).
   METI does not describe 製造装置 and 部素材・原料 as steps that come after design — it describes them as what the
   manufacturing needs. The two category descriptions say what they feed, so the arrows are not read as "design,
   then equipment".
2. **METI vs SEAJ.** SEAJ's process page lists 半導体設計用装置, マスクレチクル用製造装置 and ウェーハ製造用装置 under
   **前工程**; METI separates 設計 from 前工程. METI (government, current revision) was chosen, and it keeps 設計 as
   its own stage. The 前工程 term is worded so it is true under both: the wafer process is inside 前工程 in each.
3. **Stage names.** 前工程（回路づくり） and 後工程（組み立て・検査） add a plain gloss to METI's names, from METI's
   「ウエハ上に電子回路を形成」 and SEAJ's 組み立て / 試験・検査 headings. 電子機器への組み込み is METI's
   「電子機器に組み込まれた形で」.
4. **No company in 部素材・原料 or 電子機器への組み込み.** Mitsubishi Corporation's entry mentions
   「半導体関連の事業」, but it does not list `semiconductors` and no source places that business in a stage. Sony's
   有報 p.9 says I&SS supplies 「一部のイメージセンサー等」 to the G&NS and ET&S companies, which is not a statement
   about which finished products contain them, so Sony is not placed in 電子機器. Toyota and Nintendo do not list
   `semiconductors`; placing them would need a company-file change outside this task and a source.
5. **Sony in three stages**, with the outsourced logic wafer recorded (section A).
6. **"Why a chain."** The only sourced cause found is NEDO's 「国際市場の獲得競争の結果…国際分業が進んだ」. The
   description gives that and no other reason.
7. **Dated institutional sources.** NEDO's report is from 2021 and ASBJ's 論点整理 from 2009. Only structural
   content was taken from them (business models; the IFRS 5 definition). No market share, ranking or size figure
   from either is on the page. The 2017 JFTC handbook is used only for the phrase 「「総合商社」と呼ばれる大手の商社」;
   its 「日本以外では類を見ない」 was not used because the handbook qualifies it as 「現状では」 in 2017.
8. **総合商社.** JFTC defines 総合商社 only as 「大手の商社」; the trade + investment sentence is JFTC's description
   of 商社 today (its members). Recorded as the closest authoritative definition found.
9. **非継続事業.** ASBJ's summary speaks of 売却目的保有; Sony's financial business was classified as held for
   distribution to owners (有報 p.192). The definition says 「手放すために分けて扱っている」 so that it covers both
   and does not contradict Sony's entry. It does not claim anything about IFRS 5 beyond ASBJ's summary.
10. **国際会計基準（IFRS）.** Named as the company page's financial table labels it and as 金融庁 writes it; JPX
    says the formal translation is 国際財務報告基準 and that IAS 基準 is strictly 国際会計基準, so the definition states
    the formal name.
11. **Readings.** Only 半導体 (TEL glossary), 有価証券報告書 and 決算短信 (JPX) have a `reading`; no source gave one for
    the others, so none is written. Consequence for the glossary page, which sorts by `reading ?? term`: the kanji
    terms without a reading (子会社, 連結子会社, 前工程, 後工程, 総合商社, 非継続事業, 半導体製造装置, 国際会計基準（IFRS）)
    will sort by the kanji rather than by pronunciation.
12. **Spelling.** ウェーハ as Tokyo Electron and Sony write it; METI's ウエハ is quoted as printed. ファウンドリ as METI
    and TEL write it (the Kyushu METI bureau writes ファウンドリー).
13. **Reuse notice.** SEAJ's process page states 「当協会事務局の許可なく、この資料を転載又は複写すること…を禁止します」.
    Nothing was reproduced; the page is paraphrased and cited, as every other source is.
14. **Status.** The industry entry is `published`: every stage, sentence and placement has a quoted source, and the
    gaps above are omissions, not unverified claims.

## Checks

`npx tsc --noEmit -p .` exit 0 · `npx eslint src tests` exit 0 · `npx vitest run` exit 0 (6 files, 129 tests).


---

## Notes carried over from the TypeScript data file (2026-09-15)

Content moved from TypeScript modules to JSON so the local admin editor can edit it safely, and JSON cannot hold comments. Every comment that was in the data file is preserved here verbatim, with the field it sat above and its line number in the last TypeScript version (git history has the original file).

### From `src/data/industries/semiconductors.ts`

- **file header** (line 35):
  > 半導体 — the semiconductor industry as a chain.
  > Every stage, description and placement is traced to a quoted passage in
  > `docs/research/industry-semiconductors-and-terms.md`.
  > Things a future editor could easily "fix" wrongly:
  > - The stages are 経済産業省's, not a textbook's. The 取組方針 (p.13–14,
  >   「サプライチェーンの構造」) splits making a semiconductor into 設計・前工程・後工程,
  >   says the manufacturing needs 製造装置・部素材・原料 (p.8–9, together 「原料等」),
  >   and ends with the chips 「様々な電子機器に組み込まれた形で世の中に行き渡る」.
  >   Those are the six categories below. Four are STAGES in METI's order
  >   (設計 → 前工程 → 後工程 → 電子機器への組み込み). 製造装置 and 部素材・原料 are
  >   INPUTS (`role: "input"`): METI describes them as what the manufacturing
  >   needs, not as steps after design. The spec's example chain puts them in the
  >   sequence; drawing arrows through them would teach an order that does not
  >   exist, so they are drawn beside the chain instead (decisions JCE-014).
  > - SEAJ draws the line differently: its process page lists 設計, mask making
  >   and wafer making UNDER 前工程. METI's split is used because it is the
  >   government's and because it keeps 設計 visible as its own stage; the
  >   difference is recorded in the log, not hidden.
  > - Sony Group appears in three stages on purpose. Sony's own semiconductor
  >   site shows it designing image sensors, running the wafer process
  >   (ウェーハ工程（前工程）) and, through a Thai subsidiary, the 後工程. That page
  >   also says the logic-circuit wafer stacked into its sensors is made by an
  >   outside contractor (製造委託), so Sony is not placed as doing everything.
  > - No company is placed in 部素材・原料 or 電子機器への組み込み. None of the
  >   published companies that list `semiconductors` has a source placing it
  >   there, and a company that does not list the industry cannot be placed
  >   (the integrity test rejects it).
- **companyIds** (line 53):
  > Sony: 有報 p.139 「イメージセンサー等を開発、設計、制作、製造」; its semiconductor
  > site names ソニーセミコンダクタソリューションズ as the group's 設計 company.
- **companyIds** (line 64):
  > Sony: its semiconductor site's 生産フロー 「ウェーハ工程（前工程）」, carried out by
  > ソニーセミコンダクタマニュファクチャリング, a subsidiary the 有報 (p.8) lists under I&SS.
- **companyIds** (line 75):
  > Sony: Sony Device Technology (Thailand) 「イメージセンサーの生産（後工程）」
  > (sony-semicon.com), a subsidiary the 有報 (p.8) lists under I&SS.
- **companyIds** (line 95):
  > Tokyo Electron: 有報 p.5 「半導体製造装置の開発・製造・販売・保守サービス」, and
  > NEDO lists 東京エレクトロン under 半導体製造装置メーカー.
- **status** (line 188):
  > Every stage and placement is sourced; the judgement calls (stage order,
  > METI vs SEAJ split, Sony's outsourced logic wafer) are recorded in the log
  > and none leaves an unverified claim on the page.

### From `src/data/terms/annual-securities-report.ts`

- **file header** (line 8):
  > 有価証券報告書. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > JPX glossary definition, reading included.

### From `src/data/terms/back-end-process.ts`

- **file header** (line 8):
  > 後工程. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > METI's description of 後工程, with SEAJ's 組み立て / 試験・検査 split.

### From `src/data/terms/consolidated-subsidiary.ts`

- **file header** (line 9):
  > 連結子会社. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > The regulation's own definition (連結財務諸表規則 第2条第4号), with JPX's definition of 連結財務諸表 for what
  > 連結 means.

### From `src/data/terms/discontinued-operations.ts`

- **file header** (line 10):
  > 非継続事業. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > IFRS 5's definition as ASBJ summarises it (§34–35). 「手放すために分けて扱っている」 covers both 売却目的保有
  > (ASBJ) and the 所有者分配目的で保有する処分グループ Sony's 有報 describes, so Sony's spin-off does not
  > contradict the definition.

### From `src/data/terms/earnings-release.ts`

- **file header** (line 8):
  > 決算短信. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > JPX glossary definition, reading included.

### From `src/data/terms/foundry.ts`

- **file header** (line 9):
  > ファウンドリ. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > NEDO's table of semiconductor business models (p.28). Spelled ファウンドリ as METI and Tokyo
  > Electron write it.

### From `src/data/terms/front-end-process.ts`

- **file header** (line 10):
  > 前工程. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > METI's split (設計・前工程・後工程). SEAJ also counts design, mask making and wafer making as 前工程; the
  > wafer process is central in both, so the definition names only that. No reading: no source
  > gives one.

### From `src/data/terms/ifrs.ts`

- **file header** (line 9):
  > 国際会計基準（IFRS）. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > Named as the company financial table labels it and as 金融庁 writes it; JPX notes the formal
  > translation is 国際財務報告基準, so the definition says so.

### From `src/data/terms/image-sensor.ts`

- **file header** (line 8):
  > イメージセンサー. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > Sony's own semiconductor site: Sony Group is the published company that makes them.

### From `src/data/terms/segment.ts`

- **file header** (line 9):
  > セグメント. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > ASBJ Statement No.17 §6 (事業セグメント) and §19 (profit disclosed per 報告セグメント). The chief
  > operating decision maker is written as 経営者 for a beginner.

### From `src/data/terms/semiconductor-manufacturing-equipment.ts`

- **file header** (line 9):
  > 半導体製造装置. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > SEAJ is the equipment makers' own association; its definition lists the kinds of equipment
  > in plain words. No reading: no source gives one.

### From `src/data/terms/semiconductor.ts`

- **file header** (line 9):
  > 半導体. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > Defined the way SEAJ and METI both define it: the material first, then the customary use of
  > the word for chips. The reading is the one Tokyo Electron's glossary gives.

### From `src/data/terms/sogo-shosha.ts`

- **file header** (line 9):
  > 総合商社. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > 日本貿易会 (JFTC) is the trading companies' association. It calls 総合商社 「大手の商社」 (handbook p.32);
  > the trade + investment description is its current account of 商社.

### From `src/data/terms/subsidiary.ts`

- **file header** (line 9):
  > 子会社. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > ASBJ Statement No.22 §6–7. The majority-of-voting-rights case is the example because it is
  > the first one the standard lists.

### From `src/data/terms/wafer.ts`

- **file header** (line 9):
  > ウェーハ. Source passages: docs/research/industry-semiconductors-and-terms.md.
  > Spelled ウェーハ as Tokyo Electron and Sony write it (METI writes ウエハ). The thickness is the
  > silicon-wafer entry's 「厚さ1ミリ以下」.
