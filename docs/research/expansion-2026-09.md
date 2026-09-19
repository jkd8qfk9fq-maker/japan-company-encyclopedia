# Company expansion — September 2026

Operator request (2026-09-15): add 20 companies to the same standard as the first five — every figure from
the latest 有価証券報告書 and 決算短信, a research log, an initial revision record
(`docs/research-protocol.md`). 三菱商事 was also requested and is already published.

Each company now starts from an **evidence pack** built from the filing's XBRL
(`scripts/research/evidence-pack.mjs`), so a researcher reads extracted text instead of hunting for a PDF,
and every stored figure is checked back against the filing's own tags
(`scripts/research/verify-financials.mjs`). That made each researcher small enough to run several at once;
the earlier "one company at a time" rule was a consequence of how expensive PDF research was.

This file is the queue a resumed session continues from. Status: `pending` → `researching` →
`published` (registered, integrity suite passing, committed) — or `blocked` with the reason.

| # | 分野 | 企業 | id | 状態 | Notes |
|---|---|---|---|---|---|
| 1 | 自動車 | 本田技研工業（ホンダ） | `honda` | published | 2026年3月期 有報; net loss year noted |
| 2 | 自動車 | 日産自動車 | `nissan` | published | 2026年3月期 有報 (J-GAAP); two loss years noted |
| 3 | 半導体 | アドバンテスト | `advantest` | published | placed in 製造装置 (industry revision) |
| 4 | 半導体 | 信越化学工業 | `shin-etsu-chemical` | published | primary chemicals; placed in 部素材・原料 |
| 5 | 電機 | 日立製作所 | `hitachi` | published | the six 訂正有報 amend 役員の報酬等 only; no restatement |
| 6 | 電機 | 三菱電機 | `mitsubishi-electric` | published | 6 segments; セグメント変更は名称変更のみ（ビジネス・プラットフォーム→デジタルイノベーション） |
| — | 総合商社 | 三菱商事 | `mitsubishi-corporation` | published | before this expansion |
| 7 | 総合商社 | 三井物産 | `mitsui-and-co` | published | 7 segments ordered by 収益; note that a 商社 top line is not a manufacturer's 売上高 |
| 8 | 総合商社 | 伊藤忠商事 | `itochu` | published | 8 segments ordered by 収益; profit order differs and is stated |
| 9 | 金融 | 三菱UFJフィナンシャル・グループ | `mitsubishi-ufj-financial-group` | pending | top line 経常収益; a 2026-09-16 agent was killed mid-write — its unverified draft is not in the repo |
| 10 | 金融 | 三井住友フィナンシャルグループ | `sumitomo-mitsui-financial-group` | pending | top line 経常収益 |
| 11 | 金融 | みずほフィナンシャルグループ | `mizuho-financial-group` | pending | top line 経常収益 |
| 12 | 通信 | NTT | `ntt` | pending | the 2026 有報 is filed as ＮＴＴ株式会社 — verify the 商号 on the cover page |
| 13 | 通信 | KDDI | `kddi` | pending | **restates 2023–2025 revenue and net income** against the prior 有報; also discloses セグメント変更 |
| 14 | IT | 富士通 | `fujitsu` | pending | |
| 15 | IT | NEC | `nec` | pending | filing discloses 報告セグメントの変更 |
| 16 | 小売 | セブン＆アイ・ホールディングス | `seven-and-i-holdings` | pending | February year-end; scope changes likely |
| 17 | 小売 | ファーストリテイリング | `fast-retailing` | pending | August year-end (2025年8月期) |
| 18 | 製薬 | 武田薬品工業 | `takeda-pharmaceutical` | pending | |
| 19 | 製薬 | 第一三共 | `daiichi-sankyo` | pending | a 訂正有報 was filed 2026-07-03 and changed no five-year figure — establish what it did change |

Notes above are prompts to verify, not facts.
