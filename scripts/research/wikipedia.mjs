#!/usr/bin/env node
/**
 * Wikipedia（日本語版）の読み取り CLI。結果は JSON で stdout に出す。何も登録・保存しない。
 *
 *   node scripts/research/wikipedia.mjs search "トヨタ自動車" ["ソニーグループ" …] [--limit 5]
 *   node scripts/research/wikipedia.mjs article --title "トヨタ自動車" [--intro]
 *   node scripts/research/wikipedia.mjs article --page-id 12345 [--intro]
 *
 * Wikipedia は出典にできない（CLAUDE.md 不変条件 3）。ここで得た内容は調査の手がかり止まり。
 * `.ts` を直接 import している（Node の型ストリップ）ので Node 22.18 以降が要る。
 */

import { fetchWikipediaArticle, searchWikipedia, WikipediaError } from "../../src/lib/wikipedia/client.ts";

// 複数語を検索するときの間隔。API に連続アクセスしない。
const PAUSE_BETWEEN_REQUESTS_MS = 1000;

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positional.push(arg);
    } else if (arg === "--intro") {
      flags.intro = true;
    } else {
      flags[arg.slice(2)] = argv[++i];
    }
  }
  return { positional, flags };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { positional, flags } = parseArgs(rest);

  if (command === "search") {
    if (positional.length === 0) fail('使い方: search "<企業名>" [...] [--limit N]');
    const limit = flags.limit === undefined ? undefined : Number(flags.limit);
    if (limit !== undefined && !Number.isFinite(limit)) fail("--limit は数値で指定する");
    const results = [];
    for (const [index, query] of positional.entries()) {
      if (index > 0) await new Promise((resolve) => setTimeout(resolve, PAUSE_BETWEEN_REQUESTS_MS));
      results.push({ query, hits: await searchWikipedia(query, { limit }) });
    }
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  if (command === "article") {
    const intro = flags.intro === true;
    let target;
    if (flags.title) target = { title: flags.title, intro };
    else if (flags["page-id"]) target = { pageId: Number(flags["page-id"]), intro };
    else fail("使い方: article --title <記事名> | --page-id <ID> [--intro]");
    const article = await fetchWikipediaArticle(target);
    console.log(JSON.stringify(article, null, 2)); // 存在しなければ null
    return;
  }

  fail("使い方: search | article（詳細はファイル先頭のコメント）");
}

main().catch((error) => {
  if (error instanceof WikipediaError) fail(`[${error.kind}] ${error.message}`);
  throw error;
});
