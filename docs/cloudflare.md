# Cloudflare で無料の URL に公開する

公開ページを静的なサイトとして書き出し（`npm run build:static`）、Cloudflare に載せる。管理画面・誤りの報告フォーム・オフライン機能は含まれない
（それらはサーバーが要る。全機能の本番は別のサーバー実行の構成）。無料の範囲で動き、URL の最初の部分に **nihonkigyohyakka** が入る。

## 起きていたエラーの原因

| 表示 | 原因 | 直し方 |
|---|---|---|
| `Failed to collect page data for /_not-found`（`Failed to collect configuration for /robots.txt`） | 本番ビルドは、公開 URL の環境変数 **`SITE_URL` が無いと意図して失敗する**（canonical・サイトマップが localhost を指すのを防ぐため。`src/lib/site.ts`）。Cloudflare のビルドには `SITE_URL` が無い。どのページから失敗するかは順序の問題で、`/_not-found` とは関係ない | ビルドの環境変数に `SITE_URL` を設定する（下記）。ビルドコマンドは `npm run build:static` |
| `content-store.ts` のファイル検索パターンが 16,134 ファイルに一致する | 警告。管理画面のエディタ（ローカル専用）が `src/data` を動的に読むため。静的書き出しには管理画面が含まれないので、この警告は出ない | 対応不要 |
| `npx wrangler deploy` で何も載らない | 通常の `npm run build` の出力（`.next`）は Workers の静的アセットではなく、Next.js のサーバー実行が要る。`wrangler.jsonc` もなかった | `wrangler.jsonc`（`./out` を配信）を追加した |

## 設定（Workers：`*.workers.dev`）

Cloudflare ダッシュボード → Workers & Pages → Create → **Import a repository**（GitHub）→ このリポジトリを選ぶ。

| 項目 | 値 |
|---|---|
| Worker の名前（Project name） | **`nihonkigyohyakka`**（`wrangler.jsonc` の `name` と**一致させる**。違うとデプロイが「名前が違う」で失敗する） |
| Build command | `npm run build:static` |
| Deploy command | `npx wrangler deploy` |
| 環境変数（Build の Variables） | `SITE_URL` = `https://nihonkigyohyakka.<あなたのアカウントのサブドメイン>.workers.dev`<br>`NODE_VERSION` = `22`（または `24`） |

- 公開 URL は **`https://nihonkigyohyakka.<アカウントのサブドメイン>.workers.dev`**。`<アカウントのサブドメイン>` は Cloudflare のアカウントで決まる部分で（Workers & Pages → 右の「Account subdomain」）、リポジトリでは変えられない。
- `SITE_URL` は最初のデプロイの後に正確な URL が分かるので、**一度目は仮でよい**（未設定でも `build:static` は仮の値で動き、警告を出す）。正しい値を設定して再デプロイすると、サイトマップと共有リンクが正しくなる。
- 前に作った Worker が別の名前なら、その Worker は使わず、上の名前で**新しく作る**（または `wrangler.jsonc` の `name` を既存の名前に合わせる。ただし URL に nihonkigyohyakka は入らない）。

## 設定（Pages：`nihonkigyohyakka.pages.dev`）

`nihonkigyohyakka.pages.dev` という**サブドメインなしの URL**がよければ Pages を使う。Workers & Pages → Create → **Pages** → Connect to Git。

| 項目 | 値 |
|---|---|
| Project name | `nihonkigyohyakka`（他の人が使っていれば使えない。その場合は `nihonkigyohyakka-jp` など） |
| Build command | `npm run build:static` |
| Build output directory | `out` |
| 環境変数 | `SITE_URL` = `https://nihonkigyohyakka.pages.dev`、`NODE_VERSION` = `22` |

Pages には Deploy command がない（出力ディレクトリを配信する）。`wrangler.jsonc` は Workers 用で、Pages では使われない。

## ビルドが何をするか

`npm run build:static`（`scripts/build-static.mjs`）は、プロジェクトの**複製**から管理画面と報告フォームを除いて `PAGES_EXPORT=1` で `next build --webpack` を実行し、`out/` に書き出す。作業ツリーは削除も編集もしない（管理画面は本物のコードで、未コミットの部分もありうるため）。`out/_headers` にセキュリティヘッダを書く。ローカルで試すには:

```
SITE_URL=https://nihonkigyohyakka.example.workers.dev npm run build:static
npx wrangler deploy --dry-run      # 設定と配信ファイルの検証だけ（ログイン・アップロードなし）
```

## 制約

- 公開されるのは「公開」の企業だけ（JCE-018 の公開ライン）。要確認・数値のみの企業はページがない。
- 「誤りを報告」のリンクは、静的な書き出しでは行き先がない（フォームはサーバーが要る）。
- 内容を更新するには、リポジトリに push する（Cloudflare が自動で再ビルド・再デプロイ）。
- ビルドにはメモリを使う（ビルドの並列度を 2 に絞ってある）。無料のビルドで失敗する場合は、ビルド時間・メモリの制限を確認する。
