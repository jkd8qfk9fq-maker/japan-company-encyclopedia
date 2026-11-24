# 管理アプリ（admin.kigyo-hyakka.com）

運営者がスマホやPCのブラウザから、掲載内容（企業・用語）を直すための画面（JCE-109）。**本番のデータを直接書き換えない**：保存すると、内容と変更記録（Revision）を1つのコミットにしたプルリクエストが GitHub にでき、テスト（`tests/data-integrity.test.ts` ほか）が通ったあと運営者がマージすると公開される。検査は手元の管理画面と同じ `src/lib/content/content-edit.ts`。

## ログイン（2026-11-24 から Cloudflare Access）

admin.kigyo-hyakka.com を開くと Cloudflare Access の画面になり、許可されたメールアドレスを入れると Cloudflare が6桁のコードを送る。コードを入れると管理画面が開く（24時間有効）。許可は Zero Trust → Access → Applications「百科事典 管理」のポリシー「運営者」と、Worker のシークレット `ADMIN_EMAILS` の両方にあるアドレスだけ。Worker は Access の署名付きトークン（Cf-Access-Jwt-Assertion）を検証し、このアプリ宛て（AUD）・期限内・許可アドレスのときだけ通す。

Resend でのメールリンク方式は、Access を設定していないとき（`ACCESS_TEAM_DOMAIN`・`ACCESS_AUD` が空）だけ使われる予備。2026-11-24 の初回は、設定された Resend キーのアカウントで kigyo-hyakka.com が未認証だったため送信できなかった（403 domain is not verified）。

## 最初の設定（運営者、1回だけ）

Cloudflare のダッシュボード → Workers & Pages → **kigyo-admin** → 設定 → 変数とシークレット に、種類「シークレット」で3つ追加する。値はチャットやリポジトリに書かない。

| 名前 | 値 |
|---|---|
| `ADMIN_EMAILS` | ログインできるメールアドレス。複数はカンマ区切り |
| `GITHUB_TOKEN` | GitHub の Fine-grained トークン。Repository access は `japan-company-encyclopedia` だけ、Permissions は Contents: Read and write、Pull requests: Read and write |
| `RESEND_API_KEY` | （予備）Access を使わない場合だけ。ログイン用メールを送る Resend の API キー。kigyo-hyakka.com を認証済みのアカウントのもの |

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

## 権限（2026-11-24 再設計 第3段階）

| 権限 | シークレット | できること |
|---|---|---|
| 閲覧 | `VIEWER_EMAILS` | すべての画面を見る。何も変えられない |
| 編集 | `ADMIN_EMAILS` | 企業・用語を直してプルリクエストを作る |
| 承認 | `APPROVER_EMAILS` | 編集に加え、テストが通ったプルリクエストを「承認管理」からマージする |

複数のアドレスはカンマ区切り。新しい人を入れるときは、そのアドレスを Cloudflare Zero Trust → Access → Applications「百科事典 管理」のポリシーにも足す（両方にある人だけが入れる）。

## プルリクエストのテスト

main 向けのプルリクエストには、GitHub Actions の `PR checks`（`.github/workflows/pr-checks.yml`：型チェック・lint・全テスト）が自動で走る。承認管理はその結果を読み、成功・main と食い違いなし・下書きでない、のときだけ「承認してマージする」を出す。マージ直前にもう一度確かめ、確認した後に更新されていたらマージしない。マージは squash で、コミットに「管理画面で承認してマージ」と承認者（伏せ字）・時刻を残す。
