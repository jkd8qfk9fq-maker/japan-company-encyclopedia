# ＴＶＥ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＴＶＥ |
| 証券コード | 6466 |
| docID（データを取り出した文書） | `S100XBK6` |
| 原本 docID | `S100XBK6` |
| 提出日（原本） | 2025-12-23 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBK6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＴＶＥ / 6466 / docID S100XBK6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tve: 10 件の数値を有報XBRLと照合
有報: 株式会社ＴＶＥ 有価証券報告書－第26期(2024/10/01－2025/09/30) (docID S100XBK6)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tve: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社TVE」が EDINET の提出者名「株式会社ＴＶＥ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正の状況: 本有報（S100XBK6）は未訂正である（amendments status none、amendmentDocIDs 空、corrections 空、DEIの訂正フラグはすべて false、2026-11-12まで確認）。前期有報との修正再表示チェックは全6系列で差異ゼロだった。
- businessModel: 証拠パックの遡及適用の警告について: 該当箇所は会計方針の変更の注記で、「法人税、住民税及び事業税等に関する会計基準」（企業会計基準第27号）等を第26期の期首から適用し、一部は遡及適用されたものである。有報は当該変更による前連結会計年度の連結財務諸表への影響はないと印字し、前期有報との修正再表示チェックでも全6系列で差異ゼロだったため、登録する指標への影響はないと判断し、financialNotes にはせず warnings に記録した。
- businessModel: 主要な経営指標等の注1（潜在株式が存在しないため潜在株式調整後1株当たり当期純利益を記載していない旨）は表示事項のため financialNotes にはしなかった。financialNotes に入れたのは注2の収益認識基準の適用のみで、適用年度である2023年9月期にひも付けた。
- businessModel: 中期経営計画2023の数値目標（売上高・営業利益を安定的に確保する水準）は、利益の金額と投資指標の目標にあたるため本文・perspectives に書いていない。MD&Aの各利益の金額と増減理由、受注高・受注残高の金額も書いていない。
- businessModel: 重要な後発事象は連結・単体とも「該当事項はありません」であり、提出後の構造的な出来事はない。needsReview は空とした。
- businessModel: Wikipedia は記事が見つからなかったため使用していない（wikipedia.json: found false）。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（バルブ事業6,780百万円、電気設備関連事業1,744百万円、製鋼事業1,465百万円）とし、報告セグメントに含まれない「その他」は最後に置いた。MD&Aの種類別売上高は内部売上高を含む数値のため使わず、セグメント注記の外部顧客への売上高を用いた。
- businessStructure: バルブ事業の収益分解の各行（千円）を単純合計すると6,780,348千円となり、印字の外部顧客への売上高6,780,350千円と2千円異なる（印字の丸め）。各金額は印字どおりに記載し、合計の再計算はしていない。
- businessStructure: 製鋼製造部（三重県伊賀市）の設備行は、主要な設備の状況ではセグメントの名称が「バルブ」と印字されているため（バルブ製品用の鋳鋼部材の製造を含むため）、製鋼事業には結びつけず、どちらの事業の説明にも設備として書かなかった。
- businessStructure: suppliers キーはこのツリーの旧スキーマに無いため省略した。主要な仕入先である日本ギア工業株式会社の事実は relatedCompanies に記録した。
- history: 落とした行: 1999年11月の両社取締役会決議・覚書締結と同年12月の両社株主総会承認は、2000年の株式移転による設立の前提手続のため設立の項目に集約した。2007年8月の株式会社高田製鋼所の清算結了は、2006年の事業承継に付随する子会社清算のため落とした。
- history: 1940年の設立時の資本金額は、規則により沿革に書いていない。
- industry: 主たる業界は、外部顧客への売上高の66.6％を占めるバルブ事業（高温高圧バルブ等の産業用バルブの製造・販売と保守）から machinery を選んだ。直接適合するため暫定分類は使わず、taxonomyGap は記録していない。
- industry: 製鋼事業は産業機械向けの鋳鋼製品であり machinery の範囲内とした。電気設備関連事業は発電所の電気設備工事だが、当社グループの中核はバルブの製造と保守であり、売上もバルブ事業が大半を占めるため construction は付けなかった。その他の地域復興・リファインメタル事業は金額が小さく、独立した業界は付けなかった。
- relatedCompanies: 結ばなかった候補（理由）: kitz＝2016年2月の資本業務提携契約が沿革に印字されるのみで、当期の保有株式の表や事業の内容に現在の取引・提携の記述が無く、過去の提携だけでは結ばない。mitsubishi-corporation＝1940年の前身設立時の旧三菱商事の資本参加と、保有目的が「取引関係の維持強化のため」ながら目的・意義の希薄化により縮減を検討中と印字される定型的な政策保有であり、個別の取引の記述が無い。mitsubishi-heavy-industries・meiwa・nakakita-seisakusho・ihi＝保有目的が全銘柄共通の定型句（取引関係の維持強化、うち meiwa・nakakita-seisakusho・ihi は縮減検討中も併記）だけのため結ばない。mitsubishi-ufj-financial-group＝子会社の三菱UFJ銀行がメインバンクという資金調達の関係（コミットメントライン契約を含む）のため結ばない。ichiyoshi-securities＝金融取引の維持が保有目的で金融機関のため結ばない。west-japan-railway＝保有目的が「地域社会の発展・繁栄のため」で取引関係ではない。the-chugoku-electric-power・shikoku-electric-power・tohoku-electric-power＝MD&Aの市場環境の文脈で原発の再稼働や定期検査工事の完了先として名前が出るだけで、その相手との取引を述べる個別の記述が無く、政策保有株式の表にも無いため結ばない。create＝沿革の共同出資先は福島県いわき市の地元企業であり、候補の上場会社と同一法人の確認が取れない（当該合弁会社自体も2023年に吸収合併で消滅）。toa-6809＝本文の「TOA」は当社グループ自身のブランド名であり、候補のTOA株式会社ではない。en・career・land・port・base-4481・cota・reskill・seki・kel・path・vector・vision・zero・innovation＝一般語や部分文字列の一致のみで、有報にその会社との関係の記述が無い。
- relatedCompanies: 候補に無いため結べなかった相手: 九州電力株式会社＝政策保有株式の保有目的が「当社の主要な取引先であり、継続的な取引関係の維持強化のため」「毎期安定的な売上取引を行っております」と個別化され3,000株を保有するが、related-candidates.json に無いため結ばず warnings に記録した。東京パワーテクノロジー株式会社＝2025年9月期の主要な顧客（売上高の12.2％）だが候補に無いため結ばなかった。ＨＥハルビン・パワー・プラント・バルブ社＝重要な契約等に技術援助契約（抽気逆止弁等）が3件印字されるが、外国の会社で候補に無いため結ばなかった。
- relatedCompanies: 西華産業については、当社が保有していた西華産業株式は当事業年度に全部を売却したが、関係は西華産業側の保有（その他の関係会社）と資本提携・販売取引に基づくものであり、リンクの根拠に影響しない。
- terms: 助言のみ。用語候補: 「クリアランス金属」（原子力発電所の廃止措置で生じ、放射能レベルが基準以下と確認された金属。リファインメタル事業の対象）、「高温高圧弁・安全弁」（当社グループの主力製品）、「定期検査工事」（原子力発電所の定期検査に伴う工事）。いずれも有報の事業の内容・経営方針に印字された語であり、登録は親工程の判断に委ねる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
