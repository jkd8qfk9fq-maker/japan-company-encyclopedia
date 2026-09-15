/**
 * Applies db/migrations/*.sql to DATABASE_URL, in file-name order, once each.
 *
 *   DATABASE_URL=postgres://… npm run db:migrate
 *
 * Applied migrations are recorded in schema_migrations, so re-running is safe.
 * Each migration runs in its own transaction: a failing file leaves nothing
 * half-applied. There is no "down": undoing a migration against a database
 * holding readers' reports is a decision, not a script.
 */
import { readdir, readFile } from "node:fs/promises";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL が設定されていません。");
  process.exit(1);
}

const dir = new URL("../db/migrations/", import.meta.url);
const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  await client.query("create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())");
  const { rows } = await client.query("select name from schema_migrations");
  const applied = new Set(rows.map((r) => r.name));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip   ${file}`);
      continue;
    }
    const sql = await readFile(new URL(file, dir), "utf8");
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into schema_migrations (name) values ($1)", [file]);
      await client.query("commit");
      console.log(`apply  ${file}`);
    } catch (error) {
      await client.query("rollback");
      throw error;
    }
  }
} finally {
  await client.end();
}
