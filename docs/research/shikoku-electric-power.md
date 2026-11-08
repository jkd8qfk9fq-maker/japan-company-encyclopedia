# 四国電力 — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 四国電力株式会社 |
| 証券コード | 9507 |
| docID（データを取り出した文書） | `S100YH23` |
| 原本 docID | `S100YH23` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH23.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 四国電力株式会社 / 9507 / docID S100YH23（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shikoku-electric-power: 10 件の数値を有報XBRLと照合
有報: 四国電力株式会社 有価証券報告書－第102期(2025/04/01－2026/03/31) (docID S100YH23)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
shikoku-electric-power: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…電源の安全・安定運転の継続などにより利益を確保しています。2026年3月期の…）
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックは全行一致し、決算期の変更や変則決算もないため、financialNotes は空にした。の注記は株式給付信託（BBT）による1株当たり指標の算定に関するもので、売上高・純利益の系列の見直しではないため注記に入れていない。
- businessModel: 財務目標（経常利益の金額目標・ROE・自己資本比率など）は、利益（売上高・当期純利益以外）と投資の語に関する規則に従い、perspectives には書かなかった。
- businessStructure: 事業の並び順は報告セグメントの外部顧客への売上高（2026年3月期）の大きい順とし、報告セグメントに含まれない「その他」（11,832百万円）は規則どおり最後に置いた。なおセグメント表の見出しでは発電・販売事業と送配電事業が「電気事業」の下に連記されているが、報告セグメントは5区分（発電・販売、送配電、情報通信、エネルギー、建設・エンジニアリング）のため、その単位で事業を立てた。
- businessStructure: listings の market は表紙の印字「東京証券取引所プライム市場」から「プライム」とした。
- businessStructure: Wikipedia の抜粋は本店所在地と販売量の順位のみで、有報の記載と重なるか数値情報のため、エントリーには使わなかった。
- history: 次の行は採らなかった: 1961年 四国企業の設立、1963年 阿南発電所（火力）の営業運転開始、1965年 西条発電所（火力）の営業運転開始、1971年 坂出発電所（火力）の営業運転開始、2003年 四電産業と各県の総合ビジネス会社の合併・四電ビジネスへの商号変更、2004年 STNetとネットウェーブ四国の合併（子会社の設立・商号変更や個別発電所の新設などの細目が中心のため、会社の転機となる出来事を優先した）。
- industry: 主たる業界は、売上の中心である発電・販売事業と送配電事業から energy（エネルギー）とした。
- industry: 情報通信事業は報告セグメントとして金額が独立して開示されている（2026年3月期の外部顧客への売上高40,436百万円）ため、telecommunications を2つ目に付けた。建設・エンジニアリング事業（同24,215百万円）は売上構成が小さいため業界を足さなかった。
- relatedCompanies: en: 社名の断片が「エンジニアリング」などの語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: career: 社名の断片が「キャリア（中途）採用」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: core: 社名の断片が「コア事業」という一般語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: base-4481: 社名の断片が「経常利益ベース」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: seki: 社名の断片が一般語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: the-hyakujushi-bank: に載る銀行（所有割合2.15％、2026年3月31日現在）で、借入金への連帯保証など金融取引の文脈で現れる金融機関であり、資金調達が理由のため結ばなかった。
- relatedCompanies: vision: 社名の断片が「テレビジョン」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: powerx: 特定投資株式の表に載るのみで、保有目的は「新規事業に向けた協力関係構築」という目的の記載だけであり、その相手についての具体的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: sbi-shinsei-bank: グループ会社の借入金に対する連帯保証債務の相手として現れる銀行であり、資金調達の文脈のため結ばなかった。
- relatedCompanies: atrae: 人材施策の説明でエンゲージメントサーベイの提供元として名前が挙がるのみで、取引・提携の関係性を述べる記載がないため結ばなかった。
- relatedCompanies: electric-power-development: 経営方針の中で「新規電源開発」など電源開発一般を述べる文脈に社名が現れるだけで、当社との取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: innovation: 社名の断片が「イノベーション」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: rent: 社名の断片が「タレントマネジメント」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: the-lead: 社名の断片が「DXをリード」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: freee: 社名の断片が「フリーキャッシュ・フロー」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: marubeni: 坂出バイオマス発電事業に関する保証債務の注記に現れるのみで、燃料売買契約の当事者は当社グループの事業会社であり、当社自身と丸紅との取引・提携の直接の記載がないため結ばなかった（ambiguous）。
- relatedCompanies: port: 社名の断片が関連会社の名称の一部などに一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: tear: 社名の断片が一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: the-japan-steel-works: 特定投資株式の表に載るのみで、保有目的は「安定的な原子力発電所主要部材の調達」という目的の記載だけであり、その相手についての具体的な取引の記載がないため結ばなかった。
- relatedCompanies: cube: 社名の断片が連絡場所の建物名「グランキューブ」に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: hikari-tsushin: 社名の断片が「光通信サービス」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: idea-consultants: 社名の断片が一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: ishin: 社名の断片が一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: rix: 社名の断片が「スキル・マトリックス」という一般語に一致したもので、会社としての記載はないため結ばなかった。
- relatedCompanies: trust: 候補の listing が上場でない（信託銀行の信託口の名称の一部への一致）ため結ばなかった。
- relatedCompanies: zero: 社名の断片が「ゼロエミッション」という一般語に一致したもので、会社としての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: 候補外のため検討していないが、には事業会社の株式会社伊予鉄グループ（8.72％）と住友共同電力株式会社（3.43％）が載る。いずれも related-candidates.json に含まれていないため、規則により関連企業には選んでいない。伊予銀行・百十四銀行・日本生命保険・明治安田生命保険は金融機関のため、仮に候補でも結ばない対象である。
- terms: 助言: 「一般送配電事業」は用語集に未登録です。送配電網を運営し、託送供給などを行う事業で、この会社の送配電事業そのものを指す中心用語のため、登録候補になります。
- terms: 助言: 「託送」も未登録です。他の電気事業者が送配電網を使って電気を送る仕組みで、送配電事業の収益の中心であり、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
