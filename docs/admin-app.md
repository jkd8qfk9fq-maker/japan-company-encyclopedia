# 管理アプリ（admin.kigyo-hyakka.com）

運営者がスマホやPCのブラウザから、掲載内容（企業・用語）を直すための画面（JCE-109）。**本番のデータを直接書き換えない**：保存すると、内容と変更記録（Revision）を1つのコミットにしたプルリクエストが GitHub にでき、テスト（`tests/data-integrity.test.ts` ほか）が通ったあと運営者がマージすると公開される。検査は手元の管理画面と同じ `src/lib/content/content-edit.ts`。

## 最初の設定（運営者、1回だけ）

Cloudflare のダッシュボード → Workers & Pages → **kigyo-admin** → 設定 → 変数とシークレット に、種類「シークレット」で3つ追加する。値はチャットやリポジトリに書かない。

| 名前 | 値 |
|---|---|
| `ADMIN_EMAILS` | ログインできるメールアドレス。複数はカンマ区切り |
| `GITHUB_TOKEN` | GitHub の Fine-grained トークン。Repository access は `japan-company-encyclopedia` だけ、Permissions は Contents: Read and write、Pull requests: Read and write |
| `RESEND_API_KEY` | ログイン用メールを送る Resend の API キー（百科事典のメール通知と同じアカウントでよい。送信元 admin@kigyo-hyakka.com） |

GitHub のトークンは github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token で作る。期限が来たら作り直して `GITHUB_TOKEN` を差し替える（全員がログアウトされる）。

## 使い方

1. https://admin.kigyo-hyakka.com を開き、メールアドレスを入れる → 届いたリンク（15分有効）を開く。12時間ログインが続く
2. 「企業を直す」で社名・証券コード・id から探す、または「用語集」から選ぶ
3. JSON を直し、「確認する」でスキーマ・整合性の検査と変わる項目を見る
4. 変更の要約と理由・根拠（出典や報告）を書いて「プルリクエストを作る」
5. GitHub でテストが通ったのを見てマージ → 公開の配信が自動で走る

出典のない事実は書かない（CLAUDE.md 不変条件 1・2）。出典を消すときは、確認のチェックが要る。

## 仕組み

- 配置：`admin-app/`（Cloudflare Worker `kigyo-admin`。Workers Builds が main への push で配信）。サイト本体（静的書き出し）とは別の Worker
- ログイン：メールのリンク。署名の鍵は `GITHUB_TOKEN` と `ADMIN_EMAILS` から作るので、どちらかを変えると全員ログアウトされる。登録外のアドレスにも同じ応答を返し、誰が運営者かを明かさない。IPごとに1分5回まで
- 書き込み：main から `admin/<Revision id>` のブランチを作り、1コミットでプルリクエストを作るだけ。マージは運営者
