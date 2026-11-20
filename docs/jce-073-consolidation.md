# JCE-073 統合メモ — 2つのレポート実装を1つにする（2026-11-19 時点の実測）

JCE-073（プレミアム企業レポート）は Muse と Claude Code が並行して実装し、2系統が存在する。
どちらも不変条件（株価・バリュエーション・信用評点なし）は守っている。統合の土台は Muse 版
（計算指標レイヤーが決定文の中核）とし、Claude 版の印刷まわりと監査修正を取り込む方針を運営者へ推奨済み。

## 実測した各系統の姿

### Muse 版（ブランチ feature/jce-071-072、コミット ac3697d1、本メモと同じブランチ）
- ルート: `/companies/[company-id]/report`（全公開企業を事前生成、未公開は404、noindex）
- `src/lib/report-metrics.ts`: 計算指標レイヤー10指標（純利益率／利益率／自己資本比率／総資産回転率／
  従業員1人あたり売上高・純利益／海外売上高比率／前期比／5期の伸び）。各指標に業界の中央値・四分位・
  順位・パーセンタイルを併記し、「計算値」と計算式・年度・出典IDを明示。ROE・ROA は不変条件4で禁止のため除外
- `src/lib/industry-figures.ts` に `quantile` を追加（/compare 拡張が再利用可能）
- 印刷: `company-report.module.css` の `@page` A4 ＋ globals.css の印刷時 chrome 非表示
- プレミアム: 既存 PremiumGate の流儀で出し分け
- 検証: トヨタ純利益率（7.6%、中央値3.4%、18位/122社）を公開企業2,993社から Python で独立再計算し完全一致。
  スクリーンショット目視は VM の制約で未実施（実描画HTML＋CSS＋再計算で代替）

### Claude 版（ブランチ claude/jce-073-report、PR#33）
- ルートは作らず、企業ページ内の「レポート」タブ／節として表示（company-view.tsx → company-report.tsx）
- `src/lib/company-report.ts`: 決算短信・四半期・有報の最新年度をまとめる生成層（計算指標の業界統計は持たない）
- 印刷: 印刷ボタン＋globals.css の印刷規則。実機相当の印刷QAで10件のPDFに内容が出ることを確認済み
- 監査で直した実バグ（この系統の作業中に発見・修正）: ダークモードで印刷が白紙、A4幅超過（トヨタの表）、
  スマホで表の1列目固定と見出しの読み上げ対応
- PR#33 のパネルに「CI: 2件のチェックが失敗中」の表示があった（ローカルでは tsc/build/test 59,302件通過と報告）。
  CI 失敗の内訳は未確認 — 統合前に必ず確認する
- このブランチは feature/jce-071-072 の JCE-071 までと、main の #32/#34〜#37 を取り込み済み。
  JCE-072（/learn）と Muse 版 JCE-073 は含まない

### 衝突するファイル（統合時に手作業が要る）
- `src/components/company/company-report.tsx`（両方に同名・別実装）
- `src/components/company/report-print-button.tsx`（同名）
- `src/components/company/company-view.tsx`（両方が導線／タブを追加）
- `src/app/globals.css`（両方が印刷規則を追加）

## 統合の手順（推奨）
1. 土台は feature/jce-071-072（JCE-071/072/073-Muse が揃っている）。main の最新（#37 まで）を先に取り込む
2. レポートの置き場は Muse 版の独立ルート `/companies/[id]/report` を正とし、Claude 版のタブ表示は
   「レポートへの導線」として企業ページに残すかは運営者判断（独立ルート＋導線カードが Muse 版の現行形）
3. Claude 版から取り込む: 印刷QAの修正一式（ダークモード白紙・A4幅・余白）、スマホ表の1列目固定、
   company-report.ts の「最新年度まとめ」のうち Muse 版に無い要素（短信・四半期の最新まとめ表示）
4. PR#33 の CI 失敗2件の内訳を確認し、原因がレポート実装側なら統合時に直す
5. 統合後はテスト全件＋印刷確認（複数業種）を通し、PR を1本にして main へ

## 統合の実施結果（2026-11-20、Muse 側で実施）

推奨手順どおりに統合した。土台は feature/jce-071-072（Muse 版レポート＝独立ルート）、最新 main
（#42 まで：#34 給与訂正・#40〜#42 JCE-074・#41 フジ日本）を取り込んだうえで、Claude 版の修正を移植した。

- main マージ（d993011c）: 競合は JCE-074 の add/add 2件（feature-articles.ts／features.test.ts）のみで、
  main 版（特集6本）を採用。マージ後の対 main 差分は 071/072/073 の30ファイルのみ。回帰確認：
  フジ日本 給与 8,759,000・出典 S100YGKQ、PR#34 の10社は全社 main とバイト一致。
- JCE-071 summary 監査修正の所在：Claude 版 2b097791 は Muse 版 f7cf2b55 と全7ファイル同一内容で、
  追加の監査修正は ff773d7e（行名の短縮 shortRevenueLabel と純利益表記）の1コミットのみ。全リモート
  ブランチを走査し、他の summary 修正は存在しないことを確認して cherry-pick した（17db3b44）。
- レポート監査修正（Claude bca16ef0）を report-metrics.ts へ移植：利益行を意味で読む profitLineKind
  （経常／税引前／営業）で同種の会社だけで分布を作り（赤字表記の会社が同行の仲間から落ちない）、
  題は「経常利益率」等に。比較対象は最新期が自社と400日以内の会社に限り（PEER_WINDOW_DAYS）、
  画面に「掲載N社のうち最新期が1年以内に終わるM社」と注記する。トヨタで実測：税引前利益率 10.2%、
  分布は税引前を印字する21社（従来は全122社に混在）、純利益率 7.6%・中央値 3.4%・18位/122社（従来の検証値と一致）。
- 印刷修正（Claude ae387ada）を移植：印刷ボタンが印刷中だけ .dark を外して復帰させる（ダークモード白紙の解消）。
  CSS モジュールに、横スクロール表の overflow 可視化・表幅100%・セル余白の圧縮・行の途中改ページ禁止・
  sticky の静的化を追加。Claude 版の「本体直下への複製」方式は採らない：Muse 版は独立ルートで、
  chrome 非表示は body:has(.company-report) で header/footer/nav のみに効く単純な規則であり、
  白紙化した :not(:has()) の反転規則は使っていないため。
- スマホ・読み上げ（Claude 3668caeb）を移植：両表に sr-only の caption と scope、1列目を sticky の
  行見出し（th scope="row"）にし、「表は横にスクロールできます」を sm 未満で表示。
- 移植しなかったもの：メモ手順3の「短信・四半期の最新まとめ表示」は Claude 版の company-report.ts／
  company-report.tsx の実物に存在しなかった（四半期の節は企業ページ本体のもので両系統共通）。
  Claude 版 metrics の印字値2行（売上高・平均年間給与の位置）も移植指定の範囲外として見送った。
- PR#33 の CI 失敗2件の内訳：どちらも Cloudflare Workers Builds のチェックで、開始と同秒に failure で
  終わる（#37・#40・#41 等のマージ済み PR と同型）。コード側の CI（tsc／テスト）は PR には付いておらず、
  レポート実装が原因の失敗ではない。
- ゲート：tsc exit 0、eslint exit 0、vitest 全件 59,514件通過（data-integrity 58,643件を含む）。
  ただしこの VM では既定の5秒タイムアウトとヒープ不足で重いスイートが落ちるため、検証は
  NODE_OPTIONS=--max-old-space-size=5120 と --testTimeout=120000 で実施（タイムアウトのみの失敗が
  消えることを個別再実行でも確認）。dev サーバー（webpack）で /learn・/companies/toyota/report・
  /features・特集記事の描画を確認した。本番ビルドは従来どおりこの VM では完走しない。

## 既に main へ入った監査修正（Claude の品質方針対応、2026-11-19）
- #34 平均年間給与の単位誤り10件を有報の印字で訂正（creal 等、1,000倍ずれ）
- #35 財務の行名に混入した表見出しを5社から除去＋再発防止テスト
- #36 公式サイトの出典切れ21件を修正＋整合性テスト
- #37 金額表示: 1億〜10億円は万まで出す（formatYen の丸め修正）
- JCE-071 summary の監査修正4件（ラベル表記ほか）も Claude 側で実施済みと報告あり — どのブランチに入ったかは要確認
