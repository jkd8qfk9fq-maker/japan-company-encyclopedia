# 第一実業 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 第一実業株式会社 |
| 証券コード | 8059 |
| docID（データを取り出した文書） | `S100YGOV` |
| 原本 docID | `S100YGOV` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-07 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGOV.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E7%AC%AC%E4%B8%80%E5%AE%9F%E6%A5%AD

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 第一実業株式会社 / 8059 / docID S100YGOV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 37 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daiichi-jitsugyo: 10 件の数値を有報XBRLと照合
有報: 第一実業株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YGOV)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daiichi-jitsugyo: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: パックの「財務諸表の組替え」の警告は、【関連情報】の地域別情報で「インド」を「アジア」から独立掲記した表示方法の変更に伴い、前期の地域別数値を組み替えたものであり、5年系列の経営指標やセグメント数値に影響する会計基準・表示の変更ではない。修正再表示チェックも前期有報と全行一致しているため、financialNotesには入れなかった。
- businessModel: 重要な後発事象として、2026年5月12日の取締役会で自己株式の取得（上限50万株・取得価額の総額20億円、取得期間は2026年5月13日から9月30日まで、東京証券取引所における市場買付）が決議されている。有報内に開示された通常の資本政策であり、グループ構成の変更ではないため、needsReviewには入れず本文にも書かなかった。
- businessModel: 中期経営計画「MT2027」と成長戦略「V2030」の数値目標のうち、営業利益とROEの目標は文章の規則により書かず、売上高の目標のみを引用した。
- businessModel: 前期に主要な顧客として開示されたパナソニックエナジー株式会社（前期売上高28,587百万円、エナジーソリューションズ事業）は関連企業の候補にない。当期は外部顧客への売上高の10％以上を占める相手先はないとされている。
- businessModel: Wikipediaは「独立系の専門商社」という補足（有報に書かれていない位置づけの説明）にのみ使い、数値は使っていない。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順とした（エレクトロニクス51,073百万円→自動車42,508→エナジーソリューションズ40,044→産業機械27,210→ヘルスケア23,826→プラント・エネルギー22,415→航空・インフラ11,990）。「その他」（71百万円）は報告セグメントに含まれない区分のため最後に置いた。
- businessStructure: 金額はセグメント注記の外部顧客への売上高の印字どおりとし、セグメント利益は書いていない。設備の状況は本社管轄等が複数セグメントにまたがるため、特定の事業には結びつけなかった。
- history: 【沿革】は年月と事象が同じ行に印字された表のため、行の順に年と事象を対応づけた。主要な出来事14件を採用し、国内の出張所・支店の開設（大阪・名古屋・広島・北九州・仙台・富山）、海外事務所の開設や現地法人の設立の細目（台湾、シンガポール、クアラルンプール、香港、上海、シカゴ、マニラ、ジャカルタ、フランクフルト、プラハ、ソウル、広州、ブダペスト、ハノイ、デリー、ソフィア）、D.S.T.センターの竣工などは落とした。設立時等の資本金の金額は文章の規則により書いていない。
- industry: 東証の業種分類は卸売業で、7つの報告セグメントはいずれも機械・器具・部品の販売事業であり、売上の大半を商社機能が占めるため trading（商社）を主たる業界とした。電池製造設備や電子関連設備の販売を含むが、半導体向けの事業として独立して開示された区分はないため semiconductors は付けなかった。一部の子会社は製造も行うが、報告セグメント単位では販売事業のため machinery も付けなかった。
- relatedCompanies: hikari-tsushin: 【関係会社の状況】の区分が「その他の関係会社」のため other-affiliated-company とした。【大株主の状況】に載るのは同社やその関係組合であり、同社自体の直接保有ではないことは説明に明記した。
- relatedCompanies: nittoku: サステナビリティ開示にインド合弁会社の設立と巻線機のインド販売権の獲得が相手固有の事実として印字されているため business-partner とした。
- relatedCompanies: 顧客とした10社（信越化学工業、小野薬品工業、北越コーポレーション、イビデン、日本触媒、シークス、三光合成、ダイト、天昇電気工業、メニコン）は、【株式の保有状況】の保有目的に相手固有の設備取引が印字され、相手が当社の販売する製造設備を使う事業会社であるため customer とした。
- relatedCompanies: takuma: 【株式の保有状況】に発電関連設備の取引が印字されているが、同社も発電関連設備の製造を手がけるため向きを特定せず business-partner とした。
- relatedCompanies: kawasaki-heavy-industries: プラント関連設備の取引が印字されているが、同社もプラント関連設備を手がけるため向きを特定せず business-partner とした。
- relatedCompanies: noritake: リチウムイオン電池製造関連設備の取引が印字されているが、同社も工業用機器を手がけるため向きを特定せず business-partner とした。
- relatedCompanies: kawata-mfg / mitsubishi-kakoki-kaisha: 保有目的に「仕入先です」と印字されているため supplier とした。
- relatedCompanies: en: 一致はエンゲージメント等の語の断片で、有報に同社との取引・提携の記載がないため結ばなかった。
- relatedCompanies: port: 一致は事業ポートフォリオ等の語の断片で、関係の記載がないため結ばなかった。
- relatedCompanies: will: 一致は連結子会社「第一実業ビスウィル株式会社」の社名の一部で、自社グループ会社であり株式会社ウィルとは別会社であるため結ばなかった。
- relatedCompanies: base-4481: 一致はベースアップ等の語の断片で、関係の記載がないため結ばなかった。
- relatedCompanies: aeon: 一致は「リチウムイオン電池」の「イオン」で、イオン株式会社との関係の記載がないため結ばなかった。
- relatedCompanies: seki: 一致はセキュリティ等の語の断片で、関係の記載がないため結ばなかった。
- relatedCompanies: career: 一致はキャリア形成・キャリアパス等の語の断片で、関係の記載がないため結ばなかった。
- relatedCompanies: nissin: コードリストにない上、有報に同社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: cota: 有報に同社との取引・提携・資本関係の記載が確認できず、語の断片一致のみのため結ばなかった。
- relatedCompanies: innovation: 一致は「DXでのイノベーションと競争力強化」という戦略の語で、関係の記載がないため結ばなかった。
- relatedCompanies: step: 語の断片一致のみで、有報に同社との関係の記載がないため結ばなかった。
- relatedCompanies: cover: 一致はシナリオ分析の「事業本部カバー率」の「カバー」で、関係の記載がないため結ばなかった。
- relatedCompanies: ishin: 語の断片一致のみで、有報に同社との関係の記載がないため結ばなかった。
- relatedCompanies: trust: コードリストになく、一致は日本マスタートラスト信託銀行（信託口）の信託口名義であるため結ばなかった。
- relatedCompanies: vision: 一致は経営理念の「Vision」表記と、子会社の旧社名「カネボウビジョンシステム」の名称で、株式会社ビジョンとの関係の記載がないため結ばなかった。
- relatedCompanies: zero: 語の断片一致のみで、有報に同社との取引・提携の記載がないため結ばなかった。
- relatedCompanies: ftgroup: コードリストにない。注記では光通信が投資事業有限責任組合を通じて間接保有する経路の一つとして名前が挙がるのみで、同社自体との取引・資本関係の記載がないため結ばなかった。
- relatedCompanies: japan-petroleum-exploration: 特定投資株式で前期は200,000株を保有していたが、当期に全て売却し2026年3月31日時点で保有しておらず、現在の関係の記載がないため結ばなかった。
- relatedCompanies: kohsoku: 一致は「超高速」等の語の断片で、関係の記載がないため結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group: 特定投資株式の保有目的が株式会社三菱UFJ銀行との資金借入等の銀行取引であり、銀行は資金調達が理由なら結ばない規則により結ばなかった。
- relatedCompanies: mizuho-financial-group: 特定投資株式の保有目的が株式会社みずほ銀行との資金借入等の銀行取引であり、同規則により結ばなかった。
- relatedCompanies: nagoya-electric-works: 特定投資株式で前期は237,000株を保有していたが、当期に全て売却し2026年3月31日時点で保有しておらず、現在の関係の記載がないため結ばなかった。
- relatedCompanies: path: 一致はキャリアパス等の語の断片で、関係の記載がないため結ばなかった。
- relatedCompanies: ray: 一致はリプレイス等の語の断片で、関係の記載がないため結ばなかった。
- relatedCompanies: ricoh: 有報に同社との取引・提携・資本関係の記載が確認できず、語の断片一致のみのため結ばなかった。
- relatedCompanies: rohm: 一致は関連会社の旧社名「第一アールストローム株式会社」であり、ローム株式会社とは別会社であるため結ばなかった。
- relatedCompanies: sompo-holdings: 特定投資株式の保有目的が損害保険ジャパン株式会社との保険取引であり、保険会社は保険取引が理由なら結ばない規則により結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group: 特定投資株式の保有目的が株式会社三井住友銀行との資金借入等の銀行取引であり、同規則により結ばなかった。
- relatedCompanies: toyo-innovex: 特定投資株式に自動車製造関連設備の仕入先として記載があるが、コードリストにないため結ばなかった。
- relatedCompanies: 候補にない相手: 株式会社浅野研究所は持分法適用関連会社（議決権38.05％）だが非上場で候補にない。第一スルザー株式会社は持分法非適用関連会社で候補にない。Agro Ludens株式会社とタイのESG Chemicals Co., Ltd.はサステナビリティ開示に共同開発・出資の取組が記載されるが候補にない。
- terms: 助言: 「エンジニアリング商社」は用語集に未登録です。商社機能に設計・調達・建設などのエンジニアリング機能を組み合わせた業態を指し、同社が「次世代型エンジニアリング商社」を目指す姿として掲げる中核用語のため、登録候補になります。
- terms: 助言: 「ESCO事業」も未登録です。省エネルギー改修の費用を光熱費の削減分でまかなう事業を指し、同社の注記にESCO事業（コジェネレーション事業）用資産の記載があるため、登録候補になります。
- terms: 助言: 「特定投資株式」も未登録です。政策保有株式の開示区分を指す用語で、関連企業の判断材料になるため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
