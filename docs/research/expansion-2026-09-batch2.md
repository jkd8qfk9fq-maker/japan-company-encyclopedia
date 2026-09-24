# Company expansion — batch 2 (2026-09-20)

Operator request: add the 54 companies in the table below to the same standard as the first 24.
**NTTデータグループ was dropped** by operator decision: it was delisted in 2025年9月 and became a
wholly owned subsidiary of NTT, and EDINET has no 有価証券報告書 for it after 2025年3月期, so it
cannot be researched to the same standard. The remaining 53 are listed here.

Securities codes were resolved mechanically from EDINET's own day indexes
(`scripts/research/find-filings.mjs`), never recalled from memory. Two results from that:
第一生命ホールディングス now files as **株式会社第一ライフグループ**, and 「イオン」 was refused
rather than matched inside 「ライオン株式会社」.

Each company has an evidence pack (`scripts/research/evidence-pack.mjs`) including `brief.md`.
Researchers run **one at a time** — every attempt at concurrency has been killed by the session
rate limit, including after the work per agent was made much cheaper.

Status: `pending` → `researching` → `published` (registered, integrity suite passing, committed).

| # | 分野 | 企業 | id | コード | 状態 | Notes from the filing |
|---|---|---|---|---|---|---|
| 1 | 自動車・輸送機器 | スズキ株式会社 | `suzuki` | 7269 | published | 日本基準→IFRS移行 (移行日2023-04-01)。移行日列のnullは修正再表示ではない |
| 2 | 自動車・輸送機器 | 株式会社ＳＵＢＡＲＵ | `subaru` | 7270 | published | 3 segments; 自動車・航空宇宙・その他 |
| 3 | 自動車・輸送機器 | マツダ株式会社 | `mazda` | 7261 | published | 地域別セグメント; 売上高「計」で並べ、外部顧客基準では北米が首位になることをログに記録 |
| 4 | 自動車・輸送機器 | いすゞ自動車株式会社 | `isuzu-motors` | 7202 | published | 日本基準→IFRS移行; 2024/2025は行内の基準をIFRSに統一し直した |
| 5 | 自動車・輸送機器 | 株式会社デンソー | `denso` | 6902 | published | 地域別セグメント; 5年表の利益行は営業利益 |
| 6 | 半導体・電子部品 | 株式会社ソシオネクスト | `socionext` | 6526 | published | 単一セグメント; ファブレス; 製品売上/NRE売上の内訳（セグメント別ではない） |
| 7 | 半導体・電子部品 | ルネサスエレクトロニクス株式会社 | `renesas-electronics` | 6723 | published | 12月期; 2セグメント+その他; FY2025の損失はWolfspeed評価損 |
| 8 | 半導体・電子部品 | ローム株式会社 | `rohm` | 6963 | published | 3セグメント+その他; 東芝D&S・三菱電機との協議開始合意は未完了のため沿革に入れていない |
| 9 | 半導体・電子部品 | 株式会社村田製作所 | `murata-manufacturing` | 6981 | published | US GAAP→IFRS移行; 2022年度はUS GAAP列に統一し直した |
| 10 | 半導体・電子部品 | 株式会社ディスコ | `disco` | 6146 | published | 単一セグメント; 装置と消耗ツールの両方を売るモデル |
| 11 | 電機・精密機器 | パナソニック ホールディングス株式会社 | `panasonic-holdings` | 6752 | pending | IFRS |
| 12 | 電機・精密機器 | 富士フイルムホールディングス株式会社 | `fujifilm-holdings` | 4901 | pending | US GAAP; **セグメント注記なし → md-and-a.txt から**; 本文が3万字で打ち切られている箇所あり |
| 13 | 電機・精密機器 | キヤノン株式会社 | `canon` | 7751 | published | US GAAP・12月期; セグメントはXBRLに無くmd-and-a.txtから取得 |
| 14 | 電機・精密機器 | 株式会社ニコン | `nikon` | 7731 | published | needs-attention: 有報は税引前利益を印字するがXBRLに該当タグが無く空欄 |
| 15 | 電機・精密機器 | 株式会社キーエンス | `keyence` | 6861 | published | 決算期3月20日; 単一セグメント; 直販体制 |
| 16 | 機械・産業機器 | ダイキン工業株式会社 | `daikin-industries` | 6367 | published | 空調・化学・その他; その他のみchildren; 2022年3月期にIAS38アジェンダ決定の遡及修正note |
| 17 | 機械・産業機器 | ファナック株式会社 | `fanuc` | 6954 | published | 単一セグメント; 商品部門別売上で並べた（セグメント別ではない） |
| 18 | 機械・産業機器 | ＳＭＣ株式会社 | `smc` | 6273 | pending |  |
| 19 | 機械・産業機器 | 株式会社クボタ | `kubota` | 6326 | pending | IFRS; **決算期 2025-12-31** |
| 20 | 機械・産業機器 | 株式会社小松製作所 | `komatsu` | 6301 | published | US GAAP; セグメントはXBRLに無くmd-and-a.txtから取得; ラベルは印字（注記番号付き）に修正 |
| 21 | 素材・化学 | 旭化成株式会社 | `asahi-kasei` | 3407 | published | 3領域; 売上順と営業損益順が異なることを明記 |
| 22 | 素材・化学 | 三菱ケミカルグループ株式会社 | `mitsubishi-chemical-group` | 4188 | published | 田辺三菱製薬の非継続事業化で前期再表示; basis両方を全年度に設定 |
| 23 | 素材・化学 | 住友化学株式会社 | `sumitomo-chemical` | 4005 | pending | IFRS |
| 24 | 素材・化学 | ＡＧＣ株式会社 | `agc` | 5201 | pending | IFRS; **決算期 2025-12-31** |
| 25 | 素材・化学 | 日本製鉄株式会社 | `nippon-steel` | 5401 | published | 利益行は独自指標の事業利益; USスチール取得は将来に向かって適用 |
| 26 | 商社 | 住友商事株式会社 | `sumitomo-corporation` | 8053 | pending | IFRS |
| 27 | 商社 | 丸紅株式会社 | `marubeni` | 8002 | pending | IFRS |
| 28 | 金融 | 野村ホールディングス株式会社 | `nomura-holdings` | 8604 | pending | US GAAP; **セグメント注記なし → md-and-a.txt から**; 候補複数 — indicators.txt で確認; 本文が3万字で打ち切られている箇所あり |
| 29 | 金融 | 東京海上ホールディングス株式会社 | `tokio-marine-holdings` | 8766 | pending | IFRS; 候補複数 — indicators.txt で確認 |
| 30 | 金融 | 株式会社第一ライフグループ（旧会社名：第一生命ホールディングス株式会社） | `dai-ichi-life-holdings` | 8750 | pending | **前期有報と差異2件 — 理由を特定すること**; 本文が3万字で打ち切られている箇所あり |
| 31 | 建設・不動産 | 大成建設株式会社 | `taisei` | 1801 | published | 訂正有報は役員報酬の閾値とのれん注記の小見出しのみ; 数値変更なし |
| 32 | 建設・不動産 | 鹿島建設株式会社 | `kajima` | 1812 | published | 事業3＋関係会社を地域別に2の構成; 海外関係会社が2位 |
| 33 | 建設・不動産 | 清水建設株式会社 | `shimizu` | 1803 | published | 暫定的な会計処理の確定で総資産・純資産を再表示; noteで明示 |
| 34 | 建設・不動産 | 三井不動産株式会社 | `mitsui-fudosan` | 8801 | pending |  |
| 35 | 建設・不動産 | 住友不動産株式会社 | `sumitomo-realty-and-development` | 8830 | pending |  |
| 36 | 小売・消費 | イオン株式会社 | `aeon` | 8267 | pending | **決算期 2026-02-28**; **前期有報と差異1件 — 理由を特定すること** |
| 37 | 小売・消費 | 株式会社ニトリホールディングス | `nitori-holdings` | 9843 | pending | IFRS; **前期有報と差異2件 — 理由を特定すること**; 候補複数 — indicators.txt で確認 |
| 38 | 小売・消費 | 株式会社良品計画 | `ryohin-keikaku` | 7453 | pending | **決算期 2025-08-31** |
| 39 | 小売・消費 | 株式会社ZOZO | `zozo` | 3092 | pending |  |
| 40 | 食品・飲料 | 味の素株式会社 | `ajinomoto` | 2802 | pending | IFRS |
| 41 | 食品・飲料 | キッコーマン株式会社 | `kikkoman` | 2801 | pending | IFRS |
| 42 | 食品・飲料 | 日清食品ホールディングス株式会社 | `nissin-foods-holdings` | 2897 | pending | IFRS |
| 43 | 食品・飲料 | アサヒグループホールディングス株式会社 | `asahi-group-holdings` | 2502 | pending | IFRS; **決算期 2025-12-31**; 訂正有報あり (S100YVTZ) |
| 44 | 医薬品 | アステラス製薬株式会社 | `astellas-pharma` | 4503 | pending | IFRS |
| 45 | 医薬品 | 中外製薬株式会社 | `chugai-pharmaceutical` | 4519 | pending | IFRS; **決算期 2025-12-31** |
| 46 | 通信・IT | ソフトバンク株式会社 | `softbank` | 9434 | pending | IFRS |
| 47 | 通信・IT | 楽天グループ株式会社 | `rakuten-group` | 4755 | pending | IFRS; **決算期 2025-12-31** |
| 48 | 交通・物流 | 東日本旅客鉄道株式会社 | `east-japan-railway` | 9020 | pending |  |
| 49 | 交通・物流 | 東海旅客鉄道株式会社 | `central-japan-railway` | 9022 | pending |  |
| 50 | 交通・物流 | ＡＮＡホールディングス株式会社 | `ana-holdings` | 9202 | pending |  |
| 51 | 交通・物流 | ヤマトホールディングス株式会社 | `yamato-holdings` | 9064 | pending |  |
| 52 | エネルギー | 株式会社INPEX | `inpex` | 1605 | pending | IFRS; **決算期 2025-12-31**; 候補複数 — indicators.txt で確認 |
| 53 | エネルギー | ENEOSホールディングス株式会社 | `eneos-holdings` | 5020 | pending | IFRS |

## 着眼点（運営者指示 2026-09-21）

その会社を読むときに何が面白いのかを運営者が挙げたもの。3秒文や事業構造を書くときの視点であって、
**事実の代わりではない** — ここに書かれた関係も、有報が述べている範囲でのみ記載すること。

| id | 着眼点 |
|---|---|
| `denso` | トヨタなど自動車産業とのサプライチェーン |
| `disco` | 東京エレクトロン、アドバンテストなど半導体産業との関係 |
| `murata-manufacturing` | ソニーなど電子機器メーカーとの部品関係 |
| `keyence` | FA・製造業のビジネスモデル |
| `daikin-industries` | 日本のグローバル製造業 |
| `fanuc` | 工場自動化 |
| `kubota` | 農業機械・水インフラ |
| `nippon-steel` | 素材産業 |
| `mitsui-fudosan` | 三菱地所との比較 |
| `tokio-marine-holdings` | 金融の中でも銀行とは異なる保険モデル |
| `zozo` | EC・プラットフォーム型ビジネス |
| `ajinomoto` | 食品＋化学・バイオという独特の事業構造 |
| `chugai-pharmaceutical` | 製薬業界の研究開発型モデル |
| `eneos-holdings` | 石油・エネルギー産業 |
| `inpex` | 上流の資源開発 |

Notes are read from the evidence packs, not transcribed — they are prompts to verify, not facts.
