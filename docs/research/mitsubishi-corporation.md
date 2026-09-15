# 三菱商事 — research log

Researched: 2026-09-13 (documents downloaded and read) · prior-year 有報 read, entry re-verified and finalized 2026-09-14

Page numbers are the **printed** page numbers (the `― n ―` footer). For `yuho-2026` the printed page is PDF page
index − 4 (PDF p.4 = 表紙, PDF p.5 = p.1). Text was extracted with `pdftotext -enc UTF-8` (the default
Latin-1 output drops every Japanese character) in `-layout`, `-raw` and `-table` modes. `-layout` misaligns
columns on p.3 (沿革 dates vs events), p.144 and p.177, so no value was taken from `-layout` alone. Unlike the
Toyota entry, page images **were** checked visually: single pages were cut out with `pypdf` and read as
rendered PDF pages (有報 p.1, 2, 3, 4–10, 14, 46, 121, 143, 144, 177, 181, cover; 1Q 短信 segment pages).

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書 第25期 2025年度（自 2025年4月1日 至 2026年3月31日）, 提出日 2026年6月12日. Confirmed latest: the IR page「有価証券報告書」(https://www.mitsubishicorp.com/jp/ja/ir/library/fstatement/) lists it as「最新の報告書」 | https://www.mitsubishicorp.com/jp/ja/ir/library/fstatement/pdf/2025_04/y2025_04.pdf | 表紙, 1, 3, 4, 5, 6, 9, 10, 11, 13, 14, 33, 36, 46, 121, 131, 137, 138, 143, 144, 177, 178, 181, 211 |
| — (not in `sources`) | 有価証券報告書の訂正報告書, 2026年6月18日. Corrects only 第4 5 (2) 3.「多様性に関する指標」: 男性育児休業取得率 52.6% → 171.7%. Touches no field used here, so it supports no claim and is not listed in the entry's `sources` | https://www.mitsubishicorp.com/jp/ja/ir/library/fstatement/pdf/2025_04/y2025_04_correct260618.pdf | 1 |
| `yuho-2025` | 有価証券報告書 2024年度（自 2024年4月1日 至 2025年3月31日）, 提出日 2025年6月18日. Used for the restatement check | https://www.mitsubishicorp.com/jp/ja/ir/library/fstatement/pdf/2024_04/y2024_04.pdf | 1 |
| `tanshin-2026` | 2026年3月期 決算短信〔IFRS〕（連結）, 2026年5月1日 | https://www.mitsubishicorp.com/jp/ja/ir/library/earnings/pdf/202605j.pdf | PDF p.1 |
| `tanshin-2027-q1` | 2027年3月期 第1四半期決算短信〔IFRS〕（連結）, 2026年8月6日 (first disclosed 2026年8月3日; the 8月6日 version adds the review report, "変更はありません") | https://www.mitsubishicorp.com/jp/ja/ir/library/earnings/pdf/202608j.pdf | PDF p.1, p.15, p.16 (printed) |
| `tanshin-2026-q1` | 2026年3月期 第1四半期決算短信〔IFRS〕（連結）, 2025年8月7日 (first disclosed 2025年8月4日) | https://www.mitsubishicorp.com/jp/ja/ir/library/earnings/pdf/202508j.pdf | p.15 (printed) |
| `presentation-2026` | 2025年度決算及び2026年度見通し 決算説明会資料, 2026年5月1日 | https://www.mitsubishicorp.com/jp/ja/ir/library/meetings/pdf/260501/20260501j.pdf | PDF p.12, 13 (footnote (*)), 21 (補足) |
| `official-group-energy-power-solution` | 公式サイト「エネルギー&パワーソリューショングループ｜事業紹介」(undated page) | https://www.mitsubishicorp.com/jp/ja/about/business-group/energy-power-solution/ | 組織, 主な事業会社 |
| `official-group-mineral-resources` | 公式サイト「金属資源グループ｜事業紹介」 | https://www.mitsubishicorp.com/jp/ja/about/business-group/mineral-resources/ | 組織, 主な事業会社, Our Projects |
| `official-group-materials-solution` | 公式サイト「マテリアルソリューショングループ｜事業紹介」 | https://www.mitsubishicorp.com/jp/ja/about/business-group/materials-solution/ | 組織, 主な事業会社 |
| `official-group-smart-life-creation` | 公式サイト「S.L.C.グループ｜事業紹介」 | https://www.mitsubishicorp.com/jp/ja/about/business-group/smart-life-creation/ | 組織, 主な事業会社 (see gap 12 on commented-out HTML) |
| `official-group-food-industry` | 公式サイト「食品産業グループ｜事業紹介」 | https://www.mitsubishicorp.com/jp/ja/about/business-group/food-industry/ | 組織, 主な事業会社 |
| `official-group-social-infrastructure` | 公式サイト「社会インフラグループ｜事業紹介」 | https://www.mitsubishicorp.com/jp/ja/about/business-group/ud-infrastructure/ | 組織, 主な事業会社 |
| `official-group-mobility` | 公式サイト「モビリティグループ｜事業紹介」 | https://www.mitsubishicorp.com/jp/ja/about/business-group/mobility/ | 組織, 主な事業会社 |
| `official-history-explore` | 公式サイト「MCの「歴史」を知る｜Explore MC」(undated) | https://www.mitsubishicorp.com/jp/ja/explore/history/ | トレーディング期 / トレーディング発展期 / 事業投資期 / 事業経営期, and the year lists |
| `official-history-roots-01` | 公式サイト「あゆみ 1954年～【第1話】」 | https://www.mitsubishicorp.com/jp/ja/about/history/roots/1954-vol01.html | full page |
| `official-history-roots-07` | 公式サイト「あゆみ 1954年～【第7話】」 | https://www.mitsubishicorp.com/jp/ja/about/history/roots/1954-vol07.html | full page |

Consulted, not used for any claim: 公式サイト「事業紹介」top page (confirms「7つの営業グループ」「7グループ体制」), 公式サイト「沿革」(https://www.mitsubishicorp.com/jp/ja/about/history/, see gap 13), 統合報告書 2025年9月発行 listing page (see gap 14), 2027年3月期 1Q 決算説明会資料 (restatement footnotes only).

## Financials

Source table: `yuho-2026` p.1「1【主要な経営指標等の推移】(1) 連結経営指標等」. Columns are labelled by the company as
回次「2021年度」…「2025年度」 with 決算年月「2022年3月」…「2026年3月」. Row labels as printed: **収益** and
**当期純利益（当社の所有者に帰属）** (printed on two lines:「当期純利益」／「（当社の所有者に帰属）」). Unit 百万円.
Stored value = printed × 1,000,000. 注1「当社は、国際会計基準（以下、IFRS）に準拠して連結財務諸表を作成しています。」

| fiscalYear | revenue (as printed, unit) | netIncome (as printed, unit) | Standard | Document · page | 短信 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (2021年度) | 17,264,828 百万円 → 17,264,828,000,000 円 | 937,529 百万円 → 937,529,000,000 円 | IFRS | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2023年3月期 (2022年度) | 21,571,973 百万円 → 21,571,973,000,000 円 | 1,180,694 百万円 → 1,180,694,000,000 円 | IFRS | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2024年3月期 (2023年度) | 19,567,601 百万円 → 19,567,601,000,000 円 | 964,034 百万円 → 964,034,000,000 円 | IFRS | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2025年3月期 (2024年度) | 18,617,601 百万円 → 18,617,601,000,000 円 | 950,709 百万円 → 950,709,000,000 円 | IFRS | yuho-2026 p.1; identical in yuho-2025 p.1 | Matches tanshin-2026 prior-year row: 収益 18,617,601 / 親会社の所有者に帰属する当期利益 950,709 |
| 2026年3月期 (2025年度) | 18,915,995 百万円 → 18,915,995,000,000 円 | 800,460 百万円 → 800,460,000,000 円 | IFRS | yuho-2026 p.1 | **Matches** tanshin-2026: 収益 18,915,995 百万円, 親会社の所有者に帰属する当期利益 800,460 百万円. No difference |

**Restatement check.** yuho-2025 p.1 (回次 2020年度–2024年度) prints 収益 12,884,521 / 17,264,828 / 21,571,973 /
19,567,601 / 18,617,601 and 当期純利益（当社の所有者に帰属） 172,550 / 937,529 / 1,180,694 / 964,034 / 950,709.
The four overlapping years are identical to yuho-2026. No restatement between the two filings.

**Verification performed 2026-09-14.** A script imported `src/data/companies/mitsubishi-corporation.ts` and
compared every stored value ÷ 1,000,000 with the rows parsed from: yuho-2026 p.1 in `-layout`, `-raw` and
`-table` modes (all 10 equal in all three); yuho-2025 p.1 in `-layout` and `-raw` (8 overlapping values equal in
both); tanshin-2026 PDF p.1 in `-raw` and `-table` (both years, 収益 and 親会社の所有者に帰属する当期利益,
equal in both). The 短信 column order was confirmed from the `-table` header: 収益 / 税引前利益 / 当期利益 /
親会社の所有者に帰属する当期利益 / 当期包括利益合計額. The p.1 table was also read as a rendered page image.

Not used: 当期利益 including non-controlling interests (916,726 百万円 for 2026年3月期, yuho-2026 p.121) — the
protocol requires the parent-attributable figure.

## Segment ordering

**Structure used: the 7 営業グループ in force since 2026-04-01.** See gap 1 for why this is not the 8 reportable
segments of the 2026年3月期 セグメント情報.

Revenue source: `yuho-2026` p.177 注記24「(1) 顧客との契約から認識した収益の分解」当連結会計年度, row「合計」, 単位：百万円
(note 6 on p.144 refers revenue to note 24). Script check: the 8 segment totals sum to 18,907,496 (printed「合計」),
and + その他 8,539 + 調整・消去 △40 = 18,915,995 (printed「連結金額」).

| Segment (7-group structure) | Segment revenue 2026年3月期 (as printed) | Document · page |
|---|---|---|
| エネルギー＆パワーソリューション | **4,586,279 — computed**, = 地球環境エネルギー 3,267,295 + 電力ソリューション 1,318,984 | yuho-2026 p.177 (both inputs); additivity evidence below |
| 金属資源 | 4,083,329 | yuho-2026 p.177 |
| マテリアルソリューション | 3,631,197 | yuho-2026 p.177 |
| S.L.C. | 2,514,143 | yuho-2026 p.177 |
| 食品産業 | 2,324,535 | yuho-2026 p.177 |
| 社会インフラ | 930,638 | yuho-2026 p.177 |
| モビリティ | 837,375 | yuho-2026 p.177 |

**Additivity evidence (the merger changed no other group's perimeter).** tanshin-2027-q1 p.15 restates
2026年3月期 1Q under the 7 groups. tanshin-2026-q1 p.15 reports the same quarter under the 8 groups:

| Item | 地球環境エネルギー + 電力ソリューション (original) | エネルギー&パワーソリューション (restated) |
|---|---|---|
| 収益 1Q | 749,227 + 245,472 = 994,699 | 994,699 |
| 売上総利益 1Q | 25,895 + 36,946 = 62,841 | 62,841 |
| 持分法による投資損益 1Q | 39,218 + 2,559 = 41,777 | 41,777 |
| 当社の所有者に帰属する四半期純利益 1Q | 40,913 + △1,582 = 39,331 | 39,331 |
| 資産合計 2026年3月末 | 3,339,191 + 2,739,770 (yuho-2026 p.144) = 6,078,961 | 6,078,961 |

The other six groups' restated 1Q 収益 (871,625 / 793,123 / 201,007 / 196,473 / 545,836 / 613,251) and
2026年3月末 資産合計 are unchanged from the original figures. Robustness: without the computed sum,
地球環境エネルギー alone (3,267,295) would rank third, behind 金属資源 and マテリアルソリューション.
For reference only (not used): 2027年3月期 1Q 収益 orders the groups differently (金属資源 1,396,195 >
エネルギー&パワーソリューション 1,061,799 > マテリアルソリューション 979,438 > 食品産業 671,347 > S.L.C. 621,641 >
モビリティ 252,134 > 社会インフラ 195,916). That is one quarter, so it was not used for ordering.

Segment profit, log only (invariant 4 — no amounts or ranking on the page): yuho-2026 p.144 当連結会計年度
「当社の所有者に帰属する当期純利益」: 地球環境エネルギー 160,862 / マテリアルソリューション 26,348 / 金属資源 204,523 /
社会インフラ 85,124 / モビリティ 57,609 / 食品産業 83,257 / S.L.C. 91,007 / 電力ソリューション 43,408 百万円.
The two merged groups sum to 204,270, only 253 below 金属資源. presentation-2026 also restates 2025年度 segment
profit for a revised internal interest-charge system (「社内金利賦課制度の見直し」). No profit ranking is stated
in the entry.

## Claims

### Identity

- `code` 8058 → tanshin-2026 PDF p.1「コード番号 8058」; tanshin-2027-q1 PDF p.1「（コード：8058、東証プライム市場）」.
- `officialName` 三菱商事株式会社 → yuho-2026 表紙【会社名】(read as page image).
- `nameEn` Mitsubishi Corporation → yuho-2026 表紙【英訳名】「Mitsubishi Corporation」(mixed case as printed).
- `shortNameEn` MITSUBISHI → see gap 4.
- `listings` tse プライム → yuho-2026 p.46「②【発行済株式】」上場金融商品取引所名欄「東京証券取引所 プライム市場」. Nagoya: p.3「1961年に名古屋証券取引所に株式を上場、2020年に同取引所における株式を上場廃止」. tanshin-2026「上場取引所 東」agrees.
- `description` → 総合商社: yuho-2026 p.3「総合商社として新発足」; エネルギー・金属資源・素材・食品・自動車: p.143 segment descriptions; 取引と事業への投資・経営: p.143「トレーディング、事業投資、事業開発」(マテリアルソリューション)「販売取引、事業投資、事業開発」(食品産業), official-history-explore 事業投資期「事業投資を加速させることによってより積極的に事業そのものの運営に乗り出していきました」, 事業経営期「事業の中に入り、主体的に価値を創造し成長していく事業経営へのシフト」; 世界を舞台に: p.143「グローバルネットワーク」, group pages「グローバルに展開」. 56 characters.
- `industries` trading (primary) → p.3「総合商社」. See gap 5.

### Businesses — top level

- 7-group structure → yuho-2026 p.14「地球環境エネルギーグループと電力ソリューショングループを統合し「エネルギー＆パワーソリューショングループ」を設立しました。これに伴い、当連結会計年度までの8グループ体制を、翌連結会計年度から7グループ体制へと改編します。」; presentation-2026 PDF p.12/13/21「組織改編（26年4月1日付で「地球環境エネルギー」と「電力ソリューション」を統合し、「エネルギー＆パワーソリューション」を新設）」; tanshin-2027-q1 p.16 注2「連結会社は、当連結会計年度において、7グループ体制へと改編しており、前第1四半期連結累計期間のセグメント情報の組替再表示を行っています。」; 公式「事業紹介」top「7つの営業グループ」.
- エネルギー＆パワーソリューション description/products → official-group-energy-power-solution 取扱事業 (天然ガス事業、液化天然ガス（LNG）事業、発電事業、電力・ガストレーディング事業、小売事業、バイオ燃料事業（SAF、低炭素エタノール、バイオメタン等）、カーボンクレジット事業、クリーン水素・アンモニア事業、石油事業、石油製品事業、LPG事業); 統合: yuho-2026 p.14 and presentation-2026. Name spelling「＆」(full-width) follows yuho-2026 p.14; the website and 短信 print「&」.
- 金属資源 description/products → yuho-2026 p.143「銅、原料炭、鉄鉱石、アルミ、リチウム、ニッケルといった金属資源への投資・開発事業等に取り組むとともに、グローバルネットワークを通じた…鉄鋼原料、非鉄原料・製品の供給体制を強化」; 原料炭・銅が中心: official page「原料炭や銅を中心とする…優良資産ポートフォリオ」; 鉄の原料となる原料炭: official 鉄鋼原料本部「鉄の原料となる原料炭（製鉄用コークス原料）」; 資源開発や鉱山の経営:「資源開発や鉱山事業の経営に取り組んでいます」; 需要家に届ける取引: 金属資源トレーディング本部「金属資源・原材料を安定的に需要家に届ける」.
- マテリアルソリューション → p.143「資源素材、鉄鋼製品、機能素材、石油化学、基礎化学などの多岐にわたる素材関連分野において、トレーディング、事業投資、事業開発」; products from the four 本部 texts (below); 産業に欠かせない: official page「社会に不可欠な素材の安定供給」.
- S.L.C. → p.143「各地域・国の社会課題や生活者ニーズに応じた様々なC2B事業を立ち上げ、金融・デジタル・物流などのB2B事業と有機的に連携させることで、豊かな社会と生活者のよりよいくらし（Smart-Life）の創造」; 小売・食品卸売・ヘルスケア・金融・物流: the S.L.C. page's 本部 texts (below); customers 生活者: リテイル・食品流通本部「生活者の多様なニーズに応じた商品・サービス」.
- 食品産業 → p.143「食料、生鮮品、生活消費財、食品素材などの「食」に関わる分野で、原料の生産・調達から製品製造に至るまでの幅広い領域において、販売取引、事業投資、事業開発」; products from the 本部 取扱品目 (below).
- 社会インフラ → p.143「国内外での都市開発・運営、不動産開発・運用、データセンター、船舶、宇宙航空機、産業機械、エネルギーインフラ事業など」; 建設機械のレンタル: 産業機械本部「建設機械レンタルサービスを含む建設ソリューション事業」; 社会や産業の土台: official page「「社会の骨格をつくる」」「産業基盤を安定的に支え」.
- モビリティ → p.143「自動車の生産・販売・販売金融・アフターサービスなどのバリューチェーン事業、移動に関する社会課題を解決するモビリティサービスやEV・バッテリーを起点としたモビリティ関連事業」; アセアン中心・乗用車・商用車・現地生産: official page「乗用車・商用車の海外現地生産・販売、販売金融、アフターセールス等、自動車関連のバリューチェーンをASEANを中心にグローバルに展開」; 「自動車ローン」: yuho-2026 p.13 モビリティグループ「厳格なファイナンス（自動車ローン）審査」; products 三菱自動車・三菱ふそう・いすゞ: 自動車事業本部「三菱自動車および三菱ふそうトラック・バス製車両などを取り扱い」, いすゞ事業本部「いすゞ自動車製車両の販売」.
- 「その他」 excluded → p.144 注「「その他」は、主に当社及び関係会社に対するサービス及び業務支援を行うコーポレートスタッフ部門など」; p.4 注「「その他」に含まれる取扱商品又はサービスは、財務、経理、人事、総務関連、IT、保険等です。」 See gap 3.

### Businesses — children (all from the group's official page, 「組織」 section, in page order)

エネルギー＆パワーソリューション:
- MC Energies Corporation →「米国のエネルギー事業を統括する会社として MC Energies Corporation を新たに設立しました。上流ガスを起点としたエネルギーバリューチェーンの構築、及び、再生可能エネルギー/低・脱炭素事業の推進」; 取扱事業「天然ガス事業、液化天然ガス（LNG）事業、発電事業、電力・ガストレーディング事業、分散太陽光事業」.
- 欧州・次世代エネルギー本部 →「オランダの総合エネルギー事業会社であるN.V. Enecoを通じて、再生可能エネルギーを始めとする発電や電力トレーディング、電力・ガス小売等」「持続可能な航空燃料（Sustainable Aviation Fuels, SAF）等のバイオ商材や…クリーン水素・アンモニア、カーボンクレジット」; 取扱事業 list.
- アジア・パシフィック本部 →「伝統的なLNG生産国において、天然ガス・LNG事業の既存事業の基盤強化や新規開発、LNG受渡業務」「太陽光、陸上風力等の再生可能エネルギーなどの発電事業」.
- エネルギー開発・販売本部 →「LNGのマーケティング事業、並びにカナダの天然ガス・LNG事業」「LNG船事業（保有・傭船・運行管理）」; 取扱事業「…LNGトレーディング事業、LNG船事業、AIバリューチェーンにおける電力事業」.
- 石油本部 →「日本・アジア・米国等にて、原油、ガソリン、灯油、軽油、LPG、ナフサ、重油、その他石油製品事業、およびバイオマス燃料事業」. See gap 11 on the 「⽯」 character.
- 国内電力室 →「三菱商事エナジーソリューションズ株式会社を通じて…陸上風力・太陽光等の再生可能エネルギー電源の開発・運営」「電力トレーディング企業や電力小売企業を通じて、再生可能エネルギー導入を促進する各種サービスや電力小売メニューを提供」; customers: 主な事業会社 MCリテールエナジー「一般家庭を含む需要家向けに電力を供給」.

金属資源:
- 鉄鋼原料本部 →「豪州、北米、南米等の国・地域において、鉄の原料となる原料炭（製鉄用コークス原料）と鉄鉱石を対象に権益を保有し、資源開発や鉱山事業の経営」; 取扱品目「原料炭、鉄鉱石」.
- クリティカルミネラル本部 →「電化の進展、電気自動車（EV）の普及を背景に中長期的な需要増が見込まれる重要鉱物を安定的に供給するべく、南米、北米、豪州などの国・地域において、銅やアルミに加え、リチウム・ニッケル等の電池資源への投資や資源開発」「肥料資源領域も重要な成長分野」; 取扱品目「銅、アルミ、ボーキサイト、リチウム、ニッケル、肥料資源（ポリへライト）など」.
- 金属資源トレーディング本部 →「石炭、鉄鉱石、銅、アルミ、ニッケル、リチウム、貴金属などのトレーディング事業をグローバルに展開」「金属資源・原材料を安定的に需要家に届ける」「Triland Metals Limitedでは…金属資源業界のお客さまに価格変動リスクに対するヘッジサービスを提供」; products = subset of 取扱品目 (gap 9).

マテリアルソリューション:
- 資源素材本部 →「資源的素材のトレーディング、及び製造・販売事業」「Cape Flattery Silica Mines（当社100%出資の豪州硅砂鉱山会社）を運営」「セメント・生コンクリートの製造・販売事業や…炭素材の製造・販売事業やトレーディング…塩やエタノールのトレーディング」.
- 鉄鋼製品本部 →「株式会社メタルワン（当社60%出資の鉄鋼総合商社）を通じた鉄鋼製品の流通・加工・販売 の事業展開を中心に」; yuho-2026 p.5 メタルワン 議決権所有割合 60.00.
- 機能素材本部 →「東洋紡エムシー株式会社（当社49%出資の機能素材開発・製造・販売事業）をはじめ」「半導体関連事業への参画を通じてAI事業の発展や半導体関連素材事業への取り組み」「樹脂関連製品の製造販売事業を各パートナーと展開」.
- 汎用素材本部 →「石油化学分野（オレフィン、アロマ、合成樹脂）と基礎化学分野（塩化ビニール、メタノール、アンモニア等）において…グローバルなトレーディング・投資」.

S.L.C.:
- リテイル・食品流通本部 →「コンビニエンスストアやスーパーマーケットなどの小売事業に加え、食品流通事業、包装事業」「共通ポイントプログラムや顧客データを活用したデジタルマーケティング事業」; 取組事業 list; 主な事業会社 ローソン, ライフコーポレーション, 株式会社 ロイヤリティ マーケティング「共通ポイントプログラム"Ponta"の運営」(these three entries are outside the commented-out HTML block).
- ヘルスケア本部 →「医療・介護・予防・医薬品・農薬の分野において、顧客のさまざまな課題の解決に資する商品・サービスを提供」; 取組事業「マネージドケア事業、医療機器・医療材料等の販売事業、介護事業、医農薬の開発・製造・販売、医療機関向けソリューション」.
- スマートサービス・S.P.A.本部 →「日本の優良コンテンツのグローバル展開、良質な技術を活かした医療ツーリズム、住環境ソリューション等の展開」「有力S.P.A.※ブランドとの連携による国内外でのリテイル事業」「※企画・生産から物流、自社ブランド店での販売までを一貫して行う製造小売業」.
- 金融・物流本部 →「企業投資事業、三菱HCキャピタル株式会社及び三菱オートリース株式会社等の社内外のパートナーとの連携を通じたアセットファイナンス事業、三菱商事ロジスティクス株式会社等を通じた…物流事業」; 取組事業「プライベートエクイティ事業、リース事業、総合物流事業」.
- 三菱食品事業室 →「三菱食品株式会社等の主要事業投資先と連携」; 取組事業「卸売事業（加工食品、低温食品、菓子、酒類）」.
- デジタル事業室 →「エムシーディースリー株式会社等との連携を軸に、AI・デジタル技術を活用し、当社グループ事業の価値向上及び新たな事業の創出」.

食品産業:
- 海外市場部 →「海外市場におけるパン、調味料、飲料などの食品製造販売事業」; customers「最終顧客である消費者」.
- フード＆ウエルネス事業本部 →「コーヒー、ココア、ナッツ類、胡麻、油脂等嗜好性の高い食品原料を安定供給すると共に、発酵等の差別化された技術に立脚した食品・健康・化粧品素材をグローバルに製造販売」; 取扱品目 list.
- 食料本部 →「北米・南米・豪州などの生産国において…穀物・油糧種子・飼料原料・粗糖などの原料取引や、種子・肥料・農薬といった農業資材の販売事業」「配合飼料、澱粉・糖化品、小麦粉、砂糖などの一次加工事業」「ペットフード事業については、最終消費材の製造販売まで」; customers「幅広い食品メーカーを原料面から支えています」.
- 水産本部 →「生産・調達・製造・加工・販売にわたる垂直統合モデル」; 取扱品目「水産物（サーモン・鮪鰹・えび等）、水産加工品（ツナ缶・ペットフード等）」; Cermaq (主な事業会社, 水産本部)「ノルウェー、チリ、カナダの3カ国で…サーモンを養殖し…加工して…供給」.
- 農畜産本部 →「食肉・乳製品・米・野菜等の生鮮食材・加工食品の関連事業をグローバルに展開」; 取扱品目「鶏肉・豚肉・牛肉、食肉加工品、チーズ、乳製品、米穀、炊飯・冷凍米飯、青果物など」.

社会インフラ:
- AI・デジタル推進ユニット →「データセンターの開発・運営事業を国内外で展開」; 取扱事業「…AI・デジタル領域を主とするCVC投資等の新規事業開発」.
- インフラ・船舶・宇宙航空機本部 →「エンジニアリング・産業インフラ領域における事業投資や、船舶・FPSOの保有運航・運営事業、防衛省向け航空機・電子機器・艦船システムの取引等」; FPSO「浮体式海洋原油・ガス生産貯蔵積出設備」; 取組事業 includes「千代田化工建設」; 千代田化工建設「プラントの設計・調達・建設（EPC）を中心に」.
- 産業機械本部 → 取組事業「建設機械レンタルサービスを含む建設ソリューション事業、電力・石油・ガス・化学・製鉄・空港・鉄道システム等のインフラEPC事業…、工作機械等の工場向け各種生産設備・農家向け大型農業機械のディストリビューション事業、国内外における空港等を運営する交通・水インフラ事業」; customers 工場・農家 from the same sentence.
- 都市開発本部 →「国内、北米、アジアを中心にさまざまな不動産アセットの開発・運用事業を展開すると共に、より大規模かつ長期にわたる都市開発・運営事業」.

モビリティ:
- 自動車事業本部 →「三菱自動車および三菱ふそうトラック・バス製車両などを取り扱い、アジア・ASEAN、欧州、南米等世界各地で」「川上から川下までの幅広いバリューチェーン事業」.
- いすゞ事業本部 →「当本部にとって最大市場のタイをはじめとする世界各国において…いすゞ自動車製車両の販売、販売金融、サービス、輸出等」「タイから世界100カ国以上へのピックアップトラックの輸出」.
- モビリティ・ソリューション本部 →「知能化・自動運転化や、脱炭素化・電動化といったモビリティ業界のパラダイムシフトを事業機会として捉え…モビリティの「所有」と「利用」の両面から総合的なサービスを提供」; 主な事業会社 ネクスト・モビリティ / スペア・テクノロジーソリューションズ「AIオンデマンド交通に必要な配車システム」, ALTNA「バッテリーリース事業」.
- タイヤ事業開発部 →「日系タイヤメーカーとの長年にわたるパートナーシップの下、タイヤの製造から小売りまで事業を展開」.
- インド・アフリカ事業部 →「TVSグループと共にマルチブランドディーラー事業やアフターサービス事業、中古車オークション事業など」「アフリカでは…事業開発を推進」. The page's「南インド最大の財閥」 was dropped (superlative).

### Business model

- description: トレーディング + 事業への出資と経営 → p.143 (トレーディング、事業投資、事業開発); 「仲介役」「取引手数料が主な収入源」→ official-history-explore トレーディング期「国境を越えてサプライヤーとバイヤーを結ぶ「仲介役」」「取引手数料が主な収入源であった」; 2000年代からの事業投資 → 事業投資期 (2000〜)「事業投資を加速させる」; 2018年からの事業経営 → 事業経営期 (2018〜)「事業の中に入り、主体的に価値を創造し成長していく事業経営へのシフト」.
- products → group-level products above (p.143 and group pages).
- customers → 需要家: 金属資源トレーディング本部; 食品メーカー: 食料本部; 一般家庭を含む電気の需要家: MCリテールエナジー; 生活者: S.L.C. リテイル・食品流通本部.
- revenueSources: 製品・商品の販売 → yuho-2026 p.138「金属、機械、化学品、一般消費財など、多岐にわたる製品及び商品を取り扱っていますが、本人として行う製品及び商品の販売については、受渡時点において…収益を認識」; 代理人の手数料・差額 → p.137「代理人として収益を手数料又は報酬の額若しくは対価の純額で連結損益計算書に表示」; サービス → p.138「物流、情報通信、技術支援など、様々なサービスの提供」; 電力・都市ガス / プラント建設 → p.138「電力・都市ガス供給契約に基づく電力等の供給や、工事請負契約に基づくプラント建設」; リース・商品の売買契約 → p.178「その他の源泉から認識した収益には、IFRS第9号「金融商品」に基づく収益（…非金融商品項目の売買契約について、商品の受渡時点において総額で計上した収益を含む）や、IFRS第16号「リース」に基づくリース収益」.
- flow company「連結子会社は833社、持分法適用会社は349社」→ p.4「（連結子会社 833社、持分法適用会社 349社）」.
- flow offering「運営にも深く関わります」→ p.11「多彩・多才な人材がオペレーションに深く関与することで」; official-history-explore 事業経営期.
- flow customer → the customers lines above.
- flow revenue: sources of revenue → p.137–138; ranking「エネルギー＆パワーソリューション（統合前の2グループの合計）、金属資源、マテリアルソリューションの順」→ Segment ordering above (p.177, computed sum stated as such on the page).
- flow profit: 売上総利益 − 販売費及び一般管理費, + 持分法による投資損益, 金融収益 (受取配当金), − 法人所得税 → p.121 連結損益計算書 line items; 持分法 applies to 関連会社 and ジョイント・ベンチャー（共同支配企業）→ p.131「関連会社及びジョイント・ベンチャーに対する投資については持分法を適用しています」; 受取配当金 from shares → p.181「受取配当金は、主にFVTOCIで測定する金融資産から生じたものです」and p.146「市場性のある株式に係る受取配当金」「市場性のない株式等に係る受取配当金」. The page gives no amounts. For the log: 2026年3月期 持分法による投資損益 467,941, 受取配当金 214,783, 売上総利益 1,655,074 百万円 (p.121, p.181).

### History

- 1954 description → yuho-2026 p.3〔設立の経緯〕「1947年7月連合国最高司令官により解散の指令を受け、同年11月解散」「第二会社として光和実業株式会社の商号で設立」, 沿革「1950年 4月1日（設立）光和実業株式会社の商号で設立」「1952年 8月…商号を三菱商事株式会社に変更」「1954年 6月 東京証券取引所に株式を上場」「1954年 7月1日（創立）…不二商事㈱、東京貿易㈱及び東西交易㈱の3社を吸収合併し、総合商社として新発足」; official-history-roots-01「1954年7月1日、新生三菱商事が発足」.
- 1954 significance →「（創立）」label on p.3; official-history-roots-01「1954年7月1日、新生三菱商事が発足」「現在の三菱商事の礎をつくり上げた社長高垣勝次郎」.
- 1968 description → p.3「1968年11月 ブルネイLNG（LNG製造会社）への投資決定」; official-history-roots-07「1969年12月…シェルと三菱商事が45％ずつ、ブルネイ政府が10％を出資する「ブルネイLNG」設立の合弁契約書にサイン」「当時の三菱商事の資本金をはるかに上回る巨額プロジェクト」「72年12月にブルネイからのLNG船が大阪に入港」.
- 1968 significance → roots-07「今日のMCグループのLNGビジネスが大きく花開いた原点とも言えるブルネイLNGプロジェクト」; yuho-2026 p.4 BRUNEI LNG listed under 地球環境エネルギー「主要な持分法適用会社」(p.9: 議決権 25.00%).
- 1974 description → p.3「1974年11月 タイにTRI PETCH ISUZU SALES COMPANY LIMITED（いすゞ車輸入総販売代理店）を設立」; official-history-explore「1974 自動車の輸入総販売代理店 Tri Petch Isuzu Sales Co., Ltd. 設立」.
- 1974 significance → official-group-mobility いすゞ事業本部「当本部にとって最大市場のタイ」, Tri Petch Isuzu Sales「ピックアップトラックやSUV、商用車を中心にいすゞ車の拡販」; yuho-2026 p.6 TRI PETCH ISUZU SALES 子会社 (議決権 88.73%).
- 2000 description → official-history-explore「2000 株式会社ローソンと資本・業務提携」「2024 KDDI株式会社・株式会社ローソンとの資本業務提携契約を締結」; コンビニエンスストア「ローソン」を運営 / 2017年子会社化 → yuho-2026 p.33「2017年に株式会社ローソン…の発行済株式数の16.6%を株式公開買付けにより取得し、それまで保有していた33.4%と併せて…連結子会社としました」「コンビニエンスストア「ローソン」のフランチャイズシステム及び直営店舗の運営」.
- 2000 significance → official-group-smart-life-creation 主な事業会社 (リテイル・食品流通本部) ローソン; yuho-2026 p.33/p.211「2024年8月15日付で当社及びKDDIの出資比率を50%へ調整…同社を共同支配企業に分類」; p.33「2026年2月末時点で、日本全国に約14,700店、海外に約7,800店の合計約22,500店」.
- 2001 description → p.3「1968年11月 オーストラリアにMITSUBISHI DEVELOPMENT PTY LTD（金属資源事業会社）を設立（2001年6月にオーストラリア原料炭事業権益を追加取得し、BHP Billiton Mitsubishi Allianceを設立）」; official-history-explore「2001 資源メジャー、BHP Billiton plc.と折半でBMA社を設立」.
- 2001 significance → yuho-2026 p.13「主力事業の一つである原料炭」; official-group-mineral-resources Mitsubishi Development Pty Ltd（MDP）「豪州における金属資源開発事業の中核会社で、原料炭事業などの投資・運営」.
- 2003 description → p.3「2003年 1月 日商岩井㈱（現 双日㈱）と共同新設分割にて㈱メタルワン（鉄鋼製品事業会社）を設立」; official-history-explore「2003 鉄鋼総合商社の株式会社メタルワン発足」.
- 2003 significance → p.5 メタルワン 議決権所有割合 60.00; official-group-materials-solution 鉄鋼製品本部「株式会社メタルワン（当社60%出資の鉄鋼総合商社）を通じた…事業展開を中心に」.
- 2020 description → p.3「2020年 3月 オランダの総合エネルギー事業会社（現 N.V. Eneco）を子会社化」; p.33「2020年3月に、中部電力株式会社と共同で設立したDiamond Chubu Europe B.V.を通じて、欧州で総合エネルギー事業を展開するN.V. Eneco…の100%の株式を約5,000億円で取得」; official-history-explore「2020 オランダの総合エネルギー会社N.V. Enecoを子会社化」.
- 2020 significance → official-group-energy-power-solution 欧州・次世代エネルギー本部「N.V. Enecoを通じて、再生可能エネルギーを始めとする発電や電力トレーディング、電力・ガス小売等の事業」.
- 2026 description → presentation-2026「26年4月1日付で「地球環境エネルギー」と「電力ソリューション」を統合し、「エネルギー＆パワーソリューション」を新設」; purpose → yuho-2026 p.14「エネルギー事業に関わる商材・機能を一元化し、地域ごとに柔軟なバリューチェーンを構築することで、エネルギートランジション期の多様なニーズに応え、最適なソリューションを提供することを目的に」.
- 2026 significance → p.14「当連結会計年度までの8グループ体制を、翌連結会計年度から7グループ体制へと改編」; tanshin-2027-q1 p.16 注2.

## Gaps and judgement calls

No value is `null`. No claim remains that I could not point to a passage for. Status: `published`. Items 1, 2 and 4
are the ones a reviewer should look at first.

1. **7 groups, not the 8 reportable segments printed in the 有報 (deviation from the protocol's letter).** The protocol says top level = the reportable segments in the latest 有報 セグメント情報, which for 2026年3月期 are 8 (p.143). The task instruction said to use the latest definition after a reorganisation. The same 有報 announces the 7-group structure from the next fiscal year (p.14). It took effect 2026-04-01 (presentation-2026), and the company reports 7 segments from 2027年3月期 1Q (tanshin-2027-q1). An entry published in September 2026 showing 地球環境エネルギー and 電力ソリューション as separate groups would describe a structure that no longer exists. If the 8-segment structure is preferred, the ordering would be: 金属資源 4,083,329 > マテリアルソリューション 3,631,197 > 地球環境エネルギー 3,267,295 > S.L.C. 2,514,143 > 食品産業 2,324,535 > 電力ソリューション 1,318,984 > 社会インフラ 930,638 > モビリティ 837,375.
2. **エネルギー＆パワーソリューション's revenue (4,586,279) is a computed sum, used only for ordering.** The company has not published a full-year 2026年3月期 revenue figure restated to 7 groups in any document I found. presentation-2026 restates profit and 営業収益CF, not 収益. The sum is supported by the exact additivity of the company's own 1Q restatement (table above). On the page it appears only as a ranking and is labelled「統合前の2グループの合計」. It is never shown as an amount.
3. **「その他」 left out.** The company does describe it (p.4, p.144), but it is the corporate staff function (財務、経理、人事、総務関連、IT、保険等), not an 営業グループ. Its revenue is 8,539 百万円. Including it as a business would suggest an eighth line of business to a beginner.
4. **`shortNameEn` = "MITSUBISHI".** This follows the protocol rule (drop the legal suffix「Corporation」). However, "MITSUBISHI" alone is also the wordmark of many unrelated listed companies (三菱電機, 三菱重工業, 三菱UFJ …), so a hero reading only "MITSUBISHI" could lead a beginner to confuse them. Alternatives: omit the field, or use "MITSUBISHI CORPORATION". Coordinator's call.
5. **`industries` = trading only.** Every group maps to some id in `INDUSTRY_IDS` (energy, food, automotive, chemicals, real-estate…). Toyota added `finance` for a reportable segment, but here that logic would add five or more secondary industries, and picking only some would be arbitrary. Add `energy` (largest group) if industry pages should list it.
6. **Children = organisational units (本部・室・部・ユニット), all of them, from the official group pages.** No 有報 lists 本部. The official pages are rank 4 sources and are undated, so `publishedAt` is omitted for them. The units are regional in some groups (アジア・パシフィック本部, 欧州・次世代エネルギー本部) rather than by product, because that is how the company divides the group. Regrouping them by product (e.g. "LNG", "電力") would be an invented hierarchy. 40 business nodes in total (7 + 33). `shortName` removes only「本部」「室」「部」「ユニット」 or, for MC Energies, the legal suffix.
7. **`fiscalYear` labels.** The company labels years「2021年度」…「2025年度」(April–March). The protocol requires「2022年3月期」…「2026年3月期」. Same periods, mapping recorded in the Financials table.
8. **Segment profit kept off the page (invariant 4).** Amounts are in this log only. No profit ranking is stated at all, because the merged group (204,270) and 金属資源 (204,523) are within 253 百万円 and the company's own restated 2025年度 profit uses a revised internal interest-charge system.
9. **`products` subsets and wording.** Where a 取扱品目 list is long (金属資源トレーディング本部: also クロム、モリブデン、ボーキサイト、鉛地金、錫地金、亜鉛精鉱 …), a subset was used. 「〜事業」 suffixes were dropped where the list names a product (e.g.「天然ガス事業」→「天然ガス」). Otherwise items are kept close to the page's wording.
10. **Business-model explanation of 持分法による投資損益 is by name only.** The 有報 does not define the equity method in plain language (p.131 only says to which investees it applies). The entry therefore says「出資先の関連会社や共同支配企業の損益（持分法による投資損益）」 and does not explain the proportional-share mechanics from memory.
11. **Character normalisation.** The E&PS page prints「⽯油本部」 with U+2F6F (KANGXI RADICAL STONE); written as「石油本部」(U+77F3). The 金属資源 page prints「ポリへライト」 with hiragana「へ」 (U+3078); written as katakana「ポリヘライト」. 「船舶」 (U+8239 U+8236) is as printed in both the 有報 and the page.
12. **Commented-out HTML on the S.L.C. page.** The page source contains `<!-- -->` blocks with company entries that are not displayed (日本デリカサービス, トランザクション・メディア・ネットワークス, iVision Shanghai, 中部電力ミライズコネクト). The page text was re-extracted with comments stripped. None of those entries is used. The other six group pages and all history pages produce identical text with or without comments.
13. **Official「沿革」page not used.** It says 1954「東京・大阪両証券取引所に株式上場」. yuho-2026 p.3 mentions only the Tokyo listing (1954) and a Nagoya listing (1961, delisted 2020) and says nothing about Osaka. The 有報 was followed, and the listing detail on the page is limited to Tokyo.
14. **Not consulted in depth:** 統合報告書. The IR page (read 2026-09-13) lists「統合報告書（2025年9月発行）」 as the latest; a 2026 edition was not listed. The 2025 edition predates the 7-group structure, so it was not used.
15. **Brunei LNG year.** The 有報 gives 1968年11月「投資決定」. roots-07 gives the 1969年12月 joint-venture contract, and official-history-explore lists「1969 Brunei LNG Sdn. Bhd. を設立」. These are different steps, not a conflict. The event uses 1968 (the 有報's turning point), and the description mentions 1969 and 1972. The 1969 shareholding (Shell 45% / MC 45% / Brunei 10%) is historical. The current 有報 shows 議決権 25.00% (p.9), and the entry does not state today's split.
16. **History selection (8 events).** Supportable events left out for the 5–8 limit: 1968 商品本部制への移行 (p.3, the origin of today's 営業グループ; covered in substance by the 2026 event), 1971 英文社名, 1981 サウディ石油化学, 1988 エスコンディーダ銅鉱山, 1992 サハリン, 2014 Cermaq 子会社化, 2022 プライム市場移行. No event was chosen as the origin of the copper business, because no source names one.
17. **`sources` publishedAt.** 有報, 短信 and presentation dates are the dates printed on them. The 1Q 短信 use the review-completion re-release dates (2026-08-06, 2025-08-07), which are the dates on the PDFs I downloaded; the first disclosures were 2026-08-03 and 2025-08-04.
18. **Dates.** `accessedAt` is 2026-09-13 for every document except `yuho-2025`, which was downloaded and read on 2026-09-14. Re-verification on 2026-09-14 used the copies downloaded on 2026-09-13. `updatedAt` and the revision date are 2026-09-14.
19. **Not registered in `src/data/companies/index.ts`**, per the task instruction to write only these two files.

## Editorial decision after research (2026-09-14)

`shortNameEn` changed from `MITSUBISHI` to `MITSUBISHI CORPORATION` by the project lead before
publication. "MITSUBISHI" alone is shared by many unrelated listed companies (三菱重工業, 三菱UFJ
フィナンシャル・グループ, 三菱電機, …); as the hero wordmark it would make a beginner's
three-second reading *less* accurate. The English 商号 on the 有報 cover is used without abridgement.


---

## Notes carried over from the TypeScript data file (2026-09-15)

Content moved from TypeScript modules to JSON so the local admin editor can edit it safely, and JSON cannot hold comments. Every comment that was in the data file is preserved here verbatim, with the field it sat above and its line number in the last TypeScript version (git history has the original file).

### From `src/data/companies/mitsubishi-corporation.ts`

- **file header** (line 24):
  > 三菱商事 (8058).
  > Every figure and claim below is traced, page by page, in
  > `docs/research/mitsubishi-corporation.md`. Page numbers there are the
  > printed page numbers of the 有報 (the "― n ―" footer), not PDF page indices.
  > Three things here are easy to "fix" wrongly, so they are called out:
  > - The top level is the SEVEN 営業グループ in force since 2026-04-01, not the
  >   eight reportable segments printed in the 2026年3月期 有報 セグメント情報.
  >   The same 有報 (p.14) says the 8-group structure becomes 7 groups from the
  >   next fiscal year, and the 2027年3月期 1Q 決算短信 already reports 7
  >   segments. Showing 地球環境エネルギー and 電力ソリューション as separate
  >   groups would describe a structure that no longer exists.
  > - The top line is 収益, not 売上高 or 売上収益. It is printed that way in the
  >   IFRS consolidated table and is kept verbatim.
  > - A large part of 収益 is recorded gross, because the company is principal
  >   on many trades (有報 注記3(15)). Do not read the revenue figure as "size of
  >   the business" without the business-model text that explains it.
- **shortNameEn** (line 33):
  > Not "MITSUBISHI": that word alone is shared by many unrelated listed
  > companies, and as the hero wordmark it would make the 3-second reading
  > less accurate. Decided before publication; see the research log.
- **listings** (line 38):
  > 有報 p.46: 東京証券取引所 プライム市場 only. 名古屋 was delisted in 2020
  > (有報 p.3 沿革).
- **industries** (line 43):
  > Only `trading`. Every 営業グループ maps to some industry (energy, food,
  > automotive, chemicals, real-estate…); picking a few as secondary would be
  > arbitrary. See the research log.
- **businesses (energy-power-solution)** (line 56):
  > Ordered by 2026年3月期 segment 収益 (有報 注記24, 百万円):
  > エネルギー＆パワーソリューション 4,586,279 (= 地球環境エネルギー 3,267,295
  > + 電力ソリューション 1,318,984; the company's own 7-group restatement of
  > 2026年3月期 1Q shows the merger is exactly additive) > 金属資源 4,083,329
  > > マテリアルソリューション 3,631,197 > S.L.C. 2,514,143 > 食品産業
  > 2,324,535 > 社会インフラ 930,638 > モビリティ 837,375.
  > 
  > `children` are the organisational units each group page lists under
  > 「組織」 on the official site, all of them, in the page's order. They are
  > how the company itself divides each group; no hierarchy is invented.
  > 「その他」 is left out: it is the corporate staff function, not a business.
- **financials** (line 682):
  > Source: 有報 2025年度（2026年3月期）p.1「主要な経営指標等の推移 (1) 連結経営指標等」.
  > The company labels years 「2021年度」…「2025年度」 with 決算年月 2022年3月…2026年3月;
  > `fiscalYear` uses the protocol's 「…年3月期」 form for the same periods.
  > Values printed in 百万円, converted × 1,000,000. Identical for 2021–2024年度 in
  > the previous 有報 (2024年度) p.1: no restatement.
- **status** (line 962):
  > Every judgement call (7 groups instead of the 有報's 8 segments, the
  > computed エネルギー＆パワーソリューション revenue used only for ordering,
  > shortNameEn) is recorded in the research log. None is an unverified fact,
  > so the entry is published.
