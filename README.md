# 日本企業百科事典

日本の上場企業を、会社名ではなく「何をしている会社なのか」から理解するための企業百科事典。

- 最重要KPI: 企業ページを約3秒見ただけで、その会社が何をしているか説明できること
- 最重要コンポーネント: 企業ごとの事業構造図（`src/components/company/business-structure.tsx`）
- 投資判断サービスではありません。株価・PER・PBRなどは扱いません。

## 開発

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # データ整合性テストを含む
npm run typecheck
npm run build
```

## 構成

| パス | 役割 |
|---|---|
| `src/data/` | 企業・業界・用語・特集の静的データ（一次ソースに基づく） |
| `src/lib/repositories/` | コンテンツを読む唯一の入口。将来DBに移行しても画面側は変わらない |
| `src/lib/storage/` | localStorage（お気に入り・閲覧履歴・設定）を扱う唯一の層 |
| `src/lib/reports/` | 読者の報告の保存（Postgres、開発中はファイル） |
| `src/lib/admin/` | 管理画面のパスワード認証とセッション |
| `docs/research-protocol.md` | 企業データの調査・記述手順 |
| `docs/research/` | 企業ごとの調査ログ（全数値の出典とページ） |

## 報告と管理画面の準備

読者からの「誤りの報告」はサーバーに保存され、管理画面（`/admin`）でだけ読めます。

1. `.env.example` を `.env.local` にコピーする
2. `npm run admin:hash-password` を実行し、表示された2行を `.env.local` に貼る
3. 公開環境では Postgres（Neon の無料プランなど）を用意して `DATABASE_URL` を設定し、`npm run db:migrate` を一度実行する
   （開発中は未設定のままでよく、報告は `.data/content-reports.json` に保存されます）

設定が足りない場合、管理画面は開かず、報告フォームは送信を受け付けません（誤って「届いた」と表示しないため）。

作業ルールと不変条件は `CLAUDE.md` を参照。
