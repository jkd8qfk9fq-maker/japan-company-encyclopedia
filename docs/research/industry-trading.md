# 業界: 商社（trading）— リサーチログ

- 作成: 2026-11-01、scripts/industries/write-industries.mjs（モデル呼び出し1〜2回、概算 $0.16）
- 根拠: 業界パック（この業界を自社の業界に含める掲載企業の、公開中の解説。各社の解説は有価証券報告書に基づく）だけ。一般知識・web は使っていない
- 出典は掲載企業の有価証券報告書。業界の文の `sourceIds` は、その文の根拠になった企業の有報

## 出典
- itochu-yuho-2026: 伊藤忠商事株式会社（EDINET）「有価証券報告書－第102期（2025年4月1日－2026年3月31日）」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YA6H.pdf
- hanwa-yuho-2026: 阪和興業株式会社「有価証券報告書－第79期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YED6.pdf
- alconix-yuho-2026: アルコニックス株式会社「有価証券報告書－第45期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCV6.pdf
- kato-sangyo-yuho-2025: 加藤産業株式会社「有価証券報告書－第79期(2024/10/01－2025/09/30)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XA3X.pdf
- macnica-holdings-yuho-2026: マクニカホールディングス株式会社「有価証券報告書－第11期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGVR.pdf
- altech-9972-yuho-2025: アルテック株式会社「有価証券報告書－第50期(2024/12/01－2025/11/30)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XMNZ.pdf
- yamazen-yuho-2026: 株式会社山善「有価証券報告書－第80期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBDH.pdf
- kanematsu-yuho-2026: 兼松株式会社「有価証券報告書－第132期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGCZ.pdf
- marubeni-yuho-2026: 丸紅株式会社（EDINET）「有価証券報告書－第102期（2025年4月1日－2026年3月31日）」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAY4.pdf
- mitsubishi-corporation-yuho-2026: 三菱商事株式会社「有価証券報告書（2025年度：2025年4月1日〜2026年3月31日）」 https://www.mitsubishicorp.com/jp/ja/ir/library/fstatement/pdf/2025_04/y2025_04.pdf
- mitsui-and-co-yuho-2026: 三井物産株式会社（EDINET）「有価証券報告書－第107期（2025年4月1日－2026年3月31日）」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YAVT.pdf
- sojitz-yuho-2026: 双日株式会社「有価証券報告書－第23期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y9EI.pdf
- sumitomo-corporation-yuho-2026: 住友商事株式会社（EDINET）「有価証券報告書－第158期（2025年4月1日－2026年3月31日）」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YARD.pdf
- yamae-group-holdings-yuho-2026: ヤマエグループホールディングス株式会社「有価証券報告書－第5期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE2O.pdf
- arata-yuho-2026: 株式会社あらた「有価証券報告書－第24期(2025年4月1日－2026年3月31日)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEVF.pdf
- advan-group-yuho-2026: 株式会社アドヴァングループ「有価証券報告書－第53期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YM3U.pdf
- alphapurchase-yuho-2025: 株式会社アルファパーチェス「有価証券報告書－第16期(2025/01/01－2025/12/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT1E.pdf
- ana-holdings-yuho-2026: ＡＮＡホールディングス株式会社（EDINET）「有価証券報告書－第76期（2025年4月1日－2026年3月31日）」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKL4.pdf
- jfe-holdings-yuho-2026: ＪＦＥホールディングス株式会社「有価証券報告書－第24期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCUD.pdf
- japan-airlines-yuho-2026: 日本航空株式会社「有価証券報告書－第77期(2025/04/01－2026/03/31)」 https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFIO.pdf
