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
| `src/lib/storage/` | localStorage（お気に入り・閲覧履歴・設定・通報）を扱う唯一の層 |
| `docs/research-protocol.md` | 企業データの調査・記述手順 |
| `docs/research/` | 企業ごとの調査ログ（全数値の出典とページ） |

作業ルールと不変条件は `CLAUDE.md` を参照。
